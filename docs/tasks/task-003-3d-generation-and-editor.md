# Task 003: 3D Generation and Editor

## Status

Baseline implemented; 3D workspace UI-state gap checks completed

## Source PRD

- `/docs/prd/02-user-flows.md`
- `/docs/prd/03-feature-spec.md`
- `/docs/prd/04-data-model.md`
- `/docs/prd/06-ui-states.md`

## Goal

Turn recognition output or manual template choice into an editable 3D model.

## User Value

Transforms a static geometry problem into a manipulable spatial object.

## Scope

- Template-based generation
- Empty-state workspace
- Viewer interactions
- Vertex/edge/face selection
- Edit mode and hidden-edge toggling

## Out of Scope

- Constraint solving
- Persisted project save/load

## Files Likely to Change

- `backend/app/services/model_generator.py`
- `backend/app/services/model_updater.py`
- `frontend/src/components/Viewer3D.tsx`
- `frontend/src/components/InspectorPanel.tsx`
- `frontend/src/store/useAppStore.ts`

## Acceptance Criteria

- Model appears only after generation or manual build. Implemented.
- User can manipulate and edit the model. Implemented with React Three Fiber / Drei controls and inspector editing.
- Structured hints can influence generated labels and hidden edges. Implemented for labels, hidden edges, base-face hints, and apex labels when hints are available.

## Verification Method

- `npm run build`
- Backend generation smoke test

## Edge Cases

- Empty workspace
- Template switch before first generation
- Missing structured hints

## Dependencies

- Task 001
- Task 002

## Notes for Agent

- Keep generation clearly template-based and honest about uncertainty.
- Do not rewrite the 3D viewer or replace React Three Fiber / Drei with raw Three.js unless a verified PRD gap requires it.
