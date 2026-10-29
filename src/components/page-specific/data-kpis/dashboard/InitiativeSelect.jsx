import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { fmt } from '../../../../data/demoDashboard';

/**
 * Legend of the initiatives included in a chart. `relevant` limits it to the
 * initiatives that affect that chart (e.g. only solar changes grid electricity).
 */
export const InitiativeChips = ({ initiatives, selected, relevant }) => {
  const shown = initiatives.filter((i) => selected.includes(i.id) && (!relevant || relevant.includes(i.id)));
  return (
    <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
      <span className="text-charcoal-light">{shown.length ? 'Includes' : 'No initiatives included'}</span>
      {shown.map((i) => (
        <span key={i.id} className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2 py-0.5 font-medium text-forest-deep">
          <Check className="h-3 w-3" aria-hidden="true" />
          {i.name}
        </span>
      ))}
    </div>
  );
};

/**
 * Dropdown of planned initiatives with their annual effect. The selection is
 * shared, so every forecast and cost view updates together.
 */
const InitiativeSelect = ({ initiatives, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (event.type === 'keydown' ? event.key === 'Escape' : !ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((i) => i !== id) : [...selected, id]);
  const label = selected.length ? `${selected.length} selected` : 'None';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          selected.length ? 'bg-forest text-white ring-forest' : 'bg-sand-light text-charcoal-light ring-transparent hover:text-forest-deep'
        }`}
      >
        Initiatives: {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 sm:left-auto sm:right-0 mt-2 w-[290px] max-w-[calc(100vw-3rem)] rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/10">
          <ul>
            {initiatives.map((i) => (
              <li key={i.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-sand-light">
                  <input
                    type="checkbox"
                    checked={selected.includes(i.id)}
                    onChange={() => toggle(i.id)}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 accent-forest"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-charcoal">{i.name}</span>
                    <span className="block text-xs text-charcoal-light">
                      {i.where}
                      {i.tCO2e > 0 && ` · −${fmt.count(i.tCO2e)} tCO₂e`}
                      {i.saving > 0 && ` · ${fmt.rand(i.saving)} a year`}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-1 flex items-center justify-between border-t border-black/5 px-2 pt-2 text-xs text-charcoal-light">
            <span>Applies to all forecasts</span>
            {selected.length > 0 && (
              <button type="button" onClick={() => onChange([])} className="font-semibold text-accent hover:text-accent-hover">
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InitiativeSelect;
