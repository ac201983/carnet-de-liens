#!/usr/bin/env bash
# Passe « le montage cinématographique », 20 novembre 2026, le soir : « Ce qu’on ne dit pas par SMS » (1 minute 47) et ses 2 boutons, « Regarder avec la musique » et « Regarder en silence »,
# « Et vous ? » (35 secondes) devient la capsule de respiration, à sa propre adresse. Tout ce qui touche au lecteur, à l'accueil et à la navigation est rejoué,
# sur la fabrication de travail (sans film) et sur la version d'essai. D'abord l'essentiel (le film, la version d'essai, la voix des textes), puis les balayages
# des écrans du film, puis les longs parcours. Résultats dans /tmp/lot-c.log. Ne rien refabriquer pendant ce temps.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/lot-c.log; : > $L
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/lot-c-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/lot-c-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
E="env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1"
un film-essai $E PEPE_FILM=actif node film.js
un film-travail env PEPE_FILM=absent node film.js --court
un essai env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ node essai.js
un voix-essai $E node voix.js
# les balayages ne regardent que les écrans du film (PEPE_SEUL=film) : la commande, le lecteur avec le son, le lecteur en silence, la fin du film, la capsule et le lecteur en attente
B="env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1 PEPE_SITE_DIR=/home/claude/essai-out/essai PEPE_SEUL=film PEPE_JUSQUA=film-lecteur-attente"
C='node contrast.js $0 >/dev/null 2>&1; python3 contrast.py $0 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min|^  min "'
un contraste-390-soir $B PEPE_HEURE=21 sh -c "$C" 390
un contraste-390-jour $B PEPE_HEURE=10 sh -c "$C" 390
un doigt $B node doigt.js 390
for w in 320 390; do un overflow-$w $B node overflow.js $w; done
un axe-390 $B node extra/axe-ordi.js 390 844
un axe-1280 $B node extra/axe-ordi.js 1280 800
un contraste-1280-jour $B PEPE_HEURE=10 sh -c "$C" 1280
un fx $B node fx.js 390
echo "$(date +%H:%M) ESSENTIEL ET BALAYAGES FAITS" >> $L
if [ "$1" != "court" ]; then
  un geste-essai $E node premier-geste.js --court
  un e2e node e2e.js
  un accueil node accueil.js
  un lancement-essai $E node lancement.js
  un finition-essai $E node finition.js --court
  un respiration-essai $E node respiration.js --court
fi
echo "$(date +%H:%M) FIN" >> $L
