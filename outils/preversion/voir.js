// Regarder un écran pendant le travail. usage : node voir.js <origine+base> <largeur> <hauteur> <dossier> '<scénario JSON>' [interne]
// Le scénario est une suite de pas : ["goto","chemin"], ["shot","nom"], ["plein","nom"] (page entière), ["click","sélecteur"],
// ["fill","sélecteur","texte"], ["type","texte"], ["press","touche"], ["wait",ms], ["eval","js"], ["dit","js"] (affiche le résultat).
const { chromium } = require('playwright'); const fs = require('fs');
const [URL0, W, H, OUT, SC, INT] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: 2, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: String(INT || '').includes('mouvement') ? 'no-preference' : 'reduce', hasTouch: +W < 700, isMobile: +W < 700 });
  const OPT = String(INT || '').split(',');
  if (OPT.includes('interne')) await ctx.addInitScript(() => { try { sessionStorage.setItem('pepe-interne', '1'); } catch (e) {} });
  if (OPT.includes('soir')) await ctx.addInitScript(() => { Date.prototype.getHours = function () { return 20; }; });
  const page = await ctx.newPage(); const err = [];
  page.on('pageerror', e => err.push('ERREUR ' + e.message)); page.on('console', m => { if (m.type() === 'error') err.push('console ' + m.text()); });
  for (const p of JSON.parse(SC)) {
    const [k, a, c] = p;
    try {
      if (k === 'goto') { await page.goto(URL0.replace(/\/$/, '') + a, { waitUntil: 'load' }); await page.waitForTimeout(700); }
      else if (k === 'shot') await page.screenshot({ path: `${OUT}/${a}.png` });
      else if (k === 'plein') await page.screenshot({ path: `${OUT}/${a}.png`, fullPage: true });
      else if (k === 'click') { await page.locator(a).first().click({ timeout: 5000 }); await page.waitForTimeout(450); }
      else if (k === 'fill') { await page.locator(a).first().fill(c, { timeout: 5000 }); await page.waitForTimeout(200); }
      else if (k === 'type') { await page.keyboard.type(a, { delay: 5 }); await page.waitForTimeout(200); }
      else if (k === 'press') { await page.keyboard.press(a); await page.waitForTimeout(250); }
      else if (k === 'wait') await page.waitForTimeout(a);
      else if (k === 'eval') await page.evaluate(a);
      else if (k === 'dit') console.log(JSON.stringify(await page.evaluate(a)));
    } catch (e) { console.log('PAS RATÉ', JSON.stringify(p), String(e.message).split('\n')[0]); }
  }
  if (err.length) console.log(err.slice(0, 8).join('\n'));
  await b.close();
})().catch(e => { console.error('CRASH', e); process.exit(2); });
