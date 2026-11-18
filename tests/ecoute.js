// L'essai « les yeux fermés ».
// Je ne peux pas écouter. À la place, cet outil enregistre ce que la page envoie réellement vers la sortie audio pendant « Souffler 2 minutes »,
// pour chacune des 3 respirations, et le range dans un fichier son. « ecoute.py » analyse ensuite ce fichier seul, sans rien savoir de l'écran :
// il repère chaque note, sa hauteur, et en déduit quand il faut inspirer et quand il faut souffler. On compare enfin avec les mots affichés.
// usage : node ecoute.js <dossier de sortie> [secondes par respiration, 34 par défaut]
// Variables : PEPE_ORIGIN, PEPE_BASE, PEPE_NAV, PEPE_CHROME.
const pw = require('playwright'); const fs = require('fs'); const path = require('path');
const NAV = process.env.PEPE_NAV || 'chromium';
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8445';
const BASE = process.env.PEPE_BASE || '/';
const APP = ORIGIN + BASE;
const KEY = process.env.PEPE_KEY || 'pepe-v1';
const OUT = process.argv[2] || '/tmp/ecoute'; const SEC = +(process.argv[3] || 34);
const semer = ([k, v]) => { try { if (!sessionStorage.getItem('__seme')) { localStorage.setItem(k, v); sessionStorage.setItem('__seme', '1'); } } catch (e) { } };
// L'enregistreur : tout ce qui part vers la sortie audio passe aussi par lui. Il tourne à côté du son lui-même (et non dans la page),
// pour ne perdre aucun échantillon, et il note pour chaque bloc son rang exact dans l'horloge du son.
const MODULE = `class Magneto extends AudioWorkletProcessor {
  constructor() { super(); this.b = new Float32Array(4096); this.n = 0; this.f0 = 0; }
  rend() { if (this.n) { this.port.postMessage({ f: this.f0, d: this.b.slice(0, this.n) }); this.n = 0; } }
  process(inputs) { const i = inputs[0];
    if (!i || !i.length) { this.rend(); return true; }
    const a = i[0], b = i[1] || i[0]; if (this.n === 0) this.f0 = currentFrame;
    for (let k = 0; k < a.length; k++) this.b[this.n + k] = (a[k] + b[k]) / 2;
    this.n += a.length; if (this.n >= 4096) this.rend(); return true; }
}
registerProcessor('magneto', Magneto);`;
const magneto = ([code]) => {
  const R = window.__rec = { blocs: [], f: [], paires: [], mots: [], sr: 0, lat: 0, erreurs: [] };
  let dm = null; const lire = () => { const m = document.getElementById('souffle-mot'); const tm = m ? m.textContent : null; if (tm !== dm) { dm = tm; R.mots.push({ t: performance.now(), m: tm }); } };
  try { new MutationObserver(lire).observe(document, { subtree: true, childList: true, characterData: true }); } catch (e) { }
  const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
  const conn = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function (dest) { const out = conn.apply(this, arguments);
    try { const c = this.context; if (dest === c.destination && !this.__rec) { this.__rec = 1;
      if (!c.__file) { c.__file = []; R.sr = c.sampleRate;
        c.audioWorklet.addModule(URL.createObjectURL(new Blob([code], { type: 'application/javascript' }))).then(() => { const w = new AudioWorkletNode(c, 'magneto', { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 2, channelCountMode: 'explicit' }), z = c.createGain(); z.gain.value = 0;
          w.port.onmessage = e => { R.blocs.push(e.data.d); R.f.push(e.data.f); R.paires.push([c.currentTime, performance.now()]);
            try { R.lat = Math.min(.3, Math.max(0, (Number(c.outputLatency) || 0) + (Number(c.baseLatency) || 0))); } catch (x) { } };
          conn.call(w, z); conn.call(z, c.destination); c.__w = w; c.__file.forEach(n => conn.call(n, w)); c.__file = null; }, e => R.erreurs.push(String(e))); }
      if (c.__w) conn.call(this, c.__w); else if (c.__file) c.__file.push(this); } } catch (e) { R.erreurs.push(String(e)); } return out; };
  // Rendre l'enregistrement : chaque bloc est posé à sa place exacte, d'après son rang dans l'horloge du son.
  R.rendre = () => { if (!R.f.length) return { sr: R.sr, erreurs: R.erreurs, vide: true };
    const f0 = R.f[0], fin = R.f[R.f.length - 1] + R.blocs[R.blocs.length - 1].length; const pcm = new Int16Array(fin - f0); let manque = fin - f0;
    R.blocs.forEach((b, j) => { const o = R.f[j] - f0; manque -= b.length; for (let i = 0; i < b.length; i++) { const v = Math.max(-1, Math.min(1, b[i])); pcm[o + i] = Math.round(v * 32767); } });
    const u = new Uint8Array(pcm.buffer); let s = ''; const pas = 0x8000; for (let i = 0; i < u.length; i += pas) s += String.fromCharCode.apply(null, u.subarray(i, i + pas));
    return { sr: R.sr, f0: f0, lat: R.lat, paires: R.paires.filter((x, i) => i % 8 === 0), mots: R.mots, pcm: btoa(s), blocs: R.blocs.length, manque: manque, erreurs: R.erreurs }; };
};
const wav = (pcm, sr) => { const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(sr, 24); h.writeUInt32LE(sr * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40); return Buffer.concat([h, pcm]); };
const CAS = [['egal', { m: 'egal', c: 8 }, 'Le souffle régulier'], ['long', { m: 'long', c: 8 }, 'L’expiration prolongée'], ['libre', { m: 'libre', c: 8 }, 'À mon rythme (8 secondes)']];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const LOCAL = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
  const exe = NAV === 'chromium' ? (process.env.PEPE_CHROME || (fs.existsSync(LOCAL) ? LOCAL : undefined)) : undefined;
  const lance = { chromium: { args: ['--ignore-certificate-errors', '--autoplay-policy=user-gesture-required'] }, firefox: {}, webkit: {} }[NAV];
  const browser = await pw[NAV].launch(Object.assign({}, lance, exe ? { executablePath: exe } : {}));
  for (const [cle, reglage, titre] of CAS) {
    const ctx = await browser.newContext({ locale: 'fr-CH', ignoreHTTPSErrors: true, bypassCSP: true, viewport: { width: 390, height: 664 }, hasTouch: true, deviceScaleFactor: 2 });
    await ctx.addInitScript(semer, [KEY, JSON.stringify({ souffle: reglage })]); await ctx.addInitScript(magneto, [MODULE]);
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await page.goto(APP, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.herofull .porte'); await page.waitForTimeout(350);
    await page.click('.herofull [data-act="porte"][data-v="souffle"]'); await page.waitForSelector('main.souffle.s-cours');
    await page.click('.son-souffle');
    await page.waitForTimeout(SEC * 1000);
    const r = await page.evaluate(() => window.__rec.rendre());
    if (r.vide) { console.log(titre + ' : rien n’a été enregistré ' + JSON.stringify(r.erreurs)); await ctx.close(); continue; }
    const pcm = Buffer.from(r.pcm, 'base64');
    fs.writeFileSync(path.join(OUT, cle + '.wav'), wav(pcm, r.sr));
    fs.writeFileSync(path.join(OUT, cle + '.json'), JSON.stringify({ cle, titre, reglage, sr: r.sr, f0: r.f0, lat: r.lat, paires: r.paires, mots: r.mots.filter(x => x.m === 'Inspirez' || x.m === 'Expirez'), manque: r.manque, erreurs: errs.concat(r.erreurs) }));
    console.log(titre + ' : ' + (pcm.length / 2 / r.sr).toFixed(1) + ' s enregistrées (' + r.blocs + ' blocs, ' + r.manque + ' échantillon manquant), ' + r.mots.length + ' mots relevés' + (errs.length || r.erreurs.length ? ' | erreurs : ' + errs.concat(r.erreurs).join(' | ') : ''));
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(2); });
