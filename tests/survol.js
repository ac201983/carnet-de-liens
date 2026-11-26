// Avec une souris : survole chaque élément qui réagit au survol, sur tous les écrans, et relève le contraste de ses textes à ce moment-là.
// Les balayages du contraste mesurent les écrans au repos. Un fond qui change au survol leur échappe (trouvé le 26 novembre 2026 :
// le lien « Voir la fiche de Bastien en entier », vert sur vert quand la souris passait sur la fiche).
// usage : node survol.js [largeur]      puis      python3 contrast.py [largeur]
// Les captures vont dans le même dossier que celles de contrast.js : ne pas lancer les 2 en même temps.
const { chromium } = require('playwright');
const fs = require('fs');
const { walk } = require('./walk');
const W = parseInt(process.argv[2] || '1280', 10);
const OUT = '/home/claude/build/contrast';
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });

// Le style qui masque les textes pour photographier ce qu'il y a derrière : le même que celui de contrast.js.
const src = fs.readFileSync(__dirname + '/contrast.js', 'utf8');
const HIDE = (src.match(/const HIDE = '([^']+)'/) || [])[1];
if (!HIDE) { console.error('CRASH : le style qui masque les textes est introuvable dans contrast.js'); process.exit(2); }

// Dans la page : les éléments visés par une règle « :hover », marqués d'un numéro.
const SUJETS = () => {
  const sels = new Set(), voisins = new Set();
  const lire = rules => { for (const r of rules) {
    if (r.selectorText === undefined) { if (r.cssRules) lire(r.cssRules); continue; }
    if (!r.selectorText.includes(':hover')) continue;
    for (const s of r.selectorText.split(',')) { const i = s.indexOf(':hover'); if (i < 0) continue;
      const sujet = s.slice(0, i).trim(), reste = s.slice(i + 6);
      if (/[+~]/.test(reste)) voisins.add(s.trim());
      if (sujet && !/[>+~]$/.test(sujet)) sels.add(sujet); } } };
  for (const sh of document.styleSheets) { try { lire(sh.cssRules); } catch (e) {} }
  const chemin = e => { const out = []; for (let x = e, i = 0; x && x !== document.body && i < 3; x = x.parentElement, i++) out.unshift(x.tagName.toLowerCase() + (x.id ? '#' + x.id : '') + (typeof x.className === 'string' && x.className.trim() ? '.' + x.className.trim().split(/\s+/).slice(0, 3).join('.') : '')); return out.join(' > '); };
  const vus = new Set(), liste = [];
  document.querySelectorAll('[data-survol]').forEach(e => e.removeAttribute('data-survol'));
  for (const sel of sels) { let els = []; try { els = document.querySelectorAll(sel); } catch (e) { continue; }
    for (const e of els) { if (vus.has(e)) continue; vus.add(e);
      const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
      if (r.width < 4 || r.height < 4 || cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (e.closest('[disabled],[aria-disabled="true"],[hidden],[inert]')) continue;
      if (!e.textContent.trim()) continue;
      const i = liste.length; e.setAttribute('data-survol', i);
      liste.push({ i, sig: chemin(e) + ' | ' + e.textContent.replace(/\s+/g, ' ').trim().slice(0, 40) + ' | ' + Math.round(r.width) + '×' + Math.round(r.height) + ' | ' + cs.color + ' ' + cs.backgroundColor }); } }
  return { liste, voisins: [...voisins] };
};
// Dans la page : amène l'élément à l'écran et donne un point où la souris le touche vraiment.
const POINT = i => { const e = document.querySelector('[data-survol="' + i + '"]'); if (!e) return null;
  e.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
  const r = e.getBoundingClientRect();
  for (const [a, b] of [[.5, .5], [.25, .5], [.75, .5], [.5, .25], [.5, .75], [.1, .5], [.9, .5]]) { const x = r.left + r.width * a, y = r.top + r.height * b;
    if (x < 1 || y < 1 || x > innerWidth - 1 || y > innerHeight - 1) continue;
    const t = document.elementFromPoint(x, y); if (t && (t === e || e.contains(t))) return { x, y }; }
  return null; };
// Dans la page : les textes dessinés dans l'élément survolé (couleur, taille, place), comme les relève contrast.js.
const TEXTES = i => { const e = document.querySelector('[data-survol="' + i + '"]'); if (!e || !e.matches(':hover')) return null;
  const vw = innerWidth, vh = innerHeight, items = [];
  const rgba = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const chemin = e => { const out = []; for (let x = e, i = 0; x && x !== document.body && i < 4; x = x.parentElement, i++) out.unshift(x.tagName.toLowerCase() + (x.id ? '#' + x.id : '') + (typeof x.className === 'string' && x.className.trim() ? '.' + x.className.trim().split(/\s+/).slice(0, 3).join('.') : '')); return out.join(' > '); };
  const opac = e => { let o = 1; for (let x = e; x; x = x.parentElement) o *= parseFloat(getComputedStyle(x).opacity); return o; };
  const touche = (el, x, y) => { const t = document.elementFromPoint(x, y); return !!t && (t === el || el.contains(t) || t.contains(el)); };
  // Un message bref (« C'est déposé et gardé pour vous ») se pose un instant sur le bas de l'écran, et laisse passer la souris : un texte pris dessous,
  // ou dans son ombre, serait comparé au fond du message. Comme dans contrast.js, il n'est pas mesuré à ce moment-là.
  const toast = document.querySelector('.toast'), tr = toast ? toast.getBoundingClientRect() : null;
  const sousMessage = r => !!tr && !(r.right < tr.left - 40 || r.left > tr.right + 40 || r.bottom < tr.top - 40 || r.top > tr.bottom + 40);
  const tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) { const t = n.nodeValue.replace(/\s+/g, ' ').trim(); if (!t) continue;
    const el = n.parentElement; if (!el || /^(script|style|noscript|textarea|option)$/i.test(el.tagName)) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('.sr')) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    const rects = [...rg.getClientRects()].filter(r => r.width > 2 && r.height > 2 && r.top >= 0 && r.bottom <= vh && r.left >= 0 && r.right <= vw && !sousMessage(r) && touche(el, r.left + r.width / 2, r.top + r.height / 2)).map(r => [r.left, r.top, r.width, r.height]);
    if (!rects.length) continue;
    const fill = cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color ? cs.webkitTextFillColor : cs.color;
    items.push({ kind: 'texte', text: t.slice(0, 46), sel: chemin(el), color: rgba(fill), size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10) || 400, opacity: opac(el), rects }); }
  return items; };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  if (process.env.PEPE_HEURE) await ctx.addInitScript(h => { Date.prototype.getHours = function () { return h; }; }, +process.env.PEPE_HEURE);
  const page = await ctx.newPage();
  let k = 0, ecrans = 0, survols = 0, hors = 0; const dejaVus = new Set(), voisins = new Set();
  const sonde = async name => {
    ecrans++;
    if (!(await page.evaluate(() => matchMedia('(hover:hover)').matches))) return;
    const y0 = await page.evaluate(() => { const e = document.querySelector('.sheet') || document.scrollingElement; return e.scrollTop; });
    // Une transition ferait mesurer un état intermédiaire : l'état survolé est pris tout de suite.
    const sansTransition = await page.addStyleTag({ content: '*,*::before,*::after{transition-duration:0s!important;transition-delay:0s!important}' });
    const { liste, voisins: v } = await page.evaluate(SUJETS); v.forEach(s => voisins.add(s));
    for (const s of liste) {
      if (dejaVus.has(s.sig)) continue; dejaVus.add(s.sig);
      const pt = await page.evaluate(POINT, s.i); if (!pt) { hors++; continue; }
      await page.mouse.move(pt.x, pt.y); await page.waitForTimeout(60);
      const items = await page.evaluate(TEXTES, s.i); if (!items) { hors++; continue; }
      if (!items.length) continue;
      const st = await page.addStyleTag({ content: HIDE });
      const id = String(++k).padStart(4, '0');
      await page.screenshot({ path: `${OUT}/${id}.png` });
      // Le message bref peut arriver, ou s'effacer, entre le relevé et la photo : on recompte alors les textes qu'il couvre, pour ne garder que ceux qui restent dégagés.
      const garde = await page.evaluate(rects => { const t = document.querySelector('.toast'), tr = t ? t.getBoundingClientRect() : null; return rects.map(rs => !tr || rs.every(r => r[0] + r[2] < tr.left - 40 || r[0] > tr.right + 40 || r[1] + r[3] < tr.top - 40 || r[1] > tr.bottom + 40)); }, items.map(i => i.rects));
      await st.evaluate(e => e.remove());
      fs.writeFileSync(`${OUT}/${id}.json`, JSON.stringify({ name: name + ' (survol)', y: 0, items: items.filter((_, n) => garde[n]) }));
      survols++;
    }
    await page.mouse.move(W - 2, 842);
    await sansTransition.evaluate(e => e.remove());
    await page.evaluate(y => { document.querySelectorAll('[data-survol]').forEach(e => e.removeAttribute('data-survol')); const e = document.querySelector('.sheet') || document.scrollingElement; e.scrollTop = y; }, y0);
    await page.waitForTimeout(40);
  };
  await walk(page, sonde);
  await browser.close();
  console.log('survol, largeur ' + W + ' : ' + ecrans + ' écrans, ' + survols + ' éléments survolés et photographiés, ' + hors + ' hors d’atteinte de la souris');
  if (voisins.size) console.log('règles de survol qui touchent un élément voisin, à regarder à la main :\n  ' + [...voisins].join('\n  '));
})().catch(e => { console.error('CRASH', e); process.exit(2); });
