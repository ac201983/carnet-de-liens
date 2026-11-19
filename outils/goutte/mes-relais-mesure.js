// Mesure la ligne d'une fiche dans « Mes relais » : le texte est-il coupé, et où tombent ses rectangles ?
// usage : node mes-relais-mesure.js <port> <base> <largeur> <sortie.png>
const { chromium } = require('playwright');
const [port, base, W, out] = [process.argv[2] || '8445', process.argv[3] || '/', +(process.argv[4] || 390), process.argv[5] || '/home/claude/build/goutte/vues/mes-relais.png'];
const iso = d => { const x = new Date(Date.now() + d * 86400000); const p = v => String(v).padStart(2, '0'); return x.getFullYear() + '-' + p(x.getMonth() + 1) + '-' + p(x.getDate()); };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  const notes = { onboarded: true, start: iso(-20), tier: 'free', achats: { relais: { le: iso(0) } }, steps: {}, notes: {}, seen: {}, depots: [], moods: {}, pv: 3,
    rel: { fiches: [{ id: 'fa', c: iso(0), m: iso(0), env: iso(0), qui: 'Noé', chez: 'mon frère Rémi', quand: 'du samedi 5 au dimanche 6 décembre', tu: true, trois: ['Noé a besoin de savoir ce qui vient après.', 'Quand il se bouche les oreilles, le bruit est trop fort.', 'Noé choisit lui-même son dessin animé du soir.'], moi: [], s: {}, tel: [{ n: 'Maman', t: '079 000 00 00' }] }], reunions: [] } };
  await ctx.addInitScript(([k, d]) => { try { if (!localStorage.getItem('__pose')) { localStorage.setItem(k, d); localStorage.setItem('__pose', '1'); } } catch (e) { } }, [base === '/' ? 'pepe-v1' : 'pepe-essai-v1', JSON.stringify(notes)]);
  const p = await ctx.newPage();
  await p.goto('https://localhost:' + port + base + 'relais/'); await p.waitForSelector('.rl-mes .liste .sit'); await p.waitForTimeout(600);
  const m = await p.evaluate(() => {
    const sp = document.querySelector('.rl-mes .liste .sit .tx > span'), bt = sp.closest('button'), v = document.querySelector('.v-relais');
    const rg = document.createRange(); rg.selectNodeContents(sp.firstChild);
    const R = r => [Math.round(r.left * 10) / 10, Math.round(r.top * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10];
    const cs = getComputedStyle(sp);
    return { texte: sp.textContent, span: R(sp.getBoundingClientRect()), bouton: R(bt.getBoundingClientRect()), vue: R(v.getBoundingClientRect()), vueOverflow: getComputedStyle(v).overflowX, rects: [...rg.getClientRects()].map(R), coupe: sp.scrollWidth > sp.clientWidth, sw: sp.scrollWidth, cw: sp.clientWidth, ws: cs.whiteSpace, to: cs.textOverflow,
      auBout: (() => { const r = [...rg.getClientRects()][0]; const t = document.elementFromPoint(r.right - 1, r.top + 1); return t ? t.tagName + '.' + (t.className || '') : null; })(), vw: innerWidth };
  });
  console.log(JSON.stringify(m, null, 1));
  const y = m.bouton[1]; await p.screenshot({ path: out, clip: { x: 0, y: Math.max(0, y - 90), width: W, height: 230 } });
  await b.close();
})();
