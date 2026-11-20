// Le film « Et vous ? », V3 : l'accueil de la version d'essai, descendu pour que « Souffler 2 minutes » vienne juste sous l'en-tête (le logo et le nom restent en haut de l'écran, comme sur le site).
// Sert au plan de la 15e seconde : l'interface réelle, cadrée d'emblée sur « Souffler 2 minutes », puis l'appui.
// Pour le film seulement : la commande « Voir le film » de l'accueil est cachée (elle garde sa place), pour que le film ne se montre pas lui-même.
// node capture_accueil.js <port> <base> <dossier de sortie> [points par pixel=5] [descente=425] [image du toucher=36] [images=44]
const { chromium } = require('playwright'); const fs = require('fs');
const horloge = require('/home/claude/build/goutte/horloge.js');
const [port = '8446', base = '/essai/', out = 'accueil', DSF = '5', S = '425', FT = '36', N = '44'] = process.argv.slice(2);
const APP = 'https://localhost:' + port + base; const IPS = 30;
(async () => {
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--ignore-certificate-errors'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: +DSF, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true, locale: 'fr-CH' });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; Date.prototype.getHours = function () { return 21; }; Date.prototype.getMinutes = function () { return 40; }; });
  await ctx.addInitScript(horloge);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto(APP, { waitUntil: 'load' }); await p.addStyleTag({ content: '.film-cmd{visibility:hidden!important}' });
  await p.waitForSelector('.seuil [data-act="porte"][data-v="souffle"]'); await p.waitForTimeout(2600);
  await p.evaluate(y => window.scrollTo(0, y), +S); await p.waitForTimeout(700);
  const m = await p.evaluate(() => {
    const r = e => { const q = e.getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height }; };
    const txt = e => { const g = document.createRange(); g.selectNodeContents(e); return r(g); };
    const porte = document.querySelector('.seuil [data-act="porte"][data-v="souffle"]'), tx = porte.querySelector('.tx'), b = tx.querySelector('b') || tx.firstElementChild, s = tx.querySelector('small') || tx.lastElementChild;
    const tete = document.querySelector('.hbar'), sos = [...document.querySelectorAll('.hbar *')].find(e => /^SOS$/i.test(e.textContent.trim()));
    return { defile: Math.round(window.scrollY), porte: r(porte), titre: txt(b), sous: txt(s), titre_txt: b.textContent, sous_txt: s.textContent, tete: tete ? r(tete) : null, sos: sos ? r(sos) : null, suivante: r(document.querySelector('.seuil [data-act="porte"][data-v="piste"]')) };
  });
  const doigt = { x: 262, y: Math.round((m.porte.y + 24) * 10) / 10 };
  await p.evaluate(() => window.__vt.on());
  const n = +N, pas = 1000 / IPS; const journal = Object.assign({ dsf: +DSF, ips: IPS, doigt, image_toucher: +FT }, m);
  for (let i = 0; i < n; i++) {
    if (i === +FT) { await p.touchscreen.tap(doigt.x, doigt.y); }
    await p.evaluate(ms => window.__vt.pas(ms), i ? pas : 0);
    fs.writeFileSync(out + '/' + String(i).padStart(4, '0') + '.jpg', await p.screenshot({ type: 'jpeg', quality: 95 }));
    if (i === +FT + 4) journal.apres = await p.evaluate(() => ({ vue: (document.querySelector('main') || {}).className || '', mot: (document.getElementById('souffle-mot') || {}).textContent || null }));
  }
  journal.erreurs = errs; fs.writeFileSync(out + '/journal.json', JSON.stringify(journal, null, 1));
  console.log(JSON.stringify(journal));
  await b.close();
})();
