# « Et vous ? » : le son du film entier. Trois sons portent le récit : le téléphone sur le bois, le verre qu'on repose, la première note qui rejoint l'étang.
import sys, os, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import son as S
IPS = 30; F = 1 / IPS
T = dict(s1=0, s2=36 * F, s3=162 * F, s4=210 * F, s5=312 * F, s6a=429 * F, s6=453 * F, s7=498 * F, s8=827 * F, s9=923 * F, fin=1050 * F)
REP = json.load(open(os.path.dirname(os.path.abspath(__file__)) + '/ecrans/fil/reperes.json'))
T_INSPIREZ = T['s7'] + (78 - 49) * F; T_EXPIREZ = T_INSPIREZ + 4.0
POSE_VERRE = T['s4'] + F
def enveloppe(n, pts):
    t = np.arange(n) / S.SR; xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; return np.interp(t, xs, ys)
def touche(rng, fort=1.0):
    n = S.n_(.05); t = np.arange(n) / S.SR
    x = S.filtre(rng.standard_normal(n), 'band', (1700, 4600)) * np.exp(-t / .0045) + .5 * np.sin(2 * np.pi * rng.uniform(170, 210) * t) * np.exp(-t / .008)
    return x / np.abs(x).max() * fort
def film(fichier):
    rng = np.random.default_rng(21); DUR = T['fin']; M = S.Mixage(DUR)
    # la cuisine : son silence, sous les plans de la table
    c = S.cuisine(rng, DUR)
    M.pose(c * enveloppe(len(c), [(0, 0), (.15, 1), (T['s5'] - .5, 1), (T['s5'] + .5, 0), (T['s6a'] - .2, 0), (T['s6a'] + .3, 1), (T['s7'], 1), (T['s7'] + .8, 0), (T['s8'] - .3, 0), (T['s8'] + .5, .9), (T['s9'] + .2, .9), (T['s9'] + 1.4, 0), (DUR, 0)])[:, None], 0, 1.0)
    # 1. le téléphone vibre et s'éclaire
    M.pose(S.dans_la_piece(S.vibreur(rng), .16), T['s1'] + .28, .15, 'vibreur')
    # 2. la réponse : chaque touche, puis l'envoi
    for i, tt in enumerate(REP['T_TOUCHE']): M.pose(S.stereo(touche(rng, rng.uniform(.75, 1.0)), rng.uniform(-.15, .15)), T['s2'] + tt, .05, 'frappe' if i == 0 else None)
    M.pose(S.stereo(touche(rng, 1.0)), T['s2'] + REP['T_ENVOI'], .05, 'envoi')
    # 3. le téléphone retourné sur le bois : le son arrive juste avant l'image
    M.pose(S.dans_la_piece(S.telephone_pose(rng), .24), T['s3'] - .03, .5, 'téléphone')
    # 4. le verre reposé, sa note qui reste et remonte jusqu'à la coupe
    bois, clic, tinte = S.verre_pose(rng, monte=(1.4, T['s5'] - POSE_VERRE, .05))
    M.pose(S.dans_la_piece(bois + clic, .2), POSE_VERRE, .62, 'verre')
    M.pose(S.dans_la_piece(tinte, .3, .5), POSE_VERRE, 1.0)
    # 5. la première note rejoint l'étang, puis « Et vous ? »
    M.pose(S.piano(69), T['s5'], .62, 'la'); M.pose(S.piano(50), T['s5'] + .012, .34)
    M.pose(S.piano(66), T['s5'] + 1.40, .40, 'fa dièse')
    e = S.eau(DUR); M.pose(e * enveloppe(len(e), [(0, 0), (T['s5'] - .25, 0), (T['s5'] + 1.1, .11), (T['s6a'] - .5, .10), (T['s6a'] + .25, 0), (T['s7'], 0), (T['s7'] + 1.2, .06), (T_INSPIREZ, .06), (T_EXPIREZ, .105), (T['s8'] - .2, .05), (T['s8'] + .6, 0), (DUR, 0)])[:, None], 0, 1.0)
    # 6. le doigt, puis la musique de l'exercice : 3 notes montent à l'inspiration, 4 redescendent à l'expiration (les notes et le minutage de l'application)
    M.pose(S.stereo(touche(rng, 1.0)), T['s7'], .045, 'doigt')
    m = .58
    M.pose(S.piano(50), T_INSPIREZ, .50 * m)
    for k, (note, g) in enumerate(zip((62, 66, 69), (.62, .74, .86))): M.pose(S.piano(note), T_INSPIREZ + k * 4 / 3, g * m, 'inspirez' if k == 0 else None)
    for k, (note, g) in enumerate(zip((66, 64, 62, 57), (.70, .60, .52, .46))): M.pose(S.piano(note), T_EXPIREZ + k * 1.5, g * m, 'expirez' if k == 0 else None)
    # 7. la signature : un accord de ré qui se pose sur le logo
    for d, note, g in ((0, 50, .36), (.10, 57, .30), (.20, 62, .36), (.34, 66, .32)): M.pose(S.piano(note), T['s9'] + .32 + d, g, 'accord' if d == 0 else None)
    x = M.rendu(fichier, fondu_fin=1.0, gain=2.2); return x, M.reperes       # + 6 dB : le film reste doux, mais s'entend sur le haut-parleur d'un téléphone
if __name__ == '__main__':
    x, rep = film('tmp/film.wav')
    S.regarde(x, 'tmp/film-son.png', rep + [(k, v) for k, v in T.items() if k not in ('s1', 'fin')])
    print('crête', round(float(np.abs(x).max()), 3), 'rms', round(float(np.sqrt((x ** 2).mean())), 4), {k: round(v, 3) for k, v in T.items()}, 'inspirez', round(T_INSPIREZ, 3), 'expirez', round(T_EXPIREZ, 3))
