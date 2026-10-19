'use strict';
/**
 * Wide-frame Web-Mercator projection — NEW file for the wide basemap.
 *
 * SAME maths as `build_map_wide.js` (which itself reuses the
 * `build_map.js` / `projection.js` world-pixel formulae): world pixels at
 * zoom 8, frame West 5E / East 44E / North -8 / South -32, height derived
 * from the Mercator aspect for a 6000 px width (→ 6000×3966).
 *
 * Imported by BOTH `build_coverage_wide.js` and `build_corridors_wide.js`
 * so wide-frame geometry lives in exactly ONE place.
 */

const OUT_W = 6000;
const FRAME = { west: 5.0, east: 44.0, north: -8.0, south: -32.0 };

const ZOOM = 8;
const TILE = 256;
const SIZE = TILE * Math.pow(2, ZOOM);
const worldX = lon => (lon + 180) / 360 * SIZE;
const worldY = lat => (0.5 - Math.asinh(Math.tan(lat * Math.PI / 180)) / (2 * Math.PI)) * SIZE;

const x0w = worldX(FRAME.west);
const y0w = worldY(FRAME.north);
const spanX = worldX(FRAME.east) - x0w;
const spanY = worldY(FRAME.south) - y0w;

// Height from the Mercator maths for the same pixel width (same formula
// as build_map_wide.js) — must be 3966.
const OUT_H = Math.round(OUT_W * spanY / spanX);
if (OUT_H !== 3966) throw new Error('wide frame height drift: ' + OUT_H);

/** [lon, lat] → [x, y] in the wide basemap's pixel space (viewBox 6000×3966). */
const project = ([lon, lat]) => [
  ((worldX(lon) - x0w) / spanX) * OUT_W,
  ((worldY(lat) - y0w) / spanY) * OUT_H,
];

/** Half-pixel precision — same rounding as projection.js. */
const round = v => Math.round(v * 2) / 2;

module.exports = {
  OUT_W,
  OUT_H,
  FRAME,
  ZOOM,
  worldX,
  worldY,
  project,
  round,
};
