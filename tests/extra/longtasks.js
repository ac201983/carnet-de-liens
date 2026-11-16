// Tâches longues du fil principal pendant les 8 premières secondes, processeur ralenti 4 fois (comme Lighthouse), selon ce qu'on retire.
const { chromium } = require('playwright');
(async () => {
  for (const mode of ['normal', 'sans-lumiere', 'sans-eau', 'sans-les-deux', 'effets-coupes']) {
    const b = await chromium.launch({ args: ['--headless=new'] });
    const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true, ignoreHTTPSErrors: true, reducedMotion: mode === 'effets-coupes' ? 'reduce' : 'no-preference' });
    await ctx.addInitScript(mode => {
      window.__lt = []; try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lt.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ entryTypes: ['longtask'] }); } catch (e) { }
      if (/eau|deux/.test(mode)) { const gc = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, o) { return /webgl/.test(String(t)) ? null : gc.call(this, t, o); }; }
      const gc2 = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, o) { const r = gc2.call(this, t, o); if (/webgl/.test(String(t))) window.__gl = (window.__gl || '') + (r ? 'O' : 'x') + (o && o.failIfMajorPerformanceCaveat ? '!' : ''); return r; };
    }, mode);
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    if (/lumiere|deux/.test(mode)) await page.addInitScript(() => { addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = '.lum .herofull::before,.lum .band::before{display:none!important}'; document.head.appendChild(s); }); });
    await page.goto('https://localhost:8443/carnet-de-liens/parent-ecoute/'); await page.waitForTimeout(8000);
    const r = await page.evaluate(() => ({ lt: window.__lt, gl: window.__gl || '-', eau: !!document.querySelector('canvas.eau'), fx: document.documentElement.className }));
    const tot = r.lt.reduce((s, x) => s + Math.max(0, x[1] - 50), 0);
    console.log(mode.padEnd(15), '| blocage total', String(tot).padStart(5), 'ms |', r.lt.length, 'tâches longues | webgl:', r.gl, '| classes:', r.fx, '|', r.lt.slice(0, 8).map(x => x[0] + ':' + x[1]).join(' '));
    await b.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
