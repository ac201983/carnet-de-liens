// Que voit-on DERRIÈRE les images de la transition ? (les deux images rendues invisibles)
const { chromium } = require('playwright');
const sharp = require('sharp');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true });
  const p = await ctx.newPage();
  await p.goto('https://localhost:8443/carnet-de-liens/parent-ecoute/', { waitUntil: 'load' });
  await p.waitForTimeout(600);
  const mode = process.argv[2] || 'vide';
  await p.addStyleTag({ content: mode === 'vide'
    ? '::view-transition-old(root),::view-transition-new(root){animation:none!important;opacity:0!important}::view-transition-group(root){animation-duration:3s!important}'
    : '::view-transition-old(root),::view-transition-new(root){animation:none!important;opacity:0!important}::view-transition-group(root){animation-duration:3s!important}::view-transition{background:#ff00ff}' });
  await p.evaluate(() => { document.startViewTransition(() => { document.body.dataset.x = '1'; }); });
  await p.waitForTimeout(500);
  const buf = await p.screenshot();
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => { const i = (y * info.width + x) * info.channels; return [data[i], data[i + 1], data[i + 2]].join(','); };
  console.log(mode, 'haut', px(390, 60), 'milieu', px(390, 844), 'bas', px(390, 1600), 'coin', px(20, 20));
  await sharp(buf).resize(195).jpeg({ quality: 70 }).toFile('/tmp/fond-' + mode + '.jpg');
  await b.close();
})();
