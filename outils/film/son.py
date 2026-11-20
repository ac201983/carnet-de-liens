# « Et vous ? » : tous les sons du film sont fabriqués ici (aucun enregistrement extérieur), sauf les notes de piano et l'eau, qui viennent du projet lui-même.
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve
import os
SR = 48000
ICI = os.path.dirname(os.path.abspath(__file__))
def n_(t): return int(round(t * SR))
def lisse(x, a=0.0, b=1.0):
    t = np.clip((np.asarray(x, dtype=np.float64) - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def filtre(x, genre, fc, ordre=2):
    sos = butter(ordre, np.asarray(fc) / (SR / 2), btype=genre, output='sos'); return sosfilt(sos, x, axis=0)
def stereo(x, pan=0.0):
    g, d = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4); return np.stack([x * g, x * d], axis=1) * np.sqrt(2) / np.sqrt(2)

_ri = {}
def piece(rt60=.32, graine=3):
    """Réponse d'une petite pièce (une cuisine) : quelques premiers échos, puis une queue courte. Sert à poser les bruits dans le même lieu."""
    k = (rt60, graine)
    if k not in _ri:
        rng = np.random.default_rng(graine); n = n_(rt60 * 1.6); t = np.arange(n) / SR
        q = rng.standard_normal((n, 2)) * np.exp(-6.91 * t / rt60)[:, None]
        q = filtre(filtre(q, 'low', 5200), 'high', 180); q[:n_(.006)] = 0
        for d, a in ((.0071, .55), (.0113, -.4), (.0172, .33), (.0239, .25)):
            q[n_(d), 0] += a; q[n_(d * 1.13), 1] += a * .9
        _ri[k] = q / np.sqrt((q ** 2).sum(axis=0)).max()
    return _ri[k]
def dans_la_piece(x, mouille=.16, rt60=.32):
    if x.ndim == 1: x = stereo(x)
    w = np.stack([fftconvolve(x[:, c], piece(rt60)[:, c]) for c in (0, 1)], axis=1)
    out = np.zeros((len(w), 2)); out[:len(x)] = x; return out + mouille * w

def choc_bois(rng, dur=.5, modes=((96, .050, 1.0), (171, .040, .7), (263, .026, .42), (402, .018, .2)), bruit=.5, fc_bruit=850, tau_bruit=.013):
    """Un objet qui touche une table en bois : quelques résonances graves très amorties et un souffle court."""
    n = n_(dur); t = np.arange(n) / SR; x = np.zeros(n)
    for f, tau, a in modes: x += a * np.exp(-t / tau) * np.sin(2 * np.pi * f * (1 + rng.uniform(-.02, .02)) * t + rng.uniform(0, .6))
    x += bruit * filtre(rng.standard_normal(n), 'low', fc_bruit) * np.exp(-t / tau_bruit)
    x *= lisse(t, 0, .0015); return x / np.abs(x).max()

def verre_pose(rng, f0=880.0, dur=5.2, monte=(1.5, 3.4, .05)):
    """Le verre reposé sur la table : le choc sur le bois, le petit contact du verre, puis le verre qui tinte.
    La note du verre (f0) ne s'éteint pas tout à fait : elle reste, puis remonte doucement jusqu'à l'instant (monte[1]) où la première note de piano la reprend."""
    n = n_(dur); t = np.arange(n) / SR
    bois = .9 * choc_bois(rng, dur)[:n]
    clic = .22 * filtre(rng.standard_normal(n), 'band', (2400, 7000)) * np.exp(-t / .004)
    v = np.zeros(n)
    for k, (rap, tau, a, ecart) in enumerate(((1.0, .0, 1.0, 1.9), (2.32, .30, .40, 5.5), (4.25, .17, .2, 9.0), (6.63, .09, .09, 0.0))):
        f = f0 * rap
        if k == 0:
            env = .45 * np.exp(-t / .20) + .55 * np.exp(-t / 3.4) + (monte[2] / .05) * lisse(t, monte[0], monte[1]) ** 1.5 * np.exp(-np.maximum(0, t - monte[1]) / .45)
        else: env = np.exp(-t / tau)
        s = np.sin(2 * np.pi * f * t) + (.16 * np.sin(2 * np.pi * (f + ecart) * t + 1.1) if ecart else 0)     # 2 notes presque égales : le verre scintille un peu
        v += a * env * s / (1.16 if ecart else 1)
    v *= lisse(t, 0, .002)
    return bois * .55, clic, v * .11

def telephone_pose(rng, dur=.6):
    """La coque du téléphone qui retrouve la table : un bord d'abord, puis le dos à plat, 55 millièmes de seconde après. Mat, feutré."""
    n = n_(dur); x = np.zeros(n); t = np.arange(n) / SR
    for d, a, m in ((0.0, .55, ((138, .030, 1.0), (236, .022, .6), (410, .012, .3))), (.055, 1.0, ((112, .042, 1.0), (188, .034, .75), (305, .020, .4), (520, .010, .16)))):
        c = choc_bois(rng, dur - d, modes=m, bruit=.75, fc_bruit=1500, tau_bruit=.009)
        x[n_(d):n_(d) + len(c)] += a * c[:n - n_(d)]
    x += .10 * filtre(rng.standard_normal(n), 'band', (900, 2600)) * (np.exp(-t / .006) + .8 * np.exp(-np.maximum(0, t - .055) / .007) * (t >= .055))
    return x / np.abs(x).max()

def vibreur(rng, n_coups=2, coup=.21, pause=.12, f=172.0):
    """Le téléphone qui vibre sur la table : le petit moteur, et la table qui répond."""
    dur = n_coups * coup + (n_coups - 1) * pause + .25; n = n_(dur); t = np.arange(n) / SR; x = np.zeros(n)
    for i in range(n_coups):
        d = i * (coup + pause); e = lisse(t, d, d + .025) * (1 - lisse(t, d + coup - .03, d + coup))
        ph = 2 * np.pi * f * (t - d) * (1 + .012 * np.sin(2 * np.pi * 7 * t))
        m = np.sin(ph) + .55 * np.sin(2 * ph + .4) + .3 * np.sin(3 * ph + 1.0) + .16 * np.sin(5 * ph)
        tr = filtre(rng.standard_normal(n), 'band', (500, 1900)) * (.5 + .5 * np.sign(np.sin(ph)))      # le léger cliquetis contre le bois
        x += e * (m + .35 * tr)
    x = filtre(x, 'low', 2600); return x / np.abs(x).max()

_notes = None
CASES = [43, 45, 47, 50, 57, 62, 64, 66, 69]
def piano(midi, dur=5.6):
    """Une des 9 notes de piano feutré du projet (celles de l'exercice « Souffler »)."""
    global _notes
    if _notes is None:
        sr, x = wavfile.read(ICI + '/son/notes.wav'); assert sr == SR; _notes = x.astype(np.float64) / 32768
    i = CASES.index(midi); d = n_(i * 6.5 + .032 - .004); s = _notes[d:d + n_(dur)].copy()
    s *= lisse(np.arange(len(s)) / SR, 0, .003)[:, None]; s[-n_(.3):] *= np.linspace(1, 0, n_(.3))[:, None]; return s
_eau = None
def eau(dur, debut=3.0):
    global _eau
    if _eau is None:
        sr, x = wavfile.read(ICI + '/son/eau.wav'); _eau = x.astype(np.float64) / 32768
    d = n_(debut); k = n_(dur); s = np.concatenate([_eau[d:], _eau])[:k].copy(); return s
def cuisine(rng, dur):
    """Le silence d'une cuisine le soir : un souffle très bas, et le ronron lointain d'un appareil."""
    n = n_(dur); t = np.arange(n) / SR
    s = filtre(rng.standard_normal((n, 2)), 'low', 420) * .5 + filtre(rng.standard_normal((n, 2)), 'band', (900, 3200)) * .035
    ronron = (np.sin(2 * np.pi * 50 * t) + .5 * np.sin(2 * np.pi * 100 * t + .7) + .22 * np.sin(2 * np.pi * 150 * t + 1.9)) * (1 + .08 * np.sin(2 * np.pi * .23 * t))
    return s * .02 + ronron[:, None] * .0035

class Mixage:
    def __init__(self, dur): self.x = np.zeros((n_(dur), 2)); self.dur = dur; self.reperes = []
    def pose(self, s, t, gain=1.0, nom=None):
        if s.ndim == 1: s = stereo(s)
        d = n_(t); k = min(len(s), len(self.x) - d)
        if k > 0: self.x[d:d + k] += gain * s[:k]
        if nom: self.reperes.append((nom, t))
    def rendu(self, fichier, fondu_fin=.25, crete=.84, gain=1.0):
        x = self.x.copy() * gain; t = np.arange(len(x)) / SR
        x *= (1 - lisse(t, self.dur - fondu_fin, self.dur))[:, None]
        m = np.abs(x).max(); x = np.tanh(x / max(m, 1e-9) * 1.05) / np.tanh(1.05) * min(m, crete) if m > crete else x
        wavfile.write(fichier, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16)); return x

def regarde(x, fichier, reperes=(), titre=''):
    """Faute de pouvoir écouter : une image du son (les fréquences au fil du temps, en bas le volume), avec les repères du montage."""
    import cv2
    from scipy.signal import stft
    m = x.mean(axis=1); f, tt, Z = stft(m, SR, nperseg=2048, noverlap=2048 - 256); S = 20 * np.log10(np.abs(Z) + 1e-7)
    fl = np.geomspace(40, 12000, 300); idx = np.searchsorted(f, fl).clip(0, len(f) - 1); S = S[idx][::-1]
    img = np.clip((S + 105) / 80, 0, 1); W = 1500; img = cv2.resize((img * 255).astype(np.uint8), (W, 360), interpolation=cv2.INTER_AREA)
    img = cv2.applyColorMap(img, cv2.COLORMAP_INFERNO)
    env = np.array([np.sqrt((m[i:i + 480] ** 2).mean()) for i in range(0, len(m) - 480, 480)]); db = 20 * np.log10(env + 1e-7)
    bas = np.full((150, W, 3), 18, np.uint8); xs = (np.arange(len(db)) / len(db) * W).astype(int); ys = (150 - np.clip((db + 70) / 70, 0, 1) * 150).astype(int)
    for i in range(1, len(xs)): cv2.line(bas, (xs[i - 1], ys[i - 1]), (xs[i], ys[i]), (120, 220, 255), 1)
    out = np.vstack([img, bas]); dur = len(m) / SR
    for nom, t in reperes:
        X = int(t / dur * W); cv2.line(out, (X, 0), (X, 510), (255, 255, 255), 1); cv2.putText(out, '%s %.2f' % (nom, t), (X + 3, 14 + 14 * (hash(nom) % 3)), cv2.FONT_HERSHEY_SIMPLEX, .42, (255, 255, 255), 1, cv2.LINE_AA)
    for hz in (100, 440, 880, 2000, 5000):
        Y = int(360 - (np.log(hz / 40) / np.log(12000 / 40)) * 360); cv2.putText(out, str(hz), (2, Y), cv2.FONT_HERSHEY_SIMPLEX, .38, (200, 200, 200), 1, cv2.LINE_AA)
    cv2.imwrite(fichier, out)
