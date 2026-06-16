# AGENTS.md

## Repository purpose

`garethpaul/pomo` is a Node.js or JavaScript project. A Pomodoro Electron App

## Project structure

- `Makefile` - repository verification targets
- `scripts` - baseline checks and helper scripts
- `docs` - plans, notes, and generated README assets
- `package.json` - Node package metadata and scripts
- `audio` - repository source or sample assets
- `css` - repository source or sample assets
- `fonts` - repository source or sample assets
- `js` - repository source or sample assets
- `plans` - repository source or sample assets
- `release-builds` - repository source or sample assets
- `res` - repository source or sample assets

## Development commands

- Install exact dependencies: `npm ci`
- Audit dependencies: `npm audit`
- Full baseline: `make check`
- Combined verification: `make verify`
- Lint/static checks: `make lint`
- Tests: `make test`
- Build: `make build`
- package script `start`: `npm start`
- package script `smoke`: `npm run smoke`
- package script `build`: `npm run build`
- package script `lint`: `npm run lint`
- package script `test`: `npm test`
- package script `verify`: `npm run verify`
- If a command above skips because a platform toolchain is missing, verify on a machine with that SDK before claiming platform behavior is tested.

## Coding conventions

- Language mix noted in the README: JavaScript (5).
- Use Node 22.12 or newer; `.nvmrc` selects Node 22.

## Testing guidance

- Test-related files detected: `docs/plans/2026-06-08-renderer-wiring-tests.md`, `plans/2026-06-08-notification-regression-tests.md`, `plans/2026-06-08-timer-regression-tests.md`, `scripts/test-app-wiring.js`, `scripts/test-electron-app.js`, `scripts/test-main-process.js`, `scripts/test-notification.js`, `scripts/test-preload-api.js`, `scripts/test-timer.js`
- Start with the narrowest relevant test or Make target, then run `make check` before handing off if the change is not documentation-only.
- Keep README verification notes in sync when commands, fixtures, or supported toolchains change.

## PR / change guidance

- Keep diffs focused on the requested repository and avoid unrelated modernization or formatting churn.
- Preserve public APIs, sample behavior, file formats, and documented environment variables unless the task explicitly changes them.
- Update tests, README notes, or docs/plans when behavior, security posture, or validation commands change.
- Call out skipped platform validation, legacy toolchain assumptions, and any risky files touched in the final summary.

## Safety and gotchas

- No required secret or credential file was identified. Keep the app local-only unless a future integration explicitly documents its configuration and privacy behavior.
- `npm run contracts` verifies that the renderer does not load remote scripts and that external links stay behind explicit user clicks.
- `npm run contracts` verifies external-link handling keeps an explicit http/https protocol guard.
- `npm run contracts` also checks the renderer window title so placeholder Bootstrap titles do not ship.
- `npm run contracts` verifies renderer local asset references stay relative and point to checked-in files.
- `npm run contracts` verifies the notification icon stays local and checked in.
- Preserve the denied notification permission boundary; only the browser's
  default state may call `requestPermission()`.
- Timer durations must remain positive integers, and a completed timer must
  restart from its configured initial duration.
- Keep Electron pinned with the lockfile; do not restore menubar or floating
  dependency ranges.
- BrowserWindow must keep context isolation and sandboxing enabled, Node
  integration disabled, and renderer navigation/window creation denied.
- Keep the self-contained preload bridge limited to close and validated
  external-link commands.
- Hosted checks must retain Node 22/24 locked/audited gates and the bounded
  Ubuntu Electron smoke with pinned actions, read-only permissions, and
  persisted checkout credentials disabled.

## Agent workflow

1. Inspect the README, Makefile, manifests, and the files directly related to the request.
2. Make the smallest source or docs change that satisfies the task; avoid generated, vendored, or local-environment files unless required.
3. Run the narrowest useful validation first, then `make check` or the documented package/platform gate when available.
4. If a required SDK, service credential, or external runtime is unavailable, record the skipped command and why.
5. Summarize changed files, commands run, and remaining risks or follow-up validation.
