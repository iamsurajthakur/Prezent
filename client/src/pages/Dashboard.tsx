import { useNavigate } from "react-router-dom";

// ── mock data (replace with real API calls) ──────────────────────────────────
const USER_NAME = "Suraj";

const stats = [
  {
    label: "Presentations",
    value: 3,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    label: "Slides Generated",
    value: 35,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
      </svg>
    ),
  },
  {
    label: "Docs Uploaded",
    value: 5,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  },
];

const recentPresentations = [
  { id: 1, name: "Machine Learning Basics", slides: 12, date: "Feb 25" },
  { id: 2, name: "Climate Change Report", slides: 8, date: "Feb 23" },
  { id: 3, name: "Business Proposal Q1", slides: 15, date: "Feb 20" },
];

const checklistItems = [
  { id: 1, label: "Create your account", done: true },
  { id: 2, label: "Upload your first document", done: true },
  { id: 3, label: "Generate your first presentation", done: false },
  { id: 4, label: "Download as .pptx or .pdf", done: false },
];
// ─────────────────────────────────────────────────────────────────────────────

const PresentationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M8 21h8M12 17v4"/>
  </svg>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const completedCount = checklistItems.filter((i) => i.done).length;
  const progress = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            Good morning, {USER_NAME} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Here's what's going on with your presentations
          </p>
        </div>
        <button
          onClick={() => navigate("/smartslide")}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-xl w-full sm:w-auto"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Presentation
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#131929] border border-gray-800 rounded-2xl p-4 sm:p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-semibold text-white leading-none">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

        {/* Recent Presentations — 2/3 on large, full on small */}
        <div className="lg:col-span-2 bg-[#131929] border border-gray-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Recent Presentations</h2>
            <button
              onClick={() => navigate("/library")}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all
            </button>
          </div>

          {recentPresentations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No presentations yet.</p>
              <button
                onClick={() => navigate("/smartslide")}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Create your first one →
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Table header — hidden on very small screens */}
              <div className="hidden sm:grid grid-cols-[1fr_60px_65px_90px] text-xs text-gray-500 px-3 pb-2 border-b border-gray-800 uppercase tracking-wide">
                <span>Name</span>
                <span>Slides</span>
                <span>Date</span>
                <span></span>
              </div>

              {recentPresentations.map((p) => (
                <div key={p.id} className="group rounded-xl hover:bg-white/5 transition-colors">
                  {/* Desktop row */}
                  <div className="hidden sm:grid grid-cols-[1fr_60px_65px_90px] items-center px-3 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0">
                        <PresentationIcon />
                      </div>
                      <span className="text-sm text-gray-200 font-medium truncate">{p.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{p.slides}</span>
                    <span className="text-sm text-gray-500">{p.date}</span>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-2 py-1 text-xs border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
                        .pptx
                      </button>
                      <button className="px-2 py-1 text-xs border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
                        .pdf
                      </button>
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="flex sm:hidden items-center justify-between p-3 border-b border-gray-800/60 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0">
                        <PresentationIcon />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-200 font-medium truncate">{p.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{p.slides} slides · {p.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0 ml-3">
                      <button className="px-2 py-1 text-xs border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
                        .pptx
                      </button>
                      <button className="px-2 py-1 text-xs border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
                        .pdf
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Getting Started Checklist — 1/3 on large, full on small */}
        <div className="bg-[#131929] border border-gray-800 rounded-2xl p-5 sm:p-6 flex flex-col">
          <h2 className="text-base font-semibold text-white mb-1">Getting Started</h2>
          <p className="text-xs text-gray-500 mb-4">{completedCount} of {checklistItems.length} completed</p>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-800 rounded-full mb-5">
            <div
              className="h-1.5 bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {checklistItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  item.done ? "bg-blue-600 border-blue-600" : "border-gray-700 bg-transparent"
                }`}>
                  {item.done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${item.done ? "text-gray-500 line-through" : "text-gray-300"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/smartslide")}
            className="mt-6 w-full py-2.5 rounded-xl border border-blue-600/40 text-blue-400 text-sm hover:bg-blue-600/10 transition-colors"
          >
            Continue →
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;