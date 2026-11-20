// Le film « Et vous ? » dans la version d'essai, comme le vivrait un parent :
//   - à l'arrivée sur l'accueil, rien du film n'est chargé à part sa petite image, et « Souffler 2 minutes » est là tout de suite ;
//   - la commande « Voir le film · 35 secondes » vient juste après les 3 portes ;
//   - au toucher, le lecteur s'ouvre et le MP4 se lit réellement (le bon fichier selon l'écran), avec le son ;
//   - lire, mettre en pause, couper et remettre le son, régler le volume, fermer, au doigt comme au clavier ;
//   - à la fermeture ou au retour arrière, plus aucune vidéo ne joue et le parent retrouve sa position sur l'accueil ;
//   - l'adresse …/#film ouvre le lecteur, qui attend le geste du parent.
//   - à la fin du film, un vrai bouton « Souffler 2 minutes » apparaît sous la vidéo : il ouvre l'exercice à son écran de départ, et le retour ramène à l'accueil ;
//   - l'export pour Instagram a son adresse, prêt au téléchargement, et le lecteur ne le charge jamais.
// usage : node film.js [--court]      (--court : sans regarder le film jusqu'au bout)
// Variables : PEPE_ORIGIN, PEPE_BASE, PEPE_NAV (chromium, firefox ou webkit), PEPE_CHROME,
//             PEPE_FILM (actif, pret ou absent : l'état attendu. Sans elle, l'essai constate l'état et le dit).
// Le son n'est pas écouté ici. L'essai vérifie que la vidéo avance, qu'elle n'est pas muette et que ses commandes répondent.
const pw = require('playwright');
const NAV = process.env.PEPE_NAV || 'chromium';
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8446';
const BASE = process.env.PEPE_BASE || '/essai/';
const APP = ORIGIN + BASE;
const COURT = process.argv.includes('--court');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
let n = 0, ko = 0; const notes = [];
const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC : ' + m); } };
const net = s => (s || '').split(String.fromCharCode(160)).join(' ').replace(/\s+/g, ' ').trim();
const FORMATS = [['téléphone', { viewport: { width: 390, height: 664 }, hasTouch: true, deviceScaleFactor: 2 }, 'vertical', [1080, 1920]], ['ordinateur', { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 }, 'horizontal', [1920, 1080]]];
const FICHIERS = ['et-vous-vertical.mp4', 'et-vous-horizontal.mp4', 'et-vous-raccord-5s.mp4'];
// La première version du film vertical (celle du 20 novembre à 4 heures, avant la correction de l'entrée dans « Souffler ») reste à sa propre adresse, pour comparer.
const GARDES = ['et-vous-vertical-version-1.mp4', 'et-vous-vertical-version-2.mp4', 'et-vous-horizontal-version-1.mp4', 'et-vous-horizontal-version-2.mp4'];
// V3 : les versions 2 (le film vertical du 20 novembre à 7 heures, et le film horizontal corrigé de la même manière) et la version 1 du film horizontal sont gardées de même.
// L'export vertical pour Instagram : il n'est pas dans le lecteur, il a seulement son adresse, pour être téléchargé.
const TELECHARGES = ['et-vous-instagram.mp4'];
// Ce que montre le lecteur, relevé dans la page
const etat = page => page.evaluate(() => {
  const l = document.getElementById('film-l'), v = l && l.querySelector('video'), q = s => l && l.querySelector(s), app = document.getElementById('app');
  return {
    ouvert: !!l, role: l ? l.getAttribute('role') + '/' + l.getAttribute('aria-modal') : '', titre: l && q('#film-t') ? q('#film-t').textContent : '',
    v: v ? { paused: v.paused, t: v.currentTime, d: v.duration, w: v.videoWidth, h: v.videoHeight, muted: v.muted, vol: v.volume, ended: v.ended, src: (v.currentSrc || v.getAttribute('src') || '').replace(/^.*\/film\//, '').replace(/\?.*$/, ''), rs: v.readyState, err: v.error ? v.error.code : 0, inline: v.hasAttribute('playsinline'), pre: v.getAttribute('preload') } : null,
    j: q('#film-j') ? q('#film-j').getAttribute('aria-label') : '', s: q('#film-s') ? (q('#film-s').getAttribute('aria-label') || q('#film-s').textContent.trim()) : '',
    // le bouton du son tel qu'on le voit : ses mots écrits, sa taille, sa couleur de fond, et s'il tient dans l'écran
    son: (() => { const b = q('#film-s'); if (!b) return null; const r = b.getBoundingClientRect(), c = getComputedStyle(b); return { mots: (b.innerText || '').trim(), l: Math.round(r.width), h: Math.round(r.height), fond: c.backgroundColor, encre: c.color, taille: parseFloat(c.fontSize), dans: r.left >= 0 && r.top >= 0 && r.right <= innerWidth + .5 && r.bottom <= innerHeight + .5, pressed: b.hasAttribute('aria-pressed') }; })(),
    // la suite, quand le film est fini : le bouton « Souffler 2 minutes » sous la vidéo
    suite: (() => { const d = q('#film-suite'), b = d && d.querySelector('button'); if (!d || !b || !v) return null; const r = b.getBoundingClientRect(), rv = v.getBoundingClientRect(), c = getComputedStyle(b); return { vue: !d.hidden && r.height > 0, balise: b.tagName, type: b.getAttribute('type'), mots: (b.innerText || '').trim(), l: Math.round(r.width), h: Math.round(r.height), sous: r.top >= rv.bottom - 1, dans: r.left >= 0 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1, fond: c.backgroundColor, video: [Math.round(rv.width), Math.round(rv.height)] }; })(),
    fin: q('#film-fin') ? q('#film-fin').textContent : '', ecoute: (() => { const b = document.querySelector('main.souffle .souffle-a'); return b ? b.innerText.replace(/\s+/g, ' ').trim() : ''; })(), mot: (document.getElementById('souffle-mot') || {}).textContent || '',
    go: !!(q('.film-go') && !q('.film-go').hidden), msg: q('.film-etat') && !q('.film-etat').hidden ? q('.film-etat').textContent : '', volVisible: !!(q('#film-vol') && !q('#film-vol').hidden),
    dedans: !!(l && l.contains(document.activeElement)), foyer: document.activeElement ? (document.activeElement.id || document.activeElement.className || document.activeElement.tagName) : '',
    inerte: !!(app && app.inert), videos: document.querySelectorAll('video').length, y: Math.round(window.scrollY), url: location.pathname + location.hash, vue: (document.querySelector('main') || {}).className || ''
  };
});
const joue = (page, apres = 1, delai = 40000) => page.waitForFunction(t => { const v = document.querySelector('#film-l video'); return !!v && !v.paused && v.currentTime > t; }, apres, { timeout: delai }).then(() => true, () => false);
// Va à la dernière seconde du film et le laisse finir : rend vrai quand le film est arrivé au bout.
const auBout = page => page.evaluate(() => new Promise(r => { const v = document.querySelector('#film-l video'); if (!v) return r(false); if (v.ended) return r(true); v.addEventListener('ended', () => r(true), { once: true }); try { v.currentTime = Math.max(0, (v.duration > 0 ? v.duration : 35) - 1); const p = v.play(); if (p && p.catch) p.catch(() => { }); } catch (e) { } setTimeout(() => r(v.ended), 15000); }));
const attend = (page, f, arg, delai = 8000) => page.waitForFunction(f, arg, { timeout: delai }).then(() => true, () => false);

(async () => {
  const LOCAL = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
  const exe = NAV === 'chromium' ? (process.env.PEPE_CHROME || (require('fs').existsSync(LOCAL) ? LOCAL : undefined)) : undefined;
  const lance = { chromium: { args: ['--ignore-certificate-errors', '--autoplay-policy=user-gesture-required'] }, firefox: {}, webkit: {} }[NAV];
  // Sur la machine de GitHub, Google Chrome est installé : on le préfère au Chromium de l'outil d'essai, parce que c'est lui que les gens utilisent.
  let browser = null, quelNav = NAV;
  if (NAV === 'chromium' && !exe && !process.env.PEPE_SANS_CHROME && require('fs').existsSync('/usr/bin/google-chrome')) {
    try { browser = await pw.chromium.launch(Object.assign({}, lance, { channel: 'chrome' })); quelNav = 'Google Chrome'; } catch (e) { browser = null; }
  }
  if (!browser) browser = await pw[NAV].launch(Object.assign({}, lance, exe ? { executablePath: exe } : {}));
  notes.push('navigateur : ' + quelNav + ' ' + browser.version());
  const erreurs = [];
  const ouvre = async fmt => {
    const f = Object.assign({}, fmt); if (NAV === 'chromium' && f.hasTouch) f.isMobile = true;
    const ctx = await browser.newContext(Object.assign({ locale: 'fr-CH', ignoreHTTPSErrors: true }, f));
    const page = await ctx.newPage(); const demandes = [];
    page.on('request', r => { const u = r.url(); if (/\/film\//.test(u)) demandes.push(u.replace(/^.*\/film\//, '').replace(/\?.*$/, '')); });
    page.on('pageerror', e => erreurs.push(String(e).slice(0, 200)));
    return { ctx, page, demandes };
  };

  // ----- 0. L'état du film dans cette version : la commande est-elle sur l'accueil, le lecteur répond-il à son adresse ?
  let mode = process.env.PEPE_FILM || '';
  { const { ctx, page } = await ouvre(FORMATS[0][1]);
    await page.goto(APP); await page.waitForSelector('.seuil .portes');
    const cmd = !!(await page.$(A('film')));
    await page.goto(APP + '#film'); await page.waitForSelector('.seuil .portes'); await page.waitForTimeout(600);
    const lecteur = !!(await page.$('#film-l'));
    const vu = cmd ? 'actif' : (lecteur ? 'pret' : 'absent');
    if (mode) ok(vu === mode, '0. état du film attendu « ' + mode + ' », constaté « ' + vu + ' »'); else { mode = vu; }
    if (vu !== 'absent') ok(lecteur, '0. l’adresse …/#film, ouverte alors que l’accueil est déjà affiché, ouvre aussi le lecteur');
    notes.push('état du film dans cette version : ' + vu + (vu === 'pret' ? ' (le lecteur répond à l’adresse …/#film, la commande n’est pas encore sur l’accueil)' : vu === 'actif' ? ' (la commande est sur l’accueil)' : ' (ni commande ni lecteur)'));
    await ctx.close(); }

  // ----- 1. Les fichiers, tels que le serveur les donne
  const api = await pw.request.newContext({ ignoreHTTPSErrors: true });
  if (mode === 'absent') {
    for (const f of FICHIERS.concat(GARDES, TELECHARGES)) { const r = await api.get(APP + 'film/' + f, { headers: { Range: 'bytes=0-1023', 'Accept-Encoding': 'identity' } }).catch(() => null); ok(r && r.status() === 404, '1. sans film, ' + f + ' n’existe pas ' + (r ? r.status() : 'pas de réponse')); }
  } else {
    const poids = [];
    for (const f of FICHIERS) {
      // Comme un lecteur vidéo, on demande un morceau du fichier tel quel, sans compression. (L'outil d'essai, laissé à ses réglages, accepte une réponse
      // compressée : le serveur du site lui envoie alors le fichier entier, avec le code 200. Un navigateur ne demande jamais une vidéo ainsi.)
      const r = await api.get(APP + 'film/' + f, { headers: { Range: 'bytes=0-1023', 'Accept-Encoding': 'identity' } }).catch(() => null);
      const h = r ? r.headers() : {}; const total = Number((/\/(\d+)$/.exec(h['content-range'] || '') || [])[1] || 0);
      ok(r && r.status() === 206 && /^video\/mp4/.test(h['content-type'] || '') && total > 500000 && (await r.body()).length === 1024,
        '1. ' + f + ' : le serveur donne un morceau du fichier (206), annoncé comme video/mp4 ' + JSON.stringify([r && r.status(), h['content-type'], h['content-range']]));
      poids.push(f.replace('et-vous-', '').replace('.mp4', '') + ' ' + (total / 1048576).toFixed(1) + ' Mo');
    }
    for (const f of GARDES) {
      const r = await api.get(APP + 'film/' + f, { headers: { Range: 'bytes=0-1023', 'Accept-Encoding': 'identity' } }).catch(() => null); const h = r ? r.headers() : {};
      ok(r && r.status() === 206 && /^video\/mp4/.test(h['content-type'] || ''), '1. ' + f + ' : la version gardée pour comparer répond à sa propre adresse ' + JSON.stringify([r && r.status(), h['content-type'], h['content-range']]));
    }
    for (const f of TELECHARGES) {
      const r = await api.get(APP + 'film/' + f, { headers: { Range: 'bytes=0-1023', 'Accept-Encoding': 'identity' } }).catch(() => null); const h = r ? r.headers() : {}; const total = Number((/\/(\d+)$/.exec(h['content-range'] || '') || [])[1] || 0);
      ok(r && r.status() === 206 && /^video\/mp4/.test(h['content-type'] || '') && total > 5000000, '1. ' + f + ' : l’export pour Instagram répond à son adresse, prêt au téléchargement ' + JSON.stringify([r && r.status(), h['content-type'], h['content-range']]));
      poids.push('export Instagram ' + (total / 1048576).toFixed(1) + ' Mo');
    }
    for (const f of ['apercu.webp', 'affiche-verticale.webp', 'affiche-horizontale.webp']) {
      const r = await api.get(APP + 'film/' + f).catch(() => null); const b = r && r.ok() ? await r.body() : Buffer.alloc(0);
      ok(r && r.status() === 200 && /^image\/webp/.test(r.headers()['content-type'] || '') && b.length > 2000 && (f !== 'apercu.webp' || b.length < 20000), '1. ' + f + ' : image servie, légère ' + JSON.stringify([r && r.status(), r && r.headers()['content-type'], b.length]));
      if (f === 'apercu.webp') poids.push('image d’aperçu ' + (b.length / 1024).toFixed(1) + ' ko');
    }
    notes.push('fichiers en ligne : ' + poids.join(', '));
  }
  await api.dispose();

  let lectureVraie = 0, lectureAttendue = 0; const lues = [];
  for (const [nom, fmt, quel, taille] of FORMATS) {
    const P = m => nom + ' : ' + m;
    // ----- 2. L'arrivée sur l'accueil
    const { ctx, page, demandes } = await ouvre(fmt);
    await page.goto(APP); await page.waitForSelector('.seuil .portes'); await page.waitForTimeout(900);
    const peut = await page.evaluate(() => document.createElement('video').canPlayType('video/mp4; codecs="avc1.640028, mp4a.40.2"'));
    const arr = await page.evaluate(() => {
      const s = document.querySelector('.seuil [data-act="porte"][data-v="souffle"]'), r = s ? s.getBoundingClientRect() : null, c = document.querySelector('[data-act="film"]'), p = document.querySelector('.seuil .portes');
      const rc = c ? c.getBoundingClientRect() : null, img = c ? c.querySelector('img') : null;
      return { souffle: r ? [Math.round(r.top), Math.round(r.bottom), innerHeight] : null, cmd: !!c, apres: !!(c && p && p.nextElementSibling === c), balise: c ? c.tagName : '', texte: c ? c.innerText : '', nomAcc: c ? c.getAttribute('aria-label') : '',
        haut: rc ? Math.round(rc.height) : 0, larg: rc ? Math.round(rc.width) : 0, img: img ? [img.complete, img.naturalWidth, img.getAttribute('loading'), img.getAttribute('alt')] : null, videos: document.querySelectorAll('video').length, lecteur: !!document.getElementById('film-l'), y: Math.round(scrollY) };
    });
    ok(arr.souffle && arr.souffle[0] >= 0 && arr.souffle[1] <= arr.souffle[2] && arr.y === 0, P('2. « Souffler 2 minutes » est à l’écran dès l’arrivée, sans faire défiler ' + JSON.stringify(arr.souffle)));
    ok(arr.videos === 0 && !arr.lecteur, P('2. aucune vidéo dans la page tant que le parent n’a rien demandé ' + JSON.stringify([arr.videos, arr.lecteur])));
    if (mode === 'actif') {
      ok(arr.cmd && arr.apres && arr.balise === 'BUTTON', P('2. la commande du film vient juste après les 3 portes ' + JSON.stringify([arr.cmd, arr.apres, arr.balise])));
      ok(net(arr.texte) === 'Voir le film · 35 secondes' && arr.nomAcc === 'Voir le film, 35 secondes', P('2. son libellé ' + JSON.stringify([net(arr.texte), arr.nomAcc])));
      ok(arr.haut >= 44 && arr.larg >= 200, P('2. elle se touche facilement ' + JSON.stringify([arr.larg, arr.haut])));
      // l'image d'aperçu est demandée quand elle approche de l'écran : on y va, puis on revient en haut
      await page.evaluate(() => document.querySelector('[data-act="film"]').scrollIntoView({ block: 'center' })); await attend(page, () => { const i = document.querySelector('[data-act="film"] img'); return i && i.complete && i.naturalWidth > 0; }); await page.evaluate(() => window.scrollTo(0, 0));
      const img = await page.evaluate(() => { const i = document.querySelector('[data-act="film"] img'); return [i.complete, i.naturalWidth, i.getAttribute('loading'), i.getAttribute('alt')]; });
      ok(img[0] && img[1] === 336 && img[2] === 'lazy' && img[3] === '', P('2. son image d’aperçu s’affiche, chargée à la demande du navigateur ' + JSON.stringify(img)));
      ok(demandes.every(u => u === 'apercu.webp') && demandes.length >= 1, P('2. du film, seule la petite image est demandée à l’arrivée ' + JSON.stringify(demandes)));
    } else {
      ok(!arr.cmd, P('2. la commande du film n’est pas sur l’accueil (état « ' + mode + ' ») ' + arr.cmd));
      ok(demandes.length === 0, P('2. rien du film n’est demandé à l’arrivée ' + JSON.stringify(demandes)));
    }

    if (mode === 'actif') {
      // ----- 3. Le parent touche « Voir le film »
      await page.evaluate(() => window.scrollTo(0, 150)); await page.waitForTimeout(250);
      const y0 = await page.evaluate(() => Math.round(scrollY)), url0 = await page.evaluate(() => location.pathname + location.hash);
      demandes.length = 0;
      await page.click(A('film')); await page.waitForSelector('#film-l');
      let e = await etat(page);
      ok(e.ouvert && e.role === 'dialog/true' && net(e.titre).indexOf('Et vous ?') === 0, P('3. le lecteur s’ouvre, annoncé comme une fenêtre ' + JSON.stringify([e.role, net(e.titre)])));
      ok(e.dedans && e.inerte, P('3. le clavier est dans le lecteur, et l’accueil ne répond plus dessous ' + JSON.stringify([e.dedans, e.foyer, e.inerte])));
      ok(e.v && e.v.inline && e.v.pre === 'none', P('3. la vidéo reste dans la page (pas de plein écran imposé sur iPhone) ' + JSON.stringify(e.v && [e.v.inline, e.v.pre])));
      ok(e.y === y0, P('3. l’accueil n’a pas bougé dessous ' + JSON.stringify([y0, e.y])));
      lectureAttendue++;
      if (!peut) {
        const vu = await attend(page, () => { const p = document.querySelector('#film-l .film-etat'); return p && !p.hidden && /ne peut pas être lu/.test(p.textContent); }, null, 15000);
        e = await etat(page);
        ok(vu && /Ouvrir le fichier du film/.test(e.msg), P('3. ce navigateur d’essai ne sait pas lire ce format : le lecteur le dit et propose le fichier ' + JSON.stringify(e.msg)));
        notes.push(nom + ' : ce navigateur d’essai ne lit pas le H.264, la lecture réelle n’a pas pu y être vérifiée');
      } else {
        const lu = await joue(page, 1.2); e = await etat(page);
        ok(lu, P('3. le film se lit réellement : la vidéo avance ' + JSON.stringify(e.v && [e.v.paused, Math.round(e.v.t * 10) / 10, e.v.rs, e.v.err, e.msg])));
        ok(e.v && e.v.src === 'et-vous-' + quel + '.mp4' && e.v.w === taille[0] && e.v.h === taille[1], P('3. c’est le film ' + quel + ', en ' + taille.join(' × ') + ' ' + JSON.stringify(e.v && [e.v.src, e.v.w, e.v.h])));
        ok(e.v && Math.abs(e.v.d - 35) < .25, P('3. il dure 35 secondes ' + (e.v && e.v.d)));
        ok(e.v && e.v.muted, P('3. il démarre en silence ' + JSON.stringify(e.v && [e.v.muted, e.v.vol])));
        ok(e.s === 'Activer le son' && e.son && e.son.mots === 'Activer le son' && e.son.h >= 44 && e.son.l >= 150 && e.son.taille >= 15 && e.son.fond === 'rgb(244, 239, 216)' && e.son.encre === 'rgb(7, 36, 15)' && e.son.dans && !e.son.pressed, P('3. « Activer le son » est écrit en toutes lettres sur un bouton clair, bien visible ' + JSON.stringify([e.s, e.son])));
        ok(!e.volVisible, P('3. tant que le film est muet, il n’y a pas de curseur de volume'));
        ok(!e.go && e.j === 'Mettre en pause' && !e.msg, P('3. le bouton dit « Mettre en pause » ' + JSON.stringify([e.go, e.j, e.msg])));
        ok(demandes.includes('et-vous-' + quel + '.mp4') && !demandes.includes('et-vous-' + (quel === 'vertical' ? 'horizontal' : 'vertical') + '.mp4') && !demandes.includes('et-vous-raccord-5s.mp4') && !demandes.some(d => /version-|instagram/.test(d)), P('3. un seul film est chargé, celui de cet écran ' + JSON.stringify(demandes)));
        if (lu) { lectureVraie++; lues.push(quel + ' ' + (e.v ? e.v.w + ' × ' + e.v.h : '')); }
        // ----- 4. Pause, reprise, son
        await page.click('#film-j'); await attend(page, () => document.querySelector('#film-l video').paused); e = await etat(page); const tPause = e.v.t;
        await page.waitForTimeout(700); const e2 = await etat(page);
        ok(e.v.paused && e.j === 'Reprendre le film' && Math.abs(e2.v.t - tPause) < .05, P('4. « Mettre en pause » arrête l’image et le son ' + JSON.stringify([e.v.paused, e.j, tPause, e2.v.t])));
        await page.click('#film-j'); const repris = await joue(page, tPause + .4, 15000); e = await etat(page);
        ok(repris && e.j === 'Mettre en pause', P('4. « Reprendre le film » repart où il en était ' + JSON.stringify([repris, e.j])));
        await page.click('#film-s'); e = await etat(page);
        ok(!e.v.muted && e.v.vol > 0 && e.s === 'Couper le son' && e.son.mots === '' && !e.v.paused, P('4. « Activer le son » met le son, sans arrêter le film. Le bouton devient « Couper le son » ' + JSON.stringify([e.v.muted, e.v.vol, e.s, e.v.paused])));
        const volPossible = await page.evaluate(() => { const v = document.createElement('video'); try { v.volume = .5; return Math.abs(v.volume - .5) < .01; } catch (x) { return false; } });
        ok(e.volVisible === volPossible, P('4. avec le son, le curseur du volume est là quand l’appareil laisse la page le régler ' + JSON.stringify([e.volVisible, volPossible])));
        await page.click('#film-s'); e = await etat(page);
        ok(e.v.muted && e.s === 'Activer le son' && e.son.mots === 'Activer le son' && !e.volVisible, P('4. « Couper le son » le coupe, et le bouton clair « Activer le son » revient ' + JSON.stringify([e.v.muted, e.s, e.volVisible])));
        await page.click('#film-s'); e = await etat(page);
        ok(!e.v.muted && e.s === 'Couper le son', P('4. le son revient au toucher suivant ' + JSON.stringify([e.v.muted, e.s])));
        if (e.volVisible) {
          await page.evaluate(() => { const r = document.querySelector('#film-vol'); r.value = '40'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(150); e = await etat(page);
          ok(Math.abs(e.v.vol - .4) < .02 && !e.v.muted, P('4. le curseur règle le volume ' + JSON.stringify([e.v.vol, e.v.muted])));
          await page.evaluate(() => { const r = document.querySelector('#film-vol'); r.value = '100'; r.dispatchEvent(new Event('input', { bubbles: true })); });
        } else notes.push(nom + ' : ce navigateur ne laisse pas la page régler le volume, le curseur est retiré (comme sur iPhone)');
        // le clavier : la touche Tab fait le tour des commandes sans sortir du lecteur
        let tour = true; const vus = new Set();
        for (let k = 0; k < 7; k++) { await page.keyboard.press('Tab'); const s = await etat(page); if (!s.dedans) tour = false; vus.add(s.foyer); }
        ok(tour && vus.size >= 3, P('4. au clavier, Tab fait le tour des commandes sans quitter le lecteur ' + JSON.stringify([...vus])));
      }
      // ----- 5. Fermer : le son s'arrête, l'accueil est à la même place
      await page.click('#film-l [data-film="fermer"]'); await attend(page, () => !document.getElementById('film-l')); await page.waitForTimeout(350);
      e = await etat(page);
      ok(!e.ouvert && e.videos === 0, P('5. « Fermer » retire le lecteur, plus aucune vidéo ne joue ' + JSON.stringify([e.ouvert, e.videos])));
      ok(e.y === y0 && e.url === url0 && /intro/.test(e.vue), P('5. le parent retrouve sa position sur l’accueil ' + JSON.stringify([y0, e.y, e.url, e.vue])));
      ok(!e.inerte && /film-cmd/.test(e.foyer), P('5. l’accueil répond de nouveau, le clavier revient sur la commande ' + JSON.stringify([e.inerte, e.foyer])));
      // ----- 6. Le bouton Retour du téléphone
      await page.click(A('film')); await page.waitForSelector('#film-l'); if (peut) await joue(page, .6, 20000);
      e = await etat(page);
      ok(e.v && e.v.muted && e.s === 'Activer le son' && !e.volVisible, P('6. rouvert, le film repart en silence, même si le son était activé à la fermeture ' + JSON.stringify(e.v && [e.v.muted, e.s, e.volVisible])));
      await page.goBack().catch(() => { }); await attend(page, () => !document.getElementById('film-l')); await page.waitForTimeout(350);
      e = await etat(page);
      ok(!e.ouvert && e.videos === 0, P('6. le retour arrière ferme le lecteur et arrête le son ' + JSON.stringify([e.ouvert, e.videos])));
      ok(e.y === y0 && e.url === url0 && /intro/.test(e.vue) && !e.inerte, P('6. après le retour arrière, l’accueil est à la même place ' + JSON.stringify([y0, e.y, e.url, e.vue, e.inerte])));
      // la touche Échap ferme aussi
      await page.click(A('film')); await page.waitForSelector('#film-l'); await page.keyboard.press('Escape'); await attend(page, () => !document.getElementById('film-l')); await page.waitForTimeout(300);
      e = await etat(page);
      ok(!e.ouvert && e.videos === 0 && e.y === y0, P('6. la touche Échap ferme le lecteur ' + JSON.stringify([e.ouvert, e.videos, e.y])));
      // ----- 7. Jusqu'au bout, une fois (au format téléphone)
      if (peut && !COURT && nom === 'téléphone') {
        await page.click(A('film')); await page.waitForSelector('#film-l'); await joue(page, .6, 20000); await page.click('#film-s');
        const fini = await attend(page, () => { const v = document.querySelector('#film-l video'); return v && v.ended; }, null, 70000); e = await etat(page);
        ok(fini && e.j === 'Revoir le film' && e.v.t > 34.5, P('7. le film va jusqu’au bout, puis le bouton propose « Revoir le film » ' + JSON.stringify([fini, e.j, e.v && e.v.t])));
        await page.click('#film-j'); const rejoue = await attend(page, () => { const v = document.querySelector('#film-l video'); return v && !v.paused && !v.ended && v.currentTime > .3 && v.currentTime < 6; }, null, 15000);
        ok(rejoue, P('7. « Revoir le film » le relance depuis le début'));
        e = await etat(page);
        ok(!e.v.muted && e.s === 'Couper le son', P('7. « Revoir le film » garde le son que le parent avait activé ' + JSON.stringify([e.v.muted, e.s])));
        await page.click('#film-l [data-film="fermer"]'); await attend(page, () => !document.getElementById('film-l'));
      }
      // ----- 7 bis. La fin du film : sous la vidéo, un vrai bouton « Souffler 2 minutes »
      if (peut) {
        await page.evaluate(y => window.scrollTo(0, y), y0); await page.waitForTimeout(200);
        await page.click(A('film')); await page.waitForSelector('#film-l'); await joue(page, .6, 20000);
        e = await etat(page); const videoAvant = e.suite && e.suite.video;
        ok(e.suite && !e.suite.vue && e.fin === '', P('7. pendant le film, le bouton « Souffler 2 minutes » n’est pas là ' + JSON.stringify(e.suite && [e.suite.vue, e.fin])));
        let fini2 = await auBout(page); await page.waitForTimeout(700); e = await etat(page);
        ok(fini2 && e.v.ended && e.suite && e.suite.vue && e.j === 'Revoir le film', P('7. à la fin du film, le bouton apparaît, à côté de « Revoir le film » ' + JSON.stringify([fini2, e.v && e.v.ended, e.suite && e.suite.vue, e.j])));
        ok(e.suite && e.suite.balise === 'BUTTON' && e.suite.type === 'button' && e.suite.mots === 'Souffler 2 minutes', P('7. c’est un vrai bouton, écrit « Souffler 2 minutes » ' + JSON.stringify(e.suite && [e.suite.balise, e.suite.type, e.suite.mots])));
        ok(e.suite && e.suite.h >= 44 && e.suite.l >= 200 && e.suite.sous && e.suite.dans && e.suite.fond === 'rgb(244, 239, 216)', P('7. il est sous la vidéo, clair, large, entièrement dans l’écran ' + JSON.stringify(e.suite)));
        ok(/Souffler 2 minutes/.test(e.fin) && /terminé/.test(e.fin), P('7. la fin du film et ce bouton sont annoncés à la personne qui ne voit pas l’écran ' + JSON.stringify(e.fin)));
        notes.push(nom + ' : à la fin, la vidéo fait de la place au bouton (' + (videoAvant || []).join(' × ') + ' puis ' + (e.suite ? e.suite.video.join(' × ') : '') + ' points), bouton de ' + (e.suite ? e.suite.l + ' × ' + e.suite.h : '') + ' points');
        await page.click('#film-j'); await attend(page, () => { const v = document.querySelector('#film-l video'); return v && !v.ended && !v.paused && v.currentTime < 6; }, null, 15000); e = await etat(page);
        ok(e.suite && !e.suite.vue && e.fin === '', P('7. « Revoir le film » retire le bouton, le temps du film ' + JSON.stringify(e.suite && [e.suite.vue, e.fin])));
        fini2 = await auBout(page); await page.waitForTimeout(500);
        let atteint = false; for (let k = 0; k < 8 && !atteint; k++) { await page.keyboard.press('Tab'); atteint = await page.evaluate(() => !!(document.activeElement && document.activeElement.getAttribute('data-film') === 'souffle')); }
        ok(fini2 && atteint, P('7. au clavier, Tab atteint le bouton « Souffler 2 minutes » ' + JSON.stringify([fini2, atteint])));
        // le parent touche le bouton : le lecteur se ferme, l'exercice s'ouvre à son écran de départ, en silence
        await page.click('#film-l [data-film="souffle"]');
        let ex = await attend(page, () => !document.getElementById('film-l') && !!document.querySelector('main.souffle.s-cours') && /Installez-vous/.test((document.getElementById('souffle-mot') || {}).textContent || ''), null, 8000);
        await page.waitForTimeout(400); e = await etat(page);
        ok(ex && !e.ouvert && e.videos === 0 && !e.inerte && /souffle s-cours/.test(e.vue) && net(e.mot) === 'Installez-vous', P('7. le bouton ferme le lecteur et ouvre l’exercice à son écran de départ, « Installez-vous » ' + JSON.stringify([ex, e.ouvert, e.videos, e.inerte, e.vue, e.mot])));
        ok(/Écouter l’étang/.test(e.ecoute) && /Pause/.test(e.ecoute), P('7. l’exercice commence en silence, comme par la porte de l’accueil ' + JSON.stringify(e.ecoute)));
        ok(e.y === 0, P('7. l’exercice s’ouvre en haut de son écran ' + e.y));
        // le bouton Retour du téléphone ramène à l'accueil, à l'endroit où le parent l'avait laissé
        await page.goBack().catch(() => { }); let acc = await attend(page, () => !!document.querySelector('main.intro') && !document.querySelector('main.souffle'), null, 8000); await page.waitForTimeout(600); e = await etat(page);
        ok(acc && !e.ouvert && e.videos === 0 && /intro/.test(e.vue) && e.url.replace(/#accueil$/, '') === url0.replace(/#accueil$/, '') && Math.abs(e.y - y0) <= 2, P('7. depuis l’exercice, le retour arrière ramène à l’accueil, à la même place ' + JSON.stringify([acc, e.ouvert, e.vue, e.url, url0, e.y, y0])));
        ok(!!(await page.$(A('film'))) && !!(await page.$('.seuil ' + A('porte', '[data-v="souffle"]'))), P('7. l’accueil a toujours ses portes et la commande du film'));
        // une seconde fois, avec le bouton « Retour » écrit en haut de l'exercice
        await page.click(A('film')); await page.waitForSelector('#film-l'); await joue(page, .6, 20000); await auBout(page); await page.waitForTimeout(500);
        await page.click('#film-l [data-film="souffle"]'); ex = await attend(page, () => !document.getElementById('film-l') && !!document.querySelector('main.souffle.s-cours'), null, 8000); await page.waitForTimeout(400);
        await page.click('main.souffle ' + A('back')); acc = await attend(page, () => !!document.querySelector('main.intro') && !document.querySelector('main.souffle'), null, 8000); await page.waitForTimeout(600); e = await etat(page);
        ok(ex && acc && /intro/.test(e.vue) && !e.ouvert && e.videos === 0, P('7. le bouton « Retour » de l’exercice ramène aussi à l’accueil ' + JSON.stringify([ex, acc, e.vue, e.url, e.y])));
      }
      // ----- 8. « Souffler » répond toujours, tout de suite après
      await page.evaluate(() => window.scrollTo(0, 0)); await page.click('.seuil ' + A('porte', '[data-v="souffle"]'));
      const souffle = await attend(page, () => !!document.querySelector('main.souffle'), null, 8000);
      ok(souffle, P('8. après le film, « Souffler 2 minutes » ouvre la respiration au premier toucher'));
    }
    await ctx.close();

    // ----- 9. L'adresse …/#film : le lecteur est là, il attend
    if (mode !== 'absent') {
      const { ctx: c2, page: p2, demandes: d2 } = await ouvre(fmt);
      await p2.goto(APP + '#film'); await p2.waitForSelector('#film-l'); await p2.waitForTimeout(900);
      let e = await etat(p2);
      ok(e.ouvert && e.v && e.v.paused && !(e.v.t > 0) && e.go && /film-go/.test(e.foyer), P('9. par son adresse, le lecteur s’ouvre et attend : rien ne joue ' + JSON.stringify([e.ouvert, e.v && e.v.paused, e.v && e.v.t, e.go, e.foyer])));
      ok(!d2.some(u => /\.mp4$/.test(u)), P('9. la vidéo n’est pas chargée tant que le parent n’a pas touché « Lire le film » ' + JSON.stringify(d2)));
      ok(/intro/.test(e.vue), P('9. l’accueil est dessous ' + e.vue));
      const peut2 = await p2.evaluate(() => document.createElement('video').canPlayType('video/mp4; codecs="avc1.640028, mp4a.40.2"'));
      await p2.click('#film-l .film-go');
      if (peut2) {
        if (mode === 'pret') lectureAttendue++;
        const lu = await joue(p2, 1.2); e = await etat(p2);
        ok(lu && e.v.src === 'et-vous-' + quel + '.mp4' && e.v.w === taille[0] && e.v.h === taille[1] && e.v.muted && e.s === 'Activer le son', P('9. « Lire le film » le lance, en silence : le film ' + quel + ' se lit réellement ' + JSON.stringify(e.v && [e.v.paused, Math.round(e.v.t * 10) / 10, e.v.src, e.v.w, e.v.h, e.v.muted, e.v.err, e.msg])));
        if (lu && mode === 'pret') { lectureVraie++; lues.push(quel + ' ' + e.v.w + ' × ' + e.v.h); }
        await p2.click('#film-j'); await attend(p2, () => document.querySelector('#film-l video').paused); e = await etat(p2);
        ok(e.v.paused && e.j === 'Reprendre le film', P('9. la pause répond ' + JSON.stringify([e.v.paused, e.j])));
      } else if (mode === 'pret') { lectureAttendue++; notes.push(nom + ' : ce navigateur d’essai ne lit pas le H.264, la lecture réelle n’a pas pu y être vérifiée'); }
      if (peut2) {
        // la fin du film, quand le lecteur a été ouvert par son adresse : le bouton ouvre l'exercice, et le retour ramène à l'accueil, sans rouvrir le lecteur
        const fini9 = await auBout(p2); await p2.waitForTimeout(600); e = await etat(p2);
        ok(fini9 && e.suite && e.suite.vue && e.suite.mots === 'Souffler 2 minutes', P('9. à la fin du film, le bouton « Souffler 2 minutes » est là aussi ' + JSON.stringify([fini9, e.suite && e.suite.vue])));
        await p2.click('#film-l [data-film="souffle"]'); const ex9 = await attend(p2, () => !document.getElementById('film-l') && !!document.querySelector('main.souffle.s-cours'), null, 8000); await p2.waitForTimeout(400);
        await p2.goBack().catch(() => { }); const acc9 = await attend(p2, () => !!document.querySelector('main.intro') && !document.querySelector('main.souffle'), null, 8000); await p2.waitForTimeout(700); e = await etat(p2);
        ok(ex9 && acc9 && /intro/.test(e.vue) && !e.ouvert && e.videos === 0 && !e.inerte, P('9. il ouvre l’exercice, et le retour arrière ramène à l’accueil, lecteur fermé ' + JSON.stringify([ex9, acc9, e.vue, e.ouvert, e.videos, e.url])));
        await p2.goto(APP + '#film'); await p2.waitForSelector('#film-l'); await p2.waitForTimeout(500);
      }
      await p2.click('#film-l [data-film="fermer"]'); await attend(p2, () => !document.getElementById('film-l')); e = await etat(p2);
      ok(!e.ouvert && e.videos === 0 && !e.inerte && /intro/.test(e.vue), P('9. « Fermer » rend l’accueil ' + JSON.stringify([e.ouvert, e.videos, e.inerte, e.vue])));
      await c2.close();
      // ----- 10. Un parent déjà entré dans son espace ouvre l'adresse du film : il voit l'accueil, et le lecteur par-dessus
      if (nom === 'téléphone') {
        const { ctx: c3, page: p3 } = await ouvre(fmt);
        await p3.goto(APP); await p3.waitForSelector('.seuil .portes'); await p3.click('.seuil ' + A('porte', '[data-v="souffle"]')); await p3.waitForSelector('main.souffle'); await p3.waitForTimeout(400);
        await p3.goto(APP + '#film'); const la = await attend(p3, () => !!document.getElementById('film-l'), null, 8000); await p3.waitForTimeout(500);
        let e3 = await etat(p3);
        ok(la && /intro/.test(e3.vue) && e3.v && e3.v.paused && e3.go, P('10. un parent déjà entré ouvre l’adresse du film : l’accueil, puis le lecteur qui attend ' + JSON.stringify([la, e3.vue, e3.v && e3.v.paused, e3.go])));
        await p3.click('#film-l [data-film="fermer"]'); await attend(p3, () => !document.getElementById('film-l')); e3 = await etat(p3);
        ok(!e3.ouvert && /intro/.test(e3.vue) && /#accueil$/.test(e3.url), P('10. « Fermer » le laisse sur l’accueil ' + JSON.stringify([e3.ouvert, e3.vue, e3.url])));
        await c3.close();
      }
    } else {
      const { ctx: c2, page: p2 } = await ouvre(fmt);
      await p2.goto(APP + '#film'); await p2.waitForSelector('.seuil .portes, main'); await p2.waitForTimeout(700);
      ok(!(await p2.$('#film-l')), P('9. sans film, l’adresse …/#film n’ouvre aucun lecteur'));
      await c2.close();
    }
  }
  ok(erreurs.length === 0, 'aucune erreur dans la page ' + JSON.stringify(erreurs.slice(0, 3)));
  await browser.close();
  if (mode !== 'absent') notes.push(lectureVraie ? 'lecture réelle du MP4 vérifiée dans ce navigateur : ' + lues.join(', ') : 'lecture réelle du MP4 non vérifiée dans ce navigateur');
  notes.forEach(x => console.log('  note : ' + x));
  console.log('film (' + NAV + ') : ' + n + ' vérifications, ' + ko + ' échec' + (ko > 1 ? 's' : '') + ' (' + APP + ') | état « ' + mode + ' »' + (mode === 'absent' ? '' : ' | lecture réelle ' + lectureVraie + ' sur ' + lectureAttendue));
  process.exit(ko ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
