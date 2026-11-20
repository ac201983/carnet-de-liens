// Film de présentation, de 58 à 71 s : la fiche d'exemple « Le relais de Bastien », telle que le site la montre (« Voici ce que reçoit la personne qui prend le relais »).
// node cap_relais.js → cap/relais/
const { ouvrir, Prise, rect, rectTexte, PAS, APP, fs } = require('./lib.js');
(async () => {
  const { b, ctx, p, errs } = await ouvrir({ haut: 1100, date: '2026-11-20T10:05:00+01:00' });
  await p.goto(APP, { waitUntil: 'load' }); await p.addStyleTag({ content: '.film-cmd{visibility:hidden!important}' });
  await p.waitForSelector('[data-act="rl"][data-k="exemple"]'); await p.waitForTimeout(2600);
  let P = new Prise(p, 'cap/relais'); await P.tenir();
  await p.evaluate(() => document.querySelector('.fb-voir').scrollIntoView({ block: 'center' })); await P.laisse(300);
  const bt = await rect(p, '.fb-voir'); await p.touchscreen.tap(bt.x + bt.w * .5, bt.y + bt.h * .5); await P.laisse(1800);
  await p.setViewportSize({ width: 390, height: 1600 }); await P.laisse(400);
  const t = await rectTexte(p, '^Le relais de Bastien$', 'body');
  const y0 = await p.evaluate(y => { window.scrollTo(0, Math.max(0, Math.round(window.scrollY + y - 110))); return window.scrollY; }, t.y); await P.laisse(500);
  await P.images(2);
  const T = s => rectTexte(p, s, 'body');
  P.fin({ defile: y0, vue: await p.evaluate(() => [(document.querySelector('main') || {}).className, document.documentElement.className]),
    titre: await T('^Le relais de Bastien$'), pour: await T('^Pour son oncle Rémi'), trois: await T('^Si tu ne lis que trois choses$'), un: await T('^Bastien a besoin de savoir ce qui vient après'), deux: await T('^Quand il se balance'), trois3: await T('^C’est un adulte'),
    moi: await T('^Ce que je souhaite dire moi-même$'), cafe: await T('^J’aime prendre mon café seul'), parle: await T('^Je n’aime pas qu’on parle de moi'), habits: await T('^Je choisis mes habits'), signe: await T('^Bastien$'), aide: await T('^Ce qui aide Bastien$'),
    squelette: await p.evaluate(() => { const e = [...document.querySelectorAll('body *')].find(e => /^Ce que je souhaite dire moi-même$/.test(e.textContent.trim())); const out = []; let x = e; for (let k = 0; k < 5 && x; k++) { const r = x.getBoundingClientRect(); out.push([x.tagName, x.className, Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]); x = x.parentElement; } return out; }),
    squelette3: await p.evaluate(() => { const e = [...document.querySelectorAll('body *')].find(e => /^Si tu ne lis que trois choses$/.test(e.textContent.trim())); const out = []; let x = e; for (let k = 0; k < 5 && x; k++) { const r = x.getBoundingClientRect(); out.push([x.tagName, x.className, Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]); x = x.parentElement; } return out; }) });
  console.log('erreurs', errs.length, errs.slice(0, 3)); console.log(JSON.stringify(P.j));
  await b.close();
})();
