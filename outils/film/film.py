# « Et vous ? » : outils de réalisation communs à tous les plans (caméra sur une image, grain, lumière, écriture des plans en MP4).
import numpy as np, cv2, subprocess, os
IPS = 30
FORMATS = {'H': (1920, 1080), 'V': (1080, 1920)}
ICI = os.path.dirname(os.path.abspath(__file__))

def lisse(x, a=0.0, b=1.0):
    t = np.clip((np.asarray(x, dtype=np.float64) - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

def lisse5(x, a=0.0, b=1.0):          # départ et arrivée encore plus doux
    t = np.clip((np.asarray(x, dtype=np.float64) - a) / (b - a), 0, 1); return t * t * t * (t * (6 * t - 15) + 10)

def camera(img, cx, cy, ax, ay, ech, W, H, sy=1.0, flou=0.0):
    """Regarde l'image (float32) de façon que le point (cx, cy) arrive en (ax, ay) de l'écran, à l'échelle ech (points d'écran par point d'image). sy : étirement vertical."""
    if flou > 0.05: img = cv2.GaussianBlur(img, (0, 0), flou)
    M = np.array([[ech, 0, ax - cx * ech], [0, ech * sy, ay - cy * ech * sy]], np.float64)
    return cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)

_vig = {}
def vignette(W, H, force=.22, rayon=.75):
    k = (W, H, force, rayon)
    if k not in _vig:
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / np.sqrt(2)
        _vig[k] = (1 - force * lisse(d, rayon * .55, 1.0).astype(np.float32))[..., None]
    return _vig[k]

def grain(img, n, force=.022, graine=7):
    """Un grain de pellicule fin, différent à chaque image, un peu plus présent dans les tons moyens."""
    H, W = img.shape[:2]
    g = np.random.default_rng(graine * 100003 + n).standard_normal((H, W), dtype=np.float32)
    g = cv2.GaussianBlur(g, (0, 0), .7) * 1.6
    lum = img.mean(axis=2)
    poids = (.35 + 1.3 * np.clip(lum, 0, 1) * (1 - np.clip(lum, 0, 1)) * 2.2)
    return img + (g * poids * force)[..., None]

class Plan:
    """Écrit un plan dans un fichier MP4 (mêmes réglages pour tous les plans, pour pouvoir les joindre sans les recoder)."""
    def __init__(self, chemin, W, H, crf=15):
        self.chemin, self.tmp = chemin, chemin[:-4] + '.tmp.mp4'
        self.p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', '%dx%d' % (W, H), '-r', str(IPS), '-i', '-',
            '-c:v', 'libx264', '-preset', 'medium', '-crf', str(crf), '-pix_fmt', 'yuv420p', '-g', str(IPS), '-bf', '2',
            '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-movflags', '+faststart', '-video_track_timescale', '15360', self.tmp], stdin=subprocess.PIPE)
        self.n = 0
    def image(self, img):
        self.p.stdin.write((np.clip(img, 0, 1) * 255 + .5).astype(np.uint8).tobytes()); self.n += 1
    def fin(self):
        self.p.stdin.close(); c = self.p.wait()
        if c != 0: raise SystemExit('ffmpeg a échoué pour ' + self.chemin)
        os.replace(self.tmp, self.chemin); return self.n


def export(image_mp4, son_wav, sortie, crf=20, debit_max='9M'):
    """L'export final : une seule compression, pensée pour le site et pour l'iPhone (H.264 profil haut, son AAC, lecture possible avant la fin du chargement)."""
    tmp = sortie[:-4] + '.tmp.mp4'
    c = ['ffmpeg', '-y', '-loglevel', 'error', '-i', image_mp4] + (['-i', son_wav] if son_wav else []) + ['-map', '0:v'] + (['-map', '1:a'] if son_wav else []) + [
        '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-maxrate', debit_max, '-bufsize', '18M', '-profile:v', 'high', '-level', '4.2', '-pix_fmt', 'yuv420p', '-g', '60', '-bf', '2',
        '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv'] + (['-c:a', 'aac', '-b:a', '192k', '-ar', '48000'] if son_wav else []) + ['-movflags', '+faststart', tmp]
    subprocess.run(c, check=True); os.replace(tmp, sortie)
