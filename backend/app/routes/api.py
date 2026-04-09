from typing import Optional

from fastapi import APIRouter, File, Form, UploadFile

from app.models.schemas import (
    CapabilityResponse,
    GenerateModelRequest,
    GeometryModel3D,
    HealthResponse,
    RecognizedDiagram,
    UpdateModelRequest,
)
from app.services.diagram_recognizer import recognize_diagram
from app.services.model_generator import generate_geometry_model
from app.services.model_updater import update_geometry_model
from app.utils.settings import get_vlm_settings


router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok")


@router.get("/capabilities", response_model=CapabilityResponse)
async def capabilities() -> CapabilityResponse:
    settings = get_vlm_settings()
    return CapabilityResponse(vlmConfigured=settings.enabled)


@router.post("/recognize", response_model=RecognizedDiagram)
async def recognize(
    file: UploadFile = File(...),
    use_ai: Optional[bool] = Form(default=False),
) -> RecognizedDiagram:
    contents = await file.read()
    return recognize_diagram(contents, file.filename or "upload", use_ai=bool(use_ai))


@router.post("/generate-model", response_model=GeometryModel3D)
async def generate_model(payload: GenerateModelRequest) -> GeometryModel3D:
    return generate_geometry_model(payload)


@router.post("/update-model", response_model=GeometryModel3D)
async def update_model(payload: UpdateModelRequest) -> GeometryModel3D:
    return update_geometry_model(payload)
