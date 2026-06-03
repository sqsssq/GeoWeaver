# Task Breakdown Guide

This guide turns an approved PRD into small, executable tasks for an AI coding agent.

The goal is not to create a long wish list. The goal is to create a sequence of small, verifiable implementation units.

## When to Use This Guide

Use this guide when:

- A PRD already exists in `/docs/prd`.
- The user asks to start implementation planning.
- The user asks to split a feature into tasks.
- The project needs a step-by-step implementation roadmap.

Do not use this guide if the product idea is still vague. In that case, use:

```txt
/docs/meta/PRD_GENERATOR.md
```

## Required Inputs

Before creating tasks, read:

```txt
/docs/prd/00-product-brief.md
/docs/prd/01-mvp-scope.md
/docs/prd/02-user-flows.md
/docs/prd/03-feature-spec.md
/docs/prd/04-data-model.md
/docs/prd/05-api-contract.md
/docs/prd/06-ui-states.md
/docs/prd/07-acceptance-criteria.md
/docs/prd/09-open-questions.md
/docs/prd/10-decision-log.md
```

If some files do not exist, note the missing files and continue only if the task can still be safely scoped.

## Output Location

Write generated tasks under:

```txt
/docs/tasks/
```

Recommended naming:

```txt
task-001-project-setup.md
task-002-data-model.md
task-003-api-contract.md
task-004-basic-ui-shell.md
task-005-core-user-flow.md
task-006-edge-states.md
task-007-polish-and-verification.md
```

## Task Size Rule

Each task should be small enough that an agent can:

1. Understand it quickly.
2. Modify a limited number of files.
3. Verify it locally.
4. Produce a reviewable diff.
5. Stop cleanly after completion.

Avoid tasks that include multiple unrelated features.

Bad task:

```txt
Build the whole dashboard, backend, auth, database, and deployment.
```

Good task:

```txt
Implement the empty/loading/error states for the assignment list page based on the approved UI state PRD.
```

## Recommended Task Order

Prefer this order unless the PRD requires otherwise:

### 1. Project foundation

Examples:

- Project setup
- Dependencies
- Folder structure
- Environment variables
- Basic routing
- Layout shell

### 2. Data model

Examples:

- Database schema
- Type definitions
- Mock data shape
- Migration files

### 3. API contract

Examples:

- Request / response types
- Route definitions
- Error format
- Validation rules

### 4. Core user flow

Examples:

- Create item
- View item
- Edit item
- Delete item
- Submit form
- Search / filter

### 5. UI states

Examples:

- Loading state
- Empty state
- Error state
- Permission state
- Success state

### 6. Verification and polish

Examples:

- Tests
- Lint
- Build
- Accessibility pass
- Edge case pass
- Documentation update

## Required Task Format

Each task must include the following sections:

```md
# Task XXX: [Title]

## Status

Not started / In progress / Blocked / Done

## Source PRD

- `/docs/prd/...`

## Goal

What this task should accomplish.

## User Value

Why this task matters to the user or product.

## Scope

What is included in this task.

## Out of Scope

What must not be included in this task.

## Files Likely to Change

Expected files or folders.

## Acceptance Criteria

Concrete, checkable criteria.

## Verification Method

Commands, tests, or manual steps used to verify the task.

## Edge Cases

Important edge cases to handle.

## Dependencies

Previous tasks or decisions required before this task.

## Notes for Agent

Implementation guidance, constraints, or warnings.
```

## Acceptance Criteria Rules

Acceptance criteria must be specific and testable.

Bad:

```txt
The page should look good.
```

Good:

```txt
When there are no assignments, the page shows an empty state with a clear message and a primary action button.
```

Bad:

```txt
The API should work.
```

Good:

```txt
POST /api/assignments returns 201 with the created assignment object when valid input is provided.
```

## Verification Rules

Every task must include at least one verification method.

Examples:

```txt
pnpm lint
pnpm typecheck
pnpm test
pnpm build
Manual check: open /assignments and verify loading, empty, and error states.
```

If no automated verification exists yet, include manual verification steps.

## Scope Control Rules

The agent must not:

- Add unrelated features.
- Modify unrelated pages.
- Introduce new dependencies without justification.
- Change API behavior without updating `/docs/prd/05-api-contract.md`.
- Change data fields without updating `/docs/prd/04-data-model.md`.
- Implement future nice-to-have features during MVP tasks.

## Blocked Task Rule

If a task depends on an unresolved decision, mark it as blocked and update:

```txt
/docs/prd/09-open-questions.md
```

If a decision is made, update:

```txt
/docs/prd/10-decision-log.md
```

## Final Output

After task breakdown, produce:

1. A task list summary.
2. Individual task files under `/docs/tasks`.
3. A recommended implementation order.
4. Any blocking open questions.
