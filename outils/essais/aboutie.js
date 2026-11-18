// La version d'essai « aboutie » : ce qu'un futur client vit, de la découverte au choix d'une formule.
//   1. Les formules : à côté de chaque prix, ce que le parent peut faire ou recevoir. Sur téléphone, le prix, le bénéfice et le bouton se lisent ensemble.
//   2. L'aperçu du parcours, depuis la fiche « La crise » : la vague, un geste, le carnet, la semaine suivante. Le prix n'arrive qu'à la fin.
//   3. L'aperçu « Avec Antonio » : une question d'exemple, l'emplacement de sa réponse (jamais une réponse inventée), ce qui est partagé et ce qui reste privé.
//   4. La commande en démonstration : paiement accepté, refusé, abandonné, puis l'arrêt de la formule. Rien n'est débité, et l'écran le dit.
//   5. Le SOS, la respiration et « Déposer » ne proposent rien à acheter, même après les 3 dépôts offerts.
//   6. Les 3 repères de la vente restent sur l'appareil, sans aucun écrit, et rien ne quitte le site.
// usage : node aboutie.js      Variables : PEPE_ORIGIN, PEPE_BASE, PEPE_KEY, PEPE_NAV, PEPE_CHROME.
const pw = require('playwright');
const NAV = process.env.PEPE_NAV || 'chromium';
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8445';
const BASE = process.env.PEPE_BASE || '/';
const APP = ORIGIN + BASE;
const KEY = process.env.PEPE_KEY || 'pepe-v1';
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
let n = 0, ko = 0; const notesFin = [];
const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC : ' + m); } };
const net = s => (s || '').split(String.fromCharCode(160)).join(' ').replace(/\s+/g, ' ').trim();
const horloge = ([h]) => { const D0 = Date; const base = new D0(); base.setHours(Math.floor(h), Math.round((h % 1) * 60), 0, 0); const dec = base.getTime() - D0.now();
  class D extends D0 { constructor(...x) { if (x.length) super(...x); else super(D0.now() + dec); } static now() { return D0.now() + dec; } } window.Date = D; };
const TEL = { viewport: { width: 390, height: 664 }, hasTouch: true, deviceScaleFactor: 2 }, ORDI = { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 };
const DEMO = 'aucun montant réel n’est débité';
const VENTE = /CHF|formule|abonn|payer|paiement|prix/i;

(async () => {
  const LOCAL = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
  const exe = NAV === 'chromium' ? (process.env.PEPE_CHROME || (require('fs').existsSync(LOCAL) ? LOCAL : undefined)) : undefined;
  const lance = { chromium: { args: ['--ignore-certificate-errors'] }, firefox: {}, webkit: {} }[NAV];
  const browser = await pw[NAV].launch(Object.assign({}, lance, exe ? { executablePath: exe } : {}));
  const ouvre = async (fmt) => {
    const f = Object.assign({}, fmt); if (NAV === 'chromium' && f.hasTouch) f.isMobile = true;
    const ctx = await browser.newContext(Object.assign({ locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' }, f));
    await ctx.addInitScript(horloge, [21 + 40 / 60]);
    const errs = [], dehors = [];
    const page = await ctx.newPage();
    page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errs.push(m.text().slice(0, 200)); });
    page.on('request', r => { const u = r.url(); if (!u.startsWith(ORIGIN) && !/^(data|blob|about):/.test(u)) dehors.push(u.slice(0, 120)); });
    return { ctx, page, errs, dehors };
  };
  const garde = page => page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return 'illisible'; } }, KEY);
  const h1 = page => page.$eval('main h1', e => e.textContent).then(net).catch(() => '');
  const texte = (page, sel = 'main') => page.$eval(sel, e => e.innerText).then(net).catch(() => '');
  const mots = t => t.split(/\s+/).filter(Boolean).length;

  for (const [nom, fmt] of [['téléphone', TEL], ['ordinateur', ORDI]]) {
    const P = m => NAV + ' · ' + nom + ' · ' + m;
    const tel = nom === 'téléphone';

    // =====================================================================================================================
    // 1. Les formules, pour un visiteur qui arrive par leur adresse.
    // =====================================================================================================================
    {
      const { ctx, page, errs, dehors } = await ouvre(fmt);
      await page.goto(APP + '#formules', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.formules .formule'); await page.waitForTimeout(400);
      ok((await h1(page)) === 'Les formules' && !!(await page.$('main.v-feuille .feuille')), P('1. l’adresse des formules ouvre la page, sur la feuille claire'));
      const F = await page.$$eval('.formule', L => L.map(f => { const r = x => { const e = f.querySelector(x); return e ? e.getBoundingClientRect() : null; }; const t = x => { const e = f.querySelector(x); return e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; };
        const haut = r('.f-haut'), bout = r('.btn');
        return { nom: t('h2'), prix: t('.f-prix'), benef: t('.f-benef'), bouton: t('.btn'), ensemble: Math.round(bout.bottom - haut.top), concret: [...f.querySelectorAll('.f-concret li')].map(li => li.innerText.replace(/\s+/g, ' ').trim()), note: t('.f-note'), hBouton: Math.round(bout.height), lien: t('.lien-f') }; }));
      ok(F.length === 3 && F.map(f => f.nom).join() === 'Découverte,Le parcours,Avec Antonio', P('1. les 3 formules sont là, dans l’ordre : ' + F.map(f => f.nom).join(', ')));
      ok(F[0].prix === '0 CHF sans limite de durée' && F[1].prix === '14 CHF par mois' && F[2].prix === '49 CHF par mois', P('1. les prix prévus en Suisse : ' + F.map(f => f.prix).join(' | ')));
      ok(F[0].benef === 'Recevoir une aide tout de suite.' && F[1].benef === 'Avancer d’une semaine à l’autre.' && F[2].benef === 'Être accompagné par écrit, personnellement, par Antonio.', P('1. chaque formule dit en une phrase ce qu’elle apporte ' + JSON.stringify(F.map(f => f.benef))));
      ok(F.every(f => f.concret.length >= 4 && f.concret.every(c => /^Vous |^Chaque |^À chaque |^2 fois |^Antonio /.test(c))), P('1. à côté de chaque prix, « Concrètement » : ce que le parent peut faire ou recevoir, en phrases simples (' + F.map(f => f.concret.length).join(', ') + ' lignes)'));
      const vh = fmt.viewport.height;
      if (tel) ok(F.every(f => f.ensemble <= vh - 150 && f.hBouton >= 44), P('1. sur téléphone, le nom, le prix, le bénéfice et le bouton tiennent ensemble à l’écran (hauteurs ' + F.map(f => f.ensemble).join(', ') + ' px pour un écran de ' + vh + ' px)'));
      else { const cols = await page.$$eval('.formule', L => L.map(f => Math.round(f.getBoundingClientRect().left))); ok(new Set(cols).size === 3 && cols[0] < cols[1] && cols[1] < cols[2], P('1. sur ordinateur, les 3 formules se lisent côte à côte ' + JSON.stringify(cols))); }
      ok(F[0].bouton === 'Commencer gratuitement' && F[1].bouton === 'Choisir Le parcours' && F[2].bouton === 'Choisir Avec Antonio', P('1. chaque bouton dit ce qu’il fait ' + JSON.stringify(F.map(f => f.bouton))));
      ok(F[1].lien === 'Essayer une étape, en 3 minutes' && F[2].lien === 'Voir à quoi ressemble un échange', P('1. on peut essayer avant de choisir ' + JSON.stringify([F[1].lien, F[2].lien])));
      const regles = await texte(page, '.f-regles');
      ok(/sans limite de durée/.test(regles) && /14 CHF par mois/.test(regles) && /49 CHF par mois/.test(regles) && /sans engagement/.test(regles) && /arrêter à tout moment/.test(regles) && /environ 6 mois/.test(regles) && /restent sur votre appareil/.test(regles), P('1. la durée, le paiement et l’arrêt sont dits avec ce qui est décidé'));
      ok(/seront écrits ici et dans les conditions générales avant l’ouverture de la vente/.test(regles), P('1. ce qui n’est pas encore décidé est annoncé comme tel, sans rien promettre'));
      const tout = await texte(page);
      ok(tout.toLowerCase().includes(DEMO) && /démonstration de commande/.test(tout), P('1. la page dit clairement qu’aucun montant réel n’est débité'));
      const prev = (await page.$$eval('a.prevenir', L => L.map(a => [a.innerText, decodeURIComponent(a.getAttribute('href'))]))).map(x => [net(x[0]), net(x[1])]);
      ok(prev.length === 2 && prev[0][0] === 'Me prévenir pour Le parcours, 14 CHF par mois' && /^mailto:bonjour@parent-ecoute\.ch\?subject=Me prévenir à l’ouverture de la formule Le parcours&body=Bonjour,/.test(prev[0][1]) && /« Le parcours » ouvrira, à 14 CHF par mois/.test(prev[0][1]) && /Avec Antonio.*49 CHF par mois/.test(prev[1][1]), P('1. « Me prévenir » : un message tout prêt, que le parent envoie lui-même, avec la formule et son prix ' + JSON.stringify(prev.map(p => p[0]))));
      await page.click('.f-detail summary'); await page.waitForTimeout(150);
      ok((await page.$$('.f-detail .cmp tbody tr')).length >= 8, P('1. le tableau de comparaison reste disponible, replié par défaut'));
      const c0 = await page.evaluate(() => { const f = document.querySelector('.feuille'), cs = getComputedStyle(f), b = getComputedStyle(document.body); return [cs.backgroundColor, cs.color, b.backgroundColor, getComputedStyle(document.querySelector('.formule .btn.primary')).backgroundColor]; });
      ok(c0[0] === 'rgb(247, 242, 225)' && c0[1] === 'rgb(17, 48, 28)' && c0[2] === 'rgb(7, 36, 15)' && c0[3] === 'rgb(15, 51, 28)', P('1. la feuille est claire et chaude, l’encre et le bouton principal sont du vert profond de l’espace, et le fond de l’étang reste autour ' + JSON.stringify(c0)));
      ok(errs.length === 0 && dehors.length === 0, P('1. aucune erreur, et rien ne quitte le site ' + errs.concat(dehors).slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 2. L'aperçu du parcours, depuis la fiche « La crise ». Puis la commande en démonstration.
    // =====================================================================================================================
    {
      const { ctx, page, errs, dehors } = await ouvre(fmt);
      await page.goto(APP + 'fiches/la-crise/', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('main.fiche'); await page.waitForTimeout(500);
      const carte = await page.$eval('.vers-apercu', e => e.innerText.replace(/\s+/g, ' ').trim()).catch(() => '');
      ok(/Et vous, quand la vague monte \?/.test(carte) && /en 3 minutes/.test(carte) && !VENTE.test(carte), P('2. au bas de la fiche « La crise », une invitation à essayer une étape, sans un mot de prix : ' + carte.slice(0, 90)));
      ok(!/CHF/.test(await texte(page)), P('2. la fiche elle-même ne parle pas d’argent'));
      const t0 = Date.now(); const lus = [];
      await page.click('.vers-apercu ' + A('apercu')); await page.waitForSelector('main.v-apercu.ap-0'); await page.waitForTimeout(300);
      const e0 = await texte(page);
      ok((await h1(page)) === 'Me calmer, puis lâcher prise' && /Une émotion forte monte comme une vague/.test(e0) && !!(await page.$('.feuille .card.sch svg')) && !/CHF/.test(e0), P('2. premier temps, la vague : l’idée de l’étape 7 et son schéma, sans prix'));
      const fil = await page.$$eval('.ap-fil li', L => L.map(l => l.innerText.replace(/\s+/g, ' ').trim()));
      ok(fil.join(' | ') === '1 La vague | 2 Mon geste | 3 Mon carnet | 4 La semaine prochaine', P('2. les 4 temps de l’aperçu sont annoncés : ' + fil.join(', ')));
      // le schéma se déroule
      let pas = 0; while (await page.$('.feuille ' + A('schnext')) && pas < 8) { await page.click('.feuille ' + A('schnext')); await page.waitForTimeout(80); pas++; }
      ok(pas === 4 && /Revoir depuis le début/.test(await texte(page, '.sch-nav')), P('2. le schéma de la vague se déroule en 5 repères (' + (pas + 1) + ')'));
      lus.push(await texte(page));   // les mots du premier temps, une fois le schéma déroulé
      const sch = await page.$eval('.feuille .card.sch', e => getComputedStyle(e).backgroundColor);
      ok(sch === 'rgb(15, 51, 28)', P('2. le schéma garde son fond vert profond, comme une image de l’étang dans la page (' + sch + ')'));
      await page.click(A('ap', '[data-k="1"]')); await page.waitForSelector('main.v-apercu.ap-1'); await page.waitForTimeout(250);
      const e1 = await texte(page); lus.push(e1);
      ok(/Ce que j’ai vécu/.test(e1) && /marcher en forêt/.test(e1) && !/CHF/.test(e1), P('2. deuxième temps : ce qui calme Antonio, avec ses mots à lui, puis le choix du parent'));
      const gestes = await page.$$eval('.ap-g', L => L.map(g => g.innerText.trim()));
      ok(gestes.join(' | ') === 'Expirer lentement | Sortir un instant | Marcher 5 minutes | Poser les mains à plat | Dire une phrase apprise par cœur', P('2. 5 gestes à choisir, ceux de l’exercice de l’étape : ' + gestes.join(', ')));
      await page.click(A('ap-garde')); await page.waitForTimeout(300);
      ok(!!(await page.$('main.v-apercu.ap-1')) && /Choisissez un geste/.test(await texte(page, '.toast')), P('2. sans geste choisi, l’aperçu le demande simplement'));
      await page.fill('#ap-mot', 'Je sors sur le balcon et je compte jusqu’à 10.'); await page.click('.ap-g[data-v="sortir"]'); await page.waitForTimeout(200);
      ok((await page.$eval('.ap-g[data-v="sortir"]', e => e.getAttribute('aria-pressed'))) === 'true' && (await page.inputValue('#ap-mot')) === 'Je sors sur le balcon et je compte jusqu’à 10.', P('2. le geste est choisi, et les mots déjà écrits ne sont pas perdus'));
      await page.click(A('ap-garde')); await page.waitForSelector('main.v-apercu.ap-2'); await page.waitForTimeout(250);
      const e2 = await texte(page); lus.push(e2);
      const g2 = await garde(page);
      ok(/C’est gardé dans votre carnet/.test(e2) && /Sortir un instant\. Je sors sur le balcon et je compte jusqu’à 10\./.test(e2) && !/CHF/.test(e2), P('2. troisième temps : la page du carnet montre le geste choisi, avec les mots du parent'));
      ok(g2 && g2.onboarded === true && g2.notes && g2.notes.reguler && g2.notes.reguler.t === 'Sortir un instant. Je sors sur le balcon et je compte jusqu’à 10.' && g2.tier === 'free', P('2. le geste est gardé sur l’appareil, dans le carnet de l’étape 7, et la formule reste Découverte'));
      await page.click(A('go', '[data-view="carnet"]')); await page.waitForTimeout(400);
      ok((await h1(page)) === 'Mon carnet de route' && /Sortir un instant/.test(await texte(page)), P('2. « Ouvrir mon carnet » : le geste est bien dans « Mon carnet de route »'));
      await page.goBack(); await page.waitForSelector('main.v-apercu.ap-2'); await page.waitForTimeout(300);
      await page.click(A('ap', '[data-k="3"]')); await page.waitForSelector('main.v-apercu.ap-3'); await page.waitForTimeout(250);
      const e3 = await texte(page); lus.push(e3);
      ok(/Ce que vous retrouvez la semaine prochaine/.test(e3) && /Votre geste, dans votre carnet/.test(e3) && /Mes appuis pour tenir/.test(e3) && /rien ne s’accumule/.test(e3), P('2. quatrième temps : ce que la semaine suivante apporte (le carnet, l’étape « Mes appuis pour tenir », la même forme chaque semaine)'));
      const offre = await page.$eval('.offre', e => { const r = x => e.querySelector(x).getBoundingClientRect(); return { t: e.innerText.replace(/\s+/g, ' ').trim(), ensemble: Math.round(r('.btn').bottom - r('.f-haut').top) }; });
      ok(/Le parcours 14 CHF par mois Avancer d’une semaine à l’autre\. Choisir Le parcours/.test(offre.t) && offre.t.toLowerCase().includes(DEMO) && offre.ensemble < 260, P('2. l’offre arrive seulement ici, clairement : Le parcours, 14 CHF par mois, son bénéfice et son bouton ensemble (' + offre.ensemble + ' px)'));
      ok(!!(await page.$(A('entrer', '[data-v="parcours"]'))) && /Continuer gratuitement avec l’étape 1/.test(e3), P('2. le parent peut aussi continuer gratuitement'));
      const total = lus.reduce((s, t) => s + mots(t), 0);
      ok(total <= 600 && lus.slice(0, 3).reduce((s, t) => s + mots(t), 0) <= 480, P('2. l’aperçu se lit en 3 minutes environ (' + total + ' mots sur les 4 écrans, soit ' + (total / 200).toFixed(1) + ' minutes à 200 mots par minute)'));
      notesFin.push(nom + ' : aperçu du parcours, ' + total + ' mots à lire sur 4 écrans (' + lus.map(mots).join(', ') + '), parcourus par l’essai en ' + ((Date.now() - t0) / 1000).toFixed(0) + ' secondes.');
      ok(((await garde(page)).com || {}).ap, P('2. repère gardé sur l’appareil : aperçu terminé'));
      // la flèche du navigateur revient d'un temps en arrière
      await page.goBack(); await page.waitForTimeout(500); ok(!!(await page.$('main.v-apercu.ap-2')), P('2. la flèche du navigateur revient au temps précédent de l’aperçu'));
      await page.goForward(); await page.waitForSelector('main.v-apercu.ap-3'); await page.waitForTimeout(300);

      // ===================================================================================================================
      // 4. La commande, en démonstration : refusé, abandonné, accepté. Puis l'arrêt.
      // ===================================================================================================================
      await page.click('.offre ' + A('commande')); await page.waitForSelector('main.commande.cde-recap'); await page.waitForTimeout(250);
      const c1 = await texte(page);
      ok(/Votre commande/.test(c1) && /Le parcours 14 CHF par mois/.test(c1) && /Ceci est une démonstration\. Aucun montant réel n’est débité, et aucune carte n’est demandée\./.test(c1), P('4. la commande : la formule, son prix, et l’avertissement « Aucun montant réel n’est débité »'));
      ok((await page.$$('main.commande input, main.commande form')).length === 0, P('4. aucun champ de carte ni de formulaire : rien à saisir'));
      ok(((await garde(page)).com || {}).ch && (await garde(page)).com.ch.f === 'parcours' && (await garde(page)).tier === 'free', P('4. repère : formule choisie. La formule, elle, ne change pas tant que rien n’est confirmé'));
      await page.click(A('cmd', '[data-v="refus"]')); await page.waitForSelector('main.commande.cde-refus'); await page.waitForTimeout(200);
      const c2 = await texte(page);
      ok(/Le paiement n’a pas abouti\./.test(c2) && /Rien n’a été débité, et votre formule n’a pas changé\./.test(c2) && (await garde(page)).tier === 'free', P('4. paiement refusé : c’est dit simplement, rien n’est débité et la formule ne change pas'));
      await page.click(A('cmd', '[data-v="recap"]')); await page.waitForSelector('main.commande.cde-recap');
      await page.click(A('cmd', '[data-v="abandon"]')); await page.waitForSelector('main.commande.cde-abandon'); await page.waitForTimeout(200);
      ok(/Vous avez arrêté avant de payer\./.test(await texte(page)) && (await garde(page)).tier === 'free', P('4. commande abandonnée : rien n’est débité et la formule ne change pas'));
      await page.click(A('cmd', '[data-v="recap"]')); await page.waitForSelector('main.commande.cde-recap');
      await page.click(A('cmd', '[data-v="ok"]')); await page.waitForSelector('main.commande.cde-ok'); await page.waitForTimeout(250);
      const c3 = await texte(page); const g3 = await garde(page);
      ok(/C’est confirmé\./.test(c3) && /Votre formule est maintenant Le parcours\./.test(c3) && /Aucun montant réel n’est débité/.test(c3) && g3.tier === 'parcours' && g3.com.ac && g3.com.ac.f === 'parcours' && g3.com.ac.demo === true, P('4. paiement accepté : la formule devient Le parcours, et l’écran redit que c’est une démonstration'));
      await page.click(A('go', '[data-view="parcours"]')); await page.waitForTimeout(500);
      const pc = await page.evaluate(() => ({ h: document.querySelector('main h1').textContent, verrou: !!document.querySelector('.lockline'), ouvertes: document.querySelectorAll('.months .step:not(.locked)').length }));
      ok(pc.h === 'Le parcours' && !pc.verrou && pc.ouvertes >= 1, P('4. « Ouvrir mon parcours » mène au bon contenu : le parcours, sans cadenas de formule ' + JSON.stringify(pc)));
      await page.goBack(); await page.waitForTimeout(500);
      ok(!!(await page.$('main.commande.cde-ok')) || !(await page.$('main.commande.cde-recap')), P('4. la flèche du navigateur ne ramène pas devant le paiement'));
      // les repères, dans « Moi »
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.tabs'); await page.click('.tabs ' + A('go', '[data-view="me"]')); await page.waitForSelector('main.moi'); await page.waitForTimeout(300);
      const rep = await texte(page, '.reperes');
      if (rep) ok(/Aperçu du parcours terminé le /.test(rep) && /Formule choisie Le parcours, le /.test(rep) && /Achat confirmé Le parcours, en démonstration, le /.test(rep) && /ne contiennent ni vos écrits, ni vos humeurs, ni votre situation/.test(rep), P('6. dans « Moi », les 3 repères de la vente gardés sur cet appareil : ' + rep.slice(0, 150)));
      else notesFin.push(nom + ' : la carte « Version d’essai » n’existe que dans la version d’essai, les repères n’y sont donc pas affichés ici.');
      const com = (await garde(page)).com; const brut = JSON.stringify(com);
      ok(Object.keys(com).sort().join() === 'ac,ap,ch' && !/balcon|Sortir|geste/i.test(brut) && brut.length < 160, P('6. les repères ne contiennent aucun écrit du parent : ' + brut));
      // l'arrêt de la formule
      await page.click(A('go', '[data-view="plans"]')); await page.waitForSelector('.formules'); await page.waitForTimeout(250);
      ok((await page.$eval('.formule.f-parcours .btn', e => e.innerText.trim())) === 'Votre formule', P('4. la page des formules montre « Votre formule » sur Le parcours'));
      await page.click('.f-arret ' + A('arret')); await page.waitForSelector('main.commande.cde-arret'); await page.waitForTimeout(200);
      const a1 = await texte(page);
      ok(/Arrêter ma formule/.test(a1) && /Vous quittez Le parcours et vous revenez à Découverte\./.test(a1) && /restent sur votre appareil/.test(a1) && /Les étapes 2 à 24 se referment/.test(a1), P('4. arrêter : l’écran dit ce qui reste et ce qui se referme'));
      await page.click(A('arret-ok')); await page.waitForSelector('.formules'); await page.waitForTimeout(300);
      const g4 = await garde(page);
      ok(g4.tier === 'free' && g4.notes.reguler.t.startsWith('Sortir un instant') && /Vous êtes revenu à Découverte/.test(await texte(page, '.toast')), P('4. arrêt confirmé : retour à Découverte, et le carnet est toujours là'));
      ok(errs.length === 0 && dehors.length === 0, P('2 et 4. aucune erreur, et rien ne quitte le site ' + errs.concat(dehors).slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 3. L'aperçu « Avec Antonio ».
    // =====================================================================================================================
    {
      const { ctx, page, errs, dehors } = await ouvre(fmt);
      await page.goto(APP + '#avec-antonio', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('main.avec-a'); await page.waitForTimeout(400);
      const t = await texte(page);
      ok((await h1(page)) === 'À quoi ressemble un échange avec Antonio', P('3. l’adresse de l’aperçu « Avec Antonio » ouvre la page'));
      const q = await texte(page, '.lettre-q');
      ok(/^Exemple La question d’un parent Mon fils a 24 ans\./.test(q) && /il vit dans un foyer/.test(q) && /place de père/.test(q) && /Ce n’est pas le message d’un vrai parent\./.test(q), P('3. une question réaliste, celle d’un père dont le fils adulte vit en foyer, clairement marquée comme un exemple'));
      const rep = await page.evaluate(() => ({ place: !!document.querySelector('.place-a'), ecrite: !!document.querySelector('.mots-grand'), t: (document.querySelector('.place-a') || document.querySelector('.mots-grand')).innerText.replace(/\s+/g, ' ').trim() }));
      ok(rep.place !== rep.ecrite, P('3. la réponse d’Antonio est soit la sienne, soit un emplacement vide, jamais les 2'));
      if (rep.place) ok(/La réponse d’Antonio bientôt ici/.test(rep.t) && /Une réponse inventée ne vous dirait rien de vrai sur lui\./.test(rep.t), P('3. tant qu’Antonio n’a pas écrit sa réponse, l’emplacement reste vide et le dit : aucune réponse n’est inventée'));
      else notesFin.push(nom + ' : la réponse d’Antonio est en place (' + mots(rep.t) + ' mots).');
      const voix = await page.evaluate(() => ({ place: !!document.querySelector('.place-voix'), bouton: !!document.querySelector('.avec-voix .son-b'), t: (document.querySelector('.place-voix') || document.querySelector('.avec-voix')).innerText.replace(/\s+/g, ' ').trim() }));
      ok(voix.place !== voix.bouton && /30 secondes/.test(voix.t), P('3. sa voix, 30 secondes : un bouton quand l’enregistrement existe, sinon un emplacement qui l’annonce (' + (voix.bouton ? 'bouton' : 'emplacement') + ')'));
      const lu = (await page.$$eval('.pa-col.lu li', L => L.map(l => l.innerText))).map(net), chez = (await page.$$eval('.pa-col.chez li', L => L.map(l => l.innerText))).map(net);
      ok(lu.length === 2 && /Votre question, quand vous choisissez de l’envoyer\./.test(lu[0]) && /cochez « Partager avec Antonio »/.test(lu[1]) && chez.length === 4 && chez.join(' ').includes('Vos humeurs') && chez.join(' ').includes('Votre carnet de route'), P('3. ce qu’Antonio lit (' + lu.length + ' choses, choisies par le parent) et ce qui reste sur l’appareil (' + chez.length + ' choses)'));
      ok(/rien n’est transmis à Antonio/.test(t) && /ne pose pas de diagnostic/.test(t) && /SOS/.test(t), P('3. la page dit ce qu’Antonio ne fait pas, et que rien ne lui est transmis dans la version d’essai'));
      const offre = await page.$eval('.offre', e => { const r = x => e.querySelector(x).getBoundingClientRect(); return { t: e.innerText.replace(/\s+/g, ' ').trim(), ensemble: Math.round(r('.btn').bottom - r('.f-haut').top) }; });
      ok(/Avec Antonio 49 CHF par mois Être accompagné par écrit, personnellement, par Antonio\. Choisir Avec Antonio/.test(offre.t) && offre.ensemble < 280, P('3. l’offre : Avec Antonio, 49 CHF par mois, son bénéfice et son bouton ensemble (' + offre.ensemble + ' px)'));
      await page.click('.offre ' + A('commande')); await page.waitForSelector('main.commande.cde-recap'); await page.click(A('cmd', '[data-v="ok"]')); await page.waitForSelector('main.commande.cde-ok'); await page.waitForTimeout(200);
      ok((await garde(page)).tier === 'antonio' && /Vos échanges avec Antonio sont ouverts, en démonstration\./.test(await texte(page)), P('4. commande acceptée pour « Avec Antonio » : la formule change, en démonstration'));
      await page.click(A('go', '[data-view="antonio"]')); await page.waitForTimeout(500);
      const an = await texte(page);
      ok((await h1(page)) === 'Mes échanges avec Antonio' && /rien n’est transmis à Antonio/.test(an) && /Antonio lit seulement ce que vous cochez et les questions que vous lui envoyez\./.test(an), P('4. le bon contenu s’ouvre : « Mes échanges avec Antonio », qui redit ce qu’Antonio lit'));
      ok(errs.length === 0 && dehors.length === 0, P('3. aucune erreur, et rien ne quitte le site ' + errs.concat(dehors).slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 5. Le SOS, la respiration et « Déposer » : rien à acheter, même après les 3 dépôts offerts.
    // =====================================================================================================================
    {
      const { ctx, page, errs, dehors } = await ouvre(fmt);
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.herofull .porte'); await page.waitForTimeout(300);
      const sansVente = async quoi => { const t = await texte(page, '#app'); const boutons = await page.$$(A('commande') + ',' + A('upgrade') + ',.lockline,a.prevenir,.offre'); ok(!/CHF|abonn|Le parcours, |payer|paiement/i.test(t) && boutons.length === 0, P('5. ' + quoi + ' : aucun prix, aucune formule à choisir' + (boutons.length ? ' (' + boutons.length + ' élément de vente)' : ''))); };
      await page.click('.herofull .sos'); await page.waitForTimeout(400); await sansVente('le SOS');
      await page.goBack(); await page.waitForSelector('.herofull .porte'); await page.waitForTimeout(300);
      await page.click('.herofull ' + A('porte', '[data-v="souffle"]')); await page.waitForSelector('main.souffle.s-cours'); await page.waitForTimeout(600); await sansVente('la respiration');
      await page.click('.resp-l'); await page.waitForSelector('.resp-choix'); await sansVente('le choix de la respiration');
      await page.click(A('resp-ferme')); await page.click(A('souffle-stop')); await page.waitForSelector('main.souffle.s-pret'); await sansVente('la respiration arrêtée');
      await page.click('.souffle .bar .back'); await page.waitForSelector('main.intro'); await page.waitForTimeout(300);
      await page.click('.herofull ' + A('porte', '[data-v="deposer"]')); await page.waitForSelector('main.deposer'); await page.waitForTimeout(300); await sansVente('« Déposer »');
      for (let i = 1; i <= 3; i++) { await page.fill('#draft', 'Dépôt numéro ' + i + ', ce soir tout déborde.'); await page.click(A('dsend')); await page.waitForTimeout(1500); }
      ok((await garde(page)).depots.length === 3, P('5. les 3 dépôts offerts sont gardés'));
      await sansVente('« Déposer », une fois les 3 dépôts offerts utilisés');
      ok(!!(await page.$('#draft')) && !!(await page.$(A('dsend'))) && /Vos 3 dépôts avec réponse sont utilisés\. Vous pouvez toujours déposer ici/.test(await texte(page)), P('5. après 3 dépôts, le parent peut toujours écrire et déposer'));
      await page.fill('#draft', 'Un quatrième soir difficile, j’ai besoin de l’écrire.'); await page.click(A('dsend')); await page.waitForTimeout(1500);
      const g = await garde(page);
      ok(g.depots.length === 4 && g.depots[3].sans === true && !(await page.$('.sheet')) && /C’est déposé\./.test(await texte(page)), P('5. le quatrième dépôt est gardé lui aussi, sans feuille de vente par-dessus'));
      await sansVente('« Déposer », après le quatrième dépôt');
      await page.fill('#draft', 'Je n’ai plus envie de vivre comme ça.'); await page.click(A('dsend')); await page.waitForTimeout(1500);
      const aide = await texte(page);
      ok(/143/.test(aide) && (await garde(page)).depots[4].risk === true, P('5. un dépôt qui dit la détresse reçoit les numéros d’aide (143)'));
      await sansVente('« Déposer », devant un message de détresse');
      ok(errs.length === 0 && dehors.length === 0, P('5. aucune erreur, et rien ne quitte le site ' + errs.concat(dehors).slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 7. La vitrine et l'espace parlent des formules avec les mêmes mots.
    // =====================================================================================================================
    {
      const { ctx, page, errs } = await ouvre(fmt);
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.acc-plans li'); await page.waitForTimeout(300);
      const V = await page.$$eval('.acc-plans li', L => L.map(l => ({ nom: l.querySelector('b').textContent.trim(), prix: l.querySelector('.prix').textContent.replace(/\s+/g, ' ').trim(), benef: l.querySelector('.acc-benef').textContent.trim() })));
      ok(V.length === 3 && V[1].prix === '14 CHF par mois' && V[2].prix === '49 CHF par mois' && V[0].benef === 'Recevoir une aide tout de suite.' && V[1].benef === 'Avancer d’une semaine à l’autre.' && V[2].benef === 'Être accompagné par écrit, personnellement, par Antonio.', P('7. la vitrine présente les 3 formules avec les mêmes prix et les mêmes phrases que la page des formules'));
      ok(!!(await page.$('.acc-parcours ' + A('apercu'))) && !!(await page.$('.acc-plans ' + A('apercu'))) && !!(await page.$('.acc-plans ' + A('avec'))), P('7. depuis la vitrine, on peut essayer une étape et voir un échange avec Antonio'));
      await page.evaluate(() => document.querySelector('.acc-parcours [data-act="apercu"]').click()); await page.waitForSelector('main.v-apercu.ap-0'); await page.waitForTimeout(300);
      ok(!!(await page.$('.bar .back')) && !!(await page.$('.bar .sos')), P('7. dans l’aperçu, un visiteur garde « Retour » et le SOS'));
      await page.click('.bar .back'); await page.waitForTimeout(600);
      ok(!!(await page.$('main.intro')), P('7. « Retour » ramène à la vitrine'));
      ok(errs.length === 0, P('7. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }
  }
  await browser.close();
  notesFin.forEach(x => console.log('  note : ' + x));
  console.log('version aboutie (' + NAV + ') : ' + n + ' vérifications, ' + ko + ' échec' + (ko > 1 ? 's' : '') + ' (' + APP + ')');
  process.exit(ko ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
