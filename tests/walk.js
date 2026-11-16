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
  await page.goto(APP); await w(300); await visit('accueil-bandeau');
  await page.click('#consent [data-consent="no"]'); await visit('accueil');
  await page.click(A('peek-plans')); await w(80); await visit('formules-apercu'); await page.click(A('back'));
  await page.click(A('peek-about')); await w(150); await visit('histoire-apercu'); await page.click(A('back')); await w(80);
  await page.click('.herofull ' + A('onboard')); await w(150); await visit('entree');
  await page.fill('#ob-me', 'Camille'); await page.click(A('ob', '[data-k="age"][data-v="a"]')); await page.click(A('obw', '[data-v="fatigue"]')); await visit('entree-remplie');
  await page.click(A('ob-done')); await w(150); await visit('aujourdhui');
  // ----- aujourd’hui
  await page.click(A('dsend')); await visit('aujourdhui-erreur');
  await page.fill('#draft', 'Ce soir j’ai crié et je m’en veux. Je suis épuisé.'); await page.click(A('dsend')); await w(250); await visit('aujourdhui-depot');
  await page.fill('#draft', 'Je n’ai plus envie de vivre comme ça.'); await page.click(A('dsend')); await w(250); await visit('aujourdhui-detresse');
  await page.click('button.card' + A('go', '[data-view="evo"]')); await w(100); await visit('evolution');
  await page.click(A('evosave')); await w(150); await visit('aujourdhui-apres-depart');
  // ----- parcours (Découverte)
  await tab('parcours'); await w(100); await visit('parcours');
  await page.click(A('step', '[data-i="5"]')); await w(100); await visit('feuille-formule'); await page.keyboard.press('Escape');
  await page.click(A('step', '[data-i="0"]')); await w(100); await visit('etape');
  // le schéma avance à la demande, puis le carnet de route se remplit
  for (let k = 0; k < 8 && await page.$(A('schnext')); k++) { await page.click(A('schnext')); await w(60); }
  await visit('etape-schema');
  await page.fill('#note', 'Je commence ce parcours parce que je veux souffler un peu.'); await w(500); await visit('etape-carnet');
  await page.click(A('back'));
  await page.click('.quick ' + A('go', '[data-view="carnet"]')); await w(80); await visit('carnet'); await page.click(A('back'));
  await page.click('.quick ' + A('go', '[data-view="evo"]')); await w(80); await visit('evolution-chemin'); await page.click(A('back'));
  // ----- boîte à outils
  await tab('kit'); await w(100); await visit('outils-situations');
  await page.click('.sits .sit'); await w(100); await visit('situation'); await page.click(A('back'));
  await page.click(A('kit', '[data-v="tools"]')); await visit('outils-minuteur');
  for (const t of ['ft', 'routine', 'abc', 'phr']) {
    await page.click(A('tool', `[data-v="${t}"]`)); await w(60);
    if (t === 'routine') await page.click(A('rdone', '[data-i="0"]'));
    if (t === 'abc') { await page.click(A('abcadd')); await visit('outils-abc-erreur'); await page.fill('#a2', 'Cris pendant dix minutes'); await page.click(A('abcadd')); }
    if (t === 'phr') { await page.fill('#ph', 'On respire comme le dragon'); await page.click(A('phadd')); await page.fill('#ph', 'On respire comme le dragon'); await page.click(A('phadd')); }
    await visit('outils-' + t);
    if (t === 'ft') { await page.click('.picto button:has-text("Dents")'); await page.click('.picto button:has-text("Histoire")'); await w(60); await visit('outils-ft-rempli'); }
  }
  await page.click(A('kit', '[data-v="me"]')); await visit('outils-pour-moi');
  for (const x of ['breath', 'trois', 'deposer', 'droit', 'minute', 'appeler']) {
    await page.click(A('exo', `[data-id="${x}"]`)); await w(60);
    if (x === 'trois') await page.click(A('threeadd'));
    await visit('exo-' + x); await page.click(A('back'));
  }
  // ----- SOS
  await page.click('.sos'); await w(100); await visit('sos'); await page.click('.sosview .back');
  // ----- moi
  await tab('me'); await w(100); await visit('moi');
  await page.click(A('go', '[data-view="depots"]')); await visit('mes-depots'); await page.click(A('back'));
  await page.click(A('go', '[data-view="data"]')); await w(60); await visit('donnees');
  await page.click(A('reset')); await visit('donnees-confirmation'); await page.click(A('reset-no')); await page.click(A('back'));
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
  await visit('etape-vecu-schema'); await page.click(A('back'));
  for (const i of [2, 3]) { await page.click(A('step', `[data-i="${i}"]`)); await w(80); for (let k = 0; k < 8 && await page.$(A('schnext')); k++) { await page.click(A('schnext')); await w(60); } await visit('etape-schema-' + (i + 1)); await page.click(A('back')); }
  await page.click(A('step', '[data-i="5"]')); await w(80); await visit('etape-ouverte'); await page.click(A('back'));
  await page.click(A('step', '[data-i="11"]')); await w(80); await visit('etape-rappel'); await page.click(A('back'));
  await page.click(A('step', '[data-i="23"]')); await w(80); await visit('etape-derniere'); await page.click(A('back'));
  await page.click('.quick ' + A('go', '[data-view="photo"]')); await w(80); await visit('photolangage-choix');
  await page.click(A('photopick', '[data-id="chemin"]')); await w(250); await visit('photolangage-photo');
  await page.fill('#ptext', 'Un chemin qui monte, mais avec de la lumière au bout.'); await page.click(A('photosave')); await w(80); await visit('photolangage');
  await page.click(A('photoback')); await w(250); await visit('photolangage-changer'); await page.click(A('photopick', '[data-id="chemin"]')); await w(250);
  if (await page.$(A('back'))) await page.click(A('back'));
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
    await page.goto(APP + f + '.html'); await w(200); await visit(f + '-bandeau');
    await page.click('#consent [data-consent="yes"]'); await visit(f);
  }
  // ----- mentions légales (la page n'existe que lorsque l'éditeur a donné son adresse postale et son adresse e-mail)
  if ((await page.request.get(APP + 'mentions-legales.html')).ok()) {
    await page.goto(APP + 'mentions-legales.html'); await w(200); await visit('mentions-legales');
  }
  // ----- 404
  await page.goto(BASE + 'parent-ecoute/page-inconnue'); await w(200); await visit('404');
  // ----- Espace Antonio
  await page.goto(APP + 'antonio.html'); await w(200); await visit('espace-antonio');
  await page.fill('#ans', 'court'); await page.click(A('answer')); await visit('espace-antonio-erreur');
  await page.click(A('open', '[data-id="B"]')); await w(80); await page.click(A('send')); await visit('espace-antonio-parent');
}
module.exports = { walk, ORIGIN, BASE, APP, A };
