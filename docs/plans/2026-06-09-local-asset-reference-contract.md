# Renderer Local Asset Reference Contract

## Status: Completed

## Context

`npm run contracts` already enforced local-only renderer behavior by rejecting
remote scripts and checking user-action gating for external links. It did not
verify that local asset references in `index.html` still pointed to checked-in
files, so a renamed CSS, JavaScript, image, or audio asset could silently break
packaging.

## Goals

- Parse renderer local asset references from `index.html`.
- Reject non-relative or protocol-based renderer asset references.
- Require referenced CSS, JavaScript, image, and audio files to exist.
- Document the local asset references guard alongside the existing contracts.

## Work Completed

- Extended `scripts/check-local-contracts.js` to collect `src` and `href`
  values from renderer asset tags and assert each local file exists.
- Added README, VISION, SECURITY, and CHANGES notes for the new contract.
- Added this completed plan under `docs/plans/`.

## Verification

- `npm run contracts`
- `npm run lint`
- `npm test`
- `npm run verify`
- `make check`
- `git diff --check`
