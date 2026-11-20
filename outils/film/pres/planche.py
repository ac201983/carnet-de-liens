# Une planche d'images du film, pour régler les cadres : python3 planche.py <V|H|I> <sortie.jpg> plan:image plan:image …
import sys, numpy as np, cv2
import plans
from pm import *
def image(nom, i, f):
    p = getattr(plans, nom)
    if nom == 'g2': return p(i, f, plans.g1(plans.N['g1'] - 1, f)[0])
    r = plans.filme(p, i, f) if hasattr(p, 'cles') else p(i, f)
    return r[0] if isinstance(r, tuple) else r
if __name__ == '__main__':
    f = sys.argv[1]; out = sys.argv[2]; W, H = FORMATS[f]; k = (384, 216) if f == 'H' else (270, 480); t = []
    for a in sys.argv[3:]:
        nom, i = a.split(':'); i = float(i); img = cv2.resize(np.clip(image(nom, i, f), 0, 1), k, interpolation=cv2.INTER_AREA)
        img = (img * 255).astype(np.uint8); cv2.putText(img, a, (6, 16), cv2.FONT_HERSHEY_SIMPLEX, .45, (0, 255, 255), 1, cv2.LINE_AA)
        if f == 'I': cv2.rectangle(img, (int(65 * k[0] / W), int(269 * k[1] / H)), (int(1015 * k[0] / W), int(1248 * k[1] / H)), (0, 200, 255), 1)
        t.append(img)
    c = 5 if f == 'H' else 8
    while len(t) % c: t.append(np.zeros_like(t[0]))
    cv2.imwrite(out, np.vstack([np.hstack(t[j:j + c]) for j in range(0, len(t), c)]), [cv2.IMWRITE_JPEG_QUALITY, 84]); print(out, len(t))
