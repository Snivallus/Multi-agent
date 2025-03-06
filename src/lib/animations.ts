
import { useState, useEffect } from 'react';

// Custom hook for tracking whether an element is in viewport
export function useInView(ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isInView;
}

// Custom hook for applying a staggered animation to a list of elements
export function useStaggeredAnimation(
  totalItems: number,
  baseDelay: number = 100
): number[] {
  const [delays, setDelays] = useState<number[]>([]);

  useEffect(() => {
    const newDelays = Array.from({ length: totalItems }, (_, i) => i * baseDelay);
    setDelays(newDelays);
  }, [totalItems, baseDelay]);

  return delays;
}

// Function to apply a typing effect
export function typeText(
  text: string,
  duration: number = 1000,
  callback?: () => void
): { text: string; done: boolean } {
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let timeoutId: number;
    const charDelay = duration / text.length;
    
    for (let i = 0; i <= text.length; i++) {
      timeoutId = window.setTimeout(() => {
        setDisplayText(text.slice(0, i));
        if (i === text.length) {
          setIsDone(true);
          if (callback) callback();
        }
      }, i * charDelay);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [text, duration, callback]);

  return { text: displayText, done: isDone };
}
