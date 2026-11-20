// Montage cinématographique : Bastien choisit d'écrire « J'aime prendre mon café seul, le matin. » dans « Passer le relais » (le vrai outil, étape « Sa parole »).
// La fiche est celle de l'exemple inventé du site (Bastien, son oncle Rémi), préparée comme le ferait une famille. Seule la phrase de Bastien est écrite devant la caméra.
// node cap_relais.js → cap/parole/ (l'écran, le choix du début de phrase, la frappe), cap/apercu/ (« Voici exactement ce que vous transmettez »), cap/fiche-papier.png (la fiche telle qu'elle s'imprime)
const { ouvrir, Prise, rect, rectTexte, PAS, APP, fs } = require('../pres/lib.js');
const SUITE = 'prendre mon café seul, le matin.';
const EX = { trois: ['Bastien a besoin de savoir ce qui vient après. Dis-lui le programme le matin, en 3 étapes au plus.', 'Quand il se balance et parle plus fort, il sature. Propose-lui sa chambre et son casque, puis laisse-lui 10 minutes.', 'C’est un adulte. Demande-lui son avis avant de décider pour lui, même pour un détail.'],
  s: { aide: ['Une seule consigne à la fois, avec des mots simples.', 'Du temps pour répondre. Compte jusqu’à 10 dans ta tête avant de répéter.'], repas: ['Bastien mange de tout, sauf les plats en sauce où tout est mélangé.', 'Bastien a besoin d’aide pour couper et se sert pour le reste.'], nuit: ['Il se couche vers 22 heures, après sa série.', 'La porte reste entrouverte et la lumière du couloir reste allumée.'], monte: ['Parler peu, baisser la voix et laisser de la place aide Bastien à redescendre.', 'Quand c’est passé, un verre d’eau suffit. Il n’y a pas besoin d’en reparler.'], secu: ['Les médicaments sont préparés dans le pilulier. Ils se donnent à 8 heures et à 20 heures.'] },
  tel: [{ n: 'Maman', t: '079 000 00 00' }, { n: 'Le foyer', t: '026 000 00 00' }] };
const SEL = '[data-rl="moi.0"]';
const curseur = (p, n) => p.evaluate(([sel, n]) => {
  const ta = document.querySelector(sel), cs = getComputedStyle(ta), r = ta.getBoundingClientRect();
  let m = document.getElementById('__miroir'); if (!m) { m = document.createElement('div'); m.id = '__miroir'; document.body.appendChild(m); }
  m.style.cssText = 'position:fixed;visibility:hidden;white-space:pre-wrap;overflow-wrap:break-word;word-break:' + cs.wordBreak + ';box-sizing:border-box;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;font:' + cs.font + ';letter-spacing:' + cs.letterSpacing + ';padding:' + cs.padding + ';border:' + cs.borderTopWidth + ' solid transparent;line-height:' + cs.lineHeight + ';text-indent:' + cs.textIndent;
  m.textContent = ta.value.slice(0, n); const s = document.createElement('span'); s.textContent = '​'; m.appendChild(s); const q = s.getBoundingClientRect();
  return { x: q.left, y: q.top, h: q.height, lh: parseFloat(cs.lineHeight), fs: parseFloat(cs.fontSize), coul: cs.color, caret: cs.caretColor };
}, [SEL, n]);
(async () => {
  const { b, ctx, p, errs } = await ouvrir({ haut: 1000, date: '2026-11-20T10:05:00+01:00' });
  await p.goto(APP, { waitUntil: 'load' }); await p.addStyleTag({ content: '.film-cmd{visibility:hidden!important}' });
  await p.waitForSelector('[data-act="rl"][data-k="exemple"]'); await p.waitForTimeout(2600);
  const tape = async sel => { const e = p.locator(sel).first(); await e.scrollIntoViewIfNeeded(); await p.waitForTimeout(150); const r = await e.boundingBox(); await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(1500); };
  // 1. la famille ouvre l'outil et commence sa première fiche
  await tape('.fb-voir'); await tape('[data-act="rl"][data-k="nouveau"]');
  await p.waitForSelector('#rl-qui'); await p.fill('#rl-qui', 'Bastien'); await p.fill('#rl-chez', 'son oncle Rémi'); await p.fill('#rl-quand', 'du samedi 21 au dimanche 22 novembre');
  await tape('[data-act="rl"][data-k="pas"][data-v="1"]');
  // 2. le quotidien, les 3 repères et les numéros : ceux de l'exemple du site, posés d'un coup (ce n'est pas ce que le film montre)
  const cle = await p.evaluate(() => Object.keys(localStorage).find(k => { try { const d = JSON.parse(localStorage.getItem(k)); return d && d.rel && d.rel.fiches && d.rel.fiches.length; } catch (e) { return false; } }));
  if (!cle) throw new Error('la fiche n’est pas enregistrée');
  await p.evaluate(([k, ex]) => { const d = JSON.parse(localStorage.getItem(k)); Object.assign(d.rel.fiches[0], ex); localStorage.setItem(k, JSON.stringify(d)); }, [cle, EX]);
  await p.goto(APP + '#relais', { waitUntil: 'load' }); await p.addStyleTag({ content: '.film-cmd{visibility:hidden!important}' }); await p.waitForTimeout(2600);
  console.log('après rechargement :', await p.evaluate(() => [(document.querySelector('main') || {}).className, [...document.querySelectorAll('main [data-act="rl"]')].map(e => e.getAttribute('data-k') + ':' + e.innerText.trim().slice(0, 28))]));
  await tape('[data-act="rl"][data-k="ouvrir"], [data-act="rl"][data-k="reprise"]');
  await tape('[data-act="rl"][data-k="aller"][data-v="0"]');
  for (let k = 0; k < 3; k++) await tape('[data-act="rl"][data-k="pas"][data-v="1"]');
  if (!(await p.$('[data-act="rl"][data-k="moi"]'))) throw new Error('l’étape « Sa parole » ne s’est pas ouverte : ' + await p.evaluate(() => document.querySelector('main h1').innerText));
  // 3. « Ce que je souhaite dire moi-même » : ce que le film montre
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(600);
  let P = new Prise(p, 'cap/parole'); await P.tenir(); await P.laisse(600);
  const T = s => rectTexte(p, s, 'body');
  const R = async () => ({ label: await T('^(Mon premier relais|Un nouveau relais)$'), titre: await T('^Ce que je souhaite dire moi-même$'), sous: await T('^Cette partie appartient à Bastien'), fil: await rect(p, '.rl-fil') || await rect(p, '.fil-pas'), commencer: await T('^Commencer par$'),
    debuts: await p.evaluate(() => [...document.querySelectorAll('[data-act="rl"][data-k="moi"]')].map(e => { const r = e.getBoundingClientRect(); return { i: e.getAttribute('data-i'), t: e.innerText.trim(), x: r.left, y: r.top, w: r.width, h: r.height }; })),
    champ: await rect(p, SEL), hint: await T('^Si Bastien préfère ne rien dire'), suite: await rect(p, '[data-act="rl"][data-k="pas"][data-v="1"]'), suite_t: await p.evaluate(() => document.querySelector('[data-act="rl"][data-k="pas"][data-v="1"]').innerText.trim()), barre: await rect(p, 'header.bar') || await rect(p, '.hbar') });
  const r0 = await R(); await P.images(2);
  const d = r0.debuts[0]; const doigt = { x: Math.round(d.x + d.w * .62), y: Math.round(d.y + d.h * .5) };
  P.marque('toucher'); await p.touchscreen.tap(doigt.x, doigt.y); await P.images(14);
  await p.waitForSelector(SEL); await p.evaluate(sel => { const e = document.querySelector(sel); e.focus(); e.setSelectionRange(e.value.length, e.value.length); }, SEL); await P.images(2);
  const r1 = await R(); const debut = await p.$eval(SEL, e => e.value); P.marque('pret');
  const carets = [await curseur(p, debut.length)]; const im = [];
  for (let i = 0; i < SUITE.length; i++) { await p.keyboard.insertText(SUITE[i]); im.push(await P.image()); carets.push(await curseur(p, debut.length + i + 1)); }
  P.marque('ecrit'); await P.images(3);
  const r2 = await R(); const valeur = await p.$eval(SEL, e => e.value);
  P.fin({ debut, suite: SUITE, valeur, avant: r0, pendant: r1, apres: r2, carets, images_frappe: im, doigt, vue: await p.evaluate(() => [(document.querySelector('main') || {}).className, document.documentElement.className, window.scrollY]) });
  console.log('parole :', JSON.stringify({ debut, valeur, titre: r0.titre, debuts: r0.debuts, champ: r2.champ, suite: r2.suite, suite_t: r2.suite_t, hint: r2.hint, n: P.n }));
  // 4. la fiche telle qu'elle part : « Voici exactement ce que vous transmettez »
  await p.evaluate(() => { const e = document.activeElement; if (e && e.blur) e.blur(); });
  await tape('[data-act="rl"][data-k="pas"][data-v="1"]'); await tape('[data-act="rl"][data-k="apercu"]');
  await p.setViewportSize({ width: 390, height: 1700 }); await p.waitForTimeout(400);
  const t = await T('^Le relais de Bastien$'); const y0 = await p.evaluate(y => { window.scrollTo(0, Math.max(0, Math.round(window.scrollY + y - 110))); return window.scrollY; }, t.y); await p.waitForTimeout(500);
  P = new Prise(p, 'cap/apercu'); await P.tenir(); await P.laisse(2200); await P.images(2);
  P.fin({ defile: y0, vue: await p.evaluate(() => [(document.querySelector('main') || {}).className, document.documentElement.className]), titre: await T('^Le relais de Bastien$'), pour: await T('^Pour son oncle Rémi'), trois: await T('^Si tu ne lis que trois choses$'), moi: await T('^Ce que je souhaite dire moi-même$'), cafe: await T('^J’aime prendre mon café seul'), signe: await T('^Bastien$'), aide: await T('^Ce qui aide Bastien$'), fiche: await rect(p, '.rl-fiche'), section: await rect(p, '.rl-fiche .rl-moi') });
  console.log('aperçu :', JSON.stringify(P.j));
  // 5. la fiche imprimée : la feuille que Bastien tend à son oncle
  await p.emulateMedia({ media: 'print' }); await p.setViewportSize({ width: 794, height: 1123 }); await p.waitForTimeout(600);
  const f = await rect(p, '.rl-fiche'); console.log('fiche imprimée :', JSON.stringify(f), await p.evaluate(() => document.querySelector('.rl-fiche').className));
  await p.locator('.rl-fiche').screenshot({ path: 'cap/fiche-papier.png' });
  fs.writeFileSync('cap/fiche-papier.json', JSON.stringify({ fiche: f, titre: await T('^Le relais de Bastien$'), pour: await T('^Pour son oncle Rémi'), moi: await T('^Ce que je souhaite dire moi-même$'), cafe: await T('^J’aime prendre mon café seul'), signe: await T('^Bastien$') }));
  // la même fiche imprimée sur une feuille A5 (148 mm de large) : les mots y sont plus grands par rapport à la feuille, on les lit mieux à l'image
  await p.setViewportSize({ width: 559, height: 794 }); await p.waitForTimeout(600);
  const f5 = await rect(p, '.rl-fiche'); console.log('fiche A5 :', JSON.stringify(f5), await p.evaluate(() => document.querySelector('.rl-fiche').className));
  await p.locator('.rl-fiche').screenshot({ path: 'cap/fiche-a5.png' });
  fs.writeFileSync('cap/fiche-a5.json', JSON.stringify({ fiche: f5, titre: await T('^Le relais de Bastien$'), pour: await T('^Pour son oncle Rémi'), trois: await T('^Si tu ne lis que trois choses$'), moi: await T('^Ce que je souhaite dire moi-même$'), cafe: await T('^J’aime prendre mon café seul'), signe: await T('^Bastien$'), aide: await T('^Ce qui aide Bastien$'), section: await rect(p, '.rl-fiche .rl-moi') }));
  fs.writeFileSync('cap/etat-relais.json', JSON.stringify(await ctx.storageState()));
  console.log('erreurs', errs.length, errs.slice(0, 3));
  await b.close();
})().catch(e => { console.error('ÉCHEC', e.message); process.exit(1); });
