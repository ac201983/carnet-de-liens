# Le raccord central du film : le cercle né dans le verre poursuit sa course sur l'étang.
# Les 2 plans partent des 2 images du bas de la planche d'Antonio. Leurs cercles sont séparés de la photo, calmés, puis remis en mouvement.
import numpy as np, cv2, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ondes import Eau
from film import *

AJ = np.load(ICI + '/tmp/ajust.npy', allow_pickle=True).item()
T4, T5 = 3.4, 3.9                       # durée du plan du verre, durée du plan de l'étang (secondes)
RAPPORT = 1.24                          # les cercles de l'étang sont 1,24 fois plus espacés que ceux du verre : on filme le verre 1,24 fois plus près à la coupe
U2C = 4.0                               # décalage des cercles de l'étang à la coupe, pour que les 3 crêtes tombent sur celles du verre
REG = {'H': dict(z0=1.03, zc=1.42, ay=.50), 'V': dict(z0=1.04, zc=1.30, ay=.47)}
SYG, SYP = .95, 1.075                   # léger étirement vertical à la coupe, pour que les 2 ovales aient la même forme (0,666)

_cache = {}
def verre():
    if 'g' not in _cache:
        g = cv2.imread(ICI + '/plates/p3x4.png').astype(np.float32) / 255
        cx, cy, a = [float(v) for v in AJ['p3']]
        # le cercle le plus large de la photo est le plus discret, et c'est lui qui naît le premier : on lui donne la présence des 2 autres
        _cache['g'] = Eau(g, cx * 2, cy * 2, a, r_in=190, r_out=470, R=900, sigma=26, poids=lambda r: 1 + 1.25 * lisse(r, 372, 398) * (1 - lisse(r, 445, 470)))
    return _cache['g']
def etang():
    if 'p' not in _cache:
        p = cv2.imread(ICI + '/plates/p4x4.png').astype(np.float32) / 255
        cx, cy, a = [float(v) for v in AJ['p4']]
        _cache['p'] = Eau(p, cx * 2, cy * 2, a, r_in=230, r_out=700, R=1500, sigma=30)
    return _cache['p']

# --- le verre -----------------------------------------------------------------------------------------------------------------------
TB = .12                                # les cercles se mettent en route 0,12 s après que le verre a touché la table, le premier se voit vers 0,35 s
U0 = 382.0                              # les cercles partent tous du centre : au départ ils sont rentrés de 382 points
CG = U0 / (T4 - TB)                     # vitesse des cercles dans le verre (points de l'image par seconde) : ils retrouvent leur place de la photo à la coupe
def u_verre(t): return -U0 + CG * max(0.0, t - TB)
_q = None
def q_avance(x):
    """Avancée de la caméra vers le verre, de 0 à 1 : départ doux, puis un long ralentissement jusqu'à la coupe (il reste 4 % de vitesse)."""
    global _q
    if _q is None:
        xs = np.linspace(0, 1, 2001); v = lisse(xs, 0, .16) * ((1 - xs) ** 1.25) + .04 * lisse(xs, 0, .16)
        c = np.concatenate([[0], np.cumsum((v[1:] + v[:-1]) / 2)]); _q = (xs, c / c[-1], v / c[-1] * 2000)
    return float(np.interp(x, _q[0], _q[1]))
def z_verre(t, f): r = REG[f]; return float(np.exp(np.log(r['z0']) + (np.log(r['zc']) - np.log(r['z0'])) * q_avance(t / T4)))
def sy_verre(t): return 1 + (SYG - 1) * q_avance(t / T4)

POSE = 1 / IPS                          # le verre touche la table à la deuxième image du plan
def secousse(t, H):
    """La table vibre un instant quand le verre s'y pose : quelques points, pendant un dixième de seconde."""
    d = t - POSE
    if d < 0: return 0.0, 0.0
    a = .0038 * H * np.exp(-d / .06) * np.cos(2 * np.pi * 14 * d)
    return float(.3 * a), float(a)

def image_verre(t, f, n=0):
    W, H = FORMATS[f]; E = verre(); r = REG[f]
    rho = E.rho; gain = ((1 - lisse(rho, 520, 700)) * lisse(rho, 10, 90)).astype(np.float32) * np.float32(lisse(t, TB, TB + .25))   # un cercle se dessine en s'écartant du centre
    img = E.vue(u_verre(t), gain)
    f0 = H / img.shape[0]; z = z_verre(t, f)
    sx, sy = secousse(t, H)
    out = camera(img, E.cx, E.cy, W / 2 + sx, H * r['ay'] + sy, f0 * z, W, H, sy=sy_verre(t), flou=max(0, .5 / (f0 * z) - .45))
    return out

# --- l'étang ------------------------------------------------------------------------------------------------------------------------
def zp0(f): return max(REG[f]['zc'] / RAPPORT, 1.0)
C2_0 = lambda f: CG * REG[f]['zc'] / zp0(f) * (1.0)      # à la coupe, la crête avance à la même vitesse à l'écran que dans le verre
C2_LENT, TAU = 78.0, 1.05
def u_etang(t, f):
    c0 = C2_0(f); return U2C + C2_LENT * t + (c0 - C2_LENT) * TAU * (1 - np.exp(-t / TAU))
def z_etang(t, f): return float(np.exp(np.log(zp0(f)) * (1 - lisse5(t, .5, T5 - .2))))
def sy_etang(t): return 1 + (SYP - 1) * (1 - float(lisse5(t, .15, 2.8)))
def ancre_etang(t, f):
    """Le centre des cercles est au même endroit de l'écran que dans le verre à la coupe, puis il glisse vers sa place naturelle quand la caméra recule."""
    W, H = FORMATS[f]; E = etang(); r = REG[f]; f0 = H / E.img.shape[0]
    nat = (W / 2 + (E.cx - E.img.shape[1] / 2) * f0, H / 2 + (E.cy - E.img.shape[0] / 2) * f0)
    w = float(lisse5(t, .5, T5 - .2)) if zp0(f) > 1.001 else 0.0
    if f == 'V': nat = (W / 2, H * r['ay'])
    return (W / 2 * (1 - w) + nat[0] * w, H * r['ay'] * (1 - w) + nat[1] * w)

def image_etang(t, f, n=0):
    W, H = FORMATS[f]; E = etang()
    u = u_etang(t, f); rho = E.rho
    gain = (np.exp(-max(0.0, u - U2C) / 1500.0) * (1 - lisse(rho, 1100, 1450))).astype(np.float32)
    img = E.vue(u, gain)
    f0 = H / img.shape[0]; z = z_etang(t, f); ax, ay = ancre_etang(t, f)
    return camera(img, E.cx, E.cy, ax, ay, f0 * z, W, H, sy=sy_etang(t), flou=max(0, .5 / (f0 * z) - .45))

GRAIN = float(os.environ.get('FILM_GRAIN', '.012'))
def finition(img, n, f, force_grain=None):
    if force_grain is None: force_grain = GRAIN
    W, H = FORMATS[f]
    return grain(img * vignette(W, H, .2, .8), n, force_grain)

if __name__ == '__main__':
    # usage : python3 raccord.py <H|V> <dossier de sortie> [images de contrôle seulement]
    f = sys.argv[1]; out = sys.argv[2]; os.makedirs(out, exist_ok=True); W, H = FORMATS[f]
    if len(sys.argv) > 3:
        a = finition(image_verre(T4 - 1 / IPS, f), 0, f, 0); b = finition(image_etang(0, f), 1, f, 0)
        cv2.imwrite(out + '/coupe-avant-%s.png' % f, (np.clip(a, 0, 1) * 255).astype(np.uint8)); cv2.imwrite(out + '/coupe-apres-%s.png' % f, (np.clip(b, 0, 1) * 255).astype(np.uint8))
        print('coupe', f, 'zoom verre', round(z_verre(T4, f), 3), 'zoom étang', round(z_etang(0, f), 3), 'vitesses', round(CG, 1), round(C2_0(f), 1)); sys.exit(0)
    n4, n5 = int(round(T4 * IPS)), int(round(T5 * IPS))
    p = Plan(out + '/s4-%s.mp4' % f, W, H)
    for i in range(n4): p.image(finition(image_verre(i / IPS, f, i), i, f))
    print('verre', p.fin(), 'images')
    p = Plan(out + '/s5-%s.mp4' % f, W, H)
    for i in range(n5): p.image(finition(image_etang(i / IPS, f, i), 1000 + i, f))
    print('étang', p.fin(), 'images')
