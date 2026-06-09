# Issue 04 — Single dependency update — happy path

Status: closed

## Parent

`.docs/prd/01-automated-dependency-updater.md`

## What to build

Apply a single Dependency update end-to-end: run `pnpm update <name>@<version> -r --save-exact`, execute each configured validation command in sequence, and commit the result on success. This slice covers the happy path only (validation passes). The commit message must follow the format `Package updates: <name> <oldVersion> → <newVersion>`. Written versions must be fixed (no `^` or `~` prefix).

## Acceptance criteria

- [ ] Applies the update using `pnpm update <name>@<version> -r --save-exact`
- [ ] Runs each configured validation command in sequence after the update
- [ ] Stops validation at the first non-zero exit code (failure handled in Issue 05)
- [ ] On success, stages all modified `package.json` files and `pnpm-lock.yaml` and creates a commit
- [ ] Commit message format: `Package updates: <name> <oldVersion> → <newVersion>`
- [ ] Updated versions in `package.json` files are written without `^` or `~`
- [ ] Versions of other (non-updated) dependencies in `package.json` files are not modified
- [ ] `validator` module is covered by unit tests (zero exit = success, non-zero = failure with output)

## Blocked by

- Issue 03 — Outdated dependency scanning
