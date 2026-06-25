# Local Repository Metadata Ignore

Status: Completed

## Context

Maintainer exploration notes exist under `.explore/`, but the repository did
not ignore that directory. This clone hid it only through `.git/info/exclude`,
which does not protect fresh contributor or CI checkouts.

The repository also lacked a canonical index check for local `.vscode/` editor
state. Raw ignore text alone would not prove ordered Git rules remain effective
or that a file was not previously force-added.

## Decisions

- Add exact active `.vscode/` and `.explore/` pattern contracts.
- Ask pinned `/usr/bin/git check-ignore` to validate the directories and a
  representative intelligence file under Git's effective ordered rules.
- Query `git ls-files` without filtering by filesystem existence and reject any
  tracked local metadata path.
- Keep local notes out of package source and place durable decisions in reviewed
  repository artifacts.

## Verification

- The red-first `npm run contracts` check rejected the absent active
  `.explore/` rule.
- Run `npm run contracts`, `npm test`, and `make check`.
- Run `make check` from an unrelated directory using the absolute Makefile.
- Run `npm audit` and `npm pack --dry-run --json` on supported Node releases.
- Require exact-head Codex review and hosted Node/Electron/CodeQL success before
  merge.

## Risks

- Ignored local notes are not shared through Git; durable decisions must be
  copied into tracked plans, changes, policies, tests, or source.
- The contract relies on `/usr/bin/git`, matching hosted Ubuntu and common macOS
  system-tool locations used by this repository.
- This change does not alter timers, notifications, preload IPC, Electron
  lifecycle, package contents, or renderer behavior.

## Verification Result

- The red-first contract rejected the absent active `.explore/` rule.
- Focused local contracts plus renderer and timer tests passed.
- Root and unrelated-directory `make check` passed on Node 22.23.1 and Node
  24.18.0 in read-only containers run as the checkout owner.
- Both supported-runtime audits found zero vulnerabilities, and both package
  dry-runs preserved the 26-file, 2,038,184-byte archive surface.
- A first root-owned container run stopped on Git's expected dubious-ownership
  protection; the unchanged owner-matched rerun passed.
- `git diff --check` passed.
