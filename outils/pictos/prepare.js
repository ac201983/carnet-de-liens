// Allège les images retenues (sans toucher au dessin) et les range dans site-src/img/pictos/<identifiant>.svg.
// Usage : node prepare.js <liste.json> <dossier d'origine> <dossier de sortie>
const fs = require('fs');
const path = require('path');
const { optimize } = require('/home/claude/tools/node_modules/svgo');
const [liste, src, out] = process.argv.slice(2);
const items = JSON.parse(fs.readFileSync(liste, 'utf8'));
fs.mkdirSync(out, { recursive: true });
let avant = 0, apres = 0;
for (const [id, fichier] of items) {
  const brut = fs.readFileSync(path.join(src, fichier + '.svg'), 'utf8');
  const r = optimize(brut, {
    multipass: true,
    plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }, 'removeDimensions'],
  });
  if (!/viewBox=/.test(r.data)) throw new Error('viewBox perdu : ' + fichier);
  if (/<script|<foreignObject|\son[a-z]+=|href=["'](?!#)/i.test(r.data)) throw new Error('contenu inattendu : ' + fichier);
  fs.writeFileSync(path.join(out, id + '.svg'), r.data);
  avant += brut.length; apres += r.data.length;
}
console.log(items.length + ' images, ' + Math.round(avant / 1024) + ' Ko avant, ' + Math.round(apres / 1024) + ' Ko après');
