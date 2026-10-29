import { useState } from 'react';

/**
 * Stacked horizontal bar per location. With `onSelect`, clicking a location
 * filters the whole dashboard to it; clicking it again clears the filter.
 * `highlight` (a segment name) fades the other segments.
 */
const LocationBars = ({ rows, format, selected = 'all', onSelect, highlight = null }) => {
  const [hover, setHover] = useState(null);
  const totals = rows.map((r) => r.segments.reduce((t, s) => t + s.value, 0));
  const max = Math.max(...totals) || 1;
  const Row = onSelect ? 'button' : 'div';

  return (
    <ul className="space-y-4">
      {rows.map((row, i) => {
        const dimmed = selected !== 'all' && selected !== row.id;
        return (
          <li key={row.id} className="relative">
            <Row
              type={onSelect ? 'button' : undefined}
              tabIndex={onSelect ? undefined : 0}
              onClick={onSelect ? () => onSelect(selected === row.id ? 'all' : row.id) : undefined}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-pressed={onSelect ? selected === row.id : undefined}
              className={`-m-1 w-full rounded-lg p-1 text-left transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                dimmed ? 'opacity-40 hover:opacity-70' : ''
              }`}
            >
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-charcoal">{row.name}</span>
                <span className="font-semibold text-charcoal tabular-nums">{format(totals[i])}</span>
              </div>
              <div className="flex h-4 gap-0.5" style={{ width: `${(totals[i] / max) * 100}%` }}>
                {row.segments.map((s, si) => (
                  <span
                    key={s.name}
                    className={`h-4 transition-opacity ${si === row.segments.length - 1 ? 'rounded-r' : ''}`}
                    style={{
                      width: `${(s.value / (totals[i] || 1)) * 100}%`,
                      backgroundColor: s.color,
                      opacity: highlight && highlight !== s.name ? 0.25 : 1,
                    }}
                  />
                ))}
              </div>
            </Row>
            {hover === i && (
              <div className="pointer-events-none absolute left-0 top-full z-10 mt-1 min-w-[170px] rounded-lg bg-white px-3 py-2 text-sm shadow-lg ring-1 ring-black/5">
                {row.segments.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 py-0.5">
                    <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: s.color }} />
                    <span className="font-semibold text-charcoal tabular-nums">{format(s.value)}</span>
                    <span className="text-xs text-charcoal-light">{s.name}</span>
                  </div>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default LocationBars;
