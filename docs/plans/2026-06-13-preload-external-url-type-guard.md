# Preload External URL Type Guard

Status: Completed

## Problem

The sandboxed preload bridge forwards every `openExternal` argument to the
main process. The main process correctly rejects invalid URLs, but malformed
non-string renderer values still cross the IPC boundary unnecessarily.

## Plan

1. Reject non-string external URL values in the preload bridge without
   invoking IPC.
2. Preserve string forwarding so the main process remains the authoritative
   HTTP(S), credentials, and URL-shape validator.
3. Add runtime and static mutation-sensitive coverage for the rejection and
   forwarding paths.
4. Run the complete locked verification matrix and record the actual results.

## Compatibility Boundary

- Keep the frozen `pomoDesktop` API and its `close` and `openExternal` methods.
- Preserve valid string return values from `ipcRenderer.invoke`.
- Do not duplicate protocol parsing in the preload or weaken main-process URL
  validation.

## Work Completed

- Added a preload-side string type guard that returns a resolved `false`
  result without invoking IPC for malformed values.
- Preserved string forwarding to the authoritative main-process URL validator.
- Added runtime coverage for null, numeric, object, and valid string values,
  plus static contracts for the guard, async rejection, and no-IPC assertion.
- Updated security, change, and maintenance-plan documentation.

## Verification

- `make check` passed the complete lint, deterministic test, build, and local
  contract gate on Node 22.22.2 and Node 24.16.0.
- Temporary runtime and static mutations that inverted the string type guard
  each failed at the intended regression assertion.
- `git diff --check` passed for the completed implementation.
