# Les plans de la cuisine : les 2 images du haut de la planche d'Antonio, agrandies, avec une caméra lente et la lumière du téléphone.
import numpy as np, cv2, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from film import *

_p = {}
def planche(n):
    if n not in _p:
        P = cv2.imread(ICI + '/plates/p%dx4.png' % n).astype(np.float32) / 255
        if n in (1, 2): P[:6] = P[6:7]                                              # le liseré sombre du haut de la planche, remplacé par la ligne voisine
        _p[n] = P
    return _p[n]

# --- l'écran du téléphone posé sur la table (image 1) : ses 4 coins, tels que les lit la personne assise à gauche -------------------------
QUAD = np.float32([[1712, 1288], [2040, 1375], [985, 1592], [590, 1452]])       # haut-gauche, haut-droite, bas-droite, bas-gauche
_ec = {}
def _prepare_ecran(nom, contenu):
    """Projette une image d'écran (portrait) sur le téléphone posé à plat, avec ses coins arrondis. Rend (image projetée, présence) à la taille de l'image 1."""
    if nom in _ec: return _ec[nom]
    P = planche(1); H, W = P.shape[:2]; h, w = contenu.shape[:2]
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), QUAD)
    a = np.zeros((h, w), np.float32); r = int(w * .11); cv2.rectangle(a, (r, 0), (w - r, h), 1, -1); cv2.rectangle(a, (0, r), (w, h - r), 1, -1)
    for cx, cy in ((r, r), (w - r, r), (w - r, h - r), (r, h - r)): cv2.circle(a, (cx, cy), r, 1, -1, cv2.LINE_AA)
    x0, y0, x1, y1 = 540, 1240, 2100, 1640
    T = np.array([[1, 0, -x0], [0, 1, -y0], [0, 0, 1]], np.float64) @ M
    flou = cv2.GaussianBlur(contenu, (0, 0), 2.2)                                   # vu de très près du plan de la table, l'écran est écrasé : on adoucit avant de projeter
    c = cv2.warpPerspective(flou, T, (x1 - x0, y1 - y0), flags=cv2.INTER_AREA)
    m = cv2.GaussianBlur(cv2.warpPerspective(a, T, (x1 - x0, y1 - y0), flags=cv2.INTER_LINEAR), (0, 0), 1.6)
    # la lueur que l'écran allumé pose autour de lui : sur le bois tout près, sous les doigts, sur le pied du verre
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    g = np.exp(-(((xx - 1330) / 620) ** 2 + ((yy - 1420) / 250) ** 2)) * .55 + np.exp(-(((xx - 1430) / 420) ** 2 + ((yy - 1215) / 120) ** 2)) * .8
    g *= lisse(yy, 930, 1120).astype(np.float32)
    coul = np.float32([float(v) for v in cv2.resize(contenu, (1, 1), interpolation=cv2.INTER_AREA)[0, 0]]); coul = coul / max(coul.max(), 1e-3)
    _ec[nom] = (c, m[..., None], (x0, y0, x1, y1), g[..., None], coul)
    return _ec[nom]

def avec_ecran(nom, contenu, force):
    """L'image 1 avec le téléphone allumé (force de 0 à 1)."""
    P = planche(1)
    if force <= 0.001: return P
    c, m, (x0, y0, x1, y1), g, coul = _prepare_ecran(nom, contenu)
    out = P + g * (coul * np.float32([.95, .97, 1.0])) * np.float32(.085 * force)
    zone = out[y0:y1, x0:x1]
    allume = c * .92 + zone * .42                                                    # l'écran éclaire, et il garde un peu des reflets de la lampe et de la main
    out[y0:y1, x0:x1] = zone * (1 - m * force) + allume * (m * force)
    return out

def cadre(img, f, cx, cy, z, flou_h=0.0):
    """Cadre l'image entière (z = 1 : elle remplit juste l'écran en hauteur), centrée sur (cx, cy). flou_h : flou de filé horizontal, en points d'écran."""
    W, H = FORMATS[f]; f0 = H / img.shape[0]; e = f0 * z
    # on ne sort jamais de l'image
    dx, dy = W / 2 / e, H / 2 / e
    cx = float(np.clip(cx, dx, img.shape[1] - dx)); cy = float(np.clip(cy, dy, img.shape[0] - dy))
    out = camera(img, cx, cy, W / 2, H / 2, e, W, H, flou=max(0, .5 / e - .45))
    if flou_h > 1.2: out = cv2.blur(out, (int(flou_h) | 1, 1))
    return out

# --- les plans ----------------------------------------------------------------------------------------------------------------------
T1, T3, T6A, T8 = 1.2, 1.6, .8, 3.2
def allumage(t, t0=.3, d=.14): return float(lisse(t, t0, t0 + d))
def image_s1(t, f, ecran):
    """Le téléphone s'éclaire près du verre."""
    img = avec_ecran('verrou', ecran, allumage(t))
    a = float(lisse5(t, -.4, T1 + .5))
    if f == 'H': return cadre(img, f, 1658 - 150 * a, 930 + 70 * a, 1.03 + .07 * a)
    return cadre(img, f, 1850 - 60 * a, 930, 1.02 + .05 * a)
def image_s3(t, f):
    """Le téléphone est retourné. La main est allée au verre."""
    img = planche(2); a = float(lisse5(t, -.2, T3 + .3))
    if f == 'H': return cadre(img, f, 1656 + 120 * a, 930 - 30 * a, 1.03 + .05 * a)
    b = float(lisse5(t, .12, T3 + .25)); v = (float(lisse5(t + 1 / IPS, .12, T3 + .25)) - b) * 640 * (FORMATS[f][1] / img.shape[0])
    return cadre(img, f, 1120 + 640 * b, 930, 1.0, flou_h=abs(v) * .5)
def image_s6a(t, f, ecran):
    """Retour à la table : le téléphone est de nouveau allumé, sur l'accueil."""
    img = avec_ecran('accueil', ecran, allumage(t, .0, .01)); a = float(lisse(t, -.1, T6A + .25))
    if f == 'H': return cadre(img, f, 1560 - 180 * a, 1010 + 150 * a, 1.1 + .32 * a)
    return cadre(img, f, 1600 - 120 * a, 930 + 40 * a, 1.04 + .16 * a)
HAUT_V = 360
def planche_haute():
    """L'image 2 avec un peu plus de fond au-dessus du verre, pour le format vertical : le haut de l'image (le fond flou de la cuisine) est prolongé en miroir, adouci et assombri.
    Le verre et la main tiennent alors en entier dans l'image, et la phrase de la signature trouve une place calme au-dessus du verre."""
    if 'haute' not in _p:
        P = planche(2); m = P[:HAUT_V][::-1]
        doux = cv2.GaussianBlur(m, (0, 0), 30); r = lisse(np.arange(HAUT_V, dtype=np.float32)[::-1], 0, 90)[:, None, None]      # 0 au raccord avec l'image, 1 plus haut
        y = np.linspace(1, 0, HAUT_V, dtype=np.float32)[:, None, None]                                                          # 1 tout en haut
        ajout = (m * (1 - r) + doux * r) * (1 - .30 * lisse(y, .1, 1.0))
        _p['haute'] = np.vstack([ajout.astype(np.float32), P])
    return _p['haute']
def image_s8(t, f):
    """La main repose autour du verre."""
    a = float(lisse5(t, -.5, T8 + .6))
    if f == 'H': return cadre(planche(2), f, 1700 + 60 * a, 915, 1.06 + .05 * a)
    return cadre(planche_haute(), f, 1960 + 20 * a, 1110, 1.0 + .035 * a)
