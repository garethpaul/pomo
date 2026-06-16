# Contain External Link Launch Failures

Status: Planned

## Context

The privileged `openExternal` IPC handler validates the sender main frame and
HTTP(S) URL before calling Electron's `shell.openExternal`. A platform launch
failure rejects that promise through `ipcRenderer.invoke`, while the renderer
intentionally ignores the result. This can produce an unhandled renderer
rejection and makes the exposed boolean success contract unreliable.

## Priority

1. Keep OS/browser launch failures inside the trusted main process.
2. Preserve the existing `true`/`false` preload API contract without exposing
   URL or platform diagnostics.
3. Protect the failure boundary with dependency-free and mutation-sensitive
   tests.

## Requirements

- Return `true` only after `shell.openExternal` resolves.
- Convert a synchronous throw or rejected launch promise to `false`.
- Preserve application-window and current-main-frame identity checks.
- Preserve credential-free HTTP(S)-only URL validation and avoid logging the
  URL or exception.
- Add focused fake-Electron regression coverage for a rejected launch.
- Extend local contracts, completed plan evidence, and project guidance.

## Files

- `js/electron-app.js`
- `scripts/test-electron-app.js`
- `scripts/check-local-contracts.js`
- `README.md`
- `SECURITY.md`
- `VISION.md`
- `CHANGES.md`
- `docs/plans/2026-06-16-open-external-failure-boundary.md`

## Verification Planned

- Run focused Electron application tests, `npm run verify`, and all Make gates
  from repository and external working directories.
- Run the exact-lockfile audit and package allowlist checks.
- Reject isolated mutations for rejected-promise handling, synchronous throws,
  false-result assertions, URL redaction, guidance, and plan completion.
- Audit the exact diff, dependencies/workflow, artifacts, modes, conflicts,
  credentials, and upstream alignment before commit.

## Runtime Boundary

The fake-Electron suite can deterministically exercise resolved, rejected, and
throwing launch behavior. The hosted Ubuntu `xvfb` smoke remains the real
Electron 42 startup gate; no external browser is launched during validation.
