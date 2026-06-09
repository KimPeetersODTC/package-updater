# Apply grouped updates end-to-end

Status: closed

## What to build

Wire the multi-member `UpdateUnit` through the dependency updater and commit message formatter. When a unit has multiple members, `applyUpdate` runs `pnpm update` for each member in sequence. The commit message lists all updated members: `Package updates: packageA 1.0.0 → 1.1.0, packageB 2.0.0 → 2.1.0`.

The report writer requires no changes — it already writes one line per Dependency; the caller loops over members.

## Acceptance criteria

- [ ] `applyUpdate` updates every member in the `UpdateUnit` (not just the first)
- [ ] Commit message lists all members with their old and new versions, comma-separated
- [ ] Single-member units produce the same commit message format as today
- [ ] A Failure during any member's update triggers a Revert of the whole unit
- [ ] All existing dependency-updater and git-operations tests continue to pass
- [ ] New tests cover: two-member commit message, failure mid-group triggers full revert

## Blocked by

- `docs/issues/13-scanner-update-group-merging.md`
