'use strict';
/**
 * The shared Web-Mercator projection for the Coverage basemap — the
 * single source of truth for lon/lat → basemap pixel space.
 *
 * Imported by BOTH `build_coverage.js` (country outlines) and
 * `build_corridors.js` (corridor geometry) so the maths exists in
 * exactly ONE place: no second copy that could drift out of sync with
 * the basemap.
 *
 * ── Alignment ──
 * The projection is the SAME Web-Mercator maths as `build_map.js`, and
 * the image corners are the ones recorded in `map_manifest.json`
 * (tile-grid aligned, city-verified to 0.0 m). A point projected by
 * any script through here lands on the same pixel it does in the
 * basemap image.
 */

/* ─── The basemap's pixel space, verbatim from map_manifest.json ─── */
const OUT_W = 5000;
const OUT_H = 6111;
const CORNERS = {
  lonMin: 9.84375,
  lonMax: 35.15625,
  latMax: -8.407168163601074, // top
  latMin: -36.59788913307021, // bottom
};

/* Web-Mercator world pixels at zoom 8 — same constants as build_map.js. */
const ZOOM = 8;
const TILE = 256;
const SIZE = TILE * Math.pow(2, ZOOM);
const worldX = lon => (lon + 180) / 360 * SIZE;
const worldY = lat => (0.5 - Math.asinh(Math.tan(lat * Math.PI / 180)) / (2 * Math.PI)) * SIZE;

const x0w = worldX(CORNERS.lonMin);
const y0w = worldY(CORNERS.latMax);
const spanX = worldX(CORNERS.lonMax) - x0w;
const spanY = worldY(CORNERS.latMin) - y0w;

/** [lon, lat] → [x, y] in the basemap's pixel space (viewBox 5000×6111). */
const project = ([lon, lat]) => [
  ((worldX(lon) - x0w) / spanX) * OUT_W,
  ((worldY(lat) - y0w) / spanY) * OUT_H,
];

/** Half-pixel precision keeps the emitted files compact without mean-
    ingful drift at this scale. */
const round = v => Math.round(v * 2) / 2;

module.exports = {
  OUT_W,
  OUT_H,
  CORNERS,
  worldX,
  worldY,
  project,
  round,
};
