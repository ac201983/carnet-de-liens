# Le piano reste-t-il devant l'eau, y compris sur un petit haut-parleur (qui rend mal ce qui est sous 300 Hz) ?
import sys, numpy as np
from scipy import signal as sg
SR = 44100; f = sys.argv[1]
p = np.load(f + '.piano.npy').mean(0).astype(np.float64); w = np.load(f + '.eau.npy').mean(0).astype(np.float64)
def db(v): return 20 * np.log10(max(v, 1e-9))
def mesure(nom, p, w):
    win = int(SR * 0.4); m = len(p) // win
    pr = np.sqrt((p[:m * win].reshape(m, win) ** 2).mean(1)); wr = np.sqrt((w[:m * win].reshape(m, win) ** 2).mean(1))
    ok = slice(8, m - 30)
    print('%-34s piano : forts %.1f dB, médiane %.1f dB | eau : médiane %.1f dB, forts %.1f dB | le piano dépasse l’eau de %.1f dB sur ses notes' % (nom, db(np.percentile(pr[ok], 90)), db(np.median(pr[ok])), db(np.median(wr[ok])), db(np.percentile(wr[ok], 90)), db(np.percentile(pr[ok], 90)) - db(np.median(wr[ok]))))
mesure('casque ou enceinte :', p, w)
sos = sg.butter(2, 320, btype='high', fs=SR, output='sos'); mesure('petit haut-parleur (coupé à 320 Hz) :', sg.sosfilt(sos, p), sg.sosfilt(sos, w))
sos = sg.butter(3, 500, btype='high', fs=SR, output='sos'); mesure('très petit haut-parleur (500 Hz) :', sg.sosfilt(sos, p), sg.sosfilt(sos, w))
