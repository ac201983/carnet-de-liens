// Les états de « Souffler » sans le dessin de l'eau : 2 cercles de secours, mouvement réduit, pause.
const { chromium } = require('playwright');
(async () => {
  const [port, base] = process.argv.slice(2); const D = '/home/claude/build/goutte/shots/';
  const b = await chromium.launch();
  for (const [nom, opt] of [['secours', {}], ['reduit', { reducedMotion: 'reduce' }]]) {
    const ctx = await b.newContext(Object.assign({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true, locale: 'fr-CH' }, opt));
    await ctx.addInitScript(() => { Date.prototype.getHours = function () { return 21; }; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
    await p.goto('https://localhost:' + port + base); await p.waitForSelector('.seuil .porte'); await p.waitForTimeout(600);
    await p.click('[data-act="porte"][data-v="souffle"]'); await p.waitForSelector('main.souffle.s-cours'); await p.waitForTimeout(1400 + 3600);
    await p.screenshot({ path: D + 'etat-' + nom + '-inspire.png' });
    await p.waitForTimeout(3200); await p.screenshot({ path: D + 'etat-' + nom + '-expire.png' });
    const avant = await p.evaluate(() => ({ mot: document.getElementById('souffle-mot').textContent, s: getComputedStyle(document.querySelector('.souffle .ronds')).getPropertyValue('--s'), cv: !!document.querySelector('.etang canvas.eau') }));
    await p.click('[data-act="souffle-pause"]'); await p.waitForTimeout(400);
    const pz1 = await p.evaluate(() => ({ mot: document.getElementById('souffle-mot').textContent, aide: document.getElementById('souffle-aide').textContent, btn: [...document.querySelectorAll('.souffle .actions button')].map(x => x.textContent.trim()), tours: document.querySelectorAll('.souffle .tours i.f, .souffle .tours i.c').length }));
    await p.screenshot({ path: D + 'etat-' + nom + '-pause.png' });
    await p.waitForTimeout(3000);
    const pz2 = await p.evaluate(() => ({ mot: document.getElementById('souffle-mot').textContent, s: getComputedStyle(document.querySelector('.souffle .ronds')).getPropertyValue('--s') }));
    await p.click('[data-act="souffle-pause"]'); await p.waitForTimeout(700);
    const ap = await p.evaluate(() => ({ mot: document.getElementById('souffle-mot').textContent, btn: [...document.querySelectorAll('.souffle .actions button')].map(x => x.textContent.trim()) }));
    console.log(nom, JSON.stringify({ avant, pz1, pz2, ap }), errs.length ? 'ERREURS ' + errs.join(' | ') : '');
    await ctx.close();
  }
  await b.close();
})();
