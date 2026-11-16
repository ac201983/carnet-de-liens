// Petit serveur statique qui imite GitHub Pages : gzip, Cache-Control 10 min, 404.html du projet.
// usage : node serve.js <racine> <port> [dossier-projet pour le 404, ou / si le site est à la racine] [dossier du certificat pour HTTPS]
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.resolve(process.argv[2] || '.'), port = Number(process.argv[3] || 8765), proj = process.argv[4] || '';
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const COMPRESS = new Set(['.html', '.css', '.js', '.json', '.webmanifest', '.xml', '.txt', '.svg']);
function send(req, res, file, status) {
  const ext = path.extname(file).toLowerCase();
  let body = fs.readFileSync(file);
  const h = { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'max-age=600' };
  if (COMPRESS.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) { body = zlib.gzipSync(body); h['Content-Encoding'] = 'gzip'; h['Vary'] = 'Accept-Encoding'; }
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
(tls ? require('http2').createSecureServer(Object.assign({ allowHTTP1: true }, tls), handler) : http.createServer(handler)).listen(port, '127.0.0.1', () => console.log('serving ' + root + ' on ' + port + (tls ? ' (https)' : '')));
