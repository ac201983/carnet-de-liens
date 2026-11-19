// La passe de finition, de bout en bout, comme la vivrait un parent :
//   - la vitrine silencieuse et « Souffler 2 minutes » qui commence en silence (la musique de la respiration est vérifiée dans respiration.js) ;
//   - « Prendre un instant » après la dose : l'étang à regarder ou à toucher (une onde naît sous le doigt, la page défile toujours),
//     le son part quand on le demande, se coupe d'un geste, et s'arrête dès qu'on quitte l'écran ;
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
  // PEPE_EAU=1 (dans l'atelier seulement, avec Chrome) : la carte graphique est émulée et la garde de l'eau est levée, pour rejouer l'essai avec la goutte dessinée, comme sur un appareil qui sait dessiner l'eau.
  const EAU_EMULEE = NAV === 'chromium' && !!process.env.PEPE_EAU;
  const lance = { chromium: { args: ['--ignore-certificate-errors', '--autoplay-policy=user-gesture-required'].concat(EAU_EMULEE ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] : []) }, firefox: {}, webkit: {} }[NAV];
  const browser = await pw[NAV].launch(Object.assign({}, lance, exe ? { executablePath: exe } : {}));
  const ouvre = async (fmt, opt = {}) => {
    const f = Object.assign({}, fmt); if (NAV === 'chromium' && f.hasTouch) f.isMobile = true;
    const ctx = await browser.newContext(Object.assign({ locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: opt.calme ? 'reduce' : 'no-preference' }, f));
    await ctx.addInitScript(horloge, [opt.heure === undefined ? 21 + 40 / 60 : opt.heure]);
    if (EAU_EMULEE) await ctx.addInitScript(() => { window.__eauSansGarde = true; });
    if (opt.sansWebAudio) await ctx.addInitScript(sansWebAudio);
    await ctx.addInitScript(sonde);
    const errs = [], sons = [];
    const onglet = async () => { const page = await ctx.newPage();
      page.on('pageerror', e => errs.push(String(e).slice(0, 200))); page.on('console', m => { if (m.type() === 'error' && !/son\/|Failed to load resource|net::ERR|downloadable font: download failed[^]*status=2152398850/.test(m.text())) errs.push(m.text().slice(0, 200)); });
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
  { const { ctx, page } = await ouvre(FORMATS[1][1]); await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.seuil .porte');
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
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.seuil .porte'); await page.waitForTimeout(400);
      ok((await page.$$('.son-b')).length === 0 && sons.length === 0, P('1. la vitrine est silencieuse : pas de bouton de son, aucun morceau chargé'));
      const porte3 = await page.evaluate(() => { const p = document.querySelector('.seuil .porte[data-v="piste"]'); return [p.querySelector('b').textContent, p.querySelector('.tx span').textContent]; });
      ok(net(porte3[0]) === 'Trouver une idée pour ce soir' && net(porte3[1]) === 'Vous choisissez ce que vous vivez, avec un enfant, un ado ou un adulte.', P('3. la troisième entrée : « Trouver une idée pour ce soir », pour un enfant, un ado ou un adulte ' + JSON.stringify(porte3)));
      await porteSouffle(page, '.seuil ' + A('porte', '[data-v="souffle"]'));
      await page.waitForTimeout(2600);
      const b0 = await bouton(page, B); const s0 = await son(page);
      ok(b0 && b0.etat === 'off' && b0.texte === 'Écouter l’étang', P('1. l’exercice commence en silence, avec la commande « Écouter l’étang » ' + JSON.stringify(b0)));
      ok(sons.length === 0 && s0.contextes === 0 && s0.lancees === 0 && s0.audios.length === 0, P('1. en silence, aucun morceau n’est chargé et rien n’est joué ' + JSON.stringify([sons, s0.contextes, s0.lancees])));
      ok(s0.ecran === 1, P('1. pendant la respiration, l’écran est tenu allumé (' + s0.ecran + ' demande en cours)'));
      await attendMot(page, 'Inspirez');
      // Ce qui guide les yeux dépend de l'appareil : la goutte de la photo quand il sait dessiner l'eau, 2 cercles posés sur l'eau sinon. La ligne d'aide dit lequel.
      const eauVue = () => { const e = document.querySelector('.souffle .etang'); return !!e && e.classList.contains('eau-vive') && !!e.querySelector('canvas.eau'); };
      const photoEtang = async () => { try { return await (await page.$('.souffle .etang')).screenshot(); } catch (e) { return null; } };
      const g1 = await page.evaluate(() => ({ mot: document.getElementById('souffle-mot').textContent, aide: document.getElementById('souffle-aide').textContent, tours: document.querySelectorAll('.souffle .tours i').length, s: getComputedStyle(document.querySelector('.souffle .ronds')).getPropertyValue('--s') }));
      g1.eau = await page.evaluate(eauVue); const parGoutte = /goutte/.test(g1.aide); const ph1 = parGoutte ? await photoEtang() : null;
      await attendMot(page, 'Expirez'); await page.waitForTimeout(700);
      const g2 = await page.evaluate(() => ({ mot: document.getElementById('souffle-mot').textContent, s: getComputedStyle(document.querySelector('.souffle .ronds')).getPropertyValue('--s') }));
      g2.eau = await page.evaluate(eauVue); const ph2 = parGoutte ? await photoEtang() : null;
      ok(g1.mot === 'Inspirez' && g2.mot === 'Expirez' && g1.tours === 12 && (parGoutte ? g1.eau && g2.eau : g1.s !== g2.s && /cercle/.test(g1.aide)), P('1. en silence, le guidage visuel est complet : le mot, la consigne, ' + (parGoutte ? 'la goutte dessinée sur l’eau' : 'les cercles') + ' et les 12 points ' + JSON.stringify([g1, g2])));
      if (parGoutte) notesFin.push(P('la goutte est dessinée par la carte graphique de cette machine. ' + (ph1 && ph2 ? (Buffer.compare(ph1, ph2) ? 'L’image de l’étang a changé entre « Inspirez » et « Expirez ».' : 'L’image de l’étang photographiée est restée la même entre « Inspirez » et « Expirez » : ce navigateur d’essai ne photographie peut-être pas l’eau dessinée.') : 'L’étang n’a pas pu être photographié.')));
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
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.seuil .porte'); await page.waitForTimeout(300);
      await page.evaluate(() => document.querySelector('[data-act="entrer"][data-v="today"]').click());   // « Commencer gratuitement », plus bas dans la vitrine
      // Sous le texte de la dose, « Prendre un instant » ouvre un écran à part : l'étang, à regarder ou à toucher. Le son reste à l'initiative du parent.
      const IB = '.dose .instant-b', IN = 'main.instant';
      await page.waitForSelector(IB); await page.waitForTimeout(600);
      const d0 = await page.evaluate(() => { const dose = document.querySelector('.dose'), p = dose.querySelector('p'), b = dose.querySelector('.instant-b'); return { apres: (p.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) > 0, texte: b.textContent.replace(/\s+/g, ' ').trim(), h: Math.round(b.getBoundingClientRect().height), sons: document.querySelectorAll('.son-b').length }; });
      ok(d0.apres && d0.texte === 'Prendre un instant L’étang, à regarder ou à toucher' && d0.h >= 44 && d0.sons === 0, P('4. sous le texte de la dose, « Prendre un instant » annonce l’étang, à regarder ou à toucher, et « Aujourd’hui » n’a pas de bouton de son ' + JSON.stringify(d0)));
      await page.click(IB); await page.waitForSelector(IN + ' .etang'); await page.waitForTimeout(900);
      const e0 = await page.evaluate(() => { const m = document.querySelector('main.instant'), t = e => e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; const ph = m.querySelector('.etang-photo'), b = m.querySelector('.son-dose'); return { h1: t(m.querySelector('h1')), aide: t(m.querySelector('.aide')), son: t(b), etat: b ? b.getAttribute('data-etat') : '', photo: !!ph && ph.complete && ph.naturalWidth > 0 && (ph.getAttribute('alt') || '').length > 20, retour: !!document.querySelector('.bar .back'), sos: !!document.querySelector('.bar .sos'), champs: m.querySelectorAll('input,textarea').length, action: getComputedStyle(m.querySelector('.etang')).touchAction }; });
      ok(e0.h1 === 'Prendre un instant' && /^(Touchez l’eau si vous en avez envie\. Vous pouvez aussi simplement la regarder\.|Regardez l’eau aussi longtemps que vous voulez\. Ici, rien ne vous attend\.)$/.test(e0.aide) && e0.photo && e0.retour && e0.sos && e0.champs === 0, P('4. l’écran « Prendre un instant » montre l’étang, dit qu’on peut le toucher ou seulement le regarder, et garde « Retour » et le SOS ' + JSON.stringify([e0.h1, e0.aide])));
      ok(sons.length === 0 && (await son(page)).contextes === 0 && e0.etat === 'off' && e0.son === 'Écouter l’étang 40 secondes, quand vous voulez', P('4. l’étang s’ouvre en silence : le son attend que le parent le demande, et rien n’est chargé ' + JSON.stringify([sons, e0.son])));
      // Toucher l'eau : une onde naît sous le doigt, puis s'efface. Toucher la forêt ne fait rien. Le geste ne retient pas la page.
      const touche = (fy, annulable) => page.evaluate(([fy, annulable]) => { const ph = document.querySelector('main.instant .etang-photo'), r = ph.getBoundingClientRect(); const ev = new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: r.left + r.width * .3, clientY: r.top + r.height * fy, button: 0, pointerId: 1, pointerType: 'touch' }); ph.dispatchEvent(ev); let tenu = ev.defaultPrevented; if (annulable && window.TouchEvent) { try { const te = new Event('touchstart', { bubbles: true, cancelable: true }); ph.dispatchEvent(te); tenu = tenu || te.defaultPrevented; } catch (e) { } } return tenu; }, [fy, annulable]);
      const eau = () => page.evaluate(() => ({ calque: !!document.querySelector('main.instant .etang canvas.eau'), cercle: document.querySelectorAll('main.instant .onde-doigt').length }));
      const foret = await touche(.06, false); await page.waitForTimeout(250); const o0 = await eau();
      const tenu = await touche(.72, true); await page.waitForTimeout(350); const o1 = await eau();
      ok(!foret && !tenu && e0.action !== 'none' && (o1.calque || o1.cercle === 1), P('4. toucher l’eau fait naître une onde sous le doigt (' + (o1.calque ? 'dessinée dans la photo' : 'un cercle fin') + '), sans retenir le geste : la page peut toujours défiler ' + JSON.stringify([e0.action, o1])));
      ok(!o0.cercle || o1.calque, P('4. toucher la forêt, au-dessus de l’eau, ne fait rien'));
      await page.waitForTimeout(4300); const o2 = await eau();
      ok(!o2.calque && o2.cercle === 0, P('4. l’onde s’efface d’elle-même, et l’étang redevient immobile ' + JSON.stringify(o2)));
      ok(sons.length === 0 && (await son(page)).contextes === 0, P('4. toucher l’eau ne déclenche aucun son'));
      if (NAV === 'chromium' && tel) {
        // Un vrai doigt, posé sur l'étang puis glissé vers le haut (événements tactiles du navigateur). L'écran est rendu plus bas,
        // pour que la page dépasse : elle doit défiler jusqu'au bout, et l'onde naît quand même sous le doigt.
        const cdp = await ctx.newCDPSession(page);
        const glisse = async (x, y, dist) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }); for (let k = 1; k <= 10; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - dist * k / 10 }] }); await page.waitForTimeout(16); } await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(500); return page.evaluate(() => Math.round(scrollY)); };
        await page.setViewportSize({ width: 390, height: 430 }); await page.waitForTimeout(300); await page.evaluate(() => scrollTo(0, 0));
        const pt = await page.$eval('main.instant .etang-photo', e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height * .6), reste: document.documentElement.scrollHeight - innerHeight }; });
        let y1 = -1; try { y1 = await glisse(pt.x, pt.y, 160); } catch (e) { y1 = -2; }
        const sous = await eau();
        ok(pt.reste > 30 && y1 >= Math.min(60, pt.reste) - 2 && (sous.calque || sous.cercle >= 1), P('4. un doigt posé sur l’étang puis glissé vers le haut fait défiler la page, comme partout ailleurs (' + y1 + ' points sur ' + pt.reste + ' possibles), et l’onde naît quand même'));
        await page.setViewportSize(fmt.viewport); await page.waitForTimeout(300); await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(3600);
      }
      if (lit) {
        await page.click(D); ok(await attendEtat(page, D, 'on'), P('4. un geste, et l’instant d’écoute commence')); await page.waitForTimeout(2700);
        const i1 = await son(page); const bi = await bouton(page, D);
        ok(sons.join(',') === 'instant.mp3' && i1.actives === 1 && i1.dernier.offset === 0 && Math.abs(i1.dernier.dur - 40) < 0.5 && i1.volume > 0.85 && i1.rms > 0.001 && bi.texte === 'Revenir au silence', P('4. c’est le morceau court (40 s) qui joue, depuis son début, et le bouton propose « Revenir au silence » ' + JSON.stringify([sons, i1.dernier.dur, bi.texte])));
        ok(i1.ecran === 1, P('4. pendant l’instant d’écoute, l’écran reste allumé'));
        await page.click(D);
        const i2 = await silence(page);
        ok(i2.muet && (await bouton(page, D)).texte.startsWith('Écouter l’étang'), P('4. le même geste ramène le silence ' + dit(i2)));
        ok(i2.ecran === 0, P('4. et le téléphone retrouve sa mise en veille habituelle'));
        // quitter l'exercice coupe le son : par « Retour », puis par le SOS
        await page.click(D); await attendEtat(page, D, 'on'); await page.waitForTimeout(300);
        await page.click('.bar .back'); await page.waitForSelector(IB); await page.waitForTimeout(300);
        { const q = await silence(page); const reste = (await page.$$('.son-b')).length; ok(q.muet && reste === 0 && !(await page.$(IN)), P('4. « Retour » quitte l’étang et coupe le son ' + dit(q) + (reste ? ', le bouton du son est encore à l’écran' : ''))); }
        await page.click(IB); await page.waitForSelector(D); await page.waitForTimeout(500);
        ok((await bouton(page, D)).etat === 'off', P('4. en revenant sur l’étang, le son n’a pas repris tout seul'));
        await page.click(D); await attendEtat(page, D, 'on'); await page.waitForTimeout(300);
        await page.click('.bar .sos'); await page.waitForTimeout(500);
        { const q = await silence(page); ok(q.muet && (await page.$$('.son-b')).length === 0, P('4. le SOS coupe le son, et son écran est silencieux ' + dit(q))); }
        await page.click('.bar .back').catch(() => { }); await page.waitForTimeout(500);
        if (!(await page.$(D))) { if (!(await page.$(IB))) { await page.click(A('go', '[data-view="today"]')).catch(() => { }); await page.waitForSelector(IB); } await page.click(IB); await page.waitForSelector(D); await page.waitForTimeout(400); }
        if (tel && !COURT) {
          await page.click(D); await attendEtat(page, D, 'on');
          let fin = null; for (let i = 0; i < 180; i++) { const s = await son(page); if (s.actives === 0) { fin = s; break; } await page.waitForTimeout(250); }
          await page.waitForTimeout(300);
          ok(fin && fin.dernier.ended && fin.dernier.stop === null && Math.abs(fin.dernier.joue - fin.dernier.dur) < 0.6 && (await bouton(page, D)).etat === 'off', P('4. au bout de 40 secondes, l’instant s’éteint de lui-même et le bouton redevient « Écouter l’étang »'));
          ok((await son(page)).ecran === 0, P('4. une fois l’instant fini, l’écran n’est plus retenu'));
        }
      }
      // Avec « Réduire les animations » : l'étang se regarde, la phrase le dit, et rien ne bouge sous le doigt.
      {
        const c = await ouvre(fmt, { calme: true });
        await c.page.goto(APP, { waitUntil: 'domcontentloaded' }); await c.page.waitForSelector('.seuil .porte'); await c.page.waitForTimeout(300);
        await c.page.evaluate(() => document.querySelector('[data-act="entrer"][data-v="today"]').click()); await c.page.waitForSelector(IB); await c.page.waitForTimeout(400);
        await c.page.click(IB); await c.page.waitForSelector(IN + ' .etang'); await c.page.waitForTimeout(500);
        await c.page.evaluate(() => { const ph = document.querySelector('main.instant .etang-photo'), r = ph.getBoundingClientRect(); ph.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: r.left + r.width * .4, clientY: r.top + r.height * .7, button: 0, pointerId: 1, pointerType: 'touch' })); }); await c.page.waitForTimeout(400);
        const r = await c.page.evaluate(() => ({ aide: document.querySelector('main.instant .aide').textContent.replace(/\s+/g, ' ').trim(), calque: !!document.querySelector('main.instant canvas.eau'), cercle: document.querySelectorAll('.onde-doigt').length, reflet: document.querySelectorAll('.dose-reflet').length }));
        ok(r.aide === 'Regardez l’eau aussi longtemps que vous voulez. Ici, rien ne vous attend.' && !r.calque && r.cercle === 0 && c.errs.length === 0, P('4. avec « Réduire les animations », l’étang reste immobile sous le doigt, et la phrase ne promet pas de mouvement ' + JSON.stringify(r)));
        await c.ctx.close();
      }
      // les écrans qui doivent rester silencieux
      const muets = [];
      if (!(await page.$(IB))) { await page.click('.bar .back').catch(() => { }); await page.waitForSelector(IB, { timeout: 6000 }).catch(() => { }); }
      muets.push(['aujourd’hui', (await page.$$('.son-b')).length]);
      await page.click(accueilSel); await page.waitForSelector('main.intro'); await page.waitForTimeout(400); muets.push(['vitrine', (await page.$$('.son-b')).length]);
      await page.click('.seuil ' + A('porte', '[data-v="deposer"]')); await page.waitForSelector('main.deposer'); await page.waitForTimeout(300); muets.push(['dépôt', (await page.$$('.son-b')).length]);
      await page.click(A('go', '[data-view="sos"]')); await page.waitForTimeout(500); muets.push(['SOS', (await page.$$('.son-b')).length]);
      await page.goto(APP + 'fiches/le-coucher-et-la-nuit/'); await page.waitForSelector('main.fiche'); await page.waitForTimeout(300); muets.push(['fiche', (await page.$$('.son-b')).length]);
      ok(muets.every(m => m[1] === 0) && (await son(page)).actives === 0, P('4. « Aujourd’hui », la vitrine, le dépôt, le SOS et les fiches restent silencieux ' + JSON.stringify(muets)));
      ok(errs.length === 0, P('4. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 4. L'accueil à tout moment, « Reprendre mon parcours », et le sens de « Retour ».
    // =====================================================================================================================
    {
      const { ctx, page, errs, onglet } = await ouvre(fmt);
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.seuil .porte'); await page.waitForTimeout(300);
      // depuis la vitrine : Souffler, puis « Retour » ramène à la vitrine
      await page.click('.seuil ' + A('porte', '[data-v="souffle"]')); await page.waitForSelector('main.souffle.s-cours'); await page.waitForTimeout(400);
      await page.click('.souffle .bar .back'); await page.waitForTimeout(900);
      ok(!!(await page.$('main.intro .seuil')) && page.url() === APP + '#accueil' && (await page.$$('.seuil .porte')).length === 3, P('5. « Souffler » ouvert depuis la vitrine : « Retour » ramène à la vitrine (' + page.url().replace(ORIGIN, '') + ')'));
      // la vitrine entière est là : la table du carnet, les 3 entrées, l'histoire d'Antonio, la présentation du parcours
      const vit = await page.evaluate(() => ({ etang: !!document.querySelector('.seuil .fiche-b .fb-voir') && !!document.querySelector('.seuil .nature .sac'), portes: document.querySelectorAll('.seuil .porte').length, histoire: !!document.querySelector('.voice [data-act="peek-about"]'), parcours: !!document.querySelector('.acc-parcours .acc-mois'), mois: document.querySelectorAll('.acc-parcours .mois').length, liens: [...document.querySelectorAll('.seuil .voie')].map(e => e.textContent.trim()) }));
      ok(vit.etang && vit.portes === 3 && vit.histoire && vit.parcours && vit.mois === 6, P('5. la vitrine est complète : la table (le sac et la fiche de Bastien), les 3 entrées, l’histoire d’Antonio et les 6 mois du parcours ' + JSON.stringify(vit)));
      // la mise en forme de la vitrine n'a pas bougé : ses phrases d'introduction restent du texte courant, sans cadre ni fond
      // (le lien « Accueil » a porté un temps le même nom de classe qu'elles, et leur donnait son cadre)
      const intro = await page.evaluate(() => [...document.querySelectorAll('.view.intro .acc-h > p.acc-l')].map(p => { const c = getComputedStyle(p); return [c.display, c.borderTopWidth, c.backgroundColor, Math.round(parseFloat(c.lineHeight) / parseFloat(c.fontSize) * 100) / 100, c.fontWeight, c.borderRadius]; }));
      ok(intro.length >= 5 && intro.every(x => x[0] === 'block' && x[1] === '0px' && /rgba\(0, 0, 0, 0\)|transparent/.test(x[2]) && x[3] >= 1.4 && +x[4] < 700 && x[5] === '0px'), P('5. les phrases d’introduction de la vitrine restent du texte courant, sans cadre (' + intro.length + ' phrases) ' + JSON.stringify(intro[0])));
      await page.click('.seuil ' + A('entrer', '[data-v="today"]')); await page.waitForSelector('.tabs'); await page.waitForTimeout(600);
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
      ok(page.url() === APP + '#accueil' && !!(await page.$('.seuil .porte')), P('5. le logo mène à la vitrine'));
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
      const v2 = await page.evaluate(() => [...document.querySelectorAll('.seuil .voie')].map(e => e.textContent.trim()));
      ok(page.url() === APP + '#accueil' && v2.join('|') === 'Reprendre mon parcours|Ouvrir mon espace', P('5. « Accueil » depuis l’étape : la vitrine affiche « Reprendre mon parcours » ' + JSON.stringify(v2)));
      ok(await page.evaluate(() => scrollY === 0), P('5. la vitrine s’ouvre en haut de page'));
      await page.click('.seuil .voie' + A('step')); await page.waitForSelector('#note'); await page.waitForTimeout(700);
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
      ok(!!(await p2.$('.seuil .voie' + A('step'))), P('5. l’adresse de l’accueil ouvre la vitrine, et la page rechargée la garde'));
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
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.seuil .porte'); await page.waitForTimeout(300);
      await porteSouffle(page, '.seuil ' + A('porte', '[data-v="souffle"]')); await page.waitForTimeout(1500);
      ok(!(await page.$(B)) && (await attendMot(page, 'Inspirez')) === 'Inspirez', P('6. sans son calculé dans la page, la respiration ne propose pas de musique et guide en silence'));
      await page.click('.souffle .bar .back'); await page.waitForSelector('main.intro'); await page.waitForTimeout(300);
      await page.evaluate(() => document.querySelector('[data-act="entrer"][data-v="today"]').click()); await page.waitForSelector('.dose .instant-b'); await page.waitForTimeout(400);
      await page.click('.dose .instant-b'); await page.waitForSelector('main.instant ' + D); await page.waitForTimeout(500);
      await page.click(D); ok(await attendEtat(page, D, 'on'), P('6. pour l’instant d’écoute, sur l’étang, le lecteur ordinaire prend le relais')); await page.waitForTimeout(1500);
      const e1 = await son(page);
      ok(e1.contextes === 0 && e1.audios.length === 1 && !e1.audios[0].paused && e1.audios[0].src === 'instant.mp3' && e1.audios[0].t > 0.5 && sons.join(',') === 'instant.mp3', P('6. un seul lecteur joue le morceau de 40 secondes (' + (e1.audios[0] ? e1.audios[0].t.toFixed(2) : '?') + ' s)'));
      for (let i = 0; i < 6; i++) { await page.click(D); await page.waitForTimeout(45); } await page.waitForTimeout(900);
      const e2 = await son(page); const be = await bouton(page, D);
      ok(e2.audios.length === 1 && (be.etat === 'on') === !e2.audios[0].paused, P('6. après des pressions rapides, il n’y a toujours qu’un lecteur, et le bouton dit ce qu’il fait (' + be.etat + ')'));
      if (be.etat !== 'on') { await page.click(D); await attendEtat(page, D, 'on'); }
      await page.click('.bar .back'); await page.waitForSelector('.dose .instant-b'); await page.waitForTimeout(500);
      ok((await son(page)).audios[0].paused && !(await page.$('main.instant')), P('6. quitter l’étang coupe ce lecteur aussi'));
      ok(errs.length === 0, P('6. aucune erreur ' + errs.slice(0, 3).join(' | ')));
      await ctx.close();
    }

    // =====================================================================================================================
    // 6. Si le morceau ne peut pas se charger (réseau coupé), l'espace le dit et tout le reste continue.
    // =====================================================================================================================
    {
      const { ctx, page } = await ouvre(fmt);
      await ctx.route('**/son/*', r => r.abort());
      await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.seuil .porte'); await page.waitForTimeout(300);
      await page.click('.seuil ' + A('porte', '[data-v="souffle"]')); await page.waitForSelector('main.souffle.s-cours'); await page.waitForTimeout(1800);
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
