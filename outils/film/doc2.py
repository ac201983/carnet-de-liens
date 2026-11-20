# Met à jour le document de la version d'essai (build/essai/version-essai.md) après les 3 demandes d'Antonio du 20 novembre à 5 h 02 :
# le démarrage en silence, l'entrée du film vertical dans « Souffler », l'estimation du plan de la main.
# python3 build/film/doc2.py "<phrase sur les vérifications en ligne>"
import sys
p = '/home/claude/build/essai/version-essai.md'; t = open(p, encoding='utf-8').read()
EN_LIGNE = sys.argv[1] if len(sys.argv) > 1 else ''
def rem(a, b, n=1):
    global t
    assert t.count(a) == n, (t.count(a), a[:80]); t = t.replace(a, b)

# 1. Où on en est
rem("**Où on en est le 20 novembre 2026, à l'aube** :", "**Où on en est le 20 novembre 2026, au matin** :")
rem("Les gestes de la main ne sont pas filmés et le son n'a pas été écouté : ce sont les 2 choses à juger en premier.",
    "Le film démarre en silence, avec un bouton « Activer le son » bien visible. Au format vertical, « Installez-vous » se lit maintenant en entier à l'entrée de « Souffler ». Antonio juge le son lui-même sur son iPhone, au casque puis sur le haut-parleur. Les gestes de la main ne sont pas filmés : un seul plan est chiffré, environ 6 francs avec un plafond proposé de 15 francs, et rien n'est dépensé tant qu'Antonio n'a pas dit oui.")

# 2. La nouvelle sous-section, en tête de la section du film
rem("""### Les 4 réponses d'Antonio
""", """### Le 20 novembre à 5 heures : les 3 demandes d'Antonio

À 5 h 02, Antonio a répondu aux questions de la livraison.

- **Cette première version reste dans la version d'essai.** Elle n'est publiée nulle part ailleurs.
- **Le son.** Antonio le valide lui-même sur son iPhone, au casque puis sur le haut-parleur. Claude ne peut pas écouter : il n'y a rien à faire de son côté.
- **Le démarrage.** Antonio choisit un démarrage silencieux, avec « Activer le son » bien visible. C'est fait. Le film démarre toujours muet. Tant qu'il est muet, le bouton du son est clair sur la barre sombre, large, et il porte ses mots : « Activer le son ». Un toucher met le son sans arrêter le film. Le bouton devient alors un bouton rond, « Couper le son », et le curseur du volume revient là où l'appareil le permet (pas sur iPhone, où le volume se règle avec les boutons du téléphone). À chaque ouverture du lecteur, le film repart en silence. « Revoir le film » garde le son choisi.
- **Le zoom vertical.** Dans la première version, le cadre plongeait vers la goutte dès le toucher, et « Installez-vous » était coupé à gauche, à droite puis en bas. C'est corrigé. Du toucher à la première note, le cadre avance à peine puis ne bouge plus : « Installez-vous » et sa phrase restent entiers et immobiles. À la première note, l'application écrit « Inspirez », et alors seulement le cadre plonge vers la goutte. Pendant la plongée le mot ne sort plus de l'image : il reste lisible et descend se poser sous la goutte. Le film l'écrit comme l'application, dans la même police. Les durées et le son n'ont pas changé.
- **Le film horizontal n'a pas été touché**, parce qu'Antonio n'a demandé que le vertical. Il a le même défaut, en plus court : « Installez-vous » y passe en 2 dixièmes de seconde et sort par le bas. La même correction peut lui être appliquée si Antonio le veut.
- **La première version du film vertical reste disponible**, à sa propre adresse, pour comparer l'avant et l'après.
- **Les gestes.** Une seule amélioration est chiffrée, ci-dessous. Rien n'est dépensé.

""" + open('/home/claude/build/film/estimation-main.md', encoding='utf-8').read().rstrip('\n') + """

### Les 4 réponses d'Antonio
""")

# 3. Les adresses
rem("### Les 4 adresses\n", "### Les adresses\n")
rem("- Le film vertical, 1080 × 1920, pour l'iPhone et Instagram : https://parent-ecoute.ch/essai/film/et-vous-vertical.mp4\n",
    "- Le film vertical, 1080 × 1920, pour l'iPhone et Instagram, avec l'entrée de « Souffler » corrigée : https://parent-ecoute.ch/essai/film/et-vous-vertical.mp4?v=2 (la fin de l'adresse, `?v=2`, sert seulement à ce que le téléphone ne ressorte pas l'ancien fichier de sa mémoire)\n- La première version du film vertical, celle du 20 novembre à 4 heures, gardée pour comparer : https://parent-ecoute.ch/essai/film/et-vous-vertical-version-1.mp4\n")

# 4. Comment il est fait
rem("L'accueil, le doigt sur « Souffler 2 minutes » et la goutte animée sont une capture réelle de la version d'essai, image par image. Le logo et les polices sont ceux du site.",
    "L'accueil, le doigt sur « Souffler 2 minutes », « Installez-vous » et la goutte animée sont une capture réelle de la version d'essai, image par image. Le logo et les polices sont ceux du site. Au format vertical, « Inspirez » et « Expirez » sont écrits par le film, à l'endroit et dans la police où l'application les écrit.")
rem("Les polices Besley et Nunito sont sous licence libre (OFL).", "Les polices Besley, Newsreader et Nunito sont sous licence libre (OFL).")

# 5. Le film dans la version d'essai
rem("Ses commandes : lire, mettre en pause, reprendre, revoir, couper et remettre le son, régler le volume, fermer.",
    "Ses commandes : lire, mettre en pause, reprendre, revoir, activer et couper le son, régler le volume, fermer.")
rem("- **Le son.** Le film démarre avec son son, parce que c'est le parent qui vient de le lancer. Le bouton pour le couper est sous l'image.",
    "- **Le son.** Le film démarre toujours en silence. Sous l'image, un bouton clair écrit en toutes lettres, « Activer le son », le met. C'est le choix d'Antonio, le 20 novembre.")

# 6. Ce qui a été vérifié : la passe du matin
rem("""- **Ce qui n'a pas été testé.** Aucun vrai iPhone,""",
"""- **Le 20 novembre au matin, après les 3 demandes.** Le nouveau plan a été regardé image par image, puis le film vertical exporté a été regardé en entier sur planches : l'entrée de « Souffler » à 10 images par seconde, le reste à 1 image par seconde. Le mot écrit par le film a été comparé à l'écran réel de l'application : même largeur, même place, écart invisible. Dans l'atelier, avec Chrome : l'essai du film 97 vérifications et 0 échec (il vérifie maintenant le démarrage en silence, le bouton clair, le son activé puis coupé, le silence à chaque réouverture), la voix des textes (2752 textes, 0 à reprendre), premier geste 138, finition 110, les 3 offres 389, respiration 126, accueil 45, tous sans échec. Sur les 4 écrans du film (la commande, le lecteur muet, le lecteur avec le son, le lecteur en attente) : contrastes sans défaut, aucune zone à toucher sous 44 points, aucun débordement à 320 ni à 390 points de large, aucune règle d'accessibilité en défaut, effets conformes. """ + EN_LIGNE + """
- **Ce qui n'a pas été testé.** Aucun vrai iPhone,""")

# 7. Ce qu'Antonio doit encore dire
a = t[t.index("### Ce qu'Antonio doit encore dire pour le film\n"):t.index("## Le 19 novembre, le soir : la goutte")]
b = """### Ce qu'Antonio doit encore dire pour le film

1. **Le son.** Antonio l'écoute lui-même sur son iPhone, au casque puis sur le haut-parleur : le téléphone sur le bois, le verre reposé, la note qui rejoint l'étang, et le niveau général. Il dit ce qu'il faut reprendre.
2. **Le plan de la main et du verre.** Oui ou non pour l'essai gratuit, puis pour la dépense : environ 6 francs, plafond proposé 15 francs. Rien n'est lancé sans son accord.
3. **Le film horizontal.** Lui appliquer ou non la même correction de l'entrée dans « Souffler ».
4. **La publication.** Le film n'est que dans la version d'essai. Le publier sur Instagram ou sur le site habituel reste sa décision.

"""
t = t.replace(a, b)
open(p, 'w', encoding='utf-8').write(t)
print('document mis à jour :', len(t.splitlines()), 'lignes')

# 8. La liste des points ouverts et l'aide-mémoire, en bas du document
t = open(p, encoding='utf-8').read()
a = "9. Depuis la nuit du 20 novembre, pour le film « Et vous ? » : le son, que Claude n'a pas pu écouter, les gestes de la main qui ne sont pas filmés, et le démarrage du film avec le son. Le détail est en haut, dans « Ce qu'Antonio doit encore dire pour le film »."
b = "9. Pour le film « Et vous ? », depuis le 20 novembre au matin : le son, que vous écoutez vous-même sur votre iPhone, votre oui ou votre non pour le plan de la main et du verre (essai gratuit, puis environ 6 francs, plafond proposé 15 francs), et la même correction ou non pour le film horizontal. Le démarrage en silence et le zoom vertical sont faits. Le détail est en haut, dans « Ce qu'Antonio doit encore dire pour le film »."
assert t.count(a) == 1, t.count(a); t = t.replace(a, b)
a = "- 20 novembre, 2 h 46 puis 3 h 02, passe « le film » :"
b = ("- 20 novembre, 6 h 22, après les 3 demandes d'Antonio : envoi `386e48b` sur la branche `infomaniak`, envoi `e272b8d` sur `sources-essai`. Le film démarre en silence (`pparts/v2-f.js` : `v.muted=true` à chaque ouverture, bouton `#film-s` avec la classe `film-act` tant qu'il est muet). "
     "L'entrée du film vertical dans « Souffler » est dans `build/film/ecran.py` (`cadre_v`, `mot_y_v`, `calque_mot`) et `montage.py`. Le grand mot est rendu par `build/film/titres/mot.js`, et la capture sans ce mot par `build/film/capture_sans_mot.js` (dossier `app-sm/`). "
     "Un fichier `site-src/film/et-vous-…-version-N.mp4` est une version gardée pour comparer : `build_site.py` le publie, le lecteur ne le charge jamais. L'estimation du plan de la main est dans `build/film/estimation-main.md`. "
     "Pour ne balayer que les écrans du film : `build/film/lot-f3.sh` (`PEPE_SEUL=film PEPE_JUSQUA=film-lecteur-attente`, lus par `tests/walk.js`).\n"
     "- 20 novembre, 2 h 46 puis 3 h 02, passe « le film » :")
assert t.count(a) == 1, t.count(a); t = t.replace(a, b)
open(p, 'w', encoding='utf-8').write(t)
print('aide-mémoire mis à jour')
