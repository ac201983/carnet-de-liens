# « Ce qu'on ne dit pas par SMS » : le montage intime (21 novembre 2026)

Troisième montage du film de présentation de « Parent écouté, parent éclairé », demandé par Antonio le 21 novembre 2026 à 11 h 28 : un court métrage intime de 1 minute 47,
sans voix off, construit autour de 2 SMS, avec une musique originale plus mélancolique (piano feutré, puis violoncelles). Il n'est publié que dans la version d'essai.

Le soir même (21 h 09), Antonio a demandé une musique vraiment meilleure, qui fasse rêver, et le retour des tapotements du clavier, qu'on entendait dans le film
« Et vous ? » et plus dans celui-ci. La musique a été récrite en entier et elle est jouée par de vrais instruments enregistrés. Les tapotements du clavier sont revenus
sur les 4 passages écrits. L'image n'a pas changé (les fichiers exportés gardent exactement la même image, seul le son est remplacé).

Cet atelier s'appuie sur les 2 précédents : `build/film/pres/` (les captures du site, les outils d'image) et `build/film/cine/` (la table, le fil de messages, le pouce,
les instruments, les bruits). Rien n'y est modifié.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `itemps.py` | Le minutage, lu par l'image et par le son. Changer un instant ici le change partout |
| `iplans.py` | Les plans (une fonction par plan) |
| `ifixes.py` | Les cadres tirés des photos : plans fixes, cadres qui glissent (vertical), zooms lents |
| `imontage.py` | Le rendu : un fichier par plan, puis `joint` |
| `ipartition.py` | La partition, note par note (la version du soir du 21 novembre) |
| `instruments.py` | Les instruments enregistrés : le piano et les cordes, joués note par note à partir de la banque |
| `banque.py` | Range une fois pour toutes les notes dont la partition a besoin (dossier `banque/`, qui n'est pas archivé : 313 Mo) |
| `ibruits.py` | Les bruits ajoutés pour ce montage (le grésillement du boîtier, le café versé, la tasse soulevée, la pièce et les oiseaux du dimanche, le doigt sur l'écran) |
| `imixage.py` | Le mixage du film, les tapotements du clavier, et le tableau des niveaux |
| `iba.py` | La bande-annonce de 30 secondes (image et son) |
| `iexporte.py` | Les exports, les affiches du lecteur, l'aperçu de l'accueil. `python3 iexporte.py son V` remplace le son d'un film déjà exporté sans recompresser l'image |
| `imesure.py` | Dans un fichier exporté : l'instant de chaque son, chaque tapotement, et l'image où le pouce touche Envoyer |
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

## La musique (version du 21 novembre au soir)

Ré mineur, une berceuse à 6 croches par mesure : une mesure dure 2 secondes (60 images). La phrase : la, fa, mi, et le ré qui ne vient pas.

1. Le soir. La première note arrive seule, dans le silence, sur la main immobile (7,5 s). Puis fa (9,5 s), mi (10,5 s). La phrase reste en l'air.
2. « Ce qui lui manque ». La main gauche se met à bercer pendant qu'il écrit, la phrase revient, toujours sans sa fin. « Poser les mains à plat » : la berceuse s'arrête, 2 accords se posent.
3. Le lendemain : plus clair (fa majeur), plus haut. La phrase s'interrompt pour laisser entendre le domino.
4. Le père regarde sa fille : la phrase dans le grave. La fille regarde son père (36,4 s) : les violoncelles entrent et répondent une tierce plus haut (do, la, sol).
5. Chez Bastien : les violoncelles chantent une mélodie faite du même geste (un saut qui monte, un pas qui redescend), sur la berceuse du piano, qui leur répond dans l'aigu.
   Au sommet (57,5 s), quand la phrase de Bastien est écrite, ils reprennent la, fa, mi. Ils s'effacent quand Rémi reçoit la fiche. Le café du dimanche n'a aucune musique.
6. Le père écrit enfin. La berceuse revient (89 s), puis la phrase : la (93 s), fa (95 s), mi (96 s) pendant que le pouce hésite, et le ré à l'image 2910 (97,0 s), où il envoie.
   C'est la seule fois où l'accord est majeur. Les violoncelles et les altos tiennent sa résonance sous le nom du site. Le piano ne joue plus aucune note après l'envoi.

Les accords : ré mineur, si bémol, do, la mineur (le soir) ; fa, si bémol, do (le lendemain) ; puis chez Bastien si bémol, fa, sol mineur, do, ré mineur, si bémol, fa, do,
ré mineur, do, fa, sol mineur, do, fa ; et à la fin ré mineur, si bémol, sol mineur, ré mineur sur un la, la septième, ré majeur.

Les instruments sont des enregistrements, joués note par note par `instruments.py` :
- le piano : Salamander Grand Piano V3, d'Alexander Holm (licence Creative Commons Attribution 3.0, à citer partout où le film est publié) ;
- les violoncelles et les altos : Versilian Studios Chamber Orchestra 2, Community Edition (licence CC0 1.0).

Ce que fait `instruments.py`, et pourquoi :
- La banque garde une note sur 3 ou 4. Les notes voisines sont obtenues en jouant l'enregistrement un peu plus vite ou plus lentement (2 demi-tons au plus).
- Chaque instrument a été pris par 2 micros écartés, dont les sons s'annulent en partie quand on les réunit, comme sur le haut-parleur d'un téléphone. On garde donc, pour chaque
  note, le micro qui l'entend le mieux, et c'est le mixage qui place l'instrument dans l'espace (le film perd 1 dB seulement quand la gauche et la droite sont réunies).
- Le piano a été pris à 12 cm des cordes : on entend surtout le marteau, et la note retombe de 25 dB en 1 seconde. On lui rend la tenue d'un piano écouté dans une salle
  (la courbe `TENUE_DB`), sans toucher à l'attaque, à peine adoucie (le feutre). Entre les harmoniques, le bruit des prises est à -83 dB : il reste inaudible.
- Pour chaque force demandée, on prend la couche enregistrée dont le niveau réel est le plus proche : d'une note à l'autre, les couches n'ont pas été frappées aussi fort.
- Les cordes : chaque note est ramenée au même niveau, sa justesse moyenne est corrigée (7 centièmes de demi-ton au plus), les notes liées se fondent l'une dans l'autre,
  et les nuances (crescendos, fins qui s'effacent) sont écrites dans la partition.

Les tapotements du clavier (`ibruits.tape`, posés par `imixage.pose_frappes`) : un par lettre, à l'instant où la lettre apparaît à l'image, dans les 4 passages écrits
(« Elle va bien, merci. », « Ça me manque de jouer avec elle. », « prendre mon café seul, le matin. », le dernier message) et dans la bande-annonce. C'est le tapotement du
film « Et vous ? », avec un peu plus de corps. Il est plus fort quand les violoncelles jouent, moins dans le silence du début. Mesuré dans les films exportés : 151 tapotements,
chacun à moins de 5 millièmes de seconde de sa lettre, et au moins 18 dB au-dessus de la musique dans l'aigu (36 dB en moyenne).

Tous les bruits sont calculés, la vibration comprise. Seuls le piano et les cordes sont des enregistrements.
Le son ne tombe jamais au silence complet : la pièce du soir au début et à la fin, et une pièce de jour très discrète du lendemain jusqu'au café du dimanche.
Niveaux mesurés : film -16,2 LUFS (écart entre passages doux et forts 13,6), bande-annonce -14,6 LUFS. Le limiteur ne retient que le sommet des violoncelles (1,9 dB au plus).

## Refaire la banque d'instruments

Les 2 banques sont publiques. Elles ne sont pas archivées ici (175 Mo et 380 Mo pour les seules notes utiles) :
- `git clone https://github.com/sfzinstruments/SalamanderGrandPiano` (version 3382bf9), dossier `Samples/` : les notes A, C, D#, F# de A1 à D#6, couches v1, v3, v5, v7, v9 ;
- `git clone https://github.com/sgossner/VSCO-2-CE` (version 4403009), dossiers `Strings/Cello Section/susvib/` et `Strings/Viola Section/susvib/`.

Puis `python3 -I banque.py <Salamander>/Samples <VSCO-2-CE> banque` (les fichiers d'origine sont lus par ffmpeg, et Python est lancé avec `-I` parce que ce sont des fichiers téléchargés).
On obtient `banque/*.npy` (une note par fichier), `banque/index.json` (hauteur et force de chaque note) et `banque/justesse.json` (la justesse des cordes).

## Refaire le film

1. `node cap_depot2.js`, `node cap_carnet2.js` (serveur d'essai local lancé), et dans `../cine` : `node fil.js a ../intime/cap/fila2 105 "f1=10&n1=42&ap=64"`,
   `node fil.js e ../intime/cap/file2 370 "f1=24&n1=170&ap=270"`, `node fil.js e ../intime/cap/table-e 1 "f1=900&n1=10&ap=990" 844 3`.
2. `python3 ../sr/agrandir.py ../pres/src/04-la-fiche-tendue.png ../plates/photo4x4.png` (de même pour 06).
3. `python3 imontage.py V tout` et `python3 imontage.py H tout` (2 rendus à la fois au plus), puis `python3 imontage.py V joint`, `python3 imontage.py H joint`.
4. `python3 imixage.py` (1 minute et demie, la banque d'instruments doit être là), puis `python3 iexporte.py V`, `python3 iexporte.py H`. Pour ne refaire que le son : `python3 iexporte.py son V`, `… son H`, `… son BA`.
5. La bande-annonce : `python3 iba.py image`, `python3 iba.py joint`, `python3 iba.py son`, `python3 iexporte.py BA`.
6. `python3 imesure.py out/final/<fichier>.mp4` (ou `… ba` pour la bande-annonce), puis `python3 iexporte.py affiches <dossier>`.
