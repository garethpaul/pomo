# Timer Completion Controls Implementation Plan

Status: Completed

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Restore each completed timer's Start control and hide Stop immediately at `00:00`.

**Architecture:** Extend `Timer.startTimer` with an optional completion callback invoked after interval ownership is settled and before notification dispatch. The renderer passes a small control-reconciliation callback for each timer, preserving existing notification, restart, pause, reset, and tab behavior.

**Tech Stack:** JavaScript, Node.js assertions, Electron renderer wiring, repository contract tests.

---

### Task 1: Add RED completion-control tests

**Files:**
- Modify: `scripts/test-timer.js`
- Modify: `scripts/test-app-wiring.js`
- Modify: `scripts/check-local-contracts.js`

Require one completion callback at zero after interval cleanup, require each Start handler to pass a callback, and invoke renderer callbacks to prove Start becomes visible and Stop hidden. Run focused tests and expect failure because `startTimer` does not accept or invoke a callback.

### Task 2: Implement completion reconciliation

**Files:**
- Modify: `js/timer.js`
- Modify: `js/app.js`

Invoke an optional completion callback after `stopTimer()`. Add one renderer helper and pass timer-specific Start/Stop selectors from all three Start handlers.

### Task 3: Update durable records

**Files:**
- Modify: `README.md`
- Modify: `SECURITY.md`
- Modify: `VISION.md`
- Modify: `AGENTS.md`
- Modify: `CHANGES.md`
- Modify: `docs/plans/2026-06-26-timer-completion-controls.md`

Document the completed-state controls, ordering, tests, runtime boundary, and validation evidence.

### Task 4: Verify and ship

Run focused tests, `npm ci`, `make check`, external-directory verification, audit, smoke where available, `git diff --check`, hosted Node/Electron gates, CodeQL, and exact-head Codex review. Merge only the exact green head.

## Result

`Timer.startTimer` now accepts an optional completion callback invoked after
interval cleanup and before notification dispatch. All three renderer timers
use it to restore Start and hide Stop at `00:00`. Focused timer, renderer, and
durable contract tests cover callback count, ordering, and each control pair.
Node 22.23.1 and Node 24.18.0 passed package verification, zero-high audits,
root `make check`, and external-directory Make verification. The host Node 18
runtime cannot install Electron 42, leaving the supported hosted smoke and
exact-head checks as the final merge gates.
