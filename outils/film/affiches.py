# Les images du lecteur et de la commande de l'accueil, tirées des films exportés : la première image de chaque film (l'affiche, montrée avant la lecture),
# et la petite image d'aperçu de la commande « Voir le film » (le téléphone qui s'éclaire, dans le film horizontal).
# python3 affiches.py <dossier des films> <dossier de sortie>
import sys, subprocess, numpy as np, cv2
src, out = sys.argv[1], sys.argv[2]
def image(fichier, t, W, H):
    p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', str(t), '-i', fichier, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(H, W, 3)
v = image(src + '/et-vous-vertical.mp4', 0, 1080, 1920); h = image(src + '/et-vous-horizontal.mp4', 0, 1920, 1080); a = image(src + '/et-vous-horizontal.mp4', .6, 1920, 1080)
cv2.imwrite(out + '/affiche-verticale.webp', cv2.resize(v, (720, 1280), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_WEBP_QUALITY, 72])
cv2.imwrite(out + '/affiche-horizontale.webp', cv2.resize(h, (1280, 720), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_WEBP_QUALITY, 72])
cv2.imwrite(out + '/apercu.webp', cv2.resize(a, (336, 189), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_WEBP_QUALITY, 74])
import os
print({f: os.path.getsize(out + '/' + f) for f in ('affiche-verticale.webp', 'affiche-horizontale.webp', 'apercu.webp')})
