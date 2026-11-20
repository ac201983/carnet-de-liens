// Le grand mot de « Souffler », rendu par le navigateur comme dans l'application (390 points de large, 5 points par pixel, fond transparent).
// node titres/mot.js  →  titres/mot-inspirez.png, titres/mot-expirez.png, titres/mot.json (la place du mot dans l'image)
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const DSF = 5;
  const ctx = await b.newContext({ viewport: { width: 390, height: 140 }, deviceScaleFactor: DSF, isMobile: true, hasTouch: true, locale: 'fr-CH' }); const p = await ctx.newPage(); const rep = { dsf: DSF };
  for (const mot of ['Inspirez', 'Expirez']) {
    await p.goto('file://' + __dirname + '/mot.html?mot=' + mot); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    const r = await p.$eval('#mot', e => { const q = e.getBoundingClientRect(); const s = getComputedStyle(e); return { x: q.left, y: q.top, w: q.width, h: q.height, taille: s.fontSize, police: s.fontFamily, graisse: s.fontWeight }; });
    const ok = await p.evaluate(() => document.fonts.check('500 44px Newsreader'));
    rep[mot] = Object.assign(r, { police_chargee: ok });
    await p.screenshot({ path: __dirname + '/mot-' + mot.toLowerCase() + '.png', omitBackground: true });
  }
  fs.writeFileSync(__dirname + '/mot.json', JSON.stringify(rep, null, 1)); console.log(JSON.stringify(rep));
  await b.close();
})();
