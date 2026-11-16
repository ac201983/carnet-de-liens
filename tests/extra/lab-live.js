// joue l'arrivée en vrai dans le banc d'essai, mesure le rythme des images et vérifie que le calque s'enlève à la fin
const { chromium } = require('playwright');
const dsf = Number(process.argv[2] || 2);
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 560 }, deviceScaleFactor: dsf, ignoreHTTPSErrors: true });
  const page = await ctx.newPage(); page.on('pageerror', e => console.log('err:', String(e).slice(0, 300))); page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('console:', m.text().slice(0, 200)); });
  await page.addInitScript(() => { window.__eauSansGarde = true; });
  await page.goto('https://localhost:8443/build/doux/lab.html?live=1&v=' + Date.now());
  await page.evaluate(() => { window.__f = []; const tick = t => { window.__f.push(t); requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  const seen = [];
  for (let i = 0; i < 14; i++) { await page.waitForTimeout(500); seen.push(await page.evaluate(() => { const c = document.querySelector('canvas.eau'); return c ? c.width + 'x' + c.height : '-'; })); }
  const f = await page.evaluate(() => { const a = window.__f; const d = []; for (let i = 1; i < a.length; i++) d.push(a[i] - a[i - 1]); d.sort((x, y) => x - y); return { n: d.length, med: d[d.length >> 1], p90: d[Math.floor(d.length * .9)], max: d[d.length - 1] }; });
  console.log('calque toutes les 0,5 s :', seen.join(' '));
  console.log('rythme des images (ms) :', JSON.stringify(f));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
