# « Ce qu'on ne dit pas par SMS » : outils des plans (écrans réels du site filmés dans un téléphone, photos sur le vert du film, textes).
# Formats : V (1080 × 1920), H (1920 × 1080), I (1080 × 1920 pour Instagram : ce qui doit se lire tient entre les hauteurs 269 et 1248).
import numpy as np, cv2, sys, os, json
PRES = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.dirname(PRES))
from film import *
import ecran, cuisine, raccord
DSF = 5
ZI = (INSTA['haut'] + INSTA['bas']) / 2                                   # le milieu de la zone libre d'Instagram (758,5)
def centre(f): W, H = FORMATS[f]; return (W / 2, ZI if f == 'I' else H / 2)
def J(nom): return json.load(open('%s/cap/%s/journal.json' % (PRES, nom)))

# ---------------------------------------------------------------- les images de base
_pl = {}
def pl(dossier, i, garde=5):
    """Une capture (points d'écran × 5), en nombres de 0 à 1."""
    k = (dossier, i)
    if k not in _pl:
        while len(_pl) >= garde: _pl.pop(next(iter(_pl)))
        x = cv2.imread('%s/cap/%s/%04d.jpg' % (PRES, dossier, i))
        if x is None: raise SystemExit('capture absente : %s %d' % (dossier, i))
        _pl[k] = x.astype(np.float32) / 255
    return _pl[k]
_ph = {}
def photo(n, niveau=2):
    """La photo n (1 : les dominos, 2 : la fiche ensemble, 3 : le café), agrandie 2 fois (niveau 2) ou à sa taille d'origine (niveau 1)."""
    k = (n, niveau)
    if k not in _ph:
        if niveau == 2:
            c = '%s/cap/photo%d-x2.png' % (PRES, n)
            if not os.path.exists(c):
                x4 = cv2.imread('%s/../plates/photo%dx4.png' % (PRES, n)); cv2.imwrite(c, cv2.resize(x4, (2508, 2508), interpolation=cv2.INTER_AREA))
            _ph[k] = cv2.imread(c).astype(np.float32) / 255
        else:
            _ph[k] = cv2.imread('%s/src/%s.png' % (PRES, {1: '01-les-dominos', 2: '02-la-fiche-ensemble', 3: '03-le-cafe-de-bastien'}[n])).astype(np.float32) / 255
    return _ph[k]
# la zone des dominos agrandie 4 fois, pour la plongée vers un point du domino
DOM = (430, 900, 940, 1254)                                               # gauche, haut, droite, bas (points de la photo d'origine)
def photo_dominos():
    if 'dom' not in _ph:
        c = '%s/cap/photo1-dominos-x4.png' % PRES
        if not os.path.exists(c):
            x4 = cv2.imread('%s/../plates/photo1x4.png' % PRES); cv2.imwrite(c, x4[DOM[1] * 4:DOM[3] * 4, DOM[0] * 4:DOM[2] * 4])
        _ph['dom'] = cv2.imread(c).astype(np.float32) / 255
    return _ph['dom']

_vert = {}
def vert(f):
    """Le fond vert du film (celui du carton final)."""
    if f not in _vert: _vert[f] = cv2.imread('%s/titres/carte-fond-%s.png' % (PRES, f))[..., :3].astype(np.float32) / 255
    return _vert[f]
_fd = {}
def fond(nom, f):
    """Ce qu'on devine derrière le téléphone. nuit : la cuisine du premier soir. pere : la même cuisine un autre jour (la photo des dominos, floue).
    bastien : la cuisine de Bastien et de sa mère. remi : chez Rémi."""
    k = (nom, f)
    if k not in _fd:
        if nom == 'nuit': _fd[k] = ecran.fond_cuisine(f)
        else:
            W, H = FORMATS[f]; P = photo({'pere': 1, 'bastien': 2, 'remi': 3}[nom], 1); z = max(W, H) / 1254 * 1.25
            cx, cy = {'pere': (700, 520), 'bastien': (640, 560), 'remi': (560, 560)}[nom]
            img = camera(P, cx, cy, W / 2, H / 2, z, W, H)
            _fd[k] = cv2.GaussianBlur(img, (0, 0), 52) * np.float32({'pere': .46, 'bastien': .50, 'remi': .52}[nom])
    return _fd[k]

_tx = {}
def calque(nom, f):
    k = (nom, f)
    if k not in _tx:
        c = '%s/titres/%s-%s.png' % (PRES, nom, f)
        if not os.path.exists(c): c = '%s/../titres/%s-%s.png' % (PRES, nom, 'V' if f == 'I' else f)       # « Et vous ? » vient du film de 35 secondes
        x = cv2.imread(c, cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
        _tx[k] = (x[..., :3], x[..., 3:]) if x.shape[2] == 4 else (x[..., :3], None)
    return _tx[k]
def pose(img, nom, f, presence, dy=0.0):
    if presence <= .003: return img
    c, a = calque(nom, f)
    if abs(dy) > .01: M = np.float64([[1, 0, 0], [0, 1, dy]]); c = cv2.warpAffine(c, M, (c.shape[1], c.shape[0])); a = cv2.warpAffine(a, M, (a.shape[1], a.shape[0]))[..., None]
    a = a * np.float32(presence); return img * (1 - a) + c * a
def ombre(f, y0, y1, force=.5, doux=110):
    """Une bande d'ombre douce entre deux hauteurs de l'image, pour qu'un texte s'y lise."""
    W, H = FORMATS[f]; yy = np.arange(H, dtype=np.float32)[:, None]
    return (force * lisse(yy, y0 - doux, y0 + doux * .3) * (1 - lisse(yy, y1 - doux * .3, y1 + doux))).astype(np.float32)[..., None] * np.ones((1, W, 1), np.float32)

# ---------------------------------------------------------------- un écran du site, filmé dans le téléphone
def appareil(u, f, cx, cy, e, haut, ax=None, ay=None, lieu='nuit', chaleur=1.0, tete=0.0, voile=.5):
    """Montre l'écran u (5 points par point d'écran) : le point (cx, cy) de l'écran arrive en (ax, ay) de l'image, à l'échelle e.
    Quand l'écran ne couvre pas toute l'image, on voit le téléphone devant la pièce floue. Rend (image, passage de l'écran à l'image).
    tete : la hauteur de la barre du haut de l'écran (« Retour », « SOS »). Quand elle entre dans l'image, elle est un peu retenue, pour que le regard aille au contenu."""
    W, H = FORMATS[f]; s = e / DSF; c0 = centre(f); ax = c0[0] if ax is None else ax; ay = c0[1] if ay is None else ay
    tx, ty = ax - cx * e, ay - cy * e
    Y0 = int(max(0, np.floor(-ty / s) - 24)); Y1 = int(min(u.shape[0], np.ceil((H - ty) / s) + 24))
    if Y1 <= Y0: Y0, Y1 = 0, min(u.shape[0], 8)
    src = cv2.GaussianBlur(u[Y0:Y1], (0, 0), max(.35, .42 / s - .08))
    M = np.array([[s, 0, tx], [0, s, ty]], np.float64); Mc = M.copy(); Mc[1, 2] = ty + s * Y0
    img = cv2.warpAffine(src, Mc, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    if tete > 0 and ty + tete * e > 0:
        yy = np.arange(H, dtype=np.float32)[:, None, None]; img = img * (1 - np.float32(voile) * (1 - lisse(yy, ty + (tete - 5) * e, ty + (tete + 1) * e)).astype(np.float32))
    x0, y0 = tx, ty; x1, y1 = x0 + 390 * e, y0 + haut * e
    if x0 <= .5 and y0 <= .5 and x1 >= W - .5 and y1 >= H - .5: return img, M
    m_in = ecran.arrondi(W, H, x0, y0, x1, y1, 42 * e); m_out = ecran.arrondi(W, H, x0 - 8 * e, y0 - 8 * e, x1 + 8 * e, y1 + 8 * e, 50 * e)
    base = fond(lieu, f) * np.float32(chaleur)
    base = base * (1 - .62 * ecran.flou_large(m_out, 34))[..., None]
    base = base + ecran.flou_large(img * m_in[..., None], 80) * .42                              # l'écran éclaire un peu ce qui l'entoure
    bord = np.float32([.040, .036, .034])
    base = base * (1 - m_out[..., None]) + bord * m_out[..., None]
    base = base * (1 - m_in[..., None]) + img * m_in[..., None]
    return base, M

def finition_ui(img, n, f, clair=False, grain_f=.010):
    """La dernière passe d'un plan d'écran : un halo léger, la lumière un rien plus chaude, le grain. clair : un écran clair, dont le halo est retenu."""
    W, H = FORMATS[f]
    halo = cv2.GaussianBlur(np.maximum(img - (.80 if clair else .62), 0), (0, 0), 16) * (.22 if clair else .5)
    img = (img + halo) * np.float32([.955, .985, 1.0]) * .97 + .012
    return grain(img * vignette(W, H, .16, .85), n, grain_f)

_dist = {}
def onde(avant, apres, origine, jj, R=16, rayon=1150.0):
    """L'onde du site : un cercle part de l'endroit touché et découvre l'écran suivant. avant, apres : deux écrans de même largeur. origine en points d'écran."""
    h = apres.shape[0]
    if avant.shape[0] < h: avant = np.vstack([avant, np.repeat(avant[-1:], h - avant.shape[0], axis=0)])
    elif avant.shape[0] > h: avant = avant[:h]
    if jj >= R + 1: return apres
    k = (apres.shape[:2], origine)
    if k not in _dist:
        if len(_dist) > 2: _dist.pop(next(iter(_dist)))
        yy, xx = np.mgrid[0:h, 0:apres.shape[1]].astype(np.float32); _dist[k] = np.sqrt((xx / DSF - origine[0]) ** 2 + (yy / DSF - origine[1]) ** 2)
    d = _dist[k]; r = rayon * float(lisse5(jj / R)) ** 1.15
    m = (1 - lisse(d, r - 26, r + 26)).astype(np.float32)[..., None]
    bord = (np.exp(-((d - r) / 30) ** 2) * .22 * (1 - jj / (R + 1))).astype(np.float32)[..., None]
    return avant * (1 - m) + apres * m + bord * np.float32([.82, .95, 1.0])

def curseur(u, x, y, h, coul=(.847, .937, .957), l=2.0):
    """Le curseur d'écriture, dessiné sur une copie de l'écran (x, y, h en points d'écran ; la couleur est celle que le site donne à son curseur)."""
    v = u.copy(); X0, X1 = int(round(x * DSF)), int(round((x + l) * DSF)); Y0, Y1 = int(round(y * DSF)), int(round((y + h) * DSF))
    v[Y0:Y1, X0:X1] = np.float32(coul); return v

def net_autour(u, y0, y1, marge=14, flou=3.2, sombre=.34, clair=False):
    """Garde l'écran net et lumineux entre les hauteurs y0 et y1 (points d'écran). Au-dessus et au-dessous, il part doucement dans le flou et perd de sa lumière."""
    hh = u.shape[0]; yy = (np.arange(hh, dtype=np.float32) / DSF)[:, None]
    hors = (1 - lisse(yy, y0 - marge, y0) * (1 - lisse(yy, y1, y1 + marge))).astype(np.float32)[..., None]
    doux = cv2.GaussianBlur(u, (0, 0), flou * DSF)
    doux = doux * (1 - sombre) if not clair else doux * (1 - sombre * .45) + np.float32(.0)
    return (u * (1 - hors) + doux * hors).astype(np.float32)

# ---------------------------------------------------------------- la caméra : des cadres clés, et un passage doux de l'un à l'autre
def cam(cles, i):
    """cles : [(image, cx, cy, e), …]. Entre deux clés, le cadre glisse avec un départ et une arrivée très doux ; l'échelle change en proportion. Rend (cx, cy, e)."""
    if i <= cles[0][0]: return cles[0][1:]
    for (a, b) in zip(cles[:-1], cles[1:]):
        if i <= b[0]:
            if b[0] == a[0]: return b[1:]
            t = float(lisse5((i - a[0]) / (b[0] - a[0])))
            return (a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, float(np.exp(np.log(a[3]) * (1 - t) + np.log(b[3]) * t)))
    return cles[-1][1:]
def bouge(cles, i, pas=1.0):
    """Vrai si le cadre bouge autour de l'image i (pour ne calculer un flou de mouvement que là)."""
    a, b = cam(cles, i), cam(cles, i + pas); return abs(a[0] - b[0]) * b[2] + abs(a[1] - b[1]) * b[2] + abs(np.log(a[2] / b[2])) * 600 > .6

# ---------------------------------------------------------------- une photo sur le vert du film
def vue_photo(n, f, cx, cy, s, ax=None, ay=None, fen=None, coin=18.0, lueur=1.0):
    """La photo n, son point (cx, cy) (points de la photo d'origine) en (ax, ay) de l'image, à l'échelle s (points d'image par point de photo).
    Là où la photo ne couvre pas l'image, on voit le vert du film. fen : une fenêtre (gauche, haut, droite, bas) hors de laquelle la photo ne se montre pas."""
    W, H = FORMATS[f]; c0 = centre(f); ax = c0[0] if ax is None else ax; ay = c0[1] if ay is None else ay
    if s <= 1.0: P = photo(n, 1); k = 1.0
    else: P = photo(n, 2); k = 2.0
    e = s / k; M = np.array([[e, 0, ax - cx * s], [0, e, ay - cy * s]], np.float64)
    src = cv2.GaussianBlur(P, (0, 0), max(0, .5 / e - .45)) if e < .92 else P
    img = cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_CUBIC if e >= 1 else cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    x0, y0, x1, y1 = ax - cx * s, ay - cy * s, ax + (1254 - cx) * s, ay + (1254 - cy) * s
    if fen is not None: x0, y0, x1, y1 = max(x0, fen[0]), max(y0, fen[1]), min(x1, fen[2]), min(y1, fen[3])
    if x0 <= .5 and y0 <= .5 and x1 >= W - .5 and y1 >= H - .5: return img
    m = ecran.arrondi(W, H, x0, y0, x1, y1, coin)[..., None]
    base = vert(f) * np.float32(lueur)
    base = base * (1 - .55 * ecran.flou_large(m[..., 0], 26))[..., None]                         # une ombre douce autour de la photo
    return base * (1 - m) + img * m
