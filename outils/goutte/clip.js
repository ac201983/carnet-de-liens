// Un mouvement de l'essai, filmé image par image avec l'horloge tenue à la main (voir horloge.js).
// node clip.js <scène> <port> <base> <heure> <dossier> [images par seconde=30] [largeur=390] [hauteur=760] [échelle=2]
// scènes : depot (la goutte du dépôt), onde (l'onde sous le doigt), feuille (la fiche qui se pose), dose (le reflet sur la dose du jour)
const { chromium } = require('playwright'); const fs = require('fs'); const horloge = require('./horloge.js'); const ouvreFilm = require('./film.js');
(async () => {
  const [scene, port, base, heure, dossier, ips = '30', W = '390', H = '760', dsf = '2', sortie = ''] = process.argv.slice(2);
  fs.mkdirSync(dossier, { recursive: true });
  // dernier paramètre : le nom du film (.mp4). Sans lui, chaque image est gardée dans le dossier, pour regarder vite.
  const cine = sortie ? ouvreFilm(sortie, +ips, { dossier, tous: 15 }) : null;
  const gl = scene === 'onde';
  const b = await chromium.launch({ args: gl ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] : [] });
  const ctx = await b.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: +dsf, ignoreHTTPSErrors: true, isMobile: +W < 700, hasTouch: +W < 700, locale: 'fr-CH' });
  await ctx.addInitScript(([hh, g]) => { if (g) window.__eauSansGarde = true; Date.prototype.getHours = function () { return hh; }; }, [+heure, gl]);
  if (scene === 'dose') await ctx.addInitScript(() => { window.__vtTot = true; });
  await ctx.addInitScript(horloge);
  const iso = n => { const d = new Date(Date.now() + n * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const KEY = /essai/.test(base) ? 'pepe-essai-v1' : 'pepe-v1';
  // une fiche de relais inventée (prénoms et numéros inventés), pour la scène de la feuille
  const FICHE = { id: 'fx', c: iso(0), m: iso(0), qui: 'Lina', chez: 'sa tante Élise', quand: 'samedi 21 novembre, de 9 heures à 18 heures', tu: true,
    trois: ['Lina a besoin de savoir ce qui vient après. Dis-le-lui avant chaque changement.', 'Quand elle se bouche les oreilles, le bruit est trop fort pour elle. Propose-lui un endroit calme.', 'Elle prend son traitement à 12 heures, pendant le repas. Il est dans la poche avant du sac.'],
    moi: ['J’aime dessiner et écouter de la musique avec mon casque.'], s: { repas: ['Lina mange de tout, lentement.'], nuit: ['Elle s’endort avec sa veilleuse.'] }, tel: [{ n: 'Maman', t: '079 000 00 00' }], env: '', retour: '', retourLe: '', garde: '' };
  const PARENT = { onboarded: true, start: iso(-20), tier: 'free', achats: { relais: { le: iso(0) } }, steps: {}, notes: {}, seen: {}, depots: [], moods: {}, pv: 3, rel: { fiches: [FICHE], reunions: [] } };
  if (scene === 'feuille' || scene === 'dose') await ctx.addInitScript(([k, d]) => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify(d)); } catch (e) { } }, [KEY, PARENT]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  const pas = 1000 / +ips; let i = 0; const journal = [];
  const img = async () => { if (cine) await cine.image(p); else await p.screenshot({ path: dossier + '/' + String(i).padStart(4, '0') + '.png' }); i++; };
  const film = async sec => { const n = Math.round(sec * +ips); for (let k = 0; k < n; k++) { await p.evaluate(ms => window.__vt.pas(ms), pas); await img(); } };
  const note = (quoi, plus) => journal.push(Object.assign({ image: i, t: +(i / +ips).toFixed(2), quoi }, plus || {}));
  const clic = async sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) return false; e.click(); window.__vt.css(); return true; }, sel);
  const depart = async () => { await p.evaluate(() => window.__vt.on()); await p.evaluate(() => window.__vt.pas(0)); await img(); };
  if (scene === 'feuille') {
    await p.goto('https://localhost:' + port + base + '#relais'); await p.waitForSelector('main.v-relais [data-act="rl"][data-k="ouvrir"]', { timeout: 15000 }); await p.waitForTimeout(1900);
    await p.$eval('[data-act="rl"][data-k="ouvrir"]', e => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(300);
    await depart(); await film(0.6); note('appui sur la fiche, dans « Mes relais »');
    await clic('[data-act="rl"][data-k="ouvrir"]');
    await film(0.1); note('juste après', await p.evaluate(() => ({ y: Math.round(scrollY), pose: (document.querySelector('.rl-fiche') || {}).className, trois: [...document.querySelectorAll('.feuille>.rl-fiche .rl-trois li')].map(e => Math.round(e.getBoundingClientRect().bottom)), bas: Math.round((document.querySelector('.tabs') || { getBoundingClientRect: () => ({ top: innerHeight }) }).getBoundingClientRect().top) })));
    await film(2.6); note('fin', await p.evaluate(() => ({ y: Math.round(scrollY), t: getComputedStyle(document.querySelector('.feuille>.rl-fiche')).transform, o: getComputedStyle(document.querySelector('.feuille>.rl-fiche')).opacity })));
  } else { await p.goto('https://localhost:' + port + base); }
  if (scene === 'dose') {
    // Un parent déjà entré arrive sur « Aujourd'hui ». L'horloge est tenue à la main dès l'ouverture : l'arrivée de l'écran,
    // l'attente puis le reflet se suivent comme sur un téléphone.
    for (let k = 0; k < 400 && !(await p.$('main.view .dose')); k++) { await p.evaluate(() => window.__vt.pas(16)); await p.waitForTimeout(12); }
    await p.evaluate(() => window.__vt.pas(0)); await img();
    const h0 = await p.evaluate(() => { const c = document.querySelector('.dose'), q = c.getBoundingClientRect(); return { haut: Math.round(q.top), bas: Math.round(q.bottom), phrase: Math.round(c.querySelector('p').getBoundingClientRect().top) }; }); note('arrivée', h0);
    let vu = null;
    for (let k = 0; k < Math.round(4.6 * +ips); k++) { await p.evaluate(ms => window.__vt.pas(ms), pas); await p.waitForTimeout(8); await img(); const d = await p.evaluate(() => !!document.querySelector('.dose-reflet')); if (d && vu == null) { vu = i; note('le reflet part'); } if (!d && vu != null && vu > 0) { note('le reflet s’efface'); vu = -1; } }
    note('fin', await p.evaluate(() => { const c = document.querySelector('.dose'); return { dessin: !!document.querySelector('.dose-reflet'), phrase: Math.round(c.querySelector('p').getBoundingClientRect().top), haut: Math.round(c.getBoundingClientRect().top) }; }));
  }
  if (scene === 'depot' || scene === 'onde') { await p.waitForSelector('.seuil .porte', { timeout: 15000 }); await p.waitForTimeout(700); }
  if (scene === 'depot') {
    await p.click('[data-act="porte"][data-v="deposer"]'); await p.waitForSelector('#draft'); await p.waitForTimeout(1900);
    await p.fill('#draft', 'Ce soir, j’ai crié au moment du coucher, et je m’en veux. J’aimerais que nos soirées soient plus douces.');
    await p.waitForTimeout(400);
    await depart(); await film(0.7); note('appui sur « Garder ces mots pour moi »');
    await clic('[data-act="dsend"]');
    note('juste après l’appui', await p.evaluate(() => ({ suite: !!document.querySelector('.emporte .em-suite [data-act="dfin"]'), mots: (document.querySelector('.emporte .em-texte') || {}).textContent, goutte: (document.querySelector('.depose-g') || {}).className && document.querySelector('.depose-g').getAttribute('class') })));
    await film(4.2); note('fin', await p.evaluate(() => ({ y: scrollY, g: getComputedStyle(document.querySelector('.depose-g .dg-g')).visibility, o1: getComputedStyle(document.querySelector('.depose-g .dg-o1')).strokeOpacity })));
  }
  if (scene === 'onde') {
    await p.click('[data-act="entrer"][data-v="today"]'); await p.waitForSelector('.instant-b'); await p.waitForTimeout(3200);
    await p.click('.instant-b'); await p.waitForSelector('main.instant .etang'); await p.waitForTimeout(5600);
    const box = await p.$eval('main.instant .etang', e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
    const touche = async (fx, fy) => { const X = box.x + box.w * fx, Y = box.y + box.h * fy; await p.evaluate(([x, y]) => { const t = document.querySelector('main.instant .etang-photo'); t.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y, button: 0, pointerId: 1, pointerType: 'touch' })); let d = document.getElementById('doigt'); if (!d) { d = document.createElement('i'); d.id = 'doigt'; d.style.cssText = 'position:fixed;z-index:99;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:2px solid rgba(255,255,255,.9);background:rgba(255,255,255,.22);pointer-events:none;box-shadow:0 0 0 1px rgba(0,0,0,.18)'; document.body.appendChild(d); } d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.visibility = 'visible'; d.dataset.t = String(window.__vt.t()); }, [X, Y]); note('toucher', { x: Math.round(X), y: Math.round(Y) }); };
    // le rond blanc montre où le doigt se pose ; il s'enlève après un tiers de seconde (il n'existe que dans ce film)
    const leve = async () => p.evaluate(() => { const d = document.getElementById('doigt'); if (d && window.__vt.t() - Number(d.dataset.t) > 330) d.style.visibility = 'hidden'; });
    const filmDoigt = async sec => { const n = Math.round(sec * +ips); for (let k = 0; k < n; k++) { await p.evaluate(ms => window.__vt.pas(ms), pas); await leve(); await img(); } };
    await depart(); await filmDoigt(0.8);
    await touche(.30, .64); await filmDoigt(2.6);
    await touche(.72, .80); await filmDoigt(1.5);
    await touche(.52, .70); await filmDoigt(4.4);
    note('fin', await p.evaluate(() => ({ calque: !!document.querySelector('.etang canvas.eau'), vive: document.querySelector('.etang').classList.contains('eau-vive') })));
  }
  if (cine) await cine.fin();
  fs.writeFileSync(dossier + '/journal.json', JSON.stringify({ scene, ips: +ips, journal }, null, 1));
  console.log('images :', i); journal.forEach(j => console.log(JSON.stringify(j)));
  if (errs.length) console.log('ERREURS', errs.slice(0, 5));
  await b.close();
})();
