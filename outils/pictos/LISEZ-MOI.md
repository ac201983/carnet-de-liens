# Les cartes-images de « D’abord, ensuite » et de la routine

Les images viennent des Mulberry Symbols (© Steve Lee, licence CC BY-SA 4.0), dépôt `github.com/mulberrysymbols/mulberry-symbols`, dossier `EN`.

- `jeu.py` : la liste des images (identifiant, fichier d’origine, mot écrit dessous, ce qu’on dit après « D’abord » ou « ensuite »), les groupes et la routine. `js()` écrit les lignes à placer dans `eparts/p2-content.js`, `credits()` écrit `site-src/credits-pictos.md`.
- `prepare.js` : allège les fichiers retenus avec svgo, sans toucher au dessin, et les range dans `site-src/img/pictos/<identifiant>.svg`.
- `compare.js` : compare chaque image allégée à son original (rendu à 256 px).
- `planche.js` : une planche de contact pour choisir de nouvelles images.
- `mots.js` : pose chaque image dans le tableau à six largeurs d’écran et signale tout mot coupé.

Pour ajouter une image : une ligne dans `jeu.py` (et son identifiant dans un groupe), puis `prepare.js`, `compare.js`, les lignes de `js()` dans `p2-content.js`, `credits()`, et `tests/pictos.js`.
Les chemins écrits dans ces scripts sont ceux de l’atelier du 16 novembre 2026 (`/home/claude`, et le dépôt d’origine dans `/tmp/pictos/mulberry`).
