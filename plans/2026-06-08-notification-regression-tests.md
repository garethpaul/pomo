# Notification Regression Tests

## Status

Completed

## Context

The timer countdown had deterministic tests, but the desktop notification
surface still depended on manually running the Electron app. The renderer script
also assumed `document`, `Notification`, and Electron's `ipcRenderer` were
always available, which made helper behavior hard to test in Node.

## Objectives

- Keep the renderer `notifyUser` and `ipc` globals available for the app.
- Make `js/notification.js` safe to load under Node tests.
- Add tests for unavailable notifications, permission prompts, granted
  notification creation, and denied permission behavior.
- Include notification tests in `npm test` and `npm run verify`.

## Verification

- `npm run lint`
- `npm test`
- `npm run verify`
- `git diff --check`
