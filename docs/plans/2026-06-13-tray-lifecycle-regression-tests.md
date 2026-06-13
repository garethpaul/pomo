# Tray Lifecycle Regression Tests

Status: Completed

## Context

The Electron 42 migration replaced the retired menubar dependency with direct
`Tray`, `BrowserWindow`, and `Menu` ownership. Existing tests cover a top-right
tray click, external-link IPC, and quitting close behavior, but do not protect
bottom-edge and negative-coordinate positioning, tray menu actions, activation,
DevTools-aware blur behavior, or close-to-hide before quit.

## Priority

These branches define the desktop app's primary lifecycle and are easy to
regress during cross-platform packaging work. Deterministic Node fakes can
exercise them without launching Electron or weakening the hosted application
smoke test.

## Prioritized Engineering Backlog

1. Protect tray positioning, menu commands, activation, blur, and close
   lifecycle behavior now.
2. Add platform-specific packaged-app coverage when macOS and Windows signing
   environments are available.
3. Add visual notification and tray-icon checks only with stable native test
   infrastructure.

## Objectives

- Verify bottom-edge tray windows open upward and remain clamped on displays
  with negative coordinates.
- Verify About opens the expected dialog and Quit invokes the app lifecycle.
- Verify activation shows and focuses the window.
- Verify blur hides normally but remains visible while DevTools is open.
- Verify close hides and prevents destruction before quit, then allows close
  after `before-quit`.
- Protect the new assertions and completed plan in local contracts.
- Keep Electron application behavior and dependency inputs unchanged.

## Scope Boundaries

- Do not modify `js/electron-app.js`, preload IPC, or renderer behavior.
- Do not change Electron, Node, packaging, or workflow versions.
- Do not add browser automation or platform-specific dependencies.
- Do not merge or close the canonical remediation PR.

## Verification

- `node --check scripts/test-electron-app.js`
- `node --check scripts/check-local-contracts.js`
- `node scripts/test-electron-app.js`
- `npm run lint`
- `npm test`
- `npm run build`
- `make check`
- unchanged runtime and dependency file hashes
- `git diff --check`

## Work Completed

- Added a bottom-edge, negative-coordinate display case that verifies upward
  placement and horizontal work-area clamping.
- Added deterministic About and Quit menu action coverage.
- Added activation, DevTools-aware blur, close-to-hide, and post-quit close
  lifecycle coverage.
- Extended local contracts to preserve the new assertions, documentation, and
  completed plan.
- Left runtime modules, dependencies, package metadata, and workflows
  unchanged.

## Verification Results

- `node --check scripts/test-electron-app.js` and
  `node --check scripts/check-local-contracts.js` passed.
- `node scripts/test-electron-app.js` passed.
- `npm run lint`, `npm test`, `npm run build`, and `make check` passed.
- Runtime, dependency, package, and workflow files have no diff from base
  commit `59644b33cc777b609ff3007d584c7eee0d4d6961`.
- `git diff --check` passed.
