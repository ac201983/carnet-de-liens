// Exploration des écrans réels de la version d'essai, pour le film de présentation. node explore.js <parcours>
const { chromium } = require('playwright'); const fs = require('fs');
const APP = 'https://localhost:8446/essai/'; const quoi = process.argv[2] || 'depot';
const txt = async p => (await p.evaluate(() => { const m = document.querySelector('main'); return (m ? m.className + ' || ' : '') + (m ? m.innerText : document.body.innerText).replace(/\n{2,}/g, '\n').slice(0, 2600); }));
(async () => {
  const b = await chromium.launch({ args: ['--ignore-certificate-errors'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, isMobile: true, hasTouch: true, locale: 'fr-CH' });
  const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', String(e).slice(0, 200)));
  let n = 0; const vue = async (nom, plein) => { n++; const f = 'vu/' + quoi + '-' + String(n).padStart(2, '0') + '-' + nom + '.jpg'; await p.screenshot({ path: f, type: 'jpeg', quality: 80, fullPage: !!plein }); console.log('\n##### ' + f + '\n' + await txt(p)); };
  await p.goto(APP, { waitUntil: 'load' }); await p.waitForSelector('.seuil'); await p.waitForTimeout(1500);
  if (quoi === 'accueil') { await vue('accueil', true); console.log(await p.evaluate(() => [...document.querySelectorAll('[data-act]')].map(e => e.getAttribute('data-act') + ':' + (e.getAttribute('data-v') || e.getAttribute('data-k') || '') + ':' + e.innerText.replace(/\s+/g, ' ').slice(0, 60)).join('\n'))); }
  if (quoi === 'depot') {
    await p.click('.seuil [data-act="porte"][data-v="deposer"]'); await p.waitForTimeout(1200); await vue('ecran', true);
    await p.fill('#draft', 'On s’est encore disputés pour la tablette. Ça me manque de jouer avec elle.'); await p.waitForTimeout(400); await vue('ecrit', true);
    await p.click('[data-act="ddire"]'); await p.waitForTimeout(1500); await vue('dire', true);
    console.log(await p.evaluate(() => [...document.querySelectorAll('main [data-act], main textarea, main input')].map(e => e.tagName + ':' + (e.getAttribute('data-act') || e.id) + ':' + (e.getAttribute('data-k') || e.getAttribute('data-v') || '') + ':' + (e.value || e.innerText || '').replace(/\s+/g, ' ').slice(0, 90)).join('\n')));
  }

  const actes = async () => console.log(await p.evaluate(() => [...document.querySelectorAll('main [data-act], main textarea, main input, main select')].map(e => e.tagName + ':' + (e.getAttribute('data-act') || e.id) + ':' + ['data-k','data-v','data-i','data-id','data-f'].map(a => e.getAttribute(a) || '').join(',') + ':' + (e.value || e.innerText || '').replace(/\s+/g, ' ').slice(0, 70)).join('\n')));
  if (quoi === 'ecrans') {
    await p.click('.seuil [data-act="porte"][data-v="piste"]'); await p.waitForTimeout(1200); await vue('piste', true); await actes();
    const s = await p.$$('main [data-act="sit"]'); for (const e of s) { if (/Les écrans/.test(await e.innerText())) { await e.click(); break; } }
    await p.waitForTimeout(1300); await vue('fiche', true); await actes();
  }
  if (quoi === 'ecrans2') {
    await p.evaluate(() => window.scrollTo(0, 99999)); const s = await p.$$('[data-act="sit"]'); for (const e of s) { if (/Les écrans/.test(await e.innerText())) { await e.scrollIntoViewIfNeeded(); await e.click(); break; } }
    await p.waitForTimeout(1300); await vue('fiche', true); await actes();
  }
  if (quoi === 'relais') {
    console.log(await p.evaluate(() => [...document.querySelectorAll('[data-act="rl"]')].map(e => e.outerHTML.slice(0, 160)).join('\n'))); await p.click('.ex-relais [data-act="rl"], [data-act="rl"]:has-text("Voir la fiche de Bastien")'); await p.waitForTimeout(1300); await vue('exemple', true); await actes();
  }
  if (quoi === 'etape7') {
    await p.click('[data-act="entrer"][data-v="parcours"]'); await p.waitForTimeout(1300); await vue('parcours', true); await actes();
  }

  if (quoi === 'minuteur') {
    await p.click('.seuil [data-act="porte"][data-v="piste"]'); await p.waitForTimeout(1000);
    await p.click('main [data-act="kit"][data-v="tools"]'); await p.waitForTimeout(900); await vue('outils', true); await actes();
    const s = await p.$$('main [data-act]'); for (const e of s) { if (/Minuteur visuel/.test(await e.innerText())) { await e.click(); break; } }
    await p.waitForTimeout(1300); await vue('minuteur', true); await actes();
    console.log(await p.evaluate(() => (document.querySelector('main') || document.body).innerHTML.slice(0, 3000)));
  }

  if (quoi === 'apercu') {
    await p.goto(APP + '#apercu'); await p.waitForTimeout(1600); await vue('apercu', true); await actes();
  }
  if (quoi === 'formules') {
    await p.goto(APP + '#formules'); await p.waitForTimeout(1600); await vue('formules', true); await actes();
  }

  if (quoi === 'apercu2') {
    await p.goto(APP + '#apercu'); await p.waitForTimeout(1600);
    for (let k = 0; k < 4; k++) { await p.click('main [data-act="schnext"]'); await p.waitForTimeout(700); } await vue('vague5', true);
    await p.click('main [data-act="ap"]'); await p.waitForTimeout(1200); await vue('geste', true); await actes();
    const s = await p.$$('main button, main label'); for (const e of s) { if (/Poser les mains à plat/.test(await e.innerText())) { await e.click(); break; } }
    await p.waitForTimeout(900); await vue('geste-choisi', true); await actes();
    const g = await p.$$('main button'); for (const e of g) { if (/Garder ce geste dans mon carnet/.test(await e.innerText())) { await e.click(); break; } }
    await p.waitForTimeout(1200); await vue('carnet', true); await actes();
  }
  await b.close();
})();
