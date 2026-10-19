'use strict';
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const dir = __dirname;

async function inspect(file, label) {
  const img = sharp(path.join(dir, file));
  const meta = await img.metadata();
  // small preview
  await img.clone().resize(1200).png().toFile(path.join(dir, 'preview_' + label + '.png'));
  // stats on a 200px grid
  const { data, info } = await img.clone().resize(200, Math.round(200 * meta.height / meta.width))
    .raw().toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0, n = 0, dark = 0, bright = 0;
  for (let i = 0; i < data.length; i += 3) {
    const R = data[i], G = data[i + 1], B = data[i + 2];
    r += R; g += G; b += B; n++;
    if (R + G + B < 60) dark++;
    if (R + G + B > 500) bright++;
  }
  console.log(label, meta.width + 'x' + meta.height, 'avg RGB',
    (r / n).toFixed(1), (g / n).toFixed(1), (b / n).toFixed(1),
    'dark%', (100 * dark / n).toFixed(1), 'bright%', (100 * bright / n).toFixed(1));
}

(async () => {
  await inspect('southern_africa_hillshade_5000.webp', 'desktop');
  await inspect('verify_overlay.webp', 'overlay');
  console.log('files:', fs.readdirSync(dir).filter(f => /webp|png|json/.test(f)));
})();
