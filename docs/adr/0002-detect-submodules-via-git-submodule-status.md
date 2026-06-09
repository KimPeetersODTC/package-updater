# Detect Submodule Workspaces via `git submodule status`

To identify which Workspaces are Submodule Workspaces, the tool runs `git submodule status` in the Target Project root and matches the reported paths against discovered Workspace paths. This deliberately excludes uninitialised submodules: an uninitialised submodule has no checked-out content, so its `package.json` would not exist and pnpm would never update files there. Attempting to commit inside an uninitialised submodule would also fail.

## Considered Options

- **Parse `.gitmodules` directly** — lists all declared submodules regardless of init state, which would include submodules the user hasn't initialised and that pnpm cannot affect. Requires extra filtering to avoid false positives.
- **`git submodule status` (chosen)** — only reports initialised submodules, matching exactly the set where package changes can actually occur and git commits can be made.
