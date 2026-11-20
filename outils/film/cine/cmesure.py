# Ce qu'on peut mesurer dans un film exporté, faute de pouvoir l'écouter : l'instant de chaque son, et l'image où le pouce appuie sur Envoyer.
# python3 cmesure.py <film.mp4> [film|ba]
import sys, os, subprocess, json, numpy as np
ICI = os.path.dirname(os.path.abspath(__file__)); sys.path[:0] = [ICI, os.path.dirname(ICI)]
from scipy.signal import butter, sosfilt
SR = 48000
def son(fichier):
    p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', fichier, '-vn', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True); return np.frombuffer(p.stdout, np.float32).astype(np.float64)
def bande(x, a, b):
    from scipy.signal import sosfiltfilt                                # filtre sans retard : il ne décale pas l'instant mesuré
    return sosfiltfilt(butter(3, [a / (SR / 2), b / (SR / 2)], btype='band', output='sos'), x)
def debut(x, t0, t1, fa, fb, lisse_ms=3):
    """L'instant où un son commence dans la bande (fa, fb), entre t0 et t1 : là où son niveau monte le plus vite (on compare les 10 ms d'après aux 10 ms d'avant),
    puis on remonte jusqu'au pied de cette montée (le quart du chemin entre le niveau d'avant et celui d'après)."""
    a, b = int((t0 - .05) * SR), int((t1 + .05) * SR); a = max(a, 0); y = np.abs(bande(x[a:b], fa, fb)); k = max(1, int(SR * lisse_ms / 1000)); e = np.convolve(y, np.ones(k) / k, mode='same')
    d = int(.010 * SR); c = np.cumsum(np.concatenate([[0.0], e])); moy = lambda i0, i1: (c[i1] - c[i0]) / (i1 - i0)
    i0, i1 = int((t0 * SR) - a), int((t1 * SR) - a); meilleur, im = -1, i0
    for i in range(max(i0, d), min(i1, len(e) - d), 24):
        m = moy(i, i + d) - moy(i - d, i)
        if m > meilleur: meilleur, im = m, i
    av, ap = moy(max(0, im - d), im), moy(im, im + d); seuil = av + .25 * (ap - av); i = im
    while i > im - d and e[i] > seuil: i -= 1
    return (a + i) / SR, 20 * np.log10(ap + 1e-9)
def images(fichier, n0, n1, zone):
    """Les images n0 à n1 du film (une zone seulement : gauche, haut, largeur, hauteur)."""
    x, y, w, h = zone
    p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', fichier, '-vf', "select='between(n\\,%d\\,%d)',crop=%d:%d:%d:%d" % (n0, n1, w, h, x, y), '-vsync', '0', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, h, w).astype(np.float64)
if __name__ == '__main__':
    f = sys.argv[1]; quoi = sys.argv[2] if len(sys.argv) > 2 else 'film'; x = son(f); dur = len(x) / SR
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height,nb_frames,r_frame_rate', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip().split(','); W, H, N = int(r[0]), int(r[1]), int(r[3])
    if quoi == 'film':
        import ctemps as CT; I = lambda im: im / 30.0
        ev = [('vibration 1', I(CT.VIB1), 120, 3000), ('vibration 2', I(CT.VIB2), 120, 3000), ('note 1 (fa dièse)', I(CT.MOTIF_A[0]), 350, 390), ('note 2 (la)', I(CT.MOTIF_A[1]), 425, 455), ('note 3 (mi)', I(CT.MOTIF_A[2]), 318, 342),
              ('pulsation (1er battement)', I(CT.BATT_A[0]), 130, 600), ('domino', I(CT.DOMINO), 250, 2000), ('papier', I(CT.PAPIER[0]) - .05, 2500, 8000), ('tasse', I(CT.TASSE), 1000, 4000),
              ('note 1 de la fin', I(CT.MOTIF_E[0]), 350, 390), ('note 2 de la fin', I(CT.MOTIF_E[1]), 425, 455), ('note 3 de la fin', I(CT.MOTIF_E[2]), 318, 342), ('la 4e note (ré)', I(CT.ENVOI), 575, 600)]
        envoi = CT.ENVOI
    else:
        import cba as BA; I = lambda im: im / 30.0
        ev = [('vibration 1', I(BA.VIB[0]), 120, 3000), ('vibration 2', I(BA.VIB[1]), 120, 3000), ('note 1 (fa dièse)', I(BA.MOTIF_1[0]), 350, 390), ('domino', I(BA.DOMINO), 250, 2000), ('tasse', I(BA.TASSE), 1000, 4000), ('la 4e note (ré)', I(BA.ENVOI), 575, 600)]
        envoi = BA.ENVOI
    print('%s : %d × %d, %d images, son de %.3f s' % (os.path.basename(f), W, H, N, dur))
    print('avant la vibration (de 0 à %.2f s) : %.1f dB' % (ev[0][1] - .03, 20 * np.log10(np.sqrt((x[:int((ev[0][1] - .03) * SR)] ** 2).mean()) + 1e-9)))
    res = {}
    for nom, t, fa, fb in ev:
        d, niv = debut(x, t - .10, t + .15, fa, fb); res[nom] = d; print('%-28s prévu %8.3f s | mesuré %8.3f s | écart %+5.0f ms' % (nom, t, d, (d - t) * 1000))
    # l'image où le bouton d'envoi change (le pouce appuie) : on compare chaque image à la précédente, dans la zone du bouton
    if W < H: zone = (int(W * .80), int(H * .50), int(W * .2) // 2 * 2, int(H * .12) // 2 * 2)
    else: zone = (1400, 700, 140, 140)                                  # film horizontal : le bouton d'envoi est là (le fil est plus près)
    im = images(f, envoi - 8, envoi + 8, zone); dif = [float(np.abs(im[k + 1] - im[k]).mean()) for k in range(len(im) - 1)]
    k = int(np.argmax(dif)); print('le bouton d’envoi change le plus entre les images', envoi - 8 + k, 'et', envoi - 8 + k + 1, '(écarts', ' '.join('%.1f' % d for d in dif) + ')')
    t_img = (envoi - 8 + k + 1) / 30.0; t_son = res['la 4e note (ré)']
    print('envoi : image %d (%.3f s) | la 4e note commence à %.3f s | la note arrive %+.0f ms après l’image' % (envoi - 8 + k + 1, t_img, t_son, (t_son - t_img) * 1000))
