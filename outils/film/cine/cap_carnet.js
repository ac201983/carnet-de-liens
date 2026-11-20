// Montage cinématographique : un autre soir, le père retrouve dans son carnet le geste choisi pendant le parcours (« Poser les mains à plat. »).
// On refait le chemin de l'étape 7 (comme dans pres/cap_etape7.js), puis on ouvre le vrai carnet. node cap_carnet.js → cap/carnet/
const { ouvrir, Prise, rect, rectTexte, PAS, APP, fs } = require('../pres/lib.js');
(async () => {
  const { b, ctx, p, errs } = await ouvrir({ haut: 1500, date: '2026-12-09T20:20:00+01:00', etat: '../pres/cap/etat-pere.json' });
  await p.goto(APP + '#apercu', { waitUntil: 'load' }); await p.addStyleTag({ content: '.film-cmd{visibility:hidden!important}' });
  await p.waitForSelector('main [data-act="schnext"]'); await p.waitForTimeout(2600);
  const T = s => rectTexte(p, s, 'body');
  const tape = async sel => { const e = p.locator(sel).first(); await e.scrollIntoViewIfNeeded(); await p.waitForTimeout(200); const r = await e.boundingBox(); await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(1800); };
  await tape('[data-act="ap"]');
  if (!(await p.$('[data-act="ap-g"]'))) throw new Error('l’écran « Mon geste » ne s’est pas ouvert');
  const g = await p.evaluate(() => [...document.querySelectorAll('[data-act="ap-g"]')].findIndex(e => /Poser les mains à plat/.test(e.innerText)));
  await tape('[data-act="ap-g"] >> nth=' + g); await tape('[data-act="ap-garde"]');
  console.log('gardé :', await p.evaluate(() => [(document.querySelector('main') || {}).className, [...document.querySelectorAll('main [data-act]')].map(e => e.getAttribute('data-act') + ':' + (e.getAttribute('data-k') || e.getAttribute('data-v') || '') + ':' + e.innerText.trim().slice(0, 26))]));
  // « Ouvrir mon carnet »
  const ouv = await p.evaluate(() => { const e = [...document.querySelectorAll('main button, main a')].find(e => /Ouvrir mon carnet/.test(e.innerText)); if (!e) return null; e.setAttribute('data-film', 'carnet'); return e.outerHTML.slice(0, 160); });
  console.log('bouton :', ouv); await tape('[data-film="carnet"]');
  // un autre soir : la date du film avance d'une semaine (le carnet date chaque ligne)
  await p.setViewportSize({ width: 390, height: 1100 }); await p.waitForTimeout(500); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
  const P = new Prise(p, 'cap/carnet'); await P.tenir(); await P.laisse(1800); await P.images(2);
  P.fin({ vue: await p.evaluate(() => [(document.querySelector('main') || {}).className, document.documentElement.className, document.title]),
    textes: await p.evaluate(() => [...document.querySelectorAll('main h1, main h2, main h3, main p, main .label, main li, main blockquote, main button, main time, main small, main span')].filter(e => e.children.length === 0 || e.tagName === 'H1' || e.tagName === 'P').map(e => { const r = e.getBoundingClientRect(); return [e.tagName, e.className, Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height), e.innerText.trim().slice(0, 80)]; }).filter(x => x[6] && x[5] > 0).slice(0, 40)),
    geste: await T('^Poser les mains à plat'), barre: await rect(p, 'header.bar') || await rect(p, '.hbar') });
  console.log(JSON.stringify(P.j).slice(0, 3000)); console.log('erreurs', errs.length, errs.slice(0, 3));
  await b.close();
})().catch(e => { console.error('ÉCHEC', e.message); process.exit(1); });
