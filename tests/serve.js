// Petit serveur statique qui imite GitHub Pages : gzip, Cache-Control 10 min, 404.html du projet.
// usage : node serve.js <racine> <port> [dossier-projet pour le 404, ou / si le site est à la racine] [dossier du certificat pour HTTPS]
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.resolve(process.argv[2] || '.'), port = Number(process.argv[3] || 8765), proj = process.argv[4] || '';
const TYPES = { '.mp3': 'audio/mpeg', '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const COMPRESS = new Set(['.html', '.css', '.js', '.json', '.webmanifest', '.xml', '.txt', '.svg']);
// Un gros fichier (un film) est envoyé au fil de l'eau, morceau par morceau, comme le fait un vrai serveur. Avant le 20 novembre 2026, le fichier entier
// était confié d'un coup à la connexion : quand le navigateur mettait le chargement en attente (c'est ce qu'il fait pour une vidéo), 20 Mo restaient
// en file dans ce serveur d'essai, qui refusait alors toute nouvelle demande sur la même connexion (HTTP/2). Le film de 1 minute 45 s'arrêtait à 16 secondes.
function envoieGros(req, res, file, status, total) {
  const ext = path.extname(file).toLowerCase(); const h = { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'max-age=600', 'Accept-Ranges': 'bytes' };
  let a = 0, b = total - 1; const rg = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (rg && status === 200) {
    a = rg[1] === '' ? Math.max(0, total - Number(rg[2])) : Number(rg[1]); b = rg[1] !== '' && rg[2] !== '' ? Math.min(Number(rg[2]), total - 1) : total - 1;
    if (a > b || a >= total) { res.writeHead(416, { 'Content-Range': 'bytes */' + total }); return res.end(); }
    h['Content-Range'] = 'bytes ' + a + '-' + b + '/' + total; status = 206;
  }
  h['Content-Length'] = b - a + 1; res.writeHead(status, h);
  if (req.method === 'HEAD') return res.end();
  const flux = fs.createReadStream(file, { start: a, end: b }); flux.on('error', () => { try { res.destroy(); } catch (e) { } }); res.on('close', () => flux.destroy()); flux.pipe(res);
}
function send(req, res, file, status) {
  const ext = path.extname(file).toLowerCase();
  const taille = fs.statSync(file).size; if (taille > 1048576 && !COMPRESS.has(ext)) return envoieGros(req, res, file, status, taille);
  let body = fs.readFileSync(file);
  const h = { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'max-age=600' };
  if (COMPRESS.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) { body = zlib.gzipSync(body); h['Content-Encoding'] = 'gzip'; h['Vary'] = 'Accept-Encoding'; }
  // Un lecteur audio demande souvent un morceau du fichier (« Range ») : on le sert comme le fait le serveur du site.
  const rg = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (rg && status === 200 && !h['Content-Encoding']) {
    const total = body.length; let a = rg[1] === '' ? Math.max(0, total - Number(rg[2])) : Number(rg[1]); let b = rg[1] !== '' && rg[2] !== '' ? Math.min(Number(rg[2]), total - 1) : total - 1;
    if (a > b || a >= total) { res.writeHead(416, { 'Content-Range': 'bytes */' + total }); return res.end(); }
    h['Content-Range'] = 'bytes ' + a + '-' + b + '/' + total; h['Accept-Ranges'] = 'bytes'; body = body.subarray(a, b + 1); status = 206;
  } else if (!h['Content-Encoding']) h['Accept-Ranges'] = 'bytes';
  h['Content-Length'] = body.length;
  res.writeHead(status, h); res.end(req.method === 'HEAD' ? undefined : body);
}
const tls = process.argv[5] ? { key: fs.readFileSync(process.argv[5] + '/key.pem'), cert: fs.readFileSync(process.argv[5] + '/cert.pem') } : null;
const handler = (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  let file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  try {
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' }); return res.end(); }
      file = path.join(file, 'index.html');
    }
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return send(req, res, file, 200);
    const nf = proj === '/' ? path.join(root, '404.html') : (proj && p.startsWith('/' + proj + '/') ? path.join(root, proj, '404.html') : '');
    if (nf && fs.existsSync(nf)) return send(req, res, nf, 404);
    res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('404');
  } catch (e) { res.writeHead(500); res.end(String(e)); }
};
// HTTPS : HTTP/2 comme GitHub Pages (avec repli HTTP/1.1), pour que les mesures de vitesse soient fidèles
(tls ? require('http2').createSecureServer(Object.assign({ allowHTTP1: true, maxSessionMemory: 256 }, tls), handler) : http.createServer(handler)).listen(port, '127.0.0.1', () => console.log('serving ' + root + ' on ' + port + (tls ? ' (https)' : '')));
