// Petit outil de capture : node vue.js <sortie.png> [--w 390] [--h 664] [--heure 21.67] [--path /] [--seed fichier.json] [--full] [--do "click:sel;wait:500;fill:sel=texte;scroll:400;back"]
const { chromium } = require('playwright');
const fs = require('fs');
const a = process.argv.slice(2); const out = a[0];
const opt = (k, d) => { const i = a.indexOf('--' + k); return i < 0 ? d : (a[i + 1] === undefined || a[i + 1].startsWith('--') ? true : a[i + 1]); };
const W = +opt('w', 390), H = +opt('h', 664), ORIGIN = opt('origin', 'https://localhost:8445'), PATH = opt('path', '/');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, isMobile: W < 700, hasTouch: W < 700, reducedMotion: opt('motion', false) ? 'no-preference' : 'reduce', permissions: ['clipboard-read', 'clipboard-write'] });
  const heure = opt('heure', null);
  if (heure !== null) await ctx.addInitScript(h => { const D0 = Date; const hh = Math.floor(h), mm = Math.round((h - hh) * 60); const base = new D0(); base.setHours(hh, mm, 0, 0); const delta = base.getTime() - D0.now();
    class D extends D0 { constructor(...x) { if (x.length) super(...x); else super(D0.now() + delta); } static now() { return D0.now() + delta; } } window.Date = D; }, +heure);
  const seed = opt('seed', null);
  if (seed) { const data = fs.readFileSync(seed, 'utf8'); const key = opt('key', 'pepe-v1'); await ctx.addInitScript(([k, d]) => { try { if (!sessionStorage.getItem('__seed')) { localStorage.setItem(k, d); sessionStorage.setItem('__seed', '1'); } } catch (e) { } }, [key, data]); }
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto(ORIGIN + PATH); await page.waitForTimeout(500);
  for (const step of String(opt('do', '')).split(';').filter(Boolean)) {
    const i = step.indexOf(':'); const k = i < 0 ? step : step.slice(0, i), v = i < 0 ? '' : step.slice(i + 1);
    if (k === 'click') await page.click(v);
    else if (k === 'wait') await page.waitForTimeout(+v);
    else if (k === 'fill') { const j = v.indexOf('='); await page.fill(v.slice(0, j), v.slice(j + 1)); }
    else if (k === 'scroll') await page.evaluate(y => scrollTo(0, y), +v);
    else if (k === 'into') await page.$eval(v, e => e.scrollIntoView({ block: 'start' }));
    else if (k === 'back') await page.goBack();
    else if (k === 'reload') await page.reload();
    else if (k === 'goto') await page.goto(ORIGIN + v);
    else if (k === 'eval') console.log(JSON.stringify(await page.evaluate(v)));
    await page.waitForTimeout(250);
  }
  await page.mouse.move(2, 2);
  await page.screenshot({ path: out, fullPage: !!opt('full', false) });
  console.log(out, page.url(), '|', await page.title(), errs.length ? '\n' + errs.join('\n') : '');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
