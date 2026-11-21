# La bande-annonce verticale de 30 secondes du montage intime : uniquement la fiche de Bastien, jusqu'au café du dimanche.
# Format I (1080 × 1920) : tout ce qui se lit tient dans la partie de l'image qu'Instagram laisse libre (hauteurs 269 à 1248, largeurs 65 à 1015).
# python3 iba.py image [plans]   python3 iba.py joint   python3 iba.py son   python3 iba.py voir sortie.jpg hauteur plan:i,i …
import numpy as np, cv2, sys, os, subprocess, time, json
INT_ = os.path.dirname(os.path.abspath(__file__)); FILM = os.path.dirname(INT_); sys.path[:0] = [INT_, FILM + '/cine', FILM]
IPS = 30
BA = [('t1', 105),   # la main de Bastien sur son stylo, le cadre s'élargit : lui et sa mère. « Bastien prépare son week-end chez son oncle Rémi. »
      ('t2', 75),    # « Passer le relais », le vrai écran
      ('t3', 225),   # il choisit « J'aime… » et écrit « prendre mon café seul, le matin. »
      ('t4', 90),    # sa fiche : on relit sa phrase, signée Bastien
      ('t5', 150),   # il tend la feuille pliée à Rémi : de celui qui donne à celui qui reçoit
      ('t6', 150),   # dimanche matin : son café, seul, comme il l'a demandé
      ('t7', 105)]   # « Parent écouté, parent éclairé »
DEB = {}; _n = 0
for _nom, _k in BA: DEB[_nom] = _n; _n += _k
TOTAL = _n; DB = dict(BA); assert TOTAL == 900
ECRIT = DEB['t3'] + 126                 # sa phrase est écrite (image 306)
PAPIER = DEB['t5'] + 62                 # la feuille change de main (le cadre passe sur elle)
VERSE = DEB['t6'] - 62                  # le café qu'on verse, avant la coupe
TASSE = DEB['t6'] + 36
NOTE4 = DEB['t7'] + 4                   # la quatrième note de la phrase du violoncelle (do, la, sol… fa), sur le nom du site
_d6 = {}

def image(nom, i, grain_f=None):
    import imontage as Mo; P = Mo.P; f = 'I'; n = DEB[nom] + i; W, H = Mo.FORMATS[f]
    def ui(x, clair=False): return Mo.finition_ui(x, n, f, clair=clair, grain_f=0)
    def ph(x): return Mo.raccord.finition(x, n, f, 0)
    g = .010
    if nom == 't1': out = ph(P.main_bastien(i, f, z=(8, 58), n=DB['t1'], cap=(54, 66))); g = Mo.raccord.GRAIN
    elif nom == 't2': out = ui(P.c2(i, f)[0], True)
    elif nom == 't3': out = ui(P.PP.filme(P.C.d2p, i + 50, f)[0], True)
    elif nom == 't4': out = ui(P.PP.filme(P.c5p, i + 30, f)[0], True)
    elif nom == 't5': out = ph(P.remise(i, f, v=(18, 118))); g = Mo.raccord.GRAIN
    elif nom == 't6':
        x = P.ifixes.zoom('cafe', f, float(Mo.lisse(i, -30, 190)))
        out = ph(P.pose3(x, 'dimanche', f, float(Mo.lisse(i, 6, 16)) * (1 - float(Mo.lisse(i, 72, 86))), bande=.5, doux=120)); g = Mo.raccord.GRAIN
    elif nom == 't7':
        if 'x' not in _d6: _d6['x'] = image('t6', DB['t6'] - 1, grain_f=0)
        img = P.PP.g2(i, f, _d6['x']); k = float(Mo.lisse(i / IPS, 0, .5))
        return Mo.grain(img * Mo.vignette(W, H, .1, .8), n, (.010 * (1 - .3 * k)) if grain_f is None else grain_f)
    else: raise SystemExit('plan inconnu ' + nom)
    if nom in ('t3', 't4') and i < 8:                                        # ces 2 écrans s'ouvrent en fondu sur le plan d'avant
        avant = {'t3': 't2', 't4': 't3'}[nom]; k = float(Mo.lisse(i + .5, 0, 8)); out = image(avant, DB[avant] - 1, grain_f=0) * (1 - k) + out * k
    g = g if grain_f is None else grain_f
    return Mo.grain(out, n, g) if g else out

def son(fichier):
    """Le son de la bande-annonce : la phrase du violoncelle (do, la, sol) qui attend sa quatrième note, le piano feutré, le papier, le café versé, le dimanche matin
    sans musique, puis la quatrième note (fa) sur le nom du site."""
    import son as S, synthe as Y, ibruits as IB, bruits as B
    from partition import Voix, m
    from cmixage import limite, niveau, enveloppe, n_
    import imixage as MX
    SR = S.SR; DUR = TOTAL / IPS; s = lambda im: im / IPS
    pm = Voix(Y.PIANO); pf = Voix(Y.PIANO); vc = Voix(Y.VIOLONCELLE)
    # le violoncelle : do, la, sol (la phrase attend), puis de longues notes
    for a, d, nom, f in ((2, 33, 'C4', 80), (33, 32, 'A4', 86), (63, 92, 'G4', 82), (153, 77, 'A4', 84), (228, 122, 'Bb4', 88), (348, 122, 'G4', 82), (468, 150, 'C4', 78)): vc.n(a, d, nom, f)
    vc.nuance([(0, 10), (16, 86), (60, 104), (120, 86), (228, 100), (348, 86), (430, 100), (495, 88), (PAPIER, 72), (PAPIER + 60, 0)])
    # le piano feutré : des accords espacés (fa, do, si bémol, fa avec la en basse, do, fa)
    for a, bas, haut in ((3, ('F2', 'C3'), None), (63, ('C3', 'G3'), None), (105, ('Bb2', 'F3'), 'D4'), (225, ('A2', 'F3'), 'C4'), (345, ('C3', 'G3'), 'E4'), (465, ('F2', 'C3'), 'A3')):
        pf.n(a, 100, bas[0], 33); pf.n(a + 2, 98, bas[1], 29); pf.pedale(a - 1, a + 100 if haut else a + 56)
        if haut: pf.n(a + 60, 56, haut, 30)
    e = ECRIT + 12; pm.n(e, 40, 'C5', 40); pm.n(e + 30, 40, 'A5', 44); pm.n(e + 60, 80, 'G5', 37); pm.pedale(e - 1, e + 138)      # sa phrase est écrite : le piano reprend la phrase du violoncelle
    # sur le nom du site, la quatrième note
    pm.n(NOTE4, 200, 'F5', 60); pf.n(NOTE4, 200, 'F3', 40); pf.n(NOTE4 + 1, 199, 'C4', 34); pf.n(NOTE4 + 45, 150, 'A4', 30); pm.pedale(NOTE4 - 1, TOTAL + 60); pf.pedale(NOTE4 - 1, TOTAL + 60)
    M = S.Mixage(DUR + 3.0); rng = np.random.default_rng(47)
    for nom, v in (('piano motif', pm), ('piano fond', pf), ('violoncelle', vc)):
        g, salle, feutre = MX.VOIX[nom]; x = Y.piste(v.prog, v.notes, DUR + 4.0, v.cc, v.ped)
        if feutre: x = Y.filtre(x, 'low', feutre)
        M.pose(Y.dans_la_salle(x * g, salle, 2.3 if nom == 'violoncelle' else 1.9), 0, 1.0)
    M.pose(S.dans_la_piece(B.papier(12, .85), .18), s(PAPIER) - .30, .42, 'papier')
    d6 = s(DEB['t6']); fin = s(DEB['t7'])
    M.pose(S.dans_la_piece(IB.verse(5, 2.3), .16), s(VERSE), .38, 'café versé')
    M.pose(S.dans_la_piece(IB.tasse_levee(), .2), s(TASSE), .26, 'tasse')
    a = IB.matin(rng, fin - s(VERSE) + .6); na = len(a)
    M.pose(a * enveloppe(na, [(0, 0), (.5, .5), (d6 - s(VERSE), 1.0), (na / SR - .7, 1.0), (na / SR - .1, 0), (na / SR, 0)])[:, None], s(VERSE), .10)
    o = IB.oiseaux(fin - d6 + .3, graine=11); no = len(o)
    M.pose(S.dans_la_piece(o * enveloppe(no, [(0, 0), (.4, 1.0), (no / SR - .7, 1.0), (no / SR - .1, 0), (no / SR, 0)]), .3, .5), d6 + .1, .09, 'oiseaux')
    x = M.x * MX.MAITRE; t = np.arange(len(x)) / SR; x = x * (1 - S.lisse(t, DUR - 1.0, DUR))[:, None]
    x, baisse, part = limite(x, .84); x = x[:n_(DUR)]
    from scipy.io import wavfile
    wavfile.write(fichier, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
    print('bande-annonce : durée', round(len(x) / SR, 3), 's | crête', round(float(np.abs(x).max()), 3), '| limiteur %.1f dB' % baisse)
    for nom, a, b in (('violoncelle (do, la, sol)', 0, 3.4), ('Passer le relais', 3.5, 6), ('il écrit', 6, s(ECRIT)), ('le piano reprend', s(ECRIT) + .4, 15), ('la fiche tendue', 16.5, s(VERSE)), ('café versé', s(VERSE), d6), ('dimanche, sans musique', d6 + 1.6, fin - .1), ('la 4e note', s(NOTE4), s(NOTE4) + 1), ('fin', 28.5, 30)):
        print('%-28s %7.1f %9.1f' % (nom, niveau(x, a, b), niveau(x, a, b, (350, 0))))

if __name__ == '__main__':
    quoi = sys.argv[1] if len(sys.argv) > 1 else 'image'; out = INT_ + '/out/I'; os.makedirs(out, exist_ok=True)
    if quoi == 'son': os.makedirs(INT_ + '/tmp', exist_ok=True); son(INT_ + '/tmp/bande-annonce.wav')
    elif quoi == 'joint':
        with open(out + '/liste.txt', 'w') as l:
            for nom, k in BA: l.write("file '%s/%s.mp4'\n" % (out, nom))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', out + '/liste.txt', '-c', 'copy', out + '/image.tmp.mp4'], check=True); os.replace(out + '/image.tmp.mp4', out + '/image.mp4')
        print(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=nb_frames,duration', '-of', 'csv=p=0', out + '/image.mp4'], capture_output=True, text=True).stdout.strip(), 'attendu', TOTAL)
    elif quoi == 'voir':
        ims = []; h = int(sys.argv[3])
        for a in sys.argv[4:]:
            nom, li = a.split(':')
            for i in li.split(','):
                x = (np.clip(image(nom, int(i), grain_f=0), 0, 1) * 255).astype(np.uint8); x = cv2.resize(x, (int(h * 1080 / 1920), h), interpolation=cv2.INTER_AREA)
                cv2.rectangle(x, (int(65 * h / 1920), int(269 * h / 1920)), (int(1015 * h / 1920), int(1248 * h / 1920)), (0, 255, 255), 1); cv2.putText(x, '%s %s' % (nom, i), (6, 18), cv2.FONT_HERSHEY_SIMPLEX, .5, (0, 255, 255), 1, cv2.LINE_AA); ims.append(x)
        cv2.imwrite(sys.argv[2], np.hstack(ims), [cv2.IMWRITE_JPEG_QUALITY, 86]); print(sys.argv[2], len(ims))
    else:
        import imontage as Mo
        seuls = sys.argv[2:]
        for nom, k in BA:
            if seuls and nom not in seuls: continue
            t0 = time.time(); p = Mo.Plan('%s/%s.mp4' % (out, nom), 1080, 1920, crf=14)
            for i in range(k): p.image(image(nom, i))
            print(nom, p.fin(), 'images,', round(time.time() - t0), 's', flush=True)
