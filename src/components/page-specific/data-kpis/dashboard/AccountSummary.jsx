import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * Statement summary with expandable groups (e.g. Profit & Loss, Balance Sheet).
 * Each group's header carries its bottom line; lines marked `subtotal` are bold.
 * A line with `onSelect` is clickable, and `active` marks it as selected.
 */
const AccountSummary = ({ groups, format, onToggle }) => {
  const [open, setOpen] = useState(() => groups.map((g) => g.id));
  const toggle = (id) => {
    setOpen((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
    if (onToggle) onToggle(id);
  };

  return (
    <table className="w-full text-sm tabular-nums">
      <thead>
        <tr className="border-b border-black/10 text-left text-xs text-charcoal-light">
          <th className="py-2 font-medium">Statement</th>
          <th className="py-2 text-right font-medium">Amount</th>
        </tr>
      </thead>
      {groups.map((g) => {
        const expanded = open.includes(g.id);
        return (
          <tbody key={g.id} className="border-b border-black/5 last:border-0">
            <tr>
              <td className="py-2">
                <button
                  type="button"
                  onClick={() => toggle(g.id)}
                  aria-expanded={expanded}
                  className="inline-flex items-center gap-1.5 font-semibold text-forest-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                >
                  <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} aria-hidden="true" />
                  {g.label}
                </button>
              </td>
              <td className="py-2 text-right font-semibold text-forest-deep">{expanded ? '' : format(g.total)}</td>
            </tr>
            {expanded &&
              g.lines.map((line) => (
                <tr
                  key={line.label}
                  className={`${line.subtotal || line.active ? 'font-semibold text-charcoal' : 'text-charcoal-light'} ${line.active ? 'bg-sand-light' : ''}`}
                >
                  <td className={`py-1.5 pl-6 ${line.subtotal ? 'border-t border-black/5' : ''}`}>
                    {line.onSelect ? (
                      <button
                        type="button"
                        onClick={line.onSelect}
                        aria-pressed={Boolean(line.active)}
                        className="rounded text-left underline decoration-black/15 underline-offset-2 hover:text-forest-deep hover:decoration-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {line.label}
                      </button>
                    ) : (
                      line.label
                    )}
                  </td>
                  <td className={`py-1.5 pr-1 text-right ${line.subtotal ? 'border-t border-black/5' : ''}`}>{format(line.value)}</td>
                </tr>
              ))}
          </tbody>
        );
      })}
    </table>
  );
};

export default AccountSummary;
