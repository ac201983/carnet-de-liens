// usage : node lab3.js <nom> <params d'URL> <rips JSON> <temps JSON> [hero|full]
const { chromium } = require('playwright');
const out = process.argv[2], qs = process.argv[3] || '', rips = JSON.parse(process.argv[4] || '[[434,259,1,0],[434,259,0.55,1.05]]'), ts = JSON.parse(process.argv[5] || '[1.0,1.8,2.6,3.4]'), host = process.argv[6] || 'hero';
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const full = host === 'full';
  const ctx = await b.newContext({ viewport: full ? { width: 880, height: 480 } : { width: 390, height: 560 }, deviceScaleFactor: full ? 1 : 2, ignoreHTTPSErrors: true });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => console.log('err:', String(e).slice(0, 300)));
  await page.goto('https://localhost:8443/build/doux/lab.html?' + (full ? 'host=full&' : '') + qs + '&v=' + Date.now()); await page.waitForTimeout(500);
  const clip = full ? { x: 0, y: 0, width: 866, height: 470 } : { x: 0, y: 0, width: 390, height: 346 };
  await page.screenshot({ path: '/home/claude/build/doux/' + out + '-still.png', clip });
  for (const t of ts) { await page.evaluate(([t, r]) => window.lab(t, r), [t, rips]); await page.waitForTimeout(100); await page.screenshot({ path: '/home/claude/build/doux/' + out + '-' + String(Math.round(t * 10)).padStart(2, '0') + '.png', clip }); }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
