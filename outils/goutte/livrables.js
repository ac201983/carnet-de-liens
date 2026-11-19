// Ce qu'Antonio a demandé à voir pour le logo : un écran au format iPhone, et une fiche « Passer le relais » prête à imprimer.
// node livrables.js <port> <base> <heure> <dossier>
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const [port, base, heure, dossier] = process.argv.slice(2); fs.mkdirSync(dossier, { recursive: true });
  const APP = 'https://localhost:' + port + base;
  const b = await chromium.launch();
  // 1. l'accueil sur un iPhone (390 points de large, 3 points d'écran par point)
  { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true, locale: 'fr-CH', reducedMotion: 'reduce' });
    await ctx.addInitScript(hh => { Date.prototype.getHours = function () { return hh; }; }, +heure);
    const p = await ctx.newPage(); await p.goto(APP); await p.waitForSelector('.seuil .porte'); await p.waitForTimeout(1500);
    await p.screenshot({ path: dossier + '/logo-accueil-iphone.png' });
    console.log('accueil :', JSON.stringify(await p.evaluate(() => { const w = document.querySelector('main.intro .hbar .wordmark'), l = w && w.querySelector('svg.logo'), s = w && w.querySelector('small'); const r = e => e ? [Math.round(e.getBoundingClientRect().width), Math.round(e.getBoundingClientRect().height)] : null; return { nom: w ? w.innerText.replace(/\s+/g, ' ').trim() : '', logo: r(l), ellipses: l ? l.querySelectorAll('ellipse').length : 0, ligne1: w ? getComputedStyle(w).fontSize : '', ligne2: s ? getComputedStyle(s).fontSize + ' ' + getComputedStyle(s).fontWeight + ' ' + getComputedStyle(s).color : '', couleur1: w ? getComputedStyle(w).color : '', photo: !!document.querySelector('.herofull .herobg, .herofull img') }; })));
    await ctx.close(); }
  // 2. la navigation d'un parent déjà entré (« Aujourd'hui »)
  { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true, locale: 'fr-CH', reducedMotion: 'reduce' });
    await ctx.addInitScript(hh => { Date.prototype.getHours = function () { return hh; }; }, +heure);
    const p = await ctx.newPage(); await p.goto(APP); await p.waitForSelector('.seuil .porte'); await p.waitForTimeout(600);
    await p.evaluate(() => document.querySelector('[data-act="entrer"][data-v="today"]').click()); await p.waitForSelector('main.view .dose'); await p.waitForTimeout(1500);
    await p.screenshot({ path: dossier + '/logo-aujourdhui-iphone.png' });
    console.log('aujourd’hui :', JSON.stringify(await p.evaluate(() => { const w = document.querySelector('.bar .wordmark'); return { nom: w ? w.innerText.replace(/\s+/g, ' ').trim() : '', logo: w ? w.querySelectorAll('svg.logo ellipse').length : 0 }; })));
    await ctx.close(); }
  // 3. une fiche prête à imprimer : l'exemple « Un adulte », en A4
  { const ctx = await b.newContext({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, locale: 'fr-CH', reducedMotion: 'reduce' });
    const p = await ctx.newPage(); await p.goto(APP + '#relais'); await p.waitForSelector('main.v-relais [data-act="rl"][data-k="exemple"]'); await p.waitForTimeout(500);
    await p.click('[data-act="rl"][data-k="exemple"]'); await p.waitForSelector('.v-relais .rl-fiche'); await p.waitForTimeout(600);
    await p.click('[data-act="rl"][data-k="ex"][data-v="g"]'); await p.waitForTimeout(500);
    await p.emulateMedia({ media: 'print' });
    const pdf = await p.pdf({ format: 'A4', printBackground: true }); fs.writeFileSync(dossier + '/fiche-prete-a-imprimer.pdf', pdf);
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log('fiche :', JSON.stringify(await p.evaluate(() => { const f = document.querySelector('.v-relais .rl-fiche'); const g = f.querySelector('.rl-goutte'); return { titre: f.querySelector('.rl-t').textContent, logo: g ? g.querySelectorAll('svg.logo ellipse').length : 0, fond: g ? getComputedStyle(g).backgroundColor : '', anim: getComputedStyle(f).animationName, trois: f.querySelector('.rl-trois h3').textContent }; })), 'pages', pages);
    await ctx.close(); }
  await b.close();
})();
