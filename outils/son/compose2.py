# -*- coding: utf-8 -*-
"""La respiration guidée par la musique : les matières sonores que le navigateur assemble en direct.

Création originale, entièrement calculée ici : aucun enregistrement, aucun échantillon, aucune musique existante.

Dans « Souffler 2 minutes », la durée de l'inspiration et de l'expiration dépend de la respiration choisie par le parent,
et « À mon rythme » la laisse régler. Un morceau enregistré d'avance ne peut pas suivre. La page joue donc elle-même la phrase,
note par note, au rythme du cercle. Ce fichier fabrique ce dont elle a besoin :

  notes   : 9 notes de piano feutré rangées l'une après l'autre dans un seul fichier (une case de 6,5 s par note) ;
  eau     : 28 secondes d'étang qui se bouclent sans couture (la page fait avancer et reculer l'eau avec la respiration) ;
  instant : 40 secondes pour rester avec la dose du jour, sur la même phrase.

La phrase, en ré majeur : ré, fa dièse, la qui montent pendant l'inspiration ; fa dièse, mi, ré (puis la grave quand l'expiration
est plus longue) qui redescendent pendant l'expiration. Une note grave marque le début de chaque respiration.

  python3 compose2.py notes sortie.wav
  python3 compose2.py eau sortie.wav
  python3 compose2.py instant sortie.wav
  python3 compose2.py essai dossier      (simule ce que la page joue dans chaque respiration, pour régler et mesurer les niveaux)
"""
import sys, json, numpy as np
from scipy import signal as sg
from scipy.io import wavfile
import compose as C

SR = C.SR
CASE = 6.5          # durée d'une case du fichier de notes
AVANT = 0.03        # silence au début de chaque case : la note part 30 ms après le début de la case
NOTES = [43, 45, 47, 50, 57, 62, 64, 66, 69]     # sol1 la1 si1 ré2 | la2 ré3 mi3 fa#3 la3 (numéros MIDI)
PAN = {43: 0.44, 45: 0.45, 47: 0.45, 50: 0.46, 57: 0.47, 62: 0.48, 64: 0.50, 66: 0.52, 69: 0.54}

# ---- ce que la page joue (les mêmes nombres sont écrits dans pparts/v2-c.js : RESP_*) ----
MONTE = [62, 66, 69]                    # inspiration : ré, fa dièse, la
DESC_COURT = [66, 64, 62]               # expiration de même durée : fa dièse, mi, ré
DESC_LONG = [66, 64, 62, 57]            # expiration prolongée : la phrase continue jusqu'au la grave
BASSES = [50, 47, 43, 45]               # une note grave par respiration : ré, si, sol, la, puis on recommence
G_MONTE = [0.62, 0.74, 0.86]            # l'inspiration grandit
G_DESC = [0.70, 0.60, 0.52, 0.46]       # l'expiration s'apaise
G_BASSE = 0.50
EAU_HAUT, EAU_BAS = 1.0, 0.40           # l'eau avance à l'inspiration, se retire à l'expiration
EAU_CLAIR, EAU_SOMBRE = 3600.0, 1100.0  # et elle s'éclaircit en avançant (fréquence du filtre)
G_EAU = 0.62                            # niveau de l'eau par rapport au fichier
G_PIANO = 1.0                           # niveau des notes par rapport au fichier
VOLUME = 0.7

MODES = {'egal': (5.0, 5.0, DESC_COURT), 'long': (4.0, 6.0, DESC_LONG), 'libre': (3.2, 4.8, DESC_LONG)}

def traite_piano(sec, n, irs):
    """Le même traitement que le premier morceau : la pièce, le corps de l'instrument, les aigus adoucis."""
    wet = np.stack([sg.fftconvolve(sec[0], irs[0])[:n], sg.fftconvolve(sec[1], irs[1])[:n]])
    wet = 0.72 * wet + 0.28 * wet[::-1]
    p = sec + 0.42 * wet
    sos = sg.butter(2, 3100, btype='low', fs=SR, output='sos'); p = sg.sosfilt(sos, p, axis=1)
    b, a = sg.iirpeak(260, 0.9, fs=SR); p = p + 0.16 * sg.lfilter(b, a, p, axis=1)
    sos = sg.butter(2, 62, btype='high', fs=SR, output='sos'); p = sg.sosfilt(sos, p, axis=1)
    return p

def fichier_notes(rng):
    n = int(SR * CASE); irs = [C.reverbe(rng), C.reverbe(rng)]
    cases = []
    for m in NOTES:
        sec = np.zeros((2, n))
        dur = 5.2 if m >= 57 else 5.6
        C.poser(sec, C.note(m, dur, 0.46, rng), AVANT, PAN[m])
        p = traite_piano(sec, n, irs)
        z = int(SR * 0.45); p[:, -z:] *= C.rc(z)[::-1]; p[:, -int(SR * 0.08):] = 0     # la case finit dans le silence
        p[:, :int(SR * 0.004)] = 0
        cases.append(p)
    # un seul réglage pour toutes les notes : elles gardent entre elles l'équilibre du piano
    crete = max(np.percentile(np.abs(c), 99.95) for c in cases)
    cases = [c * (0.50 / crete) for c in cases]
    return cases

def eau_boucle(rng, periode=28.0, fondu=2.5, marge=0.5):
    """Une eau qui se boucle : la fin se fond dans le début. Rendue « avancée » : la page la fait reculer et s'assombrir."""
    n = int(SR * (periode + fondu)); x = C.eau(n, rng, np.full(n, 0.85))
    P = int(SR * periode); F = int(SR * fondu)
    a = np.sin(0.5 * np.pi * np.arange(F) / F); b = np.cos(0.5 * np.pi * np.arange(F) / F)
    y = x[:, :P].copy(); y[:, :F] = x[:, :F] * a + x[:, P:P + F] * b          # le début reçoit la fin qui s'efface
    M = int(SR * marge)
    return np.concatenate([y[:, -M:], y, y[:, :M]], axis=1) * 0.075, periode, marge

# ---------------------------------------------------------------- la simulation de ce que joue la page
def plan(mode, tin, tout, desc, cycles):
    """Les notes d'une suite de respirations : (instant, note, niveau). Réparties à pas égaux dans chaque mouvement."""
    ev = []; t = 0.0
    for c in range(cycles):
        ev.append((t, BASSES[c % 4], G_BASSE))
        for i, m in enumerate(MONTE): ev.append((t + tin * i / len(MONTE), m, G_MONTE[i]))
        for i, m in enumerate(desc): ev.append((t + tin + tout * i / len(desc), m, G_DESC[i]))
        t += tin + tout
    return ev, t

def simule(mode, cases, eau, periode, marge, cycles=6):
    tin, tout, desc = MODES[mode]
    ev, fin = plan(mode, tin, tout, desc, cycles)
    n = int(SR * (fin + 8)); piano = np.zeros((2, n)); cn = cases[0].shape[1]
    for (t, m, g) in ev:
        i = int(round(t * SR)); c = cases[NOTES.index(m)]; k = min(cn, n - i)
        piano[:, i:i + k] += G_PIANO * g * c[:, :k]
    # l'eau : la boucle, le filtre et le niveau qui suivent la respiration
    P = int(SR * periode); M = int(SR * marge); corps = eau[:, M:M + P]
    w = np.tile(corps, int(np.ceil(n / P)) + 1)[:, :n]
    tt = np.arange(n) / SR; u = np.mod(tt, tin + tout)
    s = np.where(u < tin, u / tin, 1 - (u - tin) / tout); s[tt >= fin] = 0
    niveau = EAU_BAS + (EAU_HAUT - EAU_BAS) * s
    # le filtre qui s'ouvre et se referme, simulé par un mélange entre l'eau sombre et l'eau claire
    sos1 = sg.butter(2, EAU_SOMBRE, btype='low', fs=SR, output='sos'); sos2 = sg.butter(2, EAU_CLAIR, btype='low', fs=SR, output='sos')
    w = (sg.sosfilt(sos1, w, axis=1) * (1 - s) + sg.sosfilt(sos2, w, axis=1) * s) * niveau * G_EAU
    return VOLUME * piano, VOLUME * w, ev, fin

def db(v): return 20 * np.log10(max(float(v), 1e-9))

def mesure(nom, p, w, ev, fin):
    mix = p + w; mono = mix.mean(0)
    print('%s : crête %.1f dBFS, efficace %.1f dBFS' % (nom, db(np.abs(mix).max()), db(np.sqrt((mono[:int(fin * SR)] ** 2).mean()))))
    pm = p.mean(0); wm = w.mean(0); win = int(SR * 0.5)
    for (titre, coupe) in (('casque', None), ('haut-parleur de téléphone (coupé à 320 Hz)', 320)):
        a, b = pm, wm
        if coupe:
            sos = sg.butter(2, coupe, btype='high', fs=SR, output='sos'); a = sg.sosfilt(sos, pm); b = sg.sosfilt(sos, wm)
        notes = [db(np.sqrt((a[int(t * SR) + 800:int(t * SR) + 800 + win] ** 2).mean())) for (t, m, g) in ev if m >= 57 and t > 5]
        eaux = [db(np.sqrt((b[int(t * SR) + 800:int(t * SR) + 800 + win] ** 2).mean())) for (t, m, g) in ev if m >= 57 and t > 5]
        print('   %-44s notes de %.1f à %.1f dB, eau de %.1f à %.1f dB, le piano dépasse l’eau de %.1f dB en moyenne' % (titre, min(notes), max(notes), min(eaux), max(eaux), np.mean(notes) - np.mean(eaux)))

def ecrit(nom, x):
    pk = np.abs(x).max(); assert pk < 0.95, pk
    wavfile.write(nom, SR, (x.T * 32767).astype(np.int16)); print('%s : %.2f s, crête %.1f dBFS' % (nom, x.shape[1] / SR, db(pk)))

def instant(rng):
    """40 secondes : 2 fois la phrase, lentement, puis l'accord qui s'éteint. Rien n'y est calé sur une respiration."""
    n = int(SR * 40.0); piano = np.zeros((2, n)); irs = None
    T = [(2.0, 62, 0.40, 50), (3.8, 66, 0.44, None), (5.6, 69, 0.48, None), (8.0, 66, 0.42, None), (10.1, 64, 0.40, None), (12.2, 62, 0.38, None), (14.5, 57, 0.36, None),
         (18.4, 62, 0.40, 47), (20.2, 66, 0.44, None), (22.0, 69, 0.48, None), (24.4, 66, 0.42, None), (26.5, 64, 0.40, None), (28.6, 62, 0.38, 43), (31.4, 57, 0.34, 50)]
    for (t, m, v, g) in T:
        C.poser(piano, C.note(m, 8.0, v, rng), t + rng.uniform(-0.015, 0.015), PAN[m])
        if g is not None: C.poser(piano, C.note(g, 9.0, 0.25, rng), t + 0.12, PAN[g])
    t = np.arange(n) / SR; s = np.clip(0.30 + 0.35 * np.sin(np.pi * np.clip(t / 32.0, 0, 1)) ** 2, 0, 1)
    return piano, C.eau(n, rng, s), n

if __name__ == '__main__':
    quoi, sortie = sys.argv[1], sys.argv[2]
    if quoi == 'notes':
        cases = fichier_notes(np.random.default_rng(20261120))
        ecrit(sortie, np.concatenate(cases, axis=1))
        print('cases', json.dumps({str(m): i for i, m in enumerate(NOTES)}), 'de', CASE, 's, la note part à', AVANT, 's')
    elif quoi == 'eau':
        e, periode, marge = eau_boucle(np.random.default_rng(20261121))
        ecrit(sortie, e); print('boucle de %.1f s, entre %.2f s et %.2f s du fichier' % (periode, marge, marge + periode))
    elif quoi == 'instant':
        rng = np.random.default_rng(20261122); piano, water, n = instant(rng); fin = n / SR
        mix = C.mixer(piano, water, n, rng, fin - 9.0, fin - 0.6, 0.37); ecrit(sortie, mix)
        if '--pistes' in sys.argv: np.save(sortie + '.piano.npy', C.mixer.p.astype(np.float32)); np.save(sortie + '.eau.npy', C.mixer.w.astype(np.float32))
    elif quoi == 'essai':
        import os; os.makedirs(sortie, exist_ok=True)
        cases = fichier_notes(np.random.default_rng(20261120)); e, periode, marge = eau_boucle(np.random.default_rng(20261121))
        for mode in ('egal', 'long', 'libre'):
            p, w, ev, fin = simule(mode, cases, e, periode, marge)
            mesure(mode, p, w, ev, fin); ecrit(os.path.join(sortie, 'essai-%s.wav' % mode), p + w)
            np.save(os.path.join(sortie, 'essai-%s.piano.npy' % mode), p.astype(np.float32)); np.save(os.path.join(sortie, 'essai-%s.eau.npy' % mode), w.astype(np.float32))
