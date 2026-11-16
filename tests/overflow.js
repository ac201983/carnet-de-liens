// Trouve les éléments qui dépassent la largeur de l’écran, sur tous les écrans.
// usage : node overflow.js <largeur>
const { chromium } = require('playwright');
const { walk } = require('./walk');
const W = parseInt(process.argv[2] || '320', 10);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: 800 }, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage(); let bad = 0, n = 0;
  const probe = async name => {
    const r = await page.evaluate(() => {
      const iw = window.innerWidth, out = [];
      for (const e of document.querySelectorAll('body *')) {
        if (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') continue;
        const r = e.getBoundingClientRect();
        if (r.width && (r.right > iw + 0.5 || r.left < -0.5)) {
          let clipped = false; for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(o.overflowX)) { clipped = true; break; } }
          if (clipped) continue;
          out.push((e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\\s+/).join('.') : '')) + ' [' + Math.round(r.left) + '→' + Math.round(r.right) + '] ' + (e.textContent || '').trim().slice(0, 40));
        }
      }
      return { sw: document.documentElement.scrollWidth, iw, out: out.slice(0, 8) };
    });
    n++; const ko = r.sw > r.iw + 1; if (ko) bad++;
    if (ko || r.out.length) console.log((ko ? 'DÉBORDE ' : 'à voir  ') + name + ' ' + r.sw + '/' + r.iw + (r.out.length ? '\n    ' + r.out.join('\n    ') : ''));
  };
  await walk(page, probe);
  console.log('largeur ' + W + ' : ' + n + ' écrans, ' + bad + ' avec défilement horizontal');
  await b.close(); process.exit(bad ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
