#!/usr/bin/env bash
# Rejoue toute la suite de vérifications sur la version de travail (port 8445) et sur la version d'essai (port 8446). Résultats dans /tmp/tout.log.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/tout.log; : > $L
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/tout-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/tout-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
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
un geste-essai env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1 node premier-geste.js --court
un finition-essai env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_KEY=pepe-essai-v1 node finition.js --court
un essai env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ node essai.js
un artefact node artifact-smoke.js
for w in 320 390 768 1024 1280 1920; do un overflow-$w node overflow.js $w; done
un axe-390 node extra/axe-ordi.js 390 844
un axe-1280 node extra/axe-ordi.js 1280 800
PEPE_HEURE=21 un contraste-390 sh -c 'node contrast.js 390 >/dev/null 2>&1; python3 contrast.py 390 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min"'
PEPE_HEURE=10 un contraste-1280 sh -c 'node contrast.js 1280 >/dev/null 2>&1; python3 contrast.py 1280 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min"'
un fx node fx.js 390
echo "FIN $(date +%H:%M)" >> $L
