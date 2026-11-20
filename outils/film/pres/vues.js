// Regarde le lecteur du film de présentation dans la version d'essai, à la taille d'un téléphone (ou d'un ordinateur) :
// la commande de l'accueil, quelques instants du film, la fin (le bouton « Ouvrir mon espace »), l'espace après le toucher, puis le retour à l'accueil.
// Puis la capsule de respiration, par son adresse.   node vues.js <port> <dossier de sortie> [largeur] [hauteur] [instants séparés par des virgules]
const { chromium } = require('playwright'); const fs = require('fs');
const [port = '8446', out = '/home/claude/build/film/pres/vu/lecteur', L = '390', Ht = '664', INST = '3.4,12.0,15.5,24,31.5,40,48.5,54,60,70,75.2,81,88,97,103'] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--ignore-certificate-errors', '--autoplay-policy=user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: +L, height: +Ht }, deviceScaleFactor: 2, isMobile: +L < 800, hasTouch: +L < 800, locale: 'fr-CH', ignoreHTTPSErrors: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const demandes = []; p.on('request', r => { const u = r.url(); if (/\/film\//.test(u)) demandes.push(u.replace(/^.*\/film\//, '').replace(/\?.*$/, '')); });
  await p.goto('https://localhost:' + port + '/essai/'); await p.waitForSelector('.seuil .portes'); await p.waitForTimeout(800);
  const avant = demandes.slice();
  await p.evaluate(() => document.querySelector('[data-act="film"]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(600);
  const y0 = await p.evaluate(() => Math.round(scrollY));
  const cmd = await p.evaluate(() => { const c = document.querySelector('[data-act="film"]'), r = c.getBoundingClientRect(); return { texte: c.textContent.replace(/\s+/g, ' ').trim(), nom: c.getAttribute('aria-label'), boite: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] }; });
  await p.screenshot({ path: out + '/01-accueil.png' });
  const avantClic = demandes.slice();
  await p.click('[data-act="film"]'); await p.waitForSelector('#film-l');
  await p.waitForFunction(() => { const v = document.querySelector('#film-l video'); return v && !v.paused && v.currentTime > .5; }, null, { timeout: 30000 });
  const va = async t => { const e = await p.evaluate(t => new Promise(r => { const v = document.querySelector('#film-l video'); let fait = false; const fin = q => { if (fait) return; fait = true; v.pause(); setTimeout(() => r(q + ' ' + v.currentTime.toFixed(2) + ' rs' + v.readyState), 350); }; const suit = () => { if (v.currentTime >= t && v.currentTime < t + 1 && v.readyState >= 3) { v.removeEventListener('timeupdate', suit); fin('image'); } }; v.addEventListener('timeupdate', suit); setTimeout(() => fin('délai'), 12000); v.currentTime = Math.max(0, t - .15); const q = v.play(); if (q && q.catch) q.catch(() => { }); }), t); console.log('   ', t, e); };
  const info = await p.evaluate(() => { const v = document.querySelector('#film-l video'); return { src: v.currentSrc.replace(/^.*\//, ''), d: v.duration, w: v.videoWidth, h: v.videoHeight, muted: v.muted, titre: document.getElementById('film-t').textContent, son: document.getElementById('film-s').textContent.trim() }; });
  let k = 2; for (const t of INST.split(',').map(Number)) { await va(t); await p.screenshot({ path: out + '/' + String(k++).padStart(2, '0') + '-a-' + String(t).replace('.', '_') + '.png' }); }
  const fini = await p.evaluate(() => new Promise(r => { const v = document.querySelector('#film-l video'); v.addEventListener('ended', () => r('fini'), { once: true }); v.currentTime = v.duration - 1.2; const q = v.play(); if (q && q.catch) q.catch(() => { }); setTimeout(() => r('délai ' + v.currentTime), 15000); })); console.log('   fin :', fini);
  await p.waitForTimeout(900); await p.screenshot({ path: out + '/' + String(k++).padStart(2, '0') + '-fin-bouton.png' });
  const fin = await p.evaluate(() => { const v = document.querySelector('#film-l video'), s = document.querySelector('#film-suite'), b = s.querySelector('button'), r = b.getBoundingClientRect(), rv = v.getBoundingClientRect(); return { ended: v.ended, suite: !s.hidden, texte: b.textContent.trim(), bouton: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], video: [Math.round(rv.left), Math.round(rv.top), Math.round(rv.width), Math.round(rv.height)], image: [v.videoWidth, v.videoHeight], annonce: document.getElementById('film-fin').textContent }; });
  await p.click('#film-l [data-film="espace"]'); await p.waitForFunction(() => !document.getElementById('film-l') && history.state && history.state.s && history.state.s.v === 'today', null, { timeout: 8000 }); await p.waitForTimeout(1200); await p.screenshot({ path: out + '/' + String(k++).padStart(2, '0') + '-mon-espace.png' });
  const esp = await p.evaluate(() => ({ vue: document.querySelector('main').className, etat: history.state && history.state.s && history.state.s.v, titre: (document.querySelector('main h1, main h2') || {}).textContent, lecteur: !!document.getElementById('film-l'), url: location.pathname + location.hash, y: Math.round(scrollY), onglets: !!document.querySelector('nav.tabs') }));
  await p.goBack(); await p.waitForSelector('main.intro'); await p.waitForTimeout(1000); await p.screenshot({ path: out + '/' + String(k++).padStart(2, '0') + '-retour-accueil.png' });
  const ret = await p.evaluate(() => ({ vue: document.querySelector('main').className, url: location.pathname + location.hash, y: Math.round(scrollY), film: !!document.querySelector('[data-act="film"]'), lecteur: !!document.getElementById('film-l') }));
  // la capsule de respiration, par son adresse
  const q = await ctx.newPage(); await q.goto('https://localhost:' + port + '/essai/#capsule'); await q.waitForSelector('#film-l'); await q.waitForTimeout(1200); await q.screenshot({ path: out + '/' + String(k++).padStart(2, '0') + '-capsule.png' });
  const cap = await q.evaluate(() => { const v = document.querySelector('#film-l video'); return { titre: document.getElementById('film-t').textContent, src: (v.currentSrc || v.getAttribute('src') || (v.querySelector('source') || {}).src || '').replace(/^.*\//, ''), affiche: (v.getAttribute('poster') || '').replace(/^.*\//, ''), suite: document.querySelector('#film-suite button').textContent.trim() }; });
  console.log(JSON.stringify({ navigateur: 'Chromium ' + b.version(), ecran: L + ' × ' + Ht, cmd, fichiersAvantLeToucher: avantClic, info, y0, fin, esp, ret, cap, errs }, null, 1));
  await b.close();
})();
