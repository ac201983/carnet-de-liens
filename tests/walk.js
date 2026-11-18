// Parcourt tous les écrans du site (app, pages de texte, 404, Espace Antonio) et appelle visit(nom) sur chacun.
// PEPE_ORIGIN, PEPE_BASE et PEPE_APPDIR permettent de vérifier une autre version du site (par exemple celle de parent-ecoute.ch, servie à la racine).
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8443';
const BASE = ORIGIN + (process.env.PEPE_BASE || '/carnet-de-liens/');
const APP = BASE + (process.env.PEPE_APPDIR !== undefined ? process.env.PEPE_APPDIR : 'parent-ecoute/');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;

async function walk(page, visit) {
  const w = ms => page.waitForTimeout(ms);
  const tab = v => page.click('.tab' + A('go', `[data-view="${v}"]`));
  // ----- accueil
  await page.goto(APP); await w(300);
  // le bandeau de consentement ne s'affiche que si un outil de mesure est branché
  if (await page.$('#consent')) { await visit('accueil-bandeau'); await page.click('#consent [data-consent="no"]'); }
  // le bouton flottant de l'accueil passe par-dessus le texte, comme tout bouton fixe : on le retire le temps de regarder la page (tests/accueil.js le vérifie à part)
  const masque = await page.addStyleTag({ content: '.cta-flot{display:none!important}' });
  await visit('accueil');
  // l'accueil est une longue page : chaque chapitre est visité à l'écran (en haut, puis en bas s'il dépasse), le schéma déroulé jusqu'au bout, les volets ouverts
  { const nb = await page.$$eval('main.intro>section', L => L.length);
    for (let i = 0; i < nb; i++) {
      const [haut, parcours] = await page.evaluate(k => { const s = document.querySelectorAll('main.intro>section')[k]; s.scrollIntoView({ block: 'start' }); return [s.getBoundingClientRect().height > innerHeight, s.classList.contains('acc-parcours')]; }, i); await w(220);
      if (parcours) { for (let k = 0; k < 8 && await page.$(A('schnext')); k++) { await page.click(A('schnext')); await w(60); } await page.evaluate(() => document.querySelectorAll('main.intro details').forEach(d => { d.open = true; })); await w(80); }
      await visit('accueil-chapitre-' + (i + 1));
      if (haut) { await page.evaluate(k => document.querySelectorAll('main.intro>section')[k].scrollIntoView({ block: 'end' }), i); await w(220); await visit('accueil-chapitre-' + (i + 1) + '-bas'); }
    }
    await page.evaluate(() => { document.querySelector('.acc-faq').scrollIntoView({ block: 'start' }); document.querySelectorAll('main.intro details').forEach(d => { d.open = true; }); }); await w(200); await visit('accueil-questions-ouvertes');
    await masque.evaluate(e => e.remove()); await page.evaluate(() => scrollTo(0, 0)); await w(250); }
  await page.click(A('peek-plans')); await w(80); await visit('formules-apercu'); await page.click(A('back')); await w(200);
  await page.click(A('peek-about')); await w(150); await visit('histoire-apercu'); await page.click(A('back')); await w(200);
  // le SOS, ouvert par un visiteur
  await page.click('.herofull .sos'); await w(100); await visit('sos-visiteur'); await page.click('.sosview .back'); await w(200);
  // ----- les pages publiques : la liste des situations, puis une fiche reçue par lien direct (haut, bas, lien copié)
  await page.goto(APP + 'fiches/'); await w(250); await visit('fiches-publiques');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(150); await visit('fiches-publiques-bas');
  await page.goto(APP + 'fiches/quand-il-ou-elle-vit-ailleurs/'); await w(250); await visit('fiche-publique');
  await page.$eval('.partage', e => e.scrollIntoView({ block: 'center' })); await w(120); await page.click(A('partager')); await w(250); await visit('fiche-publique-envoyer');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(3300); await visit('fiche-publique-bas');
  await page.click('.proches .sit'); await w(250); await visit('fiche-publique-suivante');
  await page.click('.pubbar .wordmark'); await w(300);
  // ----- le premier geste : souffler (en cours, arrêté), puis « Aujourd'hui » tel que le découvre un nouveau parent
  await page.click('.herofull ' + A('porte', '[data-v="souffle"]')); await w(300); await visit('souffle-debut');
  await w(1900); await visit('souffle-inspirez');
  // « Écouter l'étang » : le bouton pendant que le son joue, puis de nouveau en silence
  await page.click('.son-souffle'); await w(800); await visit('souffle-son'); await page.click('.son-souffle'); await w(200);
  await w(3100); await visit('souffle-expirez');
  // « Changer de respiration » : le choix ouvert pendant l'exercice, puis « À mon rythme » avec sa cadence
  await page.click('.resp-l'); await w(250); await visit('souffle-choix');
  await page.click('.resp-o[data-v="libre"]'); await w(200); await visit('souffle-choix-rythme');
  await page.click('.resp-o[data-v="long"]'); await w(100); await page.click(A('resp-ferme')); await w(150);
  await page.click(A('souffle-stop')); await w(100); await visit('souffle-pret');
  await page.click('.resp-l'); await w(250); await visit('souffle-pret-choix'); await page.click(A('back')); await w(300);
  await page.click('.herofull ' + A('porte', '[data-v="souffle"]')); await w(300); await page.click(A('souffle-stop')); await w(150);
  // « Retour » ramène à la vitrine, celle d'un parent déjà entré, qui propose « Ouvrir mon espace »
  await page.click(A('back')); await w(300); await visit('vitrine-parent');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(3300); await visit('vitrine-parent-bas'); await page.evaluate(() => scrollTo(0, 0)); await w(150);
  await page.click('.herofull ' + A('entrer', '[data-v="today"]')); await w(250); await visit('aujourdhui-nouveau');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('aujourdhui-nouveau-bas'); await page.evaluate(() => scrollTo(0, 0));
  // « Prendre un instant », sous la dose : le bouton pendant l'écoute
  await page.$eval('.son-dose', e => e.scrollIntoView({ block: 'center' })); await w(150); await page.click('.son-dose'); await w(800); await visit('aujourdhui-instant'); await page.click('.son-dose'); await w(200); await page.evaluate(() => scrollTo(0, 0));
  await page.click('.dose ' + A('voix')); await w(150); await visit('qui-parle'); await page.keyboard.press('Escape'); await w(100);
  await page.click('.card.perso ' + A('onboard')); await w(150); await visit('entree');
  await page.fill('#ob-me', 'Camille'); await page.click(A('ob', '[data-k="age"][data-v="a"]')); await page.click(A('obw', '[data-v="fatigue"]')); await visit('entree-remplie');
  await page.click(A('ob-done')); await w(150); await visit('aujourdhui');
  // ----- déposer
  await page.click('.portes ' + A('porte', '[data-v="deposer"]')); await w(200); await visit('deposer');
  await page.click(A('dsend')); await visit('deposer-erreur');
  await page.fill('#draft', 'Ce soir j’ai crié et je m’en veux. Je suis épuisé, et il ne veut pas dormir.'); await page.click(A('dsend')); await w(250); await visit('deposer-reponse');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(3300); await visit('deposer-reponse-bas'); await page.evaluate(() => scrollTo(0, 0));
  await page.fill('#draft', 'Je n’ai plus envie de vivre comme ça.'); await page.click(A('dsend')); await w(250); await visit('deposer-detresse');
  await page.click(A('back')); await w(250); await visit('aujourdhui-depot');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(3300); await visit('aujourdhui-depot-bas'); await page.evaluate(() => scrollTo(0, 0));
  // la porte « Une piste », depuis « Aujourd'hui » : les situations du moment d'abord, la boîte à outils entière en dessous
  await w(150); await page.click('.portes ' + A('porte', '[data-v="piste"]')); await w(300); await visit('piste-du-moment');
  await tab('parcours'); await w(100);
  await page.click('.quick ' + A('go', '[data-view="evo"]')); await w(100); await visit('evolution');
  await page.click(A('evosave')); await w(300); await visit('parcours-apres-depart');
  // ----- parcours (Découverte)
  await tab('parcours'); await w(100); await visit('parcours');
  await page.click(A('step', '[data-i="5"]')); await w(100); await visit('feuille-formule'); await page.keyboard.press('Escape');
  await page.click(A('step', '[data-i="0"]')); await w(100); await visit('etape');
  // le schéma avance à la demande, puis le carnet de route se remplit
  for (let k = 0; k < 8 && await page.$(A('schnext')); k++) { await page.click(A('schnext')); await w(60); }
  await visit('etape-schema');
  await page.fill('#note', 'Je commence ce parcours parce que je veux souffler un peu.'); await w(500); await visit('etape-carnet');
  await page.click(A('back')); await w(150);
  await page.click('.quick ' + A('go', '[data-view="carnet"]')); await w(80); await visit('carnet');
  // le final, « Mon chemin », ouvert depuis le carnet
  await page.click('main ' + A('go', '[data-view="final"]')); await w(200); await visit('final'); await page.click(A('back')); await w(80);
  await page.click(A('back')); await w(150);
  await page.click('.quick ' + A('go', '[data-view="evo"]')); await w(80); await visit('evolution-chemin'); await page.click(A('back')); await w(150);
  // ----- boîte à outils
  await tab('kit'); await w(100); await visit('outils-situations');
  await page.click(A('age', '[data-v="g"]')); await w(80); await visit('outils-situations-adulte'); await page.click(A('age', '[data-v="all"]')); await w(80);
  await page.fill('#q', 'zzz'); await w(400); await visit('outils-recherche-vide'); await page.fill('#q', ''); await w(400);
  await page.click('.sits .sit'); await w(150); await visit('situation');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(150); await visit('situation-bas'); await page.click(A('back')); await w(200);
  await page.click(A('kit', '[data-v="tools"]')); await visit('outils-minuteur');
  for (const t of ['ft', 'routine', 'abc', 'phr']) {
    await page.click(A('tool', `[data-v="${t}"]`)); await w(60);
    if (t === 'routine') await page.click(A('rdone', '[data-i="0"]'));
    if (t === 'abc') { await page.click(A('abcadd')); await visit('outils-abc-erreur'); await page.fill('#a2', 'Cris pendant dix minutes'); await page.click(A('abcadd')); }
    if (t === 'phr') { await page.fill('#ph', 'On respire comme le dragon'); await page.click(A('phadd')); await page.fill('#ph', 'On respire comme le dragon'); await page.click(A('phadd')); }
    await visit('outils-' + t);
    if (t === 'ft') {
      await page.click(A('ftg', '[data-v="soir"]')); await w(60); await page.click(A('ftset', '[data-id="dents"]')); await page.click(A('ftset', '[data-id="histoire"]')); await w(120); await visit('outils-ft-rempli');
      await page.click(A('ftg', '[data-v="tout"]')); await w(200); await visit('outils-ft-tout');
    }
  }
  await page.click(A('kit', '[data-v="me"]')); await visit('outils-pour-moi');
  for (const x of ['breath', 'trois', 'deposer', 'droit', 'minute', 'appeler']) {
    await page.click(A('exo', `[data-id="${x}"]`)); await w(60);
    if (x === 'trois') await page.click(A('threeadd'));
    await visit('exo-' + x); await page.click(A('back')); await w(200);
  }
  // ----- SOS
  await page.click('.sos'); await w(100); await visit('sos'); await page.click('.sosview .back'); await w(200);
  // ----- moi
  await tab('me'); await w(100); await visit('moi');
  await page.click(A('go', '[data-view="depots"]')); await w(80); await visit('mes-depots'); await page.click(A('back')); await w(200);
  await page.click(A('go', '[data-view="data"]')); await w(60); await visit('donnees');
  await page.click(A('reset')); await visit('donnees-confirmation'); await page.click(A('reset-no')); await page.click(A('back')); await w(200);
  await page.click(A('go', '[data-view="about"]')); await w(150); await page.$eval('img.medal', i => i.scrollIntoView()); await page.waitForFunction(() => { const i = document.querySelector('img.medal'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 5000 }).catch(() => {}); await page.evaluate(() => scrollTo(0, 0)); await visit('histoire'); await page.click(A('back')); await w(80);
  await page.click(A('go', '[data-view="plans"]')); await w(60); await visit('formules');
  // ----- formule « Le parcours »
  await page.click(A('tier', '[data-v="parcours"]')); await w(120); await visit('formules-parcours');
  await tab('parcours'); await w(80); await visit('parcours-ouvert');
  // une étape qui n'est pas encore ouverte : un message, et l'écran ne change pas
  await page.click(A('step', '[data-i="1"]')); await w(80); await visit('parcours-attente');
  // l'aperçu d'Antonio (cinq touches sur le titre « Moi ») ouvre tout
  await tab('me'); await w(80); for (let k = 0; k < 5; k++) await page.click('h1' + A('atelier')); await w(80); await visit('moi-apercu');
  await tab('parcours'); await w(80); await visit('parcours-apercu');
  await page.click(A('step', '[data-i="1"]')); await w(80); await visit('etape-vecu');
  for (let k = 0; k < 8 && await page.$(A('schnext')); k++) { await page.click(A('schnext')); await w(60); }
  await visit('etape-vecu-schema'); await page.click(A('back')); await w(150);
  for (const i of [2, 3]) { await page.click(A('step', `[data-i="${i}"]`)); await w(80); for (let k = 0; k < 8 && await page.$(A('schnext')); k++) { await page.click(A('schnext')); await w(60); } await visit('etape-schema-' + (i + 1)); await page.click(A('back')); await w(150); }
  // le mois 2 et l'étape du MDH-PPH : chaque étape, son schéma déroulé jusqu'au bout, et la carte « La prochaine étape »
  for (const i of [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]) { await page.click(A('step', `[data-i="${i}"]`)); await w(80); for (let k = 0; k < 8 && await page.$(A('schnext')); k++) { await page.click(A('schnext')); await w(60); } await visit('etape-schema-' + (i + 1)); await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('etape-suite-' + (i + 1)); await page.click(A('back')); await w(150); }
  await page.click(A('step', '[data-i="9"]')); await w(80); await visit('etape-ouverte'); await page.click(A('back')); await w(150);
  await page.click(A('step', '[data-i="11"]')); await w(80); await visit('etape-rappel'); await page.click(A('back')); await w(150);
  await page.click(A('step', '[data-i="23"]')); await w(80); await visit('etape-derniere'); await page.click(A('back')); await w(150);
  await page.click('.quick ' + A('go', '[data-view="photo"]')); await w(80); await visit('photolangage-choix');
  await page.click(A('photopick', '[data-id="chemin"]')); await w(250); await visit('photolangage-photo');
  await page.fill('#ptext', 'Un chemin qui monte, mais avec de la lumière au bout.'); await page.click(A('photosave')); await w(80); await visit('photolangage');
  await page.click(A('photoback')); await w(250); await visit('photolangage-changer'); await page.click(A('photopick', '[data-id="chemin"]')); await w(250);
  if (await page.$(A('back'))) await page.click(A('back')); await w(150);
  // ----- formule « Avec Antonio »
  await tab('me'); await page.click(A('go', '[data-view="plans"]')); await page.click(A('tier', '[data-v="antonio"]')); await w(120);
  await tab('today'); await w(100); await visit('aujourdhui-antonio');
  await tab('me'); await visit('moi-antonio'); await page.click(A('go', '[data-view="antonio"]')); await w(80); await visit('antonio-vide');
  await page.fill('#qdraft', 'court'); await page.click(A('qsend')); await visit('antonio-erreur');
  await page.fill('#qdraft', 'Il refuse d’aller à l’école le matin, je fais quoi ?'); await page.click(A('qsend')); await w(60); await visit('antonio');
  await page.click('.letter'); await w(60); await visit('mot-exemple');
  // ----- pages de texte
  for (const f of ['confidentialite', 'conditions']) {
    await page.evaluate(() => localStorage.removeItem('pepe-consent'));
    await page.goto(APP + f + '.html'); await w(200); await visit(f);
    if (f === 'confidentialite') { await page.click('[data-consent-open]'); await w(100); await visit(f + '-bandeau'); await page.click('#consent [data-consent="yes"]'); await visit(f + '-choix'); }
  }
  // ----- mentions légales (la page n'existe que lorsque l'éditeur a donné son adresse postale et son adresse e-mail)
  if ((await page.request.get(APP + 'mentions-legales.html')).ok()) {
    await page.goto(APP + 'mentions-legales.html'); await w(200); await visit('mentions-legales');
  }
  // ----- 404
  await page.goto(BASE + 'parent-ecoute/page-inconnue'); await w(200); await visit('404');
  // ----- Espace Antonio
  await page.goto(APP + 'antonio/'); await w(200); await visit('espace-antonio');
  await page.fill('#ans', 'court'); await page.click(A('answer')); await visit('espace-antonio-erreur');
  await page.click(A('open', '[data-id="B"]')); await w(80); await page.click(A('send')); await visit('espace-antonio-parent');
}
module.exports = { walk, ORIGIN, BASE, APP, A };
