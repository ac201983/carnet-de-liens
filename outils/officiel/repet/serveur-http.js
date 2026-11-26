// Répétition du dépôt : un petit serveur HTTPS qui répond comme le serveur du site pour ce que les outils de mise en ligne regardent.
//   - un fichier : 200 (ou 206 pour un morceau), un fichier absent : 404 avec la page 404 du site ;
//   - un dossier sans barre finale : 301 vers le même avec la barre ; un dossier sans page d'accueil : 403 ; les fichiers .ht* : 403 ;
//   - le dossier antonio/ demande un mot de passe (401), comme en ligne ;
//   - quand le .htaccess déposé porte le renvoi des anciennes adresses de l'essai, il est appliqué (vers ce serveur, pas vers le vrai site).
// usage : node serveur-http.js <dossier servi> <port>
const https = require('https'), fs = require('fs'), path = require('path');
const dossier = path.resolve(process.argv[2]), port = +process.argv[3], ici = 'https://localhost:' + port;
const T = { html: 'text/html; charset=utf-8', js: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8', json: 'application/json', webmanifest: 'application/manifest+json', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', woff2: 'font/woff2', mp3: 'audio/mpeg', mp4: 'video/mp4', txt: 'text/plain; charset=utf-8', xml: 'application/xml', ico: 'image/x-icon' };
https.createServer({ key: fs.readFileSync('/home/claude/build/cert/key.pem'), cert: fs.readFileSync('/home/claude/build/cert/cert.pem') }, (req, res) => {
  const u = new URL(req.url, ici); let p; try { p = decodeURIComponent(u.pathname); } catch (e) { res.writeHead(400); return res.end(); }
  const fin = (code, tete, corps) => { res.writeHead(code, Object.assign({ 'Cache-Control': 'no-store' }, tete)); res.end(req.method === 'HEAD' ? undefined : corps); };
  if (/\/\.ht/.test(p)) return fin(403, {}, 'interdit');
  let ht = ''; try { ht = fs.readFileSync(path.join(dossier, '.htaccess'), 'utf8'); } catch (e) { }
  const regle = ht.match(/^RewriteRule \^essai\(\?:\/\(\.\*\)\)\?\$ https:\/\/parent-ecoute\.ch\/\$1 \[R=302,L\]$/m);
  if (regle) { const r = p.slice(1).match(/^essai(?:\/(.*))?$/); if (r) return fin(302, { Location: ici + '/' + (r[1] || '') + u.search }, ''); }
  if (/^\/antonio\//.test(p)) return fin(401, { 'WWW-Authenticate': 'Basic realm="repetition"' }, 'mot de passe');
  let f = path.join(dossier, p); if (!f.startsWith(dossier)) return fin(403, {}, 'interdit');
  let st = null; try { st = fs.statSync(f); } catch (e) { }
  if (st && st.isDirectory()) {
    if (!p.endsWith('/')) return fin(301, { Location: ici + p + '/' + u.search }, '');
    f = path.join(f, 'index.html'); st = null; try { st = fs.statSync(f); } catch (e) { }
    if (!st) return fin(403, {}, 'interdit');
  }
  if (!st) { let c = 'introuvable'; try { c = fs.readFileSync(path.join(dossier, '404.html')); } catch (e) { } return fin(404, { 'Content-Type': T.html }, c); }
  const type = T[path.extname(f).slice(1)] || 'application/octet-stream';
  const m = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
  if (m) {
    const a = +m[1], b = m[2] ? Math.min(+m[2], st.size - 1) : st.size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${a}-${b}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': b - a + 1, 'Cache-Control': 'no-store' });
    return req.method === 'HEAD' ? res.end() : fs.createReadStream(f, { start: a, end: b }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' });
  return req.method === 'HEAD' ? res.end() : fs.createReadStream(f).pipe(res);
}).listen(port, '127.0.0.1');
