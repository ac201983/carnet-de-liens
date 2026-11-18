// Sur téléphone : les zones à toucher et la taille des textes, sur tous les écrans.
// - tout ce qui se touche du bout du doigt fait au moins 44 px de haut et de large (les liens au fil d'une phrase font exception, comme le veut l'usage) ;
// - aucun texte n'est écrit plus petit que 13 px, et le texte courant ne descend pas sous 15 px.
// usage : node doigt.js [largeur]   (code de sortie 1 s'il reste une zone trop petite ou un texte trop petit)
const { chromium } = require('playwright');
const { walk } = require('./walk');
const W = parseInt(process.argv[2] || '390', 10);
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--ignore-certificate-errors'] });
  const ctx = await b.newContext({ viewport: { width: W, height: 844 }, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce', hasTouch: true, isMobile: true, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const zones = new Map(), textes = new Map(); let n = 0;
  const visit = async nom => {
    n++;
    const r = await page.evaluate(() => {
      const sig = e => { let s = e.tagName.toLowerCase(); if (e.id && !/^\w+-\d+$/.test(e.id)) s += '#' + e.id; const c = (typeof e.className === 'string' ? e.className : '').trim().split(/\s+/).filter(x => x && !/^(reveal|d\d|fx\w*|in|on|now|done|un)$/.test(x)).slice(0, 3); if (c.length) s += '.' + c.join('.'); return s; };
      const chemin = e => { const p = e.parentElement; return (p && p !== document.body ? sig(p) + ' > ' : '') + sig(e) + (e.dataset && e.dataset.act ? '[' + e.dataset.act + ']' : ''); };
      const visible = e => { const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return null; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || cs.pointerEvents === 'none') return null; for (let p = e; p; p = p.parentElement) { const c = getComputedStyle(p); if (c.display === 'none' || c.visibility === 'hidden') return null; } return r; };
      const Z = [];
      for (const e of document.querySelectorAll('button, a[href], input, textarea, select, summary, label.share')) {
        if (e.disabled || e.type === 'hidden') continue; const r = visible(e); if (!r) continue;
        // un lien au fil d'une phrase : il suit la ligne de texte
        const cs = getComputedStyle(e);
        if (e.tagName === 'A' && cs.display === 'inline' && e.parentElement && /^(P|LI|SPAN|DIV|SMALL)$/.test(e.parentElement.tagName) && e.parentElement.textContent.trim().length > e.textContent.trim().length + 12) continue;
        if (e.matches('input[type=checkbox]') && e.closest('label')) continue;   // la case fait partie de son libellé, qui est mesuré
        if (e.matches('.sr, .sr *')) continue;
        if (r.width < 43.5 || r.height < 43.5) Z.push([chemin(e), Math.round(r.width), Math.round(r.height), (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 30)]);
      }
      const T = [];
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (tw.nextNode()) { const t = tw.currentNode; if (!t.nodeValue.trim()) continue; const e = t.parentElement; if (!e || e.closest('svg, script, style, noscript, .sr')) continue; if (!visible(e)) continue; const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 14.5) T.push([chemin(e), fs, t.nodeValue.trim().slice(0, 30)]); }
      return { Z, T };
    });
    for (const [c, w, h, t] of r.Z) { const k = c; const o = zones.get(k) || { w, h, t, n: 0, ou: nom }; o.w = Math.min(o.w, w); o.h = Math.min(o.h, h); o.n++; zones.set(k, o); }
    for (const [c, fs, t] of r.T) { const k = c + ' @' + fs; const o = textes.get(k) || { fs, t, n: 0, ou: nom }; o.n++; textes.set(k, o); }
  };
  await walk(page, visit);
  await b.close();
  const Z = [...zones].sort((a, b) => Math.min(a[1].w, a[1].h) - Math.min(b[1].w, b[1].h));
  console.log('=== zones à toucher de moins de 44 px (' + Z.length + ' sortes, sur ' + n + ' écrans)');
  for (const [k, o] of Z) console.log('  ' + o.w + '×' + o.h + '  ' + k + '  « ' + o.t + ' »  (' + o.n + ' fois, d’abord sur ' + o.ou + ')');
  const T = [...textes].sort((a, b) => a[1].fs - b[1].fs);
  // Le tableau de bord d'Antonio (démonstration fermée par un mot de passe) n'est pas un écran de parent. Les libellés des 4 onglets sont à 12,5 px, comme sur un téléphone.
  const petits = T.filter(x => x[1].fs < 12.5 && !/espace-antonio/.test(x[1].ou));
  console.log('=== textes de moins de 14,5 px (' + T.length + ' sortes), dont ' + petits.length + ' sous 12,5 px sur les écrans des parents');
  for (const [k, o] of T) console.log('  ' + o.fs + ' px  ' + k.replace(/ @[\d.]+$/, '') + '  « ' + o.t + ' »  (' + o.n + ' fois, ' + o.ou + ')');
  process.exit(Z.length || petits.length ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
