// L'onde de lumière sur grand écran, image par image (navigateur ordinaire, sans eau).
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
const [W, H, tag] = [Number(process.argv[2] || 1280), Number(process.argv[3] || 800), process.argv[4] || 'ordi'];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference' });
  await ctx.addInitScript(() => { try { localStorage.setItem('pepe-consent', JSON.stringify({ v: 1, audience: false, date: '2026-11-16' })); } catch (e) { } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  const U = 'https://localhost:8443/carnet-de-liens/parent-ecoute/'; const D = '/home/claude/build/ordi/onde/'; require('fs').mkdirSync(D, { recursive: true });
  await page.goto(U); await page.waitForTimeout(900);
  const seq = async (sel, name, marks) => { const el = await page.waitForSelector(sel); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(200); const bx = await el.boundingBox(); await page.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await page.mouse.down(); await page.mouse.up(); const t0 = Date.now(); for (const m of marks) { const d = m - (Date.now() - t0); if (d > 0) await page.waitForTimeout(d); await page.screenshot({ path: D + tag + '-' + name + '-' + String(m).padStart(4, '0') + '.png' }); } await page.waitForTimeout(1500); };
  await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(900); await page.fill('#ob-me', 'Antonio');
  await seq(A('ob-done'), 'entree', [150, 400, 700, 1000]);
  await page.waitForTimeout(1500);
  const M = [120, 280, 440, 600, 800, 1000, 1300];
  await seq('.tab' + A('go', '[data-view="kit"]'), 'outils', M);
  await seq('.sits .sit', 'situation', M);
  await seq(A('back'), 'retour', M);
  console.log(JSON.stringify({ errs, cls: await page.evaluate(() => document.documentElement.className) }));
  await b.close();
})().catch(e => { console.error(String(e).slice(0, 500)); process.exit(1); });
