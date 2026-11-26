#!/usr/bin/env bash
# Dépose le contenu de site/ dans le dossier du site, chez Infomaniak.
# Connexion FTP chiffrée (TLS explicite, port 21). Le mot de passe vient du secret FTP_PASSWORD du dépôt.
# Ce script n'envoie pas les fichiers qu'Infomaniak gère lui-même (.htaccess, .user.ini, .infomaniak-*).
# Il ne retire du serveur que ce qui est nommé dans outils/a-supprimer.txt : des fichiers, un par un, et des dossiers une fois vides.
set -uo pipefail
cd "$(dirname "$0")/.."
. outils/reglages.env

rm -f /tmp/depose
erreur() { echo "::error title=$1::$2"; }

utilisateur="$(printf '%s' "${UTILISATEUR_FTP:-}" | tr -d '[:space:]')"
mot="$(printf '%s' "${FTP_PASSWORD:-}" | tr -d '\r\n')"

if [ -z "$utilisateur" ]; then
  echo "::warning title=Réglage pas terminé::Le nom du compte FTP n'est pas encore inscrit dans outils/reglages.env. Rien n'a été déposé."
  exit 0
fi
if [ -z "$mot" ]; then
  erreur "Mot de passe absent" "Le secret FTP_PASSWORD n'existe pas dans ce dépôt (Settings, Secrets and variables, Actions). Rien n'a été déposé."
  exit 1
fi

commun=(--silent --show-error --ssl-reqd --connect-timeout 20 --max-time 180 --user "$utilisateur:$mot")

# Ce que curl a répondu, sur une ligne, sans le mot de passe
message() {
  local m
  m="$(tr -d '\r' < /tmp/err | tail -n 3 | tr '\n' ' ')"
  m="${m//"$mot"/***}"
  printf '%s' "${m//%/%25}"
}

# 1. Se connecter et regarder où l'on arrive. Deuxième essai en TLS 1.2 si le premier échoue.
mode=""; liste=""; ouvert=0
for essai in "" "--tls-max 1.2"; do
  # shellcheck disable=SC2086
  if liste="$(curl "${commun[@]}" $essai --list-only "ftp://$HOTE_FTP/" 2>/tmp/err)"; then
    mode="$essai"; ouvert=1; break
  fi
done
if [ "$ouvert" != 1 ]; then
  erreur "Connexion refusée" "Impossible d'ouvrir le dossier chez Infomaniak. Réponse : $(message). Rien n'a été déposé."
  exit 1
fi
liste="$(printf '%s\n' "$liste" | tr -d '\r')"

# 2. Ne déposer que si l'on est bien dans le dossier du site
premier="${DOSSIER%%/*}"
if printf '%s\n' "$liste" | grep -qxF 'index.html'; then
  base="/"
elif printf '%s\n' "$liste" | grep -qxF "$premier"; then
  base="/$DOSSIER/"
  # shellcheck disable=SC2086
  dedans="$(curl "${commun[@]}" $mode --list-only "ftp://$HOTE_FTP$base" 2>/tmp/err | tr -d '\r')" || true
  if ! printf '%s\n' "$dedans" | grep -qxF 'index.html'; then
    erreur "Dossier inattendu" "Le dossier $DOSSIER ne contient pas de page d'accueil. Rien n'a été déposé."
    exit 1
  fi
else
  erreur "Dossier inattendu" "Le compte n'arrive pas dans le dossier du site : ni index.html ni $premier/ à l'arrivée. Rien n'a été déposé."
  exit 1
fi

# 3. Déposer : d'abord les images, les polices, les styles et les scripts, puis les pages, puis version.txt.
#    Un fichier déjà identique en ligne n'est pas renvoyé (les photos et les polices ne changent presque jamais) :
#    on le relit par son adresse publique et on le compare octet par octet. Si le site ne répond pas, tout est renvoyé.
#    version.txt est toujours renvoyé, en dernier. Le contrôle qui suit (verifier.sh) compare de toute façon chaque fichier.
cd site
mapfile -t tous < <(find . -type f ! -name '.htaccess' ! -name '.user.ini' ! -name '.infomaniak*' -printf '%P\n' | LC_ALL=C sort)
ordre=()
for f in "${tous[@]}"; do case "$f" in *.html|version.txt) ;; *) ordre+=("$f") ;; esac; done
for f in "${tous[@]}"; do case "$f" in *.html) ordre+=("$f") ;; esac; done
[ -f version.txt ] && ordre+=(version.txt)

a_envoyer=(); identiques=0
for f in "${ordre[@]}"; do
  if [ "$f" != version.txt ] \
     && curl --silent --fail --max-time 30 -o /tmp/en-ligne "${ADRESSE%/}/$f?c=$RANDOM$RANDOM" 2>/dev/null \
     && cmp -s /tmp/en-ligne "$f"; then
    identiques=$((identiques + 1))
  else
    a_envoyer+=("$f")
  fi
done

envoi=()
for f in "${a_envoyer[@]}"; do envoi+=(--upload-file "$f" "ftp://$HOTE_FTP$base$f"); done

if [ "${#envoi[@]}" -gt 0 ]; then
  # shellcheck disable=SC2086
  # Un premier envoi peut compter plusieurs centaines de fichiers (une version d'essai entière, par exemple), ou plusieurs films de 17 Mo : on lui laisse 30 minutes au lieu de 3.
  if ! curl "${commun[@]}" $mode --max-time 1800 --fail-early --ftp-create-dirs "${envoi[@]}" 2>/tmp/err; then
    erreur "Dépôt interrompu" "L'envoi s'est arrêté en route. Réponse : $(message). Le site peut être dans un état intermédiaire : relancer la mise en ligne."
    exit 1
  fi
  # Relire ce qui vient d'être envoyé : un fichier arrivé incomplet est renvoyé une fois.
  refaire=()
  for f in "${a_envoyer[@]}"; do
    [ "$f" = version.txt ] && continue
    if curl --silent --fail --max-time 30 -o /tmp/en-ligne "${ADRESSE%/}/$f?c=$RANDOM$RANDOM" 2>/dev/null && ! cmp -s /tmp/en-ligne "$f"; then
      refaire+=("$f")
    fi
  done
  if [ "${#refaire[@]}" -gt 0 ]; then
    envoi=()
    for f in "${refaire[@]}"; do envoi+=(--upload-file "$f" "ftp://$HOTE_FTP$base$f"); done
    # shellcheck disable=SC2086
    curl "${commun[@]}" $mode --ftp-create-dirs "${envoi[@]}" 2>/tmp/err || true
    echo "::notice title=Envoi refait::${#refaire[@]} fichier(s) arrivé(s) incomplet(s), renvoyé(s) une fois : ${refaire[*]}"
  fi
fi
touch /tmp/depose

# 4. Retirer du serveur ce qui est nommé dans outils/a-supprimer.txt, et rien d'autre.
#    Jamais un fichier du site, jamais un fichier d'Infomaniak.
#    Un nom terminé par une barre (essai/son/) désigne un dossier. Il n'est retiré que s'il est vide : c'est le serveur lui-même
#    qui refuse de retirer un dossier où il reste quelque chose. Les dossiers passent après les fichiers, les plus profonds d'abord.
#    Chaque nom est d'abord relu par son adresse publique : ce qui n'existe déjà plus n'est pas redemandé.
#    Tout part ensuite dans une seule connexion (une connexion par nom, répétée des centaines de fois, ferait travailler le serveur pour rien),
#    puis chaque nom est relu une seconde fois, pour dire ce qui a réellement disparu.
repond() { curl --silent --max-time 30 -o /dev/null -w '%{http_code}' "${ADRESSE%/}/$1?c=$RANDOM$RANDOM" 2>/dev/null || true; }
resume() {   # resume "nom1 nom2 …" : tous les noms s'il y en a peu, sinon leur nombre et les premiers
  local -a t; read -r -a t <<< "$1"
  if [ "${#t[@]}" = 0 ]; then printf ' rien'
  elif [ "${#t[@]}" -le 12 ]; then printf ' %s' "${t[*]}"
  else printf ' %s noms (%s, …)' "${#t[@]}" "${t[*]:0:4}"; fi
}
fichiers=(); dossiers=()
if [ -f ../outils/a-supprimer.txt ]; then
  while IFS= read -r nom || [ -n "$nom" ]; do
    nom="$(printf '%s' "$nom" | tr -d '\r' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
    case "$nom" in '' | '#'*) continue ;; esac
    case "$nom" in
      /* | *..* | *' '* | *'*'* | *'?'* | *//* | .htaccess | */.htaccess | .user.ini | */.user.ini | .infomaniak* | */.infomaniak*)
        echo "::warning title=Suppression refusée::$nom n'est pas un nom que ce script accepte de retirer."
        continue ;;
    esac
    if [ -e "${nom%/}" ]; then
      echo "::warning title=Suppression refusée::$nom fait partie du site."
      continue
    fi
    case "$nom" in */) dossiers+=("${nom%/}") ;; *) fichiers+=("$nom") ;; esac
  done < ../outils/a-supprimer.txt
fi
# ce qui répond encore en ligne (un renvoi vers une autre adresse ou une réponse 404 veut dire qu'il n'y a plus rien à retirer)
f_la=(); d_la=0; d_tries=()
for f in "${fichiers[@]:-}"; do
  [ -n "$f" ] || continue
  case "$(repond "$f")" in 404 | 410 | 30?) ;; *) f_la+=("$f") ;; esac
done
if [ "${#dossiers[@]}" -gt 0 ]; then
  mapfile -t d_tries < <(printf '%s\n' "${dossiers[@]}" | awk -F/ '{ print NF "\t" $0 }' | LC_ALL=C sort -t "$(printf '\t')" -k1,1nr -k2,2 | cut -f2-)
  for d in "${d_tries[@]}"; do
    case "$(repond "$d/")" in 404 | 410 | 30?) ;; *) d_la=$((d_la + 1)) ;; esac
  done
fi
retires=""; restes=""; d_retires=""; d_restes=""
if [ "${#f_la[@]}" -gt 0 ] || [ "$d_la" -gt 0 ]; then
  # Dès qu'il reste quelque chose à retirer, tous les dossiers nommés sont redemandés : un dossier sans page d'accueil peut répondre 404
  # par son adresse alors qu'il existe encore. Demander de retirer un dossier absent ne fait rien.
  demandes=()
  for f in "${f_la[@]:-}"; do [ -n "$f" ] && demandes+=(-Q "*DELE ${base#/}$f"); done
  for d in "${d_tries[@]:-}"; do [ -n "$d" ] && demandes+=(-Q "*RMD ${base#/}$d"); done
  # shellcheck disable=SC2086
  if ! curl "${commun[@]}" $mode --max-time 900 --list-only "${demandes[@]}" "ftp://$HOTE_FTP/" >/dev/null 2>/tmp/err; then
    echo "::warning title=Suppression::La demande de suppression ne s'est pas terminée normalement. Réponse : $(message)."
  fi
  for f in "${f_la[@]:-}"; do
    [ -n "$f" ] || continue
    c="$(repond "$f")"
    case "$c" in 404 | 410) retires="$retires $f" ;; *) restes="$restes $f($c)" ;; esac
  done
  for d in "${d_tries[@]:-}"; do
    [ -n "$d" ] || continue
    c="$(repond "$d/")"
    case "$c" in 404 | 410) d_retires="$d_retires $d/" ;; *) d_restes="$d_restes $d/($c)" ;; esac
  done
  [ -n "$restes" ] && echo "::warning title=Suppression incomplète::Ces fichiers répondent encore après la demande :$(resume "$restes")"
  [ -n "$d_restes" ] && echo "::warning title=Dossiers encore là::Ces dossiers répondent encore après la demande (un dossier n'est retiré que s'il est vide) :$(resume "$d_restes")"
fi

arrivee="directement dans le dossier du site"
[ "$base" != "/" ] && arrivee="à la racine de l'hébergement, puis dans $DOSSIER"
echo "::notice title=Dépôt::${#a_envoyer[@]} fichiers déposés, $identiques déjà identiques en ligne et laissés tels quels. Le compte arrive $arrivee. Fichiers retirés du serveur :$(resume "$retires"). Dossiers qui ne répondent plus après cette demande :$(resume "$d_retires")"

# 5. Les réglages du serveur. Le fichier .htaccess appartient à Infomaniak : on n'y change rien, on ajoute seulement
#    à la fin un bloc à nous, entre deux repères (outils/htaccess-bloc.txt). Si le site ne répond plus juste après,
#    on remet aussitôt le fichier d'avant.
[ -f ../outils/htaccess-bloc.txt ] || exit 0
debut="# >>> parent-ecoute.ch : debut (gere par la mise en ligne automatique, ne pas modifier a la main)"
fin="# <<< parent-ecoute.ch : fin"
ht_avant=/tmp/ht.avant; ht_socle=/tmp/ht.socle; ht_nouveau=/tmp/ht.nouveau
ht_url="ftp://$HOTE_FTP$base.htaccess"

# shellcheck disable=SC2086
curl "${commun[@]}" $mode -o "$ht_avant" "$ht_url" 2>/tmp/err; lu=$?
if [ "$lu" = 78 ]; then
  : > "$ht_avant"          # pas de .htaccess sur le serveur
elif [ "$lu" != 0 ]; then
  erreur "Réglages du serveur non lus" "Impossible de lire le .htaccess du serveur. Réponse : $(message). Il n'a pas été modifié."
  exit 1
fi

# ce qu'il y avait avant nous : tout, sauf notre bloc s'il y est déjà
sed '/^# >>> parent-ecoute\.ch/,/^# <<< parent-ecoute\.ch/d' "$ht_avant" > "$ht_socle"
if [ -s "$ht_socle" ] && [ "$(tail -c 1 "$ht_socle" | wc -l)" = 0 ]; then echo >> "$ht_socle"; fi
{ cat "$ht_socle"; echo "$debut"; tr -d '\r' < ../outils/htaccess-bloc.txt; echo "$fin"; } > "$ht_nouveau"

if cmp -s "$ht_avant" "$ht_nouveau"; then
  echo "::notice title=Réglages du serveur::Déjà en place, rien à changer."
  exit 0
fi

# une copie du fichier d'Infomaniak, tel qu'il était avant notre premier passage (protégée comme tout fichier .ht*)
if [ -s "$ht_avant" ] && ! grep -q '^# >>> parent-ecoute\.ch' "$ht_avant"; then
  # shellcheck disable=SC2086
  curl "${commun[@]}" $mode --upload-file "$ht_avant" "ftp://$HOTE_FTP$base.htaccess.avant-parent-ecoute" 2>/tmp/err \
    || echo "::warning title=Copie de secours::La copie du .htaccess d'origine n'a pas pu être déposée. Réponse : $(message)."
fi

accueil_ok() {   # la page d'accueil répond-elle, identique à celle de site/ ?
  local i code
  for i in 1 2 3; do
    code="$(curl --silent --show-error --max-time 20 -o /tmp/ht.accueil -w '%{http_code}' "${ADRESSE%/}/?c=$RANDOM" 2>/dev/null)" || true
    if [ "$code" = 200 ] && [ "$(sha256sum < /tmp/ht.accueil)" = "$(sha256sum < index.html)" ]; then return 0; fi
    sleep 2
  done
  echo "$code" > /tmp/ht.code
  return 1
}

# shellcheck disable=SC2086
if ! curl "${commun[@]}" $mode --upload-file "$ht_nouveau" "$ht_url" 2>/tmp/err; then
  erreur "Réglages du serveur non déposés" "Le .htaccess n'a pas pu être envoyé. Réponse : $(message)."
  exit 1
fi
sleep 2
if accueil_ok; then
  echo "::notice title=Réglages du serveur::Bloc ajouté à la fin du .htaccess ($(wc -l < ../outils/htaccess-bloc.txt) lignes). Ce qui précède n'a pas changé ($(wc -l < "$ht_socle") lignes)."
else
  # shellcheck disable=SC2086
  if [ -s "$ht_avant" ]; then
    curl "${commun[@]}" $mode --upload-file "$ht_avant" "$ht_url" 2>/tmp/err; remis=$?
  else
    curl "${commun[@]}" $mode --list-only -Q "DELE ${base#/}.htaccess" "ftp://$HOTE_FTP/" >/dev/null 2>/tmp/err; remis=$?
  fi
  suite="Le fichier d'avant a été remis"
  if [ "$remis" != 0 ]; then suite="ATTENTION, le fichier d'avant n'a pas pu être remis"
  elif accueil_ok; then suite="$suite et le site répond de nouveau"
  else suite="$suite mais le site ne répond toujours pas comme attendu"; fi
  erreur "Réglages du serveur refusés" "Avec le nouveau bloc, la page d'accueil a répondu $(cat /tmp/ht.code 2>/dev/null) au lieu de 200. $suite."
  exit 1
fi
