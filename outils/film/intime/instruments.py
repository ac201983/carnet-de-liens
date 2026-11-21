# Les instruments enregistrés de la nouvelle musique (21 novembre 2026, le soir) : un vrai piano à queue et de vrais violoncelles, note par note.
#   le piano : Salamander Grand Piano V3, d'Alexander Holm (licence Creative Commons Attribution 3.0)
#   les cordes : Versilian Studios Chamber Orchestra 2, Community Edition (un pupitre de violoncelles et un pupitre d'altos, licence CC0 1.0)
# La banque (banque.py) garde une note sur 3 ou 4 : les notes voisines sont obtenues en jouant l'enregistrement un peu plus vite ou un peu plus lentement, de 2 demi-tons au plus.
# Ce module ne lit que la banque rangée dans intime/banque/. Il rend une piste par voix, que le mixage mêle ensuite.
import numpy as np, json, os
from fractions import Fraction
from scipy.signal import resample_poly, butter, sosfilt, fftconvolve
SR = 48000
ICI = os.path.dirname(os.path.abspath(__file__)); BANQUE = ICI + '/banque/'
IX = json.load(open(BANQUE + 'index.json'))
def n_(t): return int(round(t * SR))
def filtre(x, genre, fc, ordre=2):
    sos = butter(ordre, np.asarray(fc) / (SR / 2), btype=genre, output='sos'); return sosfilt(sos, x, axis=0)
def lisse(x, a=0.0, b=1.0):
    t = np.clip((np.asarray(x, dtype=np.float64) - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
_N = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def m(nom):
    """« F#4 » → 66 (C4 = 60)."""
    if isinstance(nom, (int, np.integer)): return int(nom)
    n = _N[nom[0]]; r = nom[1:]
    if r[0] == '#': n += 1; r = r[1:]
    elif r[0] == 'b': n -= 1; r = r[1:]
    return 12 * (int(r) + 1) + n
def pan(x, p):
    """Place un son (une seule voie) entre la gauche (-1) et la droite (1)."""
    return np.stack([x * np.cos((p + 1) * np.pi / 4), x * np.sin((p + 1) * np.pi / 4)], axis=1)
def decale(x, demi_tons, cents=0.0, borne=400):
    """Joue un enregistrement plus haut (demi_tons > 0) ou plus bas. `cents` : sa justesse mesurée, qu'on corrige au passage."""
    r = 2 ** ((demi_tons - cents / 100) / 12)
    if abs(r - 1) < 2e-4: return x
    f = Fraction(r).limit_denominator(borne); return resample_poly(x, f.denominator, f.numerator, axis=0)

# ------------------------------------------------------------------------------------------------------------------ le piano
P_NOTES = sorted({v['midi'] for v in IX['piano'].values()})
COUCHES = (1, 3, 5, 7, 9)                                                  # les forces de frappe enregistrées qu'on utilise (de très doux à moyen)
# La force voulue (1 à 127) donne un niveau (dB, mesuré sur les 3 premiers dixièmes de seconde). Pour chaque note, on prend la couche enregistrée dont le niveau
# réel est le plus proche, et on ajuste le reste : d'une note à l'autre, les couches de la banque n'ont pas été frappées avec la même force, et le clavier serait inégal.
FORCES, NIVEAUX = [1, 22, 36, 46, 55, 68, 127], [-44.0, -31.7, -24.8, -21.8, -20.0, -18.8, -14.0]
def niveau_voulu(force, k): return float(np.interp(force, FORCES, NIVEAUX)) - .3 * max(0, k - 67)      # l'aigu s'éteint vite : à niveau égal, son attaque est plus forte, on la retient
_p = {}; _micro = {}; _niv = {}
def _piano_source(k, couche):
    """Une note de la banque. Le piano a été pris par 2 micros écartés, dont les sons s'annulent en partie quand on les réunit (sur un téléphone).
    On garde donc, pour chaque note, le micro qui l'entend le mieux, et c'est le mixage qui place le piano dans l'espace."""
    cle = 'p%03d-%02d' % (k, couche)
    if cle not in _p:
        x = np.load(BANQUE + cle + '.npy').astype(np.float32) * np.float32(IX['piano'][cle]['pic'] / 32000)
        if k not in _micro:
            r = np.load(BANQUE + 'p%03d-05.npy' % k).astype(np.float64); _micro[k] = int(np.argmax((r ** 2).sum(axis=0)))
        _p[cle] = x[:, _micro[k]].copy(); _niv[cle] = 20 * np.log10(np.sqrt((_p[cle][:n_(.3)].astype(np.float64) ** 2).mean()) + 1e-12)
    return _p[cle]
# Le piano a été pris de très près (les micros à 12 cm des cordes) : on entend surtout le marteau, et la note retombe vite (jusqu'à 25 dB en 1 seconde).
# On lui rend la tenue d'un piano à queue écouté dans une salle : après l'attaque, laissée telle quelle, le son suit cette courbe (en dB sous l'attaque).
# On ne fait que soutenir, jamais retenir : les notes graves, qui tiennent déjà, ne changent pas. Entre les harmoniques, le bruit des prises est à -83 dB : il reste inaudible.
TENUE_T, TENUE_DB = [0, .25, .5, 1, 2, 3, 4, 6, 8, 16], [0, -5.0, -8.0, -11.0, -15.0, -18.5, -22.0, -28.0, -34.0, -58.0]
def soutien(x, quantite=1.0, maxi=10.0):
    if quantite <= 0: return x
    from scipy.ndimage import uniform_filter1d
    doux = lambda y, d: uniform_filter1d(uniform_filter1d(y, n_(d), mode='nearest'), n_(d), mode='nearest')      # une moyenne glissante, passée 2 fois
    e = np.sqrt(doux(x ** 2, .03) + 1e-16); t = np.arange(len(x)) / SR
    cible = np.sqrt((x[:n_(.1)] ** 2).mean()) * 10 ** (np.interp(t, TENUE_T, TENUE_DB) / 20); g = doux(np.clip(cible / e, 1.0, maxi), .09)
    return x * (1 + (g - 1) * lisse(t, .10, .32)) ** quantite
_pd = {}
def note_piano(k, force, tenue=1.0):
    """Une note de piano entière (une seule voie), à la force demandée."""
    src = min(P_NOTES, key=lambda s: (abs(s - k), s)); voulu = niveau_voulu(force, k)
    for c in COUCHES: _piano_source(src, c)
    c = min(COUCHES, key=lambda c: abs(_niv['p%03d-%02d' % (src, c)] - voulu)); cle = (src, c, k - src, tenue)
    if cle not in _pd:                                                       # sous la note, il n'y a que le souffle de la prise et le choc de la mécanique : on les retient
        x = filtre(decale(_piano_source(src, c), k - src).astype(np.float64), 'high', max(30.0, .55 * 440 * 2 ** ((k - 69) / 12)))
        x = soutien(x, tenue); t = np.arange(min(len(x), n_(.2))) / SR
        x[:len(t)] *= 1 - .30 * np.exp(-t / .010)                            # le feutre : le choc du marteau est un peu retenu (3 dB, pendant 3 centièmes de seconde)
        _pd[cle] = x.astype(np.float32)
    return _pd[cle], 10 ** ((voulu - _niv['p%03d-%02d' % (src, c)]) / 20)

class Piano:
    """Une voix de piano. n(t, durée, note, force) ; pedale(a, b). Les instants sont en secondes ici (la partition convertit les images).
    tenue : de 0 (la note telle qu'elle a été prise, de très près) à 1 (soutenue comme dans une salle, voir soutien)."""
    def __init__(self, tenue=1.0, largeur=.30):
        self.notes = []; self.ped = []; self.tenue = tenue; self.largeur = largeur
    def n(self, t, duree, nom, force):
        for x in (nom if isinstance(nom, (list, tuple)) else [nom]): self.notes.append((float(t), float(t + duree), m(x), float(force)))
    def pedale(self, a, b): self.ped.append((float(a), float(b)))
    def rendu(self, dur):
        N = n_(dur); out = np.zeros((N, 2))
        for a, b, k, f in self.notes:
            fin = b
            for pa, pb in self.ped:
                if pa <= b < pb: fin = max(fin, pb)                         # la pédale tient la note jusqu'à ce qu'on la relâche
            x, g = note_piano(k, f, self.tenue); tr = .16 if k < 48 else (.11 if k < 72 else .08)      # l'étouffoir : plus lent dans le grave
            n = min(len(x), n_(fin - a + 7 * tr)); t = np.arange(n) / SR
            y = x[:n].astype(np.float64) * g
            y *= np.where(t < fin - a, 1.0, np.exp(-np.maximum(0, t - (fin - a)) / tr))
            if n == len(x): y[-n_(.3):] *= np.linspace(1, 0, n_(.3))
            d = n_(a)
            if d >= N or d < 0: continue
            y = y[:N - d]; out[d:d + len(y)] += pan(y, float(np.clip((k - 62) / 36, -1, 1)) * self.largeur)
        return out

# ------------------------------------------------------------------------------------------------------------------ les cordes
_c = {}
JUSTESSE = json.load(open(BANQUE + 'justesse.json'))                        # l'écart moyen de chaque enregistrement à la note juste (en centièmes de demi-ton)
def _corde_source(pupitre, k, couche, egalise=.7):
    """Une note de la banque. Les archets enflent et retombent d'eux-mêmes pendant la note (jusqu'à 9 dB) : on égalise en grande partie, la partition décide des nuances."""
    cle = '%s%03d-%s' % (pupitre, k, couche)
    if cle not in _c:
        x = np.load(BANQUE + cle + '.npy').astype(np.float64) * (IX['cordes'][cle]['pic'] / 32000)
        w = n_(.35); e = np.sqrt(np.convolve((x ** 2).max(axis=1), np.hanning(w) / np.hanning(w).sum(), mode='same') + 1e-12)
        a, b = n_(.6), max(n_(.8), len(x) - n_(1.3)); ref = np.median(e[a:b]); g = np.clip((ref / e) ** egalise, .5, 2.6)
        t = np.arange(len(x)) / SR; g = 1 + (g - 1) * lisse(t, .22, .75) * (1 - lisse(t, len(x) / SR - 1.25, len(x) / SR - .9))
        # d'une note à l'autre, les pupitres n'ont pas joué à la même force : on ramène chaque enregistrement au même niveau tenu (-35 dB pour l'archet doux, -21 dB pour l'archet appuyé)
        g = g * (10 ** ((-35.0 if couche == 'v1' else -21.0) / 20) / ref)
        # les 2 micros n'entendent pas la note au même instant : réunis (sur un téléphone), ils l'effacent en partie, surtout dans l'aigu. On garde le micro qui l'entend le mieux.
        _c[cle] = (x[:, int(np.argmax((x ** 2).sum(axis=0)))] * g).astype(np.float32)
    return _c[cle]
def _notes_cordes(pupitre): return sorted({v['midi'] for c, v in IX['cordes'].items() if c[0] == pupitre})
_cd = {}
def note_corde(pupitre, k, couche):
    src = min(_notes_cordes(pupitre), key=lambda s: (abs(s - k), s)); cle = (pupitre, src, couche, k - src)
    if cle not in _cd:
        nom = '%s%03d-%s' % (pupitre, src, couche); x = decale(_corde_source(pupitre, src, couche), k - src, JUSTESSE[nom]).astype(np.float64)
        _cd[cle] = filtre(x, 'high', .55 * 440 * 2 ** ((k - 69) / 12), 3).astype(np.float32)       # sous la note : les bruits de la salle et des archets, qui font des pointes inutiles
    return _cd[cle]
def tenue(x, n, debut=0, boucle=(1.7, 1.15), fondu=.9):
    """Tient une note de cordes n échantillons : si l'enregistrement est trop court, on en reprend le milieu (l'archet qui continue), en fondant les 2 passages l'un dans l'autre."""
    x = x[debut:]; fin = len(x) - n_(boucle[1])
    if n <= fin: return x[:n].astype(np.float64)
    a = n_(boucle[0]); c = n_(fondu); out = x[:fin].astype(np.float64)
    w = np.linspace(0, np.pi / 2, c)
    while len(out) < n:
        seg = x[a:fin].astype(np.float64); out[-c:] = out[-c:] * np.cos(w) + seg[:c] * np.sin(w); out = np.concatenate([out, seg[c:]])
    return out[:n]

class Cordes:
    """Une voix de cordes (pupitre 'v' : les violoncelles, 'a' : les altos).
    n(t, durée, note, timbre, lie) : timbre de 0 (l'archet très doux) à 1 (appuyé) ; lie=True : la note s'enchaîne à la précédente sans reprise d'archet.
    nuance([(t, valeur), …]) : le volume au fil du temps, de 0 à 1 (les crescendos et les fins qui s'effacent)."""
    FORTES = {'v': 'v3', 'a': 'v2'}
    def __init__(self, pupitre='v', avance=.07, place=0.0): self.p = pupitre; self.notes = []; self.pts = []; self.avance = avance; self.place = place
    def n(self, t, duree, nom, timbre=.25, lie=False): self.notes.append((float(t), float(t + duree), m(nom), float(timbre), bool(lie)))
    def nuance(self, pts): self.pts += [(float(t), float(v)) for t, v in pts]
    def rendu(self, dur):
        N = n_(dur); out = np.zeros((N, 2)); notes = sorted(self.notes)
        for i, (a, b, k, timbre, lie) in enumerate(notes):
            suivante_liee = i + 1 < len(notes) and notes[i + 1][4] and abs(notes[i + 1][0] - b) < .12
            saut = n_(.30) if lie else 0; t0 = a - (.05 if lie else self.avance); rel = .20 if suivante_liee else .42
            n = n_(b - t0 + rel); y = tenue(note_corde(self.p, k, 'v1'), n, saut) * (1 - .3 * timbre)
            if timbre > 0: y = y + tenue(note_corde(self.p, k, self.FORTES[self.p]), n, saut) * (.35 * timbre)
            # chaque note est ramenée au même niveau (un peu plus quand l'archet appuie) : d'un enregistrement à l'autre, les pupitres n'ont pas joué aussi fort
            corps = y[n_(.12):max(n_(.2), n_(b - t0))]; y = y * (10 ** ((-35.0 + 4.0 * timbre) / 20) / (np.sqrt((corps ** 2).mean()) + 1e-9))
            t = np.arange(n) / SR; y *= lisse(t, 0, .11 if lie else .03) * (1 - lisse(t, b - t0 - (.03 if suivante_liee else 0), b - t0 + rel))
            d = n_(t0)
            if d < 0: y = y[-d:]; d = 0
            y = y[:max(0, N - d)]; out[d:d + len(y)] += pan(y, self.place)
        if self.pts:
            pts = sorted(self.pts); e = np.interp(np.arange(N) / SR, [p[0] for p in pts], [p[1] for p in pts])
            k = n_(.12); e = np.convolve(np.pad(e, k, mode='edge'), np.hanning(2 * k + 1) / np.hanning(2 * k + 1).sum(), mode='same')[k:-k]      # les nuances n'ont pas d'angle
            out *= e[:, None]
        return out

# ------------------------------------------------------------------------------------------------------------------ la salle
_ri = {}
def salle(rt60=2.3, graine=5, pre=.018):
    """La réponse d'une salle (calculée) : les graves y durent un peu plus que le médium, les aigus bien moins, et le son y monte en 30 millièmes de seconde."""
    cle = (rt60, graine, pre)
    if cle not in _ri:
        rng = np.random.default_rng(graine); n = n_(rt60 * 1.7); t = np.arange(n) / SR; q = np.zeros((n, 2))
        for (lo, hi), k, g in (((140, 450), 1.12, .9), ((450, 1800), 1.0, 1.0), ((1800, 4200), .66, .8), ((4200, 9000), .38, .55)):
            q += g * filtre(rng.standard_normal((n, 2)), 'band', (lo, hi)) * np.exp(-6.91 * t / (rt60 * k))[:, None]
        q *= (1 - np.exp(-t / .030))[:, None]; q = np.vstack([np.zeros((n_(pre), 2)), q]); _ri[cle] = q / np.sqrt((q ** 2).sum(axis=0)).max()
    return _ri[cle]
def dans_la_salle(x, mouille=.22, rt60=2.3, graine=5):
    r = salle(rt60, graine); w = np.stack([fftconvolve(x[:, c], r[:, c])[:len(x)] for c in (0, 1)], axis=1); return x + mouille * w
