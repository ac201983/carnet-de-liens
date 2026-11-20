// Montage cinématographique : l'écran d'accueil de l'outil « Passer le relais », tel qu'une famille l'ouvre la première fois. node cap_relais0.js → cap/relais0/
const { ouvrir, Prise, rect, rectTexte, PAS, APP, fs } = require('../pres/lib.js');
(async () => {
  const { b, ctx, p, errs } = await ouvrir({ haut: 1000, date: '2026-11-20T10:05:00+01:00' });
  await p.goto(APP + '#relais', { waitUntil: 'load' }); await p.addStyleTag({ content: '.film-cmd{visibility:hidden!important}' }); await p.waitForTimeout(2800);
  const vue = await p.evaluate(() => [(document.querySelector('main') || {}).className, (document.querySelector('main h1') || {}).innerText]);
  if (!/rl-e-accueil/.test(vue[0])) throw new Error('écran inattendu : ' + JSON.stringify(vue));
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
  const P = new Prise(p, 'cap/relais0'); await P.tenir(); await P.laisse(1500); await P.images(2);
  const T = s => rectTexte(p, s, 'body');
  P.fin({ vue, label: await T('^Un outil pour toute la famille$'), titre: await T('^Passer le relais$'), sous: await T('^Une page pour la personne'), exemple: await rect(p, '[data-act="rl"][data-k="exemple"]'), nouveau: await rect(p, '[data-act="rl"][data-k="nouveau"]'), barre: await rect(p, 'header.bar') || await rect(p, '.hbar') });
  console.log(JSON.stringify(P.j)); console.log('erreurs', errs.length, errs.slice(0, 3)); await b.close();
})().catch(e => { console.error('ÉCHEC', e.message); process.exit(1); });
