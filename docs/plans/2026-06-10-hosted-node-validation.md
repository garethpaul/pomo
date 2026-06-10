# Hosted Node Validation

Status: Completed

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
  and Node setup actions to reviewed commits.
- Extended the local contract checker to preserve permissions, action pins,
  runtime coverage, the canonical command, and the no-install boundary.

## Verification

- `make lint`
- `make test`
- `make build`
- `make check`
- `git diff --check`
