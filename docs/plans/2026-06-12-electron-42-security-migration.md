# Electron 42 Security Migration

Status: Completed

## Problem

`package.json` uses floating `latest` ranges for Electron and menubar without a
lockfile. GitHub currently reports 32 fixable Electron alerts, including a
critical Chromium remote-code-execution advisory. The latest menubar release
only supports Electron versions below 35, while the newest advisory floor
requires Electron 39.8.1 or newer. The renderer also relies on Node integration
and direct `require('electron')` access.

## Compatibility Boundary

- Preserve the 278 by 250 Pomo tray-window workflow, local-only assets, timer
  behavior, notification behavior, About action, close action, and Quit action.
- Preserve explicit user-click gating and HTTP(S)-only validation for external
  links.
- Keep renderer tests dependency-injected and retain the existing timer,
  notification, main-process, and local-contract coverage.
- Do not restore Node integration, disabled context isolation, remote content,
  or floating dependency ranges to preserve legacy behavior.

## Plan

1. Pin Electron 42.4.0 and Node 22.12.0+, remove obsolete menubar, devtron,
   gulp, and electron-packager dependencies, and commit `package-lock.json`.
2. Replace menubar with direct Electron `Tray`, `BrowserWindow`, and `Menu`
   ownership while preserving toggle, hide, About, close, and Quit behavior.
3. Add a sandboxed, context-isolated preload bridge exposing only close and
   validated external-link commands; remove renderer `require` and global
   shared-object access.
4. Add a restrictive renderer Content Security Policy and remove inline script
   and inline event-handler dependencies.
5. Extend dependency-free unit/contract tests for window security options,
   preload channels, URL validation, tray behavior, and startup lifecycle.
6. Update CI to install the lockfile, audit dependencies on Node 22/24, and run
   one bounded `xvfb` Electron application smoke launch without weakening the
   existing no-network assertions.
7. Update maintenance/security documentation and enforce the completed plan,
   exact dependency graph, and hosted smoke contract through local checks.

## Work Completed

- Pinned Electron 42.4.0, Node 22.12+, and the complete npm graph; removed
  menubar, devtron, gulp, electron-packager, and all floating ranges.
- Replaced menubar with direct Tray, BrowserWindow, Menu, positioning, toggle,
  hide, About, close, Quit, and smoke lifecycle ownership.
- Added a self-contained sandbox-compatible preload exposing only close and
  external-link commands; both commands are revalidated in the main process.
- Enabled context isolation and sandboxing, disabled Node integration, denied
  renderer navigation/window creation, removed inline Node/event hooks, and
  added a restrictive renderer CSP.
- Added pure lifecycle, preload, and renderer bridge tests plus locked Node
  22/24 validation and a real Ubuntu 24.04 Electron smoke job.
- Added an npm runtime file allowlist so stale release binaries cannot enter
  package artifacts.
- Updated repository contracts and maintenance/security documentation.

## Verification

- The first expanded `npm test` failed because `js/electron-app.js` did not
  exist, confirming the test-first boundary.
- Node 22.22.2 and Node 24.16.0 passed `npm run verify`; `npm audit` reported
  zero vulnerabilities for the exact lockfile.
- `make lint`, `make test`, `make build`, `make check`, and `git diff --check`
  passed with Node 22.22.2.
- `npm pack --dry-run --json` reduced the package from 52 MB to 2.0 MB and
  excluded `release-builds/` while retaining the preload and Electron runtime.
- The local real smoke could not run on Ubuntu 20.04 because Electron 42's
  installer requires glibc 2.33 while the host provides glibc 2.31.
- Canonical push run `27429429948` and pull-request run `27429431879` each
  passed Node 22, Node 24, and the real Electron 42 Ubuntu 24.04 `xvfb`
  application smoke at implementation head
  `0909194ca77d8978601dfcb5702ae24bae0cbff5`.
- CodeQL run `27429429487` passed both JavaScript/TypeScript and Actions
  analysis at the same implementation head.
