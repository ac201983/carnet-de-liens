# Montage cinématographique de « Ce qu'on ne dit pas par SMS » : le minutage. Les images et le son lisent les mêmes nombres (30 images par seconde).
IPS = 30
PLANS = [('a1', 168),   # la table à 21 h 40 : le téléphone vibre, l'écran s'allume, la ligne qui dit pour qui est le site
         ('a2', 262),   # le fil : « Elle va bien, merci. », puis « En fait, moi… », le pouce s'arrête, il efface, un silence
         ('a3', 115),   # le téléphone retourné, la main au verre : « Ici, on commence par vous. »
         ('b1', 50),    # l'accueil du site, un appui sur « Déposer ce qui pèse »
         ('b2', 200),   # la question, puis ce qu'il écrit
         ('b3', 50),    # « J'aimerais le dire à quelqu'un »
         ('b4', 200),   # la phrase que le site propose, de près
         ('c1', 125),   # « Le lendemain », la fiche « Les écrans » et l'idée du minuteur
         ('c2', 100),   # le minuteur visuel jusqu'à « C'est fini. Bravo. »
         ('c3', 75),    # la tablette refermée sur la table
         ('c4', 50),    # sa main fait glisser un domino : on l'entend toucher le bois
         ('c5', 75),    # son père relève les yeux
         ('c6', 100),   # elle sourit
         ('c7', 100),   # la goutte de « Souffler 2 minutes »
         ('d1', 125),   # Bastien, à sa hauteur
         ('d2', 225),   # « Passer le relais » : il choisit « J'aime… » et écrit sa phrase
         ('d3', 125),   # il tend lui-même la fiche
         ('d4', 175),   # dimanche matin, son café, seul
         ('e1', 150),   # « Un autre soir », le carnet : « Poser les mains à plat. »
         ('e2', 75),    # la main à plat sur le bois
         ('e2b', 50),   # le cadrage du premier téléphone, à l'identique : cette fois c'est lui qui l'allume
         ('e3', 400),   # le fil, même cadrage : il écrit, hésite, envoie. Le message reste.
         ('e4', 225)]   # la signature
DEBUT = {}; _n = 0
for _nom, _k in PLANS: DEBUT[_nom] = _n; _n += _k
TOTAL = _n; D = dict(PLANS)
assert TOTAL == 3220 and DEBUT['b1'] == 545 and DEBUT['c1'] == 1045 and DEBUT['d1'] == 1670 and DEBUT['e1'] == 2320 and DEBUT['e3'] == 2595 and DEBUT['e4'] == 2995, (TOTAL, DEBUT)
def T(nom, i=0): return (DEBUT[nom] + i) / IPS

# --- les instants du récit (en images depuis le début du film) ---
VIB1, VIB2 = 24, 35                       # les 2 impulsions du vibreur (0,80 s et 1,17 s). L'écran s'allume avec la première.
D_VIB1, D_VIB2 = .235, .185               # leur durée (secondes) : la seconde est plus courte
MOTIF_A = (57, 82, 107)                   # après la vibration, le piano joue 3 notes. La quatrième (132) ne vient pas.
PUBLIC = (41, 53, 157, 166)               # la ligne du public : elle apparaît dès la fin de la vibration (1,37 à 1,77 s) et reste entière jusqu'à 5,23 s (3,5 secondes pour la lire)
# le fil du début (images dans le plan a2) : les mêmes nombres sont donnés à la capture (fil.js)
FIL_A = dict(f1=12, n1=46, ap=69, f2=87, n2=42, ef=192, ne=25)
POUCE_STOP = DEBUT['a2'] + 129            # « En fait, moi… » est écrit : le pouce s'arrête (297)
EFFACE = (DEBUT['a2'] + 192, DEBUT['a2'] + 217)
BATT_A = (297, 322, 347)                  # la pulsation entre : 3 battements de cœur, puis plus rien
ICI = (455, 475)                          # « Ici, on commence par vous. » apparaît dans le plan a3
MOTIF_B = (470, 495, 520)                 # le motif revient, sa quatrième note (545) est remplacée par le début de « Déposer »
DOMINO = DEBUT['c4'] + 12                 # le domino touche le bois (1357)
PAPIER = (DEBUT['d3'] + 10, DEBUT['d3'] + 46)   # la feuille passe de sa main à la nôtre
TASSE = DEBUT['d4'] + 20                  # la tasse (2165) : après la coupe, le temps que les cordes s'éteignent
ALLUME_E = DEBUT['e2b'] + 15              # il allume son téléphone
FIL_E = dict(f1=15, n1=160, ap=275)
MOTIF_E = (2795, 2820, 2845)              # les 3 notes, une par battement, pendant que le pouce hésite au-dessus d'Envoyer
ENVOI = DEBUT['e3'] + FIL_E['ap']         # il appuie sur Envoyer : la quatrième note (2870, soit 95,667 s)
assert ENVOI == 2870
