// Le final du parcours, « Mon chemin » : la page rassemble ce que le parent a fait et écrit, elle s'imprime, et les photos choisies sont gardées l'une après l'autre.
const { chromium } = require('playwright');
const fs = require('fs');
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8444'; const APP = ORIGIN + (process.env.PEPE_BASE || '/');
const SITE_DIR = process.env.PEPE_SITE_DIR || '/home/claude/infomaniak/site';
const axeSrc = fs.readFileSync('/home/claude/tools/node_modules/axe-core/axe.min.js', 'utf8');
let n = 0, ko = 0; const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC : ' + m); } };
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
// Les noms des étapes, lus dans l'application exécutée hors du navigateur (comme tests/accueil.js).
const IDS = (() => {
  globalThis.localStorage = { getItem: () => null, setItem() { }, removeItem() { } };
  const app = { innerHTML: '', className: '', addEventListener() { }, appendChild() { }, querySelector() { return null; }, getAttribute() { return null; }, removeAttribute() { } };
  globalThis.document = { getElementById: id => id === 'app' ? app : null, querySelector: () => null, createElement: () => ({ setAttribute() { }, remove() { } }), addEventListener() { }, activeElement: null, title: '' };
  globalThis.window = globalThis; globalThis.location = { search: '', pathname: '/', hash: '' }; globalThis.addEventListener = () => { }; globalThis.history = { replaceState() { } }; globalThis.scrollTo = () => { };
  const code = fs.readFileSync(SITE_DIR + '/app.js', 'utf8'); const fin = code.lastIndexOf('})();');
  const P = (0, eval)(code.slice(0, fin) + ';return PARCOURS;})();'); const L = []; P.forEach(m => m.steps.forEach(s => L.push(s.id))); return L;
})();
const BASE = { onboarded: true, me: 'Camille', tier: 'parcours', start: '2026-05-03', age: 'e', situation: 'hand', weights: [], pv: 2, atelier: true, tout: true, steps: {}, seen: {}, notes: {}, evo: {}, moods: {}, depots: [] };
const PLEIN = Object.assign({}, BASE, {
  steps: Object.fromEntries(IDS.map(id => [id, true])),
  notes: { depart: { t: 'Je commence ce parcours parce que je crie trop, et que je veux retrouver des soirées calmes.', d: '2026-05-03' }, emotions: { t: 'La colère. Elle me dirait que je suis à bout.', d: '2026-06-01' }, avenir: { t: 'Dans 10 ans, elle prend le bus seule.', d: '2026-07-12' }, tenir: { t: 'Marcher le mardi, lire le dimanche, appeler ma sœur.', d: '2026-10-20' }, chemin: { t: 'Tu ne le sais pas encore, mais tu vas y arriver.\nTu apprendras à demander de l’aide.', d: '2026-11-15' } },
  evo: { t1: { stress: 8, comp: 4, seul: 7, regard: 5, confiance: 4, avant: 'Presque rien.', change: 'Pas encore.', date: '2026-05-03' }, t2: { stress: 6, comp: 6, seul: 6, regard: 7, confiance: 6, date: '2026-08-02' }, t3: { stress: 4, comp: 8, seul: 4, regard: 8, confiance: 8, change: 'Oui. Je vois d’abord qui elle est.', date: '2026-11-15' } },
  photo: { id: 'soleil', text: 'Je respire.', date: '2026-11-15' },
  photos: [{ id: 'aube', text: 'Un début.', date: '2026-05-03' }, { id: 'col', text: 'Le plus dur est derrière.', date: '2026-08-02' }, { id: 'soleil', text: 'Je respire.', date: '2026-11-15' }]
});
(async () => {
  const b = await chromium.launch();
  const ouvre = async (data, opt = {}) => {
    const ctx = await b.newContext(Object.assign({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true, reducedMotion: 'reduce', locale: 'fr-CH' }, opt.ctx || {}));
    await ctx.addInitScript(d => { try { if (!localStorage.getItem('pepe-v1')) localStorage.setItem('pepe-v1', JSON.stringify(d)); } catch (e) { } window.__imprime = 0; window.print = () => { window.__imprime++; }; }, data);
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(APP); await page.waitForTimeout(600); const c = await page.$('#consent [data-consent="no"]'); if (c) await c.click(); await page.waitForTimeout(150);
    return { ctx, page, errs };
  };
  const tab = (page, v) => page.click('.tab' + A('go', `[data-view="${v}"]`));
  const garde = page => page.evaluate(() => JSON.parse(localStorage.getItem('pepe-v1')));
  // ---------- 1. La page pleine : ce qu'elle rassemble
  {
    const { ctx, page, errs } = await ouvre(PLEIN);
    await tab(page, 'me'); await page.waitForTimeout(200);
    await page.click('.sit' + A('go', '[data-view="final"]')); await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const q = s => [...document.querySelectorAll(s)]; const tx = s => q(s).map(e => e.textContent.replace(/\s+/g, ' ').trim());
      return { vue: !!document.querySelector('#app.v-final'), h1: tx('h1')[0], sub: tx('.fin-couv .sub')[0], h2: tx('.fin-bloc>h2'), dep: tx('#fin-dep ~ .card .lesson')[0], lignes: q('.bars .barrow').length, barres: q('.bars .bartrack i').length, v1: tx('.bars .barrow:first-child em'), legende: q('.legend span').length,
        ouv: q('[aria-labelledby="fin-evo"] .card.page').length, photos: q('.fin-photo img').map(i => i.getAttribute('src')), legPhotos: tx('.fin-photo b'), ecrits: tx('[aria-labelledby="fin-ecr"] article .label'), moisE: q('[aria-labelledby="fin-ecr"] h3').length,
        lettre: (document.querySelector('.fin-lettre .lesson') || {}).innerHTML || '', mot: tx('.card.mot .lesson').join(' '), retour: !!document.querySelector('[data-act="back"]'), impr: q('[data-act="imprimer"]').length, sw: document.documentElement.scrollWidth, iw: innerWidth };
    });
    ok(r.vue && r.h1 === 'Le chemin de Camille' && /^Du 3 mai 2026 au \d{1,2} \S+ \d{4}\. 24 étapes faites sur 24, et 5 pages écrites\.$/.test(r.sub), 'final : le titre porte le prénom, avec les dates et les comptes (' + r.sub + ')');
    ok(r.h2.join(' | ') === 'Mon point de départ | Mes 3 points | Les photos que j’ai choisies | Ce que j’ai écrit | Ma lettre', 'final : les 5 parties, dans l’ordre (' + r.h2.join(' | ') + ')');
    ok(/je crie trop/.test(r.dep), 'final : la phrase écrite à l’étape 1 ouvre la page');
    ok(r.lignes === 5 && r.barres === 15 && r.v1.join(',') === '8,6,4' && r.legende === 3 && r.ouv === 2, 'final : les 3 points de « Mon évolution », 5 échelles, et les réponses écrites ' + JSON.stringify([r.lignes, r.barres, r.v1, r.legende, r.ouv]));
    ok(r.photos.length === 3 && /aube\.webp$/.test(r.photos[0]) && /col\.webp$/.test(r.photos[1]) && /soleil\.webp$/.test(r.photos[2]) && r.legPhotos.length === 3, 'final : les 3 photos choisies, dans l’ordre');
    ok(r.ecrits.length === 3 && r.moisE === 3 && r.ecrits.every(l => !/Étape 1,|Étape 24,/.test(l)), 'final : les pages du carnet, mois par mois, sans la première phrase ni la lettre qui ont leur place à part ' + r.ecrits.join(' | '));
    ok(/Tu ne le sais pas encore, mais tu vas y arriver\.<br>Tu apprendras/.test(r.lettre), 'final : la lettre est là, avec ses retours à la ligne');
    ok(/La vie est un cadeau\.$/.test(r.mot.trim()), 'final : le mot de la fin d’Antonio ferme la page');
    ok(r.retour && r.impr === 1 && r.sw <= r.iw, 'final : un bouton Retour, un bouton pour imprimer, rien ne dépasse');
    await page.evaluate(axeSrc);
    const viol = await page.evaluate(async () => { const r = await axe.run(document, { resultTypes: ['violations'] }); return r.violations.map(x => x.id + ' (' + x.nodes.length + ') ' + x.nodes.slice(0, 2).map(q => q.target.join(' ')).join(' | ')); });
    ok(viol.length === 0, 'final rempli : aucune règle d’accessibilité en défaut ' + viol.join(' ; '));
    await page.evaluate(() => scrollTo(0, 0)); await page.click(A('imprimer')); await page.waitForTimeout(100);
    ok((await page.evaluate(() => window.__imprime)) === 1, 'final : le bouton lance l’impression');
    // les photos se chargent quand on y arrive
    await page.evaluate(() => document.querySelector('.fin-photos').scrollIntoView({ block: 'center' })); await page.waitForTimeout(900);
    ok(await page.evaluate(() => [...document.querySelectorAll('.fin-photo img')].every(i => i.complete && i.naturalWidth > 0)), 'final : les 3 photos sont chargées');
    // ---------- 2. À l'impression : fond blanc, texte sombre, sans menu ni bouton
    await page.emulateMedia({ media: 'print' }); await page.waitForTimeout(200);
    const p = await page.evaluate(() => { const cs = (s, k) => { const e = document.querySelector(s); return e ? getComputedStyle(e)[k] : null; }; const lum = c => { const m = (c || '').match(/\d+/g).map(Number); return (0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]) / 255; };
      return { fond: getComputedStyle(document.body).backgroundColor, tabs: cs('.tabs', 'display'), bar: cs('.bar', 'display'), mode: cs('.fin-mode', 'display'), texte: lum(cs('.fin-lettre .lesson', 'color')), titre: lum(cs('h1', 'color')), carte: cs('.card.page', 'breakInside'), sw: document.documentElement.scrollWidth, iw: innerWidth }; });
    ok(p.fond === 'rgb(255, 255, 255)' && p.tabs === 'none' && (p.bar === 'none' || p.bar === null) && p.mode === 'none', 'impression : fond blanc, sans onglets, sans barre, sans le bloc du bouton ' + JSON.stringify([p.fond, p.tabs, p.bar, p.mode]));
    ok(p.texte < 0.25 && p.titre < 0.25 && p.carte === 'avoid' && p.sw <= p.iw, 'impression : texte sombre, une carte ne se coupe pas entre 2 pages ' + JSON.stringify([p.texte, p.titre, p.carte]));
    const pdf = await page.pdf({ format: 'A4', printBackground: true }); fs.mkdirSync('/home/claude/build/final/vue', { recursive: true }); fs.writeFileSync('/home/claude/build/final/vue/mon-chemin.pdf', pdf);
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    ok(pdf.length > 20000 && pages >= 1 && pages <= 6, 'impression : le PDF sort, en ' + pages + ' page(s)');
    await page.emulateMedia({ media: 'screen' });
    // ---------- 3. Les accès : la dernière étape, le carnet, le parcours terminé
    await page.click(A('back')); await page.waitForTimeout(300);
    ok(!!(await page.$('#app.v-me')), 'final : Retour ramène à « Moi », d’où l’on venait');
    await tab(page, 'parcours'); await page.waitForTimeout(250);
    ok(!!(await page.$('.fin-appel')) && /au bout des 24 étapes/.test(await page.textContent('.fin-appel')), 'parcours terminé : une carte invite à voir son chemin');
    await page.click(A('step', '[data-i="23"]')); await page.waitForTimeout(250);
    await page.click('.quick ' + A('go', '[data-view="final"]')); await page.waitForTimeout(400);
    ok(!!(await page.$('#app.v-final')), 'dernière étape : « Voir mon chemin en entier » ouvre le final');
    await page.click(A('back')); await page.waitForTimeout(300);
    ok(!!(await page.$('#app.v-step')) && /Le chemin parcouru/.test(await page.textContent('h1')), 'final : Retour ramène à la dernière étape');
    await page.click(A('back')); await page.waitForTimeout(200); await page.click('.quick ' + A('go', '[data-view="carnet"]')); await page.waitForTimeout(250);
    await page.click('main ' + A('go', '[data-view="final"]')); await page.waitForTimeout(400);
    ok(!!(await page.$('#app.v-final')), 'carnet de route : le bouton « Mon chemin, la page à garder » ouvre le final');
    ok(errs.length === 0, 'final : aucune erreur ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  // ---------- 4. Un parent qui commence : la page est vide et le dit ; le parcours n'affiche pas la carte de fin
  {
    const { ctx, page, errs } = await ouvre(BASE);
    await tab(page, 'parcours'); await page.waitForTimeout(250);
    ok(!(await page.$('.fin-appel')), 'parcours en cours : pas de carte de fin');
    await tab(page, 'me'); await page.waitForTimeout(200); await page.click('.sit' + A('go', '[data-view="final"]')); await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({ h1: document.querySelector('h1').textContent, t: document.querySelector('main').textContent, blocs: document.querySelectorAll('.fin-bloc').length, btn: !!document.querySelector('main [data-act="step"]') }));
    ok(r.h1 === 'Le chemin de Camille' && /Votre chemin est encore vide/.test(r.t) && r.blocs === 0 && r.btn, 'final vide : il le dit, et propose d’ouvrir l’étape du moment');
    // ---------- 5. Les photos choisies sont gardées l'une après l'autre
    await page.click(A('back')); await page.waitForTimeout(200); await tab(page, 'parcours'); await page.waitForTimeout(250);
    await page.click('.quick ' + A('go', '[data-view="photo"]')); await page.waitForTimeout(400);
    const choisir = async (id, texte) => { if (await page.$(A('photoback'))) { await page.click(A('photoback')); await page.waitForTimeout(350); } await page.click(A('photopick', `[data-id="${id}"]`)); await page.waitForTimeout(450); await page.fill('#ptext', texte); await page.click(A('photosave')); await page.waitForTimeout(250); };
    await choisir('aube', 'Un début.');
    let d = await garde(page); ok(Array.isArray(d.photos) && d.photos.length === 1 && d.photos[0].id === 'aube' && d.photos[0].text === 'Un début.' && d.photo.id === 'aube', 'photo gardée : elle entre dans l’historique');
    await choisir('mer', 'Finalement, celle-ci.');
    d = await garde(page); ok(d.photos.length === 1 && d.photos[0].id === 'mer', 'un autre choix le même jour remplace celui du jour ' + JSON.stringify(d.photos.map(p => p.id)));
    await page.evaluate(() => { const x = JSON.parse(localStorage.getItem('pepe-v1')); x.photos[0].date = '2026-05-03'; x.photo.date = '2026-05-03'; localStorage.setItem('pepe-v1', JSON.stringify(x)); }); await page.reload(); await page.waitForTimeout(600);
    await tab(page, 'parcours'); await page.waitForTimeout(250); await page.click('.quick ' + A('go', '[data-view="photo"]')); await page.waitForTimeout(400);
    await choisir('soleil', 'Je respire.');
    d = await garde(page); ok(d.photos.length === 2 && d.photos[0].id === 'mer' && d.photos[1].id === 'soleil', 'un choix fait un autre jour s’ajoute au précédent ' + JSON.stringify(d.photos.map(p => p.id)));
    ok(errs.length === 0, 'photos : aucune erreur ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  // ---------- 6. Un parent d'avant : sa photo déjà gardée ouvre l'historique
  {
    const { ctx, page, errs } = await ouvre(Object.assign({}, BASE, { photo: { id: 'aube', text: 'Un début.', date: '2026-05-03' }, notes: { depart: { t: 'Je commence.', d: '2026-05-03' } } }));
    await tab(page, 'me'); await page.waitForTimeout(200); await page.click('.sit' + A('go', '[data-view="final"]')); await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({ photos: document.querySelectorAll('.fin-photo').length, h2: [...document.querySelectorAll('.fin-bloc>h2')].map(e => e.textContent).join(' | '), lettre: document.querySelector('[aria-labelledby="fin-let"]').textContent }));
    ok(r.photos === 1 && /La photo que j’ai choisie/.test(r.h2) && /Votre lettre vous attend à la dernière étape/.test(r.lettre), 'parent d’avant : sa photo est reprise, et la lettre est annoncée ' + r.h2);
    ok(errs.length === 0, 'reprise : aucune erreur ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  // ---------- 7. Petit écran et grand écran
  for (const [w, h] of [[320, 568], [1280, 800]]) {
    const { ctx, page, errs } = await ouvre(PLEIN, { ctx: { viewport: { width: w, height: h } } });
    if (w < 1024) await tab(page, 'me'); else await page.click('.tabs ' + A('go', '[data-view="me"]')); await page.waitForTimeout(250);
    await page.click('.sit' + A('go', '[data-view="final"]')); await page.waitForTimeout(500);
    const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, hors: [...document.querySelectorAll('main.final *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > innerWidth + 1; }).length }));
    ok(r.sw <= r.iw && r.hors === 0, w + ' px : rien ne dépasse dans le final ' + JSON.stringify(r));
    ok(errs.length === 0, w + ' px : aucune erreur ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  await b.close();
  console.log('final : ' + n + ' vérifications, ' + ko + ' échec' + (ko > 1 ? 's' : ''));
  process.exit(ko ? 1 : 0);
})();
