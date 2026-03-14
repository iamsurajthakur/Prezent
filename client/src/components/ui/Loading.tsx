"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// ─── SqueezeLoader ──────────────────────────────────────────────────────────
function SqueezeLoader({
  size = 64,
  color1 = "#6644ff",
  color2 = "#a855f7",
  spinDuration = 10,
  squeezeDuration = 3,
}: {
  size?: number;
  color1?: string;
  color2?: string;
  spinDuration?: number;
  squeezeDuration?: number;
}) {
  return (
    <>
      <style>{`
        @keyframes sq-squeeze {
          0%    { inset: 0 2em 2em 0; }
          12.5% { inset: 0 2em 0    0; }
          25%   { inset: 2em 2em 0  0; }
          37.5% { inset: 2em 0   0  0; }
          50%   { inset: 2em 0   0  2em; }
          62.5% { inset: 0   0   0  2em; }
          75%   { inset: 0   0  2em 2em; }
          87.5% { inset: 0   0  2em 0; }
          100%  { inset: 0  2em 2em 0; }
        }
        @keyframes sq-spin {
          to { transform: rotate(-360deg); }
        }
      `}</style>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: "relative",
          animation: `sq-spin ${spinDuration}s infinite linear`,
        }}
      >
        <div
          style={{
            position: "absolute",
            background: color1,
            animation: `sq-squeeze ${squeezeDuration}s infinite`,
          }}
        />
        <div
          style={{
            position: "absolute",
            borderRadius: "50%",
            background: color2,
            animation: `sq-squeeze ${squeezeDuration}s infinite`,
            animationDelay: "-1.25s",
          }}
        />
      </div>
    </>
  );
}

// ─── Loading screen ─────────────────────────────────────────────────────────
/**
 * Props:
 *  done — when this flips to `true` the curtain exit plays and the
 *          component unmounts itself. Wire it to `!isLoading` from your
 *          auth store (see App.tsx usage below).
 *
 *  minMs — minimum milliseconds to keep the loader visible so the
 *           entry animation always has time to play (default 1800ms).
 *
 * Usage in App.tsx:
 *   const isLoading = useAuthStore(s => s.isLoading);
 *   return <Loading done={!isLoading} />;
 *   // Remove the `if (isLoading) return <Loading />` guard —
 *   // render Loading unconditionally alongside the app instead.
 */
interface LoadingProps {
  done?: boolean;
  minMs?: number;
}

type Phase = "enter" | "exit" | "done";

export default function Loading({ done = false, minMs = 1800 }: LoadingProps) {
  const [phase, setPhase] = useState<Phase>("enter");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const topRef     = useRef<HTMLDivElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLParagraphElement>(null);

  const glowTweenRef  = useRef<gsap.core.Tween | null>(null);
  const mountTimeRef  = useRef<number>(Date.now());
  const exitCalledRef = useRef(false);

  // ── ENTRY ──────────────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (phase !== "enter") return;

    const tl = gsap.timeline();

    tl.fromTo(
      wrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.45, ease: "power2.out" }
    );

    tl.fromTo(
      logoRef.current,
      { scale: 0.4, opacity: 0, filter: "blur(14px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.75, ease: "back.out(1.8)" },
      "-=0.05"
    );

    tl.fromTo(
      labelRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.35"
    );

    glowTweenRef.current = gsap.to(glowRef.current, {
      scale: 1.55,
      opacity: 0.32,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => { tl.kill(); };
  }, [phase]);

  // ── EXIT ───────────────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (phase !== "exit") return;

    glowTweenRef.current?.kill();

    const tl = gsap.timeline({ onComplete: () => setPhase("done") });

    // Fade + shrink content
    tl.to(contentRef.current, {
      opacity: 0,
      scale: 0.94,
      duration: 0.35,
      ease: "power2.in",
    });

    // Curtain split
    tl.to(topRef.current,    { yPercent: -100, duration: 1.0, ease: "expo.inOut" }, "-=0.1");
    tl.to(bottomRef.current, { yPercent: 100,  duration: 1.0, ease: "expo.inOut" }, "<");

    return () => { tl.kill(); };
  }, [phase]);

  // ── Trigger exit when `done` flips true ───────────────────────────────────
  useEffect(() => {
    if (!done || exitCalledRef.current || phase === "done") return;

    const elapsed   = Date.now() - mountTimeRef.current;
    const remaining = Math.max(0, minMs - elapsed);

    const timer = setTimeout(() => {
      exitCalledRef.current = true;
      setPhase("exit");
    }, remaining);

    return () => clearTimeout(timer);
  }, [done, phase, minMs]);

  if (phase === "done") return null;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono&display=swap"
      />

      <div
        ref={wrapperRef}
        className="fixed inset-0 z-[9999] overflow-hidden"
        style={{ background: "#07021a" }}
      >
        {/* Noise grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top curtain */}
        <div
          ref={topRef}
          className="absolute inset-x-0 top-0 h-1/2 z-10"
          style={{ background: "linear-gradient(180deg, #0a0330 0%, #140a45 100%)" }}
        />

        {/* Bottom curtain */}
        <div
          ref={bottomRef}
          className="absolute inset-x-0 bottom-0 h-1/2 z-10"
          style={{ background: "linear-gradient(0deg, #0a0330 0%, #140a45 100%)" }}
        />

        {/* Ambient glow */}
        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[90px]"
          style={{ background: "radial-gradient(circle, #6644ff 0%, #3311cc 45%, transparent 70%)" }}
        />

        {/* Center content */}
        <div
          ref={contentRef}
          className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-8"
        >
          {/* Logo mark */}
          <div
            ref={logoRef}
            className="relative flex items-center justify-center w-16 h-16 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #3311cc22, #6644ff33)",
              border: "1px solid #6644ff55",
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl blur-xl opacity-40"
              style={{ background: "radial-gradient(circle, #6644ff 0%, transparent 70%)" }}
            />
            <span
              className="relative text-3xl font-black text-violet-300"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              P
            </span>
          </div>

          {/* Squeeze loader */}
          <SqueezeLoader
            size={64}
            color1="#6644ff"
            color2="#a855f7"
            spinDuration={10}
            squeezeDuration={3}
          />

          {/* Label */}
          <p
            ref={labelRef}
            className="text-[11px] uppercase tracking-[0.35em] text-purple-400/50 opacity-0"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Prezent · Loading
          </p>
        </div>
      </div>
    </>
  );
}