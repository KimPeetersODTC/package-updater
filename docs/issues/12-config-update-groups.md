# Extend Config with `updateGroups`

Status: closed

## What to build

Add an optional `updateGroups` field to the `Config` type and `loadConfig`. The field is an array of arrays of Dependency names, where each inner array defines an Update Group — a set of Dependencies that must be updated together in a single Update and Commit.

Validation rules:
- Each element must be an array of strings.
- If the same Dependency name appears in more than one group, emit a startup warning and keep only its first occurrence (subsequent groups that reference it are left intact but that member is treated as if it belongs to the first group).

Backwards-compatible: `updateGroups` is optional and defaults to an empty array when absent.

## Acceptance criteria

- [ ] `Config` type includes `updateGroups: string[][]`
- [ ] `loadConfig` parses and validates `updateGroups` (must be array of string arrays)
- [ ] `loadConfig` throws a clear error when `updateGroups` is present but malformed
- [ ] A Dependency appearing in more than one group triggers a logged warning; first group wins
- [ ] Omitting `updateGroups` from the config file is valid (defaults to `[]`)
- [ ] All existing config tests continue to pass
- [ ] New tests cover: valid groups, malformed groups, duplicate membership warning

## Blocked by

None — can start immediately.
