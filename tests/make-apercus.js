// Fabrique l'image d'aperçu de chaque fiche (1200 × 630, celle qui s'affiche quand on envoie le lien dans une messagerie).
// usage : node make-apercus.js   -> écrit site-src/img/fiches/<adresse-de-la-fiche>.jpg, à partir de la liste donnée par l'application elle-même.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const ROOT = '/home/claude', SRC = ROOT + '/site-src', OUT = SRC + '/img/fiches';
const app = process.argv[2] || ROOT + '/dev/site/app.js';
const tout = JSON.parse(execFileSync('node', [ROOT + '/tests/prerender.js', app, '/'], { maxBuffer: 64 * 1024 * 1024 }).toString());
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const page0 = f => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
@font-face{font-family:'Newsreader';font-weight:400 700;src:url(file://${SRC}/fonts/newsreader.woff2) format('woff2')}
@font-face{font-family:'Nunito';font-weight:200 1000;src:url(file://${SRC}/fonts/nunito.woff2) format('woff2')}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;background:#07240F;color:#F4EFD8;font-family:Nunito,sans-serif;position:relative}
.photo{position:absolute;top:0;right:0;width:780px;height:630px;background:url(file://${SRC}/img/hero.webp) 62% 46%/cover}
.voile{position:absolute;top:0;right:0;bottom:0;left:0;background:linear-gradient(90deg,#07240F 0%,#07240F 36%,rgba(7,36,15,.9) 46%,rgba(7,36,15,.5) 60%,rgba(7,36,15,.08) 80%,rgba(7,36,15,0) 100%),linear-gradient(180deg,rgba(7,36,15,.5) 0%,rgba(7,36,15,0) 28%,rgba(7,36,15,0) 70%,rgba(7,36,15,.6) 100%)}
.dedans{position:absolute;top:0;left:0;bottom:0;width:760px;padding:56px 0 54px 68px;display:flex;flex-direction:column}
.marque{display:flex;align-items:center;gap:16px;font-family:Newsreader,serif;font-weight:700;font-size:33px;line-height:1.05}
.marque small{display:block;font-family:Nunito,sans-serif;font-weight:700;font-size:21px;color:#A9C9A0;margin-top:3px}
.marque svg{width:60px;height:60px}
.milieu{margin-top:auto;margin-bottom:auto;padding-top:6px}
.ages{font-weight:800;font-size:25px;color:#E9EDAE;margin-bottom:16px}
h1{font-family:Newsreader,serif;font-weight:600;font-size:86px;line-height:1.02;letter-spacing:-.01em;text-wrap:balance}
h1.m{font-size:72px}h1.l{font-size:62px}
.sous{font-size:30px;line-height:1.3;font-weight:600;color:#A9C9A0;margin-top:20px;max-width:600px}
.pied{font-size:24px;font-weight:700;color:#F4EFD8;display:flex;align-items:center;gap:12px}
.pied i{width:9px;height:9px;border-radius:50%;background:#D8DF7E;flex:none}
</style></head><body><div class="photo"></div><div class="voile"></div><div class="dedans">
<div class="marque"><svg viewBox="0 0 48 48"><path d="M24 5C24 5 15.5 15.5 15.5 21.5a8.5 8.5 0 0 0 17 0C32.5 15.5 24 5 24 5z" fill="#F4EFD8"/><ellipse cx="24" cy="37" rx="7.5" ry="2.6" fill="none" stroke="#B4DE9C" stroke-width="2.2"/><ellipse cx="24" cy="37.5" rx="16" ry="5.5" fill="none" stroke="#B4DE9C" stroke-width="1.8" opacity=".55"/></svg><span>Parent écouté<small>parent éclairé</small></span></div>
<div class="milieu"><p class="ages">${esc(f.ages)}</p><h1 class="${f.t.length > 26 ? 'l' : f.t.length > 17 ? 'm' : ''}">${esc(f.t)}</h1><p class="sous">${esc(f.s)}</p></div>
<p class="pied"><i></i>Une fiche pour les parents, par Antonio Company</p>
</div></body></html>`;
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  const ctx = await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage(); let total = 0;
  const tmp = '/tmp/apercu-fiche.html';
  for (const f of tout.fiches) {
    fs.writeFileSync(tmp, page0(f));
    await page.goto('file://' + tmp); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(120);
    const dest = OUT + '/' + f.slug + '.jpg';
    await page.screenshot({ path: dest, type: 'jpeg', quality: 80 });
    total += fs.statSync(dest).size;
  }
  await b.close();
  console.log(tout.fiches.length + ' images écrites dans ' + OUT + ' (' + Math.round(total / 1024) + ' Ko en tout)');
})().catch(e => { console.error(e); process.exit(1); });
