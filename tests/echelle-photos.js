// « Mon évolution » (l'échelle numérotée) et le photolangage (les 48 photos), avec les animations activées. usage : node echelle-photos.js
const { chromium } = require('playwright');
const OUT = '/home/claude/build/tiptop/vue';
const A = (act, extra = '') => `[data-act="${act}"]${extra}`;
let pass = 0, fail = 0; const ok = (c, m) => { if (c) pass++; else { fail++; console.log('  ÉCHEC : ' + m); } };
(async () => {
  const b = await chromium.launch();
  for (const [nom, w, h] of [['tel', 390, 844], ['ordi', 1280, 800]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ignoreHTTPSErrors: true, reducedMotion: 'no-preference', hasTouch: nom === 'tel' });
    await ctx.addInitScript(() => { try { if (!localStorage.getItem('pepe-v1')) localStorage.setItem('pepe-v1', JSON.stringify({ onboarded: true, me: 'Camille', tier: 'parcours', start: '2026-11-10', age: 'e', situation: 'hand', weights: [], evo: {}, steps: {}, moods: {}, depots: [], photo: { i: 4, text: 'Un ancien choix.', date: '2026-11-12' } })); } catch (e) { } });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto((process.env.PEPE_ORIGIN || 'https://localhost:8443') + (process.env.PEPE_BASE || '/carnet-de-liens/') + (process.env.PEPE_APPDIR !== undefined ? process.env.PEPE_APPDIR : 'parent-ecoute/')); await p.waitForTimeout(700);
    const c = await p.$('#consent [data-consent="no"]'); if (c) await c.click();
    ok(await p.evaluate(() => document.documentElement.classList.contains('fx')), nom + ' : les effets sont actifs');
    await p.click('.tab' + A('go', '[data-view="parcours"]')); await p.waitForTimeout(1500);
    await p.click('.quick ' + A('go', '[data-view="evo"]')); await p.waitForTimeout(1500);
    // faire glisser le rond du stress de 5 vers 9 à la souris
    const box = await p.$eval('#evo-r-stress', e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
    const xDe = v => box.x + 22 + (box.w - 44) * v / 10;
    await p.mouse.move(xDe(5), box.y + box.h / 2); await p.mouse.down(); await p.mouse.move(xDe(7), box.y + box.h / 2, { steps: 5 }); await p.mouse.move(xDe(9), box.y + box.h / 2, { steps: 5 }); await p.mouse.up();
    await p.waitForTimeout(250);
    const s = await p.evaluate(() => { const r = document.getElementById('evo-r-stress'); const sc = r.closest('.scale'); const th = sc.querySelector('.scale-thumb').getBoundingClientRect(); const cur = sc.querySelector('.scale-nums .cur span').getBoundingClientRect(); return { v: r.value, th: sc.querySelector('.scale-thumb').textContent, aria: r.getAttribute('aria-valuetext'), dx: Math.round((th.left + th.width / 2) - (cur.left + cur.width / 2)) }; });
    ok(s.v === '9' && s.th === '9' && s.aria === '9 sur 10', nom + ' : le rond glissé à 9 affiche 9 (' + JSON.stringify(s) + ')');
    ok(Math.abs(s.dx) <= 2, nom + ' : le rond est posé juste au-dessus de son chiffre (écart ' + s.dx + ' px)');
    await p.screenshot({ path: `${OUT}/${nom}-anim-evo.png` });
    // l'écran est redessiné (changer de moment puis revenir) : le réglage non enregistré est toujours là
    await p.click(A('evotime', '[data-v="t2"]')); await p.waitForTimeout(300); await p.click(A('evotime', '[data-v="t1"]')); await p.waitForTimeout(300);
    ok(await p.$eval('#evo-r-stress', e => e.value) === '9', nom + ' : le réglage en cours survit à un changement de moment');
    await p.click(A('back')); await p.waitForTimeout(1500);
    // photolangage : un ancien choix (le pictogramme no 4, « Une porte ») retrouve sa photo
    await p.click('.quick ' + A('go', '[data-view="photo"]')); await p.waitForTimeout(1600);
    ok(await p.evaluate(() => !!document.querySelector('.pstage') && /Une porte/.test(document.querySelector('.pstage figcaption').textContent) && document.getElementById('ptext').value === 'Un ancien choix.'), nom + ' : l’ancien choix retrouve la photo « Une porte » et son texte');
    await p.fill('#ptext', 'Un texte pas encore gardé.');
    await p.click(A('photoback')); await p.waitForTimeout(350);
    await p.screenshot({ path: `${OUT}/${nom}-anim-onde.png` });   // en pleine onde
    await p.waitForTimeout(1500);
    ok(await p.evaluate(() => document.querySelectorAll('.photos button').length === 48 && document.querySelector('.photos [aria-pressed="true"]').dataset.id === 'porte'), nom + ' : retour aux 48 photos, « Une porte » marquée');
    const ordre = () => p.evaluate(() => [...document.querySelectorAll('.photos button')].map(x => x.dataset.id).join(','));
    const o1 = await ordre();
    ok(new Set(o1.split(',')).size === 48, nom + ' : les 48 photos sont toutes là, une fois chacune');
    const bt = await p.$(A('photopick', '[data-id="etoiles"]')); await bt.scrollIntoViewIfNeeded(); await bt.click(); await p.waitForTimeout(450);
    await p.screenshot({ path: `${OUT}/${nom}-anim-onde2.png` });
    await p.waitForTimeout(1600);
    const st = await p.evaluate(() => ({ cap: (document.querySelector('.pstage figcaption') || {}).textContent, txt: (document.getElementById('ptext') || {}).value, y: window.scrollY, ok: (document.querySelector('.pstage img') || {}).naturalWidth, onde: document.documentElement.classList.contains('fx-onde') }));
    ok(st.cap === 'Une nuit étoilée' && st.txt === 'Un texte pas encore gardé.' && st.y === 0 && st.ok > 0 && !st.onde, nom + ' : la photo choisie s’affiche en grand, en haut, avec le texte en cours (' + JSON.stringify(st) + ')');
    await p.screenshot({ path: `${OUT}/${nom}-anim-photo.png` });
    await p.click(A('photosave')); await p.waitForTimeout(400);
    // revenir choisir une autre photo pendant la même visite : l'ordre n'a pas bougé. Quitter l'écran et y revenir : il a changé.
    await p.click(A('photoback')); await p.waitForTimeout(1700);
    ok(await ordre() === o1, nom + ' : pendant la visite, l’ordre des photos ne bouge pas');
    await p.click(A('back')); await p.waitForTimeout(1600);
    await p.click('.quick ' + A('go', '[data-view="photo"]')); await p.waitForTimeout(1600);
    await p.click(A('photoback')); await p.waitForTimeout(1700);
    const o2 = await ordre();
    ok(o2 !== o1 && new Set(o2.split(',')).size === 48, nom + ' : à la visite suivante, l’ordre a changé');
    const rec = await p.evaluate(() => JSON.parse(localStorage.getItem('pepe-v1')).photo);
    ok(rec.id === 'etoiles' && rec.i === undefined && rec.text === 'Un texte pas encore gardé.' && !!rec.date, nom + ' : enregistré par le nom de la photo (' + JSON.stringify(rec) + ')');
    ok(errs.length === 0, nom + ' : aucune erreur (' + errs.slice(0, 3).join(' | ') + ')');
    await ctx.close();
  }
  await b.close();
  console.log('échelle et photolangage, animations activées : ' + pass + ' vérifications réussies, ' + fail + ' en échec');
})();
