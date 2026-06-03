# Decision Log

## D-001: MVP uses template-based 3D generation

- Date: 2026-06-03
- Decision: Use `cuboid`, `prism`, and `pyramid` templates instead of exact 3D reconstruction.
- Reason: Keeps the system runnable and editable while avoiding brittle reconstruction claims.

## D-002: Human correction is part of the intended workflow

- Date: 2026-06-03
- Decision: Recognition output remains editable by design.
- Reason: Educational workflows benefit from user validation and correction, especially for noisy geometry diagrams.

## D-003: AI recognition is optional

- Date: 2026-06-03
- Decision: The system supports AI-assisted recognition only when environment variables are configured.
- Reason: Keeps local development possible without mandatory external dependencies.

## D-004: AI mode is text-first again

- Date: 2026-06-03
- Decision: `recognizedText` is treated as the highest-priority field in VLM prompting and fallback handling.
- Reason: Stable Chinese problem-text extraction is more important than forcing rich structure in every response.

## D-005: Default workspace starts empty

- Date: 2026-06-03
- Decision: The 3D workspace no longer shows a default model before generation.
- Reason: Better matches user expectations that the generated model is the result of the workflow.

## D-006: Project name is GeoWeaver

- Date: 2026-06-03
- Decision: Use `GeoWeaver` as the canonical product and project name across documentation, UI copy, backend metadata, and package naming.
- Reason: Removes legacy naming drift and keeps onboarding, review, and runtime surfaces consistent.

## D-007: PaddleOCR becomes the primary OCR target

- Date: 2026-06-03
- Decision: Use PaddleOCR as the primary OCR path for Chinese geometry problem text while keeping graceful fallback behavior.
- Reason: Chinese textbook-style geometry problems are a core MVP use case, and OCR quality matters more than preserving the current `pytesseract`-first implementation.

## D-008: Add a project-level verification script

- Date: 2026-06-03
- Decision: Add `scripts/verify.sh` as the preferred local verification entry point during documentation and verification closure.
- Reason: The PRD-first workflow expects repeatable verification, and the current README lists individual checks without a single project-level command.

## D-009: Retry malformed VLM JSON once

- Date: 2026-06-03
- Decision: When a configured VLM returns non-standard content that cannot be parsed as the expected JSON, send one repair prompt before falling back to local OCR and heuristics.
- Reason: The VLM path should be useful for structured hints, but local development and recognition fallback must remain robust when AI output is malformed.
