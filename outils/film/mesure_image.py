# Mesure, dans un film exporté, le mouvement de la goutte image par image pendant la respiration : quand elle est au plus haut, quand elle est revenue.
# python3 mesure_image.py <film.mp4> <V|I|H>
import sys, os, subprocess, numpy as np, cv2
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montage, ecran
from film import *
chemin, f = sys.argv[1], sys.argv[2]; W, H = FORMATS[f]
n0 = montage.DEBUT['s7'] + ecran.JN + ecran.JVD + 1; n1 = montage.DEBUT['s8']            # après la plongée, jusqu'au retour au verre
# la colonne de la goutte, sur la hauteur où elle se déplace
cx, cy, e = ecran.cadre_s7(ecran.JN + ecran.JVD + 60, f)
ya, yb = H / 2 + (86 - cy) * e, H / 2 + (212 - cy) * e; xa, xb = W / 2 - 32 * e, W / 2 + 32 * e
x0, y0, lw, lh = int(max(0, xa)) // 2 * 2, int(max(0, ya)) // 2 * 2, int(xb - xa) // 2 * 2, int(min(H, yb) - max(0, ya)) // 2 * 2
p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', chemin, '-vf', 'select=between(n\\,%d\\,%d),crop=%d:%d:%d:%d' % (n0, n1 - 1, lw, lh, x0, y0), '-vsync', '0', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True, check=True)
img = np.frombuffer(p.stdout, np.uint8).reshape(-1, lh, lw).astype(np.float32); assert len(img) == n1 - n0, (len(img), n1 - n0)
# le modèle : la goutte, prise à l'image du sommet prévu
ns = montage.DEBUT['s7'] + ecran.J_EXPIREZ; k = ns - n0; ysom = int(H / 2 + (103 - cy) * e - y0)
ha = int(60 * e); tpl = img[k][max(0, ysom - int(6 * e)):ysom + ha - int(6 * e), int(lw / 2 - 15 * e):int(lw / 2 + 15 * e)]
ys = []
for im in img:
    r = cv2.matchTemplate(im, tpl, cv2.TM_CCOEFF_NORMED)[:, 0:1] if False else cv2.matchTemplate(im, tpl, cv2.TM_CCOEFF_NORMED); col = r.max(axis=1); i = int(np.argmax(col)); y = float(i)
    if 0 < i < len(col) - 1:
        a, b, c = col[i - 1], col[i], col[i + 1]; y = i + .5 * (a - c) / (a - 2 * b + c)
    ys.append(y)
ys = np.array(ys); lis = np.convolve(ys, np.ones(5) / 5, mode='same'); i = int(np.argmin(lis[2:-2])) + 2
t = lambda n: n / IPS
fin = [j for j in range(len(ys) - 6) if abs(ys[j:].max() - ys[j:].min()) < .6]; repos = n0 + (fin[0] if fin else len(ys) - 1)
print(os.path.basename(chemin), f, ': images', n0, 'à', n1 - 1, '(%.3f à %.3f s)' % (t(n0), t(n1 - 1)))
print('  la goutte est au plus haut à l’image %d (%.2f s) ; le sommet prévu est à l’image %d (%.2f s)' % (n0 + i, t(n0 + i), ns, t(ns)))
print('  course de la goutte dans l’image : %.0f points (du plus haut au plus bas)' % (ys.max() - ys.min()))
print('  elle ne bouge plus (moins de 0,6 point) à partir de l’image %d (%.2f s) ; le plan suivant commence à l’image %d (%.2f s) : %.2f s de repos' % (repos, t(repos), n1, t(n1), t(n1) - t(repos)))
h = [round(float(ys[j] - ys[k]), 1) for j in (k - 60, k - 30, k - 15, k, k + 15, k + 30, k + 60, k + 120, len(ys) - 1) if 0 <= j < len(ys)]
print('  hauteur de la goutte par rapport au sommet (points, positif = plus bas), à -2 s, -1 s, -0,5 s, 0, +0,5 s, +1 s, +2 s, +4 s, fin :', h)
