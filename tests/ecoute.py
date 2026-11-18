# L'essai « les yeux fermés », deuxième moitié : l'analyse de l'enregistrement, seul.
# Ce programme ne sait rien de ce que la page a décidé. Il reçoit le son tel qu'il sort, et cherche comme le ferait une oreille :
#   - les notes graves, qui marquent le début d'une phrase qui monte ;
#   - les notes de la mélodie, avec leur hauteur ;
#   - l'endroit où la mélodie, arrivée en haut, repart vers le bas.
# Il en déduit « ici, on inspire » et « ici, on souffle ». On compare ensuite avec les mots affichés à l'écran, relevés pendant l'enregistrement.
# usage : python3 ecoute.py <dossier> [egal long libre]
import sys, json, os
import numpy as np, scipy.signal as sg, scipy.io.wavfile as wf

NOMS = {43: 'sol grave', 45: 'la grave', 47: 'si grave', 50: 'ré grave', 57: 'la', 62: 'ré', 64: 'mi', 66: 'fa dièse', 69: 'la aigu'}
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)

def bande(x, sr, f1, f2, lisse=0.006):
    """Le niveau du son entre 2 fréquences, au fil du temps."""
    sos = sg.butter(4, [f1, f2], btype='band', fs=sr, output='sos'); e = np.abs(sg.hilbert(sg.sosfiltfilt(sos, x)))
    k = max(1, int(sr * lisse)); return np.convolve(e, np.ones(k) / k, mode='same')

def evenements(x, sr, m1, m2, n, saut_db=12.0, plancher=0.03, ecart=0.45, graves=()):
    """Les notes qui commencent, entre les hauteurs m1 et m2 (en demi-tons).
    Le son est découpé en tranches qui se recouvrent. Pour chaque demi-ton, on suit l'énergie de sa fréquence :
    une note commence là où cette énergie fait un bond d'au moins « saut_db » décibels et atteint un niveau qui compte.
    Quand plusieurs demi-tons bondissent au même instant (une note et ses harmoniques, ou une note grave et la mélodie), on garde le plus fort."""
    pas = int(sr * 0.01)
    f, t, Z = sg.stft(x, fs=sr, nperseg=n, noverlap=n - pas, window='hann', padded=False, boundary=None)
    P = np.abs(Z) ** 2; K = int(round((n / sr / 2 + 0.01) / 0.01)); cand = []; E = {}
    for m in range(m1, m2 + 1):
        fm = hz(m); z = (f >= fm * 2 ** (-40 / 1200)) & (f <= fm * 2 ** (40 / 1200))
        E[m] = P[z].sum(axis=0) + 1e-14
    haut = max(E[m].max() for m in E)
    for m in E:
        e = E[m]; r = np.zeros(len(e)); r[K:-K] = 10 * np.log10(e[2 * K:] / e[:-2 * K])
        pk, _ = sg.find_peaks(r, height=saut_db, distance=int(ecart / 0.01))
        for k in pk:
            q = min(len(e) - 1, k + K); niv = e[q]
            # une vraie note est plus forte dans sa bande que dans les 2 bandes voisines (ce qui déborde d'une note voisine ne l'est pas)
            if niv > haut * plancher and all(niv >= E[v][q] for v in (m - 1, m + 1) if v in E):
                # le niveau de l'eau au même instant : la médiane des bandes qui ne portent aucune note de la musique
                repos = [E[v][q] for v in E if v not in NOMS and abs(v - m) > 1]
                cand.append((t[k], m, niv, float(np.median(repos)) if repos else 0.0))
    # Une note grave fait aussi sonner ses harmoniques (l'octave, la quinte au-dessus, la double octave) : au moment où elle part,
    # ces hauteurs-là ne comptent comme une note de la mélodie que si rien d'autre ne commence en même temps.
    def harmonique(c): return any(abs(c[0] - tg) < 0.3 and (c[1] - mg) in (12, 19, 24) for (tg, mg) in graves)
    cand.sort(); groupes = []
    for c in cand:
        if groupes and c[0] - groupes[-1][0][0] < 0.20: groupes[-1].append(c)
        else: groupes.append([c])
    out = []
    for g in groupes:
        vrais = [c for c in g if not harmonique(c)] or g
        out.append(max(vrais, key=lambda c: c[2]))
    # un harmonique isolé, à moins de 4 dixièmes de seconde d'une vraie note, n'est pas une note
    out = [c for c in out if not (harmonique(c) and any(o is not c and not harmonique(o) and abs(o[0] - c[0]) < 0.4 for o in out))]
    # une note qui résonne encore n'est pas rejouée : la même hauteur, moins de 9 dixièmes de seconde après, n'est comptée qu'une fois
    net = []
    for c in out:
        if any(p[1] == c[1] and 0 <= c[0] - p[0] < 0.9 for p in net): continue
        net.append(c)
    return net

def debut(e, sr, t, fen=0.11):
    """Le début précis d'une note repérée vers l'instant t : là où le niveau de sa bande quitte le calme d'avant pour monter vers son sommet."""
    a = max(0, int((t - fen) * sr)); b = min(len(e) - 1, int((t + fen) * sr)); seg = e[a:b]
    if len(seg) < 10: return t
    k = int(np.argmax(seg)); bas = float(np.median(e[max(0, a - int(.08 * sr)):a + 1])); haut = float(seg[k]); j = k
    while j > 0 and seg[j] > bas + (haut - bas) * 0.25: j -= 1
    return (a + j + 1) / sr

def analyse(dossier, cle, bavard=True):
    sr, x = wf.read(os.path.join(dossier, cle + '.wav')); x = x.astype(float) / 32768.0
    J = json.load(open(os.path.join(dossier, cle + '.json')))
    # 1. l'heure. L'enregistreur a noté le rang exact de son premier échantillon dans l'horloge du son, et quelques couples
    #    (horloge du son, horloge de la page) : une droite ajustée sur ces couples donne, pour chaque point de l'enregistrement, l'heure de la page où on l'entend.
    P = np.array(J['paires']); pente, origine = np.polyfit(P[:, 0], P[:, 1], 1)
    def heure(t): return (J['f0'] / sr + t + J['lat']) * pente + origine
    # 2. les notes de la mélodie (du sol dièse au si, 208 à 494 Hz, au-dessus de l’octave des notes graves) et les notes graves (du fa au mi, 87 à 165 Hz) : leur hauteur, puis leur début précis
    em = bande(x, sr, 200, 480); eg = bande(x, sr, 85, 165)
    G = [(t, m, a) for (t, m, a, _) in evenements(x, sr, 41, 52, 16384, saut_db=10.0, plancher=0.08, ecart=1.5)]
    Ev = evenements(x, sr, 56, 71, 8192, graves=[(t, m) for (t, m, _) in G])
    Mel = [(debut(em, sr, t), m, a) for (t, m, a, _) in Ev]
    # le début précis d'une note grave se lit dans sa propre bande
    G = [(debut(eg, sr, t, fen=0.25), m, a) for (t, m, a) in G]
    faux = []
    # 3. ce qu'une oreille en déduit
    #    « on inspire » : une note grave, qui ouvre une phrase montante. « on souffle » : la mélodie, arrivée en haut, redescend.
    insp = [g[0] for g in G]
    souf = []
    for k in range(1, len(Mel)):
        if Mel[k][1] < Mel[k - 1][1] and (k < 2 or Mel[k - 1][1] > Mel[k - 2][1]): souf.append(Mel[k][0])
    # 4. chaque phrase : entre un début d'inspiration et le souffle suivant, les notes montent-elles ? Entre le souffle et l'inspiration suivante, descendent-elles ?
    bornes = sorted([(t, 'in') for t in insp] + [(t, 'out') for t in souf]); phrases = []
    for k in range(len(bornes) - 1):
        a, ty = bornes[k]; b = bornes[k + 1][0]
        notes = [m for (t, m, _) in Mel if a - 0.05 <= t < b - 0.05]
        if len(notes) < 2: continue
        monte = all(notes[i + 1] > notes[i] for i in range(len(notes) - 1)); desc = all(notes[i + 1] < notes[i] for i in range(len(notes) - 1))
        phrases.append((ty, notes, monte if ty == 'in' else desc))
    # 5. la comparaison avec les mots affichés
    mots = J['mots']; ecarts = []
    for w in mots:
        cible = insp if w['m'] == 'Inspirez' else souf
        if not cible: continue
        d = min(((heure(t) - w['t']) for t in cible), key=abs)
        if heure(len(x) / sr) - w['t'] < 300: continue    # un mot affiché tout à la fin de l'enregistrement : sa note n'y est pas encore
        if not insp or w['t'] < heure(min(insp)) - 300: continue  # un mot affiché avant la première phrase montante entendue
        ecarts.append((w['m'], d))
    # 6. les notes sortent-elles de l'eau ? L'énergie d'une note dans sa bande, comparée à celle de l'eau dans une bande de même largeur, au même instant
    sorties = [10 * np.log10(a / max(1e-14, eau0)) for (_, _, a, eau0) in Ev if eau0 > 0]
    # 7. l'eau : son niveau dans l'aigu (2500 à 5000 Hz, au-dessus des notes), pendant le dernier tiers des inspirations et le dernier tiers des expirations
    #    (les 2 dixièmes de seconde qui suivent le départ d'une note sont laissés de côté : le marteau du piano s'y entend aussi)
    h = 20 * np.log10(bande(x, sr, 2500, 5000, lisse=0.05) + 1e-9); libre_ = np.ones(len(x), bool)
    for (t, _, _) in Mel + G: libre_[max(0, int((t - .03) * sr)): int((t + .25) * sr)] = False
    def tiers(a, b): i = int((a + (b - a) * 2 / 3) * sr); j = int(b * sr); z = libre_[i:j]; return h[i:j][z]
    hi = [tiers(a, min([s_ for s_ in souf if s_ > a], default=None)) for a in insp if any(s_ > a for s_ in souf)]
    lo = [tiers(a, min([i_ for i_ in insp if i_ > a], default=None)) for a in souf if any(i_ > a for i_ in insp)]
    eau = float(np.median(np.concatenate(hi)) - np.median(np.concatenate(lo))) if hi and lo else float('nan')
    res = {'pente': pente, 'cle': cle, 'titre': J['titre'], 'duree': len(x) / sr, 'graves': G, 'melodie': Mel, 'insp': insp, 'souf': souf, 'phrases': phrases, 'ecarts': ecarts, 'sorties': sorties, 'eau': eau, 'manque': J.get('manque', 0)}
    if bavard:
        print('\n== ' + J['titre'] + ' : %.1f secondes écoutées ==' % (len(x) / sr))
        print('  notes entendues dans la mélodie : ' + ' '.join(NOMS.get(m, str(m)).replace(' ', '_') for (_, m, _) in Mel))
        print('  notes graves entendues          : ' + ' '.join(NOMS.get(m, str(m)).replace(' ', '_') for (_, m, _) in G))
        for (ty, notes, bon) in phrases:
            print('  %s : %s  %s' % ('on inspire' if ty == 'in' else 'on souffle', ' '.join(NOMS.get(m, str(m)).replace(' ', '_') for m in notes), 'les notes montent' if (ty == 'in' and bon) else ('les notes redescendent' if bon else 'ORDRE INATTENDU')))
        if ecarts:
            print('  comparé à l’écran : %d mots, écart moyen %+.0f ms, pire écart %.0f ms' % (len(ecarts), np.mean([d for _, d in ecarts]), max(abs(d) for _, d in ecarts)))
            print('    ' + ' '.join('%s%+.0f' % ('I' if m == 'Inspirez' else 'E', d) for m, d in ecarts))
        if sorties: print('  dans sa bande, une note de la mélodie dépasse l’eau de %.0f dB en moyenne (au moins %.0f dB)' % (np.mean(sorties), min(sorties)))
        print('  horloge du son comparée à celle de la page : %+.3f %%. Échantillons manquants dans l’enregistrement : %d' % ((1000 / pente - 1) * 100, J.get('manque', 0)))
        print('  l’eau, dans l’aigu, est %.1f dB plus présente à la fin d’une inspiration qu’à la fin d’une expiration' % eau)
    return res

if __name__ == '__main__':
    dossier = sys.argv[1]; cles = sys.argv[2:] or ['egal', 'long', 'libre']; ko = 0
    for c in cles:
        r = analyse(dossier, c)
        bon = len(r['phrases']) >= 4 and all(p[2] for p in r['phrases']) and r['ecarts'] and max(abs(d) for _, d in r['ecarts']) < 150 and r['sorties'] and min(r['sorties']) > 15
        print('  VERDICT : ' + ('à l’oreille seule, on sait quand inspirer et quand souffler' if bon else 'À REVOIR'))
        if not bon: ko += 1
    sys.exit(1 if ko else 0)
