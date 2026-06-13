# Bind Privileged IPC to the Application Window

Status: Pending

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

Pending implementation.

## Verification Results

Pending implementation and validation.
