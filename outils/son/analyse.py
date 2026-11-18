import sys, numpy as np
from scipy.io import wavfile
from scipy import signal as sg
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
f = sys.argv[1]; out = sys.argv[2]; LEAD = 1.4 if 'etang' in f else None
sr, x = wavfile.read(f); x = x.astype(np.float64) / 32768.0
if x.ndim == 1: x = np.stack([x, x], 1)
n = len(x); t = np.arange(n) / sr; mono = x.mean(1)
def db(v): return 20 * np.log10(np.maximum(v, 1e-9))
# niveaux par tranche de 250 ms
w = int(sr * 0.25); m = n // w; rms = np.sqrt((mono[:m * w].reshape(m, w) ** 2).mean(1)); tt = (np.arange(m) + 0.5) * 0.25
print('durée %.2f s | crête %.1f dBFS | efficace global %.1f dBFS' % (n / sr, db(np.abs(x).max()), db(np.sqrt((mono ** 2).mean()))))
print('corrélation gauche/droite %.2f' % np.corrcoef(x[:, 0], x[:, 1])[0, 1])
# sauts brusques : la plus grande différence entre 2 échantillons voisins, rapportée au niveau autour
d = np.abs(np.diff(mono)); i = int(np.argmax(d)); print('plus grand saut entre 2 échantillons : %.4f à %.2f s (crête locale %.3f)' % (d[i], i / sr, np.abs(mono[max(0, i - 2000):i + 2000]).max()))
print('début : %.5f | fin : %.5f | dernier quart de seconde, crête %.5f' % (abs(mono[0]), abs(mono[-1]), np.abs(mono[-int(sr * 0.25):]).max()))
# l'eau seule : la bande 1 à 3 kHz, où le piano feutré est presque absent
sos = sg.butter(4, [1500, 3500], btype='band', fs=sr, output='sos'); e = sg.sosfilt(sos, mono); er = np.sqrt((e[:m * w].reshape(m, w) ** 2).mean(1))
if LEAD is not None:
    u = np.mod(tt - LEAD, 10.0); ok = (tt > LEAD + 10) & (tt < LEAD + 110)
    haut = er[ok & (u > 3.0) & (u < 5.0)].mean(); bas = er[ok & (u > 8.5)].mean()
    print('eau (1,5 à 3,5 kHz) : en haut de l’inspiration %.1f dB, au creux %.1f dB, écart %.1f dB' % (db(haut), db(bas), db(haut) - db(bas)))
    # niveau moyen par phase, toutes bandes
    print('niveau moyen pendant l’inspiration %.1f dBFS, pendant l’expiration %.1f dBFS' % (db(rms[ok & (u < 4)].mean()), db(rms[ok & (u >= 4)].mean())))
# répartition de l'énergie
f_, P = sg.welch(mono, sr, nperseg=8192); tot = P.sum()
for lo, hi in ((0, 100), (100, 300), (300, 800), (800, 2000), (2000, 5000), (5000, 22050)): print('  %5d à %5d Hz : %4.1f %%' % (lo, hi, 100 * P[(f_ >= lo) & (f_ < hi)].sum() / tot))
fig, ax = plt.subplots(3, 1, figsize=(15, 9.5), gridspec_kw={'height_ratios': [2.3, 1, 1]})
S_f, S_t, S = sg.spectrogram(mono, sr, nperseg=4096, noverlap=3072); ax[0].pcolormesh(S_t, S_f, 10 * np.log10(S + 1e-14), vmin=-125, vmax=-45, cmap='magma', shading='auto'); ax[0].set_ylim(0, 4000); ax[0].set_ylabel('Hz'); ax[0].set_title(f)
ax[1].plot(tt, db(rms), lw=0.9, color='#2a6'); ax[1].plot(tt, db(er) + 12, lw=0.8, color='#39c'); ax[1].set_ylim(-70, -10); ax[1].set_ylabel('dBFS (vert : tout, bleu : eau +12)'); ax[1].set_xlim(0, n / sr); ax[1].grid(alpha=.3)
ax[2].plot(t[::20], mono[::20], lw=0.3, color='#444'); ax[2].set_xlim(0, n / sr); ax[2].set_ylim(-0.45, 0.45); ax[2].set_xlabel('secondes')
if LEAD is not None:
    for k in range(13):
        for a in ax: a.axvline(LEAD + 10 * k, color='w' if a is ax[0] else '#c33', lw=0.5, alpha=.7)
        if k < 12:
            for a in ax: a.axvline(LEAD + 10 * k + 4, color='w' if a is ax[0] else '#c93', lw=0.4, alpha=.5, ls='--')
plt.tight_layout(); plt.savefig(out, dpi=70); print('image', out)
