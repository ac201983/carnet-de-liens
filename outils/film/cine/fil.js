// Photographie le fil de messages du montage cinématographique, une image par trentième de seconde.
// node fil.js <scène a|e|ta|te> <dossier> <images> "<paramètres de l'adresse, en images : f1=12&n1=46&ap=69…>"      node fil.js verrou|reveil <fichier.png>
const { chromium } = require('playwright'); const fs = require('fs');
const [sc = 'a', out = 'cap/fila', N = '262', PAR = '', HAUT = '693', DSF = '5'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const verrou = sc === 'verrou' || sc === 'reveil';
  const ctx = await b.newContext({ viewport: { width: 390, height: verrou ? 844 : +HAUT }, deviceScaleFactor: verrou ? 3 : +DSF });
  const p = await ctx.newPage(); await p.goto('file://' + __dirname + '/fil.html?s=' + sc + '&h=' + HAUT + (PAR ? '&' + PAR : '')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  if (verrou) { await p.screenshot({ path: out }); console.log(sc, 'fait', out); await b.close(); return; }
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true }); const env = [], champ = [], bulle = [];
  for (let i = 0; i < +N; i++) {
    await p.evaluate(t => window.etat(t), i / 30); const r = await p.evaluate(() => [window.REPERES.ENV_T, window.REPERES.CHAMP_T, window.REPERES.BULLE_T]); env.push(r[0]); champ.push(r[1]); bulle.push(r[2]);
    fs.writeFileSync(out + '/' + String(i).padStart(4, '0') + '.jpg', await p.screenshot({ type: 'jpeg', quality: 95 }));
  }
  const rep = await p.evaluate(() => window.REPERES); rep.ENV_I = env; rep.CHAMP_I = champ; rep.BULLE_I = bulle; rep.images = +N; rep.par = PAR;
  fs.writeFileSync(out + '/reperes.json', JSON.stringify(rep));
  const im = t => t === null || t === undefined ? '-' : (t * 30).toFixed(1);
  console.log('fil', sc, N, 'images | texte 1 :', im(rep.T1[0]), '→', im(rep.FIN1), '| appui', im(rep.T_APPUI), 'envoi', im(rep.T_ENVOI), '| texte 2 :', im(rep.T2[0]), '→', im(rep.FIN2), '| efface', im(rep.T_EFF[0]), '→', im(rep.FIN_EFF), '| Envoyer', JSON.stringify(env[env.length - 1]), '| effacer', JSON.stringify(rep.EFF));
  await b.close();
})();
