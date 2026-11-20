# Les plans fixes tirés des 3 photos d'Antonio (agrandies 4 fois) : un cadre par plan et par format, calculé une fois et gardé (fixe/…png).
# V et I : 1080 × 1920. H : 1920 × 1080. Les cadres sont donnés en points de la photo d'origine (1254 × 1254) : (gauche, haut, largeur).
import numpy as np, cv2, os, sys
ICI_ = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(ICI_)
FORMATS = {'H': (1920, 1080), 'V': (1080, 1920), 'I': (1080, 1920)}
MARGE = 1.0                                # les plans sont fixes : l'image est calculée à la taille exacte de la sortie
CADRES = {
  # photo 1 : les dominos
  'tablette': (1, {'V': (0, 667, 330), 'H': (0, 804, 800), 'I': (0, 600, 368)}),
  'domino':   (1, {'V': (470, 667, 330), 'H': (384, 950, 480), 'I': (455, 770, 345)}),
  'pere':     (1, {'V': (105, 20, 470), 'H': (60, 190, 640), 'I': (95, -60, 490)}),
  'fille':    (1, {'V': (640, 130, 470), 'H': (560, 230, 640), 'I': (630, 50, 490)}),
  # photo 2 : Bastien écrit, sa mère à côté de lui
  'bastien':  (2, {'V': (60, 20, 560), 'H': (0, 100, 1254), 'I': (40, 0, 600)}),
  # photo 3 : le café du dimanche
  'cafe':     (3, {'V': (200, 0, 705), 'H': (0, 60, 1254), 'I': (150, 0, 705)}),
}
_m = {}
def fixe(nom, f):
    """Le plan fixe « nom » au format f : image (nombres de 0 à 1), à la taille de la sortie."""
    k = (nom, f)
    if k in _m: return _m[k]
    c = '%s/fixe/%s-%s.png' % (ICI_, nom, f)
    if not os.path.exists(c):
        n, cad = CADRES[nom]; x0, y0, w = cad[f]; W, H = FORMATS[f]; h = w * H / W
        P = cv2.imread('%s/plates/photo%dx4.png' % (FILM, n)); s = W / (w * 4.0)                      # points de sortie par point de la photo agrandie
        manque = int(np.ceil((y0 + h) * 4 - P.shape[0]))
        if manque > 0:                                                                                # le cadre descend sous la photo (bande-annonce) : le bois du bas est prolongé, en miroir, de plus en plus doux
            b_ = 200; bande = P[-b_:].astype(np.float32); k = int(np.ceil(manque / b_)) + 1; m = np.vstack([bande[::-1] if j % 2 == 0 else bande for j in range(k)])[:manque + 8]
            doux = cv2.GaussianBlur(m, (0, 0), 40); r = np.clip(np.arange(len(m), dtype=np.float32) / 260, 0, 1)[:, None, None]
            P = np.vstack([P, np.clip(m * (1 - r) + doux * r, 0, 255).astype(np.uint8)])
        M = np.array([[s, 0, -x0 * 4 * s], [0, s, -y0 * 4 * s]], np.float64)
        src = cv2.GaussianBlur(P, (0, 0), max(0.01, .5 / s - .45)) if s < .9 else P
        img = cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT_101)
        cv2.imwrite(c, img); del P
    _m[k] = cv2.imread(c).astype(np.float32) / 255
    return _m[k]
if __name__ == '__main__':
    quoi = sys.argv[1:] or list(CADRES)
    for nom in quoi:
        for f in ('V', 'H', 'I'):
            c = '%s/fixe/%s-%s.png' % (ICI_, nom, f)
            if os.path.exists(c): os.remove(c)
            x = fixe(nom, f); print(nom, f, x.shape, flush=True)
