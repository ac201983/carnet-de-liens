# « Et vous ? » : le montage. Chaque plan est écrit dans son fichier, puis les plans sont joints, puis le film est exporté avec son.
# python3 montage.py <H|V> [noms de plans à refaire, ou « tout »] ; python3 montage.py <H|V> joint
import numpy as np, cv2, sys, os, subprocess, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from film import *
import raccord, cuisine, ecran

# durée de chaque plan, en images (30 par seconde). Total : 1050 images, 35 secondes.
PLANS = [('s1', 36), ('s2', 126), ('s3', 48), ('s4', 102), ('s5', 117), ('s6a', 24), ('s6', 45), ('s7', 329), ('s8', 96), ('s9', 127)]
DEBUT = {}; _n = 0
for nom, k in PLANS: DEBUT[nom] = _n; _n += k
TOTAL = _n
assert TOTAL == 1050 and abs(raccord.T4 * IPS - 102) < 1e-6 and abs(raccord.T5 * IPS - 117) < 1e-6 and ecran.N2 == 126 and ecran.N7 == 329
assert abs(cuisine.T1 * IPS - 36) < 1e-6 and abs(cuisine.T3 * IPS - 48) < 1e-6

_img = {}
def calque(nom, f):
    k = (nom, f)
    if k not in _img:
        x = cv2.imread('%s/titres/%s-%s.png' % (ICI, nom, f), cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
        _img[k] = (x[..., :3], x[..., 3:]) if x.shape[2] == 4 else (x[..., :3], None)
    return _img[k]
def pose(img, nom, f, presence):
    if presence <= .003: return img
    c, a = calque(nom, f); a = a * np.float32(presence); return img * (1 - a) + c * a

_ecr = {}
def ecran_verrou():
    if 'v' not in _ecr: _ecr['v'] = cv2.imread(ICI + '/ecrans/verrou.png').astype(np.float32) / 255
    return _ecr['v']
def ecran_accueil():
    if 'a' not in _ecr: _ecr['a'] = cv2.resize(cv2.imread(ICI + '/app/0020.jpg'), (1170, 2532), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    return _ecr['a']
_bas = {}
def ombre_bas(f):
    """Un léger assombrissement du bas de l'image, pour que le texte se lise sur le bois."""
    if f not in _bas:
        W, H = FORMATS[f]; y = np.linspace(0, 1, H, dtype=np.float32)[:, None]; _bas[f] = (lisse(y, .62, .98) * .42).astype(np.float32)[..., None] * np.ones((1, W, 1), np.float32)
    return _bas[f]

_om = {}
def ombre_mot(f, y0=1440, sy=120, sx=470, force=.5):
    """Une ombre douce, ovale, à l'endroit où le film écrit « Inspirez » et « Expirez » au format vertical."""
    if f not in _om:
        W, H = FORMATS[f]; yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        _om[f] = (force * np.exp(-((yy - y0) / sy) ** 2 - ((xx - W / 2) / sx) ** 2)).astype(np.float32)[..., None]
    return _om[f]

def image(nom, i, f):
    """L'image i du plan nom, au format f, finie (grain compris)."""
    t = i / IPS; n = DEBUT[nom] + i
    if nom == 's1': return raccord.finition(cuisine.image_s1(t, f, ecran_verrou()), n, f)
    if nom == 's2': return ecran.finition_ui(ecran.image_s2(i, f), n, f)
    if nom == 's3': return raccord.finition(cuisine.image_s3(t, f), n, f)
    if nom == 's4': return raccord.finition(raccord.image_verre(t, f, i), n, f)
    if nom == 's5':
        img = raccord.image_etang(t, f, i)
        img = pose(img, 'et-vous', f, float(lisse(t, 1.3, 1.95)) * (1 - float(lisse(t, raccord.T5 - .38, raccord.T5 - .05))))
        return raccord.finition(img, n, f)
    if nom == 's6a': return raccord.finition(cuisine.image_s6a(t, f, ecran_accueil()), n, f)
    if nom == 's6': return ecran.finition_ui(ecran.image_s6(i, f), n, f)
    if nom == 's7':
        ji, je = ecran.C_INSPIREZ - ecran.C_SOUFFLE0, ecran.C_EXPIREZ - ecran.C_SOUFFLE0
        if f == 'V':
            # Vertical : le cadre reste large tant que l'application écrit « Installez-vous », puis il plonge vers la goutte à la première note.
            # Plusieurs instants par image pendant l'onde et pendant la plongée, pour le flou de mouvement.
            fin = ji + ecran.JVD
            k = 8 if i < 18 else (2 if i < ji else ((16 if ji + 3 <= i <= fin - 3 else 8) if i <= fin else 1))
            img = sum(ecran.image_s7(i, f, d / k) for d in range(k)) / k
            img = img * (1 - ombre_mot(f) * float(lisse(i, ji + 4, fin)))                    # un peu d'ombre sous le mot : sous la goutte il se pose sur des reflets clairs
            # le grand mot : jusqu'à la première note c'est celui de l'application. Ensuite le film l'écrit lui-même, à la même place, et le descend sous la goutte.
            if i >= ji:
                p = 1 - float(lisse(i, je - 2, je + 7))
                if p > .003:
                    kk = k if i <= fin else 1
                    c = sum(ecran.calque_mot('inspirez', f, ecran.mot_y_v(i + d / kk))[0] for d in range(kk)) / kk
                    a = sum(ecran.calque_mot('inspirez', f, ecran.mot_y_v(i + d / kk))[1] for d in range(kk)) / kk
                    img = img * (1 - a * np.float32(p)) + c * np.float32(p)
                img = ecran.pose_mot(img, 'expirez', f, ecran.MOT_V, float(lisse(i, je + 3, je + 14)))
            return ecran.finition_ui(img, n, f)
        k = 8 if i < 30 else (4 if i < ecran.JP else 1)                 # le rapprochement est rapide : plusieurs instants par image lui donnent son flou de mouvement
        img = sum(ecran.image_s7(i, f, d / k) for d in range(k)) / k
        # le cadre se resserre sur la goutte et le mot de l'application sort de l'image : le film le reprend
        img = pose(img, 'inspirez', f, float(lisse(i, ji + 1, ji + 13)) * (1 - float(lisse(i, je - 2, je + 7))))
        img = pose(img, 'expirez', f, float(lisse(i, je + 3, je + 14)))
        return ecran.finition_ui(img, n, f)
    if nom == 's8':
        img = cuisine.image_s8(t, f); p = float(lisse(t, .55, 1.25))
        if f == 'H': img = img * (1 - ombre_bas(f) * p)
        return raccord.finition(pose(img, 'ici', f, p), n, f)
    if nom == 's9':
        # le carton final arrive en fondu sur la table, puis le logo, le nom et l'adresse
        k = float(lisse(t, 0, .55)); W, H = FORMATS[f]
        table = cuisine.image_s8(cuisine.T8 + t, f)
        if f == 'H': table = table * (1 - ombre_bas(f))
        table = pose(table, 'ici', f, 1 - float(lisse(t, 0, .4)))
        fond, _ = calque('carte-fond', f)
        img = table * (1 - k) + fond * k
        img = pose(img, 'carte-logo', f, float(lisse(t, .3, .85)))
        img = pose(img, 'carte-nom', f, float(lisse(t, .6, 1.15)))
        img = pose(img, 'carte-url', f, float(lisse(t, 1.0, 1.5)))
        return grain(img * vignette(W, H, .2 * (1 - k) + .1 * k, .8), n, raccord.GRAIN * (1 - .4 * k))
    raise SystemExit('plan inconnu ' + nom)

if __name__ == '__main__':
    f = sys.argv[1]; W, H = FORMATS[f]; quoi = sys.argv[2:] or ['tout']; out = '%s/out/%s' % (ICI, f); os.makedirs(out, exist_ok=True)
    if quoi == ['joint']:
        with open(out + '/liste.txt', 'w') as l:
            for nom, k in PLANS: l.write("file '%s/%s.mp4'\n" % (out, nom))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', out + '/liste.txt', '-c', 'copy', out + '/image.tmp.mp4'], check=True); os.replace(out + '/image.tmp.mp4', out + '/image.mp4')
        print(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames,duration', '-of', 'csv=p=0', out + '/image.mp4'], capture_output=True, text=True).stdout.strip()); sys.exit(0)
    for nom, k in PLANS:
        if quoi != ['tout'] and nom not in quoi: continue
        t0 = time.time(); p = Plan('%s/%s.mp4' % (out, nom), W, H, crf=14)
        for i in range(k): p.image(image(nom, i, f))
        print(nom, p.fin(), 'images,', round(time.time() - t0), 's', flush=True)
