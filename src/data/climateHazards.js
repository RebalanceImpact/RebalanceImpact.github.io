/**
 * Physical climate hazard model used to rate each site, now and by 2030.
 * Site exposure is sampled from continuous hazard fields at the site's
 * location, so the hazard table and the climate cards always agree.
 *
 * The fields are illustrative. They follow the broad patterns of South
 * Africa's climate (a hotter north and interior, a drier west, a wetter and
 * more flood-prone east coast, a hail-prone Highveld), but they are not model
 * data. To use real layers, replace `hazardAt` with a lookup into gridded
 * climate data (e.g. CMIP6 / CORDEX-Africa indices) at the site coordinates.
 */

// South African coastline (lon, lat), from Kosi Bay round to the Orange River mouth.
const COAST = [
  [32.9, -26.85], [32.6, -27.9], [32.3, -28.7], [31.9, -28.9], [31.0, -29.8], [30.4, -30.8], [29.9, -31.4],
  [29.1, -32.1], [28.4, -32.6], [27.9, -33.05], [27.0, -33.6], [26.5, -33.75], [25.7, -34.0], [24.83, -34.2],
  [24.0, -34.05], [23.4, -34.1], [22.6, -34.0], [22.1, -34.2], [21.2, -34.4], [20.0, -34.83], [19.35, -34.6],
  [18.8, -34.1], [18.47, -34.36], [18.4, -33.9], [18.15, -33.3], [17.9, -32.8], [18.3, -32.2], [17.8, -31.3],
  [17.3, -30.4], [16.9, -29.3], [16.45, -28.63],
];
const COS = Math.cos((29 * Math.PI) / 180);

// Distance to the coast in degrees (longitude scaled for latitude).
const coastDistance = (lon, lat) => {
  let best = Infinity;
  for (let i = 0; i < COAST.length - 1; i += 1) {
    const [ax, ay] = COAST[i];
    const [bx, by] = COAST[i + 1];
    const dx = (bx - ax) * COS;
    const dy = by - ay;
    const px = (lon - ax) * COS;
    const py = lat - ay;
    const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy || 1)));
    best = Math.min(best, Math.hypot(px - t * dx, py - t * dy));
  }
  return best;
};

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const bump = (lon, lat, cx, cy, s) => Math.exp(-(((lon - cx) * COS) ** 2 + (lat - cy) ** 2) / (2 * s * s));

// Hazard fields. Index hazards run 0-1; heat is days above 30°C a year.
const FIELDS = {
  heat: (p, future) => {
    const north = (p.lat + 35) / 13;
    const interior = clamp01(p.coast / 3);
    const plateau = bump(p.lon, p.lat, 28.3, -27, 1.6);
    const mountains = bump(p.lon, p.lat, 28.8, -29.6, 0.9);
    const days = Math.max(2, 5 + 70 * (0.55 * north + 0.45 * interior) - 42 * plateau - 30 * mountains);
    return future ? days * 1.15 + 3 * interior + 2 : days;
  },
  drought: (p, future) => {
    const east = (p.lon - 16.5) / 16.5;
    const winterRain = bump(p.lon, p.lat, 19, -33.6, 1.4);
    const karoo = bump(p.lon, p.lat, 24.5, -32.6, 1.6);
    const v = 0.22 + 0.58 * (1 - east) + 0.25 * winterRain + 0.18 * karoo - 0.15 * clamp01(1 - p.coast) * east;
    return clamp01(v + (future ? 0.06 + 0.05 * (1 - east) : 0));
  },
  water: (p, future) => {
    const metros = 0.15 * bump(p.lon, p.lat, 28.1, -26.2, 0.6) + 0.15 * bump(p.lon, p.lat, 18.6, -33.9, 0.5) + 0.15 * bump(p.lon, p.lat, 25.6, -33.9, 0.5);
    return clamp01(0.7 * FIELDS.drought(p, future) + metros);
  },
  flood: (p, future) => {
    const east = (p.lon - 16.5) / 16.5;
    const coastal = Math.exp(-p.coast / 1.2);
    const v = 0.12 + 0.62 * east * coastal + 0.2 * bump(p.lon, p.lat, 26.2, -33.4, 0.8) + 0.18 * bump(p.lon, p.lat, 28.1, -26.2, 0.5);
    return clamp01(v + (future ? 0.05 * coastal : 0));
  },
  storm: (p, future) => {
    const east = (p.lon - 16.5) / 16.5;
    const coastal = Math.exp(-p.coast / 1.2);
    const v = 0.12 + 0.75 * bump(p.lon, p.lat, 28.6, -26.8, 2.2) + 0.15 * east + 0.25 * coastal * east + 0.22 * bump(p.lon, p.lat, 18.6, -34, 0.9);
    return clamp01(v + (future ? 0.04 : 0));
  },
};

export const HAZARD_TYPES = [
  { id: 'drought', name: 'Drought' },
  { id: 'water', name: 'Water stress' },
  { id: 'heat', name: 'Extreme heat' },
  { id: 'flood', name: 'Flooding' },
  { id: 'storm', name: 'Hail & storms' },
];

// Rating bands (1 = low to 4 = very high).
const BANDS = { heat: [15, 30, 50], index: [0.3, 0.5, 0.7] };
export const rate = (hazard, value) => 1 + (BANDS[hazard] || BANDS.index).filter((t) => value >= t).length;

/** Hazard value at a point. `period` is 'now' or 2030. */
export const hazardAt = (hazard, lon, lat, period = 'now') =>
  FIELDS[hazard]({ lon, lat, coast: coastDistance(lon, lat) }, period !== 'now');
