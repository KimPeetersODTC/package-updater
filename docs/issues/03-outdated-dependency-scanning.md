# Issue 03 — Outdated dependency scanning

Status: closed

## Parent

`.docs/prd/01-automated-dependency-updater.md`

## What to build

Run `pnpm outdated -r -L --json` in the Target Project, parse the output into a structured list of Dependency update records, sort them patch → minor → major, and group Type Pairs (`foo` + `@types/foo`) into single update units. Print the planned update list to stdout. If nothing is outdated, exit cleanly with an informational message and no report entry.

## Acceptance criteria

- [ ] Runs `pnpm outdated -r -L --json` in the Target Project directory
- [ ] Parses output into records containing: dependency name, current version, latest version, affected Workspaces, and update severity (patch / minor / major)
- [ ] Sorts records ascending by severity: patch → minor → major
- [ ] Groups a Dependency and its `@types/` counterpart into a single Type Pair update unit when both are present
- [ ] Treats a standalone `@types/` Dependency as its own update unit when its base package is not outdated
- [ ] Prints the planned update list (name, severity, old → new version) to stdout
- [ ] Exits cleanly with an informational message when no outdated dependencies are found
- [ ] Respects the `exclude` list from config — excluded dependencies do not appear in the update list
- [ ] `outdated-scanner` parsing and sorting logic is covered by unit tests (shell invocation mocked)

## Blocked by

- Issue 02 — Config loading + workspace discovery
