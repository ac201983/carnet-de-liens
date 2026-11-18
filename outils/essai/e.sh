#!/usr/bin/env bash
# Fabrique la version d'essai (dossier essai/, sa propre clé de rangement, jamais référencée) dans /home/claude/essai-out.
cd /home/claude && PEPE_REPO=/home/claude/essai-out PEPE_CONFIG=/home/claude/site-src/config.essai.json PEPE_SITE_ONLY=1 python3 build_site.py 2>&1 | grep -v "attention : pas d’image" | tail -4
