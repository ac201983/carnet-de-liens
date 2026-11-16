# Parent Écouté, Parent Éclairé : les fichiers de fabrication

Cette branche range ce qui sert à fabriquer le site « Parent Écouté, Parent Éclairé » d'Antonio Company. Elle n'est pas publiée comme site. Elle existe pour que le travail puisse être repris n'importe quand, même si l'atelier où il a été fait n'existe plus.

Le dépôt est public : rien ici n'est secret. On n'y met jamais de mot de passe, de clé, ni de donnée personnelle.

## Les trois branches du dépôt

| Branche | Ce qu'elle contient | Où cela s'affiche |
|---|---|---|
| `sources` | les fichiers de fabrication (cette branche) | nulle part |
| `infomaniak` | le site fabriqué pour parent-ecoute.ch, et ce qui le dépose | https://parent-ecoute.ch |
| `main` | l'ancienne adresse (GitHub Pages) | https://ac201983.github.io/carnet-de-liens/parent-ecoute/ |

## Ce qu'il y a ici

- `build_site.py` : fabrique le site à partir des morceaux. Un seul code, plusieurs sorties.
- `pparts/` : les morceaux de l'application (`p1-head.html` pour les styles, `v2-a.js`, `v2-b.js`, `p2b-parcours.js`, les images en ligne, le tableau de bord de démonstration).
- `eparts/p2-content.js` : les situations, les outils et les textes repris de la première application.
- `site-src/` : ce qui entoure l'application sur le site (pages légales, polices, icônes, images, `site.js`) et les réglages : `config.json` pour l'ancienne adresse, `config.infomaniak.json` pour parent-ecoute.ch.
- `tests/` : les vérifications (parcours complet, voix, liens, contraste, débordement, format ordinateur, effets).
- `outils/` : les scripts de rangement et de mise en ligne, et le banc d'essai de l'eau (`outils/eau/`).

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

## Règles du projet

- Les textes de l'application suivent la voix d'Antonio : des phrases simples et complètes, sans deux-points, points-virgules, tirets longs ni points médians. `tests/voix.js` le vérifie.
- Aucun vrai prénom de personne accompagnée, aucun nom d'institution, aucun numéro professionnel.
- L'espace dit toujours clairement qu'une intelligence artificielle écrit les réponses immédiates.
