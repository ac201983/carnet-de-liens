// Pose tour à tour chaque image dans le tableau, à plusieurs largeurs, et signale tout mot coupé ou qui déborde.
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
(async () => {
  const b = await chromium.launch();
  for (const w of [320, 360, 390, 430, 768, 1280]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
    await ctx.addInitScript(() => { try { if (!localStorage.getItem('pepe-v1')) localStorage.setItem('pepe-v1', JSON.stringify({ onboarded: true, me: 'Camille', tier: 'parcours', start: '2026-11-16', age: 'e', situation: 'hand', weights: [], evo: {}, steps: {}, moods: {}, depots: [], pv: 2, seen: {}, notes: {} })); } catch (e) { } });
    const p = await ctx.newPage();
    await p.goto('https://localhost:8444/'); await p.waitForTimeout(400);
    const c = await p.$('#consent [data-consent="no"]'); if (c) await c.click();
    await p.click('.tab' + A('go', '[data-view="kit"]')); await p.click(A('kit', '[data-v="tools"]')); await p.click(A('tool', '[data-v="ft"]')); await p.click(A('ftg', '[data-v="tout"]')); await p.waitForTimeout(300);
    const r = await p.evaluate(async () => {
      const out = { coupes: [], tailles: {}, grille: [] };
      const ids = [...document.querySelectorAll('#ft-grille button')].map(x => x.dataset.id);
      for (const id of ids) {
        document.querySelector('#ft [data-k="first"]').click();
        document.querySelector('#ft-grille [data-id="' + id + '"]').click();
        const s = document.querySelector('#ft [data-k="first"] .pcarte > span');
        const cs = getComputedStyle(s); const fs = parseFloat(cs.fontSize); const lh = parseFloat(cs.lineHeight) || fs * 1.15;
        const lignes = Math.round(s.getBoundingClientRect().height / lh); const mots = s.textContent.trim().split(/\s+/).length + (s.textContent.match(/-/g) || []).length;
        out.tailles[fs.toFixed(1)] = (out.tailles[fs.toFixed(1)] || 0) + 1;
        const carte = s.parentElement.getBoundingClientRect();
        if (lignes > mots || s.scrollWidth > s.clientWidth + 1 || s.getBoundingClientRect().right > carte.right + .5) out.coupes.push(s.textContent + ' (' + fs.toFixed(1) + ' px, ' + lignes + ' lignes)');
      }
      // dans la grille : un mot plus large que sa carte
      for (const bt of document.querySelectorAll('#ft-grille button')) { const s = bt.querySelector('span'); const lh = parseFloat(getComputedStyle(s).lineHeight); const lignes = Math.round(s.getBoundingClientRect().height / lh); const mots = s.textContent.trim().split(/\s+/).length + (s.textContent.match(/-/g) || []).length; if (lignes > mots) out.grille.push(s.textContent + ' (' + lignes + ' lignes)'); }
      return out;
    });
    console.log(w + ' px : tailles du mot du tableau ' + JSON.stringify(r.tailles) + (r.coupes.length ? '\n   COUPÉS dans le tableau : ' + r.coupes.join(', ') : '\n   aucun mot coupé dans le tableau') + (r.grille.length ? '\n   COUPÉS dans la grille : ' + r.grille.join(', ') : ' ni dans la grille'));
    await ctx.close();
  }
  await b.close();
})();
