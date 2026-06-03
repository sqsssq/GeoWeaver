# AGENTS.md

This repository uses a PRD-first, task-based AI development workflow.

The core workflow is:

text Idea / PRD -> Task breakdown -> Implement one small task -> Run verification -> Review diff -> Human approval -> Commit 

For medium or large product changes, do not jump directly into implementation.

---

## Instruction Priority

When instructions conflict, follow this priority order:

1. The user's latest explicit instruction.
2. The current task file in docs/tasks/.
3. The referenced PRD files in docs/prd/.
4. This AGENTS.md.
5. Existing code conventions.

If the task conflicts with the PRD, stop and report the conflict instead of guessing.

---

## Workflow Guides

Before starting a workflow step, read the corresponding guide.

| Situation | Required Guide |
| --- | --- |
| User gives a vague product idea | docs/meta/PRD_GENERATOR.md |
| User asks to split PRD into tasks | docs/meta/TASK_BREAKDOWN_GUIDE.md |
| User asks to implement a task | docs/meta/TASK_EXECUTION_GUIDE.md |
| User asks to verify implementation | docs/meta/VERIFICATION_GUIDE.md |
| User asks to review changed diff | docs/meta/DIFF_REVIEW_GUIDE.md |
| User asks for review-ready summary | docs/meta/HUMAN_HANDOFF_GUIDE.md |
| User approves and asks to commit | docs/meta/COMMIT_GUIDE.md |

---

## Project Documents

Expected PRD files live in:

text docs/prd/   00-product-brief.md   01-mvp-scope.md   02-user-flows.md   03-feature-spec.md   04-data-model.md   05-api-contract.md   06-ui-states.md   07-acceptance-criteria.md   08-task-breakdown.md   09-open-questions.md   10-decision-log.md 

Expected task files live in:

text docs/tasks/ 

Use this template for new tasks:

text docs/tasks/TASK_TEMPLATE.md 

---

## Repository Discovery

Before making changes, inspect the repository structure and identify:

- package manager and lockfile,
- available scripts,
- frontend and backend entry points,
- existing coding patterns,
- existing UI, API, and data-access conventions,
- existing test and verification setup.

Prefer existing conventions over introducing new patterns.

Do not assume the framework, package manager, database, or architecture before checking the repository.

---

## Working Agreements

- Do not implement vague product ideas directly.
- If the idea is vague, generate or update the PRD first.
- Prefer MVP-first scope.
- Implement one small complete task at a time.
- Every task must have acceptance criteria.
- Every task must have a verification method.
- Keep PRD, task docs, API contract, data model, and code consistent.
- Do not silently expand task scope.
- Do not add unrelated features.
- Do not add dependencies unless necessary.
- Do not commit without human approval.
- After a human-approved commit is created, push the current branch automatically unless the user explicitly says not to push.

---

## Before Implementation

Before implementing a task, the agent must:

1. Read the relevant task file in docs/tasks/.
2. Read the PRD files referenced by the task.
3. Read the relevant workflow guide in docs/meta/.
4. Inspect the existing implementation.
5. Restate the task scope.
6. Identify files likely to change.
7. Confirm what is out of scope.
8. Implement the smallest complete slice.

---

## PRD Consistency Rules

The PRD is the source of product truth.

Do not invent APIs without updating:

text docs/prd/05-api-contract.md 

Do not invent database fields without updating:

text docs/prd/04-data-model.md 

Do not change user flows without updating:

text docs/prd/02-user-flows.md 

Do not change feature behavior without updating:

text docs/prd/03-feature-spec.md 

Do not change UI states without updating:

text docs/prd/06-ui-states.md 

Do not change acceptance criteria without updating:

text docs/prd/07-acceptance-criteria.md 

Record major product decisions in:

text docs/prd/10-decision-log.md 

---

## Frontend Rules

- Prefer existing local UI components under frontend/src/components/ui/.
- When a needed interactive primitive exists in Radix, prefer using Radix instead of hand-rolling custom behavior.
- Extend the current local UI layer instead of introducing a separate component library.
- Follow existing styling, spacing, naming, and composition patterns.

For user-facing frontend changes, handle relevant states:

- loading,
- empty,
- error,
- disabled,
- pending or submitting,
- success feedback where appropriate,
- basic responsive behavior when relevant.

---

## File Size and Refactoring

Keep files maintainable.

- When a touched file grows beyond roughly 400 lines, prefer a small behavior-preserving extraction.
- When a touched file grows beyond 600 lines, treat it as a refactor hotspot.
- Do not make a large hotspot file materially larger without explaining why extraction was not feasible.

Exceptions include generated files, migration files, schema-only files, simple data-only definition files, and lockfiles.

---

## Security and Secrets

- Do not hardcode secrets, API keys, tokens, passwords, or credentials.
- Use environment variables for configuration.
- Do not commit .env files or local credentials.
- Do not print sensitive data in logs.
- Do not expose internal stack traces to users.
- Do not weaken authentication, authorization, validation, or permission checks.

---

## No Placeholder Completion

Do not mark a task as done if the implementation relies on:

- placeholder logic,
- fake data,
- TODO-only branches,
- unimplemented functions,
- mock APIs in production paths,
- hardcoded sample responses.

Exceptions are allowed only when the task explicitly asks for a stub, prototype, mock, or scaffold.

---

## Verification

After implementation, run available checks.

Prefer:

bash bash scripts/verify.sh 

If scripts/verify.sh is unavailable, look for and run the most relevant available checks, such as:

- lint,
- typecheck,
- tests,
- build,
- formatting check.

Report exactly which checks were run.

Do not claim verification passed unless it actually ran and passed.

Do not claim the project is fully verified if only partial checks were completed.

---

## Diff Review

Before handoff, review the changed diff for:

- unrelated changes,
- scope creep,
- missing loading, empty, or error states,
- API contract drift,
- data model drift,
- duplicated logic,
- unnecessary abstractions,
- large-file growth,
- dependency changes,
- inconsistent naming or styling,
- insufficient validation,
- insufficient error handling,
- insufficient verification.

---

## Human Handoff

After implementation and verification, provide a review-ready summary including:

- what changed,
- files changed,
- acceptance criteria status,
- verification commands and results,
- known limitations,
- follow-up suggestions,
- whether PRD files were updated,
- whether any scope decisions were made.

Do not hide failed or skipped verification.

---

## Commit Rules

Do not commit without explicit human approval.

When the user approves and asks to commit:

1. Read docs/meta/COMMIT_GUIDE.md.
2. Review the final diff.
3. Ensure verification status is documented.
4. Create a focused commit message.
5. Commit only files related to the approved task.

After creating a human-approved commit, push the current branch automatically unless the user explicitly says not to push.

If there are multiple remotes or the current branch has no upstream, stop and report the situation instead of guessing where to push.

---

## Done Means

A task is done only when:

- implementation matches the relevant PRD,
- acceptance criteria are satisfied,
- edge cases are handled or documented,
- loading, empty, and error states are handled where relevant,
- API contract and data model are consistent with the PRD,
- verification steps are run or clearly documented,
- changed diff has been reviewed,
- human handoff summary is provided,
- no unrelated features were added,
- no unapproved commit was made.
- human-approved commits are pushed automatically unless the user explicitly opted out.
