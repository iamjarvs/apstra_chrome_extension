# Developer and LLM Contributor Guide

## Purpose

This guide explains how the extension is structured, how data flows through it, the UI standards to keep, and the safest way to add new features.

Audience:

- Human developers adding features or fixing bugs.
- LLM agents making code updates autonomously.

## High-Level Architecture

The project is a Manifest V3 Chrome extension with a popup UI and a background service worker.

```mermaid
flowchart LR
  U[User in popup] --> P[popup/popup.js]
  P -->|chrome.runtime.sendMessage| B[src/background.js]
  B -->|active tab + MAIN world script| T[Apstra UI tab session]
  T -->|/api responses| B
  B -->|normalized data| P
  P --> V[popup/popup.html + popup/popup.css]
```

Why this model exists:

- Apstra auth is tied to the browser tab session.
- The background worker executes API calls in the active tab MAIN world when possible.
- The popup only renders UI and user interactions.

## Repository Structure

- manifest.json: MV3 metadata, permissions, popup entry, background worker entry.
- src/background.js: service worker, token/header capture, tab probing, API orchestration, report generation, refresh-from-global action, gateway correlation, VXLAN stretch action, VRF stretch action.
- popup/popup.html: popup layout and semantic structure.
- popup/popup.css: design tokens, layout system, table/modal styling, state badges, gateway/vxlan/vrf tool styling.
- popup/popup.js: UI state management, rendering, filtering/sorting, CSV export, details modal interactions, refresh actions, gateway and VXLAN/VRF feature interactions.
- docs/user-guide/: end-user guide screenshots and video.
- README.md: install steps and end-user workflow explainer.

## Runtime and Message Contract

The popup talks to background through message types:

- getConnectionStatus
- refreshActiveTabTraffic
- runConfigletsReport
- runGatewayConnectionsReport
- runVxlanStretchReport
- stretchVxlans
- runVrfStretchReport
- stretchVrfs
- refreshConfigletFromGlobal

Response envelope is always:

- Success: { ok: true, data: ... }
- Error: { ok: false, error: { message, code } }

Background has an explicit timeout guard to avoid hung popup calls.

## How the Core Flow Works

### 1) Connection and auth readiness

Background determines readiness by:

- Active tab exists and is HTTP(S).
- Active tab appears to be Apstra (probe /api/blueprints?limit=1).
- Token or auth headers have been captured from outbound /api traffic.

### 2) Report generation

runConfigletsReport does this:

1. Load all blueprints.
2. Load global configlets.
3. For each blueprint, load configlets (staging endpoint first, fallback endpoint second).
4. Normalize payload shapes.
5. Match each blueprint assignment to global configlet (by id first, then by name).
6. Compute sync state with generator fingerprint comparison.
7. Group rows and compute summary counters.
8. Build unused global catalog rows.

### 3) Refresh out-of-sync entry

refreshConfigletFromGlobal does this:

1. Read blueprint assignment by id.
2. Find matching global configlet (id first, then name).
3. Build PUT payload preserving condition.
4. Replace label, display_name, generators from global catalog.
5. PUT back to /api/blueprints/{blueprint_id}/configlets/{configlet_id}.

### 4) Gateway links correlation report

runGatewayConnectionsReport does this:

1. Load all blueprints.
2. For each blueprint, load remote gateways from /api/blueprints/{id}/remote_gateways.
3. For each blueprint, query /api/blueprints/{id}/ql for protocol sessions and endpoint-to-IP mapping.
4. Keep only routing == bgp sessions and derive endpoint IP pairs per session.
5. Correlate remote gateway gw_ip to other blueprints' local gateway EVPN RD IPs.
6. Mark confidence:
   - high: reciprocal config + shared BGP pair evidence
   - medium: either reciprocal config or shared BGP pair evidence
   - low: config match only
7. Return matched rows + unmatched gateway rows with reasons.

### 5) VXLAN stretch workflow

runVxlanStretchReport does this:

1. Load all blueprints.
2. For each blueprint, load /api/blueprints/{id}/virtual-networks.
3. For each blueprint, load /api/blueprints/{id}/security-zones.
4. Normalize VXLAN and security-zone payloads (both map and array response forms).
5. Build stretch grouping key (prefer VNI; fallback to label/zone/subnet composite).
6. Group rows by blueprint presence so UI can show:
   - present in all selected blueprints
   - present in subset (stretch candidates)

stretchVxlans does this:

1. Validate selected stretch keys and selected blueprint scope.
2. Re-fetch current VXLAN/security-zone facts to avoid stale UI assumptions.
3. Derive source blueprint per selected row from presence in scope (preferred source optional).
4. Derive targets from missing blueprints in scope.
5. For each selected row and target blueprint:
   - skip when VXLAN already exists in target
   - resolve target security zone (id match first, then label match)
   - skip with skipped_zone_missing when the target has no matching routing zone (stretch the VRF first)
   - assign to all detected target switch systems by default
   - POST new VXLAN payload to /api/blueprints/{target_id}/virtual-networks
6. Return per-target operation outcomes (created, skipped, failed) and summary counts.

### 6) VRF stretch workflow

runVrfStretchReport does this:

1. Load all blueprints.
2. For each blueprint, load /api/blueprints/{id}/security-zones.
3. Normalize routing-zone/security-zone payloads (array/map response forms).
4. Build stretch grouping key (prefer VNI/VNID when present; fallback to vrf_name/label/type).
5. Group rows by blueprint presence so UI can show:
   - present in all selected blueprints
   - present in subset (stretch candidates)

stretchVrfs does this:

1. Validate selected stretch keys and selected blueprint scope.
2. Re-fetch current VRF/security-zone facts to avoid stale UI assumptions.
3. Derive source blueprint per selected row from presence in scope (preferred source optional).
4. Derive targets from missing blueprints in scope.
5. For each selected row and target blueprint:
   - skip when VRF already exists in target
   - drop source-blueprint-scoped fields (routing_policy_id, vrf_id, vlan_id) that the target cannot resolve
   - POST new security-zone payload to /api/blueprints/{target_id}/security-zones
6. Return per-target operation outcomes (created, skipped, failed) and summary counts.

### VNI / VLAN conflict detection

Each blueprint row carries a conflictIndex built from data already fetched for the report:

- vniOwners: VNI -> owning virtual network or routing zone. VNIs are a single shared namespace per
  blueprint, so a VXLAN can collide with a routing zone's VNI and vice versa.
- routingZoneVlans: VLAN -> routing zone. Routing-zone VLANs must be unique blueprint-wide.
- vlansBySystem: system id -> VLAN -> virtual network. VN VLANs must be unique per leaf.

The popup mirrors this in findTargetConflict to grey out and disable conflicted rows before any POST,
and the service worker re-checks with freshly fetched facts in findStretchConflict, recording
skipped_vni_conflict style outcomes as status "skipped_conflict" instead of issuing a doomed request.
Being outside the target's VNI pool is NOT treated as a conflict; Apstra accepts explicit out-of-pool
VNIs and real deployments rely on that for DCI networks.

### Blueprint design filtering

/api/blueprints reports a design per blueprint (for example two_stage_l3clos or freeform). Freeform
blueprints do not expose configlets, virtual-networks, security-zones or the datacenter ql schema, so
every report filters them out up front and also treats a 404 on those endpoints as an unsupported
blueprint. They are returned in report.skippedBlueprints (informational) rather than
report.partialFailures (error).

## Data Model Notes

Active table rows are grouped configlet rows with:

- configletName
- globalConfigletId
- blueprints[]
- entries[] (blueprint-level detail records)
- counts (assignmentCount, inSyncCount, outOfSyncCount)

Unused table rows include:

- configletName
- globalConfigletId
- lastUpdatedAt
- catalogText

Gateway report rows include:

- sourceBlueprintId / sourceBlueprintName
- sourceGatewayName / sourceGatewayIp / sourceGatewayAsn
- targetBlueprintId / targetBlueprintName
- targetGatewayName / targetGatewayIp / targetGatewayAsn
- reciprocalConfig
- hasBgpEvidence
- sharedBgpPairs[]
- confidence

VXLAN report rows include:

- stretchKey
- vnId / vnType
- primaryLabel / labels[]
- securityZoneLabels[]
- ipv4Subnets[] / ipv6Subnets[]
- presentBlueprints[]
- missingBlueprintIds[]

VXLAN stretch result rows include:

- stretchKey
- vxlanLabel / vxlanVni
- sourceBlueprintId / sourceBlueprintName
- targetBlueprintId / targetBlueprintName
- status (created, skipped_exists, skipped_source_missing, failed)
- message

VRF report rows include:

- stretchKey
- primaryLabel / labels[]
- vrfNames[] / vrfTypes[]
- presentBlueprints[]
- missingBlueprintIds[]

VRF stretch result rows include:

- stretchKey
- vrfLabel
- sourceBlueprintId / sourceBlueprintName
- targetBlueprintId / targetBlueprintName
- status (created, skipped_exists, skipped_source_missing, failed)
- message

The details modal renders blueprint-level cards from row.entries.

## UI Design Standards

Keep these standards for visual consistency:

1. Preserve design tokens in popup/popup.css :root.
2. Keep left navigation collapsed by default (app-shell is-collapsed-nav on load).
3. Preserve five-view model (home + configlets + gateways + vxlans + vrfs) unless a new tool is explicitly approved.
4. Keep status badge semantics:
   - status-ready
   - status-pending
   - status-error
5. Every async action must show immediate feedback:
   - disable initiating button
   - change button text when appropriate (example: Refreshing...)
   - restore state on completion/failure
6. Keep table readability priority:
   - sticky headers
   - fixed column widths
   - compact but legible typography
7. Keep modal behavior consistent:
   - close button
   - click outside to close
   - Escape to close
8. Keep links explicit:
   - global configlet link to /#/design/configlets/{id}
   - blueprint configlet page link to /#/blueprints/{id}/staged/catalog/configlets
9. Keep gateway diagram interaction predictable:
   - drag to pan
   - wheel/+/- to zoom
   - reset returns to centered baseline
10. Keep diagram labels short enough to remain inside node boundaries.

## Behavior and Safety Standards

1. Never require raw token display in UI.
2. Keep auth data in extension storage only.
3. Prefer origin-scoped state.
4. Normalize API payloads defensively (field name variants are expected).
5. Maintain pagination safeguards:
   - default page size
   - max page limit
   - graceful fallback when pagination is unsupported
6. Keep heavy comparison work bounded (diff fallback/truncation is intentional).

## How to Add a New Feature Safely

1. Define the user story and target view.
2. Add a new message type in src/background.js handleMessage switch.
3. Implement background business logic first.
4. Reuse existing API wrappers (apiGet/apiPost/apiPut/apiDelete) whenever possible.
5. If Apstra session auth is needed, route through tab API helpers.
6. Add popup state fields in appState only as needed.
7. Add UI controls in popup/popup.html.
8. Wire events in popup/popup.js wireEvents.
9. Render deterministic loading, success, and error states.
10. Update README and user-guide screenshots if user-visible behavior changes.

## Debugging Checklist

1. If popup appears stuck on Checking:
   - verify service worker syntax and startup
   - refresh extension in chrome://extensions
2. If message port closed errors appear:
   - verify background always returns sendResponse
   - confirm no runtime exception before response
3. If API calls fail unexpectedly:
   - confirm active tab is Apstra and authenticated
   - trigger Refresh Token Capture
4. If file:// popup is used for testing:
   - chrome.runtime is unavailable there; this is not a valid runtime test for messaging
5. If refresh action appears to do nothing:
   - verify click handler location (table vs modal)
   - verify async button disabled state and error banner updates
6. If Gateway Links says Unsupported request:
   - popup is newer than active service worker
   - reload the extension in chrome://extensions
7. If VXLAN stretch creation fails with permission errors:
   - verify logged-in Apstra user has write permissions on target blueprints
   - verify security zone exists in targets (matching id or label)
8. If VRF stretch creation fails with permission errors:
   - verify logged-in Apstra user has write permissions on target blueprints
   - verify source routing-zone fields are accepted by your Apstra version

## Manual Test Matrix (minimum)

1. Install extension via chrome://extensions and Load unpacked.
2. Verify home status transitions: Checking -> Waiting Token -> Ready.
3. Run Configlet Audit refresh and validate summary counters render.
4. Use search/filter/sort and confirm rows update deterministically.
5. Open details modal and expand diff on out-of-sync entries.
6. Trigger Refresh from Global and verify:
   - button disables immediately
   - report updates after completion
   - out-of-sync counts change as expected
7. Export both CSV files and inspect headers/rows.
8. Validate Apstra Uncommitted/Logical Diff reflects staged configlet changes.
9. Run Gateway Links refresh and validate:
   - matched and unmatched tables populate
   - confidence labels align with evidence
   - diagram renders expected nodes/edges
10. Validate diagram interaction:
   - drag pans
   - mouse wheel and +/- zoom
   - reset re-centers and normalizes zoom
11. Run VXLAN Stretch refresh and validate:
   - scope checkboxes and source selector populate
   - grouped tables split full-presence vs partial-presence rows
12. Validate bulk stretch behavior:
   - selecting stretchable rows enables action button
   - per-target statuses appear in Last Stretch Operation
   - reloading report reflects newly created VXLANs in target coverage
13. Run VRF Stretch refresh and validate:
   - scope checkboxes and source selector populate
   - grouped tables split full-presence vs partial-presence rows
14. Validate VRF bulk stretch behavior:
   - selecting stretchable rows enables action button
   - per-target statuses appear in Last Stretch Operation
   - reloading report reflects newly created VRFs in target coverage

## LLM Contributor Guardrails

1. Do not change endpoint semantics without documenting why.
2. Preserve existing message envelope format.
3. Preserve user-facing terminology unless explicitly requested.
4. Avoid introducing blocking long-running operations in popup thread.
5. Keep feature patches minimal and localized.
6. Run syntax checks after edits.
7. Update docs whenever workflow changes.

## Git and Assets

- MP4 files are tracked via Git LFS.
- Keep screenshots and videos under docs/user-guide.
- Prefer stable, ordered filenames for user-guide assets.

## Quick Reference: Current Endpoints

- GET /api/blueprints
- GET /api/blueprints/{id}/configlets?type=staging
- GET /api/blueprints/{id}/configlets (fallback)
- GET /api/design/configlets
- GET /api/blueprints/{blueprint_id}/configlets/{configlet_id}
- PUT /api/blueprints/{blueprint_id}/configlets/{configlet_id}
- GET /api/blueprints/{blueprint_id}/remote_gateways
- POST /api/blueprints/{blueprint_id}/ql
- GET /api/blueprints/{blueprint_id}/virtual-networks
- GET /api/blueprints/{blueprint_id}/security-zones
- POST /api/blueprints/{blueprint_id}/virtual-networks
- POST /api/blueprints/{blueprint_id}/security-zones

## Definition of Done for New Features

A feature is done only when all are true:

1. Background logic implemented and reachable through message contract.
2. UI reflects loading/success/error states.
3. No syntax or diagnostics errors.
4. Manual test path validated.
5. README and user/developer docs updated if behavior changed.
