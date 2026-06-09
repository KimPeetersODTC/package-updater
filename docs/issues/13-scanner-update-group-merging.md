# Grouping logic in the Outdated Scanner

Status: closed

## What to build

After `scanOutdated` builds individual `UpdateUnit`s, merge units whose Dependencies belong to the same configured Update Group into a single `UpdateUnit`. Extend the `UpdateUnit` type to natively support multiple members (replacing the current single `typesName`/`typesLatest` pair with a general members list).

Behaviour to implement:
- Only outdated members are included in the merged unit; members that are already current are omitted.
- If a member is in `exclude`, that member is skipped; the rest of the group still updates together.
- If a group member has a Type Pair (`@types/foo`), the types package is pulled in automatically as an additional member.
- Severity of the merged unit is the max severity across all included members.
- Workspaces of the merged unit is the union of all included members' workspaces.
- `updateGroups` is passed into `scanOutdated` alongside `exclude`.

## Acceptance criteria

- [ ] `UpdateUnit` type supports multiple members (name, current, latest per member)
- [ ] Type Pair auto-detection still works via the new members structure
- [ ] Two Dependencies in the same Update Group produce a single `UpdateUnit`
- [ ] Members that are not outdated are omitted from the merged unit
- [ ] Members in `exclude` are omitted from the merged unit; remaining members still form a unit
- [ ] Group member's Type Pair is pulled into the unit automatically
- [ ] Severity is the max across all included members
- [ ] Workspaces is the union across all included members
- [ ] Sort order (patch → minor → major, then name) is preserved
- [ ] All existing scanner tests continue to pass
- [ ] New tests cover: two-member group, partial outdated, excluded member, Type Pair on group member

## Blocked by

- `docs/issues/12-config-update-groups.md`
