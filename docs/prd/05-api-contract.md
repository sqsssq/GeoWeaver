# API Contract

## GET `/api/health`

### Purpose

Basic health check for the FastAPI service.

### Response

```json
{
  "status": "ok"
}
```

## GET `/api/capabilities`

### Purpose

Expose backend capability flags to the frontend.

### Response

```json
{
  "vlmConfigured": true
}
```

## POST `/api/recognize`

### Purpose

Recognize problem text and diagram hints from an uploaded image.

### Request

- Content type: `multipart/form-data`
- Fields:
  - `file`: uploaded image
  - `use_ai`: boolean-like flag

### Response

```json
{
  "candidateShape": "cuboid",
  "recognizedText": "已知长方体ABCD-EFGH中...",
  "diagramSummary": "这是一个长方体，后侧边可能为虚线。",
  "pointLabels": ["A", "B", "C", "D", "E", "F", "G", "H"],
  "hiddenEdgeSuggestions": ["AE", "DH"],
  "baseFaceLabels": ["A", "B", "C", "D"],
  "apexLabel": "",
  "vertices2d": [],
  "edges2d": [],
  "warnings": []
}
```

### Error behavior

- If VLM fails, the endpoint should still return a best-effort heuristic result instead of hard failing when possible.
- Warnings should explain fallback behavior.

## POST `/api/generate-model`

### Purpose

Generate a 3D model from recognition data or manual template selection.

### Request

```json
{
  "candidateShape": "prism",
  "recognizedText": "题干文本",
  "manualTemplate": "prism",
  "recognizedDiagram": {
    "...": "..."
  }
}
```

### Response

```json
{
  "templateType": "prism",
  "vertices": [],
  "edges": [],
  "faces": [],
  "warnings": []
}
```

## POST `/api/update-model`

### Purpose

Validate and echo back an updated model for MVP editing persistence.

### Request

```json
{
  "currentModel": { "...": "..." },
  "updatedModel": { "...": "..." },
  "editOperation": "optional-description"
}
```

### Response

Returns the updated `GeometryModel3D`.

