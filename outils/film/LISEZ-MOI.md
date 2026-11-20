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
| 16,6 à 27,6 s | La goutte : une inspiration de 4 s, une expiration de 6 s | Capture réelle de la version d'essai, image par image |
| 27,6 à 30,8 s | La main près du verre, « Ici, on commence par vous. » | Image 2 de la planche |
| 30,8 à 35 s | Le logo, « Parent écouté, parent éclairé », parent-ecoute.ch | Logo et polices du site |

Les gestes de la main ne sont pas filmés. Chaque coupe arrive sur le résultat du geste, et le son le raconte.

## Les droits

- Les 4 images de base sont celles de la planche « Écho d'eau entre verre et étang », fournie par Antonio.
- L'interface, la goutte, le logo, les polices (Besley et Nunito, licence OFL), les notes de piano et l'eau viennent du projet.
- Tous les autres sons sont calculés ici (`son.py`) : le vibreur, les touches, le téléphone sur le bois, le verre, la cuisine.
- Aucun média extérieur, aucune génération payante.
- L'agrandissement des images utilise Real-ESRGAN (modèle `realesrgan-x4plus`, licence BSD 3 clauses), comme un outil. Le modèle n'est pas rangé ici : il se télécharge depuis les versions publiées du projet Real-ESRGAN.

## Refaire le film

Dans l'atelier, ces fichiers sont dans `build/film/`. Les images lourdes (agrandissements, captures) ne sont pas rangées dans le dépôt : elles se refont.

1. `python3 sr/agrandir.py src/p1.png plates/p1x4.png` (et de même pour p2, p3, p4, puis la photo de la goutte du site vers `plates/hero-film.jpg`).
2. `node ecrans/ecrans.js verrou ecrans 3` et `node ecrans/ecrans.js fil ecrans/fil 5` : l'écran verrouillé et le fil de messages.
3. `node capture_app.js 8446 /essai/ app 5` : la version d'essai filmée image par image (accueil, toucher, « Souffler »).
4. `node titres/titres.js` : les textes et le carton final.
5. `python3 montage.py H tout` puis `python3 montage.py H joint`, et de même avec `V`.
6. `python3 mixage.py` : le son, avec une image du son et les instants mesurés.
7. `python3 -c "import film; film.export('out/H/image.mp4', 'tmp/film.wav', 'out/et-vous-horizontal.mp4', 21, '8M')"`, et de même pour le vertical.
8. `python3 extrait.py` puis `python3 rendre_extrait.py H` : l'extrait de 5 secondes du raccord.
9. `python3 voir.py out/et-vous-vertical.mp4 tmp/voir/V 2 6 2` : les planches de contrôle, pour regarder le film en entier.

## Le film dans le site

- `site-src/film/` : les 2 films, l'extrait, l'image d'aperçu de la commande et les 2 affiches du lecteur.
- `site-src/config.essai.json`, réglage `film` : `pret` (le lecteur n'existe que par l'adresse `…/essai/#film`) ou `actif` (la commande « Voir le film · 35 secondes » est sur l'accueil, après les 3 portes). Ce réglage est refusé hors de la version d'essai.
- `pparts/v2-f.js` : la commande et le lecteur. `site/film.css` et `site/poser-css.py` : leur style.
- `tests/film.js` : l'essai, joué en local puis en ligne dans Chrome, WebKit et Firefox.
- `site/icones.js` : les icônes de l'écran d'accueil du téléphone, avec la goutte du logo.
