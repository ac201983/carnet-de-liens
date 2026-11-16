// « Aujourd'hui » et « Mon histoire » à plusieurs instants après l'arrivée (lumière, eau), et le bas de page pendant la lecture
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; try { localStorage.setItem('pepe-consent', JSON.stringify({ v: 1, audience: false, date: '2026-11-16' })); } catch (e) { } });
  const page = await ctx.newPage(); page.on('pageerror', e => console.log('err:', String(e).slice(0, 300))); page.on('console', m => { if (m.type() === 'error') console.log('console:', m.text().slice(0, 200)); });
  const D = '/home/claude/build/doux/';
  await page.goto('https://localhost:8443/carnet-de-liens/parent-ecoute/'); await page.waitForTimeout(700);
  if (await page.$('#consent [data-consent="no"]')) await page.click('#consent [data-consent="no"]');
  // Mon histoire
  await page.click(A('peek-about')); let t0 = Date.now();
  for (const m of [700, 1600, 2600, 3600, 6500]) { const d = m - (Date.now() - t0); if (d > 0) await page.waitForTimeout(d); await page.screenshot({ path: D + 'hist-' + String(m).padStart(4, '0') + '.png', clip: { x: 0, y: 0, width: 390, height: 420 } }); }
  console.log('histoire, calque à la fin :', await page.evaluate(() => !!document.querySelector('canvas.eau')));
  // lecture : défiler un peu et regarder le bas de l'écran
  await page.mouse.move(195, 600); for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(30); } await page.waitForTimeout(200);
  await page.screenshot({ path: D + 'lecture-1.png' }); for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(30); } await page.waitForTimeout(200); await page.screenshot({ path: D + 'lecture-2.png' });
  await page.click(A('back')); await page.waitForTimeout(900);
  // Aujourd'hui
  await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(700); await page.fill('#ob-me', 'Camille'); await page.click(A('ob-done')); t0 = Date.now();
  for (const m of [700, 2000, 3200, 5600]) { const d = m - (Date.now() - t0); if (d > 0) await page.waitForTimeout(d); await page.screenshot({ path: D + 'auj-' + String(m).padStart(4, '0') + '.png', clip: { x: 0, y: 0, width: 390, height: 420 } }); }
  // toucher la photo du bandeau : l'eau y bouge aussi
  await page.mouse.move(300, 150); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(1000);
  console.log('bandeau, calque après un appui :', await page.evaluate(() => { const c = document.querySelector('.band>canvas.eau'); return c ? c.width + 'x' + c.height : 'aucun'; }));
  await page.screenshot({ path: D + 'auj-touche.png', clip: { x: 0, y: 0, width: 390, height: 420 } });
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
