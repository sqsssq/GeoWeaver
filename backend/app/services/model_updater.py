from __future__ import annotations

from app.models.schemas import GeometryModel3D, UpdateModelRequest


def update_geometry_model(payload: UpdateModelRequest) -> GeometryModel3D:
    if payload.updatedModel is not None:
        if payload.editOperation:
            warnings = list(payload.updatedModel.warnings)
            warnings.append(f"Applied edit operation: {payload.editOperation}")
            return payload.updatedModel.model_copy(update={"warnings": warnings})
        return payload.updatedModel

    warnings = list(payload.currentModel.warnings)
    if payload.editOperation:
        warnings.append(f"Applied edit operation: {payload.editOperation}")

    return payload.currentModel.model_copy(update={"warnings": warnings})
