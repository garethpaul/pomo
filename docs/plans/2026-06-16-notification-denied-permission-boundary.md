# Notification Denied-Permission Boundary

status: completed

## Context

The renderer requests notification permission for every state other than
`granted`. When a learner has already denied permission, both startup and timer
completion call `requestPermission()` again even though the browser has made
that state persistent and another request cannot display a useful prompt.

## Priority

Stop repeated denied-state permission requests before adding notification
features. Permission state is a user privacy choice and should be handled as a
stable fail-closed boundary rather than retried on every app lifecycle.

## Requirements

- R1. Request notification permission only when the current state is
  `default`.
- R2. Return a non-success result for `denied` without calling
  `requestPermission()`, constructing a notification, or alerting repeatedly.
- R3. Preserve the unavailable-API alert, granted-state success, and existing
  notification title/icon/body behavior.
- R4. Apply the same permission-state policy during DOMContentLoaded startup
  and timer-completion notification delivery.
- R5. Add direct and DOM wiring regressions plus mutation-sensitive source,
  guidance, and completed-plan contracts.
- R6. Keep the change dependency-free and avoid live desktop prompts, Electron
  launches outside the existing smoke gate, or other external interaction.

## Implementation Units

### U1. Permission-state handling

**File:** `js/notification.js`

Centralize the requestable-state decision so `default` requests once,
`denied` fails quietly, `granted` proceeds, and unavailable APIs retain the
existing learner-facing alert.

### U2. Runtime and DOM regressions

**Files:** `scripts/test-notification.js`, `scripts/test-app-wiring.js`

Prove denied permission does not request or construct notifications from either
direct calls or the startup event path while preserving default and granted
behavior.

### U3. Maintained contracts and guidance

**Files:** `scripts/check-local-contracts.js`, `README.md`, `SECURITY.md`,
`AGENTS.md`, `VISION.md`, `CHANGES.md`, and this plan.

Add source, test-registration, documentation, and completed-plan contracts that
reject permission-state regression.

## Verification

- The focused notification and app-wiring tests passed, including direct and
  DOMContentLoaded denied-state coverage.
- `npm run verify`, repository `make check`, and the absolute Makefile invoked
  from an external directory passed with the exact lockfile.
- `npm audit --audit-level=low` reported zero vulnerabilities, and `npm pack
  --dry-run --json` reported the expected 26-file package.
- Six isolated hostile mutations were rejected for denied-state retry,
  default-state suppression, missing direct/DOM tests, erased guidance, and
  premature plan completion.
- The local Electron smoke could not run on this validation host because its
  Node 20.19.5 and glibc predate Electron 42's Node 22.12 and installer-binding
  requirements. The unchanged hosted workflow retains Node 22/24 pure gates
  and its bounded Ubuntu 24.04 Electron smoke.
- Exact diff, generated-artifact, credential-pattern, dependency/workflow
  drift, file-mode, package-content, and whitespace audits completed before
  commit.

## Scope Boundaries

- Do not redesign notification content or introduce settings persistence.
- Do not change timer behavior, Electron security preferences, IPC, or external
  link handling.
- Do not trigger a live operating-system notification prompt during validation.
