# Relecture des plans réellement encodés (out/<format>/<plan>.mp4 ou un film entier), en planche, à la taille d'un petit écran.
# python3 revue.py <V|H|I> <sortie.jpg> <hauteur d'une vignette> plan:image,image … (une image = son numéro dans le plan)
# python3 revue.py film <fichier.mp4> <sortie.jpg> <hauteur> <instant en secondes> …
import sys, os, subprocess, numpy as np, cv2
PRES = os.path.dirname(os.path.abspath(__file__))
def image(fichier, t):
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', fichier], capture_output=True, text=True).stdout.strip().split(',')
    W, H = int(r[0]), int(r[1])
    p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', '%.4f' % t, '-i', fichier, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(H, W, 3)
def image_n(fichier, n):
    """L'image numéro n du fichier, exactement (on décode depuis le début : pour des plans courts)."""
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', fichier], capture_output=True, text=True).stdout.strip().split(',')
    W, H = int(r[0]), int(r[1])
    p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', fichier, '-vf', "select=eq(n\\,%d)" % n, '-vsync', '0', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(H, W, 3)
ZONE = False
def zone_instagram(im):
    """Trace la partie de l'image qu'Instagram laisse libre (269 à 1248 en hauteur, 65 à 1015 en largeur) et le coin de ses boutons, en bas à droite."""
    im = im.copy(); cv2.rectangle(im, (65, 269), (1015, 1248), (0, 220, 255), 3); cv2.rectangle(im, (853, 1152), (1080, 1920), (0, 120, 255), 3); return im
def planche(vues, sortie, h, par_rang=None):
    """vues : liste de (légende, image)."""
    out = []
    for leg, im in vues:
        if ZONE: im = zone_instagram(im)
        w = int(round(im.shape[1] * h / im.shape[0])); v = cv2.resize(im, (w, h), interpolation=cv2.INTER_AREA)
        c = np.full((h + 30, w + 10, 3), 34, np.uint8); c[25:25 + h, 5:5 + w] = v
        cv2.putText(c, leg, (6, 17), cv2.FONT_HERSHEY_SIMPLEX, .47, (235, 235, 235), 1, cv2.LINE_AA); out.append(c)
    n = par_rang or max(1, int(2100 // out[0].shape[1])); rangs = []
    for k in range(0, len(out), n):
        r = out[k:k + n]; rangs.append(np.hstack(r))
    L = max(r.shape[1] for r in rangs); rangs = [np.pad(r, ((0, 0), (0, L - r.shape[1]), (0, 0)), constant_values=34) for r in rangs]
    cv2.imwrite(sortie, np.vstack(rangs), [cv2.IMWRITE_JPEG_QUALITY, 84]); print(sortie, np.vstack(rangs).shape)
if __name__ == '__main__':
    if sys.argv[1] in ('film', 'film-insta'):
        ZONE = sys.argv[1] == 'film-insta'
        f, sortie, h = sys.argv[2], sys.argv[3], int(sys.argv[4]); ts = [float(x) for x in sys.argv[5:]]
        planche([('%.1f s' % t, image(f, t)) for t in ts], sortie, h)
    else:
        q, sortie, h = sys.argv[1], sys.argv[2], int(sys.argv[3]); vues = []; ZONE = q == 'I'
        for a in sys.argv[4:]:
            plan, ks = a.split(':')
            for k in ks.split(','):
                vues.append(('%s %s' % (plan, k), image_n('%s/out/%s/%s.mp4' % (PRES, q, plan), int(k))))
        planche(vues, sortie, h)
