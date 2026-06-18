---
title: Undici Advisory Remediation
date: 2026-06-18
type: implementation-plan
status: in_progress
---

# Undici Advisory Remediation

## Summary

Raise the locked transitive `undici` dependency from 7.27.2 to 7.28.0 so the
Electron 42 dependency graph no longer matches the TLS certificate-validation
or shared-cache disclosure advisories reported by `npm audit`.

## Problem Frame

The application still pins Electron 42.4.0, but a newly published advisory now
matches its optional transitive `undici` 7.27.2 package. The package's existing
semver range accepts 7.28.0, so the vulnerable package can be replaced without
changing Electron, application behavior, or public APIs.

## Requirements

- R1. Lock `undici` at 7.28.0 or newer within the existing accepted range.
- R2. Preserve Electron 42.4.0 and the rest of the dependency graph.
- R3. Keep `npm audit`, deterministic tests, and Electron smoke green on the
  supported Node 22 and Node 24 lanes.
- R4. Add a local contract that rejects restoration of the vulnerable lockfile
  entry.
- R5. Keep the change isolated from timer, notification, IPC, and renderer
  behavior.

## Implementation

- Refresh only the transitive `undici` lockfile entry with npm's lockfile-only
  audit fix.
- Add a contract assertion for the patched version and record the security
  change in `CHANGES.md`.
- Keep this pull request stacked on the timer settlement branch so existing
  remediation worktrees do not need to be modified.

## Verification Strategy

- Run the dependency-free timer and local-contract gates from the repository
  and from an external directory.
- Run `npm audit` and require zero vulnerabilities.
- Run the complete locked install, syntax, deterministic test, contract, and
  Electron smoke gates on hosted Node 22 and Node 24 runners.
- Audit the exact diff for whitespace, generated artifacts, credentials, and
  unrelated dependency changes.

## Current Evidence

- A lockfile-only audit fix changed only the `undici` version, resolved URL,
  and integrity value from 7.27.2 to 7.28.0.
- `npm audit` reports zero vulnerabilities after the update.
- The timer and local-contract gates pass from the repository and an external
  directory under the available Node 20.19.5 host. This host is below the
  supported Node 22.12 floor, so it is not full package-gate evidence.
- Supported-runtime hosted verification is pending.
