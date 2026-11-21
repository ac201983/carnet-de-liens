# « Ce qu'on ne dit pas par SMS » : le montage intime (21 novembre 2026)

Troisième montage du film de présentation de « Parent écouté, parent éclairé », demandé par Antonio le 21 novembre 2026 à 11 h 28 : un court métrage intime de 1 minute 47,
sans voix off, construit autour de 2 SMS, avec une musique originale plus mélancolique (piano feutré, puis violoncelle). Il n'est publié que dans la version d'essai.

Cet atelier s'appuie sur les 2 précédents : `build/film/pres/` (les captures du site, les outils d'image) et `build/film/cine/` (la table, le fil de messages, le pouce,
les instruments, les bruits). Rien n'y est modifié.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `itemps.py` | Le minutage, lu par l'image et par le son. Changer un instant ici le change partout |
| `iplans.py` | Les plans (une fonction par plan) |
| `ifixes.py` | Les cadres tirés des photos : plans fixes, cadres qui glissent (vertical), zooms lents |
| `imontage.py` | Le rendu : un fichier par plan, puis `joint` |
| `ipartition.py` | La partition, note par note |
| `ibruits.py` | Les bruits ajoutés pour ce montage (le grésillement du boîtier, le café versé, la tasse soulevée, la pièce et les oiseaux du dimanche) |
| `imixage.py` | Le mixage du film et le tableau des niveaux |
| `iba.py` | La bande-annonce de 30 secondes (image et son) |
| `iexporte.py` | Les exports, les affiches du lecteur, l'aperçu de l'accueil |
| `imesure.py` | Dans un fichier exporté : l'instant de chaque son et l'image où le pouce touche Envoyer |
| `ivoir.py` | Une planche d'images choisies, avant l'encodage |
| `cap_depot2.js`, `cap_carnet2.js` | Les captures du site refaites pour ce montage (la phrase seule dans « Déposer », le carnet daté du 12.11.2026) |
| `titres.html`, `titres.js` | La légende « Elle écarte elle-même la tablette. » |

Les photos d'Antonio sont dans `build/film/pres/src/` (01 à 06) et, agrandies 4 fois par Real-ESRGAN, dans `build/film/plates/photoNx4.png`.
L'image 05 (2 mains, manches sombres, autre table) n'est pas utilisée : les manches et la table ne sont pas celles de la cuisine du soir.

## Le film (3220 images, 107,33 s)

| Temps | Plans | Ce qu'on voit |
|---|---|---|
| 0 à 3 s | a1 | La cuisine du soir, le téléphone en veille sur le chêne. On n'entend que la pièce. 2 vibrations à 1,0 et 1,4 s, l'écran s'allume : un message d'Élise |
| 3 à 6,5 s | a2 | « Comment va ta fille ? » Il répond « Elle va bien, merci. » et envoie |
| 6,5 à 13,5 s | a3 | Sa main immobile près du verre. La première note de piano à 7,5 s. Puis « Pour les parents d'un enfant, d'un ado ou d'un adulte en situation de handicap. », entière de 8,2 à 13,2 s |
| 13,5 à 20,4 s | b1 | « Déposer ce qui pèse ». À la question « Qu'aimeriez-vous qu'on comprenne de votre journée ? », il écrit « Ça me manque de jouer avec elle. » |
| 20,4 à 23,6 s | b2 | Son carnet de route : « Poser les mains à plat. » |
| 23,6 à 27,6 s | b3 | Ses 2 mains à plat sur la table, le téléphone éteint entre elles |
| 27,6 à 30,2 s | b4 | « Le lendemain ». Le minuteur visuel, un instant, jusqu'à « C'est fini. Bravo. » |
| 30,2 à 32,4 s | b5 | « Elle écarte elle-même la tablette. » |
| 32,4 à 40,5 s | b6 à b9 | Les dominos entre eux, une pièce touche le bois (32,9 s). Le père relève les yeux. Sa fille le regarde et sourit : le violoncelle entre (36,4 s). Sa main près des dominos |
| 40,5 à 46,5 s | c1 | La main de Bastien sur son stylo, le cadre s'élargit : lui et sa mère. « Bastien prépare son week-end chez son oncle Rémi. » |
| 46,5 à 52,5 s | c2, c3 | « Passer le relais », le vrai écran. Bastien, à hauteur de regard |
| 52,5 à 66 s | c4, c5 | Il choisit « J'aime… » et écrit « prendre mon café seul, le matin. » Puis sa fiche, « Le relais de Bastien », où on relit sa phrase |
| 66 à 74 s | d1 | Il tend la feuille pliée à Rémi. Le violoncelle s'efface. On entend déjà le café qu'on verse (71,8 s) |
| 74 à 86 s | d2, d3 | « Dimanche matin ». Près de la fenêtre, sa tasse à la main. Aucune musique : la pièce, des oiseaux derrière la vitre |
| 86 à 100,3 s | e1, e2 | Le cadrage de la première scène, la même conversation. Il écrit « Tu as cinq minutes ce soir ? J'aimerais te raconter ma journée. » Son pouce touche Envoyer à 97,0 s : la quatrième note |
| 100,3 à 107,3 s | e3 | Le logo, « Parent écouté, parent éclairé », « Ici, on commence par vous. », parent-ecoute.ch, « Les photos illustrent une fiction. » |

Vertical et horizontal sont cadrés séparément. 2 photos sont plus larges que hautes (les 2 mains, la fiche tendue) : en horizontal on les voit d'un coup, en vertical le cadre
glisse d'une main à l'autre, puis de Bastien, qui donne, à Rémi, qui reçoit.

## La musique

Ré mineur, 60 à la noire (1 temps = 30 images). Un motif de 3 notes au piano feutré (la, fa, mi), qui attend sa quatrième (ré). Le violoncelle entre quand la fille regarde son père
et reprend le motif une tierce plus haut (do, la, sol). Il chante de longues notes chez Bastien, puis s'efface quand Rémi reçoit la fiche. Le café du dimanche n'a aucune musique.
La quatrième note tombe à l'image 2910, où le pouce touche Envoyer. Sous le nom du site, l'accord s'éclaire (ré majeur).

Instruments : la banque « MS Basic » de MuseScore (licence MIT), jouée par tinysoundfont. Le feutre du piano : des touchers doux et les aigus retenus au-dessus de 2700 Hz.
Tous les bruits sont calculés (aucun enregistrement n'est joignable depuis l'atelier), la vibration comprise.
Le son ne tombe jamais au silence complet : la pièce du soir au début et à la fin, et une pièce de jour très discrète du lendemain jusqu'au café du dimanche.

## Refaire le film

1. `node cap_depot2.js`, `node cap_carnet2.js` (serveur d'essai local lancé), et dans `../cine` : `node fil.js a ../intime/cap/fila2 105 "f1=10&n1=42&ap=64"`,
   `node fil.js e ../intime/cap/file2 370 "f1=24&n1=170&ap=270"`, `node fil.js e ../intime/cap/table-e 1 "f1=900&n1=10&ap=990" 844 3`.
2. `python3 ../sr/agrandir.py ../pres/src/04-la-fiche-tendue.png ../plates/photo4x4.png` (de même pour 06).
3. `python3 imontage.py V tout` et `python3 imontage.py H tout` (2 rendus à la fois au plus), puis `python3 imontage.py V joint`, `python3 imontage.py H joint`.
4. `python3 imixage.py`, puis `python3 iexporte.py V`, `python3 iexporte.py H`.
5. La bande-annonce : `python3 iba.py image`, `python3 iba.py joint`, `python3 iba.py son`, `python3 iexporte.py BA`.
6. `python3 imesure.py out/final/<fichier>.mp4` (ou `… ba` pour la bande-annonce), puis `python3 iexporte.py affiches <dossier>`.
