// Mesure réelle du contraste : pour chaque écran, relève chaque texte (couleur, taille, position),
// puis photographie l’écran texte masqué. contrast.py compare ensuite la couleur du texte aux pixels réellement derrière lui.
// usage : node contrast.js [largeur]
const { chromium } = require('playwright');
const fs = require('fs');
const { walk } = require('./walk');
const W = parseInt(process.argv[2] || '390', 10);
// option « estompe=0.8 » : mesure le pire moment de l'effet de lecture, quand un bloc qui arrive en bas de l'écran est encore estompé
const DIM = (process.argv.find(a => /^estompe=/.test(a)) || '').split('=')[1];
const FX_SEL = DIM ? (fs.readFileSync('/home/claude/pparts/v2-a.js', 'utf8').match(/const FX_SEL='([^']+)'/) || [])[1] : '';
const OUT = '/home/claude/build/contrast';
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });

const COLLECT = () => {
  const vw = innerWidth, vh = innerHeight, items = [];
  const rgba = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const path = e => { const out = []; for (let x = e, i = 0; x && x !== document.body && i < 4; x = x.parentElement, i++) out.unshift(x.tagName.toLowerCase() + (x.id ? '#' + x.id : '') + (typeof x.className === 'string' && x.className.trim() ? '.' + x.className.trim().split(/\s+/).slice(0, 3).join('.') : '')); return out.join(' > '); };
  const opac = e => { let o = 1; for (let x = e; x; x = x.parentElement) o *= parseFloat(getComputedStyle(x).opacity); return o; };
  const toast = document.querySelector('.toast'), tr = toast ? toast.getBoundingClientRect() : null;
  // Le bouton flottant de la vitrine pose un fondu sur le bas de l'écran, qui laisse passer les clics : un texte qui glisse dessous est assombri le temps d'un défilement. On ne le mesure pas à ce moment-là.
  const flot = document.querySelector('.cta-flot'), fr = flot && getComputedStyle(flot).visibility !== 'hidden' ? flot.getBoundingClientRect() : null;
  const hit = (el, x, y) => { const t = document.elementFromPoint(x, y); return !!t && (t === el || el.contains(t) || t.contains(el)); };
  const visible = (el, r) => { // le texte est-il entièrement visible (pas même en partie sous une barre fixe, une feuille ou un message) ?
    if (r.top < 0 || r.bottom > vh || r.left < 0 || r.right > vw) return false;
    if (fr && fr.height > 0 && !flot.contains(el) && r.bottom > fr.top && r.top < fr.bottom) return false;
    // le message bref projette une ombre autour de lui : un texte pris dans cette ombre serait mesuré plus sombre qu'il ne l'est au repos
    if (tr && !toast.contains(el) && !(r.right < tr.left - 40 || r.left > tr.right + 40 || r.bottom < tr.top - 40 || r.top > tr.bottom + 40)) return false;
    return hit(el, r.left + r.width / 2, r.top + r.height / 2) && hit(el, r.left + 1, r.top + 1) && hit(el, r.right - 1, r.top + 1) && hit(el, r.left + 1, r.bottom - 1) && hit(el, r.right - 1, r.bottom - 1);
  };
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) {
    const t = n.nodeValue.replace(/\s+/g, ' ').trim(); if (!t) continue;
    const el = n.parentElement; if (!el || /^(script|style|noscript|textarea|option)$/i.test(el.tagName)) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (el.closest('[disabled],[aria-disabled="true"],.sr')) continue;
    // Le contenu d'un bloc « details » refermé n'est pas affiché, mais le navigateur lui garde une place : on ne le mesure pas.
    const dt = el.closest('details:not([open])'); if (dt && !el.closest('summary')) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    // Un texte coupé par « … » (ou par un nombre de lignes) garde, pour le navigateur, un rectangle qui va jusqu'au bout du texte entier, au-delà de ce qui est dessiné.
    // On ne mesure que la partie dessinée : chaque rectangle est ramené à la boîte de son élément quand celui-ci coupe ce qui dépasse.
    const bo = (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') && cs.display !== 'inline' ? el.getBoundingClientRect() : null;
    const dessine = r => { if (!bo) return r; const l = Math.max(r.left, bo.left), d = Math.min(r.right, bo.right), h = Math.max(r.top, bo.top), b = Math.min(r.bottom, bo.bottom); return { left: l, top: h, right: d, bottom: b, width: d - l, height: b - h }; };
    const rects = [...rg.getClientRects()].map(dessine).filter(r => r.width > 2 && r.height > 2 && visible(el, r)).map(r => [r.left, r.top, r.width, r.height]);
    if (!rects.length) continue;
    const fill = cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color ? cs.webkitTextFillColor : cs.color;
    items.push({ kind: 'texte', text: t.slice(0, 46), sel: path(el), color: rgba(fill), size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10) || 400, opacity: opac(el), rects });
  }
  for (const el of document.querySelectorAll('input[type=text],input:not([type]),textarea')) {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect(); if (!r.width || !visible(el, r)) continue;
    const pad = 16, box = [r.left + pad, r.top + 12, Math.max(4, r.width - 2 * pad), Math.min(24, r.height - 20)];
    if (el.value) items.push({ kind: 'saisie', text: el.value.slice(0, 46), sel: path(el), color: rgba(cs.color), size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10) || 400, opacity: opac(el), rects: [box] });
    else if (el.placeholder) { const ps = getComputedStyle(el, '::placeholder'); items.push({ kind: 'exemple', text: el.placeholder.slice(0, 46), sel: path(el), color: rgba(ps.color), size: parseFloat(ps.fontSize), weight: parseInt(ps.fontWeight, 10) || 400, opacity: opac(el) * parseFloat(ps.opacity || 1), rects: [box] }); }
    items.push({ kind: 'bord', text: (el.id || el.tagName), sel: path(el), box: [r.left, r.top, r.width, r.height], radius: parseFloat(cs.borderTopLeftRadius) || 0 });
  }
  return items;
};
const HIDE = '*,*::before,*::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important}::placeholder{color:transparent!important;opacity:1!important}::selection{color:transparent!important;-webkit-text-fill-color:transparent!important}svg{visibility:hidden!important}';   // un texte sélectionné garde sinon sa couleur de sélection, et l'outil prendrait ses lettres pour le fond

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  // PEPE_HEURE fige l'heure lue par l'application (0 à 23), pour mesurer la photo dans sa lumière du matin, du jour, du soir ou de la nuit.
  if (process.env.PEPE_HEURE) await ctx.addInitScript(h => { Date.prototype.getHours = function () { return h; }; }, +process.env.PEPE_HEURE);
  const page = await ctx.newPage();
  let k = 0; const index = [];
  const dump = async name => {
    const sc = await page.evaluate(() => { const s = document.querySelector('.sheet'); const e = s || document.scrollingElement; return { sheet: !!s, h: e.scrollHeight, c: e.clientHeight, y: e.scrollTop }; });
    const tops = []; for (let y = 0; y < Math.max(1, sc.h - sc.c + 1); y += Math.round(sc.c * 0.7)) tops.push(y); const last = Math.max(0, sc.h - sc.c); if (tops[tops.length - 1] !== last) tops.push(last);
    for (const y of tops) {
      await page.evaluate(y => { const e = document.querySelector('.sheet') || document.scrollingElement; e.scrollTop = y; }, y);
      if (DIM && FX_SEL) await page.addStyleTag({ content: FX_SEL + '{opacity:' + DIM + '!important}' });
      await page.waitForTimeout(40);
      const items = await page.evaluate(COLLECT);
      const st = await page.addStyleTag({ content: HIDE });
      const id = String(++k).padStart(3, '0');
      await page.screenshot({ path: `${OUT}/${id}.png` });
      // Un message bref peut s'effacer entre le relevé et la photo : son texte serait alors comparé au fond de la page. On ne garde ses mesures que s'il est toujours là.
      const toastStill = await page.evaluate(() => !!document.querySelector('.toast'));
      await st.evaluate(e => e.remove());
      fs.writeFileSync(`${OUT}/${id}.json`, JSON.stringify({ name, y, items: toastStill ? items : items.filter(i => !/\.toast/.test(i.sel)) }));
      index.push(id);
    }
    await page.evaluate(y => { const e = document.querySelector('.sheet') || document.scrollingElement; e.scrollTop = y; }, sc.y);
  };
  await walk(page, dump);
  await browser.close();
  console.log(index.length + ' captures dans ' + OUT);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
