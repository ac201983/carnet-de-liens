// Vérifie tous les liens, images, scripts et feuilles de style rencontrés sur tous les écrans,
// plus ceux du sitemap, du manifest et des balises d’aperçu. Les liens externes sont listés pour vérification à part.
const { chromium } = require('playwright');
const fs = require('fs');
const { walk, ORIGIN, BASE, APP } = require('./walk');
const PUBLIC = process.env.PEPE_PUBLIC || 'https://ac201983.github.io';
const BASE_PATH = process.env.PEPE_BASE || '/carnet-de-liens/';
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-CH', ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const found = new Map(); // url -> {from:Set, kind}
  const add = (url, from, kind) => { if (!url) return; const k = url; if (!found.has(k)) found.set(k, { from: new Set(), kind }); found.get(k).from.add(from); };
  const collect = async name => {
    const r = await page.evaluate(() => {
      const abs = u => { try { return new URL(u, location.href).href; } catch (e) { return 'INVALIDE:' + u; } };
      const out = [];
      for (const a of document.querySelectorAll('a[href]')) out.push([abs(a.getAttribute('href')), 'lien', a.getAttribute('href'), (a.textContent || '').trim().slice(0, 30), a.target, a.rel]);
      for (const e of document.querySelectorAll('img[src]')) out.push([abs(e.getAttribute('src')), 'image', '', e.alt === undefined ? '(pas d’alt)' : e.alt.slice(0, 30)]);
      for (const e of document.querySelectorAll('script[src]')) out.push([abs(e.getAttribute('src')), 'script']);
      for (const e of document.querySelectorAll('link[href]')) out.push([abs(e.getAttribute('href')), 'link:' + e.rel]);
      for (const e of document.querySelectorAll('meta[property="og:image"],meta[property="og:url"],meta[name="twitter:image"]')) out.push([e.content, 'meta:' + (e.getAttribute('property') || e.name)]);
      for (const e of document.querySelectorAll('[style*="url("]')) { const m = e.getAttribute('style').match(/url\(([^)]+)\)/); if (m) out.push([abs(m[1].replace(/['"]/g, '')), 'fond']); }
      const noalt = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length;
      const blank = [...document.querySelectorAll('a[target="_blank"]')].filter(a => !/noopener/.test(a.rel)).length;
      const empty = [...document.querySelectorAll('a[href]')].filter(a => !(a.textContent || '').trim() && !a.getAttribute('aria-label')).length;
      return { out, noalt, blank, empty };
    });
    for (const o of r.out) add(o[0], name, o[1]);
    if (r.noalt) console.log('✗ image sans texte alternatif sur ' + name);
    if (r.blank) console.log('✗ lien externe sans rel=noopener sur ' + name);
    if (r.empty) console.log('✗ lien sans intitulé sur ' + name);
  };
  await walk(page, collect);
  // fichiers annexes
  const get = async u => { const r = await ctx.request.get(u, { maxRedirects: 0 }).catch(e => null); return r; };
  const sm = await (await get(BASE + 'sitemap.xml')).text();
  for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) add(m[1], 'sitemap.xml', 'sitemap');
  const rb = await (await get(BASE + 'robots.txt')).text();
  for (const m of rb.matchAll(/^Sitemap:\s*(\S+)/gmi)) add(m[1], 'robots.txt', 'robots');
  const mf = JSON.parse(await (await get(APP + 'manifest.webmanifest')).text());
  for (const i of mf.icons || []) add(new URL(i.src, APP + 'manifest.webmanifest').href, 'manifest', 'icône');
  add(new URL(mf.start_url, APP + 'manifest.webmanifest').href, 'manifest', 'start_url');
  const css = await (await get(APP + 'app.css')).text();
  for (const m of css.matchAll(/url\(([^)]+)\)/g)) { const u = m[1].replace(/['"]/g, ''); if (!u.startsWith('data:')) add(new URL(u, APP + 'app.css').href, 'app.css', 'css'); }

  let bad = 0; const ext = []; const internal = [];
  for (const [url, v] of found) {
    if (/^(tel|mailto|sms):/.test(url)) { if (!/^tel:\+?[0-9]+$|^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(url)) { bad++; console.log('✗ adresse mal formée : ' + url); } continue; }
    if (url.startsWith('data:')) continue;
    if (url.startsWith('INVALIDE:')) { bad++; console.log('✗ ' + url + ' (' + [...v.from].slice(0, 3).join(', ') + ')'); continue; }
    let local = null;
    if (url.startsWith(ORIGIN)) local = url; else if (url.startsWith(PUBLIC + BASE_PATH)) local = ORIGIN + url.slice(PUBLIC.length);
    if (!local) { ext.push([url, v.kind, [...v.from].slice(0, 2).join(', ')]); continue; }
    internal.push(url);
    const u = new URL(local); const hash = u.hash; u.hash = '';
    const r = await get(u.href);
    const st = r ? r.status() : 0;
    if (st !== 200) { bad++; console.log('✗ ' + st + ' ' + url + '  ← ' + v.kind + ' sur ' + [...v.from].slice(0, 3).join(', ')); continue; }
    if (hash && hash.length > 1) { const body = await r.text(); if (!new RegExp('id="' + hash.slice(1).replace(/[^\w-]/g, '') + '"').test(body)) { bad++; console.log('✗ ancre absente ' + url); } }
  }
  console.log(internal.length + ' adresses internes vérifiées (' + [...new Set(internal.map(u => u.replace(/[?#].*$/, '').replace(/^https:\/\/[^/]+/, '')))].length + ' fichiers distincts), ' + bad + ' en défaut');
  console.log('liens externes à vérifier à part :');
  for (const e of ext) console.log('  ' + e[0] + '  [' + e[1] + ' · ' + e[2] + ']');
  await browser.close();
  process.exit(bad ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });
