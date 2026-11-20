# Les bruits du montage cinématographique : la vibration du téléphone sur le bois, le domino, le papier, la tasse.
# Aucun enregistrement : d'ici, aucune banque de sons n'est joignable, et aucun enregistrement libre de droits n'a pu être téléchargé. Chaque bruit est donc calculé
# à partir de ce qui le produit vraiment (un petit moteur qui fait sauter le téléphone sur la table, une pièce qui touche le bois, une feuille qu'on tend, une tasse en grès).
# Si Antonio envoie un véritable enregistrement de son téléphone, il prend la place de vibreur() dans cmixage.py.
import numpy as np, sys, os
ICI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.dirname(ICI))
import son as S
SR = S.SR; n_ = S.n_

def modes(exc, liste):
    """Fait résonner une suite de chocs (exc) dans un objet : chaque mode est (fréquence Hz, durée d'extinction s, force)."""
    from scipy.signal import fftconvolve
    L = n_(max(t for _, t, _ in liste) * 7); t = np.arange(L) / SR; h = np.zeros(L)
    for f, tau, a in liste: h += a * np.exp(-t / tau) * np.sin(2 * np.pi * f * t)
    return fftconvolve(exc, h)[:len(exc)]

def vibreur(graine=1, duree=.235, f0=172.0, force=1.0):
    """Une impulsion du vibreur, le téléphone posé à plat sur une table en bois.
    Le petit moteur prend sa vitesse en 2 centièmes de seconde, tourne, puis ralentit. À chaque tour le téléphone décolle à peine et retombe : c'est ce choc répété,
    plus que le moteur lui-même, qu'on entend. La table lui répond dans le grave, la coque et le verre du téléphone dans l'aigu."""
    rng = np.random.default_rng(graine); n = n_(duree + .42); t = np.arange(n) / SR
    vit = np.where(t < duree, 1 - np.exp(-t / .017), (1 - np.exp(-duree / .017)) * np.exp(-(t - duree) / .048))       # la vitesse du moteur, de 0 à 1
    f = f0 * vit * (1 + .012 * np.sin(2 * np.pi * 9.3 * t + rng.uniform(0, 6))); ph = 2 * np.pi * np.cumsum(f) / SR
    tours = np.floor(ph / (2 * np.pi)); idx = np.nonzero(np.diff(tours) > 0)[0]                                       # un choc par tour
    exc = np.zeros(n); bruit = np.zeros(n)
    for k, i in enumerate(idx):
        v = vit[i] ** 2                                                                                               # la force qui fait sauter le téléphone grandit comme le carré de la vitesse
        if v < .05: continue
        a = v * (1 + .28 * rng.standard_normal()) * (1.0 if k % 2 == 0 else .82)                                      # un tour sur deux tape un peu moins fort : le téléphone ne retombe jamais 2 fois pareil
        j = i + int(rng.normal(0, 5)); j = min(max(j, 0), n - 40)
        exc[j:j + 12] += a * np.hanning(12)
        b = rng.standard_normal(n_(.0035)) * np.exp(-np.arange(n_(.0035)) / (SR * .0009)); bruit[j:j + len(b)] += a * b[:n - j]
    table = modes(exc, ((118, .030, 1.0), (203, .024, .85), (331, .017, .75), (512, .011, .62), (790, .0075, .5), (1210, .005, .42)))
    coque = modes(exc, ((1880, .0034, .5), (2650, .0026, .42), (3900, .0018, .26), (5200, .0012, .14)))
    moteur = (np.sin(ph) + .4 * np.sin(2 * ph + .7)) * vit ** 2                                                       # le ronflement du moteur lui-même, en dessous
    x = table / np.abs(table).max() + .46 * coque / np.abs(coque).max() + .16 * moteur + .22 * S.filtre(bruit, 'band', (1400, 6000)) / max(1e-9, np.abs(bruit).max())
    x = S.filtre(x, 'high', 70) * S.lisse(t, 0, .004)
    return force * x / np.abs(x).max()

def glisse(graine=3, duree=.30):
    """Le domino glisse sur le bois avant de s'arrêter : un frottement court et mat."""
    rng = np.random.default_rng(graine); n = n_(duree); t = np.arange(n) / SR
    g = S.filtre(rng.standard_normal(n), 'band', (700, 3800)) * (1 + .6 * S.filtre(rng.standard_normal(n), 'low', 45) / .1).clip(.2, 2.2)
    env = S.lisse(t, 0, duree * .35) * (1 - S.lisse(t, duree * .72, duree)) ** 1.5
    return g * env / np.abs(g).max()
def domino(graine=31):
    """Un domino posé sur une table en bois : un bord d'abord, puis la pièce à plat, 4 centièmes de seconde après. Petit, sec, mat."""
    rng = np.random.default_rng(graine); dur = .45; n = n_(dur); x = np.zeros(n); t = np.arange(n) / SR
    for d, a, m in ((0.0, .5, ((420, .014, 1.0), (760, .010, .55), (1280, .006, .3))), (.042, 1.0, ((300, .022, 1.0), (520, .016, .7), (880, .010, .4), (1500, .006, .2)))):
        c = S.choc_bois(rng, dur - d, modes=m, bruit=.6, fc_bruit=2600, tau_bruit=.005); x[n_(d):n_(d) + len(c)] += a * c[:n - n_(d)]
    x += .16 * S.filtre(rng.standard_normal(n), 'band', (2600, 6500)) * (np.exp(-t / .003) * .6 + np.exp(-np.maximum(0, t - .042) / .004) * (t >= .042))
    return x / np.abs(x).max()

def papier(graine=12, duree=1.25):
    """Une feuille qu'on tend : elle se soulève (un froissement), traverse l'air (un souffle), puis arrive dans l'autre main (un petit claquement mou et quelques craquements)."""
    rng = np.random.default_rng(graine); n = n_(duree + .25); t = np.arange(n) / SR; x = np.zeros(n)
    def craque(t0, t1, k, force):
        for _ in range(k):
            d = rng.uniform(t0, t1); L = n_(rng.uniform(.0012, .004)); c = rng.standard_normal(L) * np.exp(-np.arange(L) / (L * .35)); i = n_(d)
            if i + L < n: x[i:i + L] += force * rng.uniform(.3, 1.0) * c
    craque(.0, .22, 26, 1.0); craque(.22, duree - .22, 16, .3); craque(duree - .2, duree + .06, 18, .8)
    x = S.filtre(x, 'band', (1900, 9000))
    air = S.filtre(rng.standard_normal(n), 'band', (450, 2600)) * np.exp(-((t - duree * .52) / (duree * .26)) ** 2) * (1 + .5 * S.filtre(rng.standard_normal(n), 'low', 18) / .06).clip(.3, 2)
    mou = np.zeros(n); i = n_(duree - .04); L = n_(.09); tt = np.arange(L) / SR
    mou[i:i + L] = (np.sin(2 * np.pi * 190 * tt) * np.exp(-tt / .018) + .5 * np.sin(2 * np.pi * 330 * tt) * np.exp(-tt / .012)) * S.lisse(tt, 0, .002)
    y = x / np.abs(x).max() + .34 * air / np.abs(air).max() + .5 * mou
    return y / np.abs(y).max()

def tasse(graine=17):
    """Une tasse en grès qu'on repose sur le bois : le bois répond, la tasse tinte à peine (un son court, plus grave et plus mat qu'un verre)."""
    rng = np.random.default_rng(graine); dur = 1.1; n = n_(dur); t = np.arange(n) / SR
    bois = S.choc_bois(rng, dur, modes=((128, .050, 1.0), (214, .038, .7), (356, .022, .4), (560, .012, .18)), bruit=.5, fc_bruit=1100, tau_bruit=.011)[:n]
    clic = .15 * S.filtre(rng.standard_normal(n), 'band', (1800, 5200)) * np.exp(-t / .004)
    v = np.zeros(n)
    for rap, tau, a in ((1.0, .15, 1.0), (2.14, .08, .42), (3.46, .045, .2)): v += a * np.exp(-t / tau) * np.sin(2 * np.pi * 1180.0 * rap * t)
    v *= S.lisse(t, 0, .002)
    return bois * .6 + clic, v * .055
