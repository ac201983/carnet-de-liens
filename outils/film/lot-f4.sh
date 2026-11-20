#!/usr/bin/env bash
# Passe « le film », version 3, 20 novembre 2026 : après la retouche du bouton « Souffler 2 minutes » (l'exercice s'ouvre dans le geste du parent, la page du lecteur
# devient celle de l'exercice). Ce qui touche à la navigation est rejoué, sur la fabrication de travail et sur la version d'essai. Résultats dans /tmp/lot-f4.log.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/lot-f4.log; : > $L
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/lot-f4-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/lot-f4-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
E="env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1"
un film-travail env PEPE_FILM=absent node film.js --court
un geste-essai $E node premier-geste.js --court
un e2e node e2e.js
un lancement-essai $E node lancement.js
un essai env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ node essai.js
un accueil node accueil.js
un finition-essai $E node finition.js --court
un voix-essai $E node voix.js
echo "$(date +%H:%M) FIN" >> $L
