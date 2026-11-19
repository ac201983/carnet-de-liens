// Calibrage : une fiche plus ou moins chargée tient-elle sur une feuille A4 ? On compare le verdict de l'outil au PDF réel.
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const ORIGIN = process.argv[2] || 'https://localhost:8445', BASE = process.argv[3] || '/', KEY = process.env.PEPE_KEY || 'pepe-v1';
const mot = n => { const src = 'Un signal avant de changer d’activité aide beaucoup et une seule consigne à la fois avec des mots simples suffit presque toujours le soir comme le matin '; let s = ''; while (s.length < n) s += src; return s.slice(0, n - 1).trim() + '.'; };
function fiche(nl, len, nmoi, ntel) {
  const s = {}; ['aide', 'repas', 'nuit', 'monte', 'comm', 'aime', 'secu'].forEach(k => { s[k] = Array.from({ length: nl }, () => mot(len)); });
  return { id: 'f1', c: '2026-11-19', m: '2026-11-19', qui: 'Noé', chez: 'mon frère Rémi', quand: 'du samedi 5 au dimanche 6 décembre', tu: true, trois: [mot(Math.min(len, 140)), mot(Math.min(len, 140)), mot(Math.min(len, 140))], moi: Array.from({ length: nmoi }, () => mot(len)), s, tel: Array.from({ length: ntel }, (_, i) => ({ n: 'Maman', t: '079 000 00 00' })), env: '', retour: '', retourLe: '', garde: '' };
}
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true, reducedMotion: 'reduce', locale: 'fr-CH' });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  const cas = [[1, 60, 1, 1], [2, 80, 2, 1], [3, 80, 2, 2], [3, 120, 3, 2], [4, 100, 3, 2], [4, 160, 4, 3], [5, 100, 4, 3], [5, 140, 4, 3], [5, 200, 4, 3]];
  const lignes = [];
  for (const c of cas) {
    await page.goto(ORIGIN + BASE + 'relais/'); await page.waitForTimeout(200);
    await page.evaluate(([k, f]) => { localStorage.setItem(k, JSON.stringify({ onboarded: true, achats: { relais: { le: '2026-11-19' } }, rel: { fiches: [f], reunions: [] } })); }, [KEY, fiche(...c)]);
    await page.goto(ORIGIN + BASE + 'relais/'); await page.waitForTimeout(500);
    await page.click('[data-act="rl"][data-k="ouvrir"]'); await page.waitForTimeout(400);
    const v = await page.evaluate(() => { const el = document.querySelector('.v-relais .rl-fiche'); return { cls: el ? el.className : '', trop: !!document.querySelector('.rl-page.rl-trop'), dit: (document.querySelector('.rl-page') || {}).textContent || '' }; });
    await page.emulateMedia({ media: 'print' }); const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true }); await page.emulateMedia({ media: 'screen' });
    fs.writeFileSync('/tmp/page-cal.pdf', pdf);
    const pages = Number(/Pages:\s+(\d+)/.exec(execSync('pdfinfo /tmp/page-cal.pdf').toString())[1]);
    fs.copyFileSync('/tmp/page-cal.pdf', '/tmp/page-' + c.join('-') + '.pdf');
    const car = c[0] * 7 * c[1] + 3 * Math.min(c[1], 140) + c[2] * c[1];
    lignes.push(`${c.join('/').padEnd(12)} ${String(car).padStart(5)} car.  cran ${(/rl-d(\d)/.exec(v.cls) || [])[1]}  outil ${v.trop ? 'DÉPASSE' : 'tient  '}  PDF ${pages} page${pages > 1 ? 's' : ''}  ${(v.trop ? pages > 1 : pages === 1) ? 'd’accord' : 'DÉSACCORD'}`);
  }
  console.log(lignes.join('\n')); if (errs.length) console.log('ERREURS', errs.join('\n'));
  await browser.close();
})();
