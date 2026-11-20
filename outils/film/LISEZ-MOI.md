# Le film « Et vous ? » (20 novembre 2026)

Un film de 35 secondes pour « Parent écouté, parent éclairé », en 2 formats : vertical 1080 × 1920 (iPhone, Instagram) et horizontal 1920 × 1080 (site). Il n'est publié que dans la version d'essai, à `https://parent-ecoute.ch/essai/film/`.

## Ce que le film contient

| Temps | Plan | D'où vient l'image |
|---|---|---|
| 0 à 1,2 s | Le téléphone s'éclaire près du verre | Image 1 de la planche d'Antonio, écran verrouillé composé ici |
| 1,2 à 5,4 s | « Comment va ta fille ? », la réponse, le pouce qui s'attarde 1 seconde, l'envoi | Fil de messages composé ici (`ecrans/`), aucun logiciel imité |
| 5,4 à 7 s | Le téléphone est retourné, le silence | Image 2 de la planche |
| 7 à 10,4 s | Le cercle naît dans le verre, le cadre se resserre | Image 3 de la planche, cercles séparés puis remis en mouvement (`ondes.py`) |
| 10,4 à 14,3 s | L'onde continue sur l'étang, « Et vous ? » | Image 4 de la planche |
| 14,3 à 16,6 s | Retour à la table, l'accueil de l'application, le doigt choisit « Souffler 2 minutes » | Image 1, puis capture réelle de la version d'essai |
| 16,6 à 27,6 s | « Installez-vous », puis la goutte : une inspiration de 4 s, une expiration de 6 s | Capture réelle de la version d'essai, image par image |
| 27,6 à 30,8 s | La main près du verre, « Ici, on commence par vous. » | Image 2 de la planche |
| 30,8 à 35 s | Le logo, « Parent écouté, parent éclairé », parent-ecoute.ch | Logo et polices du site |

Les gestes de la main ne sont pas filmés. Chaque coupe arrive sur le résultat du geste, et le son le raconte.

## Les droits

- Les 4 images de base sont celles de la planche « Écho d'eau entre verre et étang », fournie par Antonio.
- L'interface, la goutte, le logo, les polices (Besley, Newsreader et Nunito, licence OFL), les notes de piano et l'eau viennent du projet.
- Tous les autres sons sont calculés ici (`son.py`) : le vibreur, les touches, le téléphone sur le bois, le verre, la cuisine.
- Aucun média extérieur, aucune génération payante.
- L'agrandissement des images utilise Real-ESRGAN (modèle `realesrgan-x4plus`, licence BSD 3 clauses), comme un outil. Le modèle n'est pas rangé ici : il se télécharge depuis les versions publiées du projet Real-ESRGAN.

## Refaire le film

Dans l'atelier, ces fichiers sont dans `build/film/`. Les images lourdes (agrandissements, captures) ne sont pas rangées dans le dépôt : elles se refont.

1. `python3 sr/agrandir.py src/p1.png plates/p1x4.png` (et de même pour p2, p3, p4, puis la photo de la goutte du site vers `plates/hero-film.jpg`).
2. `node ecrans/ecrans.js verrou ecrans 3` et `node ecrans/ecrans.js fil ecrans/fil 5` : l'écran verrouillé et le fil de messages.
3. `node capture_app.js 8446 /essai/ app 5` : la version d'essai filmée image par image (accueil, toucher, « Souffler »).
   `node capture_sans_mot.js 8446 /essai/ app-sm 5` : la même capture, le grand mot de « Souffler » caché. Elle sert au film vertical à partir de la première note.
4. `node titres/titres.js` : les textes et le carton final. `node titres/mot.js` : « Inspirez » et « Expirez » écrits comme l'application les écrit, pour le film vertical.
5. `python3 montage.py H tout` puis `python3 montage.py H joint`, et de même avec `V`.
6. `python3 mixage.py` : le son, avec une image du son et les instants mesurés.
7. `python3 -c "import film; film.export('out/H/image.mp4', 'tmp/film.wav', 'out/et-vous-horizontal.mp4', 21, '8M')"`, et de même pour le vertical.
8. `python3 extrait.py` puis `python3 rendre_extrait.py H` : l'extrait de 5 secondes du raccord.
9. `python3 voir.py out/et-vous-vertical.mp4 tmp/voir/V 2 6 2` : les planches de contrôle, pour regarder le film en entier.

## Le format vertical : l'entrée dans « Souffler » (corrigée le 20 novembre, à la demande d'Antonio)

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

- `site-src/film/` : les 2 films, l'extrait, l'image d'aperçu de la commande et les 2 affiches du lecteur. Un fichier nommé `et-vous-…-version-N.mp4` est une version gardée pour comparer : il est publié à sa propre adresse et le lecteur ne le charge jamais. `et-vous-vertical-version-1.mp4` est le film vertical du 20 novembre à 4 heures, avant la correction de l'entrée dans « Souffler ».
- `site-src/config.essai.json`, réglage `film` : `pret` (le lecteur n'existe que par l'adresse `…/essai/#film`) ou `actif` (la commande « Voir le film · 35 secondes » est sur l'accueil, après les 3 portes). Ce réglage est refusé hors de la version d'essai.
- `pparts/v2-f.js` : la commande et le lecteur. `site/film.css` et `site/poser-css.py` : leur style. Le film démarre toujours en silence (choix d'Antonio, le 20 novembre). Tant qu'il est muet, le bouton du son est clair et écrit en toutes lettres, « Activer le son ». Avec le son, il devient un bouton rond, « Couper le son », et le curseur du volume revient là où l'appareil le permet. À chaque ouverture du lecteur, le film repart en silence.
- `tests/film.js` : l'essai, joué en local puis en ligne dans Chrome, WebKit et Firefox.
- `site/icones.js` : les icônes de l'écran d'accueil du téléphone, avec la goutte du logo.
