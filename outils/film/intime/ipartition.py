# La partition du montage intime de « Ce qu'on ne dit pas par SMS ». Musique originale, écrite ici note par note pour ce film.
# Ré mineur, 60 à la noire : un temps dure 30 images. Tous les instants sont donnés en images du film (itemps.py), pour que la musique tombe sur le montage.
#
# Un piano feutré, puis un violoncelle. Le motif a 3 notes qu'on peut fredonner (la, fa, mi). La phrase attend sa quatrième note (ré) : elle ne vient qu'à la fin.
#   1. Sa main immobile : la première note arrive dans le silence. Les 2 suivantes, lentes. La quatrième ne vient pas.
#   2. « Déposer ce qui pèse » : quelques notes graves, espacées. Quand sa phrase est écrite, le motif revient, plus doux.
#   3. Le carnet, ses 2 mains : 2 accords, comme 2 respirations.
#   4. Le lendemain : plus haut, plus léger. Puis rien, pour entendre le domino.
#   5. Le père relève les yeux : le motif au piano, plus grave. Sa fille le regarde : le violoncelle entre et reprend le motif un peu plus haut (do, la, sol), comme une réponse.
#   6. Chez Bastien : le violoncelle chante de longues notes sur des accords clairs (si bémol, fa). Quand sa phrase est écrite, le piano lui fait écho.
#   7. Rémi reçoit la fiche : le violoncelle s'efface. Le café du dimanche n'a aucune musique.
#   8. Le père écrit : 2 notes seulement, il cherche. Puis les 3 notes, et la quatrième à l'image où son pouce touche Envoyer. Elle résonne sous le nom du site,
#      où l'accord s'éclaire (ré majeur).
import numpy as np, sys, os
INT_ = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(INT_); sys.path[:0] = [INT_, FILM + '/cine']
import itemps as IT
import synthe as Y
from partition import Voix, m, s
IPS = 30.0; TEMPS = 30
DUR = IT.TOTAL / IPS
MOTIF = ('A4', 'F5', 'E5', 'D5')

def ecrire():
    V = {}; rep = []
    pm = V['piano motif'] = Voix(Y.PIANO); pf = V['piano fond'] = Voix(Y.PIANO); vc = V['violoncelle'] = Voix(Y.VIOLONCELLE)
    D = IT.DEBUT
    # 1. Sa main immobile (a3). La première note, seule. Puis les 2 autres, une toutes les 1,5 seconde. La troisième reste en l'air.
    n1 = IT.NOTE1; pm.n(n1, 160, 'A4', 47); pm.n(n1 + 45, 120, 'F5', 53); pm.n(n1 + 90, 84, 'E5', 43); pm.pedale(n1 - 1, 398)
    pf.n(n1 + 122, 50, 'A2', 30); pf.pedale(n1 + 120, 398)
    rep += [('note 1', s(n1)), ('note 2', s(n1 + 45)), ('note 3', s(n1 + 90))]
    # 2. « Déposer ce qui pèse » (b1) : des notes graves, espacées. La phrase est écrite à l'image 529 : le motif revient, d'un toucher plus léger.
    b = D['b1']
    pf.n(b, 100, 'D3', 36); pf.n(b + 30, 80, 'A3', 30); pf.n(b + 60, 56, 'F4', 30); pf.pedale(b - 1, b + 86)
    pf.n(b + 90, 100, 'D3', 32); pf.n(b + 120, 60, 'A3', 29); pf.pedale(b + 89, b + 146)
    r = b + 150; pm.n(r, 150, 'A4', 39); pm.n(r + 45, 110, 'F5', 44); pm.n(r + 90, 96, 'E5', 35); pm.pedale(r - 1, r + 188)
    pf.n(r + 2, 86, 'D3', 30); pf.n(r + 47, 86, 'Bb2', 31); pf.n(r + 92, 90, 'A2', 29); pf.pedale(r + 1, r + 188)
    rep += [('Déposer', s(b)), ('motif 2', s(r))]
    # 3. Le carnet, puis ses 2 mains à plat (b3) : 2 accords posés, comme 2 respirations.
    h = D['b3'] + 12
    for k, (nom, f) in enumerate((('D3', 35), ('A3', 30), ('F4', 33))): pf.n(h + 2 * k, 52, nom, f)
    for k, (nom, f) in enumerate((('Bb2', 33), ('F3', 28), ('D4', 31))): pf.n(h + 60 + 2 * k, 56, nom, f)
    pf.pedale(h - 1, h + 55); pf.pedale(h + 58, h + 122)
    rep += [('les mains', s(h))]
    # 4. Le lendemain (b4, b5) : plus haut, plus léger. Puis rien : on entend le domino.
    l = D['b4'] + 16
    pf.n(l - 6, 100, 'F3', 30); pf.n(l + 56, 56, 'C3', 28); pf.pedale(l - 7, l + 112)
    pm.n(l, 44, 'F5', 34); pm.n(l + 30, 44, 'A5', 38); pm.n(l + 60, 60, 'G5', 33); pm.pedale(l - 1, l + 112)
    rep += [('lendemain', s(l)), ('silence du domino', s(IT.DOMINO - 28))]
    # 5. Le père relève les yeux (b7) : le motif, plus grave. Sa fille le regarde (b8) : le violoncelle répond, un peu plus haut.
    p = D['b7']
    pm.n(p, 70, 'A3', 35); pm.n(p + 24, 60, 'F4', 39); pm.n(p + 48, 76, 'E4', 33); pm.pedale(p - 1, p + 126)
    pf.n(p + 1, 100, 'D3', 24); pf.pedale(p, p + 126)
    c = IT.CELLO
    vc.n(c + 2, 33, 'C4', 80); vc.n(c + 33, 32, 'A4', 86); vc.n(c + 63, 77, 'G4', 82)
    pf.n(c + 3, 56, 'F2', 34); pf.n(c + 5, 54, 'C3', 30); pf.n(c + 63, 56, 'C3', 31); pf.n(c + 65, 54, 'G3', 28); pf.pedale(c + 2, c + 60); pf.pedale(c + 62, c + 121)
    rep += [('motif grave', s(p)), ('violoncelle', s(c + 2))]
    # 6. Chez Bastien (c1 à c5) : de longues notes au violoncelle, des accords clairs au piano (un par 4 secondes : la basse et sa quinte, puis une note plus haut).
    q = D['c1']                                                              # 1215
    ligne = [(c + 138, 62, 'A4', 84), (c + 198, 92, 'Bb4', 88), (c + 288, 77, 'A4', 84), (c + 363, 122, 'G4', 82), (c + 483, 122, 'E4', 80), (c + 603, 122, 'F4', 84), (c + 723, 122, 'D4', 80), (c + 843, 150, 'C4', 78)]
    for a, d, nom, f in ligne: vc.n(a, d, nom, f)
    accords = [(q, ('Bb2', 'F3'), 'D4'), (q + 120, ('A2', 'F3'), 'C4'), (q + 240, ('G2', 'D3'), 'Bb3'), (q + 360, ('C3', 'G3'), 'E4'), (q + 480, ('F2', 'C3'), 'A3'), (q + 600, ('Bb2', 'F3'), 'D4'), (q + 720, ('C3', 'G3'), 'E4')]
    for a, bas, haut in accords:
        pf.n(a, 100, bas[0], 33); pf.n(a + 2, 98, bas[1], 29); pf.n(a + 60, 56, haut, 30); pf.pedale(a - 1, a + 116)
    e = D['c4'] + 165                                                        # sa phrase est écrite (1717) : le piano lui fait écho, sur les notes du violoncelle
    pm.n(e, 40, 'C5', 40); pm.n(e + 30, 40, 'A5', 44); pm.n(e + 60, 90, 'G5', 37); pm.pedale(e - 1, e + 150)
    rep += [('Bastien', s(q)), ('écho', s(e))]
    # 7. Rémi reçoit la fiche (d1) : un dernier accord, le violoncelle s'efface. Ensuite, plus aucune musique jusqu'au retour du père.
    g = D['d1']
    pf.n(g, 110, 'F2', 34); pf.n(g + 2, 108, 'C3', 30); pf.n(g + 4, 106, 'A3', 31); pf.pedale(g - 1, g + 112)
    vc.nuance([(c - 4, 10), (c + 14, 86), (c + 60, 104), (c + 120, 86), (q, 80), (q + 80, 100), (q + 200, 84), (q + 330, 100), (q + 480, 86), (q + 560, 104), (q + 700, 90),
               (g, 88), (IT.PAPIER, 72), (IT.PAPIER + 96, 0)])
    rep += [('la fiche', s(g)), ('le violoncelle s’efface', s(IT.PAPIER))]
    # 8. Le père écrit (e2). 2 notes seulement : il cherche. Puis les 3 notes, une toutes les 1,5 seconde, et la quatrième à l'image où son pouce touche Envoyer.
    z = D['e2']; w = IT.ENVOI
    pf.n(z, 104, 'D3', 32); pf.n(z + 60, 50, 'A3', 28); pf.pedale(z - 1, z + 112)
    pm.n(z + 45, 60, 'A4', 38); pm.n(z + 90, 40, 'F5', 42); pm.pedale(z + 44, z + 130)
    pf.n(w - 136, 50, 'D3', 30); pf.pedale(w - 137, w - 84)
    pm.n(w - 135, 100, 'A4', 41); pm.n(w - 90, 80, 'F5', 47); pm.n(w - 45, 43, 'E5', 41); pm.pedale(w - 136, w - 3)
    pm.n(w, 300, 'D5', 62); pf.n(w, 300, 'D3', 41); pf.n(w + 1, 299, 'A3', 34); pm.pedale(w - 1, IT.TOTAL + 60); pf.pedale(w - 1, IT.TOTAL + 60)
    pf.n(w + 92, 200, 'A3', 36); pf.n(w + 94, 200, 'F#4', 42); pf.n(w + 96, 200, 'A4', 38); pf.n(w + 152, 150, 'D4', 34); pm.n(w + 154, 140, 'D5', 36)      # sous le nom du site, l'accord s'éclaire, et la note revient en écho
    rep += [('il cherche', s(z + 45)), ('les 3 notes', s(w - 135)), ('la 4e note', s(w)), ('logo', s(D['e3']))]
    return V, rep

if __name__ == '__main__':
    V, rep = ecrire()
    for nom, v in V.items(): print(nom, len(v.notes), 'notes')
    for nom, t in rep: print('%-26s %7.2f s' % (nom, t))
