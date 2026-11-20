#!/usr/bin/env bash
# Copie les fichiers de fabrication dans la branche « sources », pour qu'ils ne vivent pas seulement dans un atelier.
# Il reste ensuite à enregistrer et à envoyer :  cd pub/sources && git add -A && git commit -m "…" && git push origin sources
# Rien de ce qui est copié ici n'est secret : le dépôt est public. Ne jamais y mettre de mot de passe, de clé ni de donnée personnelle.
set -euo pipefail
RACINE="${PEPE_ROOT:-/home/claude}"
BRANCHE="$RACINE/pub/sources"
test -d "$BRANCHE" || { echo "La branche sources n'est pas ouverte dans $BRANCHE" >&2; exit 1; }

cd "$RACINE"
rm -rf "$BRANCHE/pparts" "$BRANCHE/eparts" "$BRANCHE/site-src" "$BRANCHE/tests" "$BRANCHE/outils"
mkdir -p "$BRANCHE/eparts" "$BRANCHE/outils/eau"

cp build_site.py "$BRANCHE/"
find pparts site-src tests -type f ! -name '*.bak' ! -name '*.pyc' ! -path '*/node_modules/*' ! -path '*/__pycache__/*' -print0 | tar --null -cf - -T - | tar -xf - -C "$BRANCHE"
cp eparts/p2-content.js "$BRANCHE/eparts/"
cp outils/*.sh "$BRANCHE/outils/"
cp outils/*.py "$BRANCHE/outils/" 2>/dev/null || true
# Ce qui a servi à choisir et à préparer les cartes-images
cp -r outils/pictos "$BRANCHE/outils/" 2>/dev/null || true
# Le banc d'essai de l'eau et de la goutte
cp build/doux/lab.html build/doux/eau.js "$BRANCHE/outils/eau/" 2>/dev/null || true
# Ce qui a composé l'ambiance sonore de l'étang (une création originale, entièrement calculée) et ce qui la mesure
mkdir -p "$BRANCHE/outils/son"
cp outils/son/compose.py outils/son/compose2.py outils/son/analyse.py outils/son/balance.py "$BRANCHE/outils/son/" 2>/dev/null || true
# Ce qui sert à fabriquer, à regarder et à vérifier la version d'essai (dans l'atelier, ces fichiers sont dans build/essai/)
mkdir -p "$BRANCHE/outils/essai"
cp build/essai/b.sh build/essai/e.sh build/essai/tout.sh build/essai/tout2.sh build/essai/vite.sh build/essai/vite3.sh build/essai/reste.sh build/essai/vue.js build/essai/planche.py "$BRANCHE/outils/essai/" 2>/dev/null || true
# Les outils de la passe « lancement » du 19 novembre 2026 (dans l'atelier, ces fichiers sont dans build/lancement/) :
# le lien d'une fiche se relit à l'identique (codec.js), un lien d'exemple (lien-exemple.js), la fiche tient sur une feuille (page.js),
# les captures de contrôle (vues.js) et la suite complète (tout3.sh).
mkdir -p "$BRANCHE/outils/lancement"
cp build/lancement/codec.js build/lancement/lien-exemple.js build/lancement/page.js build/lancement/vues.js build/lancement/tout3.sh build/lancement/lot3.sh "$BRANCHE/outils/lancement/" 2>/dev/null || true

# Les outils de la passe « carnet et étang » du 19 novembre 2026, l'après-midi (dans l'atelier, ces fichiers sont dans build/carnet/) :
# le style du carnet et de l'étang et le script qui le pose dans la feuille de style, les captures (vitrine, passage, états de la respiration),
# et la suite d'essais de la passe.
mkdir -p "$BRANCHE/outils/carnet"
cp build/carnet/carnet.css build/carnet/poser-css.py build/carnet/voir.js build/carnet/etats.js build/carnet/passage.js build/carnet/divers.js build/carnet/lot-b.sh "$BRANCHE/outils/carnet/" 2>/dev/null || true

# Les outils de la passe « la parole du parent » du 19 novembre 2026, en fin d'après-midi (dans l'atelier, ces fichiers sont dans build/parole/) :
# le style des écrans (le sens du nom sur l'accueil, « Déposer ce qui pèse », « J'aimerais le dire à quelqu'un ») et le script qui le pose,
# les captures des 2 exemples sur téléphone, les mesures sur un petit écran, et la suite d'essais de la passe.
mkdir -p "$BRANCHE/outils/parole"
cp build/parole/parole.css build/parole/poser-css.py build/parole/voir.js build/parole/exemples.js build/parole/mesure.js build/parole/lot-p.sh "$BRANCHE/outils/parole/" 2>/dev/null || true

# Les outils de la passe « la goutte » du 19 novembre 2026, le soir (dans l'atelier, ces fichiers sont dans build/goutte/) :
# le style (logo et nom, « Souffler », « Prendre un instant », le repère des schémas, la goutte du dépôt, la feuille du relais, le reflet
# de la dose, le minuteur visuel) et le script qui le pose, l'horloge tenue à la main et ce qui filme un mouvement image par image,
# les mesures (places du repère sur les courbes, les 3 repères de la fiche à l'ouverture) et la suite d'essais de la passe.
mkdir -p "$BRANCHE/outils/goutte"
cp build/goutte/goutte.css build/goutte/poser-css.py build/goutte/horloge.js build/goutte/film.js build/goutte/clip.js build/goutte/vague-vue.js build/goutte/souffle-vue.js build/goutte/souffle-etats.js build/goutte/instant-vue.js build/goutte/fractions.js build/goutte/relais-mesure.js build/goutte/minuteur-vue.js build/goutte/vue.js build/goutte/t.sh build/goutte/lot-g.sh build/goutte/lot-g3.sh build/goutte/souffle-film.js build/goutte/livrables.js build/goutte/mes-relais-mesure.js build/goutte/lot-g4.sh build/goutte/lot-g5.sh "$BRANCHE/outils/goutte/" 2>/dev/null || true

# Les outils du film « Et vous ? » du 20 novembre 2026 (dans l'atelier, ces fichiers sont dans build/film/) :
# les 4 images de base (la planche d'Antonio, découpée), ce qui les agrandit, ce qui sépare et remet en mouvement les cercles d'eau,
# les écrans composés, la capture de la version d'essai, les titres, le montage, le son, les planches de contrôle,
# puis ce qui installe le film dans le site (le style de la commande et du lecteur, les icônes) et la suite d'essais de la passe.
# Les films eux-mêmes sont dans site-src/film/. Les images lourdes (agrandissements, captures) ne sont pas rangées : elles se refont.
mkdir -p "$BRANCHE/outils/film/src" "$BRANCHE/outils/film/sr" "$BRANCHE/outils/film/ecrans" "$BRANCHE/outils/film/titres" "$BRANCHE/outils/film/site"
cp build/film/LISEZ-MOI.md build/film/film.py build/film/ondes.py build/film/raccord.py build/film/cuisine.py build/film/ecran.py build/film/montage.py build/film/mixage.py build/film/son.py build/film/extrait.py build/film/rendre_extrait.py build/film/voir.py build/film/planche_v.py build/film/capture_app.js build/film/capture_sans_mot.js build/film/lot-f1.sh build/film/lot-f2.sh build/film/lot-f3.sh build/film/estimation-main.md build/film/h2.py build/film/doc2.py "$BRANCHE/outils/film/" 2>/dev/null || true
cp build/film/src/p1.png build/film/src/p2.png build/film/src/p3.png build/film/src/p4.png "$BRANCHE/outils/film/src/" 2>/dev/null || true
cp build/film/sr/agrandir.py "$BRANCHE/outils/film/sr/" 2>/dev/null || true
cp build/film/ecrans/ecrans.html build/film/ecrans/ecrans.js "$BRANCHE/outils/film/ecrans/" 2>/dev/null || true
cp build/film/titres/titres.html build/film/titres/titres.js build/film/titres/mot.html build/film/titres/mot.js build/film/titres/mot.json "$BRANCHE/outils/film/titres/" 2>/dev/null || true
cp build/film/site/film.css build/film/site/poser-css.py build/film/site/icones.js "$BRANCHE/outils/film/site/" 2>/dev/null || true

echo "sources : $(find "$BRANCHE" -type f -not -path '*/.git/*' | wc -l) fichiers, $(du -sh --exclude=.git "$BRANCHE" | cut -f1)"
git -C "$BRANCHE" status --short | head -40
