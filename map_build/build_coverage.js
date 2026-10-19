'use strict';
/**
 * Build `src/data/coverage-territories.ts` — the country outlines for
 * the Coverage section's basemap.
 *
 * Source geometry: Natural Earth 110m admin-0 countries (public domain,
 * downloaded once to `ne_110m_countries.geojson`). NOTHING here is
 * hand-drawn or approximated: every coordinate is projected from real
 * data into the pixel space of the hillshade basemap.
 *
 * ── Alignment ──
 * The projection is the SAME Web-Mercator maths as `build_map.js`, and
 * the image corners are the ones recorded in `map_manifest.json`
 * (tile-grid aligned, city-verified to 0.0 m). So a point projected by
 * this script lands on the same pixel it does in the basemap image:
 * the outlines and the terrain are one georeferenced space.
 *
 * ── What it emits ───
 * For each country: the SVG path in map pixel space (viewBox 5000×6111,
 * the desktop render; the mobile render is the identical space), a
 * label anchor at the largest ring's area centroid, and a bbox for
 * sanity checks.
 */

const fs = require('fs');
const path = require('path');

/* The projection (pixel space, Mercator maths, image corners) lives in
   `./projection.js` — the ONE implementation, shared with
   `build_corridors.js` so every build projects into the same space. */
const { OUT_W, OUT_H, project, round } = require('./projection');

/* ─── Countries the Coverage section owns ───
   `rail: true` = appears in the country rail (the 8 approved concept
   countries). `rail: false` = context, drawn and quiet. */
const WANTED = [
  { iso: 'ZAF', name: 'South Africa', rail: true },
  { iso: 'BWA', name: 'Botswana',    rail: true },
  { iso: 'ZWE', name: 'Zimbabwe',    rail: true },
  { iso: 'ZMB', name: 'Zambia',      rail: true },
  { iso: 'COD', name: 'DR Congo',    rail: true },
  { iso: 'MWI', name: 'Malawi',      rail: true },
  { iso: 'TZA', name: 'Tanzania',    rail: true },
  { iso: 'MOZ', name: 'Mozambique',  rail: true },
  { iso: 'NAM', name: 'Namibia',     rail: false },
  { iso: 'AGO', name: 'Angola',      rail: false },
  { iso: 'LSO', name: 'Lesotho',     rail: false },
  { iso: 'SWZ', name: 'Eswatini',    rail: false },
];

const geojson = JSON.parse(fs.readFileSync(
  path.join(__dirname, 'ne_110m_countries.geojson'), 'utf8'));

/* ─── Geometry helpers ─── */

/** Ring → SVG path in pixel space. Multi-polygons concatenate with the
    default nonzero fill rule (same convention as loads/CorridorMap). */
function polygonToPath(polygons) {
  let d = '';
  for (const ring of polygons) {
    d += 'M';
    for (const point of ring) {
      const [x, y] = project(point);
      d += `${round(x)} ${round(y)}L`;
    }
    d = d.slice(0, -1) + 'Z';
  }
  return d;
}

/* `round` (half-pixel precision) also comes from ./projection.js, so
   every emitted file rounds the same way. */

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

  // Flatten to rings; remember each ring so the largest (the mainland
  // mass for multipart countries like Mozambique) anchors the label.
  const rings = polygons.flat();
  let largest = null, largestArea = -1;
  for (const ring of rings) {
    const a = ringArea(ring);
    if (a > largestArea) { largestArea = a; largest = ring; }
  }

  const pathD = rings.map(ring => ringToPath(ring)).join(' ');
  const label = visibleLabelAnchor(largest, rings.map(ringToPath).join(' '));
  const bbox = bboxOf(pathD);

  territories.push({
    id: want.iso,
    name: want.name,
    rail: want.rail,
    d: pathD,
    label: { x: round(label.x), y: round(label.y) },
    bbox,
  });
  console.log(
    want.iso.padEnd(4),
    'rings', String(rings.length).padStart(2),
    'bbox x', bbox.x0, '..', bbox.x1, ' y', bbox.y0, '..', bbox.y1,
    'label', label.x.toFixed(0), label.y.toFixed(0),
    want.rail ? '(rail)' : '(context)');
}

/** Label anchor: the largest ring's area centroid, unless that sits
    outside the basemap frame (DRC and Tanzania reach north of the
    image's top edge) — then the centre of the country's VISIBLE part,
    so every label lands on screen even when the country is cropped. */
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
 * Coverage territory outlines — GENERATED, do not hand-edit.
 *
 * Source: Natural Earth 110m admin-0 countries (public domain), pro-
 * jected by \`map_build/build_coverage.js\` into the pixel space of the
 * hillshade basemap (\`public/southern-africa-hillshade-*.webp\`), whose
 * corners are recorded in \`map_build/map_manifest.json\` (Web Mercator,
 * city-verified). Every coordinate is projected data, not drawing.
 *
 * The viewBox is 5000×6111 — the desktop render's pixel space. The
 * mobile render is the same space, so one file serves both.
 */

/** Map pixel space of the basemap (the desktop webp's dimensions). */
export const MAP_SPACE = { w: ${OUT_W}, h: ${OUT_H} } as const;

export type TerritoryId =
${territories.map(t => `  | "${t.id}"`).join('\n')};

export type Territory = {
  id: TerritoryId;
  /** Display name in the rail. */
  name: string;
  /** \`true\` = one of the Coverage rail's countries; \`false\` = context, drawn quiet. */
  rail: boolean;
  /** SVG path in MAP_SPACE pixels. Multi-ring, nonzero fill rule. */
  d: string;
  /** Label anchor (area centroid of the largest ring), in MAP_SPACE px. */
  label: { x: number; y: number };
  bbox: { x0: number; x1: number; y0: number; y1: number };
};

export const TERRITORIES: Territory[] = [
${territories.map(t => `  {
    id: "${t.id}",
    name: "${t.name}",
    rail: ${t.rail},
    d: "${t.d}",
    label: { x: ${t.label.x}, y: ${t.label.y} },
    bbox: { x0: ${t.bbox.x0}, x1: ${t.bbox.x1}, y0: ${t.bbox.y0}, y1: ${t.bbox.y1} },
  },`).join('\n')}
];
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'coverage-territories.ts'), header);
console.log('\\nwrote src/data/coverage-territories.ts');
