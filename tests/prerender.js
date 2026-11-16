// Exécute app.js sans navigateur (faux DOM minimal) et renvoie l'écran d'accueil tel que l'application l'écrit.
// usage : node prerender.js <app.js>
const fs = require('fs');
const code = fs.readFileSync(process.argv[2], 'utf8');
globalThis.localStorage = { getItem: () => null, setItem() { }, removeItem() { } };
const app = { innerHTML: '', className: '', addEventListener() { }, appendChild() { }, querySelector() { return null; }, getAttribute() { return null; }, removeAttribute() { } };
globalThis.document = { getElementById: id => id === 'app' ? app : null, querySelector: () => null, createElement: () => ({ setAttribute() { }, remove() { } }), addEventListener() { }, activeElement: null };
globalThis.window = globalThis;
globalThis.location = { search: '', pathname: '/', hash: '' };
globalThis.addEventListener = () => { };
document.title = '';
globalThis.history = { replaceState() { } };
globalThis.scrollTo = () => { };
(0, eval)(code);
if (!/class="herofull/.test(app.innerHTML)) { console.error('prerender: accueil introuvable'); process.exit(1); }
process.stdout.write(JSON.stringify({ className: app.className, html: app.innerHTML }));
