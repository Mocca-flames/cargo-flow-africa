'use strict';
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Region of interest (Southern Africa) with margin
//   West:  Walvis Bay (14.5E)  -> 11.0E
//   East:  Harare   (31.0E)    -> 34.0E
//   South: Cape Town(-33.9S)   -> -35.5
//   North: DRC Copperbelt(~-11S)-> -9.5
// ---------------------------------------------------------------------------
const LON_MIN = 11.0, LON_MAX = 34.0;
const LAT_MIN = -35.5, LAT_MAX = -9.5;
const ZOOM = 8;                 // terrarium pyramid level
const OUT_W = 5000;             // desktop width (px)  -- "about 5000px wide"
const MOBILE_W = 1600;          // mobile width (px)
const TILE = 256;
const SIZE = TILE * Math.pow(2, ZOOM);   // world px at this zoom

// Web-Mercator world pixel <-> lon/lat
const worldX = lon => (lon + 180) / 360 * SIZE;
const worldY = lat => (0.5 - Math.asinh(Math.tan(lat * Math.PI / 180)) / (2 * Math.PI)) * SIZE;
const lonOf  = wx => wx / SIZE * 360 - 180;
const latOf  = wy => Math.atan(Math.sinh((0.5 - wy / SIZE) * 2 * Math.PI)) * 180 / Math.PI;

// Declared bbox corners -> world px (may extend to tile gridlines)
const x0w = worldX(LON_MIN), x1w = worldX(LON_MAX);
const y0w = worldY(LAT_MAX), y1w = worldY(LAT_MIN); // top=max lat -> smaller worldY
const tileMinX = Math.floor(x0w / TILE), tileMaxX = Math.floor((x1w - 1) / TILE);
const tileMinY = Math.floor(y0w / TILE), tileMaxY = Math.floor((y1w - 1) / TILE);

const W = (tileMaxX - tileMinX + 1) * TILE;   // native DEM width
const H = (tileMaxY - tileMinY + 1) * TILE;   // native DEM height
const OUT_H = Math.round(OUT_W * H / W);
const MOBILE_H = Math.round(MOBILE_W * H / W);

console.log('tiles X', tileMinX, '..', tileMaxX, 'Y', tileMinY, '..', tileMaxY,
            'count', (tileMaxX - tileMinX + 1) * (tileMaxY - tileMinY + 1));
console.log('native grid', W, 'x', H, '-> out', OUT_W, 'x', OUT_H, 'mobile', MOBILE_W, 'x', MOBILE_H);

// Actual geographic corners of the rendered image (tile-grid aligned)
const corners = {
  topLeft:     { lon: lonOf(tileMinX * TILE),          lat: latOf(tileMinY * TILE) },
  topRight:    { lon: lonOf((tileMaxX + 1) * TILE),    lat: latOf(tileMinY * TILE) },
  bottomLeft:  { lon: lonOf(tileMinX * TILE),          lat: latOf((tileMaxY + 1) * TILE) },
  bottomRight: { lon: lonOf((tileMaxX + 1) * TILE),    lat: latOf((tileMaxY + 1) * TILE) },
};
console.log('corners', JSON.stringify(corners, null, 0));

// ---------------------------------------------------------------------------
// Fetch terrarium tiles (concurrenry-limited, with retries)
// ---------------------------------------------------------------------------
function fetchTile(z, x, y) {
  const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`;
  return new Promise((resolve, reject) => {
    const tryOnce = attempt => {
      const req = require('https').get(url, res => {
        if (res.statusCode !== 200) { res.resume(); return retry(attempt); }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      });
      req.on('error', () => retry(attempt));
      req.setTimeout(20000, () => { req.destroy(); retry(attempt); });
    };
    let attempts = 0;
    const retry = a => { if (a < 4) { attempts = a + 1; setTimeout(() => tryOnce(attempts), 300 * attempts); }
                         else reject(new Error('fail ' + url)); };
    tryOnce(0);
  });
}

async function main() {
  const tiles = [];
  for (let ty = tileMinY; ty <= tileMaxY; ty++)
    for (let tx = tileMinX; tx <= tileMaxX; tx++)
      tiles.push({ tx, ty });

  const CONC = 24;
  let done = 0;
  const cache = new Map(); // key "tx_ty" -> {r,g,b} Uint8ClampedArray (TILE*TILE*3)
  async function worker() {
    while (tiles.length) {
      const t = tiles.pop();
      const buf = await fetchTile(ZOOM, t.tx, t.ty);
      const { data } = await sharp(buf).raw()
        .toBuffer({ resolveWithObject: true });
      cache.set(t.tx + '_' + t.ty, { data: new Uint8Array(data) });
      done++;
      if (done % 50 === 0) console.log('fetched', done, '/', cache.size + tiles.length);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  console.log('all tiles fetched:', cache.size);

  // -------------------------------------------------------------------------
  // Assemble DEM (Float32, meters) from tile-aligned elevation
  // terrarium decode: elev = (R*256 + G + B/256) - 32768
  // -------------------------------------------------------------------------
  const dem = new Float32Array(W * H);
  for (const [key, t] of cache) {
    const [tx, ty] = key.split('_').map(Number);
    const offX = (tx - tileMinX) * TILE;
    const offY = (ty - tileMinY) * TILE;
    const d = t.data;
    for (let yy = 0; yy < TILE; yy++) {
      const rowBase = (offY + yy) * W + offX;
      const srcBase = yy * TILE * 3;
      for (let xx = 0; xx < TILE; xx++) {
        const i = srcBase + xx * 3;
        const elev = (d[i] * 256 + d[i + 1] + d[i + 2] / 256) - 32768;
        dem[rowBase + xx] = elev;
      }
    }
  }
  console.log('DEM assembled');

  // -------------------------------------------------------------------------
  // Hillshade (GDAL-style), light from NW (azimuth 315), altitude 45
  // -------------------------------------------------------------------------
  const latC = (LAT_MIN + LAT_MAX) / 2;
  const res = 156543.03392 * Math.cos(latC * Math.PI / 180) / Math.pow(2, ZOOM); // m/px
  const zf = 1.8;                       // vertical exaggeration
  const az = 315 * Math.PI / 180;
  const alt = 45 * Math.PI / 180;
  const cosAlt = Math.cos(alt), sinAlt = Math.sin(alt);

  const shade = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    const ym = y > 0 ? y - 1 : y;
    const yp = y < H - 1 ? y + 1 : y;
    for (let x = 0; x < W; x++) {
      const xm = x > 0 ? x - 1 : x;
      const xp = x < W - 1 ? x + 1 : x;
      const dzdx = (dem[y * W + xp] - dem[y * W + xm]) / ((xp - xm) * res) * zf;
      const dzdy = (dem[yp * W + x] - dem[ym * W + x]) / ((yp - ym) * res) * zf;
      const slope = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy));
      const aspect = Math.atan2(dzdy, -dzdx);
      let h = cosAlt * Math.cos(slope) + sinAlt * Math.sin(slope) * Math.cos(az - aspect);
      if (h < 0) h = 0; if (h > 1) h = 1;
      shade[y * W + x] = h;
    }
  }
  console.log('hillshade computed, res(m/px)=', res.toFixed(1));

  // -------------------------------------------------------------------------
  // Dark orange-tone color ramp
  // -------------------------------------------------------------------------
  const stops = [
    [0.00, [10, 5, 2]],
    [0.25, [40, 16, 4]],
    [0.45, [120, 45, 10]],
    [0.65, [200, 90, 20]],
    [0.82, [255, 150, 45]],
    [1.00, [255, 225, 170]],
  ];
  const ramp = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let a = stops[0], b = stops[stops.length - 1];
    for (let s = 0; s < stops.length - 1; s++) {
      if (t >= stops[s][0] && t <= stops[s + 1][0]) { a = stops[s]; b = stops[s + 1]; break; }
    }
    const f = (t - a[0]) / (b[0] - a[0] || 1);
    ramp[i * 3]     = a[1][0] + (b[1][0] - a[1][0]) * f;
    ramp[i * 3 + 1] = a[1][1] + (b[1][1] - a[1][1]) * f;
    ramp[i * 3 + 2] = a[1][2] + (b[1][2] - a[1][2]) * f;
  }

  const rgb = Buffer.alloc(W * H * 3);
  for (let p = 0; p < W * H; p++) {
    let r, g, b;
    if (dem[p] <= 0) {            // oceans / below sea level -> dark void
      r = 8; g = 4; b = 2;
    } else {
      const idx = (shade[p] * 255) | 0;
      r = ramp[idx * 3]; g = ramp[idx * 3 + 1]; b = ramp[idx * 3 + 2];
    }
    const o = p * 3;
    rgb[o] = r; rgb[o + 1] = g; rgb[o + 2] = b;
  }
  console.log('colored');

  // -------------------------------------------------------------------------
  // Encode WebP (desktop + mobile). A light blur smooths the hillshade (nicer
  // base map) and lets WebP compress well under the 400 KB budget.
  // -------------------------------------------------------------------------
  const outDesktop = path.join(__dirname, 'southern_africa_hillshade_5000.webp');
  const outMobile  = path.join(__dirname, 'southern_africa_hillshade_1600.webp');

  const baseImg = sharp(rgb, { raw: { width: W, height: H, channels: 3 } }).blur(2.2);

  // desktop: tune quality (with blur) to stay under 400 KB
  let q = 50, blurOut = 1.0;
  await baseImg.clone().resize(OUT_W, OUT_H).blur(blurOut)
    .webp({ quality: q, effort: 6, smartSubsample: true }).toFile(outDesktop);
  let sz = fs.statSync(outDesktop).size;
  while (sz > 400 * 1024 && q > 18) {
    q -= 4;
    await baseImg.clone().resize(OUT_W, OUT_H).blur(blurOut)
      .webp({ quality: q, effort: 6, smartSubsample: true }).toFile(outDesktop);
    sz = fs.statSync(outDesktop).size;
  }
  // mobile: small blur already baked in; keep comfortably tiny
  await baseImg.clone().resize(MOBILE_W, MOBILE_H).blur(0.6)
    .webp({ quality: 55, effort: 6, smartSubsample: true }).toFile(outMobile);
  const szMobile = fs.statSync(outMobile).size;
  console.log('desktop', sz, 'bytes (quality', q + ')', 'mobile', szMobile, 'bytes');

  // -------------------------------------------------------------------------
  // Verification overlay: crosshair markers at the 5 cities
  // -------------------------------------------------------------------------
  const cities = {
    Johannesburg: [-26.2041, 28.0473],
    Gaborone:     [-24.6282, 25.9231],
    Beitbridge:   [-22.2167, 29.9833],
    Lusaka:       [-15.3875, 28.3228],
    Windhoek:     [-22.5609, 17.0658],
  };
  function lonLatToPx(lon, lat) {
    const wx = worldX(lon), wy = worldY(lat);
    return [ (wx - tileMinX * TILE) / W * OUT_W, (wy - tileMinY * TILE) / H * OUT_H ];
  }
  const verifyRows = [];
  const overlay = Buffer.from(rgb); // we'll draw on the native rgb then resize
  // draw on native-resolution buffer
  function drawNative(lon, lat, col) {
    const wx = worldX(lon), wy = worldY(lat);
    const px = Math.round((wx - tileMinX * TILE));
    const py = Math.round((wy - tileMinY * TILE));
    const R = 6;
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== R && dx * dx + dy * dy > R * R) continue;
      const x = px + dx, y = py + dy;
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const o = (y * W + x) * 3;
      overlay[o] = col[0]; overlay[o + 1] = col[1]; overlay[o + 2] = col[2];
    }
  }
  for (const [name, [lat, lon]] of Object.entries(cities)) {
    const [px, py] = lonLatToPx(lon, lat);
    // round-trip to confirm georeferencing
    const wx = tileMinX * TILE + px / OUT_W * W;
    const wy = tileMinY * TILE + py / OUT_H * H;
    const lon2 = lonOf(wx), lat2 = latOf(wy);
    verifyRows.push({ city: name, lon, lat, px: +px.toFixed(1), py: +py.toFixed(1),
                      lon_rt: +lon2.toFixed(4), lat_rt: +lat2.toFixed(4),
                      err_m: Math.hypot((lon - lon2) * 111320 * Math.cos(lat*Math.PI/180), (lat-lat2)*110540).toFixed(1) });
    drawNative(lon, lat, [255, 255, 255]);
  }
  await sharp(overlay, { raw: { width: W, height: H, channels: 3 } })
    .resize(OUT_W, OUT_H)
    .webp({ quality: 70, effort: 4 })
    .toFile(path.join(__dirname, 'verify_overlay.webp'));

  const manifest = {
    source: 'SRTM (90m / 30m) via AWS terrarium elevation-tiles-prod, zoom ' + ZOOM,
    projection: 'Web Mercator (EPSG:3857)',
    region_bbox_declared: { lon_min: LON_MIN, lon_max: LON_MAX, lat_min: LAT_MIN, lat_max: LAT_MAX },
    image_corners_lonlat: corners,
    dimensions_desktop: { width: OUT_W, height: OUT_H },
    dimensions_mobile: { width: MOBILE_W, height: MOBILE_H },
    files: { desktop: outDesktop, desktop_bytes: sz, mobile: outMobile, mobile_bytes: szMobile },
    city_verification: verifyRows,
  };
  fs.writeFileSync(path.join(__dirname, 'map_manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('MANIFEST:\n' + JSON.stringify(manifest, null, 2));
}
main().catch(e => { console.error(e); process.exit(1); });
