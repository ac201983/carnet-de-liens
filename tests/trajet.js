// Le trajet « Je découvre, j'essaie, je vois ma fiche », comme le vit un parent, sur 2 téléphones (375 et 390 points de large) puis sur un ordinateur.
//   1. Je découvre : le premier écran commence par le parent, la question est le point d'attention, et chaque aide fait ce que son libellé annonce.
//   2. J'essaie : « Et si vous prépariez les trois choses à savoir pour samedi ? », une occasion, 3 repères écrits dans la fiche elle-même.
//   3. Je vois ma fiche : à la place du proche, puis le moment des 49 CHF, sans commande simulée. Au retour, le brouillon est là.
// Puis : la situation inventée, la réunion, le clavier seul, les animations réduites, le texte agrandi (260 points de large, soit un téléphone à 150 %),
// et, avec la commande des essais internes, la preuve que la fiche vue par le parent est bien celle que le proche reçoit.
// usage : node trajet.js [--court]   (--court : un seul téléphone et l'ordinateur)
// Variables : PEPE_ORIGIN, PEPE_BASE, PEPE_PUBLIC, PEPE_KEY, PEPE_NAV (chromium, firefox ou webkit), PEPE_CHROME.
// Le même fichier vérifie la version servie en local et une version en ligne.
// Ce fichier se lance sans le réglage des essais internes : il l'allume lui-même, pour la seule partie qui en a besoin.
const pw = require('playwright');
const NAV = process.env.PEPE_NAV || 'chromium';
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8448';
const BASE = process.env.PEPE_BASE || '/preversion/';
const APP = ORIGIN + BASE;
const PUBLIC = process.env.PEPE_PUBLIC ? process.env.PEPE_PUBLIC.replace(/\/?$/, '/') : 'https://parent-ecoute.ch' + BASE;
const KEY = process.env.PEPE_KEY || 'pepe-preversion-v1';
const COURT = process.argv.includes('--court');
let n = 0, ko = 0; const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC : ' + m); } };
const net = s => (s || '').split(String.fromCharCode(160)).join(' ').replace(/\s+/g, ' ').trim();
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
const RL = (k, extra = '') => `[data-act="rl"][data-k="${k}"]${extra}`;
// L'horloge du visiteur : le même jour, à l'heure voulue.
const horloge = h => { const D0 = Date; const base = new D0(); base.setHours(Math.floor(h), Math.round((h % 1) * 60), 0, 0); const dec = base.getTime() - D0.now();
  class D extends D0 { constructor(...x) { if (x.length) super(...x); else super(D0.now() + dec); } static now() { return D0.now() + dec; } } window.Date = D; };
// « isMobile » n'existe que dans Chrome : il y fait se comporter la page comme sur un téléphone (largeur de page, texte agrandi).
const MOBILE = NAV === 'chromium' ? { isMobile: true } : {};
const TEL375 = ['téléphone 375', Object.assign({ viewport: { width: 375, height: 667 }, hasTouch: true, deviceScaleFactor: 2 }, MOBILE)];
const TEL390 = ['téléphone 390', Object.assign({ viewport: { width: 390, height: 664 }, hasTouch: true, deviceScaleFactor: 2 }, MOBILE)];
const ORDI = ['ordinateur', { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 }];
const FORMATS = COURT ? [TEL390, ORDI] : [TEL375, TEL390, ORDI];
const ACCROCHE = 'On vous demande souvent comment va votre enfant. Ici, on commence par vous.';
const POUR = 'Pour les parents d’un enfant, d’un ado ou d’un adulte en situation de handicap';
const QUESTION = 'De quoi auriez-vous besoin aujourd’hui ?';
const TITRE = 'Et si vous prépariez les trois choses à savoir pour samedi ?';
const DIT49 = 'La prochaine fois que sa sœur prend le relais, vous pourrez repartir de cette fiche et adapter seulement ce qui change.';
const R1 = 'Lina a besoin de savoir ce qui vient après. Dis-lui le programme le matin.';
const R3 = 'Elle choisit elle-même ses vêtements et son film du soir.';

(async () => {
  const LOCAL = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
  const exe = NAV === 'chromium' ? (process.env.PEPE_CHROME || (require('fs').existsSync(LOCAL) ? LOCAL : undefined)) : undefined;
  const lance = { chromium: { args: ['--ignore-certificate-errors'] }, firefox: {}, webkit: {} }[NAV];
  const browser = await pw[NAV].launch(Object.assign({}, lance, exe ? { executablePath: exe } : {}));
  const ouvre = async (fmt, opt = {}) => {
    const ctx = await browser.newContext(Object.assign({ locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: opt.mouvement ? 'no-preference' : 'reduce' }, fmt, opt.ctx || {}));
    await ctx.addInitScript(horloge, opt.heure === undefined ? 21 + 40 / 60 : opt.heure);
    // Un parent ordinaire : le réglage des essais internes est retiré, même si l'essai a été lancé avec lui. « interne » l'allume.
    await ctx.addInitScript(i => { try { if (i) sessionStorage.setItem('pepe-interne', '1'); else sessionStorage.removeItem('pepe-interne'); } catch (e) { } }, !!opt.interne);
    const errs = [], films = [];
    const onglet = async () => { const page = await ctx.newPage();
      page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
      page.on('request', r => { const u = r.url(); if (/\.(mp4|webm|m4a|mp3|ogg)(\?|$)/.test(u)) films.push(u.replace(ORIGIN, ''));
        if (!u.startsWith(ORIGIN) && !/^(data|blob|about|mailto):/.test(u)) errs.push('requête vers un autre site : ' + u.slice(0, 100)); });
      return page; };
    return { ctx, page: await onglet(), onglet, errs, films };
  };
  const w = (page, ms) => page.waitForTimeout(ms);
  const vue = page => page.evaluate(() => document.getElementById('app').className);
  const range = page => page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }, KEY);
  const large = page => page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth,
    hors: [...document.querySelectorAll('#app *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.right > window.innerWidth + 1 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 3).map(e => e.tagName + '.' + String(e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className).slice(0, 40)) }));
  const sansDebord = async (page, m) => { const l = await large(page); ok(l.sw <= l.iw + 1 && !l.hors.length, m + ' : rien ne dépasse de l’écran ' + JSON.stringify(l)); };
  // Les cibles que l'on touche font 44 points de haut au moins.
  const doigt = async (page, sel, m) => { const r = await page.evaluate(s => [...document.querySelectorAll(s)].filter(e => e.getClientRects().length).map(e => Math.round(e.getBoundingClientRect().height)), sel);
    ok(r.length > 0 && r.every(h => h >= 44), m + ' : chaque cible fait 44 points de haut au moins ' + JSON.stringify(r)); };
  const ecrit = async (page, t) => { await page.locator('#rl-es-t').fill(t); await w(page, 80); };

  for (const [nom, fmt] of FORMATS) {
    const P = m => NAV + ' · ' + nom + ' : ' + m; const tel = /téléphone/.test(nom); const H = fmt.viewport.height, W = fmt.viewport.width;
    console.log('— ' + nom);

    // ============ 1. Je découvre ============
    {
      const o = await ouvre(fmt); const page = o.page;
      await page.goto(APP); await page.waitForSelector('.seuil .porte'); await w(page, 500);
      const a = await page.evaluate(() => { const q = s => document.querySelector(s), B = e => e ? e.getBoundingClientRect() : null, px = e => parseFloat(getComputedStyle(e).fontSize);
        const portes = [...document.querySelectorAll('.seuil .porte')]; const seuil = q('.seuil');
        const tailles = [...seuil.querySelectorAll('h1,h2,h3,p,b,span,button')].filter(e => e.getClientRects().length && !e.closest('.fiche-b') && e.textContent.trim()).map(px);
        return { pour: q('.seuil .pour').textContent, h1: q('.seuil h1').textContent, nbH1: document.querySelectorAll('h1').length, q: q('.besoin-q').textContent, tq: px(q('.besoin-q')), th: px(q('.seuil h1')), tmax: Math.max(...tailles),
          portes: portes.map(p => p.querySelector('b').textContent), sous: portes.map(p => p.querySelector('.tx>span').textContent), gestes: portes.map(p => p.dataset.v), bas3: Math.round(B(portes[2]).bottom), haut1: Math.round(B(portes[0]).top),
          groupe: (q('.seuil .portes').getAttribute('aria-labelledby') || '') === 'besoin-q', rassure: q('.seuil .rassure').textContent,
          sos: (() => { const s = q('.hbar .sos'); const r = B(s); return { t: s.textContent.trim(), y: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width) }; })(),
          yInvite: Math.round(B(q('.invite-rl')).top), yFiche: Math.round(B(q('.fiche-b')).top), xFiche: Math.round(B(q('.fiche-b')).left), yFilm: q('.film-cmd') ? Math.round(B(q('.film-cmd')).top) : null, yNom: Math.round(B(q('.nom-sens')).top),
          invite: q('.invite-rl h2').textContent, inviteB: q('.invite-rl .btn').textContent.trim(), fiche: q('.fiche-b h2').textContent, commande: document.querySelectorAll('[data-act="commande"]').length,
          robots: (q('meta[name="robots"]') || {}).content || '' }; });
      ok(net(a.pour) === POUR && net(a.h1) === ACCROCHE && a.nbH1 === 1, P('1. l’accroche d’Antonio ouvre la page, et le public est nommé (enfant, ado, adulte) ' + JSON.stringify([a.pour, a.h1, a.nbH1])));
      ok(net(a.q) === QUESTION && a.tq > a.th * 1.25 && a.tq >= a.tmax && a.groupe, P('1. la question « ' + QUESTION + ' » est le plus grand texte du premier écran, et les 3 aides lui répondent ' + JSON.stringify([a.q, a.tq, a.th, a.tmax, a.groupe])));
      ok(a.portes.map(net).join('|') === 'Écrire ce que j’ai sur le cœur|Souffler 2 minutes|Trouver une idée pour ce soir' && a.gestes.join('|') === 'deposer|souffle|piste', P('1. les 3 aides, avec les libellés qui annoncent ce qui se passe ' + JSON.stringify(a.portes)));
      ok(/déposez ce qui pèse/.test(a.sous[0]) && /question préparée à l’avance/.test(a.sous[0]) && /commence tout de suite, en silence/.test(a.sous[1]) && /choisissez ce que vous vivez/.test(a.sous[2]), P('1. sous chaque libellé, une ligne dit ce que le parent trouve en arrivant ' + JSON.stringify(a.sous)));
      ok(a.bas3 <= H, P('1. les 3 aides tiennent dans le premier écran, sans faire défiler (bas de la troisième à ' + a.bas3 + ' sur ' + H + ')'));
      ok(a.sos.t === 'SOS' && a.sos.y >= 0 && a.sos.y < 80 && a.sos.h >= 44 && a.sos.w >= 44, P('1. le bouton SOS est en haut du premier écran ' + JSON.stringify(a.sos)));
      ok(/gratuites et sans compte/.test(a.rassure) && /reste sur votre appareil/.test(a.rassure), P('1. sous les aides, une ligne dit qu’elles sont gratuites et que les mots restent sur l’appareil'));
      ok(net(a.invite) === 'Samedi, quelqu’un prend le relais ?' && a.inviteB === 'Préparer les 3 choses à savoir' && a.fiche === 'Le relais de Bastien', P('1. l’invitation au relais et la fiche de Bastien ' + JSON.stringify([a.invite, a.inviteB, a.fiche])));
      if (tel) ok(a.bas3 < a.yInvite && a.yInvite < a.yFiche && (a.yFilm === null || a.yFiche < a.yFilm) && (a.yFilm === null || a.yFilm < a.yNom), P('1. sur téléphone : les 3 aides, puis l’invitation au relais, puis la fiche d’exemple, et le film seulement ensuite ' + JSON.stringify([a.bas3, a.yInvite, a.yFiche, a.yFilm, a.yNom])));
      else ok(a.xFiche > W / 2 && a.yFiche < H && a.yInvite > a.yFiche && (a.yFilm === null || a.yFilm > a.bas3), P('1. sur ordinateur : la fiche de Bastien est à droite dans le premier écran, l’invitation dessous, le film sous les aides ' + JSON.stringify([a.xFiche, a.yFiche, a.yInvite, a.yFilm, a.bas3])));
      ok(a.commande === 0, P('1. aucune commande simulée sur l’accueil'));
      ok(!o.films.length, P('1. le film ne se charge pas tant que le parent ne l’a pas demandé ' + JSON.stringify(o.films.slice(0, 2))));
      await sansDebord(page, P('1. l’accueil'));
      await doigt(page, '.seuil .porte, .invite-rl .btn, .fb-voir, .hbar .sos', P('1. les gestes du premier écran'));
      // Chaque aide fait ce que son libellé annonce.
      await page.click('.seuil .porte[data-v="deposer"]'); await page.waitForSelector('main.deposer'); await w(page, 300);
      let b = await page.evaluate(() => ({ h1: document.querySelector('main.deposer h1').textContent, champ: !!document.querySelector('main.deposer textarea'), t: document.querySelector('main.deposer').innerText }));
      ok(b.h1 === 'Déposer ce qui pèse' && b.champ && /question écrite à l’avance/.test(b.t), P('1. « Écrire ce que j’ai sur le cœur » ouvre la page où l’on dépose ce qui pèse, et dit que la question est écrite à l’avance ' + JSON.stringify([b.h1, b.champ])));
      ok(/reste sur cet appareil/.test(b.t) && /ni à Antonio ni à une intelligence artificielle/.test(b.t), P('1. près de l’écriture : qui peut lire ces mots'));
      await page.goBack(); await page.waitForSelector('.seuil .porte'); await w(page, 300);
      await page.click('.seuil .porte[data-v="souffle"]'); await w(page, 900);
      b = await page.evaluate(() => ({ c: document.getElementById('app').className, t: document.getElementById('app').innerText.slice(0, 300) }));
      ok(/\bv-souffle\b/.test(b.c) && !o.films.length, P('1. « Souffler 2 minutes » lance l’exercice tout de suite, sans son ' + JSON.stringify([b.c, o.films.slice(0, 2)])));
      await page.goBack(); await page.waitForSelector('.seuil .porte'); await w(page, 300);
      await page.click('.seuil .porte[data-v="piste"]'); await w(page, 700);
      b = await page.evaluate(() => ({ c: document.getElementById('app').className, n: document.querySelectorAll('#app .sit').length }));
      ok(/\bv-(pub-)?kit\b/.test(b.c) && b.n >= 8, P('1. « Trouver une idée pour ce soir » ouvre les situations à choisir ' + JSON.stringify(b)));
      ok(!o.errs.length, P('1. aucune erreur ' + JSON.stringify(o.errs.slice(0, 3))));
      await o.ctx.close();
    }

    // ============ 2. J'essaie, puis 3. je vois ma fiche ============
    {
      const o = await ouvre(fmt, { mouvement: true }); const page = o.page;
      await page.goto(APP); await page.waitForSelector('.seuil .porte'); await w(page, 400);
      // depuis l'exemple, l'essai est à un geste, en haut comme en bas
      await page.click('.fiche-b .fb-voir'); await page.waitForSelector('.rl-ex'); await w(page, 500);
      let a = await page.evaluate(() => ({ haut: !!document.querySelector('.f-tete [data-act="rl"][data-k="essai"]'), bas: [...document.querySelectorAll('.ap-suite [data-act="rl"][data-k="essai"]')].map(e => e.textContent.trim()), moi: /Ce que je souhaite dire moi-même/.test(document.querySelector('.rl-ex').textContent) }));
      ok(a.haut && a.bas[0] === 'Préparer les 3 choses à savoir pour samedi' && a.moi, P('2. depuis la fiche de Bastien, l’essai est à un geste, en haut et en bas de l’exemple ' + JSON.stringify(a)));
      await page.click('.f-tete ' + RL('essai')); await page.waitForSelector('.rl-occ'); await w(page, 500);
      a = await page.evaluate(k => ({ h1: document.querySelector('h1').textContent, occ: [...document.querySelectorAll('.rl-oc b')].map(e => e.textContent), permet: document.querySelector('.rl-permet').innerText, prive: document.querySelector('.rl-prive').textContent, range: localStorage.getItem(k) }), KEY);
      ok(net(a.h1) === TITRE && a.occ.join('|') === 'Une soirée|Un week-end|Une réunion', P('2. « ' + TITRE + ' », puis une soirée, un week-end ou une réunion ' + JSON.stringify([a.h1, a.occ])));
      ok(/Écrire vos 3 repères/.test(a.permet) && /comme votre proche la recevra/.test(a.permet) && /Garder votre brouillon/.test(a.permet) && /49 CHF une seule fois/.test(a.permet) && /Rien n’est envoyé/.test(a.prive), P('2. avant d’écrire, l’essai dit ce qu’il permet de faire et de garder, et ce qui fait partie de l’outil complet'));
      ok(!a.range || !/"fiches":\[\{/.test(a.range), P('2. rien n’est créé avant le premier geste du parent'));
      await sansDebord(page, P('2. le départ de l’essai')); await doigt(page, '.rl-oc, .feuille .lien-f', P('2. les 3 occasions'));
      await page.click('.rl-oc[data-v="weekend"]'); await page.waitForSelector('#rl-es-t'); await w(page, 600);
      a = await page.evaluate(() => { const t = document.getElementById('rl-es-t'), f = document.getElementById('rl-es-f'), r = t.getBoundingClientRect();
        return { q: document.querySelector('h1').textContent, lab: document.querySelector('.f-tete .label').textContent, dans: !!t.closest('.rl-fiche .rl-trois li'), vides: document.querySelectorAll('#rl-es-f .rl-es-vide').length, titre: f.querySelector('.rl-t').textContent, trois: f.querySelector('.rl-trois h3').textContent,
          foyer: document.activeElement === t, suite: document.getElementById('rl-es-suite').getAttribute('aria-disabled'), yChamp: Math.round(r.bottom), nomme: t.getAttribute('aria-labelledby') === 'rl-es-q', invente: !!document.querySelector('[data-k="es-exemple"]') }; });
      ok(net(a.q) === 'Qu’aimeriez-vous que votre proche sache en premier ?' && a.lab === 'Un week-end, repère 1 sur 3', P('2. une première question facile ' + JSON.stringify([a.q, a.lab])));
      ok(a.dans && a.vides === 2 && a.titre === 'La fiche de relais' && a.trois === 'Si tu ne lis que trois choses' && a.nomme, P('2. le parent écrit dans la fiche elle-même, à la place du premier repère, et les 2 suivants gardent leur place ' + JSON.stringify(a)));
      ok(!a.foyer && a.suite === 'true' && a.invente && a.yChamp <= H, P('2. en arrivant, le champ se voit sans faire défiler, le clavier ne s’ouvre pas tout seul, et la suite attend le premier mot ' + JSON.stringify([a.foyer, a.suite, a.yChamp, H])));
      await page.click('#rl-es-suite', { force: true }); await w(page, 250);   // un parent peut toucher le bouton en pointillé : il doit lui répondre
      a = await page.evaluate(() => ({ q: document.querySelector('h1').textContent, err: (document.querySelector('.field-err, [role="alert"]') || {}).textContent || '' }));
      ok(/sache en premier/.test(a.q) && /Écrivez quelques mots/.test(a.err), P('2. sans rien d’écrit, « Repère suivant » explique quoi faire et ne passe pas ' + JSON.stringify(a)));
      await ecrit(page, R1);
      ok(await page.evaluate(() => document.getElementById('rl-es-suite').getAttribute('aria-disabled')) === 'false', P('2. la suite s’ouvre dès le premier mot'));
      await w(page, 650);
      let d = await range(page);
      ok(d && d.rel && d.rel.fiches.length === 1 && d.rel.fiches[0].trois[0] === R1 && d.rel.fiches[0].occ === 'weekend' && !d.rel.fiches[0].qui && d.onboarded === true, P('2. le brouillon est gardé sur l’appareil pendant que le parent écrit, sans prénom ' + JSON.stringify(d && d.rel && d.rel.fiches[0] && d.rel.fiches[0].trois)));
      await page.locator('#rl-es-t').press('Enter'); await w(page, 350);
      a = await page.evaluate(() => ({ q: document.querySelector('h1').textContent, un: (document.querySelector('#rl-es-f .rl-trois li') || {}).textContent, foyer: document.activeElement && document.activeElement.id, val: document.getElementById('rl-es-t').value, lab: document.querySelector('.f-tete .label').textContent }));
      ok(net(a.q) === 'Qu’est-ce qui évite une difficulté ?' && a.un === R1 && a.foyer === 'rl-es-t' && a.val === '' && a.lab === 'Un week-end, repère 2 sur 3', P('2. dès le premier repère, il se lit dans la fiche, et la touche Entrée mène au suivant avec le curseur dans le champ ' + JSON.stringify(a)));
      await page.click(RL('es-idees')); await w(page, 250);
      const idees = await page.evaluate(() => [...document.querySelectorAll('.rl-modeles .rl-m')].map(e => e.textContent));
      ok(idees.length === 4 && idees.every(t => !/\{P/.test(t) && !/votre enfant/i.test(t)), P('2. « Je ne sais pas par où commencer » propose 4 phrases à adapter, écrites pour un parent ' + JSON.stringify(idees)));
      await page.click('.rl-modeles .rl-m >> nth=0'); await w(page, 250);
      a = await page.evaluate(() => ({ val: document.getElementById('rl-es-t').value, foyer: document.activeElement && document.activeElement.id }));
      ok(a.val === idees[0] && a.foyer === 'rl-es-t', P('2. la phrase choisie arrive dans le champ, prête à être changée ' + JSON.stringify(a)));
      await page.click('#rl-es-suite'); await w(page, 350);
      a = await page.evaluate(() => ({ q: document.querySelector('h1').textContent, b: document.getElementById('rl-es-suite').textContent.trim(), foyer: document.activeElement && document.activeElement.id }));
      ok(net(a.q) === 'Qu’est-ce qui compte pour lui ou pour elle ?' && a.b === 'Voir mes 3 repères' && a.foyer === 'rl-es-t', P('2. la troisième question garde une place à ce que la personne aime, choisit ou décide ' + JSON.stringify(a)));
      await ecrit(page, R3); await page.locator('#rl-es-t').press('Enter'); await w(page, 400);
      a = await page.evaluate(() => ({ h1: document.querySelector('h1').textContent, trois: [...document.querySelectorAll('#rl-es-f .rl-trois li')].map(e => e.textContent), b: (document.querySelector('.ap-suite .btn.primary') || {}).textContent, champ: !!document.getElementById('rl-es-t'),
        plus: [...document.querySelectorAll('.rl-es-plus h2')].map(e => e.textContent), commande: document.querySelectorAll('[data-act="commande"]').length }));
      ok(a.h1 === 'Vos 3 repères sont prêts' && a.trois.length === 3 && a.trois[0] === R1 && a.trois[1] === idees[0] && a.trois[2] === R3 && !a.champ && net(a.b) === 'Voir ce que mon proche recevra', P('2. après 3 repères, la fiche est là et le parent peut « Voir ce que mon proche recevra » ' + JSON.stringify(a)));
      ok(a.plus.join('|') === 'Un prénom, si vous le souhaitez|Ce que je souhaite dire moi-même' && a.commande === 0, P('2. le prénom reste facultatif, et la personne concernée a sa place ' + JSON.stringify(a.plus)));
      await sansDebord(page, P('2. les 3 repères prêts'));
      // le prénom, puis la parole de la personne : la fiche suit ce qui s'écrit
      await page.click(RL('es-plus', '[data-v="q"]')); await w(page, 250);
      await page.locator('#rl-qui').fill('Lina'); await page.locator('#rl-chez').fill('sa tante Élise'); await w(page, 150);
      a = await page.evaluate(() => ({ t: document.querySelector('#rl-es-f .rl-t').textContent, st: (document.querySelector('#rl-es-f .rl-st') || {}).textContent, foyer: document.activeElement && document.activeElement.id }));
      ok(a.t === 'Le relais de Lina' && a.st === 'Pour sa tante Élise' && a.foyer === 'rl-chez', P('2. le prénom et le proche s’inscrivent dans la fiche pendant que le parent les écrit ' + JSON.stringify(a)));
      await page.click(RL('es-plus', '[data-v="m"]')); await w(page, 250);
      await page.click(RL('moi', '[data-i="0"]')); await w(page, 250);
      await page.locator('[data-rl="moi.0"]').fill('J’aime choisir ma musique dans la voiture.'); await w(page, 150);
      a = await page.evaluate(() => ({ moi: (document.querySelector('#rl-es-f .rl-moi') || {}).innerText || '' }));
      ok(/Ce que je souhaite dire moi-même/.test(a.moi) && /J’aime choisir ma musique dans la voiture\./.test(a.moi) && /Lina/.test(a.moi), P('2. « Ce que je souhaite dire moi-même » entre dans la fiche, signé du prénom ' + JSON.stringify(a.moi)));
      await doigt(page, '.feuille .btn, .feuille .lien-f, .feuille .rl-m, .feuille .seg button, .rl-ote', P('2. les gestes de l’écran des 3 repères'));

      // ---- 3. Je vois ma fiche ----
      await page.click(RL('recu')); await page.waitForSelector('.rl-recu'); await w(page, 1400);
      a = await page.evaluate(() => { const q = s => document.querySelector(s), B = e => e.getBoundingClientRect(); const f = q('.rl-recu'), r = B(f), app = document.getElementById('app');
        const suit = (x, y) => !!(x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING);
        return { c: app.className, bandeau: q('.bar.rl-vu p').textContent, retour: q('.bar.rl-vu .btn').textContent.trim(), onglets: document.querySelectorAll('.tabs, .va-accueil, .bar .sos').length, h1: [...document.querySelectorAll('h1')].map(e => e.textContent),
          trois: [...f.querySelectorAll('.rl-trois li')].map(e => e.textContent), moi: (f.querySelector('.rl-moi') || {}).innerText || '', st: (f.querySelector('.rl-st') || {}).textContent, pied: f.querySelector('.rl-pied').textContent,
          hint: q('.rl-vu-ecran .hint').textContent, fin: q('.rl-vu-fin').textContent, yFiche: Math.round(r.top), lFiche: Math.round(r.width), iw: window.innerWidth, pose: f.classList.contains('se-pose'), fx: document.documentElement.classList.contains('fx'),
          apres: suit(q('.rl-vu-ecran'), q('.rl-49')) && suit(q('.rl-vu-fin'), q('.rl-49')), offre: q('.rl-49').innerText, prevenir: (q('.rl-49 a.prevenir') || {}).href || '', prevenirT: (q('.rl-49 a.prevenir') || {}).textContent || '',
          commande: document.querySelectorAll('[data-act="commande"], [data-act="cadeau"], [data-act="retrouver"]').length, prive: q('.rl-49-prive').innerText }; });
      ok(/\bv-relais-recu\b/.test(a.c) && /\bnobar\b/.test(a.c) && a.onglets === 0 && /^Vous êtes à la place de sa tante Élise\./.test(net(a.bandeau)) && a.retour === 'Revenir à mon brouillon', P('3. le parent quitte son espace : un bandeau dit qu’il est à la place de sa tante Élise, sans onglets ni barre de l’espace ' + JSON.stringify([a.c, a.bandeau, a.onglets])));
      ok(a.h1.length === 1 && a.h1[0] === 'Le relais de Lina' && a.st === 'Pour sa tante Élise' && a.trois.join('|') === [R1, idees[0], R3].join('|') && /J’aime choisir ma musique/.test(a.moi) && /144/.test(a.pied), P('3. la fiche est celle qu’il vient d’écrire, avec ses 3 repères, la parole de Lina et le numéro des secours ' + JSON.stringify([a.h1, a.trois.length])));
      ok(/Cette fiche est contenue dans le lien que vous avez reçu/.test(a.hint) && /^Ici s’arrête ce que sa tante Élise reçoit\./.test(net(a.fin)), P('3. sous la fiche, la ligne que lira le proche, puis « Ici s’arrête ce que sa tante Élise reçoit. »'));
      if (tel) ok(a.yFiche < H && a.lFiche >= a.iw * .88, P('3. sur téléphone, la fiche occupe l’écran comme chez le proche ' + JSON.stringify([a.yFiche, a.lFiche, a.iw])));
      else ok(a.lFiche >= 300 && a.lFiche <= 420, P('3. sur ordinateur, la fiche tient dans un téléphone ' + a.lFiche));
      ok(a.pose === a.fx, P('3. la feuille vient se poser, une fois, là où les effets sont actifs ' + JSON.stringify([a.pose, a.fx])));
      ok(a.apres && a.offre.indexOf(DIT49) >= 0 && /49 CHF/.test(a.offre) && /une seule fois/.test(a.offre), P('3. le moment des 49 CHF vient après la fiche, avec la phrase d’Antonio'));
      ok(['Envoyer ou imprimer.', 'Votre proche ne paie rien.', 'Autant de fiches que vous voulez.', 'Au retour, une seule question.', 'Préparer une réunion.'].every(t => a.offre.indexOf(t) >= 0), P('3. ce que l’outil fait vraiment : envoyer ou imprimer, le proche ne paie rien, des fiches sans limite, le retour, la réunion'));
      ok(/^mailto:/.test(a.prevenir) && /Passer%20le%20relais/.test(a.prevenir) && net(a.prevenirT) === 'Me prévenir à l’ouverture' && a.commande === 0 && /La vente n’est pas encore ouverte/.test(a.offre), P('3. un seul geste, « Me prévenir à l’ouverture », par la messagerie du parent, et aucune commande simulée ' + JSON.stringify([a.prevenir.slice(0, 60), a.commande])));
      ok(/Ce qui reste privé/.test(a.prive) && /Ce que vous transmettez/.test(a.prive) && /seulement le jour où vous l’envoyez/.test(a.prive), P('3. ce qui reste privé et ce que le parent choisit de transmettre'));
      await sansDebord(page, P('3. la fiche vue par le proche')); await doigt(page, '.bar.rl-vu .btn, .rl-vu-apres .btn', P('3. les gestes de cet écran'));
      await page.click('.bar.rl-vu .btn'); await w(page, 700);
      a = await page.evaluate(() => ({ h1: document.querySelector('h1').textContent, n: document.querySelectorAll('#rl-es-f .rl-trois li').length, t: document.querySelector('#rl-es-f .rl-t').textContent }));
      ok(a.h1 === 'Vos 3 repères sont prêts' && a.n === 3 && a.t === 'Le relais de Lina', P('3. « Revenir à mon brouillon » le ramène à sa fiche ' + JSON.stringify(a)));

      // ---- au retour : un nouvel onglet, comme un parent qui revient plus tard ----
      await page.close(); const p2 = await o.onglet();
      await p2.goto(APP); await p2.waitForSelector('.rl-brouillon'); await w(p2, 400);
      a = await p2.evaluate(() => ({ c: document.getElementById('app').className, carte: document.querySelector('.rl-brouillon').innerText, b: document.querySelector('.rl-brouillon .btn').textContent.trim(), accueil: !!document.querySelector('.va-accueil, .tab-accueil, .rail-brand') }));
      ok(/\bv-today\b/.test(a.c) && /Le relais de Lina, pour sa tante Élise\. Vos 3 repères sont prêts\./.test(net(a.carte)) && a.b === 'Reprendre ma fiche' && a.accueil, P('3. au retour, le parent arrive dans son espace, sa fiche l’attend en haut, et l’accueil reste à un geste ' + JSON.stringify(a)));
      await p2.click('.rl-brouillon .btn'); await w(p2, 700);
      a = await p2.evaluate(() => ({ h1: document.querySelector('h1').textContent, trois: [...document.querySelectorAll('#rl-es-f .rl-trois li')].map(e => e.textContent) }));
      ok(a.h1 === 'Vos 3 repères sont prêts' && a.trois[0] === R1 && a.trois[2] === R3, P('3. « Reprendre ma fiche » rouvre son brouillon, avec ses mots ' + JSON.stringify(a.h1)));
      // l'accueil d'un parent déjà entré : ce qu'il faisait, tout en haut
      await p2.click(tel ? '.va-accueil' : '.tab-accueil'); await p2.waitForSelector('.seuil .revenu'); await w(p2, 400);
      a = await p2.evaluate(() => ({ liens: [...document.querySelectorAll('.revenu .voie')].map(e => e.textContent.trim()), y: Math.round(document.querySelector('.revenu').getBoundingClientRect().top), inv: document.querySelector('.invite-rl .btn').textContent.trim(), q: document.querySelector('.besoin-q').textContent }));
      ok(a.liens.join('|') === 'Reprendre ma fiche|Ouvrir mon espace' && a.y < 200 && a.inv === 'Reprendre ma fiche' && net(a.q) === QUESTION, P('3. sur l’accueil, un parent déjà entré retrouve sa fiche et son espace tout en haut ' + JSON.stringify(a)));
      await sansDebord(p2, P('3. l’accueil d’un parent déjà entré')); await doigt(p2, '.revenu .voie', P('3. les 2 reprises'));
      // les 3 offres : essayer, être prévenu, et rien d'autre
      await p2.goto(APP + '#offres'); await p2.waitForSelector('.offre, .formule'); await w(p2, 500);
      a = await p2.evaluate(() => ({ t: document.getElementById('app').innerText, essayer: [...document.querySelectorAll('.f-ferme .btn.primary')].map(e => e.textContent.trim()), prevenir: [...document.querySelectorAll('.f-ferme a.prevenir')].map(e => e.textContent.trim()), commande: document.querySelectorAll('[data-act="commande"], [data-act="cadeau"], [data-act="retrouver"]').length }));
      ok(a.essayer.join('|') === 'Essayer une étape en 3 minutes|Essayer avec ma situation' && a.prevenir.join('|') === 'Me prévenir à l’ouverture|Me prévenir à l’ouverture' && a.commande === 0, P('3. les 3 offres gardent leurs prix, avec « Essayer » et « Me prévenir à l’ouverture », sans commande simulée ' + JSON.stringify([a.essayer, a.prevenir, a.commande])));
      ok(/84 CHF/.test(a.t) && /6 fois 14 CHF/.test(a.t) && /49 CHF/.test(a.t) && /renouvellement automatique/.test(a.t) && /La vente n’est pas encore ouverte/.test(a.t), P('3. 84 CHF en tout ou 6 fois 14 CHF, 49 CHF une seule fois, sans renouvellement automatique'));
      await p2.goto(APP + '#cadeau-relais'); await w(p2, 800);
      a = await p2.evaluate(() => ({ recap: document.querySelectorAll('.cmd-recap, .cmd-paie').length, ferme: document.querySelectorAll('.f-ferme').length }));
      ok(a.recap === 0 && a.ferme === 2, P('3. l’ancienne adresse d’une commande mène aux 3 offres, pas à une commande simulée ' + JSON.stringify(a)));
      ok(!o.errs.length, P('2 et 3. aucune erreur ' + JSON.stringify(o.errs.slice(0, 3))));
      await o.ctx.close();
    }
  }

  // ============ La situation inventée, puis tout effacer ============
  for (const [nom, fmt] of [TEL390]) {
    const P = m => NAV + ' · ' + nom + ' : ' + m; const o = await ouvre(fmt); const page = o.page;
    await page.goto(APP); await page.waitForSelector('.invite-rl .btn'); await w(page, 300);
    await page.click('.invite-rl .btn'); await page.waitForSelector('.rl-occ'); await w(page, 300);
    await page.click('.rl-oc[data-v="soiree"]'); await page.waitForSelector('#rl-es-t'); await w(page, 300);
    await page.click(RL('es-exemple')); await w(page, 400);
    let a = await page.evaluate(() => ({ h1: document.querySelector('h1').textContent, t: document.querySelector('#rl-es-f .rl-t').textContent, n: document.querySelectorAll('#rl-es-f .rl-trois li').length, note: (document.querySelector('.rl-es-ex') || {}).innerText || '' }));
    ok(a.h1 === 'Vos 3 repères sont prêts' && a.t === 'Le relais de Noé' && a.n === 3 && /situation inventée/.test(a.note) && /Tout effacer/.test(a.note), P('4. « Essayer avec une situation inventée » remplit la fiche de Noé et le dit ' + JSON.stringify(a)));
    await page.click(RL('recu')); await page.waitForSelector('.rl-recu'); await w(page, 400);
    a = await page.evaluate(() => ({ b: document.querySelector('.bar.rl-vu p').textContent, anim: document.querySelector('.rl-recu').getAnimations().length }));
    ok(/à la place de sa grand-mère/.test(a.b) && a.anim === 0, P('4. avec les animations réduites, la fiche est simplement là ' + JSON.stringify(a)));
    await page.click('.bar.rl-vu .btn'); await w(page, 400); await page.click(RL('es-vider')); await w(page, 400);
    a = await page.evaluate(() => ({ q: document.querySelector('h1').textContent, v: document.getElementById('rl-es-t').value, vides: document.querySelectorAll('#rl-es-f .rl-es-vide').length, t: document.querySelector('#rl-es-f .rl-t').textContent }));
    ok(/sache en premier/.test(a.q) && a.v === '' && a.vides === 2 && a.t === 'La fiche de relais', P('4. « Tout effacer » rend la fiche vide, pour écrire avec ses mots ' + JSON.stringify(a)));
    // ---- une réunion ----
    await page.click(RL('essai-debut')); await page.waitForSelector('.rl-occ'); await w(page, 300);
    await page.click('.rl-oc[data-v="reunion"]'); await page.waitForSelector('#rl-es-t'); await w(page, 300);
    a = await page.evaluate(() => ({ q: document.querySelector('h1').textContent, t: document.querySelector('#rl-es-f .rl-t').textContent, h: document.querySelector('#rl-es-f .rl-trois h3').textContent }));
    ok(net(a.q) === 'Qu’aimeriez-vous que l’équipe sache en premier ?' && a.t === 'Ma feuille pour la réunion' && a.h === 'Mes 3 priorités', P('4. une réunion : les 3 réponses sont les 3 priorités de la feuille ' + JSON.stringify(a)));
    for (const t of ['Depuis 3 semaines, Lina dort mal le dimanche soir.', 'Je demande un court message chaque vendredi.', 'Son casque l’aide à rester en classe.']) { await ecrit(page, t); await page.locator('#rl-es-t').press('Enter'); await w(page, 300); }
    await page.click(RL('feuille-ok')); await w(page, 500);
    a = await page.evaluate(() => ({ t: document.getElementById('app').innerText, imprimer: document.querySelectorAll('[data-k="imprimer"]').length, commande: document.querySelectorAll('[data-act="commande"]').length, prevenir: document.querySelectorAll('a.prevenir').length }));
    ok(/Ma feuille pour la réunion/.test(a.t) && /Depuis 3 semaines, Lina dort mal le dimanche soir\./.test(a.t) && /Avant la prochaine réunion/.test(a.t) && a.imprimer === 0 && a.commande === 0 && a.prevenir === 1, P('4. la feuille de réunion, puis ce que l’outil complet apporte, sans rien promettre qu’il ne fait pas ' + JSON.stringify([a.imprimer, a.commande, a.prevenir])));
    await sansDebord(page, P('4. la feuille de réunion'));
    ok(!o.errs.length, P('4. aucune erreur ' + JSON.stringify(o.errs.slice(0, 3))));
    await o.ctx.close();
  }

  // ============ Le clavier seul, sur ordinateur ============
  {
    const P = m => NAV + ' · clavier seul : ' + m; const o = await ouvre(ORDI[1]); const page = o.page;
    await page.goto(APP); await page.waitForSelector('.invite-rl .btn'); await w(page, 400);
    const jusqua = async (sel, max = 60) => { for (let i = 0; i < max; i++) { await page.keyboard.press('Tab'); if (await page.evaluate(s => !!document.activeElement && document.activeElement.matches(s), sel)) return i + 1; } return -1; };
    const anneau = () => page.evaluate(() => { const e = document.activeElement, s = getComputedStyle(e); return e.matches(':focus-visible') && s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2; });
    let k = await jusqua('.seuil .porte', 8);
    // Certains navigateurs d'essai ne font pas passer la touche Tab par les boutons (un réglage du système, comme sur un Mac). On le dit, et on ne conclut rien.
    if (k < 0) { console.log('  note : dans ' + NAV + ', la touche Tab ne s’arrête pas sur les boutons de la machine d’essai. Le parcours au clavier seul n’a pas été rejoué ici.'); await o.ctx.close(); }
    else {
    const premier = await page.evaluate(() => document.activeElement.dataset.v);
    ok(k > 0 && k <= 3 && premier === 'deposer' && await anneau(), P('5. la première aide s’atteint en ' + k + ' appui(s) sur Tab, avec un contour visible'));
    k = await jusqua('.invite-rl .btn'); ok(k > 0 && await anneau(), P('5. l’invitation au relais s’atteint au clavier (' + k + ')'));
    await page.keyboard.press('Enter'); await page.waitForSelector('.rl-occ'); await w(page, 500);
    k = await jusqua('.rl-oc[data-v="weekend"]'); ok(k > 0 && await anneau(), P('5. « Un week-end » s’atteint au clavier (' + k + ')'));
    await page.keyboard.press('Enter'); await page.waitForSelector('#rl-es-t'); await w(page, 500);
    k = await jusqua('#rl-es-t'); ok(k > 0 && await anneau(), P('5. le champ du premier repère s’atteint au clavier (' + k + ')'));
    for (const t of ['Premier repère, écrit au clavier.', 'Deuxième repère.', 'Troisième repère.']) { await page.keyboard.type(t, { delay: 2 }); await page.keyboard.press('Enter'); await w(page, 300); }
    ok(await page.evaluate(() => document.querySelector('h1').textContent) === 'Vos 3 repères sont prêts', P('5. 3 repères écrits et validés sans la souris'));
    k = await jusqua('[data-act="rl"][data-k="recu"]'); ok(k > 0 && await anneau(), P('5. « Voir ce que mon proche recevra » s’atteint au clavier (' + k + ')'));
    await page.keyboard.press('Enter'); await page.waitForSelector('.rl-recu'); await w(page, 600);
    k = await jusqua('.bar.rl-vu .btn'); ok(k === 1 && await anneau(), P('5. à la place du proche, le premier arrêt du clavier est « Revenir à mon brouillon » (' + k + ')'));
    k = await jusqua('.rl-49 a.prevenir'); ok(k > 0 && await anneau(), P('5. « Me prévenir à l’ouverture » s’atteint au clavier (' + k + ')'));
    ok(!o.errs.length, P('5. aucune erreur ' + JSON.stringify(o.errs.slice(0, 3))));
    await o.ctx.close();
    }
  }

  // ============ Le texte agrandi : un téléphone réglé à 150 %, soit 260 points de large ============
  {
    const P = m => NAV + ' · texte agrandi : ' + m; const o = await ouvre(Object.assign({ viewport: { width: 260, height: 443 }, hasTouch: true, deviceScaleFactor: 3 }, MOBILE)); const page = o.page;
    await page.goto(APP); await page.waitForSelector('.seuil .porte'); await w(page, 400);
    await sansDebord(page, P('6. l’accueil'));
    const q = await page.evaluate(() => ({ t: document.querySelector('.besoin-q').textContent, coupe: [...document.querySelectorAll('.seuil h1, .besoin-q, .seuil .porte b, .invite-rl h2')].filter(e => e.scrollWidth > e.clientWidth + 1).length }));
    ok(net(q.t) === QUESTION && q.coupe === 0, P('6. la question et les libellés se lisent en entier ' + JSON.stringify(q)));
    await page.click('.invite-rl .btn'); await page.waitForSelector('.rl-occ'); await w(page, 300); await sansDebord(page, P('6. le départ de l’essai'));
    await page.click('.rl-oc[data-v="weekend"]'); await page.waitForSelector('#rl-es-t'); await w(page, 300); await sansDebord(page, P('6. la première question'));
    for (const t of [R1, 'Préviens-la avant de changer d’activité.', R3]) { await ecrit(page, t); await page.locator('#rl-es-t').press('Enter'); await w(page, 300); }
    await sansDebord(page, P('6. les 3 repères prêts'));
    await page.click(RL('recu')); await page.waitForSelector('.rl-recu'); await w(page, 400); await sansDebord(page, P('6. la fiche vue par le proche'));
    await doigt(page, '.bar.rl-vu .btn, .rl-vu-apres .btn', P('6. les gestes restent assez grands'));
    ok(!o.errs.length, P('6. aucune erreur ' + JSON.stringify(o.errs.slice(0, 3))));
    await o.ctx.close();
  }

  // ============ Avec la commande des essais internes : ce que le parent a vu est ce que le proche reçoit ============
  {
    const P = m => NAV + ' · essais internes : ' + m; const o = await ouvre(TEL390[1], { interne: true }); const page = o.page;
    const fiche = p => p.evaluate(() => { const f = document.querySelector('.rl-recu').cloneNode(true); f.removeAttribute('style'); f.className = ''; return f.innerHTML; });
    await page.goto(APP); await page.waitForSelector('.invite-rl .btn'); await w(page, 300);
    ok(await page.evaluate(() => sessionStorage.getItem('pepe-interne')) === '1', P('7. le réglage des essais internes est allumé'));
    await page.click('.invite-rl .btn'); await page.waitForSelector('.rl-occ'); await w(page, 300);
    await page.click('.rl-oc[data-v="weekend"]'); await page.waitForSelector('#rl-es-t'); await w(page, 300);
    await page.click(RL('es-exemple')); await w(page, 300);
    await page.click(RL('recu')); await page.waitForSelector('.rl-recu'); await w(page, 400);
    const vue1 = await fiche(page);
    let a = await page.evaluate(() => ({ b: (document.querySelector('.rl-49 [data-act="commande"]') || {}).textContent, prevenir: document.querySelectorAll('.rl-49 a.prevenir').length }));
    ok(net(a.b) === 'Choisir Passer le relais' && a.prevenir === 0, P('7. en interne, le moment des 49 CHF mène à la commande de démonstration ' + JSON.stringify(a)));
    await page.click('.rl-49 ' + A('commande')); await w(page, 500);
    await page.click(A('cmd', '[data-v="ok"]')); await w(page, 600);
    const d = await range(page);
    ok(d && d.achats && d.achats.relais, P('7. la commande de démonstration ouvre l’outil ' + JSON.stringify(d && d.achats && Object.keys(d.achats))));
    await page.goto(APP + '#relais'); await w(page, 700);
    await page.click(RL('ouvrir')); await w(page, 700);
    a = await page.evaluate(() => [...document.querySelectorAll('.ap-suite .btn')].map(e => e.textContent.trim()));
    ok(a.indexOf('Envoyer la fiche') >= 0 && a.indexOf('Voir ce que mon proche recevra') >= 0, P('7. qui a l’outil peut voir sa fiche à la place du proche avant de l’envoyer ' + JSON.stringify(a)));
    await page.click(RL('envoi')); await w(page, 600);
    a = await page.evaluate(() => ({ lien: (document.getElementById('rl-lien') || {}).value || '', avant: (document.querySelector('.feuille > [data-k="recu"]') || {}).textContent || '', recap: !!document.querySelector('.rl-recap .rl-fiche') }));
    ok(/#f=/.test(a.lien) && a.lien.indexOf(PUBLIC + 'relais/') === 0 && /Voir d’abord ce que son oncle Rémi recevra/.test(a.avant) && a.recap, P('7. avant tout partage, l’écran d’envoi montre ce qui part et propose de le voir à la place du proche ' + JSON.stringify([a.lien.slice(0, 60), a.avant])));
    await page.click('.feuille > ' + RL('recu')); await page.waitForSelector('.rl-recu'); await w(page, 400);
    const vue2 = await fiche(page);
    const b = await page.evaluate(() => ({ r: document.querySelector('.bar.rl-vu .btn').textContent.trim(), o: document.querySelectorAll('.rl-49').length, e: [...document.querySelectorAll('.rl-vu-apres .btn')].map(x => x.textContent.trim()) }));
    ok(b.r === 'Revenir à ma fiche' && b.o === 0 && b.e[0] === 'Envoyer la fiche', P('7. pour qui a l’outil, cet écran ne vend rien et ramène à l’envoi ' + JSON.stringify(b)));
    // le proche : un autre appareil, sans rien d'enregistré, qui ouvre le lien
    const o2 = await ouvre(TEL390[1]); await o2.page.goto(a.lien.replace(PUBLIC, APP)); await o2.page.waitForSelector('.rl-recu'); await w(o2.page, 500);
    const recue = await fiche(o2.page);
    ok(recue === vue1 && recue === vue2, P('7. la fiche que le proche ouvre par le lien est, mot pour mot, celle que le parent a vue (' + recue.length + ' caractères)'));
    const c = await o2.page.evaluate(k => ({ c: document.getElementById('app').className, range: localStorage.getItem(k), commande: document.querySelectorAll('[data-act="commande"]').length }), KEY);
    ok(/\bnobar\b/.test(c.c) && !c.range && c.commande === 0, P('7. le proche lit la fiche sans compte, et rien n’est rangé sur son appareil ' + JSON.stringify(c)));
    ok(!o.errs.length && !o2.errs.length, P('7. aucune erreur ' + JSON.stringify(o.errs.concat(o2.errs).slice(0, 3))));
    await o2.ctx.close(); await o.ctx.close();
  }

  await browser.close();
  console.log('trajet : ' + n + ' vérifications, ' + ko + ' échec' + (ko > 1 ? 's' : '') + ' (' + NAV + ', ' + APP + ')');
  process.exit(ko ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
