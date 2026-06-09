# Renderer Window Title Contract

## Status: Completed

## Context

`index.html` still used Bootstrap's starter-page title even though the packaged
app is named Pomo. The local contract checks already inspected the renderer for
remote script and user-action behavior, but they did not catch placeholder
window metadata.

## Goals

- Replace the placeholder title with `<title>Pomo</title>`.
- Add a deterministic contract check for the renderer window title.
- Document the title contract alongside the existing local-only renderer checks.

## Work Completed

- Updated `index.html` to use the Pomo app name as the window title.
- Extended `scripts/check-local-contracts.js` to preserve the title and this
  completed plan.
- Added README, VISION, and CHANGES notes for the new contract.

## Verification

- `npm run contracts`
- `npm run lint`
- `npm test`
- `npm run verify`
- `make check`
- `git diff --check`
