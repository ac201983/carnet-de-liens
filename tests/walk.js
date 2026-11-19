// Parcourt tous les écrans du site (app, pages de texte, 404, Espace Antonio) et appelle visit(nom) sur chacun.
// PEPE_ORIGIN, PEPE_BASE et PEPE_APPDIR permettent de vérifier une autre version du site (par exemple celle de parent-ecoute.ch, servie à la racine).
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8443';
const BASE = ORIGIN + (process.env.PEPE_BASE || '/carnet-de-liens/');
const APP = BASE + (process.env.PEPE_APPDIR !== undefined ? process.env.PEPE_APPDIR : 'parent-ecoute/');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
const R = (k, extra = '') => `[data-act="rl"][data-k="${k}"]${extra}`;
const KEY = process.env.PEPE_KEY || 'pepe-v1';
// Le lien d'une petite fiche de relais, fabriqué avec le code du site (build/lancement/lien-exemple.js). Les prénoms et le numéro sont inventés.
const FICHE_RECUE = 'relais/#f=1.YQQTTm_DqQRUEthSsMOpbWkFVCAHNSAq_jYfJweLQ69Dr0OvQ6gJQf4uBUBEL0QvRC4DgAQBokRdQwB1LeUjAQLwcyfQYQxuaWzgLbJvaXIuzxHBElI0dp9RdHI2oLLyOQDhY2GfoTgSPYByb-8GkTbdPfIkgm6KkXqwo7b_BkIYChJ_En8SfxJ_En8Sfx8SfyfKExJu3gNBcMOi468CEqByaXoQwQFiLvD_BEQthYNfg1-DX4NSLvg3MnMvQTcBMDAAQAAwL74xADkifa6BYw';

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
  await page.click(A('peek-plans')); await w(80); await visit('offres-apercu');
  await page.evaluate(() => document.querySelectorAll('details.f-concret').forEach(d => { d.open = true; })); await w(80); await visit('offres-apercu-depliees');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('offres-apercu-bas'); await page.evaluate(() => scrollTo(0, 0));
  // un visiteur peut voir une commande, la maquette du cadeau et « Retrouver un achat » avant d'être entré dans l'espace
  await page.click(A('commande', '[data-v="parcours"][data-m="six"]')); await w(200); await visit('commande-visiteur');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('commande-visiteur-bas');
  await page.goto(APP + '#formules'); await w(300); await page.click(A('cadeau')); await w(200); await visit('cadeau-visiteur');
  await page.click(A('cmd', '[data-v="cadeau-ok"]')); await w(150); await visit('cadeau-pret-visiteur');
  await page.goto(APP + '#cadeau-relais'); await w(300); await visit('cadeau-recu-visiteur');
  await page.goto(APP + '#formules'); await w(300); await page.click(A('retrouver')); await w(200); await visit('retrouver-visiteur');
  // « Passer le relais », pour un visiteur : l'accueil de l'outil, puis l'exemple aux 3 âges
  await page.goto(APP + 'relais/'); await w(300); await visit('relais-visiteur');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('relais-visiteur-bas'); await page.evaluate(() => scrollTo(0, 0));
  await page.click(R('exemple')); await w(250); await visit('relais-exemple');
  for (const k of ['e', 'a']) { await page.click(R('ex', '[data-v="' + k + '"]')); await w(150); await visit('relais-exemple-' + k); }
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('relais-exemple-bas');
  // la fiche qu'un proche reçoit par lien, puis un lien abîmé
  await page.goto(APP + FICHE_RECUE); await w(400); await visit('relais-fiche-recue');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('relais-fiche-recue-bas');
  await page.goto(APP + 'transmettre/'); await w(300); await page.goto(APP + FICHE_RECUE.slice(0, -7)); await w(400); await visit('relais-fiche-abimee');
  // la page qu'une association ou un professionnel transmet à une famille
  await page.goto(APP + 'transmettre/'); await w(300); await visit('transmettre');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('transmettre-bas');
  await page.goto(APP); await w(400);
  await page.click(A('peek-about')); await w(150); await visit('histoire-apercu'); await page.click(A('back')); await w(200);
  // le SOS, ouvert par un visiteur
  await page.click('main.intro .hbar .sos'); await w(100); await visit('sos-visiteur'); await page.click('.sosview .back'); await w(200);
  // ----- les pages publiques : la liste des situations, puis une fiche reçue par lien direct (haut, bas, lien copié)
  await page.goto(APP + 'fiches/'); await w(250); await visit('fiches-publiques');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(150); await visit('fiches-publiques-bas');
  await page.goto(APP + 'fiches/quand-il-ou-elle-vit-ailleurs/'); await w(250); await visit('fiche-publique');
  await page.$eval('.partage', e => e.scrollIntoView({ block: 'center' })); await w(120); await page.click(A('partager')); await w(250); await visit('fiche-publique-envoyer');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(3300); await visit('fiche-publique-bas');
  await page.click('.proches .sit'); await w(250); await visit('fiche-publique-suivante');
  await page.click('.pubbar .wordmark'); await w(300);
  // ----- le premier geste : souffler (en cours, arrêté), puis « Aujourd'hui » tel que le découvre un nouveau parent
  await page.click('.seuil ' + A('porte', '[data-v="souffle"]')); await w(300); await visit('souffle-debut');
  await w(1900); await visit('souffle-inspirez');
  // « Écouter l'étang » : le bouton pendant que le son joue, puis de nouveau en silence
  await page.click('.son-souffle'); await w(800); await visit('souffle-son'); await page.click('.son-souffle'); await w(200);
  await w(3100); await visit('souffle-expirez');
  // la pause : le temps attend, et il ne reste que « Reprendre » et « Arrêter »
  await page.click(A('souffle-pause')); await w(300); await visit('souffle-pause'); await page.click(A('souffle-pause')); await w(200);
  // « Changer de respiration » : le choix ouvert pendant l'exercice, puis « À mon rythme » avec sa cadence
  await page.click('.resp-l'); await w(250); await visit('souffle-choix');
  await page.click('.resp-o[data-v="libre"]'); await w(200); await visit('souffle-choix-rythme');
  await page.click('.resp-o[data-v="long"]'); await w(100); await page.click(A('resp-ferme')); await w(150);
  await page.click(A('souffle-stop')); await w(100); await visit('souffle-pret');
  await page.click('.resp-l'); await w(250); await visit('souffle-pret-choix'); await page.click(A('back')); await w(300);
  await page.click('.seuil ' + A('porte', '[data-v="souffle"]')); await w(300); await page.click(A('souffle-stop')); await w(150);
  // « Retour » ramène à la vitrine, celle d'un parent déjà entré, qui propose « Ouvrir mon espace »
  await page.click(A('back')); await w(300); await visit('vitrine-parent');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(3300); await visit('vitrine-parent-bas'); await page.evaluate(() => scrollTo(0, 0)); await w(150);
  await page.click('.seuil ' + A('entrer', '[data-v="today"]')); await w(250); await visit('aujourdhui-nouveau');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('aujourdhui-nouveau-bas'); await page.evaluate(() => scrollTo(0, 0));
  // « Prendre un instant », sous la dose : l'étang à regarder ou à toucher, en silence, puis avec le son demandé
  await page.$eval('.dose .instant-b', e => e.scrollIntoView({ block: 'center' })); await w(150); await page.click('.dose .instant-b'); await w(500); await visit('instant');
  { const sb = await page.$('main.instant .son-dose'); if (sb) { await sb.click(); await w(800); await visit('instant-son'); await page.click('main.instant .son-dose'); await w(200); } }
  await page.click(A('back')); await w(300); await page.evaluate(() => scrollTo(0, 0));
  await page.click('.dose ' + A('voix')); await w(150); await visit('qui-parle'); await page.keyboard.press('Escape'); await w(100);
  await page.click('.card.perso ' + A('onboard')); await w(150); await visit('entree');
  await page.fill('#ob-me', 'Camille'); await page.click(A('ob', '[data-k="age"][data-v="a"]')); await page.click(A('obw', '[data-v="fatigue"]')); await visit('entree-remplie');
  await page.click(A('ob-done')); await w(150); await visit('aujourdhui');
  // ----- déposer
  await page.click('.portes ' + A('porte', '[data-v="deposer"]')); await w(200); await visit('deposer');
  await page.click(A('dsend')); await visit('deposer-erreur');
  await page.fill('#draft', 'Ce soir j’ai crié et je m’en veux. Je suis épuisé, et il ne veut pas dormir.'); await page.click(A('dsend')); await w(250); await visit('deposer-reponse');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(3300); await visit('deposer-reponse-bas'); await page.evaluate(() => scrollTo(0, 0));
  // ----- « J'aimerais le dire à quelqu'un » : la première phrase, les débuts de phrase, puis le texte prêt et l'outil à découvrir
  await page.click('.emporte ' + A('dire', '[data-k="ouvre"]')); await w(300); await visit('dire');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(200); await visit('dire-bas'); await page.evaluate(() => scrollTo(0, 0));
  await page.click(A('dire', '[data-k="a"][data-v="reunion"]')); await w(150); await page.click('main.dire .rl-perds'); await w(150); await visit('dire-mots');
  await page.click(A('dire', '[data-k="mot"][data-i="0"]')); await w(150); await page.click(A('dire', '[data-k="copie"]')); await w(400); await visit('dire-copie');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(3600); await visit('dire-copie-bas'); await page.evaluate(() => scrollTo(0, 0));
  await page.click(A('dire', '[data-k="laisse"]')); await w(400);
  await page.fill('#draft', 'Je n’ai plus envie de vivre comme ça.'); await page.click(A('dsend')); await w(250); await visit('deposer-detresse');
  await page.click('.emporte ' + A('dire', '[data-k="ouvre"]')); await w(300); await visit('dire-detresse'); await page.click(A('dire', '[data-k="laisse"]')); await w(400);
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
  // la fiche « Les transitions » parle du minuteur visuel : son bouton y mène tout droit
  { const tr = await page.$(A('sit', '[data-id="transitions"]')); if (tr) { await tr.click(); await w(200); await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(150); await visit('situation-transitions-bas'); await page.click('.quick [data-tool="timer"]'); await w(300); await visit('outils-minuteur-depuis-fiche'); await page.evaluate(() => scrollTo(0, 0)); } }
  await page.click(A('kit', '[data-v="tools"]')); await visit('outils-minuteur');
  // le minuteur en marche, avec une autre couleur
  await page.click(A('tset', '[data-m="1"]')); await page.click(A('ttoggle')); await page.click(A('mvc', '[data-v="bleu"]')); await w(1200); await page.$eval('.minuteur', e => e.scrollIntoView({ block: 'center' })); await w(120); await visit('outils-minuteur-en-marche'); await page.click(A('ttoggle')); await page.click(A('treset')); await page.click(A('mvc', '[data-v="soleil"]')); await page.evaluate(() => scrollTo(0, 0)); await w(80);
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
  await page.click(A('go', '[data-view="about"]')); await w(150); await page.$eval('.logo-sceau', i => i.scrollIntoView()); await w(80); await page.evaluate(() => scrollTo(0, 0)); await visit('histoire'); await page.click(A('back')); await w(80);
  await page.click(A('go', '[data-view="plans"]')); await w(60); await visit('offres');
  await page.evaluate(() => document.querySelectorAll('details.f-concret').forEach(d => { d.open = true; })); await w(80); await visit('offres-depliees');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('offres-bas'); await page.evaluate(() => scrollTo(0, 0));
  // ----- l'aperçu du parcours : la vague, un geste, le carnet, la semaine prochaine
  await page.click('.formule ' + A('apercu')); await w(150); await visit('apercu-vague');
  for (let k = 0; k < 8 && await page.$(A('schnext')); k++) { await page.click(A('schnext')); await w(60); }
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('apercu-vague-bas');
  await page.click(A('ap', '[data-k="1"]')); await w(150); await visit('apercu-geste');
  await page.click('.ap-g[data-v="souffle"]'); await w(80); await page.fill('#ap-mot', 'Je compte 5 longues expirations à la fenêtre.'); await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('apercu-geste-choisi');
  await page.click(A('ap-garde')); await w(150); await visit('apercu-carnet');
  await page.click(A('ap', '[data-k="3"]')); await w(150); await visit('apercu-semaine');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('apercu-semaine-bas');
  // ----- la commande en démonstration : refusée, abandonnée, acceptée
  await page.click('.offre ' + A('commande', '[data-m="une"]')); await w(150); await visit('commande');
  await page.click(A('cmd-mode', '[data-v="six"]')); await w(120); await visit('commande-six-fois');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('commande-six-fois-bas'); await page.evaluate(() => scrollTo(0, 0));
  await page.click(A('cmd', '[data-v="refus"]')); await w(120); await visit('commande-refusee');
  await page.click(A('cmd', '[data-v="recap"]')); await w(100); await page.click(A('cmd', '[data-v="abandon"]')); await w(120); await visit('commande-abandonnee');
  await page.click(A('cmd', '[data-v="recap"]')); await w(100); await page.click(A('cmd', '[data-v="ok"]')); await w(150); await visit('commande-confirmee');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('commande-confirmee-bas');
  // ----- « Mes achats » : les mensualités, qui s'arrêtent à la sixième (les boutons de démonstration n'existent que dans la version d'essai)
  await tab('me'); await w(120); await visit('moi-achats');
  if (await page.$(A('ech-suite'))) { for (let k = 0; k < 5 && await page.$(A('ech-suite')); k++) { await page.click(A('ech-suite')); await w(80); } await visit('moi-achats-payes'); }
  await page.click(A('go', '[data-view="plans"]')); await w(120); await visit('offres-parcours');
  await tab('parcours'); await w(80); await visit('parcours-ouvert');
  // une étape qui n'est pas encore ouverte : un message, et l'écran ne change pas
  await page.click(A('step', '[data-i="1"]')); await w(80); await visit('parcours-attente');
  // ----- « Passer le relais » : la préparation d'une fiche, l'achat de l'outil, l'envoi, le retour, un deuxième relais, une réunion, la sauvegarde
  await page.goto(APP + 'relais/'); await w(300); await visit('relais-accueil');
  await page.click(R('nouveau')); await w(200); await visit('relais-pour-qui');
  await page.click(R('pas', '[data-v="1"]')); await w(150); await visit('relais-pour-qui-erreur');
  await page.fill('#rl-qui', 'Noé'); await page.fill('#rl-chez', 'mon frère Rémi'); await page.fill('#rl-quand', 'du samedi 5 au dimanche 6 décembre');
  await page.click(R('tu', '[data-v="0"]')); await w(80); await visit('relais-pour-qui-vous'); await page.click(R('tu', '[data-v="1"]')); await w(80);
  await page.click(R('pas', '[data-v="1"]')); await w(200); await visit('relais-quotidien-vide');
  await page.click(R('idees', '[data-s="aide"]')); await w(120); await visit('relais-quotidien-idees');
  await page.click(R('modele', '[data-s="aide"][data-i="0"]')); await w(80); await page.click(R('idees', '[data-s="aide"]')); await page.click(R('modele', '[data-s="aide"][data-i="1"]')); await w(80);
  await page.click(R('idees', '[data-s="repas"]')); await page.click(R('vierge', '[data-s="repas"]')); await w(120); await page.fill('[data-rl="s.repas.0"]', 'Noé mange volontiers des pâtes, du riz et des pommes.');
  await page.click(R('idees', '[data-s="nuit"]')); await page.click(R('modele', '[data-s="nuit"][data-i="1"]')); await w(120); await visit('relais-quotidien');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('relais-quotidien-bas');
  await page.click(R('pas', '[data-v="1"]')); await w(200); await visit('relais-reperes-vide');
  await page.click(R('pique') + ' >> nth=0'); await w(80); await page.click(R('pique') + ' >> nth=0'); await w(80); await page.fill('[data-rl="trois.2"]', 'Noé choisit lui-même son dessin animé du soir.'); await visit('relais-reperes');
  await page.click(R('pas', '[data-v="1"]')); await w(200); await visit('relais-parole-vide');
  await page.click(R('moi', '[data-i="0"]')); await w(120); await page.keyboard.type('les trains et les cartes de métro.'); await page.click(R('moi', '[data-i="1"]')); await w(120); await page.keyboard.type('qu’on finisse mes phrases.'); await visit('relais-parole');
  await page.click(R('pas', '[data-v="1"]')); await w(200); await page.fill('#rl-tn0', 'Maman'); await page.fill('#rl-tt0', '079 000 00 00'); await visit('relais-joindre');
  await page.click(R('apercu')); await w(300); await visit('relais-apercu-sans-outil');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('relais-apercu-sans-outil-bas');
  await page.click('.v-relais .offre ' + A('commande')); await w(200); await visit('commande-relais');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('commande-relais-bas');
  await page.click(A('cmd', '[data-v="ok"]')); await w(200); await visit('commande-relais-confirmee');
  await page.click(R('reprise')); await w(300); await visit('relais-apercu');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('relais-apercu-bas');
  await page.click(R('envoi')); await w(300); await visit('relais-envoi');
  await page.click(R('partage')); await w(500); await visit('relais-envoi-fait');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('relais-envoi-bas');
  await page.goto(APP + 'relais/'); await w(300); await visit('relais-mes-fiches');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('relais-mes-fiches-bas'); await page.evaluate(() => scrollTo(0, 0));
  await page.click('.rl-auretour ' + R('retour')); await w(250); await visit('relais-retour');
  await page.click(R('retour-ok')); await w(150); await visit('relais-retour-erreur');
  await page.fill('#rl-retour', 'Le programme dit le matin a bien aidé.'); await page.click(R('retour-ok')); await w(300); await visit('relais-apres-retour');
  await page.click(R('suivant')); await w(300); await visit('relais-deuxieme');
  // une fiche trop chargée pour une page : l'outil le dit là où la famille écrit, puis dans l'aperçu
  await page.evaluate(k => { const d = JSON.parse(localStorage.getItem(k)); const L = 'Une phrase assez longue pour remplir la page, avec des mots simples et un exemple précis du quotidien à la maison.'; const f = d.rel.fiches[d.rel.fiches.length - 1]; ['aide', 'repas', 'nuit', 'monte', 'comm', 'aime', 'secu'].forEach(x => { f.s[x] = [L, L, L, L, L]; }); localStorage.setItem(k, JSON.stringify(d)); }, KEY);
  await page.goto(APP + 'relais/'); await w(300); await page.click(R('ouvrir') + ' >> nth=0'); await w(300); await page.$eval('.rl-page', e => e.scrollIntoView({ block: 'center' })); await w(120); await visit('relais-apercu-trop-long');
  await page.click(R('aller', '[data-v="0"]')); await w(200); await page.click(R('pas', '[data-v="1"]')); await w(200); await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('relais-quotidien-trop-long');
  // préparer une réunion avec ce qui est déjà écrit
  await page.goto(APP + 'relais/'); await w(300); await page.click(R('reunion')); await w(250); await visit('reunion-avec-qui');
  await page.click(R('avec', '[data-v="foyer"]')); await page.fill('#rl-rq', 'jeudi 3 décembre à 16 heures'); await page.click(R('rpas', '[data-v="1"]')); await w(200); await visit('reunion-observations');
  await page.click('.rl-obs .rl-m >> nth=0'); await w(80); await page.click('.rl-obs .rl-m >> nth=1'); await w(80); await visit('reunion-observations-choisies');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('reunion-observations-bas');
  await page.click(R('rpas', '[data-v="1"]')); await w(200); await visit('reunion-demande');
  await page.click('.rl-perds'); await w(150); await visit('reunion-demande-mots');
  await page.click(R('mot', '[data-i="2"]')); await w(200); await page.keyboard.type('prévenir Noé la veille quand un éducateur change.'); await w(100);
  await page.click(R('rpas', '[data-v="1"]')); await w(200); await visit('reunion-priorites');
  await page.fill('[data-rl="reu.pri.0"]', 'Noé est prévenu la veille des changements.'); await page.fill('[data-rl="reu.pri.1"]', 'Un seul interlocuteur pour la famille.'); await page.fill('[data-rl="reu.pri.2"]', 'Le bilan peut attendre janvier.');
  await page.click(R('feuille-ok')); await w(300); await visit('reunion-feuille');
  await page.click('.rl-perds'); await w(150); await page.$eval('.rl-dire', e => e.scrollIntoView({ block: 'start' })); await w(120); await visit('reunion-feuille-mots');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('reunion-feuille-bas');
  await page.goto(APP + 'relais/'); await w(300); await page.evaluate(() => scrollTo(0, document.body.scrollHeight)); await w(120); await visit('relais-mes-reunions');
  await page.click(R('sauver')); await w(250); await visit('relais-sauvegarde');
  // la fiche reçue, lue par un parent déjà entré, puis « Retrouver un achat » et le cadeau déjà possédé
  await page.goto(APP + FICHE_RECUE); await w(400); await visit('relais-fiche-recue-parent');
  await page.goto(APP + '#formules'); await w(300); await visit('offres-tout-achete'); await page.click(A('retrouver')); await w(200); await page.click(A('cmd', '[data-v="retrouve"][data-f="relais"]')); await w(200); await visit('achat-retrouve');
  await page.goto(APP + '#cadeau-relais'); await w(300); await visit('cadeau-deja');
  await page.goto(APP); await w(400); await visit('aujourdhui-tout-achete');
  await tab('me'); await w(120); await page.click(A('go', '[data-view="data"]')); await w(150); await visit('donnees-sauvegarde'); await page.click(A('back')); await w(200);
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
  if ((await page.request.get(APP + 'antonio/')).ok() && await page.goto(APP + 'antonio/').then(() => page.$('#ans')).catch(() => null)) {
    await w(200); await visit('espace-antonio');
    await page.fill('#ans', 'court'); await page.click(A('answer')); await visit('espace-antonio-erreur');
    await page.click(A('open', '[data-id="B"]')); await w(80); await page.click(A('send')); await visit('espace-antonio-parent');
  }
}
module.exports = { walk, ORIGIN, BASE, APP, A };
