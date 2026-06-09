# Renderer Tab Reset Guard

## Status: Completed

## Context

The renderer reset handler switched timers when Bootstrap tabs were shown. It
handled `pomodoro` and `short` explicitly, then used a broad fallback for every
other hash. That made unknown tabs reset the long timer.

## Goals

- Reset the long timer only for the explicit `#long` tab.
- Keep unknown tabs from resetting any timer.
- Cover the behavior in the VM-based renderer wiring test.
- Preserve the guard in local-only contract checks and docs.

## Work Completed

- Replaced the broad tab-reset fallback with an explicit `long` branch.
- Added a renderer wiring assertion that unknown tabs do not change reset
  counts.
- Added this completed plan under `docs/plans/`.

## Verification

- `node scripts/test-app-wiring.js`
- `npm test`
- `npm run contracts`
- `npm run verify`
- `make check`
- `git diff --check`
