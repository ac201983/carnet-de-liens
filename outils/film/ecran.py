# Les plans d'écran : le fil de messages composé pour le film, puis la vraie version d'essai filmée (« Souffler 2 minutes » sur l'accueil, le doigt, « Souffler »).
# V3 (20 novembre 2026) : après « Et vous ? », on ne montre plus l'accueil entier. Le cadre est d'emblée sur « Souffler 2 minutes », sous le logo et le nom du site.
# Un seul appui, l'onde ouvre l'étang, puis le cadre se pose et ne bouge plus tant que l'application écrit « Installez-vous » et sa phrase.
import numpy as np, cv2, sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from film import *
import cuisine

DSF = 5
JA = json.load(open(ICI + '/accueil/journal.json'))                    # l'accueil défilé de 425 points : le logo et le nom restent en haut, « Souffler 2 minutes » vient juste dessous
PORTE = JA['porte']
RANG = PORTE['y'] + PORTE['h'] / 2                                     # le milieu de la ligne « Souffler 2 minutes » sur l'écran (97,6)
DOIGT = (247.0, 83.0)                                                  # l'endroit touché dans le film : à droite du titre de la ligne, pour que le rond ne cache pas les mots
REP = json.load(open(ICI + '/ecrans/fil/reperes.json'))
C_TOUCHER, C_SOUFFLE0, C_INSPIREZ, C_EXPIREZ, C_FIN = 36, 49, 78, 198, 376   # images de la capture : le toucher, « Installez-vous » (rien ne bouge jusqu'à 77), « Inspirez », « Expirez », la fin de l'expiration
N2 = 138                                                               # images du plan du SMS
N6 = 54                                                                # images du plan « Souffler 2 minutes »
JN = 114                                                               # images entre l'appui et la première note : le temps de lire « Installez-vous » et sa phrase (3,8 secondes)
REPOS = 8                                                              # images gardées après la fin de l'expiration : la goutte est revenue, on la laisse posée un instant
N7 = JN + (C_FIN - C_INSPIREZ + 2) + REPOS                             # 114 + 300 + 8 = 422 images
J_INSPIREZ, J_EXPIREZ = JN, JN + (C_EXPIREZ - C_INSPIREZ)

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

def flou_large(img, sigma, k=8):
    """Un grand flou, calculé sur une image 8 fois plus petite (le résultat est le même à l'œil, en beaucoup moins de temps)."""
    h, w = img.shape[:2]; p = cv2.resize(img, (max(1, w // k), max(1, h // k)), interpolation=cv2.INTER_AREA)
    p = cv2.GaussianBlur(p, (0, 0), sigma / k); out = cv2.resize(p, (w, h), interpolation=cv2.INTER_CUBIC)
    return out if out.ndim == img.ndim else out[..., None]

def arrondi(W, H, x0, y0, x1, y1, r):
    """Un rectangle aux coins arrondis, à bords doux (présence de 0 à 1)."""
    k = 2; m = np.zeros((H * k, W * k), np.uint8)
    X0, Y0, X1, Y1, R = [int(round(v * k)) for v in (x0, y0, x1, y1, r)]
    cv2.rectangle(m, (X0 + R, Y0), (X1 - R, Y1), 255, -1); cv2.rectangle(m, (X0, Y0 + R), (X1, Y1 - R), 255, -1)
    for cx, cy in ((X0 + R, Y0 + R), (X1 - R, Y0 + R), (X1 - R, Y1 - R), (X0 + R, Y1 - R)): cv2.circle(m, (cx, cy), R, 255, -1, cv2.LINE_AA)
    return cv2.resize(m, (W, H), interpolation=cv2.INTER_AREA).astype(np.float32) / 255

def appareil(u, f, cx, cy, e, haut_css, chaleur=1.0):
    """Montre l'écran u (image à DSF points par point d'écran) de façon que le point (cx, cy) de l'écran soit au centre de l'image, à l'échelle e.
    Quand l'écran ne couvre pas toute l'image, on voit le téléphone devant la cuisine floue. chaleur : la force de la lumière de la cuisine autour du téléphone."""
    W, H = FORMATS[f]; s = e / DSF
    src = cv2.GaussianBlur(u, (0, 0), max(.35, .42 / s - .08))
    M = np.array([[s, 0, W / 2 - cx * e], [0, s, H / 2 - cy * e]], np.float64)
    img = cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    x0, y0 = W / 2 - cx * e, H / 2 - cy * e; x1, y1 = x0 + 390 * e, y0 + haut_css * e
    if x0 <= .5 and y0 <= .5 and x1 >= W - .5 and y1 >= H - .5: return img, M
    m_in = arrondi(W, H, x0, y0, x1, y1, 42 * e); m_out = arrondi(W, H, x0 - 8 * e, y0 - 8 * e, x1 + 8 * e, y1 + 8 * e, 50 * e)
    base = fond_cuisine(f) * np.float32(chaleur)
    base *= (1 - .62 * flou_large(m_out, 34))[..., None] if m_out.ndim == 2 else 1
    base += flou_large(img * m_in[..., None], 80) * .42                                    # l'écran éclaire un peu ce qui l'entoure
    bord = np.float32([.040, .036, .034])
    base = base * (1 - m_out[..., None]) + bord * m_out[..., None]
    base = base * (1 - m_in[..., None]) + img * m_in[..., None]
    return base, M

def doigt(img, M, e, x, y, presence, appui=0.0, rayon=25.0, force=1.0):
    """Le doigt sur l'écran : un rond clair et doux à l'endroit touché. presence de 0 à 1, appui de 0 à 1 (le rond se resserre). rayon en points d'écran."""
    if presence <= .01: return img
    X = M[0, 0] * x * DSF + M[0, 2]; Y = M[1, 1] * y * DSF + M[1, 2]; r = rayon * (1 - .2 * appui) * e * (1.25 - .25 * presence)
    H, W = img.shape[:2]; yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); d = np.sqrt((xx - X) ** 2 + (yy - Y) ** 2)
    disque = (1 - lisse(d, r - 2.2 * e, r + 1.2 * e)).astype(np.float32); anneau = np.exp(-((d - r) / (1.6 * e)) ** 2).astype(np.float32)
    a = (disque * (.26 + .2 * appui) + anneau * .34) * presence * force
    return img * (1 - a[..., None]) + np.float32([.90, .96, 1.0]) * a[..., None]

def finition_ui(img, n, f, force_grain=.010):
    W, H = FORMATS[f]
    clair = cv2.GaussianBlur(np.maximum(img - .62, 0), (0, 0), 16) * .5                 # un halo léger autour des parties claires, comme sur un écran filmé
    img = img + clair
    img = img * np.float32([.955, .985, 1.0]) * .97 + .012                               # un rien plus chaud et moins contrasté, pour rester dans la lumière de la cuisine
    return grain(img * vignette(W, H, .16, .85), n, force_grain)

# --- le fil de messages (4,6 secondes) -----------------------------------------------------------------------------------------------
# V3 : après le point final, le pouce n'est plus là. Seul le curseur clignote. Le pouce ne revient que pour envoyer.
# Vertical : l'écran remplit l'image. Instagram : le même écran, remonté de 90 points, pour que le message écrit et le bouton d'envoi restent au-dessus des commandes d'Instagram.
# Horizontal : le téléphone de face devant la cuisine, cadré sur les 2 messages et la ligne où l'on écrit.
FIL = {'V': (346.5, 2.7693, .07), 'I': (379.0, 2.7693, .07), 'H': (328.0, 3.1, .1)}
def image_s2(i, f):
    u = ui('ecrans/fil', min(i, N2 - 1)); a = float(lisse(i / N2, -.1, 1.1)); W, H = FORMATS[f]; t = i / IPS
    cy, e0, de = FIL[f]; e = e0 + de * a; img, M = appareil(u, f, 195, cy, e, 693)
    # le pouce : il laisse le curseur clignoter seul, puis il vient du clavier au bouton d'envoi et appuie
    tf, ta, te = REP['T_FIN_FRAPPE'], REP['T_APPUI'], REP['T_ENVOI']; E, P = REP['ENV'], REP['POINT']
    p = float(lisse(t, ta - .62, ta - .36)) * (1 - float(lisse(t, te + .04, te + .22)))
    q = float(lisse5(t, ta - .66, ta - .14))
    x = E['x'] + (P['x'] - E['x']) * .30 * (1 - q); y = E['y'] + (P['y'] - E['y']) * .30 * (1 - q)
    return doigt(img, M, e, x, y, p, float(lisse(t, ta - .05, ta + .02)) * (1 - float(lisse(t, te + .02, te + .12))))

# --- « Souffler 2 minutes » sur l'accueil de la version d'essai, puis un seul appui (1,8 seconde) --------------------------------------
# por0 : le cadre au début du plan. por : au moment de l'appui. Le cadre est serré sur la ligne « Souffler 2 minutes », au milieu de l'image.
#   Au-dessus, la barre du site (la goutte du logo et « Parent écouté, parent éclairé ») suffit à reconnaître le site. Le bouton SOS, à droite, reste hors du cadre.
#   Plus haut on voit le bord du téléphone et la cuisine floue. Plus bas, l'entrée suivante est laissée dans le flou et dans l'ombre : le regard n'a qu'un endroit où aller.
# mot : le cadre posé, qui ne bouge plus tant que l'application écrit « Installez-vous » et sa phrase.
#   Vertical : il tient juste entre la pastille SOS (qui finit à 55,8 points) et la rangée de boutons du bas (qui commence à 639,8 points).
#   Instagram : l'écran entier en largeur, le mot et sa phrase entre les hauteurs 1024 et 1228 de l'image, au-dessus des commandes d'Instagram.
#   Horizontal : le téléphone de face, de la goutte à la phrase, avec de la marge sous la phrase.
# goutte : le cadre serré sur la goutte, sans rien de l'interface. fin : l'échelle à la fin du plan.
CADRE = {'V': dict(por0=(146, RANG, 3.70), por=(146, RANG, 3.78), mot=(195, 347.6, 3.31), goutte=(195, 236.5, 5.5), fin=5.62),
         'I': dict(por0=(146, RANG, 3.70), por=(146, RANG, 3.78), mot=(195, 423.2, 2.7693), goutte=(195, 270.5, 4.0), fin=4.09),
         'H': dict(por0=(62.5, RANG, 4.20), por=(62.5, RANG, 4.29), mot=(195, 340.0, 2.30), goutte=(195, 172, 4.93), fin=5.1)}
NET_BAS = (PORTE['y'] + PORTE['h'] - 9, PORTE['y'] + PORTE['h'] + 15)   # sous la ligne « Souffler 2 minutes », l'image perd sa netteté et sa lumière entre ces 2 hauteurs de l'écran
NET_HAUT = (40.0, 62.0)                                                 # au-dessus de la ligne, la barre du site reste nette, un peu moins éclairée : on la reconnaît, puis on lit la ligne
_acc = {}
def accueil_net():
    """L'accueil tel qu'on le filme : la ligne « Souffler 2 minutes » nette et claire. Plus bas, l'écran part dans le flou et dans l'ombre. Au-dessus, la barre du site est un peu retenue.
    C'est fait une fois sur la capture elle-même : la cuisine autour du téléphone garde sa lumière."""
    if 'n' not in _acc:
        u = ui('accueil', 0); hh, ww = u.shape[:2]; yy = (np.arange(hh, dtype=np.float32) / DSF)[:, None]
        bas = lisse(yy, NET_BAS[0], NET_BAS[1]).astype(np.float32)[..., None]
        ombre = (.32 - .20 * lisse(yy, 150, 300)).astype(np.float32)[..., None]                       # plus on descend, plus c'est sombre
        haut = (1 - lisse(yy, NET_HAUT[0], NET_HAUT[1])).astype(np.float32)[..., None]
        doux = cv2.GaussianBlur(u, (0, 0), 3.6 * DSF) * ombre
        _acc['n'] = ((u * (1 - bas) + doux * bas) * (1 - np.float32(.2) * haut)).astype(np.float32)
    return _acc['n']
def image_s6(i, f):
    u = accueil_net(); c0, c1 = CADRE[f]['por0'], CADRE[f]['por']; a = float(lisse(i / N6, -.15, 1.0))
    e = float(np.exp(np.log(c0[2]) * (1 - a) + np.log(c1[2]) * a)); img, M = appareil(u, f, c1[0], c1[1], e, 844, chaleur=1.5)
    # le doigt arrive par le bas à droite, se pose sur la ligne, puis appuie : un seul appui, discret
    p = float(lisse(i, 24, 36)); q = float(lisse5(i, 22, 44))
    return doigt(img, M, e, DOIGT[0] + 14 * (1 - q), DOIGT[1] + 34 * (1 - q), p, float(lisse(i, N6 - 4, N6 - 1)), rayon=17, force=.8)

# --- « Souffler » : l'onde part du doigt et ouvre l'étang, le cadre se pose, puis une inspiration et une expiration entières --------------
_dist = None
JG = 30                                                                # images du trajet entre la ligne touchée et le cadre posé
JGY = 22                                                               # le cadre descend d'abord (images 0 à JGY)...
JGX = {'V': 15, 'I': 15, 'H': 10}                                      # ...et ne part vers la droite qu'ensuite (de cette image à JG) : la pastille SOS reste hors du cadre pendant tout le trajet
SOS_APP = (291.0, 12.0, 373.8, 55.8)                                   # la pastille SOS de l'écran « Souffler » (gauche, haut, droite, bas)
JVD = 22                                                               # images de la plongée vers la goutte, à la première note
# Le film écrit lui-même « Inspirez » et « Expirez », dans la police de l'application, pour qu'ils restent lisibles pendant que le cadre plonge vers la goutte.
#   Vertical et Instagram : le mot part de la place où l'application l'écrit, puis il descend se poser sous la goutte (hauteur MOT). Horizontal : il est écrit en haut de l'image.
MOT = {'V': 1440.0, 'I': 1174.0, 'H': 150.0}
MOT_E = {'V': 3.31, 'I': 2.7693, 'H': 2.51}                             # l'échelle du mot écrit par le film (pour V et I : celle du cadre posé, le mot a donc exactement la taille de celui de l'application)
_MOT_JS = json.load(open(ICI + '/titres/mot.json'))
MOT_IMG = (195.0 * _MOT_JS['dsf'], (_MOT_JS['Inspirez']['y'] + _MOT_JS['Inspirez']['h'] / 2) * _MOT_JS['dsf'])   # le milieu du mot dans son image (titres/mot.js)
# Mesuré sur l'encre des lettres : le haut de l'image du mot correspond à la hauteur 376,0 de l'écran de l'application (même largeur, même taille, au point près).
MOT_APP = 376.0 + MOT_IMG[1] / _MOT_JS['dsf']                          # le milieu du grand mot sur l'écran de l'application, en points
def _fixe(c0, c1, e):
    """Entre deux cadres, un vrai zoom : un point de l'écran reste à la même place dans l'image. Rend la hauteur visée pour l'échelle e."""
    p = (c1[1] * c1[2] - c0[1] * c0[2]) / (c1[2] - c0[2]); return p - (p - c0[1]) * c0[2] / e
def cadre_s7(jj, f):
    """Le cadre à l'instant jj du plan (point de l'écran visé, échelle).
    1. De l'appui à l'image JG, le cadre quitte la ligne touchée et vient se poser : départ et arrivée très doux. Il descend d'abord, puis glisse vers la droite.
    2. Il ne bouge plus du tout jusqu'à la première note (image JN) : on lit « Installez-vous » et sa phrase.
    3. À la première note l'application écrit « Inspirez » : le cadre plonge vers la goutte, puis avance à peine jusqu'à la fin de l'expiration."""
    c0, c1, c2 = CADRE[f]['por'], CADRE[f]['mot'], CADRE[f]['goutte']
    a2 = float(lisse5(jj, JN, JN + JVD))
    if a2 <= 0:
        ay = float(lisse5(jj, 0, JGY)); ax = float(lisse5(jj, JGX[f], JG))
        e = float(np.exp(np.log(c0[2]) * (1 - ax) + np.log(c1[2]) * ax)); cx = c0[0] * (1 - ax) + c1[0] * ax; cy = c0[1] * (1 - ay) + c1[1] * ay
        return cx, cy, e
    e = float(np.exp(np.log(c1[2]) * (1 - a2) + np.log(c2[2]) * a2)); cy = _fixe(c1, c2, e)
    b = float(lisse(jj, JN + JVD * .7, N7 + 30))
    return 195.0, cy, e * (1 + (CADRE[f]['fin'] / c2[2] - 1) * b)
def mot_y(jj, f):
    """Vertical et Instagram : la hauteur du mot écrit par le film. D'abord là où l'application l'écrit, puis il descend se poser sous la goutte pendant la plongée."""
    c1 = CADRE[f]['mot']; y0 = FORMATS[f][1] / 2 + (MOT_APP - c1[1]) * c1[2]
    return y0 + (MOT[f] - y0) * float(lisse5(jj, JN, JN + JVD))
_mot = {}
def mot_app(nom):
    if nom not in _mot:
        x = cv2.imread('%s/titres/mot-%s.png' % (ICI, nom), cv2.IMREAD_UNCHANGED).astype(np.float32) / 255; a = x[..., 3:]
        _mot[nom] = np.dstack([x[..., :3] * a, a])                      # la couleur déjà multipliée par l'opacité
    return _mot[nom]
_pose = {}
def calque_mot(nom, f, y):
    """Le grand mot de l'application, centré en largeur, son milieu à la hauteur y de l'image. Rend (couleur multipliée, opacité)."""
    k = (nom, f, round(y, 2))
    if k not in _pose:
        if len(_pose) > 12: _pose.pop(next(iter(_pose)))
        W, H = FORMATS[f]; s = MOT_E[f] / DSF
        src = cv2.GaussianBlur(mot_app(nom), (0, 0), max(.35, .42 / s - .08))      # le même adoucissement que pour l'écran filmé
        M = np.array([[s, 0, W / 2 - MOT_IMG[0] * s], [0, s, y - MOT_IMG[1] * s]], np.float64)
        c = cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        _pose[k] = (c[..., :3], c[..., 3:])
    return _pose[k]
def pose_mot(img, nom, f, y, presence=1.0):
    if presence <= .003: return img
    c, a = calque_mot(nom, f, y); return img * (1 - a * np.float32(presence)) + c * np.float32(presence)

def ecran_s7(j, f):
    """L'écran de l'application à l'image j du plan. Jusqu'à la première note rien n'y bouge (« Installez-vous »). Ensuite une image de la capture par image du film."""
    if j < JN: return ui('app', C_SOUFFLE0 + 11)
    c = min(C_INSPIREZ + (j - JN), C_FIN)                               # après la fin de l'expiration, la goutte reste posée (377 serait l'inspiration suivante)
    if f == 'H': return ui('app', c)                                    # horizontal : l'écran garde son mot, qui sort par le bas pendant la plongée
    if f == 'V': return ui('app-sm', c)                                 # vertical : le mot est caché (c'est le film qui l'écrit), la phrase sort par le bas pendant la plongée
    k = float(lisse(j, JN + 1, JN + 8))                                 # Instagram : le cadre reste plus large, alors les boutons et la phrase s'effacent vite pour ne laisser que l'étang
    if k <= 0: return ui('app-sm', c)
    if k >= 1: return ui('app-ig', c)
    return ui('app-sm', c) * np.float32(1 - k) + ui('app-ig', c) * np.float32(k)

def image_s7(j, f, dj=0.0):
    """dj : fraction d'image ajoutée à l'instant de la caméra et de l'onde. Le montage en moyenne plusieurs pendant les mouvements, pour un vrai flou de mouvement."""
    global _dist
    u = ecran_s7(j, f); W, H = FORMATS[f]; R = 16; jj = j + dj
    if jj <= R + 1:                                                                       # l'onde : un cercle qui grandit depuis le doigt
        if _dist is None:
            hh, ww = u.shape[:2]; yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32); _dist = np.sqrt((xx / DSF - DOIGT[0]) ** 2 + (yy / DSF - DOIGT[1]) ** 2)
        r = 1080 * float(lisse5(jj / R)) ** 1.15
        m = (1 - lisse(_dist, r - 26, r + 26)).astype(np.float32)[..., None]
        bord = (np.exp(-((_dist - r) / 30) ** 2) * .22 * (1 - jj / (R + 1))).astype(np.float32)[..., None]
        u = accueil_net() * (1 - m) + u * m + bord * np.float32([.82, .95, 1.0])
    cx, cy, e = cadre_s7(jj, f)
    img, M = appareil(u, f, cx, cy, e, 844, chaleur=1.5)
    p = 1 - float(lisse(j, 3, 11)); img = doigt(img, M, e, DOIGT[0], DOIGT[1], p, 1 - float(lisse(j, 0, 5)), rayon=17, force=.8)
    return img

if __name__ == '__main__':
    f = sys.argv[1]; W, H = FORMATS[f]
    t = [finition_ui(image_s2(i, f), i, f) for i in (20, 60, 70, 90, 110, 121, 125, 137)] + [finition_ui(image_s6(i, f), i, f) for i in (0, 30, 53)] + [finition_ui(image_s7(j, f), j, f) for j in (4, 9, 16, 28, 100, JN, JN + 11, JN + 60, N7 - 1)]
    k = (384, 216) if f == 'H' else (216, 384)
    t = [cv2.resize(np.clip(x, 0, 1), k, interpolation=cv2.INTER_AREA) for x in t]
    c = 5 if f == 'H' else 10
    while len(t) % c: t.append(np.zeros_like(t[0]))
    cv2.imwrite(ICI + '/tmp/ecran-%s.jpg' % f, (np.vstack([np.hstack(t[k:k + c]) for k in range(0, len(t), c)]) * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 86])
