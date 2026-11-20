"""Planches de contrôle d'un film exporté : python3 voir.py <film.mp4> <préfixe> [images par seconde=2] [colonnes=4] [lignes=3]"""
import sys, subprocess, numpy as np, cv2, json, os
def infos(f):
    r = subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,nb_frames','-of','json',f],capture_output=True,text=True)
    s = json.loads(r.stdout)['streams'][0]; return int(s['width']), int(s['height']), int(s['nb_frames'])
def images(f, ips):
    W, H, N = infos(f)
    p = subprocess.Popen(['ffmpeg','-v','error','-i',f,'-vf','fps=%s' % ips,'-f','rawvideo','-pix_fmt','bgr24','-'],stdout=subprocess.PIPE)
    n = W*H*3; i = 0
    while True:
        b = p.stdout.read(n)
        if len(b) < n: break
        yield i, np.frombuffer(b, np.uint8).reshape(H, W, 3); i += 1
def planches(f, pre, ips=2.0, col=4, lig=3, larg=None):
    W, H, N = infos(f)
    if larg is None: larg = 480 if W > H else 270
    haut = round(larg*H/W); k = 0; page = None; sorties = []
    for i, im in images(f, ips):
        if i % (col*lig) == 0:
            if page is not None: nom = '%s-%02d.jpg' % (pre, k); cv2.imwrite(nom, page, [cv2.IMWRITE_JPEG_QUALITY, 88]); sorties.append(nom); k += 1
            page = np.zeros((lig*haut, col*larg, 3), np.uint8)
        j = i % (col*lig); x, y = (j % col)*larg, (j//col)*haut
        v = cv2.resize(im, (larg, haut), interpolation=cv2.INTER_AREA)
        cv2.putText(v, '%.1f s' % (i/ips), (8, 22), cv2.FONT_HERSHEY_SIMPLEX, .6, (0,0,0), 3, cv2.LINE_AA)
        cv2.putText(v, '%.1f s' % (i/ips), (8, 22), cv2.FONT_HERSHEY_SIMPLEX, .6, (255,255,255), 1, cv2.LINE_AA)
        page[y:y+haut, x:x+larg] = v
    if page is not None: nom = '%s-%02d.jpg' % (pre, k); cv2.imwrite(nom, page, [cv2.IMWRITE_JPEG_QUALITY, 88]); sorties.append(nom)
    return sorties
def image(f, t, sortie):
    subprocess.run(['ffmpeg','-v','error','-y','-ss','%.3f' % t,'-i',f,'-frames:v','1','-q:v','2',sortie],check=True)
if __name__ == '__main__':
    a = sys.argv
    print('\n'.join(planches(a[1], a[2], float(a[3]) if len(a) > 3 else 2.0, int(a[4]) if len(a) > 4 else 4, int(a[5]) if len(a) > 5 else 3)))
