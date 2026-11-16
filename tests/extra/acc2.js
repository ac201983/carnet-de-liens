// l'accueil en vrai : la goutte, toutes les 150 ms pendant son rebond
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => console.log('err:', String(e).slice(0, 300)));
  await page.goto('https://localhost:8443/carnet-de-liens/parent-ecoute/', { waitUntil: 'load' });
  const t0 = Date.now(); const real = []; const marks = [300, 500, 700, 900, 1100, 1300, 1450, 1600, 1800, 2000, 2300, 2700];
  for (const m of marks) { const d = m - (Date.now() - t0); if (d > 0) await page.waitForTimeout(d); real.push(Date.now() - t0); await page.screenshot({ path: '/home/claude/build/doux/ag-' + String(m).padStart(4, '0') + '.png', clip: { x: 95, y: 70, width: 200, height: 170 } }); }
  console.log('instants réels', real.join(' '));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
