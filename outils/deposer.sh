#!/usr/bin/env bash
# Dépose le contenu de site/ dans le dossier du site, chez Infomaniak.
# Connexion FTP chiffrée (TLS explicite, port 21). Le mot de passe vient du secret FTP_PASSWORD du dépôt.
# Ce script n'envoie pas les fichiers qu'Infomaniak gère lui-même (.htaccess, .user.ini, .infomaniak-*).
# Il ne retire du serveur que les fichiers nommés un par un dans outils/a-supprimer.txt.
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

# 3. Déposer : d'abord les images, les polices, les styles et les scripts, puis les pages, puis version.txt
cd site
mapfile -t tous < <(find . -type f ! -name '.htaccess' ! -name '.user.ini' ! -name '.infomaniak*' -printf '%P\n' | LC_ALL=C sort)
ordre=()
for f in "${tous[@]}"; do case "$f" in *.html|version.txt) ;; *) ordre+=("$f") ;; esac; done
for f in "${tous[@]}"; do case "$f" in *.html) ordre+=("$f") ;; esac; done
[ -f version.txt ] && ordre+=(version.txt)

envoi=()
for f in "${ordre[@]}"; do envoi+=(--upload-file "$f" "ftp://$HOTE_FTP$base$f"); done

# shellcheck disable=SC2086
if ! curl "${commun[@]}" $mode --fail-early --ftp-create-dirs "${envoi[@]}" 2>/tmp/err; then
  erreur "Dépôt interrompu" "L'envoi s'est arrêté en route. Réponse : $(message). Le site peut être dans un état intermédiaire : relancer la mise en ligne."
  exit 1
fi
touch /tmp/depose

# 4. Retirer du serveur les seuls fichiers nommés un par un dans outils/a-supprimer.txt.
#    Jamais un fichier du site, jamais un fichier d'Infomaniak, jamais un dossier.
retires=""
if [ -f ../outils/a-supprimer.txt ]; then
  while IFS= read -r nom || [ -n "$nom" ]; do
    nom="$(printf '%s' "$nom" | tr -d '\r' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
    case "$nom" in '' | '#'*) continue ;; esac
    case "$nom" in
      /* | *..* | *' '* | .htaccess | */.htaccess | .user.ini | */.user.ini | .infomaniak* | */.infomaniak*)
        echo "::warning title=Suppression refusée::$nom n'est pas un nom que ce script accepte de retirer."
        continue ;;
    esac
    if [ -e "$nom" ]; then
      echo "::warning title=Suppression refusée::$nom fait partie du site."
      continue
    fi
    # shellcheck disable=SC2086
    if curl "${commun[@]}" $mode --list-only -Q "DELE ${base#/}$nom" "ftp://$HOTE_FTP/" >/dev/null 2>/tmp/err; then
      retires="$retires $nom"
    fi
  done < ../outils/a-supprimer.txt
fi

arrivee="directement dans le dossier du site"
[ "$base" != "/" ] && arrivee="à la racine de l'hébergement, puis dans $DOSSIER"
echo "::notice title=Dépôt::${#ordre[@]} fichiers déposés. Le compte arrive $arrivee. Retirés du serveur :${retires:- rien}"
