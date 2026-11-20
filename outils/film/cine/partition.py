# La partition du montage cinématographique de « Ce qu'on ne dit pas par SMS ». Musique originale, écrite ici note par note pour ce film.
# Ré majeur, 72 à la noire : un temps dure 25 images. Tous les instants sont donnés en images du film (ctemps.py), pour que la musique tombe sur le montage.
#
# L'idée : un motif de 4 notes (fa dièse, la, mi, puis ré) dont la quatrième ne vient jamais. Elle est gardée pour l'instant où le père appuie sur Envoyer.
#   1. Après la vibration, le piano joue les 3 premières notes. La quatrième reste en suspens.
#   2. Quand le pouce hésite, une pulsation entre (un cœur : 2 coups rapprochés par temps). Il efface : plus rien.
#   3. « Ici, on commence par vous. » : le motif revient avec des cordes, et sa quatrième note est remplacée par le début de « Déposer » (un accord de si mineur).
#   4. « Déposer » : le piano en croches (les mots viennent), le motif plus haut quand la phrase du site apparaît.
#   5. Le lendemain : cordes pincées, légères. Un silence pour entendre le domino, puis les cordes enflent sur le regard, et respirent avec la goutte.
#   6. Bastien : une couleur plus chaude (sol), un violoncelle. Les cordes enflent quand la fiche passe, et s'arrêtent net pour le café.
#   7. Un autre soir : la pulsation revient sous les mains, le piano en croches pendant qu'il écrit, puis tout s'allège quand le pouce hésite :
#      les 3 notes, une par battement, et la quatrième à l'instant où il envoie. Elle résonne sous le logo.
import numpy as np, sys, os
ICI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, ICI)
import ctemps as CT
import synthe as Y
IPS = 30.0; TEMPS = 25                                                     # un temps = 25 images
DUR = CT.TOTAL / IPS
def s(image): return image / IPS
_N = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def m(nom):
    """« F#4 » → 66 (C4 = 60)."""
    n = _N[nom[0]]; r = nom[1:]
    if r[0] == '#': n += 1; r = r[1:]
    elif r[0] == 'b': n -= 1; r = r[1:]
    return 12 * (int(r) + 1) + n
MOTIF = ('F#', 'A', 'E', 'D')

class Voix:
    def __init__(self, prog): self.prog = prog; self.notes = []; self.cc = []; self.ped = []
    def n(self, image, duree, nom, force):                                 # une note : début (image), durée (images), nom, force
        for x in (nom if isinstance(nom, (list, tuple)) else [nom]): self.notes.append((s(image), s(image + duree), m(x), force))
    def nuance(self, pts):                                                 # [(image, valeur), …] : l'expression passe par ces points
        for (a, va), (b, vb) in zip(pts[:-1], pts[1:]): self.cc += Y.rampe(s(a), s(b), va, vb)
    def pedale(self, a, b): self.ped.append((s(a), s(b)))
    def rendu(self): return Y.piste(self.prog, self.notes, DUR + 4.0, self.cc, self.ped)

def ecrire(alea=7):
    rng = np.random.default_rng(alea); V = {}
    pm = V['piano motif'] = Voix(Y.PIANO); pa = V['piano croches'] = Voix(Y.PIANO); pp = V['pulsation piano'] = Voix(Y.PIANO); pz = V['pulsation cordes pincées'] = Voix(Y.PIZZ)
    pl = V['cordes pincées'] = Voix(Y.PIZZ); c1 = V['cordes 1'] = Voix(Y.CORDES); c2 = V['cordes 2'] = Voix(Y.CORDES); vc = V['violoncelle'] = Voix(Y.VIOLONCELLE); tr = V['tremolo'] = Voix(Y.TREMOLO); hp = V['harpe'] = Voix(Y.HARPE)
    reperes = []
    def coeur(image, force=60, ecart=8):
        """Un battement de cœur : 2 coups rapprochés. Le piano grave et un violoncelle pincé une octave plus haut, pour qu'on l'entende aussi sur un petit haut-parleur."""
        for d, k in ((0, 1.0), (ecart, .68)):
            pp.n(image + d, 14, 'D2', force * k); pz.n(image + d, 10, 'D3', force * k * .9); pp.n(image + d, 10, 'D3', force * k * .8); pz.n(image + d, 8, 'D4', force * k * .5)
        reperes.append(('battement', s(image)))
    def croches(image, temps, basse, motif4, force=42, vx=pa):
        """Le piano en croches : une basse au début, puis 4 notes qui tournent (2 par temps)."""
        if basse: vx.n(image, temps * TEMPS - 2, basse, force + 4)
        for k in range(temps * 2):
            j = image + k * TEMPS / 2 + float(rng.normal(0, .12)); f = force + (5 if k % 2 == 0 else 0) + float(rng.normal(0, 2.2))
            vx.n(j, 13, motif4[k % len(motif4)], f)

    # ------------------------------------------------------------------ 1. 21 h 40 : la vibration (un bruit, dans cmixage.py), puis 3 notes
    a = CT.MOTIF_A; pm.pedale(a[0] - 2, a[2] + 62)
    for image, nom, f in zip(a, ('F#4', 'A4', 'E4'), (50, 54, 58)): pm.n(image, 70, nom, f)
    pm.n(a[0], 70, 'D3', 34); pm.n(a[2], 60, 'A2', 36)
    reperes += [('motif 1', s(a[0])), ('la 4e manque', s(a[2] + TEMPS))]
    # la note qui reste en l'air : des cordes très douces, qui s'effacent pendant qu'il répond « Elle va bien, merci. »
    c1.n(a[2] - 4, 96, ['A4', 'E5'], 62); c1.nuance([(a[2] - 4, 0), (a[2] + 34, 58), (a[2] + 64, 50), (a[2] + 92, 0)])
    # « En fait, moi… » : quelque chose monte. Quand le pouce s'arrête, la pulsation entre. Il efface : tout s'arrête.
    d2 = CT.DEBUT['a2']; f2 = d2 + CT.FIL_A['f2']; ef = CT.EFFACE
    c2.n(f2 - 6, ef[0] + 18 - (f2 - 6), ['A3', 'E4'], 64); c2.nuance([(f2 - 6, 0), (CT.POUCE_STOP, 46), (ef[0] - 6, 70), (ef[0] + 16, 0)])
    for k, b in enumerate(CT.BATT_A): coeur(b, 56 + 6 * k)
    reperes += [('pulsation', s(CT.BATT_A[0])), ('silence', s(ef[1]))]
    # « Ici, on commence par vous. » : le motif revient, porté par les cordes. Sa quatrième note est remplacée par le si mineur de « Déposer ».
    b = CT.MOTIF_B; B0 = CT.DEBUT['b1']; assert b[2] + TEMPS == B0
    pm.pedale(b[0] - 2, B0 - 1)
    for image, nom, f in zip(b, ('F#4', 'A4', 'E4'), (56, 60, 64)): pm.n(image, 70, nom, f)
    pm.n(b[0], 48, 'D2', 42); pm.n(b[2], 24, 'A1', 40)
    c1.n(b[0] - 15, 40, ['D3', 'A3', 'F#4'], 66); c1.n(b[1], 25, ['D3', 'B3', 'F#4', 'A4'], 66); c1.n(b[2], 26, ['A2', 'D4', 'E4', 'G4'], 66)
    c1.nuance([(b[0] - 15, 0), (b[0], 30), (b[1], 52), (b[2] + 12, 66), (B0, 58)])
    reperes += [('motif 2', s(b[0]))]

    # ------------------------------------------------------------------ 2. « Déposer ce qui pèse » : 5 mesures. Les mots viennent.
    def mes(k): return B0 + 100 * k
    croches(mes(0), 4, 'B2', ('D4', 'A4', 'F#4', 'A4'), 40)
    croches(mes(1), 4, 'G2', ('D4', 'A4', 'G4', 'A4'), 42)
    croches(mes(2), 4, 'F#2', ('D4', 'A4', 'F#4', 'A4'), 44)
    croches(mes(3), 2, 'A2', ('D4', 'A4', 'E4', 'A4'), 44); croches(mes(3) + 50, 2, None, ('C#4', 'A4', 'E4', 'A4'), 44)
    croches(mes(4), 3, 'G2', ('D4', 'B4', 'G4', 'B4'), 42); croches(mes(4) + 75, 1, 'A2', ('D4', 'G4'), 40)
    pa.pedale(mes(0), mes(1) - 2); pa.pedale(mes(1), mes(2) - 2); pa.pedale(mes(2), mes(3) - 2); pa.pedale(mes(3), mes(4) - 2); pa.pedale(mes(4), mes(4) + 73); pa.pedale(mes(4) + 75, mes(5) - 2)
    for k, ch in enumerate((['B3', 'D4', 'F#4'], ['B3', 'D4', 'G4'], ['A3', 'D4', 'F#4'])): c2.n(mes(k) - 3, 101, ch, 62)
    c2.n(mes(3) - 3, 51, ['A3', 'D4', 'E4'], 62); c2.n(mes(3) + 48, 50, ['A3', 'C#4', 'E4'], 62); c2.n(mes(4) - 3, 76, ['G3', 'B3', 'D4'], 62); c2.n(mes(4) + 73, 28, ['G3', 'A3', 'D4'], 62)
    c2.nuance([(mes(0) - 3, 0), (mes(0) + 20, 46), (mes(2), 52), (mes(3) + 20, 72), (mes(4), 62), (mes(5) - 4, 48), (mes(5) + 6, 0)])
    # le motif, plus haut, quand la phrase proposée par le site apparaît (mesure 4). Toujours pas de quatrième note.
    pm.pedale(mes(3) + 23, mes(4) + 40)
    for j, (nom, f) in enumerate((('F#5', 56), ('A5', 60), ('E5', 62))): pm.n(mes(3) + 25 * (j + 1), 60, nom, f)
    reperes += [('Déposer', s(B0)), ('motif 3', s(mes(3) + 25))]

    # ------------------------------------------------------------------ 3. Le lendemain : léger. La fiche, le minuteur (les cordes pincées comptent le temps).
    C0 = CT.DEBUT['c1']; assert C0 == mes(5)
    def pince(image, temps, basse, motif4, force=52, pas=TEMPS / 2):
        if basse: pl.n(image, 20, basse, force + 6)
        k = 0; j = image
        while j < image + temps * TEMPS - .01:
            pl.n(j + float(rng.normal(0, .1)), 9, motif4[k % len(motif4)], force + (5 if k % 2 == 0 else 0) + float(rng.normal(0, 2))); k += 1; j += pas
    pince(C0, 4, 'D3', ('F#4', 'A4', 'D5', 'A4'), 50); pl.n(C0 + 50, 20, 'A2', 52)
    pince(C0 + 100, 3, 'G2', ('G4', 'B4', 'D5', 'B4'), 52); pl.n(C0 + 150, 20, 'D3', 52)
    fini = CT.DEBUT['c2'] + 76                                               # « C'est fini. Bravo. » (1246)
    pince(C0 + 175, 1, None, ('A4', 'B4', 'D5', 'B4'), 54, pas=TEMPS / 4)    # le disque finit de se vider : les notes se serrent
    pa.n(C0 + 100, 90, ['G2', 'D3'], 38); pa.n(C0, 90, ['D2', 'A2'], 38)
    pm.pedale(fini - 1, fini + 84); pm.n(fini, 80, ['A2', 'G3', 'D4', 'E4'], 36); pm.n(fini, 80, 'A5', 42)       # le temps est écoulé : un accord posé, une note claire
    reperes += [('lendemain', s(C0)), ('fini', s(fini))]
    # un silence pour le domino (1357). Puis les cordes enflent : il relève les yeux (fa dièse), elle sourit (la, puis mi).
    dom = CT.DOMINO; c4, c5, c6, c7 = (CT.DEBUT[k] for k in ('c4', 'c5', 'c6', 'c7'))
    c1.n(dom + 10, c5 - dom - 10 + 50, ['D3', 'A3'], 64)
    c1.n(c5 - 4, 54, ['F#3', 'D4', 'F#4'], 66); c2.n(c5 - 4, c6 - c5 + 4, 'F#5', 70)
    c1.n(c5 + 50, 76, ['G2', 'D3', 'B3', 'D4'], 66)
    c2.n(c6 - 2, 52, ['A4', 'A5'], 72); c1.n(c6 + 50, 52, ['A2', 'E3', 'C#4', 'G4'], 66); c2.n(c6 + 48, 54, ['E4', 'E5'], 72)
    c1.nuance([(dom + 10, 0), (c5, 54), (c6, 94), (c6 + 50, 114), (c7 - 8, 100), (c7 + 4, 0)]); c2.nuance([(c5 - 4, 0), (c5 + 10, 68), (c6, 100), (c6 + 50, 120), (c7 - 8, 104), (c7 + 4, 0)])
    pm.pedale(c5 - 1, c7 - 3); pm.n(c5, 70, 'F#4', 54); pm.n(c6, 48, 'A4', 60); pm.n(c6 + 50, 48, 'E4', 60)
    reperes += [('domino', s(dom)), ('motif 4', s(c5))]
    # la goutte : la musique respire avec elle. Elle finit de monter (ré, fa dièse, la, si), puis redescend (la, fa dièse, mi).
    haut = c7 + 42
    for j, (d, nom, f) in enumerate(((0, 'D4', 50), (14, 'F#4', 54), (28, 'A4', 58), (42, 'B4', 60), (58, 'A4', 52), (72, 'F#4', 46), (86, 'E4', 40))): hp.n(c7 + d, 40, nom, f)
    hp.n(c7, 60, 'D3', 44)
    c1.n(c7 + 2, 104, ['D3', 'A3', 'D4'], 60); c1.nuance([(c7 + 2, 0), (haut, 74), (c7 + 96, 24), (c7 + 108, 0)])
    reperes += [('goutte', s(c7)), ('sommet', s(haut))]

    # ------------------------------------------------------------------ 4. Bastien : une couleur plus chaude (sol). Un violoncelle l'accompagne.
    D0 = CT.DEBUT['d1']; d2_, d3_, d4_ = (CT.DEBUT[k] for k in ('d2', 'd3', 'd4'))
    croches(D0, 4, 'G2', ('B4', 'D5', 'A4', 'D5'), 36); croches(D0 + 100, 4, 'F#2', ('A4', 'D5', 'F#4', 'D5'), 38); croches(D0 + 200, 4, 'E2', ('G4', 'D5', 'E4', 'D5'), 38); croches(D0 + 300, 2, 'G2', ('G4', 'D5', 'B4', 'D5'), 40)
    for k in range(3): pa.pedale(D0 + 100 * k, D0 + 100 * k + 98)
    pa.pedale(D0 + 300, D0 + 348)
    vc.n(D0 + 20, 82, 'B3', 62); vc.n(D0 + 100, 100, 'A3', 64); vc.n(D0 + 200, 100, 'G3', 64); vc.n(D0 + 300, 52, 'B3', 66)
    vc.nuance([(D0 + 20, 0), (D0 + 50, 60), (D0 + 200, 70), (D0 + 300, 78), (d3_ + 4, 70), (d3_ + 30, 0)])
    reperes += [('Bastien', s(D0))]
    # il tend lui-même la fiche : après le bruit du papier, les cordes prennent de l'ampleur. Mi mineur, puis la septième : on attend le ré.
    c1.n(d3_ - 4, 54, ['E2', 'B2', 'G3', 'D4'], 70); c1.n(d3_ + 50, 50, ['A2', 'E3', 'G3', 'D4', 'A4'], 72); c1.n(d3_ + 100, 23, ['A2', 'E3', 'G3', 'C#4', 'A4'], 74)
    c2.n(d3_ - 2, 52, ['F#4', 'F#5'], 74); c2.n(d3_ + 50, 50, ['A4', 'A5'], 76); c2.n(d3_ + 100, 23, ['E4', 'E5'], 78)
    pap = CT.PAPIER[1]
    c1.nuance([(d3_ - 4, 0), (d3_ + 8, 36), (pap, 50), (d3_ + 100, 108), (d4_ - 3, 122), (d4_, 0)]); c2.nuance([(d3_ - 2, 0), (d3_ + 8, 38), (pap, 54), (d3_ + 100, 112), (d4_ - 3, 127), (d4_, 0)])
    pm.pedale(d3_ - 1, d4_ - 3); pm.n(d3_, 48, 'F#4', 50); pm.n(d3_ + 50, 48, 'A4', 58); pm.n(d3_ + 100, 22, 'E4', 62)
    reperes += [('la fiche passe', s(d3_)), ('motif 5', s(d3_))]
    # dimanche matin : presque plus rien. On entend la tasse (un bruit). Plus tard, deux cordes très douces, pour ne pas laisser l'image seule.
    c2.n(d4_ + 62, 96, ['A4', 'D5'], 56); c2.nuance([(d4_ + 62, 0), (d4_ + 100, 48), (d4_ + 140, 42), (d4_ + 170, 0)])
    reperes += [('café', s(d4_))]

    # ------------------------------------------------------------------ 5. Un autre soir
    E0 = CT.DEBUT['e1']; e2_, e3_, e4_ = (CT.DEBUT[k] for k in ('e2', 'e3', 'e4')); ENV = CT.ENVOI
    pm.pedale(E0, E0 + 140); pm.n(E0 + 4, 130, ['D2', 'D3'], 46); pm.n(E0 + 54, 80, 'A3', 34); pm.n(E0 + 104, 40, 'E4', 32)
    tr.n(E0 + 40, e2_ - E0 - 20, ['A3', 'D4'], 50); tr.nuance([(E0 + 40, 0), (E0 + 90, 26), (e2_ - 10, 34), (e2_ + 22, 0)])
    reperes += [('un autre soir', s(E0))]
    # la main à plat sur le bois : la pulsation revient, un battement par temps, jusqu'à l'envoi
    batt = list(range(e2_, ENV, TEMPS)); assert batt[-1] + TEMPS == ENV, batt[-3:]
    hes = ENV - 100                                                          # le pouce s'arrête au-dessus d'Envoyer (2770)
    for b_ in batt:
        f = 46 + 34 * (b_ - e2_) / (hes - e2_) if b_ < hes else 84 + 3 * (b_ - hes) / TEMPS
        if b_ < hes: coeur(b_, f)
        else: coeur(b_, f, 5); coeur(b_ + TEMPS / 2, f * .82, 5)            # il hésite : le cœur bat 2 fois plus vite
    c1.n(e2_ + 2, ENV - e2_ - 2, ['D2', 'D3'], 60); c1.nuance([(e2_ + 2, 0), (e3_, 30), (hes, 54), (ENV - 3, 70), (ENV, 0)])
    # il écrit : le piano en croches revient (celui de « Déposer »), et grandit
    ma, mb = ENV - 300, ENV - 200                                            # 2 mesures avant l'hésitation (2570 et 2670)
    croches(e3_ + 0, 3, 'B2', ('D4', 'A4', 'F#4', 'A4'), 44); croches(mb, 2, 'G2', ('D4', 'A4', 'G4', 'A4'), 50); croches(mb + 50, 2, 'A2', ('D4', 'G4', 'E4', 'G4'), 56)
    pa.pedale(e3_, mb - 2); pa.pedale(mb, mb + 48); pa.pedale(mb + 50, hes - 2)
    c2.n(e3_ - 3, mb - e3_ + 3, ['B3', 'D4', 'F#4'], 64); c2.n(mb - 3, 52, ['B3', 'D4', 'G4'], 64); c2.n(mb + 48, 52, ['A3', 'D4', 'G4'], 66)
    c2.nuance([(e3_ - 3, 0), (e3_ + 30, 36), (mb, 52), (hes - 6, 72), (hes + 4, 0)])
    # le pouce s'arrête : le piano se tait. Un tremolo sur la (on retient son souffle), et les 3 notes, une par battement.
    tr.n(hes - 2, ENV - hes + 2, ['A4', 'E5'], 58); tr.n(hes + 48, ENV - hes - 48, 'A5', 56); tr.nuance([(hes - 2, 0), (hes + 20, 30), (ENV - 30, 62), (ENV - 2, 82), (ENV, 0)])
    me = CT.MOTIF_E; pm.pedale(me[0] - 1, ENV - 1)
    for image, nom, f in zip(me, ('F#4', 'A4', 'E4'), (70, 77, 84)): pm.n(image, 70, nom, f); pm.n(image, 60, nom[:-1] + '5', f - 22)
    reperes += [('il écrit', s(e3_)), ('il hésite', s(hes)), ('motif 6', s(me[0]))]
    # il appuie sur Envoyer : la quatrième note. Elle résonne sous le logo.
    fin = CT.TOTAL
    pm.pedale(ENV, fin + 60); pm.n(ENV, fin - ENV + 40, 'D4', 96); pm.n(ENV, fin - ENV + 40, 'D5', 74); pm.n(ENV, fin - ENV + 40, 'D3', 72); pm.n(ENV, fin - ENV + 40, 'D2', 62)
    c1.n(ENV, fin - ENV + 30, ['D2', 'A2', 'D3', 'A3'], 66); c2.n(ENV, fin - ENV + 30, ['D4', 'F#4', 'A4', 'D5'], 68)
    for vx, k in ((c1, 1.0), (c2, 1.08)):
        vx.nuance([(ENV, 0), (ENV + 1, 70 * k), (ENV + 40, 94 * k), (e4_, 80 * k), (e4_ + 110, 66 * k), (fin - 6, 0)])
    reperes += [('la 4e note', s(ENV)), ('logo', s(e4_))]
    return V, reperes

if __name__ == '__main__':
    import time
    t0 = time.time(); V, rep = ecrire(); out = {}
    for nom, v in V.items():
        x = v.rendu(); out[nom] = x.astype(np.float32); print('%-26s %4d notes | crête %.3f | niveau moyen %.1f dB' % (nom, len(v.notes), float(np.abs(x).max()), 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)), flush=True)
    np.savez(ICI + '/tmp/pistes.npz', **{k.replace(' ', '_'): v for k, v in out.items()})
    import json; json.dump(rep, open(ICI + '/tmp/partition.json', 'w'), ensure_ascii=False, indent=0)
    print('partition rendue en', round(time.time() - t0, 1), 's', '| durée', round(DUR, 3))
