#!/usr/bin/env bash
# Lance un essai sur la fabrication de travail (port 8445). Exemple : bash build/goutte/t.sh accueil.js
# Avec « essai » en premier : sur la version d'essai fabriquée (port 8446). Exemple : bash build/goutte/t.sh essai lancement.js
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
if [ "$1" = "essai" ]; then shift; export PEPE_ORIGIN=https://localhost:8446 PEPE_BASE=/essai/ PEPE_PUBLIC=https://parent-ecoute.ch/essai/ PEPE_KEY=pepe-essai-v1; fi
exec node "$@"
