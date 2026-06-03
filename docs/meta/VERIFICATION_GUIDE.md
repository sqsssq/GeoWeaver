# Verification Guide

This guide defines how to verify implementation work before handoff, review, and commit.

The goal is to make every task checkable, reproducible, and safe to review.

## When to Use This Guide

Use this guide after implementing a task and before asking for human approval.

Use it for:

- Feature implementation
- Bug fixes
- Refactors
- API changes
- Data model changes
- UI changes
- Documentation changes that affect developer workflow

For very small copy edits, manual verification may be enough. Still document what was checked.

## Verification Levels

Use three levels of verification when applicable:

1. Static verification
2. Automated test verification
3. Manual product verification

Not every project supports all levels. If a level is unavailable, state that clearly in the handoff summary.

## Level 1: Static Verification

Static verification checks whether the code is structurally valid.

Common commands:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

Depending on the project, equivalent commands may be:

```bash
npm run lint
npm run typecheck
npm run build
```

or:

```bash
yarn lint
yarn typecheck
yarn build
```

or:

```bash
bun run lint
bun run typecheck
bun run build
```

## Level 2: Automated Tests

Run tests when the project has a test framework.

Common commands:

```bash
pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:e2e
```

If a task changes business logic, API behavior, validation, or data transformation, automated tests are strongly preferred.

If no test framework exists, document manual verification steps instead.

## Level 3: Manual Product Verification

Manual verification should map directly to the task acceptance criteria.

For UI tasks, check:

- Happy path
- Loading state
- Empty state
- Error state
- Disabled state
- Form validation
- Responsive layout
- Keyboard and screen-reader basics when relevant

For API tasks, check:

- Valid request
- Invalid request
- Unauthorized request if applicable
- Not found case if applicable
- Expected status codes
- Expected response shape
- Error response shape

For data model tasks, check:

- Schema or type changes
- Migration behavior if applicable
- Seed or mock data updates
- Backward compatibility if applicable

## Project-Level Verification Script

If available, use:

```bash
bash scripts/verify.sh
```

This script should detect the package manager and run common verification commands if they exist in `package.json`.

The script should not invent commands. It should only run scripts that are already defined by the project.

## Recommended Verification Order

Use this order when applicable:

1. Install dependencies if needed.
2. Run lint.
3. Run typecheck.
4. Run tests.
5. Run build.
6. Run task-specific manual checks.

Example:

```bash
bash scripts/verify.sh
```

Then manually check the specific user flow described in the task.

## Handling Failed Verification

If verification fails:

1. Identify the failed command.
2. Read the relevant error.
3. Determine whether the failure is related to the current task.
4. Fix task-related failures if possible.
5. Re-run the relevant command.
6. Report any remaining failures clearly.

Do not claim verification passed if any required command failed.

Use this format in the handoff summary:

```md
### Verification Performed

- `pnpm lint` — passed
- `pnpm typecheck` — failed
  - Error: ...
  - Status: unresolved
  - Related to this task: yes / no / unclear
- `pnpm build` — not run because typecheck failed
```

## Handling Missing Commands

If a command does not exist, do not treat it as a failure.

Instead, report:

```md
- `pnpm test` — not available in this project
```

If no automated verification is available, provide manual verification steps.

## Verification by Task Type

### UI Feature

Minimum checks:

- Lint
- Typecheck
- Build
- Manual happy path
- Manual loading / empty / error states when applicable
- Responsive check for key viewport sizes if applicable

### API Feature

Minimum checks:

- Typecheck
- Tests if available
- Manual or automated request checks
- Valid and invalid input checks
- Error response checks

### Data Model Change

Minimum checks:

- Typecheck
- Migration or schema validation if available
- Seed/mock data check if applicable
- API or UI compatibility check

### Bug Fix

Minimum checks:

- Reproduce the original bug if possible
- Confirm the bug no longer occurs
- Add regression test if the project has tests
- Run relevant verification command

### Refactor

Minimum checks:

- Lint
- Typecheck
- Tests
- Build
- Confirm no intended behavior changed

### Documentation-Only Change

Minimum checks:

- Read the changed document for consistency
- Confirm paths and commands are accurate
- Confirm no broken references if possible

## Manual Verification Template

Use this template when reporting manual checks:

```md
### Manual Verification

Environment:

- Local dev server: `pnpm dev`
- Browser: Chrome / Safari / Firefox
- Route: `/example`

Steps:

1. Open `/example`.
2. Perform the main user action.
3. Confirm the expected result.
4. Trigger empty or error state if applicable.
5. Confirm the UI matches the PRD acceptance criteria.

Result:

- Passed / Failed / Partially passed
```

## Handoff Verification Summary

Every implementation handoff should include:

```md
## Verification Summary

### Commands Run

- `...` — passed / failed / not available

### Manual Checks

- ...

### Unverified Areas

- ...

### Known Issues

- ...
```

## CI Verification

If the repository uses GitHub Actions or another CI system, local verification should align with CI as much as possible.

Prefer keeping CI and local verification commands consistent.

For example:

```txt
Local: bash scripts/verify.sh
CI:    bash scripts/verify.sh
```

This reduces the chance that local checks pass but CI fails because the two paths run different commands.

## Verification Philosophy

Verification is not only about passing commands.

Good verification answers these questions:

- Does the code run?
- Does it match the PRD?
- Does it satisfy the task acceptance criteria?
- Does it handle important edge cases?
- Is the diff safe for a human to review?
- Are remaining risks clearly documented?
