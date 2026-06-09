# Renderer Accessible Controls

Status: Completed

## Context

Pomo's renderer uses icon-only buttons for the close, start, pause, and reset
actions. Those controls were visually clear in the Bootstrap UI, but the markup
did not give every icon-only control a stable accessible name or matching
tooltip text.

## Objectives

- Add explicit accessible labels and tooltip titles to icon-only controls.
- Keep the brand logo image labelled with `alt` text.
- Extend the dependency-free local contract checker so renderer labels cannot
  drift silently.
- Document the guard in README, VISION, and CHANGES.

## Work Completed

- Added `aria-label` and `title` attributes to the close and timer controls in
  `index.html`.
- Added `alt` text to the renderer brand logo image.
- Extended `scripts/check-local-contracts.js` to verify expected button labels,
  tooltip titles, logo alt text, docs coverage, and the completed plan record.
- Updated top-level maintenance notes for accessible label coverage.

## Verification

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
