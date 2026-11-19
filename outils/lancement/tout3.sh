#!/usr/bin/env bash
# Suite complète de la passe « lancement » (19 novembre) : d'abord la version d'essai (ce qui part en ligne), puis la version de travail.
# Résultats dans /tmp/tout3.log. Environ 1 h 45. Ne rien lancer d'autre dans Chrome pendant ce temps (2 cœurs seulement, les essais de minutage y sont sensibles).
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/tout3.log; : > $L
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/tout3-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/tout3-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
E="env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1"
un lancement-essai $E node lancement.js
un geste-essai $E node premier-geste.js --court
un finition-essai $E node finition.js --court
un respiration-essai $E node respiration.js --court
un essai env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ node essai.js
un voix-essai $E node voix.js
un lancement node lancement.js
un e2e node e2e.js
un accueil node accueil.js
un parcours node parcours.js
un refonte node refonte.js
un final node final.js
un ordi node ordi.js
un links node links.js
un voix node voix.js
un doigt node doigt.js 390
un geste node premier-geste.js
un finition node finition.js
for w in 320 390 768 1024 1280 1920; do un overflow-$w node overflow.js $w; done
un axe-390 node extra/axe-ordi.js 390 844
un axe-1280 node extra/axe-ordi.js 1280 800
PEPE_HEURE=21 un contraste-390 sh -c 'node contrast.js 390 >/dev/null 2>&1; python3 contrast.py 390 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min"'
PEPE_HEURE=10 un contraste-1280 sh -c 'node contrast.js 1280 >/dev/null 2>&1; python3 contrast.py 1280 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min"'
un fx node fx.js 390
un respiration node respiration.js
echo "$(date +%H:%M) FIN" >> $L
