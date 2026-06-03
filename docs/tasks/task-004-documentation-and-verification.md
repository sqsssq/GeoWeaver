# Task 004: Documentation and Verification Alignment

## Status

Baseline implemented; final diff review and human handoff pending

## Source PRD

- `/docs/prd/05-api-contract.md`
- `/docs/prd/06-ui-states.md`
- `/docs/prd/07-acceptance-criteria.md`
- `/docs/prd/08-task-breakdown.md`

## Goal

Align repository documentation with the actual implemented MVP and local setup.

## User Value

Reduces onboarding friction and makes the project easier to review or continue.

## Scope

- README alignment
- PRD alignment
- Task documentation
- Verification command list and `scripts/verify.sh` entry point

## Out of Scope

- Production deployment docs
- Long-term operations docs

## Files Likely to Change

- `README.md`
- `docs/prd/*`
- `docs/tasks/*`

## Acceptance Criteria

- Core product behavior is described consistently across docs. Implemented.
- Local setup instructions use the current repository path. Implemented in README.
- Task files reflect the current implementation status. Implemented.

## Verification Method

- Manual document review
- `npm run build`
- backend health check

## Edge Cases

- Historical legacy naming in older text, now resolved by standardizing on `GeoWeaver`
- Nested duplicate project folder not intended as canonical source
- PaddleOCR migration is implemented in Task 002 and documented here as part of current-state alignment

## Dependencies

- Task 001
- Task 002
- Task 003

## Notes for Agent

- Prefer documentation that matches the real code over aspirational wording.
