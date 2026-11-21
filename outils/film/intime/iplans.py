# Montage intime de « Ce qu'on ne dit pas par SMS » (21 novembre 2026) : les plans. Format V (1080 × 1920), H (1920 × 1080) et I (la bande-annonce verticale).
# Chaque plan est une fonction (i, f) → image, ou (image, écran clair). Les outils viennent du premier montage (pres/) et du montage cinématographique (cine/cplans.py).
import sys, os, json, numpy as np, cv2
INT = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(INT); CINE = FILM + '/cine'
sys.path[:0] = [INT, CINE, FILM + '/pres', FILM]
from pm import *
import plans as PP
import cplans as C
import itemps as IT
import ifixes
INT = os.path.dirname(os.path.abspath(__file__))                              # (les outils importés ont leurs propres noms de dossier : celui-ci est redit après eux)
C.CT = IT                                                                    # la table du début (C.a1, C.tremble) lit les instants de ce montage : les 2 vibrations, la ligne du public
N = IT.D; DEB = IT.DEBUT
CAPI = '../../intime/cap/'                                                   # les captures de ce montage, vues depuis pres/cap/
def JI(nom): return json.load(open('%s/cap/%s/journal.json' % (INT, nom)))
cles = PP.cles

# ---------------------------------------------------------------- les textes : ceux de ce montage d'abord (titres/), sinon ceux des montages précédents
TJI = json.load(open(INT + '/titres/titres.json')); _tx = {}
def pose3(img, nom, f, presence, bande=0.0, doux=110):
    if presence <= .003: return img
    c = '%s/titres/%s-%s.png' % (INT, nom, f)
    if not os.path.exists(c): return C.pose2(img, nom, f, presence, bande, doux)
    k = (nom, f)
    if k not in _tx:
        x = cv2.imread(c, cv2.IMREAD_UNCHANGED).astype(np.float32) / 255; _tx[k] = (x[..., :3], x[..., 3:])
    if bande > 0:
        r = TJI[nom + '-' + f]; img = img * (1 - ombre(f, r['y0'] - 26, r['y1'] + 26, bande, doux) * np.float32(presence))
    col, a = _tx[k]; a = a * np.float32(presence); return img * (1 - a) + col * a

# ======================================================================================= A. Le message d'Élise
def a1(i, f):
    """Cuisine du soir. Le téléphone en veille sur le chêne. On n'entend que la pièce. 2 vibrations (il tremble à peine), l'écran s'allume : 21 h 40, un message d'Élise."""
    return C.a1(i, f)
FA = IT.FIL_A
def fil(dossier, i, n, f):
    u = pl(CAPI + dossier, min(int(i), n - 1)); a = float(lisse(i / n, -.1, 1.1)); cy, e0, de = C.FIL[f]; e = e0 + de * a; W, H = FORMATS[f]
    img, M = appareil(u, f, 195, cy, e, 693, ax=W / 2, ay=H / 2); return img, M, e
ENV = C.ENV; P30 = C.P30
POUCE_A = [(FA['ap'] - 12, P30[0], P30[1], 0, 0), (FA['ap'] - 3, ENV[0], ENV[1], 1, 0), (FA['ap'], ENV[0], ENV[1], 1, 1), (FA['ap'] + 3, ENV[0], ENV[1], 1, 1), (FA['ap'] + 5, ENV[0], ENV[1], 1, 0), (FA['ap'] + 12, ENV[0] + 4, ENV[1] + 10, 0, 0)]
def a2(i, f):
    """Le fil. « Comment va ta fille ? » Il répond « Elle va bien, merci. » et envoie. Il sait répondre."""
    img, M, e = fil('fila2', i, N['a2'], f)
    return C.pouce(img, M, e, i, POUCE_A), False
def a3(i, f):
    """Le téléphone est retourné. Sa main ne bouge pas. Une note de piano dans le silence, puis la ligne qui dit pour qui est le site."""
    n = DEB['a3'] + i; img = C.a3(0, f, t_ici=10 ** 9)
    p = float(lisse(n, IT.PUBLIC[0], IT.PUBLIC[1])) * (1 - float(lisse(n, IT.PUBLIC[2], IT.PUBLIC[3])))
    return pose3(img, 'public', f, p, bande=.56, doux=150)

# ======================================================================================= B. Ce qui lui manque
JD = JI('depot2'); TEXTE = JD['texte']; CAR = JD['carets']; P_PRET = JD['marques']['pret']; CH = JD['avant']['champ']
T_CHAMP, T_FRAPPE, D_FRAPPE = 26, 40, 84                                     # il touche le champ, il commence à écrire, la durée de la frappe
T_ECRIT = T_FRAPPE + D_FRAPPE                                                # 124 : la phrase est écrite
def ecran_depot(i):
    """L'écran « Déposer ce qui pèse » à l'image i du plan b1 : vide, touché, puis la phrase qui s'écrit, puis le curseur qui clignote."""
    if i < T_CHAMP: return pl(CAPI + 'depot2', 0)
    if i < T_CHAMP + 8: return pl(CAPI + 'depot2', 1 + int(i - T_CHAMP))
    k = 0 if i < T_FRAPPE else int(min(len(TEXTE), round(len(TEXTE) * (i - T_FRAPPE) / D_FRAPPE)))
    u = pl(CAPI + 'depot2', P_PRET - 1 + k, garde=3); c = CAR[k]
    dernier = T_FRAPPE if k == 0 else (T_ECRIT if k >= len(TEXTE) else i)
    vu = (i - dernier) < 15 or int((i - dernier) / 15) % 2 == 0
    return curseur(u, c['x'], c['y'] + 1, c['h'] - 2) if vu else u
class _B1:
    """La question et la phrase restent ensemble dans le cadre. Vertical : la question tient toute la largeur de l'image, on ne peut pas s'approcher plus."""
    cles = cles([(0, 195, 318, 3.0), (30, 195, 318, 3.0), (72, 195, 345, 3.0), (207, 195, 342, 3.02)],
                I=[(0, 195, 377, 2.436), (30, 195, 377, 2.436), (72, 192, 330, 2.9), (207, 192, 328, 2.94)],
                H=[(0, 195, 200, 3.0), (30, 195, 200, 3.0), (70, 195, 290, 2.62), (207, 195, 292, 2.66)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(ecran_depot(i), f, cx, cy, e, 1000, tete=66)
        return PP.doigt_t(img, M, e, CH['x'] + 62, CH['y'] + 42, i, T_CHAMP - 14, T_CHAMP, T_CHAMP + 3), False
b1p = _B1()
def b1(i, f): return PP.filme(b1p, i, f)
_cn = {}
def carnet_net(force):
    """Le carnet de route : le geste gardé reste en lumière, le reste en perd un peu."""
    u = pl(CAPI + 'carnet2', 1)
    if force <= .003: return u
    if 'm' not in _cn:
        hh = u.shape[0]; yy = (np.arange(hh, dtype=np.float32) / DSF)[:, None]; y0, y1 = 276.0, 478.0
        _cn['m'] = (1 - lisse(yy, y0 - 12, y0) * (1 - lisse(yy, y1, y1 + 12))).astype(np.float32)[..., None]; _cn['d'] = (u * np.float32(.66)).astype(np.float32)
    k = _cn['m'] * np.float32(force); return u * (1 - k) + _cn['d'] * k
class _B2:
    cles = cles([(0, 195, 322, 2.77), (18, 195, 322, 2.77), (62, 195, 392, 3.2), (96, 195, 394, 3.24)], I=[(0, 195, 210, 2.436), (96, 195, 210, 2.436)], H=[(0, 195, 290, 1.9), (18, 195, 290, 1.9), (62, 195, 385, 3.6), (96, 195, 387, 3.66)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); return appareil(carnet_net(float(lisse(i, 26, 60))), f, cx, cy, e, 1100, tete=66)[0], False
b2p = _B2()
def b2(i, f): return PP.filme(b2p, i, f)
def b3(i, f):
    """Ses 2 mains à plat sur le chêne, le téléphone éteint entre elles. Horizontal : tout d'un coup. Vertical : le cadre glisse d'une main à l'autre."""
    if f == 'H': return ifixes.fixe('mains', f)
    n = N['b3']; t = (i + .5) / n; return ifixes.voyage('mains', f, t, dt=1.0 / n)
JM = PP.JM
B4_E = 26                                                                    # le minuteur est à l'écran
def ecran_minuteur(i):
    """Un instant du minuteur visuel : la fin du temps, puis « C'est fini. Bravo. »"""
    m = JM['marques']; j = i - B4_E
    if j < 30: return pl('minuteur', int(round(m['depart'] + (.5 + .5 * max(0, j) / 30.0) * (m['fini'] - m['depart']))))
    return pl('minuteur', min(m['fini'] + (j - 30), JM['images'] - 1))
class _B4:
    cles = cles([(0, 195, 462, 2.77), (78, 195, 462, 2.77)], I=[(0, 195, 520, 2.436), (78, 195, 520, 2.436)], H=[(0, 195, 430, 1.9), (50, 195, 430, 1.9), (64, 195, 540, 1.9), (78, 195, 540, 1.9)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); return appareil(ecran_minuteur(i), f, cx, cy, e, 900, lieu='pere', tete=66)[0], False
b4p = _B4()
def b4(i, f):
    """« Le lendemain », sur la cuisine floue. Puis un instant du minuteur visuel."""
    b = fond('pere', f) * np.float32(1.25)
    img = pose3(b, 'lendemain', f, float(lisse(i, 2, 9)) * (1 - float(lisse(i, 19, 27))))
    k = float(lisse(i, 20, 30))
    if k > 0: img = img * (1 - k) + PP.filme(b4p, i, f)[0] * k
    return img, False
def b5(i, f):
    """La tablette est refermée, écartée sur la table."""
    n = N['b5']; return pose3(ifixes.fixe('tablette', f), 'ecarte', f, float(lisse(i, 3, 11)) * (1 - float(lisse(i, n - 10, n - 2))), bande=.5, doux=120)
def b6(i, f): return ifixes.fixe('entre', f)
def b7(i, f): return ifixes.fixe('pere', f)
def b8(i, f): return ifixes.fixe('fille', f)
def b9(i, f): return ifixes.fixe('mainfille', f)

# ======================================================================================= C. Chez Bastien
C1_Z = (14, 74)                                                              # le cadre s'élargit
_c1 = {}
def main_bastien(i, f, z=C1_Z, n=None, cap=(72, 86)):
    """La main de Bastien sur son stylo, puis le cadre s'élargit : lui et sa mère. z : le début et la fin de l'élargissement. cap : l'arrivée de la légende."""
    n = N['c1'] if n is None else n; t = float(lisse5(i, z[0], z[1]))
    if t <= 0 or t >= 1:
        k = (f, t >= 1)
        if k not in _c1: _c1[k] = ifixes.zoom('main-bastien', f, 1.0 if t >= 1 else 0.0)
        img = _c1[k]
    else:
        K = 4; img = None                                                    # le mouvement du cadre : plusieurs instants dans une image
        for j in range(K):
            x = ifixes.zoom('main-bastien', f, float(lisse5(i + (j / K - .5) * .5 + .25, z[0], z[1]))); img = x if img is None else img + x
        img = img / K
    return pose3(img, 'bastien', f, float(lisse(i, cap[0], cap[1])) * (1 - float(lisse(i, n - 16, n - 4))), bande=.55, doux=130)
def c1(i, f):
    """La main de Bastien sur son stylo (le raccord avec la main de la fille). Le cadre s'élargit aussitôt : une autre famille, Bastien et sa mère."""
    return main_bastien(i, f)
_c2 = {}
def c2(i, f):
    """« Passer le relais » : le vrai écran de l'outil, tel qu'une famille le découvre."""
    if f not in _c2: _c2[f] = appareil(pl(C.CAP + 'relais0', 1), f, *C.D2_ACC[f], 1000, lieu='bastien', tete=66)[0]
    return _c2[f], True
def c3(i, f): return ifixes.fixe('bastien', f)
C4_0 = 34                                                                    # le plan commence quand l'étape « Sa parole » est à l'écran
def c4(i, f):
    """C'est lui qui choisit : il touche « J'aime… » et écrit « prendre mon café seul, le matin. » On a le temps de lire."""
    return PP.filme(C.d2p, i + C4_0, f)
JA = C.JC('apercu'); MOI_Y = JA['section']['y'] + JA['section']['h'] / 2
class _C5:
    """Sa fiche, « Le relais de Bastien », pour son oncle Rémi. Puis sa phrase, signée de son prénom."""
    cles = cles([(0, 195, 372, 2.77), (38, 195, 372, 2.77), (92, 195, MOI_Y - 4, 3.3), (135, 195, MOI_Y - 4, 3.34)],
                I=[(0, 195, 300, 2.436), (38, 195, 300, 2.436), (92, 195, MOI_Y - 60, 2.8), (135, 195, MOI_Y - 60, 2.83)],
                H=[(0, 195, 190, 2.7), (38, 195, 190, 2.7), (92, 195, MOI_Y, 3.6), (135, 195, MOI_Y, 3.66)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); return appareil(pl(C.CAP + 'apercu', 1), f, cx, cy, e, 1700, lieu='bastien', tete=0)[0], True
c5p = _C5()
def c5(i, f): return PP.filme(c5p, i, f)

# ======================================================================================= D. Le café du dimanche
D1_V = (40, 172)                                                             # vertical : le cadre quitte Bastien, arrive sur Rémi
def remise(i, f, v=D1_V):
    """Bastien tend la feuille pliée à Rémi. Horizontal : on voit tout d'un coup, qui donne, qui reçoit, leur regard. Vertical : le cadre va de l'un à l'autre."""
    if f == 'H': return ifixes.fixe('remise', f)
    t = float(lisse5(i + .5, v[0], v[1])); dt = float(lisse5(i + 1, v[0], v[1])) - float(lisse5(i, v[0], v[1]))
    return ifixes.voyage('remise', f, t, dt=dt)
def d1(i, f): return remise(i, f)
N_CAFE = N['d2'] + N['d3']
def cafe(j, f):
    """Dimanche matin, près de la fenêtre, sa tasse à la main. On s'approche très lentement, d'un seul mouvement."""
    return ifixes.zoom('cafe', f, float(lisse(j, -40, N_CAFE + 30)))
def d2(i, f):
    return pose3(cafe(i, f), 'dimanche', f, float(lisse(i, 8, 20)) * (1 - float(lisse(i, 92, 108))), bande=.5, doux=120)
def d3(i, f): return cafe(N['d2'] + i, f)

# ======================================================================================= E. La réponse du père
_e1 = {}
def e1(i, f):
    """Le cadrage de la première scène, à l'identique. Même table, même téléphone : il est allumé sur la conversation avec Élise."""
    if f not in _e1:
        u = cv2.imread(INT + '/cap/table-e/0000.jpg').astype(np.float32) / 255
        _e1[f] = C.cadre_table(cuisine.avec_ecran('table-e', u, 1.0), f)
    return _e1[f]
FE = IT.FIL_E
POUCE_E = C.pouce_e(ap=FE['ap'], fin=FE['f1'] + FE['n1'])
def e2(i, f):
    """Le même fil. Cette fois il écrit pour lui : « Tu as cinq minutes ce soir ? J'aimerais te raconter ma journée. » Le pouce attend, puis touche Envoyer. Le message reste."""
    img, M, e = fil('file2', i, N['e2'], f)
    return C.pouce(img, M, e, i, POUCE_E, souffle=(FE['f1'] + FE['n1'] + 18, FE['ap'] - 7)), False
def e3(i, f, avant):
    """La signature : le logo, « Parent écouté, parent éclairé », « Ici, on commence par vous. », l'adresse."""
    return PP.g2(i, f, avant)

PHOTO = ('a1', 'a3', 'b3', 'b5', 'b6', 'b7', 'b8', 'b9', 'c1', 'c3', 'd1', 'd2', 'd3', 'e1')     # les plans de photo : la finition de la pellicule (les autres sont des écrans filmés)
CLAIRS = ('c2', 'c4', 'c5')
