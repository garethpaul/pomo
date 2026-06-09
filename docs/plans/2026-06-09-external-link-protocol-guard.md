# External Link Protocol Guard

Status: Completed

## Context

The renderer already opens external links only from delegated user clicks, but
the handler accepted any href beginning with `http`. A malformed value such as
`httpnot-a-real-url` should not be passed to Electron's `shell.openExternal`.

## Objectives

- Keep external-link opening behind explicit user clicks.
- Require explicit `http://` or `https://` URLs before calling
  `shell.openExternal`.
- Add deterministic renderer wiring coverage for malformed `http...` hrefs.
- Record the completed guard in the local contract plan set.

## Work Completed

- Added `isExternalHttpUrl` to guard renderer external-link handling.
- Extended `scripts/test-app-wiring.js` to verify malformed `http...` hrefs are
  prevented but not opened.
- Extended local contract checks and docs to keep the http/https guard visible.

## Verification

- `npm test`
- `npm run contracts`
- `npm run verify`
- `make check`
- `git diff --check`
