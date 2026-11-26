# La préversion (26 novembre 2026)

Le 26 novembre 2026, à 13 h 35, Antonio demande une amélioration de fond du site, dans une préversion qu'il peut ouvrir sur son téléphone. La publication officielle attend sa validation. La première livraison est le trajet « Je découvre, j'essaie, je vois ma fiche ».

## Où elle vit

- Adresse : https://parent-ecoute.ch/preversion/ (dossier `site/preversion/` de la branche `infomaniak`).
- Réglages : `site-src/config.preversion.json`. Elle n'est pas référencée (`noindex,nofollow`), elle range ce qu'on y écrit sous son propre nom (`pepe-preversion-v1`), elle ne contient pas le tableau de bord d'Antonio, et la vente y est fermée (`"vente": "fermee"`).
- Le site officiel, à la racine de `site/`, ne change pas. `outils/preparer-preversion.sh` refuse de poser la préversion s'il voit une différence dans le site officiel, avant comme après la copie.

## La vente fermée et le réglage des essais internes

Sur le site public, les prix restent affichés. Les commandes simulées sont remplacées par « Essayer » et « Me prévenir à l'ouverture ». Le scénario de commande ne sert plus qu'aux essais.

- `VENTE` vaut `fermee` ou `demo` (réglage `vente`, `demo` par défaut comme avant).
- Quand la fabrication l'autorise (`"interne": true`), un onglet peut allumer la commande de démonstration : `sessionStorage['pepe-interne'] = '1'`, ou l'adresse `…/#interne` (et `…/#public` pour l'éteindre). `tests/interne.js`, chargé avant un essai, le fait pour chaque onglet ouvert.
- Dans le code : `venteDemo()` dit si la commande de démonstration existe, `demoPaie()` donne la phrase à afficher, `prevenirBtn()` le bouton « Me prévenir à l'ouverture ».
- Quand la vente est fermée, 4 phrases des conditions générales et 3 de la politique de confidentialité sont remplacées à la fabrication (`VENTE_FERMEE` dans `build_site.py`). Elles sont à relire par Antonio avant la publication officielle.

## Ce qui a changé dans l'espace

- L'accueil : le public est nommé (enfant, ado, adulte), l'accroche d'Antonio ouvre la page, et la question « De quoi auriez-vous besoin aujourd'hui ? » est le point d'attention, au-dessus des 3 aides. Viennent ensuite l'invitation au relais et la fiche de Bastien (à droite sur un ordinateur), puis le film. Un parent déjà entré voit « Vous revoilà » tout en haut.
- « Passer le relais » : le premier essai, « Et si vous prépariez les trois choses à savoir pour samedi ? » (une soirée, un week-end ou une réunion). Le parent écrit dans la fiche elle-même, un repère à la fois. La fiche de l'essai est une vraie fiche de l'outil, gardée comme les autres. Il la regarde ensuite à la place de son proche (`rl.e === 'recu'`), puis vient le moment des 49 CHF.
- « Aujourd'hui » : une carte ramène au brouillon de fiche.

## Fabriquer, regarder, vérifier

    bash build/preversion/p.sh                      # fabrique dans /home/claude/prev-out/preversion
    node tests/serve.js /home/claude/prev-out 8448 / /home/claude/build/cert     # sert https://localhost:8448/preversion/
    node build/preversion/voir.js https://localhost:8448/preversion 390 844 /tmp/voir/x '[["goto","/"],["shot","accueil"]]'
    bash build/preversion/t.sh trajet.js            # le trajet, comme un parent
    bash build/preversion/t.sh interne lancement.js # un essai d'avant, avec le réglage des essais internes
    bash build/preversion/lot-p.sh                  # tout

- `tests/trajet.js` : le trajet sur 2 téléphones (375 et 390 points) et un ordinateur, la situation inventée, la réunion, le clavier seul, les animations réduites, le texte agrandi (260 points de large, un téléphone réglé à 150 %), puis, avec le réglage interne, la preuve que la fiche vue par le parent est celle que le proche ouvre par le lien.
- `tests/walk-trajet.js` : les mêmes écrans, un par un, pour les balayages (`PEPE_WALK=trajet`) : débordement, cibles à toucher, axe, contraste, effets, tournures.
- `tests/survol.js` : avec une souris, survole chaque élément qui réagit au survol (les règles `:hover` de la feuille de style), écran par écran, et relève le contraste de ses textes à ce moment-là. Les balayages du contraste mesurent les écrans au repos : un fond qui change au survol leur échappe. `node survol.js 1280`, puis `python3 contrast.py 1280` (les 2 balayages partagent le dossier `build/contrast` : ne pas les lancer en même temps).
- Dans `lot-p.sh`, la ligne que le journal garde pour un contraste est celle des textes sous le seuil, et le code de sortie dit s'il y en a. Les passes d'avant (`build/*/lot-*.sh`) gardent la ligne du bord des champs avec un code 0 : y lire le détail (`/tmp/lot-…-contraste-….txt`), pas le résumé.
- e2e, accueil, parcours, refonte et final rangent leurs notes sous le nom du site officiel : ils se rejouent sur la fabrication de travail aux réglages du site (`bash build/essai/b.sh`, puis `bash build/officiel/lot-o.sh e2e accueil parcours refonte final`). Cette fabrication de travail n'est pas publiée.

## Mettre en ligne

    bash outils/preparer-preversion.sh              # pose prev-out/preversion dans pub/infomaniak/site/preversion, et trajet.js dans outils/essais/preversion
    bash build/aboutie/scan.sh <dossier>            # doit répondre 0 0
    # puis enregistrer et pousser la branche infomaniak

Après le dépôt, `outils/verifier.sh` contrôle la préversion en ligne (consigne, rangement à part, vente fermée, pas de tableau de bord), et `outils/essais-en-ligne.sh` y rejoue `trajet.js` dans Chrome, WebKit et Firefox. Quand seule la préversion change, les parcours du site officiel ne sont pas rejoués.

## La première livraison, en ligne (26 novembre 2026, 15 h 40)

- Envoi `d8aef65` sur la branche `infomaniak`. Dépôt : 296 fichiers déposés, rien de retiré. Contrôle : 590 fichiers sur 592 identiques à ceux du dépôt, aucun différent (les 2 autres sont ceux de l'Espace Antonio, fermé par son mot de passe). Le site officiel n'a pas changé.
- `trajet.js` rejoué sur la préversion en ligne : 216 vérifications, 0 échec, dans Chrome, dans Firefox et dans WebKit.
- **Une correction après la livraison** (envoi `d339084`, 16 h 54, en ligne à 17 h 05). Sur un ordinateur, quand la souris passait sur la fiche de Bastien, le lien « Voir la fiche de Bastien en entier » devenait illisible (vert sur vert) : une ancienne règle de survol fonçait le fond d'un bouton que cette passe a changé en lien. Rien ne se voyait sur un téléphone. Le balayage du contraste du soir l'a montré par hasard, parce que la souris de l'essai se trouvait sur la fiche, et le résumé de la passe l'avait masqué (voir plus haut). Le lien n'a plus de fond, son trait s'épaissit au survol. `trajet.js` le vérifie (219 vérifications, rejouées en ligne dans Chrome, Firefox et WebKit), et `tests/survol.js` survole désormais chaque élément qui réagit à la souris.
- Toute la passe a été rejouée sur cette fabrication finale (voir le journal, `build/aboutie/JOURNAL.md`). Plusieurs balayages annoncés à 16 h 07 dataient d'une fabrication antérieure d'une heure.
- À valider sur un vrai téléphone, parce que l'atelier n'en a pas : le clavier qui reste ouvert d'un repère au suivant, « Me prévenir à l'ouverture » qui ouvre la messagerie, les 3 aides dans le premier écran de Safari, le bandeau « Vous êtes à la place de… » qui reste en haut.
- Tant qu'Antonio n'a pas validé, rien de cette passe ne va à la racine du site. Les fichiers de fabrication de cette passe sont rangés dans la branche `sources-essai`. La branche `sources` garde ceux du site en ligne (les mêmes qu'à l'envoi `872b83d`) : une correction urgente du site officiel repart d'elle.

## Ce qui reste à faire après la première livraison

- Livraison 2 : la semaine vécue du parcours (84 CHF), l'accueil en 5 moments, les 2 pièces de la même maison (boutons, titres, retours, vocabulaire).
- Livraison 3 : l'ouverture commerciale (formulaire « Me prévenir » si l'hébergement le permet, première vente en mode test, achat retrouvé), les notes de l'ancien essai (`pepe-essai-v1`), l'Espace Antonio, le test avec 5 parents, la mesure.
