# « Ce qu'on ne dit pas par SMS », le montage cinématographique

Le film de présentation de « Parent écouté, parent éclairé », refait le 20 novembre 2026 au soir à la demande d'Antonio. Il dure 1 minute 47 (107,33 secondes, 3220 images à 30 images par seconde), ne comporte aucune parole, se comprend en silence et a une musique originale. Il n'est publié que dans la version d'essai, à `https://parent-ecoute.ch/essai/film/`.

L'idée qui tient le film : au début, un père écrit 3 mots qu'il efface (« En fait, moi… »). À la fin, il trouve les mots et envoie son message. Entre les deux, on voit ce que le site lui a apporté.

## Les fichiers livrés

| Fichier | Image | Sert à |
|---|---|---|
| `ce-quon-ne-dit-pas-par-sms-vertical.mp4` | 1080 × 1920 | le lecteur de l'essai, sur un téléphone tenu droit |
| `ce-quon-ne-dit-pas-par-sms-horizontal.mp4` | 1920 × 1080 | le lecteur de l'essai, sur un ordinateur ou un téléphone couché |
| `ce-quon-ne-dit-pas-par-sms-bande-annonce.mp4` | 1080 × 1920, 30 secondes | les réseaux : tout ce qui se lit tient entre les hauteurs 269 et 1248 |
| `affiche-film-verticale.webp`, `affiche-film-horizontale.webp` | 720 × 1280, 1280 × 720 | l'image du lecteur avant la lecture (« En fait, moi… », le pouce arrêté) |
| `apercu-film.webp` | 336 × 189 | l'image de l'accueil, à côté des 2 boutons |
| `credits.txt` | texte | les crédits (images, musique, sons, polices, outils) |
| `…-vertical-version-1.mp4`, `…-horizontal-version-1.mp4`, `…-instagram-version-1.mp4` | | le premier montage (celui de l'après-midi), gardé en sauvegarde |

## Le film, plan par plan

Les instants sont dans `ctemps.py` : les images et le son y lisent les mêmes nombres.

| Temps | Plan | Ce qu'on voit | D'où vient l'image |
|---|---|---|---|
| 0 à 5,6 s | `a1` | Un téléphone à plat sur la table en bois. Il vibre 2 fois (0,80 s et 1,17 s), l'écran s'allume : 21 h 40, un message d'Élise. Seul le téléphone tremble, à peine. De 1,37 à 5,53 s (entièrement lisible de 1,77 à 5,23 s, soit 3,5 secondes) : « Pour les parents d'un enfant, d'un ado ou d'un adulte en situation de handicap. » | Image 1 de la planche d'Antonio, écran verrouillé composé ici (`fil.html`) |
| 5,6 à 14,3 s | `a2` | Le fil. « Comment va ta fille ? » « Elle va bien, merci. » Puis « En fait, moi… » : le pouce vient près d'Envoyer, s'arrête (9,9 s), redescend sur la touche d'effacement (12 s). Le champ est vide. | Fil de messages composé ici, aucun logiciel imité |
| 14,3 à 18,2 s | `a3` | Le téléphone retourné, la main au verre. Un silence, puis « Ici, on commence par vous. » | Image 2 de la planche |
| 18,2 à 34,8 s | `b1` à `b4` | L'accueil du site, « Déposer ce qui pèse », la question, ce qu'il écrit, « J'aimerais le dire à quelqu'un », puis la phrase que le site propose, de près | Captures de la version d'essai, image par image (`pres/cap_depot.js`) |
| 34,8 à 42,3 s | `c1`, `c2` | « Le lendemain ». La fiche « Les écrans », l'idée du minuteur visuel. Le minuteur jusqu'à « C'est fini. Bravo. » | Captures (`pres/cap_ecrans.js`) |
| 42,3 à 52,3 s | `c3` à `c6` | La tablette refermée (« Elle pose elle-même la tablette. »), sa main fait glisser un domino (on l'entend à 45,23 s), son père relève les yeux, elle sourit. 4 plans fixes. | Photo des dominos, agrandie 4 fois (`fixes.py`) |
| 52,3 à 55,7 s | `c7` | La goutte de « Souffler 2 minutes » finit de monter, puis redescend | Capture de l'exercice (`app-ig/`) |
| 55,7 à 59,8 s | `d1` | Bastien, à sa hauteur : il écrit, on voit la table et la roue de son fauteuil | Photo « la fiche ensemble » |
| 59,8 à 67,3 s | `d2` | « Passer le relais » (le nom de l'outil), puis l'étape « Sa parole » : il choisit « J'aime… » et écrit « J'aime prendre mon café seul, le matin. » | Captures (`cap_relais0.js`, `cap_relais.js`) |
| 67,3 à 71,5 s | `d3` | Il tend lui-même sa fiche : la feuille vient vers nous et devient nette, Bastien reste derrière, flou | La même photo, et la vraie fiche avec la mise en page d'impression du site (`cap/fiche-a5.png`) |
| 71,5 à 77,3 s | `d4` | Dimanche matin. Il boit son café, seul, près de la fenêtre | Photo « le café de Bastien » |
| 77,3 à 82,3 s | `e1` | « Un autre soir ». Le carnet de route : « Poser les mains à plat. » | Capture du vrai carnet (`cap_carnet.js`) |
| 82,3 à 86,5 s | `e2`, `e2b` | Sa main à plat sur le bois. Puis le cadrage du premier téléphone, à l'identique : cette fois c'est lui qui l'allume | Image 1 de la planche |
| 86,5 à 99,8 s | `e3` | Le fil, même cadrage qu'au début. « Tu as cinq minutes ce soir ? J'aimerais te raconter ma journée. » Le pouce s’arrête près d’Envoyer (92,9 s), puis appuie (95,667 s, image 2870). Le message reste lisible 4 secondes. | Fil composé ici |
| 99,8 à 107,3 s | `e4` | Le logo, « Parent écouté, parent éclairé », « Ici, on commence par vous. », l'adresse, « Les photos illustrent une fiction. » | Logo et polices du site |

## Deux plans qui n'existaient dans aucune image

Aucun outil de l'atelier ne crée une photo. Deux plans demandés n'existaient pas, et ont été faits avec ce qu'il y avait :

1. **Bastien tend la fiche à son oncle** (`d3`). On est à la place de l'oncle : la vraie fiche imprimée part de la main de Bastien, vient vers nous et devient nette pendant que lui devient flou. Aucune main n'est dessinée.
2. **Les 2 mains à plat sur le bois** (`e2`). La planche ne montre qu'une main, posée à plat près du téléphone : c'est elle qu'on voit.

Si Antonio fournit ces 2 images, elles prennent la place de ces plans, à la même durée (`cplans.d3`, `cplans.e2`).

## La musique et les sons

`partition.py` : la partition, écrite note par note. Ré majeur, 72 à la noire (un temps = 25 images). Un motif de 4 notes (fa dièse, la, mi, ré) dont la quatrième est gardée pour l'envoi.

1. Après la vibration, le piano joue les 3 premières notes (1,90 s, 2,73 s, 3,57 s). La quatrième ne vient pas.
2. Quand le pouce s'arrête, la pulsation entre (9,9 s) : un battement de cœur, piano grave et violoncelle pincé. Il efface : silence.
3. « Ici, on commence par vous. » : le motif revient avec les cordes. Sa quatrième note est remplacée par le si mineur de « Déposer ».
4. « Déposer » : le piano en croches. Le motif plus haut quand la phrase proposée apparaît.
5. Le lendemain : cordes pincées. Un silence pour le domino, puis les cordes enflent sur le regard, et la harpe respire avec la goutte.
6. Bastien : la couleur de sol, un violoncelle. Les cordes enflent quand la fiche passe et s'arrêtent net pour le café, où il ne reste presque rien.
7. Un autre soir : la pulsation revient sous la main, le piano en croches pendant qu'il écrit. Quand le pouce s'arrête, le cœur bat 2 fois plus vite, un tremolo, les 3 notes (93,17 s, 94,00 s, 94,83 s), et la quatrième à 95,667 s, à l'image où il appuie. Elle résonne sous le logo.

`synthe.py` : les instruments sont ceux de la banque de sons « MS Basic » de MuseScore (licence MIT), joués par tinysoundfont. La salle est calculée.
`bruits.py` : la vibration, le domino, le papier et la tasse sont calculés. D'ici, aucune banque de sons n'est joignable, et aucun enregistrement libre n'a pu être téléchargé. Si Antonio envoie un vrai enregistrement de son téléphone sur du bois, il remplace `bruits.vibreur` dans `cmixage.py`.
`cmixage.py` : le mixage, un limiteur doux, et les niveaux mesurés par passage (aussi au-dessus de 350 Hz, pour le petit haut-parleur d'un téléphone).

Personne n'a écouté ce son dans l'atelier : il est mesuré (`cmesure.py`), pas entendu.

## Refaire le film

Dans l'atelier, ces fichiers sont dans `build/film/cine/`. Ils s'appuient sur `build/film/pres/` (le premier montage) et `build/film/` (le film de 35 secondes). La version d'essai doit être servie en local sur le port 8446.

1. Captures : `node fil.js a cap/fila 262 "f1=12&n1=46&ap=69&f2=87&n2=42&ef=192&ne=25"`, `node fil.js e cap/file 400 "f1=15&n1=160&ap=275"`, `node fil.js verrou cap/verrou.png`, `node fil.js reveil cap/reveil.png`, `node cap_relais0.js`, `node cap_relais.js`, `node cap_carnet.js`. Pour la bande-annonce : `node fil.js ta cap/filta 110 "f2=8&n2=36&ef=80&ne=18"` et `node fil.js te cap/filte 110 "ap=65"`.
2. Textes : `node titres.js`. Plans fixes : `python3 fixes.py`.
3. Images : `python3 cmontage.py V tout`, `python3 cmontage.py H tout`, puis `python3 cmontage.py V joint` et `python3 cmontage.py H joint`. Un rendu prend jusqu'à 2,6 Go : pas plus de 2 à la fois, et rien d'autre de lourd en même temps (la limite de l'atelier est de 6 Go).
4. Son : `python3 cmixage.py` (`tmp/film.wav`, une image du son, les niveaux).
5. Exports : `python3 cexporte.py V`, `python3 cexporte.py H`, puis `python3 cexporte.py affiches <dossier>`.
6. Bande-annonce : `python3 cba.py image`, `python3 cba.py joint`, `python3 cba.py son`, `python3 cexporte.py BA`.
7. Contrôles : `python3 cvoir.py V sortie.jpg 640 a1:28 d3:80 …` (images du montage), `python3 crevue.py film.mp4 sortie.jpg 640 300 2870 …` (images du fichier), `python3 cmesure.py film.mp4` (l'instant de chaque son, et l'image de l'envoi).

## Dans le site

Le lecteur est dans `pparts/v2-f.js`. Sur l'accueil de l'essai, après les 3 portes : « Le film », sa durée, et 2 boutons, « Regarder avec la musique » et « Regarder en silence ». Un seul toucher sur le premier ouvre le lecteur et lance le film avec son son, dans le même geste. Ouvert par son adresse (`…/essai/#film`), le lecteur attend et propose les 2 mêmes boutons. À la fin, « Ouvrir mon espace ».
