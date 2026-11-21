# Les bruits du montage intime. Aucun enregistrement : d'ici, aucune banque de sons n'est joignable. Chaque bruit est calculé à partir de ce qui le produit vraiment.
# La vibration, le domino, le papier et la tasse viennent du montage cinématographique (cine/bruits.py). Ce fichier ajoute le grésillement du boîtier contre le bois,
# le café qu'on verse, la tasse qu'on soulève et l'ambiance d'un dimanche matin (la pièce, des oiseaux derrière la fenêtre).
import numpy as np, sys, os
INT_ = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(INT_); sys.path[:0] = [FILM + '/cine', FILM]
import son as S
import bruits as B
SR = S.SR; n_ = S.n_

def vibreur(graine=1, duree=.235, f0=172.0, force=1.0, gresille=.5):
    """Une vibration brève, le téléphone posé à plat sur le chêne, avec le petit grésillement du boîtier contre le bois : à chaque tour du moteur le téléphone
    retombe, et un tour sur 2 ou 3 son bord accroche le bois une seconde fois, un rien plus tard. C'est ce second contact, sec et aigu, qui grésille."""
    x = B.vibreur(graine, duree, f0, 1.0); n = len(x); t = np.arange(n) / SR; rng = np.random.default_rng(100 + graine)
    vit = np.where(t < duree, 1 - np.exp(-t / .017), (1 - np.exp(-duree / .017)) * np.exp(-(t - duree) / .048)); ph = 2 * np.pi * np.cumsum(f0 * vit) / SR
    idx = np.nonzero(np.diff(np.floor(ph / (2 * np.pi))) > 0)[0]; g = np.zeros(n)
    for i in idx:
        v = vit[i] ** 2
        if v < .12 or rng.random() > .62: continue
        j = i + n_(rng.uniform(.0011, .0029)); L = n_(rng.uniform(.0006, .0014))
        if j + L >= n: continue
        g[j:j + L] += v * rng.uniform(.5, 1.0) * rng.standard_normal(L) * np.exp(-np.arange(L) / (L * .4))
    g = B.modes(S.filtre(g, 'band', (2300, 7500)), ((2950, .0016, 1.0), (4300, .0011, .7), (6100, .0008, .4))) if np.abs(g).max() > 0 else g
    y = x + gresille * g / max(1e-9, np.abs(g).max())
    return force * y / np.abs(y).max()

def verse(graine=5, duree=2.5):
    """Du café qu'on verse dans une tasse en grès : le filet tombe (un bruit d'eau), la tasse se remplit et sa résonance monte, des bulles éclatent. Le filet s'amincit et s'arrête."""
    rng = np.random.default_rng(graine); n = n_(duree + .5); t = np.arange(n) / SR; u = np.clip(t / duree, 0, 1)
    debit = S.lisse(t, 0, .16) * (1 - S.lisse(t, duree - .42, duree)) * (1 + .22 * S.filtre(rng.standard_normal(n), 'low', 7) / .04).clip(.55, 1.5)
    filet = S.filtre(rng.standard_normal(n), 'band', (900, 5200)) * debit                               # le filet et les éclaboussures
    # la résonance de la tasse : elle monte à mesure que la tasse se remplit (de 420 à 780 Hz), en 2 bandes qui se suivent
    res = np.zeros(n); b = rng.standard_normal(n + 4800); L = n_(.10); pas = L // 2; fen = np.hanning(L)
    for k in range(0, n - L, pas):
        f = 420 + 360 * min(1.0, (k / SR) / duree) ** 1.15
        res[k:k + L] += S.filtre(b[k:k + L + 2400], 'band', (f * .82, f * 1.22))[1200:1200 + L] * fen
    res *= debit
    bulles = np.zeros(n)                                                                                # les bulles : de petites notes très courtes, qui glissent vers l'aigu
    for _ in range(int(95 * duree)):
        d = rng.uniform(.05, duree - .1); L = n_(rng.uniform(.006, .022)); tt = np.arange(L) / SR; f0 = rng.uniform(380, 1900) * (1 + .5 * d / duree)
        i = n_(d)
        if i + L < n: bulles[i:i + L] += rng.uniform(.3, 1.0) * debit[i] * np.sin(2 * np.pi * f0 * tt * (1 + 2.2 * tt / max(tt[-1], 1e-6) * .12)) * np.exp(-tt / (L / SR * .32)) * np.hanning(L) ** .5
    y = .55 * filet / np.abs(filet).max() + .8 * res / max(1e-9, np.abs(res).max()) + .65 * bulles / max(1e-9, np.abs(bulles).max())
    for d in (duree + .10, duree + .27):                                                                # 2 dernières gouttes
        L = n_(.03); tt = np.arange(L) / SR; i = n_(d)
        if i + L < n: y[i:i + L] += .28 * np.sin(2 * np.pi * (900 + 500 * tt / .03) * tt) * np.exp(-tt / .008)
    y = S.filtre(y, 'high', 180)
    return y / np.abs(y).max()

def tasse_levee(graine=23):
    """La tasse en grès qu'on soulève de la table : un frottement très court sur le bois, et la tasse qui tinte à peine."""
    rng = np.random.default_rng(graine); dur = .7; n = n_(dur); t = np.arange(n) / SR
    frot = S.filtre(rng.standard_normal(n), 'band', (500, 2600)) * S.lisse(t, 0, .02) * np.exp(-t / .05)
    v = np.zeros(n)
    for rap, tau, a in ((1.0, .12, 1.0), (2.14, .06, .4), (3.46, .035, .18)): v += a * np.exp(-t / tau) * np.sin(2 * np.pi * 1240.0 * rap * t)
    v *= S.lisse(t, .012, .016)
    y = .5 * frot / np.abs(frot).max() + .5 * v / np.abs(v).max()
    return y / np.abs(y).max()

def oiseaux(duree, graine=9):
    """Des oiseaux, dehors, derrière la fenêtre fermée : 2 voix, des phrases courtes et espacées. Étouffés par la vitre, loin."""
    rng = np.random.default_rng(graine); n = n_(duree); y = np.zeros(n)
    def note(t0, f_a, f_b, d, force, trem=0.0):
        L = n_(d); tt = np.arange(L) / SR; f = f_a + (f_b - f_a) * (tt / d) ** .7; ph = 2 * np.pi * np.cumsum(f) / SR
        env = np.hanning(L) ** .8 * (1 + trem * np.sin(2 * np.pi * 38 * tt)); i = n_(t0)
        if 0 <= i and i + L < n: y[i:i + L] += force * env * (np.sin(ph) + .22 * np.sin(2 * ph))
    t = 1.2
    while t < duree - 1.0:                                                                              # première voix : 3 à 5 notes qui descendent un peu (une mésange)
        k = int(rng.integers(3, 6)); f = rng.uniform(3600, 4300); a = rng.uniform(.5, 1.0)
        for j in range(k): note(t + j * rng.uniform(.13, .16), f * (1.08 if j % 2 == 0 else .93), f * (1.0 if j % 2 == 0 else .88), rng.uniform(.06, .09), a * (1 - .08 * j))
        t += rng.uniform(2.6, 4.4)
    t = 2.7
    while t < duree - 1.0:                                                                              # seconde voix, plus grave et plus loin : 2 sifflements liés (un merle, au loin)
        f = rng.uniform(1900, 2500); note(t, f, f * 1.18, .22, .5, .12); note(t + .27, f * 1.22, f * .96, .30, .45, .12)
        t += rng.uniform(4.5, 7.0)
    y = S.filtre(S.filtre(y, 'low', 4600), 'high', 1500)                                                # la vitre
    return y / max(1e-9, np.abs(y).max())

def matin(rng, duree):
    """La pièce, un dimanche matin : presque rien. Un souffle d'air large, sans le ronflement de la cuisine du soir."""
    n = n_(duree); a = S.filtre(rng.standard_normal((n, 2)), 'band', (140, 2400)) * .5 + S.filtre(rng.standard_normal((n, 2)), 'band', (2400, 7000)) * .12
    lent = (1 + .25 * S.filtre(rng.standard_normal(n), 'low', 1.0) / .016).clip(.6, 1.5)[:, None]
    return a * lent / np.abs(a).max()

def tape(rng, force=1.0, espace=False):
    """Un doigt qui tape sur l'écran du téléphone : le petit choc mat de la pulpe du doigt sur le verre, et le claquement léger du boîtier.
    C'est le tapotement du film « Et vous ? » (un souffle très court entre 1 700 et 4 600 Hz, sur un choc grave), avec un peu plus de corps dans le médium,
    pour qu'il passe dans le haut-parleur d'un téléphone. La barre d'espace sonne un peu plus bas."""
    n = n_(.06); t = np.arange(n) / SR; k = .82 if espace else 1.0
    clic = S.filtre(rng.standard_normal(n), 'band', (1700 * k, 4600 * k)) * np.exp(-t / .0045)
    grave = .5 * np.sin(2 * np.pi * rng.uniform(170, 210) * k * t) * np.exp(-t / .008)
    corps = .30 * np.sin(2 * np.pi * rng.uniform(520, 640) * k * t + rng.uniform(0, 1)) * np.exp(-t / .0055)
    fin = S.filtre(rng.standard_normal(n), 'band', (4500, 7500)) * np.exp(-t / .0022); fin = .32 * fin / np.abs(fin).max()      # l'ongle : ce qui reste net sous la musique
    x = (clic / np.abs(clic).max() + grave + corps + fin) * S.lisse(t, 0, .0006)
    return x / np.abs(x).max() * force
