# « Et vous ? » : le montage. Chaque plan est écrit dans son fichier, puis les plans sont joints, puis le film est exporté avec son.
# python3 montage.py <H|V|I> [noms de plans à refaire, ou « tout »] ; python3 montage.py <H|V|I> joint
# V3 (20 novembre 2026). I est l'export vertical pour Instagram : il reprend les plans du format V, sauf le SMS (s2), « Souffler » (s7) et le dernier carton (s9), qui ont leur cadrage.
import numpy as np, cv2, sys, os, subprocess, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from film import *
import raccord, cuisine, ecran

# durée de chaque plan, en images (30 par seconde). Total : 1050 images, 35 secondes.
#   s1 le téléphone s'éclaire · s2 le SMS · s3 le téléphone retourné · s4 le verre · s5 l'étang et « Et vous ? » · s6 « Souffler 2 minutes » · s7 « Souffler » · s8 le verre · s9 le carton
PLANS = [('s1', 27), ('s2', 138), ('s3', 36), ('s4', 87), ('s5', 150), ('s6', 54), ('s7', 422), ('s8', 69), ('s9', 67)]
N9_I = 120                                                             # Instagram : le dernier carton dure 4 secondes, le temps de lire la phrase
PROPRES_I = ('s2', 's7', 's9')                                         # les plans que l'export Instagram a en propre
DEBUT = {}; _n = 0
for nom, k in PLANS: DEBUT[nom] = _n; _n += k
TOTAL = _n
def plans(f): return [(nom, N9_I if (f == 'I' and nom == 's9') else k) for nom, k in PLANS]
def total(f): return sum(k for _, k in plans(f))
D = dict(PLANS)
assert TOTAL == 1050 and abs(raccord.T4 * IPS - D['s4']) < 1e-6 and abs(raccord.T5 * IPS - D['s5']) < 1e-6 and ecran.N2 == D['s2'] and ecran.N6 == D['s6'] and ecran.N7 == D['s7']
assert abs(cuisine.T1 * IPS - D['s1']) < 1e-6 and abs(cuisine.T3 * IPS - D['s3']) < 1e-6 and abs(cuisine.T8 * IPS - D['s8']) < 1e-6
ET_VOUS = (1.0, 1.6, raccord.T5 - .45, raccord.T5 - .10)                # « Et vous ? » : début et fin de l'apparition, début et fin du départ (secondes dans le plan de l'étang)
FONDU6 = 12                                                            # images du fondu entre l'étang et le téléphone

_img = {}
def calque(nom, f):
    k = (nom, f)
    if k not in _img:
        c = '%s/titres/%s-%s.png' % (ICI, nom, f)
        if f == 'I' and not os.path.exists(c): c = '%s/titres/%s-V.png' % (ICI, nom)      # Instagram reprend les textes du format vertical, sauf son dernier carton
        x = cv2.imread(c, cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
        _img[k] = (x[..., :3], x[..., 3:]) if x.shape[2] == 4 else (x[..., :3], None)
    return _img[k]
def pose(img, nom, f, presence):
    if presence <= .003: return img
    c, a = calque(nom, f); a = a * np.float32(presence); return img * (1 - a) + c * a

_ecr = {}
def ecran_verrou():
    if 'v' not in _ecr: _ecr['v'] = cv2.imread(ICI + '/ecrans/verrou.png').astype(np.float32) / 255
    return _ecr['v']
_bas = {}
def ombre_bas(f):
    """Un léger assombrissement du bas de l'image, pour que le texte se lise sur le bois."""
    if f not in _bas:
        W, H = FORMATS[f]; y = np.linspace(0, 1, H, dtype=np.float32)[:, None]; _bas[f] = (lisse(y, .62, .98) * .42).astype(np.float32)[..., None] * np.ones((1, W, 1), np.float32)
    return _bas[f]

_om = {}
def ombre_mot(f, sy=120, sx=470, force=.5):
    """Une ombre douce, ovale, à l'endroit où le film écrit « Inspirez » et « Expirez » aux formats verticaux."""
    if f not in _om:
        W, H = FORMATS[f]; yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        _om[f] = (force * np.exp(-((yy - ecran.MOT[f]) / sy) ** 2 - ((xx - W / 2) / sx) ** 2)).astype(np.float32)[..., None]
    return _om[f]

_pose7 = {}
def image_s7(i, f):
    """« Souffler ». L'onde et le trajet du cadre, « Installez-vous » dans un cadre qui ne bouge plus, puis la plongée vers la goutte à la première note, une inspiration, une expiration."""
    ji, je = ecran.J_INSPIREZ, ecran.J_EXPIREZ; fin = ji + ecran.JVD; pose_j = ecran.JG + 2
    if pose_j <= i < ji:                                                # le cadre est posé et rien ne bouge sur l'écran : une seule image, faite une fois
        if f not in _pose7: _pose7[f] = ecran.image_s7(pose_j, f)
        return _pose7[f], 1
    # plusieurs instants par image pendant l'onde, le trajet et la plongée, pour le flou de mouvement
    if i < pose_j: k = 8 if i < 24 else 4
    elif i <= fin: k = (16 if f != 'H' else 8) if ji + 3 <= i <= fin - 3 else (8 if f != 'H' else 4)
    else: k = 1
    return sum(ecran.image_s7(i, f, d / k) for d in range(k)) / k, k

def image(nom, i, f):
    """L'image i du plan nom, au format f, finie (grain compris)."""
    t = i / IPS; n = DEBUT[nom] + i
    if nom == 's1': return raccord.finition(cuisine.image_s1(t, f, ecran_verrou()), n, f)
    if nom == 's2': return ecran.finition_ui(ecran.image_s2(i, f), n, f)
    if nom == 's3': return raccord.finition(cuisine.image_s3(t, f), n, f)
    if nom == 's4': return raccord.finition(raccord.image_verre(t, f, i), n, f)
    if nom == 's5':
        img = raccord.image_etang(t, f, i)
        img = pose(img, 'et-vous', f, float(lisse(t, ET_VOUS[0], ET_VOUS[1])) * (1 - float(lisse(t, ET_VOUS[2], ET_VOUS[3]))))
        return raccord.finition(img, n, f)
    if nom == 's6':
        # l'étang se fond dans le téléphone : l'eau verte devient le vert du site, et « Souffler 2 minutes » est déjà au milieu de l'image
        if i >= FONDU6: return ecran.finition_ui(ecran.image_s6(i, f), n, f)
        k = float(lisse(i + .5, 0, FONDU6))
        a = raccord.finition(raccord.image_etang(raccord.T5 + t, f, i), n, f, 0); b = ecran.finition_ui(ecran.image_s6(i, f), n, f, 0)
        return grain(a * (1 - k) + b * k, n, raccord.GRAIN * (1 - k) + .010 * k)
    if nom == 's7':
        ji, je = ecran.J_INSPIREZ, ecran.J_EXPIREZ; fin = ji + ecran.JVD
        img, k = image_s7(i, f)
        if f != 'H':
            # Vertical et Instagram : jusqu'à la première note le grand mot est celui de l'application. Ensuite le film l'écrit lui-même, à la même place, et le descend sous la goutte.
            img = img * (1 - ombre_mot(f) * float(lisse(i, ji + 4, fin)))                    # un peu d'ombre sous le mot : sous la goutte il se pose sur des reflets clairs
            if i >= ji:
                p = 1 - float(lisse(i, je - 5, je + 1))                               # « Inspirez » s'efface juste avant le sommet, « Expirez » commence à s'écrire à l'instant où la goutte redescend
                if p > .003:
                    kk = k if i <= fin else 1
                    c = sum(ecran.calque_mot('inspirez', f, ecran.mot_y(i + d / kk, f))[0] for d in range(kk)) / kk
                    a = sum(ecran.calque_mot('inspirez', f, ecran.mot_y(i + d / kk, f))[1] for d in range(kk)) / kk
                    img = img * (1 - a * np.float32(p)) + c * np.float32(p)
                img = ecran.pose_mot(img, 'expirez', f, ecran.MOT[f], float(lisse(i, je, je + 9)))
        else:
            # Horizontal : le mot de l'application sort par le bas pendant la plongée. Le film l'écrit en haut de l'image, dans la police de l'application.
            img = ecran.pose_mot(img, 'inspirez', f, ecran.MOT[f], float(lisse(i, ji + 1, ji + 13)) * (1 - float(lisse(i, je - 5, je + 1))))
            img = ecran.pose_mot(img, 'expirez', f, ecran.MOT[f], float(lisse(i, je, je + 9)))
        return ecran.finition_ui(img, n, f)
    if nom == 's8':
        img = cuisine.image_s8(t, f); p = float(lisse(t, .45, 1.05))
        if f == 'H': img = img * (1 - ombre_bas(f) * p)
        return raccord.finition(pose(img, 'ici', f, p), n, f)
    if nom == 's9':
        # le carton final arrive en fondu sur la table, puis le logo, le nom et l'adresse. Instagram : la phrase qui dit pour qui est le site, avant l'adresse.
        k = float(lisse(t, 0, .5)); W, H = FORMATS[f]
        table = cuisine.image_s8(cuisine.T8 + t, f)
        if f == 'H': table = table * (1 - ombre_bas(f))
        table = pose(table, 'ici', f, 1 - float(lisse(t, 0, .4)))
        fond, _ = calque('carte-fond', f)
        img = table * (1 - k) + fond * k
        img = pose(img, 'carte-logo', f, float(lisse(t, .25, .7)))
        img = pose(img, 'carte-nom', f, float(lisse(t, .5, .95)))
        if f == 'I':
            img = pose(img, 'carte-phrase', f, float(lisse(t, 1.0, 1.5)))
            img = pose(img, 'carte-url', f, float(lisse(t, 1.5, 2.0)))
        else: img = pose(img, 'carte-url', f, float(lisse(t, .85, 1.3)))
        return grain(img * vignette(W, H, .2 * (1 - k) + .1 * k, .8), n, raccord.GRAIN * (1 - .4 * k))
    raise SystemExit('plan inconnu ' + nom)

def dossier(f, nom):
    """Le dossier où est le fichier d'un plan : l'export Instagram prend chez le format vertical les plans qu'il n'a pas en propre."""
    return '%s/out/%s' % (ICI, 'V' if (f == 'I' and nom not in PROPRES_I) else f)

if __name__ == '__main__':
    f = sys.argv[1]; W, H = FORMATS[f]; quoi = sys.argv[2:] or ['tout']; out = '%s/out/%s' % (ICI, f); os.makedirs(out, exist_ok=True)
    if quoi == ['joint']:
        with open(out + '/liste.txt', 'w') as l:
            for nom, k in plans(f): l.write("file '%s/%s.mp4'\n" % (dossier(f, nom), nom))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', out + '/liste.txt', '-c', 'copy', out + '/image.tmp.mp4'], check=True); os.replace(out + '/image.tmp.mp4', out + '/image.mp4')
        print(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames,duration', '-of', 'csv=p=0', out + '/image.mp4'], capture_output=True, text=True).stdout.strip(), 'attendu', total(f)); sys.exit(0)
    for nom, k in plans(f):
        if quoi != ['tout'] and nom not in quoi: continue
        if f == 'I' and nom not in PROPRES_I: continue
        t0 = time.time(); p = Plan('%s/%s.mp4' % (out, nom), W, H, crf=14)
        for i in range(k): p.image(image(nom, i, f))
        print(nom, p.fin(), 'images,', round(time.time() - t0), 's', flush=True)
