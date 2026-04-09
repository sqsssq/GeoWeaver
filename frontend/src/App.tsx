import { useEffect } from "react";
import { checkHealth, getCapabilities } from "./lib/api";
import { LeftPanel } from "./components/LeftPanel";
import { Viewer3D } from "./components/Viewer3D";
import { InspectorPanel } from "./components/InspectorPanel";
import { useAppStore } from "./store/useAppStore";

function App() {
  const apiStatus = useAppStore((state) => state.apiStatus);

  useEffect(() => {
    let mounted = true;
    checkHealth()
      .then(() => {
        if (mounted) {
          useAppStore.setState({ apiStatus: "online" });
        }
      })
      .catch(() => {
        if (mounted) {
          useAppStore.setState({
            apiStatus: "offline",
            warnings: [
              ...useAppStore.getState().warnings,
              "Backend unavailable. Local template editing still works, but recognition needs the API.",
            ],
          });
        }
      });

    getCapabilities()
      .then((result) => {
        if (mounted) {
          useAppStore.setState({ aiConfigured: result.vlmConfigured });
        }
      })
      .catch(() => {
        if (mounted) {
          useAppStore.setState({ aiConfigured: false });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen px-6 py-6">
      <div className="mx-auto max-w-[1820px]">
        <header className="mb-6 flex items-center justify-between rounded-3xl border border-white/70 bg-white/75 px-6 py-5 shadow-panel backdrop-blur">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Educational Geometry MVP</div>
            <h1 className="mt-1 text-3xl font-semibold text-ink">ShapeWeaver</h1>
            <p className="mt-2 text-sm text-slate-500">
              Recognize a solid-geometry problem from an image or build a teaching model by hand.
            </p>
          </div>
          <div
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              apiStatus === "online"
                ? "bg-emerald-100 text-emerald-800"
                : apiStatus === "offline"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            API: {apiStatus}
          </div>
        </header>

        <div className="grid grid-cols-[360px_minmax(0,1fr)_360px] gap-6">
          <LeftPanel />
          <Viewer3D />
          <InspectorPanel />
        </div>
      </div>
    </main>
  );
}

export default App;
