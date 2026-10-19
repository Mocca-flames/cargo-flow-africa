'use strict';
/**
 * Build `src/data/coverage-corridors.ts` — the corridor route geometry
 * for the Coverage section's basemap.
 *
 * Source: `corridors-input.json` (dispatch-approved places and
 * corridors). NOTHING is hand-drawn or estimated: every place's lat/lon
 * is projected through `./projection.js` — the SAME Web-Mercator maths
 * and the SAME map_manifest.json corners that `build_coverage.js`
 * uses — into the pixel space of the hillshade basemap (viewBox
 * 5000×6111). Every dot and every line therefore lands on its real
 * geography.
 *
 * ── What it emits ───
 *   PLACES     id → { name, type, x, y }
 *   CORRIDORS  id → { name, main (place ids), feeders (place id lists),
 *                     d (straight-segment SVG path of the main route),
 *                     feederD (one straight-segment path per feeder) }
 */

const fs = require('fs');
const path = require('path');
const { OUT_W, OUT_H, project, round } = require('./projection');

const HERE = __dirname;

const input = JSON.parse(fs.readFileSync(
  path.join(HERE, 'corridors-input.json'), 'utf8'));

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
    `x ${x.toFixed(1).padStart(7)}  y ${y.toFixed(1).padStart(7)}`,
    inFrame ? '(in frame)' : '<-- OUTSIDE BASEMAP FRAME');
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

/* ─── Verify the projection against the manifest's control points ───
   The manifest recorded city pixels with err 0.0 m. Reprojecting each
   city's OWN lon/lat must land back on the recorded px/py. */

const manifest = JSON.parse(fs.readFileSync(
  path.join(HERE, 'map_manifest.json'), 'utf8'));

console.log('\nmanifest verification (each city\'s own coordinates):');
let ok = 0;
for (const city of manifest.city_verification) {
  const [x, y] = project([city.lon, city.lat]);
  const err = Math.hypot(x - city.px, y - city.py);
  if (err < 0.051) ok++;
  console.log(
    `  ${city.city.padEnd(13)} projected (${x.toFixed(2)}, ${y.toFixed(2)})`,
    `manifest (${city.px}, ${city.py})  err ${err.toFixed(3)} px`);
}
console.log(`  ${ok}/${manifest.city_verification.length} control points match`);

/* ─── The requested hub/border check list vs the manifest ─── */

const CHECK = [
  ['jhb', 'Johannesburg'],
  ['gbe', 'Gaborone'],
  ['beitbridge', 'Beitbridge'],
  ['lun', 'Lusaka'],
  ['wdh', 'Windhoek'],
];
console.log('\nrequested places vs manifest control points:');
for (const [id, cityName] of CHECK) {
  const city = manifest.city_verification.find(c => c.city === cityName);
  const src = input.places[id];
  const p = places[id];
  const sameCoords = src.lon === city.lon && src.lat === city.lat;
  console.log(
    `  ${id.padEnd(12)} input (${src.lon}, ${src.lat})`,
    sameCoords ? '= manifest coords' : `!= manifest (${city.lon}, ${city.lat})`,
    `-> pixel (${p.x}, ${p.y})  [manifest ${city.px}, ${city.py}]`);
}

/* ─── Emit ─── */

const header = `/**
 * Coverage corridor geometry — GENERATED, do not hand-edit.
 *
 * Source: \`map_build/corridors-input.json\` (dispatch-approved places
 * and corridors), projected by \`map_build/build_corridors.js\` through
 * \`map_build/projection.js\` — the SAME Web-Mercator maths and corner
 * coordinates (map_manifest.json, city-verified) that
 * \`build_coverage.js\` uses — into the pixel space of the hillshade
 * basemap. Every coordinate is projected data, not drawing.
 *
 * The viewBox is 5000×6111 — the desktop render's pixel space, shared
 * with \`coverage-territories.ts\`.
 */

export type PlaceType = "hub" | "city" | "border";

export type Place = {
  /** Display name. */
  name: string;
  /** \`hub\` = HQ, \`city\` = waypoint, \`border\` = border post. */
  type: PlaceType;
  /** Projected x in MAP_SPACE pixels. */
  x: number;
  /** Projected y in MAP_SPACE pixels. */
  y: number;
};

/** Every place, by id, projected into the basemap's pixel space. */
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

fs.writeFileSync(path.join(HERE, '..', 'src', 'data', 'coverage-corridors.ts'), header);

const placeCount = Object.keys(places).length;
console.log(
  `\nwrote src/data/coverage-corridors.ts — ` +
  `${placeCount} places, ${corridors.length} corridors ` +
  `(all inside the ${OUT_W}x${OUT_H} frame: ` +
  `${Object.values(places).every(p => p.x >= 0 && p.x <= OUT_W && p.y >= 0 && p.y <= OUT_H)})`);
