# Detect Submodule Workspaces at startup

Status: closed

## What to build

Add a function that discovers which Workspaces are Submodule Workspaces by running `git submodule status` in the Target Project root and matching the returned paths against the discovered Workspace paths. Only initialised submodules are included — uninitialised ones cannot have package changes applied and cannot be committed into. The result is passed through to the rest of the run so commit and revert logic can act on it.

## Acceptance criteria

- [ ] `git submodule status` is run once at startup in the Target Project root
- [ ] Only initialised submodule paths (those not prefixed with `-` in the output) are returned
- [ ] The returned paths are matched against discovered Workspace paths to identify Submodule Workspaces
- [ ] If the Target Project has no submodules, the result is an empty set and the rest of the run is unaffected
- [ ] Unit tests cover: no submodules, one initialised submodule, one uninitialised submodule (excluded), mixed

## Blocked by

None — can start immediately.
