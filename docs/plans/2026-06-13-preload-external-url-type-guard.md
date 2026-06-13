# Preload External URL Type Guard

Status: Planned

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

## Verification

Pending implementation.
