# Completed Timer Restart

Status: Completed

## Context

After a countdown reached `00:00`, the timer retained zero as its current
duration. Pressing Start again initialized another zero-length countdown, which
completed immediately instead of beginning a fresh work or break interval.
Paused timers still need to resume from their remaining duration.

## Objectives

- Restart completed timers from their configured initial duration.
- Preserve pause and resume behavior for timers that have not completed.
- Cover the second Start with the dependency-free timer regression test.
- Keep the local contract checker aware of the restart guard.

## Work Completed

- Restored the initial minute and second values only when the previous timer
  reached exactly zero.
- Extended `scripts/test-timer.js` to complete a timer, start it again, and
  verify the next tick displays `00:59` without another notification.
- Added the completed-timer restart behavior to README, VISION, and CHANGES.

## Verification

- `node scripts/test-timer.js`
- `npm test`
- `npm run contracts`
- `make check`
- Mutated the zero-state guard out of `startTimer` and confirmed the restart
  assertion failed.
- `git diff --check`
