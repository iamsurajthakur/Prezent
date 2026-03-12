import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(containerRef.current, { opacity: 0, y: 30 });
      gsap.set(overlayRef.current, { scaleY: 1 });

      // Animation timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
      });

      tl.to(overlayRef.current, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.8,
      }).to(
        containerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        '-=0.4'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Transition Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-indigo-600 pointer-events-none"
        style={{ transformOrigin: 'top' }}
      />

      {/* Page Content */}
      <div ref={containerRef}>{children}</div>
    </>
  );
};

export default PageTransition;
