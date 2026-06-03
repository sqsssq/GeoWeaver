# Commit Guide

This guide is used after human approval.

The goal is to create clean, reviewable commits that match the PRD-first task workflow.

Do not commit before human approval.

## When to Use This Guide

Use this guide when:

- A task is complete.
- Verification has been performed.
- Diff review has been completed.
- Human approval has been given.
- The user asks the agent to commit the work.

Do not use this guide to bypass review or approval.

## Required Inputs

Before committing, read:

```txt
/docs/tasks/[current-task].md
/docs/meta/HUMAN_HANDOFF_GUIDE.md
/docs/meta/DIFF_REVIEW_GUIDE.md
```

Also check:

- Current git status
- Changed files
- Verification results
- Human approval message

## Pre-Commit Checklist

Before committing, confirm:

- [ ] Human approval was given.
- [ ] The task matches the PRD.
- [ ] Acceptance criteria are satisfied.
- [ ] Verification was run or documented.
- [ ] Diff review is complete.
- [ ] No unrelated files are included.
- [ ] No secrets or local-only files are staged.
- [ ] No debug logs or temporary files remain.
- [ ] PRD docs were updated if product behavior changed.
- [ ] API contract was updated if API behavior changed.
- [ ] Data model was updated if schema or fields changed.

## Git Status Check

Run:

```bash
git status
```

Review changed files carefully.

If unrelated files are present:

1. Do not stage them.
2. Ask for human confirmation if unsure.
3. Split them into another task if needed.

## Recommended Commit Format

Use Conventional Commits:

```txt
<type>(optional-scope): <short description>
```

Common types:

```txt
feat:     new user-facing feature
fix:      bug fix
docs:     documentation-only change
refactor: code change without behavior change
test:     test-only change
chore:    tooling, config, or maintenance
style:    formatting-only change
perf:     performance improvement
ci:       CI workflow change
```

Examples:

```txt
feat(tasks): add task breakdown workflow
docs(workflow): add verification guide
fix(api): validate assignment creation payload
refactor(ui): extract reusable empty state component
test(auth): add login edge case coverage
chore(deps): update lint configuration
```

## Commit Message Rules

A good commit message should:

- Be short but specific.
- Describe what changed.
- Match the task scope.
- Avoid vague messages like `update`, `changes`, or `fix stuff`.
- Use imperative mood when possible.
- Include the task ID if useful.

Good:

```txt
feat(assignments): add empty state for assignment list
```

Bad:

```txt
update page
```

Good:

```txt
docs(workflow): add human handoff guide
```

Bad:

```txt
add docs
```

## Staging Rules

Stage only files related to the approved task.

Recommended flow:

```bash
git status
git diff
git add <related-files>
git diff --staged
```

If the staged diff includes unrelated changes, unstage them:

```bash
git restore --staged <file>
```

## Commit Command

After staging the correct files:

```bash
git commit -m "type(scope): short description"
```

Example:

```bash
git commit -m "docs(workflow): add diff review and handoff guides"
```

## Optional Commit Body

Use a commit body for larger changes:

```bash
git commit -m "feat(assignments): add empty state" -m "Implements the assignment list empty state based on the approved UI state PRD. Includes manual verification steps for empty and loading states."
```

A commit body is useful when:

- The change connects to a PRD task.
- The implementation has important context.
- There are known limitations.
- The change includes migration or setup steps.

## Post-Commit Check

After committing, run:

```bash
git status
```

Expected result:

```txt
nothing to commit, working tree clean
```

If there are remaining changes:

1. Identify whether they belong to the same task.
2. If yes, ask whether to amend.
3. If no, leave them unstaged for a future task.

## Amend Rule

Only amend a commit if:

- The user approves it.
- The commit has not been pushed or shared, unless the user explicitly understands the risk.
- The amendment belongs to the same task.

Command:

```bash
git commit --amend
```

## Push Rule

Do not push unless the user explicitly asks.

If the user asks to push:

```bash
git push
```

If the branch has no upstream:

```bash
git push -u origin <branch-name>
```

## PR Rule

If the workflow uses pull requests, include:

- Summary
- Linked task
- PRD coverage
- Verification performed
- Screenshots if UI changed
- Known limitations

Suggested PR description:

```md
## Summary

- ...

## Source Task

- `/docs/tasks/task-XXX-...md`

## PRD Coverage

- `/docs/prd/...`

## Verification

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] Manual verification

## Screenshots

Add screenshots for UI changes.

## Known Limitations

None.
```

## Do-Not Rules

- Do not commit without human approval.
- Do not stage unrelated files.
- Do not commit secrets.
- Do not commit generated files unless they are expected.
- Do not commit local environment files like `.env`.
- Do not push unless explicitly asked.
- Do not rewrite git history unless explicitly approved.
- Do not use vague commit messages.

## If Verification Failed

If verification failed:

1. Do not commit unless the user explicitly approves a known failing state.
2. Document the failure in the handoff.
3. Recommend fixing the failure first.
4. If the failure is unrelated to the current task, document it clearly.

## If Human Requests Commit Despite Risks

If the user asks to commit despite known issues:

1. Clearly summarize the risk.
2. Confirm the issue is known.
3. Use a commit message that does not hide the risk.
4. Prefer creating a follow-up task.

## Done Means

Commit is done when:

- Only approved files are committed.
- Commit message is clear.
- Working tree status is checked.
- Remaining changes, if any, are explained.
- The user knows the commit result.
