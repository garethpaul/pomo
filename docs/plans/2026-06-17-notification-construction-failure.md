# Notification Construction Failure Boundary

status: planned

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
