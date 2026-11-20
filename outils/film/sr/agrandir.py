#!/usr/bin/env python3
# Agrandit une image 4 fois avec Real-ESRGAN (modèle x4plus, licence BSD-3, téléchargé depuis les versions publiées sur GitHub), sur le processeur, par tuiles.
# usage : python3 agrandir.py <entrée.png> <sortie.png> [taille de tuile]
import sys, numpy as np, ncnn, cv2, time
src, dst = sys.argv[1], sys.argv[2]; T = int(sys.argv[3]) if len(sys.argv) > 3 else 160; PAD = 12
net = ncnn.Net(); net.opt.use_vulkan_compute = False; net.opt.num_threads = 2
net.load_param('/home/claude/build/film/sr/realesrgan-x4plus.param'); net.load_model('/home/claude/build/film/sr/realesrgan-x4plus.bin')
im = cv2.imread(src, cv2.IMREAD_COLOR); h, w = im.shape[:2]
rgb = cv2.cvtColor(im, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
out = np.zeros((h * 4, w * 4, 3), np.float32); t0 = time.time(); n = 0
ys = list(range(0, h, T)); xs = list(range(0, w, T))
for y in ys:
    for x in xs:
        y0, y1, x0, x1 = max(0, y - PAD), min(h, y + T + PAD), max(0, x - PAD), min(w, x + T + PAD)
        tile = np.ascontiguousarray(rgb[y0:y1, x0:x1].transpose(2, 0, 1))
        ex = net.create_extractor(); ex.input('data', ncnn.Mat(tile))
        ret, o = ex.extract('output'); o = np.array(o).transpose(1, 2, 0)
        cy0, cx0 = (y - y0) * 4, (x - x0) * 4; th, tw = (min(h, y + T) - y) * 4, (min(w, x + T) - x) * 4
        out[y * 4:y * 4 + th, x * 4:x * 4 + tw] = o[cy0:cy0 + th, cx0:cx0 + tw]; n += 1
        if n == 1: print('première tuile', round(time.time() - t0, 1), 's, sur', len(ys) * len(xs), flush=True)
out = np.clip(out, 0, 1); cv2.imwrite(dst, cv2.cvtColor((out * 255 + .5).astype(np.uint8), cv2.COLOR_RGB2BGR))
print('fait', dst, out.shape, round(time.time() - t0), 's')
