// Captures de la vitrine et du passage vers l'étang.
// node voir.js <port> <base> <largeur> <hauteur> <heure> <nom> [plein=1] [souffle=1]
const { chromium } = require('playwright');
(async () => {
  const [port, base, w, h, heure, nom, plein, souffle] = process.argv.slice(2);
  const mobile = +w < 700;
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: mobile ? 2 : 1, ignoreHTTPSErrors: true, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript(hh => { Date.prototype.getHours = function () { return hh; }; }, +heure);
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror ' + String(e).slice(0, 300))); p.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text().slice(0, 300)); });
  await p.goto('https://localhost:' + port + base); await p.waitForSelector('[data-act="porte"][data-v="souffle"]'); await p.waitForTimeout(900);
  const D = '/home/claude/build/carnet/shots/';
  await p.screenshot({ path: D + nom + '-vitrine.png' });
  if (plein === '1') await p.screenshot({ path: D + nom + '-vitrine-entiere.png', fullPage: true });
  if (souffle === '1') {
    await p.click('[data-act="porte"][data-v="souffle"]');
    let t = 0;
    for (const ms of [200, 500, 900, 2600, 5200, 8800]) { await p.waitForTimeout(ms - t); t = ms; await p.screenshot({ path: D + nom + '-souffle-' + String(ms).padStart(4, '0') + '.png' }); }
  }
  if (errs.length) console.log('ERREURS', errs);
  const info = await p.evaluate(() => ({ html: document.documentElement.className, app: document.getElementById('app').className, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, theme: (document.querySelector('meta[name=theme-color]') || {}).content }));
  console.log(nom, JSON.stringify(info));
  await b.close();
})();
