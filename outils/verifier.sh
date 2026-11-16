#!/usr/bin/env bash
# Compare le site en ligne avec les fichiers de site/, puis regarde quelques adresses.
# Le résultat est écrit en notes, visibles sur la page de la mise en ligne dans GitHub.
# Sans dépôt (réglage pas terminé), ce script ne fait que constater. Après un dépôt, il échoue si le site ne correspond pas.
set -uo pipefail
cd "$(dirname "$0")/.."
. outils/reglages.env

adresse="${ADRESSE%/}"
hote="${adresse#https://}"
depose=0; [ -f /tmp/depose ] && depose=1
tmp="$(mktemp -d)"
va() { curl --silent --show-error --max-time 30 -A "controle-de-mise-en-ligne" "$@"; }
note() { local t="$1"; shift; local m; m="$(printf '%s\n' "$@" | sed 's/%/%25/g' | tr -d '\r' | sed ':a;N;$!ba;s/\n/%0A/g')"; echo "::notice title=$t::$m"; }

# 1. Après un dépôt, attendre que la nouvelle version soit servie
version_ok=1
if [ "$depose" = 1 ] && [ -f site/version.txt ]; then
  version_ok=0
  attendu="$(tr -d '\r\n' < site/version.txt)"
  for _ in 1 2 3 4 5 6 7 8; do
    recu="$(va "$adresse/version.txt?c=$RANDOM" 2>/dev/null | tr -d '\r\n')" || true
    if [ "$recu" = "$attendu" ]; then version_ok=1; break; fi
    sleep 5
  done
fi

# 2. Chaque fichier en ligne est-il identique à celui de site/ ?
total=0; pareils=0; differents=""
while IFS= read -r f; do
  total=$((total + 1))
  code="$(va -o "$tmp/recu" -w '%{http_code}' "$adresse/$f?c=$RANDOM" 2>/dev/null)" || true
  if [ "$code" = 200 ] && [ "$(sha256sum < "$tmp/recu")" = "$(sha256sum < "site/$f")" ]; then
    pareils=$((pareils + 1))
  else
    differents="$differents $f($code)"
  fi
done < <(cd site && find . -type f ! -name '.htaccess' -printf '%P\n' | LC_ALL=C sort)
note "Fichiers en ligne" "$pareils fichiers sur $total sont identiques à ceux de site/. Différents :${differents:- aucun}"

# 3. Quelques adresses : code de réponse, type annoncé, renvoi éventuel
vue() {   # vue "nom" adresse [options de curl]
  local r code type vers
  r="$(va -o /dev/null -w '%{http_code}|%{content_type}|%{redirect_url}' "${@:2}" 2>/dev/null)" || true
  IFS='|' read -r code type vers <<< "$r"
  printf '%s : %s' "$1" "${code:-pas de réponse}"
  [ -n "${type:-}" ] && printf ', %s' "$type"
  [ -n "${vers:-}" ] && printf ', renvoie vers %s' "$vers"
  return 0
}
fausse="$(va "$adresse/cette-page-n-existe-pas-$RANDOM" 2>/dev/null)" || true
notre404="non"; printf '%s' "$fausse" | grep -q "Parent" && notre404="oui"
note "Adresses" \
  "$(vue "accueil" "$adresse/")" \
  "$(vue "conditions" "$adresse/conditions.html")" \
  "$(vue "adresse fausse" "$adresse/cette-page-n-existe-pas") | notre page 404 : $notre404" \
  "$(vue "sans https" "http://$hote/")" \
  "$(vue "avec www" "https://www.$hote/")" \
  "$(vue "archive zip" "$adresse/parent-ecoute-site-2.zip" -I)" \
  "$(vue ".htaccess" "$adresse/.htaccess")" \
  "$(vue ".user.ini" "$adresse/.user.ini")" \
  "$(vue "page de maintenance" "$adresse/.infomaniak-maintenance.html")" \
  "$(vue "manifest" "$adresse/manifest.webmanifest")" \
  "$(vue "police" "$adresse/fonts/nunito.woff2")" \
  "$(vue "script" "$adresse/app.js")" \
  "$(vue "plan du site" "$adresse/sitemap.xml")" \
  "$(vue "robots" "$adresse/robots.txt")"

# 4. Les en-têtes de la page d'accueil
entetes="$(va -D - -o /dev/null -H 'Accept-Encoding: gzip, br' -w 'http %{http_version}\n' "$adresse/" 2>/dev/null \
  | tr -d '\r' | grep -i -E '^(http|content-type|content-encoding|cache-control|expires|strict-transport-security|x-frame-options|x-content-type-options|referrer-policy|content-security-policy|server|last-modified|etag|alt-svc|vary)' )" || true
note "En-têtes de l'accueil" "${entetes:-aucun en-tête lu}"

# 5. Le courrier du nom de domaine : où il arrive, et qui a le droit d'en envoyer (lu dans le DNS public)
dns() {
  va -H 'accept: application/dns-json' "https://cloudflare-dns.com/dns-query?name=$1&type=$2" 2>/dev/null | python3 -c '
import json, sys
try:
    d = json.load(sys.stdin)
    print(" ; ".join(a.get("data", "") for a in d.get("Answer", [])) or "rien")
except Exception:
    print("pas de réponse")' 2>/dev/null || true
}
note "Courrier" "MX : $(dns "$hote" MX)" "TXT : $(dns "$hote" TXT)" "DMARC : $(dns "_dmarc.$hote" TXT)"

# 6. Verdict
if [ "$depose" = 1 ]; then
  if [ "$version_ok" != 1 ]; then
    echo "::error title=Ancienne version::Le dépôt s'est bien passé, mais $adresse/version.txt ne montre pas la nouvelle version."
    exit 1
  fi
  if [ -n "$differents" ]; then
    echo "::error title=Site incomplet::Des fichiers en ligne ne correspondent pas à ceux de site/ :$differents"
    exit 1
  fi
fi
exit 0
