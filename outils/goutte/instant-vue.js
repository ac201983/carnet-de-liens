// « Prendre un instant » image par image : l'arrivée (la goutte rebondit une fois), puis des touchers sur l'eau.
// node instant-vue.js <port> <base> <heure> <dossier> [images par seconde=20] [sans=1 pour l'écran sans carte graphique]
const { chromium } = require('playwright'); const fs = require('fs');
const horloge = () => {
  const P0 = performance.now.bind(performance), R0 = window.requestAnimationFrame.bind(window), C0 = window.cancelAnimationFrame.bind(window);
  let virt = null, q = [], id = 1e6;
  window.__vt = { on() { if (virt == null) virt = P0(); }, pas(ms) { virt += ms; const L = q; q = []; L.forEach(f => { try { f.cb(virt); } catch (e) { console.error('vt', e); } }); return virt; } };
  performance.now = () => (virt != null ? virt : P0());
  window.requestAnimationFrame = cb => { if (virt == null) return R0(cb); q.push({ id: ++id, cb }); return id; };
  window.cancelAnimationFrame = n => { if (n > 1e6) q = q.filter(f => f.id !== n); else C0(n); };
};
(async () => {
  const [port, base, heure, dossier, ips = '20', sans = '0'] = process.argv.slice(2);
  fs.mkdirSync(dossier, { recursive: true });
  const b = await chromium.launch({ args: sans === '1' ? [] : ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true, locale: 'fr-CH' });
  await ctx.addInitScript(([hh, s]) => { if (!s) window.__eauSansGarde = true; Date.prototype.getHours = function () { return hh; }; }, [+heure, sans === '1']);
  if (sans !== '1') await ctx.addInitScript(horloge);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  await p.goto('https://localhost:' + port + base); await p.waitForSelector('.seuil .porte'); await p.waitForTimeout(600);
  await p.click('[data-act="entrer"][data-v="today"]'); await p.waitForSelector('.instant-b'); await p.waitForTimeout(3500);
  await p.$eval('.instant-b', e => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(300);
  await p.screenshot({ path: dossier + '/aujourdhui-bouton.png' });
  await p.click('.instant-b'); await p.waitForSelector('main.instant .etang'); await p.waitForTimeout(sans === '1' ? 2500 : 5200);
  await p.screenshot({ path: dossier + '/arrivee.png' });
  const box = await p.$eval('main.instant .etang', e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  const info = await p.evaluate(() => ({ h1: document.querySelector('main.instant h1').textContent, aide: document.querySelector('main.instant .aide').textContent, son: (document.querySelector('main.instant .son-b') || {}).innerText, cv: !!document.querySelector('.etang canvas.eau'), app: document.getElementById('app').className, html: document.documentElement.className }));
  console.log(JSON.stringify(info));
  const touche = async (fx, fy) => p.evaluate(([x, y]) => { const t = document.querySelector('main.instant .etang-photo'); t.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y, button: 0, pointerId: 1, pointerType: 'touch' })); }, [box.x + box.w * fx, box.y + box.h * fy]);
  if (sans === '1') {
    await touche(.3, .66); await p.waitForTimeout(500); await p.screenshot({ path: dossier + '/secours-1.png' }); await touche(.7, .8); await p.waitForTimeout(900); await p.screenshot({ path: dossier + '/secours-2.png' });
    console.log('cercles :', await p.evaluate(() => document.querySelectorAll('.onde-doigt').length));
  } else {
    await p.evaluate(() => window.__vt.on());
    const pas = 1000 / +ips; let i = 0; const img = async () => { await p.screenshot({ path: dossier + '/' + String(i++).padStart(4, '0') + '.png' }); };
    const avance = async s => { for (let k = 0; k < Math.round(s * +ips); k++) { await p.evaluate(ms => window.__vt.pas(ms), pas); await img(); } };
    await img(); await touche(.32, .68); await avance(1.6); await touche(.72, .82); await avance(3.6);
    console.log('images :', i);
  }
  if (errs.length) console.log('ERREURS', errs.slice(0, 5));
  await b.close();
})();
