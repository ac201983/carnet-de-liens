// La goutte qui rebondit, image par image (banc d'essai), sur l'accueil du téléphone ou sur la photo entière.
const { chromium } = require('playwright');
const host = process.argv[2] || 'hero', tag = process.argv[3] || 'bd', ts = JSON.parse(process.argv[4] || '[0.3,0.62,0.9,1.1,1.2,1.35,1.5,1.8,2.15,2.6,3.2,4.0]');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const full = host === 'full';
  const ctx = await b.newContext({ viewport: full ? { width: 880, height: 480 } : { width: 390, height: 560 }, deviceScaleFactor: full ? 1 : 2, ignoreHTTPSErrors: true });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; window.__bond = 0; });
  const page = await ctx.newPage(); page.on('pageerror', e => console.log('err:', String(e).slice(0, 300))); page.on('console', m => { if (m.type() !== 'log') console.log('console:', m.text().slice(0, 300)); });
  await page.goto('https://localhost:8443/build/doux/lab.html?' + (host === 'hero' ? '' : 'host=' + host + '&') + 'v=' + Date.now()); await page.waitForTimeout(500);
  const clip = full ? { x: 280, y: 110, width: 310, height: 190 } : host === 'auj' ? { x: 0, y: 0, width: 390, height: 212 } : { x: 60, y: 60, width: 270, height: 150 };
  await page.screenshot({ path: '/home/claude/build/doux/' + tag + '-still.png', clip });
  for (const t of ts) { await page.evaluate(t => window.lab(t, []), t); await page.waitForTimeout(100); await page.screenshot({ path: '/home/claude/build/doux/' + tag + '-' + String(Math.round(t * 100)).padStart(3, '0') + '.png', clip }); }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
