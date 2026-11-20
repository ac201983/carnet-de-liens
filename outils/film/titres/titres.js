// Les textes du film et le carton final, rendus par le navigateur avec les polices du site (Besley et Nunito), sur fond transparent.
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  for (const f of ['H', 'V']) {
    const ctx = await b.newContext({ viewport: f === 'H' ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 }, deviceScaleFactor: 1 }); const p = await ctx.newPage();
    for (const q of ['et-vous', 'inspirez', 'expirez', 'ici', 'carte-fond', 'carte-logo', 'carte-nom', 'carte-url']) {
      await p.goto('file://' + __dirname + '/titres.html?quoi=' + q + '&f=' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(120);
      await p.screenshot({ path: __dirname + '/' + q + '-' + f + '.png', omitBackground: q !== 'carte-fond' });
    }
    await ctx.close();
  }
  await b.close(); console.log('titres faits');
})();
