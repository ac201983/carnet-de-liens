// Le lancement : ce qu'une famille vit avec les 3 offres, l'outil « Passer le relais » et les portes d'entrée du site.
//   1. La vitrine dit à qui elle s'adresse et laisse faire un geste utile tout de suite. Les 3 offres se comprennent du premier coup :
//      Découverte (gratuite), Le parcours (84 CHF en tout, en une fois ou en six fois, avec la même importance à l'écran), Passer le relais (49 CHF, une seule fois).
//   2. La commande en démonstration : les dates et les montants avant de confirmer, le paiement accepté, refusé, abandonné,
//      les 6 mensualités qui s'arrêtent après la sixième, et l'achat retrouvé sur un appareil vide. Rien n'est débité, et l'écran le dit.
//   3. « Passer le relais » : l'exemple avant de rien écrire, la fiche préparée, les 3 repères, « Ce que je souhaite dire moi-même »,
//      l'aperçu exact, le lien que le frère ouvre aussitôt sans rien acheter, la question du retour, le deuxième relais plus rapide,
//      la réunion préparée avec les phrases déjà écrites et « Je perds mes mots », la sauvegarde et la restauration, l'impression sur une page.
//   4. Trois usages de bout en bout : souffler sur son téléphone, préparer une fiche que son frère ouvre, revenir après une interruption.
//   5. Les portes d'entrée : une fiche publique à envoyer par WhatsApp, la page à transmettre, une seule suite logique par fiche,
//      « Offrir à un parent » en maquette. Le SOS, la respiration et « Déposer » ne proposent rien à acheter.
//   6. Les 3 mesures du lancement restent sur l'appareil, sans aucun écrit, et rien ne quitte le site.
// Tout paiement est simulé : il n'existe pas encore de prestataire de paiement. Le test le vérifie aussi (aucune requête vers un autre site).
// usage : node lancement.js      Variables : PEPE_ORIGIN, PEPE_BASE, PEPE_PUBLIC, PEPE_KEY, PEPE_NAV, PEPE_CHROME.
const pw = require('playwright');
const fs = require('fs'), os = require('os'), path = require('path');
const NAV = process.env.PEPE_NAV || 'chromium';
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8445';
const BASE = process.env.PEPE_BASE || '/';
const APP = ORIGIN + BASE;
const PUBLIC = process.env.PEPE_PUBLIC ? process.env.PEPE_PUBLIC.replace(/\/?$/, '/') : 'https://parent-ecoute.ch' + BASE;
const KEY = process.env.PEPE_KEY || 'pepe-v1';
const ESSAI = /essai/.test(BASE);
const EN_LIGNE = !/localhost/.test(ORIGIN);
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
const R = (k, extra = '') => `[data-act="rl"][data-k="${k}"]${extra}`;
let n = 0, ko = 0; const notesFin = [];
const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC : ' + m); } };
const net = s => (s || '').split(String.fromCharCode(160)).join(' ').replace(/\s+/g, ' ').trim();
const iso = d => { const x = new Date(Date.now() + d * 86400000); const p = v => String(v).padStart(2, '0'); return x.getFullYear() + '-' + p(x.getMonth() + 1) + '-' + p(x.getDate()); };
// L'horloge du visiteur : même jour, à 21 h 40, et éventuellement quelques jours plus tard.
const horloge = ([h, jours]) => { const D0 = Date; const base = new D0(); base.setHours(Math.floor(h), Math.round((h % 1) * 60), 0, 0); const dec = base.getTime() - D0.now() + (jours || 0) * 86400000;
  class D extends D0 { constructor(...x) { if (x.length) super(...x); else super(D0.now() + dec); } static now() { return D0.now() + dec; } } window.Date = D; };
const TEL = { viewport: { width: 390, height: 664 }, hasTouch: true, deviceScaleFactor: 2 }, ORDI = { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 };
const VENTE = /CHF|abonn|payer|paiement|\bprix\b|acheter|offre/i;
const TOTAL = 'Total 84 CHF dans les deux cas. Sans supplément ni renouvellement automatique.';
const QUESTION = 'Qu’est-ce qui a bien marché et que vous aimeriez garder pour la prochaine fois ?';
const PHRASE = 'On vous demande souvent comment va votre enfant. Ici, on commence par vous.';
// Les prénoms et les numéros de ces essais sont inventés.
const QUI = 'Noé', CHEZ = 'mon frère Rémi', QUAND = 'du samedi 5 au dimanche 6 décembre', TELN = '079 000 00 00';
// Le lien d'une petite fiche, fabriqué le 19 novembre 2026 avec le code du site. Il doit s'ouvrir tant que le site existe.
const LIEN_FIGE = 'relais/#f=1.YQQTTm_DqQRUEthSsMOpbWkFVCAHNSAq_jYfJweLQ69Dr0OvQ6gJQf4uBUBEL0QvRC4DgAQBokRdQwB1LeUjAQLwcyfQYQxuaWzgLbJvaXIuzxHBElI0dp9RdHI2oLLyOQDhY2GfoTgSPYByb-8GkTbdPfIkgm6KkXqwo7b_BkIYChJ_En8SfxJ_En8Sfx8SfyfKExJu3gNBcMOi468CEqByaXoQwQFiLvD_BEQthYNfg1-DX4NSLvg3MnMvQTcBMDAAQAAwL74xADkifa6BYw';
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
// Les 6 dates attendues d'un paiement en six fois : le jour de l'achat, puis le même jour des 5 mois suivants (ou le dernier jour d'un mois plus court).
const echeances = () => { const d = new Date(); const out = []; for (let i = 0; i < 6; i++) { const y = d.getFullYear() + Math.floor((d.getMonth() + i) / 12), m = (d.getMonth() + i) % 12; const fin = new Date(y, m + 1, 0).getDate(); const j = Math.min(d.getDate(), fin); out.push((j === 1 ? '1er' : j) + ' ' + MOIS[m] + ' ' + y); } return out; };

(async () => {
  const LOCAL = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
  const exe = NAV === 'chromium' ? (process.env.PEPE_CHROME || (fs.existsSync(LOCAL) ? LOCAL : undefined)) : undefined;
  const lance = { chromium: { args: ['--ignore-certificate-errors'] }, firefox: {}, webkit: {} }[NAV];
  const browser = await pw[NAV].launch(Object.assign({}, lance, exe ? { executablePath: exe } : {}));
  const vus = [];   // tous les textes lus pendant l'essai : « Avec Antonio » ne doit plus apparaître nulle part
  const sorties = [];   // toute requête vers un autre site que celui de l'essai
  const ouvre = async (fmt, opt = {}) => {
    const f = Object.assign({}, fmt); if (NAV === 'chromium' && f.hasTouch) f.isMobile = true;
    const ctx = await browser.newContext(Object.assign({ locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce', acceptDownloads: true }, f));
    await ctx.addInitScript(horloge, [21 + 40 / 60, opt.jours || 0]);
    if (opt.notes) await ctx.addInitScript(([k, d]) => { try { if (!localStorage.getItem('__pose')) { localStorage.setItem(k, d); localStorage.setItem('__pose', '1'); } } catch (e) { } }, [KEY, JSON.stringify(opt.notes)]);
    const errs = [], urls = [];
    const onglet = async () => { const page = await ctx.newPage();
      page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR|downloadable font: download failed[^]*status=2152398850/.test(m.text())) errs.push(m.text().slice(0, 200)); });
      page.on('request', r => { const u = r.url(); urls.push(u); if (!u.startsWith(ORIGIN) && !/^(data|blob|about):/.test(u)) sorties.push(u.slice(0, 120)); });
      return page; };
    const page = await onglet();
    return { ctx, page, errs, urls, onglet };
  };
  const garde = page => page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return 'illisible'; } }, KEY);
  const h1 = page => page.$eval('main h1', e => e.textContent).then(net).catch(() => '');
  const texte = async (page, sel = '#app') => { const t = await page.$eval(sel, e => e.innerText).then(net).catch(() => ''); vus.push(t); return t; };
  const clic = async (page, sel, ms = 350) => { await page.click(sel); await page.waitForTimeout(ms); };
  const ficheTexte = page => page.$eval('.v-relais .rl-fiche', e => e.innerText).then(net).catch(() => '');
  // Un parent déjà entré dans son espace, sans achat.
  const PARENT = () => ({ onboarded: true, start: iso(-20), tier: 'free', achats: {}, steps: {}, notes: {}, seen: {}, depots: [], moods: {}, pv: 3 });
  // Prépare une fiche complète, de l'accueil de l'outil jusqu'à l'aperçu. Rend le nombre de gestes (touchers et champs remplis).
  const prepare = async (page) => {
    let g = 0; const c = async (sel, ms = 250) => { await clic(page, sel, ms); g++; }; const f = async (sel, v) => { await page.fill(sel, v); g++; };
    await c(R('nouveau'));
    await f('#rl-qui', QUI); await f('#rl-chez', CHEZ); await f('#rl-quand', QUAND);
    await c(R('pas', '[data-v="1"]'));
    await c(R('idees', '[data-s="aide"]')); await c(R('modele', '[data-s="aide"][data-i="0"]'));
    await c(R('idees', '[data-s="aide"]')); await c(R('modele', '[data-s="aide"][data-i="1"]'));
    await c(R('idees', '[data-s="nuit"]')); await c(R('modele', '[data-s="nuit"][data-i="1"]'));
    await c(R('idees', '[data-s="repas"]')); await c(R('vierge', '[data-s="repas"]')); await f('[data-rl="s.repas.0"]', QUI + ' mange volontiers des pâtes, du riz et des pommes.');
    await c(R('pas', '[data-v="1"]'));
    await c(R('pique') + ' >> nth=0'); await c(R('pique') + ' >> nth=0'); await f('[data-rl="trois.2"]', QUI + ' choisit lui-même son dessin animé du soir.');
    await c(R('pas', '[data-v="1"]'));
    await c(R('moi', '[data-i="0"]')); await page.keyboard.type('les trains et les cartes de métro.'); g++;
    await c(R('moi', '[data-i="1"]')); await page.keyboard.type('qu’on finisse mes phrases.'); g++;
    await c(R('pas', '[data-v="1"]'));
    await f('#rl-tn0', 'Maman'); await f('#rl-tt0', TELN);
    await c(R('apercu'), 400);
    return g;
  };

  for (const [nom, fmt] of [['téléphone', TEL], ['ordinateur', ORDI]]) {
    const P = m => NAV + ' · ' + nom + ' · ' + m;
    const tel = nom === 'téléphone';

    // =====================================================================================================================
    // 1. La vitrine et les 3 offres, pour un visiteur.
    // =====================================================================================================================
    {
      const { ctx, page, errs } = await ouvre(fmt);
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('main.intro .portes .porte'); await page.waitForTimeout(500);
      const v = await page.evaluate(() => { const q = s => document.querySelector(s); const t = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; const L = [...document.querySelectorAll('main.intro .portes .porte')]; const r = L.length ? L[L.length - 1].getBoundingClientRect() : null;
        return { pour: t(q('main.intro .pour')), h1: t(q('main.intro h1')), portes: L.length, bas: r ? Math.round(r.bottom) : 9999, vh: innerHeight, logo: !!q('main.intro .wordmark'), sos: !!q('main.intro .sos') }; });
      ok(v.pour === 'Pour la mère ou le père d’une personne en situation de handicap', P('1. la vitrine dit d’abord à qui elle s’adresse : « ' + v.pour + ' »'));
      ok(net(v.h1) === PHRASE, P('1. la phrase d’Antonio ouvre le site : « ' + net(v.h1) + ' »'));
      ok(v.portes === 3 && v.bas <= v.vh && v.sos, P('1. dès le premier écran, 3 gestes utiles sont visibles sans faire défiler (bas du troisième à ' + v.bas + ' px sur ' + v.vh + ')'));
      const vit = await texte(page);
      ok(/Le parcours 84 CHF en tout/.test(vit) && /Passer le relais 49 CHF une seule fois/.test(vit) && /Découverte 0 CHF/.test(vit) && vit.indexOf(TOTAL) > 0, P('1. la vitrine présente les 3 offres et leurs prix, avec le total du paiement en six fois'));
      ok(/Faut-il prendre un abonnement \?/.test(vit) && !/par mois/.test(vit.replace(/une fois par mois/g, '')), P('1. la vitrine ne parle plus d’un prix par mois'));
      ok(/Si tu ne lis que trois choses/.test(vit) && !!(await page.$('main.intro ' + R('exemple'))), P('1. la vitrine montre le début d’une fiche de relais et mène à l’exemple'));
      // les 3 offres
      await page.goto(APP + '#formules', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.formules .formule'); await page.waitForTimeout(400);
      ok((await h1(page)) === 'Les 3 offres' && !!(await page.$('main.v-feuille .feuille')), P('1. l’adresse des offres ouvre « Les 3 offres », sur la feuille claire'));
      const F = await page.$$eval('.formule', L => L.map(f => { const r = x => { const e = f.querySelector(x); return e ? e.getBoundingClientRect() : null; }; const t = x => { const e = f.querySelector(x); return e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; };
        const haut = r('.f-haut'), B = [...f.querySelectorAll(':scope > .btn, :scope > .f-payer .btn')]; const bas = B.length ? B[B.length - 1].getBoundingClientRect().bottom : 0; const d = f.querySelector('details.f-concret');
        return { nom: t('h2'), prix: t('.f-prix'), benef: t('.f-benef'), boutons: B.map(b => b.innerText.replace(/\s+/g, ' ').trim()), ensemble: Math.round(bas - haut.top), ouvert: d ? d.open : null, resume: t('details.f-concret > summary'), lignes: d ? d.querySelectorAll('li').length : 0, lien: t(':scope > .lien-f') }; }));
      ok(F.length === 3 && F.map(f => f.nom).join() === 'Découverte,Le parcours,Passer le relais', P('1. les 3 offres sont là, dans l’ordre : ' + F.map(f => f.nom).join(', ')));
      ok(F[0].prix === '0 CHF sans limite de durée' && F[1].prix === '84 CHF en tout' && F[2].prix === '49 CHF une seule fois', P('1. les prix : ' + F.map(f => f.prix).join(' | ')));
      ok(F.every(f => f.benef.length > 20 && f.boutons.length >= 1), P('1. chaque offre dit son bénéfice et propose son geste'));
      ok(F[1].boutons.length === 2 && F[1].boutons[0] === 'En une fois 84 CHF aujourd’hui' && F[1].boutons[1] === 'En six fois 14 CHF aujourd’hui, puis 5 mensualités de 14 CHF', P('1. Le parcours se paie de 2 façons : ' + F[1].boutons.join(' | ')));
      const M = await page.$$eval('.formule.f-parcours .f-payer .f-mode', L => L.map(b => { const r = b.getBoundingClientRect(), s = getComputedStyle(b), t = getComputedStyle(b.querySelector('b')); return { w: Math.round(r.width), h: Math.round(r.height), fond: s.backgroundColor, couleur: s.color, bord: s.borderTopWidth + ' ' + s.borderTopColor, titre: t.fontSize + ' ' + t.fontWeight, cls: b.className }; }));
      ok(M.length === 2 && M[0].w === M[1].w && M[0].h === M[1].h && M[0].fond === M[1].fond && M[0].couleur === M[1].couleur && M[0].bord === M[1].bord && M[0].titre === M[1].titre && M[0].cls === M[1].cls, P('1. les 2 façons de payer ont la même importance à l’écran (même taille, même couleur, même caractère) ' + JSON.stringify(M.map(m => [m.w, m.h, m.fond]))));
      ok(net(await page.$eval('.formule.f-parcours .f-total', e => e.innerText)) === TOTAL, P('1. sous les 2 boutons : « ' + TOTAL + ' »'));
      if (tel) {
        ok(F.every(f => f.ensemble > 0 && f.ensemble <= 430), P('1. sur le téléphone, le bénéfice, le prix et le geste de chaque offre tiennent ensemble à l’écran (' + F.map(f => f.ensemble + ' px').join(', ') + ' sur 664)'));
        ok(F.every(f => f.ouvert === false && f.resume.length > 8 && f.lignes >= 4), P('1. sur le téléphone, le détail de chaque offre se déplie : ' + F.map(f => f.resume).join(' | ')));
        await page.click('.formule.f-parcours details.f-concret > summary'); await page.waitForTimeout(200);
        ok(/24 étapes guidées/.test(await texte(page, '.formule.f-parcours details.f-concret')), P('1. une fois déplié, Le parcours dit ce qu’il contient'));
      } else {
        const cols = await page.$$eval('.formule', L => L.map(f => Math.round(f.getBoundingClientRect().top)));
        ok(F.every(f => f.ouvert === true) && cols[0] === cols[1] && cols[1] === cols[2], P('1. sur l’ordinateur, les 3 offres sont côte à côte et leur détail est ouvert'));
        const empile = await page.$$eval('.formule.f-parcours .f-payer .f-mode', L => L.map(b => Math.round(b.getBoundingClientRect().left)));
        ok(empile[0] === empile[1], P('1. dans la colonne, les 2 façons de payer sont l’une sous l’autre'));
      }
      const off = await texte(page);
      ok(/Paiement, durée et ce que vous gardez/.test(off) && /reste ouvert sans limite de durée/.test(off) && /sauvegarder dans un fichier/.test(off) && /ni abonnement ni renouvellement automatique/.test(off), P('1. la page dit la durée d’accès, l’absence d’abonnement et ce que l’on garde'));
      ok(/aucun montant réel n’est débité/.test(off) && /La vente n’est pas encore ouverte/.test(off), P('1. la page dit que rien n’est débité et que la vente n’est pas ouverte'));
      ok(F[0].lien === 'Essayer une étape, en 3 minutes' && F[1].lien === 'Essayer une étape avant de choisir' && F[2].lien === 'Voir un exemple de fiche terminée', P('1. chaque offre laisse découvrir avant de choisir : ' + F.map(f => f.lien).join(' | ')));
      ok(!!(await page.$(A('cadeau'))) && !!(await page.$(A('retrouver'))), P('1. « Offrir à un parent » et « Retrouver un achat » sont proposés, discrètement'));
      ok((await garde(page)) === null, P('1. regarder les offres ne crée rien sur l’appareil'));
      ok(errs.length === 0, P('1. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 2. La commande en démonstration, pour un parent déjà entré.
    // =====================================================================================================================
    {
      const { ctx, page, errs } = await ouvre(fmt, { notes: PARENT() });
      await page.goto(APP + '#formules', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.formules .formule'); await page.waitForTimeout(300);
      await clic(page, A('commande', '[data-v="parcours"][data-m="six"]'), 400);
      const E = echeances();
      const c1 = await page.evaluate(() => { const t = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; return { h1: t(document.querySelector('main h1')), demo: t(document.querySelector('.demo-paie')), six: (document.querySelector('.cmd-mode .f-mode[data-v="six"]') || {}).getAttribute ? document.querySelector('.cmd-mode .f-mode[data-v="six"]').getAttribute('aria-pressed') : '', lignes: [...document.querySelectorAll('.cmd-mode .ech li')].map(t), total: t(document.querySelector('.cmd-mode .f-total')), tout: t(document.querySelector('main')) }; });
      vus.push(c1.tout);
      ok(c1.h1 === 'Votre commande' && /Aucun montant réel n’est débité/.test(c1.demo) && c1.six === 'true', P('2. « En six fois » ouvre la commande, en démonstration, avec ce choix déjà fait'));
      ok(c1.lignes.length === 7 && c1.lignes[0] === 'Aujourd’hui, le ' + E[0] + ' 14 CHF' && [1, 2, 3, 4, 5].every(i => c1.lignes[i] === 'Le ' + E[i] + ' 14 CHF') && c1.lignes[6] === 'Total 84 CHF', P('2. avant de confirmer, les 6 dates et les 6 montants sont écrits, puis le total : ' + c1.lignes.join(' | ')));
      ok(c1.tout.indexOf('La dernière mensualité est celle du ' + E[5] + '. Après elle, plus rien n’est prélevé.') > 0 && /vous achetez le parcours complet/.test(c1.tout) && c1.total === TOTAL, P('2. la commande dit la dernière date, que le parcours est acheté en entier, et le total'));
      ok(/Ce que vous gardez/.test(c1.tout) && /reste ouvert sans limite de durée/.test(c1.tout) && /sauvegarder dans un fichier/.test(c1.tout), P('2. avant de payer, la durée d’accès et ce que l’on garde sont écrits'));
      await clic(page, A('cmd-mode', '[data-v="une"]'));
      const une = await page.$$eval('.cmd-mode .ech li', L => L.map(e => e.innerText.replace(/\s+/g, ' ').trim()));
      ok(une.length === 2 && une[0] === 'Aujourd’hui, le ' + E[0] + ' 84 CHF' && une[1] === 'Total 84 CHF', P('2. « En une fois » : une seule ligne de 84 CHF aujourd’hui ' + une.join(' | ')));
      // refusé, puis abandonné : rien ne change
      await clic(page, A('cmd-mode', '[data-v="six"]')); await clic(page, A('cmd', '[data-v="refus"]'));
      let d = await garde(page);
      ok((await h1(page)) === 'Le paiement n’a pas abouti.' && /Rien n’a été débité/.test(await texte(page, 'main')) && !d.achats.parcours && d.tier === 'free', P('2. paiement refusé : l’écran le dit, et rien n’est ouvert ni changé'));
      await clic(page, A('cmd', '[data-v="recap"]'));
      ok((await h1(page)) === 'Votre commande' && (await page.$eval('.cmd-mode .f-mode[data-v="six"]', e => e.getAttribute('aria-pressed'))) === 'true', P('2. « Réessayer » ramène à la commande, avec le même choix'));
      await clic(page, A('cmd', '[data-v="abandon"]'));
      d = await garde(page);
      ok((await h1(page)) === 'Vous avez arrêté avant de payer.' && !d.achats.parcours && d.tier === 'free', P('2. commande abandonnée : rien n’est débité ni ouvert'));
      // l'étape 2 reste fermée tant que rien n'est acheté
      await clic(page, A('cmd', '[data-v="recap"]')); await clic(page, A('cmd-mode', '[data-v="six"]')); await clic(page, A('cmd', '[data-v="ok"]'), 500);
      d = await garde(page);
      const okT = await texte(page, 'main');
      ok((await h1(page)) === 'C’est confirmé.' && d.tier === 'parcours' && d.achats.parcours && d.achats.parcours.m === 'six' && d.achats.parcours.n === 1 && d.achats.parcours.le === iso(0) && !d.achats.relais, P('2. paiement accepté en six fois : le parcours est ouvert, la première mensualité est notée, et « Passer le relais » reste à part ' + JSON.stringify(d.achats)));
      ok(/Vos 6 mensualités/.test(okT) && okT.indexOf('Le ' + E[0] + ', payée 14 CHF') > 0 && okT.indexOf('La dernière mensualité est celle du ' + E[5]) > 0 && /Aucun montant réel n’est débité/.test(okT), P('2. la confirmation rappelle les 6 dates, celle qui est payée, et que rien n’est débité'));
      // les mensualités avancent, et s'arrêtent après la sixième
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.tab[data-view="me"]'); await clic(page, '.tab[data-view="me"]', 400);
      const achats = () => page.$eval('.mes-achats', e => e.innerText).then(net);
      let a = await achats(); vus.push(a);
      ok(/Le parcours 1 mensualité sur 6/.test(a) && a.indexOf('La prochaine mensualité de 14 CHF est celle du ' + E[1]) > 0 && /Passer le relais pas acheté/.test(a), P('2. « Mes achats » dit où en sont les mensualités et la date de la prochaine'));
      if (ESSAI) {
        const suite = [];
        for (let i = 2; i <= 6; i++) { await clic(page, A('ech-suite'), 250); const x = await garde(page); suite.push(x.achats.parcours.n); }
        a = await achats(); d = await garde(page);
        ok(suite.join() === '2,3,4,5,6' && /payé, 6 mensualités sur 6/.test(a) && /Les 6 mensualités sont payées. Plus rien ne sera prélevé./.test(a), P('2. les mensualités avancent une à une jusqu’à la sixième (' + suite.join(', ') + ')'));
        ok(!(await page.$(A('ech-suite'))) && d.achats.parcours.n === 6 && d.tier === 'parcours', P('2. après la sixième, il n’y a plus rien à prélever : le bouton a disparu et le parcours reste ouvert'));
        // l'achat en une fois, après avoir annulé la démonstration
        await clic(page, A('achats-zero'), 400); d = await garde(page);
        ok(!d.achats.parcours && !d.achats.relais && d.tier === 'free', P('2. « Annuler mes achats de démonstration » remet l’appareil sans achat'));
        await page.goto(APP + '#formules', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.formules .formule'); await page.waitForTimeout(300);
        await clic(page, A('commande', '[data-v="parcours"][data-m="une"]'), 400);
        ok((await page.$eval('.cmd-mode .f-mode[data-v="une"]', e => e.getAttribute('aria-pressed'))) === 'true', P('2. « En une fois » ouvre la commande avec ce choix déjà fait'));
        await clic(page, A('cmd', '[data-v="ok"]'), 500); d = await garde(page);
        const t1 = await texte(page, 'main');
        ok(d.achats.parcours && d.achats.parcours.m === 'une' && d.tier === 'parcours' && !/Vos 6 mensualités/.test(t1) && /Vous n’aurez rien d’autre à payer/.test(t1), P('2. paiement accepté en une fois : le parcours est ouvert, sans échéance'));
        await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.tab[data-view="me"]'); await clic(page, '.tab[data-view="me"]', 400);
        ok(/Le parcours payé en une fois/.test(await achats()), P('2. « Mes achats » : Le parcours, payé en une fois'));
      } else notesFin.push('les boutons de démonstration des mensualités n’existent que dans la version d’essai : ils n’ont pas été rejoués ici');
      ok(errs.length === 0, P('2. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
      // un appareil vide retrouve un achat
      const o2 = await ouvre(fmt);
      await o2.page.goto(APP + '#formules', { waitUntil: 'domcontentloaded' }); await o2.page.waitForSelector('.formules .formule'); await o2.page.waitForTimeout(300);
      await clic(o2.page, A('retrouver'), 400);
      const rt = await texte(o2.page, 'main');
      ok((await h1(o2.page)) === 'Retrouver un achat' && /Aucun montant réel n’est débité/.test(rt) && /Vos écrits, eux, ne voyagent pas avec l’achat/.test(rt), P('2. « Retrouver un achat » explique le principe, et dit que les écrits se sauvegardent à part'));
      await clic(o2.page, A('cmd', '[data-v="retrouve"][data-f="parcours"]'), 400);
      let d2 = await garde(o2.page);
      ok((await h1(o2.page)) === 'Votre achat est rouvert.' && d2 && d2.tier === 'parcours' && !!d2.achats.parcours && !d2.achats.relais, P('2. sur un appareil vide, le lien simulé rouvre Le parcours, et seulement lui'));
      await o2.page.goto(APP + '#formules', { waitUntil: 'domcontentloaded' }); await o2.page.waitForSelector('.formules .formule'); await o2.page.waitForTimeout(300);
      await clic(o2.page, A('retrouver'), 400); await clic(o2.page, A('cmd', '[data-v="retrouve"][data-f="relais"]'), 400);
      d2 = await garde(o2.page);
      ok(!!d2.achats.relais && !!d2.achats.parcours, P('2. le lien simulé rouvre aussi Passer le relais'));
      ok(o2.errs.length === 0, P('2. aucune erreur à la récupération ' + o2.errs.slice(0, 3).join(' | ')));
      await o2.ctx.close();
    }

    // =====================================================================================================================
    // 3. « Passer le relais ».
    // =====================================================================================================================
    {
      const { ctx, page, errs, urls } = await ouvre(fmt);
      await page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.v-relais ' + R('exemple')); await page.waitForTimeout(400);
      const acc = await page.evaluate(() => { const B = [...document.querySelectorAll('.v-relais .ap-suite .btn')].map(b => ({ t: b.innerText.replace(/\s+/g, ' ').trim(), y: Math.round(b.getBoundingClientRect().top) })); return { B, vh: innerHeight, champs: document.querySelectorAll('.v-relais input, .v-relais textarea').length }; });
      ok(acc.B.length >= 2 && acc.B[0].t === 'Voir un exemple de fiche terminée' && acc.B[1].t === 'Préparer mon premier relais' && acc.B[0].y <= acc.B[1].y && acc.B[1].y < acc.vh && acc.champs === 0, P('3. l’outil montre d’abord le résultat : « Voir un exemple de fiche terminée », puis « Préparer mon premier relais », sans rien à remplir'));
      const accT = await texte(page, 'main');
      ok(/49 CHF une seule fois/.test(accT) && /Voir l’exemple, préparer votre fiche et la relire est gratuit/.test(accT) && /Vos fiches restent sur votre appareil/.test(accT), P('3. le prix, ce qui est gratuit et la confidentialité sont dits dès l’accueil de l’outil'));
      await clic(page, R('exemple'), 400);
      const ex = {};
      for (const [k, age, prenom] of [['e', 'À 5 ans', 'Noé'], ['a', 'À 16 ans', 'Lina'], ['g', 'À 35 ans', 'Bastien']]) {
        await clic(page, R('ex', '[data-v="' + k + '"]'), 250);
        ex[k] = await page.evaluate(() => { const f = document.querySelector('.v-relais .rl-fiche'); const t = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; const enf = [...f.children].map(e => e.className.split(' ')[0]);
          return { titre: t(f.querySelector('.rl-t')), enfants: enf.join(' '), trois: f.querySelectorAll('.rl-trois li').length, moi: f.querySelectorAll('.rl-moi li').length, signe: t(f.querySelector('.rl-signe')), tete: t(f.querySelector('.rl-trois h3')), tout: t(f) }; });
        vus.push(ex[k].tout);
        ok(ex[k].titre === 'Le relais de ' + prenom && ex[k].trois === 3 && ex[k].tete === 'Si tu ne lis que trois choses' && /^rl-tete rl-trois/.test(ex[k].enfants), P('3. exemple ' + age + ' : « ' + ex[k].titre + ' », avec « Si tu ne lis que trois choses » en tête et 3 repères'));
        ok(ex[k].moi >= 2 && ex[k].signe === prenom && ex[k].enfants.indexOf('rl-moi') > 0, P('3. exemple ' + age + ' : « Ce que je souhaite dire moi-même » a sa place à part, signée ' + ex[k].signe));
      }
      ok(/adulte/.test(ex.g.tout), P('3. l’exemple à 35 ans parle d’un adulte : la personne donne son avis'));
      ok(/Les prénoms et les numéros de cet exemple sont inventés/.test(await texte(page, 'main')), P('3. l’exemple se dit inventé'));
      ok((await garde(page)) === null, P('3. voir l’exemple ne crée rien sur l’appareil'));
      // préparer la première fiche : gratuit jusqu'à l'aperçu
      const gestes = await prepare(page);
      // le retour du téléphone respecte le chemin suivi dans l'outil, et rien de ce qui est écrit ne se perd
      await page.goBack(); await page.waitForTimeout(600);
      const r1 = await page.evaluate(() => ({ h1: document.querySelector('main h1').innerText.replace(/\s+/g, ' ').trim(), tel: (document.getElementById('rl-tt0') || {}).value || '' }));
      await page.goBack(); await page.waitForTimeout(600);
      const r2 = await page.evaluate(() => ({ h1: document.querySelector('main h1').innerText.replace(/\s+/g, ' ').trim(), moi: [...document.querySelectorAll('[data-rl^="moi."]')].map(e => e.value) }));
      ok(r1.h1 === 'Me joindre' && r1.tel === TELN && r2.h1 === 'Ce que je souhaite dire moi-même' && r2.moi.length === 2 && /cartes de métro/.test(r2.moi[0]), P('3. le retour du téléphone remonte la préparation pas à pas, avec ce qui était écrit (' + r1.h1 + ', puis ' + r2.h1 + ')'));
      await page.goForward(); await page.waitForTimeout(500); await page.goForward(); await page.waitForTimeout(600);
      ok((await h1(page)) === 'Voici exactement ce que vous transmettez', P('3. la flèche « suivant » du navigateur ramène à l’aperçu'));
      const ap = await page.evaluate(() => { const f = document.querySelector('.v-relais .rl-fiche'); const t = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; return { h1: t(document.querySelector('main h1')), titre: t(f.querySelector('.rl-t')), st: t(f.querySelector('.rl-st')), trois: [...f.querySelectorAll('.rl-trois li')].map(t), moi: [...f.querySelectorAll('.rl-moi li')].map(t), secs: [...f.querySelectorAll('.rl-s h3')].map(t), tel: (f.querySelector('.rl-tel a') || {}).href || '', page: t(document.querySelector('.rl-page')), trop: !!document.querySelector('.rl-page.rl-trop'), envoyer: !!document.querySelector('[data-act="rl"][data-k="envoi"]'), imprimer: !!document.querySelector('[data-act="rl"][data-k="imprimer"]'), offre: t(document.querySelector('.v-relais .offre')) }; });
      const apercu = await ficheTexte(page); vus.push(await texte(page, 'main'));
      ok(ap.h1 === 'Voici exactement ce que vous transmettez' && ap.titre === 'Le relais de ' + QUI && ap.st === 'Pour ' + CHEZ + ', ' + QUAND, P('3. l’aperçu montre la fiche telle qu’elle partira : « ' + ap.titre + ' », « ' + ap.st + ' »'));
      ok(ap.trois.length === 3 && /Dire « encore 5 minutes » avant de changer d’activité aide beaucoup Noé\./.test(ap.trois[0]) && ap.trois[2] === QUI + ' choisit lui-même son dessin animé du soir.', P('3. les 3 repères choisis par la famille sont en tête, dans son ordre et avec ses mots'));
      ok(ap.moi.length === 2 && ap.moi[0] === 'J’aime les trains et les cartes de métro.' && ap.moi[1] === 'Je n’aime pas qu’on finisse mes phrases.', P('3. « Ce que je souhaite dire moi-même » garde les mots de la personne : ' + ap.moi.join(' | ')));
      ok(ap.secs.join(' | ') === 'Ce qui aide Noé | Les repas | Le soir et la nuit' && /^tel:/.test(ap.tel), P('3. les rubriques remplies sont là, les vides n’apparaissent pas, et le numéro s’appelle d’un geste (' + ap.secs.join(', ') + ')'));
      ok(!ap.trop && /Votre fiche tient sur une page/.test(ap.page), P('3. l’aperçu dit que la fiche tient sur une page'));
      ok(!ap.envoyer && !ap.imprimer && /49 CHF une seule fois/.test(ap.offre) && /est gratuit/.test(ap.offre), P('3. préparer et relire sa fiche est gratuit. Envoyer et imprimer demandent l’outil, à 49 CHF une seule fois'));
      let d = await garde(page);
      ok(d.rel.fiches.length === 1 && d.rel.fiches[0].qui === QUI && !d.achats.relais, P('3. la fiche est gardée sur l’appareil'));
      // la fiche est rechargée par le téléphone au milieu de la préparation : rien n'est perdu
      await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForSelector('.v-relais'); await page.waitForTimeout(500);
      await page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.v-relais ' + R('ouvrir')); await clic(page, R('ouvrir'), 400);
      ok((await ficheTexte(page)) === apercu, P('3. après un rechargement, la fiche est retrouvée telle quelle'));
      // acheter l'outil, seul, puis envoyer
      await clic(page, '.v-relais .offre ' + A('commande', '[data-v="relais"]'), 400);
      const cr = await texte(page, 'main');
      ok((await h1(page)) === 'Votre commande' && /Passer le relais 49 CHF une seule fois/.test(cr) && /Total 49 CHF/.test(cr) && /ni abonnement ni renouvellement/.test(cr) && /Aucun montant réel n’est débité/.test(cr), P('3. la commande de l’outil : 49 CHF, une seule fois, en démonstration'));
      await clic(page, A('cmd', '[data-v="ok"]'), 450); d = await garde(page);
      ok(!!d.achats.relais && !d.achats.parcours && d.tier === 'free', P('3. « Passer le relais » s’achète seul : l’outil est ouvert, et le parcours n’est pas acheté pour autant'));
      await clic(page, R('reprise'), 400);
      ok((await ficheTexte(page)) === apercu && !!(await page.$(R('envoi'))) && !!(await page.$(R('imprimer'))), P('3. après l’achat, le parent revient à sa fiche, et peut l’envoyer ou l’imprimer'));
      // l'impression sur une page (mesurable dans Chrome)
      if (NAV === 'chromium') {
        await page.emulateMedia({ media: 'print' }); const pdf = await page.pdf({ format: 'A4', printBackground: true }); await page.emulateMedia({ media: 'screen' });
        const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
        ok(pages === 1, P('3. imprimée, la fiche tient sur une seule feuille A4 (' + pages + ' page)'));
      }
      await clic(page, R('envoi'), 400);
      const env = await page.evaluate(() => ({ lien: (document.getElementById('rl-lien') || {}).value || '', h1: document.querySelector('main h1').innerText.replace(/\s+/g, ' ').trim(), tout: document.querySelector('main').innerText.replace(/\s+/g, ' ').trim() }));
      vus.push(env.tout);
      ok(env.h1 === 'Envoyer la fiche à ' + CHEZ && env.lien.indexOf(PUBLIC + 'relais/#f=1.') === 0 && env.lien.length < 2000, P('3. le lien de la fiche est prêt (' + env.lien.length + ' caractères), à l’adresse de l’outil'));
      ok(/Aucun serveur ne la reçoit/.test(env.tout) && /sans compte et sans rien acheter/.test(env.tout) && /Toute personne à qui ce lien est transmis peut lire la fiche/.test(env.tout), P('3. avant d’envoyer, la famille sait où va sa fiche et qui pourra la lire'));
      ok(env.lien.indexOf(encodeURIComponent(QUI)) < 0 && env.lien.indexOf(QUI) < 0 && env.lien.indexOf('079') < 0, P('3. le lien ne laisse lire ni le prénom ni le numéro à l’œil nu'));
      await clic(page, R('partage'), 500); d = await garde(page);
      ok(d.rel.fiches[0].env === iso(0), P('3. « Envoyer le lien » note que la fiche est partie'));
      ok(!urls.some(u => /f=1\./.test(u) || u.indexOf(encodeURIComponent(QUI)) >= 0), P('3. aucune requête du parent ne contient la fiche'));

      // ---- le frère ouvre le lien sur un appareil qui n'a jamais vu le site ----
      const fr = await ouvre(fmt);
      const local = env.lien.replace(PUBLIC, APP);
      const t0 = Date.now(); await fr.page.goto(local, { waitUntil: 'domcontentloaded' }); await fr.page.waitForSelector('.v-relais .rl-fiche'); const dt = Date.now() - t0; await fr.page.waitForTimeout(400);
      const recu = await fr.page.evaluate(() => { const t = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; return { h1: t(document.querySelector('main h1')), tout: t(document.querySelector('#app')), sos: !!document.querySelector('.bar .sos'), logo: !!document.querySelector('.bar .wordmark'), champs: document.querySelectorAll('#app input, #app textarea').length, titre: document.title, cles: Object.keys(localStorage).join(','), fond: getComputedStyle(document.documentElement).display }; });
      vus.push(recu.tout);
      ok(recu.h1 === 'Le relais de ' + QUI && (await ficheTexte(fr.page)) === apercu, P('3. le frère ouvre le lien et lit aussitôt la fiche, mot pour mot celle de l’aperçu (' + dt + ' ms)'));
      ok(!VENTE.test(recu.tout) && recu.champs === 0 && !recu.sos && recu.logo, P('3. il la lit sans rien acheter et sans rien remplir. Rien ne lui est vendu, et le logo mène à l’accueil'));
      ok(recu.titre.indexOf(QUI) < 0 && (await garde(fr.page)) === null, P('3. le titre de la page ne porte pas le prénom, et rien n’est enregistré sur l’appareil du frère (' + recu.titre + ')'));
      ok(!fr.urls.some(u => /f=1\./.test(u)), P('3. la fiche n’est envoyée à aucun serveur : elle reste dans la partie de l’adresse que le navigateur garde pour lui'));
      ok(/Cette fiche est contenue dans le lien/.test(recu.tout) && /En cas d’urgence vitale, les secours\. En Suisse, le 144\./.test(recu.tout), P('3. la fiche reçue dit d’où elle vient et rappelle le numéro des secours'));
      if (NAV === 'chromium') {
        await fr.page.emulateMedia({ media: 'print' }); const pdf = await fr.page.pdf({ format: 'A4', printBackground: true }); await fr.page.emulateMedia({ media: 'screen' });
        ok((pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length === 1, P('3. le frère peut l’imprimer sur une seule feuille'));
      }
      // un lien coupé en route ne montre pas une fiche fausse
      await fr.page.goto(local.slice(0, local.length - 9), { waitUntil: 'domcontentloaded' }); await fr.page.waitForTimeout(300); await fr.page.reload({ waitUntil: 'domcontentloaded' }); await fr.page.waitForSelector('.v-relais'); await fr.page.waitForTimeout(400);
      ok((await h1(fr.page)) === 'Cette fiche ne s’ouvre pas' && !(await fr.page.$('.rl-fiche')), P('3. un lien coupé en route est refusé proprement, au lieu de montrer une fiche fausse'));
      // un lien fabriqué le 19 novembre 2026 s'ouvre toujours : le dictionnaire qui raccourcit les liens n'a pas bougé
      await fr.page.goto(APP + 'transmettre/', { waitUntil: 'domcontentloaded' }); await fr.page.waitForTimeout(300);
      await fr.page.goto(APP + LIEN_FIGE, { waitUntil: 'domcontentloaded' }); await fr.page.waitForSelector('.v-relais'); await fr.page.waitForTimeout(500);
      const fige = await fr.page.evaluate(() => ({ h1: (document.querySelector('main h1') || {}).innerText || '', trois: [...document.querySelectorAll('.rl-fiche .rl-trois li')].map(e => e.innerText.replace(/\s+/g, ' ').trim()), nuit: [...document.querySelectorAll('.rl-fiche .rl-s li')].map(e => e.innerText.replace(/\s+/g, ' ').trim()).join(' | ') }));
      ok(net(fige.h1) === 'Le relais de Noé' && fige.trois.length === 3 && fige.trois[2] === 'Noé choisit lui-même son dessin animé du soir.' && /Une veilleuse reste allumée et la porte reste entrouverte\./.test(fige.nuit), P('3. un lien fabriqué le 19 novembre 2026 s’ouvre toujours, mot pour mot : les liens déjà envoyés restent lisibles'));
      // le logo mène à la vitrine
      await fr.page.goto(local, { waitUntil: 'domcontentloaded' }); await fr.page.waitForSelector('.v-relais .rl-fiche'); await fr.page.waitForTimeout(300);
      await fr.page.click('.bar .wordmark'); await fr.page.waitForTimeout(700);
      ok(!!(await fr.page.$('main.intro')), P('3. depuis la fiche reçue, le logo mène à l’accueil du site'));
      ok(fr.errs.length === 0, P('3. aucune erreur chez le frère ' + fr.errs.slice(0, 3).join(' | ')));
      await fr.ctx.close();

      // ---- un texte qui ressemble à du code reste du texte ----
      {
        const x = await ouvre(fmt, { notes: Object.assign(PARENT(), { achats: { relais: { le: iso(0) } }, rel: { fiches: [{ id: 'fx', c: iso(0), m: iso(0), qui: '<img src=x onerror=window.__x=1>', chez: '"><script>window.__x=2</script>', quand: '', tu: true, trois: ['<b>gras</b> & <i>italique</i>', 'javascript:alert(1)', '</article><h1>faux</h1>'], moi: ['<svg onload=window.__x=3>'], s: { aide: ['<img src=x onerror=window.__x=4>'] }, tel: [{ n: '<u>n</u>', t: '079 000 00 00"><img src=x onerror=window.__x=5>' }], env: '', retour: '', retourLe: '', garde: '' }], reunions: [] } }) });
        await x.page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await x.page.waitForSelector('.v-relais ' + R('ouvrir')); await clic(x.page, R('ouvrir'), 400); await clic(x.page, R('envoi'), 400);
        const lx = (await x.page.inputValue('#rl-lien')).replace(PUBLIC, APP);
        const y = await ouvre(fmt); await y.page.goto(lx, { waitUntil: 'domcontentloaded' }); await y.page.waitForSelector('.v-relais .rl-fiche'); await y.page.waitForTimeout(500);
        const s = async p => p.evaluate(() => ({ x: window.__x === undefined, img: document.querySelectorAll('.rl-fiche img, .rl-fiche script, .rl-fiche svg:not(.logo):not(.i), .rl-fiche b:not(.x) > i').length, h1: document.querySelectorAll('main h1').length, t: document.querySelector('.rl-fiche').innerText }));
        const sx = await s(x.page), sy = await s(y.page);
        ok(sx.x && sy.x && sx.img === 0 && sy.img === 0 && sy.h1 === 1 && /<b>gras<\/b> & <i>italique<\/i>/.test(sy.t), P('3. un texte qui ressemble à du code s’affiche comme du texte, chez la famille et chez le proche'));
        await x.ctx.close(); await y.ctx.close();
      }

      // ---- au retour : une seule question, réutilisée au prochain relais ----
      await page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.v-relais .rl-auretour'); await page.waitForTimeout(300);
      const ret0 = await texte(page, '.v-relais .rl-auretour');
      ok(/Le relais est passé \?/.test(ret0) && /Une seule question vous attend/.test(ret0), P('3. de retour dans l’outil, une carte attend le parent : « Le relais est passé ? »'));
      await clic(page, '.rl-auretour ' + R('retour'), 400);
      const rq = await page.evaluate(() => ({ h1: document.querySelector('main h1').innerText.replace(/\s+/g, ' ').trim(), champs: document.querySelectorAll('.v-relais textarea, .v-relais input').length }));
      ok(net(rq.h1) === QUESTION && rq.champs === 1, P('3. au retour, une seule question : « ' + net(rq.h1) + ' »'));
      const GARDE = 'Le programme dit le matin a bien aidé, et Rémi a gardé le même ordre pour le coucher.';
      await page.fill('#rl-retour', GARDE); await clic(page, R('retour-ok'), 500); d = await garde(page);
      ok(d.rel.fiches[0].retour === GARDE && d.rel.fiches[0].retourLe === iso(0) && !(await page.$('.v-relais .rl-auretour')), P('3. la réponse est gardée sur l’appareil, et la carte ne redemande rien'));
      // le deuxième relais : on repart de la dernière fiche
      let g2 = 0; const c2 = async (sel, ms = 300) => { await clic(page, sel, ms); g2++; };
      await c2(R('suivant'), 400);
      const s0 = await page.evaluate(() => ({ h1: document.querySelector('main h1').innerText.replace(/\s+/g, ' ').trim(), qui: document.getElementById('rl-qui').value, chez: document.getElementById('rl-chez').value, quand: document.getElementById('rl-quand').value, garde: (document.querySelector('.rl-garde .rl-cite') || {}).innerText || '', titre: (document.querySelector('.rl-garde h2') || {}).innerText || '' }));
      ok(s0.qui === QUI && s0.chez === CHEZ && s0.quand === '' && net(s0.titre) === 'La dernière fois, vous vouliez garder ceci' && net(s0.garde) === GARDE, P('3. le deuxième relais repart de la dernière fiche et remet sous les yeux ce que le parent voulait garder'));
      await c2(R('garde'), 300);
      await c2(R('pas', '[data-v="1"]')); await c2(R('pas', '[data-v="1"]')); await c2(R('pas', '[data-v="1"]')); await c2(R('pas', '[data-v="1"]')); await c2(R('apercu'), 400);
      const ap2 = await page.evaluate(() => { const f = document.querySelector('.v-relais .rl-fiche'); const t = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; return { trois: f.querySelectorAll('.rl-trois li').length, moi: f.querySelectorAll('.rl-moi li').length, aide: [...f.querySelectorAll('.rl-s')].map(t)[0] || '', st: t(f.querySelector('.rl-st')) }; });
      d = await garde(page);
      ok(d.rel.fiches.length === 2 && ap2.trois === 3 && ap2.moi === 2 && ap2.aide.indexOf(GARDE) > 0, P('3. la deuxième fiche est complète, avec les 3 repères, la parole de ' + QUI + ' et la phrase gardée au retour'));
      ok(g2 <= 8 && g2 < gestes / 3, P('3. la deuxième fois, la fiche est prête en ' + g2 + ' gestes, contre ' + gestes + ' la première fois'));
      ok(d.rel.fiches[0].retour === GARDE && d.rel.fiches[0].qui === QUI, P('3. la première fiche reste telle qu’elle a été envoyée'));

      // ---- préparer une réunion avec ce qui est déjà écrit ----
      await page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.v-relais ' + R('reunion')); await clic(page, R('reunion'), 400);
      ok((await h1(page)) === 'Avec qui avez-vous rendez-vous ?', P('3. « Préparer une réunion avec l’école ou le foyer » commence par : avec qui ?'));
      await clic(page, R('avec', '[data-v="foyer"]'), 200).catch(async () => { const v = await page.$$eval('[data-act="rl"][data-k="avec"]', L => L.map(b => b.getAttribute('data-v'))); await clic(page, R('avec', '[data-v="' + v[1] + '"]'), 200); });
      await page.fill('#rl-rq', 'jeudi 3 décembre à 16 heures'); await clic(page, R('rpas', '[data-v="1"]'));
      const obs = await page.$$eval('.rl-obs .rl-m', L => L.map(b => ({ t: b.querySelector('span').innerText.replace(/\s+/g, ' ').trim(), d: b.querySelector('small').innerText.replace(/\s+/g, ' ').trim() })));
      ok(obs.length >= 5 && obs.some(o => o.t === GARDE) && obs.some(o => /Dire « encore 5 minutes »/.test(o.t)) && obs.every(o => /^Vos 3 repères$|^Votre fiche de relais$|^Votre retour du /.test(o.d)), P('3. les phrases déjà écrites sont proposées pour la réunion, avec leur origine (' + obs.length + ' phrases, dont ce que le parent voulait garder)'));
      await page.click('.rl-obs .rl-m >> nth=0'); await page.waitForTimeout(150); await page.click('.rl-obs .rl-m >> nth=1'); await page.waitForTimeout(150);
      await clic(page, R('rpas', '[data-v="1"]'));
      ok((await h1(page)) === 'Ce que vous demandez' && !!(await page.$('.rl-perds')), P('3. pour la demande, le bouton « Je perds mes mots » est là'));
      await clic(page, '.rl-perds', 250);
      const debuts = await page.$$eval('.rl-modeles .rl-m', L => L.map(b => b.innerText.replace(/\s+/g, ' ').trim()));
      ok(debuts.length >= 4 && debuts.some(x => /^Je vous demande de/.test(x)), P('3. « Je perds mes mots » propose des débuts de phrase : ' + debuts.slice(0, 3).join(' | ')));
      const iDem = debuts.findIndex(x => /^Je vous demande de/.test(x)); await clic(page, R('mot', '[data-i="' + iDem + '"]'), 300);
      await page.keyboard.type('prévenir ' + QUI + ' la veille quand un éducateur change.'); await page.waitForTimeout(200);
      await clic(page, R('rpas', '[data-v="1"]'));
      await page.fill('[data-rl="reu.pri.0"]', QUI + ' est prévenu la veille des changements.'); await page.fill('[data-rl="reu.pri.1"]', 'Un seul interlocuteur pour la famille.'); await page.fill('[data-rl="reu.pri.2"]', 'Le bilan peut attendre janvier.');
      await clic(page, R('feuille-ok'), 400);
      const fe = await page.evaluate(() => { const f = document.querySelector('.v-relais .rl-fiche'); const t = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; return { h1: t(document.querySelector('main h1')), enfants: [...f.children].map(e => e.className.split(' ')[0]).join(' '), pri: [...f.querySelectorAll('.rl-trois li')].map(t), dem: t(f.querySelector('.rl-moi p')), obs: [...f.querySelectorAll('.rl-s li')].map(t), haut: Math.round(f.querySelector('.rl-trois').getBoundingClientRect().top), vh: innerHeight }; });
      vus.push(await texte(page, 'main'));
      ok(fe.h1 === 'Ma feuille pour la réunion' && fe.enfants === 'rl-trois rl-moi rl-s' && fe.pri.length === 3 && fe.haut < fe.vh, P('3. la feuille de réunion garde les 3 priorités sous les yeux, tout en haut'));
      ok(fe.dem === 'Je vous demande de prévenir ' + QUI + ' la veille quand un éducateur change.' && fe.obs.length === 2 && fe.obs[0] === obs[0].t, P('3. la demande et les observations choisies y sont, avec les mots du parent : « ' + fe.dem + ' »'));
      await clic(page, '.rl-perds', 250);
      const dire = await page.$$eval('.rl-dire li', L => L.map(e => e.innerText.replace(/\s+/g, ' ').trim()));
      ok(dire.length >= 4 && dire.some(x => /Je reprends mes notes/.test(x)), P('3. pendant la réunion, « Je perds mes mots » donne des phrases à dire telles quelles : ' + dire[0]));

      // ---- sauvegarder, tout perdre, restaurer ----
      await page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.v-relais ' + R('sauver')); await clic(page, R('sauver'), 400);
      ok((await h1(page)) === 'Sauvegarder ou restaurer mes écrits' && /Rien n’est envoyé pendant ces 2 opérations/.test(await texte(page, 'main')), P('3. la sauvegarde se fait sur l’appareil, et l’écran le dit'));
      const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.click(R('sauve'))]);
      const fichier = path.join(os.tmpdir(), 'pepe-sauvegarde-' + NAV + '-' + Date.now() + '.json'); await dl.saveAs(fichier);
      let sv = null; try { sv = JSON.parse(fs.readFileSync(fichier, 'utf8')); } catch (e) { }
      ok(/^parent-ecoute-mes-ecrits-\d{4}-\d\d-\d\d\.json$/.test(dl.suggestedFilename()) && sv && sv.app === 'parent-ecoute' && sv.v === 1 && sv.donnees.rel.fiches.length === 2 && sv.donnees.rel.reunions.length === 1 && sv.donnees.rel.fiches[0].retour === GARDE, P('3. la sauvegarde est un fichier qui contient les 2 fiches, la réunion et le retour (' + dl.suggestedFilename() + ')'));
      ok(errs.length === 0, P('3. aucune erreur dans l’outil ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
      const neuf = await ouvre(fmt);
      await neuf.page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await neuf.page.waitForSelector('.v-relais ' + R('sauver')); await clic(neuf.page, R('sauver'), 400);
      // un fichier qui n'est pas une sauvegarde est refusé
      const faux = path.join(os.tmpdir(), 'pepe-faux-' + NAV + '-' + Date.now() + '.json'); fs.writeFileSync(faux, JSON.stringify({ bonjour: 1 }));
      await neuf.page.setInputFiles('#rl-f', faux); await neuf.page.waitForTimeout(500);
      ok(!(await neuf.page.$('.v-relais .confirm')) && (await garde(neuf.page)) === null, P('3. un fichier qui n’est pas une sauvegarde est refusé, et rien ne change'));
      await neuf.page.setInputFiles('#rl-f', fichier); await neuf.page.waitForSelector('.v-relais .confirm'); await neuf.page.waitForTimeout(200);
      ok(/Remplacer ce que contient cet appareil par la sauvegarde du/.test(await texte(neuf.page, '.v-relais .confirm')) && (await garde(neuf.page)) === null, P('3. avant de restaurer, l’outil demande une confirmation, et rien n’est encore remplacé'));
      await clic(neuf.page, R('restaure-oui'), 500);
      const dr = await garde(neuf.page);
      ok(dr && dr.rel.fiches.length === 2 && dr.rel.reunions.length === 1 && dr.rel.fiches[0].retour === GARDE && !!dr.achats.relais && (await neuf.page.$$('.v-relais .rl-mes .sit')).length >= 2, P('3. sur un appareil vide, la sauvegarde restaure les fiches, la réunion et le retour'));
      ok(neuf.errs.length === 0, P('3. aucune erreur à la restauration ' + neuf.errs.slice(0, 3).join(' | ')));
      await neuf.ctx.close(); try { fs.unlinkSync(fichier); fs.unlinkSync(faux); } catch (e) { }
    }

    // =====================================================================================================================
    // 4. Trois usages de bout en bout (le deuxième, la fiche que le frère ouvre, est rejoué en entier au point 3).
    // =====================================================================================================================
    {
      // a. un parent arrive pour souffler
      const o = await ouvre(fmt);
      await o.page.goto(APP, { waitUntil: 'domcontentloaded' }); await o.page.waitForSelector('main.intro .portes .porte'); await o.page.waitForTimeout(400);
      const t0 = Date.now(); await o.page.click(A('porte', '[data-v="souffle"]')); await o.page.waitForSelector('main.souffle'); const dt = Date.now() - t0;
      const debut = await o.page.$eval('main.souffle', e => e.innerText.replace(/\s+/g, ' ').trim()); vus.push(debut);
      const inspire = await o.page.waitForFunction(() => /Inspirez/.test(document.querySelector('main.souffle').innerText), null, { timeout: 12000 }).then(() => true).catch(() => false);
      const so = await o.page.evaluate(() => ({ t: document.querySelector('main.souffle').innerText.replace(/\s+/g, ' ').trim(), champs: document.querySelectorAll('main.souffle input:not([type=range]), main.souffle textarea').length, cercle: !!document.querySelector('main.souffle .rond, main.souffle .cercle, main.souffle [class*="cercle"], main.souffle svg circle, main.souffle .bulle') }));
      vus.push(so.t);
      ok(dt < (EN_LIGNE ? 4000 : 1500) && so.champs === 0 && /Souffler 2 minutes/.test(debut) && /Le cercle va vous guider/.test(debut) && inspire, P('4. usage 1 : un geste depuis la vitrine, et le parent est dans la respiration (' + dt + ' ms), sans formulaire. Quelques secondes plus tard, le cercle dit « Inspirez »'));
      ok(!VENTE.test(so.t) && !VENTE.test(debut), P('4. usage 1 : la respiration ne propose rien à acheter'));
      await o.page.click('.bar .back').catch(() => { }); await o.page.waitForTimeout(600);
      ok(!!(await o.page.$('main.intro')), P('4. usage 1 : « Retour » ramène à la vitrine, d’où il venait'));
      ok(o.errs.length === 0, P('4. usage 1 : aucune erreur ' + o.errs.slice(0, 3).join(' | ')));
      await o.ctx.close();

      // c. un parent essaie une étape depuis la fiche sur les crises, garde un geste, puis revient
      const p = await ouvre(fmt);
      await p.page.goto(APP + 'fiches/la-crise/', { waitUntil: 'domcontentloaded' }); await p.page.waitForSelector('.vers-apercu ' + A('apercu')); await p.page.waitForTimeout(400);
      const suiteCrise = await p.page.$$eval('.vers-apercu', L => L.map(e => e.innerText.replace(/\s+/g, ' ').trim()));
      ok(suiteCrise.length === 1 && /Essayer cette étape/.test(suiteCrise[0]) && !VENTE.test(suiteCrise[0]), P('4. la fiche sur les crises propose une seule suite, l’essai d’une étape, sans prix'));
      await clic(p.page, '.vers-apercu ' + A('apercu'), 500);
      const e0 = await texte(p.page, 'main');
      ok(/Le schéma/.test(e0) && !!(await p.page.$('main .schema, main [class*="schema"], main svg')) && !VENTE.test(e0), P('4. usage 3 : l’essai commence par le schéma de la vague, sans rien vendre'));
      await clic(p.page, A('ap', '[data-k="1"]'), 400); await clic(p.page, '.ap-g[data-v="sortir"]', 200); await p.page.fill('#ap-mot', 'Je vais sur le balcon 2 minutes.');
      await clic(p.page, A('ap-garde'), 500);
      const e2 = await texte(p.page, 'main');
      ok(/C’est gardé dans votre carnet/.test(e2) && /Sortir un instant\. Je vais sur le balcon 2 minutes\./.test(e2), P('4. usage 3 : le geste choisi est gardé dans le carnet, avec ses mots'));
      await clic(p.page, A('ap', '[data-k="3"]'), 500);
      const e3 = await texte(p.page, 'main');
      ok(/Ce que vous retrouvez la semaine prochaine/.test(e3) && /Le parcours 84 CHF en tout/.test(e3) && e3.indexOf(TOTAL) > 0 && (await p.page.$$('main .f-payer .f-mode')).length === 2 && !!(await p.page.$(A('entrer', '[data-v="parcours"]'))), P('4. usage 3 : l’écran suivant dit ce que l’étape d’après apporte. Le prix n’arrive qu’ici, avec les 2 façons de payer et la suite gratuite'));
      // il ferme, et revient 3 jours plus tard
      await p.ctx.close();
      const dAv = { onboarded: true, start: iso(0), tier: 'free', achats: {}, steps: {}, seen: {}, depots: [], moods: {}, pv: 3, notes: { reguler: { t: 'Sortir un instant. Je vais sur le balcon 2 minutes.', d: iso(0) } }, com: { ap: iso(0) }, vu: iso(0) };
      const q = await ouvre(fmt, { notes: dAv, jours: 3 });
      await q.page.goto(APP, { waitUntil: 'domcontentloaded' }); await q.page.waitForSelector('.reprise-geste'); await q.page.waitForTimeout(500);
      const rg = await q.page.evaluate(() => { const c = document.querySelector('.reprise-geste'), dose = document.querySelector('.dose'); const t = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; return { t: t(c), bouton: t(c.querySelector('.btn')), y: Math.round(c.getBoundingClientRect().top), yDose: dose ? Math.round(dose.getBoundingClientRect().top) : -1, vh: innerHeight, revoila: !!document.querySelector('.revoila') }; });
      vus.push(rg.t);
      ok(/Sortir un instant\. Je vais sur le balcon 2 minutes\./.test(rg.t) && rg.bouton === 'Reprendre ici' && rg.y < rg.yDose && rg.y < rg.vh && !rg.revoila, P('4. usage 3 : à la visite suivante, « Aujourd’hui » montre d’abord son propre geste et « Reprendre ici » (à ' + rg.y + ' px, avant la dose)'));
      await clic(q.page, A('apercu-reprise'), 500);
      const rep = await texte(q.page, 'main');
      ok(/Votre geste vous attendait/.test(rep) && /Sortir un instant\. Je vais sur le balcon 2 minutes\./.test(rep) && !!(await q.page.$(A('ap', '[data-k="3"]'))) && (await garde(q.page)).com.rp === iso(3), P('4. usage 3 : « Reprendre ici » rouvre l’essai là où il s’était arrêté, avec sa note, et la suite à un geste'));
      await q.ctx.close();
      // un parent qui suit le parcours est interrompu en pleine étape. Il revient 2 jours plus tard, par la vitrine.
      const NOTE = 'Je l’ai laissé choisir son pull ce matin.';
      const SUIVI = (jEtape, jVu) => Object.assign(PARENT(), { tier: 'parcours', achats: { parcours: { m: 'une', le: iso(-20), n: 1 } }, me: '', steps: { depart: true }, seen: { depart: iso(-20), croire: iso(jEtape) }, notes: { depart: { t: 'Je commence pour retrouver des soirées plus calmes.', d: iso(-20) }, croire: { t: NOTE, d: iso(jEtape) } }, vu: iso(jVu) });
      const lit = pg => pg.evaluate(() => { const t = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; return { revoila: t(document.querySelector('.revoila')), etape: t(document.querySelector('.step.semaine b')), aller: t(document.querySelector('.step.semaine .aller')), avant: t(document.querySelector('.etape-avant')), fil: t(document.querySelector('.reprendre .fil')) }; });
      const r = await ouvre(fmt, { notes: SUIVI(-2, -2) });
      await r.page.goto(APP, { waitUntil: 'domcontentloaded' }); await r.page.waitForSelector('.step.semaine'); await r.page.waitForTimeout(500);
      const rv = await lit(r.page);
      ok(/Croire en lui/.test(rv.etape) && rv.aller === 'Reprendre l’étape' && /Étape 2 sur 24/.test(rv.fil) && !rv.revoila && !rv.avant, P('4. usage 3 : 2 jours après, son étape l’attend sur « Aujourd’hui », avec « Reprendre l’étape » (' + rv.etape + ')'));
      await r.page.goto(APP + '#accueil', { waitUntil: 'domcontentloaded' }); await r.page.waitForSelector('main.intro .voie'); await r.page.waitForTimeout(400);
      const voie = await r.page.$eval('main.intro .voie', e => e.innerText.replace(/\s+/g, ' ').trim());
      ok(voie === 'Reprendre mon parcours', P('4. usage 3 : la vitrine lui propose « Reprendre mon parcours »'));
      await r.page.click('main.intro .voie'); await r.page.waitForSelector('main.etape #note'); await r.page.waitForTimeout(400);
      ok(/Croire en lui/.test(await h1(r.page)) && (await r.page.$eval('#note', e => e.value)) === NOTE, P('4. usage 3 : « Reprendre mon parcours » retrouve la bonne étape, et sa note est là'));
      await r.page.fill('#note', NOTE + ' Ce soir, il a mis la table tout seul.'); await r.page.waitForTimeout(700);
      await r.page.reload({ waitUntil: 'domcontentloaded' }); await r.page.waitForSelector('#note'); await r.page.waitForTimeout(400);
      ok((await r.page.$eval('#note', e => e.value)) === NOTE + ' Ce soir, il a mis la table tout seul.', P('4. usage 3 : interrompu en pleine écriture, il retrouve la même étape et ce qu’il venait d’écrire'));
      await r.page.goBack().catch(() => { }); await r.page.waitForTimeout(600);
      ok(!!(await r.page.$('main.intro')), P('4. usage 3 : le retour du téléphone le ramène à la vitrine, d’où il venait'));
      const d12 = await garde(r.page);
      ok(d12.notes.depart.t === 'Je commence pour retrouver des soirées plus calmes.' && d12.steps.depart === true && d12.vu === iso(0), P('4. usage 3 : ses notes d’avant sont intactes'));
      await r.ctx.close();
      // le même parent, absent 12 jours : une étape s'est ouverte sans lui, et la sienne n'est pas perdue
      const ab = await ouvre(fmt, { notes: SUIVI(-13, -12) });
      await ab.page.goto(APP, { waitUntil: 'domcontentloaded' }); await ab.page.waitForSelector('.step.semaine'); await ab.page.waitForTimeout(500);
      const av = await lit(ab.page);
      ok(av.revoila === 'Vous revoilà. Ici, rien n’est en retard, et ce que vous avez écrit vous attend.', P('4. usage 3 : après 12 jours d’absence, un accueil simple : « ' + av.revoila + ' »'));
      ok(/Les croyances qui freinent/.test(av.etape) && av.aller === 'Ouvrir l’étape' && /Étape 3 sur 24/.test(av.fil), P('4. usage 3 : une seule étape s’est ouverte pendant son absence, et rien ne s’est accumulé (' + av.etape + ')'));
      ok(/L’étape d’avant, « Croire en lui/.test(av.avant) && /reste ouverte, avec vos notes\./.test(av.avant), P('4. usage 3 : l’étape qu’il avait commencée est signalée, avec ses notes (' + av.avant + ')'));
      await ab.page.click('.etape-avant'); await ab.page.waitForSelector('main.etape #note'); await ab.page.waitForTimeout(400);
      ok(/Croire en lui/.test(await h1(ab.page)) && (await ab.page.$eval('#note', e => e.value)) === NOTE, P('4. usage 3 : un geste, et il retrouve cette étape et sa note'));
      await ab.page.goto(APP, { waitUntil: 'domcontentloaded' }); await ab.page.waitForSelector('.step.semaine'); await ab.page.waitForTimeout(400);
      await ab.page.click('.step.semaine'); await ab.page.waitForSelector('main.etape'); await ab.page.waitForTimeout(300);
      await ab.page.goto(APP, { waitUntil: 'domcontentloaded' }); await ab.page.waitForSelector('.step.semaine'); await ab.page.waitForTimeout(400);
      ok(!(await ab.page.$('.etape-avant')) && !(await ab.page.$('.revoila')), P('4. usage 3 : une fois la nouvelle étape ouverte, « Aujourd’hui » ne rappelle plus rien'));
      ok(ab.errs.length === 0, P('4. usage 3 : aucune erreur après l’absence ' + ab.errs.slice(0, 3).join(' | ')));
      await ab.ctx.close();
      ok(r.errs.length === 0 && q.errs.length === 0 && p.errs.length === 0, P('4. usage 3 : aucune erreur ' + r.errs.concat(q.errs, p.errs).slice(0, 3).join(' | ')));
    }

    // =====================================================================================================================
    // 5. Les portes d'entrée, une seule suite par fiche, le cadeau en maquette, et les espaces sans rien à vendre.
    // =====================================================================================================================
    {
      const { ctx, page, errs } = await ouvre(fmt);
      // la fiche publique sur le relais
      await page.goto(APP + 'fiches/confier-son-enfant-a-un-proche/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.vers-apercu'); await page.waitForTimeout(400);
      const fi = await page.evaluate(() => { const t = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; const wa = document.querySelector('a.btn.wa'); return { h1: t(document.querySelector('main h1')), suites: [...document.querySelectorAll('.vers-apercu')].map(t), wa: wa ? wa.href : '', waT: t(wa), ogt: (document.querySelector('meta[property="og:title"]') || {}).content || '', ogi: (document.querySelector('meta[property="og:image"]') || {}).content || '', ogd: (document.querySelector('meta[property="og:description"]') || {}).content || '' }; });
      vus.push(await texte(page));
      ok(fi.h1 === 'Confier son enfant à un proche' && fi.suites.length === 1 && /Voir un exemple de fiche terminée/.test(fi.suites[0]) && !VENTE.test(fi.suites[0]), P('5. la fiche sur le relais propose une seule suite, l’exemple de fiche, sans prix'));
      const waTxt = decodeURIComponent((fi.wa.split('?text=')[1] || ''));
      ok(fi.waT === 'Envoyer par WhatsApp' && /^https:\/\/wa\.me\/\?text=/.test(fi.wa) && waTxt.indexOf(PUBLIC + 'fiches/confier-son-enfant-a-un-proche/') > 0 && /Confier son enfant à un proche/.test(waTxt), P('5. « Envoyer par WhatsApp » porte le titre de la fiche et son adresse, et rien d’autre (' + waTxt.slice(0, 70) + '…)'));
      ok(fi.ogt === 'Confier son enfant à un proche' && fi.ogd.length > 40 && fi.ogi === PUBLIC + 'img/fiches/confier-son-enfant-a-un-proche.jpg', P('5. le lien de la fiche a son aperçu : un titre, une phrase et une image'));
      const img = await page.request.get(fi.ogi.replace(PUBLIC, APP)); const brut = await page.request.get(APP + 'fiches/confier-son-enfant-a-un-proche/');
      const html = await brut.text();
      ok(img.status() === 200 && /image\/jpeg/.test(img.headers()['content-type'] || '') && /<h1[^>]*>Confier son enfant à un proche/.test(html), P('5. l’image de l’aperçu existe, et la page est lisible avant même que le site ait démarré'));
      ok((await garde(page)) === null, P('5. lire la fiche ne crée rien sur l’appareil'));
      // la fiche sur l'école mène à la préparation d'une réunion
      await page.goto(APP + 'fiches/l-ecole/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.vers-apercu'); await page.waitForTimeout(300);
      const ec = await page.$$eval('.vers-apercu', L => L.map(e => e.innerText.replace(/\s+/g, ' ').trim()));
      ok(ec.length === 1 && /Je perds mes mots/.test(ec[0]) && !VENTE.test(ec[0]), P('5. la fiche sur l’école propose une seule suite : préparer la réunion'));
      // une fiche sans suite n'en invente pas
      await page.goto(APP + 'fiches/les-repas/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('main h1'); await page.waitForTimeout(300);
      ok((await page.$$('.vers-apercu')).length === 0, P('5. une fiche sans suite naturelle ne propose rien de plus'));
      // la page à transmettre
      await page.goto(APP + 'transmettre/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('main h1'); await page.waitForTimeout(400);
      const tr = await page.evaluate(() => { const t = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; const b = document.querySelector('main .btn.primary'); return { h1: t(document.querySelector('main h1')), tout: t(document.querySelector('main')), bouton: t(b), yBouton: b ? Math.round(b.getBoundingClientRect().top) : 9999, vh: innerHeight, mot: t(document.querySelector('.tr-mot')), liens: [...document.querySelectorAll('main .tr-suite a, main .tr-suite button')].map(t) }; });
      vus.push(tr.tout);
      ok(net(tr.h1) === PHRASE && /Antonio Company, travailleur social/.test(tr.tout) && /personne en situation de handicap/.test(tr.tout), P('5. la page à transmettre s’ouvre sur la phrase d’Antonio et dit à qui s’adresse l’espace'));
      ok(tr.bouton === 'Souffler 2 minutes, maintenant' && /C’est gratuit, sans compte/.test(tr.tout), P('5. elle mène à une expérience gratuite précise : « ' + tr.bouton + ' »'));
      const lienTr = await page.$eval('#tr-lien', e => e.value).catch(() => '');
      ok(tr.mot.length > 80 && /Je vous transmets cette page/.test(tr.mot) && lienTr === PUBLIC + 'transmettre/', P('5. elle donne au professionnel une phrase humaine à reprendre, et le lien de la page'));
      ok(/ne remplace ni un suivi, ni un médecin, ni un thérapeute/.test(tr.tout) && !/84 CHF|49 CHF/.test(tr.tout), P('5. elle dit ce que l’espace n’est pas, et n’affiche aucun prix'));
      await page.click('main .btn.primary'); await page.waitForSelector('main.souffle'); await page.waitForTimeout(500);
      ok(!!(await page.$('main.souffle')), P('5. un geste depuis la page transmise, et la famille respire'));
      ok(errs.length === 0, P('5. aucune erreur sur les pages publiques ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();

      // offrir à un parent : une maquette
      const g = await ouvre(fmt);
      await g.page.goto(APP + '#formules', { waitUntil: 'domcontentloaded' }); await g.page.waitForSelector('.formules .formule'); await g.page.waitForTimeout(300);
      await clic(g.page, A('cadeau'), 400);
      const ca = await texte(g.page, 'main');
      ok((await h1(g.page)) === 'Offrir à un parent' && /^Maquette/.test(ca) && /Aucun montant réel n’est débité/.test(ca) && /84 CHF, en une fois/.test(ca) && /49 CHF, une seule fois/.test(ca) && !/six fois/.test(ca), P('5. « Offrir à un parent » est une maquette : les 2 produits, en paiement unique'));
      ok(/Vous ne saurez ni quand le parent l’ouvre, ni ce qu’il y écrit/.test(ca), P('5. le cadeau préserve la confidentialité du parent, et l’écran le dit'));
      await clic(g.page, A('cadeau', '[data-v="relais"]'), 250); await clic(g.page, A('cmd', '[data-v="cadeau-ok"]'), 400);
      const lienCadeau = await g.page.inputValue('#cad-lien');
      ok(lienCadeau === PUBLIC + '#cadeau-relais' && (await garde(g.page)) === null, P('5. le cadeau donne un lien à transmettre, et n’ouvre rien chez celui qui offre'));
      await g.ctx.close();
      const b = await ouvre(fmt);
      await b.page.goto(lienCadeau.replace(PUBLIC, APP), { waitUntil: 'domcontentloaded' }); await b.page.waitForSelector('main.commande'); await b.page.waitForTimeout(400);
      const act = await texte(b.page, 'main');
      ok((await h1(b.page)) === 'Quelqu’un vous offre Passer le relais.' && /Vous l’activez quand vous voulez/.test(act) && /ne voit rien de ce que vous faites ici/.test(act) && (await garde(b.page)) === null, P('5. le parent ouvre le lien du cadeau : il l’active quand il veut, et rien n’est fait sans lui'));
      await clic(b.page, A('cmd', '[data-v="active"]'), 450);
      const db = await garde(b.page);
      ok((await h1(b.page)) === 'Votre cadeau est activé.' && !!db.achats.relais && !db.achats.parcours, P('5. une fois activé, le cadeau ouvre le produit offert, et seulement lui'));
      ok(b.errs.length === 0 && g.errs.length === 0, P('5. aucune erreur dans la maquette du cadeau ' + b.errs.concat(g.errs).slice(0, 3).join(' | ')));
      await b.ctx.close();

      // le SOS, la respiration et « Déposer » : rien à vendre, même pour un parent sans achat qui a déjà beaucoup déposé
      const DEP = Object.assign(PARENT(), { depots: [1, 2, 3, 4].map(i => ({ id: 'd' + i, date: iso(-i), time: '21:05', text: 'Un soir difficile, numéro ' + i + '.', mode: 'listen', question: 'Qu’est-ce qui dépend de vous ?', lumiere: 'Vous avez le droit d’être fatigué.' })) });
      const s = await ouvre(fmt, { notes: DEP });
      await s.page.goto(APP, { waitUntil: 'domcontentloaded' }); await s.page.waitForSelector('.portes .porte'); await s.page.waitForTimeout(400);
      await s.page.click('.sos'); await s.page.waitForTimeout(600);
      const tSos = await texte(s.page, '#app');
      ok(/144/.test(tSos) && !VENTE.test(tSos), P('5. le SOS ne propose rien à acheter'));
      await s.page.goto(APP, { waitUntil: 'domcontentloaded' }); await s.page.waitForSelector('.portes .porte'); await s.page.waitForTimeout(300);
      await s.page.click(A('porte', '[data-v="souffle"]')); await s.page.waitForSelector('main.souffle'); await s.page.waitForTimeout(700);
      ok(!VENTE.test(await texte(s.page, 'main')), P('5. la respiration ne propose rien à acheter'));
      await s.page.goto(APP, { waitUntil: 'domcontentloaded' }); await s.page.waitForSelector('.portes .porte'); await s.page.waitForTimeout(300);
      await s.page.click(A('porte', '[data-v="deposer"]')); await s.page.waitForSelector('main.deposer #draft'); await s.page.waitForTimeout(400);
      const tDep0 = await texte(s.page, 'main');
      await s.page.fill('#draft', 'Ce soir, je suis épuisée et je n’ai plus de patience.'); await s.page.waitForTimeout(200);
      const depBtn = await s.page.$('main.deposer .btn.primary'); if (depBtn) { await depBtn.click(); await s.page.waitForTimeout(1500); }
      const tDep1 = await texte(s.page, 'main');
      ok(!VENTE.test(tDep0) && !VENTE.test(tDep1) && !(await s.page.$('.sheet')), P('5. « Déposer » ne propose rien à acheter, avant comme après un dépôt, même après plusieurs dépôts'));
      ok(s.errs.length === 0, P('5. aucune erreur dans les espaces d’aide ' + s.errs.slice(0, 3).join(' | ')));
      await s.ctx.close();
    }

    // =====================================================================================================================
    // 6. Les 3 mesures du lancement : sur l'appareil, sans aucun écrit.
    // =====================================================================================================================
    if (tel) {
      const { ctx, page, errs } = await ouvre(fmt, { notes: Object.assign(PARENT(), { moods: { [iso(0)]: 1 }, depots: [{ id: 'd1', date: iso(0), time: '21:05', text: 'Un texte très personnel que personne ne doit compter.', mode: 'listen', question: 'q', lumiere: 'l' }] }) });
      // un essai terminé
      await page.goto(APP + '#apercu', { waitUntil: 'domcontentloaded' }); await page.waitForSelector(A('ap', '[data-k="1"]')); await page.waitForTimeout(300);
      await clic(page, A('ap', '[data-k="1"]'), 300); await clic(page, '.ap-g[data-v="souffle"]', 200); await page.fill('#ap-mot', 'Un mot à moi.'); await clic(page, A('ap-garde'), 400); await clic(page, A('ap', '[data-k="3"]'), 400);
      // un achat de chaque offre, puis un deuxième jour d'utilisation simulé pour l'outil
      await clic(page, 'main ' + A('commande', '[data-v="parcours"][data-m="six"]'), 400); await clic(page, A('cmd', '[data-v="ok"]'), 400);
      await page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.v-relais .offre'); await clic(page, '.v-relais .offre ' + A('commande', '[data-v="relais"]'), 400); await clic(page, A('cmd', '[data-v="ok"]'), 400);
      await clic(page, R('reprise'), 400);
      // l'outil sert aussi sans fiche de relais : une réunion se prépare, et se retrouve
      ok(!!(await page.$('.v-relais ' + R('reunion'))) && !(await page.$('.v-relais .rl-mes')), P('6. avec l’outil et sans aucune fiche, « Préparer une réunion » est proposé dès l’accueil de l’outil'));
      await clic(page, R('reunion'), 300); await clic(page, R('rpas', '[data-v="1"]'), 250);
      ok(/Vous n’avez encore rien écrit dans vos fiches ni dans votre journal/.test(await texte(page, 'main')), P('6. sans rien d’écrit, la réunion se prépare quand même : le parent note son observation'));
      await page.fill('#rl-ro', 'Mardi, il est rentré du centre sans avoir mangé.'); await clic(page, R('rpas', '[data-v="1"]'), 250); await clic(page, R('rpas', '[data-v="1"]'), 250); await clic(page, R('feuille-ok'), 300);
      await page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.v-relais ' + R('exemple')); await page.waitForTimeout(300);
      ok((await page.$$('.v-relais .rl-mes ' + R('feuille'))).length === 1, P('6. la feuille de réunion se retrouve dans « Mes réunions », même sans fiche de relais'));
      const d = await garde(page); const com = d.com || {};
      ok(com.ap === iso(0) && com.ach && com.ach.parcours && com.ach.parcours.m === 'six' && com.ach.relais && Array.isArray((com.us || {}).relais), P('6. les 3 mesures sont notées sur l’appareil : l’essai terminé, l’achat de chaque offre, l’usage de l’outil ' + JSON.stringify(com).slice(0, 160)));
      const brut = JSON.stringify(com);
      ok(/^[A-Za-z0-9"{}\[\]:,_-]*$/.test(brut) && !/personnel|moi|balcon|centre|mangé/.test(brut) && brut.length < 400, P('6. elles ne contiennent que des dates et le nom d’une offre : aucun écrit, aucune humeur, aucune situation'));
      // un autre jour, le parent rouvre l'outil : c'est le retour que l'on veut compter
      await ctx.close();
      const j2 = await ouvre(fmt, { notes: d, jours: 2 });
      await j2.page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await j2.page.waitForSelector('.v-relais ' + R('exemple')); await j2.page.waitForTimeout(400);
      const dv = await garde(j2.page) || d;
      ok(((dv.com || {}).us || {}).relais.length === 1, P('6. ouvrir la page de l’outil ne compte pas comme un retour : il faut s’en servir'));
      await clic(j2.page, R('exemple'), 400);
      const d2 = await garde(j2.page) || d;
      ok(((d2.com || {}).us || {}).relais && d2.com.us.relais.length === 2 && d2.com.us.relais[1] === iso(2), P('6. revenir utiliser l’outil un autre jour est noté une fois (' + JSON.stringify((d2.com || {}).us) + ')'));
      await j2.page.goto(APP, { waitUntil: 'domcontentloaded' }); await j2.page.waitForSelector('.tab[data-view="me"]'); await clic(j2.page, '.tab[data-view="me"]', 400);
      const moi = await texte(j2.page, 'main');
      ok(!ESSAI || (/Les 3 mesures du lancement, sur cet appareil/.test(moi) && /elles restent sur votre appareil et rien n’est envoyé/.test(moi) && /Retour sur Passer le relais, un autre jour oui/.test(moi)), P('6. « Moi » montre ces 3 mesures, et dit qu’elles restent sur l’appareil'));
      ok(errs.length === 0 && j2.errs.length === 0, P('6. aucune erreur ' + errs.concat(j2.errs).slice(0, 3).join(' | ')));
      await j2.ctx.close();
    }
  }
  await browser.close();
  // ce qui vaut pour tout l'essai
  const tout = vus.join(' \n ');
  ok(!/Avec Antonio/.test(tout), NAV + ' · « Avec Antonio » n’apparaît plus sur aucun des écrans visités (' + vus.length + ' écrans lus)');
  ok(!/14 CHF par mois|49 CHF par mois/.test(tout), NAV + ' · aucun écran n’affiche plus un prix par mois');
  ok(sorties.length === 0, NAV + ' · pendant tout l’essai, aucune requête n’est partie vers un autre site : aucun paiement, aucune mesure ' + sorties.slice(0, 3).join(' | '));
  notesFin.push('tout paiement est simulé : aucun prestataire de paiement n’est branché, et aucune carte n’est demandée');
  if (NAV !== 'chromium') notesFin.push('l’impression sur une seule feuille n’est mesurable que dans Chrome');
  notesFin.forEach(x => console.log('  note : ' + x));
  console.log('lancement (' + NAV + ') : ' + n + ' vérifications, ' + ko + ' échec' + (ko > 1 ? 's' : '') + ' (' + APP + ')');
  process.exit(ko ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
