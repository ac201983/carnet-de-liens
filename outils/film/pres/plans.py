# « Ce qu'on ne dit pas par SMS » : les plans, un par un. Chaque fonction rend l'image i du plan, au format f, sans le grain (ajouté au montage).
# Les écrans sont ceux de la version d'essai, capturés image par image (cap/…). Les cadres sont donnés par format : V, I (Instagram), H.
import numpy as np, cv2, sys, os, json
from pm import *

# ======================================================================================= les durées (images, 30 par seconde)
N = dict(a2=114, a5=270, b1=54, b2=246, b3=60, b4=120, c1=36, c2=84, c3=141, c4=120, c5=150, d=186, e1=165, e2=315, e3=90, f1=36, f2=162, f3=108, f4=66, f5=123, g1=240, g2=114)

def cles(V, I=None, H=None):
    """Les cadres clés d'un plan d'écran pour les 3 formats. Sans indication, Instagram reprend le cadre vertical un peu plus large (0,88), posé au milieu de sa zone libre,
    et l'horizontal le reprend à 0,83."""
    return {'V': V, 'I': I or [(k[0], k[1], k[2], k[3] * .88) for k in V], 'H': H or [(k[0], k[1], k[2], k[3] * .83) for k in V]}

def doigt(img, M, e, x, y, presence, appui=0.0, rayon=25.0, force=1.0):
    """Le doigt, visible sur un écran clair comme sur un écran sombre. Sur le sombre, c'est le rond clair du film de 35 secondes (ecran.doigt), à l'identique.
    Sur le clair (les pistes, la fiche, l'étape 7, un bouton crème), ce rond clair ne se voyait pas : il devient vert sombre. La teinte suit ce qu'il y a sous le doigt."""
    if presence <= .01: return img
    X = M[0, 0] * x * DSF + M[0, 2]; Y = M[1, 1] * y * DSF + M[1, 2]; r = rayon * (1 - .2 * appui) * e * (1.25 - .25 * presence)
    H, W = img.shape[:2]; yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); dist = np.sqrt((xx - X) ** 2 + (yy - Y) ** 2)
    disque = (1 - lisse(dist, r - 2.2 * e, r + 1.2 * e)).astype(np.float32); anneau = np.exp(-((dist - r) / (1.6 * e)) ** 2).astype(np.float32)
    lum = img[..., 0] * np.float32(.114) + img[..., 1] * np.float32(.587) + img[..., 2] * np.float32(.299)
    m = float((lum * disque).sum() / max(float(disque.sum()), 1.0)); t = float(lisse(m, .38, .62))
    teinte = np.float32([.90, .96, 1.0]) * (1 - t) + np.float32([.10, .17, .08]) * t
    al = (disque * (.26 + .2 * appui) + anneau * .34) * presence * force
    return img * (1 - al[..., None]) + teinte * al[..., None]
def doigt_t(img, M, e, x, y, i, arrive, appui, parti=None, rayon=17, force=.8, d=(14, 30)):
    """Le doigt : il arrive (image « arrive »), se pose, appuie (image « appui »), puis s'en va."""
    parti = appui + 4 if parti is None else parti
    p = float(lisse(i, arrive, arrive + 12)) * (1 - float(lisse(i, parti, parti + 8))); q = float(lisse5(i, arrive - 2, arrive + 20))
    a = float(lisse(i, appui - 3, appui)) * (1 - float(lisse(i, appui + 1, appui + 5)))
    return doigt(img, M, e, x + d[0] * (1 - q), y + d[1] * (1 - q), p, a, rayon=rayon, force=force)

_dd = {}
def onde_image(a, b, ox, oy, jj, R=16):
    """L'onde du site, dans l'image : un cercle part de l'endroit touché (ox, oy) et découvre l'écran suivant."""
    if jj >= R + 1: return b
    H, W = b.shape[:2]; k = (W, H, round(ox), round(oy))
    if k not in _dd:
        if len(_dd) > 3: _dd.pop(next(iter(_dd)))
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); _dd[k] = np.sqrt((xx - ox) ** 2 + (yy - oy) ** 2)
    d = _dd[k]; r = 1.12 * float(np.hypot(max(ox, W - ox), max(oy, H - oy))) * float(lisse5(jj / R)) ** 1.15
    m = (1 - lisse(d, r - 75, r + 75)).astype(np.float32)[..., None]
    bord = (np.exp(-((d - r) / 85) ** 2) * .22 * (1 - jj / (R + 1))).astype(np.float32)[..., None]
    return a * (1 - m) + b * m + bord * np.float32([.82, .95, 1.0])
def point(M, x, y): return (M[0, 0] * x * DSF + M[0, 2], M[1, 1] * y * DSF + M[1, 2])

def filme(plan, i, f, k_min=4, k_max=24, pas=4.5):
    """Rend l'image i d'un plan d'écran, avec un flou de mouvement quand le cadre bouge (plusieurs instants par image). plan(i, f) rend (image, clair).
    Plus le cadre va vite, plus il faut d'instants : avec 4 instants seulement, un défilement rapide (jusqu'à 90 points par image) montrait 4 copies nettes
    du texte au lieu d'un flou. On prend donc un instant tous les 4,5 points de déplacement, 24 au plus."""
    c = plan.cles[f]
    if bouge(c, i):
        a, b = cam(c, i), cam(c, i + 1)
        depl = abs(a[0] - b[0]) * b[2] + abs(a[1] - b[1]) * b[2] + abs(np.log(a[2] / b[2])) * 600           # en points de l'image, comme dans bouge()
        k = int(min(k_max, max(k_min, np.ceil(depl / pas)))); acc = None; clair = None
        for d in range(k):
            x = plan(i + d / k, f); acc = x[0].astype(np.float32) if acc is None else acc + x[0]
            if clair is None: clair = x[1]
        return acc / k, clair
    return plan(i, f)

# ======================================================================================= A. Le premier SMS (21 h 40)
REP1 = json.load(open(PRES + '/cap/fil1/reperes.json')); REP2 = json.load(open(PRES + '/cap/fil2/reperes.json'))
FIL1 = {'V': (346.5, 2.7693, .07), 'I': (379.0, 2.7693, .07), 'H': (328.0, 3.1, .1)}       # le cadre du film de 35 secondes
def a2(i, f):
    """« Comment va ta fille ? » « Elle va bien, merci. » Il envoie tout de suite. Puis plus rien ne bouge : le battement est après l'envoi."""
    n = N['a2']; u = pl('fil1', min(int(i), n - 1)); a = float(lisse(i / n, -.1, 1.1)); t = i / IPS
    cy, e0, de = FIL1[f]; e = e0 + de * a; W, H = FORMATS[f]
    img, M = appareil(u, f, 195, cy, e, 693, ax=W / 2, ay=H / 2)
    ta, te = REP1['T_APPUI'], REP1['T_ENVOI']; E, P = REP1['ENV'], REP1['POINT']
    p = float(lisse(t, ta - .30, ta - .12)) * (1 - float(lisse(t, te + .04, te + .22))); q = float(lisse5(t, ta - .34, ta - .04))
    x = E['x'] + (P['x'] - E['x']) * .30 * (1 - q); y = E['y'] + (P['y'] - E['y']) * .30 * (1 - q)
    return ecran.doigt(img, M, e, x, y, p, float(lisse(t, ta - .05, ta + .02)) * (1 - float(lisse(t, te + .02, te + .12)))), False

T5 = N['a5'] / IPS; raccord.T5 = T5                                              # l'étang dure ici 9 secondes (5 dans le film de 35 secondes)
ET_VOUS = (1.0, 1.6, 4.55, 4.90); PUBLIC = (5.00, 5.50, T5 - .45, T5 - .15)               # « Et vous ? » seul 3 secondes, puis la phrase 3 secondes
def a5(i, f):
    """Le cercle du verre continue sur l'étang. « Et vous ? » reste seul, puis la phrase qui dit pour qui est le site."""
    raccord.T5 = T5; t = i / IPS
    img = raccord.image_etang(t, f, int(i))
    img = pose(img, 'et-vous', f, float(lisse(t, ET_VOUS[0], ET_VOUS[1])) * (1 - float(lisse(t, ET_VOUS[2], ET_VOUS[3]))))
    return pose(img, 'public', f, float(lisse(t, PUBLIC[0], PUBLIC[1])) * (1 - float(lisse(t, PUBLIC[2], PUBLIC[3]))))

# ======================================================================================= B. « Déposer ce qui pèse »
JA = J('accueil-d'); JD = J('depot'); JR = J('dire')
PORTE = JA['porte']; RANG = PORTE['y'] + PORTE['h'] / 2; DOIGT_B1 = (JA['titre']['x'] + JA['titre']['w'] + 34, PORTE['y'] + 24)
_net = {}
def accueil_net():
    """L'accueil tel qu'on le filme : la ligne « Déposer ce qui pèse » nette et claire. Plus bas l'écran part dans le flou et dans l'ombre, la barre du site est un peu retenue."""
    if 'a' not in _net:
        u = pl('accueil-d', 0); hh = u.shape[0]; yy = (np.arange(hh, dtype=np.float32) / DSF)[:, None]
        bas = lisse(yy, PORTE['y'] + PORTE['h'] - 9, PORTE['y'] + PORTE['h'] + 15).astype(np.float32)[..., None]
        sombre = (.32 - .20 * lisse(yy, 190, 340)).astype(np.float32)[..., None]; haut = (1 - lisse(yy, 40.0, 62.0)).astype(np.float32)[..., None]
        doux = cv2.GaussianBlur(u, (0, 0), 3.6 * DSF) * sombre
        v = ((u * (1 - bas) + doux * bas) * (1 - np.float32(.2) * haut)).astype(np.float32)
        # la pastille SOS, en haut à droite, reste dans l'ombre : la ligne « Déposer ce qui pèse » se lit en entier, et le regard n'a qu'un endroit où aller
        xx = (np.arange(u.shape[1], dtype=np.float32) / DSF)[None, :]; sos = (lisse(xx, 258, 286) * (1 - lisse(yy, 56, 66))).astype(np.float32)[..., None]
        _net['a'] = (v * (1 - sos) + cv2.GaussianBlur(v, (0, 0), 2.2 * DSF) * np.float32(.22) * sos).astype(np.float32)
    return _net['a']
B1 = {'V': ((195, RANG, 2.84), (195, RANG, 2.90)), 'I': ((195, RANG, 2.40), (195, RANG, 2.436)), 'H': ((195, 150, 3.42), (195, 150, 3.5))}
def b1(i, f):
    """L'étang se fond dans le téléphone : l'accueil du site, cadré sur « Déposer ce qui pèse ». Un seul appui."""
    n = N['b1']; c0, c1 = B1[f]; a = float(lisse(i / n, -.15, 1.0)); e = float(np.exp(np.log(c0[2]) * (1 - a) + np.log(c1[2]) * a))
    img, M = appareil(accueil_net(), f, c1[0], c1[1], e, 844, chaleur=1.5)
    p = float(lisse(i, 24, 36)); q = float(lisse5(i, 22, 44))
    return ecran.doigt(img, M, e, DOIGT_B1[0] + 14 * (1 - q), DOIGT_B1[1] + 34 * (1 - q), p, float(lisse(i, n - 4, n - 1)), rayon=17, force=.8), False

TEXTE = JD['texte']; CAR = JD['carets']; P_PRET = JD['marques']['pret']
T_CHAMP, T_FRAPPE = 100, 116                                                        # il touche le champ, puis commence à écrire
PHRASE1 = TEXTE.index('.') + 1                                                      # la première phrase finit ici
def lettres(i):
    """Le nombre de caractères écrits à l'image i du plan b2 : la première phrase, un temps, la seconde."""
    if i < T_FRAPPE: return 0
    a, b = T_FRAPPE, T_FRAPPE + 56
    if i <= b: return int(round(PHRASE1 * (i - a) / (b - a)))
    c, d = b + 14, b + 14 + 44
    if i < c: return PHRASE1
    return int(min(len(TEXTE), round(PHRASE1 + (len(TEXTE) - PHRASE1) * (i - c) / (d - c))))
T_ECRIT = T_FRAPPE + 56 + 14 + 44                                                   # 230
def ecran_depot(i):
    """L'écran « Déposer ce qui pèse » à l'image i du plan b2 (et au-delà : le texte est écrit, le curseur clignote)."""
    if i < T_CHAMP: return pl('depot', 0)
    if i < T_CHAMP + 8: return pl('depot', 1 + int(i - T_CHAMP))
    k = lettres(i); u = pl('depot', P_PRET - 1 + k, garde=3); c = CAR[k]
    dernier = T_FRAPPE if k == 0 else (T_ECRIT if k >= len(TEXTE) else i)
    vu = (i - dernier) < 15 or int((i - dernier) / 15) % 2 == 0
    return curseur(u, c['x'], c['y'] + 1, c['h'] - 2) if vu else u
CH = JD['avant']['champ']; DIRE = JD['avant']['dire']
class _B2:
    cles = cles([(0, 195, 410, 2.77), (82, 195, 410, 2.77), (112, 195, 452, 2.92), (246, 195, 470, 3.0)],
                I=[(0, 195, 377, 2.436), (112, 195, 377, 2.436), (246, 195, 400, 2.5)],
                H=[(0, 195, 250, 2.30), (82, 195, 250, 2.30), (112, 195, 430, 2.30), (246, 195, 440, 2.36)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(ecran_depot(i), f, cx, cy, e, 1000, tete=66)
        if i <= 17:
            c0 = B1[f][1]; a, Ma = appareil(accueil_net(), f, c0[0], c0[1], c0[2], 844, chaleur=1.5); c0 = (0,) + tuple(c0)
            ox, oy = point(Ma, *DOIGT_B1); img = onde_image(a, img, ox, oy, i)
            img = ecran.doigt(img, Ma, c0[3], DOIGT_B1[0], DOIGT_B1[1], 1 - float(lisse(i, 3, 11)), 1 - float(lisse(i, 0, 5)), rayon=17, force=.8)
        return doigt_t(img, M, e, CH['x'] + 62, CH['y'] + 42, i, T_CHAMP - 14, T_CHAMP, T_CHAMP + 3), False
b2 = _B2()
DOIGT_B3 = (JD['doigt']['x'], JD['doigt']['y'])
class _B3:
    cles = cles([(0, 195, 470, 3.0), (42, 195, 512, 3.0), (60, 195, 512, 3.0)], I=[(0, 195, 400, 2.5), (42, 195, 560, 2.5), (60, 195, 560, 2.5)], H=[(0, 195, 440, 2.36), (42, 195, 566, 2.36), (60, 195, 566, 2.36)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(ecran_depot(N['b2'] + i), f, cx, cy, e, 1000, tete=66)
        return doigt_t(img, M, e, DOIGT_B3[0], DOIGT_B3[1], i, 20, N['b3'] - 4, N['b3'] + 9), False
b3 = _B3()
AM = JR['amorce']; CO = JR['commencer']
_dn = {}
def dire_net(force):
    """« J'aimerais le dire à quelqu'un » : la phrase de départ reste nette et claire, le reste de l'écran perd un peu de lumière."""
    u = pl('dire', 1)
    if force <= .003: return u
    if 'm' not in _dn:
        hh = u.shape[0]; yy = (np.arange(hh, dtype=np.float32) / DSF)[:, None]; y0, y1 = CO['y'] - 8, AM['y'] + AM['h'] + 8
        _dn['m'] = (1 - lisse(yy, y0 - 12, y0) * (1 - lisse(yy, y1, y1 + 12))).astype(np.float32)[..., None]; _dn['d'] = (u * np.float32(.72)).astype(np.float32)
    k = _dn['m'] * np.float32(force); return u * (1 - k) + _dn['d'] * k
class _B4:
    cles = cles([(0, 195, 412, 2.77), (50, 195, 412, 2.77), (120, 195, 392, 2.95)],
                I=[(0, 195, 377, 2.436), (50, 195, 377, 2.436), (120, 195, 396, 2.6)],
                H=[(0, 195, 246, 2.30), (46, 195, 246, 2.30), (80, 195, 392, 2.36), (120, 195, 398, 2.46)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(dire_net(float(lisse(i, 56, 84))), f, cx, cy, e, 1000, tete=66)
        if i <= 17:
            c0 = b3.cles[f][-1]; a, Ma = appareil(ecran_depot(N['b2'] + N['b3'] + i), f, c0[1], c0[2], c0[3], 1000, tete=66)
            ox, oy = point(Ma, *DOIGT_B3); img = onde_image(a, img, ox, oy, i)
            img = ecran.doigt(img, Ma, c0[3], DOIGT_B3[0], DOIGT_B3[1], 1 - float(lisse(i, 3, 11)), 1 - float(lisse(i, 0, 5)), rayon=17, force=.8)
        return img, False
b4 = _B4()

# ======================================================================================= C. Le lendemain : la fiche « Les écrans », le minuteur visuel, les dominos
JP = J('pistes'); JF = J('fiche'); JM = J('minuteur')
CHIP = JP['chip']; DOIGT_C2 = (CHIP['x'] + CHIP['w'] * .62, CHIP['y'] + CHIP['h'] * .5)
class _C2:
    cles = cles([(0, 195, 404, 2.77), (84, 195, 404, 2.77)], I=[(0, 195, 330, 2.436), (84, 195, 392, 2.436)], H=[(0, 195, 300, 2.30), (84, 195, 300, 2.30)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(pl('pistes', 1), f, cx, cy, e, 1100, lieu='pere')
        return doigt_t(img, M, e, DOIGT_C2[0], DOIGT_C2[1], i, 44, N['c2'] - 4, N['c2'] + 9), True
c2 = _C2()
def c1(i, f):
    """« Le lendemain », sur la cuisine floue, puis le téléphone revient."""
    W, H = FORMATS[f]; b = fond('pere', f) * np.float32(1.25)
    img = pose(b, 'lendemain', f, float(lisse(i, 3, 11)) * (1 - float(lisse(i, 23, 31))))
    k = float(lisse(i, 22, 35))
    if k > 0: img = img * (1 - k) + c2(0, f)[0] * k
    return img, k > .5
LIS = JF['lis']
_fn = {}
def fiche_net(force):
    """La fiche « Les écrans », avec un peu de lumière en moins hors des 2 idées que le père retient (le minuteur visuel, puis quelque chose d'agréable juste après)."""
    u = pl('fiche', 1)
    if force <= .003: return u
    if 'm' not in _fn:
        hh = u.shape[0]; yy = (np.arange(hh, dtype=np.float32) / DSF)[:, None]; y0, y1 = LIS[1]['by'] - 6, LIS[2]['by'] + LIS[2]['bh'] + 6
        _fn['m'] = (1 - lisse(yy, y0 - 10, y0) * (1 - lisse(yy, y1, y1 + 10))).astype(np.float32)[..., None]
        _fn['d'] = (u * np.float32(.80) + np.float32([.52, .60, .60]) * np.float32(.085)).astype(np.float32)
    k = _fn['m'] * np.float32(force); return u * (1 - k) + _fn['d'] * k
class _C3:
    cles = cles([(0, 195, 420, 2.77), (32, 195, 420, 2.77), (60, 195, 770, 3.0), (141, 195, 784, 3.06)],
                I=[(0, 195, 377, 2.436), (32, 195, 377, 2.436), (60, 195, 770, 2.6), (141, 195, 790, 2.7)],
                H=[(0, 195, 300, 2.30), (32, 195, 300, 2.30), (60, 195, 760, 2.40), (141, 195, 792, 2.54)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(fiche_net(float(lisse(i, 58, 76))), f, cx, cy, e, 1500, lieu='pere', tete=66)
        if i <= 17:
            c0 = c2.cles[f][-1]; a, Ma = appareil(pl('pistes', 1), f, c0[1], c0[2], c0[3], 1100, lieu='pere')
            ox, oy = point(Ma, *DOIGT_C2); img = onde_image(a, img, ox, oy, i)
            img = doigt(img, Ma, c0[3], DOIGT_C2[0], DOIGT_C2[1], 1 - float(lisse(i, 3, 11)), 1 - float(lisse(i, 0, 5)), rayon=17, force=.8)
        return img, True
c3 = _C3()
LANCER = JM['avant']['lancer']; DOIGT_C4 = (LANCER['x'] + LANCER['w'] * .55, LANCER['y'] + LANCER['h'] * .5)
C4_T, C4_D = 18, 21                                                                 # l'appui sur « Lancer », puis le disque qui se vide (en accéléré)
def ecran_minuteur(i):
    m = JM['marques']; i = int(i)
    if i < C4_T: return pl('minuteur', 0)
    if i < C4_D: return pl('minuteur', m['toucher'] + (i - C4_T))
    return pl('minuteur', min(m['depart'] + (i - C4_D), JM['images'] - 1))
class _C4:
    cles = cles([(0, 195, 462, 2.77), (120, 195, 462, 2.77)], I=[(0, 195, 380, 2.436), (98, 195, 380, 2.436), (114, 195, 640, 2.436), (120, 195, 640, 2.436)], H=[(0, 195, 424, 1.90), (98, 195, 424, 1.90), (114, 195, 540, 1.90), (120, 195, 540, 1.90)])   # horizontal : un peu plus loin, pour voir ensemble le nom de l'outil, le disque et le bouton « Lancer »
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(ecran_minuteur(i), f, cx, cy, e, 900, lieu='pere', tete=66)
        return doigt_t(img, M, e, DOIGT_C4[0], DOIGT_C4[1], i, 2, C4_T, C4_T + 4), False
c4 = _C4()

# --- la photo des dominos, puis la plongée vers un point du domino, qui deviendra la goutte
POINT_D = (683.5, 1110.0)                                                           # le point du domino qui devient la goutte (points de la photo)
GOUTTE0 = {'V': (195, 346.5, 2.77), 'I': (195, 346.5, 2.77), 'H': (195, 168.75, 3.2)}   # le cadre de l'étang à la coupe (l'écran plein cadre, son haut en haut de l'image)
GOUTTE1 = {'V': (195, 230, 4.2), 'I': (195, 258, 4.0), 'H': (195, 172, 4.93)}        # le cadre posé sur la goutte
PERLE = (196.5, 125.5, 29.0)                                                        # la goutte au sommet, dans l'écran de « Souffler » (centre, diamètre, en points d'écran) : mesuré sur la capture
def perle_image(f):
    c = GOUTTE0[f]; x0, y0 = centre('V' if f == 'I' else f); return (x0 + (PERLE[0] - c[0]) * c[2], y0 + (PERLE[1] - c[1]) * c[2], PERLE[2] * c[2])
PIP = 6.6                                                                           # diamètre du point du domino dans la photo
FEN_I = (INSTA['gauche'], INSTA['haut'], INSTA['droite'], INSTA['haut'] + (INSTA['droite'] - INSTA['gauche']))     # Instagram : la photo dans un carré de 950 points, dans la zone libre
C5_J = 120                                                                          # la plongée commence ici
def cadre_c5(i, f):
    """Le cadre de la photo des dominos : (cx, cy, échelle, ax, ay, fenêtre). D'abord la photo entière, puis un cadre décalé vers l'adolescente
    (son oreille appareillée et la main qui joue), puis la plongée vers un point du domino."""
    W, H = FORMATS[f]; px, py, pd = perle_image(f); s_fin = pd / PIP
    if f == 'V':   A = (627, 627, .861, W / 2, H / 2); B = (627, 627, .905, W / 2, H / 2); C = (901.5, 627, 1.531, W / 2, H / 2)
    elif f == 'I': A = (627, 627, .7576, 540, 744); B = (640, 630, .80, 540, 744); C = (829, 715, 1.118, 540, 744)
    else:          A = (627, 627, .861, W / 2, H / 2); B = (627, 627, .90, W / 2, H / 2); C = (627, 715, 1.27, W / 2, H / 2)
    D = (POINT_D[0], POINT_D[1], s_fin, px, py)
    if i <= C5_J:
        t1 = float(lisse5(i, 0, 46)); t2 = float(lisse5(i, 40, 112))
        a = [A[k] + (B[k] - A[k]) * t1 for k in range(5)]; a[2] = float(np.exp(np.log(A[2]) + (np.log(B[2]) - np.log(A[2])) * t1))
        v = [a[k] + (C[k] - a[k]) * t2 for k in range(5)]; v[2] = float(np.exp(np.log(a[2]) + (np.log(C[2]) - np.log(a[2])) * t2)); t3 = 0.0
    else:
        t3 = float(np.clip((i - C5_J) / (N['c5'] - C5_J), 0, 1)) ** 2.2                                   # départ doux, puis de plus en plus vite : on tombe vers le domino
        v = [C[k] + (D[k] - C[k]) * t3 for k in range(5)]; v[2] = float(np.exp(np.log(C[2]) + (np.log(D[2]) - np.log(C[2])) * t3))
        # le point visé arrive à sa place d'écran en même temps que l'échelle : on garde fixe le point du domino
        v[0], v[1] = D[0], D[1]; q = t3
        cx0, cy0 = C[3] + (D[0] - C[0]) * C[2], C[4] + (D[1] - C[1]) * C[2]                             # où est le point du domino dans l'image au début de la plongée
        v[3], v[4] = cx0 + (D[3] - cx0) * q, cy0 + (D[4] - cy0) * q
    fen = None
    if f == 'I': k = t3; fen = tuple(FEN_I[j] + ((0, 0, W, H)[j] - FEN_I[j]) * float(lisse(k, .05, .6)) for j in range(4))
    if t3 > 0:                                                                      # pendant la plongée, le bas de la photo ne remonte jamais dans l'image : le point visé reste bas tant qu'on n'est pas assez près
        bas = fen[3] if fen else H; v[4] = max(v[4], bas - (1254 - D[1]) * v[2] + 6)
    return v[0], v[1], v[2], v[3], v[4], fen
def photo_dom(f, cx, cy, s, ax, ay, fen):
    """La photo des dominos. De très près (la fin de la plongée), on prend la zone des dominos agrandie 4 fois, quand l'image y tient en entier."""
    W, H = FORMATS[f]; x0, y0, x1, y1 = cx - ax / s, cy - ay / s, cx + (W - ax) / s, cy + (H - ay) / s
    if s <= 2.4 or x0 < DOM[0] or y0 < DOM[1] or x1 > DOM[2] or y1 > DOM[3]: return vue_photo(1, f, cx, cy, s, ax, ay, fen)
    P = photo_dominos(); e = s / 4.0
    M = np.array([[e, 0, ax - (cx - DOM[0]) * s], [0, e, ay - (cy - DOM[1]) * s]], np.float64)
    return cv2.warpAffine(P, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
def c5(i, f):
    k = 1 if i < C5_J else 8
    img = sum(photo_dom(f, *cadre_c5(i + d / k, f)) for d in range(k)) / k
    return img

# ======================================================================================= D. L'étang : une expiration avec la goutte
D_POSE = 46                                                                         # le cadre est posé sur la goutte à cette image
MOT_D = {'V': 1440.0, 'I': 1150.0, 'H': 150.0}
def cadre_d(i, f):
    c0, c1 = GOUTTE0[f], GOUTTE1[f]; t = float(lisse5(i, -22, D_POSE))
    t = (t - float(lisse5(0, -22, D_POSE))) / (1 - float(lisse5(0, -22, D_POSE)))                    # on arrive en mouvement (la plongée continue), puis on ralentit
    e = float(np.exp(np.log(c0[2]) * (1 - t) + np.log(c1[2]) * t)); b = float(lisse(i, D_POSE * .7, N['d'] + 30))
    return c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t, e * (1 + .022 * b)
def d(i, f):
    """« Souffler 2 minutes » : la goutte redescend pendant une expiration entière (6 secondes), puis reste posée."""
    C = ecran.C_EXPIREZ + int(min(i, ecran.C_FIN - ecran.C_EXPIREZ)); k = 6 if i < D_POSE else 1
    def une(j):
        cx, cy, e = cadre_d(j, f); W, H = FORMATS[f]
        return appareil(pl('../../app-ig', C, garde=3), f, cx, cy, e, 844, ax=W / 2, ay=H / 2)[0]
    img = sum(une(i + q / k) for q in range(k)) / k
    y = MOT_D[f]; W, H = FORMATS[f]
    if f != 'H': img = img * (1 - ombre(f, y - 90, y + 90, .42, 120) * float(lisse(i, 14, 40)))
    c, a = ecran.calque_mot('expirez', f, y); p = np.float32(float(lisse(i, 16, 34)) * (1 - float(lisse(i, N['d'] - 14, N['d'] - 2))))
    img = img * (1 - a * p) + c * p
    ps = float(lisse(i, 30, 50)) * (1 - float(lisse(i, N['d'] - 16, N['d'] - 4)))
    if f == 'H': img = img * (1 - ombre(f, 900, 1010, .5, 90) * ps)
    return pose(img, 'souffler', f, ps)

# ======================================================================================= E. Le week-end de Bastien
def cadre_e1(i, f):
    W, H = FORMATS[f]; t1 = float(lisse5(i, 0, 56)); t2 = float(lisse5(i, 66 if f == 'H' else 50, N['e1'] + 12))   # horizontal : la photo ne s'approche qu'une fois la légende, posée à sa droite, effacée
    if f == 'V':   A = (627, 627, .861, W / 2, H / 2); B = (627, 627, .90, W / 2, H / 2); C = (682.5, 627, 1.531, W / 2, H / 2); fen = None
    elif f == 'I': A = (627, 627, .654, 540, 679); B = (627, 627, .654, 540, 679); C = (690, 450, 1.06, 540, 744); fen = FEN_I
    else:          A = (627, 627, .861, 720, H / 2); B = (627, 627, .88, 720, H / 2); C = (627, 412, 1.531, W / 2, H / 2); fen = None
    a = [A[k] + (B[k] - A[k]) * t1 for k in range(5)]; a[2] = float(np.exp(np.log(A[2]) + (np.log(B[2]) - np.log(A[2])) * t1))
    v = [a[k] + (C[k] - a[k]) * t2 for k in range(5)]; v[2] = float(np.exp(np.log(a[2]) + (np.log(C[2]) - np.log(a[2])) * t2))
    return v[0], v[1], v[2], v[3], v[4], fen
def e1(i, f):
    """Bastien et sa mère préparent la fiche : la photo entière sur le vert du film, leurs 2 visages et la grande roue ensemble, puis on s'approche du crayon et des regards."""
    cx, cy, s, ax, ay, fen = cadre_e1(i, f); img = vue_photo(2, f, cx, cy, s, ax, ay, fen)
    return pose(img, 'bastien', f, float(lisse(i, 10, 26)) * (1 - float(lisse(i, 80, 96))))
JRL = J('relais')
CAFE = JRL['cafe']; MOI = JRL['moi']
_rn = {}
def relais_net(force):
    """La fiche de Bastien. Pendant qu'on lit « J'aime prendre mon café seul, le matin. », le reste de la fiche perd un peu de sa présence."""
    u = pl('relais', 1)
    if force <= .003: return u
    if 'm' not in _rn:
        hh, ww = u.shape[:2]; yy = (np.arange(hh, dtype=np.float32) / DSF)[:, None]; y0, y1 = CAFE['y'] - 7, CAFE['y'] + CAFE['h'] + 7
        _rn['m'] = (1 - lisse(yy, y0 - 9, y0) * (1 - lisse(yy, y1, y1 + 9))).astype(np.float32)[..., None]
        doux = cv2.GaussianBlur(u, (0, 0), 1.1 * DSF); _rn['d'] = (doux * np.float32(.86) + np.float32([.60, .66, .66]) * np.float32(.07)).astype(np.float32)
    k = _rn['m'] * np.float32(force); return u * (1 - k) + _rn['d'] * k
class _E2:
    cles = cles([(0, 195, 410, 2.95), (108, 195, 400, 3.03), (148, 195, 676, 3.4), (315, 193, 664, 3.62)],
                I=[(0, 195, 290, 2.436), (108, 195, 300, 2.5), (148, 195, 668, 2.9), (315, 192, 652, 3.15)],
                H=[(0, 195, 300, 2.30), (50, 195, 300, 2.30), (108, 195, 400, 2.36), (148, 195, 676, 2.9), (315, 193, 652, 3.2)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); return appareil(relais_net(float(lisse(i, 170, 200))), f, cx, cy, e, 1600, lieu='bastien', tete=66)[0], True
e2 = _E2()
def cadre_e3(i, f):
    W, H = FORMATS[f]; t = float(lisse(i, -30, N['e3'] + 30))
    if f == 'V':   return (762 - 14 * t, 627, 1.531 * (1 + .035 * t), W / 2, H / 2, None)
    if f == 'I':   return (675 - 10 * t, 627, .82 * (1 + .04 * t), 540, 744, FEN_I)
    return (627, 627, .861 * (1 + .03 * t), W / 2, H / 2, None)
def e3(i, f):
    """Dimanche matin, chez Rémi : Bastien boit son café près de la fenêtre. La tasse, son visage et la roue du fauteuil. 3 secondes, sans un mot."""
    return vue_photo(3, f, *cadre_e3(i, f))

# ======================================================================================= F. Quelques semaines plus tard : l'étape 7 du parcours
JV = J('vague'); JG = J('geste'); JC = J('carnet')
F2_T1 = 64                                                                          # l'appui sur « Voir la suite » : la vague monte jusqu'au sommet
def ecran_vague(i):
    m = JV['marques']; i = int(i)
    if i < F2_T1: return pl('vague', min(i, m['suite1'] - 1))
    return pl('vague', min(m['suite1'] + (i - F2_T1), m['suite2'] - 1))
S1, S2 = JV['etats'][0]['suite'], JV['etats'][1]['suite']; S3 = JV['etats'][2]['suite']; CHOISIR = dict(JV['choisir']); CHOISIR['y'] -= S3['y'] - S2['y']      # « Choisir mon geste », quand le schéma en est à sa 2e image
DOIGT_F2 = ((S1['x'] + S1['w'] * .5, S1['y'] + S1['h'] * .5), (CHOISIR['x'] + CHOISIR['w'] * .64, CHOISIR['y'] + CHOISIR['h'] * .5))
class _F2:
    cles = cles([(0, 195, 420, 2.77), (30, 195, 420, 2.77), (58, 195, 884, 2.9), (124, 195, 884, 2.9), (146, 195, 900, 2.9), (162, 195, 900, 2.9)],
                I=[(0, 195, 377, 2.436), (30, 195, 377, 2.436), (58, 195, 842, 2.436), (124, 195, 842, 2.436), (146, 195, 1040, 2.436), (162, 195, 1040, 2.436)],
                H=[(0, 195, 250, 2.30), (30, 195, 250, 2.30), (58, 195, 830, 2.30), (124, 195, 830, 2.30), (146, 195, 1010, 2.30), (162, 195, 1010, 2.30)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(ecran_vague(i), f, cx, cy, e, 1500, tete=66)
        img = doigt_t(img, M, e, DOIGT_F2[0][0], DOIGT_F2[0][1], i, F2_T1 - 14, F2_T1, F2_T1 + 3)
        return doigt_t(img, M, e, DOIGT_F2[1][0], DOIGT_F2[1][1], i, N['f2'] - 20, N['f2'] - 3, N['f2'] + 9), True
f2 = _F2()
def f1(i, f):
    """« Quelques semaines plus tard », sur la cuisine du premier soir, puis le téléphone revient."""
    b = fond('nuit', f) * np.float32(1.35)
    img = pose(b, 'semaines', f, float(lisse(i, 3, 11)) * (1 - float(lisse(i, 23, 31))))
    k = float(lisse(i, 22, 35))
    if k > 0: img = img * (1 - k) + f2(0, f)[0] * k
    return img, k > .5
GE = JG['apres']['gestes']; MAINS = [g for g in GE if 'mains' in g['t']][0]; GARDER = JG['apres']['garder']
DOIGT_F3 = ((MAINS['x'] + MAINS['w'] * .70, MAINS['y'] + MAINS['h'] * .5), (GARDER['x'] + GARDER['w'] * .62, GARDER['y'] + GARDER['h'] * .5))
F3_T1 = 40
def ecran_geste(i):
    m = JG['marques']; i = int(i)
    if i < F3_T1: return pl('geste', 1)
    return pl('geste', min(m['toucher'] + (i - F3_T1), m['garder'] - 1))
class _F3:
    cles = cles([(0, 195, 986, 2.9), (56, 195, 986, 2.9), (78, 195, 1069, 2.9), (108, 195, 1069, 2.9)],
                I=[(0, 195, 980, 2.436), (56, 195, 980, 2.436), (78, 195, 1270, 2.436), (108, 195, 1270, 2.436)],
                H=[(0, 195, 980, 2.30), (56, 195, 980, 2.30), (78, 195, 1270, 2.30), (108, 195, 1270, 2.30)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(ecran_geste(i), f, cx, cy, e, 1500, tete=66)
        if i <= 17:
            c0 = f2.cles[f][-1]; a, Ma = appareil(ecran_vague(N['f2'] + i), f, c0[1], c0[2], c0[3], 1500)
            ox, oy = point(Ma, *DOIGT_F2[1]); img = onde_image(a, img, ox, oy, i)
            img = doigt(img, Ma, c0[3], DOIGT_F2[1][0], DOIGT_F2[1][1], 1 - float(lisse(i, 3, 11)), 1 - float(lisse(i, 0, 5)), rayon=17, force=.8)
        img = doigt_t(img, M, e, DOIGT_F3[0][0], DOIGT_F3[0][1], i, F3_T1 - 16, F3_T1, F3_T1 + 3)
        return doigt_t(img, M, e, DOIGT_F3[1][0], DOIGT_F3[1][1], i, N['f3'] - 28, N['f3'] - 4, N['f3'] + 9), True
f3 = _F3()
class _F4:
    cles = cles([(0, 195, 404, 2.9), (66, 195, 396, 3.04)], I=[(0, 195, 330, 2.436), (66, 195, 372, 2.6)], H=[(0, 195, 330, 2.30), (66, 195, 340, 2.40)])
    def __call__(self, i, f):
        cx, cy, e = cam(self.cles[f], i); img, M = appareil(pl('carnet', 1), f, cx, cy, e, 1500, tete=66)
        if i <= 17:
            c0 = f3.cles[f][-1]; a, Ma = appareil(ecran_geste(N['f3'] + i), f, c0[1], c0[2], c0[3], 1500)
            ox, oy = point(Ma, *DOIGT_F3[1]); img = onde_image(a, img, ox, oy, i)
            img = doigt(img, Ma, c0[3], DOIGT_F3[1][0], DOIGT_F3[1][1], 1 - float(lisse(i, 3, 11)), 1 - float(lisse(i, 0, 5)), rayon=17, force=.8)
        return img, True
f4 = _F4()
def f5(i, f):
    """La cuisine du père : sa main posée à plat sur la table, près du téléphone et du verre. « 24 étapes sur 6 mois, à votre rythme », puis la signature."""
    t = i / IPS; n = N['f5']; a = float(lisse5(t, -.6, n / IPS + .6)); P = cuisine.planche(1); W, H = FORMATS[f]
    if f == 'H': img = cuisine.cadre(P, f, 1560 - 90 * a, 930 + 30 * a, 1.03 + .05 * a)
    else: img = cuisine.cadre(P, f, 1800 - 50 * a, 930, 1.02 + .04 * a)
    p1 = float(lisse(t, .35, .95)) * (1 - float(lisse(t, n / IPS - .55, n / IPS - .15))); p2 = float(lisse(t, 1.40, 2.00)) * (1 - float(lisse(t, n / IPS - .55, n / IPS - .15)))
    tj = json.load(open(PRES + '/titres/titres.json')); y0 = tj['etapes-' + f]['y0']; y1 = tj['concu-' + f]['y1']
    img = img * (1 - ombre(f, y0 - 30, y1 + 30, .46, 150) * max(p1, p2))
    return pose(pose(img, 'etapes', f, p1), 'concu', f, p2)

# ======================================================================================= G. Le second SMS, puis le carton
FIL2 = {'V': (386.5, 2.46, .05), 'I': (430.0, 2.436, .0), 'H': (310.0, 2.5, .06)}
def g1(i, f):
    """Le même fil, quelques semaines plus tard. Cette fois c'est lui qui écrit : « Tu as cinq minutes ce soir ? J'aimerais te raconter ma journée. » Le message envoyé reste à l'image."""
    n = N['g1']; u = pl('fil2', min(int(i), n - 1)); a = float(lisse(i / n, -.1, 1.1)); t = i / IPS
    cy, e0, de = FIL2[f]; e = e0 + de * a; W, H = FORMATS[f]
    img, M = appareil(u, f, 195, cy, e, 773, ax=W / 2, ay=H / 2)
    ta, te = REP2['T_APPUI'], REP2['T_ENVOI']; E, P = REP2['ENV_T'], REP2['POINT']
    p = float(lisse(t, ta - .34, ta - .14)) * (1 - float(lisse(t, te + .04, te + .22))); q = float(lisse5(t, ta - .38, ta - .04))
    x = E['x'] + (P['x'] - E['x']) * .30 * (1 - q); y = E['y'] + (P['y'] - E['y']) * .30 * (1 - q)
    img = ecran.doigt(img, M, e, x, y, p, float(lisse(t, ta - .05, ta + .02)) * (1 - float(lisse(t, te + .02, te + .12))))
    return img * np.float32(float(lisse(i, -4, 9))) , False
def g2(i, f, avant):
    """Le carton : le logo, le nom, « Ici, on commence par vous. », l'adresse. avant : la dernière image du fil de messages."""
    t = i / IPS; k = float(lisse(t, 0, .5)); fond_c, _ = calque('carte-fond', f)
    img = avant * (1 - k) + fond_c * k
    img = pose(img, 'carte-logo', f, float(lisse(t, .25, .7))); img = pose(img, 'carte-nom', f, float(lisse(t, .5, .95)))
    img = pose(img, 'carte-ici', f, float(lisse(t, 1.0, 1.5))); img = pose(img, 'carte-url', f, float(lisse(t, 1.5, 2.0)))
    return pose(img, 'carte-fiction', f, float(lisse(t, 2.0, 2.5)))
