// Le parcours formatif : rythme d'ouverture, schéma à la demande, carnet de route, rappels, aperçu d'Antonio, reprise des anciennes données.
// usage : node parcours.js   (mêmes variables que walk.js : PEPE_ORIGIN, PEPE_BASE, PEPE_APPDIR)
const { chromium } = require('playwright');
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8443';
const BASE = ORIGIN + (process.env.PEPE_BASE || '/carnet-de-liens/');
const APP = BASE + (process.env.PEPE_APPDIR !== undefined ? process.env.PEPE_APPDIR : 'parent-ecoute/');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
let n = 0, ko = 0;
const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC', m); } else if (process.env.VERBEUX) console.log('  ok', m); };
const iso = j => { const d = new Date(); d.setDate(d.getDate() + j); const p = x => String(x).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); };
const BASE_DATA = { onboarded: true, me: 'Camille', age: 'e', situation: 'hand', weights: [], evo: {}, moods: {}, depots: [] };

async function ouvre(browser, data, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true, reducedMotion: opts.anim ? 'no-preference' : 'reduce' });
  if (data) await ctx.addInitScript(d => { try { if (!sessionStorage.getItem('pose')) { localStorage.setItem('pepe-v1', JSON.stringify(d)); sessionStorage.setItem('pose', '1'); } } catch (e) { } }, data);
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(APP + (opts.hash || '')); await page.waitForTimeout(350);
  // le message bref de l'arrivée se lit tout de suite : fermer le bandeau prend parfois plus de trois secondes
  const accueil = await page.evaluate(() => { const t = document.querySelector('.toast'); return t ? t.textContent : ''; });
  const c = await page.$('#consent [data-consent="no"]'); if (c) await c.click();
  return { ctx, page, errs, accueil };
}
const store = page => page.evaluate(() => JSON.parse(localStorage.getItem('pepe-v1')));
const parcours = async page => { await page.click('.tab' + A('go', '[data-view="parcours"]')); await page.waitForTimeout(150); };
const sous = (page, i) => page.$eval(A('step', `[data-i="${i}"]`) + ' .tx span', e => e.textContent);
const toast = page => page.evaluate(() => { const t = document.querySelector('.toast'); return t ? t.textContent : ''; });

(async () => {
  const browser = await chromium.launch();

  // ---------- 1. Formule gratuite : la première étape seulement ----------
  {
    const { ctx, page, errs } = await ouvre(browser, Object.assign({}, BASE_DATA, { tier: 'free', start: iso(0), steps: {}, pv: 2, seen: {}, notes: {} }));
    await parcours(page);
    ok((await page.$$('.step.locked')).length === 23, 'gratuit : 23 étapes fermées');
    await page.click(A('step', '[data-i="3"]')); await page.waitForTimeout(120);
    ok(!!(await page.$('.sheet #up-title')), 'gratuit : une étape fermée ouvre la feuille des formules');
    await page.keyboard.press('Escape');
    await page.click(A('step', '[data-i="0"]')); await page.waitForTimeout(150);
    ok(/D’où je pars/.test(await page.textContent('h1')), 'gratuit : l’étape 1 s’ouvre');
    ok((await store(page)).seen.depart === iso(0), 'l’ouverture de l’étape 1 est datée d’aujourd’hui');
    // l'étape en six blocs
    ok(!!(await page.$('.card.idee')) && !!(await page.$('.card.sch svg[role="img"]')) && !!(await page.$('.card.exemple')) && !!(await page.$('.exo')) && !!(await page.$('.card.green')) && !!(await page.$('.card.carnet textarea#note')), 'étape 1 : comprendre, schéma, exemple, essayer, observer, carnet');
    ok((await page.$$('.card.idee p.lesson')).length === 2, 'étape 1 : deux paragraphes pour comprendre');
    // le schéma avance à la demande, sans que l'écran soit redessiné
    const marque = await page.evaluate(() => { const m = document.querySelector('main'); m.dataset.temoin = '1'; return document.querySelectorAll('.sp.on').length; });
    ok(marque === 1 && (await page.textContent('.sch-pos')) === '1 sur 4', 'schéma : un seul moment au départ');
    ok((await page.$$eval('.sch-caps li', L => L.filter(l => getComputedStyle(l).display !== 'none').length)) === 1, 'schéma : une seule phrase visible au départ');
    await page.click(A('schnext')); await page.waitForTimeout(60);
    ok((await page.$$('.sp.on')).length === 2 && (await page.textContent('.sch-pos')) === '2 sur 4', 'schéma : « Voir la suite » ajoute un moment');
    ok(await page.evaluate(() => document.querySelector('main').dataset.temoin === '1'), 'schéma : l’écran n’est pas redessiné');
    await page.click(A('schnext')); await page.click(A('schnext')); await page.waitForTimeout(60);
    ok((await page.$$('.sp.on')).length === 4 && !(await page.$(A('schnext'))) && !!(await page.$(A('schagain'))), 'schéma : au bout, le bouton propose de revoir');
    ok((await page.$$eval('.sch-caps li.cur', L => L.length)) === 1 && /reliant ces trois points/.test(await page.textContent('.sch-caps li.cur')), 'schéma : la dernière phrase est mise en avant');
    await page.click(A('schagain')); await page.waitForTimeout(60);
    ok((await page.$$('.sp.on')).length === 1 && !!(await page.$(A('schnext'))), 'schéma : « Revoir » repart du début');
    // le carnet se garde tout seul
    await page.fill('#note', 'Je commence ce parcours parce que je veux souffler.'); await page.waitForTimeout(600);
    ok((await store(page)).notes.depart.t === 'Je commence ce parcours parce que je veux souffler.', 'carnet : gardé sans bouton');
    ok(/Gardé dans votre carnet/.test(await page.textContent('#note-etat')), 'carnet : la ligne dit que c’est gardé');
    ok(await page.evaluate(() => document.querySelector('main').dataset.temoin === '1'), 'carnet : écrire ne redessine pas l’écran');
    // suite : la deuxième étape est dans la formule
    await page.click(A('stepdone')); await page.waitForTimeout(150);
    ok((await store(page)).steps.depart === true && /Étape faite/.test(await toast(page)), 'étape marquée comme faite, rangée par son nom');
    ok((await page.inputValue('#note')) === 'Je commence ce parcours parce que je veux souffler.', 'carnet : le texte est toujours là après un nouveau rendu');
    await page.click('.quick ' + A('step', '[data-i="1"]')); await page.waitForTimeout(150);
    ok(!!(await page.$('.sheet #up-title')), 'gratuit : « Étape suivante » ouvre la feuille des formules');
    await page.keyboard.press('Escape');
    // le carnet de route
    await page.click(A('back')); await page.waitForTimeout(150);
    ok(/Mon carnet \(1\)/.test(await page.textContent('.quick ' + A('go', '[data-view="carnet"]'))), 'parcours : le bouton du carnet compte les pages');
    await page.click('.quick ' + A('go', '[data-view="carnet"]')); await page.waitForTimeout(150);
    ok((await page.$$('.page')).length === 1 && /je veux souffler/.test(await page.textContent('.page .lesson')), 'carnet de route : la page écrite y est');
    await page.click(A('back')); await page.waitForTimeout(150);
    ok(/Le parcours/.test(await page.textContent('h1')), 'carnet de route : Retour ramène au parcours');
    // rechargement : tout est encore là
    await page.reload(); await page.waitForTimeout(350);
    ok((await store(page)).notes.depart.t.length > 10, 'après rechargement, le carnet est conservé');
    ok(errs.length === 0, 'aucune erreur (gratuit) ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  // ---------- 2. Formule Le parcours : une étape tous les sept jours ----------
  {
    const { ctx, page, errs } = await ouvre(browser, Object.assign({}, BASE_DATA, { tier: 'parcours', start: iso(0), steps: {}, pv: 2, seen: {}, notes: {} }));
    await parcours(page);
    ok((await page.$$('.step.locked')).length === 23 && (await sous(page, 1)) === 'Plus tard', 'jour 0 : tant que l’étape 1 n’est pas ouverte, la suite est « Plus tard »');
    await page.click(A('step', '[data-i="0"]')); await page.waitForTimeout(150);
    ok(/s’ouvrira dans 7 jours/.test(await page.textContent('.attente')) && /Croire en lui/.test(await page.textContent('.attente')), 'étape 1 : la suivante est annoncée dans 7 jours, avec son titre');
    ok(!(await page.$('.quick ' + A('step'))), 'étape 1 : pas de bouton « Étape suivante » tant qu’elle est fermée');
    await page.click(A('back')); await page.waitForTimeout(150);
    ok((await sous(page, 1)) === 'S’ouvre dans 7 jours' && (await sous(page, 2)) === 'Plus tard', 'parcours : étape 2 « S’ouvre dans 7 jours », étape 3 « Plus tard »');
    await page.click(A('step', '[data-i="1"]')); await page.waitForTimeout(120);
    ok(/s’ouvrira dans 7 jours/.test(await toast(page)) && /Le parcours/.test(await page.textContent('h1')), 'toucher l’étape 2 : un message, et on reste sur le parcours');
    await page.click(A('step', '[data-i="2"]')); await page.waitForTimeout(120);
    ok(/plus tard/.test(await toast(page)), 'toucher l’étape 3 : « plus tard »');
    // six jours après : demain
    await page.evaluate(d => { const x = JSON.parse(localStorage.getItem('pepe-v1')); x.seen.depart = d; localStorage.setItem('pepe-v1', JSON.stringify(x)); }, iso(-6));
    await page.reload(); await page.waitForTimeout(350); await parcours(page);
    ok((await sous(page, 1)) === 'S’ouvre demain', 'six jours après : « S’ouvre demain »');
    // sept jours après : ouverte
    await page.evaluate(d => { const x = JSON.parse(localStorage.getItem('pepe-v1')); x.seen.depart = d; localStorage.setItem('pepe-v1', JSON.stringify(x)); }, iso(-7));
    await page.reload(); await page.waitForTimeout(350);
    ok(/Croire en lui/.test(await page.textContent('.step.now b')), 'sept jours après : « Aujourd’hui » propose l’étape 2');
    await parcours(page);
    ok((await sous(page, 1)) === 'Cette semaine' && (await sous(page, 2)) === 'Plus tard', 'sept jours après : étape 2 ouverte, étape 3 « Plus tard »');
    await page.click(A('step', '[data-i="1"]')); await page.waitForTimeout(150);
    ok(!!(await page.$('.card.vecu')) && /Mes parents d’accueil ont cru en moi/.test(await page.textContent('.card.vecu')) && /cent cinquante mots/.test(await page.textContent('.card.vecu')), 'étape 2 : « Ce que j’ai vécu », avec les mots d’Antonio');
    ok((await store(page)).seen.croire === iso(0), 'étape 2 : ouverture datée d’aujourd’hui');
    ok((await page.$$('.sch-caps li')).length === 5, 'étape 2 : la boucle a cinq moments');
    // une longue absence : rien ne s'accumule
    await page.evaluate(d => { const x = JSON.parse(localStorage.getItem('pepe-v1')); x.seen.croire = d; localStorage.setItem('pepe-v1', JSON.stringify(x)); }, iso(-40));
    await page.reload(); await page.waitForTimeout(350); await parcours(page);
    ok((await page.$$('.step:not(.locked)')).length === 3 && (await sous(page, 3)) === 'Plus tard', 'après 40 jours d’absence : une seule étape nouvelle attend');
    // Aujourd'hui annonce la suite quand l'étape du moment est faite
    await page.evaluate(() => { const x = JSON.parse(localStorage.getItem('pepe-v1')); x.seen.croyances = x.seen.croire; x.steps.croyances = true; const d = new Date(); d.setDate(d.getDate() - 3); const p = v => String(v).padStart(2, '0'); x.seen.croyances = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); localStorage.setItem('pepe-v1', JSON.stringify(x)); });
    await page.reload(); await page.waitForTimeout(350);
    ok(/Étape faite\. La suivante s’ouvre dans 4 jours\./.test(await page.textContent('.step.now .label')), '« Aujourd’hui » : étape faite, la suivante dans 4 jours');
    ok(errs.length === 0, 'aucune erreur (parcours) ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  // ---------- 3. L'aperçu d'Antonio ----------
  {
    const { ctx, page, errs } = await ouvre(browser, Object.assign({}, BASE_DATA, { tier: 'parcours', start: iso(0), steps: {}, pv: 2, seen: {}, notes: { depart: { t: 'Parce que je suis fatiguée.', d: iso(-80) }, avenir: { t: 'Il se lève, il prépare son café.\nIl part travailler à pied.', d: iso(-30) } } }));
    await page.click('.tab' + A('go', '[data-view="me"]')); await page.waitForTimeout(150);
    ok(!(await page.$(A('tout'))), 'sans le geste, « Moi » ne montre pas la ligne de l’aperçu');
    for (let k = 0; k < 4; k++) await page.click('h1' + A('atelier'));
    ok(!(await store(page)).atelier, 'quatre touches ne suffisent pas');
    await page.click('h1' + A('atelier')); await page.waitForTimeout(150);
    let d = await store(page);
    ok(d.atelier === true && d.tout === true && /Aperçu d’Antonio activé/.test(await toast(page)), 'cinq touches sur « Moi » : aperçu activé');
    ok((await page.getAttribute(A('tout'), 'aria-pressed')) === 'true' && /Activé/.test(await page.textContent(A('tout'))), '« Moi » : la ligne « Tout voir » est allumée');
    await parcours(page);
    ok((await page.$$('.step.locked')).length === 0 && !!(await page.$('.pill.apercu')), 'aperçu : les 24 étapes sont ouvertes, et l’écran le dit');
    await page.click(A('step', '[data-i="11"]')); await page.waitForTimeout(150);
    ok(/Parce que je suis fatiguée/.test(await page.textContent('.card.rap')) && /étape 1/.test(await page.textContent('.card.rap .label')), 'mi-parcours : la phrase écrite à l’étape 1 est rappelée');
    ok((await page.$$('main .btn.wide')).length === 2, 'mi-parcours : deux boutons (Mon évolution, photolangage)');
    ok(!(await store(page)).seen.mi, 'aperçu : ouvrir une étape ne date rien');
    await page.click(A('back')); await page.waitForTimeout(120);
    await page.click(A('step', '[data-i="21"]')); await page.waitForTimeout(150);
    ok(/Il se lève/.test(await page.textContent('.card.rap')) && (await page.$$('.card.rap .lesson br')).length === 1, 'préparer l’avenir : la journée dans dix ans est rappelée, avec ses retours à la ligne');
    ok(/Le passage à l’âge adulte/.test(await page.textContent('main ' + A('sit'))), 'préparer l’avenir : bouton vers la situation de la boîte à outils');
    await page.click('main ' + A('sit')); await page.waitForTimeout(150);
    ok(/Le passage à l’âge adulte/.test(await page.textContent('h1')), 'le bouton ouvre la situation');
    await page.click(A('back')); await page.waitForTimeout(150);
    ok(/Préparer l’avenir/.test(await page.textContent('h1')), 'Retour ramène à l’étape');
    await page.click(A('back')); await page.waitForTimeout(120);
    await page.click(A('step', '[data-i="22"]')); await page.waitForTimeout(150);
    ok(/Vous n’aviez rien écrit/.test(await page.textContent('.card.rap')) && !!(await page.$('.card.rap ' + A('step', '[data-i="11"]'))), 'bilan : sans note à rappeler, la carte propose d’ouvrir l’étape');
    await page.click(A('back')); await page.waitForTimeout(120);
    await page.click(A('step', '[data-i="23"]')); await page.waitForTimeout(150);
    ok(!!(await page.$('.quick ' + A('go', '[data-view="carnet"]'))) && !(await page.$('.quick ' + A('step'))), 'dernière étape : le bouton mène au carnet');
    // éteindre l'aperçu : on revoit le parcours comme un parent
    await page.click('.tab' + A('go', '[data-view="me"]')); await page.waitForTimeout(150);
    await page.click(A('tout')); await page.waitForTimeout(150);
    ok((await store(page)).tout === false && /comme un parent/.test(await toast(page)), 'aperçu éteint');
    await parcours(page);
    ok((await page.$$('.step.locked')).length === 23, 'aperçu éteint : le rythme des sept jours revient');
    ok(errs.length === 0, 'aucune erreur (aperçu) ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  {
    const { ctx, page, errs, accueil } = await ouvre(browser, Object.assign({}, BASE_DATA, { tier: 'free', start: iso(0), steps: {}, pv: 2, seen: {}, notes: {} }), { hash: '#atelier' });
    const d = await store(page);
    ok(d.atelier === true && d.tout === true, 'adresse …/#atelier : aperçu activé');
    ok(!/#atelier/.test(page.url()), 'adresse …/#atelier : le mot est retiré de l’adresse');
    ok(/Aperçu d’Antonio activé/.test(accueil), 'adresse …/#atelier : un message le confirme');
    await parcours(page);
    ok((await page.$$('.step.locked')).length === 0, 'aperçu en formule gratuite : tout est ouvert quand même');
    ok(errs.length === 0, 'aucune erreur (#atelier) ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  // ---------- 4. Reprise des données d'avant (étapes rangées par numéro) ----------
  {
    const { ctx, page, errs } = await ouvre(browser, Object.assign({}, BASE_DATA, { tier: 'parcours', start: iso(-22), steps: { 0: true, 1: true, 8: true, 12: true, 19: true, 5: false } }));
    const d = await store(page) || {};
    await parcours(page);
    const s = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem('pepe-v1')); } catch (e) { return null; } });
    // la reprise n'est écrite qu'au premier enregistrement : on en provoque un
    await page.click(A('step', '[data-i="0"]')); await page.waitForTimeout(150); await page.fill('#note', 'x'); await page.waitForTimeout(600);
    const x = await store(page);
    ok(x.pv === 2, 'reprise : marquée comme faite');
    ok(x.steps.depart && x.steps.croire && x.steps.emotions && x.steps.enfant && Object.keys(x.steps).length === 4, 'reprise : étapes faites rangées par leur nom (l’ancienne étape 20 n’existe plus)');
    ok(x.seen.depart === iso(-22) && x.seen.croire === iso(-15) && x.seen.croyances === iso(-8) && x.seen.objectifs === iso(-1), 'reprise : une étape ouverte par semaine écoulée');
    ok(!!x.seen.emotions && !!x.seen.enfant, 'reprise : les étapes déjà faites restent ouvertes');
    await page.click(A('back')); await page.waitForTimeout(150);
    ok((await sous(page, 3)) === 'Ouverte' && (await sous(page, 4)) === 'Faite' && (await sous(page, 5)) === 'Cette semaine' && (await sous(page, 6)) === 'Plus tard', 'reprise : quatre étapes ouvertes par les semaines écoulées, et celle qui suit une étape déjà faite');
    ok(errs.length === 0, 'aucune erreur (reprise) ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  // ---------- 5. Avec les animations : seul le nouveau morceau est animé ----------
  {
    const { ctx, page, errs } = await ouvre(browser, Object.assign({}, BASE_DATA, { tier: 'parcours', start: iso(0), steps: {}, pv: 2, seen: {}, notes: {}, atelier: true, tout: true }), { anim: true });
    await parcours(page); await page.waitForTimeout(1500);
    await page.click(A('step', '[data-i="1"]')); await page.waitForTimeout(1800);
    ok((await page.$$('.sp.neuf')).length === 0, 'animations : rien n’est animé à l’arrivée');
    await page.click(A('schnext')); await page.waitForTimeout(80);
    const a = await page.evaluate(() => { const g = document.querySelector('.sp.neuf'); return g ? { p: g.dataset.p, anim: getComputedStyle(g).animationName } : null; });
    ok(a && a.p === '2' && a.anim === 'sch-in', 'animations : le morceau qui apparaît est animé (' + JSON.stringify(a) + ')');
    await page.click(A('schnext')); await page.waitForTimeout(80);
    ok((await page.$$('.sp.neuf')).length === 1 && (await page.$eval('.sp.neuf', g => g.dataset.p)) === '3', 'animations : un seul morceau à la fois');
    ok(errs.length === 0, 'aucune erreur (animations) ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  await browser.close();
  console.log(`parcours : ${n} vérifications, ${ko} échec${ko > 1 ? 's' : ''}`);
  process.exit(ko ? 1 : 0);
})();
