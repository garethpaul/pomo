# Notification Permission Request Failure Boundary

status: planned

## Context

The renderer correctly requests notification permission only from the
`default` state, but it assumes `requestPermission()` cannot fail. A synchronous
throw escapes startup or timer completion, while a rejected permission promise
becomes an unhandled rejection.

## Priority

Contain permission-prompt failures before adding notification behavior. A
browser or operating-system permission failure must remain a quiet fail-closed
boundary rather than destabilizing the timer application.

## Requirements

- R1. Preserve the existing `default`, `denied`, `granted`, and unavailable-API
  permission policy.
- R2. Return false when `requestPermission()` throws synchronously.
- R3. Attach a rejection handler when `requestPermission()` returns a
  promise-like value so failures cannot become unhandled rejections.
- R4. Keep successful prompt attempts returning true without awaiting user
  interaction or changing notification delivery.
- R5. Add direct asynchronous regressions and mutation-sensitive source,
  guidance, and completed-plan contracts.
- R6. Keep the change dependency-free and avoid live notification prompts.

## Scope Boundaries

- Do not redesign notification content, add settings persistence, or retry
  permission requests.
- Do not change timer behavior, Electron IPC, window lifecycle, or external
  link handling.
- Keep this change stacked on PR #8; do not merge or close either pull request
  without explicit owner authorization.

## Verification Plan

- Run focused notification tests and the complete deterministic Node suite on
  Node 22 and Node 24.
- Run repository `make check`, the absolute-Makefile gate from `/tmp`, exact
  lockfile audit, and package dry-run validation.
- Reject isolated mutations of synchronous containment, promise rejection
  containment, return semantics, test execution, guidance, and plan evidence.
- Audit the exact diff, generated artifacts, dependencies, credentials,
  conflicts, modes, package contents, and whitespace before commit and push.
