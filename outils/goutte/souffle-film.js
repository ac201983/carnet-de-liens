// « Souffler » : un cycle complet au format iPhone, avec le son réel de la page.
// 1) L'image est filmée image par image, avec l'horloge tenue à la main (horloge.js) : chaque image est à l'heure exacte.
// 2) Le son est enregistré à part, en temps réel, à la sortie audio de la même page (l'enregistreur de tests/ecoute.js).
// 3) L'accord : image et son sont calés sur le premier « Inspirez » affiché par l'application elle-même.
// Je ne peux pas écouter le résultat : l'accord est calculé, et il est aussi mesuré par tests/respiration.js.
// node souffle-film.js <port> <base> <heure> <sortie.mp4> [secondes=13.6] [respiration=long] [images par seconde=30]
const { chromium } = require('playwright'); const fs = require('fs'); const { execFileSync } = require('child_process');
const horloge = require('./horloge.js'); const ouvreFilm = require('./film.js');
const [port, base, heure, sortie, SEC = '13.6', resp = 'long', ips = '30'] = process.argv.slice(2);
const APP = 'https://localhost:' + port + base, KEY = /essai/.test(base) ? 'pepe-essai-v1' : 'pepe-v1';
const semer = ([k, m, hh]) => { Date.prototype.getHours = function () { return hh; }; try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify({ souffle: { m: m, c: 8 } })); } catch (e) { } };
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
  R.rendre = () => { if (!R.f.length) return { sr: R.sr, erreurs: R.erreurs, vide: true };
    const f0 = R.f[0], fin = R.f[R.f.length - 1] + R.blocs[R.blocs.length - 1].length; const pcm = new Int16Array(fin - f0); let manque = fin - f0;
    R.blocs.forEach((b, j) => { const o = R.f[j] - f0; manque -= b.length; for (let i = 0; i < b.length; i++) { const v = Math.max(-1, Math.min(1, b[i])); pcm[o + i] = Math.round(v * 32767); } });
    const u = new Uint8Array(pcm.buffer); let s = ''; const pas = 0x8000; for (let i = 0; i < u.length; i += pas) s += String.fromCharCode.apply(null, u.subarray(i, i + pas));
    return { sr: R.sr, f0: f0, lat: R.lat, paires: R.paires, mots: R.mots, pcm: btoa(s), blocs: R.blocs.length, manque: manque, erreurs: R.erreurs }; };
};
const wav = (pcm, sr) => { const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(sr, 24); h.writeUInt32LE(sr * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40); return Buffer.concat([h, pcm]); };
// Le même chemin dans les 2 passes : l'accueil, « Souffler » (qui commence seul), « Arrêter », puis « Commencer » et aussitôt le son.
const entre = async p => { await p.goto(APP); await p.waitForSelector('.seuil .porte'); await p.waitForTimeout(700); await p.click('[data-act="porte"][data-v="souffle"]'); await p.waitForSelector('main.souffle.s-cours'); await p.waitForTimeout(1400); await p.click('[data-act="souffle-stop"]'); await p.waitForSelector('main.souffle.s-pret'); await p.waitForTimeout(1900); };

(async () => {
  const tmpV = sortie.replace(/\.mp4$/, '') + '.image.mp4', tmpA = sortie.replace(/\.mp4$/, '') + '.son.wav', dossier = sortie.replace(/\.mp4$/, '') + '-images';
  // ---------- 1) l'image
  let Vin = null, changements = [];
  {
    const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--ignore-certificate-errors'] });
    const ctx = await b.newContext({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true, locale: 'fr-CH' });
    await ctx.addInitScript(() => { window.__eauSansGarde = true; }); await ctx.addInitScript(semer, [KEY, resp, +heure]); await ctx.addInitScript(horloge);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
    await entre(p); await p.waitForSelector('main.souffle .etang');
    const cine = ouvreFilm(tmpV, +ips, { dossier, tous: 15 });
    await p.evaluate(() => window.__vt.on());
    await p.click('[data-act="souffle-go"]'); await p.waitForSelector('main.souffle.s-cours');
    await p.click('.son-souffle').catch(() => { });
    const pas = 1000 / +ips, n = Math.round(+SEC * +ips); let dernier = null; const t0 = Date.now();
    for (let i = 0; i <= n; i++) {
      await p.evaluate(ms => window.__vt.pas(ms), i ? pas : 0); await cine.image(p);
      const e = await p.evaluate(() => ({ mot: (document.getElementById('souffle-mot') || {}).textContent, son: (document.querySelector('.son-souffle') || { getAttribute: () => '' }).getAttribute('data-etat'), eau: !!document.querySelector('.souffle .etang.eau-vive canvas.eau') }));
      if (e.mot !== dernier) { changements.push({ t: +(i * pas / 1000).toFixed(3), mot: e.mot, son: e.son, eau: e.eau }); dernier = e.mot; }
    }
    await cine.fin();
    const prem = changements.find(x => x.mot === 'Inspirez'); Vin = prem ? prem.t : null;
    console.log('image : ' + (n + 1) + ' images en ' + Math.round((Date.now() - t0) / 1000) + ' s. Mots : ' + JSON.stringify(changements) + (errs.length ? ' | ERREURS ' + errs.join(' | ') : ''));
    await b.close();
  }
  // ---------- 2) le son, en temps réel
  let info = {};
  {
    const b = await chromium.launch({ args: ['--ignore-certificate-errors', '--autoplay-policy=user-gesture-required'] });
    const ctx = await b.newContext({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, bypassCSP: true, hasTouch: true, locale: 'fr-CH' });
    await ctx.addInitScript(semer, [KEY, resp, +heure]); await ctx.addInitScript(magneto, [MODULE]);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
    await entre(p);
    const tGo = await p.evaluate(() => performance.now());
    await p.click('[data-act="souffle-go"]'); await p.waitForSelector('main.souffle.s-cours'); await p.click('.son-souffle');
    await p.waitForTimeout((+SEC + 2.5) * 1000);
    const r = await p.evaluate(() => window.__rec.rendre());
    if (r.vide) { console.log('son : rien n’a été enregistré ' + JSON.stringify(r.erreurs)); await b.close(); process.exit(3); }
    const pcm = Buffer.from(r.pcm, 'base64'); const N = pcm.length / 2;
    // l'horloge du son et celle de la page, reliées par une droite
    const P = r.paires, a = (P[P.length - 1][1] - P[0][1]) / (P[P.length - 1][0] - P[0][0]), bb = P[0][1] - a * P[0][0];
    const Tin = (r.mots.filter(x => x.m === 'Inspirez' && x.t > tGo)[0] || {}).t;
    const Tout = (r.mots.filter(x => x.m === 'Expirez' && x.t > tGo)[0] || {}).t;
    // l'échantillon entendu à l'instant 0 du film (négatif : le son n'existait pas encore, on met du silence)
    const s0 = Math.round(((Tin - (Vin + r.lat) * 1000 - bb) / a) * r.sr - r.f0);
    const total = Math.round(+SEC * r.sr); const out = Buffer.alloc(total * 2);
    for (let i = 0; i < total; i++) { const s = s0 + i; if (s >= 0 && s < N) out.writeInt16LE(pcm.readInt16LE(s * 2), i * 2); }
    // un fondu d'un quart de seconde à la fin, pour que le film ne se coupe pas net
    const fd = Math.round(.25 * r.sr); for (let i = 0; i < fd; i++) { const k = total - fd + i; out.writeInt16LE(Math.round(out.readInt16LE(k * 2) * (1 - i / fd)), k * 2); }
    fs.writeFileSync(tmpA, wav(out, r.sr));
    let e2 = 0, pic = 0; for (let i = 0; i < total; i++) { const v = out.readInt16LE(i * 2) / 32768; e2 += v * v; pic = Math.max(pic, Math.abs(v)); }
    info = { sr: r.sr, latence: r.lat, pente: +a.toFixed(4), inspirezPage: Math.round(Tin - tGo), expirezPage: Math.round(Tout - tGo), inspirezFilm: Vin, debutDuSon: +(-s0 / r.sr).toFixed(3), rms: +Math.sqrt(e2 / total).toFixed(4), pic: +pic.toFixed(3), manque: r.manque, erreurs: errs.concat(r.erreurs) };
    console.log('son : ' + JSON.stringify(info));
    await b.close();
  }
  // ---------- 3) l'image et le son ensemble
  const tmp = sortie.replace(/\.mp4$/, '') + '.en-cours.mp4';
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmpV, '-i', tmpA, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', tmp]);
  fs.renameSync(tmp, sortie);
  fs.writeFileSync(sortie.replace(/\.mp4$/, '') + '.json', JSON.stringify({ changements, son: info }, null, 1));
  console.log('film : ' + sortie);
})().catch(e => { console.error(e); process.exit(2); });
