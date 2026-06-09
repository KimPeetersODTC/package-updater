# Commit Submodule Workspaces before parent Commit

Status: closed

## What to build

When a Dependency update touches a Submodule Workspace, commit the changes inside that submodule first (using the same commit message as the parent Commit), then include the submodule pointer entry in the parent Commit alongside `pnpm-lock.yaml`. This requires extending the modified-files detection to recognise submodule pointer entries (which appear as bare directory paths in `git status --porcelain` output) by matching them against the known set of Submodule Workspace paths.

## Acceptance criteria

- [ ] After a successful Update, each affected Submodule Workspace is committed first, in the submodule's own git repo, using the same message as the parent Commit
- [ ] The parent Commit includes the submodule pointer path(s) alongside `pnpm-lock.yaml` and any root-level `package.json` changes
- [ ] Submodule pointer entries are identified by matching `git status --porcelain` output against known Submodule Workspace paths
- [ ] If no Submodule Workspaces are affected, the commit flow is identical to the current implementation
- [ ] If a Dependency update touches multiple Submodule Workspaces, each gets its own commit before the parent Commit
- [ ] Unit tests cover: no submodules, one affected submodule, multiple affected submodules, unaffected submodule (not committed)

## Blocked by

- `docs/issues/08-detect-submodule-workspaces.md`
- `docs/issues/09-revert-submodule-workspaces.md`
