// La refonte des écrans : la boîte à outils rangée par thèmes, la fiche d'une situation, « Moi », et les écrans retouchés ensuite.
// usage : node refonte.js   (mêmes variables que final.js : PEPE_ORIGIN, PEPE_BASE)
const { chromium } = require('playwright');
const fs = require('fs');
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8444'; const APP = ORIGIN + (process.env.PEPE_BASE || '/');
let n = 0, ko = 0; const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC : ' + m); } };
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
// un parent d'exemple, au milieu du chemin : 9 étapes faites, 3 pages écrites, aucun dépôt
const D = JSON.parse(fs.readFileSync(require('path').join(__dirname, 'donnees-exemple.json'), 'utf8'));   // un parent inventé, « Camille »
const ids = Object.keys(D.steps); D.steps = Object.fromEntries(ids.slice(0, 9).map(i => [i, true])); D.tout = false; D.atelier = false; D.start = '2026-09-08';
D.seen = Object.fromEntries(ids.slice(0, 10).map((id, i) => [id, new Date(Date.UTC(2026, 8, 8 + 7 * i)).toISOString().slice(0, 10)]));
delete D.notes.tenir; delete D.notes.chemin; delete D.evo.t3; D.photos = D.photos.slice(0, 2); D.photo = D.photos[1]; D.depots = [];
const NB_NOTES = Object.keys(D.notes).filter(k => D.notes[k] && D.notes[k].t).length;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true, reducedMotion: 'reduce', locale: 'fr-CH' });
  await ctx.addInitScript(d => { try { if (!localStorage.getItem('pepe-v1')) localStorage.setItem('pepe-v1', JSON.stringify(d)); } catch (e) { } }, D);
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.goto(APP); await page.waitForTimeout(700);
  const c = await page.$('#consent [data-consent="no"]'); if (c) await c.click().catch(() => { });
  const tab = async v => { await page.click('.tab' + A('go', `[data-view="${v}"]`)); await page.waitForTimeout(250); };
  const h1 = () => page.textContent('h1');

  // ----- la boîte à outils : les situations rangées par thèmes
  await tab('kit');
  let r = await page.evaluate(() => { const G = [...document.querySelectorAll('.sits.groupes > .grp')]; return { g: G.map(e => e.querySelector('h2 .nom').textContent + ' ' + e.querySelector('h2 .nb').textContent + ' ' + e.querySelectorAll('.liste .sit').length), sits: document.querySelectorAll('.sits .sit').length, themes: document.querySelectorAll('[data-act="theme"]').length, ages: [...document.querySelectorAll('.chips [data-act="age"]')].map(e => e.textContent).join('|'), rangs: document.querySelectorAll('main .chips').length }; });
  ok(r.g.length === 6 && r.g.join('|') === 'Le comportement 2 2|La communication 2 2|Le quotidien 6 6|L’école, les professionnels, l’avenir 3 3|La famille 4 4|Vous, parent 5 5', 'boîte à outils : 6 thèmes, chacun avec son titre, son compte et ses lignes ' + r.g.join('|'));
  ok(r.sits === 22 && r.themes === 0 && r.rangs === 1 && r.ages === 'Tous âges|Enfant|Ado|Adulte', 'boîte à outils : 22 situations, une seule rangée de filtres, celle de l’âge ' + JSON.stringify(r).slice(0, 200));
  await page.click(A('age', '[data-v="g"]')); await page.waitForTimeout(150);
  r = await page.evaluate(() => ({ g: [...document.querySelectorAll('.sits.groupes > .grp h2 .nom')].map(e => e.textContent), n: document.querySelectorAll('.sits .sit').length, comptes: [...document.querySelectorAll('.sits.groupes > .grp')].every(e => Number(e.querySelector('.nb').textContent) === e.querySelectorAll('.sit').length) }));
  ok(r.n === 17 && r.g.length === 6 && r.comptes, 'filtre « Adulte » : 17 situations, et chaque thème recompte ses lignes ' + JSON.stringify(r));
  await page.click(A('age', '[data-v="all"]')); await page.waitForTimeout(100);
  await page.fill('#q', 'crise'); await page.waitForTimeout(350);
  r = await page.evaluate(() => ({ trouve: !!document.querySelector('.sits.groupes.trouve'), h2: document.querySelectorAll('.sits h2').length, t: [...document.querySelectorAll('.sits .sit b')].map(e => e.textContent), focus: document.activeElement && document.activeElement.id }));
  ok(r.trouve && r.h2 === 0 && r.t.includes('La crise') && r.t.length >= 1 && r.t.length < 22, 'recherche « crise » : une seule liste, sans titres de thème ' + JSON.stringify(r));
  await page.fill('#q', 'zzzz'); await page.waitForTimeout(350);
  ok(/Je n’ai rien trouvé pour ce mot/.test(await page.textContent('.sits')), 'recherche sans résultat : la phrase d’aide est là');
  await page.fill('#q', ''); await page.waitForTimeout(350);
  ok((await page.$$('.sits.groupes > .grp')).length === 6, 'recherche effacée : les 6 thèmes reviennent');

  // ----- la fiche d'une situation
  await page.click('.sits ' + A('sit', '[data-id="crise"]')); await page.waitForTimeout(300);
  r = await page.evaluate(() => { const q = s => document.querySelector(s); const m = q('main.fiche'); return { fiche: !!m, h1: q('h1').textContent, med: q('.couv .med') ? q('.couv .med').getAttribute('aria-hidden') : '', ordre: m ? [...m.children].map(e => e.className.replace('card ', '').replace('sec ', '').split(' ')[0]).join(' ') : '', mot: q('.comfort .label') ? q('.comfort .label').textContent : '', motP: q('.comfort p') ? q('.comfort p').textContent.length : 0, coches: m.querySelectorAll('.sec.ess .list li').length, croix: m.querySelectorAll('.sec.ev .list li').length, proches: [...m.querySelectorAll('.proches .sit')].map(e => e.dataset.id), y: scrollY }; });
  ok(r.fiche && r.h1 === 'La crise' && r.med === 'true', 'fiche : le titre sans émoticône, l’image dans un médaillon à part ' + JSON.stringify([r.h1, r.med]));
  ok(r.ordre === 'couv comp ess ev comfort aide quick grp', 'fiche : l’ordre des blocs (' + r.ordre + ')');
  ok(r.mot === 'Un mot pour vous' && r.motP > 40 && r.coches >= 3 && r.croix >= 2, 'fiche : « Un mot pour vous », des pistes à essayer et des choses à éviter ' + JSON.stringify([r.mot, r.motP, r.coches, r.croix]));
  ok(r.proches.length >= 1 && !r.proches.includes('crise') && r.proches.includes('automut'), 'fiche : « Dans le même thème » propose les autres situations du thème ' + r.proches.join(','));
  await page.click('.proches ' + A('sit', '[data-id="automut"]')); await page.waitForTimeout(600);
  r = await page.evaluate(() => ({ h1: document.querySelector('h1').textContent, y: scrollY, proches: [...document.querySelectorAll('.proches .sit')].map(e => e.dataset.id) }));
  ok(/se fait mal/.test(r.h1) && r.y < 5 && r.proches.includes('crise'), 'une situation proche s’ouvre en haut de page ' + JSON.stringify(r));
  await page.click(A('back')); await page.waitForTimeout(400);
  ok(/boîte à outils/.test(await h1()), 'Retour ramène à la boîte à outils, même après deux fiches (' + (await h1()) + ')');
  // « Pour moi » : une seule carte à lignes
  await page.click(A('kit', '[data-v="me"]')); await page.waitForTimeout(200);
  r = await page.evaluate(() => { const e = document.querySelector('.ex'); const cs = getComputedStyle(e); return { n: e.querySelectorAll('.sit').length, cadre: parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderTopLeftRadius) >= 20, ligne: getComputedStyle(e.querySelector('.sit')).borderTopLeftRadius }; });
  ok(r.n === 6 && r.cadre && r.ligne === '0px', '« Pour moi » : 6 exercices dans une seule carte ' + JSON.stringify(r));

  // ----- « Moi »
  await tab('me');
  r = await page.evaluate(() => { const T = [...document.querySelectorAll('.trio button')]; return { t: T.map(e => e.querySelector('b').textContent + ' ' + e.querySelector('span').textContent + ' > ' + e.dataset.view), sub: document.querySelector('main > .sub').textContent, lignes: [...document.querySelectorAll('.duo-a .sit b')].map(e => e.textContent), humeur: document.querySelectorAll('.mooddots i').length, colonnes: getComputedStyle(document.querySelector('.mooddots')).gridTemplateColumns.split(' ').length }; });
  ok(r.t.join('|') === '9 étapes faites > parcours|' + NB_NOTES + ' pages écrites > carnet|0 dépôt > depots', '« Moi » : 3 chiffres, et chacun mène à son écran ' + r.t.join('|'));
  ok(/^Vous avez commencé le 8 septembre 2026\. Vous retrouvez ici/.test(r.sub), '« Moi » : la date du début est dite en mots (' + r.sub.slice(0, 60) + ')');
  ok(r.lignes.join('|') === 'Avec Antonio|Mon chemin' && r.humeur === 14 && r.colonnes === 14, '« Moi » : les lignes « Mes dépôts » et « Mon carnet de route » ont laissé la place aux chiffres, et l’humeur tient sur une ligne de 14 jours ' + JSON.stringify([r.lignes, r.humeur, r.colonnes]));
  await page.click('.trio ' + A('go', '[data-view="carnet"]')); await page.waitForTimeout(400);
  ok(/Mon carnet de route/.test(await h1()), 'le chiffre des pages ouvre le carnet');
  await page.click(A('back')); await page.waitForTimeout(400);
  await tab('me'); await page.click('.trio ' + A('go', '[data-view="depots"]')); await page.waitForTimeout(400);
  ok(/Mes dépôts/.test(await h1()), 'le chiffre des dépôts ouvre les dépôts');
  await page.click(A('back')); await page.waitForTimeout(400);
  ok(/^Moi$/.test((await h1()).trim()), 'Retour ramène à « Moi »');
  await page.click('.trio ' + A('go', '[data-view="parcours"]')); await page.waitForTimeout(400);
  ok(/Le parcours/.test(await h1()), 'le chiffre des étapes ouvre le parcours');

  // ----- les écrans retouchés ensuite : le carnet en pages, les 3 points de « Mon évolution », l'étape faite
  await page.click('.quick ' + A('go', '[data-view="carnet"]')); await page.waitForTimeout(400);
  r = await page.evaluate(() => { const P = [...document.querySelectorAll('.carnet-mois .card.page')]; const cs = P[0] ? getComputedStyle(P[0]) : null; const m = P[0] ? getComputedStyle(P[0], '::before') : null; return { n: P.length, pad: cs ? cs.paddingLeft : '', marge: m ? m.width : '', it: P[0] ? getComputedStyle(P[0].querySelector('.lesson')).fontStyle : '' }; });
  ok(r.n === NB_NOTES && r.pad === '30px' && r.marge === '1.5px' && r.it === 'italic', 'carnet : chaque page écrite a sa marge de carnet ' + JSON.stringify(r));
  await page.click(A('back')); await page.waitForTimeout(400);
  await page.click('.quick ' + A('go', '[data-view="evo"]')); await page.waitForTimeout(400);
  r = await page.evaluate(() => { const C = [...document.querySelectorAll('.chips.points3 .chip')]; return { t: C.map(e => e.dataset.v + (e.classList.contains('fait') ? ' fait' : '') + (e.getAttribute('aria-pressed') === 'true' ? ' choisi' : '')), col: getComputedStyle(document.querySelector('.chips.points3')).gridTemplateColumns.split(' ').length, rond: getComputedStyle(C[0], '::before').width }; });
  ok(r.t.length === 3 && r.t[0].startsWith('t1 fait') && r.t[1].startsWith('t2 fait') && r.t[2].startsWith('t3') && !/fait/.test(r.t[2]) && r.t.filter(x => /choisi/.test(x)).length === 1 && r.col === 3 && r.rond === '36px', '« Mon évolution » : 3 ronds sur un fil, ceux qui sont faits sont pleins ' + JSON.stringify(r));
  const autre = r.t[0].includes('choisi') ? 't2' : 't1';
  await page.click('.points3 ' + A('evotime', `[data-v="${autre}"]`)); await page.waitForTimeout(200);
  ok((await page.getAttribute('.points3 ' + A('evotime', `[data-v="${autre}"]`), 'aria-pressed')) === 'true', '« Mon évolution » : toucher un rond le choisit');
  await page.click(A('back')); await page.waitForTimeout(400);
  // une étape qu'on vient de marquer : les points du fil s'allument (classe « neuf »), puis plus à la visite suivante
  await page.click('.months ' + A('step', '[data-i="9"]')); await page.waitForTimeout(500);
  await page.click('.etape>.quick ' + A('stepdone')); await page.waitForTimeout(200);
  r = await page.evaluate(() => { const bv = document.querySelector('.bravo'); return { neuf: bv && bv.classList.contains('neuf'), p: bv && bv.querySelector('p').textContent, k: bv && bv.querySelectorAll('.pts i')[9].style.getPropertyValue('--k') }; });
  ok(r.neuf && r.p === 'Vous avez fait 10 étapes sur 24.' && r.k === '9', 'étape marquée : le fil compte 10 étapes et s’allume point par point ' + JSON.stringify(r));
  await page.click(A('back')); await page.waitForTimeout(1700);
  await page.click('.months ' + A('step', '[data-i="9"]')); await page.waitForTimeout(500);
  ok(await page.evaluate(() => { const bv = document.querySelector('.bravo'); return !!bv && !bv.classList.contains('neuf'); }), 'à la visite suivante, le fil est là sans rejouer');

  // ----- la page du carnet grandit avec le texte
  r = await page.evaluate(() => { const t = document.getElementById('note'); return { h: t.getBoundingClientRect().height, sh: t.scrollHeight, ch: t.clientHeight, ov: getComputedStyle(t).overflowY }; });
  ok(r.h >= 194 && r.sh <= r.ch + 1 && r.ov === 'hidden', 'carnet : une page vide a 6 lignes, sans défilement intérieur ' + JSON.stringify(r));
  const long = Array.from({ length: 18 }, (_, i) => 'Ligne ' + (i + 1) + ' de ma lettre.').join('\n');
  await page.fill('#note', long); await page.waitForTimeout(700);
  let r2 = await page.evaluate(() => { const t = document.getElementById('note'); return { h: t.getBoundingClientRect().height, sh: t.scrollHeight, ch: t.clientHeight, garde: JSON.parse(localStorage.getItem('pepe-v1')).notes.enfant.t.split('\n').length }; });
  ok(r2.h >= 18 * 32 && r2.h <= 18 * 32 + 40 && r2.sh <= r2.ch + 1 && r2.garde === 18, 'carnet : 18 lignes écrites, la page a grandi et tout se voit ' + JSON.stringify(r2));
  await page.click('.etape>.quick ' + A('stepdone')); await page.waitForTimeout(300);
  let r3 = await page.evaluate(() => { const t = document.getElementById('note'); return { h: t.getBoundingClientRect().height, v: t.value.split('\n').length }; });
  ok(Math.abs(r3.h - r2.h) <= 1 && r3.v === 18, 'carnet : après un nouveau rendu, la page garde sa hauteur ' + JSON.stringify(r3));
  await page.fill('#note', 'Une seule ligne.'); await page.waitForTimeout(500);
  ok((await page.evaluate(() => document.getElementById('note').getBoundingClientRect().height)) <= 196, 'carnet : le texte raccourci, la page revient à 6 lignes');

  // ----- l'étang à l'heure qu'il est : la classe du moment, la teinte sur la photo, rien sur « Mon histoire »
  for (const [h, nom] of [[3, 'nuit'], [7, 'matin'], [14, 'jour'], [19, 'soir'], [23, 'nuit']]) {
    const c2 = await b.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true, reducedMotion: 'reduce', locale: 'fr-CH' });
    await c2.addInitScript(d => { try { if (!localStorage.getItem('pepe-v1')) localStorage.setItem('pepe-v1', JSON.stringify(d)); } catch (e) { } }, D);
    await c2.addInitScript(hh => { Date.prototype.getHours = function () { return hh; }; }, h);
    const p2 = await c2.newPage(); await p2.goto(APP); await p2.waitForTimeout(600);
    const v = await p2.evaluate(() => { const a = document.getElementById('app'); const f = getComputedStyle(document.querySelector('.band'), '::after'); return { cls: (a.className.match(/\bh-(\w+)/) || [])[1], filtre: f.backdropFilter || f.webkitBackdropFilter || 'none', fond: f.backgroundImage.split('gradient(').length - 1 }; });
    ok(v.cls === nom && (nom === 'jour' ? v.filtre === 'none' : /hue-rotate/.test(v.filtre)) && v.fond >= 2, 'à ' + h + ' h, l’étang est en « ' + nom + ' » ' + JSON.stringify(v));
    if (h === 23) {
      await p2.click('.tab' + A('go', '[data-view="me"]')); await p2.waitForTimeout(250); await p2.click(A('go', '[data-view="about"]')); await p2.waitForTimeout(700);
      const st = await p2.evaluate(() => { const e = document.querySelector('.band.story'); const f = e ? getComputedStyle(e, '::after') : null; return f ? (f.backdropFilter || f.webkitBackdropFilter || 'none') : 'absent'; });
      ok(st === 'none', '« Mon histoire » garde sa photo telle quelle, même la nuit (' + st + ')');
    }
    await c2.close();
  }

  ok(errs.length === 0, 'aucune erreur dans la page ' + errs.slice(0, 2).join(' | '));
  await b.close();
  console.log('refonte : ' + n + ' vérifications, ' + ko + ' échec' + (ko > 1 ? 's' : ''));
  process.exit(ko ? 1 : 0);
})();
