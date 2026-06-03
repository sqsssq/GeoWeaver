# Task 002: Recognition Pipeline

## Status

Baseline implemented with PaddleOCR-first OCR and one VLM JSON repair retry

## Source PRD

- `/docs/prd/03-feature-spec.md`
- `/docs/prd/04-data-model.md`
- `/docs/prd/05-api-contract.md`
- `/docs/prd/07-acceptance-criteria.md`

## Goal

Implement the image-to-recognition pipeline for text, candidate shape, and geometry hints.

## User Value

Allows users to start from a problem image instead of manually rebuilding every diagram.

## Scope

- OCR fallback, with PaddleOCR as the primary Chinese OCR engine
- OpenCV heuristic extraction
- Optional VLM assistance
- Structured recognition output

## Out of Scope

- Exact 3D reconstruction
- Symbolic solving

## Files Likely to Change

- `backend/app/services/diagram_recognizer.py`
- `backend/app/services/ocr_service.py`
- `backend/app/services/vlm_service.py`
- `backend/app/models/schemas.py`

## Acceptance Criteria

- `/api/recognize` returns usable output even when AI fails. Implemented with VLM-to-local OCR fallback.
- Recognized text is editable in the frontend. Implemented.
- Recognition warnings are user-visible. Implemented.

## Verification Method

- Manual upload test
- Backend health check
- Frontend build
- OCR fallback smoke test

## Edge Cases

- AI timeout
- OCR unavailable
- Empty or low-quality image

## Dependencies

- Task 001

## Notes for Agent

- Prefer graceful degradation over hard failure.
- Do not change the `/api/recognize` response shape when migrating OCR engines.
