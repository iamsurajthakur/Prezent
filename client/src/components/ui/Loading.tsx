"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// ── SqueezeLoader ──────────────────────────────────────────────
interface SqueezeLoaderProps {
  size?: number;
  color1?: string;
  color2?: string;
  spinDuration?: number;
  squeezeDuration?: number;
}

function SqueezeLoader({
  size = 64,
  color1 = "#6644ff",
  color2 = "#a855f7",
  spinDuration = 10,
  squeezeDuration = 3,
}: SqueezeLoaderProps) {
  return (
    <>
      <style>{`
        @keyframes squeeze {
          0%    { inset: 0 2em 2em 0; }
          12.5% { inset: 0 2em 0 0; }
          25%   { inset: 2em 2em 0 0; }
          37.5% { inset: 2em 0 0 0; }
          50%   { inset: 2em 0 0 2em; }
          62.5% { inset: 0 0 0 2em; }
          75%   { inset: 0 0 2em 2em; }
          87.5% { inset: 0 0 2em 0; }
          100%  { inset: 0 2em 2em 0; }
        }
        @keyframes squeeze-spin {
          to { transform: rotate(-360deg); }
        }
      `}</style>

      <div
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animation: `squeeze-spin ${spinDuration}s infinite linear`,
        }}
      >
        {/* Square piece */}
        <div
          className="absolute"
          style={{
            background: color1,
            animation: `squeeze ${squeezeDuration}s infinite`,
          }}
        />
        {/* Rounded piece */}
        <div
          className="absolute rounded-full"
          style={{
            background: color2,
            animation: `squeeze ${squeezeDuration}s infinite`,
            animationDelay: "-1.25s",
          }}
        />
      </div>
    </>
  );
}

// ── Loading screen ─────────────────────────────────────────────
export default function Loading() {
  const [visible, setVisible] = useState(true);

  const wrapperRef     = useRef<HTMLDivElement>(null);
  const topPanelRef    = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const contentRef     = useRef<HTMLDivElement>(null);
  const glowRef        = useRef<HTMLDivElement>(null);
  const logoRef        = useRef<HTMLDivElement>(null);
  const labelRef       = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!visible) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Fade in
      tl.fromTo(wrapperRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });

      // Logo pop-in
      tl.fromTo(
        logoRef.current,
        { scale: 0.5, opacity: 0, filter: "blur(10px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.65, ease: "back.out(1.8)" },
        "-=0.05"
      );

      // Label fade-in
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
        "-=0.3"
      );

      // Glow breathe (looping)
      gsap.to(glowRef.current, {
        scale: 1.5,
        opacity: 0.3,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, wrapperRef);

    // ── Exit: curtain split on window load ──
    const exitLoader = () => {
      ctx.revert();

      const exit = gsap.timeline({ onComplete: () => setVisible(false) });

      // Flash
      exit.to(wrapperRef.current, {
        backgroundColor: "#ffffff0a",
        duration: 0.07,
        yoyo: true,
        repeat: 1,
        ease: "none",
      });

      // Fade out inner content
      exit.to(contentRef.current, { opacity: 0, duration: 0.25, ease: "power1.in" }, "<");

      // Curtain split
      exit.to(topPanelRef.current,    { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=0.1");
      exit.to(bottomPanelRef.current, { yPercent: 100,  duration: 0.9, ease: "expo.inOut" }, "<");
    };

    const MIN_MS = 3000; // always show at least 3 s
    const start  = Date.now();

    const scheduleExit = () => {
      const elapsed = Date.now() - start;
      const delay   = Math.max(0, MIN_MS - elapsed);
      setTimeout(exitLoader, delay);
    };

    if (document.readyState === "complete") {
      scheduleExit();
    } else {
      window.addEventListener("load", scheduleExit, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleExit);
      ctx.revert();
    };
  }, [visible]);

  if (!visible) return null;

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
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── Top curtain panel ── */}
        <div
          ref={topPanelRef}
          className="absolute inset-x-0 top-0 h-1/2 z-10"
          style={{ background: "linear-gradient(180deg, #0a0330 0%, #140a45 100%)" }}
        />

        {/* ── Bottom curtain panel ── */}
        <div
          ref={bottomPanelRef}
          className="absolute inset-x-0 bottom-0 h-1/2 z-10"
          style={{ background: "linear-gradient(0deg, #0a0330 0%, #140a45 100%)" }}
        />

        {/* ── Ambient glow ── */}
        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none opacity-20 blur-[90px]"
          style={{ background: "radial-gradient(circle, #6644ff 0%, #3311cc 45%, transparent 70%)" }}
        />

        {/* ── Center content ── */}
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
              border: "1px solid #6644ff44",
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

          {/* SqueezeLoader */}
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