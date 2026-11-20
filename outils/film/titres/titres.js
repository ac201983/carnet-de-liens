// Les textes du film et le carton final, rendus par le navigateur avec les polices du site (Besley et Nunito), sur fond transparent.
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const rep = {};
  for (const f of ['H', 'V', 'I']) {
    const ctx = await b.newContext({ viewport: f === 'H' ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 }, deviceScaleFactor: 1 }); const p = await ctx.newPage();
    for (const q of (f === 'I' ? ['carte-fond', 'carte-logo', 'carte-nom', 'carte-phrase', 'carte-url'] : ['et-vous', 'inspirez', 'expirez', 'ici', 'carte-fond', 'carte-logo', 'carte-nom', 'carte-url'])) {
      await p.goto('file://' + __dirname + '/titres.html?quoi=' + q + '&f=' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(120);
      await p.screenshot({ path: __dirname + '/' + q + '-' + f + '.png', omitBackground: q !== 'carte-fond' });
      rep[q + '-' + f] = await p.evaluate(() => { const e = document.querySelector('.t, svg.logo'); if (!e) return null; const r = e.getBoundingClientRect(); return { x0: Math.round(r.left), y0: Math.round(r.top), x1: Math.round(r.right), y1: Math.round(r.bottom) }; });
    }
    await ctx.close();
  }
  fs.writeFileSync(__dirname + '/titres.json', JSON.stringify(rep, null, 1));
  await b.close(); console.log('titres faits', JSON.stringify(Object.fromEntries(Object.entries(rep).filter(([k]) => k.endsWith('-I')))));
})();
