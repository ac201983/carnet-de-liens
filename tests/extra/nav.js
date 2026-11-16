// Un changement d'onglet et l'ouverture d'une étape, image par image, à partir du toucher.
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
const tag = process.argv[2] || 'nav';
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; try { localStorage.setItem('pepe-consent', JSON.stringify({ v: 1, audience: false, date: '2026-11-16' })); } catch (e) { } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  const U = 'https://localhost:8443/carnet-de-liens/parent-ecoute/'; const D = '/home/claude/build/doux/';
  await page.goto(U); await page.waitForTimeout(700);
  await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(900); await page.fill('#ob-me', 'Antonio');
  const seq = async (sel, name, marks) => { const el = await page.waitForSelector(sel); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(200); const bx = await el.boundingBox(); await page.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await page.mouse.down(); await page.mouse.up(); const t0 = Date.now(); const real = []; for (const m of marks) { const d = m - (Date.now() - t0); if (d > 0) await page.waitForTimeout(d); real.push(Date.now() - t0); await page.screenshot({ path: D + tag + '-' + name + '-' + String(m).padStart(4, '0') + '.png' }); } console.log(name, 'instants réels :', real.join(' ')); await page.waitForTimeout(1500); };
  await seq(A('ob-done'), 'entree', [120, 320, 520, 760, 1050, 1500, 2400, 3600]);
  await seq('.tab' + A('go', '[data-view="kit"]'), 'outils', [120, 300, 480, 700, 1000, 1500]);
  await seq('.tab' + A('go', '[data-view="parcours"]'), 'parcours', [120, 300, 480, 700, 1000, 1500]);
  console.log(JSON.stringify({ errs }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
