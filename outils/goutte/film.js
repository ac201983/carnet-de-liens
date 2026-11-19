// Un film, image par image : chaque capture (JPEG) est donnée à ffmpeg au fur et à mesure, sans passer par un fichier par image.
// Le film est écrit sous un nom provisoire, puis renommé quand ffmpeg a fini sans erreur.
const { spawn } = require('child_process'); const fs = require('fs');
module.exports = function ouvreFilm(sortie, ips, garde) {
  const tmp = sortie.replace(/\.mp4$/, '') + '.en-cours.mp4';
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(ips), '-c:v', 'mjpeg', '-i', '-', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
  let n = 0; const fini = new Promise((ok, non) => ff.on('close', c => { if (c === 0) { fs.renameSync(tmp, sortie); ok(n); } else non(new Error('ffmpeg ' + c)); }));
  return {
    // garde : { dossier, tous } pour garder une image sur « tous », à regarder avant d'envoyer
    async image(page) { const buf = await page.screenshot({ type: 'jpeg', quality: 92 }); if (garde && n % garde.tous === 0) { fs.mkdirSync(garde.dossier, { recursive: true }); fs.writeFileSync(garde.dossier + '/' + String(n).padStart(4, '0') + '.jpg', buf); } await new Promise(r => ff.stdin.write(buf, r)); n++; return n; },
    async fin() { ff.stdin.end(); return fini; }, get n() { return n; }
  };
};
