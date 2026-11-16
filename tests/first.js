// Première vue (avec bandeau) à plusieurs tailles d’écran réelles (zone visible du navigateur).
const { chromium } = require('playwright'); const fs = require('fs');
const APP = 'https://localhost:8443/carnet-de-liens/parent-ecoute/';
const sizes = [[320, 500], [375, 553], [375, 629], [390, 664], [430, 740], [768, 950], [1280, 800]];
(async () => {
  const b = await chromium.launch(); fs.mkdirSync('/home/claude/build/first', { recursive: true });
  for (const [w, h] of sizes) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage(); await page.goto(APP); await page.waitForTimeout(300);
    const r = await page.evaluate(() => { const q = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; }; return { cta: q('.herofull [data-act="onboard"]'), banner: q('.consent-in'), h1: q('.herofull h1'), img: q('.herobg'), vh: innerHeight }; });
    const covered = r.banner && r.cta && r.banner[0] < r.cta[1];
    console.log(w + '×' + h, JSON.stringify(r), covered ? '⚠ bouton en partie sous le bandeau' : 'bouton dégagé', r.cta[1] <= r.vh ? 'visible sans défiler' : 'sous la ligne de flottaison');
    await page.screenshot({ path: `/home/claude/build/first/${w}x${h}.png` });
    await ctx.close();
  }
  await b.close();
})();
