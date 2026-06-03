from __future__ import annotations

from math import hypot

import cv2
import numpy as np

from app.models.schemas import Edge2D, Point2D, RecognizedDiagram, ShapeType
from app.services.ocr_service import extract_text
from app.services.vlm_service import extract_vlm_hints


def _cluster_points(points: list[tuple[float, float]], threshold: float = 18.0) -> list[Point2D]:
    clusters: list[list[tuple[float, float]]] = []

    for point in points:
        matched = False
        for cluster in clusters:
            cx = sum(p[0] for p in cluster) / len(cluster)
            cy = sum(p[1] for p in cluster) / len(cluster)
            if hypot(point[0] - cx, point[1] - cy) <= threshold:
                cluster.append(point)
                matched = True
                break
        if not matched:
            clusters.append([point])

    return [
        Point2D(
            x=round(sum(p[0] for p in cluster) / len(cluster), 2),
            y=round(sum(p[1] for p in cluster) / len(cluster), 2),
        )
        for cluster in clusters
    ]


def _infer_shape(num_lines: int, num_vertices: int) -> tuple[ShapeType, list[str]]:
    warnings: list[str] = []

    if num_lines >= 9 and num_vertices >= 6:
        return "cuboid", warnings
    if 6 <= num_lines <= 10 and 5 <= num_vertices <= 8:
        return "prism", warnings
    if 4 <= num_lines <= 8 and 4 <= num_vertices <= 6:
        return "pyramid", warnings

    warnings.append("Low confidence geometry inference; choose a template manually if needed.")
    return "unknown", warnings


def recognize_diagram(image_bytes: bytes, filename: str, use_ai: bool = False) -> RecognizedDiagram:
    warnings: list[str] = []
    recognized_text = ""
    diagram_summary = ""
    point_labels: list[str] = []
    hidden_edge_suggestions: list[str] = []
    base_face_labels: list[str] = []
    apex_label = ""
    vlm_text = None
    vlm_summary = None
    vlm_shape = None
    if use_ai:
        (
            vlm_text,
            vlm_summary,
            vlm_shape,
            point_labels,
            hidden_edge_suggestions,
            base_face_labels,
            vlm_apex_label,
            vlm_warnings,
        ) = extract_vlm_hints(image_bytes)
        warnings.extend(vlm_warnings)
        if vlm_apex_label:
            apex_label = vlm_apex_label

    recognized_text, ocr_warnings = extract_text(image_bytes)
    if use_ai:
        if vlm_text and recognized_text:
            warnings.append("Local OCR was also run to support AI fallback and text comparison.")
        elif not vlm_text:
            warnings.append("AI did not return usable problem text; local OCR fallback was used.")
    warnings.extend(ocr_warnings)

    array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(array, cv2.IMREAD_COLOR)

    if image is None:
        warnings.append(f"Could not decode uploaded image: {filename}")
        return RecognizedDiagram(
            candidateShape="unknown",
            recognizedText=recognized_text,
            diagramSummary=diagram_summary,
            pointLabels=point_labels,
            hiddenEdgeSuggestions=hidden_edge_suggestions,
            baseFaceLabels=base_face_labels,
            apexLabel=apex_label,
            vertices2d=[],
            edges2d=[],
            warnings=warnings,
        )

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, threshold = cv2.threshold(blurred, 180, 255, cv2.THRESH_BINARY_INV)
    edges = cv2.Canny(threshold, 50, 150)

    line_segments = cv2.HoughLinesP(
        edges,
        rho=1,
        theta=np.pi / 180,
        threshold=50,
        minLineLength=max(25, min(image.shape[0], image.shape[1]) // 8),
        maxLineGap=12,
    )

    vertices_raw: list[tuple[float, float]] = []
    edges2d: list[Edge2D] = []

    if line_segments is not None:
        for segment in line_segments[:18]:
            x1, y1, x2, y2 = segment[0]
            vertices_raw.append((float(x1), float(y1)))
            vertices_raw.append((float(x2), float(y2)))
            edges2d.append(
                Edge2D(
                    **{
                        "from": Point2D(x=float(x1), y=float(y1)),
                        "to": Point2D(x=float(x2), y=float(y2)),
                    }
                )
            )
    else:
        warnings.append("No strong diagram lines were detected from the image.")

    vertices2d = _cluster_points(vertices_raw)
    candidate_shape, shape_warnings = _infer_shape(len(edges2d), len(vertices2d))
    warnings.extend(shape_warnings)

    if vlm_text and len(vlm_text) > len(recognized_text):
        recognized_text = vlm_text
    if vlm_summary:
        diagram_summary = vlm_summary

    if candidate_shape == "unknown" and vlm_shape is not None:
        candidate_shape = vlm_shape

    if not recognized_text:
        warnings.append("Problem text can be typed or corrected manually in the editor.")

    if vlm_text:
        warnings.append("Optional VLM enhancement contributed to the recognition result.")
    elif use_ai:
        warnings.append("AI enhancement was enabled, but no additional VLM hints were applied.")

    return RecognizedDiagram(
        candidateShape=candidate_shape,
        recognizedText=recognized_text,
        diagramSummary=diagram_summary,
        pointLabels=point_labels,
        hiddenEdgeSuggestions=hidden_edge_suggestions,
        baseFaceLabels=base_face_labels,
        apexLabel=apex_label,
        vertices2d=vertices2d,
        edges2d=edges2d,
        warnings=warnings,
    )
