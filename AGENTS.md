# Agent Instructions

## Core rule: no changes without explicit permission

**Never make changes to the codebase without explicit permission from the user.**

This applies after any planning session, grilling session, or analysis — even if a clear action plan has been agreed upon. The expected workflow is:

1. Discuss / grill the plan with the user.
2. Use the `/to-issues` skill to turn the agreed plan into issues.
3. Wait for the user to explicitly ask you to implement a specific issue or change.

Do **not** start implementing immediately after a grilling or planning session ends.

## Agent skills

### Issue tracker

Issues live as local markdown files under `docs/issues/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five default triage role strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repo — one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
