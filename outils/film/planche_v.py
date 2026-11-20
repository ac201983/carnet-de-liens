# Une planche d'images du montage à taille réduite : python3 planche_v.py <H|V> <sortie.jpg> nom:i nom:i ...
import sys, numpy as np, cv2, montage
from film import *
f = sys.argv[1]; W, H = FORMATS[f]; k = (480, 270) if f == 'H' else (360, 640); t = []
for a in sys.argv[3:]:
    nom, i = a.split(':'); im = np.clip(montage.image(nom, int(i), f), 0, 1)
    v = (cv2.resize(im, k, interpolation=cv2.INTER_AREA) * 255).astype(np.uint8)
    cv2.putText(v, a, (8, 22), cv2.FONT_HERSHEY_SIMPLEX, .6, (0, 0, 0), 3, cv2.LINE_AA); cv2.putText(v, a, (8, 22), cv2.FONT_HERSHEY_SIMPLEX, .6, (255, 255, 255), 1, cv2.LINE_AA); t.append(v)
c = 4 if f == 'H' else 6
while len(t) % c: t.append(np.zeros_like(t[0]))
cv2.imwrite(sys.argv[2], np.vstack([np.hstack(t[j:j + c]) for j in range(0, len(t), c)]), [cv2.IMWRITE_JPEG_QUALITY, 88])
