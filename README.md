# GeoWeaver

GeoWeaver is a runnable MVP web app for teaching and learning solid geometry. It supports two simple workflows:

- Recognize a geometry problem from an uploaded image, extract rough text and diagram hints, then generate an approximate interactive 3D model.
- Create or edit a 3D solid geometry model manually for classroom demos.

The project is intentionally lightweight and demo-oriented. Recognition is heuristic, OCR is optional, and manual correction is part of the intended workflow.

## MVP Features

- Upload PNG/JPG/JPEG problem images
- Preview the uploaded image
- OCR the problem text when possible
- Heuristically detect line segments and candidate shapes
- Edit recognized problem text in a persistent textarea
- Generate template-based 3D models for `cuboid`, `prism`, and `pyramid`
- Explore models with rotate, zoom, pan, and reset camera
- Select vertices, edges, and faces
- Edit vertex positions, labels, and hidden edges
- Switch between image-recognition mode and teacher manual mode

## Current Implementation Status

The repository now includes a runnable MVP foundation with both frontend and backend implemented.

Implemented today:

- Monorepo structure with `/frontend` and `/backend`
- FastAPI backend with:
  - `GET /api/health`
  - `POST /api/recognize`
  - `POST /api/generate-model`
  - `POST /api/update-model`
- OCR service with PaddleOCR as the primary engine and Tesseract as a secondary fallback
- Heuristic diagram pipeline using grayscale, thresholding, Canny edges, and Hough line detection
- Optional external VLM hook using `QWEN_API_KEY`, `QWEN_MODEL`, and `QWEN_API_URL`
- AI mode can prioritize VLM-based Chinese problem understanding instead of OCR-first extraction
- Template-based 3D model generation for `cuboid`, `prism`, and `pyramid`
- React frontend with:
  - mode switch for recognition vs manual teacher mode
  - image upload and preview
  - editable problem text textarea
  - template selector
  - warnings panel
  - object inspector for vertices, edges, and faces
  - shared 3D viewer/editor
- Interactive 3D scene with:
  - orbit rotate / zoom / pan
  - reset view
  - vertex, edge, and face selection
  - vertex label rendering
- vertex dragging in edit mode
- edge hidden/visible toggling
- manual vertex coordinate and label editing from the inspector
- recognition summary cards and model metadata in the UI

Still being closed out:

- PaddleOCR now initializes lazily and may download official OCR models on first use; setup docs should keep calling out the larger dependency/runtime footprint.
- A project-level `scripts/verify.sh` is available for repeatable local verification.
- Task status documents are being aligned with the real implementation state before final review.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand, React Three Fiber, Drei
- Backend: Python, FastAPI, OpenCV, PaddleOCR, PaddlePaddle, pytesseract, Pydantic

## Folder Structure

```text
.
├── backend
│   ├── app
│   │   ├── main.py
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   └── requirements.txt
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── lib
│   │   ├── pages
│   │   ├── store
│   │   └── types
│   └── package.json
└── package.json
```

## Local Setup

### 1. Backend

Create and activate a virtual environment if desired, then install requirements:

```bash
cd /Users/qingshi/Projects/GeoWeaver/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Run the API:

```bash
cd /Users/qingshi/Projects/GeoWeaver/backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`.

### 2. Frontend

Install frontend dependencies:

```bash
cd /Users/qingshi/Projects/GeoWeaver/frontend
npm install
```

Run the Vite dev server:

```bash
cd /Users/qingshi/Projects/GeoWeaver/frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 3. Root Convenience Commands

After installing dependencies you can also use the root scripts:

```bash
npm install
npm run dev:web
npm run build:web
```

The backend is still run with Python tooling from `backend/`.

## Verification

After completing the setup above, run the project-level verification script:

```bash
cd /Users/qingshi/Projects/GeoWeaver
bash scripts/verify.sh
```

The script runs:

- frontend production build,
- backend import check,
- backend health handler check,
- OCR fallback smoke test,
- model generation and structured-hint smoke tests.

It does not install dependencies or start local servers. If dependencies are missing, the relevant command fails visibly.

## Verified Locally

The following checks have already been completed in this repository:

- Created backend virtual environment at `backend/.venv`
- Installed backend dependencies into that virtual environment
- Installed frontend dependencies successfully
- Verified backend imports:

```bash
cd /Users/qingshi/Projects/GeoWeaver/backend
./.venv/bin/python -c "import fastapi, cv2, paddleocr, paddle, pytesseract; from app.main import app; print('backend-import-ok')"
```

- Verified backend health handler:

```bash
cd /Users/qingshi/Projects/GeoWeaver/backend
./.venv/bin/python -c "import asyncio; from app.routes.api import health_check; result = asyncio.run(health_check()); print(result.model_dump_json())"
```

Expected output:

```json
{"status":"ok"}
```

- Verified frontend production build:

```bash
cd /Users/qingshi/Projects/GeoWeaver/frontend
npm run build
```

- Verified project-level script:

```bash
cd /Users/qingshi/Projects/GeoWeaver
bash scripts/verify.sh
```

Note: in the Codex sandbox, binding a local port like `127.0.0.1:8000` is restricted, so API runtime validation here used import and handler-level checks. On your local machine, the normal `uvicorn` command above should run as expected.

## OCR Dependency Note

PaddleOCR is the primary OCR path for Chinese geometry problem text. The backend imports and initializes it lazily so `/api/health` and normal backend imports do not require model initialization.

The first real OCR call may download PaddleOCR model files into the user's PaddleX cache, such as `~/.paddlex/official_models/`. The dependency stack is larger than the original Tesseract-only setup because it includes `paddleocr`, `paddlepaddle`, and their inference dependencies.

If PaddleOCR is unavailable, cannot initialize, or returns no text, the backend falls back to Tesseract OCR when available. If both OCR paths fail, the backend will not crash. Instead it returns warnings such as:

- `PaddleOCR did not detect readable problem text.`
- `Tesseract OCR did not detect readable problem text.`
- `No readable problem text was detected from the image; please enter or edit the text manually.`

Tesseract remains optional as a secondary fallback. To enable it fully, install:

- Python package: `pytesseract`
- System dependency: `tesseract`

On macOS with Homebrew:

```bash
brew install tesseract
```

## Optional Qwen VLM Integration

The backend can optionally call an external vision-language model to improve noisy OCR or low-confidence shape guesses. This integration is disabled by default and only activates when all three variables are present:

```bash
QWEN_API_KEY=...
QWEN_MODEL=...
QWEN_API_URL=...
```

You can copy [`backend/.env.example`](/Users/qingshi/Projects/GeoWeaver/backend/.env.example) and fill those values locally.

Important:

- Do not hardcode API keys into the repository.
- If a VLM request fails, the app falls back to the local heuristic recognizer automatically.
- The current MVP still treats manual correction as the primary workflow, even when a VLM is configured.
- When AI mode is turned on in the frontend, the backend prioritizes VLM recognition for Chinese problem text and a short diagram summary instead of OCR-first extraction.

## How the MVP Works

1. Upload an image in `Recognize from Image` mode.
2. Call `/api/recognize` to get OCR text, detected 2D line hints, and a candidate shape.
3. Edit the recognized text if needed.
4. Call `/api/generate-model` to create an approximate 3D template.
5. Explore and edit the geometry in the shared 3D editor.

Teachers can also skip image upload and start directly in `Create Manually` mode using one of the supported templates.

## Known MVP Limitations

- Recognition is heuristic and approximate.
- OCR quality depends on image quality and local Tesseract availability.
- 3D reconstruction is template-based, not exact image reconstruction.
- Only `cuboid`, `prism`, and `pyramid` are supported.
- Vertex dragging is practical rather than CAD-precise.
- Hidden edges are toggled manually by the user.

## Future Improvements

- Better OCR post-processing and geometry-text parsing
- More robust face and template inference
- Constraint-aware geometry editing
- Better teacher presentation tools
- More template types and problem presets
