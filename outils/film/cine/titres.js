// Les textes du montage cinématographique : une image par texte et par format, plus la place de chaque texte (titres.json).
// node titres.js : tout refaire.   node titres.js <nom> <format> : un seul texte (les autres fichiers ne sont pas touchés, pour ne pas gêner un rendu en cours).
const { chromium } = require('playwright'); const fs = require('fs');
const NOMS = ['public', 'tablette', 'bastien', 'dimanche', 'autresoir'];
(async () => {
  const [SEUL, SEULF] = process.argv.slice(2); const J = __dirname + '/titres/titres.json';
  const b = await chromium.launch(); const rep = SEUL ? JSON.parse(fs.readFileSync(J, 'utf8')) : {};
  for (const f of ['H', 'V', 'I']) {
    if (SEULF && f !== SEULF) continue;
    const ctx = await b.newContext({ viewport: f === 'H' ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 }, deviceScaleFactor: 1 }); const p = await ctx.newPage();
    for (const q of NOMS) {
      if (SEUL && q !== SEUL) continue;
      await p.goto('file://' + __dirname + '/titres.html?quoi=' + q + '&f=' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(120);
      const img = __dirname + '/titres/' + q + '-' + f + '.png'; await p.screenshot({ path: img + '.tmp.png', omitBackground: q !== 'carte-fond' }); fs.renameSync(img + '.tmp.png', img);
      rep[q + '-' + f] = await p.evaluate(() => { const e = document.querySelector('.t, svg.logo'); if (!e) return null; const r = e.getBoundingClientRect(); return { x0: Math.round(r.left), y0: Math.round(r.top), x1: Math.round(r.right), y1: Math.round(r.bottom) }; });
    }
    await ctx.close();
  }
  fs.writeFileSync(J + '.tmp', JSON.stringify(rep, null, 1)); fs.renameSync(J + '.tmp', J); await b.close();
  console.log(Object.entries(rep).filter(([k, v]) => v).map(([k, v]) => k + ' ' + [v.x0, v.y0, v.x1, v.y1].join(',')).join('\n'));
})();
