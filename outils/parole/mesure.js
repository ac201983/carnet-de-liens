// Mesures sur un petit téléphone (390 × 664) : les 3 gestes de l'accueil tiennent-ils sans défiler ? la zone d'écriture et son bouton aussi ?
const { chromium } = require('playwright');
(async () => {
  const [port, base] = process.argv.slice(2);
  const b = await chromium.launch(); const A = (a, x) => '[data-act="' + a + '"]' + (x || '');
  for (const heure of [8, 14, 20, 23]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 664 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true });
    await ctx.addInitScript(hh => { Date.prototype.getHours = function () { return hh; }; }, heure);
    const p = await ctx.newPage(); await p.goto('https://localhost:' + port + base); await p.waitForSelector('.seuil .porte'); await p.waitForTimeout(700);
    const acc = await p.evaluate(() => { const L = [...document.querySelectorAll('.seuil .porte')].map(e => Math.round(e.getBoundingClientRect().bottom)); return { h: innerHeight, portes: L, q: Math.round(document.querySelector('.besoin-l').getBoundingClientRect().height), h1: Math.round(document.querySelector('.seuil h1').getBoundingClientRect().height), t3: document.querySelector('.seuil .porte[data-v="piste"] b').textContent }; });
    await p.click(A('porte', '[data-v="deposer"]')); await p.waitForSelector('main.deposer #draft'); await p.waitForTimeout(2400);
    const dep = await p.evaluate(() => { const r = s => { const e = document.querySelector(s); if (!e) return null; const x = e.getBoundingClientRect(); return [Math.round(x.top), Math.round(x.bottom)]; }; return { barre: r('header.bar'), q: r('.dep-q'), sub: r('.dep-tete .sub'), note: r('.qui-lit'), draft: r('#draft'), dsend: r('[data-act="dsend"]'), ddire: r('[data-act="ddire"]'), tabs: r('.tabs') }; });
    console.log(heure + ' h', JSON.stringify(acc), '\n   dépôt', JSON.stringify(dep));
    await ctx.close();
  }
  await b.close();
})();
