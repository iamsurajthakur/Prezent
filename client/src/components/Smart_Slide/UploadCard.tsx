import { useState, useRef, useCallback } from 'react';

type AppState = 'IDLE' | 'UPLOADING' | 'PROCESSING' | 'DONE' | 'ERROR';

interface UploadCardProps {
  state: AppState;
  slideCount: string;
  tone: string;
  isGenerating: boolean;
  onFileAccepted: (f: File) => void;
  onFileRemoved: () => void;
  onFileRejected: (msg: string) => void;
  onSlideCountChange: (v: string) => void;
  onToneChange: (v: string) => void;
  onGenerate: (file: File) => void;
}

export default function UploadCard({
  slideCount,
  tone,
  isGenerating,
  onFileAccepted,
  onFileRemoved,
  onFileRejected,
  onSlideCountChange,
  onToneChange,
  onGenerate,
}: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      const validExt = f.name.endsWith('.pdf') || f.name.endsWith('.docx');

      if (!validTypes.includes(f.type) && !validExt) {
        const msg = 'Only PDF and DOCX files are supported.';
        setError(msg);
        onFileRejected(msg);
        return;
      }
      if (f.size > 20 * 1024 * 1024) {
        const msg = 'File exceeds the 20 MB limit.';
        setError(msg);
        onFileRejected(msg);
        return;
      }

      setFile(f);
      setError('');
      onFileAccepted(f);
    },
    [onFileAccepted, onFileRejected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleRemove = () => {
    setFile(null);
    setError('');
    onFileRemoved();
  };

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-6 mb-5">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
        className={[
          'border-2 border-dashed rounded-xl transition-all duration-200 mb-5',
          file
            ? 'border-white/20 cursor-default p-4'
            : 'cursor-pointer p-8 text-center',
          isDragging
            ? 'border-blue-500 bg-blue-500/6'
            : 'border-slate-600/60 hover:border-slate-500',
        ].join(' ')}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {file ? (
  <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
    <div className="w-10 h-12 rounded-md bg-linear-to-br from-blue-100 to-blue-200 border border-blue-300/60 flex flex-col items-center justify-center shrink-0">
      <span className="text-lg leading-none mb-0.5">
        {file.name.endsWith('.pdf') ? '📄' : '📝'}
      </span>
      <span className="text-[9px] font-bold text-blue-700 tracking-wide">
        {file.name.split('.').pop()?.toUpperCase()}
      </span>
    </div>
    <div className="flex-1 min-w-0 text-left">
      <p className="text-sm font-medium text-slate-200 truncate max-w-[200px] sm:max-w-full">
        {file.name}
      </p>
      <p className="text-xs text-slate-500 mt-0.5">
        {(file.size / 1024).toFixed(1)} KB
      </p>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleRemove();
      }}
      disabled={isGenerating}
      className="bg-red-500/10 border cursor-pointer border-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ml-auto sm:ml-0"
    >
      ✕ Remove
    </button>
  </div>
) : ( 
          <div className="flex flex-col items-center gap-2">
            <div className="text-slate-500 mb-1">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-400">
              Drag & drop your document here
            </p>
            <p className="text-xs text-slate-600">or</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="bg-blue-500/10 border cursor-pointer border-blue-500/30 text-blue-400 text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              Browse File
            </button>
            <p className="text-xs text-slate-600 mt-1">PDF, DOCX · Max 20 MB</p>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/20 rounded-lg px-4 py-2.5 text-sm text-red-400 mb-5">
          <span>⚠</span> {error}
        </div>
      )}

      {/* Controls Row */}
      <div className="flex items-end gap-4 flex-wrap">
        <div className="flex flex-col gap-1.5 flex-1 min-w-27.5">
          <label className="text-[11px] font-semibold text-slate-500 tracking-widest uppercase">
            Slides
          </label>
          <select
            value={slideCount}
            onChange={(e) => onSlideCountChange(e.target.value)}
            disabled={isGenerating}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 font-medium cursor-pointer outline-none focus:ring-1 focus:ring-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/20 transition-colors"
          >
            <option value="auto" className="bg-slate-900">
              Auto
            </option>
            <option value="5" className="bg-slate-900">
              5 slides
            </option>
            <option value="10" className="bg-slate-900">
              10 slides
            </option>
            <option value="15" className="bg-slate-900">
              15 slides
            </option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-32.5">
          <label className="text-[11px] font-semibold text-slate-500 tracking-widest uppercase">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => onToneChange(e.target.value)}
            disabled={isGenerating}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 font-medium cursor-pointer outline-none focus:ring-1 focus:ring-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/20 transition-colors"
          >
            <option value="professional" className="bg-slate-900">
              Professional
            </option>
            <option value="academic" className="bg-slate-900">
              Academic
            </option>
            <option value="casual" className="bg-slate-900">
              Casual
            </option>
          </select>
        </div>

        <button
          onClick={() => file && onGenerate(file)}
          disabled={!file || isGenerating}
          className={[
            'self-end flex cursor-pointer items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
            !file || isGenerating
              ? 'bg-white/6 text-slate-500 cursor-not-allowed'
              : 'bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow-[0_4px_16px_rgba(59,130,246,0.35)] hover:shadow-[0_4px_24px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-[0.98]',
          ].join(' ')}
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
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
              Generating…
            </>
          ) : (
            'Generate Slides →'
          )}
        </button>
      </div>
    </div>
  );
}
