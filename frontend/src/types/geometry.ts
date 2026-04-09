export type AppMode = "recognize" | "manual";
export type ShapeType = "cuboid" | "prism" | "pyramid" | "unknown";
export type TemplateType = "cuboid" | "prism" | "pyramid";

export interface Point2D {
  x: number;
  y: number;
}

export interface Edge2D {
  from: Point2D;
  to: Point2D;
}

export interface RecognizedDiagram {
  candidateShape: ShapeType;
  recognizedText: string;
  diagramSummary: string;
  pointLabels: string[];
  hiddenEdgeSuggestions: string[];
  baseFaceLabels: string[];
  apexLabel: string;
  vertices2d: Point2D[];
  edges2d: Edge2D[];
  warnings: string[];
}

export interface Vertex3D {
  id: string;
  x: number;
  y: number;
  z: number;
  label?: string;
}

export interface Edge3D {
  id: string;
  from: string;
  to: string;
  hidden: boolean;
}

export interface Face3D {
  id: string;
  vertices: string[];
}

export interface GeometryModel3D {
  templateType: TemplateType;
  vertices: Vertex3D[];
  edges: Edge3D[];
  faces: Face3D[];
  warnings: string[];
}

export interface SelectionState {
  selectedVertexId?: string;
  selectedEdgeId?: string;
  selectedFaceId?: string;
}
