// « Souffler » image par image. L'horloge de la page est tenue à la main (performance.now et requestAnimationFrame) :
// chaque image est exacte, quelle que soit la vitesse de la machine. Les images vont dans un dossier, prêtes pour une vidéo.
// node souffle-vue.js <port> <base> <heure> <dossier> [images par seconde=20] [secondes=12.6] [respiration=long|egal|libre] [largeur=390] [hauteur=760] [échelle=2]
const { chromium } = require('playwright'); const fs = require('fs');
const horloge = () => {
  const P0 = performance.now.bind(performance), R0 = window.requestAnimationFrame.bind(window), C0 = window.cancelAnimationFrame.bind(window);
  let virt = null, q = [], id = 1e6;
  window.__vt = { on() { if (virt == null) virt = P0(); }, t() { return virt; }, pas(ms) { virt += ms; const L = q; q = []; L.forEach(f => { try { f.cb(virt); } catch (e) { console.error('vt', e); } }); return virt; } };
  performance.now = () => (virt != null ? virt : P0());
  window.requestAnimationFrame = cb => { if (virt == null) return R0(cb); q.push({ id: ++id, cb }); return id; };
  window.cancelAnimationFrame = n => { if (n > 1e6) q = q.filter(f => f.id !== n); else C0(n); };
};
(async () => {
  const [port, base, heure, dossier, ips = '20', sec = '12.6', resp = 'long', W = '390', H = '760', dsf = '2'] = process.argv.slice(2);
  fs.mkdirSync(dossier, { recursive: true });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: +dsf, ignoreHTTPSErrors: true, isMobile: +W < 700, hasTouch: +W < 700, locale: 'fr-CH' });
  await ctx.addInitScript(hh => { window.__eauSansGarde = true; Date.prototype.getHours = function () { return hh; }; }, +heure);
  await ctx.addInitScript(horloge);
  await ctx.addInitScript(([k, m]) => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify({ souffle: { m: m, c: 8 } })); } catch (e) { } }, [/essai/.test(base) ? 'pepe-essai-v1' : 'pepe-v1', resp]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  await p.goto('https://localhost:' + port + base); await p.waitForSelector('.seuil .porte'); await p.waitForTimeout(700);
  await p.click('[data-act="porte"][data-v="souffle"]'); await p.waitForSelector('main.souffle .etang canvas.eau', { timeout: 15000 }); await p.waitForTimeout(1200);
  // on arrête, puis on recommence avec l'horloge tenue à la main : le départ de l'exercice est ainsi l'image 0
  await p.click('[data-act="souffle-stop"]'); await p.waitForSelector('main.souffle.s-pret'); await p.waitForTimeout(1800);
  await p.evaluate(() => window.__vt.on());
  await p.click('[data-act="souffle-go"]'); await p.waitForSelector('main.souffle.s-cours');
  const pas = 1000 / +ips, n = Math.round(+sec * +ips); const journal = []; const t0 = Date.now();
  for (let i = 0; i <= n; i++) {
    if (i) await p.evaluate(ms => window.__vt.pas(ms), pas); else await p.evaluate(() => window.__vt.pas(0));
    await p.screenshot({ path: dossier + '/' + String(i).padStart(4, '0') + '.png' });
    journal.push({ i, t: +(i * pas / 1000).toFixed(3), mot: await p.evaluate(() => (document.getElementById('souffle-mot') || {}).textContent) });
  }
  const chg = journal.filter((x, i) => i === 0 || x.mot !== journal[i - 1].mot);
  fs.writeFileSync(dossier + '/journal.json', JSON.stringify({ ips: +ips, resp, changements: chg }, null, 1));
  console.log('images :', n + 1, 'en', Math.round((Date.now() - t0) / 1000), 's ; changements de mot :', JSON.stringify(chg));
  if (errs.length) console.log('ERREURS', errs.slice(0, 5));
  await b.close();
})();
