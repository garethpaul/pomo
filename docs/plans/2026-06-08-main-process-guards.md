# Main Process Guards

## Status: Completed

## Context

`pomo` had deterministic timer, notification, and local-only renderer checks,
but the Electron main process still depended on manual app startup. The
renderer close button sent a `closeApp` IPC command, and the main process quit
the application without checking the command payload.

## Objectives

- Keep the renderer close flow unchanged for the app.
- Require the explicit `close` command before the main process quits.
- Extract pure main-process helpers that can be tested without Electron.
- Include main-process coverage in `npm test`, `npm run verify`, and
  `make check`.

## Work Completed

- Added `js/main-process.js` for close-command handling and tray shared-object
  callback creation.
- Updated `index.js` to use the helper and ignore malformed close commands.
- Added `scripts/test-main-process.js` for guarded IPC behavior and tray
  callback coverage.
- Updated README, VISION, CHANGES, and npm verification scripts.

## Verification

- `npm run lint`
- `npm test`
- `npm run contracts`
- `npm run verify`
- `make check`
- `git diff --check`

## Follow-Up Candidates

- Add DOM-level renderer tests for start, stop, reset, and tab switching.
- Pin a supported Electron version and record the install with a lockfile.
