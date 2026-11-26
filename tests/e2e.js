// Tests de bout en bout du site construit, servi en HTTPS local comme sur GitHub Pages.
// usage : node e2e.js [--shots] [--axe-details]
const { chromium } = require('playwright');
const fs = require('fs');
// PEPE_ORIGIN, PEPE_BASE, PEPE_APPDIR et PEPE_PUBLIC permettent de vérifier une autre version du site (par exemple celle de parent-ecoute.ch, servie à la racine).
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8443';
const BASE_PATH = process.env.PEPE_BASE || '/carnet-de-liens/';
const APP_DIR = process.env.PEPE_APPDIR !== undefined ? process.env.PEPE_APPDIR : 'parent-ecoute/';
const BASE = ORIGIN + BASE_PATH;
const APP = BASE + APP_DIR;
const PUBLIC_APP = (process.env.PEPE_PUBLIC || 'https://ac201983.github.io') + BASE_PATH + APP_DIR;
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
const SHOTS = process.argv.includes('--shots');
const AXE_DETAILS = process.argv.includes('--axe-details');
const axeSrc = fs.readFileSync('/home/claude/tools/node_modules/axe-core/axe.min.js', 'utf8');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
let fails = 0, passes = 0; const viol = []; const incomplete = []; const overflow = []; const errors = [];
const ok = (c, m) => { if (c) passes++; else { fails++; console.log('FAIL ' + m); } };
if (SHOTS) fs.mkdirSync('/home/claude/build/shots', { recursive: true });

async function ctxPage(browser, opts = {}) {
  const ctx = await browser.newContext(Object.assign({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' }, opts));
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200) + ' @ ' + ((m.location() || {}).url || '').slice(0, 120)); });
  page.on('pageerror', e => errors.push('pageerror: ' + String(e).slice(0, 240)));
  page.on('requestfailed', r => errors.push('requête échouée: ' + r.url().slice(0, 120) + ' ' + ((r.failure() || {}).errorText || '')));
  page.on('request', r => { if (!r.url().startsWith(ORIGIN) && !r.url().startsWith('data:') && !/^(tel|mailto):/.test(r.url())) errors.push('requête tierce: ' + r.url().slice(0, 120)); });
  return { ctx, page };
}
async function audit(page, name) {
  await page.evaluate(axeSrc);
  const r = await page.evaluate(async () => { const r = await axe.run(document, { resultTypes: ['violations', 'incomplete'] }); return { v: r.violations.map(x => ({ id: x.id, impact: x.impact, n: x.nodes.length, help: x.help, t: x.nodes.slice(0, 3).map(n => n.target.join(' ') + ' :: ' + (n.failureSummary || '').replace(/\s+/g, ' ').slice(0, 220)) })), i: r.incomplete.filter(x => x.id === 'color-contrast').map(x => ({ n: x.nodes.length, t: x.nodes.slice(0, 40).map(n => n.target.join(' ')) })) }; });
  for (const v of r.v) viol.push(Object.assign({ view: name }, v));
  for (const i of r.i) incomplete.push(Object.assign({ view: name }, i));
  const of = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  if (of.sw > of.iw + 1) overflow.push(name + ' : ' + of.sw + ' > ' + of.iw);
  if (SHOTS) await page.screenshot({ path: '/home/claude/build/shots/' + name.replace(/[^a-z0-9]+/gi, '-') + '.png' });
}
const txt = (page, sel) => page.$eval(sel, e => e.textContent.replace(/\u00a0/g, ' ')).catch(() => null); // les espaces insécables des guillemets sont lus comme des espaces
const has = async (page, sel) => !!(await page.$(sel));
const store = (page, k) => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), k);

(async () => {
  const browser = await chromium.launch();

  // ============ 1. Accueil : contenu présent sans JavaScript, balises, bandeau ============
  {
    const { ctx, page } = await ctxPage(browser);
    const raw = await (await ctx.request.get(APP)).text();
    ok(/<p class="pour">Pour la mère ou le père d’une personne en situation de handicap<\/p><h1>On vous demande souvent comment va votre enfant\. <span class="ici">Ici, on commence par vous\.<\/span><\/h1><p class="besoin-l"><span class="besoin">Qu’aimeriez-vous qu’on comprenne de votre <span class="nb">journée \?<\/span><\/span><\/p>/.test(raw) && /<article class="fiche-b" aria-label="Le début d’une fiche d’exemple">.*<h2>Le relais de Bastien<\/h2>.*Voir la fiche de Bastien en entier<\/button>/s.test(raw) && /<svg class="sac"[^>]*aria-hidden="true"/.test(raw), 'accueil écrit dans le HTML (le public, la phrase d’Antonio, la question, puis le sac dessiné et la fiche de Bastien avec son bouton)');
    ok(/<section class="nom-sens" aria-labelledby="nom-sens-t"><h2 id="nom-sens-t">Parent écouté, parent éclairé<\/h2><p class="ns-l"><b>Écouté\.<\/b> .*<p class="ns-l"><b>Éclairé\.<\/b> .*<figure class="mot-a"><blockquote><p>Mon expérience d’éducateur social m’a guidé dans le choix des questions et des outils que vous trouverez ici\. .*C’est vous qui choisissez\.<\/p><\/blockquote><figcaption><b>Antonio Company<\/b><span>Éducateur social, responsable d’une équipe socio-éducative<\/span><\/figcaption><\/figure><\/section>/.test(raw), 'le sens du nom et le mot signé d’Antonio, avec ses 2 rôles, sont écrits dans la page (lisibles sans JavaScript)');
    ok(/<html lang="fr" data-vue="intro">/.test(raw) && /<link rel="preload" href="[^"]*fonts\/besley\.woff2" as="font" type="font\/woff2" crossorigin>/.test(raw) && !/rel="preload" href="[^"]*img\/hero\.webp"/.test(raw), 'la vitrine demande tout de suite la police de son grand titre, et plus la photo de la goutte');
    ok((raw.match(/class="porte[^"]*" data-act="porte"/g) || []).length === 3 && /Souffler 2 minutes/.test(raw) && /Déposer ce qui pèse/.test(raw) && /data-soir="Trouver une idée pour ce[\s\u00a0]soir"/.test(raw), 'les 3 portes sont écrites dans la page');
    ok(/<title>[^<]{20,70}<\/title>/.test(raw) && /<meta name="description" content="[^"]{80,180}">/.test(raw), 'titre et description meta');
    ok(new RegExp('<link rel="canonical" href="' + reEsc(PUBLIC_APP) + '">').test(raw), 'adresse canonique');
    ok(new RegExp('og:image" content="' + reEsc(PUBLIC_APP) + 'img\\/apercu\\.jpg"').test(raw) && /twitter:card" content="summary_large_image"/.test(raw), 'balises d’aperçu social');
    ok(/rel="icon" href="[^"]*favicon\.ico"/.test(raw) && /rel="icon" href="[^"]*favicon\.svg"/.test(raw) && /apple-touch-icon/.test(raw) && /rel="manifest"/.test(raw), 'favicon, icône Apple, manifest');
    ok(/Content-Security-Policy/.test(raw) && /upgrade-insecure-requests/.test(raw), 'politique de sécurité (CSP) avec passage forcé en HTTPS');
    ok(!/fonts\.googleapis|gstatic/.test(raw), 'plus aucun appel à Google Fonts');
    ok(/class="voice[^>]*>.*accueilli dans une famille\..*travailleur social depuis mes 19 ans.*Lire mon histoire/s.test(raw), 'le mot d’Antonio est écrit dans la page (lisible sans JavaScript)');
    ok(!/[:;—]/.test((raw.match(/<section class="voice[\s\S]*?<\/section>/) || ['x:'])[0].replace(/<[^>]+>/g, ' ')), 'le mot d’Antonio se lit comme on parle, sans deux-points, point-virgule ni tiret long');
    // « éducateur social » : Antonio l'a écrit lui-même dans son mot signé du 19 novembre 2026, et il a demandé le soir même que son 2e rôle
    // l'accompagne toujours (« responsable d'une équipe socio-éducative »). Le mot ne figure donc que dans son mot signé, ou suivi de ce 2e rôle.
    // « éducateur social depuis… » n'est écrit nulle part : il est travailleur social depuis ses 19 ans, et éducateur social diplômé plus tard.
    for (const f of ['', 'app.js', 'confidentialite.html', 'conditions.html', 'antonio/', 'antonio/antonio.js', 'manifest.webmanifest']) { const brut = await (await ctx.request.get(APP + f)).text(); const t = brut.split('Mon expérience d’éducateur social m’a guidé').join('').replace(/[ée]ducateur social, responsable d’une équipe socio-éducative/gi, ''); ok(!/[ée]ducateur social/i.test(t) && !/[ée]ducateur social depuis/i.test(brut), '« éducateur social » ne figure que dans le mot signé d’Antonio ou avec son 2e rôle, et jamais suivi de « depuis », dans ' + (f || 'index.html')); }
    await page.goto(APP); await page.waitForTimeout(300);
    ok(!(await has(page, '#consent')), 'aucun bandeau à l’arrivée, tant qu’aucune mesure d’audience n’est branchée');
    ok(!(await has(page, '#cf-beacon')) && (await store(page, 'pepe-consent')) === null, 'aucun outil d’audience chargé, aucun choix inventé');
    ok(await page.evaluate(() => document.cookie === ''), 'aucun cookie déposé');
    await audit(page, 'accueil');
    // la question suit l'heure du visiteur, dès le premier affichage
    { const h = new Date().getHours(), m = (h < 5 || h >= 22) ? 'nuit' : h < 11 ? 'matin' : h < 18 ? 'jour' : 'soir';
      const veut = { matin: ['Bonjour.', 'De quoi auriez-vous besoin ce matin ?', 'Trouver une idée pour ce matin'], jour: ['Bonjour.', 'De quoi auriez-vous besoin aujourd’hui ?', 'Trouver une idée pour aujourd’hui'], soir: ['Bonsoir.', 'De quoi auriez-vous besoin ce soir ?', 'Trouver une idée pour ce soir'], nuit: ['Il est tard.', 'De quoi auriez-vous besoin, là, maintenant ?', 'Trouver une idée pour cette nuit'] }[m];
      const vu = await page.evaluate(() => [document.querySelectorAll('.seuil .salut').length, document.querySelector('.seuil .besoin').textContent, document.querySelector('.seuil .porte[data-v="piste"] b').textContent.split(String.fromCharCode(160)).join(' '), document.documentElement.className, document.getElementById('app').className, getComputedStyle(document.body).backgroundColor, (document.querySelector('meta[name="theme-color"]') || {}).content]);
      const jour = m === 'matin' || m === 'jour';
      ok(vu[0] === 0 && vu[1] === 'Qu’aimeriez-vous qu’on comprenne de votre journée ?' && vu[2] === veut[2] && new RegExp('\\bh-' + m + '\\b').test(vu[3]) && new RegExp('\\bh-' + m + '\\b').test(vu[4]), 'accueil : la question est « Qu’aimeriez-vous qu’on comprenne de votre journée ? » à toute heure, et la troisième porte suit l’heure (' + m + ')');
      ok(/\bvue-intro\b/.test(vu[3]) && /\bclair\b/.test(vu[3]) === jour && vu[5] === (jour ? 'rgb(242, 236, 219)' : 'rgb(7, 36, 15)') && vu[6] === (jour ? '#F2ECDB' : '#07240F'), 'accueil : le papier du carnet le jour, la table sombre le soir, jusqu’en haut du téléphone (' + m + ') ' + JSON.stringify(vu.slice(3))); }
    ok((await page.$$('.seuil .porte')).length === 3 && (await page.$$('.seuil ' + A('entrer', '[data-v="parcours"]'))).length === 1 && await has(page, 'main.intro .hbar .sos'), 'premier écran : 3 portes, le parcours de 6 mois, et le SOS');
    ok((await page.$$eval(A('entrer', '[data-v="today"]'), L => L.length === 2 && L.every(b => b.textContent.trim() === 'Commencer gratuitement'))) && (await page.$$eval('.btn.primary', L => L.every(b => b.dataset.act === 'entrer' || b.dataset.act === 'film' || !!b.closest('.sch')))), '« Commencer gratuitement » en bas et en flottant, et les seuls autres boutons pleins sont celui du schéma et la commande du film');
    ok((await page.$$eval('.acc-scenes a[data-act="sit"]', L => L.length === 12 && L.every(a => /\/fiches\/[a-z0-9-]+\/$/.test(a.getAttribute('href'))))) && await has(page, 'a[data-act="fiches"][href$="/fiches/"]'), 'accueil : 12 situations par âge, chacune avec le lien de sa fiche');
    // le SOS s'ouvre sans être entré dans l'espace
    await page.click('main.intro .hbar .sos'); await page.waitForTimeout(150);
    ok(await has(page, '.sosview') && (await page.$$eval('.emg a.tel', a => a.length)) === 3, 'SOS ouvert depuis l’accueil, sans inscription');
    await page.click('.sosview .back'); await page.waitForTimeout(200); ok(await has(page, '.seuil') && (await store(page, 'pepe-v1')) === null, 'SOS : retour à l’accueil, rien n’a été créé');
    // aperçu des formules sans s’inscrire
    await page.click(A('peek-plans')); await page.waitForTimeout(100);
    ok((await txt(page, 'h1')) === 'Les 3 offres' && (await page.$$('.formules .formule')).length === 3 && (await page.$$('.formule.f-parcours .f-payer .f-mode')).length === 2, 'les 3 offres consultables depuis l’accueil, avec les 2 façons de payer Le parcours');
    await audit(page, 'formules-apercu');
    await page.click(A('back')); await page.waitForTimeout(200); ok(await has(page, '.seuil'), 'retour à l’accueil');
    await page.click(A('peek-about')); await page.waitForTimeout(200);
    ok(/^Avant d’accompagner des familles/.test(await txt(page, 'h1')) && /#histoire$/.test(page.url()) && /^Mon histoire/.test(await page.title()), '« Lire mon histoire » ouvre la page, avec son adresse et son titre');
    ok(!/[:;—]/.test(await page.$eval('.story', e => e.innerText)) && !/[:;—]/.test(await page.$eval('.band.story h1', e => e.innerText)), 'l’histoire se lit comme on parle, sans deux-points, point-virgule ni tiret long');
    ok((await page.$$('.places li')).length === 3 && (await page.$$('.verbs li')).length === 3 && (await txt(page, '.verbs li:nth-child(2)')).replace(/\s+/g, ' ') === 'Apprendre avec la différence', 'trois places, trois verbes');
    ok((await page.$$('main .btn.primary')).length === 1 && await has(page, 'main ' + A('entrer')), 'histoire : un seul bouton d’action avant d’entrer');
    await audit(page, 'histoire-apercu');
    await page.click(A('back')); await page.waitForTimeout(250);
    ok(await has(page, '.seuil') && !/#/.test(page.url()) && !/^Mon histoire/.test(await page.title()), 'retour à l’accueil : adresse et titre rétablis');
    await page.click(A('peek-about')); await page.waitForTimeout(200); await page.goBack(); await page.waitForTimeout(250);
    ok(await has(page, '.seuil') && !(await has(page, '.places')), 'le bouton Retour du téléphone ramène à l’accueil');
    await page.goForward(); await page.waitForTimeout(250);
    ok(/^Avant d’accompagner/.test(await txt(page, 'h1')) && /#histoire$/.test(page.url()), 'le bouton Suivant du navigateur rouvre l’histoire');
    await page.goBack(); await page.waitForTimeout(250);
    await page.reload(); await page.waitForTimeout(200);
    ok(await has(page, '.seuil') && (await store(page, 'pepe-v1')) === null, 'après rechargement : toujours l’accueil, et rien n’a été enregistré tant qu’aucun geste n’est fait');

    // ============ 2. Le premier geste : souffler tout de suite, sans rien remplir ============
    await page.click('.seuil .porte[data-v="souffle"]'); await page.waitForTimeout(250);
    ok(await has(page, 'main.souffle.s-cours') && !(await has(page, '.sheet')) && !(await has(page, '.tabs')), 'un geste : l’écran de respiration, sans question préalable');
    { const d0 = await store(page, 'pepe-v1'); ok(d0.onboarded === true && d0.age === '' && d0.situation === '' && d0.weights.length === 0 && d0.me === '' && d0.perso === false, 'l’espace est créé par le geste, et rien n’est coché à la place du parent'); }
    ok((await txt(page, '#souffle-mot')) === 'Installez-vous' && (await page.$$('.souffle .tours i')).length === 12, 'respiration : un mot pour s’installer, et 12 respirations annoncées');
    await page.waitForTimeout(2000); ok((await txt(page, '#souffle-mot')) === 'Inspirez' && (await page.$$('.souffle .tours i.c')).length === 1, 'respiration : « Inspirez », première respiration en cours');
    await page.waitForTimeout(4000); ok((await txt(page, '#souffle-mot')) === 'Expirez', 'respiration : « Expirez » après 4 secondes');
    await audit(page, 'souffle');
    await page.click(A('souffle-stop')); await page.waitForTimeout(100); ok(await has(page, 'main.souffle.s-pret') && await has(page, A('souffle-go')), 'respiration : « Arrêter » rend la main, « Commencer » la relance');
    await audit(page, 'souffle-pret');
    await page.click(A('back')); await page.waitForTimeout(350);
    // « Retour » ramène d'où l'on vient : ici la vitrine. Le parent y trouve maintenant « Ouvrir mon espace ».
    ok(await has(page, 'main.intro .seuil') && !(await has(page, '.tabs')) && (await page.$$('.seuil .porte')).length === 3 && /#accueil$/.test(page.url()), 'retour : la vitrine, d’où le parent venait');
    ok((await page.evaluate(() => [...document.querySelectorAll('.seuil .voie')].map(e => e.textContent.trim()).join('|'))) === 'Commencer le parcours de 6 mois|Ouvrir mon espace', 'la vitrine d’un parent déjà entré propose « Ouvrir mon espace »');
    await page.click('.seuil ' + A('entrer', '[data-v="today"]')); await page.waitForTimeout(350);
    ok(await has(page, '.tabs') && /\.$/.test(await txt(page, 'h1')) && !(await has(page, '.seuil')), '« Ouvrir mon espace » : le parent est dans son espace, sur « Aujourd’hui »');
    // « Aujourd'hui » : la question, les 3 portes, puis la dose avant tout le reste
    ok((await page.$$('.portes.mini .porte')).length === 3 && /De quoi auriez-vous besoin/.test(await txt(page, '.band .besoin')), '« Aujourd’hui » : la question du moment et les 3 portes');
    ok(await page.evaluate(() => { const m = document.getElementById('main'), d = m.querySelector('.dose'), st = m.querySelector('.step.semaine'), q = m.querySelector('[data-view="evo"]'); return !!d && !!st && !q && (d.compareDocumentPosition(st) & Node.DOCUMENT_POSITION_FOLLOWING) > 0; }), '« Aujourd’hui » : la dose passe avant l’étape, et le questionnaire n’est plus devant elle');
    ok(/Le parcours de 6 mois commence ici/.test(await txt(page, '.step.semaine .label')) && await has(page, '.reprendre .fil'), '« Aujourd’hui » : le parcours de 6 mois a sa place, avec son fil de 24 étapes');
    ok(await has(page, '.card.perso') && /Facultatif/.test(await txt(page, '.card.perso')), 'la personnalisation est proposée après, comme un choix');
    await audit(page, 'aujourdhui-nouveau');
    // qui parle ici
    await page.click('.dose ' + A('voix')); await page.waitForTimeout(150);
    ok(await has(page, '.sheet #voix-t') && (await page.$$('.sheet .qui')).length === 4 && /Personne ne lit ce que vous écrivez/.test(await txt(page, '.sheet')) && /Vos mots sont enregistrés dans ce navigateur, sur cet appareil/.test(await txt(page, '.sheet')) && /L’application ne les réécrit pas/.test(await txt(page, '.sheet')) && /C’est vous qui copiez le texte et qui décidez à qui le montrer/.test(await txt(page, '.sheet')) && /Aucune intelligence artificielle n’y intervient/.test(await txt(page, '.sheet')) && !/Avec Antonio/.test(await txt(page, '.sheet')), '« Qui vous parle ici ? » : ce que l’application choisit, ce que deviennent les mots du parent, ce qui vient d’Antonio, ce qui vient de la famille dans « Passer le relais »');
    await audit(page, 'qui-parle');
    await page.keyboard.press('Escape'); await page.waitForTimeout(100);
    // personnaliser : facultatif, rien de coché, gardé seulement avec « Enregistrer »
    await page.click('.card.perso ' + A('onboard')); await page.waitForTimeout(150);
    ok(await has(page, '.sheet[role="dialog"]') && /Faisons connaissance/.test(await txt(page, '#ob-title')), 'feuille « Faisons connaissance » ouverte');
    ok((await page.$$('.sheet .chip[aria-pressed="true"]')).length === 0 && (await page.$eval('#ob-me', e => e.value)) === '', 'rien n’est présélectionné');
    ok(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('sheet')), 'le focus va sur la feuille, pas dans le champ (pas de clavier qui s’ouvre)');
    await audit(page, 'questionnaire-entree');
    await page.fill('#ob-me', '  Camille  ');
    await page.$eval('.sheet', s => { s.scrollTop = 60; });
    await page.click(A('ob', '[data-k="age"][data-v="a"]'));
    ok(await page.$eval('#ob-me', e => e.value) === '  Camille  ', 'le prénom saisi survit au choix d’une pastille');
    ok(await page.$eval(A('ob', '[data-k="age"][data-v="a"]'), e => e.getAttribute('aria-pressed') === 'true' && document.activeElement === e), 'pastille cochée et focus conservé');
    ok(!(await has(page, '.sheet.in')), 'la feuille ne se ré-anime pas à chaque appui');
    await page.click(A('ob', '[data-k="age"][data-v="a"]')); ok(await page.$eval(A('ob', '[data-k="age"][data-v="a"]'), e => e.getAttribute('aria-pressed') === 'false'), 'toucher une pastille cochée la retire');
    await page.click(A('ob', '[data-k="age"][data-v="a"]'));
    await page.click(A('obw', '[data-v="fatigue"]'));
    await page.click('.sheet ' + A('sheet-close')); await page.waitForTimeout(150);
    { const d0 = await store(page, 'pepe-v1'); ok(d0.me === '' && d0.age === '' && d0.weights.length === 0 && d0.perso === false, 'fermer sans enregistrer ne garde rien'); }
    await page.click('.card.perso ' + A('onboard')); await page.waitForTimeout(150);
    await page.fill('#ob-me', '  Camille  '); await page.click(A('ob', '[data-k="age"][data-v="a"]')); await page.click(A('obw', '[data-v="fatigue"]'));
    await page.click(A('ob-done')); await page.waitForTimeout(150);
    const d1 = await store(page, 'pepe-v1'); ok(d1.onboarded && d1.me === 'Camille' && d1.age === 'a' && d1.situation === '' && d1.weights.includes('fatigue') && d1.perso === true, '« Enregistrer » garde les réponses (prénom nettoyé)');
    ok(/, Camille\./.test(await txt(page, 'h1')) && /enregistré/.test((await txt(page, '.toast')) || '') && !(await has(page, '.card.perso')), 'accueil du jour personnalisé, confirmation affichée, et la proposition ne revient plus');

    // ============ 3. Déposer : un écran pour écrire, une réponse, une piste ============
    await audit(page, 'aujourdhui');
    await page.click('.portes ' + A('porte', '[data-v="deposer"]')); await page.waitForTimeout(200);
    ok(await has(page, 'main.deposer #draft') && !(await has(page, '.chips.attente')) && await has(page, '.bar .back'), 'déposer : son écran, sans les 2 intentions qui donnaient la même réponse');
    await audit(page, 'deposer');
    await page.click(A('dsend'));
    ok(await has(page, '#err-draft[role="alert"]') && await page.$eval('#draft', e => e.getAttribute('aria-invalid') === 'true' && document.activeElement === e), 'dépôt vide : message sous le champ, champ signalé et sélectionné');
    await audit(page, 'deposer-erreur');
    await page.type('#draft', 'Ce');
    ok(!(await has(page, '#err-draft')), 'le message disparaît dès qu’on écrit');
    ok(await page.$eval('#draft', e => e.maxLength === 4000), 'longueur maximale posée sur le champ');
    await page.fill('#draft', 'x'.repeat(3700)); await page.dispatchEvent('#draft', 'input');
    ok(/3700 \/ 4000/.test(await txt(page, '#draft-count')), 'compteur affiché à l’approche de la limite');
    await page.fill('#draft', 'Ce soir j’ai crié et je m’en veux. Je suis épuisé, et il ne veut pas dormir.');
    await page.click(A('dsend')); await page.waitForTimeout(200);
    const d2 = await store(page, 'pepe-v1'); ok(d2.depots.length === 1 && d2.depots[0].question && d2.depots[0].lumiere, 'dépôt gardé, question et lumière reçues');
    ok(await has(page, '.mirror .q') && (await page.$eval('#draft', e => e.value)) === '', 'réponse affichée, champ vidé');
    ok(d2.depots[0].pistes.join() === 'culpa,sommeil' && (await page.$$eval('.pistes-depot .sit', L => L.map(a => a.dataset.id).join())) === 'culpa,sommeil' && /proposées par l’application d’après vos mots/.test(await txt(page, '.pistes-depot .label')), 'après le dépôt : 2 pistes au plus, une pour le parent et une pour la situation, dites comme un choix de l’application');
    await audit(page, 'deposer-reponse');
    await page.click(A('back')); await page.waitForTimeout(250);
    ok(await has(page, '.depot-jour .mirror .q') && await has(page, '.tabs'), '« Aujourd’hui » retrouve le dépôt du jour et sa réponse');
    await audit(page, 'aujourdhui-depot');

    // ============ 4. Questionnaire de départ (Mon évolution), depuis le parcours ============
    await page.click('.tab' + A('go', '[data-view="parcours"]')); await page.waitForTimeout(100);
    await page.click('.quick ' + A('go', '[data-view="evo"]')); await page.waitForTimeout(100);
    ok(/Quelle idée vous faisiez-vous de la vie de parent/.test(await txt(page, '#main')), 'sans situation choisie, la première question est la plus générale');
    await audit(page, 'evolution');
    await page.click(A('evosave')); await page.waitForTimeout(250);
    ok((await store(page, 'pepe-v1')).evo.t1 && /Le parcours/.test(await txt(page, 'h1')) && /point de départ est enregistré/.test((await txt(page, '.toast')) || ''), 'point de départ enregistré : retour à l’écran d’où l’on venait, avec une confirmation');

    // ============ 5. Parcours, cadenas, feuille de formule ============
    await page.click('.tab' + A('go', '[data-view="parcours"]')); await page.waitForTimeout(100);
    ok((await page.$$('.step.locked')).length === 23, '23 étapes verrouillées en Découverte');
    ok(await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-view') === 'parcours'), 'focus conservé sur l’onglet après changement d’écran');
    await audit(page, 'parcours');
    await page.click(A('step', '[data-i="5"]')); await page.waitForTimeout(100);
    ok(await has(page, '.sheet #up-title'), 'feuille de formule ouverte sur une étape verrouillée');
    await audit(page, 'feuille-formule');
    await page.keyboard.press('Escape'); ok(!(await has(page, '.sheet')), 'Échap ferme la feuille');
    await page.click(A('step', '[data-i="0"]')); await page.waitForTimeout(100);
    await audit(page, 'etape');
    await page.click(A('back')); await page.waitForTimeout(150);

    // ============ 6. Boîte à outils ============
    await page.click('.tab' + A('go', '[data-view="kit"]')); await page.waitForTimeout(100);
    ok((await page.$$('.souvent .chip')).length === 4 && (await page.$eval('.souvent .chip', e => e.dataset.id)) === 'ado' && await page.$eval(A('age', '[data-v="all"]'), e => e.getAttribute('aria-pressed') === 'true'), '4 situations fréquentes à cette heure sont proposées, celle de l’âge donné (ado) en premier, et la liste reste entière');
    ok((await page.$$('.sits .sit')).length === 23 && (await page.$$eval('.sits a.sit', L => L.every(a => /\/fiches\/[a-z0-9-]+\/$/.test(a.getAttribute('href'))))), '23 situations, chacune un vrai lien vers sa fiche');
    await audit(page, 'outils-situations');
    await page.click('.sits .sit'); await page.waitForTimeout(150);
    ok(/\/fiches\/la-crise\/$/.test(page.url()) && /^La crise, une fiche de/.test(await page.title()) && await has(page, A('partager')), 'la fiche a son adresse et son titre, et un bouton pour l’envoyer');
    await audit(page, 'situation'); await page.click(A('back')); await page.waitForTimeout(200);
    ok(/\/fiches\/$/.test(page.url()) && (await page.$$('.sits .sit')).length === 23, 'retour à la liste, avec son adresse');
    await page.click(A('kit', '[data-v="tools"]')); await audit(page, 'outils-minuteur');
    for (const t of ['ft', 'routine', 'abc', 'phr']) { await page.click(A('tool', `[data-v="${t}"]`)); await page.waitForTimeout(60); if (t === 'routine') await page.click(A('rdone', '[data-i="0"]')); await audit(page, 'outils-' + t);
      if (t === 'ft') { ok(/Par exemple, d’abord les dents, ensuite l’histoire\./.test(await txt(page, '#main')) && /Ce qu’il doit faire/.test(await txt(page, '.ftcard')), '« d’abord, ensuite » : expliqué avec un exemple, cases qui disent quoi y mettre');
        await page.click(A('ftg', '[data-v="tout"]')); await page.waitForTimeout(60); await page.click(A('ftset', '[data-id="habiller"]')); await page.click(A('ftset', '[data-id="dehors"]')); await page.waitForTimeout(60);
        ok(/dites « D’abord s’habiller, ensuite aller dehors »\./.test(await txt(page, '.comfort')), '« d’abord, ensuite » : la phrase à dire s’affiche quand le tableau est rempli'); await audit(page, 'outils-ft-rempli'); }
      if (t === 'abc') { await page.click(A('abcadd')); ok(await has(page, '#err-a1'), 'journal vide : message sous le champ'); await page.fill('#a2', 'Cris pendant dix minutes'); await page.click(A('abcadd')); ok((await store(page, 'pepe-v1')).abc.length === 1, 'journal : une ligne suffit'); }
      if (t === 'phr') { await page.click(A('phadd')); ok(await has(page, '#err-ph'), 'phrase vide : message sous le champ'); await page.fill('#ph', 'On respire comme le dragon'); await page.press('#ph', 'Enter'); ok((await store(page, 'pepe-v1')).phrases.length === 1, 'phrase gardée avec la touche Entrée'); await page.fill('#ph', 'On respire comme le dragon'); await page.click(A('phadd')); ok(/déjà/.test(await txt(page, '#err-ph')) && (await store(page, 'pepe-v1')).phrases.length === 1, 'doublon refusé'); await audit(page, 'outils-phr-erreur'); } }
    await page.click(A('kit', '[data-v="me"]')); await audit(page, 'outils-pour-moi');
    for (const x of ['breath', 'trois', 'deposer', 'droit', 'minute', 'appeler']) { await page.click(A('exo', `[data-id="${x}"]`)); await page.waitForTimeout(60); await audit(page, 'exo-' + x);
      if (x === 'trois') { await page.click(A('threeadd')); ok(await has(page, '#err-t1'), 'trois choses vide : message sous le champ'); }
      if (x === 'appeler') { const hrefs = await page.$$eval('a.tel', a => a.map(e => e.getAttribute('href'))); ok(hrefs.includes('tel:143') && hrefs.includes('tel:0582616161') && hrefs.includes('tel:144'), 'numéros d’aide cliquables (' + hrefs.join(', ') + ')'); ok(await has(page, 'a[href^="https://www.proinfirmis.ch/"][rel~="noopener"]'), 'lien Pro Infirmis'); }
      await page.click(A('back')); await page.waitForTimeout(150); }

    // ============ 7. SOS ============
    await page.click('.sos'); await page.waitForTimeout(100);
    const sos = await page.$$eval('.emg a.tel', a => a.map(e => e.getAttribute('href'))); ok(sos.join() === 'tel:144,tel:117,tel:143', 'SOS : 144, 117 et 143 cliquables');
    await audit(page, 'sos');
    await page.click('.sosview .back'); await page.waitForTimeout(150);

    // ============ 8. Moi, données, formules ============
    await page.click('.tab' + A('go', '[data-view="me"]')); await page.waitForTimeout(100);
    ok(await has(page, '.menu-list a[href$="confidentialite.html"]') && await has(page, '.menu-list a[href$="conditions.html"]'), 'liens vers les pages légales dans « Moi »');
    ok(/Personnaliser mon espace/.test(await txt(page, '.menu-list')) && /Qui vous parle ici/.test(await txt(page, '.menu-list')), '« Moi » : personnaliser, et savoir qui parle');
    await audit(page, 'moi');
    await page.click(A('go', '[data-view="depots"]')); await audit(page, 'mes-depots'); await page.click(A('back')); await page.waitForTimeout(150);
    await page.click(A('go', '[data-view="data"]')); await page.waitForTimeout(60);
    ok(!(await has(page, A('consent'))), '« Vos données » : pas de carte de consentement tant qu’aucune mesure d’audience n’est branchée');
    await page.click(A('reset')); await audit(page, 'donnees-confirmation'); await page.click(A('reset-no'));
    await page.click(A('back')); await page.waitForTimeout(150);
    ok(/L’histoire d’Antonio/.test(await txt(page, '.menu-list')), 'entrée « L’histoire d’Antonio » dans « Moi »');
    await page.click(A('go', '[data-view="about"]')); await page.waitForTimeout(200); await page.$eval('.logo-sceau', i => i.scrollIntoView());
    // le logo officiel (la goutte au-dessus de ses 2 ondes) signe « Mon histoire », à la place de l'ancien médaillon
    ok(await page.$eval('.logo-sceau', e => e.getAttribute('role') === 'img' && (e.getAttribute('aria-label') || '').length > 20 && /goutte/.test(e.getAttribute('aria-label')) && !!e.querySelector('svg.logo path') && e.querySelectorAll('svg.logo ellipse').length === 2 && e.getBoundingClientRect().width >= 40) && !(await page.$('img.medal')), 'le logo à la goutte signe « Mon histoire », avec son texte alternatif');
    ok((await page.$$('main .btn.primary')).length === 0 && await has(page, '.bar .back') && await has(page, '.tabs'), 'histoire depuis « Moi » : pas de bouton d’inscription, barre et onglets présents');
    await page.evaluate(() => scrollTo(0, 0)); await audit(page, 'histoire'); await page.click(A('back')); await page.waitForTimeout(100);
    ok(/Camille|Moi/.test(await txt(page, 'h1')) && !/#histoire/.test(page.url()), 'retour à « Moi », adresse rétablie');
    await page.click(A('go', '[data-view="plans"]')); await page.waitForTimeout(60); await audit(page, 'offres');
    // choisir une offre ouvre la commande en démonstration, et c'est « paiement accepté » qui l'ouvre
    await page.click('.formule ' + A('commande', '[data-v="parcours"][data-m="six"]')); await page.waitForTimeout(150);
    ok(/Aucun montant réel n’est débité/.test(await txt(page, 'main')) && (await page.$$('.cmd-mode .ech li')).length === 7 && (await page.evaluate(() => JSON.parse(localStorage.getItem('pepe-v1')).tier)) === 'free', 'commande : une démonstration avec ses 6 échéances, et rien ne change avant la confirmation');
    await audit(page, 'commande');
    await page.click(A('cmd', '[data-v="ok"]')); await page.waitForTimeout(150);
    ok((await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('pepe-v1')); return d.tier + ' ' + d.achats.parcours.m + ' ' + !!d.achats.relais; })) === 'parcours six false', 'commande acceptée (démonstration) : Le parcours est ouvert, en six fois, et « Passer le relais » reste à part');
    await audit(page, 'commande-confirmee');

    // ============ 9. « Passer le relais » : l'exemple, puis l'outil acheté seul ============
    await page.click('.tab' + A('go', '[data-view="kit"]')); await page.waitForTimeout(100); await page.click(A('kit', '[data-v="tools"]')); await page.waitForTimeout(100);
    ok(/Passer le relais/.test(await txt(page, '.rl-porte, main')), 'la boîte à outils ouvre sur « Passer le relais »');
    await page.goto(APP + 'relais/'); await page.waitForTimeout(300);
    ok((await txt(page, 'h1')) === 'Passer le relais' && await has(page, '.v-relais .offre') && /49 CHF/.test(await txt(page, '.v-relais .offre')), 'l’outil a son adresse, et son prix est dit dès l’accueil');
    await audit(page, 'relais-accueil');
    await page.click('[data-act="rl"][data-k="exemple"]'); await page.waitForTimeout(200);
    ok(await has(page, '.v-relais .rl-fiche .rl-trois') && (await page.$$('.v-relais .rl-fiche .rl-trois li')).length === 3, 'l’exemple de fiche montre ses 3 repères avant de rien remplir');
    await audit(page, 'relais-exemple');
    await page.goto(APP + 'relais/'); await page.waitForTimeout(300);
    await page.click('.v-relais .offre ' + A('commande', '[data-v="relais"]')); await page.waitForTimeout(150);
    ok(/Total\s*49 CHF/.test(await txt(page, 'main')) && /Aucun montant réel n’est débité/.test(await txt(page, 'main')), 'commande de l’outil : 49 CHF une seule fois, en démonstration');
    await page.click(A('cmd', '[data-v="ok"]')); await page.waitForTimeout(150);
    ok((await page.evaluate(() => !!JSON.parse(localStorage.getItem('pepe-v1')).achats.relais)), 'commande acceptée (démonstration) : l’outil est ouvert');
    await page.click('.tab' + A('go', '[data-view="me"]')); await page.waitForTimeout(100);
    ok(/Le parcours\s*1 mensualité sur 6/.test(await txt(page, '.mes-achats')) && /Passer le relais\s*acheté, 49 CHF/.test(await txt(page, '.mes-achats')), '« Mes achats » dit ce qui est acheté');
    await audit(page, 'moi-achats');

    // ============ 10. Retour d’un habitué, puis remise à zéro ============
    await page.goto(APP); await page.waitForTimeout(250);
    ok(await page.evaluate(() => document.documentElement.classList.contains('returning')) && /Camille/.test(await txt(page, 'h1')) && !(await has(page, '.seuil')), 'habitué : arrive directement sur « Aujourd’hui »');
    await page.goto(APP + '?nouveau'); await page.waitForTimeout(250);
    ok(await has(page, '.seuil') && (await store(page, 'pepe-v1')) === null && !/nouveau/.test(page.url()), '?nouveau : repart de zéro');
    await ctx.close();
  }

  // ============ 10 bis. L'histoire par son adresse directe (lien partagé) ============
  {
    const { ctx, page } = await ctxPage(browser);
    await page.goto(APP + '#histoire'); await page.waitForTimeout(350);
    ok(/^Avant d’accompagner/.test(await txt(page, 'h1')) && !(await has(page, '.seuil')) && await page.evaluate(() => document.documentElement.classList.contains('returning')), 'lien direct vers l’histoire : la page s’ouvre dessus, sans passer par l’accueil');
    await page.click('main ' + A('entrer')); await page.waitForTimeout(250);
    ok(/\.$/.test(await txt(page, 'h1')) && await has(page, '.tabs') && !(await has(page, '.sheet')) && !/#histoire/.test(page.url()), 'depuis l’histoire, « Commencer gratuitement » ouvre « Aujourd’hui » d’un seul geste, adresse rétablie');
    await page.goto(APP + '#histoire'); await page.waitForTimeout(350);
    ok(/^Avant d’accompagner/.test(await txt(page, 'h1')) && await has(page, '.tabs'), 'lien direct pour un habitué : l’histoire, avec ses onglets');
    await page.click('.bar ' + A('back')); await page.waitForTimeout(150);
    ok(await has(page, '.tabs') && !(await has(page, '.places')) && !/#histoire/.test(page.url()), 'retour depuis l’histoire pour un habitué');
    await ctx.close();
  }

  // ============ 11. Pages de texte, 404, Espace Antonio ============
  {
    const { ctx, page } = await ctxPage(browser);
    for (const [f, h] of [['confidentialite.html', 'Politique de confidentialité'], ['conditions.html', 'Conditions générales']]) {
      const res = await page.goto(APP + f); await page.waitForTimeout(200);
      ok(res.status() === 200 && (await txt(page, 'h1')) === h, f + ' : page servie');
      ok(await has(page, 'link[rel="canonical"][href$="' + f + '"]') && (await page.$eval('meta[name="description"]', e => e.content.length)) > 80, f + ' : canonique et description');
      ok(!(await has(page, '#consent')), f + ' : pas de bandeau à l’arrivée');
      await audit(page, f.replace('.html', ''));
      if (f === 'confidentialite.html') {
        ok(/aucun outil de mesure d’audience n’est activé/.test(await txt(page, '#cookies')), 'la page dit qu’aucune mesure n’est active');
        await page.click('[data-consent-open]'); ok(await has(page, '#consent'), '« Modifier mon choix » ouvre le bandeau'); await audit(page, 'confidentialite-bandeau');
        await page.click('#consent [data-consent="yes"]');
        ok(/Vous avez accepté/.test(await txt(page, '[data-consent-state]')), 'état du choix affiché dans la page');
        ok(!(await has(page, '#cf-beacon')), 'sans jeton configuré, rien n’est chargé même après « Accepter »');
        await page.click('[data-consent-open]'); ok(await has(page, '#consent'), '« Modifier mon choix » rouvre le bandeau'); await page.click('#consent [data-consent="no"]');
        ok(/Vous avez refusé/.test(await txt(page, '[data-consent-state]')), 'changement d’avis pris en compte');
      }
      await page.evaluate(() => localStorage.clear());
    }
    const nf = await page.goto(APP + 'une-page-qui-n-existe-pas/encore'); await page.waitForTimeout(200);
    ok(nf.status() === 404 && /nulle part/.test(await txt(page, 'h1')), '404 personnalisée servie pour une adresse inconnue');
    ok((await page.$$('main .btn')).length === 1 && (await page.$eval('main .btn', e => e.getAttribute('href'))) === BASE_PATH + APP_DIR, '404 : un seul bouton, vers l’accueil');
    ok(await page.$eval('link[rel="stylesheet"]', e => e.sheet && e.sheet.cssRules.length > 50), '404 : styles chargés depuis une adresse profonde');
    await page.evaluate(() => { const b = document.getElementById('consent'); if (b) b.remove(); });
    await audit(page, '404');
    await page.click('main .btn'); await page.waitForTimeout(200); ok(await has(page, '.seuil'), '404 : le bouton ramène à l’accueil');
    await page.goto(APP + 'antonio/'); await page.waitForTimeout(200);
    ok(!(await has(page, '#consent')) && await has(page, 'meta[name="robots"][content*="noindex"]'), 'Espace Antonio : ni bandeau ni indexation');
    await audit(page, 'espace-antonio');
    await page.fill('#ans', 'court'); await page.click(A('answer')); ok(await has(page, '#err-ans') && (await page.$eval('#ans', e => e.value)) === 'court', 'Espace Antonio : réponse trop courte signalée sans effacer la saisie');
    await page.click(A('open', '[data-id="B"]')); await page.waitForTimeout(80); await audit(page, 'espace-antonio-parent');
    await page.click(A('send')); ok(await has(page, '#err-m1'), 'Espace Antonio : mot vide signalé');
    await ctx.close();
  }

  // ============ 12. Mesure d’audience : chargée seulement après accord (jeton simulé) ============
  {
    const { ctx, page } = await ctxPage(browser);
    let beacon = 0;
    await ctx.route('**/site.js*', async r => { const res = await r.fetch(); r.fulfill({ response: res, body: (await res.text()).replace('"token": ""', '"token": "JETON-DE-TEST"') }); });
    await ctx.route('https://static.cloudflareinsights.com/**', r => { beacon++; r.fulfill({ status: 200, contentType: 'application/javascript', body: '/* simulé */' }); });
    const before = errors.length;
    await page.goto(APP); await page.waitForTimeout(300);
    ok(beacon === 0, 'audience : rien avant le choix');
    ok(await has(page, '#consent'), 'audience : avec un outil branché, le bandeau revient à la première visite');
    await page.click('#consent [data-consent="no"]'); await page.waitForTimeout(200); ok(beacon === 0, 'audience : rien après « Refuser »');
    await page.evaluate(() => localStorage.removeItem('pepe-consent')); await page.reload(); await page.waitForTimeout(300);
    await page.click('#consent [data-consent="yes"]'); await page.waitForTimeout(300);
    ok(beacon === 1 && await has(page, '#cf-beacon[data-cf-beacon*="JETON-DE-TEST"]'), 'audience : chargée après « Accepter » (autorisée par la politique de sécurité)');
    await page.reload(); await page.waitForTimeout(300); ok(beacon === 2, 'audience : rechargée aux visites suivantes de qui a accepté');
    errors.splice(before, errors.length - before, ...errors.slice(before).filter(e => !/cloudflareinsights/.test(e)));
    await ctx.close();
  }

  // ============ 13. Largeurs d’écran : pas de défilement horizontal ============
  for (const w of [320, 360, 414, 768, 1280]) {
    const { ctx, page } = await ctxPage(browser, { viewport: { width: w, height: 800 } });
    await page.goto(APP); await page.waitForTimeout(150); await audit(page, 'accueil-' + w);
    await page.click(A('peek-plans')); await audit(page, 'formules-' + w); await page.click(A('back')); await page.waitForTimeout(150);
    await page.click(A('peek-about')); await page.waitForTimeout(150); await audit(page, 'histoire-' + w); await page.click(A('back')); await page.waitForTimeout(150);
    await page.goto(APP + 'fiches/quand-il-ou-elle-vit-ailleurs/'); await page.waitForTimeout(150); await audit(page, 'fiche-publique-' + w);
    await page.goto(APP + 'fiches/'); await page.waitForTimeout(150); await audit(page, 'fiches-' + w);
    await page.goto(APP); await page.waitForTimeout(150);
    await page.click('.seuil ' + A('porte', '[data-v="souffle"]')); await page.waitForTimeout(150); await audit(page, 'souffle-' + w); await page.click(A('back')); await page.waitForTimeout(200);
    await page.click(A('porte', '[data-v="deposer"]')); await page.waitForTimeout(100); await audit(page, 'deposer-' + w); await page.click(A('back')); await page.waitForTimeout(200);
    // « Retour » a ramené à la vitrine, celle d'un parent déjà entré : on la contrôle à cette largeur, puis « Ouvrir mon espace »
    await audit(page, 'vitrine-parent-' + w); await page.click('.seuil ' + A('entrer', '[data-v="today"]')); await page.waitForTimeout(250);
    await page.click('.card.perso ' + A('onboard')); await audit(page, 'entree-' + w); await page.click(A('ob-done')); await page.waitForTimeout(100); await audit(page, 'aujourdhui-' + w);
    await page.click('.tab' + A('go', '[data-view="parcours"]')); await audit(page, 'parcours-' + w);
    await page.click('.tab' + A('go', '[data-view="kit"]')); await audit(page, 'outils-' + w);
    await page.click('.tab' + A('go', '[data-view="me"]')); await audit(page, 'moi-' + w);
    await page.goto(APP + 'confidentialite.html'); await page.waitForTimeout(100); await audit(page, 'confidentialite-' + w);
    await page.goto(APP + 'antonio/'); await page.waitForTimeout(100); await audit(page, 'espace-antonio-' + w);
    await ctx.close();
  }

  // ============ 14. Détresse : l’aide reste affichée, avec des numéros cliquables ============
  {
    const { ctx, page } = await ctxPage(browser);
    await page.goto(APP); await page.waitForTimeout(150);
    await page.click('.seuil ' + A('porte', '[data-v="deposer"]')); await page.waitForTimeout(150);
    await page.fill('#draft', 'Je n’ai plus envie de vivre comme ça, je suis épuisée.'); await page.click(A('dsend')); await page.waitForTimeout(250);
    ok(/143/.test((await txt(page, '.toast')) || ''), 'détresse : message immédiat avec le 143');
    await audit(page, 'aujourdhui-detresse');
    await page.waitForTimeout(3400);
    const tels = await page.$$eval('.mirror a.tel', a => a.map(e => e.getAttribute('href')));
    ok(!(await has(page, '.toast')) && tels.includes('tel:143') && tels.includes('tel:144'), 'détresse : l’aide reste affichée sous le dépôt, numéros cliquables');
    ok((await store(page, 'pepe-v1')).depots[0].risk === true && !(await store(page, 'pepe-v1')).depots[0].pistes && !(await has(page, '.pistes-depot')), 'détresse : mémorisée avec le dépôt, et aucune fiche n’est proposée à la place de l’aide');
    await page.reload(); await page.waitForTimeout(300);
    ok(!!(await page.$('main.deposer')) && (await page.$$eval('.mirror a.tel', a => a.length)) >= 2, 'détresse : la page rechargée par le téléphone retrouve le même écran, et l’aide est toujours là');
    await page.goto(APP); await page.waitForTimeout(300);
    ok((await page.$$eval('.depot-jour .mirror a.tel', a => a.length)) >= 2, 'détresse : à la visite suivante, l’aide est aussi sur « Aujourd’hui »');
    await page.click('.tab' + A('go', '[data-view="me"]')); await page.click(A('go', '[data-view="depots"]')); await page.waitForTimeout(80);
    ok((await page.$$eval('.depots .mirror a.tel', a => a.length)) >= 2, 'détresse : l’aide figure aussi dans « Mes dépôts »');
    await ctx.close();
  }
  await browser.close();

  // ============ Bilan ============
  const byRule = {};
  for (const v of viol) { const k = v.id; byRule[k] = byRule[k] || { impact: v.impact, help: v.help, n: 0, views: new Set(), t: [] }; byRule[k].n += v.n; byRule[k].views.add(v.view); if (byRule[k].t.length < 6) byRule[k].t.push('[' + v.view + '] ' + v.t[0]); }
  const views = new Set(viol.map(v => v.view));
  console.log('\n=== accessibilité (axe) : ' + Object.keys(byRule).length + ' règle(s) en défaut, sur ' + views.size + ' écran(s) ===');
  for (const k of Object.keys(byRule)) { const r = byRule[k]; console.log('  ✗ ' + k + ' (' + r.impact + ') ×' + r.n + ' — ' + r.help + ' — écrans : ' + [...r.views].slice(0, 8).join(', ') + (r.views.size > 8 ? '…' : '')); if (AXE_DETAILS) for (const t of r.t) console.log('      ' + t); }
  const inc = {}; for (const i of incomplete) for (const t of i.t) inc[t] = (inc[t] || 0) + 1;
  console.log('=== contraste non calculable automatiquement (texte sur image), à vérifier à l’œil : ' + Object.keys(inc).length + ' sélecteur(s) ===');
  if (AXE_DETAILS) console.log('  ' + Object.keys(inc).join('\n  '));
  console.log('=== défilement horizontal : ' + (overflow.length ? overflow.join(' | ') : 'aucun') + ' ===');
  console.log('=== erreurs console / réseau : ' + (errors.length ? '\n  ' + [...new Set(errors)].join('\n  ') : 'aucune') + ' ===');
  console.log('\n' + passes + ' vérifications réussies, ' + fails + ' en échec');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
