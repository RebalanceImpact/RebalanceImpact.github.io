import { useState } from 'react';
import { Check, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * "Try it yourself" checklist shown beside the dashboard. Steps tick off as
 * the visitor uses each interaction; the next untried step is emphasised.
 * Below desktop width only the next step shows until the list is expanded.
 */
const DashboardGuide = ({ steps, done }) => {
  const [expanded, setExpanded] = useState(false);
  const count = steps.filter((s) => done.includes(s.id)).length;
  const next = steps.find((s) => !done.includes(s.id));

  return (
    <aside aria-label="Dashboard guide" className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5 xl:p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent xl:text-[11px]">Try it yourself</p>
      <p className="mt-1 font-display text-xl text-forest-deep xl:text-base">
        {count} of {steps.length} explored
      </p>
      <div className="mt-3 h-1.5 rounded-full bg-sand-light xl:mt-2 xl:h-1" aria-hidden="true">
        <div className="h-1.5 rounded-full bg-forest transition-all duration-500 xl:h-1" style={{ width: `${(count / steps.length) * 100}%` }} />
      </div>

      <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:mt-3 xl:grid-cols-1 xl:gap-0.5">
        {steps.map((s, i) => {
          const complete = done.includes(s.id);
          const current = next && next.id === s.id;
          return (
            <li
              key={s.id}
              className={`gap-3 rounded-xl p-3 transition-colors xl:gap-2.5 xl:rounded-lg xl:px-2.5 xl:py-2 ${current ? 'bg-sand-light ring-1 ring-accent/40' : ''} ${
                current || expanded ? 'flex' : 'hidden xl:flex'
              }`}
            >
              <span
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold xl:h-5 xl:w-5 xl:text-[10px] ${
                  complete ? 'bg-forest text-white' : current ? 'bg-accent text-white' : 'bg-sand-light text-charcoal-light'
                }`}
              >
                {complete ? <Check className="h-3.5 w-3.5 xl:h-3 xl:w-3" aria-label="Done" /> : i + 1}
              </span>
              <span>
                <span className={`block text-sm font-semibold xl:text-xs ${complete ? 'text-charcoal-light' : 'text-charcoal'}`}>{s.title}</span>
                <span className="block text-xs leading-relaxed text-charcoal-light xl:text-[11px] xl:leading-snug">{s.detail}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover xl:hidden"
      >
        {expanded ? 'Show less' : `See all ${steps.length} steps`}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {!next && (
        <div className="mt-4 rounded-xl bg-forest-deep p-4 text-sm text-sand-light xl:mt-3 xl:p-3 xl:text-xs">
          <p className="font-semibold text-white">Now picture it with your own data.</p>
          <Link to="/#contact-and-quote" className="mt-2 inline-flex items-center gap-1.5 font-semibold text-sandstone hover:text-white">
            Request a demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </aside>
  );
};

export default DashboardGuide;
