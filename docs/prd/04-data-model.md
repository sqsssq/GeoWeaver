# Data Model

## RecognizedDiagram

Represents the result of image understanding.

### Fields

- `candidateShape`: `"cuboid" | "prism" | "pyramid" | "unknown"`
- `recognizedText`: `string`
- `diagramSummary`: `string`
- `pointLabels`: `string[]`
- `hiddenEdgeSuggestions`: `string[]`
- `baseFaceLabels`: `string[]`
- `apexLabel`: `string`
- `vertices2d`: array of 2D points
- `edges2d`: array of 2D edges
- `warnings`: `string[]`

### Notes

- `pointLabels` is an ordered list of visible or inferred point names returned by AI.
- `hiddenEdgeSuggestions` suggests edge IDs or label pairs that should default to hidden.
- `baseFaceLabels` is an ordered face hint, mainly useful for prism and pyramid generation.
- `apexLabel` is used when the model includes a top or apex vertex.

## GeometryModel3D

Represents the editable 3D model shown in the frontend.

### Fields

- `templateType`: `"cuboid" | "prism" | "pyramid"`
- `vertices`: `Vertex3D[]`
- `edges`: `Edge3D[]`
- `faces`: `Face3D[]`
- `warnings`: `string[]`

## Vertex3D

- `id`: `string`
- `x`: `number`
- `y`: `number`
- `z`: `number`
- `label?`: `string`

## Edge3D

- `id`: `string`
- `from`: `string`
- `to`: `string`
- `hidden`: `boolean`

## Face3D

- `id`: `string`
- `vertices`: `string[]`

## SelectionState

- `selectedVertexId?`
- `selectedEdgeId?`
- `selectedFaceId?`

