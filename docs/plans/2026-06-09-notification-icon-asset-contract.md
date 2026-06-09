# Notification Icon Asset Contract

Status: Completed

## Context

Pomo keeps desktop behavior local-only, and the renderer asset contract already
checks files loaded from `index.html`. The notification icon is referenced from
`js/notification.js`, so it needs its own guard to prevent a missing or remote
icon from slipping past the renderer asset scan.

## Objectives

- Keep the notification icon configured as a relative local path.
- Verify the referenced notification icon exists in the repository.
- Document the notification icon contract in README, SECURITY, VISION, and
  CHANGES.
- Preserve dependency-free contract checks that do not launch Electron.

## Work Completed

- Extended `scripts/check-local-contracts.js` to parse and validate the
  notification icon reference.
- Added this completed plan under `docs/plans/`.
- Updated local-only documentation for the notification icon guard.

## Verification

- `npm run contracts`
- `npm run verify`
- `make check`
- `git diff --check`
