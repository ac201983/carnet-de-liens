// « Aujourd'hui » pour un parent déjà inscrit, vu de près : la lumière, l'eau du bandeau, la lueur sur la dose.
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; try { localStorage.setItem('pepe-consent', JSON.stringify({ v: 1, audience: false, date: '2026-11-16' })); } catch (e) { } });
  const page = await ctx.newPage(); page.on('pageerror', e => console.log('err', String(e).slice(0, 200)));
  const U = 'https://localhost:8443/carnet-de-liens/parent-ecoute/';
  await page.goto(U); await page.waitForTimeout(700);
  await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(900); await page.fill('#ob-me', 'Antonio'); await page.click(A('ob-done')); await page.waitForTimeout(6500);
  await page.goto(U, { waitUntil: 'load' }); const t0 = Date.now(); const real = [];
  for (const m of [500, 1300, 2100, 2900, 3700, 6500]) { const d = m - (Date.now() - t0); if (d > 0) await page.waitForTimeout(d); real.push(Date.now() - t0); await page.screenshot({ path: '/home/claude/build/doux/auj2-' + String(m).padStart(4, '0') + '.png', clip: { x: 0, y: 0, width: 390, height: 560 } }); }
  console.log('instants réels', real.join(' '));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
