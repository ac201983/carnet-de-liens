# Parent Écouté, Parent Éclairé : les fichiers de fabrication

Cette branche range ce qui sert à fabriquer le site « Parent Écouté, Parent Éclairé » d'Antonio Company. Elle n'est pas publiée comme site. Elle existe pour que le travail puisse être repris n'importe quand, même si l'atelier où il a été fait n'existe plus.

Le dépôt est public : rien ici n'est secret. On n'y met jamais de mot de passe, de clé, ni de donnée personnelle.

## Les branches du dépôt

| Branche | Ce qu'elle contient | Où cela s'affiche |
|---|---|---|
| `sources` | les fichiers de fabrication du site tel qu'il est en ligne | nulle part |
| `sources-essai` | la même chose que `sources` depuis le 26 novembre 2026, jour où la version d'essai a été publiée sur le site. Elle servira de nouveau le jour où une version d'essai sera refaite | nulle part |
| `infomaniak` | le site fabriqué pour parent-ecoute.ch et ce qui le dépose. Jusqu'au 25 novembre 2026, elle contenait aussi la version d'essai, dans `site/essai/` | https://parent-ecoute.ch |
| `avant-publication-2026-11-22` | le site et la version d'essai tels qu'ils étaient en ligne du 21 au 26 novembre 2026, pour pouvoir revenir en arrière | nulle part |
| `main` | l'ancienne adresse (GitHub Pages) | https://ac201983.github.io/carnet-de-liens/parent-ecoute/ |

## Ce qu'il y a ici

- `build_site.py` : fabrique le site à partir des morceaux. Un seul code, plusieurs sorties.
- `pparts/` : les morceaux de l'application (`p1-head.html` pour les styles, `v2-a.js`, `v2-c.js`, `v2-b.js`, `p2b-parcours.js`, les images en ligne, le tableau de bord de démonstration). `v2-c.js` porte le premier geste (la question et ses trois portes), l'écran « Souffler 2 minutes », l'écran « Déposer », les adresses des fiches, le bouton Retour du téléphone, le partage et le son de l'étang.
- `eparts/p2-content.js` : les situations, les outils et les textes repris de la première application.
- `site-src/` : ce qui entoure l'application sur le site (pages légales, polices, icônes, images, `site.js`) et les réglages : `config.json` pour l'ancienne adresse, `config.infomaniak.json` pour parent-ecoute.ch, `config.essai.json` pour la version d'essai. `site-src/img/fiches/` contient l'image d'aperçu de chaque fiche, celle qui s'affiche quand on envoie son lien (fabriquées par `tests/make-apercus.js`). `site-src/son/` contient l'ambiance de l'étang : `etang.mp3` (2 minutes, calées sur la respiration) et `instant.mp3` (40 secondes, pour la dose).
- `tests/` : les vérifications (parcours complet, voix, liens, contraste, débordement, format ordinateur, effets). S'y ajoutent `premier-geste.js` (trois parcours de bout en bout, au format téléphone puis ordinateur), `finition.js` (le son de l'étang, la dose, « Accueil » et « Retour », dans le navigateur choisi par `PEPE_NAV`), `doigt.js` (taille des zones à toucher et du texte) et `essai.js` (ce qui est propre à la version d'essai). `prerender.js` écrit d'avance l'accueil, la liste des fiches et chaque fiche dans sa propre page.
- `outils/` : les scripts de rangement et de mise en ligne, le banc d'essai de l'eau (`outils/eau/`), ce qui sert à la version d'essai (`preparer-essai.sh`, `outils/essai/`), et ce qui a composé le son de l'étang (`outils/son/`).

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

## Le son de l'étang

C'est une création originale, entièrement calculée par `outils/son/compose.py` et `outils/son/compose2.py` : aucun enregistrement, aucun échantillon, aucune musique existante. Il y a 2 matières seulement, de l'eau (du bruit filtré) et un piano feutré (des notes additives, à l'attaque douce).

### La musique qui guide la respiration (depuis le 18 novembre 2026 au soir)

La musique de « Souffler 2 minutes » n'est plus un morceau écrit d'avance. La page la joue note après note, en suivant le minutage de l'exercice : c'est ce qui lui permet de suivre 3 respirations différentes et une cadence que le parent règle.

- **Un seul minutage.** `state.souffle.seq` (dans `pparts/v2-c.js`) est la suite des mouvements décidés : inspirer ou souffler, l'instant du début, la durée. Le cercle, les mots « Inspirez » et « Expirez » et la musique lisent tous cette suite. Un mouvement est décidé 450 ms avant de commencer, avec le réglage du moment : changer de respiration ou de cadence prend donc effet au mouvement suivant, sans rien couper.
- **Les 3 respirations** (`RESP`) : « Le souffle régulier » (5 s et 5 s), « L'expiration prolongée » (4 s et 6 s, celle d'un parent qui n'a rien choisi), « À mon rythme » (de 5 à 14 secondes par respiration, deux cinquièmes pour inspirer). L'exercice se termine toujours à la fin d'une expiration, entre 1 minute 55 et 2 minutes 06.
- **La phrase musicale.** À l'inspiration, 3 notes montent (ré, fa dièse, la) et une note grave les porte (ré, si, sol, la, à tour de rôle). À l'expiration, les notes redescendent pas à pas (fa dièse, mi, ré), avec une quatrième note plus basse (la) quand l'expiration est la plus longue. L'eau s'éclaircit et avance quand on inspire, s'assombrit et se retire quand on souffle.
- **Les fichiers.** `site-src/son/notes.mp3` contient les 9 notes, rangées dans des cases de 6,5 secondes. `site-src/son/eau.mp3` est une boucle de 28 secondes. Les nombres de `compose2.py` (hauteurs, volumes, filtre de l'eau) sont les mêmes que ceux de `v2-c.js` (`RS_…`) : le script fabrique les fichiers et simule le résultat pour le mesurer.

```
python3 outils/son/compose2.py notes notes.wav      # les 9 notes, une par case
python3 outils/son/compose2.py eau eau.wav          # la boucle d'eau
python3 outils/son/compose2.py instant instant.wav  # les 40 secondes de la dose, sur la même phrase
python3 outils/son/compose2.py essai long essai.wav # simulation de ce que joue la page, pour les mesures (egal, long ou libre)
ffmpeg -i notes.wav -c:a libmp3lame -b:a 80k -ar 44100 -joint_stereo 1 -map_metadata -1 -write_xing 1 -id3v2_version 0 site-src/son/notes.mp3
```

Dans l'application : le son ne part jamais sans un geste du parent (« Écouter l'étang »), il est chargé à ce moment-là seulement, une seule musique joue à la fois, et tout se tait dès qu'on quitte l'écran qui l'a lancé. Sur iPhone, la page se déclare comme un lecteur pour que le bouton « silencieux » ne coupe pas le son (possible depuis iOS 17). La musique de la respiration a besoin du son calculé dans la page : sur un iPhone plus ancien, un message rappelle de vérifier le bouton silencieux. L'instant de la dose, lui, garde le lecteur audio ordinaire en secours.

Trois détails qui comptent sur un téléphone :

- Chaque fichier est téléchargé une seule fois par visite et gardé tel quel. Le son décodé pèse plusieurs mégaoctets : il est rendu dès qu'on quitte son écran, et décodé de nouveau si le parent y revient.
- L'écran reste allumé pendant la respiration et tant qu'un son joue (`veilleSync`). Dès que c'est fini, le téléphone reprend son réglage.
- Quand la page passe à l'arrière-plan, le son se coupe et le minutage attend. Au retour, tout est décalé d'autant (`souffleDecale`) et la musique reprend au début du mouvement suivant. Le son de la dose reste coupé.

### Les essais du son

- `tests/respiration.js` rejoue la respiration dans Chrome, Firefox et WebKit : le silence, « Changer de respiration », et, là où le son est mesurable, chaque note posée par la page (son instant, sa hauteur, son volume) comparée au mot affiché, jusqu'à la dernière respiration.
- `tests/ecoute.js` puis `tests/ecoute.py` font l'essai « les yeux fermés » : le premier enregistre ce que la page envoie réellement vers la sortie audio, le second analyse cet enregistrement seul, sans rien savoir de l'écran. Il retrouve les notes, en déduit quand inspirer et quand souffler, puis compare avec les mots affichés.
- `tests/finition.js` garde l'instant de la dose, l'accueil et la navigation.

Aucun de ces essais n'écoute : ils mesurent. Le timbre et le plaisir d'écoute se jugent à l'oreille, sur un vrai téléphone.

## La version d'essai

**Depuis le 26 novembre 2026, il n'y a plus de version d'essai en ligne.** À la demande d'Antonio, tout ce qu'elle contenait a été publié sur le site, ses fichiers ont été retirés du serveur, et ses anciennes adresses renvoient vers la même page du site (voir `outils/officiel/LISEZ-MOI.md`). Ce qui suit décrit comment elle fonctionnait, et sert le jour où il faudra en refaire une. Il faudra d'abord retirer la règle de renvoi de `outils/htaccess-bloc.txt` et les lignes de l'essai de `outils/a-supprimer.txt`, dans la branche `infomaniak`.

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

`preparer-essai.sh` refuse de continuer si quelque chose a changé dans `site/` en dehors de `essai/` : le site public ne bouge pas avec la version d'essai. Après l'envoi, GitHub dépose les fichiers, relit les adresses de l'essai et les fichiers du son, puis rejoue contre l'adresse en ligne `premier-geste.js` dans Chrome et `finition.js` dans Chrome, WebKit et Firefox, chacun sur sa machine. Les résultats sont écrits en notes sur la page de la mise en ligne. Pour rejouer ces essais sans rien déposer : `git push origin infomaniak:essais-en-ligne`.

Dans `finition.js`, l'horloge de la respiration est relevée dans la page, au moment du geste. La relever depuis l'extérieur ajoute le temps que le navigateur d'essai met à cliquer, qui dépasse 1 seconde sur une machine lente.

Publier la version d'essai comme site (seulement quand Antonio l'a essayée et validée). C'est ce qui a été fait le 26 novembre 2026, avec la suite `outils/officiel/lot-o.sh` et une répétition sur un faux serveur (`outils/officiel/repet/`) :

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
- Le silence est la règle. Aucun son ne part sans un geste du parent, et le même geste le coupe.
- « Retour » ramène d'où l'on vient. La flèche du navigateur suit le même chemin.
- Avant de donner un nom de classe à un nouvel élément, le chercher dans `pparts/p1-head.html`. Les noms courts sont déjà pris : `acc` et `acc-l` appartiennent à la vitrine, par exemple. Un nom déjà pris donne sa mise en forme à des éléments qui n'ont rien à voir, et aucun contrôle automatique ne le voit. Après un changement de style, regarder la vitrine entière, du haut jusqu'en bas, sur téléphone et sur ordinateur.
