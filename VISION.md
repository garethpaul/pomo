## Pomo Vision

Pomo is a small Electron menubar Pomodoro timer with work, short-break, and
long-break tabs, notifications, and a tray/menu integration.

The repository is useful as a compact desktop app example: it shows Electron
startup, direct tray-window behavior, timer state, notification audio,
Bootstrap-era UI, and narrow IPC for closing and external links.

The goal is to keep the timer reliable, lightweight, and understandable while
making Electron and dependency age explicit.

Current baseline: `make check` runs syntax checks, timer, notification,
main-process, preload, and renderer wiring regression tests plus local-only
desktop contracts. Hosted validation also launches Electron 42 under `xvfb`.

The current focus is:

Priority:

- Preserve the 25-minute, 5-minute, and 10-minute timer flows
- Keep timer durations validated as positive integers
- Keep a completed timer restartable from its initial duration
- Keep paused timers restartable from their exact remaining duration
- Keep start, stop, and reset behavior predictable
- Maintain `make lint`, `make test`, `make build`, `make check`, and
  `npm run verify` for syntax checks, tests, and local desktop contracts
- Run locked and audited verification on Node 22 and Node 24 in hosted CI with
  credential-free checkout, read-only permissions, and pinned actions
- Keep a bounded Ubuntu Electron 42 smoke launch in hosted verification
- Keep tray positioning, menu commands, and window lifecycle behavior covered
  by deterministic Node tests
- Maintain `npm run contracts` for local-only renderer and plan guardrails
- Keep GitHub Actions aligned with the local Node `make check` baseline
- Keep close IPC commands explicit and covered by deterministic tests
- Bind privileged IPC commands to the application window sender identity
- Require the application window's current main frame for privileged IPC
- Contain every external launch failure in the main process without exposing
  URL or platform diagnostics
- Keep context isolation and sandboxing enabled, Node integration disabled,
  renderer navigation/window creation denied, and the preload bridge narrow
- Keep renderer button and tab wiring covered without launching Electron
- Keep icon-only renderer controls labelled for assistive tooling
- Keep unknown tab hashes from resetting any timer
- Keep renderer external-link opening limited to explicit http/https URLs
- Keep the renderer window title aligned with the Pomo app name
- Keep renderer local asset references checked in and relative
- Keep the desktop notification icon checked in and relative
- Treat denied notification permission as fail-closed without repeated
  startup or timer-completion requests
- Contain notification permission request failures without retrying prompts or
  interrupting the timer lifecycle
- Maintain local notification behavior without network dependencies
- Keep tray/menu behavior visible in the main process

Next priorities:

- Add packaging and release-signing validation for supported desktop platforms
- Add manual verification notes for renderer timer transitions
- Review notification behavior and icon rendering on macOS, Windows, and Linux
- Add a documented cadence for Electron and Node dependency updates

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
