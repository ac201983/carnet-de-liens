// Vérifie l'ancienne adresse après le déménagement vers parent-ecoute.ch.
//   - un visiteur qui n'a rien écrit ici part tout de suite vers la nouvelle adresse ;
//   - celui qui a déjà écrit ici est prévenu, peut rester pour relire ses notes, et rien n'est effacé ;
//   - les pages de texte et la page 404 ramènent à la nouvelle adresse.
// usage : PEPE_ORIGIN=https://localhost:8446 node tests/demenage.js   (le site de l'ancienne adresse, servi en local sous /carnet-de-liens/)
const { chromium } = require('playwright');
const fs = require('fs');
const ORIGIN = process.env.PEPE_ORIGIN || 'https://localhost:8443';
const OLD = ORIGIN + '/carnet-de-liens/parent-ecoute/';
const NEW = 'https://parent-ecoute.ch/';
const SHOTS = process.env.PEPE_SHOTS || '';
let ok = 0, ko = 0;
const check = (name, cond, extra = '') => { if (cond) { ok++; console.log('  ok     ' + name); } else { ko++; console.log('  ÉCHEC  ' + name + (extra ? ' : ' + extra : '')); } };

(async () => {
  const browser = await chromium.launch();
  const neuf = async (opts = {}) => {
    const ctx = await browser.newContext(Object.assign({ viewport: { width: 390, height: 844 }, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' }, opts));
    // La nouvelle adresse n'est pas jointe pour de vrai : on répond à sa place.
    await ctx.route('https://parent-ecoute.ch/**', r => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: '<!doctype html><title>nouvelle adresse</title><p id="nouveau">nouvelle adresse</p>' }));
    return ctx;
  };
  const poser = (ctx, etat) => ctx.addInitScript(e => { if (location.hostname === 'localhost' && !localStorage.getItem('pepe-v1')) localStorage.setItem('pepe-v1', JSON.stringify(e)); }, etat);
  const NOTES = { onboarded: true, me: 'Camille' };

  // ----- 1. Sans notes : on part tout de suite
  {
    const ctx = await neuf(); const page = await ctx.newPage();
    await page.goto(OLD); await page.waitForURL(NEW, { timeout: 5000 }).catch(() => {});
    check('sans notes, l’accueil renvoie vers la nouvelle adresse', page.url() === NEW, page.url());
    await page.goto(OLD + '#histoire'); await page.waitForURL(NEW + '#histoire', { timeout: 5000 }).catch(() => {});
    check('le renvoi garde #histoire', page.url() === NEW + '#histoire', page.url());
    await ctx.close();
  }
  {
    const ctx = await neuf(); await poser(ctx, { onboarded: false, fxOff: true }); const page = await ctx.newPage();
    await page.goto(OLD); await page.waitForURL(NEW, { timeout: 5000 }).catch(() => {});
    check('un visiteur passé sans s’inscrire est renvoyé aussi', page.url() === NEW, page.url());
    await ctx.close();
  }

  // ----- 2. Avec des notes : on est prévenu, et on peut rester
  {
    const ctx = await neuf(); await poser(ctx, NOTES); const page = await ctx.newPage();
    const erreurs = []; page.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); }); page.on('pageerror', e => erreurs.push(String(e)));
    await page.goto(OLD); await page.waitForTimeout(600);
    check('avec des notes, on reste à l’ancienne adresse', page.url().startsWith(OLD), page.url());
    check('la fenêtre « Cet espace a déménagé » est affichée', await page.isVisible('#demenage .sheet'));
    check('son titre', (await page.textContent('#dm-title')) === 'Cet espace a déménagé');
    check('le bouton principal mène à la nouvelle adresse', (await page.getAttribute('#dm-go', 'href')) === NEW);
    check('le clavier arrive sur le bouton principal', await page.evaluate(() => document.activeElement && document.activeElement.id === 'dm-go'));
    const texte = await page.innerText('#demenage');
    check('la voix : ni deux-points, ni point-virgule, ni tiret long, ni point médian', !/[:;—–·]/.test(texte), texte.match(/[:;—–·]/));
    check('aucun débordement à 390 px', await page.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth));
    await page.keyboard.press('Tab');
    check('Tab passe au second bouton', await page.evaluate(() => document.activeElement.id === 'dm-stay'));
    await page.keyboard.press('Tab');
    check('Tab revient au premier, sans sortir de la fenêtre', await page.evaluate(() => document.activeElement.id === 'dm-go'));
    await page.keyboard.press('Shift+Tab');
    check('Maj+Tab aussi', await page.evaluate(() => document.activeElement.id === 'dm-stay'));
    if (SHOTS) await page.screenshot({ path: SHOTS + '/demenage-390.png' });
    await page.setViewportSize({ width: 320, height: 568 }); await page.waitForTimeout(200);
    check('aucun débordement à 320 px', await page.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth));
    const b = await page.evaluate(() => { const r = document.querySelector('#dm-stay').getBoundingClientRect(); return r.bottom <= window.innerHeight + 1 && r.top >= 0; });
    check('à 320 × 568, les deux boutons tiennent dans l’écran', b);
    if (SHOTS) await page.screenshot({ path: SHOTS + '/demenage-320.png' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('#dm-stay'); await page.waitForTimeout(150);
    check('« Rester ici » referme la fenêtre', !(await page.$('#demenage')));
    check('l’espace est utilisable derrière', await page.isVisible('.tab'));
    check('les notes sont toujours là', await page.evaluate(() => JSON.parse(localStorage.getItem('pepe-v1')).me === 'Camille'));
    await page.reload(); await page.waitForTimeout(500);
    check('dans la même visite, la fenêtre ne revient pas', !(await page.$('#demenage')));
    check('aucune erreur dans la console', erreurs.length === 0, erreurs.join(' | '));
    // un nouvel onglet = une nouvelle visite
    const p2 = await ctx.newPage(); await p2.goto(OLD); await p2.waitForTimeout(500);
    check('à la visite suivante, la fenêtre revient', await p2.isVisible('#demenage .sheet'));
    await p2.keyboard.press('Escape'); await p2.waitForTimeout(100);
    check('Échap la referme', !(await p2.$('#demenage')));
    const p3 = await ctx.newPage(); await p3.goto(OLD); await p3.waitForTimeout(500);
    await p3.click('#dm-go'); await p3.waitForURL(NEW, { timeout: 5000 }).catch(() => {});
    check('« Aller à la nouvelle adresse » y mène', p3.url() === NEW, p3.url());
    await ctx.close();
  }
  // grand écran
  {
    const ctx = await neuf({ viewport: { width: 1280, height: 800 } }); await poser(ctx, NOTES); const page = await ctx.newPage();
    await page.goto(OLD); await page.waitForTimeout(600);
    const r = await page.evaluate(() => { const s = document.querySelector('#demenage .sheet').getBoundingClientRect(); return { l: s.left, r: window.innerWidth - s.right, w: s.width, sw: document.scrollingElement.scrollWidth, iw: window.innerWidth }; });
    check('sur ordinateur, la fenêtre est au centre', Math.abs(r.l - r.r) < 2 && r.w <= 600, JSON.stringify(r));
    check('aucun débordement à 1280 px', r.sw <= r.iw);
    if (SHOTS) await page.screenshot({ path: SHOTS + '/demenage-1280.png' });
    await ctx.close();
  }
  // accessibilité automatique de la fenêtre
  {
    const ctx = await neuf({ bypassCSP: true }); await poser(ctx, NOTES); const page = await ctx.newPage();
    await page.goto(OLD); await page.waitForTimeout(600);
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const v = await page.evaluate(async () => (await window.axe.run('#demenage')).violations.map(x => x.id + ' (' + x.nodes.length + ')'));
    check('axe ne trouve aucun défaut dans la fenêtre', v.length === 0, v.join(', '));
    await ctx.close();
  }

  // ----- 3. Les pages de texte et le tableau de bord de démonstration
  for (const f of ['conditions.html', 'confidentialite.html', 'antonio.html']) {
    const ctx = await neuf(); const page = await ctx.newPage();
    await page.goto(OLD + f); await page.waitForURL(NEW + f, { timeout: 5000 }).catch(() => {});
    check(f + ' renvoie vers la même page à la nouvelle adresse', page.url() === NEW + f, page.url());
    await ctx.close();
  }

  // ----- 4. La page 404 de l'ancienne adresse
  {
    const ctx = await neuf(); const page = await ctx.newPage();
    const rep = await page.goto(ORIGIN + '/carnet-de-liens/une-page-qui-n-existe-pas');
    check('une adresse inconnue répond 404', rep.status() === 404, String(rep.status()));
    check('son bouton ramène à la nouvelle adresse', (await page.getAttribute('main .btn.primary', 'href')) === NEW);
    await ctx.close();
  }

  await browser.close();
  console.log(`\n${ok} vérifications réussies, ${ko} en échec`);
  process.exit(ko ? 1 : 0);
})();
