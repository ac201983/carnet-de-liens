#!/usr/bin/env bash
# Après la mise en ligne : rejoue des parcours de parent dans de vrais navigateurs, sur la version d'essai en ligne,
# au format téléphone puis au format ordinateur.
#   outils/essais/premier-geste.js, dans Chrome :
#     1. Il est 21 h 40, un nouveau parent veut souffler immédiatement.   2. Un parent d'adulte reçoit une fiche par lien direct.
#     3. Un parent déjà venu souhaite reprendre son étape.
#   outils/essais/finition.js, dans Chrome, Firefox et WebKit (le moteur de Safari) :
#     la respiration en silence puis avec « Écouter l'étang », les sorties en cours d'exercice, la fin des 2 minutes,
#     « Prendre un instant » après la dose, la troisième entrée, « Accueil », « Reprendre mon parcours » et le sens de « Retour ».
# Le son n'est pas écouté, il est mesuré. Sur une machine sans sortie audio, un navigateur peut ne rien jouer : le test le dit alors en note.
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
# Une sortie audio factice : la machine de GitHub n'a pas de carte son, et sans sortie Firefox et WebKit peuvent refuser de jouer.
# Si elle ne s'installe pas, rien n'est bloqué : les essais disent alors en note que le son n'a pas pu être mesuré.
if sudo apt-get install -y -qq pulseaudio gstreamer1.0-pulseaudio >/tmp/essais-audio.txt 2>&1; then
  pulseaudio --start --exit-idle-time=-1 >>/tmp/essais-audio.txt 2>&1 || true
  pactl load-module module-null-sink sink_name=essai >>/tmp/essais-audio.txt 2>&1 || true
  pactl set-default-sink essai >>/tmp/essais-audio.txt 2>&1 || true
fi
tail -n 3 /tmp/essais-audio.txt 2>/dev/null || true
export PEPE_ORIGIN="${ADRESSE%/}" PEPE_BASE=/essai/ PEPE_PUBLIC="${ADRESSE%/}/essai/" PEPE_KEY=pepe-essai-v1
total=0
# un essai : son titre dans les notes, puis la commande
essai() {
  local titre="$1"; shift
  "$@" > /tmp/essai.txt 2>&1; local code=$?
  cat /tmp/essai.txt
  local bilan; bilan="$(grep -v '^\s*$' /tmp/essai.txt | tail -n 1 | sed 's/%/%25/g')"
  local notes; notes="$(grep '^  note : ' /tmp/essai.txt | head -n 8 | sed 's/%/%25/g' | tr -d '\r' | sed ':a;N;$!ba;s/\n/%0A/g')"
  if [ "$code" = 0 ]; then
    echo "::notice title=$titre::$bilan${notes:+%0A$notes}"
  else
    local echecs; echecs="$(grep 'ÉCHEC' /tmp/essai.txt | head -n 14 | sed 's/%/%25/g' | tr -d '\r' | sed ':a;N;$!ba;s/\n/%0A/g')"
    echo "::error title=$titre::$bilan%0A$echecs${notes:+%0A$notes}"
    total=1
  fi
}
essai "Essais en ligne" node premier-geste.js
essai "Finition, dans Chrome" env PEPE_NAV=chromium node finition.js
# WebKit et Firefox s'installent à part : s'ils manquent, on le dit, et les essais dans Chrome restent valables.
# WebKit est le moteur de Safari. Ce n'est pas Safari sur un iPhone : l'essai sur un vrai téléphone reste nécessaire.
if npx playwright install --with-deps webkit >>/tmp/essais-installation.txt 2>&1; then essai "Finition, dans WebKit (le moteur de Safari)" env PEPE_NAV=webkit node finition.js
else echo "::warning title=Finition, dans WebKit::WebKit n'a pas pu être installé sur la machine de GitHub. Rien n'a été rejoué dans ce navigateur."; fi
if npx playwright install --with-deps firefox >>/tmp/essais-installation.txt 2>&1; then essai "Finition, dans Firefox" env PEPE_NAV=firefox node finition.js
else echo "::warning title=Finition, dans Firefox::Firefox n'a pas pu être installé sur la machine de GitHub. Rien n'a été rejoué dans ce navigateur."; fi
exit "$total"
