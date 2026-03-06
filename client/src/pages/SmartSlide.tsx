import { getJobStatus, processDocs } from "@/Api/process";
import { uploadFile } from "@/Api/upload";
import ResultCard from "@/components/Smart_Slide/ResultCard";
import UploadCard from "@/components/Smart_Slide/UploadCard";
import { useState, useRef, useEffect } from "react";

type AppState = "IDLE" | "UPLOADING" | "PROCESSING" | "READY" | "ERROR";

const STEPS = [
  "Uploading file…",
  "Extracting content…",
  "Generating outline…",
  "Creating slides…",
];

const MOCK_SLIDES = [
  {
    id: 1,
    title: "Introduction",
    bullets: [
      "Overview of key objectives and goals",
      "Context and background information",
      "Scope and methodology used",
    ],
    tag: "01 / Opening",
  },
  {
    id: 2,
    title: "Core Concepts",
    bullets: [
      "Fundamental principles explored in detail",
      "Supporting evidence and data points",
      "Comparative analysis with existing models",
    ],
    tag: "02 / Analysis",
  },
  {
    id: 3,
    title: "Key Findings",
    bullets: [
      "Primary results derived from research",
      "Statistical significance and confidence intervals",
      "Patterns observed across data sets",
    ],
    tag: "03 / Findings",
  },
  {
    id: 4,
    title: "Recommendations",
    bullets: [
      "Actionable steps based on findings",
      "Short-term and long-term strategies",
      "Resource allocation and priority matrix",
    ],
    tag: "04 / Action",
  },
  {
    id: 5,
    title: "Conclusion",
    bullets: [
      "Summary of major takeaways",
      "Impact and future implications",
      "Next steps and follow-up actions",
    ],
    tag: "05 / Closing",
  },
];


const SmartSlide = () => {
  const [state, setState] = useState<AppState>("IDLE");
  const [slideCount, setSlideCount] = useState("auto");
  const [tone, setTone] = useState("professional");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isGenerating = state === "UPLOADING" || state === "PROCESSING";

  const pollJobStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await getJobStatus(jobId)

        const status = response.data.data.status
        console.log('Job status:', status)

        if(status === 'done'){
          clearInterval(interval)

          setProgress(100)
          setState('READY')
        }

        if(status === 'error'){
          clearInterval(interval)
          setState('ERROR')
        }
      } catch (err: any) {
        console.error(err)
        clearInterval(interval)
        setState('ERROR')
      }
    }, 2000)
    progressRef.current = interval;
  }

  const handleGenerate = async (file: File) => {
    setState("UPLOADING");
    setProgress(0);
    setCurrentStep(0);

    try {
      const formData = new FormData()
      formData.append("userDocs", file)

      const response = await uploadFile(formData)

      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || "Upload failed")
      }

      const signedUrl = response.data.data.signedUrl
      console.log(signedUrl)
      const jobId = response.data.data.jobId
      console.log(jobId)
      const mimeType = response.data.data.file.mimeType
      console.log(mimeType)

      await processDocs({
        signedUrl,
        jobId,
        mimeType
      })

      // Fake processing
      setState("PROCESSING");

      pollJobStatus(jobId)

    } catch (err: any) {
      console.error(err)
      setState("ERROR")
    }

  };

  useEffect(
    () => () => {
      if (progressRef.current) clearInterval(progressRef.current);
    },
    []
  );


  return (
    <div className="p-8 max-w-4xl mx-auto text-slate-100">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-7">
        {/* Left: Icon + Text */}
        <div className="flex items-center gap-4">
          {/* Icon Badge */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_4px_14px_rgba(99,102,241,0.4)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
                <path d="M7 8h2M7 11h5" />
              </svg>
            </div>
            {/* Live pulse dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0f172a] shadow-[0_0_6px_#34d399]" />
          </div>

          {/* Title + Breadcrumb */}
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
              Smart Slide
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Turn documents into polished presentations — instantly.
            </p>
          </div>
        </div>

        {/* Right: Status Pill + Docs Link */}
        <div className="flex items-center gap-3">
          {/* Static info chip */}
          <div className="hidden sm:flex items-center gap-2 bg-white/4 border border-white/8 rounded-lg px-3 py-2 text-xs text-slate-500">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            PDF · DOCX
            <span className="w-px h-3 bg-white/10 mx-0.5" />
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            ~30s
          </div>

          {/* Dynamic state badge */}
          {state === "READY" ? (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              {MOCK_SLIDES.length} slides ready
            </div>
          ) : (state === "UPLOADING" || state === "PROCESSING") ? (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 rounded-lg px-3 py-2 text-xs font-semibold text-blue-400">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Processing…
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-lg px-3 py-2 text-xs font-medium text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              Idle
            </div>
          )}
        </div>
      </div>

      {/* ── Upload & Options Card ── */}
      <UploadCard
        state={state}
        slideCount={slideCount}
        tone={tone}
        isGenerating={isGenerating}
        onFileAccepted={() => setState("IDLE")}
        onFileRemoved={() => setState("IDLE")}
        onFileRejected={() => setState("ERROR")}
        onSlideCountChange={setSlideCount}
        onToneChange={setTone}
        onGenerate={handleGenerate}
      />

      {/* ── Dynamic Result Area ── */}
      <ResultCard
        state={state}
        progress={progress}
        currentStep={currentStep}
        steps={STEPS}
        slides={MOCK_SLIDES}
        onDownload={() => { /* your download logic */ }}
        onRegenerate={() => {
          setState("IDLE");
          setProgress(0);
        }}
      />
    </div>
  );
}

export default SmartSlide