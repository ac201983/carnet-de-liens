// Pour chaque schéma à repère : à quelle fraction de la courbe se trouve chaque point d'arrêt (calcul fait par le navigateur lui-même).
const { chromium } = require('playwright');
const C = {
  vague: { d: 'M20 176 C 90 176, 110 44, 170 44 S 250 176, 320 176', pts: [[99, 110], [170, 44], [218, 76], [241, 110], [320, 176]] },
  points: { d: 'M30 152 C 95 152, 105 98, 170 98 S 250 44, 310 44', pts: [[30, 152], [170, 98], [310, 44]] },
  cap: { d: 'M30 156 C 120 156, 160 84, 304 84', pts: [[30, 156], [75, 150], [304, 84]] },
  creux: { d: 'M20 56 C 90 56, 110 160, 170 160 S 250 56, 320 56', pts: [[20, 56], [170, 160], [222, 131], [320, 56]] },
  arche: { d: 'M44 184 C 70 18, 270 18, 296 184', pts: [[44, 184], [96.3, 85.8], [243.7, 85.8], [296, 184]] },
  sentier: { d: 'M30 214 C 110 214, 196 216, 204 194 C 212 170, 100 186, 92 160 C 84 132, 190 128, 224 104', pts: [[30, 214], [105.3, 213.8], [180.4, 207.5], [163.9, 178.6], [92.5, 161.3], [152.7, 127.9], [224, 104]] },
  ravito: { d: 'M30 62 L90 101 L90 66 L150 105 L150 70 L210 109 L210 58 L270 97 L270 62 L312 90 L312 60', pts: [[30, 62], [210, 109], [270, 97], [312, 60]] }
};
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const r = await p.evaluate(C => {
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'); document.body.appendChild(svg);
    const out = {};
    for (const k in C) {
      const el = document.createElementNS(ns, 'path'); el.setAttribute('d', C[k].d); svg.appendChild(el);
      const L = el.getTotalLength(), N = 20000;
      // les points d'arrêt se suivent le long de la courbe : on cherche chacun après le précédent (une courbe peut repasser près d'elle-même)
      let depuis = 0;
      out[k] = { L: +L.toFixed(1), pts: C[k].pts.map(t => { let best = 1e9, bi = 0; for (let i = depuis; i <= N; i++) { const q = el.getPointAtLength(L * i / N), d = Math.hypot(q.x - t[0], q.y - t[1]); if (d < best) { best = d; bi = i; } } depuis = bi; const q = el.getPointAtLength(L * bi / N); return { vise: t, f: +(bi / N).toFixed(4), x: +q.x.toFixed(1), y: +q.y.toFixed(1), ecart: +best.toFixed(2) }; }) };
    }
    return out;
  }, C);
  for (const k in r) { console.log(k, 'longueur', r[k].L); for (const q of r[k].pts) console.log('   ', JSON.stringify(q)); }
  await b.close();
})();
