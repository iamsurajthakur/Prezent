type AppState = "IDLE" | "UPLOADING" | "PROCESSING" | "DONE" | "ERROR";

interface Slide {
  id: number;
  title: string;
  bullets: string[];
  tag: string;
}

interface ResultAreaProps {
  state: AppState;
  progress: number;
  currentStep: number;
  steps: string[];
  slides: Slide[];
  onRegenerate: () => void;
  onDownload: () => Promise<void> | void;
}

export default function ResultCard({
  state,
  progress,
  currentStep,
  steps,
  slides,
  onRegenerate,
  onDownload,
}: ResultAreaProps) {

  return (
    <div className="bg-white/3 border border-white/[0.07] rounded-2xl min-h-72 overflow-hidden">

      {/* ── IDLE / ERROR ── */}
      {(state === "IDLE" || state === "ERROR") && (
        <div className="flex flex-col items-center justify-center py-16 px-6 gap-3">
          <div className="opacity-40 mb-2">
            <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
              <rect x="20" y="18" width="80" height="56" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <rect x="10" y="10" width="80" height="56" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <rect x="20" y="22" width="40" height="5" rx="2.5" fill="#334155" />
              <rect x="20" y="33" width="55" height="3" rx="1.5" fill="#1e293b" />
              <rect x="20" y="41" width="48" height="3" rx="1.5" fill="#1e293b" />
              <rect x="20" y="49" width="52" height="3" rx="1.5" fill="#1e293b" />
              <rect x="20" y="57" width="22" height="3" rx="1.5" fill="#1e3a5f" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-500">Upload a document to generate slides.</p>
          <p className="text-xs text-slate-600">Supports PDF and DOCX · Powered by AI</p>
        </div>
      )}

      {/* ── UPLOADING / PROCESSING ── */}
      {(state === "UPLOADING" || state === "PROCESSING") && (
        <div className="p-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">{steps[currentStep]}</span>
            <span className="text-sm font-semibold text-slate-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className={[
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all duration-300",
                  i < currentStep
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                    : i === currentStep
                      ? "bg-blue-500/20 border border-blue-500/50 text-blue-400"
                      : "bg-white/4 border border-white/8 text-slate-600",
                ].join(" ")}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <span className={[
                  "text-sm transition-colors duration-300",
                  i === currentStep ? "text-slate-200 font-medium"
                    : i < currentStep ? "text-slate-500"
                    : "text-slate-600",
                ].join(" ")}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DONE ── */}
      {state === "DONE" && (
        <div className="p-10 flex flex-col items-center gap-8">

          {/* Success icon */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 rounded-full bg-emerald-500/10 blur-xl" />
            <div className="relative w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Your presentation is ready
            </h3>
            <p className="text-sm text-slate-500">
              {slides.length > 0 ? `${slides.length} slides generated` : "Slides generated"} · Ready to export
            </p>
          </div>

          {/* Stats row */}
          {slides.length > 0 && (
            <div className="flex items-center gap-6 px-6 py-3 rounded-xl bg-white/4 border border-white/[0.07]">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xl font-bold text-white">{slides.length}</span>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">Slides</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xl font-bold text-white">
                  {slides.reduce((acc, s) => acc + s.bullets.length, 0)}
                </span>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">Bullets</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xl font-bold text-emerald-400">✓</span>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">AI Ready</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 w-full max-w-sm">
            <button
              onClick={onDownload}
              className="flex-1 flex items-center justify-center gap-2 cursor-pointer bg-linear-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_22px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export PPT
            </button>
            <button
              onClick={onRegenerate}
              className="flex items-center justify-center gap-2 cursor-pointer px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-400 hover:bg-white/8 hover:border-white/20 hover:text-slate-300 transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Redo
            </button>
          </div>

        </div>
      )}
    </div>
  );
}