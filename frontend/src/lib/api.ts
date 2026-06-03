import type { GeometryModel3D, RecognizedDiagram, ShapeType, TemplateType } from "../types/geometry";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8010/api";

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error("API health check failed.");
  }
  return response.json() as Promise<{ status: string }>;
}

export async function getCapabilities() {
  const response = await fetch(`${API_BASE}/capabilities`);
  if (!response.ok) {
    throw new Error("Could not load backend capabilities.");
  }
  return response.json() as Promise<{ vlmConfigured: boolean }>;
}

export async function recognizeImage(file: File, useAI: boolean) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("use_ai", String(useAI));

  const response = await fetch(`${API_BASE}/recognize`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image recognition failed.");
  }

  return response.json() as Promise<RecognizedDiagram>;
}

export async function generateModel(payload: {
  candidateShape: ShapeType;
  recognizedText: string;
  manualTemplate?: TemplateType;
  recognizedDiagram?: RecognizedDiagram;
}) {
  const response = await fetch(`${API_BASE}/generate-model`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Model generation failed.");
  }

  return response.json() as Promise<GeometryModel3D>;
}

export async function updateModel(updatedModel: GeometryModel3D) {
  const response = await fetch(`${API_BASE}/update-model`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentModel: updatedModel, updatedModel }),
  });

  if (!response.ok) {
    throw new Error("Model update failed.");
  }

  return response.json() as Promise<GeometryModel3D>;
}
