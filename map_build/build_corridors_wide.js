'use strict';
/**
 * Build `src/data/coverage-corridors-wide.ts` — corridor route geometry
 * for the WIDE basemap. NEW file; mirrors `build_corridors.js` logic.
 *
 * Source: `corridors-input-wide.json` (= `corridors-input.json` plus the
 * Durban port and a ["dbn","jhb"] feeder on every corridor). NOTHING is
 * hand-drawn: every place's lat/lon is projected through
 * `./projection_wide.js` — the SAME Web-Mercator maths and frame
 * (W5/E44/N-8/S-32) that `build_map_wide.js` renders — into the wide
 * basemap's pixel space (viewBox 6000×3966).
 *
 * ── What it emits ───
 *   PLACES     id → { name, type, x, y }
 *   CORRIDORS  id → { name, main (place ids), feeders (place id lists),
 *                     d (straight-segment SVG path of the main route),
 *                     feederD (one straight-segment path per feeder) }
 */

const fs = require('fs');
const path = require('path');
const { OUT_W, OUT_H, project, round } = require('./projection_wide');

const HERE = __dirname;

const input = JSON.parse(fs.readFileSync(
  path.join(HERE, 'corridors-input-wide.json'), 'utf8'));

/* ─── Project the places ─── */

const places = {};
for (const [id, place] of Object.entries(input.places)) {
  const [x, y] = project([place.lon, place.lat]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    console.error('BAD coordinate for place', id, place);
    process.exit(1);
  }
  places[id] = {
    name: place.name,
    type: place.type,
    x: round(x),
    y: round(y),
  };
  const inFrame = x >= 0 && x <= OUT_W && y >= 0 && y <= OUT_H;
  console.log(
    id.padEnd(12),
    `x ${x.toFixed(1).padStart(7)}  y ${y.toFixed(1).padStart(7)}` +
    `  (${(x / OUT_W * 100).toFixed(2)}%, ${(y / OUT_H * 100).toFixed(2)}%)`,
    inFrame ? '(in frame)' : '<-- OUTSIDE WIDE FRAME');
}

/* ─── Validate the corridor references ─── */

for (const [id, corridor] of Object.entries(input.corridors)) {
  const refs = [...corridor.main, ...corridor.feeders.flat()];
  for (const ref of refs) {
    if (!places[ref]) {
      console.error(`UNKNOWN place "${ref}" referenced by corridor ${id}`);
      process.exit(1);
    }
  }
}

/* ─── Straight-segment SVG paths in map pixel space ─── */

function routeD(ids) {
  if (!ids.length) return '';
  const pts = ids.map(id => `${places[id].x} ${places[id].y}`);
  return `M ${pts.join(' L ')}`;
}

const corridors = Object.entries(input.corridors).map(([id, c]) => ({
  id,
  name: c.name,
  main: c.main,
  feeders: c.feeders,
  d: routeD(c.main),
  feederD: c.feeders.map(routeD),
}));

for (const c of corridors) {
  console.log(
    `corridor ${c.id}  ${c.name.padEnd(14)}`,
    `main ${c.main.length} stops, ${c.feeders.length} feeder(s)  ` +
    `d: ${c.d.slice(0, 60)}${c.d.length > 60 ? '…' : ''}`);
}

/* ─── Verify the projection against the wide manifest's control points ── */

const manifest = JSON.parse(fs.readFileSync(
  path.join(HERE, 'map_manifest_wide.json'), 'utf8'));

console.log('\nwide manifest verification (each place\'s own coordinates):');
let ok = 0;
for (const row of manifest.verification_6000px) {
  const [x, y] = project([row.lon, row.lat]);
  const err = Math.hypot(x - row.x_px, y - row.y_px);
  if (err < 0.06) ok++;
  console.log(
    `  ${row.place.padEnd(13)} projected (${x.toFixed(2)}, ${y.toFixed(2)})`,
    `manifest (${row.x_px}, ${row.y_px})  err ${err.toFixed(3)} px`);
}
console.log(`  ${ok}/${manifest.verification_6000px.length} control points match (<0.06 px)`);

/* ─── The requested place check list vs the manifest ─── */

const CHECK = ['jhb', 'dbn', 'gbe', 'wdh', 'lun', 'beitbridge', 'lub'];
console.log('\nrequested places, projected px + % of frame:');
for (const id of CHECK) {
  const src = input.places[id];
  const p = places[id];
  const [fx, fy] = project([src.lon, src.lat]);
  const m = manifest.verification_6000px.find(r =>
    r.lon === src.lon && r.lat === src.lat);
  const err = m ? Math.hypot(fx - m.x_px, fy - m.y_px).toFixed(3) : 'n/a';
  console.log(
    `  ${id.padEnd(12)} x ${fx.toFixed(1)}  y ${fy.toFixed(1)}` +
    `  (${(fx / OUT_W * 100).toFixed(2)}%, ${(fy / OUT_H * 100).toFixed(2)}%)` +
    `  rounded (${p.x}, ${p.y})  manifest err ${err} px`);
}

/* ─── Emit ─── */

const header = `/**
 * Wide-frame corridor geometry — GENERATED, do not hand-edit.
 *
 * Source: \`map_build/corridors-input-wide.json\` (places and corridors,
 * Durban port included), projected by
 * \`map_build/build_corridors_wide.js\` through
 * \`map_build/projection_wide.js\` — the SAME Web-Mercator maths and
 * frame (map_manifest_wide.json, W5/E44/N-8/S-32) that
 * \`build_coverage_wide.js\` uses — into the pixel space of the wide
 * hillshade basemap. Every coordinate is projected data, not drawing.
 *
 * The viewBox is 6000×3966 — the wide desktop render's pixel space,
 * shared with \`coverage-territories-wide.ts\`.
 */

export type PlaceType = "hub" | "city" | "border" | "port";

export type Place = {
  /** Display name. */
  name: string;
  /** \`hub\` = HQ, \`city\` = waypoint, \`border\` = border post, \`port\` = seaport. */
  type: PlaceType;
  /** Projected x in MAP_SPACE pixels. */
  x: number;
  /** Projected y in MAP_SPACE pixels. */
  y: number;
};

/** Every place, by id, projected into the wide basemap's pixel space. */
export const PLACES: Record<string, Place> = {
${Object.entries(places).map(([id, p]) =>
  `  ${JSON.stringify(id)}: { name: ${JSON.stringify(p.name)}, type: ${JSON.stringify(p.type)}, x: ${p.x}, y: ${p.y} },`
).join('\n')}
};

export type Corridor = {
  /** Corridor name. */
  name: string;
  /** The main route: place ids, in order. */
  main: string[];
  /** Feeder routes: each a list of place ids, in order. */
  feeders: string[][];
  /** Straight-segment SVG path of the main route ("M x y L x y …"). */
  d: string;
  /** One straight-segment SVG path per feeder route, in feeder order. */
  feederD: string[];
};

/** The four corridors, by id, with their projected SVG paths. */
export const CORRIDORS: Record<string, Corridor> = {
${corridors.map(c => `  ${JSON.stringify(c.id)}: {
    name: ${JSON.stringify(c.name)},
    main: [${c.main.map(id => JSON.stringify(id)).join(', ')}],
    feeders: [
${c.feeders.map(f => `      [${f.map(id => JSON.stringify(id)).join(', ')}],`).join('\n')}
    ],
    d: ${JSON.stringify(c.d)},
    feederD: [${c.feederD.map(d => JSON.stringify(d)).join(', ')}],
  },`).join('\n')}
};
`;

fs.writeFileSync(path.join(HERE, '..', 'src', 'data', 'coverage-corridors-wide.ts'), header);

const placeCount = Object.keys(places).length;
console.log(
  `\nwrote src/data/coverage-corridors-wide.ts — ` +
  `${placeCount} places, ${corridors.length} corridors ` +
  `(all inside the ${OUT_W}x${OUT_H} frame: ` +
  `${Object.values(places).every(p => p.x >= 0 && p.x <= OUT_W && p.y >= 0 && p.y <= OUT_H)})`);
