# Outils communs pour animer les cercles d'eau d'une photo : on sépare ce qui est « cercle » (cohérent autour du centre) du reste de l'image,
# on obtient une eau calme, puis on fait voyager les cercles vers l'extérieur.
import numpy as np, cv2
from scipy.optimize import minimize
from scipy.ndimage import gaussian_filter1d, grey_opening

def grille(cx, cy, a, R, nt, nr):
    th = np.linspace(0, 2 * np.pi, nt, endpoint=False).astype(np.float32); rr = np.linspace(0, R, nr).astype(np.float32)
    cx, cy, a = float(cx), float(cy), float(a)
    X = cx + rr[None, :] * np.cos(th[:, None]); Y = cy + a * rr[None, :] * np.sin(th[:, None])
    return X.astype(np.float32), Y.astype(np.float32)

def polaire(img, cx, cy, a, R, nt, nr):
    X, Y = grille(cx, cy, a, R, nt, nr)
    return cv2.remap(img, X, Y, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)

def coherence(p, L, R, r0):
    cx, cy, a = p
    P = polaire(L, cx, cy, a, R, 360, int(R))
    G = P - gaussian_filter1d(P, 9, axis=1, mode='nearest')
    m = G.mean(axis=0)[int(r0):]
    return -float(np.var(m))

def ajuste(L, p0, R, r0=12):
    r = minimize(coherence, p0, args=(L, R, r0), method='Nelder-Mead', options={'xatol': .05, 'fatol': 1e-9, 'maxiter': 400})
    return r.x, -r.fun

def lisse(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

class Eau:
    """Sépare les cercles d'une photo d'eau (détail radial, entre r_in et r_out autour du centre) et sait les redessiner décalés de u pixels vers l'extérieur.
    Toutes les mesures sont en pixels de l'image donnée. a = aplatissement des cercles (hauteur / largeur)."""
    def __init__(self, img, cx, cy, a, r_in, r_out, R, sigma, bord=24, pas_t=1.4, poids=None, mediane=61):
        cx, cy, a, R = float(cx), float(cy), float(a), float(R)
        self.img = img.astype(np.float32); self.cx, self.cy, self.a, self.R = cx, cy, a, R
        nr = int(R) + 1; nt = int(2 * np.pi * R / pas_t); self.nr, self.nt = nr, nt
        P = polaire(self.img, cx, cy, a, R, nt, nr)
        bas = gaussian_filter1d(P, sigma, axis=1, mode='nearest')
        # Un cercle s'étend le long de l'arc ; une poussière ou une feuille posée sur l'eau, non. On ne garde que ce qui s'étend le long de l'arc : les poussières restent à leur place, dans l'eau calme.
        det = P - bas
        if mediane:                                                              # « ouverture » le long de l'arc : ne garde que ce qui dure au moins `mediane` pas d'angle, en clair comme en sombre
            k = (mediane, 1, 1)
            det = grey_opening(np.maximum(det, 0), size=k, mode='wrap') - grey_opening(np.maximum(-det, 0), size=k, mode='wrap')
            det = gaussian_filter1d(det, mediane / 6.0, axis=0, mode='wrap')
        r = np.arange(nr, dtype=np.float32)
        M = lisse(r, r_in - bord, r_in) * (1 - lisse(r, r_out, r_out + bord))
        if poids is not None: M = M * poids(r)                              # pour donner à un cercle trop discret la même présence que ses voisins
        M0 = lisse(r, r_in - bord, r_in) * (1 - lisse(r, r_out, r_out + bord))
        D0 = det * M0[None, :, None]
        D = det * M[None, :, None]
        PADT = 8; self.PADT = PADT
        self.D = np.concatenate([D[-PADT:], D, D[:PADT]], axis=0)          # raccord de l'angle 0 et de l'angle 2π
        D0 = np.concatenate([D0[-PADT:], D0, D0[:PADT]], axis=0)
        h, w = img.shape[:2]
        x0, x1 = int(max(0, cx - R)), int(min(w, cx + R + 1)); y0, y1 = int(max(0, cy - a * R)), int(min(h, cy + a * R + 1))
        self.zone = (x0, y0, x1, y1)
        yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
        dx, dy = xx - cx, (yy - cy) / a
        self.rho = np.sqrt(dx * dx + dy * dy).astype(np.float32)
        th = np.arctan2(dy, dx); th[th < 0] += 2 * np.pi
        self.ti = (th / (2 * np.pi) * nt + PADT).astype(np.float32)
        self.calme = self.img.copy()
        self.calme[y0:y1, x0:x1] -= cv2.remap(D0, self.rho, self.ti, cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=0)

    def vue(self, u, gain=None):
        """Image entière avec les cercles décalés de u vers l'extérieur. gain(rho) : force des cercles selon le rayon d'arrivée (tableau de la taille de la zone)."""
        x0, y0, x1, y1 = self.zone
        d = cv2.remap(self.D, self.rho - np.float32(u), self.ti, cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        if gain is not None: d *= gain[..., None]
        out = self.calme.copy(); out[y0:y1, x0:x1] += d
        return out
