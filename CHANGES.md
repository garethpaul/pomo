# Changes

## 2026-06-08

- Added dependency-free renderer wiring tests for timer buttons, tab resets,
  external-link gating, and close-command IPC.
- Added close IPC guard coverage and tray shared-object tests for the Electron
  main process.
- Added deterministic desktop notification regression tests and made the
  notification helper safe to load outside Electron.
- Added `make check` as a repository-standard wrapper around `npm run verify`.
- Extracted the Pomodoro timer class into `js/timer.js` so it can be tested without launching Electron.
- Added `npm test` coverage for time formatting, duration calculation, countdown ticks, completion notification, and interval cleanup.
- Added `npm run verify` to run JavaScript syntax checks and timer regression tests.
- Added `npm run contracts`, canonical `docs/plans` coverage, and local-only
  renderer checks that reject hidden remote script loads.
