#!/usr/bin/env bash
# Passe « tout sur le site officiel », 22 novembre 2026 (reprise et publication le 26) : Antonio demande de publier sur parent-ecoute.ch tout ce que contient la version d'essai, puis de retirer l'essai.
# Suite complète sur le site officiel fabriqué (/home/claude/dev/site, servi sur 8445), le film actif à la racine, plus la reprise des notes de l'ancien site (8447).
# Résultats dans /tmp/lot-o.log. Environ 1 h. Ne rien lancer d'autre dans Chrome et ne rien refabriquer pendant ce temps (2 cœurs seulement).
# usage : bash lot-o.sh [nom d'essai ...]   sans nom : tout.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8445 PEPE_BASE=/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch PEPE_SITE_DIR=/home/claude/dev/site
L=/tmp/lot-o.log; [ $# -eq 0 ] && : > $L
VEUT=" $* "
un() { local nom="$1"; shift; if [ "$VEUT" != "  " ] && [ "${VEUT/ $nom /}" = "$VEUT" ]; then return; fi
  local t0=$(date +%s); "$@" > /tmp/lot-o-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/lot-o-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
un film env PEPE_FILM=actif node film.js
un reprise node reprise.js
un lancement node lancement.js
un e2e node e2e.js
un accueil node accueil.js
un parcours node parcours.js
un refonte node refonte.js
un final node final.js
un ordi node ordi.js
un links node links.js
un voix node voix.js
un doigt node doigt.js 390
un geste node premier-geste.js
un finition node finition.js
for w in 320 390 768 1024 1280 1920; do un overflow-$w node overflow.js $w; done
un axe-390 node extra/axe-ordi.js 390 844
un axe-1280 node extra/axe-ordi.js 1280 800
PEPE_HEURE=21 un contraste-390-soir sh -c 'node contrast.js 390 >/dev/null 2>&1; python3 contrast.py 390 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min"'
PEPE_HEURE=10 un contraste-390-jour sh -c 'node contrast.js 390 >/dev/null 2>&1; python3 contrast.py 390 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min"'
PEPE_HEURE=10 un contraste-1280 sh -c 'node contrast.js 1280 >/dev/null 2>&1; python3 contrast.py 1280 | grep -E "sous le seuil AA|passe sous le seuil|bord des champs|^  [0-9.]+ \(min"'
un fx node fx.js 390
un respiration node respiration.js
echo "$(date +%H:%M) FIN" >> $L
