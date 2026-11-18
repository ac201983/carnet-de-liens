#!/usr/bin/env bash
# Complète build/essai/vite.sh : les contrôles d'écran qui n'y sont pas (voix, doigt, largeurs, axe au format ordinateur, contrastes).
# Attend la fin de vite.sh pour ne pas gêner les essais sensibles au temps. Résultats dans /tmp/reste.log.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/reste.log; : > $L
while ! grep -q "FIN" /tmp/vite.log 2>/dev/null; do sleep 10; done
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/reste-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/reste-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
un voix node voix.js
un doigt node doigt.js 390
for w in 320 390 768 1024 1280 1920; do un overflow-$w node overflow.js $w; done
un axe-1280 node extra/axe-ordi.js 1280 800
PEPE_HEURE=21 un contraste-390 sh -c 'node contrast.js 390 >/dev/null 2>&1; python3 contrast.py 390 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min"'
PEPE_HEURE=10 un contraste-1280 sh -c 'node contrast.js 1280 >/dev/null 2>&1; python3 contrast.py 1280 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min"'
echo "$(date +%H:%M) FIN" >> $L
