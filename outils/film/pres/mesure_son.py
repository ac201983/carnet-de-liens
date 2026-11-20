# Faute de pouvoir écouter : où commencent réellement les sons dans un film exporté ? python3 mesure_son.py <film.mp4>
# Pour chaque son attendu (tmp/son.json), on cherche l'instant où le volume monte nettement, dans le quart de seconde autour de l'instant prévu.
import sys, os, json, subprocess, numpy as np
PRES = os.path.dirname(os.path.abspath(__file__)); SR = 48000
j = json.load(open(PRES + '/tmp/son.json'))
x = np.frombuffer(subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', sys.argv[1], '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout, np.int16).astype(np.float64) / 32768
def debut(t, avant=.12, apres=.25, pas=.002):
    """L'instant où le niveau monte le plus vite autour de t (fenêtres de 8 millièmes de seconde)."""
    n = int(pas * SR); k0 = int((t - avant) * SR); k1 = int((t + apres) * SR); w = int(.008 * SR)
    e = np.array([np.sqrt((x[k:k + w] ** 2).mean()) for k in range(max(0, k0), k1, n)]); db = 20 * np.log10(e + 1e-7); d = db[4:] - db[:-4]
    i = int(np.argmax(d)); return max(0, k0) / SR + (i + 4) * pas, float(d[i])
att = [(nom, t) for nom, t in j['reperes'] if nom]
print('durée du son', round(len(x) / SR, 3), 's')
for nom, t in att:
    m, saut = debut(t); print('%-12s prévu %7.3f s | mesuré %7.3f s | écart %+4.0f ms | saut de %4.1f dB' % (nom, t, m, (m - t) * 1000, saut))
def niveau(a, b): return round(float(20 * np.log10(np.sqrt((x[int(a * SR):int(b * SR)] ** 2).mean()) + 1e-9)), 1)
P = j['plans']; print('silence autour des SMS : premier', niveau(P['a2'], P['a3'] - .05), 'dB | second', niveau(P['g1'], P['g2'] - .05), 'dB | étang', niveau(P['a5'] + .2, P['a5'] + 2.5), 'dB | goutte', niveau(P['d'], P['d'] + 6), 'dB')
