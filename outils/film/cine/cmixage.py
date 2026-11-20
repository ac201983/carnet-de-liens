# Le son du montage cinématographique : la partition (partition.py) et les bruits (bruits.py), mêlés sur le minutage du film (ctemps.py).
# python3 cmixage.py  →  tmp/film.wav, tmp/film-son.png (une image du son, faute de pouvoir l'écouter), tmp/son.json (les instants et les niveaux mesurés)
# Chaque bruit a sa place : la vibration est le premier son du film, la musique se tait juste avant le domino, le papier passe avant que les cordes n'enflent,
# et pour la tasse il ne reste presque rien d'autre.
import sys, os, json, numpy as np
ICI = os.path.dirname(os.path.abspath(__file__)); sys.path[:0] = [ICI, os.path.dirname(ICI)]
import son as S
import ctemps as CT, partition as PA, synthe as Y, bruits as B
SR = S.SR; IPS = 30.0
def s(image): return image / IPS
DUR = CT.TOTAL / IPS
# la force de chaque voix dans le mixage, et sa part de salle
VOIX = {'piano motif': (25.0, .24), 'piano croches': (13.0, .20), 'pulsation piano': (12.0, .10), 'pulsation cordes pincées': (10.5, .12), 'cordes pincées': (5.5, .22),
        'cordes 1': (4.2, .30), 'cordes 2': (4.2, .30), 'violoncelle': (5.0, .28), 'tremolo': (11.0, .30), 'harpe': (2.7, .30)}
def enveloppe(n, pts):
    t = np.arange(n) / SR; return np.interp(t, [p[0] for p in pts], [p[1] for p in pts])

def musique():
    """Rend la partition, voix par voix. Rend {nom: son stéréo} et les repères."""
    V, rep = PA.ecrire(); out = {}
    for nom, v in V.items():
        g, salle = VOIX[nom]; x = v.rendu() * g
        out[nom] = Y.dans_la_salle(x, salle, 2.3 if 'cordes' in nom or nom in ('tremolo', 'harpe', 'violoncelle') else 2.0)
    return out, rep

def film(fichier, pistes=None):
    rng = np.random.default_rng(31); M = S.Mixage(DUR + 3.0)
    mus, rep = musique() if pistes is None else pistes
    for nom, x in mus.items(): M.pose(x, 0, 1.0)
    for nom, t in rep: M.reperes.append((nom, t))
    # le silence des cuisines, très bas (le soir du début, puis l'autre soir). Il n'arrive qu'avec la vibration : avant elle, le film ne fait aucun son.
    c = S.cuisine(rng, DUR + 3.0)
    M.pose(c * enveloppe(len(c), [(0, 0), (s(CT.VIB1) + .02, 0), (s(CT.VIB2) + .6, .32), (s(CT.DEBUT['b1']) - .4, .32), (s(CT.DEBUT['b1']) + 1.0, 0), (s(CT.DEBUT['e1']), 0), (s(CT.DEBUT['e1']) + 1, .3), (s(CT.ENVOI), .3), (s(CT.DEBUT['e4']), 0), (DUR + 3, 0)])[:, None], 0, 1.0)
    # 1. la vibration : le premier son du film. Deux impulsions courtes, la seconde un peu plus brève, un peu plus grave, un peu moins forte.
    v1 = B.vibreur(1, CT.D_VIB1, 172.0, 1.0); v2 = B.vibreur(2, CT.D_VIB2, 166.0, .86)
    M.pose(S.dans_la_piece(v1, .20), s(CT.VIB1), .40, 'vibration 1'); M.pose(S.dans_la_piece(v2, .20), s(CT.VIB2), .40, 'vibration 2')
    # 2. le domino glisse, puis touche le bois
    M.pose(S.dans_la_piece(B.glisse(), .16), s(CT.DOMINO) - .30, .075); M.pose(S.dans_la_piece(B.domino(), .2), s(CT.DOMINO), .50, 'domino')
    # 3. la goutte de « Souffler » : un peu de l'eau de l'exercice, claire au sommet
    e = S.eau(DUR + 3.0); n = len(e); c7 = s(CT.DEBUT['c7']); haut = c7 + 42 / IPS
    M.pose(S.filtre(e, 'low', 3200) * enveloppe(n, [(0, 0), (c7 - .1, 0), (c7 + .5, .7), (haut, 1.0), (c7 + 3.0, .5), (c7 + 3.5, 0), (DUR + 3, 0)])[:, None], 0, .12)
    # 4. le papier : la feuille passe de la main de Bastien à la nôtre
    M.pose(S.dans_la_piece(B.papier(), .18), s(CT.PAPIER[0]) - .05, .50, 'papier')
    # 5. la tasse, dans le silence du dimanche matin
    b, v = B.tasse(); M.pose(S.dans_la_piece(b, .2), s(CT.TASSE), .44, 'tasse'); M.pose(S.dans_la_piece(v, .26, .4), s(CT.TASSE), 2.4)
    x = M.x * MAITRE; t = np.arange(len(x)) / SR; x = x * (1 - S.lisse(t, DUR - 1.6, DUR))[:, None]
    x, baisse, part = limite(x, .84); print('limiteur : baisse la plus forte %.1f dB, à l’œuvre pendant %.1f %% du film' % (baisse, part * 100))
    return x, M.reperes, mus
MAITRE = 1.62                                                              # le niveau général, pour une écoute sur téléphone (autour de -17,5 LUFS)
def limite(x, crete=.84, avance=.008, retour=.09):
    """Un limiteur qui regarde un peu en avance : il baisse le son juste avant une pointe et le remonte doucement après, sans déformer les notes."""
    from scipy.ndimage import minimum_filter1d, uniform_filter1d
    p = np.abs(x).max(axis=1); g = np.minimum(1.0, crete / np.maximum(p, 1e-9)); k = int(avance * SR)
    g = minimum_filter1d(g, size=2 * k + 1, mode='nearest')                  # le niveau voulu est tenu un peu avant et un peu après chaque pointe
    r = float(np.exp(-1 / (retour * SR))); a = 1.0; gl = g.tolist(); y = [0.0] * len(gl)
    for i, v in enumerate(gl):                                              # la remontée, douce
        a = 1.0 - (1.0 - a) * r
        if v < a: a = v
        y[i] = a
    y = uniform_filter1d(np.array(y), size=k, mode='nearest')               # et la descente, sans angle
    return x * y[:, None], float(20 * np.log10(y.min())), float((y < .999).mean())
def n_(t): return int(round(t * SR))

def niveau(x, a, b, bande=None):
    """Le niveau moyen (dB) entre 2 instants. bande : (bas, haut) en Hz pour ne mesurer qu'une partie du son."""
    y = x[n_(a):n_(b)].mean(axis=1) if x.ndim == 2 else x[n_(a):n_(b)]
    if bande: y = S.filtre(S.filtre(y, 'high', bande[0], 4), 'low', bande[1], 4) if bande[1] else S.filtre(y, 'high', bande[0], 4)
    return round(float(20 * np.log10(np.sqrt((y ** 2).mean()) + 1e-9)), 1)

if __name__ == '__main__':
    os.makedirs(ICI + '/tmp', exist_ok=True)
    x, rep, mus = film(ICI + '/tmp/film.wav')
    x = x[:n_(DUR)]
    from scipy.io import wavfile
    wavfile.write(ICI + '/tmp/film.wav', SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
    S.regarde(x, ICI + '/tmp/film-son.png', [(k, v) for k, v in rep if k in ('vibration 1', 'motif 1', 'pulsation', 'silence', 'motif 2', 'Déposer', 'motif 3', 'lendemain', 'domino', 'goutte', 'Bastien', 'papier', 'tasse', 'un autre soir', 'il hésite', 'la 4e note', 'logo')])
    json.dump({'duree': DUR, 'reperes': rep}, open(ICI + '/tmp/son.json', 'w'), ensure_ascii=False, indent=0)
    print('durée', round(len(x) / SR, 3), 's | crête', round(float(np.abs(x).max()), 3))
    T = CT.DEBUT; f = lambda k, i=0: s(T[k] + i)
    lignes = [('vibration 1', s(CT.VIB1), s(CT.VIB1) + .25), ('entre les 2', s(CT.VIB1) + .26, s(CT.VIB2) - .01), ('vibration 2', s(CT.VIB2), s(CT.VIB2) + .2), ('3 notes (ouverture)', s(57), s(132)), ('il répond (cordes seules)', s(180), s(240)),
              ('pulsation (pouce arrêté)', s(297), s(360)), ('silence après avoir effacé', s(392), s(452)), ('promesse', s(470), s(545)), ('Déposer', f('b1'), f('b4')), ('la phrase proposée', f('b4'), f('c1')),
              ('lendemain, minuteur', f('c1'), f('c3')), ('juste avant le domino', s(CT.DOMINO) - .55, s(CT.DOMINO) - .32), ('domino', s(CT.DOMINO), s(CT.DOMINO) + .15), ('regard (cordes)', f('c5'), f('c7')), ('goutte', f('c7'), f('d1')),
              ('Bastien écrit', f('d1'), f('d3')), ('papier', s(CT.PAPIER[0]), s(CT.PAPIER[1]) + .1), ('la fiche passe (cordes)', s(CT.PAPIER[1]) + .2, f('d4')), ('juste avant la tasse', s(CT.TASSE) - .25, s(CT.TASSE) - .02), ('tasse', s(CT.TASSE), s(CT.TASSE) + .2), ('café (le reste du plan)', s(CT.TASSE) + .6, f('e1')),
              ('un autre soir', f('e1'), f('e2')), ('mains (pulsation)', f('e2'), f('e3')), ('il écrit', f('e3'), s(CT.ENVOI - 100)), ('il hésite', s(CT.ENVOI - 100), s(CT.ENVOI)), ('la 4e note (1re seconde)', s(CT.ENVOI), s(CT.ENVOI) + 1), ('message lisible', s(CT.ENVOI) + 1, f('e4')), ('logo', f('e4'), f('e4') + 4), ('fin', f('e4') + 4, DUR)]
    print('%-30s %7s %9s %9s' % ('passage', 'niveau', '> 350 Hz', '< 350 Hz'))
    mes = {}
    for nom, a, b in lignes:
        mes[nom] = (niveau(x, a, b), niveau(x, a, b, (350, 0)), niveau(x, a, b, (20, 350))); print('%-30s %7.1f %9.1f %9.1f' % (nom, *mes[nom]))
    np.savez(ICI + '/tmp/mus.npz', **{k.replace(' ', '_'): v[:n_(DUR)].astype(np.float32) for k, v in mus.items()})
