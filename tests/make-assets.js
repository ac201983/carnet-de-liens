// Fabrique favicon.ico (16/32/48) à partir du SVG et l'image d'aperçu 1200x630 pour les réseaux sociaux.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const SRC = '/home/claude/site-src';
(async () => {
  const b = await chromium.launch();
  // --- favicon : rendu du SVG aux trois tailles
  const svg = fs.readFileSync(SRC + '/favicon.svg', 'utf8');
  for (const s of [16, 32, 48, 180]) {
    const p = await b.newPage({ viewport: { width: s, height: s }, deviceScaleFactor: 1 });
    await p.setContent('<html><body style="margin:0;background:transparent">' + svg.replace('<svg ', '<svg width="' + s + '" height="' + s + '" style="display:block" ') + '</body></html>');
    await p.screenshot({ path: '/home/claude/build/fav-' + s + '.png', omitBackground: true });
    await p.close();
  }
  // --- aperçu social
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto('file://' + SRC + '/og.html');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: '/home/claude/build/og.png' });
  await b.close();
})();
