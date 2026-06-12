# CI Baseline

Status: Completed

## Context

The repository had local Node verification for syntax, timer tests, renderer
wiring, and local-only contracts, but no hosted workflow ran it for pushes and
pull requests.

## Work Completed

- Added a GitHub Actions workflow that runs `make check` on Node 20 and Node 24
  without installing the legacy Electron dependency tree.
- Pinned the checkout and Node setup actions, disabled persisted checkout
  credentials, and limited the workflow token to read-only contents access.
- Added manual dispatch, bounded jobs, and cancellation for superseded runs.
- Extended the local contract checker and docs so the hosted CI path and its
  least-privilege constraints stay visible.

## Verification

- `make check`
