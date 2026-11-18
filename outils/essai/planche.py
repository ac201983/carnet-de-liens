#!/usr/bin/env python3
"""Assemble plusieurs captures côte à côte : planche.py sortie.jpg hauteur_max a.png b.png …"""
import sys
from PIL import Image
out, hmax, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
ims = []
for f in files:
    im = Image.open(f).convert('RGB')
    if im.size[1] > hmax * 2: im = im.crop((0, 0, im.size[0], hmax * 2))
    k = 390 / im.size[0] if im.size[0] <= 800 else 640 / im.size[0]
    im = im.resize((int(im.size[0] * k), int(im.size[1] * k)), Image.LANCZOS)
    ims.append(im)
W = sum(i.size[0] for i in ims) + 12 * (len(ims) + 1); H = max(i.size[1] for i in ims) + 24
sheet = Image.new('RGB', (W, H), (40, 40, 40)); x = 12
for i in ims: sheet.paste(i, (x, 12)); x += i.size[0] + 12
sheet.save(out, quality=82); print(out, sheet.size)
