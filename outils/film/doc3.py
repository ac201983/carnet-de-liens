# Met à jour le document de la version d'essai (build/essai/version-essai.md) pour la version 3 du film (demande d'Antonio du 20 novembre à 8 h 07).
# python3 build/film/doc3.py "<phrase sur les essais dans l'atelier>" "<phrase sur les vérifications en ligne>"
import sys
p = '/home/claude/build/essai/version-essai.md'; t = open(p, encoding='utf-8').read()
ATELIER = sys.argv[1] if len(sys.argv) > 1 else ''
EN_LIGNE = sys.argv[2] if len(sys.argv) > 2 else ''
def rem(a, b, n=1):
    global t
    assert t.count(a) == n, (t.count(a), a[:90]); t = t.replace(a, b)
def bloc(debut, fin, nouveau):
    """Remplace tout ce qui va du titre « debut » jusqu'au titre « fin » (non compris)."""
    global t
    i = t.index(debut); j = t.index(fin, i + len(debut)); t = t[:i] + nouveau + t[j:]

# 1. Où on en est
i = t.index("**Où on en est le 20 novembre 2026, au matin** :"); j = t.index("\n", i)
t = t[:i] + ("**Où on en est le 20 novembre 2026, en fin de matinée** : la version d'essai contient la version 3 du film « Et vous ? », 35 secondes, sans paroles, qui se suit en entier sans le son. "
    "Le lecteur de l'essai a 2 formats, vertical sur un téléphone tenu droit et horizontal ailleurs, et un export vertical à part est prêt pour Instagram. "
    "Après « Et vous ? », le film ne montre plus l'accueil entier : le cadre est d'emblée sur « Souffler 2 minutes », un seul appui ouvre l'étang, puis « Installez-vous » et sa phrase restent près de 3 secondes dans un cadre immobile. "
    "Après le point final du SMS, le curseur clignote seul un instant. « Et vous ? » reste 3 secondes entièrement lisible. La respiration est entière, et la goutte reste posée une demi-seconde avant le retour au verre. "
    "À la fin du film, un vrai bouton « Souffler 2 minutes » apparaît sous la vidéo : il ouvre l'exercice à son écran de départ, et le retour ramène à l'accueil. "
    "Le film démarre toujours en silence, avec « Activer le son » bien visible. Le son est mesuré, il n'a pas été écouté : Antonio le juge lui-même sur son iPhone. "
    "Les versions 1 et 2 restent à leur propre adresse, pour comparer. Aucune dépense extérieure. "
    "L'icône de l'écran d'accueil du téléphone est la goutte du logo. Le reste est celui du 19 novembre au soir : le logo officiel partout, plus aucun âge écrit, la goutte suspendue au centre de « Souffler » avec son bouton « Pause », les 5 mouvements calmes et le minuteur visuel. Le site habituel n'a pas changé.") + t[j:]

# 2. La version 3, en tête de la section du film
rem("""### Le 20 novembre à 5 heures : les 3 demandes d'Antonio
""", """### Le 20 novembre à 8 heures : la version 3

À 8 h 07, Antonio a demandé de finaliser la version 3, dans la version d'essai seulement, à partir de la version 2 verticale et de la proposition horizontale corrigée, sans dépense extérieure. Son intention : un parent ouvre le site à 21 h 40, le téléphone en main, près de quelqu'un qui dort. En 35 secondes, il doit pouvoir se dire « C'est exactement la question qu'on oublie de me poser », puis prendre une première respiration avec la goutte. Le film doit fonctionner en entier sans le son.

- **Le SMS.** « Comment va ta fille ? » et « Elle va bien, merci. » sont gardés. Dans la version 2, le pouce venait au-dessus du bouton dès le point final. Dans la version 3, après le point, plus rien ne bouge que le curseur : il reste allumé une demi-seconde, s'éteint, se rallume. Le pouce ne revient qu'ensuite, et envoie. Le curseur est seul pendant 1,1 seconde. Rien n'est écrit puis effacé : ce que le parent aurait pu dire de lui-même reste à imaginer. La main immobile près du verre est gardée telle quelle, et le plan de la main chiffré le matin n'est pas fait.
- **Du verre à l'étang.** La coupe est la même que dans la version 2 : le cercle a le même centre, la même taille et la même vitesse à l'écran des 2 côtés de la coupe, et les reflets dorés de la cuisine restent sur l'eau verte. C'est revérifié en superposant les 2 images de la coupe. « Et vous ? » apparaît à 10,6 secondes et reste seul jusqu'à 14,5 secondes : il est entièrement lisible pendant 3 secondes, contre 1,6 dans la version 2.
- **Le passage de la 15e seconde.** La version 2 montrait l'accueil entier juste après « Et vous ? », et le regard devait choisir entre le titre, SOS et les 3 entrées. Le choix de la version 3 : à 14,6 secondes l'étang se fond dans le téléphone, et le cadre est d'emblée sur la ligne « Souffler 2 minutes », au milieu de l'image. Au-dessus, la barre du site, avec la goutte du logo et « Parent écouté, parent éclairé », suffit à reconnaître le site. SOS est hors du cadre. Plus bas, l'entrée suivante part dans le flou et dans l'ombre. Plus haut, on voit le bord du téléphone et la cuisine. C'est la vraie page de l'accueil, défilée jusqu'à cette ligne. Un seul appui, discret, à 16,4 secondes. L'onde part du doigt et ouvre l'étang.
- **« Installez-vous ».** Le temps gagné sert à le lire. Entre l'appui et la première note il y a 3,8 secondes, contre 1 seconde dans la version 2. Le cadre vient se poser en 1 seconde, sans jamais croiser la pastille SOS, puis ne bouge plus du tout de 17,4 à 20,2 secondes : « Installez-vous » et « Posez vos épaules et vos pieds. La goutte va vous guider. » se lisent en entier.
- **La respiration.** Un cycle complet : « Inspirez » à 20,2 secondes, 4 secondes de montée, « Expirez » à 24,2 secondes, 6 secondes de descente. La goutte occupe le haut de l'image et son mouvement se suit sans lire les mots. Elle ne bouge plus à partir de 30 secondes, et le film reste encore une demi-seconde sur elle avant de revenir au verre, à 30,5 secondes, puis à « Ici, on commence par vous. »
- **Le son.** Les notes, leurs forces et leur répartition sont celles de l'exercice : 3 notes montent pendant l'inspiration, 4 redescendent pendant l'expiration. La première note qui redescend commence à 24,200 secondes, à l'instant où la goutte est au sommet. L'eau suit la goutte comme dans l'exercice : sombre et basse quand la goutte est posée, plus claire et plus présente au sommet. Ces instants sont mesurés dans les 3 fichiers exportés. Le son n'a pas été écouté. Le film démarre en silence à chaque ouverture.
- **La fin, sur le site.** Le carton reste sobre : le logo officiel, le nom, l'adresse. Quand le film est fini, un vrai bouton « Souffler 2 minutes » apparaît sous la vidéo. Il ferme le lecteur et ouvre l'exercice existant à son écran de départ, « Installez-vous », en silence, par le même chemin que la porte de l'accueil. Le bouton Retour du téléphone et le « Retour » de l'exercice ramènent à l'accueil, à l'endroit où le parent l'avait laissé.
- **La fin, pour Instagram.** Un export vertical à part. Son dernier carton dure 4 secondes et porte le logo, le nom, la phrase « Pour les parents d'une personne en situation de handicap. » et parent-ecoute.ch. La phrase dit « une personne » : une mère dont la fille a 38 ans s'y reconnaît comme un père dont le fils en a 8.
- **Le cadrage de chaque format.** Vertical : l'écran du téléphone remplit l'image pour le SMS et pour « Installez-vous ». Horizontal : le téléphone est de face devant la cuisine floue, cadré plus serré qu'avant sur les 2 messages et la ligne où l'on écrit, puis de la goutte à la phrase pour « Installez-vous ». Instagram : le SMS est remonté, et « Installez-vous », la goutte, les mots et le dernier carton tiennent dans la partie de l'image qu'Instagram laisse libre, loin de ses commandes. Pendant la respiration, l'export Instagram montre l'étang sans les boutons de l'application.
- **Ce qui est gardé pour comparer.** Les versions 1 et 2 du film vertical et du film horizontal ont chacune leur adresse. Le lecteur ne les charge jamais.
- **Aucune dépense.** Aucun média extérieur, aucune génération payante.

### Le 20 novembre à 5 heures : les 3 demandes d'Antonio
""")

# 3. L'estimation : elle n'a pas été retenue pour la version 3
rem("""Rien n'est dépensé et rien n'est lancé. Cette estimation attend l'accord d'Antonio.
""", """Rien n'est dépensé et rien n'est lancé. À 8 h 07, Antonio a écrit que la main immobile près du verre suffit, et il a fixé le budget extérieur de la version 3 à 0 franc : ce plan n'est donc pas fait. L'estimation reste ici pour mémoire.
""")

# 4. Les adresses
bloc("### Les adresses\n", "### Ce que raconte le film\n", """### Les adresses

- L'accueil d'essai, avec la commande et le lecteur : https://parent-ecoute.ch/essai/#accueil. La commande « Voir le film · 35 secondes » est juste après les 3 portes. L'adresse https://parent-ecoute.ch/essai/#film ouvre directement le lecteur, qui attend alors qu'on touche « Lire le film ».
- Le film vertical, version 3, 1080 × 1920 : https://parent-ecoute.ch/essai/film/et-vous-vertical.mp4?v=3 (la fin de l'adresse, `?v=3`, sert seulement à ce que le téléphone ne ressorte pas l'ancien fichier de sa mémoire)
- Le film horizontal, version 3, 1920 × 1080 : https://parent-ecoute.ch/essai/film/et-vous-horizontal.mp4?v=3
- L'export vertical pour Instagram, 1080 × 1920, 36,8 secondes, à télécharger : https://parent-ecoute.ch/essai/film/et-vous-instagram.mp4
- Les versions gardées pour comparer. Vertical, version 2 : https://parent-ecoute.ch/essai/film/et-vous-vertical-version-2.mp4. Vertical, version 1 : https://parent-ecoute.ch/essai/film/et-vous-vertical-version-1.mp4. Horizontal, version 2 (la proposition corrigée) : https://parent-ecoute.ch/essai/film/et-vous-horizontal-version-2.mp4. Horizontal, version 1 : https://parent-ecoute.ch/essai/film/et-vous-horizontal-version-1.mp4.
- L'extrait de 5 secondes du raccord entre le verre et l'étang, celui de la version 2 : https://parent-ecoute.ch/essai/film/et-vous-raccord-5s.mp4

""")

# 5. Ce que raconte le film
bloc("### Ce que raconte le film\n", "L'âge de la fille n'est dit nulle part.", """### Ce que raconte le film

| Temps | Ce qu'on voit | Ce qu'on entend, si le son est activé |
|---|---|---|
| 0 à 0,9 s | Dans la cuisine, le soir, le téléphone s'éclaire près du verre. Il est 21 h 40. | La maison, puis le téléphone qui vibre |
| 0,9 à 5,5 s | « Comment va ta fille ? » La réponse s'écrit : « Elle va bien, merci. » Après le point, le curseur clignote seul. Puis le pouce vient et envoie. | Les touches, puis rien, puis l'envoi |
| 5,5 à 6,7 s | Le téléphone est retourné sur la table. La main est près du verre. | Le téléphone sur le bois, puis le silence de la maison |
| 6,7 à 9,6 s | Vu de dessus, un cercle naît à la surface du verre. Le cadre se resserre. | Le verre reposé, et sa note qui reste |
| 9,6 à 14,6 s | Le même cercle continue sur un étang. 2 mots apparaissent et restent seuls : « Et vous ? » | La note du verre devient la première note de piano, puis l'eau |
| 14,6 à 16,4 s | L'étang se fond dans le téléphone. On ne voit que la ligne « Souffler 2 minutes », sous le logo et le nom du site. Un doigt s'y pose. | La maison, le toucher |
| 16,4 à 20,2 s | L'onde part du doigt et ouvre l'étang. « Installez-vous. Posez vos épaules et vos pieds. La goutte va vous guider. » Le cadre ne bouge plus. | L'eau, basse |
| 20,2 à 30,5 s | « Inspirez » : la goutte monte pendant 4 secondes. « Expirez » : elle redescend pendant 6 secondes, puis reste posée. | 3 notes qui montent, 4 notes qui redescendent, l'eau qui s'éclaircit puis s'assombrit |
| 30,5 à 32,8 s | La table, la même lumière. La main repose près du verre. « Ici, on commence par vous. » | La maison |
| 32,8 à 35 s | Le logo, « Parent écouté, parent éclairé », parent-ecoute.ch. Dans le lecteur, le bouton « Souffler 2 minutes » apparaît ensuite sous la vidéo. | Un accord de piano |

""")

# 6. Comment il est fait
rem("L'accueil, le doigt sur « Souffler 2 minutes », « Installez-vous » et la goutte animée sont une capture réelle de la version d'essai, image par image.",
    "La ligne « Souffler 2 minutes » de l'accueil, « Installez-vous » et la goutte animée sont une capture réelle de la version d'essai, image par image. Autour de la ligne, le film retient la lumière de la barre du site et laisse la suite de la page dans le flou : c'est un choix d'image, la page elle-même n'est pas changée.")
rem("Au format vertical, « Inspirez » et « Expirez » sont écrits par le film, à l'endroit et dans la police où l'application les écrit.",
    "« Inspirez » et « Expirez » sont écrits par le film, dans la police de l'application : sous la goutte aux formats verticaux, en haut de l'image au format horizontal.")
rem("Il n'y a ni voix ni enregistrement. Le niveau est doux : −18 LUFS.",
    "Il n'y a ni voix ni enregistrement. Le niveau est doux. Dans « Souffler », les notes sont celles de l'exercice et l'eau suit la goutte.")

# 7. Le film dans la version d'essai
rem("Chaque film pèse 16 Mo.", "Chaque film pèse 16 Mo. L'export pour Instagram et les versions gardées ne sont jamais chargés par le lecteur.")
rem("- **Fermer.** « Fermer », la touche Échap ou le bouton Retour du téléphone arrêtent le son tout de suite. Le parent retrouve l'accueil à l'endroit exact où il était.\n",
    "- **La fin.** Quand le film est fini, un vrai bouton « Souffler 2 minutes » apparaît sous la vidéo, qui lui fait de la place. Il ouvre l'exercice à son écran de départ, en silence. Le retour ramène à l'accueil. « Revoir le film » retire ce bouton le temps du film. La fin du film et ce bouton sont annoncés aux personnes qui utilisent un lecteur d'écran.\n"
    "- **Fermer.** « Fermer », la touche Échap ou le bouton Retour du téléphone arrêtent le son tout de suite. Le parent retrouve l'accueil à l'endroit exact où il était.\n")

# 8. Ce qui a été vérifié
rem("- **Ce qui n'a pas été testé.** Aucun vrai iPhone, et pas Safari lui-même : WebKit sur une machine Linux n'est pas Safari sur un iPhone. Le son n'a pas été écouté. La publication sur Instagram n'a pas été essayée.",
    "- **Le 20 novembre, pour la version 3.** *Vu*, sur des planches d'images tirées des 3 fichiers exportés, à la taille où un téléphone les montre (306 × 544 points par image) et sans le son : le SMS toutes les 0,2 seconde, le verre et l'étang toutes les 0,4 seconde, le passage de 14,2 à 20,6 secondes toutes les 0,2 seconde, la respiration et la fin toutes les 0,5 seconde. Vu aussi, les 2 images de la coupe superposées, et l'export Instagram avec la zone qu'Instagram laisse libre dessinée par-dessus. *Vu dans le vrai lecteur*, à la taille d'un téléphone (390 × 664 points), dans le Chromium 153 de l'atelier : le SMS, « Souffler 2 minutes », « Installez-vous », la goutte, puis la fin avec son bouton, l'exercice ouvert par ce bouton et l'accueil retrouvé par le retour. *Mesuré* dans les fichiers exportés : chaque note de « Souffler » commence à moins de 10 millièmes de seconde de l'instant prévu, la première note qui redescend à 24,200 secondes ; la goutte est au plus haut entre 24,2 et 24,3 secondes et ne bouge plus à partir de 30 secondes ; le niveau et la clarté de l'eau sont au plus haut au sommet de la goutte. *Écouté* : rien. " + ATELIER + " " + EN_LIGNE + "\n"
    "- **Ce qui n'a pas été testé.** Aucun vrai iPhone, et pas Safari lui-même : WebKit sur une machine Linux n'est pas Safari sur un iPhone. Le son n'a pas été écouté. La publication sur Instagram n'a pas été essayée, et la place exacte de ses commandes peut varier d'un téléphone à l'autre.")

# 9. Ce qu'Antonio doit encore dire
bloc("### Ce qu'Antonio doit encore dire pour le film\n", "## Le 19 novembre, le soir : la goutte", """### Ce qu'Antonio doit encore dire pour le film

1. **Le son.** Antonio l'écoute lui-même sur son iPhone, au casque puis sur le haut-parleur. En fermant les yeux pendant « Souffler », il dit s'il sent le début de l'expiration dans la mélodie, à 24 secondes. Si ce n'est pas assez net, c'est la première chose à reprendre.
2. **Le passage de la 15e seconde.** Le choix du cadre sur « Souffler 2 minutes » lui convient-il, et « Installez-vous » se lit-il à son rythme ?
3. **La publication.** Le film n'est que dans la version d'essai. Le publier sur Instagram ou sur le site habituel reste sa décision.

""")
open(p, 'w', encoding='utf-8').write(t); print('document mis à jour :', len(t), 'caractères')
