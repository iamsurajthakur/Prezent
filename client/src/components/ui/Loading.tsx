import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Loading = () => {
  const curtainRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!curtainRef.current) return;

    // GSAP timeline for curtain animation
    const tl = gsap.timeline();

    // Animate percentage 0 -> 100 over 1.5s
    gsap.to({ val: 0 }, {
      val: 100,
      duration: 1.5,
      ease: "power1.inOut",
      onUpdate: function () {
        setPercent(Math.round(this.targets()[0].val));
      },
    });

    // Animate curtain scaleY to reveal the page
    tl.to(curtainRef.current, {
      duration: 1.5,
      scaleY: 0,
      transformOrigin: "top center",
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={curtainRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1D4ED8", // blue curtain
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "2rem",
        fontWeight: "bold",
        transform: "scaleY(1)",
      }}
    >
      {percent}%
    </div>
  );
};

export default Loading;