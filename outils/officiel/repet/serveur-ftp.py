# Répétition du dépôt : un petit serveur FTP chiffré (TLS explicite), sur cette machine seulement.
# Il joue le rôle du serveur d'Infomaniak pour répéter outils/deposer.sh avant une vraie mise en ligne.
# usage : python3 serveur-ftp.py <dossier servi> <port>     Le mot de passe de répétition est lu dans REPET_MOT (il ne sert qu'ici).
import os, sys, logging
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import TLS_FTPHandler
from pyftpdlib.servers import FTPServer
dossier, port = sys.argv[1], int(sys.argv[2])
a = DummyAuthorizer(); a.add_user('repet', os.environ['REPET_MOT'], dossier, perm='elradfmwMT')
h = TLS_FTPHandler; h.certfile = '/home/claude/build/cert/cert.pem'; h.keyfile = '/home/claude/build/cert/key.pem'
h.authorizer = a; h.tls_control_required = True; h.tls_data_required = True; h.passive_ports = range(52100, 52160)
logging.basicConfig(filename='/tmp/repet/ftp.log', level=logging.INFO)
FTPServer(('127.0.0.1', port), h).serve_forever()
