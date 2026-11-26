// Les anciennes adresses de la version d'essai (…/essai/…) mènent à la même page du site.
// La version d'essai a été retirée le 26 novembre 2026 : tout ce qu'elle contenait est sur le site lui-même. Les liens déjà envoyés
// (une fiche, une fiche de relais, le film, la capsule) doivent continuer de s'ouvrir, et ce qui suit le signe # doit être gardé :
// c'est là qu'une fiche de relais porte tout son contenu.
// L'essai vérifie aussi que les notes écrites dans la version d'essai restent sur l'appareil : elles ne sont plus affichées, elles ne sont pas effacées.
// usage : node ancien-essai.js      Variables : PEPE_ORIGIN (https://localhost:8449 par défaut, la répétition de l'atelier), PEPE_NAV, PEPE_CHROME.
const pw = require('playwright'); const fs = require('fs');
const NAV = process.env.PEPE_NAV || 'chromium';
const ORIGIN = (process.env.PEPE_ORIGIN || 'https://localhost:8449').replace(/\/$/, '');
// un lien de fiche de relais fabriqué le 19 novembre 2026 dans la version d'essai (une fiche inventée, celle de l'essai lancement.js)
const FICHE = 'relais/#f=1.YQQTTm_DqQRUEthSsMOpbWkFVCAHNSAq_jYfJweLQ69Dr0OvQ6gJQf4uBUBEL0QvRC4DgAQBokRdQwB1LeUjAQLwcyfQYQxuaWzgLbJvaXIuzxHBElI0dp9RdHI2oLLyOQDhY2GfoTgSPYByb-8GkTbdPfIkgm6KkXqwo7b_BkIYChJ_En8SfxJ_En8Sfx8SfyfKExJu3gNBcMOi468CEqByaXoQwQFiLvD_BEQthYNfg1-DX4NSLvg3MnMvQTcBMDAAQAAwL74xADkifa6BYw';
const NOTES_ESSAI = JSON.stringify({ me: 'Camille', onboarded: true, pv: 3, depots: [{ id: 'd1', date: '2026-11-20', time: '21:40', text: 'Écrit dans la version d’essai.', mode: 'listen' }] });
let n = 0, ko = 0; const ok = (c, m) => { n++; if (!c) { ko++; console.log('  ÉCHEC : ' + m); } };
const net = s => String(s || '').replace(/\s+/g, ' ').trim();
(async () => {
  const LOCAL = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
  const exe = NAV === 'chromium' ? (process.env.PEPE_CHROME || (fs.existsSync(LOCAL) ? LOCAL : undefined)) : undefined;
  const b = await pw[NAV].launch(Object.assign({}, NAV === 'chromium' ? { args: ['--ignore-certificate-errors'] } : {}, exe ? { executablePath: exe } : {}));
  const opts = Object.assign({ viewport: { width: 390, height: 664 }, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce', hasTouch: true }, NAV === 'chromium' ? { isMobile: true } : {});
  // les notes de l'essai sont déjà sur l'appareil, comme chez un parent qui y avait écrit
  const ctx = await b.newContext(Object.assign({ storageState: { cookies: [], origins: [{ origin: ORIGIN, localStorage: [{ name: 'pepe-essai-v1', value: NOTES_ESSAI }] }] } }, opts));
  const errs = [];
  const ouvre = async chemin => {
    const page = await ctx.newPage();
    page.on('pageerror', e => errs.push(chemin + ' : ' + String(e).slice(0, 160)));
    const rep = await page.goto(ORIGIN + '/' + chemin, { waitUntil: 'domcontentloaded' }).catch(e => { errs.push(chemin + ' : ' + String(e).slice(0, 160)); return null; });
    // la suite des renvois suivis par le navigateur avant d'arriver : « 302 /essai/ »
    const renvois = []; let r = rep && rep.request().redirectedFrom();
    while (r) { const rr = await r.response().catch(() => null); renvois.unshift((rr ? rr.status() : '?') + ' ' + r.url().replace(ORIGIN, '').slice(0, 60)); r = r.redirectedFrom(); }
    await page.waitForTimeout(900);
    return { page, renvois, url: () => page.url().replace(ORIGIN, '') };
  };
  const attend = async (page, sel, ms = 8000) => { try { await page.waitForSelector(sel, { timeout: ms }); return true; } catch (e) { return false; } };

  // 1. l'accueil de l'essai
  let v = await ouvre('essai/');
  ok(v.url() === '/' && (await attend(v.page, '.seuil .portes')) && v.renvois.length === 1 && /^302 /.test(v.renvois[0]), '1. …/essai/ mène à l’accueil du site, par un seul renvoi provisoire (302) ' + JSON.stringify([v.url(), v.renvois]));
  ok(/index,follow/.test(await v.page.getAttribute('meta[name="robots"]', 'content').catch(() => '')), '1. la page ouverte est bien celle du site officiel (elle se laisse référencer, l’essai ne le permettait pas)');
  await v.page.close();
  v = await ouvre('essai');
  ok(v.url() === '/' && (await attend(v.page, '.seuil .portes')), '1. …/essai sans barre finale mène aussi à l’accueil ' + JSON.stringify([v.url(), v.renvois]));
  await v.page.close();

  // 2. le film et la capsule, par leur adresse
  v = await ouvre('essai/#film');
  // (une fois le lecteur ouvert, le site retire lui-même « #film » de l'adresse : le retour arrière mène ainsi à l'accueil)
  ok(['/', '/#film'].includes(v.url()) && (await attend(v.page, '#film-l')), '2. …/essai/#film mène au site, et le lecteur du film s’ouvre ' + JSON.stringify([v.url(), v.renvois]));
  ok(/Ce qu.on ne dit pas par SMS/.test(net(await v.page.textContent('#film-l').catch(() => ''))), '2. le lecteur montre « Ce qu’on ne dit pas par SMS »');
  await v.page.close();
  v = await ouvre('essai/#capsule');
  ok(['/', '/#capsule'].includes(v.url()) && (await attend(v.page, '#film-l')) && /Et vous \?/.test(net(await v.page.textContent('#film-l').catch(() => ''))), '2. …/essai/#capsule mène au site, et la capsule « Et vous ? » s’ouvre ' + JSON.stringify([v.url(), v.renvois]));
  await v.page.close();

  // 3. une situation, par son adresse
  v = await ouvre('essai/fiches/quand-il-ou-elle-vit-ailleurs/');
  ok(v.url() === '/fiches/quand-il-ou-elle-vit-ailleurs/' && (await attend(v.page, 'h1')) && net(await v.page.textContent('h1')) === 'Quand il ou elle vit ailleurs', '3. une fiche ouverte par son ancienne adresse s’ouvre à sa nouvelle adresse ' + JSON.stringify([v.url(), v.renvois]));
  await v.page.close();

  // 4. une fiche de relais envoyée à un proche : tout son contenu est dans ce qui suit le signe #
  v = await ouvre('essai/' + FICHE);
  const la = await attend(v.page, '.v-relais .rl-fiche');
  const f = la ? await v.page.evaluate(() => ({ h1: (document.querySelector('main h1') || {}).innerText || '', trois: [...document.querySelectorAll('.rl-fiche .rl-trois li')].map(e => e.innerText.replace(/\s+/g, ' ').trim()) })) : { h1: '', trois: [] };
  ok(v.url() === '/' + FICHE, '4. le lien d’une fiche de relais garde tout ce qui suit le signe #, au caractère près ' + JSON.stringify([v.url().slice(0, 40), v.url().length, FICHE.length + 1, v.renvois.length]));
  ok(la && net(f.h1) === 'Le relais de Noé' && f.trois.length === 3 && f.trois[2] === 'Noé choisit lui-même son dessin animé du soir.', '4. la fiche de relais s’ouvre, mot pour mot ' + JSON.stringify([net(f.h1), f.trois.length]));
  await v.page.close();

  // 5. les pages du site ouvertes par un mot après le signe #, et la page à transmettre
  v = await ouvre('essai/#formules');
  ok(v.url() === '/#formules' && (await attend(v.page, 'main')) && /CHF/.test(net(await v.page.textContent('#app').catch(() => ''))), '5. …/essai/#formules mène à la page des offres du site ' + JSON.stringify([v.url(), v.renvois]));
  await v.page.close();
  v = await ouvre('essai/transmettre/');
  ok(v.url() === '/transmettre/' && (await attend(v.page, 'h1')), '5. la page à transmettre s’ouvre à sa nouvelle adresse ' + JSON.stringify([v.url(), v.renvois]));
  // 6. les notes de l'essai sont toujours sur l'appareil, intactes, et le site ne les montre pas
  const notes = await v.page.evaluate(() => ({ essai: localStorage.getItem('pepe-essai-v1'), site: localStorage.getItem('pepe-v1') }));
  ok(notes.essai === NOTES_ESSAI, '6. les notes écrites dans la version d’essai sont toujours sur l’appareil, au caractère près');
  ok(!notes.site || !/Écrit dans la version d’essai/.test(notes.site), '6. le site garde ses propres notes : celles de l’essai n’y sont pas mêlées');
  await v.page.close();
  ok(errs.length === 0, 'aucune erreur dans les pages ' + JSON.stringify(errs.slice(0, 3)));
  await b.close();
  console.log(`anciennes adresses de l’essai (${NAV}) : ${n} vérifications, ${ko} échec${ko > 1 ? 's' : ''} (${ORIGIN}/essai/)`);
  process.exit(ko ? 1 : 0);
})().catch(e => { console.log('  ÉCHEC : l’essai s’est arrêté : ' + String(e).slice(0, 300)); process.exit(1); });
