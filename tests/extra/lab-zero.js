// Le calque présent mais sans onde (transparent) change-t-il quoi que ce soit à l'image ?
const { chromium } = require('playwright'); const sharp = require('sharp');
(async () => {
  for (const dsf of [1, 2, 3]) {
    const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
    const ctx = await b.newContext({ viewport: { width: 390, height: 560 }, deviceScaleFactor: dsf, ignoreHTTPSErrors: true });
    await ctx.addInitScript(() => { window.__eauSansGarde = true; });
    const page = await ctx.newPage();
    await page.goto('https://localhost:8443/build/doux/lab.html?v=' + Date.now()); await page.waitForTimeout(500);
    const clip = { x: 0, y: 0, width: 390, height: 346 };
    const raw = async () => (await sharp(await page.screenshot({ clip })).removeAlpha().raw().toBuffer());
    const still = await raw();
    await page.evaluate(() => window.lab(1.5, [[434, 259, 0.00001, 0]])); await page.waitForTimeout(150);
    const z = await raw(); let mx = 0, n3 = 0, sum = 0; for (let k = 0; k < z.length; k++) { const a = Math.abs(z[k] - still[k]); if (a > mx) mx = a; if (a > 3) n3++; sum += a; }
    const has = await page.evaluate(() => !!document.querySelector('canvas.eau'));
    console.log('densité', dsf, '| calque présent', has, '| écart max', mx, '| moyenne', (sum / z.length).toFixed(3), '| valeurs changeant de plus de 3 :', (n3 / z.length * 100).toFixed(2) + ' %');
    await b.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
