# Package Updater

A CLI tool written in TypeScript, executed with `tsx`, that automatically updates external npm dependencies across all workspaces in a pnpm monorepo, runs checks after each update, and commits or reverts the result.

## Language

**Dependency**:
An external npm package (identified by name) that appears in one or more workspace `package.json` files. The update cycle operates on one Dependency at a time, updating it across all workspaces and the root simultaneously.
_Avoid_: package (too ambiguous in a monorepo context), library, module

**Workspace**:
A single app or library within the monorepo, declared in `pnpm-workspace.yaml` and containing its own `package.json`.
_Avoid_: package, project, subpackage

**Submodule Workspace**:
A Workspace whose directory is a git submodule of the Target Project (i.e. it appears in `git submodule status` output). Changes to its files are tracked by the submodule's own git repo, not the parent. When a Dependency update touches a Submodule Workspace, the submodule is committed first, then the parent Commit includes the updated submodule pointer.
_Avoid_: submodule, nested repo

**Update Severity**:
The semver bump type of a Dependency update: `patch`, `minor`, or `major`. Dependencies are processed in ascending severity order (patch first, major last).
_Avoid_: priority, risk level

**Type Pair**:
A Dependency and its corresponding `@types/` package (e.g., `node` and `@types/node`). A Type Pair is a special case of an Update Group, auto-detected rather than configured.
_Avoid_: types package, type definition

**Update Group**:
A set of two or more Dependencies that must be updated together in a single Update and Commit. Configured explicitly in Config via `updateGroups`. Only the outdated members are actually updated; members that are already current are skipped. If a member also has a Type Pair, the types package is pulled in automatically. If the same Dependency appears in more than one configured Update Group, the first group wins and a warning is emitted at startup. If a member is in `exclude`, only that member is skipped; the remaining outdated members are still updated together.
_Avoid_: linked packages, coupled dependencies, package group

**Report**:
A Markdown file (`update-report.md`) in the Target Project root, appended to after each run. Each run adds a timestamped heading followed by one line per Dependency showing status (success/failure), dependency name, old version, new version, and affected Workspaces.
_Avoid_: log, output, summary

**Commit**:
A git commit made to the current branch of the Target Project after a Dependency is successfully validated. Contains all modified `package.json` files, `pnpm-lock.yaml`, and any Submodule Workspace pointer updates. When Submodule Workspaces are affected, each submodule is committed first (same message), then the parent Commit follows. Message format: `Package updates: <name> <oldVersion> → <newVersion>`. A final separate Commit at the end of the run contains only `update-report.md`.
_Avoid_: save, push, checkpoint

**Update**:
The act of applying a new version of a Dependency across all Workspaces using `pnpm update <name>@<version> -r --save-exact`. This regenerates `pnpm-lock.yaml` and respects pnpm project configuration such as `minimumReleaseAge`.
_Avoid_: upgrade, bump, install

**Config**:
A `package-updater.config.json` file in the Target Project root. Contains `validationCommands` (list of shell commands to run after each Update), `exclude` (list of Dependency names to never update), and `updateGroups` (list of Update Groups, each a list of Dependency names).
_Avoid_: settings, options, configuration file

## Relationships

- A **Dependency** may appear in one or more **Workspaces**
- When a **Dependency** is updated, it is updated to the same fixed version across all **Workspaces** and the root

**Validation**:
The set of commands run against the target project after a Dependency is updated, to determine whether the update is safe to keep. Configured in `package-updater.config.json` in the target project directory.
_Avoid_: checks, verification, CI

**Target Project**:
The monorepo directory the tool is invoked against. Contains `pnpm-workspace.yaml`, a root `package.json`, and a `package-updater.config.json`.
_Avoid_: repo, project root

**Failure**:
Any non-zero exit code from a Validation command. Triggers a Revert of the current Dependency update; the run continues with the next Dependency.
_Avoid_: error, broken, invalid

**Revert**:
Discarding all uncommitted changes after a Failure, restoring the Target Project to its pre-update state. For Submodule Workspaces, `git checkout -- .` is run inside each dirty submodule first, then in the Target Project root.
_Avoid_: rollback, undo, git revert

## Flagged ambiguities

- "package" was used to mean both a **Workspace** and a **Dependency** — resolved: these are distinct concepts.
