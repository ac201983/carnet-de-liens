// Captures de tous les écrans (pleine page) à une largeur donnée. usage : node shots.js [largeur] [hauteur]
const { chromium } = require('playwright'); const fs = require('fs');
const { walk } = require('./walk');
const W = parseInt(process.argv[2] || '390', 10), H = parseInt(process.argv[3] || '844', 10);
const OUT = '/home/claude/build/shots-' + W; fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage(); let n = 0;
  await walk(page, async name => { await page.screenshot({ path: `${OUT}/${String(++n).padStart(2, '0')}-${name}.png` }); });
  await b.close(); console.log(n + ' captures dans ' + OUT);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
