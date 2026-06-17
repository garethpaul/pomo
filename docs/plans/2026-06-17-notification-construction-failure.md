# Notification Construction Failure Boundary

status: completed

## Context

`notifyUser()` verifies that notification permission is granted, then assumes
the browser or operating-system Notification constructor cannot fail. If it
throws, the exception escapes the timer completion callback before
`stopTimer()` executes, allowing the active interval to repeat the failure.

## Priority

Contain notification construction failures before expanding renderer behavior.
An OS-level delivery failure must remain a quiet fail-closed boundary rather
than destabilizing timer completion.

## Requirements

- R1. Preserve unavailable, default, denied, and granted permission behavior.
- R2. Return `undefined` when notification construction throws instead of
  propagating the exception.
- R3. Preserve the existing successful title, body, icon, close handler, and
  returned notification object.
- R4. Keep permission requests, timer state, Electron IPC, and window lifecycle
  unchanged.
- R5. Add direct regressions and mutation-sensitive source, fixture, guidance,
  and completed-plan contracts.
- R6. Keep the change dependency-free and avoid live notification prompts.

## Scope Boundaries

- Do not retry failed construction or display a fallback alert.
- Do not redesign notification content or permission policy.
- Do not change timer interval ownership or completion ordering.
- Keep this change stacked on PR #9; do not merge or close either pull request
  without explicit owner authorization.

## Implementation Units

### U1. Contain Construction Failure

- **Files:** `js/notification.js`
- Guard notification construction and close-handler setup as one fail-closed
  renderer boundary.

### U2. Add Regression Coverage

- **Files:** `scripts/test-notification.js`
- Exercise a granted Notification implementation whose constructor throws and
  prove the call returns `undefined` without altering successful delivery.

### U3. Preserve The Contract

- **Files:** `scripts/check-local-contracts.js`, `README.md`, `CHANGES.md`, this
  plan
- Require source containment, fixture execution, guidance, and truthful
  completed evidence.

## Verification Plan

- Run syntax checks and the focused notification suite on Node 22 and Node 24.
- Run the complete deterministic suite, repository `make check`, and the
  absolute-Makefile gate from `/tmp` on both Node lanes.
- Run exact lockfile audit and package dry-run validation.
- Reject isolated mutations of containment, return behavior, successful
  delivery, fixture execution, guidance, and completed plan status.
- Audit the exact diff, generated artifacts, dependencies, credentials,
  conflicts, modes, package contents, and whitespace before shipment.

## Work Completed

- Contained Notification constructor and close-handler setup failures after the
  granted-permission check without retrying or changing permission policy.
- Preserved successful notification content, handler setup, and returned
  notification identity.
- Added a throwing constructor regression with exact single-attempt coverage,
  mutation-sensitive local contracts, README guidance, and changelog evidence.

## Verification Completed

- Node 22.22.3 and Node 24.16.0 passed syntax checks and the complete
  deterministic test and contract suite in both a Git-aware final-state
  projection and the exact worktree.
- Repository `make check` and the absolute-Makefile gate from `/tmp` passed on
  both supported Node lanes against the exact worktree.
- Exact lockfile audits reported zero vulnerabilities on both Node lanes, and
  package dry runs each reported the same 26 files and 2,037,640-byte package.
- Seven isolated hostile mutations were rejected across exception containment,
  constructor invocation, successful return behavior, fixture execution,
  attempt-count assertion, README guidance, and completed plan status.
- Exact diff, generated-artifact, dependency, workflow, credential,
  conflict-marker, binary, mode, package-content, and whitespace audits passed
  for the intended six-file implementation change.
