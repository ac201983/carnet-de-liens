// Les cartes-images de « D'abord, ensuite » et de la routine : le jeu d'images, les groupes, le tableau gardé, la mise à jour sans redessiner l'écran.
// usage : node pictos.js   (mêmes variables que walk.js : PEPE_ORIGIN, PEPE_BASE, PEPE_APPDIR)
const { chromium } = require('playwright');
const fs = require('fs');
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8443';
const BASE = ORIGIN + (process.env.PEPE_BASE || '/carnet-de-liens/');
const APP = BASE + (process.env.PEPE_APPDIR !== undefined ? process.env.PEPE_APPDIR : 'parent-ecoute/');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
let n = 0, ko = 0;
const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC', m); } else if (process.env.VERBEUX) console.log('  ok', m); };
const BASE_DATA = { onboarded: true, me: 'Camille', tier: 'parcours', start: '2026-11-16', age: 'e', situation: 'hand', weights: [], evo: {}, steps: {}, moods: {}, depots: [], pv: 2, seen: {}, notes: {} };

// Les données, lues dans les sources.
const c0 = fs.readFileSync(__dirname + '/../eparts/p2-content.js', 'utf8').replace(/<\/?script>/g, '');
const { PICTOS, PICTO_GROUPES, ROUTINE_DEF } = new Function(c0.slice(c0.indexOf('const PICTOS')) + '; return {PICTOS,PICTO_GROUPES,ROUTINE_DEF};')();

async function ouvre(browser, data, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: opts.w || 390, height: 844 }, ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  // l'heure est fixée quand un essai en dépend (le groupe d'images proposé suit le moment de la journée)
  if (opts.heure !== undefined) await ctx.addInitScript(h => { const D0 = Date; const t = new D0(2026, 10, 16, h, 30, 0).getTime(); class D extends D0 { constructor(...a) { if (a.length) super(...a); else super(t); } static now() { return t; } } window.Date = D; }, opts.heure);
  if (data) await ctx.addInitScript(d => { try { if (!sessionStorage.getItem('pose')) { localStorage.setItem('pepe-v1', JSON.stringify(d)); sessionStorage.setItem('pose', '1'); } } catch (e) { } }, data);
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('requestfailed', r => errs.push('échec ' + r.url()));
  await page.goto(APP); await page.waitForTimeout(350);
  const c = await page.$('#consent [data-consent="no"]'); if (c) await c.click();
  return { ctx, page, errs };
}
const store = page => page.evaluate(() => JSON.parse(localStorage.getItem('pepe-v1')));
// le texte d'un élément, espaces insécables remis en espaces simples (les guillemets français en portent)
const txt = async (page, sel) => ((await page.textContent(sel)) || '').replace(/\s+/g, ' ').trim();
const outil = async (page, t) => { await page.click('.tab' + A('go', '[data-view="kit"]')); await page.click(A('kit', '[data-v="tools"]')); await page.click(A('tool', `[data-v="${t}"]`)); await page.waitForTimeout(150); };
const groupe = page => page.$eval(A('ftg') + '[aria-pressed="true"]', e => e.dataset.v);
const grille = page => page.$$eval('#ft-grille button', L => L.map(b => b.dataset.id));
const temoin = page => page.evaluate(() => { document.getElementById('main').dataset.temoin = '1'; });
const intact = page => page.evaluate(() => { const m = document.getElementById('main'); return !!m && m.dataset.temoin === '1'; });

(async () => {
  const browser = await chromium.launch();

  // ---------- 1. Le jeu d'images ----------
  {
    const ids = PICTOS.map(p => p[0]);
    ok(PICTOS.length >= 100 && new Set(ids).size === ids.length, 'au moins 100 images, sans doublon (' + PICTOS.length + ')');
    ok(PICTOS.every(p => p.length === 3 && /^[a-z]+$/.test(p[0]) && p[1].trim() && p[2].trim()), 'chaque image a un identifiant, un mot et une façon de le dire');
    ok(PICTOS.every(p => /^[A-ZÉÈÀÂÎÔÇ]/.test(p[1]) && !/[.:;!?]/.test(p[1]) && p[1].length <= 20), 'les mots sous les images sont courts, avec une majuscule et sans ponctuation');
    ok(PICTOS.every(p => /^[a-zéèàâîôçl’]/.test(p[2]) && !/[.:;!?]/.test(p[2])), 'ce qu’on dit s’enchaîne après « D’abord » (pas de majuscule, pas de point)');
    const dans = new Set(); let inconnus = [], doublons = [];
    for (const g of PICTO_GROUPES) { const l = g[2].split(' '); if (new Set(l).size !== l.length) doublons.push(g[0]); l.forEach(i => { if (!ids.includes(i)) inconnus.push(g[0] + '/' + i); dans.add(i); }); }
    ok(PICTO_GROUPES.length === 9 && !inconnus.length && !doublons.length, 'neuf groupes, sans image inconnue ni répétée ' + inconnus.concat(doublons).join(' '));
    ok(ids.every(i => dans.has(i)), 'chaque image figure dans au moins un groupe ' + ids.filter(i => !dans.has(i)).join(' '));
    ok(PICTO_GROUPES.every(g => { const k = g[2].split(' ').length; return k >= 8 && k <= 18; }), 'chaque groupe propose entre 8 et 18 images');
    ok(ROUTINE_DEF.length === 6 && ROUTINE_DEF.every(i => ids.includes(i)), 'la routine du soir utilise six images du même jeu');
    // les fichiers
    const dir = __dirname + '/../site-src/img/pictos/';
    const fichiers = fs.readdirSync(dir).filter(f => f.endsWith('.svg')).map(f => f.replace('.svg', ''));
    ok(ids.every(i => fichiers.includes(i)) && fichiers.every(f => ids.includes(f)), 'un fichier par image, et aucun fichier en trop');
    let lourd = 0, total = 0, suspect = [];
    for (const i of ids) { const s = fs.readFileSync(dir + i + '.svg', 'utf8'); total += s.length; if (s.length > 40000) lourd++; const vb = (s.match(/^<svg[^>]*viewBox="0 0 ([\d.]+) ([\d.]+)"/) || []).slice(1).map(Number); if (vb.length !== 2 || vb[0] < 840 || vb[0] > 860 || Math.abs(vb[0] - vb[1]) > 5 || /<script|<image|<foreignObject|<text|\son[a-z]+=|href=|url\(\s*["']?(?!#)/i.test(s)) suspect.push(i); }
    ok(!lourd && total < 1000000, 'aucune image de plus de 40 Ko, et moins de 1 Mo en tout (' + Math.round(total / 1024) + ' Ko)');
    ok(!suspect.length, 'chaque fichier est un dessin carré, sans script, sans police et sans lien extérieur ' + suspect.join(' '));
    ok(/Steve Lee/.test(fs.readFileSync(dir + 'LICENCE.txt', 'utf8')) && /by-sa\/4\.0/.test(fs.readFileSync(dir + 'LICENCE.txt', 'utf8')), 'la licence accompagne les images');
  }

  // ---------- 2. Le groupe proposé suit le moment de la journée ----------
  for (const [h, attendu] of [[7, 'matin'], [12, 'repas'], [15, 'jouer'], [20, 'soir'], [2, 'soir']]) {
    const { ctx, page } = await ouvre(browser, BASE_DATA, { heure: h });
    await outil(page, 'ft');
    ok((await groupe(page)) === attendu, 'à ' + h + ' h 30, le groupe proposé est « ' + attendu + ' » (' + (await groupe(page)) + ')');
    await ctx.close();
  }

  // ---------- 3. Remplir le tableau ----------
  {
    const { ctx, page, errs } = await ouvre(browser, BASE_DATA, { heure: 20 });
    await outil(page, 'ft');
    ok((await page.$$(A('ftg'))).length === 10, 'dix choix de groupe (neuf moments et « Tout »)');
    const soir = PICTO_GROUPES.find(g => g[0] === 'soir')[2].split(' ');
    ok(JSON.stringify(await grille(page)) === JSON.stringify(soir), 'le groupe « Soir » montre ses images dans l’ordre prévu');
    ok((await page.$$('#ft .ftcard .vide')).length === 2 && !(await page.$('#ft-dit .comfort')) && !(await page.isVisible('#ft-vide')), 'au départ, deux cases vides, pas de phrase et pas de bouton pour vider');
    ok((await page.$eval('#ft [data-k="first"]', b => b.getAttribute('aria-pressed'))) === 'true' && /remplir la case D’abord/.test(await page.textContent('#ft-ou')), 'la case visée au départ est « D’abord »');
    ok(new RegExp('Il y en a ' + PICTOS.length + ', rangées par moment de la journée').test(await page.textContent('#ft-ou')), 'le nombre d’images est annoncé en chiffres');
    await temoin(page);
    await page.click(A('ftset', '[data-id="dents"]')); await page.waitForTimeout(80);
    ok((await page.textContent('#ft [data-k="first"] .pcarte')) === 'Dents' && (await page.$eval('#ft [data-k="first"] img', i => i.getAttribute('src'))) === 'img/pictos/dents.svg', 'toucher « Dents » remplit la case « D’abord »');
    ok((await page.$eval('#ft [data-k="then"]', b => b.getAttribute('aria-pressed'))) === 'true' && /remplir la case Ensuite/.test(await page.textContent('#ft-ou')), 'la case visée passe à « Ensuite »');
    await page.click(A('ftset', '[data-id="histoire"]')); await page.waitForTimeout(80);
    ok(/dites « D’abord les dents, ensuite l’histoire »\./.test(await txt(page, '#ft-dit')), 'la phrase à dire apparaît quand les deux cases sont remplies');
    ok((await page.$$('#ft-grille button[aria-pressed="true"]')).length === 2 && (await txt(page, A('ftset', '[data-id="dents"]') + ' .ou')) === ', dans la case D’abord' && (await txt(page, A('ftset', '[data-id="histoire"]') + ' .ou')) === ', dans la case Ensuite', 'dans la grille, les deux images posées portent l’étiquette de leur case');
    ok(await page.isVisible('#ft-vide'), 'le bouton « Vider le tableau » apparaît');
    ok(await page.evaluate(() => !!(document.getElementById('ft-dit').compareDocumentPosition(document.getElementById('ft')) & Node.DOCUMENT_POSITION_FOLLOWING)), 'la phrase à dire est écrite juste au-dessus du tableau');
    ok(await intact(page), 'remplir le tableau ne redessine pas l’écran');
    const d = await store(page);
    ok(d.ft && d.ft.first === 'dents' && d.ft.then === 'histoire', 'le tableau est gardé sur l’appareil');
    // les images du tableau sont chargées et nettes (dessin vectoriel)
    ok(await page.$$eval('#ft img', L => L.length === 2 && L.every(i => i.complete && i.naturalWidth > 0 && i.getAttribute('alt') === '')), 'les deux images du tableau sont affichées');
    // changer de case, puis d'image
    await page.click('#ft [data-k="first"]'); await page.waitForTimeout(60);
    ok(/changer la case D’abord/.test(await page.textContent('#ft-ou')) && (await page.$eval('#ft [data-k="first"]', b => b.getAttribute('aria-pressed'))) === 'true' && (await page.$eval('#ft [data-k="then"]', b => b.getAttribute('aria-pressed'))) === 'false', 'toucher une case la vise');
    await page.click(A('ftset', '[data-id="pyjama"]')); await page.waitForTimeout(60);
    ok((await page.textContent('#ft [data-k="first"] .pcarte')) === 'Pyjama' && (await page.textContent('#ft [data-k="then"] .pcarte')) === 'Histoire' && /changer la case D’abord/.test(await page.textContent('#ft-ou')), 'changer « D’abord » ne touche pas à « Ensuite », et la case visée ne bouge pas');
    ok(!(await page.$(A('ftset', '[data-id="dents"]') + ' .ou')) && (await page.$eval(A('ftset', '[data-id="dents"]'), b => b.getAttribute('aria-pressed'))) === 'false' && !!(await page.$(A('ftset', '[data-id="pyjama"]') + ' .ou')), 'l’étiquette suit l’image qui est dans la case');
    // une image ne peut être qu'à un seul endroit
    await page.click(A('ftset', '[data-id="histoire"]')); await page.waitForTimeout(60);
    ok((await page.textContent('#ft [data-k="first"] .pcarte')) === 'Histoire' && !!(await page.$('#ft [data-k="then"] .vide')) && !(await page.$('#ft-dit .comfort')), 'la même image ne peut pas occuper les deux cases');
    ok(/remplir la case Ensuite/.test(await page.textContent('#ft-ou')) && (await page.$eval('#ft [data-k="then"]', b => b.getAttribute('aria-pressed'))) === 'true', 'la case visée passe alors à celle qui s’est vidée');
    // changer de groupe
    await page.click(A('ftg', '[data-v="plaisirs"]')); await page.waitForTimeout(100);
    ok((await groupe(page)) === 'plaisirs' && (await grille(page)).includes('tablette') && !(await grille(page)).includes('pyjama'), 'changer de groupe change les images');
    await page.click(A('ftg', '[data-v="tout"]')); await page.waitForTimeout(150);
    ok((await grille(page)).length === PICTOS.length, '« Tout » montre toutes les images');
    ok(await intact(page), 'changer de case ou de groupe ne redessine pas l’écran');
    // le clavier : la touche Entrée sur une image, et le repère de l'élément actif reste en place
    await page.click('#ft [data-k="then"]'); await page.focus(A('ftset', '[data-id="glace"]')); await page.keyboard.press('Enter'); await page.waitForTimeout(60);
    ok((await page.textContent('#ft [data-k="then"] .pcarte')) === 'Glace' && (await page.evaluate(() => document.activeElement && document.activeElement.dataset.id)) === 'glace', 'au clavier, Entrée pose l’image et le repère reste sur elle');
    // vider
    await page.click(A('ftvide')); await page.waitForTimeout(80);
    const v = await store(page);
    ok((await page.$$('#ft .ftcard .vide')).length === 2 && !v.ft.first && !v.ft.then && !(await page.isVisible('#ft-vide')) && (await page.$$('#ft-grille .ou')).length === 0, '« Vider le tableau » vide les deux cases et retire les étiquettes');
    ok((await page.evaluate(() => document.activeElement && document.activeElement.dataset.k)) === 'first', 'après avoir vidé, le repère revient sur la case « D’abord »');
    ok(errs.length === 0, 'aucune erreur (tableau) ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  // ---------- 4. Le tableau revient à la visite suivante ----------
  {
    const { ctx, page, errs } = await ouvre(browser, Object.assign({}, BASE_DATA, { ft: { first: 'mains', then: 'repas' } }), { heure: 12 });
    await outil(page, 'ft');
    ok((await page.textContent('#ft [data-k="first"] .pcarte')) === 'Mains' && (await page.textContent('#ft [data-k="then"] .pcarte')) === 'Repas', 'un tableau gardé revient tel quel');
    ok(/dites « D’abord se laver les mains, ensuite le repas »\./.test(await txt(page, '#ft-dit')), 'avec sa phrase');
    await page.reload(); await page.waitForTimeout(350); await outil(page, 'ft');
    ok((await page.textContent('#ft [data-k="first"] .pcarte')) === 'Mains', 'il tient après un rechargement de la page');
    ok(errs.length === 0, 'aucune erreur (tableau gardé) ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  {
    // une image retirée depuis, ou des données abîmées : la case est simplement vide
    const { ctx, page, errs } = await ouvre(browser, Object.assign({}, BASE_DATA, { ft: { first: 'inconnue', then: 42 } }), { heure: 12 });
    await outil(page, 'ft');
    ok((await page.$$('#ft .ftcard .vide')).length === 2 && errs.length === 0, 'une image inconnue vaut une case vide, sans erreur ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  {
    const { ctx, page, errs } = await ouvre(browser, Object.assign({}, BASE_DATA, { ft: 'abîmé' }), { heure: 12 });
    await outil(page, 'ft');
    await page.click(A('ftset', '[data-id="manger"]')); await page.waitForTimeout(60);
    ok((await page.textContent('#ft [data-k="first"] .pcarte')) === 'Manger' && (await store(page)).ft.first === 'manger' && errs.length === 0, 'des données abîmées n’empêchent pas de remplir le tableau ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  // ---------- 5. Toutes les images s'affichent, à trois largeurs ----------
  for (const w of [320, 390, 1280]) {
    const { ctx, page, errs } = await ouvre(browser, BASE_DATA, { heure: 20, w });
    await outil(page, 'ft');
    await page.click(A('ftg', '[data-v="tout"]')); await page.waitForTimeout(200);
    // on descend jusqu'en bas pour que les images se chargent à mesure
    for (let y = 0; y < 14; y++) { await page.evaluate(k => window.scrollTo(0, document.body.scrollHeight * k / 13), y); await page.waitForTimeout(120); }
    const r = await page.$$eval('#ft-grille button', L => ({ n: L.length, ko: L.filter(b => { const i = b.querySelector('img'); return !(i.complete && i.naturalWidth > 0); }).map(b => b.dataset.id), petit: L.filter(b => b.getBoundingClientRect().width < 72 || b.querySelector('img').getBoundingClientRect().width < 60).length, deborde: L.filter(b => b.scrollWidth > b.clientWidth + 1).map(b => b.dataset.id) }));
    ok(r.n === PICTOS.length && !r.ko.length, w + ' px : les ' + PICTOS.length + ' images se chargent ' + r.ko.join(' '));
    ok(!r.petit && !r.deborde.length, w + ' px : aucune carte trop petite, aucun mot qui déborde ' + r.deborde.join(' '));
    const cols = await page.$eval('#ft-grille', g => getComputedStyle(g).gridTemplateColumns.split(' ').length);
    ok(w === 320 ? cols === 2 : w === 390 ? cols === 3 : cols >= 6, w + ' px : ' + cols + ' colonnes');
    ok(errs.length === 0, 'aucune erreur à ' + w + ' px ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  // ---------- 5 bis. Sur téléphone, le tableau reste en vue, et la grille ne bouge pas sous le doigt ----------
  for (const [h, colle] of [[844, true], [667, true], [600, false]]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: h }, ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
    await ctx.addInitScript(d => { try { if (!sessionStorage.getItem('pose')) { localStorage.setItem('pepe-v1', JSON.stringify(d)); sessionStorage.setItem('pose', '1'); } } catch (e) { } }, BASE_DATA);
    const page = await ctx.newPage(); await page.goto(APP); await page.waitForTimeout(350);
    const c = await page.$('#consent [data-consent="no"]'); if (c) await c.click();
    await outil(page, 'ft'); await page.click(A('ftg', '[data-v="tout"]')); await page.waitForTimeout(150);
    // 1. en haut de l'outil (tableau pas encore collé) : poser les deux images ne déplace pas la grille
    await page.evaluate(() => { const g = document.getElementById('ft'); scrollTo(0, g.getBoundingClientRect().top + scrollY - 200); }); await page.waitForTimeout(150);
    const haut = sel => page.$eval(sel, e => Math.round(e.getBoundingClientRect().top));
    const g0 = await haut('#ft-grille');
    await page.$eval(A('ftset', '[data-id="reveil"]'), b => b.click()); await page.waitForTimeout(80);
    const g1 = await haut('#ft-grille');
    await page.$eval(A('ftset', '[data-id="habiller"]'), b => b.click()); await page.waitForTimeout(120);
    const g2 = await haut('#ft-grille');
    ok(Math.abs(g1 - g0) <= 1 && Math.abs(g2 - g0) <= 1 && !!(await page.$('#ft-dit .comfort')), h + ' px de haut : la grille ne bouge pas quand la phrase à dire apparaît (' + g0 + ', ' + g1 + ', ' + g2 + ')');
    // 2. plus bas dans la grille
    await page.evaluate(() => { const g = document.getElementById('ft-grille'); scrollTo(0, g.getBoundingClientRect().top + scrollY + 900); }); await page.waitForTimeout(250);
    const pos = await page.evaluate(() => { const r = document.getElementById('ft').getBoundingClientRect(); return { haut: Math.round(r.top), bas: Math.round(r.bottom) }; });
    ok(colle ? (pos.haut >= 60 && pos.haut <= 80 && pos.bas < h * 0.45) : pos.bas < 0, h + ' px de haut : le tableau ' + (colle ? 'reste en vue sous l’en-tête' : 'ne reste pas collé (écran trop bas)') + ' ' + JSON.stringify(pos));
    if (colle) {
      // l'image touchée est bien sous le doigt (pas cachée par le tableau), et le tableau change sans que rien ne bouge
      const id = await page.$$eval('#ft-grille button', (L, bas) => { const b = L.find(x => x.getBoundingClientRect().top > bas + 20); return b ? b.dataset.id : null; }, pos.bas);
      const t0 = await haut(A('ftset', `[data-id="${id}"]`));
      await page.click('#ft [data-k="then"]'); await page.click(A('ftset', `[data-id="${id}"]`)); await page.waitForTimeout(100);
      const t1 = await haut(A('ftset', `[data-id="${id}"]`));
      const img = await page.$eval('#ft [data-k="then"] img', i => i.getAttribute('src'));
      ok(Math.abs(t1 - t0) <= 1 && img === 'img/pictos/' + id + '.svg' && (await page.evaluate(() => { const r = document.querySelector('#ft [data-k="then"]').getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!e && !!e.closest('#ft'); })), h + ' px de haut : l’image touchée apparaît dans le tableau resté en vue, sans que la grille bouge (' + t0 + ', ' + t1 + ')');
      // vider (la phrase disparaît au-dessus) : la grille ne bouge pas non plus
      const v0 = await haut('#ft-grille');
      await page.$eval('#ft-vide', b => b.click()); await page.waitForTimeout(120);
      const v1 = await haut('#ft-grille');
      ok(Math.abs(v1 - v0) <= 1 && !(await page.$('#ft-dit .comfort')), h + ' px de haut : vider le tableau ne déplace pas la grille (' + v0 + ', ' + v1 + ')');
    }
    await ctx.close();
  }

  // ---------- 6. La routine du soir, avec les mêmes images ----------
  {
    const { ctx, page, errs } = await ouvre(browser, BASE_DATA, { heure: 20 });
    await outil(page, 'routine');
    ok(JSON.stringify(await page.$$eval('#routine .rstep img', L => L.map(i => i.getAttribute('src')))) === JSON.stringify(ROUTINE_DEF.map(i => 'img/pictos/' + i + '.svg')), 'la routine montre ses six images');
    ok(JSON.stringify(await page.$$eval('#routine .rstep .t', L => L.map(e => e.textContent))) === JSON.stringify(['Bain', 'Pyjama', 'Dents', 'Histoire', 'Câlin', 'Dodo']), 'dans le même ordre qu’avant');
    await temoin(page);
    await page.click(A('rdone', '[data-i="0"]')); await page.waitForTimeout(60);
    ok(await page.$eval(A('rdone', '[data-i="0"]'), b => b.classList.contains('done') && b.getAttribute('aria-pressed') === 'true' && !!b.querySelector('.ck svg')), 'toucher une étape la coche');
    ok(await intact(page), 'cocher ne redessine pas l’écran');
    for (let i = 1; i < 6; i++) await page.click(A('rdone', `[data-i="${i}"]`));
    await page.waitForTimeout(60);
    ok(/Tout est fait\. Bonne nuit à tous les deux\./.test(await page.textContent('#r-fin')), 'quand tout est coché, le mot de la fin apparaît');
    await page.click(A('rdone', '[data-i="3"]')); await page.waitForTimeout(60);
    ok(!(await page.$('#r-fin .comfort')) && !(await page.$eval(A('rdone', '[data-i="3"]'), b => b.classList.contains('done'))), 'décocher une étape retire le mot de la fin');
    await page.click(A('rreset')); await page.waitForTimeout(60);
    ok((await page.$$('#routine .rstep.done')).length === 0 && await intact(page), '« Remettre à zéro » décoche tout, sans redessiner l’écran');
    ok(errs.length === 0, 'aucune erreur (routine) ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  // ---------- 7. Le crédit des images ----------
  {
    const { ctx, page, errs } = await ouvre(browser, BASE_DATA, { heure: 20 });
    await outil(page, 'ft');
    ok(/Mulberry Symbols de Steve Lee, partagés sous licence CC BY-SA 4\.0\./.test(await page.textContent('.pcredit')) && (await page.$eval('.pcredit a', a => a.getAttribute('href'))) === 'conditions.html#propriete', 'l’outil cite l’auteur des images et leur licence');
    await page.goto(APP + 'conditions.html'); await page.waitForTimeout(200);
    const t = await page.textContent('#propriete');
    ok(/Mulberry Symbols/.test(t) && /Steve Lee/.test(t) && /Partage dans les mêmes conditions 4\.0/.test(t), 'les conditions citent les images, leur auteur et leur licence');
    ok(await page.$$eval('#propriete a', L => L.some(a => a.href === 'https://mulberrysymbols.org/') && L.some(a => /creativecommons\.org\/licenses\/by-sa\/4\.0\//.test(a.href)) && L.filter(a => /^https/.test(a.getAttribute('href'))).every(a => a.target === '_blank' && /noopener/.test(a.rel))), 'avec un lien vers la source et un lien vers la licence');
    const lic = await ctx.request.get(APP + 'img/pictos/LICENCE.txt');
    ok(lic.ok() && /CC BY-SA 4\.0/.test(await lic.text()), 'le fichier de licence est servi avec les images');
    const img = await ctx.request.get(APP + 'img/pictos/dents.svg');
    ok(img.ok() && /image\/svg\+xml/.test(img.headers()['content-type'] || ''), 'une image est servie comme un dessin SVG');
    ok(errs.length === 0, 'aucune erreur (crédit) ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  await browser.close();
  console.log(`images : ${n} vérifications, ${ko} échec${ko > 1 ? 's' : ''}`);
  process.exit(ko ? 1 : 0);
})();
