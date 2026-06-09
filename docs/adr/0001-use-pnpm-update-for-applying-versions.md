# Use `pnpm update` for applying version changes

Rather than manually editing `package.json` files and running `pnpm install`, the tool uses `pnpm update <name>@<version> -r --save-exact` to apply each Dependency update. This delegates lockfile regeneration to pnpm and — critically — respects project-level pnpm configuration such as `minimumReleaseAge`, which would be silently bypassed by manual edits. The `--save-exact` flag ensures fixed versions (no `^` or `~`) are written, consistent with the project's version pinning requirement.

## Considered Options

- **Manual `package.json` editing + `pnpm install`** — more explicit control over what is written, but bypasses pnpm's own resolution rules and requires fragile JSON string manipulation.
- **`pnpm update` (chosen)** — idiomatic, honours pnpm config, and handles all workspaces and the lockfile atomically.
