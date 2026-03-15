import { deletePpt } from "@/Api/process";
import { getPresentation } from "@/Api/stat";
import { useState, useEffect } from "react";

interface Presentation {
  _id: string;
  userId: string
  name: string;
  slides: number;
  outputUrl: string;
  createdAt: string
  updatedAt: string
}

const THUMB_COLORS = [
  "bg-[#1e3a5f]",
  "bg-[#1a3a2e]",
  "bg-[#3a1e3a]",
  "bg-[#3a2e1a]",
  "bg-[#1e2e3a]",
  "bg-[#3a1e1e]",
];

function getThumbColor(id: string): string | undefined {
  const index = id.charCodeAt(id.length - 1) % THUMB_COLORS.length;
  return THUMB_COLORS[index];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
    <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const SlideIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <line x1="4" y1="14" x2="12" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="8" y1="13" x2="8" y2="14" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const MoreIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="3" cy="8" r="1.2" fill="currentColor" />
    <circle cx="8" cy="8" r="1.2" fill="currentColor" />
    <circle cx="13" cy="8" r="1.2" fill="currentColor" />
  </svg>
);

const SlideThumbMock = () => (
  <svg width="42" height="32" viewBox="0 0 42 32" fill="none" className="opacity-20">
    <rect width="42" height="32" rx="3" fill="white" />
    <rect x="4" y="4" width="20" height="3" rx="1.5" fill="#0d1b2a" />
    <rect x="4" y="10" width="34" height="2" rx="1" fill="#0d1b2a" />
    <rect x="4" y="14" width="28" height="2" rx="1" fill="#0d1b2a" />
    <rect x="4" y="18" width="32" height="2" rx="1" fill="#0d1b2a" />
    <rect x="4" y="24" width="12" height="5" rx="1.5" fill="#0d1b2a" />
  </svg>
);

const SkeletonCard = () => (
  <div className="bg-[#0f2236] border border-white/[0.07] rounded-xl overflow-hidden animate-pulse">
    <div className="h-32 bg-white/4" />
    <div className="px-4 pt-3.5 pb-4 space-y-2.5">
      <div className="h-3 bg-white/6 rounded w-3/4" />
      <div className="h-2.5 bg-white/4 rounded w-1/2" />
    </div>
  </div>
);

type Tab = "all" | "recent";

export default function Library() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "recent", label: "Recent" },
  ];

  // ── Fetch from backend ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getPresentation()
        const presentation = res.data

        setPresentations(presentation);
      } catch (err) {
        setError("Could not load your presentations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPresentations();
  }, []);

  // ── Filter logic ─────────────────────────────────────────────────────────────
  const filtered = presentations
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      if (activeTab === "recent") {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return new Date(p.createdAt) >= threeDaysAgo;
      }
      return true;
    });

  const handleDownload = async (url: string, name: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${name}.pptx`; // correct filename + extension
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(blobUrl); // cleanup
    } catch {
      alert("Failed to download. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
  setPresentations((prev) => prev.filter((p) => p._id !== id));
  setActiveMenu(null);

  try {
    await deletePpt(id);
  } catch {
    // If it fails, re-fetch to restore correct state
    const res = await getPresentation();
    setPresentations(res.data);
    alert("Failed to delete. Please try again.");
  }
};

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-[#0d1b2a] text-slate-200 px-4 sm:px-8 py-6 sm:py-8"
      onClick={() => setActiveMenu(null)}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-7">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-100 tracking-tight">Library</h1>
          <p className="text-xs text-slate-500 mt-1">
            {loading ? "Loading..." : `${filtered.length} presentation${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 flex items-center">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search presentations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f2236] border border-white/8 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-blue-400/50 transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 sm:mb-6 bg-[#0f2236] border border-white/6 rounded-xl p-1 w-full sm:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 cursor-pointer sm:flex-none px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab.key
                ? "bg-blue-500/15 text-blue-400"
                : "text-slate-500 hover:text-slate-400"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6 text-xs">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
            <line x1="8" y1="5" x2="8" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="8" cy="11.5" r="0.8" fill="currentColor" />
          </svg>
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-auto underline text-red-400 hover:text-red-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Skeleton loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-72 gap-3">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="8" width="36" height="28" rx="4" stroke="#334155" strokeWidth="2" />
            <line x1="16" y1="44" x2="32" y2="44" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="36" x2="24" y2="44" stroke="#334155" strokeWidth="2" />
          </svg>
          <p className="text-sm text-slate-500">
            {search ? "No presentations found" : "No presentations yet"}
          </p>
          <p className="text-xs text-slate-600">
            {search ? "Try a different search term" : "Generate your first presentation to see it here"}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((pres) => (
            <div
              key={pres._id}
              className="bg-[#0f2236] border border-white/[0.07] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-blue-400/30 hover:-translate-y-0.5 relative"
              onClick={() => setActiveMenu(null)}
            >
              {/* Thumbnail */}
              <div className={`h-32 ${getThumbColor(pres._id)} flex items-center justify-center relative overflow-hidden`}>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <SlideThumbMock />

                {/* Three-dot menu */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === pres._id ? null : pres._id);
                  }}
                  className="absolute cursor-pointer top-2 right-2 bg-[#0d1b2a]/70 border border-white/10 rounded-md p-1.5 text-slate-400 hover:text-slate-200 transition-colors flex items-center"
                >
                  <MoreIcon />
                </button>

                {/* Dropdown */}
                {activeMenu === pres._id && (
                  <div
                    className="absolute top-9 right-2 bg-[#0f2236] border border-white/10 rounded-lg p-1 z-10 min-w-34 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        handleDownload(pres.outputUrl, pres.name);
                        setActiveMenu(null);
                      }}
                      className="block cursor-pointer w-full text-left px-3 py-1.5 text-xs rounded-md text-slate-300 hover:bg-white/6 transition-colors"
                    >
                      Download
                    </button>
                    <button
  onClick={() => handleDelete(pres._id)}
  className="block w-full cursor-pointer text-left px-3 py-1.5 text-xs rounded-md text-red-400 hover:bg-white/6 transition-colors"
>
  Delete
</button>
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="px-4 pt-3.5 pb-4">
                <p className="text-sm font-medium text-slate-200 leading-snug mb-2.5 truncate">
                  {pres.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <SlideIcon />
                    {pres.slides} slides
                  </span>
                  <span className="text-[11px] text-slate-500">{formatDate(pres.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}