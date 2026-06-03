# Workflow Overview

This repository uses a PRD-first, task-based AI development workflow.

Core workflow:

```text
Idea / PRD
-> Task breakdown
-> Implement one small task
-> Run verification
-> Review diff
-> Human approval
-> Commit
```

## When To Use Which Guide

| Situation | Required Guide |
| --- | --- |
| User gives a vague product idea | `docs/meta/PRD_GENERATOR.md` |
| User asks to split PRD into tasks | `docs/meta/TASK_BREAKDOWN_GUIDE.md` |
| User asks to implement a task | `docs/meta/TASK_EXECUTION_GUIDE.md` |
| User asks to verify implementation | `docs/meta/VERIFICATION_GUIDE.md` |
| User asks to review changed diff | `docs/meta/DIFF_REVIEW_GUIDE.md` |
| User asks for review-ready summary | `docs/meta/HUMAN_HANDOFF_GUIDE.md` |
| User approves and asks to commit | `docs/meta/COMMIT_GUIDE.md` |

## Working Agreements

- Do not implement vague product ideas directly.
- If the idea is vague, generate or update the PRD first.
- Prefer MVP-first scope.
- Implement one small complete task at a time.
- Every task must have acceptance criteria.
- Every task must have a verification method.
- Keep PRD, task docs, API contract, data model, and code consistent.
- Do not silently expand task scope.
- Do not commit without human approval.
