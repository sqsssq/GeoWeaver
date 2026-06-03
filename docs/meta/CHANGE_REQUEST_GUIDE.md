# Change Request Guide

Use this guide when a user wants to change scope after a task or PRD already exists.

## Goals

- Prevent silent scope expansion.
- Keep task and PRD documents aligned with code changes.
- Make it clear whether the change is:
  - a clarification,
  - a small extension,
  - a new task,
  - or a PRD rewrite.

## Process

1. Restate the requested change.
2. Identify which existing task or PRD section it affects.
3. Decide whether the change is:
   - in scope for the current task,
   - out of scope and should become a follow-up task,
   - or large enough to require PRD updates first.
4. Update documentation before or alongside implementation.
5. Reconfirm acceptance criteria and verification method.

## Rules

- Do not silently absorb medium or large feature changes into the current task.
- If the change affects API shape, update `docs/prd/05-api-contract.md`.
- If the change affects schema or data fields, update `docs/prd/04-data-model.md`.
- If the change affects user behavior, update the relevant PRD flow/spec docs.
- If the change creates a clearly separable unit of work, create a new task in `docs/tasks/`.

## Output Template

```md
## Change Request Summary

- Requested change:
- Affected PRD files:
- Affected task:
- Decision:
- Scope impact:
- Verification impact:
```
