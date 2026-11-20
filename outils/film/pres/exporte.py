# « Ce qu'on ne dit pas par SMS » : les 3 exports, leurs affiches et l'image d'aperçu de l'accueil.
# python3 exporte.py <V|H|I>   puis   python3 exporte.py affiches <dossier de sortie>
# Les 2 films du site sont un peu plus légers que l'export pour Instagram (qui recompresse de toute façon ce qu'on lui envoie).
import sys, os, subprocess, numpy as np, cv2
PRES = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.dirname(PRES))
import film
NOM = 'ce-quon-ne-dit-pas-par-sms'
FICHIER = {'V': NOM + '-vertical.mp4', 'H': NOM + '-horizontal.mp4', 'I': NOM + '-instagram.mp4'}
REGLAGE = {'V': (24, '6M'), 'H': (24, '6M'), 'I': (22, '10M')}
def image(fichier, t, W, H):
    p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', str(t), '-i', fichier, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(H, W, 3)
if __name__ == '__main__':
    q = sys.argv[1]; fin = PRES + '/out/final'; os.makedirs(fin, exist_ok=True)
    if q in FICHIER:
        crf, debit = REGLAGE[q]; film.export('%s/out/%s/image.mp4' % (PRES, q), PRES + '/tmp/film.wav', fin + '/' + FICHIER[q], crf, debit)
        r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type,duration,nb_frames:format=duration,size', '-of', 'compact=p=0:nk=0', fin + '/' + FICHIER[q]], capture_output=True, text=True).stdout
        print(q, FICHIER[q], round(os.path.getsize(fin + '/' + FICHIER[q]) / 1048576, 1), 'Mo |', r.replace('\n', ' | '))
    elif q == 'affiches':
        out = sys.argv[2]
        # l'affiche du lecteur, montrée avant la lecture : le premier SMS, envoyé (4,4 s). L'aperçu de l'accueil : le père et sa fille aux dominos (47,6 s), pris dans le film horizontal.
        v = image(fin + '/' + FICHIER['V'], 4.4, 1080, 1920); h = image(fin + '/' + FICHIER['H'], 4.4, 1920, 1080); a = image(fin + '/' + FICHIER['H'], 47.6, 1920, 1080)
        cv2.imwrite(out + '/affiche-film-verticale.webp', cv2.resize(v, (720, 1280), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_WEBP_QUALITY, 72])
        cv2.imwrite(out + '/affiche-film-horizontale.webp', cv2.resize(h, (1280, 720), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_WEBP_QUALITY, 72])
        c = a[150:150 + 540, 480:480 + 960]                                # les 2 visages, dans la photo (elle occupe le milieu de l'image horizontale)
        cv2.imwrite(out + '/apercu-film.webp', cv2.resize(c, (336, 189), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_WEBP_QUALITY, 74])
        print({f: os.path.getsize(out + '/' + f) for f in ('affiche-film-verticale.webp', 'affiche-film-horizontale.webp', 'apercu-film.webp')})
