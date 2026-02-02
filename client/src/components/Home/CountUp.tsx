import {
  useInView,
  useMotionValue,
  useSpring,
  motion,
  AnimatePresence,
} from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
  animationStyle?: 'slide' | 'fade' | 'scale' | 'none';
  playOnce?: boolean; // If true, animation plays only once (persists across refreshes)
  uniqueId?: string; // Unique identifier for this counter (required if playOnce is true)
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd,
  animationStyle = 'slide',
  playOnce = false,
  uniqueId = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);
  const [displayValue, setDisplayValue] = useState('');
  const [hasPlayed, setHasPlayed] = useState(false);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: '0px' });

  // Check if animation has already played (from localStorage)
  useEffect(() => {
    if (playOnce && uniqueId) {
      const storageKey = `countup-played-${uniqueId}`;
      const played = localStorage.getItem(storageKey);
      if (played === 'true') {
        setHasPlayed(true);
        // Set to final value immediately
        motionValue.set(direction === 'down' ? from : to);
      }
    }
  }, [playOnce, uniqueId, direction, from, to, motionValue]);

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;

      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      };

      const formattedNumber = Intl.NumberFormat('en-US', options).format(
        latest
      );

      return separator
        ? formattedNumber.replace(/,/g, separator)
        : formattedNumber;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    setDisplayValue(formatValue(direction === 'down' ? to : from));
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (isInView && startWhen && !hasPlayed) {
      if (typeof onStart === 'function') {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === 'down' ? from : to);

        // Mark as played in localStorage
        if (playOnce && uniqueId) {
          localStorage.setItem(`countup-played-${uniqueId}`, 'true');
          setHasPlayed(true);
        }
      }, delay * 1000);

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === 'function') {
            onEnd();
          }
        },
        delay * 1000 + duration * 1000
      );

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [
    isInView,
    startWhen,
    hasPlayed,
    motionValue,
    direction,
    from,
    to,
    delay,
    onStart,
    onEnd,
    duration,
    playOnce,
    uniqueId,
  ]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest: number) => {
      setDisplayValue(formatValue(latest));
    });

    return () => unsubscribe();
  }, [springValue, formatValue]);

  // Animation variants for different styles
  const getAnimationVariants = () => {
    switch (animationStyle) {
      case 'slide':
        return {
          initial: { y: direction === 'up' ? 20 : -20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: direction === 'up' ? -20 : 20, opacity: 0 },
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case 'scale':
        return {
          initial: { scale: 0.5, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.5, opacity: 0 },
        };
      default:
        return {
          initial: {},
          animate: {},
          exit: {},
        };
    }
  };

  const variants = getAnimationVariants();

  if (animationStyle === 'none') {
    return (
      <span className={className} ref={ref}>
        {displayValue}
      </span>
    );
  }

  // Split the display value into individual characters for animation
  const characters = displayValue.split('');

  return (
    <span className={`inline-flex ${className}`} ref={ref}>
      <AnimatePresence mode="popLayout">
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}-${displayValue}`}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{
              duration: 0.15,
              delay: index * 0.015,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="inline-block"
            style={{
              minWidth:
                char === separator || char === ','
                  ? '0.3em'
                  : char === '.'
                    ? '0.25em'
                    : '0.6em',
              textAlign: 'center',
            }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
