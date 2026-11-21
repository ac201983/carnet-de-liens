# La partition du montage intime de « Ce qu'on ne dit pas par SMS ». Musique originale, écrite ici note par note pour ce film.
# Récrite en entier le 21 novembre 2026 au soir : Antonio a demandé une musique vraiment meilleure, qui fasse rêver.
# Elle est jouée par un vrai piano et de vrais violoncelles, enregistrés note par note (instruments.py), et non plus par des sons de synthèse.
#
# Ré mineur, une berceuse à 6 croches par mesure : une mesure dure 2 secondes (60 images), une croche 10 images.
# Tous les instants sont donnés en images du film (itemps.py), pour que la musique tombe sur le montage.
#
# La phrase : la, fa, mi… et le ré qui ne vient pas. Trois notes qu'on peut fredonner (un grand saut qui monte, un petit pas qui redescend).
#   1. Le soir. La première note arrive seule, dans le silence, sur la main immobile. Puis fa, mi. La phrase reste en l'air.
#   2. « Ce qui lui manque ». La main gauche se met à bercer pendant qu'il écrit, la phrase revient, toujours sans sa fin.
#      « Poser les mains à plat » : la berceuse s'arrête, 2 accords se posent, une main puis l'autre.
#   3. Le lendemain : plus clair (fa majeur), plus haut. La phrase s'interrompt pour laisser entendre le domino.
#   4. Le père regarde sa fille : la phrase, dans le grave. La fille regarde son père : les violoncelles répondent, une tierce plus haut (do, la, sol).
#   5. Chez Bastien : les violoncelles chantent une vraie mélodie, faite du même geste (le saut qui monte, le pas qui redescend), sur la berceuse du piano.
#      Le piano leur répond dans l'aigu, comme une boîte à musique. Au sommet, quand la phrase de Bastien est écrite, les violoncelles reprennent la, fa, mi.
#      Ils s'effacent quand Rémi reçoit la fiche. Le café du dimanche n'a aucune musique.
#   6. Le père écrit enfin. La berceuse revient, la phrase aussi : la… fa, mi pendant que le pouce hésite, et le ré à l'instant où il envoie.
#      C'est la seule fois où l'accord est majeur. Les violoncelles tiennent sa résonance sous le nom du site.
import numpy as np, sys, os
INT_ = os.path.dirname(os.path.abspath(__file__)); sys.path[:0] = [INT_]
import itemps as IT
import instruments as I
IPS = 30.0
def s(image): return image / IPS
DUR = IT.TOTAL / IPS

# les accords de la berceuse : la basse, puis les 6 croches (elles montent et redescendent comme une vague)
AC = {'Dm': ('D2', ['D3', 'A3', 'D4', 'F4', 'D4', 'A3']), 'Am7': ('A2', ['E3', 'A3', 'C4', 'G4', 'C4', 'A3']), 'F': ('F2', ['F3', 'C4', 'F4', 'A4', 'F4', 'C4']),
      'C': ('C3', ['G3', 'C4', 'E4', 'G4', 'E4', 'C4']), 'Bb': ('Bb2', ['F3', 'Bb3', 'D4', 'F4', 'D4', 'Bb3']), 'Bbmaj7': ('Bb2', ['F3', 'Bb3', 'D4', 'A4', 'D4', 'Bb3']),
      'F/A': ('A2', ['F3', 'A3', 'C4', 'F4', 'C4', 'A3']), 'Gm7': ('G2', ['D3', 'F3', 'Bb3', 'D4', 'Bb3', 'F3']), 'Csus': ('C3', ['G3', 'C4', 'F4', 'G4', 'E4', 'C4']),
      'Dm.': ('D3', ['A3', 'D4', 'F4', 'A4', 'F4', 'D4']), 'F/C': ('C3', ['F3', 'A3', 'C4', 'F4', 'C4', 'A3']), 'Dm7': ('D3', ['A3', 'C4', 'F4', 'A4', 'F4', 'C4']),
      'C/E': ('E3', ['G3', 'C4', 'E4', 'G4', 'E4', 'C4']), 'F.': ('F2', ['F3', 'A3', 'C4', 'F4', 'C4', 'A3']), 'Gm9': ('G2', ['D3', 'G3', 'Bb3', 'F4', 'Bb3', 'G3'])}

class Mains:
    """Les 2 mains du pianiste et leurs petites inégalités (quelques millièmes de seconde, un rien de force) : sans elles, on entendrait une machine."""
    def __init__(self, alea=11):
        self.rng = np.random.default_rng(alea)
        self.chant_ = I.Piano(tenue=1.0, largeur=.16)                       # la main droite : le chant
        self.berce = I.Piano(tenue=.6, largeur=.40)                        # la main gauche : la berceuse
    RESPIRE = (0, .12, .08, 0, .15, .30)                                    # la berceuse respire : la dernière croche de chaque mesure arrive un rien plus tard (en images)
    def j(self, sig=.2): return float(self.rng.normal(0, sig))              # en images : 0,2 image = 7 millièmes de seconde
    def jf(self, sig=1.5): return float(self.rng.normal(0, sig))
    def chant(self, image, duree, nom, force, juste=False):
        self.chant_.n(s(image + (0 if juste else self.j(.12))), s(duree), nom, force + (0 if juste else self.jf(1.0)))
    def mesure(self, image, basse, croches, force, pas=10.0, tenue=None, forme=(1.0, .86, .92, 1.0, .90, .84)):
        """Une mesure de berceuse : une basse tenue et des croches. La pédale tient le tout jusqu'à la mesure suivante."""
        fin = image + (tenue if tenue else pas * len(croches)); pb = self.berce
        if basse: pb.n(s(image + self.j(.1)), s(fin - image - 1.5), basse, force - 1 + self.jf())
        for e, nom in enumerate(croches):
            if nom is None: continue
            a = image + e * pas + (self.RESPIRE[e] if len(croches) == 6 else 0) + self.j(.2 if e else .1)
            pb.n(s(a), s(max(2.0, min(pas * 1.7, fin - 1.5 - a))), nom, force * forme[e % len(forme)] + self.jf())
        pb.pedale(s(image - .4), s(fin - .9))
    def accord(self, image, notes, force, duree, roule=.75, voix=None, haut=3.0):
        """Un accord posé, à peine égrené du grave vers l'aigu. La note du haut chante un peu plus."""
        v = voix or self.berce
        for i, nom in enumerate(notes):
            v.n(s(image + i * roule + self.j(.06)), s(duree - i * roule - 1.5), nom, force + (haut if i == len(notes) - 1 else 0) - (1.5 if 0 < i < len(notes) - 1 else 0) + self.jf(.8))
        v.pedale(s(image - .4), s(image + duree - .9))

def ecrire(alea=11):
    M = Mains(alea); pc, pb = M.chant_, M.berce
    vc = I.Cordes('v', place=.14); hv = I.Cordes('v', place=.22); ha = I.Cordes('a', place=-.22); reperes = []

    # ------------------------------------------------------------------ 1. le soir : la première note, seule, dans le silence. Puis fa, mi. La phrase reste en l'air.
    a = IT.NOTE1
    M.chant(a, 205, 'A4', 50, juste=True); M.chant(a + 60, 30.5, 'F5', 47); M.chant(a + 90, 115, 'E5', 41)
    reperes += [('la', s(a)), ('fa', s(a + 60)), ('mi', s(a + 90))]

    # ------------------------------------------------------------------ 2. « Ce qui lui manque » : la main gauche berce pendant qu'il écrit
    B = IT.DEBUT['b1'] + 27                                                # 432 : il vient de toucher le champ
    M.mesure(B, *AC['Dm'], 29)
    M.mesure(B + 60, *AC['Dm'], 30); M.chant(B + 60, 64, 'A4', 47)
    M.mesure(B + 120, 'Bb2', ['F3', 'Bb3', 'D4'], 31, tenue=30); M.mesure(B + 150, 'C3', ['G3', 'C4', 'E4'], 30, tenue=30)
    M.chant(B + 120, 30.5, 'F5', 49); M.chant(B + 150, 88, 'E5', 42)        # mi reste en l'air, sur le carnet
    M.mesure(B + 180, *AC['Am7'], 28)
    reperes.append(('la berceuse', s(B)))
    # « Poser les mains à plat » : la berceuse ralentit et s'arrête. 2 accords se posent, une main puis l'autre.
    b3 = IT.DEBUT['b3']                                                    # 708 : ses 2 mains sur la table
    for image, nom, f in ((b3 - 36, 'Bb2', 30), (b3 - 35.7, 'F3', 26), (b3 - 23.5, 'Bb3', 26), (b3 - 11, 'D4', 27)): pb.n(s(image), s(b3 - 1.5 - image), nom, f)
    pb.pedale(s(b3 - 36.4), s(b3 - .9))
    M.accord(b3, ['G2', 'D3', 'Bb3', 'D4', 'F4', 'A4'], 33, 60); M.accord(b3 + 60, ['C3', 'G3', 'Bb3', 'D4', 'F4'], 30, 60)
    reperes.append(('les mains', s(b3)))

    # ------------------------------------------------------------------ 3. le lendemain : plus clair, plus haut. La phrase (do, la, sol) s'arrête pour le domino.
    b4, b5, b6 = IT.DEBUT['b4'], IT.DEBUT['b5'], IT.DEBUT['b6']              # 828, 906, 972
    M.mesure(b4, *AC['F'], 33, pas=(b5 - b4) / 6); M.chant(b4, b5 - b4 + 2, 'C5', 45)
    demi = (b6 - b5) / 2
    M.mesure(b5, 'Bb2', ['F3', 'Bb3', 'D4'], 32, pas=demi / 3, tenue=demi); M.mesure(b5 + demi, 'C3', ['G3', 'C4', 'E4'], 30, pas=demi / 3, tenue=demi + 56)
    M.chant(b5, demi + 1, 'A5', 44); M.chant(b5 + demi, demi + 52, 'G5', 38)
    reperes.append(('le lendemain', s(b4)))

    # ------------------------------------------------------------------ 4. le père regarde sa fille : la phrase, dans le grave
    b7 = IT.DEBUT['b7']                                                    # 1032
    M.chant(b7, 38, 'A3', 42); M.chant(b7 + 20, 21, 'F4', 42); M.chant(b7 + 40, 19, 'E4', 37)
    for image, nom, f, d in ((b7, 'D3', 32, 38), (b7 + .25, 'D2', 28, 38), (b7 + 40, 'C3', 30, 18.5), (b7 + 40.3, 'G3', 27, 18.5)): pb.n(s(image), s(d), nom, f)
    pb.pedale(s(b7 - .4), s(b7 + 39)); pb.pedale(s(b7 + 39.6), s(b7 + 59))
    reperes.append(('le père', s(b7)))

    # ------------------------------------------------------------------ 5. la fille regarde son père : les violoncelles entrent et répondent, une tierce plus haut
    v = IT.CELLO                                                           # 1092
    M.mesure(v, *AC['F'], 31); M.mesure(v + 60, *AC['C'], 30, pas=(IT.RACCORD - v - 60) / 6)
    vc.n(s(v), s(30), 'C4', .2); vc.n(s(v + 30), s(30), 'A4', .3, lie=True); vc.n(s(v + 60), s(IT.RACCORD - v - 60), 'G4', .25, lie=True)
    reperes.append(('violoncelles', s(v)))

    # ------------------------------------------------------------------ 6. chez Bastien : la mélodie des violoncelles sur la berceuse
    C = IT.RACCORD                                                         # 1215
    plan = [('Bb', 30), ('F/A', 30), ('Gm7', 31), ('Csus', 31), ('Dm.', 33), ('Bb', 34), ('F/C', 31), ('C', 28), ('Dm7', 35), ('C/E', 37), ('F.', 33), ('Gm7', 31)]
    for k, (acc, f) in enumerate(plan):
        if acc == 'Csus':                                                  # do en suspens : la pédale change quand le fa descend sur le mi, la basse reste sous le doigt
            pb.n(s(C + 60 * k), s(58.5), 'C3', f - 1); M.mesure(C + 60 * k, None, ['G3', 'C4', 'F4', 'G4'], f, tenue=40); M.mesure(C + 60 * k + 40, None, ['E4', 'C4'], f * .9, tenue=20)
        else: M.mesure(C + 60 * k, *AC[acc], f)
    d1 = IT.DEBUT['d1']                                                    # 1980 : la fiche change de main
    c13 = C + 720; pas = (d1 - c13) / 4                                    # la dernière mesure s'élargit : do, en suspens, puis sa tierce
    for i, (nom, f) in enumerate((('G3', 27), ('Bb3', 27), ('F4', 29), ('E4', 26))): pb.n(s(c13 + i * pas + M.j()), s((pas - .8) if nom == 'F4' else (d1 - 1.5 - c13 - i * pas)), nom, f)
    pb.n(s(c13), s(d1 - 1.5 - c13), 'C3', 31); pb.pedale(s(c13 - .4), s(c13 + 3 * pas - .7)); pb.pedale(s(c13 + 3 * pas - .3), s(d1 - .9))
    M.accord(d1, ['F2', 'C3', 'A3', 'C4', 'F4'], 34, 150, roule=1.0)       # fa majeur : la fiche est donnée. Le piano se tait ensuite jusqu'au soir.
    mel = [(0, 30, 'D4', .25, False), (30, 30, 'Bb4', .35, True), (60, 60, 'A4', .30, True),                                    # ré, si bémol, la
           (120, 30, 'Bb3', .25, True), (150, 30, 'G4', .30, True), (180, 40, 'F4', .30, True), (220, 20, 'E4', .25, True),       # si bémol, sol, fa, mi
           (240, 30, 'F4', .30, False), (270, 30, 'D5', .45, True), (300, 40, 'C5', .45, True), (340, 20, 'Bb4', .35, True),      # fa, ré, do, si bémol
           (360, 60, 'A4', .25, True), (420, 60, 'G4', .08, True),                                                               # la, sol : il choisit sa phrase, il l'écrit
           (480, 30, 'A4', .40, False), (510, 30, 'F5', .60, True), (540, 30, 'E5', .60, True), (570, 30, 'C5', .45, True),       # la, fa, mi : la phrase du père, au sommet
           (600, 60, 'A4', .35, True), (660, 60, 'Bb4', .30, True), (720, d1 - c13, 'G4', .25, True), (d1 - C, 118, 'A4', .20, True)]
    for a, d, nom, timbre, lie in mel: vc.n(s(C + a), s(d), nom, timbre, lie)
    vc.nuance([(0, .40), (s(v), .40), (s(v + 30), .58), (s(v + 60), .62), (s(v + 108), .50),
               (s(C), .50), (s(C + 30), .66), (s(C + 60), .62), (s(C + 115), .46), (s(C + 120), .50), (s(C + 150), .64), (s(C + 180), .62), (s(C + 220), .50), (s(C + 237), .42),
               (s(C + 240), .55), (s(C + 270), .78), (s(C + 300), .74), (s(C + 340), .60), (s(C + 360), .54), (s(C + 405), .42), (s(C + 420), .36), (s(C + 475), .33),
               (s(C + 480), .52), (s(C + 510), .82), (s(C + 540), .86), (s(C + 570), .72), (s(C + 600), .62), (s(C + 655), .50), (s(C + 660), .52), (s(C + 715), .44),
               (s(c13), .46), (s(d1 - 5), .40), (s(d1), .44), (s(d1 + 30), .36), (s(d1 + 112), 0.0), (DUR + 9, 0.0)])
    # le piano répond aux violoncelles dans l'aigu, comme une boîte à musique, quand ils tiennent une note : la phrase en fa (do, la, sol), puis leur geste, puis la phrase du père (la, fa, mi)
    # Chaque fois, la 1re et la 3e note sonnent ensemble (une quinte). La dernière note du 3e écho (mi) tombe sur la coupe, quand on lit la fiche de Bastien.
    for base, notes, f, reste in ((C + 80, ('C5', 'A5', 'G5'), 35, 58), (C + 380, ('F5', 'D6', 'C6'), 34, 58), (C + 610, ('A5', 'F6', 'E6'), 32, 27)):
        M.chant(base, 38, notes[0], f); M.chant(base + 10, 11, notes[1], f + 2); M.chant(base + 20, reste, notes[2], f - 1)
    reperes += [('Bastien', s(C)), ('sommet', s(C + 510)), ('la fiche donnée', s(d1))]

    # ------------------------------------------------------------------ 7. le café du dimanche : rien. Puis le père écrit : la berceuse revient, et la phrase, cette fois, trouve sa fin.
    E = IT.ENVOI                                                           # 2910 : son pouce touche « Envoyer »
    M.mesure(E - 240, *AC['Dm'], 28); M.mesure(E - 180, *AC['Bbmaj7'], 29); M.mesure(E - 120, *AC['Gm9'], 30)
    M.chant(E - 120, 63, 'A4', 50)                                         # la…
    M.mesure(E - 60, 'A2', ['A3', 'D4', 'F4'], 31, tenue=30)                # … fa (ré mineur sur un la : tout attend)
    M.chant(E - 60, 30.5, 'F5', 52)
    for image, nom, f in ((E - 30, 'A2', 31), (E - 29.7, 'G3', 27), (E - 29.4, 'C#4', 28)): pb.n(s(image), s(E - 4.6 - image), nom, f)    # … mi : la berceuse s'arrête, le pouce hésite
    pb.pedale(s(E - 30.4), s(E - 4.0)); M.chant(E - 30, 27.5, 'E5', 46)       # la pédale se lève un rien avant l'envoi : l'accord d'attente ne déborde pas sur le ré
    # le ré, à l'instant où il envoie. Ré majeur, pour la première fois : la basse d'abord, à peine avant, et la note du chant exactement sur le pouce.
    for i, (nom, f) in enumerate((('D2', 38), ('A2', 35), ('D3', 35), ('A3', 34), ('F#4', 37), ('A4', 33))): pb.n(s(E - 2.2 + i * .4), s(320), nom, f)
    pb.pedale(s(E - 2.6), DUR + 6); pc.n(s(E), s(320), 'D5', 62)
    reperes += [('il écrit', s(E - 240)), ('la', s(E - 120)), ('fa', s(E - 60)), ('mi', s(E - 30)), ('ré', s(E))]
    # sa résonance : les violoncelles et les altos tiennent l'accord sous le nom du site, enflent à peine, et s'effacent
    for nom in ('D3', 'A3', 'D4'): hv.n(s(E + 1), s(280), nom, .12)
    for nom in ('F#4', 'A4'): ha.n(s(E + 1), s(280), nom, .10)
    e3 = IT.DEBUT['e3']
    for h in (hv, ha): h.nuance([(0, 0), (s(E), 0), (s(E + 24), .30), (s(e3 + 20), .62), (s(e3 + 80), .55), (s(e3 + 185), 0.0), (DUR + 9, 0.0)])
    return {'piano chant': pc, 'piano berceuse': pb, 'violoncelles': vc, 'résonance violoncelles': hv, 'résonance altos': ha}, reperes

if __name__ == '__main__':
    V, rep = ecrire()
    for nom, v in V.items(): print('%-24s %3d notes' % (nom, len(v.notes)))
    for nom, t in rep: print('%-18s %6.2f s (image %d)' % (nom, t, round(t * IPS)))
