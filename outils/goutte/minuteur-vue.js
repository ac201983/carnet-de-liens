// Le minuteur visuel : plein, en cours, presque fini, fini. Et le bouton qui y mène depuis la fiche « Les transitions ».
// node minuteur-vue.js <port> <base> <heure> <dossier>
const { chromium } = require('playwright'); const fs = require('fs');
const iso = n => { const d = new Date(Date.now() + n * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
(async () => {
  const [port, base, heure, dossier] = process.argv.slice(2); fs.mkdirSync(dossier, { recursive: true });
  const KEY = /essai/.test(base) ? 'pepe-essai-v1' : 'pepe-v1';
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true, locale: 'fr-CH' });
  await ctx.addInitScript(hh => { Date.prototype.getHours = function () { return hh; }; }, +heure);
  await ctx.addInitScript(([k, d]) => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify(d)); } catch (e) { } }, [KEY, { onboarded: true, start: iso(-20), tier: 'free', achats: {}, steps: {}, notes: {}, seen: {}, depots: [], moods: {}, pv: 3 }]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.stack || e).slice(0, 300)));
  await p.goto('https://localhost:' + port + base); await p.waitForSelector('.tab[data-act="go"][data-view="kit"]', { timeout: 15000 }); await p.waitForTimeout(600);
  // 1. depuis la fiche « Les transitions »
  await p.click('.tab[data-act="go"][data-view="kit"]'); await p.waitForTimeout(1500);
  const fiche = await p.$('[data-act="sit"][data-id="transitions"]');
  if (fiche) { await fiche.scrollIntoViewIfNeeded(); await fiche.click(); await p.waitForSelector('main.fiche'); await p.waitForTimeout(1600); const bt = await p.$('main.fiche .quick [data-tool="timer"]'); console.log('bouton sur la fiche :', bt ? (await bt.innerText()).trim() : 'ABSENT'); if (bt) { await bt.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await p.screenshot({ path: dossier + '/fiche-transitions-bouton.png' }); await bt.click(); } }
  else { console.log('fiche transitions introuvable dans la liste'); await p.click('[data-act="kit"][data-v="tools"]'); }
  await p.waitForSelector('.minuteur'); await p.waitForTimeout(1700);
  const etat = async () => p.evaluate(() => ({ num: document.getElementById('tnum').textContent, dash: document.getElementById('mv-part').style.strokeDasharray, outil: (document.querySelector('.chips [aria-pressed="true"]') || {}).textContent, y: Math.round(scrollY) }));
  console.log('arrivée', JSON.stringify(await etat())); await p.screenshot({ path: dossier + '/minuteur-plein.png' });
  await p.click('[data-act="tset"][data-m="1"]'); await p.waitForTimeout(200); await p.click('[data-act="ttoggle"]');
  if (process.argv[6] === "court") { await p.waitForTimeout(9000); console.log("après 9 s", JSON.stringify(await etat())); await p.screenshot({ path: dossier + "/minuteur-en-cours.png" }); await b.close(); return; }
  await p.waitForTimeout(21000); console.log('après 21 s', JSON.stringify(await etat())); await p.screenshot({ path: dossier + '/minuteur-en-cours.png' });
  await p.waitForTimeout(31000); console.log('après 52 s', JSON.stringify(await etat())); await p.screenshot({ path: dossier + '/minuteur-presque.png' });
  await p.waitForTimeout(9500); console.log('à la fin', JSON.stringify(await etat())); await p.screenshot({ path: dossier + '/minuteur-fini.png' });
  if (errs.length) console.log('ERREURS', errs.slice(0, 4));
  await b.close();
})();
