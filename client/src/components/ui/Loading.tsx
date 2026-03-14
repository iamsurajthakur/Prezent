import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Loading = () => {
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!curtainRef.current) return;

    // Initial animation: curtain opening
    const tl = gsap.timeline();

    tl.to(curtainRef.current, {
      duration: 1.2,
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
        transform: "scaleY(1)",
      }}
    />
  );
};

export default Loading;