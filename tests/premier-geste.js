// Trois parcours de bout en bout, sur téléphone puis sur ordinateur, comme les vivrait un parent.
//   1. Il est 21 h 40. Un nouveau parent veut souffler immédiatement.
//   2. Un parent d'adulte reçoit une fiche par lien direct.
//   3. Un parent déjà venu souhaite reprendre son étape.
// usage : node premier-geste.js [--court]     (--court : la respiration n'est pas suivie jusqu'au bout des 2 minutes)
// Variables : PEPE_ORIGIN, PEPE_BASE (chemin de l'app), PEPE_PUBLIC (adresse publique de l'app), PEPE_KEY (clé de rangement, « pepe-v1 » par défaut).
// Le même fichier vérifie la version servie en local et une version en ligne.
const { chromium } = require('playwright');
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8445';
const BASE = process.env.PEPE_BASE || '/';
const APP = ORIGIN + BASE;
const PUBLIC = process.env.PEPE_PUBLIC ? process.env.PEPE_PUBLIC.replace(/\/?$/, '/') : 'https://parent-ecoute.ch' + BASE;
const KEY = process.env.PEPE_KEY || 'pepe-v1';
const COURT = process.argv.includes('--court');
const EN_LIGNE = !/localhost/.test(ORIGIN);
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
let n = 0, ko = 0; const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC : ' + m); } };
const net = s => (s || '').split(String.fromCharCode(160)).join(' ').replace(/\s+/g, ' ').trim();
const iso = d => { const x = new Date(Date.now() + d * 86400000); const p = v => String(v).padStart(2, '0'); return x.getFullYear() + '-' + p(x.getMonth() + 1) + '-' + p(x.getDate()); };
// L'horloge du visiteur : même jour, mais à l'heure voulue (21 h 40 par défaut), et éventuellement quelques jours plus tard.
const horloge = ([h, jours]) => { const D0 = Date; const base = new D0(); base.setHours(Math.floor(h), Math.round((h % 1) * 60), 0, 0); const dec = base.getTime() - D0.now() + (jours || 0) * 86400000;
  class D extends D0 { constructor(...x) { if (x.length) super(...x); else super(D0.now() + dec); } static now() { return D0.now() + dec; } } window.Date = D; };
const FORMATS = [['téléphone', { viewport: { width: 390, height: 664 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }], ['ordinateur', { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 }]];

(async () => {
  // PEPE_CHROME : le navigateur à utiliser. Sans lui, celui de l'atelier s'il existe, sinon celui que Playwright a installé.
  const LOCAL = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
  const exe = process.env.PEPE_CHROME || (require('fs').existsSync(LOCAL) ? LOCAL : undefined);
  const browser = await chromium.launch(Object.assign({ args: ['--ignore-certificate-errors'] }, exe ? { executablePath: exe } : {}));
  const ouvre = async (fmt, opt = {}) => {
    const ctx = await browser.newContext(Object.assign({ locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: opt.calme ? 'reduce' : 'no-preference', permissions: ['clipboard-read', 'clipboard-write'] }, fmt, opt.ctx || {}));
    await ctx.addInitScript(horloge, [opt.heure === undefined ? 21 + 40 / 60 : opt.heure, opt.jours || 0]);
    if (opt.notes) await ctx.addInitScript(([k, d]) => { try { if (!localStorage.getItem('__pose')) { localStorage.setItem(k, d); localStorage.setItem('__pose', '1'); } } catch (e) { } }, [KEY, JSON.stringify(opt.notes)]);
    if (opt.init) await ctx.addInitScript(opt.init);
    const errs = [];
    // un onglet : le premier, ou un nouveau plus tard (le parent a fermé le sien et revient)
    const onglet = async () => { const page = await ctx.newPage();
      page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
      page.on('request', r => { const u = r.url(); if (!u.startsWith(ORIGIN) && !/^(data|blob|about):/.test(u)) errs.push('requête vers un autre site : ' + u.slice(0, 100)); });
      return page; };
    const page = await onglet();
    return { ctx, page, errs, onglet };
  };
  const notes = page => page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return 'illisible'; } }, KEY);
  const dansEcran = (page, sel) => page.$$eval(sel, L => L.length > 0 && L.every(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.top >= 0 && r.bottom <= innerHeight + 0.5 && r.left >= 0 && r.right <= innerWidth + 0.5; }));
  const h1 = page => page.$eval('h1', e => e.textContent).then(net).catch(() => '');

  for (const [nom, fmt] of FORMATS) {
    const P = m => nom + ' · ' + m;
    const tel = nom === 'téléphone';

    // =====================================================================================================================
    // 1. Il est 21 h 40. Un nouveau parent veut souffler immédiatement.
    // =====================================================================================================================
    {
      const { ctx, page, errs } = await ouvre(fmt);
      const t0 = Date.now(); await page.goto(APP, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.seuil .porte'); const tPortes = Date.now() - t0;
      await page.waitForTimeout(600);
      ok(tPortes < (EN_LIGNE ? 4000 : 1500), P('1. les 3 portes sont à l’écran en ' + tPortes + ' ms'));
      const acc = await page.evaluate(() => ({ salut: document.querySelectorAll('.seuil .salut').length, besoin: document.querySelector('.seuil .besoin').textContent, clair: document.documentElement.classList.contains('clair'), fond: getComputedStyle(document.body).backgroundColor, portes: [...document.querySelectorAll('.seuil .porte b')].map(e => e.textContent), bandeau: !!document.getElementById('consent'), nuit: document.documentElement.className }));
      ok(acc.salut === 0 && net(acc.besoin) === 'Qu’aimeriez-vous qu’on comprenne de votre journée ?' && acc.portes.map(net).join('|') === 'Déposer ce qui pèse|Souffler 2 minutes|Trouver une idée pour ce soir' && /\bh-soir\b/.test(acc.nuit) && !acc.clair && acc.fond === 'rgb(7, 36, 15)', P('1. à 21 h 40 : « Qu’aimeriez-vous qu’on comprenne de votre journée ? », 3 portes, écrire d’abord, et la table sombre du soir ' + JSON.stringify(acc)));
      ok(!acc.bandeau, P('1. aucun bandeau ne se met devant le premier écran'));
      ok(await dansEcran(page, '.seuil h1, .seuil .porte, main.intro .hbar .sos'), P('1. la question, les 3 portes et le SOS tiennent dans l’écran sans défiler'));
      ok((await notes(page)) === null, P('1. rien n’est enregistré avant le premier geste'));
      // un geste
      const t1 = Date.now(); await page.click('.seuil ' + A('porte', '[data-v="souffle"]')); await page.waitForSelector('main.souffle.s-cours'); const tGeste = Date.now() - t1;
      ok(tGeste < 1200 && !(await page.$('.sheet')) && !(await page.$('input, textarea')), P('1. un seul geste mène à la respiration (' + tGeste + ' ms), sans formulaire ni question'));
      const d0 = await notes(page);
      ok(d0 && d0.onboarded === true && d0.age === '' && d0.situation === '' && d0.me === '' && d0.weights.length === 0, P('1. rien n’est coché à la place du parent ' + JSON.stringify(d0 && [d0.age, d0.situation, d0.weights])));
      // la respiration : 4 secondes pour inspirer, 6 pour expirer
      await page.waitForFunction(() => document.getElementById('souffle-mot').textContent === 'Inspirez', null, { timeout: 4000 }); const tIn = Date.now();
      const s1 = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.souffle .ronds')).getPropertyValue('--s')));
      await page.waitForFunction(() => document.getElementById('souffle-mot').textContent === 'Expirez', null, { timeout: 6000 }); const tOut = Date.now();
      const s2 = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.souffle .ronds')).getPropertyValue('--s')));
      ok(Math.abs((tOut - tIn) - 4000) < 450, P('1. l’inspiration dure 4 secondes (' + (tOut - tIn) + ' ms)'));
      // À l'inspiration la goutte de la photo s'élève. Quand le navigateur ne dessine pas l'eau, 2 cercles posés sur l'eau se resserrent à sa place.
      const eauVive = await page.evaluate(() => { const e = document.querySelector('.souffle .etang'); return e.classList.contains('eau-vive') && !!e.querySelector('canvas.eau'); });
      ok(eauVive || (s2 < 0.6 && s2 < s1), P('1. ' + (eauVive ? 'la goutte de la photo suit l’inspiration' : 'les cercles se sont resserrés pendant l’inspiration (' + s1 + ' → ' + s2 + ')')));
      await page.waitForFunction(() => document.getElementById('souffle-mot').textContent === 'Inspirez', null, { timeout: 8000 }); const tIn2 = Date.now();
      ok(Math.abs((tIn2 - tOut) - 6000) < 450 && (await page.$$('.souffle .tours i.f')).length === 1, P('1. l’expiration dure 6 secondes (' + (tIn2 - tOut) + ' ms), et la première respiration est comptée'));
      ok(await dansEcran(page, '#souffle-mot, .souffle .tours, ' + A('souffle-stop') + ', .souffle .sos'), P('1. le mot, le compte et « Arrêter » tiennent dans l’écran'));
      if (!COURT && tel) {
        // jusqu'au bout : 12 respirations, 2 minutes, comme le dit le bouton
        await page.waitForSelector('main.souffle.s-fini', { timeout: 125000 }); const tFin = Date.now();
        ok(Math.abs((tFin - tIn) - 120000) < 1500, P('1. la respiration s’arrête d’elle-même après 2 minutes (' + ((tFin - tIn) / 1000).toFixed(1) + ' s)'));
        ok(/Voilà/.test(await page.textContent('#souffle-mot')) && (await page.$$('.souffle .actions .btn')).length === 3, P('1. à la fin : un mot, et 3 suites possibles'));
        ok(net(await page.textContent('.souffle .actions .btn.primary')) === 'Lire la dose du jour', P('1. le premier bouton dit au nouveau parent ce qu’il va trouver ensuite'));
        await page.click('.souffle ' + A('go', '[data-view="today"]')); await page.waitForTimeout(700);
        // le bouton Retour du téléphone reste dans l'espace : il revient à l'écran de la respiration, puis on repart vers « Aujourd'hui »
        await page.goBack(); await page.waitForTimeout(500);
        ok(page.url() === APP && !!(await page.$('main.souffle')), P('1. le bouton Retour du téléphone revient à l’écran d’avant, sans sortir du site (' + page.url().replace(ORIGIN, '') + ')'));
        await page.goForward(); await page.waitForTimeout(500);
      } else {
        await page.click(A('souffle-stop')); await page.waitForTimeout(200);
        ok(!!(await page.$('main.souffle.s-pret')), P('1. « Arrêter » rend la main tout de suite'));
        // le bouton Retour du téléphone, depuis la respiration : il ramène d'où l'on vient, ici la vitrine, sans sortir du site
        await page.goBack(); await page.waitForTimeout(800);
        const vit = await page.evaluate(() => ({ intro: !!document.querySelector('main.intro'), portes: document.querySelectorAll('.seuil .porte').length, liens: [...document.querySelectorAll('.seuil .voie')].map(e => e.textContent.trim()) }));
        ok(page.url() === APP + '#accueil' && vit.intro && vit.portes === 3, P('1. le bouton Retour du téléphone ramène à la vitrine, d’où le parent venait (' + page.url().replace(ORIGIN, '') + ')'));
        ok(vit.liens.join('|') === 'Commencer le parcours de 6 mois|Ouvrir mon espace', P('1. la vitrine propose maintenant « Ouvrir mon espace » ' + JSON.stringify(vit.liens)));
        await page.click('.seuil ' + A('entrer', '[data-v="today"]')); await page.waitForSelector('.tabs'); await page.waitForTimeout(700);
      }
      // ensuite : l'espace, avec la dose en premier, et le choix de personnaliser
      const auj = await page.evaluate(() => { const m = document.getElementById('main'); const d = m && m.querySelector('.dose'); const r = d && d.getBoundingClientRect(); return { h: document.querySelector('h1').textContent, tabs: !!document.querySelector('.tabs'), dose: !!d, doseHaut: r ? Math.round(r.top) : -1, vh: innerHeight, perso: !!document.querySelector('.card.perso'), quest: !!document.querySelector('#main [data-view="evo"]'), rouvrir: [...document.querySelectorAll('.rouvrir .chip')].map(e => e.textContent.trim()) }; });
      ok(auj.tabs && auj.h === 'Bonsoir.' && auj.dose && auj.doseHaut < auj.vh && !auj.quest, P('1. après : « Aujourd’hui », avec la dose visible sans défiler et aucun questionnaire devant elle ' + JSON.stringify(auj)));
      ok(auj.perso, P('1. la personnalisation est proposée après, comme un choix'));
      ok(net(await page.textContent('.hint.demain').catch(() => '')) === 'Une nouvelle dose vous attend ici chaque matin.', P('1. sous la dose, une ligne dit qu’une autre attend le parent le lendemain'));
      if (!COURT && tel) ok(auj.rouvrir.includes('Souffler 2 minutes'), P('1. la respiration faite jusqu’au bout se retrouve dans « Rouvrir » ' + auj.rouvrir.join(',')));
      ok(errs.length === 0, P('1. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 1 bis. Les 2 autres portes tiennent elles aussi la promesse de leur libellé, en un geste.
    // =====================================================================================================================
    {
      const { ctx, page, errs } = await ouvre(fmt);
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.seuil .porte'); await page.waitForTimeout(500);
      // ce qui est visible : entre la barre du haut et, sur téléphone, la barre d'onglets du bas
      const visibles = (sel) => page.evaluate(sel => { const b = document.querySelector('header.bar'); const hb = b && getComputedStyle(b).display !== 'none' ? b.getBoundingClientRect().bottom : 0; const t = document.querySelector('.tabs'); const tr = t ? t.getBoundingClientRect() : null; const bas = tr && tr.top > innerHeight / 2 ? tr.top : innerHeight;
        const L = [...document.querySelectorAll(sel)]; return { n: L.length, vus: L.filter(e => { const r = e.getBoundingClientRect(); return r.height > 0 && r.top >= hb - 1 && r.bottom <= bas + 1; }).length, entames: L.filter(e => { const r = e.getBoundingClientRect(); return r.height > 0 && r.top >= hb - 1 && r.top < bas - 24; }).length, textes: L.map(e => (e.querySelector('b') || e).textContent.trim()) }; }, sel);
      // « Trouver une idée pour ce soir » : 4 situations d'abord, pour un enfant, un ado, un adulte et pour le parent, à ouvrir en un geste
      await page.click('.seuil ' + A('porte', '[data-v="piste"]')); await page.waitForSelector('main.k-piste'); await page.waitForTimeout(1300);
      const ps = await visibles('.ce-soir .sit');
      ok(net(await h1(page)) === 'Trouver une idée pour ce soir' && ps.textes.join('|') === 'Le coucher et la nuit|L’adolescence et le corps|Quand il ou elle vit ailleurs|Je n’en peux plus', P('1 bis. « Trouver une idée pour ce soir » ouvre sur 4 situations : un enfant, un ado, un adulte, et le parent ' + JSON.stringify(ps.textes)));
      // le choix de l'âge change les 4 propositions, sans quitter l'écran
      const parAge = async v => { await page.click('.autres-ages ' + A('age', '[data-v="' + v + '"]')); await page.waitForTimeout(350); return (await visibles('.ce-soir .sit')).textes.join('|'); };
      ok((await parAge('a')) === 'L’adolescence et le corps|Les écrans|Le coucher et la nuit|La crise', P('1 bis. « Ado » propose 4 situations de parents d’ados'));
      ok((await parAge('g')) === 'Quand il ou elle vit ailleurs|Le passage à l’âge adulte|La crise|Je n’en peux plus', P('1 bis. « Adulte » propose 4 situations de parents d’adultes'));
      ok((await parAge('e')) === 'Le coucher et la nuit|La crise|Le refus|Les écrans', P('1 bis. « Enfant » propose 4 situations de parents d’enfants'));
      await parAge('all');
      ok(ps.vus >= 3 && ps.entames === 4 && !(await page.$('.souvent')) && !(await page.$('.sheet')), P('1 bis. ces pistes sont à l’écran sans défiler, sans formulaire devant (' + ps.vus + ' entières, ' + ps.entames + ' visibles sur ' + ps.n + ')'));
      await page.click('.ce-soir .sit'); await page.waitForSelector('main.fiche'); await page.waitForTimeout(600);
      ok((await h1(page)) === 'Le coucher et la nuit' && page.url() === APP + 'fiches/le-coucher-et-la-nuit/', P('1 bis. une piste s’ouvre en un geste (' + page.url().replace(ORIGIN, '') + ')'));
      await page.goBack(); await page.waitForTimeout(800);
      ok(net(await h1(page)) === 'Trouver une idée pour ce soir' && (await page.$$('.ce-soir .sit')).length === 4, P('1 bis. le bouton Retour du téléphone ramène aux idées du soir'));
      await page.click('.tabs ' + A('go', '[data-view="kit"]')); await page.waitForTimeout(800);
      ok((await h1(page)) === 'La boîte à outils' && !(await page.$('.ce-soir')) && !!(await page.$('.souvent')), P('1 bis. l’onglet « Outils » montre ensuite la boîte entière'));
      // « Déposer ce qui pèse » : après l'envoi, la question et la lumière sont sous les yeux
      await page.click('.tabs ' + A('go', '[data-view="today"]')); await page.waitForSelector('.portes.mini'); await page.waitForTimeout(500);
      await page.click('.portes.mini ' + A('porte', '[data-v="deposer"]')); await page.waitForSelector('main.deposer #draft'); await page.waitForTimeout(500);
      ok(!(await page.$('.sheet')) && (await visibles('main.deposer #draft, main.deposer ' + A('dsend'))).vus === 2, P('1 bis. « Déposer » ouvre sur la zone d’écriture et son bouton, sans rien devant'));
      await page.fill('#draft', 'Je suis épuisée. Le coucher a duré 2 heures et je culpabilise d’avoir crié.'); await page.click('main.deposer ' + A('dsend'));
      await page.waitForSelector('main.deposer .mirror .q', { timeout: 6000 }); await page.waitForTimeout(1700);
      const rep = await visibles('main.deposer .mirror .q, main.deposer .mirror .l');
      ok(rep.n === 2 && rep.vus === 2, P('1 bis. après « Déposer », la question et la lumière sont à l’écran sans défiler (' + rep.vus + ' sur ' + rep.n + ')'));
      const pd = await visibles('main.deposer .pistes-depot .sit');
      ok(pd.n >= 1 && pd.n <= 2 && pd.textes.includes('Le coucher et la nuit') && pd.entames >= 1, P('1 bis. une piste en rapport avec les mots du parent suit la réponse ' + JSON.stringify(pd.textes)));
      const dn = await notes(page);
      ok(dn && dn.depots.length === 1 && dn.depots[0].text.indexOf('Je suis épuisée') === 0 && (await page.inputValue('#draft')) === '', P('1 bis. le dépôt est gardé sur l’appareil, et la zone d’écriture est vide de nouveau'));
      ok(errs.length === 0, P('1 bis. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 2. Un parent d'adulte reçoit une fiche par lien direct.
    // =====================================================================================================================
    {
      const CHEMIN = 'fiches/quand-il-ou-elle-vit-ailleurs/';
      // ce que voit une messagerie quand on y colle le lien : la page telle qu'elle est écrite, sans JavaScript
      const { ctx, page, errs } = await ouvre(fmt);
      const rep = await ctx.request.get(APP + CHEMIN); const brut = await rep.text();
      const meta = k => (brut.match(new RegExp('<meta (?:property|name)="' + k + '" content="([^"]*)"')) || [])[1] || '';
      const dec = s => s.replace(/&#x27;|&#39;/g, '’').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
      ok(rep.status() === 200 && /<h1[^>]*>Quand il ou elle vit ailleurs<\/h1>/.test(brut) && /Confier son enfant adulte à une institution/.test(brut) && /La maison vide le dimanche soir/.test(brut), P('2. la fiche entière est écrite dans la page (lisible sans JavaScript)'));
      ok(/<title>Quand il ou elle vit ailleurs, une fiche de Parent écouté, parent éclairé<\/title>/.test(brut) && dec(meta('og:title')) === 'Quand il ou elle vit ailleurs' && /^Confier son enfant adulte à une institution/.test(dec(meta('description'))) && dec(meta('description')).length >= 90 && dec(meta('description')).length <= 200 && dec(meta('og:description')) === dec(meta('description')), P('2. titre et phrase d’aperçu parlants (' + dec(meta('description')).length + ' caractères)'));
      ok(meta('og:url') === PUBLIC + CHEMIN && new RegExp('<link rel="canonical" href="' + (PUBLIC + CHEMIN).replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&') + '">').test(brut) && meta('twitter:card') === 'summary_large_image' && meta('og:type') === 'article', P('2. l’adresse annoncée est celle de la fiche, et rien d’autre (' + meta('og:url') + ')'));
      const img = meta('og:image'); const imgLocal = img.replace(PUBLIC, APP);
      const ri = await ctx.request.get(imgLocal); const octets = await ri.body();
      ok(img === PUBLIC + 'img/fiches/quand-il-ou-elle-vit-ailleurs.jpg' && ri.status() === 200 && /jpeg/.test(ri.headers()['content-type'] || '') && octets.length > 20000 && octets.length < 200000 && meta('og:image:width') === '1200', P('2. l’image d’aperçu de la fiche existe (' + Math.round(octets.length / 1024) + ' Ko)'));
      await ctx.close();
      // sans JavaScript : la fiche se lit quand même
      {
        const o = await ouvre(fmt, { ctx: { javaScriptEnabled: false } });
        await o.page.goto(APP + CHEMIN); await o.page.waitForTimeout(300);
        const v = await o.page.evaluate(() => { const h = document.querySelector('h1'), r = h && h.getBoundingClientRect(); return { h: h ? h.textContent : '', vu: !!r && r.top < innerHeight && getComputedStyle(document.getElementById('app')).visibility === 'visible', blocs: document.querySelectorAll('main.fiche .sec').length }; });
        ok(v.h === 'Quand il ou elle vit ailleurs' && v.vu && v.blocs === 4, P('2. sans JavaScript, la fiche est à l’écran ' + JSON.stringify(v)));
        await o.ctx.close();
      }
      // le parent qui reçoit le lien
      {
        const o = await ouvre(fmt, { init: () => { window.__partages = []; try { Object.defineProperty(navigator, 'share', { configurable: true, value: d => { window.__partages.push(JSON.parse(JSON.stringify(d))); return Promise.resolve(); } }); } catch (e) { } } });
        const page = o.page;
        const t0 = Date.now(); await page.goto(APP + CHEMIN, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('main.fiche h1'); const tFiche = Date.now() - t0; await page.waitForTimeout(600);
        const v = await page.evaluate(() => { const q = s => document.querySelector(s); const r = q('main.fiche h1').getBoundingClientRect(); return { h: q('h1').textContent, haut: Math.round(r.top), tabs: !!q('.tabs'), sos: !!q('.pubbar .sos'), bandeau: !!q('#consent'), feuille: !!q('.sheet'), titre: document.title, ages: q('.couv .label').textContent, essayer: document.querySelectorAll('.sec.ess li').length, eviter: document.querySelectorAll('.sec.ev li').length, mot: !!q('.comfort p'), aide: !!q('.sec.aide p') }; });
        ok(tFiche < (EN_LIGNE ? 4000 : 1500) && v.h === 'Quand il ou elle vit ailleurs' && v.haut < 400 && !v.bandeau && !v.feuille && !v.tabs, P('2. le lien ouvre la bonne fiche, tout de suite (' + tFiche + ' ms), sans rien devant ' + JSON.stringify(v)));
        ok(v.ages === 'Adulte' && v.essayer === 5 && v.eviter === 2 && v.mot && v.aide && v.sos, P('2. la fiche est complète (ce qui se passe, 5 pistes, 2 choses à éviter, un mot pour vous, quand demander de l’aide), et le SOS est là'));
        ok(/^Quand il ou elle vit ailleurs, une fiche de/.test(v.titre) && page.url() === APP + CHEMIN, P('2. l’onglet porte le titre de la fiche, et l’adresse n’a pas bougé'));
        ok((await notes(page)) === null, P('2. lire la fiche ne crée rien sur l’appareil'));
        // la renvoyer à quelqu'un : le lien de la fiche, et rien d'autre
        await page.$eval(A('partager'), e => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(200);
        ok(await dansEcran(page, A('partager')), P('2. le bouton « Envoyer cette fiche » est atteignable'));
        await page.click(A('partager')); await page.waitForTimeout(300);
        const part = await page.evaluate(() => window.__partages);
        ok(part.length === 1 && Object.keys(part[0]).sort().join() === 'title,url' && part[0].title === 'Quand il ou elle vit ailleurs' && part[0].url === PUBLIC + CHEMIN && !/[?#]/.test(part[0].url), P('2. « Envoyer cette fiche » donne à la messagerie le titre et l’adresse publique, rien d’autre ' + JSON.stringify(part)));
        // une autre fiche du même thème, puis Retour
        await page.$eval('.proches', e => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(200);
        const y0 = await page.evaluate(() => Math.round(scrollY));
        await page.click('.proches .sit'); await page.waitForTimeout(900);
        const autre = await page.evaluate(() => ({ h: document.querySelector('h1').textContent, y: Math.round(scrollY), u: location.pathname }));
        ok(autre.h !== 'Quand il ou elle vit ailleurs' && autre.y < 5 && /\/fiches\/[a-z0-9-]+\/$/.test(autre.u) && autre.u !== new URL(APP + CHEMIN).pathname, P('2. une fiche voisine s’ouvre en haut de page, avec sa propre adresse (' + autre.u + ')'));
        await page.goBack(); await page.waitForTimeout(900);
        const retour = await page.evaluate(() => ({ h: document.querySelector('h1').textContent, y: Math.round(scrollY), u: location.href }));
        ok(retour.h === 'Quand il ou elle vit ailleurs' && retour.u === APP + CHEMIN && Math.abs(retour.y - y0) < 40, P('2. le bouton Retour du téléphone revient à la première fiche, à l’endroit où on l’avait laissée (' + y0 + ' → ' + retour.y + ')'));
        // un rechargement de l'adresse d'une fiche (le lien rouvert plus tard)
        await page.reload(); await page.waitForSelector('main.fiche h1'); await page.waitForTimeout(400);
        ok((await h1(page)) === 'Quand il ou elle vit ailleurs' && (await notes(page)) === null, P('2. le lien rouvert plus tard mène toujours à la fiche'));
        // et l'espace, à un geste : la porte « Déposer » en bas de la fiche
        await page.$eval('.invite', e => e.scrollIntoView({ block: 'start' })); await page.waitForTimeout(200);
        ok((await page.$$('.invite .porte')).length === 3 && /Antonio Company, éducateur social, responsable d’une équipe socio-éducative et père de 3 enfants/.test(await page.textContent('.invite')), P('2. en bas de la fiche : d’où elle vient (avec les 2 rôles d’Antonio), et les 3 portes'));
        await page.click('.invite ' + A('porte', '[data-v="deposer"]')); await page.waitForTimeout(900);
        ok(!!(await page.$('main.deposer #draft')) && page.url() === APP && (await notes(page)).onboarded === true, P('2. « Déposer ce qui pèse » ouvre l’écran pour écrire, à l’adresse de l’espace'));
        await page.goBack(); await page.waitForTimeout(900);
        ok((await h1(page)) === 'Quand il ou elle vit ailleurs' && !!(await page.$('.tabs')) && !!(await page.$('.bar .back')), P('2. Retour : la fiche, cette fois dans l’espace du parent'));
        ok(o.errs.length === 0, P('2. aucune erreur ' + o.errs.slice(0, 3).join(' | ')));
        await o.ctx.close();
      }
      // sans le partage du téléphone (un ordinateur) : le lien est copié, et l'écran le dit
      {
        const o = await ouvre(fmt, { init: () => { try { Object.defineProperty(navigator, 'share', { configurable: true, value: undefined }); } catch (e) { } } });
        await o.page.goto(APP + CHEMIN); await o.page.waitForSelector(A('partager')); await o.page.waitForTimeout(300);
        await o.page.$eval(A('partager'), e => e.scrollIntoView({ block: 'center' })); await o.page.click(A('partager')); await o.page.waitForTimeout(400);
        const colle = await o.page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
        ok(colle === PUBLIC + CHEMIN && /copié/.test((await o.page.textContent('.toast').catch(() => '')) || ''), P('2. sans partage du téléphone : le lien est copié et un message le dit (' + colle + ')'));
        await o.ctx.close();
      }
    }

    // =====================================================================================================================
    // 3. Un parent déjà venu souhaite reprendre son étape.
    // =====================================================================================================================
    {
      // des notes telles que le site d'avant les enregistrait (version 2) : prénom, réponses, étapes, carnet, dépôt, point de départ, humeur
      const AVANT = { fxOff: false, tier: 'parcours', me: 'Camille', age: 'a', situation: 'diff', weights: ['fatigue', 'doutes'], start: iso(-10), moods: { [iso(-1)]: 1 },
        depots: [{ id: 'd1', date: iso(-2), time: '21:05', text: 'Hier soir il a claqué la porte et je suis restée seule dans le couloir.', mode: 'listen', question: 'Qu’est-ce qui, dans tout ça, dépend vraiment de vous ?', lumiere: 'Vous avez le droit d’être fatigué.' }],
        shared: {}, steps: { depart: true }, notes: { depart: { t: 'Je commence parce que je veux retrouver des soirées plus calmes.', d: iso(-10) } }, seen: { depart: iso(-10), croire: iso(-3) }, pv: 2, atelier: false, tout: false,
        evo: { t1: { date: iso(-10), stress: 7, comp: 4, seul: 6, regard: 5, confiance: 4, avant: 'Pas grand-chose.', change: '' } }, photo: null, photos: [], abc: [], phrases: ['On respire comme le dragon'], routineDone: {}, ft: { first: 'dents', then: 'histoire' }, three: [], letters: [], questions: [], onboarded: true, doseDate: '', doseText: '' };
      const o3 = await ouvre(fmt, { notes: AVANT, calme: true }); const { ctx, errs } = o3; let page = o3.page;
      const t0 = Date.now(); await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.step.semaine'); const tAuj = Date.now() - t0; await page.waitForTimeout(500);
      const a = await page.evaluate(() => { const q = s => document.querySelector(s); const pos = s => { const e = q(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : -1; }; return { h: q('h1').textContent, accueil: !!q('.seuil'), revenu: document.documentElement.classList.contains('returning'), dose: (q('.dose p') || {}).textContent || '', yDose: pos('.dose'), yEtape: pos('.step.semaine'), etape: q('.step.semaine b').textContent, lab: q('.step.semaine .label').textContent, aller: q('.step.semaine .aller').textContent.trim(), fil: q('.reprendre .fil .ou').textContent, perso: !!q('.card.perso'), portes: document.querySelectorAll('.portes.mini .porte').length }; });
      ok(tAuj < (EN_LIGNE ? 4000 : 1500) && !a.accueil && a.revenu && a.h === 'Bonsoir, Camille.', P('3. le parent déjà venu arrive directement dans son espace (' + tAuj + ' ms), sans repasser par l’accueil ' + JSON.stringify([a.h, a.accueil])));
      ok(a.dose.length > 40 && a.yDose > 0 && a.yDose < a.yEtape && a.portes === 3, P('3. il retrouve sa dose du jour en premier, et les 3 portes'));
      ok(/^Croire en lui/.test(a.etape) && a.lab === 'L’étape de la semaine' && a.aller === 'Reprendre l’étape' && a.fil === 'Étape 2 sur 24', P('3. son étape l’attend, avec un seul geste pour la reprendre ' + JSON.stringify([a.etape, a.lab, a.aller, a.fil])));
      ok(!a.perso, P('3. on ne lui repropose pas de personnaliser un espace qu’il a déjà rempli'));
      // rien n'a été perdu en chemin
      const d = await notes(page) || AVANT;   // l'app ne réécrit ses notes qu'au premier changement : avant, elles sont telles quelles
      ok(d.me === 'Camille' && d.age === 'a' && d.situation === 'diff' && d.weights.join() === 'fatigue,doutes' && d.depots.length === 1 && d.depots[0].text === AVANT.depots[0].text && d.notes.depart.t === AVANT.notes.depart.t && d.steps.depart === true && d.seen.croire === AVANT.seen.croire && d.evo.t1.stress === 7 && d.phrases.length === 1 && d.ft.first === 'dents' && d.start === AVANT.start, P('3. les dépôts, le carnet, la progression et les réponses d’avant sont intacts'));
      // reprendre l'étape
      await page.click('.step.semaine'); await page.waitForTimeout(600);
      ok(!!(await page.$('main.etape')) && /Croire en lui/.test(await h1(page)) && !!(await page.$('#note')), P('3. un geste : l’étape 2 est ouverte, avec son carnet'));
      await page.$eval('#note', e => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(200);
      const yNote = await page.evaluate(() => Math.round(scrollY));
      await page.fill('#note', 'Je l’ai laissé choisir son pull ce matin.'); await page.waitForTimeout(700);
      const d2 = await notes(page);
      ok(d2.pv === 3 && d2.perso === true && d2.notes.croire.t === 'Je l’ai laissé choisir son pull ce matin.' && d2.notes.depart.t === AVANT.notes.depart.t && d2.depots.length === 1 && d2.steps.depart === true && d2.evo.t1.stress === 7 && d2.me === 'Camille' && d2.age === 'a', P('3. ce qu’il écrit est gardé à côté de ce qu’il avait déjà écrit (notes passées à la nouvelle version sans rien perdre)'));
      // le téléphone recharge la page pendant qu'il lit (il a changé d'application un instant) : il retrouve son étape, au même endroit, avec ce qu'il a écrit
      await page.reload(); await page.waitForSelector('#note'); await page.waitForTimeout(500);
      const rech = await page.evaluate(() => ({ etape: !!document.querySelector('main.etape'), note: document.getElementById('note').value, y: Math.round(scrollY) }));
      ok(rech.etape && rech.note === 'Je l’ai laissé choisir son pull ce matin.' && Math.abs(rech.y - yNote) < 60, P('3. page rechargée par le téléphone au milieu de l’étape : même écran, même endroit, et le carnet est là ' + JSON.stringify([rech.etape, yNote, rech.y])));
      // il ferme l'onglet et revient plus tard, dans un nouvel onglet : « Aujourd'hui » lui propose de reprendre son étape
      await page.close(); page = await o3.onglet();
      await page.goto(APP); await page.waitForSelector('.step.semaine'); await page.waitForTimeout(400);
      ok((await page.textContent('.step.semaine .aller')).trim() === 'Reprendre l’étape' && /Croire en lui/.test(await page.textContent('.step.semaine b')), P('3. après avoir fermé puis rouvert : l’étape en cours est toujours proposée'));
      // un outil rouvert sans chercher
      await page.click('.tab' + A('go', '[data-view="kit"]')); await page.waitForTimeout(500);
      await page.click(A('kit', '[data-v="tools"]')); await page.waitForTimeout(300); await page.click(A('tool', '[data-v="ft"]')); await page.waitForTimeout(300);
      ok(/D’abord/.test(await page.textContent('#main')) && (await notes(page)).recents[0].id === 'ft', P('3. l’outil « D’abord, ensuite » est ouvert, avec ses 2 images d’avant'));
      await page.click('.tab' + A('go', '[data-view="today"]')); await page.waitForTimeout(500);
      const rv = await page.$$eval('.rouvrir .chip', L => L.map(e => e.textContent.trim()));
      ok(rv[0] === 'D’abord, ensuite', P('3. « Aujourd’hui » propose de rouvrir ce dernier outil (' + rv.join(', ') + ')'));
      await page.close(); page = await o3.onglet();
      await page.goto(APP); await page.waitForSelector('.rouvrir .chip'); await page.waitForTimeout(300);
      await page.click('.rouvrir .chip'); await page.waitForTimeout(600);
      ok(!!(await page.$('#ft')) && (await page.$eval(A('tool', '[data-v="ft"]'), e => e.getAttribute('aria-pressed'))) === 'true', P('3. un geste, même après une nouvelle visite : l’outil est rouvert au bon endroit'));
      // le bouton Retour du téléphone
      await page.goBack(); await page.waitForTimeout(600);
      ok(/Camille/.test(await h1(page)) && !!(await page.$('.dose')), P('3. le bouton Retour du téléphone ramène à « Aujourd’hui »'));
      // ses dépôts d'avant sont là
      await page.click('.tab' + A('go', '[data-view="me"]')); await page.waitForTimeout(500); await page.click(A('go', '[data-view="depots"]')); await page.waitForTimeout(400);
      ok(/claqué la porte/.test(await page.textContent('.depots')) && /dépend vraiment de vous/.test(await page.textContent('.depots')), P('3. « Mes dépôts » montre le dépôt d’avant et sa réponse'));
      // un dépôt commencé, puis le téléphone recharge la page : le texte en cours n'est pas perdu
      await page.click('.tab' + A('go', '[data-view="today"]')); await page.waitForTimeout(400); await page.click('.portes ' + A('porte', '[data-v="deposer"]')); await page.waitForTimeout(500);
      await page.fill('#draft', 'Un texte que je n’ai pas fini d’écrire.'); await page.waitForTimeout(600);
      await page.reload(); await page.waitForSelector('#draft'); await page.waitForTimeout(400);
      ok(!!(await page.$('main.deposer')) && (await page.$eval('#draft', e => e.value)) === 'Un texte que je n’ai pas fini d’écrire.', P('3. page rechargée pendant qu’il écrit un dépôt : il retrouve l’écran et son texte'));
      await page.click(A('dsend')); await page.waitForTimeout(1200); await page.reload(); await page.waitForSelector('#draft'); await page.waitForTimeout(300);
      ok((await page.$eval('#draft', e => e.value)) === '' && (await notes(page)).depots.length === 2, P('3. une fois déposé, le texte en cours est effacé et le dépôt est gardé'));
      ok(errs.length === 0, P('3. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
      // le lendemain matin, sur le même appareil : une autre dose, un autre bonjour, la même étape
      const o2 = await ouvre(fmt, { notes: AVANT, calme: true, heure: 7.5, jours: 1 });
      await o2.page.goto(APP); await o2.page.waitForSelector('.dose p'); await o2.page.waitForTimeout(400);
      const b = await o2.page.evaluate(() => ({ h: document.querySelector('h1').textContent, dose: document.querySelector('.dose p').textContent, besoin: document.querySelector('.band .besoin').textContent, etape: document.querySelector('.step.semaine b').textContent, classe: document.getElementById('app').className, piste: document.querySelector('.portes.mini .porte[data-v="piste"]').getAttribute('aria-label') }));
      const dim = new Date(Date.now() + 86400000).getDay() === 0 || new Date().getDay() === 0;
      ok(b.h === 'Bonjour, Camille.' && net(b.besoin) === 'De quoi auriez-vous besoin ce matin ?' && /\bh-matin\b/.test(b.classe) && net(b.piste) === 'Trouver une idée pour ce matin' && /^Croire en lui/.test(b.etape), P('3. le lendemain à 7 h 30 : le bonjour, la question et la lumière du matin, et la même étape ' + JSON.stringify([b.h, b.besoin, b.piste])));
      ok(dim || net(b.dose) !== net(a.dose), P('3. le lendemain : une autre dose l’attend'));
      await o2.ctx.close();
    }
  }
  await browser.close();
  console.log('premier geste : ' + n + ' vérifications, ' + ko + ' échec' + (ko > 1 ? 's' : '') + ' (' + APP + ')');
  process.exit(ko ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
