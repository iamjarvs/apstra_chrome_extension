const elements = {
  appShell: document.getElementById("appShell"),
  toggleNavButton: document.getElementById("toggleNavButton"),
  homeView: document.getElementById("homeView"),
  featureRequestView: document.getElementById("featureRequestView"),
  gatewaysView: document.getElementById("gatewaysView"),
  vxlansView: document.getElementById("vxlansView"),
  vrfsView: document.getElementById("vrfsView"),
  configletsView: document.getElementById("configletsView"),
  navHome: document.getElementById("navHome"),
  navConfiglets: document.getElementById("navConfiglets"),
  navGateways: document.getElementById("navGateways"),
  navVxlans: document.getElementById("navVxlans"),
  navVrfs: document.getElementById("navVrfs"),
  openConfigletsBtn: document.getElementById("openConfigletsBtn"),
  openGatewaysBtn: document.getElementById("openGatewaysBtn"),
  openVxlansBtn: document.getElementById("openVxlansBtn"),
  openVrfsBtn: document.getElementById("openVrfsBtn"),
  openFeedbackButton: document.getElementById("openFeedbackButton"),
  featureRequestForm: document.getElementById("featureRequestForm"),
  featureRequestType: document.getElementById("featureRequestType"),
  backHomeButton: document.getElementById("backHomeButton"),
  backHomeFromGatewaysButton: document.getElementById("backHomeFromGatewaysButton"),
  backHomeFromVxlansButton: document.getElementById("backHomeFromVxlansButton"),
  backHomeFromVrfsButton: document.getElementById("backHomeFromVrfsButton"),
  connectionBadge: document.getElementById("connectionBadge"),
  hostValue: document.getElementById("hostValue"),
  tokenValue: document.getElementById("tokenValue"),
  statusMessage: document.getElementById("statusMessage"),
  homeHint: document.getElementById("homeHint"),
  refreshButton: document.getElementById("refreshButton"),
  trafficButton: document.getElementById("trafficButton"),
  loadButton: document.getElementById("loadButton"),
  loadGatewaysButton: document.getElementById("loadGatewaysButton"),
  loadVxlansButton: document.getElementById("loadVxlansButton"),
  loadVrfsButton: document.getElementById("loadVrfsButton"),
  openVxlanPlannerButton: document.getElementById("openVxlanPlannerButton"),
  openVrfPlannerButton: document.getElementById("openVrfPlannerButton"),
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
  vxlanSummaryBlueprints: document.getElementById("vxlanSummaryBlueprints"),
  vxlanSummaryTotal: document.getElementById("vxlanSummaryTotal"),
  vxlanSummaryUnique: document.getElementById("vxlanSummaryUnique"),
  vxlanSummaryFull: document.getElementById("vxlanSummaryFull"),
  vxlanSummaryPartial: document.getElementById("vxlanSummaryPartial"),
  vxlanSummaryBlocked: document.getElementById("vxlanSummaryBlocked"),
  vxlanPrereqCallout: document.getElementById("vxlanPrereqCallout"),
  vxlanPrereqDetail: document.getElementById("vxlanPrereqDetail"),
  vxlanPrereqZones: document.getElementById("vxlanPrereqZones"),
  vxlanGoToVrfStretchButton: document.getElementById("vxlanGoToVrfStretchButton"),
  vxlanHideBlockedToggle: document.getElementById("vxlanHideBlockedToggle"),
  vxlanScopeList: document.getElementById("vxlanScopeList"),
  vxlanBlueprintCompatibilityBody: document.getElementById("vxlanBlueprintCompatibilityBody"),
  vxlanSourceBlueprint: document.getElementById("vxlanSourceBlueprint"),
  vxlanSelectStretchableButton: document.getElementById("vxlanSelectStretchableButton"),
  vxlanClearSelectionButton: document.getElementById("vxlanClearSelectionButton"),
  vxlanStretchSelectedButton: document.getElementById("vxlanStretchSelectedButton"),
  vxlanSelectionStatus: document.getElementById("vxlanSelectionStatus"),
  vxlanPlannerSelectionStatus: document.getElementById("vxlanPlannerSelectionStatus"),
  vxlanProgressPanel: document.getElementById("vxlanProgressPanel"),
  vxlanProgressSummary: document.getElementById("vxlanProgressSummary"),
  vxlanProgressIssues: document.getElementById("vxlanProgressIssues"),
  vxlanRowDetailsModal: document.getElementById("vxlanRowDetailsModal"),
  vxlanRowDetailsTitle: document.getElementById("vxlanRowDetailsTitle"),
  vxlanRowDetailsBody: document.getElementById("vxlanRowDetailsBody"),
  closeVxlanRowDetailsButton: document.getElementById("closeVxlanRowDetailsButton"),
  vrfConfirmModal: document.getElementById("vrfConfirmModal"),
  vrfConfirmIntro: document.getElementById("vrfConfirmIntro"),
  vrfConfirmList: document.getElementById("vrfConfirmList"),
  vrfConfirmZonesSection: document.getElementById("vrfConfirmZonesSection"),
  vrfConfirmVxlanBody: document.getElementById("vrfConfirmVxlanBody"),
  vrfConfirmVxlanCount: document.getElementById("vrfConfirmVxlanCount"),
  vrfConfirmWarningsSection: document.getElementById("vrfConfirmWarningsSection"),
  vrfConfirmWarnings: document.getElementById("vrfConfirmWarnings"),
  vrfConfirmWarningCount: document.getElementById("vrfConfirmWarningCount"),
  vrfConfirmStatus: document.getElementById("vrfConfirmStatus"),
  vrfConfirmSelectAllButton: document.getElementById("vrfConfirmSelectAllButton"),
  vrfConfirmSelectNoneButton: document.getElementById("vrfConfirmSelectNoneButton"),
  vrfConfirmProceedButton: document.getElementById("vrfConfirmProceedButton"),
  vrfConfirmSkipButton: document.getElementById("vrfConfirmSkipButton"),
  vrfConfirmCancelButton: document.getElementById("vrfConfirmCancelButton"),
  vxlanFullBody: document.getElementById("vxlanFullBody"),
  vxlanPartialBody: document.getElementById("vxlanPartialBody"),
  vxlanPlannerBody: document.getElementById("vxlanPlannerBody"),
  vxlanConflictBody: document.getElementById("vxlanConflictBody"),
  vxlanConflictCount: document.getElementById("vxlanConflictCount"),
  vxlanLastResultsBody: document.getElementById("vxlanLastResultsBody"),
  vrfSummaryBlueprints: document.getElementById("vrfSummaryBlueprints"),
  vrfSummaryTotal: document.getElementById("vrfSummaryTotal"),
  vrfSummaryUnique: document.getElementById("vrfSummaryUnique"),
  vrfSummaryFull: document.getElementById("vrfSummaryFull"),
  vrfSummaryPartial: document.getElementById("vrfSummaryPartial"),
  vrfScopeList: document.getElementById("vrfScopeList"),
  vrfBlueprintCompatibilityBody: document.getElementById("vrfBlueprintCompatibilityBody"),
  vrfSourceBlueprint: document.getElementById("vrfSourceBlueprint"),
  vrfSelectStretchableButton: document.getElementById("vrfSelectStretchableButton"),
  vrfClearSelectionButton: document.getElementById("vrfClearSelectionButton"),
  vrfStretchSelectedButton: document.getElementById("vrfStretchSelectedButton"),
  vrfSelectionStatus: document.getElementById("vrfSelectionStatus"),
  vrfPlannerSelectionStatus: document.getElementById("vrfPlannerSelectionStatus"),
  vrfProgressPanel: document.getElementById("vrfProgressPanel"),
  vrfProgressSummary: document.getElementById("vrfProgressSummary"),
  vrfProgressIssues: document.getElementById("vrfProgressIssues"),
  vrfFullBody: document.getElementById("vrfFullBody"),
  vrfPartialBody: document.getElementById("vrfPartialBody"),
  vrfPlannerBody: document.getElementById("vrfPlannerBody"),
  vrfLastResultsBody: document.getElementById("vrfLastResultsBody"),
  vrfSummaryBlocked: document.getElementById("vrfSummaryBlocked"),
  vrfHideBlockedToggle: document.getElementById("vrfHideBlockedToggle"),
  vrfRowDetailsModal: document.getElementById("vrfRowDetailsModal"),
  vrfRowDetailsTitle: document.getElementById("vrfRowDetailsTitle"),
  vrfRowDetailsBody: document.getElementById("vrfRowDetailsBody"),
  closeVrfRowDetailsButton: document.getElementById("closeVrfRowDetailsButton"),
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
  vxlansErrorBanner: document.getElementById("vxlansErrorBanner"),
  vrfsErrorBanner: document.getElementById("vrfsErrorBanner"),
  updatedAt: document.getElementById("updatedAt"),
  gatewaysUpdatedAt: document.getElementById("gatewaysUpdatedAt"),
  vxlansUpdatedAt: document.getElementById("vxlansUpdatedAt"),
  vrfsUpdatedAt: document.getElementById("vrfsUpdatedAt"),
  toast: document.getElementById("toast"),
  activeDetailsModal: document.getElementById("activeDetailsModal"),
  activeDetailsTitle: document.getElementById("activeDetailsTitle"),
  activeDetailsBody: document.getElementById("activeDetailsBody"),
  closeActiveDetailsButton: document.getElementById("closeActiveDetailsButton"),
  vxlanPlannerModal: document.getElementById("vxlanPlannerModal"),
  closeVxlanPlannerButton: document.getElementById("closeVxlanPlannerButton"),
  vrfPlannerModal: document.getElementById("vrfPlannerModal"),
  closeVrfPlannerButton: document.getElementById("closeVrfPlannerButton")
};

const appState = {
  view: "home",
  connection: null,
  report: null,
  gatewayReport: null,
  vxlanReport: null,
  vrfReport: null,
  loadingStatus: false,
  loadingReport: false,
  loadingGatewayReport: false,
  loadingVxlanReport: false,
  loadingVrfReport: false,
  stretchingVxlans: false,
  stretchingVrfs: false,
  vxlanScopeBlueprintIds: new Set(),
  vxlanSelectedStretchKeys: new Set(),
  vxlanSourceBlueprintId: "auto",
  vxlanHideBlocked: false,
  vxlanAutoVlanKeys: new Set(),
  vxlanPlannerOrder: [],
  vrfAutoVlanKeys: new Set(),
  vrfPlannerOrder: [],
  stretchProgress: { vxlan: null, vrf: null },
  stretchProgressRoute: {},
  requiredVrfs: [],
  selectedRequiredVrfKeys: new Set(),
  vrfConfirmResolver: null,
  lastVxlanStretchResult: null,
  vxlanPlannerOpen: false,
  vrfScopeBlueprintIds: new Set(),
  vrfSelectedStretchKeys: new Set(),
  vrfSourceBlueprintId: "auto",
  vrfHideBlocked: false,
  lastVrfStretchResult: null,
  vrfPlannerOpen: false,
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
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "stretchProgress") {
      recordStretchProgress(message);
    }
  });

  elements.toggleNavButton.addEventListener("click", () => {
    const isCollapsed = elements.appShell.classList.toggle("is-collapsed-nav");
    elements.toggleNavButton.setAttribute("aria-label", isCollapsed ? "Expand menu" : "Collapse menu");
    elements.toggleNavButton.setAttribute("title", isCollapsed ? "Expand menu" : "Collapse menu");
  });

  elements.navHome.addEventListener("click", () => setView("home"));
  elements.openFeedbackButton.addEventListener("click", () => setView("feature-request"));
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

  elements.navVxlans.addEventListener("click", () => {
    if (!isAuthReady()) {
      showError("Capture token/auth headers first.", "home");
      return;
    }

    setView("vxlans");
  });

  elements.navVrfs.addEventListener("click", () => {
    if (!isAuthReady()) {
      showError("Capture token/auth headers first.", "home");
      return;
    }

    setView("vrfs");
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

  elements.openVxlansBtn.addEventListener("click", () => {
    if (!isAuthReady()) {
      showError("Capture token/auth headers first.", "home");
      return;
    }

    setView("vxlans");
    if (!appState.vxlanReport) {
      void loadVxlanReport();
    }
  });

  elements.openVrfsBtn.addEventListener("click", () => {
    if (!isAuthReady()) {
      showError("Capture token/auth headers first.", "home");
      return;
    }

    setView("vrfs");
    if (!appState.vrfReport) {
      void loadVrfReport();
    }
  });

  elements.featureRequestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    openFeatureRequestIssue();
  });

  elements.backHomeButton.addEventListener("click", () => setView("home"));
  elements.backHomeFromGatewaysButton.addEventListener("click", () => setView("home"));
  elements.backHomeFromVxlansButton.addEventListener("click", () => setView("home"));
  elements.backHomeFromVrfsButton.addEventListener("click", () => setView("home"));

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

  elements.loadVxlansButton.addEventListener("click", () => {
    void loadVxlanReport();
  });

  elements.loadVrfsButton.addEventListener("click", () => {
    void loadVrfReport();
  });

  elements.openVxlanPlannerButton.addEventListener("click", () => {
    openVxlanPlanner();
  });

  elements.openVrfPlannerButton.addEventListener("click", () => {
    openVrfPlanner();
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

  elements.vxlanScopeList.addEventListener("change", (event) => {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    if (!input || input.name !== "vxlan-scope") {
      return;
    }

    if (input.checked) {
      appState.vxlanScopeBlueprintIds.add(input.value);
    } else {
      appState.vxlanScopeBlueprintIds.delete(input.value);
    }

    if (appState.vxlanScopeBlueprintIds.size === 0) {
      appState.vxlanScopeBlueprintIds.add(input.value);
      input.checked = true;
      showError("Select at least one blueprint in scope.", "vxlan");
      return;
    }

    clearError("vxlan");
    syncVxlanSourceAndTargetsAfterScopeChange();
    if (getScopedBlueprintIds().length < 2) {
      closeVxlanPlanner();
    }
    renderVxlanScopeControls();
    renderVxlanSummary();
    renderVxlanTables();
  });

  elements.vxlanSourceBlueprint.addEventListener("change", () => {
    appState.vxlanSourceBlueprintId = elements.vxlanSourceBlueprint.value;

    appState.vxlanSelectedStretchKeys.clear();
    renderVxlanScopeControls();
    renderVxlanTables();
  });

  elements.vxlanSelectStretchableButton.addEventListener("click", () => {
    selectAllStretchableVxlans();
  });

  elements.vxlanHideBlockedToggle.addEventListener("change", () => {
    appState.vxlanHideBlocked = elements.vxlanHideBlockedToggle.checked;
    renderVxlanPlannerTable();
  });

  elements.vxlanPlannerBody.addEventListener("click", (event) => {
    const button = event.target instanceof HTMLElement ? event.target.closest("[data-details-key]") : null;
    if (button) {
      openVxlanRowDetails(button.dataset.detailsKey || "");
    }
  });

  elements.closeVxlanRowDetailsButton.addEventListener("click", () => {
    closeVxlanRowDetails();
  });

  elements.vxlanRowDetailsModal.addEventListener("click", (event) => {
    if (event.target === elements.vxlanRowDetailsModal) {
      closeVxlanRowDetails();
    }
  });

  elements.vrfConfirmList.addEventListener("change", (event) => {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    if (!input) {
      return;
    }

    if (input.name === "required-vrf-auto-vlan") {
      const key = input.dataset.stretchKey || "";
      if (input.checked) {
        appState.vrfAutoVlanKeys.add(key);
      } else {
        appState.vrfAutoVlanKeys.delete(key);
        appState.selectedRequiredVrfKeys.delete(key);
      }

      appState.requiredVrfs = buildRequiredVrfList(
        Array.from(appState.vxlanSelectedStretchKeys),
        getScopedBlueprintIds()
      );
      for (const item of appState.requiredVrfs) {
        if (isRequiredVrfSelectable(item) && item.autoVlan) {
          appState.selectedRequiredVrfKeys.add(item.stretchKey);
        }
      }

      renderVrfConfirmList();
      return;
    }

    if (input.name !== "required-vrf") {
      return;
    }

    if (input.checked) {
      appState.selectedRequiredVrfKeys.add(input.value);
    } else {
      appState.selectedRequiredVrfKeys.delete(input.value);
    }

    renderVrfConfirmList();
  });

  elements.vrfConfirmSelectAllButton.addEventListener("click", () => {
    appState.selectedRequiredVrfKeys = new Set(
      (appState.requiredVrfs || []).filter(isRequiredVrfSelectable).map((item) => item.stretchKey)
    );
    renderVrfConfirmList();
  });

  elements.vrfConfirmSelectNoneButton.addEventListener("click", () => {
    appState.selectedRequiredVrfKeys.clear();
    renderVrfConfirmList();
  });

  elements.vrfConfirmProceedButton.addEventListener("click", () => {
    closeVrfConfirmModal({
      cancelled: false,
      vrfStretchKeys: Array.from(appState.selectedRequiredVrfKeys).filter(Boolean)
    });
  });

  elements.vrfConfirmSkipButton.addEventListener("click", () => {
    closeVrfConfirmModal({ cancelled: false, vrfStretchKeys: [] });
  });

  elements.vrfConfirmCancelButton.addEventListener("click", () => {
    closeVrfConfirmModal({ cancelled: true, vrfStretchKeys: [] });
  });

  elements.vxlanGoToVrfStretchButton.addEventListener("click", () => {
    closeVxlanPlanner();
    setView("vrfs");
    if (!appState.vrfReport) {
      void loadVrfReport();
    }
  });

  elements.vxlanClearSelectionButton.addEventListener("click", () => {
    appState.vxlanSelectedStretchKeys.clear();
    renderVxlanScopeControls();
    renderVxlanTables();
  });

  elements.vxlanStretchSelectedButton.addEventListener("click", () => {
    void stretchSelectedVxlans();
  });

  elements.vxlanPlannerBody.addEventListener("change", (event) => {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    if (!input) {
      return;
    }

    const stretchKey = input.dataset.stretchKey || "";
    if (!stretchKey) {
      return;
    }

    if (input.name === "vxlan-auto-vlan") {
      if (input.checked) {
        appState.vxlanAutoVlanKeys.add(stretchKey);
      } else {
        appState.vxlanAutoVlanKeys.delete(stretchKey);
        appState.vxlanSelectedStretchKeys.delete(stretchKey);
      }

      renderVxlanSummary();
      renderVxlanTables();
      return;
    }

    if (input.name !== "vxlan-select") {
      return;
    }

    if (input.checked) {
      appState.vxlanSelectedStretchKeys.add(stretchKey);
    } else {
      appState.vxlanSelectedStretchKeys.delete(stretchKey);
    }

    renderVxlanScopeControls();
    renderVxlanPlannerControls();
    renderConnectionState();
  });

  elements.vrfScopeList.addEventListener("change", (event) => {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    if (!input || input.name !== "vrf-scope") {
      return;
    }

    if (input.checked) {
      appState.vrfScopeBlueprintIds.add(input.value);
    } else {
      appState.vrfScopeBlueprintIds.delete(input.value);
    }

    if (appState.vrfScopeBlueprintIds.size === 0) {
      appState.vrfScopeBlueprintIds.add(input.value);
      input.checked = true;
      showError("Select at least one blueprint in scope.", "vrf");
      return;
    }

    clearError("vrf");
    syncVrfSourceAndTargetsAfterScopeChange();
    if (getScopedVrfBlueprintIds().length < 2) {
      closeVrfPlanner();
    }
    renderVrfScopeControls();
    renderVrfSummary();
    renderVrfTables();
  });

  elements.vrfSourceBlueprint.addEventListener("change", () => {
    appState.vrfSourceBlueprintId = elements.vrfSourceBlueprint.value;

    appState.vrfSelectedStretchKeys.clear();
    renderVrfScopeControls();
    renderVrfTables();
  });

  elements.vrfSelectStretchableButton.addEventListener("click", () => {
    selectAllStretchableVrfs();
  });

  elements.vrfClearSelectionButton.addEventListener("click", () => {
    appState.vrfSelectedStretchKeys.clear();
    renderVrfScopeControls();
    renderVrfTables();
  });

  elements.vrfStretchSelectedButton.addEventListener("click", () => {
    void stretchSelectedVrfs();
  });

  elements.vrfHideBlockedToggle.addEventListener("change", () => {
    appState.vrfHideBlocked = elements.vrfHideBlockedToggle.checked;
    renderVrfPlannerTable();
  });

  elements.vrfPlannerBody.addEventListener("click", (event) => {
    const button = event.target instanceof HTMLElement ? event.target.closest("[data-details-key]") : null;
    if (button) {
      openVrfRowDetails(button.dataset.detailsKey || "");
    }
  });

  elements.closeVrfRowDetailsButton.addEventListener("click", () => {
    closeVrfRowDetails();
  });

  elements.vrfRowDetailsModal.addEventListener("click", (event) => {
    if (event.target === elements.vrfRowDetailsModal) {
      closeVrfRowDetails();
    }
  });

  elements.vrfPlannerBody.addEventListener("change", (event) => {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    if (!input) {
      return;
    }

    const stretchKey = input.dataset.stretchKey || "";
    if (!stretchKey) {
      return;
    }

    if (input.name === "vrf-auto-vlan") {
      if (input.checked) {
        appState.vrfAutoVlanKeys.add(stretchKey);
      } else {
        appState.vrfAutoVlanKeys.delete(stretchKey);
        appState.vrfSelectedStretchKeys.delete(stretchKey);
      }

      renderVrfSummary();
      renderVrfTables();
      return;
    }

    if (input.name !== "vrf-select") {
      return;
    }

    if (input.checked) {
      appState.vrfSelectedStretchKeys.add(stretchKey);
    } else {
      appState.vrfSelectedStretchKeys.delete(stretchKey);
    }

    renderVrfScopeControls();
    renderVrfPlannerControls();
    renderConnectionState();
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

    if (event.key === "Escape" && !elements.vxlanPlannerModal.classList.contains("hidden")) {
      closeVxlanPlanner();
    }

    if (event.key === "Escape" && !elements.vrfPlannerModal.classList.contains("hidden")) {
      closeVrfPlanner();
    }
  });

  elements.closeVxlanPlannerButton.addEventListener("click", () => {
    closeVxlanPlanner();
  });

  elements.vxlanPlannerModal.addEventListener("click", (event) => {
    if (event.target === elements.vxlanPlannerModal) {
      closeVxlanPlanner();
    }
  });

  elements.closeVrfPlannerButton.addEventListener("click", () => {
    closeVrfPlanner();
  });

  elements.vrfPlannerModal.addEventListener("click", (event) => {
    if (event.target === elements.vrfPlannerModal) {
      closeVrfPlanner();
    }
  });
}

async function initialize() {
  setView("home");
  renderConnectionState();
  renderSummary();
  renderGatewaySummary();
  renderVxlanSummary();
  renderVrfSummary();
  renderTables();
  renderGatewayTables();
  renderVxlanTables();
  renderVrfTables();
  await refreshConnectionStatus();
}

function setView(view) {
  appState.view = view;

  const isHome = view === "home";
  const isFeatureRequest = view === "feature-request";
  const isConfiglets = view === "configlets";
  const isGateways = view === "gateways";
  const isVxlans = view === "vxlans";
  const isVrfs = view === "vrfs";

  elements.homeView.classList.toggle("hidden", !isHome);
  elements.featureRequestView.classList.toggle("hidden", !isFeatureRequest);
  elements.configletsView.classList.toggle("hidden", !isConfiglets);
  elements.gatewaysView.classList.toggle("hidden", !isGateways);
  elements.vxlansView.classList.toggle("hidden", !isVxlans);
  elements.vrfsView.classList.toggle("hidden", !isVrfs);

  elements.navHome.classList.toggle("active", isHome);
  elements.navConfiglets.classList.toggle("active", isConfiglets);
  elements.navGateways.classList.toggle("active", isGateways);
  elements.navVxlans.classList.toggle("active", isVxlans);
  elements.navVrfs.classList.toggle("active", isVrfs);

  if (!isConfiglets) {
    closeActiveDetails();
  }

  if (!isVxlans) {
    closeVxlanPlanner();
  }

  if (!isVrfs) {
    closeVrfPlanner();
  }

  if (isFeatureRequest) {
    elements.featureRequestType.focus();
  }
}

function openFeatureRequestIssue() {
  const type = elements.featureRequestType.value;
  const templatesByType = {
    Feature: "feature_request.yml",
    Issue: "bug_report.yml",
    Feedback: "feedback.yml",
    Question: "question.yml"
  };
  const issueUrl = new URL("https://github.com/iamjarvs/apstra_chrome_extension/issues/new");
  issueUrl.search = new URLSearchParams({ template: templatesByType[type] }).toString();

  chrome.tabs.create({ url: issueUrl.toString() });
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
  clearError("vxlan");
  clearError("vrf");
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

    showLoadNotice(response.report, "report");
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

    showLoadNotice(response.report, "gateway");
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

async function loadVxlanReport() {
  if (appState.loadingVxlanReport) {
    return;
  }

  if (!isAuthReady()) {
    showError("Capture token/auth headers first.", "home");
    setView("home");
    return;
  }

  appState.loadingVxlanReport = true;
  clearError("vxlan");
  elements.vxlansUpdatedAt.textContent = "Loading VXLAN report...";
  renderVxlanLoading();
  renderConnectionState();

  try {
    const response = await sendMessage("runVxlanStretchReport");
    appState.connection = response.connection;
    appState.vxlanReport = response.report;
    appState.vxlanSelectedStretchKeys.clear();
    appState.vxlanAutoVlanKeys.clear();

    syncVxlanSourceAndTargetsAfterScopeChange(true);
    renderVxlanSummary();
    renderVxlanScopeControls();
    renderVxlanTables();
    elements.vxlansUpdatedAt.textContent = formatUpdatedAt(response.report.generatedAt);

    showLoadNotice(response.report, "vxlan");
  } catch (error) {
    appState.vxlanReport = null;
    appState.vxlanScopeBlueprintIds.clear();
    appState.vxlanSourceBlueprintId = "auto";
    appState.vxlanSelectedStretchKeys.clear();
    closeVxlanPlanner();
    renderVxlanSummary();
    renderVxlanScopeControls();
    renderVxlanTables();
    elements.vxlansUpdatedAt.textContent = "VXLAN report failed";
    showError(error.message || "Unable to load VXLAN report", "vxlan");
  } finally {
    appState.loadingVxlanReport = false;
    renderConnectionState();
  }
}

async function loadVrfReport() {
  if (appState.loadingVrfReport) {
    return;
  }

  if (!isAuthReady()) {
    showError("Capture token/auth headers first.", "home");
    setView("home");
    return;
  }

  appState.loadingVrfReport = true;
  clearError("vrf");
  elements.vrfsUpdatedAt.textContent = "Loading VRF report...";
  renderVrfLoading();
  renderConnectionState();

  try {
    const response = await sendMessage("runVrfStretchReport");
    appState.connection = response.connection;
    appState.vrfReport = response.report;
    appState.vrfSelectedStretchKeys.clear();
    appState.vrfAutoVlanKeys.clear();

    syncVrfSourceAndTargetsAfterScopeChange(true);
    renderVrfSummary();
    renderVrfScopeControls();
    renderVrfTables();
    elements.vrfsUpdatedAt.textContent = formatUpdatedAt(response.report.generatedAt);

    showLoadNotice(response.report, "vrf");
  } catch (error) {
    appState.vrfReport = null;
    appState.vrfScopeBlueprintIds.clear();
    appState.vrfSourceBlueprintId = "auto";
    appState.vrfSelectedStretchKeys.clear();
    closeVrfPlanner();
    renderVrfSummary();
    renderVrfScopeControls();
    renderVrfTables();
    elements.vrfsUpdatedAt.textContent = "VRF report failed";
    showError(error.message || "Unable to load VRF report", "vrf");
  } finally {
    appState.loadingVrfReport = false;
    renderConnectionState();
  }
}

function syncVxlanSourceAndTargetsAfterScopeChange(forceInitialize = false) {
  const blueprints = Array.isArray(appState.vxlanReport?.blueprints) ? appState.vxlanReport.blueprints : [];
  if (blueprints.length === 0) {
    appState.vxlanScopeBlueprintIds.clear();
    appState.vxlanSourceBlueprintId = "auto";
    return;
  }

  const availableIds = new Set(blueprints.map((item) => item.blueprintId));

  if (forceInitialize || appState.vxlanScopeBlueprintIds.size === 0) {
    appState.vxlanScopeBlueprintIds = new Set(availableIds);
  } else {
    appState.vxlanScopeBlueprintIds = new Set(
      Array.from(appState.vxlanScopeBlueprintIds).filter((item) => availableIds.has(item))
    );

    if (appState.vxlanScopeBlueprintIds.size === 0) {
      appState.vxlanScopeBlueprintIds = new Set(availableIds);
    }
  }

  const scopedIds = Array.from(appState.vxlanScopeBlueprintIds);

  if (forceInitialize) {
    appState.vxlanSourceBlueprintId = "auto";
    return;
  }

  if (appState.vxlanSourceBlueprintId === "auto") {
    return;
  }

  if (!scopedIds.includes(appState.vxlanSourceBlueprintId)) {
    appState.vxlanSourceBlueprintId = "auto";
  }
}

function renderVxlanSummary() {
  const report = appState.vxlanReport;

  if (!report) {
    elements.vxlanSummaryBlueprints.textContent = "-";
    elements.vxlanSummaryTotal.textContent = "-";
    elements.vxlanSummaryUnique.textContent = "-";
    elements.vxlanSummaryFull.textContent = "-";
    elements.vxlanSummaryPartial.textContent = "-";
    elements.vxlanSummaryBlocked.textContent = "-";
    return;
  }

  const scopedRows = getScopedVxlanRows();
  const fullCount = scopedRows.filter((row) => row.presentBlueprints.length === getScopedBlueprintIds().length).length;
  const partialRows = scopedRows.filter((row) => row.presentBlueprints.length < getScopedBlueprintIds().length);
  const readyCount = partialRows.filter((row) => {
    const readiness = getVxlanTargetReadiness(row);
    return readiness.ready.length + readiness.needsVrf.length > 0;
  }).length;
  const blockedCount = partialRows.length - readyCount;

  elements.vxlanSummaryBlueprints.textContent = numberFormat(getScopedBlueprintIds().length);
  elements.vxlanSummaryTotal.textContent = numberFormat(report.totalVxlanCount);
  elements.vxlanSummaryUnique.textContent = numberFormat(scopedRows.length);
  elements.vxlanSummaryFull.textContent = numberFormat(fullCount);
  elements.vxlanSummaryPartial.textContent = numberFormat(readyCount);
  elements.vxlanSummaryBlocked.textContent = numberFormat(blockedCount);
}

function renderVxlanLoading() {
  elements.vxlanBlueprintCompatibilityBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="4">Loading blueprint compatibility...</td></tr>';
  elements.vxlanFullBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="3">Loading VXLAN coverage...</td></tr>';
  elements.vxlanPartialBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="4">Loading stretch candidates...</td></tr>';
  elements.vxlanPlannerBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="6">Loading planner candidates...</td></tr>';
}

function renderVxlanScopeControls() {
  const blueprints = Array.isArray(appState.vxlanReport?.blueprints) ? appState.vxlanReport.blueprints : [];

  if (blueprints.length === 0) {
    elements.vxlanScopeList.innerHTML = '<p class="cell-subtle">Run refresh to load blueprints.</p>';
    elements.vxlanSelectionStatus.textContent = "Select scope, then open planner.";
    elements.vxlanPlannerSelectionStatus.textContent = "No VXLAN selected.";
    return;
  }

  const scopedBlueprintIds = getScopedBlueprintIds();
  const sortedBlueprints = [...blueprints].sort((a, b) => a.blueprintName.localeCompare(b.blueprintName));

  elements.vxlanScopeList.innerHTML = sortedBlueprints.map((blueprint) => {
    const checked = appState.vxlanScopeBlueprintIds.has(blueprint.blueprintId) ? "checked" : "";
    return `
      <label class="vxlan-checkbox-item">
        <input type="checkbox" name="vxlan-scope" value="${escapeHtml(blueprint.blueprintId)}" ${checked}>
        <span class="meta">
          <strong>${escapeHtml(blueprint.blueprintName)}</strong>
          <span>${numberFormat(blueprint.vxlanCount)} VXLANs · ${numberFormat(blueprint.securityZoneCount || 0)} routing zones</span>
        </span>
      </label>
    `;
  }).join("");

  const scopeCount = scopedBlueprintIds.length;
  const selectedCount = appState.vxlanSelectedStretchKeys.size;
  elements.vxlanSelectionStatus.textContent =
    `Scope: ${numberFormat(scopeCount)} blueprint(s) | Planner selected: ${numberFormat(selectedCount)} VXLAN(s)`;
}

function renderVxlanPlannerControls() {
  const blueprints = Array.isArray(appState.vxlanReport?.blueprints) ? appState.vxlanReport.blueprints : [];
  if (blueprints.length === 0) {
    elements.vxlanSourceBlueprint.innerHTML = '<option value="">No source blueprint</option>';
    elements.vxlanPlannerSelectionStatus.textContent = "No VXLAN selected.";
    return;
  }

  const scopedBlueprintIds = getScopedBlueprintIds();

  const optionRows = [
    '<option value="auto">Auto-select source per VXLAN</option>',
    ...scopedBlueprintIds.map((blueprintId) => {
      const blueprintName = getVxlanBlueprintNameById(blueprintId);
      const selected = appState.vxlanSourceBlueprintId === blueprintId ? "selected" : "";
      return `<option value="${escapeHtml(blueprintId)}" ${selected}>Prefer ${escapeHtml(blueprintName)}</option>`;
    })
  ];

  if (
    appState.vxlanSourceBlueprintId !== "auto" &&
    !scopedBlueprintIds.includes(appState.vxlanSourceBlueprintId)
  ) {
    appState.vxlanSourceBlueprintId = "auto";
  }

  elements.vxlanSourceBlueprint.innerHTML = optionRows.join("");
  elements.vxlanSourceBlueprint.value = appState.vxlanSourceBlueprintId || "auto";

  const selectedCount = appState.vxlanSelectedStretchKeys.size;
  const candidateCount = getStretchableVxlanRows().length;
  elements.vxlanPlannerSelectionStatus.textContent =
    `${numberFormat(selectedCount)} selected | ${numberFormat(candidateCount)} stretchable candidate(s) in scope`;
}

function renderVxlanBlueprintCompatibilityTable() {
  if (!appState.vxlanReport) {
    elements.vxlanBlueprintCompatibilityBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="4">Run refresh, then select scope blueprints.</td></tr>';
    return;
  }

  const scopeIds = getScopedBlueprintIds();
  if (scopeIds.length === 0) {
    elements.vxlanBlueprintCompatibilityBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="4">Select at least one blueprint scope.</td></tr>';
    return;
  }

  const scopedRows = getScopedVxlanRows();

  const byBlueprint = new Map(
    scopeIds.map((blueprintId) => [
      blueprintId,
      {
        blueprintId,
        blueprintName: getVxlanBlueprintNameById(blueprintId),
        stretchTo: new Set(),
        receiveFrom: new Set(),
        sourceCandidateCount: 0,
        receiveCandidateCount: 0
      }
    ])
  );

  for (const row of scopedRows) {
    const presentIds = row.presentBlueprints.map((item) => item.blueprintId);
    const missingIds = row.missingBlueprintIds || [];

    if (missingIds.length === 0) {
      continue;
    }

    for (const sourceId of presentIds) {
      const source = byBlueprint.get(sourceId);
      if (!source) {
        continue;
      }

      source.sourceCandidateCount += 1;
      for (const targetId of missingIds) {
        source.stretchTo.add(targetId);
      }
    }

    for (const targetId of missingIds) {
      const target = byBlueprint.get(targetId);
      if (!target) {
        continue;
      }

      target.receiveCandidateCount += 1;
      for (const sourceId of presentIds) {
        target.receiveFrom.add(sourceId);
      }
    }
  }

  const rows = Array.from(byBlueprint.values()).sort((a, b) => a.blueprintName.localeCompare(b.blueprintName));
  elements.vxlanBlueprintCompatibilityBody.innerHTML = rows.map((row) => {
    const canStretchTo = Array.from(row.stretchTo).map((id) => getVxlanBlueprintNameById(id)).sort((a, b) => a.localeCompare(b));
    const canReceiveFrom = Array.from(row.receiveFrom).map((id) => getVxlanBlueprintNameById(id)).sort((a, b) => a.localeCompare(b));

    const notes = row.sourceCandidateCount === 0 && row.receiveCandidateCount === 0
      ? "Fully aligned in selected scope"
      : `${numberFormat(row.sourceCandidateCount)} source candidate(s), ${numberFormat(row.receiveCandidateCount)} receive candidate(s)`;

    return `
      <tr>
        <td>
          <div class="cell-title">${escapeHtml(row.blueprintName)}</div>
          <div class="cell-subtle gateway-mono">${escapeHtml(row.blueprintId)}</div>
        </td>
        <td>
          <div class="gateway-meta">
            ${canStretchTo.length > 0 ? canStretchTo.map((name) => `<span>${escapeHtml(name)}</span>`).join("") : '<span>None</span>'}
          </div>
        </td>
        <td>
          <div class="gateway-meta">
            ${canReceiveFrom.length > 0 ? canReceiveFrom.map((name) => `<span>${escapeHtml(name)}</span>`).join("") : '<span>None</span>'}
          </div>
        </td>
        <td>
          <div class="cell-subtle">${escapeHtml(notes)}</div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderVxlanTables() {
  renderVxlanScopeControls();
  renderVxlanPlannerControls();
  renderVxlanBlueprintCompatibilityTable();
  renderVxlanFullTable();
  renderVxlanPartialTable();
  renderVxlanPlannerTable();
  renderVxlanLastResults();
}

function getScopedBlueprintIds() {
  if (!appState.vxlanReport) {
    return [];
  }

  const reportBlueprintIds = (appState.vxlanReport.blueprints || []).map((item) => item.blueprintId);

  if (appState.vxlanScopeBlueprintIds.size === 0) {
    return reportBlueprintIds;
  }

  return reportBlueprintIds.filter((item) => appState.vxlanScopeBlueprintIds.has(item));
}

function getScopedVxlanRows() {
  const rows = Array.isArray(appState.vxlanReport?.rows) ? appState.vxlanReport.rows : [];
  const scopeIds = getScopedBlueprintIds();
  if (scopeIds.length === 0) {
    return [];
  }

  return rows
    .map((row) => {
      const presentBlueprints = (row.presentBlueprints || []).filter((item) => scopeIds.includes(item.blueprintId));
      const missingBlueprintIds = scopeIds.filter((item) => !presentBlueprints.some((entry) => entry.blueprintId === item));
      return {
        ...row,
        presentBlueprints,
        missingBlueprintIds
      };
    })
    .filter((row) => row.presentBlueprints.length > 0);
}

function renderVxlanFullTable() {
  if (!appState.vxlanReport) {
    elements.vxlanFullBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="3">Run refresh to compare VXLAN presence.</td></tr>';
    return;
  }

  const scopeIds = getScopedBlueprintIds();
  const rows = getScopedVxlanRows().filter((row) => row.presentBlueprints.length === scopeIds.length);

  if (rows.length === 0) {
    elements.vxlanFullBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="3">No VXLAN is present across all selected blueprints.</td></tr>';
    return;
  }

  elements.vxlanFullBody.innerHTML = rows.map((row) => `
    <tr>
      <td>
        <div class="cell-title">${escapeHtml(row.primaryLabel)}</div>
        <div class="cell-subtle">VNI: ${escapeHtml(row.vnId || "n/a")} | Key: ${escapeHtml(row.stretchKey)}</div>
      </td>
      <td>
        <div class="gateway-meta">
          <span>Security Zone: ${escapeHtml((row.securityZoneLabels || []).join(", ") || "n/a")}</span>
          <span>IPv4: ${escapeHtml((row.ipv4Subnets || []).join(", ") || "n/a")}</span>
          <span>IPv6: ${escapeHtml((row.ipv6Subnets || []).join(", ") || "n/a")}</span>
        </div>
      </td>
      <td>
        <div class="gateway-meta">
          ${row.presentBlueprints.map((item) => `<span>${escapeHtml(item.blueprintName)}</span>`).join("")}
        </div>
      </td>
    </tr>
  `).join("");
}

function renderVxlanPartialTable() {
  if (!appState.vxlanReport) {
    elements.vxlanPartialBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="4">Run refresh to find stretch candidates.</td></tr>';
    return;
  }

  const scopeIds = getScopedBlueprintIds();
  const rows = getScopedVxlanRows()
    .filter((row) => row.presentBlueprints.length < scopeIds.length)
    .sort((left, right) => {
      const leftReady = getVxlanTargetReadiness(left).ready.length > 0;
      const rightReady = getVxlanTargetReadiness(right).ready.length > 0;
      if (leftReady !== rightReady) {
        return leftReady ? -1 : 1;
      }

      return (left.primaryLabel || "").localeCompare(right.primaryLabel || "");
    });

  if (rows.length === 0) {
    elements.vxlanPartialBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="4">No partial VXLAN coverage in selected scope.</td></tr>';
    return;
  }

  elements.vxlanPartialBody.innerHTML = rows.map((row) => {
    const readiness = getVxlanTargetReadiness(row);
    const zoneName = row.securityZoneLabels?.[0] || "the source routing zone";
    const readinessPill = readiness.ready.length > 0
      ? `<span class="plan-pill is-ready">Ready \u00b7 ${numberFormat(readiness.ready.length)} target(s)</span>`
      : readiness.needsVrf.length > 0
        ? `<span class="plan-pill is-blocked">Needs VRF "${escapeHtml(zoneName)}"</span>`
        : readiness.conflicts.length > 0
          ? `<span class="plan-pill is-conflict">${escapeHtml(readiness.conflicts[0].summary)}</span>`
          : '<span class="plan-pill is-none">No targets in scope</span>';

    return `
      <tr>
        <td>
          <div class="cell-title">${escapeHtml(row.primaryLabel)}</div>
          <div class="cell-subtle">VNI: ${escapeHtml(row.vnId || "n/a")}</div>
        </td>
        <td>
          <div class="gateway-meta">
            ${row.presentBlueprints.map((item) => `<span>${escapeHtml(item.blueprintName)}</span>`).join("")}
          </div>
        </td>
        <td>
          ${row.missingBlueprintIds.map((item) => renderTargetPill({ readiness }, item)).join("")}
        </td>
        <td>
          ${readinessPill}
        </td>
      </tr>
    `;
  }).join("");
}

function renderVxlanPlannerTable() {
  if (!appState.vxlanReport) {
    elements.vxlanPlannerBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="6">Open planner after loading VXLAN report.</td></tr>';
    renderVxlanPrereqCallout([]);
    renderVxlanConflictTable([]);
    return;
  }

  const allRows = getScopedVxlanRows()
    .filter((row) => row.presentBlueprints.length < getScopedBlueprintIds().length)
    .map((row) => {
      const sourceBlueprint = resolvePlannerSourceForRow(row);
      const sourcePresent = Boolean(sourceBlueprint);
      const readiness = getVxlanTargetReadiness(row);
      // Needs-VRF stays selectable: the confirm step offers to stretch the routing zone.
      // Conflicts are unresolvable without renumbering, so they stay hard-blocked.
      const stretchable = sourcePresent && readiness.ready.length + readiness.needsVrf.length > 0;
      return {
        ...row,
        sourceBlueprint,
        sourcePresent,
        readiness,
        stretchable
      };
    });

  renderVxlanPrereqCallout(allRows);
  applyStablePlannerOrder(allRows);
  renderVxlanConflictTable(allRows);

  const selectedKeySet = new Set(appState.vxlanSelectedStretchKeys);
  for (const key of selectedKeySet) {
    const matchingRow = allRows.find((row) => row.stretchKey === key);
    if (!matchingRow || !matchingRow.stretchable) {
      appState.vxlanSelectedStretchKeys.delete(key);
    }
  }

  const rows = appState.vxlanHideBlocked ? allRows.filter((row) => row.stretchable) : allRows;

  if (rows.length === 0) {
    elements.vxlanPlannerBody.innerHTML = allRows.length === 0
      ? '<tr class="placeholder-row"><td colspan="6">No partial VXLAN coverage in selected scope.</td></tr>'
      : '<tr class="placeholder-row"><td colspan="6">Every candidate in scope is blocked by a VNI/VLAN conflict.</td></tr>';
    renderConnectionState();
    return;
  }

  elements.vxlanPlannerBody.innerHTML = rows.map((row) => {
    const checked = appState.vxlanSelectedStretchKeys.has(row.stretchKey) ? "checked" : "";
    const disabled = row.stretchable ? "" : "disabled";
    const zoneName = row.securityZoneLabels?.[0] || "the source routing zone";
    const { ready, needsVrf, conflicts } = row.readiness;

    let planPill;
    let planNote = "";

    if (!row.sourcePresent) {
      planPill = '<span class="plan-pill is-none">No source</span>';
      planNote = appState.vxlanSourceBlueprintId === "auto"
        ? "No source blueprint in scope contains this VXLAN."
        : "Preferred source blueprint does not contain this VXLAN.";
    } else if (!row.stretchable && conflicts.length > 0) {
      planPill = '<span class="plan-pill is-conflict">Conflict</span>';
      planNote = conflicts.map((item) => `${getVxlanBlueprintNameById(item.blueprintId)}: ${item.summary}`).join(" · ");
    } else if (!row.stretchable) {
      planPill = '<span class="plan-pill is-none">Nothing to do</span>';
      planNote = "No target blueprint is missing this VXLAN.";
    } else if (needsVrf.length > 0) {
      planPill = `<span class="plan-pill is-blocked">Needs VRF "${escapeHtml(zoneName)}"</span>`;
      planNote = `Select this row and the VRF "${zoneName}" will be offered for ${needsVrf.map((id) => getVxlanBlueprintNameById(id)).join(", ")}.`;
    } else {
      planPill = `<span class="plan-pill is-ready">Ready \u00b7 ${numberFormat(ready.length)} target(s)</span>`;
    }

    if (row.stretchable && conflicts.length > 0) {
      const conflictNote = conflicts.map((item) => `${getVxlanBlueprintNameById(item.blueprintId)}: ${item.summary}`).join(" · ");
      planNote = planNote ? `${planNote} Will skip ${conflictNote}.` : `Will skip ${conflictNote}.`;
    }

    const sourceLabel = row.sourceBlueprint ? row.sourceBlueprint.blueprintName : "n/a";
    const rowClass = row.stretchable ? "" : ' class="row-disabled"';
    const rowTitle = planNote ? ` title="${escapeHtml(planNote)}"` : "";

    return `
      <tr${rowClass}${rowTitle}>
        <td>
          <div class="vxlan-select-cell">
            <input type="checkbox" name="vxlan-select" data-stretch-key="${escapeHtml(row.stretchKey)}" ${checked} ${disabled}>
          </div>
        </td>
        <td>
          <div class="cell-title">${escapeHtml(row.primaryLabel)}</div>
          <div class="cell-subtle">VNI: ${escapeHtml(row.vnId || "n/a")} \u00b7 VRF: ${escapeHtml(zoneName)}</div>
        </td>
        <td>
          <div class="cell-title">${escapeHtml(sourceLabel)}</div>
        </td>
        <td>
          ${row.missingBlueprintIds.map((item) => renderTargetPill(row, item)).join("")}
        </td>
        <td>
          ${planPill}
          ${planNote ? `<div class="cell-subtle">${escapeHtml(planNote)}</div>` : ""}
          ${renderAutoVlanControl(row)}
        </td>
        <td>
          <button class="btn btn-secondary btn-small" type="button" data-details-key="${escapeHtml(row.stretchKey)}">Details</button>
        </td>
      </tr>
    `;
  }).join("");

  renderConnectionState();
}

// Per-blueprint breakdown of exactly what would happen to one VXLAN and why.
function openVxlanRowDetails(stretchKey) {
  const row = getScopedVxlanRows().find((item) => item.stretchKey === stretchKey);
  if (!row) {
    return;
  }

  const blueprints = Array.isArray(appState.vxlanReport?.blueprints) ? appState.vxlanReport.blueprints : [];
  const source = resolvePlannerSourceForRow(row);
  const readiness = getVxlanTargetReadiness(row);
  const zoneName = row.securityZoneLabels?.[0] || "n/a";
  const vlanId = source?.vlanId ?? null;

  const facts = [
    ["VNI", row.vnId || "not set"],
    ["VLAN", vlanId === null ? "not set" : String(vlanId)],
    ["Routing zone", zoneName],
    ["IPv4 subnet", row.ipv4Subnets?.[0] || "none"],
    ["Type", row.vnType || "vxlan"],
    ["Source blueprint", source ? source.blueprintName : "none in scope"]
  ];

  const rows = getScopedBlueprintIds().map((blueprintId) => {
    const blueprint = blueprints.find((item) => item.blueprintId === blueprintId);
    const name = getVxlanBlueprintNameById(blueprintId);
    const present = row.presentBlueprints.find((item) => item.blueprintId === blueprintId);
    const conflict = readiness.conflicts.find((item) => item.blueprintId === blueprintId);

    if (present) {
      const isSource = source && source.blueprintId === blueprintId;
      return {
        name,
        state: isSource ? "Source" : "Already present",
        className: "is-present",
        detail: `Exists here as "${present.label}" (VNI ${present.vnId || "n/a"}${present.vlanId ? `, VLAN ${present.vlanId}` : ""}).` +
          (isSource ? " This copy will be used as the template." : " Nothing to do.")
      };
    }

    if (conflict) {
      return {
        name,
        state: "Blocked - conflict",
        className: "is-conflict",
        detail: conflict.type === "vlan"
          ? `${conflict.summary}. VLANs must be unique per leaf. This one is fixable: tick "let Apstra pick a free VLAN" ` +
            "on the row and the VXLAN still stretches with the same VNI and subnet, only the local VLAN differs."
          : `${conflict.summary}. Apstra requires VNIs to be unique across virtual networks and routing zones, ` +
            "so this cannot be created without renumbering."
      };
    }

    if (readiness.needsVrf.includes(blueprintId)) {
      return {
        name,
        state: "Needs routing zone",
        className: "is-needs-vrf",
        detail: `No routing zone called "${zoneName}" here. Select this row and you will be offered the chance ` +
          "to stretch that routing zone first, then this VXLAN is created straight after."
      };
    }

    const switchCount = blueprint?.assignableSystemIds?.length || 0;
    return {
      name,
      state: "Will be created",
      className: "is-ready",
      detail: `Routing zone "${zoneName}" exists, VNI ${row.vnId || "n/a"} is free` +
        (vlanId === null ? "" : ` and VLAN ${vlanId} is free on every target leaf`) +
        `. Will bind to ${numberFormat(switchCount)} leaf target(s).`
    };
  });

  elements.vxlanRowDetailsTitle.textContent = row.primaryLabel;
  elements.vxlanRowDetailsBody.innerHTML = `
    <section class="detail-block">
      <h4>What would be copied</h4>
      <div class="detail-facts">
        ${facts.map(([label, value]) => `
          <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>
        `).join("")}
      </div>
    </section>
    <section class="detail-block">
      <h4>Per blueprint in scope</h4>
      <div class="detail-blueprints">
        ${rows.map((item) => `
          <div class="detail-blueprint ${item.className}">
            <div class="detail-blueprint-head">
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(item.state)}</span>
            </div>
            <p>${escapeHtml(item.detail)}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;

  elements.vxlanRowDetailsModal.classList.remove("hidden");
}

function closeVxlanRowDetails() {
  elements.vxlanRowDetailsModal.classList.add("hidden");
}

// A pinned VLAN is the only thing blocking these rows, and Apstra can allocate one instead.
function renderAutoVlanControl(row) {
  const { vlanResolvable, autoVlan } = row.readiness;

  if (!vlanResolvable && !autoVlan) {
    return "";
  }

  const label = autoVlan
    ? "Apstra will pick a free VLAN on each target leaf"
    : "Fix: let Apstra pick a free VLAN instead";

  return `
    <label class="auto-vlan-fix">
      <input type="checkbox" name="vxlan-auto-vlan" data-stretch-key="${escapeHtml(row.stretchKey)}" ${autoVlan ? "checked" : ""}>
      <span>${escapeHtml(label)}</span>
    </label>
  `;
}

// Overlapping SVI subnets do not fail the API call; Apstra raises a build error afterwards.
// They only matter WITHIN a routing zone: the same range in two different VRFs is legitimate,
// which is the point of a VRF. So these are warnings, scoped to the same VRF, and never block.
function getVxlanSubnetWarnings(row) {
  const blueprints = Array.isArray(appState.vxlanReport?.blueprints) ? appState.vxlanReport.blueprints : [];
  const readiness = getVxlanTargetReadiness(row);
  const zoneKey = row.securityZoneLabelKey || "";
  const zoneLabel = row.securityZoneLabels?.[0] || "the same routing zone";
  const sourceSubnets = [
    ...(row.ipv4Subnets || []).map((subnet) => ({ subnet, family: 4 })),
    ...(row.ipv6Subnets || []).map((subnet) => ({ subnet, family: 6 }))
  ];

  if (sourceSubnets.length === 0 || !zoneKey) {
    return [];
  }

  const warnings = [];

  for (const blueprintId of [...readiness.ready, ...readiness.needsVrf]) {
    const blueprint = blueprints.find((item) => item.blueprintId === blueprintId);
    const existing = [
      ...(blueprint?.conflictIndex?.ipv4Subnets || []).map((item) => ({ ...item, family: 4 })),
      ...(blueprint?.conflictIndex?.ipv6Subnets || []).map((item) => ({ ...item, family: 6 }))
    ];

    for (const source of sourceSubnets) {
      for (const target of existing) {
        if (source.family !== target.family || target.zoneKey !== zoneKey) {
          continue;
        }

        if (!subnetsOverlap(source.subnet, target.subnet)) {
          continue;
        }

        const blueprintName = getVxlanBlueprintNameById(blueprintId);
        warnings.push({
          blueprintId,
          blueprintName,
          zoneLabel,
          subnet: source.subnet,
          otherSubnet: target.subnet,
          otherLabel: target.label,
          summary: `Are you sure? ${source.subnet} overlaps "${target.label}" (${target.subnet}) ` +
            `inside the same VRF "${zoneLabel}" in ${blueprintName}.`
        });
      }
    }
  }

  return warnings;
}

function subnetsOverlap(left, right) {
  const a = parseCidr(left);
  const b = parseCidr(right);

  if (!a || !b || a.family !== b.family) {
    return false;
  }

  const prefix = Math.min(a.prefix, b.prefix);
  return maskBits(a.bits, prefix) === maskBits(b.bits, prefix);
}

// Returns the address as a bit string so IPv4 and IPv6 can share the comparison.
function parseCidr(value) {
  const text = String(value || "").trim();
  if (!text.includes("/")) {
    return null;
  }

  const [address, prefixText] = text.split("/");
  const prefix = Number(prefixText);
  if (!Number.isInteger(prefix) || prefix < 0) {
    return null;
  }

  if (address.includes(":")) {
    const groups = expandIpv6(address);
    if (!groups) {
      return null;
    }

    return { family: 6, prefix: Math.min(prefix, 128), bits: groups.map((g) => g.toString(2).padStart(16, "0")).join("") };
  }

  const octets = address.split(".").map(Number);
  if (octets.length !== 4 || octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return null;
  }

  return { family: 4, prefix: Math.min(prefix, 32), bits: octets.map((n) => n.toString(2).padStart(8, "0")).join("") };
}

function expandIpv6(address) {
  const [head, tail] = address.split("::");
  const headGroups = head ? head.split(":").filter(Boolean) : [];
  const tailGroups = tail ? tail.split(":").filter(Boolean) : [];

  if (address.includes("::")) {
    const fill = new Array(8 - headGroups.length - tailGroups.length).fill("0");
    if (fill.length < 0) {
      return null;
    }

    return [...headGroups, ...fill, ...tailGroups].map((g) => parseInt(g, 16) || 0);
  }

  const groups = address.split(":");
  return groups.length === 8 ? groups.map((g) => parseInt(g, 16) || 0) : null;
}

function maskBits(bits, prefix) {
  return bits.slice(0, prefix);
}

function renderTargetPill(row, blueprintId) {
  const name = getVxlanBlueprintNameById(blueprintId);
  const conflict = row.readiness.conflicts.find((item) => item.blueprintId === blueprintId);

  if (conflict) {
    return `<span class="target-pill is-conflict" title="${escapeHtml(conflict.summary)}">${escapeHtml(name)} \u00b7 conflict</span>`;
  }

  if (row.readiness.needsVrf.includes(blueprintId)) {
    return `<span class="target-pill is-blocked">${escapeHtml(name)} \u00b7 needs VRF</span>`;
  }

  return `<span class="target-pill is-ready">${escapeHtml(name)}</span>`;
}

// Summarises what still stands in the way: routing zones we can offer to create, and hard conflicts.
// Ready rows sort first, but the order is frozen for a given candidate set so that
// resolving a conflict in-place does not make the row jump away from the cursor.
function applyStablePlannerOrder(allRows, stateKey = "vxlanPlannerOrder") {
  const keys = allRows.map((row) => row.stretchKey);
  const cached = appState[stateKey];
  const sameSet = cached.length === keys.length && keys.every((key) => cached.includes(key));

  if (!sameSet) {
    appState[stateKey] = [...allRows]
      .sort((left, right) => {
        if (left.stretchable !== right.stretchable) {
          return left.stretchable ? -1 : 1;
        }

        return (left.primaryLabel || "").localeCompare(right.primaryLabel || "");
      })
      .map((row) => row.stretchKey);
  }

  const order = appState[stateKey];
  allRows.sort((left, right) => order.indexOf(left.stretchKey) - order.indexOf(right.stretchKey));
}

// Standalone record of every blocked target, so conflicts stay visible after they are resolved.
function renderVxlanConflictTable(allRows) {
  const entries = [];

  for (const row of allRows) {
    for (const conflict of row.readiness.conflicts) {
      entries.push({
        label: row.primaryLabel,
        vnId: row.vnId,
        zone: row.securityZoneLabels?.[0] || "n/a",
        blueprintName: getVxlanBlueprintNameById(conflict.blueprintId),
        type: conflict.type,
        summary: conflict.summary,
        resolvable: conflict.type === "vlan"
      });
    }

    // Keep resolved VLAN clashes listed so the user can see what was changed for them.
    if (row.readiness.autoVlan) {
      entries.push({
        label: row.primaryLabel,
        vnId: row.vnId,
        zone: row.securityZoneLabels?.[0] || "n/a",
        blueprintName: row.readiness.ready.map((id) => getVxlanBlueprintNameById(id)).join(", ") || "targets in scope",
        type: "vlan",
        summary: "VLAN clash resolved - Apstra will allocate a free VLAN per leaf",
        resolved: true
      });
    }
  }

  elements.vxlanConflictCount.textContent = numberFormat(entries.filter((item) => !item.resolved).length);

  if (entries.length === 0) {
    elements.vxlanConflictBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="5">No VNI or VLAN conflicts in the current scope.</td></tr>';
    return;
  }

  elements.vxlanConflictBody.innerHTML = entries.map((item) => {
    const pill = item.resolved
      ? '<span class="plan-pill is-ready">Resolved</span>'
      : item.resolvable
        ? '<span class="plan-pill is-blocked">VLAN - fixable</span>'
        : '<span class="plan-pill is-conflict">VNI - blocking</span>';

    return `
      <tr${item.resolved ? ' class="row-resolved"' : ""}>
        <td>
          <div class="cell-title">${escapeHtml(item.label)}</div>
          <div class="cell-subtle">VNI: ${escapeHtml(item.vnId || "n/a")} \u00b7 VRF: ${escapeHtml(item.zone)}</div>
        </td>
        <td><div class="cell-title">${escapeHtml(item.blueprintName)}</div></td>
        <td>${pill}</td>
        <td><div class="cell-subtle">${escapeHtml(item.summary)}</div></td>
        <td>
          <div class="cell-subtle">${escapeHtml(
            item.resolved
              ? "No action needed."
              : item.resolvable
                ? 'Tick "let Apstra pick a free VLAN" on the row above.'
                : "Renumber the VNI in the source or target blueprint."
          )}</div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderVxlanPrereqCallout(rows) {
  const neededByBlueprint = new Map();
  for (const row of rows) {
    if (!row.sourcePresent) {
      continue;
    }

    const zoneName = row.securityZoneLabels?.[0] || "unknown VRF";
    for (const blueprintId of row.readiness.needsVrf) {
      const blueprintName = getVxlanBlueprintNameById(blueprintId);
      if (!neededByBlueprint.has(blueprintName)) {
        neededByBlueprint.set(blueprintName, new Set());
      }
      neededByBlueprint.get(blueprintName).add(zoneName);
    }
  }

  const conflictRows = rows.filter((row) => row.sourcePresent && row.readiness.conflicts.length > 0);

  if (neededByBlueprint.size === 0 && conflictRows.length === 0) {
    elements.vxlanPrereqCallout.classList.add("hidden");
    elements.vxlanPrereqZones.innerHTML = "";
    return;
  }

  const parts = [];
  if (neededByBlueprint.size > 0) {
    parts.push("Some candidates need their routing zone first. Select them anyway - you will be asked which VRFs to stretch alongside.");
  }
  if (conflictRows.length > 0) {
    parts.push(`${numberFormat(conflictRows.length)} candidate(s) have a VNI/VLAN already in use in a target and cannot be stretched without renumbering.`);
  }

  elements.vxlanPrereqDetail.textContent = parts.join(" ");
  elements.vxlanPrereqZones.innerHTML = Array.from(neededByBlueprint.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([blueprintName, zones]) =>
      `<span>${escapeHtml(blueprintName)}: ${escapeHtml(Array.from(zones).sort((a, b) => a.localeCompare(b)).join(", "))}</span>`
    )
    .join("");

  elements.vxlanPrereqCallout.classList.remove("hidden");
}

function renderVxlanLastResults() {
  const result = appState.lastVxlanStretchResult;
  if (!result || !Array.isArray(result.results) || result.results.length === 0) {
    elements.vxlanLastResultsBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="5">No stretch operation has run yet.</td></tr>';
    return;
  }

  elements.vxlanLastResultsBody.innerHTML = result.results.map((row) => {
    const isCreated = row.status === "created";
    const isFailed = row.status === "failed";

    const className = isCreated
      ? "vxlan-status-created"
      : isFailed
        ? "vxlan-status-failed"
        : "vxlan-status-skipped";

    return `
      <tr>
        <td>
          <div class="cell-title">${escapeHtml(row.vxlanLabel || "Unknown VXLAN")}</div>
          <div class="cell-subtle">VNI: ${escapeHtml(row.vxlanVni || "n/a")}</div>
        </td>
        <td>
          <div class="cell-title">${escapeHtml(row.sourceBlueprintName || row.sourceBlueprintId || "n/a")}</div>
        </td>
        <td>
          <div class="cell-title">${escapeHtml(row.targetBlueprintName || row.targetBlueprintId || "(scope)")}</div>
        </td>
        <td>
          <span class="vxlan-status-pill ${className}">${escapeHtml(row.status)}</span>
        </td>
        <td>
          <div class="cell-subtle">${escapeHtml(row.message || "")}</div>
        </td>
      </tr>
    `;
  }).join("");
}

function getVxlanBlueprintNameById(blueprintId) {
  const blueprints = Array.isArray(appState.vxlanReport?.blueprints) ? appState.vxlanReport.blueprints : [];
  return blueprints.find((item) => item.blueprintId === blueprintId)?.blueprintName || blueprintId;
}

function getProgressElements(kind) {
  // During a combined run the VRF phase reports into the VXLAN planner's panel.
  const routed = appState.stretchProgressRoute?.[kind] || kind;

  return routed === "vrf"
    ? {
        panel: elements.vrfProgressPanel,
        summary: elements.vrfProgressSummary,
        issues: elements.vrfProgressIssues
      }
    : {
        panel: elements.vxlanProgressPanel,
        summary: elements.vxlanProgressSummary,
        issues: elements.vxlanProgressIssues
      };
}

function startStretchProgress(kind, plannedCount) {
  const target = getProgressElements(kind);
  appState.stretchProgress[kind] = { created: 0, skipped: 0, failed: 0, completed: 0, planned: plannedCount };

  target.issues.innerHTML = "";
  target.summary.textContent = `Stretching ${numberFormat(plannedCount)} selected ${kind === "vrf" ? "VRF" : "VXLAN"}(s)...`;
  target.panel.classList.remove("hidden");
}

function recordStretchProgress({ kind, result, completed, total }) {
  const routed = appState.stretchProgressRoute?.[kind] || kind;
  const counters = appState.stretchProgress[routed];
  if (!counters) {
    return;
  }

  const status = result?.status || "";
  if (status === "created") {
    counters.created += 1;
  } else if (status === "failed") {
    counters.failed += 1;
  } else {
    counters.skipped += 1;
  }

  counters.completed += 1;

  const target = getProgressElements(kind);
  const plannedTotal = counters.planned || total;
  const progressLabel = plannedTotal
    ? ` (${numberFormat(counters.completed)}/${numberFormat(Math.max(plannedTotal, counters.completed))})`
    : "";
  target.summary.textContent =
    `${numberFormat(counters.created)} created, ${numberFormat(counters.skipped)} skipped, ` +
    `${numberFormat(counters.failed)} failed${progressLabel}`;

  if (status === "created") {
    return;
  }

  const name = kind === "vrf"
    ? result?.vrfLabel || "Unknown VRF"
    : result?.vxlanLabel || "Unknown VXLAN";
  const targetName = result?.targetBlueprintName || result?.targetBlueprintId || "(scope)";

  const item = document.createElement("li");
  item.className = status === "failed" ? "is-failed" : "is-skipped";
  item.textContent = `${status === "failed" ? "FAILED" : "Skipped"} — ${name} → ${targetName}: ${result?.message || status}`;
  target.issues.appendChild(item);
  target.issues.scrollTop = target.issues.scrollHeight;
}

function failStretchProgress(kind, error) {
  const target = getProgressElements(kind);
  target.panel.classList.remove("hidden");
  target.summary.textContent = error?.message || "Stretch failed";

  const item = document.createElement("li");
  item.className = "is-failed";
  item.textContent = "Operation stopped before all selections were processed.";
  target.issues.appendChild(item);
}

function resolvePlannerSourceForRow(row) {
  const preferredId = appState.vxlanSourceBlueprintId;
  const present = Array.isArray(row?.presentBlueprints) ? row.presentBlueprints : [];

  if (preferredId && preferredId !== "auto") {
    return present.find((item) => item.blueprintId === preferredId) || null;
  }

  const sorted = [...present].sort((a, b) => a.blueprintName.localeCompare(b.blueprintName));
  return sorted[0] || null;
}

// A VXLAN can only be created in a target blueprint that already has the matching routing zone,
// and only if its VNI/VLAN are not already claimed there.
function getVxlanTargetReadiness(row) {
  const blueprints = Array.isArray(appState.vxlanReport?.blueprints) ? appState.vxlanReport.blueprints : [];
  const zoneKey = row?.securityZoneLabelKey || "";
  const source = resolvePlannerSourceForRow(row);
  const autoVlan = appState.vxlanAutoVlanKeys.has(row?.stretchKey);
  const ready = [];
  const needsVrf = [];
  const conflicts = [];

  for (const blueprintId of row?.missingBlueprintIds || []) {
    const blueprint = blueprints.find((item) => item.blueprintId === blueprintId);
    const conflict = findTargetConflict(blueprint, {
      vni: source?.vnId ?? row?.vnId,
      // Letting Apstra allocate the VLAN removes the VLAN clash entirely.
      vlanId: autoVlan ? null : source?.vlanId ?? null,
      isRoutingZone: false
    });

    if (conflict) {
      conflicts.push({ blueprintId, ...conflict });
      continue;
    }

    const zoneKeys = Array.isArray(blueprint?.securityZoneLabelKeys) ? blueprint.securityZoneLabelKeys : [];
    if (!zoneKey || zoneKeys.includes(zoneKey)) {
      ready.push(blueprintId);
    } else {
      needsVrf.push(blueprintId);
    }
  }

  return {
    ready,
    needsVrf,
    conflicts,
    autoVlan,
    // A VLAN clash is fixable by dropping the pinned VLAN; a VNI clash is not.
    vlanResolvable: conflicts.length > 0 && conflicts.every((item) => item.type === "vlan"),
    blocked: [...needsVrf, ...conflicts.map((item) => item.blueprintId)]
  };
}

// Mirrors findStretchConflict in the service worker so the table can warn before any POST.
function findTargetConflict(blueprint, { vni, vlanId, isRoutingZone }) {
  const index = blueprint?.conflictIndex;
  if (!index) {
    return null;
  }

  const vniKey = String(vni ?? "").trim();
  const owner = vniKey ? index.vniOwners?.[vniKey] : null;
  if (owner) {
    return {
      type: "vni",
      value: vniKey,
      ownerKind: owner.kind,
      ownerLabel: owner.label,
      summary: `VNI ${vniKey} used by ${owner.kind === "routing_zone" ? "routing zone" : "VN"} "${owner.label}"`
    };
  }

  const vlan = Number(vlanId);
  if (!Number.isInteger(vlan) || vlan < 1 || vlan > 4094) {
    return null;
  }

  if (isRoutingZone) {
    const owner = index.blueprintWideVlans?.[String(vlan)];
    if (!owner) {
      return null;
    }

    const kindLabel = owner.kind === "routing_zone" ? "routing zone" : "VN";
    return {
      type: "vlan",
      value: String(vlan),
      ownerKind: owner.kind,
      ownerLabel: owner.label,
      summary: `VLAN ${vlan} used by ${kindLabel} "${owner.label}"`
    };
  }

  for (const systemId of blueprint?.assignableSystemIds || []) {
    const vnOwner = index.vlansBySystem?.[systemId]?.[String(vlan)];
    if (vnOwner) {
      return {
        type: "vlan",
        value: String(vlan),
        ownerKind: "virtual_network",
        ownerLabel: vnOwner,
        summary: `VLAN ${vlan} used by VN "${vnOwner}"`
      };
    }
  }

  return null;
}

function getStretchableVxlanRows() {
  return getScopedVxlanRows()
    .filter((row) => row.presentBlueprints.length < getScopedBlueprintIds().length)
    .filter((row) => {
      const readiness = getVxlanTargetReadiness(row);
      return readiness.ready.length + readiness.needsVrf.length > 0;
    })
    .filter((row) => Boolean(resolvePlannerSourceForRow(row)));
}

function selectAllStretchableVxlans() {
  const rows = getStretchableVxlanRows();
  appState.vxlanSelectedStretchKeys = new Set(rows.map((row) => row.stretchKey));
  renderVxlanScopeControls();
  renderVxlanPlannerControls();
  renderVxlanPlannerTable();
}

async function stretchSelectedVxlans() {
  if (appState.stretchingVxlans) {
    return;
  }

  const scopeBlueprintIds = getScopedBlueprintIds();
  if (scopeBlueprintIds.length < 2) {
    showError("Select at least two blueprints in scope.", "vxlan");
    return;
  }

  const stretchKeys = Array.from(appState.vxlanSelectedStretchKeys);
  if (stretchKeys.length === 0) {
    showError("Select at least one stretchable VXLAN.", "vxlan");
    return;
  }

  clearError("vxlan");

  const choice = await promptForStretchReview(stretchKeys, scopeBlueprintIds);
  if (choice.cancelled) {
    return;
  }

  const vrfStretchKeys = choice.vrfStretchKeys;

  appState.stretchingVxlans = true;
  appState.stretchProgressRoute = { vrf: "vxlan" };
  startStretchProgress("vxlan", stretchKeys.length + vrfStretchKeys.length);
  renderConnectionState();

  const preferredSourceBlueprintId =
    appState.vxlanSourceBlueprintId && appState.vxlanSourceBlueprintId !== "auto"
      ? appState.vxlanSourceBlueprintId
      : "";

  try {
    let vrfResult = null;

    if (vrfStretchKeys.length > 0) {
      setStretchPhaseLabel("vxlan", `Phase 1 of 2: stretching ${numberFormat(vrfStretchKeys.length)} routing zone(s)...`);
      vrfResult = await sendMessage("stretchVrfs", {
        scopeBlueprintIds,
        preferredSourceBlueprintId: "",
        stretchKeys: vrfStretchKeys,
        autoVlanStretchKeys: vrfStretchKeys.filter((key) => appState.vrfAutoVlanKeys.has(key))
      });

      appState.lastVrfStretchResult = vrfResult;
      setStretchPhaseLabel("vxlan", `Phase 2 of 2: stretching ${numberFormat(stretchKeys.length)} VXLAN(s)...`);
    }

    const result = await sendMessage("stretchVxlans", {
      scopeBlueprintIds,
      preferredSourceBlueprintId,
      stretchKeys,
      autoVlanStretchKeys: stretchKeys.filter((key) => appState.vxlanAutoVlanKeys.has(key))
    });

    appState.lastVxlanStretchResult = result;
    appState.vxlanSelectedStretchKeys.clear();

    const vrfSummary = vrfResult
      ? `VRFs: ${numberFormat(vrfResult.createdCount)} created, ${numberFormat(vrfResult.skippedCount)} skipped, ${numberFormat(vrfResult.failedCount)} failed. `
      : "";
    const summary =
      `${vrfSummary}VXLANs: ${numberFormat(result.createdCount)} created, ` +
      `${numberFormat(result.skippedCount)} skipped, ${numberFormat(result.failedCount)} failed.`;

    await loadVxlanReport();
    if (appState.vxlanPlannerOpen) {
      renderVxlanPlannerTable();
    }
    renderVxlanLastResults();

    // Set after the reload so the reload's own status text does not hide the outcome.
    elements.vxlansUpdatedAt.textContent = summary;
    if (result.failedCount > 0 || (vrfResult?.failedCount || 0) > 0) {
      showError(`${summary} See the progress list for the reason of each failure.`, "vxlan");
    }
  } catch (error) {
    failStretchProgress("vxlan", error);
    showError(error.message || "Unable to stretch selected VXLANs", "vxlan");
  } finally {
    appState.stretchingVxlans = false;
    appState.stretchProgressRoute = {};
    renderConnectionState();
  }
}

function setStretchPhaseLabel(kind, text) {
  getProgressElements(kind).summary.textContent = text;
}

function selectionNeedsRoutingZones(stretchKeys) {
  const selected = new Set(stretchKeys);
  return getScopedVxlanRows().some(
    (row) => selected.has(row.stretchKey) && getVxlanTargetReadiness(row).needsVrf.length > 0
  );
}

// Full pre-flight review: which routing zones get created first, which VXLANs follow, and
// any non-blocking warnings such as overlapping SVI subnets.
async function promptForStretchReview(stretchKeys, scopeBlueprintIds) {
  // Resolver first: the modal's buttons are live as soon as it is shown, and a click during
  // the routing-zone fetch would otherwise resolve nothing and hang the workflow.
  const decision = new Promise((resolve) => {
    appState.vrfConfirmResolver = resolve;
  });

  elements.vrfConfirmIntro.textContent = "Building stretch plan...";
  elements.vrfConfirmList.innerHTML = "";
  elements.vrfConfirmStatus.textContent = "";
  elements.vrfConfirmModal.classList.remove("hidden");

  const needsZones = selectionNeedsRoutingZones(stretchKeys);

  if (needsZones) {
    try {
      const response = await sendMessage("runVrfStretchReport");
      appState.vrfReport = response.report;
      syncVrfSourceAndTargetsAfterScopeChange(true);
      renderVrfSummary();
      renderVrfTables();
    } catch (error) {
      appState.vrfConfirmResolver = null;
      elements.vrfConfirmModal.classList.add("hidden");
      showError(`Could not load routing zone data: ${error.message || "unknown error"}`, "vxlan");
      return { cancelled: true, vrfStretchKeys: [] };
    }
  }

  const required = needsZones ? buildRequiredVrfList(stretchKeys, scopeBlueprintIds) : [];
  appState.requiredVrfs = required;
  appState.selectedRequiredVrfKeys = new Set(
    required.filter(isRequiredVrfSelectable).map((item) => item.stretchKey)
  );

  elements.vrfConfirmZonesSection.classList.toggle("hidden", required.length === 0);
  elements.vrfConfirmIntro.textContent = required.length > 0
    ? `${numberFormat(stretchKeys.length)} VXLAN(s) selected. ${numberFormat(required.length)} routing zone(s) must be created first - review both steps below.`
    : `${numberFormat(stretchKeys.length)} VXLAN(s) selected. No routing zones are missing, so this runs in a single step.`;

  renderVrfConfirmList();
  renderStretchReviewVxlans(stretchKeys);
  renderStretchReviewWarnings(stretchKeys);

  return decision;
}

function renderStretchReviewVxlans(stretchKeys) {
  const selected = new Set(stretchKeys);
  const rows = getScopedVxlanRows().filter((row) => selected.has(row.stretchKey));

  elements.vrfConfirmVxlanCount.textContent = numberFormat(rows.length);
  elements.vrfConfirmVxlanBody.innerHTML = rows.length === 0
    ? '<tr class="placeholder-row"><td colspan="3">Nothing selected.</td></tr>'
    : rows.map((row) => {
      const readiness = getVxlanTargetReadiness(row);
      const source = resolvePlannerSourceForRow(row);
      const targets = [
        ...readiness.ready.map((id) => ({ id, viaVrf: false })),
        ...readiness.needsVrf.map((id) => ({ id, viaVrf: true }))
      ];

      return `
        <tr>
          <td>
            <div class="cell-title">${escapeHtml(row.primaryLabel)}</div>
            <div class="cell-subtle">VNI: ${escapeHtml(row.vnId || "n/a")} \u00b7 VRF: ${escapeHtml(row.securityZoneLabels?.[0] || "n/a")}</div>
          </td>
          <td><div class="cell-title">${escapeHtml(source?.blueprintName || "n/a")}</div></td>
          <td>
            ${targets.map((target) => `<span class="target-pill ${target.viaVrf ? "is-blocked" : "is-ready"}">${escapeHtml(getVxlanBlueprintNameById(target.id) + (target.viaVrf ? " \u00b7 after VRF" : ""))}</span>`).join("") ||
              '<span class="cell-subtle">No eligible target</span>'}
          </td>
        </tr>
      `;
    }).join("");
}

function renderStretchReviewWarnings(stretchKeys) {
  const selected = new Set(stretchKeys);
  const warnings = getScopedVxlanRows()
    .filter((row) => selected.has(row.stretchKey))
    .flatMap((row) => getVxlanSubnetWarnings(row).map((item) => ({ label: row.primaryLabel, ...item })));

  elements.vrfConfirmWarningCount.textContent = numberFormat(warnings.length);
  elements.vrfConfirmWarningsSection.classList.toggle("hidden", warnings.length === 0);
  elements.vrfConfirmWarnings.innerHTML = warnings
    .map((item) => `<li class="is-overlap">${escapeHtml(`${item.label}: ${item.summary}`)}</li>`)
    .join("");
}

function buildRequiredVrfList(stretchKeys, scopeBlueprintIds) {
  const selected = new Set(stretchKeys);
  const vrfRows = Array.isArray(appState.vrfReport?.rows) ? appState.vrfReport.rows : [];
  const vrfBlueprints = Array.isArray(appState.vrfReport?.blueprints) ? appState.vrfReport.blueprints : [];
  const byZoneKey = new Map();

  for (const row of getScopedVxlanRows()) {
    if (!selected.has(row.stretchKey)) {
      continue;
    }

    const readiness = getVxlanTargetReadiness(row);
    if (readiness.needsVrf.length === 0) {
      continue;
    }

    const zoneLabel = row.securityZoneLabels?.[0] || "";
    const zoneKey = row.securityZoneLabelKey || zoneLabel.toLowerCase();
    if (!zoneKey) {
      continue;
    }

    if (!byZoneKey.has(zoneKey)) {
      byZoneKey.set(zoneKey, { zoneLabel, neededBy: new Set(), vxlanLabels: new Set() });
    }

    const entry = byZoneKey.get(zoneKey);
    for (const blueprintId of readiness.needsVrf) {
      entry.neededBy.add(blueprintId);
    }
    entry.vxlanLabels.add(row.primaryLabel);
  }

  const required = [];

  for (const [zoneKey, entry] of byZoneKey.entries()) {
    const vrfRow = vrfRows.find(
      (item) => (item.primaryLabel || "").trim().toLowerCase() === zoneKey ||
        (item.vrfNames || []).some((name) => name.trim().toLowerCase() === zoneKey)
    );

    const stretchKey = vrfRow?.stretchKey || "";
    const targets = Array.from(entry.neededBy);
    const source = vrfRow?.presentBlueprints?.[0] || null;
    const autoVlan = appState.vrfAutoVlanKeys.has(stretchKey);

    // Same rules as the VRF tab: VNI clashes block, VLAN clashes are fixable.
    const conflicts = targets
      .map((blueprintId) => {
        const blueprint = vrfBlueprints.find((item) => item.blueprintId === blueprintId);
        const found = findTargetConflict(blueprint, {
          vni: source?.vniId,
          vlanId: autoVlan ? null : source?.vlanId ?? null,
          isRoutingZone: true
        });
        return found ? { blueprintId, ...found } : null;
      })
      .filter(Boolean);

    const vlanResolvable = conflicts.length > 0 && conflicts.every((item) => item.type === "vlan");

    required.push({
      zoneKey,
      zoneLabel: entry.zoneLabel || zoneKey,
      stretchKey,
      available: Boolean(vrfRow),
      autoVlan,
      conflicts,
      vlanResolvable,
      blocking: conflicts.length > 0 && !vlanResolvable,
      sourceName: source?.blueprintName || "",
      sourceVlan: source?.vlanId ?? null,
      sourceVni: source?.vniId || "",
      targetNames: targets.map((id) => getVxlanBlueprintNameById(id)),
      vxlanLabels: Array.from(entry.vxlanLabels)
    });
  }

  return required.sort((a, b) => a.zoneLabel.localeCompare(b.zoneLabel));
}

// An unresolved VLAN clash must not be selectable, otherwise it is sent only to be skipped.
function isRequiredVrfSelectable(item) {
  return Boolean(item.available) && !item.blocking && !(item.vlanResolvable && !item.autoVlan);
}

function renderVrfConfirmList() {
  const required = appState.requiredVrfs || [];

  elements.vrfConfirmList.innerHTML = required.map((item) => {
    const selectable = isRequiredVrfSelectable(item);
    const checked = appState.selectedRequiredVrfKeys.has(item.stretchKey) ? "checked" : "";

    let reason;
    if (!item.available) {
      reason = "Not found in any blueprint in scope - cannot be stretched automatically.";
    } else if (item.blocking) {
      reason = `${item.conflicts[0].summary} - cannot be created without renumbering.`;
    } else if (item.autoVlan) {
      reason = `Will be created in ${item.targetNames.join(", ")} with an Apstra-assigned VLAN.`;
    } else if (item.vlanResolvable) {
      reason = `${item.conflicts[0].summary} - tick the VLAN option below to continue.`;
    } else {
      reason = `Will be created in ${item.targetNames.join(", ")}` +
        (item.sourceVlan === null ? "." : ` keeping VLAN ${item.sourceVlan}.`);
    }

    const fix = item.available && (item.vlanResolvable || item.autoVlan)
      ? `
        <label class="auto-vlan-fix">
          <input type="checkbox" name="required-vrf-auto-vlan" data-stretch-key="${escapeHtml(item.stretchKey)}" ${item.autoVlan ? "checked" : ""}>
          <span>${escapeHtml(item.autoVlan ? "Apstra will assign the VLAN" : "Fix: let Apstra assign any free VLAN")}</span>
        </label>
      `
      : "";

    return `
      <div class="vrf-confirm-item ${item.blocking || (item.vlanResolvable && !item.autoVlan) ? "is-conflict" : ""}">
        <input type="checkbox" name="required-vrf" value="${escapeHtml(item.stretchKey)}" ${checked} ${selectable ? "" : "disabled"}>
        <span class="meta">
          <strong>${escapeHtml(item.zoneLabel)}${item.sourceVni ? ` (VNI ${escapeHtml(item.sourceVni)})` : ""}</strong>
          <span>${escapeHtml(reason)}</span>
          <span>Needed by: ${escapeHtml(item.vxlanLabels.join(", "))}</span>
          ${fix}
        </span>
      </div>
    `;
  }).join("");

  const selectableCount = required.filter(isRequiredVrfSelectable).length;
  elements.vrfConfirmStatus.textContent =
    `${numberFormat(appState.selectedRequiredVrfKeys.size)} of ${numberFormat(selectableCount)} selectable routing zone(s) chosen`;
}

function closeVrfConfirmModal(outcome) {
  elements.vrfConfirmModal.classList.add("hidden");
  const resolve = appState.vrfConfirmResolver;
  appState.vrfConfirmResolver = null;

  if (resolve) {
    resolve(outcome);
  }
}

function syncVrfSourceAndTargetsAfterScopeChange(forceInitialize = false) {
  const blueprints = Array.isArray(appState.vrfReport?.blueprints) ? appState.vrfReport.blueprints : [];
  if (blueprints.length === 0) {
    appState.vrfScopeBlueprintIds.clear();
    appState.vrfSourceBlueprintId = "auto";
    return;
  }

  const availableIds = new Set(blueprints.map((item) => item.blueprintId));

  if (forceInitialize || appState.vrfScopeBlueprintIds.size === 0) {
    appState.vrfScopeBlueprintIds = new Set(availableIds);
  } else {
    appState.vrfScopeBlueprintIds = new Set(
      Array.from(appState.vrfScopeBlueprintIds).filter((item) => availableIds.has(item))
    );

    if (appState.vrfScopeBlueprintIds.size === 0) {
      appState.vrfScopeBlueprintIds = new Set(availableIds);
    }
  }

  const scopedIds = Array.from(appState.vrfScopeBlueprintIds);

  if (forceInitialize) {
    appState.vrfSourceBlueprintId = "auto";
    return;
  }

  if (appState.vrfSourceBlueprintId === "auto") {
    return;
  }

  if (!scopedIds.includes(appState.vrfSourceBlueprintId)) {
    appState.vrfSourceBlueprintId = "auto";
  }
}

function renderVrfSummary() {
  const report = appState.vrfReport;

  if (!report) {
    elements.vrfSummaryBlueprints.textContent = "-";
    elements.vrfSummaryTotal.textContent = "-";
    elements.vrfSummaryUnique.textContent = "-";
    elements.vrfSummaryFull.textContent = "-";
    elements.vrfSummaryPartial.textContent = "-";
    elements.vrfSummaryBlocked.textContent = "-";
    return;
  }

  const scopedRows = getScopedVrfRows();
  const fullCount = scopedRows.filter((row) => row.presentBlueprints.length === getScopedVrfBlueprintIds().length).length;
  const partialRows = scopedRows.filter((row) => row.presentBlueprints.length < getScopedVrfBlueprintIds().length);
  const readyCount = partialRows.filter((row) => getVrfTargetReadiness(row).ready.length > 0).length;
  const blockedCount = partialRows.length - readyCount;

  elements.vrfSummaryBlueprints.textContent = numberFormat(getScopedVrfBlueprintIds().length);
  elements.vrfSummaryTotal.textContent = numberFormat(report.totalVrfCount);
  elements.vrfSummaryUnique.textContent = numberFormat(scopedRows.length);
  elements.vrfSummaryFull.textContent = numberFormat(fullCount);
  elements.vrfSummaryPartial.textContent = numberFormat(readyCount);
  elements.vrfSummaryBlocked.textContent = numberFormat(blockedCount);
}

function renderVrfLoading() {
  elements.vrfBlueprintCompatibilityBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="4">Loading blueprint compatibility...</td></tr>';
  elements.vrfFullBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="3">Loading VRF coverage...</td></tr>';
  elements.vrfPartialBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="4">Loading stretch candidates...</td></tr>';
  elements.vrfPlannerBody.innerHTML =
    '<tr class="placeholder-row"><td colspan="6">Loading planner candidates...</td></tr>';
}

function renderVrfScopeControls() {
  const blueprints = Array.isArray(appState.vrfReport?.blueprints) ? appState.vrfReport.blueprints : [];

  if (blueprints.length === 0) {
    elements.vrfScopeList.innerHTML = '<p class="cell-subtle">Run refresh to load blueprints.</p>';
    elements.vrfSelectionStatus.textContent = "Select scope, then open planner.";
    elements.vrfPlannerSelectionStatus.textContent = "No VRF selected.";
    return;
  }

  const scopedBlueprintIds = getScopedVrfBlueprintIds();
  const sortedBlueprints = [...blueprints].sort((a, b) => a.blueprintName.localeCompare(b.blueprintName));

  elements.vrfScopeList.innerHTML = sortedBlueprints.map((blueprint) => {
    const checked = appState.vrfScopeBlueprintIds.has(blueprint.blueprintId) ? "checked" : "";
    return `
      <label class="vxlan-checkbox-item">
        <input type="checkbox" name="vrf-scope" value="${escapeHtml(blueprint.blueprintId)}" ${checked}>
        <span class="meta">
          <strong>${escapeHtml(blueprint.blueprintName)}</strong>
          <span>${numberFormat(blueprint.vrfCount)} VRFs</span>
        </span>
      </label>
    `;
  }).join("");

  const scopeCount = scopedBlueprintIds.length;
  const selectedCount = appState.vrfSelectedStretchKeys.size;
  elements.vrfSelectionStatus.textContent =
    `Scope: ${numberFormat(scopeCount)} blueprint(s) | Planner selected: ${numberFormat(selectedCount)} VRF(s)`;
}

function renderVrfPlannerControls() {
  const blueprints = Array.isArray(appState.vrfReport?.blueprints) ? appState.vrfReport.blueprints : [];
  if (blueprints.length === 0) {
    elements.vrfSourceBlueprint.innerHTML = '<option value="">No source blueprint</option>';
    elements.vrfPlannerSelectionStatus.textContent = "No VRF selected.";
    return;
  }

  const scopedBlueprintIds = getScopedVrfBlueprintIds();

  const optionRows = [
    '<option value="auto">Auto-select source per VRF</option>',
    ...scopedBlueprintIds.map((blueprintId) => {
      const blueprintName = getVrfBlueprintNameById(blueprintId);
      const selected = appState.vrfSourceBlueprintId === blueprintId ? "selected" : "";
      return `<option value="${escapeHtml(blueprintId)}" ${selected}>Prefer ${escapeHtml(blueprintName)}</option>`;
    })
  ];

  if (
    appState.vrfSourceBlueprintId !== "auto" &&
    !scopedBlueprintIds.includes(appState.vrfSourceBlueprintId)
  ) {
    appState.vrfSourceBlueprintId = "auto";
  }

  elements.vrfSourceBlueprint.innerHTML = optionRows.join("");
  elements.vrfSourceBlueprint.value = appState.vrfSourceBlueprintId || "auto";

  const selectedCount = appState.vrfSelectedStretchKeys.size;
  const candidateCount = getStretchableVrfRows().length;
  elements.vrfPlannerSelectionStatus.textContent =
    `${numberFormat(selectedCount)} selected | ${numberFormat(candidateCount)} stretchable candidate(s) in scope`;
}

function renderVrfBlueprintCompatibilityTable() {
  if (!appState.vrfReport) {
    elements.vrfBlueprintCompatibilityBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="4">Run refresh, then select scope blueprints.</td></tr>';
    return;
  }

  const scopeIds = getScopedVrfBlueprintIds();
  if (scopeIds.length === 0) {
    elements.vrfBlueprintCompatibilityBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="4">Select at least one blueprint scope.</td></tr>';
    return;
  }

  const scopedRows = getScopedVrfRows();

  const byBlueprint = new Map(
    scopeIds.map((blueprintId) => [
      blueprintId,
      {
        blueprintId,
        blueprintName: getVrfBlueprintNameById(blueprintId),
        stretchTo: new Set(),
        receiveFrom: new Set(),
        sourceCandidateCount: 0,
        receiveCandidateCount: 0
      }
    ])
  );

  for (const row of scopedRows) {
    const presentIds = row.presentBlueprints.map((item) => item.blueprintId);
    const missingIds = row.missingBlueprintIds || [];

    if (missingIds.length === 0) {
      continue;
    }

    for (const sourceId of presentIds) {
      const source = byBlueprint.get(sourceId);
      if (!source) {
        continue;
      }

      source.sourceCandidateCount += 1;
      for (const targetId of missingIds) {
        source.stretchTo.add(targetId);
      }
    }

    for (const targetId of missingIds) {
      const target = byBlueprint.get(targetId);
      if (!target) {
        continue;
      }

      target.receiveCandidateCount += 1;
      for (const sourceId of presentIds) {
        target.receiveFrom.add(sourceId);
      }
    }
  }

  const rows = Array.from(byBlueprint.values()).sort((a, b) => a.blueprintName.localeCompare(b.blueprintName));
  elements.vrfBlueprintCompatibilityBody.innerHTML = rows.map((row) => {
    const canStretchTo = Array.from(row.stretchTo).map((id) => getVrfBlueprintNameById(id)).sort((a, b) => a.localeCompare(b));
    const canReceiveFrom = Array.from(row.receiveFrom).map((id) => getVrfBlueprintNameById(id)).sort((a, b) => a.localeCompare(b));

    const notes = row.sourceCandidateCount === 0 && row.receiveCandidateCount === 0
      ? "Fully aligned in selected scope"
      : `${numberFormat(row.sourceCandidateCount)} source candidate(s), ${numberFormat(row.receiveCandidateCount)} receive candidate(s)`;

    return `
      <tr>
        <td>
          <div class="cell-title">${escapeHtml(row.blueprintName)}</div>
          <div class="cell-subtle gateway-mono">${escapeHtml(row.blueprintId)}</div>
        </td>
        <td>
          <div class="gateway-meta">
            ${canStretchTo.length > 0 ? canStretchTo.map((name) => `<span>${escapeHtml(name)}</span>`).join("") : '<span>None</span>'}
          </div>
        </td>
        <td>
          <div class="gateway-meta">
            ${canReceiveFrom.length > 0 ? canReceiveFrom.map((name) => `<span>${escapeHtml(name)}</span>`).join("") : '<span>None</span>'}
          </div>
        </td>
        <td>
          <div class="cell-subtle">${escapeHtml(notes)}</div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderVrfTables() {
  renderVrfScopeControls();
  renderVrfPlannerControls();
  renderVrfBlueprintCompatibilityTable();
  renderVrfFullTable();
  renderVrfPartialTable();
  renderVrfPlannerTable();
  renderVrfLastResults();
}

function getScopedVrfBlueprintIds() {
  if (!appState.vrfReport) {
    return [];
  }

  const reportBlueprintIds = (appState.vrfReport.blueprints || []).map((item) => item.blueprintId);

  if (appState.vrfScopeBlueprintIds.size === 0) {
    return reportBlueprintIds;
  }

  return reportBlueprintIds.filter((item) => appState.vrfScopeBlueprintIds.has(item));
}

function getScopedVrfRows() {
  const rows = Array.isArray(appState.vrfReport?.rows) ? appState.vrfReport.rows : [];
  const scopeIds = getScopedVrfBlueprintIds();
  if (scopeIds.length === 0) {
    return [];
  }

  return rows
    .map((row) => {
      const presentBlueprints = (row.presentBlueprints || []).filter((item) => scopeIds.includes(item.blueprintId));
      const missingBlueprintIds = scopeIds.filter((item) => !presentBlueprints.some((entry) => entry.blueprintId === item));
      return {
        ...row,
        presentBlueprints,
        missingBlueprintIds
      };
    })
    .filter((row) => row.presentBlueprints.length > 0);
}

function renderVrfFullTable() {
  if (!appState.vrfReport) {
    elements.vrfFullBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="3">Run refresh to compare VRF presence.</td></tr>';
    return;
  }

  const scopeIds = getScopedVrfBlueprintIds();
  const rows = getScopedVrfRows().filter((row) => row.presentBlueprints.length === scopeIds.length);

  if (rows.length === 0) {
    elements.vrfFullBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="3">No VRF is present across all selected blueprints.</td></tr>';
    return;
  }

  elements.vrfFullBody.innerHTML = rows.map((row) => `
    <tr>
      <td>
        <div class="cell-title">${escapeHtml(row.primaryLabel)}</div>
        <div class="cell-subtle">Key: ${escapeHtml(row.stretchKey)}</div>
      </td>
      <td>
        <div class="gateway-meta">
          <span>VRF Names: ${escapeHtml((row.vrfNames || []).join(", ") || "n/a")}</span>
          <span>Types: ${escapeHtml((row.vrfTypes || []).join(", ") || "n/a")}</span>
        </div>
      </td>
      <td>
        <div class="gateway-meta">
          ${row.presentBlueprints.map((item) => `<span>${escapeHtml(item.blueprintName)}</span>`).join("")}
        </div>
      </td>
    </tr>
  `).join("");
}

function renderVrfPartialTable() {
  if (!appState.vrfReport) {
    elements.vrfPartialBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="4">Run refresh to find stretch candidates.</td></tr>';
    return;
  }

  const scopeIds = getScopedVrfBlueprintIds();
  const rows = getScopedVrfRows()
    .filter((row) => row.presentBlueprints.length < scopeIds.length);

  if (rows.length === 0) {
    elements.vrfPartialBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="4">No partial VRF coverage in selected scope.</td></tr>';
    return;
  }

  elements.vrfPartialBody.innerHTML = rows.map((row) => {
    const readiness = getVrfTargetReadiness(row);
    const readinessPill = readiness.ready.length > 0
      ? `<span class="plan-pill is-ready">Ready \u00b7 ${numberFormat(readiness.ready.length)} target(s)</span>`
      : readiness.conflicts.length > 0
        ? `<span class="plan-pill is-conflict">${escapeHtml(readiness.conflicts[0].summary)}</span>`
        : '<span class="plan-pill is-none">No targets in scope</span>';

    return `
      <tr>
        <td>
          <div class="cell-title">${escapeHtml(row.primaryLabel)}</div>
          <div class="cell-subtle">VRF Name: ${escapeHtml((row.vrfNames || [])[0] || "n/a")}</div>
        </td>
        <td>
          <div class="gateway-meta">
            ${row.presentBlueprints.map((item) => `<span>${escapeHtml(item.blueprintName)}</span>`).join("")}
          </div>
        </td>
        <td>
          ${row.missingBlueprintIds.map((item) => renderVrfTargetPill({ readiness }, item)).join("")}
        </td>
        <td>
          ${readinessPill}
        </td>
      </tr>
    `;
  }).join("");
}

function renderVrfPlannerTable() {
  if (!appState.vrfReport) {
    elements.vrfPlannerBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="6">Open planner after loading VRF report.</td></tr>';
    return;
  }

  const allRows = getScopedVrfRows()
    .filter((row) => row.presentBlueprints.length < getScopedVrfBlueprintIds().length)
    .map((row) => {
      const sourceBlueprint = resolvePlannerSourceForVrfRow(row);
      const sourcePresent = Boolean(sourceBlueprint);
      const readiness = getVrfTargetReadiness(row);
      const stretchable = sourcePresent && readiness.ready.length > 0;
      return {
        ...row,
        sourceBlueprint,
        sourcePresent,
        readiness,
        stretchable
      };
    });

  applyStablePlannerOrder(allRows, "vrfPlannerOrder");

  const selectedKeySet = new Set(appState.vrfSelectedStretchKeys);
  for (const key of selectedKeySet) {
    const matchingRow = allRows.find((row) => row.stretchKey === key);
    if (!matchingRow || !matchingRow.stretchable) {
      appState.vrfSelectedStretchKeys.delete(key);
    }
  }

  const rows = appState.vrfHideBlocked ? allRows.filter((row) => row.stretchable) : allRows;

  if (rows.length === 0) {
    elements.vrfPlannerBody.innerHTML = allRows.length === 0
      ? '<tr class="placeholder-row"><td colspan="6">No partial VRF coverage in selected scope.</td></tr>'
      : '<tr class="placeholder-row"><td colspan="6">Every candidate in scope is blocked by a VNI/VLAN conflict.</td></tr>';
    renderConnectionState();
    return;
  }

  elements.vrfPlannerBody.innerHTML = rows.map((row) => {
    const checked = appState.vrfSelectedStretchKeys.has(row.stretchKey) ? "checked" : "";
    const disabled = row.stretchable ? "" : "disabled";
    const { ready, conflicts } = row.readiness;

    let planPill;
    let planNote = "";

    if (!row.sourcePresent) {
      planPill = '<span class="plan-pill is-none">No source</span>';
      planNote = appState.vrfSourceBlueprintId === "auto"
        ? "No source blueprint in scope contains this VRF."
        : "Preferred source blueprint does not contain this VRF.";
    } else if (!row.stretchable && conflicts.length > 0) {
      planPill = '<span class="plan-pill is-conflict">Conflict</span>';
      planNote = conflicts.map((item) => `${getVrfBlueprintNameById(item.blueprintId)}: ${item.summary}`).join(" \u00b7 ");
    } else if (!row.stretchable) {
      planPill = '<span class="plan-pill is-none">Nothing to do</span>';
      planNote = "No target blueprint is missing this VRF.";
    } else {
      planPill = `<span class="plan-pill is-ready">Ready \u00b7 ${numberFormat(ready.length)} target(s)</span>`;
    }

    if (row.stretchable && conflicts.length > 0) {
      const conflictNote = conflicts.map((item) => `${getVrfBlueprintNameById(item.blueprintId)}: ${item.summary}`).join(" \u00b7 ");
      planNote = planNote ? `${planNote} Will skip ${conflictNote}.` : `Will skip ${conflictNote}.`;
    }

    const sourceLabel = row.sourceBlueprint ? row.sourceBlueprint.blueprintName : "n/a";
    const rowClass = row.stretchable ? "" : ' class="row-disabled"';
    const rowTitle = planNote ? ` title="${escapeHtml(planNote)}"` : "";

    return `
      <tr${rowClass}${rowTitle}>
        <td>
          <div class="vxlan-select-cell">
            <input type="checkbox" name="vrf-select" data-stretch-key="${escapeHtml(row.stretchKey)}" ${checked} ${disabled}>
          </div>
        </td>
        <td>
          <div class="cell-title">${escapeHtml(row.primaryLabel)}</div>
          <div class="cell-subtle">VRF Name: ${escapeHtml((row.vrfNames || [])[0] || "n/a")}</div>
        </td>
        <td>
          <div class="cell-title">${escapeHtml(sourceLabel)}</div>
        </td>
        <td>
          ${row.missingBlueprintIds.map((item) => renderVrfTargetPill(row, item)).join("")}
        </td>
        <td>
          ${planPill}
          ${planNote ? `<div class="cell-subtle">${escapeHtml(planNote)}</div>` : ""}
          ${renderVrfAutoVlanControl(row)}
        </td>
        <td>
          <button class="btn btn-secondary btn-small" type="button" data-details-key="${escapeHtml(row.stretchKey)}">Details</button>
        </td>
      </tr>
    `;
  }).join("");

  renderConnectionState();
}

function renderVrfTargetPill(row, blueprintId) {
  const name = getVrfBlueprintNameById(blueprintId);
  const conflict = row.readiness.conflicts.find((item) => item.blueprintId === blueprintId);

  if (conflict) {
    return `<span class="target-pill is-conflict" title="${escapeHtml(conflict.summary)}">${escapeHtml(name)} \u00b7 conflict</span>`;
  }

  return `<span class="target-pill is-ready">${escapeHtml(name)}</span>`;
}

// A VRF (routing zone) can only be created in a target blueprint if its VNI/VLAN are not already claimed there.
function getVrfTargetReadiness(row) {
  const blueprints = Array.isArray(appState.vrfReport?.blueprints) ? appState.vrfReport.blueprints : [];
  const source = resolvePlannerSourceForVrfRow(row);
  const autoVlan = appState.vrfAutoVlanKeys.has(row?.stretchKey);
  const ready = [];
  const conflicts = [];

  for (const blueprintId of row?.missingBlueprintIds || []) {
    const blueprint = blueprints.find((item) => item.blueprintId === blueprintId);
    const conflict = findTargetConflict(blueprint, {
      vni: source?.vniId ?? null,
      // Letting Apstra allocate the VLAN removes the VLAN clash entirely.
      vlanId: autoVlan ? null : source?.vlanId ?? null,
      isRoutingZone: true
    });

    if (conflict) {
      conflicts.push({ blueprintId, ...conflict });
      continue;
    }

    ready.push(blueprintId);
  }

  return {
    ready,
    conflicts,
    autoVlan,
    // A VLAN clash is fixable by letting Apstra allocate; a VNI clash is not.
    vlanResolvable: conflicts.length > 0 && conflicts.every((item) => item.type === "vlan"),
    blocked: conflicts.map((item) => item.blueprintId)
  };
}

function renderVrfAutoVlanControl(row) {
  const { vlanResolvable, autoVlan } = row.readiness;

  if (!vlanResolvable && !autoVlan) {
    return "";
  }

  const label = autoVlan
    ? "Apstra will assign the VLAN for this routing zone"
    : "Fix: let Apstra assign any free VLAN instead";

  return `
    <label class="auto-vlan-fix">
      <input type="checkbox" name="vrf-auto-vlan" data-stretch-key="${escapeHtml(row.stretchKey)}" ${autoVlan ? "checked" : ""}>
      <span>${escapeHtml(label)}</span>
    </label>
  `;
}

// Per-blueprint breakdown of exactly what would happen to one VRF and why.
function openVrfRowDetails(stretchKey) {
  const row = getScopedVrfRows().find((item) => item.stretchKey === stretchKey);
  if (!row) {
    return;
  }

  const blueprints = Array.isArray(appState.vrfReport?.blueprints) ? appState.vrfReport.blueprints : [];
  const source = resolvePlannerSourceForVrfRow(row);
  const readiness = getVrfTargetReadiness(row);

  const facts = [
    ["VRF name", (row.vrfNames || [])[0] || "not set"],
    ["Type", (row.vrfTypes || [])[0] || "n/a"],
    ["VNI", source?.vniId ?? "not set"],
    ["VLAN", source?.vlanId ?? "not set"],
    ["Source blueprint", source ? source.blueprintName : "none in scope"]
  ];

  const rows = getScopedVrfBlueprintIds().map((blueprintId) => {
    const name = getVrfBlueprintNameById(blueprintId);
    const present = row.presentBlueprints.find((item) => item.blueprintId === blueprintId);
    const conflict = readiness.conflicts.find((item) => item.blueprintId === blueprintId);

    if (present) {
      const isSource = source && source.blueprintId === blueprintId;
      return {
        name,
        state: isSource ? "Source" : "Already present",
        className: "is-present",
        detail: `Exists here as "${present.label}" (VNI ${present.vniId ?? "n/a"}${present.vlanId ? `, VLAN ${present.vlanId}` : ""}).` +
          (isSource ? " This copy will be used as the template." : " Nothing to do.")
      };
    }

    if (conflict) {
      return {
        name,
        state: "Blocked - conflict",
        className: "is-conflict",
        detail: `${conflict.summary}. Apstra requires VNIs to be unique across virtual networks and routing zones, ` +
          "and routing-zone VLANs to be unique blueprint-wide, so this cannot be created without renumbering."
      };
    }

    return {
      name,
      state: "Will be created",
      className: "is-ready",
      detail: `VNI ${source?.vniId ?? "n/a"} is free` +
        (source?.vlanId ? ` and VLAN ${source.vlanId} is free` : "") +
        " in this blueprint."
    };
  });

  elements.vrfRowDetailsTitle.textContent = row.primaryLabel;
  elements.vrfRowDetailsBody.innerHTML = `
    <section class="detail-block">
      <h4>What would be copied</h4>
      <div class="detail-facts">
        ${facts.map(([label, value]) => `
          <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>
        `).join("")}
      </div>
    </section>
    <section class="detail-block">
      <h4>Per blueprint in scope</h4>
      <div class="detail-blueprints">
        ${rows.map((item) => `
          <div class="detail-blueprint ${item.className}">
            <div class="detail-blueprint-head">
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(item.state)}</span>
            </div>
            <p>${escapeHtml(item.detail)}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;

  elements.vrfRowDetailsModal.classList.remove("hidden");
}

function closeVrfRowDetails() {
  elements.vrfRowDetailsModal.classList.add("hidden");
}

function renderVrfLastResults() {
  const result = appState.lastVrfStretchResult;
  if (!result || !Array.isArray(result.results) || result.results.length === 0) {
    elements.vrfLastResultsBody.innerHTML =
      '<tr class="placeholder-row"><td colspan="5">No stretch operation has run yet.</td></tr>';
    return;
  }

  elements.vrfLastResultsBody.innerHTML = result.results.map((row) => {
    const isCreated = row.status === "created";
    const isFailed = row.status === "failed";

    const className = isCreated
      ? "vxlan-status-created"
      : isFailed
        ? "vxlan-status-failed"
        : "vxlan-status-skipped";

    return `
      <tr>
        <td>
          <div class="cell-title">${escapeHtml(row.vrfLabel || "Unknown VRF")}</div>
          <div class="cell-subtle">Key: ${escapeHtml(row.stretchKey || "n/a")}</div>
        </td>
        <td>
          <div class="cell-title">${escapeHtml(row.sourceBlueprintName || row.sourceBlueprintId || "n/a")}</div>
        </td>
        <td>
          <div class="cell-title">${escapeHtml(row.targetBlueprintName || row.targetBlueprintId || "(scope)")}</div>
        </td>
        <td>
          <span class="vxlan-status-pill ${className}">${escapeHtml(row.status)}</span>
        </td>
        <td>
          <div class="cell-subtle">${escapeHtml(row.message || "")}</div>
        </td>
      </tr>
    `;
  }).join("");
}

function getVrfBlueprintNameById(blueprintId) {
  const blueprints = Array.isArray(appState.vrfReport?.blueprints) ? appState.vrfReport.blueprints : [];
  return blueprints.find((item) => item.blueprintId === blueprintId)?.blueprintName || blueprintId;
}

function resolvePlannerSourceForVrfRow(row) {
  const preferredId = appState.vrfSourceBlueprintId;
  const present = Array.isArray(row?.presentBlueprints) ? row.presentBlueprints : [];

  if (preferredId && preferredId !== "auto") {
    return present.find((item) => item.blueprintId === preferredId) || null;
  }

  const sorted = [...present].sort((a, b) => a.blueprintName.localeCompare(b.blueprintName));
  return sorted[0] || null;
}

function getStretchableVrfRows() {
  return getScopedVrfRows()
    .filter((row) => row.presentBlueprints.length < getScopedVrfBlueprintIds().length)
    .filter((row) => getVrfTargetReadiness(row).ready.length > 0)
    .filter((row) => Boolean(resolvePlannerSourceForVrfRow(row)));
}

function selectAllStretchableVrfs() {
  const rows = getStretchableVrfRows();
  appState.vrfSelectedStretchKeys = new Set(rows.map((row) => row.stretchKey));
  renderVrfScopeControls();
  renderVrfPlannerControls();
  renderVrfPlannerTable();
}

async function stretchSelectedVrfs() {
  if (appState.stretchingVrfs) {
    return;
  }

  const scopeBlueprintIds = getScopedVrfBlueprintIds();
  if (scopeBlueprintIds.length < 2) {
    showError("Select at least two blueprints in scope.", "vrf");
    return;
  }

  const stretchKeys = Array.from(appState.vrfSelectedStretchKeys);
  if (stretchKeys.length === 0) {
    showError("Select at least one stretchable VRF.", "vrf");
    return;
  }

  appState.stretchingVrfs = true;
  clearError("vrf");
  startStretchProgress("vrf", stretchKeys.length);
  renderConnectionState();

  try {
    const result = await sendMessage("stretchVrfs", {
      scopeBlueprintIds,
      preferredSourceBlueprintId:
        appState.vrfSourceBlueprintId && appState.vrfSourceBlueprintId !== "auto"
          ? appState.vrfSourceBlueprintId
          : "",
      stretchKeys,
      autoVlanStretchKeys: stretchKeys.filter((key) => appState.vrfAutoVlanKeys.has(key))
    });

    appState.lastVrfStretchResult = result;
    appState.vrfSelectedStretchKeys.clear();

    const summary =
      `VRF stretch complete: ${numberFormat(result.createdCount)} created, ` +
      `${numberFormat(result.skippedCount)} skipped, ${numberFormat(result.failedCount)} failed.`;

    await loadVrfReport();
    if (appState.vrfPlannerOpen) {
      renderVrfPlannerTable();
    }
    renderVrfLastResults();

    // Set after the reload so the reload's own status text does not hide the outcome.
    elements.vrfsUpdatedAt.textContent = summary;
    if (result.failedCount > 0) {
      showError(`${summary} See "Last stretch results" for the reason of each failure.`, "vrf");
    }
  } catch (error) {
    failStretchProgress("vrf", error);
    showError(error.message || "Unable to stretch selected VRFs", "vrf");
  } finally {
    appState.stretchingVrfs = false;
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
  elements.openVxlansBtn.disabled = !authReady;
  elements.openVrfsBtn.disabled = !authReady;
  elements.navConfiglets.disabled = !authReady;
  elements.navGateways.disabled = !authReady;
  elements.navVxlans.disabled = !authReady;
  elements.navVrfs.disabled = !authReady;

  elements.refreshButton.disabled = appState.loadingStatus;
  elements.trafficButton.disabled = !connection || connection.state === "NOT_ON_DCD_TAB";
  elements.loadButton.disabled = !authReady || appState.loadingReport;
  elements.loadGatewaysButton.disabled = !authReady || appState.loadingGatewayReport;
  elements.loadVxlansButton.disabled = !authReady || appState.loadingVxlanReport;
  elements.loadVrfsButton.disabled = !authReady || appState.loadingVrfReport;
  elements.openVxlanPlannerButton.disabled =
    !authReady ||
    !appState.vxlanReport ||
    appState.loadingVxlanReport ||
    getScopedBlueprintIds().length < 2;
  elements.openVrfPlannerButton.disabled =
    !authReady ||
    !appState.vrfReport ||
    appState.loadingVrfReport ||
    getScopedVrfBlueprintIds().length < 2;
  elements.vxlanSelectStretchableButton.disabled = !authReady || !appState.vxlanReport;
  elements.vxlanClearSelectionButton.disabled = !authReady || appState.vxlanSelectedStretchKeys.size === 0;
  elements.vxlanStretchSelectedButton.disabled =
    !authReady ||
    appState.stretchingVxlans ||
    appState.vxlanSelectedStretchKeys.size === 0 ||
    getScopedBlueprintIds().length < 2;
  elements.vrfSelectStretchableButton.disabled = !authReady || !appState.vrfReport;
  elements.vrfClearSelectionButton.disabled = !authReady || appState.vrfSelectedStretchKeys.size === 0;
  elements.vrfStretchSelectedButton.disabled =
    !authReady ||
    appState.stretchingVrfs ||
    appState.vrfSelectedStretchKeys.size === 0 ||
    getScopedVrfBlueprintIds().length < 2;

  elements.homeHint.textContent = authReady
    ? "Ready. Select Configlet Audit, Gateway Links, VXLAN Stretch, or VRF Stretch to run reports."
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
        leftName: nodeMap.get(leftId)?.name || leftId,
        rightName: nodeMap.get(rightId)?.name || rightId,
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

function openVxlanPlanner() {
  if (!appState.vxlanReport) {
    showError("Load the VXLAN report first.", "vxlan");
    return;
  }

  const scopedBlueprintIds = getScopedBlueprintIds();
  if (scopedBlueprintIds.length < 2) {
    showError("Select at least two blueprints in scope before opening planner.", "vxlan");
    return;
  }

  appState.vxlanPlannerOpen = true;
  elements.vxlanPlannerModal.classList.remove("hidden");
  elements.vxlanHideBlockedToggle.checked = appState.vxlanHideBlocked;
  elements.vxlanProgressPanel.classList.add("hidden");
  renderVxlanPlannerControls();
  renderVxlanPlannerTable();
  renderConnectionState();
}

function closeVxlanPlanner() {
  appState.vxlanPlannerOpen = false;
  elements.vxlanPlannerModal.classList.add("hidden");
  renderConnectionState();
}

function openVrfPlanner() {
  if (!appState.vrfReport) {
    showError("Load the VRF report first.", "vrf");
    return;
  }

  const scopedBlueprintIds = getScopedVrfBlueprintIds();
  if (scopedBlueprintIds.length < 2) {
    showError("Select at least two blueprints in scope before opening planner.", "vrf");
    return;
  }

  appState.vrfPlannerOpen = true;
  elements.vrfPlannerModal.classList.remove("hidden");
  elements.vrfHideBlockedToggle.checked = appState.vrfHideBlocked;
  renderVrfPlannerControls();
  renderVrfPlannerTable();
  renderConnectionState();
}

function closeVrfPlanner() {
  appState.vrfPlannerOpen = false;
  elements.vrfPlannerModal.classList.add("hidden");
  renderConnectionState();
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

// Freeform blueprints are reported as informational skips, not as load failures.
function buildLoadNotice(report) {
  const failures = Array.isArray(report?.partialFailures) ? report.partialFailures : [];
  const skipped = Array.isArray(report?.skippedBlueprints) ? report.skippedBlueprints : [];
  const parts = [];

  if (failures.length > 0) {
    parts.push(`Loaded with ${failures.length} partial failure(s): ${failures.map((item) => item.blueprintName).join(", ")}.`);
  }

  if (skipped.length > 0) {
    parts.push(`Not a datacenter blueprint, skipped: ${skipped.map((item) => item.blueprintName).join(", ")}.`);
  }

  return parts.join(" ");
}

function showLoadNotice(report, scope) {
  const notice = buildLoadNotice(report);
  if (!notice) {
    return;
  }

  const hasFailures = (report?.partialFailures || []).length > 0;
  showError(notice, scope, hasFailures ? "error" : "notice");
}

function showError(message, scope, tone = "error") {
  const target =
    scope === "home"
      ? elements.homeErrorBanner
      : scope === "gateway"
        ? elements.gatewaysErrorBanner
        : scope === "vxlan"
          ? elements.vxlansErrorBanner
          : scope === "vrf"
            ? elements.vrfsErrorBanner
        : elements.errorBanner;
  target.textContent = message;
  target.classList.toggle("is-notice", tone === "notice");
  target.classList.remove("hidden");
}

function clearError(scope) {
  const banners = {
    home: elements.homeErrorBanner,
    report: elements.errorBanner,
    gateway: elements.gatewaysErrorBanner,
    vxlan: elements.vxlansErrorBanner,
    vrf: elements.vrfsErrorBanner
  };

  for (const [bannerScope, banner] of Object.entries(banners)) {
    if (scope && scope !== bannerScope) {
      continue;
    }

    banner.textContent = "";
    banner.classList.add("hidden");
    banner.classList.remove("is-notice");
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
          reject(new Error("This feature requires a full extension reload so the background service worker picks up the new handler."));
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
