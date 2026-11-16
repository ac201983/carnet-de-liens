// Assemble des captures en une planche. usage : node planche.js <sortie.jpg> <largeur de vignette> <colonnes> <fichier>...
const sharp = require('sharp');
(async () => {
  const [out, tw, cols, ...files] = process.argv.slice(2); const TW = Number(tw), C = Number(cols);
  const bufs = []; for (const f of files) { const im = sharp(f).resize({ width: TW }); const b = await im.toBuffer({ resolveWithObject: true }); bufs.push(b); }
  const rows = []; for (let i = 0; i < bufs.length; i += C) rows.push(bufs.slice(i, i + C));
  let y = 0; const comps = [];
  for (const r of rows) { let x = 0; let h = 0; for (const b of r) { comps.push({ input: b.data, left: x, top: y }); x += TW + 6; h = Math.max(h, b.info.height); } y += h + 6; }
  await sharp({ create: { width: C * (TW + 6), height: y, channels: 3, background: '#333' } }).composite(comps).jpeg({ quality: 76 }).toFile(out);
})();
