#!/usr/bin/env bash
# Lance un essai contre la préversion fabriquée, servie sur le port 8448.
#   bash build/preversion/t.sh <essai.js> [arguments]            comme un parent du site public (vente fermée)
#   bash build/preversion/t.sh interne <essai.js> [arguments]    avec l'interrupteur des essais internes (la commande en démonstration existe)
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules
export PEPE_ORIGIN=https://localhost:8448 PEPE_BASE=/preversion/ PEPE_PUBLIC=https://parent-ecoute.ch/preversion/ PEPE_KEY=pepe-preversion-v1 PEPE_APPDIR= PEPE_SITE_DIR=/home/claude/prev-out/preversion
if [ "${1:-}" = interne ]; then shift; export PEPE_INTERNE=1 NODE_OPTIONS="-r /home/claude/tests/interne.js"; fi
exec node "$@"
