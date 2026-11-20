// La voix d'Antonio : aucun écran ne doit montrer de deux-points, de point-virgule, de tiret long ni de point médian.
// node voix.js         -> vérifie (code de sortie 1 si une tournure reste)
// node voix.js --dump  -> liste toutes les lignes de texte visibles (les lignes en défaut d'abord)
const { chromium } = require('playwright');
const { walk } = require('./walk');
const DUMP = process.argv.includes('--dump');
// deux-points hors heures (05:00) ; point-virgule ; tirets longs ; point médian
const TELLS = [
  [/(?<!\d):(?!\d)|\d:(?!\d)|(?<!\d):\d/u, 'deux-points'],
  [/;/u, 'point-virgule'],
  [/[—–]/u, 'tiret long'],
  [/·/u, 'point médian'],
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const seen = new Map();
  const visit = async name => {
    const lines = await page.evaluate(() => {
      const out = [];
      const push = t => { if (t) for (const l of String(t).split('\n')) { const x = l.replace(/\s+/g, ' ').trim(); if (x) out.push(x); } };
      push(document.body.innerText);
      push(document.title);
      for (const el of document.querySelectorAll('[aria-label],[placeholder],[title],[alt]')) for (const a of ['aria-label', 'placeholder', 'title', 'alt']) push(el.getAttribute(a));
      for (const el of document.querySelectorAll('.sr')) push(el.textContent);
      return out;
    });
    for (const l of lines) if (!seen.has(l)) seen.set(l, name);
  };
  await walk(page, visit);
  await browser.close();
  // Les contenus que le parcours des écrans n'ouvre pas tous (23 situations, 24 étapes, 18 doses, mots, exercices) : lus dans les sources.
  const fs = require('fs');
  const c0 = fs.readFileSync(__dirname + '/../eparts/p2-content.js', 'utf8').replace(/<\/?script>/g, ''); const c = c0.slice(c0.indexOf('const WORDS'), c0.indexOf('const PICTOS'));
  const T1 = new Function(c + '; return {WORDS,PERMISSIONS,MOODS,MOOD_WORDS,SITS,EXOS,THEMES,AGES};')();
  // les mots écrits sous les images, ce qu'on dit après « D'abord » ou « ensuite », et les noms des groupes
  const P = new Function(c0.slice(c0.indexOf('const PICTOS')) + '; return {PICTOS,PICTO_GROUPES};')();
  T1.PICTOS = P.PICTOS.map(x => [x[1], x[2]]); T1.PICTO_GROUPES = P.PICTO_GROUPES.map(x => x[1]);
  const T2 = new Function(fs.readFileSync(__dirname + '/../pparts/p2b-parcours.js', 'utf8') + '; return {DOSES,PARCOURS,EVO_SCALES,EVO_OPEN,EVO_TIMES,PHOTOS};')();
  let nTables = 0;
  const rec = (v, where) => { if (typeof v === 'string') { nTables++; const l = v.replace(/\s+/g, ' ').trim(); if (l && !seen.has(l)) seen.set(l, where); } else if (Array.isArray(v)) v.forEach(x => rec(x, where)); else if (v && typeof v === 'object') for (const k in v) rec(v[k], where + (Array.isArray(v) ? '' : '.' + k)); };
  for (const k in T1) rec(T1[k], 'contenu ' + k); for (const k in T2) rec(T2[k], 'contenu ' + k);
  if (T1.SITS.length !== 23 || T2.DOSES.length !== 18 || T2.PARCOURS.reduce((n, m) => n + m.steps.length, 0) !== 24) { console.log('✗ contenus incomplets'); process.exit(1); }
  // Une seule exception : le libellé de la commande du film, écrit par Antonio tel quel dans sa demande du 20 novembre 2026.
  const PERMIS = new Set(['Voir le film · 35 secondes']);
  const bad = [];
  for (const [l, where] of seen) { if (PERMIS.has(l)) continue; const why = TELLS.filter(([re]) => re.test(l)).map(x => x[1]); if (why.length) bad.push([l, where, why.join(', ')]); }
  if (DUMP) {
    console.log('===== EN DÉFAUT (' + bad.length + ')');
    for (const [l, w, y] of bad) console.log('!! [' + w + '] (' + y + ') ' + l);
    console.log('===== TOUTES LES LIGNES (' + seen.size + ')');
    for (const [l, w] of seen) console.log('[' + w + '] ' + l);
  } else {
    for (const [l, w, y] of bad) console.log('✗ [' + w + '] ' + y + ' : ' + l.slice(0, 160));
    console.log(seen.size + ' textes lus (tous les écrans, et ' + nTables + ' textes de contenu), ' + bad.length + ' avec une tournure à reprendre');
    process.exit(bad.length ? 1 : 0);
  }
})().catch(e => { console.error(e); process.exit(2); });
