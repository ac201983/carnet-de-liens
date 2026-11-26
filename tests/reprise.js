// La reprise des notes : un parent venu sur le site officiel avant le 26 novembre 2026 retrouve tout ce qu'il y a écrit
// quand le site reçoit la nouvelle version (celle qui a été mise au point dans la version d'essai).
//
// Dans l'atelier (sans PEPE_ORIGIN) : l'essai visite d'abord l'ancien site lui-même, tel qu'il était en ligne, et y écrit comme un parent.
//   Puis le même navigateur (mêmes notes sur l'appareil) ouvre le nouveau site à la même adresse.
//   Un serveur sert le dossier /tmp/reprise/site (un lien) à l'adresse PEPE_REPRISE (https://localhost:8447 par défaut).
//   PEPE_ANCIEN : le dossier de l'ancien site. PEPE_NOUVEAU : le dossier du site fabriqué. L'essai fait pointer le lien vers l'un puis vers l'autre.
//   Avec --ecrit, les notes que l'ancien site vient de ranger sont enregistrées dans reprise-notes.json.
// En ligne (avec PEPE_ORIGIN) : l'ancien site n'existe plus. L'essai pose sur l'appareil les notes de reprise-notes.json, qui ont été écrites
//   par l'ancien site lui-même dans l'atelier (un parent inventé, des textes inventés), puis ouvre le site comme ce parent le ferait.
// Variables : PEPE_ORIGIN, PEPE_BASE, PEPE_KEY, PEPE_NAV (chromium, firefox ou webkit), PEPE_CHROME.
const pw = require('playwright'); const fs = require('fs'); const path = require('path');
const NAV = process.env.PEPE_NAV || 'chromium';
const EN_LIGNE = !!process.env.PEPE_ORIGIN;
const ORIGIN = EN_LIGNE ? process.env.PEPE_ORIGIN.replace(/\/$/, '') : (process.env.PEPE_REPRISE || 'https://localhost:8447');
const BASE = EN_LIGNE ? (process.env.PEPE_BASE || '/') : '/';
const KEY = process.env.PEPE_KEY || 'pepe-v1', KEY_AVANT = KEY + '-avant-2026-11-26';
const LIEN = '/tmp/reprise/site', FIXE = path.join(__dirname, 'reprise-notes.json');
const ANCIEN = process.env.PEPE_ANCIEN || '/home/claude/build/officiel/ancien-site', NOUVEAU = process.env.PEPE_NOUVEAU || '/home/claude/dev/site';
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
let n = 0, ko = 0; const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC : ' + m); } };
const pointe = d => { try { fs.unlinkSync(LIEN); } catch (e) { } fs.symlinkSync(d, LIEN); };
const D1 = 'Ce soir, je suis fatiguée et je me sens seule.', D2 = 'Il a refusé de mettre ses chaussures, et j’ai crié. « Encore » ! <3', N1 = 'Je pars de loin.\nMais je pars.';
(async () => {
  const LOCAL = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
  const exe = NAV === 'chromium' ? (process.env.PEPE_CHROME || (fs.existsSync(LOCAL) ? LOCAL : undefined)) : undefined;
  const b = await pw[NAV].launch(Object.assign({}, NAV === 'chromium' ? { args: ['--ignore-certificate-errors'] } : {}, exe ? { executablePath: exe } : {}));
  const opts = Object.assign({ viewport: { width: 390, height: 664 }, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce', hasTouch: true }, NAV === 'chromium' ? { isMobile: true } : {});
  const errs = []; const ecoute = p => { p.on('pageerror', e => errs.push(String(e).slice(0, 200))); p.on('console', m => { if (m.type() === 'error' && !/favicon|ERR_/.test(m.text())) errs.push(m.text().slice(0, 200)); }); };
  const touche = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('introuvable : ' + s); e.click(); }, sel);

  let AVANT, a, etat, ctx, page;
  if (!EN_LIGNE) {
    // ----- 1. Sur l'ancien site : un parent s'installe, dépose 2 fois, note son humeur, écrit dans son carnet, termine une étape et choisit une formule
    pointe(ANCIEN);
    ctx = await b.newContext(opts); page = await ctx.newPage(); ecoute(page);
    await page.goto(ORIGIN + '/'); await page.waitForSelector(A('onboard'));
    ok(/Commencer gratuitement/.test(await page.textContent(A('onboard'))) && /pv=2/.test(await (await ctx.request.get(ORIGIN + '/app.js')).text()), '1. l’ancien site est bien celui d’avant le 26 novembre (son bouton « Commencer gratuitement », ses notes au format 2)');
    await page.click(A('onboard')); await page.waitForSelector('#ob-me');
    await page.fill('#ob-me', 'Camille'); await page.click(A('ob', '[data-v="a"]')); await page.click(A('ob', '[data-v="hand"]')); await page.click(A('obw', '[data-v="fatigue"]')); await page.click(A('ob-done')); await page.waitForSelector('#draft');
    await page.fill('#draft', D1); await page.click(A('dsend')); await page.waitForTimeout(2200);
    await page.fill('#draft', D2); await touche(page, A('dmode', '[data-v="advice"]')); await page.waitForTimeout(200); await touche(page, A('dsend')); await page.waitForTimeout(2200);
    await touche(page, A('mood', '[data-i="3"]')); await page.waitForTimeout(300);
    await touche(page, A('step', '[data-i="0"]')); await page.waitForSelector('#note');
    await page.fill('#note', N1); await page.waitForTimeout(700); await touche(page, A('stepdone')); await page.waitForTimeout(500);
    await page.click('.tab' + A('go', '[data-view="me"]')); await page.waitForTimeout(400); await page.click(A('go', '[data-view="plans"]')); await page.waitForSelector(A('tier', '[data-v="parcours"]'));
    await page.click(A('tier', '[data-v="parcours"]')); await page.waitForTimeout(600);
    AVANT = await page.evaluate(k => localStorage.getItem(k), KEY); a = JSON.parse(AVANT);
    etat = await ctx.storageState(); await ctx.close();
    if (process.argv.includes('--ecrit')) fs.writeFileSync(FIXE, JSON.stringify({ origine: 'Notes rangées par le site parent-ecoute.ch tel qu’il était en ligne du 18 au 26 novembre 2026. Le parent et ses textes sont inventés.', notes: AVANT }, null, 1) + '\n');
    // les notes enregistrées pour l'essai en ligne ont bien la forme de celles que l'ancien site range aujourd'hui
    let f = null; try { f = JSON.parse(JSON.parse(fs.readFileSync(FIXE, 'utf8')).notes); } catch (e) { }
    const forme = o => JSON.stringify(Object.keys(o).sort().map(k => [k, Array.isArray(o[k]) ? 'liste' : typeof o[k]]));
    ok(f && forme(f) === forme(a) && f.pv === 2 && f.depots.length === 2 && forme(f.depots[0]) === forme(a.depots[0]) && f.depots[0].text === D1 && f.depots[1].text === D2 && f.notes.depart.t === N1,
      '1. les notes enregistrées pour l’essai en ligne (reprise-notes.json) ont la même forme que celles que l’ancien site vient de ranger');
  } else {
    // ----- 1. En ligne : les notes que l'ancien site avait rangées, posées sur l'appareil avant toute visite
    AVANT = JSON.parse(fs.readFileSync(FIXE, 'utf8')).notes; a = JSON.parse(AVANT);
    etat = { cookies: [], origins: [{ origin: ORIGIN, localStorage: [{ name: KEY, value: AVANT }] }] };
  }
  ok(a.pv === 2 && a.onboarded && a.me === 'Camille' && a.age === 'a' && a.situation === 'hand' && a.weights.join() === 'fatigue' && a.depots.length === 2 && a.depots[0].text === D1 && a.depots[1].text === D2 && a.notes.depart && a.notes.depart.t === N1 && a.steps.depart === true && a.tier === 'parcours' && Object.keys(a.moods).length === 1,
    '1. les notes de l’ancien site portent le prénom, les 2 dépôts, l’humeur, la page de carnet, l’étape faite et la formule ' + JSON.stringify({ pv: a.pv, depots: a.depots.length, notes: Object.keys(a.notes), steps: a.steps, tier: a.tier, moods: a.moods }));

  // ----- 2. Le site reçoit la nouvelle version. Le même appareil rouvre la même adresse.
  if (!EN_LIGNE) pointe(NOUVEAU);
  ctx = await b.newContext(Object.assign({ storageState: etat }, opts)); page = await ctx.newPage(); ecoute(page);
  await page.goto(ORIGIN + BASE); await page.waitForSelector('.tabs', { timeout: 15000 }).catch(() => { }); await page.waitForTimeout(900);
  ok(/const FILM="actif";/.test(await (await ctx.request.get(ORIGIN + BASE + 'app.js')).text()), '2. le nouveau site est bien servi à la même adresse (son film y est actif)');
  ok(!!(await page.$('.tabs')) && !(await page.$('.seuil')), '2. le parent déjà venu arrive dans son espace, pas sur l’accueil des nouveaux venus');
  ok(/Camille/.test(await page.textContent('#app')), '2. son prénom l’accueille');
  const lit = () => page.evaluate(([k, ka]) => ({ d: JSON.parse(localStorage.getItem(k)), s: localStorage.getItem(ka), cles: Object.keys(localStorage) }), [KEY, KEY_AVANT]);
  let L = await lit(); const copie = JSON.parse(L.s || 'null');
  ok(copie && copie.notes === AVANT && /^\d{4}-\d\d-\d\d$/.test(copie.le), '2. avant toute conversion, les anciennes notes sont gardées telles quelles sur l’appareil, au caractère près');
  // un geste qui enregistre : l'humeur du jour
  await page.click('.tab' + A('go', '[data-view="me"]')); await page.waitForTimeout(500);
  const moi = await page.textContent('#app');
  ok(/1\s*étape faite/.test(moi.replace(/ /g, ' ')) && /1\s*page écrite/.test(moi.replace(/ /g, ' ')) && /2\s*dépôts/.test(moi.replace(/ /g, ' ')), '2. « Moi » compte 1 étape faite, 1 page écrite et 2 dépôts ' + JSON.stringify(moi.replace(/\s+/g, ' ').slice(0, 160)));
  await page.click(A('go', '[data-view="depots"]')); await page.waitForTimeout(500); let t = await page.textContent('#app');
  ok(t.includes(D1) && t.includes(D2), '2. « Mes dépôts » montre les 2 textes, mot pour mot (guillemets, chevron et retour compris)');
  ok(!/&lt;|&amp;/.test(t), '2. aucun signe n’est abîmé à l’affichage');
  await page.goBack(); await page.waitForTimeout(400); await page.click(A('go', '[data-view="carnet"]')).catch(() => { }); await page.waitForTimeout(500); t = await page.textContent('#app');
  ok(t.includes('Je pars de loin.') && t.includes('Mais je pars.'), '2. le carnet montre la page écrite sur l’ancien site');
  await page.click('.tab' + A('go', '[data-view="parcours"]')); await page.waitForTimeout(600);
  L = await lit(); const d = L.d;
  ok(d.pv === 3 && d.perso === true && d.onboarded === true && d.me === 'Camille' && d.age === 'a' && d.situation === 'hand' && d.weights.join() === 'fatigue' && d.start === a.start, '3. après conversion : le prénom, l’âge, la situation, ce qui pèse et la date d’arrivée sont les mêmes ' + JSON.stringify({ pv: d.pv, perso: d.perso, age: d.age }));
  ok(JSON.stringify(d.depots) === JSON.stringify(a.depots), '3. les 2 dépôts sont identiques, avec leur date, leur heure, leur question et leur lumière');
  ok(JSON.stringify(d.notes) === JSON.stringify(a.notes) && d.steps.depart === true && JSON.stringify(d.moods) === JSON.stringify(a.moods), '3. le carnet, l’étape faite et l’humeur sont identiques');
  ok(d.tier === 'parcours' && d.achats && d.achats.parcours && d.achats.parcours.m === 'une', '3. la formule choisie sur l’ancien site garde le parcours ouvert ' + JSON.stringify([d.tier, d.achats]));
  ok(!(await page.$(A('upgrade'))) && (await page.$$(A('step'))).length >= 2, '3. dans « Parcours », les étapes sont là et rien ne demande d’acheter');
  ok((await lit()).s === L.s && JSON.parse(L.s).notes === AVANT, '3. la copie de sécurité n’a pas bougé pendant la visite');

  // ----- 3. Une deuxième ouverture ne refait pas la copie, et « tout recommencer » efface aussi la copie
  await page.reload(); await page.waitForSelector('.tabs'); await page.waitForTimeout(500);
  ok((await lit()).s === L.s, '4. à la visite suivante, la copie de sécurité est la même (elle n’est faite qu’une fois)');
  await page.click('.tab' + A('go', '[data-view="me"]')); await page.waitForTimeout(400); await page.click(A('go', '[data-view="data"]')); await page.waitForSelector(A('reset'));
  await page.click(A('reset')); await page.waitForSelector(A('reset-yes')); await page.click(A('reset-yes')); await page.waitForTimeout(800);
  L = await lit();
  ok(L.s === null && (L.d === null || !L.d.onboarded) && !L.cles.some(k => /avant/.test(k)), '4. « Recommencer depuis le début » efface les notes et leur copie de sécurité ' + JSON.stringify(L.cles));
  ok(errs.length === 0, 'aucune erreur dans la page ' + JSON.stringify(errs.slice(0, 3)));
  await b.close();
  console.log(`reprise des notes (${NAV}) : ${n} vérifications, ${ko} échec${ko > 1 ? 's' : ''} (${ORIGIN}${BASE}${EN_LIGNE ? ', notes enregistrées' : ', ancien site puis nouveau'})`);
  process.exit(ko ? 1 : 0);
})().catch(e => { console.log('  ÉCHEC : l’essai s’est arrêté : ' + String(e).slice(0, 300)); process.exit(1); });
