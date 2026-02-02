// AnimatedPageWrapper.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props {
  children: React.ReactNode;
  direction?: 'left' | 'right';
}

const AnimatedPageWrapper: React.FC<Props> = ({ children, direction = 'right' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page entrance
      gsap.from(containerRef.current, {
        opacity: 0,
        x: direction === 'right' ? 100 : -100,
        duration: 0.7,
        ease: 'power3.out',
      });

      // Stagger animation for child elements
      gsap.from(containerRef.current?.querySelectorAll('.stagger'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [direction]);

  return <div ref={containerRef}>{children}</div>;
};

export default AnimatedPageWrapper;