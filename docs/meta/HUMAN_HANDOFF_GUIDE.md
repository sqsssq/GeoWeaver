# Human Handoff Guide

This guide is used after implementation, verification, and diff review are complete.

The goal is to give the human reviewer a clear, compact summary so they can decide whether to approve, request changes, or stop the task.

## When to Use This Guide

Use this guide when:

- A task implementation is ready for human review.
- The agent has completed verification.
- The agent has reviewed the diff.
- The user needs to decide whether to approve the work.
- The task is ready for commit but has not been committed yet.

Do not commit before human approval.

## Required Inputs

Before writing the handoff, read:

```txt
/docs/tasks/[current-task].md
/docs/meta/VERIFICATION_GUIDE.md
/docs/meta/DIFF_REVIEW_GUIDE.md
```

Also use:

- Current changed files
- Verification results
- Diff review findings
- Known limitations
- Any unresolved PRD questions

## Handoff Goals

A good handoff should help the human quickly answer:

1. What changed?
2. Why was it changed?
3. Which PRD/task does it satisfy?
4. How was it verified?
5. Are there risks or limitations?
6. What should I review?
7. What is the recommended next step?

## Handoff Output Format

Use this format:

```md
# Human Handoff

## Task

Task ID and title.

## Status

Ready for review / Needs human decision / Blocked

## What Changed

Briefly summarize the implementation.

## Files Changed

List changed files and why each file changed.

Example:

- `src/app/page.tsx` — added landing page layout.
- `src/components/TaskCard.tsx` — added reusable task card component.
- `docs/prd/05-api-contract.md` — updated response shape for the new endpoint.

## PRD Coverage

List the PRD files or sections this task implements.

Example:

- `/docs/prd/03-feature-spec.md`
- `/docs/prd/06-ui-states.md`
- `/docs/prd/07-acceptance-criteria.md`

## Acceptance Criteria Status

- [x] Criterion 1
- [x] Criterion 2
- [ ] Criterion 3 — not completed because ...

## Verification Performed

Commands run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Manual checks:

- [x] Checked normal state.
- [x] Checked loading state.
- [x] Checked empty state.
- [x] Checked error state.

## Verification Results

Summarize the results.

Example:

- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm build` passed.
- Manual check for `/dashboard` passed.

If something was not run, say so clearly.

## Diff Review Summary

Overall result:

Approved / Needs changes / Blocked

Findings:

- Critical: none
- Major: none
- Minor: ...
- Notes: ...

## Known Limitations

List any known limitations, incomplete parts, or follow-up work.

If none, write:

```txt
None.
```

## Human Review Checklist

Please review:

- [ ] Does the implementation match the intended product behavior?
- [ ] Does the UI feel acceptable?
- [ ] Are the acceptance criteria actually satisfied?
- [ ] Are there any unexpected changes?
- [ ] Is this safe to commit?

## Recommended Next Step

Choose one:

- Approve and commit.
- Request small changes.
- Update PRD before continuing.
- Split remaining work into a follow-up task.
- Block this task.
```

## Rules

- Be specific.
- Do not hide failed verification.
- Do not say a task is done if acceptance criteria are missing.
- Do not commit without human approval.
- Do not overload the handoff with implementation details that belong in code comments.
- Do not include unrelated future ideas unless they are clearly labeled as follow-up.

## Status Definitions

### Ready for review

Use when:

- Implementation is complete.
- Verification has been run or documented.
- Diff review has no critical or major blockers.
- Human approval is needed before commit.

### Needs human decision

Use when:

- Product behavior is ambiguous.
- PRD and implementation could diverge.
- There are tradeoffs the agent should not decide alone.
- An out-of-scope request appears useful but needs approval.

### Blocked

Use when:

- Required PRD information is missing.
- A dependency is unavailable.
- Verification fails.
- The task cannot be safely completed.

## Good Handoff Example

```md
# Human Handoff

## Task

Task 003: Implement assignment list empty state

## Status

Ready for review

## What Changed

Added the empty state for the assignment list page when no assignments are available.

## Files Changed

- `src/app/assignments/page.tsx` — added empty state rendering.
- `src/components/EmptyState.tsx` — added reusable empty state component.

## PRD Coverage

- `/docs/prd/06-ui-states.md`
- `/docs/prd/07-acceptance-criteria.md`

## Acceptance Criteria Status

- [x] Empty assignment list shows a clear message.
- [x] Empty state includes a primary action button.
- [x] Page does not show a blank screen.

## Verification Performed

Commands run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Manual checks:

- [x] Opened `/assignments` with empty data.
- [x] Confirmed empty state text and action button.

## Verification Results

All commands passed. Manual empty state check passed.

## Diff Review Summary

Overall result: Approved

Findings:

- Critical: none
- Major: none
- Minor: none
- Notes: reusable component may be useful for future pages.

## Known Limitations

None.

## Recommended Next Step

Approve and commit.
```

## Done Means

Human handoff is complete when:

- The human can understand what changed.
- Verification status is transparent.
- Diff review result is visible.
- Risks and limitations are disclosed.
- A clear next step is recommended.
