import { useState } from 'react';

const SIZE = 148;
const R = 70;
const STROKE = 22;
const GAP = 2; // surface gap between segments, in px along the ring

const arc = (start, end) => {
  const r = R - STROKE / 2;
  const c = SIZE / 2;
  const point = (a) => [c + r * Math.sin(a), c - r * Math.cos(a)];
  const [x1, y1] = point(start);
  const [x2, y2] = point(end);
  return `M${x1},${y1}A${r},${r} 0 ${end - start > Math.PI ? 1 : 0} 1 ${x2},${y2}`;
};

/**
 * Part-to-whole ring with a legend that carries name and share. Hovering a
 * segment shows it in the centre; with `onSelect`, clicking a segment or its
 * legend row selects it (`selected` is its name) and clicking again clears it.
 */
const Donut = ({ segments, format, totalLabel, selected = null, onSelect }) => {
  const [hover, setHover] = useState(null);
  const total = segments.reduce((t, s) => t + s.value, 0) || 1;
  const gapAngle = GAP / (R - STROKE / 2);
  const focus = hover ?? selected;

  const arcs = segments.map((s, i) => {
    const from = (segments.slice(0, i).reduce((t, p) => t + p.value, 0) / total) * Math.PI * 2;
    const sweep = (s.value / total) * Math.PI * 2;
    const inset = sweep > gapAngle ? gapAngle / 2 : 0;
    return { ...s, d: arc(from + inset, Math.max(from + inset, from + sweep - inset - 0.0001)) };
  });

  const shown = segments.find((s) => s.name === focus);
  const choose = (name) => onSelect && onSelect(selected === name ? null : name);
  const Row = onSelect ? 'button' : 'div';

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <div className="relative flex-shrink-0">
        <svg width={SIZE} height={SIZE} role="img" aria-label={segments.map((s) => `${s.name} ${format(s.value)}`).join(', ')}>
          {arcs.map((a) => (
            <path
              key={a.name}
              d={a.d}
              fill="none"
              stroke={a.color}
              strokeWidth={STROKE}
              opacity={focus === null || focus === a.name ? 1 : 0.3}
              onPointerEnter={() => setHover(a.name)}
              onPointerLeave={() => setHover(null)}
              onClick={() => choose(a.name)}
              className={`transition-opacity ${onSelect ? 'cursor-pointer' : ''}`}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="text-lg font-semibold leading-tight text-forest-deep">{format(shown ? shown.value : total)}</span>
          <span className="text-[11px] leading-tight text-charcoal-light">{shown ? shown.name : totalLabel}</span>
        </div>
      </div>
      <ul className="min-w-[160px] flex-1 space-y-1 text-sm">
        {segments.map((s) => (
          <li key={s.name}>
            <Row
              type={onSelect ? 'button' : undefined}
              onClick={onSelect ? () => choose(s.name) : undefined}
              onPointerEnter={() => setHover(s.name)}
              onPointerLeave={() => setHover(null)}
              aria-pressed={onSelect ? selected === s.name : undefined}
              className={`flex w-full items-center justify-between gap-3 rounded-md px-1.5 py-1 text-left transition-colors ${
                onSelect ? 'hover:bg-sand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-accent' : ''
              } ${selected === s.name ? 'bg-sand-light' : ''} ${selected && selected !== s.name ? 'opacity-50' : ''}`}
            >
              <span className="flex items-center gap-2 text-charcoal">
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-sm" style={{ backgroundColor: s.color }} />
                {s.name}
              </span>
              <span className="text-charcoal-light tabular-nums">{((s.value / total) * 100).toFixed(1)}%</span>
            </Row>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Donut;
