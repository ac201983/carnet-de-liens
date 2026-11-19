#!/usr/bin/env bash
# Troisième lot, sur la fabrication finale et avec le lien d'exemple corrigé dans le parcours des écrans. Résultats dans /tmp/lot3.log. Environ 35 minutes.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/lot3.log; : > $L
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/lot3-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/lot3-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
E="env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1"
un lancement-essai $E node lancement.js
un lancement node lancement.js
un fx node fx.js 390
un voix-essai $E node voix.js
un voix node voix.js
un doigt node doigt.js 390
un axe-390 node extra/axe-ordi.js 390 844
un axe-1280 node extra/axe-ordi.js 1280 800
PEPE_HEURE=21 un contraste-390 sh -c 'node contrast.js 390 >/dev/null 2>&1; python3 contrast.py 390 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min"'
PEPE_HEURE=10 un contraste-1280 sh -c 'node contrast.js 1280 >/dev/null 2>&1; python3 contrast.py 1280 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min"'
for w in 320 390 768 1024 1280 1920; do un overflow-$w node overflow.js $w; done
un links node links.js
echo "$(date +%H:%M) FIN" >> $L
