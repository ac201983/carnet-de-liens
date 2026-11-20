# Planche de contrôle tirée d'un film exporté (les images telles qu'elles sont dans le fichier) : python3 crevue.py <film.mp4> <sortie.jpg> <hauteur> image image …
import sys, subprocess, numpy as np, cv2
f, out, h = sys.argv[1], sys.argv[2], int(sys.argv[3]); ns = [int(x) for x in sys.argv[4:]]
r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip().split(','); W, H = int(r[0]), int(r[1]); w = int(h * W / H) // 2 * 2
sel = '+'.join('eq(n\\,%d)' % n for n in ns)
p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f, '-vf', "select='%s',scale=%d:%d" % (sel, w, h), '-vsync', '0', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True, check=True)
im = np.frombuffer(p.stdout, np.uint8).reshape(-1, h, w, 3).copy()
for k, n in enumerate(sorted(ns)): cv2.putText(im[k], '%d  %.1f s' % (n, n / 30), (6, 18), cv2.FONT_HERSHEY_SIMPLEX, .5, (0, 255, 255), 1, cv2.LINE_AA)
cv2.imwrite(out, np.hstack(list(im)), [cv2.IMWRITE_JPEG_QUALITY, 86]); print(out, len(im))
