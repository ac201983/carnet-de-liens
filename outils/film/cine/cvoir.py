# Planche de contrôle : python3 cvoir.py <V|H|I> <sortie.jpg> <hauteur d'une vignette> plan:i,i,i plan:i …   (images finies, sans grain)
import sys, numpy as np, cv2
import cmontage as Mo
f, out, h = sys.argv[1], sys.argv[2], int(sys.argv[3]); W, H = Mo.FORMATS[f]; ims = []
for a in sys.argv[4:]:
    nom, li = a.split(':')
    for i in li.split(','):
        x = Mo.image(nom, int(i), f, grain_f=0); x = (np.clip(x, 0, 1) * 255).astype(np.uint8); x = cv2.resize(x, (int(h * W / H), h), interpolation=cv2.INTER_AREA)
        if f == 'I': cv2.rectangle(x, (int(65 * h / H), int(269 * h / H)), (int(1015 * h / H), int(1248 * h / H)), (0, 255, 255), 1)
        cv2.putText(x, '%s %s' % (nom, i), (6, 18), cv2.FONT_HERSHEY_SIMPLEX, .5, (0, 255, 255), 1, cv2.LINE_AA); ims.append(x)
cv2.imwrite(out, np.hstack(ims), [cv2.IMWRITE_JPEG_QUALITY, 86]); print(out, len(ims))
