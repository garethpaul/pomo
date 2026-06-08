# pomo

<!-- README-OVERVIEW-IMAGE -->
![Project overview](docs/readme-overview.svg)

## Overview

`garethpaul/pomo` is a Node.js or JavaScript project. A Pomodoro Electron App

This README is based on the checked-in source, manifests, scripts, and repository metadata on the `master` branch. The project language mix found during review was: JavaScript (5).

## Repository Contents

- `README.md` - project overview and local usage notes
- `CHANGES.md` - notable maintenance changes
- `Makefile` - local verification entry points
- `package.json` - JavaScript dependency and script metadata
- `css` - source or example code
- `js` - source or example code
- `plans` - completed maintenance plans
- `scripts` - deterministic regression tests
- `SECURITY.md` - security reporting and disclosure guidance
- `VISION.md` - project direction and maintenance guardrails

Additional scan context:

- Source directories: css, js, scripts
- Dependency and build manifests: package.json
- Entry points or build surfaces: Makefile, index.js, package.json
- Test-looking files: scripts/test-notification.js, scripts/test-timer.js

## Getting Started

### Prerequisites

- Git
- Node.js and npm
- `make` for the local verification wrapper

### Setup

```bash
git clone https://github.com/garethpaul/pomo.git
cd pomo
npm install
```

The setup commands above are derived from repository files. Legacy mobile, Python, or JavaScript samples may require older SDKs or package versions than a modern workstation uses by default.

## Running or Using the Project

- Run `npm start` for the default development command.

Detected npm scripts:

- `npm run start` - `electron index.js`
- `npm run contracts` - `node scripts/check-local-contracts.js`
- `npm run lint` - `node --check index.js && node --check js/notification.js && node --check js/timer.js && node --check js/app.js && node --check scripts/test-timer.js && node --check scripts/test-notification.js`
- `npm run test` - `node scripts/test-timer.js && node scripts/test-notification.js`
- `npm run verify` - `npm run lint && npm test && npm run contracts`

## Testing and Verification

- Run `npm test` for deterministic timer and notification regression coverage.
- Run `npm run contracts` for the local-only renderer and canonical plan checks.
- Run `npm run verify` before committing; it checks JavaScript syntax, runs the
  timer and notification tests, and verifies local-only desktop contracts.
- Run `make check` as the repository-standard wrapper around `npm run verify`.

When the required SDK or runtime is unavailable, use static checks and source review first, then verify on a machine that has the matching platform toolchain.

## Configuration and Secrets

- No required secret or credential file was identified. Keep the app local-only unless a future integration explicitly documents its configuration and privacy behavior.

## Security and Privacy Notes

- Review changes touching authentication or token handling; examples from the scan include js/jquery.min.js.
- Review changes touching external API calls or credential-adjacent configuration; examples from the scan include css/bootstrap.min.css, css/ie10-viewport-bug-workaround.css, js/bootstrap.min.js.
- Review changes touching network requests, sockets, or service endpoints; examples from the scan include LICENSE.md, css/bootstrap.min.css, css/ie10-viewport-bug-workaround.css, index.html, and 2 more.
- Review changes touching file, media, JSON, XML, CSV, OCR, or data parsing; examples from the scan include css/bootstrap.min.css, js/jquery.min.js.
- Review changes touching shell execution, subprocess, or dynamic evaluation; examples from the scan include js/jquery.min.js.
- `npm run contracts` verifies that the renderer does not load remote scripts
  and that external links stay behind explicit user clicks.

## Maintenance Notes

- See `SECURITY.md` for vulnerability reporting and safe research guidance.
- See `VISION.md` for project direction and contribution guardrails.
- See `CHANGES.md` for maintenance history.
- See `docs/plans/2026-06-08-local-only-contracts.md` for the current
  canonical completed engineering plan.
- See `plans/2026-06-08-notification-regression-tests.md` for the notification
  regression baseline.

## Contributing

Keep changes small and tied to the project that is already present in this repository. For code changes, document the toolchain used, avoid committing generated dependency directories or local configuration, and update this README when setup or verification steps change.
