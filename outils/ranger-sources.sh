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

echo "sources : $(find "$BRANCHE" -type f -not -path '*/.git/*' | wc -l) fichiers, $(du -sh --exclude=.git "$BRANCHE" | cut -f1)"
git -C "$BRANCHE" status --short | head -40
