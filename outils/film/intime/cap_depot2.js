// Montage intime : le père ouvre « Déposer ce qui pèse » et écrit une seule phrase. C'est la vraie version d'essai, filmée image par image (comme pres/cap_depot.js).
// Les mots écrits sont ceux du scénario d'Antonio : une fiction. node cap_depot2.js → cap/depot2/
const { ouvrir, Prise, rect, rectTexte, PAS, APP, fs } = require('../pres/lib.js');
const TEXTE = 'Ça me manque de jouer avec elle.';
const curseur = (p, n) => p.evaluate(n => {
  const ta = document.getElementById('draft'), cs = getComputedStyle(ta), r = ta.getBoundingClientRect();
  let m = document.getElementById('__miroir'); if (!m) { m = document.createElement('div'); m.id = '__miroir'; document.body.appendChild(m); }
  m.style.cssText = 'position:fixed;visibility:hidden;white-space:pre-wrap;overflow-wrap:break-word;word-break:' + cs.wordBreak + ';box-sizing:border-box;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;font:' + cs.font + ';letter-spacing:' + cs.letterSpacing + ';padding:' + cs.padding + ';border:' + cs.borderTopWidth + ' solid transparent;line-height:' + cs.lineHeight + ';text-indent:' + cs.textIndent;
  m.textContent = ta.value.slice(0, n); const s = document.createElement('span'); s.textContent = '​'; m.appendChild(s); const q = s.getBoundingClientRect();
  return { x: q.left, y: q.top, h: q.height, lh: parseFloat(cs.lineHeight), fs: parseFloat(cs.fontSize), coul: cs.color, caret: cs.caretColor };
}, n);
(async () => {
  const { b, ctx, p, errs } = await ouvrir({ haut: 844, date: '2026-11-19T21:44:00+01:00' });
  await p.goto(APP, { waitUntil: 'load' }); await p.addStyleTag({ content: '.film-cmd{visibility:hidden!important}' });
  await p.waitForSelector('.seuil [data-act="porte"][data-v="deposer"]'); await p.waitForTimeout(2600);
  const e = p.locator('.seuil [data-act="porte"][data-v="deposer"]').first(); await e.scrollIntoViewIfNeeded(); const r = await e.boundingBox(); await p.touchscreen.tap(r.x + 262, r.y + 24); await p.waitForTimeout(1800);
  const vue1 = await p.evaluate(() => (document.querySelector('main') || {}).className);
  await p.setViewportSize({ width: 390, height: 1000 }); await p.waitForTimeout(1200); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
  const P = new Prise(p, 'cap/depot2'); await P.tenir();
  const R = async () => ({ label: await rectTexte(p, '^Déposer ce qui pèse$'), question: await rectTexte(p, '^Qu’aimeriez-vous qu’on comprenne'), seul: await rectTexte(p, '^Cet espace fonctionne seul'), quilit: await rect(p, '#qui-lit'), champ: await rect(p, '#draft'),
    garder: await rect(p, '[data-act="dsend"]'), dire: await rect(p, '[data-act="ddire"]'), carte: await rect(p, '.depot-c'), barre: await rect(p, 'header.bar') || await rect(p, '.hbar') });
  const r0 = await R();
  await P.image(); P.marque('vide', 0);
  await p.touchscreen.tap(r0.champ.x + 60, r0.champ.y + 40); await P.images(8); P.marque('pret');
  const carets = [await curseur(p, 0)]; const im = [];
  for (let i = 0; i < TEXTE.length; i++) { await p.keyboard.insertText(TEXTE[i]); im.push(await P.image()); carets.push(await curseur(p, i + 1)); }
  P.marque('ecrit'); await P.images(3);
  const r1 = await R(); const valeur = await p.$eval('#draft', e => e.value);
  P.fin({ texte: TEXTE, valeur, avant: r0, apres: r1, carets, images_frappe: im, vue: vue1 });
  console.log('erreurs', errs.length, errs.slice(0, 3)); console.log(JSON.stringify({ vue1, valeur, r0, n_carets: carets.length, c0: carets[0], c_fin: carets[carets.length - 1], marques: P.j.marques }));
  await b.close();
})().catch(e => { console.error('ÉCHEC', e.message); process.exit(1); });
