#!/usr/bin/env bash
# Passe complète sur la préversion fabriquée (/home/claude/prev-out/preversion, servie sur 8448), 26 novembre 2026.
#   - le trajet « Je découvre, j'essaie, je vois ma fiche », comme un parent du site public (vente fermée) : trajet.js, puis les balayages avec PEPE_WALK=trajet ;
#   - les essais d'avant, avec le réglage des essais internes (la commande de démonstration existe) : c'est le suffixe « -int ».
# Résultats dans /tmp/lot-p.log. Ne rien lancer d'autre dans Chrome et ne rien refabriquer pendant ce temps (2 cœurs seulement).
# usage : bash lot-p.sh [nom d'essai ...]   sans nom : tout.
cd /home/claude/tests
export NODE_PATH=/home/claude/.npm-global/lib/node_modules:/home/claude/tools/node_modules PEPE_ORIGIN=https://localhost:8448 PEPE_BASE=/preversion/ PEPE_APPDIR= PEPE_PUBLIC=https://parent-ecoute.ch/preversion/ PEPE_KEY=pepe-preversion-v1 PEPE_SITE_DIR=/home/claude/prev-out/preversion
L=/tmp/lot-p.log; [ $# -eq 0 ] && : > $L
VEUT=" $* "
un() { local nom="$1"; shift; if [ "$VEUT" != "  " ] && [ "${VEUT/ $nom /}" = "$VEUT" ]; then return; fi
  local t0=$(date +%s); "$@" > /tmp/lot-p-$nom.txt 2>&1; local c=$?; echo "$(date +%H:%M) [$c] $nom ($(( $(date +%s) - t0 )) s) : $(grep -v '^\s*$' /tmp/lot-p-$nom.txt | tail -n 1 | cut -c1-200)" >> $L; }
int() { local nom="$1"; shift; un "$nom" env PEPE_INTERNE=1 "NODE_OPTIONS=-r /home/claude/tests/interne.js" "$@"; }
# Le contraste. La dernière ligne, celle que le journal garde, est celle des textes sous le seuil, et le code de sortie dit s'il y en a :
# le 26 novembre, la ligne gardée était celle du bord des champs, avec un code 0, et un texte illisible au survol est passé pour un « 0 ».
CONTRASTE='node contrast.js $0 >/dev/null 2>&1; python3 contrast.py $0 > /tmp/contraste-$$.txt 2>&1; grep -E "^  [0-9.]+ \(min" /tmp/contraste-$$.txt; grep -E "passe sous le seuil|bord des champs" /tmp/contraste-$$.txt; grep -E "sous le seuil AA" /tmp/contraste-$$.txt; grep -q "sous le seuil AA : 0 " /tmp/contraste-$$.txt && grep -q "sous 3:1 : 0 sur" /tmp/contraste-$$.txt'
# Le survol, avec une souris : chaque élément qui réagit au survol est survolé, puis ses textes sont mesurés comme pour le contraste.
SURVOL='node survol.js $0 > /tmp/survol-$$.txt 2>&1; python3 contrast.py $0 > /tmp/contraste-$$.txt 2>&1; grep -E "^  [0-9.]+ \(min" /tmp/contraste-$$.txt; grep -E "à regarder à la main|^  \\." /tmp/survol-$$.txt; echo "$(grep -E "^survol, largeur|CRASH" /tmp/survol-$$.txt | tail -n 1) | $(grep -E "sous le seuil AA" /tmp/contraste-$$.txt)"; grep -q "éléments survolés" /tmp/survol-$$.txt && grep -q "sous le seuil AA : 0 " /tmp/contraste-$$.txt'
# --- le trajet, vente fermée
un trajet node trajet.js
un tr-voix env PEPE_WALK=trajet node voix.js
# Les liens : sur les écrans du trajet ici, et sur tous les écrans plus bas (links-int). Sans le réglage interne, le parcours d'avant s'arrête à la commande, qui n'existe plus.
un tr-links env PEPE_WALK=trajet node links.js
for w in 320 375 390 768 1024 1280 1920; do un tr-overflow-$w env PEPE_WALK=trajet node overflow.js $w; done
un tr-doigt env PEPE_WALK=trajet node doigt.js 390
un tr-axe-390 env PEPE_WALK=trajet node extra/axe-ordi.js 390 844
un tr-axe-1280 env PEPE_WALK=trajet node extra/axe-ordi.js 1280 800
un tr-contraste-390-soir env PEPE_WALK=trajet PEPE_HEURE=21 sh -c "$CONTRASTE" 390
un tr-contraste-390-jour env PEPE_WALK=trajet PEPE_HEURE=10 sh -c "$CONTRASTE" 390
un tr-contraste-1280 env PEPE_WALK=trajet PEPE_HEURE=10 sh -c "$CONTRASTE" 1280
un tr-survol-1280-jour env PEPE_WALK=trajet PEPE_HEURE=10 sh -c "$SURVOL" 1280
un tr-survol-1280-soir env PEPE_WALK=trajet PEPE_HEURE=21 sh -c "$SURVOL" 1280
un tr-survol-390-jour env PEPE_WALK=trajet PEPE_HEURE=10 sh -c "$SURVOL" 390
un tr-fx env PEPE_WALK=trajet node fx.js 390
# --- les essais d'avant, avec le réglage des essais internes
int voix-int node voix.js
int film-int env PEPE_FILM=actif node film.js
int lancement-int node lancement.js
# e2e, accueil, parcours, refonte et final rangent leurs notes sous le nom du site officiel (pepe-v1) : ils se rejouent sur la fabrication de travail
# aux réglages du site (bash build/essai/b.sh, puis bash build/officiel/lot-o.sh e2e accueil parcours refonte final), qui partage les mêmes sources.
int links-int node links.js
int ordi-int node ordi.js
int doigt-int node doigt.js 390
int geste-int node premier-geste.js
int finition-int node finition.js
for w in 320 390 768 1024 1280 1920; do int overflow-$w-int node overflow.js $w; done
int axe-390-int node extra/axe-ordi.js 390 844
int axe-1280-int node extra/axe-ordi.js 1280 800
int contraste-390-soir-int env PEPE_HEURE=21 sh -c "$CONTRASTE" 390
int contraste-390-jour-int env PEPE_HEURE=10 sh -c "$CONTRASTE" 390
int contraste-1280-int env PEPE_HEURE=10 sh -c "$CONTRASTE" 1280
int survol-1280-soir-int env PEPE_HEURE=21 sh -c "$SURVOL" 1280
int survol-1280-jour-int env PEPE_HEURE=10 sh -c "$SURVOL" 1280
int fx-int node fx.js 390
int respiration-int node respiration.js
echo "$(date +%H:%M) FIN" >> $L
