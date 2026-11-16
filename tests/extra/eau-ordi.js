// L'eau et la goutte sur grand écran (carte graphique émulée) : le calque doit tomber exactement sur la photo.
const { chromium } = require('playwright'); const sharp = require('sharp');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference' });
  await ctx.addInitScript(() => { window.__eauSansGarde = true; try { localStorage.setItem('pepe-consent', JSON.stringify({ v: 1, audience: false, date: '2026-11-16' })); } catch (e) { } });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const D = '/home/claude/build/ordi/eau/'; require('fs').mkdirSync(D, { recursive: true });
  const eau = sel => p.evaluate(s => { const h = document.querySelector(s); const c = h && h.querySelector('canvas.eau'); if (!c) return null; const r = c.getBoundingClientRect(); const im = h.querySelector('.herobg'); const ir = (im || h).getBoundingClientRect(); return { cv: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], photo: [Math.round(ir.left), Math.round(ir.top), Math.round(ir.width), Math.round(ir.height)], px: c.width + 'x' + c.height }; }, sel);
  await p.goto('https://localhost:8443/carnet-de-liens/parent-ecoute/'); 
  const seen = []; for (const t of [900, 1700, 2500, 3300]) { await p.waitForTimeout(800); seen.push(await eau('.herofull')); await p.screenshot({ path: D + 'accueil-' + t + '.png' }); }
  await p.waitForTimeout(6000); await p.screenshot({ path: D + 'accueil-calme.png' }); const calme = await eau('.herofull');
  await p.click('.herofull ' + A('onboard')); await p.waitForTimeout(900); await p.fill('#ob-me', 'Antonio'); await p.click(A('ob-done'));
  const s2 = []; for (const t of [1500, 2500, 3500]) { await p.waitForTimeout(1000); s2.push(await eau('.band')); await p.screenshot({ path: D + 'auj-' + t + '.png' }); }
  await p.waitForTimeout(6000); await p.screenshot({ path: D + 'auj-calme.png' });
  console.log(JSON.stringify({ accueil: seen, calme, auj: s2, errs }));
  await b.close();
})().catch(e => { console.error(String(e).slice(0, 500)); process.exit(1); });
