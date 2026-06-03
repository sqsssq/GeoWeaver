# Diff Review Guide

This guide is used after an implementation task is completed and before human handoff.

The goal is to review the changed diff against the PRD, the task scope, and the repository rules. The review should catch scope creep, broken contracts, missing verification, and risky code before the user approves the work.

## When to Use This Guide

Use this guide when:

- A task implementation is complete.
- Files have changed.
- The agent needs to review its own diff before handoff.
- Another AI agent is asked to review the diff.
- The user asks for a pre-commit review.

Do not use this guide as a replacement for implementation or testing. Review happens after verification whenever possible.

## Required Inputs

Before reviewing, read:

```txt
AGENTS.md
/docs/meta/00_WORKFLOW_OVERVIEW.md
/docs/meta/TASK_EXECUTION_GUIDE.md
/docs/meta/VERIFICATION_GUIDE.md
/docs/tasks/[current-task].md
```

Also read any PRD files referenced by the task, especially:

```txt
/docs/prd/03-feature-spec.md
/docs/prd/04-data-model.md
/docs/prd/05-api-contract.md
/docs/prd/06-ui-states.md
/docs/prd/07-acceptance-criteria.md
```

## Review Goal

The review should answer five questions:

1. Does the diff implement the requested task?
2. Does the diff match the relevant PRD?
3. Are acceptance criteria satisfied?
4. Were verification steps run or documented?
5. Did the implementation avoid unrelated changes?

## Review Scope

Review only the current changed diff unless the user explicitly asks for a broader review.

Focus on:

- Correctness
- Scope control
- PRD alignment
- API contract consistency
- Data model consistency
- UI states
- Error handling
- Verification coverage
- Security and privacy concerns
- Performance risks
- Maintainability
- Unrelated changes

## Review Checklist

### 1. PRD Alignment

Check:

- [ ] The implementation matches the relevant feature spec.
- [ ] MVP scope was not silently expanded.
- [ ] Out-of-scope items were not implemented.
- [ ] Any changed requirement is reflected in the decision log.
- [ ] Any changed data field is reflected in the data model doc.
- [ ] Any changed endpoint or payload is reflected in the API contract doc.

### 2. Task Scope

Check:

- [ ] The implementation matches the task goal.
- [ ] The task did not expand into unrelated features.
- [ ] The changed files are reasonable for the task.
- [ ] Unexpected changed files are explained.
- [ ] No large refactor was introduced unless the task requested it.

### 3. Acceptance Criteria

Check:

- [ ] Each acceptance criterion is satisfied.
- [ ] Missing criteria are clearly identified.
- [ ] Partially completed criteria are not marked as done.
- [ ] Any blocked criterion links to an open question or dependency.

### 4. UI State Coverage

For user-facing UI changes, check:

- [ ] Loading state exists where needed.
- [ ] Empty state exists where needed.
- [ ] Error state exists where needed.
- [ ] Success state exists where needed.
- [ ] Disabled / pending state exists where needed.
- [ ] Responsive behavior is considered.
- [ ] Basic accessibility is considered.

### 5. API and Data Safety

Check:

- [ ] No API was invented without updating `/docs/prd/05-api-contract.md`.
- [ ] No database field was invented without updating `/docs/prd/04-data-model.md`.
- [ ] Validation is handled where appropriate.
- [ ] Error responses are predictable.
- [ ] Sensitive data is not logged or exposed.
- [ ] Authorization or permission assumptions are documented.

### 6. Code Quality

Check:

- [ ] The solution is the smallest complete slice.
- [ ] Names are clear.
- [ ] Logic is not unnecessarily complex.
- [ ] Duplicate code is avoided where reasonable.
- [ ] Dependencies are not added unless necessary.
- [ ] Comments explain why, not obvious what.
- [ ] No dead code or debug logs remain.

### 7. Verification

Check:

- [ ] Lint was run or documented as unavailable.
- [ ] Typecheck was run or documented as unavailable.
- [ ] Tests were run or documented as unavailable.
- [ ] Build was run or documented as unavailable.
- [ ] Manual verification steps are documented if automated tests are not enough.
- [ ] Failed checks are clearly reported.

## Finding Severity

Use the following severity levels.

### Critical

The task should not be approved.

Examples:

- Implementation breaks the main user flow.
- Data loss risk.
- Security or privacy risk.
- API contract is broken.
- Build fails.
- The feature is implemented against the wrong requirement.

### Major

The task needs changes before approval.

Examples:

- Acceptance criteria are missing.
- Important edge state is missing.
- Scope creep is present.
- Verification was skipped.
- PRD and code are inconsistent.

### Minor

The task can be approved after small cleanup or with a follow-up task.

Examples:

- Naming could be clearer.
- Minor UI polish issue.
- Documentation could be more precise.
- Non-blocking refactor opportunity.

### Note

Useful observation, not a blocker.

Examples:

- Future improvement idea.
- Optional cleanup.
- Nice-to-have test case.

## Review Output Format

Use this format:

```md
# Diff Review

## Summary

Briefly summarize what was reviewed.

## Overall Result

Approved / Needs changes / Blocked

## Findings

### Critical

- None.

### Major

- None.

### Minor

- None.

### Notes

- None.

## PRD Alignment

Explain whether the diff matches the relevant PRD.

## Acceptance Criteria Status

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Verification Status

List commands or manual checks that were run.

## Scope Control

Explain whether any unrelated changes were found.

## Recommendation

State whether the user should approve, request changes, or block the task.
```

## Rules for the Reviewing Agent

- Do not rewrite the implementation during review unless the user explicitly asks.
- Do not approve a task with missing acceptance criteria.
- Do not hide failed verification.
- Do not mark unverified behavior as verified.
- Do not ignore scope creep.
- Do not suggest broad rewrites when a small fix is enough.
- Do not invent new product requirements during review.

## If the Diff Is Too Large

If the diff is too large to review confidently:

1. State that the diff is too large.
2. Identify the major changed areas.
3. Recommend splitting the work into smaller tasks.
4. Review only the highest-risk areas first.
5. Do not give a full approval.

## If Review Finds PRD Drift

If the implementation no longer matches the PRD:

1. Do not approve the task.
2. Identify the exact mismatch.
3. Decide whether the code or the PRD should change.
4. If requirements changed, update:
   - `/docs/prd/09-open-questions.md`
   - `/docs/prd/10-decision-log.md`
   - affected PRD files
5. Re-run task execution after alignment.

## Done Means

Diff review is complete when:

- Findings are categorized by severity.
- PRD alignment is checked.
- Acceptance criteria are checked.
- Verification status is documented.
- Scope creep is checked.
- A clear approval recommendation is provided.
