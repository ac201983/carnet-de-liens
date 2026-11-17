// Compare chaque image allégée à son original (rendu à 256 px) et signale tout écart visible.
const { chromium } = require('playwright');
const fs = require('fs');
const items = JSON.parse(fs.readFileSync('/home/claude/build/pictos/liste.json', 'utf8'));
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 600, height: 300 } });
  let pire = 0, pireNom = '', mauvais = [];
  for (const [id, f] of items) {
    const a = fs.readFileSync('/tmp/pictos/mulberry/EN/' + f + '.svg').toString('base64');
    const c = fs.readFileSync('/home/claude/site-src/img/pictos/' + id + '.svg').toString('base64');
    await p.setContent(`<body style="margin:0;background:#fff"><img id="a" width="256" height="256" src="data:image/svg+xml;base64,${a}"><img id="c" width="256" height="256" src="data:image/svg+xml;base64,${c}"><canvas id="k" width="256" height="256"></canvas>`);
    await p.waitForFunction(() => document.getElementById('a').complete && document.getElementById('c').complete && document.getElementById('a').naturalWidth > 0 && document.getElementById('c').naturalWidth > 0, null, { timeout: 5000 }).catch(() => { });
    const d = await p.evaluate(() => {
      const px = id => { const k = document.createElement('canvas'); k.width = k.height = 256; const x = k.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 256, 256); x.drawImage(document.getElementById(id), 0, 0, 256, 256); return x.getImageData(0, 0, 256, 256).data; };
      const A = px('a'), C = px('c'); let n = 0, encre = 0;
      for (let i = 0; i < A.length; i += 4) { const e = Math.abs(A[i] - C[i]) + Math.abs(A[i + 1] - C[i + 1]) + Math.abs(A[i + 2] - C[i + 2]); if (e > 90) n++; if (A[i] + A[i + 1] + A[i + 2] < 740) encre++; }
      return { n, encre };
    });
    if (d.encre < 500) mauvais.push(id + ' (presque vide : ' + d.encre + ')');
    if (d.n > pire) { pire = d.n; pireNom = id; }
    if (d.n > 60) mauvais.push(id + ' (' + d.n + ' points différents)');
  }
  console.log('pire écart : ' + pire + ' points sur 65536 (' + pireNom + ')');
  console.log(mauvais.length ? 'À REGARDER : ' + mauvais.join(', ') : 'toutes les images sont identiques à l’œil');
  await b.close();
})();
