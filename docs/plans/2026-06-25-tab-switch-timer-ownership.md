---
title: Tab Switch Timer Ownership
date: 2026-06-25
type: implementation-plan
status: completed
---

# Tab Switch Timer Ownership

## Summary

Stop hidden countdown ownership whenever the user enters a valid timer tab,
then reset and reconcile the destination controls before further interaction.

## Problem Frame

The renderer previously reset only the destination timer. A countdown started
on another tab retained its interval while hidden and could notify during a
different work/break mode. Returning to a reset tab could also leave its Stop
button visible even though no interval remained active.

## Requirements

- R1. Keep explicit ownership metadata for Pomodoro, short-break, and
  long-break tabs.
- R2. Stop every non-destination timer on a valid tab transition.
- R3. Reset the destination timer and restore destination controls to Start
  visible and Stop hidden.
- R4. Keep unknown tab hashes as no-ops.
- R5. Preserve timer arithmetic, notifications, external links, close IPC, and
  Electron lifecycle behavior.
- R6. Add mutation-sensitive source, fixture, guidance, and plan contracts.

## Key Technical Decisions

- Use one explicit tab-to-timer mapping instead of parallel conditionals.
- Treat each valid tab transition as exclusive interval ownership.
- Let `resetTimer()` settle the destination interval; call `stopTimer()` only
  for the other timer owners.
- Reconcile only the destination controls; inactive controls are hidden with
  their tabs and normalize when selected.

## Verification Completed

- The pre-fix focused renderer regression failed because the hidden normal
  timer remained owned after entering the short-break tab.
- The focused renderer wiring test passed with hidden countdown shutdown and
  destination controls restored.
- Six isolated hostile mutations were rejected across explicit tab metadata,
  unknown-tab guarding, non-active timer shutdown, destination reset, control
  reconciliation, and executable regression coverage.
- Repository and external-directory `make check` passed on Node 22 and Node 24.
- `npm audit` reported zero vulnerabilities and `npm pack --dry-run --json`
  preserved the intended package surface.
- Exact diff review, hosted Node 22/24 checks, Electron smoke, and exact-head
  Codex review remain required before merge.
