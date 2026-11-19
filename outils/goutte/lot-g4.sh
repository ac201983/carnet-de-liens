#!/usr/bin/env bash
# Passe « la goutte », rejeu du soir après 2 retouches (le libellé du logo de « Mon histoire », la ligne de « Mes relais » sur 2 lignes)
# et après la correction de 4 contrôles (finition : la goutte ou les cercles ; effets : le cercle du SOS, la commande, la goutte suivie aux mots).
# Première moitié : ce qui décide de la mise en ligne. Résultats dans /tmp/lot-g4.log. Ne rien lancer d'autre dans Chrome pendant ce temps (2 cœurs seulement), et ne rien refabriquer.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/lot-g4.log; : > $L
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/lot-g4-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/lot-g4-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
E="env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1"
un voix-essai $E node voix.js
un finition-essai $E node finition.js --court
un finition-essai-goutte $E PEPE_EAU=1 node finition.js --court
un lancement-essai $E node lancement.js
un essai env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ node essai.js
un geste-essai $E node premier-geste.js --court
un respiration-essai $E node respiration.js --court
echo "$(date +%H:%M) POINT DE MISE EN LIGNE" >> $L
un respiration-essai-goutte $E PEPE_EAU=1 node respiration.js --court
un e2e node e2e.js
un accueil node accueil.js
echo "$(date +%H:%M) FIN" >> $L
