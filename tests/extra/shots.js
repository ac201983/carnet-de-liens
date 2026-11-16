// Photographie tous les écrans à une taille donnée (animations réduites), pour juger la mise en page.
// usage : node shots.js <largeur> <hauteur> <dossier> [page]   (« page » : la page entière, sinon seulement la partie visible)
const { chromium } = require('playwright');
const { walk } = require('../walk');
const fs = require('fs');
const [W, H, OUT, FULL] = [Number(process.argv[2] || 1280), Number(process.argv[3] || 800), process.argv[4] || '/home/claude/build/ordi/avant', process.argv[5] === 'page'];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  if (process.env.FIXE) await ctx.clock.setFixedTime(new Date('2026-11-16T09:00:00'));   // la même heure partout, pour comparer deux versions image par image
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  let n = 0; const names = [];
  await walk(page, async name => { n++; await page.waitForTimeout(120); const f = OUT + '/' + String(n).padStart(2, '0') + '-' + name + '.png'; await page.screenshot({ path: f, fullPage: FULL }); names.push(name); });
  fs.writeFileSync(OUT + '/noms.json', JSON.stringify(names));
  console.log(n + ' écrans à ' + W + '×' + H + ' dans ' + OUT + (errs.length ? ' | erreurs : ' + errs.join(' ; ') : ''));
  await b.close();
})().catch(e => { console.error(String(e).slice(0, 600)); process.exit(1); });
