# CI Baseline

Status: Completed

## Context

The repository had local Node verification for syntax, timer tests, renderer
wiring, and local-only contracts, but no hosted workflow ran it for pushes and
pull requests.

## Changes

- Added a GitHub Actions workflow that installs Node 20 and runs `make check`.
- Extended the local contract checker and docs so the hosted CI path stays
  visible.

## Verification

- `make check`
