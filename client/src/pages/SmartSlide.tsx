import { getJobStatus, processDocs } from '@/Api/process';
import { trackExport } from '@/Api/stat';
import { uploadFile } from '@/Api/upload';
import ResultCard from '@/components/Smart_Slide/ResultCard';
import UploadCard from '@/components/Smart_Slide/UploadCard';
import { useState, useRef, useEffect } from 'react';

type AppState = 'IDLE' | 'UPLOADING' | 'PROCESSING' | 'DONE' | 'ERROR';

const STEPS = [
  'Uploading file…',
  'Extracting text…',
  'Chunking content…',
  'Generating slides with AI…',
  'Building presentation…',
];

interface Slide {
  id: number;
  title: string;
  bullets: string[];
  tag: string;
}

const SmartSlide = () => {
  const [state, setState] = useState<AppState>('IDLE');
  const [slideCount, setSlideCount] = useState('auto');
  const [tone, setTone] = useState('professional');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [presentationName, setPresentationName] = useState<string>('');

  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressValueRef = useRef(0);
  const isGenerating = state === 'UPLOADING' || state === 'PROCESSING';

  const updateProgress = (val: number) => {
    if (val > progressValueRef.current) {
      progressValueRef.current = val;
      setProgress(val);
    }
  };

  const pollJobStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await getJobStatus(jobId);
        const {
          status,
          step,
          outputUrl,
          slides: rawSlides,
        } = response.data.data;

        if (typeof step === 'number' && !isNaN(step) && step > 0) {
          setCurrentStep(step);
          updateProgress(step * 20);
        }

        if (status === 'done') {
          clearInterval(interval);

          // Transform backend slides → ResultCard shape
          const formattedSlides: Slide[] = (rawSlides ?? []).map(
            (slide: { title: string; bullets: string[] }, index: number) => ({
              id: index + 1,
              title: slide.title,
              bullets: slide.bullets,
              tag: index === 0 ? 'Title' : `Slide ${index + 1}`,
            })
          );

          setSlides(formattedSlides);
          setDownloadUrl(outputUrl);
          updateProgress(100);
          setState('DONE');
        }

        if (status === 'error') {
          clearInterval(interval);
          setState('ERROR');
        }
      } catch (err: any) {
        console.error(err);
        clearInterval(interval);
        setState('ERROR');
      }
    }, 2000);
    progressRef.current = interval;
  };

  const handleGenerate = async (file: File) => {
    setState('UPLOADING');
    setProgress(0);
    progressValueRef.current = 0;
    setCurrentStep(0);
    setSlides([]);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append('userDocs', file);

      const response = await uploadFile(formData);

      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Upload failed');
      }

      const signedUrl = response.data.data.signedUrl;
      const jobId = response.data.data.jobId;
      const mimeType = response.data.data.file.mimeType;
      const userId = response.data.data.userId;
      const originalName = response.data.data.file.originalName;

      setPresentationName(originalName.replace(/\.[^/.]+$/, ''));

      await processDocs({ signedUrl, jobId, mimeType, userId, originalName });

      setState('PROCESSING');
      updateProgress(5);
      setCurrentStep(0);
      pollJobStatus(jobId);
    } catch (err: any) {
      console.error(err);
      setState('ERROR');
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
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-[10px] bg-linear-to-br from-[#00253E] via-[#003356] to-[#00406C] flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Back slide — offset to imply a deck */}
                <rect x="8" y="3" width="13" height="9" rx="1.8" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.18" strokeWidth="0.8" />
                {/* Front slide */}
                <rect x="3" y="7" width="13" height="9" rx="1.8" fill="white" fillOpacity="0.07" stroke="white" strokeOpacity="0.55" strokeWidth="1.1" />
                {/* Content lines */}
                <rect x="5.2" y="10.2" width="7.2" height="1.3" rx="0.65" fill="white" fillOpacity="0.7" />
                <rect x="5.2" y="12.8" width="5" height="1.3" rx="0.65" fill="white" fillOpacity="0.35" />
                {/* AI sparkle — 4-pointed star */}
                <path d="M19.5 1.2 L20.2 3 L22 3.5 L20.2 4 L19.5 5.8 L18.8 4 L17 3.5 L18.8 3 Z" fill="#c4b5fd" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
              Smart Slide
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Turn documents into polished presentations — instantly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white/4 border border-white/8 rounded-lg px-3 py-2 text-xs text-slate-500">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            PDF · DOCX
            <span className="w-px h-3 bg-white/10 mx-0.5" />
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          {/* Status badge — uses DONE */}
          {state === 'DONE' ? (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              slides ready
            </div>
          ) : state === 'UPLOADING' || state === 'PROCESSING' ? (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 rounded-lg px-3 py-2 text-xs font-semibold text-blue-400">
              <svg
                className="animate-spin w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
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

      <UploadCard
        state={state}
        slideCount={slideCount}
        tone={tone}
        isGenerating={isGenerating}
        onFileAccepted={() => setState('IDLE')}
        onFileRemoved={() => setState('IDLE')}
        onFileRejected={() => setState('ERROR')}
        onSlideCountChange={setSlideCount}
        onToneChange={setTone}
        onGenerate={handleGenerate}
      />

      <ResultCard
        state={state}
        progress={progress}
        currentStep={currentStep}
        steps={STEPS}
        slides={slides}
        onDownload={async () => {
          if (downloadUrl) {
            await trackExport(presentationName);

            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'presentation.pptx';
            a.click();

            URL.revokeObjectURL(blobUrl);
          }
        }}
        onRegenerate={() => {
          setState('IDLE');
          setProgress(0);
          setSlides([]);
          setDownloadUrl(null);
        }}
      />
    </div>
  );
};

export default SmartSlide;
