# L'extrait de 5 secondes du raccord : tout le plan du verre (3,4 s), puis 1,6 s d'étang. Image et son.
import sys, os, numpy as np, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import son as S
def son_extrait(fichier, T4=3.4, dur=5.0, pose=1 / 30):
    rng = np.random.default_rng(11); M = S.Mixage(dur)
    M.pose(S.cuisine(rng, T4 + .6) * (1 - S.lisse(np.arange(S.n_(T4 + .6)) / S.SR, T4 - .5, T4 + .5))[:, None], 0, 1.0)
    bois, clic, tinte = S.verre_pose(rng, monte=(1.4, T4 - pose, .05))
    M.pose(S.dans_la_piece(bois + clic, .2), pose, .62, 'verre')
    M.pose(S.dans_la_piece(tinte, .3, .5), pose, 1.0)
    M.pose(S.piano(69), T4, .62, 'la (piano)'); M.pose(S.piano(50), T4 + .012, .34)
    e = S.eau(dur - T4 + .4); te = np.arange(len(e)) / S.SR
    M.pose(e * S.lisse(te, 0, 1.3)[:, None], T4 - .25, .11, 'étang')
    x = M.rendu(fichier, fondu_fin=.5, gain=2.2); return x, M.reperes       # le même niveau que dans le film
if __name__ == '__main__':
    x, rep = son_extrait('tmp/raccord/extrait.wav')
    S.regarde(x, 'tmp/raccord/extrait-son.png', rep + [('coupe', 3.4)])
    print('crête', round(float(np.abs(x).max()), 3), 'rms', round(float(np.sqrt((x ** 2).mean())), 4))
