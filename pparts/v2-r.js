
/* ---------- « Passer le relais » ---------- */
/* Un outil pour la famille, acheté une fois, indépendant du parcours. Il fabrique une page que l'on confie à la personne qui prend le relais :
   un week-end chez un proche, une garde, une première nuit ailleurs. Tout est fait de modèles écrits d'avance et des mots de la famille.
   Aucune intelligence artificielle n'intervient. Les écrits restent sur l'appareil. Quand la famille envoie la fiche, celle-ci voyage
   dans le lien lui-même, après le signe # : aucun serveur ne la reçoit, et le proche l'ouvre sans compte et sans achat.
   Voir l'exemple, préparer sa fiche et la relire est gratuit. L'envoyer, l'imprimer, noter le retour, repartir de la dernière fiche
   et préparer une réunion demandent l'outil (49 CHF, une seule fois). */
const RL_LIM={l:200,nom:40,chez:60,quand:80,tel:40,lignes:5,moi:4,retour:600,dem:400,pri:140,obs:6};
/* Les rubriques de la fiche : la clé, le titre sans prénom, le titre avec prénom, puis les phrases modèles.
   Une phrase en 2 versions s'adresse au proche : la première le tutoie, la seconde le vouvoie. {P} est le nom choisi par la famille. */
const RL_SEC=[
  ['aide','Ce qui aide','Ce qui aide {P}',['Un signal 5 minutes avant de changer d’activité aide beaucoup {P}.','Une seule consigne à la fois, avec des mots simples.','Le programme de la journée, dit le matin en 3 étapes au plus.','Un endroit calme où se retirer quand il y a du bruit ou du monde.',['Du temps pour répondre. Compte jusqu’à 10 dans ta tête avant de répéter.','Du temps pour répondre. Comptez jusqu’à 10 dans votre tête avant de répéter.'],'Son objet du moment reste à portée de main. Il s’agit de']],
  ['repas','Les repas','Les repas',['{Pm} mange volontiers','Proposer un aliment suffit. Insister pour goûter complique le repas.','Les aliments se servent séparés dans l’assiette.','{Pm} a besoin d’aide pour couper et se sert pour le reste.','À table, 20 minutes suffisent. Ensuite, {P} peut se lever.']],
  ['nuit','Le soir et la nuit','Le soir et la nuit',['Le coucher se fait vers 21 heures, toujours dans le même ordre.','Une veilleuse reste allumée et la porte reste entrouverte.','En cas de réveil, une phrase courte suffit, par exemple « C’est la nuit, je suis là ».','Les écrans s’arrêtent 1 heure avant le coucher.','Le matin, {P} a besoin d’un moment de calme avant de parler.']],
  ['monte','Si la tension monte','Si la tension monte',['Les premiers signes sont','Parler peu, baisser la voix et laisser de la place aide {P} à redescendre.','Mieux vaut prévenir {P} avant de s’approcher ou de toucher.','Ce qui apaise le plus, c’est','Quand c’est passé, un verre d’eau suffit. Il n’y a pas besoin d’en reparler.',['Tu peux m’appeler à tout moment, cela ne me dérange jamais.','Vous pouvez m’appeler à tout moment, cela ne me dérange jamais.']]],
  ['comm','Pour se comprendre','Pour se comprendre',['{Pm} comprend mieux les phrases courtes, une idée à la fois.','Pour dire oui, {P} hoche la tête. Pour dire non, {P} détourne le regard.','{Pm} montre ce qui compte avec des images, des gestes ou en tirant par la main.','Une question répétée sert souvent à se rassurer. La même réponse, dite calmement, suffit.','Mieux vaut une question à la fois, avec 2 choix au plus.']],
  ['aime','Ce qui fait plaisir','Ce que {P} aime',['{Pm} aime','Une activité qui marche presque toujours, c’est','{Pm} aime choisir entre 2 propositions.','{Pm} n’aime pas']],
  ['secu','Santé et sécurité','Santé et sécurité',['Les médicaments sont préparés dans le pilulier. Ils se donnent à 8 heures et à 20 heures.','{Pm} ne doit pas manger','Dehors, {P} a besoin d’un adulte à côté, surtout près d’une route.','{Pm} ne sait pas nager.',['En cas de doute, appelle-moi d’abord.','En cas de doute, appelez-moi d’abord.']]]
];
const RL_MOI=['J’aime','Je n’aime pas','Pour m’aider, on peut','Je décide moi-même de','Quand je dis non,'];
const RL_PAS=['Pour qui','Le quotidien','Les 3 repères','Sa parole','Me joindre'];
const RL_AVEC=[['ecole','L’école'],['foyer','Le foyer ou l’institution'],['soin','Un médecin ou un thérapeute'],['autre','Quelqu’un d’autre']];
const RL_RPAS=['Avec qui','Mes observations','Ma demande','Mes 3 priorités'];
/* « Je perds mes mots » : des débuts de phrase pour écrire sa demande, puis des phrases à dire pendant la réunion. */
const RL_MOTS_ECRIRE=['Ce que j’observe à la maison, c’est que','Ce qui aide {P}, c’est','Je vous demande de','Pouvons-nous essayer pendant un mois de','J’ai besoin de savoir','Ce qui m’inquiète le plus, c’est'];
const RL_MOTS_DIRE=['Je reprends mes notes un instant.','Je voudrais revenir à ma première priorité.','Pouvez-vous me le redire avec des mots simples ?','Qui fait quoi, et pour quand ?','Je préfère y réfléchir et vous répondre par écrit.','J’aimerais que ce soit noté dans le compte rendu.'];
/* Trois fiches d'exemple, inventées : à 5 ans, à 16 ans, à 35 ans. Les prénoms et les numéros ne sont ceux de personne. */
const RL_EX={
  e:{id:'ex-e',qui:'Noé',chez:'sa grand-mère',quand:'du samedi 21 au dimanche 22 novembre',tu:true,m:'',
    trois:['Noé ne parle pas encore avec des phrases. Il montre, il tire par la main, et il comprend bien plus qu’il ne dit.','Avant chaque changement, montre-lui l’image ou l’objet de ce qui vient après.','S’il se met à crier, ce n’est pas un caprice. Baisse la voix, éloigne-le du bruit et attends avec lui.'],
    moi:['J’aime l’eau, les bulles et la chanson du crocodile.','Mon lapin en peluche reste avec moi, même à table.','Je dis non en tournant la tête.'],
    s:{repas:['Noé mange volontiers des pâtes, de la banane et du pain.','Proposer un aliment suffit. Insister pour goûter complique le repas.'],nuit:['Le coucher se fait vers 19 heures 30, après le bain et 2 histoires.','Une veilleuse reste allumée et la porte reste entrouverte.'],monte:['Les premiers signes sont les mains sur les oreilles et les pleurs sans larmes.','Ce qui apaise le plus, c’est le noir, sa couverture et quelqu’un assis à côté sans parler.'],secu:['Dehors, Noé a besoin d’une main, surtout près d’une route.','En cas de doute, appelle-moi d’abord.']},
    tel:[{n:'Maman',t:'079 000 00 00'},{n:'Papa',t:'079 000 00 01'}]},
  a:{id:'ex-a',qui:'Lina',chez:'sa tante Élise',quand:'du vendredi 20 au dimanche 22 novembre',tu:true,m:'',
    trois:['Lina a besoin de temps seule après une journée avec du monde. Sa chambre est son refuge, frappe avant d’entrer.','Dis-lui la veille ce qui est prévu. Un changement de dernière minute la met en difficulté.','Son téléphone est son lien avec ses amies. Nous avons convenu ensemble qu’il s’arrête à 22 heures.'],
    moi:['J’aime dessiner, et je préfère qu’on ne commente pas mes dessins.','Je n’aime pas qu’on me touche les cheveux.','Quand je mets mon casque, j’ai besoin de calme. Je ne boude pas.'],
    s:{aide:['Une seule consigne à la fois, avec des mots simples.','Du temps pour répondre. Compte jusqu’à 10 dans ta tête avant de répéter.'],repas:['Lina mange de tout, sauf le poisson et les plats très épicés.','Elle aime aider à cuisiner si on lui confie une tâche précise.'],nuit:['Elle se couche vers 22 heures 30 et lit un moment.','Le matin, Lina a besoin d’un moment de calme avant de parler.'],monte:['Les premiers signes sont les réponses très courtes et les mains qui se tordent.','Parler peu, baisser la voix et laisser de la place aide Lina à redescendre.']},
    tel:[{n:'Maman',t:'079 000 00 00'}]},
  g:{id:'ex-g',qui:'Bastien',chez:'son oncle Rémi',quand:'du samedi 21 au dimanche 22 novembre',tu:true,m:'',
    trois:['Bastien a besoin de savoir ce qui vient après. Dis-lui le programme le matin, en 3 étapes au plus.','Quand il se balance et parle plus fort, il sature. Propose-lui sa chambre et son casque, puis laisse-lui 10 minutes.','C’est un adulte. Demande-lui son avis avant de décider pour lui, même pour un détail.'],
    moi:['J’aime prendre mon café seul, le matin.','Je n’aime pas qu’on parle de moi comme si je n’étais pas là.','Je choisis mes habits moi-même.'],
    s:{aide:['Une seule consigne à la fois, avec des mots simples.','Du temps pour répondre. Compte jusqu’à 10 dans ta tête avant de répéter.'],repas:['Bastien mange de tout, sauf les plats en sauce où tout est mélangé.','Bastien a besoin d’aide pour couper et se sert pour le reste.'],nuit:['Il se couche vers 22 heures, après sa série.','La porte reste entrouverte et la lumière du couloir reste allumée.'],monte:['Parler peu, baisser la voix et laisser de la place aide Bastien à redescendre.','Quand c’est passé, un verre d’eau suffit. Il n’y a pas besoin d’en reparler.'],secu:['Les médicaments sont préparés dans le pilulier. Ils se donnent à 8 heures et à 20 heures.']},
    tel:[{n:'Maman',t:'079 000 00 00'},{n:'Le foyer',t:'026 000 00 00'}]}
};
/* Le dictionnaire de la compression. Il est figé : le changer rendrait illisibles les liens déjà envoyés. Une nouvelle version aurait un autre préfixe. */
const RL_DICO='Les médicaments sont préparés dans le pilulier. Ils se donnent à 8 heures et à 20 heures. ne doit pas manger Dehors, a besoin d’un adulte à côté, surtout près d’une route. ne sait pas nager. En cas de doute, appelle-moi d’abord. appelez-moi d’abord. aime choisir entre 2 propositions. Une activité qui marche presque toujours, c’est n’aime pas comprend mieux les phrases courtes, une idée à la fois. Pour dire oui, hoche la tête. Pour dire non, détourne le regard. montre ce qui compte avec des images, des gestes ou en tirant par la main. Une question répétée sert souvent à se rassurer. La même réponse, dite calmement, suffit. Mieux vaut une question à la fois, avec 2 choix au plus. Les premiers signes sont Parler peu, baisser la voix et laisser de la place aide à redescendre. Mieux vaut prévenir avant de s’approcher ou de toucher. Ce qui apaise le plus, c’est Quand c’est passé, un verre d’eau suffit. Il n’y a pas besoin d’en reparler. Tu peux m’appeler à tout moment, cela ne me dérange jamais. Vous pouvez Le coucher se fait vers 21 heures, toujours dans le même ordre. Une veilleuse reste allumée et la porte reste entrouverte. En cas de réveil, une phrase courte suffit, par exemple « C’est la nuit, je suis là ». Les écrans s’arrêtent 1 heure avant le coucher. Le matin, a besoin d’un moment de calme avant de parler. mange volontiers Proposer un aliment suffit. Insister pour goûter complique le repas. Les aliments se servent séparés dans l’assiette. a besoin d’aide pour couper et se sert pour le reste. À table, 20 minutes suffisent. Ensuite, peut se lever. Un signal 5 minutes avant de changer d’activité aide beaucoup Une seule consigne à la fois, avec des mots simples. Le programme de la journée, dit le matin en 3 étapes au plus. Un endroit calme où se retirer quand il y a du bruit ou du monde. Du temps pour répondre. Compte jusqu’à 10 dans ta tête avant de répéter. Comptez jusqu’à 10 dans votre tête Son objet du moment reste à portée de main. Il s’agit de J’aime Je n’aime pas Pour m’aider, on peut Je décide moi-même de Quand je dis non, du samedi au dimanche vendredi novembre décembre janvier février mars avril mai juin juillet août septembre octobre son oncle sa tante sa grand-mère son grand-père ses grands-parents mon frère ma sœur notre fils notre fille mon fils ma fille Maman Papa 079 078 077 076 026 021 022 "],"comm":["","aime":["","secu":[""],"nuit":["","monte":[""],"repas":["","aide":[""]},"j":[["","0"],[""]],"d":"2026-11-{"q":"","c":"","w":"","u":1,"t":["","","","m":[""],"s":{"aide":["';

function rel(){const d=D();if(!d.rel||typeof d.rel!=='object')d.rel={};const r=d.rel;if(!Array.isArray(r.fiches))r.fiches=[];if(!Array.isArray(r.reunions))r.reunions=[];return r;}
function rlId(){return 'r'+Date.now().toString(36)+Math.floor(Math.random()*1296).toString(36);}
function rlFiche(id){return rel().fiches.find(f=>f.id===id)||null;}
function rlReu(id){return rel().reunions.find(x=>x.id===id)||null;}
function rlVide(){return {id:rlId(),c:todayIso(),m:todayIso(),qui:'',chez:'',quand:'',tu:true,trois:['','',''],moi:[],s:{},tel:[{n:'',t:''}],env:'',retour:'',garde:''};}
function rlOuvert(){return can('relais')||!!D().tout;}
function rlDe(p){return (/^[aeiouyhàâéèêëîïôöùûœ]/i.test(p)?'d’':'de ')+p;}
function rlTitre(f){return f.qui?'Le relais '+rlDe(f.qui):'La fiche de relais';}
function rlSousTitre(f){const a=[];if(f.chez)a.push('Pour '+f.chez);if(f.quand)a.push(f.quand);return a.join(', ');}
function rlMaj(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s;}
/* Une phrase modèle, écrite pour cette fiche : avec le nom choisi, et en tutoyant ou en vouvoyant le proche. */
function rlModele(m,f){const t=Array.isArray(m)?m[f.tu===false?1:0]:m;const p=f.qui||'votre enfant';return t.replace(/\{Pm\}/g,rlMaj(p)).replace(/\{P\}/g,p);}
function rlLignes(f,k){if(!f.s||typeof f.s!=='object')f.s={};if(!Array.isArray(f.s[k]))f.s[k]=[];return f.s[k];}
function rlToutes(f){const out=[];RL_SEC.forEach(S=>((f.s||{})[S[0]]||[]).forEach(x=>{const t=clean(x,RL_LIM.l);if(t&&out.indexOf(t)<0)out.push(t);}));return out;}
function rlTelHtml(t){const s=String(t||'');return /^[+0-9 ().-]{6,20}$/.test(s)?'<a href="tel:'+esc(s.replace(/[^+0-9]/g,''))+'">'+esc(s)+'</a>':esc(s);}
function rlPropre(f){
  const L=(a,n)=>(Array.isArray(a)?a:[]).map(x=>clean(x,RL_LIM.l)).filter(Boolean).slice(0,n);
  const o={qui:clean(f.qui,RL_LIM.nom),chez:clean(f.chez,RL_LIM.chez),quand:clean(f.quand,RL_LIM.quand),tu:f.tu!==false,trois:L(f.trois,3),moi:L(f.moi,RL_LIM.moi),s:{},tel:(Array.isArray(f.tel)?f.tel:[]).map(x=>({n:clean(x&&x.n,RL_LIM.tel),t:clean(x&&x.t,RL_LIM.tel)})).filter(x=>x.n||x.t).slice(0,3),m:f.m||''};
  RL_SEC.forEach(S=>{const l=L((f.s||{})[S[0]],RL_LIM.lignes);if(l.length)o.s[S[0]]=l;});
  return o;
}
/* La fiche, telle qu'elle est lue, envoyée et imprimée. Un seul dessin pour l'exemple, l'aperçu, la fiche reçue et l'impression. */
/* Une fiche tient sur une page A4. On la pose hors de l'écran telle qu'elle sera imprimée, on mesure sa hauteur,
   et l'on resserre le texte en 2 crans si elle est chargée. La hauteur utile d'une feuille est de 269 mm. On garde 5 % de marge. */
const RL_PAGE_MM=269*.95;
function rlMesure(f0){
  let b=null;
  try{
    if(typeof document==='undefined'||!document.body)return {d:0,ok:true};
    b=document.createElement('div');b.className='rl-banc';b.setAttribute('aria-hidden','true');
    b.innerHTML='<div class="rl-etalon" style="height:100mm"></div>'+rlFicheHtml(f0,{cls:'rl-papier',brut:true});
    document.body.appendChild(b);
    const mm=b.firstElementChild.getBoundingClientRect().height/100;const el=b.lastElementChild;
    if(!(mm>0))return {d:0,ok:true};
    let d=0,h=0;
    for(d=0;d<3;d++){el.classList.remove('rl-d0','rl-d1','rl-d2');el.classList.add('rl-d'+d);h=el.getBoundingClientRect().height/mm;if(h<=RL_PAGE_MM)break;}
    return {d:Math.min(d,2),ok:h<=RL_PAGE_MM,mm:Math.round(h)};
  }catch(e){return {d:0,ok:true};}
  finally{try{if(b&&b.parentNode)b.parentNode.removeChild(b);}catch(e){}}
}
function rlFicheHtml(f0,o){
  o=o||{};const f=rlPropre(f0),tu=f.tu,P=f.qui;const H=o.h1?'h1':'h2';const T=o.h1?['<h2 class="rl-h">','</h2>']:['<h3>','</h3>'];
  const dens=o.brut?null:rlMesure(f0);if(dens&&o.mesure)o.mesure.d=dens.d,o.mesure.ok=dens.ok;
  const li=a=>a.map(x=>'<li>'+esc(x)+'</li>').join('');
  const secs=RL_SEC.map(S=>{const L=f.s[S[0]];return L?'<section class="rl-s">'+T[0]+esc(P?S[2].replace('{P}',P):S[1])+T[1]+'<ul>'+li(L)+'</ul></section>':'';}).join('');
  return '<article class="rl-fiche'+(o.cls?' '+o.cls:'')+(dens?' rl-d'+dens.d:'')+'">'+
    '<header class="rl-tete"><span class="rl-goutte" aria-hidden="true">'+LOGO+'</span><div><'+H+' class="rl-t">'+esc(rlTitre(f))+'</'+H+'>'+(rlSousTitre(f)?'<p class="rl-st">'+esc(rlSousTitre(f))+'</p>':'')+'</div></header>'+
    '<section class="rl-trois">'+T[0]+(tu?'Si tu ne lis que trois choses':'Si vous ne lisez que trois choses')+T[1]+(f.trois.length?'<ol>'+li(f.trois)+'</ol>':'<p class="rl-vide">Vos 3 repères viendront ici.</p>')+'</section>'+
    (f.moi.length?'<section class="rl-moi">'+T[0]+'Ce que je souhaite dire moi-même'+T[1]+'<ul>'+li(f.moi)+'</ul>'+(P?'<p class="rl-signe">'+esc(rlMaj(P))+'</p>':'')+'</section>':'')+
    (secs?'<div class="rl-cols">'+secs+'</div>':'')+
    (f.tel.length?'<section class="rl-tel">'+T[0]+'Me joindre'+T[1]+'<ul>'+f.tel.map(x=>'<li>'+(x.n?'<b>'+esc(x.n)+'</b> ':'')+rlTelHtml(x.t)+'</li>').join('')+'</ul></section>':'')+
    '<footer class="rl-pied"><span>En cas d’urgence vitale, les secours. En Suisse, le 144.</span><span>Fiche écrite par la famille'+(f.m?', le '+esc(fmtDate(f.m)):'')+'.</span></footer></article>';
}
function rlAvantImpression(){
  try{
    const r=state.rl;if(r.e==='feuille')return;const f=r.e==='lu'?r.lu:r.e==='exemple'?RL_EX[RL_EX[r.ex]?r.ex:'g']:rlFiche(r.id);const el=document.querySelector('.v-relais .rl-fiche');
    if(!f||!el)return;const m=rlMesure(f);el.classList.remove('rl-d0','rl-d1','rl-d2');el.classList.add('rl-d'+m.d);
  }catch(e){}
}
function rlTexte(f0){
  const f=rlPropre(f0),out=[rlTitre(f)];const st=rlSousTitre(f);if(st)out.push(st);
  out.push('',f.tu?'Si tu ne lis que trois choses':'Si vous ne lisez que trois choses');f.trois.forEach((x,i)=>out.push((i+1)+'. '+x));
  if(f.moi.length){out.push('','Ce que je souhaite dire moi-même');f.moi.forEach(x=>out.push('- '+x));}
  RL_SEC.forEach(S=>{const L=f.s[S[0]];if(L){out.push('',f.qui?S[2].replace('{P}',f.qui):S[1]);L.forEach(x=>out.push('- '+x));}});
  if(f.tel.length){out.push('','Me joindre');f.tel.forEach(x=>out.push('- '+[x.n,x.t].filter(Boolean).join(' ')));}
  out.push('','En cas d’urgence vitale, les secours. En Suisse, le 144.');
  return out.join('\n');
}

/* ---------- la fiche dans le lien ---------- */
/* La fiche est écrite en JSON, compressée (les mots déjà vus sont remplacés par un renvoi), puis écrite en lettres et en chiffres.
   Elle voyage après le signe # de l'adresse : cette partie-là n'est jamais envoyée au serveur. */
function rlU8(s){return new TextEncoder().encode(s);}
function rlStr(u){return new TextDecoder().decode(u);}
function rlB64(u){let s='';for(let i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function rlB64d(t){t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';const b=atob(t);const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;}
function rlZip(src){
  const dico=rlU8(RL_DICO),n0=dico.length,N=n0+src.length;const buf=new Uint8Array(N);buf.set(dico);buf.set(src,n0);
  const tete=new Map();const cle=p=>buf[p]<<16|buf[p+1]<<8|buf[p+2];
  const note=p=>{if(p+2<N){const k=cle(p);let l=tete.get(k);if(!l){l=[];tete.set(k,l);}l.push(p);}};
  for(let p=0;p<n0;p++)note(p);
  const out=[];let flags=0,nb=0,grp=[],i=n0;
  while(i<N){
    let best=0,bp=0;
    if(i+2<N){const L=tete.get(cle(i));if(L){for(let q=L.length-1;q>=0&&q>=L.length-32;q--){const p=L[q];if(i-p>4095)break;let l=3;while(l<18&&i+l<N&&buf[p+l]===buf[i+l])l++;if(l>best){best=l;bp=p;if(l===18)break;}}}}
    if(best>=3){const off=i-bp;flags|=1<<nb;grp.push(off>>4,(off&15)<<4|(best-3));for(let k=0;k<best;k++){note(i);i++;}}
    else{grp.push(buf[i]);note(i);i++;}
    if(++nb===8){out.push(flags);for(let k=0;k<grp.length;k++)out.push(grp[k]);flags=0;nb=0;grp=[];}
  }
  if(nb){out.push(flags);for(let k=0;k<grp.length;k++)out.push(grp[k]);}
  return new Uint8Array(out);
}
function rlUnzip(z,max){
  const dico=rlU8(RL_DICO),n0=dico.length;const out=new Uint8Array(n0+max);out.set(dico);let n=n0,i=0;
  while(i<z.length){const flags=z[i++];
    for(let b=0;b<8&&i<z.length;b++){
      if(flags>>b&1){if(i+1>=z.length)throw new Error('lien');const a=z[i++],c=z[i++];const off=a<<4|c>>4,len=(c&15)+3;const p=n-off;if(off<1||p<0||n+len>out.length)throw new Error('lien');for(let k=0;k<len;k++)out[n++]=out[p+k];}
      else{if(n>=out.length)throw new Error('lien');out[n++]=z[i++];}
    }}
  return out.subarray(n0,n);
}
/* Une somme de contrôle de 3 octets suit la fiche. Un lien coupé ou abîmé en route est refusé, au lieu d'afficher une fiche fausse d'une lettre ou d'un chiffre. */
function rlSomme(u){let h=0x811c9dc5;for(let i=0;i<u.length;i++){h^=u[i];h=Math.imul(h,0x01000193)>>>0;}return (h^(h>>>24))&0xffffff;}
function rlCode(f0){const f=rlPropre(f0);const o={q:f.qui,c:f.chez,w:f.quand,u:f.tu?1:0,t:f.trois,m:f.moi,s:f.s,j:f.tel.map(x=>[x.n,x.t]),d:f.m};
  const src=rlU8(JSON.stringify(o)),z=rlZip(src),k=rlSomme(src);const u=new Uint8Array(z.length+3);u.set(z);u[z.length]=k>>16&255;u[z.length+1]=k>>8&255;u[z.length+2]=k&255;
  return '1.'+rlB64(u);}
function rlDecode(t){
  try{const m=/^1\.([A-Za-z0-9_-]{8,16000})$/.exec(String(t||''));if(!m)return null;
    const u=rlB64d(m[1]);if(u.length<5)return null;const n=u.length-3;const src=rlUnzip(u.subarray(0,n),24000);const k=rlSomme(src);
    if((k>>16&255)!==u[n]||(k>>8&255)!==u[n+1]||(k&255)!==u[n+2])return null;
    const o=JSON.parse(rlStr(src));if(!o||typeof o!=='object'||Array.isArray(o))return null;
    const f=rlPropre({qui:o.q,chez:o.c,quand:o.w,tu:o.u!==0,trois:o.t,moi:o.m,s:(o.s&&typeof o.s==='object')?o.s:{},tel:(Array.isArray(o.j)?o.j:[]).map(x=>({n:x&&x[0],t:x&&x[1]})),m:/^\d{4}-\d\d-\d\d$/.test(o.d)?o.d:''});
    f.id='lu';return f;}catch(e){return null;}
}
function rlLien(f){return PUBLIC+'relais/#f='+rlCode(f);}
/* Une adresse …/relais/#f=… porte une fiche. Lue au démarrage et quand l'adresse change. */
function rlDuHash(){const m=/^#f=(.+)$/.exec(location.hash||'');if(!m)return false;state.rl.h=m[1];state.rl.lu=rlDecode(m[1]);state.rl.e='lu';return true;}

/* ---------- les écrans ---------- */
function rlFil(noms,p,quoi){return '<ol class="ap-fil rl-fil" aria-label="'+quoi+'">'+noms.map((t,i)=>'<li'+(i===p?' aria-current="step"':'')+' class="'+(i<p?'ap-fait':i===p?'ap-ici':'')+'"><span>'+(i+1)+'</span><b>'+t+'</b></li>').join('')+'</ol>';}
/* La carte de l'offre. Elle dit ce qui est gratuit et ce que l'outil ajoute, puis ouvre la commande. */
function rlOffre(de){
  return '<section class="offre rl-offre" aria-labelledby="rl-offre-t"><div class="f-haut"><h2 id="rl-offre-t">Passer le relais</h2><p class="f-prix"><b>49 CHF</b> <small>une seule fois</small></p></div>'+
    '<p class="f-benef">Envoyer la fiche, l’imprimer et la retrouver prête la prochaine fois.</p>'+
    '<button type="button" class="btn primary wide" data-act="commande" data-v="relais" data-de="'+(de||'relais')+'">Choisir Passer le relais</button>'+
    '<p class="f-note">Voir l’exemple, préparer votre fiche et la relire est gratuit. L’outil sert ensuite à toute la famille, sans abonnement et sans limite de fiches.</p>'+
    '<p class="demo-paie">'+I.info+'<span>'+DEMO_PAIE+'</span></p></section>';
}
function rlVueAccueil(){
  const R=rel(),F=R.fiches,a=rlOuvert();const attente=F.slice().reverse().find(f=>f.env&&!f.retour);
  let h='<div class="f-tete"><span class="label">Un outil pour toute la famille</span><h1 class="t1">Passer le relais</h1><p class="sub">Une page pour la personne qui garde votre enfant, écrite avec vos mots. Elle sait l’essentiel en 1 minute, et vous partez l’esprit plus léger.</p></div>';
  if(!F.length){
    h+='<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="exemple">'+I.eye+'Voir un exemple de fiche terminée</button><button type="button" class="btn wide" data-act="rl" data-k="nouveau">'+I.pen+'Préparer mon premier relais</button></div>'+
      '<ol class="rl-comment"><li><b>Vous choisissez vos phrases.</b><span>Des modèles vous aident à commencer, et vous les adaptez avec vos mots.</span></li><li><b>Vous décidez des 3 repères.</b><span>Ils sont en tête de la fiche, sous « Si tu ne lis que trois choses ».</span></li><li><b>Votre proche ouvre la fiche.</b><span>Il la lit sur son téléphone, sans compte et sans rien acheter.</span></li><li><b>Au retour, une seule question.</b><span>Le prochain relais est alors prêt en quelques gestes.</span></li></ol>'+
      /* L'outil sert aussi sans fiche : une réunion se prépare avec le journal « avant, pendant, après » ou avec ce que le parent écrit sur le moment. */
      (a?'<div class="ap-suite"><button type="button" class="btn wide" data-act="rl" data-k="reunion">'+I.user+'Préparer une réunion avec l’école ou le foyer</button></div>':'');
  }else{
    if(attente&&a)h+='<section class="rl-carte rl-auretour"><h2>Le relais est passé ?</h2><p>'+esc(rlTitre(attente))+(attente.chez?', pour '+esc(attente.chez):'')+'. Une seule question vous attend.</p><button type="button" class="btn primary" data-act="rl" data-k="retour" data-id="'+attente.id+'">Répondre</button></section>';
    h+='<section class="rl-mes" aria-labelledby="rl-mes-t"><h2 id="rl-mes-t">Mes relais</h2><div class="liste">'+F.slice().reverse().map(f=>'<button type="button" class="sit" data-act="rl" data-k="ouvrir" data-id="'+f.id+'"><span class="e">'+I.note+'</span><span class="tx"><b>'+esc(rlTitre(f))+'</b><span>'+esc([f.chez?'Pour '+f.chez:'',f.env?'envoyée le '+fmtDate(f.env):'pas encore envoyée',f.retour?'retour noté':''].filter(Boolean).join(', '))+'</span></span><span class="chev">'+I.chev+'</span></button>').join('')+'</div></section>'+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="suivant">'+I.plus+'Préparer un nouveau relais</button><p class="hint">Vous repartez de votre dernière fiche, et vous ne changez que ce qui change.</p>'+
      '<button type="button" class="btn wide" data-act="rl" data-k="reunion">'+I.user+'Préparer une réunion avec l’école ou le foyer</button><button type="button" class="lien-f" data-act="rl" data-k="exemple">'+I.eye+'Revoir un exemple de fiche</button></div>';
  }
  {
    if(R.reunions.length)h+='<section class="rl-mes" aria-labelledby="rl-reu-t"><h2 id="rl-reu-t">Mes réunions</h2><div class="liste">'+R.reunions.slice().reverse().map(x=>'<button type="button" class="sit" data-act="rl" data-k="feuille" data-id="'+x.id+'"><span class="e">'+I.user+'</span><span class="tx"><b>'+esc(rlReuTitre(x))+'</b><span>'+esc(x.quand||'Ma feuille pour la réunion')+'</span></span><span class="chev">'+I.chev+'</span></button>').join('')+'</div></section>';
  }
  h+=a?'<p class="rl-acquis">'+I.check+'<span>Vous avez Passer le relais. Il sert à toute la famille, sans limite de fiches.</span></p>':rlOffre('relais');
  h+='<p class="rl-prive">'+I.lock+'<span>Vos fiches restent sur votre appareil. Vous décidez de ce que vous envoyez, et à qui.</span></p>'+
    '<button type="button" class="lien-f" data-act="rl" data-k="sauver">'+I.download+'Sauvegarder ou restaurer mes écrits</button>';
  return h;
}
function rlVueExemple(){
  const k=RL_EX[state.rl.ex]?state.rl.ex:'g';
  return '<div class="f-tete"><span class="label">Un exemple, inventé pour vous montrer</span><h1 class="t1">Une fiche terminée</h1><p class="sub">Voici ce que reçoit la personne qui prend le relais. Elle l’ouvre sur son téléphone, sans compte et sans rien acheter.</p></div>'+
    '<div class="chips rl-ages" role="group" aria-label="Choisir un âge">'+[['e','À 5 ans'],['a','À 16 ans'],['g','À 35 ans']].map(x=>'<button type="button" class="chip" data-act="rl" data-k="ex" data-v="'+x[0]+'" aria-pressed="'+(k===x[0])+'">'+x[1]+'</button>').join('')+'</div>'+
    rlFicheHtml(RL_EX[k],{cls:'rl-ex'})+
    '<p class="hint">Les prénoms et les numéros de cet exemple sont inventés.</p>'+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="nouveau">'+I.pen+(rel().fiches.length?'Préparer un relais':'Préparer mon premier relais')+'</button><p class="hint">Vous choisissez chaque phrase, et rien ne part sans vous.</p>'+(SITE?'<button type="button" class="lien-f" data-act="rl" data-k="imprimer">Imprimer cet exemple</button>':'')+'</div>';
}
function rlChamp(id,ch,lab,val,ph,lim,aide){return '<div class="field"><label for="'+id+'">'+lab+'</label><input type="text" id="'+id+'" data-rl="'+ch+'" maxlength="'+lim+'" value="'+esc(val||'')+'" placeholder="'+esc(ph)+'" autocomplete="off">'+(aide?'<p class="hint">'+aide+'</p>':'')+'</div>';}
function rlVuePrep(){
  const f=rlFiche(state.rl.id);if(!f)return rlVueAccueil();
  const p=Math.max(0,Math.min(4,state.rl.p||0));const P=f.qui||'votre enfant';
  let c='<div class="f-tete"><span class="label">'+(rel().fiches.length>1?'Un nouveau relais':'Mon premier relais')+'</span>';
  /* Dès que la fiche dépasse une page imprimée, la famille le sait, là où elle écrit. */
  const trop=()=>{const m=rlMesure(f);return m.ok?'':'<p class="rl-page rl-trop">'+I.info+'<span>Imprimée, votre fiche dépasse maintenant une page. Votre proche la lira plus facilement si vous retirez une phrase ou deux.</span></p>';};
  const suite=(txt)=>(p>0?trop():'')+'<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="pas" data-v="1">'+txt+' '+I.chev+'</button>'+(p>0?'<button type="button" class="btn ghost wide" data-act="rl" data-k="pas" data-v="-1">Revenir</button>':'')+'</div>';
  if(p===0){
    c+='<h1 class="t1">Pour qui, et chez qui ?</h1><p class="sub">Ces mots servent seulement à écrire la fiche. Ils restent sur votre appareil.</p></div>'+rlFil(RL_PAS,p,'Les 5 moments de la préparation')+
      (f.garde?'<section class="rl-carte rl-garde"><h2>La dernière fois, vous vouliez garder ceci</h2><p class="rl-cite">'+nl2(f.garde)+'</p><button type="button" class="btn" data-act="rl" data-k="garde">'+I.plus+'L’ajouter à « Ce qui aide »</button></section>':'')+
      rlChamp('rl-qui','qui','Comment l’appelez-vous dans cette fiche ?',f.qui,'Son prénom, ou « notre fils », « ma fille »',RL_LIM.nom,'')+
      rlChamp('rl-chez','chez','Qui prend le relais ?',f.chez,'Par exemple, son oncle Rémi',RL_LIM.chez,'')+
      rlChamp('rl-quand','quand','Quand ?',f.quand,'Par exemple, du samedi 21 au dimanche 22 novembre',RL_LIM.quand,'Vous pouvez laisser cette ligne vide.')+
      '<div class="rl-tu"><span class="label" id="rl-tu-l">Dans la fiche, vous dites</span><div class="seg" role="group" aria-labelledby="rl-tu-l"><button type="button" data-act="rl" data-k="tu" data-v="1" aria-pressed="'+(f.tu!==false)+'">Tu</button><button type="button" data-act="rl" data-k="tu" data-v="0" aria-pressed="'+(f.tu===false)+'">Vous</button></div></div>'+
      suite('Continuer');
  }else if(p===1){
    c+='<h1 class="t1">Ce qui aide '+esc(P)+' au quotidien</h1><p class="sub">Choisissez une phrase, puis adaptez-la. 2 ou 3 phrases par rubrique suffisent, et une rubrique peut rester vide.</p></div>'+rlFil(RL_PAS,p,'Les 5 moments de la préparation')+
      RL_SEC.map(S=>{const k=S[0],L=rlLignes(f,k),ouv=state.rl.sec===k;
        return '<section class="rl-rub" aria-labelledby="rl-r-'+k+'"><h2 id="rl-r-'+k+'">'+esc(f.qui?S[2].replace('{P}',f.qui):S[1])+'</h2>'+
          L.map((x,i)=>'<div class="rl-ligne"><textarea rows="2" maxlength="'+RL_LIM.l+'" data-rl="s.'+k+'.'+i+'" aria-label="Phrase '+(i+1)+', '+esc(S[1])+'">'+esc(x)+'</textarea><button type="button" class="rl-ote" data-act="rl" data-k="ote" data-s="'+k+'" data-i="'+i+'" aria-label="Retirer cette phrase">'+I.trash+'</button></div>').join('')+
          (L.length>=RL_LIM.lignes?'<p class="hint">'+RL_LIM.lignes+' phrases, c’est déjà beaucoup pour une page.</p>':
            ouv?'<div class="rl-modeles" role="group" aria-label="Phrases à adapter">'+S[3].map((m,i)=>'<button type="button" class="rl-m" data-act="rl" data-k="modele" data-s="'+k+'" data-i="'+i+'">'+esc(rlModele(m,f))+'</button>').join('')+'<button type="button" class="rl-m rl-libre" data-act="rl" data-k="vierge" data-s="'+k+'">'+I.pen+'Écrire ma propre phrase</button></div>':
            '<button type="button" class="lien-f" data-act="rl" data-k="idees" data-s="'+k+'">'+I.plus+'Ajouter une phrase</button>')+'</section>';}).join('')+
      suite('Choisir les 3 repères');
  }else if(p===2){
    const T=[0,1,2].map(i=>(f.trois||[])[i]||'');const dispo=rlToutes(f).filter(x=>T.indexOf(x)<0);
    c+='<h1 class="t1">'+(f.tu===false?'Si vous ne lisez que trois choses':'Si tu ne lis que trois choses')+'</h1><p class="sub">Ces 3 repères ouvrent la fiche. Si la personne ne lisait que cela, que devrait-elle savoir ?</p></div>'+rlFil(RL_PAS,p,'Les 5 moments de la préparation')+
      '<ol class="rl-3">'+T.map((x,i)=>'<li><textarea rows="3" maxlength="'+RL_LIM.l+'" data-rl="trois.'+i+'" aria-label="Repère '+(i+1)+'" placeholder="'+['Le plus important pour que tout se passe bien','Ce qui évite une difficulté','Ce qui compte pour '+esc(P)][i]+'">'+esc(x)+'</textarea></li>').join('')+'</ol>'+
      (dispo.length?'<div class="rl-modeles" role="group" aria-label="Reprendre une phrase déjà écrite"><span class="label">Reprendre une de vos phrases</span>'+dispo.slice(0,12).map(x=>'<button type="button" class="rl-m" data-act="rl" data-k="pique" data-t="'+esc(x)+'">'+esc(x)+'</button>').join('')+'</div>':'')+
      suite('Continuer');
  }else if(p===3){
    const M=f.moi||[];
    c+='<h1 class="t1">Ce que je souhaite dire moi-même</h1><p class="sub">Cette partie appartient à '+esc(P)+'. Vous pouvez l’écrire ensemble, avec ses mots, ses gestes ou ses images, à tout âge. Elle a sa place à part dans la fiche.</p></div>'+rlFil(RL_PAS,p,'Les 5 moments de la préparation')+
      M.map((x,i)=>'<div class="rl-ligne"><textarea rows="2" maxlength="'+RL_LIM.l+'" data-rl="moi.'+i+'" aria-label="Phrase '+(i+1)+' de '+esc(P)+'">'+esc(x)+'</textarea><button type="button" class="rl-ote" data-act="rl" data-k="ote-moi" data-i="'+i+'" aria-label="Retirer cette phrase">'+I.trash+'</button></div>').join('')+
      (M.length<RL_LIM.moi?'<div class="rl-modeles" role="group" aria-label="Débuts de phrase"><span class="label">Commencer par</span>'+RL_MOI.map((m,i)=>'<button type="button" class="rl-m" data-act="rl" data-k="moi" data-i="'+i+'">'+esc(m.replace(/,$/,''))+'…</button>').join('')+'</div>':'')+
      '<p class="hint">Si '+esc(P)+' préfère ne rien dire cette fois, la fiche s’en passe très bien.</p>'+
      suite(M.filter(Boolean).length?'Continuer':'Passer cette partie');
  }else{
    const T=(f.tel&&f.tel.length?f.tel:[{n:'',t:''}]).slice(0,3);
    c+='<h1 class="t1">Me joindre</h1><p class="sub">Ces numéros apparaissent au bas de la fiche. Vous pouvez laisser cette partie vide.</p></div>'+rlFil(RL_PAS,p,'Les 5 moments de la préparation')+
      T.map((x,i)=>'<div class="rl-contact">'+rlChamp('rl-tn'+i,'tel.'+i+'.n',i?'Une autre personne':'Votre nom dans la fiche',x.n,i?'Par exemple, Papa':'Par exemple, Maman',RL_LIM.tel,'')+rlChamp('rl-tt'+i,'tel.'+i+'.t','Son numéro',x.t,'079 000 00 00',RL_LIM.tel,'')+'</div>').join('')+
      (T.length<3?'<button type="button" class="lien-f" data-act="rl" data-k="tel-plus">'+I.plus+'Ajouter une personne</button>':'')+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="apercu">'+I.eye+'Voir ma fiche</button><button type="button" class="btn ghost wide" data-act="rl" data-k="pas" data-v="-1">Revenir</button></div>';
  }
  return c;
}
function rlVueApercu(){
  const f=rlFiche(state.rl.id);if(!f)return rlVueAccueil();const a=rlOuvert();const n3=(f.trois||[]).filter(x=>clean(x,9)).length;
  const M={d:0,ok:true};const fiche=rlFicheHtml(f,{mesure:M});
  return '<div class="f-tete"><span class="label">Avant d’envoyer</span><h1 class="t1">Voici exactement ce que vous transmettez</h1><p class="sub">Rien d’autre ne part. Vos autres écrits restent sur votre appareil.</p></div>'+
    (n3<3?'<p class="rl-alerte">'+I.info+'<span>'+(n3?'Il vous reste '+(3-n3)+' repère'+(3-n3>1?'s':'')+' à choisir.':'Vos 3 repères ne sont pas encore choisis.')+'</span><button type="button" class="lien-f" data-act="rl" data-k="aller" data-v="2">Les choisir</button></p>':'')+
    fiche+
    (M.ok?'<p class="rl-page">'+I.check+'<span>Votre fiche tient sur une page, sur un téléphone comme sur une feuille.</span></p>':'<p class="rl-page rl-trop">'+I.info+'<span>Imprimée, votre fiche dépasse une page. Votre proche la lira plus facilement si vous retirez une phrase ou deux.</span></p>')+
    '<div class="ap-suite">'+(a?'<button type="button" class="btn primary wide" data-act="rl" data-k="envoi">'+I.send+'Envoyer la fiche</button><button type="button" class="btn wide" data-act="rl" data-k="imprimer">Imprimer la fiche</button>':'')+
    '<button type="button" class="btn'+(a?'':' primary')+' wide" data-act="rl" data-k="aller" data-v="0">'+I.pen+'Modifier la fiche</button>'+(f.env&&a?'<button type="button" class="btn wide" data-act="rl" data-k="retour" data-id="'+f.id+'">Noter le retour</button>':'')+'</div>'+
    (a?'':rlOffre('apercu'));
}
function rlMessage(f){return 'Voici la fiche pour le relais. Elle se lit en 1 minute.';}
function rlVueEnvoi(){
  const f=rlFiche(state.rl.id);if(!f||!rlOuvert())return rlVueApercu();const url=rlLien(f);
  return '<div class="f-tete"><span class="label">Envoyer</span><h1 class="t1">'+esc(f.chez?'Envoyer la fiche à '+f.chez:'Envoyer la fiche')+'</h1></div>'+
    '<ul class="list rl-sait"><li>La fiche est écrite dans le lien lui-même. Aucun serveur ne la reçoit, et le site ne la lit pas.</li><li>La personne l’ouvre sur son téléphone, sans compte et sans rien acheter.</li><li>Toute personne à qui ce lien est transmis peut lire la fiche. Envoyez-le comme vous enverriez une photo de famille.</li></ul>'+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="partage">'+I.share+'Envoyer le lien</button><button type="button" class="btn wide" data-act="rl" data-k="texte">'+I.mail+'Envoyer le texte, sans lien</button><button type="button" class="btn wide" data-act="rl" data-k="imprimer">Imprimer la fiche</button></div>'+
    '<div class="field"><label for="rl-lien">Le lien de la fiche, à copier</label><input type="text" id="rl-lien" readonly value="'+esc(url)+'"><p class="hint">Dans WhatsApp ou dans un message, l’aperçu du lien ne montre rien de votre fiche.</p></div>'+
    '<p class="lecture-l">Quand le relais est passé, revenez ici. Une seule question vous attend, et le prochain relais sera prêt plus vite.</p>'+
    '<div class="rl-recap"><span class="label">Ce qui est envoyé</span>'+rlFicheHtml(f)+'</div>';
}
function rlVueRetour(){
  const f=rlFiche(state.rl.id);if(!f)return rlVueAccueil();
  return '<div class="f-tete"><span class="label">Au retour</span><h1 class="t1">Qu’est-ce qui a bien marché et que vous aimeriez garder pour la prochaine fois ?</h1><p class="sub">C’est la seule question. Quelques mots suffisent, les vôtres ou ceux de la personne qui a pris le relais.</p></div>'+
    '<div class="field"><label for="rl-retour" class="sr">Votre réponse</label><textarea id="rl-retour" data-rl="retour" rows="5" maxlength="'+RL_LIM.retour+'" placeholder="Par exemple, le programme dit le matin a bien aidé.">'+esc(f.retour||'')+'</textarea></div>'+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="retour-ok">'+I.check+'Garder pour la prochaine fois</button><button type="button" class="btn ghost wide" data-act="rl" data-k="accueil">Plus tard</button></div>'+
    '<p class="hint">Votre réponse reste sur votre appareil. Au prochain relais, elle vous sera proposée en un geste.</p>';
}
/* ---------- préparer une réunion ---------- */
function rlReuTitre(x){const a=(RL_AVEC.find(y=>y[0]===x.avec)||RL_AVEC[3])[1];return 'Réunion avec '+a.charAt(0).toLowerCase()+a.slice(1);}
/* Ce que le parent a déjà écrit et qui peut servir : les phrases de ses fiches, ses retours, et son journal « avant, pendant, après ». */
function rlObsDispo(){
  const out=[],vu={};const add=(t,d)=>{t=clean(t,RL_LIM.l);if(t&&!vu[t]){vu[t]=1;out.push({t:t,d:d});}};
  rel().fiches.slice().reverse().forEach(f=>{if(f.retour)add(f.retour,'Votre retour du '+fmtDate(f.retourLe||f.m||todayIso()));(f.trois||[]).forEach(x=>add(x,'Vos 3 repères'));rlToutes(f).forEach(x=>add(x,'Votre fiche de relais'));});
  (D().abc||[]).slice(-5).reverse().forEach(x=>add([x.a?'Avant, '+x.a:'',x.b?'Pendant, '+x.b:'',x.c?'Après, '+x.c:''].filter(Boolean).join('. '),'Votre journal du '+fmtDate(x.date)));
  return out.slice(0,18);
}
function rlVueReunion(){
  const x=rlReu(state.rl.r);if(!x)return rlVueAccueil();const p=Math.max(0,Math.min(3,state.rl.p||0));
  const der=rel().fiches[rel().fiches.length-1];const P=(der&&der.qui)||'votre enfant';
  let c='<div class="f-tete"><span class="label">Préparer une réunion</span>';
  const suite=(txt,k)=>'<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="'+(k||'rpas')+'" data-v="1">'+txt+' '+I.chev+'</button>'+(p>0?'<button type="button" class="btn ghost wide" data-act="rl" data-k="rpas" data-v="-1">Revenir</button>':'')+'</div>';
  if(p===0){
    c+='<h1 class="t1">Avec qui avez-vous rendez-vous ?</h1><p class="sub">En 4 temps, vous arrivez avec vos observations, votre demande et vos 3 priorités sous les yeux.</p></div>'+rlFil(RL_RPAS,p,'Les 4 temps de la préparation')+
      '<div class="chips" role="group" aria-label="Avec qui">'+RL_AVEC.map(a=>'<button type="button" class="chip" data-act="rl" data-k="avec" data-v="'+a[0]+'" aria-pressed="'+(x.avec===a[0])+'">'+a[1]+'</button>').join('')+'</div>'+
      rlChamp('rl-rq','reu.quand','Quand ?',x.quand,'Par exemple, jeudi 3 décembre à 16 heures',RL_LIM.quand,'Vous pouvez laisser cette ligne vide.')+suite('Continuer');
  }else if(p===1){
    const D0=rlObsDispo();const S=x.obs||[];
    c+='<h1 class="t1">Ce que vous avez observé</h1><p class="sub">Ce que vous avez déjà écrit peut servir. Touchez les phrases à emporter, '+RL_LIM.obs+' au plus.</p></div>'+rlFil(RL_RPAS,p,'Les 4 temps de la préparation')+
      (D0.length?'<div class="rl-obs" role="group" aria-label="Vos phrases déjà écrites">'+D0.map(o=>'<button type="button" class="rl-m" data-act="rl" data-k="obs" data-t="'+esc(o.t)+'" aria-pressed="'+(S.indexOf(o.t)>=0)+'"><span>'+esc(o.t)+'</span><small>'+esc(o.d)+'</small></button>').join('')+'</div>':'<p class="lecture-l">Vous n’avez encore rien écrit dans vos fiches ni dans votre journal. Vous pouvez noter une observation ci-dessous.</p>')+
      '<div class="field"><label for="rl-ro">Une autre observation</label><textarea id="rl-ro" data-rl="reu.plus" rows="3" maxlength="'+RL_LIM.l+'" placeholder="Un fait précis, avec le jour si vous l’avez.">'+esc(x.plus||'')+'</textarea></div>'+suite('Continuer');
  }else if(p===2){
    c+='<h1 class="t1">Ce que vous demandez</h1><p class="sub">Une demande claire aide tout le monde. Une ou deux phrases suffisent.</p></div>'+rlFil(RL_RPAS,p,'Les 4 temps de la préparation')+
      '<div class="field"><label for="rl-rd">Ma demande</label><textarea id="rl-rd" data-rl="reu.dem" rows="4" maxlength="'+RL_LIM.dem+'">'+esc(x.dem||'')+'</textarea></div>'+
      (state.rl.mots?'<div class="rl-modeles" role="group" aria-label="Débuts de phrase"><span class="label">Commencer par</span>'+RL_MOTS_ECRIRE.map((m,i)=>'<button type="button" class="rl-m" data-act="rl" data-k="mot" data-i="'+i+'">'+esc(m.replace('{P}',P))+'…</button>').join('')+'</div>':'<button type="button" class="btn rl-perds" data-act="rl" data-k="mots">'+I.bulb+'Je perds mes mots</button>')+suite('Continuer');
  }else{
    const Pr=[0,1,2].map(i=>(x.pri||[])[i]||'');
    c+='<h1 class="t1">Vos 3 priorités</h1><p class="sub">Si la réunion part dans tous les sens, ce sont elles que vous gardez sous les yeux.</p></div>'+rlFil(RL_RPAS,p,'Les 4 temps de la préparation')+
      '<ol class="rl-3">'+Pr.map((v,i)=>'<li><textarea rows="2" maxlength="'+RL_LIM.pri+'" data-rl="reu.pri.'+i+'" aria-label="Priorité '+(i+1)+'" placeholder="'+['Ce qui doit absolument être dit','Ce que vous voulez obtenir','Ce qui peut attendre la prochaine fois'][i]+'">'+esc(v)+'</textarea></li>').join('')+'</ol>'+suite('Voir ma feuille','feuille-ok');
  }
  return c;
}
function rlVueFeuille(){
  const x=rlReu(state.rl.r);if(!x)return rlVueAccueil();const Pr=(x.pri||[]).map(v=>clean(v,RL_LIM.pri)).filter(Boolean);const O=(x.obs||[]).concat(x.plus?[x.plus]:[]).map(v=>clean(v,RL_LIM.l)).filter(Boolean);
  return '<div class="f-tete"><span class="label">'+esc(rlReuTitre(x))+(x.quand?', '+esc(x.quand):'')+'</span><h1 class="t1">Ma feuille pour la réunion</h1></div>'+
    '<article class="rl-fiche rl-reu"><section class="rl-trois"><h2 class="rl-h">Mes 3 priorités</h2>'+(Pr.length?'<ol>'+Pr.map(v=>'<li>'+esc(v)+'</li>').join('')+'</ol>':'<p class="rl-vide">Vos priorités viendront ici.</p>')+'</section>'+
    (x.dem?'<section class="rl-moi"><h2 class="rl-h">Ma demande</h2><p>'+nl2(clean(x.dem,RL_LIM.dem))+'</p></section>':'')+
    (O.length?'<section class="rl-s"><h2 class="rl-h">Ce que j’ai observé</h2><ul>'+O.map(v=>'<li>'+esc(v)+'</li>').join('')+'</ul></section>':'')+'</article>'+
    (state.rl.mots?'<section class="rl-carte rl-dire" aria-labelledby="rl-dire-t"><h2 id="rl-dire-t">Des phrases à dire, telles quelles</h2><ul class="list">'+RL_MOTS_DIRE.map(m=>'<li>'+esc(m)+'</li>').join('')+'</ul><button type="button" class="lien-f" data-act="rl" data-k="mots">Refermer</button></section>':'<button type="button" class="btn primary wide rl-perds" data-act="rl" data-k="mots">'+I.bulb+'Je perds mes mots</button>')+
    '<div class="ap-suite"><button type="button" class="btn wide" data-act="rl" data-k="imprimer">Imprimer ma feuille</button><button type="button" class="btn wide" data-act="rl" data-k="reu-modif">'+I.pen+'Modifier</button><button type="button" class="btn ghost wide" data-act="rl" data-k="accueil">Revenir à mes relais</button></div>'+
    '<p class="hint">Cette feuille reste sur votre appareil. Vous pouvez la garder ouverte pendant la réunion.</p>';
}
/* ---------- sauvegarder et restaurer ---------- */
function rlVueSauver(){
  const r=state.rl;
  return '<div class="f-tete"><span class="label">Vos écrits vous appartiennent</span><h1 class="t1">Sauvegarder ou restaurer mes écrits</h1><p class="sub">Vos fiches, votre carnet et vos dépôts vivent sur cet appareil. Une sauvegarde vous permet de les garder, ou de les emporter sur un autre appareil.</p></div>'+
    '<section class="rl-carte"><h2>Sauvegarder</h2><p>Vous recevez un fichier à garder où vous voulez. Il contient tout ce que vous avez écrit ici, et lui seul.</p><button type="button" class="btn primary" data-act="rl" data-k="sauve">'+I.download+'Sauvegarder dans un fichier</button></section>'+
    '<section class="rl-carte"><h2>Restaurer</h2><p>Vous choisissez un fichier de sauvegarde. Son contenu remplace alors ce qui se trouve sur cet appareil.</p>'+
      (r.attente?'<div class="confirm" role="alert"><span>Remplacer ce que contient cet appareil par la sauvegarde du '+esc(fmtDate(r.attente.le))+' ?</span><div class="row"><button type="button" class="btn danger" data-act="rl" data-k="restaure-oui">Oui, remplacer</button><button type="button" class="btn" data-act="rl" data-k="restaure-non">Annuler</button></div></div>':
      '<label class="btn rl-fichier" for="rl-f">'+I.note+'Choisir un fichier de sauvegarde</label><input type="file" id="rl-f" class="sr" data-rlf="1" accept="application/json,.json">')+'</section>'+
    '<p class="hint">Rien n’est envoyé pendant ces 2 opérations. Le fichier passe de votre appareil à votre appareil.</p>';
}
function rlVueLu(){
  const f=state.rl.lu;
  if(!f)return '<div class="f-tete"><span class="label">Une fiche de relais</span><h1 class="t1">Cette fiche ne s’ouvre pas</h1><p class="sub">Le lien semble incomplet. Demandez à la personne qui vous l’a envoyé de vous le renvoyer en entier.</p></div><div class="ap-suite"><button type="button" class="btn wide" data-act="rl" data-k="exemple">'+I.eye+'Voir un exemple de fiche</button></div>';
  return '<p class="label rl-recu-l">Une fiche de relais, écrite par une famille</p>'+rlFicheHtml(f,{cls:'rl-recu',h1:true})+
    '<div class="ap-suite"><button type="button" class="btn wide" data-act="rl" data-k="imprimer">Imprimer la fiche</button></div>'+
    '<p class="hint">Cette fiche est contenue dans le lien que vous avez reçu. Le site ne l’a ni lue ni enregistrée. Gardez ce lien pour la retrouver.</p>'+
    '<section class="rl-carte"><h2>D’où vient cette fiche ?</h2><p>Elle a été préparée avec « Passer le relais », un outil de Parent Écouté, Parent Éclairé, un espace pour les parents d’une personne en situation de handicap.</p><button type="button" class="lien-f" data-act="rl" data-k="exemple">'+I.eye+'Voir comment une famille prépare sa fiche</button></section>';
}
function viewRelais(){
  const e=state.rl.e||'accueil';
  const c=e==='lu'?rlVueLu():e==='exemple'?rlVueExemple():e==='prep'?rlVuePrep():e==='apercu'?rlVueApercu():e==='envoi'?rlVueEnvoi():e==='retour'?rlVueRetour():e==='reunion'?rlVueReunion():e==='feuille'?rlVueFeuille():e==='sauver'?rlVueSauver():rlVueAccueil();
  return '<main id="main" tabindex="-1" class="view v-feuille v-relais rl-e-'+e+'"><div class="feuille">'+c+'</div></main>';
}
/* La porte de l'outil, posée dans la boîte à outils et sur « Aujourd'hui » quand un retour est attendu. */
function rlPorteHtml(){
  const F=rel().fiches;const attente=rlOuvert()?F.slice().reverse().find(f=>f.env&&!f.retour):null;
  return '<button type="button" class="sit rl-porte" data-act="rl" data-k="ouvre"><span class="e">'+I.hand+'</span><span class="tx"><b>Passer le relais</b><span>'+(attente?'Le relais est passé ? Une seule question vous attend.':F.length?'Vos fiches, et le prochain relais en quelques gestes':'Une page pour la personne qui garde votre enfant')+'</span></span><span class="chev">'+I.chev+'</span></button>';
}
/* Sur la vitrine : les 3 repères d'une fiche d'exemple, pour montrer le résultat avant tout. */
function rlVitrineHtml(){
  const f=RL_EX.g;
  return '<div class="rl-mini" aria-label="Le début d’une fiche d’exemple"><span class="label">'+esc(rlTitre(f))+', '+esc(f.quand)+'</span><b>Si tu ne lis que trois choses</b><ol>'+f.trois.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></div>'+
    '<div class="acc-relais-b"><button type="button" class="btn" data-act="rl" data-k="exemple">'+I.eye+'Voir un exemple de fiche terminée</button><span class="prix">49 CHF, une seule fois</span></div>';
}

/* ---------- les gestes ---------- */
let rlT=null;
function rlPose(f,ch,v){
  const p=ch.split('.');
  if(p[0]==='s'){const L=rlLignes(f,p[1]);L[Number(p[2])]=v;}
  else if(p[0]==='trois'){if(!Array.isArray(f.trois))f.trois=['','',''];f.trois[Number(p[1])]=v;}
  else if(p[0]==='moi'){if(!Array.isArray(f.moi))f.moi=[];f.moi[Number(p[1])]=v;}
  else if(p[0]==='tel'){if(!Array.isArray(f.tel))f.tel=[];const i=Number(p[1]);if(!f.tel[i])f.tel[i]={n:'',t:''};f.tel[i][p[2]==='t'?'t':'n']=v;}
  else if(p[0]==='qui'||p[0]==='chez'||p[0]==='quand'||p[0]==='retour')f[p[0]]=v;
}
/* Chaque champ de l'outil se garde tout seul pendant qu'on écrit. */
function rlSaisie(el){
  const ch=el.dataset.rl;if(!ch)return;const v=String(el.value);
  if(ch.indexOf('reu.')===0){const x=rlReu(state.rl.r);if(!x)return;const p=ch.split('.');
    if(p[1]==='pri'){if(!Array.isArray(x.pri))x.pri=['','',''];x.pri[Number(p[2])]=v.slice(0,RL_LIM.pri);}
    else if(p[1]==='dem')x.dem=v.slice(0,RL_LIM.dem);else if(p[1]==='plus')x.plus=v.slice(0,RL_LIM.l);else if(p[1]==='quand')x.quand=v.slice(0,RL_LIM.quand);}
  else{const f=rlFiche(state.rl.id);if(!f)return;
    const lim=ch==='qui'?RL_LIM.nom:ch==='chez'?RL_LIM.chez:ch==='quand'?RL_LIM.quand:ch==='retour'?RL_LIM.retour:ch.indexOf('tel')===0?RL_LIM.tel:RL_LIM.l;
    rlPose(f,ch,v.slice(0,lim));if(ch!=='retour')f.m=todayIso();}
  clearTimeout(rlT);rlT=setTimeout(save,400);
}
function rlCapture(){try{document.querySelectorAll('#app [data-rl]').forEach(el=>{if(el.tagName==='TEXTAREA'||el.tagName==='INPUT')rlSaisie(el);});}catch(e){}clearTimeout(rlT);}
function rlRange(f){RL_SEC.forEach(S=>{if(f.s&&Array.isArray(f.s[S[0]]))f.s[S[0]]=f.s[S[0]].filter(x=>clean(x,RL_LIM.l));});if(Array.isArray(f.moi))f.moi=f.moi.filter(x=>clean(x,RL_LIM.l));if(Array.isArray(f.tel)){f.tel=f.tel.filter(x=>x&&(clean(x.n,9)||clean(x.t,9)));if(!f.tel.length)f.tel=[{n:'',t:''}];}}
async function rlPartage(f,texte){
  const url=rlLien(f);const corps=texte?rlTexte(f):rlMessage(f);
  const fait=()=>{f.env=todayIso();save();};
  if(navigator.share){try{await navigator.share(texte?{title:rlTitre(f),text:corps}:{title:rlTitre(f),text:corps,url:url});fait();render();return;}catch(e){if(e&&e.name==='AbortError')return;}}
  try{await navigator.clipboard.writeText(texte?corps:url);fait();render();toast(texte?'Le texte de la fiche est copié. Vous pouvez le coller dans un message.':'Le lien de la fiche est copié. Vous pouvez le coller dans un message.');return;}catch(e){}
  fait();render();const c=document.getElementById('rl-lien');if(c){try{c.focus();c.select();}catch(e){}}
  toast('Le lien est prêt à être copié, juste en dessous.');
}
function rlSauve(){
  const o={app:'parent-ecoute',v:1,le:todayIso(),donnees:JSON.parse(JSON.stringify(D()))};const nom='parent-ecoute-mes-ecrits-'+todayIso()+'.json';const txt=JSON.stringify(o);
  try{const b=new Blob([txt],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=nom;a.rel='noopener';a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>{try{URL.revokeObjectURL(u);a.remove();}catch(e){}},4000);
    const c=com();c.sv=todayIso();save();toast('Votre sauvegarde est prête. Elle s’appelle '+nom+'.');}catch(e){toast('La sauvegarde n’a pas pu être créée sur cet appareil.');}
}
/* Le fichier choisi est lu sur l'appareil. Rien n'est remplacé avant que le parent ait dit oui. */
function rlFichier(el){
  const file=el.files&&el.files[0];if(!file)return;
  if(file.size>4000000){toast('Ce fichier est trop gros pour être une sauvegarde de cet espace.');el.value='';return;}
  const rd=new FileReader();
  rd.onload=()=>{let o=null;try{o=JSON.parse(String(rd.result));}catch(e){}
    if(!o||o.app!=='parent-ecoute'||!o.donnees||typeof o.donnees!=='object'||Array.isArray(o.donnees)){toast('Ce fichier n’est pas une sauvegarde de cet espace.');el.value='';return;}
    state.rl.attente={le:/^\d{4}-\d\d-\d\d$/.test(o.le)?o.le:todayIso(),donnees:o.donnees};render();};
  rd.onerror=()=>{toast('Ce fichier n’a pas pu être lu.');};
  rd.readAsText(file);
}
function rlAct(d){
  const r=state.rl,R=rel();rlCapture();let f=rlFiche(r.id);
  const versOutil=()=>{if(state.view!=='relais')nav('relais');};
  if(rlOuvert())usage('relais');
  switch(d.k){
    case 'ouvre':r.e='accueil';r.sec='';r.mots=false;versOutil();break;
    case 'accueil':r.e='accueil';r.sec='';r.mots=false;r.attente=null;break;
    case 'exemple':r.e='exemple';if(d.v&&RL_EX[d.v])r.ex=d.v;versOutil();break;
    case 'ex':if(RL_EX[d.v])r.ex=d.v;break;
    case 'nouveau':{if(R.fiches.length){if(rlOuvert())return rlAct({k:'suivant'});r.id=R.fiches[0].id;}else{entrer('relais');const n=rlVide();R.fiches.push(n);r.id=n.id;save();}r.e='prep';r.p=0;r.sec='';versOutil();break;}
    case 'suivant':{if(!rlOuvert()){r.e='accueil';toast('Repartir de votre dernière fiche fait partie de l’outil.');break;}
      const der=R.fiches[R.fiches.length-1];const n=rlVide();if(der){const c=JSON.parse(JSON.stringify(rlPropre(der)));n.qui=c.qui;n.chez=c.chez;n.tu=c.tu;n.trois=[0,1,2].map(i=>c.trois[i]||'');n.moi=c.moi;n.s=c.s;n.tel=c.tel.length?c.tel:[{n:'',t:''}];n.garde=clean(der.retour,RL_LIM.retour);}
      R.fiches.push(n);r.id=n.id;r.e='prep';r.p=0;r.sec='';save();versOutil();break;}
    case 'ouvrir':{const x=rlFiche(d.id);if(!x)break;r.id=x.id;r.e='apercu';versOutil();break;}
    case 'tu':if(f){f.tu=d.v!=='0';save();}break;
    case 'pas':{if(!f)break;const s=Number(d.v)||0;
      if(r.p===0&&s>0&&!clean(f.qui,RL_LIM.nom)){fieldErr('rl-qui','Écrivez son prénom, ou simplement « notre fils » ou « ma fille ».');return false;}
      rlRange(f);r.p=Math.max(0,Math.min(4,(r.p||0)+s));r.sec='';save();break;}
    case 'aller':if(f){rlRange(f);r.e='prep';r.p=Math.max(0,Math.min(4,Number(d.v)||0));r.sec='';save();}break;
    case 'idees':r.sec=d.s;break;
    case 'modele':{if(!f)break;const S=RL_SEC.find(x=>x[0]===d.s);if(!S)break;const L=rlLignes(f,S[0]);if(L.length<RL_LIM.lignes)L.push(rlModele(S[3][Number(d.i)]||'',f));r.sec='';f.m=todayIso();save();break;}
    case 'vierge':{if(!f)break;const L=rlLignes(f,d.s);if(L.length<RL_LIM.lignes)L.push('');r.sec='';r.foc='s.'+d.s+'.'+(L.length-1);break;}
    case 'ote':if(f){rlLignes(f,d.s).splice(Number(d.i),1);f.m=todayIso();save();}break;
    case 'pique':{if(!f)break;if(!Array.isArray(f.trois))f.trois=['','',''];const i=[0,1,2].find(k=>!clean(f.trois[k],9));if(i===undefined){toast('Vos 3 repères sont déjà choisis. Videz-en un pour le remplacer.');return false;}f.trois[i]=clean(d.t,RL_LIM.l);f.m=todayIso();save();break;}
    case 'moi':{if(!f)break;if(!Array.isArray(f.moi))f.moi=[];if(f.moi.length<RL_LIM.moi){f.moi.push(RL_MOI[Number(d.i)]+' ');r.foc='moi.'+(f.moi.length-1);}break;}
    case 'ote-moi':if(f&&Array.isArray(f.moi)){f.moi.splice(Number(d.i),1);save();}break;
    case 'tel-plus':if(f){if(!Array.isArray(f.tel))f.tel=[];if(f.tel.length<3)f.tel.push({n:'',t:''});}break;
    case 'garde':{if(!f||!f.garde)break;const L=rlLignes(f,'aide');const t=clean(f.garde,RL_LIM.l);if(L.length<RL_LIM.lignes&&L.indexOf(t)<0)L.push(t);f.garde='';save();toast('C’est ajouté à « Ce qui aide ».');break;}
    case 'apercu':if(f){rlRange(f);r.e='apercu';save();}break;
    case 'reprise':r.e=f?'apercu':'accueil';versOutil();break;
    case 'envoi':if(!f)break;if(!rlOuvert()){r.e='apercu';break;}if((f.trois||[]).filter(x=>clean(x,9)).length<1){toast('Choisissez au moins un de vos 3 repères avant d’envoyer.');return false;}r.e='envoi';break;
    case 'partage':if(f&&rlOuvert())rlPartage(f,false);return false;
    case 'texte':if(f&&rlOuvert())rlPartage(f,true);return false;
    case 'imprimer':if(r.e!=='exemple'&&r.e!=='lu'&&!rlOuvert()){toast('Imprimer fait partie de l’outil.');return false;}rlAvantImpression();try{window.print();}catch(e){}return false;
    case 'retour':{const x=rlFiche(d.id)||f;if(!x||!rlOuvert())break;r.id=x.id;r.e='retour';versOutil();break;}
    case 'retour-ok':if(f){f.retour=clean(f.retour,RL_LIM.retour);if(!f.retour){fieldErr('rl-retour','Écrivez quelques mots, ou touchez « Plus tard ».');return false;}f.retourLe=todayIso();save();r.e='accueil';toast('C’est gardé. Au prochain relais, vous le retrouverez.');}break;
    case 'reunion':{if(!rlOuvert()){r.e='accueil';toast('Préparer une réunion fait partie de l’outil.');break;}const x={id:rlId(),c:todayIso(),avec:'ecole',quand:'',obs:[],plus:'',dem:'',pri:['','','']};R.reunions.push(x);r.r=x.id;r.e='reunion';r.p=0;r.mots=false;save();versOutil();break;}
    case 'avec':{const x=rlReu(r.r);if(x&&RL_AVEC.some(a=>a[0]===d.v)){x.avec=d.v;save();}break;}
    case 'rpas':r.p=Math.max(0,Math.min(3,(r.p||0)+(Number(d.v)||0)));r.mots=false;save();break;
    case 'obs':{const x=rlReu(r.r);if(!x)break;if(!Array.isArray(x.obs))x.obs=[];const t=clean(d.t,RL_LIM.l);const i=x.obs.indexOf(t);if(i>=0)x.obs.splice(i,1);else if(x.obs.length<RL_LIM.obs)x.obs.push(t);else{toast(RL_LIM.obs+' observations, c’est déjà beaucoup pour une réunion.');return false;}save();break;}
    case 'mots':r.mots=!r.mots;break;
    case 'mot':{const x=rlReu(r.r);if(!x)break;const der=R.fiches[R.fiches.length-1];const m=RL_MOTS_ECRIRE[Number(d.i)]||'';x.dem=clean((x.dem?x.dem+'\n':'')+m.replace('{P}',(der&&der.qui)||'mon enfant')+' ',RL_LIM.dem)+' ';r.mots=false;r.foc='reu.dem';save();break;}
    case 'feuille-ok':r.e='feuille';r.mots=false;save();break;
    case 'feuille':{const x=rlReu(d.id);if(!x)break;r.r=x.id;r.e='feuille';r.mots=false;versOutil();break;}
    case 'reu-modif':r.e='reunion';r.p=0;r.mots=false;break;
    case 'sauver':r.e='sauver';r.attente=null;versOutil();break;
    case 'sauve':rlSauve();return false;
    case 'restaure-non':r.attente=null;break;
    case 'restaure-oui':{if(!r.attente)break;const dn=r.attente.donnees;state.data=migre(Object.assign(JSON.parse(JSON.stringify(DEF)),dn));state.data.onboarded=true;if(!state.data.start)state.data.start=todayIso();save();r.attente=null;r.e='accueil';r.id=null;r.r=null;toast('Vos écrits sont restaurés sur cet appareil.');break;}
    default:return false;
  }
  return true;
}
/* Après un nouveau rendu, le curseur va dans la ligne que l'on vient d'ajouter. */
function rlApres(){const ch=state.rl.foc;if(!ch)return;state.rl.foc='';try{const el=document.querySelector('#app [data-rl="'+ch+'"]');if(el){el.focus();const n=el.value.length;el.setSelectionRange(n,n);}}catch(e){}}
/* Sur « Aujourd'hui », seulement quand un relais envoyé attend son retour. */
function rlRappelHtml(){if(!rlOuvert())return '';const f=rel().fiches.slice().reverse().find(x=>x.env&&!x.retour&&x.env!==todayIso());if(!f)return '';
  return '<div class="card rl-rappel reveal d2"><span class="label">Passer le relais</span><p class="rg-t">'+esc(rlTitre(f))+(f.chez?', pour '+esc(f.chez):'')+'. Le relais est passé ?</p><button type="button" class="btn primary" data-act="rl" data-k="retour" data-id="'+f.id+'">Répondre à une seule question</button></div>';}
