// Film de présentation « Ce qu'on ne dit pas par SMS » : outils communs aux captures de la vraie version d'essai.
// Chaque capture filme le site tel qu'il est, image par image (30 par seconde), avec des données fictives et une date fixée.
const { chromium } = require('playwright'); const fs = require('fs');
const horloge = require('/home/claude/build/goutte/horloge.js');
const IPS = 30, PAS = 1000 / IPS;
const APP = 'https://localhost:8446/essai/';

// La date du film, et des minuteries à intervalle (setInterval) que la capture fait avancer elle-même (pour le minuteur visuel, filmé en accéléré).
const dateFixe = ms => {
  const D0 = Date, r0 = D0.now();
  class D extends D0 { constructor(...a) { if (a.length) super(...a); else super(ms + (D0.now() - r0)); } static now() { return ms + (D0.now() - r0); } }
  window.Date = D; window.__eauSansGarde = true;
  // Les changements d'écran : le site sait se passer de l'effet du navigateur (View Transitions), et l'écran suivant apparaît alors simplement.
  // C'est ce chemin-là qu'on filme, parce que l'horloge tenue à la main ne peut pas faire avancer l'effet du navigateur. Le film dessine lui-même l'onde.
  try { document.startViewTransition = undefined; } catch (e) { }
  const SI0 = window.setInterval.bind(window), CI0 = window.clearInterval.bind(window); let iv = [], iid = 9e6, tenu = false;
  window.setInterval = function (fn, ms) { if (!tenu || typeof fn !== 'function') return SI0.apply(window, arguments); iv.push({ id: ++iid, ms: Math.max(1, +ms || 0), reste: Math.max(1, +ms || 0), fn }); return iid; };
  window.clearInterval = id => { if (id > 9e6) iv = iv.filter(x => x.id !== id); else CI0(id); };
  window.__iv = { on() { tenu = true; }, n() { return iv.length; },
    pas(ms) { let n = 0; for (const x of iv.slice()) { x.reste -= ms; while (x.reste <= 0 && iv.includes(x)) { x.reste += x.ms; n++; try { x.fn(); } catch (e) { console.error('iv', e); } } } return n; } };
};

async function ouvrir(o = {}) {
  const { haut = 844, dsf = 5, date = '2026-11-19T21:42:00+01:00', etat = null } = o;
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--ignore-certificate-errors'] });
  const ctx = await b.newContext(Object.assign({ viewport: { width: 390, height: haut }, deviceScaleFactor: dsf, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true, locale: 'fr-CH', timezoneId: 'Europe/Zurich' }, etat ? { storageState: etat } : {}));
  await ctx.addInitScript(dateFixe, new Date(date).getTime());
  await ctx.addInitScript(horloge);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  return { b, ctx, p, errs };
}

// Une prise : un dossier d'images numérotées et un journal (les repères utiles au montage).
class Prise {
  constructor(p, dossier) { this.p = p; this.d = dossier; this.n = 0; this.j = { ips: IPS, marques: {} }; fs.rmSync(dossier, { recursive: true, force: true }); fs.mkdirSync(dossier, { recursive: true }); }
  async tenir() { await this.p.evaluate(() => { window.__vt.on(); if (window.__iv) window.__iv.on(); }); }
  marque(nom, v) { this.j.marques[nom] = v === undefined ? this.n : v; }
  async image(pas = PAS) { await this.p.evaluate(ms => window.__vt.pas(ms), this.n ? pas : 0); fs.writeFileSync(this.d + '/' + String(this.n).padStart(4, '0') + '.jpg', await this.p.screenshot({ type: 'jpeg', quality: 95 })); return this.n++; }
  async images(k, pas = PAS) { for (let i = 0; i < k; i++) await this.image(pas); }
  // avance l'horloge sans photographier (pour laisser finir une transition entre deux prises)
  async laisse(ms) { for (let t = 0; t < ms; t += PAS) await this.p.evaluate(x => window.__vt.pas(x), PAS); }
  fin(extra) { Object.assign(this.j, extra || {}, { images: this.n }); fs.writeFileSync(this.d + '/journal.json', JSON.stringify(this.j, null, 1)); }
}
// La place d'un élément dans l'écran (points), ou de son texte seul.
const rect = (p, sel, texte) => p.evaluate(([s, t]) => { const e = typeof s === 'string' ? document.querySelector(s) : null; if (!e) return null; let q;
  if (t) { const g = document.createRange(); g.selectNodeContents(e); q = g.getBoundingClientRect(); } else q = e.getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height }; }, [sel, !!texte]);
const rectTexte = (p, re, dans = 'main') => p.evaluate(([src, d]) => { const r = new RegExp(src), n = e => e.textContent.replace(/\s+/g, ' ').trim();
  const e = [...document.querySelectorAll(d + ' *')].find(e => r.test(n(e)) && ![...e.children].some(c => r.test(n(c)))); if (!e) return null;
  const g = document.createRange(); g.selectNodeContents(e); const q = g.getBoundingClientRect(), b = e.getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height, bx: b.left, by: b.top, bw: b.width, bh: b.height, t: n(e).slice(0, 90) }; }, [re, dans]);
module.exports = { ouvrir, Prise, rect, rectTexte, IPS, PAS, APP, fs };
