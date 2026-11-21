# Montage intime de « Ce qu'on ne dit pas par SMS » : les exports, leurs affiches et l'image d'aperçu de l'accueil.
# python3 iexporte.py V|H|BA     puis     python3 iexporte.py affiches <dossier de sortie>
import sys, os, subprocess, numpy as np, cv2
CINE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.dirname(CINE))       # (ici, CINE est le dossier de ce montage : build/film/intime)
import film
NOM = 'ce-quon-ne-dit-pas-par-sms'
FICHIER = {'V': NOM + '-vertical.mp4', 'H': NOM + '-horizontal.mp4', 'BA': NOM + '-bande-annonce.mp4'}
IMAGE = {'V': 'out/V/image.mp4', 'H': 'out/H/image.mp4', 'BA': 'out/I/image.mp4'}; SON = {'V': 'tmp/film.wav', 'H': 'tmp/film.wav', 'BA': 'tmp/bande-annonce.wav'}
REGLAGE = {'V': (24, '6M'), 'H': (24, '6M'), 'BA': (22, '10M')}          # la bande-annonce part sur les réseaux, qui la recompressent : on leur donne un peu plus
def image(fichier, n, W, H):
    p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', fichier, '-vf', "select=eq(n\\,%d)" % n, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(H, W, 3)
if __name__ == '__main__':
    q = sys.argv[1]; fin = CINE + '/out/final'; os.makedirs(fin, exist_ok=True)
    if q in FICHIER:
        crf, debit = REGLAGE[q]; film.export(CINE + '/' + IMAGE[q], CINE + '/' + SON[q], fin + '/' + FICHIER[q], crf, debit)
        r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_name,profile,level,width,height,r_frame_rate,duration,nb_frames,sample_rate:format=duration,size', '-of', 'compact=p=0:nk=0', fin + '/' + FICHIER[q]], capture_output=True, text=True).stdout
        print(q, FICHIER[q], round(os.path.getsize(fin + '/' + FICHIER[q]) / 1048576, 1), 'Mo |', r.replace('\n', ' | '))
    elif q == 'affiches':
        out = sys.argv[2]
        # L'affiche du lecteur, montrée avant la lecture : « Comment va ta fille ? », et la réponse du père, écrite, pas encore envoyée (image 148, à 4,9 s).
        # L'aperçu de l'accueil : le père qui relève les yeux (image 1050, à 35 s), pris dans le film horizontal.
        v = image(fin + '/' + FICHIER['V'], 148, 1080, 1920); h = image(fin + '/' + FICHIER['H'], 148, 1920, 1080); a = image(fin + '/' + FICHIER['H'], 1050, 1920, 1080)
        cv2.imwrite(out + '/affiche-film-verticale.webp', cv2.resize(v, (720, 1280), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_WEBP_QUALITY, 72])
        cv2.imwrite(out + '/affiche-film-horizontale.webp', cv2.resize(h, (1280, 720), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_WEBP_QUALITY, 72])
        cv2.imwrite(out + '/apercu-film.webp', cv2.resize(a, (336, 189), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_WEBP_QUALITY, 76])
        print({f: os.path.getsize(out + '/' + f) for f in ('affiche-film-verticale.webp', 'affiche-film-horizontale.webp', 'apercu-film.webp')})
