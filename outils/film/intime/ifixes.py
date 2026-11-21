# Montage intime : les cadres tirés des photos d'Antonio (agrandies 4 fois). Plans fixes (calculés une fois, gardés dans fixe/), voyages de cadre (vertical) et zooms lents.
# Les cadres sont donnés en points de la photo d'origine : (gauche, haut, largeur). Photos 1 à 3 : 1254 × 1254. Photos 4 (la fiche tendue) et 6 (les 2 mains) : 1536 × 1024.
import numpy as np, cv2, os, sys
ICI_ = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(ICI_)
FORMATS = {'H': (1920, 1080), 'V': (1080, 1920), 'I': (1080, 1920)}
CADRES = {
  # photo 1 : les dominos
  'tablette':  (1, {'V': (0, 667, 330), 'H': (0, 804, 800), 'I': (0, 600, 368)}),
  'entre':     (1, {'V': (225, 0, 705), 'H': (0, 549, 1254), 'I': (225, 0, 705)}),          # entre eux, les dominos
  'pere':      (1, {'V': (105, 20, 470), 'H': (60, 190, 640), 'I': (95, -60, 490)}),
  'fille':     (1, {'V': (640, 130, 470), 'H': (560, 230, 640), 'I': (630, 50, 490)}),
  'mainfille': (1, {'V': (455, 620, 357), 'H': (330, 800, 620), 'I': (455, 620, 357)}),      # sa main près des dominos (le raccord avec la main de Bastien)
  # photo 2 : Bastien écrit, sa mère à côté de lui
  'bastien':   (2, {'V': (60, 20, 560), 'H': (0, 105, 800), 'I': (40, 0, 600)}),             # Bastien, à hauteur de regard
  # photo 4 : il tend la feuille pliée à Rémi (horizontal : tout d'un coup)
  'remise':    (4, {'H': (170, 55, 1280)}),
  # photo 6 : ses 2 mains à plat, le téléphone éteint, le verre (horizontal : tout d'un coup)
  'mains':     (6, {'H': (0, 110, 1536)}),
}
# Les cadres qui bougent : (photo, {format: (cadre de départ, cadre d'arrivée)})
MOUVEMENTS = {
  'main-bastien': (2, {'V': ((496, 340, 220), (275, 0, 705)), 'H': ((410, 447, 400), (0, 70, 1254)), 'I': ((496, 340, 220), (275, 0, 705))}),   # de sa main sur le stylo à lui et sa mère
  'cafe':         (3, {'V': ((200, 0, 705), (290, 22, 540)), 'H': ((0, 60, 1254), (40, 75, 1040)), 'I': ((150, 0, 705), (260, 20, 560))}),       # le café du dimanche : on s'approche très lentement
  'remise':       (4, {'V': ((330, 0, 576), (760, 0, 576)), 'I': ((330, 0, 576), (760, 0, 576))}),                                              # vertical : de Bastien, qui donne, à Rémi, qui reçoit
  'mains':        (6, {'V': ((230, 0, 576), (770, 0, 576)), 'I': ((230, 0, 576), (770, 0, 576))}),                                              # vertical : d'une main à l'autre, par-dessus le téléphone
}
_pl = {}
def plaque(n):
    """La photo n agrandie 4 fois, et ses réductions (1/2, 1/4), pour tirer un cadre net à n'importe quelle échelle."""
    if n not in _pl:
        P = cv2.imread('%s/plates/photo%dx4.png' % (FILM, n)); niv = [P]
        for k in range(2): niv.append(cv2.resize(niv[-1], (niv[-1].shape[1] // 2, niv[-1].shape[0] // 2), interpolation=cv2.INTER_AREA))
        _pl[n] = niv
    return _pl[n]
def tire(n, f, x0, y0, w):
    """Le cadre (x0, y0, w) de la photo n, à la taille de la sortie du format f. Image en nombres de 0 à 1."""
    W, H = FORMATS[f]; niv = plaque(n); s = W / (w * 4.0)                  # points de sortie par point de la photo agrandie
    k = 0
    while k < len(niv) - 1 and s * (2 ** (k + 1)) <= 1.0: k += 1          # la réduction la plus proche au-dessus de l'échelle voulue
    sk = s * (2 ** k); P = niv[k]
    M = np.array([[sk, 0, -x0 * 4 * s], [0, sk, -y0 * 4 * s]], np.float64)
    src = cv2.GaussianBlur(P, (0, 0), max(0.01, .5 / sk - .45)) if sk < .9 else P
    return cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_LINEAR if sk <= 1 else cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT_101).astype(np.float32) / 255
_m = {}
def fixe(nom, f):
    """Le plan fixe « nom » au format f, calculé une fois et gardé."""
    k = (nom, f)
    if k in _m: return _m[k]
    c = '%s/fixe/%s-%s.png' % (ICI_, nom, f)
    if not os.path.exists(c):
        n, cad = CADRES[nom]; x0, y0, w = cad[f]; cv2.imwrite(c, np.clip(tire(n, f, x0, y0, w) * 255 + .5, 0, 255).astype(np.uint8))
    _m[k] = cv2.imread(c).astype(np.float32) / 255
    return _m[k]
def lisse5(t): t = min(1.0, max(0.0, t)); return t * t * t * (t * (t * 6 - 15) + 10)
def cadre_de(nom, f, t):
    """Le cadre du mouvement « nom » à l'avancement t (0 à 1). Un zoom garde un point fixe, un voyage glisse à largeur constante."""
    n, mv = MOUVEMENTS[nom]; (xa, ya, wa), (xb, yb, wb) = mv[f]
    if abs(wa - wb) < 1e-6: return n, xa + (xb - xa) * t, ya + (yb - ya) * t, wa
    w = float(np.exp(np.log(wa) * (1 - t) + np.log(wb) * t)); u = (w - wa) / (wb - wa)
    return n, xa + (xb - xa) * u, ya + (yb - ya) * u, w
_bande = {}
def voyage(nom, f, t, dt=0.0, K=5):
    """Un cadre qui glisse à largeur constante (photo réduite une fois à l'échelle de la sortie, puis déplacée). dt : l'avancement parcouru pendant une image,
    pour le flou de mouvement (plusieurs instants fondus dans une image)."""
    n, mv = MOUVEMENTS[nom]; (xa, ya, wa), (xb, yb, wb) = mv[f]; W, H = FORMATS[f]; s = W / wa
    k = (nom, f)
    if k not in _bande:
        P = plaque(n)[0]; h4, w4 = P.shape[:2]; x0 = min(xa, xb); x1 = max(xa, xb) + wa; y0 = min(ya, yb); hh = wa * H / W; y1 = max(ya, yb) + hh
        zone = P[int(y0 * 4):int(np.ceil(y1 * 4)), int(x0 * 4):int(np.ceil(x1 * 4))]
        sk = s / 4.0; src = cv2.GaussianBlur(zone, (0, 0), max(0.01, .5 / sk - .45)) if sk < .9 else zone
        _bande[k] = (cv2.resize(src, (int(round(zone.shape[1] * sk)), int(round(zone.shape[0] * sk))), interpolation=cv2.INTER_AREA).astype(np.float32) / 255, x0, y0)
    B, x0, y0 = _bande[k]
    def une(tt):
        x = (xa + (xb - xa) * tt - x0) * s; y = (ya + (yb - ya) * tt - y0) * s
        return cv2.warpAffine(B, np.float64([[1, 0, -x], [0, 1, -y]]), (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT_101)
    if abs(dt) * abs(xb - xa + yb - ya) * s < .6: return une(t)
    acc = None
    for j in range(K):
        im = une(t + dt * (j / K - .5) * .5); acc = im if acc is None else acc + im                    # obturateur à moitié ouvert
    return acc / K
def zoom(nom, f, t):
    n, x, y, w = cadre_de(nom, f, t); return tire(n, f, x, y, w)
if __name__ == '__main__':
    quoi = sys.argv[1:] or list(CADRES)
    for nom in quoi:
        for f in CADRES[nom][1]:
            c = '%s/fixe/%s-%s.png' % (ICI_, nom, f)
            if os.path.exists(c): os.remove(c)
            x = fixe(nom, f); print(nom, f, x.shape, flush=True)
