# Le son du montage intime : la partition (ipartition.py, jouée par instruments.py), les bruits (ibruits.py, cine/bruits.py) et les tapotements du clavier,
# mêlés sur le minutage du film (itemps.py).
# python3 imixage.py  →  tmp/film.wav, tmp/film-son.png (une image du son, faute de pouvoir l'écouter), tmp/son.json (les repères), et un tableau des niveaux.
# Au début, on n'entend que la pièce. La vibration vient ensuite. La première note de piano arrive dans le silence, sur la main immobile.
# Le café du dimanche n'a aucune musique : la pièce, des oiseaux derrière la fenêtre, la tasse.
# Chaque fois que quelqu'un écrit, on entend ses doigts sur l'écran : un tapotement par lettre, à l'instant où la lettre apparaît à l'image.
import sys, os, json, numpy as np
INT_ = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(INT_); sys.path[:0] = [INT_, FILM + '/cine', FILM]
import son as S
import itemps as IT, ipartition as PA, instruments as I, ibruits as IB, bruits as B
from cmixage import limite, niveau, enveloppe, n_
SR = S.SR; IPS = 30.0
def s(image): return image / IPS
DUR = IT.TOTAL / IPS
# la force de chaque voix, sa part de salle et la durée de cette salle (en secondes)
VOIX = {'piano chant': (1.68, .40, 2.8), 'piano berceuse': (1.23, .24, 2.3), 'violoncelles': (7.5, .36, 2.6), 'résonance violoncelles': (2.9, .45, 2.8), 'résonance altos': (2.45, .45, 2.8)}
MAITRE = 1.5
TAPE = .085                                                                # la force des tapotements
TAPES = (.75, 1.0, 1.8, 1.0)                                               # et sa part pour chaque passage écrit : moins dans le silence du début, plus quand les violoncelles jouent

def rend(voix, dur):
    """Rend chaque voix seule, la place dans la salle, et lui donne sa force."""
    out = {}
    for nom, v in voix.items():
        g, salle, rt = VOIX[nom]; x = v.rendu(dur)
        if nom.startswith('piano'): x = I.filtre(I.filtre(x, 'low', 6500, 1), 'high', 70 if 'berceuse' in nom else 45)          # on retient le souffle de la prise, au-dessus des notes
        else: x = I.filtre(x - .40 * I.filtre(x, 'high', 2200, 1), 'low', 4800)    # les cordes : on retient le frottement des archets, au-dessus des notes (un son plus chaud, et les doigts sur l'écran restent audibles)
        out[nom] = I.dans_la_salle(x * g, salle, rt, graine=5 if nom.startswith('piano') else 9)
    return out
def musique():
    V, rep = PA.ecrire(); return rend(V, DUR + 6.0), rep

def frappes():
    """Les passages écrits : pour chacun, l'instant (en secondes) et le caractère de chaque lettre, tels que l'image les montre, et les autres appuis du doigt."""
    D = IT.DEBUT; Ra = json.load(open(INT_ + '/cap/fila2/reperes.json')); Re = json.load(open(INT_ + '/cap/file2/reperes.json'))
    import iplans as P
    t_b1 = "Ça me manque de jouer avec elle."; t_c4 = "prendre mon café seul, le matin."
    assert len(Ra['T1']) == len(Ra['TEXTE1']) and len(Re['T1']) == len(Re['TEXTE1']) and len(t_b1) == 32 and len(t_c4) == 32
    return [('« Elle va bien, merci. »', [(s(D['a2']) + t, c) for t, c in zip(Ra['T1'], Ra['TEXTE1'])], [(s(D['a2']) + Ra['T_APPUI'], 1.0)]),
            ('« Ça me manque de jouer avec elle. »', [(s(D['b1'] + P.T_FRAPPE + P.D_FRAPPE * (k + .5) / 32), c) for k, c in enumerate(t_b1)], [(s(D['b1'] + P.T_CHAMP), .9)]),
            ('« prendre mon café seul, le matin. »', [(s(D['c4'] + P.C.D2_F - P.C4_0 + k * P.C.D2_N / 32), c) for k, c in enumerate(t_c4)], [(s(D['c4'] + P.C.D2_T - P.C4_0), .9)]),
            ('« Tu as cinq minutes ce soir ? … »', [(s(D['e2']) + t, c) for t, c in zip(Re['T1'], Re['TEXTE1'])], [(s(IT.ENVOI), .55)])]
def pose_frappes(M, passages, rng, gain=TAPE, regulier=(1, 2), parts=TAPES):
    """Pose les tapotements. Dans les passages dont l'image écrit à intervalles égaux, les doigts gardent une petite irrégularité (15 millièmes de seconde au plus)."""
    instants = []
    for p, (nom, lettres, appuis) in enumerate(passages):
        for k, (t, c) in enumerate(lettres):
            t = t + (float(np.clip(rng.normal(0, .007), -.015, .015)) if p in regulier else 0) - .004
            x = IB.tape(rng, rng.uniform(.72, 1.0) * (.85 if c == ' ' else 1.0), espace=(c == ' '))
            M.pose(S.dans_la_piece(S.stereo(x, rng.uniform(-.18, .18)), .10), t, gain * parts[p], ('frappe ' + nom[:10]) if k == 0 else None); instants.append(t)
        for t, f in appuis: M.pose(S.dans_la_piece(S.stereo(IB.tape(rng, f), 0.0), .10), t - .004, gain * parts[p]); instants.append(t - .004)
    return instants

def film(pistes=None):
    rng = np.random.default_rng(41); M = S.Mixage(DUR + 3.0); D = IT.DEBUT
    mus, rep = musique() if pistes is None else pistes
    for nom, x in mus.items(): M.pose(x, 0, 1.0)
    for nom, t in rep: M.reperes.append((nom, t))
    # la pièce, le soir : elle est là dès la première image (avant la vibration, on n'entend qu'elle), jusqu'à « Déposer ». Elle revient avec le père, à la fin.
    c = S.cuisine(rng, DUR + 3.0)
    soir = enveloppe(len(c), [(0, 0), (.25, 1.0), (s(IT.VIB1), 1.0), (s(IT.NOTE1), .85), (s(D['b1']) - .3, .75), (s(D['b1']) + 1.2, 0), (s(D['e1']) - .02, 0), (s(D['e1']) + .15, .85), (s(IT.ENVOI), .75), (s(D['e3']) + .5, 0), (DUR + 3, 0)])[:, None]
    M.pose(c * soir, 0, 1.1)
    # le grave de la pièce ne passe pas dans le haut-parleur d'un téléphone : un peu d'air (le médium) s'y ajoute, pour qu'on l'entende quand même
    air = IB.matin(np.random.default_rng(43), DUR + 3.0); M.pose(S.filtre(air, 'low', 2600) * soir[:len(air)], 0, .028)
    # les 2 vibrations, brèves, avec le grésillement du boîtier contre le bois. La seconde est plus courte, un peu plus grave, un peu moins forte.
    v1 = IB.vibreur(1, IT.D_VIB1, 172.0, 1.0, .5); v2 = IB.vibreur(2, IT.D_VIB2, 166.0, .86, .42)
    M.pose(S.dans_la_piece(v1, .20), s(IT.VIB1), .40, 'vibration 1'); M.pose(S.dans_la_piece(v2, .20), s(IT.VIB2), .40, 'vibration 2')
    # les doigts sur l'écran, chaque fois que quelqu'un écrit
    instants = pose_frappes(M, frappes(), np.random.default_rng(45))
    # la pièce de domino touche le bois
    M.pose(S.dans_la_piece(B.domino(), .2), s(IT.DOMINO), .50, 'domino')
    # la feuille pliée change de main : un froissement court
    M.pose(S.dans_la_piece(B.papier(12, .85), .18), s(IT.PAPIER) - .30, .42, 'papier')
    # dimanche matin : le café qu'on verse s'entend avant la coupe. Puis la tasse qu'il soulève, et l'ambiance seule (la pièce, des oiseaux derrière la fenêtre).
    d2 = s(D['d2']); fin = s(D['e1'])
    M.pose(S.dans_la_piece(IB.verse(5, 2.5), .16), s(IT.VERSE), .38, 'café versé')
    M.pose(S.dans_la_piece(IB.tasse_levee(), .2), s(IT.TASSE), .26, 'tasse')
    # la pièce, le jour : très bas dès « Le lendemain », pour qu'il n'y ait jamais de silence complet entre 2 notes. Elle monte quand on verse le café et prend toute sa place le dimanche matin.
    j0 = s(D['b4']); a = IB.matin(rng, fin - j0 + .4); na = len(a)
    M.pose(a * enveloppe(na, [(0, 0), (1.0, .42), (s(D['d1']) - j0, .42), (s(IT.VERSE) - j0, .55), (d2 - j0, 1.0), (na / SR - .43, 1.0), (na / SR - .4, 0), (na / SR, 0)])[:, None], j0, .10)
    o = IB.oiseaux(fin - d2 - .1); no = len(o)
    M.pose(S.dans_la_piece(o * enveloppe(no, [(0, 0), (.4, 1.0), (no / SR - .14, 1.0), (no / SR - .04, 0), (no / SR, 0)]), .3, .5), d2 + .1, .09, 'oiseaux')
    x = M.x * MAITRE; t = np.arange(len(x)) / SR; x = x * (1 - S.lisse(t, DUR - 1.2, DUR))[:, None]
    x, baisse, part = limite(x, .84); print('limiteur : baisse la plus forte %.1f dB, à l’œuvre pendant %.1f %% du film' % (baisse, part * 100))
    return x, M.reperes, mus, instants

def tableau(x, instants):
    """Faute de pouvoir écouter : le niveau de chaque passage, puis chaque passage écrit (ses tapotements dépassent-ils la musique là où un téléphone les rend, au-dessus de 1 000 Hz ?)."""
    D = IT.DEBUT; f = lambda k, i=0: s(D[k] + i)
    lignes = [('la pièce seule', .3, s(IT.VIB1) - .02), ('vibration 1', s(IT.VIB1), s(IT.VIB1) + .25), ('vibration 2', s(IT.VIB2), s(IT.VIB2) + .2), ('main immobile, avant la note', f('a3'), s(IT.NOTE1) - .02),
              ('la (1re seconde)', s(IT.NOTE1), s(IT.NOTE1) + 1.0), ('la (la suite)', s(IT.NOTE1) + 1.0, s(IT.NOTE1) + 2.0), ('fa, mi', s(IT.NOTE1) + 2.0, f('b1')), ('il écrit ce qui lui manque', f('b1', 27), f('b1', 147)),
              ('la phrase sur la berceuse', f('b1', 147), f('b2')), ('carnet', f('b2'), f('b3')), ('ses mains (2 accords)', f('b3'), f('b4')), ('lendemain', f('b4'), f('b6')),
              ('juste avant le domino', s(IT.DOMINO) - .4, s(IT.DOMINO) - .03), ('domino', s(IT.DOMINO), s(IT.DOMINO) + .15), ('le père (la phrase, grave)', f('b7'), f('b8')), ('la fille (les violoncelles)', f('b8'), f('c1')),
              ('Bastien et sa mère', f('c1'), f('c2')), ('Passer le relais', f('c2'), f('c4')), ('il choisit, il écrit', f('c4'), f('c4', 120)), ('le sommet', f('c4', 120), f('c4', 240)), ('sa fiche', f('c5'), f('d1')),
              ('la fiche donnée', f('d1'), s(IT.PAPIER) + .8), ('les violoncelles s’effacent', s(IT.PAPIER) + .8, s(IT.VERSE) - .05), ('café versé', s(IT.VERSE), f('d2')), ('tasse', s(IT.TASSE), s(IT.TASSE) + .25),
              ('dimanche, l’ambiance seule', s(IT.TASSE) + 1.0, f('e1') - .1), ('retour du père (la pièce)', f('e1'), f('e2') + .7), ('il écrit, la berceuse revient', s(IT.ENVOI - 240), s(IT.ENVOI - 120)),
              ('la', s(IT.ENVOI - 120), s(IT.ENVOI - 60)), ('fa, mi (le pouce hésite)', s(IT.ENVOI - 60), s(IT.ENVOI) - .08), ('le ré (1re seconde)', s(IT.ENVOI), s(IT.ENVOI) + 1), ('sa résonance, message lisible', s(IT.ENVOI) + 1, f('e3')),
              ('logo', f('e3'), f('e3') + 3), ('bouton', f('e3') + 3, DUR - 1.2)]
    print('%-34s %7s %9s %9s' % ('passage', 'niveau', '> 350 Hz', '< 350 Hz'))
    for nom, a, b in lignes: print('%-34s %7.1f %9.1f %9.1f' % (nom, niveau(x, a, b), niveau(x, a, b, (350, 0)), niveau(x, a, b, (20, 350))))
    m = x.mean(axis=1); h = S.filtre(m, 'high', 1000); db = lambda v: 20 * np.log10(v + 1e-9)
    print('\n%-40s %6s %12s %14s %12s' % ('passage écrit', 'appuis', 'crête médiane', 'au-dessus 1 kHz', 'le fond là'))
    for nom, lettres, appuis in frappes():
        ts = [t for t, c in lettres]; cr = []; crh = []; fond = []
        for t in ts:
            a = n_(t - .006); cr.append(np.abs(m[a:a + n_(.03)]).max()); crh.append(np.abs(h[a:a + n_(.03)]).max()); fond.append(np.abs(h[n_(t - .045):n_(t - .012)]).max())
        print('%-40s %6d %10.1f dB %12.1f dB %10.1f dB' % (nom, len(ts), db(np.median(cr)), db(np.median(crh)), db(np.median(fond))))
    g, d = x[:, 0], x[:, 1]; print('\ngauche et droite réunies (un seul haut-parleur) : %.1f dB par rapport aux 2 voies ; ressemblance %.2f' % (db(np.sqrt(((g + d) ** 2 / 4).mean()) / np.sqrt(((g ** 2 + d ** 2) / 2).mean())), (g * d).sum() / np.sqrt((g ** 2).sum() * (d ** 2).sum())))

if __name__ == '__main__':
    os.makedirs(INT_ + '/tmp', exist_ok=True)
    pistes = None
    if '--pistes' in sys.argv and os.path.exists(INT_ + '/tmp/mus.npz'):          # les voix déjà rendues, sans leur force (pour ne régler que les niveaux et les bruits)
        z = np.load(INT_ + '/tmp/mus.npz'); pistes = ({k.replace('_', ' '): z[k].astype(np.float64) * VOIX[k.replace('_', ' ')][0] for k in z.files}, PA.ecrire()[1])
    x, rep, mus, instants = film(pistes)
    x = x[:n_(DUR)]
    from scipy.io import wavfile
    wavfile.write(INT_ + '/tmp/film.wav', SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
    S.regarde(x, INT_ + '/tmp/film-son.png', rep)
    json.dump({'duree': DUR, 'reperes': rep, 'frappes': [round(t, 4) for t in instants]}, open(INT_ + '/tmp/son.json', 'w'), ensure_ascii=False, indent=0)
    print('durée', round(len(x) / SR, 3), 's | crête', round(float(np.abs(x).max()), 3))
    tableau(x, instants)
    if pistes is None: np.savez(INT_ + '/tmp/mus.npz', **{k.replace(' ', '_'): (v / VOIX[k][0]).astype(np.float32) for k, v in mus.items()})
