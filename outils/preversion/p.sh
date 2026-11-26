#!/usr/bin/env bash
# Fabrique la préversion (dossier preversion/, sa propre clé de rangement, jamais référencée, vente fermée) dans /home/claude/prev-out.
cd /home/claude && PEPE_REPO=/home/claude/prev-out PEPE_CONFIG=/home/claude/site-src/config.preversion.json PEPE_SITE_ONLY=1 python3 build_site.py 2>&1 | grep -v "attention : pas d’image" | tail -3
