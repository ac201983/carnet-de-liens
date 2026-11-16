// Compare deux dossiers de captures, écran par écran. usage : node compare.js <avant> <après>
const sharp = require('sharp'); const fs = require('fs');
(async () => {
  const [A, B] = process.argv.slice(2); const files = fs.readdirSync(A).filter(f => f.endsWith('.png')); let diffs = 0;
  for (const f of files) {
    if (!fs.existsSync(B + '/' + f)) { console.log('absent après :', f); diffs++; continue; }
    const a = await sharp(A + '/' + f).raw().toBuffer({ resolveWithObject: true }), b = await sharp(B + '/' + f).raw().toBuffer({ resolveWithObject: true });
    if (a.info.width !== b.info.width || a.info.height !== b.info.height) { console.log(f, 'tailles différentes', a.info.width + 'x' + a.info.height, b.info.width + 'x' + b.info.height); diffs++; continue; }
    let n = 0, y0 = 1e9, y1 = -1; const ch = a.info.channels, w = a.info.width;
    for (let i = 0; i < a.data.length; i += ch) { if (Math.abs(a.data[i] - b.data[i]) > 8 || Math.abs(a.data[i + 1] - b.data[i + 1]) > 8 || Math.abs(a.data[i + 2] - b.data[i + 2]) > 8) { n++; const y = Math.floor(i / ch / w); if (y < y0) y0 = y; if (y > y1) y1 = y; } }
    if (n) { diffs++; console.log(f, n + ' points différents, entre les lignes ' + y0 + ' et ' + y1); }
  }
  console.log(files.length + ' écrans comparés, ' + diffs + ' avec une différence');
})();
