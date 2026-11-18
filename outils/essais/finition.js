// La passe de finition, de bout en bout, comme la vivrait un parent :
//   - la vitrine silencieuse et « Souffler 2 minutes » qui commence en silence (la musique de la respiration est vérifiée dans respiration.js) ;
//   - « Prendre un instant » après la dose : le son part quand on le demande, se coupe d'un geste, et s'arrête dès qu'on quitte l'écran ;
//   - la troisième entrée de la vitrine ;
//   - « Accueil » à tout moment, le logo, « Reprendre mon parcours », et le sens de « Retour ».
// usage : node finition.js [--court]      (--court : sans attendre la fin des 40 secondes)
// Variables : PEPE_ORIGIN, PEPE_BASE, PEPE_KEY, PEPE_NAV (chromium, firefox ou webkit), PEPE_CHROME.
// Le son n'est pas écouté ici, il est mesuré : ce que la page envoie vers la sortie audio est relevé à chaque étape.
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
// La sonde : elle note chaque piste lancée, son point de départ, son volume, et ce qui arrive réellement à la sortie audio.
const sonde = () => {
  const S = window.__son = { ctx: [], src: [], gains: [], audios: [], erreurs: [], verrous: [], ecran: { demandes: 0, actifs: 0, pire: 0 }, depart: null, visib: [] };
  // L'instant exact où le parent lance la respiration, relevé dans la page au moment du geste : c'est l'horloge de l'exercice.
  // (le relever depuis l'extérieur ajoute le temps que le navigateur d'essai met à cliquer, qui peut dépasser 1 seconde sur une machine lente)
  document.addEventListener('click', e => { const el = e.target && e.target.closest && e.target.closest('[data-act="porte"][data-v="souffle"],[data-act="souffle-go"]'); if (el) S.depart = performance.now(); }, true);
  document.addEventListener('visibilitychange', () => S.visib.push([Math.round(performance.now()), document.visibilityState]));
  // L'écran qui reste allumé : un faux verrou, pour compter les demandes et celles qui tiennent encore (le vrai dépend du téléphone).
  try { const E = S.ecran; const faux = { request: () => { E.demandes++; E.actifs++; E.pire = Math.max(E.pire, E.actifs); const l = [];
    const v = { released: false, addEventListener: (n, f) => l.push(f), release: () => { if (!v.released) { v.released = true; E.actifs--; l.forEach(f => { try { f(); } catch (e) { } }); } return Promise.resolve(); } };
    S.verrous.push(v); return Promise.resolve(v); } };
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, get: () => faux }); } catch (e) { S.erreurs.push('verrou : ' + e); }
  // Sur iPhone, la page se déclare « lecteur » pendant qu'elle joue, pour que le bouton silencieux ne coupe pas le son. Les navigateurs d'essai
  // n'ont pas tous ce réglage : on leur en prête un, pour suivre le même chemin qu'un iPhone récent et relever ce que la page y écrit.
  try { if (!navigator.audioSession) { const AS = { type: 'auto' }; Object.defineProperty(navigator, 'audioSession', { configurable: true, get: () => AS }); } } catch (e) { S.erreurs.push('session : ' + e); }
  const C = window.AudioContext || window.webkitAudioContext;
  if (C) {
    const P = C.prototype;
    const cbs = P.createBufferSource; P.createBufferSource = function () { const s = cbs.call(this); const r = { ctx: this, start: null, at: null, offset: null, stop: null, ended: false, fin: null, dur: null }; S.src.push(r);
      const st = s.start; s.start = function (w, o) { r.start = this.context.currentTime; r.at = performance.now(); r.offset = o || 0; r.dur = this.buffer ? this.buffer.duration : null; return st.apply(this, arguments); };
      const sp = s.stop; s.stop = function (w) { r.stop = (w === undefined ? this.context.currentTime : w); return sp.apply(this, arguments); };
      s.addEventListener('ended', () => { r.ended = true; r.fin = r.ctx.currentTime; }); return s; };
    const cg = P.createGain; P.createGain = function () { const g = cg.call(this); S.gains.push(g); return g; };
    const conn = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (dest) { const out = conn.apply(this, arguments); try { const c = this.context; if (dest === c.destination) { if (S.ctx.indexOf(c) < 0) S.ctx.push(c); if (!c.__tap) { c.__tap = c.createAnalyser(); c.__tap.fftSize = 2048; } conn.call(this, c.__tap); } } catch (e) { S.erreurs.push(String(e)); } return out; };
  }
  const AU = window.Audio; if (AU) { window.Audio = function (...a) { const el = new AU(...a); S.audios.push(el); return el; }; window.Audio.prototype = AU.prototype; }
  const active = r => r.start !== null && !r.ended && (r.stop === null || r.stop > r.ctx.currentTime);
  S.etat = () => ({
    contextes: S.ctx.length, etatCtx: S.ctx.map(c => c.state), lancees: S.src.filter(r => r.start !== null).length,
    ecran: S.ecran.actifs, ecranPire: S.ecran.pire, ecranDemandes: S.ecran.demandes,
    session: navigator.audioSession ? navigator.audioSession.type : null,
    depart: S.depart, visib: S.visib.length,
    actives: S.src.filter(active).length,
    audibles: S.src.filter((r, i) => active(r) && S.gains[i] && S.gains[i].gain.value > 0.02).length,
    volume: S.src.length && S.gains[S.src.length - 1] ? S.gains[S.src.length - 1].gain.value : 0,
    rms: S.ctx.reduce((m, c) => { if (!c.__tap) return m; const b = new Float32Array(c.__tap.fftSize); c.__tap.getFloatTimeDomainData(b); let s = 0; for (let i = 0; i < b.length; i++) s += b[i] * b[i]; return Math.max(m, Math.sqrt(s / b.length)); }, 0),
    dernier: S.src.length ? (r => ({ offset: r.offset, at: r.at, stop: r.stop, ended: r.ended, dur: r.dur, joue: r.fin !== null ? r.fin - r.start : null }))(S.src[S.src.length - 1]) : null,
    audios: S.audios.map(a => ({ paused: a.paused, t: a.currentTime, src: (a.currentSrc || a.getAttribute('src') || '').replace(/^.*\/son\//, '').replace(/\?.*$/, ''), ended: a.ended }))
  });
};
const sansWebAudio = () => { try { delete window.AudioContext; delete window.webkitAudioContext; window.AudioContext = undefined; window.webkitAudioContext = undefined; } catch (e) { } };
const FORMATS = [['téléphone', { viewport: { width: 390, height: 664 }, hasTouch: true, deviceScaleFactor: 2 }], ['ordinateur', { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 }]];

(async () => {
  const LOCAL = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
  const exe = NAV === 'chromium' ? (process.env.PEPE_CHROME || (require('fs').existsSync(LOCAL) ? LOCAL : undefined)) : undefined;
  const lance = { chromium: { args: ['--ignore-certificate-errors', '--autoplay-policy=user-gesture-required'] }, firefox: {}, webkit: {} }[NAV];
  const browser = await pw[NAV].launch(Object.assign({}, lance, exe ? { executablePath: exe } : {}));
  const ouvre = async (fmt, opt = {}) => {
    const f = Object.assign({}, fmt); if (NAV === 'chromium' && f.hasTouch) f.isMobile = true;
    const ctx = await browser.newContext(Object.assign({ locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'no-preference' }, f));
    await ctx.addInitScript(horloge, [opt.heure === undefined ? 21 + 40 / 60 : opt.heure]);
    if (opt.sansWebAudio) await ctx.addInitScript(sansWebAudio);
    await ctx.addInitScript(sonde);
    const errs = [], sons = [];
    const onglet = async () => { const page = await ctx.newPage();
      page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error' && !/son\/|Failed to load resource|net::ERR/.test(m.text())) errs.push(m.text().slice(0, 200)); });
      page.on('request', r => { const u = r.url(); if (/\/son\//.test(u)) sons.push(u.replace(/^.*\/son\//, '').replace(/\?.*$/, '')); else if (!u.startsWith(ORIGIN) && !/^(data|blob|about):/.test(u)) errs.push('requête vers un autre site : ' + u.slice(0, 100)); });
      return page; };
    return { ctx, page: await onglet(), errs, sons, onglet };
  };
  const notes = page => page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return 'illisible'; } }, KEY);
  const h1 = page => page.$eval('h1', e => e.textContent).then(net).catch(() => '');
  const son = page => page.evaluate(() => window.__son.etat());
  const bouton = (page, sel) => page.$eval(sel, e => ({ etat: e.getAttribute('data-etat'), texte: e.textContent.replace(/\s+/g, ' ').trim(), occupe: e.getAttribute('aria-busy') === 'true' })).catch(() => null);
  const attendEtat = async (page, sel, etat, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { const b = await bouton(page, sel); if (b && b.etat === etat) return true; await page.waitForTimeout(80); } return false; };
  const cacher = (page, v) => page.evaluate(v => { if (v === 'hidden') window.__son.verrous.forEach(x => x.release()); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => v }); Object.defineProperty(document, 'hidden', { configurable: true, get: () => v === 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); return performance.now(); }, v);
  const maintenant = page => page.evaluate(() => performance.now());
  // Attendre le silence : plus aucune piste en cours et plus de signal à la sortie. Le résultat dit combien de temps il a mis à venir.
  // (compter un délai fixe ne suffit pas : sur une machine lente, l'horloge du son avance par à-coups)
  const silence = async (page, ms = 3000) => { const t = Date.now(); let s = await son(page); while (!(s.actives === 0 && s.rms < 0.0005) && Date.now() - t < ms) { await page.waitForTimeout(100); s = await son(page); }
    return Object.assign({}, s, { muet: s.actives === 0 && s.rms < 0.0005, delai: Date.now() - t }); };
  const dit = q => '(silence après ' + q.delai + ' ms, ' + q.actives + ' piste, signal ' + q.rms.toFixed(5) + ')';
  const B = '.son-souffle', D = '.son-dose';
  // la porte « Souffler 2 minutes » : on note l'instant du geste, pour savoir où doit en être le morceau quand le son part
  const porteSouffle = async (page, sel) => { const t = await maintenant(page); await page.click(sel); await page.waitForSelector('main.souffle.s-cours'); const d = await page.evaluate(() => window.__son.depart); return d || t; };
  // attendre un mot du guidage (« Inspirez », « Expirez »), ou attendre qu'il change : la respiration avance, quel que soit le moment où l'on regarde
  const mot = page => page.textContent('#souffle-mot').catch(() => '');
  const attendMot = async (page, voulu, ms = 9000) => { const t = Date.now(); let m = ''; while (Date.now() - t < ms) { m = await mot(page); if (m === voulu) return m; await page.waitForTimeout(120); } return m; };
  const motChange = async (page, ms = 8000) => { const m1 = await mot(page); const t = Date.now(); let m2 = m1; while (Date.now() - t < ms) { await page.waitForTimeout(200); m2 = await mot(page); if (m2 !== m1) break; } return [m1, m2]; };

  // Ce navigateur d'essai sait-il lire le morceau, et a-t-il une sortie audio qui tourne ? (sur une machine sans carte son, ce n'est pas toujours le cas)
  let lit = true, pourquoi = '';
  { const { ctx, page } = await ouvre(FORMATS[1][1]); await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.herofull .porte');
    await page.evaluate(base => { window.__sondage = 'en cours'; document.body.addEventListener('click', async () => { const C = window.AudioContext || window.webkitAudioContext; if (!C) { window.__sondage = 'pas de son calculé dans la page'; return; }
      try { const c = new C(); if (c.resume) c.resume().catch(() => { }); const r = await fetch(base + 'son/instant.mp3'); if (!r.ok) { window.__sondage = 'morceau introuvable'; return; } const ab = await r.arrayBuffer();
        const buf = await new Promise((ok, ko) => { const q = c.decodeAudioData(ab, ok, ko); if (q && q.then) q.then(ok, ko); }); if (!(buf.duration > 30)) { window.__sondage = 'morceau illisible'; return; }
        const t0 = c.currentTime; let tourne = false; for (let i = 0; i < 16 && !tourne; i++) { await new Promise(r => setTimeout(r, 250)); tourne = c.state === 'running' && c.currentTime > t0 + 0.2; }
        window.__sondage = tourne ? 'ok' : 'la sortie audio ne tourne pas (' + c.state + ', horloge à ' + (c.currentTime - t0).toFixed(2) + ' s après 4 s)'; }
      catch (e) { window.__sondage = 'morceau illisible : ' + String(e).slice(0, 80); } }, { once: true }); }, BASE);
    await page.mouse.click(5, 5); for (let i = 0; i < 100; i++) { pourquoi = await page.evaluate(() => window.__sondage); if (pourquoi !== 'en cours') break; await page.waitForTimeout(250); }
    lit = pourquoi === 'ok'; await ctx.close(); if (!lit) notesFin.push('dans ce navigateur d’essai, le son n’a pas pu être mesuré (' + pourquoi + ') : seuls le silence, les boutons et la navigation y sont vérifiés'); }

  for (const [nom, fmt] of FORMATS) {
    const P = m => NAV + ' · ' + nom + ' · ' + m;
    const tel = nom === 'téléphone';
    const accueilSel = tel ? '.bar .va-accueil' : '.tabs a.tab-accueil';

    // =====================================================================================================================
    // 1. La vitrine est silencieuse, et « Souffler 2 minutes » commence en silence. (la musique de la respiration a son propre essai : respiration.js)
    // =====================================================================================================================
    {
      const { ctx, page, errs, sons } = await ouvre(fmt);
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.herofull .porte'); await page.waitForTimeout(400);
      ok((await page.$$('.son-b')).length === 0 && sons.length === 0, P('1. la vitrine est silencieuse : pas de bouton de son, aucun morceau chargé'));
      const porte3 = await page.evaluate(() => { const p = document.querySelector('.herofull .porte[data-v="piste"]'); return [p.querySelector('b').textContent, p.querySelector('.tx span').textContent]; });
      ok(net(porte3[0]) === 'Trouver une idée pour ce soir' && net(porte3[1]) === 'Vous choisissez ce que vous vivez, avec un enfant, un ado ou un adulte.', P('3. la troisième entrée : « Trouver une idée pour ce soir », pour un enfant, un ado ou un adulte ' + JSON.stringify(porte3)));
      await porteSouffle(page, '.herofull ' + A('porte', '[data-v="souffle"]'));
      await page.waitForTimeout(2600);
      const b0 = await bouton(page, B); const s0 = await son(page);
      ok(b0 && b0.etat === 'off' && b0.texte === 'Écouter l’étang', P('1. l’exercice commence en silence, avec la commande « Écouter l’étang » ' + JSON.stringify(b0)));
      ok(sons.length === 0 && s0.contextes === 0 && s0.lancees === 0 && s0.audios.length === 0, P('1. en silence, aucun morceau n’est chargé et rien n’est joué ' + JSON.stringify([sons, s0.contextes, s0.lancees])));
      ok(s0.ecran === 1, P('1. pendant la respiration, l’écran est tenu allumé (' + s0.ecran + ' demande en cours)'));
      await attendMot(page, 'Inspirez');
      const g1 = await page.evaluate(() => ({ mot: document.getElementById('souffle-mot').textContent, aide: document.getElementById('souffle-aide').textContent, tours: document.querySelectorAll('.souffle .tours i').length, s: getComputedStyle(document.querySelector('.souffle .ronds')).getPropertyValue('--s') }));
      await attendMot(page, 'Expirez'); await page.waitForTimeout(700);
      const g2 = await page.evaluate(() => ({ mot: document.getElementById('souffle-mot').textContent, s: getComputedStyle(document.querySelector('.souffle .ronds')).getPropertyValue('--s') }));
      ok(g1.mot === 'Inspirez' && g2.mot === 'Expirez' && g1.tours === 12 && g1.s !== g2.s && /cercle/.test(g1.aide), P('1. en silence, le guidage visuel est complet : le mot, la consigne, le cercle et les 12 points ' + JSON.stringify([g1, g2])));
      const z = await page.$eval(B, e => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), r.bottom <= innerHeight, getComputedStyle(e).fontSize]; });
      ok(z[1] >= 44 && z[2] && parseFloat(z[3]) >= 15, P('1. la commande est lisible et assez grande pour le doigt ' + JSON.stringify(z)));
      await page.click(A('souffle-stop')); await page.waitForSelector('main.souffle.s-pret');
      ok((await son(page)).ecran === 0, P('1. après « Arrêter », le téléphone retrouve sa mise en veille habituelle'));
      ok(errs.length === 0, P('1. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 3. La dose : « Prendre un instant », après le texte. Les autres écrans restent silencieux.
    // =====================================================================================================================
    {
      const { ctx, page, errs, sons } = await ouvre(fmt);
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.herofull .porte'); await page.waitForTimeout(300);
      await page.evaluate(() => document.querySelector('[data-act="entrer"][data-v="today"]').click());   // « Commencer gratuitement », plus bas dans la vitrine
      await page.waitForSelector('.dose ' + D); await page.waitForTimeout(600);
      const d0 = await page.evaluate(() => { const dose = document.querySelector('.dose'), p = dose.querySelector('p'), b = dose.querySelector('.son-dose'); return { apres: (p.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) > 0, texte: b.textContent.replace(/\s+/g, ' ').trim(), h: Math.round(b.getBoundingClientRect().height) }; });
      ok(d0.apres && d0.texte === 'Prendre un instant 40 secondes d’étang, avec le son' && d0.h >= 44, P('4. sous le texte de la dose, « Prendre un instant » annonce 40 secondes d’étang, avec le son ' + JSON.stringify(d0)));
      ok(sons.length === 0 && (await son(page)).contextes === 0, P('4. tant que le parent ne le demande pas, rien n’est chargé'));
      if (lit) {
        await page.click(D); ok(await attendEtat(page, D, 'on'), P('4. un geste, et l’instant commence')); await page.waitForTimeout(2700);
        const i1 = await son(page); const bi = await bouton(page, D);
        ok(sons.join(',') === 'instant.mp3' && i1.actives === 1 && i1.dernier.offset === 0 && Math.abs(i1.dernier.dur - 40) < 0.5 && i1.volume > 0.85 && i1.rms > 0.001 && bi.texte === 'Revenir au silence', P('4. c’est le morceau court (40 s) qui joue, depuis son début, et le bouton propose « Revenir au silence » ' + JSON.stringify([sons, i1.dernier.dur, bi.texte])));
        ok(!!(await page.$('.dose p')) && !(await page.$('.sheet')), P('4. le texte de la dose reste à l’écran pendant l’écoute'));
        ok(i1.ecran === 1, P('4. pendant l’instant d’écoute, l’écran reste allumé'));
        await page.click(D);
        const i2 = await silence(page);
        ok(i2.muet && (await bouton(page, D)).texte.startsWith('Prendre un instant'), P('4. le même geste ramène le silence ' + dit(i2)));
        ok(i2.ecran === 0, P('4. et le téléphone retrouve sa mise en veille habituelle'));
        await page.click(D); await attendEtat(page, D, 'on'); await page.waitForTimeout(300);
        await page.click('.tabs ' + A('go', '[data-view="parcours"]')); await page.waitForTimeout(300);
        { const q = await silence(page); const reste = (await page.$$('.son-b')).length; ok(q.muet && reste === 0, P('4. changer d’onglet coupe le son ' + dit(q) + (reste ? ', le bouton du son est encore à l’écran' : ''))); }
        await page.click('.tabs ' + A('go', '[data-view="today"]')); await page.waitForSelector(D); await page.waitForTimeout(400);
        ok((await bouton(page, D)).etat === 'off', P('4. de retour sur « Aujourd’hui », le bouton est revenu à « Prendre un instant »'));
        await page.click(D); await attendEtat(page, D, 'on'); await page.waitForTimeout(300);
        await page.click('.dose .qui-b'); await page.waitForSelector('.sheet');
        { const q = await silence(page); ok(q.muet, P('4. ouvrir une feuille par-dessus coupe le son ' + dit(q))); }
        await page.keyboard.press('Escape'); await page.waitForTimeout(500);
        if (tel && !COURT) {
          await page.click(D); await attendEtat(page, D, 'on');
          let fin = null; for (let i = 0; i < 180; i++) { const s = await son(page); if (s.actives === 0) { fin = s; break; } await page.waitForTimeout(250); }
          await page.waitForTimeout(300);
          ok(fin && fin.dernier.ended && fin.dernier.stop === null && Math.abs(fin.dernier.joue - fin.dernier.dur) < 0.6 && (await bouton(page, D)).etat === 'off', P('4. au bout de 40 secondes, l’instant s’éteint de lui-même et le bouton redevient « Prendre un instant »'));
          ok((await son(page)).ecran === 0, P('4. une fois l’instant fini, l’écran n’est plus retenu'));
        }
      }
      // les écrans qui doivent rester silencieux
      const muets = [];
      await page.click(accueilSel); await page.waitForSelector('main.intro'); await page.waitForTimeout(400); muets.push(['vitrine', (await page.$$('.son-b')).length]);
      await page.click('.herofull ' + A('porte', '[data-v="deposer"]')); await page.waitForSelector('main.deposer'); await page.waitForTimeout(300); muets.push(['dépôt', (await page.$$('.son-b')).length]);
      await page.click(A('go', '[data-view="sos"]')); await page.waitForTimeout(500); muets.push(['SOS', (await page.$$('.son-b')).length]);
      await page.goto(APP + 'fiches/le-coucher-et-la-nuit/'); await page.waitForSelector('main.fiche'); await page.waitForTimeout(300); muets.push(['fiche', (await page.$$('.son-b')).length]);
      ok(muets.every(m => m[1] === 0) && (await son(page)).actives === 0, P('4. la vitrine, le dépôt, le SOS et les fiches restent silencieux ' + JSON.stringify(muets)));
      ok(errs.length === 0, P('4. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 4. L'accueil à tout moment, « Reprendre mon parcours », et le sens de « Retour ».
    // =====================================================================================================================
    {
      const { ctx, page, errs, onglet } = await ouvre(fmt);
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.herofull .porte'); await page.waitForTimeout(300);
      // depuis la vitrine : Souffler, puis « Retour » ramène à la vitrine
      await page.click('.herofull ' + A('porte', '[data-v="souffle"]')); await page.waitForSelector('main.souffle.s-cours'); await page.waitForTimeout(400);
      await page.click('.souffle .bar .back'); await page.waitForTimeout(900);
      ok(!!(await page.$('main.intro .herofull')) && page.url() === APP + '#accueil' && (await page.$$('.herofull .porte')).length === 3, P('5. « Souffler » ouvert depuis la vitrine : « Retour » ramène à la vitrine (' + page.url().replace(ORIGIN, '') + ')'));
      // la vitrine entière est là : l'étang, les 3 entrées, l'histoire d'Antonio, la présentation du parcours
      const vit = await page.evaluate(() => ({ etang: !!document.querySelector('.herofull .herobg'), portes: document.querySelectorAll('.herofull .porte').length, histoire: !!document.querySelector('.voice [data-act="peek-about"]'), parcours: !!document.querySelector('.acc-parcours .acc-mois'), mois: document.querySelectorAll('.acc-parcours .mois').length, liens: [...document.querySelectorAll('.herofull .voie')].map(e => e.textContent.trim()) }));
      ok(vit.etang && vit.portes === 3 && vit.histoire && vit.parcours && vit.mois === 6, P('5. la vitrine est complète : l’étang, les 3 entrées, l’histoire d’Antonio et les 6 mois du parcours ' + JSON.stringify(vit)));
      // la mise en forme de la vitrine n'a pas bougé : ses phrases d'introduction restent du texte courant, sans cadre ni fond
      // (le lien « Accueil » a porté un temps le même nom de classe qu'elles, et leur donnait son cadre)
      const intro = await page.evaluate(() => [...document.querySelectorAll('.view.intro .acc-h > p.acc-l')].map(p => { const c = getComputedStyle(p); return [c.display, c.borderTopWidth, c.backgroundColor, Math.round(parseFloat(c.lineHeight) / parseFloat(c.fontSize) * 100) / 100, c.fontWeight, c.borderRadius]; }));
      ok(intro.length >= 5 && intro.every(x => x[0] === 'block' && x[1] === '0px' && /rgba\(0, 0, 0, 0\)|transparent/.test(x[2]) && x[3] >= 1.4 && +x[4] < 700 && x[5] === '0px'), P('5. les phrases d’introduction de la vitrine restent du texte courant, sans cadre (' + intro.length + ' phrases) ' + JSON.stringify(intro[0])));
      await page.click('.herofull ' + A('entrer', '[data-v="today"]')); await page.waitForSelector('.tabs'); await page.waitForTimeout(600);
      ok((await h1(page)) === 'Bonsoir.', P('5. « Ouvrir mon espace » mène à « Aujourd’hui »'));
      // depuis « Aujourd'hui » : Souffler, puis « Retour » ramène à « Aujourd'hui », par le bouton comme par la flèche du navigateur
      await page.click('.portes.mini ' + A('porte', '[data-v="souffle"]')); await page.waitForSelector('main.souffle.s-cours'); await page.waitForTimeout(400);
      await page.click('.souffle .bar .back'); await page.waitForTimeout(900);
      ok((await h1(page)) === 'Bonsoir.' && !!(await page.$('.tabs')), P('5. « Souffler » ouvert depuis « Aujourd’hui » : « Retour » ramène à « Aujourd’hui »'));
      await page.click('.portes.mini ' + A('porte', '[data-v="souffle"]')); await page.waitForSelector('main.souffle.s-cours'); await page.waitForTimeout(400);
      await page.goBack(); await page.waitForTimeout(900);
      ok((await h1(page)) === 'Bonsoir.' && !!(await page.$('.tabs')), P('5. la flèche du navigateur suit le même chemin'));
      // le lien « Accueil » et le logo
      const lien = await page.evaluate(sel => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { texte: e.textContent.trim(), vu: r.width > 0 && r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth, h: Math.round(r.height) }; }, accueilSel);
      ok(lien && lien.texte === 'Accueil' && lien.vu && lien.h >= 44, P('5. un lien « Accueil » est visible dans l’espace ' + JSON.stringify(lien)));
      if (!tel) { const menu = await page.evaluate(() => [...document.querySelectorAll('.tabs .tab')].slice(0, 3).map(e => { const c = getComputedStyle(e), r = e.getBoundingClientRect(); return [e.textContent.trim(), c.display, c.marginTop, Math.round(r.height), Math.round(r.left), Math.round(r.width)]; }));
        ok(menu.length === 3 && menu[0][0] === 'Accueil' && menu[0].slice(1).join() === menu[1].slice(1).join(), P('5. dans le menu de l’ordinateur, « Accueil » a la même forme que les autres entrées ' + JSON.stringify(menu.slice(0, 2)))); }
      const logoSel = tel ? '.bar a.wordmark' : '.tabs a.rail-brand';
      await page.click(logoSel); await page.waitForSelector('main.intro'); await page.waitForTimeout(600);
      ok(page.url() === APP + '#accueil' && !!(await page.$('.herofull .porte')), P('5. le logo mène à la vitrine'));
      // (on attend le titre plutôt qu'un délai fixe : sur une machine occupée, le retour en arrière peut prendre plus d'une seconde)
      await page.goBack(); { const t = Date.now(); while ((await h1(page)) !== 'Bonsoir.' && Date.now() - t < 4000) await page.waitForTimeout(150); } await page.waitForTimeout(300);
      ok((await h1(page)) === 'Bonsoir.', P('5. et « Retour » ramène à « Aujourd’hui »'));
      await page.goForward(); await page.waitForTimeout(800); ok(!!(await page.$('main.intro')), P('5. la flèche « Suivant » du navigateur retrouve la vitrine'));
      await page.goBack(); await page.waitForTimeout(800);

      // le scénario demandé : j'ouvre une étape, j'y écris, je reviens à la vitrine avec « Accueil », puis « Reprendre mon parcours »
      await page.click('.reprendre .step.semaine'); await page.waitForSelector('main.etape, main.step, #note'); await page.waitForTimeout(700);
      const titre = await h1(page);
      await page.fill('#note', 'Ce soir, il s’est endormi plus vite. Je note ce qui a aidé.'); await page.waitForTimeout(900);
      const fait = await page.$(A('stepdone')); if (fait) { await fait.click(); await page.waitForTimeout(500); }
      const avant = await notes(page);
      const lien2 = await page.evaluate(sel => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { vu: r.width > 0 && r.top >= 0 && r.bottom <= innerHeight, texte: e.textContent.trim() }; }, accueilSel);
      ok(lien2 && lien2.vu && lien2.texte === 'Accueil', P('5. dans une étape aussi, « Accueil » est à portée de main ' + JSON.stringify(lien2)));
      await page.click(accueilSel); await page.waitForSelector('main.intro'); await page.waitForTimeout(700);
      const v2 = await page.evaluate(() => [...document.querySelectorAll('.herofull .voie')].map(e => e.textContent.trim()));
      ok(page.url() === APP + '#accueil' && v2.join('|') === 'Reprendre mon parcours|Ouvrir mon espace', P('5. « Accueil » depuis l’étape : la vitrine affiche « Reprendre mon parcours » ' + JSON.stringify(v2)));
      ok(await page.evaluate(() => scrollY === 0), P('5. la vitrine s’ouvre en haut de page'));
      await page.click('.herofull .voie' + A('step')); await page.waitForSelector('#note'); await page.waitForTimeout(700);
      const apres = await notes(page);
      ok((await h1(page)) === titre && (await page.inputValue('#note')) === 'Ce soir, il s’est endormi plus vite. Je note ce qui a aidé.', P('5. « Reprendre mon parcours » ramène à la bonne étape, avec la note écrite (' + titre + ')'));
      ok(JSON.stringify(avant) === JSON.stringify(apres) && Object.keys(apres.seen).length === 1 && Object.keys(apres.notes).length === 1 && (!fait || Object.values(apres.steps).filter(Boolean).length === 1), P('5. les notes et la progression sont intactes (' + Object.keys(apres.seen).length + ' étape ouverte, ' + Object.keys(apres.notes).length + ' note, ' + Object.values(apres.steps).filter(Boolean).length + ' étape faite)'));
      await page.click('.bar .back'); await page.waitForTimeout(800);
      ok(!!(await page.$('main.intro')), P('5. depuis l’étape rouverte, « Retour » ramène à la vitrine'));
      // le bas de la vitrine aussi propose de reprendre
      ok(net(await page.textContent('.acc-parcours ' + A('step')).catch(() => '')) === 'Reprendre mon parcours' && net(await page.textContent('.acc-fin .btn.primary').catch(() => '')) === 'Ouvrir mon espace', P('5. plus bas dans la vitrine, les boutons disent « Reprendre mon parcours » et « Ouvrir mon espace »'));
      // rouvrir le lien du site : le parent retrouve son espace. L'adresse de l'accueil montre la vitrine, et la garde si la page est rechargée.
      const p2 = await onglet(); await p2.goto(APP, { waitUntil: 'domcontentloaded' }); await p2.waitForSelector('.tabs'); await p2.waitForTimeout(500);
      ok((await h1(p2)) === 'Bonsoir.' && !!(await p2.$('.reprendre .step.semaine')), P('5. rouvrir le lien du site : le parent retrouve « Aujourd’hui » et son étape'));
      await p2.goto(APP + '#accueil'); await p2.waitForTimeout(300); await p2.reload({ waitUntil: 'domcontentloaded' }); await p2.waitForSelector('main.intro'); await p2.waitForTimeout(500);
      ok(!!(await p2.$('.herofull .voie' + A('step'))), P('5. l’adresse de l’accueil ouvre la vitrine, et la page rechargée la garde'));
      await p2.close();
      ok(errs.length === 0, P('5. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 5. Le chemin de secours : sans son calculé dans la page (très ancien navigateur), l'instant de la dose passe par le lecteur audio ordinaire,
    //    et la respiration, dont la musique en a besoin, se fait en silence.
    // =====================================================================================================================
    if (NAV === 'chromium') {
      const { ctx, page, errs, sons } = await ouvre(fmt, { sansWebAudio: true });
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.herofull .porte'); await page.waitForTimeout(300);
      await porteSouffle(page, '.herofull ' + A('porte', '[data-v="souffle"]')); await page.waitForTimeout(1500);
      ok(!(await page.$(B)) && (await attendMot(page, 'Inspirez')) === 'Inspirez', P('6. sans son calculé dans la page, la respiration ne propose pas de musique et guide en silence'));
      await page.click('.souffle .bar .back'); await page.waitForSelector('main.intro'); await page.waitForTimeout(300);
      await page.evaluate(() => document.querySelector('[data-act="entrer"][data-v="today"]').click()); await page.waitForSelector('.dose ' + D); await page.waitForTimeout(500);
      await page.click(D); ok(await attendEtat(page, D, 'on'), P('6. pour l’instant de la dose, le lecteur ordinaire prend le relais')); await page.waitForTimeout(1500);
      const e1 = await son(page);
      ok(e1.contextes === 0 && e1.audios.length === 1 && !e1.audios[0].paused && e1.audios[0].src === 'instant.mp3' && e1.audios[0].t > 0.5 && sons.join(',') === 'instant.mp3', P('6. un seul lecteur joue le morceau de 40 secondes (' + (e1.audios[0] ? e1.audios[0].t.toFixed(2) : '?') + ' s)'));
      for (let i = 0; i < 6; i++) { await page.click(D); await page.waitForTimeout(45); } await page.waitForTimeout(900);
      const e2 = await son(page); const be = await bouton(page, D);
      ok(e2.audios.length === 1 && (be.etat === 'on') === !e2.audios[0].paused, P('6. après des pressions rapides, il n’y a toujours qu’un lecteur, et le bouton dit ce qu’il fait (' + be.etat + ')'));
      if (be.etat !== 'on') { await page.click(D); await attendEtat(page, D, 'on'); }
      await page.click('.tabs ' + A('go', '[data-view="parcours"]')); await page.waitForTimeout(500);
      ok((await son(page)).audios[0].paused, P('6. changer d’onglet coupe ce lecteur aussi'));
      ok(errs.length === 0, P('6. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 6. Si le morceau ne peut pas se charger (réseau coupé), l'espace le dit et tout le reste continue.
    // =====================================================================================================================
    {
      const { ctx, page } = await ouvre(fmt);
      await ctx.route('**/son/*', r => r.abort());
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.herofull .porte'); await page.waitForTimeout(300);
      await page.click('.herofull ' + A('porte', '[data-v="souffle"]')); await page.waitForSelector('main.souffle.s-cours'); await page.waitForTimeout(1800);
      await page.click(B); await page.waitForTimeout(1800);
      const b = await bouton(page, B); const t = net(await page.textContent('.toast').catch(() => ''));
      ok(b && b.etat === 'off' && t === 'Le son n’a pas pu se charger. Tout le reste fonctionne en silence.' && !!(await page.$('main.souffle.s-cours')), P('7. morceau introuvable : l’espace le dit, le bouton revient à « Écouter l’étang » et la respiration continue ' + JSON.stringify([b && b.etat, t])));
      await ctx.close();
    }
  }
  await browser.close();
  notesFin.forEach(x => console.log('  note : ' + x));
  console.log('finition (' + NAV + ') : ' + n + ' vérifications, ' + ko + ' échec' + (ko > 1 ? 's' : '') + ' (' + APP + ')' + (lit ? '' : ' | son non mesurable dans ce navigateur d’essai'));
  process.exit(ko ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
