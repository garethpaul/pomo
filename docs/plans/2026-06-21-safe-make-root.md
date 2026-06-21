# Safe Makefile Root Resolution

Status: Completed

## Context

The Makefile ignored `REPO_ROOT` overrides but trusted caller-controlled
`MAKEFILE_LIST`. Replacing that automatic variable redirected npm verification
outside the reviewed Electron checkout.

## Scope Boundaries

- Do not change Electron runtime behavior, IPC boundaries, timer semantics, or
  the exact dependency lockfile.
- Preserve Node 22 and Node 24 hosted verification.
- Keep the regression suite independent of npm installation and Electron.

## Work Completed

- Reject command-line and environment replacement of `MAKEFILE_LIST` and
  preloaded `MAKEFILES`; pin the shell used by Make.
- Canonicalize the checked-in Makefile directory through quoted POSIX tools.
- Export the canonical root and reference it as shell data instead of
  interpolating a checkout path into shell source.
- Add dependency-free shell coverage for all five pre-existing public Make targets plus the root regression gate.
- Include the root policy in `make verify` and `make check`.

## Verification Completed

- Node 22.22.2 and Node 24.16.0 passed clean locked installs, zero-vulnerability
  audits, and the full deterministic verification suite.
- All target and `REPO_ROOT` override cases passed from a temporary checkout
  path containing spaces, an apostrophe, and a literal backtick command.
- A real lint invocation proved the shell-active checkout path remained inert.
- Command-line and environment `MAKEFILE_LIST`, `MAKEFILES`, and `SHELL`
  attacks failed closed or were overridden by the checked-in policy.
- Electron source, assets, package metadata, and lockfile remained unchanged.
