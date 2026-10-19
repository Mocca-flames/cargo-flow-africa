const https = require('https');
const z = 9, x = 295, y = 294;
const url = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/' + z + '/' + x + '/' + y + '.png';
https.get(url, res => {
  console.log('status', res.statusCode, 'len', res.headers['content-length']);
  let n = 0;
  res.on('data', d => n += d.length);
  res.on('end', () => console.log('bytes', n));
}).on('error', e => console.log('ERR', e.message));
