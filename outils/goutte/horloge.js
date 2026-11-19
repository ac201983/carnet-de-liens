// L'horloge tenue à la main, pour filmer un mouvement image par image, à l'heure exacte.
// Elle tient performance.now et requestAnimationFrame (les mouvements écrits en JavaScript), et aussi les animations
// et transitions CSS : chacune est mise en pause dès qu'elle naît, puis avancée du même pas que l'horloge.
module.exports = () => {
  const P0 = performance.now.bind(performance), R0 = window.requestAnimationFrame.bind(window), C0 = window.cancelAnimationFrame.bind(window);
  let virt = null, q = [], id = 1e6;
  const css = () => { if (virt == null || !document.getAnimations) return; document.getAnimations().forEach(a => { if (a.__v0 == null) { a.__v0 = virt; try { a.pause(); } catch (e) { } } try { a.currentTime = Math.max(0, virt - a.__v0); } catch (e) { } }); };
  // Les minuteries (setTimeout) suivent aussi l'horloge, une fois qu'elle est tenue à la main.
  const T0 = window.setTimeout.bind(window), CT0 = window.clearTimeout.bind(window); let tm = [], tid = 5e6;
  window.setTimeout = function (fn, ms) { if (virt == null || typeof fn !== 'function') return T0.apply(window, arguments); const a = [].slice.call(arguments, 2); tm.push({ id: ++tid, at: virt + (+ms || 0), fn, a }); return tid; };
  window.clearTimeout = id => { if (id > 5e6) tm = tm.filter(t => t.id !== id); else CT0(id); };
  window.__vt = {
    on() { if (virt == null) virt = P0(); css(); }, t() { return virt; }, css,
    pas(ms) {
      css(); virt += ms;
      const dus = tm.filter(t => t.at <= virt).sort((a, b) => a.at - b.at); tm = tm.filter(t => t.at > virt); dus.forEach(t => { try { t.fn.apply(window, t.a); } catch (e) { console.error('vt', e); } });
      const L = q; q = []; L.forEach(f => { try { f.cb(virt); } catch (e) { console.error('vt', e); } }); css(); return virt;
    }
  };
  // Le défilement doux de la page suit lui aussi l'horloge tenue à la main (une demi-seconde, comme sur un téléphone).
  const S0 = window.scrollTo.bind(window);
  window.scrollTo = function (a, b) {
    if (virt != null && a && typeof a === 'object' && a.behavior === 'smooth') {
      const y0 = window.scrollY, y1 = Math.max(0, Math.min(a.top || 0, document.documentElement.scrollHeight - innerHeight)), t0 = virt, D = 520;
      const st = () => { const x = Math.min(1, (virt - t0) / D), e = .5 - .5 * Math.cos(Math.PI * x); S0({ top: Math.round(y0 + (y1 - y0) * e), behavior: 'instant' }); if (x < 1) window.requestAnimationFrame(st); };
      window.requestAnimationFrame(st); return;
    }
    return S0(a, b);
  };
  performance.now = () => (virt != null ? virt : P0());
  window.requestAnimationFrame = cb => { if (virt == null) return R0(cb); q.push({ id: ++id, cb }); return id; };
  window.cancelAnimationFrame = n => { if (n > 1e6) q = q.filter(f => f.id !== n); else C0(n); };
  // « tôt » : l'horloge est tenue à la main dès l'ouverture de la page (il faut alors la faire avancer pour que la page s'affiche)
  try { if (window.__vtTot) window.__vt.on(); } catch (e) { }
};
