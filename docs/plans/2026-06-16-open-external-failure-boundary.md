# Contain External Link Launch Failures

Status: Completed

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

## Work Completed

- Deferred `shell.openExternal` invocation into a resolved promise so a
  synchronous throw enters the same failure boundary as a rejected promise.
- Converted both launch failure modes to `false` without logging the URL or
  platform exception, while preserving successful `true` results.
- Added fake-Electron coverage for resolved, rejected, throwing, and recovered
  launches, plus static contracts and synchronized project guidance.

## Verification

- `node scripts/test-electron-app.js`, `npm test`, `npm run lint`, and focused
  `make lint`/`make test` gates passed from the repository and an unrelated
  directory.
- `npm audit --ignore-scripts --audit-level=low` reported zero vulnerabilities.
- `npm pack --dry-run --json` preserved the 26-file package allowlist.
- Seven isolated hostile mutations were rejected: escaped synchronous throws,
  propagated rejected promises, an inverted rejected-result assertion, removed
  throwing and recovery assertions, removed guidance, and reopened plan status.
- Final `npm run verify` and `make check` gates passed from the repository, and
  `make check` also passed when invoked from an unrelated directory.
- Exact diff, dependency/workflow, artifact, mode, conflict, credential, and
  upstream-alignment audits passed for the eight intended paths; the existing
  tracked release ZIP remained unchanged.

## Runtime Boundary

The fake-Electron suite can deterministically exercise resolved, rejected, and
throwing launch behavior. The hosted Ubuntu `xvfb` smoke remains the real
Electron 42 startup gate; no external browser is launched during validation.
