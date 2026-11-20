# Les instruments de la partition : le piano et les cordes échantillonnés de la banque « MS Basic » de MuseScore (licence MIT), joués par tinysoundfont.
# Chaque voix est rendue seule (une piste par voix), puis mêlée dans le mixage. Rien n'est enregistré ici : ce sont des notes, écrites dans partition.py.
import numpy as np, os, tinysoundfont
from scipy.signal import fftconvolve, butter, sosfilt
SR = 48000
ICI = os.path.dirname(os.path.abspath(__file__))
PIANO, CELESTA, HARPE, VIOLON, ALTO, VIOLONCELLE, CONTREBASSE, TREMOLO, PIZZ, CORDES_VIVES, CORDES = 0, 8, 46, 40, 41, 42, 43, 44, 45, 48, 49
_s = None
def synthe():
    global _s
    if _s is None:
        _s = tinysoundfont.Synth(samplerate=SR, gain=0); _s.sfid = _s.sfload(ICI + '/sons/msbasic.sf3')
    return _s
def n_(t): return int(round(t * SR))
def piste(prog, notes, dur, cc=(), pedale=()):
    """Rend une voix. notes : [(début s, fin s, note MIDI, force 1-127), …]. cc : [(instant s, numéro, valeur), …] (11 : l'expression, pour les nuances des cordes).
    pedale : [(début s, fin s), …] la pédale du piano. Rend un son stéréo (nombres de -1 à 1) de la durée demandée."""
    s = synthe(); s.notes_off(); s.sounds_off(); s.program_select(0, s.sfid, 0, prog); s.control_change(0, 7, 110); s.control_change(0, 11, 127); s.control_change(0, 64, 0); s.control_change(0, 91, 0); s.control_change(0, 93, 0)
    s.generate(n_(.3))                                                    # on laisse s'éteindre ce qui restait de la voix d'avant
    ev = []
    for a, b, k, v in notes: ev.append((n_(a), 1, 'on', int(k), int(max(1, min(127, v))))); ev.append((n_(b), 0, 'off', int(k), 0))
    for t, c, v in cc: ev.append((n_(t), 0, 'cc', int(c), int(max(0, min(127, round(v))))))
    for a, b in pedale: ev.append((n_(a), 0, 'cc', 64, 127)); ev.append((n_(b), 0, 'cc', 64, 0))
    ev.sort(key=lambda e: (e[0], e[1])); N = n_(dur); out = np.zeros((N, 2), np.float32); pos = 0
    for t, _, quoi, x, y in ev:
        t = min(t, N)
        if t > pos:
            b = np.frombuffer(s.generate(t - pos), dtype=np.float32).reshape(-1, 2); out[pos:t] = b; pos = t
        if quoi == 'on': s.noteon(0, x, y)
        elif quoi == 'off': s.noteoff(0, x)
        else: s.control_change(0, x, y)
    if pos < N: out[pos:] = np.frombuffer(s.generate(N - pos), dtype=np.float32).reshape(-1, 2)
    s.notes_off(); return out.astype(np.float64)
def rampe(t0, t1, v0, v1, pas=.04, cc=11):
    """Une nuance qui évolue : une suite de valeurs d'expression entre deux instants."""
    k = max(1, int((t1 - t0) / pas)); return [(t0 + (t1 - t0) * i / k, cc, v0 + (v1 - v0) * (i / k)) for i in range(k + 1)]
def filtre(x, genre, fc, ordre=2):
    sos = butter(ordre, np.asarray(fc) / (SR / 2), btype=genre, output='sos'); return sosfilt(sos, x, axis=0)
_ri = {}
def salle(rt60=2.1, graine=11, pre=.022):
    """La réponse d'une salle (calculée) : quelques premiers échos, puis une queue douce. Elle lie le piano et les cordes dans le même lieu."""
    k = (rt60, graine)
    if k not in _ri:
        rng = np.random.default_rng(graine); n = n_(rt60 * 1.5); t = np.arange(n) / SR
        q = rng.standard_normal((n, 2)) * np.exp(-6.91 * t / rt60)[:, None]
        q = filtre(filtre(q, 'low', 6200), 'high', 220); q *= (1 - np.exp(-t / .035))[:, None]              # la queue monte doucement
        for d, a in ((.011, .5), (.017, -.38), (.026, .3), (.037, .24), (.051, -.18)):
            q[n_(d), 0] += a; q[n_(d * 1.19), 1] += a * .92
        q = np.vstack([np.zeros((n_(pre), 2)), q]); _ri[k] = q / np.sqrt((q ** 2).sum(axis=0)).max()
    return _ri[k]
def dans_la_salle(x, mouille=.22, rt60=2.1):
    w = np.stack([fftconvolve(x[:, c], salle(rt60)[:, c])[:len(x)] for c in (0, 1)], axis=1); return x + mouille * w
