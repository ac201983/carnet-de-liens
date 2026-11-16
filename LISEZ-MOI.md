# Le site de parent-ecoute.ch

Cette branche contient le site « Parent Écouté, Parent Éclairé » tel qu'il est servi à l'adresse https://parent-ecoute.ch, hébergée en Suisse chez Infomaniak.

## Comment le site se met à jour

Chaque fois que cette branche change, GitHub dépose le contenu du dossier `site/` chez Infomaniak, puis vérifie que le site en ligne correspond, fichier par fichier. Le résultat se lit dans l'onglet « Actions » du dépôt, sous « Mise en ligne ».

- `site/` : les pages, telles qu'elles sont fabriquées à partir de la branche `sources`. Ne rien y modifier à la main.
- `site/version.txt` : la date de fabrication et une empreinte du contenu. Sert à vérifier que la nouvelle version est bien servie.
- `outils/reglages.env` : l'adresse du serveur, le nom du compte, le dossier du site. Aucun mot de passe.
- `outils/deposer.sh` : le dépôt, en FTP chiffré. Il ne touche pas aux fichiers d'Infomaniak (`.htaccess`, `.user.ini`, `.infomaniak-*`). Depuis le 16 novembre 2026 au soir, il ne renvoie que les fichiers qui ont changé : il relit chaque fichier par son adresse publique et le compare (les 96 photos du photolangage ne repartent donc pas à chaque fois). Un fichier arrivé incomplet est renvoyé une fois.
- `outils/a-supprimer.txt` : les seuls fichiers que le dépôt retire du serveur, nommés un par un.
- `outils/htaccess-bloc.txt` : nos réglages du serveur (page 404, type du manifest, en-têtes de sécurité, une seule adresse en https et sans www). Le dépôt les ajoute à la fin du `.htaccess` d'Infomaniak, entre deux repères, sans toucher à ce qui précède. Si la page d'accueil ne répond plus juste après, il remet le fichier d'avant. Une copie du fichier d'origine reste sur le serveur sous le nom `.htaccess.avant-parent-ecoute`.
- `outils/verifier.sh` : le contrôle du site en ligne.
- `.github/workflows/mise-en-ligne.yml` : ce qui lance les deux scripts.

## Le mot de passe

Le compte FTP utilisé est limité au dossier du site. Son mot de passe n'est écrit dans aucun fichier : il vit dans les secrets du dépôt (Settings, Secrets and variables, Actions), sous le nom `FTP_PASSWORD`. Pour le changer, on le change chez Infomaniak (page « FTP / SSH »), puis on remplace le secret.
