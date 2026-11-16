// Ce que voit un parent déjà inscrit quand il rouvre le site : « Aujourd'hui », animations activées.
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
const tag = process.argv[2] || 'ret';
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; try { localStorage.setItem('pepe-consent', JSON.stringify({ v: 1, audience: false, date: '2026-11-16' })); } catch (e) { } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  const U = 'https://localhost:8443/carnet-de-liens/parent-ecoute/';
  await page.goto(U); await page.waitForTimeout(700);
  await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(700); await page.fill('#ob-me', 'Antonio'); await page.click(A('ob-done')); await page.waitForTimeout(1200);
  // il revient plus tard
  await page.goto(U, { waitUntil: 'commit' }); const t0 = Date.now();
  await page.waitForSelector('.band h1');
  const D = '/home/claude/build/doux/';
  for (const m of [250, 600, 1000, 1600, 2400, 3400, 5200]) { const d = m - (Date.now() - t0); if (d > 0) await page.waitForTimeout(d); await page.screenshot({ path: D + tag + '-' + String(m).padStart(4, '0') + '.png', clip: { x: 0, y: 0, width: 390, height: 700 } }); }
  const st = await page.evaluate(() => ({ html: document.documentElement.className, app: document.getElementById('app').className, eau: !!document.querySelector('canvas.eau'), h1: document.querySelector('h1').textContent }));
  console.log(JSON.stringify({ st, errs }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
