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
# Horizontal : on voit le titre entier et les 3 portes, puis la goutte sur toute la largeur de l'écran, sous la barre du haut.
CADRE = {'V': dict(acc0=(195, 346.6, 2.7693), acc=(195, 346.6, 2.84), goutte=(195, 236.5, 5.5), fin=5.62),
         'H': dict(acc0=(195, 391, 2.03), acc=(195, 391, 2.077), goutte=(195, 172, 4.93), fin=5.1)}
def image_s6(i, f):
    u = ui('app', 20); c0, c1 = CADRE[f]['acc0'], CADRE[f]['acc']; a = i / N6
    e = float(np.exp(np.log(c0[2]) * (1 - a) + np.log(c1[2]) * a)); img, M = appareil(u, f, c1[0], c0[1] * (1 - a) + c1[1] * a, e, 844)
    # le doigt arrive par le bas à droite, se pose au-dessus de « Souffler 2 minutes », puis appuie
    p = float(lisse(i, 13, 23)); q = float(lisse5(i, 11, 31))
    return doigt(img, M, e, DOIGT[0] + 26 * (1 - q), DOIGT[1] + 54 * (1 - q), p, float(lisse(i, N6 - 3, N6)))

# --- « Souffler » : l'onde part du doigt et ouvre l'étang, puis une inspiration et une expiration -----------------------------------
_dist = None
JP = 42
def avance(j):
    """Le rapprochement vers la goutte : il part au toucher et se pose en douceur. À l'image 27 il est fait à 95 %, avant que l'application écrive « Inspirez »."""
    x = min(1.0, max(0.0, j / JP)); return 1 - (1 - x) ** 3
def image_s7(j, f, dj=0.0):
    """dj : fraction d'image ajoutée à l'instant de la caméra et de l'onde. Le montage en moyenne 4 pendant le rapprochement, pour un vrai flou de mouvement."""
    global _dist
    u = ui('app', min(C_SOUFFLE0 + j, 376)); W, H = FORMATS[f]; R = 16; jj = j + dj       # 377 : l'inspiration suivante, que le film ne montre pas
    if jj <= R + 1:                                                                       # l'onde : un cercle qui grandit depuis le doigt
        if _dist is None:
            hh, ww = u.shape[:2]; yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32); _dist = np.sqrt((xx / DSF - DOIGT[0]) ** 2 + (yy / DSF - DOIGT[1]) ** 2)
        r = 1080 * float(lisse5(jj / R)) ** 1.15
        m = (1 - lisse(_dist, r - 26, r + 26)).astype(np.float32)[..., None]
        bord = (np.exp(-((_dist - r) / 30) ** 2) * .22 * (1 - jj / (R + 1))).astype(np.float32)[..., None]
        u = ui('app', C_TOUCHER) * (1 - m) + u * m + bord * np.float32([.82, .95, 1.0])
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
