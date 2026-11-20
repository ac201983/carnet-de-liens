import sys, os, numpy as np, subprocess, cv2
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import raccord as R
from film import *
f = sys.argv[1] if len(sys.argv) > 1 else 'H'; W, H = FORMATS[f]; out = 'tmp/raccord'
n4 = int(round(R.T4 * IPS)); n5 = int(round(1.6 * IPS))
p = Plan(out + '/extrait-image-%s.mp4' % f, W, H)
for i in range(n4): p.image(R.finition(R.image_verre(i / IPS, f, i), i, f))
for i in range(n5): p.image(R.finition(R.image_etang(i / IPS, f, i), 1000 + i, f))
print('images', p.fin())
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', out + '/extrait-image-%s.mp4' % f, '-i', out + '/extrait.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out + '/raccord-5s-%s.tmp.mp4' % f], check=True)
os.replace(out + '/raccord-5s-%s.tmp.mp4' % f, out + '/raccord-5s-%s.mp4' % f)
