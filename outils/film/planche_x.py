# Une planche d'images du montage, recadrées : python3 planche_x.py <H|V|I> <sortie.jpg> <x0,y0,x1,y1> <largeur d'une vignette> <colonnes> nom:i nom:i ...
import sys, numpy as np, cv2, montage
from film import *
f = sys.argv[1]; x0, y0, x1, y1 = [int(v) for v in sys.argv[3].split(',')]; lw = int(sys.argv[4]); c = int(sys.argv[5]); t = []
for a in sys.argv[6:]:
    nom, i = a.split(':'); im = np.clip(montage.image(nom, int(i), f), 0, 1)[y0:y1, x0:x1]
    v = (cv2.resize(im, (lw, int(round(lw * im.shape[0] / im.shape[1]))), interpolation=cv2.INTER_AREA) * 255).astype(np.uint8)
    cv2.putText(v, a, (8, 22), cv2.FONT_HERSHEY_SIMPLEX, .6, (0, 0, 0), 3, cv2.LINE_AA); cv2.putText(v, a, (8, 22), cv2.FONT_HERSHEY_SIMPLEX, .6, (255, 255, 255), 1, cv2.LINE_AA); t.append(v)
while len(t) % c: t.append(np.zeros_like(t[0]))
cv2.imwrite(sys.argv[2], np.vstack([np.hstack(t[j:j + c]) for j in range(0, len(t), c)]), [cv2.IMWRITE_JPEG_QUALITY, 88])
