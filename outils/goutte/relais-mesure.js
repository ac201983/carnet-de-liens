// « Passer le relais » : à l'ouverture de l'aperçu, les 3 repères sont-ils lisibles ensemble, sans faire défiler ?
// node relais-mesure.js <port> <base> [capture=dossier]
const { chromium } = require('playwright'); const fs = require('fs');
const iso = n => { const d = new Date(Date.now() + n * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const FICHE = { id: 'fx', c: iso(0), m: iso(0), qui: 'Lina', chez: 'sa tante Élise', quand: 'samedi 21 novembre, de 9 heures à 18 heures', tu: true,
  trois: ['Lina a besoin de savoir ce qui vient après. Dis-le-lui avant chaque changement.', 'Quand elle se bouche les oreilles, le bruit est trop fort pour elle. Propose-lui un endroit calme.', 'Elle prend son traitement à 12 heures, pendant le repas. Il est dans la poche avant du sac.'],
  moi: ['J’aime dessiner et écouter de la musique avec mon casque.'], s: { repas: ['Lina mange de tout, lentement.'], nuit: [] }, tel: [{ n: 'Maman', t: '079 000 00 00' }], env: '', retour: '', retourLe: '', garde: '' };
(async () => {
  const [port, base, dossier] = process.argv.slice(2); if (dossier) fs.mkdirSync(dossier, { recursive: true });
  const KEY = /essai/.test(base) ? 'pepe-essai-v1' : 'pepe-v1';
  const b = await chromium.launch();
  for (const [W, H] of [[390, 664], [390, 760], [360, 640], [320, 568], [1280, 800]]) {
    for (const cas of ['exemple', 'apercu']) {
      const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, isMobile: W < 700, hasTouch: W < 700, locale: 'fr-CH', reducedMotion: 'reduce' });
      await ctx.addInitScript(() => { Date.prototype.getHours = function () { return 14; }; });
      if (cas === 'apercu') await ctx.addInitScript(([k, d]) => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify(d)); } catch (e) { } }, [KEY, { onboarded: true, start: iso(-20), tier: 'free', achats: { relais: { le: iso(0) } }, steps: {}, notes: {}, seen: {}, depots: [], moods: {}, pv: 3, rel: { fiches: [FICHE], reunions: [] } }]);
      const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
      await p.goto('https://localhost:' + port + base + '#relais'); await p.waitForSelector('main.v-relais', { timeout: 15000 }); await p.waitForTimeout(500);
      if (cas === 'exemple') { await p.click('[data-act="rl"][data-k="exemple"]'); }
      else { await p.click('[data-act="rl"][data-k="ouvrir"]'); }
      await p.waitForSelector('.v-relais .rl-fiche'); await p.waitForTimeout(700);
      const m = await p.evaluate(() => {
        const r = s => { const e = document.querySelector(s); if (!e) return null; const q = e.getBoundingClientRect(); return { h: Math.round(q.top), b: Math.round(q.bottom) }; };
        const lis = [...document.querySelectorAll('.v-relais .rl-fiche .rl-trois li')].map(e => Math.round(e.getBoundingClientRect().bottom));
        // ce qui recouvre le bas de l'écran (barre d'onglets, bouton flottant)
        const bas = [...document.querySelectorAll('nav.tabs,.tabs,.cta-flot,.bar-bas')].filter(e => { const cs = getComputedStyle(e); return cs.position === 'fixed' && cs.visibility !== 'hidden' && cs.display !== 'none'; }).map(e => Math.round(e.getBoundingClientRect().top)).filter(y => y > innerHeight / 2);
        const limite = Math.min(innerHeight, ...(bas.length ? bas : [innerHeight]));
        return { y: Math.round(scrollY), vh: innerHeight, limite, tete: r('.f-tete'), fiche: r('.v-relais .rl-fiche'), trois: r('.v-relais .rl-fiche .rl-trois'), titre: (document.querySelector('.rl-trois h2,.rl-trois h3,.rl-trois .rl-h') || {}).textContent, lis, ensemble: lis.length === 3 && lis.every(y => y <= limite) && r('.v-relais .rl-fiche .rl-trois').h >= 0 };
      });
      console.log(W + 'x' + H, cas, JSON.stringify(m), errs.length ? 'ERR ' + errs[0] : '');
      if (dossier) await p.screenshot({ path: dossier + '/relais-' + cas + '-' + W + 'x' + H + '.png' });
      await ctx.close();
    }
  }
  await b.close();
})();
