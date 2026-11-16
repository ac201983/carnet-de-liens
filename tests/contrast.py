#!/usr/bin/env python3
"""Contraste réel (WCAG 2.x) : couleur de chaque texte comparée aux pixels réellement derrière lui.
Seuils AA : 4.5 pour le texte courant, 3.0 pour le grand texte (>= 24 px, ou >= 18.66 px en gras) et pour le bord des champs."""
import json, glob, os, sys
from PIL import Image

D = '/home/claude/build/contrast'
VERBOSE = '-v' in sys.argv

def lin(c):
    c /= 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def lum(rgb):
    return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2])

def ratio(a, b):
    la, lb = lum(a), lum(b)
    if la < lb:
        la, lb = lb, la
    return (la + 0.05) / (lb + 0.05)

def over(fg, alpha, bg):
    return tuple(fg[i] * alpha + bg[i] * (1 - alpha) for i in range(3))

def hexa(c):
    return '#%02X%02X%02X' % tuple(int(round(x)) for x in c[:3])

worst = {}      # (kind, sel, text) -> record
borders = {}
n_items = 0
for jf in sorted(glob.glob(os.path.join(D, '*.json'))):
    meta = json.load(open(jf, encoding='utf-8'))
    im = Image.open(jf[:-5] + '.png').convert('RGB')
    W, H = im.size
    px = im.load()
    for it in meta['items']:
        if it['kind'] == 'bord':
            x, y, w, h = it['box']
            cx = int(min(W - 1, max(0, x + w / 2)))
            yt = int(round(y))
            if yt - 4 < 0 or yt + 6 >= H:
                continue
            outside, inside = px[cx, yt - 4], px[cx, yt + 5]
            edge = max((px[cx, yy] for yy in (yt - 1, yt, yt + 1)), key=lambda c: ratio(c, outside))  # le bord tombe parfois à cheval sur deux pixels
            r = max(ratio(edge, outside), ratio(inside, outside))
            key = (it['sel'], it['text'])
            if key not in borders or r < borders[key]['r']:
                borders[key] = dict(r=r, screen=meta['name'], outside=hexa(outside), edge=hexa(edge), inside=hexa(inside))
            continue
        if not it.get('color'):
            continue
        n_items += 1
        fg = it['color'][:3]
        alpha = it['color'][3] * it.get('opacity', 1)
        big = it['size'] >= 24 or (it['size'] >= 18.66 and it['weight'] >= 700)
        need = 3.0 if big else 4.5
        vals = []
        for (x, y, w, h) in it['rects']:
            # 2 px de marge : une ligne qui frôle une barre fixe ne doit pas être mesurée contre cette barre
            x0, y0, x1, y1 = int(max(0, x + 1)), int(max(0, y + 2)), int(min(W, x + w - 1)), int(min(H, y + h - 2))
            sx = max(1, (x1 - x0) // 60)
            sy = max(1, (y1 - y0) // 12)
            for yy in range(y0, y1, sy):
                for xx in range(x0, x1, sx):
                    bg = px[xx, yy]
                    vals.append((ratio(over(fg, alpha, bg), bg), bg))
        if not vals:
            continue
        vals.sort(key=lambda v: v[0])
        lo = vals[0]
        p05 = vals[int(len(vals) * 0.05)]
        key = (it['kind'], it['sel'], it['text'])
        rec = dict(min=lo[0], p05=p05[0], bg=hexa(lo[1]), fg=hexa(over(fg, alpha, lo[1])), raw=hexa(fg), alpha=round(alpha, 2), size=it['size'], weight=it['weight'], need=need, screen=meta['name'], kind=it['kind'])
        if key not in worst or rec['p05'] < worst[key]['p05']:
            worst[key] = rec

fails = [(k, v) for k, v in worst.items() if v['p05'] < v['need']]
edge = [(k, v) for k, v in worst.items() if v['p05'] >= v['need'] and v['min'] < v['need']]
print('%d textes mesurés sur %d captures (%d distincts)' % (n_items, len(glob.glob(os.path.join(D, '*.json'))), len(worst)))
print('\n=== textes sous le seuil AA : %d ===' % len(fails))
groups = {}
for k, v in sorted(fails, key=lambda kv: kv[1]['p05']):
    g = (v['raw'], v['alpha'], v['bg'])
    groups.setdefault(g, []).append((k, v))
for g, lst in groups.items():
    k, v = lst[0]
    print('  %.2f (min %.2f, requis %.1f) couleur %s α%.2f sur %s — %d texte(s), ex. [%s] %s « %s » %spx/%s' % (v['p05'], v['min'], v['need'], v['raw'], v['alpha'], v['bg'], len(lst), v['screen'], k[1][-70:], k[2][:34], v['size'], v['weight']))
    if VERBOSE:
        for k2, v2 in lst[1:6]:
            print('        [%s] %s « %s » %.2f' % (v2['screen'], k2[1][-70:], k2[2][:34], v2['p05']))
print('\n=== textes conformes mais dont un point de l’arrière-plan passe sous le seuil (photo, dégradé) : %d ===' % len(edge))
for k, v in sorted(edge, key=lambda kv: kv[1]['min'])[:20]:
    print('  min %.2f / p05 %.2f (requis %.1f) %s sur %s [%s] %s « %s »' % (v['min'], v['p05'], v['need'], v['raw'], v['bg'], v['screen'], k[1][-60:], k[2][:30]))
bf = [(k, v) for k, v in borders.items() if v['r'] < 3.0]
print('\n=== bord des champs de saisie sous 3:1 : %d sur %d ===' % (len(bf), len(borders)))
seen = set()
for k, v in sorted(bf, key=lambda kv: kv[1]['r']):
    g = (v['outside'], v['edge'], v['inside'])
    if g in seen:
        continue
    seen.add(g)
    print('  %.2f  dehors %s · bord %s · dedans %s  [%s] %s' % (v['r'], v['outside'], v['edge'], v['inside'], v['screen'], k[0][-60:]))
lows = sorted(worst.items(), key=lambda kv: kv[1]['p05'] / kv[1]['need'])[:8]
print('\n=== les plus justes (marge la plus faible) ===')
for k, v in lows:
    print('  %.2f / %.1f  %s sur %s  [%s] « %s »' % (v['p05'], v['need'], v['raw'], v['bg'], v['screen'], k[2][:34]))
sys.exit(1 if fails else 0)
