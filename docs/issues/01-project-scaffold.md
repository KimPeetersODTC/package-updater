# Issue 01 — Project scaffold

Status: closed

## Parent

`.docs/prd/01-automated-dependency-updater.md`

## What to build

Set up the TypeScript project structure for `package-updater`. The tool should be executable via `tsx src/index.ts /path/to/monorepo`. The entry point should validate that the positional argument is provided and points to an existing directory, exiting with a clear error message if not. No logic beyond that.

## Acceptance criteria

- [ ] `package.json` with `tsx` and `typescript` as dependencies, and a `start` script
- [ ] `tsconfig.json` configured for modern TypeScript
- [ ] `src/index.ts` accepts a single positional argument (target project path)
- [ ] Exits with a descriptive error if no argument is provided
- [ ] Exits with a descriptive error if the given path does not exist or is not a directory
- [ ] Running `tsx src/index.ts /valid/path` completes without error

## Blocked by

None — can start immediately.
