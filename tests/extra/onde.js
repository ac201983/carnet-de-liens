// L'onde de lumière au changement d'onglet, image par image (navigateur ordinaire, sans eau).
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
const tag = process.argv[2] || 'on';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true });
  await ctx.addInitScript(() => { try { localStorage.setItem('pepe-consent', JSON.stringify({ v: 1, audience: false, date: '2026-11-16' })); } catch (e) { } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  const U = 'https://localhost:8443/carnet-de-liens/parent-ecoute/'; const D = '/home/claude/build/doux/';
  await page.goto(U); await page.waitForTimeout(700);
  await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(900); await page.fill('#ob-me', 'Antonio'); await page.click(A('ob-done')); await page.waitForTimeout(2500);
  const seq = async (sel, name, marks) => { const el = await page.waitForSelector(sel); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(200); const bx = await el.boundingBox(); await page.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await page.mouse.down(); await page.mouse.up(); const t0 = Date.now(); const real = []; for (const m of marks) { const d = m - (Date.now() - t0); if (d > 0) await page.waitForTimeout(d); real.push(Date.now() - t0); await page.screenshot({ path: D + tag + '-' + name + '-' + String(m).padStart(4, '0') + '.png' }); } console.log(name, 'instants réels :', real.join(' ')); await page.waitForTimeout(1500); };
  const M = [100, 250, 400, 550, 700, 850, 1000, 1300];
  await seq('.tab' + A('go', '[data-view="kit"]'), 'outils', M);
  await seq('.tab' + A('go', '[data-view="parcours"]'), 'parcours', M);
  await seq(A('step', '[data-i="0"]'), 'etape', M);
  await seq(A('back'), 'retour', M);
  const st = await page.evaluate(() => ({ html: document.documentElement.className, onde: getComputedStyle(document.getElementById('onde') || document.body).display, vt: document.querySelector(':root').matches(':active-view-transition') }));
  console.log(JSON.stringify({ st, errs }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
