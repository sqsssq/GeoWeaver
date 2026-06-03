import { create } from "zustand";
import { createMockModel } from "../lib/modelTemplates";
import { generateModel, recognizeImage, updateModel } from "../lib/api";
import type {
  AppMode,
  GeometryModel3D,
  RecognizedDiagram,
  SelectionState,
  ShapeType,
  TemplateType,
} from "../types/geometry";

interface AppState {
  mode: AppMode;
  uploadedImageFile?: File;
  uploadedImageUrl?: string;
  recognizedText: string;
  candidateShape: ShapeType;
  selectedTemplate: TemplateType;
  recognizedDiagram?: RecognizedDiagram;
  geometryModel?: GeometryModel3D;
  selection: SelectionState;
  editMode: boolean;
  warnings: string[];
  isRecognizing: boolean;
  isGenerating: boolean;
  apiStatus: "unknown" | "online" | "offline";
  useAiAssistance: boolean;
  aiConfigured: boolean;
  lastGeneratedAt?: string;
  lastGenerationSource: "initial" | "manual" | "recognition";
  setMode: (mode: AppMode) => void;
  setUploadedImage: (file?: File) => void;
  setRecognizedText: (text: string) => void;
  setSelectedTemplate: (template: TemplateType) => void;
  setCandidateShape: (shape: ShapeType) => void;
  setEditMode: (enabled: boolean) => void;
  setSelection: (selection: SelectionState) => void;
  setUseAiAssistance: (enabled: boolean) => void;
  setAiConfigured: (configured: boolean) => void;
  resetAll: () => void;
  recognizeCurrentImage: () => Promise<void>;
  generateCurrentModel: () => Promise<void>;
  initializeManualTemplate: () => Promise<void>;
  patchVertex: (vertexId: string, patch: Partial<{ x: number; y: number; z: number; label: string }>) => void;
  persistGeometryModel: () => Promise<void>;
  toggleEdgeHidden: (edgeId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  mode: "recognize",
  uploadedImageFile: undefined,
  uploadedImageUrl: undefined,
  recognizedText: "",
  candidateShape: "unknown",
  selectedTemplate: "cuboid",
  recognizedDiagram: undefined,
  geometryModel: undefined,
  selection: {},
  editMode: false,
  warnings: ["Start with a template or upload an image to build a demo model."],
  isRecognizing: false,
  isGenerating: false,
  apiStatus: "unknown",
  useAiAssistance: false,
  aiConfigured: false,
  lastGeneratedAt: undefined,
  lastGenerationSource: "initial",
  setMode: (mode) => set({ mode }),
  setUploadedImage: (file) => {
    const existing = get().uploadedImageUrl;
    if (existing) {
      URL.revokeObjectURL(existing);
    }
    set({
      uploadedImageFile: file,
      uploadedImageUrl: file ? URL.createObjectURL(file) : undefined,
    });
  },
  setRecognizedText: (recognizedText) => set({ recognizedText }),
  setSelectedTemplate: (selectedTemplate) => {
    const { mode, geometryModel } = get();
    const nextState: Partial<AppState> = { selectedTemplate };
    if (mode === "manual" && geometryModel) {
      nextState.geometryModel = createMockModel(selectedTemplate);
      nextState.lastGenerationSource = "manual";
      nextState.warnings = [
        `Template preview switched to ${selectedTemplate}. Click "Generate 3D Model" to regenerate from the backend.`,
      ];
    } else if (geometryModel && geometryModel.templateType !== selectedTemplate) {
      nextState.warnings = [
        `Template changed to ${selectedTemplate}. Click "Generate 3D Model" to apply it.`,
      ];
    }
    set(nextState as AppState);
  },
  setCandidateShape: (candidateShape) => set({ candidateShape }),
  setEditMode: (editMode) => set({ editMode }),
  setSelection: (selection) => set({ selection }),
  setUseAiAssistance: (useAiAssistance) => set({ useAiAssistance }),
  setAiConfigured: (aiConfigured) => set({ aiConfigured }),
  resetAll: () => {
    const existing = get().uploadedImageUrl;
    if (existing) {
      URL.revokeObjectURL(existing);
    }
    set({
      mode: "recognize",
      uploadedImageFile: undefined,
      uploadedImageUrl: undefined,
      recognizedText: "",
      candidateShape: "unknown",
      selectedTemplate: "cuboid",
      recognizedDiagram: undefined,
      geometryModel: undefined,
      selection: {},
      editMode: false,
      lastGeneratedAt: undefined,
      lastGenerationSource: "initial",
      warnings: ["State reset. Upload a new image or start from a manual template."],
    });
  },
  recognizeCurrentImage: async () => {
    const file = get().uploadedImageFile;
    const useAiAssistance = get().useAiAssistance && get().aiConfigured;
    if (!file) {
      set({ warnings: ["Choose an image before running recognition."] });
      return;
    }

    set({ isRecognizing: true, warnings: [] });
    try {
      const result = await recognizeImage(file, useAiAssistance);
      console.log("[GeoWeaver] recognize result", {
        useAiAssistance,
        result,
      });
      set({
        recognizedDiagram: result,
        recognizedText: result.recognizedText || result.diagramSummary || "",
        candidateShape: result.candidateShape,
        selectedTemplate: result.candidateShape === "unknown" ? get().selectedTemplate : result.candidateShape,
        warnings: useAiAssistance ? result.warnings : ["AI enhancement is off. Local OCR and heuristic parsing were used.", ...result.warnings],
      });
    } catch (error) {
      set({
        warnings: [error instanceof Error ? error.message : "Recognition failed."],
      });
    } finally {
      set({ isRecognizing: false });
    }
  },
  generateCurrentModel: async () => {
    const { candidateShape, recognizedText, selectedTemplate, recognizedDiagram } = get();
    set({ isGenerating: true });
    try {
      const model = await generateModel({
        candidateShape,
        recognizedText,
        manualTemplate: selectedTemplate,
        recognizedDiagram,
      });
      const generationSource = get().mode === "manual" ? "manual" : "recognition";
      set({
        geometryModel: model,
        selectedTemplate: model.templateType,
        selection: {},
        editMode: false,
        lastGeneratedAt: new Date().toLocaleTimeString(),
        lastGenerationSource: generationSource,
        warnings: [
          `Generated ${model.templateType} model from ${generationSource === "manual" ? "manual template mode" : "recognition workflow"}.`,
          ...(recognizedDiagram?.warnings ?? []),
          ...model.warnings,
        ],
      });
    } catch (error) {
      set({
        geometryModel: createMockModel(selectedTemplate),
        editMode: false,
        lastGeneratedAt: new Date().toLocaleTimeString(),
        lastGenerationSource: get().mode === "manual" ? "manual" : "recognition",
        warnings: [
          error instanceof Error ? error.message : "Model generation failed.",
          "A local template fallback was loaded so editing can continue.",
        ],
      });
    } finally {
      set({ isGenerating: false });
    }
  },
  initializeManualTemplate: async () => {
    set({ candidateShape: "unknown" });
    await get().generateCurrentModel();
  },
  patchVertex: (vertexId, patch) => {
    const model = get().geometryModel;
    if (!model) {
      return;
    }
    const updatedModel: GeometryModel3D = {
      ...model,
      vertices: model.vertices.map((vertex) =>
        vertex.id === vertexId ? { ...vertex, ...patch } : vertex,
      ),
    };
    set({ geometryModel: updatedModel });
  },
  persistGeometryModel: async () => {
    const updatedModel = get().geometryModel;
    if (!updatedModel) {
      return;
    }
    try {
      const persisted = await updateModel(updatedModel);
      set({ geometryModel: persisted });
    } catch {
      set({ warnings: [...get().warnings, "Model update API unavailable; local edits are still applied."] });
    }
  },
  toggleEdgeHidden: async (edgeId) => {
    const model = get().geometryModel;
    if (!model) {
      return;
    }
    const updatedModel: GeometryModel3D = {
      ...model,
      edges: model.edges.map((edge) =>
        edge.id === edgeId ? { ...edge, hidden: !edge.hidden } : edge,
      ),
    };
    set({ geometryModel: updatedModel });
    try {
      const persisted = await updateModel(updatedModel);
      set({ geometryModel: persisted });
    } catch {
      set({ warnings: [...get().warnings, "Edge visibility change kept locally because the update API failed."] });
    }
  },
}));
