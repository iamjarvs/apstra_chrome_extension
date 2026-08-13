const API_ROOT = "/api";
const TOKEN_STORE_KEY = "tokensByOrigin";
const PROBE_TTL_MS = 30_000;
const DEFAULT_PAGE_SIZE = 200;
const MAX_PAGINATION_PAGES = 25;
const VIRTUAL_NETWORKS_PATH_SUFFIX = "virtual-networks";
const SECURITY_ZONES_PATH_SUFFIX = "security-zones";
// Freeform blueprints do not expose the datacenter reference-design APIs this extension uses.
const UNSUPPORTED_BLUEPRINT_DESIGNS = new Set(["freeform"]);

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

  const timeoutMs = getRequestTimeoutMs(request?.type);

  timeoutId = setTimeout(() => {
    safeRespond({
      ok: false,
      error: {
        message: "Background request timed out. Reload the extension and retry.",
        code: "BACKGROUND_TIMEOUT"
      }
    });
  }, timeoutMs);

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
    case "runGatewayConnectionsReport":
      return runGatewayConnectionsReport();
    case "runVxlanStretchReport":
      return runVxlanStretchReport();
    case "stretchVxlans":
      return stretchVxlans(request);
    case "runVrfStretchReport":
      return runVrfStretchReport();
    case "stretchVrfs":
      return stretchVrfs(request);
    case "refreshConfigletFromGlobal":
      return refreshConfigletFromGlobal(request);
    case "refreshActiveTabTraffic":
      return refreshActiveTabTraffic();
    default:
      throw createError("Unsupported request", "BAD_REQUEST");
  }
}

function getRequestTimeoutMs(type) {
  if (type === "stretchVxlans") {
    return 50_000;
  }

  if (type === "runVxlanStretchReport") {
    return 20_000;
  }

  if (type === "stretchVrfs") {
    return 50_000;
  }

  if (type === "runVrfStretchReport") {
    return 20_000;
  }

  return 8_000;
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

async function runGatewayConnectionsReport() {
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

  const report = await fetchGatewayConnectionsReport(connection, token, authHeaders);

  return {
    connection,
    report
  };
}

async function runVxlanStretchReport() {
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

  const report = await fetchVxlanStretchReport(connection, token, authHeaders);

  return {
    connection,
    report
  };
}

async function runVrfStretchReport() {
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

  const report = await fetchVrfStretchReport(connection, token, authHeaders);

  return {
    connection,
    report
  };
}

async function stretchVxlans(request) {
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

  const sourceBlueprintId = asString(request?.sourceBlueprintId).trim();
  const targetBlueprintIds = dedupeStrings(
    Array.isArray(request?.targetBlueprintIds)
      ? request.targetBlueprintIds.map((item) => asString(item).trim()).filter(Boolean)
      : []
  );
  const scopeBlueprintIds = dedupeStrings(
    Array.isArray(request?.scopeBlueprintIds)
      ? request.scopeBlueprintIds.map((item) => asString(item).trim()).filter(Boolean)
      : []
  );
  const preferredSourceBlueprintId = asString(request?.preferredSourceBlueprintId).trim();
  const stretchKeys = dedupeStrings(
    Array.isArray(request?.stretchKeys)
      ? request.stretchKeys.map((item) => asString(item).trim()).filter(Boolean)
      : []
  );
  // Keys the user asked to stretch without pinning the source VLAN, so Apstra allocates a free one.
  const autoVlanStretchKeys = new Set(
    Array.isArray(request?.autoVlanStretchKeys)
      ? request.autoVlanStretchKeys.map((item) => asString(item).trim()).filter(Boolean)
      : []
  );

  if (stretchKeys.length === 0) {
    throw createError("Select at least one VXLAN to stretch", "BAD_REQUEST");
  }

  const tokenInfo = tokenCache.get(connection.origin) || {};
  const token = tokenInfo.token || null;
  const authHeaders = sanitizeCapturedHeaders(tokenInfo.authHeaders || {});

  const facts = await fetchBlueprintVxlanFacts(connection, token, authHeaders);
  const blueprintMap = new Map(facts.blueprintRows.map((item) => [item.blueprintId, item]));

  const plans = [];

  if (scopeBlueprintIds.length > 0) {
    if (scopeBlueprintIds.length < 2) {
      throw createError("At least two scope blueprints are required", "BAD_REQUEST");
    }

    const invalidScope = scopeBlueprintIds.filter((item) => !blueprintMap.has(item));
    if (invalidScope.length > 0) {
      throw createError(`Unknown scope blueprint id(s): ${invalidScope.join(", ")}`, "BAD_REQUEST");
    }

    for (const stretchKey of stretchKeys) {
      const sourceCandidates = scopeBlueprintIds.filter((blueprintId) => {
        const blueprint = blueprintMap.get(blueprintId);
        return Boolean(blueprint?.vxlanByStretchKey.has(stretchKey));
      });

      const targets = scopeBlueprintIds.filter((blueprintId) => {
        const blueprint = blueprintMap.get(blueprintId);
        return !blueprint?.vxlanByStretchKey.has(stretchKey);
      });

      const selectedSourceBlueprintId = choosePreferredScopeSourceBlueprintId(
        sourceCandidates,
        preferredSourceBlueprintId,
        blueprintMap
      );

      plans.push({
        stretchKey,
        sourceBlueprintId: selectedSourceBlueprintId,
        targetBlueprintIds: targets,
        mode: "scope"
      });
    }
  } else {
    if (!sourceBlueprintId) {
      throw createError("sourceBlueprintId is required", "BAD_REQUEST");
    }

    if (targetBlueprintIds.length === 0) {
      throw createError("At least one target blueprint is required", "BAD_REQUEST");
    }

    const sourceBlueprint = blueprintMap.get(sourceBlueprintId);
    if (!sourceBlueprint) {
      throw createError(`Source blueprint ${sourceBlueprintId} not found`, "BAD_REQUEST");
    }

    const invalidTargets = targetBlueprintIds.filter((targetId) => !blueprintMap.has(targetId));
    if (invalidTargets.length > 0) {
      throw createError(`Unknown target blueprint id(s): ${invalidTargets.join(", ")}`, "BAD_REQUEST");
    }

    for (const stretchKey of stretchKeys) {
      plans.push({
        stretchKey,
        sourceBlueprintId,
        targetBlueprintIds,
        mode: "legacy"
      });
    }
  }

  const results = [];
  const plannedOperationCount = plans.reduce(
    (sum, plan) => sum + Math.max(plan.targetBlueprintIds.length, 1),
    0
  );
  const pushResult = (entry) => {
    results.push(entry);
    emitStretchProgress("vxlan", entry, results.length, plannedOperationCount);
  };

  for (const plan of plans) {
    const stretchKey = plan.stretchKey;
    const sourceBlueprint = plan.sourceBlueprintId
      ? blueprintMap.get(plan.sourceBlueprintId)
      : null;

    const sourceVxlan = sourceBlueprint?.vxlanByStretchKey.get(stretchKey) || null;

    if (!sourceVxlan) {
      for (const targetBlueprintId of plan.targetBlueprintIds) {
        const targetBlueprint = blueprintMap.get(targetBlueprintId);
        pushResult({
          stretchKey,
          vxlanLabel: "Unknown VXLAN",
          vxlanVni: "",
          sourceBlueprintId: plan.sourceBlueprintId || "",
          sourceBlueprintName: sourceBlueprint?.blueprintName || "(auto)",
          targetBlueprintId,
          targetBlueprintName: targetBlueprint?.blueprintName || targetBlueprintId,
          status: "skipped_source_missing",
          message: plan.mode === "scope"
            ? "VXLAN is not present in any source blueprint within selected scope"
            : "VXLAN not present in source blueprint"
        });
      }

      continue;
    }

    if (plan.targetBlueprintIds.length === 0 && plan.mode === "scope") {
      pushResult({
        stretchKey,
        vxlanLabel: sourceVxlan.label,
        vxlanVni: sourceVxlan.vnId,
        sourceBlueprintId: sourceBlueprint.blueprintId,
        sourceBlueprintName: sourceBlueprint.blueprintName,
        targetBlueprintId: "",
        targetBlueprintName: "",
        status: "skipped_exists",
        message: "VXLAN already exists in all selected scope blueprints"
      });
      continue;
    }

    for (const targetBlueprintId of plan.targetBlueprintIds) {
      const targetBlueprint = blueprintMap.get(targetBlueprintId);

      if (!targetBlueprint || targetBlueprintId === sourceBlueprint.blueprintId) {
        continue;
      }

      if (targetBlueprint.vxlanByStretchKey.has(stretchKey)) {
        pushResult({
          stretchKey,
          vxlanLabel: sourceVxlan.label,
          vxlanVni: sourceVxlan.vnId,
          sourceBlueprintId: sourceBlueprint.blueprintId,
          sourceBlueprintName: sourceBlueprint.blueprintName,
          targetBlueprintId,
          targetBlueprintName: targetBlueprint.blueprintName,
          status: "skipped_exists",
          message: "VXLAN already exists in target blueprint"
        });
        continue;
      }

      const autoVlan = autoVlanStretchKeys.has(stretchKey);
      const conflict = findStretchConflict(targetBlueprint, {
        vni: sourceVxlan.vnId,
        vlanId: autoVlan ? null : resolveSourceVlanId(sourceVxlan),
        isRoutingZone: false,
        systemIds: targetBlueprint.assignableSystemIds
      });

      if (conflict) {
        pushResult({
          stretchKey,
          vxlanLabel: sourceVxlan.label,
          vxlanVni: sourceVxlan.vnId,
          sourceBlueprintId: sourceBlueprint.blueprintId,
          sourceBlueprintName: sourceBlueprint.blueprintName,
          targetBlueprintId,
          targetBlueprintName: targetBlueprint.blueprintName,
          status: "skipped_conflict",
          message: conflict.message
        });
        continue;
      }

      const targetSecurityZoneId = resolveTargetSecurityZoneId(sourceVxlan, sourceBlueprint, targetBlueprint);
      if (!targetSecurityZoneId) {
        pushResult({
          stretchKey,
          vxlanLabel: sourceVxlan.label,
          vxlanVni: sourceVxlan.vnId,
          sourceBlueprintId: sourceBlueprint.blueprintId,
          sourceBlueprintName: sourceBlueprint.blueprintName,
          targetBlueprintId,
          targetBlueprintName: targetBlueprint.blueprintName,
          status: "skipped_zone_missing",
          message: `Target blueprint has no "${sourceVxlan.securityZoneLabel || "matching"}" routing zone. Stretch the VRF first, then retry.`
        });
        continue;
      }

      const targetBoundTo = buildTargetBoundToBindings(sourceVxlan, targetBlueprint.assignableSystemIds, autoVlan);
      if (targetBoundTo.length === 0) {
        pushResult({
          stretchKey,
          vxlanLabel: sourceVxlan.label,
          vxlanVni: sourceVxlan.vnId,
          sourceBlueprintId: sourceBlueprint.blueprintId,
          sourceBlueprintName: sourceBlueprint.blueprintName,
          targetBlueprintId,
          targetBlueprintName: targetBlueprint.blueprintName,
          status: "failed",
          message: "No target switch bindings available for default all-switch assignment"
        });
        continue;
      }

      const payload = buildVirtualNetworkCreatePayload(sourceVxlan, targetSecurityZoneId, targetBoundTo, autoVlan);

      try {
        await apiPost(
          connection,
          `${API_ROOT}/blueprints/${encodeURIComponent(targetBlueprintId)}/${VIRTUAL_NETWORKS_PATH_SUFFIX}`,
          payload,
          token,
          authHeaders
        );

        targetBlueprint.vxlanByStretchKey.set(stretchKey, {
          ...sourceVxlan,
          id: "",
          securityZoneId: targetSecurityZoneId
        });

        pushResult({
          stretchKey,
          vxlanLabel: sourceVxlan.label,
          vxlanVni: sourceVxlan.vnId,
          sourceBlueprintId: sourceBlueprint.blueprintId,
          sourceBlueprintName: sourceBlueprint.blueprintName,
          targetBlueprintId,
          targetBlueprintName: targetBlueprint.blueprintName,
          status: "created",
          message: "VXLAN copied to target blueprint"
        });
      } catch (error) {
        pushResult({
          stretchKey,
          vxlanLabel: sourceVxlan.label,
          vxlanVni: sourceVxlan.vnId,
          sourceBlueprintId,
          sourceBlueprintName: sourceBlueprint.blueprintName,
          targetBlueprintId,
          targetBlueprintName: targetBlueprint.blueprintName,
          status: "failed",
          message: error?.message || "Failed to create VXLAN in target blueprint"
        });
      }
    }
  }

  const createdCount = results.filter((item) => item.status === "created").length;
  const skippedCount = results.filter((item) => item.status.startsWith("skipped")).length;
  const failedCount = results.filter((item) => item.status === "failed").length;

  if (createdCount > 0) {
    await waitForApstraToMaterialize();
  }

  return {
    generatedAt: Date.now(),
    sourceBlueprintId: sourceBlueprintId || "",
    sourceBlueprintName: sourceBlueprintId
      ? (blueprintMap.get(sourceBlueprintId)?.blueprintName || "")
      : "",
    targetBlueprintIds,
    scopeBlueprintIds,
    preferredSourceBlueprintId,
    selectedStretchKeyCount: stretchKeys.length,
    createdCount,
    skippedCount,
    failedCount,
    results
  };
}

async function stretchVrfs(request) {
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

  const sourceBlueprintId = asString(request?.sourceBlueprintId).trim();
  const targetBlueprintIds = dedupeStrings(
    Array.isArray(request?.targetBlueprintIds)
      ? request.targetBlueprintIds.map((item) => asString(item).trim()).filter(Boolean)
      : []
  );
  const scopeBlueprintIds = dedupeStrings(
    Array.isArray(request?.scopeBlueprintIds)
      ? request.scopeBlueprintIds.map((item) => asString(item).trim()).filter(Boolean)
      : []
  );
  const preferredSourceBlueprintId = asString(request?.preferredSourceBlueprintId).trim();
  const stretchKeys = dedupeStrings(
    Array.isArray(request?.stretchKeys)
      ? request.stretchKeys.map((item) => asString(item).trim()).filter(Boolean)
      : []
  );

  if (stretchKeys.length === 0) {
    throw createError("Select at least one VRF to stretch", "BAD_REQUEST");
  }

  // Keys the user asked to stretch without pinning the source VLAN, so Apstra allocates a free one.
  const autoVlanStretchKeys = new Set(
    Array.isArray(request?.autoVlanStretchKeys)
      ? request.autoVlanStretchKeys.map((item) => asString(item).trim()).filter(Boolean)
      : []
  );

  const tokenInfo = tokenCache.get(connection.origin) || {};
  const token = tokenInfo.token || null;
  const authHeaders = sanitizeCapturedHeaders(tokenInfo.authHeaders || {});

  const facts = await fetchBlueprintVrfFacts(connection, token, authHeaders);
  const blueprintMap = new Map(facts.blueprintRows.map((item) => [item.blueprintId, item]));

  const plans = [];

  if (scopeBlueprintIds.length > 0) {
    if (scopeBlueprintIds.length < 2) {
      throw createError("At least two scope blueprints are required", "BAD_REQUEST");
    }

    const invalidScope = scopeBlueprintIds.filter((item) => !blueprintMap.has(item));
    if (invalidScope.length > 0) {
      throw createError(`Unknown scope blueprint id(s): ${invalidScope.join(", ")}`, "BAD_REQUEST");
    }

    for (const stretchKey of stretchKeys) {
      const sourceCandidates = scopeBlueprintIds.filter((blueprintId) => {
        const blueprint = blueprintMap.get(blueprintId);
        return Boolean(blueprint?.vrfByStretchKey.has(stretchKey));
      });

      const targets = scopeBlueprintIds.filter((blueprintId) => {
        const blueprint = blueprintMap.get(blueprintId);
        return !blueprint?.vrfByStretchKey.has(stretchKey);
      });

      const selectedSourceBlueprintId = choosePreferredScopeSourceBlueprintId(
        sourceCandidates,
        preferredSourceBlueprintId,
        blueprintMap
      );

      plans.push({
        stretchKey,
        sourceBlueprintId: selectedSourceBlueprintId,
        targetBlueprintIds: targets,
        mode: "scope"
      });
    }
  } else {
    if (!sourceBlueprintId) {
      throw createError("sourceBlueprintId is required", "BAD_REQUEST");
    }

    if (targetBlueprintIds.length === 0) {
      throw createError("At least one target blueprint is required", "BAD_REQUEST");
    }

    const sourceBlueprint = blueprintMap.get(sourceBlueprintId);
    if (!sourceBlueprint) {
      throw createError(`Source blueprint ${sourceBlueprintId} not found`, "BAD_REQUEST");
    }

    const invalidTargets = targetBlueprintIds.filter((targetId) => !blueprintMap.has(targetId));
    if (invalidTargets.length > 0) {
      throw createError(`Unknown target blueprint id(s): ${invalidTargets.join(", ")}`, "BAD_REQUEST");
    }

    for (const stretchKey of stretchKeys) {
      plans.push({
        stretchKey,
        sourceBlueprintId,
        targetBlueprintIds,
        mode: "legacy"
      });
    }
  }

  const results = [];
  const plannedOperationCount = plans.reduce(
    (sum, plan) => sum + Math.max(plan.targetBlueprintIds.length, 1),
    0
  );
  const pushResult = (entry) => {
    results.push(entry);
    emitStretchProgress("vrf", entry, results.length, plannedOperationCount);
  };

  for (const plan of plans) {
    const stretchKey = plan.stretchKey;
    const sourceBlueprint = plan.sourceBlueprintId
      ? blueprintMap.get(plan.sourceBlueprintId)
      : null;

    const sourceVrf = sourceBlueprint?.vrfByStretchKey.get(stretchKey) || null;

    if (!sourceVrf) {
      for (const targetBlueprintId of plan.targetBlueprintIds) {
        const targetBlueprint = blueprintMap.get(targetBlueprintId);
        pushResult({
          stretchKey,
          vrfLabel: "Unknown VRF",
          sourceBlueprintId: plan.sourceBlueprintId || "",
          sourceBlueprintName: sourceBlueprint?.blueprintName || "(auto)",
          targetBlueprintId,
          targetBlueprintName: targetBlueprint?.blueprintName || targetBlueprintId,
          status: "skipped_source_missing",
          message: plan.mode === "scope"
            ? "VRF is not present in any source blueprint within selected scope"
            : "VRF not present in source blueprint"
        });
      }

      continue;
    }

    if (plan.targetBlueprintIds.length === 0 && plan.mode === "scope") {
      pushResult({
        stretchKey,
        vrfLabel: sourceVrf.label,
        sourceBlueprintId: sourceBlueprint.blueprintId,
        sourceBlueprintName: sourceBlueprint.blueprintName,
        targetBlueprintId: "",
        targetBlueprintName: "",
        status: "skipped_exists",
        message: "VRF already exists in all selected scope blueprints"
      });
      continue;
    }

    for (const targetBlueprintId of plan.targetBlueprintIds) {
      const targetBlueprint = blueprintMap.get(targetBlueprintId);

      if (!targetBlueprint || targetBlueprintId === sourceBlueprint.blueprintId) {
        continue;
      }

      if (targetBlueprint.vrfByStretchKey.has(stretchKey)) {
        pushResult({
          stretchKey,
          vrfLabel: sourceVrf.label,
          sourceBlueprintId: sourceBlueprint.blueprintId,
          sourceBlueprintName: sourceBlueprint.blueprintName,
          targetBlueprintId,
          targetBlueprintName: targetBlueprint.blueprintName,
          status: "skipped_exists",
          message: "VRF already exists in target blueprint"
        });
        continue;
      }

      const autoVlan = autoVlanStretchKeys.has(stretchKey);
      const conflict = findStretchConflict(targetBlueprint, {
        vni: sourceVrf.vniId,
        vlanId: autoVlan ? null : sourceVrf.vlanId,
        isRoutingZone: true
      });

      if (conflict) {
        pushResult({
          stretchKey,
          vrfLabel: sourceVrf.label,
          sourceBlueprintId: sourceBlueprint.blueprintId,
          sourceBlueprintName: sourceBlueprint.blueprintName,
          targetBlueprintId,
          targetBlueprintName: targetBlueprint.blueprintName,
          status: "skipped_conflict",
          message: conflict.message
        });
        continue;
      }

      const payload = buildSecurityZoneCreatePayload(sourceVrf, autoVlan);

      try {
        await apiPost(
          connection,
          `${API_ROOT}/blueprints/${encodeURIComponent(targetBlueprintId)}/${SECURITY_ZONES_PATH_SUFFIX}`,
          payload,
          token,
          authHeaders
        );

        targetBlueprint.vrfByStretchKey.set(stretchKey, {
          ...sourceVrf,
          id: ""
        });

        pushResult({
          stretchKey,
          vrfLabel: sourceVrf.label,
          sourceBlueprintId: sourceBlueprint.blueprintId,
          sourceBlueprintName: sourceBlueprint.blueprintName,
          targetBlueprintId,
          targetBlueprintName: targetBlueprint.blueprintName,
          status: "created",
          message: "VRF copied to target blueprint"
        });
      } catch (error) {
        pushResult({
          stretchKey,
          vrfLabel: sourceVrf.label,
          sourceBlueprintId: sourceBlueprint.blueprintId,
          sourceBlueprintName: sourceBlueprint.blueprintName,
          targetBlueprintId,
          targetBlueprintName: targetBlueprint.blueprintName,
          status: "failed",
          message: error?.message || "Failed to create VRF in target blueprint"
        });
      }
    }
  }

  const createdCount = results.filter((item) => item.status === "created").length;
  const skippedCount = results.filter((item) => item.status.startsWith("skipped")).length;
  const failedCount = results.filter((item) => item.status === "failed").length;

  if (createdCount > 0) {
    await waitForApstraToMaterialize();
  }

  return {
    generatedAt: Date.now(),
    sourceBlueprintId: sourceBlueprintId || "",
    sourceBlueprintName: sourceBlueprintId
      ? (blueprintMap.get(sourceBlueprintId)?.blueprintName || "")
      : "",
    targetBlueprintIds,
    scopeBlueprintIds,
    preferredSourceBlueprintId,
    selectedStretchKeyCount: stretchKeys.length,
    createdCount,
    skippedCount,
    failedCount,
    results
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
  const allBlueprints = (await fetchCollection(connection, `${API_ROOT}/blueprints`, token, authHeaders))
    .map(normalizeBlueprint)
    .filter((item) => item.id);

  const { supported: blueprints, skipped: skippedBlueprints } = partitionBlueprintsByDesign(allBlueprints);

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
  const skippedFromApi = [];

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
      try {
        payloadItems = await fetchCollection(
          connection,
          `${API_ROOT}/blueprints/${encodedId}/configlets`,
          token,
          authHeaders
        );
      } catch (error) {
        if (isUnsupportedBlueprintApiError(error)) {
          throw createError("Blueprint does not expose configlets", "BLUEPRINT_UNSUPPORTED", {
            blueprintDesign: blueprint.design
          });
        }

        throw error;
      }
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

      if (result.reason?.code === "BLUEPRINT_UNSUPPORTED") {
        skippedFromApi.push(buildSkippedBlueprintEntry(context, result.reason?.blueprintDesign));
        continue;
      }

      failures.push({
        blueprintId: context?.blueprintId || "unknown",
        blueprintName: context?.blueprintName || "Unknown blueprint",
        message: result.reason?.message || "Failed to load blueprint configlets"
      });
    }
  }

  const allSkippedBlueprints = [...skippedBlueprints, ...skippedFromApi];
  const analyzedBlueprintIds = new Set(
    blueprints
      .map((item) => item.id)
      .filter((id) => !allSkippedBlueprints.some((entry) => entry.blueprintId === id))
  );

  const groupedRows = groupAssignmentsByConfiglet(assignments);
  const unusedRows = buildUnusedConfigletRows(globalConfiglets, groupedRows);

  return {
    generatedAt: Date.now(),
    blueprintCount: analyzedBlueprintIds.size,
    assignmentCount: assignments.length,
    uniqueConfigletCount: groupedRows.length,
    unusedConfigletCount: unusedRows.length,
    outOfSyncConfigletCount: groupedRows.filter((row) => row.outOfSyncCount > 0).length,
    partialFailures: failures,
    skippedBlueprints: allSkippedBlueprints,
    rows: groupedRows,
    unusedRows
  };
}

async function fetchGatewayConnectionsReport(connection, token, authHeaders) {
  const allBlueprints = (await fetchCollection(connection, `${API_ROOT}/blueprints`, token, authHeaders))
    .map(normalizeBlueprint)
    .filter((item) => item.id);

  const { supported: blueprints, skipped: skippedBlueprints } = partitionBlueprintsByDesign(allBlueprints);

  const failures = [];

  const settledResults = await mapWithConcurrency(blueprints, 4, async (blueprint) => {
    const encodedId = encodeURIComponent(blueprint.id);

    let remoteGatewayPayload;
    try {
      remoteGatewayPayload = await apiGet(
        connection,
        `${API_ROOT}/blueprints/${encodedId}/remote_gateways`,
        token,
        authHeaders
      );
    } catch (error) {
      if (isUnsupportedBlueprintApiError(error)) {
        throw createError("Blueprint does not expose remote gateways", "BLUEPRINT_UNSUPPORTED", {
          blueprintDesign: blueprint.design
        });
      }

      throw error;
    }

    const remoteGateways = normalizeRemoteGatewayCollection(remoteGatewayPayload);
    const bgpFacts = await fetchBlueprintBgpSessionFacts(connection, blueprint.id, token, authHeaders);

    return {
      blueprint,
      remoteGateways,
      bgpSessions: bgpFacts.sessions,
      bgpPairKeys: bgpFacts.bgpPairKeys
    };
  });

  const blueprintFacts = [];
  for (const result of settledResults) {
    if (result.status === "fulfilled") {
      blueprintFacts.push(result.value);
      continue;
    }

    const context = result.reason?.context;

    if (result.reason?.code === "BLUEPRINT_UNSUPPORTED") {
      skippedBlueprints.push(buildSkippedBlueprintEntry(context, result.reason?.blueprintDesign));
      continue;
    }

    failures.push({
      blueprintId: context?.blueprintId || "unknown",
      blueprintName: context?.blueprintName || "Unknown blueprint",
      message: result.reason?.message || "Failed to build gateway facts"
    });
  }

  const blueprintFactsById = new Map(blueprintFacts.map((item) => [item.blueprint.id, item]));
  const localEvpnIpIndex = new Map();

  for (const fact of blueprintFacts) {
    for (const gateway of fact.remoteGateways) {
      for (const ip of gateway.localEvpnIps) {
        if (!localEvpnIpIndex.has(ip)) {
          localEvpnIpIndex.set(ip, []);
        }

        localEvpnIpIndex.get(ip).push({
          blueprintId: fact.blueprint.id,
          blueprintName: fact.blueprint.name,
          gateway
        });
      }
    }
  }

  const connectionRowsByKey = new Map();
  const unmatchedRows = [];

  for (const sourceFact of blueprintFacts) {
    for (const sourceGateway of sourceFact.remoteGateways) {
      const sourceGatewayIp = sourceGateway.gwIp;

      if (!sourceGatewayIp) {
        unmatchedRows.push({
          rowKey: `missing-ip:${sourceFact.blueprint.id}:${sourceGateway.id || sourceGateway.name}`,
          blueprintId: sourceFact.blueprint.id,
          blueprintName: sourceFact.blueprint.name,
          gatewayId: sourceGateway.id,
          gatewayName: sourceGateway.name,
          gatewayIp: "",
          localNodeLabels: sourceGateway.localNodeLabels,
          localEvpnIps: sourceGateway.localEvpnIps,
          reason: "Gateway has no gw_ip configured."
        });
        continue;
      }

      const candidates = (localEvpnIpIndex.get(sourceGatewayIp) || [])
        .filter((candidate) => candidate.blueprintId !== sourceFact.blueprint.id);

      if (candidates.length === 0) {
        unmatchedRows.push({
          rowKey: `unmatched:${sourceFact.blueprint.id}:${sourceGateway.id || sourceGateway.name}:${sourceGatewayIp}`,
          blueprintId: sourceFact.blueprint.id,
          blueprintName: sourceFact.blueprint.name,
          gatewayId: sourceGateway.id,
          gatewayName: sourceGateway.name,
          gatewayIp: sourceGatewayIp,
          localNodeLabels: sourceGateway.localNodeLabels,
          localEvpnIps: sourceGateway.localEvpnIps,
          reason: "No blueprint local gateway EVPN internal RD IP matches this gw_ip."
        });
        continue;
      }

      for (const candidate of candidates) {
        const targetFact = blueprintFactsById.get(candidate.blueprintId);
        if (!targetFact) {
          continue;
        }

        const targetGateway = candidate.gateway;
        const reciprocalConfig = Boolean(
          targetGateway?.gwIp && sourceGateway.localEvpnIps.includes(targetGateway.gwIp)
        );

        const sharedBgpPairs = intersectStringArrays(sourceFact.bgpPairKeys, targetFact.bgpPairKeys);
        const hasBgpEvidence = sharedBgpPairs.length > 0;

        const rowKey = buildGatewayConnectionKey(
          sourceFact.blueprint.id,
          sourceGateway.id || sourceGateway.name || sourceGateway.gwIp || "unknown",
          targetFact.blueprint.id,
          targetGateway.id || targetGateway.name || targetGateway.gwIp || "unknown"
        );

        const existing = connectionRowsByKey.get(rowKey);
        if (existing) {
          existing.reciprocalConfig = existing.reciprocalConfig || reciprocalConfig;
          existing.hasBgpEvidence = existing.hasBgpEvidence || hasBgpEvidence;
          existing.sharedBgpPairs = dedupeStrings(existing.sharedBgpPairs.concat(sharedBgpPairs));
          continue;
        }

        connectionRowsByKey.set(rowKey, {
          rowKey,
          sourceBlueprintId: sourceFact.blueprint.id,
          sourceBlueprintName: sourceFact.blueprint.name,
          sourceGatewayId: sourceGateway.id,
          sourceGatewayName: sourceGateway.name,
          sourceGatewayIp,
          sourceGatewayAsn: sourceGateway.gwAsn,
          sourceLocalNodeLabels: sourceGateway.localNodeLabels,
          sourceLocalEvpnIps: sourceGateway.localEvpnIps,
          targetBlueprintId: targetFact.blueprint.id,
          targetBlueprintName: targetFact.blueprint.name,
          targetGatewayId: targetGateway.id,
          targetGatewayName: targetGateway.name,
          targetGatewayIp: targetGateway.gwIp,
          targetGatewayAsn: targetGateway.gwAsn,
          targetLocalNodeLabels: targetGateway.localNodeLabels,
          targetLocalEvpnIps: targetGateway.localEvpnIps,
          reciprocalConfig,
          hasBgpEvidence,
          sharedBgpPairs
        });
      }
    }
  }

  const connectionRows = Array.from(connectionRowsByKey.values())
    .map((row) => ({
      ...row,
      confidence: buildGatewayConnectionConfidence(row.reciprocalConfig, row.hasBgpEvidence)
    }))
    .sort((a, b) => {
      const rankDiff = gatewayConfidenceRank(b.confidence) - gatewayConfidenceRank(a.confidence);
      if (rankDiff !== 0) {
        return rankDiff;
      }

      const sourceDiff = a.sourceBlueprintName.localeCompare(b.sourceBlueprintName);
      if (sourceDiff !== 0) {
        return sourceDiff;
      }

      return a.targetBlueprintName.localeCompare(b.targetBlueprintName);
    });

  const blueprintRows = blueprintFacts
    .map((fact) => ({
      blueprintId: fact.blueprint.id,
      blueprintName: fact.blueprint.name,
      remoteGatewayCount: fact.remoteGateways.length,
      bgpSessionCount: fact.bgpSessions.length,
      bgpPairCount: fact.bgpPairKeys.length
    }))
    .sort((a, b) => b.remoteGatewayCount - a.remoteGatewayCount || a.blueprintName.localeCompare(b.blueprintName));

  const totalRemoteGateways = blueprintRows.reduce((sum, row) => sum + row.remoteGatewayCount, 0);
  const blueprintsWithGateways = blueprintRows.filter((row) => row.remoteGatewayCount > 0).length;
  const blueprintsWithBgp = blueprintRows.filter((row) => row.bgpSessionCount > 0).length;

  const blueprintPairKeys = new Set(
    connectionRows.map((row) => buildBlueprintPairKey(row.sourceBlueprintId, row.targetBlueprintId))
  );

  return {
    generatedAt: Date.now(),
    blueprintCount: blueprintFacts.length,
    blueprintsWithGateways,
    blueprintsWithBgp,
    totalRemoteGateways,
    connectionCount: connectionRows.length,
    blueprintPairCount: blueprintPairKeys.size,
    reciprocalConnectionCount: connectionRows.filter((row) => row.reciprocalConfig).length,
    bgpBackedConnectionCount: connectionRows.filter((row) => row.hasBgpEvidence).length,
    unmatchedGatewayCount: unmatchedRows.length,
    partialFailures: failures,
    skippedBlueprints,
    rows: connectionRows,
    unmatchedRows,
    blueprintRows
  };
}

async function fetchVxlanStretchReport(connection, token, authHeaders) {
  const facts = await fetchBlueprintVxlanFacts(connection, token, authHeaders);
  const allBlueprintIds = facts.blueprintRows.map((item) => item.blueprintId);

  const rows = facts.rows.map((row) => {
    const presenceIds = row.presentBlueprints.map((item) => item.blueprintId);
    const missingIds = allBlueprintIds.filter((id) => !presenceIds.includes(id));

    return {
      ...row,
      presenceBlueprintIds: presenceIds,
      missingBlueprintIds: missingIds
    };
  });

  const totalVxlans = facts.blueprintRows.reduce((sum, item) => sum + item.vxlanCount, 0);
  const fullyPresentCount = rows.filter((row) => row.presentBlueprints.length === allBlueprintIds.length).length;
  const partialCount = rows.filter((row) => row.presentBlueprints.length > 0 && row.presentBlueprints.length < allBlueprintIds.length).length;

  return {
    generatedAt: Date.now(),
    blueprintCount: facts.blueprintRows.length,
    totalVxlanCount: totalVxlans,
    uniqueVxlanCount: rows.length,
    fullPresenceCount: fullyPresentCount,
    partialPresenceCount: partialCount,
    partialFailures: facts.partialFailures,
    skippedBlueprints: facts.skippedBlueprints,
    blueprints: facts.blueprintRows,
    rows
  };
}

async function fetchVrfStretchReport(connection, token, authHeaders) {
  const facts = await fetchBlueprintVrfFacts(connection, token, authHeaders);
  const allBlueprintIds = facts.blueprintRows.map((item) => item.blueprintId);

  const rows = facts.rows.map((row) => {
    const presenceIds = row.presentBlueprints.map((item) => item.blueprintId);
    const missingIds = allBlueprintIds.filter((id) => !presenceIds.includes(id));

    return {
      ...row,
      presenceBlueprintIds: presenceIds,
      missingBlueprintIds: missingIds
    };
  });

  const totalVrfs = facts.blueprintRows.reduce((sum, item) => sum + item.vrfCount, 0);
  const fullyPresentCount = rows.filter((row) => row.presentBlueprints.length === allBlueprintIds.length).length;
  const partialCount = rows.filter((row) => row.presentBlueprints.length > 0 && row.presentBlueprints.length < allBlueprintIds.length).length;

  return {
    generatedAt: Date.now(),
    blueprintCount: facts.blueprintRows.length,
    totalVrfCount: totalVrfs,
    uniqueVrfCount: rows.length,
    fullPresenceCount: fullyPresentCount,
    partialPresenceCount: partialCount,
    partialFailures: facts.partialFailures,
    skippedBlueprints: facts.skippedBlueprints,
    blueprints: facts.blueprintRows,
    rows
  };
}

async function fetchBlueprintVrfFacts(connection, token, authHeaders) {
  const allBlueprints = (await fetchCollection(connection, `${API_ROOT}/blueprints`, token, authHeaders))
    .map(normalizeBlueprint)
    .filter((item) => item.id);

  const { supported: blueprints, skipped: skippedBlueprints } = partitionBlueprintsByDesign(allBlueprints);

  const partialFailures = [];

  const settledResults = await mapWithConcurrency(blueprints, 4, async (blueprint) => {
    const encodedId = encodeURIComponent(blueprint.id);

    let securityZonePayload;
    let virtualNetworkPayload;
    try {
      // Virtual networks are needed too: their VNIs share the namespace with routing zones.
      [securityZonePayload, virtualNetworkPayload] = await Promise.all([
        apiGet(
          connection,
          `${API_ROOT}/blueprints/${encodedId}/${SECURITY_ZONES_PATH_SUFFIX}`,
          token,
          authHeaders
        ),
        apiGet(
          connection,
          `${API_ROOT}/blueprints/${encodedId}/${VIRTUAL_NETWORKS_PATH_SUFFIX}`,
          token,
          authHeaders
        )
      ]);
    } catch (error) {
      if (isUnsupportedBlueprintApiError(error)) {
        throw createError("Blueprint does not expose security zones", "BLUEPRINT_UNSUPPORTED", {
          blueprintDesign: blueprint.design
        });
      }

      throw error;
    }

    const securityZones = normalizeSecurityZoneCollection(securityZonePayload);
    const securityZoneById = new Map(securityZones.map((zone) => [zone.id, zone]));
    const vrfs = securityZones.filter((zone) => zone.stretchKey);

    return {
      blueprintId: blueprint.id,
      blueprintName: blueprint.name,
      vrfCount: vrfs.length,
      conflictIndex: buildBlueprintConflictIndex(
        normalizeVirtualNetworkCollection(virtualNetworkPayload, securityZoneById),
        securityZones
      ),
      vrfs,
      vrfByStretchKey: new Map(vrfs.map((zone) => [zone.stretchKey, zone]))
    };
  });

  const blueprintRows = [];

  for (const result of settledResults) {
    if (result.status === "fulfilled") {
      blueprintRows.push(result.value);
      continue;
    }

    const context = result.reason?.context;

    if (result.reason?.code === "BLUEPRINT_UNSUPPORTED") {
      skippedBlueprints.push(buildSkippedBlueprintEntry(context, result.reason?.blueprintDesign));
      continue;
    }

    partialFailures.push({
      blueprintId: context?.blueprintId || "unknown",
      blueprintName: context?.blueprintName || "Unknown blueprint",
      message: result.reason?.message || "Failed to load blueprint VRF/security-zone data"
    });
  }

  blueprintRows.sort((a, b) => a.blueprintName.localeCompare(b.blueprintName));

  const rowMap = new Map();

  for (const blueprint of blueprintRows) {
    for (const vrf of blueprint.vrfs) {
      if (!rowMap.has(vrf.stretchKey)) {
        rowMap.set(vrf.stretchKey, {
          stretchKey: vrf.stretchKey,
          primaryLabel: vrf.label,
          labels: vrf.label ? [vrf.label] : [],
          vrfNames: vrf.vrfName ? [vrf.vrfName] : [],
          vrfTypes: vrf.type ? [vrf.type] : [],
          presentBlueprints: []
        });
      }

      const row = rowMap.get(vrf.stretchKey);
      row.presentBlueprints.push({
        blueprintId: blueprint.blueprintId,
        blueprintName: blueprint.blueprintName,
        vrfId: vrf.id,
        label: vrf.label,
        vrfName: vrf.vrfName,
        vrfType: vrf.type,
        vniId: vrf.vniId,
        vlanId: vrf.vlanId
      });

      if (vrf.label && !row.labels.includes(vrf.label)) {
        row.labels.push(vrf.label);
      }

      if (vrf.vrfName && !row.vrfNames.includes(vrf.vrfName)) {
        row.vrfNames.push(vrf.vrfName);
      }

      if (vrf.type && !row.vrfTypes.includes(vrf.type)) {
        row.vrfTypes.push(vrf.type);
      }
    }
  }

  const rows = Array.from(rowMap.values())
    .map((row) => ({
      stretchKey: row.stretchKey,
      primaryLabel: row.primaryLabel,
      labels: row.labels.sort((a, b) => a.localeCompare(b)),
      vrfNames: row.vrfNames.sort((a, b) => a.localeCompare(b)),
      vrfTypes: row.vrfTypes.sort((a, b) => a.localeCompare(b)),
      presentBlueprints: row.presentBlueprints.sort((a, b) => a.blueprintName.localeCompare(b.blueprintName))
    }))
    .sort((a, b) => {
      const presenceDiff = b.presentBlueprints.length - a.presentBlueprints.length;
      if (presenceDiff !== 0) {
        return presenceDiff;
      }

      return (a.primaryLabel || "").localeCompare(b.primaryLabel || "");
    });

  return {
    partialFailures,
    skippedBlueprints,
    blueprintRows,
    rows
  };
}

async function fetchBlueprintVxlanFacts(connection, token, authHeaders) {
  const allBlueprints = (await fetchCollection(connection, `${API_ROOT}/blueprints`, token, authHeaders))
    .map(normalizeBlueprint)
    .filter((item) => item.id);

  const { supported: blueprints, skipped: skippedBlueprints } = partitionBlueprintsByDesign(allBlueprints);

  const partialFailures = [];

  const settledResults = await mapWithConcurrency(blueprints, 4, async (blueprint) => {
    const encodedId = encodeURIComponent(blueprint.id);

    let virtualNetworkPayload;
    let securityZonePayload;
    try {
      [virtualNetworkPayload, securityZonePayload] = await Promise.all([
        apiGet(
          connection,
          `${API_ROOT}/blueprints/${encodedId}/${VIRTUAL_NETWORKS_PATH_SUFFIX}`,
          token,
          authHeaders
        ),
        apiGet(
          connection,
          `${API_ROOT}/blueprints/${encodedId}/${SECURITY_ZONES_PATH_SUFFIX}`,
          token,
          authHeaders
        )
      ]);
    } catch (error) {
      if (isUnsupportedBlueprintApiError(error)) {
        throw createError("Blueprint does not expose virtual networks", "BLUEPRINT_UNSUPPORTED", {
          blueprintDesign: blueprint.design
        });
      }

      throw error;
    }

    const systemNodes = await fetchBlueprintBindingTargets(connection, blueprint.id, token, authHeaders);

    const securityZones = normalizeSecurityZoneCollection(securityZonePayload);
    const securityZoneById = new Map(securityZones.map((zone) => [zone.id, zone]));

    const vxlans = normalizeVirtualNetworkCollection(virtualNetworkPayload, securityZoneById);
    const vxlanByStretchKey = new Map(vxlans.map((vn) => [vn.stretchKey, vn]));
    const switchSystemIds = dedupeStrings(systemNodes);

    return {
      blueprintId: blueprint.id,
      blueprintName: blueprint.name,
      securityZoneCount: securityZones.length,
      vxlanCount: vxlans.length,
      switchSystemCount: switchSystemIds.length,
      securityZoneById,
      securityZoneByLabelKey: new Map(
        securityZones
          .filter((zone) => zone.labelKey)
          .map((zone) => [zone.labelKey, zone.id])
      ),
      securityZoneLabelKeys: dedupeStrings(securityZones.map((zone) => zone.labelKey).filter(Boolean)),
      conflictIndex: buildBlueprintConflictIndex(vxlans, securityZones),
      assignableSystemIds: switchSystemIds,
      vxlans,
      vxlanByStretchKey
    };
  });

  const blueprintRows = [];

  for (const result of settledResults) {
    if (result.status === "fulfilled") {
      blueprintRows.push(result.value);
      continue;
    }

    const context = result.reason?.context;

    if (result.reason?.code === "BLUEPRINT_UNSUPPORTED") {
      skippedBlueprints.push(buildSkippedBlueprintEntry(context, result.reason?.blueprintDesign));
      continue;
    }

    partialFailures.push({
      blueprintId: context?.blueprintId || "unknown",
      blueprintName: context?.blueprintName || "Unknown blueprint",
      message: result.reason?.message || "Failed to load blueprint VXLAN/security-zone data"
    });
  }

  blueprintRows.sort((a, b) => a.blueprintName.localeCompare(b.blueprintName));

  const rowMap = new Map();

  for (const blueprint of blueprintRows) {
    for (const vxlan of blueprint.vxlans) {
      if (!rowMap.has(vxlan.stretchKey)) {
        rowMap.set(vxlan.stretchKey, {
          stretchKey: vxlan.stretchKey,
          vnId: vxlan.vnId,
          vnType: vxlan.vnType,
          primaryLabel: vxlan.label,
          securityZoneLabelKey: normalizeLookupKey(vxlan.securityZoneLabel || ""),
          labels: [vxlan.label],
          securityZoneLabels: vxlan.securityZoneLabel ? [vxlan.securityZoneLabel] : [],
          ipv4Subnets: vxlan.ipv4Subnet ? [vxlan.ipv4Subnet] : [],
          ipv6Subnets: vxlan.ipv6Subnet ? [vxlan.ipv6Subnet] : [],
          presentBlueprints: []
        });
      }

      const row = rowMap.get(vxlan.stretchKey);
      row.presentBlueprints.push({
        blueprintId: blueprint.blueprintId,
        blueprintName: blueprint.blueprintName,
        vxlanId: vxlan.id,
        label: vxlan.label,
        vnId: vxlan.vnId,
        vlanId: resolveSourceVlanId(vxlan)
      });

      if (vxlan.label && !row.labels.includes(vxlan.label)) {
        row.labels.push(vxlan.label);
      }

      if (vxlan.securityZoneLabel && !row.securityZoneLabels.includes(vxlan.securityZoneLabel)) {
        row.securityZoneLabels.push(vxlan.securityZoneLabel);
      }

      if (vxlan.ipv4Subnet && !row.ipv4Subnets.includes(vxlan.ipv4Subnet)) {
        row.ipv4Subnets.push(vxlan.ipv4Subnet);
      }

      if (vxlan.ipv6Subnet && !row.ipv6Subnets.includes(vxlan.ipv6Subnet)) {
        row.ipv6Subnets.push(vxlan.ipv6Subnet);
      }
    }
  }

  const rows = Array.from(rowMap.values())
    .map((row) => ({
      stretchKey: row.stretchKey,
      vnId: row.vnId,
      vnType: row.vnType,
      primaryLabel: row.primaryLabel,
      securityZoneLabelKey: row.securityZoneLabelKey,
      labels: row.labels.sort((a, b) => a.localeCompare(b)),
      securityZoneLabels: row.securityZoneLabels.sort((a, b) => a.localeCompare(b)),
      ipv4Subnets: row.ipv4Subnets.sort((a, b) => a.localeCompare(b)),
      ipv6Subnets: row.ipv6Subnets.sort((a, b) => a.localeCompare(b)),
      presentBlueprints: row.presentBlueprints.sort((a, b) => a.blueprintName.localeCompare(b.blueprintName))
    }))
    .sort((a, b) => {
      const presenceDiff = b.presentBlueprints.length - a.presentBlueprints.length;
      if (presenceDiff !== 0) {
        return presenceDiff;
      }

      const vniDiff = compareOptionalNumbers(a.vnId, b.vnId);
      if (vniDiff !== 0) {
        return vniDiff;
      }

      return (a.primaryLabel || "").localeCompare(b.primaryLabel || "");
    });

  return {
    partialFailures,
    skippedBlueprints,
    blueprintRows,
    rows
  };
}

function normalizeVirtualNetworkCollection(payload, securityZoneById) {
  const values = extractCollectionValues(payload, ["virtual_networks", "items", "results", "data"]);

  return values
    .map((item) => normalizeVirtualNetwork(item, securityZoneById))
    .filter((item) => item.stretchKey);
}

// VNIs share one namespace per blueprint across virtual networks AND routing zones.
// VN VLANs must be unique per leaf; routing-zone VLANs must be unique blueprint-wide.
function buildBlueprintConflictIndex(vxlans, securityZones) {
  const vniOwners = {};
  const routingZoneVlans = {};
  const vlansBySystem = {};
  // Routing-zone VLANs must be unique against every other routing zone AND every
  // virtual network VLAN in the blueprint, regardless of which leaf uses it.
  const blueprintWideVlans = {};

  for (const zone of securityZones) {
    const vni = asString(zone.vniId).trim();
    if (vni) {
      vniOwners[vni] = { kind: "routing_zone", label: zone.label };
    }

    const vlanId = asVlanId(zone.vlanId);
    if (vlanId !== null) {
      routingZoneVlans[String(vlanId)] = zone.label;
      blueprintWideVlans[String(vlanId)] = { kind: "routing_zone", label: zone.label };
    }
  }

  for (const vxlan of vxlans) {
    const vni = asString(vxlan.vnId).trim();
    if (vni) {
      vniOwners[vni] = { kind: "virtual_network", label: vxlan.label };
    }

    const reservedVlanId = asVlanId(vxlan.reservedVlanId);
    if (reservedVlanId !== null) {
      blueprintWideVlans[String(reservedVlanId)] = { kind: "virtual_network", label: vxlan.label };
    }

    for (const binding of vxlan.boundTo || []) {
      const vlanId = asVlanId(binding.vlanId);
      if (vlanId === null) {
        continue;
      }

      blueprintWideVlans[String(vlanId)] = { kind: "virtual_network", label: vxlan.label };

      if (!binding.systemId) {
        continue;
      }

      if (!vlansBySystem[binding.systemId]) {
        vlansBySystem[binding.systemId] = {};
      }

      vlansBySystem[binding.systemId][String(vlanId)] = vxlan.label;
    }
  }

  return { vniOwners, routingZoneVlans, blueprintWideVlans, vlansBySystem };
}

// Returns the reason a source object cannot be created in this blueprint, or null when clear.
function findStretchConflict(target, { vni, vlanId, isRoutingZone, systemIds }) {
  const index = target?.conflictIndex;
  if (!index) {
    return null;
  }

  const vniKey = asString(vni).trim();
  const owner = vniKey ? index.vniOwners[vniKey] : null;
  if (owner) {
    return {
      type: "vni",
      value: vniKey,
      ownerKind: owner.kind,
      ownerLabel: owner.label,
      message: `VNI ${vniKey} is already used by ${owner.kind === "routing_zone" ? "routing zone" : "virtual network"} "${owner.label}" in ${target.blueprintName}.`
    };
  }

  const vlan = asVlanId(vlanId);
  if (vlan === null) {
    return null;
  }

  if (isRoutingZone) {
    const zoneOwner = index.blueprintWideVlans?.[String(vlan)];
    if (zoneOwner) {
      return {
        type: "vlan",
        value: String(vlan),
        ownerKind: zoneOwner.kind,
        ownerLabel: zoneOwner.label,
        message: `VLAN ${vlan} is already used by ${zoneOwner.kind === "routing_zone" ? "routing zone" : "virtual network"} "${zoneOwner.label}" in ${target.blueprintName}.`
      };
    }

    return null;
  }

  if (!isRoutingZone) {
    for (const systemId of systemIds || []) {
      const vnOwner = index.vlansBySystem?.[systemId]?.[String(vlan)];
      if (vnOwner) {
        return {
          type: "vlan",
          value: String(vlan),
          ownerKind: "virtual_network",
          ownerLabel: vnOwner,
          message: `VLAN ${vlan} is already used by virtual network "${vnOwner}" on a target switch in ${target.blueprintName}.`
        };
      }
    }
  }

  return null;
}

function normalizeVirtualNetwork(value, securityZoneById) {
  const source = value && typeof value === "object" ? value : {};

  const securityZoneId = firstString(source, ["security_zone_id"]) || "";
  const securityZoneLabel = securityZoneById.get(securityZoneId)?.label || "";

  const vnIdRaw = source.vn_id;
  const vnId = vnIdRaw === null || vnIdRaw === undefined ? "" : String(vnIdRaw).trim();

  const boundTo = Array.isArray(source.bound_to)
    ? source.bound_to
      .map((item) => {
        const binding = item && typeof item === "object" ? item : {};
        return {
          systemId: firstString(binding, ["system_id", "id", "uuid"]) || "",
          accessSwitchNodeIds: Array.isArray(binding.access_switch_node_ids)
            ? binding.access_switch_node_ids.map((entry) => asString(entry)).filter(Boolean)
            : [],
          vlanId: asFiniteNumber(binding.vlan_id)
        };
      })
      .filter((item) => item.systemId)
    : [];

  const normalized = {
    id: firstString(source, ["id", "uuid"]) || "",
    label: firstString(source, ["label", "name", "display_name"]) || "Unnamed VXLAN",
    description: source.description === null ? null : asString(source.description),
    vnType: firstString(source, ["vn_type"]) || "vxlan",
    vnId,
    reservedVlanId: asFiniteNumber(source.reserved_vlan_id),
    ipv4Subnet: firstString(source, ["ipv4_subnet"]) || "",
    ipv6Subnet: firstString(source, ["ipv6_subnet"]) || "",
    virtualGatewayIpv4: firstString(source, ["virtual_gateway_ipv4"]) || "",
    virtualGatewayIpv6: firstString(source, ["virtual_gateway_ipv6"]) || "",
    virtualGatewayIpv4Enabled: Boolean(source.virtual_gateway_ipv4_enabled),
    virtualGatewayIpv6Enabled: Boolean(source.virtual_gateway_ipv6_enabled),
    virtualMac: firstString(source, ["virtual_mac"]) || "",
    ipv4Enabled: source.ipv4_enabled !== false,
    ipv6Enabled: Boolean(source.ipv6_enabled),
    dhcpService: firstString(source, ["dhcp_service"]) || "",
    securityZoneId,
    securityZoneLabel,
    rtPolicy: source.rt_policy ?? null,
    routeTarget: firstString(source, ["route_target"]) || "",
    l3Mtu: asFiniteNumber(source.l3_mtu),
    tenant: source.tenant ?? null,
    tags: Array.isArray(source.tags) ? source.tags : [],
    boundTo
  };

  normalized.stretchKey = buildVxlanStretchKey(normalized);
  return normalized;
}

function normalizeSecurityZoneCollection(payload) {
  const values = extractCollectionValues(payload, ["security_zones", "items", "results", "data"]);

  return values
    .map((item) => {
      const zone = item && typeof item === "object" ? item : {};
      const label = firstString(zone, ["label", "name", "display_name"]) || "";
      const importRouteTargets = dedupeStrings(
        Array.isArray(zone.import_route_targets)
          ? zone.import_route_targets.map((entry) => asString(entry)).filter(Boolean)
          : []
      );
      const exportRouteTargets = dedupeStrings(
        Array.isArray(zone.export_route_targets)
          ? zone.export_route_targets.map((entry) => asString(entry)).filter(Boolean)
          : []
      );

      const normalized = {
        id: firstString(zone, ["id", "uuid"]) || "",
        label,
        labelKey: normalizeLookupKey(label),
        type: firstString(zone, ["sz_type", "type"]) || "",
        vrfName: firstString(zone, ["vrf_name", "routing_zone_name"]) || label,
        vnId: firstString(zone, ["vn_id", "vni"]) || "",
        vniId: zone.vni_id === null || zone.vni_id === undefined ? "" : String(zone.vni_id).trim(),
        vlanId: asVlanId(zone.vlan_id),
        description: zone.description === null ? null : asString(zone.description),
        rtPolicy: zone.rt_policy ?? null,
        routeTarget: firstString(zone, ["route_target"]) || "",
        importRouteTargets,
        exportRouteTargets,
        tenant: zone.tenant ?? null,
        tags: Array.isArray(zone.tags) ? zone.tags : [],
        rawSource: stripSecurityZoneReadOnlyFields(zone)
      };

      normalized.stretchKey = buildVrfStretchKey(normalized);
      return normalized;
    })
    .filter((zone) => zone.id);
}

function buildVrfStretchKey(vrf) {
  const vni = asString(vrf?.vnId).trim();
  if (vni) {
    return `vni:${vni}`;
  }

  const vrfNameKey = normalizeLookupKey(vrf?.vrfName || "");
  const labelKey = normalizeLookupKey(vrf?.label || "");
  const typeKey = normalizeLookupKey(vrf?.type || "");
  const primaryKey = vrfNameKey || labelKey;

  if (!primaryKey) {
    return "";
  }

  return `vrf:${primaryKey}|type:${typeKey}`;
}

function stripSecurityZoneReadOnlyFields(zone) {
  const source = zone && typeof zone === "object" ? zone : {};
  const output = {};

  for (const [key, value] of Object.entries(source)) {
    const lowerKey = key.toLowerCase();

    if (
      lowerKey === "id" ||
      lowerKey === "uuid" ||
      lowerKey === "href" ||
      lowerKey === "display_name" ||
      lowerKey === "created_at" ||
      lowerKey === "updated_at" ||
      lowerKey === "last_modified_at" ||
      lowerKey === "last_modified_by" ||
      lowerKey === "resource_type" ||
      lowerKey === "blueprint_id" ||
      lowerKey === "status" ||
      lowerKey === "_id" ||
      lowerKey === "_key" ||
      lowerKey === "_rev" ||
      lowerKey === "links" ||
      // References/allocations that only exist inside the source blueprint.
      lowerKey === "vrf_id" ||
      lowerKey === "routing_policy_id" ||
      lowerKey === "policy_id" ||
      lowerKey === "virtual_network_policy_id" ||
      lowerKey === "vlan_id"
    ) {
      continue;
    }

    output[key] = value;
  }

  return stripUndefinedProperties(output);
}

function extractCollectionValues(payload, preferredKeys = []) {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  for (const key of preferredKeys) {
    const candidate = payload[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }

    if (candidate && typeof candidate === "object") {
      return Object.values(candidate);
    }
  }

  return [];
}

function buildVxlanStretchKey(vxlan) {
  const vni = asString(vxlan?.vnId).trim();
  if (vni) {
    return `vni:${vni}`;
  }

  const labelKey = normalizeLookupKey(vxlan?.label || "");
  const zoneKey = normalizeLookupKey(vxlan?.securityZoneLabel || "");
  const subnet4 = normalizeLookupKey(vxlan?.ipv4Subnet || "");
  const subnet6 = normalizeLookupKey(vxlan?.ipv6Subnet || "");

  if (!labelKey) {
    return "";
  }

  return `label:${labelKey}|zone:${zoneKey}|subnet4:${subnet4}|subnet6:${subnet6}`;
}

function resolveTargetSecurityZoneId(sourceVxlan, sourceBlueprint, targetBlueprint) {
  if (!sourceVxlan || !targetBlueprint) {
    return "";
  }

  if (
    sourceVxlan.securityZoneId &&
    targetBlueprint.securityZoneById.has(sourceVxlan.securityZoneId)
  ) {
    return sourceVxlan.securityZoneId;
  }

  const sourceZoneLabel = sourceVxlan.securityZoneLabel ||
    sourceBlueprint.securityZoneById.get(sourceVxlan.securityZoneId)?.label ||
    "";

  const sourceZoneKey = normalizeLookupKey(sourceZoneLabel);
  if (!sourceZoneKey) {
    return "";
  }

  return targetBlueprint.securityZoneByLabelKey.get(sourceZoneKey) || "";
}

function buildVirtualNetworkCreatePayload(sourceVxlan, targetSecurityZoneId, boundTo, autoAssignVlan = false) {
  const payload = {
    label: sourceVxlan.label,
    description: sourceVxlan.description,
    vn_type: sourceVxlan.vnType || "vxlan",
    vn_id: sourceVxlan.vnId || undefined,
    ipv4_subnet: sourceVxlan.ipv4Subnet || null,
    ipv6_subnet: sourceVxlan.ipv6Subnet || null,
    virtual_gateway_ipv4: sourceVxlan.virtualGatewayIpv4 || null,
    virtual_gateway_ipv6: sourceVxlan.virtualGatewayIpv6 || null,
    virtual_gateway_ipv4_enabled: Boolean(sourceVxlan.virtualGatewayIpv4Enabled),
    virtual_gateway_ipv6_enabled: Boolean(sourceVxlan.virtualGatewayIpv6Enabled),
    virtual_mac: sourceVxlan.virtualMac || null,
    ipv4_enabled: sourceVxlan.ipv4Enabled !== false,
    ipv6_enabled: Boolean(sourceVxlan.ipv6Enabled),
    dhcp_service: sourceVxlan.dhcpService || "dhcpServiceDisabled",
    security_zone_id: targetSecurityZoneId,
    rt_policy: sourceVxlan.rtPolicy ?? null,
    l3_mtu: sourceVxlan.l3Mtu,
    route_target: sourceVxlan.routeTarget || null,
    tenant: sourceVxlan.tenant ?? null,
    tags: Array.isArray(sourceVxlan.tags) ? sourceVxlan.tags : [],
    bound_to: boundTo
  };

  // Apstra rejects a null/0 reserved_vlan_id, so only send a real reservation.
  const reservedVlanId = autoAssignVlan ? null : asVlanId(sourceVxlan.reservedVlanId);
  if (reservedVlanId !== null) {
    payload.reserved_vlan_id = reservedVlanId;
  }

  if (asFiniteNumber(sourceVxlan.l3Mtu) === null) {
    delete payload.l3_mtu;
  }

  return stripUndefinedProperties(payload);
}

function buildSecurityZoneCreatePayload(sourceVrf, autoAssignVlan = false) {
  const rawSource = sourceVrf?.rawSource && typeof sourceVrf.rawSource === "object"
    ? sourceVrf.rawSource
    : {};

  // Everything else (vni_id, vrf_description, junos_evpn_irb_mode, addressing_support,
  // disable_ipv4, vtep_addressing, l3_mtu) is carried over from the source zone as-is.
  const payload = {
    ...stripSecurityZoneReadOnlyFields(rawSource),
    label: sourceVrf.label,
    sz_type: sourceVrf.type || undefined,
    vrf_name: sourceVrf.vrfName || undefined,
    rt_policy: sourceVrf.rtPolicy ?? null,
    route_target: sourceVrf.routeTarget || null,
    tenant: sourceVrf.tenant ?? null,
    tags: Array.isArray(sourceVrf.tags) ? sourceVrf.tags : []
  };

  const l3Mtu = asFiniteNumber(payload.l3_mtu);
  if (payload.l3_mtu !== null && (l3Mtu === null || l3Mtu < 1280 || l3Mtu > 9216)) {
    delete payload.l3_mtu;
  }

  // stripSecurityZoneReadOnlyFields drops vlan_id; put it back unless the user opted out.
  const vlanId = autoAssignVlan ? null : asVlanId(sourceVrf.vlanId);
  if (vlanId !== null) {
    payload.vlan_id = vlanId;
  }

  return stripUndefinedProperties(payload);
}

function buildTargetBoundToBindings(sourceVxlan, targetSystemIds, autoAssignVlan = false) {
  const fallbackVlanId = autoAssignVlan ? null : resolveSourceVlanId(sourceVxlan);

  return dedupeStrings(targetSystemIds || []).map((systemId) => {
    const binding = {
      system_id: systemId,
      access_switch_node_ids: []
    };

    if (fallbackVlanId !== null) {
      binding.vlan_id = fallbackVlanId;
    }

    return binding;
  });
}

// The VLAN a stretched copy would claim on each target switch.
function resolveSourceVlanId(sourceVxlan) {
  const sourceBindings = Array.isArray(sourceVxlan?.boundTo) ? sourceVxlan.boundTo : [];

  return (
    sourceBindings.map((binding) => asVlanId(binding.vlanId)).find((vlanId) => vlanId !== null) ??
    asVlanId(sourceVxlan?.reservedVlanId)
  );
}

function choosePreferredScopeSourceBlueprintId(candidateIds, preferredSourceBlueprintId, blueprintMap) {
  const candidates = dedupeStrings(candidateIds || []);
  if (candidates.length === 0) {
    return "";
  }

  if (preferredSourceBlueprintId && candidates.includes(preferredSourceBlueprintId)) {
    return preferredSourceBlueprintId;
  }

  return [...candidates]
    .sort((leftId, rightId) => {
      const leftName = blueprintMap.get(leftId)?.blueprintName || leftId;
      const rightName = blueprintMap.get(rightId)?.blueprintName || rightId;
      return leftName.localeCompare(rightName);
    })[0];
}

// bound_to.system_id must be a leaf system or a leaf pair (redundancy group of leaves).
// Access switches and access redundancy groups belong in access_switch_node_ids, so they are excluded.
async function fetchBlueprintBindingTargets(connection, blueprintId, token, authHeaders) {
  const encodedId = encodeURIComponent(blueprintId);
  const path = `${API_ROOT}/blueprints/${encodedId}/ql`;

  let payload;
  try {
    payload = await apiPost(
      connection,
      path,
      { query: "{ system_nodes { id role } redundancy_group_nodes { id composed_of_systems_targets { id role } } }" },
      token,
      authHeaders
    );
  } catch {
    payload = await apiPost(connection, path, { query: "{ system_nodes { id role } }" }, token, authHeaders);
  }

  const systemNodes = Array.isArray(payload?.data?.system_nodes) ? payload.data.system_nodes : [];
  const redundancyGroups = Array.isArray(payload?.data?.redundancy_group_nodes)
    ? payload.data.redundancy_group_nodes
    : [];

  const groupedSystemIds = new Set();
  const leafGroupIds = [];

  for (const group of redundancyGroups) {
    const members = Array.isArray(group?.composed_of_systems_targets) ? group.composed_of_systems_targets : [];

    for (const member of members) {
      const memberId = firstString(member, ["id", "uuid"]) || "";
      if (memberId) {
        groupedSystemIds.add(memberId);
      }
    }

    const groupId = firstString(group, ["id", "uuid"]) || "";
    const isLeafGroup = members.some(
      (member) => normalizeLookupKey(firstString(member, ["role"]) || "") === "leaf"
    );

    if (groupId && isLeafGroup) {
      leafGroupIds.push(groupId);
    }
  }

  const standaloneLeafIds = systemNodes
    .filter((node) => normalizeLookupKey(firstString(node, ["role"]) || "") === "leaf")
    .map((node) => firstString(node, ["id", "uuid"]) || "")
    .filter((id) => id && !groupedSystemIds.has(id));

  return dedupeStrings([...leafGroupIds, ...standaloneLeafIds]);
}

function stripUndefinedProperties(value) {
  const output = {};

  for (const [key, itemValue] of Object.entries(value || {})) {
    if (itemValue === undefined) {
      continue;
    }

    output[key] = itemValue;
  }

  return output;
}

function compareOptionalNumbers(leftValue, rightValue) {
  const left = Number(leftValue);
  const right = Number(rightValue);

  const leftFinite = Number.isFinite(left);
  const rightFinite = Number.isFinite(right);

  if (leftFinite && rightFinite) {
    return left - right;
  }

  if (leftFinite) {
    return -1;
  }

  if (rightFinite) {
    return 1;
  }

  return String(leftValue || "").localeCompare(String(rightValue || ""));
}

async function fetchBlueprintBgpSessionFacts(connection, blueprintId, token, authHeaders) {
  const encodedId = encodeURIComponent(blueprintId);
  const query = [
    "{",
    "  protocol_session_nodes { id routing instantiates_targets { id node_type } }",
    "  protocol_endpoint_nodes { id layered_over_interface_targets { id node_type } layered_over_ip_endpoint_targets { id node_type } }",
    "  interface_nodes { id ipv4_addr }",
    "  ip_endpoint_nodes { id ipv4_addr }",
    "}"
  ].join(" ");

  const payload = await apiPost(
    connection,
    `${API_ROOT}/blueprints/${encodedId}/ql`,
    { query },
    token,
    authHeaders
  );

  const data = payload?.data && typeof payload.data === "object"
    ? payload.data
    : payload && typeof payload === "object"
      ? payload
      : {};

  const sessionNodes = Array.isArray(data.protocol_session_nodes) ? data.protocol_session_nodes : [];
  const endpointNodes = Array.isArray(data.protocol_endpoint_nodes) ? data.protocol_endpoint_nodes : [];
  const interfaceNodes = Array.isArray(data.interface_nodes) ? data.interface_nodes : [];
  const ipEndpointNodes = Array.isArray(data.ip_endpoint_nodes) ? data.ip_endpoint_nodes : [];

  const interfaceIpv4ById = new Map(
    interfaceNodes.map((item) => [item?.id, normalizeIpAddress(item?.ipv4_addr)])
  );

  const ipEndpointIpv4ById = new Map(
    ipEndpointNodes.map((item) => [item?.id, normalizeIpAddress(item?.ipv4_addr)])
  );

  const endpointIpv4ById = new Map();

  for (const endpoint of endpointNodes) {
    const endpointId = asString(endpoint?.id);
    if (!endpointId) {
      continue;
    }

    let ip = "";
    const layeredInterfaceId = firstRelationshipTargetId(endpoint?.layered_over_interface_targets, "interface");
    if (layeredInterfaceId) {
      ip = interfaceIpv4ById.get(layeredInterfaceId) || "";
    }

    if (!ip) {
      const layeredIpEndpointId = firstRelationshipTargetId(endpoint?.layered_over_ip_endpoint_targets, "ip_endpoint");
      if (layeredIpEndpointId) {
        ip = ipEndpointIpv4ById.get(layeredIpEndpointId) || "";
      }
    }

    endpointIpv4ById.set(endpointId, ip);
  }

  const sessions = [];
  const bgpPairKeys = [];

  for (const session of sessionNodes) {
    if (normalizeLookupKey(asString(session?.routing)) !== "bgp") {
      continue;
    }

    const endpointIds = Array.isArray(session?.instantiates_targets)
      ? session.instantiates_targets
        .filter((item) => item?.node_type === "protocol_endpoint")
        .map((item) => asString(item?.id))
        .filter(Boolean)
      : [];

    const endpointIps = dedupeStrings(
      endpointIds
        .map((endpointId) => endpointIpv4ById.get(endpointId) || "")
        .filter(Boolean)
    );

    const pairKey = buildIpPairKey(endpointIps);

    sessions.push({
      id: asString(session?.id),
      routing: asString(session?.routing),
      endpointIds,
      endpointIps,
      pairKey
    });

    if (pairKey) {
      bgpPairKeys.push(pairKey);
    }
  }

  return {
    sessions,
    bgpPairKeys: dedupeStrings(bgpPairKeys)
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
        buildApiFailureMessage(tabResult.status, path, tabResult.data || tabResult.text),
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
      buildApiFailureMessage(response.status, path, data || text),
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
      throw createError(buildApiFailureMessage(result.status, path, result.data || result.text), "API_REQUEST_FAILED", {
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
    throw createError(buildApiFailureMessage(response.status, path, data || text), "API_REQUEST_FAILED", {
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
      throw createError(buildApiFailureMessage(result.status, path, result.data || result.text), "API_REQUEST_FAILED", {
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
    throw createError(buildApiFailureMessage(response.status, path, data || text), "API_REQUEST_FAILED", {
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
      throw createError(buildApiFailureMessage(result.status, path, result.data || result.text), "API_REQUEST_FAILED", {
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
    throw createError(buildApiFailureMessage(response.status, path, data || text), "API_REQUEST_FAILED", {
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

  const design = normalizeLookupKey(
    firstString(value, ["design", "reference_design", "blueprint_type", "type"]) ||
      firstString(value?.blueprint, ["design", "reference_design", "blueprint_type", "type"]) ||
      ""
  );

  return {
    id,
    name,
    design,
    isSupportedDesign: !UNSUPPORTED_BLUEPRINT_DESIGNS.has(design)
  };
}

// Splits the blueprint list into ones this extension can query and ones (freeform) it must ignore.
function partitionBlueprintsByDesign(blueprints) {
  const supported = [];
  const skipped = [];

  for (const blueprint of blueprints) {
    if (blueprint.isSupportedDesign) {
      supported.push(blueprint);
      continue;
    }

    skipped.push({
      blueprintId: blueprint.id,
      blueprintName: blueprint.name,
      design: blueprint.design || "unknown",
      message: `Skipped ${blueprint.design || "unsupported"} blueprint (no datacenter reference-design APIs).`
    });
  }

  return { supported, skipped };
}

// A 404 on a datacenter-only endpoint means the blueprint is not a datacenter blueprint.
function isUnsupportedBlueprintApiError(error) {
  return error?.code === "API_REQUEST_FAILED" && error?.responseStatus === 404;
}

function buildSkippedBlueprintEntry(context, design) {
  return {
    blueprintId: context?.blueprintId || "unknown",
    blueprintName: context?.blueprintName || "Unknown blueprint",
    design: design || "unknown",
    message: "Skipped blueprint: datacenter reference-design APIs are not available for it."
  };
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

function normalizeRemoteGatewayCollection(payload) {
  const values = Array.isArray(payload?.remote_gateways)
    ? payload.remote_gateways
    : Array.isArray(payload)
      ? payload
      : [];

  return values
    .map(normalizeRemoteGateway)
    .filter((item) => item.gwIp || item.id || item.name);
}

function normalizeRemoteGateway(value) {
  const source = value && typeof value === "object" ? value : {};

  const localGwNodesRaw = Array.isArray(source.local_gw_nodes) ? source.local_gw_nodes : [];
  const localGwNodes = localGwNodesRaw.map((node) => {
    const nodeSource = node && typeof node === "object" ? node : {};
    return {
      label: firstString(nodeSource, ["label", "name", "display_name"]) || "",
      nodeId: firstString(nodeSource, ["node_id", "id", "uuid"]) || "",
      role: firstString(nodeSource, ["role"]) || "",
      evpnInternalRd: firstString(nodeSource, ["evpn_internal_rd"]) || "",
      evpnInterconnectRd: firstString(nodeSource, ["evpn_interconnect_rd"]) || ""
    };
  });

  const localEvpnIps = dedupeStrings(
    localGwNodes
      .map((node) => extractIpFromRouteDistinguisher(node.evpnInternalRd))
      .filter(Boolean)
  );

  return {
    id: firstString(source, ["id", "gateway_id", "uuid"]) || "",
    name:
      firstString(source, ["gw_name", "label", "name", "display_name"]) ||
      firstString(source, ["id", "gateway_id", "uuid"]) ||
      "Unnamed gateway",
    gwIp: normalizeIpAddress(firstString(source, ["gw_ip", "ip", "gateway_ip"]) || ""),
    gwAsn: asFiniteNumber(source.gw_asn),
    ttl: asFiniteNumber(source.ttl),
    keepaliveTimer: asFiniteNumber(source.keepalive_timer),
    holdtimeTimer: asFiniteNumber(source.holdtime_timer),
    localGwNodes,
    localNodeLabels: dedupeStrings(localGwNodes.map((node) => node.label).filter(Boolean)),
    localEvpnIps
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

function normalizeIpAddress(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const base = trimmed.includes("/") ? trimmed.split("/")[0] : trimmed;
  return base.trim();
}

function extractIpFromRouteDistinguisher(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return normalizeIpAddress(trimmed.split(":")[0] || "");
}

function firstRelationshipTargetId(values, expectedNodeType) {
  if (!Array.isArray(values)) {
    return "";
  }

  const match = values.find((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    if (!expectedNodeType) {
      return Boolean(asString(item.id));
    }

    return normalizeLookupKey(asString(item.node_type)) === normalizeLookupKey(expectedNodeType);
  });

  return asString(match?.id);
}

function buildIpPairKey(endpointIps) {
  const uniqueIps = dedupeStrings(endpointIps.map((ip) => normalizeIpAddress(ip)).filter(Boolean));
  if (uniqueIps.length < 2) {
    return "";
  }

  const sorted = [...uniqueIps].sort((a, b) => a.localeCompare(b));
  return `${sorted[0]}|${sorted[1]}`;
}

function dedupeStrings(values) {
  return Array.from(new Set((values || []).filter((value) => typeof value === "string" && value.trim() !== "")));
}

function intersectStringArrays(left, right) {
  const rightSet = new Set(right || []);
  return dedupeStrings((left || []).filter((item) => rightSet.has(item)));
}

function buildGatewayConnectionKey(sourceBlueprintId, sourceGatewayKey, targetBlueprintId, targetGatewayKey) {
  const left = `${sourceBlueprintId}:${sourceGatewayKey}`;
  const right = `${targetBlueprintId}:${targetGatewayKey}`;
  return left < right ? `${left}<>${right}` : `${right}<>${left}`;
}

function buildBlueprintPairKey(leftBlueprintId, rightBlueprintId) {
  return leftBlueprintId < rightBlueprintId
    ? `${leftBlueprintId}|${rightBlueprintId}`
    : `${rightBlueprintId}|${leftBlueprintId}`;
}

function buildGatewayConnectionConfidence(reciprocalConfig, hasBgpEvidence) {
  if (reciprocalConfig && hasBgpEvidence) {
    return "high";
  }

  if (reciprocalConfig || hasBgpEvidence) {
    return "medium";
  }

  return "low";
}

function gatewayConfidenceRank(confidence) {
  if (confidence === "high") {
    return 3;
  }

  if (confidence === "medium") {
    return 2;
  }

  return 1;
}

function asFiniteNumber(value) {
  // Number(null) and Number("") are 0, which would turn an absent field into a real value.
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function asVlanId(value) {
  const parsed = asFiniteNumber(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 4094 ? parsed : null;
}

// Apstra populates vn_id/subnet on a newly created object asynchronously, so an
// immediate re-read reports nulls and the refreshed report would look unchanged.
function waitForApstraToMaterialize() {
  return new Promise((resolve) => setTimeout(resolve, 2500));
}

// Streams each outcome to the popup so failures show up as they happen, not only at the end.
function emitStretchProgress(kind, result, completed, total) {
  try {
    void chrome.runtime
      .sendMessage({ type: "stretchProgress", kind, result, completed, total })
      .catch(() => {
        // No popup listening; progress is still returned in the final response.
      });
  } catch {
    // Ignore messaging errors entirely; progress is best-effort.
  }
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

function buildApiFailureMessage(status, path, body) {
  if (status === 401) {
    return `API request failed (401) for ${path}. Generate fresh API traffic in the Data Center Director tab, then click Refresh Status and Load Report again.`;
  }

  const detail = extractApiErrorDetail(body);
  return detail
    ? `API request failed (${status}) for ${path}: ${detail}`
    : `API request failed (${status}) for ${path}`;
}

// Apstra reports rejection reasons in several shapes; surface whichever one is present.
function extractApiErrorDetail(body) {
  if (typeof body === "string") {
    return body.trim().slice(0, 400);
  }

  if (!body || typeof body !== "object") {
    return "";
  }

  const direct = firstString(body, ["detail", "error", "message", "errors"]);
  if (direct) {
    return direct.slice(0, 400);
  }

  const nested = body.errors && typeof body.errors === "object" ? body.errors : null;
  if (nested) {
    const nodeMessages = extractNodeErrorMessages(nested.nodes);
    if (nodeMessages.length > 0) {
      return dedupeStrings(nodeMessages).join("; ").slice(0, 400);
    }

    const parts = Object.entries(nested)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : JSON.stringify(value)}`)
      .join("; ");

    if (parts) {
      return parts.slice(0, 400);
    }
  }

  try {
    return JSON.stringify(body).slice(0, 400);
  } catch {
    return "";
  }
}

// Validation failures arrive as errors.nodes["<node id>"] = [{ message, error_type }].
function extractNodeErrorMessages(nodes) {
  if (!nodes || typeof nodes !== "object") {
    return [];
  }

  return Object.values(nodes)
    .flatMap((entries) => (Array.isArray(entries) ? entries : []))
    .map((entry) => asString(entry?.message).trim())
    .filter(Boolean);
}
