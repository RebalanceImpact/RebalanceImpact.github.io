import StatCard from './StatCard';

const LegendKey = ({ item, shape }) => {
  if (shape === 'square') return <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />;
  if (item.dotted) return <span className="w-4 border-t-[3px] border-dotted" style={{ borderColor: item.color }} />;
  return <span className={`w-4 rounded-full ${item.thin ? 'h-px' : 'h-0.5'}`} style={{ backgroundColor: item.color }} />;
};

/**
 * Series legend. With `onSelect`, each item is a toggle that highlights that
 * series (`selected` is its name) across the linked charts.
 */
export const Legend = ({ items, shape = 'line', selected = null, onSelect }) => (
  <ul className="mb-3 flex flex-wrap gap-x-1 gap-y-1 text-xs text-charcoal-light">
    {items.map((item) =>
      onSelect ? (
        <li key={item.name}>
          <button
            type="button"
            onClick={() => onSelect(selected === item.name ? null : item.name)}
            aria-pressed={selected === item.name}
            className={`flex items-center gap-1.5 rounded-md px-1.5 py-0.5 transition-colors hover:bg-sand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              selected === item.name ? 'bg-sand-light font-semibold text-forest-deep' : ''
            } ${selected && selected !== item.name ? 'opacity-50' : ''}`}
          >
            <LegendKey item={item} shape={shape} />
            {item.name}
          </button>
        </li>
      ) : (
        <li key={item.name} className="flex items-center gap-1.5 px-1.5 py-0.5">
          <LegendKey item={item} shape={shape} />
          {item.name}
        </li>
      )
    )}
  </ul>
);

export const Panel = ({ title, actions, children, className = '' }) => (
  <section className={`min-w-0 rounded-xl bg-white p-4 md:p-5 ring-1 ring-black/5 ${className}`}>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h3 className="font-sans text-sm md:text-base font-bold text-forest-deep">{title}</h3>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
    {children}
  </section>
);

export const Segmented = ({ label, options, value, onChange, size = 'default' }) => (
  <div role="group" aria-label={label} className="inline-flex flex-wrap rounded-lg bg-sand-light p-1">
    {options.map((o) => {
      const on = value === o.value;
      return (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={on}
          className={`rounded-md font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            size === 'small' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs md:text-sm'
          } ${on ? 'bg-white text-forest-deep shadow-sm' : 'text-charcoal-light hover:text-forest-deep'}`}
        >
          {o.label}
        </button>
      );
    })}
  </div>
);

export const Select = ({ label, options, value, onChange }) => (
  <label className="inline-flex items-center gap-2 rounded-lg bg-sand-light py-1 pl-3 pr-1 text-xs md:text-sm">
    <span className="font-semibold text-charcoal-light">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-md bg-white px-2 py-1 font-semibold text-forest-deep shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

// Month picker shared by both dashboards: 'all' or 0-11.
export const MonthSelect = ({ value, onChange, months }) => (
  <Select
    label="Month"
    value={String(value)}
    onChange={(v) => onChange(v === 'all' ? 'all' : Number(v))}
    options={[{ value: 'all', label: 'Full year' }, ...months.map((m, i) => ({ value: String(i), label: m }))]}
  />
);

/** A removable chip showing an active cross-filter (e.g. a client or scope). */
export const FilterChip = ({ label, onClear }) => (
  <button
    type="button"
    onClick={onClear}
    className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1 text-xs font-semibold text-white hover:bg-forest-light focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
  >
    {label}
    <span aria-hidden="true">×</span>
    <span className="sr-only">Clear filter</span>
  </button>
);

// Layout responds to the dashboard's own width (container queries), so it
// reflows cleanly whether or not the guide sits beside it.
export const CardColumn = ({ children, row = false }) => (
  <div className={`grid grid-cols-2 gap-3 @lg:grid-cols-3 @3xl:grid-cols-5 ${row ? '' : '@4xl:grid-cols-1 @4xl:content-start'}`}>
    {children}
  </div>
);

const SIZES = {
  wide: '@2xl:col-span-2',
  full: '@2xl:col-span-2 @5xl:col-span-3',
  // Its own row on two columns, a single column on three.
  row: '@2xl:col-span-2 @5xl:col-span-1',
};

// Shared layout for the reporting tabs: headline cards beside (or above) the visuals.
export const Report = ({ cards, panels, cardsOnTop = false }) => (
  <div className="@container">
    <div className={`grid gap-4 ${cardsOnTop ? '' : '@4xl:grid-cols-[210px_minmax(0,1fr)]'}`}>
      <CardColumn row={cardsOnTop}>
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </CardColumn>
      <div className="@container min-w-0">
        <div className="grid grid-flow-row-dense gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
          {panels.map((p) => (
            <Panel key={p.title} title={p.title} actions={p.actions} className={SIZES[p.size] || ''}>
              {p.body}
            </Panel>
          ))}
        </div>
      </div>
    </div>
  </div>
);
