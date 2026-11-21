# Montage intime de « Ce qu'on ne dit pas par SMS » : le montage. Chaque plan est écrit dans son fichier, puis les plans sont joints.
# python3 imontage.py <V|H> [plans à refaire, ou « tout »] ; python3 imontage.py <V|H> joint
import numpy as np, cv2, sys, os, subprocess, time
import iplans as P
from iplans import *
PLANS = IT.PLANS; DEBUT = IT.DEBUT; TOTAL = IT.TOTAL; D = IT.D
FONDUS = {'b1': ('a3', 12), 'b2': ('b1', 8), 'b4': ('b3', 10), 'c2': ('c1', 8), 'c5': ('c4', 8)}       # ces plans s'ouvrent en fondu sur la dernière image du plan d'avant
def brut(nom, i, f):
    p = getattr(P, nom)
    r = PP.filme(p, i, f) if hasattr(p, 'cles') else p(i, f)
    return r if isinstance(r, tuple) else (r, None)
_der = {}
def derniere(nom, f):
    k = (nom, f)
    if k not in _der: _der[k] = image(nom, D[nom] - 1, f, grain_f=0)
    return _der[k]
def fini(nom, img, clair, n, f, g):
    if nom in P.PHOTO: return raccord.finition(img, n, f, raccord.GRAIN if g is None else g)
    return finition_ui(img, n, f, clair=bool(clair) or nom in P.CLAIRS, grain_f=.010 if g is None else g)
def image(nom, i, f, grain_f=None):
    """L'image i du plan nom, au format f, finie."""
    n = DEBUT[nom] + i; W, H = FORMATS[f]
    if nom == 'e3':
        img = P.e3(i, f, derniere('e2', f)); k = float(lisse(i / IPS, 0, .5))
        return grain(img * vignette(W, H, .1, .8), n, (.010 * (1 - .3 * k)) if grain_f is None else grain_f)
    img, clair = brut(nom, i, f)
    out = fini(nom, img, clair, n, f, 0)
    avant = FONDUS.get(nom)
    if avant and i < avant[1]:
        k = float(lisse(i + .5, 0, avant[1])); out = derniere(avant[0], f) * (1 - k) + out * k
    g = (raccord.GRAIN if nom in P.PHOTO else .010) if grain_f is None else grain_f
    return grain(out, n, g) if g else out
if __name__ == '__main__':
    f = sys.argv[1]; W, H = FORMATS[f]; quoi = sys.argv[2:] or ['tout']; out = '%s/out/%s' % (P.INT, f); os.makedirs(out, exist_ok=True)
    if quoi == ['joint']:
        with open(out + '/liste.txt', 'w') as l:
            for nom, k in PLANS: l.write("file '%s/%s.mp4'\n" % (os.path.abspath(out), nom))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', out + '/liste.txt', '-c', 'copy', out + '/image.tmp.mp4'], check=True); os.replace(out + '/image.tmp.mp4', out + '/image.mp4')
        print(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=nb_frames,duration', '-of', 'csv=p=0', out + '/image.mp4'], capture_output=True, text=True).stdout.strip(), 'attendu', TOTAL); sys.exit(0)
    for nom, k in PLANS:
        if quoi != ['tout'] and nom not in quoi: continue
        t0 = time.time(); p = Plan('%s/%s.mp4' % (out, nom), W, H, crf=14)
        for i in range(k): p.image(image(nom, i, f))
        print(nom, p.fin(), 'images,', round(time.time() - t0), 's', flush=True)
