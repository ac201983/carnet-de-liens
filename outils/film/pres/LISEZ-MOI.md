# Le film « Ce qu'on ne dit pas par SMS » (20 novembre 2026)

Le film de présentation de « Parent écouté, parent éclairé ». Il dure 1 minute 45 (105,0 secondes, 3150 images à 30 images par seconde), ne comporte aucune parole et se lit en entier sans le son. Il n'est publié que dans la version d'essai, à `https://parent-ecoute.ch/essai/film/`.

Le film de 35 secondes « Et vous ? » (version 3) reste en ligne, avec ses propres fichiers `et-vous-*` : c'est la capsule de respiration. Son atelier est le dossier parent (`build/film/`), et son mode d'emploi `build/film/LISEZ-MOI.md`.

| Fichier | Format | Pour |
|---|---|---|
| `ce-quon-ne-dit-pas-par-sms-vertical.mp4` | 1080 × 1920, 25,7 Mo | le lecteur de l'essai, sur un téléphone tenu droit |
| `ce-quon-ne-dit-pas-par-sms-horizontal.mp4` | 1920 × 1080, 22,7 Mo | le lecteur de l'essai, ailleurs |
| `ce-quon-ne-dit-pas-par-sms-instagram.mp4` | 1080 × 1920, 36,7 Mo | Instagram. Il n'est pas dans le lecteur : il a seulement son adresse, pour être téléchargé |
| `affiche-film-verticale.webp`, `affiche-film-horizontale.webp` | 720 × 1280, 1280 × 720 | l'image du lecteur avant la lecture (le premier SMS, envoyé) |
| `apercu-film.webp` | 336 × 189 | la vignette de la commande « Voir le film · 1 minute 45 » sur l'accueil |

## Ce que le film contient

Deux tables de cuisine. À la première, un père et sa fille adolescente, qui porte un appareil auditif turquoise. À la seconde, une mère et son fils adulte, Bastien, qui utilise un fauteuil roulant manuel. Les 3 photos illustrent une fiction (c'est écrit sur le dernier carton). Tout ce qui montre le produit est capturé dans la version d'essai, avec des données fictives.

| Temps | Plans | Ce qu'on voit | D'où vient l'image |
|---|---|---|---|
| 0 à 8,8 s | `a1` à `a4` | 21 h 40. Élise écrit « Comment va ta fille ? ». Le père répond « Elle va bien, merci. », un battement, il envoie. Le téléphone est retourné. Un cercle naît dans le verre | `a1`, `a3`, `a4` : les plans `s1`, `s3`, `s4` de la capsule, repris tels quels. `a2` : fil de messages composé ici (`fil.html`), aucun logiciel imité |
| 8,8 à 17,8 s | `a5` | Le cercle continue sur l'étang. « Et vous ? » seul (9,8 à 13,7 s), puis « Pour les parents d'enfants, d'ados et d'adultes en situation de handicap » (13,8 à 17,65 s) | L'étang de la capsule (`raccord.py`), textes aux polices du site |
| 17,8 à 33,8 s | `b1` à `b4` | L'accueil, la ligne « Déposer ce qui pèse ». Le père écrit « On s'est encore disputés pour la tablette. Ça me manque de jouer avec elle. » On lit « Votre texte reste sur cet appareil » et « une question écrite à l'avance ». Les 2 boutons, il touche « J'aimerais le dire à quelqu'un ». La phrase de départ, qu'il peut changer | Captures réelles : `cap/accueil-d`, `cap/depot` (une image par caractère tapé), `cap/dire` |
| 33,8 à 46,5 s | `c1` à `c4` | « Le lendemain ». « Des pistes pour les jours difficiles », 23 situations, il touche « Les écrans ». La fiche, 2 idées surlignées. Le minuteur visuel, 5 minutes en accéléré | Captures réelles : `cap/pistes`, `cap/fiche`, `cap/minuteur` |
| 46,5 à 51,5 s | `c5` | La photo des dominos : entière sur le vert du film, puis un cadre décalé vers l'adolescente (son oreille appareillée et la main qui joue), puis le cadre plonge vers un point du domino | `src/01-les-dominos.png` |
| 51,5 à 57,7 s | `d` | Le point du domino devient la goutte de « Souffler 2 minutes », qui redescend le temps d'une expiration | Capture réelle de l'exercice (celle de la capsule, `../app-ig`) |
| 57,7 à 73,7 s | `e1`, `e2` | Bastien et sa mère préparent la fiche (les 2 visages et la grande roue ensemble, puis le crayon et les regards). « Le relais de Bastien » tel que Rémi le lit : « Si tu ne lis que trois choses », puis « Ce que je souhaite dire moi-même » et la phrase « J'aime prendre mon café seul, le matin. », surlignée | `src/02-la-fiche-ensemble.png`, capture réelle de la fiche d'exemple (`cap/relais`) |
| 73,7 à 76,7 s | `e3` | Dimanche matin, chez Rémi. Bastien boit son café près de la fenêtre (la tasse, son visage, la roue) | `src/03-le-cafe-de-bastien.png` |
| 76,7 à 93,2 s | `f1` à `f5` | « Quelques semaines plus tard ». L'étape 7 du parcours, « Me calmer, puis lâcher prise » : la vague, « Poser les mains à plat », « Garder ce geste dans mon carnet », le carnet. Puis la main à plat sur la table, « 24 étapes sur 6 mois, à votre rythme » et « Conçu par Antonio Company, éducateur social » | Captures réelles : `cap/vague`, `cap/geste`, `cap/carnet`. `f5` : image 1 de la planche de la capsule |
| 93,2 à 105 s | `g1`, `g2` | Le père écrit lui-même à Élise : « Tu as cinq minutes ce soir ? J'aimerais te raconter ma journée. » Le message reste. Le logo, « Parent écouté, parent éclairé », « Ici, on commence par vous. », parent-ecoute.ch | Le même fil de messages, logo et polices du site |

Les 3 formats ont les mêmes plans et les mêmes durées : le son est le même. Le vertical et l'horizontal sont composés séparément (`cles(V, I, H)` dans `plans.py`). Dans l'export pour Instagram, tout ce qui doit se lire tient entre les hauteurs 269 et 1248 et entre les largeurs 65 et 1015 de l'image, et hors du coin en bas à droite (à droite de 853 sous la hauteur 1152), à distance des commandes d'Instagram.

## Ce qui est vrai, ce qui est monté

- Les écrans sont ceux de la version d'essai, filmés image par image avec une horloge tenue à la main (`../../goutte/horloge.js`) et une date fixe. Aucun texte d'écran n'est retouché. Le film ajoute seulement le cadrage, un surlignage (2 idées de la fiche « Les écrans », la phrase de Bastien), le doigt et l'onde des changements d'écran.
- Le minuteur visuel est le vrai outil. Ses 5 minutes sont filmées en accéléré, en 2,8 secondes.
- Dans l'étape 7, le film montre un seul « Voir la suite » de la vague.
- L'accueil du site dit « 23 situations de la vraie vie ».
- Le doigt est un rond : clair sur les écrans sombres (celui du film de 35 secondes), vert sombre sur les écrans clairs (`plans.doigt`).
- Quand le cadre voyage vite, le flou de mouvement prend un instant tous les 4,5 points de déplacement, 24 au plus (`plans.filme`). Avec 4 instants seulement, on voyait 4 copies du texte.
- Les légendes ajoutées par le film : « Le lendemain », « Quelques semaines plus tard », « Bastien prépare son week-end chez son oncle Rémi. », « Souffler 2 minutes », « Les photos illustrent une fiction. »

## Le son

Tout est calculé (`mixage.py`, à partir de `../son.py`) : aucun enregistrement, aucun média extérieur. Le film démarre toujours sans le son dans le lecteur.

- Rien autour des 2 SMS : ni touches ni vibreur.
- Le téléphone posé sur le bois, le verre et sa note, l'eau de l'étang, la note de « Et vous ? » (repris de la capsule).
- Le domino touche le bois (46,8 s). La mélodie de 4 notes accompagne la goutte (51,55, 53,05, 54,55 et 56,05 s). La tasse se pose (76,15 s). L'accord final (101,32 s).

`python3 mesure_son.py <film.mp4>` mesure dans un export où chaque son commence réellement.

## Les droits

- Les 3 photos (`src/`) sont fournies par Antonio pour ce film.
- L'interface, la goutte, le logo, les polices (Besley, Newsreader et Nunito, licence OFL) viennent du projet. Le fil de messages est un dessin original.
- Tous les sons sont calculés ici. Aucun média extérieur, aucune génération payante. Budget extérieur : 0 CHF.
- L'agrandissement des photos utilise Real-ESRGAN (modèle `realesrgan-x4plus`, licence BSD 3 clauses), comme un outil.

## Refaire le film

Dans l'atelier, ces fichiers sont dans `build/film/pres/`. Les images lourdes (agrandissements, captures, plans encodés) ne sont pas rangées dans le dépôt : elles se refont. La version d'essai doit être servie en local sur le port 8446.

1. Les photos : `python3 ../sr/agrandir.py src/01-les-dominos.png ../plates/photo1x4.png` (de même pour les 2 autres).
2. Les captures : `node cap_depot.js`, `node cap_ecrans.js`, `node cap_relais.js`, `node cap_etape7.js` (outils communs dans `lib.js`).
3. Le fil de messages : `node fil.js 1 cap/fil1 114 693` et `node fil.js 2 cap/fil2 255 773`.
4. Les textes : `node titres.js` (ou `node titres.js <nom> <format>` pour un seul).
5. Régler un cadre : `python3 planche.py <V|H|I> sortie.jpg plan:image …`.
6. Les plans : `python3 montage.py <V|H|I> tout` (ou une liste de plans), puis `python3 montage.py <V|H|I> joint`. Sur 2 cœurs, pas plus de 2 rendus à la fois.
7. Le son : `python3 mixage.py`.
8. Les exports : `python3 exporte.py V`, `H`, `I`, puis `python3 exporte.py affiches <dossier>`. Réglages : crf 24 pour les 2 films du site, 22 pour Instagram.
9. Relire ce qui est réellement encodé : `python3 revue.py …`. Regarder le lecteur dans l'essai : `node vues.js`.

Mémoire : un rendu occupe jusqu'à 2,9 Go. Sur une machine de 8 Go, 2 rendus à la fois et rien d'autre qui charge les photos agrandies.

Les réglages du lecteur (2 films, 2 adresses) sont dans `pparts/v2-f.js` (`FILMS`, `filmOuvre`, `filmEspace`). L'essai qui les vérifie est `tests/film.js`, la suite de la passe `../lot-f5.sh`.
