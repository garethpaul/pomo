# Changes

## 2026-06-26T04:43:00-07:00 — P2 completed timer controls

- Cycle: inspected the timer state machine, renderer button wiring, prior
  completion settlement work, notification boundaries, package lock, and
  hosted Node/Electron lanes.
- Threads: started none; completed the focused renderer-state fix directly.
- Bug: reaching `00:00` cleared the interval and notified, but left Stop visible
  and Start hidden until the user clicked Stop or changed tabs.
- Work: added an optional completion callback after interval cleanup, wired all
  three timers to restore Start and hide Stop, and preserved notification and
  restart ordering.
- Files: changed `js/timer.js`, `js/app.js`, focused timer/renderer tests,
  durable contracts, public guidance, and
  `docs/plans/2026-06-26-timer-completion-controls.md`.
- Validation: timer, renderer, and contract tests failed before implementation.
  Node 22.23.1 and Node 24.18.0 container runs passed `npm run verify`, zero-high
  audit, root `make check`, and external-directory Make verification.
- Validation wrinkle: two initial durable-checker edits referenced fixture and
  documentation variables before loading them; both were corrected before the
  full green runs. Host Electron smoke cannot install Electron 42 under Node
  18.19.1, so the supported hosted smoke remains required before merge.
- Findings: interval ownership was correct after the earlier settlement fix,
  but visible control ownership was not reconciled at completion.
- Blockers: local Node 18 is below the declared Node 22.12 floor; supported
  Electron runtime validation remains a hosted gate.
- Next: run exact-head review and hosted Node/Electron/CodeQL checks, then merge
  only the exact green reviewed head.

## 2026-06-25T15:22:00-07:00 — P2 local repository metadata

- Cycle: inspected the MIT-licensed Electron app, current work, timer and
  notification state, IPC/preload boundaries, package surface, and hosted lanes.
- Threads: started portable local metadata enforcement; continued local-only
  package and repository-contract hardening; stopped none.
- Bug: `.explore/` was hidden only by this clone's private `.git/info/exclude`,
  so fresh contributor checkouts could report local intelligence as untracked
  package source or stage it accidentally.
- Work: added the active rule; strengthened `npm run contracts` with exact
  active patterns, effective `git check-ignore` probes, and an unfiltered
  `git ls-files` index query for `.vscode` and `.explore`.
- Files: changed `.gitignore`, `scripts/check-local-contracts.js`, `README.md`,
  `SECURITY.md`, `VISION.md`, `AGENTS.md`, and
  `docs/plans/2026-06-25-local-repository-metadata-ignore.md`.
- Validation: the red-first contract failed on the absent `.explore/` rule.
  Focused contracts and renderer/timer tests passed. Root and external
  `make check` passed in read-only Node 22.23.1 and Node 24.18.0 containers;
  both audits found zero vulnerabilities and both package dry-runs preserved
  the 26-file, 2,038,184-byte archive surface. `git diff --check` passed.
- Validation wrinkle: the first root-owned container triggered Git's
  dubious-ownership protection before the contract could inspect ignores; the
  unchanged rerun as the checkout owner passed, matching hosted ownership.
- Remaining evidence: hosted Electron/Node/CodeQL and exact-head review.
- Exact-head Codex review: clean on
  `a064d6996d22533cd0411b8802f67604cbb3be27` with no actionable findings.
- Hosted evidence: push and pull-request Node 22/24 locked checks and Electron
  42 application smoke jobs passed; CodeQL Actions and JavaScript/TypeScript
  analysis passed.
- Findings: clone-local excludes are not repository policy, and filesystem-only
  filtering can hide deleted paths that remain in Git's index.
- Blockers: the host Node 18 runtime is below the declared Node 22 floor;
  supported-runtime validation used cached read-only Node 22/24 containers.
- Next: rerun exact-head review and hosted checks for this evidence-only update,
  then merge if they remain clean.

## 2026-06-25T13:15:39-07:00 — P1 tab timer ownership

- Cycle: inspected the MIT-licensed Electron app, open work, recent lifecycle
  and security changes, timer state machine, renderer wiring, static contracts,
  package lock, and hosted Node/Electron lanes before changing behavior.
- Threads: prioritized timer ownership over dependency or UI polish because a
  countdown started in one mode continued invisibly after the user selected a
  different Pomodoro/break tab.
- Bug: valid tab switches reset only the destination timer. The previous timer
  retained its interval and could notify unexpectedly, while revisiting a tab
  could show a stale Stop control for an already reset timer.
- Files: changed `js/app.js`, `scripts/test-app-wiring.js`,
  `scripts/check-local-contracts.js`, `README.md`, `VISION.md`, `AGENTS.md`, and
  `docs/plans/2026-06-25-tab-switch-timer-ownership.md`.
- Validation: the pre-fix renderer regression failed because the hidden normal
  timer's stop count did not change; the focused VM test passes after explicit
  valid-tab ownership and destination-control reconciliation. Six isolated
  hostile mutations were rejected. Root and external `make check` passed on
  Node 22.23.1 and Node 24.18.0; both audits reported zero vulnerabilities and
  both package dry-runs preserved the expected 26-file surface.
- Blockers: the host Node 18 runtime is below the declared Node 22 floor, so
  final supported-runtime and package verification must use Node 22/24 lanes;
  Electron integration remains the hosted smoke gate.
- Next: reject hostile ownership mutations, run root and external full gates,
  require clean exact-head Codex review and hosted checks, then merge.

## 2026-06-21

- Hardened all five pre-existing Make gates against control-variable
  redirection and shell-active checkout paths without changing Electron
  application behavior.

## 2026-06-18

- Raised the locked transitive `undici` dependency to 7.28.0 to close the
  TLS certificate-validation and shared-cache disclosure advisories.

## 2026-06-17

- Settled completed timer intervals before notification dispatch and added a
  throwing-hook regression that verifies cleanup ordering.
- Contained granted-permission notification construction failures so renderer
  timer completion cannot leak repeated operating-system delivery exceptions.

## 2026-06-16

- Notification permission request failures are contained for both synchronous
  browser throws and rejected permission promises.
- Bound privileged close and external-link IPC to the application window's
  current main frame, rejecting child and missing-frame senders.
- Contained synchronous and asynchronous external launch failures in the main
  process and preserved a deterministic boolean result for the preload API.
- Stopped startup and timer completion from retrying denied notification
  permission while preserving the default-state prompt and granted delivery.

## 2026-06-13

- Bound close and external-link IPC to the application window's `webContents`
  and added trusted/untrusted sender regression coverage.
- Rejected non-string external URL values in the sandboxed preload before they
  can cross the IPC boundary, with runtime and static regression coverage.
- Expanded deterministic Electron tests for negative-coordinate tray
  positioning, About and Quit commands, activation, DevTools-aware blur, and
  close-to-hide behavior.

## 2026-06-12

- Replaced floating legacy Electron/menubar dependencies with exact Electron
  42.4.0 and a committed lockfile that audits with zero findings.
- Replaced menubar with direct Tray/BrowserWindow ownership while preserving
  hidden startup, tray toggle, About, close, Quit, and local-only behavior.
- Added a sandboxed, context-isolated preload bridge; disabled renderer Node
  integration, navigation, and window creation; and added a restrictive CSP.
- Added Node 22/24 locked CI and a bounded Ubuntu 24.04 `xvfb` application smoke
  launch, plus pure Electron lifecycle and preload tests.
- Fixed paused timers with zero-padded seconds so restart arithmetic remains
  numeric and resumes from the exact remaining duration.

## 2026-06-10

- Added pinned, credential-free, read-only GitHub Actions validation on Node 20
  and Node 24 without installing the legacy Electron dependency tree.
- Extended local contracts to preserve the CI action pins, runtime matrix,
  canonical command, manual dispatch, and no-install boundary.
- Added timer duration validation so invalid local countdown values are rejected
  before interval state is created.
- Fixed completed timers so pressing Start begins a fresh interval instead of
  immediately completing again from zero.
## 2026-06-09

- Added accessible label validation for icon-only renderer controls.
- Added a static `npm run build` gate for local-only desktop contracts.
- Added Makefile `lint` and `build` wrappers and contract coverage for the
  repository-standard gate commands.

## 2026-06-08

- Added an external-link protocol guard so the renderer only opens explicit
  http/https URLs after user clicks.
- Added dependency-free renderer wiring tests for timer buttons, tab resets,
  external-link gating, and close-command IPC.
- Added renderer local asset reference validation so checked-in CSS,
  JavaScript, image, and audio files cannot drift from `index.html`.
- Added notification icon asset validation so desktop notifications keep using
  a checked-in relative image.
- Guarded renderer tab resets so unknown tab hashes do not reset the long timer.
- Added a renderer window title contract so `index.html` stays branded as Pomo
  instead of a Bootstrap starter placeholder.
- Added close IPC guard coverage and tray shared-object tests for the Electron
  main process.
- Added deterministic desktop notification regression tests and made the
  notification helper safe to load outside Electron.
- Added `make check` as a repository-standard wrapper around `npm run verify`.
- Extracted the Pomodoro timer class into `js/timer.js` so it can be tested without launching Electron.
- Added `npm test` coverage for time formatting, duration calculation, countdown ticks, completion notification, and interval cleanup.
- Added `npm run verify` to run JavaScript syntax checks and timer regression tests.
- Added `npm run contracts`, canonical `docs/plans` coverage, and local-only
  renderer checks that reject hidden remote script loads.
