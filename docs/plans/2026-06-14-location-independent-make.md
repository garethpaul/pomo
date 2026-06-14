# Make Repository Gates Location Independent

Status: Completed

## Context

The Make targets run `npm` in the caller's current directory. Invoking the
repository Makefile with `make -f /path/to/pomo/Makefile check` from another
directory therefore resolves the wrong `package.json` and cannot reproduce the
same engineering gate.

## Objectives

- Resolve the repository root from the loaded Makefile, independent of the
  caller's current directory.
- Run every executable Make target from that resolved root.
- Protect the root derivation and each rooted recipe with dependency-free
  static contracts and hostile mutation checks.
- Preserve the existing `make check`, lint, test, build, and verify behavior.

## Scope Boundaries

- Do not change npm scripts, application behavior, dependencies, or hosted
  workflow coverage.
- Do not introduce generated files or require network access for validation.

## Verification

- all Make aliases from the repository root on Node 22 and Node 24
- `make -f /path/to/pomo/Makefile check` from an unrelated directory
- an explicit repository-root override attempt from an unrelated directory
- hostile mutations covering root derivation and every rooted recipe
- `npm audit`, `npm pack --dry-run --json`, `git diff --check`, and secret,
  captured-prompt, generated-artifact, dependency, and workflow scans

## Work Completed

- Added an override-protected absolute repository root to the Makefile.
- Prefixed each executable recipe with a change to that root.
- Extended the local-only checker with exact root and recipe contracts.

## Verification Results

- Node 22.22.2 and Node 24.16.0 passed every Make alias from both the repository
  root and an unrelated directory, including full `make check` runs with
  `REPO_ROOT=/tmp` supplied on the command line.
- Five hostile mutations rejected removal of override protection and the
  rooted lint, test, build, and verify recipes.
- `npm audit --ignore-scripts --audit-level=low` reported zero vulnerabilities,
  and `npm pack --dry-run --json` produced the expected 26-file package
  manifest without writing an archive.
- `git diff --check` and the secret, captured-prompt, generated-artifact,
  dependency, and workflow scans passed.
