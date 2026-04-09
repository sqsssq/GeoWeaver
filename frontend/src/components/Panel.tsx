import type { PropsWithChildren } from "react";

interface PanelProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  className?: string;
}

export function Panel({ title, subtitle, className = "", children }: PanelProps) {
  return (
    <section className={`rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-panel backdrop-blur ${className}`}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

