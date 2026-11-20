#!/usr/bin/env bash
# Passe « le film », 20 novembre 2026. Première moitié : ce qui décide de la mise en ligne, sur la version d'essai fabriquée avec le film (« actif »).
# Résultats dans /tmp/lot-f1.log. Ne rien lancer d'autre dans Chrome pendant ce temps (2 cœurs seulement), et ne rien refabriquer.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/lot-f1.log; : > $L
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/lot-f1-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/lot-f1-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
E="env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1"
un film-essai $E PEPE_FILM=actif node film.js
un film-travail env PEPE_FILM=absent node film.js --court
un voix-essai $E node voix.js
un geste-essai $E node premier-geste.js --court
un finition-essai $E node finition.js --court
un lancement-essai $E node lancement.js
un essai env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ node essai.js
un accueil node accueil.js
un e2e node e2e.js
un respiration-essai $E node respiration.js --court
echo "$(date +%H:%M) FIN" >> $L
