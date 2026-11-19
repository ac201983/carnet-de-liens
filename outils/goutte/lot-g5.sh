#!/usr/bin/env bash
# Passe « la goutte », rejeu du soir, deuxième moitié (après la mise en ligne) : les balayages touchés par les 2 retouches et par les contrôles corrigés.
# Résultats dans /tmp/lot-g5.log. Ne rien lancer d'autre dans Chrome pendant ce temps (2 cœurs seulement), et ne rien refabriquer.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/lot-g5.log; : > $L
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/lot-g5-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/lot-g5-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
C='node contrast.js $0 >/dev/null 2>&1; python3 contrast.py $0 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min|^  min "'
un fx node fx.js 390
PEPE_HEURE=10 un contraste-390-jour sh -c "$C" 390
PEPE_HEURE=21 un contraste-390-soir sh -c "$C" 390
un doigt node doigt.js 390
for w in 320 390; do un overflow-$w node overflow.js $w; done
un axe-390 node extra/axe-ordi.js 390 844
PEPE_HEURE=10 un contraste-1280-jour sh -c "$C" 1280
un parcours node parcours.js
echo "$(date +%H:%M) FIN" >> $L
