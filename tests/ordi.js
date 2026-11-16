// Le format ordinateur : la colonne de gauche, l'ordre de la page, les fenêtres au centre, l'onde, et le passage d'un format à l'autre.
// usage : node ordi.js
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
const U = (process.env.PEPE_ORIGIN || 'https://localhost:8443') + (process.env.PEPE_BASE || '/carnet-de-liens/') + (process.env.PEPE_APPDIR !== undefined ? process.env.PEPE_APPDIR : 'parent-ecoute/');
let pass = 0, fail = 0; const ok = (c, m) => { if (c) pass++; else { fail++; console.log('  ÉCHEC : ' + m); } };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference' });
  await ctx.addInitScript(() => { try { localStorage.setItem('pepe-consent', JSON.stringify({ v: 1, audience: false, date: '2026-11-16' })); } catch (e) { } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  const tap = async (x, y) => { await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.up(); };
  const mid = async sel => { const bx = await (await page.waitForSelector(sel)).boundingBox(); return [bx.x + bx.width / 2, bx.y + bx.height / 2]; };
  const h1 = () => page.$eval('main.view h1', e => e.textContent);
  const vt = () => page.evaluate(() => document.querySelector(':root').matches(':active-view-transition'));
  await page.goto(U); await page.waitForTimeout(900);
  // ----- l'accueil : pas de colonne, la photo à droite, le bouton visible sans défiler
  let r = await page.evaluate(() => { const hf = document.querySelector('.herofull').getBoundingClientRect(), im = document.querySelector('.herobg').getBoundingClientRect(), bt = document.querySelector('.herofull [data-act="onboard"]').getBoundingClientRect(), t = document.querySelector('.herofull h1').getBoundingClientRect(); return { tabs: !!document.querySelector('.tabs'), hw: hf.width, imLeft: im.left - hf.left, btBottom: bt.bottom, tRight: t.right, sw: document.documentElement.scrollWidth, iw: innerWidth }; });
  ok(!r.tabs && r.hw > 900 && r.imLeft > 150 && r.btBottom < 800 && r.sw <= r.iw, 'accueil : grande photo décalée à droite, bouton visible sans défiler, rien ne dépasse (' + JSON.stringify(r) + ')');
  await page.click('.herofull ' + A('onboard')); await page.waitForTimeout(900);
  r = await page.evaluate(() => { const s = document.querySelector('.sheet').getBoundingClientRect(); return { dx: Math.round((s.left + s.right) / 2 - innerWidth / 2), dy: Math.round((s.top + s.bottom) / 2 - innerHeight / 2), w: Math.round(s.width), top: Math.round(s.top), bottom: Math.round(innerHeight - s.bottom) }; });
  ok(Math.abs(r.dx) <= 1 && Math.abs(r.dy) <= 1 && r.w <= 600 && r.top >= 20 && r.bottom >= 20, 'inscription : la feuille est une fenêtre au centre (' + JSON.stringify(r) + ')');
  await page.fill('#ob-me', 'Camille'); await page.click(A('ob-done')); await page.waitForTimeout(2600);
  // ----- la colonne de gauche et l'ordre de la page
  r = await page.evaluate(() => { const app = document.getElementById('app'); const kids = [...app.children].map(e => e.tagName + '.' + e.className.split(' ')[0]); const nav = document.querySelector('.tabs').getBoundingClientRect(); const sos = document.querySelector('.tabs .sos'); const sr = sos ? sos.getBoundingClientRect() : null; const band = document.querySelector('.band').getBoundingClientRect(); const duo = getComputedStyle(document.querySelector('.duo')).display; return { kids, nav: [Math.round(nav.left), Math.round(nav.top), Math.round(nav.width), Math.round(nav.height)], sos: sr ? [Math.round(sr.left), Math.round(sr.bottom)] : null, barSos: !!document.querySelector('.bar .sos'), brand: getComputedStyle(document.querySelector('.rail-brand')).display, bandLeft: Math.round(band.left), bandW: Math.round(band.width), duo, cls: app.className, vtn: getComputedStyle(document.querySelector('.tabs')).viewTransitionName }; });
  ok(r.kids[0] === 'NAV.tabs' && r.kids[1] === 'MAIN.view' && !r.barSos, 'onglet : la page est écrite dans l’ordre où on la voit, la colonne puis le contenu (' + r.kids.join(' ') + ')');
  ok(r.nav[0] === 0 && r.nav[1] === 0 && r.nav[2] === 248 && r.nav[3] === 800 && r.brand !== 'none', 'colonne de gauche : sur toute la hauteur, avec le nom de l’espace (' + r.nav.join(',') + ')');
  ok(r.sos && r.sos[0] >= 12 && r.sos[1] <= 800 && r.sos[1] >= 740, 'colonne de gauche : le SOS est en bas (' + JSON.stringify(r.sos) + ')');
  ok(r.bandLeft >= 248 + 30 && r.bandW >= 900 && r.duo === 'grid' && /\bwide\b/.test(r.cls) && /\bv-today\b/.test(r.cls), 'Aujourd’hui : la photo et les deux pages occupent la largeur (' + r.bandLeft + ', ' + r.bandW + ', ' + r.duo + ')');
  ok(r.vtn === 'rail', 'la colonne de gauche reste en place pendant une onde (' + r.vtn + ')');
  // l'ordre au clavier : le premier élément qu'on atteint est dans la colonne
  const f1 = await page.evaluate(() => { const e = document.querySelector('#app button, #app a[href], #app input, #app textarea'); return e ? e.className + ' / ' + e.textContent.trim() : ''; });
  ok(/^tab\b/.test(f1), 'au clavier, on arrive d’abord dans la colonne de gauche (' + f1 + ')');
  // ----- l'onde part de la colonne, et l'application répond pendant qu'elle passe
  const pk = await mid('.tab' + A('go', '[data-view="kit"]')), pp = await mid('.tab' + A('go', '[data-view="parcours"]'));
  await tap(pk[0], pk[1]); await page.waitForTimeout(350);
  r = await page.evaluate(() => ({ onde: /fx-onde/.test(document.documentElement.className) && /fx-ring/.test(document.documentElement.className), vt: document.querySelector(':root').matches(':active-view-transition'), x: getComputedStyle(document.documentElement).getPropertyValue('--fx-x').trim() }));
  ok(r.onde && r.vt && parseFloat(r.x) < 248, 'toucher « Outils » : l’onde part de la colonne (' + JSON.stringify(r) + ')');
  await tap(pp[0], pp[1]); await page.waitForTimeout(450);
  ok(/Le parcours/.test(await h1()), 'un autre onglet touché pendant l’onde est pris en compte (' + (await h1()) + ')');
  await page.waitForTimeout(1800);
  ok(!(await vt()) && !(await page.evaluate(() => /fx-(onde|ring|nav)/.test(document.documentElement.className))), 'après l’onde, plus rien ne reste du passage');
  r = await page.evaluate(() => { const m = getComputedStyle(document.querySelector('.months')); return m.gridTemplateColumns.split(' ').length; });
  ok(r === 3, 'parcours : les six mois sur trois colonnes à 1280 px (' + r + ')');
  // ----- un écran de lecture : le bouton Retour, la colonne de lecture, la colonne de gauche toujours là
  await page.click(A('step', '[data-i="0"]')); await page.waitForTimeout(1700);
  r = await page.evaluate(() => { const app = document.getElementById('app'); const kids = [...app.children].map(e => e.tagName + '.' + e.className.split(' ').slice(0, 2).join('.')); const m = document.querySelector('main.view'); const cs = getComputedStyle(m); const w = m.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); return { kids, w: Math.round(w), cur: (document.querySelector('.tab[aria-current="page"]') || {}).textContent }; });
  ok(r.kids[0].startsWith('NAV.tabs') && r.kids[1] === 'HEADER.bar.sub' && r.w <= 762 && r.w >= 700 && /Parcours/.test(r.cur), 'étape : colonne, bouton Retour, texte sur une largeur confortable (' + JSON.stringify(r) + ')');
  await page.click(A('back')); await page.waitForTimeout(1700); ok(/Le parcours/.test(await h1()), 'Retour ramène au parcours');
  // ----- le SOS depuis la colonne : tout de suite, sans colonne, puis retour
  await page.click('.tabs .sos'); await page.waitForTimeout(150);
  ok(/Là, maintenant/.test(await h1()) && !(await page.$('.tabs')), 'SOS : affiché tout de suite, en plein écran');
  await page.click('.sosview .back'); await page.waitForTimeout(400); ok(!!(await page.$('.tabs .sos')), 'sortie du SOS : la colonne est de retour');
  // ----- une feuille au centre, fermée par Échap
  await page.click('.tab' + A('go', '[data-view="me"]')); await page.waitForTimeout(1700);
  r = await page.evaluate(() => getComputedStyle(document.querySelector('.duo')).display); ok(r === 'grid', 'Moi : deux pages côte à côte');
  await page.click('.menu-list ' + A('onboard')); await page.waitForTimeout(800);
  r = await page.evaluate(() => { const s = document.querySelector('.sheet'); if (!s) return null; const q = s.getBoundingClientRect(); return { dx: Math.round((q.left + q.right) / 2 - innerWidth / 2), w: Math.round(q.width) }; });
  ok(r && Math.abs(r.dx) <= 1 && r.w <= 600, '« Modifier le début » : une fenêtre au centre (' + JSON.stringify(r) + ')');
  await page.click(A('ob-done')); await page.waitForTimeout(900); ok(!(await page.$('.sheet')), 'la fenêtre se referme');
  // ----- la fenêtre rétrécit : l'écran repasse au format téléphone sans rien perdre de ce qui est écrit
  await page.click('.tab' + A('go', '[data-view="today"]')); await page.waitForTimeout(1700);
  await page.fill('#draft', 'Un texte en cours.');
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(400);
  r = await page.evaluate(() => { const app = document.getElementById('app'); const kids = [...app.children].map(e => e.tagName + '.' + e.className.split(' ')[0]); const nav = document.querySelector('.tabs').getBoundingClientRect(); return { kids, navTop: Math.round(nav.top), navW: Math.round(nav.width), barSos: !!document.querySelector('.bar .sos'), railSos: !!document.querySelector('.tabs .sos'), brand: getComputedStyle(document.querySelector('.rail-brand')).display, draft: document.getElementById('draft').value, sw: document.documentElement.scrollWidth, duo: getComputedStyle(document.querySelector('.duo')).display }; });
  ok(r.kids[0] === 'HEADER.bar' && r.kids[r.kids.length - 1] === 'NAV.tabs' && r.barSos && !r.railSos && r.brand === 'none' && r.navTop > 700 && r.navW === 390 && r.duo === 'contents' && r.sw <= 390, 'fenêtre rétrécie : retour au format téléphone, onglets en bas (' + JSON.stringify(r) + ')');
  ok(r.draft === 'Un texte en cours.', 'fenêtre rétrécie : le texte en cours de saisie est gardé (« ' + r.draft + ' »)');
  await page.setViewportSize({ width: 1280, height: 800 }); await page.waitForTimeout(400);
  r = await page.evaluate(() => ({ first: document.getElementById('app').children[0].tagName, railSos: !!document.querySelector('.tabs .sos'), draft: document.getElementById('draft').value }));
  ok(r.first === 'NAV' && r.railSos && r.draft === 'Un texte en cours.', 'fenêtre agrandie : la colonne revient, le texte est toujours là (' + JSON.stringify(r) + ')');
  // ----- rien ne dépasse sur les quatre onglets, à plusieurs largeurs
  for (const [w, h] of [[1024, 768], [1200, 800], [1440, 900], [1920, 1080]]) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(250); const bad = [];
    for (const v of ['today', 'parcours', 'kit', 'me']) { await page.click('.tab' + A('go', '[data-view="' + v + '"]')); await page.waitForTimeout(1500); const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, right: Math.round(document.querySelector('main.view').getBoundingClientRect().right) })); if (o.sw > o.iw || o.right > o.iw) bad.push(v + ' ' + JSON.stringify(o)); }
    ok(!bad.length, 'largeur ' + w + ' : aucun onglet ne dépasse ' + bad.join(' | '));
  }
  ok(!errs.length, 'aucune erreur dans la console ' + errs.join(' | '));
  console.log('format ordinateur : ' + pass + ' vérifications réussies, ' + fail + ' en échec');
  await b.close(); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(String(e).slice(0, 700)); process.exit(1); });
