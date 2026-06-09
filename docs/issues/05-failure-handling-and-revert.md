# Issue 05 — Failure handling + revert

Status: closed

## Parent

`.docs/prd/01-automated-dependency-updater.md`

## What to build

When a validation command exits with a non-zero code, revert all changes in the Target Project and continue to the next Dependency. The working tree must be clean before the next update attempt. The failed Dependency is recorded for the report but no commit is made.

## Acceptance criteria

- [ ] A non-zero exit code from any validation command triggers a revert
- [ ] Revert is performed via `git checkout -- .` in the Target Project directory
- [ ] The working tree is clean after revert (verified by checking git status)
- [ ] The failed Dependency is recorded with its name, attempted version change, and the failing command's output
- [ ] The run continues with the next Dependency after a revert — it does not abort
- [ ] Multiple failures in a single run are all recorded independently
- [ ] `git-operations` revert behaviour is covered by unit tests

## Blocked by

- Issue 04 — Single dependency update — happy path
