# User Flows

## Flow A: Recognize from image

### Goal

Turn a geometry problem image into an editable 3D model starting point.

### Steps

1. User opens the app in `Recognize from Image` mode.
2. User uploads a geometry problem image.
3. User optionally enables AI-assisted recognition.
4. System recognizes:
   - candidate shape,
   - problem text,
   - diagram summary,
   - optional structured hints.
5. User reviews and edits the recognized problem text.
6. User reviews the suggested template.
7. User clicks `Generate 3D Model`.
8. System generates a 3D model and displays it in the central canvas.
9. User explores the model and refines labels, vertices, or hidden edges.

### End state

The user has a visible, editable 3D teaching or study model.

## Flow B: Manual teacher mode

### Goal

Create a demonstration model without relying on image recognition.

### Steps

1. User switches to `Create Manually`.
2. User selects a template.
3. User clicks `Build Template` or `Generate 3D Model`.
4. System creates an empty-start teaching model from the selected template.
5. User edits:
   - vertex positions,
   - labels,
   - hidden edges.

### End state

The user has a classroom-ready model even with no uploaded image.

## Flow C: Recognition fallback

### Goal

Allow the workflow to continue when OCR or VLM output is incomplete.

### Steps

1. Recognition produces partial or uncertain output.
2. System shows warnings.
3. User manually edits text or changes the template.
4. User generates a model anyway.
5. User refines the geometry in the editor.

### End state

The workflow remains usable even when automatic recognition quality is limited.

