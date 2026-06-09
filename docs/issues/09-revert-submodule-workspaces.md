# Revert changes in Submodule Workspaces

Status: closed

## What to build

Extend the Revert operation so that when a Failure occurs, uncommitted changes are discarded inside each Submodule Workspace before the parent root is reverted. Each submodule's dirty state is checked first (via `git status --porcelain` inside it); only dirty submodules are touched. The parent `git checkout -- .` follows as today.

## Acceptance criteria

- [ ] On Revert, `git checkout -- .` is run inside each Submodule Workspace that has uncommitted changes
- [ ] Clean submodules are not touched
- [ ] The parent root revert runs after all submodule reverts, as today
- [ ] If there are no Submodule Workspaces, behaviour is identical to the current implementation
- [ ] Unit tests cover: no submodules, one dirty submodule, one clean submodule (skipped), multiple submodules mixed

## Blocked by

- `docs/issues/08-detect-submodule-workspaces.md`
