const { chromium } = require('playwright');
const URL = 'https://localhost:8443/carnet-de-liens/parent-ecoute/';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'fr-CH', ignoreHTTPSErrors: true });
  const p = await ctx.newPage();
  const errs = [], reqs = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text().slice(0, 300)); });
  p.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 300)));
  p.on('request', r => reqs.push(r.url()));
  p.on('requestfailed', r => errs.push('failed: ' + r.url().slice(0, 100) + ' ' + (r.failure() || {}).errorText));
  await p.goto(URL, { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  const info = await p.evaluate(() => new Promise(res => {
    const out = { paint: performance.getEntriesByType('paint').map(e => e.name + ':' + Math.round(e.startTime)), fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.style), cls: 0 };
    new PerformanceObserver(l => { const e = l.getEntries(); const last = e[e.length - 1]; out.lcp = Math.round(last.startTime) + ' ' + (last.element ? last.element.tagName + '.' + last.element.className : ''); }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => res(out), 300);
  }));
  console.log(JSON.stringify(info));
  console.log('requests:', reqs.map(u => u.replace('https://localhost:8443/carnet-de-liens/parent-ecoute/', '')).join(' | '));
  console.log('third-party:', reqs.filter(u => !u.startsWith('https://localhost:8443/')));
  await p.screenshot({ path: '/home/claude/build/n1-welcome.png' });
  await p.screenshot({ path: '/home/claude/build/n1-welcome-full.png', fullPage: true });
  console.log('errors:', errs);
  await b.close();
})();
