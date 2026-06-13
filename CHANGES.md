# Changes

## 2026-06-13

- Bound close and external-link IPC to the application window's `webContents`
  and added trusted/untrusted sender regression coverage.
- Rejected non-string external URL values in the sandboxed preload before they
  can cross the IPC boundary, with runtime and static regression coverage.
- Expanded deterministic Electron tests for negative-coordinate tray
  positioning, About and Quit commands, activation, DevTools-aware blur, and
  close-to-hide behavior.

## 2026-06-12

- Replaced floating legacy Electron/menubar dependencies with exact Electron
  42.4.0 and a committed lockfile that audits with zero findings.
- Replaced menubar with direct Tray/BrowserWindow ownership while preserving
  hidden startup, tray toggle, About, close, Quit, and local-only behavior.
- Added a sandboxed, context-isolated preload bridge; disabled renderer Node
  integration, navigation, and window creation; and added a restrictive CSP.
- Added Node 22/24 locked CI and a bounded Ubuntu 24.04 `xvfb` application smoke
  launch, plus pure Electron lifecycle and preload tests.
- Fixed paused timers with zero-padded seconds so restart arithmetic remains
  numeric and resumes from the exact remaining duration.

## 2026-06-10

- Added pinned, credential-free, read-only GitHub Actions validation on Node 20
  and Node 24 without installing the legacy Electron dependency tree.
- Extended local contracts to preserve the CI action pins, runtime matrix,
  canonical command, manual dispatch, and no-install boundary.
- Added timer duration validation so invalid local countdown values are rejected
  before interval state is created.
- Fixed completed timers so pressing Start begins a fresh interval instead of
  immediately completing again from zero.
## 2026-06-09

- Added accessible label validation for icon-only renderer controls.
- Added a static `npm run build` gate for local-only desktop contracts.
- Added Makefile `lint` and `build` wrappers and contract coverage for the
  repository-standard gate commands.

## 2026-06-08

- Added an external-link protocol guard so the renderer only opens explicit
  http/https URLs after user clicks.
- Added dependency-free renderer wiring tests for timer buttons, tab resets,
  external-link gating, and close-command IPC.
- Added renderer local asset reference validation so checked-in CSS,
  JavaScript, image, and audio files cannot drift from `index.html`.
- Added notification icon asset validation so desktop notifications keep using
  a checked-in relative image.
- Guarded renderer tab resets so unknown tab hashes do not reset the long timer.
- Added a renderer window title contract so `index.html` stays branded as Pomo
  instead of a Bootstrap starter placeholder.
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
