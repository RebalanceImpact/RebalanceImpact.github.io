import { useEffect, useRef, useState } from 'react';

/**
 * Round a [min, max] range out to clean tick values (1, 2, 2.5, 5 x 10^n).
 */
export const niceTicks = (min, max, count = 4) => {
  if (min === max) {
    max = min + 1;
  }
  const rawStep = (max - min) / count;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rawStep);
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = start; v <= end + step / 2; v += step) {
    ticks.push(Number(v.toFixed(10)));
  }
  return ticks;
};

export const linear = (domain, range) => (v) =>
  range[0] + ((v - domain[0]) / (domain[1] - domain[0] || 1)) * (range[1] - range[0]);

/**
 * Track an element's rendered width so SVG charts draw at true pixel size
 * (text stays readable on phones instead of shrinking with a viewBox).
 */
export const useElementWidth = (fallback = 640) => {
  const ref = useRef(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(240, Math.floor(entry.contentRect.width)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
};

// Bar path with a 4px rounded data-end and a square baseline.
export const columnPath = (x, y, w, h, r = 4) => {
  const rr = Math.min(r, h, w / 2);
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
};
