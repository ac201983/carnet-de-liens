# Planche de contrôle : des images choisies du montage (avant l'encodage), côte à côte. python3 ivoir.py <V|H|I> <sortie.jpg> <largeur d'une vignette> plan:image plan:image …
import sys, numpy as np, cv2
import imontage as MO
f = sys.argv[1]; dst = sys.argv[2]; L = int(sys.argv[3]); out = []
for q in sys.argv[4:]:
    nom, i = q.split(':'); i = int(i)
    if i < 0: i = MO.D[nom] + i
    x = MO.image(nom, i, f); x = (np.clip(x, 0, 1) * 255).astype(np.uint8); h = int(round(x.shape[0] * L / x.shape[1])); x = cv2.resize(x, (L, h), interpolation=cv2.INTER_AREA)
    cv2.putText(x, '%s:%d (%.1f s)' % (nom, i, (MO.DEBUT[nom] + i) / 30.0), (8, 22), cv2.FONT_HERSHEY_SIMPLEX, .6, (0, 0, 0), 4); cv2.putText(x, '%s:%d (%.1f s)' % (nom, i, (MO.DEBUT[nom] + i) / 30.0), (8, 22), cv2.FONT_HERSHEY_SIMPLEX, .6, (255, 255, 255), 1)
    out.append(x)
cv2.imwrite(dst, np.hstack(out), [cv2.IMWRITE_JPEG_QUALITY, 84]); print(dst, np.hstack(out).shape)
