# Montage cinématographique de « Ce qu'on ne dit pas par SMS » (20 novembre 2026, le soir) : les plans, un par un.
# Chaque plan rend l'image i (comptée depuis le début du plan) au format f, sans le grain. Les écrans sont ceux de la version d'essai, capturés image par image.
# Formats : V (1080 × 1920), H (1920 × 1080), I (1080 × 1920 pour la bande-annonce : ce qui doit se lire tient entre les hauteurs 269 et 1248).
# Les outils viennent du premier montage (pres/pm.py, pres/plans.py) et du film de 35 secondes (cuisine.py, ecran.py).
import sys, os, json, numpy as np, cv2
CINE = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(CINE)
sys.path[:0] = [CINE, FILM + '/pres', FILM]
from pm import *
import plans as PP
import ctemps as CT
import fixes
CAP = '../../cine/cap/'
def JC(nom): return json.load(open('%s/cap/%s/journal.json' % (CINE, nom)))
N = CT.D
cles = PP.cles

# ---------------------------------------------------------------- les textes : ceux de ce montage d'abord, sinon ceux du premier montage et du film de 35 secondes
_tx = {}
def calque2(nom, f):
    k = (nom, f)
    if k not in _tx:
        c = '%s/titres/%s-%s.png' % (CINE, nom, f)
        if not os.path.exists(c): _tx[k] = calque(nom, f)
        else:
            x = cv2.imread(c, cv2.IMREAD_UNCHANGED).astype(np.float32) / 255; _tx[k] = (x[..., :3], x[..., 3:])
    return _tx[k]
TJ = json.load(open(CINE + '/titres/titres.json'))
def pose2(img, nom, f, presence, bande=0.0, doux=110):
    """Pose un texte. bande : la force d'une ombre douce posée sous lui, pour qu'il se lise sur une photo."""
    if presence <= .003: return img
    if bande > 0:
        r = TJ[nom + '-' + f]; img = img * (1 - ombre(f, r['y0'] - 26, r['y1'] + 26, bande, doux) * np.float32(presence))
    c, a = calque2(nom, f); a = a * np.float32(presence); return img * (1 - a) + c * a

def pouce(img, M, e, i, pts, souffle=None):
    """Le pouce sur l'écran sombre : un rond clair qui va d'un point clé au suivant. pts : [(image, x, y, présence, appui), …] en points d'écran.
    souffle : (début, fin) d'un temps où il reste en l'air, presque immobile (il respire à peine)."""
    if i <= pts[0][0] or i >= pts[-1][0]: return img
    for a, b in zip(pts[:-1], pts[1:]):
        if i <= b[0]:
            t = float(lisse5((i - a[0]) / max(1e-6, b[0] - a[0]))); x = a[1] + (b[1] - a[1]) * t; y = a[2] + (b[2] - a[2]) * t; p = a[3] + (b[3] - a[3]) * t; q = a[4] + (b[4] - a[4]) * t
            if souffle and souffle[0] <= i <= souffle[1]:
                w = float(lisse(i, souffle[0], souffle[0] + 12)) * (1 - float(lisse(i, souffle[1] - 8, souffle[1]))); y += 1.6 * w * np.sin(2 * np.pi * (i - souffle[0]) / 46.0); x += .7 * w * np.sin(2 * np.pi * (i - souffle[0]) / 71.0)
            return ecran.doigt(img, M, e, x, y, p, q)
    return img

# ======================================================================================= A. 21 h 40
QUAD = cuisine.QUAD                                                          # l'écran du téléphone posé sur la table (image 1 de la planche)
_ec = {}
def ecran_table(nom):
    if nom not in _ec: _ec[nom] = cv2.imread('%s/cap/%s.png' % (CINE, nom)).astype(np.float32) / 255
    return _ec[nom]
BOITE = (470, 1200, 2170, 1740)                                              # la zone de l'image où est le téléphone (gauche, haut, droite, bas)
_mt = {}
def masque_tel():
    """Le téléphone seul (son écran, son bord, sa tranche), à bords doux : c'est lui qui tremble, pas la table."""
    if 'm' not in _mt:
        x0, y0, x1, y1 = BOITE; c = QUAD.mean(axis=0); q = c + (QUAD - c) * 1.075; q[2] += (10, 62); q[3] += (-34, 58); q[1] += (30, 26); q[0] += (0, -8)
        m = np.zeros((y1 - y0, x1 - x0), np.float32); cv2.fillConvexPoly(m, np.int32(np.round(q - (x0, y0))), 1.0, cv2.LINE_AA)
        _mt['m'] = cv2.GaussianBlur(m, (0, 0), 7)[..., None]
    return _mt['m']
def tremble(n):
    """La force du tremblement à l'image n du film (0 hors des 2 impulsions du vibreur)."""
    a = 0.0
    for d, dur, f in ((CT.VIB1, CT.D_VIB1, 1.0), (CT.VIB2, CT.D_VIB2, .8)):
        t = (n - d) / IPS
        if -.02 < t < dur + .06: a = max(a, f * float(lisse(t, -.01, .03)) * (1 - float(lisse(t, dur - .02, dur + .05))))
    return a
def table(nom, force, n=None, secoue=True):
    """La table de la cuisine (image 1), le téléphone allumé à la force donnée. n : l'image du film, pour le tremblement du téléphone pendant le vibreur."""
    P = cuisine.avec_ecran(nom, ecran_table(nom), force)
    a = tremble(n) if (secoue and n is not None) else 0.0
    if a <= .01: return P
    x0, y0, x1, y1 = BOITE; zone = P[y0:y1, x0:x1]; rng = np.random.default_rng(4100 + int(n)); acc = np.zeros_like(zone); cx, cy = QUAD.mean(axis=0) - (x0, y0); K = 4
    for k in range(K):                                                       # le vibreur va bien plus vite que la caméra : dans une image on voit plusieurs positions, fondues
        dx, dy = rng.normal(0, 1.5, 2) * a; rot = rng.normal(0, .045) * a
        M = cv2.getRotationMatrix2D((float(cx), float(cy)), rot, 1.0); M[0, 2] += dx; M[1, 2] += dy
        acc += cv2.warpAffine(zone, M, (x1 - x0, y1 - y0), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    out = P.copy() if out_is_plate(P) else P; m = masque_tel(); out[y0:y1, x0:x1] = zone * (1 - m) + (acc / K) * m
    return out
def out_is_plate(P): return P is cuisine.planche(1)

_bas = {}
def planche_basse(P):
    """Bande-annonce : la table prolongée vers le bas, pour pouvoir remonter le téléphone dans la zone libre d'Instagram. Le bois du tout premier plan (sous le téléphone)
    est repris en miroir, plusieurs fois, de plus en plus doux et un peu plus sombre : cette partie de l'image est sous les commandes du réseau."""
    h = 560; b = 150; bande = P[-b:]; m = np.vstack([bande[::-1], bande, bande[::-1], bande])[:h]
    doux = cv2.GaussianBlur(m, (0, 0), 26); r = lisse(np.arange(h, dtype=np.float32), 0, 170)[:, None, None]
    return np.vstack([P, (m * (1 - r) + doux * r) * (1 - .24 * lisse(np.arange(h, dtype=np.float32), 60, h)[:, None, None])]).astype(np.float32)
A1 = {'V': (1850, 930, 1.02), 'H': (1658, 930, 1.03)}                        # le cadrage du premier téléphone. Il ne bouge pas, et il revient à l'identique à la fin du film (plan e2b).
def cadre_table(P, f):
    if f == 'I': return cuisine.cadre(planche_basse(P), f, 1850, 1490, 1.02 * (1860 + 560) / 1860)
    return cuisine.cadre(P, f, *A1[f])
_a1 = {}
def a1(i, f, n=None):
    """Un téléphone à plat sur la table en bois. Il vibre 2 fois (on le voit trembler à peine), l'écran s'allume : 21 h 40, un message d'Élise. Rien d'autre ne bouge.
    Puis la ligne qui dit pour qui est le site."""
    n = i if n is None else n; force = float(lisse(n, CT.VIB1, CT.VIB1 + 4.2)); a = tremble(n)
    if a <= .01 and (force <= .001 or force >= .999):                        # rien ne bouge : l'image est faite une fois
        k = (f, force > .5)
        if k not in _a1: _a1[k] = cadre_table(table('verrou', force, None, False), f)
        img = _a1[k]
    else: img = cadre_table(table('verrou', force, n), f)
    p = float(lisse(n, CT.PUBLIC[0], CT.PUBLIC[1])) * (1 - float(lisse(n, CT.PUBLIC[2], CT.PUBLIC[3])))
    return pose2(img, 'public', f, p, bande=.56, doux=150)

REPA = json.load(open(CINE + '/cap/fila/reperes.json')); REPE = json.load(open(CINE + '/cap/file/reperes.json'))
FIL = {'V': (346.5, 2.7693, .07), 'I': (379.0, 2.7693, .07), 'H': (328.0, 3.1, .1)}       # le cadrage du fil : le même pour le premier message et pour le dernier
def fil(dossier, i, n, f):
    u = pl(CAP + dossier, min(int(i), n - 1)); a = float(lisse(i / n, -.1, 1.1)); cy, e0, de = FIL[f]; e = e0 + de * a; W, H = FORMATS[f]
    img, M = appareil(u, f, 195, cy, e, 693, ax=W / 2, ay=H / 2); return img, M, e
ENV = (REPA['ENV_I'][0]['x'], REPA['ENV_I'][0]['y']); EFF = (REPA['EFF']['x'], REPA['EFF']['y']); PT = (REPA['POINT']['x'], REPA['POINT']['y'])
P30 = (ENV[0] + (PT[0] - ENV[0]) * .30, ENV[1] + (PT[1] - ENV[1]) * .30); HOV = (ENV[0] - 7, ENV[1] + 30)       # le pouce en l'air, juste sous le bouton d'envoi
FA = CT.FIL_A
POUCE_A = [(FA['ap'] - 11, P30[0], P30[1], 0, 0), (FA['ap'] - 3, ENV[0], ENV[1], 1, 0), (FA['ap'], ENV[0], ENV[1], 1, 1), (FA['ap'] + 3, ENV[0], ENV[1], 1, 1), (FA['ap'] + 5, ENV[0], ENV[1], 1, 0), (FA['ap'] + 11, ENV[0] + 4, ENV[1] + 10, 0, 0),
           (FA['f2'] + FA['n2'] + 3, ENV[0] - 20, ENV[1] + 74, 0, 0), (FA['f2'] + FA['n2'] + 19, HOV[0], HOV[1], .92, 0), (FA['ef'] - 10, HOV[0], HOV[1], .92, 0), (FA['ef'] - 2, EFF[0], EFF[1], 1, 0), (FA['ef'], EFF[0], EFF[1], 1, 1),
           (FA['ef'] + FA['ne'], EFF[0], EFF[1], 1, 1), (FA['ef'] + FA['ne'] + 3, EFF[0], EFF[1], 1, 0), (FA['ef'] + FA['ne'] + 13, EFF[0] - 6, EFF[1] + 14, 0, 0)]
def a2(i, f):
    """Le fil. « Comment va ta fille ? » « Elle va bien, merci. » Il envoie. Puis « En fait, moi… » : le pouce vient près d'Envoyer, s'arrête, redescend sur la touche d'effacement. Le champ est vide."""
    img, M, e = fil('fila', i, N['a2'], f)
    return pouce(img, M, e, i, POUCE_A, souffle=(FA['f2'] + FA['n2'] + 19, FA['ef'] - 10)), False

_a3 = {}
def a3(i, f, t_ici=25):
    """Le téléphone est retourné sur la table. La main est allée au verre. Un silence, puis la promesse du site."""
    if f not in _a3:
        if f == 'H': _a3[f] = cuisine.cadre(cuisine.planche(2), f, 1700, 915, 1.06)
        else: _a3[f] = cuisine.cadre(cuisine.planche_haute(), f, 1960, 1110, 1.0)
    img = _a3[f]; p = float(lisse(i, t_ici, t_ici + 20))
    if f == 'H':
        W, H = FORMATS[f]; y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]; img = img * (1 - lisse(y, .62, .98).astype(np.float32) * .42 * p)
    return pose2(img, 'ici', f, p)

# ======================================================================================= B. « Déposer ce qui pèse »
JD = PP.JD; JR = PP.JR
def b1(i, f):
    """L'accueil du site, cadré sur « Déposer ce qui pèse ». Un seul appui."""
    n = N['b1']; c0, c1 = PP.B1[f]; a = float(lisse(i / n, -.15, 1.0)); e = float(np.exp(np.log(c0[2]) * (1 - a) + np.log(c1[2]) * a))
    img, M = appareil(PP.accueil_net(), f, c1[0], c1[1], e, 844, chaleur=1.5)
    p = float(lisse(i, 18, 30)); q = float(lisse5(i, 16, 38))
    return ecran.doigt(img, M, e, PP.DOIGT_B1[0] + 14 * (1 - q), PP.DOIGT_B1[1] + 34 * (1 - q), p, float(lisse(i, n - 4, n - 1)), rayon=17, force=.8), False
T_CHAMP, T_FRAPPE = 46, 58                                                   # il touche le champ, puis commence à écrire
F1, F_PAUSE, F2 = 56, 14, 46
T_ECRIT = T_FRAPPE + F1 + F_PAUSE + F2                                       # 174
def lettres(i):
    if i < T_FRAPPE: return 0
    a, b = T_FRAPPE, T_FRAPPE + F1
    if i <= b: return int(round(PP.PHRASE1 * (i - a) / (b - a)))
    c, d = b + F_PAUSE, b + F_PAUSE + F2
    if i < c: return PP.PHRASE1
    return int(min(len(PP.TEXTE), round(PP.PHRASE1 + (len(PP.TEXTE) - PP.PHRASE1) * (i - c) / (d - c))))
def ecran_depot(i):
    """L'écran « Déposer ce qui pèse » à l'image i du plan b2 (et au-delà : le texte est écrit, le curseur clignote)."""
    if i < T_CHAMP: return pl('depot', 0)
    if i < T_CHAMP + 8: return pl('depot', 1 + int(i - T_CHAMP))
    k = lettres(i); u = pl('depot', PP.P_PRET - 1 + k, garde=3); c = PP.CAR[k]
    dernier = T_FRAPPE if k == 0 else (T_ECRIT if k >= len(PP.TEXTE) else i)
    vu = (i - dernier) < 15 or int((i - dernier) / 15) % 2 == 0
    return curseur(u, c['x'], c['y'] + 1, c['h'] - 2) if vu else u
CH = JD['avant']['champ']; CHY = CH['y'] + CH['h'] / 2
class _B2:
    cles = cles([(0, 195, 410, 2.77), (36, 195, 410, 2.77), (64, 195, 452, 2.92), (200, 195, 470, 3.0)],
                I=[(0, 195, 377, 2.436), (64, 195, 377, 2.436), (200, 195, 400, 2.5)],
                H=[(0, 195, 190, 3.0), (36, 195, 190, 3.0), (66, 195, CHY - 26, 3.3), (200, 195, CHY - 14, 3.4)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(ecran_depot(i), f, cx, cy, e, 1000, tete=66)
        if i <= 17:
            c0 = PP.B1[f][1]; a, Ma = appareil(PP.accueil_net(), f, c0[0], c0[1], c0[2], 844, chaleur=1.5)
            ox, oy = PP.point(Ma, *PP.DOIGT_B1); img = PP.onde_image(a, img, ox, oy, i)
            img = ecran.doigt(img, Ma, c0[2], PP.DOIGT_B1[0], PP.DOIGT_B1[1], 1 - float(lisse(i, 3, 11)), 1 - float(lisse(i, 0, 5)), rayon=17, force=.8)
        return PP.doigt_t(img, M, e, CH['x'] + 62, CH['y'] + 42, i, T_CHAMP - 14, T_CHAMP, T_CHAMP + 3), False
b2 = _B2()
DIRE_B = JD['avant']['dire']; DIRE_Y = DIRE_B['y'] + DIRE_B['h'] / 2
class _B3:
    cles = cles([(0, 195, 470, 3.0), (30, 195, 512, 3.0), (50, 195, 512, 3.0)], I=[(0, 195, 400, 2.5), (30, 195, 560, 2.5), (50, 195, 560, 2.5)], H=[(0, 195, CHY - 14, 3.4), (30, 195, DIRE_Y - 60, 3.4), (50, 195, DIRE_Y - 60, 3.4)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(ecran_depot(N['b2'] + i), f, cx, cy, e, 1000, tete=66)
        return PP.doigt_t(img, M, e, PP.DOIGT_B3[0], PP.DOIGT_B3[1], i, 16, N['b3'] - 4, N['b3'] + 9), False
b3 = _B3()
AM = JR['amorce']; AMY = AM['y'] + AM['h'] / 2
class _B4:
    cles = cles([(0, 195, 412, 2.77), (46, 195, 412, 2.77), (104, 195, AMY - 6, 3.12), (200, 195, AMY - 6, 3.2)],
                I=[(0, 195, 377, 2.436), (46, 195, 377, 2.436), (104, 195, AMY + 4, 2.7), (200, 195, AMY + 4, 2.75)],
                H=[(0, 195, 250, 2.6), (46, 195, 250, 2.6), (100, 195, AMY - 12, 4.25), (200, 195, AMY - 12, 4.4)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(PP.dire_net(float(lisse(i, 56, 90))), f, cx, cy, e, 1000, tete=66)
        if i <= 17:
            c0 = b3.cles[f][-1]; a, Ma = appareil(ecran_depot(N['b2'] + N['b3'] + i), f, c0[1], c0[2], c0[3], 1000, tete=66)
            ox, oy = PP.point(Ma, *PP.DOIGT_B3); img = PP.onde_image(a, img, ox, oy, i)
            img = ecran.doigt(img, Ma, c0[3], PP.DOIGT_B3[0], PP.DOIGT_B3[1], 1 - float(lisse(i, 3, 11)), 1 - float(lisse(i, 0, 5)), rayon=17, force=.8)
        return img, False
b4 = _B4()

# ======================================================================================= C. Le lendemain : la fiche « Les écrans », le minuteur, les dominos, la goutte
JF = PP.JF; JM = PP.JM; LIS = PP.LIS
_fn = {}
def fiche_net2(force):
    """La fiche « Les écrans » : son titre et l'idée du minuteur visuel gardent leur lumière, le reste en perd un peu."""
    u = pl('fiche', 1)
    if force <= .003: return u
    if 'm' not in _fn:
        hh = u.shape[0]; yy = (np.arange(hh, dtype=np.float32) / DSF)[:, None]
        def bande(y0, y1, m=10): return lisse(yy, y0 - m, y0) * (1 - lisse(yy, y1, y1 + m))
        garde = np.maximum(bande(JF['label']['y'] - 8, JF['sous']['y'] + JF['sous']['h'] + 8), bande(LIS[1]['by'] - 7, LIS[1]['by'] + LIS[1]['bh'] + 7))
        _fn['m'] = (1 - garde).astype(np.float32)[..., None]
        _fn['d'] = (u * np.float32(.74) + np.float32([.52, .60, .60]) * np.float32(.09)).astype(np.float32)
    k = _fn['m'] * np.float32(force); return u * (1 - k) + _fn['d'] * k
FY = (JF['label']['y'] + LIS[1]['by'] + LIS[1]['bh']) / 2                    # le milieu entre le titre de la fiche et l'idée du minuteur
TY = (JF['label']['y'] + JF['sous']['y'] + JF['sous']['h']) / 2; IY = LIS[1]['by'] + LIS[1]['bh'] / 2          # le milieu du titre de la fiche, le milieu de l'idée du minuteur
class _C1:
    """Vertical : un seul cadre, où l'on lit ensemble « Les écrans » et l'idée du minuteur. Horizontal (et bande-annonce) : le titre de la fiche d'abord, puis le cadre descend sur l'idée."""
    cles = cles([(0, 195, FY + 6, 2.77), (125, 195, FY + 6, 2.77)], I=[(0, 195, TY + 110, 2.436), (70, 195, TY + 110, 2.436), (90, 195, IY - 30, 2.6), (125, 195, IY - 30, 2.62)],
                H=[(0, 195, TY + 44, 3.0), (72, 195, TY + 44, 3.0), (92, 195, IY - 6, 3.3), (125, 195, IY - 4, 3.36)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); return appareil(fiche_net2(float(lisse(i, 52, 74))), f, cx, cy, e, 1500, lieu='pere', tete=66)[0], True
c1p = _C1()
def fiche_plan(i, f): return PP.filme(c1p, i, f)[0]
def c1(i, f):
    """« Le lendemain », sur la cuisine floue. Puis la fiche « Les écrans », et dans la fiche l'idée du minuteur visuel."""
    b = fond('pere', f) * np.float32(1.25)
    img = pose2(b, 'lendemain', f, float(lisse(i, 3, 11)) * (1 - float(lisse(i, 27, 37))))
    k = float(lisse(i, 30, 44))
    if k > 0: img = img * (1 - k) + fiche_plan(i, f) * k
    return img, k > .5
LANCER = JM['avant']['lancer']; DOIGT_C2 = (LANCER['x'] + LANCER['w'] * .55, LANCER['y'] + LANCER['h'] * .5)
C2_T, C2_D, C2_FIN = 12, 15, 76                                              # l'appui sur « Lancer », le disque qui se vide (en accéléré), « C'est fini. Bravo. »
def ecran_minuteur(i):
    m = JM['marques']; i = int(i)
    if i < C2_T: return pl('minuteur', 0)
    if i < C2_D: return pl('minuteur', m['toucher'] + (i - C2_T))
    if i < C2_FIN: return pl('minuteur', int(round(m['depart'] + (i - C2_D) * (m['fini'] - m['depart']) / (C2_FIN - C2_D))))
    return pl('minuteur', min(m['fini'] + (i - C2_FIN), JM['images'] - 1))
class _C2:
    """Horizontal : le cadre descend un peu quand le temps est écoulé, pour lire « C'est fini. Bravo. » au bas de l'écran."""
    cles = cles([(0, 195, 462, 2.77), (100, 195, 462, 2.77)], I=[(0, 195, 520, 2.436), (100, 195, 520, 2.436)], H=[(0, 195, 404, 1.9), (58, 195, 404, 1.9), (78, 195, 540, 1.9), (100, 195, 540, 1.9)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(ecran_minuteur(i), f, cx, cy, e, 900, lieu='pere', tete=66)
        return PP.doigt_t(img, M, e, DOIGT_C2[0], DOIGT_C2[1], i, 0, C2_T, C2_T + 4), False
c2 = _C2()
def c3(i, f):
    """La tablette est refermée, posée sur la table. Les dominos sont dans les mains."""
    n = N['c3']; return pose2(fixes.fixe('tablette', f), 'tablette', f, float(lisse(i, 5, 15)) * (1 - float(lisse(i, n - 12, n - 2))), bande=.5, doux=120)
def c4(i, f): return fixes.fixe('domino', f)
def c5(i, f): return fixes.fixe('pere', f)
def c6(i, f): return fixes.fixe('fille', f)
C7_0 = ecran.C_EXPIREZ - 42                                                  # la goutte finit de monter (42 images), puis elle redescend
def c7(i, f):
    """La goutte de « Souffler 2 minutes » : elle finit de monter, puis redescend. La musique respire avec elle."""
    C = C7_0 + int(min(i, ecran.C_FIN - C7_0)); cx, cy, e = PP.GOUTTE1[f]; W, H = FORMATS[f]
    img = appareil(pl('../../app-ig', C, garde=3), f, cx, cy, e, 844, ax=W / 2, ay=H / 2)[0]
    ps = float(lisse(i, 12, 30)) * (1 - float(lisse(i, N['c7'] - 14, N['c7'] - 3)))
    if f == 'H': img = img * (1 - ombre(f, 900, 1010, .5, 90) * ps)
    return pose(img, 'souffler', f, ps), False

# ======================================================================================= D. Bastien
def d1(i, f):
    """Bastien, à sa hauteur. Il écrit lui-même. On voit la table, sa main, la roue de son fauteuil."""
    n = N['d1']; return pose2(fixes.fixe('bastien', f), 'bastien', f, float(lisse(i, 12, 26)) * (1 - float(lisse(i, n - 14, n - 3))), bande=.55, doux=130)
JP = JC('parole'); CARP = JP['carets']; SUITE = JP['suite']; DOIGT_D2 = (JP['doigt']['x'], JP['doigt']['y']); CHP = JP['apres']['champ']
D2_0, D2_T, D2_F, D2_N = 34, 66, 86, 90                                      # la fin de l'écran d'accueil de l'outil, l'appui sur « J'aime… », le début de la frappe, sa durée
D2_ECRIT = D2_F + D2_N
def _coul(s):
    v = [float(x) for x in s[s.index('(') + 1:s.index(')')].split(',')[:3]]; return (v[2] / 255, v[1] / 255, v[0] / 255)
CARET_P = _coul(CARP[0]['caret']) if 'rgb' in CARP[0]['caret'] else (.11, .19, .07)
def ecran_parole(i):
    m = JP['marques']; i = int(i)
    if i < D2_T: return pl(CAP + 'parole', 0)
    if i < D2_T + 14: return pl(CAP + 'parole', m['toucher'] + (i - D2_T))
    k = 0 if i < D2_F else min(len(SUITE), int((i - D2_F) * len(SUITE) / D2_N) + 1)
    u = pl(CAP + 'parole', m['pret'] - 1 + k, garde=3); c = CARP[k]
    dernier = D2_F if k == 0 else (D2_ECRIT if k >= len(SUITE) else i)
    vu = (i - dernier) < 15 or int((i - dernier) / 15) % 2 == 0
    return curseur(u, c['x'], c['y'] + 1, c['h'] - 2, coul=CARET_P) if vu else u
_pn = {}
def parole_net(u, force):
    """Pendant qu'on lit la phrase de Bastien, le reste de l'écran perd un peu de sa présence."""
    if force <= .003: return u
    if 'm' not in _pn:
        hh = u.shape[0]; yy = (np.arange(hh, dtype=np.float32) / DSF)[:, None]; y0, y1 = CHP['y'] - 10, CHP['y'] + CHP['h'] + 10
        _pn['m'] = (1 - lisse(yy, y0 - 10, y0) * (1 - lisse(yy, y1, y1 + 10))).astype(np.float32)[..., None]
    k = _pn['m'] * np.float32(force); return u * (1 - k) + (u * np.float32(.80) + np.float32([.60, .66, .66]) * np.float32(.06)) * k
CPY = CHP['y'] + CHP['h'] / 2; CPX = CHP['x'] + CHP['w'] / 2
class _D2:
    cles = cles([(0, 195, 404, 2.77), (D2_T + 8, 195, 404, 2.77), (D2_T + 38, CPX + 8, CPY + 6, 3.22), (225, CPX + 8, CPY + 4, 3.3)],
                I=[(0, 195, 330, 2.436), (D2_T + 8, 195, 330, 2.436), (D2_T + 38, 195, CPY - 30, 2.72), (225, 195, CPY - 30, 2.76)],
                H=[(0, 195, 395, 1.9), (D2_T + 8, 195, 395, 1.9), (D2_T + 38, CPX, CPY + 2, 4.3), (225, CPX, CPY + 2, 4.5)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); u = parole_net(ecran_parole(i), float(lisse(i, D2_ECRIT + 4, D2_ECRIT + 22)))
        img, M = appareil(u, f, cx, cy, e, 1000, lieu='bastien', tete=66)
        return PP.doigt_t(img, M, e, DOIGT_D2[0], DOIGT_D2[1], i, D2_T - 15, D2_T, D2_T + 3), True
d2p = _D2()
D2_ACC = {'V': (195, 262, 2.77), 'I': (195, 300, 2.436), 'H': (195, 200, 3.1)}      # l'écran d'accueil de l'outil : son nom, « Passer le relais », et ce qu'il promet
_d2a = {}
def d2(i, f):
    """« Passer le relais » : le nom de l'outil, tel qu'une famille le découvre. Puis l'étape « Sa parole » : Bastien choisit « J'aime… » et écrit sa phrase."""
    k = float(lisse(i, D2_0 - 4, D2_0 + 4))
    if k >= 1: return PP.filme(d2p, i, f)
    if f not in _d2a: _d2a[f] = appareil(pl(CAP + 'relais0', 1), f, *D2_ACC[f], 1000, lieu='bastien', tete=66)[0]
    if k <= 0: return _d2a[f], True
    return _d2a[f] * (1 - k) + PP.filme(d2p, i, f)[0] * k, True
# --- il tend lui-même la fiche : la vraie fiche, telle qu'elle s'imprime, vient vers nous. Derrière elle, Bastien devient flou.
JA5 = json.load(open(CINE + '/cap/fiche-a5.json'))
_feuille = {}
PX = 4                                                                        # points de l'image de la fiche par point de page
L_PAGE, MARGE_H, MARGE_G = 559.0, 36.0, 16.0                                 # la feuille : 148 mm de large (559 points), la marge du haut, la marge de côté
def feuille():
    """La feuille imprimée : la fiche (capturée avec la mise en page d'impression du site) sur son papier. Rend (image, présence)."""
    if 'p' not in _feuille:
        fi = cv2.imread(CINE + '/cap/fiche-a5.png').astype(np.float32) / 255; fi = cv2.resize(fi, (int(round(JA5['fiche']['w'] * PX)), int(round(JA5['fiche']['h'] * PX))), interpolation=cv2.INTER_AREA)
        h = int((MARGE_H + JA5['fiche']['h'] + 60) * PX); w = int(L_PAGE * PX); p = np.ones((h, w, 3), np.float32)
        y0, x0 = int(MARGE_H * PX), int(MARGE_G * PX); p[y0:y0 + fi.shape[0], x0:x0 + fi.shape[1]] = fi
        yy = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]; xx = np.linspace(0, 1, w, dtype=np.float32)[None, :, None]
        lum = .95 - .05 * yy + .02 * (1 - xx)                                                            # la lumière de la fenêtre vient de la gauche et d'en haut
        g = cv2.GaussianBlur(np.random.default_rng(5).standard_normal((h // 2, w // 2)).astype(np.float32), (0, 0), 1.2); g = cv2.resize(g, (w, h))[..., None] * .012   # le grain du papier
        _feuille['p'] = (p * (lum + g) * np.float32([.93, .965, 1.0])).astype(np.float32)
    return _feuille['p']
# La place finale de la feuille (largeur en points d'image, son haut, son milieu, son angle), et d'où elle part (la main de Bastien dans la photo, par format).
D3 = {'V': dict(l=1000, x=548, y=640, a=-1.3, x0=850, y0=800, l0=250, a0=-13),
      'I': dict(l=890, x=540, y=560, a=-1.3, x0=780, y0=760, l0=230, a0=-13),
      'H': dict(l=820, x=1330, y=110, a=1.6, x0=770, y0=560, l0=230, a0=-10)}
D3_T = (10, 46)                                                              # la feuille part, la feuille est là
def _pose_feuille(f, t, net=1.0):
    """Pose la feuille dans l'image. t de 0 (dans la main de Bastien) à 1 (devant nous)."""
    c = D3[f]; W, H = FORMATS[f]; P = feuille(); hp, wp = P.shape[:2]
    l = float(np.exp(np.log(c['l0']) * (1 - t) + np.log(c['l']) * t)); s = l / wp; ang = c['a0'] * (1 - t) + c['a'] * t
    xm = c['x0'] * (1 - t) + c['x'] * t; yh = c['y0'] * (1 - t) + c['y'] * t                           # le milieu du bord haut de la feuille
    M = cv2.getRotationMatrix2D((0, 0), -ang, s); M[0, 2] = xm - (M[0, 0] * wp / 2); M[1, 2] = yh - (M[1, 0] * wp / 2)
    src = P if s > .6 else cv2.GaussianBlur(P, (0, 0), max(.01, .5 / s - .45))
    f_img = cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_AREA if s < 1 else cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    m = cv2.warpAffine(np.ones((hp, wp), np.float32), M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    if net < .98:
        sg = (1 - net) * 5.0; f_img = cv2.GaussianBlur(f_img, (0, 0), sg); m = cv2.GaussianBlur(m, (0, 0), sg)
    return f_img, m[..., None]
_d3 = {}
def d3(i, f):
    """Bastien tend lui-même sa fiche. On est à la place de son oncle : la feuille vient vers nous et devient nette, Bastien reste derrière, flou."""
    base = fixes.fixe('bastien', f); t = float(lisse5(i, D3_T[0], D3_T[1])); k = float(lisse(i, D3_T[0] - 4, D3_T[1] - 6))
    if k >= .999:
        if f not in _d3:
            fi, m = _pose_feuille(f, 1.0); _d3[f] = (cv2.GaussianBlur(base, (0, 0), 15) * np.float32(.86), fi, m)
        fl, fi, m = _d3[f]; dj = i - D3_T[1]
        if dj < 30:                                                          # la feuille finit de se poser dans la main qui la reçoit : un rien de mouvement
            dy = 5.0 * np.exp(-dj / 9.0) * np.cos(dj / 4.2); M = np.float64([[1, 0, 0], [0, 1, dy]])
            fi = cv2.warpAffine(fi, M, (fi.shape[1], fi.shape[0])); m = cv2.warpAffine(m, M, (fi.shape[1], fi.shape[0]))[..., None]
        om = ecran.flou_large(m[..., 0], 46)[..., None] * np.float32(.30)                                    # un peu d'ombre autour de la feuille : elle est devant
        return fl * (1 - om) * (1 - m) + fi * m
    fl = cv2.GaussianBlur(base, (0, 0), .01 + 15 * k) * np.float32(1 - .14 * k) if k > .01 else base
    if t <= 0: return fl
    K = 6; acc_i = None; acc_m = None
    for d in range(K):                                                       # le mouvement de la feuille : plusieurs instants dans une image
        td = float(lisse5(i + d / K, D3_T[0], D3_T[1])); fi, m = _pose_feuille(f, td, net=float(lisse(td, .0, .8)))
        acc_i = fi * m if acc_i is None else acc_i + fi * m; acc_m = m if acc_m is None else acc_m + m
    fi, m = acc_i / K, acc_m / K; pres = float(lisse(t, 0, .12)); m = m * pres; fi = fi * pres
    om = ecran.flou_large(m[..., 0], 46)[..., None] * np.float32(.30 * t)
    return fl * (1 - om) * (1 - m) + fi
def d4(i, f):
    """Dimanche matin, chez Rémi. La lumière de la fenêtre. Bastien boit son café, seul, comme il l'avait demandé."""
    return pose2(fixes.fixe('cafe', f), 'dimanche', f, float(lisse(i, 6, 18)) * (1 - float(lisse(i, 76, 92))), bande=.5, doux=120)

# ======================================================================================= E. Un autre soir
JCA = JC('carnet'); GES = JCA['geste']
_cn = {}
def carnet_net(force):
    u = pl(CAP + 'carnet', 1)
    if force <= .003: return u
    if 'm' not in _cn:
        hh = u.shape[0]; yy = (np.arange(hh, dtype=np.float32) / DSF)[:, None]; y0, y1 = 276.0, 478.0
        _cn['m'] = (1 - lisse(yy, y0 - 12, y0) * (1 - lisse(yy, y1, y1 + 12))).astype(np.float32)[..., None]; _cn['d'] = (u * np.float32(.66)).astype(np.float32)
    k = _cn['m'] * np.float32(force); return u * (1 - k) + _cn['d'] * k
class _E1:
    cles = cles([(0, 195, 322, 2.77), (74, 195, 322, 2.77), (118, 195, 376, 3.0), (150, 195, 378, 3.04)],
                I=[(0, 195, 210, 2.436), (74, 195, 210, 2.436), (118, 195, 330, 2.6), (150, 195, 332, 2.62)],
                H=[(0, 195, 290, 1.9), (74, 195, 290, 1.9), (118, 195, 372, 3.5), (150, 195, 374, 3.6)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); return appareil(carnet_net(float(lisse(i, 84, 112))), f, cx, cy, e, 1100, tete=66)[0], False
e1p = _E1()
def e1(i, f):
    """« Un autre soir », sur la cuisine du premier soir. Puis son carnet de route : le geste qu'il a choisi pendant le parcours."""
    b = fond('nuit', f) * np.float32(1.35)
    img = pose2(b, 'autresoir', f, float(lisse(i, 3, 11)) * (1 - float(lisse(i, 27, 37))))
    k = float(lisse(i, 30, 44))
    if k > 0: img = img * (1 - k) + PP.filme(e1p, i, f)[0] * k
    return img, False
E2 = {'V': (980, 930, 1.02), 'H': (880, 1075, 1.86), 'I': (980, 930, 1.02)}
_e2 = {}
def e2(i, f):
    """Sa main, à plat sur le bois. Le téléphone est là, éteint."""
    if f not in _e2: _e2[f] = cuisine.cadre(cuisine.planche(1), f, *E2[f])
    return _e2[f]
_e2b = {}
def e2b(i, f):
    """Le cadrage du premier téléphone, à l'identique. Rien ne vibre. C'est lui qui l'allume."""
    force = float(lisse(i, 15, 19.2))
    if force <= .001 or force >= .999:
        k = (f, force > .5)
        if k not in _e2b: _e2b[k] = cadre_table(table('reveil', force, None, False), f)
        return _e2b[k]
    return cadre_table(table('reveil', force, None, False), f)
FE = CT.FIL_E
def pouce_e(ap=FE['ap'], fin=FE['f1'] + FE['n1']):
    return [(fin + 2, ENV[0] - 20, ENV[1] + 74, 0, 0), (fin + 18, HOV[0], HOV[1], .92, 0), (ap - 7, HOV[0], HOV[1], .92, 0), (ap - 1, ENV[0], ENV[1], 1, 0), (ap, ENV[0], ENV[1], 1, 1), (ap + 4, ENV[0], ENV[1], 1, 1), (ap + 7, ENV[0], ENV[1], 1, 0), (ap + 17, ENV[0] + 4, ENV[1] + 12, 0, 0)]
POUCE_E = pouce_e()
def e3(i, f):
    """Le même fil, le même cadrage. Cette fois c'est lui qui écrit à Élise. Le pouce vient près d'Envoyer, s'arrête comme le premier soir. Puis il appuie. Le message reste."""
    img, M, e = fil('file', i, N['e3'], f)
    return pouce(img, M, e, i, POUCE_E, souffle=(FE['f1'] + FE['n1'] + 18, FE['ap'] - 7)), False
def e4(i, f, avant):
    """La signature : le logo, « Parent écouté, parent éclairé », « Ici, on commence par vous. », l'adresse."""
    return PP.g2(i, f, avant)

PHOTO = ('a1', 'a3', 'c3', 'c4', 'c5', 'c6', 'd1', 'd3', 'd4', 'e2', 'e2b')     # les plans de photo : la finition de la pellicule (les autres sont des écrans filmés)
CLAIRS = ('d2',)
