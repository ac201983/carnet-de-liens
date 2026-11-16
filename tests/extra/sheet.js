const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true });
  await ctx.addInitScript(() => { try { localStorage.setItem('pepe-consent', JSON.stringify({ v: 1, audience: false, date: '2026-11-16' })); } catch (e) { } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  await page.goto('https://localhost:8443/carnet-de-liens/parent-ecoute/'); await page.waitForTimeout(600);
  if (await page.$('#consent [data-consent="no"]')) await page.click('#consent [data-consent="no"]');
  await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(700); await page.click(A('ob-done')); await page.waitForTimeout(900);
  await page.click('.tab' + A('go', '[data-view="parcours"]')); await page.waitForTimeout(900);
  const locks = await page.$$eval('[data-act="upgrade"]', e => e.length); console.log('éléments qui ouvrent la feuille des formules :', locks);
  const el = await page.$('[data-act="upgrade"]'); await el.scrollIntoViewIfNeeded(); await el.click(); await page.waitForSelector('.sheet', { timeout: 3000 }); await page.waitForTimeout(250);
  const mid = await page.$eval('.sheet', e => getComputedStyle(e).opacity); await page.waitForTimeout(600);
  const open = await page.$eval('.sheet', e => ({ op: getComputedStyle(e).opacity, tr: getComputedStyle(e).transform }));
  await page.click('.sheet ' + A('sheet-close')); await page.waitForTimeout(200);
  const during = await page.evaluate(() => ({ vt: document.querySelector(':root').matches(':active-view-transition'), sheet: !!document.querySelector('.sheet') }));
  await page.waitForTimeout(700);
  const after = await page.evaluate(() => ({ vt: document.querySelector(':root').matches(':active-view-transition'), sheet: !!document.querySelector('.sheet'), h1: document.querySelector('h1').textContent }));
  // Échap ferme aussi la feuille
  await (await page.$('[data-act="upgrade"]')).click(); await page.waitForSelector('.sheet'); await page.waitForTimeout(600); await page.keyboard.press('Escape'); await page.waitForTimeout(900);
  const esc = await page.evaluate(() => !!document.querySelector('.sheet'));
  console.log(JSON.stringify({ ouverture250ms: mid, ouverte: open, pendantFermeture: during, apres: after, apresEchap: esc, errs }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
