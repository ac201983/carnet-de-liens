const { chromium } = require('playwright'); const fs = require('fs');
const axeSrc = fs.readFileSync('/home/claude/tools/node_modules/axe-core/axe.min.js', 'utf8');
const APP = 'https://localhost:8443/carnet-de-liens/parent-ecoute/';
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' }); const page = await ctx.newPage();
  const why = async n => { await page.evaluate(axeSrc); const r = await page.evaluate(async () => { const r = await axe.run(document, { runOnly: ['color-contrast'], resultTypes: ['incomplete', 'violations', 'passes'] }); const k = {}; for (const x of r.incomplete) for (const nd of x.nodes) for (const c of nd.any) { const m = (c.data && c.data.messageKey) || '?'; k[m] = (k[m] || 0) + 1; } return { k, pass: r.passes.reduce((a, x) => a + x.nodes.length, 0), viol: r.violations.reduce((a, x) => a + x.nodes.length, 0) }; }); console.log(n, JSON.stringify(r)); };
  await page.goto(APP); await page.waitForTimeout(200); await why('accueil+bandeau');
  await page.click('#consent [data-consent="no"]'); await why('accueil');
  await page.click('.herofull [data-act="onboard"]'); await page.click('[data-act="ob-done"]'); await page.waitForTimeout(100); await why('aujourdhui');
  await page.click('.tab[data-view="parcours"]'); await why('parcours');
  await page.goto(APP + 'confidentialite.html'); await page.waitForTimeout(100); await why('confidentialite');
  console.log(await page.evaluate(() => { const cs = getComputedStyle(document.body); return cs.backgroundImage.slice(0, 200) + ' | ' + cs.backgroundColor; }));
  await b.close();
})();
