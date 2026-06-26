# Timer Completion Callback Failure Boundary

Status: Completed

## Problem

The renderer completion callback was introduced to restore Start/Stop controls.
If that callback threw, the timer interval was already stopped but desktop
notification was skipped because notification dispatch came afterward in the
same uncaught call stack.

## Decision

- Keep interval cleanup first.
- Attempt the optional renderer completion callback and retain its failure.
- still attempt notification after a renderer callback failure.
- If notification also fails, preserve the first side-effect failure rather
  than replacing it with a later one.
- Rethrow only after both independent completion side effects were attempted.

## Verification

- The new timer regression failed before implementation because notification
  remained at zero after a throwing completion callback.
- The repaired test proves cleanup, the original exception, and exactly one
  notification attempt.
- Durable source, fixture, documentation, and completed-plan contracts run in
  `npm run contracts` and `make check`.
