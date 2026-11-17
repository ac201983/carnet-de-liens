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
find pparts site-src tests -type f ! -name '*.bak' ! -path '*/node_modules/*' -print0 | tar --null -cf - -T - | tar -xf - -C "$BRANCHE"
cp eparts/p2-content.js "$BRANCHE/eparts/"
cp outils/*.sh "$BRANCHE/outils/"
cp outils/*.py "$BRANCHE/outils/" 2>/dev/null || true
# Ce qui a servi à choisir et à préparer les cartes-images
cp -r outils/pictos "$BRANCHE/outils/" 2>/dev/null || true
# Le banc d'essai de l'eau et de la goutte
cp build/doux/lab.html build/doux/eau.js "$BRANCHE/outils/eau/" 2>/dev/null || true

echo "sources : $(find "$BRANCHE" -type f -not -path '*/.git/*' | wc -l) fichiers, $(du -sh --exclude=.git "$BRANCHE" | cut -f1)"
git -C "$BRANCHE" status --short | head -40
