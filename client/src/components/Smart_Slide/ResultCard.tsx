import { useState } from "react";

type AppState = "IDLE" | "UPLOADING" | "PROCESSING" | "READY" | "ERROR";

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
  onDownload: () => void;
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
  // Lives here now — only this component cares about it
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeSlide = slides[currentSlide]

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
                <div
                  className={[
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all duration-300",
                    i < currentStep
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                      : i === currentStep
                        ? "bg-blue-500/20 border border-blue-500/50 text-blue-400"
                        : "bg-white/4 border border-white/8 text-slate-600",
                  ].join(" ")}
                >
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <span
                  className={[
                    "text-sm transition-colors duration-300",
                    i === currentStep
                      ? "text-slate-200 font-medium"
                      : i < currentStep
                        ? "text-slate-500"
                        : "text-slate-600",
                  ].join(" ")}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── READY ── */}
      {state === "READY" && (
        <div className="p-7 flex flex-col gap-6">

          {/* Preview: Slide Card + Thumbnail Strip */}
          <div className="flex gap-5 items-start">
            <div className="flex-1 relative bg-white/5 border border-white/10 rounded-xl p-8 overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
              <p className="text-[11px] font-semibold text-blue-400 tracking-widest uppercase mb-4">
                {activeSlide?.tag}
              </p>
              <h2 className="text-xl font-bold text-white tracking-tight mb-5">
                {activeSlide?.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {activeSlide?.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.75" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex flex-col gap-2 w-40 shrink-0">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(i)}
                  className={[
                    "text-left px-3 py-2.5 rounded-lg border transition-all duration-150",
                    i === currentSlide
                      ? "bg-blue-500/10 border-blue-500/40"
                      : "bg-white/3 border-white/[0.07] hover:bg-white/6 hover:border-white/20",
                  ].join(" ")}
                >
                  <p className="text-[10px] font-bold text-slate-500 mb-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{slide.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-5">
            <button
              onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
              disabled={currentSlide === 0}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-400 hover:border-white/20 hover:text-slate-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-sm font-semibold text-slate-500 w-14 text-center">
              {currentSlide + 1} / {slides.length}
            </span>
            <button
              onClick={() => setCurrentSlide((p) => Math.min(slides.length - 1, p + 1))}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-400 hover:border-white/20 hover:text-slate-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pb-1">
            <button
              onClick={onDownload}
              className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold px-8 py-3 rounded-xl shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_22px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PPT
            </button>
            <button
              onClick={onRegenerate}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-400 hover:bg-white/8 hover:border-white/20 hover:text-slate-300 transition-all duration-200"
            >
              ↺ Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}