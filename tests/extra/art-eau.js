// la version Claude (un seul fichier, photo incluse dans la page) : l'eau bouge-t-elle aussi, et tout se parcourt-il sans erreur ?
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('https://localhost:8443/pepe.html'); await page.waitForTimeout(1500);
  const a = await page.evaluate(() => ({ cls: document.documentElement.className, eau: (() => { const c = document.querySelector('.herofull>canvas.eau'); return c ? c.width + 'x' + c.height : 'aucun'; })(), lum: document.getElementById('app').className }));
  await page.waitForTimeout(5200); const calm = await page.evaluate(() => !!document.querySelector('canvas.eau'));
  await page.click(A('peek-about')); await page.waitForTimeout(1600);
  const h = await page.evaluate(() => ({ h1: document.querySelector('h1').textContent.slice(0, 28), eau: !!document.querySelector('.band.story>canvas.eau') }));
  await page.click(A('back')); await page.waitForTimeout(900);
  await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(600); await page.click(A('ob-done')); await page.waitForTimeout(1500);
  await page.fill('#draft', 'Une journée difficile, je suis à bout.'); await page.click(A('dsend')); await page.waitForTimeout(2600);
  const end = await page.evaluate(() => ({ h1: document.querySelector('h1').textContent, mirror: !!document.querySelector('.mirror .q'), eau: !!document.querySelector('canvas.eau'), depots: JSON.parse(localStorage.getItem('pepe-v1')).depots.length, op: getComputedStyle(document.querySelector('.mirror')).opacity }));
  console.log(JSON.stringify({ a, calmeApres: !calm, h, end, errs: errs.filter(e => !/ERR_FAILED|net::/.test(e)) }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
