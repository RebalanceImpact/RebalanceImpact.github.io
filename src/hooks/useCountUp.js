import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for animated number counting
 * @param {Object} options
 * @param {number} options.end - Target number to count to
 * @param {number} options.start - Starting number (default 0)
 * @param {number} options.duration - Animation duration in ms (default 2000)
 * @param {boolean} options.startOnMount - Start immediately on mount (default false)
 * @param {string} options.suffix - Suffix to append (e.g., '+', '%')
 * @param {string} options.prefix - Prefix to prepend (e.g., '$', 'R')
 * @param {number} options.decimals - Number of decimal places (default 0)
 * @returns {Object} - { count, formattedCount, start, reset }
 */
export const useCountUp = ({
  end,
  start = 0,
  duration = 2000,
  startOnMount = false,
  suffix = '',
  prefix = '',
  decimals = 0,
} = {}) => {
  const [count, setCount] = useState(start);
  const [isRunning, setIsRunning] = useState(false);

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const startCounting = useCallback(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    setIsRunning(true);
    const startTime = performance.now();
    const startValue = start;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentCount = startValue + (end - startValue) * easedProgress;

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
      }
    };

    requestAnimationFrame(animate);
  }, [start, end, duration]);

  const reset = useCallback(() => {
    setCount(start);
    setIsRunning(false);
  }, [start]);

  useEffect(() => {
    if (startOnMount) {
      startCounting();
    }
  }, [startOnMount, startCounting]);

  const formattedCount = `${prefix}${count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${suffix}`;

  return {
    count,
    formattedCount,
    start: startCounting,
    reset,
    isRunning,
  };
};

export default useCountUp;
