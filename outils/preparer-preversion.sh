#!/usr/bin/env bash
# Pose la préversion fabriquée (/home/claude/prev-out/preversion) dans la branche de publication, à côté du site officiel :
#   /home/claude/pub/infomaniak/site/preversion/
# Le site officiel (tout ce que contient site/ en dehors de preversion/) ne doit pas changer : ce script s'arrête s'il voit la moindre différence,
# avant comme après la copie. Il copie aussi l'essai rejoué en ligne (outils/essais/preversion/trajet.js). Il ne publie rien : pousser la branche reste un geste à part.
set -euo pipefail
SRC=/home/claude/prev-out/preversion
PUB=/home/claude/pub/infomaniak
cd "$PUB"
[ "$(git rev-parse --abbrev-ref HEAD)" = infomaniak ] || { echo "ARRÊT : la branche n'est pas infomaniak."; exit 1; }
officiel() { git status --porcelain -- site ':(exclude)site/preversion' | wc -l; }
[ "$(officiel)" = 0 ] || { echo "ARRÊT : le site officiel a des changements en attente dans la branche de publication."; git status --short -- site ':(exclude)site/preversion' | head; exit 1; }
[ -f "$SRC/index.html" ] && [ -f "$SRC/app.js" ] || { echo "ARRÊT : pas de préversion fabriquée dans $SRC."; exit 1; }
grep -q 'const KEY="pepe-preversion-v1";' "$SRC/app.js" || { echo "ARRÊT : la préversion fabriquée n'a pas sa propre clé de rangement."; exit 1; }
grep -q 'const VENTE="fermee";' "$SRC/app.js" || { echo "ARRÊT : dans la préversion fabriquée, la vente n'est pas fermée."; exit 1; }
grep -q 'name="robots" content="noindex,nofollow"' "$SRC/index.html" || { echo "ARRÊT : la préversion fabriquée peut être référencée."; exit 1; }
[ ! -e "$SRC/antonio" ] || { echo "ARRÊT : la préversion fabriquée contient le tableau de bord d'Antonio, qui n'est fermé que sur le site officiel."; exit 1; }
mkdir -p outils/essais/preversion
rm -rf site/preversion
cp -a "$SRC" site/preversion
cp /home/claude/tests/trajet.js outils/essais/preversion/trajet.js
[ "$(officiel)" = 0 ] || { echo "ARRÊT : la copie a touché au site officiel."; exit 1; }
echo "préversion posée : $(find site/preversion -type f | wc -l) fichiers, $(du -sm site/preversion | cut -f1) Mo. Site officiel : inchangé ($(git ls-files site ':(exclude)site/preversion' | wc -l) fichiers suivis)."
git status --short | cut -c1-80 | awk '{print $1}' | sort | uniq -c | tr '\n' ' '; echo
