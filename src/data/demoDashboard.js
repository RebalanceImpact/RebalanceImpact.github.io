/**
 * Demo dataset + model for the interactive dashboard on /data-kpis/.
 *
 * `records` holds one row per location per month (2023 base year to 2025),
 * the shape a centralised data model has once fuel cards, utility bills,
 * procurement, HR and the ledger are joined. Every figure in the dashboard is
 * computed from these rows, so the tabs always agree: Scope 2 comes from the
 * same kWh as the energy tab, carbon tax from the same Scope 1 tonnes.
 *
 * To run the dashboard on real data, replace `records` with rows in the same
 * shape. The business is fictional.
 */

import { HAZARD_TYPES, hazardAt, rate } from './climateHazards';

export { HAZARD_TYPES };

export const LOCATIONS = [
  { id: 'wc', name: 'Western Cape' },
  { id: 'ec', name: 'Eastern Cape' },
  { id: 'gp', name: 'Gauteng' },
];

export const BASE_YEAR = 2023;
export const YEARS = [2024, 2025];
export const TARGET_YEAR = 2030;
export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Site palette only. Slot order is fixed: first series, second, third, prior year.
export const COLORS = {
  first: '#334C33',
  second: '#A9C2A6',
  third: '#B07D55',
  prior: '#D4C5A9',
};

// Hazard ratings, one hue light to dark: low to very high.
export const RATING_COLORS = ['#E3D3BF', '#CFA77F', '#B07D55', '#7A5232'];

// Time horizons for climate-related risks, one hue dark to light: nearest first.
export const HORIZONS = {
  short: { name: 'Short term', span: 'to 2027', color: '#334C33', dark: true },
  medium: { name: 'Medium term', span: '2028 to 2030', color: '#8BA888' },
  long: { name: 'Long term', span: 'beyond 2030', color: '#D3DFD0' },
};

// Seeded PRNG so every visitor (and the prerender) sees identical numbers.
export const mulberry32 = (seed) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rand = mulberry32(20251231);
const jitter = (pct) => 1 + (rand() * 2 - 1) * pct;
const poisson = (mean) => {
  const limit = Math.exp(-mean);
  let k = 0;
  let p = 1;
  do {
    k += 1;
    p *= rand();
  } while (p > limit);
  return k - 1;
};

const EF = {
  diesel: 0.00268, // tCO2e per litre
  grid: 0.00095, // tCO2e per kWh, South African grid (approx.)
};
const GENERATOR_KWH_PER_L = 3.4;

const PROFILE = {
  wc: { revenue: 10.5e6, fleet: 29000, generator: 3800, grid: 56000, water: 1450, staff: 210, solarFrom: [2025, 7], solarKwh: 17000 },
  ec: { revenue: 7.2e6, fleet: 22000, generator: 3200, grid: 36000, water: 950, staff: 140, solarFrom: null, solarKwh: 0 },
  gp: { revenue: 16e6, fleet: 39000, generator: 5200, grid: 61000, water: 1850, staff: 300, solarFrom: null, solarKwh: 0 },
};

// Generator use tracks load-shedding, which eased sharply from 2024.
const LOAD_SHEDDING = { 2023: 1, 2024: 0.32, 2025: 0.18 };
// Incidents per million hours worked, by type.
const INCIDENT_RATES = {
  2023: { mtc: 15.5, lti: 3.6, serious: 3.0 },
  2024: { mtc: 12.5, lti: 3.0, serious: 2.5 },
  2025: { mtc: 9.0, lti: 2.2, serious: 1.9 },
};

export const PRICES = {
  electricity: { 2023: 2.05, 2024: 2.3, 2025: 2.6 }, // R per kWh
  diesel: { 2023: 23.4, 2024: 22.6, 2025: 21.9 }, // R per litre
  water: { 2023: 38, 2024: 42, 2025: 46 }, // R per kL
  carbonTax: { 2023: 159, 2024: 190, 2025: 236 }, // R per tCO2e
};
// Share of Scope 1 emissions that is taxable after allowances (simplified).
const TAXABLE_SHARE = 0.4;

export const records = [BASE_YEAR, ...YEARS].flatMap((year) =>
  MONTH_LABELS.flatMap((_, m) =>
    LOCATIONS.map(({ id }) => {
      const p = PROFILE[id];
      const t = year - BASE_YEAR + m / 12;
      const season = 1 + 0.07 * Math.cos((2 * Math.PI * (m - 6)) / 12); // winter peak
      const solarOn = p.solarFrom && (year > p.solarFrom[0] || (year === p.solarFrom[0] && m + 1 >= p.solarFrom[1]));
      const solar = solarOn ? p.solarKwh * (1 + 0.25 * Math.cos((2 * Math.PI * m) / 12)) * jitter(0.06) : 0;
      const demand = p.grid * season * (1 - 0.025 * t) * jitter(0.03);
      const generator = p.generator * LOAD_SHEDDING[year] * season * jitter(0.15);
      const revenue = p.revenue * (1 + 0.045 * t) * (1 + 0.05 * Math.sin((2 * Math.PI * (m + 1)) / 12)) * jitter(0.03);
      const hoursWorked = (p.staff + Math.floor(t * 4)) * 176 * jitter(0.02);
      const rates = INCIDENT_RATES[year];
      const perHour = hoursWorked / 1e6;

      return {
        year,
        month: m,
        location: id,
        revenue,
        fleetL: p.fleet * (1 - 0.035 * t) * jitter(0.05),
        generatorL: generator,
        gridKwh: Math.max(0, demand - solar),
        solarKwh: solar,
        generatorKwh: generator * GENERATOR_KWH_PER_L,
        waterKl: p.water * (1 + 0.1 * Math.cos((2 * Math.PI * m) / 12)) * (1 - 0.02 * t) * jitter(0.05),
        scope3: revenue * 1.85e-5 * (1 - 0.06 * t) * jitter(0.04),
        hoursWorked,
        mtc: poisson(rates.mtc * perHour),
        lti: poisson(rates.lti * perHour),
        serious: poisson(rates.serious * perHour),
      };
    })
  )
);

// ---------------------------------------------------------------------------
// Selection helpers
// ---------------------------------------------------------------------------

// `month` is 'all' for the full year, or 0-11.
export const select = (year, location, month = 'all') =>
  records.filter(
    (r) => r.year === year && (location === 'all' || r.location === location) && (month === 'all' || r.month === month)
  );

export const sum = (rows, fn) => rows.reduce((t, r) => t + (typeof fn === 'function' ? fn(r) : r[fn]), 0);
export const monthly = (rows, fn) => MONTH_LABELS.map((_, m) => sum(rows.filter((r) => r.month === m), fn));
export const byLocation = (rows, fn) => LOCATIONS.map((l) => sum(rows.filter((r) => r.location === l.id), fn));

export const scope1 = (r) => (r.fleetL + r.generatorL) * EF.diesel;
export const scope2 = (r) => r.gridKwh * EF.grid;
export const scope3 = (r) => r.scope3;
export const totalEmissions = (r) => scope1(r) + scope2(r) + scope3(r);
export const recordables = (r) => r.mtc + r.lti + r.serious;
export const perMillionHours = (rows, fn) => {
  const hours = sum(rows, 'hoursWorked');
  return hours ? (sum(rows, fn) / hours) * 1e6 : 0;
};

export const costs = {
  electricity: (r) => r.gridKwh * PRICES.electricity[r.year],
  fuel: (r) => (r.fleetL + r.generatorL) * PRICES.diesel[r.year],
  water: (r) => r.waterKl * PRICES.water[r.year],
  carbonTax: (r) => scope1(r) * TAXABLE_SHARE * PRICES.carbonTax[r.year],
};

// ---------------------------------------------------------------------------
// Targets, initiatives and climate scenarios
// ---------------------------------------------------------------------------

export const TARGETS = {
  emissionsCut: 0.25, // 2030 total emissions vs base year
  gridCut: 0.3, // 2030 grid electricity vs base year
  trifr: 15, // recordable incidents per million hours
};

// Planned initiatives. Effects are annual, at full run-rate, as a share of the
// selected year's volumes at the locations they apply to. Capex (R) is the
// up-front cost used for simple payback.
export const INITIATIVES = [
  { id: 'solar', name: 'Rooftop solar PV', where: 'Gauteng', locations: ['gp'], gridCut: 0.38, capex: 6.8e6 },
  { id: 'fleet', name: 'Fleet efficiency programme', where: 'All locations', locations: ['wc', 'ec', 'gp'], fleetCut: 0.18, capex: 14e6 },
  { id: 'suppliers', name: 'Supplier engagement', where: 'Key suppliers', locations: ['wc', 'ec', 'gp'], scope3Cut: 0.08, capex: 0.6e6 },
  { id: 'water', name: 'Water recycling', where: 'Western Cape', locations: ['wc'], waterCut: 0.35, droughtCut: 0.5, capex: 5.2e6 },
];

// One central pathway for the outlook (illustrative). Carbon price in R per
// tCO2e; growth rates are per year.
export const OUTLOOK = { carbonPrice2030: 540, tariffGrowth: 0.09, fuelGrowth: 0.04, physicalGrowth: 0.1 };

// Physical climate exposure per site, sampled from the hazard model (see
// climateHazards.js) at each site's location: ratings 1 (low) to 4 (very
// high) now and by 2030, and days above 30°C a year.
export const RISK_LEVELS = ['Low', 'Medium', 'High', 'Very high'];
const SITE_POINTS = {
  wc: { site: 'Cape Town', lon: 18.42, lat: -33.92 },
  ec: { site: 'Gqeberha', lon: 25.6, lat: -33.96 },
  gp: { site: 'Johannesburg', lon: 28.05, lat: -26.2 },
};
const ratingsAt = (s, period) =>
  Object.fromEntries(HAZARD_TYPES.map((h) => [h.id, rate(h.id, hazardAt(h.id, s.lon, s.lat, period))]));
export const CLIMATE_SITES = Object.fromEntries(
  Object.entries(SITE_POINTS).map(([id, s]) => [
    id,
    {
      ...s,
      ratings: { now: ratingsAt(s, 'now'), 2030: ratingsAt(s, 2030) },
      hotDays: [Math.round(hazardAt('heat', s.lon, s.lat, 'now')), Math.round(hazardAt('heat', s.lon, s.lat, 2030))],
    },
  ])
);
export const siteRating = (id, hazard = 'overall', period = 2030) => {
  const r = CLIMATE_SITES[id].ratings[period];
  return hazard === 'overall' ? Math.max(...Object.values(r)) : r[hazard];
};

// Expected annual losses from physical hazards in the base year (R).
const HAZARDS = {
  drought: { location: 'wc', loss: 1.1e6 },
  flood: { location: 'ec', loss: 0.75e6 },
};

// Business as usual: half of the latest year-on-year trend carries forward.
const growth = (current, prior) => (prior ? current / prior - 1 : 0);
const yearsTo2030 = (year) => TARGET_YEAR - year;

const activeInitiatives = (ids, location) =>
  INITIATIVES.filter((i) => ids.includes(i.id) && (location === 'all' || i.locations.includes(location)));

const initiativeVolumes = (rows, initiative) => {
  const scoped = rows.filter((r) => initiative.locations.includes(r.location));
  return {
    gridKwh: sum(scoped, 'gridKwh') * (initiative.gridCut || 0),
    fleetL: sum(scoped, 'fleetL') * (initiative.fleetCut || 0),
    waterKl: sum(scoped, 'waterKl') * (initiative.waterCut || 0),
    scope3: sum(scoped, 'scope3') * (initiative.scope3Cut || 0),
    droughtCut: initiative.droughtCut || 0,
  };
};

const initiativeEffects = (rows, ids, location) =>
  activeInitiatives(ids, location).reduce(
    (acc, i) => {
      const v = initiativeVolumes(rows, i);
      return {
        gridKwh: acc.gridKwh + v.gridKwh,
        fleetL: acc.fleetL + v.fleetL,
        waterKl: acc.waterKl + v.waterKl,
        scope3: acc.scope3 + v.scope3,
        droughtCut: Math.max(acc.droughtCut, v.droughtCut),
      };
    },
    { gridKwh: 0, fleetL: 0, waterKl: 0, scope3: 0, droughtCut: 0 }
  );

/**
 * Actuals to the selected year, then a yearly forecast to 2030 with and
 * without initiatives (which ramp in over two years), and a straight-line
 * pathway from the base year to the target. The 2030 point is the headline
 * forecast shown on the cards.
 */
const outlook = (valueOf, cutOf, targetCut, year, location, initiativeIds) => {
  const current = valueOf(select(year, location));
  const prior = valueOf(select(year - 1, location));
  const base = valueOf(select(BASE_YEAR, location));
  const cut = cutOf(initiativeEffects(select(year, location), initiativeIds, location));
  const g = growth(current, prior) / 2;
  const target = base * (1 - targetCut);
  const span = TARGET_YEAR - BASE_YEAR;

  const path = Array.from({ length: span + 1 }, (_, i) => {
    const y = BASE_YEAR + i;
    const k = y - year;
    const bau = current * (1 + g) ** k;
    return {
      year: y,
      actual: k <= 0 ? valueOf(select(y, location)) : null,
      bau: k >= 0 ? bau : null,
      planned: k >= 0 ? Math.max(0, bau - cut * Math.min(1, k / 2)) : null,
      target: base + ((target - base) * i) / span,
    };
  });

  const projected = path[path.length - 1].planned;
  return { current, prior, base, projected, target, onTrack: projected <= target, path };
};

export const emissionsOutlook = (year, location, initiativeIds) => ({
  ...outlook(
    (rows) => sum(rows, totalEmissions),
    (e) => e.gridKwh * EF.grid + e.fleetL * EF.diesel + e.scope3,
    TARGETS.emissionsCut,
    year,
    location,
    initiativeIds
  ),
  initiatives: activeInitiatives(initiativeIds, location).filter((i) => !i.waterCut).length,
});

export const gridOutlook = (year, location, initiativeIds) => ({
  ...outlook((rows) => sum(rows, 'gridKwh'), (e) => e.gridKwh, TARGETS.gridCut, year, location, initiativeIds),
  initiatives: activeInitiatives(initiativeIds, location).filter((i) => i.gridCut).length,
});

/**
 * Climate-related costs by year: actuals from the base year to the selected
 * year, then a forecast to 2030 with and without the selected initiatives
 * (which ramp in over two years). Each row of the risk table is one cost
 * component, so the table and the chart always add up. `parts` splits each
 * year into those components: actuals, then the forecast with initiatives;
 * `bauParts` splits the no-further-action forecast the same way.
 */
export const climateOutlook = (year, location, initiativeIds) => {
  const rows = select(year, location);
  const priorRows = select(year - 1, location);
  const effects = initiativeEffects(rows, initiativeIds, location);
  const trend = (field) => growth(sum(rows, field), sum(priorRows, field)) / 2;
  const span = yearsTo2030(year);
  const inScope = (hazard) => location === 'all' || HAZARDS[hazard].location === location;
  const wcWater = (r) => (r.location === 'wc' ? r.waterKl : 0);

  // Water-stressed site: water bills rise with restrictions, plus expected drought losses.
  const actual = (y) => {
    const r = select(y, location);
    return {
      carbon: sum(r, costs.carbonTax),
      electricity: sum(r, costs.electricity),
      fuel: sum(r, costs.fuel),
      drought: inScope('drought') ? HAZARDS.drought.loss + sum(r, wcWater) * PRICES.water[y] : 0,
      flood: inScope('flood') ? HAZARDS.flood.loss : 0,
    };
  };

  const project = (k, withInitiatives) => {
    const ramp = withInitiatives ? Math.min(1, k / 2) : 0;
    const gridKwh = sum(rows, 'gridKwh') * (1 + trend('gridKwh')) ** k - effects.gridKwh * ramp;
    const fuelL = sum(rows, 'fleetL') * (1 + trend('fleetL')) ** k - effects.fleetL * ramp + sum(rows, 'generatorL');
    const wcWaterKl = sum(rows, wcWater) - effects.waterKl * ramp;
    const carbonPrice = PRICES.carbonTax[year] + ((OUTLOOK.carbonPrice2030 - PRICES.carbonTax[year]) * k) / span;
    const physical = (1 + OUTLOOK.physicalGrowth) ** k;
    return {
      carbon: fuelL * EF.diesel * TAXABLE_SHARE * carbonPrice,
      electricity: gridKwh * PRICES.electricity[year] * (1 + OUTLOOK.tariffGrowth) ** k,
      fuel: fuelL * PRICES.diesel[year] * (1 + OUTLOOK.fuelGrowth) ** k,
      drought: inScope('drought')
        ? HAZARDS.drought.loss * physical * (1 - effects.droughtCut * ramp) + wcWaterKl * PRICES.water[year] * 1.07 ** k
        : 0,
      flood: inScope('flood') ? HAZARDS.flood.loss * physical : 0,
    };
  };

  const total = (c) => Object.values(c).reduce((t, v) => t + v, 0);
  const now = project(0, true);
  const endBau = project(span, false);
  const endPlanned = project(span, true);

  const points = Array.from({ length: TARGET_YEAR - BASE_YEAR + 1 }, (_, i) => {
    const y = BASE_YEAR + i;
    const k = y - year;
    return {
      year: y,
      actual: k <= 0 ? total(actual(y)) : null,
      bau: k >= 0 ? total(project(k, false)) : null,
      planned: k >= 0 ? total(project(k, true)) : null,
      parts: k <= 0 ? actual(y) : project(k, true),
      bauParts: k >= 0 ? project(k, false) : null,
    };
  });

  const risks = [
    { id: 'carbon', name: 'Carbon tax increases', type: 'Transition · Policy', horizon: 'medium' },
    { id: 'electricity', name: 'Electricity tariff increases', type: 'Transition · Market', horizon: 'short' },
    { id: 'fuel', name: 'Fuel price and levy increases', type: 'Transition · Market', horizon: 'short' },
    { id: 'drought', name: 'Drought and water restrictions', type: 'Physical · Chronic', horizon: 'medium', hazard: 'drought' },
    { id: 'flood', name: 'Flood damage and downtime', type: 'Physical · Acute', horizon: 'long', hazard: 'flood' },
  ]
    .filter((r) => !r.hazard || inScope(r.hazard))
    .map((r) => {
      const bau = endBau[r.id];
      const planned = endPlanned[r.id];
      return { ...r, now: now[r.id], bau, planned, lower: bau ? (bau - planned) / bau : 0 };
    });

  const bau2030 = total(endBau);
  const total2030 = total(endPlanned);
  return {
    points,
    risks,
    total2030,
    bau2030,
    avoided2030: bau2030 - total2030,
    lower2030: bau2030 ? (bau2030 - total2030) / bau2030 : 0,
  };
};

/** Annual effect of each initiative by 2030 across all locations, with simple payback. */
export const initiativeSummary = (year) => {
  const rows = select(year, 'all');
  return INITIATIVES.map((i) => {
    const v = initiativeVolumes(rows, i);
    const saving = climateOutlook(year, 'all', [i.id]).avoided2030;
    return {
      ...i,
      tCO2e: v.gridKwh * EF.grid + v.fleetL * EF.diesel + v.scope3,
      waterKl: v.waterKl,
      saving,
      payback: saving > 0 ? i.capex / saving : null,
    };
  });
};

/** Emissions exposed to carbon pricing (Scope 1 and 2) per location, now and by 2030. */
export const carbonExposure = (year, initiativeIds) =>
  LOCATIONS.map((l) => {
    const rows = select(year, l.id);
    const e = initiativeEffects(rows, initiativeIds, l.id);
    const now = sum(rows, scope1) + sum(rows, scope2);
    return { ...l, scope1: sum(rows, scope1), scope2: sum(rows, scope2), now, planned: now - e.gridKwh * EF.grid - e.fleetL * EF.diesel };
  });

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export const fmt = {
  tonnes: (n, short = false) =>
    n >= 1000 ? `${(n / 1000).toFixed(short ? 1 : 2)}K` : Math.round(n).toLocaleString('en-GB'),
  rand: (n, short = false) => {
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    if (abs >= 999500) return `${sign}R${(abs / 1e6).toFixed(short || abs >= 1e7 ? 1 : 2)}m`;
    if (abs >= 1e3) return `${sign}R${Math.round(abs / 1e3).toLocaleString('en-GB')}k`;
    return `${sign}R${Math.round(abs)}`;
  },
  mwh: (kwh) => Math.round(kwh / 1000).toLocaleString('en-GB'),
  kl: (n, short = false) => (n >= 10000 || (short && n >= 1000) ? `${(n / 1000).toFixed(1)}K` : Math.round(n).toLocaleString('en-GB')),
  pct: (n, digits = 1) => `${n.toFixed(digits)}%`,
  movement: (n) => `${n > 0 ? '+' : ''}${n.toFixed(2)}`,
  rate: (n) => n.toFixed(2),
  count: (n) => Math.round(n).toLocaleString('en-GB'),
};
