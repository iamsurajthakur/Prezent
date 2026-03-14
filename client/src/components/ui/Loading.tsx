import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Loading() {
  const [visible, setVisible] = useState(true);

  // Loader panels refs
  const topPanelRef    = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const wrapperRef     = useRef<HTMLDivElement>(null);

  // Inner content refs
  const logoRef        = useRef<HTMLDivElement>(null);
  const ringRef        = useRef<SVGCircleElement>(null);
  const orbitRef       = useRef<SVGGElement>(null);
  const percentRef     = useRef<HTMLSpanElement>(null);
  const labelRef       = useRef<HTMLParagraphElement>(null);
  const glowRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;

    // ── Circumference of the SVG ring ──
    const RADIUS = 54;
    const CIRC   = 2 * Math.PI * RADIUS; // ≈ 339.3

    const ctx = gsap.context(() => {
      /* ---- ENTRY ---- */
      const tl = gsap.timeline();

      // Fade in wrapper
      tl.fromTo(wrapperRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });

      // Glow pulse (looping)
      gsap.to(glowRef.current, {
        scale: 1.5,
        opacity: 0.35,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Logo pop-in
      tl.fromTo(
        logoRef.current,
        { scale: 0.4, opacity: 0, filter: "blur(12px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "back.out(1.7)" },
        "-=0.1"
      );

      // Ring draw-in
      gsap.set(ringRef.current, { strokeDasharray: CIRC, strokeDashoffset: CIRC });
      tl.to(
        ringRef.current,
        { strokeDashoffset: 0, duration: 2.8, ease: "power2.inOut" },
        "-=0.5"
      );

      // Orbit ring spin (looping)
      gsap.to(orbitRef.current, {
        rotation: 360,
        transformOrigin: "64 64",
        duration: 4,
        repeat: -1,
        ease: "none",
      });

      // Percent counter 0 → 100
      const counter = { val: 0 };
      tl.to(
        counter,
        {
          val: 100,
          duration: 2.8,
          ease: "power2.inOut",
          onUpdate: () => {
            if (percentRef.current) {
              percentRef.current.textContent = `${Math.round(counter.val)}`;
            }
          },
        },
        "<"  // sync with ring draw
      );

      // Label fade-in
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=2.5"
      );
    }, wrapperRef);

    /* ---- WAIT FOR WINDOW LOAD ---- */
    const exitLoader = () => {
      ctx.revert(); // stop all loops

      /* ---- EXIT: curtain split ---- */
      const exit = gsap.timeline({
        onComplete: () => setVisible(false),
      });

      // Brief flash
      exit.to(wrapperRef.current, {
        backgroundColor: "#ffffff08",
        duration: 0.08,
        yoyo: true,
        repeat: 1,
        ease: "none",
      });

      // Panels split
      exit.to(topPanelRef.current, {
        yPercent: -100,
        duration: 0.85,
        ease: "expo.inOut",
      }, "-=0.05");

      exit.to(bottomPanelRef.current, {
        yPercent: 100,
        duration: 0.85,
        ease: "expo.inOut",
      }, "<");

      // Fade out inner content behind the panels
      exit.to([logoRef.current, percentRef.current, labelRef.current], {
        opacity: 0,
        duration: 0.2,
        ease: "power1.in",
      }, "<");
    };

    if (document.readyState === "complete") {
      // Already loaded — still show min 2.9s so animation completes
      const timer = setTimeout(exitLoader, 2950);
      return () => { clearTimeout(timer); ctx.revert(); };
    } else {
      window.addEventListener("load", exitLoader, { once: true });
      return () => { window.removeEventListener("load", exitLoader); ctx.revert(); };
    }
  }, [visible]);

  if (!visible) return null;

  const RADIUS = 54;
  const CIRC   = 2 * Math.PI * RADIUS;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:wght@400&display=swap"
      />

      {/* ── Wrapper ── */}
      <div
        ref={wrapperRef}
        className="fixed inset-0 z-[9999] overflow-hidden"
        style={{ background: "#07021a" }}
      >
        {/* ── Top curtain panel ── */}
        <div
          ref={topPanelRef}
          className="absolute inset-x-0 top-0 h-1/2 z-10"
          style={{ background: "linear-gradient(180deg, #0d0535 0%, #140a45 100%)" }}
        />

        {/* ── Bottom curtain panel ── */}
        <div
          ref={bottomPanelRef}
          className="absolute inset-x-0 bottom-0 h-1/2 z-10"
          style={{ background: "linear-gradient(0deg, #0d0535 0%, #140a45 100%)" }}
        />

        {/* ── Ambient glow ── */}
        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[80px]"
          style={{ background: "radial-gradient(circle, #6644ff 0%, #3311cc 40%, transparent 70%)" }}
        />

        {/* ── Noise grain overlay ── */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── Center content (sits between the two panels, z-0) ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-0">

          {/* Logo mark */}
          <div
            ref={logoRef}
            className="flex items-center justify-center w-20 h-20 rounded-2xl relative"
            style={{ background: "linear-gradient(135deg, #3311cc22, #6644ff33)", border: "1px solid #6644ff44" }}
          >
            {/* Inner glow */}
            <div
              className="absolute inset-0 rounded-2xl blur-lg opacity-40"
              style={{ background: "radial-gradient(circle, #6644ff 0%, transparent 70%)" }}
            />
            <span
              className="relative text-4xl font-black tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif", color: "#c4b5fd" }}
            >
              P
            </span>
          </div>

          {/* SVG ring + counter */}
          <div className="relative flex items-center justify-center w-32 h-32">
            <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
              {/* Track */}
              <circle
                cx="64" cy="64" r={RADIUS}
                fill="none"
                stroke="#2d1b7a"
                strokeWidth="2"
              />
              {/* Orbit dashes */}
              <g ref={orbitRef}>
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
                  const r2 = 68;
                  const x  = 64 + r2 * Math.cos(a);
                  const y  = 64 + r2 * Math.sin(a);
                  return (
                    <circle
                      key={i}
                      cx={x} cy={y}
                      r={i % 4 === 0 ? 1.8 : 0.9}
                      fill="#6644ff"
                      opacity={i % 4 === 0 ? 0.7 : 0.35}
                    />
                  );
                })}
              </g>
              {/* Progress arc */}
              <circle
                ref={ringRef}
                cx="64" cy="64" r={RADIUS}
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ strokeDasharray: CIRC, strokeDashoffset: CIRC }}
              />
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6644ff" />
                </linearGradient>
              </defs>
            </svg>

            {/* Counter */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
              <div className="flex items-start leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>
                <span ref={percentRef} className="text-3xl font-bold text-white">0</span>
                <span className="text-sm font-bold text-purple-400 mt-1">%</span>
              </div>
            </div>
          </div>

          {/* Label */}
          <p
            ref={labelRef}
            className="text-[11px] uppercase tracking-[0.35em] text-purple-400/60 opacity-0"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Prezent · Loading
          </p>
        </div>
      </div>
    </>
  );
}