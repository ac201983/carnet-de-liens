// La vague de l'étape 7, image par image : le repère suit la courbe à chaque « Voir la suite ».
// node vague-vue.js <port> <base> <heure> <dossier> [images par seconde=30] [largeur=390] [hauteur=844] [échelle=2] [pause entre deux appuis, en s=2.4] [schéma=vitrine|<n° d'étape>]
const { chromium } = require('playwright'); const fs = require('fs'); const horloge = require('./horloge.js'); const ouvreFilm = require('./film.js');
(async () => {
  const [port, base, heure, dossier, ips = '30', W = '390', H = '844', dsf = '2', attente = '2.4', ou = 'vitrine', sortie = ''] = process.argv.slice(2);
  fs.mkdirSync(dossier, { recursive: true });
  const cine = sortie ? ouvreFilm(sortie, +ips, { dossier, tous: 15 }) : null;
  const photo = async page => { if (cine) await cine.image(page); else await page.screenshot({ path: dossier + '/' + String(i).padStart(4, '0') + '.png' }); };
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: +dsf, ignoreHTTPSErrors: true, isMobile: +W < 700, hasTouch: +W < 700, locale: 'fr-CH' });
  await ctx.addInitScript(hh => { Date.prototype.getHours = function () { return hh; }; }, +heure);
  await ctx.addInitScript(horloge);
  const KEY = /essai/.test(base) ? 'pepe-essai-v1' : 'pepe-v1';
  if (ou !== 'vitrine') await ctx.addInitScript(([k, d]) => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify(d)); } catch (e) { } }, [KEY, { onboarded: true, me: 'Camille', age: 'e', situation: 'hand', weights: [], evo: {}, moods: {}, depots: [], tier: 'parcours', tout: true, atelier: true, start: new Date(Date.now() - 200 * 864e5).toISOString().slice(0, 10), steps: {}, seen: {}, notes: {}, pv: 2 }]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  if (ou === 'vitrine') { await p.goto('https://localhost:' + port + base + '#accueil'); await p.waitForSelector('.acc-parcours .card.sch', { timeout: 15000 }); }
  else { await p.goto('https://localhost:' + port + base); await p.waitForSelector('.tab[data-act="go"][data-view="parcours"]', { timeout: 15000 }); await p.click('.tab[data-act="go"][data-view="parcours"]'); await p.waitForSelector('[data-act="step"][data-i="' + (+ou - 1) + '"]'); await p.click('[data-act="step"][data-i="' + (+ou - 1) + '"]'); await p.waitForSelector('.card.sch'); }
  await p.waitForTimeout(900);
  await p.evaluate(() => { const c = document.querySelector('.card.sch'); const r = c.getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top - Math.max(70, (innerHeight - r.height) / 2)); });
  await p.waitForTimeout(1600);
  await p.evaluate(() => window.__vt.on());
  const pas = 1000 / +ips; let i = 0; const journal = [];
  const film = async (sec, quoi) => { const n = Math.round(sec * +ips); for (let k = 0; k < n; k++) { await p.evaluate(ms => { window.__vt.pas(ms); const d = document.getElementById('doigt'); if (d && window.__vt.t() - Number(d.dataset.t) > 330) d.style.visibility = 'hidden'; }, pas); await photo(p); i++; } };
  const etat = async () => p.evaluate(() => { const g = document.querySelector('.s-rep'), s = document.querySelector('.s-sillage'); return { pos: document.querySelector('.sch-pos').textContent, rep: g ? g.getAttribute('transform') : null, trait: s ? s.getAttribute('stroke-dashoffset') : null, phrase: (document.querySelector('.sch-caps li.cur') || {}).textContent }; });
  await p.evaluate(() => window.__vt.pas(0)); await photo(p); i++;
  await film(1.0, 'repos'); journal.push({ image: i, t: +(i / +ips).toFixed(2), ...(await etat()) });
  for (let k = 0; k < 8; k++) {
    // comme le ferait le parent : si le bouton est passé sous le bas de l'écran, la page remonte un peu avant l'appui
    const dy = await p.evaluate(() => { const bt = document.querySelector('.card.sch [data-act="schnext"]'); if (!bt) return 0; const flot = [...document.querySelectorAll('.cta-flot,.tabs')].filter(e => getComputedStyle(e).position === 'fixed' && getComputedStyle(e).visibility !== 'hidden').map(e => e.getBoundingClientRect().top).filter(y => y > innerHeight / 2); const bas = Math.min(innerHeight, ...(flot.length ? flot : [innerHeight])) - 14; const r = bt.getBoundingClientRect(); return r.bottom > bas ? Math.round(r.bottom - bas) : 0; });
    if (dy > 0) { await p.evaluate(d => window.scrollTo({ top: window.scrollY + d, behavior: 'smooth' }), dy); journal.push({ image: i, t: +(i / +ips).toFixed(2), defile: dy }); await film(0.9, 'défile'); }
    // le rond blanc montre où le doigt appuie ; il n'existe que dans ce film, et il s'enlève après un tiers de seconde
    const encore = await p.evaluate(() => { const bt = document.querySelector('.card.sch [data-act="schnext"]'); if (!bt) return false; const r = bt.getBoundingClientRect(); let d = document.getElementById('doigt'); if (!d) { d = document.createElement('i'); d.id = 'doigt'; d.style.cssText = 'position:fixed;z-index:99;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:2px solid rgba(255,255,255,.9);background:rgba(255,255,255,.28);pointer-events:none;box-shadow:0 0 0 1px rgba(0,0,0,.25)'; document.body.appendChild(d); } d.style.left = (r.left + r.width / 2) + 'px'; d.style.top = (r.top + r.height / 2) + 'px'; d.style.visibility = 'visible'; d.dataset.t = String(window.__vt.t()); bt.click(); window.__vt.css(); return true; });
    if (!encore) break;
    journal.push({ image: i, t: +(i / +ips).toFixed(2), appui: k + 1, course: await p.evaluate(() => getComputedStyle(document.querySelector('.card.sch')).getPropertyValue('--rep-d')) });
    await film(+attente, 'suite');
    journal.push({ image: i, t: +(i / +ips).toFixed(2), ...(await etat()) });
  }
  await film(0.8, 'fin');
  if (cine) await cine.fin();
  fs.writeFileSync(dossier + '/journal.json', JSON.stringify({ ips: +ips, journal }, null, 1));
  console.log('images :', i); journal.forEach(j => console.log(JSON.stringify(j)));
  if (errs.length) console.log('ERREURS', errs.slice(0, 5));
  await b.close();
})();
