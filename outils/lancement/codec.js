// Essai de propriété du lien d'une fiche : ce qui est écrit dans le lien se relit à l'identique, et un lien abîmé ne casse rien.
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync('/home/claude/pparts/v2-r.js', 'utf8');
const a = fs.readFileSync('/home/claude/pparts/v2-a.js', 'utf8');
const prendre = (s, debut, fin) => { const i = s.indexOf(debut), j = s.indexOf(fin, i); if (i < 0 || j < 0) throw new Error('introuvable : ' + debut); return s.slice(i, j); };
const code = [
  prendre(a, 'function clean(v,max)', '\n'),
  prendre(src, 'const RL_LIM=', '\n'),
  prendre(src, 'const RL_SEC=[', '\n];') + '\n];',
  prendre(src, 'const RL_DICO=', '\n'),
  prendre(src, 'function rlPropre(f){', '\n}') + '\n}',
  prendre(src, 'function rlU8(s)', 'function rlLien(f)'),
  'this.api={rlCode,rlDecode,rlPropre,rlZip,rlUnzip,rlU8,RL_LIM,RL_SEC,RL_DICO};'
].join('\n');
const ctx = { TextEncoder, TextDecoder, btoa: s => Buffer.from(s, 'binary').toString('base64'), atob: s => Buffer.from(s, 'base64').toString('binary'), Map, Uint8Array, JSON, String, Array, Error, console };
// La fabrication (build_site.py, typo) pose une espace insécable à l'intérieur des guillemets, dans tout le code. Le dictionnaire des liens en fait partie :
// c'est cette forme-là qui compte. On la reproduit ici, sinon un lien fabriqué dans l'atelier ne s'ouvrirait pas sur le site.
const typo = s => s.split('\u00ab ').join('\u00ab\u00a0').split(' \u00bb').join('\u00a0\u00bb');
vm.createContext(ctx); vm.runInContext(typo(code), ctx);
const { rlCode, rlDecode, rlPropre, RL_LIM, RL_SEC, RL_DICO } = ctx.api;
let graine = 20261119; const rnd = () => { graine = (graine * 1664525 + 1013904223) >>> 0; return graine / 4294967296; };
const pick = a => a[Math.floor(rnd() * a.length)];
const MOTS = ['Un signal', 'avant de changer', 'd’activité', 'aide beaucoup', 'Noé', 'Lina', 'Bastien', 'une seule consigne', '« non »', 'à 20 heures', 'ça', 'œuf', 'Zürich', 'l’école', 'è é ê ë ï ô ù ç', '🙂', '👨‍👩‍👧', '100 %', 'a/b', 'c\\d', '"guillemets"', "l'apostrophe droite", '<b>pas de balise</b>', '&amp;', 'ligne\nsuivante', 'tab\tici', '日本語', 'عربى', '#f=1.AAAA', '?x=1&y=2', '   '];
const phrase = n => { let s = ''; while (s.length < n) s += pick(MOTS) + ' '; return s; };
const modele = () => { const S = pick(RL_SEC); const m = pick(S[3]); return (Array.isArray(m) ? pick(m) : m).replace(/\{Pm?\}/g, 'Noé'); };
const fiche = () => { const s = {}; RL_SEC.forEach(S => { if (rnd() < .7) s[S[0]] = Array.from({ length: Math.floor(rnd() * 7) }, () => rnd() < .5 ? modele() : phrase(rnd() * 260)); });
  return { id: 'x', qui: rnd() < .9 ? phrase(rnd() * 50) : '', chez: phrase(rnd() * 70), quand: rnd() < .5 ? phrase(rnd() * 90) : '', tu: rnd() < .5, trois: Array.from({ length: Math.floor(rnd() * 5) }, () => rnd() < .5 ? modele() : phrase(rnd() * 220)), moi: Array.from({ length: Math.floor(rnd() * 6) }, () => phrase(rnd() * 220)), s, tel: Array.from({ length: Math.floor(rnd() * 5) }, () => ({ n: phrase(rnd() * 30), t: rnd() < .8 ? '079 000 00 00' : phrase(20) })), m: rnd() < .8 ? '2026-11-19' : '' }; };
const egal = (x, y) => JSON.stringify(x) === JSON.stringify(y);
let ok = 0, ko = 0, maxLien = 0, somme = 0, sommeBrut = 0; const N = 4000;
for (let i = 0; i < N; i++) {
  const f = fiche(); const attendu = rlPropre(f); const lien = rlCode(f); const lu = rlDecode(lien);
  maxLien = Math.max(maxLien, lien.length); somme += lien.length; sommeBrut += JSON.stringify(attendu).length;
  if (lu) delete lu.id;
  // une fiche relue passe de nouveau par le nettoyage : on compare à la fiche nettoyée 2 fois, qui doit être stable
  if (lu && egal(lu, rlPropre(attendu)) && /^1\.[A-Za-z0-9_-]+$/.test(lien)) ok++; else { ko++; if (ko < 4) console.log('DIFFÉRENCE', JSON.stringify(attendu).slice(0, 300), '\n →', JSON.stringify(lu).slice(0, 300)); }
}
console.log(`aller-retour : ${ok} fiches sur ${N} relues à l’identique, ${ko} différences. Lien le plus long : ${maxLien} caractères. Moyenne : ${Math.round(somme / N)} caractères pour ${Math.round(sommeBrut / N)} de texte.`);
// la fiche la plus chargée possible
const plein = { qui: 'N'.repeat(40), chez: 'c'.repeat(60), quand: 'q'.repeat(80), tu: true, trois: [0, 1, 2].map(i => phrase(200)), moi: [0, 1, 2, 3].map(() => phrase(200)), s: Object.fromEntries(RL_SEC.map(S => [S[0], [0, 1, 2, 3, 4].map(() => phrase(200))])), tel: [0, 1, 2].map(() => ({ n: 'n'.repeat(40), t: 't'.repeat(40) })), m: '2026-11-19' };
const lp = rlCode(plein); const rp = rlDecode(lp); if (rp) delete rp.id;
console.log('fiche la plus chargée : lien de ' + lp.length + ' caractères, relue ' + (egal(rp, rlPropre(rlPropre(plein))) ? 'à l’identique' : 'AVEC DES DIFFÉRENCES'));
// les 3 exemples et une fiche faite de modèles : le dictionnaire raccourcit le lien
const mod = { qui: 'Noé', chez: 'mon frère Rémi', quand: '', tu: true, trois: [RL_SEC[0][3][0], RL_SEC[0][3][1], RL_SEC[2][3][1]].map(x => x.replace(/\{Pm?\}/g, 'Noé')), moi: [], s: { aide: [RL_SEC[0][3][0].replace('{P}', 'Noé'), RL_SEC[0][3][1]], nuit: [RL_SEC[2][3][0], RL_SEC[2][3][1]] }, tel: [{ n: 'Maman', t: '079 000 00 00' }], m: '2026-11-19' };
console.log('fiche de modèles : ' + JSON.stringify(rlPropre(mod)).length + ' caractères de texte, lien de ' + rlCode(mod).length + ' caractères');
// un lien abîmé : rien ne casse, et la lecture rend « rien » ou une fiche propre
let casse = 0, lus = 0, rien = 0, memes = 0; const t0 = Date.now();
const ficheBase = fiche(); const base = rlCode(ficheBase).slice(2); const luBase = JSON.stringify(rlDecode('1.' + base)); const AL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
for (let i = 0; i < 20000; i++) {
  let t; const r = rnd();
  if (r < .25) t = '1.' + base.slice(0, Math.floor(rnd() * base.length));
  else if (r < .5) { const p = Math.floor(rnd() * base.length); let c = pick(AL.split('')); while (c === base[p]) c = pick(AL.split('')); t = '1.' + base.slice(0, p) + c + base.slice(p + 1); }
  else if (r < .75) t = '1.' + Array.from({ length: Math.floor(rnd() * 400) + 8 }, () => pick(AL.split(''))).join('');
  else t = pick(['', '1.', '2.' + base, '1.' + base + '=', '1.<script>', '1.' + 'A'.repeat(16000), '1.' + '_'.repeat(9000), base, null, undefined, '1.AAAAAAAAAAAA']);
  try { const f = rlDecode(t); if (f) { if (JSON.stringify(f) === luBase) { memes++; continue; } lus++; const p = rlPropre(f); if (!egal(Object.keys(p).sort(), ['chez', 'm', 'moi', 'quand', 'qui', 's', 'tel', 'trois', 'tu'])) casse++; } else rien++; } catch (e) { casse++; if (casse < 4) console.log('EXCEPTION', e.message, String(t).slice(0, 60)); }
}
console.log(`liens abîmés : 20000 essais en ${Date.now() - t0} ms, ${rien} refusés proprement, ${memes} relus comme la fiche d’origine (seul le remplissage avait changé), ${lus} relus comme une autre fiche, ${casse} cassés.`);
// le dictionnaire est figé : sa signature ne doit plus changer une fois des liens envoyés
const h = require('crypto').createHash('sha256').update(RL_DICO).digest('hex').slice(0, 16);
console.log('dictionnaire : ' + RL_DICO.length + ' caractères, signature ' + h);
console.log('liens abîmés relus malgré tout : ' + lus + ' (attendu : 0, la somme de contrôle les refuse)');
process.exit(ko || casse || lus || !egal(rp, rlPropre(rlPropre(plein))) ? 1 : 0);
