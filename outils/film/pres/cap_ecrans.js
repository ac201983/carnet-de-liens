// Film de présentation, de 32 à 43 s : le lendemain, le père trouve la fiche « Les écrans » parmi les 23 situations, puis lance le minuteur visuel.
// La vraie version d'essai, image par image. Le minuteur est filmé en accéléré : ses 5 minutes passent en 2,8 secondes de film (rien d'autre n'est changé).
// node cap_ecrans.js → cap/pistes/, cap/fiche/, cap/minuteur/
const { ouvrir, Prise, rect, rectTexte, PAS, APP, fs } = require('./lib.js');
const N_MIN = 84;                                    // images de film pour les 5 minutes du minuteur
(async () => {
  const { b, ctx, p, errs } = await ouvrir({ haut: 1100, date: '2026-11-20T17:35:00+01:00', etat: 'cap/etat-pere.json' });
  await p.goto(APP + '#accueil', { waitUntil: 'load' }); await p.addStyleTag({ content: '.film-cmd{visibility:hidden!important}.mv-part{transition:none!important}' });
  await p.waitForSelector('[data-act="sit"][data-id="ecrans"]'); await p.waitForTimeout(2600);
  const y0 = await p.evaluate(() => { const e = [...document.querySelectorAll('h2,h3')].find(e => /^Des pistes pour/.test(e.textContent.trim())); return Math.round(e.getBoundingClientRect().top + window.scrollY - 96); });
  await p.evaluate(y => window.scrollTo(0, y), y0); await p.waitForTimeout(900);
  let P = new Prise(p, 'cap/pistes'); await P.tenir(); await P.images(2);
  const chip = await rect(p, '[data-act="sit"][data-id="ecrans"]');
  P.fin({ defile: y0, vue: await p.evaluate(() => [(document.querySelector('main') || {}).className, document.documentElement.className]), titre: await rectTexte(p, '^Des pistes pour', 'body'), para: await rectTexte(p, '^Vous y trouvez 23 situations', 'body'), ado: await rectTexte(p, '^Avec un ado$', 'body'), enfant: await rectTexte(p, '^Avec un enfant$', 'body'), adulte: await rectTexte(p, '^Avec un adulte$', 'body'), chip, barre: await rect(p, '.hbar') || await rect(p, 'header.bar') });
  // il touche « Les écrans » : la fiche
  await p.touchscreen.tap(chip.x + chip.w * .6, chip.y + chip.h * .5); await P.laisse(1600); await p.evaluate(() => window.scrollTo(0, 0)); await P.laisse(400);
  await p.setViewportSize({ width: 390, height: 1500 }); await P.laisse(500);
  P = new Prise(p, 'cap/fiche'); await P.images(2);
  const lis = await p.evaluate(() => [...document.querySelectorAll('main .ess li')].map(e => { const g = document.createRange(); g.selectNodeContents(e); const q = g.getBoundingClientRect(), b = e.getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height, bx: b.left, by: b.top, bw: b.width, bh: b.height, t: e.textContent.trim().slice(0, 60) }; }));
  P.fin({ vue: await p.evaluate(() => (document.querySelector('main') || {}).className), med: await rect(p, 'main .couv .med'), label: await rect(p, 'main .couv .label', true), titre: await rect(p, 'main .couv h1', true), sous: await rect(p, 'main .couv .sub', true), comp: await rect(p, 'main .comp'), ess: await rect(p, 'main .ess'), ess_h: await rect(p, 'main .ess h2', true), lis, feuille: await rect(p, 'main .feuille'), barre: await rect(p, 'header.bar') || await rect(p, '.hbar') });
  // le bouton « Le minuteur visuel » de la fiche ouvre l'outil
  await p.setViewportSize({ width: 390, height: 900 }); await P.laisse(300);
  const bouton = await p.$('main [data-act="kit"][data-tool="timer"]'); if (!bouton) throw new Error('pas de bouton « Le minuteur visuel » sur la fiche');
  await bouton.scrollIntoViewIfNeeded(); await P.laisse(200); await bouton.tap(); await P.laisse(1800);
  P = new Prise(p, 'cap/minuteur');
  const R = async () => ({ carte: await rect(p, '.minuteur'), label: await rect(p, '.minuteur .label', true), aide: await rect(p, '.minuteur .hint', true), disque: await rect(p, '.minuteur .disque'), num: await rect(p, '#tnum', true), lancer: await rect(p, '[data-act="ttoggle"]'), remettre: await rect(p, '[data-act="treset"]'), defile: await p.evaluate(() => window.scrollY), barre: await rect(p, 'header.bar') || await rect(p, '.hbar') });
  const r0 = await R(); await P.images(2);
  P.marque('toucher'); await p.touchscreen.tap(r0.lancer.x + r0.lancer.w * .55, r0.lancer.y + r0.lancer.h * .5); await P.images(3);
  P.marque('depart'); const suivi = [];
  for (let i = 0; i < N_MIN + 2; i++) { const n = await p.evaluate(ms => window.__iv.pas(ms), 300000 / N_MIN); await P.image(); suivi.push([n, await p.$eval('#tnum', e => e.textContent)]); if (suivi[suivi.length - 1][1] === '0:00' && !P.j.marques.fini) P.marque('fini'); }
  await P.images(40);
  P.fin({ avant: r0, apres: await R(), suivi, toast: await p.evaluate(() => { const t = document.querySelector('.toast, #toast, [role="status"]'); return t ? [t.className, t.textContent.trim(), JSON.stringify(t.getBoundingClientRect())] : null; }), vue: await p.evaluate(() => (document.querySelector('main') || {}).className) });
  console.log('erreurs', errs.length, errs.slice(0, 3)); console.log(JSON.stringify({ y0, chip, r0, suivi: suivi.filter((x, i) => i % 12 === 0 || i > N_MIN - 3) }));
  await b.close();
})();
