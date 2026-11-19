// Captures rapides : node vue.js <port> <base> <largeur> <hauteur> <heure> <nom> [action...]
// actions : membre (entrer dans l'espace), histoire (ouvrir « Mon histoire »)
const { chromium } = require('playwright');
(async () => {
  const [port, base, w, h, heure, nom, ...acts] = process.argv.slice(2);
  const mobile = +w < 700;
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, isMobile: mobile, hasTouch: mobile, locale: 'fr-CH' });
  await ctx.addInitScript(hh => { Date.prototype.getHours = function () { return hh; }; }, +heure);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const D = '/home/claude/build/goutte/shots/' + nom;
  await p.goto('https://localhost:' + port + base); await p.waitForSelector('.seuil .porte'); await p.waitForTimeout(800);
  await p.screenshot({ path: D + '-accueil.png' });
  if (acts.includes('histoire')) { await p.click('[data-act="peek-about"]'); await p.waitForTimeout(1500); await p.evaluate(() => { const s = document.querySelector('.sign'); if (s) s.scrollIntoView({ block: 'center' }); }); await p.waitForTimeout(400); await p.screenshot({ path: D + '-histoire-signature.png' }); await p.goBack(); await p.waitForTimeout(800); }
  if (acts.includes('membre')) { await p.click('[data-act="entrer"][data-v="today"]'); await p.waitForTimeout(3200); await p.screenshot({ path: D + '-aujourdhui.png' }); }
  if (errs.length) console.log('ERREURS', errs);
  await b.close();
})();
