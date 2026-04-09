import { useAppStore } from "../store/useAppStore";
import type { AppMode, TemplateType } from "../types/geometry";
import { Panel } from "./Panel";

const modes: { label: string; value: AppMode }[] = [
  { label: "Recognize from Image", value: "recognize" },
  { label: "Create Manually", value: "manual" },
];

const templates: TemplateType[] = ["cuboid", "prism", "pyramid"];

export function LeftPanel() {
  const {
    mode,
    uploadedImageUrl,
    recognizedText,
    candidateShape,
    selectedTemplate,
    recognizedDiagram,
    isRecognizing,
    isGenerating,
    useAiAssistance,
    aiConfigured,
    setMode,
    setUploadedImage,
    setRecognizedText,
    setSelectedTemplate,
    setUseAiAssistance,
    recognizeCurrentImage,
    generateCurrentModel,
    initializeManualTemplate,
    resetAll,
  } = useAppStore();

  const onGenerate = async () => {
    if (mode === "manual") {
      await initializeManualTemplate();
      return;
    }
    await generateCurrentModel();
  };

  return (
    <Panel title="Workflow" subtitle="Upload a diagram or start from a classroom template." className="h-full">
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Mode</label>
          <div className="grid grid-cols-2 gap-2">
            {modes.map((option) => (
              <button
                key={option.value}
                className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                  mode === option.value
                    ? "border-accent bg-accent text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => setMode(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "recognize" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3">
              <div>
                <div className="text-sm font-medium text-ink">AI recognition enhancement</div>
                <div className="text-xs text-slate-500">
                  {aiConfigured ? "Qwen is configured. You can switch AI help on or off." : "No VLM configured. Local recognition only."}
                </div>
              </div>
              <button
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  useAiAssistance && aiConfigured ? "bg-accent text-white" : "bg-slate-200 text-slate-700"
                }`}
                disabled={!aiConfigured}
                onClick={() => setUseAiAssistance(!useAiAssistance)}
                type="button"
              >
                {useAiAssistance && aiConfigured ? "AI On" : "AI Off"}
              </button>
            </div>
            <label className="block text-sm font-medium text-slate-700">Problem Image</label>
            <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600 hover:border-accent hover:bg-emerald-50">
              <input
                accept="image/png,image/jpg,image/jpeg"
                className="hidden"
                type="file"
                onChange={(event) => setUploadedImage(event.target.files?.[0])}
              />
              Upload PNG/JPG/JPEG
            </label>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {uploadedImageUrl ? (
                <img alt="Uploaded geometry problem" className="h-48 w-full object-contain" src={uploadedImageUrl} />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                  Image preview will appear here.
                </div>
              )}
            </div>
            <button
              className="w-full rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isRecognizing}
              onClick={() => void recognizeCurrentImage()}
              type="button"
            >
              {isRecognizing ? "Recognizing..." : "Recognize"}
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Teacher mode skips image recognition and starts from a template you can edit live.
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Problem Text</label>
            <span className="text-xs text-slate-400">Always editable</span>
          </div>
          <textarea
            className="h-40 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-accent"
            onChange={(event) => setRecognizedText(event.target.value)}
            placeholder="Recognized problem text will appear here. You can also type the question manually."
            value={recognizedText}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-1">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Template</label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
              onChange={(event) => setSelectedTemplate(event.target.value as TemplateType)}
              value={selectedTemplate}
            >
              {templates.map((template) => (
                <option key={template} value={template}>
                  {template}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            Candidate shape: <span className="font-semibold text-ink">{candidateShape}</span>
          </div>
        </div>

        {recognizedDiagram ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 text-sm font-semibold text-ink">Recognition Summary</div>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
              <div className="rounded-xl bg-white px-3 py-2">
                Vertices: <span className="font-semibold text-ink">{recognizedDiagram.vertices2d.length}</span>
              </div>
              <div className="rounded-xl bg-white px-3 py-2">
                Edges: <span className="font-semibold text-ink">{recognizedDiagram.edges2d.length}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Recognition is approximate. You can correct text, switch templates, and keep editing in 3D.
            </div>
            {recognizedDiagram.diagramSummary ? (
              <div className="mt-3 rounded-xl bg-white px-3 py-3 text-sm text-slate-600">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">AI / Diagram Summary</div>
                <div>{recognizedDiagram.diagramSummary}</div>
              </div>
            ) : null}
            {recognizedDiagram.pointLabels.length > 0 || recognizedDiagram.hiddenEdgeSuggestions.length > 0 ? (
              <div className="mt-3 grid gap-2 text-sm text-slate-600">
                {recognizedDiagram.pointLabels.length > 0 ? (
                  <div className="rounded-xl bg-white px-3 py-3">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Point Labels</div>
                    <div>{recognizedDiagram.pointLabels.join(", ")}</div>
                  </div>
                ) : null}
                {recognizedDiagram.hiddenEdgeSuggestions.length > 0 ? (
                  <div className="rounded-xl bg-white px-3 py-3">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Hidden Edge Suggestions</div>
                    <div>{recognizedDiagram.hiddenEdgeSuggestions.join(", ")}</div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          <button
            className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isGenerating}
            onClick={() => void onGenerate()}
            type="button"
          >
            {isGenerating ? "Generating..." : "Generate 3D Model"}
          </button>
          <button
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
            onClick={resetAll}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </Panel>
  );
}
