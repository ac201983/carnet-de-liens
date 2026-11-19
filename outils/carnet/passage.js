// Le passage image par image : node passage.js <heure> <nom> [retour=1]
const { chromium } = require('playwright');
(async () => {
  const [heure, nom, retour] = process.argv.slice(2); const D = '/home/claude/build/carnet/shots/';
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 664 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true });
  await ctx.addInitScript(hh => { Date.prototype.getHours = function () { return hh; }; }, +heure);
  const p = await ctx.newPage(); p.on('pageerror', e => console.log('pageerror', String(e).slice(0, 200)));
  await p.goto('https://localhost:8445/'); await p.waitForSelector('.seuil .porte'); await p.waitForTimeout(800);
  const T = [90, 220, 360, 520, 760, 1300];
  const serie = async (pre) => { let t = 0; const t0 = Date.now(); for (const ms of T) { const d = ms - (Date.now() - t0); if (d > 0) await p.waitForTimeout(d); await p.screenshot({ path: D + nom + '-' + pre + '-' + String(ms).padStart(4, '0') + '.png' }); } };
  await p.click('[data-act="porte"][data-v="souffle"]'); await serie('aller');
  if (retour === '1') { await p.waitForTimeout(1500); await p.click('.souffle .bar .back'); await serie('retour'); }
  await b.close();
})();
