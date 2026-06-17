---
title: Timer Completion Settlement Ordering
date: 2026-06-17
type: implementation-plan
status: completed
---

# Timer Completion Settlement Ordering

## Summary

Settle timer interval ownership before dispatching the optional completion
notification so an unexpected renderer hook failure cannot leave the completed
timer active and repeat the side effect every second.

## Problem Frame

`Timer.startTimer()` currently calls `root.notifyUser()` at `00:00` and only
then calls `stopTimer()`. Recent notification changes contain known browser API
failures, but the timer still trusts an externally replaceable renderer hook.
If that hook throws, interval cleanup is skipped even though the countdown has
already completed.

## Requirements

- R1. Clear the active interval before invoking the completion notification
  hook at `00:00`.
- R2. Preserve exactly one notification attempt for an ordinary successful
  completion.
- R3. Preserve the existing exception behavior of an unexpected notification
  hook while guaranteeing interval cleanup has already occurred.
- R4. Preserve restart, pause/resume, reset, duration, display, and notification
  permission behavior.
- R5. Add deterministic regression and mutation-sensitive source, fixture,
  guidance, and completed-plan contracts.
- R6. Keep the change dependency-free and compatible with the supported Node
  22, Node 24, and Electron 42 validation lanes.

## Key Technical Decisions

- KTD1. Settle before side effects: call the existing `stopTimer()` method at
  completion before consulting or invoking `root.notifyUser`.
- KTD2. Do not add a catch-all: unexpected hook exceptions continue to surface
  to their caller, but they can no longer retain interval ownership.
- KTD3. Test observable ordering: the regression hook asserts that its interval
  ID is already present in the clear log when notification dispatch begins.
- KTD4. Keep ownership local: do not change `notifyUser`, the renderer wiring,
  or Electron IPC to solve a timer lifecycle invariant.

## Scope Boundaries

- Do not redesign notification content, permission requests, or construction
  failure handling.
- Do not swallow unexpected notification-hook exceptions.
- Do not change timer arithmetic, display formatting, restart, pause, or reset
  behavior.
- Do not update Electron or other dependencies in this stacked change.
- Keep this change stacked on PR #10; do not merge or close either pull request
  without explicit owner authorization.

## Implementation Units

### U1. Settle Timer Ownership Before Notification

- **Goal:** Ensure a completed timer cannot remain scheduled because its
  notification hook throws.
- **Requirements:** R1, R2, R3, R4, R6.
- **Dependencies:** None.
- **Files:** `js/timer.js`, `scripts/test-timer.js`.
- **Approach:** Reorder the existing completion branch to call `stopTimer()`
  before the optional hook. Extend the timer fixture with a throwing hook that
  inspects cleanup ordering and proves no second completion tick is owned by
  the timer.
- **Patterns to follow:** Existing injected global timer and notification
  doubles in `scripts/test-timer.js`.
- **Test scenarios:** Successful completion still updates `00:00`, clears the
  active interval once, and notifies once. A throwing notification hook sees
  the active interval already cleared, propagates its exception, and does not
  cause a second notification attempt from owned scheduler state.
- **Verification:** Focused timer tests pass and fail when cleanup is moved back
  after notification dispatch.

### U2. Preserve The Durable Contract

- **Goal:** Keep settlement ordering and its regression coverage visible to the
  repository baseline and future maintainers.
- **Requirements:** R5, R6.
- **Dependencies:** U1.
- **Files:** `scripts/check-local-contracts.js`, `README.md`, `CHANGES.md`,
  `docs/plans/2026-06-17-timer-completion-settlement.md`.
- **Approach:** Add source-order, fixture, guidance, and completed-plan evidence
  checks consistent with the repository's recent failure-boundary plans.
- **Test scenarios:** Removing the source ordering, throwing-hook assertion,
  fixture execution, guidance, or completed status causes a bounded validation
  failure.
- **Verification:** Local contracts, full package gates, and hostile mutations
  reject every weakened boundary.

## Risks And Dependencies

- The deterministic suite proves scheduler ownership and call ordering, not OS
  notification delivery.
- Browser timer callbacks are single-threaded, so settling before the hook does
  not introduce a concurrent cleanup race.
- Hosted Electron smoke remains the integration gate for renderer startup.

## Verification Strategy

- Run syntax and focused timer tests on Node 22 and Node 24.
- Run the complete deterministic suite, `npm run verify`, repository
  `make check`, and the absolute-Makefile gate from `/tmp` on both Node lanes.
- Run exact lockfile audit and package dry-run validation without changing the
  dependency graph.
- Reject isolated hostile mutations across settlement order, throwing-hook
  behavior, fixture execution, guidance, and completed plan evidence.
- Audit the exact diff, generated artifacts, package contents, dependencies,
  workflow, credentials, conflicts, modes, and whitespace before shipment.

## Assumptions

- `root.notifyUser` remains optional and externally replaceable by renderer
  wiring, so the timer must protect its own lifecycle invariant independently.
- Propagating an unexpected hook exception is intentional; this plan only
  guarantees cleanup ordering.

## Work Completed

- Moved `stopTimer()` ahead of the optional completion notification hook so
  interval ownership is settled before renderer side effects begin.
- Added a throwing notification hook regression that asserts cleanup is
  observable inside the hook, preserves the propagated exception, and records
  exactly one attempt.
- Added source-order, fixture, README, changelog, and completed-plan contracts
  without changing timer arithmetic, notification policy, IPC, or dependencies.

## Verification Completed

- Node 22.13.0 and Node 24.16.0 passed syntax checks, the complete deterministic
  test suite, local contracts, `npm run verify`, repository `make check`, and
  the absolute-Makefile gate from `/tmp` in a Git-backed final-state projection.
- The same full gates passed from both caller locations against the exact
  worktree after the completed-plan contract was active.
- Seven hostile mutations were rejected across settlement order, throwing
  notification hook execution, cleanup and attempt assertions, README guidance,
  plan registration, and completed status.
- Exact lockfile audits found zero vulnerabilities on both Node lanes. Package
  dry runs each reported 26 files, 2,360,911 unpacked bytes, and a 2,037,686-byte
  package.
- Exact diff, dependency, package, artifact, credential, workflow, conflict,
  binary, mode, and whitespace audits passed before shipment.
- Hosted Electron 42 smoke remains the application integration boundary; no OS
  notification is displayed during deterministic validation.
