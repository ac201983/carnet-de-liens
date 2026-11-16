// Deux onglets touchés coup sur coup : la deuxième onde doit garder son anneau (bord fondu + liseré) jusqu'au bout.
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
const gap = Number(process.argv[2] || 1000);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true });
  await ctx.addInitScript(() => { try { localStorage.setItem('pepe-consent', JSON.stringify({ v: 1, audience: false, date: '2026-11-16' })); } catch (e) { } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  const U = 'https://localhost:8443/carnet-de-liens/parent-ecoute/'; const D = '/home/claude/build/doux/';
  await page.goto(U); await page.waitForTimeout(700);
  await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(900); await page.fill('#ob-me', 'Antonio'); await page.click(A('ob-done')); await page.waitForTimeout(2500);
  const tap = async sel => { const el = await page.waitForSelector(sel); const bx = await el.boundingBox(); await page.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await page.mouse.down(); await page.mouse.up(); };
  const etat = () => page.evaluate(() => { const i = document.querySelector('#onde i'); const an = i && i.getAnimations ? i.getAnimations()[0] : null; return { cls: document.documentElement.className, disp: i ? getComputedStyle(i.parentNode).display : '-', op: i ? getComputedStyle(i).opacity : '-', t: an ? Math.round(an.currentTime) : -1, h: (document.querySelector('main.view h1') || {}).textContent }; });
  await tap('.tab' + A('go', '[data-view="kit"]'));
  await page.waitForTimeout(gap);
  await tap('.tab' + A('go', '[data-view="parcours"]')); const t0 = Date.now();
  const out = [];
  for (const m of [150, 350, 550, 800]) { const d = m - (Date.now() - t0); if (d > 0) await page.waitForTimeout(d); const e = await etat(); e.at = Date.now() - t0; out.push(e); await page.screenshot({ path: D + 'dbl' + gap + '-' + String(m).padStart(4, '0') + '.png' }); }
  await page.waitForTimeout(1500); const fin = await etat();
  console.log(JSON.stringify({ gap, out, fin, errs }, null, 0));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
