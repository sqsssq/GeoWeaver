# Feature Specification

## Feature: Image recognition workflow

### User goal

Extract useful geometry understanding from a textbook-like problem image.

### Functional requirements

- User can upload one PNG/JPG/JPEG image.
- The image is previewed in the left panel.
- The system can run recognition with AI assistance enabled or disabled.
- Recognition returns:
  - `recognizedText`
  - `candidateShape`
  - `diagramSummary`
  - `vertices2d`
  - `edges2d`
  - optional structured hints
  - `warnings`

### Notes

- AI mode prioritizes VLM text extraction.
- If VLM fails, the backend falls back to local heuristics.
- If local OCR fails, the text field remains editable for manual input.

## Feature: Editable problem text

### User goal

Correct or provide problem text even when recognition is imperfect.

### Functional requirements

- The text area is always editable.
- Recognized text is written into the text area when available.
- If `recognizedText` is empty but `diagramSummary` is present, the frontend may use the summary as a visible fallback.

## Feature: Template-based 3D generation

### User goal

Get a usable 3D geometry model that can be refined in place.

### Functional requirements

- Supported templates:
  - `cuboid`
  - `prism`
  - `pyramid`
- Generation uses:
  - candidate shape,
  - recognized text,
  - diagram summary,
  - optional structured hints,
  - optional 2D diagram scale.
- Generation returns vertices, edges, faces, and warnings.

### Behavioral intent

This is a smart template initializer, not exact reconstruction.

## Feature: Interactive 3D workspace

### User goal

Inspect and manipulate the generated geometry.

### Functional requirements

- Rotate, zoom, pan
- Reset camera
- Empty initial state before generation
- Select vertices, edges, faces
- Highlight current selection
- Show point labels

## Feature: Geometry editing

### User goal

Refine the generated model to match the intended geometry.

### Functional requirements

- Toggle edit mode
- Drag vertices in the scene
- Edit vertex coordinates and labels in the inspector
- Toggle hidden edges
- Persist updated models through `/api/update-model`

## Feature: Manual mode

### User goal

Create a teaching model directly from a template.

### Functional requirements

- User can switch to manual mode
- User can choose a template before generation
- User can build and edit the model with the same editor used in recognition mode

