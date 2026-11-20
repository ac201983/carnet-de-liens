// Film de présentation, de 76 à 88 s : quelques semaines plus tard, le père ouvre le parcours pour lui. L'étape 7 en plus court, « Me calmer, puis lâcher prise » :
// le schéma de la vague, « Poser les mains à plat », « Garder ce geste dans mon carnet ». La vraie version d'essai, image par image.
// node cap_etape7.js → cap/vague/ (le schéma, animé), cap/geste/ (le choix), cap/carnet/ (la page gardée)
const { ouvrir, Prise, rect, rectTexte, PAS, APP, fs } = require('./lib.js');
(async () => {
  const { b, ctx, p, errs } = await ouvrir({ haut: 1500, date: '2026-12-09T20:20:00+01:00', etat: 'cap/etat-pere.json' });
  await p.goto(APP + '#apercu', { waitUntil: 'load' }); await p.addStyleTag({ content: '.film-cmd{visibility:hidden!important}' });
  await p.waitForSelector('main [data-act="schnext"]'); await p.waitForTimeout(2600);
  const T = s => rectTexte(p, s, 'body');
  let P = new Prise(p, 'cap/vague'); await P.tenir(); await P.laisse(600); await p.evaluate(() => window.scrollTo(0, 0)); await P.laisse(200);
  const sch = async () => ({ carte: await p.evaluate(() => { const e = document.querySelector('[data-act="schnext"]'); let x = e; while (x && !/sch|schema/.test(x.className || '')) x = x.parentElement; x = x || e.parentElement.parentElement; const r = x.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, c: x.className }; }), suite: await rect(p, '[data-act="schnext"]'), svg: await p.evaluate(() => { const e = document.querySelector('[data-act="schnext"]'); let x = e; while (x && !x.querySelector('svg.sch, .sch svg, svg')) x = x.parentElement; const s = x && (x.querySelector('svg.sch') || x.querySelector('.sch svg') || [...x.querySelectorAll('svg')].sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0]); if (!s) return null; const r = s.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }), compte: (await T('^[1-5] sur 5$') || {}).t });
  const s0 = await sch(); await P.images(6); const etats = [s0];
  for (let k = 0; k < 2; k++) { const s = await sch(); P.marque('suite' + (k + 1)); await p.touchscreen.tap(s.suite.x + s.suite.w * .5, s.suite.y + s.suite.h * .5); await P.images(48); etats.push(await sch()); }
  P.fin({ vue: await p.evaluate(() => [(document.querySelector('main') || {}).className, document.documentElement.className]), etats, sur: await T('^Une vraie étape du parcours'), titre: await T('^Me calmer, puis lâcher prise$'), sous: await T('^Voici l’étape 7 du parcours'), schema: await T('^Le schéma$'), choisir: await rect(p, '[data-act="ap"]'), barre: await rect(p, 'header.bar') || await rect(p, '.hbar') });
  // « Choisir mon geste »
  await p.evaluate(() => document.querySelector('[data-act="ap"]').scrollIntoView({ block: 'center' })); await P.laisse(300);
  const c = await rect(p, '[data-act="ap"]'); await p.touchscreen.tap(c.x + c.w * .5, c.y + c.h * .5); await P.laisse(1800);
  if (!(await p.$('[data-act="ap-g"]'))) throw new Error('l’écran « Mon geste » ne s’est pas ouvert');
  await p.setViewportSize({ width: 390, height: 1500 }); await P.laisse(400); await p.evaluate(() => window.scrollTo(0, 0)); await P.laisse(300);
  P = new Prise(p, 'cap/geste');
  const G = async () => ({ titre: await T('^Votre geste, quand la vague monte$'), sur: await T('^Essai du parcours, étape 7$'), vecu: await T('^Ce que j’ai vécu$'), consigne: await T('^Choisissez un seul geste'), gestes: await p.evaluate(() => [...document.querySelectorAll('[data-act="ap-g"]')].map(e => { const r = e.getBoundingClientRect(); return { v: e.getAttribute('data-v'), x: r.left, y: r.top, w: r.width, h: r.height, t: e.innerText.trim(), on: e.getAttribute('aria-pressed') || e.getAttribute('aria-checked') || e.className }; })), question: await T('^Quel geste vous calme le mieux'), mot: await rect(p, '#ap-mot'), garder: await rect(p, '[data-act="ap-garde"]'), reste: await T('^Votre geste reste sur votre appareil') });
  const g0 = await G(); await P.images(3);
  const m = g0.gestes.find(x => /Poser les mains à plat/.test(x.t)); if (!m) throw new Error('geste introuvable ' + JSON.stringify(g0.gestes)); P.marque('toucher'); await p.touchscreen.tap(m.x + m.w * .7, m.y + m.h * .5); await P.images(16);
  const g1 = await G(); await p.evaluate(() => document.querySelector('[data-act="ap-garde"]').scrollIntoView({ block: 'nearest' })); await P.laisse(200); const g2 = await G(); P.marque('garder'); await p.touchscreen.tap(g2.garder.x + g2.garder.w * .6, g2.garder.y + g2.garder.h * .5); await P.images(3);
  P.fin({ avant: g0, apres: g1, valeur: await p.evaluate(() => (document.getElementById('ap-mot') || {}).value) });
  await P.laisse(1800); await p.evaluate(() => window.scrollTo(0, 0)); await P.laisse(300);
  P = new Prise(p, 'cap/carnet'); await P.images(2);
  P.fin({ vue: await p.evaluate(() => (document.querySelector('main') || {}).className), titre: await T('^C’est gardé dans votre carnet$'), sur: await T('^Essai du parcours, étape 7$'), carnet: await T('^Mon carnet de route, étape 7$'), question: await T('^Quel geste vous calme le mieux'), geste: await T('^Poser les mains à plat'), date: await T('^Écrit le'), retrouve: await T('^Vous retrouvez cette page'), semaine: await rect(p, '[data-act="ap"]'),
    carte: await p.evaluate(() => { const e = [...document.querySelectorAll('body *')].find(e => /^Mon carnet de route, étape 7$/.test(e.textContent.trim())); const x = e.parentElement; const r = x.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, c: x.className }; }) });
  console.log('erreurs', errs.length, errs.slice(0, 3)); console.log(JSON.stringify({ etats, g: g1.gestes, carnet: P.j }));
  await b.close();
})();
