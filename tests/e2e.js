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
    ok(/<h1>Parent Écouté,<br>Parent Éclairé<\/h1>/.test(raw) && /class="herobg"[^>]*alt="[^"]{20,}"/.test(raw), 'accueil écrit dans le HTML (titre + image avec texte alternatif)');
    ok(/<title>[^<]{20,70}<\/title>/.test(raw) && /<meta name="description" content="[^"]{80,180}">/.test(raw), 'titre et description meta');
    ok(new RegExp('<link rel="canonical" href="' + reEsc(PUBLIC_APP) + '">').test(raw), 'adresse canonique');
    ok(new RegExp('og:image" content="' + reEsc(PUBLIC_APP) + 'img\\/apercu\\.jpg"').test(raw) && /twitter:card" content="summary_large_image"/.test(raw), 'balises d’aperçu social');
    ok(/rel="icon" href="favicon\.ico"/.test(raw) && /rel="icon" href="favicon\.svg"/.test(raw) && /apple-touch-icon/.test(raw) && /rel="manifest"/.test(raw), 'favicon, icône Apple, manifest');
    ok(/Content-Security-Policy/.test(raw) && /upgrade-insecure-requests/.test(raw), 'politique de sécurité (CSP) avec passage forcé en HTTPS');
    ok(!/fonts\.googleapis|gstatic/.test(raw), 'plus aucun appel à Google Fonts');
    ok(/class="voice[^>]*>.*accueilli dans une famille\..*travailleur social depuis mes 19 ans.*Lire mon histoire/s.test(raw), 'le mot d’Antonio est écrit dans la page (lisible sans JavaScript)');
    ok(!/[:;—]/.test((raw.match(/<section class="voice[\s\S]*?<\/section>/) || ['x:'])[0].replace(/<[^>]+>/g, ' ')), 'le mot d’Antonio se lit comme on parle, sans deux-points, point-virgule ni tiret long');
    for (const f of ['', 'app.js', 'confidentialite.html', 'conditions.html', 'antonio/', 'antonio/antonio.js', 'manifest.webmanifest']) ok(!/éducateur social/.test(await (await ctx.request.get(APP + f)).text()), '« éducateur social » ne figure plus dans ' + (f || 'index.html'));
    await page.goto(APP); await page.waitForTimeout(300);
    ok(await has(page, '#consent'), 'bandeau de consentement affiché à la première visite');
    ok((await page.$$('#consent button')).length === 2, 'bandeau : deux boutons de même poids');
    await audit(page, 'accueil-bandeau');
    ok(!(await has(page, '#cf-beacon')), 'aucun outil d’audience chargé avant le choix');
    await page.click('#consent [data-consent="no"]');
    ok(!(await has(page, '#consent')), 'bandeau fermé après « Refuser »');
    const c = await store(page, 'pepe-consent'); ok(c && c.audience === false && c.v === 1, 'refus mémorisé');
    ok(await page.evaluate(() => document.cookie === ''), 'aucun cookie déposé');
    await audit(page, 'accueil');
    ok((await page.$$('.herofull ' + A('onboard'))).length === 1 && (await page.$$eval(A('onboard'), L => L.length === 3 && L.every(b => b.textContent.trim() === 'Commencer gratuitement'))) && (await page.$$eval('.btn.primary', L => L.filter(b => b.dataset.act !== 'onboard').every(b => !!b.closest('.sch')))), 'un seul appel à l’action (le même bouton en haut, en bas et en flottant), et le seul autre bouton plein est celui du schéma');
    // aperçu des formules sans s’inscrire
    await page.click(A('peek-plans')); await page.waitForTimeout(100);
    ok((await txt(page, 'h1')) === 'Les formules' && await has(page, 'table.cmp caption'), 'formules consultables depuis l’accueil');
    await audit(page, 'formules-apercu');
    await page.click(A('back')); ok(await has(page, '.herofull'), 'retour à l’accueil');
    await page.click(A('peek-about')); await page.waitForTimeout(200);
    ok(/^Avant d’accompagner des familles/.test(await txt(page, 'h1')) && /#histoire$/.test(page.url()) && /^Mon histoire/.test(await page.title()), '« Lire mon histoire » ouvre la page, avec son adresse et son titre');
    ok(!/[:;—]/.test(await page.$eval('.story', e => e.innerText)) && !/[:;—]/.test(await page.$eval('.band.story h1', e => e.innerText)), 'l’histoire se lit comme on parle, sans deux-points, point-virgule ni tiret long');
    ok((await page.$$('.places li')).length === 3 && (await page.$$('.verbs li')).length === 3 && (await txt(page, '.verbs li:nth-child(2)')).replace(/\s+/g, ' ') === 'Apprendre avec la différence', 'trois places, trois verbes');
    ok((await page.$$('main .btn.primary')).length === 1 && await has(page, 'main ' + A('onboard')), 'histoire : un seul bouton d’action avant inscription');
    await audit(page, 'histoire-apercu');
    await page.click(A('back')); await page.waitForTimeout(150);
    ok(await has(page, '.herofull') && !/#/.test(page.url()) && !/^Mon histoire/.test(await page.title()), 'retour à l’accueil : adresse et titre rétablis');
    await page.click(A('peek-about')); await page.waitForTimeout(200); await page.goBack(); await page.waitForTimeout(250);
    ok(await has(page, '.herofull') && !(await has(page, '.places')), 'le bouton Retour du téléphone ramène à l’accueil');
    await page.reload(); await page.waitForTimeout(200);
    ok(!(await has(page, '#consent')), 'bandeau non réaffiché après rechargement');

    // ============ 2. Questionnaire d’entrée ============
    await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(150);
    ok(await has(page, '.sheet[role="dialog"]'), 'feuille « Faisons connaissance » ouverte');
    ok(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('sheet')), 'le focus va sur la feuille, pas dans le champ (pas de clavier qui s’ouvre)');
    await audit(page, 'questionnaire-entree');
    await page.fill('#ob-me', '  Camille  ');
    await page.$eval('.sheet', s => { s.scrollTop = 60; });
    await page.click(A('ob', '[data-k="age"][data-v="a"]'));
    ok(await page.$eval('#ob-me', e => e.value) === '  Camille  ', 'le prénom saisi survit au choix d’une pastille');
    ok(await page.$eval(A('ob', '[data-k="age"][data-v="a"]'), e => e.getAttribute('aria-pressed') === 'true' && document.activeElement === e), 'pastille cochée et focus conservé');
    ok(!(await has(page, '.sheet.in')), 'la feuille ne se ré-anime pas à chaque appui');
    await page.click(A('obw', '[data-v="fatigue"]'));
    await page.click(A('ob-done')); await page.waitForTimeout(150);
    const d1 = await store(page, 'pepe-v1'); ok(d1.onboarded && d1.me === 'Camille' && d1.age === 'a' && d1.weights.includes('fatigue'), 'entrée enregistrée (prénom nettoyé)');
    ok(/, Camille\./.test(await txt(page, 'h1')), 'accueil du jour personnalisé');

    // ============ 3. Aujourd’hui : validation du dépôt ============
    await audit(page, 'aujourdhui');
    await page.click(A('dsend'));
    ok(await has(page, '#err-draft[role="alert"]') && await page.$eval('#draft', e => e.getAttribute('aria-invalid') === 'true' && document.activeElement === e), 'dépôt vide : message sous le champ, champ signalé et sélectionné');
    await audit(page, 'aujourdhui-erreur');
    await page.type('#draft', 'Ce');
    ok(!(await has(page, '#err-draft')), 'le message disparaît dès qu’on écrit');
    ok(await page.$eval('#draft', e => e.maxLength === 4000), 'longueur maximale posée sur le champ');
    await page.fill('#draft', 'x'.repeat(3700)); await page.dispatchEvent('#draft', 'input');
    ok(/3700 \/ 4000/.test(await txt(page, '#draft-count')), 'compteur affiché à l’approche de la limite');
    await page.fill('#draft', 'Ce soir j’ai crié et je m’en veux. Je suis épuisé.');
    await page.click(A('dsend')); await page.waitForTimeout(200);
    const d2 = await store(page, 'pepe-v1'); ok(d2.depots.length === 1 && d2.depots[0].question && d2.depots[0].lumiere, 'dépôt gardé, question et lumière reçues');
    ok(await has(page, '.mirror .q') && (await page.$eval('#draft', e => e.value)) === '', 'réponse affichée, champ vidé');
    await audit(page, 'aujourdhui-depot');

    // ============ 4. Questionnaire de départ (Mon évolution) ============
    await page.click('button.card' + A('go', '[data-view="evo"]')); await page.waitForTimeout(100);
    await audit(page, 'evolution');
    await page.click(A('evosave')); await page.waitForTimeout(150);
    ok((await store(page, 'pepe-v1')).evo.t1 && /Camille/.test(await txt(page, 'h1')), 'point de départ enregistré, retour à l’accueil');

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
    await page.click(A('back'));

    // ============ 6. Boîte à outils ============
    await page.click('.tab' + A('go', '[data-view="kit"]')); await page.waitForTimeout(100);
    ok((await page.$$('.sits .sit')).length === 22, '22 situations');
    await audit(page, 'outils-situations');
    await page.click('.sits .sit'); await page.waitForTimeout(100); await audit(page, 'situation'); await page.click(A('back'));
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
      await page.click(A('back')); }

    // ============ 7. SOS ============
    await page.click('.sos'); await page.waitForTimeout(100);
    const sos = await page.$$eval('.emg a.tel', a => a.map(e => e.getAttribute('href'))); ok(sos.join() === 'tel:144,tel:117,tel:143', 'SOS : 144, 117 et 143 cliquables');
    await audit(page, 'sos');
    await page.click('.sosview .back');

    // ============ 8. Moi, données, formules ============
    await page.click('.tab' + A('go', '[data-view="me"]')); await page.waitForTimeout(100);
    ok(await has(page, '.menu-list a[href="confidentialite.html"]') && await has(page, '.menu-list a[href="conditions.html"]'), 'liens vers les pages légales dans « Moi »');
    await audit(page, 'moi');
    await page.click(A('go', '[data-view="depots"]')); await audit(page, 'mes-depots'); await page.click(A('back'));
    await page.click(A('go', '[data-view="data"]')); await page.waitForTimeout(60);
    ok(/refusé la mesure/.test(await txt(page, '#main')), 'le choix de consentement est rappelé dans « Vos données »');
    await page.click(A('consent', '[data-v="yes"]')); ok((await store(page, 'pepe-consent')).audience === true, 'choix modifiable depuis l’app');
    await page.click(A('consent', '[data-v="no"]'));
    await page.click(A('reset')); await audit(page, 'donnees-confirmation'); await page.click(A('reset-no'));
    await page.click(A('back'));
    ok(/L’histoire d’Antonio/.test(await txt(page, '.menu-list')), 'entrée « L’histoire d’Antonio » dans « Moi »');
    await page.click(A('go', '[data-view="about"]')); await page.waitForTimeout(200); await page.$eval('img.medal', i => i.scrollIntoView()); await page.waitForFunction(() => { const i = document.querySelector('img.medal'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 5000 }).catch(() => {});
    ok(await page.$eval('img.medal', e => e.alt.length > 20 && e.complete && e.naturalWidth > 0), 'image du logo avec texte alternatif, chargée');
    ok((await page.$$('main .btn.primary')).length === 0 && await has(page, '.bar .back') && await has(page, '.tabs'), 'histoire depuis « Moi » : pas de bouton d’inscription, barre et onglets présents');
    await page.evaluate(() => scrollTo(0, 0)); await audit(page, 'histoire'); await page.click(A('back')); await page.waitForTimeout(100);
    ok(/Camille|Moi/.test(await txt(page, 'h1')) && !/#histoire/.test(page.url()), 'retour à « Moi », adresse rétablie');
    await page.click(A('go', '[data-view="plans"]')); await page.waitForTimeout(60); await audit(page, 'formules');
    await page.click(A('tier', '[data-v="antonio"]')); await page.waitForTimeout(100);

    // ============ 9. Avec Antonio : démonstration honnête ============
    await page.click('.tab' + A('go', '[data-view="today"]')); await page.waitForTimeout(100);
    ok(/exemple/.test(await txt(page, '.letter')) && /Démonstration/.test(await txt(page, '.letter')), 'mot d’Antonio présenté comme un exemple');
    await audit(page, 'aujourdhui-antonio');
    await page.click('.tab' + A('go', '[data-view="me"]')); await page.click(A('go', '[data-view="antonio"]')); await page.waitForTimeout(80);
    ok(/rien n’est transmis à Antonio/.test(await txt(page, '.demo-note')), 'avertissement de démonstration');
    await page.fill('#qdraft', 'court'); await page.click(A('qsend')); ok(await has(page, '#err-qdraft'), 'question trop courte : message sous le champ');
    await audit(page, 'antonio-erreur');
    await page.fill('#qdraft', 'Il refuse d’aller à l’école le matin, je fais quoi ?'); await page.click(A('qsend')); await page.waitForTimeout(100);
    ok(/non transmise/.test(await txt(page, '.qa .st')) && /pas transmise/.test(await txt(page, '.toast')), 'question gardée sur l’appareil, dite non transmise');
    await audit(page, 'antonio');
    await page.click('.letter'); await page.waitForTimeout(60); await audit(page, 'mot-exemple');

    // ============ 10. Retour d’un habitué, puis remise à zéro ============
    await page.goto(APP); await page.waitForTimeout(250);
    ok(await page.evaluate(() => document.documentElement.classList.contains('returning')) && /Camille/.test(await txt(page, 'h1')) && !(await has(page, '.herofull')), 'habitué : arrive directement sur « Aujourd’hui »');
    await page.goto(APP + '?nouveau'); await page.waitForTimeout(250);
    ok(await has(page, '.herofull') && (await store(page, 'pepe-v1')) === null && !/nouveau/.test(page.url()), '?nouveau : repart de zéro');
    await ctx.close();
  }

  // ============ 10 bis. L'histoire par son adresse directe (lien partagé) ============
  {
    const { ctx, page } = await ctxPage(browser);
    await page.goto(APP + '#histoire'); await page.waitForTimeout(350);
    ok(/^Avant d’accompagner/.test(await txt(page, 'h1')) && !(await has(page, '.herofull')) && await page.evaluate(() => document.documentElement.classList.contains('returning')), 'lien direct vers l’histoire : la page s’ouvre dessus, sans passer par l’accueil');
    await page.click('#consent [data-consent="no"]');
    await page.click('main ' + A('onboard')); await page.waitForTimeout(150);
    ok(await has(page, '.sheet[role="dialog"]'), 'depuis l’histoire, le bouton ouvre « Faisons connaissance »');
    await page.click(A('ob-done')); await page.waitForTimeout(200);
    ok(/\.$/.test(await txt(page, 'h1')) && await has(page, '.tabs') && !/#histoire/.test(page.url()), 'après l’entrée : « Aujourd’hui », adresse rétablie');
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
      ok(await has(page, '#consent'), f + ' : bandeau présent');
      await audit(page, f.replace('.html', '') + '-bandeau');
      await page.click('#consent [data-consent="yes"]');
      await audit(page, f.replace('.html', ''));
      if (f === 'confidentialite.html') {
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
    await page.click('main .btn'); await page.waitForTimeout(200); ok(await has(page, '.herofull'), '404 : le bouton ramène à l’accueil');
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
    await page.click('#consent [data-consent="no"]');
    await page.click(A('peek-plans')); await audit(page, 'formules-' + w); await page.click(A('back'));
    await page.click(A('peek-about')); await page.waitForTimeout(150); await audit(page, 'histoire-' + w); await page.click(A('back')); await page.waitForTimeout(80);
    await page.click('.herofull ' + A('onboard')); await audit(page, 'entree-' + w); await page.click(A('ob-done')); await page.waitForTimeout(100); await audit(page, 'aujourdhui-' + w);
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
    await page.goto(APP); await page.waitForTimeout(150); await page.click('#consent [data-consent="no"]');
    await page.click('.herofull ' + A('onboard')); await page.click(A('ob-done')); await page.waitForTimeout(100);
    await page.fill('#draft', 'Je n’ai plus envie de vivre comme ça.'); await page.click(A('dsend')); await page.waitForTimeout(250);
    ok(/143/.test((await txt(page, '.toast')) || ''), 'détresse : message immédiat avec le 143');
    await audit(page, 'aujourdhui-detresse');
    await page.waitForTimeout(3400);
    const tels = await page.$$eval('.mirror a.tel', a => a.map(e => e.getAttribute('href')));
    ok(!(await has(page, '.toast')) && tels.includes('tel:143') && tels.includes('tel:144'), 'détresse : l’aide reste affichée sous le dépôt, numéros cliquables');
    ok((await store(page, 'pepe-v1')).depots[0].risk === true, 'détresse : mémorisée avec le dépôt');
    await page.reload(); await page.waitForTimeout(300);
    ok((await page.$$eval('.mirror a.tel', a => a.length)) >= 2, 'détresse : l’aide est toujours là après rechargement');
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
