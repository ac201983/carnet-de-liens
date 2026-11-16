// Rythme des images pendant un changement d'onglet (flou) et pendant l'arrivée des blocs, avec et sans émulation de carte graphique.
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
(async () => {
  for (const [nom, args] of [['rendu logiciel simple', []], ['carte graphique émulée', ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']]]) {
    const b = await chromium.launch({ args });
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true });
    await ctx.addInitScript(() => { try { localStorage.setItem('pepe-consent', JSON.stringify({ v: 1, audience: false, date: '2026-11-16' })); } catch (e) { } });
    const page = await ctx.newPage();
    await page.goto('https://localhost:8443/carnet-de-liens/parent-ecoute/'); await page.waitForTimeout(700);
    await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(900); await page.click(A('ob-done')); await page.waitForTimeout(4000);
    const run = async sel => page.evaluate(sel => new Promise(res => { const f = []; let t0 = performance.now(); const tick = t => { f.push(t); if (t - t0 < 2200) requestAnimationFrame(tick); else { const d = []; for (let i = 1; i < f.length; i++) d.push(f[i] - f[i - 1]); d.sort((a, b) => a - b); res({ images: f.length, mediane: Math.round(d[d.length >> 1]), p90: Math.round(d[Math.floor(d.length * .9)]), max: Math.round(d[d.length - 1]) }); } }; document.querySelector(sel).click(); t0 = performance.now(); requestAnimationFrame(tick); }), sel);
    const r1 = await run('.tab[data-view="kit"]'); await page.waitForTimeout(800);
    const r2 = await run('.tab[data-view="today"]');
    console.log(nom.padEnd(24), '| vers Outils', JSON.stringify(r1), '| vers Aujourd’hui', JSON.stringify(r2));
    await b.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
