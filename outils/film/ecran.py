# Les plans d'écran : le fil de messages composé pour le film, puis la vraie version d'essai filmée (l'accueil, le doigt, « Souffler »).
# Au format vertical l'écran du téléphone remplit l'image. Au format horizontal on voit le téléphone de face, devant la cuisine floue.
import numpy as np, cv2, sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from film import *
import cuisine

DSF = 5
JOURNAL = json.load(open(ICI + '/app/journal.json'))
PORTE = JOURNAL['porte']
DOIGT = (300.0, 523.0)                                                 # l'endroit touché dans le film : à droite du texte de « Souffler 2 minutes », pour que le rond ne cache pas les mots
REP = json.load(open(ICI + '/ecrans/fil/reperes.json'))
C_TOUCHER, C_SOUFFLE0, C_INSPIREZ, C_EXPIREZ = 36, 49, 78, 198        # images de la capture : le toucher, le début gardé de « Souffler », « Inspirez », « Expirez »
N6, N7 = 45, 329                                                       # images du plan de l'accueil, images du plan « Souffler »

_ui = {}
def ui(dossier, i):
    k = (dossier, i)
    if k not in _ui:
        if len(_ui) > 6: _ui.pop(next(iter(_ui)))
        _ui[k] = cv2.imread('%s/%s/%04d.jpg' % (ICI, dossier, i)).astype(np.float32) / 255
    return _ui[k]

_fond = {}
def fond_cuisine(f):
    if f not in _fond:
        img = cuisine.cadre(cuisine.planche(2), f, 1500, 900, 1.12)
        _fond[f] = cv2.GaussianBlur(img, (0, 0), 46) * .5
    return _fond[f]

def arrondi(W, H, x0, y0, x1, y1, r):
    """Un rectangle aux coins arrondis, à bords doux (présence de 0 à 1)."""
    k = 2; m = np.zeros((H * k, W * k), np.uint8)
    X0, Y0, X1, Y1, R = [int(round(v * k)) for v in (x0, y0, x1, y1, r)]
    cv2.rectangle(m, (X0 + R, Y0), (X1 - R, Y1), 255, -1); cv2.rectangle(m, (X0, Y0 + R), (X1, Y1 - R), 255, -1)
    for cx, cy in ((X0 + R, Y0 + R), (X1 - R, Y0 + R), (X1 - R, Y1 - R), (X0 + R, Y1 - R)): cv2.circle(m, (cx, cy), R, 255, -1, cv2.LINE_AA)
    return cv2.resize(m, (W, H), interpolation=cv2.INTER_AREA).astype(np.float32) / 255

def appareil(u, f, cx, cy, e, haut_css):
    """Montre l'écran u (image à DSF points par point d'écran) de façon que le point (cx, cy) de l'écran soit au centre de l'image, à l'échelle e."""
    W, H = FORMATS[f]; s = e / DSF
    src = cv2.GaussianBlur(u, (0, 0), max(.35, .42 / s - .08))
    M = np.array([[s, 0, W / 2 - cx * e], [0, s, H / 2 - cy * e]], np.float64)
    img = cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    x0, y0 = W / 2 - cx * e, H / 2 - cy * e; x1, y1 = x0 + 390 * e, y0 + haut_css * e
    if x0 <= .5 and y0 <= .5 and x1 >= W - .5 and y1 >= H - .5: return img, M
    m_in = arrondi(W, H, x0, y0, x1, y1, 42 * e); m_out = arrondi(W, H, x0 - 8 * e, y0 - 8 * e, x1 + 8 * e, y1 + 8 * e, 50 * e)
    base = fond_cuisine(f).copy()
    base *= (1 - .62 * cv2.GaussianBlur(m_out, (0, 0), 34))[..., None]
    base += cv2.GaussianBlur(img * m_in[..., None], (0, 0), 80) * .42                      # l'écran éclaire un peu ce qui l'entoure
    bord = np.float32([.040, .036, .034])
    base = base * (1 - m_out[..., None]) + bord * m_out[..., None]
    base = base * (1 - m_in[..., None]) + img * m_in[..., None]
    return base, M

def doigt(img, M, e, x, y, presence, appui=0.0):
    """Le doigt sur l'écran : un rond clair et doux à l'endroit touché. presence de 0 à 1, appui de 0 à 1 (le rond se resserre)."""
    if presence <= .01: return img
    X = M[0, 0] * x * DSF + M[0, 2]; Y = M[1, 1] * y * DSF + M[1, 2]; r = (25 - 5 * appui) * e * (1.25 - .25 * presence)
    H, W = img.shape[:2]; yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); d = np.sqrt((xx - X) ** 2 + (yy - Y) ** 2)
    disque = (1 - lisse(d, r - 2.2 * e, r + 1.2 * e)).astype(np.float32); anneau = np.exp(-((d - r) / (1.6 * e)) ** 2).astype(np.float32)
    a = (disque * (.26 + .2 * appui) + anneau * .34) * presence
    return img * (1 - a[..., None]) + np.float32([.90, .96, 1.0]) * a[..., None]

def finition_ui(img, n, f, force_grain=.010):
    W, H = FORMATS[f]
    clair = cv2.GaussianBlur(np.maximum(img - .62, 0), (0, 0), 16) * .5                 # un halo léger autour des parties claires, comme sur un écran filmé
    img = img + clair
    img = img * np.float32([.955, .985, 1.0]) * .97 + .012                               # un rien plus chaud et moins contrasté, pour rester dans la lumière de la cuisine
    return grain(img * vignette(W, H, .16, .85), n, force_grain)

# --- le fil de messages (4 secondes) ------------------------------------------------------------------------------------------------
N2 = 126
def image_s2(i, f):
    u = ui('ecrans/fil', min(i, N2 - 1)); a = float(lisse(i / N2, -.1, 1.1)); W, H = FORMATS[f]; t = i / IPS
    if f == 'V': e = 2.7693 + .07 * a; img, M = appareil(u, f, 195, 346.5, e, 693)
    else: e = 2.4 + .1 * a; img, M = appareil(u, f, 195, 438 - 4 * a, e, 693)
    # le pouce : après le dernier mot il vient au-dessus du bouton d'envoi, s'y attarde une seconde, puis appuie
    tf, ta, te = REP['T_FIN_FRAPPE'], REP['T_APPUI'], REP['T_ENVOI']; E, P = REP['ENV'], REP['POINT']
    p = float(lisse(t, tf + .10, tf + .34)) * (1 - float(lisse(t, te + .04, te + .22)))
    q = float(lisse5(t, tf + .06, tf + .55))                                              # il arrive du clavier
    h = float(lisse(t, tf + .50, tf + .74)) * (1 - float(lisse(t, ta - .30, ta - .06)))   # il hésite : il recule un peu, puis revient
    x = E['x'] + (P['x'] - E['x']) * .35 * (1 - q) - 5 * h; y = E['y'] + (P['y'] - E['y']) * .35 * (1 - q) + 10 * h
    return doigt(img, M, e, x, y, p, float(lisse(t, ta - .05, ta + .02)) * (1 - float(lisse(t, te + .02, te + .12))))

# --- l'accueil de la version d'essai, puis le doigt (1,5 seconde) ------------------------------------------------------------------
# acc0 : le cadre au début du plan de l'accueil. acc : au moment du toucher. goutte : le cadre serré sur la goutte, sans rien de l'interface. fin : l'échelle à la fin du plan.
# Vertical : l'écran remplit l'image, puis on ne garde que la photo de l'étang (du dessous de la barre du haut au-dessus du mot de l'application).
#   mot : le cadre gardé tant que l'application écrit « Installez-vous ». On y lit en entier le mot et sa phrase. Il tient juste entre la pastille SOS (qui finit à 55,8 points)
#   et la rangée de boutons du bas (qui commence à 639,8 points) : rien n'y est coupé en haut ni en bas.
# Horizontal : on voit le titre entier et les 3 portes, puis la goutte sur toute la largeur de l'écran, sous la barre du haut.
CADRE = {'V': dict(acc0=(195, 346.6, 2.7693), acc=(195, 346.6, 2.84), mot=(195, 347.6, 3.31), goutte=(195, 236.5, 5.5), fin=5.62),
         'H': dict(acc0=(195, 391, 2.03), acc=(195, 391, 2.077), mot=(195, 321, 2.51), goutte=(195, 172, 4.93), fin=5.1)}
# Le cadre « mot » du format horizontal ne sert qu'à la proposition H2 (voir plus bas) : la goutte, « Installez-vous » et sa phrase, entre la pastille SOS et les points de progression.
def image_s6(i, f):
    u = ui('app', 20); c0, c1 = CADRE[f]['acc0'], CADRE[f]['acc']; a = i / N6
    e = float(np.exp(np.log(c0[2]) * (1 - a) + np.log(c1[2]) * a)); img, M = appareil(u, f, c1[0], c0[1] * (1 - a) + c1[1] * a, e, 844)
    # le doigt arrive par le bas à droite, se pose au-dessus de « Souffler 2 minutes », puis appuie
    p = float(lisse(i, 13, 23)); q = float(lisse5(i, 11, 31))
    return doigt(img, M, e, DOIGT[0] + 26 * (1 - q), DOIGT[1] + 54 * (1 - q), p, float(lisse(i, N6 - 3, N6)))

# --- « Souffler » : l'onde part du doigt et ouvre l'étang, puis une inspiration et une expiration -----------------------------------
_dist = None
JP = 42
J_INSPIREZ = C_INSPIREZ - C_SOUFFLE0                                   # l'image du plan où l'application écrit « Inspirez » : la première note
def avance(j):
    """Format horizontal. Le rapprochement vers la goutte : il part au toucher et se pose en douceur. À l'image 27 il est fait à 95 %, avant que l'application écrive « Inspirez »."""
    x = min(1.0, max(0.0, j / JP)); return 1 - (1 - x) ** 3

# Format vertical : le cadre se resserre en 2 temps, pour que « Installez-vous » reste lisible en entier.
#   1. Du toucher à la première note, il avance à peine (du cadre « acc » au cadre « mot ») : le mot et sa phrase restent entiers, presque immobiles.
#   2. À la première note l'application écrit « Inspirez » : alors seulement le cadre plonge vers la goutte.
# Pendant la plongée le mot ne sort pas de l'image : le film l'écrit lui-même, comme l'application (même police, même taille, même place), et le pose sous la goutte.
JV1, JVD = 11, 22                                                      # images du premier temps (il finit avec l'onde, puis le cadre ne bouge plus jusqu'à la note), images de la plongée
MOT_V = 1440.0                                                         # la hauteur où le film vertical garde le mot, une fois la plongée faite
_MOT_JS = json.load(open(ICI + '/titres/mot.json'))
MOT_IMG = (195.0 * _MOT_JS['dsf'], (_MOT_JS['Inspirez']['y'] + _MOT_JS['Inspirez']['h'] / 2) * _MOT_JS['dsf'])   # le milieu du mot dans son image (titres/mot.js)
# Mesuré sur l'encre des lettres : le haut de l'image du mot correspond à la hauteur 376,0 de l'écran de l'application (même largeur, même taille, au point près).
MOT_APP = 376.0 + MOT_IMG[1] / _MOT_JS['dsf']                          # le milieu du grand mot sur l'écran de l'application, en points
def _fixe(c0, c1, e):
    """Entre deux cadres, un vrai zoom : un point de l'écran reste à la même place dans l'image. Rend la hauteur visée pour l'échelle e."""
    p = (c1[1] * c1[2] - c0[1] * c0[2]) / (c1[2] - c0[2]); return p - (p - c0[1]) * c0[2] / e
# H2 : la même correction proposée pour le film horizontal (le cadre en 2 temps, le mot écrit par le film en haut de l'image). Elle n'est faite que si on la demande
# (python3 h2.py) et elle écrit ses fichiers à part, dans out/H2/ : le film horizontal publié reste celui du 20 novembre à 2 heures tant qu'Antonio n'a pas dit oui.
H2 = False
def deux_temps(f): return f == 'V' or (f == 'H' and H2)
def cadre_v(jj, f='V'):
    """Le cadre en 2 temps à l'instant jj du plan (hauteur visée sur l'écran, échelle). Format vertical, ou horizontal pour la proposition H2."""
    c0, c1, c2 = CADRE[f]['acc'], CADRE[f]['mot'], CADRE[f]['goutte']
    a2 = float(lisse5(jj, J_INSPIREZ, J_INSPIREZ + JVD))
    if a2 <= 0:
        a1 = 1 - (1 - min(1.0, max(0.0, jj / JV1))) ** 3                # il part avec le toucher et se pose en douceur : la barre du haut et la rangée du bas sortent pendant que l'onde ouvre l'étang
        e = float(np.exp(np.log(c0[2]) * (1 - a1) + np.log(c1[2]) * a1)); cy = _fixe(c0, c1, e)
    else:
        e = float(np.exp(np.log(c1[2]) * (1 - a2) + np.log(c2[2]) * a2)); cy = _fixe(c1, c2, e)
    b = float(lisse(jj, JP * .6, N7 + 30))                              # puis l'avancée très lente du reste du plan, inchangée
    return cy, e * (1 + (CADRE[f]['fin'] / c2[2] - 1) * b)
def mot_y_v(jj):
    """Format vertical : la hauteur du mot écrit par le film. D'abord là où l'application l'écrit, puis il descend se poser sous la goutte pendant la plongée."""
    c1 = CADRE['V']['mot']; y0 = 960 + (MOT_APP - c1[1]) * c1[2]
    return y0 + (MOT_V - y0) * float(lisse5(jj, J_INSPIREZ, J_INSPIREZ + JVD))
_mot = {}
def mot_app(nom):
    if nom not in _mot:
        x = cv2.imread('%s/titres/mot-%s.png' % (ICI, nom), cv2.IMREAD_UNCHANGED).astype(np.float32) / 255; a = x[..., 3:]
        _mot[nom] = np.dstack([x[..., :3] * a, a])                      # la couleur déjà multipliée par l'opacité
    return _mot[nom]
_pose = {}
def calque_mot(nom, f, y, e=None):
    """Le grand mot de l'application, centré en largeur, son milieu à la hauteur y de l'image, à l'échelle e (celle du cadre « mot » par défaut). Rend (couleur multipliée, opacité)."""
    k = (nom, f, round(y, 2), e)
    if k not in _pose:
        if len(_pose) > 12: _pose.pop(next(iter(_pose)))
        W, H = FORMATS[f]; s = (e or CADRE[f]['mot'][2]) / DSF
        src = cv2.GaussianBlur(mot_app(nom), (0, 0), max(.35, .42 / s - .08))      # le même adoucissement que pour l'écran filmé
        M = np.array([[s, 0, W / 2 - MOT_IMG[0] * s], [0, s, y - MOT_IMG[1] * s]], np.float64)
        c = cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        _pose[k] = (c[..., :3], c[..., 3:])
    return _pose[k]
def pose_mot(img, nom, f, y, presence=1.0):
    if presence <= .003: return img
    c, a = calque_mot(nom, f, y); return img * (1 - a * np.float32(presence)) + c * np.float32(presence)

def image_s7(j, f, dj=0.0):
    """dj : fraction d'image ajoutée à l'instant de la caméra et de l'onde. Le montage en moyenne plusieurs pendant les mouvements, pour un vrai flou de mouvement."""
    global _dist
    # au format vertical, dès que l'application écrit « Inspirez », on prend la capture où ce mot est caché (capture_sans_mot.js) : c'est le film qui l'écrit
    dossier = 'app-sm' if f == 'V' and j >= J_INSPIREZ else 'app'        # (proposition H2 : l'écran garde son mot, qui sort par le bas pendant la plongée)
    u = ui(dossier, min(C_SOUFFLE0 + j, 376)); W, H = FORMATS[f]; R = 16; jj = j + dj    # 377 : l'inspiration suivante, que le film ne montre pas
    if jj <= R + 1:                                                                       # l'onde : un cercle qui grandit depuis le doigt
        if _dist is None:
            hh, ww = u.shape[:2]; yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32); _dist = np.sqrt((xx / DSF - DOIGT[0]) ** 2 + (yy / DSF - DOIGT[1]) ** 2)
        r = 1080 * float(lisse5(jj / R)) ** 1.15
        m = (1 - lisse(_dist, r - 26, r + 26)).astype(np.float32)[..., None]
        bord = (np.exp(-((_dist - r) / 30) ** 2) * .22 * (1 - jj / (R + 1))).astype(np.float32)[..., None]
        u = ui('app', C_TOUCHER) * (1 - m) + u * m + bord * np.float32([.82, .95, 1.0])
    if deux_temps(f): cx = 195.0; cy, e = cadre_v(jj, f)
    else:
        a = avance(jj); b = float(lisse(jj, JP * .6, N7 + 30))
        c0, c1 = CADRE[f]['acc'], CADRE[f]['goutte']
        e = np.exp(np.log(c0[2]) * (1 - a) + np.log(c1[2]) * a) * (1 + (CADRE[f]['fin'] / c1[2] - 1) * b)
        cx = c0[0] * (1 - a) + c1[0] * a; cy = c0[1] * (1 - a) + c1[1] * a
    cy = float(np.clip(cy, H / 2 / e, 844 - H / 2 / e)) if 390 * e >= W else cy
    img, M = appareil(u, f, cx, cy, e, 844)
    p = 1 - float(lisse(j, 3, 11)); img = doigt(img, M, e, DOIGT[0], DOIGT[1], p, 1 - float(lisse(j, 0, 5)))
    return img

if __name__ == '__main__':
    f = sys.argv[1]; W, H = FORMATS[f]
    t = [finition_ui(image_s2(i, f), i, f) for i in (20, 60, 88, 104, 108, 124)] + [finition_ui(image_s6(i, f), i, f) for i in (0, 26, 44)] + [finition_ui(image_s7(j, f), j, f) for j in (4, 9, 16, 24, 30, 100, 200, 328)]
    k = (384, 216) if f == 'H' else (216, 384)
    t = [cv2.resize(np.clip(x, 0, 1), k, interpolation=cv2.INTER_AREA) for x in t]
    c = 6 if f == 'H' else 9
    while len(t) % c: t.append(np.zeros_like(t[0]))
    cv2.imwrite(ICI + '/tmp/ecran-%s.jpg' % f, (np.vstack([np.hstack(t[k:k + c]) for k in range(0, len(t), c)]) * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 86])
