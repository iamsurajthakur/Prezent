import { useEffect, useState } from "react"
import Logo from "@/Assets/logo.png" // adjust path as needed

export default function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"logo" | "bar" | "done">("logo")

  useEffect(() => {
    // Phase 1: logo appears (0-600ms)
    const t1 = setTimeout(() => setPhase("bar"), 600)

    // Phase 2: progress bar fills
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        // fast at start, slows near end
        const increment = p < 70 ? 3 : p < 90 ? 1.5 : 0.8
        return Math.min(100, p + increment)
      })
    }, 30)

    // Phase 3: fade out
    const t2 = setTimeout(() => {
      setPhase("done")
      setTimeout(() => onComplete?.(), 500)
    }, 2800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearInterval(interval)
    }
  }, [onComplete])

  if (phase === "done") return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#06041a",
        opacity: 0,
        transition: "opacity 0.5s ease",
        overflow: "hidden",
      }}
    >
      {/* Ambient purple glow blobs */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none"
      }}>
        <div style={{
          position: "absolute",
          top: "20%", left: "30%",
          width: 600, height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,60,220,0.18) 0%, transparent 70%)",
          animation: "pulse-blob 4s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          bottom: "15%", right: "25%",
          width: 400, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(73,109,219,0.14) 0%, transparent 70%)",
          animation: "pulse-blob 5s ease-in-out infinite 1s",
        }} />
      </div>

      {/* Orbiting ring */}
      <div style={{
        position: "relative",
        marginBottom: 40,
        animation: "fade-up 0.6s ease forwards",
        opacity: 0,
      }}>
        {/* Outer spinning ring */}
        <div style={{
          position: "absolute",
          inset: -22,
          borderRadius: "50%",
          border: "1.5px solid transparent",
          borderTopColor: "rgba(99,60,220,0.7)",
          borderRightColor: "rgba(73,109,219,0.3)",
          animation: "spin 1.6s linear infinite",
        }} />
        {/* Middle ring */}
        <div style={{
          position: "absolute",
          inset: -12,
          borderRadius: "50%",
          border: "1px solid transparent",
          borderBottomColor: "rgba(150,100,255,0.4)",
          borderLeftColor: "rgba(73,109,219,0.2)",
          animation: "spin-reverse 2.4s linear infinite",
        }} />

        {/* Logo container */}
        <div style={{
          width: 80, height: 80,
          borderRadius: 20,
          background: "linear-gradient(135deg, #0d0b2e, #1a1460)",
          border: "1px solid rgba(99,60,220,0.3)",
          boxShadow: "0 0 40px rgba(99,60,220,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <img
            src={Logo}
            alt="Prezent"
            style={{ width: 44, height: 44, objectFit: "contain" }}
          />
        </div>
      </div>

      {/* Wordmark */}
      <div style={{
        animation: "fade-up 0.6s ease 0.2s forwards",
        opacity: 0,
        marginBottom: 48,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-0.5px",
          color: "white",
        }}>
          Prez<span style={{ color: "#496DDB" }}>ent</span>
        </div>
        <div style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginTop: 4,
          fontFamily: "system-ui, sans-serif",
        }}>
          Preparing your workspace
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        animation: "fade-up 0.6s ease 0.4s forwards",
        opacity: 0,
        width: 200,
      }}>
        <div style={{
          width: "100%",
          height: 2,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 99,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            borderRadius: 99,
            background: "linear-gradient(90deg, #3b31a0, #496DDB, #7c3aed)",
            boxShadow: "0 0 12px rgba(73,109,219,0.8)",
            transition: "width 0.1s linear",
          }} />
        </div>
        <div style={{
          textAlign: "right",
          marginTop: 8,
          fontSize: 11,
          color: "rgba(255,255,255,0.2)",
          fontFamily: "monospace",
          letterSpacing: "0.05em",
        }}>
          {Math.round(progress)}%
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-blob {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.15); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}