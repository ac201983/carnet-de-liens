# Faute de pouvoir écouter : mesure, dans un fichier son ou dans un film exporté, l'instant où chaque note de « Souffler » commence, et le compare au mouvement de la goutte.
# python3 mesure_son.py <fichier .wav ou .mp4>
import sys, os, subprocess, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfiltfilt, hilbert
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mixage
def lire(chemin):
    if chemin.endswith('.wav'): sr, x = wavfile.read(chemin)
    else:
        tmp = '/tmp/mesure-son.wav'; subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', chemin, '-vn', '-ac', '2', '-ar', '48000', '-c:a', 'pcm_s16le', tmp], check=True); sr, x = wavfile.read(tmp)
    return sr, x.astype(np.float64).mean(axis=1) / 32768
def debut_note(x, sr, midi, t_nom):
    """L'instant où la note commence : sa hauteur fondamentale est isolée, puis on cherche où son volume se met à monter (10 % puis 50 % de la montée)."""
    f0 = 440 * 2 ** ((midi - 69) / 12); sos = butter(4, [f0 * .955 / (sr / 2), f0 * 1.045 / (sr / 2)], btype='band', output='sos')
    a, b = int((t_nom - .6) * sr), int((t_nom + .6) * sr); y = np.abs(hilbert(sosfiltfilt(sos, x[a:b]))); k = int(.004 * sr); y = np.convolve(y, np.ones(k) / k, mode='same')
    t = np.arange(a, b) / sr; avant = y[(t > t_nom - .30) & (t < t_nom - .08)].max(); apres = y[(t > t_nom) & (t < t_nom + .30)].max()
    def passe(p):
        s = avant + p * (apres - avant); i = np.where((t > t_nom - .08) & (y > s))[0]; return t[i[0]] if len(i) else float('nan')
    return passe(.10), passe(.50), apres / max(avant, 1e-9)
if __name__ == '__main__':
    chemin = sys.argv[1]; sr, x = lire(chemin); tn = mixage.t_notes(); noms = ['ré', 'fa dièse', 'la', 'fa dièse', 'mi', 'ré', 'la grave']; notes = list(mixage.NOTES_MONTE) + list(mixage.NOTES_DESC)
    print(os.path.basename(chemin), ': durée %.3f s' % (len(x) / sr))
    print('  la goutte part à %.3f s, elle est au sommet à %.3f s, elle est revenue à %.3f s' % (mixage.T_INSPIREZ, mixage.T_EXPIREZ, mixage.T_POSEE))
    for i, (m, t0) in enumerate(zip(notes, tn)):
        t10, t50, r = debut_note(x, sr, m, t0)
        print('  note %d (%s) prévue à %.3f s : elle commence à %.3f s (%+.0f ms), à mi-montée à %.3f s (%+.0f ms)%s' % (i + 1, noms[i], t0, t10, (t10 - t0) * 1000, t50, (t50 - t0) * 1000, '   <- la première note qui redescend : le sommet de la goutte' if i == 3 else ''))
    if chemin.endswith('.wav') and '--eau' in sys.argv:
        # l'eau sans les notes (le même mixage, refait sans le piano) : son niveau et sa clarté suivent-ils la goutte ?
        mixage.film('/tmp/mesure-eau.wav', 'V', piano=False); sr, e = lire('/tmp/mesure-eau.wav'); k = int(.4 * sr)
        def niveau(lo, hi):
            sos = butter(4, [lo / (sr / 2), hi / (sr / 2)], btype='band', output='sos'); y = sosfiltfilt(sos, e) ** 2; return np.convolve(y, np.ones(k) / k, mode='same')
        tout, aigu = niveau(150, 6000), niveau(1500, 3400); a, b = int((mixage.T_INSPIREZ - .2) * sr), int((mixage.T_POSEE + .2) * sr)
        for nom, y in (('le niveau de l’eau', tout), ('la clarté de l’eau (entre 1,5 et 3,4 kHz)', aigu)):
            i = a + int(np.argmax(y[a:b])); db = lambda t: 10 * np.log10(y[int(t * sr)] / y[i] + 1e-12)
            print('  %s est au plus haut à %.2f s ; au départ de la goutte %.1f dB, au sommet %.1f dB, 2 s après %.1f dB, au retour %.1f dB' % (nom, i / sr, db(mixage.T_INSPIREZ), db(mixage.T_EXPIREZ), db(mixage.T_EXPIREZ + 2), db(mixage.T_POSEE - .2)))
