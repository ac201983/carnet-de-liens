/* Parent Écouté, Parent Éclairé : script commun à toutes les pages du site.
   - force HTTPS (filet de sécurité, au cas où le serveur ne redirigerait pas lui-même) ;
   - bandeau de consentement : la mesure d'audience ne se charge QUE si le visiteur l'accepte ;
   - aucun cookie : le choix est gardé dans le stockage local du navigateur ;
   - adresse de contact assemblée à l'affichage (illisible pour les robots qui aspirent les pages). */
(function () {
  'use strict';
  var CFG = {"token": "", "base": "/", "version": 1};

  // 1. HTTPS forcé
  if (location.protocol === 'http:' && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) {
    location.replace('https://' + location.host + location.pathname + location.search + location.hash);
    return;
  }

  // 2. Consentement
  var KEY = 'pepe-consent';
  var noConsent = document.documentElement.hasAttribute('data-noconsent');
  function today() { var d = new Date(); function p(n) { return (n < 10 ? '0' : '') + n; } return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }
  function fr(iso) { var p = String(iso || '').split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : ''; }
  function get() { try { var c = JSON.parse(localStorage.getItem(KEY) || 'null'); return c && c.v === CFG.version && typeof c.audience === 'boolean' ? c : null; } catch (e) { return null; } }
  function loadAudience() {
    // Cloudflare Web Analytics : sans cookie, sans stockage local, sans suivi d'un site à l'autre. Inactif tant qu'aucun jeton n'est configuré.
    if (!CFG.token || document.getElementById('cf-beacon')) return;
    var s = document.createElement('script');
    s.id = 'cf-beacon'; s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: CFG.token, spa: false }));
    document.head.appendChild(s);
  }
  function set(yes) {
    var c = { v: CFG.version, audience: !!yes, date: today() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { }
    hide(); paint();
    if (c.audience) loadAudience();
    return c;
  }
  function hide() { var b = document.getElementById('consent'); if (b) b.parentNode.removeChild(b); }
  function show() {
    if (document.getElementById('consent')) return;
    var b = document.createElement('div');
    b.id = 'consent'; b.className = 'consent'; b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'Cookies et mesure d’audience');
    b.innerHTML = '<div class="consent-in"><p><b>Pas de cookies ici.</b> Acceptez-vous une mesure d’audience anonyme ? <a href="' + CFG.base + 'confidentialite.html#cookies">En savoir plus</a></p>' +
      '<div class="row"><button type="button" class="btn" data-consent="no">Refuser</button><button type="button" class="btn" data-consent="yes">Accepter</button></div></div>';
    document.body.appendChild(b);
  }
  // État du choix affiché dans les pages (confidentialité) + boutons « Modifier mon choix »
  function paint() {
    var c = get(), els = document.querySelectorAll('[data-consent-state]');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = c ? (c.audience ? 'Vous avez accepté la mesure d’audience le ' + fr(c.date) + '.' : 'Vous avez refusé la mesure d’audience le ' + fr(c.date) + '.') : 'Vous n’avez pas encore fait de choix.';
    }
  }
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-consent],[data-consent-open],[data-mail]') : null;
    if (!t) return;
    if (t.hasAttribute('data-consent')) { set(t.getAttribute('data-consent') === 'yes'); }
    else if (t.hasAttribute('data-consent-open')) { show(); var f = document.querySelector('#consent button'); if (f) f.focus(); }
    else if (t.hasAttribute('data-mail')) { e.preventDefault(); location.href = 'mailto:' + mail(t); }
  });
  window.PEPEConsent = { get: get, set: set, open: show, active: function () { return !!CFG.token; } };

  // 3. Adresse de contact : écrite à l'envers dans la page, remise à l'endroit ici
  function mail(el) { return (el.getAttribute('data-mail') || '').split('').reverse().join(''); }
  function mails() {
    var els = document.querySelectorAll('[data-mail]');
    for (var i = 0; i < els.length; i++) { if (!els[i].textContent) els[i].textContent = mail(els[i]); }
  }

  function start() {
    mails(); paint();
    // Tant qu'aucun outil de mesure n'est branché sur le site (pas de jeton), il n'y a rien à accepter ni à refuser : le bandeau ne s'affiche pas tout seul.
    // Il reste possible de l'ouvrir depuis la page de confidentialité (« Modifier mon choix »).
    if (noConsent || !CFG.token) return;
    var c = get();
    if (!c) show(); else if (c.audience) loadAudience();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
