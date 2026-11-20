# Le film « Et vous ? » (version 3, 20 novembre 2026)

Un film de 35 secondes pour « Parent écouté, parent éclairé ». Il n'est publié que dans la version d'essai, à `https://parent-ecoute.ch/essai/film/`. Il se lit en entier sans le son.

Trois fichiers :

| Fichier | Format | Pour |
|---|---|---|
| `et-vous-vertical.mp4` | 1080 × 1920, 35 s | le lecteur de l'essai, sur un téléphone tenu droit |
| `et-vous-horizontal.mp4` | 1920 × 1080, 35 s | le lecteur de l'essai, ailleurs |
| `et-vous-instagram.mp4` | 1080 × 1920, 36,8 s | Instagram. Il n'est pas dans le lecteur : il a seulement son adresse, pour être téléchargé |

## Ce que le film contient (version 3)

| Temps | Plan | D'où vient l'image |
|---|---|---|
| 0 à 0,9 s | `s1` Le téléphone s'éclaire près du verre | Image 1 de la planche d'Antonio, écran verrouillé composé ici |
| 0,9 à 5,5 s | `s2` « Comment va ta fille ? », « Elle va bien, merci. » Après le point final, le curseur clignote seul pendant 1,1 s, puis le pouce vient et envoie | Fil de messages composé ici (`ecrans/`), aucun logiciel imité |
| 5,5 à 6,7 s | `s3` Le téléphone est retourné, la main près du verre | Image 2 de la planche |
| 6,7 à 9,6 s | `s4` Le cercle naît dans le verre, le cadre se resserre | Image 3 de la planche, cercles séparés puis remis en mouvement (`ondes.py`) |
| 9,6 à 14,6 s | `s5` Le même cercle continue sur l'étang. « Et vous ? » est seul à l'image de 10,6 à 14,5 s (entièrement lisible pendant 3 secondes) | Image 4 de la planche |
| 14,6 à 16,4 s | `s6` L'étang se fond dans le téléphone. Le cadre est d'emblée sur « Souffler 2 minutes », sous le logo et le nom du site. Un seul appui, à 16,4 s | Capture réelle de l'accueil de la version d'essai (`accueil/`) |
| 16,4 à 20,2 s | `s7` L'onde ouvre l'étang, le cadre vient se poser. « Installez-vous » et sa phrase restent dans un cadre qui ne bouge plus de 17,4 à 20,2 s | Capture réelle de « Souffler », image par image (`app/`) |
| 20,2 à 30,5 s | `s7` La goutte : une inspiration de 4 s (« Inspirez » à 20,2 s), une expiration de 6 s (« Expirez » à 24,2 s). La goutte est revenue à 30 s, on la laisse posée | La même capture |
| 30,5 à 32,8 s | `s8` La main près du verre, « Ici, on commence par vous. » | Image 2 de la planche |
| 32,8 à 35 s | `s9` Le logo, « Parent écouté, parent éclairé », parent-ecoute.ch | Logo et polices du site |

L'export pour Instagram a les mêmes plans jusqu'à 32,8 s. Son dernier carton dure 4 secondes et porte une phrase de plus : « Pour les parents d'une personne en situation de handicap. »

Les gestes de la main ne sont pas filmés. Chaque coupe arrive sur le résultat du geste, et le son le raconte.

## Ce que la version 3 change (demande d'Antonio du 20 novembre, 8 h 07)

1. **Le SMS.** Après « merci. », plus rien ne bouge que le curseur : allumé une demi-seconde, éteint une demi-seconde, rallumé. Le pouce ne revient qu'ensuite, pour envoyer (`ecrans/ecrans.html`, `BATTEMENT`, `CLIGNE`).
2. **Le verre et l'étang.** La coupe est la même (mêmes cercles, même centre, même vitesse à l'écran : `raccord.py`). « Et vous ? » reste 3 secondes entièrement lisible, au lieu de 1,6.
3. **Le passage de la 15e seconde.** La version 2 montrait l'accueil entier : le regard devait choisir entre le titre, SOS et les 3 entrées. La version 3 ne montre que la ligne « Souffler 2 minutes », au milieu de l'image. Au-dessus, la barre du site (la goutte du logo, « Parent écouté, parent éclairé ») suffit à reconnaître le site, un peu retenue. SOS est hors du cadre, et le cadre ne le croise jamais ensuite (`ecran.cadre_s7` : le cadre descend d'abord, puis glisse vers la droite). Plus bas, l'entrée suivante part dans le flou et dans l'ombre (`ecran.accueil_net`). L'accueil est filmé défilé de 425 points (`capture_accueil.js`) : c'est la vraie page, telle qu'un parent peut l'avoir sous les yeux.
4. **« Installez-vous ».** Le temps gagné sert à le lire : entre l'appui et la première note il y a 3,8 secondes (0,97 dans la version 2), dont 2,8 dans un cadre immobile. L'écran de l'application ne bouge pas non plus à ce moment-là : c'est une seule image, vérifiée sur la capture.
5. **La respiration.** Un cycle entier, puis 0,5 seconde de repos une fois la goutte revenue, avant le retour au verre. « Expirez » commence à s'écrire à l'instant où la goutte redescend.
6. **Le son.** Mêmes notes, mêmes forces et même répartition que dans l'exercice (`mixage.py`). La première note qui redescend tombe au sommet de la goutte. L'eau de « Souffler » suit la goutte : sombre et basse quand elle est posée, plus claire et plus présente au sommet (les réglages `RS_SOMBRE`, `RS_CLAIR`, `RS_EAU_BAS` de l'exercice). `mesure_son.py` et `mesure_image.py` mesurent ces instants dans les fichiers exportés. Personne n'a écouté ce son ici : il est mesuré.
7. **La fin.** Sur le site, le carton reste sobre. Dans le lecteur, un vrai bouton « Souffler 2 minutes » apparaît sous la vidéo quand le film est fini (`pparts/v2-f.js`, `filmSouffle`). Il ouvre l'exercice comme la porte de l'accueil, et le retour ramène à l'accueil.
8. **Instagram.** Un export à part (`I`). Le SMS, « Installez-vous », la goutte, les mots et le dernier carton tiennent entre les hauteurs 269 et 1248 et entre les largeurs 65 et 1015 de l'image (`film.INSTA`), à distance des commandes d'Instagram. Pendant la respiration, l'écran de l'application y est montré sans ses boutons (`app-ig/`) : le cadre reste plus large que dans le film du site, et on ne voit que l'étang.

Le plan `s6a` (le retour à la table avant l'accueil) n'existe plus. Budget extérieur de cette version : 0 CHF.

## Les droits

- Les 4 images de base sont celles de la planche « Écho d'eau entre verre et étang », fournie par Antonio.
- L'interface, la goutte, le logo, les polices (Besley, Newsreader et Nunito, licence OFL), les notes de piano et l'eau viennent du projet.
- Tous les autres sons sont calculés ici (`son.py`) : le vibreur, les touches, le téléphone sur le bois, le verre, la cuisine.
- Aucun média extérieur, aucune génération payante.
- L'agrandissement des images utilise Real-ESRGAN (modèle `realesrgan-x4plus`, licence BSD 3 clauses), comme un outil. Le modèle n'est pas rangé ici : il se télécharge depuis les versions publiées du projet Real-ESRGAN.

## Refaire le film

Dans l'atelier, ces fichiers sont dans `build/film/`. Les images lourdes (agrandissements, captures) ne sont pas rangées dans le dépôt : elles se refont.

1. `python3 sr/agrandir.py src/p1.png plates/p1x4.png` (et de même pour p2, p3, p4, puis la photo de la goutte du site vers `plates/hero-film.jpg`).
2. `node ecrans/ecrans.js verrou ecrans 3` et `node ecrans/ecrans.js fil ecrans/fil 5` : l'écran verrouillé et le fil de messages (138 images).
3. Les captures de la version d'essai, image par image, avec la version d'essai servie en local sur le port 8446 :
   - `node capture_accueil.js` → `accueil/` : l'accueil défilé jusqu'à « Souffler 2 minutes » ;
   - `node capture_app.js 8446 /essai/ app 5` → `app/` : « Souffler » tel qu'il est ;
   - `node capture_sans_mot.js 8446 /essai/ app-sm 5` → `app-sm/` : le grand mot caché (le film vertical l'écrit lui-même à partir de la première note) ;
   - `node capture_sans_mot.js 8446 /essai/ app-ig 5 14.5 36 "#souffle-mot,#souffle-aide,.souffle .bar,.souffle .tours,.souffle .souffle-a,.souffle .resp-l"` → `app-ig/` : l'étang seul, pour Instagram.
   Les 3 dernières sont identiques image pour image hors de ce qui est caché (vérifié).
4. `node titres/titres.js` : les textes et les cartons (`titres.json` donne la place de chaque texte). `node titres/mot.js` : « Inspirez » et « Expirez » écrits comme l'application les écrit.
5. `python3 montage.py V tout`, `python3 montage.py H tout`, `python3 montage.py I tout` (I ne refait que `s2`, `s7` et `s9`, et prend les autres plans chez V), puis `python3 montage.py V joint`, et de même pour H et I. Ne pas lancer d'essais dans Chrome pendant 2 rendus : la mémoire ne suffit pas.
6. `python3 mixage.py V` et `python3 mixage.py I` : le son (`tmp/film.wav`, `tmp/film-I.wav`), avec une image du son.
7. `python3 -c "import film; film.export('out/V/image.mp4', 'tmp/film.wav', 'out/v3/et-vous-vertical.mp4', 21, '8M')"`, de même pour H (même son) et pour I (`tmp/film-I.wav`, `et-vous-instagram.mp4`).
8. `python3 affiches.py out/v3 <dossier>` : les 2 affiches du lecteur et l'image d'aperçu, tirées des films exportés.
9. L'extrait de 5 secondes du raccord (`et-vous-raccord-5s.mp4`, `extrait.py`, `rendre_extrait.py`) est celui de la version 2 : le raccord lui-même n'a pas changé, il n'a pas été refait.
10. Pour contrôler : `python3 planche_v.py V sortie.jpg s7:0 s7:40 …` (images du montage), `python3 mesure_son.py out/v3/et-vous-vertical.mp4` (le début de chaque note), `python3 mesure_image.py out/v3/et-vous-vertical.mp4 V` (le mouvement de la goutte), `node vues.js 8446` (le vrai lecteur, à la taille d'un téléphone).

## Les versions gardées pour comparer

Dans `site-src/film/`, publiées à leur propre adresse, jamais chargées par le lecteur :

- `et-vous-vertical-version-1.mp4` : le premier film vertical (20 novembre, 4 h) ;
- `et-vous-vertical-version-2.mp4` : la version 2 verticale (20 novembre, 7 h), avec « Installez-vous » lisible en entier ;
- `et-vous-horizontal-version-1.mp4` : le premier film horizontal ;
- `et-vous-horizontal-version-2.mp4` : la proposition horizontale corrigée de la même manière.

Dans l'atelier, `out/v2/` garde ces fichiers et leurs plans, et `tmp/v3/*-v2.*` les sources de la version 2.

## Histoire : la version 2

### Le format vertical : l'entrée dans « Souffler » (corrigée le 20 novembre à 7 h, à la demande d'Antonio)

Dans la première version, le cadre plongeait vers la goutte dès le toucher. Au format vertical, « Installez-vous » se retrouvait coupé à gauche, à droite puis en bas, sans jamais se lire en entier. Antonio l'a vu sur son iPhone.

Le cadre se resserre maintenant en 2 temps (`ecran.py`, `cadre_v`) :

1. Du toucher à la première note (0,97 s), il avance à peine, du cadre « acc » au cadre « mot ». Ce mouvement finit avec l'onde, en 11 images, puis le cadre ne bouge plus. « Installez-vous » et sa phrase restent entiers et immobiles pendant 0,7 s. Le cadre « mot » tient juste entre la pastille SOS, qui finit à 55,8 points, et la rangée de boutons du bas, qui commence à 639,8 points : rien n'y est coupé en haut ni en bas. Seul le bouton « Pause » dépasse sur les côtés.
2. À la première note, l'application écrit « Inspirez ». Alors seulement le cadre plonge vers la goutte, en 22 images, par un vrai zoom (un point de l'écran reste fixe, tout en haut de l'image).

Pendant la plongée le mot ne sort pas de l'image. Le film l'écrit lui-même, comme l'application : même police (Newsreader 500), même taille, même ombre, à la même place au point près (écart moyen mesuré avec la capture réelle : 0,0004). Il descend ensuite se poser à la hauteur 1440, sous la goutte, là où le film écrivait déjà ses mots. Pour cela la capture est refaite avec le grand mot caché (`capture_sans_mot.js`, dossier `app-sm/`) : hors du mot, elle est identique à la première, image pour image. Le film prend `app/` jusqu'à l'image 28 du plan, puis `app-sm/`.

Rien d'autre ne change : mêmes durées, même son, mêmes cadres à partir de l'image 51 du plan. Le film horizontal n'est pas touché. Il garde ses mots en Besley, en haut de l'image.

### La même correction, proposée pour le film horizontal (non publiée)

Le film horizontal a le même défaut, en plus court : « Installez-vous » y passe en 2 dixièmes de seconde, flou, et sort par le bas. Antonio n'a demandé que le vertical. La correction est donc seulement préparée, à part, pour qu'il puisse la voir et décider.

- `python3 h2.py` refait le plan de « Souffler » au format horizontal avec le cadre en 2 temps (`ecran.H2`, cadre « mot » : 321 points, échelle 2,51) et écrit tout dans `out/H2/`. Rien n'est écrasé dans `out/H/` ni dans `site-src/film/`.
- L'écran garde ici son vrai mot « Inspirez », qui sort par le bas pendant la plongée, pendant que le film écrit « Inspirez » en haut de l'image, comme avant. Le mot ne peut pas rester à sa place : il serait sur la goutte. Les mots du haut sont écrits dans la police de l'application (Newsreader), comme au format vertical.
- `python3 h2.py planche` : une planche de l'entrée, dans `tmp/zoom/h2.jpg`.
- Si Antonio dit oui : copier `out/H2/et-vous-horizontal.mp4` dans `site-src/film/`, garder l'ancien sous le nom `et-vous-horizontal-version-1.mp4`, refabriquer, rejouer `tests/film.js`, déposer.

Pour revoir l'entrée : `python3 planche_v.py V tmp/zoom/apres.jpg s7:0 s7:4 s7:8 s7:12 s7:20 s7:28 s7:29 s7:34 s7:38 s7:42 s7:46 s7:52`.

## Le film dans le site

- `site-src/film/` : les 2 films du lecteur, l'export Instagram, l'extrait de 5 secondes, l'image d'aperçu de la commande, les 2 affiches du lecteur, et les versions gardées.
- `site-src/config.essai.json`, réglage `film` : `pret` (le lecteur n'existe que par l'adresse `…/essai/#film`) ou `actif` (la commande « Voir le film · 35 secondes » est sur l'accueil, après les 3 portes). Ce réglage est refusé hors de la version d'essai.
- `pparts/v2-f.js` : la commande et le lecteur. `site/film.css` et `site/poser-css.py` : leur style. Le film n'est chargé qu'à la demande du parent. Il démarre toujours en silence (choix d'Antonio, le 20 novembre). Tant qu'il est muet, le bouton du son est clair et écrit en toutes lettres, « Activer le son ». À chaque ouverture du lecteur, le film repart en silence.
- À la fin du film, le bouton « Souffler 2 minutes » apparaît sous la vidéo, qui lui fait de la place. Il ferme le lecteur, puis ouvre l'exercice par le même chemin que la porte de l'accueil (en silence, à l'écran « Installez-vous »). Tout se passe dans le geste du parent, pour que l'exercice puisse garder l'écran allumé. La page que le lecteur avait ajoutée à l'historique devient celle de l'exercice (`HIST.unefois`). Le bouton Retour du téléphone et le « Retour » de l'exercice ramènent à l'accueil, à l'endroit où le parent l'avait laissé. « Revoir le film » retire le bouton le temps du film.
- `tests/film.js` : l'essai, joué en local puis en ligne dans Chrome, WebKit et Firefox. `tests/walk.js` visite aussi l'écran de fin (`film-lecteur-fin`).
- `site/icones.js` : les icônes de l'écran d'accueil du téléphone, avec la goutte du logo.
