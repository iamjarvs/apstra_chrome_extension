const elements = {
  appShell: document.getElementById("appShell"),
  toggleNavButton: document.getElementById("toggleNavButton"),
  homeView: document.getElementById("homeView"),
  gatewaysView: document.getElementById("gatewaysView"),
  configletsView: document.getElementById("configletsView"),
  navHome: document.getElementById("navHome"),
  navConfiglets: document.getElementById("navConfiglets"),
  navGateways: document.getElementById("navGateways"),
  openConfigletsBtn: document.getElementById("openConfigletsBtn"),
  openGatewaysBtn: document.getElementById("openGatewaysBtn"),
  backHomeButton: document.getElementById("backHomeButton"),
  backHomeFromGatewaysButton: document.getElementById("backHomeFromGatewaysButton"),
  connectionBadge: document.getElementById("connectionBadge"),
  hostValue: document.getElementById("hostValue"),
  tokenValue: document.getElementById("tokenValue"),
  statusMessage: document.getElementById("statusMessage"),
  homeHint: document.getElementById("homeHint"),
  refreshButton: document.getElementById("refreshButton"),
  trafficButton: document.getElementById("trafficButton"),
  loadButton: document.getElementById("loadButton"),
  loadGatewaysButton: document.getElementById("loadGatewaysButton"),
  searchInput: document.getElementById("searchInput"),
  blueprintFilter: document.getElementById("blueprintFilter"),
  sortOrder: document.getElementById("sortOrder"),
  summaryBlueprints: document.getElementById("summaryBlueprints"),
  summaryMappings: document.getElementById("summaryMappings"),
  summaryConfiglets: document.getElementById("summaryConfiglets"),
  summaryFailures: document.getElementById("summaryFailures"),
  summaryUnused: document.getElementById("summaryUnused"),
  gatewaySummaryBlueprints: document.getElementById("gatewaySummaryBlueprints"),
  gatewaySummaryGateways: document.getElementById("gatewaySummaryGateways"),
  gatewaySummaryConnections: document.getElementById("gatewaySummaryConnections"),
  gatewaySummaryPairs: document.getElementById("gatewaySummaryPairs"),
  gatewaySummaryConfirmed: document.getElementById("gatewaySummaryConfirmed"),
  gatewayDiagram: document.getElementById("gatewayDiagram"),
  gatewayDiagramCaption: document.getElementById("gatewayDiagramCaption"),
  gatewayZoomOutButton: document.getElementById("gatewayZoomOutButton"),
  gatewayZoomInButton: document.getElementById("gatewayZoomInButton"),
  gatewayZoomResetButton: document.getElementById("gatewayZoomResetButton"),
  activeResultsBody: document.getElementById("activeResultsBody"),
  unusedResultsBody: document.getElementById("unusedResultsBody"),
  gatewayConnectionsBody: document.getElementById("gatewayConnectionsBody"),
  gatewayUnmatchedBody: document.getElementById("gatewayUnmatchedBody"),
  exportActiveCsvButton: document.getElementById("exportActiveCsvButton"),
  exportUnusedCsvButton: document.getElementById("exportUnusedCsvButton"),
  homeErrorBanner: document.getElementById("homeErrorBanner"),
  errorBanner: document.getElementById("errorBanner"),
  gatewaysErrorBanner: document.getElementById("gatewaysErrorBanner"),
  updatedAt: document.getElementById("updatedAt"),
  gatewaysUpdatedAt: document.getElementById("gatewaysUpdatedAt"),
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
  gatewayReport: null,
  loadingStatus: false,
  loadingReport: false,
  loadingGatewayReport: false,
  gatewayDiagramViewport: {
    scale: 1,
    translateX: 0,
    translateY: 0
  },
  gatewayDiagramDrag: {
    dragging: false,
    startX: 0,
    startY: 0,
    startTranslateX: 0,
    startTranslateY: 0
  },
  gatewayDiagramCleanup: null,
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

  elements.navGateways.addEventListener("click", () => {
    if (!isAuthReady()) {
      showError("Capture token/auth headers first.", "home");
      return;
    }
    setView("gateways");
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

  elements.openGatewaysBtn.addEventListener("click", () => {
    if (!isAuthReady()) {
      showError("Capture token/auth headers first.", "home");
      return;
    }

    setView("gateways");
    if (!appState.gatewayReport) {
      void loadGatewayReport();
    }
  });

  elements.backHomeButton.addEventListener("click", () => setView("home"));
  elements.backHomeFromGatewaysButton.addEventListener("click", () => setView("home"));

  elements.refreshButton.addEventListener("click", () => {
    void refreshConnectionStatus();
  });

  elements.trafficButton.addEventListener("click", () => {
    void refreshTokenCapture();
  });

  elements.loadButton.addEventListener("click", () => {
    void loadReport();
  });

  elements.loadGatewaysButton.addEventListener("click", () => {
    void loadGatewayReport();
  });

  elements.gatewayZoomOutButton.addEventListener("click", () => {
    zoomGatewayDiagramBy(-0.15);
  });

  elements.gatewayZoomInButton.addEventListener("click", () => {
    zoomGatewayDiagramBy(0.15);
  });

  elements.gatewayZoomResetButton.addEventListener("click", () => {
    resetGatewayDiagramViewport();
    applyGatewayDiagramTransform();
  });

  elements.exportActiveCsvButton.addEventListener("click", () => {
    exportActiveCsv();
  });

  elements.exportUnusedCsvButton.addEventListener("click", () => {
    exportUnusedCsv();
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
  renderGatewaySummary();
  renderTables();
  renderGatewayTables();
  await refreshConnectionStatus();
}

function setView(view) {
  appState.view = view;

  const isHome = view === "home";
  const isConfiglets = view === "configlets";
  const isGateways = view === "gateways";

  elements.homeView.classList.toggle("hidden", !isHome);
  elements.configletsView.classList.toggle("hidden", !isConfiglets);
  elements.gatewaysView.classList.toggle("hidden", !isGateways);

  elements.navHome.classList.toggle("active", isHome);
  elements.navConfiglets.classList.toggle("active", isConfiglets);
  elements.navGateways.classList.toggle("active", isGateways);

  if (!isConfiglets) {
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
  clearError("gateway");
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
  elements.updatedAt.textContent = "Loading report...";
  renderTableLoading();
  renderConnectionState();

  try {
    const response = await sendMessage("runConfigletsReport");
    appState.connection = response.connection;
    appState.report = response.report;
    appState.expandedUnusedRowKeys.clear();

    populateBlueprintFilter();
    renderSummary();
    renderTables();
    elements.updatedAt.textContent = formatUpdatedAt(response.report.generatedAt);

    if (response.report.partialFailures.length > 0) {
      showError(
        `Loaded with ${response.report.partialFailures.length} partial failure(s).`,
        "report"
      );
    }
  } catch (error) {
    appState.report = null;
    renderSummary();
    renderTables();
    elements.updatedAt.textContent = "Report failed";
    showError(error.message || "Unable to load report", "report");
  } finally {
    appState.loadingReport = false;
    renderConnectionState();
  }
}

async function loadGatewayReport() {
  if (appState.loadingGatewayReport) {
    return;
  }

  if (!isAuthReady()) {
    showError("Capture token/auth headers first.", "home");
    setView("home");
    return;
  }

  appState.loadingGatewayReport = true;
  clearError("gateway");
  elements.gatewaysUpdatedAt.textContent = "Loading gateway report...";
  renderGatewayLoading();
  renderConnectionState();

  try {
    const response = await sendMessage("runGatewayConnectionsReport");
    appState.connection = response.connection;
    appState.gatewayReport = response.report;
    resetGatewayDiagramViewport();

    renderGatewaySummary();
    renderGatewayTables();
    elements.gatewaysUpdatedAt.textContent = formatUpdatedAt(response.report.generatedAt);

    if (response.report.partialFailures.length > 0) {
      showError(
        `Loaded with ${response.report.partialFailures.length} partial failure(s).`,
        "gateway"
      );
    }
  } catch (error) {
    appState.gatewayReport = null;
    renderGatewaySummary();
    renderGatewayTables();
    elements.gatewaysUpdatedAt.textContent = "Gateway report failed";
    showError(error.message || "Unable to load gateway report", "gateway");
  } finally {
    appState.loadingGatewayReport = false;
    renderConnectionState();
  }
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
  elements.openGatewaysBtn.disabled = !authReady;
  elements.navConfiglets.disabled = !authReady;
  elements.navGateways.disabled = !authReady;

  elements.refreshButton.disabled = appState.loadingStatus;
  elements.trafficButton.disabled = !connection || connection.state === "NOT_ON_DCD_TAB";
  elements.loadButton.disabled = !authReady || appState.loadingReport;
  elements.loadGatewaysButton.disabled = !authReady || appState.loadingGatewayReport;

  elements.homeHint.textContent = authReady
    ? "Ready. Select Configlet Audit or Gateway Links to run reports."
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

function renderGatewaySummary() {
  const report = appState.gatewayReport;

  if (!report) {
    elements.gatewaySummaryBlueprints.textContent = "-";
    elements.gatewaySummaryGateways.textContent = "-";
    elements.gatewaySummaryConnections.textContent = "-";
    elements.gatewaySummaryPairs.textContent = "-";
    elements.gatewaySummaryConfirmed.textContent = "-";
    return;
  }

  elements.gatewaySummaryBlueprints.textContent = numberFormat(report.blueprintCount);
  elements.gatewaySummaryGateways.textContent = numberFormat(report.totalRemoteGateways);
  elements.gatewaySummaryConnections.textContent = numberFormat(report.connectionCount);
  elements.gatewaySummaryPairs.textContent = numberFormat(report.blueprintPairCount);
  elements.gatewaySummaryConfirmed.textContent = numberFormat(report.bgpBackedConnectionCount);
}

function renderGatewayLoading() {
  elements.gatewayConnectionsBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="5">Loading gateway connections...</td></tr>';
  elements.gatewayUnmatchedBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="5">Loading unmatched gateway entries...</td></tr>';
  elements.gatewayDiagram.innerHTML =
    '<div class="gateway-diagram-empty">Loading connectivity diagram...</div>';
  elements.gatewayDiagramCaption.textContent =
    "Edge color: green = high confidence, amber = medium, gray = low. Drag to pan, wheel or +/- to zoom.";
}

function renderGatewayTables() {
  renderGatewayDiagram();
  renderGatewayConnectionsTable();
  renderGatewayUnmatchedTable();
}

function renderGatewayDiagram() {
  if (!appState.gatewayReport) {
    clearGatewayDiagramInteractions();
    elements.gatewayDiagram.innerHTML =
      '<div class="gateway-diagram-empty">Run refresh to render blueprint connectivity.</div>';
    elements.gatewayDiagramCaption.textContent =
      "Edge color: green = high confidence, amber = medium, gray = low. Drag to pan, wheel or +/- to zoom.";
    return;
  }

  const model = buildGatewayDiagramModel(appState.gatewayReport);

  if (model.edges.length === 0) {
    clearGatewayDiagramInteractions();
    elements.gatewayDiagram.innerHTML =
      '<div class="gateway-diagram-empty">No inter-blueprint gateway links found to draw.</div>';
    elements.gatewayDiagramCaption.textContent =
      `Detected ${numberFormat(model.nodes.length)} blueprint node(s) with remote gateways but no cross-blueprint links.`;
    return;
  }

  elements.gatewayDiagram.innerHTML = renderGatewayDiagramSvg(model);
  wireGatewayDiagramInteractions();
  applyGatewayDiagramTransform();
  elements.gatewayDiagramCaption.textContent =
    `${numberFormat(model.nodes.length)} blueprint nodes, ${numberFormat(model.edges.length)} edge(s). Edge color: green = high confidence, amber = medium, gray = low. Drag to pan, wheel or +/- to zoom.`;
}

function buildGatewayDiagramModel(report) {
  const rows = Array.isArray(report?.rows) ? report.rows : [];
  const blueprintRows = Array.isArray(report?.blueprintRows) ? report.blueprintRows : [];

  const nodeMap = new Map();

  for (const row of blueprintRows) {
    if (!row?.blueprintId) {
      continue;
    }

    if ((Number(row.remoteGatewayCount) || 0) <= 0) {
      continue;
    }

    nodeMap.set(row.blueprintId, {
      id: row.blueprintId,
      name: row.blueprintName || row.blueprintId,
      remoteGatewayCount: Number(row.remoteGatewayCount) || 0,
      bgpSessionCount: Number(row.bgpSessionCount) || 0
    });
  }

  const edgeMap = new Map();

  for (const row of rows) {
    const leftId = row.sourceBlueprintId || "";
    const rightId = row.targetBlueprintId || "";
    if (!leftId || !rightId) {
      continue;
    }

    if (!nodeMap.has(leftId)) {
      nodeMap.set(leftId, {
        id: leftId,
        name: row.sourceBlueprintName || leftId,
        remoteGatewayCount: 0,
        bgpSessionCount: 0
      });
    }

    if (!nodeMap.has(rightId)) {
      nodeMap.set(rightId, {
        id: rightId,
        name: row.targetBlueprintName || rightId,
        remoteGatewayCount: 0,
        bgpSessionCount: 0
      });
    }

    const edgeKey = leftId < rightId ? `${leftId}|${rightId}` : `${rightId}|${leftId}`;

    if (!edgeMap.has(edgeKey)) {
      edgeMap.set(edgeKey, {
        key: edgeKey,
        leftId,
        rightId,
        confidence: row.confidence || "low",
        hasBgpEvidence: Boolean(row.hasBgpEvidence),
        reciprocalConfig: Boolean(row.reciprocalConfig),
        linkCount: 1
      });
      continue;
    }

    const existing = edgeMap.get(edgeKey);
    existing.linkCount += 1;
    existing.hasBgpEvidence = existing.hasBgpEvidence || Boolean(row.hasBgpEvidence);
    existing.reciprocalConfig = existing.reciprocalConfig || Boolean(row.reciprocalConfig);

    if (gatewayConfidenceScore(row.confidence || "low") > gatewayConfidenceScore(existing.confidence)) {
      existing.confidence = row.confidence || "low";
    }
  }

  const nodes = Array.from(nodeMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  const edges = Array.from(edgeMap.values());

  const layout = layoutGatewayDiagram(nodes, edges, 900);
  return {
    width: layout.width,
    height: layout.height,
    nodes: layout.nodes,
    edges: layout.edges
  };
}

function layoutGatewayDiagram(nodes, edges, maxWidth) {
  const adjacency = new Map(nodes.map((node) => [node.id, new Set()]));
  for (const edge of edges) {
    adjacency.get(edge.leftId)?.add(edge.rightId);
    adjacency.get(edge.rightId)?.add(edge.leftId);
  }

  const components = [];
  const visited = new Set();

  for (const node of nodes) {
    if (visited.has(node.id)) {
      continue;
    }

    const queue = [node.id];
    visited.add(node.id);
    const componentIds = [];

    while (queue.length > 0) {
      const currentId = queue.shift();
      componentIds.push(currentId);

      for (const neighborId of adjacency.get(currentId) || []) {
        if (visited.has(neighborId)) {
          continue;
        }

        visited.add(neighborId);
        queue.push(neighborId);
      }
    }

    components.push(componentIds);
  }

  components.sort((a, b) => b.length - a.length);

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const positionedNodes = [];
  const positionById = new Map();

  const canvasWidth = Math.max(700, maxWidth || 900);
  const margin = 28;
  const gap = 24;
  const nodeRadius = 34;

  let cursorX = margin;
  let cursorY = margin;
  let rowHeight = 0;
  let usedWidth = margin;

  for (const componentIds of components) {
    const count = componentIds.length;
    const radius = count === 1 ? 0 : Math.max(74, 34 * count);
    const componentWidth = Math.max(220, radius * 2 + 160);
    const componentHeight = Math.max(200, radius * 2 + 130);

    if (cursorX + componentWidth + margin > canvasWidth && cursorX > margin) {
      cursorX = margin;
      cursorY += rowHeight + gap;
      rowHeight = 0;
    }

    const centerX = cursorX + componentWidth / 2;
    const centerY = cursorY + componentHeight / 2;

    const sortedNodes = componentIds
      .map((id) => nodeById.get(id))
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));

    sortedNodes.forEach((node, index) => {
      let x = centerX;
      let y = centerY;

      if (sortedNodes.length > 1) {
        if (sortedNodes.length === 2) {
          x = centerX + (index === 0 ? -radius : radius);
          y = centerY;
        } else {
          const angle = (-Math.PI / 2) + ((2 * Math.PI * index) / sortedNodes.length);
          x = centerX + (radius * Math.cos(angle));
          y = centerY + (radius * Math.sin(angle));
        }
      }

      const positioned = {
        ...node,
        x,
        y
      };

      positionedNodes.push(positioned);
      positionById.set(node.id, positioned);
    });

    cursorX += componentWidth + gap;
    rowHeight = Math.max(rowHeight, componentHeight);
    usedWidth = Math.max(usedWidth, cursorX);
  }

  // Center the occupied node cloud so small topologies do not hug the left edge.
  if (positionedNodes.length > 0) {
    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;

    for (const node of positionedNodes) {
      minX = Math.min(minX, node.x - nodeRadius);
      maxX = Math.max(maxX, node.x + nodeRadius);
    }

    const currentCenterX = (minX + maxX) / 2;
    const targetCenterX = canvasWidth / 2;
    const shiftX = targetCenterX - currentCenterX;

    for (const node of positionedNodes) {
      node.x += shiftX;
      positionById.set(node.id, node);
    }
  }

  const height = cursorY + rowHeight + margin;

  const positionedEdges = edges
    .map((edge) => {
      const left = positionById.get(edge.leftId);
      const right = positionById.get(edge.rightId);
      if (!left || !right) {
        return null;
      }

      return {
        ...edge,
        x1: left.x,
        y1: left.y,
        x2: right.x,
        y2: right.y,
        midX: (left.x + right.x) / 2,
        midY: (left.y + right.y) / 2,
        curvePolarity: getEdgeCurvePolarity(edge.key)
      };
    })
    .filter(Boolean);

  return {
    width: Math.max(canvasWidth, usedWidth + margin),
    height: Math.max(260, height),
    nodes: positionedNodes,
    edges: positionedEdges
  };
}

function renderGatewayDiagramSvg(model) {
  const markerDefs = `
    <defs>
      <marker id="gwArrowHead" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L10,4 L0,8 z" fill="#7a8ea4"></path>
      </marker>
      <filter id="gwNodeShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#7ea4c9" flood-opacity="0.24"></feDropShadow>
      </filter>
    </defs>
  `;

  const edgeSvg = model.edges.map((edge) => {
    const confidenceClass =
      edge.confidence === "high"
        ? "gw-edge-high"
        : edge.confidence === "medium"
          ? "gw-edge-medium"
          : "gw-edge-low";

    const path = buildCurvedEdgePath(edge);

    const edgeTitle = `${edge.leftName || edge.leftId} <-> ${edge.rightName || edge.rightId} | ${edge.confidence || "low"} confidence | ${edge.linkCount} link(s)`;

    const linkCountLabel = edge.linkCount > 1
      ? `
        <rect class="gw-edge-count-bg" x="${(edge.midX - 11).toFixed(1)}" y="${(edge.midY - 9).toFixed(1)}" width="22" height="14" rx="7"></rect>
        <text class="gw-edge-count-text" x="${edge.midX.toFixed(1)}" y="${(edge.midY + 1).toFixed(1)}">${edge.linkCount}</text>
      `
      : "";

    return `
      <g>
        <path class="gw-edge ${confidenceClass}" d="${path}" marker-end="url(#gwArrowHead)"></path>
        <title>${escapeHtml(edgeTitle)}</title>
        ${linkCountLabel}
      </g>
    `;
  }).join("");

  const nodeSvg = model.nodes.map((node) => {
    const label = splitNodeLabel(node.name || node.id, 10);
    const meta = `${numberFormat(node.remoteGatewayCount)} gw`;
    const tooltip = `${node.name}\n${node.id}\n${numberFormat(node.remoteGatewayCount)} gateway(s)`;

    return `
      <g class="gw-node">
        <circle class="gw-node-circle" cx="${node.x.toFixed(1)}" cy="${node.y.toFixed(1)}" r="34"></circle>
        <text class="gw-node-title" x="${node.x.toFixed(1)}" y="${(node.y - 8).toFixed(1)}">${escapeHtml(label.line1)}</text>
        ${label.line2 ? `<text class="gw-node-title" x="${node.x.toFixed(1)}" y="${(node.y + 5).toFixed(1)}">${escapeHtml(label.line2)}</text>` : ""}
        <text class="gw-node-meta" x="${node.x.toFixed(1)}" y="${(node.y + 22).toFixed(1)}">${escapeHtml(meta)}</text>
        <title>${escapeHtml(tooltip)}</title>
      </g>
    `;
  }).join("");

  return `
    <svg class="gateway-diagram-svg" viewBox="0 0 ${model.width} ${model.height}" role="img" aria-label="Blueprint gateway connectivity diagram">
      ${markerDefs}
      ${edgeSvg}
      ${nodeSvg}
    </svg>
  `;
}

function buildCurvedEdgePath(edge) {
  const dx = edge.x2 - edge.x1;
  const dy = edge.y2 - edge.y1;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / distance;
  const ny = dx / distance;

  const curveAmount = Math.min(24, Math.max(8, distance * 0.08));
  const curve = curveAmount * (edge.curvePolarity || 1);
  const cx = edge.midX + (nx * curve);
  const cy = edge.midY + (ny * curve);

  return `M ${edge.x1.toFixed(1)} ${edge.y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${edge.x2.toFixed(1)} ${edge.y2.toFixed(1)}`;
}

function getEdgeCurvePolarity(value) {
  const text = String(value || "");
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(index);
    hash |= 0;
  }

  return (hash & 1) === 0 ? 1 : -1;
}

function splitNodeLabel(value, maxLineLength) {
  const text = String(value || "").trim();
  if (!text) {
    return { line1: "(unnamed)", line2: "" };
  }

  const dashParts = text.split(" - ").map((part) => part.trim()).filter(Boolean);
  if (dashParts.length === 2) {
    return {
      line1: truncateMiddle(dashParts[0], maxLineLength),
      line2: truncateMiddle(dashParts[1], maxLineLength)
    };
  }

  if (text.length <= maxLineLength) {
    return { line1: text, line2: "" };
  }

  const words = text.split(/\s+/g).filter(Boolean);
  if (words.length > 1) {
    let line1 = "";
    let line2 = "";

    for (const word of words) {
      if (!line1 || `${line1} ${word}`.length <= maxLineLength) {
        line1 = line1 ? `${line1} ${word}` : word;
        continue;
      }

      line2 = `${line2} ${word}`.trim();
    }

    if (line2.length > maxLineLength) {
      line2 = truncateMiddle(line2, maxLineLength);
    }

    return { line1: truncateMiddle(line1, maxLineLength), line2 };
  }

  const first = text.slice(0, maxLineLength);
  const second = truncateMiddle(text.slice(maxLineLength), maxLineLength);
  return { line1: first, line2: second };
}

function clearGatewayDiagramInteractions() {
  if (typeof appState.gatewayDiagramCleanup === "function") {
    appState.gatewayDiagramCleanup();
  }

  appState.gatewayDiagramCleanup = null;
  appState.gatewayDiagramDrag.dragging = false;
  elements.gatewayDiagram.classList.remove("is-dragging");
}

function wireGatewayDiagramInteractions() {
  clearGatewayDiagramInteractions();

  const svg = elements.gatewayDiagram.querySelector("svg.gateway-diagram-svg");
  if (!(svg instanceof SVGElement)) {
    return;
  }

  const onWheel = (event) => {
    event.preventDefault();

    const delta = event.deltaY > 0 ? -0.12 : 0.12;
    zoomGatewayDiagramBy(delta, event.clientX, event.clientY);
  };

  const onPointerDown = (event) => {
    appState.gatewayDiagramDrag.dragging = true;
    appState.gatewayDiagramDrag.startX = event.clientX;
    appState.gatewayDiagramDrag.startY = event.clientY;
    appState.gatewayDiagramDrag.startTranslateX = appState.gatewayDiagramViewport.translateX;
    appState.gatewayDiagramDrag.startTranslateY = appState.gatewayDiagramViewport.translateY;
    elements.gatewayDiagram.classList.add("is-dragging");
  };

  const onPointerMove = (event) => {
    if (!appState.gatewayDiagramDrag.dragging) {
      return;
    }

    const dx = event.clientX - appState.gatewayDiagramDrag.startX;
    const dy = event.clientY - appState.gatewayDiagramDrag.startY;

    appState.gatewayDiagramViewport.translateX = appState.gatewayDiagramDrag.startTranslateX + dx;
    appState.gatewayDiagramViewport.translateY = appState.gatewayDiagramDrag.startTranslateY + dy;
    applyGatewayDiagramTransform();
  };

  const onPointerUp = () => {
    appState.gatewayDiagramDrag.dragging = false;
    elements.gatewayDiagram.classList.remove("is-dragging");
  };

  elements.gatewayDiagram.addEventListener("wheel", onWheel, { passive: false });
  elements.gatewayDiagram.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  appState.gatewayDiagramCleanup = () => {
    elements.gatewayDiagram.removeEventListener("wheel", onWheel);
    elements.gatewayDiagram.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
  };
}

function resetGatewayDiagramViewport() {
  appState.gatewayDiagramViewport.scale = 1;
  appState.gatewayDiagramViewport.translateX = 0;
  appState.gatewayDiagramViewport.translateY = 0;
}

function zoomGatewayDiagramBy(delta, anchorClientX = null, anchorClientY = null) {
  const svg = elements.gatewayDiagram.querySelector("svg.gateway-diagram-svg");
  if (!(svg instanceof SVGElement)) {
    return;
  }

  const currentScale = appState.gatewayDiagramViewport.scale;
  const nextScale = clampNumber(currentScale + delta, 0.55, 2.8);
  if (nextScale === currentScale) {
    return;
  }

  const rect = svg.getBoundingClientRect();
  const pointX = anchorClientX === null ? rect.left + (rect.width / 2) : anchorClientX;
  const pointY = anchorClientY === null ? rect.top + (rect.height / 2) : anchorClientY;
  const localX = pointX - rect.left;
  const localY = pointY - rect.top;

  const factor = nextScale / currentScale;

  appState.gatewayDiagramViewport.translateX =
    localX - ((localX - appState.gatewayDiagramViewport.translateX) * factor);
  appState.gatewayDiagramViewport.translateY =
    localY - ((localY - appState.gatewayDiagramViewport.translateY) * factor);
  appState.gatewayDiagramViewport.scale = nextScale;

  applyGatewayDiagramTransform();
}

function applyGatewayDiagramTransform() {
  const svg = elements.gatewayDiagram.querySelector("svg.gateway-diagram-svg");
  if (!(svg instanceof SVGElement)) {
    return;
  }

  const { scale, translateX, translateY } = appState.gatewayDiagramViewport;
  svg.style.transform = `translate(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function gatewayConfidenceScore(confidence) {
  if (confidence === "high") {
    return 3;
  }

  if (confidence === "medium") {
    return 2;
  }

  return 1;
}

function truncateMiddle(value, maxLength) {
  const text = String(value || "");
  if (text.length <= maxLength) {
    return text;
  }

  const head = Math.ceil((maxLength - 1) / 2);
  const tail = Math.floor((maxLength - 1) / 2);
  return `${text.slice(0, head)}~${text.slice(text.length - tail)}`;
}

function renderGatewayConnectionsTable() {
  const rows = Array.isArray(appState.gatewayReport?.rows) ? appState.gatewayReport.rows : [];

  if (!appState.gatewayReport) {
    elements.gatewayConnectionsBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="5">Run refresh to load gateway connections.</td></tr>';
    return;
  }

  if (rows.length === 0) {
    elements.gatewayConnectionsBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="5">No inter-blueprint gateway matches were detected.</td></tr>';
    return;
  }

  elements.gatewayConnectionsBody.innerHTML = rows.map((row) => `
    <tr>
      <td>
        <div class="cell-title">${escapeHtml(row.sourceBlueprintName)}</div>
        <div class="cell-subtle gateway-mono">${escapeHtml(row.sourceBlueprintId)}</div>
      </td>
      <td>
        <div class="cell-title">${escapeHtml(row.sourceGatewayName || row.sourceGatewayId || "(unknown)")}</div>
        <div class="gateway-meta">
          <span>IP: ${escapeHtml(row.sourceGatewayIp || "n/a")}</span>
          <span>ASN: ${escapeHtml(row.sourceGatewayAsn ?? "n/a")}</span>
          <span>Local GW Nodes: ${escapeHtml((row.sourceLocalNodeLabels || []).join(", ") || "n/a")}</span>
        </div>
      </td>
      <td>
        <div class="cell-title">${escapeHtml(row.targetBlueprintName)}</div>
        <div class="cell-subtle gateway-mono">${escapeHtml(row.targetBlueprintId)}</div>
      </td>
      <td>
        <div class="cell-title">${escapeHtml(row.targetGatewayName || row.targetGatewayId || "(unknown)")}</div>
        <div class="gateway-meta">
          <span>IP: ${escapeHtml(row.targetGatewayIp || "n/a")}</span>
          <span>ASN: ${escapeHtml(row.targetGatewayAsn ?? "n/a")}</span>
          <span>Local GW Nodes: ${escapeHtml((row.targetLocalNodeLabels || []).join(", ") || "n/a")}</span>
        </div>
      </td>
      <td>
        ${renderGatewayEvidenceCell(row)}
      </td>
    </tr>
  `).join("");
}

function renderGatewayUnmatchedTable() {
  const rows = Array.isArray(appState.gatewayReport?.unmatchedRows)
    ? appState.gatewayReport.unmatchedRows
    : [];

  if (!appState.gatewayReport) {
    elements.gatewayUnmatchedBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="5">Run refresh to inspect unmatched gateway entries.</td></tr>';
    return;
  }

  if (rows.length === 0) {
    elements.gatewayUnmatchedBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="5">No unmatched gateway entries.</td></tr>';
    return;
  }

  elements.gatewayUnmatchedBody.innerHTML = rows.map((row) => `
    <tr>
      <td>
        <div class="cell-title">${escapeHtml(row.blueprintName)}</div>
        <div class="cell-subtle gateway-mono">${escapeHtml(row.blueprintId)}</div>
      </td>
      <td>
        <div class="cell-title">${escapeHtml(row.gatewayName || row.gatewayId || "(unknown)")}</div>
      </td>
      <td>
        <div class="cell-title gateway-mono">${escapeHtml(row.gatewayIp || "n/a")}</div>
      </td>
      <td>
        <div class="gateway-meta">
          <span>Nodes: ${escapeHtml((row.localNodeLabels || []).join(", ") || "n/a")}</span>
          <span>Local EVPN IPs: ${escapeHtml((row.localEvpnIps || []).join(", ") || "n/a")}</span>
        </div>
      </td>
      <td>
        <div class="cell-subtle">${escapeHtml(row.reason || "Unknown reason")}</div>
      </td>
    </tr>
  `).join("");
}

function renderGatewayEvidenceCell(row) {
  const className =
    row.confidence === "high"
      ? "evidence-high"
      : row.confidence === "medium"
        ? "evidence-medium"
        : "evidence-low";

  const label =
    row.confidence === "high"
      ? "High confidence"
      : row.confidence === "medium"
        ? "Medium confidence"
        : "Low confidence";

  const sharedPairs = Array.isArray(row.sharedBgpPairs) ? row.sharedBgpPairs : [];

  const lines = [
    `<li>Reciprocal gateway config: <strong>${row.reciprocalConfig ? "Yes" : "No"}</strong></li>`,
    `<li>BGP evidence: <strong>${row.hasBgpEvidence ? "Yes" : "No"}</strong></li>`
  ];

  if (sharedPairs.length > 0) {
    lines.push(`<li>Shared BGP endpoint pairs: <span class="gateway-mono">${escapeHtml(sharedPairs.join(", "))}</span></li>`);
  }

  return `
    <span class="evidence-pill ${className}">${label}</span>
    <ul class="evidence-list">${lines.join("")}</ul>
  `;
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
  const target =
    scope === "home"
      ? elements.homeErrorBanner
      : scope === "gateway"
        ? elements.gatewaysErrorBanner
        : elements.errorBanner;
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

  if (scope === "gateway" || !scope) {
    elements.gatewaysErrorBanner.textContent = "";
    elements.gatewaysErrorBanner.classList.add("hidden");
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
        const rawErrorMessage = response?.error?.message || "Extension request failed";

        // If popup JS is newer than the active service worker, MV3 can return
        // Unsupported request until the extension is reloaded.
        if (rawErrorMessage === "Unsupported request") {
          reject(new Error("Gateway Links requires a full extension reload so the background service worker picks up the new handler."));
          return;
        }

        reject(new Error(rawErrorMessage));
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
