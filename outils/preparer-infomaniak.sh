#!/usr/bin/env bash
# Copie le site fabriqué pour parent-ecoute.ch dans la branche « infomaniak » et écrit version.txt.
# Il reste ensuite à enregistrer et à envoyer la branche : GitHub dépose alors le site chez Infomaniak.
#
#   1. fabriquer :  PEPE_REPO=$RACINE/infomaniak/site PEPE_CONFIG=$RACINE/site-src/config.infomaniak.json PEPE_SITE_ONLY=1 python3 build_site.py
#   2. vérifier  :  les tests, sur la version servie en local (voir LISEZ-MOI.md)
#   3. préparer  :  outils/preparer-infomaniak.sh
#   4. envoyer   :  cd pub/infomaniak && git add -A && git commit -m "…" && git push origin infomaniak
set -euo pipefail
RACINE="${PEPE_ROOT:-/home/claude}"
FABRIQUE="$RACINE/infomaniak/site"
BRANCHE="$RACINE/pub/infomaniak"

test -f "$FABRIQUE/index.html" || { echo "Pas de site fabriqué dans $FABRIQUE" >&2; exit 1; }
test -d "$BRANCHE/outils" || { echo "La branche infomaniak n'est pas ouverte dans $BRANCHE" >&2; exit 1; }

# Le .htaccess fabriqué n'est pas déposé : celui du serveur appartient à Infomaniak.
rm -rf "$BRANCHE/site"
mkdir -p "$BRANCHE/site"
cp -a "$FABRIQUE/." "$BRANCHE/site/"
rm -f "$BRANCHE/site/.htaccess"

empreinte="$(cd "$BRANCHE/site" && find . -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum | sha256sum | cut -c1-12)"
printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%MZ)" "$empreinte" > "$BRANCHE/site/version.txt"

echo "site/ : $(find "$BRANCHE/site" -type f | wc -l) fichiers, version $(cat "$BRANCHE/site/version.txt")"
git -C "$BRANCHE" status --short | head -40
