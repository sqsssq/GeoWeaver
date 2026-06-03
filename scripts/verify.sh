#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

if [[ -x "$BACKEND_DIR/.venv/bin/python" ]]; then
  PYTHON="$BACKEND_DIR/.venv/bin/python"
else
  PYTHON="${PYTHON:-python3}"
fi

echo "== GeoWeaver verification =="
echo "Root: $ROOT_DIR"
echo "Python: $PYTHON"

echo
echo "== Frontend build =="
cd "$ROOT_DIR"
npm run build:web

echo
echo "== Backend import check =="
cd "$BACKEND_DIR"
"$PYTHON" - <<'PY'
import cv2
import fastapi
import paddle
import paddleocr
import pytesseract

from app.main import app

print(app.title)
PY

echo
echo "== Backend health handler check =="
"$PYTHON" - <<'PY'
import asyncio

from app.routes.api import health_check

result = asyncio.run(health_check())
print(result.model_dump_json())
PY

echo
echo "== OCR fallback smoke =="
"$PYTHON" - <<'PY'
from app.services.ocr_service import extract_text

text, warnings = extract_text(b"not-an-image")
assert text == ""
assert any("decode" in warning.lower() for warning in warnings)
print({"text": text, "warnings": warnings})
PY

echo
echo "== Model generation smoke =="
"$PYTHON" - <<'PY'
from app.models.schemas import GenerateModelRequest, RecognizedDiagram
from app.services.model_generator import generate_geometry_model

for template in ("cuboid", "prism", "pyramid"):
    model = generate_geometry_model(
        GenerateModelRequest(candidateShape="unknown", manualTemplate=template)
    )
    assert model.templateType == template
    assert model.vertices
    assert model.edges
    assert model.faces
    print(template, len(model.vertices), len(model.edges), len(model.faces))

recognized = RecognizedDiagram(
    candidateShape="pyramid",
    recognizedText="四棱锥 X-QRST",
    diagramSummary="四棱锥，X 为顶点，QX 为虚线",
    pointLabels=["A", "B", "C", "D", "E"],
    hiddenEdgeSuggestions=["QX"],
    baseFaceLabels=["Q", "R", "S", "T"],
    apexLabel="X",
    vertices2d=[],
    edges2d=[],
    warnings=[],
)
model = generate_geometry_model(
    GenerateModelRequest(
        candidateShape="pyramid",
        recognizedText=recognized.recognizedText,
        recognizedDiagram=recognized,
    )
)
assert [vertex.id for vertex in model.vertices] == ["Q", "R", "S", "T", "X"]
assert model.faces[0].vertices == ["Q", "R", "S", "T"]
assert any(edge.id == "QX" and edge.hidden for edge in model.edges)
print("structured-hints-ok")
PY

echo
echo "Verification complete."
