// Le trajet « Je découvre, j'essaie, je vois ma fiche », écran par écran, comme un parent du site public (la vente est fermée).
// Il complète le parcours de walk.js, qui visite les écrans d'avant avec la commande des essais internes.
// Pour le lancer :  PEPE_WALK=trajet node overflow.js 390   (ou tout autre essai qui s'appuie sur walk.js), sans le réglage des essais internes.
async function walkTrajet(page, visit, { APP, A, R }) {
  const w = ms => page.waitForTimeout(ms);
  const bas = async nom => { await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(140); await visit(nom); await page.evaluate(() => scrollTo(0, 0)); await w(60); };
  const vers = async (sel, nom) => { await page.evaluate(s => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: 'start' }); }, sel); await w(160); await visit(nom); await page.evaluate(() => scrollTo(0, 0)); await w(60); };
  // un parent ordinaire : même lancé avec le réglage des essais internes, ce parcours se fait sans lui
  await page.addInitScript(() => { try { sessionStorage.removeItem('pepe-interne'); } catch (e) { } });
  // ----- je découvre
  await page.goto(APP); await w(400);
  if (await page.$('#consent')) await page.click('#consent [data-consent="no"]');
  await page.addStyleTag({ content: '.cta-flot{display:none!important}' });
  await visit('trajet-accueil');
  await vers('.invite-rl', 'trajet-accueil-invitation');
  await vers('.acc-formules', 'trajet-accueil-offres');
  await page.click('.fiche-b .fb-voir'); await w(800); await visit('trajet-exemple'); await bas('trajet-exemple-bas');
  // ----- j'essaie
  await page.click('.f-tete ' + R('essai')); await w(500); await visit('trajet-essai-depart'); await bas('trajet-essai-depart-bas');
  await page.click('.rl-oc[data-v="weekend"]'); await w(600); await visit('trajet-repere-1'); await bas('trajet-repere-1-bas');
  await page.click('#rl-es-suite', { force: true }); await w(200); await visit('trajet-repere-1-vide');
  await page.fill('#rl-es-t', 'Lina a besoin de savoir ce qui vient après. Dis-lui le programme le matin, en 3 étapes au plus.'); await w(120); await visit('trajet-repere-1-ecrit');
  await page.press('#rl-es-t', 'Enter'); await w(350); await visit('trajet-repere-2');
  await page.click(R('es-idees')); await w(250); await visit('trajet-repere-2-idees'); await bas('trajet-repere-2-idees-bas');
  await page.click('.rl-modeles .rl-m >> nth=0'); await w(250); await page.click('#rl-es-suite'); await w(350); await visit('trajet-repere-3');
  await page.fill('#rl-es-t', 'Elle choisit elle-même ses vêtements et son film du soir.'); await page.press('#rl-es-t', 'Enter'); await w(450); await visit('trajet-prets'); await bas('trajet-prets-bas');
  await page.click(R('es-plus', '[data-v="q"]')); await w(200); await page.fill('#rl-qui', 'Lina'); await page.fill('#rl-chez', 'sa tante Élise'); await page.fill('#rl-quand', 'du samedi au dimanche'); await w(120);
  await page.click(R('es-plus', '[data-v="m"]')); await w(200); await page.click(R('moi', '[data-i="0"]')); await w(200); await page.fill('[data-rl="moi.0"]', 'J’aime choisir ma musique dans la voiture.'); await w(120);
  await visit('trajet-prets-prenom'); await vers('.rl-es-plus', 'trajet-prets-prenom-champs'); await bas('trajet-prets-prenom-bas');
  // ----- je vois ma fiche
  await page.click(R('recu')); await w(1700); await visit('trajet-recu'); await vers('.rl-vu-fin', 'trajet-recu-fin'); await vers('.rl-49-prix', 'trajet-recu-prix'); await bas('trajet-recu-bas');
  await page.click('.bar.rl-vu .btn'); await w(600); await visit('trajet-retour-brouillon');
  // ----- l'outil, pour un parent qui essaie : son brouillon, la fiche complète, et l'essai d'une réunion
  await page.goto(APP + '#relais'); await w(700); await visit('trajet-outil'); await bas('trajet-outil-bas');
  await page.click(R('ouvrir')); await w(1500); await visit('trajet-apercu'); await bas('trajet-apercu-bas');
  await page.goto(APP + '#relais'); await w(700); await page.click(R('essai', '[data-v="reunion"]')); await w(600); await visit('trajet-reunion-1');
  for (const t of ['Depuis 3 semaines, Lina dort mal le dimanche soir.', 'Je demande un court message chaque vendredi.', 'Son casque l’aide à rester en classe.']) { await page.fill('#rl-es-t', t); await page.press('#rl-es-t', 'Enter'); await w(350); }
  await visit('trajet-reunion-prete'); await page.click(R('feuille-ok')); await w(600); await visit('trajet-reunion-feuille'); await bas('trajet-reunion-feuille-bas');
  // ----- au retour
  await page.goto(APP); await w(600); await visit('trajet-aujourdhui');
  await page.evaluate(() => { const a = [...document.querySelectorAll('.va-accueil, .tab-accueil')].find(e => e.getClientRects().length); if (a) a.click(); }); await w(700);
  await page.addStyleTag({ content: '.cta-flot{display:none!important}' }); await visit('trajet-accueil-revenu');
  // ----- les 3 offres, la vente fermée, puis la fin de l'essai du parcours
  await page.goto(APP + '#offres'); await w(600); await visit('trajet-offres');
  await page.evaluate(() => document.querySelectorAll('details.f-concret').forEach(d => { d.open = true; })); await w(100); await visit('trajet-offres-depliees'); await bas('trajet-offres-bas');
  await page.click('.f-ferme ' + A('apercu')); await w(500); await visit('trajet-parcours-essai');
  await page.click(A('ap', '[data-k="1"]')); await w(200); await page.click('.ap-g[data-v="souffle"]'); await w(100); await page.fill('#ap-mot', 'Je compte 5 longues expirations à la fenêtre.');
  await page.click(A('ap-garde')); await w(200); await page.click(A('ap', '[data-k="3"]')); await w(250); await visit('trajet-parcours-essai-fin'); await bas('trajet-parcours-essai-fin-bas');
  // ----- les 2 pages de texte, qui disent que la vente n'est pas ouverte
  for (const f of ['confidentialite', 'conditions']) { await page.goto(APP + f + '.html'); await w(250); await visit('trajet-' + f); }
}
module.exports = { walkTrajet };
