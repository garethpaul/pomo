# Renderer Wiring Tests

## Status: Completed

## Context

`pomo` had deterministic tests for timer logic, notifications, and main-process
close IPC handling, but the renderer wiring in `js/app.js` still depended on
manual Electron startup. The next maintenance risk was accidentally breaking
button handlers, tab reset behavior, external-link gating, or close-command IPC
without a local test catching it.

## Objectives

- Keep the test dependency-free and avoid launching Electron.
- Load `js/app.js` with stubbed DOM, jQuery, Electron shell, IPC, and timer
  objects.
- Cover start, stop, reset, tab switching, user-click-gated external links, and
  the renderer close command.
- Include the renderer wiring test in `npm test`, `npm run verify`, and
  `make check`.

## Work Completed

- Added `scripts/test-app-wiring.js` as a Node `vm`-based renderer wiring test.
- Added the test to npm syntax checks and the test suite.
- Extended local contract checks so the renderer wiring test and completed plan
  stay wired into the repository verification gate.
- Updated README, VISION, and CHANGES maintenance notes.

## Verification

- `npm run lint`
- `npm test`
- `npm run contracts`
- `npm run verify`
- `make check`
- `git diff --check`
