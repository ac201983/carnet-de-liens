// Planche de contact : les pictogrammes candidats, sur fond blanc, avec leur nom de fichier.
const { chromium } = require('playwright');
const fs = require('fs');
const DIR = '/tmp/pictos/mulberry/EN/';
const noms = process.argv.slice(3);
const out = process.argv[2];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 1 });
  const html = '<style>body{margin:0;padding:10px;background:#ddd;font:11px sans-serif;display:grid;grid-template-columns:repeat(10,1fr);gap:6px}figure{margin:0;background:#fff;border-radius:8px;padding:6px;text-align:center}img{width:112px;height:112px;object-fit:contain;display:block;margin:0 auto 3px}figcaption{word-break:break-all;line-height:1.15}</style>' +
    noms.map(n => fs.existsSync(DIR + n + '.svg') ? `<figure><img src="data:image/svg+xml;base64,${fs.readFileSync(DIR + n + '.svg').toString('base64')}"><figcaption>${n}</figcaption></figure>` : `<figure style="background:#fbb">${n} ABSENT</figure>`).join('');
  await p.setContent(html); await p.waitForTimeout(800);
  await p.screenshot({ path: out, fullPage: true });
  await b.close();
})();
