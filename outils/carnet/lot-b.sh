#!/usr/bin/env bash
# Passe « carnet et étang » (19 novembre, après-midi), sur les versions finales. D'abord ce qui décide de la mise en ligne, puis le reste.
# Résultats dans /tmp/lot-b.log. Ne rien lancer d'autre dans Chrome pendant ce temps (2 cœurs seulement).
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/lot-b.log; : > $L
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/lot-b-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/lot-b-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
E="env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1"
C='node contrast.js $0 >/dev/null 2>&1; python3 contrast.py $0 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min|^  min "'
un essai env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ node essai.js
un geste-essai $E node premier-geste.js --court
un finition-essai $E node finition.js --court
un lancement-essai $E node lancement.js
un accueil node accueil.js
un e2e node e2e.js
un ordi node ordi.js
un doigt node doigt.js 390
for w in 320 390 768 1024 1280 1920; do un overflow-$w node overflow.js $w; done
un axe-390 node extra/axe-ordi.js 390 844
un axe-1280 node extra/axe-ordi.js 1280 800
PEPE_HEURE=10 un contraste-390-jour sh -c "$C" 390
PEPE_HEURE=21 un contraste-390-soir sh -c "$C" 390
un voix-essai $E node voix.js
un respiration-essai $E node respiration.js --court
echo "$(date +%H:%M) POINT DE MISE EN LIGNE" >> $L
un parcours node parcours.js
un refonte node refonte.js
un final node final.js
PEPE_HEURE=10 un contraste-1280-jour sh -c "$C" 1280
un links node links.js
un fx node fx.js 390
echo "$(date +%H:%M) FIN" >> $L
