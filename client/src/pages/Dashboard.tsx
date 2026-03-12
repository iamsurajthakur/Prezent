import { getRecentActivity, getRecentPresentation, getStats } from '@/Api/stat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const USER_NAME = 'Suraj';

export interface StatItem {
  label: string;
  value: string | number;
  badge?: string;
  badgePositive?: boolean;
  icon: React.ReactNode;
  accent: string;
  accentBg: string;
}

interface RecentPresentation {
  id: string;
  name: string;
  slides: number;
  date: string;
  outputUrl: string;
}

interface Activity {
  id: string;
  type: 'upload' | 'generate' | 'export';
  label: string;
  subject: string;
  context: string | null;
  time: string;
}

interface Stats {
  presentationGenerated: number;
  slidesGenerated: number;
  docsUploaded: number;
  totalExports: number;
  aiGenerations: number;
  lastActivity: string | null;
  weeklyActivity: { day: string; count: number }[];
}

const getChartData = (weeklyActivity: { day: string; count: number }[]) => {
  const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Get today's index and reorder so today is last
  const todayIndex = new Date().getDay(); // 0=Sun, 1=Mon ... 6=Sat
  const todayAdjusted = todayIndex === 0 ? 6 : todayIndex - 1; // convert to Mon=0 ... Sun=6

  // Slice and reorder: days after today go first, today goes last
  const orderedDays = [
    ...ALL_DAYS.slice(todayAdjusted + 1), // days after today
    ...ALL_DAYS.slice(0, todayAdjusted + 1), // today and days before
  ];

  return orderedDays.map((day) => {
    const found = weeklyActivity.find((d) => d.day === day);
    return { day, count: found?.count ?? 0 };
  });
};

const getActivityStyle = (type: string) => {
  switch (type) {
    case 'upload':
      return {
        accent: '#60a5fa',
        accentBg: 'rgba(96,165,250,0.12)',
        icon: (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        ),
      };
    case 'generate':
      return {
        accent: '#a78bfa',
        accentBg: 'rgba(167,139,250,0.12)',
        icon: (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        ),
      };
    case 'export':
      return {
        accent: '#34d399',
        accentBg: 'rgba(52,211,153,0.12)',
        icon: (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        ),
      };
    default:
      return {
        accent: '#60a5fa',
        accentBg: 'rgba(96,165,250,0.12)',
        icon: null,
      };
  }
};

// Mini Bar Chart Component
const MiniBarChart = ({ data }: any) => {
  const max = Math.max(...data.map((d: any) => d.count));
  const totalGenerated = data.reduce((sum: any, d: any) => sum + d.count, 0);
  const peak = data.reduce((a: any, b: any) => (a.count > b.count ? a : b));

  return (
    <div className="px-5 py-4 border-b border-white/6">
      {/* Mini header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/50">
            Slides this week
          </span>
          <span className="text-xs font-semibold text-white/80">
            {totalGenerated}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-400/80">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          Peak: {peak.day} ({peak.count})
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1.5 h-14">
        {data.map((d: any, i: any) => {
          const heightPct = max > 0 ? (d.count / max) * 100 : 0;
          const isToday = i === data.length - 1;
          const isPeak = d.count === max;
          return (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-1 group/bar"
            >
              <div
                className="relative w-full flex items-end"
                style={{ height: '44px' }}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                  <div className="bg-[#1e2a3a] border border-white/12 rounded-md px-1.5 py-0.5 text-[9px] font-semibold text-white whitespace-nowrap shadow-xl">
                    {d.count} slides
                  </div>
                </div>
                {/* Bar */}
                <div
                  className="w-full rounded-t-md transition-all duration-300 group-hover/bar:opacity-100"
                  style={{
                    height: `${Math.max(heightPct, 6)}%`,
                    background: isPeak
                      ? 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)'
                      : isToday
                        ? 'rgba(99,102,241,0.5)'
                        : 'rgba(255,255,255,0.07)',
                    boxShadow: isPeak ? '0 0 8px rgba(96,165,250,0.3)' : 'none',
                  }}
                />
              </div>
              <span
                className={`text-[9px] font-medium ${isToday ? 'text-indigo-400' : 'text-white/25'}`}
              >
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const formatRelativeTime = (date: string | null) => {
  if (!date) return 'No activity';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const PresentationIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    presentationGenerated: 0,
    slidesGenerated: 0,
    docsUploaded: 0,
    totalExports: 0,
    aiGenerations: 0,
    lastActivity: null,
    weeklyActivity: [],
  });
  const [recentPresentations, setRecentPresentations] = useState<
    RecentPresentation[]
  >([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        setStats(res.data.data);
      } catch (err: any) {
        console.error('Failed to fetch stats: ', err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const res = await getRecentPresentation();
        setRecentPresentations(res.data.data.presentations);
      } catch (err) {
        console.error('Failed to fetch presentations:', err);
      }
    };
    fetchPresentations();
  }, []);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await getRecentActivity();
        setActivities(res.data.data.activities);
      } catch (err) {
        console.error('Failed to fetch activity:', err);
      }
    };
    fetchActivity();
  }, []);

  const STATS: StatItem[] = [
    {
      label: 'Presentations',
      value: stats.presentationGenerated,
      accent: '#6366f1',
      accentBg: 'rgba(99,102,241,0.15)',
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      ),
    },
    {
      label: 'Slides Generated',
      value: stats.slidesGenerated,
      accent: '#0ea5e9',
      accentBg: 'rgba(14,165,233,0.15)',
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
        </svg>
      ),
    },
    {
      label: 'Docs Uploaded',
      value: stats.docsUploaded,
      accent: '#10b981',
      accentBg: 'rgba(16,185,129,0.15)',
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      label: 'Total Exports',
      value: stats.totalExports,
      accent: '#f59e0b',
      accentBg: 'rgba(245,158,11,0.15)',
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
    },
    {
      label: 'Last Activity',
      value: formatRelativeTime(stats.lastActivity),
      accent: '#a78bfa',
      accentBg: 'rgba(167,139,250,0.15)',
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: 'AI Generations',
      value: stats.aiGenerations,
      accent: '#f472b6',
      accentBg: 'rgba(244,114,182,0.15)',
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="relative mb-6 sm:mb-6">
          {/* Subtle top accent line */}
          <div className="absolute -top-4 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />

          <div className="flex items-center justify-between gap-3">
            {/* Left: Greeting block */}
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
              {/* Avatar / Monogram */}
              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src="https://github.com/maxleiter.png"
                      alt="logo"
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                </div>
                {/* Online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 border-2 border-[#0d1117] rounded-full" />
              </div>

              {/* Text */}
              <div className="min-w-0">
                {/* Name row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-sm sm:text-xl font-semibold text-white tracking-tight truncate">
                    Good morning, {USER_NAME}
                  </h1>
                  {/* Date pill — hidden on xs, visible sm+ */}
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-white/40 bg-white/6 border border-white/8 px-2 py-0.5 rounded-full shrink-0">
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Subtitle: date on mobile, text on sm+ */}
                <p className="text-[10px] sm:text-xs text-white/35 mt-0.5 truncate">
                  <span className="sm:hidden">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="hidden sm:inline">
                    Here's what's going on with your presentations
                  </span>
                </p>
              </div>
            </div>

            {/* Right: CTA Button */}
            <button
              onClick={() => navigate('/dashboard/slide')}
              className="group relative flex cursor-pointer items-center gap-1.5 sm:gap-2 text-white text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#2563eb] shrink-0 overflow-hidden transition-all duration-200 active:scale-95"
            >
              {/* Shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none" />

              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="sm:inline">Generate</span>
            </button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-5 sm:mb-5">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#002945] hover:bg-[#002E4E] border border-white/8 hover:border-white/[0.14] rounded-2xl p-4 flex flex-row items-center gap-2.5 transition-all duration-200 cursor-default"
            >
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: stat.accentBg, color: stat.accent }}
              >
                {stat.icon}
              </div>

              {/* Text — right of icon */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[10px] font-medium text-white/50 tracking-wide leading-tight truncate">
                  {stat.label}
                </span>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-base font-bold text-white leading-none tracking-tight">
                    {stat.value}
                  </span>
                  {stat.badge && (
                    <span
                      className="text-[8px] font-semibold rounded-md px-1.5 py-0.5"
                      style={{
                        color: stat.badgePositive ? '#34d399' : '#f87171',
                        background: stat.badgePositive
                          ? 'rgba(52,211,153,0.15)'
                          : 'rgba(248,113,113,0.15)',
                      }}
                    >
                      {stat.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom Grid ── */}
        <div className="grid grid-cols-1 -mb-6 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Recent Presentations — 2/3 on large, full on small */}
          <div className="lg:col-span-2 bg-[#002137] border border-white/8 rounded-2xl flex flex-col h-120">
            {/* ── Card Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/6 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
                <h2 className="text-sm font-semibold text-white tracking-tight">
                  Recent Presentations
                </h2>
                <span className="text-[10px] font-medium text-white/30 bg-white/6 border border-white/8 px-2 py-0.5 rounded-full">
                  {recentPresentations.length}
                </span>
              </div>
              <button
                onClick={() => navigate('/dashboard/library')}
                className="group flex items-center gap-1 text-[11px] font-medium text-blue-400/70 hover:text-blue-400 transition-colors"
              >
                View all
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-0.5 transition-transform duration-150"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* ── Mini Chart ── */}
            <div className="shrink-0">
              <MiniBarChart data={getChartData(stats.weeklyActivity)} />
            </div>

            {/* ── Empty State ── */}
            <div
              className="flex-1 overflow-y-auto"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.1) transparent',
              }}
            >
              {recentPresentations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mb-4">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white/20"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-white/40">
                    No presentations yet
                  </p>
                  <p className="text-xs text-white/20 mt-1 mb-4">
                    Create your first to get started
                  </p>
                  <button
                    onClick={() => navigate('/dashboard/slide')}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-500/40 px-4 py-1.5 rounded-lg transition-all"
                  >
                    Create your first one →
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/4">
                  {/* Column headers (sm+) */}
                  <div className="hidden sm:grid grid-cols-[1fr_64px_72px_96px] text-[10px] font-semibold text-white/25 uppercase tracking-widest px-5 py-2.5 sticky top-0 bg-[#002137] z-10">
                    <span>Name</span>
                    <span>Slides</span>
                    <span>Date</span>
                    <span></span>
                  </div>

                  {recentPresentations.map((p) => (
                    <div
                      key={p.id}
                      className="group relative hover:bg-white/3 transition-colors duration-150"
                    >
                      {/* Desktop row */}
                      <div className="hidden sm:grid grid-cols-[1fr_64px_72px_96px] items-center px-5 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500/20 to-indigo-500/10 border border-white/8 text-blue-400 flex items-center justify-center">
                              <PresentationIcon />
                            </div>
                          </div>
                          <p className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
                            {p.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-white/40">
                            {p.slides}
                          </span>
                        </div>
                        <span className="text-xs text-white/35 font-medium">
                          {p.date}
                        </span>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-150">
                          <button
                            onClick={async () => {
                              const response = await fetch(p.outputUrl);
                              const blob = await response.blob();
                              const blobUrl = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = blobUrl;
                              a.download = `${p.name}.pptx`;
                              a.click();
                              URL.revokeObjectURL(blobUrl);
                            }}
                            className="px-2.5 py-1 text-[10px] font-semibold border border-white/10 rounded-lg text-white/40 hover:text-white/70 hover:border-white/20 hover:bg-white/5 transition-all"
                          >
                            .pptx
                          </button>
                        </div>
                      </div>

                      {/* Mobile card */}
                      <div className="flex sm:hidden items-center gap-3 px-4 py-3.5">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500/20 to-indigo-500/10 border border-white/8 text-blue-400 flex items-center justify-center shrink-0">
                          <PresentationIcon />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white/80 truncate">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-white/30">
                              {p.slides} slides
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                            <span className="text-[11px] text-white/30">
                              {p.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button className="px-2 py-1 text-[10px] font-semibold border border-white/10 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
                            .pptx
                          </button>
                          <button className="px-2 py-1 text-[10px] font-semibold border border-white/10 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
                            .pdf
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Getting Started Checklist — 1/3 on large, full on small */}
          <div className="bg-[#002137] border border-white/8 rounded-2xl flex flex-col h-120">
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/6 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Recent Activity
                </h3>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400/70">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  Live
                </span>
              </div>
              <button className="group cursor-pointer flex items-center gap-1 text-[11px] font-medium text-blue-400/70 hover:text-blue-400 transition-colors">
                View all
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-0.5 transition-transform duration-150"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* ── Activity List — only this scrolls ── */}
            <div
              className="flex flex-col divide-y divide-white/4 flex-1 overflow-y-auto"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.1) transparent',
              }}
            >
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <p className="text-sm font-medium text-white/30">
                    No activity in the last 24 hours
                  </p>
                </div>
              ) : (
                activities.map((a, index) => {
                  const style = getActivityStyle(a.type);
                  return (
                    <div
                      key={a.id}
                      className="group flex items-start gap-3 px-5 py-3.5 hover:bg-white/2 transition-colors duration-150"
                    >
                      <div className="relative flex flex-col items-center shrink-0 pt-0.5">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                          style={{
                            background: style.accentBg,
                            color: style.accent,
                          }}
                        >
                          {style.icon}
                        </div>
                        {index < activities.length - 1 && (
                          <div className="w-px flex-1 bg-white/5 mt-1.5 min-h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-0.5">
                        <p className="text-xs sm:text-sm text-white/70 leading-snug">
                          <span
                            className="font-semibold text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded-md mr-1.5"
                            style={{
                              color: style.accent,
                              background: style.accentBg,
                            }}
                          >
                            {a.label}
                          </span>
                          <span className="font-medium text-white/90">
                            {a.subject}
                          </span>
                          {a.context && (
                            <span className="text-white/40">
                              {' '}
                              · {a.context}
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-white/25 mt-1 font-medium">
                          {a.time}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-white/20 font-medium">
                {activities.length} recent actions
              </span>
              <div className="flex items-center gap-1">
                {activities.map((a) => {
                  const style = getActivityStyle(a.type);
                  return (
                    <div
                      key={a.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: style.accentBg,
                        border: `1px solid ${style.accent}40`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
