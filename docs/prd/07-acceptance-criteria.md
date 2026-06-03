# Acceptance Criteria

## Recognition workflow

Done when:

- User can upload an image and preview it.
- Clicking `Recognize` produces a backend response or a visible warning.
- The recognized text area becomes editable with returned content when available.
- The frontend shows candidate shape and recognition summary information.

## AI-assisted recognition

Done when:

- The frontend can detect whether VLM is configured.
- User can turn AI assistance on or off.
- When AI is enabled, recognition prefers VLM text extraction.
- If VLM fails or times out, recognition degrades gracefully instead of crashing the app.

## Model generation

Done when:

- User can click `Generate 3D Model`.
- A model appears in the 3D workspace after generation.
- The generated model type reflects template or recognition hints.
- Structured recognition hints can influence labels and hidden edges.

## Editing

Done when:

- User can drag vertices in edit mode.
- User can edit labels and coordinates from the inspector.
- User can toggle hidden edges.
- Updated models remain usable after edits.

## Manual mode

Done when:

- The app can start with an empty workspace.
- User can switch to manual mode.
- User can build a template-based model without uploading an image.

## Documentation

Done when:

- PRD files exist under `docs/prd/`.
- Task files exist under `docs/tasks/`.
- README reflects the current repository path and current product behavior.

