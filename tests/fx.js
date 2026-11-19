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
  let s = await shot('.seuil ' + A('entrer', '[data-v="parcours"]'), 'entree', [120, 300, 480, 660, 840, 1100]);
  ok(/D’où je pars/.test(await page.$eval('h1', e => e.textContent)) && !!(await page.$('.tabs')), 'entrée : un geste, et la première étape du parcours est affichée');
  ok(s[0].vt === !OLD && (OLD ? s[0].nav : true), 'entrée : le changement d’écran est en cours juste après le toucher (' + JSON.stringify(s[0]) + ')');
  ok(OLD ? (s.some(x => x.voile > 0) && s[1].fxe >= 2) : (s[1].onde && s[1].fxe === 0), OLD ? 'entrée (navigateur ancien) : les blocs remontent l’un après l’autre' : 'entrée : l’onde de lumière traverse l’écran, et les blocs n’ont pas à arriver un par un (' + JSON.stringify(s[1]) + ')');
  ok(!(await page.evaluate(() => document.querySelector(':root').matches(':active-view-transition') || /fx-(nav|onde|ring)/.test(document.documentElement.className) || getComputedStyle(document.getElementById('onde') || document.body).display === 'block' && !!document.getElementById('onde'))), 'entrée : tout est terminé ensuite, l’anneau de lumière est retiré');
  // le prénom, par la feuille de personnalisation
  await page.click('.tab' + A('go', '[data-view="today"]')); await page.waitForTimeout(1900);
  await page.click('.card.perso ' + A('onboard')); await page.waitForTimeout(900); await page.fill('#ob-me', 'Camille'); await page.click(A('ob-done')); await page.waitForTimeout(1900);
  ok(/Camille/.test(await page.$eval('h1', e => e.textContent)) && !(await page.$('.sheet')), 'personnalisation : le prénom est pris, la feuille est refermée');
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
  await page.click(A('mood', '[data-i="2"]')); await page.waitForTimeout(80);
  ok((await page.evaluate(() => [...document.querySelectorAll('#app .card,#app .dose')].filter(e => parseFloat(getComputedStyle(e).opacity) < 0.98).length)) === 0, 'même écran redessiné : l’arrivée ne rejoue pas');

  // --- le dépôt : le texte se dissout, la réponse remonte
  await page.click('.portes ' + A('porte', '[data-v="deposer"]')); await page.waitForTimeout(1900);
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
  await page.click('.hint ' + A('voix')); await page.waitForTimeout(60);
  const op = await page.evaluate(() => { const t = document.querySelector('.toast'); return t ? parseFloat(getComputedStyle(t).opacity) : -1; });
  ok(op > 0.9, 'message bref : toujours pleinement visible juste après un nouvel affichage de l’écran (opacité ' + op + ')');
  await page.waitForTimeout(3600); ok(!(await page.$('.toast')), 'message bref : retiré la deuxième fois aussi');
  await page.keyboard.press('Escape'); await page.waitForTimeout(900);
  // --- souffler : le cercle s'ouvre et se referme, sans rien d'estompé, et le mot suit
  await page.click(A('back')); await page.waitForTimeout(1900);
  await page.click('.portes ' + A('porte', '[data-v="souffle"]')); await page.waitForTimeout(2400);
  { const a = await page.evaluate(() => ({ mot: document.getElementById('souffle-mot').textContent, s: parseFloat(getComputedStyle(document.querySelector('.souffle .ronds')).getPropertyValue('--s')) }));
    await page.waitForTimeout(2600); const b = await page.evaluate(() => ({ mot: document.getElementById('souffle-mot').textContent, s: parseFloat(getComputedStyle(document.querySelector('.souffle .ronds')).getPropertyValue('--s')) }));
    await page.waitForTimeout(4000); const c = await page.evaluate(() => ({ mot: document.getElementById('souffle-mot').textContent, s: parseFloat(getComputedStyle(document.querySelector('.souffle .ronds')).getPropertyValue('--s')), dim: [...document.querySelectorAll('.souffle *')].filter(e => parseFloat(getComputedStyle(e).opacity) < 0.98).length }));
    ok(a.mot === 'Inspirez' && b.mot === 'Inspirez' && b.s > a.s + 0.2 && c.mot === 'Expirez' && c.s < b.s - 0.1 && c.dim === 0, 'souffler : le cercle s’ouvre à l’inspiration et se referme à l’expiration, rien n’est estompé ' + JSON.stringify([a, b, c])); }
  await page.click(A('souffle-stop')); await page.waitForTimeout(300); await page.click(A('back')); await page.waitForTimeout(1900);
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
    const sharp = require('sharp'); const rd = async f => (await sharp(OUT + '/' + f).removeAlpha().raw().toBuffer()); const diff = (x, y) => { let k = 0; for (let i = 0; i < x.length; i += 3) if (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]) > 24) k++; return k / (x.length / 3); };
    // La vitrine est un carnet posé sur une table, sans photo : aucun calque d'eau n'y est posé, et une fois l'écran arrivé plus rien ne bouge.
    { const clip = { x: 0, y: 0, width: W, height: 700 }; const vus = []; const t0 = Date.now();
      for (const ms of [600, 1300, 2200, 3200]) { const d = ms - (Date.now() - t0); if (d > 0) await p.waitForTimeout(d); vus.push((await p.$$('canvas.eau')).length); }
      await p.waitForTimeout(2400); await p.screenshot({ path: OUT + '/accueil-calme.png', clip }); await p.waitForTimeout(900); await p.screenshot({ path: OUT + '/accueil-calme2.png', clip });
      ok(vus.every(v => v === 0) && !!(await p.$('.seuil .fiche-b')), 'accueil : le carnet n’a pas de photo, aucun calque d’eau n’y est posé (' + vus.join(',') + ')');
      ok(diff(await rd('accueil-calme2.png'), await rd('accueil-calme.png')) === 0, 'accueil : une fois l’écran arrivé, plus rien ne bouge'); }
    // « Aujourd'hui » : la goutte du bandeau saute à l'arrivée, l'onde part, puis tout redevient calme
    await p.click('.seuil ' + A('entrer', '[data-v="today"]')).catch(() => p.$eval('.acc-fin ' + A('entrer'), e => e.click())); await p.waitForTimeout(2600);
    ok((await eau('.band')) > 0, '« Aujourd’hui » : la goutte du bandeau saute, l’onde part');
    await p.waitForTimeout(5600); ok(!(await eau('.band')), '« Aujourd’hui » : le calque s’enlève ensuite');
    // Le bandeau garde la photo de l'étang : l'eau y répond au doigt. Un point de la photo (866 × 470) est converti en point de l'écran.
    await p.evaluate(() => scrollTo(0, 0));
    const pt = (ix, iy) => p.$eval('.band', (e, [ix, iy]) => { const r = e.getBoundingClientRect(), k = Math.max(r.width / 866, r.height / 470); const m = getComputedStyle(e).backgroundPosition.match(/(-?[\d.]+)%\s+(-?[\d.]+)%/); const px = m ? m[1] / 100 : .5, py = m ? m[2] / 100 : .5; return { x: Math.round(r.left + (r.width - 866 * k) * px + ix * k), y: Math.round(r.top + (r.height - 470 * k) * py + iy * k) }; }, [ix, iy]);
    const bandClip = await p.$eval('.band', e => { const r = e.getBoundingClientRect(); return { x: 0, y: Math.max(0, Math.round(r.top)), width: innerWidth, height: Math.round(Math.min(r.height, 150)) }; });
    await p.screenshot({ path: OUT + '/bandeau-calme.png', clip: bandClip });
    // toucher l'eau : une onde naît sous le doigt ; toucher la forêt : rien
    { const e1 = await pt(150, 300); await tap(p, e1.x, e1.y); await p.waitForTimeout(900);
      ok((await eau('.band')) > 0, 'toucher l’eau : une onde naît sous le doigt ' + JSON.stringify(e1)); await p.screenshot({ path: OUT + '/toucher-0900.png', clip: bandClip });
      ok(diff(await rd('toucher-0900.png'), await rd('bandeau-calme.png')) > 0.002, 'toucher l’eau : l’eau bouge vraiment');
      await p.waitForTimeout(4600); ok(!(await eau('.band')), 'toucher l’eau : le calque s’enlève quand l’onde s’est éteinte');
      const e2 = await pt(250, 60); await tap(p, e2.x, e2.y); await p.waitForTimeout(500);
      ok(!(await eau('.band')), 'toucher la forêt : l’eau ne bouge pas ' + JSON.stringify(e2)); }
    // toucher la goutte : elle rebondit, et l'onde part quand elle touche l'eau
    { const g = await pt(434.8, 180); await tap(p, g.x, g.y); await p.waitForTimeout(700);
      ok((await eau('.band')) > 0, 'toucher la goutte : elle rebondit (le calque est là) ' + JSON.stringify(g)); await p.screenshot({ path: OUT + '/goutte-0700.png', clip: bandClip });
      await p.waitForTimeout(5200); ok(!(await eau('.band')), 'toucher la goutte : tout redevient calme ensuite');
      await p.screenshot({ path: OUT + '/bandeau-calme3.png', clip: bandClip }); ok(diff(await rd('bandeau-calme3.png'), await rd('bandeau-calme.png')) === 0, 'après le rebond, la photo est exactement comme avant'); }
    // souffler : l'étang a sa propre photo et ses cercles dessinés. Aucun calque d'eau n'y est posé, et à chaque expiration un cercle de plus part sur l'eau.
    await p.click('.portes ' + A('porte', '[data-v="souffle"]')); await p.waitForTimeout(1400 + 4000 + 900);
    { const so = await p.evaluate(() => { const b = document.querySelector('.souffle .ronds b'), im = document.querySelector('.souffle .etang-photo'), r = document.querySelector('.souffle .ronds').getBoundingClientRect(), h = document.querySelector('.souffle .etang').getBoundingClientRect(); return { mot: document.getElementById('souffle-mot').textContent, onde: !!b && b.classList.contains('onde'), anim: b ? getComputedStyle(b).animationName : '', photo: !!im && im.complete && im.naturalWidth > 0, eau: document.querySelectorAll('canvas.eau').length, surLEau: r.top + r.height / 2 > h.top + h.height * .45 && r.bottom < h.bottom + 2, large: Math.round(r.width) }; });
      ok(so.mot === 'Expirez' && so.onde && so.anim === 'et-onde' && so.photo && so.eau === 0 && so.surLEau && so.large >= 170, 'souffler : la photo de l’étang est là, les cercles sont posés sur l’eau, et à l’expiration un cercle part sur l’étang ' + JSON.stringify(so)); }
    await p.click(A('souffle-stop')); await p.waitForTimeout(4600);
    ok(await p.evaluate(() => { const b = document.querySelector('.souffle .ronds b'); const bc = getComputedStyle(b).borderTopColor; return /rgba\(255, 255, 255, 0\)|transparent/.test(bc) || !b.classList.contains('onde'); }), 'souffler : arrêté, l’étang redevient calme');
    await p.click(A('back')); await p.waitForTimeout(2600);
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
