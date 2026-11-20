// Le film « Et vous ? », format vertical : la même capture que capture_app.js, mais le grand mot de « Souffler » est caché (le sous-titre reste).
// Le film écrit ce mot lui-même, au même endroit et dans la même police, pour qu'il reste en place pendant que le cadre se resserre sur la goutte.
// Pour le film seulement, 2 réglages de finesse sont changés à la volée (rien n'est changé dans le site) : la photo de la goutte est servie agrandie,
// et le dessin de l'eau suit la finesse de l'écran au lieu d'être plafonné à 2 points par pixel.
// node capture_sans_mot.js <port> <base> <dossier de sortie> [points par pixel=5] [secondes=14.5] [image du toucher=36] [ce qui est caché=#souffle-mot]
// V3 : « #souffle-mot,#souffle-aide » cache aussi la phrase sous le mot (dossier app-st). Le film vertical écrit alors « Inspirez » et « Expirez » lui-même, sur une eau sans texte.
const { chromium } = require('playwright'); const fs = require('fs');
const horloge = require('/home/claude/build/goutte/horloge.js');
const [port = '8446', base = '/essai/', out = 'app', DSF = '5', SEC = '14.5', FT = '36', CACHE = '#souffle-mot'] = process.argv.slice(2);
const APP = 'https://localhost:' + port + base; const IPS = 30;
(async () => {
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--ignore-certificate-errors'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: +DSF, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true, locale: 'fr-CH' });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; Date.prototype.getHours = function () { return 21; }; Date.prototype.getMinutes = function () { return 40; }; });
  await ctx.addInitScript(horloge);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  let retouches = 0;
  await p.route('**/app.js*', async route => {
    let t = fs.readFileSync('/home/claude/essai-out/essai/app.js', 'utf8');
    const a = 'Math.min(window.devicePixelRatio||1,2,Math.max(1,Math.sqrt(1.8e6/(g.w*g.h))))'; if (t.includes(a)) { t = t.replace(a, 'Math.min(window.devicePixelRatio||1,6)'); retouches++; }
    await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: t });
  });
  await p.route('**/img/hero.webp*', route => { retouches++; return route.fulfill({ status: 200, contentType: 'image/jpeg', body: fs.readFileSync('/home/claude/build/film/plates/hero-film.jpg') }); });
  await p.goto(APP, { waitUntil: "load" }); await p.addStyleTag({ content: CACHE + "{visibility:hidden!important}" }); await p.waitForSelector('.seuil [data-act="porte"][data-v="souffle"]'); await p.waitForTimeout(2600);
  const porte = await p.$eval('.seuil [data-act="porte"][data-v="souffle"]', e => { const r = e.getBoundingClientRect(); const b = e.querySelector('b') || e; const rb = b.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, tx: rb.left, ty: rb.top, tw: rb.width, th: rb.height, texte: e.textContent.replace(/\s+/g, ' ').trim() }; });
  const doigt = { x: Math.round(porte.tx + Math.min(porte.tw * .62, 150)), y: Math.round(porte.y + porte.h * .52) };
  await p.evaluate(() => window.__vt.on());
  const n = Math.round(+SEC * IPS), pas = 1000 / IPS; const journal = { dsf: +DSF, ips: IPS, porte, doigt, image_toucher: +FT, images: [], retouches };
  const t0 = Date.now(); let dernier = null;
  for (let i = 0; i < n; i++) {
    if (i === +FT) { await p.touchscreen.tap(doigt.x, doigt.y); }
    await p.evaluate(ms => window.__vt.pas(ms), i ? pas : 0);
    fs.writeFileSync(out + '/' + String(i).padStart(4, '0') + '.jpg', await p.screenshot({ type: 'jpeg', quality: 95 }));
    const e = await p.evaluate(() => { const m = document.getElementById('souffle-mot'), et = document.querySelector('.souffle .etang'), c = et && et.querySelector('canvas.eau'), r = et && et.getBoundingClientRect(), mr = m && m.getBoundingClientRect();
      return { mot: m ? m.textContent : null, vue: (document.querySelector('main') || {}).className || '', eau: c ? [c.width, c.height] : null, etang: r ? [r.left, r.top, r.width, r.height] : null, motr: mr ? [mr.left, mr.top, mr.width, mr.height] : null, aide: (document.getElementById('souffle-aide') || {}).textContent || '' }; });
    if (e.mot !== dernier || i === +FT + 1) { journal.images.push(Object.assign({ i }, e)); dernier = e.mot; }
    if (i % 60 === 0) console.log('image', i, Math.round((Date.now() - t0) / 1000) + ' s', e.mot, e.eau);
  }
  journal.erreurs = errs; fs.writeFileSync(out + '/journal.json', JSON.stringify(journal, null, 1));
  console.log('fini :', n, 'images en', Math.round((Date.now() - t0) / 1000), 's ; retouches', retouches, '; erreurs', errs.length, errs.slice(0, 2).join(' | '));
  console.log(JSON.stringify(journal.images.map(x => [x.i, x.mot, x.eau && x.eau.join('x')])));
  await b.close();
})();
