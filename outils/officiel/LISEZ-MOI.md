# La publication sur le site officiel et le retrait de la version d'essai (26 novembre 2026)

Antonio a demandé le 22 novembre 2026, puis de nouveau le 26, de publier sur https://parent-ecoute.ch tout ce que contenait la version d'essai, et de retirer l'essai. Ce dossier garde les outils de cette passe. Dans l'atelier, il s'appelle `build/officiel/`.

- `lot-o.sh` : la suite d'essais sur le site fabriqué (`dev/site`, servi sur le port 8445), le film actif à la racine. Sans nom, tout (environ 1 h 20). Avec des noms, seulement ces essais : `bash lot-o.sh film lancement`. Ne jamais modifier ce fichier pendant qu'il tourne.
- `repet/` : la répétition d'une mise en ligne sur cette machine, avant de pousser la branche `infomaniak`. Un serveur FTP chiffré (`serveur-ftp.py`, avec `pyftpdlib`) et un serveur HTTPS (`serveur-http.js`) servent le même dossier, comme le compte FTP et le site. Les vrais outils de la branche (`outils/deposer.sh`, `outils/verifier.sh`) sont joués tels quels, avec seulement d'autres réglages.
  - `bash repet/repet.sh depart` remet le faux serveur dans l'état du site en ligne avant la publication (branche `avant-publication-2026-11-22`).
  - `bash repet/repet.sh joue [dossier de la branche]` joue le dépôt puis le contrôle.
  - Le serveur HTTPS applique le renvoi des anciennes adresses de l'essai dès que le `.htaccess` déposé le porte : `tests/ancien-essai.js` peut alors être joué contre lui (`PEPE_ORIGIN=https://localhost:8449`).
- `doc-officiel.py` : la mise à jour du document du projet après la publication.

Ce qui a changé dans les sources pour cette passe :

- `build_site.py` accepte le film hors d'un essai. Les montages gardés pour comparer et l'extrait de 5 secondes ne sont copiés que dans un essai.
- `site-src/config.infomaniak.json` : `"film": "actif"`.
- `pparts/v2-b.js` : `V_NOM`, `POUR_DEMO`, `VENTE_DEMO`. `pparts/v2-a.js` : `KEY_AVANT`, `gardeAvant` (la copie de sécurité des anciennes notes, 30 jours).
- `site-src/conditions.body.html`, `site-src/confidentialite.body.html` : un seul texte, sans repères `<!--SITE-->` ni `<!--ESSAI-->`.
- `tests/reprise.js` et `tests/reprise-notes.json` (les notes d'un parent venu avant la publication), `tests/ancien-essai.js` (les anciennes adresses de l'essai), `tests/film.js` et `tests/e2e.js` adaptés.

Les 2 mises en ligne :

1. Le site reçoit la nouvelle version. `site/essai/` quitte la branche, mais ses fichiers restent sur le serveur, intacts, le temps de vérifier le site en ligne.
2. `outils/a-supprimer.txt` retire les 304 fichiers puis les 35 dossiers de l'essai, et `outils/htaccess-bloc.txt` pose le renvoi (302) de ses anciennes adresses vers la même page du site.

Pour refaire une version d'essai en ligne un jour : retirer d'abord la règle de renvoi de `outils/htaccess-bloc.txt` et les lignes de l'essai de `outils/a-supprimer.txt`, puis fabriquer avec `site-src/config.essai.json` et préparer avec `outils/preparer-essai.sh`.
