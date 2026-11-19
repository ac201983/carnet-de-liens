// Les états de la respiration : choix ouvert, arrêtée (prête), terminée. node etats.js <largeur> <hauteur> <heure> <nom> [port] [base]
const { chromium } = require('playwright');
(async () => {
  const [w, h, heure, nom, port, base] = process.argv.slice(2); const mobile = +w < 700;
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: mobile ? 2 : 1, ignoreHTTPSErrors: true, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript(hh => { Date.prototype.getHours = function () { return hh; }; const p0 = performance.now.bind(performance); window.__K = 1; let base = 0, at = p0(); performance.now = () => base + (p0() - at) * window.__K; window.__vite = k => { base = performance.now(); at = p0(); window.__K = k; }; }, +heure);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  const D = '/home/claude/build/carnet/shots/';
  await p.goto('https://localhost:' + (port || 8445) + (base || '/')); await p.waitForSelector('[data-act="porte"][data-v="souffle"]'); await p.waitForTimeout(500);
  await p.click('[data-act="porte"][data-v="souffle"]'); await p.waitForTimeout(3200);
  await p.click('[data-act="resp-ouvre"]'); await p.waitForTimeout(900); await p.screenshot({ path: D + nom + '-choix.png', fullPage: true });
  await p.click('[data-act="resp"][data-v="libre"]'); await p.waitForTimeout(500); await p.screenshot({ path: D + nom + '-choix-libre.png', fullPage: true });
  await p.click('[data-act="resp-ferme"]'); await p.waitForTimeout(600);
  await p.click('[data-act="souffle-stop"]'); await p.waitForTimeout(900); await p.screenshot({ path: D + nom + '-pret.png' });
  await p.click('[data-act="souffle-go"]'); await p.waitForTimeout(400);
  await p.evaluate(() => window.__vite(30)); await p.waitForSelector('main.souffle.s-fini', { timeout: 30000 }); await p.evaluate(() => window.__vite(1)); await p.waitForTimeout(1200);
  await p.screenshot({ path: D + nom + '-fini.png', fullPage: true });
  if (errs.length) console.log('ERREURS', errs);
  console.log(nom, 'ok');
  await b.close();
})();
