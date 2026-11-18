#!/usr/bin/env bash
# Après une petite retouche : rejoue d'abord ce qui touche au son, à l'accueil et aux parcours, puis les contrôles d'écran les plus sensibles.
# Résultats dans /tmp/vite.log. La suite complète reste build/essai/tout.sh.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/vite.log; : > $L
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/vite-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/vite-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
E="env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1"
un links node links.js
un finition-essai $E node finition.js --court
un geste-essai $E node premier-geste.js --court
un essai env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ node essai.js
un finition node finition.js
un e2e node e2e.js
un accueil node accueil.js
un parcours node parcours.js
un refonte node refonte.js
un final node final.js
un ordi node ordi.js
un artefact node artifact-smoke.js
un axe-390 node extra/axe-ordi.js 390 844
un fx node fx.js 390
un geste node premier-geste.js
echo "$(date +%H:%M) FIN" >> $L
