# Hosted Node Validation

Status: Completed

> Historical boundary: the Node 20/24 no-install matrix was appropriate while
> the repository declared an unlocked obsolete Electron tree. It was
> superseded on June 12, 2026 by the locked Node 22/24 and Electron 42 smoke
> contract in `2026-06-12-electron-42-security-migration.md`.

## Context

The repository had dependency-free Node checks for syntax, timer behavior,
renderer wiring, main-process guards, and local-only asset contracts, but no
hosted workflow ran them for pushes and pull requests. Installing the declared
legacy Electron dependency tree is unnecessary for these checks and would add
unlocked, obsolete supply-chain exposure.

## Work Completed

- Added a fixed-runner GitHub Actions matrix for Node 20 and Node 24.
- Kept the workflow install-free because every verification command uses Node
  built-ins and checked-in assets only.
- Limited the workflow token to read-only contents access and pinned checkout
  and Node setup actions to reviewed commits, with persisted checkout
  credentials disabled.
- Added manual dispatch, bounded jobs, and cancellation for superseded runs.
- Extended the local contract checker to preserve permissions, action pins,
  the exact credential-free checkout contract, runtime coverage, the canonical
  command, and the no-install boundary.

## Verification

- `make lint`
- `make test`
- `make build`
- `make check`
- `git diff --check`
