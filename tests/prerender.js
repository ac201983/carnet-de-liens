// Exécute app.js sans navigateur (faux DOM minimal) et renvoie les écrans que le site écrit à l'avance dans ses pages :
// l'accueil, la liste des situations et chacune des fiches, tels que l'application les écrit elle-même.
// usage : node prerender.js <app.js> [chemin de l'app sur le site, « / » par défaut]
const fs = require('fs');
const code = fs.readFileSync(process.argv[2], 'utf8');
const racine = process.argv[3] || '/';
function ecran(pathname) {
  let info = null;
  // L'application voit cette fonction et sait qu'on fabrique une page : elle ne connaît alors ni l'heure ni le visiteur, et elle donne la liste des fiches.
  globalThis.__PEPE_PRERENDER__ = x => { info = x; };
  globalThis.localStorage = { getItem: () => null, setItem() { }, removeItem() { } };
  const app = { innerHTML: '', className: '', addEventListener() { }, appendChild() { }, querySelector() { return null; }, getAttribute() { return null; }, removeAttribute() { } };
  globalThis.document = { getElementById: id => id === 'app' ? app : null, querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ setAttribute() { }, remove() { } }), addEventListener() { }, activeElement: null, title: '' };
  globalThis.window = globalThis;
  globalThis.location = { search: '', pathname, hash: '' };
  globalThis.addEventListener = () => { };
  globalThis.history = { replaceState() { }, pushState() { }, state: null };
  globalThis.scrollTo = () => { };
  (0, eval)(code);
  return { className: app.className, html: app.innerHTML, title: document.title, info };
}
const intro = ecran(racine);
if (!/class="herofull/.test(intro.html)) { console.error('prerender: accueil introuvable'); process.exit(1); }
const fiches = (intro.info && intro.info.fiches) || [];
if (fiches.length < 20) { console.error('prerender: liste des fiches introuvable'); process.exit(1); }
const liste = ecran(racine + 'fiches/');
if (!/class="sits groupes/.test(liste.html)) { console.error('prerender: liste des situations introuvable'); process.exit(1); }
const out = { intro: { className: intro.className, html: intro.html, title: intro.title }, liste: { className: liste.className, html: liste.html, title: liste.title, desc: intro.info.listeDesc || '' }, fiches: [] };
for (const f of fiches) {
  const e = ecran(racine + 'fiches/' + f.slug + '/');
  if (!/<main[^>]*class="view fiche/.test(e.html) || e.html.indexOf(f.t.replace(/&/g, '&amp;')) < 0) { console.error('prerender: fiche introuvable, ' + f.slug); process.exit(1); }
  out.fiches.push(Object.assign({}, f, { className: e.className, html: e.html, title: e.title }));
}
process.stdout.write(JSON.stringify(out));
