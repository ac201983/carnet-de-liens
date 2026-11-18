#!/usr/bin/env bash
# Fabrique la version de travail (servie en local sur le port 8445), avec les réglages de parent-ecoute.ch.
cd /home/claude && PEPE_REPO=/home/claude/dev/site PEPE_CONFIG=/home/claude/site-src/config.infomaniak.json PEPE_SITE_ONLY=1 python3 build_site.py 2>&1 | grep -v "attention : pas d’image" | tail -4
