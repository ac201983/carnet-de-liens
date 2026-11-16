/* L'espace a déménagé. Ce fichier n'est servi qu'à l'ancienne adresse.
   Un visiteur qui n'a rien écrit ici est renvoyé vers la nouvelle adresse avant même l'affichage (voir inline_moved dans build_site.py).
   Celui qui a déjà écrit ici garde ses notes dans son appareil, à cette adresse. On le prévient, sans rien effacer,
   et on le laisse entrer pour les relire. */
(function () {
  'use strict';
  var N = window.PEPE_DEMENAGE;
  if (!N) return;
  try { if (sessionStorage.getItem('pepe-demenage-vu')) return; } catch (e) { /* pas de mémoire de session : on prévient à chaque fois */ }

  var avant = document.activeElement;
  var w = document.createElement('div');
  w.id = 'demenage';
  w.style.cssText = 'position:fixed;inset:0;z-index:1000';
  w.innerHTML = '<div class="backdrop"></div>' +
    '<div class="sheet in" role="dialog" aria-modal="true" aria-labelledby="dm-title" tabindex="-1"><div class="sheet-in">' +
    '<h2 id="dm-title">Cet espace a déménagé</h2>' +
    '<p>Parent Écouté, Parent Éclairé a maintenant sa propre adresse, <b>parent-ecoute.ch</b>.</p>' +
    '<p>Ce que vous avez écrit ici est resté dans cet appareil, à cette ancienne adresse. Vos notes ne vous suivront pas toutes seules, alors prenez le temps de les relire ici si vous y tenez.</p>' +
    '<a class="btn primary wide" id="dm-go">Aller à la nouvelle adresse</a>' +
    '<button class="btn ghost wide" id="dm-stay" type="button">Rester ici pour relire mes notes</button>' +
    '</div></div>';
  var go = w.querySelector('#dm-go'), stay = w.querySelector('#dm-stay');
  go.href = N;

  function fermer() {
    try { sessionStorage.setItem('pepe-demenage-vu', '1'); } catch (e) { /* tant pis */ }
    document.removeEventListener('keydown', clavier, true);
    if (w.parentNode) w.parentNode.removeChild(w);
    if (avant && avant.focus && document.contains(avant)) avant.focus();
  }
  function clavier(ev) {
    if (ev.key === 'Escape') { ev.preventDefault(); fermer(); return; }
    if (ev.key !== 'Tab') return;
    // Le clavier reste dans la fenêtre tant qu'elle est ouverte
    var a = document.activeElement;
    if (ev.shiftKey && (a === go || !w.contains(a))) { ev.preventDefault(); stay.focus(); }
    else if (!ev.shiftKey && (a === stay || !w.contains(a))) { ev.preventDefault(); go.focus(); }
  }
  stay.addEventListener('click', fermer);
  document.addEventListener('keydown', clavier, true);
  document.body.appendChild(w);
  go.focus();
})();
