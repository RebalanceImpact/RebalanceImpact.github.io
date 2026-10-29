import { useState } from 'react';
import {
  LOCATIONS,
  BASE_YEAR,
  YEARS,
  TARGET_YEAR,
  MONTH_LABELS,
  COLORS,
  RATING_COLORS,
  HORIZONS,
  TARGETS,
  INITIATIVES,
  HAZARD_TYPES,
  RISK_LEVELS,
  CLIMATE_SITES,
  siteRating,
  select,
  sum,
  monthly,
  byLocation,
  scope1,
  scope2,
  scope3,
  totalEmissions,
  recordables,
  perMillionHours,
  costs,
  emissionsOutlook,
  gridOutlook,
  climateOutlook,
  initiativeSummary,
  carbonExposure,
  fmt,
} from '../../../../data/demoDashboard';
import TrendChart from './TrendChart';
import Donut from './Donut';
import LocationBars from './LocationBars';
import Gauge from './Gauge';
import InitiativeSelect, { InitiativeChips } from './InitiativeSelect';
import { Legend, Segmented, MonthSelect, FilterChip, Report } from './ui';

const SERIES_COLORS = [COLORS.first, COLORS.second, COLORS.third];
const ALL_INITIATIVES = INITIATIVES.map((i) => i.id);
const RELEVANT = {
  emissions: ['solar', 'fleet', 'suppliers'],
  grid: ['solar'],
  carbon: ['solar', 'fleet'],
};

const units = {
  tonnes: (v, short) => (short ? fmt.tonnes(v, true) : `${fmt.tonnes(v)} tCO₂e`),
  mwh: (v, short) => (short ? fmt.mwh(v) : `${fmt.mwh(v)} MWh`),
  kl: (v, short) => (short ? fmt.kl(v, true) : `${fmt.kl(v)} kL`),
  count: (v) => fmt.count(v),
  rand: (v, short) => fmt.rand(v, short),
};

const pctChange = (now, before) => (before ? ((now - before) / before) * 100 : 0);
const utilitySpend = (r) => costs.electricity(r) + costs.fuel(r) + costs.water(r);
const isTransition = (risk) => risk.type.startsWith('Transition');
const lowerText = (share) => (share >= 0.005 ? `${Math.round(share * 100)}% lower` : '—');

/** Two bars per location (e.g. now vs 2030); clicking a row filters to that location. */
const PairBars = ({ rows, labels, format, selected, onSelect }) => {
  const max = Math.max(...rows.flatMap((r) => [r.a, r.b]), 1);
  return (
    <>
      <Legend items={[{ name: labels[0], color: COLORS.prior }, { name: labels[1], color: COLORS.first }]} shape="square" />
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onSelect(selected === r.id ? 'all' : r.id)}
              aria-pressed={selected === r.id}
              className={`-m-1 w-full rounded-lg p-1 text-left transition-opacity hover:bg-sand-light/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                selected !== 'all' && selected !== r.id ? 'opacity-40' : ''
              }`}
            >
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-charcoal">{r.name}</span>
                <span className="text-xs text-charcoal-light tabular-nums">
                  {format(r.a)} → <span className="font-semibold text-charcoal">{format(r.b)}</span>
                </span>
              </div>
              {[r.a, r.b].map((v, i) => (
                <div key={labels[i]} className="mb-0.5 h-2.5 rounded-r" style={{ width: `${(v / max) * 100}%`, backgroundColor: i ? COLORS.first : COLORS.prior }} />
              ))}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

/**
 * Hazard ratings by location for the selected period, sampled from the grid.
 * Clicking a row filters the location; a column header highlights that hazard.
 */
const HazardTable = ({ locations, hazard, period, onHazard, selected, onSelect }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[520px] text-sm">
      <thead>
        <tr className="border-b border-black/10 text-left text-xs text-charcoal-light">
          <th className="py-2 pr-3 font-medium">Location</th>
          {HAZARD_TYPES.map((h) => (
            <th key={h.id} className={`px-0.5 py-2 font-medium ${hazard === h.id ? 'bg-sand-light/70' : ''}`}>
              <button
                type="button"
                onClick={() => onHazard(hazard === h.id ? null : h.id)}
                aria-pressed={hazard === h.id}
                className={`rounded px-1.5 py-0.5 hover:bg-sand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  hazard === h.id ? 'bg-sand-light font-semibold text-forest-deep' : ''
                }`}
              >
                {h.name}
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {locations.map((l) => (
          <tr
            key={l.id}
            onClick={() => onSelect(selected === l.id ? 'all' : l.id)}
            className={`cursor-pointer border-b border-black/5 last:border-0 hover:bg-sand-light/60 ${
              selected !== 'all' && selected !== l.id ? 'opacity-40' : ''
            }`}
          >
            <td className="py-2.5 pr-3">
              <div className="font-medium text-charcoal">{CLIMATE_SITES[l.id].site}</div>
              <div className="text-xs text-charcoal-light">{l.name}</div>
            </td>
            {HAZARD_TYPES.map((h) => {
              const rating = siteRating(l.id, h.id, period);
              return (
                <td key={h.id} className={`px-1.5 py-2.5 ${hazard === h.id ? 'bg-sand-light/70' : ''}`}>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${rating >= 3 ? 'text-white' : 'text-charcoal'}`}
                    style={{ backgroundColor: RATING_COLORS[rating - 1] }}
                  >
                    {RISK_LEVELS[rating - 1]}
                  </span>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Sustainability view. Year, month and location filters, chart clicks,
 * highlighted series and planned initiatives are shared by every tab.
 * `onAction` reports interactions to the guide beside the dashboard.
 */
const SustainabilityDashboard = ({ tab, onAction = () => {} }) => {
  const [year, setYear] = useState(YEARS[YEARS.length - 1]);
  const [month, setMonth] = useState('all');
  const [location, setLocationState] = useState('all');
  const [initiatives, setInitiativesState] = useState(ALL_INITIATIVES);
  const [trendMode, setTrendModeState] = useState('monthly');
  const [financeView, setFinanceViewState] = useState('financial');
  const [highlights, setHighlights] = useState({});
  const [hazard, setHazard] = useState(null);
  const [period, setPeriod] = useState(2030);

  const highlight = highlights[tab] ?? null;
  const setHighlight = (name) => {
    setHighlights((h) => ({ ...h, [tab]: name }));
    if (name) onAction('highlight');
  };
  const setLocation = (id) => {
    setLocationState(id);
    if (id !== 'all') onAction('location');
  };
  const selectMonth = (i) => {
    setMonth(i === null ? 'all' : i);
    if (i !== null) onAction('month');
  };
  const setTrendMode = (mode) => {
    setTrendModeState(mode);
    if (mode === 'yearly') onAction('yearly');
  };
  const setInitiatives = (ids) => {
    setInitiativesState(ids);
    onAction('initiative');
  };
  const toggleInitiative = (id) => setInitiatives(initiatives.includes(id) ? initiatives.filter((i) => i !== id) : [...initiatives, id]);
  const setFinanceView = (view) => {
    setFinanceViewState(view);
    if (view === 'climate') onAction('financeView');
  };

  const yearRows = select(year, location);
  const rows = select(year, location, month);
  const priorRows = select(year - 1, location, month);
  const allRows = select(year, 'all', month);
  const months = MONTH_LABELS.map((m) => ({ key: m, short: m, long: `${m} ${year}` }));
  const selectedMonth = month === 'all' ? null : month;
  const periodLabel = month === 'all' ? String(year) : `${MONTH_LABELS[month]} ${year}`;
  const priorLabel = month === 'all' ? 'prior year' : `${MONTH_LABELS[month]} ${year - 1}`;
  const withPeriod = (title) => (month === 'all' ? title : `${title} · ${periodLabel}`);
  const summary = initiativeSummary(year);

  const series = (defs) => defs.map((d, i) => ({ id: d.name, name: d.name, color: SERIES_COLORS[i], values: monthly(yearRows, d.fn) }));
  const segments = (defs) => defs.map((d, i) => ({ name: d.name, color: SERIES_COLORS[i], value: sum(rows, d.fn) }));
  const locationRows = (defs) =>
    LOCATIONS.map((l, li) => ({
      ...l,
      segments: defs.map((d, i) => ({ name: d.name, color: SERIES_COLORS[i], value: byLocation(allRows, d.fn)[li] })),
    }));
  const yearOnYear = (fn) => [
    { id: 'prior', name: String(year - 1), color: COLORS.prior, values: monthly(select(year - 1, location), fn) },
    { id: 'current', name: String(year), color: COLORS.first, values: monthly(yearRows, fn) },
  ];

  const initiativePicker = <InitiativeSelect initiatives={summary} selected={initiatives} onChange={setInitiatives} />;
  const years = Array.from({ length: TARGET_YEAR - BASE_YEAR + 1 }, (_, i) => {
    const y = BASE_YEAR + i;
    return { key: String(y), short: String(y), long: y > year ? `${y} forecast` : String(y) };
  });
  // Clicking an actual year on a yearly chart moves the whole dashboard to that year.
  const selectYearIndex = (i) => {
    if (i !== null && YEARS.includes(BASE_YEAR + i)) setYear(BASE_YEAR + i);
  };

  const withLegend = (items, chart, shape) => (
    <>
      <Legend items={items} shape={shape} />
      {chart}
    </>
  );

  const monthlyChart = (title, defs, format) => ({
    title: `${title} · ${year}`,
    body: (
      <>
        <Legend items={series(defs)} selected={highlight} onSelect={setHighlight} />
        <TrendChart
          labels={months}
          series={series(defs)}
          format={format}
          selected={selectedMonth}
          onSelect={selectMonth}
          highlight={highlight}
          ariaLabel={`${title}, ${year}`}
        />
      </>
    ),
  });

  // Month by month, or actuals by year with a dotted forecast to the target year.
  const trendPanel = (defs, format, outlook, relevant) => {
    const modeToggle = (
      <Segmented
        label="Trend view"
        size="small"
        value={trendMode}
        onChange={setTrendMode}
        options={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Year on year' },
        ]}
      />
    );

    if (trendMode === 'monthly') return { ...monthlyChart('Monthly Assessment', defs, format), size: 'wide', actions: modeToggle };

    const pick = (field) => outlook.path.map((p) => p[field]);
    const lines = [
      { id: 'actual', name: 'Actual', color: COLORS.first, values: pick('actual') },
      ...(outlook.initiatives
        ? [
            { id: 'bau', name: 'Forecast, no further action', color: COLORS.prior, dotted: true, values: pick('bau') },
            { id: 'planned', name: 'Forecast with initiatives', color: COLORS.first, dotted: true, values: pick('planned') },
          ]
        : [{ id: 'bau', name: 'Forecast', color: COLORS.first, dotted: true, values: pick('bau') }]),
      { id: 'target', name: 'Target pathway', color: COLORS.third, thin: true, values: pick('target') },
    ];

    return {
      title: `Year-on-Year Forecast to ${TARGET_YEAR}`,
      size: 'wide',
      actions: (
        <>
          {modeToggle}
          {initiativePicker}
        </>
      ),
      body: (
        <>
          <Legend items={lines} />
          <InitiativeChips initiatives={summary} selected={initiatives} relevant={relevant} />
          <TrendChart
            labels={years}
            series={lines}
            format={format}
            fitted
            selected={year - BASE_YEAR}
            onSelect={selectYearIndex}
            ariaLabel={`Yearly actuals and forecast to ${TARGET_YEAR}`}
          />
        </>
      ),
    };
  };

  const compositionPanel = (title, defs, format, totalLabel) => ({
    title: withPeriod(title),
    body: <Donut segments={segments(defs)} format={format} totalLabel={totalLabel} selected={highlight} onSelect={setHighlight} />,
  });

  const locationPanel = (title, defs, format) => ({
    title: withPeriod(title),
    body: withLegend(
      segments(defs),
      <LocationBars rows={locationRows(defs)} format={format} selected={location} onSelect={setLocation} highlight={highlight} />,
      'square'
    ),
  });

  const yearOnYearPanel = (fn, format, prefix = '', size) => ({
    title: `${prefix}${year} vs ${year - 1}`,
    size,
    body: withLegend(
      yearOnYear(fn),
      <TrendChart
        labels={months}
        series={yearOnYear(fn)}
        format={format}
        area
        height={200}
        selected={selectedMonth}
        onSelect={selectMonth}
        ariaLabel={`${prefix}${year} against ${year - 1} by month`}
      />
    ),
  });

  const renderGhg = () => {
    const scopes = [
      { name: 'Scope 1', fn: scope1 },
      { name: 'Scope 2', fn: scope2 },
      { name: 'Scope 3', fn: scope3 },
    ];
    const o = emissionsOutlook(year, location, initiatives);
    const current = sum(rows, totalEmissions);
    return (
      <Report
        cards={[
          { label: `${TARGET_YEAR} Target`, unit: 'tCO₂e', value: fmt.tonnes(o.target) },
          {
            label: 'Forecast',
            unit: o.initiatives ? `tCO₂e · ${TARGET_YEAR}, with initiatives` : `tCO₂e · ${TARGET_YEAR}`,
            value: fmt.tonnes(o.projected),
          },
          { label: month === 'all' ? 'Current Year' : 'Selected Month', unit: `tCO₂e · ${periodLabel}`, value: fmt.tonnes(current) },
          { label: 'Movement', unit: `Percentage vs ${priorLabel}`, value: fmt.movement(pctChange(current, sum(priorRows, totalEmissions))) },
          { label: 'On Track for Target', unit: `${TARGET_YEAR} emissions target`, status: o.onTrack },
        ]}
        panels={[
          trendPanel(scopes, units.tonnes, o, RELEVANT.emissions),
          compositionPanel('Composition of GHG Emissions', scopes, (v) => fmt.tonnes(v), 'tCO₂e'),
          locationPanel('Emissions per Location', scopes, units.tonnes),
          {
            title: 'Comparison to Target',
            body: <Gauge value={o.projected} target={o.target} max={Math.max(o.base, o.projected)} format={(v) => fmt.tonnes(v)} caption={`${TARGET_YEAR} forecast`} />,
          },
          yearOnYearPanel(totalEmissions, units.tonnes, 'Emissions: '),
        ]}
      />
    );
  };

  const renderEnergy = () => {
    const sources = [
      { name: 'Grid electricity', fn: 'gridKwh' },
      { name: 'Solar PV', fn: 'solarKwh' },
      { name: 'Generators', fn: 'generatorKwh' },
    ];
    const g = gridOutlook(year, location, initiatives);
    const grid = sum(rows, 'gridKwh');
    const used = sum(rows, (r) => r.gridKwh + r.solarKwh + r.generatorKwh);
    return (
      <Report
        cards={[
          { label: 'Grid Electricity', unit: `MWh · ${periodLabel}`, value: fmt.mwh(grid) },
          { label: 'Renewable Share', unit: `Percentage of electricity · ${periodLabel}`, value: fmt.pct(used ? (sum(rows, 'solarKwh') / used) * 100 : 0) },
          { label: 'Water Use', unit: `kL · ${periodLabel}`, value: fmt.kl(sum(rows, 'waterKl')) },
          { label: 'Movement', unit: `Grid electricity vs ${priorLabel}`, value: fmt.movement(pctChange(grid, sum(priorRows, 'gridKwh'))) },
          { label: 'On Track for Target', unit: `${TARGET_YEAR} grid electricity target`, status: g.onTrack },
        ]}
        panels={[
          trendPanel(sources, units.mwh, g, RELEVANT.grid),
          compositionPanel('Energy Mix', sources, (v) => fmt.mwh(v), 'MWh'),
          locationPanel('Electricity per Location', sources, units.mwh),
          {
            title: 'Comparison to Target',
            body: <Gauge value={g.projected} target={g.target} max={Math.max(g.base, g.projected)} format={(v) => fmt.mwh(v)} caption={`${TARGET_YEAR} grid forecast, MWh`} />,
          },
          yearOnYearPanel('waterKl', units.kl, 'Water Use: '),
        ]}
      />
    );
  };

  const renderSafety = () => {
    const types = [
      { name: 'Medical treatment cases', fn: 'mtc' },
      { name: 'Lost time injuries', fn: 'lti' },
      { name: 'Serious injuries', fn: 'serious' },
    ];
    const trifr = perMillionHours(rows, recordables);
    const priorTrifr = perMillionHours(priorRows, recordables);
    return (
      <Report
        cards={[
          { label: 'TRIFR', unit: `Rate per million hours · ${periodLabel}`, value: fmt.rate(trifr) },
          { label: 'LTIFR', unit: `Rate per million hours · ${periodLabel}`, value: fmt.rate(perMillionHours(rows, 'lti')) },
          { label: 'SIFR', unit: `Rate per million hours · ${periodLabel}`, value: fmt.rate(perMillionHours(rows, 'serious')) },
          { label: 'Movement', unit: `Percentage TRIFR vs ${priorLabel}`, value: fmt.movement(pctChange(trifr, priorTrifr)) },
          { label: 'On Track for Target', unit: `TRIFR at or below ${TARGETS.trifr}`, status: trifr <= TARGETS.trifr },
        ]}
        panels={[
          { ...monthlyChart('Monthly Assessment', types, units.count), size: 'wide' },
          compositionPanel('Composition of Incidents', types, (v) => fmt.count(v), 'incidents'),
          locationPanel('Incidents per Location', types, units.count),
          {
            title: withPeriod('Comparison to Target'),
            body: <Gauge value={trifr} target={TARGETS.trifr} max={Math.max(priorTrifr, trifr, TARGETS.trifr) * 1.2} format={(v) => fmt.rate(v)} caption="TRIFR" />,
          },
          yearOnYearPanel(recordables, units.count, 'Incidents: '),
        ]}
      />
    );
  };

  const renderFinance = () => {
    const climate = climateOutlook(year, location, initiatives);
    const spend = sum(rows, utilitySpend);
    const carbonTax = sum(rows, costs.carbonTax);
    const chosen = summary.filter((i) => initiatives.includes(i.id) && (location === 'all' || i.locations.includes(location)));
    const siteIds = location === 'all' ? LOCATIONS.map((l) => l.id) : [location];

    const outlookLines = [
      { id: 'actual', name: 'Actual', color: COLORS.first, values: climate.points.map((p) => p.actual) },
      ...(initiatives.length
        ? [
            { id: 'bau', name: 'Forecast, no further action', color: COLORS.prior, dotted: true, values: climate.points.map((p) => p.bau) },
            { id: 'planned', name: 'Forecast with initiatives', color: COLORS.first, dotted: true, values: climate.points.map((p) => p.planned) },
          ]
        : [{ id: 'bau', name: 'Forecast', color: COLORS.first, dotted: true, values: climate.points.map((p) => p.bau) }]),
    ];

    const outlookPanel = {
      title: `Climate-Related Costs to ${TARGET_YEAR}`,
      size: 'wide',
      actions: initiativePicker,
      body: (
        <>
          <Legend items={outlookLines} />
          <InitiativeChips initiatives={summary} selected={initiatives} />
          <TrendChart
            labels={years}
            series={outlookLines}
            format={units.rand}
            fitted
            selected={year - BASE_YEAR}
            onSelect={selectYearIndex}
            ariaLabel={`Climate-related costs, actual and forecast to ${TARGET_YEAR}`}
          />
          <p className="mt-2 text-xs text-charcoal-light">Energy, fuel, carbon tax and expected losses from drought and flooding.</p>
        </>
      ),
    };

    const riskPanel = {
      title: 'Climate-Related Risks',
      size: 'wide',
      body: (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-xs text-charcoal-light">
                <th className="py-2 pr-4 font-medium">Risk</th>
                <th className="py-2 pr-4 font-medium">Time horizon</th>
                <th className="py-2 pr-4 text-right font-medium">{year}</th>
                <th className="py-2 pr-4 text-right font-medium">{TARGET_YEAR}</th>
                <th className="py-2 text-right font-medium">With initiatives</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {climate.risks.map((r) => (
                <tr key={r.id} className="border-b border-black/5 last:border-0">
                  <td className="py-2.5 pr-4">
                    <div className="font-medium text-charcoal">{r.name}</div>
                    <div className="text-xs text-charcoal-light">{r.type}</div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${HORIZONS[r.horizon].dark ? 'text-white' : 'text-charcoal'}`}
                      style={{ backgroundColor: HORIZONS[r.horizon].color }}
                    >
                      {HORIZONS[r.horizon].name}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-right text-charcoal-light">{fmt.rand(r.now)}</td>
                  <td className="py-2.5 pr-4 text-right font-semibold text-charcoal">{fmt.rand(r.planned)}</td>
                  <td className="py-2.5 text-right">
                    {r.lower >= 0.005 ? (
                      <span className="text-xs font-semibold text-forest">{lowerText(r.lower)}</span>
                    ) : (
                      <span className="text-xs text-charcoal-light">No change</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-charcoal-light">
            {Object.values(HORIZONS).map((h) => `${h.name}: ${h.span}`).join(' · ')}
          </p>
        </div>
      ),
    };

    const planPanel = {
      title: 'Transition Plan',
      body: (
        <>
          <ul className="space-y-1.5">
            {summary.map((i) => {
              const on = initiatives.includes(i.id);
              return (
                <li key={i.id}>
                  <button
                    type="button"
                    onClick={() => toggleInitiative(i.id)}
                    aria-pressed={on}
                    className={`w-full rounded-lg p-2.5 text-left ring-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      on ? 'bg-forest/5 ring-forest/30' : 'ring-black/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-charcoal">{i.name}</span>
                      <span className={`text-[11px] font-semibold ${on ? 'text-forest' : 'text-charcoal-light'}`}>{on ? 'Included' : 'Not included'}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-charcoal-light">
                      {i.tCO2e > 0 && `−${fmt.count(i.tCO2e)} tCO₂e`}
                      {i.saving > 0 && ` · saves ${fmt.rand(i.saving)} a year`}
                      {i.payback && ` · ${i.payback.toFixed(1)}-year payback`}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-charcoal-light">Click an initiative to include or exclude it.</p>
        </>
      ),
    };

    const exposureRows = LOCATIONS.map((l) => {
      const risks = climateOutlook(year, l.id, initiatives).risks;
      return {
        ...l,
        segments: [
          { name: 'Transition risk', color: COLORS.first, value: sum(risks.filter(isTransition), 'planned') },
          { name: 'Physical risk', color: COLORS.third, value: sum(risks.filter((r) => !isTransition(r)), 'planned') },
        ],
      };
    });
    const exposurePanel = {
      title: `Cost Exposure by Location, ${TARGET_YEAR}`,
      body: withLegend(exposureRows[0].segments, <LocationBars rows={exposureRows} format={units.rand} selected={location} onSelect={setLocation} />, 'square'),
    };

    // Climate risk in its own terms: hazards, heat and emissions, not rand.
    const exposure = carbonExposure(year, initiatives);
    const sites = LOCATIONS.filter((l) => siteIds.includes(l.id));
    const highRisk = sites.filter((l) => siteRating(l.id, 'overall', period) >= 3).length;
    const hotNow = sites.reduce((t, l) => t + CLIMATE_SITES[l.id].hotDays[0], 0) / sites.length;
    const hot2030 = sites.reduce((t, l) => t + CLIMATE_SITES[l.id].hotDays[1], 0) / sites.length;
    const stressedWater = sum(rows.filter((r) => siteRating(r.location, 'water', period) >= 3), 'waterKl');
    const used = sum(rows, (r) => r.gridKwh + r.solarKwh + r.generatorKwh);
    const periodText = period === 'now' ? 'now' : `by ${period}`;

    const views = {
      financial: {
        cards: [
          { label: 'Utility & Fuel Spend', unit: `R · ${periodLabel}`, value: fmt.rand(spend) },
          { label: 'Carbon Tax', unit: `R · ${periodLabel}, estimated`, value: fmt.rand(carbonTax) },
          { label: 'Climate Cost Exposure', unit: `R per year by ${TARGET_YEAR}`, value: fmt.rand(climate.total2030) },
          { label: 'Lower with Initiatives', unit: `${TARGET_YEAR} costs vs no further action`, value: `${Math.round(climate.lower2030 * 100)}%` },
          { label: 'Emissions Avoided', unit: `tCO₂e per year by ${TARGET_YEAR}`, value: fmt.count(sum(chosen, 'tCO2e')) },
        ],
        panels: [outlookPanel, planPanel, riskPanel, exposurePanel],
      },
      climate: {
        cards: [
          { label: 'Sites at High Risk', unit: `High or very high for any hazard ${periodText}`, value: `${highRisk} of ${sites.length}` },
          { label: 'Days Above 30°C', unit: `Average per site by ${TARGET_YEAR}, up from ${Math.round(hotNow)}`, value: String(Math.round(hot2030)) },
          { label: 'Water in Stressed Areas', unit: `kL used · ${periodLabel}, high stress ${periodText}`, value: fmt.kl(stressedWater) },
          { label: 'Emissions Under Carbon Tax', unit: `Scope 1 tCO₂e · ${periodLabel}`, value: fmt.tonnes(sum(rows, scope1)) },
          { label: 'Grid Dependence', unit: `Percentage of electricity · ${periodLabel}`, value: fmt.pct(used ? (sum(rows, 'gridKwh') / used) * 100 : 0) },
        ],
        panels: [
          {
            title: `Site Hazard Ratings, ${period === 'now' ? 'Now' : TARGET_YEAR}`,
            size: 'wide',
            actions: (
              <Segmented
                label="Period"
                size="small"
                value={period}
                onChange={setPeriod}
                options={[
                  { value: 'now', label: 'Now' },
                  { value: 2030, label: String(TARGET_YEAR) },
                ]}
              />
            ),
            body: (
              <>
                <p className="mb-2 text-xs text-charcoal-light">Click a hazard to highlight it, or a site to filter the dashboard.</p>
                <HazardTable locations={LOCATIONS} hazard={hazard} period={period} onHazard={setHazard} selected={location} onSelect={setLocation} />
              </>
            ),
          },
          {
            title: `Days Above 30°C, Now to ${TARGET_YEAR}`,
            body: (
              <PairBars
                rows={LOCATIONS.map((l) => ({ id: l.id, name: CLIMATE_SITES[l.id].site, a: CLIMATE_SITES[l.id].hotDays[0], b: CLIMATE_SITES[l.id].hotDays[1] }))}
                labels={['Now', `${TARGET_YEAR} projection`]}
                format={(v) => `${v} days`}
                selected={location}
                onSelect={setLocation}
              />
            ),
          },
          {
            title: 'Emissions Exposed to Carbon Pricing',
            body: (
              <>
                <InitiativeChips initiatives={summary} selected={initiatives} relevant={RELEVANT.carbon} />
                <PairBars
                  rows={exposure.map((l) => ({ id: l.id, name: l.name, a: l.now, b: l.planned }))}
                  labels={[`Scope 1 & 2, ${year}`, `${TARGET_YEAR} with initiatives`]}
                  format={(v) => `${fmt.tonnes(v, true)} t`}
                  selected={location}
                  onSelect={setLocation}
                />
              </>
            ),
          },
        ],
      },
    };

    return <Report {...views[financeView]} />;
  };

  const views = { ghg: renderGhg, energy: renderEnergy, safety: renderSafety, finance: renderFinance };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Year" value={year} onChange={setYear} options={YEARS.map((y) => ({ value: y, label: String(y) }))} />
        <MonthSelect value={month} onChange={selectMonth} months={MONTH_LABELS} />
        <Segmented
          label="Location"
          value={location}
          onChange={setLocation}
          options={[{ value: 'all', label: 'All locations' }, ...LOCATIONS.map((l) => ({ value: l.id, label: l.name }))]}
        />
        {tab === 'finance' && (
          <Segmented
            label="Show"
            value={financeView}
            onChange={setFinanceView}
            options={[
              { value: 'financial', label: 'Financial Quantification' },
              { value: 'climate', label: 'Climate Risk' },
            ]}
          />
        )}
        {highlight && <FilterChip label={`Highlight: ${highlight}`} onClear={() => setHighlight(null)} />}
      </div>
      {views[tab]()}
    </>
  );
};

export default SustainabilityDashboard;
