# Skip non-semver entries from pnpm outdated output

Status: closed

## Problem

Running `pnpm start ../OF-develop` crashed with:

```
Error: Cannot read properties of undefined (reading 'split')
```

`pnpm outdated --json` can return entries for packages installed via a tarball URL (e.g. `@react-icons/all-files`). These entries have a tarball URL as `current` and `null`/absent `latest`. The `calcSeverity` function in `outdated-scanner.ts` called `latest.split(".")` unconditionally, throwing when `latest` was `undefined`.

## Fix

Added a guard in `scanOutdated` to skip entries where `current` or `latest` is not a string. Such packages have no meaningful semver range and cannot be updated through the normal flow.

```ts
if (typeof entry.current !== "string" || typeof entry.latest !== "string") continue;
```

## Comments

Fixed in place — no new tests required as the existing suite (122 tests) continued to pass.
