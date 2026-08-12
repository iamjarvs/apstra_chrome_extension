const API_ROOT = "/api";
const TOKEN_STORE_KEY = "tokensByOrigin";
const PROBE_TTL_MS = 30_000;
const DEFAULT_PAGE_SIZE = 200;
const MAX_PAGINATION_PAGES = 25;

const tokenCache = new Map();
const probeCache = new Map();

let initPromise = hydrateTokenCache();
let persistTimer = null;

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (!details.url || !details.url.includes(`${API_ROOT}/`)) {
      return;
    }

    const token = extractBearerToken(details.requestHeaders || []);
    const authHeaders = extractAuthHeaders(details.requestHeaders || []);
    const hasAuthHeaders = hasStrongAuthHeaders(authHeaders);

    if (!token && !hasAuthHeaders) {
      return;
    }

    const origin = getOrigin(details.url);
    if (!origin) {
      return;
    }

    const existing = tokenCache.get(origin) || {
      token: null,
      seenAt: 0,
      authHeaders: {}
    };
    const seenAt = Date.now();

    const next = {
      token: token || existing.token || null,
      seenAt,
      authHeaders: hasAuthHeaders
        ? mergeHeaderMaps(existing.authHeaders || {}, authHeaders)
        : existing.authHeaders || {}
    };

    if (token && existing.token === token && !hasAuthHeaders) {
      next.authHeaders = existing.authHeaders || {};
    }

    tokenCache.set(origin, next);

    schedulePersist();
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders", "extraHeaders"]
);

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  let responded = false;
  let timeoutId = null;

  const safeRespond = (payload) => {
    if (responded) {
      return;
    }

    responded = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    try {
      sendResponse(payload);
    } catch {
      // Ignore sendResponse errors when the port has already closed.
    }
  };

  timeoutId = setTimeout(() => {
    safeRespond({
      ok: false,
      error: {
        message: "Background request timed out. Reload the extension and retry.",
        code: "BACKGROUND_TIMEOUT"
      }
    });
  }, 8_000);

  void handleMessage(request)
    .then((data) => safeRespond({ ok: true, data }))
    .catch((error) => {
      safeRespond({
        ok: false,
        error: {
          message: error?.message || "Unexpected extension error",
          code: error?.code || "UNEXPECTED_ERROR"
        }
      });
    });

  return true;
});

chrome.runtime.onSuspend.addListener(() => {
  void persistTokenCache();
});

async function handleMessage(request) {
  await initPromise;

  switch (request?.type) {
    case "getConnectionStatus":
      return getConnectionStatus();
    case "runConfigletsReport":
      return runConfigletsReport();
    case "refreshConfigletFromGlobal":
      return refreshConfigletFromGlobal(request);
    case "refreshActiveTabTraffic":
      return refreshActiveTabTraffic();
    default:
      throw createError("Unsupported request", "BAD_REQUEST");
  }
}

async function hydrateTokenCache() {
  const stored = await chrome.storage.local.get(TOKEN_STORE_KEY);
  const tokensByOrigin = stored?.[TOKEN_STORE_KEY] || {};

  for (const [origin, value] of Object.entries(tokensByOrigin)) {
    if (!value || typeof value !== "object") {
      continue;
    }

    tokenCache.set(origin, {
      token: typeof value.token === "string" ? value.token : null,
      seenAt: Number(value.seenAt) || Date.now(),
      authHeaders: sanitizeCapturedHeaders(value.authHeaders || {})
    });
  }
}

function extractAuthHeaders(headers) {
  const out = {};

  for (const header of headers) {
    if (!header?.name || typeof header.value !== "string") {
      continue;
    }

    const lower = header.name.toLowerCase();
    if (!isLikelyAuthHeader(lower)) {
      continue;
    }

    out[header.name] = header.value;
  }

  return sanitizeCapturedHeaders(out);
}

function isLikelyAuthHeader(lowerName) {
  if (lowerName === "x-requested-with") {
    return true;
  }

  return (
    lowerName.includes("auth") ||
    lowerName.includes("token") ||
    lowerName.includes("csrf")
  );
}

function hasStrongAuthHeaders(headers) {
  return Object.keys(headers || {}).some((name) => isStrongAuthHeaderName(name.toLowerCase()));
}

function isStrongAuthHeaderName(lowerName) {
  return (
    lowerName.includes("auth") ||
    lowerName.includes("token") ||
    lowerName.includes("csrf")
  );
}

function sanitizeCapturedHeaders(headers) {
  const safe = {};

  for (const [name, value] of Object.entries(headers || {})) {
    if (typeof value !== "string") {
      continue;
    }

    if (!/^[A-Za-z0-9-]+$/.test(name)) {
      continue;
    }

    const lower = name.toLowerCase();
    if (!isLikelyAuthHeader(lower)) {
      continue;
    }

    safe[name] = value;
  }

  return safe;
}

function mergeHeaderMaps(baseHeaders, incomingHeaders) {
  return {
    ...sanitizeCapturedHeaders(baseHeaders || {}),
    ...sanitizeCapturedHeaders(incomingHeaders || {})
  };
}

function extractBearerToken(headers) {
  for (const header of headers) {
    if (!header?.name || typeof header.value !== "string") {
      continue;
    }

    if (header.name.toLowerCase() !== "authorization") {
      continue;
    }

    const match = header.value.match(/^Bearer\s+(.+)$/i);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

function getOrigin(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }

    return parsed.origin;
  } catch {
    return null;
  }
}

function schedulePersist() {
  if (persistTimer) {
    clearTimeout(persistTimer);
  }

  persistTimer = setTimeout(() => {
    void persistTokenCache();
  }, 250);
}

async function persistTokenCache() {
  const tokensByOrigin = {};

  for (const [origin, value] of tokenCache.entries()) {
    tokensByOrigin[origin] = {
      token: value.token,
      seenAt: value.seenAt,
      authHeaders: sanitizeCapturedHeaders(value.authHeaders || {})
    };
  }

  await chrome.storage.local.set({ [TOKEN_STORE_KEY]: tokensByOrigin });
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs?.[0] || null;
}

async function getConnectionStatus() {
  const tab = await getActiveTab();

  if (!tab?.url) {
    return {
      state: "NO_ACTIVE_TAB",
      message: "Open a Data Center Director tab to begin."
    };
  }

  const origin = getOrigin(tab.url);
  if (!origin) {
    return {
      state: "NOT_ON_DCD_TAB",
      message: "Switch to an HTTP(S) Data Center Director tab to connect.",
      tabUrl: tab.url
    };
  }

  if (typeof tab.id !== "number") {
    return {
      state: "NOT_ON_DCD_TAB",
      message: "Could not access active tab context. Refocus the Data Center Director tab and retry.",
      origin,
      host: new URL(origin).host,
      tabUrl: tab.url
    };
  }

  const probe = await probeDataCenterDirectorTab(tab.id, origin);
  if (!probe.isLikelyDcd) {
    return {
      state: "NOT_ON_DCD_TAB",
      message: "This tab does not look like a Data Center Director endpoint.",
      origin,
      host: new URL(origin).host,
      tabUrl: tab.url,
      probe
    };
  }

  const tokenInfo = tokenCache.get(origin) || null;
  const authCaptured = Boolean(tokenInfo?.token) || hasStrongAuthHeaders(tokenInfo?.authHeaders || {});

  if (!authCaptured) {
    return {
      state: "WAITING_FOR_TOKEN",
      message: "Data Center Director detected. Waiting for token/auth header capture.",
      origin,
      host: new URL(origin).host,
      tabId: tab.id,
      tokenSeenAt: null,
      authMode: "none",
      probe
    };
  }

  return {
    state: "READY",
    message: tokenInfo?.token
      ? "Connected. Token captured."
      : "Connected. Auth headers captured.",
    origin,
    host: new URL(origin).host,
    tabId: tab.id,
    tokenSeenAt: tokenInfo?.seenAt || null,
    authMode: tokenInfo?.token ? "token" : "headers",
    probe
  };
}

async function refreshActiveTabTraffic() {
  const tab = await getActiveTab();
  if (!tab?.id || !tab.url) {
    throw createError("No active tab available to refresh", "NO_ACTIVE_TAB");
  }

  const origin = getOrigin(tab.url);
  if (!origin) {
    throw createError("Switch to an HTTP(S) Data Center Director tab first", "NOT_ON_DCD_TAB");
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: () => {
      const endpoint = `${window.location.origin}/api/blueprints?limit=1`;
      fetch(endpoint, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json"
        }
      }).catch(() => {
      });
    }
  });

  return { refreshed: true };
}

async function probeDataCenterDirectorTab(tabId, origin) {
  const cached = probeCache.get(origin);
  const now = Date.now();

  if (cached && now - cached.checkedAt < PROBE_TTL_MS) {
    return cached;
  }

  const probe = {
    checkedAt: now,
    isLikelyDcd: false,
    status: null,
    contentType: null
  };

  try {
    const response = await apiGetFromTab(tabId, origin, `${API_ROOT}/blueprints?limit=1`);

    probe.status = response.status;
    probe.contentType = response.contentType;

    const isAuthOrSuccess = [200, 401, 403].includes(response.status);
    const isJson = response.contentType.includes("json") || typeof response.data === "object";

    probe.isLikelyDcd = isAuthOrSuccess && isJson;
  } catch {
    probe.isLikelyDcd = false;
  }

  probeCache.set(origin, probe);
  return probe;
}

async function runConfigletsReport() {
  const connection = await getConnectionStatus();

  if (connection.state === "NOT_ON_DCD_TAB") {
    throw createError("Open a Data Center Director tab first.", "NOT_ON_DCD_TAB");
  }

  if (connection.state === "WAITING_FOR_TOKEN") {
    throw createError(
      "Token/auth headers not captured yet. Generate API traffic, then Refresh Status.",
      "TOKEN_MISSING"
    );
  }

  if (connection.state !== "READY") {
    throw createError("Connection is not ready.", "NOT_READY");
  }

  const tokenInfo = tokenCache.get(connection.origin) || {};
  const token = tokenInfo.token || null;
  const authHeaders = sanitizeCapturedHeaders(tokenInfo.authHeaders || {});

  const report = await fetchConfigletsByBlueprint(connection, token, authHeaders);

  return {
    connection,
    report
  };
}

async function refreshConfigletFromGlobal(request) {
  const connection = await getConnectionStatus();

  if (connection.state === "NOT_ON_DCD_TAB") {
    throw createError("Open a Data Center Director tab first.", "NOT_ON_DCD_TAB");
  }

  if (connection.state === "WAITING_FOR_TOKEN") {
    throw createError(
      "Token/auth headers not captured yet. Generate API traffic, then Refresh Status.",
      "TOKEN_MISSING"
    );
  }

  if (connection.state !== "READY") {
    throw createError("Connection is not ready.", "NOT_READY");
  }

  const blueprintId = (request?.blueprintId || "").trim();
  const blueprintConfigletId = (request?.blueprintConfigletId || "").trim();
  const configletName = (request?.configletName || "").trim();

  if (!blueprintId || !blueprintConfigletId) {
    throw createError("blueprintId and blueprintConfigletId are required", "BAD_REQUEST");
  }

  const tokenInfo = tokenCache.get(connection.origin) || {};
  const token = tokenInfo.token || null;
  const authHeaders = sanitizeCapturedHeaders(tokenInfo.authHeaders || {});

  const globalConfiglets = (await fetchCollection(
    connection,
    `${API_ROOT}/design/configlets`,
    token,
    authHeaders
  ))
    .map((item) => normalizeConfiglet(item, { isGlobal: true }))
    .filter((item) => item.name);

  const blueprintConfigletPayload = await apiGet(
    connection,
    `${API_ROOT}/blueprints/${encodeURIComponent(blueprintId)}/configlets/${encodeURIComponent(blueprintConfigletId)}`,
    token,
    authHeaders
  );

  const blueprintAssignment = normalizeBlueprintConfigletAssignment(blueprintConfigletPayload);

  const globalMatch =
    globalConfiglets.find((item) => item.id && item.id === blueprintAssignment.configlet?.id) ||
    globalConfiglets.find(
      (item) => normalizeLookupKey(item.name) === normalizeLookupKey(blueprintAssignment.configletName || configletName)
    );

  if (!globalMatch) {
    throw createError(
      `Global configlet not found for blueprint configlet ${blueprintConfigletId}.`,
      "CONFIGLET_NOT_FOUND"
    );
  }

  const payload = {
    condition: blueprintAssignment.condition || "",
    label: globalMatch.name,
    configlet: {
      display_name: globalMatch.name,
      generators: Array.isArray(globalMatch.generators) ? globalMatch.generators : []
    }
  };

  await apiPut(
    connection,
    `${API_ROOT}/blueprints/${encodeURIComponent(blueprintId)}/configlets/${encodeURIComponent(blueprintConfigletId)}`,
    payload,
    token,
    authHeaders
  );

  return {
    status: "COMPLETED",
    blueprintId,
    globalConfigletName: globalMatch.name,
    globalConfigletId: globalMatch.id || null,
    refreshedBlueprintConfigletId: blueprintConfigletId,
    message: "Configlet refreshed from global template. Commit staging changes to deploy."
  };
}

async function fetchConfigletsByBlueprint(connection, token, authHeaders) {
  const blueprints = (await fetchCollection(connection, `${API_ROOT}/blueprints`, token, authHeaders))
    .map(normalizeBlueprint)
    .filter((item) => item.id);

  let globalConfiglets = [];
  const failures = [];

  try {
    globalConfiglets = (await fetchCollection(
      connection,
      `${API_ROOT}/design/configlets`,
      token,
      authHeaders
    ))
      .map((item) => normalizeConfiglet(item, { isGlobal: true }))
      .filter((item) => item.name);
  } catch (error) {
    failures.push({
      blueprintId: "global-catalog",
      blueprintName: "Global Design Catalog",
      message: error?.message || "Failed to load global configlet catalog"
    });
  }

  const globalById = new Map();
  const globalByName = new Map();

  for (const configlet of globalConfiglets) {
    if (configlet.id) {
      globalById.set(configlet.id, configlet);
    }

    const nameKey = normalizeLookupKey(configlet.name);
    if (nameKey && !globalByName.has(nameKey)) {
      globalByName.set(nameKey, configlet);
    }
  }

  const assignments = [];

  const settledResults = await mapWithConcurrency(blueprints, 6, async (blueprint) => {
    const encodedId = encodeURIComponent(blueprint.id);

    let payloadItems;
    try {
      payloadItems = await fetchCollection(
        connection,
        `${API_ROOT}/blueprints/${encodedId}/configlets?type=staging`,
        token,
        authHeaders
      );
    } catch {
      payloadItems = await fetchCollection(
        connection,
        `${API_ROOT}/blueprints/${encodedId}/configlets`,
        token,
        authHeaders
      );
    }

    const items = payloadItems
      .map((entry) => normalizeBlueprintConfigletAssignment(entry))
      .filter((entry) => entry.configletName);

    return { blueprint, items };
  });

  for (const result of settledResults) {
    if (result.status === "fulfilled") {
      const blueprint = result.value.blueprint;

      for (const item of result.value.items) {
        const globalMatch = matchGlobalConfiglet(item, globalById, globalByName);
        const localSnapshot = buildConfigletSnapshot(item.configlet);
        const globalSnapshot = buildConfigletSnapshot(globalMatch?.configlet || null);

        const syncStatus = !globalMatch
          ? "NO_GLOBAL_MATCH"
          : localSnapshot.fingerprint === globalSnapshot.fingerprint
            ? "IN_SYNC"
            : "OUT_OF_SYNC";

        assignments.push({
          rowKey: buildRowKey(item, globalMatch),
          configletName: globalMatch?.configlet?.name || item.configletName,
          configletId: item.configlet?.id || item.assignmentId || "",
          globalConfigletId: globalMatch?.configlet?.id || null,
          globalMatchMode: globalMatch?.mode || "none",
          blueprintId: blueprint.id,
          blueprintName: blueprint.name,
          assignmentId: item.assignmentId,
          condition: item.condition,
          syncStatus,
          localSnapshot,
          globalSnapshot
        });
      }
    } else {
      const context = result.reason?.context;
      failures.push({
        blueprintId: context?.blueprintId || "unknown",
        blueprintName: context?.blueprintName || "Unknown blueprint",
        message: result.reason?.message || "Failed to load blueprint configlets"
      });
    }
  }

  const groupedRows = groupAssignmentsByConfiglet(assignments);
  const unusedRows = buildUnusedConfigletRows(globalConfiglets, groupedRows);

  return {
    generatedAt: Date.now(),
    blueprintCount: blueprints.length,
    assignmentCount: assignments.length,
    uniqueConfigletCount: groupedRows.length,
    unusedConfigletCount: unusedRows.length,
    outOfSyncConfigletCount: groupedRows.filter((row) => row.outOfSyncCount > 0).length,
    partialFailures: failures,
    rows: groupedRows,
    unusedRows
  };
}

async function apiGet(connection, path, token, authHeaders = {}) {
  const mergedHeaders = mergeHeaderMaps(authHeaders, {});
  if (token && !hasHeaderCaseInsensitive(mergedHeaders, "authorization")) {
    mergedHeaders.Authorization = `Bearer ${token}`;
  }

  if (connection?.tabId) {
    const tabResult = await apiGetFromTab(connection.tabId, connection.origin, path, mergedHeaders);

    if (!tabResult.ok) {
      throw createError(
        buildApiFailureMessage(tabResult.status, path),
        "API_REQUEST_FAILED",
        { responseStatus: tabResult.status, responseBody: tabResult.data || tabResult.text }
      );
    }

    return tabResult.data || tabResult.text;
  }

  if (!token) {
    throw createError("No usable tab session or token for API request", "AUTH_UNAVAILABLE");
  }

  const response = await fetch(`${connection.origin}${path}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...mergedHeaders
    }
  });

  const text = await response.text();
  const data = tryParseJson(text);

  if (!response.ok) {
    throw createError(
      buildApiFailureMessage(response.status, path),
      "API_REQUEST_FAILED",
      { responseStatus: response.status, responseBody: data || text }
    );
  }

  return data || text;
}

async function apiDelete(connection, path, token, authHeaders = {}) {
  const mergedHeaders = mergeHeaderMaps(authHeaders, {});
  if (token && !hasHeaderCaseInsensitive(mergedHeaders, "authorization")) {
    mergedHeaders.Authorization = `Bearer ${token}`;
  }

  const headers = {
    Accept: "application/json",
    ...mergedHeaders
  };

  if (connection?.tabId) {
    const result = await apiCallFromTab(connection.tabId, connection.origin, path, "DELETE", headers);
    if (!result.ok) {
      throw createError(buildApiFailureMessage(result.status, path), "API_REQUEST_FAILED", {
        responseStatus: result.status,
        responseBody: result.data || result.text
      });
    }

    return result.data || result.text;
  }

  if (!token) {
    throw createError("No usable tab session or token for API request", "AUTH_UNAVAILABLE");
  }

  const response = await fetch(`${connection.origin}${path}`, {
    method: "DELETE",
    credentials: "include",
    headers
  });

  const text = await response.text();
  const data = tryParseJson(text);

  if (!response.ok) {
    throw createError(buildApiFailureMessage(response.status, path), "API_REQUEST_FAILED", {
      responseStatus: response.status,
      responseBody: data || text
    });
  }

  return data || text;
}

async function apiPost(connection, path, body, token, authHeaders = {}) {
  const mergedHeaders = mergeHeaderMaps(authHeaders, {});
  if (token && !hasHeaderCaseInsensitive(mergedHeaders, "authorization")) {
    mergedHeaders.Authorization = `Bearer ${token}`;
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...mergedHeaders
  };

  if (connection?.tabId) {
    const result = await apiCallFromTab(connection.tabId, connection.origin, path, "POST", headers, body);
    if (!result.ok) {
      throw createError(buildApiFailureMessage(result.status, path), "API_REQUEST_FAILED", {
        responseStatus: result.status,
        responseBody: result.data || result.text
      });
    }

    return result.data || result.text;
  }

  if (!token) {
    throw createError("No usable tab session or token for API request", "AUTH_UNAVAILABLE");
  }

  const response = await fetch(`${connection.origin}${path}`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(body || {})
  });

  const text = await response.text();
  const data = tryParseJson(text);

  if (!response.ok) {
    throw createError(buildApiFailureMessage(response.status, path), "API_REQUEST_FAILED", {
      responseStatus: response.status,
      responseBody: data || text
    });
  }

  return data || text;
}

async function apiPut(connection, path, body, token, authHeaders = {}) {
  const mergedHeaders = mergeHeaderMaps(authHeaders, {});
  if (token && !hasHeaderCaseInsensitive(mergedHeaders, "authorization")) {
    mergedHeaders.Authorization = `Bearer ${token}`;
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...mergedHeaders
  };

  if (connection?.tabId) {
    const result = await apiCallFromTab(connection.tabId, connection.origin, path, "PUT", headers, body);
    if (!result.ok) {
      throw createError(buildApiFailureMessage(result.status, path), "API_REQUEST_FAILED", {
        responseStatus: result.status,
        responseBody: result.data || result.text
      });
    }

    return result.data || result.text;
  }

  if (!token) {
    throw createError("No usable tab session or token for API request", "AUTH_UNAVAILABLE");
  }

  const response = await fetch(`${connection.origin}${path}`, {
    method: "PUT",
    credentials: "include",
    headers,
    body: JSON.stringify(body || {})
  });

  const text = await response.text();
  const data = tryParseJson(text);

  if (!response.ok) {
    throw createError(buildApiFailureMessage(response.status, path), "API_REQUEST_FAILED", {
      responseStatus: response.status,
      responseBody: data || text
    });
  }

  return data || text;
}

async function fetchCollection(connection, path, token, authHeaders = {}) {
  const allItems = [];
  let page = 0;
  let offset = 0;
  let hasMore = true;
  let usePagination = true;

  while (hasMore && page < MAX_PAGINATION_PAGES) {
    page += 1;

    const requestPath = usePagination
      ? appendPagination(path, {
          limit: DEFAULT_PAGE_SIZE,
          offset
        })
      : path;

    let payload;
    try {
      payload = await apiGet(connection, requestPath, token, authHeaders);
    } catch (error) {
      if (usePagination && page === 1 && error?.code === "API_REQUEST_FAILED") {
        usePagination = false;
        page = 0;
        offset = 0;
        hasMore = true;
        allItems.length = 0;
        continue;
      }

      throw error;
    }

    const items = unwrapCollection(payload);

    if (Array.isArray(payload)) {
      allItems.push(...payload);
      hasMore = false;
      continue;
    }

    allItems.push(...items);

    if (!payload || typeof payload !== "object") {
      hasMore = false;
      continue;
    }

    if (typeof payload.has_more === "boolean") {
      hasMore = payload.has_more;
    } else {
      hasMore = false;
    }

    if (!hasMore) {
      continue;
    }

    if (!usePagination) {
      hasMore = false;
      continue;
    }

    if (Number.isFinite(Number(payload.next_offset))) {
      offset = Number(payload.next_offset);
      continue;
    }

    if (items.length === 0) {
      hasMore = false;
      continue;
    }

    offset += items.length;
  }

  return allItems;
}

function appendPagination(path, params) {
  const [base, existingQuery = ""] = path.split("?");
  const query = new URLSearchParams(existingQuery);

  query.set("limit", String(params.limit));
  query.set("offset", String(params.offset));

  return `${base}?${query.toString()}`;
}

async function apiGetFromTab(tabId, origin, path, extraHeaders = {}) {
  const [{ result }] = await executeScriptWithTimeout(
    () =>
      chrome.scripting.executeScript({
        target: { tabId },
        world: "MAIN",
        args: [{ origin, path, extraHeaders, method: "GET", body: null }],
        func: tabApiRequestExecutor
      }),
    6500,
    "Timed out probing active tab"
  );

  if (!result) {
    throw createError("No script result returned from active tab", "TAB_SCRIPT_FAILED");
  }

  if (result.networkError) {
    throw createError(
      `Tab API request failed: ${result.networkError}`,
      "TAB_NETWORK_ERROR",
      { responseStatus: 0 }
    );
  }

  return result;
}

async function apiCallFromTab(tabId, origin, path, method, extraHeaders = {}, body = null) {
  const [{ result }] = await executeScriptWithTimeout(
    () =>
      chrome.scripting.executeScript({
        target: { tabId },
        world: "MAIN",
        args: [{ origin, path, extraHeaders, method, body }],
        func: tabApiRequestExecutor
      }),
    10_000,
    `Timed out running ${method || "API"} request in active tab`
  );

  if (!result) {
    throw createError("No script result returned from active tab", "TAB_SCRIPT_FAILED");
  }

  if (result.networkError) {
    throw createError(
      `Tab API request failed: ${result.networkError}`,
      "TAB_NETWORK_ERROR",
      { responseStatus: 0 }
    );
  }

  return result;
}

async function tabApiRequestExecutor(input) {
      const buildHeaders = () => {
        const headers = {
          Accept: "application/json",
          ...(input.extraHeaders || {})
        };

        return headers;
      };

      const parseBody = (raw) => {
        if (typeof raw !== "string") {
          return null;
        }

        try {
          return raw && raw.trim() !== "" ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      };

      const runAxios = async (url, headers) => {
        const axiosRef = window.axios;
        if (!axiosRef) {
          return null;
        }

        try {
          const requestConfig = {
            withCredentials: true,
            headers
          };

          let response;
          if ((input.method || "GET").toUpperCase() === "GET") {
            if (typeof axiosRef.get !== "function") {
              return null;
            }
            response = await axiosRef.get(url, requestConfig);
          } else {
            if (typeof axiosRef.request !== "function") {
              return null;
            }
            response = await axiosRef.request({
              url,
              method: input.method,
              data: input.body,
              ...requestConfig
            });
          }

          const contentType = String(response?.headers?.["content-type"] || "").toLowerCase();
          return {
            ok: true,
            status: Number(response?.status) || 200,
            contentType,
            text: typeof response?.data === "string" ? response.data : JSON.stringify(response?.data),
            data: response?.data ?? null
          };
        } catch {
          return null;
        }
      };

      const runJqueryAjax = async (url, headers) => {
        const jq = window.jQuery || window.$;
        if (!jq || typeof jq.ajax !== "function") {
          return null;
        }

        try {
          const result = await new Promise((resolve) => {
            jq.ajax({
              url,
              method: (input.method || "GET").toUpperCase(),
              headers,
              contentType: "application/json",
              data: input.body ? JSON.stringify(input.body) : undefined,
              xhrFields: { withCredentials: true },
              success: (data, _textStatus, xhr) => {
                resolve({ ok: true, data, xhr });
              },
              error: (xhr) => {
                resolve({ ok: false, xhr });
              }
            });
          });

          const contentType = String(result?.xhr?.getResponseHeader?.("content-type") || "").toLowerCase();
          const rawText = String(result?.xhr?.responseText || "");

          return {
            ok: Boolean(result?.ok),
            status: Number(result?.xhr?.status) || 0,
            contentType,
            text: rawText,
            data: result?.ok ? result?.data ?? parseBody(rawText) : parseBody(rawText)
          };
        } catch {
          return null;
        }
      };

      try {
        const url = `${input.origin}${input.path}`;
        const headers = buildHeaders();

        const axiosResult = await runAxios(url, headers);
        if (axiosResult) {
          return axiosResult;
        }

        const jqueryResult = await runJqueryAjax(url, headers);
        if (jqueryResult) {
          return jqueryResult;
        }

        const response = await fetch(url, {
          method: (input.method || "GET").toUpperCase(),
          credentials: "include",
          headers,
          body:
            input.body && (input.method || "GET").toUpperCase() !== "GET"
              ? JSON.stringify(input.body)
              : undefined
        });

        const text = await response.text();
        const data = parseBody(text);

        return {
          ok: response.ok,
          status: response.status,
          contentType: (response.headers.get("content-type") || "").toLowerCase(),
          text,
          data
        };
      } catch (error) {
        return {
          ok: false,
          status: 0,
          contentType: "",
          text: "",
          data: null,
          networkError: String(error?.message || error)
        };
      }
}

async function executeScriptWithTimeout(executor, timeoutMs, timeoutMessage) {
  let timeoutId;

  try {
    return await Promise.race([
      executor(),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(createError(timeoutMessage, "TAB_SCRIPT_TIMEOUT", { responseStatus: 0 }));
        }, timeoutMs);
      })
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function hasHeaderCaseInsensitive(headers, headerName) {
  const normalized = headerName.toLowerCase();
  return Object.keys(headers || {}).some((name) => name.toLowerCase() === normalized);
}

function tryParseJson(text) {
  if (typeof text !== "string" || text.trim() === "") {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function unwrapCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const candidateKeys = ["items", "results", "data", "blueprints", "configlets"];
  for (const key of candidateKeys) {
    if (Array.isArray(payload[key])) {
      return payload[key];
    }
  }

  return [];
}

function normalizeBlueprint(value) {
  const id =
    firstString(value, ["id", "blueprint_id", "uuid"]) ||
    firstString(value?.blueprint, ["id", "blueprint_id", "uuid"]);

  const name =
    firstString(value, ["label", "name", "display_name", "description"]) ||
    id ||
    "Unnamed blueprint";

  return { id, name };
}

function normalizeConfiglet(value, options = {}) {
  const source = value && typeof value === "object" ? value : {};
  const nested = source.configlet && typeof source.configlet === "object" ? source.configlet : {};

  const id =
    firstString(nested, ["id", "configlet_id", "uuid"]) ||
    firstString(source, ["id", "configlet_id", "uuid"]);

  const name =
    firstString(source, ["label", "display_name", "name"]) ||
    firstString(nested, ["label", "display_name", "name"]) ||
    id ||
    "Unnamed configlet";

  const generators = Array.isArray(nested.generators)
    ? nested.generators
    : Array.isArray(source.generators)
      ? source.generators
      : [];

  const lastUpdatedAt =
    firstTimestamp(nested, [
      "last_modified_at",
      "last_updated_at",
      "updated_at",
      "modified_at",
      "updated"
    ]) ||
    firstTimestamp(source, [
      "last_modified_at",
      "last_updated_at",
      "updated_at",
      "modified_at",
      "updated"
    ]) ||
    null;

  return {
    id,
    name,
    generators: generators.map(normalizeGenerator),
    source: options.isGlobal ? "global" : "blueprint",
    lastUpdatedAt
  };
}

function normalizeGenerator(generator) {
  const source = generator && typeof generator === "object" ? generator : {};

  return {
    config_style: asString(source.config_style),
    section: asString(source.section),
    section_condition: asString(source.section_condition),
    filename: asString(source.filename),
    render_style: asString(source.render_style),
    template_text: normalizeMultilineText(asString(source.template_text)),
    negation_template_text: normalizeMultilineText(asString(source.negation_template_text))
  };
}

function normalizeBlueprintConfigletAssignment(value) {
  const source = value && typeof value === "object" ? value : {};
  const configlet = normalizeConfiglet(source.configlet || source);

  return {
    assignmentId: firstString(source, ["id", "assignment_id", "uuid"]) || "",
    condition: asString(source.condition),
    configletName:
      firstString(source, ["label", "display_name", "name"]) ||
      configlet.name ||
      "Unnamed configlet",
    configlet: {
      ...configlet,
      name:
        firstString(source, ["label", "display_name", "name"]) ||
        configlet.name ||
        "Unnamed configlet"
    }
  };
}

function matchGlobalConfiglet(assignment, globalById, globalByName) {
  const localId = assignment?.configlet?.id;
  if (localId && globalById.has(localId)) {
    return { mode: "id", configlet: globalById.get(localId) };
  }

  const localNameKey = normalizeLookupKey(assignment?.configletName || assignment?.configlet?.name);
  if (localNameKey && globalByName.has(localNameKey)) {
    return { mode: "name", configlet: globalByName.get(localNameKey) };
  }

  return null;
}

function buildRowKey(assignment, globalMatch) {
  if (globalMatch?.configlet?.id) {
    return `global:${globalMatch.configlet.id}`;
  }

  const nameKey = normalizeLookupKey(assignment?.configletName || assignment?.configlet?.name);
  if (nameKey) {
    return `local:${nameKey}`;
  }

  if (assignment?.assignmentId) {
    return `local-assignment:${assignment.assignmentId}`;
  }

  return `local-random:${Math.random().toString(36).slice(2, 10)}`;
}

function buildConfigletSnapshot(configlet) {
  if (!configlet) {
    return {
      fingerprint: "",
      combinedText: "",
      generatorCount: 0
    };
  }

  const normalizedGenerators = Array.isArray(configlet.generators)
    ? configlet.generators.map(normalizeGenerator)
    : [];

  const fingerprint = JSON.stringify(normalizedGenerators);
  const parts = normalizedGenerators.map((generator, index) => {
    const header = [
      `# Generator ${index + 1}`,
      `style=${generator.config_style || ""}`,
      `section=${generator.section || ""}`,
      `filename=${generator.filename || ""}`,
      `render_style=${generator.render_style || ""}`
    ].join(" | ");

    return [
      header,
      "[template_text]",
      generator.template_text || "",
      "[negation_template_text]",
      generator.negation_template_text || ""
    ].join("\n");
  });

  return {
    fingerprint,
    combinedText: parts.join("\n\n"),
    generatorCount: normalizedGenerators.length
  };
}

function groupAssignmentsByConfiglet(assignments) {
  const grouped = new Map();

  for (const item of assignments) {
    const key = item.rowKey;
    if (!grouped.has(key)) {
      grouped.set(key, {
        rowKey: key,
        configletName: item.configletName,
        configletId: item.configletId || "",
        globalConfigletId: item.globalConfigletId,
        globalMatchMode: item.globalMatchMode,
        entries: [],
        catalogText: ""
      });
    }

    const target = grouped.get(key);

    if (!target.catalogText && item.globalSnapshot.combinedText) {
      target.catalogText = item.globalSnapshot.combinedText;
    }

    target.entries.push({
      blueprintId: item.blueprintId,
      blueprintName: item.blueprintName,
      configletId: item.configletId || "",
      assignmentId: item.assignmentId,
      condition: item.condition,
      syncStatus: item.syncStatus,
      localText: item.localSnapshot.combinedText,
      globalText: item.globalSnapshot.combinedText,
      localGeneratorCount: item.localSnapshot.generatorCount,
      globalGeneratorCount: item.globalSnapshot.generatorCount
    });
  }

  const rows = [];

  for (const row of grouped.values()) {
    const blueprintMap = new Map();
    let inSyncCount = 0;
    let outOfSyncCount = 0;

    for (const entry of row.entries) {
      if (!blueprintMap.has(entry.blueprintId)) {
        blueprintMap.set(entry.blueprintId, {
          blueprintId: entry.blueprintId,
          blueprintName: entry.blueprintName
        });
      }

      if (entry.syncStatus === "IN_SYNC") {
        inSyncCount += 1;
      } else {
        outOfSyncCount += 1;
      }
    }

    rows.push({
      rowKey: row.rowKey,
      configletName: row.configletName,
      configletId: row.configletId,
      globalConfigletId: row.globalConfigletId,
      globalMatchMode: row.globalMatchMode,
      entries: row.entries,
      blueprints: Array.from(blueprintMap.values()).sort((a, b) =>
        a.blueprintName.localeCompare(b.blueprintName)
      ),
      blueprintCount: blueprintMap.size,
      assignmentCount: row.entries.length,
      inSyncCount,
      outOfSyncCount,
      isUnused: false,
      catalogText: row.catalogText || ""
    });
  }

  rows.sort((a, b) => {
    if (b.blueprintCount !== a.blueprintCount) {
      return b.blueprintCount - a.blueprintCount;
    }

    if (b.outOfSyncCount !== a.outOfSyncCount) {
      return b.outOfSyncCount - a.outOfSyncCount;
    }

    return a.configletName.localeCompare(b.configletName);
  });

  return rows;
}

function buildUnusedConfigletRows(globalConfiglets, groupedRows) {
  const usedGlobalIds = new Set(
    groupedRows
      .map((row) => row.globalConfigletId)
      .filter((id) => typeof id === "string" && id.trim() !== "")
  );

  const rows = [];

  for (const configlet of globalConfiglets) {
    if (configlet.id && usedGlobalIds.has(configlet.id)) {
      continue;
    }

    const snapshot = buildConfigletSnapshot(configlet);
    const keyBase = configlet.id || normalizeLookupKey(configlet.name);

    rows.push({
      rowKey: `unused-global:${keyBase}`,
      configletName: configlet.name,
      configletId: "",
      globalConfigletId: configlet.id || null,
      lastUpdatedAt: configlet.lastUpdatedAt || null,
      globalMatchMode: "global-only",
      entries: [],
      blueprints: [],
      blueprintCount: 0,
      assignmentCount: 0,
      inSyncCount: 0,
      outOfSyncCount: 0,
      isUnused: true,
      catalogText: snapshot.combinedText
    });
  }

  rows.sort((a, b) => a.configletName.localeCompare(b.configletName));
  return rows;
}

function normalizeLookupKey(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

function normalizeMultilineText(value) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .trim();
}

function asString(value) {
  return typeof value === "string" ? value : "";
}

function firstString(value, keys) {
  if (!value || typeof value !== "object") {
    return null;
  }

  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim() !== "") {
      return candidate.trim();
    }
  }

  return null;
}

function firstTimestamp(value, keys) {
  if (!value || typeof value !== "object") {
    return null;
  }

  for (const key of keys) {
    const parsed = parseTimestamp(value[key]);
    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
}

function parseTimestamp(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value <= 0) {
      return null;
    }

    return value < 1_000_000_000_000 ? Math.round(value * 1000) : Math.round(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const numeric = Number(trimmed);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric < 1_000_000_000_000 ? Math.round(numeric * 1000) : Math.round(numeric);
    }

    const parsed = Date.parse(trimmed);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let index = 0;

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;

      const item = items[currentIndex];

      try {
        const value = await mapper(item, currentIndex);
        results[currentIndex] = { status: "fulfilled", value };
      } catch (error) {
        results[currentIndex] = {
          status: "rejected",
          reason: {
            ...error,
            message: error?.message || "Worker task failed",
            context: {
              blueprintId: item?.id,
              blueprintName: item?.name
            }
          }
        };
      }
    }
  });

  await Promise.all(workers);
  return results;
}

function createError(message, code, meta = {}) {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, meta);
  return error;
}

function buildApiFailureMessage(status, path) {
  if (status === 401) {
    return `API request failed (401) for ${path}. Generate fresh API traffic in the Data Center Director tab, then click Refresh Status and Load Report again.`;
  }

  return `API request failed (${status}) for ${path}`;
}
