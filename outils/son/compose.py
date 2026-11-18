# -*- coding: utf-8 -*-
"""L'ambiance sonore de l'étang, pour « Parent Écouté, Parent Éclairé ».

Création originale, entièrement calculée ici : aucun enregistrement, aucun échantillon, aucune musique existante.
  - etang   : 2 minutes d'étang au soir, calées sur la respiration de l'espace (4 s d'inspiration, 6 s d'expiration, 12 fois).
  - instant : 40 secondes de la même matière, pour rester avec la dose du jour.

Deux matières seulement : de l'eau (du bruit filtré, qui va et vient) et un piano feutré (des notes additives, attaque douce).
Le repère pour qui ferme les yeux :
  - l'eau avance pendant l'inspiration et se retire pendant l'expiration ;
  - 2 notes qui montent ouvrent l'inspiration, 1 note plus basse ouvre l'expiration, parfois suivie d'une note grave.
Usage : python3 compose.py etang|instant sortie.wav
"""
import sys, numpy as np
from scipy import signal as sg
from scipy.io import wavfile

SR = 44100
LEAD = 1.4            # l'exercice dit « Installez-vous » pendant 1,4 s avant la première inspiration
T_IN, T_OUT, N = 4.0, 6.0, 12
CYC = T_IN + T_OUT

def hz(m): return 440.0 * 2 ** ((m - 69) / 12.0)

def rc(n):  # demi-cosinus montant de 0 à 1
    return 0.5 - 0.5 * np.cos(np.pi * np.arange(n) / max(1, n))

# ------------------------------------------------------------------ le piano feutré
def note(midi, dur, vel, rng):
    """Une note : somme de partiels légèrement inharmoniques, 2 cordes à peine désaccordées, attaque douce, aigus très retenus."""
    f0 = hz(midi); n = int(SR * dur); t = np.arange(n) / SR
    B = 2.2e-4 * 2 ** ((midi - 60) / 16.0)            # inharmonicité, un peu plus forte dans l'aigu
    out = np.zeros(n)
    pente = 1.95 - 0.75 * vel                          # plus on joue doux, plus les aigus s'effacent : c'est le feutre
    if midi < 50: pente -= 0.35                        # les graves gardent des harmoniques, pour rester audibles sur un petit haut-parleur
    base = 2.5 * 2 ** (-(midi - 57) / 17.0)            # durée de la résonance : courte, comme un piano étouffé, un peu plus longue dans le grave
    det = 2 ** (0.35 / 1200.0)                         # 2 cordes à peine désaccordées : un battement très lent, jamais un vibrato
    for k in range(1, 40):
        fk = k * f0 * np.sqrt(1 + B * k * k)
        if fk > 5200: break
        amp = k ** (-pente) * (abs(np.sin(np.pi * k / 7.6)) ** 0.55 + 0.04)
        tau2 = base / (1 + 0.28 * (k - 1)); tau1 = 0.2 * tau2 + 0.03
        env = 0.62 * np.exp(-t / tau1) + 0.38 * np.exp(-t / tau2)
        p1 = rng.uniform(0, 2 * np.pi)                 # les 2 cordes partent ensemble, frappées par le même marteau
        out += amp * env * (0.70 * np.sin(2 * np.pi * fk * t + p1) + 0.30 * np.sin(2 * np.pi * fk * det * t + p1))
    a = int(SR * (0.016 + 0.010 * (1 - vel)))          # attaque : 16 à 26 ms, comme un marteau garni de feutre
    out[:a] *= rc(a)
    # le petit bruit mat du marteau, très bas
    m = int(SR * 0.09); b = rng.standard_normal(m) * np.exp(-np.arange(m) / (SR * 0.014))
    sos = sg.butter(2, [110, 520], btype='band', fs=SR, output='sos'); b = sg.sosfilt(sos, b)
    b[:int(SR * 0.004)] *= rc(int(SR * 0.004))
    out[:m] += 0.05 * b / (np.max(np.abs(b)) + 1e-9) * (0.6 + vel)
    r = int(SR * 0.35); out[-r:] *= rc(r)[::-1]        # fin de note sans coupure
    return out * (0.32 + 0.9 * vel)

def reverbe(rng, rt_bas=3.0, rt_med=2.5, rt_haut=1.3, dur=3.6):
    """La réponse d'une pièce calme : 3 bandes de bruit qui s'éteignent, les aigus plus vite. Deux tirages, pour la largeur."""
    n = int(SR * dur); t = np.arange(n) / SR
    def bande(lo, hi, rt):
        x = rng.standard_normal(n)
        if lo is None: sos = sg.butter(2, hi, btype='low', fs=SR, output='sos')
        elif hi is None: sos = sg.butter(2, lo, btype='high', fs=SR, output='sos')
        else: sos = sg.butter(2, [lo, hi], btype='band', fs=SR, output='sos')
        return sg.sosfilt(sos, x) * np.exp(-6.91 * t / rt)
    ir = bande(None, 350, rt_bas) * 0.8 + bande(350, 1800, rt_med) + bande(1800, 5200, rt_haut) * 0.5
    pre = int(SR * 0.022); ir = np.concatenate([np.zeros(pre), ir])[:n]
    ir[pre:pre + int(SR * 0.03)] *= rc(int(SR * 0.03))
    return ir / np.sqrt(np.sum(ir ** 2))

# ------------------------------------------------------------------ l'eau
def bruit_filtre(n, lo, hi, rng, ordre=2):
    x = rng.standard_normal(n)
    sos = sg.butter(ordre, [lo, hi], btype='band', fs=SR, output='sos')
    return sg.sosfilt(sos, x)

def lente(n, rng, f=0.12, prof=0.25):
    """Une variation lente et irrégulière autour de 1, pour que rien ne revienne à l'identique."""
    m = int(n / SR * f * 8) + 8
    pts = rng.standard_normal(m)
    x = np.interp(np.linspace(0, m - 1, n), np.arange(m), pts)
    sos = sg.butter(2, f * 2, btype='low', fs=SR, output='sos'); x = sg.sosfiltfilt(sos, x)
    x = x / (np.max(np.abs(x)) + 1e-9)
    return 1 + prof * x

def eau(n, rng, souffle=None):
    """Un fond d'eau calme, et par-dessus de petits clapotis irréguliers. « souffle » (0 à 1) fait avancer puis reculer l'eau."""
    L = np.zeros(n); R = np.zeros(n)
    # le fond : sombre et large
    for (lo, hi, g) in ((170, 620, 1.0), (520, 1500, 0.42), (1300, 3200, 0.10)):
        c = bruit_filtre(n, lo, hi, rng); a = bruit_filtre(n, lo, hi, rng); b = bruit_filtre(n, lo, hi, rng)
        L += g * (0.7 * c + 0.5 * a) * lente(n, rng, 0.09, 0.22)
        R += g * (0.7 * c + 0.5 * b) * lente(n, rng, 0.09, 0.22)
    fond = np.stack([L, R]); fond /= np.sqrt(np.mean(fond ** 2))
    # la part claire, qui ne s'entend que lorsque l'eau avance
    cl = np.stack([bruit_filtre(n, 900, 3800, rng), bruit_filtre(n, 900, 3800, rng)])
    cl = 0.75 * cl + 0.25 * cl[::-1]; cl /= np.sqrt(np.mean(cl ** 2))
    # les clapotis : de courts souffles d'eau, chacun avec sa hauteur et sa place
    clap = np.zeros((2, n)); bul = np.zeros((2, n)); t = 0.6
    while t < n / SR - 2.5:
        d = rng.uniform(0.55, 1.5); m = int(SR * d)
        fc = rng.uniform(330, 1150); q = rng.uniform(2.2, 4.5)
        x = rng.standard_normal(m)
        sos = sg.butter(2, [fc / (1 + 0.5 / q), fc * (1 + 0.5 / q)], btype='band', fs=SR, output='sos'); x = sg.sosfilt(sos, x)
        att = int(m * rng.uniform(0.18, 0.4)); env = np.concatenate([rc(att), np.exp(-np.arange(m - att) / ((m - att) / 3.2))])
        env[-int(SR * 0.05):] *= rc(int(SR * 0.05))[::-1]
        x = x * env; x /= (np.max(np.abs(x)) + 1e-9)
        g = rng.uniform(0.35, 1.0); pan = rng.uniform(0.15, 0.85); i = int(t * SR)
        clap[0, i:i + m] += g * np.cos(pan * np.pi / 2) * x; clap[1, i:i + m] += g * np.sin(pan * np.pi / 2) * x
        for _ in range(int(rng.integers(1, 6))):       # quelques bulles, jamais seules ni régulières
            db_ = rng.uniform(0.018, 0.05); mb = int(SR * db_); tb = np.arange(mb) / SR
            f1 = rng.uniform(480, 1500); f2 = f1 * rng.uniform(1.06, 1.24)
            ph = 2 * np.pi * (f1 * tb + (f2 - f1) * tb ** 2 / (2 * db_))
            y = np.sin(ph) * np.exp(-tb / rng.uniform(0.007, 0.016)); y[:int(SR * 0.003)] *= rc(int(SR * 0.003)); y[-int(SR * 0.004):] *= rc(int(SR * 0.004))[::-1]
            j = i + int(rng.uniform(0.1, 0.85) * m); gb = g * rng.uniform(0.3, 1.0); pb = float(np.clip(pan + rng.uniform(-0.15, 0.15), 0.05, 0.95))
            if j + mb < n: bul[0, j:j + mb] += gb * np.cos(pb * np.pi / 2) * y; bul[1, j:j + mb] += gb * np.sin(pb * np.pi / 2) * y
        t += rng.uniform(0.7, 2.6)
    clap /= (np.sqrt(np.mean(clap ** 2)) + 1e-9)
    sosb = sg.butter(2, 2600, btype='low', fs=SR, output='sos'); bul = sg.sosfilt(sosb, bul, axis=1)
    ir = np.exp(-np.arange(int(SR * 0.5)) / (SR * 0.09)) * rng.standard_normal(int(SR * 0.5)); ir /= np.sqrt(np.sum(ir ** 2))   # un peu d'air autour
    bul = bul + 0.5 * np.stack([sg.fftconvolve(bul[0], ir)[:n], sg.fftconvolve(bul[1], ir[::-1])[:n]])
    bul /= (np.max(np.abs(bul)) + 1e-9)
    if souffle is None: souffle = np.full(n, 0.45)
    niveau = 0.50 + 0.50 * souffle                       # l'eau avance : un peu plus présente
    clair = 0.05 + 0.50 * souffle ** 1.5                 # et un peu plus claire
    return fond * niveau + cl * (0.55 * clair * niveau) + clap * (0.50 * (0.55 + 0.45 * souffle)) + bul * (1.2 * (0.6 + 0.4 * souffle))

def courbe_souffle(n):
    """0 au creux, 1 en haut de l'inspiration. Monte en 4 s, redescend en 6 s, comme le cercle à l'écran."""
    t = np.arange(n) / SR - LEAD; s = np.zeros(n)
    u = np.mod(t, CYC); dans = (t >= 0) & (t < N * CYC)
    monte = 0.5 - 0.5 * np.cos(np.pi * u / T_IN); desc = 0.5 + 0.5 * np.cos(np.pi * (u - T_IN) / T_OUT)
    s[dans] = np.where(u[dans] < T_IN, monte[dans], desc[dans])
    return s

# ------------------------------------------------------------------ les deux morceaux
def poser(piste, x, t0, pan=0.5):
    i = int(round(t0 * SR)); m = min(len(x), piste.shape[1] - i)
    if m <= 0: return
    piste[0, i:i + m] += np.cos(pan * np.pi / 2) * x[:m]; piste[1, i:i + m] += np.sin(pan * np.pi / 2) * x[:m]

def etang(rng):
    dur = LEAD + N * CYC + 9.6; n = int(SR * dur)
    piano = np.zeros((2, n))
    # ré majeur. Pour chaque respiration : 2 notes qui montent (inspiration), 1 note qui redescend (expiration), parfois avec une basse.
    # Ensuite plus rien jusqu'à la respiration suivante : la note s'éteint, et il ne reste que l'eau.
    P = [  # (inspire 1, inspire 2, expire, basse ou None)
        (62, 66, 57, 38),   # ré        ré4 fa#4 | la3 + ré2
        (62, 67, 59, None), # sol/ré    ré4 sol4 | si3
        (59, 66, 62, None), # si mineur si3 fa#4 | ré4
        (59, 62, 55, 43),   # sol       si3 ré4  | sol3 + sol2
        (57, 66, 62, None), # ré/fa#    la3 fa#4 | ré4
        (55, 64, 59, 40),   # mi mineur sol3 mi4 | si3 + mi2
        (57, 64, 61, None), # la        la3 mi4  | do#4
        (59, 66, 62, 47),   # si mineur si3 fa#4 | ré4 + si2
        (62, 69, 62, None), # sol       ré4 la4  | ré4
        (59, 64, 55, 40),   # mi mineur si3 mi4  | sol3 + mi2
        (61, 64, 57, None), # la        do#4 mi4 | la3   (jamais 2 notes voisines d'un demi-ton qui sonnent ensemble)
        (62, 69, 66, 38),   # ré        ré4 la4  | fa#4 + ré2
    ]
    for k, (a, b, c, g) in enumerate(P):
        t0 = LEAD + k * CYC; dyn = 0.92 + 0.08 * np.sin(np.pi * k / (N - 1))   # un très léger arc sur les 2 minutes
        poser(piano, note(a, 7.0, 0.40 * dyn, rng), t0 + rng.uniform(-0.008, 0.008), 0.46)
        poser(piano, note(b, 7.0, 0.50 * dyn, rng), t0 + 2.0 + rng.uniform(-0.02, 0.02), 0.56)
        poser(piano, note(c, 8.0, 0.38 * dyn, rng), t0 + T_IN + rng.uniform(-0.008, 0.008), 0.50)
        if g is not None: poser(piano, note(g, 9.0, 0.25 * dyn, rng), t0 + T_IN + 0.14 + rng.uniform(-0.02, 0.02), 0.44)
    # la fin : l'exercice s'arrête, 3 notes de ré majeur se posent l'une après l'autre et s'éteignent
    tf = LEAD + N * CYC + 0.25
    for i, (m, v) in enumerate(((50, 0.36), (57, 0.34), (66, 0.32))): poser(piano, note(m, 9.0, v, rng), tf + 0.32 * i, 0.44 + 0.06 * i)
    s = courbe_souffle(n)
    return piano, eau(n, rng, s), n

def instant(rng):
    dur = 40.0; n = int(SR * dur)
    piano = np.zeros((2, n))
    M = [(2.2, 57, 0.38, None), (4.9, 62, 0.42, None), (7.6, 66, 0.46, None), (11.0, 64, 0.40, 45), (14.4, 62, 0.40, None), (17.6, 59, 0.38, 43), (21.2, 57, 0.36, None), (24.8, 62, 0.38, 38)]
    for (t, m, v, g) in M:
        poser(piano, note(m, 8.5, v, rng), t + rng.uniform(-0.02, 0.02), 0.5 + rng.uniform(-0.06, 0.06))
        if g is not None: poser(piano, note(g, 9.0, 0.25, rng), t + 0.16, 0.45)
    poser(piano, note(66, 9.0, 0.30, rng), 25.4, 0.56)
    # une seule vague lente : l'eau vient, puis se retire
    t = np.arange(n) / SR; s = np.clip(0.30 + 0.35 * np.sin(np.pi * np.clip(t / 30.0, 0, 1)) ** 2, 0, 1)
    return piano, eau(n, rng, s), n

def mixer(piano, water, n, rng, fin_eau, fin, niveau_piano=0.42):
    ir = [reverbe(rng), reverbe(rng)]
    wet = np.stack([sg.fftconvolve(piano[0], ir[0])[:n], sg.fftconvolve(piano[1], ir[1])[:n]])
    wet = 0.72 * wet + 0.28 * wet[::-1]
    p = piano + 0.42 * wet
    # le corps de l'instrument : un peu de chaleur vers 250 Hz, et des aigus adoucis
    sos = sg.butter(2, 3100, btype='low', fs=SR, output='sos'); p = sg.sosfilt(sos, p, axis=1)
    b, a = sg.iirpeak(260, 0.9, fs=SR); p = p + 0.16 * sg.lfilter(b, a, p, axis=1)
    # niveaux : le piano devant, l'eau juste derrière
    p /= np.percentile(np.abs(p), 99.9); p *= niveau_piano * 0.62   # réglé sur le niveau habituel des notes, pas sur une seule crête
    w = water * 0.026
    # l'eau s'en va en dernier, lentement
    t = np.arange(n) / SR
    w *= np.clip((fin - t) / (fin - fin_eau), 0, 1) ** 1.6
    mix = p + w
    mixer.p, mixer.w = p, w
    sos = sg.butter(2, 62, btype='high', fs=SR, output='sos'); mix = sg.sosfilt(sos, mix, axis=1)
    a = int(SR * 2.6); mix[:, :a] *= rc(a) ** 1.5       # l'entrée
    z = int(SR * 2.2); mix[:, -z:] *= (rc(z)[::-1]) ** 1.5; mix[:, -int(SR * 0.25):] = 0   # la sortie, puis un vrai silence
    return mix

if __name__ == '__main__':
    quoi, sortie = sys.argv[1], sys.argv[2]
    rng = np.random.default_rng(20261118 if quoi == 'etang' else 20261119)
    if quoi == 'etang':
        piano, water, n = etang(rng); fin = n / SR; mix = mixer(piano, water, n, rng, fin - 8.6, fin - 0.6)
    else:
        piano, water, n = instant(rng); fin = n / SR; mix = mixer(piano, water, n, rng, fin - 9.0, fin - 0.6, 0.37)
    pk = np.max(np.abs(mix)); print('crête avant écriture : %.3f (%.1f dBFS), durée %.2f s' % (pk, 20 * np.log10(pk), n / SR))
    assert pk < 0.9
    wavfile.write(sortie, SR, (mix.T * 32767).astype(np.int16))
    if '--pistes' in sys.argv:   # pour l'analyse : le piano seul et l'eau seule
        np.save(sortie + '.piano.npy', mixer.p.astype(np.float32)); np.save(sortie + '.eau.npy', mixer.w.astype(np.float32))
