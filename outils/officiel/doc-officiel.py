# Met à jour la copie de travail du document du projet (build/essai/version-essai.md) après la publication sur le site officiel
# et le retrait de la version d'essai (26 novembre 2026).
# Les résultats en ligne sont lus dans /tmp/officiel-en-ligne.txt : 4 paragraphes séparés par une ligne vide
# (le dépôt du site, les rejeux sur le site, le retrait de l'essai, les rejeux après le retrait).
#   python3 doc-officiel.py
import shutil, sys
P = '/home/claude/build/essai/version-essai.md'
shutil.copy(P, '/tmp/version-essai.avant-officiel.md')
s = open(P, encoding='utf-8').read()
DEPOT1, REJEUX1, DEPOT2, REJEUX2 = [x.strip() for x in open('/tmp/officiel-en-ligne.txt', encoding='utf-8').read().strip().split('\n\n')[:4]]
L = s.split('\n')
assert L[0].startswith("# Parent écouté, parent éclairé : la version d'essai du 21 novembre 2026"), L[0][:80]
assert L[2].startswith("**À ouvrir sur votre téléphone : https://parent-ecoute.ch/essai/**"), L[2][:80]
assert L[4].startswith("Le site habituel, https://parent-ecoute.ch, n'a pas changé."), L[4][:80]
assert L[6].startswith("**Où on en est le 21 novembre 2026, tard le soir**"), L[6][:80]
assert L[8].startswith("## Le 21 novembre : le montage intime"), L[8][:80]

L[0] = "# Parent écouté, parent éclairé : tout est sur le site officiel depuis le 26 novembre 2026"
L[2] = "**À ouvrir sur votre téléphone : https://parent-ecoute.ch**"
L[4] = ("Depuis le 26 novembre 2026, il n'y a plus de version d'essai. Tout ce qu'elle contenait est publié sur le site officiel, https://parent-ecoute.ch, "
        "que les moteurs de recherche peuvent référencer. Les anciennes adresses qui commençaient par https://parent-ecoute.ch/essai/ renvoient vers la même page du site. "
        "Les sections plus bas ont été écrites avant ce jour : quand elles parlent de « la version d'essai », du « site habituel » qui « ne change pas » ou d'une adresse en /essai/, "
        "elles décrivent l'état d'alors. Pour ouvrir une de ces adresses aujourd'hui, il suffit d'en retirer « /essai ».")
OU = ("**Où on en est le 26 novembre 2026** : le site officiel contient le nouvel accueil, les 3 offres (L'essentiel gratuit, Le parcours à 84 CHF en une fois ou en 6 fois, "
      "Passer le relais à 49 CHF), l'outil « Passer le relais », la parole du parent, la goutte et sa respiration, le film « Ce qu'on ne dit pas par SMS » avec sa nouvelle musique, "
      "sa bande-annonce de 30 secondes et la capsule « Et vous ? ». **La commande est toujours une démonstration** : aucun prestataire de paiement n'est branché, aucun montant n'est débité, "
      "et le site se nomme lui-même « version de test » dans ses conditions. Les 8 décisions à prendre avant une vraie vente restent ouvertes. "
      "Un parent qui avait déjà écrit sur le site retrouve ses notes. Ce qu'Antonio avait écrit dans la version d'essai n'est plus affiché, mais n'est pas effacé de son téléphone. "
      "Aucune dépense extérieure.")
ANCIEN = L[6].replace("**Où on en est le 21 novembre 2026, tard le soir**", "**Où on en était le 21 novembre 2026, tard le soir**", 1)

ENVOI1, EXEC1, ENVOI2, EXEC2, SOURCES = [x.strip() for x in open('/tmp/officiel-envois.txt', encoding='utf-8').read().split()[:5]]
ATELIER = """- Le film et la capsule : 172 vérifications, 0 échec, les 2 films réellement lus.
- La reprise des notes d'un parent déjà venu : 20 vérifications, 0 échec, en visitant d'abord l'ancien site lui-même, puis le nouveau à la même adresse. Et 18 sur 18 avec ses notes enregistrées, comme en ligne.
- Les 3 offres, la commande en démonstration et « Passer le relais » : 377 vérifications, 0 échec.
- Les parcours de bout en bout : 144, 45, 255, 38, 34 et 29 vérifications (e2e, accueil, parcours, refonte, final, format ordinateur), 0 échec.
- Les 3 parcours du premier geste : 140, 0 échec. La finition : 112, 0 échec. La respiration et sa musique : 140, 0 échec.
- Les liens : 241 adresses internes, 0 en défaut. Les textes : 2 807 lus, 0 tournure à reprendre. Les zones à toucher : 0 sous 44 points sur 255 écrans, 0 texte sous 12,5 points.
- Les 4 passes de regard sur tous les écrans ont tourné le 22 novembre sur le site fabriqué cette nuit-là : aucune largeur de 320 à 1920 points ne défile de côté (253 à 255 écrans), 0 règle d'accessibilité en défaut aux 2 formats, 0 contraste sous le seuil aux 3 passages (téléphone le soir, téléphone le jour, ordinateur), les effets passent sur 255 écrans. Elles n'ont pas été rejouées le 26 : le site publié ne diffère de celui-là que par la date de ses pages de texte, le nom de la copie de sécurité des notes et une limite de taille sur cette copie."""

SECTION = f"""## Le 26 novembre : tout l'essai est publié sur le site officiel, et l'essai est retiré

Le 22 novembre à 1 h 00, Antonio a écrit : « Tu peux mettre en ligne tous ce qu'on a créer sur le site officiel ? Et supprimer le site d'essai ? ». Tout a été préparé cette nuit-là, mais la session de travail s'est arrêtée pendant les derniers essais, avant la publication : rien n'a été mis en ligne, et Antonio n'a reçu aucun compte rendu. Il a renvoyé le même message le 26 novembre à 11 h 19. La publication a été faite ce jour-là.

Cette demande remplace 2 règles tenues jusque-là : « le site habituel ne change pas » et « le film n'est publié que dans la version d'essai ».

### Les adresses

- Le site : https://parent-ecoute.ch
- Le film de présentation : https://parent-ecoute.ch/#film
- La capsule de respiration : https://parent-ecoute.ch/#capsule
- Les 3 offres : https://parent-ecoute.ch/#formules
- L'outil « Passer le relais » : https://parent-ecoute.ch/#relais
- L'essai d'une étape : https://parent-ecoute.ch/#apercu
- Les situations : https://parent-ecoute.ch/fiches/
- La page à transmettre à une famille : https://parent-ecoute.ch/transmettre/
- La bande-annonce verticale de 30 secondes, à télécharger : https://parent-ecoute.ch/film/ce-quon-ne-dit-pas-par-sms-bande-annonce.mp4
- La capsule pour Instagram, à télécharger : https://parent-ecoute.ch/film/et-vous-instagram.mp4
- Les crédits du film : https://parent-ecoute.ch/film/credits.txt
- L'Espace Antonio, fermé par son mot de passe : https://parent-ecoute.ch/antonio/

### Les 2 choix faits sans réponse d'Antonio

Ils ont été annoncés le 22 novembre puis le 26, « sauf avis contraire ». Antonio peut les changer.

1. **La commande reste la démonstration de l'essai.** Le parent choisit une offre, simule un paiement accepté ou refusé, et l'offre s'ouvre sans rien débiter. Le site officiel fonctionnait déjà ainsi avant : ses 2 anciennes formules s'activaient « sans paiement dans cette version de test ». L'autre possibilité serait de fermer les offres payantes et de ne laisser que « Me prévenir à l'ouverture ».
2. **Les anciennes adresses de l'essai renvoient vers le site**, page pour page, pour que les liens déjà envoyés continuent de s'ouvrir : une fiche, une fiche de relais, le film. Le renvoi est provisoire (code 302), pour qu'aucun navigateur ne le retienne si une version d'essai revenait un jour à cette adresse.

### Ce que deviennent les notes

- **Un parent qui avait écrit sur le site officiel avant le 26 novembre retrouve tout** : son prénom, ses dépôts, son carnet, ses étapes, ses humeurs. S'il avait choisi une ancienne formule, le parcours reste ouvert pour lui. Avant de convertir ses notes, le site en garde une copie telle quelle sur son appareil pendant 30 jours (`pepe-v1-avant-2026-11-26`). « Tout effacer et recommencer » efface aussi cette copie.
- **Ce qu'Antonio avait écrit dans la version d'essai** était rangé à part sur son téléphone (`pepe-essai-v1`). Ces notes ne sont plus affichées, parce que le site officiel garde les siennes. Elles ne sont pas effacées. Elles peuvent être ramenées sur le site s'il le demande, tant qu'il n'a pas vidé les données de son navigateur.

### Ce qui n'est pas publié sur le site

- Les anciens montages du film, gardés dans l'essai pour comparer (10 fichiers `…-version-1.mp4` et `…-version-2.mp4`), et l'extrait de 5 secondes. Ils restent dans l'atelier (`site-src/film/`).
- Les aides propres à l'essai : la phrase « Vous êtes sur une version d'essai », la carte « Version d'essai » de « Moi » avec les 3 mesures du lancement, « Ouvrir ici une copie de mes notes », « Revoir la version d'essai depuis le début ». Les 3 mesures sont toujours notées sur l'appareil du parent, sans être affichées ni envoyées.

### Ce qui a changé dans le site pour cela

- Les pages « Conditions » et « Confidentialité » n'ont plus qu'une version : les 3 offres, la commande en démonstration, les fiches de relais portées par le lien, le fichier de sauvegarde, et ce qui changera à l'ouverture de la vente. Les passages sur les anciennes formules à 14 et 49 CHF par mois sont retirés. Elles portent la date du 26 novembre 2026.
- Les 2 boutons de « Moi » qui servent à la démonstration existent aussi sur le site : « Simuler la mensualité suivante » et « Annuler mes achats de démonstration ».
- Les crédits du film ne gardent que ce qui concerne le film publié. La ligne du piano y est toujours, et doit accompagner le film partout où il est publié : « Piano : Salamander Grand Piano V3, Alexander Holm, licence CC BY 3.0 ».
- L'Espace Antonio n'a pas été touché. **Il parle encore des abonnés « Avec Antonio »**, une formule qui n'existe plus : à revoir ou à retirer.

### Ce qui a été vérifié

Dans l'atelier, sur le site fabriqué pour la publication (299 fichiers, 115 Mo) :

{ATELIER}

La répétition des 2 mises en ligne, sur une machine de l'atelier, avec les vrais outils et un faux serveur :

- Première mise en ligne : le nouveau site est déposé, les 304 fichiers de l'essai restent intacts, les réglages du serveur ne bougent pas, aucun fichier ne disparaît.
- Seconde mise en ligne : les 304 fichiers et les 35 dossiers de l'essai sont retirés, le reste du serveur est identique au site, les anciennes adresses renvoient vers la bonne page.

En ligne, la publication du site :

{DEPOT1}

{REJEUX1}

En ligne, le retrait de l'essai :

{DEPOT2}

{REJEUX2}

### Ce qui n'a pas été vérifié

- Rien n'a été essayé sur un vrai iPhone ni dans Safari. WebKit, le moteur de Safari, a rejoué les parcours sur une machine de GitHub : ce n'est pas un iPhone.
- Le son du film et de la respiration est mesuré, il n'est pas écouté.
- Le retour d'un vrai parent qui avait des notes sur l'ancien site : la reprise a été jouée avec un parent inventé, d'abord sur l'ancien site lui-même dans l'atelier, puis en ligne avec ses notes enregistrées.
- Les textes qu'Antonio n'avait pas encore validés sont partis tels quels.

### Ce qu'Antonio doit encore dire

1. La commande : garder la démonstration, ou fermer les offres payantes et ne laisser que « Me prévenir à l'ouverture » ?
2. Ses notes de la version d'essai : les ramener sur le site officiel, ou les laisser ?
3. L'Espace Antonio parle encore de la formule « Avec Antonio » : le revoir ou le retirer ?
4. Les 3 questions du 21 novembre sur la musique du film restent ouvertes (la musique fait-elle rêver, les tapotements sont-ils au bon niveau, la ligne de crédit du piano convient-elle).

### Revenir en arrière

La branche `avant-publication-2026-11-22` garde le site et l'essai tels qu'ils étaient en ligne du 21 au 26 novembre 2026. Pour y revenir, il faut remettre son dossier `site/` dans la branche `infomaniak` et retirer la règle de renvoi de `outils/htaccess-bloc.txt`. Attention : l'ancien site ne sait pas lire les notes déjà converties par le nouveau. La copie gardée 30 jours sur l'appareil du parent sert à cela.

### Essayer un changement avant de le publier, désormais

Il n'y a plus d'adresse d'essai. Les essais se font dans l'atelier (`bash build/essai/b.sh`, puis `bash build/officiel/lot-o.sh`). Si une version d'essai en ligne redevient utile, elle se refabrique avec `site-src/config.essai.json` et `outils/preparer-essai.sh`, à condition de retirer d'abord la règle de renvoi de `outils/htaccess-bloc.txt` et les lignes de l'essai de `outils/a-supprimer.txt`.
"""

L[6:8] = [OU, '', ANCIEN, '', SECTION.rstrip('\n'), '']
s = '\n'.join(L)


def remplace(a, b, n=1):
    global s
    if s.count(a) != n:
        sys.exit('introuvable ou en double (%d) : %s' % (s.count(a), a[:70]))
    s = s.replace(a, b)


# L'aide-mémoire
L = s.split('\n')


def ligne(debut, texte=None, avant=None, apres=None):
    """Remplace (texte), fait précéder (avant) ou fait suivre (apres) la seule ligne qui commence par « debut »."""
    i = [k for k, l in enumerate(L) if l.startswith(debut)]
    if len(i) != 1:
        sys.exit('ligne introuvable ou en double (%d) : %s' % (len(i), debut[:70]))
    k = i[0]
    if texte is not None:
        L[k] = texte
    if avant is not None:
        L[k] = avant + L[k]
    if apres is not None:
        L[k] = L[k] + apres


k = L.index("## Aide-mémoire pour reprendre le travail")
L[k + 2:k + 2] = [
    f"- 26 novembre, la publication de tout l'essai sur le site officiel, puis le retrait de l'essai : envois `{ENVOI1}` (le site, exécution {EXEC1}) puis `{ENVOI2}` (le retrait et le renvoi, exécution {EXEC2}) sur la branche `infomaniak`, envoi `{SOURCES}` sur `sources-essai` et sur `sources`, qui sont désormais au même point. "
    "L'atelier de la passe est `build/officiel/` (voir son `LISEZ-MOI.md`, rangé dans `outils/officiel/` des sources) : `lot-o.sh` (la suite sur le site fabriqué), `repet/` (la répétition d'une mise en ligne sur un faux serveur FTP et HTTPS, avec les vrais outils), `doc-officiel.py`. "
    "Dans le site : `V_NOM`, `POUR_DEMO`, `VENTE_DEMO` (`pparts/v2-b.js`), `KEY_AVANT` et `gardeAvant` (`pparts/v2-a.js`). Essais nouveaux : `tests/reprise.js` avec `tests/reprise-notes.json`, `tests/ancien-essai.js`. "
    "`outils/deposer.sh` retire en une seule connexion les fichiers nommés dans `outils/a-supprimer.txt`, et les dossiers nommés avec une barre finale une fois vides. "
    "La préparation datait de la nuit du 22 novembre, où la session s'est arrêtée avant de publier : après un arrêt, toujours regarder en ligne (`gh api …/commits?sha=infomaniak`) avant de croire le journal.",
    "- Ne jamais modifier un fichier `.sh` pendant qu'il tourne : l'interpréteur le lit au fur et à mesure et reprendrait au mauvais endroit. Et ne pas écrire `tests/serve.js` dans une commande qui lance `/tmp/relance-serveurs.sh` : ce script arrête tout ce qui porte ce nom, la commande comprise.",
]
ligne("- Si la version d'essai est publiée un jour sur le site habituel :",
      texte="- La version d'essai a été publiée sur le site officiel le 26 novembre 2026. Les pages de texte n'ont plus de passages entre repères `<!--SITE-->` ou `<!--ESSAI-->` : il n'y a plus qu'un texte (la fabrication sait toujours lire ces repères). "
            "Reste à faire : l'Espace Antonio parle encore des abonnés « Avec Antonio » et doit être revu ou retiré (question posée à Antonio le 26 novembre).")
ligne("- Le dépôt GitHub est `ac201983/carnet-de-liens`. La branche `infomaniak` contient le site en ligne et, dans `site/essai/`, la version d'essai",
      avant="- **Depuis le 26 novembre 2026, la branche `infomaniak` ne contient plus que le site (`site/`) : `site/essai/` n'existe plus, ni dans la branche ni sur le serveur.** La ligne suivante décrit l'état d'avant.\n")
ligne("- Fabriquer la version d'essai : `build_site.py` avec `site-src/config.essai.json`.",
      apres=" Depuis le 26 novembre 2026, plus aucune version d'essai n'est en ligne : pour en refaire une, voir « Essayer un changement avant de le publier, désormais », en haut de ce document.")
ligne("- Après chaque envoi, GitHub dépose les fichiers, relit les adresses de l'essai",
      avant="- Depuis le 26 novembre 2026, les rejeux en ligne visitent le site lui-même (`PEPE_BASE=/`, clé `pepe-v1`), avec en plus `reprise.js` et `ancien-essai.js`. La ligne suivante décrit les rejeux d'avant, sur l'essai.\n")
ligne("- Pour publier après accord : fabriquer avec `site-src/config.infomaniak.json`",
      avant="- **Fait le 26 novembre 2026** (le sort de `/essai/` : un renvoi 302 de chaque ancienne adresse vers la même page du site). Pour une prochaine publication, la marche reste la même, sans l'essai. Ancienne note : ")
L[[k for k, l in enumerate(L) if l.startswith("- **Fait le 26 novembre 2026**")][0]] = L[[k for k, l in enumerate(L) if l.startswith("- **Fait le 26 novembre 2026**")][0]].replace("Ancienne note : - Pour publier après accord", "Ancienne note : pour publier après accord", 1)
ligne("- Ne pas proposer `?nouveau` à Antonio sur le site habituel : cela efface ses notes.",
      texte="- Ne pas proposer `?nouveau` à Antonio sur le site : cela efface ses notes. Depuis le 26 novembre 2026 il n'y a plus de version d'essai : pour revoir le site comme un nouveau venu sans rien effacer, ouvrir une fenêtre de navigation privée.")
ligne("- Les blocs `<!--ESSAI-->` des pages de texte ne sont gardés que dans la version d'essai.",
      apres=" Depuis le 26 novembre 2026, les 2 pages de texte n'en contiennent plus.")
s = '\n'.join(L)
open(P, 'w', encoding='utf-8').write(s)
print(len(s.encode('utf-8')), 'octets')
