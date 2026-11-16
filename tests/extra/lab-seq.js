// La douceur en chiffres : 30 images par seconde pendant toute l'arrivée, puis la part de l'image qui change d'une image à la suivante.
const { chromium } = require('playwright'); const sharp = require('sharp');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 560 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; });
  const page = await ctx.newPage(); page.on('pageerror', e => console.log('err:', String(e).slice(0, 200)));
  await page.goto('https://localhost:8443/build/doux/lab.html?v=' + Date.now()); await page.waitForTimeout(500);
  const clip = { x: 0, y: 0, width: 390, height: 346 }; const rips = [[434, 259, 1, 0], [434, 259, .55, .8]];
  const raw = async () => (await sharp(await page.screenshot({ clip })).removeAlpha().raw().toBuffer());
  const still = await raw(); let prev = still; const out = [];
  for (let i = 1; i <= 156; i++) { const t = i / 30; await page.evaluate(([t, r]) => window.lab(t, r), [t, rips]); const cur = await raw(); let dPrev = 0, dStill = 0, mx = 0; for (let k = 0; k < cur.length; k += 3) { const a = Math.abs(cur[k + 1] - prev[k + 1]); dPrev += a; if (a > mx) mx = a; dStill += Math.abs(cur[k + 1] - still[k + 1]); } const n = cur.length / 3; out.push([t, dPrev / n, dStill / n, mx]); prev = cur; }
  console.log('t(s)  écart à la photo  changement par image  (échelle 0-255, moyenne sur l’image)');
  for (const o of out.filter((_, i) => i % 6 === 5)) console.log(o[0].toFixed(1).padStart(4), o[2].toFixed(2).padStart(8), '#'.repeat(Math.round(o[2] * 6)).padEnd(34), o[1].toFixed(3).padStart(7), '*'.repeat(Math.round(o[1] * 60)));
  const pk = out.reduce((a, o) => o[1] > a[1] ? o : a); console.log('changement le plus fort entre deux images : ' + pk[1].toFixed(3) + ' à ' + pk[0].toFixed(2) + ' s ; dernière image, écart à la photo : ' + out[out.length - 1][2].toFixed(3));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
