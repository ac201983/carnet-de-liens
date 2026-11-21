# « Ce qu'on ne dit pas par SMS » : le montage intime (21 novembre 2026)

Demande d'Antonio du 21 novembre à 11 h 28 (pièce jointe `fea93ff6-attachment.txt`, 3 images). Remonter le film de 1 min 47 dans la version d'essai : un court métrage intime,
sans voix off, musique originale plus mélancolique et sentimentale, construit autour de 2 SMS. Atelier : `build/film/intime/` (s'appuie sur `build/film/cine/` et `build/film/pres/`).

## Le minutage (30 images par seconde, 3220 images = 107,33 s) : `itemps.py`
- A, 0 à 13,5 s : a1 la table (la pièce seule, 2 vibrations à 1,0 et 1,4 s, l'écran s'allume), a2 le fil (« Elle va bien, merci. », envoyé), a3 sa main immobile
  (première note de piano à 7,5 s, puis la ligne du public entière 5 s). Plus de « En fait, moi… ».
- B, 13,5 à 40,5 s : b1 « Déposer ce qui pèse » (« Ça me manque de jouer avec elle. »), b2 le carnet (« Poser les mains à plat. », daté d'avant le 19 novembre),
  b3 ses 2 mains (image 06, la cuisine du soir, même pull), b4 « Le lendemain » et le minuteur un instant, b5 la tablette écartée, b6 les dominos entre eux (le domino touche le bois),
  b7 le père relève les yeux, b8 elle le regarde (le violoncelle entre), b9 sa main près des dominos.
- C, 40,5 à 66 s : c1 la main de Bastien sur son stylo (raccord avec b9), le cadre s'élargit, « Bastien prépare son week-end chez son oncle Rémi. », c2 « Passer le relais »,
  c3 Bastien à hauteur de regard, c4 il choisit « J'aime… » et écrit sa phrase, c5 sa fiche.
- D, 66 à 86 s : d1 il tend la feuille pliée à Rémi (image 04 ; vertical : le cadre va de Bastien à Rémi), le café qu'on verse s'entend avant la coupe,
  d2 dimanche matin, d3 plus près, l'ambiance seule.
- E, 86 à 107,33 s : e1 le cadrage de la première scène (le téléphone montre la conversation), e2 il écrit, le pouce touche Envoyer à 97,0 s (image 2910) : la quatrième note,
  e3 la signature.

## La musique : `ipartition.py`
Piano feutré, 60 battements par minute (1 battement = 30 images). Motif de 3 notes qui attend la quatrième. Le violoncelle entre à b8 (36,4 s), reprend le motif un peu plus haut,
s'efface quand Rémi reçoit la fiche (d1). Silence musical sur le café. La quatrième note à l'image 2910.

## Les images
- 04-la-fiche-tendue (Bastien et Rémi) : d1. 06-les-mains-cuisine : b3. 05-les-mains (manches sombres, autre table) : non placée, dit à Antonio.
- La vibration est recréée (aucun enregistrement réel joignable) : à dire à la livraison.

## Livraison
Film vertical, film horizontal, bande-annonce verticale de 30 s (uniquement la fiche de Bastien, jusqu'au café). Dans /essai/, garder les 2 boutons. Garder le montage précédent
sous `…-version-2.mp4`. Vérifier que les 2 histoires se comprennent en silence.
