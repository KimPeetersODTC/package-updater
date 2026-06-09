# Issue 06 — Type Pair update support

Status: closed

## Parent

`.docs/prd/01-automated-dependency-updater.md`

## What to build

When a Dependency and its `@types/` counterpart are both outdated, update them together as a single Type Pair unit: two sequential `pnpm update` calls, one validation run, and one commit covering both. The commit message should list both package names. When only the `@types/` package is outdated, it is treated as a standalone update.

## Acceptance criteria

- [ ] A Type Pair (e.g. `node` + `@types/node`) is updated in two sequential `pnpm update --save-exact` calls within the same update unit
- [ ] Validation runs once after both updates are applied (not between them)
- [ ] On success, both packages' changes are committed together in a single commit
- [ ] Commit message lists both packages: `Package updates: <name> + @types/<name> <oldVersion> → <newVersion>`
- [ ] A standalone `@types/` Dependency (base package not outdated) is updated as a normal single-package update
- [ ] On failure of a Type Pair, `git checkout -- .` reverts changes from both `pnpm update` calls
- [ ] `dependency-updater` Type Pair logic is covered by unit tests

## Blocked by

- Issue 04 — Single dependency update — happy path
