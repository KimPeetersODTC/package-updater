# Issue 07 — Full orchestration loop + report

Status: closed

## Parent

`.docs/prd/01-automated-dependency-updater.md`

## What to build

Wire all modules into a complete end-to-end run: loop through all update units in severity order, apply each update, handle success and failure, then write a timestamped `update-report.md` and commit it as the final commit. This is the slice that makes the tool fully operational.

## Acceptance criteria

- [ ] All Dependency update units are processed in order (patch → minor → major)
- [ ] Each successful update is committed before the next update begins
- [ ] Each failed update is reverted and recorded before the next update begins
- [ ] After all updates are processed, `update-report.md` is written (or appended if it exists)
- [ ] Each run section in `update-report.md` starts with a timestamp heading: `# Updates report YYYY-MM-DD HH:MM:SS`
- [ ] Each Dependency appears as one line: status (✅/❌), name, old version, new version, affected Workspaces
- [ ] `update-report.md` is committed in a final standalone commit after all Dependency commits
- [ ] `update-report.md` is created automatically on the first run if it does not exist
- [ ] The tool exits cleanly (no report written, no commit made) when `pnpm outdated` finds nothing
- [ ] `report-writer` formatting and append logic is covered by unit tests

## Blocked by

- Issue 05 — Failure handling + revert
- Issue 06 — Type Pair update support
