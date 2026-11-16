// Accessibilité (axe) sur tous les écrans, au format ordinateur. usage : node axe-ordi.js [largeur] [hauteur]
const { chromium } = require('playwright'); const fs = require('fs');
const { walk } = require('../walk');
const axeSrc = fs.readFileSync('/home/claude/tools/node_modules/axe-core/axe.min.js', 'utf8');
const [W, H] = [Number(process.argv[2] || 1280), Number(process.argv[3] || 800)];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage(); const by = {}; let n = 0;
  await walk(page, async name => { n++; await page.waitForTimeout(100); await page.evaluate(axeSrc); const r = await page.evaluate(async () => { const r = await axe.run(document, { resultTypes: ['violations'] }); return r.violations.map(x => ({ id: x.id, impact: x.impact, n: x.nodes.length, t: x.nodes.slice(0, 2).map(q => q.target.join(' ')).join(' | ') })); }); r.forEach(v => { (by[v.id] = by[v.id] || []).push(name + ' (' + v.n + ') ' + v.t.slice(0, 120)); }); });
  console.log('axe à ' + W + '×' + H + ' : ' + n + ' écrans, ' + Object.keys(by).length + ' règle(s) en défaut');
  Object.keys(by).forEach(k => console.log('  ' + k + ' : ' + by[k].slice(0, 4).join(' ; ')));
  await b.close();
})().catch(e => { console.error(String(e).slice(0, 500)); process.exit(1); });
