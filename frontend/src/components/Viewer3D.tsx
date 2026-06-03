import {
  Billboard,
  Line,
  OrbitControls,
  PerspectiveCamera,
  Plane,
  Text,
} from "@react-three/drei";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useAppStore } from "../store/useAppStore";
import type { Face3D, Vertex3D } from "../types/geometry";
import { Panel } from "./Panel";

interface CameraControlsHandle {
  reset: () => void;
}

const cameraStart = new THREE.Vector3(5.5, 4.5, 6.5);

const DragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

const CameraRig = forwardRef<CameraControlsHandle>(function CameraRig(_, ref) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useImperativeHandle(ref, () => ({
    reset: () => {
      camera.position.copy(cameraStart);
      camera.lookAt(0, 0, 0);
      controlsRef.current?.target.set(0.4, 0.2, 0);
      controlsRef.current?.update();
    },
  }));

  return (
    <>
      <PerspectiveCamera makeDefault position={cameraStart} />
      <OrbitControls ref={controlsRef} enablePan enableRotate enableZoom />
    </>
  );
});

function FaceMesh({ face }: { face: Face3D }) {
  const { geometryModel, selection, setSelection } = useAppStore();
  const vertexMap = useMemo(
    () => Object.fromEntries((geometryModel?.vertices ?? []).map((vertex) => [vertex.id, vertex])),
    [geometryModel],
  );

  const vertices = face.vertices
    .map((id) => vertexMap[id])
    .filter(Boolean)
    .map((vertex) => new THREE.Vector3(vertex.x, vertex.y, vertex.z));

  const geometry = useMemo(() => {
    const positions: number[] = [];
    for (let index = 1; index < vertices.length - 1; index += 1) {
      const a = vertices[0];
      const b = vertices[index];
      const c = vertices[index + 1];
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    }
    const faceGeometry = new THREE.BufferGeometry();
    faceGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    faceGeometry.computeVertexNormals();
    return faceGeometry;
  }, [face.id, vertices]);

  const selected = selection.selectedFaceId === face.id;

  if (!geometryModel || vertices.length < 3) {
    return null;
  }

  return (
    <mesh
      geometry={geometry}
      onClick={(event) => {
        event.stopPropagation();
        setSelection({ selectedFaceId: face.id });
      }}
    >
      <meshStandardMaterial
        color={selected ? "#38bdf8" : "#94a3b8"}
        opacity={selected ? 0.35 : 0.16}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
}

function EdgeHitArea({
  start,
  end,
  edgeId,
}: {
  start: Vertex3D;
  end: Vertex3D;
  edgeId: string;
}) {
  const { selection, setSelection } = useAppStore();
  const midpoint = new THREE.Vector3(
    (start.x + end.x) / 2,
    (start.y + end.y) / 2,
    (start.z + end.z) / 2,
  );
  const direction = new THREE.Vector3(end.x - start.x, end.y - start.y, end.z - start.z);
  const length = direction.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );

  return (
    <mesh
      position={midpoint}
      quaternion={quaternion}
      onClick={(event) => {
        event.stopPropagation();
        setSelection({ selectedEdgeId: edgeId });
      }}
    >
      <cylinderGeometry args={[0.08, 0.08, length, 10]} />
      <meshBasicMaterial color={selection.selectedEdgeId === edgeId ? "#f97316" : "#000000"} opacity={0.001} transparent />
    </mesh>
  );
}

function VertexHandle({ vertex }: { vertex: Vertex3D }) {
  const { editMode, selection, setSelection, patchVertex, persistGeometryModel } = useAppStore();
  const [dragging, setDragging] = useState(false);

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging || !editMode) {
      return;
    }

    event.stopPropagation();
    const point = new THREE.Vector3();
    event.ray.intersectPlane(DragPlane, point);
    patchVertex(vertex.id, {
      x: Number(point.x.toFixed(2)),
      y: Number(point.y.toFixed(2)),
    });
  };

  return (
    <group position={[vertex.x, vertex.y, vertex.z]}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          setSelection({ selectedVertexId: vertex.id });
        }}
        onPointerDown={(event) => {
          if (!editMode) {
            return;
          }
          event.stopPropagation();
          setDragging(true);
          setSelection({ selectedVertexId: vertex.id });
        }}
        onPointerMove={(event) => void onPointerMove(event)}
        onPointerUp={() => {
          setDragging(false);
          void persistGeometryModel();
        }}
        onPointerOut={() => {
          if (dragging) {
            void persistGeometryModel();
          }
          setDragging(false);
        }}
      >
        <sphereGeometry args={[selection.selectedVertexId === vertex.id ? 0.14 : 0.1, 24, 24]} />
        <meshStandardMaterial color={selection.selectedVertexId === vertex.id ? "#f97316" : "#0f766e"} />
      </mesh>
      <Billboard>
        <Text color="#0f172a" fontSize={0.18} outlineColor="#ffffff" outlineWidth={0.015} position={[0, 0.26, 0]}>
          {vertex.label ?? vertex.id}
        </Text>
      </Billboard>
    </group>
  );
}

function GeometryScene() {
  const { geometryModel, selection, setSelection } = useAppStore();
  const vertexMap = useMemo(
    () => Object.fromEntries((geometryModel?.vertices ?? []).map((vertex) => [vertex.id, vertex])),
    [geometryModel],
  );

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight intensity={1.6} position={[4, 6, 3]} />
      <gridHelper args={[20, 20, "#cbd5e1", "#e2e8f0"]} position={[0, -2.2, 0]} />
      <Plane
        args={[20, 20]}
        position={[0, 0, -2.4]}
        onClick={() => setSelection({})}
      >
        <meshBasicMaterial color="#ffffff" opacity={0.01} transparent />
      </Plane>

      {(geometryModel?.faces ?? []).map((face) => (
        <FaceMesh key={face.id} face={face} />
      ))}

      {(geometryModel?.edges ?? []).map((edge) => {
        const start = vertexMap[edge.from];
        const end = vertexMap[edge.to];
        if (!start || !end) {
          return null;
        }
        const selected = selection.selectedEdgeId === edge.id;
        return (
          <group key={edge.id}>
            <Line
              color={selected ? "#f97316" : edge.hidden ? "#94a3b8" : "#0f172a"}
              dashSize={edge.hidden ? 0.15 : 0}
              dashed={edge.hidden}
              gapSize={edge.hidden ? 0.1 : 0}
              lineWidth={selected ? 2.4 : 1.8}
              points={[
                [start.x, start.y, start.z],
                [end.x, end.y, end.z],
              ]}
            />
            <EdgeHitArea edgeId={edge.id} end={end} start={start} />
          </group>
        );
      })}

      {(geometryModel?.vertices ?? []).map((vertex) => (
        <VertexHandle key={vertex.id} vertex={vertex} />
      ))}
    </>
  );
}

export function Viewer3D() {
  const controlsRef = useRef<CameraControlsHandle>(null);
  const {
    geometryModel,
    editMode,
    mode,
    uploadedImageUrl,
    isRecognizing,
    isGenerating,
    lastGeneratedAt,
    lastGenerationSource,
    setEditMode,
    recognizeCurrentImage,
    generateCurrentModel,
    initializeManualTemplate,
    resetAll,
  } = useAppStore();

  const runPrimaryAction = async () => {
    if (mode === "recognize" && uploadedImageUrl) {
      await recognizeCurrentImage();
      return;
    }

    if (mode === "manual") {
      await initializeManualTemplate();
      return;
    }

    await generateCurrentModel();
  };

  return (
    <Panel
      title="3D Geometry Workspace"
      subtitle={
        geometryModel
          ? `Interactive ${geometryModel.templateType} model with shared student and teacher editing tools.`
          : "Start from image recognition or manual template creation, then the generated 3D model will appear here."
      }
      className="h-full"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Rotate, zoom, pan, select objects, and {editMode ? "drag vertices directly in the scene." : "inspect the generated model."}
        </div>
        <button
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={() => controlsRef.current?.reset()}
          type="button"
        >
          Reset View
        </button>
      </div>
      <div className="mb-3 grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-600">
          Current model: <span className="font-semibold text-ink">{geometryModel?.templateType ?? "empty"}</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-600">
          Source: <span className="font-semibold text-ink">{lastGenerationSource}</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-600">
          Last generated: <span className="font-semibold text-ink">{lastGeneratedAt ?? "not yet"}</span>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          disabled={isRecognizing || isGenerating}
          onClick={() => void runPrimaryAction()}
          type="button"
        >
          {mode === "recognize" && uploadedImageUrl
            ? isRecognizing
              ? "Recognizing..."
              : "Recognize Image"
            : mode === "manual"
              ? isGenerating
                ? "Building..."
                : "Build Template"
              : isGenerating
                ? "Generating..."
                : "Generate Model"}
        </button>
        <button
          className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          disabled={isGenerating}
          onClick={() => void generateCurrentModel()}
          type="button"
        >
          {isGenerating ? "Updating..." : "Generate 3D Model"}
        </button>
        <button
          className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
            editMode ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700"
          }`}
          onClick={() => setEditMode(!editMode)}
          type="button"
        >
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </button>
        <button
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={resetAll}
          type="button"
        >
          Reset Workspace
        </button>
      </div>
      <div className="relative h-[720px] overflow-hidden rounded-3xl border border-slate-200 bg-[radial-gradient(circle_at_top,#ffffff,#dbeafe)]">
        <Canvas>
          <CameraRig ref={controlsRef} />
          <GeometryScene />
        </Canvas>
        {isGenerating ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
            <div className="max-w-md rounded-3xl border border-white/80 bg-white/90 px-6 py-5 text-center shadow-panel">
              <div className="text-lg font-semibold text-ink">Generating 3D model</div>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                Building a template-based geometry model from the current recognition or manual selection.
              </div>
            </div>
          </div>
        ) : !geometryModel ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="max-w-md rounded-3xl border border-white/80 bg-white/88 px-6 py-5 text-center shadow-panel backdrop-blur">
              <div className="text-lg font-semibold text-ink">No 3D model yet</div>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                Upload a geometry problem and recognize it, or switch to manual mode and build a template.
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
