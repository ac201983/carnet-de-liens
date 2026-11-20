// Les icônes de l'écran d'accueil du téléphone : la goutte du logo et ses 2 ondes, sur le vert du site (réponse d'Antonio du 20 novembre 2026).
// Le dessin est celui de favicon.svg. node icones.js <dossier de sortie>
const { chromium } = require('playwright'); const fs = require('fs');
const out = process.argv[2] || '/home/claude/site-src/icons';
const DESSIN = '<path d="M32 8C32 8 20 22.6 20 31a12 12 0 0 0 24 0C44 22.6 32 8 32 8z" fill="#F4EFD8"/><path d="M27.6 28.4c0-2.8 1.2-6 3-8.6" fill="none" stroke="#164426" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="32" cy="51" rx="10.5" ry="3.4" fill="none" stroke="#B4DE9C" stroke-width="2.8"/><ellipse cx="32" cy="51.5" rx="21.5" ry="7" fill="none" stroke="#B4DE9C" stroke-width="2.2" opacity=".6"/>';
// echelle : la taille du dessin dans le carré (1 = celle de favicon.svg). rayon : l'arrondi du fond (0 = carré plein, que le téléphone arrondit lui-même).
const svg = (echelle, rayon) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="' + rayon + '" fill="#07240F"/><g transform="translate(32 33.2) scale(' + echelle + ') translate(-32 -33.2)">' + DESSIN + '</g></svg>';
const ICONES = [
  ['apple-touch-icon.png', 180, .9, 0, false],      // iPhone : carré plein, l'iPhone arrondit les coins
  ['icon-192.png', 192, 1, 14, true],               // Android et ordinateur : le même carré arrondi que l'icône de l'onglet
  ['icon-512.png', 512, 1, 14, true],
  ['icon-maskable-512.png', 512, .72, 0, false],    // Android, icône découpée par le téléphone : le dessin tient dans le cercle central
];
(async () => {
  const b = await chromium.launch();
  for (const [nom, taille, echelle, rayon, transparent] of ICONES) {
    const ctx = await b.newContext({ viewport: { width: taille, height: taille }, deviceScaleFactor: 1 }); const p = await ctx.newPage();
    await p.setContent('<html><body style="margin:0;background:transparent">' + svg(echelle, rayon).replace('<svg ', '<svg width="' + taille + '" height="' + taille + '" style="display:block" ') + '</body></html>');
    await p.screenshot({ path: out + '/' + nom, omitBackground: transparent }); await ctx.close();
    console.log(nom, taille, fs.statSync(out + '/' + nom).size, 'octets');
  }
  await b.close();
})();
