#!/usr/bin/env bash
# Passe « le montage intime », 21 novembre 2026 : le film change (nouveaux fichiers, nouvelle description, nouvelles affiches), le lecteur ne change pas.
# On rejoue ce que le film touche : l'essai du film sur la version d'essai et sur la fabrication de travail, la version d'essai, la voix des textes.
# Les longs parcours sont rejoués en ligne, dans les 3 navigateurs, après la mise en ligne. Résultats dans /tmp/lot-i.log. Ne rien refabriquer pendant ce temps.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/lot-i.log; : > $L
un() { local nom="$1"; shift; local t0=$(date +%s); "$@" > /tmp/lot-i-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/lot-i-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
E="env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1"
un film-essai $E PEPE_FILM=actif node film.js
un film-travail env PEPE_FILM=absent node film.js --court
un essai env PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ node essai.js
un voix-essai $E node voix.js
echo "$(date +%H:%M) FAIT" >> $L
