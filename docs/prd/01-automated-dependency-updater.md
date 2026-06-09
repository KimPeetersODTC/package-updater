# PRD 01 — Automated Dependency Updater

## Problem Statement

Keeping dependencies up to date in a pnpm monorepo is a slow, error-prone manual process. Developers must discover outdated dependencies, update each one across all workspaces, verify nothing broke, and commit the result — all by hand. Doing this rigorously (one dependency at a time, with tests, in severity order) takes too long to do consistently, so updates get batched or skipped, leading to larger and riskier upgrades over time.

## Solution

A TypeScript CLI tool (`package-updater`) that fully automates the dependency update cycle for a pnpm monorepo. Given a target project directory, it discovers all outdated dependencies, updates each one atomically across all workspaces (patch → minor → major), runs configured validation commands, commits successes, reverts failures, and appends a report. It requires no human interaction once started.

## User Stories

1. As a developer, I want to run a single command pointing at my monorepo, so that the update process starts without any further input from me.
2. As a developer, I want the tool to read `pnpm-workspace.yaml` to discover all workspaces, so that no workspace is accidentally skipped.
3. As a developer, I want the tool to discover all outdated dependencies using `pnpm outdated -r -L`, so that the list reflects the actual state of my monorepo.
4. As a developer, I want dependencies processed in ascending severity order (patch → minor → major), so that the safest updates are committed first and riskier ones are attempted last.
5. As a developer, I want each dependency updated across all workspaces and the root simultaneously, so that versions are always consistent across the monorepo.
6. As a developer, I want versions written without a caret or tilde prefix, so that all dependency versions are pinned and deterministic.
7. As a developer, I want `@types/` packages updated together with their base package as a single unit, so that type definitions never drift out of sync with their runtime counterpart.
8. As a developer, I want `@types/` packages that are outdated independently (when their base package is not) to be updated on their own, so that stale type definitions are still caught.
9. As a developer, I want the tool to run my configured validation commands after each update, so that I know whether the update is safe before it is committed.
10. As a developer, I want to configure validation commands in a `package-updater.config.json` file in my target project, so that each project can define its own quality gates.
11. As a developer, I want to configure an `exclude` list of dependency names in `package-updater.config.json`, so that I can permanently skip dependencies I know are problematic.
12. As a developer, I want any non-zero exit code from a validation command to count as a failure, so that the tool is conservative and does not commit broken states.
13. As a developer, I want the tool to revert all changes via `git checkout -- .` when a validation failure occurs, so that the working tree is always clean before the next update is attempted.
14. As a developer, I want the tool to continue to the next dependency after a failure, so that one bad update does not block the rest of the run.
15. As a developer, I want each successful update committed immediately on the current branch, so that partial progress is never lost if the run is interrupted.
16. As a developer, I want commit messages in the format `Package updates: <name> <oldVersion> → <newVersion>`, so that the git history is self-explanatory.
17. As a developer, I want the `update-report.md` committed once at the end of the run in its own commit, so that each dependency commit remains atomic and clean.
18. As a developer, I want the tool to append a timestamped section to `update-report.md` after each run, so that I have a persistent history of all update runs.
19. As a developer, I want one line per dependency in the report, showing status (✅/❌), dependency name, old version, new version, and affected workspaces, so that I can quickly scan what changed.
20. As a developer, I want the tool to exit cleanly without appending to the report when there are no outdated dependencies, so that the report only contains meaningful entries.
21. As a developer, I want `update-report.md` created automatically on the first run if it does not exist, so that no manual setup is required.
22. As a developer, I want the tool invoked as `tsx src/index.ts /path/to/monorepo`, so that the target project is a simple positional argument.

## Implementation Decisions

### Modules

- **`config-loader`** — Reads and validates `package-updater.config.json` from the target project root. Returns a typed config object with `validationCommands` and `exclude`. Fails fast with a clear error if the file is missing or malformed.

- **`workspace-discovery`** — Parses `pnpm-workspace.yaml` to resolve all workspace `package.json` paths, plus the root `package.json`. Returns an ordered list of absolute paths.

- **`outdated-scanner`** — Runs `pnpm outdated -r -L --json` in the target project directory, parses the JSON output into a flat list of outdated Dependency records (name, current version, latest version, affected workspaces, update severity). Sorts the list patch → minor → major. Groups Type Pairs (a Dependency and its `@types/` counterpart) into single update units.

- **`dependency-updater`** — Applies a single update unit using `pnpm update <name>@<version> -r --save-exact`. For Type Pairs, runs two sequential `pnpm update` calls. Returns the set of files modified.

- **`validator`** — Executes each configured validation command in the target project directory in sequence. Stops on the first non-zero exit code and returns failure with the command output. Returns success if all commands pass.

- **`git-operations`** — Wraps three operations: (1) commit a set of files with a given message, (2) revert all changes via `git checkout -- .`, (3) commit `update-report.md`. All operations run in the target project directory.

- **`report-writer`** — Appends a timestamped run section to `update-report.md`. Accepts a list of result records and formats them as a Markdown table. Creates the file if it does not exist.

- **`orchestrator`** — The main loop. Wires all modules together: load config → discover workspaces → scan outdated → for each update unit: update → validate → commit or revert → record result → write report → commit report.

### Key Technical Decisions

- **Update mechanism**: `pnpm update <name>@<version> -r --save-exact` is used instead of manual `package.json` editing. This respects project-level pnpm configuration (including `minimumReleaseAge`) and handles lockfile regeneration atomically. See ADR `0001-use-pnpm-update-for-applying-versions.md`.

- **Version pinning**: Only the versions of dependencies being updated in the current cycle are written as fixed versions. Existing `^`/`~` prefixes on other dependencies are left untouched to avoid unintentional downgrades.

- **Type Pair grouping**: A Dependency and its `@types/` counterpart are treated as a single update unit and committed together. If only the `@types/` package is outdated, it is updated independently.

- **Commit strategy**: One commit per successful update unit (dependency files + `pnpm-lock.yaml`). A final separate commit contains only `update-report.md`.

- **Failure handling**: Any non-zero exit from a validation command triggers `git checkout -- .`, the dependency is recorded as failed, and the loop continues.

- **Report format**: `update-report.md` is appended (not overwritten) on each run. A run with no outdated dependencies produces no report entry.

## Testing Decisions

**What makes a good test**: Tests should exercise the observable output of a module given controlled inputs — not internal implementation steps. Mock the filesystem and shell where needed, but assert on what the module returns or writes, not how it does it.

**Modules to test**:

- **`config-loader`** — Test that valid configs are parsed correctly, that missing files produce a clear error, and that invalid shapes are rejected.
- **`outdated-scanner`** (parsing and sorting logic) — Test that raw `pnpm outdated` JSON output is correctly parsed into Dependency records, that sorting is correct (patch before minor before major), and that Type Pairs are correctly grouped. Shell invocation can be mocked.
- **`dependency-updater`** (Type Pair logic) — Test that a single Dependency triggers one `pnpm update` call, and that a Type Pair triggers two calls with the correct arguments.
- **`report-writer`** — Test that the output Markdown is correctly formatted, that multiple runs append correctly, and that the file is created on first run.
- **`validator`** — Test that a zero exit code returns success, that a non-zero exit code returns failure with output, and that execution stops after the first failure.

**Prior art**: None — this is a greenfield project.

## Out of Scope

- Dry-run mode (no `--dry-run` flag; the tool always applies changes)
- Normalising `^`/`~` prefixes on dependencies not being updated in the current run
- Support for package managers other than pnpm
- Support for multiple target projects in a single invocation
- Automatic branch creation or pull request creation
- Scheduling or CI integration (the tool is invoked manually)
- Interactive mode or prompts of any kind

## Further Notes

- The tool is invoked as `tsx src/index.ts /path/to/monorepo` and reads its config from `package-updater.config.json` in that directory.
- Commits are made on whatever branch the target project is currently on — no branch management is performed.
- The domain glossary is maintained in `CONTEXT.md` at the project root. Key terms: **Dependency** (an external npm package updated as a unit), **Workspace** (a single app/lib in the monorepo), **Target Project** (the monorepo being updated), **Type Pair** (a dependency + its `@types/` counterpart), **Validation** (configured commands run after each update), **Revert** (`git checkout -- .`).
