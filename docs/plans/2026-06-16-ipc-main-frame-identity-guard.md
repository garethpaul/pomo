# Bind Privileged IPC to the Application Main Frame

Status: Completed

## Context

`isTrustedIpcSender` verifies that an IPC event came from the application
window's `webContents`, but Electron IPC events also identify the individual
`senderFrame`. Electron's security guidance warns that child frames can send
IPC in some scenarios, so privileged close and external-link handlers should
accept only the application's current main frame.

Primary references:

- https://www.electronjs.org/docs/latest/tutorial/security#17-validate-the-sender-of-all-ipc-messages
- https://www.electronjs.org/docs/latest/api/structures/ipc-main-event

## Requirements

- Require the expected application `webContents` and its current `mainFrame`.
- Reject missing, destroyed, unrelated, and child-frame IPC senders.
- Preserve close-command validation, HTTP(S)-only external URL validation,
  popup/navigation denial, context isolation, sandboxing, and shell rejection
  propagation.
- Add dependency-free tests for trusted main-frame and untrusted child-frame
  events on both privileged channels.
- Protect implementation, regression, guidance, and completed-plan evidence in
  the local contract checker.

## Implementation

- Extend `isTrustedIpcSender` in `js/electron-app.js` with an exact
  `senderFrame === window.webContents.mainFrame` boundary.
- Update `scripts/test-electron-app.js` fakes and assertions for main-frame,
  child-frame, missing-frame, and unrelated-webContents cases.
- Extend `scripts/check-local-contracts.js` and maintained documentation with
  mutation-sensitive contracts.

## Verification

- Run focused application tests, the complete npm verification suite, and all
  Make gates from repository and external working directories.
- Run `npm audit --ignore-scripts --audit-level=low` and
  `npm pack --dry-run --json` for the exact lockfile and package allowlist.
- Reject isolated mutations that remove webContents or main-frame identity,
  child-frame tests, guidance, or completed plan evidence.
- Audit the exact diff, package/dependency/workflow drift, generated artifacts,
  file modes, conflicts, and credential-like additions before committing.

## Runtime Boundary

The dependency-free fake-Electron suite exercises the sender contract locally.
The existing hosted Ubuntu 24.04 `xvfb` job remains the real Electron 42 launch
gate after push.

## Work Completed

- Required the application window's current `mainFrame` in addition to its
  `webContents` for both privileged IPC handlers.
- Added main-frame, child-frame, missing-frame, and unrelated-sender coverage
  without widening the preload API or accepted URL protocols.
- Extended local-only source, regression, documentation, and completed-plan
  contracts.

## Verification Results

- The focused Electron application test, complete npm verification suite, and
  all Make gates including `make check` passed from repository and external
  working directories.
- A read-only, network-disabled Node 24 container passed the absolute Makefile
  `check` gate; the host Node 20 run provided an additional compatibility
  signal below the declared Node 22 minimum.
- `npm audit --ignore-scripts --audit-level=low` reported zero vulnerabilities
  for the exact lockfile.
- `npm pack --dry-run --json` retained the intended 26-file, approximately
  2.0 MB package and excluded release-build artifacts.
- Six isolated hostile mutations were rejected for webContents identity,
  main-frame identity, child-frame regression coverage, missing-frame coverage,
  maintained guidance, and completed plan status.
- Exact diff, generated-artifact, package/dependency/workflow drift, file-mode,
  conflict-marker, and credential-pattern audits passed before commit.
