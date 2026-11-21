# Les instruments enregistrés de la nouvelle musique : on range ici, une fois pour toutes, les notes dont la partition a besoin.
#   le piano : Salamander Grand Piano V3, d'Alexander Holm (licence Creative Commons Attribution 3.0)
#   les violoncelles et les altos : Versilian Studios Chamber Orchestra 2, Community Edition (licence CC0 1.0)
# python3 -I banque.py <dossier Salamander/Samples> <dossier VSCO-2-CE> <dossier de sortie>      (python3 -I banque.py --justesse <dossier de sortie> : seulement la justesse des cordes)
# Les fichiers d'origine sont lus par ffmpeg. On garde pour chaque note : le son à 48 kHz (16 bits, ramené à pleine échelle), sa force d'origine et sa hauteur mesurée.
import sys, os, json, subprocess, numpy as np
SR = 48000
_N = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def midi(nom, do_central=4):
    n = _N[nom[0]]; r = nom[1:]
    if r[0] == '#': n += 1; r = r[1:]
    return 12 * (int(r) + (5 - do_central)) + n
def lit(chemin, sr=SR):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', chemin, '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)
def hauteur(x, attendu, sr=SR):
    """La hauteur réelle (Hz) : le pic du spectre le plus proche de la note attendue, à un demi-ton près, sur 1,5 seconde après l'attaque."""
    m = x.mean(axis=1); a = int(.25 * sr); seg = m[a:a + int(1.5 * sr)]
    if len(seg) < sr // 2: seg = m[a:]
    n = 1 << 18; S = np.abs(np.fft.rfft(seg * np.hanning(len(seg)), n)); f = np.fft.rfftfreq(n, 1 / sr)
    meilleur = None
    for h in (1, 2, 3):                                                      # la fondamentale peut être faible : on regarde aussi les harmoniques 2 et 3
        lo, hi = attendu * h / 1.045, attendu * h * 1.045; k = np.where((f >= lo) & (f <= hi))[0]; i = k[np.argmax(S[k])]
        # affinage parabolique
        y0, y1, y2 = np.log(S[i - 1] + 1e-12), np.log(S[i] + 1e-12), np.log(S[i + 1] + 1e-12); d = .5 * (y0 - y2) / (y0 - 2 * y1 + y2)
        fr = (i + d) * sr / n / h
        if meilleur is None or S[i] > meilleur[1]: meilleur = (fr, S[i], h)
    return meilleur[0], meilleur[2]
def range_(x, nom, sortie, duree, avant=.004):
    """Coupe le silence du début, garde `duree` secondes au plus, et ramène à pleine échelle."""
    env = np.abs(x).max(axis=1); pic = env.max(); d = int(np.argmax(env > pic * 10 ** (-46 / 20))); d = max(0, d - int(avant * SR))
    y = x[d:d + int(duree * SR)].copy(); n = len(y); f = min(int(.5 * SR), n // 4); y[-f:] *= np.linspace(1, 0, f)[:, None]
    y[:int(.002 * SR)] *= np.linspace(0, 1, int(.002 * SR))[:, None]
    g = np.abs(y).max(); np.save(os.path.join(sortie, nom + '.npy'), np.round(y / g * 32000).astype(np.int16))
    eff = float(np.sqrt((y[:int(1.0 * SR)] ** 2).mean()))
    return dict(pic=float(g), eff=eff, duree=n / SR, debut=d / SR)

def justesse(sortie):
    """La justesse de chaque note de cordes : l'écart moyen (en centièmes de demi-ton) entre sa hauteur réelle et la note juste, mesuré sur la note tenue.
    Les cordes vibrent : on suit la fréquence de la fondamentale et de ses 2 premiers harmoniques d'instant en instant, et on en fait la moyenne, pondérée par leur force."""
    from scipy.signal import butter, sosfiltfilt, hilbert
    ix = json.load(open(os.path.join(sortie, 'index.json'))); res = {}
    for cle, info in sorted(ix['cordes'].items()):
        m = np.load(os.path.join(sortie, cle + '.npy')).astype(np.float64).mean(axis=1); hz = 440 * 2 ** ((info['midi'] - 69) / 12); tot = None; poids = None
        for h in (1, 2, 3):
            f = hz * h; a = hilbert(sosfiltfilt(butter(3, [f / 1.07 / (SR / 2), f * 1.07 / (SR / 2)], 'band', output='sos'), m))
            fi = np.diff(np.unwrap(np.angle(a))) * SR / (2 * np.pi) / h; amp = np.abs(a[1:]) ** 2
            tot = fi * amp if tot is None else tot + fi * amp; poids = amp if poids is None else poids + amp
        i, j = int(.3 * SR), int(min(6.0, len(m) / SR - 1.2) * SR); res[cle] = float(1200 * np.log2(tot[i:j].sum() / poids[i:j].sum() / hz))
    json.dump(res, open(os.path.join(sortie, 'justesse.json'), 'w'), indent=0); return res

if __name__ == '__main__':
    if sys.argv[1] == '--justesse': r = justesse(sys.argv[2]); print(len(r), 'notes de cordes, écart le plus grand %.1f centièmes' % max(abs(v) for v in r.values())); sys.exit(0)
    sal, vsco, sortie = sys.argv[1:4]; os.makedirs(sortie, exist_ok=True); index = {'piano': {}, 'cordes': {}}
    for fichier in sorted(os.listdir(sal)):
        if not fichier.endswith('.flac'): continue
        nom, couche = fichier[:-5].split('v'); couche = int(couche)
        if couche > 9: continue
        k = midi(nom); x = lit(os.path.join(sal, fichier)); hz, h = hauteur(x, 440 * 2 ** ((k - 69) / 12))
        cle = 'p%03d-%02d' % (k, couche); info = range_(x, cle, sortie, 15.0 if k <= 60 else 11.0)
        info.update(midi=k, couche=couche, hz=hz, cents=1200 * np.log2(hz / (440 * 2 ** ((k - 69) / 12)))); index['piano'][cle] = info
        print(cle, nom, 'pic %.4f' % info['pic'], 'eff %.4f' % info['eff'], '%.1f s' % info['duree'], '%+.1f cents (h%d)' % (info['cents'], h), flush=True)
    for pupitre, dossier in (('violoncelles', 'Strings/Cello Section/susvib'), ('altos', 'Strings/Viola Section/susvib')):
        d = os.path.join(vsco, dossier)
        if not os.path.isdir(d): continue
        for fichier in sorted(os.listdir(d)):
            if not fichier.endswith('.wav'): continue
            nom, couche, prise = fichier[:-4].split('_')[-3:]
            if prise != '1': continue
            x = lit(os.path.join(d, fichier))
            # le nom donne la note, mais pas toujours l'octave : on cherche l'octave dont la hauteur attendue ressort le mieux
            essais = []
            for dc in (3, 4, 5):
                k = midi(nom, dc); att = 440 * 2 ** ((k - 69) / 12); m = x.mean(axis=1)[int(.4 * SR):int(2.4 * SR)]; n = 1 << 18
                S = np.abs(np.fft.rfft(m * np.hanning(len(m)), n)); f = np.fft.rfftfreq(n, 1 / SR)
                e = sum(S[(f > att * h / 1.03) & (f < att * h * 1.03)].max() for h in (1, 2, 3, 4)); sous = S[(f > att / 2 / 1.03) & (f < att / 2 * 1.03)].max()
                essais.append((e - 4 * sous, k))
            k = max(essais)[1]; hz, h = hauteur(x, 440 * 2 ** ((k - 69) / 12))
            cle = '%s%03d-%s' % (pupitre[0], k, couche); info = range_(x, cle, sortie, 12.0, avant=.02)
            info.update(midi=k, couche=couche, pupitre=pupitre, hz=hz, cents=1200 * np.log2(hz / (440 * 2 ** ((k - 69) / 12)))); index['cordes'][cle] = info
            print(cle, fichier, 'pic %.4f' % info['pic'], 'eff %.4f' % info['eff'], '%.1f s' % info['duree'], '%+.1f cents (h%d)' % (info['cents'], h), [round(e[0], 1) for e in essais], flush=True)
    json.dump(index, open(os.path.join(sortie, 'index.json'), 'w'), indent=0)
    justesse(sortie)
