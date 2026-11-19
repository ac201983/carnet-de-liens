// Captures diverses : petites largeurs, tablette, vitrine d'un parent déjà entré, feuille « Qui me répond ? » sur le papier.
const { chromium } = require('playwright');
(async () => {
  const port = process.argv[2] || 8445, base = process.argv[3] || '/'; const D = '/home/claude/build/carnet/shots/';
  const b = await chromium.launch();
  const ouvre = async (w, h, heure) => { const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 700 ? 2 : 1, ignoreHTTPSErrors: true, reducedMotion: 'reduce' }); await ctx.addInitScript(hh => { Date.prototype.getHours = function () { return hh; }; }, heure); const p = await ctx.newPage(); p.on('pageerror', e => console.log('pageerror', String(e).slice(0, 200))); await p.goto('https://localhost:' + port + base); await p.waitForSelector('.seuil .porte'); await p.waitForTimeout(500); return { ctx, p }; };
  { const { ctx, p } = await ouvre(320, 568, 10); await p.screenshot({ path: D + 'd-320.png', fullPage: false }); await p.evaluate(() => document.querySelector('.fiche-b').scrollIntoView({ block: 'center' })); await p.waitForTimeout(200); await p.screenshot({ path: D + 'd-320-fiche.png' }); console.log('320', await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth])); await ctx.close(); }
  { const { ctx, p } = await ouvre(768, 1024, 10); await p.screenshot({ path: D + 'd-768.png' }); console.log('768', await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth])); await ctx.close(); }
  { const { ctx, p } = await ouvre(390, 844, 10);
    // un geste (déposer), puis retour : la vitrine d'un parent déjà entré
    await p.click('.seuil [data-act="porte"][data-v="deposer"]'); await p.waitForTimeout(500); await p.screenshot({ path: D + 'd-deposer.png' });
    await p.click('[data-act="back"]'); await p.waitForTimeout(500); await p.evaluate(() => document.querySelector('.haut-suite').scrollIntoView({ block: 'center' })); await p.waitForTimeout(200); await p.screenshot({ path: D + 'd-membre.png' });
    // le focus au clavier sur la fiche et sur un geste
    await p.evaluate(() => scrollTo(0, 0)); await p.focus('.seuil .porte'); await p.keyboard.press('Tab'); await p.waitForTimeout(150); await p.screenshot({ path: D + 'd-focus-porte.png' });
    await p.focus('.fb-voir'); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(200); await p.screenshot({ path: D + 'd-focus-fiche.png' });
    await ctx.close(); }
  await b.close();
})();
