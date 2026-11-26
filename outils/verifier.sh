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
#    Les dossiers nommés dans outils/proteges.txt sont fermés par un mot de passe chez l'hébergeur : leurs fichiers ne peuvent pas
#    être relus. On vérifie alors l'inverse, c'est-à-dire que le serveur demande bien un mot de passe (réponse 401).
proteges=()
if [ -f outils/proteges.txt ]; then
  while IFS= read -r l || [ -n "$l" ]; do
    l="$(printf '%s' "$l" | tr -d '\r' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
    case "$l" in '' | '#'*) continue ;; esac
    proteges+=("${l%/}/")
  done < outils/proteges.txt
fi
est_protege() { local p; for p in "${proteges[@]:-}"; do [ -n "$p" ] && case "$1" in "$p"*) return 0 ;; esac; done; return 1; }

total=0; pareils=0; differents=""; fermes=0; ouverts=""
while IFS= read -r f; do
  total=$((total + 1))
  code="$(va -o "$tmp/recu" -w '%{http_code}' "$adresse/$f?c=$RANDOM" 2>/dev/null)" || true
  if est_protege "$f" && [ "$code" = 401 ]; then
    fermes=$((fermes + 1))
  elif [ "$code" = 200 ] && [ "$(sha256sum < "$tmp/recu")" = "$(sha256sum < "site/$f")" ]; then
    pareils=$((pareils + 1))
    est_protege "$f" && ouverts="$ouverts $f"
  else
    differents="$differents $f($code)"
  fi
done < <(cd site && find . -type f ! -name '.htaccess' -printf '%P\n' | LC_ALL=C sort)
note "Fichiers en ligne" "$pareils fichiers sur $total sont identiques à ceux de site/. Différents :${differents:- aucun}"
if [ "$fermes" -gt 0 ]; then
  note "Dossier fermé" "$fermes fichier(s) d'un dossier protégé demandent un mot de passe (réponse 401). Ils ne sont pas relus."
fi
if [ -n "$ouverts" ]; then
  echo "::warning title=Dossier pas encore fermé::Ces fichiers devraient demander un mot de passe et répondent sans :$ouverts. La protection se règle chez l'hébergeur (Sécurité, Protection de dossiers)."
fi

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
  "$(vue "image d'une carte" "$adresse/img/pictos/dents.svg")" \
  "$(vue "script" "$adresse/app.js")" \
  "$(vue "tableau de bord" "$adresse/antonio/")" \
  "$(vue "ancien tableau de bord" "$adresse/antonio.html")" \
  "$(vue "plan du site" "$adresse/sitemap.xml")" \
  "$(vue "robots" "$adresse/robots.txt")"

# 3 bis. Ce que le site contient depuis le 26 novembre 2026 : tout ce qui avait été mis au point dans la version d'essai.
#        Les situations ouvertes par leur adresse (avec et sans la barre finale), la page du relais, le son, le film et la capsule.
if [ -f site/fiches/index.html ]; then
  fiche="fiches/quand-il-ou-elle-vit-ailleurs"
  # Chaque page est d'abord enregistrée, puis lue. Chercher dans ce que curl envoie au fil de l'eau coupait la lecture dès le premier mot trouvé,
  # et la note disait « non » pour une consigne pourtant bien présente en haut de page.
  va -o "$tmp/fiche" "$adresse/$fiche/" 2>/dev/null || true
  va -o "$tmp/accueil" "$adresse/" 2>/dev/null || true
  titre="non"; grep -q '<h1[^>]*>Quand il ou elle vit ailleurs</h1>' "$tmp/fiche" 2>/dev/null && titre="oui"
  consigne="non"; grep -q 'name="robots" content="index,follow"' "$tmp/accueil" 2>/dev/null && consigne="oui"
  note "Les situations et le relais" \
    "accueil | consigne index,follow : $consigne" \
    "$(vue "liste des situations" "$adresse/fiches/")" \
    "$(vue "une fiche par son adresse" "$adresse/$fiche/") | la fiche est écrite dans la page : $titre" \
    "$(vue "la même sans barre finale" "$adresse/$fiche")" \
    "$(vue "image d'aperçu de la fiche" "$adresse/img/fiches/quand-il-ou-elle-vit-ailleurs.jpg")" \
    "$(vue "la page du relais, celle qu'ouvre un proche" "$adresse/relais/")" \
    "$(vue "la page à transmettre à une famille" "$adresse/transmettre/")" \
    "$(vue "l'ancienne adresse de l'atelier" "$adresse/atelier/")"
fi
# Le son de l'étang : les fichiers répondent-ils, avec le bon type, et le serveur sait-il en envoyer un morceau seulement ?
# (le lecteur audio ordinaire, qui sert de secours pour l'instant de la dose sur les anciens iPhone, lit le fichier par morceaux)
if [ -f site/son/notes.mp3 ]; then
  morceau="$(va -D - -o /dev/null -H 'Range: bytes=0-1023' "$adresse/son/instant.mp3" 2>/dev/null \
    | tr -d '\r' | grep -i -E '^(http|content-type|content-range|accept-ranges|content-length|cache-control|expires)' | tr '\n' ' ')" || true
  note "Le son de l'étang" \
    "$(vue "les notes de piano de la respiration" "$adresse/son/notes.mp3")" \
    "$(vue "la boucle d'eau de la respiration" "$adresse/son/eau.mp3")" \
    "$(vue "l'instant de 40 secondes" "$adresse/son/instant.mp3")" \
    "un morceau du fichier seulement (réponse attendue : 206) : ${morceau:-pas de réponse}"
fi
# Le film de présentation « Ce qu'on ne dit pas par SMS » : ses fichiers répondent-ils, annoncés comme des vidéos, et le serveur sait-il en envoyer un morceau seulement ?
# (un iPhone ne lit une vidéo que si le serveur sait la donner par morceaux)
if [ -f site/film/ce-quon-ne-dit-pas-par-sms-vertical.mp4 ]; then
  morceau="$(va -D - -o /dev/null -H 'Range: bytes=0-1023' "$adresse/film/ce-quon-ne-dit-pas-par-sms-vertical.mp4" 2>/dev/null \
    | tr -d '\r' | grep -i -E '^(http|content-type|content-range|accept-ranges|content-length|cache-control|expires|x-content-type-options)' | tr '\n' ' ')" || true
  note "Le film de présentation" \
    "$(vue "le film vertical" "$adresse/film/ce-quon-ne-dit-pas-par-sms-vertical.mp4" -I)" \
    "$(vue "le film horizontal" "$adresse/film/ce-quon-ne-dit-pas-par-sms-horizontal.mp4" -I)" \
    "$(vue "la bande-annonce verticale de 30 secondes, à télécharger" "$adresse/film/ce-quon-ne-dit-pas-par-sms-bande-annonce.mp4" -I)" \
    "$(vue "les crédits du film" "$adresse/film/credits.txt")" \
    "$(vue "l'image d'aperçu" "$adresse/film/apercu-film.webp")" \
    "$(vue "un ancien montage gardé pour comparer dans l'essai (ne doit pas exister ici : 404 attendu)" "$adresse/film/ce-quon-ne-dit-pas-par-sms-vertical-version-2.mp4" -I)" \
    "un morceau du fichier seulement (réponse attendue : 206) : ${morceau:-pas de réponse}"
fi
# La capsule de respiration « Et vous ? » (35 secondes)
if [ -f site/film/et-vous-vertical.mp4 ]; then
  morceau="$(va -D - -o /dev/null -H 'Range: bytes=0-1023' "$adresse/film/et-vous-vertical.mp4" 2>/dev/null \
    | tr -d '\r' | grep -i -E '^(http|content-type|content-range|accept-ranges|content-length|cache-control|expires|x-content-type-options)' | tr '\n' ' ')" || true
  note "La capsule de respiration" \
    "$(vue "le film vertical" "$adresse/film/et-vous-vertical.mp4" -I)" \
    "$(vue "le film horizontal" "$adresse/film/et-vous-horizontal.mp4" -I)" \
    "$(vue "l'export vertical pour Instagram, à télécharger" "$adresse/film/et-vous-instagram.mp4" -I)" \
    "$(vue "l'image d'aperçu" "$adresse/film/apercu.webp")" \
    "$(vue "l'extrait de 5 secondes de l'essai (ne doit pas exister ici : 404 attendu)" "$adresse/film/et-vous-raccord-5s.mp4" -I)" \
    "un morceau du fichier seulement (réponse attendue : 206) : ${morceau:-pas de réponse}"
fi

# 3 ter. L'ancienne version d'essai (…/essai/). Tout son contenu a été publié sur le site le 26 novembre 2026, puis elle a été retirée.
#        Quand les réglages du serveur portent le renvoi (outils/htaccess-bloc.txt), chacune de ses anciennes adresses doit mener à la même page du site :
#        les liens déjà envoyés (une fiche, une fiche de relais, le film) continuent ainsi de s'ouvrir. Sans ce renvoi, on constate seulement.
: > "$tmp/renvois-faux"
renvoie() {   # renvoie "nom" chemin adresse-attendue
  local r code vers
  r="$(va -o /dev/null -w '%{http_code}|%{redirect_url}' "$adresse/$2" 2>/dev/null)" || true
  IFS='|' read -r code vers <<< "$r"
  if [ "$code" = 302 ] && [ "$vers" = "$3" ]; then
    printf '%s : 302, renvoie vers %s' "$1" "$vers"
  else
    printf '%s : %s%s | ATTENDU : 302 vers %s' "$1" "${code:-pas de réponse}" "${vers:+, renvoie vers $vers}" "$3"
    echo "$2" >> "$tmp/renvois-faux"
  fi
}
renvoi_essai=0; grep -q '^RewriteRule \^essai' outils/htaccess-bloc.txt 2>/dev/null && renvoi_essai=1
if [ "$renvoi_essai" = 1 ]; then
  note "Anciennes adresses de la version d'essai" \
    "$(renvoie "l'accueil de l'essai" "essai/" "$adresse/")" \
    "$(renvoie "le même sans barre finale" "essai" "$adresse/")" \
    "$(renvoie "une fiche" "essai/fiches/quand-il-ou-elle-vit-ailleurs/" "$adresse/fiches/quand-il-ou-elle-vit-ailleurs/")" \
    "$(renvoie "la page du relais, celle qu'ouvre un proche" "essai/relais/" "$adresse/relais/")" \
    "$(renvoie "la page à transmettre" "essai/transmettre/" "$adresse/transmettre/")" \
    "$(renvoie "le film vertical" "essai/film/ce-quon-ne-dit-pas-par-sms-vertical.mp4" "$adresse/film/ce-quon-ne-dit-pas-par-sms-vertical.mp4")" \
    "$(renvoie "le script de l'essai" "essai/app.js" "$adresse/app.js")" \
    "$(vue "une adresse qui commence seulement par les mêmes lettres (404 attendu, pas de renvoi)" "$adresse/essais")"
else
  note "Ancienne version d'essai" \
    "$(vue "l'accueil de l'essai" "$adresse/essai/")" \
    "Le renvoi de ses anciennes adresses vers le site n'est pas encore dans les réglages du serveur."
fi

# 3 quater. La préversion (…/preversion/) : une copie de travail du site, à une adresse à part, pour qu'Antonio essaie une amélioration
#           sur son téléphone avant qu'elle soit publiée. Les moteurs de recherche ne doivent pas la référencer, ce qu'on y écrit est rangé
#           à part sur l'appareil, et elle ne contient pas le tableau de bord d'Antonio, dont le dossier n'est fermé que sur le site.
: > "$tmp/prev-faux"
if [ -f site/preversion/index.html ]; then
  va -o "$tmp/prev" "$adresse/preversion/" 2>/dev/null || true
  va -o "$tmp/prev-app" "$adresse/preversion/app.js" 2>/dev/null || true
  va -o "$tmp/plan" "$adresse/sitemap.xml" 2>/dev/null || true
  consigne="non"; grep -q 'name="robots" content="noindex,nofollow"' "$tmp/prev" 2>/dev/null && consigne="oui"
  cle="non"; grep -q 'const KEY="pepe-preversion-v1";' "$tmp/prev-app" 2>/dev/null && cle="oui"
  vente="non"; grep -q 'const VENTE="fermee";' "$tmp/prev-app" 2>/dev/null && vente="oui"
  plan="non"; grep -q 'preversion' "$tmp/plan" 2>/dev/null && plan="oui"
  tdb="$(va -o /dev/null -w '%{http_code}' "$adresse/preversion/antonio/" 2>/dev/null)" || true
  [ "$consigne" = oui ] || echo "la consigne noindex,nofollow manque" >> "$tmp/prev-faux"
  [ "$cle" = oui ] || echo "le rangement à part manque" >> "$tmp/prev-faux"
  [ "$vente" = oui ] || echo "la vente n'y est pas fermée" >> "$tmp/prev-faux"
  [ "$plan" = non ] || echo "elle est citée dans le plan du site" >> "$tmp/prev-faux"
  # 404 est la réponse attendue. Toute réponse qui ne donne rien à lire (4xx) convient : seule une page servie serait un défaut.
  case "$tdb" in 4??) ;; *) echo "un tableau de bord y répond ($tdb)" >> "$tmp/prev-faux" ;; esac
  note "La préversion" \
    "$(vue "l'accueil de la préversion" "$adresse/preversion/") | consigne noindex,nofollow : $consigne" \
    "rangement à part sur l'appareil (pepe-preversion-v1) : $cle | vente fermée pour les parents : $vente | citée dans le plan du site : $plan" \
    "$(vue "son script" "$adresse/preversion/app.js")" \
    "$(vue "la page du relais, celle qu'ouvre un proche" "$adresse/preversion/relais/")" \
    "$(vue "une fiche par son adresse" "$adresse/preversion/fiches/quand-il-ou-elle-vit-ailleurs/")" \
    "$(vue "le film vertical" "$adresse/preversion/film/ce-quon-ne-dit-pas-par-sms-vertical.mp4" -I)" \
    "$(vue "le tableau de bord (ne doit pas exister ici : 404 attendu)" "$adresse/preversion/antonio/")"
fi

# 4. Les en-têtes de la page d'accueil
entetes="$(va -D - -o /dev/null -H 'Accept-Encoding: gzip, br' -w 'http %{http_version}\n' "$adresse/" 2>/dev/null \
  | tr -d '\r' | grep -i -E '^(http|content-type|content-encoding|cache-control|expires|strict-transport-security|x-frame-options|x-content-type-options|referrer-policy|content-security-policy|server|last-modified|etag|alt-svc|vary)' )" || true
note "En-têtes de l'accueil" "${entetes:-aucun en-tête lu}"
# Les cartes-images sont des dessins SVG : le navigateur ne les affiche que si le serveur annonce le bon type (image/svg+xml).
carte="$(va -D - -o /dev/null -H 'Accept-Encoding: gzip, br' "$adresse/img/pictos/dents.svg" 2>/dev/null \
  | tr -d '\r' | grep -i -E '^(content-type|content-encoding|content-length|cache-control|x-content-type-options)' )" || true
note "En-têtes d'une carte-image" "${carte:-aucun en-tête lu}"

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
  if [ -s "$tmp/renvois-faux" ]; then
    echo "::error title=Anciennes adresses de l'essai::Ces anciennes adresses de la version d'essai ne renvoient pas vers la même page du site : $(tr '\n' ' ' < "$tmp/renvois-faux")"
    exit 1
  fi
  if [ -s "$tmp/prev-faux" ]; then
    echo "::error title=Préversion::La préversion en ligne n'est pas ce qu'elle doit être : $(tr '\n' ';' < "$tmp/prev-faux")"
    exit 1
  fi
fi
exit 0
