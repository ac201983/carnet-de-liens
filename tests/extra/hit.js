// Pendant l'onde : qui reçoit le toucher ?
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true });
  await ctx.addInitScript(() => { try { localStorage.setItem('pepe-consent', JSON.stringify({ v: 1, audience: false, date: '2026-11-16' })); } catch (e) { } });
  const page = await ctx.newPage();
  const U = 'https://localhost:8443/carnet-de-liens/parent-ecoute/';
  await page.goto(U); await page.waitForTimeout(700);
  await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(900); await page.fill('#ob-me', 'Antonio'); await page.click(A('ob-done')); await page.waitForTimeout(2500);
  await page.evaluate(() => { window.__log = []; const d = n => n && n.nodeType === 1 ? (n.tagName + (n.id ? '#' + n.id : '') + (n.className && n.className.baseVal === undefined ? '.' + String(n.className).split(' ').join('.') : '') + (n.dataset && n.dataset.view ? '[' + n.dataset.view + ']' : '')) : String(n);
    ['pointerdown', 'pointerup', 'click'].forEach(t => document.addEventListener(t, e => window.__log.push(t + '>' + d(e.target) + ' vt=' + document.documentElement.matches(':active-view-transition')), true)); });
  const pos = async sel => { const el = await page.waitForSelector(sel); const bx = await el.boundingBox(); return [bx.x + bx.width / 2, bx.y + bx.height / 2]; };
  const p1 = await pos('.tab' + A('go', '[data-view="kit"]')), p2 = await pos('.tab' + A('go', '[data-view="parcours"]'));
  await page.mouse.move(p1[0], p1[1]); await page.mouse.down(); await page.mouse.up();
  await page.waitForTimeout(600);
  const efp = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? e.tagName + '.' + e.className : 'null'; }, p2);
  await page.mouse.move(p2[0], p2[1]); await page.mouse.down(); await page.mouse.up();
  await page.waitForTimeout(2200);
  const out = await page.evaluate(() => ({ log: window.__log, h: (document.querySelector('main.view h1') || {}).textContent }));
  console.log(JSON.stringify({ efp, out }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
