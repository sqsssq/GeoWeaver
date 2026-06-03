import type { GeometryModel3D, TemplateType } from "../types/geometry";

export const createMockModel = (template: TemplateType = "cuboid"): GeometryModel3D => {
  if (template === "prism") {
    return {
      templateType: "prism",
      vertices: [
        { id: "A", x: -1, y: -1, z: 0.8, label: "A" },
        { id: "B", x: 1, y: -1, z: 0.8, label: "B" },
        { id: "C", x: 0, y: 1, z: 0.8, label: "C" },
        { id: "D", x: -0.2, y: -0.4, z: -1, label: "D" },
        { id: "E", x: 1.8, y: -0.4, z: -1, label: "E" },
        { id: "F", x: 0.8, y: 1.6, z: -1, label: "F" },
      ],
      edges: [
        { id: "AB", from: "A", to: "B", hidden: false },
        { id: "BC", from: "B", to: "C", hidden: false },
        { id: "CA", from: "C", to: "A", hidden: false },
        { id: "DE", from: "D", to: "E", hidden: true },
        { id: "EF", from: "E", to: "F", hidden: false },
        { id: "FD", from: "F", to: "D", hidden: true },
        { id: "AD", from: "A", to: "D", hidden: true },
        { id: "BE", from: "B", to: "E", hidden: false },
        { id: "CF", from: "C", to: "F", hidden: false },
      ],
      faces: [
        { id: "front", vertices: ["A", "B", "C"] },
        { id: "back", vertices: ["D", "E", "F"] },
        { id: "side-1", vertices: ["A", "B", "E", "D"] },
        { id: "side-2", vertices: ["B", "C", "F", "E"] },
        { id: "side-3", vertices: ["C", "A", "D", "F"] },
      ],
      warnings: [],
    };
  }

  if (template === "pyramid") {
    return {
      templateType: "pyramid",
      vertices: [
        { id: "A", x: -1.1, y: -1, z: 0.8, label: "A" },
        { id: "B", x: 1.1, y: -1, z: 0.8, label: "B" },
        { id: "C", x: 1.3, y: 0.9, z: -0.2, label: "C" },
        { id: "D", x: -0.9, y: 1, z: -0.2, label: "D" },
        { id: "P", x: 0.3, y: 0.1, z: -1.8, label: "P" },
      ],
      edges: [
        { id: "AB", from: "A", to: "B", hidden: false },
        { id: "BC", from: "B", to: "C", hidden: false },
        { id: "CD", from: "C", to: "D", hidden: true },
        { id: "DA", from: "D", to: "A", hidden: false },
        { id: "AP", from: "A", to: "P", hidden: true },
        { id: "BP", from: "B", to: "P", hidden: false },
        { id: "CP", from: "C", to: "P", hidden: false },
        { id: "DP", from: "D", to: "P", hidden: false },
      ],
      faces: [
        { id: "base", vertices: ["A", "B", "C", "D"] },
        { id: "face-1", vertices: ["A", "B", "P"] },
        { id: "face-2", vertices: ["B", "C", "P"] },
        { id: "face-3", vertices: ["C", "D", "P"] },
        { id: "face-4", vertices: ["D", "A", "P"] },
      ],
      warnings: [],
    };
  }

  return {
    templateType: "cuboid",
    vertices: [
      { id: "A", x: -1.2, y: -0.8, z: 1, label: "A" },
      { id: "B", x: 1.2, y: -0.8, z: 1, label: "B" },
      { id: "C", x: 1.2, y: 0.8, z: 1, label: "C" },
      { id: "D", x: -1.2, y: 0.8, z: 1, label: "D" },
      { id: "E", x: -0.4, y: -0.2, z: -1, label: "E" },
      { id: "F", x: 2, y: -0.2, z: -1, label: "F" },
      { id: "G", x: 2, y: 1.4, z: -1, label: "G" },
      { id: "H", x: -0.4, y: 1.4, z: -1, label: "H" },
    ],
    edges: [
      { id: "AB", from: "A", to: "B", hidden: false },
      { id: "BC", from: "B", to: "C", hidden: false },
      { id: "CD", from: "C", to: "D", hidden: false },
      { id: "DA", from: "D", to: "A", hidden: false },
      { id: "EF", from: "E", to: "F", hidden: true },
      { id: "FG", from: "F", to: "G", hidden: false },
      { id: "GH", from: "G", to: "H", hidden: false },
      { id: "HE", from: "H", to: "E", hidden: true },
      { id: "AE", from: "A", to: "E", hidden: true },
      { id: "BF", from: "B", to: "F", hidden: false },
      { id: "CG", from: "C", to: "G", hidden: false },
      { id: "DH", from: "D", to: "H", hidden: false },
    ],
    faces: [
      { id: "front", vertices: ["A", "B", "C", "D"] },
      { id: "back", vertices: ["E", "F", "G", "H"] },
      { id: "left", vertices: ["A", "D", "H", "E"] },
      { id: "right", vertices: ["B", "C", "G", "F"] },
      { id: "top", vertices: ["D", "C", "G", "H"] },
      { id: "bottom", vertices: ["A", "B", "F", "E"] },
    ],
    warnings: [],
  };
};
