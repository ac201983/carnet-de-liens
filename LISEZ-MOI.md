# Le site de parent-ecoute.ch

Cette branche contient le site « Parent Écouté, Parent Éclairé » tel qu'il est servi à l'adresse https://parent-ecoute.ch, hébergée en Suisse chez Infomaniak.

## Comment le site se met à jour

Chaque fois que cette branche change, GitHub dépose le contenu du dossier `site/` chez Infomaniak, puis vérifie que le site en ligne correspond, fichier par fichier. Le résultat se lit dans l'onglet « Actions » du dépôt, sous « Mise en ligne ».

- `site/` : les pages, telles qu'elles sont fabriquées à partir de la branche `sources`. Ne rien y modifier à la main.
- `site/version.txt` : la date de fabrication et une empreinte du contenu. Sert à vérifier que la nouvelle version est bien servie.
- `outils/reglages.env` : l'adresse du serveur, le nom du compte, le dossier du site. Aucun mot de passe.
- `outils/deposer.sh` : le dépôt, en FTP chiffré. Il ne touche pas aux fichiers d'Infomaniak (`.htaccess`, `.user.ini`, `.infomaniak-*`). Depuis le 16 novembre 2026 au soir, il ne renvoie que les fichiers qui ont changé : il relit chaque fichier par son adresse publique et le compare (les 96 photos du photolangage ne repartent donc pas à chaque fois). Un fichier arrivé incomplet est renvoyé une fois.
- `outils/a-supprimer.txt` : ce que le dépôt retire du serveur, et rien d'autre. Des fichiers, nommés un par un, et des dossiers (un nom terminé par une barre), qui ne sont retirés qu'une fois vides : c'est le serveur lui-même qui refuse de retirer un dossier où il reste quelque chose. Tout part dans une seule connexion, et chaque nom est relu par son adresse avant et après.
- `outils/proteges.txt` : les dossiers fermés par un mot de passe chez Infomaniak (Manager, Sécurité, Protection de dossiers). Leurs fichiers sont renvoyés à chaque mise en ligne, faute de pouvoir être relus, et le contrôle vérifie qu'ils répondent bien par une demande de mot de passe. Le mot de passe n'est écrit nulle part dans le dépôt.
- `outils/htaccess-bloc.txt` : nos réglages du serveur (page 404, type du manifest et des images SVG, en-têtes de sécurité, une seule adresse en https et sans www). Le dépôt les ajoute à la fin du `.htaccess` d'Infomaniak, entre deux repères, sans toucher à ce qui précède. Si la page d'accueil ne répond plus juste après, il remet le fichier d'avant. Une copie du fichier d'origine reste sur le serveur sous le nom `.htaccess.avant-parent-ecoute`.
- `outils/verifier.sh` : le contrôle du site en ligne.
- `outils/essais-en-ligne.sh` et `outils/essais/` : après chaque mise en ligne, des parcours de parent sont rejoués sur le site en ligne dans de vrais navigateurs, au format téléphone puis ordinateur. `premier-geste.js` joue 3 parcours dans Chrome. `respiration.js` joue « Souffler 2 minutes » en silence, « Changer de respiration », puis la musique qui guide la respiration (chaque note comparée au mot affiché, jusqu'à la dernière respiration). `finition.js` joue l'instant de la dose, « Accueil » et « Retour ». `lancement.js` joue ce qu'une famille vit avec les 3 offres : la vitrine, les prix et les 2 façons de payer Le parcours, la commande en démonstration (acceptée, refusée, abandonnée, les 6 mensualités qui s'arrêtent après la sixième, l'achat retrouvé), l'outil « Passer le relais » de l'exemple jusqu'à la fiche que le proche ouvre par son lien, la question du retour, le deuxième relais, la réunion, la sauvegarde et la restauration, puis la page à transmettre et la maquette du cadeau. Il vérifie aussi que le SOS, la respiration et « Déposer » ne proposent rien à acheter, et qu'aucune requête ne part vers un autre site. Tout paiement y est simulé : aucun prestataire de paiement n'est branché. `film.js` joue le film de présentation « Ce qu'on ne dit pas par SMS » et la capsule « Et vous ? » : rien du film n'est chargé à l'arrivée à part sa petite image, la commande vient après les 3 portes, le MP4 se lit réellement (le vertical au format téléphone, l'horizontal au format ordinateur), le film démarre en silence avec le bouton « Activer le son » bien visible, les commandes répondent (lire, pause, son, fermer), le lecteur rouvert repart en silence, et la fermeture ou le retour arrière rendent l'accueil à la même place. Tant que le film est en attente (réglage `pret`), `film.js` est le seul essai rejoué. `reprise.js` ouvre le site avec les notes d'un parent venu avant le 26 novembre 2026, telles que l'ancien site les rangeait (un parent inventé, dans `reprise-notes.json`), et vérifie qu'il retrouve tout. `ancien-essai.js` ouvre les anciennes adresses de la version d'essai et vérifie qu'elles mènent à la même page du site. Tous ces essais sauf le premier tournent dans Chrome, WebKit (le moteur de Safari) et Firefox. Chaque navigateur a sa machine, et les 3 tournent en même temps. Les résultats sont écrits en notes sur la page de la mise en ligne. WebKit n'est pas Safari sur un iPhone : l'essai sur un vrai téléphone reste nécessaire.
- `.github/workflows/mise-en-ligne.yml` : ce qui lance ces scripts.
- `.github/workflows/essais-seuls.yml` : rejoue les mêmes essais sur le site déjà en ligne, sans rien déposer. Il se lance en poussant la branche `essais-en-ligne` (par exemple `git push origin infomaniak:essais-en-ligne`). Il sert à mettre au point les essais eux-mêmes.

## L'ancienne version d'essai

Jusqu'au 25 novembre 2026, le dossier `site/essai/` contenait une version d'essai de l'espace, servie à https://parent-ecoute.ch/essai/. Elle servait à essayer des changements avant de les publier : les 3 offres, « Passer le relais », la parole du parent, la goutte et sa respiration, le film « Ce qu'on ne dit pas par SMS » et la capsule « Et vous ? ».

Le 26 novembre 2026, à la demande d'Antonio, tout ce qu'elle contenait a été publié sur le site lui-même, et la version d'essai a été retirée.

- Le dossier `site/essai/` a quitté cette branche. Ses fichiers sont retirés du serveur par `outils/a-supprimer.txt`, après que le site a été vérifié en ligne.
- Ses anciennes adresses renvoient vers la même page du site (`outils/htaccess-bloc.txt`), pour que les liens déjà envoyés continuent de s'ouvrir : une fiche, une fiche de relais, le film.
- Ce qu'un parent avait écrit dans la version d'essai était rangé à part dans son navigateur. Ces notes n'y sont pas effacées, mais le site ne les affiche pas : il garde les siennes.
- Ce qu'un parent avait écrit sur le site avant ce jour est repris tel quel. Une copie de ses anciennes notes reste 30 jours sur son appareil, par sécurité.
- Les anciens montages du film, gardés dans l'essai pour comparer, ne sont pas publiés sur le site. Ils restent dans l'atelier.
- La commande reste une démonstration : aucun prestataire de paiement n'est branché, aucun montant n'est débité, et les pages du site le disent.
- Pour revenir en arrière, la branche `avant-publication-2026-11-22` garde le site et l'essai tels qu'ils étaient en ligne du 21 au 26 novembre 2026.

## Le mot de passe

Le compte FTP utilisé est limité au dossier du site. Son mot de passe n'est écrit dans aucun fichier : il vit dans les secrets du dépôt (Settings, Secrets and variables, Actions), sous le nom `FTP_PASSWORD`. Pour le changer, on le change chez Infomaniak (page « FTP / SSH »), puis on remplace le secret.
