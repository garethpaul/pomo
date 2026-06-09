# Gate Wrapper Contract

Status: Completed

## Context

`package.json` exposed lint, test, contract, and verify scripts, but the root
Makefile only exposed `test` and `verify`. Repository automation expects
standard `make lint`, `make test`, `make build`, and `make check` gates, and
the app did not have an `npm run build` alias for its static Electron preflight.

## Objectives

- Add `npm run build` as a static preflight that runs the local desktop
  contracts without launching Electron.
- Add root `make lint` and `make build` wrappers alongside the existing test
  and verify wrappers.
- Extend `scripts/check-local-contracts.js` so the package and Makefile gate
  wrappers cannot drift silently.
- Document the gate wrapper contract in README, VISION, SECURITY, and CHANGES.

## Work Completed

- Added `build` to `package.json` and routed `verify` through lint, test, and
  build.
- Added `lint` and `build` targets to the Makefile.
- Extended local contract checks to assert the npm and Makefile wrappers.
- Updated project documentation and maintenance notes for the static build gate.

## Verification

- Red `make lint` before adding the target.
- Red `make build` before adding the target.
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run contracts`
- `npm run verify`
- `make lint`
- `make test`
- `make build`
- `make check`
- `git diff --check`
