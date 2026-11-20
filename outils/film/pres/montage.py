# « Ce qu'on ne dit pas par SMS » : le montage. Chaque plan est écrit dans son fichier, puis les plans sont joints.
# python3 montage.py <V|H|I> [plans à refaire, ou « tout »] ; python3 montage.py <V|H|I> joint
# 3 plans viennent tels quels du film de 35 secondes (le téléphone qui s'éclaire, le téléphone retourné, le verre) : ils ne sont pas refaits.
import numpy as np, cv2, sys, os, subprocess, time
import plans
from pm import *
P = plans
PLANS = [('a1', 27), ('a2', 114), ('a3', 36), ('a4', 87), ('a5', 270), ('b1', 54), ('b2', 246), ('b3', 60), ('b4', 120), ('c1', 36), ('c2', 84), ('c3', 141), ('c4', 120), ('c5', 150),
         ('d', 186), ('e1', 165), ('e2', 315), ('e3', 90), ('f1', 36), ('f2', 162), ('f3', 108), ('f4', 66), ('f5', 123), ('g1', 240), ('g2', 114)]
REPRIS = {'a1': 's1', 'a3': 's3', 'a4': 's4'}                              # les plans repris du film de 35 secondes (out/V et out/H ; Instagram prend ceux du vertical)
DEBUT = {}; _n = 0
for nom, k in PLANS: DEBUT[nom] = _n; _n += k
TOTAL = _n; D = dict(PLANS)
assert TOTAL == 3150 and all(D[k] == P.N[k] for k in P.N), TOTAL
FONDU = 12
def brut(nom, i, f):
    p = getattr(P, nom)
    r = P.filme(p, i, f) if hasattr(p, 'cles') else p(i, f)
    return r if isinstance(r, tuple) else (r, None)
_der = {}
def derniere(nom, f):
    """La dernière image d'un plan, finie sans grain : le plan suivant s'ouvre parfois en fondu sur elle."""
    k = (nom, f)
    if k not in _der: _der[k] = image(nom, D[nom] - 1, f, grain_f=0)
    return _der[k]
def fini(nom, img, clair, n, f, g):
    if nom in ('a5', 'c5', 'e1', 'e3', 'f5'): return raccord.finition(img, n, f, raccord.GRAIN if g is None else g)
    return finition_ui(img, n, f, clair=bool(clair), grain_f=.010 if g is None else g)
def image(nom, i, f, grain_f=None):
    """L'image i du plan nom, au format f, finie."""
    n = DEBUT[nom] + i; W, H = FORMATS[f]
    if nom == 'g2':
        img = P.g2(i, f, derniere('g1', f)); k = float(lisse(i / IPS, 0, .5))
        return grain(img * vignette(W, H, .1, .8), n, (.010 * (1 - .3 * k)) if grain_f is None else grain_f)
    img, clair = brut(nom, i, f)
    if nom == 'b1' and i < FONDU:                                           # l'étang se fond dans le téléphone
        k = float(lisse(i + .5, 0, FONDU)); a = raccord.finition(raccord.image_etang(P.T5 + i / IPS, f, i), n, f, 0); b = fini(nom, img, clair, n, f, 0)
        return grain(a * (1 - k) + b * k, n, raccord.GRAIN * (1 - k) + .010 * k) if grain_f is None else a * (1 - k) + b * k
    out = fini(nom, img, clair, n, f, 0)
    avant = {'c1': ('b4', 10), 'd': ('c5', 7), 'e2': ('e1', FONDU), 'f1': ('e3', 10), 'g1': ('f5', 10)}.get(nom)
    if avant and i < avant[1]:
        k = float(lisse(i + .5, 0, avant[1])); out = derniere(avant[0], f) * (1 - k) + out * k
    g = (raccord.GRAIN if nom in ('a5', 'c5', 'e1', 'e3', 'f5') else .010) if grain_f is None else grain_f
    return grain(out, n, g) if g else out

def dossier(f, nom):
    if nom in REPRIS: return '%s/../out/%s' % (PRES, 'H' if f == 'H' else 'V'), REPRIS[nom]
    return '%s/out/%s' % (PRES, f), nom
if __name__ == '__main__':
    f = sys.argv[1]; W, H = FORMATS[f]; quoi = sys.argv[2:] or ['tout']; out = '%s/out/%s' % (PRES, f); os.makedirs(out, exist_ok=True)
    if quoi == ['joint']:
        with open(out + '/liste.txt', 'w') as l:
            for nom, k in PLANS: d, n2 = dossier(f, nom); l.write("file '%s/%s.mp4'\n" % (os.path.abspath(d), n2))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', out + '/liste.txt', '-c', 'copy', out + '/image.tmp.mp4'], check=True); os.replace(out + '/image.tmp.mp4', out + '/image.mp4')
        print(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=nb_frames,duration', '-of', 'csv=p=0', out + '/image.mp4'], capture_output=True, text=True).stdout.strip(), 'attendu', TOTAL); sys.exit(0)
    for nom, k in PLANS:
        if nom in REPRIS or (quoi != ['tout'] and nom not in quoi): continue
        t0 = time.time(); p = Plan('%s/%s.mp4' % (out, nom), W, H, crf=14)
        for i in range(k): p.image(image(nom, i, f))
        print(nom, p.fin(), 'images,', round(time.time() - t0), 's', flush=True)
