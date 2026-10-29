import { useState } from 'react';
import { niceTicks, linear, useElementWidth } from './scale';

const MARGIN = { top: 12, right: 16, bottom: 26, left: 48 };
const DOTTED = '0.1 5';

/**
 * Line chart with a snapping crosshair and one tooltip listing every series.
 *
 * - Series values may be null (the line breaks there); `dotted` marks a
 *   forecast and `thin` a reference line such as a target pathway.
 * - `area` washes the last series (true) or every series ('all') down to the
 *   baseline; with 'all', a series with `area: false` stays a plain line.
 * - `fitted` fits the axis to the data instead of starting at zero.
 * - With `onSelect`, clicking (or Enter on) a point selects that index and
 *   `selected` keeps it marked; clicking it again clears it.
 * - `highlight` (a series id) fades the other series.
 */
const TrendChart = ({
  labels,
  series,
  format,
  height = 220,
  area = false,
  fitted = false,
  selected = null,
  onSelect,
  highlight = null,
  ariaLabel,
}) => {
  const [containerRef, width] = useElementWidth(560);
  const [hover, setHover] = useState(null);

  const innerW = width - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const values = series.flatMap((s) => s.values).filter((v) => v !== null);
  const lo = Math.min(...values);
  const hi = Math.max(...values, 0);
  const pad = (hi - lo) * 0.2;
  const ticks = fitted ? niceTicks(Math.max(0, lo - pad), hi + pad) : niceTicks(0, hi);
  const y = linear([ticks[0], ticks[ticks.length - 1]], [innerH, 0]);
  const last = labels.length - 1;
  const step = last ? innerW / last : 0;
  const x = (i) => i * step;
  const labelEvery = width < 420 && labels.length > 6 ? 2 : 1;
  const linePath = (vals) =>
    vals.map((v, i) => (v === null ? '' : `${i && vals[i - 1] !== null ? 'L' : 'M'}${x(i)},${y(v)}`)).join('');
  const faded = (s) => highlight !== null && s.id !== highlight;
  const washed = area === 'all' ? series.filter((s) => s.area !== false) : area ? [series[series.length - 1]] : [];

  const indexFromPointer = (event) => {
    const rect = event.currentTarget.ownerSVGElement.getBoundingClientRect();
    const px = event.clientX - rect.left - MARGIN.left;
    return Math.max(0, Math.min(last, Math.round(step ? px / step : 0)));
  };

  const choose = (i) => onSelect && onSelect(selected === i ? null : i);

  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(hover ?? last);
      return;
    }
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    setHover((h) => Math.max(0, Math.min(last, (h ?? last) + delta)));
  };

  const shown = hover;
  const tipX = shown !== null ? MARGIN.left + x(shown) : 0;
  const flip = tipX > width * 0.6;
  const markers = [...new Set([selected, hover].filter((i) => i !== null))];

  return (
    <div ref={containerRef} className="relative select-none">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => setHover((h) => h ?? selected ?? last)}
        onBlur={() => setHover(null)}
        className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {ticks.map((t) => (
            <g key={t} transform={`translate(0,${y(t)})`}>
              <line x2={innerW} stroke="#EDE7DC" strokeWidth="1" />
              <text x={-8} dy="0.32em" textAnchor="end" className="fill-charcoal-light text-[11px] tabular-nums">
                {format(t, true)}
              </text>
            </g>
          ))}

          {selected !== null && (
            <rect x={x(selected) - Math.max(8, step / 2)} width={Math.max(16, step)} height={innerH} fill="#F5F0E8" rx="6" />
          )}

          {labels.map((label, i) =>
            (last - i) % labelEvery === 0 || i === selected ? (
              <text
                key={label.key}
                x={x(i)}
                y={innerH + 18}
                textAnchor="middle"
                className={`text-[11px] ${i === selected ? 'fill-forest-deep font-semibold' : 'fill-charcoal-light'}`}
              >
                {label.short}
              </text>
            ) : null
          )}

          {washed
            .filter((s) => !s.values.includes(null))
            .map((s) => (
              <path
                key={`area-${s.id}`}
                d={`${linePath(s.values)}L${x(last)},${innerH}L0,${innerH}Z`}
                fill={s.color}
                opacity={faded(s) ? 0.04 : area === 'all' ? 0.18 : 0.1}
              />
            ))}

          {series.map((s) => (
            <path
              key={s.id}
              d={linePath(s.values)}
              fill="none"
              stroke={s.color}
              strokeWidth={s.dotted ? 3 : s.thin ? 1.5 : 2}
              strokeDasharray={s.dotted ? DOTTED : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={faded(s) ? 0.2 : 1}
              className="transition-opacity"
            />
          ))}

          {markers.map((i) => (
            <g key={`marker-${i}`}>
              {i === hover && <line x1={x(i)} x2={x(i)} y2={innerH} stroke="#2C2C2C" strokeOpacity="0.3" strokeWidth="1" />}
              {series.map((s) =>
                s.values[i] === null || faded(s) ? null : (
                  <circle key={s.id} cx={x(i)} cy={y(s.values[i])} r="4.5" fill={s.color} stroke="#fff" strokeWidth="2" />
                )
              )}
            </g>
          ))}

          <rect
            x={-step / 2}
            width={innerW + step}
            height={innerH}
            fill="transparent"
            className={onSelect ? 'cursor-pointer' : ''}
            onPointerMove={(e) => setHover(indexFromPointer(e))}
            onPointerLeave={() => setHover(null)}
            onClick={(e) => choose(indexFromPointer(e))}
          />
        </g>
      </svg>

      {shown !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 min-w-[150px] rounded-lg bg-white px-3 py-2 text-sm shadow-lg ring-1 ring-black/5"
          style={flip ? { right: width - tipX + 12 } : { left: tipX + 12 }}
        >
          <div className="mb-1 text-xs font-medium text-charcoal-light">{labels[shown].long}</div>
          {series.map((s) =>
            s.values[shown] === null ? null : (
              <div key={s.id} className={`flex items-center gap-2 py-0.5 ${faded(s) ? 'opacity-50' : ''}`}>
                <span
                  className={`w-3 ${s.dotted ? 'border-t-2 border-dotted' : 'h-0.5 rounded-full'}`}
                  style={s.dotted ? { borderColor: s.color } : { backgroundColor: s.color }}
                />
                <span className="font-semibold text-charcoal tabular-nums">{format(s.values[shown])}</span>
                <span className="text-xs text-charcoal-light">{s.name}</span>
              </div>
            )
          )}
          {onSelect && (
            <div className="mt-1 border-t border-black/5 pt-1 text-[11px] text-charcoal-light">
              {selected === shown ? 'Click to clear' : 'Click to select'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendChart;
