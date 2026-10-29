const W = 240;
const H = 152;
const CX = W / 2;
const CY = 128;
const R = 92;
const STROKE = 22;

const point = (fraction, radius) => {
  const a = Math.PI * (1 - fraction);
  return [CX + radius * Math.cos(a), CY - radius * Math.sin(a)];
};

const arc = (from, to) => {
  const [x1, y1] = point(from, R);
  const [x2, y2] = point(to, R);
  return `M${x1},${y1}A${R},${R} 0 0 1 ${x2},${y2}`;
};

/**
 * Half-ring gauge: the fill is the value, the copper tick is the target (or budget).
 */
const Gauge = ({ value, target, max, format, caption, targetLabel = 'Target' }) => {
  const clamp = (v) => Math.max(0, Math.min(1, v / (max || 1)));
  const fill = clamp(value);
  const mark = clamp(target);
  const [tx1, ty1] = point(mark, R - STROKE / 2 - 3);
  const [tx2, ty2] = point(mark, R + STROKE / 2 + 3);
  const [lx, ly] = point(mark, R + STROKE / 2 + 10);

  return (
    <div className="flex flex-col items-center">
      <svg width={W} height={H} overflow="visible" role="img" aria-label={`${caption}: ${format(value)} against ${targetLabel.toLowerCase()} of ${format(target)}`}>
        <path d={arc(0, 1)} fill="none" stroke="#F5F0E8" strokeWidth={STROKE} />
        {fill > 0 && <path d={arc(0, fill)} fill="none" stroke="#334C33" strokeWidth={STROKE} className="transition-all duration-500" />}
        <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#B07D55" strokeWidth="3" strokeLinecap="round" />
        <text x={lx} y={ly} textAnchor={mark > 0.6 ? 'start' : mark < 0.4 ? 'end' : 'middle'} className="fill-charcoal text-[11px] font-semibold">
          {format(target)}
        </text>
        <text x={CX} y={CY - 8} textAnchor="middle" className="fill-forest-deep text-[26px] font-semibold">
          {format(value)}
        </text>
        <text x={CX - R} y={CY + 16} textAnchor="middle" className="fill-charcoal-light text-[11px]">0</text>
        <text x={CX + R} y={CY + 16} textAnchor="middle" className="fill-charcoal-light text-[11px]">{format(max)}</text>
      </svg>
      <p className="mt-2 flex items-center gap-3 text-xs text-charcoal-light">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-forest" />
          {caption}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-0.5 rounded bg-accent-hover" />
          {targetLabel}
        </span>
      </p>
    </div>
  );
};

export default Gauge;
