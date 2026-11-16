// l'accueil en vrai, animations activées : huit instants de l'arrivée
const { chromium } = require('playwright');
const dsf = Number(process.argv[2] || 2), url = process.argv[3] || 'https://localhost:8443/carnet-de-liens/parent-ecoute/', tag = process.argv[4] || 'acc';
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: dsf, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => console.log('err:', String(e).slice(0, 300))); page.on('console', m => { if (m.type() === 'error') console.log('console:', m.text().slice(0, 200)); });
  await page.goto(url, { waitUntil: 'commit' });
  await page.waitForFunction(() => document.documentElement.classList.contains('fx'));
  const t0 = Date.now(); const marks = [300, 1100, 1900, 2700, 3500, 4300, 5200, 6800];
  for (const m of marks) { const d = m - (Date.now() - t0); if (d > 0) await page.waitForTimeout(d); await page.screenshot({ path: '/home/claude/build/doux/' + tag + '-' + String(m).padStart(4, '0') + '.png', clip: { x: 0, y: 0, width: 390, height: 430 } }); }
  console.log('calque à la fin :', await page.evaluate(() => !!document.querySelector('canvas.eau')));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
