import { useState, useRef } from "react";

const recentPresentations = [
  { id: 1, name: "Machine Learning Basics", slides: 12, date: "Feb 25" },
  { id: 2, name: "Climate Change Report", slides: 8, date: "Feb 23" },
  { id: 3, name: "Business Proposal Q1", slides: 15, date: "Feb 20" },
];

const STEPS = ["Extracting Ideas", "Generating Slides", "Ready!"];


const SmartSlide = () => {
const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | null) => {
    if (!f) return;
    const valid = /\.(pdf|doc|docx)$/i.test(f.name);
    if (valid) setFile(f);
  };

  const simulateGeneration = () => {
    setGenerating(true);
    setStep(0);
    let s = 0;
    const interval = setInterval(() => {
      s++;
      setStep(s);
      if (s >= STEPS.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setGenerating(false);
        }, 800);
      }
    }, 1400);
  };

  const reset = () => {
    setFile(null);
    setGenerating(false);
    setStep(0);
    setDone(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Turn your documents into presentations instantly</p>
      </div>

      {/* Upload & Generate Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">New Presentation</h2>

        {!done ? (
          <>
            {/* Drop Zone */}
            <div
              onClick={() => !file && fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
              className={`
                border-2 border-dashed rounded-xl transition-all duration-200 mb-4
                ${file
                  ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 cursor-default"
                  : `p-10 text-center cursor-pointer ${dragOver
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    }`
                }
              `}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />

              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 text-sm font-medium">
                      {file.name.endsWith(".pdf") ? "PDF" : "DOC"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{file.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center mx-auto mb-3 text-gray-400">
                    ↑
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Drop your PDF or Word doc here</p>
                  <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                </>
              )}
            </div>

            {/* Progress Steps */}
            {generating && (
              <div className="flex items-center gap-2 mb-4 px-1">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < step ? "bg-blue-400" : i === step ? "bg-blue-500 animate-pulse" : "bg-gray-200 dark:bg-gray-700"
                    }`} />
                    <span className={`text-xs ${i <= step ? "text-blue-500" : "text-gray-400"}`}>{s}</span>
                    {i < STEPS.length - 1 && <span className="text-gray-200 dark:text-gray-700 text-xs">—</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={simulateGeneration}
              disabled={!file || generating}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Generating...
                </>
              ) : "Generate Presentation"}
            </button>
          </>
        ) : (
          /* Done State */
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-xl mx-auto mb-3">
              ✓
            </div>
            <p className="text-base font-medium text-gray-800 dark:text-gray-100">Your presentation is ready!</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">{file?.name?.replace(/\.[^.]+$/, "")} · ~10 slides</p>
            <div className="flex gap-3 justify-center mb-4">
              <button className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                ↓ Download .pptx
              </button>
              <button className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                ↓ Download .pdf
              </button>
            </div>
            <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline">
              + New Presentation
            </button>
          </div>
        )}
      </div>

      {/* Recent Presentations */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent</h2>

        {recentPresentations.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No presentations yet</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentPresentations.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.slides} slides · {p.date}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    .pptx
                  </button>
                  <button className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    .pdf
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartSlide