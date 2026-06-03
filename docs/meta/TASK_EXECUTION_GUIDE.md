# Task Execution Guide

This guide defines how an AI coding agent should execute one implementation task after the PRD and task breakdown already exist.

The goal is to keep implementation small, scoped, verifiable, and easy for a human to review.

## When to Use This Guide

Use this guide when:

- A task file exists under `/docs/tasks/`.
- The user asks the agent to implement one task.
- The user asks the agent to continue from the task breakdown.
- The task is medium or large enough that direct implementation could cause scope creep.

Do not use this guide as a replacement for the PRD. If the task is vague or not covered by the PRD, stop and update the PRD or task file first.

## Required Inputs

Before implementation, read the task file and all referenced PRD files.

Typical inputs:

```txt
/docs/tasks/task-XXX-name.md
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

If a referenced PRD file is missing, mention it in the execution brief and continue only if the task can still be implemented safely.

## Execution Flow

For each task, follow this sequence:

1. Read the task file.
2. Read the relevant PRD files.
3. Restate the task scope.
4. Restate what is out of scope.
5. Identify files likely to change.
6. Check for blockers or open questions.
7. Implement the smallest complete slice.
8. Update or add tests when appropriate.
9. Run verification.
10. Summarize changes and verification results.
11. Stop before commit unless the user explicitly approves committing.

## Before Implementation: Execution Brief

Before changing code, produce a short execution brief.

Use this format:

```md
## Execution Brief

### Task

`/docs/tasks/task-XXX-name.md`

### Source PRD

- `/docs/prd/...`

### Scope

This task will:

- ...
- ...

### Out of Scope

This task will not:

- ...
- ...

### Files Likely to Change

- `path/to/file`
- `path/to/folder`

### Blockers / Open Questions

- None.
```

If there are blockers, do not implement until the blocker is resolved or the user explicitly asks for a best-effort implementation.

## Scope Control Rules

The agent must not silently expand the task.

Do not:

- Add unrelated features.
- Redesign unrelated UI.
- Refactor large areas without direct need.
- Add new routes not covered by the PRD.
- Add new database fields without updating `/docs/prd/04-data-model.md`.
- Add or change API behavior without updating `/docs/prd/05-api-contract.md`.
- Implement nice-to-have features during MVP tasks unless explicitly requested.
- Add dependencies unless the task cannot be completed reasonably without them.

If a necessary change is outside the task scope, pause and report it.

## Smallest Complete Slice Rule

Implement the smallest complete version that satisfies the task acceptance criteria.

A good slice should be:

- Complete enough to verify.
- Small enough to review.
- Directly connected to one task.
- Safe to commit independently after approval.

Bad slice:

```txt
Implement dashboard, settings, authentication, database, and deployment polish in one pass.
```

Good slice:

```txt
Implement the assignment list empty, loading, and error states for the existing `/assignments` page.
```

## File Change Discipline

When modifying files:

- Prefer local changes over broad refactors.
- Keep naming consistent with the existing codebase.
- Follow existing folder and component patterns.
- Avoid moving files unless the task requires it.
- Avoid formatting unrelated files.
- Avoid changing public interfaces unless the PRD and task require it.

If additional files must change beyond the expected list, explain why in the handoff summary.

## Data Model Changes

If the implementation requires new or changed data fields:

1. Update `/docs/prd/04-data-model.md`.
2. Update related type definitions or schema files.
3. Update migrations if the project uses a database migration system.
4. Update affected tests or mock data.
5. Mention the data model change in the handoff summary.

Do not invent database fields silently.

## API Contract Changes

If the implementation requires new or changed API behavior:

1. Update `/docs/prd/05-api-contract.md`.
2. Document request shape, response shape, status codes, and error behavior.
3. Update client/server types if available.
4. Update tests or manual verification steps.
5. Mention the API change in the handoff summary.

Do not invent APIs silently.

## UI Implementation Rules

For user-facing UI tasks, check whether the task needs:

- Loading state
- Empty state
- Error state
- Success state
- Disabled state
- Permission state
- Responsive layout
- Accessible labels and focus behavior

Do not ship user-facing pages that only work in the ideal happy path unless the task explicitly says so.

## Testing Rules

Add or update tests when:

- The project already has a test framework.
- The task changes business logic.
- The task changes API behavior.
- The task fixes a bug.
- The acceptance criteria can be tested automatically.

If tests are not available or not appropriate, document manual verification steps instead.

## Verification Rules

After implementation, use:

```txt
/docs/meta/VERIFICATION_GUIDE.md
```

Prefer running the project-level verification script if available:

```bash
bash scripts/verify.sh
```

If a verification command fails, do not hide the failure. Report:

- Which command failed.
- The relevant error.
- Whether the failure is related to this task.
- What was fixed or what remains unresolved.

## Handling Blockers

A task is blocked if:

- Required PRD information is missing.
- Acceptance criteria conflict with each other.
- The task depends on an unresolved product decision.
- The required API or data model is unclear.
- Verification cannot be performed because the project setup is incomplete.

When blocked:

1. Stop implementation.
2. Summarize the blocker.
3. Update `/docs/prd/09-open-questions.md` if appropriate.
4. Suggest the smallest decision needed to unblock the task.

## Handling Requirement Changes

If the user changes requirements during implementation:

1. Stop expanding the current implementation.
2. Update the relevant PRD file.
3. Update `/docs/prd/10-decision-log.md`.
4. Re-check the current task scope.
5. Continue only after the task is still valid under the new requirement.

Use:

```txt
/docs/meta/CHANGE_REQUEST_GUIDE.md
```

when available.

## After Implementation: Handoff Summary

After implementation and verification, produce a handoff summary.

Use this format:

```md
## Handoff Summary

### Task Completed

`/docs/tasks/task-XXX-name.md`

### What Changed

- ...
- ...

### Files Changed

- `path/to/file`
- `path/to/file`

### Acceptance Criteria Status

- [x] Criterion 1
- [x] Criterion 2
- [ ] Criterion 3 — not completed because ...

### Verification Performed

- `pnpm lint` — passed
- `pnpm typecheck` — passed
- `pnpm test` — not available
- Manual check: ...

### Known Issues / Limitations

- None.

### Notes for Human Reviewer

- ...
```

## Commit Rule

Do not commit automatically unless the user explicitly asks for it.

The normal flow is:

```txt
Implement task
→ Run verification
→ Review diff
→ Human approval
→ Commit
```

Use `/docs/meta/COMMIT_GUIDE.md` after human approval.

## Done Means

A task is done only when:

- The implementation matches the task and PRD.
- Acceptance criteria are satisfied.
- Edge cases are handled or documented.
- Verification has been run or manually documented.
- The handoff summary is complete.
- No unrelated scope was added.
- The agent stops before commit unless explicitly approved.
