// La page d'accueil en chapitres : son contenu vient de l'espace, la dose est celle du jour, le schéma se déroule, le bouton flottant apparaît et s'efface.
const { chromium } = require('playwright');
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8444'; const APP = ORIGIN + (process.env.PEPE_BASE || '/');
let n = 0, ko = 0; const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC : ' + m); } };
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
const net = s => (s || '').split(String.fromCharCode(160)).join(' ').replace(/\s+/g, ' ').trim();
const fs = require('fs');
const SITE_DIR = process.env.PEPE_SITE_DIR || '/home/claude/infomaniak/site';
// L'application est fermée sur elle-même : on l'exécute ici avec un faux écran, et on lui fait rendre ses contenus.
const X = (() => {
  globalThis.localStorage = { getItem: () => null, setItem() { }, removeItem() { } };
  const app = { innerHTML: '', className: '', addEventListener() { }, appendChild() { }, querySelector() { return null; }, getAttribute() { return null; }, removeAttribute() { } };
  globalThis.document = { getElementById: id => id === 'app' ? app : null, querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ setAttribute() { }, remove() { } }), addEventListener() { }, activeElement: null, title: '' };
  globalThis.window = globalThis; globalThis.location = { search: '', pathname: '/', hash: '' }; globalThis.addEventListener = () => { }; globalThis.history = { replaceState() { }, pushState() { }, state: null }; globalThis.scrollTo = () => { };
  const code = fs.readFileSync(SITE_DIR + '/app.js', 'utf8'); const fin = code.lastIndexOf('})();');
  return (0, eval)(code.slice(0, fin) + ';return {PARCOURS,PERMISSIONS,WORDS,SITS,PICTOS,LOCAL_Q,TIERS,PRODUITS,curatedDose,introDoseLabel};})();');
})();
const E = []; X.PARCOURS.forEach(m => m.steps.forEach(s => E.push(s)));
// Le même calcul que dans le navigateur, mais à une autre date.
const autreJour = (dec, f) => { const D0 = Date; class D2 extends D0 { constructor(...a) { if (a.length) super(...a); else super(D0.now() + dec); } static now() { return D0.now() + dec; } } globalThis.Date = D2; try { return f(); } finally { globalThis.Date = D0; } };
(async () => {
  const b = await chromium.launch();
  const ouvre = async (opt = {}) => {
    const ctx = await b.newContext(Object.assign({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true, reducedMotion: 'reduce', locale: 'fr-CH' }, opt.ctx || {}));
    if (opt.init) await ctx.addInitScript(opt.init);
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(APP); await page.waitForTimeout(500); const c = await page.$('#consent [data-consent="no"]'); if (c) await c.click(); await page.waitForTimeout(150);
    return { ctx, page, errs };
  };
  // ---------- 1. Le contenu : rien d'inventé, tout vient des contenus de l'espace
  {
    const { ctx, page, errs } = await ouvre();
    const r = await page.evaluate(() => {
      const net = s => (s || '').split(String.fromCharCode(160)).join(' ').replace(/\s+/g, ' ').trim(); const q = s => [...document.querySelectorAll(s)]; const tx = s => q(s).map(e => net(e.textContent));
      return { sections: q('main.intro>section').map(s => s.className.split(' ').pop()), h1: q('h1').length, h2: q('main.intro h2').length, perms: tx('.acc-perms li'),
        doseT: tx('.acc-dose .dose p')[0], label: tx('.acc-dose .dose .label')[0], qT: tx('.acc-depot .mirror .q')[0], lT: tx('.acc-depot .mirror .l')[0],
        mois: q('.acc-mois details').length, etapes: tx('.acc-mois li'), nomsM: tx('.acc-mois summary b'), vecu: tx('.acc-parcours .card.vecu p.lesson'), sch: document.querySelector('.acc-parcours .card.sch').dataset.sch,
        pictos: q('.acc-pictos img').length, chips: tx('.acc-scenes .acc-chips li a'), liens: q('.acc-scenes .acc-chips li a').map(a => a.getAttribute('href')), groupes: tx('.acc-scenes h3'), outils: tx('.acc-outils .acc-h .acc-l')[0], outils2: tx('.acc-outils-l')[0], prix: tx('.acc-plans .prix'), plans: tx('.acc-plans b'), faq: q('.faq').length, cit: tx('.acc-fin blockquote p')[0] || '', portes: tx('.seuil .porte b'), h1t: tx('h1')[0], pour: tx('.seuil .pour')[0] || '', besoin: tx('.seuil .besoin-q')[0] || '', relais: tx('.acc-relais .rl-mini b')[0] || '', relaisPrix: tx('.acc-relais .prix')[0] || '', relaisQui: tx('.acc-relais .rl-mini .label')[0] || '',
        salut: q('.seuil .salut').length, fiche: tx('.fiche-b h2')[0] || '', fichePour: tx('.fiche-b .fb-tete p')[0] || '', ficheEx: tx('.fiche-b .fb-ex')[0] || '', trois: tx('.fiche-b li'), voir: tx('.fiche-b .fb-voir')[0] || '', sac: q('.nature svg.sac').length, pratique: tx('.haut-sit b')[0] || '', invite: tx('.invite-rl h2')[0] || '', inviteB: tx('.invite-rl .btn')[0] || '', inviteGeste: (document.querySelector('.invite-rl .btn') || { dataset: {} }).dataset.k || '', rassure: tx('.seuil .rassure')[0] || '',
        nom: tx('.nom-sens h2')[0] || '', sens: tx('.nom-sens .ns-l'), mot: tx('.mot-a blockquote p')[0] || '', signe: tx('.mot-a figcaption')[0] || '', ordre: q('.seuil>*').map(e => e.className.split(' ')[0]), portesD: tx('.seuil .porte .tx>span') };
    });
    r.permsOk = r.perms.every(p => X.PERMISSIONS.some(x => net(x[1]) === p)); r.dose = r.doseT === net(X.curatedDose());
    r.q = X.LOCAL_Q.some(x => net(x) === r.qT); r.l = X.WORDS.some(x => net(x) === r.lT);
    r.titres = E.map(s => net(s.t)); r.nomsMois = r.nomsM.join('|') === X.PARCOURS.map(m => net(m.m)).join('|'); r.vecu2 = E[1].vecu.slice(0, 2).map(net);
    r.sits = X.SITS.map(s => net(s.t)); r.nSits = X.SITS.length; r.nPictos = X.PICTOS.length; r.tiers = Object.values(X.TIERS).map(x => net(x.t)); r.fin4 = net(E[3].vecu);
    ok(r.sections.join(' ') === 'acc-dose acc-outils acc-depot acc-perm acc-parcours acc-relais voice acc-formules acc-faq acc-fin' && r.h1 === 1 && r.h2 === 13, 'accueil : 10 chapitres, ce qui sert tout de suite en premier, un seul grand titre (les 4 autres titres de second rang sont la question posée au parent, l’invitation au relais, la fiche posée sur la table et le nom de l’espace, avec son sens) ' + JSON.stringify([r.sections, r.h1, r.h2]));
    ok(r.h1t === 'On vous demande souvent comment va votre enfant. Ici, on commence par vous.' && r.pour === 'Pour les parents d’un enfant, d’un ado ou d’un adulte en situation de handicap' && r.besoin === 'De quoi auriez-vous besoin aujourd’hui ?' && r.salut === 0 && r.portes.length === 3 && r.portes[0] === 'Écrire ce que j’ai sur le cœur' && r.portes[1] === 'Souffler 2 minutes' && /^Trouver une idée pour /.test(r.portes[2]) && /^Vous déposez ce qui pèse, puis vous recevez une question préparée à l’avance\.$/.test(r.portesD[0]) && /^L’exercice commence tout de suite, en silence\./.test(r.portesD[1]) && /^(Ces 3 aides sont gratuites et sans compte|Version de test, gratuite et sans compte)\./.test(r.rassure), 'accueil : le public, la phrase d’Antonio, puis la question « De quoi auriez-vous besoin aujourd’hui ? » et les 3 aides, écrire d’abord et le silence juste après ' + JSON.stringify([r.h1t, r.portes]));
    // Le nom de l'espace prend son sens dès le premier écran : 2 phrases, puis le mot d'Antonio, tel qu'il l'a écrit et signé le 19 novembre 2026.
    ok(r.nom === 'Parent écouté, parent éclairé' && r.sens.length === 2 && /^Écouté\. Ici, vous avez la parole\./.test(r.sens[0]) && /à un proche ou lors d’une réunion\.$/.test(r.sens[0]) && /^Éclairé\. Vous repartez avec une question/.test(r.sens[1]), 'accueil : « Parent écouté, parent éclairé » est expliqué en 2 phrases, « Écouté » puis « Éclairé » ' + JSON.stringify([r.nom, r.sens]));
    ok(r.mot === 'Mon expérience d’éducateur social m’a guidé dans le choix des questions et des outils que vous trouverez ici. Aujourd’hui, vous avez peut-être besoin de souffler, d’écrire ce que vous gardez pour vous ou de trouver les mots pour en parler à quelqu’un. C’est vous qui choisissez.' && /^Antonio Company\s*Éducateur social, responsable d’une équipe socio-éducative$/.test(r.signe), 'accueil : le mot d’Antonio est celui qu’il a écrit, mot pour mot, avec sa signature et ses 2 rôles ' + JSON.stringify([r.mot, r.signe]));
    ok(r.ordre.filter(c => c !== 'film-cmd').join(' ') === 'haut-texte haut-table nom-sens haut-suite' && (r.ordre.indexOf('film-cmd') < 0 || r.ordre.indexOf('film-cmd') === 2), 'accueil : après les 3 aides viennent l’invitation au relais et la fiche d’exemple, puis le film, et le sens du nom ensuite ' + JSON.stringify(r.ordre));
    // La table du carnet : le sac dessiné, et la fiche d'exemple de Bastien, dont le bouton dit « en entier ». Plus bas, l'exemple est celui de Noé.
    ok(r.sac === 1 && r.fiche === 'Le relais de Bastien' && /^Pour son oncle Rémi, du samedi /.test(r.fichePour) && r.ficheEx === 'Exemple' && r.trois.length === 3 && /^Bastien a besoin de savoir/.test(r.trois[0]) && r.voir === 'Voir la fiche de Bastien en entier', 'accueil : sur la table, le sac et la fiche de Bastien, avec ses 3 repères et le bouton « Voir la fiche de Bastien en entier » ' + JSON.stringify([r.sac, r.fiche, r.voir]));
    ok(r.pratique === '' && r.invite === 'Samedi, quelqu’un prend le relais ?' && r.inviteB === 'Préparer les 3 choses à savoir' && r.inviteGeste === 'essai' && /^Le relais de Noé, /.test(r.relaisQui), 'accueil : avec la fiche, l’invitation à préparer les 3 choses à savoir, et plus bas l’exemple de Noé ' + JSON.stringify([r.invite, r.inviteB, r.inviteGeste, r.relaisQui]));
    ok(r.perms.length === 4 && r.permsOk, 'accueil : les 4 permissions sont celles de l’espace');
    ok(r.dose && /^(La dose du (lundi|mardi|mercredi|jeudi|vendredi|samedi) \d{1,2} \S+|Dose spéciale du dimanche)$/.test(r.label), 'accueil : la dose affichée est celle du jour, avec sa date (' + r.label + ')');
    ok(r.q && r.l, 'accueil : la question et la lumière de l’exemple sont prises dans celles de l’espace');
    ok(r.mois === 6 && r.etapes.length === 24 && r.etapes.join('|') === r.titres.join('|') && r.nomsMois, 'accueil : les 6 mois et les 24 étapes portent les titres du parcours');
    ok(r.vecu.length === 2 && r.vecu.join('|') === r.vecu2.join('|') && r.sch === 'vague', 'accueil : l’extrait de « Ce que j’ai vécu » est mot pour mot celui de l’étape 2, et le schéma est celui de la vague');
    ok(r.pictos === 6 && r.chips.length === 12 && r.chips.every(c => r.sits.some(t => c.endsWith(t))) && r.liens.every(h => /\/fiches\/[a-z0-9-]+\/$/.test(h)) && new Set(r.liens).size === 12 && r.groupes.join('|') === 'Avec un enfant|Avec un ado|Avec un adulte|Et pour vous' && r.outils.includes(r.nSits + ' situations') && r.outils2.includes(r.nPictos + ' images'), 'accueil : 12 situations rangées par âge avec le lien de leur fiche, et les nombres viennent de la boîte à outils');
    ok(r.prix.join('|') === '0 CHF|' + X.PRODUITS.parcours.p + ' CHF en tout|' + X.PRODUITS.relais.p + ' CHF une seule fois' && r.prix.join('|') === '0 CHF|84 CHF en tout|49 CHF une seule fois' && r.plans.join('|') === [r.tiers[0], X.PRODUITS.parcours.t, X.PRODUITS.relais.t].join('|'), 'accueil : les 3 offres et leurs prix sont ceux de l’espace ' + r.prix.join('|'));
    ok(r.relais === 'Si tu ne lis que trois choses' && r.relaisPrix === 'Essai gratuit. L’outil complet, 49 CHF une seule fois.', 'accueil : le chapitre « Passer le relais » montre le début d’une fiche, dit que l’essai est gratuit et donne le prix de l’outil ' + JSON.stringify([r.relais, r.relaisPrix]));
    ok(r.faq === 7 && r.cit.length > 40 && r.fin4.endsWith(r.cit) && /^Vous qui me lisez/.test(r.cit), 'accueil : 7 questions, et la phrase de la fin est celle qu’Antonio adresse aux parents à l’étape 4');
    // ---------- 2. Le schéma se déroule sur la page d'accueil
    await page.evaluate(() => document.querySelector('.acc-parcours .card.sch').scrollIntoView({ block: 'center' })); await page.waitForTimeout(200);
    let k = 0; while (await page.$('.acc-parcours ' + A('schnext')) && k < 8) { await page.click('.acc-parcours ' + A('schnext')); await page.waitForTimeout(60); k++; }
    const s = await page.evaluate(() => ({ pos: document.querySelector('.sch-pos').textContent, on: document.querySelectorAll('.sp.on').length, tous: document.querySelectorAll('.sp').length }));
    ok(s.pos === '5 sur 5' && s.on === s.tous && k === 4, 'accueil : le schéma se déroule en 5 moments ' + JSON.stringify(s));
    // ---------- 3. Le bouton flottant : caché en haut, visible au milieu, caché quand le bouton de la fin arrive
    const flot = () => page.evaluate(() => { const f = document.querySelector('.cta-flot'); const r = f.querySelector('.btn').getBoundingClientRect(); return { on: f.classList.contains('on'), vis: getComputedStyle(f).visibility, dans: r.top < innerHeight && r.bottom > 0 }; });
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(350); let f = await flot();
    ok(!f.on && f.vis === 'hidden', 'bouton flottant : absent tant que le bouton du haut est à l’écran');
    await page.evaluate(() => document.querySelector('.acc-depot').scrollIntoView({ block: 'start' })); await page.waitForTimeout(350); f = await flot();
    ok(f.on && f.vis === 'visible' && f.dans, 'bouton flottant : présent au milieu de la page');
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await page.waitForTimeout(350); f = await flot();
    ok(!f.on, 'bouton flottant : s’efface quand le bouton de la fin est à l’écran');
    await page.evaluate(() => document.querySelector('.acc-outils').scrollIntoView({ block: 'start' })); await page.waitForTimeout(350);
    await page.click('.cta-flot ' + A('entrer')); await page.waitForTimeout(350);
    ok(!(await page.$('.sheet')) && !!(await page.$('.tabs')) && !!(await page.$('.dose')) && await page.evaluate(() => JSON.parse(localStorage.getItem('pepe-v1')).onboarded === true), 'bouton flottant : « Commencer gratuitement » ouvre l’espace d’un seul geste, sans formulaire');
    ok(errs.length === 0, 'accueil : aucune erreur ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  // ---------- 4. « Voir ce qu'il y a dedans », les volets, les liens vers « Mon histoire » et les formules
  {
    const { ctx, page, errs } = await ouvre();
    // le premier écran tient dans la hauteur visible d'un téléphone : la question et les 3 portes sont là sans faire défiler
    const vus = await page.evaluate(() => [...document.querySelectorAll('.seuil h1, .seuil .porte')].map(e => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }));
    ok(vus.length === 4 && vus.every(Boolean), 'premier écran : la question et les 3 portes sont visibles sans faire défiler ' + JSON.stringify(vus));
    // Toute la fiche de Bastien est cliquable : on la touche au milieu d'un repère, loin du bouton, et elle s'ouvre en entier.
    {
      const pt = await page.evaluate(() => { const li = document.querySelectorAll('.fiche-b li')[1]; li.scrollIntoView({ block: 'center' }); const r = li.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2; const el = document.elementFromPoint(x, y); return { x, y, sous: el ? el.className : '', curseur: getComputedStyle(document.querySelector('.fiche-b')).cursor }; });
      await page.mouse.click(pt.x, pt.y); await page.waitForTimeout(700);
      const ex = await page.evaluate(() => ({ relais: !!document.querySelector('.v-relais'), t: (document.querySelector('.v-relais .rl-fiche') || document.body).textContent }));
      ok(pt.sous === 'fb-voir' && pt.curseur === 'pointer' && ex.relais && /Le relais de Bastien/.test(ex.t) && /Ce que je souhaite dire moi-même/.test(ex.t), 'fiche de Bastien : un toucher au milieu de la feuille ouvre la fiche entière ' + JSON.stringify([pt.sous, pt.curseur, ex.relais]));
      await page.click(A('back')); await page.waitForTimeout(600);
      ok(!!(await page.$('.seuil')), 'fiche de Bastien : « Retour » ramène à la vitrine');
      await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(150);
    }
    const av = await page.evaluate(() => [...document.querySelectorAll('.faq')].filter(d => d.open).length);
    const iLit = await page.evaluate(() => [...document.querySelectorAll('.faq summary')].findIndex(s => /Qui lit ce que j’écris/.test(s.textContent)));
    await page.click('.faq:nth-of-type(' + (iLit + 1) + ') summary'); await page.waitForTimeout(150);
    const ap = await page.evaluate(i => { const d = document.querySelectorAll('.faq')[i]; const p = d.querySelector('p'); return { open: d.open, h: p.getBoundingClientRect().height, t: p.textContent }; }, iLit);
    ok(av === 0 && iLit >= 0 && ap.open && ap.h > 20 && /reste sur votre appareil/.test(ap.t), 'questions : fermées au départ, une question s’ouvre et dit que tout reste sur l’appareil');
    await page.click('.mois:nth-of-type(3) summary'); await page.waitForTimeout(150);
    ok(await page.evaluate(() => document.querySelectorAll('.mois')[2].open && document.querySelectorAll('.mois')[0].open), 'mois : le premier est ouvert au départ, un autre s’ouvre au toucher');
    await page.click('.acc-parcours .card.vecu ' + A('peek-about')); await page.waitForTimeout(700);
    ok(/^Avant d’accompagner/.test(await page.textContent('h1')), 'extrait de l’étape 2 : « Lire mon histoire » ouvre l’histoire');
    await page.click(A('back')); await page.waitForTimeout(600);
    ok(!!(await page.$('.seuil')), 'histoire : le bouton Retour ramène à l’accueil');
    await page.click('.voice ' + A('peek-about')); await page.waitForTimeout(700);
    ok(/^Avant d’accompagner/.test(await page.textContent('h1')), 'chapitre d’Antonio : le bouton « Lire mon histoire » ouvre l’histoire'); await page.click(A('back')); await page.waitForTimeout(500);
    await page.click('.acc-formules ' + A('peek-plans')); await page.waitForTimeout(500);
    ok(/Les 3 offres/.test(await page.textContent('h1')), 'offres : le bouton ouvre le détail'); await page.click(A('back')); await page.waitForTimeout(400);
    await page.click('.acc-depot ' + A('porte', '[data-v="deposer"]')); await page.waitForTimeout(400);
    ok(!!(await page.$('main.deposer #draft')), 'chapitre « Déposer » : son bouton mène à l’écran pour écrire'); await page.click(A('back')); await page.waitForTimeout(400);
    ok(!!(await page.$('.seuil')) && (await page.evaluate(() => [...document.querySelectorAll('.seuil .voie')].map(e => e.textContent.trim()).join('|'))) === 'Ouvrir mon espace|Commencer le parcours de 6 mois', 'après ce premier geste, « Retour » ramène à la vitrine, qui propose « Ouvrir mon espace », tout en haut');
    await page.click('.seuil ' + A('entrer', '[data-v="today"]')); await page.waitForTimeout(500);
    ok(!!(await page.$('.tabs')) && !(await page.$('.seuil')), '« Ouvrir mon espace » mène dans l’espace du parent');
    ok(errs.length === 0, 'accueil (liens) : aucune erreur ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  // ---------- 5. La page a été écrite un autre jour : la dose affichée est quand même celle d'aujourd'hui
  {
    const { ctx, page, errs } = await ouvre({ init: () => { const D0 = Date, dec = 3 * 86400000; class D2 extends D0 { constructor(...a) { if (a.length) super(...a); else super(D0.now() + dec); } static now() { return D0.now() + dec; } } window.Date = D2; } });
    const brut = await (await ctx.request.get(APP)).text();
    const ecrite = net((brut.match(/acc-dose[\s\S]*?<div class="dose"><span class="label">[^<]*<\/span><p>([^<]*)<\/p>/) || [])[1] || '').replace(/&#39;|&rsquo;/g, '’');
    const r = await page.evaluate(() => ({ t: document.querySelector('.acc-dose .dose p').textContent, label: document.querySelector('.acc-dose .dose .label').textContent }));
    Object.assign(r, autreJour(3 * 86400000, () => ({ attendu: X.curatedDose(), attenduL: X.introDoseLabel() })));
    ok(net(r.t) === net(r.attendu) && r.label === r.attenduL, '3 jours plus tard : la dose et sa date sont celles du jour du visiteur (' + r.label + ')');
    ok(ecrite.length > 20, 'la page écrite à l’avance contient bien une dose, lisible sans JavaScript');
    ok(net(r.t) !== ecrite || new Date().getDay() === 0, '3 jours plus tard : ce n’est plus la dose écrite dans la page le jour de la fabrication');
    ok(errs.length === 0, 'accueil (autre jour) : aucune erreur ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  // ---------- 6. Petit écran, grand écran : rien ne dépasse, et sur ordinateur le titre est à gauche du contenu
  for (const [w, h] of [[320, 568], [1280, 800]]) {
    const { ctx, page, errs } = await ouvre({ ctx: { viewport: { width: w, height: h } } });
    await page.evaluate(() => document.querySelectorAll('main.intro details').forEach(d => { d.open = true; })); await page.waitForTimeout(150);
    const r = await page.evaluate(() => { const a = document.querySelector('.acc-parcours'), hh = a.querySelector('.acc-h').getBoundingClientRect(), c = a.querySelector('.acc-c').getBoundingClientRect(); const hors = [...document.querySelectorAll('main.intro *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > innerWidth + 1 && !e.closest('.cta-flot') && !e.matches('canvas.eau'); }).length;   /* la photo de l’accueil est plus large que son cadre sur grand écran, et le cadre la coupe */ return { sw: document.documentElement.scrollWidth, iw: innerWidth, cote: hh.right <= c.left, hors }; });
    ok(r.sw <= r.iw && r.hors === 0, w + ' px : rien ne dépasse sur la page d’accueil ' + JSON.stringify(r));
    ok(w < 1024 ? !r.cote : r.cote, w + ' px : ' + (w < 1024 ? 'le titre est au-dessus du contenu' : 'le titre est à gauche du contenu'));
    ok(errs.length === 0, w + ' px : aucune erreur ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  await b.close();
  console.log('accueil : ' + n + ' vérifications, ' + ko + ' échec' + (ko > 1 ? 's' : ''));
  process.exit(ko ? 1 : 0);
})();
