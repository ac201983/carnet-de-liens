#!/usr/bin/env bash
# Après la mise en ligne : rejoue des parcours de parent dans un vrai navigateur, sur la version d'essai en ligne,
# au format téléphone puis au format ordinateur.
#
#   outils/essais-en-ligne.sh chromium   les 3 parcours du premier geste (premier-geste.js), la respiration (respiration.js), la passe de finition (finition.js) et le chemin d'un futur client (aboutie.js), dans Chrome
#   outils/essais-en-ligne.sh webkit     la respiration, la passe de finition et le chemin d'un futur client dans WebKit, le moteur de Safari
#   outils/essais-en-ligne.sh firefox    la respiration, la passe de finition et le chemin d'un futur client dans Firefox
#
#   premier-geste.js :
#     1. Il est 21 h 40, un nouveau parent veut souffler immédiatement.   2. Un parent d'adulte reçoit une fiche par lien direct.
#     3. Un parent déjà venu souhaite reprendre son étape.
#   respiration.js :
#     la respiration en silence, « Changer de respiration » et ses 3 possibilités, puis, là où le son est mesurable, la musique :
#     chaque note comparée au mot affiché, les sorties en cours d'exercice, et les 2 minutes entières jusqu'à la dernière respiration.
#   finition.js :
#     « Prendre un instant » après la dose, la troisième entrée, « Accueil », « Reprendre mon parcours » et le sens de « Retour ».
#   aboutie.js :
#     les 3 formules, l'essai d'une étape depuis la fiche « La crise », la commande en démonstration (acceptée, refusée, abandonnée, l'arrêt),
#     l'aperçu « Avec Antonio », et l'absence de toute sollicitation commerciale dans le SOS, la respiration et « Déposer ».
#
# Le son n'est pas écouté, il est mesuré. Sur une machine sans sortie audio, un navigateur peut ne rien jouer : le test le dit alors en note.
# WebKit est le moteur de Safari. Ce n'est pas Safari sur un iPhone : l'essai sur un vrai téléphone reste nécessaire.
# Le résultat est écrit en notes, visibles sur la page de la mise en ligne dans GitHub. Sans dossier site/essai/, il n'y a rien à essayer.
# Ce script ne reçoit aucun mot de passe et ne dépose rien : il ne fait que visiter le site, comme un parent.
set -uo pipefail
cd "$(dirname "$0")/.."
. outils/reglages.env
nav="${1:-chromium}"
case "$nav" in
  chromium) nom="Chrome" ;;
  webkit) nom="WebKit (le moteur de Safari)" ;;
  firefox) nom="Firefox" ;;
  *) echo "Navigateur inconnu : $nav (chromium, webkit ou firefox)" >&2; exit 2 ;;
esac
if [ ! -f site/essai/index.html ]; then
  echo "::notice title=Essais en ligne dans $nom::Pas de version d'essai dans cette mise en ligne. Il n'y a rien à rejouer."
  exit 0
fi
cd outils/essais
etape() { echo "$(date -u +%H:%M:%S) $*"; }   # l'heure de chaque préparatif, pour voir dans le journal lequel prend du temps
# La machine de GitHub n'a pas de carte son. Chrome s'en passe : il a sa propre sortie factice, et une vraie sortie factice le bloque.
# WebKit, lui, a besoin d'une sortie pour jouer : on lui en fabrique une, avant d'installer le navigateur. Si elle ne s'installe pas,
# rien n'est bloqué, et l'essai dit en note que le son n'a pas pu être mesuré.
if [ "$nav" = webkit ]; then
  etape "sortie audio factice : installation"
  sudo apt-get update -qq >/tmp/essais-audio.txt 2>&1 || true
  if sudo DEBIAN_FRONTEND=noninteractive NEEDRESTART_MODE=a apt-get install -y -qq pulseaudio gstreamer1.0-pulseaudio >>/tmp/essais-audio.txt 2>&1; then
    pulseaudio --start --exit-idle-time=-1 >>/tmp/essais-audio.txt 2>&1 || true
    pactl load-module module-null-sink sink_name=essai >>/tmp/essais-audio.txt 2>&1 || true
    pactl set-default-sink essai >>/tmp/essais-audio.txt 2>&1 || true
  fi
  tail -n 2 /tmp/essais-audio.txt 2>/dev/null || true
fi
etape "outil d'essai : installation"
if ! { npm init -y >/dev/null 2>&1 && npm install --no-audit --no-fund "playwright@$(cat version-playwright.txt)" >/tmp/essais-installation.txt 2>&1; }; then
  echo "::warning title=Essais en ligne dans $nom::L'outil d'essai n'a pas pu être installé sur la machine de GitHub. Rien n'a été rejoué dans ce navigateur."
  tail -n 5 /tmp/essais-installation.txt
  exit 0
fi
etape "navigateur $nav : installation"
if ! DEBIAN_FRONTEND=noninteractive NEEDRESTART_MODE=a npx playwright install --with-deps "$nav" >>/tmp/essais-installation.txt 2>&1; then
  echo "::warning title=Essais en ligne dans $nom::Le navigateur d'essai n'a pas pu être installé sur la machine de GitHub. Rien n'a été rejoué dans ce navigateur."
  tail -n 5 /tmp/essais-installation.txt
  exit 0
fi
etape "essais : départ"
export PEPE_ORIGIN="${ADRESSE%/}" PEPE_BASE=/essai/ PEPE_PUBLIC="${ADRESSE%/}/essai/" PEPE_KEY=pepe-essai-v1 PEPE_NAV="$nav"
total=0
# un essai : son titre dans les notes (sans virgule : GitHub couperait le titre à la première), puis la commande
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
[ "$nav" = chromium ] && essai "Premier geste dans Chrome" node premier-geste.js
essai "Respiration dans $nom" node respiration.js
essai "Finition dans $nom" node finition.js
essai "Chemin d'un futur client dans $nom" node aboutie.js
etape "essais : fin"
exit "$total"
