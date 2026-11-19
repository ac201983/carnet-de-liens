// « Souffler 2 minutes », quand la musique guide la respiration.
// Ce qui est vérifié, comme le vivrait un parent :
//   - en silence, le cercle et les mots guident tout l'exercice, et rien n'est chargé ;
//   - « Changer de respiration » propose 3 respirations, sans arrêter l'exercice, et le changement prend effet au mouvement suivant ;
//   - avec « Écouter l'étang », chaque inspiration reçoit 3 notes qui montent et chaque expiration des notes qui redescendent,
//     posées sur le même minutage que le mot affiché, jusqu'à la dernière respiration ;
//   - une seule musique à la fois, qui se coupe d'un geste et dès que l'on quitte l'exercice.
// usage : node respiration.js [--court]      (--court : sans attendre la fin des 2 minutes avec le son)
// Variables : PEPE_ORIGIN, PEPE_BASE, PEPE_KEY, PEPE_NAV (chromium, firefox ou webkit), PEPE_CHROME.
// Le son n'est pas écouté ici, il est mesuré : chaque note que la page pose est relevée, avec son instant, sa hauteur et son volume.
const pw = require('playwright');
const NAV = process.env.PEPE_NAV || 'chromium';
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8445';
const BASE = process.env.PEPE_BASE || '/';
const APP = ORIGIN + BASE;
const KEY = process.env.PEPE_KEY || 'pepe-v1';
const COURT = process.argv.includes('--court');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
let n = 0, ko = 0; const notesFin = [];
const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC : ' + m); } };
const net = s => (s || '').split(String.fromCharCode(160)).join(' ').replace(/\s+/g, ' ').trim();
const horloge = ([h]) => { const D0 = Date; const base = new D0(); base.setHours(Math.floor(h), Math.round((h % 1) * 60), 0, 0); const dec = base.getTime() - D0.now();
  class D extends D0 { constructor(...x) { if (x.length) super(...x); else super(D0.now() + dec); } static now() { return D0.now() + dec; } } window.Date = D; };
// Une horloge qui va plus vite, pour vivre les 2 minutes entières en quelques secondes (en silence seulement : le son, lui, ne s'accélère pas).
const accelere = ([k]) => { const p = performance, n0 = p.now.bind(p), t0 = n0(); p.now = () => t0 + (n0() - t0) * k; };
const semer = ([k, v]) => { try { if (!sessionStorage.getItem('__seme')) { localStorage.setItem(k, v); sessionStorage.setItem('__seme', '1'); } } catch (e) { } };
// La sonde : elle note chaque source de son (l'eau, chaque note), l'instant où elle doit s'entendre, son volume, et chaque mot affiché avec son instant.
const sonde = () => {
  const S = window.__son = { ctx: [], src: [], liens: [], maitres: [], filtres: [], params: [], audios: [], erreurs: [], verrous: [], ecran: { demandes: 0, actifs: 0, pire: 0 }, mots: [], aides: [], visib: [] };
  let dm = null, da = null;
  const lire = () => { const m = document.getElementById('souffle-mot'), a = document.getElementById('souffle-aide'); const t = performance.now();
    const tm = m ? m.textContent : null, ta = a ? a.textContent : null;
    if (tm !== dm) { dm = tm; S.mots.push({ t: t, m: tm }); } if (ta !== da) { da = ta; S.aides.push({ t: t, a: ta }); } };
  try { new MutationObserver(lire).observe(document, { subtree: true, childList: true, characterData: true }); } catch (e) { S.erreurs.push('observateur : ' + e); }
  document.addEventListener('visibilitychange', () => S.visib.push([Math.round(performance.now()), document.visibilityState]));
  try { const E = S.ecran; const faux = { request: () => { E.demandes++; E.actifs++; E.pire = Math.max(E.pire, E.actifs); const l = [];
    const v = { released: false, addEventListener: (n, f) => l.push(f), release: () => { if (!v.released) { v.released = true; E.actifs--; l.forEach(f => { try { f(); } catch (e) { } }); } return Promise.resolve(); } };
    S.verrous.push(v); return Promise.resolve(v); } };
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, get: () => faux }); } catch (e) { S.erreurs.push('verrou : ' + e); }
  try { if (!navigator.audioSession) { const AS = { type: 'auto' }; Object.defineProperty(navigator, 'audioSession', { configurable: true, get: () => AS }); } } catch (e) { S.erreurs.push('session : ' + e); }
  const C = window.AudioContext || window.webkitAudioContext;
  if (C) {
    const P = C.prototype;
    const cbs = P.createBufferSource; P.createBufferSource = function () { const s = cbs.call(this); const r = { ctx: this, n: s, start: null, at: null, when: null, offset: null, duree: null, stop: null, ended: false, fin: null, dur: null, loop: false, lat: 0 }; S.src.push(r);
      const st = s.start; s.start = function (w, o, d) { const c = this.context; r.start = c.currentTime; r.at = performance.now(); r.when = (w === undefined || w < r.start) ? r.start : w; r.offset = o || 0; r.duree = d === undefined ? null : d;
        r.dur = this.buffer ? this.buffer.duration : null; r.loop = !!this.loop; r.ls = this.loopStart; r.le = this.loopEnd;
        try { r.lat = Math.min(.3, Math.max(0, (Number(c.outputLatency) || 0) + (Number(c.baseLatency) || 0))); } catch (e) { }
        return st.apply(this, arguments); };
      const sp = s.stop; s.stop = function (w) { r.stop = (w === undefined ? this.context.currentTime : w); return sp.apply(this, arguments); };
      s.addEventListener('ended', () => { r.ended = true; r.fin = r.ctx.currentTime; }); return s; };
    const cbf = P.createBiquadFilter; P.createBiquadFilter = function () { const f = cbf.call(this); S.filtres.push(f); return f; };
    const conn = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (dest) { const out = conn.apply(this, arguments);
      try { const c = this.context; if (dest && dest.context) S.liens.push([this, dest]);
        if (dest === c.destination) { if (S.ctx.indexOf(c) < 0) S.ctx.push(c); if (S.maitres.indexOf(this) < 0) S.maitres.push(this); if (!c.__tap) { c.__tap = c.createAnalyser(); c.__tap.fftSize = 2048; } conn.call(this, c.__tap); } } catch (e) { S.erreurs.push(String(e)); } return out; };
    try { const AP = AudioParam.prototype; ['setValueAtTime', 'linearRampToValueAtTime'].forEach(op => { const f = AP[op]; AP[op] = function (v, t) { S.params.push({ p: this, op: op, v: v, t: t }); return f.apply(this, arguments); }; }); } catch (e) { S.erreurs.push('réglages : ' + e); }
  }
  const AU = window.Audio; if (AU) { window.Audio = function (...a) { const el = new AU(...a); S.audios.push(el); return el; }; window.Audio.prototype = AU.prototype; }
  const suivant = x => { const l = S.liens.find(e => e[0] === x); return l ? l[1] : null; };
  const maitre = r => { let x = r.n; for (let k = 0; k < 6 && x; k++) { if (S.maitres.indexOf(x) >= 0) return x; x = suivant(x); } return null; };
  const sorte = r => r.dur === null ? '?' : (r.dur > 50 ? 'notes' : (r.dur > 35 ? 'instant' : 'eau'));
  const joue = r => r.start !== null && !r.ended && (r.stop === null || r.stop > r.ctx.currentTime) && r.when <= r.ctx.currentTime + 0.002;
  const prevue = r => r.start !== null && !r.ended && (r.stop === null || r.stop > r.when) && r.when > r.ctx.currentTime + 0.002;
  S.etat = () => { const J = S.src.filter(joue); const M = []; J.forEach(r => { const m = maitre(r); if (m && M.indexOf(m) < 0) M.push(m); });
    const der = S.src.filter(r => r.start !== null).slice(-1)[0]; const md = der ? maitre(der) : null;
    return { contextes: S.ctx.length, etatCtx: S.ctx.map(c => c.state), lancees: S.src.filter(r => r.start !== null).length,
      ecran: S.ecran.actifs, ecranPire: S.ecran.pire, ecranDemandes: S.ecran.demandes, session: navigator.audioSession ? navigator.audioSession.type : null, visib: S.visib.length,
      actives: J.length, prevues: S.src.filter(prevue).length, eaux: J.filter(r => sorte(r) === 'eau').length, eauxLancees: S.src.filter(r => r.start !== null && sorte(r) === 'eau').length,
      musiques: M.length, audibles: M.filter(m => m.gain.value > 0.02).length, volume: md ? md.gain.value : 0,
      rms: S.ctx.reduce((m, c) => { if (!c.__tap) return m; const b = new Float32Array(c.__tap.fftSize); c.__tap.getFloatTimeDomainData(b); let s = 0; for (let i = 0; i < b.length; i++) s += b[i] * b[i]; return Math.max(m, Math.sqrt(s / b.length)); }, 0),
      audios: S.audios.map(a => ({ paused: a.paused, t: a.currentTime, src: (a.currentSrc || a.getAttribute('src') || '').replace(/^.*\/son\//, '').replace(/\?.*$/, ''), ended: a.ended })), erreurs: S.erreurs.slice(0, 3) }; };
  // Chaque source, sous une forme que l'essai peut lire : sa sorte, quand elle doit s'entendre, sa case dans le fichier, son volume.
  S.sources = () => S.src.filter(r => r.start !== null).map(r => { const g = suivant(r.n); const m = maitre(r);
    return { k: sorte(r), when: r.when, c: r.start, at: r.at, lat: r.lat, offset: r.offset, duree: r.duree, loop: r.loop, ls: r.ls, le: r.le, stop: r.stop, ended: r.ended, g: (g && g.gain && g !== m) ? g.gain.value : null, maitre: m ? S.maitres.indexOf(m) : -1 }; });
  // Les réglages de l'eau : chaque fois que la page programme une montée ou une descente du filtre.
  S.eau = () => S.params.filter(x => S.filtres.some(f => f.frequency === x.p)).map(x => ({ op: x.op, v: x.v, t: x.t }));
};
const sansWebAudio = () => { try { delete window.AudioContext; delete window.webkitAudioContext; window.AudioContext = undefined; window.webkitAudioContext = undefined; } catch (e) { } };
const TEL = { viewport: { width: 390, height: 664 }, hasTouch: true, deviceScaleFactor: 2 }, ORDI = { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 };
const FORMATS = [['téléphone', TEL], ['ordinateur', ORDI]];
// Les 9 notes du fichier, par case de 6,5 secondes, et ce que la musique doit jouer.
const CASES = [43, 45, 47, 50, 57, 62, 64, 66, 69];
const MONTE = [62, 66, 69], DESC = { egal: [66, 64, 62], long: [66, 64, 62, 57], libre: [66, 64, 62, 57] }, BASSES = [50, 47, 43, 45];
const G_MONTE = [.62, .74, .86], G_DESC = [.70, .60, .52, .46];
const DUREES = { egal: [5, 5], long: [4, 6] };
const durees = (mode, cad) => mode === 'libre' ? [cad * .4, cad * .6] : DUREES[mode];

(async () => {
  const LOCAL = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
  const exe = NAV === 'chromium' ? (process.env.PEPE_CHROME || (require('fs').existsSync(LOCAL) ? LOCAL : undefined)) : undefined;
  const lance = { chromium: { args: ['--ignore-certificate-errors', '--autoplay-policy=user-gesture-required'] }, firefox: {}, webkit: {} }[NAV];
  const browser = await pw[NAV].launch(Object.assign({}, lance, exe ? { executablePath: exe } : {}));
  const ouvre = async (fmt, opt = {}) => {
    const f = Object.assign({}, fmt); if (NAV === 'chromium' && f.hasTouch) f.isMobile = true;
    const ctx = await browser.newContext(Object.assign({ locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: opt.calme ? 'reduce' : 'no-preference' }, f));
    await ctx.addInitScript(horloge, [21 + 40 / 60]);
    if (opt.vite) await ctx.addInitScript(accelere, [opt.vite]);
    if (opt.seme) await ctx.addInitScript(semer, [KEY, JSON.stringify(opt.seme)]);
    if (opt.sansWebAudio) await ctx.addInitScript(sansWebAudio);
    await ctx.addInitScript(sonde);
    const errs = [], sons = [];
    const page = await ctx.newPage();
    page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error' && !/son\/|Failed to load resource|net::ERR|downloadable font: download failed[^]*status=2152398850/.test(m.text())) errs.push(m.text().slice(0, 200)); });
    page.on('request', r => { const u = r.url(); if (/\/son\//.test(u)) sons.push(u.replace(/^.*\/son\//, '').replace(/\?.*$/, '')); else if (!u.startsWith(ORIGIN) && !/^(data|blob|about):/.test(u)) errs.push('requête vers un autre site : ' + u.slice(0, 100)); });
    return { ctx, page, errs, sons };
  };
  const garde = page => page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return 'illisible'; } }, KEY);
  const son = page => page.evaluate(() => window.__son.etat());
  const bouton = (page, sel) => page.$eval(sel, e => ({ etat: e.getAttribute('data-etat'), texte: e.textContent.replace(/\s+/g, ' ').trim(), occupe: e.getAttribute('aria-busy') === 'true' })).catch(() => null);
  const attendEtat = async (page, sel, etat, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { const b = await bouton(page, sel); if (b && b.etat === etat) return true; await page.waitForTimeout(80); } return false; };
  const cacher = (page, v) => page.evaluate(v => { if (v === 'hidden') window.__son.verrous.forEach(x => x.release()); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => v }); Object.defineProperty(document, 'hidden', { configurable: true, get: () => v === 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); return performance.now(); }, v);
  const maintenant = page => page.evaluate(() => performance.now());
  const silence = async (page, ms = 3000) => { const t = Date.now(); let s = await son(page); while (!(s.actives === 0 && s.rms < 0.0005) && Date.now() - t < ms) { await page.waitForTimeout(100); s = await son(page); }
    return Object.assign({}, s, { muet: s.actives === 0 && s.rms < 0.0005, delai: Date.now() - t }); };
  const dit = q => '(silence après ' + q.delai + ' ms, ' + q.actives + ' source, signal ' + q.rms.toFixed(5) + ')';
  const B = '.son-souffle', PORTE = '.seuil ' + A('porte', '[data-v="souffle"]');
  const entre = async page => { await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.seuil .porte'); await page.waitForTimeout(350); await page.click(PORTE); await page.waitForSelector('main.souffle.s-cours'); };
  const mots = page => page.evaluate(() => window.__son.mots.filter(x => x.m === 'Inspirez' || x.m === 'Expirez' || x.m === 'Voilà.'));
  // Attendre des mouvements entiers : le résultat donne, pour chacun, « in » ou « out », son début et sa durée, relevés à l'écran.
  const mouvements = async (page, combien, ms = 90000) => { const i0 = (await mots(page)).length; const t = Date.now(); let M = [];
    while (Date.now() - t < ms) { M = await mots(page); if (M.length >= i0 + combien + 1) break; await page.waitForTimeout(150); }
    const out = []; for (let i = i0; i + 1 < M.length && out.length < combien; i++) out.push({ ty: M[i].m === 'Inspirez' ? 'in' : 'out', t: M[i].t, d: (M[i + 1].t - M[i].t) / 1000 }); return out; };
  const proche = (a, b, tol) => Math.abs(a - b) <= tol;
  const deux = M => M.map(x => (x.ty === 'in' ? 'inspirer ' : 'souffler ') + x.d.toFixed(2)).join(', ');
  // Tous les mouvements ont-ils la durée voulue ? (tolérance : le mot change à l'image suivante, quelques centièmes de seconde après l'instant décidé)
  const dureesOk = (M, mode, cad, tol = 0.12) => M.length > 0 && M.every(x => proche(x.d, durees(mode, cad)[x.ty === 'in' ? 0 : 1], tol));

  // Ce navigateur d'essai sait-il lire les fichiers, et a-t-il une sortie audio qui tourne ? Au passage : où commence la première note du fichier, une fois décodé ?
  let lit = true, pourquoi = '', AV = 0.03;
  { const { ctx, page } = await ouvre(ORDI); await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.seuil .porte');
    await page.evaluate(base => { window.__sondage = 'en cours'; document.body.addEventListener('click', async () => { const C = window.AudioContext || window.webkitAudioContext; if (!C) { window.__sondage = 'pas de son calculé dans la page'; return; }
      try { const c = new C(); if (c.resume) c.resume().catch(() => { }); const r = await fetch(base + 'son/notes.mp3'); if (!r.ok) { window.__sondage = 'fichier introuvable'; return; } const ab = await r.arrayBuffer();
        const buf = await new Promise((ok, ko) => { const q = c.decodeAudioData(ab, ok, ko); if (q && q.then) q.then(ok, ko); }); if (!(buf.duration > 50)) { window.__sondage = 'fichier illisible'; return; }
        const d = buf.getChannelData(0); let av = null; for (let i = 0; i < buf.sampleRate * .25; i++) { if (d[i] > .004 || d[i] < -.004) { av = i / buf.sampleRate; break; } } window.__av = av;
        const t0 = c.currentTime; let tourne = false; for (let i = 0; i < 16 && !tourne; i++) { await new Promise(r => setTimeout(r, 250)); tourne = c.state === 'running' && c.currentTime > t0 + 0.2; }
        window.__sondage = tourne ? 'ok' : 'la sortie audio ne tourne pas (' + c.state + ', horloge à ' + (c.currentTime - t0).toFixed(2) + ' s après 4 s)'; }
      catch (e) { window.__sondage = 'fichier illisible : ' + String(e).slice(0, 80); } }, { once: true }); }, BASE);
    await page.mouse.click(5, 5); for (let i = 0; i < 100; i++) { pourquoi = await page.evaluate(() => window.__sondage); if (pourquoi !== 'en cours') break; await page.waitForTimeout(250); }
    lit = pourquoi === 'ok'; const av = await page.evaluate(() => window.__av); if (typeof av === 'number') AV = Math.max(0, Math.min(.12, av));
    await ctx.close();
    if (!lit) notesFin.push('dans ce navigateur d’essai, le son n’a pas pu être mesuré (' + pourquoi + ') : seuls le silence, le choix de la respiration et la navigation y sont vérifiés');
    else notesFin.push('dans le fichier décodé par ce navigateur, la première note commence à ' + (AV * 1000).toFixed(0) + ' ms du début de sa case'); }
  // Quand une note s'entend-elle, dans le temps de la page ? (l'instant programmé, plus le début de la note dans sa case, plus le temps de sortie du son)
  const entendu = r => r.at + (r.when - r.c + r.lat + AV) * 1000;
  const hauteur = r => CASES[Math.round(r.offset / 6.5)];
  // La musique d'un mouvement, comparée à ce qu'elle doit être. « M » vient des mots affichés, « N » des notes posées par la page.
  const musique = (M, N, mode, cad, cyc0) => { const pb = []; let pire = 0, pireEsp = 0;
    M.forEach((x, k) => { const d = durees(mode, cad)[x.ty === 'in' ? 0 : 1];
      const L = N.filter(r => { const e = entendu(r); return e >= x.t - 150 && e < x.t + d * 1000 - 150; }).sort((a, b) => entendu(a) - entendu(b));
      const melodie = L.filter(r => hauteur(r) >= 57), basses = L.filter(r => hauteur(r) < 57);
      const voulu = x.ty === 'in' ? MONTE : DESC[mode], gains = x.ty === 'in' ? G_MONTE : G_DESC;
      const h = melodie.map(hauteur);
      if (h.join(',') !== voulu.join(',')) { pb.push((x.ty === 'in' ? 'inspiration' : 'expiration') + ' ' + k + ' : notes ' + h.join(' ') + ' au lieu de ' + voulu.join(' ')); return; }
      if (x.ty === 'in' ? basses.length !== 1 : basses.length !== 0) pb.push('mouvement ' + k + ' : ' + basses.length + ' note grave');
      if (x.ty === 'in' && basses.length === 1 && typeof cyc0 === 'number' && BASSES.indexOf(hauteur(basses[0])) < 0) pb.push('note grave inattendue ' + hauteur(basses[0]));
      melodie.forEach((r, i) => { const ecart = entendu(r) - (x.t + d * 1000 * i / voulu.length); if (i === 0) pire = Math.max(pire, Math.abs(ecart));
        if (i > 0) pireEsp = Math.max(pireEsp, Math.abs((entendu(r) - entendu(melodie[i - 1])) - d * 1000 / voulu.length));
        if (Math.abs(r.g - gains[i]) > 0.011) pb.push('volume de la note ' + hauteur(r) + ' : ' + r.g); });
      if (x.ty === 'in' && basses.length === 1) pire = Math.max(pire, Math.abs(entendu(basses[0]) - x.t)); });
    return { pb, pire, pireEsp }; };

  for (const [nom, fmt] of FORMATS) {
    const P = m => NAV + ' · ' + nom + ' · ' + m;
    const tel = nom === 'téléphone';

    // =====================================================================================================================
    // 1. En silence : un geste depuis l'accueil, et le cercle et les mots guident. Rien n'est chargé.
    // =====================================================================================================================
    {
      const { ctx, page, errs, sons } = await ouvre(fmt);
      await entre(page);
      const M1 = await mouvements(page, 4);
      // Le tout premier mot peut s'afficher avec un peu de retard sur une machine lente (la page vient de changer d'écran) : son mouvement paraît alors plus court à l'écran, alors que le minutage, lui, n'a pas bougé. Les mouvements suivants doivent être exacts.
      const retard1 = M1.length ? durees('long')[M1[0].ty === 'in' ? 0 : 1] - M1[0].d : 0;
      ok(M1.length === 4 && M1[0].ty !== M1[1].ty && retard1 > -0.12 && retard1 < 0.6 && dureesOk(M1.slice(1), 'long'), P('1. un seul geste depuis l’accueil, et la respiration commence : 4 secondes pour inspirer, 6 pour souffler (' + deux(M1) + ')'));
      if (retard1 > 0.12) notesFin.push(P('le premier mot s’est affiché avec ' + Math.round(retard1 * 1000) + ' ms de retard sur cette machine. Les mouvements suivants sont à l’heure.'));
      const s0 = await son(page); const b0 = await bouton(page, B);
      ok(sons.length === 0 && s0.contextes === 0 && s0.lancees === 0 && s0.audios.length === 0 && b0 && b0.etat === 'off' && b0.texte === 'Écouter l’étang', P('1. l’exercice se fait en silence tant que le parent n’a rien demandé : aucun fichier de son chargé ' + JSON.stringify([sons, s0.contextes, b0])));
      const aides = (await page.evaluate(() => window.__son.aides.map(x => x.a))).filter(Boolean);
      ok(aides.includes('Par le nez, pendant que le cercle s’ouvre.') && aides.includes('Par la bouche, lentement, pendant que le cercle se referme.') && !aides.some(a => /notes/.test(a)), P('1. en silence, la ligne d’aide dit comment respirer, et ne parle pas de notes ' + JSON.stringify(aides.slice(0, 4))));
      // le cercle s'ouvre quand on inspire, se referme quand on souffle
      const cercle = async () => page.evaluate(() => new Promise(fin => { const r = document.querySelector('.souffle .ronds'); const v = []; let k = 0; const f = () => { v.push([document.getElementById('souffle-mot').textContent, parseFloat(getComputedStyle(r).getPropertyValue('--s'))]); if (++k < 40) requestAnimationFrame(f); else fin(v); }; requestAnimationFrame(f); }));
      const c1 = await cercle(); const sens = []; for (let i = 1; i < c1.length; i++) if (c1[i][0] === c1[i - 1][0]) sens.push([c1[i][0], c1[i][1] - c1[i - 1][1]]);
      const bon = sens.filter(x => x[0] === 'Inspirez' ? x[1] >= -0.0005 : x[1] <= 0.0005).length;
      ok(sens.length > 20 && bon === sens.length, P('1. le cercle s’ouvre pendant « Inspirez » et se referme pendant « Expirez » (' + bon + ' images sur ' + sens.length + ')'));
      const lien = await page.$eval('.resp-l', e => { const r = e.getBoundingClientRect(), a = document.querySelector('.souffle .actions').getBoundingClientRect(), p = document.querySelector('.souffle .btn.ghost'); return { texte: e.textContent.replace(/\s+/g, ' ').trim(), h: Math.round(r.height), sous: r.top >= a.bottom - 1, visible: r.bottom <= innerHeight, taille: parseFloat(getComputedStyle(e).fontSize), autre: parseFloat(getComputedStyle(p).fontSize), fond: getComputedStyle(e).backgroundColor }; });
      ok(lien.texte === 'Changer de respiration' && lien.h >= 44 && lien.sous && lien.visible && lien.taille < lien.autre && /rgba\(0, 0, 0, 0\)|transparent/.test(lien.fond), P('1. « Changer de respiration » est là, discret, sous les boutons, et assez grand pour le doigt ' + JSON.stringify(lien)));

      // ===================================================================================================================
      // 2. « Changer de respiration » : 3 possibilités, sans arrêter l'exercice. Le changement prend effet au mouvement suivant.
      // ===================================================================================================================
      const avantChoix = (await mots(page)).length;
      await page.click('.resp-l'); await page.waitForSelector('.resp-choix');
      const ch = await page.evaluate(() => ({ titre: document.querySelector('.resp-choix h2').textContent, opts: [...document.querySelectorAll('.resp-o')].map(o => [o.querySelector('b').textContent, o.querySelector('.tx span').textContent, o.getAttribute('aria-pressed'), Math.round(o.getBoundingClientRect().height)]),
        cad: document.getElementById('resp-cad').hidden, note: document.querySelector('.resp-note').textContent, foc: document.activeElement && document.activeElement.getAttribute('data-v'),
        cercle: (() => { const r = document.querySelector('.souffle .ronds').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.height > 20; })(), mot: !!document.getElementById('souffle-mot'), cours: !!document.querySelector('main.souffle.s-cours.s-choix'),
        continuer: (() => { const b = document.querySelector('[data-act="resp-ferme"]'); return b ? b.textContent.trim() : ''; })() }));
      ok(ch.opts.length === 3 && ch.opts[0][0] === 'Le souffle régulier' && ch.opts[1][0] === 'L’expiration prolongée' && ch.opts[2][0] === 'À mon rythme', P('2. le choix propose 3 respirations : ' + ch.opts.map(o => o[0]).join(', ')));
      ok(ch.opts[0][1] === 'Vous inspirez pendant 5 secondes, puis vous soufflez pendant 5 secondes.' && ch.opts[1][1] === 'Vous inspirez pendant 4 secondes, puis vous soufflez plus longtemps, pendant 6 secondes.' && ch.opts[2][1] === 'Vous choisissez la cadence, et vous pouvez la ralentir ou l’accélérer.', P('2. chacune est expliquée en une phrase simple'));
      ok(ch.opts.map(o => o[2]).join() === 'false,true,false' && ch.cad && ch.foc === 'long', P('2. celle qui est en cours est marquée (« L’expiration prolongée » pour un parent qui n’a rien choisi) ' + JSON.stringify([ch.opts.map(o => o[2]), ch.foc])));
      ok(ch.cours && ch.cercle && ch.mot && ch.continuer === 'Continuer' && ch.opts.every(o => o[3] >= 44), P('2. le choix s’ouvre sans arrêter l’exercice : le cercle et le mot restent à l’écran ' + JSON.stringify([ch.cours, ch.cercle, ch.mot])));
      ok(ch.note === 'Le changement se fait en douceur, au prochain souffle.', P('2. une ligne dit que le changement se fait au prochain souffle'));
      // le souffle régulier
      await page.click('.resp-o[data-v="egal"]'); await mouvements(page, 1);
      const M2 = await mouvements(page, 3);
      ok(dureesOk(M2, 'egal') && (await mots(page)).length > avantChoix + 2, P('2. « Le souffle régulier » : inspirer et souffler durent le même temps, 5 secondes (' + deux(M2) + ')'));
      ok((await page.$eval('.resp-o[data-v="egal"]', e => e.getAttribute('aria-pressed'))) === 'true' && !!(await page.$('.resp-choix')), P('2. le choix reste ouvert et marque la nouvelle respiration'));
      // à mon rythme
      await page.click('.resp-o[data-v="libre"]');
      const cad0 = await page.evaluate(() => ({ cache: document.getElementById('resp-cad').hidden, t: document.getElementById('resp-cad-t').textContent, b: [...document.querySelectorAll('.resp-cad [data-act="cad"]')].map(b => [b.textContent, Math.round(b.getBoundingClientRect().height), b.getAttribute('aria-disabled')]) }));
      ok(!cad0.cache && cad0.t === 'Une respiration dure 8 secondes.' && cad0.b[0][0] === 'Plus lent' && cad0.b[1][0] === 'Plus vite' && cad0.b.every(b => b[1] >= 44 && b[2] === null), P('2. « À mon rythme » : la cadence apparaît, avec « Plus lent » et « Plus vite » ' + JSON.stringify(cad0)));
      await mouvements(page, 1); const M3 = await mouvements(page, 2);
      ok(dureesOk(M3, 'libre', 8), P('2. à 8 secondes par respiration, le cercle suit (' + deux(M3) + ')'));
      await page.click(A('cad', '[data-v="lent"]'));
      ok((await page.textContent('#resp-cad-t')) === 'Une respiration dure 9 secondes.', P('2. « Plus lent » : la phrase le dit tout de suite'));
      // la transition : le cercle ne saute pas quand la cadence change
      const c2 = await page.evaluate(() => new Promise(fin => { const r = document.querySelector('.souffle .ronds'); const v = []; const t0 = performance.now(); const f = () => { v.push(parseFloat(getComputedStyle(r).getPropertyValue('--s'))); if (performance.now() - t0 < 6500) requestAnimationFrame(f); else fin(v); }; requestAnimationFrame(f); }));
      let saut = 0; for (let i = 1; i < c2.length; i++) saut = Math.max(saut, Math.abs(c2[i] - c2[i - 1]));
      ok(c2.length > 60 && saut < 0.09, P('2. le changement de cadence se fait en douceur : le cercle ne saute jamais (plus grand écart entre 2 images : ' + saut.toFixed(3) + ' sur ' + c2.length + ' images)'));
      const M4 = await mouvements(page, 2);
      ok(dureesOk(M4, 'libre', 9), P('2. à 9 secondes, le cercle a ralenti (' + deux(M4) + ')'));
      await page.click(A('cad', '[data-v="vite"]')); await page.click(A('cad', '[data-v="vite"]')); await page.click(A('cad', '[data-v="vite"]'));
      ok((await page.textContent('#resp-cad-t')) === 'Une respiration dure 6 secondes.', P('2. « Plus vite », 3 fois : 6 secondes par respiration'));
      await mouvements(page, 1); const M5 = await mouvements(page, 2);
      ok(dureesOk(M5, 'libre', 6), P('2. à 6 secondes, le cercle a accéléré (' + deux(M5) + ')'));
      // les bornes
      await page.click(A('cad', '[data-v="vite"]')); await page.click(A('cad', '[data-v="vite"]'), { force: true });
      const borne1 = await page.evaluate(() => [document.getElementById('resp-cad-t').textContent, document.querySelector('.resp-cad [data-v="vite"]').getAttribute('aria-disabled'), document.querySelector('.resp-cad [data-v="lent"]').getAttribute('aria-disabled')]);
      for (let i = 0; i < 9; i++) await page.click(A('cad', '[data-v="lent"]')); await page.click(A('cad', '[data-v="lent"]'), { force: true });
      const borne2 = await page.evaluate(() => [document.getElementById('resp-cad-t').textContent, document.querySelector('.resp-cad [data-v="vite"]').getAttribute('aria-disabled'), document.querySelector('.resp-cad [data-v="lent"]').getAttribute('aria-disabled')]);
      ok(borne1[0] === 'Une respiration dure 5 secondes.' && borne1[1] === 'true' && borne1[2] === null && borne2[0] === 'Une respiration dure 14 secondes.' && borne2[1] === null && borne2[2] === 'true', P('2. la cadence va de 5 à 14 secondes, et le bouton qui ne peut plus servir le montre ' + JSON.stringify([borne1, borne2])));
      for (let i = 0; i < 7; i++) await page.click(A('cad', '[data-v="vite"]'));
      // Continuer
      await page.click(A('resp-ferme')); await page.waitForSelector('.souffle .resp-l');
      const apres = await page.evaluate(() => ({ choix: !!document.querySelector('.resp-choix'), cours: !!document.querySelector('main.souffle.s-cours:not(.s-choix)'), foc: document.activeElement && document.activeElement.className, son: !!document.querySelector('.son-souffle'), stop: !!document.querySelector('[data-act="souffle-stop"]') }));
      ok(!apres.choix && apres.cours && apres.foc === 'resp-l' && apres.son && apres.stop, P('2. « Continuer » referme le choix, et l’exercice retrouve ses boutons ' + JSON.stringify(apres)));
      const g1 = await garde(page);
      ok(g1 && g1.souffle && g1.souffle.m === 'libre' && g1.souffle.c === 7, P('2. le choix est gardé sur l’appareil ' + JSON.stringify(g1 && g1.souffle)));
      ok(sons.length === 0 && (await son(page)).contextes === 0, P('2. changer de respiration ne charge aucun son'));
      // « Arrêter », puis l'écran d'attente : il décrit la respiration choisie, et propose aussi d'en changer
      await page.click(A('souffle-stop')); await page.waitForSelector('main.souffle.s-pret');
      const pret = await page.evaluate(() => ({ aide: document.querySelector('.souffle .aide').textContent, lien: !!document.querySelector('.resp-l'), go: document.querySelector('[data-act="souffle-go"]').textContent.trim() }));
      ok(pret.aide === 'Vous inspirez par le nez, puis vous soufflez par la bouche un peu plus longtemps, à la cadence que vous avez choisie. Une respiration dure 7 secondes. Le cercle posé sur l’eau vous guide.' && pret.lien && pret.go === 'Commencer', P('2. après « Arrêter », l’écran décrit la respiration choisie ' + JSON.stringify(pret.aide)));
      await page.click('.resp-l'); await page.waitForSelector('.resp-choix');
      const pc = await page.evaluate(() => ({ note: !!document.querySelector('.resp-note'), go: !!document.querySelector('.resp-choix [data-act="souffle-go"]'), pres: [...document.querySelectorAll('.resp-o')].map(o => o.getAttribute('aria-pressed')).join() }));
      ok(!pc.note && pc.go && pc.pres === 'false,false,true', P('2. avant de commencer aussi, on peut choisir sa respiration, puis « Commencer » ' + JSON.stringify(pc)));
      await page.click('.resp-o[data-v="long"]'); await page.click('.resp-choix ' + A('souffle-go')); await page.waitForSelector('main.souffle.s-cours:not(.s-choix)');
      const M6 = await mouvements(page, 2);
      ok(dureesOk(M6, 'long'), P('2. « Commencer » lance la respiration choisie (' + deux(M6) + ')'));
      ok(errs.length === 0, P('1 et 2. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 3. Avec « Écouter l'étang » : les notes montent quand on inspire, redescendent quand on souffle, sur le même minutage que les mots.
    // =====================================================================================================================
    if (lit && tel) {
      const { ctx, page, errs, sons } = await ouvre(fmt);
      await entre(page);
      await page.waitForTimeout(2200);
      await page.click(B);
      const b1 = await bouton(page, B);
      ok(b1 && (b1.etat === 'charge' || b1.etat === 'on'), P('3. un geste, et l’étang arrive ' + JSON.stringify(b1)));
      ok((await page.textContent('#souffle-aide')) === 'Quand les notes montent, inspirez. Quand elles redescendent, soufflez doucement.', P('3. la clé d’écoute s’affiche dès le geste : « Quand les notes montent, inspirez. Quand elles redescendent, soufflez doucement. »'));
      ok(await attendEtat(page, B, 'on'), P('3. la musique est lancée'));
      const tOn = await maintenant(page);
      await page.waitForTimeout(300);
      const s1 = await son(page);
      ok(sons.slice().sort().join(',') === 'eau.mp3,notes.mp3' && s1.contextes === 1, P('3. 2 fichiers seulement sont chargés, l’eau et les notes ' + JSON.stringify(sons)));
      ok(s1.eaux === 1 && s1.musiques === 1 && s1.volume < 0.45, P('3. l’eau entre d’abord, doucement (volume ' + s1.volume.toFixed(2) + ')'));
      ok(s1.session === 'playback', P('3. pendant qu’elle joue, la page se déclare comme un lecteur, pour que le bouton silencieux de l’iPhone ne coupe pas le son (' + s1.session + ')'));
      const M = await mouvements(page, 4);
      const S1 = await page.evaluate(() => window.__son.sources());
      const eau = S1.filter(r => r.k === 'eau'), N1 = S1.filter(r => r.k === 'notes');
      ok(eau.length === 1 && eau[0].loop && proche(eau[0].ls, .5, .01) && proche(eau[0].le, 28.5, .01), P('3. l’eau est une seule boucle, sans début ni fin audibles ' + JSON.stringify(eau.map(e => [e.loop, e.ls, e.le]))));
      const premiere = N1.map(entendu).sort((a, b) => a - b)[0];
      const debuts = (await mots(page)).map(x => x.t);
      ok(N1.length > 0 && debuts.some(t => Math.abs(t - premiere) < 150) && premiere > tOn - 200, P('3. les notes entrent au début d’un mouvement : la première chose que l’on entend est une phrase entière (première note ' + ((premiere - tOn) / 1000).toFixed(2) + ' s après l’arrivée de l’eau)'));
      const r1 = musique(M, N1, 'long');
      ok(M.length === 4 && dureesOk(M, 'long') && r1.pb.length === 0, P('3. « L’expiration prolongée » : 3 notes montent à chaque inspiration (ré, fa dièse, la), 4 notes redescendent à chaque expiration (fa dièse, mi, ré, la grave) ' + JSON.stringify(r1.pb.slice(0, 3))));
      ok(r1.pire < 110 && r1.pireEsp < 25, P('3. la première note de chaque mouvement tombe avec le mot affiché (pire écart ' + r1.pire.toFixed(0) + ' ms), et les notes se partagent le temps du mouvement (pire écart d’espacement ' + r1.pireEsp.toFixed(1) + ' ms)'));
      notesFin.push('expiration prolongée : écart entre la première note d’un mouvement et le mot affiché, au pire ' + r1.pire.toFixed(0) + ' ms sur ' + M.length + ' mouvements. Notes espacées de ' + (4000 / 3 / 1000).toFixed(2) + ' s à l’inspiration et de 1,50 s à l’expiration.');
      ok(MONTE[0] < MONTE[1] && MONTE[1] < MONTE[2] && DESC.long[0] < MONTE[2], P('3. dès le premier cycle, l’oreille distingue les 2 mouvements : l’inspiration monte par grands pas, l’expiration repart plus bas et redescend pas à pas'));
      // l'eau avance et se retire avec le souffle
      const E1 = await page.evaluate(() => window.__son.eau());
      const hauts = E1.filter(x => x.op === 'linearRampToValueAtTime' && x.v > 3000).length, bas = E1.filter(x => x.op === 'linearRampToValueAtTime' && x.v < 1500).length;
      ok(hauts >= 2 && bas >= 2, P('3. l’eau s’éclaircit à chaque inspiration et se retire à chaque expiration (' + hauts + ' montées, ' + bas + ' descentes programmées)'));
      const s2 = await son(page);
      ok(s2.volume > 0.8 && s2.volume <= 0.86 && s2.rms > 0.002 && s2.etatCtx[0] === 'running' && s2.eaux === 1 && s2.musiques === 1 && s2.audibles === 1, P('3. la musique est installée, à un volume doux (volume ' + s2.volume.toFixed(2) + ', signal ' + s2.rms.toFixed(4) + ')'));
      // la clé d'écoute disparaît, la musique guide seule
      const aides = await page.evaluate(() => window.__son.aides.map(x => x.a));
      ok(aides[aides.length - 1] === '' && (await page.textContent('#souffle-aide')) === '', P('3. après les premières respirations, la phrase d’aide se retire : la musique et ses silences guident ' + JSON.stringify(aides.slice(-2))));
      // changer de respiration pendant la musique : rien n'est coupé, et la phrase suit
      await page.click('.resp-l'); await page.waitForSelector('.resp-choix'); await page.click('.resp-o[data-v="egal"]'); await mouvements(page, 1);
      const Me = await mouvements(page, 4); const Ne = (await page.evaluate(() => window.__son.sources())).filter(r => r.k === 'notes'); const re = musique(Me, Ne, 'egal');
      ok(dureesOk(Me, 'egal') && re.pb.length === 0 && re.pire < 110 && re.pireEsp < 25, P('3. « Le souffle régulier » : 3 notes montent en 5 secondes, 3 notes redescendent en 5 secondes, avec le cercle (' + deux(Me) + ', pire écart ' + re.pire.toFixed(0) + ' ms) ' + JSON.stringify(re.pb.slice(0, 3))));
      await page.click('.resp-o[data-v="libre"]'); await mouvements(page, 1);
      const Ml = await mouvements(page, 2); const Nl = (await page.evaluate(() => window.__son.sources())).filter(r => r.k === 'notes'); const rl = musique(Ml, Nl, 'libre', 8);
      ok(dureesOk(Ml, 'libre', 8) && rl.pb.length === 0 && rl.pire < 110 && rl.pireEsp < 25, P('3. « À mon rythme », à 8 secondes : la phrase se resserre avec le cercle (' + deux(Ml) + ', pire écart ' + rl.pire.toFixed(0) + ' ms) ' + JSON.stringify(rl.pb.slice(0, 3))));
      await page.click(A('cad', '[data-v="lent"]')); await page.click(A('cad', '[data-v="lent"]')); await page.click(A('cad', '[data-v="lent"]')); await mouvements(page, 1);
      const Mp = await mouvements(page, 2); const Np = (await page.evaluate(() => window.__son.sources())).filter(r => r.k === 'notes'); const rp = musique(Mp, Np, 'libre', 11);
      ok(dureesOk(Mp, 'libre', 11) && rp.pb.length === 0 && rp.pire < 110 && rp.pireEsp < 25, P('3. « Plus lent », 3 fois : à 11 secondes, la mélodie s’étire avec le cercle (' + deux(Mp) + ', pire écart ' + rp.pire.toFixed(0) + ' ms) ' + JSON.stringify(rp.pb.slice(0, 3))));
      const s3 = await son(page);
      ok(s3.eauxLancees === 1 && s3.contextes === 1 && sons.length === 2 && s3.musiques === 1, P('3. pendant tous ces changements, la musique n’a jamais été coupée ni relancée (' + s3.eauxLancees + ' départ de l’eau, ' + sons.length + ' fichiers chargés)'));
      notesFin.push('souffle régulier : pire écart ' + re.pire.toFixed(0) + ' ms. À mon rythme (8 s) : ' + rl.pire.toFixed(0) + ' ms. À mon rythme (11 s) : ' + rp.pire.toFixed(0) + ' ms.');
      await page.click(A('resp-ferme')); await page.waitForSelector(B);
      ok((await bouton(page, B)).texte === 'Couper le son', P('3. le choix refermé, le bouton propose toujours « Couper le son »'));
      // un nouvel exercice pour la suite (celui-ci approche de ses 2 minutes) : « Arrêter », « Commencer », puis « Écouter l'étang »
      await page.click(A('souffle-stop')); await page.waitForSelector('main.souffle.s-pret'); await page.click(A('souffle-go')); await page.waitForSelector('main.souffle.s-cours');
      await page.click(B); ok(await attendEtat(page, B, 'on'), P('4. un nouvel exercice, et la musique revient sans rien recharger (' + sons.length + ' fichiers)')); await mouvements(page, 1);

      // ===================================================================================================================
      // 4. Couper, reprendre, quitter : une seule musique à la fois, et plus aucun son hors de l'exercice.
      // ===================================================================================================================
      await page.click(B); const b3 = await bouton(page, B);
      ok(b3.etat === 'off' && b3.texte === 'Écouter l’étang', P('4. un geste coupe la musique, et le bouton repropose « Écouter l’étang »'));
      const q3 = await silence(page);
      ok(q3.muet && q3.audibles === 0 && q3.prevues === 0 && q3.delai < 1500, P('4. tout se tait aussitôt, y compris les notes déjà prévues ' + dit(q3)));
      const Ms = await mouvements(page, 2);
      ok(Ms.length === 2 && !!(await page.$('main.souffle.s-cours')), P('4. couper le son n’interrompt pas la respiration (' + deux(Ms) + ')'));
      ok(/cercle/.test(await page.textContent('#souffle-aide')), P('4. en silence, la ligne d’aide revient'));
      let pire = 0;
      for (let i = 0; i < 7; i++) { await page.click(B); await page.waitForTimeout(45); pire = Math.max(pire, (await son(page)).audibles); }
      await page.waitForTimeout(2600);
      const s4 = await son(page); const b4 = await bouton(page, B);
      ok(pire <= 1 && s4.eaux === 1 && s4.musiques === 1 && s4.audibles === 1 && b4.etat === 'on' && sons.length === 2, P('4. 7 pressions rapides : une seule musique joue, jamais 2 à la fois (au pire ' + pire + ' audible, ' + s4.eaux + ' eau, ' + sons.length + ' fichiers chargés)'));
      const Mr = await mouvements(page, 2); const Nr = (await page.evaluate(() => window.__son.sources())).filter(r => r.k === 'notes' && r.stop === null); const rr = musique(Mr, Nr, 'libre', 11);
      ok(rr.pb.length === 0 && rr.pire < 110, P('4. après ces pressions, les notes sont toujours calées sur la respiration (pire écart ' + rr.pire.toFixed(0) + ' ms) ' + JSON.stringify(rr.pb.slice(0, 2))));
      // l'arrière-plan
      const tCache = await cacher(page, 'hidden');
      const s6 = await silence(page);
      ok(s6.muet && s6.audibles === 0 && s6.prevues === 0 && s6.delai < 1200 && s6.ecran === 0, P('4. page à l’arrière-plan : le son s’arrête tout de suite et l’écran n’est plus retenu ' + dit(s6)));
      const motsCache = (await mots(page)).length;
      await page.waitForTimeout(2500); const tVu = await cacher(page, 'visible');
      ok((await mots(page)).length === motsCache, P('4. pendant ce temps, la respiration attend'));
      ok(await attendEtat(page, B, 'on', 5000), P('4. au retour sur la page, la musique reprend'));
      const Mv = await mouvements(page, 3); const Nv = (await page.evaluate(() => window.__son.sources())).filter(r => r.k === 'notes' && r.stop === null); const rv = musique(Mv, Nv, 'libre', 11);
      ok(dureesOk(Mv, 'libre', 11) && rv.pb.length === 0 && rv.pire < 110 && (await son(page)).ecran === 1, P('4. elle reprend avec la respiration, là où elle s’était arrêtée (pire écart ' + rv.pire.toFixed(0) + ' ms après ' + ((tVu - tCache) / 1000).toFixed(1) + ' s d’absence) ' + JSON.stringify(rv.pb.slice(0, 2))));
      // les sorties
      await page.click(A('souffle-stop'));
      const s8 = await silence(page);
      ok(s8.muet && s8.prevues === 0 && !!(await page.$('main.souffle.s-pret')) && !(await page.$(B)) && s8.ecran === 0, P('4. « Arrêter » coupe la musique avec la respiration ' + dit(s8)));
      await page.click(A('souffle-go')); await page.waitForSelector('main.souffle.s-cours'); await page.waitForTimeout(500);
      const s8b = await son(page);
      ok((await bouton(page, B)).etat === 'off' && s8b.actives === 0 && s8b.session === 'auto', P('4. après « Arrêter », « Commencer » repart en silence, et la page a rendu au téléphone son réglage habituel (' + s8b.session + ')'));
      await page.click(B); await attendEtat(page, B, 'on'); await page.waitForTimeout(400);
      await page.click('.souffle .bar .back'); await page.waitForSelector('main.intro');
      const s9 = await silence(page);
      ok(s9.muet && s9.prevues === 0, P('4. « Retour » coupe la musique et ramène à la vitrine ' + dit(s9)));
      await page.click(PORTE); await page.waitForSelector('main.souffle.s-cours'); await page.waitForTimeout(300);
      ok((await bouton(page, B)).etat === 'off', P('4. rouvrir l’exercice : il recommence en silence'));
      await page.click(B); await attendEtat(page, B, 'on'); await page.waitForTimeout(400);
      await page.click('.souffle .bar .sos'); await page.waitForTimeout(300);
      const s10 = await silence(page);
      ok(s10.muet && s10.prevues === 0 && !(await page.$('main.souffle')) && (await page.$$('.son-b')).length === 0, P('4. le SOS coupe la musique, et l’écran du SOS est silencieux ' + dit(s10)));
      await page.goBack(); await page.waitForTimeout(700);
      if (await page.$('main.souffle.s-pret')) { await page.click(A('souffle-go')); await page.waitForSelector('main.souffle.s-cours'); } else if (!(await page.$('main.souffle.s-cours'))) { await page.goto(APP + '#accueil'); await page.waitForSelector('.seuil .porte'); await page.click(PORTE); await page.waitForSelector('main.souffle.s-cours'); }
      await page.waitForTimeout(300); await page.click(B); await attendEtat(page, B, 'on'); await page.waitForTimeout(400);
      await page.goBack(); await page.waitForTimeout(300);
      const s11 = await silence(page);
      ok(s11.muet && s11.prevues === 0 && !(await page.$('main.souffle')), P('4. la flèche du navigateur coupe la musique en quittant l’exercice ' + dit(s11)));
      ok(s9.ecran === 0 && s10.ecran === 0 && s11.ecran === 0 && s11.ecranPire === 1, P('4. en quittant l’exercice, l’écran n’est plus retenu, et il ne l’a jamais été 2 fois en même temps ' + JSON.stringify([s9.ecran, s10.ecran, s11.ecran, s11.ecranPire])));
      ok((await son(page)).contextes === 1 && sons.length === 2, P('4. tout cela avec un seul téléchargement de chaque fichier (' + sons.join(', ') + ')'));
      ok(errs.length === 0, P('3 et 4. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    } else if (!lit && tel) {
      // ce navigateur d'essai ne peut pas jouer le son : le bouton doit rester cohérent, et la respiration continuer
      const { ctx, page, errs } = await ouvre(fmt);
      await entre(page); await page.waitForTimeout(1500);
      await page.click(B); await page.waitForTimeout(3500);
      const b = await bouton(page, B);
      ok((b.etat === 'off' ? b.texte === 'Écouter l’étang' : (b.etat === 'on' && b.texte === 'Couper le son')) && !!(await page.$('main.souffle.s-cours')), P('3. sans sortie audio mesurable, le bouton reste cohérent et la respiration continue ' + JSON.stringify(b)));
      if (b.etat === 'on') { await page.click(B); await page.waitForTimeout(600); ok((await bouton(page, B)).etat === 'off', P('3. et un geste le ramène à « Écouter l’étang »')); }
      const Mx = await mouvements(page, 2); ok(dureesOk(Mx, 'long'), P('3. la respiration garde son rythme (' + deux(Mx) + ')'));
      await page.click(A('souffle-stop')); await page.waitForTimeout(500);
      ok(!!(await page.$('main.souffle.s-pret')), P('3. « Arrêter » arrête la respiration'));
      ok(errs.length === 0, P('3. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 5. Jusqu'à la dernière respiration : les 2 minutes entières avec la musique, puis la fin.
    // =====================================================================================================================
    if (lit && tel && !COURT) {
      const { ctx, page, errs } = await ouvre(fmt);
      await entre(page);
      await page.click(B); await attendEtat(page, B, 'on');
      await page.waitForSelector('main.souffle.s-fini', { timeout: 140000 });
      const T = await mots(page); const N = (await page.evaluate(() => window.__son.sources())).filter(r => r.k === 'notes');
      const M = []; for (let i = 0; i + 1 < T.length; i++) if (T[i].m !== 'Voilà.') M.push({ ty: T[i].m === 'Inspirez' ? 'in' : 'out', t: T[i].t, d: (T[i + 1].t - T[i].t) / 1000 });
      // Comme au point 1, le tout premier mot peut s'afficher un peu tard sur une machine lente : la durée se compte depuis le 2e mouvement, auquel on ajoute la durée voulue du premier.
      const fin = T.find(x => x.m === 'Voilà.'); const total = fin && M.length > 1 ? (fin.t - M[1].t) / 1000 + durees('long')[0] : 0;
      const retard5 = M.length ? durees('long')[0] - M[0].d : 0;
      ok(M.length === 24 && retard5 > -0.12 && retard5 < 0.6 && dureesOk(M.slice(1), 'long') && proche(total, 120, 0.3), P('5. les 2 minutes entières : 12 respirations, 24 mouvements, ' + total.toFixed(2) + ' secondes'));
      const avec = M.filter(x => N.some(r => Math.abs(entendu(r) - x.t) < 150));
      const r = musique(avec, N, 'long');
      // La musique entre au premier changement de mouvement qui suit l'arrivée des 2 fichiers. Sur une connexion lente, c'est le 3e ou le 4e mouvement au lieu du 2e : ce qui compte, c'est qu'elle reste ensuite calée, sans trou, jusqu'au dernier.
      if (avec.length < 23 && avec.length >= 21) notesFin.push(P('le son a mis du temps à arriver sur cette connexion : la musique est entrée au mouvement ' + (25 - avec.length) + ' au lieu du 2e.'));
      ok(avec.length >= 21 && avec[avec.length - 1] === M[23] && M.indexOf(avec[0]) === 24 - avec.length && r.pb.length === 0 && r.pire < 110 && r.pireEsp < 25, P('5. la musique reste calée sur le mot affiché jusqu’à la dernière respiration (' + avec.length + ' mouvements en musique, pire écart ' + r.pire.toFixed(0) + ' ms) ' + JSON.stringify(r.pb.slice(0, 3))));
      const ecarts = avec.map(x => { const L = N.filter(q => Math.abs(entendu(q) - x.t) < 150 && hauteur(q) >= 57); return L.length ? entendu(L[0]) - x.t : 0; });
      const debut = ecarts.slice(0, 4).reduce((a, b) => a + b, 0) / 4, bout = ecarts.slice(-4).reduce((a, b) => a + b, 0) / 4;
      ok(Math.abs(bout - debut) < 40, P('5. aucun décalage ne s’installe avec le temps : écart moyen de ' + debut.toFixed(0) + ' ms sur les 4 premiers mouvements, de ' + bout.toFixed(0) + ' ms sur les 4 derniers'));
      notesFin.push('2 minutes entières avec la musique : ' + avec.length + ' mouvements, pire écart note et mot ' + r.pire.toFixed(0) + ' ms, écart moyen ' + debut.toFixed(0) + ' ms au début et ' + bout.toFixed(0) + ' ms à la fin.');
      // les basses changent d'une respiration à l'autre (4 couleurs qui reviennent)
      const basses = M.filter(x => x.ty === 'in').map(x => { const L = N.filter(q => Math.abs(entendu(q) - x.t) < 150 && hauteur(q) < 57); return L.length ? hauteur(L[0]) : 0; }).filter(Boolean);
      ok(basses.length >= 11 && basses.every((h, i) => h === BASSES[(12 - basses.length + i) % 4]), P('5. sous la mélodie, la note grave change à chaque respiration, et revient toutes les 4 respirations (' + basses.join(' ') + ')'));
      // la fin : un dernier accord, puis le silence
      const finale = N.filter(q => entendu(q) > fin.t - 150).sort((a, b) => entendu(a) - entendu(b));
      ok(finale.map(hauteur).join() === '50,57,66' && proche(entendu(finale[0]), fin.t, 110) && proche(entendu(finale[2]) - entendu(finale[0]), 600, 25), P('5. à la fin, un dernier accord égrené (ré, la, fa dièse) ' + JSON.stringify(finale.map(q => [hauteur(q), Math.round(entendu(q) - fin.t)]))));
      await page.waitForTimeout(400);
      const f1 = await son(page); const bf = await bouton(page, '.fin-son ' + B);
      ok(f1.eaux === 1 && f1.rms > 0.0005 && bf && bf.texte === 'Couper le son' && f1.ecran === 1, P('5. sur l’écran « Voilà. », la musique continue un instant, peut encore être coupée, et l’écran reste allumé'));
      const niveaux = [f1.rms]; for (let i = 0; i < 4; i++) { await page.waitForTimeout(2000); niveaux.push((await son(page)).rms); }
      let muet = null; for (let i = 0; i < 40; i++) { const s = await son(page); if (s.actives === 0 && s.rms < 0.0005) { muet = s; break; } await page.waitForTimeout(250); }
      const tMuet = (await maintenant(page) - fin.t) / 1000;
      ok(muet && niveaux[niveaux.length - 1] < niveaux[0] * 0.5 && tMuet > 8 && tMuet < 12, P('5. elle s’éteint d’elle-même, en une dizaine de secondes (signal ' + niveaux.map(v => v.toFixed(4)).join(' → ') + ', silence ' + tMuet.toFixed(1) + ' s après la fin)'));
      await page.waitForTimeout(300);
      ok(await page.$eval('.fin-son', e => e.hidden && e.getBoundingClientRect().height === 0).catch(() => true), P('5. une fois le silence revenu, le bouton du son se retire'));
      const f3 = await son(page);
      ok(f3.ecran === 0 && f3.session === 'auto', P('5. et le téléphone retrouve sa mise en veille et son réglage habituels'));
      // « Encore 2 minutes » : la musique repart avec la première inspiration
      await page.click(A('souffle-go')); await page.waitForSelector('main.souffle.s-cours'); ok(await attendEtat(page, B, 'on', 5000), P('5. « Encore 2 minutes » : la musique repart, puisque le parent l’écoutait'));
      ok((await page.textContent('#souffle-aide')) === 'Quand les notes montent, inspirez. Quand elles redescendent, soufflez doucement.', P('5. et la clé d’écoute est rappelée avant la première inspiration'));
      const M2 = await mouvements(page, 2); const N2 = (await page.evaluate(() => window.__son.sources())).filter(q => q.k === 'notes'); const r2 = musique(M2, N2, 'long');
      ok(M2[0].ty === 'in' && r2.pb.length === 0 && r2.pire < 110, P('5. dès la première inspiration, les 3 notes montent (pire écart ' + r2.pire.toFixed(0) + ' ms) ' + JSON.stringify(r2.pb.slice(0, 2))));
      await page.click(A('souffle-stop')); { const q = await silence(page); ok(q.muet && q.prevues === 0, P('5. « Arrêter » la coupe de nouveau ' + dit(q))); }
      ok(errs.length === 0, P('5. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 6. Chaque respiration dure bien 2 minutes environ et se termine sur une expiration (en silence, avec une horloge accélérée).
    // =====================================================================================================================
    if (tel) {
      const CAS = [['Le souffle régulier', { m: 'egal', c: 8 }, 12, 120], ['L’expiration prolongée', { m: 'long', c: 8 }, 12, 120], ['À mon rythme, 5 secondes', { m: 'libre', c: 5 }, 23, 115], ['À mon rythme, 8 secondes', { m: 'libre', c: 8 }, 15, 120], ['À mon rythme, 14 secondes', { m: 'libre', c: 14 }, 9, 126]];
      for (const [titre, reglage, cycles, duree] of CAS) {
        const { ctx, page, errs, sons } = await ouvre(fmt, { vite: 5, seme: { souffle: reglage } });
        await entre(page);
        await page.waitForSelector('main.souffle.s-fini', { timeout: 40000 });
        const T = await mots(page); const fin = T.find(x => x.m === 'Voilà.'); const ins = T.filter(x => x.m === 'Inspirez'), exs = T.filter(x => x.m === 'Expirez');
        const d = durees(reglage.m, reglage.c); const dernier = T[T.indexOf(fin) - 1];
        // La durée se mesure à partir de la 2e inspiration, à laquelle on ajoute une respiration : le tout premier mot peut s'afficher un peu tard sur une machine lente, et avec l'horloge accélérée ce retard compterait plusieurs fois. L'horloge va 5 fois plus vite, pas davantage : à la cadence la plus rapide, une inspiration dure alors 0,4 seconde réelle, et une machine lente a le temps de l'afficher.
        const total = fin && ins.length > 1 ? (fin.t - ins[1].t) / 1000 + d[0] + d[1] : 0;
        const moy = ins.length > 2 ? (ins[ins.length - 1].t - ins[1].t) / 1000 / (ins.length - 2) : 0;
        ok(ins.length === cycles && exs.length === cycles && proche(total, duree, 0.6) && dernier && dernier.m === 'Expirez' && proche(moy, d[0] + d[1], 0.12), P('6. ' + titre + ' : ' + ins.length + ' respirations en ' + total.toFixed(1) + ' secondes, et l’exercice se termine sur une expiration (attendu ' + cycles + ' en ' + duree + ' s)'));
        ok(sons.length === 0 && errs.length === 0 && !!(await page.$('main.souffle.s-fini')), P('6. ' + titre + ' : l’écran « Voilà. » arrive, sans erreur et sans son chargé ' + errs.slice(0, 2).join(' | ')));
        await ctx.close();
      }
    }

    // =====================================================================================================================
    // 7. Sans le son calculé dans la page (très ancien navigateur), et avec « moins d'animations ».
    // =====================================================================================================================
    if (!tel && NAV === 'chromium') {
      const { ctx, page, errs } = await ouvre(fmt, { sansWebAudio: true });
      await entre(page); await page.waitForTimeout(1200);
      const M = await mouvements(page, 2);
      ok(!(await page.$(B)) && !!(await page.$('.resp-l')) && dureesOk(M, 'long'), P('7. sans son calculé dans la page, le bouton du son n’est pas proposé, et l’exercice se fait en silence (' + deux(M) + ')'));
      ok(errs.length === 0, P('7. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }
    if (!tel) {
      const { ctx, page, errs } = await ouvre(fmt, { calme: true });
      await entre(page);
      const M = await mouvements(page, 2);
      const s = await page.evaluate(() => new Promise(fin => { const r = document.querySelector('.souffle .ronds'); const v = []; let k = 0; const f = () => { v.push(getComputedStyle(r).getPropertyValue('--s')); if (++k < 20) requestAnimationFrame(f); else fin(v); }; requestAnimationFrame(f); }));
      ok(dureesOk(M, 'long') && s.every(x => x === s[0]), P('7. avec « moins d’animations », le cercle ne bouge pas et les mots guident (' + deux(M) + ')'));
      await page.click('.resp-l'); await page.waitForSelector('.resp-choix'); await page.click('.resp-o[data-v="egal"]'); await mouvements(page, 1); const M2 = await mouvements(page, 2);
      ok(dureesOk(M2, 'egal'), P('7. et « Changer de respiration » fonctionne de la même façon (' + deux(M2) + ')'));
      ok(errs.length === 0, P('7. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }
  }
  await browser.close();
  notesFin.forEach(x => console.log('  note : ' + x));
  console.log('respiration (' + NAV + ') : ' + n + ' vérifications, ' + ko + ' échec' + (ko > 1 ? 's' : '') + ' (' + APP + ')' + (lit ? '' : ' | son non mesurable dans ce navigateur d’essai'));
  process.exit(ko ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
