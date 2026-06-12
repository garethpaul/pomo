# Electron 42 Security Migration

Status: Planned

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

## Verification

- Pending test-first implementation and verification.
