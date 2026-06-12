## Pomo Vision

Pomo is a small Electron menubar Pomodoro timer with work, short-break, and
long-break tabs, notifications, and a tray/menu integration.

The repository is useful as a compact desktop app example: it shows Electron
startup, menubar behavior, timer state, notification audio, Bootstrap-era UI,
and simple IPC for quitting the app.

The goal is to keep the timer reliable, lightweight, and understandable while
making Electron and dependency age explicit.

Current baseline: `make check` runs syntax checks, timer, notification,
main-process, and renderer wiring regression tests, and local-only desktop
contracts, including local asset reference checks and accessible label checks,
without launching Electron.

The current focus is:

Priority:

- Preserve the 25-minute, 5-minute, and 10-minute timer flows
- Keep timer durations validated as positive integers
- Keep start, stop, and reset behavior predictable
- Maintain `make lint`, `make test`, `make build`, `make check`, and
  `npm run verify` for syntax checks, tests, and local desktop contracts
- Maintain `npm run contracts` for local-only renderer and plan guardrails
- Keep GitHub Actions aligned with the local Node `make check` baseline
- Keep close IPC commands explicit and covered by deterministic tests
- Keep renderer button and tab wiring covered without launching Electron
- Keep icon-only renderer controls labelled for assistive tooling
- Keep unknown tab hashes from resetting any timer
- Keep renderer external-link opening limited to explicit http/https URLs
- Keep the renderer window title aligned with the Pomo app name
- Keep renderer local asset references checked in and relative
- Keep the desktop notification icon checked in and relative
- Maintain local notification behavior without network dependencies
- Keep tray/menu behavior visible in the main process

Next priorities:

- Document supported Electron and Node versions
- Add manual verification notes for renderer timer transitions
- Review notification behavior and icon rendering on macOS, Windows, and Linux
- Modernize dependencies in a dedicated pass

Contribution rules:

- One PR = one focused timer, notification, packaging, UI, or documentation change.
- Do not add background tracking or analytics.
- Keep desktop permission prompts obvious.
- Include manual app-run notes for behavior changes.
- Keep `.github/workflows/check.yml` in sync with the local syntax, test, and
  contract gates.

## Security And Responsible Use

Canonical security policy and reporting:

- [`SECURITY.md`](SECURITY.md)

Desktop timer apps should stay local by default. Pomo should not collect usage
data, open external links without user action, or run hidden background tasks
outside the menubar app behavior.

## What We Will Not Merge (For Now)

- Hidden telemetry
- Network-backed timer state
- Dependency rewrites mixed with UI changes
- Auto-start behavior without explicit user opt-in

This list is a roadmap guardrail, not a permanent rule.
Strong user demand and strong technical rationale can change it.
