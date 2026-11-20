// Photographie le fil de messages du film de présentation, une image par trentième de seconde. node fil.js <scene 1|2> <dossier> <images>
const { chromium } = require('playwright'); const fs = require('fs');
const [scene = '1', out = 'cap/fil1', N = '114', HAUT = '693', DSF = '5'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: +HAUT }, deviceScaleFactor: +DSF });
  const p = await ctx.newPage(); await p.goto('file://' + __dirname + '/fil.html?scene=' + scene + '&h=' + HAUT); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true }); const env = [];
  for (let i = 0; i < +N; i++) { await p.evaluate(t => window.etat(t), i / 30); env.push(await p.evaluate(() => window.REPERES.ENV_T)); fs.writeFileSync(out + '/' + String(i).padStart(4, '0') + '.jpg', await p.screenshot({ type: 'jpeg', quality: 95 })); }
  const rep = await p.evaluate(() => window.REPERES); rep.ENV_I = env; rep.HAUT = +HAUT; rep.bulle = await p.evaluate(() => { const r = document.getElementById('rep').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  fs.writeFileSync(out + '/reperes.json', JSON.stringify(rep)); console.log('fil', scene, N, 'images', 'frappe finie', rep.T_FIN_FRAPPE.toFixed(2), 'appui', rep.T_APPUI.toFixed(2), 'envoi', rep.T_ENVOI.toFixed(2), JSON.stringify(rep.bulle), JSON.stringify(env[env.length - 1]));
  await b.close();
})();
