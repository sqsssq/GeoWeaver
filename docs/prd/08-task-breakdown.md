# Task Breakdown Overview

This file provides the high-level implementation sequence. Detailed task files live in `docs/tasks/`.

## Task order

1. Project foundation and environment
2. Backend recognition pipeline
3. Frontend workflow shell
4. 3D workspace and editor
5. AI-assisted recognition and structured hints
6. Documentation, verification, and polish

## Current status

- Foundation: implemented
- Recognition pipeline: baseline implemented with PaddleOCR-first OCR, Tesseract fallback, OpenCV heuristics, optional VLM hints, one JSON repair retry, and warnings
- Workflow shell: implemented
- 3D workspace: implemented with React Three Fiber / Drei viewer, editor controls, empty state, and generating state
- Structured AI hint flow: partially implemented and connected to labels, hidden edges, base-face hints, and apex labels when available
- Documentation alignment: baseline implemented with task status updates, decision log entries, and `scripts/verify.sh`
