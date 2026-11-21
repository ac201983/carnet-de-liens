# Le son du montage intime : la partition (ipartition.py) et les bruits (ibruits.py, cine/bruits.py), mêlés sur le minutage du film (itemps.py).
# python3 imixage.py  →  tmp/film.wav, tmp/film-son.png (une image du son, faute de pouvoir l'écouter), tmp/son.json (les repères), et un tableau des niveaux.
# Au début, on n'entend que la pièce. La vibration vient ensuite. La première note de piano arrive dans le silence, sur la main immobile.
# Le café du dimanche n'a aucune musique : la pièce, des oiseaux derrière la fenêtre, la tasse.
import sys, os, json, numpy as np
INT_ = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(INT_); sys.path[:0] = [INT_, FILM + '/cine', FILM]
import son as S
import itemps as IT, ipartition as PA, synthe as Y, ibruits as IB, bruits as B
from cmixage import limite, niveau, enveloppe, n_
SR = S.SR; IPS = 30.0
def s(image): return image / IPS
DUR = IT.TOTAL / IPS
# la force de chaque voix, sa part de salle, et le feutre du piano (les aigus retenus, en Hz ; 0 pour le violoncelle)
VOIX = {'piano motif': (68.0, .22, 2700), 'piano fond': (34.0, .22, 2300), 'violoncelle': (4.0, .30, 0)}
MAITRE = 1.5

def musique():
    V, rep = PA.ecrire(); out = {}
    for nom, v in V.items():
        g, salle, feutre = VOIX[nom]; x = v.rendu()
        if feutre: x = Y.filtre(x, 'low', feutre)
        out[nom] = Y.dans_la_salle(x * g, salle, 2.3 if nom == 'violoncelle' else 1.9)
    return out, rep

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
    # la pièce de domino touche le bois
    M.pose(S.dans_la_piece(B.domino(), .2), s(IT.DOMINO), .50, 'domino')
    # la feuille pliée change de main : un froissement court
    M.pose(S.dans_la_piece(B.papier(12, .85), .18), s(IT.PAPIER) - .30, .42, 'papier')
    # dimanche matin : le café qu'on verse s'entend avant la coupe. Puis la tasse qu'il soulève, et l'ambiance seule (la pièce, des oiseaux derrière la fenêtre).
    d2 = s(D['d2']); fin = s(D['e1'])
    M.pose(S.dans_la_piece(IB.verse(5, 2.5), .16), s(IT.VERSE), .38, 'café versé')
    M.pose(S.dans_la_piece(IB.tasse_levee(), .2), s(IT.TASSE), .26, 'tasse')
    a = IB.matin(rng, fin - s(IT.VERSE) + .4); na = len(a)
    M.pose(a * enveloppe(na, [(0, 0), (.5, .5), (d2 - s(IT.VERSE), 1.0), (na / SR - .43, 1.0), (na / SR - .4, 0), (na / SR, 0)])[:, None], s(IT.VERSE), .10)
    o = IB.oiseaux(fin - d2 - .1); no = len(o)
    M.pose(S.dans_la_piece(o * enveloppe(no, [(0, 0), (.4, 1.0), (no / SR - .14, 1.0), (no / SR - .04, 0), (no / SR, 0)]), .3, .5), d2 + .1, .09, 'oiseaux')
    x = M.x * MAITRE; t = np.arange(len(x)) / SR; x = x * (1 - S.lisse(t, DUR - 1.2, DUR))[:, None]
    x, baisse, part = limite(x, .84); print('limiteur : baisse la plus forte %.1f dB, à l’œuvre pendant %.1f %% du film' % (baisse, part * 100))
    return x, M.reperes, mus

if __name__ == '__main__':
    os.makedirs(INT_ + '/tmp', exist_ok=True)
    pistes = None
    if '--pistes' in sys.argv and os.path.exists(INT_ + '/tmp/mus.npz'):          # les voix déjà rendues (pour ne régler que les bruits et les niveaux)
        z = np.load(INT_ + '/tmp/mus.npz'); pistes = ({k.replace('_', ' '): np.vstack([z[k].astype(np.float64), np.zeros((n_(4.0), 2))]) for k in z.files}, PA.ecrire()[1])
    x, rep, mus = film(pistes)
    x = x[:n_(DUR)]
    from scipy.io import wavfile
    wavfile.write(INT_ + '/tmp/film.wav', SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
    S.regarde(x, INT_ + '/tmp/film-son.png', rep)
    json.dump({'duree': DUR, 'reperes': rep}, open(INT_ + '/tmp/son.json', 'w'), ensure_ascii=False, indent=0)
    print('durée', round(len(x) / SR, 3), 's | crête', round(float(np.abs(x).max()), 3))
    D = IT.DEBUT; f = lambda k, i=0: s(D[k] + i)
    lignes = [('la pièce seule', .3, s(IT.VIB1) - .02), ('vibration 1', s(IT.VIB1), s(IT.VIB1) + .25), ('vibration 2', s(IT.VIB2), s(IT.VIB2) + .2), ('le fil (la pièce)', f('a2'), f('a3')), ('main immobile, avant la note', f('a3'), s(IT.NOTE1) - .02),
              ('note 1', s(IT.NOTE1), s(IT.NOTE1) + 1.4), ('notes 2 et 3', s(IT.NOTE1) + 1.5, f('b1')), ('Déposer', f('b1'), f('b2')), ('carnet', f('b2'), f('b3')), ('ses mains', f('b3'), f('b4')), ('lendemain', f('b4'), f('b6')),
              ('juste avant le domino', s(IT.DOMINO) - .5, s(IT.DOMINO) - .03), ('domino', s(IT.DOMINO), s(IT.DOMINO) + .15), ('le père (motif grave)', f('b7'), f('b8')), ('la fille (violoncelle)', f('b8'), f('c1')),
              ('Bastien et sa mère', f('c1'), f('c2')), ('Passer le relais', f('c2'), f('c4')), ('il écrit sa phrase', f('c4'), f('c5')), ('sa fiche', f('c5'), f('d1')), ('papier', s(IT.PAPIER) - .3, s(IT.PAPIER) + .5),
              ('la fiche (le violoncelle s’efface)', s(IT.PAPIER) + .6, s(IT.VERSE) - .05), ('café versé', s(IT.VERSE), f('d2')), ('tasse', s(IT.TASSE), s(IT.TASSE) + .25), ('dimanche, l’ambiance seule', s(IT.TASSE) + 1.0, f('e1') - .1),
              ('retour du père (la pièce)', f('e1'), f('e2')), ('il cherche', f('e2'), s(IT.ENVOI - 140)), ('les 3 notes', s(IT.ENVOI - 135), s(IT.ENVOI) - .02), ('la 4e note (1re seconde)', s(IT.ENVOI), s(IT.ENVOI) + 1), ('message lisible', s(IT.ENVOI) + 1, f('e3')), ('logo', f('e3'), f('e3') + 4), ('fin', f('e3') + 4, DUR)]
    print('%-36s %7s %9s %9s' % ('passage', 'niveau', '> 350 Hz', '< 350 Hz'))
    for nom, a, b in lignes: print('%-36s %7.1f %9.1f %9.1f' % (nom, niveau(x, a, b), niveau(x, a, b, (350, 0)), niveau(x, a, b, (20, 350))))
    np.savez(INT_ + '/tmp/mus.npz', **{k.replace(' ', '_'): v[:n_(DUR)].astype(np.float32) for k, v in mus.items()})
