# Local-Only Desktop Contracts

## Status: Completed

## Context

`pomo` is a small Electron menubar timer. Existing checks cover timer behavior
and desktop notifications, but the app still carried legacy conditional CDN
script tags in `index.html` and had no canonical `docs/plans` record.

## Objectives

- Keep the desktop timer local-first.
- Remove hidden remote script loading from the renderer.
- Add a dependency-free contract check for renderer script loading, explicit
  external-link user actions, and local notification behavior.
- Add a completed engineering plan under `docs/plans`.

## Work Completed

- Removed legacy remote IE8 shim script tags from `index.html`.
- Added `scripts/check-local-contracts.js` and `npm run contracts`.
- Included the contract check in `npm run verify` and `make check`.
- Updated README, security, vision, and changelog notes.

## Verification

- `npm run contracts`
- `npm run verify`
- `make check`
- `git diff --check`
