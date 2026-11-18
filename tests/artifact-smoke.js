// Vérifie la version « artefact Claude » (un seul fichier) : même code, sans les ajouts du site.
const { chromium } = require('playwright');
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage(); const errs = []; let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL ' + m); } };
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)|ERR_(TUNNEL|PROXY|CONNECTION|NAME|CERT|FAILED)/.test(m.text() + (m.location().url || ''))) errs.push(m.text().slice(0, 200)); });
  page.on('pageerror', e => errs.push('pageerror ' + String(e).slice(0, 200)));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('https://localhost:8443/pepe.html'); await page.waitForTimeout(400);
  ok(await page.$('.herofull h1'), 'accueil affiché');
  ok(!(await page.$('#consent')), 'pas de bandeau dans l’artefact');
  ok(!(await page.$('a[href="confidentialite.html"]')), 'pas de lien vers les pages du site dans l’artefact');
  ok(await page.$eval('.herobg', i => i.complete && i.naturalWidth > 0 && i.src.startsWith('data:')), 'image intégrée chargée');
  ok(/accueilli dans une famille/.test(await page.$eval('.voice', e => e.textContent)), 'le mot d’Antonio sur l’accueil');
  await page.click(A('peek-about')); await page.waitForTimeout(250);
  ok(/^Avant d’accompagner/.test(await page.$eval('h1', e => e.textContent)) && (await page.$$('.verbs li')).length === 3 && !/#/.test(page.url()), 'histoire ouverte dans l’artefact, adresse inchangée');
  await page.screenshot({ path: '/home/claude/build/artifact-histoire.png' });
  await page.click(A('back')); await page.waitForTimeout(150); ok(await page.$('.herofull'), 'retour à l’accueil');
  ok((await page.$$('.herofull .porte')).length === 3 && !(await page.$(A('partager'))) && !(await page.$('.acc-scenes a')), 'les 3 portes sont là, sans lien de fiche ni bouton d’envoi (l’artefact n’a pas d’adresses publiques)');
  await page.click('.herofull ' + A('porte', '[data-v="deposer"]')); await page.waitForTimeout(250);
  ok(await page.$('main.deposer #draft') && await page.$('.tabs'), 'un geste : l’écran pour déposer, dans l’espace');
  await page.fill('#draft', 'Ce soir j’ai crié et je m’en veux.'); await page.click(A('dsend')); await page.waitForTimeout(400);
  ok(await page.$('.mirror .q') && await page.$('.pistes-depot button.sit'), 'dépôt : réponse locale affichée hors de Claude, avec une piste');
  await page.click(A('back')); await page.waitForTimeout(200); ok(await page.$('.dose') && await page.$('.depot-jour'), 'Retour : « Aujourd’hui », avec la dose et le dépôt du jour');
  await page.click('.portes ' + A('porte', '[data-v="souffle"]')); await page.waitForTimeout(1800); ok((await page.textContent('#souffle-mot')) === 'Inspirez', 'souffler : la respiration démarre');
  await page.click(A('back')); await page.waitForTimeout(200); ok(await page.$('.dose'), 'Retour depuis la respiration');
  for (const v of ['parcours', 'kit', 'me']) { await page.click('.tab' + A('go', `[data-view="${v}"]`)); await page.waitForTimeout(80); ok(await page.$('#main h1'), 'écran ' + v); }
  await page.click(A('go', '[data-view="data"]')); await page.waitForTimeout(80);
  ok(!/Cookies et mesure/.test(await page.$eval('#main', e => e.textContent)), 'pas de carte « cookies » dans l’artefact');
  await page.screenshot({ path: '/home/claude/build/artifact-me.png' });
  await page.goto('https://localhost:8443/pepe.html'); await page.waitForTimeout(300); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(300);
  await page.screenshot({ path: '/home/claude/build/artifact-accueil.png' });
  // Dans Claude, la réponse est écrite par le modèle : on simule une réponse pleine de deux-points, de points-virgules et de tirets, et on vérifie ce qui s'affiche.
  {
    const c2 = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
    const p2 = await c2.newPage(); p2.on('pageerror', e => errs.push('pageerror ' + String(e).slice(0, 200)));
    await p2.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await p2.addInitScript(() => {
      const s = async () => ({ text: '## Ce que j’entends :\nVous tenez bon ; c’est déjà beaucoup.\n## Ce que vous pouvez essayer\n– Prévenez avant : « dans cinq minutes ».\n- Un seul choix — pas plus.\n## Pour vous\nVous êtes épuisé·e, et cela se comprend.' });
      s.json = async () => ({ miroir: 'On dirait que la fatigue est là — et la colère aussi.', question: 'De quoi auriez-vous besoin : d’aide ou de repos ?', lumiere: 'Vous faites de votre mieux ; cela se voit.' });
      window.claude = { use: async () => s };
    });
    await p2.goto('https://localhost:8443/pepe.html'); await p2.waitForTimeout(400);
    // qui écrit les réponses : dit dès l'accueil, puis avant le dépôt, puis sous chaque réponse
    ok(/une intelligence artificielle écrit la réponse/.test(await p2.$eval('main.view', e => e.innerText)), 'accueil : il est dit qu’une intelligence artificielle écrit la réponse');
    await p2.click('.herofull ' + A('entrer', '[data-v="parcours"]')); await p2.waitForTimeout(300); await p2.click('.tab' + A('go', '[data-view="today"]')); await p2.waitForTimeout(200);
    ok((await p2.$eval('.dose .sig', e => e.textContent)) === 'Antonio', 'dose du jour préparée à l’avance : signée Antonio');
    await p2.click('.portes ' + A('porte', '[data-v="deposer"]')); await p2.waitForTimeout(300);
    ok(/La réponse est écrite par une intelligence artificielle/.test(await p2.$eval('#draft', e => e.closest('.card').innerText)) && (await p2.$$('.chips.attente .chip')).length === 2, 'avant le dépôt : il est dit que la réponse est écrite par une intelligence artificielle, et les 2 intentions sont proposées là où elles donnent 2 réponses différentes');
    await p2.fill('#draft', 'Je n’ai plus envie de vivre comme ça, je suis à bout.'); await p2.click(A('dsend')); await p2.waitForTimeout(500);
    const t1 = await p2.$eval('.mirror', e => e.innerText);
    ok(/On dirait que la fatigue est là, et la colère aussi\./.test(t1) && /De quoi auriez-vous besoin, d’aide ou de repos \?/.test(t1) && /Vous faites de votre mieux\. Cela se voit\./.test(t1), 'réponse du modèle : remise dans la voix d’Antonio (' + t1.replace(/\s+/g, ' ').slice(0, 90) + '…)');
    ok((await p2.$$eval('.mirror a.tel', a => a.map(e => e.getAttribute('href')).join())) === 'tel:143,tel:144', 'détresse : aide affichée aussi quand le modèle répond');
    ok(/écrite par une intelligence artificielle/.test(await p2.$eval('.mirror .hint.ia', e => e.textContent).catch(() => '')), 'sous la réponse : il est dit qu’elle a été écrite par une intelligence artificielle');
    await p2.click(A('dconcret')); await p2.waitForTimeout(500);
    const t2 = await p2.$eval('.mirror', e => e.innerText.replace(/^.*\n/, ''));
    ok((await p2.$$('.mirror ul.list li')).length === 2 && !/[:;—–·]/.test(t2), '« Et concrètement ? » : liste lue, sans deux-points, point-virgule, tiret ni point médian (' + t2.replace(/\s+/g, ' ').slice(-80) + ')');
    await p2.screenshot({ path: '/home/claude/build/artifact-reponse.png', fullPage: true });
    // la dose écrite pour le parent par le modèle ne porte plus la signature d'Antonio
    await p2.evaluate(() => { const d = JSON.parse(localStorage.getItem('pepe-v1')); d.tier = 'parcours'; localStorage.setItem('pepe-v1', JSON.stringify(d)); });
    await p2.reload(); await p2.waitForTimeout(700);
    const perso = await p2.$(A('dose-perso'));
    ok(!!perso, 'formule Le parcours : le bouton de la dose personnalisée est là');
    if (perso) { await perso.click(); await p2.waitForTimeout(700); const sig = await p2.$eval('.dose .sig', e => e.textContent); ok(/intelligence artificielle/.test(sig) && !/^Antonio$/.test(sig), 'dose personnalisée : elle ne porte plus la signature d’Antonio (« ' + sig + ' »)'); }
    await c2.close();
  }
  console.log((fails ? fails + ' échec(s)' : 'artefact : tout passe') + ' · erreurs console : ' + (errs.length ? errs.join(' | ') : 'aucune'));
  await b.close(); process.exit(fails || errs.length ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
