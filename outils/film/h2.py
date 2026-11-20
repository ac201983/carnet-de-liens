# Version 2 : ce script va avec ecran.py et montage.py de la version 2 (20 novembre 2026, 7 h). Dans la version 3, le film horizontal a ce cadre en 2 temps d'office,
# et ce script ne sert plus : il reste ici pour l'histoire. Le film qu'il a produit est gardé sous le nom et-vous-horizontal-version-2.mp4.
# Proposition H2 : le film horizontal avec la même correction que le vertical à l'entrée de « Souffler » (le cadre en 2 temps).
# Rien n'est écrasé : le plan refait va dans out/H2/s7.mp4, les autres plans sont ceux de out/H/, et le film sort dans out/H2/et-vous-horizontal.mp4.
# python3 h2.py [planche]   (« planche » : seulement une planche d'images de l'entrée, dans tmp/zoom/h2.jpg)
import sys, os, subprocess, time, numpy as np, cv2
import ecran; ecran.H2 = True
import montage, film
from film import *
f = 'H'; W, H = FORMATS[f]; out = ICI + '/out/H2'; os.makedirs(out, exist_ok=True)
if sys.argv[1:] == ['planche']:
    t = []
    for j in (0, 3, 6, 9, 12, 20, 28, 29, 33, 37, 40, 44, 48, 52, 60, 160):
        im = np.clip(montage.image('s7', j, f), 0, 1); v = (cv2.resize(im, (480, 270), interpolation=cv2.INTER_AREA) * 255).astype(np.uint8)
        cv2.putText(v, 's7:%d' % j, (8, 22), cv2.FONT_HERSHEY_SIMPLEX, .6, (0, 0, 0), 3, cv2.LINE_AA); cv2.putText(v, 's7:%d' % j, (8, 22), cv2.FONT_HERSHEY_SIMPLEX, .6, (255, 255, 255), 1, cv2.LINE_AA); t.append(v)
    cv2.imwrite(ICI + '/tmp/zoom/h2.jpg', np.vstack([np.hstack(t[k:k + 4]) for k in range(0, len(t), 4)]), [cv2.IMWRITE_JPEG_QUALITY, 88]); sys.exit(0)
t0 = time.time(); p = Plan(out + '/s7.mp4', W, H, crf=14)
for i in range(ecran.N7): p.image(montage.image('s7', i, f))
print('s7', p.fin(), 'images,', round(time.time() - t0), 's', flush=True)
with open(out + '/liste.txt', 'w') as l:
    for nom, k in montage.PLANS: l.write("file '%s/%s.mp4'\n" % (out if nom == 's7' else ICI + '/out/H', nom))
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', out + '/liste.txt', '-c', 'copy', out + '/image.tmp.mp4'], check=True); os.replace(out + '/image.tmp.mp4', out + '/image.mp4')
film.export(out + '/image.mp4', ICI + '/tmp/film.wav', out + '/et-vous-horizontal.mp4', 21, '8M')
print('film', os.path.getsize(out + '/et-vous-horizontal.mp4'), 'octets,', round(time.time() - t0), 's')
