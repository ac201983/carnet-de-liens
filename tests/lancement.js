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
//   7. La parole du parent : la question de l'accueil, ce qui est dit avant d'écrire, les mots gardés tels quels, « J'aimerais le dire à quelqu'un »,
//      ce que le parent emporte, et l'outil réutilisable proposé seulement à la fin. Écrire reste gratuit et sans limite.
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
    const ctx = await browser.newContext(Object.assign({ locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: opt.anim ? 'no-preference' : 'reduce', acceptDownloads: true }, f));
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
      ok(v.pour === 'Pour les parents d’un enfant, d’un ado ou d’un adulte en situation de handicap', P('1. la vitrine dit d’abord à qui elle s’adresse : « ' + v.pour + ' »'));
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
      ok(acc.B.length >= 2 && acc.B[0].t === 'Préparer les 3 choses à savoir pour samedi' && acc.B[1].t === 'Voir un exemple de fiche terminée' && acc.B[0].y <= acc.B[1].y && acc.B[1].y < acc.vh && acc.champs === 0, P('3. l’outil propose d’abord l’essai, « Préparer les 3 choses à savoir pour samedi », puis « Voir un exemple de fiche terminée », sans rien à remplir ' + JSON.stringify(acc.B.slice(0, 2))));
      const accT = await texte(page, 'main');
      ok(/49 CHF une seule fois/.test(accT) && /Voir l’exemple, préparer votre fiche et la relire est gratuit/.test(accT) && /Vos fiches restent sur votre appareil/.test(accT), P('3. le prix, ce qui est gratuit et la confidentialité sont dits dès l’accueil de l’outil'));
      await clic(page, R('exemple'), 400);
      const ex = {};
      // Les 3 exemples ne citent plus d'âge : un âge écrit laisserait dehors un bébé de 1 an comme un adulte de 60 ans.
      const puces = await page.$$eval('.v-relais .rl-ages .chip', L => L.map(b => b.innerText.replace(/\s+/g, ' ').trim()));
      ok(puces.join('|') === 'Un enfant|Une adolescente|Un adulte' && !/\d+ ans/.test(await texte(page, '.v-relais .rl-ages')), P('3. les 3 exemples se choisissent sans âge écrit : ' + puces.join(', ')));
      for (const [k, age, prenom] of [['e', 'd’un enfant', 'Noé'], ['a', 'd’une adolescente', 'Lina'], ['g', 'd’un adulte', 'Bastien']]) {
        await clic(page, R('ex', '[data-v="' + k + '"]'), 250);
        ex[k] = await page.evaluate(() => { const f = document.querySelector('.v-relais .rl-fiche'); const t = e => e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; const enf = [...f.children].map(e => e.className.split(' ')[0]);
          return { titre: t(f.querySelector('.rl-t')), enfants: enf.join(' '), trois: f.querySelectorAll('.rl-trois li').length, moi: f.querySelectorAll('.rl-moi li').length, signe: t(f.querySelector('.rl-signe')), tete: t(f.querySelector('.rl-trois h3')), tout: t(f) }; });
        vus.push(ex[k].tout);
        ok(ex[k].titre === 'Le relais de ' + prenom && ex[k].trois === 3 && ex[k].tete === 'Si tu ne lis que trois choses' && /^rl-tete rl-trois/.test(ex[k].enfants), P('3. exemple ' + age + ' : « ' + ex[k].titre + ' », avec « Si tu ne lis que trois choses » en tête et 3 repères'));
        ok(ex[k].moi >= 2 && ex[k].signe === prenom && ex[k].enfants.indexOf('rl-moi') > 0, P('3. exemple ' + age + ' : « Ce que je souhaite dire moi-même » a sa place à part, signée ' + ex[k].signe));
      }
      ok(/adulte/.test(ex.g.tout), P('3. le 3e exemple parle d’un adulte : la personne donne son avis'));
      const mainEx = await texte(page, 'main');
      ok(/Les prénoms et les numéros sont inventés/.test(mainEx) && /quel que soit l’âge de votre enfant, tout-petit ou adulte depuis longtemps/.test(mainEx) && !/\b(5|16|35) ans\b/.test(mainEx), P('3. l’exemple se dit inventé, et l’outil se dit fait pour tous les âges sans en citer aucun'));
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
      // La feuille vient se poser : en ouvrant l'aperçu, le titre « Si tu ne lis que trois choses » ressort, et ses 3 repères se lisent ensemble sans faire défiler.
      await page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.v-relais ' + R('ouvrir')); await page.waitForTimeout(400);
      await page.click(R('ouvrir')); await page.waitForSelector('.v-relais .feuille>.rl-fiche');
      const pose0 = await page.evaluate(() => { const f = document.querySelector('.v-relais .feuille>.rl-fiche'), cs = getComputedStyle(f); return { classe: f.classList.contains('se-pose'), anim: cs.animationName, calme: matchMedia('(prefers-reduced-motion: reduce)').matches, effets: document.documentElement.classList.contains('fx') }; });
      await page.waitForTimeout(1700);
      const pose1 = await page.evaluate(() => { const f = document.querySelector('.v-relais .feuille>.rl-fiche'), t = f.querySelector('.rl-trois'), h = t.querySelector('h3,.rl-h'), cs = getComputedStyle(f), autre = f.querySelector('.rl-s h3, .rl-moi h3, .rl-tel h3');
        const tabs = document.querySelector('.tabs'); let bas = innerHeight; if (tabs && getComputedStyle(tabs).position === 'fixed') { const y = tabs.getBoundingClientRect().top; if (y > innerHeight / 2) bas = y; }
        const barre = document.querySelector('header.bar'), haut = barre ? Math.max(0, barre.getBoundingClientRect().bottom) : 0;
        return { transform: cs.transform, op: cs.opacity, titre: h.textContent.replace(/\s+/g, ' ').trim(), tete: Math.round(h.getBoundingClientRect().top), haut: Math.round(haut), lis: [...t.querySelectorAll('li')].map(e => Math.round(e.getBoundingClientRect().bottom)), bas: Math.round(bas), gros: +(parseFloat(getComputedStyle(h).fontSize) / parseFloat(getComputedStyle(autre).fontSize)).toFixed(2), trait: getComputedStyle(h, '::after').borderTopWidth, y: Math.round(scrollY) }; });
      ok((pose0.effets && !pose0.calme ? (pose0.classe && pose0.anim === 'rl-pose') : pose0.anim !== 'rl-pose') && pose1.transform === 'none' && pose1.op === '1', P('3. en ouvrant l’aperçu, la feuille vient se poser, puis elle est tout à fait immobile ' + JSON.stringify([pose0, pose1.transform, pose1.op])));
      ok(pose1.titre === 'Si tu ne lis que trois choses' && pose1.gros > 1.12 && parseFloat(pose1.trait) >= 2 && pose1.lis.length === 3 && pose1.tete >= pose1.haut && pose1.lis.every(y => y <= pose1.bas), P('3. le titre « Si tu ne lis que trois choses » ressort, et ses 3 repères se lisent ensemble dès l’ouverture, sans faire défiler ' + JSON.stringify(pose1)));
      // l'impression sur une page (mesurable dans Chrome), et parfaitement fixe
      await page.emulateMedia({ media: 'print' });
      const imp = await page.evaluate(() => { const f = document.querySelector('.v-relais .feuille>.rl-fiche'), cs = getComputedStyle(f), h = f.querySelector('.rl-trois h3,.rl-trois .rl-h'); return { classe: f.classList.contains('se-pose'), anim: cs.animationName, tr: cs.transform, op: cs.opacity, bouge: [...f.querySelectorAll('*')].filter(e => getComputedStyle(e).animationName !== 'none').length, trait: getComputedStyle(h, '::after').animationName, titre: getComputedStyle(h).color }; });
      await page.emulateMedia({ media: 'screen' });
      ok(imp.anim === 'none' && imp.tr === 'none' && imp.op === '1' && imp.bouge === 0 && imp.trait === 'none', P('3. imprimée, la fiche est parfaitement fixe : aucune animation, aucun décalage ' + JSON.stringify(imp)));
      // Avec les animations du téléphone (les autres contrôles de cette série se font en mouvement réduit) : la feuille se pose une fois, en 1 seconde.
      {
        const an = await ouvre(fmt, { anim: true, notes: Object.assign(PARENT(), { achats: { relais: { le: iso(0) } }, rel: { fiches: [{ id: 'fa', c: iso(0), m: iso(0), qui: 'Lina', chez: 'sa tante Élise', quand: 'samedi 21 novembre', tu: true, trois: ['Lina a besoin de savoir ce qui vient après.', 'Quand elle se bouche les oreilles, le bruit est trop fort.', 'Son traitement est dans la poche avant du sac.'], moi: ['J’aime dessiner.'], s: { repas: ['Lina mange de tout, lentement.'] }, tel: [{ n: 'Maman', t: '079 000 00 00' }], env: '', retour: '', retourLe: '', garde: '' }], reunions: [] } }) });
        await an.page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await an.page.waitForSelector('.v-relais ' + R('ouvrir')); await an.page.waitForTimeout(1200);
        const lisPose = () => an.page.evaluate(() => { const f = document.querySelector('.v-relais .feuille>.rl-fiche'); if (!f) return null; const cs = getComputedStyle(f), t = f.querySelector('.rl-trois'); const tabs = document.querySelector('.tabs'); let bas = innerHeight; if (tabs && getComputedStyle(tabs).position === 'fixed') { const y = tabs.getBoundingClientRect().top; if (y > innerHeight / 2) bas = y; } return { classe: f.classList.contains('se-pose'), anim: cs.animationName, tr: cs.transform, op: +cs.opacity, large: document.documentElement.scrollWidth > innerWidth + 1, lis: [...t.querySelectorAll('li')].map(e => Math.round(e.getBoundingClientRect().bottom)), bas: Math.round(bas) }; });
        await an.page.click(R('ouvrir')); await an.page.waitForSelector('.v-relais .feuille>.rl-fiche');
        // on la regarde plusieurs fois pendant sa première seconde : sur une machine lente, un seul regard pourrait tomber après la fin
        let a1 = null, large = false; for (let k = 0; k < 14; k++) { const v = await lisPose(); if (v) { large = large || v.large; if (!a1 || (a1.tr === 'none' && v.tr !== 'none')) a1 = v; } await an.page.waitForTimeout(70); }
        await an.page.waitForTimeout(1300); const a2 = await lisPose();
        ok(a1 && a1.classe && a1.anim === 'rl-pose' && a1.tr !== 'none' && !large && a2.tr === 'none' && a2.op === 1 && !a2.large, P('3. avec les animations, la feuille est en train de se poser juste après l’ouverture, puis immobile, sans jamais élargir la page ' + JSON.stringify([a1, a2.tr])));
        ok(a2.lis.length === 3 && a2.lis.every(y => y <= a2.bas), P('3. et ses 3 repères se lisent ensemble dès l’ouverture ' + JSON.stringify([a2.lis, a2.bas])));
        // l'écran redessiné sans changer d'écran (la rotation du téléphone, par exemple) ne la fait pas se poser à nouveau
        await an.page.evaluate(() => window.dispatchEvent(new Event('resize'))); await an.page.waitForTimeout(500);
        await an.page.click('.v-relais ' + R('aller', '[data-v="0"]')); await an.page.waitForTimeout(700); await an.page.goBack(); await an.page.waitForSelector('.v-relais .feuille>.rl-fiche'); await an.page.waitForTimeout(1600);
        const a3 = await lisPose();
        ok(a3 && a3.tr === 'none' && a3.op === 1 && an.errs.length === 0, P('3. en revenant sur l’aperçu, la fiche est de nouveau immobile, sans erreur ' + JSON.stringify([a3 && a3.tr, an.errs.slice(0, 2)])));
        await an.ctx.close();
      }
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
      ok(obs.length >= 5 && obs.some(o => o.t === GARDE) && obs.some(o => /Dire « encore 5 minutes »/.test(o.t)) && obs.every(o => /^Vos 3 repères$|^Votre fiche de relais$|^Votre retour du |^Vos mots du /.test(o.d)), P('3. les phrases déjà écrites sont proposées pour la réunion, avec leur origine (' + obs.length + ' phrases, dont ce que le parent voulait garder)'));
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
      ok(dt < (EN_LIGNE ? 4000 : 1500) && so.champs === 0 && /Souffler 2 minutes/.test(debut) && /(La goutte va|Les cercles vont|Les mots vont) vous guider/.test(debut) && inspire, P('4. usage 1 : un geste depuis la vitrine, et le parent est dans la respiration (' + dt + ' ms), sans formulaire. Quelques secondes plus tard, l’écran dit « Inspirez »'));
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
      ok(net(tr.h1) === PHRASE && /Antonio Company, éducateur social, responsable d’une équipe socio-éducative et père de 3 enfants/.test(tr.tout) && /personne en situation de handicap, quel que soit son âge, tout-petit ou adulte depuis longtemps/.test(tr.tout) && !/\b(5|16|35) ans\b/.test(tr.tout), P('5. la page à transmettre s’ouvre sur la phrase d’Antonio, dit à qui s’adresse l’espace sans citer d’âge, et donne les 2 rôles d’Antonio'));
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
      const t6 = await texte(page, 'main');
      ok(/Un texte très personnel que personne ne doit compter\./.test(t6) && /Vos mots du /.test(t6) && !!(await page.$('#rl-ro')), P('6. sans fiche ni journal, la réunion se prépare quand même : les mots déposés sont proposés, et le parent peut noter une autre observation'));
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

    // =====================================================================================================================
    // 7. La parole du parent (demande d'Antonio du 19 novembre 2026) : écrire, garder ses mots pour soi, ou préparer comment les dire à quelqu'un.
    //    Avant d'écrire, l'écran dit comment l'espace fonctionne, qui peut lire le texte et où il reste. Les mots du parent ne sont jamais réécrits.
    //    Écrire reste gratuit et sans limite. Rien ne se vend dans cet espace : l'outil à découvrir n'est proposé qu'une fois le texte prêt.
    // =====================================================================================================================
    {
      const Q1 = 'Qu’aimeriez-vous qu’on comprenne de votre journée ?';   // la question de l'écran « Déposer ce qui pèse »
      const Q0 = 'De quoi auriez-vous besoin aujourd’hui ?';              // la question du premier écran, depuis le 26 novembre 2026
      const MOT_A = 'Mon expérience d’éducateur social m’a guidé dans le choix des questions et des outils que vous trouverez ici. Aujourd’hui, vous avez peut-être besoin de souffler, d’écrire ce que vous gardez pour vous ou de trouver les mots pour en parler à quelqu’un. C’est vous qui choisissez.';
      // Des mots avec un retour à la ligne, des guillemets, 2 espaces de suite et des chevrons : ils doivent ressortir tels quels, partout.
      const MOTS = 'Ce matin, il a hurlé pour mettre ses chaussures.\nTout le monde nous regardait : « encore lui ! »  J’ai tenu <b>bon</b>, mais ce soir je suis vidée.';
      const brut = (page, sel) => page.$eval(sel, e => e.textContent).catch(() => null);
      const s = await ouvre(fmt);
      if (NAV === 'chromium') await s.ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => { });
      await s.page.goto(APP, { waitUntil: 'domcontentloaded' }); await s.page.waitForSelector('.seuil .porte'); await s.page.waitForTimeout(300);
      const acc = await s.page.evaluate(() => { const q = sel => [...document.querySelectorAll(sel)].map(e => e.textContent.split(String.fromCharCode(160)).join(' ').replace(/\s+/g, ' ').trim());
        return { marque: (document.querySelector('main.intro .hbar .wordmark') || {}).innerText || '', besoin: q('.seuil .besoin-q')[0], portes: q('.seuil .porte b'), nom: q('.nom-sens h2')[0], sens: q('.nom-sens .ns-l'), mot: q('.mot-a blockquote p')[0], signe: q('.mot-a figcaption')[0], titre: document.title }; });
      ok(/^Parent écouté,\s*parent éclairé$/.test(acc.marque.trim()) && acc.nom === 'Parent écouté, parent éclairé' && !/Parent Écouté|Parent Éclairé/.test(await texte(s.page, '#app')) && !/Parent Écouté|Parent Éclairé/.test(acc.titre), P('7. le nom s’écrit « Parent écouté, parent éclairé », en haut de l’écran et dans la page ' + JSON.stringify([acc.marque, acc.titre])));
      ok(acc.besoin === Q0 && acc.portes.slice(0, 2).join('|') === 'Écrire ce que j’ai sur le cœur|Souffler 2 minutes', P('7. après la phrase d’accueil, la question « ' + Q0 + ' », puis « Écrire ce que j’ai sur le cœur » et « Souffler 2 minutes » ' + JSON.stringify(acc.portes)));
      ok(acc.sens.length === 2 && /^Écouté\. /.test(acc.sens[0]) && /^Éclairé\. /.test(acc.sens[1]) && acc.mot === MOT_A && /^Antonio Company\s*Éducateur social, responsable d’une équipe socio-éducative$/.test(acc.signe), P('7. le nom est expliqué en 2 phrases, et le mot d’Antonio est repris mot pour mot, avec sa signature et ses 2 rôles (' + acc.signe + ')'));

      // ---- avant d'écrire : la question, le fonctionnement réel, qui peut lire et où le texte reste ----
      await clic(s.page, '.seuil ' + A('porte', '[data-v="deposer"]'), 500); await s.page.waitForSelector('main.deposer #draft'); await s.page.waitForTimeout(400);
      const av = await s.page.evaluate(() => { const n = e => e ? e.textContent.split(String.fromCharCode(160)).join(' ').replace(/\s+/g, ' ').trim() : ''; const $ = x => document.querySelector(x); const d = $('#draft'), note = $('#qui-lit'), lab = $('label.dep-q'); const vis = x => [...document.querySelectorAll(x)].some(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight; });
        return { h1: n($('main.deposer h1')), q: n(lab), pour: lab ? lab.getAttribute('for') : '', sub: n($('.dep-tete .sub')), note: n(note), decrit: d.getAttribute('aria-describedby'), avant: !!(note && (note.compareDocumentPosition(d) & Node.DOCUMENT_POSITION_FOLLOWING)) && !!(lab && (lab.compareDocumentPosition(d) & Node.DOCUMENT_POSITION_FOLLOWING)),
          choix: [...document.querySelectorAll('.dep-choix .btn')].map(n), silence: n($('main.deposer [data-act="porte"][data-v="souffle"]')), accueil: vis('.bar [data-act="accueil"], .tabs [data-act="accueil"]'), retour: vis('.bar [data-act="back"]'), sos: vis('.bar .sos, .tabs .sos'), comment: !!$('main.deposer [data-act="voix"]') }; });
      ok(av.h1 === 'Déposer ce qui pèse' && av.q === Q1 && av.pour === 'draft', P('7. « Déposer ce qui pèse » pose sa question, « ' + Q1 + ' », et c’est l’étiquette de la zone d’écriture ' + JSON.stringify([av.h1, av.q])));
      ok(av.note === 'Votre texte reste sur cet appareil, il n’est envoyé ni à Antonio ni à une intelligence artificielle, et seule une personne qui utilise cet appareil peut le lire.' && av.decrit === 'qui-lit' && av.avant, P('7. avant la zone d’écriture, une phrase dit où le texte reste et qui peut le lire, et elle est reliée au champ : « ' + av.note + ' »'));
      ok(/^Cet espace fonctionne seul\./.test(av.sub) && /question écrite à l’avance\.$/.test(av.sub) && av.comment, P('7. le fonctionnement réel est dit avant d’écrire (l’espace fonctionne seul, la question est écrite à l’avance), avec le lien « Comment fonctionne cet espace ? »'));
      ok(av.choix.join('|') === 'Garder ces mots pour moi|J’aimerais le dire à quelqu’un' && /^Je préfère le silence, souffler 2 minutes$/.test(av.silence) && av.accueil && av.retour && av.sos, P('7. les 2 choix, « Souffler 2 minutes » pour qui préfère le silence, et « Retour », « Accueil » et SOS à portée ' + JSON.stringify(av.choix)));
      const tAvant = await texte(s.page, 'main');
      // le silence, puis le retour : l'écran d'écriture est retrouvé
      await clic(s.page, 'main.deposer ' + A('porte', '[data-v="souffle"]'), 700); const souffle = !!(await s.page.$('main.souffle'));
      await s.page.goBack(); await s.page.waitForSelector('main.deposer #draft', { timeout: 5000 }).catch(() => { }); await s.page.waitForTimeout(400);
      ok(souffle && !!(await s.page.$('main.deposer #draft')), P('7. « Je préfère le silence » ouvre la respiration, et « Retour » ramène à l’écran pour écrire'));

      // ---- « J'aimerais le dire à quelqu'un » : les mots sont gardés tels quels, puis une première phrase est proposée ----
      await s.page.fill('#draft', MOTS); await clic(s.page, A('ddire'), 300); await s.page.waitForSelector('main.dire #amorce', { timeout: 6000 }); await s.page.waitForTimeout(500);
      let d = await garde(s.page);
      const dire0 = await s.page.evaluate(() => ({ h1: document.querySelector('main.dire h1').textContent.replace(/\s+/g, ' ').trim(), amorce: document.getElementById('amorce').value, mots: document.querySelector('.dire-c .em-texte').textContent, injecte: document.querySelectorAll('.dire-c .em-texte *').length, a: [...document.querySelectorAll('.dire-c .chip[data-k="a"]')].map(b => b.textContent.trim() + ':' + b.getAttribute('aria-pressed')), joint: document.querySelector('.dire-joint').getAttribute('aria-pressed'), outil: !!document.querySelector('.vers-relais') }));
      ok(d.depots.length === 1 && d.depots[0].text === MOTS && dire0.mots === MOTS && dire0.injecte === 0, P('7. les mots du parent sont gardés et montrés tels quels, retour à la ligne, guillemets et chevrons compris'));
      ok(dire0.h1 === 'J’aimerais le dire à quelqu’un' && dire0.amorce === 'J’aimerais te dire comment s’est passée ma journée. Je ne te demande pas de solution, j’ai besoin que tu m’écoutes.' && dire0.a.join('|') === 'À un proche:true|Lors d’une réunion:false' && dire0.joint === 'true', P('7. une première phrase courte est proposée, pour un proche d’abord ' + JSON.stringify([dire0.amorce, dire0.a])));
      const tDire = await texte(s.page, 'main');
      ok(!VENTE.test(tAvant) && !VENTE.test(tDire) && !dire0.outil && !(await s.page.$('.sheet')), P('7. rien ne se vend pendant que le parent écrit ou prépare ses mots'));
      // changer de destinataire sans avoir touché la phrase : la phrase suit. Une fois modifiée, elle reste celle du parent.
      await clic(s.page, A('dire', '[data-k="a"][data-v="reunion"]'), 300);
      const reu = await s.page.inputValue('#amorce');
      await s.page.fill('#amorce', 'Avant de commencer, j’aimerais vous lire ce que j’ai écrit hier soir.'); await s.page.waitForTimeout(700);
      await clic(s.page, A('dire', '[data-k="a"][data-v="proche"]'), 300); const garde1 = await s.page.inputValue('#amorce'); await clic(s.page, A('dire', '[data-k="a"][data-v="reunion"]'), 300);
      d = await garde(s.page);
      ok(reu === 'Avant que nous commencions, j’aimerais vous dire quelque chose d’important pour moi.' && garde1 === 'Avant de commencer, j’aimerais vous lire ce que j’ai écrit hier soir.' && d.depots[0].dire && d.depots[0].dire.a === 'reunion' && d.depots[0].dire.t === garde1 && d.depots[0].text === MOTS, P('7. la phrase proposée suit le destinataire tant qu’elle n’a pas été touchée, puis la phrase modifiée par le parent est gardée telle quelle'));
      // « Je perds mes mots » : les débuts de phrase de l'outil de réunion, à continuer avec ses mots
      await clic(s.page, 'main.dire .rl-perds', 300);
      const debuts = await s.page.$$eval('.dire-modeles .dire-m', L => L.map(b => b.textContent.trim()));
      await clic(s.page, A('dire', '[data-k="mot"][data-i="3"]'), 350);
      const foc = await s.page.evaluate(() => { const e = document.getElementById('amorce'); return { v: e.value, actif: document.activeElement === e, fin: e.selectionStart === e.value.length }; });
      await s.page.keyboard.type('prévenir avant un changement.'); await s.page.waitForTimeout(650);
      ok(debuts.length === 7 && debuts[3] === 'Je vous demande de…' && foc.v === 'Je vous demande de ' && foc.actif && foc.fin && (await s.page.inputValue('#amorce')) === 'Je vous demande de prévenir avant un changement.', P('7. « Je perds mes mots » propose 7 débuts de phrase, et le parent continue le sien avec ses mots ' + JSON.stringify([debuts.length, foc])));
      // copier : la première phrase, puis les mots du parent, inchangés. L'outil à découvrir n'apparaît qu'ensuite, sans parler de prix.
      await clic(s.page, A('dire', '[data-k="joint"]'), 200); const sansMots = await s.page.$eval('.dire-joint', b => b.getAttribute('aria-pressed')); await clic(s.page, A('dire', '[data-k="joint"]'), 200);
      await clic(s.page, A('dire', '[data-k="copie"]'), 600); await s.page.waitForSelector('.dire-pret', { timeout: 5000 });
      const ATTENDU = 'Je vous demande de prévenir avant un changement.\n\n' + MOTS;
      const pret = await s.page.evaluate(() => ({ t: document.getElementById('dire-texte').textContent, etat: (document.querySelector('.dire-pret [role="status"]') || {}).textContent || '', fin: !!document.querySelector('.dire-pret [data-act="dfin"]'), outil: (document.querySelector('.vers-relais h2') || {}).textContent || '', lien: !!document.querySelector('.vers-relais [data-act="rl"][data-k="ouvre"]') }));
      ok(sansMots === 'false' && pret.t === ATTENDU && (NAV === 'chromium' ? /^C’est copié\./ : /^C’est copié\.|^Votre texte est prêt, juste en dessous\./).test(pret.etat) && pret.fin, P('7. « Copier » prépare la première phrase suivie des mots du parent, inchangés, et « J’ai fini pour aujourd’hui » est là ' + JSON.stringify(pret.etat.slice(0, 40))));
      if (NAV === 'chromium') { const pp = await s.page.evaluate(() => navigator.clipboard.readText().catch(e => 'ERR ' + e)); ok(pp === ATTENDU, P('7. le presse-papiers contient exactement ce texte ' + JSON.stringify(pp.slice(0, 60)))); }
      else notesFin.push('le contenu du presse-papiers n’est relu que dans Chrome : ailleurs, le texte prêt à copier est vérifié à l’écran');
      ok(pret.outil === 'Arriver à la réunion avec vos mots' && pret.lien && !VENTE.test(await texte(s.page, 'main')), P('7. une fois le texte prêt pour une réunion, l’outil réutilisable est proposé à la découverte, sans prix'));
      // reprendre sa phrase après avoir copié : le texte prêt s'efface. Si le téléphone refuse la copie, l'écran ne dit pas « copié » : le texte est sélectionné.
      await s.page.$eval('#amorce', e => { e.focus(); e.setSelectionRange(e.value.length, e.value.length); }); await s.page.keyboard.type(' Merci.'); await s.page.waitForTimeout(650);
      const efface = !(await s.page.$('.dire-pret')) && !(await s.page.$('main.dire .vers-relais'));
      await s.page.evaluate(() => { try { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('refus')) } }); } catch (e) { } });
      await clic(s.page, A('dire', '[data-k="copie"]'), 600); await s.page.waitForSelector('.dire-pret', { timeout: 5000 });
      const main2 = await s.page.evaluate(() => ({ etat: (document.querySelector('.dire-pret [role="status"]') || {}).textContent || '', t: document.getElementById('dire-texte').textContent, sel: String(window.getSelection()) }));
      ok(efface && /^Votre texte est prêt, juste en dessous\./.test(main2.etat) && !/copié/.test(main2.etat) && main2.t === 'Je vous demande de prévenir avant un changement. Merci.\n\n' + MOTS && main2.sel.replace(/\s+/g, ' ').trim() === main2.t.replace(/\s+/g, ' ').trim(), P('7. si le téléphone refuse la copie, l’écran ne dit pas « copié » : le texte, à jour, est sélectionné pour être copié à la main ' + JSON.stringify(main2.etat.slice(0, 40))));
      // laisser tomber : retour à l'écran d'écriture, les mots restent gardés
      await clic(s.page, A('dire', '[data-k="laisse"]'), 700); await s.page.waitForSelector('main.deposer #draft', { timeout: 5000 }).catch(() => { });
      d = await garde(s.page);
      ok(!!(await s.page.$('main.deposer #draft')) && !(await s.page.$('main.dire')) && d.depots.length === 1 && d.depots[0].text === MOTS, P('7. « Finalement, je garde mes mots pour moi » ramène à l’écran pour écrire, et rien n’est perdu'));

      // ---- « Garder ces mots pour moi » : ce que le parent emporte, autant de fois qu'il le veut ----
      const AUTRES = ['Je n’ai pas dormi et la journée a été longue.', 'Le rendez-vous a encore été déplacé.', 'Ce soir, le repas s’est bien passé.', 'Je voudrais une heure pour moi cette semaine.'];
      for (const t of AUTRES) { await s.page.fill('#draft', t); await clic(s.page, 'main.deposer ' + A('dsend'), 300); await s.page.waitForFunction(k => { try { return JSON.parse(localStorage.getItem(k[0])).depots.some(x => x.text === k[1]); } catch (e) { return false; } }, [KEY, t], { timeout: 6000 }); await s.page.waitForTimeout(500); }
      d = await garde(s.page);
      const emp = await s.page.evaluate(() => { const n = e => e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; const $ = x => document.querySelector(x); return { titre: n($('.emporte>h2')), lbl: n($('.emporte .mirror .lbl')), q: n($('.emporte .mirror .q')), l: n($('.emporte .mirror .l')), mots: ($('.emporte .em-texte') || {}).textContent, suite: [...document.querySelectorAll('.emporte .em-suite .btn')].map(n), champ: $('#draft').value }; });
      ok(d.depots.length === 5 && d.depots.every(x => x.question && x.lumiere) && emp.champ === '' && !/dépôts? offerts?|3 dépôts|utilisés/.test(await texte(s.page, 'main')), P('7. écrire reste gratuit et sans limite : 5 dépôts de suite reçoivent chacun leur question'));
      ok(emp.titre === 'Ce que vous emportez' && emp.lbl === 'Une question pour y voir clair' && emp.q === d.depots[4].question && emp.l && emp.mots === AUTRES[3] && emp.suite.join('|') === 'J’aimerais le dire à quelqu’un|J’ai fini pour aujourd’hui', P('7. « Ce que vous emportez » : une question écrite à l’avance, une lumière, les mots du parent tels quels, puis les 2 suites ' + JSON.stringify([emp.lbl, emp.suite])));
      ok(!VENTE.test(await texte(s.page, 'main')) && !(await s.page.$('.sheet')) && !(await s.page.$('main.deposer .vers-relais')), P('7. après 5 dépôts, « Déposer » ne propose toujours rien à acheter'));
      // champ vide et « J'aimerais le dire à quelqu'un » : le bouton prépare les derniers mots déposés, sans message d'erreur
      await clic(s.page, 'main.deposer ' + A('ddire'), 600);
      ok(!!(await s.page.$('main.dire')) && (await brut(s.page, '.dire-c .em-texte')) === AUTRES[3] && !(await s.page.$('#err-draft')), P('7. champ vide, « J’aimerais le dire à quelqu’un » reprend les derniers mots déposés'));
      await s.page.goBack(); await s.page.waitForSelector('main.deposer #draft', { timeout: 5000 }).catch(() => { }); await s.page.waitForTimeout(300);
      // « Mes dépôts » : la préparation commencée se retrouve
      await clic(s.page, 'main.deposer ' + A('go', '[data-view="depots"]'), 500);
      const liste = await s.page.$$eval('main [data-act="dire"][data-k="ouvre"]', L => L.map(b => b.textContent.trim()));
      ok(liste.length === 5 && liste.filter(x => x === 'Reprendre ce que j’aimerais dire').length === 1 && liste.filter(x => x === 'J’aimerais le dire à quelqu’un').length === 4, P('7. dans « Mes dépôts », chaque dépôt peut être préparé pour quelqu’un, et une préparation commencée se reprend ' + JSON.stringify(liste)));
      await s.page.goBack(); await s.page.waitForSelector('main.deposer #draft', { timeout: 5000 }).catch(() => { }); await s.page.waitForTimeout(300);
      // finir : retour à l'accueil, les mots restent sur l'appareil
      await clic(s.page, '.emporte ' + A('dfin'), 900);
      const fin = await s.page.evaluate(() => ({ accueil: !!document.querySelector('main.intro .seuil'), toast: (document.querySelector('.toast') || {}).textContent || '' }));
      ok(fin.accueil && /Vos mots sont gardés sur cet appareil/.test(fin.toast) && (await garde(s.page)).depots.length === 5, P('7. « J’ai fini pour aujourd’hui » ramène à l’accueil, et dit que les mots restent sur l’appareil ' + JSON.stringify(fin)));

      // ---- un texte de détresse : l'aide d'abord, et elle reste visible si le parent veut le dire à quelqu'un ----
      await clic(s.page, '.seuil ' + A('porte', '[data-v="deposer"]'), 500); await s.page.waitForSelector('main.deposer #draft');
      await s.page.fill('#draft', 'Je n’ai plus envie de vivre comme ça.'); await clic(s.page, 'main.deposer ' + A('ddire'), 900);
      const aide = await s.page.evaluate(() => ({ dire: !!document.querySelector('main.dire'), tels: [...document.querySelectorAll('.emporte .mirror a.tel')].map(a => a.getAttribute('href')), pistes: document.querySelectorAll('.emporte .pistes-depot').length }));
      ok(!aide.dire && aide.tels.includes('tel:143') && aide.tels.includes('tel:144') && aide.pistes === 0, P('7. un texte de détresse : l’écran reste sur l’aide, avec le 143 et le 144, sans ouvrir la suite de lui-même'));
      await clic(s.page, '.emporte ' + A('dire', '[data-k="ouvre"]'), 600);
      const aide2 = await s.page.evaluate(() => ({ tels: [...document.querySelectorAll('main.dire .dire-aide a.tel')].map(a => a.getAttribute('href')), amorce: (document.getElementById('amorce') || {}).value }));
      ok(aide2.tels.includes('tel:143') && aide2.tels.includes('tel:144') && aide2.amorce === 'J’ai besoin de te parler de quelque chose qui me pèse.', P('7. si ce parent veut le dire à quelqu’un, l’aide reste affichée et la première phrase parle de ce qui pèse'));
      ok(s.errs.length === 0, P('7. aucune erreur ' + s.errs.slice(0, 3).join(' | ')));
      await s.ctx.close();

      // ---- l'outil réutilisable : dans « Passer le relais », les mots déposés sont proposés phrase par phrase, jamais coupés ----
      const LONG = 'Cette phrase est beaucoup trop longue pour tenir dans une observation de réunion, parce que ce parent a écrit d’une seule traite tout ce qu’il avait sur le cœur, sans jamais mettre de point, en ajoutant détail après détail jusqu’à dépasser largement la longueur prévue.';
      const o = await ouvre(fmt, { notes: Object.assign(PARENT(), { achats: { relais: { le: iso(0) } }, depots: [
        { id: 'dz', date: iso(-1), time: '20:10', text: 'Je n’ai plus envie de vivre comme ça.', mode: 'listen', risk: true },
        { id: 'da', date: iso(0), time: '21:05', text: 'Mon fils a 35 ans. Ce week-end, il a dit « non ! » trois fois et il n’a presque pas dormi. ' + LONG, mode: 'listen', question: 'q', lumiere: 'l' }] }) });
      await o.page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await o.page.waitForSelector('.v-relais ' + R('reunion')); await clic(o.page, R('reunion'), 400); await clic(o.page, R('rpas', '[data-v="1"]'), 400);
      const prop = await o.page.$$eval('.rl-obs .rl-m', L => L.map(b => ({ t: b.querySelector('span').innerText.replace(/\s+/g, ' ').trim(), d: b.querySelector('small').innerText.replace(/\s+/g, ' ').trim() })));
      ok(prop.length === 2 && prop[0].t === 'Mon fils a 35 ans.' && prop[1].t === 'Ce week-end, il a dit « non ! » trois fois et il n’a presque pas dormi.' && prop.every(x => /^Vos mots du /.test(x.d)), P('7. pour préparer une réunion, les mots déposés sont proposés phrase par phrase, sans couper une phrase ni reprendre un texte de détresse ' + JSON.stringify(prop)));
      ok(o.errs.length === 0, P('7. aucune erreur dans l’outil ' + o.errs.slice(0, 3).join(' | ')));
      await o.ctx.close();
      // sans fiche, sans journal et sans dépôt : la réunion se prépare quand même, et l'écran le dit
      const v = await ouvre(fmt, { notes: Object.assign(PARENT(), { achats: { relais: { le: iso(0) } } }) });
      await v.page.goto(APP + 'relais/', { waitUntil: 'domcontentloaded' }); await v.page.waitForSelector('.v-relais ' + R('reunion')); await clic(v.page, R('reunion'), 400); await clic(v.page, R('rpas', '[data-v="1"]'), 400);
      ok(/Vous n’avez encore rien écrit dans vos fiches ni dans votre journal/.test(await texte(v.page, 'main')) && !!(await v.page.$('#rl-ro')), P('7. sans rien d’écrit, la réunion se prépare quand même : le parent note son observation'));
      await v.ctx.close();
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
