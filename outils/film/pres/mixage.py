# « Ce qu'on ne dit pas par SMS » : le son. Le film se comprend sans lui. Quand le parent l'active, peu de choses s'entendent, et chacune a sa place :
#   le verre qu'on repose et sa note qui rejoint l'étang (comme dans le film de 35 secondes), le domino qui touche le bois, la mélodie de la goutte
#   (les 4 notes de l'expiration de « Souffler », aux instants de l'exercice, avec l'eau), la tasse qui se pose, l'accord final sur le logo.
#   Autour des 2 SMS : rien. Ni vibreur, ni touches, ni musique.
# Aucun enregistrement extérieur : les bruits sont calculés (son.py), les notes de piano et l'eau viennent du site.
# python3 mixage.py  →  tmp/film.wav, tmp/film-son.png (une image du son, faute de pouvoir l'écouter), tmp/son.json (les instants)
import sys, os, json, numpy as np
PRES = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.dirname(PRES)); sys.path.insert(0, PRES)
import son as S
import montage, plans
import ecran
IPS = 30; F = 1 / IPS
T = {nom: montage.DEBUT[nom] * F for nom, _ in montage.PLANS}; DUR = montage.TOTAL * F
POSE_VERRE = T['a4'] + F                                               # le verre touche la table à la 2e image de son plan
T_EXPIRE = T['d'] + .05; D_EXPIRE = 6.0                                # la goutte redescend pendant 6 secondes, dès le début du plan
NOTES_DESC, GAINS_DESC = (66, 64, 62, 57), (.70, .60, .52, .46)        # fa dièse, mi, ré, la grave : les notes et les forces de l'expiration dans l'exercice
T_DOMINO = T['c5'] + .30                                               # le domino touche le bois, la photo vient d'arriver
T_TASSE = T['e3'] + 2.45                                               # la tasse se pose, juste avant qu'on quitte Bastien
def t_notes(): return [T_EXPIRE + k * D_EXPIRE / len(NOTES_DESC) for k in range(len(NOTES_DESC))]
def souffle(t):
    """La hauteur de la goutte, de 1 (au sommet, au début du plan) à 0 (posée) : le mouvement de l'application."""
    b = np.clip((np.asarray(t, dtype=np.float64) - T_EXPIRE) / D_EXPIRE, 0, 1); return (1 + np.cos(np.pi * b)) / 2
def enveloppe(n, pts):
    t = np.arange(n) / S.SR; return np.interp(t, [p[0] for p in pts], [p[1] for p in pts])

def domino(rng):
    """Un domino posé sur une table en bois : un bord d'abord, puis la pièce à plat, 4 centièmes de seconde après. Petit, sec, mat."""
    dur = .45; n = S.n_(dur); x = np.zeros(n); t = np.arange(n) / S.SR
    for d, a, m in ((0.0, .5, ((420, .014, 1.0), (760, .010, .55), (1280, .006, .3))), (.042, 1.0, ((300, .022, 1.0), (520, .016, .7), (880, .010, .4), (1500, .006, .2)))):
        c = S.choc_bois(rng, dur - d, modes=m, bruit=.6, fc_bruit=2600, tau_bruit=.005); x[S.n_(d):S.n_(d) + len(c)] += a * c[:n - S.n_(d)]
    x += .16 * S.filtre(rng.standard_normal(n), 'band', (2600, 6500)) * (np.exp(-t / .003) * .6 + np.exp(-np.maximum(0, t - .042) / .004) * (t >= .042))
    return x / np.abs(x).max()
def tasse(rng):
    """Une tasse en grès reposée sur le bois : le bois répond, la tasse tinte à peine (un son court, plus grave et plus mat qu'un verre)."""
    dur = 1.1; n = S.n_(dur); t = np.arange(n) / S.SR
    bois = S.choc_bois(rng, dur, modes=((128, .050, 1.0), (214, .038, .7), (356, .022, .4), (560, .012, .18)), bruit=.5, fc_bruit=1100, tau_bruit=.011)[:n]
    clic = .15 * S.filtre(rng.standard_normal(n), 'band', (1800, 5200)) * np.exp(-t / .004)
    v = np.zeros(n)
    for rap, tau, a in ((1.0, .15, 1.0), (2.14, .08, .42), (3.46, .045, .2)): v += a * np.exp(-t / tau) * np.sin(2 * np.pi * 1180.0 * rap * t)
    v *= S.lisse(t, 0, .002)
    return bois * .6 + clic, v * .055

def film(fichier, piano=True):
    rng = np.random.default_rng(31); M = S.Mixage(DUR); pn = S.piano if piano else (lambda midi: np.zeros((8, 2)))
    # le silence des cuisines : très bas, sous les plans de table. Il s'efface sur l'étang et sur les cartons.
    c = S.cuisine(rng, DUR)
    M.pose(c * enveloppe(len(c), [(0, 0), (.3, .3), (T['a3'] - .3, .3), (T['a3'], .8), (T['a5'] - .5, .8), (T['a5'] + .5, 0), (T['b1'] + .2, 0), (T['b1'] + .8, .5), (T['c5'] - .1, .5), (T['c5'] + .2, .9), (T['d'] - .1, .9), (T['d'] + .3, 0),
                                  (T['e1'] - .1, 0), (T['e1'] + .4, .7), (T['e3'] + 2.6, .7), (T['f1'], .5), (T['f5'], .8), (T['g1'] - .2, .8), (T['g1'] + .3, .3), (T['g2'], .3), (T['g2'] + .6, 0), (DUR, 0)])[:, None], 0, 1.0)
    # le téléphone retourné sur le bois, après le premier SMS (le SMS lui-même reste en silence)
    M.pose(S.dans_la_piece(S.telephone_pose(rng), .24), T['a3'] - .03, .36, 'téléphone')
    # le verre reposé, sa note qui reste et remonte jusqu'à la coupe
    bois, clic, tinte = S.verre_pose(rng, monte=(1.1, T['a5'] - POSE_VERRE, .05))
    M.pose(S.dans_la_piece(bois + clic, .2), POSE_VERRE, .62, 'verre'); M.pose(S.dans_la_piece(tinte, .3, .5), POSE_VERRE, 1.0)
    # la première note rejoint l'étang, puis « Et vous ? », qu'on laisse seul avec l'eau
    M.pose(pn(69), T['a5'], .62, 'la'); M.pose(pn(50), T['a5'] + .012, .34)
    M.pose(pn(66), T['a5'] + plans.ET_VOUS[0] + .05, .40, 'et vous')
    e = S.eau(DUR); n = len(e)
    M.pose(e * enveloppe(n, [(0, 0), (T['a5'] - .25, 0), (T['a5'] + 1.1, .11), (T['b1'], .10), (T['b1'] + .55, 0), (DUR, 0)])[:, None], 0, 1.0)
    # le domino touche le bois
    M.pose(S.dans_la_piece(domino(rng), .2), T_DOMINO, .44, 'domino')
    # la mélodie de la goutte : les 4 notes de l'expiration, et l'eau de « Souffler », claire au sommet, puis plus sombre et plus basse à mesure que la goutte redescend
    h = souffle(np.arange(n) / S.SR)[:, None]; sombre, clair = S.filtre(e, 'low', 1100), S.filtre(e, 'low', 3600)
    presence = enveloppe(n, [(0, 0), (T['d'] - .1, 0), (T['d'] + .5, 1), (T_EXPIRE + D_EXPIRE, 1), (T['e1'] + .3, 0), (DUR, 0)])[:, None]
    M.pose((sombre * (1 - h) + clair * h) * (.40 + .60 * h) * presence, 0, .125)
    m = .58
    for k, (note, g) in enumerate(zip(NOTES_DESC, GAINS_DESC)): M.pose(pn(note), t_notes()[k], g * m, 'goutte %d' % (k + 1))
    # la tasse se pose
    b, v = tasse(rng); M.pose(S.dans_la_piece(b, .2), T_TASSE, .46, 'tasse'); M.pose(S.dans_la_piece(v, .26, .4), T_TASSE, 1.0)
    # la signature : un accord de ré qui se pose sur le logo (le second SMS, juste avant, reste en silence)
    for d, note, g in ((0, 50, .36), (.10, 57, .30), (.20, 62, .36), (.34, 66, .32)): M.pose(pn(note), T['g2'] + .12 + d, g, 'accord' if d == 0 else None)
    x = M.rendu(fichier, fondu_fin=1.2, gain=2.2); return x, M.reperes
if __name__ == '__main__':
    os.makedirs(PRES + '/tmp', exist_ok=True)
    x, rep = film(PRES + '/tmp/film.wav')
    S.regarde(x, PRES + '/tmp/film-son.png', rep + [(k, v) for k, v in T.items() if k in ('a2', 'a5', 'b1', 'c1', 'c5', 'd', 'e1', 'e3', 'f1', 'g1', 'g2')])
    json.dump({'plans': T, 'reperes': rep, 'notes_goutte': t_notes(), 'domino': T_DOMINO, 'tasse': T_TASSE, 'duree': DUR}, open(PRES + '/tmp/son.json', 'w'), indent=1)
    # ce qu'on entend, mesuré : le niveau par tranche, et le silence autour des 2 SMS
    m = x.mean(axis=1); db = lambda a, b: round(float(20 * np.log10(np.sqrt((m[S.n_(a):S.n_(b)] ** 2).mean()) + 1e-9)), 1)
    print('durée', round(len(x) / S.SR, 3), 'crête', round(float(np.abs(x).max()), 3))
    print('niveaux (dB) : premier SMS', db(T['a2'], T['a3'] - .05), '| verre', db(POSE_VERRE, POSE_VERRE + .4), '| étang', db(T['a5'] + .1, T['a5'] + 2), '| Déposer', db(T['b2'], T['b4']), '| domino', db(T_DOMINO, T_DOMINO + .15),
          '| goutte', db(T_EXPIRE, T_EXPIRE + 1.5), '| tasse', db(T_TASSE, T_TASSE + .15), '| second SMS', db(T['g1'], T['g2'] - .05), '| accord', db(T['g2'] + .1, T['g2'] + 1.5))
    print({k: round(v, 3) for k, v in T.items()}, 'notes', [round(v, 3) for v in t_notes()], 'domino', round(T_DOMINO, 3), 'tasse', round(T_TASSE, 3))
