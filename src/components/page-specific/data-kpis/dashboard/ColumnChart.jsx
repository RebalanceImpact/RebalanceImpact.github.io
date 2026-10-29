import { useState } from 'react';
import { niceTicks, linear, useElementWidth, columnPath } from './scale';

const MARGIN = { top: 12, right: 8, bottom: 26, left: 48 };
const GAP = 2;

/**
 * Grouped columns by month. Each group is a hover target; clicking one
 * selects that month (and clicking it again clears the selection).
 */
const ColumnChart = ({ labels, series, format, selected, onSelect, height = 230, ariaLabel }) => {
  const [containerRef, width] = useElementWidth(560);
  const [hover, setHover] = useState(null);

  const innerW = width - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const ticks = niceTicks(0, Math.max(...series.flatMap((s) => s.values), 0));
  const y = linear([0, ticks[ticks.length - 1]], [innerH, 0]);
  const band = innerW / labels.length;
  const barW = Math.max(3, Math.min(20, (band * 0.72 - GAP * (series.length - 1)) / series.length));
  const groupW = barW * series.length + GAP * (series.length - 1);
  const labelEvery = band < 30 ? 2 : 1;
  const last = labels.length - 1;

  const choose = (i) => onSelect(selected === i ? null : i);
  const tipLeft = hover !== null ? MARGIN.left + band * hover + band / 2 : 0;
  const flip = tipLeft > width * 0.6;

  return (
    <div ref={containerRef} className="relative select-none">
      <svg width={width} height={height} role="group" aria-label={ariaLabel}>
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {ticks.map((t) => (
            <g key={t} transform={`translate(0,${y(t)})`}>
              <line x2={innerW} stroke="#EDE7DC" strokeWidth="1" />
              <text x={-8} dy="0.32em" textAnchor="end" className="fill-charcoal-light text-[11px] tabular-nums">
                {format(t, true)}
              </text>
            </g>
          ))}

          {labels.map((label, i) => {
            const x0 = band * i + (band - groupW) / 2;
            const dimmed = (selected !== null && selected !== i) || (hover !== null && hover !== i && selected === null);
            return (
              <g
                key={label.key}
                role="button"
                tabIndex={0}
                aria-pressed={selected === i}
                aria-label={`${label.long}: ${series.map((s) => `${s.name} ${format(s.values[i])}`).join(', ')}`}
                onClick={() => choose(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    choose(i);
                  }
                }}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="cursor-pointer focus:outline-none"
              >
                <rect x={band * i} width={band} height={innerH} fill={selected === i ? '#F5F0E8' : 'transparent'} rx="6" />
                {series.map((s, si) => {
                  const h = innerH - y(s.values[i]);
                  return (
                    <path
                      key={s.id}
                      d={columnPath(x0 + si * (barW + GAP), innerH - h, barW, h)}
                      fill={s.color}
                      opacity={dimmed ? 0.35 : 1}
                      className="transition-opacity"
                    />
                  );
                })}
                {(last - i) % labelEvery === 0 && (
                  <text x={band * i + band / 2} y={innerH + 18} textAnchor="middle" className={`text-[11px] ${selected === i ? 'fill-forest-deep font-semibold' : 'fill-charcoal-light'}`}>
                    {label.short}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 min-w-[160px] rounded-lg bg-white px-3 py-2 text-sm shadow-lg ring-1 ring-black/5"
          style={flip ? { right: width - tipLeft + band / 2 } : { left: tipLeft + band / 2 }}
        >
          <div className="mb-1 text-xs font-medium text-charcoal-light">{labels[hover].long}</div>
          {series.map((s) => (
            <div key={s.id} className="flex items-center gap-2 py-0.5">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: s.color }} />
              <span className="font-semibold text-charcoal tabular-nums">{format(s.values[hover])}</span>
              <span className="text-xs text-charcoal-light">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnChart;
