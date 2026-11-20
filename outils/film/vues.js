// Regarde le lecteur du film dans la version d'essai, à la taille d'un téléphone : pendant « Installez-vous », à la fin (le bouton « Souffler 2 minutes »),
// après le toucher du bouton (l'exercice à son départ) et après le retour (l'accueil). node vues.js <port> <dossier de sortie> [largeur] [hauteur]
const { chromium } = require('playwright'); const fs = require('fs');
const [port = '8446', out = '/home/claude/build/film/tmp/v3/vues', L = '390', Ht = '664'] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--ignore-certificate-errors', '--autoplay-policy=user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: +L, height: +Ht }, deviceScaleFactor: 2, isMobile: +L < 800, hasTouch: +L < 800, locale: 'fr-CH', ignoreHTTPSErrors: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('https://localhost:' + port + '/essai/'); await p.waitForSelector('.seuil .portes'); await p.waitForTimeout(800);
  await p.evaluate(() => document.querySelector('[data-act="film"]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(500);
  const y0 = await p.evaluate(() => Math.round(scrollY));
  await p.screenshot({ path: out + '/1-accueil.png' });
  await p.click('[data-act="film"]'); await p.waitForSelector('#film-l');
  await p.waitForFunction(() => { const v = document.querySelector('#film-l video'); return v && !v.paused && v.currentTime > .5; }, null, { timeout: 30000 });
  // on va à l'instant voulu en laissant le film jouer (en pause, le navigateur ne charge pas la suite du fichier), puis on met en pause sur l'image
  const va = async t => { const e = await p.evaluate(t => new Promise(r => { const v = document.querySelector('#film-l video'); let fait = false; const fin = q => { if (fait) return; fait = true; v.pause(); setTimeout(() => r(q + ' ' + v.currentTime.toFixed(2) + ' rs' + v.readyState), 350); }; const suit = () => { if (v.currentTime >= t && v.currentTime < t + 1 && v.readyState >= 3) { v.removeEventListener('timeupdate', suit); fin('image'); } }; v.addEventListener('timeupdate', suit); setTimeout(() => fin('délai'), 12000); v.currentTime = Math.max(0, t - .15); const q = v.play(); if (q && q.catch) q.catch(() => { }); }), t); console.log('   ', t, e); };
  const info = await p.evaluate(() => { const v = document.querySelector('#film-l video'); return { src: v.currentSrc.replace(/^.*\//, ''), d: v.duration, w: v.videoWidth, h: v.videoHeight, muted: v.muted }; });
  await va(3.4); await p.screenshot({ path: out + '/2-sms.png' });
  await va(12.5); await p.screenshot({ path: out + '/3-et-vous.png' });
  await va(15.6); await p.screenshot({ path: out + '/4-souffler-2-minutes.png' });
  await va(18.6); await p.screenshot({ path: out + '/5-installez-vous.png' });
  await va(22.5); await p.screenshot({ path: out + '/6-inspirez.png' });
  await va(27.0); await p.screenshot({ path: out + '/7-expirez.png' });
  // la fin : on laisse le film finir
  const fini = await p.evaluate(() => new Promise(r => { const v = document.querySelector('#film-l video'); v.addEventListener('ended', () => r('fini'), { once: true }); v.currentTime = v.duration - 1.2; const q = v.play(); if (q && q.catch) q.catch(() => { }); setTimeout(() => r('délai ' + v.currentTime), 15000); })); console.log('   fin :', fini);
  await p.waitForTimeout(900); await p.screenshot({ path: out + '/8-fin-bouton.png' });
  const fin = await p.evaluate(() => { const v = document.querySelector('#film-l video'), s = document.querySelector('#film-suite'), b = s.querySelector('button'), r = b.getBoundingClientRect(), rv = v.getBoundingClientRect(); return { ended: v.ended, suite: !s.hidden, bouton: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], video: [Math.round(rv.left), Math.round(rv.top), Math.round(rv.width), Math.round(rv.height)], image: [v.videoWidth, v.videoHeight], annonce: document.getElementById('film-fin').textContent }; });
  await p.click('#film-l [data-film="souffle"]'); await p.waitForSelector('main.souffle.s-cours'); await p.waitForTimeout(900); await p.screenshot({ path: out + '/9-exercice.png' });
  const ex = await p.evaluate(() => ({ vue: document.querySelector('main').className, mot: document.getElementById('souffle-mot').textContent, lecteur: !!document.getElementById('film-l'), url: location.pathname + location.hash, y: Math.round(scrollY) }));
  await p.goBack(); await p.waitForSelector('main.intro'); await p.waitForTimeout(900); await p.screenshot({ path: out + '/10-retour-accueil.png' });
  const ret = await p.evaluate(() => ({ vue: document.querySelector('main').className, url: location.pathname + location.hash, y: Math.round(scrollY), film: !!document.querySelector('[data-act="film"]') }));
  console.log(JSON.stringify({ navigateur: 'Chromium ' + b.version(), ecran: L + ' × ' + Ht, info, y0, fin, ex, ret, errs }, null, 1));
  await b.close();
})();
