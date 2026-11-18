#!/usr/bin/env bash
# Copie la version d'essai dans la branche « infomaniak », sous site/essai/, sans toucher au reste de site/.
# Elle sera servie à https://parent-ecoute.ch/essai/ : une adresse à part, jamais référencée, avec ses propres notes dans le navigateur.
# Le site public (tout ce qui est dans site/ hors de essai/) ne doit pas changer : ce script refuse de continuer si c'est le cas.
#
#   1. fabriquer :  PEPE_REPO=$RACINE/essai-out PEPE_CONFIG=$RACINE/site-src/config.essai.json PEPE_SITE_ONLY=1 python3 build_site.py
#   2. vérifier  :  les tests, sur la version servie en local (tests/premier-geste.js, tests/essai.js)
#   3. préparer  :  outils/preparer-essai.sh
#   4. envoyer   :  cd pub/infomaniak && git add -A && git commit -m "…" && git push origin infomaniak
set -euo pipefail
RACINE="${PEPE_ROOT:-/home/claude}"
FABRIQUE="$RACINE/essai-out/essai"
BRANCHE="$RACINE/pub/infomaniak"

test -f "$FABRIQUE/index.html" || { echo "Pas de version d'essai fabriquée dans $FABRIQUE" >&2; exit 1; }
test -d "$BRANCHE/site" || { echo "La branche infomaniak n'est pas ouverte dans $BRANCHE" >&2; exit 1; }
grep -q 'content="noindex,nofollow"' "$FABRIQUE/index.html" || { echo "La version d'essai doit porter la consigne noindex" >&2; exit 1; }
test ! -e "$FABRIQUE/antonio" || { echo "La version d'essai ne doit pas contenir l'Espace Antonio (il n'y serait pas fermé par son mot de passe)" >&2; exit 1; }
if ! git -C "$BRANCHE" diff --quiet HEAD -- site ':(exclude)site/essai' ':(exclude)site/version.txt'; then
  echo "site/ a changé en dehors de essai/ : le site public ne doit pas bouger avec la version d'essai" >&2; exit 1
fi

rm -rf "$BRANCHE/site/essai"
mkdir -p "$BRANCHE/site/essai"
cp -a "$FABRIQUE/." "$BRANCHE/site/essai/"
rm -f "$BRANCHE/site/essai/.htaccess"

# version.txt reste celui du site entier : la mise en ligne attend de le voir changer avant de contrôler.
empreinte="$(cd "$BRANCHE/site" && find . -type f ! -name version.txt -print0 | LC_ALL=C sort -z | xargs -0 sha256sum | sha256sum | cut -c1-12)"
printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%MZ)" "$empreinte" > "$BRANCHE/site/version.txt"

echo "site/essai/ : $(find "$BRANCHE/site/essai" -type f | wc -l) fichiers, $(du -sh "$BRANCHE/site/essai" | cut -f1). version $(cat "$BRANCHE/site/version.txt")"
git -C "$BRANCHE" status --short | grep -v ' site/essai/' | head -20 || true
