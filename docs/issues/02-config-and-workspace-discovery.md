# Issue 02 — Config loading + workspace discovery

Status: closed

## Parent

`.docs/prd/01-automated-dependency-updater.md`

## What to build

Load `package-updater.config.json` from the Target Project root and parse `pnpm-workspace.yaml` to discover all Workspaces. Print a summary to stdout so the result is immediately verifiable. Fail fast with clear, actionable error messages if either file is missing or malformed.

## Acceptance criteria

- [ ] Reads and validates `package-updater.config.json`; fails fast if missing or malformed
- [ ] Parsed config exposes `validationCommands` (string array) and `exclude` (string array)
- [ ] Reads `pnpm-workspace.yaml` and resolves all matching workspace `package.json` paths plus the root `package.json`
- [ ] Prints a summary listing all discovered Workspaces and the configured validation commands
- [ ] Exits with a descriptive error if `pnpm-workspace.yaml` is missing
- [ ] `config-loader` and `workspace-discovery` modules are covered by unit tests

## Blocked by

- Issue 01 — Project scaffold
