# La bande-annonce verticale de 30 secondes de « Ce qu'on ne dit pas par SMS ». Elle reprend les plans du film (cplans.py) avec leur cadrage pour les réseaux
# (format I : tout ce qui doit se lire tient entre les hauteurs 269 et 1248), dans un montage plus court, et elle montre aussi « Passer le relais ».
# Sa musique reprend celle du film en plus serré (90 à la noire, un temps = 20 images) : la vibration, 3 notes, la pulsation, et la quatrième note à l'envoi.
# python3 cba.py image [plans…]   python3 cba.py joint   python3 cba.py son   python3 cba.py export
import sys, os, json, subprocess, time, numpy as np, cv2
CINE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, CINE)
IPS = 30
BA = [('t1', 90),    # la table, le téléphone vibre, la ligne du public
      ('t2', 110),   # « En fait, moi… », le pouce s'arrête, il efface
      ('t3', 80),    # « Ici, on commence par vous. »
      ('t4a', 40),   # « Déposer ce qui pèse » : ce qu'il a écrit
      ('t4b', 90),   # la phrase que le site propose
      ('t5a', 30),   # le domino
      ('t5b', 40),   # son père relève les yeux
      ('t5c', 65),   # elle sourit
      ('t6a', 25),   # « Passer le relais »
      ('t6b', 65),   # Bastien écrit sa phrase (2 fois plus vite que dans le film)
      ('t6c', 45),   # dimanche matin, son café
      ('t7', 110),   # le dernier message : il hésite, il envoie
      ('t8', 110)]   # la signature
DEB = {}; _n = 0
for _nom, _k in BA: DEB[_nom] = _n; _n += _k
TOTAL = _n; DB = dict(BA); assert TOTAL == 900
VIB = (12, 23); MOTIF_1 = (36, 56, 76); TEMPS = 20
FIL_TA = dict(f2=8, n2=36, ef=80, ne=18); FIL_TE = dict(ap=65)
BATT_1 = (DEB['t2'] + 48, DEB['t2'] + 68); EFFACE = (DEB['t2'] + 80, DEB['t2'] + 98)
MOTIF_2 = (DEB['t3'] + 20, DEB['t3'] + 40, DEB['t3'] + 60); assert MOTIF_2[2] + TEMPS == DEB['t4a']
DOMINO = DEB['t5a'] + 6; TASSE = DEB['t6c'] + 8
ENVOI = DEB['t7'] + FIL_TE['ap']; MOTIF_3 = (ENVOI - 60, ENVOI - 40, ENVOI - 20); assert ENVOI == 745
PUBLIC = (40, 55, 96, 104)                                                   # la ligne du public, en images de l'horloge du plan a1 (le film commence 12 images plus tôt)

# ============================================================================================ l'image
def image(nom, i, grain_f=None):
    import cmontage as Mo; P = Mo.P; f = 'I'; n = DEB[nom] + i; W, H = Mo.FORMATS[f]
    def ui(x, clair=False): return Mo.finition_ui(x, n, f, clair=clair, grain_f=0)
    def ph(x): return Mo.raccord.finition(x, n, f, 0)
    g = .010
    if nom == 't1':
        k = (P.CT.PUBLIC,); P.CT.PUBLIC = PUBLIC
        try: out = ph(P.a1(i, f, n=i + 12))
        finally: P.CT.PUBLIC = k[0]
        g = Mo.raccord.GRAIN
    elif nom == 't2':
        img, M, e = _fil('filta', i, DB['t2']); a = FIL_TA
        pts = [(a['f2'] + a['n2'] + 3, P.ENV[0] - 20, P.ENV[1] + 74, 0, 0), (a['f2'] + a['n2'] + 16, P.HOV[0], P.HOV[1], .92, 0), (a['ef'] - 9, P.HOV[0], P.HOV[1], .92, 0), (a['ef'] - 2, P.EFF[0], P.EFF[1], 1, 0), (a['ef'], P.EFF[0], P.EFF[1], 1, 1),
               (a['ef'] + a['ne'], P.EFF[0], P.EFF[1], 1, 1), (a['ef'] + a['ne'] + 3, P.EFF[0], P.EFF[1], 1, 0), (a['ef'] + a['ne'] + 11, P.EFF[0] - 6, P.EFF[1] + 14, 0, 0)]
        out = ui(P.pouce(img, M, e, i, pts, souffle=(a['f2'] + a['n2'] + 16, a['ef'] - 9)))
    elif nom == 't3': out = ph(P.a3(i, f, t_ici=6)); g = Mo.raccord.GRAIN
    elif nom == 't4a':
        cx, cy, e = P.b2.cles[f][-1][1:]; out = ui(P.appareil(P.ecran_depot(P.T_ECRIT + 20 + i), f, cx, cy, e, 1000, tete=66)[0])
    elif nom == 't4b': out = ui(P.PP.filme(P.b4, 110 + i, f)[0])
    elif nom == 't5a': out = ph(P.c4(i, f)); g = Mo.raccord.GRAIN
    elif nom == 't5b': out = ph(P.c5(i, f)); g = Mo.raccord.GRAIN
    elif nom == 't5c': out = ph(P.c6(i, f)); g = Mo.raccord.GRAIN
    elif nom == 't6a': out = ui(P.d2(4, f)[0], True)
    elif nom == 't6b': out = ui(P.PP.filme(P.d2p, 60 + 2 * i, f)[0], True)
    elif nom == 't6c':
        out = ph(P.pose2(P.fixes.fixe('cafe', f), 'dimanche', f, float(Mo.lisse(i, 3, 11)) * (1 - float(Mo.lisse(i, 34, 43))), bande=.5, doux=120)); g = Mo.raccord.GRAIN
    elif nom == 't7':
        img, M, e = _fil('filte', i, DB['t7']); out = ui(P.pouce(img, M, e, i, P.pouce_e(ap=FIL_TE['ap'], fin=-30), souffle=(-12, FIL_TE['ap'] - 7)))
    elif nom == 't8':
        avant = _derniere_t7(); img = P.PP.g2(i, f, avant); k = float(Mo.lisse(i / IPS, 0, .5))
        return Mo.grain(img * Mo.vignette(W, H, .1, .8), n, (.010 * (1 - .3 * k)) if grain_f is None else grain_f)
    else: raise SystemExit('plan inconnu ' + nom)
    g = g if grain_f is None else grain_f
    return Mo.grain(out, n, g) if g else out
def _fil(dossier, i, n):
    import cmontage as Mo; P = Mo.P; f = 'I'
    u = P.pl(P.CAP + dossier, min(int(i), n - 1)); a = float(Mo.lisse(i / n, -.1, 1.1)); cy, e0, de = P.FIL[f]; e = e0 + de * a; W, H = Mo.FORMATS[f]
    img, M = P.appareil(u, f, 195, cy, e, 693, ax=W / 2, ay=H / 2); return img, M, e
_d7 = {}
def _derniere_t7():
    if 'x' not in _d7: _d7['x'] = image('t7', DB['t7'] - 1, grain_f=0)
    return _d7['x']

# ============================================================================================ le son
def son(fichier):
    import partition as PA, synthe as Y, bruits as B, cmixage as CM, son as S
    s = lambda im: im / 30.0; DUR = TOTAL / 30.0; rng = np.random.default_rng(9); V = {}
    class Voix(PA.Voix):
        def rendu(self): return Y.piste(self.prog, self.notes, DUR + 4.0, self.cc, self.ped)
    pm = V['piano motif'] = Voix(Y.PIANO); pa = V['piano croches'] = Voix(Y.PIANO); pp = V['pulsation piano'] = Voix(Y.PIANO); pz = V['pulsation cordes pincées'] = Voix(Y.PIZZ)
    c1 = V['cordes 1'] = Voix(Y.CORDES); c2 = V['cordes 2'] = Voix(Y.CORDES); tr = V['tremolo'] = Voix(Y.TREMOLO); rep = []
    def coeur(im, force=60, ecart=7):
        for d, k in ((0, 1.0), (ecart, .68)):
            pp.n(im + d, 12, 'D2', force * k); pz.n(im + d, 9, 'D3', force * k * .9); pp.n(im + d, 9, 'D3', force * k * .8); pz.n(im + d, 7, 'D4', force * k * .5)
    def croches(im, temps, basse, motif4, force=42):
        if basse: pa.n(im, temps * TEMPS - 2, basse, force + 4)
        for k in range(temps * 2): pa.n(im + k * TEMPS / 2 + float(rng.normal(0, .1)), 11, motif4[k % len(motif4)], force + (5 if k % 2 == 0 else 0) + float(rng.normal(0, 2)))
    # la vibration (un bruit), puis 3 notes
    a = MOTIF_1; pm.pedale(a[0] - 2, DEB['t2'] + 30)
    for im, nom, f in zip(a, ('F#4', 'A4', 'E4'), (52, 56, 60)): pm.n(im, 60, nom, f)
    pm.n(a[0], 60, 'D3', 34); pm.n(a[2], 50, 'A2', 36); rep += [('motif 1', s(a[0]))]
    # « En fait, moi… » : la tension, 2 battements, il efface
    t2 = DEB['t2']; c2.n(t2 + 4, EFFACE[0] + 12 - t2 - 4, ['A3', 'E4'], 64); c2.nuance([(t2 + 4, 0), (BATT_1[0], 48), (EFFACE[0] - 4, 70), (EFFACE[0] + 12, 0)])
    for k, b in enumerate(BATT_1): coeur(b, 60 + 6 * k)
    rep += [('pulsation', s(BATT_1[0])), ('silence', s(EFFACE[1]))]
    # la promesse : le motif, les cordes. La quatrième note est remplacée par le si mineur de « Déposer ».
    b = MOTIF_2; B0 = DEB['t4a']; pm.pedale(b[0] - 2, B0 - 1)
    for im, nom, f in zip(b, ('F#4', 'A4', 'E4'), (56, 60, 64)): pm.n(im, 60, nom, f)
    pm.n(b[0], 40, 'D2', 42); pm.n(b[2], 20, 'A1', 40)
    c1.n(b[0] - 12, 32, ['D3', 'A3', 'F#4'], 66); c1.n(b[1], 20, ['D3', 'B3', 'F#4', 'A4'], 66); c1.n(b[2], 21, ['A2', 'D4', 'E4', 'G4'], 66)
    c1.nuance([(b[0] - 12, 0), (b[0], 34), (b[1], 56), (b[2] + 10, 70), (B0, 60)]); rep += [('motif 2', s(b[0]))]
    # « Déposer » : le piano en croches. Un silence pour le domino.
    croches(B0, 4, 'B2', ('D4', 'A4', 'F#4', 'A4'), 42); croches(B0 + 80, 2, 'G2', ('D4', 'A4', 'G4', 'A4'), 44)
    pa.pedale(B0, B0 + 78); pa.pedale(B0 + 80, B0 + 118)
    c2.n(B0 - 3, 83, ['B3', 'D4', 'F#4'], 62); c2.n(B0 + 78, 40, ['B3', 'D4', 'G4'], 62); c2.nuance([(B0 - 3, 0), (B0 + 16, 48), (B0 + 80, 58), (B0 + 112, 40), (B0 + 122, 0)])
    # le regard : les cordes enflent (fa dièse, la, mi)
    t5b, t5c, t6a = DEB['t5b'], DEB['t5c'], DEB['t6a']
    c1.n(DOMINO + 8, t5b - DOMINO - 8 + 40, ['D3', 'A3'], 64); c1.n(t5b - 3, 43, ['F#3', 'D4', 'F#4'], 66); c2.n(t5b - 3, 43, 'F#5', 70)
    c1.n(t5c, 33, ['G2', 'D3', 'B3', 'D4'], 66); c2.n(t5c - 2, 34, ['A4', 'A5'], 72); c1.n(t5c + 32, 34, ['A2', 'E3', 'C#4', 'G4'], 66); c2.n(t5c + 30, 36, ['E4', 'E5'], 72)
    c1.nuance([(DOMINO + 8, 0), (t5b, 54), (t5c, 94), (t5c + 32, 114), (t6a - 6, 100), (t6a + 3, 0)]); c2.nuance([(t5b - 3, 0), (t5b + 8, 68), (t5c, 100), (t5c + 32, 120), (t6a - 6, 104), (t6a + 3, 0)])
    pm.pedale(t5b - 1, t6a - 3); pm.n(t5b, 40, 'F#4', 54); pm.n(t5c, 32, 'A4', 60); pm.n(t5c + 32, 32, 'E4', 60); rep += [('domino', s(DOMINO)), ('motif 3', s(t5b))]
    # Bastien : la couleur de sol, puis les cordes enflent jusqu'à la coupe. Le café : presque rien, la tasse.
    t6c = DEB['t6c']
    croches(t6a, 2, 'G2', ('B4', 'D5', 'A4', 'D5'), 38); croches(t6a + 40, 2, 'F#2', ('A4', 'D5', 'F#4', 'D5'), 40); pa.pedale(t6a, t6a + 38); pa.pedale(t6a + 40, t6a + 78)
    c1.n(t6a + 36, 54, ['E2', 'B2', 'G3', 'D4'], 70); c2.n(t6a + 38, 52, ['F#4', 'F#5'], 74)
    c1.nuance([(t6a + 36, 0), (t6a + 50, 50), (t6c - 3, 116), (t6c, 0)]); c2.nuance([(t6a + 38, 0), (t6a + 50, 54), (t6c - 3, 122), (t6c, 0)]); rep += [('café', s(t6c)), ('tasse', s(TASSE))]
    # le dernier message : la pulsation (le cœur bat vite), un tremolo, les 3 notes, et la quatrième à l'envoi
    t7 = DEB['t7']
    for b_ in range(ENVOI - 60, ENVOI, TEMPS): coeur(b_, 86, 5); coeur(b_ + TEMPS / 2, 72, 5)
    c1.n(t7 + 2, ENVOI - t7 - 2, ['D2', 'D3'], 60); c1.nuance([(t7 + 2, 0), (t7 + 12, 50), (ENVOI - 3, 72), (ENVOI, 0)])
    tr.n(t7 + 2, ENVOI - t7 - 2, ['A4', 'E5'], 58); tr.nuance([(t7 + 2, 0), (t7 + 16, 34), (ENVOI - 20, 64), (ENVOI - 2, 84), (ENVOI, 0)])
    me = MOTIF_3; pm.pedale(me[0] - 1, ENVOI - 1)
    for im, nom, f in zip(me, ('F#4', 'A4', 'E4'), (70, 77, 84)): pm.n(im, 60, nom, f); pm.n(im, 50, nom[:-1] + '5', f - 22)
    fin = TOTAL
    pm.pedale(ENVOI, fin + 60)
    for nom, f in (('D4', 96), ('D5', 74), ('D3', 72), ('D2', 62)): pm.n(ENVOI, fin - ENVOI + 40, nom, f)
    c1.n(ENVOI, fin - ENVOI + 30, ['D2', 'A2', 'D3', 'A3'], 66); c2.n(ENVOI, fin - ENVOI + 30, ['D4', 'F#4', 'A4', 'D5'], 68)
    for vx, k in ((c1, 1.0), (c2, 1.08)): vx.nuance([(ENVOI, 0), (ENVOI + 1, 70 * k), (ENVOI + 30, 94 * k), (DEB['t8'], 80 * k), (DEB['t8'] + 60, 64 * k), (fin - 6, 0)])
    rep += [('motif 4', s(me[0])), ('la 4e note', s(ENVOI)), ('logo', s(DEB['t8']))]
    # le mixage : les mêmes forces que dans le film
    M = S.Mixage(DUR + 3.0)
    for nom, v in V.items():
        g, salle = CM.VOIX[nom]; M.pose(Y.dans_la_salle(v.rendu() * g, salle, 2.3 if 'cordes' in nom or nom == 'tremolo' else 2.0), 0, 1.0)
    c = S.cuisine(rng, DUR + 3.0); M.pose(c * CM.enveloppe(len(c), [(0, 0), (s(VIB[0]) + .02, 0), (s(VIB[1]) + .5, .32), (s(DEB['t4a']) - .3, .32), (s(DEB['t4a']) + .6, 0), (DUR + 3, 0)])[:, None], 0, 1.0)
    v1 = B.vibreur(1, .235, 172.0, 1.0); v2 = B.vibreur(2, .185, 166.0, .86)
    M.pose(S.dans_la_piece(v1, .20), s(VIB[0]), .40, 'vibration 1'); M.pose(S.dans_la_piece(v2, .20), s(VIB[1]), .40, 'vibration 2')
    M.pose(S.dans_la_piece(B.glisse(), .16), s(DOMINO) - .30, .075); M.pose(S.dans_la_piece(B.domino(), .2), s(DOMINO), .50, 'domino')
    b_, v_ = B.tasse(); M.pose(S.dans_la_piece(b_, .2), s(TASSE), .44, 'tasse'); M.pose(S.dans_la_piece(v_, .26, .4), s(TASSE), 2.4)
    x = M.x * CM.MAITRE; t = np.arange(len(x)) / S.SR; x = x * (1 - S.lisse(t, DUR - 1.2, DUR))[:, None]
    x, baisse, part = CM.limite(x, .84); x = x[:S.n_(DUR)]
    from scipy.io import wavfile
    wavfile.write(fichier, S.SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
    S.regarde(x, fichier[:-4] + '.png', M.reperes + rep)
    json.dump({'duree': DUR, 'reperes': M.reperes + rep, 'envoi': s(ENVOI)}, open(fichier[:-4] + '.json', 'w'), ensure_ascii=False)
    print('bande-annonce : durée', round(len(x) / S.SR, 3), 's | crête', round(float(np.abs(x).max()), 3), '| limiteur %.1f dB' % baisse)
    for nom, a_, b_ in (('vibration', s(VIB[0]), s(VIB[0]) + .25), ('3 notes', s(36), s(96)), ('pulsation', s(BATT_1[0]), s(EFFACE[0])), ('silence', s(EFFACE[1]) + .1, s(DEB['t3']) + .1), ('promesse', s(MOTIF_2[0]), s(B0)), ('Déposer', s(B0), s(B0 + 110)),
                        ('avant le domino', s(DOMINO) - .2, s(DOMINO) - .02), ('domino', s(DOMINO), s(DOMINO) + .15), ('regard', s(t5b), s(t6a)), ('Bastien', s(t6a), s(t6c)), ('tasse', s(TASSE), s(TASSE) + .2), ('il hésite', s(t7), s(ENVOI)), ('la 4e note', s(ENVOI), s(ENVOI) + 1), ('logo', s(DEB['t8']), DUR - 1.2)):
        print('  %-18s %6.1f dB | au-dessus de 350 Hz %6.1f' % (nom, CM.niveau(x, a_, b_), CM.niveau(x, a_, b_, (350, 0))))

if __name__ == '__main__':
    quoi = sys.argv[1] if len(sys.argv) > 1 else 'image'; out = CINE + '/out/I'; os.makedirs(out, exist_ok=True)
    if quoi == 'son': son(CINE + '/tmp/bande-annonce.wav')
    elif quoi == 'joint':
        with open(out + '/liste.txt', 'w') as l:
            for nom, k in BA: l.write("file '%s/%s.mp4'\n" % (out, nom))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', out + '/liste.txt', '-c', 'copy', out + '/image.tmp.mp4'], check=True); os.replace(out + '/image.tmp.mp4', out + '/image.mp4')
        print(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=nb_frames,duration', '-of', 'csv=p=0', out + '/image.mp4'], capture_output=True, text=True).stdout.strip(), 'attendu', TOTAL)
    elif quoi == 'voir':                                                     # python3 cba.py voir sortie.jpg hauteur plan:i,i …
        ims = []; h = int(sys.argv[3])
        for a in sys.argv[4:]:
            nom, li = a.split(':')
            for i in li.split(','):
                x = (np.clip(image(nom, int(i), grain_f=0), 0, 1) * 255).astype(np.uint8); x = cv2.resize(x, (int(h * 1080 / 1920), h), interpolation=cv2.INTER_AREA)
                cv2.rectangle(x, (int(65 * h / 1920), int(269 * h / 1920)), (int(1015 * h / 1920), int(1248 * h / 1920)), (0, 255, 255), 1); cv2.putText(x, '%s %s' % (nom, i), (6, 18), cv2.FONT_HERSHEY_SIMPLEX, .5, (0, 255, 255), 1, cv2.LINE_AA); ims.append(x)
        cv2.imwrite(sys.argv[2], np.hstack(ims), [cv2.IMWRITE_JPEG_QUALITY, 86]); print(sys.argv[2], len(ims))
    else:
        import cmontage as Mo
        seuls = sys.argv[2:]
        for nom, k in BA:
            if seuls and nom not in seuls: continue
            t0 = time.time(); p = Mo.Plan('%s/%s.mp4' % (out, nom), 1080, 1920, crf=14)
            for i in range(k): p.image(image(nom, i))
            print(nom, p.fin(), 'images,', round(time.time() - t0), 's', flush=True)
