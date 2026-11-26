#!/usr/bin/env bash
# Répétition d'une mise en ligne, sur cette machine seulement, avant de pousser la branche « infomaniak ».
# Un serveur FTP chiffré et un serveur HTTPS de répétition servent le même dossier (/tmp/repet/serveur), comme le compte FTP et le site en ligne.
# Les vrais outils (outils/deposer.sh puis outils/verifier.sh) sont joués tels quels, avec seulement d'autres réglages (outils/reglages.env).
#
#   repet.sh depart              remet le serveur de répétition dans l'état du site en ligne avant le 22 novembre (branche avant-publication-2026-11-22)
#   repet.sh joue [dossier]      copie outils/ et site/ de la branche (par défaut /home/claude/pub/infomaniak) et joue le dépôt puis le contrôle
#   repet.sh arret               arrête les 2 serveurs
set -u
R=/tmp/repet; PORT_FTP=2121; PORT_HTTP=8449
export REPET_MOT=mot-de-repetition-sans-valeur CURL_CA_BUNDLE=/home/claude/build/cert/cert.pem NO_PROXY=localhost,127.0.0.1 no_proxy=localhost,127.0.0.1
serveurs() {
  curl -sk --noproxy '*' -o /dev/null "https://localhost:$PORT_HTTP/" 2>/dev/null || { nohup node /home/claude/build/officiel/repet/serveur-http.js $R/serveur $PORT_HTTP > $R/http.log 2>&1 & sleep 1; }
  (echo > /dev/tcp/127.0.0.1/$PORT_FTP) 2>/dev/null || { nohup python3 /home/claude/build/officiel/repet/serveur-ftp.py $R/serveur $PORT_FTP > $R/ftp.out 2>&1 & sleep 2; }
}
case "${1:-}" in
  depart)
    pkill -f "repet/serveur-http.js" 2>/dev/null; pkill -f "repet/serveur-ftp.py" 2>/dev/null
    rm -rf $R; mkdir -p $R/serveur
    git -C /home/claude/pub/infomaniak archive avant-publication-2026-11-22 site | tar -x -C $R/serveur --strip-components=1
    # le .htaccess du serveur : une partie qui appartient à l'hébergeur, puis notre bloc, tel qu'il est en ligne depuis le 16 novembre
    { printf '# Reglages poses par l hebergeur (repetition)\nOptions -Indexes\n'
      echo "# >>> parent-ecoute.ch : debut (gere par la mise en ligne automatique, ne pas modifier a la main)"
      git -C /home/claude/pub/infomaniak show avant-publication-2026-11-22:outils/htaccess-bloc.txt | tr -d '\r'
      echo "# <<< parent-ecoute.ch : fin"; } > $R/serveur/.htaccess
    cp $R/serveur/.htaccess $R/htaccess.depart
    (cd $R/serveur && find . -type f | LC_ALL=C sort | xargs sha256sum) > $R/depart.sha
    serveurs
    echo "serveur de répétition : $(find $R/serveur -type f | wc -l) fichiers, $(du -sh $R/serveur | cut -f1), dont essai/ $(find $R/serveur/essai -type f | wc -l) fichiers"
    ;;
  joue)
    B="${2:-/home/claude/pub/infomaniak}"
    serveurs
    rm -rf $R/depot; mkdir -p $R/depot; cp -a "$B/outils" "$B/site" $R/depot/
    printf 'HOTE_FTP=localhost:%s\nUTILISATEUR_FTP=repet\nDOSSIER=sites/parent-ecoute.ch\nADRESSE=https://localhost:%s\n' $PORT_FTP $PORT_HTTP > $R/depot/outils/reglages.env
    cd $R/depot
    echo "=== dépôt"; FTP_PASSWORD="$REPET_MOT" bash outils/deposer.sh 2>&1 | sed 's/%0A/\n    /g' | cut -c1-1500; echo "code du dépôt : ${PIPESTATUS[0]}"
    echo "=== contrôle"; bash outils/verifier.sh 2>&1 | sed 's/%0A/\n    /g' | cut -c1-1500; echo "code du contrôle : ${PIPESTATUS[0]}"
    ;;
  arret)
    pkill -f "repet/serveur-http.js" 2>/dev/null; pkill -f "repet/serveur-ftp.py" 2>/dev/null; echo "serveurs de répétition arrêtés" ;;
  *) echo "usage : repet.sh depart | joue [dossier de la branche] | arret" >&2; exit 2 ;;
esac
