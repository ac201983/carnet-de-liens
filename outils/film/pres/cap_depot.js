// Film de présentation, de 16 à 32 s : le père ouvre « Déposer ce qui pèse », écrit, puis choisit « J'aimerais le dire à quelqu'un ».
// C'est la vraie version d'essai, filmée image par image. Les mots écrits sont ceux du scénario d'Antonio : une fiction.
// node cap_depot.js  →  cap/accueil-d/ (l'accueil et l'appui), cap/depot/ (l'écran, la frappe, l'appui), cap/dire/ (l'écran suivant), cap/etat-pere.json (l'état gardé pour les captures suivantes)
const { ouvrir, Prise, rect, rectTexte, PAS, APP, fs } = require('./lib.js');
const TEXTE = 'On s’est encore disputés pour la tablette. Ça me manque de jouer avec elle.';
// La place du curseur après les n premiers caractères : une copie invisible du champ, avec les mêmes réglages d'écriture.
const curseur = (p, n) => p.evaluate(n => {
  const ta = document.getElementById('draft'), cs = getComputedStyle(ta), r = ta.getBoundingClientRect();
  let m = document.getElementById('__miroir'); if (!m) { m = document.createElement('div'); m.id = '__miroir'; document.body.appendChild(m); }
  m.style.cssText = 'position:fixed;visibility:hidden;white-space:pre-wrap;overflow-wrap:break-word;word-break:' + cs.wordBreak + ';box-sizing:border-box;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;font:' + cs.font + ';letter-spacing:' + cs.letterSpacing + ';padding:' + cs.padding + ';border:' + cs.borderTopWidth + ' solid transparent;line-height:' + cs.lineHeight + ';text-indent:' + cs.textIndent;
  m.textContent = ta.value.slice(0, n); const s = document.createElement('span'); s.textContent = '​'; m.appendChild(s); const q = s.getBoundingClientRect();
  return { x: q.left, y: q.top, h: q.height, lh: parseFloat(cs.lineHeight), fs: parseFloat(cs.fontSize), coul: cs.color, caret: cs.caretColor };
}, n);
(async () => {
  const { b, ctx, p, errs } = await ouvrir({ haut: 844, date: '2026-11-19T21:42:00+01:00' });
  await p.goto(APP, { waitUntil: 'load' }); await p.addStyleTag({ content: '.film-cmd{visibility:hidden!important}' });
  await p.waitForSelector('.seuil [data-act="porte"][data-v="deposer"]'); await p.waitForTimeout(2600);
  // l'accueil, descendu pour que « Déposer ce qui pèse » vienne juste sous la barre du site
  const y0 = await p.evaluate(() => { const e = document.querySelector('.seuil [data-act="porte"][data-v="deposer"]'); return Math.round(e.getBoundingClientRect().top + window.scrollY - 62.3); });
  await p.evaluate(y => window.scrollTo(0, y), y0); await p.waitForTimeout(700);
  let P = new Prise(p, 'cap/accueil-d'); await P.tenir();
  const porte = await rect(p, '.seuil [data-act="porte"][data-v="deposer"]'), titre = await rect(p, '.seuil [data-act="porte"][data-v="deposer"] .tx b', true), sous = await rect(p, '.seuil [data-act="porte"][data-v="deposer"] .tx small', true), suiv = await rect(p, '.seuil [data-act="porte"][data-v="souffle"]');
  const doigt = { x: 262, y: Math.round((porte.y + 24) * 10) / 10 };
  await P.images(2); P.marque('toucher'); await p.touchscreen.tap(doigt.x, doigt.y); await P.images(44);
  const vue1 = await p.evaluate(() => (document.querySelector('main') || {}).className);
  P.fin({ defile: y0, porte, titre, sous, suivante: suiv, doigt, vue: vue1 });
  // l'écran « Déposer ce qui pèse », sur un écran plus haut : tout le cadre d'écriture tient sans la barre du bas
  await p.setViewportSize({ width: 390, height: 1000 }); await P.laisse(1200); await p.evaluate(() => window.scrollTo(0, 0)); await P.laisse(300);
  P = new Prise(p, 'cap/depot'); P.n = 0;
  const R = async () => ({ label: await rectTexte(p, '^Déposer ce qui pèse$'), question: await rectTexte(p, '^Qu’aimeriez-vous qu’on comprenne'), seul: await rectTexte(p, '^Cet espace fonctionne seul'), quilit: await rect(p, '#qui-lit'), champ: await rect(p, '#draft'),
    garder: await rect(p, '[data-act="dsend"]'), dire: await rect(p, '[data-act="ddire"]'), silence: await rect(p, '.dep-silence'), carte: await rect(p, '.depot-c'), barre: await rect(p, 'header.bar') || await rect(p, '.hbar') });
  const r0 = await R();
  await P.image(); P.marque('vide', 0);
  // il touche le champ, puis écrit : une image par caractère
  await p.touchscreen.tap(r0.champ.x + 60, r0.champ.y + 40); await P.images(8); P.marque('pret');
  const carets = [await curseur(p, 0)]; const im = [];
  for (let i = 0; i < TEXTE.length; i++) { await p.keyboard.insertText(TEXTE[i]); im.push(await P.image()); carets.push(await curseur(p, i + 1)); }
  P.marque('ecrit'); await P.images(3);
  const r1 = await R(); const valeur = await p.$eval('#draft', e => e.value);
  // il choisit « J'aimerais le dire à quelqu'un »
  const d2 = { x: Math.round(r1.dire.x + r1.dire.w * .74), y: Math.round(r1.dire.y + r1.dire.h * .55) };
  P.marque('toucher'); await p.touchscreen.tap(d2.x, d2.y); await P.images(46);
  const vue2 = await p.evaluate(() => [(document.querySelector('main') || {}).className, window.scrollY]);
  P.fin({ texte: TEXTE, valeur, avant: r0, apres: r1, carets, images_frappe: im, doigt: d2, vue: vue2 });
  // l'écran « J'aimerais le dire à quelqu'un », posé
  await P.laisse(1500); await p.evaluate(() => window.scrollTo(0, 0)); await P.laisse(300);
  P = new Prise(p, 'cap/dire'); await P.images(2);
  P.fin({ titre: await rectTexte(p, '^J’aimerais le dire'), sous: await rectTexte(p, '^Voici une première phrase'), qui: await rectTexte(p, '^À qui aimeriez-vous'), commencer: await rectTexte(p, '^Pour commencer$'), amorce: await rect(p, '#amorce'), amorce_txt: await p.$eval('#amorce', e => e.value),
    perds: await rect(p, '[data-act="dire"][data-k="mots"]'), mots: await rectTexte(p, '^Vos mots, tels que'), barre: await rect(p, 'header.bar') || await rect(p, '.hbar'), vue: await p.evaluate(() => (document.querySelector('main') || {}).className), actes: await p.evaluate(() => [...document.querySelectorAll('main [data-act]')].map(e => e.getAttribute('data-act') + ':' + (e.getAttribute('data-k') || '') + ':' + e.innerText.trim().slice(0, 30))) });
  fs.writeFileSync('cap/etat-pere.json', JSON.stringify(await ctx.storageState()));
  console.log('erreurs', errs.length, errs.slice(0, 3)); console.log(JSON.stringify({ vue1, vue2, y0, porte, doigt, r0, n_carets: carets.length, c0: carets[0], c_fin: carets[carets.length - 1] }));
  await b.close();
})();
