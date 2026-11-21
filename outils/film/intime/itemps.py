# Montage intime de « Ce qu'on ne dit pas par SMS » (21 novembre 2026) : le minutage. Les images et le son lisent les mêmes nombres (30 images par seconde).
IPS = 30
PLANS = [('a1', 90),    # la table, le soir : la pièce seule, 2 vibrations, l'écran s'allume (un message d'Élise)
         ('a2', 105),   # le fil : « Comment va ta fille ? » Il répond « Elle va bien, merci. » et envoie
         ('a3', 210),   # sa main immobile près du verre : une note de piano dans le silence, puis la ligne du public (5 secondes pleines)
         ('b1', 207),   # « Déposer ce qui pèse » : la question, il écrit « Ça me manque de jouer avec elle. »
         ('b2', 96),    # son carnet : « Poser les mains à plat. »
         ('b3', 120),   # ses 2 mains à plat sur la table
         ('b4', 78),    # « Le lendemain » : le minuteur, un instant
         ('b5', 66),    # la tablette écartée
         ('b6', 60),    # entre eux, les dominos : une pièce touche le bois
         ('b7', 60),    # son père relève les yeux
         ('b8', 87),    # elle le regarde, elle sourit (le violoncelle entre)
         ('b9', 36),    # sa main près des dominos
         ('c1', 180),   # la main de Bastien sur son stylo, le cadre s'élargit : lui et sa mère. « Bastien prépare son week-end chez son oncle Rémi. »
         ('c2', 90),    # « Passer le relais », le vrai écran
         ('c3', 90),    # Bastien, à hauteur de regard, son fauteuil bleu
         ('c4', 270),   # il choisit « J'aime… » et écrit « prendre mon café seul, le matin. »
         ('c5', 135),   # sa fiche : on relit sa phrase
         ('d1', 240),   # il tend la feuille pliée à Rémi
         ('d2', 150),   # dimanche matin : près de la fenêtre, sa tasse à la main
         ('d3', 210),   # plus près : il est seul, comme il l'a demandé. L'ambiance seule
         ('e1', 60),    # le cadrage de la première scène : même table, même téléphone, la conversation avec Élise
         ('e2', 370),   # il écrit, on a le temps de lire, le pouce touche Envoyer : la quatrième note. Le message reste
         ('e3', 210)]   # « Parent écouté, parent éclairé »
DEBUT = {}; _n = 0
for _nom, _k in PLANS: DEBUT[_nom] = _n; _n += _k
TOTAL = _n; D = dict(PLANS)
assert TOTAL == 3220 and DEBUT['b1'] == 405 and DEBUT['c1'] == 1215 and DEBUT['d1'] == 1980 and DEBUT['e1'] == 2580 and DEBUT['e3'] == 3010, (TOTAL, DEBUT)
def T(nom, i=0): return (DEBUT[nom] + i) / IPS

# --- les instants du récit (en images depuis le début du film) ---
VIB1, VIB2 = 30, 42                       # les 2 vibrations (1,0 s et 1,4 s). Avant elles, on n'entend que la pièce. L'écran s'allume avec la première
D_VIB1, D_VIB2 = .235, .185               # leur durée (secondes) : la seconde est plus courte
FIL_A = dict(f1=10, n1=42, ap=64)         # le fil du début (images dans le plan a2) : il commence à écrire, la durée de la frappe, l'appui sur Envoyer
ENVOI_A = DEBUT['a2'] + FIL_A['ap']       # 154 : « Elle va bien, merci. » part
NOTE1 = DEBUT['a3'] + 30                  # 225 (7,5 s) : la première note de piano, dans le silence, sur sa main immobile
PUBLIC = (234, 246, 396, 405)             # la ligne du public : elle apparaît après la note, reste entière de 8,2 à 13,2 s (5 secondes pleines), s'efface avec le plan
DOMINO = DEBUT['b6'] + 14                 # 986 : la pièce touche le bois
CELLO = DEBUT['b8']                       # 1092 (36,4 s) : la fille regarde son père, le violoncelle entre
RACCORD = DEBUT['c1']                     # 1215 : de la main de la fille à la main de Bastien
PAPIER = DEBUT['d1'] + 24                 # 2004 : la feuille change de main (le froissement du papier). Le violoncelle s'efface
VERSE = DEBUT['d2'] - 66                  # 2154 : le café qu'on verse, 2,2 secondes avant la coupe
TASSE = DEBUT['d2'] + 42                  # 2262 : la tasse, juste après la coupe. Ensuite, l'ambiance seule
FIL_E = dict(f1=24, n1=170, ap=270)       # le fil de la fin (images dans le plan e2)
ENVOI = DEBUT['e2'] + FIL_E['ap']         # 2910 (97,0 s) : son pouce touche Envoyer, la quatrième note
assert ENVOI == 2910 and NOTE1 == 225 and CELLO == 1092
