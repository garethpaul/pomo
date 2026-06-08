# Timer Regression Tests

## Status

Completed

## Context

`pomo` had an Electron start script but no deterministic test or lint command.
The timer behavior was embedded in the renderer script, so basic countdown logic
could only be checked by manually running the desktop app.

## Objectives

- Extract the timer class into a reusable module without changing renderer
  button wiring.
- Add a Node-based test for timer formatting, duration calculation, countdown
  ticks, completion notification, and interval cleanup.
- Add a no-dependency JavaScript syntax check.
- Provide `npm run verify` as the local quality gate.

## Verification

- `npm run lint`
- `npm test`
- `npm run verify`
- `git diff --check`

## Follow-Up Candidates

- Add DOM-level tests for start, stop, reset, and tab-switch wiring.
- Pin a supported Electron version and add a package lock.
- Add manual platform notes for notification rendering on macOS, Windows, and Linux.
