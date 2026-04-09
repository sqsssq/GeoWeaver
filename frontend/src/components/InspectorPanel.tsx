import { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import { Panel } from "./Panel";

export function InspectorPanel() {
  const {
    geometryModel,
    selection,
    warnings,
    editMode,
    setEditMode,
    patchVertex,
    toggleEdgeHidden,
    setSelection,
  } = useAppStore();

  const selectedVertex = useMemo(
    () => geometryModel?.vertices.find((vertex) => vertex.id === selection.selectedVertexId),
    [geometryModel, selection.selectedVertexId],
  );

  const selectedEdge = useMemo(
    () => geometryModel?.edges.find((edge) => edge.id === selection.selectedEdgeId),
    [geometryModel, selection.selectedEdgeId],
  );

  if (!geometryModel) {
    return (
      <Panel title="Inspector" subtitle="Selection, editing, and model warnings." className="h-full">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No model has been generated yet. Once you create or generate a model, vertex, edge, and face controls will appear here.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 text-sm font-semibold text-ink">Current status</div>
            <div className="text-sm text-slate-600">Model: empty</div>
            <div className="mt-2 text-sm text-slate-600">Edit mode is available after a model is created.</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 text-sm font-semibold text-ink">Warnings</div>
            <ul className="space-y-2 text-sm text-slate-600">
              {warnings.length > 0 ? warnings.map((warning, index) => <li key={`${warning}-${index}`}>• {warning}</li>) : <li>• No current warnings.</li>}
            </ul>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Inspector" subtitle="Selection, editing, and model warnings." className="h-full">
      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div>
            <div className="text-sm font-medium text-ink">Edit mode</div>
            <div className="text-xs text-slate-500">Drag vertices in the canvas or refine values here.</div>
          </div>
          <button
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              editMode ? "bg-accent text-white" : "bg-slate-200 text-slate-700"
            }`}
            onClick={() => setEditMode(!editMode)}
            type="button"
          >
            {editMode ? "On" : "Off"}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-ink">Model Summary</div>
            <div className="text-xs text-slate-500">{geometryModel.templateType}</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600">
              V: <span className="font-semibold text-ink">{geometryModel.vertices.length}</span>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600">
              E: <span className="font-semibold text-ink">{geometryModel.edges.length}</span>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600">
              F: <span className="font-semibold text-ink">{geometryModel.faces.length}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold text-ink">Vertices</div>
          <div className="max-h-48 space-y-2 overflow-auto pr-1">
            {geometryModel.vertices.map((vertex) => (
              <button
                key={vertex.id}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${
                  selection.selectedVertexId === vertex.id ? "bg-emerald-100 text-emerald-950" : "bg-slate-50 text-slate-700"
                }`}
                onClick={() => setSelection({ selectedVertexId: vertex.id })}
                type="button"
              >
                <span>{vertex.label ?? vertex.id}</span>
                <span className="text-xs text-slate-500">
                  {vertex.x.toFixed(1)}, {vertex.y.toFixed(1)}, {vertex.z.toFixed(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {selectedVertex ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 text-sm font-semibold text-ink">Selected Vertex</div>
            <div className="space-y-3">
              <label className="block text-sm text-slate-600">
                Label
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  onChange={(event) => patchVertex(selectedVertex.id, { label: event.target.value })}
                  onBlur={() => void useAppStore.getState().persistGeometryModel()}
                  value={selectedVertex.label ?? ""}
                />
              </label>
              {(["x", "y", "z"] as const).map((axis) => (
                <label key={axis} className="block text-sm text-slate-600">
                  {axis.toUpperCase()}
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    onBlur={() => void useAppStore.getState().persistGeometryModel()}
                    onChange={(event) => patchVertex(selectedVertex.id, { [axis]: Number(event.target.value) || 0 })}
                    step="0.1"
                    type="number"
                    value={selectedVertex[axis]}
                  />
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold text-ink">Edges</div>
          <div className="max-h-48 space-y-2 overflow-auto pr-1">
            {geometryModel.edges.map((edge) => (
              <div
                key={edge.id}
                className={`rounded-xl border px-3 py-2 ${
                  selection.selectedEdgeId === edge.id ? "border-accent bg-emerald-50" : "border-slate-100 bg-slate-50"
                }`}
              >
                <button
                  className="mb-2 flex w-full items-center justify-between text-left text-sm text-slate-700"
                  onClick={() => setSelection({ selectedEdgeId: edge.id })}
                  type="button"
                >
                  <span>{edge.id}</span>
                  <span className="text-xs text-slate-500">
                    {edge.from} → {edge.to}
                  </span>
                </button>
                <button
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                  onClick={() => void toggleEdgeHidden(edge.id)}
                  type="button"
                >
                  {edge.hidden ? "Show edge" : "Hide edge"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold text-ink">Faces</div>
          <div className="space-y-2">
            {geometryModel.faces.map((face) => (
              <button
                key={face.id}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                  selection.selectedFaceId === face.id ? "bg-sky-100 text-sky-900" : "bg-slate-50 text-slate-700"
                }`}
                onClick={() => setSelection({ selectedFaceId: face.id })}
                type="button"
              >
                {face.id}: {face.vertices.join(", ")}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 text-sm font-semibold text-ink">Warnings</div>
          <ul className="space-y-2 text-sm text-slate-600">
            {warnings.length > 0 ? warnings.map((warning, index) => <li key={`${warning}-${index}`}>• {warning}</li>) : <li>• No current warnings.</li>}
          </ul>
          {selectedEdge ? (
            <div className="mt-3 text-xs text-slate-500">
              Selected edge: {selectedEdge.id} ({selectedEdge.hidden ? "hidden" : "visible"})
            </div>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
