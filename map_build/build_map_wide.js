'use strict';
/* Wide-frame terrain builder. NEW file — does not modify build_map.js.
 * Reuses build_map.js tile source, terrarium decode, hillshade settings
 * (az 315, alt 45, zf 1.8, res formula), colour ramp, ocean rule, and the
 * same Web-Mercator world-pixel maths. Only the frame and outputs differ:
 *   frame: West 5E, East 44E, North -8, South -32 (exact crop, EPSG:3857)
 *   out:   map_build/out/southern-africa-wide-hillshade-6000.png (6000 px)
 *          map_build/out/southern-africa-wide-hillshade-2400.png (2400 px)
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const LON_MIN = 5.0, LON_MAX = 44.0;
const LAT_TOP = -8.0, LAT_BOT = -32.0;   // north, south
const ZOOM = 8;                          // lowest zoom with native width >= 6000
const OUT_W = 6000;
const SMALL_W = 2400;
const TILE = 256;
const SIZE = TILE * Math.pow(2, ZOOM);

// Same projection maths as build_map.js / projection.js
const worldX = lon => (lon + 180) / 360 * SIZE;
const worldY = lat => (0.5 - Math.asinh(Math.tan(lat * Math.PI / 180)) / (2 * Math.PI)) * SIZE;

// Exact frame edges in world px (fractional)
const x0w = worldX(LON_MIN), x1w = worldX(LON_MAX);
const y0w = worldY(LAT_TOP), y1w = worldY(LAT_BOT);
const NAT_W = x1w - x0w, NAT_H = y1w - y0w;

// Height from Mercator maths for the same pixel width (NOT a forced ratio)
const OUT_H = Math.round(OUT_W * NAT_H / NAT_W);
const SMALL_H = Math.round(SMALL_W * NAT_H / NAT_W);

// Covering tile range
const tileMinX = Math.floor(x0w / TILE), tileMaxX = Math.floor((x1w - 1e-9) / TILE);
const tileMinY = Math.floor(y0w / TILE), tileMaxY = Math.floor((y1w - 1e-9) / TILE);
const W = (tileMaxX - tileMinX + 1) * TILE;
const H = (tileMaxY - tileMinY + 1) * TILE;

// Integer crop of the mosaic that corresponds to the exact frame
const cropX = Math.round(x0w - tileMinX * TILE);
const cropY = Math.round(y0w - tileMinY * TILE);
const cropW = Math.round(NAT_W);
const cropH = Math.round(NAT_H);

console.log('zoom', ZOOM, 'native frame px', NAT_W.toFixed(1), 'x', NAT_H.toFixed(1),
            'aspect', (NAT_W / NAT_H).toFixed(4));
console.log('tiles X', tileMinX, '..', tileMaxX, 'Y', tileMinY, '..', tileMaxY,
            'count', (tileMaxX - tileMinX + 1) * (tileMaxY - tileMinY + 1));
console.log('mosaic', W, 'x', H, 'crop', cropX, cropY, cropW, cropH,
            '-> out', OUT_W, 'x', OUT_H, 'small', SMALL_W, 'x', SMALL_H);

// Same tile source as build_map.js
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
    const retry = a => { if (a < 4) { setTimeout(() => tryOnce(a + 1), 300 * (a + 1)); }
                         else reject(new Error('fail ' + url)); };
    tryOnce(0);
  });
}

async function main() {
  const t0 = Date.now();
  const tiles = [];
  for (let ty = tileMinY; ty <= tileMaxY; ty++)
    for (let tx = tileMinX; tx <= tileMaxX; tx++)
      tiles.push({ tx, ty });
  const total = tiles.length;

  const CONC = 24;
  let done = 0, failed = 0;
  const cache = new Map();
  async function worker() {
    while (tiles.length) {
      const t = tiles.pop();
      try {
        const buf = await fetchTile(ZOOM, t.tx, t.ty);
        const { data } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
        cache.set(t.tx + '_' + t.ty, { data: new Uint8Array(data) });
      } catch (e) { failed++; console.log('FAILED tile', t.tx, t.ty, e.message); }
      done++;
      if (done % 50 === 0 || done === total)
        console.log('fetched', done, '/', total, 'ok', cache.size, 'failed', failed,
                    ((Date.now() - t0) / 1000).toFixed(0) + 's');
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  if (failed > 0) throw new Error(failed + ' tiles failed to fetch — aborting, no invented data');
  console.log('all tiles fetched:', cache.size);

  // Assemble DEM — same terrarium decode as build_map.js
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
        dem[rowBase + xx] = (d[i] * 256 + d[i + 1] + d[i + 2] / 256) - 32768;
      }
    }
  }
  console.log('DEM assembled');

  // Hillshade — same settings as build_map.js (az 315, alt 45, zf 1.8)
  const latC = (LAT_TOP + LAT_BOT) / 2;
  const res = 156543.03392 * Math.cos(latC * Math.PI / 180) / Math.pow(2, ZOOM);
  const zf = 1.8;
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

  // Colour ramp — identical stops to build_map.js
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
    if (dem[p] <= 0) { r = 8; g = 4; b = 2; }
    else { const idx = (shade[p] * 255) | 0; r = ramp[idx * 3]; g = ramp[idx * 3 + 1]; b = ramp[idx * 3 + 2]; }
    const o = p * 3;
    rgb[o] = r; rgb[o + 1] = g; rgb[o + 2] = b;
  }
  console.log('colored');

  // Crop exactly to the frame, then resample to both sizes; PNG, no labels/borders
  const outDir = path.join(__dirname, 'out');
  fs.mkdirSync(outDir, { recursive: true });
  const outBig = path.join(outDir, 'southern-africa-wide-hillshade-6000.png');
  const outSmall = path.join(outDir, 'southern-africa-wide-hillshade-2400.png');
  const baseImg = sharp(rgb, { raw: { width: W, height: H, channels: 3 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .blur(2.2);
  await baseImg.clone().resize(OUT_W, OUT_H).blur(1.0).png().toFile(outBig);
  const szBig = fs.statSync(outBig).size;
  console.log('wrote', outBig, szBig, 'bytes');
  await baseImg.clone().resize(SMALL_W, SMALL_H).blur(0.6).png().toFile(outSmall);
  const szSmall = fs.statSync(outSmall).size;
  console.log('wrote', outSmall, szSmall, 'bytes');

  // Mercator extent in metres (EPSG:3857, R = 6378137)
  const R = 6378137;
  const mx = lon => R * lon * Math.PI / 180;
  const my = lat => R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2));
  const mercator_extent_m = { xmin: mx(LON_MIN), xmax: mx(LON_MAX), ymin: my(LAT_BOT), ymax: my(LAT_TOP) };

  // Verification with the SAME frame maths, in 6000px image space
  const toPx = (lon, lat) => [(worldX(lon) - x0w) / NAT_W * OUT_W, (worldY(lat) - y0w) / NAT_H * OUT_H];
  const places = [
    ['Johannesburg', -26.2041, 28.0473],
    ['Durban', -29.8587, 31.0218],
    ['Gaborone', -24.6282, 25.9231],
    ['Windhoek', -22.5609, 17.0658],
    ['Lusaka', -15.3875, 28.3228],
    ['Beitbridge', -22.2186, 30.0003],
    ['Lubumbashi', -11.6609, 27.4794],
    ['Kolwezi', -10.7148, 25.4666],
    ['Cape Town', -33.9249, 18.4241],
  ];
  console.log('--- verification (6000px image, ' + OUT_W + 'x' + OUT_H + ') ---');
  const verifyRows = [];
  for (const [name, lat, lon] of places) {
    const [px, py] = toPx(lon, lat);
    const inside = px >= 0 && px < OUT_W && py >= 0 && py < OUT_H;
    const row = { place: name, lat, lon, x_px: +px.toFixed(1), y_px: +py.toFixed(1),
                  x_pct: +(px / OUT_W * 100).toFixed(2), y_pct: +(py / OUT_H * 100).toFixed(2),
                  inside };
    verifyRows.push(row);
    console.log((inside ? 'INSIDE ' : 'OUTSIDE') + ' ' + name + ': x=' + px.toFixed(1) +
                ' y=' + py.toFixed(1) + ' (' + (px / OUT_W * 100).toFixed(2) + '%, ' +
                (py / OUT_H * 100).toFixed(2) + '%)');
  }

  const manifest = {
    frame_degrees: { west: LON_MIN, east: LON_MAX, north: LAT_TOP, south: LAT_BOT },
    mercator_extent_m,
    projection: 'Web Mercator (EPSG:3857)',
    zoom: ZOOM,
    source: 'SRTM (90m / 30m) via AWS terrarium elevation-tiles-prod, zoom ' + ZOOM,
    dimensions_6000: { width: OUT_W, height: OUT_H },
    dimensions_2400: { width: SMALL_W, height: SMALL_H },
    files: { image_6000: outBig, image_6000_bytes: szBig, image_2400: outSmall, image_2400_bytes: szSmall },
    verification_6000px: verifyRows,
  };
  fs.writeFileSync(path.join(__dirname, 'map_manifest_wide.json'), JSON.stringify(manifest, null, 2));
  console.log('MANIFEST:\n' + JSON.stringify(manifest, null, 2));
  console.log('total time', ((Date.now() - t0) / 1000).toFixed(0) + 's');
}
main().catch(e => { console.error('FATAL', e); process.exit(1); });
