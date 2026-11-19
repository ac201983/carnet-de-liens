#!/usr/bin/env python3
"""Construit Parent Écouté, Parent Éclairé.

  python3 build_site.py            -> le site (dépôt GitHub : /home/claude/carnet-de-liens) + l'artefact Claude (pepe.html)

Sources : pparts/ (CSS + code de l'app), eparts/p2-content.js (contenus partagés), site-src/ (pages, script du site, images, polices, config).
Une seule base de code, deux sorties :
  - site (SITE=true)  : fichiers séparés, polices et images locales, accueil pré-écrit dans la page, pages légales, bandeau, 404, sitemap ;
  - artefact (SITE=false) : un seul fichier, écoute réelle via Claude, sans les éléments propres au site.
"""
import base64, hashlib, html, json, os, re, shutil, subprocess, sys

ROOT = os.environ.get('PEPE_ROOT', '/home/claude')   # le dossier qui contient site-src/, pparts/, eparts/ et tests/
SRC = ROOT + '/site-src'
PARTS = ROOT + '/pparts'
# PEPE_REPO et PEPE_CONFIG servent seulement aux essais : fabriquer dans un autre dossier, avec d'autres réglages, sans toucher au site.
REPO = os.environ.get('PEPE_REPO', ROOT + '/carnet-de-liens')
cfg = json.load(open(os.environ.get('PEPE_CONFIG', SRC + '/config.json'), encoding='utf-8'))
SITE_URL = cfg['site_url'].rstrip('/')
BASE = cfg['base_path']                     # ex. /carnet-de-liens/
APPDIR = cfg['app_dir']                     # ex. parent-ecoute ; vide quand l'app est à la racine du domaine (parent-ecoute.ch)
APP_PATH = BASE + (APPDIR + '/' if APPDIR else '')   # chemin absolu de l'app sur le site
APP_URL = SITE_URL + APP_PATH               # adresse publique de l'app
OUT = REPO + ('/' + APPDIR if APPDIR else '')
HOST = cfg.get('host', 'github')            # hébergeur : 'github' (GitHub Pages) ou 'infomaniak' (Apache, en Suisse)
assert HOST in ('github', 'infomaniak'), HOST
MOVED = (cfg.get('moved_to') or '').strip()   # l'espace a déménagé : cette adresse ne fait plus que renvoyer vers la nouvelle (ex. https://parent-ecoute.ch/)
if MOVED and not MOVED.endswith('/'):
    MOVED += '/'
NAME = 'Parent Écouté, Parent Éclairé'
# Une version d'essai vit dans son propre dossier, avec ses propres notes (une autre clé de rangement dans le navigateur),
# pour qu'on puisse l'essayer sur le même appareil sans toucher à l'espace habituel. Elle n'est jamais référencée par les moteurs.
ESSAI = bool(cfg.get('essai'))
CLE = cfg.get('storage_key', 'pepe-v1')
assert re.fullmatch(r'[a-z0-9-]+', CLE), CLE
TITRE = NAME + ', un espace d’écoute pour les parents'

LOGO = ('<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5C24 5 15.5 15.5 15.5 21.5a8.5 8.5 0 0 0 17 0C32.5 15.5 24 5 24 5z" style="fill:var(--cream)"/>'
        '<path d="M21 19.5c0-2 .9-4.3 2.2-6.2" style="fill:none;stroke:var(--surface-2);stroke-width:1.6;stroke-linecap:round"/>'
        '<ellipse cx="24" cy="37" rx="7.5" ry="2.6" style="fill:none;stroke:var(--green);stroke-width:2.2"/>'
        '<ellipse cx="24" cy="37.5" rx="16" ry="5.5" style="fill:none;stroke:var(--green);stroke-width:1.8;opacity:.55"/></svg>')


def read(p):
    return open(p, encoding='utf-8').read()


def write(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf-8').write(s)


def sha8(s):
    return hashlib.sha1(s.encode('utf-8')).hexdigest()[:8]


def data_uri(path, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(path, 'rb').read()).decode())


RL_DICO_EMPREINTE = '9d1443c8e95638f5'   # voir build_js : le dictionnaire des liens de « Passer le relais », figé le 19 novembre 2026


def typo(s):
    """Espaces insécables à l'intérieur des guillemets français : un « ne reste jamais seul en fin de ligne, un » jamais seul en début de ligne."""
    return s.replace('\u00ab ', '\u00ab\u00a0').replace(' \u00bb', '\u00a0\u00bb')


# ------------------------------------------------------------------ JavaScript de l'app
def son_version():
    """Empreinte courte des morceaux de site-src/son/ (l'ambiance de l'étang). Ils ne sont chargés qu'à la demande du parent."""
    h = hashlib.sha256()
    d = SRC + '/son'
    for f in sorted(os.listdir(d)) if os.path.isdir(d) else []:
        with open(d + '/' + f, 'rb') as fh:
            h.update(fh.read())
    return h.hexdigest()[:8]


def build_js(site):
    """Renvoie le code de l'app (sans balise <script>)."""
    src = read(ROOT + '/eparts/p2-content.js')
    lines = src.split('\n')
    assert lines[0].strip() == '<script>' and lines[32].startswith('const LOGO=') and lines[33].startswith('const LOGO_LIGHT=')
    lines[32] = "const LOGO='" + LOGO + "';"
    lines[33] = 'const LOGO_LIGHT=LOGO;'
    src = '\n'.join(lines[1:])
    assert src.count("const KEY='epaule-v1';") == 1
    # RACINE : le chemin de l'app sur le site (toutes les adresses écrites par l'app partent de là, parce que les fiches ont leur propre adresse).
    # PUBLIC : l'adresse complète, pour les liens qu'un parent envoie. KEY_SITE : la clé de l'espace habituel, que la version d'essai sait recopier.
    consts = [('SITE', site), ('MENTIONS', bool(site and editeur_ok())), ('KEY', CLE if site else 'pepe-v1'), ('KEY_SITE', 'pepe-v1'),
              ('RACINE', APP_PATH if site else ''), ('PUBLIC', APP_URL if site else 'https://parent-ecoute.ch/'), ('ESSAI', bool(site and ESSAI)), ('TITRE_SITE', TITRE),
              # SON_V : l'empreinte des 2 morceaux de l'étang. Elle change avec eux, pour qu'un téléphone ne garde pas une ancienne version en mémoire.
              ('SON_V', son_version()),
              # CONTACT_R : l'adresse de contact, écrite à l'envers (comme dans les pages de texte) pour ne pas l'offrir aux robots.
              ('CONTACT_R', (cfg.get('contact_email', '').strip()[::-1]) if site else ''),
              # La réponse d'Antonio à la question d'exemple de l'aperçu « Avec Antonio », et sa voix : rien n'est affiché tant qu'il ne les a pas fournies.
              ('AVEC_REPONSE', cfg.get('antonio_reponse', '').strip() if site else ''),
              ('AVEC_VOIX', bool(site and os.path.exists(SRC + '/son/antonio.mp3')))]
    src = src.replace("const KEY='epaule-v1';", '\n'.join('const %s=%s;' % (k, json.dumps(v, ensure_ascii=False)) for k, v in consts))
    if site:
        media = "\nconst MEDAL=RACINE+'img/medaillon.webp';\nconst HERO=RACINE+'img/hero.webp';\n"
    else:
        media = "\nconst MEDAL='%s';\nconst HERO='%s';\n" % (data_uri(SRC + '/img/medaillon.webp', 'image/webp'), data_uri(SRC + '/img/hero.webp', 'image/webp'))
    js = src + read(PARTS + '/p2b-parcours.js') + media + read(PARTS + '/v2-a.js') + read(PARTS + '/v2-c.js') + read(PARTS + '/v2-r.js') + read(PARTS + '/v2-b.js')
    assert js.rstrip().endswith('</script>')
    js = js.rstrip()[:-len('</script>')].rstrip() + '\n'
    assert '<script' not in js and '</script' not in js
    js = typo(js)
    # Le dictionnaire qui raccourcit les liens des fiches de relais est figé : s'il change d'un seul caractère, les liens déjà envoyés
    # ne s'ouvrent plus. La forme qui compte est celle-ci, après le passage de typo(). La fabrication s'arrête si elle a bougé.
    m = re.search(r"const RL_DICO='([^'\\]*)';", js)
    if not m or hashlib.sha256(m.group(1).encode('utf-8')).hexdigest()[:16] != RL_DICO_EMPREINTE:
        raise SystemExit("Le dictionnaire des liens de « Passer le relais » (RL_DICO) a changé : les liens déjà envoyés ne s'ouvriraient plus. "
                         "Empreinte attendue " + RL_DICO_EMPREINTE + ", obtenue " + (hashlib.sha256(m.group(1).encode('utf-8')).hexdigest()[:16] if m else 'aucune') + ".")
    return js


def node_check(path):
    subprocess.run(['node', '--check', path], check=True)


# ------------------------------------------------------------------ CSS
RESET = 'html{box-sizing:border-box;-webkit-text-size-adjust:100%;text-size-adjust:100%}*,*::before,*::after{box-sizing:inherit}body{margin:0}\n'
FONTS = ("@font-face{font-family:'Newsreader';font-style:normal;font-weight:400 700;font-display:swap;src:url(fonts/newsreader.woff2) format('woff2')}\n"
         "@font-face{font-family:'Newsreader';font-style:italic;font-weight:400 600;font-display:swap;src:url(fonts/newsreader-italic.woff2) format('woff2')}\n"
         "@font-face{font-family:'Nunito';font-style:normal;font-weight:200 1000;font-display:swap;src:url(fonts/nunito.woff2) format('woff2')}\n"
         "@font-face{font-family:'Nunito';font-style:italic;font-weight:200 1000;font-display:swap;src:url(fonts/nunito-italic.woff2) format('woff2')}\n"
         # Besley : les titres de la vitrine « le carnet sur la table » (choisie par Antonio le 19 novembre 2026).
         "@font-face{font-family:'Besley';font-style:normal;font-weight:400 900;font-display:swap;src:url(fonts/besley.woff2) format('woff2')}\n")


def app_css():
    h = read(PARTS + '/p1-head.html')
    m = re.search(r'<style>(.*)</style>', h, re.S)
    return m.group(1).strip() + '\n'


# ------------------------------------------------------------------ pages
# Avant le premier affichage : l'écran d'un parent déjà inscrit (returning), et les effets visuels (fx) s'ils ne sont ni coupés dans « Moi »
# ni déconseillés par le téléphone, pour que les animations d'arrivée ne jouent qu'une fois, dans leur version douce.
# Il pose aussi le moment de la journée (h-matin, h-jour, h-soir, h-nuit) : la photo de l'étang prend la lumière de l'heure dès le premier affichage.
INLINE = ("try{var e=document.documentElement,h=location.hash==='#histoire',d=null,H=new Date().getHours();"
          "e.classList.add('h-'+((H<5||H>=22)?'nuit':H<11?'matin':H<18?'jour':'soir'));"
          "if(H>=5&&H<18)e.classList.add('clair');"
          "if(!/[?&](nouveau|reset|new)\\b/.test(location.search))d=JSON.parse(localStorage.getItem('" + CLE + "')||'null');"
          "var f=/^#f=/.test(location.hash),r=h||(d&&d.onboarded);"
          "if(f)e.classList.add('rl-attend');"
          "if(r)e.classList.add('returning');"
          "if(e.getAttribute('data-vue')==='intro'&&!f&&!r){e.classList.add('vue-intro');"
          "if(H>=5&&H<18){var t=document.querySelector('meta[name=theme-color]');if(t)t.setAttribute('content','#F2ECDB');}}"
          "if(!(d&&d.fxOff)&&window.matchMedia&&!matchMedia('(prefers-reduced-motion: reduce)').matches)e.classList.add('fx');}catch(e){}")
# Juste après l'accueil écrit à l'avance : les mots qui dépendent de l'heure (« Bonsoir », « ce soir ») sont mis avant le premier affichage.
# L'accueil porte ses variantes dans des attributs data-matin, data-jour, data-soir et data-nuit, écrits par l'app elle-même.
INLINE_HEURE = ("(function(){try{var m=(document.documentElement.className.match(/\\bh-(nuit|matin|jour|soir)\\b/)||[])[1];if(!m)return;"
                "var L=document.querySelectorAll('#app [data-'+m+']');for(var i=0;i<L.length;i++)L[i].textContent=L[i].getAttribute('data-'+m);}catch(e){}})();")


def inline_moved():
    """À l'ancienne adresse : on part tout de suite vers la nouvelle, sauf si quelqu'un a déjà écrit ici.
    Ses notes sont alors dans cet appareil, à cette adresse : on le laisse entrer, et demenage.js le prévient sans rien effacer."""
    return ("(function(){var N=%s,d=null;try{d=JSON.parse(localStorage.getItem('pepe-v1')||'null')}catch(x){}"
            "if(d&&d.onboarded){window.PEPE_DEMENAGE=N;return}"
            "var r=document.documentElement;r.style.visibility='hidden';setTimeout(function(){r.style.visibility=''},4000);"
            "location.replace(N+location.hash)})();" % json.dumps(MOVED))


def moved_page(fname, robots='noindex,follow'):
    """Une page de l'ancienne adresse, réduite à un renvoi vers la même page à la nouvelle adresse."""
    new = html.escape(MOVED + fname)
    write(OUT + '/' + fname, '\n'.join([
        '<!doctype html>', '<html lang="fr">', '<head>', '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<title>Cette page a déménagé</title>',
        '<meta name="robots" content="%s">' % robots,
        '<link rel="canonical" href="%s">' % new,
        '<meta http-equiv="refresh" content="0; url=%s">' % new,
        '<style>html{background:#07240F;color:#F4EFD8;font:17px/1.5 system-ui,sans-serif}body{margin:0;padding:32px 24px}a{color:inherit}</style>',
        '</head>', '<body>',
        '<p>Cette page a déménagé. <a href="%s">Ouvrir la nouvelle adresse</a></p>' % new,
        '</body>', '</html>', '']))


def csp(inline=''):
    h = ''
    for one in ([inline] if isinstance(inline, str) else inline):
        if one:
            h += " 'sha256-" + base64.b64encode(hashlib.sha256(one.encode('utf-8')).digest()).decode() + "'"
    return ("default-src 'self'; script-src 'self'" + h + " https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; "
            "connect-src 'self' https://cloudflareinsights.com; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests")


def head(title, desc, canonical, a, v, robots='index,follow', inline='', social=True, noconsent=False, hero=True, og=None, corps=(), vue=''):
    """a = préfixe des fichiers de l'app ('' pour une page du dossier de l'app, chemin absolu pour le 404 et pour les fiches).
    og = (adresse de l'image d'aperçu, sa description, le titre court) pour une page qui a la sienne.
    corps = les scripts écrits dans le corps de la page, que la consigne de sécurité doit connaître."""
    e = html.escape
    if ESSAI:
        robots = 'noindex,nofollow'
    inlines = [inline] + list(corps)
    out = ['<!doctype html>', '<html lang="fr"%s%s>' % (' data-noconsent' if noconsent else '', (' data-vue="%s"' % vue) if vue else ''), '<head>', '<meta charset="utf-8">',
           '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
           '<meta http-equiv="Content-Security-Policy" content="%s">' % e(csp(inlines)),
           '<title>%s</title>' % e(title),
           '<meta name="description" content="%s">' % e(desc),
           '<meta name="robots" content="%s">' % robots]
    if canonical:
        out.append('<link rel="canonical" href="%s">' % e(canonical))
    out += ['<meta name="color-scheme" content="dark">', '<meta name="theme-color" content="#07240F">',
            '<meta name="referrer" content="strict-origin-when-cross-origin">',
            '<link rel="icon" href="%sfavicon.ico" sizes="32x32">' % a,
            '<link rel="icon" href="%sfavicon.svg" type="image/svg+xml">' % a,
            '<link rel="apple-touch-icon" href="%sapple-touch-icon.png">' % a,
            '<link rel="manifest" href="%smanifest.webmanifest">' % a,
            '<meta name="apple-mobile-web-app-title" content="Parent écouté">']
    if social:
        out += ['<meta property="og:type" content="%s">' % ('article' if og else 'website'), '<meta property="og:site_name" content="%s">' % e(NAME), '<meta property="og:locale" content="fr_CH">',
                '<meta property="og:title" content="%s">' % e(og[2] if og else title), '<meta property="og:description" content="%s">' % e(desc),
                '<meta property="og:url" content="%s">' % e(canonical),
                '<meta property="og:image" content="%s">' % e(og[0] if og else APP_URL + 'img/apercu.jpg'), '<meta property="og:image:type" content="image/jpeg">',
                '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">',
                '<meta property="og:image:alt" content="%s">' % e(og[1] if og else 'Une goutte tombe sur un étang, dans la lumière d’une forêt. Parent Écouté, Parent Éclairé, par Antonio Company.'),
                '<meta name="twitter:card" content="summary_large_image">']
    if hero:  # l'image du haut de page est l'élément le plus grand : on la demande tout de suite
        out.append('<link rel="preload" href="%simg/hero.webp" as="image" type="image/webp" fetchpriority="high">' % a)
    if vue == 'intro':  # la vitrine : son grand titre est l'élément le plus grand du premier écran, sa police est demandée tout de suite
        out.append('<link rel="preload" href="%sfonts/besley.woff2" as="font" type="font/woff2" crossorigin>' % a)
    out += ['<link rel="preload" href="%sfonts/nunito.woff2" as="font" type="font/woff2" crossorigin>' % a,
            '<link rel="preload" href="%sfonts/newsreader.woff2" as="font" type="font/woff2" crossorigin>' % a,
            '<link rel="stylesheet" href="%sapp.css?v=%s">' % (a, v['css'])]
    if inline:
        out.append('<script>%s</script>' % inline)
    out.append('</head>')
    return '\n'.join(out) + '\n'


def editeur_ok():
    """Les mentions légales ne sont publiées que lorsque l'éditeur a donné une adresse postale et une adresse e-mail.
    C'est ce que demande la loi contre la concurrence déloyale (art. 3 al. 1 let. s) à qui vend en ligne."""
    return bool(cfg.get('contact_email', '').strip() and cfg.get('postal_address', '').strip())


def mail_link():
    return '<a href="#" data-mail="%s"></a><noscript> (activez JavaScript pour l’afficher)</noscript>' % html.escape(cfg.get('contact_email', '').strip()[::-1])


def mentions_body():
    name = html.escape(cfg.get('legal_name', 'Antonio Company').strip())
    addr = html.escape(cfg['postal_address'].strip())
    tel, ide = cfg.get('phone', '').strip(), cfg.get('ide', '').strip()
    hn, ha = cfg.get('host_name', '').strip(), cfg.get('host_address', '').strip()
    out = '<p class="meta">Dernière mise à jour le {{DATE_FR}}</p>\n'
    out += ('<section id="editeur">\n  <h2>1. Qui édite cet espace</h2>\n'
            '  <p>« Parent Écouté, Parent Éclairé » est édité par %s, travailleur social. Son adresse postale est %s, Suisse.</p>\n' % (name, addr))
    out += '  <p>Pour lui écrire, utilisez l’adresse %s.' % mail_link()
    if tel:
        out += ' Vous pouvez aussi l’appeler au <a class="tel" href="tel:%s">%s</a>.' % (re.sub(r'[^+\d]', '', tel), html.escape(tel))
    out += '</p>\n'
    if ide:
        out += '  <p>Son numéro d’identification des entreprises (IDE) est %s.</p>\n' % html.escape(ide)
    out += '</section>\n'
    n = 2
    if hn:
        out += ('<section id="hebergeur">\n  <h2>%d. Qui héberge le site</h2>\n  <p>Le site est hébergé par %s%s.</p>\n</section>\n'
                % (n, html.escape(hn), (', ' + html.escape(ha)) if ha else ''))
        n += 1
    out += ('<section id="nature">\n  <h2>%d. Ce que l’espace est</h2>\n'
            '  <p>L’espace propose un soutien aux parents, avec des textes, des repères et des outils issus de la pratique d’un travailleur social. Ce n’est ni un service médical, ni une thérapie, ni un service d’urgence. '
            'Les <a href="conditions.html">conditions générales</a> le détaillent, et la <a href="confidentialite.html">politique de confidentialité</a> explique ce que deviennent vos données.</p>\n</section>\n' % n)
    return out


def contact_block():
    m = cfg.get('contact_email', '').strip()
    if m:
        s = 'Pour nous écrire, utilisez l’adresse %s.' % mail_link()
        if editeur_ok():
            s += ' L’adresse postale de l’éditeur figure dans les <a href="mentions-legales.html">mentions légales</a>.'
        return s
    return ('Une adresse de contact dédiée sera publiée ici avant l’ouverture des abonnements. Pendant la phase de test, les personnes invitées à essayer l’espace '
            'peuvent écrire à Antonio par le canal où elles ont reçu l’invitation.')


def audience_status():
    if cfg.get('cf_token', '').strip():
        return 'Cet outil est actif sur le site et ne se déclenche que si vous l’avez accepté.'
    return ('<b>Au %s</b>, aucun outil de mesure d’audience n’est activé sur le site, et aucune donnée de visite n’est collectée. '
            'C’est pourquoi aucun bandeau ne s’affiche à votre arrivée. Si un outil est activé un jour, votre accord vous sera demandé avant toute mesure. '
            'Vous pouvez déjà indiquer votre choix ci-dessous, et il sera respecté ce jour-là.' % cfg['updated_fr'])


def host_blocks(body):
    """Garde les passages écrits pour l'hébergeur en cours (<!--HOST:nom-->…<!--/HOST-->) et retire ceux des autres."""
    return re.sub(r'<!--HOST:(\w+)-->(.*?)<!--/HOST-->\n?', lambda m: m.group(2) if m.group(1) == HOST else '', body, flags=re.S)


def text_page(fname, h1, title, desc, body, v, band='center 45%'):
    canonical = APP_URL + fname
    body = host_blocks(body)
    assert '<!--HOST' not in body and '<!--/HOST' not in body
    # Les passages écrits pour la version d'essai (<!--ESSAI-->…<!--/ESSAI-->) ne sont gardés que là.
    body = re.sub(r'<!--ESSAI-->(.*?)<!--/ESSAI-->\n?', lambda m: m.group(1) if ESSAI else '', body, flags=re.S)
    # À l'inverse, les passages <!--SITE-->…<!--/SITE--> décrivent le site habituel : la version d'essai ne les garde pas.
    body = re.sub(r'<!--SITE-->(.*?)<!--/SITE-->\n?', lambda m: '' if ESSAI else m.group(1), body, flags=re.S)
    body = typo(body.replace('{{DATE_FR}}', cfg['updated_fr']).replace('{{CONTACT}}', contact_block()).replace('{{AUDIENCE_STATUS}}', audience_status()))
    assert '{{' not in body, re.findall(r'\{\{[^}]*\}\}', body)
    cur = lambda f: ' aria-current="page"' if f == fname else ''
    page = (head(title, desc, canonical, '', v)
            + '<body>\n<div class="app nobar">\n<header class="bar"><a class="wordmark" href="./" aria-label="Parent écouté, parent éclairé. Revenir à l’accueil">' + LOGO + '<span>Parent écouté<small>parent éclairé</small></span></a></header>\n'
            + '<main id="main" class="view doc" style="padding-top:0">\n<div class="band thin bleed" style="background-image:url(img/hero.webp);background-position:' + band + '"><h1 class="t1">' + html.escape(h1) + '</h1></div>\n'
            + body.strip() + '\n<a class="btn primary" href="./" style="align-self:flex-start">Revenir à l’espace</a>\n</main>\n'
            + '<footer class="foot"><a href="./">Accueil</a><a href="confidentialite.html"' + cur('confidentialite.html') + '>Confidentialité</a><a href="conditions.html"' + cur('conditions.html') + '>Conditions générales</a>'
            + (('<a href="mentions-legales.html"' + cur('mentions-legales.html') + '>Mentions légales</a>') if editeur_ok() else '') + '</footer>\n</div>\n'
            + '<script src="site.js?v=' + v['site'] + '" defer></script>\n</body>\n</html>\n')
    write(OUT + '/' + fname, page)
    return canonical


def build_site():
    os.makedirs(OUT, exist_ok=True)
    # --- fichiers statiques
    # Les dossiers sont recopiés à l'identique (sous-dossiers compris) : un fichier retiré des sources disparaît aussi du site fabriqué.
    for d in ('fonts', 'img', 'son'):
        if os.path.isdir(OUT + '/' + d):
            shutil.rmtree(OUT + '/' + d)
        shutil.copytree(SRC + '/' + d, OUT + '/' + d)
    for f in sorted(os.listdir(SRC + '/icons')):
        shutil.copy2(SRC + '/icons/' + f, OUT + '/' + f)
    shutil.copy2(SRC + '/favicon.svg', OUT + '/favicon.svg')
    shutil.copy2(SRC + '/favicon.ico', OUT + '/favicon.ico')

    # --- CSS, JS
    css = RESET + FONTS + app_css() + read(SRC + '/antonio.css')
    write(OUT + '/app.css', css)
    js = build_js(site=True)
    write(OUT + '/app.js', js)
    node_check(OUT + '/app.js')
    site_cfg = {'token': cfg.get('cf_token', '').strip(), 'base': APP_PATH, 'version': 1}
    sjs = read(SRC + '/site.js')
    assert sjs.count('/*CFG*/') == 2
    sjs = re.sub(r'/\*CFG\*/.*?/\*CFG\*/', lambda m: json.dumps(site_cfg, ensure_ascii=False), sjs, flags=re.S)
    write(OUT + '/site.js', sjs)
    node_check(OUT + '/site.js')
    # L'Espace Antonio vit dans son propre dossier (antonio/), pour pouvoir être fermé par un mot de passe chez l'hébergeur,
    # qui protège un dossier entier et non une page. À l'ancienne adresse (MOVED), il n'en reste qu'un renvoi.
    ajs = typo(read(SRC + '/antonio.js'))
    if not ESSAI:
        ant_js = OUT + ('/antonio.js' if MOVED else '/antonio/antonio.js')
        os.makedirs(os.path.dirname(ant_js), exist_ok=True)
        write(ant_js, ajs)
        node_check(ant_js)
    if not MOVED:   # l'ancien emplacement, à la racine du site
        for f in ('antonio.html', 'antonio.js'):
            if os.path.exists(OUT + '/' + f):
                os.remove(OUT + '/' + f)
    v = {'css': sha8(css), 'js': sha8(js), 'site': sha8(sjs), 'ant': sha8(ajs)}
    djs = ''
    if MOVED:   # la fenêtre « Cet espace a déménagé », pour qui a déjà écrit à cette adresse
        djs = read(SRC + '/demenage.js')
        write(OUT + '/demenage.js', djs)
        node_check(OUT + '/demenage.js')
    elif os.path.exists(OUT + '/demenage.js'):
        os.remove(OUT + '/demenage.js')

    # --- écrans pré-écrits (même HTML que celui que l'app écrit elle-même) : l'accueil, la liste des situations et chaque fiche
    tout = json.loads(subprocess.run(['node', ROOT + '/tests/prerender.js', OUT + '/app.js', APP_PATH], check=True, capture_output=True, text=True).stdout)
    pre = tout['intro']
    # Le moment de la journée n'est pas connu à la fabrication : la classe h-… est posée par le script du haut de page, puis par l'app.
    classe = lambda x: re.sub(r'\s+h-\w+', '', x['className'])
    title = TITRE
    assert pre['title'] == TITRE, pre['title']
    desc = ('Souffler 2 minutes, déposer ce qui pèse ou trouver une piste pour ce soir. '
            'Un espace d’écoute pour tout parent, par Antonio Company, travailleur social.')
    # Les fichiers de la page sont appelés par leur chemin complet : l'adresse change quand on ouvre une fiche, et un chemin relatif ne mènerait plus au bon endroit.
    index = (head(title, desc, MOVED or APP_URL, APP_PATH, v, inline=(inline_moved() + INLINE) if MOVED else INLINE, corps=(INLINE_HEURE,), hero=False, vue='intro')
             + '<body>\n<div id="app" class="' + classe(pre) + '" data-prerender="intro">' + pre['html'] + '</div>\n'
             + '<script>' + INLINE_HEURE + '</script>\n'
             + '<noscript><p class="noscript">Cet espace a besoin de JavaScript pour fonctionner. Activez-le dans votre navigateur, puis rechargez la page.</p></noscript>\n'
             + '<script src="' + APP_PATH + 'site.js?v=' + v['site'] + '" defer></script>\n'
             + (('<script src="' + APP_PATH + 'demenage.js?v=' + sha8(djs) + '" defer></script>\n') if MOVED else '')
             + '<script src="' + APP_PATH + 'app.js?v=' + v['js'] + '" defer></script>\n</body>\n</html>\n')
    write(OUT + '/index.html', index)

    # --- les fiches : chacune a sa page et son adresse, que l'on peut envoyer telle quelle. La page se lit tout de suite, même sans JavaScript.
    urls = [APP_URL]
    if os.path.isdir(OUT + '/fiches'):
        shutil.rmtree(OUT + '/fiches')
    if not MOVED:
        def ecran(x, cle, canonical, desc, og=None):
            return (head(x['title'], desc, canonical, APP_PATH, v, inline=INLINE, hero=False, og=og)
                    + '<body>\n<div id="app" class="' + classe(x) + '" data-prerender="' + cle + '">' + x['html'] + '</div>\n'
                    + '<script src="' + APP_PATH + 'site.js?v=' + v['site'] + '" defer></script>\n'
                    + '<script src="' + APP_PATH + 'app.js?v=' + v['js'] + '" defer></script>\n</body>\n</html>\n')
        write(OUT + '/fiches/index.html', ecran(tout['liste'], 'pub-kit', APP_URL + 'fiches/', tout['liste']['desc']))
        urls.append(APP_URL + 'fiches/')
        sans_image = []
        for f in tout['fiches']:
            img = 'img/fiches/' + f['slug'] + '.jpg'
            og = None
            if os.path.exists(SRC + '/' + img):
                og = (APP_URL + img, 'La fiche « %s », sur une photo d’étang en forêt. Parent Écouté, Parent Éclairé.' % f['t'], f['t'])
            else:
                sans_image.append(f['slug'])
            write(OUT + '/fiches/' + f['slug'] + '/index.html', ecran(f, 'pub-sit', APP_URL + 'fiches/' + f['slug'] + '/', f['desc'], og))
            urls.append(APP_URL + 'fiches/' + f['slug'] + '/')
        if sans_image:
            print('  attention : pas d’image d’aperçu pour ' + ', '.join(sans_image))
        # --- « Passer le relais » a son adresse : l'outil s'y présente, et une fiche envoyée s'y ouvre (elle voyage après le signe #).
        #     La page à transmettre par une association ou un professionnel a la sienne aussi.
        for cle, dossier, desc in (('relais', 'relais', 'Une page pour la personne qui garde votre enfant, écrite avec vos mots. Elle sait l’essentiel en 1 minute.'),
                                   ('transmettre', 'transmettre', 'On vous demande souvent comment va votre enfant. Ici, on commence par vous. Un espace pour les parents d’une personne en situation de handicap.')):
            if os.path.isdir(OUT + '/' + dossier):
                shutil.rmtree(OUT + '/' + dossier)
            write(OUT + '/' + dossier + '/index.html', ecran(tout[cle], 'pub-' + cle, APP_URL + dossier + '/', desc))
            urls.append(APP_URL + dossier + '/')

    # --- pages de texte
    if MOVED:   # à l'ancienne adresse, les pages de texte ne font plus que renvoyer vers les nouvelles
        for f in ('confidentialite.html', 'conditions.html'):
            moved_page(f)
        if os.path.exists(OUT + '/mentions-legales.html'):
            os.remove(OUT + '/mentions-legales.html')
    else:
        urls.append(text_page('confidentialite.html', 'Politique de confidentialité', 'Politique de confidentialité de ' + NAME,
                              'Ce que vous écrivez reste sur votre appareil. Il n’y a ni compte ni cookie, et la mesure d’audience anonyme ne se fait qu’avec votre accord.',
                              read(SRC + '/confidentialite.body.html'), v))
        urls.append(text_page('conditions.html', 'Conditions générales', 'Conditions générales de ' + NAME,
                              'Les règles d’utilisation de l’espace, avec la version de test gratuite, ce que l’espace est et n’est pas, et les offres présentées à titre de démonstration.',
                              read(SRC + '/conditions.body.html'), v, band='left 55%'))
        if editeur_ok():
            urls.append(text_page('mentions-legales.html', 'Mentions légales', 'Mentions légales de ' + NAME,
                                  'Qui édite l’espace, comment le joindre et qui héberge le site.', mentions_body(), v, band='right 70%'))
        elif os.path.exists(OUT + '/mentions-legales.html'):
            os.remove(OUT + '/mentions-legales.html')

    # --- Espace Antonio (démonstration, non référencée)
    if MOVED:
        moved_page('antonio.html', robots='noindex,nofollow')
    elif ESSAI:
        if os.path.isdir(OUT + '/antonio'):
            shutil.rmtree(OUT + '/antonio')
    else:
        ant = (head('Espace Antonio, démonstration de ' + NAME, 'Démonstration du tableau de bord d’Antonio. Parents et dépôts fictifs.', '', '../', v, robots='noindex,nofollow', social=False, noconsent=True)
               + '<body>\n<div id="app" class="app nobar"></div>\n<noscript><p class="noscript">Cette page a besoin de JavaScript.</p></noscript>\n'
               + '<script src="../site.js?v=' + v['site'] + '" defer></script>\n<script src="antonio.js?v=' + v['ant'] + '" defer></script>\n</body>\n</html>\n')
        write(OUT + '/antonio/index.html', ant)

    # --- L'adresse simple qui allume l'aperçu d'Antonio (tout le parcours ouvert sur son appareil) : …/atelier renvoie vers …/#atelier.
    #     Ce n'est pas un verrou : dans la version de test tout est gratuit. Voir « L'aperçu d'Antonio » dans v2-b.js.
    if not MOVED:
        os.makedirs(OUT + '/atelier', exist_ok=True)
        write(OUT + '/atelier/index.html',
              '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
              '<meta name="robots" content="noindex,nofollow">\n<meta name="color-scheme" content="dark">\n<title>Aperçu d’Antonio, ' + html.escape(NAME) + '</title>\n'
              '<meta http-equiv="refresh" content="0; url=../#atelier">\n'
              '<style>body{background:#07240F;color:#F4EFD8;font:17px/1.5 system-ui,sans-serif;padding:32px 20px}a{color:#B4DE9C}</style>\n</head>\n'
              '<body>\n<p>Un instant, l’espace s’ouvre avec l’aperçu d’Antonio.</p>\n<p><a href="../#atelier">Ouvrir l’espace</a></p>\n</body>\n</html>\n')

    # --- 404 (à la racine du dépôt : GitHub Pages la sert pour toute adresse inconnue du projet)
    home = MOVED or APP_PATH   # après le déménagement, la page 404 de l'ancienne adresse ramène à la nouvelle
    nf = (head('Page introuvable sur ' + NAME, 'Cette page n’existe pas ou plus.', '', APP_PATH, v, robots='noindex', social=False, hero=False)
          + '<body>\n<div class="app nobar">\n<header class="bar"><a class="wordmark" href="' + home + '" aria-label="Parent écouté, parent éclairé. Revenir à l’accueil">' + LOGO + '<span>Parent écouté<small>parent éclairé</small></span></a></header>\n'
          + '<main id="main" class="view notfound">\n<p class="label">Erreur 404</p>\n<h1>Ce chemin ne mène nulle part.</h1>\n'
          + '<p>La page que vous cherchez n’existe pas ou n’existe plus, mais l’espace est toujours là.</p>\n'
          + '<a class="btn primary" href="' + home + '">Revenir à l’accueil</a>\n'
          + '<p class="hint">Si vous avez besoin de parler tout de suite, appelez La Main Tendue au <a class="tel" href="tel:143">143</a>, de jour comme de nuit.</p>\n</main>\n</div>\n'
          + '<script src="' + APP_PATH + 'site.js?v=' + v['site'] + '" defer></script>\n</body>\n</html>\n')
    write(REPO + '/404.html', nf)

    # --- manifest, robots, sitemap
    manifest = {
        'name': NAME + (' (essai)' if ESSAI else ''), 'short_name': 'Parent écouté' + (' essai' if ESSAI else ''), 'id': APP_PATH,
        'description': 'Un espace d’écoute pour tout parent en chemin, avec la dose de lumière intérieure, Déposer, le parcours de six mois et les conseils et outils d’un travailleur social.',
        'lang': 'fr', 'dir': 'ltr', 'start_url': './', 'scope': './', 'display': 'standalone', 'background_color': '#07240F', 'theme_color': '#07240F',
        'categories': ['lifestyle', 'health', 'education'],
        'icons': [{'src': 'icon-192.png', 'sizes': '192x192', 'type': 'image/png'}, {'src': 'icon-512.png', 'sizes': '512x512', 'type': 'image/png'},
                  {'src': 'icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}]}
    write(OUT + '/manifest.webmanifest', json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    if MOVED:   # plus de plan du site à l'ancienne adresse : ses pages renvoient toutes vers la nouvelle
        write(REPO + '/robots.txt', '# ' + NAME + ' a déménagé : ' + MOVED + '\nUser-agent: *\nAllow: /\n')
        if os.path.exists(REPO + '/sitemap.xml'):
            os.remove(REPO + '/sitemap.xml')
        return v
    remark = '' if (BASE == '/' and not APPDIR) else ('# Remarque : un robots.txt ne prend effet que servi à la racine du domaine (il le sera avec un nom de domaine propre).\n'
                                                      '# En attendant, chaque page porte sa propre consigne (balise meta robots).\n')
    write(REPO + '/robots.txt', '# ' + NAME + '\n' + remark + 'User-agent: *\nAllow: /\n\nSitemap: ' + SITE_URL + BASE + 'sitemap.xml\n')
    if HOST == 'infomaniak':
        # Réglages du serveur Apache : volontairement peu nombreux et sans réécriture d'adresse, pour ne risquer aucune erreur 500.
        # Le passage en HTTPS se règle chez l'hébergeur (certificat, puis redirection), pas ici.
        write(REPO + '/.htaccess', ('# Parent Ecoute, Parent Eclaire : reglages du serveur\n'
                                    'ErrorDocument 404 ' + BASE + '404.html\n'
                                    '<IfModule mod_mime.c>\n'
                                    'AddType application/manifest+json .webmanifest\n'
                                    'AddType font/woff2 .woff2\n'
                                    'AddType image/svg+xml .svg\n'
                                    'AddCharset utf-8 .html .css .js .xml .txt .webmanifest\n'
                                    '</IfModule>\n'
                                    '<IfModule mod_headers.c>\n'
                                    'Header set X-Content-Type-Options "nosniff"\n'
                                    'Header set Referrer-Policy "strict-origin-when-cross-origin"\n'
                                    'Header set X-Frame-Options "DENY"\n'
                                    '</IfModule>\n'))
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        sm.append('  <url><loc>%s</loc><lastmod>%s</lastmod></url>' % (html.escape(u), cfg['updated']))
    sm.append('</urlset>')
    write(REPO + '/sitemap.xml', '\n'.join(sm) + '\n')
    return v


def build_artifact():
    """pepe.html : la version Claude (un seul fichier complet, écoute réelle)."""
    h = read(PARTS + '/p1-head.html')
    m = re.search(r'<style>.*</style>', h, re.S)
    before, style, after = h[:m.start()].strip(), m.group(0), h[m.end():].strip()
    js = build_js(site=False)
    # Même enveloppe que celle que l'ancien outil de publication ajoutait : le comportement dans l'app Claude ne change pas.
    shell = ('<style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
             'html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}'
             'img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style>')
    out = ('<!DOCTYPE html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
           '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
           + shell + '\n' + before + '\n' + style + '\n</head>\n<body>\n' + after + '\n<script>\n' + js + '</script>\n</body>\n</html>\n')
    write(ROOT + '/pepe.html', out)
    write(ROOT + '/build/pepe-script.js', js)
    node_check(ROOT + '/build/pepe-script.js')
    return len(out)


if __name__ == '__main__':
    v = build_site()
    sizes = {f: os.path.getsize(OUT + '/' + f) for f in ('index.html', 'app.css', 'app.js', 'site.js', 'confidentialite.html', 'conditions.html') + (('antonio.html', 'antonio.js') if MOVED else () if ESSAI else ('antonio/index.html', 'antonio/antonio.js'))}
    print('site ->', OUT, v, '(%s, %s)' % (HOST, APP_URL))
    print('  ' + ' · '.join('%s %.1f Ko' % (k, s / 1024) for k, s in sizes.items()))
    if os.environ.get('PEPE_SITE_ONLY'):   # fabrication d'une autre version du site : on ne touche pas à l'artefact
        print('artefact -> non refait (PEPE_SITE_ONLY)')
    else:
        n = build_artifact()
        print('artefact -> pepe.html %.1f Ko' % (n / 1024))
