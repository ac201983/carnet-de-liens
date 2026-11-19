// Les 2 exemples demandés par Antonio, sur un écran de téléphone (390 points de large), dans la version d'essai.
// Pour chacun : la première question, le choix offert, ce que la personne emporte.
// node exemples.js <port> <base> <heure>
const { chromium } = require('playwright');
const D = '/home/claude/build/parole/exemples/';
const A = (a, x) => '[data-act="' + a + '"]' + (x || '');
const BARRE = 72, BAS = 92;
(async () => {
  const [port, base, heure] = process.argv.slice(2);
  const b = await chromium.launch(); const errs = [];
  const neuf = async () => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true, locale: 'fr-CH', timezoneId: 'Europe/Zurich' });
    await ctx.addInitScript(hh => { Date.prototype.getHours = function () { return hh; }; }, +heure);
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push('pageerror ' + String(e).slice(0, 300))); p.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text().slice(0, 300)); });
    await p.goto('https://localhost:' + port + base); await p.waitForSelector(A('porte', '[data-v="deposer"]')); await p.waitForTimeout(900);
    return p;
  };
  // Un écran entier dans une seule image : l'écran du téléphone s'allonge juste assez pour montrer « sel » sous la barre du haut.
  const vue = async (p, sel, nom, haut, fin) => {
    const h = await p.evaluate(o => { const a = document.querySelector(o.sel).getBoundingClientRect(), b = document.querySelector(o.fin || o.sel).getBoundingClientRect(); return Math.ceil(b.bottom - a.top); }, { sel, fin });
    const H = Math.max(640, h + BARRE + BAS);
    await p.setViewportSize({ width: 390, height: H }); await p.waitForTimeout(300);
    await p.$eval(sel, (e, o) => { window.scrollTo(0, o.haut ? 0 : Math.max(0, e.getBoundingClientRect().top + window.scrollY - o.barre)); }, { haut: !!haut, barre: BARRE });
    await p.waitForTimeout(400); await p.screenshot({ path: D + nom + '.png' });
    await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(250);
  };
  const sansToast = async p => { await p.waitForFunction(() => !document.querySelector('.toast'), null, { timeout: 9000 }).catch(() => {}); await p.waitForTimeout(300); };

  // --- l'accueil, le même pour tout le monde ---
  let p = await neuf();
  await p.screenshot({ path: D + 'accueil-1-premier-ecran.png' });
  await p.$eval('.nom-sens', e => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 84)); await p.waitForTimeout(400);
  const hn = await p.$eval('.nom-sens', e => Math.ceil(e.getBoundingClientRect().height));
  await p.setViewportSize({ width: 390, height: hn + 84 + 28 }); await p.waitForTimeout(300);
  await p.$eval('.nom-sens', e => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 84)); await p.waitForTimeout(400);
  await p.screenshot({ path: D + 'accueil-2-sens-du-nom.png' });
  await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);

  // --- exemple 1 : le parent d'un enfant, qui garde ses mots pour lui ---
  await p.click(A('porte', '[data-v="deposer"]')); await p.waitForSelector('main.deposer #draft'); await p.waitForTimeout(2600);
  await p.fill('#draft', 'Ce matin, il a hurlé pour mettre ses chaussures et nous sommes arrivés en retard à l’école. Tout le monde nous regardait. J’ai tenu, mais ce soir je suis vidée.');
  await p.$eval('#draft', e => { if (e.scrollHeight > e.clientHeight) e.style.height = (e.scrollHeight + 4) + 'px'; e.blur(); }); await p.waitForTimeout(300);
  await vue(p, 'main.deposer', 'exemple-1-a-question-et-choix', true);
  await p.click(A('dsend')); await p.waitForSelector('.emporte'); await sansToast(p);
  await vue(p, '.emporte', 'exemple-1-b-ce-qu-elle-emporte');
  console.log('exemple 1 :', JSON.stringify(await p.evaluate(k => { const d = JSON.parse(localStorage.getItem(k)); const x = d.depots[0]; return { n: d.depots.length, q: x.question, l: x.lumiere, pistes: x.pistes, intact: x.text }; }, 'pepe-essai-v1')));
  await p.click(A('dfin')); await p.waitForTimeout(1200);
  await p.screenshot({ path: D + 'exemple-1-c-retour-accueil.png' });
  console.log('exemple 1, après « J’ai fini » :', JSON.stringify(await p.evaluate(() => [location.pathname + location.hash, (document.querySelector('.toast') || {}).textContent || ''])));
  await p.context().close();

  // --- exemple 2 : le parent d'un adulte, qui veut le dire lors d'une réunion ---
  p = await neuf();
  await p.click(A('porte', '[data-v="deposer"]')); await p.waitForSelector('main.deposer #draft'); await p.waitForTimeout(2600);
  await p.fill('#draft', 'Mon fils a 35 ans. Ce week-end, il est rentré à la maison et il n’a presque pas dormi. Lundi, nous avons une réunion avec l’équipe qui l’accompagne, et j’ai peur de ne pas trouver mes mots.');
  await p.$eval('#draft', e => { if (e.scrollHeight > e.clientHeight) e.style.height = (e.scrollHeight + 4) + 'px'; e.blur(); }); await p.waitForTimeout(300);
  await vue(p, 'main.deposer', 'exemple-2-a-question-et-choix', true);
  await p.click(A('ddire')); await p.waitForSelector('main.dire #amorce'); await p.waitForTimeout(2600);
  await p.click(A('dire', '[data-k="a"][data-v="reunion"]')); await p.waitForTimeout(600);
  await vue(p, 'main.dire', 'exemple-2-b-le-dire-a-quelqu-un', true);
  await p.click(A('dire', '[data-k="copie"]')); await p.waitForSelector('.dire-pret'); await sansToast(p);
  await vue(p, '.dire-pret', 'exemple-2-c-ce-qu-il-emporte', false, '.vers-relais');
  console.log('exemple 2, presse-papiers :', JSON.stringify(await p.evaluate(() => navigator.clipboard.readText().catch(e => 'ERR ' + e))));
  console.log('exemple 2 :', JSON.stringify(await p.evaluate(k => { const d = JSON.parse(localStorage.getItem(k)); const x = d.depots[0]; return { n: d.depots.length, pistes: x.pistes, dire: x.dire }; }, 'pepe-essai-v1')));
  if (errs.length) console.log('ERREURS', errs);
  await b.close();
})();
