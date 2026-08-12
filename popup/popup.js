const elements = {
  appShell: document.getElementById("appShell"),
  toggleNavButton: document.getElementById("toggleNavButton"),
  homeView: document.getElementById("homeView"),
  configletsView: document.getElementById("configletsView"),
  insightsView: document.getElementById("insightsView"),
  navHome: document.getElementById("navHome"),
  navConfiglets: document.getElementById("navConfiglets"),
  navInsights: document.getElementById("navInsights"),
  openConfigletsBtn: document.getElementById("openConfigletsBtn"),
  openInsightsBtn: document.getElementById("openInsightsBtn"),
  backHomeButton: document.getElementById("backHomeButton"),
  backHomeFromInsightsButton: document.getElementById("backHomeFromInsightsButton"),
  connectionBadge: document.getElementById("connectionBadge"),
  hostValue: document.getElementById("hostValue"),
  tokenValue: document.getElementById("tokenValue"),
  statusMessage: document.getElementById("statusMessage"),
  homeHint: document.getElementById("homeHint"),
  refreshButton: document.getElementById("refreshButton"),
  trafficButton: document.getElementById("trafficButton"),
  loadButton: document.getElementById("loadButton"),
  loadInsightsButton: document.getElementById("loadInsightsButton"),
  searchInput: document.getElementById("searchInput"),
  blueprintFilter: document.getElementById("blueprintFilter"),
  sortOrder: document.getElementById("sortOrder"),
  summaryBlueprints: document.getElementById("summaryBlueprints"),
  summaryMappings: document.getElementById("summaryMappings"),
  summaryConfiglets: document.getElementById("summaryConfiglets"),
  summaryFailures: document.getElementById("summaryFailures"),
  summaryUnused: document.getElementById("summaryUnused"),
  activeResultsBody: document.getElementById("activeResultsBody"),
  unusedResultsBody: document.getElementById("unusedResultsBody"),
  exportActiveCsvButton: document.getElementById("exportActiveCsvButton"),
  exportUnusedCsvButton: document.getElementById("exportUnusedCsvButton"),
  exportInsightsCsvButton: document.getElementById("exportInsightsCsvButton"),
  exportInsightsBlueprintCsvButton: document.getElementById("exportInsightsBlueprintCsvButton"),
  exportInsightsJsonButton: document.getElementById("exportInsightsJsonButton"),
  homeErrorBanner: document.getElementById("homeErrorBanner"),
  errorBanner: document.getElementById("errorBanner"),
  insightsErrorBanner: document.getElementById("insightsErrorBanner"),
  updatedAt: document.getElementById("updatedAt"),
  insightsUpdatedAt: document.getElementById("insightsUpdatedAt"),
  insightTotalAssignments: document.getElementById("insightTotalAssignments"),
  insightDriftRate: document.getElementById("insightDriftRate"),
  insightGlobalUtilization: document.getElementById("insightGlobalUtilization"),
  insightSingleBlueprintRisk: document.getElementById("insightSingleBlueprintRisk"),
  insightTopDrifted: document.getElementById("insightTopDrifted"),
  insightTopBlueprint: document.getElementById("insightTopBlueprint"),
  insightsTopDriftedBody: document.getElementById("insightsTopDriftedBody"),
  insightsBlueprintMetricsBody: document.getElementById("insightsBlueprintMetricsBody"),
  toast: document.getElementById("toast"),
  activeDetailsModal: document.getElementById("activeDetailsModal"),
  activeDetailsTitle: document.getElementById("activeDetailsTitle"),
  activeDetailsBody: document.getElementById("activeDetailsBody"),
  closeActiveDetailsButton: document.getElementById("closeActiveDetailsButton")
};

const appState = {
  view: "home",
  connection: null,
  report: null,
  insights: null,
  loadingStatus: false,
  loadingReport: false,
  refreshingEntryKey: "",
  activeDetailsRowKey: "",
  copiedToastTimer: null,
  expandedUnusedRowKeys: new Set()
};

wireEvents();
void initialize();

function wireEvents() {
  elements.toggleNavButton.addEventListener("click", () => {
    const isCollapsed = elements.appShell.classList.toggle("is-collapsed-nav");
    elements.toggleNavButton.setAttribute("aria-label", isCollapsed ? "Expand menu" : "Collapse menu");
    elements.toggleNavButton.setAttribute("title", isCollapsed ? "Expand menu" : "Collapse menu");
  });

  elements.navHome.addEventListener("click", () => setView("home"));
  elements.navConfiglets.addEventListener("click", () => {
    if (!isAuthReady()) {
      showError("Capture token/auth headers first.", "home");
      return;
    }
    setView("configlets");
  });

  elements.navInsights.addEventListener("click", () => {
    if (!isAuthReady()) {
      showError("Capture token/auth headers first.", "home");
      return;
    }
    setView("insights");
    if (!appState.report) {
      void loadInsights();
    }
  });

  elements.openConfigletsBtn.addEventListener("click", () => {
    if (!isAuthReady()) {
      showError("Capture token/auth headers first.", "home");
      return;
    }

    setView("configlets");
    if (!appState.report) {
      void loadReport();
    }
  });

  elements.openInsightsBtn.addEventListener("click", () => {
    if (!isAuthReady()) {
      showError("Capture token/auth headers first.", "home");
      return;
    }

    setView("insights");
    if (!appState.report) {
      void loadInsights();
    }
  });

  elements.backHomeButton.addEventListener("click", () => setView("home"));
  elements.backHomeFromInsightsButton.addEventListener("click", () => setView("home"));

  elements.refreshButton.addEventListener("click", () => {
    void refreshConnectionStatus();
  });

  elements.trafficButton.addEventListener("click", () => {
    void refreshTokenCapture();
  });

  elements.loadButton.addEventListener("click", () => {
    void loadReport();
  });

  elements.loadInsightsButton.addEventListener("click", () => {
    void loadInsights();
  });

  elements.exportActiveCsvButton.addEventListener("click", () => {
    exportActiveCsv();
  });

  elements.exportUnusedCsvButton.addEventListener("click", () => {
    exportUnusedCsv();
  });

  elements.exportInsightsCsvButton.addEventListener("click", () => {
    exportInsightsSummaryCsv();
  });

  elements.exportInsightsBlueprintCsvButton.addEventListener("click", () => {
    exportInsightsBlueprintCsv();
  });

  elements.exportInsightsJsonButton.addEventListener("click", () => {
    exportInsightsJson();
  });

  elements.searchInput.addEventListener("input", () => {
    renderTables();
  });

  elements.blueprintFilter.addEventListener("change", () => {
    renderTables();
  });

  elements.sortOrder.addEventListener("change", () => {
    renderTables();
  });

  elements.activeResultsBody.addEventListener("click", (event) => {
    const button = event.target instanceof HTMLElement
      ? event.target.closest("button[data-action]")
      : null;

    if (!(button instanceof HTMLElement)) {
      return;
    }

    const action = button.dataset.action;
    if (!action) {
      return;
    }

    if (action === "show-active-details") {
      const encodedKey = button.dataset.rowKey;
      if (!encodedKey) {
        return;
      }

      const rowKey = decodeRowKey(encodedKey);
      const row = getFilteredActiveRows().find((item) => item.rowKey === rowKey);
      if (!row) {
        return;
      }

      openActiveDetails(row);
      return;
    }

    if (action === "refresh-out-of-sync") {
      const blueprintId = button.dataset.blueprintId || "";
      const configletId = button.dataset.configletId || "";
      const configletName = button.dataset.configletName || "";
      const entryKey = button.dataset.entryKey || "";

      void refreshOutOfSyncEntry({
        blueprintId,
        configletId,
        configletName,
        entryKey
      });
    }

  });

  elements.activeDetailsBody.addEventListener("click", (event) => {
    const button = event.target instanceof HTMLElement
      ? event.target.closest("button[data-action='refresh-out-of-sync']")
      : null;

    if (!(button instanceof HTMLElement)) {
      return;
    }

    const blueprintId = button.dataset.blueprintId || "";
    const configletId = button.dataset.configletId || "";
    const configletName = button.dataset.configletName || "";
    const entryKey = button.dataset.entryKey || "";

    void refreshOutOfSyncEntry({
      blueprintId,
      configletId,
      configletName,
      entryKey
    });
  });

  elements.unusedResultsBody.addEventListener("click", (event) => {
    const button = event.target instanceof HTMLElement
      ? event.target.closest("button[data-action]")
      : null;

    if (!(button instanceof HTMLElement)) {
      return;
    }

    const action = button.dataset.action;
    const encodedKey = button.dataset.rowKey;
    if (!action || !encodedKey) {
      return;
    }

    const rowKey = decodeRowKey(encodedKey);
    const row = getFilteredUnusedRows().find((item) => item.rowKey === rowKey);
    if (!row) {
      return;
    }

    if (action === "toggle-unused") {
      toggleUnusedRowDetails(rowKey);
      return;
    }

  });

  elements.closeActiveDetailsButton.addEventListener("click", () => {
    closeActiveDetails();
  });

  elements.activeDetailsModal.addEventListener("click", (event) => {
    if (event.target === elements.activeDetailsModal) {
      closeActiveDetails();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.activeDetailsModal.classList.contains("hidden")) {
      closeActiveDetails();
    }
  });
}

async function initialize() {
  setView("home");
  renderConnectionState();
  renderSummary();
  renderTables();
  renderInsights();
  await refreshConnectionStatus();
}

function setView(view) {
  appState.view = view;

  const isHome = view === "home";
  const isConfiglets = view === "configlets";
  const isInsights = view === "insights";

  elements.homeView.classList.toggle("hidden", !isHome);
  elements.configletsView.classList.toggle("hidden", !isConfiglets);
  elements.insightsView.classList.toggle("hidden", !isInsights);

  elements.navHome.classList.toggle("active", isHome);
  elements.navConfiglets.classList.toggle("active", isConfiglets);
  elements.navInsights.classList.toggle("active", isInsights);

  if (isHome) {
    closeActiveDetails();
  }
}

function isAuthReady() {
  return appState.connection?.state === "READY";
}

async function refreshConnectionStatus() {
  if (appState.loadingStatus) {
    return;
  }

  appState.loadingStatus = true;
  clearError("home");
  clearError("report");
  clearError("insights");
  elements.statusMessage.textContent = "Checking active tab...";
  renderConnectionState();

  try {
    appState.connection = await sendMessage("getConnectionStatus");
  } catch (error) {
    appState.connection = {
      state: "ERROR",
      message: error.message || "Unable to check connection status"
    };
    showError(error.message || "Unable to check connection status", "home");
  } finally {
    appState.loadingStatus = false;
    renderConnectionState();
  }
}

async function refreshTokenCapture() {
  clearError("home");

  try {
    await sendMessage("refreshActiveTabTraffic");
    elements.statusMessage.textContent = "Triggered API traffic. Refreshing status...";
    await sleep(550);
    await refreshConnectionStatus();
  } catch (error) {
    showError(error.message || "Failed to trigger token capture", "home");
  }
}

async function loadReport() {
  if (appState.loadingReport) {
    return;
  }

  if (!isAuthReady()) {
    showError("Capture token/auth headers first.", "home");
    setView("home");
    return;
  }

  appState.loadingReport = true;
  clearError("report");
  clearError("insights");
  elements.updatedAt.textContent = "Loading report...";
  elements.insightsUpdatedAt.textContent = "Loading insights...";
  renderTableLoading();
  renderInsightsLoading();
  renderConnectionState();

  try {
    const response = await sendMessage("runConfigletsReport");
    appState.connection = response.connection;
    appState.report = response.report;
    appState.insights = buildInsightsModel(response.report);
    appState.expandedUnusedRowKeys.clear();

    populateBlueprintFilter();
    renderSummary();
    renderTables();
    renderInsights();
    elements.updatedAt.textContent = formatUpdatedAt(response.report.generatedAt);
    elements.insightsUpdatedAt.textContent = formatUpdatedAt(response.report.generatedAt);

    if (response.report.partialFailures.length > 0) {
      showError(
        `Loaded with ${response.report.partialFailures.length} partial failure(s).`,
        "report"
      );
    }
  } catch (error) {
    appState.report = null;
    appState.insights = null;
    renderSummary();
    renderTables();
    renderInsights();
    elements.updatedAt.textContent = "Report failed";
    elements.insightsUpdatedAt.textContent = "Insights unavailable";
    showError(error.message || "Unable to load report", "report");
    showError(error.message || "Unable to load insights", "insights");
  } finally {
    appState.loadingReport = false;
    renderConnectionState();
  }
}

async function loadInsights() {
  await loadReport();
}

async function refreshOutOfSyncEntry({ blueprintId, configletId, configletName, entryKey }) {
  if (appState.refreshingEntryKey) {
    return;
  }

  if (!blueprintId || !configletId) {
    showError("Missing blueprint/configlet identifiers for refresh.", "report");
    return;
  }

  appState.refreshingEntryKey = entryKey || `${blueprintId}:${configletId}`;
  rerenderActiveDetailsModal();

  try {
    await sendMessage("refreshConfigletFromGlobal", {
      blueprintId,
      blueprintConfigletId: configletId,
      configletName: configletName || ""
    });

    showToast("Configlet refreshed from global template");
    await loadReport();

    const refreshedRow = getFilteredActiveRows().find((row) => row.entries.some((entry) =>
      entry.blueprintId === blueprintId && entry.configletId === configletId
    ));

    if (refreshedRow) {
      openActiveDetails(refreshedRow);
    }
  } catch (error) {
    showError(error.message || "Failed to refresh configlet", "report");
  } finally {
    appState.refreshingEntryKey = "";
    rerenderActiveDetailsModal();
  }
}

function renderConnectionState() {
  const connection = appState.connection;

  let badgeClass = "status-pending";
  let badgeText = "Checking";

  if (!connection) {
    elements.hostValue.textContent = "Not connected";
    elements.tokenValue.textContent = "Unknown";
    elements.statusMessage.textContent = "Waiting for status...";
  } else {
    elements.hostValue.textContent = connection.host || "Not connected";
    elements.tokenValue.textContent = connection.tokenSeenAt
      ? `Captured ${formatRelative(connection.tokenSeenAt)}`
      : connection.authMode === "headers"
        ? "Auth headers captured"
        : "Not captured";
    elements.statusMessage.textContent = connection.message || "No status message";

    if (connection.state === "READY") {
      badgeClass = "status-ready";
      badgeText = "Ready";
    } else if (connection.state === "WAITING_FOR_TOKEN") {
      badgeClass = "status-pending";
      badgeText = "Waiting Token";
    } else if (connection.state === "NOT_ON_DCD_TAB") {
      badgeClass = "status-error";
      badgeText = "Not on DCD";
    } else if (connection.state === "ERROR") {
      badgeClass = "status-error";
      badgeText = "Error";
    }
  }

  elements.connectionBadge.className = `status-badge ${badgeClass}`;
  elements.connectionBadge.textContent = badgeText;

  const authReady = isAuthReady();
  elements.openConfigletsBtn.disabled = !authReady;
  elements.openInsightsBtn.disabled = !authReady;
  elements.navConfiglets.disabled = !authReady;
  elements.navInsights.disabled = !authReady;

  elements.refreshButton.disabled = appState.loadingStatus;
  elements.trafficButton.disabled = !connection || connection.state === "NOT_ON_DCD_TAB";
  elements.loadButton.disabled = !authReady || appState.loadingReport;
  elements.loadInsightsButton.disabled = !authReady || appState.loadingReport;

  elements.homeHint.textContent = authReady
    ? "Ready. Select Configlet Audit to run or rerun the report."
    : "Capture token/auth headers first. Keep the Data Center Director tab active and click Refresh Token Capture.";
}

function renderSummary() {
  const report = appState.report;

  if (!report) {
    elements.summaryBlueprints.textContent = "-";
    elements.summaryMappings.textContent = "-";
    elements.summaryConfiglets.textContent = "-";
    elements.summaryFailures.textContent = "-";
    elements.summaryUnused.textContent = "-";
    return;
  }

  elements.summaryBlueprints.textContent = numberFormat(report.blueprintCount);
  elements.summaryMappings.textContent = numberFormat(report.assignmentCount);
  elements.summaryConfiglets.textContent = numberFormat(report.uniqueConfigletCount);
  elements.summaryFailures.textContent = numberFormat(report.outOfSyncConfigletCount);
  elements.summaryUnused.textContent = numberFormat(report.unusedConfigletCount || 0);
}

function renderInsightsLoading() {
  elements.insightTotalAssignments.textContent = "-";
  elements.insightDriftRate.textContent = "-";
  elements.insightGlobalUtilization.textContent = "-";
  elements.insightSingleBlueprintRisk.textContent = "-";
  elements.insightTopDrifted.textContent = "-";
  elements.insightTopBlueprint.textContent = "-";

  elements.insightsTopDriftedBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="5">Loading drift hotspot data...</td></tr>';
  elements.insightsBlueprintMetricsBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="5">Loading blueprint risk metrics...</td></tr>';
}

function renderInsights() {
  const insights = appState.insights;

  if (!insights) {
    elements.insightTotalAssignments.textContent = "-";
    elements.insightDriftRate.textContent = "-";
    elements.insightGlobalUtilization.textContent = "-";
    elements.insightSingleBlueprintRisk.textContent = "-";
    elements.insightTopDrifted.textContent = "-";
    elements.insightTopBlueprint.textContent = "-";

    elements.insightsTopDriftedBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="5">Run report to view drift hotspots.</td></tr>';
    elements.insightsBlueprintMetricsBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="5">Run report to view blueprint risk ranking.</td></tr>';
    return;
  }

  elements.insightTotalAssignments.textContent = numberFormat(insights.totalAssignments);
  elements.insightDriftRate.textContent = formatPercent(insights.driftRate);
  elements.insightGlobalUtilization.textContent = formatPercent(insights.globalUtilizationRate);
  elements.insightSingleBlueprintRisk.textContent = numberFormat(insights.singleBlueprintConfigletCount);
  elements.insightTopDrifted.textContent = numberFormat(insights.hotspotCount);
  elements.insightTopBlueprint.textContent = insights.topBlueprint
    ? `${insights.topBlueprint.name} (${numberFormat(insights.topBlueprint.totalAssignments)})`
    : "-";

  if (!insights.topDriftedRows.length) {
    elements.insightsTopDriftedBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="5">No drift hotspots detected.</td></tr>';
  } else {
    elements.insightsTopDriftedBody.innerHTML = insights.topDriftedRows.map((row) => `
      <tr>
        <td><div class="cell-title">${escapeHtml(row.configletName)}</div></td>
        <td><div class="cell-subtle">${renderGlobalCatalogIdLink(row.globalConfigletId)}</div></td>
        <td><strong>${numberFormat(row.outOfSyncCount)}</strong></td>
        <td>${numberFormat(row.blueprintCount)}</td>
        <td>${formatPercent(row.driftRate)}</td>
      </tr>
    `).join("");
  }

  if (!insights.blueprintMetrics.length) {
    elements.insightsBlueprintMetricsBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="5">No blueprint metrics available.</td></tr>';
  } else {
    elements.insightsBlueprintMetricsBody.innerHTML = insights.blueprintMetrics.map((row) => {
      const url = buildBlueprintConfigletsPageUrl(row.blueprintId);
      const name = url
        ? `<a class="id-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(row.blueprintName)}</a>`
        : escapeHtml(row.blueprintName);

      return `
        <tr>
          <td><div class="cell-title">${name}</div></td>
          <td>${numberFormat(row.totalAssignments)}</td>
          <td>${numberFormat(row.driftedAssignments)}</td>
          <td>${formatPercent(row.driftRate)}</td>
          <td>${numberFormat(row.uniqueConfigletCount)}</td>
        </tr>
      `;
    }).join("");
  }
}

function buildInsightsModel(report) {
  const rows = Array.isArray(report?.rows) ? report.rows : [];
  const unusedRows = Array.isArray(report?.unusedRows) ? report.unusedRows : [];

  let totalAssignments = 0;
  let totalDriftAssignments = 0;
  const singleBlueprintConfigletCount = rows.filter((row) => row.blueprintCount === 1).length;

  const usedGlobalIds = new Set(
    rows
      .map((row) => row.globalConfigletId)
      .filter((id) => typeof id === "string" && id.trim() !== "")
  );

  const allGlobalIds = new Set(usedGlobalIds);
  for (const row of unusedRows) {
    if (row.globalConfigletId) {
      allGlobalIds.add(row.globalConfigletId);
    }
  }

  const blueprintStats = new Map();

  for (const row of rows) {
    totalAssignments += Number(row.assignmentCount) || 0;
    totalDriftAssignments += Number(row.outOfSyncCount) || 0;

    for (const entry of row.entries || []) {
      const key = entry.blueprintId || "unknown";
      if (!blueprintStats.has(key)) {
        blueprintStats.set(key, {
          blueprintId: entry.blueprintId || "",
          blueprintName: entry.blueprintName || "Unknown blueprint",
          totalAssignments: 0,
          driftedAssignments: 0,
          configletKeys: new Set()
        });
      }

      const target = blueprintStats.get(key);
      target.totalAssignments += 1;
      target.configletKeys.add(row.rowKey);
      if (entry.syncStatus === "OUT_OF_SYNC") {
        target.driftedAssignments += 1;
      }
    }
  }

  const topDriftedRows = rows
    .filter((row) => (row.outOfSyncCount || 0) > 0)
    .map((row) => ({
      rowKey: row.rowKey,
      configletName: row.configletName,
      globalConfigletId: row.globalConfigletId || "",
      outOfSyncCount: row.outOfSyncCount || 0,
      assignmentCount: row.assignmentCount || 0,
      blueprintCount: row.blueprintCount || 0,
      driftRate: row.assignmentCount ? row.outOfSyncCount / row.assignmentCount : 0
    }))
    .sort((a, b) => {
      if (b.outOfSyncCount !== a.outOfSyncCount) {
        return b.outOfSyncCount - a.outOfSyncCount;
      }

      if (b.blueprintCount !== a.blueprintCount) {
        return b.blueprintCount - a.blueprintCount;
      }

      return a.configletName.localeCompare(b.configletName);
    });

  const blueprintMetrics = Array.from(blueprintStats.values())
    .map((entry) => ({
      blueprintId: entry.blueprintId,
      blueprintName: entry.blueprintName,
      totalAssignments: entry.totalAssignments,
      driftedAssignments: entry.driftedAssignments,
      driftRate: entry.totalAssignments ? entry.driftedAssignments / entry.totalAssignments : 0,
      uniqueConfigletCount: entry.configletKeys.size
    }))
    .sort((a, b) => {
      if (b.driftedAssignments !== a.driftedAssignments) {
        return b.driftedAssignments - a.driftedAssignments;
      }

      if (b.totalAssignments !== a.totalAssignments) {
        return b.totalAssignments - a.totalAssignments;
      }

      return a.blueprintName.localeCompare(b.blueprintName);
    });

  const topBlueprint = [...blueprintMetrics]
    .sort((a, b) => b.totalAssignments - a.totalAssignments)[0] || null;

  return {
    generatedAt: report?.generatedAt || Date.now(),
    totalAssignments,
    totalDriftAssignments,
    driftRate: totalAssignments ? totalDriftAssignments / totalAssignments : 0,
    usedGlobalConfiglets: usedGlobalIds.size,
    totalGlobalConfiglets: allGlobalIds.size,
    globalUtilizationRate: allGlobalIds.size ? usedGlobalIds.size / allGlobalIds.size : 0,
    singleBlueprintConfigletCount,
    hotspotCount: topDriftedRows.length,
    topBlueprint,
    topDriftedRows: topDriftedRows.slice(0, 20),
    blueprintMetrics
  };
}

function renderTableLoading() {
  elements.activeResultsBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="4">Loading active configlets...</td></tr>';
  elements.unusedResultsBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="4">Loading unused catalog configlets...</td></tr>';
}

function renderTables() {
  renderActiveTable();
  renderUnusedTable();
}

function renderActiveTable() {
  const rows = getFilteredActiveRows();

  if (!appState.report) {
    elements.activeResultsBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="4">Run report to load active configlets.</td></tr>';
    return;
  }

  if (rows.length === 0) {
    elements.activeResultsBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="4">No active configlets match the current filters.</td></tr>';
    return;
  }

  const html = rows.map((row) => {
    const syncSummary = getSyncSummary(row);
    const key = encodeRowKey(row.rowKey);
    const blueprintListHtml = renderBlueprintList(row);
    const assignmentSummaryHtml = renderAssignmentSummary(row, syncSummary);

    const main = `
      <tr>
        <td>
          <div class="cell-title">${escapeHtml(row.configletName)}</div>
          <div class="cell-subtle">${renderGlobalCatalogIdLink(row.globalConfigletId)}</div>
        </td>
        <td>${blueprintListHtml}</td>
        <td>${assignmentSummaryHtml}</td>
        <td>
          <div class="action-stack">
            <button class="copy-btn" type="button" data-action="show-active-details" data-row-key="${key}">Details</button>
          </div>
        </td>
      </tr>
    `;

    return main;
  }).join("");

  elements.activeResultsBody.innerHTML = html;
}

function renderUnusedTable() {
  const rows = getFilteredUnusedRows();

  if (!appState.report) {
    elements.unusedResultsBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="4">Run report to load unused catalog configlets.</td></tr>';
    return;
  }

  if (rows.length === 0) {
    elements.unusedResultsBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="4">No unused catalog configlets found.</td></tr>';
    return;
  }

  const html = rows.map((row) => {
    const isExpanded = appState.expandedUnusedRowKeys.has(row.rowKey);
    const key = encodeRowKey(row.rowKey);

    const main = `
      <tr>
        <td>
          <div class="cell-title">${escapeHtml(row.configletName)}</div>
        </td>
        <td>
          <div class="cell-title">${renderGlobalCatalogIdLink(row.globalConfigletId)}</div>
        </td>
        <td>
          <div class="cell-subtle">${escapeHtml(formatTimestampForCell(row.lastUpdatedAt))}</div>
        </td>
        <td>
          <div class="action-stack">
            <button class="copy-btn" type="button" data-action="toggle-unused" data-row-key="${key}">${isExpanded ? "Hide" : "Details"}</button>
          </div>
        </td>
      </tr>
    `;

    if (!isExpanded) {
      return main;
    }

    return `${main}
      <tr class="details-row">
        <td colspan="4">
          <div class="details-panel">
            <h4>Global catalog template</h4>
            <pre class="diff-pre">${escapeHtml(row.catalogText || "(empty)")}</pre>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  elements.unusedResultsBody.innerHTML = html;
}

function getFilteredActiveRows() {
  const allRows = Array.isArray(appState.report?.rows) ? appState.report.rows : [];

  const query = elements.searchInput.value.trim().toLowerCase();
  const blueprintFilter = elements.blueprintFilter.value;
  const sortDirection = elements.sortOrder.value;

  const rows = allRows.filter((row) => {
    const searchableBlueprints = row.blueprints
      .map((blueprint) => blueprint.blueprintName)
      .join(" ")
      .toLowerCase();

    const matchesQuery =
      query.length === 0 ||
      row.configletName.toLowerCase().includes(query) ||
      (row.globalConfigletId || "").toLowerCase().includes(query) ||
      searchableBlueprints.includes(query);

    const matchesBlueprint =
      !blueprintFilter || row.blueprints.some((blueprint) => blueprint.blueprintId === blueprintFilter);

    return matchesQuery && matchesBlueprint;
  });

  rows.sort((a, b) => {
    switch (sortDirection) {
      case "blueprint_asc":
        if (a.blueprintCount !== b.blueprintCount) {
          return a.blueprintCount - b.blueprintCount;
        }
        return a.configletName.localeCompare(b.configletName);
      case "name_asc":
        return a.configletName.localeCompare(b.configletName);
      case "drift_desc":
        if (a.outOfSyncCount !== b.outOfSyncCount) {
          return b.outOfSyncCount - a.outOfSyncCount;
        }
        return b.blueprintCount - a.blueprintCount;
      case "blueprint_desc":
      default:
        if (a.blueprintCount !== b.blueprintCount) {
          return b.blueprintCount - a.blueprintCount;
        }
        if (a.outOfSyncCount !== b.outOfSyncCount) {
          return b.outOfSyncCount - a.outOfSyncCount;
        }
        return a.configletName.localeCompare(b.configletName);
    }
  });

  return rows;
}

function getFilteredUnusedRows() {
  const allRows = Array.isArray(appState.report?.unusedRows) ? appState.report.unusedRows : [];
  const query = elements.searchInput.value.trim().toLowerCase();

  const rows = allRows.filter((row) => {
    if (query.length === 0) {
      return true;
    }

    return (
      row.configletName.toLowerCase().includes(query) ||
      (row.globalConfigletId || "").toLowerCase().includes(query)
    );
  });

  rows.sort((a, b) => a.configletName.localeCompare(b.configletName));
  return rows;
}

function populateBlueprintFilter() {
  const existingSelection = elements.blueprintFilter.value;
  const options = new Map();

  for (const row of appState.report?.rows || []) {
    for (const blueprint of row.blueprints) {
      options.set(blueprint.blueprintId, blueprint.blueprintName);
    }
  }

  const sorted = Array.from(options.entries()).sort((a, b) => a[1].localeCompare(b[1]));

  elements.blueprintFilter.innerHTML = '<option value="">All blueprints</option>';
  for (const [id, name] of sorted) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `${name} (${id})`;
    elements.blueprintFilter.appendChild(option);
  }

  if (existingSelection && options.has(existingSelection)) {
    elements.blueprintFilter.value = existingSelection;
  }
}

function toggleUnusedRowDetails(rowKey) {
  if (appState.expandedUnusedRowKeys.has(rowKey)) {
    appState.expandedUnusedRowKeys.delete(rowKey);
  } else {
    appState.expandedUnusedRowKeys.add(rowKey);
  }

  renderUnusedTable();
}

function openActiveDetails(row) {
  appState.activeDetailsRowKey = row.rowKey;
  const idLabel = row.globalConfigletId || "No global catalog ID";
  elements.activeDetailsTitle.textContent = `${row.configletName} (${idLabel})`;
  elements.activeDetailsBody.innerHTML = renderActiveDetails(row);
  elements.activeDetailsModal.classList.remove("hidden");
}

function closeActiveDetails() {
  appState.activeDetailsRowKey = "";
  elements.activeDetailsModal.classList.add("hidden");
  elements.activeDetailsBody.innerHTML = "";
}

function rerenderActiveDetailsModal() {
  if (elements.activeDetailsModal.classList.contains("hidden")) {
    return;
  }

  if (!appState.activeDetailsRowKey) {
    return;
  }

  const row = getFilteredActiveRows().find((item) => item.rowKey === appState.activeDetailsRowKey);
  if (!row) {
    return;
  }

  const idLabel = row.globalConfigletId || "No global catalog ID";
  elements.activeDetailsTitle.textContent = `${row.configletName} (${idLabel})`;
  elements.activeDetailsBody.innerHTML = renderActiveDetails(row);
}

function renderBlueprintList(row) {
  if (!Array.isArray(row.blueprints) || row.blueprints.length === 0) {
    return '<div class="cell-subtle">None</div>';
  }

  const countsByBlueprint = new Map();
  for (const entry of row.entries || []) {
    const key = entry.blueprintId || "";
    if (!key) {
      continue;
    }

    const current = countsByBlueprint.get(key) || 0;
    countsByBlueprint.set(key, current + 1);
  }

  const sorted = [...row.blueprints].sort((a, b) => a.blueprintName.localeCompare(b.blueprintName));
  const items = sorted.map((blueprint) => {
    const assignmentCount = countsByBlueprint.get(blueprint.blueprintId) || 0;
    return `
      <li>
        <span class="bp-list-name">${escapeHtml(blueprint.blueprintName)}</span>
        <span class="bp-list-meta">${numberFormat(assignmentCount)} assignment(s)</span>
      </li>
    `;
  }).join("");

  return `<ul class="bp-list">${items}</ul>`;
}

function renderAssignmentSummary(row, syncSummary) {
  const noGlobalCount = Math.max(0, row.assignmentCount - row.inSyncCount - row.outOfSyncCount);

  const metrics = [
    `<li><span>Total</span><strong>${numberFormat(row.assignmentCount)}</strong></li>`,
    `<li><span>In Sync</span><strong>${numberFormat(row.inSyncCount)}</strong></li>`,
    `<li><span>Drifted</span><strong>${numberFormat(row.outOfSyncCount)}</strong></li>`
  ];

  if (noGlobalCount > 0) {
    metrics.push(`<li><span>No Global</span><strong>${numberFormat(noGlobalCount)}</strong></li>`);
  }

  return `
    <span class="sync-pill ${syncSummary.className}">${escapeHtml(syncSummary.label)}</span>
    <ul class="sync-metrics">${metrics.join("")}</ul>
  `;
}

function renderGlobalCatalogIdLink(globalConfigletId) {
  if (!globalConfigletId) {
    return "No global catalog ID";
  }

  const url = buildGlobalCatalogUrl(globalConfigletId);
  if (!url) {
    return escapeHtml(globalConfigletId);
  }

  return `<a class="id-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(globalConfigletId)}</a>`;
}

function getSyncSummary(row) {
  if (!row.globalConfigletId) {
    return {
      className: "sync-missing",
      label: "No global match"
    };
  }

  if (row.outOfSyncCount === 0) {
    return {
      className: "sync-ok",
      label: `${row.inSyncCount}/${row.assignmentCount} in sync`
    };
  }

  if (row.inSyncCount === 0) {
    return {
      className: "sync-drift",
      label: `${row.outOfSyncCount}/${row.assignmentCount} drifted`
    };
  }

  return {
    className: "sync-mixed",
    label: `${row.outOfSyncCount}/${row.assignmentCount} drifted`
  };
}

function renderActiveDetails(row) {
  const sortedEntries = [...row.entries].sort((a, b) => a.blueprintName.localeCompare(b.blueprintName));
  const globalLink = renderGlobalCatalogIdLink(row.globalConfigletId);

  if (sortedEntries.length === 0) {
    return '<div class="details-panel"><h4>No blueprint assignments</h4></div>';
  }

  const cards = sortedEntries.map((entry) => {
    const badgeClass =
      entry.syncStatus === "IN_SYNC"
        ? "sync-ok"
        : entry.syncStatus === "NO_GLOBAL_MATCH"
          ? "sync-missing"
          : "sync-drift";

    const badgeText =
      entry.syncStatus === "IN_SYNC"
        ? "In sync"
        : entry.syncStatus === "NO_GLOBAL_MATCH"
          ? "No global match"
          : "Out of sync";

    let body = '<p class="entry-note">In sync with global catalog.</p>';

    if (entry.syncStatus === "NO_GLOBAL_MATCH") {
      body = `
        <p class="entry-note">No matching entry found in global design catalog.</p>
        <details class="inline-details">
          <summary>Show blueprint configlet text</summary>
          <pre class="diff-pre">${escapeHtml(entry.localText || "(empty)")}</pre>
        </details>
      `;
    }

    if (entry.syncStatus === "OUT_OF_SYNC") {
      body = `
        <details class="inline-details">
          <summary>Show diff: global catalog vs blueprint</summary>
          ${renderDiffHtml(entry.globalText || "", entry.localText || "")}
        </details>
      `;
    }

    return `
      <article class="entry-card">
        <header>
          <div>
            <div class="cell-title">${escapeHtml(entry.blueprintName)}</div>
            <div class="cell-subtle">Blueprint ID: ${escapeHtml(entry.blueprintId)}</div>
          </div>
          <span class="sync-pill ${badgeClass}">${badgeText}</span>
        </header>
        <div class="entry-meta">
          <span>Configlet ID: ${renderBlueprintConfigletLink(entry.configletId, entry.blueprintId, entry.assignmentId)}</span>
          <span>Blueprint Preview ID: ${renderAssignmentLink(entry.blueprintId, entry.assignmentId)}</span>
          <span>Condition: ${escapeHtml(entry.condition || "(none)")}</span>
          <span>Generators: local ${numberFormat(entry.localGeneratorCount)} / global ${numberFormat(entry.globalGeneratorCount)}</span>
        </div>
        ${entry.syncStatus === "OUT_OF_SYNC"
          ? `<div class="entry-actions"><button class="btn btn-primary btn-mini" type="button" data-action="refresh-out-of-sync" data-blueprint-id="${escapeHtml(entry.blueprintId)}" data-configlet-id="${escapeHtml(entry.configletId)}" data-configlet-name="${escapeHtml(row.configletName)}" data-entry-key="${escapeHtml(`${entry.blueprintId}:${entry.configletId}`)}" ${appState.refreshingEntryKey === `${entry.blueprintId}:${entry.configletId}` ? "disabled" : ""}>${appState.refreshingEntryKey === `${entry.blueprintId}:${entry.configletId}` ? "Refreshing..." : "Refresh from Global"}</button></div>`
          : ""}
        ${body}
      </article>
    `;
  }).join("");

  return `
    <div class="details-panel">
      <h4>Blueprint-level sync and diff</h4>
      <p class="entry-note">Global catalog ID: ${globalLink}</p>
      <div class="details-grid">${cards}</div>
    </div>
  `;
}

function renderAssignmentLink(blueprintId, assignmentId) {
  if (!blueprintId) {
    return "n/a";
  }

  const url = buildBlueprintConfigletsPageUrl(blueprintId);
  if (!url) {
    return escapeHtml(assignmentId || blueprintId);
  }

  return `<a class="id-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(assignmentId || blueprintId)}</a>`;
}

function renderBlueprintConfigletLink(configletId, blueprintId, assignmentId) {
  const url = buildBlueprintConfigletsPageUrl(blueprintId);
  if (!url) {
    return escapeHtml(configletId || assignmentId || blueprintId || "n/a");
  }

  return `<a class="id-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(configletId || assignmentId || blueprintId || "n/a")}</a>`;
}

function buildGlobalCatalogUrl(globalConfigletId) {
  const origin = appState.connection?.origin;
  if (!origin || !globalConfigletId) {
    return "";
  }

  return `${origin}/#/design/configlets/${encodeURIComponent(globalConfigletId)}`;
}

function buildBlueprintConfigletsPageUrl(blueprintId) {
  const origin = appState.connection?.origin;
  if (!origin || !blueprintId) {
    return "";
  }

  return `${origin}/#/blueprints/${encodeURIComponent(blueprintId)}/staged/catalog/configlets`;
}

function exportActiveCsv() {
  const rows = getFilteredActiveRows();
  if (!rows.length) {
    showError("No active rows to export for the current filters.", "report");
    return;
  }

  const csvRows = rows.map((row) => {
    const sync = getSyncSummary(row);
    const noGlobalCount = Math.max(0, row.assignmentCount - row.inSyncCount - row.outOfSyncCount);
    const blueprintNames = [...row.blueprints]
      .sort((a, b) => a.blueprintName.localeCompare(b.blueprintName))
      .map((bp) => bp.blueprintName)
      .join(" | ");

    return {
      configlet_name: row.configletName,
      global_catalog_id: row.globalConfigletId || "",
      global_catalog_url: buildGlobalCatalogUrl(row.globalConfigletId || ""),
      blueprint_count: row.blueprintCount,
      blueprints: blueprintNames,
      assignment_total: row.assignmentCount,
      in_sync: row.inSyncCount,
      drifted: row.outOfSyncCount,
      no_global: noGlobalCount,
      sync_summary: sync.label
    };
  });

  downloadCsv(
    `dcd-active-configlets-${buildTimestampSuffix()}.csv`,
    csvRows,
    [
      "configlet_name",
      "global_catalog_id",
      "global_catalog_url",
      "blueprint_count",
      "blueprints",
      "assignment_total",
      "in_sync",
      "drifted",
      "no_global",
      "sync_summary"
    ]
  );

  showToast("Active CSV exported");
}

function exportUnusedCsv() {
  const rows = getFilteredUnusedRows();
  if (!rows.length) {
    showError("No unused rows to export for the current filters.", "report");
    return;
  }

  const csvRows = rows.map((row) => ({
    configlet_name: row.configletName,
    global_catalog_id: row.globalConfigletId || "",
    global_catalog_url: buildGlobalCatalogUrl(row.globalConfigletId || ""),
    last_updated: formatTimestampForCell(row.lastUpdatedAt)
  }));

  downloadCsv(
    `dcd-unused-configlets-${buildTimestampSuffix()}.csv`,
    csvRows,
    ["configlet_name", "global_catalog_id", "global_catalog_url", "last_updated"]
  );

  showToast("Unused CSV exported");
}

function exportInsightsSummaryCsv() {
  if (!appState.insights) {
    showError("Run report first to export insights.", "insights");
    return;
  }

  const insights = appState.insights;
  const row = {
    generated_at: new Date(insights.generatedAt).toISOString(),
    total_assignments: insights.totalAssignments,
    drifted_assignments: insights.totalDriftAssignments,
    drift_rate: formatPercent(insights.driftRate),
    used_global_configlets: insights.usedGlobalConfiglets,
    total_global_configlets: insights.totalGlobalConfiglets,
    global_utilization_rate: formatPercent(insights.globalUtilizationRate),
    single_blueprint_configlets: insights.singleBlueprintConfigletCount,
    drift_hotspot_count: insights.hotspotCount,
    top_blueprint_name: insights.topBlueprint?.blueprintName || "",
    top_blueprint_assignments: insights.topBlueprint?.totalAssignments || 0
  };

  downloadCsv(
    `dcd-insights-summary-${buildTimestampSuffix()}.csv`,
    [row],
    [
      "generated_at",
      "total_assignments",
      "drifted_assignments",
      "drift_rate",
      "used_global_configlets",
      "total_global_configlets",
      "global_utilization_rate",
      "single_blueprint_configlets",
      "drift_hotspot_count",
      "top_blueprint_name",
      "top_blueprint_assignments"
    ]
  );

  showToast("Insights summary CSV exported");
}

function exportInsightsBlueprintCsv() {
  if (!appState.insights || !appState.insights.blueprintMetrics.length) {
    showError("Run report first to export blueprint metrics.", "insights");
    return;
  }

  const rows = appState.insights.blueprintMetrics.map((row) => ({
    blueprint_name: row.blueprintName,
    blueprint_id: row.blueprintId,
    blueprint_url: buildBlueprintConfigletsPageUrl(row.blueprintId),
    assignments: row.totalAssignments,
    drifted: row.driftedAssignments,
    drift_rate: formatPercent(row.driftRate),
    unique_configlets: row.uniqueConfigletCount
  }));

  downloadCsv(
    `dcd-insights-blueprints-${buildTimestampSuffix()}.csv`,
    rows,
    [
      "blueprint_name",
      "blueprint_id",
      "blueprint_url",
      "assignments",
      "drifted",
      "drift_rate",
      "unique_configlets"
    ]
  );

  showToast("Blueprint metrics CSV exported");
}

function exportInsightsJson() {
  if (!appState.insights) {
    showError("Run report first to export insights JSON.", "insights");
    return;
  }

  const payload = {
    generatedAt: new Date(appState.insights.generatedAt).toISOString(),
    insights: appState.insights,
    reportSummary: appState.report
      ? {
          blueprintCount: appState.report.blueprintCount,
          assignmentCount: appState.report.assignmentCount,
          uniqueConfigletCount: appState.report.uniqueConfigletCount,
          outOfSyncConfigletCount: appState.report.outOfSyncConfigletCount,
          unusedConfigletCount: appState.report.unusedConfigletCount
        }
      : null
  };

  downloadJson(`dcd-insights-${buildTimestampSuffix()}.json`, payload);
  showToast("Insights JSON exported");
}

function downloadCsv(filename, rows, columns) {
  const header = columns.join(",");
  const body = rows
    .map((row) => columns.map((column) => escapeCsv(row[column])).join(","))
    .join("\n");

  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function downloadJson(filename, payload) {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function escapeCsv(value) {
  const text = String(value ?? "");
  if (!/[",\n]/.test(text)) {
    return text;
  }

  return `"${text.replaceAll('"', '""')}"`;
}

function buildTimestampSuffix() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function renderDiffHtml(globalText, localText) {
  const diff = buildDiffModel(globalText, localText);

  if (diff.mode === "fallback") {
    return `<pre class="diff-pre">${escapeHtml(
      `Diff is large (${diff.globalLines} vs ${diff.localLines} lines).\n\nGlobal (first 120 lines):\n${diff.globalPreview}\n\nBlueprint (first 120 lines):\n${diff.localPreview}`
    )}</pre>`;
  }

  const lines = diff.lines.map((line) => {
    const className =
      line.type === "add"
        ? "diff-add"
        : line.type === "remove"
          ? "diff-remove"
          : "diff-context";

    return `<span class="${className}">${escapeHtml(`${line.prefix} ${line.text}`)}</span>`;
  }).join("\n");

  return `<pre class="diff-pre">${lines}</pre>`;
}

function buildDiffModel(globalText, localText) {
  const globalLines = splitLines(globalText);
  const localLines = splitLines(localText);

  const complexity = globalLines.length * localLines.length;
  if (complexity > 90_000 || globalLines.length > 420 || localLines.length > 420) {
    return {
      mode: "fallback",
      globalLines: globalLines.length,
      localLines: localLines.length,
      globalPreview: globalLines.slice(0, 120).join("\n"),
      localPreview: localLines.slice(0, 120).join("\n")
    };
  }

  const matrix = Array.from({ length: globalLines.length + 1 }, () =>
    Array(localLines.length + 1).fill(0)
  );

  for (let i = 1; i <= globalLines.length; i += 1) {
    for (let j = 1; j <= localLines.length; j += 1) {
      if (globalLines[i - 1] === localLines[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const lines = [];
  let i = globalLines.length;
  let j = localLines.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && globalLines[i - 1] === localLines[j - 1]) {
      lines.push({ type: "context", prefix: " ", text: globalLines[i - 1] });
      i -= 1;
      j -= 1;
      continue;
    }

    const up = i > 0 ? matrix[i - 1][j] : -1;
    const left = j > 0 ? matrix[i][j - 1] : -1;

    if (j > 0 && left >= up) {
      lines.push({ type: "add", prefix: "+", text: localLines[j - 1] });
      j -= 1;
    } else if (i > 0) {
      lines.push({ type: "remove", prefix: "-", text: globalLines[i - 1] });
      i -= 1;
    }
  }

  lines.reverse();

  if (lines.length > 900) {
    const head = lines.slice(0, 450);
    const tail = lines.slice(lines.length - 450);
    return {
      mode: "ops",
      lines: [
        ...head,
        { type: "context", prefix: " ", text: "... diff truncated ..." },
        ...tail
      ]
    };
  }

  return { mode: "ops", lines };
}

function splitLines(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");
}

function showError(message, scope) {
  let target = elements.errorBanner;
  if (scope === "home") {
    target = elements.homeErrorBanner;
  } else if (scope === "insights") {
    target = elements.insightsErrorBanner;
  }

  target.textContent = message;
  target.classList.remove("hidden");
}

function clearError(scope) {
  if (scope === "home" || !scope) {
    elements.homeErrorBanner.textContent = "";
    elements.homeErrorBanner.classList.add("hidden");
  }

  if (scope === "report" || !scope) {
    elements.errorBanner.textContent = "";
    elements.errorBanner.classList.add("hidden");
  }

  if (scope === "insights" || !scope) {
    elements.insightsErrorBanner.textContent = "";
    elements.insightsErrorBanner.classList.add("hidden");
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");

  if (appState.copiedToastTimer) {
    clearTimeout(appState.copiedToastTimer);
  }

  appState.copiedToastTimer = setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 1200);
}

async function sendMessage(type, payload = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type, ...payload }, (response) => {
      if (chrome.runtime.lastError) {
        const rawMessage = chrome.runtime.lastError.message || "Extension messaging error";
        const friendlyMessage = rawMessage.includes("message port closed")
          ? "Background service worker closed before responding. Reload the extension and try again."
          : rawMessage;

        reject(new Error(friendlyMessage));
        return;
      }

      if (!response?.ok) {
        reject(new Error(response?.error?.message || "Extension request failed"));
        return;
      }

      resolve(response.data);
    });
  });
}

function encodeRowKey(rowKey) {
  return encodeURIComponent(String(rowKey));
}

function decodeRowKey(encodedKey) {
  try {
    return decodeURIComponent(encodedKey);
  } catch {
    return encodedKey;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatUpdatedAt(timestamp) {
  if (!timestamp) {
    return "No data loaded";
  }

  const date = new Date(timestamp);
  return `Updated ${date.toLocaleString()}`;
}

function formatTimestampForCell(timestamp) {
  if (!timestamp) {
    return "Unknown";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString();
}

function formatRelative(timestamp) {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.max(1, Math.round(diffMs / 1000));

  if (diffSec < 60) {
    return `${diffSec}s ago`;
  }

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }

  const diffHours = Math.round(diffMin / 60);
  return `${diffHours}h ago`;
}

function numberFormat(value) {
  return new Intl.NumberFormat().format(Number(value) || 0);
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
