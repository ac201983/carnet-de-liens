// usage: node lh-report.js <prefix> <n> [--fails]
const [prefix, n, fails] = process.argv.slice(2);
for (let i = 1; i <= Number(n); i++) {
  const r = require(prefix + i + '.json'); const c = r.categories, a = r.audits;
  if (r.runtimeError) { console.log('run', i, 'ERROR', r.runtimeError.code); continue; }
  console.log('run', i, '| perf', Math.round(c.performance.score * 100), 'a11y', Math.round(c.accessibility.score * 100), 'bp', Math.round(c['best-practices'].score * 100), 'seo', Math.round(c.seo.score * 100),
    '| FCP', a['first-contentful-paint'].displayValue, 'LCP', a['largest-contentful-paint'].displayValue, 'TBT', a['total-blocking-time'].displayValue, 'CLS', a['cumulative-layout-shift'].displayValue, 'SI', a['speed-index'].displayValue,
    '| poids', Math.round(a['total-byte-weight'].numericValue / 1024) + ' Ko', 'requêtes', (a['network-requests'].details.items || []).length);
  if (fails && i === 1) for (const k of Object.keys(a)) { const x = a[k]; if (x.score !== null && x.score < 0.9 && !['notApplicable', 'informative', 'manual'].includes(x.scoreDisplayMode)) console.log('   ✗', k, '—', x.title, x.displayValue ? '[' + x.displayValue + ']' : ''); }
}
