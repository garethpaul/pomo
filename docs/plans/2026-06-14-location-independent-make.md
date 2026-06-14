# Make Repository Gates Location Independent

Status: Planned

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

## Work Planned

- Add an override-protected absolute repository root to the Makefile.
- Prefix each executable recipe with a change to that root.
- Extend the local-only checker with exact root and recipe contracts.
