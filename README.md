# Parent Écouté, Parent Éclairé : les fichiers de fabrication

Cette branche range ce qui sert à fabriquer le site « Parent Écouté, Parent Éclairé » d'Antonio Company. Elle n'est pas publiée comme site. Elle existe pour que le travail puisse être repris n'importe quand, même si l'atelier où il a été fait n'existe plus.

Le dépôt est public : rien ici n'est secret. On n'y met jamais de mot de passe, de clé, ni de donnée personnelle.

## Les branches du dépôt

| Branche | Ce qu'elle contient | Où cela s'affiche |
|---|---|---|
| `sources` | les fichiers de fabrication du site tel qu'il est en ligne | nulle part |
| `sources-essai` | les fichiers de fabrication de la version d'essai (cette branche), tant qu'elle n'est pas validée | nulle part |
| `infomaniak` | le site fabriqué pour parent-ecoute.ch, la version d'essai dans `site/essai/`, et ce qui les dépose | https://parent-ecoute.ch et https://parent-ecoute.ch/essai/ |
| `main` | l'ancienne adresse (GitHub Pages) | https://ac201983.github.io/carnet-de-liens/parent-ecoute/ |

## Ce qu'il y a ici

- `build_site.py` : fabrique le site à partir des morceaux. Un seul code, plusieurs sorties.
- `pparts/` : les morceaux de l'application (`p1-head.html` pour les styles, `v2-a.js`, `v2-c.js`, `v2-b.js`, `p2b-parcours.js`, les images en ligne, le tableau de bord de démonstration). `v2-c.js` porte le premier geste (la question et ses trois portes), l'écran « Souffler 2 minutes », l'écran « Déposer », les adresses des fiches, le bouton Retour du téléphone et le partage.
- `eparts/p2-content.js` : les situations, les outils et les textes repris de la première application.
- `site-src/` : ce qui entoure l'application sur le site (pages légales, polices, icônes, images, `site.js`) et les réglages : `config.json` pour l'ancienne adresse, `config.infomaniak.json` pour parent-ecoute.ch, `config.essai.json` pour la version d'essai. `site-src/img/fiches/` contient l'image d'aperçu de chaque fiche, celle qui s'affiche quand on envoie son lien (fabriquées par `tests/make-apercus.js`).
- `tests/` : les vérifications (parcours complet, voix, liens, contraste, débordement, format ordinateur, effets). S'y ajoutent `premier-geste.js` (trois parcours de bout en bout, au format téléphone puis ordinateur), `doigt.js` (taille des zones à toucher et du texte) et `essai.js` (ce qui est propre à la version d'essai). `prerender.js` écrit d'avance l'accueil, la liste des fiches et chaque fiche dans sa propre page.
- `outils/` : les scripts de rangement et de mise en ligne, le banc d'essai de l'eau (`outils/eau/`), et ce qui sert à la version d'essai (`preparer-essai.sh`, `outils/essai/`).

## Reprendre le travail ailleurs

1. Récupérer cette branche dans un dossier, par exemple `/home/claude/pepe`, et la branche `infomaniak` dans `pub/infomaniak` à côté.
2. Dire au script où il se trouve : `export PEPE_ROOT=/home/claude/pepe`. Sans cela il cherche dans `/home/claude`.
3. Il faut Python 3 et Node. Pour les tests : `playwright`, `axe-core` et `lighthouse`. Plusieurs tests portent encore le chemin `/home/claude` en dur.

## Fabriquer

Pour parent-ecoute.ch :

```
PEPE_REPO=$PEPE_ROOT/infomaniak/site PEPE_CONFIG=$PEPE_ROOT/site-src/config.infomaniak.json PEPE_SITE_ONLY=1 python3 build_site.py
```

Sans ces variables, le script fabrique l'ancienne adresse dans le dossier `carnet-de-liens/` (la branche `main`) et l'artefact `pepe.html`.

## Vérifier

```
node tests/serve.js $PEPE_ROOT/infomaniak/site 8444 / build/cert
PEPE_ORIGIN=https://localhost:8444 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch node tests/e2e.js
```

Les mêmes variables valent pour `links.js`, `voix.js`, `overflow.js`, `fx.js`, `contrast.js`. Le serveur local a besoin d'un certificat pour `localhost` dans `build/cert` (à recréer, il n'est pas rangé ici).

## Mettre en ligne

```
outils/preparer-infomaniak.sh
cd pub/infomaniak && git add -A && git commit -m "Ce qui change" && git push origin infomaniak
```

GitHub dépose alors le site chez Infomaniak et vérifie qu'il est bien servi. Puis ranger les sources :

```
outils/ranger-sources.sh
cd pub/sources && git add -A && git commit -m "Ce qui change" && git push origin sources
```

## La version d'essai

Elle sert à essayer une nouvelle version sur un vrai téléphone avant de la publier. Elle vit à une adresse à part, https://parent-ecoute.ch/essai/, que rien ne référence : chaque page porte la consigne `noindex,nofollow` et n'est pas dans le plan du site. Elle range ses notes sous sa propre clé dans le navigateur (`pepe-essai-v1`), donc elle ne touche pas à ce qu'un parent a écrit sur le site habituel. L'Espace Antonio n'y existe pas, parce qu'il n'y serait pas fermé par son mot de passe.

Fabriquer, vérifier, envoyer (dans l'atelier, les scripts de `outils/essai/` sont dans `build/essai/`) :

```
PEPE_REPO=$PEPE_ROOT/essai-out PEPE_CONFIG=$PEPE_ROOT/site-src/config.essai.json PEPE_SITE_ONLY=1 python3 build_site.py
node tests/serve.js $PEPE_ROOT/essai-out 8446 / build/cert
PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1 node tests/premier-geste.js
PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ node tests/essai.js
outils/preparer-essai.sh
cd pub/infomaniak && git add -A && git commit -m "Ce qui change" && git push origin infomaniak
```

`preparer-essai.sh` refuse de continuer si quelque chose a changé dans `site/` en dehors de `essai/` : le site public ne bouge pas avec la version d'essai. Après l'envoi, GitHub dépose les fichiers, relit les adresses de l'essai, puis rejoue `premier-geste.js` dans un vrai navigateur contre l'adresse en ligne. Les résultats sont écrits en notes sur la page de la mise en ligne.

Publier la version d'essai comme site (seulement quand Antonio l'a essayée et validée) :

1. Fabriquer avec `config.infomaniak.json` dans `infomaniak/site`, rejouer toute la suite (`outils/essai/tout.sh`).
2. `outils/preparer-infomaniak.sh`, puis enregistrer et envoyer la branche `infomaniak`.
3. Décider du sort de `/essai/` sur le serveur. Les fichiers déposés y restent tant qu'ils ne sont pas nommés dans `outils/a-supprimer.txt`. Si des liens de fiches de l'essai ont été envoyés à quelqu'un, laisser à leur place des pages qui renvoient vers la même fiche sans `/essai/`.
4. Reporter ces sources dans la branche `sources`.

## Règles du projet

- Les textes de l'application suivent la voix d'Antonio : des phrases simples et complètes, sans deux-points, points-virgules, tirets longs ni points médians. `tests/voix.js` le vérifie.
- Aucun vrai prénom de personne accompagnée, aucun nom d'institution, aucun numéro professionnel.
- L'espace dit toujours clairement qu'une intelligence artificielle écrit les réponses immédiates.
- Chaque bouton tient la promesse de son libellé. Rien n'est coché à l'avance, et aucune question ne passe devant ce que le parent est venu chercher.
- Le lien d'une fiche partagée ne contient que l'adresse de la fiche. Rien de ce que le parent a écrit ou choisi n'y figure.
