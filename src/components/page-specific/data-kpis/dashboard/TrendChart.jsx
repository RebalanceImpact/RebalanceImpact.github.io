import { useId, useState } from 'react';
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
 * - Series marked `stack` are drawn as stacked areas, bottom first, and the
 *   tooltip gives each one's share of the stack. `forecastAfter` (an index)
 *   lightens the areas after it and marks where the forecast starts.
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
  forecastAfter = null,
  ariaLabel,
}) => {
  const [containerRef, width] = useElementWidth(560);
  const [hover, setHover] = useState(null);
  const clipId = useId().replace(/:/g, '');

  const lines = series.filter((s) => !s.stack);
  const bands = series
    .filter((s) => s.stack)
    .reduce((acc, s) => {
      const lower = acc.length ? acc[acc.length - 1].top : labels.map(() => 0);
      const upper = s.values.map((v, i) => (v === null ? null : lower[i] + v));
      return [...acc, { ...s, lower, upper, top: upper.map((v, i) => v ?? lower[i]) }];
    }, []);
  const stackTotal = bands.length ? bands[bands.length - 1].top : [];

  const innerW = width - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const values = [...lines.flatMap((s) => s.values), ...bands.flatMap((b) => b.upper)].filter((v) => v !== null);
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
  const bandPath = (b) => {
    const idx = b.upper.flatMap((v, i) => (v === null ? [] : [i]));
    const top = idx.map((i, j) => `${j ? 'L' : 'M'}${x(i)},${y(b.upper[i])}`).join('');
    const bottom = [...idx].reverse().map((i) => `L${x(i)},${y(b.lower[i])}`).join('');
    return `${top}${bottom}Z`;
  };
  const split = forecastAfter !== null && forecastAfter < last ? x(forecastAfter) : null;
  const faded = (s) => highlight !== null && s.id !== highlight;
  const washed = area === 'all' ? lines.filter((s) => s.area !== false) : area ? lines.slice(-1) : [];

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
  // Open the tooltip on the roomier side, kept within the chart's width.
  const tipW = bands.length ? 230 : 150;
  const flip = tipX > width * 0.6 || tipX + 12 + tipW > width;
  const tipOffset = Math.max(0, Math.min(width - tipW, flip ? width - tipX + 12 : tipX + 12));
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

          {selected !== null && !bands.length && (
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

          {split !== null && (
            <defs>
              <clipPath id={`${clipId}-actual`}>
                <rect x={-1} width={split + 1} height={innerH} />
              </clipPath>
              <clipPath id={`${clipId}-forecast`}>
                <rect x={split} width={innerW - split + 1} height={innerH} />
              </clipPath>
            </defs>
          )}

          {bands.map((b) => (
            <g key={`band-${b.id}`} opacity={faded(b) ? 0.15 : 1} className="transition-opacity">
              {split === null ? (
                <path d={bandPath(b)} fill={b.color} fillOpacity="0.85" />
              ) : (
                <>
                  <path d={bandPath(b)} fill={b.color} fillOpacity="0.85" clipPath={`url(#${clipId}-actual)`} />
                  <path d={bandPath(b)} fill={b.color} fillOpacity="0.45" clipPath={`url(#${clipId}-forecast)`} />
                </>
              )}
              <path d={linePath(b.upper)} fill="none" stroke="#fff" strokeWidth="1" />
            </g>
          ))}

          {split !== null && (
            <g>
              <line x1={split} x2={split} y2={innerH} stroke="#2C2C2C" strokeOpacity="0.35" strokeDasharray="3 3" />
              <text x={split + 6} y={10} className="fill-charcoal-light text-[11px]">
                Forecast
              </text>
            </g>
          )}

          {lines.map((s) => (
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
              {lines.map((s) =>
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
          className={`pointer-events-none absolute top-0 z-10 rounded-lg bg-white px-3 py-2 text-sm shadow-lg ring-1 ring-black/5 ${
            bands.length ? 'min-w-[210px]' : 'min-w-[150px]'
          }`}
          style={flip ? { right: tipOffset } : { left: tipOffset }}
        >
          <div className="mb-1 text-xs font-medium text-charcoal-light">{labels[shown].long}</div>
          {[...bands].reverse().map((b) =>
            b.values[shown] === null ? null : (
              <div key={b.id} className={`flex items-center gap-2 py-0.5 ${faded(b) ? 'opacity-50' : ''}`}>
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-sm" style={{ backgroundColor: b.color }} />
                <span className="font-semibold text-charcoal tabular-nums">{format(b.values[shown])}</span>
                <span className="text-xs text-charcoal-light">{b.name}</span>
                {bands.length > 1 && (
                  <span className="ml-auto pl-2 text-xs text-charcoal-light tabular-nums">
                    {stackTotal[shown] ? Math.round((b.values[shown] / stackTotal[shown]) * 100) : 0}%
                  </span>
                )}
              </div>
            )
          )}
          {bands.length > 1 && (
            <div className="mt-0.5 flex items-center gap-2 border-t border-black/5 pt-1">
              <span className="w-2.5 flex-shrink-0" />
              <span className="font-semibold text-charcoal tabular-nums">{format(stackTotal[shown])}</span>
              <span className="text-xs text-charcoal-light">Total</span>
            </div>
          )}
          {lines.map((s) =>
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
