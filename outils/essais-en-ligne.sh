#!/usr/bin/env bash
# Après la mise en ligne : rejoue des parcours de parent dans un vrai navigateur, sur le site en ligne,
# au format téléphone puis au format ordinateur.
# Jusqu'au 25 novembre 2026, ces parcours étaient rejoués sur la version d'essai, à l'adresse …/essai/. Le 26 novembre, tout ce que
# contenait l'essai a été publié sur le site lui-même : c'est lui qui est visité désormais, à son adresse ordinaire.
#
#   outils/essais-en-ligne.sh chromium   tous les parcours ci-dessous, dans Chrome
#   outils/essais-en-ligne.sh webkit     les mêmes sauf premier-geste.js, dans WebKit, le moteur de Safari
#   outils/essais-en-ligne.sh firefox    les mêmes sauf premier-geste.js, dans Firefox
#
#   film.js (quand le site contient le film de présentation « Ce qu'on ne dit pas par SMS » et la capsule « Et vous ? ») :
#     l'accueil où rien du film n'est chargé à part sa petite image, la commande après les 3 portes, le lecteur, la lecture réelle du MP4
#     (le film vertical au format téléphone, l'horizontal au format ordinateur), la pause, le son, la fermeture, le retour arrière
#     et la position retrouvée sur l'accueil, le bouton de fin « Ouvrir mon espace » et le retour à l'accueil, l'adresse …/#film,
#     puis la capsule de respiration à l'adresse …/#capsule. Tant que le film est en attente (réglage « pret »), cet essai
#     est le seul rejoué : il dit vite si le MP4 se lit réellement en ligne. Les autres parcours sont rejoués à la mise en ligne suivante.
#   premier-geste.js :
#     1. Il est 21 h 40, un nouveau parent veut souffler immédiatement.   2. Un parent d'adulte reçoit une fiche par lien direct.
#     3. Un parent déjà venu souhaite reprendre son étape.
#   respiration.js :
#     la respiration en silence, « Changer de respiration » et ses 3 possibilités, puis, là où le son est mesurable, la musique :
#     chaque note comparée au mot affiché, les sorties en cours d'exercice, et les 2 minutes entières jusqu'à la dernière respiration.
#   finition.js :
#     « Prendre un instant » après la dose, la troisième entrée, « Accueil », « Reprendre mon parcours » et le sens de « Retour ».
#   lancement.js :
#     la vitrine et les 3 offres, la commande en démonstration (acceptée, refusée, abandonnée, les 6 mensualités, l'achat retrouvé),
#     « Passer le relais » de l'exemple à la fiche que le proche ouvre par son lien, le retour, le deuxième relais, la réunion,
#     la sauvegarde et la restauration, la page à transmettre, la maquette du cadeau, et l'absence de toute sollicitation commerciale
#     dans le SOS, la respiration et « Déposer ». Tout paiement y est simulé.
#   reprise.js :
#     un parent venu sur le site avant le 26 novembre 2026 retrouve tout ce qu'il y avait écrit (son prénom, ses dépôts, son carnet,
#     son étape faite, son humeur, sa formule). Ses anciennes notes sont posées sur l'appareil d'essai telles que l'ancien site les rangeait.
#   ancien-essai.js (quand les réglages du serveur portent le renvoi des anciennes adresses de l'essai) :
#     …/essai/, …/essai/#film, …/essai/#capsule, une fiche, une fiche de relais envoyée à un proche et la page à transmettre
#     mènent à la même page du site, et ce qui suit le signe # est gardé. Les notes écrites dans l'essai restent sur l'appareil.
#
# Le son n'est pas écouté, il est mesuré. Sur une machine sans sortie audio, un navigateur peut ne rien jouer : le test le dit alors en note.
# WebKit est le moteur de Safari. Ce n'est pas Safari sur un iPhone : l'essai sur un vrai téléphone reste nécessaire.
# Le résultat est écrit en notes, visibles sur la page de la mise en ligne dans GitHub.
# Ce script ne reçoit aucun mot de passe et ne dépose rien : il ne fait que visiter le site, comme un parent. Ce qu'il écrit reste dans
# le navigateur d'essai, qui est jeté à la fin : le site n'a pas de serveur qui garderait quoi que ce soit.
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
if [ ! -f site/index.html ] || [ ! -f site/app.js ]; then
  echo "::notice title=Essais en ligne dans $nom::Pas de site dans cette mise en ligne. Il n'y a rien à rejouer."
  exit 0
fi
# L'état du film sur le site : rien, « pret » (le lecteur n'existe que par son adresse) ou « actif » (la commande est sur l'accueil).
film=""
grep -q 'const FILM="pret";' site/app.js 2>/dev/null && film=pret
grep -q 'const FILM="actif";' site/app.js 2>/dev/null && film=actif
# Les anciennes adresses de la version d'essai sont-elles renvoyées vers le site par les réglages du serveur ?
renvoi_essai=0; grep -q '^RewriteRule \^essai' outils/htaccess-bloc.txt 2>/dev/null && renvoi_essai=1
cd outils/essais
etape() { echo "$(date -u +%H:%M:%S) $*"; }   # l'heure de chaque préparatif, pour voir dans le journal lequel prend du temps
# Les machines de GitHub ne sont pas toutes au même endroit. Certaines nuits, depuis certaines d'entre elles, le site répond en plusieurs
# secondes : les essais y mesureraient la lenteur du chemin, pas le site. On le sait en 5 mesures, avant d'installer quoi que ce soit.
lent=0
for i in 1 2 3 4 5; do
  t="$(curl -s -o /dev/null --max-time 20 -w '%{time_total}' "${ADRESSE%/}/version.txt?c=$RANDOM$RANDOM" 2>/dev/null)" || t=20
  etape "chemin vers le site, mesure $i : $t s"
  if awk "BEGIN{exit !(${t:-20} > 2.5)}"; then lent=$((lent + 1)); fi
done
if [ "$lent" -ge 3 ]; then
  echo "::error title=Essais en ligne dans $nom::Depuis cette machine de GitHub, le site répond trop lentement ($lent mesures sur 5 au-dessus de 2,5 secondes). Les essais n'ont pas été rejoués ici, parce que leurs mesures de temps n'auraient pas de sens. Relancer cette étape : une autre machine sera attribuée."
  exit 1
fi
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
export PEPE_ORIGIN="${ADRESSE%/}" PEPE_BASE=/ PEPE_PUBLIC="${ADRESSE%/}/" PEPE_KEY=pepe-v1 PEPE_NAV="$nav"
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
if [ -n "$film" ]; then
  PEPE_FILM="$film" essai "Le film dans $nom" node film.js
  if [ "$film" = pret ]; then
    echo "::notice title=Essais en ligne dans $nom::Le film est en attente (le lecteur ne répond que par son adresse). Seul son essai a été rejoué. Les autres parcours le seront à la mise en ligne qui pose la commande sur l'accueil."
    etape "essais : fin"
    exit "$total"
  fi
fi
[ "$nav" = chromium ] && essai "Premier geste dans Chrome" node premier-geste.js
essai "Respiration dans $nom" node respiration.js
essai "Finition dans $nom" node finition.js
essai "Les 3 offres et Passer le relais dans $nom" node lancement.js
essai "Les notes d'un parent déjà venu dans $nom" node reprise.js
[ "$renvoi_essai" = 1 ] && essai "Les anciennes adresses de l'essai dans $nom" node ancien-essai.js
etape "essais : fin"
exit "$total"
