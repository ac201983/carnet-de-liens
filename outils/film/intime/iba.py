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
    """Le son de la bande-annonce, avec les instruments enregistrés du film : les violoncelles chantent la mélodie de Bastien (elle commence par do, la, sol) sur la
    berceuse du piano, on entend ses doigts sur l'écran, puis le papier, le café versé, le dimanche matin sans musique, et la note qui manquait (fa) sur le nom du site."""
    import son as S, ibruits as IB, bruits as B, instruments as I
    import ipartition as PA, imixage as MX
    from cmixage import limite, niveau, enveloppe, n_
    SR = S.SR; DUR = TOTAL / IPS; s = lambda im: im / IPS
    M_ = PA.Mains(23); pc, pb = M_.chant_, M_.berce; AC = PA.AC
    vc = I.Cordes('v', place=.14); hv = I.Cordes('v', place=.22); ha = I.Cordes('a', place=-.22)
    # la berceuse : fa, do, si bémol, fa (la à la basse), ré mineur, si bémol, ré mineur, do (mi à la basse), fa. Une mesure dure 2 secondes.
    for k, (acc, f) in enumerate((('F', 31), ('C', 30), ('Bb', 31), ('F/A', 29), ('Dm.', 30), ('Bb', 31), ('Dm7', 35), ('C/E', 36))): M_.mesure(60 * k + 2, *AC[acc], f)
    M_.accord(482, ['F2', 'C3', 'A3', 'C4', 'F4'], 33, 150, roule=1.0)                    # la fiche change de main : fa majeur, puis plus rien jusqu'au nom du site
    # les violoncelles : do, la, sol, puis la mélodie (ré, si bémol, la ; fa, ré, do, si bémol ; la, fa, mi, do ; la)
    mel = [(2, 30, 'C4', .2, False), (32, 30, 'A4', .3, True), (62, 60, 'G4', .25, True), (122, 30, 'D4', .25, False), (152, 30, 'Bb4', .35, True), (182, 60, 'A4', .2, True),
           (242, 30, 'F4', .1, False), (272, 30, 'D5', .2, True), (302, 40, 'C5', .3, True), (342, 20, 'Bb4', .3, True),
           (362, 30, 'A4', .4, False), (392, 30, 'F5', .6, True), (422, 30, 'E5', .6, True), (452, 30, 'C5', .45, True), (482, 118, 'A4', .25, True)]
    for a, d, nom, timbre, lie in mel: vc.n(s(a), s(d), nom, timbre, lie)
    vc.nuance([(0, .42), (s(32), .60), (s(62), .62), (s(117), .50), (s(122), .52), (s(152), .66), (s(182), .58), (s(215), .40), (s(242), .36), (s(272), .42), (s(302), .46), (s(357), .44),
               (s(362), .60), (s(392), .84), (s(422), .86), (s(452), .72), (s(482), .62), (s(520), .50), (s(PAPIER), .30), (s(PAPIER + 45), 0.0), (DUR + 9, 0.0)])
    # le piano répond dans l'aigu : do, la, sol quand les violoncelles tiennent leur sol, puis la, fa, mi quand la fiche est donnée
    for base, notes, f, reste in ((82, ('C5', 'A5', 'G5'), 35, 56), (502, ('A5', 'F6', 'E6'), 32, 60)):
        M_.chant(base, 38, notes[0], f); M_.chant(base + 10, 11, notes[1], f + 2); M_.chant(base + 20, reste, notes[2], f - 1)
    # sur le nom du site, la note qui manquait à do, la, sol : fa. Les cordes tiennent sa résonance.
    for i, (nom, f) in enumerate((('F2', 37), ('C3', 34), ('F3', 34), ('A3', 33), ('C4', 35), ('A4', 33))): pb.n(s(NOTE4 - 2.2 + i * .4), s(200), nom, f)
    pb.pedale(s(NOTE4 - 2.6), DUR + 6); pc.n(s(NOTE4), s(200), 'F5', 62)
    for nom in ('F3', 'C4'): hv.n(s(NOTE4 + 1), s(160), nom, .12)
    for nom in ('A4', 'C5'): ha.n(s(NOTE4 + 1), s(160), nom, .10)
    for h in (hv, ha): h.nuance([(0, 0), (s(NOTE4), 0), (s(NOTE4 + 24), .30), (s(NOTE4 + 70), .58), (DUR + 9, .50)])
    M = S.Mixage(DUR + 3.0); rng = np.random.default_rng(47)
    for nom, x in MX.rend({'piano chant': pc, 'piano berceuse': pb, 'violoncelles': vc, 'résonance violoncelles': hv, 'résonance altos': ha}, DUR + 6.0).items(): M.pose(x, 0, 1.0)
    # les doigts de Bastien sur l'écran : il choisit « J'aime… », puis une lettre après l'autre
    texte = "prendre mon café seul, le matin."; d3 = DEB['t3']
    fr = MX.pose_frappes(M, [('Bastien écrit', [(s(d3 + 36 + k * 90 / 32), c) for k, c in enumerate(texte)], [(s(d3 + 16), .9)])], np.random.default_rng(49), regulier=(0,), parts=(1.8,))
    json.dump({'frappes': [round(t, 4) for t in fr]}, open(fichier[:-4] + '.json', 'w'))
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
    S.regarde(x, fichier[:-4] + '-son.png', [('do la sol', s(2)), ('il écrit', s(d3 + 36)), ('sommet', s(392)), ('fiche donnée', s(482)), ('papier', s(PAPIER)), ('café', s(VERSE)), ('fa', s(NOTE4))])
    print('bande-annonce : durée', round(len(x) / SR, 3), 's | crête', round(float(np.abs(x).max()), 3), '| limiteur %.1f dB' % baisse)
    for nom, a, b in (('do, la, sol', 0, 4), ('la mélodie', 4, 7.2), ('il écrit', 7.2, s(ECRIT)), ('le sommet', 12, 16), ('la fiche donnée', 16.1, s(VERSE)), ('café versé', s(VERSE), d6), ('dimanche, sans musique', d6 + 1.6, fin - .1), ('la note qui manquait', s(NOTE4), s(NOTE4) + 1), ('fin', 28.5, DUR - 1.0)):
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
