# « Et vous ? » : le son du film entier. Trois sons portent le récit : le téléphone sur le bois, le verre qu'on repose, la première note qui rejoint l'étang.
# V3 (20 novembre 2026) : le minutage suit le nouveau montage. La musique de « Souffler » est calée sur la goutte : la première note monte quand la goutte part,
# la première note qui redescend tombe au sommet de la goutte, et l'eau s'éclaircit pendant l'inspiration puis s'assombrit pendant l'expiration, comme dans l'exercice.
# python3 mixage.py [V|I]   (I : l'export Instagram, dont le dernier carton dure plus longtemps)
import sys, os, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import son as S
import montage, ecran, cuisine, raccord
IPS = 30; F = 1 / IPS
ICI = os.path.dirname(os.path.abspath(__file__))
REP = json.load(open(ICI + '/ecrans/fil/reperes.json'))
def temps(f='V'):
    T = {nom: montage.DEBUT[nom] * F for nom, _ in montage.PLANS}; T['fin'] = montage.total(f) * F; return T
T = temps()
T_INSPIREZ = T['s7'] + ecran.J_INSPIREZ * F                            # l'application écrit « Inspirez » : la goutte part
T_EXPIREZ = T['s7'] + ecran.J_EXPIREZ * F                              # le sommet de la goutte : l'application écrit « Expirez »
D_INSPIRE, D_EXPIRE = (ecran.C_EXPIREZ - ecran.C_INSPIREZ) * F, 6.0    # 4 secondes pour monter, 6 secondes pour redescendre (le réglage de départ de l'exercice)
T_POSEE = T_EXPIREZ + D_EXPIRE                                          # la goutte est revenue
POSE_VERRE = T['s4'] + F
NOTES_MONTE, GAINS_MONTE = (62, 66, 69), (.62, .74, .86)                # ré, fa dièse, la : les notes et les forces de l'exercice (RS_MONTE, RS_G_MONTE)
NOTES_DESC, GAINS_DESC = (66, 64, 62, 57), (.70, .60, .52, .46)        # fa dièse, mi, ré, la grave (RS_DESC « long », RS_G_DESC)
def t_notes():
    """Les instants des 7 notes de « Souffler » : réparties à égale distance dans chaque mouvement, comme dans l'exercice."""
    return [T_INSPIREZ + k * D_INSPIRE / len(NOTES_MONTE) for k in range(len(NOTES_MONTE))] + [T_EXPIREZ + k * D_EXPIRE / len(NOTES_DESC) for k in range(len(NOTES_DESC))]
def souffle(t):
    """La hauteur de la goutte à l'instant t, de 0 (posée) à 1 (au sommet) : le même mouvement que dans l'application (mesuré sur la capture, image par image)."""
    t = np.asarray(t, dtype=np.float64); a = np.clip((t - T_INSPIREZ) / D_INSPIRE, 0, 1); b = np.clip((t - T_EXPIREZ) / D_EXPIRE, 0, 1)
    return np.where(t < T_EXPIREZ, (1 - np.cos(np.pi * a)) / 2, (1 + np.cos(np.pi * b)) / 2)
def enveloppe(n, pts):
    t = np.arange(n) / S.SR; xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; return np.interp(t, xs, ys)
def touche(rng, fort=1.0):
    n = S.n_(.05); t = np.arange(n) / S.SR
    x = S.filtre(rng.standard_normal(n), 'band', (1700, 4600)) * np.exp(-t / .0045) + .5 * np.sin(2 * np.pi * rng.uniform(170, 210) * t) * np.exp(-t / .008)
    return x / np.abs(x).max() * fort
def film(fichier, f='V', piano=True):
    """piano=False : le même mixage sans les notes, pour mesurer l'eau seule."""
    T = temps(f); rng = np.random.default_rng(21); DUR = T['fin']; M = S.Mixage(DUR); pn = S.piano if piano else (lambda midi: np.zeros((8, 2)))
    # la cuisine : son silence, sous les plans de la table, et derrière le téléphone quand on voit « Souffler 2 minutes »
    c = S.cuisine(rng, DUR)
    M.pose(c * enveloppe(len(c), [(0, 0), (.15, 1), (T['s5'] - .5, 1), (T['s5'] + .5, 0), (T['s6'] + .05, 0), (T['s6'] + .5, .8), (T['s7'], .8), (T['s7'] + .8, 0), (T['s8'] - .3, 0), (T['s8'] + .5, .9), (T['s9'] + .1, .9), (T['s9'] + 1.2, 0), (DUR, 0)])[:, None], 0, 1.0)
    # 1. le téléphone vibre et s'éclaire
    M.pose(S.dans_la_piece(S.vibreur(rng), .16), T['s1'] + cuisine.ALLUME - .02, .15, 'vibreur')
    # 2. la réponse : chaque touche. Après le point, rien : le curseur clignote seul. Puis l'envoi.
    for i, tt in enumerate(REP['T_TOUCHE']): M.pose(S.stereo(touche(rng, rng.uniform(.75, 1.0)), rng.uniform(-.15, .15)), T['s2'] + tt, .05, 'frappe' if i == 0 else ('point' if i == len(REP['T_TOUCHE']) - 1 else None))
    M.pose(S.stereo(touche(rng, 1.0)), T['s2'] + REP['T_ENVOI'], .05, 'envoi')
    # 3. le téléphone retourné sur le bois : le son arrive juste avant l'image
    M.pose(S.dans_la_piece(S.telephone_pose(rng), .24), T['s3'] - .03, .5, 'téléphone')
    # 4. le verre reposé, sa note qui reste et remonte jusqu'à la coupe
    bois, clic, tinte = S.verre_pose(rng, monte=(1.1, T['s5'] - POSE_VERRE, .05))
    M.pose(S.dans_la_piece(bois + clic, .2), POSE_VERRE, .62, 'verre')
    M.pose(S.dans_la_piece(tinte, .3, .5), POSE_VERRE, 1.0)
    # 5. la première note rejoint l'étang, puis « Et vous ? », qu'on laisse seul avec l'eau
    M.pose(pn(69), T['s5'], .62, 'la'); M.pose(pn(50), T['s5'] + .012, .34)
    M.pose(pn(66), T['s5'] + montage.ET_VOUS[0] + .05, .40, 'et vous')
    # l'eau de l'étang sous « Et vous ? » : elle s'efface quand l'étang se fond dans le téléphone
    e = S.eau(DUR); n = len(e)
    M.pose(e * enveloppe(n, [(0, 0), (T['s5'] - .25, 0), (T['s5'] + 1.1, .11), (T['s6'], .10), (T['s6'] + .55, 0), (DUR, 0)])[:, None], 0, 1.0)
    # 6. le doigt, puis l'eau et la musique de l'exercice
    M.pose(S.stereo(touche(rng, 1.0)), T['s7'], .045, 'doigt')
    # l'eau de « Souffler » respire avec la goutte : sombre et basse quand la goutte est posée, claire et plus présente au sommet (les réglages RS_SOMBRE, RS_CLAIR, RS_EAU_BAS de l'exercice)
    h = souffle(np.arange(n) / S.SR)[:, None]
    sombre, clair = S.filtre(e, 'low', 1100), S.filtre(e, 'low', 3600)
    presence = enveloppe(n, [(0, 0), (T['s7'], 0), (T['s7'] + 1.2, 1), (T_POSEE, 1), (T['s8'] + .35, 0), (DUR, 0)])[:, None]
    M.pose((sombre * (1 - h) + clair * h) * (.40 + .60 * h) * presence, 0, .125)
    # 3 notes montent à l'inspiration (avec une basse), 4 redescendent à l'expiration : les notes, les forces et le minutage de l'exercice
    m = .58; tn = t_notes()
    M.pose(pn(50), T_INSPIREZ, .50 * m)
    for k, (note, g) in enumerate(zip(NOTES_MONTE, GAINS_MONTE)): M.pose(pn(note), tn[k], g * m, 'inspirez' if k == 0 else None)
    for k, (note, g) in enumerate(zip(NOTES_DESC, GAINS_DESC)): M.pose(pn(note), tn[3 + k], g * m, 'expirez' if k == 0 else None)
    # 7. la signature : un accord de ré qui se pose sur le logo
    for d, note, g in ((0, 50, .36), (.10, 57, .30), (.20, 62, .36), (.34, 66, .32)): M.pose(pn(note), T['s9'] + .12 + d, g, 'accord' if d == 0 else None)
    x = M.rendu(fichier, fondu_fin=1.5, gain=2.2); return x, M.reperes, T       # + 6 dB : le film reste doux, mais s'entend sur le haut-parleur d'un téléphone
if __name__ == '__main__':
    f = (sys.argv[1:] or ['V'])[0]; nom = 'tmp/film.wav' if f == 'V' else 'tmp/film-%s.wav' % f
    x, rep, T = film(nom, f)
    S.regarde(x, nom[:-4] + '-son.png', rep + [(k, v) for k, v in T.items() if k not in ('s1', 'fin')])
    print(f, 'durée', round(len(x) / S.SR, 3), 'crête', round(float(np.abs(x).max()), 3), 'rms', round(float(np.sqrt((x ** 2).mean())), 4), {k: round(v, 3) for k, v in T.items()}, 'inspirez', round(T_INSPIREZ, 3), 'expirez', round(T_EXPIREZ, 3), 'goutte posée', round(T_POSEE, 3))
