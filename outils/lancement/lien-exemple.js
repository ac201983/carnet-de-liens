// Fabrique le lien d'une petite fiche d'essai, avec le même code que le site. Sert de constante aux essais qui visitent « la fiche reçue ».
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync('/home/claude/pparts/v2-r.js', 'utf8'), a = fs.readFileSync('/home/claude/pparts/v2-a.js', 'utf8');
const prendre = (s, d, f) => { const i = s.indexOf(d), j = s.indexOf(f, i); if (i < 0 || j < 0) throw new Error('introuvable : ' + d); return s.slice(i, j); };
const code = [prendre(a, 'function clean(v,max)', '\n'), prendre(src, 'const RL_LIM=', '\n'), prendre(src, 'const RL_SEC=[', '\n];') + '\n];', prendre(src, 'const RL_DICO=', '\n'), prendre(src, 'function rlPropre(f){', '\n}') + '\n}', prendre(src, 'function rlU8(s)', 'function rlLien(f)'), 'this.api={rlCode,rlDecode};'].join('\n');
const ctx = { TextEncoder, TextDecoder, btoa: s => Buffer.from(s, 'binary').toString('base64'), atob: s => Buffer.from(s, 'base64').toString('binary'), Map, Uint8Array, JSON, String, Array, Error, Math };
// La fabrication (build_site.py, typo) pose une espace insécable à l'intérieur des guillemets, dans tout le code. Le dictionnaire des liens en fait partie :
// c'est cette forme-là qui compte. On la reproduit ici, sinon un lien fabriqué dans l'atelier ne s'ouvrirait pas sur le site.
const typo = s => s.split('\u00ab ').join('\u00ab\u00a0').split(' \u00bb').join('\u00a0\u00bb');
vm.createContext(ctx); vm.runInContext(typo(code), ctx);
const f = { qui: 'Noé', chez: 'mon frère Rémi', quand: 'du samedi 5 au dimanche 6 décembre', tu: true, trois: ['Un signal 5 minutes avant de changer d’activité aide beaucoup Noé.', 'Une seule consigne à la fois, avec des mots simples.', 'Noé choisit lui-même son dessin animé du soir.'], moi: ['J’aime les trains et les cartes de métro.', 'Je n’aime pas qu’on finisse mes phrases.'], s: { aide: ['Un signal 5 minutes avant de changer d’activité aide beaucoup Noé.', 'Une seule consigne à la fois, avec des mots simples.'], repas: ['Noé mange volontiers des pâtes, du riz et des pommes.'], nuit: ['Une veilleuse reste allumée et la porte reste entrouverte.'] }, tel: [{ n: 'Maman', t: '079 000 00 00' }], m: '2026-11-19' };
const t = ctx.api.rlCode(f); const r = ctx.api.rlDecode(t);
console.log(t); console.error('relu :', r && r.qui, r && r.trois.length, 'longueur', t.length);
