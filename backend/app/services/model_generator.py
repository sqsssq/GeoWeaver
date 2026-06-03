from __future__ import annotations

import re
from typing import Optional

from app.models.schemas import (
    Edge3D,
    Face3D,
    GenerateModelRequest,
    GeometryModel3D,
    RecognizedDiagram,
    TemplateType,
    Vertex3D,
)


def generate_cuboid_model() -> GeometryModel3D:
    vertices = [
        Vertex3D(id="A", x=-1.2, y=-0.8, z=1.0, label="A"),
        Vertex3D(id="B", x=1.2, y=-0.8, z=1.0, label="B"),
        Vertex3D(id="C", x=1.2, y=0.8, z=1.0, label="C"),
        Vertex3D(id="D", x=-1.2, y=0.8, z=1.0, label="D"),
        Vertex3D(id="E", x=-0.4, y=-0.2, z=-1.0, label="E"),
        Vertex3D(id="F", x=2.0, y=-0.2, z=-1.0, label="F"),
        Vertex3D(id="G", x=2.0, y=1.4, z=-1.0, label="G"),
        Vertex3D(id="H", x=-0.4, y=1.4, z=-1.0, label="H"),
    ]
    edges = [
        Edge3D(id="AB", **{"from": "A", "to": "B"}, hidden=False),
        Edge3D(id="BC", **{"from": "B", "to": "C"}, hidden=False),
        Edge3D(id="CD", **{"from": "C", "to": "D"}, hidden=False),
        Edge3D(id="DA", **{"from": "D", "to": "A"}, hidden=False),
        Edge3D(id="EF", **{"from": "E", "to": "F"}, hidden=True),
        Edge3D(id="FG", **{"from": "F", "to": "G"}, hidden=False),
        Edge3D(id="GH", **{"from": "G", "to": "H"}, hidden=False),
        Edge3D(id="HE", **{"from": "H", "to": "E"}, hidden=True),
        Edge3D(id="AE", **{"from": "A", "to": "E"}, hidden=True),
        Edge3D(id="BF", **{"from": "B", "to": "F"}, hidden=False),
        Edge3D(id="CG", **{"from": "C", "to": "G"}, hidden=False),
        Edge3D(id="DH", **{"from": "D", "to": "H"}, hidden=False),
    ]
    faces = [
        Face3D(id="front", vertices=["A", "B", "C", "D"]),
        Face3D(id="back", vertices=["E", "F", "G", "H"]),
        Face3D(id="left", vertices=["A", "D", "H", "E"]),
        Face3D(id="right", vertices=["B", "C", "G", "F"]),
        Face3D(id="top", vertices=["D", "C", "G", "H"]),
        Face3D(id="bottom", vertices=["A", "B", "F", "E"]),
    ]
    return GeometryModel3D(templateType="cuboid", vertices=vertices, edges=edges, faces=faces, warnings=[])


def generate_prism_model() -> GeometryModel3D:
    vertices = [
        Vertex3D(id="A", x=-1.0, y=-1.0, z=0.8, label="A"),
        Vertex3D(id="B", x=1.0, y=-1.0, z=0.8, label="B"),
        Vertex3D(id="C", x=0.0, y=1.0, z=0.8, label="C"),
        Vertex3D(id="D", x=-0.2, y=-0.4, z=-1.0, label="D"),
        Vertex3D(id="E", x=1.8, y=-0.4, z=-1.0, label="E"),
        Vertex3D(id="F", x=0.8, y=1.6, z=-1.0, label="F"),
    ]
    edges = [
        Edge3D(id="AB", **{"from": "A", "to": "B"}, hidden=False),
        Edge3D(id="BC", **{"from": "B", "to": "C"}, hidden=False),
        Edge3D(id="CA", **{"from": "C", "to": "A"}, hidden=False),
        Edge3D(id="DE", **{"from": "D", "to": "E"}, hidden=True),
        Edge3D(id="EF", **{"from": "E", "to": "F"}, hidden=False),
        Edge3D(id="FD", **{"from": "F", "to": "D"}, hidden=True),
        Edge3D(id="AD", **{"from": "A", "to": "D"}, hidden=True),
        Edge3D(id="BE", **{"from": "B", "to": "E"}, hidden=False),
        Edge3D(id="CF", **{"from": "C", "to": "F"}, hidden=False),
    ]
    faces = [
        Face3D(id="front", vertices=["A", "B", "C"]),
        Face3D(id="back", vertices=["D", "E", "F"]),
        Face3D(id="side-1", vertices=["A", "B", "E", "D"]),
        Face3D(id="side-2", vertices=["B", "C", "F", "E"]),
        Face3D(id="side-3", vertices=["C", "A", "D", "F"]),
    ]
    return GeometryModel3D(templateType="prism", vertices=vertices, edges=edges, faces=faces, warnings=[])


def generate_pyramid_model() -> GeometryModel3D:
    vertices = [
        Vertex3D(id="A", x=-1.1, y=-1.0, z=0.8, label="A"),
        Vertex3D(id="B", x=1.1, y=-1.0, z=0.8, label="B"),
        Vertex3D(id="C", x=1.3, y=0.9, z=-0.2, label="C"),
        Vertex3D(id="D", x=-0.9, y=1.0, z=-0.2, label="D"),
        Vertex3D(id="P", x=0.3, y=0.1, z=-1.8, label="P"),
    ]
    edges = [
        Edge3D(id="AB", **{"from": "A", "to": "B"}, hidden=False),
        Edge3D(id="BC", **{"from": "B", "to": "C"}, hidden=False),
        Edge3D(id="CD", **{"from": "C", "to": "D"}, hidden=True),
        Edge3D(id="DA", **{"from": "D", "to": "A"}, hidden=False),
        Edge3D(id="AP", **{"from": "A", "to": "P"}, hidden=True),
        Edge3D(id="BP", **{"from": "B", "to": "P"}, hidden=False),
        Edge3D(id="CP", **{"from": "C", "to": "P"}, hidden=False),
        Edge3D(id="DP", **{"from": "D", "to": "P"}, hidden=False),
    ]
    faces = [
        Face3D(id="base", vertices=["A", "B", "C", "D"]),
        Face3D(id="face-1", vertices=["A", "B", "P"]),
        Face3D(id="face-2", vertices=["B", "C", "P"]),
        Face3D(id="face-3", vertices=["C", "D", "P"]),
        Face3D(id="face-4", vertices=["D", "A", "P"]),
    ]
    return GeometryModel3D(templateType="pyramid", vertices=vertices, edges=edges, faces=faces, warnings=[])


def _combined_text(payload: GenerateModelRequest) -> str:
    parts = [payload.recognizedText]
    if payload.recognizedDiagram:
        parts.append(payload.recognizedDiagram.diagramSummary)
    return " ".join(part for part in parts if part).strip()


def _recognized_diagram(payload: GenerateModelRequest) -> Optional[RecognizedDiagram]:
    return payload.recognizedDiagram


def _pick_template_from_text(text: str) -> Optional[TemplateType]:
    lowered = text.lower()
    if any(token in lowered for token in ["长方体", "矩形六面体", "cuboid", "rectangular prism", "rectangular solid"]):
        return "cuboid"
    if any(token in lowered for token in ["棱锥", "四棱锥", "三棱锥", "pyramid", "apex"]):
        return "pyramid"
    if any(token in lowered for token in ["棱柱", "三棱柱", "四棱柱", "prism"]):
        return "prism"
    return None


def _extract_labels(text: str, count: int) -> list[str]:
    candidates = re.findall(r"\b[A-Z]\b", text.upper())
    ordered: list[str] = []
    for label in candidates:
        if label not in ordered:
            ordered.append(label)
    if len(ordered) >= count:
        return ordered[:count]
    return []


def _structured_labels(recognized_diagram: Optional[RecognizedDiagram], count: int) -> list[str]:
    if not recognized_diagram or not recognized_diagram.pointLabels:
        return []
    return recognized_diagram.pointLabels[:count]


def _infer_scale_from_diagram(recognized_diagram: RecognizedDiagram | None) -> tuple[float, float]:
    if not recognized_diagram or not recognized_diagram.vertices2d:
        return 1.0, 1.0

    xs = [point.x for point in recognized_diagram.vertices2d]
    ys = [point.y for point in recognized_diagram.vertices2d]
    width = max(xs) - min(xs) if len(xs) > 1 else 100.0
    height = max(ys) - min(ys) if len(ys) > 1 else 100.0
    width_scale = min(max(width / 180.0, 0.7), 1.8)
    height_scale = min(max(height / 160.0, 0.7), 1.8)
    return width_scale, height_scale


def _shape_bias(text: str) -> dict[str, float]:
    lowered = text.lower()
    return {
        "tall": 1.35 if any(token in lowered for token in ["高", "竖直", "顶部", "apex", "顶点"]) else 1.0,
        "flat": 0.75 if any(token in lowered for token in ["底面", "平面", "base"]) else 1.0,
        "deep": 1.25 if any(token in lowered for token in ["后", "内部", "侧面", "空间"]) else 1.0,
    }


def _apply_labels(model: GeometryModel3D, labels: list[str]) -> GeometryModel3D:
    if not labels:
        return model
    vertices = [
        vertex.model_copy(update={"id": labels[index], "label": labels[index]})
        if index < len(labels)
        else vertex
        for index, vertex in enumerate(model.vertices)
    ]
    id_map = {old.id: new.id for old, new in zip(model.vertices, vertices)}
    edges = [
        edge.model_copy(
            update={
                "from_vertex": id_map.get(edge.from_vertex, edge.from_vertex),
                "to_vertex": id_map.get(edge.to_vertex, edge.to_vertex),
                "id": f"{id_map.get(edge.from_vertex, edge.from_vertex)}{id_map.get(edge.to_vertex, edge.to_vertex)}",
            }
        )
        for edge in model.edges
    ]
    faces = [
        face.model_copy(update={"vertices": [id_map.get(vertex_id, vertex_id) for vertex_id in face.vertices]})
        for face in model.faces
    ]
    return model.model_copy(update={"vertices": vertices, "edges": edges, "faces": faces})


def _apply_geometry_bias(
    model: GeometryModel3D,
    width_scale: float,
    height_scale: float,
    text: str,
) -> GeometryModel3D:
    bias = _shape_bias(text)
    adjusted_vertices: list[Vertex3D] = []
    for vertex in model.vertices:
        adjusted_vertices.append(
            vertex.model_copy(
                update={
                    "x": round(vertex.x * width_scale, 2),
                    "y": round(vertex.y * height_scale * bias["flat"], 2),
                    "z": round(vertex.z * bias["deep"], 2),
                }
            )
        )

    if model.templateType == "pyramid":
        apex = adjusted_vertices[-1]
        adjusted_vertices[-1] = apex.model_copy(
            update={
                "y": round(apex.y * bias["tall"], 2),
                "z": round(apex.z * bias["tall"], 2),
            }
        )

    if model.templateType == "prism" and any(token in text.lower() for token in ["三棱柱", "triangle prism", "triangular prism"]):
        adjusted_vertices = [
            vertex.model_copy(update={"z": round(vertex.z * 1.2, 2)})
            if vertex.id in {adjusted_vertices[3].id, adjusted_vertices[4].id, adjusted_vertices[5].id}
            else vertex
            for vertex in adjusted_vertices
        ]

    return model.model_copy(update={"vertices": adjusted_vertices})


def _apply_hidden_edge_hints(model: GeometryModel3D, text: str) -> GeometryModel3D:
    lowered = text.lower()
    if not any(token in lowered for token in ["虚线", "隐藏", "不可见", "hidden", "dashed"]):
        return model

    edges = []
    for index, edge in enumerate(model.edges):
        should_hide = edge.hidden or index % 3 == 0
        edges.append(edge.model_copy(update={"hidden": should_hide}))
    return model.model_copy(update={"edges": edges})


def _apply_structured_hidden_edges(model: GeometryModel3D, recognized_diagram: Optional[RecognizedDiagram]) -> GeometryModel3D:
    if not recognized_diagram or not recognized_diagram.hiddenEdgeSuggestions:
        return model

    suggestions = {edge.upper() for edge in recognized_diagram.hiddenEdgeSuggestions}
    reverse_suggestions = {edge[::-1] for edge in suggestions}
    all_suggestions = suggestions | reverse_suggestions
    edges = [
        edge.model_copy(update={"hidden": edge.id.upper() in all_suggestions or edge.hidden})
        for edge in model.edges
    ]
    return model.model_copy(update={"edges": edges})


def _apply_structured_face_hints(model: GeometryModel3D, recognized_diagram: Optional[RecognizedDiagram]) -> GeometryModel3D:
    if not recognized_diagram:
        return model

    base_labels = recognized_diagram.baseFaceLabels
    apex_label = recognized_diagram.apexLabel
    if not base_labels and not apex_label:
        return model

    vertices = list(model.vertices)
    if base_labels:
        for index, label in enumerate(base_labels[: len(vertices)]):
            vertices[index] = vertices[index].model_copy(update={"id": label, "label": label})
    if apex_label and model.templateType == "pyramid":
        vertices[-1] = vertices[-1].model_copy(update={"id": apex_label, "label": apex_label})

    id_map = {old.id: new.id for old, new in zip(model.vertices, vertices)}
    edges = [
        edge.model_copy(
            update={
                "from_vertex": id_map.get(edge.from_vertex, edge.from_vertex),
                "to_vertex": id_map.get(edge.to_vertex, edge.to_vertex),
                "id": f"{id_map.get(edge.from_vertex, edge.from_vertex)}{id_map.get(edge.to_vertex, edge.to_vertex)}",
            }
        )
        for edge in model.edges
    ]
    faces = [
        face.model_copy(update={"vertices": [id_map.get(vertex_id, vertex_id) for vertex_id in face.vertices]})
        for face in model.faces
    ]
    return model.model_copy(update={"vertices": vertices, "edges": edges, "faces": faces})


def _pick_template(payload: GenerateModelRequest) -> TemplateType:
    text = _combined_text(payload)
    text_template = _pick_template_from_text(text)

    if payload.manualTemplate:
        return payload.manualTemplate
    if payload.candidateShape in {"cuboid", "prism", "pyramid"}:
        return payload.candidateShape
    if text_template:
        return text_template
    return "cuboid"


def generate_geometry_model(payload: GenerateModelRequest) -> GeometryModel3D:
    combined_text = _combined_text(payload)
    recognized_diagram = _recognized_diagram(payload)
    template = _pick_template(payload)

    if template == "cuboid":
        model = generate_cuboid_model()
    elif template == "prism":
        model = generate_prism_model()
    else:
        model = generate_pyramid_model()

    warnings = list(model.warnings)
    width_scale, height_scale = _infer_scale_from_diagram(recognized_diagram)
    labels = _structured_labels(recognized_diagram, len(model.vertices)) or _extract_labels(combined_text, len(model.vertices))

    model = _apply_labels(model, labels)
    model = _apply_structured_face_hints(model, recognized_diagram)
    model = _apply_geometry_bias(model, width_scale, height_scale, combined_text)
    model = _apply_structured_hidden_edges(model, recognized_diagram)
    model = _apply_hidden_edge_hints(model, combined_text)

    if payload.candidateShape == "unknown" and payload.manualTemplate is None:
        warnings.append("Template inference was uncertain, so a cuboid fallback was used.")

    if payload.recognizedText and "pyramid" in payload.recognizedText.lower() and template != "pyramid":
        warnings.append("Problem text mentions a pyramid, but the selected template was kept.")

    if recognized_diagram and recognized_diagram.diagramSummary:
        warnings.append("AI / diagram summary was used to bias template geometry and labeling.")

    if labels:
        warnings.append(f"Applied {len(labels)} structured or inferred point labels to the generated model.")

    if recognized_diagram and recognized_diagram.hiddenEdgeSuggestions:
        warnings.append("Applied hidden-edge suggestions returned by AI.")

    if recognized_diagram and recognized_diagram.baseFaceLabels:
        warnings.append("Applied AI base-face label ordering hints.")

    if recognized_diagram and recognized_diagram.vertices2d:
        warnings.append("2D diagram size was used to scale the generated 3D template.")

    return model.model_copy(update={"warnings": warnings})
