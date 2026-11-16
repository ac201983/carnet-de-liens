// Les effets visuels (« l'eau calme »), animations activées.
// 1) Dans un navigateur ordinaire (ici sans carte graphique, donc l'eau reste éteinte) : tous les écrans se parcourent sans erreur,
//    rien ne reste à moitié visible ou décalé, l'onde de lumière du changement d'écran se voit (images prises en cours de route),
//    puis le dépôt, les messages brefs, une feuille, le réglage dans « Moi ».
// 2) Avec une carte graphique émulée : l'eau de la photo (accueil, sous le doigt, « Aujourd'hui », « Mon histoire »), puis le calme.
// usage : node fx.js [largeur] [ancien] [lumiere]
//   ancien  = navigateur sans fondu d'écran, sans défilement animé et sans carte graphique
//   lumiere = garder la lumière qui se lève pendant la mesure de l'eau (par défaut on la retire pour ne mesurer que l'eau)
const { chromium } = require('playwright');
const fs = require('fs');
const { walk, APP, A } = require('./walk');
const W = parseInt(process.argv[2] || '390', 10);
const OLD = process.argv[3] === 'ancien';
const OUT = '/home/claude/build/fx/frames'; fs.mkdirSync(OUT, { recursive: true });
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL ' + m); } };
const errs = [];
const listen = page => { page.on('console', m => { if (m.type() === 'error' && !/status of 404/.test(m.text())) errs.push(m.text().slice(0, 200)); }); page.on('pageerror', e => errs.push('pageerror ' + String(e).slice(0, 200))); };
const OPTS = { viewport: { width: W, height: 844 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: true };
const tap = async (page, x, y) => { await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.up(); };

(async () => {
  // ------------------------------------------------------------------ 1) navigateur ordinaire
  const browser = await chromium.launch();
  const ctx = await browser.newContext(OPTS);
  if (OLD) await ctx.addInitScript(() => { try { delete Document.prototype.startViewTransition; } catch (e) { } const sup = CSS.supports.bind(CSS); CSS.supports = (a, b) => (/animation-(timeline|range)/.test(String(a)) ? false : sup(a, b)); const gc = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, o) { return /webgl/.test(String(t)) ? null : gc.call(this, t, o); }; });
  const page = await ctx.newPage(); listen(page);
  let n = 0; const bad = [];
  const visit = async name => {
    await page.waitForTimeout(1900); n++; // l'arrivée des blocs dure un peu moins d'une seconde et demie
    const r = await page.evaluate(() => {
      const vh = innerHeight, out = { dim: [], eau: document.querySelector('canvas.eau') ? 1 : 0, over: document.documentElement.scrollWidth > innerWidth + 1, vt: !!document.querySelector(':root').matches(':active-view-transition') };
      for (const el of document.querySelectorAll('#app *')) {
        const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const b = el.getBoundingClientRect(); if (!b.height || b.bottom < 60 || b.top > vh - 86 - 170) continue;
        if (el.closest('.sheet,.toast,.breath,.dotp,.surface,[disabled]')) continue;
        const nom = el.tagName.toLowerCase() + '.' + el.className.toString().replace(/\s+/g, '.');
        if (parseFloat(cs.opacity) < 0.98 && el.classList.length) out.dim.push(nom + ' opacité ' + cs.opacity);
        if (el.classList.contains('fxe') && cs.filter !== 'none') out.dim.push(nom + ' encore flou ' + cs.filter);
        if ((el.classList.contains('fxe') || (el.classList.contains('fxr') && b.top < vh - 86 - 280)) && cs.transform !== 'none' && Math.abs(new DOMMatrixReadOnly(cs.transform).m42) > 0.5) out.dim.push(nom + ' pas posé ' + cs.transform);
      }
      return out;
    });
    if (r.dim.length || r.eau || r.over || r.vt) bad.push(name + ' ' + JSON.stringify(r).slice(0, 320));
    // tout en bas de la page : le dernier bloc doit être pleinement lisible et posé à sa place lui aussi
    const end = await page.evaluate(async wait => { const y0 = scrollY; scrollTo(0, document.documentElement.scrollHeight); await new Promise(r => setTimeout(r, wait)); const vh = innerHeight; const dim = []; for (const el of document.querySelectorAll('.fxr')) { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); const dy = cs.transform === 'none' ? 0 : Math.abs(new DOMMatrixReadOnly(cs.transform).m42); if (b.bottom > 0 && b.top < vh - 92 && (parseFloat(cs.opacity) < 0.98 || dy > 0.5)) dim.push(el.className + ' opacité ' + cs.opacity + ' décalage ' + dy.toFixed(1) + ' top=' + Math.round(b.top)); } scrollTo(0, y0); await new Promise(r => setTimeout(r, 100)); return dim; }, OLD ? 1400 : 750);
    if (end.length) bad.push(name + ' (bas de page) ' + JSON.stringify(end).slice(0, 300));
  };
  await walk(page, visit);
  ok(!bad.length, 'après chaque écran : rien d’estompé ni de flou, chaque bloc posé à sa place, pas de calque d’eau sans carte graphique, pas de débordement\n   ' + bad.join('\n   '));

  // --- l'arrivée des blocs et le changement d'écran, en images
  await page.evaluate(() => localStorage.clear()); await page.goto(APP); await page.waitForTimeout(700);
  ok(await page.evaluate(() => document.documentElement.classList.contains('fx')), 'effets actifs quand le téléphone ne demande pas moins d’animations');
  ok((await page.evaluate(() => typeof document.startViewTransition === 'function')) === !OLD && (await page.evaluate(() => document.documentElement.classList.contains('fxsd'))) === !OLD, OLD ? 'navigateur ancien simulé : ni fondu d’écran ni défilement animé' : 'le navigateur de test sait faire le fondu d’écran et les animations liées au défilement');
  await page.click('#consent [data-consent="no"]'); await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(900); await page.fill('#ob-me', 'Camille');
  // touche un bouton, puis photographie et relève l'état à plusieurs instants
  const shot = async (sel, name, delays) => {
    const el = await page.waitForSelector(sel, { timeout: 5000 }); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(200);
    const b = await el.boundingBox(); await tap(page, b.x + b.width / 2, b.y + b.height / 2); const t0 = Date.now(); const seen = [];
    for (const d of delays) {
      const w = d - (Date.now() - t0); if (w > 0) await page.waitForTimeout(w);
      seen.push(await page.evaluate(() => ({ vt: !!document.querySelector(':root').matches(':active-view-transition'), nav: document.documentElement.classList.contains('fx-nav'), onde: document.documentElement.classList.contains('fx-onde') && document.documentElement.classList.contains('fx-ring') && !!document.getElementById('onde') && getComputedStyle(document.getElementById('onde')).display === 'block', voile: [...document.querySelectorAll('.fxe')].filter(e => parseFloat(getComputedStyle(e).opacity) < 0.9).length, fxe: document.querySelectorAll('.fxe').length })));
      await page.screenshot({ path: `${OUT}/${name}-${String(d).padStart(4, '0')}.png` });
    }
    await page.waitForTimeout(1700); return seen;
  };
  let s = await shot(A('ob-done'), 'entree', [120, 300, 480, 660, 840, 1100]);
  ok(/Camille/.test(await page.$eval('h1', e => e.textContent)), 'entrée : « Aujourd’hui » affiché');
  ok(s[0].vt === !OLD && (OLD ? s[0].nav : true), 'entrée : le changement d’écran est en cours juste après le toucher (' + JSON.stringify(s[0]) + ')');
  ok(OLD ? (s.some(x => x.voile > 0) && s[1].fxe >= 2) : (s[1].onde && s[1].fxe === 0), OLD ? 'entrée (navigateur ancien) : les blocs remontent l’un après l’autre' : 'entrée : l’onde de lumière traverse l’écran, et les blocs n’ont pas à arriver un par un (' + JSON.stringify(s[1]) + ')');
  ok(!(await page.evaluate(() => document.querySelector(':root').matches(':active-view-transition') || /fx-(nav|onde|ring)/.test(document.documentElement.className) || getComputedStyle(document.getElementById('onde') || document.body).display === 'block' && !!document.getElementById('onde'))), 'entrée : tout est terminé ensuite, l’anneau de lumière est retiré');
  s = await shot('.tab' + A('go', '[data-view="kit"]'), 'onglet', [100, 250, 400, 550, 700, 850, 1000]);
  ok(/outils/i.test(await page.$eval('h1', e => e.textContent)) && (OLD ? s.some(x => x.voile > 0) : s[2].onde), 'onglet : « La boîte à outils » affichée, ' + (OLD ? 'avec ses blocs qui arrivent' : 'derrière l’onde de lumière'));
  await page.click('.tab' + A('go', '[data-view="parcours"]')); await page.waitForTimeout(1900);
  await shot(A('step', '[data-i="0"]'), 'etape', [120, 300, 480, 660, 900]);
  await shot(A('back'), 'retour', [120, 300, 480, 660, 900]);
  ok(/Le parcours/.test(await page.$eval('h1', e => e.textContent)) && !(await page.evaluate(() => /fx-(nav|onde|ring)/.test(document.documentElement.className))), 'retour : écran précédent, et l’état de passage est bien retiré');
  // deux onglets touchés coup sur coup : le deuxième toucher compte, même si la première onde court encore (le navigateur, lui, ne dit plus ce qu'il y a sous le doigt)
  {
    const c = async v => { const bx = await (await page.$('.tab' + A('go', '[data-view="' + v + '"]'))).boundingBox(); return [bx.x + bx.width / 2, bx.y + bx.height / 2]; };
    const p1 = await c('kit'), p2 = await c('today');
    await tap(page, p1[0], p1[1]); await page.waitForTimeout(OLD ? 250 : 550); await tap(page, p2[0], p2[1]); await page.waitForTimeout(350);
    const mid = await page.evaluate(() => { const i = document.querySelector('#onde i'); return { h: document.querySelector('main.view h1').textContent, ring: document.documentElement.classList.contains('fx-ring'), op: i ? getComputedStyle(i).opacity : '-' }; });
    ok(/Camille/.test(mid.h) && (OLD || (mid.ring && mid.op === '1')), 'deux onglets touchés coup sur coup : le deuxième toucher est pris en compte' + (OLD ? '' : ', et sa propre onde garde son anneau') + ' (' + JSON.stringify(mid) + ')');
    // pendant l'onde, toucher un endroit sans bouton ne coupe pas l'onde ; toucher un bouton de l'écran la coupe, et le bouton répond
    if (!OLD) {
      const vtOn = () => page.evaluate(() => document.querySelector(':root').matches(':active-view-transition'));
      await page.waitForTimeout(1900);
      await tap(page, p1[0], p1[1]); await page.waitForTimeout(450);          // vers « Outils » : l'onde est en route
      const vide = await page.evaluate(() => { const r = document.querySelector('main.view h1').getBoundingClientRect(); return [innerWidth - 14, r.top + r.height / 2]; });
      await tap(page, vide[0], vide[1]); await page.waitForTimeout(60);
      ok(await vtOn(), 'pendant l’onde, toucher un endroit sans bouton : l’onde continue');
      const cb = await page.evaluate(() => { const b = document.querySelectorAll('[data-act="age"]')[1]; if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
      ok(!!cb, 'les filtres d’âge sont à l’écran');
      if (cb) {
        await tap(page, cb[0], cb[1]); await page.waitForTimeout(120);
        const apres = await page.evaluate(() => { const b = document.querySelectorAll('[data-act="age"]')[1]; return { presse: !!b && b.getAttribute('aria-pressed') === 'true', vt: document.querySelector(':root').matches(':active-view-transition') }; });
        ok(apres.presse && !apres.vt, 'pendant l’onde, toucher un bouton de l’écran : il répond tout de suite, et l’écran est entier (' + JSON.stringify(apres) + ')');
        await page.waitForTimeout(400); await page.click('[data-act="age"] >> nth=0'); await page.waitForTimeout(200);
      }
      await tap(page, p2[0], p2[1]);
    }
    await page.waitForTimeout(1900);
    ok(!(await page.evaluate(() => /fx-(nav|onde|ring)/.test(document.documentElement.className))), 'deux onglets coup sur coup : l’état de passage est bien retiré ensuite');
  }
  // un nouvel affichage du même écran ne rejoue pas l'arrivée
  await page.click('.tab' + A('go', '[data-view="today"]')); await page.waitForTimeout(2400);
  await page.click(A('dmode', '[data-v="advice"]')); await page.waitForTimeout(80);
  ok((await page.evaluate(() => [...document.querySelectorAll('#app .card,#app .dose')].filter(e => parseFloat(getComputedStyle(e).opacity) < 0.98).length)) === 0, 'même écran redessiné : l’arrivée ne rejoue pas');

  // --- le dépôt : le texte se dissout, la réponse remonte
  await page.fill('#draft', 'Ce soir j’ai crié et je m’en veux.'); await page.$eval('#draft', e => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(200);
  await page.click(A('dsend')); await page.waitForTimeout(260); await page.screenshot({ path: OUT + '/depot-0260.png' });
  await page.waitForTimeout(300); await page.screenshot({ path: OUT + '/depot-0560.png' }); await page.waitForTimeout(500); await page.screenshot({ path: OUT + '/depot-1060.png' }); await page.waitForTimeout(500); await page.screenshot({ path: OUT + '/depot-1560.png' }); await page.waitForTimeout(1600);
  ok(await page.$('.mirror .q') && (await page.$eval('#draft', e => e.value)) === '' && (await page.evaluate(() => JSON.parse(localStorage.getItem('pepe-v1')).depots.length)) === 1, 'dépôt : un seul dépôt enregistré, champ vidé, réponse affichée');
  await page.waitForTimeout(400);
  const flou = await page.$eval('.mirror', e => [e, ...e.querySelectorAll('*')].filter(x => parseFloat(getComputedStyle(x).opacity) < 0.98 || getComputedStyle(x).filter !== 'none').map(x => x.tagName + '.' + x.className + ' ' + getComputedStyle(x).opacity + ' ' + getComputedStyle(x).filter));
  ok(!flou.length, 'dépôt : la réponse et chacune de ses lignes sont pleinement visibles et nettes à la fin ' + flou.join(' | '));
  // --- le message bref : il repart en douceur, et ne rejoue pas son apparition si l'écran est redessiné pendant qu'il est là
  await page.waitForTimeout(1200); ok(!(await page.$('.toast')), 'message bref : retiré après s’être effacé');
  await page.fill('#draft', 'Une autre chose qui pèse ce soir.'); await page.click(A('dsend')); await page.waitForSelector('.toast', { timeout: 4000 }); await page.waitForTimeout(700);
  await page.click(A('dmode', '[data-v="listen"]')); await page.waitForTimeout(60);
  const op = await page.evaluate(() => { const t = document.querySelector('.toast'); return t ? parseFloat(getComputedStyle(t).opacity) : -1; });
  ok(op > 0.9, 'message bref : toujours pleinement visible juste après un nouvel affichage de l’écran (opacité ' + op + ')');
  await page.waitForTimeout(3600); ok(!(await page.$('.toast')), 'message bref : retiré la deuxième fois aussi');
  // --- une feuille qui se referme : elle s'efface, et rien ne reste bloqué
  await page.click('.tab' + A('go', '[data-view="parcours"]')); await page.waitForTimeout(1900);
  const lock = await page.$(A('upgrade'));
  ok(!!lock, 'parcours : une étape verrouillée ouvre la feuille des formules');
  if (lock) { await lock.scrollIntoViewIfNeeded(); await lock.click(); await page.waitForSelector('.sheet', { timeout: 3000 }); await page.waitForTimeout(700); await page.click('.sheet ' + A('sheet-close')); await page.waitForTimeout(1000); ok(!(await page.$('.sheet')) && !(await page.evaluate(() => document.querySelector(':root').matches(':active-view-transition'))), 'feuille : refermée, fondu terminé'); }

  // --- « Moi » : le réglage dit si l'eau a pu démarrer, et il coupe tout
  await page.click('.tab' + A('go', '[data-view="me"]')); await page.waitForTimeout(1900);
  ok(/sans l’eau/.test(await page.$eval(A('fx') + ' .state', e => e.textContent)), 'réglage : sans carte graphique, il indique « Activés, sans l’eau »');
  await page.click(A('fx')); await page.waitForTimeout(200);
  ok(!(await page.evaluate(() => document.documentElement.classList.contains('fx'))) && (await page.evaluate(() => JSON.parse(localStorage.getItem('pepe-v1')).fxOff)) === true, 'réglage : effets coupés et choix mémorisé');
  await page.click('.tab' + A('go', '[data-view="today"]')); ok(/Camille/.test(await page.$eval('h1', e => e.textContent)) && (await page.$$('.fxe,.fxr')).length === 0, 'effets coupés : le changement d’écran est immédiat, aucun bloc animé');
  await page.reload(); await page.waitForTimeout(500); ok(!(await page.evaluate(() => document.documentElement.classList.contains('fx'))), 'effets coupés : toujours coupés après rechargement');
  await browser.close();

  // ------------------------------------------------------------------ 2) l'eau, avec une carte graphique émulée (lente ici, d'où la garde levée)
  if (!OLD) {
    const b2 = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
    const c2 = await b2.newContext(OPTS); await c2.addInitScript(() => { window.__eauSansGarde = true; });
    const p = await c2.newPage(); listen(p);
    const eau = sel => p.evaluate(sel => { const c = document.querySelector(sel + '>canvas.eau'); return c ? c.width * c.height : 0; }, sel);
    await p.goto(APP); await p.waitForTimeout(600);
    // la lumière qui se lève change à elle seule une bonne part de la photo : on la retire ici pour ne mesurer que l'eau
    if (process.argv[4] !== 'lumiere') await p.addStyleTag({ content: '.lum .herofull::before{display:none!important}' });
    const heroClip = { x: 0, y: 0, width: W, height: 340 }; const seen = []; const t0 = Date.now();
    for (const ms of [600, 1300, 2200, 3200, 4300]) { const d = ms - (Date.now() - t0); if (d > 0) await p.waitForTimeout(d); await p.screenshot({ path: OUT + '/accueil-' + String(ms).padStart(4, '0') + '.png', clip: heroClip }); seen.push(await eau('.herofull')); }
    await p.waitForTimeout(3200); await p.screenshot({ path: OUT + '/accueil-calme.png', clip: heroClip });
    ok(seen.filter(v => v > 0).length >= 3, 'accueil : le calque de l’eau est là pendant que l’onde passe (' + seen.join(',') + ')');
    ok(!(await eau('.herofull')), 'accueil : le calque s’enlève tout seul quand l’onde s’est éteinte');
    const sharp = require('sharp'); const rd = async f => (await sharp(OUT + '/' + f).removeAlpha().raw().toBuffer()); const diff = (x, y) => { let k = 0; for (let i = 0; i < x.length; i += 3) if (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]) > 24) k++; return k / (x.length / 3); };
    const calm = await rd('accueil-calme.png'); const d1 = diff(await rd('accueil-2200.png'), calm);
    ok(d1 > 0.004 && d1 < 0.35, 'accueil : l’eau bouge vraiment, sans tout bouleverser (' + (d1 * 100).toFixed(1) + ' % des points changent à 2,2 s)');
    await p.waitForTimeout(800); await p.screenshot({ path: OUT + '/accueil-calme2.png', clip: heroClip });
    ok(diff(await rd('accueil-calme2.png'), calm) === 0, 'accueil : une fois calme, plus rien ne bouge');
    // toucher l'eau : une onde naît sous le doigt ; toucher la forêt : rien
    await tap(p, Math.round(W * .22), 150); await p.waitForTimeout(900);
    ok((await eau('.herofull')) > 0, 'toucher l’eau : une onde naît sous le doigt'); await p.screenshot({ path: OUT + '/toucher-0900.png', clip: heroClip });
    await p.waitForTimeout(4600); ok(!(await eau('.herofull')), 'toucher l’eau : le calque s’enlève quand l’onde s’est éteinte');
    await tap(p, Math.round(W * .5), 40); await p.waitForTimeout(500);
    ok(!(await eau('.herofull')), 'toucher la forêt : l’eau ne bouge pas');
    // toucher la goutte : elle rebondit, et l'onde part quand elle touche l'eau
    const g = await p.$eval('.herofull .herobg', e => { const r = e.getBoundingClientRect(), k = Math.max(r.width / 866, r.height / 470); return { x: r.left + r.width / 2 + (434.8 - 433) * k, y: r.top + r.height / 2 + (167.5 - 235) * k }; });
    await tap(p, Math.round(g.x), Math.round(g.y)); await p.waitForTimeout(700);
    ok((await eau('.herofull')) > 0, 'toucher la goutte : elle rebondit (le calque est là)'); await p.screenshot({ path: OUT + '/goutte-0700.png', clip: heroClip });
    await p.waitForTimeout(5200); ok(!(await eau('.herofull')), 'toucher la goutte : tout redevient calme ensuite');
    await p.screenshot({ path: OUT + '/accueil-calme3.png', clip: heroClip }); ok(diff(await rd('accueil-calme3.png'), calm) === 0, 'après le rebond, la photo est exactement comme avant');
    // « Aujourd'hui » : l'onde part aussi de la goutte du bandeau, puis tout redevient calme
    await p.click('#consent [data-consent="no"]'); await p.click('.herofull ' + A('onboard')); await p.waitForTimeout(900); await p.click(A('ob-done')); await p.waitForTimeout(2600);
    ok((await eau('.band')) > 0, '« Aujourd’hui » : la goutte du bandeau saute, l’onde part');
    await p.waitForTimeout(5600); ok(!(await eau('.band')), '« Aujourd’hui » : le calque s’enlève ensuite');
    for (const [v, nom] of [['parcours', 'Parcours'], ['kit', 'Outils']]) { await p.click('.tab' + A('go', '[data-view="' + v + '"]')); await p.waitForTimeout(3000); ok((await eau('.band')) > 0, 'onglet « ' + nom + ' » : la goutte saute là aussi'); await p.waitForTimeout(4200); ok(!(await eau('.band')), 'onglet « ' + nom + ' » : puis tout redevient calme'); }
    await p.click('.tab' + A('go', '[data-view="me"]')); await p.waitForTimeout(2600);
    ok((await eau('.band')) > 0, 'onglet « Moi » : la goutte saute là aussi');
    ok((await p.$eval(A('fx') + ' .state', e => e.textContent)).trim() === 'Activés', 'réglage : avec une carte graphique, il indique « Activés »');
    // « Mon histoire »
    await p.click(A('about')).catch(() => { }); await p.waitForTimeout(400);
    if (!(await p.$('.band.story'))) { await p.goto(APP + '#histoire'); }
    await p.waitForTimeout(2600); ok((await eau('.band.story')) > 0, '« Mon histoire » : l’onde part de la goutte'); await p.waitForTimeout(5200); ok(!(await eau('.band.story')), '« Mon histoire » : le calque s’enlève ensuite');
    await b2.close();
  }
  console.log((fails ? fails + ' échec(s)' : 'effets' + (OLD ? ' (navigateur ancien simulé)' : '') + ' : tout passe (' + n + ' écrans, largeur ' + W + ')') + ' | erreurs console : ' + (errs.length ? errs.slice(0, 5).join(' | ') : 'aucune'));
  process.exit(fails || errs.length ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
