const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 300 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => console.log('err:', String(e).slice(0, 300)));
  await page.goto('https://localhost:8443/build/doux/lab.html?host=auj&v=' + Date.now()); await page.waitForTimeout(500);
  const clip = { x: 0, y: 0, width: 390, height: 212 }; const rips = [[434, 259, 1, 0], [434, 259, .55, .6]];
  await page.screenshot({ path: '/home/claude/build/doux/bj-still.png', clip });
  for (const t of [0.9, 1.6, 2.4, 3.2]) { await page.evaluate(([t, r]) => window.lab(t, r), [t, rips]); await page.waitForTimeout(120); await page.screenshot({ path: '/home/claude/build/doux/bj-' + String(Math.round(t * 10)).padStart(2, '0') + '.png', clip }); }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
