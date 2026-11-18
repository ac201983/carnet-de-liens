#!/usr/bin/env bash
# Après la mise en ligne : rejoue 3 parcours de parent dans un vrai navigateur, sur la version d'essai en ligne,
# au format téléphone puis au format ordinateur (outils/essais/premier-geste.js).
#   1. Il est 21 h 40, un nouveau parent veut souffler immédiatement.
#   2. Un parent d'adulte reçoit une fiche par lien direct.
#   3. Un parent déjà venu souhaite reprendre son étape.
# Le résultat est écrit en notes, visibles sur la page de la mise en ligne dans GitHub. Sans dossier site/essai/, il n'y a rien à essayer.
# Ce script ne reçoit aucun mot de passe et ne dépose rien : il ne fait que visiter le site, comme un parent.
set -uo pipefail
cd "$(dirname "$0")/.."
. outils/reglages.env
if [ ! -f site/essai/index.html ]; then
  echo "::notice title=Essais en ligne::Pas de version d'essai dans cette mise en ligne : rien à rejouer."
  exit 0
fi
cd outils/essais
if ! { npm init -y >/dev/null 2>&1 && npm install --no-audit --no-fund "playwright@$(cat version-playwright.txt)" >/tmp/essais-installation.txt 2>&1 && npx playwright install --with-deps chromium >>/tmp/essais-installation.txt 2>&1; }; then
  echo "::warning title=Essais en ligne::Le navigateur d'essai n'a pas pu être installé sur la machine de GitHub. Les parcours n'ont pas été rejoués en ligne."
  tail -n 5 /tmp/essais-installation.txt
  exit 0
fi
PEPE_ORIGIN="${ADRESSE%/}" PEPE_BASE=/essai/ PEPE_PUBLIC="${ADRESSE%/}/essai/" PEPE_KEY=pepe-essai-v1 node premier-geste.js > /tmp/essais.txt 2>&1
code=$?
cat /tmp/essais.txt
bilan="$(tail -n 1 /tmp/essais.txt | sed 's/%/%25/g')"
if [ "$code" = 0 ]; then
  echo "::notice title=Essais en ligne::$bilan"
else
  echecs="$(grep 'ÉCHEC' /tmp/essais.txt | head -n 12 | sed 's/%/%25/g' | tr -d '\r' | sed ':a;N;$!ba;s/\n/%0A/g')"
  echo "::error title=Essais en ligne::$bilan%0A$echecs"
fi
exit "$code"
