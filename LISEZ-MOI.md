# Le site de parent-ecoute.ch

Cette branche contient le site « Parent Écouté, Parent Éclairé » tel qu'il est servi à l'adresse https://parent-ecoute.ch, hébergée en Suisse chez Infomaniak.

## Comment le site se met à jour

Chaque fois que cette branche change, GitHub dépose le contenu du dossier `site/` chez Infomaniak, puis vérifie que le site en ligne correspond, fichier par fichier. Le résultat se lit dans l'onglet « Actions » du dépôt, sous « Mise en ligne ».

- `site/` : les pages, telles qu'elles sont fabriquées à partir de la branche `sources`. Ne rien y modifier à la main.
- `site/version.txt` : la date de fabrication et une empreinte du contenu. Sert à vérifier que la nouvelle version est bien servie.
- `outils/reglages.env` : l'adresse du serveur, le nom du compte, le dossier du site. Aucun mot de passe.
- `outils/deposer.sh` : le dépôt, en FTP chiffré. Il ne touche pas aux fichiers d'Infomaniak (`.htaccess`, `.user.ini`, `.infomaniak-*`). Depuis le 16 novembre 2026 au soir, il ne renvoie que les fichiers qui ont changé : il relit chaque fichier par son adresse publique et le compare (les 96 photos du photolangage ne repartent donc pas à chaque fois). Un fichier arrivé incomplet est renvoyé une fois.
- `outils/a-supprimer.txt` : les seuls fichiers que le dépôt retire du serveur, nommés un par un.
- `outils/proteges.txt` : les dossiers fermés par un mot de passe chez Infomaniak (Manager, Sécurité, Protection de dossiers). Leurs fichiers sont renvoyés à chaque mise en ligne, faute de pouvoir être relus, et le contrôle vérifie qu'ils répondent bien par une demande de mot de passe. Le mot de passe n'est écrit nulle part dans le dépôt.
- `outils/htaccess-bloc.txt` : nos réglages du serveur (page 404, type du manifest et des images SVG, en-têtes de sécurité, une seule adresse en https et sans www). Le dépôt les ajoute à la fin du `.htaccess` d'Infomaniak, entre deux repères, sans toucher à ce qui précède. Si la page d'accueil ne répond plus juste après, il remet le fichier d'avant. Une copie du fichier d'origine reste sur le serveur sous le nom `.htaccess.avant-parent-ecoute`.
- `outils/verifier.sh` : le contrôle du site en ligne.
- `outils/essais-en-ligne.sh` et `outils/essais/` : quand une version d'essai est présente, des parcours de parent y sont rejoués dans de vrais navigateurs après chaque mise en ligne, au format téléphone puis ordinateur. `premier-geste.js` joue 3 parcours dans Chrome. `respiration.js` joue « Souffler 2 minutes » en silence, « Changer de respiration », puis la musique qui guide la respiration (chaque note comparée au mot affiché, jusqu'à la dernière respiration). `finition.js` joue l'instant de la dose, « Accueil » et « Retour ». `lancement.js` joue ce qu'une famille vit avec les 3 offres : la vitrine, les prix et les 2 façons de payer Le parcours, la commande en démonstration (acceptée, refusée, abandonnée, les 6 mensualités qui s'arrêtent après la sixième, l'achat retrouvé), l'outil « Passer le relais » de l'exemple jusqu'à la fiche que le proche ouvre par son lien, la question du retour, le deuxième relais, la réunion, la sauvegarde et la restauration, puis la page à transmettre et la maquette du cadeau. Il vérifie aussi que le SOS, la respiration et « Déposer » ne proposent rien à acheter, et qu'aucune requête ne part vers un autre site. Tout paiement y est simulé : aucun prestataire de paiement n'est branché. Ces 3 derniers tournent dans Chrome, WebKit (le moteur de Safari) et Firefox. Chaque navigateur a sa machine, et les 3 tournent en même temps. Les résultats sont écrits en notes sur la page de la mise en ligne. WebKit n'est pas Safari sur un iPhone : l'essai sur un vrai téléphone reste nécessaire.
- `.github/workflows/mise-en-ligne.yml` : ce qui lance ces scripts.
- `.github/workflows/essais-seuls.yml` : rejoue les mêmes essais sur la version déjà en ligne, sans rien déposer. Il se lance en poussant la branche `essais-en-ligne` (par exemple `git push origin infomaniak:essais-en-ligne`). Il sert à mettre au point les essais eux-mêmes, en 10 minutes au lieu de 25.

## La version d'essai

Le dossier `site/essai/` contient une version d'essai de l'espace, servie à https://parent-ecoute.ch/essai/. Elle sert à essayer des changements avant de les publier.

- Elle n'est jamais référencée par les moteurs de recherche (chaque page porte la consigne `noindex`), et aucune page du site public n'y mène.
- Ce qu'on y écrit est rangé à part dans le navigateur (une autre clé que celle de l'espace habituel). L'espace habituel n'est jamais modifié.
- Le tableau de bord d'Antonio n'y figure pas, parce qu'il n'y serait pas fermé par son mot de passe.
- Le dossier `site/essai/son/` contient l'ambiance de l'étang : 2 morceaux composés pour l'espace (du son calculé, sans enregistrement ni musique existante). Ils ne sont chargés que si le parent touche « Écouter l'étang » ou « Prendre un instant ».
- Tant que ce dossier existe, le reste de `site/` ne doit pas changer en même temps que lui : `outils/preparer-essai.sh` (branche `sources-essai`) le vérifie avant de copier.

## Le mot de passe

Le compte FTP utilisé est limité au dossier du site. Son mot de passe n'est écrit dans aucun fichier : il vit dans les secrets du dépôt (Settings, Secrets and variables, Actions), sous le nom `FTP_PASSWORD`. Pour le changer, on le change chez Infomaniak (page « FTP / SSH »), puis on remplace le secret.
