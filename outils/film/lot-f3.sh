#!/usr/bin/env bash
# Passe « le film », 20 novembre 2026, au matin : le lecteur démarre en silence. Les balayages ne regardent que les écrans du film (PEPE_SEUL=film) :
# la commande, le lecteur muet avec « Activer le son », le lecteur avec le son, le lecteur en attente. Le reste du site n'a pas changé depuis les balayages de la nuit.
# Résultats dans /tmp/lot-f3.log. Ne rien lancer d'autre dans Chrome pendant ce temps (2 cœurs seulement), et ne rien refabriquer.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1 PEPE_SITE_DIR=/home/claude/essai-out/essai PEPE_SEUL=film PEPE_JUSQUA=film-lecteur-attente
L=/tmp/lot-f3.log; : > $L
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/lot-f3-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/lot-f3-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
C='node contrast.js $0 >/dev/null 2>&1; python3 contrast.py $0 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min|^  min "'
PEPE_HEURE=21 un contraste-390-soir sh -c "$C" 390
PEPE_HEURE=10 un contraste-390-jour sh -c "$C" 390
un doigt node doigt.js 390
for w in 320 390; do un overflow-$w node overflow.js $w; done
un axe-390 node extra/axe-ordi.js 390 844
un axe-1280 node extra/axe-ordi.js 1280 800
PEPE_HEURE=10 un contraste-1280-jour sh -c "$C" 1280
un fx node fx.js 390
echo "$(date +%H:%M) FIN" >> $L
