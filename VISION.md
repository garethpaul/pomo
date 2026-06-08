## Pomo Vision

Pomo is a small Electron menubar Pomodoro timer with work, short-break, and
long-break tabs, notifications, and a tray/menu integration.

The repository is useful as a compact desktop app example: it shows Electron
startup, menubar behavior, timer state, notification audio, Bootstrap-era UI,
and simple IPC for quitting the app.

The goal is to keep the timer reliable, lightweight, and understandable while
making Electron and dependency age explicit.

The current focus is:

Priority:

- Preserve the 25-minute, 5-minute, and 10-minute timer flows
- Keep start, stop, and reset behavior predictable
- Maintain local notification behavior without network dependencies
- Keep tray/menu behavior visible in the main process

Next priorities:

- Document supported Electron and Node versions
- Add tests or manual verification notes for timer transitions
- Review notification behavior on macOS, Windows, and Linux
- Modernize dependencies in a dedicated pass

Contribution rules:

- One PR = one focused timer, notification, packaging, UI, or documentation change.
- Do not add background tracking or analytics.
- Keep desktop permission prompts obvious.
- Include manual app-run notes for behavior changes.

## Security And Responsible Use

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
