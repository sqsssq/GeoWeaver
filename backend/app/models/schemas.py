from __future__ import annotations

from typing import Literal
from typing import Optional

from pydantic import BaseModel, Field


ShapeType = Literal["cuboid", "prism", "pyramid", "unknown"]
TemplateType = Literal["cuboid", "prism", "pyramid"]
ModeType = Literal["recognize", "manual"]


class Point2D(BaseModel):
    x: float
    y: float


class Edge2D(BaseModel):
    from_point: Point2D = Field(alias="from")
    to_point: Point2D = Field(alias="to")

    model_config = {"populate_by_name": True}


class RecognizedDiagram(BaseModel):
    candidateShape: ShapeType
    recognizedText: str
    diagramSummary: str = ""
    pointLabels: list[str] = Field(default_factory=list)
    hiddenEdgeSuggestions: list[str] = Field(default_factory=list)
    baseFaceLabels: list[str] = Field(default_factory=list)
    apexLabel: str = ""
    vertices2d: list[Point2D]
    edges2d: list[Edge2D]
    warnings: list[str] = Field(default_factory=list)


class Vertex3D(BaseModel):
    id: str
    x: float
    y: float
    z: float
    label: Optional[str] = None


class Edge3D(BaseModel):
    id: str
    from_vertex: str = Field(alias="from")
    to_vertex: str = Field(alias="to")
    hidden: bool = False

    model_config = {"populate_by_name": True}


class Face3D(BaseModel):
    id: str
    vertices: list[str]


class GeometryModel3D(BaseModel):
    templateType: TemplateType
    vertices: list[Vertex3D]
    edges: list[Edge3D]
    faces: list[Face3D]
    warnings: list[str] = Field(default_factory=list)


class GenerateModelRequest(BaseModel):
    candidateShape: ShapeType = "unknown"
    recognizedText: str = ""
    manualTemplate: Optional[TemplateType] = None
    recognizedDiagram: Optional[RecognizedDiagram] = None


class UpdateModelRequest(BaseModel):
    currentModel: GeometryModel3D
    updatedModel: Optional[GeometryModel3D] = None
    editOperation: Optional[str] = None


class HealthResponse(BaseModel):
    status: str


class CapabilityResponse(BaseModel):
    vlmConfigured: bool
