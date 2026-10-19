'use strict';
/**
 * Build `src/data/coverage-territories-wide.ts` — country outlines for
 * the WIDE basemap. NEW file; mirrors `build_coverage.js` logic.
 *
 * Source geometry: Natural Earth 110m admin-0 countries (public domain,
 * `ne_110m_countries.geojson`). NOTHING is hand-drawn: every coordinate
 * is projected from real data through `./projection_wide.js` — the SAME
 * Web-Mercator maths and frame (W5/E44/N-8/S-32, viewBox 6000×3966)
 * that `build_map_wide.js` renders — into the wide basemap's pixel
 * space. Paths may run off the frame edge; they are never distorted.
 *
 * ── What it emits ───
 * For each SADC member in the frame: the SVG path in map pixel space,
 * a label anchor (labelX, labelY), sadc: true, and the operated flag
 * (true only for the six operated countries).
 */

const fs = require('fs');
const path = require('path');

/* The wide projection lives in `./projection_wide.js` — the ONE
   implementation, shared with `build_corridors_wide.js`. */
const { OUT_W, OUT_H, project, round } = require('./projection_wide');

/* ─── SADC members appearing in the wide frame ───
   `operated: true` = the six operated countries; `false` = context. */
const WANTED = [
  { iso: 'AGO', name: 'Angola',       operated: false },
  { iso: 'BWA', name: 'Botswana',     operated: true },
  { iso: 'COD', name: 'DRC',          operated: true },
  { iso: 'SWZ', name: 'Eswatini',     operated: false },
  { iso: 'LSO', name: 'Lesotho',      operated: false },
  { iso: 'MDG', name: 'Madagascar',   operated: false },
  { iso: 'MWI', name: 'Malawi',       operated: false },
  { iso: 'MOZ', name: 'Mozambique',   operated: false },
  { iso: 'NAM', name: 'Namibia',      operated: true },
  { iso: 'ZAF', name: 'South Africa', operated: true },
  { iso: 'TZA', name: 'Tanzania',     operated: false },
  { iso: 'ZMB', name: 'Zambia',       operated: true },
  { iso: 'ZWE', name: 'Zimbabwe',     operated: true },
];

const geojson = JSON.parse(fs.readFileSync(
  path.join(__dirname, 'ne_110m_countries.geojson'), 'utf8'));

/* ─── Geometry helpers (same as build_coverage.js) ─── */

/** Area centroid of a ring in pixel space (shoelace). */
function ringCentroid(ring) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = project(ring[i]);
    const [x2, y2] = project(ring[i + 1]);
    const cross = x1 * y2 - x2 * y1;
    a += cross;
    cx += (x1 + x2) * cross;
    cy += (y1 + y2) * cross;
  }
  a /= 2;
  if (Math.abs(a) < 1e-6) {
    const [x, y] = project(ring[0]);
    return { x, y };
  }
  return { x: cx / (6 * a), y: cy / (6 * a) };
}

function ringArea(ring) {
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = project(ring[i]);
    const [x2, y2] = project(ring[i + 1]);
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a / 2);
}

/* ─── Build ─── */

const territories = [];

for (const want of WANTED) {
  const feature = geojson.features.find(f => f.properties.ISO_A3 === want.iso);
  if (!feature) {
    console.error('MISSING country in Natural Earth data:', want.iso);
    process.exit(1);
  }

  const geometry = feature.geometry;
  const polygons = geometry.type === 'Polygon'
    ? [geometry.coordinates]
    : geometry.coordinates;

  // Flatten to rings; the largest (mainland mass for multipart
  // countries) anchors the label.
  const rings = polygons.flat();
  let largest = null, largestArea = -1;
  for (const ring of rings) {
    const a = ringArea(ring);
    if (a > largestArea) { largestArea = a; largest = ring; }
  }

  const pathD = rings.map(ring => ringToPath(ring)).join(' ');
  const label = visibleLabelAnchor(largest, pathD);
  const bbox = bboxOf(pathD);

  territories.push({
    id: want.iso,
    name: want.name,
    d: pathD,
    labelX: round(label.x),
    labelY: round(label.y),
    sadc: true,
    operated: want.operated,
    bbox,
  });
  console.log(
    want.iso.padEnd(4),
    'rings', String(rings.length).padStart(2),
    'bbox x', bbox.x0, '..', bbox.x1, ' y', bbox.y0, '..', bbox.y1,
    'label', label.x.toFixed(0), label.y.toFixed(0),
    want.operated ? '(operated)' : '(context)');
}

/** Label anchor: the largest ring's area centroid, unless that sits
    outside the wide frame (countries cropped by the frame edge) — then
    the centre of the country's VISIBLE part, so every label lands on
    screen. */
function visibleLabelAnchor(ring, pathD) {
  const centroid = ringCentroid(ring);
  const inFrame =
    centroid.x >= 0 && centroid.x <= OUT_W &&
    centroid.y >= 0 && centroid.y <= OUT_H;
  if (inFrame) return centroid;

  const b = bboxOf(pathD);
  const x0 = Math.max(b.x0, 0), x1 = Math.min(b.x1, OUT_W);
  const y0 = Math.max(b.y0, 0), y1 = Math.min(b.y1, OUT_H);
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
}

function ringToPath(ring) {
  let d = 'M';
  for (const point of ring) {
    const [x, y] = project(point);
    d += `${round(x)} ${round(y)}L`;
  }
  return d.slice(0, -1) + 'Z';
}

function bboxOf(d) {
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]);
    y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]);
  }
  return { x0, x1, y0, y1 };
}

/* ─── Emit ─── */

const header = `/**
 * Wide-frame territory outlines — GENERATED, do not hand-edit.
 *
 * Source: Natural Earth 110m admin-0 countries (public domain), pro-
 * jected by \`map_build/build_coverage_wide.js\` through
 * \`map_build/projection_wide.js\` into the pixel space of the wide
 * hillshade basemap (\`map_build/out/southern-africa-wide-hillshade-*.png\`),
 * whose frame is recorded in \`map_build/map_manifest_wide.json\` (Web
 * Mercator, W5/E44/N-8/S-32). Every coordinate is projected data, not
 * drawing. Paths may run off the frame edge; they are never distorted.
 *
 * The viewBox is 6000×3966 — the wide desktop render's pixel space,
 * shared with \`coverage-corridors-wide.ts\`.
 */

/** Map pixel space of the wide basemap (the wide render's dimensions). */
export const MAP_SPACE = { w: ${OUT_W}, h: ${OUT_H} } as const;

export type TerritoryId =
${territories.map(t => `  | "${t.id}"`).join('\n')};

export type Territory = {
  id: TerritoryId;
  /** Display name. */
  name: string;
  /** SVG path in MAP_SPACE pixels. Multi-ring, nonzero fill rule. */
  d: string;
  /** Label anchor x (area centroid of the largest ring), in MAP_SPACE px. */
  labelX: number;
  /** Label anchor y, in MAP_SPACE px. */
  labelY: number;
  /** \`true\` = SADC member. */
  sadc: boolean;
  /** \`true\` = operated country; \`false\` = context, drawn quiet. */
  operated: boolean;
};

export const TERRITORIES: Territory[] = [
${territories.map(t => `  {
    id: "${t.id}",
    name: "${t.name}",
    d: "${t.d}",
    labelX: ${t.labelX},
    labelY: ${t.labelY},
    sadc: ${t.sadc},
    operated: ${t.operated},
  },`).join('\n')}
];
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'coverage-territories-wide.ts'), header);
console.log('\nwrote src/data/coverage-territories-wide.ts —',
  territories.length, 'territories,',
  territories.filter(t => t.operated).length, 'operated');
