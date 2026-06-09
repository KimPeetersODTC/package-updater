# Add `--limit=N` CLI flag to cap the number of UpdateUnits processed

Status: closed

## What to build

Add a `--limit=N` flag to the CLI so that at most N UpdateUnits are processed in a single run. The limit is applied after `scanOutdated` returns the full sorted list (patch → minor → major, then alphabetical), slicing it to the first N entries before the "Planned updates" display and the update loop. A Type Pair counts as one UpdateUnit toward the limit.

If `--limit` is omitted the tool behaves exactly as today — all UpdateUnits are processed.

## Acceptance criteria

- [ ] `--limit=N` is accepted anywhere in the argument list alongside the target path
- [ ] Only the first N UpdateUnits (in severity-then-name order) are shown in "Planned updates" and processed
- [ ] `--limit=0`, negative values, and non-integer values exit with an error message
- [ ] `--limit=N` where N exceeds the number of available UpdateUnits silently processes all of them
- [ ] An unknown `--` flag exits with an error message
- [ ] The usage string shown on missing target path is updated to include `[--limit=N]`

## Blocked by

None — can start immediately.
