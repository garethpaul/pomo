# Bind Privileged IPC to the Application Window

Status: Completed

## Context

The main process validates close commands and external URL schemes, but its IPC
listeners do not verify which renderer sent the event. The application creates
one local, isolated window today; binding privileged handlers to that window's
`webContents` keeps the boundary explicit if additional renderers are added.

## Objectives

- Reject `closeApp` and `openExternal` IPC from any sender other than the
  application window's `webContents`.
- Preserve trusted renderer behavior, command validation, URL validation, and
  shell error propagation.
- Add application-level regression tests for trusted and untrusted events.
- Keep an explicit untrusted sender regression for both privileged channels.
- Protect the implementation, test cases, documentation, and completed plan in
  the dependency-free contract gate.

## Scope Boundaries

- Do not add IPC channels, broaden URL protocols, or change preload exposure.
- Do not add dependencies or weaken context isolation, sandboxing, navigation,
  or popup denial.

## Verification

- focused Electron application and contract tests
- all `make check` gates on Node 22 and Node 24
- Electron 42 smoke test in the existing hosted/local environment where
  available
- hostile mutations covering sender checks, trusted/untrusted tests,
  documentation, plan status, and verification evidence
- `npm audit`, `npm pack --dry-run --json`, `git diff --check`, and secret,
  captured-prompt, generated-artifact, dependency, and workflow scans

## Work Completed

- Added `isTrustedIpcSender` and bound `closeApp` plus `openExternal` to the
  application window's `webContents` before command or URL handling.
- Extended the fake-Electron application test with trusted and unrelated sender
  events for both privileged channels.
- Protected the implementation tests, documentation, and completed plan in the
  local-only contract checker.

## Verification Results

- Node 22 and Node 24 `make check` passed in network-disabled, read-only
  containers, including syntax, all deterministic tests, and local-only
  contracts.
- The focused fake-Electron application test passed trusted and untrusted
  sender cases for both privileged channels.
- Seven hostile mutations rejected sender-comparison and handler-guard removal,
  missing untrusted tests, documentation drift, plan status drift, and
  verification-evidence drift.
- `npm audit --ignore-scripts --audit-level=low` reported zero vulnerabilities,
  and `npm pack --dry-run --json` produced a 26-file package manifest.
- The real Electron 42 `xvfb` smoke was not run locally because this worktree
  intentionally has no installed Electron binary; the existing hosted smoke job
  remains the exact-head runtime gate.
- `git diff --check` and the secret, captured-prompt, generated-artifact,
  dependency, and workflow scans passed.
