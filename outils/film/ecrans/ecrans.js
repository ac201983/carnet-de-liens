// Photographie les écrans composés pour le film : l'écran verrouillé (une image) et le fil de messages (une image par trentième de seconde).
// node ecrans.js <verrou|fil> <dossier> [points par pixel]
const { chromium } = require('playwright'); const fs = require('fs');
const [quoi = 'fil', out = 'fil', DSF = '5'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const h = quoi === 'verrou' ? 844 : 693;
  const ctx = await b.newContext({ viewport: { width: 390, height: h }, deviceScaleFactor: +DSF });
  const p = await ctx.newPage(); await p.goto('file://' + __dirname + '/ecrans.html?ecran=' + quoi + '&h=' + h); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  fs.mkdirSync(out, { recursive: true });
  if (quoi === 'verrou') { await p.screenshot({ path: out + '/verrou.png' }); console.log('verrou fait'); }
  else {
    const rep = await p.evaluate(() => window.REPERES); const n = Math.round(4.2 * 30);
    for (let i = 0; i < n; i++) { await p.evaluate(t => window.etat(t), i / 30); fs.writeFileSync(out + '/' + String(i).padStart(4, '0') + '.jpg', await p.screenshot({ type: 'jpeg', quality: 95 })); }
    fs.writeFileSync(out + '/reperes.json', JSON.stringify(rep)); console.log('fil fait', n, 'images', JSON.stringify(rep).slice(0, 200));
  }
  await b.close();
})();
