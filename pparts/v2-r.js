
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
  ['aide','Ce qui aide','Ce qui aide {P}',['Dire « encore 5 minutes » avant de changer d’activité aide beaucoup {P}.','Une seule consigne à la fois, avec des mots simples.','Le programme de la journée, dit le matin en 3 étapes au plus.','Un endroit calme où se retirer quand il y a du bruit ou du monde.',['Du temps pour répondre. Compte jusqu’à 10 dans ta tête avant de répéter.','Du temps pour répondre. Comptez jusqu’à 10 dans votre tête avant de répéter.'],'Son objet du moment reste à portée de main. Il s’agit de']],
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
/* Trois fiches d'exemple, inventées : un enfant, une adolescente, un adulte. Aucun âge n'est affiché : l'outil sert à tout âge. Les prénoms et les numéros ne sont ceux de personne. */
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
  /* « se-pose » : la feuille vient se poser, une seule fois, quand l'aperçu s'ouvre (voir rlSePose). */
  const ps=o.pose==null?null:o.pose;
  return '<article class="rl-fiche'+(o.cls?' '+o.cls:'')+(dens?' rl-d'+dens.d:'')+(ps!=null?' se-pose':'')+'"'+(ps>.05?' style="--pose-d:-'+ps.toFixed(2)+'s"':'')+'>'+
    '<header class="rl-tete"><span class="rl-goutte" aria-hidden="true">'+LOGO+'</span><div><'+H+' class="rl-t">'+esc(rlTitre(f))+'</'+H+'>'+(rlSousTitre(f)?'<p class="rl-st">'+esc(rlSousTitre(f))+'</p>':'')+'</div></header>'+
    '<section class="rl-trois">'+T[0]+(tu?'Si tu ne lis que trois choses':'Si vous ne lisez que trois choses')+T[1]+(f.trois.length?'<ol>'+li(f.trois)+'</ol>':'<p class="rl-vide">Vos 3 repères viendront ici.</p>')+'</section>'+
    (f.moi.length?'<section class="rl-moi">'+T[0]+'Ce que je souhaite dire moi-même'+T[1]+'<ul>'+li(f.moi)+'</ul>'+(P?'<p class="rl-signe">'+esc(rlMaj(P))+'</p>':'')+'</section>':'')+
    (secs?'<div class="rl-cols">'+secs+'</div>':'')+
    (f.tel.length?'<section class="rl-tel">'+T[0]+'Me joindre'+T[1]+'<ul>'+f.tel.map(x=>'<li>'+(x.n?'<b>'+esc(x.n)+'</b> ':'')+rlTelHtml(x.t)+'</li>').join('')+'</ul></section>':'')+
    '<footer class="rl-pied"><span>En cas d’urgence vitale, les secours. En Suisse, le 144.</span><span>Fiche écrite par la famille'+(f.m?', le '+esc(fmtDate(f.m)):'')+'.</span></footer></article>';
}
/* La feuille qui se pose. Quand le parent ouvre l'aperçu de sa fiche (ou l'exemple), la feuille descend de quelques millimètres,
   se redresse et son ombre se resserre, comme une feuille que l'on pose devant lui. Cela dure 1 seconde, une seule fois.
   rlSePose rend le temps écoulé depuis l'ouverture, ou null quand il n'y a rien à jouer : si l'écran est redessiné pendant le mouvement,
   il continue là où il en était. Avec « Réduire les animations », la feuille est simplement là. Imprimée, elle ne bouge jamais. */
function rlSePose(){const t=state.rl.poseT;if(!t||!fxOn())return null;const dt=(performance.now()-t)/1000;return dt<1.5?dt:null;}
/* À l'ouverture, le titre « Si tu ne lis que trois choses » et ses 3 repères doivent se lire ensemble, sans faire défiler.
   Si l'écran est assez grand, la page ne bouge pas. Sinon elle s'ouvre un peu plus bas, juste ce qu'il faut, et toujours au début
   d'un bloc entier (jamais au milieu d'une ligne) : d'abord sans le petit titre, puis sans le grand titre, puis directement sur la feuille.
   Ce qui est passé au-dessus reste à portée de doigt. Sur un très petit écran, la page s'ouvre sur le titre des 3 repères. */
function rlVoirTrois(){
  try{
    const fe=document.querySelector('.v-relais .feuille'),fi=fe&&fe.querySelector(':scope>.rl-fiche'),t=fi&&fi.querySelector('.rl-trois');if(!t)return;
    const barre=document.querySelector('header.bar');const haut=(barre?Math.max(0,barre.getBoundingClientRect().bottom):0)+6;
    let bas=window.innerHeight;const tabs=document.querySelector('.tabs');
    if(tabs&&getComputedStyle(tabs).position==='fixed'){const y=tabs.getBoundingClientRect().top;if(y>window.innerHeight/2)bas=y;}
    bas-=6;
    const r=t.getBoundingClientRect(),manque=r.bottom-bas;if(manque<=0)return;
    /* les débuts de bloc possibles, de haut en bas, jusqu'à la feuille */
    const C=[];
    for(const el of fe.children){if(el===fi){C.push(el.getBoundingClientRect().top-haut);break;}
      if(el.classList.contains('f-tete'))[].forEach.call(el.children,x=>C.push(x.getBoundingClientRect().top-haut));else C.push(el.getBoundingClientRect().top-haut);}
    let dy=C.filter(v=>v>=manque-1).sort((a,b)=>a-b)[0];
    if(dy==null)dy=manque;
    dy=Math.min(dy,r.top-haut);
    if(dy>0)window.scrollTo(0,Math.round(window.scrollY+dy));
  }catch(e){}
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
  /* Sur l'accueil de l'outil : le prix, ce qu'il apporte, et un seul geste. Tant que la vente est fermée, ce geste est d'essayer. */
  return '<section class="offre rl-offre" aria-labelledby="rl-offre-t"><div class="f-haut"><h2 id="rl-offre-t">Passer le relais</h2><p class="f-prix"><b>49 CHF</b> <small>une seule fois</small></p></div>'+
    '<p class="f-benef">Envoyer la fiche, l’imprimer et la retrouver prête la prochaine fois.</p>'+
    (venteDemo()?'<button type="button" class="btn primary wide" data-act="commande" data-v="relais" data-de="'+(de||'relais')+'">Choisir Passer le relais</button>':prevenirBtn('relais'))+
    '<p class="f-note">Voir l’exemple, préparer votre fiche et la relire est gratuit. L’outil sert ensuite à toute la famille, sans abonnement et sans limite de fiches.</p>'+
    '<p class="demo-paie">'+I.info+'<span>'+demoPaie()+'</span></p></section>';
}
function rlVueAccueil(){
  const R=rel(),F=R.fiches,a=rlOuvert();const attente=F.slice().reverse().find(f=>f.env&&!f.retour);
  let h='<div class="f-tete"><span class="label">Un outil pour toute la famille</span><h1 class="t1">Passer le relais</h1><p class="sub">Une page pour la personne qui garde votre enfant, écrite avec vos mots. Elle sait l’essentiel en 1 minute, et vous partez l’esprit plus léger.</p></div>';
  if(!F.length){
    h+='<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="essai">'+I.pen+'Préparer les 3 choses à savoir pour samedi</button><p class="hint">Un premier essai gratuit. Vous voyez la fiche comme votre proche la recevra.</p><button type="button" class="btn wide" data-act="rl" data-k="exemple">'+I.eye+'Voir un exemple de fiche terminée</button><button type="button" class="lien-f" data-act="rl" data-k="nouveau">'+I.note+'Préparer une fiche complète, en 5 moments</button></div>'+
      '<ol class="rl-comment"><li><b>Vous choisissez vos phrases.</b><span>Des modèles vous aident à commencer, et vous les adaptez avec vos mots.</span></li><li><b>Vous décidez des 3 repères.</b><span>Ils sont en tête de la fiche, sous « Si tu ne lis que trois choses ».</span></li><li><b>Votre proche ouvre la fiche.</b><span>Il la lit sur son téléphone, sans compte et sans rien acheter.</span></li><li><b>Au retour, une seule question.</b><span>Le prochain relais est alors prêt en quelques gestes.</span></li></ol>'+
      /* L'outil sert aussi sans fiche : une réunion se prépare avec le journal « avant, pendant, après » ou avec ce que le parent écrit sur le moment. */
      (a?'<div class="ap-suite"><button type="button" class="btn wide" data-act="rl" data-k="reunion">'+I.user+'Préparer une réunion avec l’école ou le foyer</button></div>':'');
  }else{
    /* Un parent qui essaie retrouve d'abord son brouillon. Les gestes de l'outil complet ne lui sont pas montrés comme des boutons qui refusent :
       ils sont dits plus bas, avec le prix, et il peut essayer aussi pour une réunion. */
    const ec=rlEsEnCours();
    if(ec&&!ec.reu)h+='<section class="rl-carte rl-es-reprise"><h2>Votre brouillon vous attend</h2><p>'+esc(ec.t)+', avec '+ec.n+' repère'+(ec.n>1?'s':'')+' déjà écrit'+(ec.n>1?'s':'')+'.</p><button type="button" class="btn primary" data-act="rl" data-k="essai" data-v="'+ec.v+'">'+I.pen+'Reprendre mon brouillon</button></section>';
    if(attente&&a)h+='<section class="rl-carte rl-auretour"><h2>Le relais est passé ?</h2><p>'+esc(rlTitre(attente))+(attente.chez?', pour '+esc(attente.chez):'')+'. Une seule question vous attend.</p><button type="button" class="btn primary" data-act="rl" data-k="retour" data-id="'+attente.id+'">Répondre</button></section>';
    h+='<section class="rl-mes" aria-labelledby="rl-mes-t"><h2 id="rl-mes-t">Mes relais</h2><div class="liste">'+F.slice().reverse().map(f=>'<button type="button" class="sit" data-act="rl" data-k="ouvrir" data-id="'+f.id+'"><span class="e">'+I.note+'</span><span class="tx"><b>'+esc(rlTitre(f))+'</b><span>'+esc([f.chez?'Pour '+f.chez:'',f.env?'envoyée le '+fmtDate(f.env):'pas encore envoyée',f.retour?'retour noté':''].filter(Boolean).join(', '))+'</span></span><span class="chev">'+I.chev+'</span></button>').join('')+'</div></section>'+
      (a?'<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="suivant">'+I.plus+'Préparer un nouveau relais</button><p class="hint">Vous repartez de votre dernière fiche, et vous ne changez que ce qui change.</p>'+
      '<button type="button" class="btn wide" data-act="rl" data-k="reunion">'+I.user+'Préparer une réunion avec l’école ou le foyer</button><button type="button" class="lien-f" data-act="rl" data-k="exemple">'+I.eye+'Revoir un exemple de fiche</button></div>':
      '<div class="ap-suite"><button type="button" class="btn wide" data-act="rl" data-k="essai" data-v="reunion">'+I.user+'Essayer aussi pour une réunion</button><p class="hint">Vos 3 priorités sur une feuille, pour l’école, le foyer ou un thérapeute. C’est un essai gratuit.</p>'+
      '<button type="button" class="lien-f" data-act="rl" data-k="exemple">'+I.eye+'Revoir un exemple de fiche</button></div>');
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
  return '<div class="f-tete"><span class="label">Un exemple, inventé pour vous montrer</span><h1 class="t1">Une fiche terminée</h1><p class="sub">Voici ce que reçoit la personne qui prend le relais. Elle l’ouvre sur son téléphone, sans compte et sans rien acheter.</p>'+
    /* L'essai est à un geste dès le haut de l'exemple, sans avoir à faire défiler toute la fiche. */
    (rlOuvert()||rel().fiches.length?'':'<button type="button" class="lien-f rl-ex-essai" data-act="rl" data-k="essai">'+I.pen+'Préparer la mienne, en 3 repères</button>')+'</div>'+
    '<div class="chips rl-ages" role="group" aria-label="Choisir un exemple">'+[['e','Un enfant'],['a','Une adolescente'],['g','Un adulte']].map(x=>'<button type="button" class="chip" data-act="rl" data-k="ex" data-v="'+x[0]+'" aria-pressed="'+(k===x[0])+'">'+x[1]+'</button>').join('')+'</div>'+
    rlFicheHtml(RL_EX[k],{cls:'rl-ex',pose:rlSePose()})+
    '<p class="hint">Ces 3 fiches sont des exemples. L’outil sert quel que soit l’âge de votre enfant, tout-petit ou adulte depuis longtemps. Les prénoms et les numéros sont inventés.</p>'+
    '<div class="ap-suite">'+(rel().fiches.length?'<button type="button" class="btn primary wide" data-act="rl" data-k="nouveau">'+I.pen+'Préparer un relais</button>':
      '<button type="button" class="btn primary wide" data-act="rl" data-k="essai">'+I.pen+'Préparer les 3 choses à savoir pour samedi</button>')+'<p class="hint">Vous choisissez chaque phrase, et rien ne part sans vous.</p>'+(rel().fiches.length?'':'<button type="button" class="lien-f" data-act="rl" data-k="nouveau">'+I.note+'Préparer une fiche complète, en 5 moments</button>')+(SITE?'<button type="button" class="lien-f" data-act="rl" data-k="imprimer">Imprimer cet exemple</button>':'')+'</div>';
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
  const M={d:0,ok:true};const fiche=rlFicheHtml(f,{mesure:M,pose:rlSePose()});
  return '<div class="f-tete"><span class="label">Avant d’envoyer</span><h1 class="t1">Voici exactement ce que vous transmettez</h1><p class="sub">Rien d’autre ne part. Vos autres écrits restent sur votre appareil.</p></div>'+
    (n3<3?'<p class="rl-alerte">'+I.info+'<span>'+(n3?'Il vous reste '+(3-n3)+' repère'+(3-n3>1?'s':'')+' à choisir.':'Vos 3 repères ne sont pas encore choisis.')+'</span><button type="button" class="lien-f" data-act="rl" data-k="aller" data-v="2">Les choisir</button></p>':'')+
    fiche+
    (M.ok?'<p class="rl-page">'+I.check+'<span>Votre fiche tient sur une page, sur un téléphone comme sur une feuille.</span></p>':'<p class="rl-page rl-trop">'+I.info+'<span>Imprimée, votre fiche dépasse une page. Votre proche la lira plus facilement si vous retirez une phrase ou deux.</span></p>')+
    '<div class="ap-suite">'+(a?'<button type="button" class="btn primary wide" data-act="rl" data-k="envoi">'+I.send+'Envoyer la fiche</button><button type="button" class="btn wide" data-act="rl" data-k="recu">'+I.eye+'Voir ce que mon proche recevra</button><button type="button" class="btn wide" data-act="rl" data-k="imprimer">Imprimer la fiche</button>':'<button type="button" class="btn primary wide" data-act="rl" data-k="recu">'+I.eye+'Voir ce que mon proche recevra</button>')+
    '<button type="button" class="btn wide" data-act="rl" data-k="aller" data-v="0">'+I.pen+'Modifier la fiche</button>'+(f.env&&a?'<button type="button" class="btn wide" data-act="rl" data-k="retour" data-id="'+f.id+'">Noter le retour</button>':'')+'</div>'+
    (a?'':rlMoment49(false));
}
function rlMessage(f){return 'Voici la fiche pour le relais. Elle se lit en 1 minute.';}
function rlVueEnvoi(){
  const f=rlFiche(state.rl.id);if(!f||!rlOuvert())return rlVueApercu();const url=rlLien(f);
  return '<div class="f-tete"><span class="label">Envoyer</span><h1 class="t1">'+esc(f.chez?'Envoyer la fiche à '+f.chez:'Envoyer la fiche')+'</h1></div>'+
    '<ul class="list rl-sait"><li>La fiche est écrite dans le lien lui-même. Aucun serveur ne la reçoit, et le site ne la lit pas.</li><li>La personne l’ouvre sur son téléphone, sans compte et sans rien acheter.</li><li>Toute personne à qui ce lien est transmis peut lire la fiche. Envoyez-le comme vous enverriez une photo de famille.</li></ul>'+
    '<button type="button" class="lien-f" data-act="rl" data-k="recu">'+I.eye+'Voir d’abord ce que '+esc(f.chez||'mon proche')+' recevra</button>'+
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
/* Un texte du parent, phrase par phrase, sans rien changer aux mots. Une phrase finit sur un point, un point d'interrogation ou d'exclamation
   suivi d'une majuscule, d'un chiffre ou d'un guillemet ouvrant, ou bien à la ligne : « non ! » au milieu d'une phrase ne la coupe pas. */
function rlPhrases(t){
  const s=String(t==null?'':t),out=[];let cur='';
  for(let i=0;i<s.length;i++){const c=s[i];
    if(c==='\n'){out.push(cur);cur='';continue;}
    cur+=c;
    if(/[.!?…]/.test(c)){let j=i+1;while(j<s.length&&/[.!?…]/.test(s[j])){cur+=s[j];j++;}i=j-1;
      const reste=s.slice(j);if(!reste||/^\s+[A-ZÀ-ÖØ-Þ0-9«“"]/.test(reste)||/^[ \t]*\n/.test(reste)){out.push(cur);cur='';}}
  }
  out.push(cur);return out.map(x=>x.trim()).filter(Boolean);
}
function rlObsDispo(){
  const out=[],vu={};const add=(t,d)=>{t=clean(t,RL_LIM.l);if(t&&!vu[t]){vu[t]=1;out.push({t:t,d:d});}};
  /* Les mots que le parent a déposés servent aussi, s'il le veut : ses 2 derniers dépôts, phrase par phrase, en tête de liste.
     Aucune phrase n'est coupée ni réécrite : une phrase plus longue qu'une observation n'est pas proposée. */
  (D().depots||[]).filter(x=>!x.risk&&typeof x.text==='string').slice(-2).reverse().forEach(x=>{rlPhrases(x.text).filter(s=>s.length>=12&&s.length<=RL_LIM.l).slice(0,4).forEach(s=>add(s,'Vos mots du '+fmtDate(x.date)));});
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
    '<div class="ap-suite">'+(rlOuvert()?'<button type="button" class="btn wide" data-act="rl" data-k="imprimer">Imprimer ma feuille</button>':'')+'<button type="button" class="btn wide" data-act="rl" data-k="reu-modif">'+I.pen+'Modifier</button><button type="button" class="btn ghost wide" data-act="rl" data-k="accueil">Revenir à mes relais</button></div>'+
    '<p class="hint">Cette feuille reste sur votre appareil. Vous pouvez la garder ouverte pendant la réunion.</p>'+
    (rlOuvert()?'':rlMoment49(true));
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
    '<section class="rl-carte"><h2>D’où vient cette fiche ?</h2><p>Elle a été préparée avec « Passer le relais », un outil de Parent écouté, parent éclairé, un espace pour les parents d’une personne en situation de handicap.</p><button type="button" class="lien-f" data-act="rl" data-k="exemple">'+I.eye+'Voir comment une famille prépare sa fiche</button></section>';
}
/* ---------- le premier essai : « Et si vous prépariez les trois choses à savoir pour samedi ? » ---------- */
/* Un parent qui découvre l'outil n'a pas à traverser 5 écrans pour sentir ce qu'il vaut. Il choisit une occasion (une soirée, un week-end,
   une réunion), répond à 3 questions simples, une par écran, et voit sa fiche se construire sous ses yeux. Il la regarde ensuite comme son
   proche la recevra, puis retrouve son brouillon. Rien n'est envoyé pendant l'essai.
   La fiche de l'essai est une vraie fiche de l'outil (rel().fiches), gardée comme les autres : le parent la retrouve à son retour, la complète
   ou la modifie avec l'éditeur de toujours. Pour une réunion, ses 3 réponses sont les 3 priorités de sa feuille (rel().reunions).
   Le prénom est facultatif : sans lui, la fiche s'appelle « La fiche de relais ». */
const RL_OCC=[['soiree','Une soirée','Quelqu’un vient à la maison, ou votre enfant sort.'],['weekend','Un week-end','Une ou deux nuits chez un proche.'],['reunion','Une réunion','Avec l’école, le foyer ou un thérapeute.']];
const RL_OCC_POUR={soiree:'pour une soirée',weekend:'pour un week-end',reunion:'pour une réunion'};
/* Les 3 questions, puis une ligne d'aide. La troisième question d'une fiche porte le prénom quand la famille l'a donné. */
const RL_ES_Q={
  f:[['Qu’aimeriez-vous que votre proche sache en premier ?','Le plus important pour que tout se passe bien. Une phrase suffit.','Par exemple, il a besoin de savoir ce qui vient après.'],
     ['Qu’est-ce qui évite une difficulté ?','Un geste, un mot ou une habitude qui change tout.','Par exemple, prévenir avant de changer d’activité.'],
     ['Qu’est-ce qui compte pour lui ou pour elle ?','Ce qu’il ou elle aime, choisit ou décide.','Par exemple, on lui demande son avis avant de décider.']],
  r:[['Qu’aimeriez-vous que l’équipe sache en premier ?','Un fait précis, dit simplement. Une phrase suffit.','Par exemple, ce que vous observez à la maison depuis quelques semaines.'],
     ['Que voulez-vous obtenir ?','Une demande claire aide tout le monde.','Par exemple, un essai pendant 1 mois, puis un point ensemble.'],
     ['Qu’est-ce qui ne doit pas être oublié ?','Ce qui compte pour votre enfant, même si le temps manque.','Par exemple, ce qui l’aide à rester dans le groupe.']]
};
/* Des phrases à adapter, pour qui ne sait pas par où commencer. Celles d'une fiche viennent des modèles de l'outil. */
const RL_ES_IDEES={
  f:[[RL_SEC[0][3][2],RL_SEC[4][3][0],RL_SEC[0][3][1],RL_SEC[0][3][4]],
     [RL_SEC[0][3][0],RL_SEC[3][3][1],RL_SEC[1][3][1],RL_SEC[3][3][2]],
     [RL_SEC[5][3][2],['Demande-lui son avis avant de décider, même pour un détail.','Demandez-lui son avis avant de décider, même pour un détail.'],RL_SEC[4][3][3],RL_SEC[3][3][5]]],
  r:[['Ce que j’observe à la maison, c’est que','Depuis quelques semaines,','Ce qui aide {P}, c’est'],
     ['Je vous demande de','Pouvons-nous essayer pendant 1 mois de','J’aimerais que nous décidions ensemble de'],
     ['Ce qui compte pour {P}, c’est','{Pm} tient beaucoup à','J’aimerais qu’on n’oublie pas que']]
};
/* La situation inventée de chaque occasion : un exemple de l'outil (Noé pour une soirée, Bastien pour un week-end), et pour une réunion
   3 priorités écrites pour l'essai, autour de Lina, l'adolescente des exemples. Les prénoms sont inventés. */
const RL_ES_EX={soiree:'e',weekend:'g'};
const RL_ES_EX_R=['Lina a besoin d’être prévenue la veille quand le programme change.','Je demande un court message chaque vendredi, pour savoir comment s’est passée la semaine.','Son casque l’aide à rester en classe. J’aimerais qu’il soit accepté.'];
function rlEsBrouillon(){return rel().fiches.find(f=>!f.env)||null;}
function rlEsReu(){return rel().reunions.find(x=>x.ess)||null;}
/* L'essai en cours, s'il y en a un : la fiche pas encore envoyée, sinon la feuille de réunion de l'essai. Qui a déjà l'outil n'a pas d'essai en cours. */
function rlEsEnCours(){
  if(rlOuvert())return null;
  const b=rlEsBrouillon(),n=b?(b.trois||[]).filter(x=>clean(x,9)).length:0;
  if(n)return {v:b.occ==='soiree'?'soiree':'weekend',n:n,reu:false,t:rlTitre(b)+(b.chez?', pour '+b.chez:'')};
  const x=rlEsReu(),m=x?(x.pri||[]).filter(v=>clean(v,9)).length:0;
  if(m)return {v:'reunion',n:m,reu:true,t:'Votre feuille pour la réunion'};
  return null;
}
function rlEsTrois(){
  const r=state.rl;
  if(r.occ==='reunion'){const x=rlReu(r.r);return [0,1,2].map(i=>x?clean((x.pri||[])[i],RL_LIM.pri):'');}
  const f=rlFiche(r.id);return [0,1,2].map(i=>f?clean((f.trois||[])[i],RL_LIM.l):'');
}
function rlEsIdee(m,f){return rlModele(m,f||{tu:true,qui:''}).replace(/Votre enfant/g,'Mon enfant').replace(/votre enfant/g,'mon enfant');}
/* La fiche qui se construit. Le parent écrit dans la fiche elle-même : le repère en cours est un champ, à sa place parmi les 3,
   et ce qu'il a déjà écrit est là, tel que son proche le lira. Un repère pas encore écrit garde sa place, en pointillé. */
function rlEsFicheHtml(){
  const r=state.rl,reu=r.occ==='reunion',T=rlEsTrois(),p=Math.max(0,Math.min(3,r.p||0));const f=reu?null:rlFiche(r.id);
  const tu=!f||f.tu!==false;const M=f&&Array.isArray(f.moi)?f.moi.map(x=>clean(x,RL_LIM.l)).filter(Boolean):[];
  const vide=reu?['Votre première priorité viendra ici.','Votre deuxième priorité viendra ici.','Votre troisième priorité viendra ici.']:['Votre premier repère viendra ici.','Votre deuxième repère viendra ici.','Votre troisième repère viendra ici.'];
  const Q=p<3?RL_ES_Q[reu?'r':'f'][p]:null;
  const li=(x,i)=>i===p?'<li class="rl-es-ici"><textarea id="rl-es-t" rows="3" maxlength="'+(reu?RL_LIM.pri:RL_LIM.l)+'" data-rl="'+(reu?'reu.pri.':'trois.')+i+'" aria-labelledby="rl-es-q" aria-describedby="rl-es-aide" enterkeyhint="'+(i<2?'next':'done')+'" placeholder="'+esc(Q[2])+'">'+esc(x)+'</textarea></li>':
    '<li class="'+(x?'':'rl-es-vide')+'">'+esc(x||vide[i])+'</li>';
  return '<header class="rl-tete"><span class="rl-goutte" aria-hidden="true">'+LOGO+'</span><div><h2 class="rl-t">'+esc(reu?'Ma feuille pour la réunion':rlTitre(f||{}))+'</h2>'+(f&&rlSousTitre(f)?'<p class="rl-st">'+esc(rlSousTitre(f))+'</p>':'')+'</div></header>'+
    '<section class="rl-trois"><h3>'+(reu?'Mes 3 priorités':tu?'Si tu ne lis que trois choses':'Si vous ne lisez que trois choses')+'</h3><ol>'+T.map(li).join('')+'</ol></section>'+
    (M.length?'<section class="rl-moi"><h3>Ce que je souhaite dire moi-même</h3><ul>'+M.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+(f.qui?'<p class="rl-signe">'+esc(rlMaj(f.qui))+'</p>':'')+'</section>':'');
}
/* Pendant que le parent écrit un repère, la fiche n'est pas redessinée : le champ garde son curseur, et le bouton de la suite s'ouvre dès le premier mot.
   Quand les 3 repères sont prêts, la fiche suit ce qu'il ajoute en dessous (un prénom, la parole de son enfant). */
function rlEssaiVif(){
  try{
    const r=state.rl,p=r.p||0;
    if(p>=3){const a=document.getElementById('rl-es-f');if(a)a.innerHTML=rlEsFicheHtml();return;}
    const b=document.getElementById('rl-es-suite');if(b)b.setAttribute('aria-disabled',rlEsTrois()[p]?'false':'true');
  }catch(e){}
}
function rlPermetHtml(){
  return '<section class="rl-permet" aria-labelledby="rl-permet-t"><h2 id="rl-permet-t">Ce que cet essai vous permet</h2>'+
    '<ul><li>'+I.check+'<span>Écrire vos 3 repères, avec vos mots ou à partir d’une situation inventée.</span></li><li>'+I.check+'<span>Voir la fiche comme votre proche la recevra sur son téléphone.</span></li><li>'+I.check+'<span>Garder votre brouillon sur cet appareil, et le retrouver à votre retour.</span></li></ul>'+
    '<p class="rl-apres">Envoyer la fiche, l’imprimer et repartir d’elle la prochaine fois font partie de l’outil complet, à 49 CHF une seule fois.'+(venteDemo()?'':' Sa vente n’est pas encore ouverte.')+'</p></section>';
}
function rlVueEssaiDebut(){
  const c=rlEsEnCours();const mot=c&&c.reu?['priorité','écrite']:['repère','écrit'];
  return '<div class="f-tete"><span class="label">Passer le relais, un premier essai gratuit</span><h1 class="t1">Et si vous prépariez les trois choses à savoir pour samedi ?</h1>'+
    '<p class="sub">Quelqu’un va prendre le relais auprès de votre enfant, petit ou adulte depuis longtemps. Vous écrivez 3 repères, et vous voyez la fiche comme cette personne la recevra.</p></div>'+
    (c?'<section class="rl-carte rl-es-reprise"><h2>Votre brouillon vous attend</h2><p>'+esc(c.t)+', avec '+c.n+' '+mot[0]+(c.n>1?'s':'')+' déjà '+mot[1]+(c.n>1?'s':'')+'.</p><button type="button" class="btn primary" data-act="rl" data-k="essai" data-v="'+c.v+'">'+I.pen+'Reprendre mon brouillon</button></section>':'')+
    '<div class="rl-occ" role="group" aria-labelledby="rl-occ-t"><h2 id="rl-occ-t">'+(c?'Ou préparer autre chose':'Vous préparez')+'</h2>'+RL_OCC.map(o=>'<button type="button" class="rl-oc" data-act="rl" data-k="essai" data-v="'+o[0]+'"><span class="tx"><b>'+o[1]+'</b><span>'+o[2]+'</span></span><span class="chev" aria-hidden="true">'+I.chev+'</span></button>').join('')+'</div>'+
    rlPermetHtml()+
    '<p class="rl-prive">'+I.lock+'<span>Rien n’est envoyé pendant l’essai. Vos mots restent sur cet appareil.</span></p>'+
    '<button type="button" class="lien-f" data-act="rl" data-k="exemple">'+I.eye+'Voir d’abord un exemple de fiche terminée</button>';
}
function rlVueEssai(){
  const r=state.rl;if(r.es!=='ecrire')return rlVueEssaiDebut();
  const reu=r.occ==='reunion';const f=reu?null:rlFiche(r.id),x=reu?rlReu(r.r):null;if(!f&&!x)return rlVueEssaiDebut();
  const T=rlEsTrois(),p=Math.max(0,Math.min(3,r.p||0)),P=f&&f.qui?f.qui:'';const occ=reu?'reunion':(f.occ==='soiree'?'soiree':'weekend');
  const nomOcc=(RL_OCC.find(o=>o[0]===occ)||RL_OCC[1])[1];
  const fiche='<article class="rl-fiche rl-es-f" id="rl-es-f">'+rlEsFicheHtml()+'</article>';
  let c='';
  if(p<3){
    const Q=RL_ES_Q[reu?'r':'f'][p];const perso=p===2&&!reu&&P;
    c='<div class="f-tete"><span class="label">'+nomOcc+', '+(reu?'priorité':'repère')+' '+(p+1)+' sur 3</span>'+
      '<h1 class="t1" id="rl-es-q">'+esc(perso?'Qu’est-ce qui compte pour '+P+' ?':Q[0])+'</h1><p class="sub" id="rl-es-aide">'+esc(perso?'Ce que '+P+' aime, choisit ou décide.':Q[1])+'</p></div>'+
      fiche+
      (r.sec==='es'?'<div class="rl-modeles" role="group" aria-label="Phrases à adapter"><span class="label">'+(reu?'Commencer par':'Une phrase à adapter')+'</span>'+RL_ES_IDEES[reu?'r':'f'][p].map((m,i)=>'<button type="button" class="rl-m" data-act="rl" data-k="es-idee" data-i="'+i+'">'+esc(rlEsIdee(m,f))+(reu?'…':'')+'</button>').join('')+'</div>':
        '<div class="rl-es-aides"><button type="button" class="lien-f" data-act="rl" data-k="es-idees">'+I.bulb+'Je ne sais pas par où commencer</button>'+
        (p===0&&!T.filter(Boolean).length?'<button type="button" class="lien-f" data-act="rl" data-k="es-exemple">'+I.eye+'Essayer avec une situation inventée</button>':'')+'</div>')+
      '<div class="ap-suite"><button type="button" class="btn primary wide" id="rl-es-suite" data-act="rl" data-k="es-pas" data-v="1" aria-disabled="'+(T[p]?'false':'true')+'">'+(p<2?(reu?'Priorité suivante':'Repère suivant'):(reu?'Voir mes 3 priorités':'Voir mes 3 repères'))+' '+I.chev+'</button>'+
      (p>0?'<button type="button" class="btn ghost wide" data-act="rl" data-k="es-pas" data-v="-1">'+(reu?'Revenir à la priorité d’avant':'Revenir au repère d’avant')+'</button>':'<button type="button" class="btn ghost wide" data-act="rl" data-k="essai-debut">Changer d’occasion</button>')+'</div>'+
      '<p class="rl-prive">'+I.lock+'<span>Rien n’est envoyé. Vos mots restent sur cet appareil.</span></p>';
  }else{
    const ex=reu?!!x.ex:!!f.ex;const M=f&&Array.isArray(f.moi)?f.moi:[];
    c='<div class="f-tete"><span class="label">'+nomOcc+', '+(reu?'vos 3 priorités':'vos 3 repères')+'</span><h1 class="t1">'+(reu?'Vos 3 priorités sont prêtes':'Vos 3 repères sont prêts')+'</h1><p class="sub">'+(reu?'Voici ce que vous aurez sous les yeux pendant la réunion.':'Regardez maintenant la fiche comme votre proche la recevra.')+'</p></div>'+
      (ex?'<p class="rl-alerte rl-es-ex">'+I.info+'<span>C’est une situation inventée, pour essayer. Vous pouvez changer chaque phrase, ou tout effacer pour écrire avec vos mots.</span><button type="button" class="lien-f" data-act="rl" data-k="es-vider">Tout effacer</button></p>':'')+
      fiche+
      '<div class="ap-suite">'+(reu?'<button type="button" class="btn primary wide" data-act="rl" data-k="feuille-ok">'+I.eye+'Voir ma feuille</button>':'<button type="button" class="btn primary wide" data-act="rl" data-k="recu">'+I.eye+'Voir ce que mon proche recevra</button>')+
      '<button type="button" class="btn ghost wide" data-act="rl" data-k="es-pas" data-v="-3">'+I.pen+(reu?'Modifier mes priorités':'Modifier mes repères')+'</button></div>';
    if(!reu){
      /* 2 ajouts facultatifs : le prénom et le proche, puis la parole de la personne elle-même. Chacun s'ouvre d'un geste, et reste ouvert dès qu'il contient quelque chose. */
      const qOuv=r.plusQ||!!(f.qui||f.chez||f.quand),mOuv=r.plusM||M.length>0;
      c+='<section class="rl-es-plus" aria-labelledby="rl-es-pq"><h2 id="rl-es-pq">Un prénom, si vous le souhaitez</h2>'+
        (qOuv?rlChamp('rl-qui','qui','Comment l’appelez-vous dans cette fiche ?',f.qui,'Son prénom, ou « notre fils », « ma fille »',RL_LIM.nom,'')+
          rlChamp('rl-chez','chez','Qui prend le relais ?',f.chez,'Par exemple, son oncle Rémi',RL_LIM.chez,'')+
          rlChamp('rl-quand','quand','Quand ?',f.quand,occ==='soiree'?'Par exemple, samedi soir':'Par exemple, du samedi au dimanche',RL_LIM.quand,'Ces 3 lignes sont facultatives. Sans prénom, la fiche s’appelle « La fiche de relais ».')+
          '<div class="rl-tu"><span class="label" id="rl-tu-l">Dans la fiche, vous dites</span><div class="seg" role="group" aria-labelledby="rl-tu-l"><button type="button" data-act="rl" data-k="tu" data-v="1" aria-pressed="'+(f.tu!==false)+'">Tu</button><button type="button" data-act="rl" data-k="tu" data-v="0" aria-pressed="'+(f.tu===false)+'">Vous</button></div></div>':
          '<p>La fiche fonctionne sans prénom. Vous pouvez en ajouter un, et dire qui prend le relais.</p><button type="button" class="lien-f" data-act="rl" data-k="es-plus" data-v="q">'+I.plus+'Ajouter un prénom</button>')+'</section>'+
        '<section class="rl-es-plus" aria-labelledby="rl-es-pm"><h2 id="rl-es-pm">Ce que je souhaite dire moi-même</h2><p>Cette partie appartient à '+esc(P||'votre enfant')+', à tout âge. Vous pouvez l’écrire ensemble, avec ses mots, ses gestes ou ses images.</p>'+
        (mOuv?M.map((v,i)=>'<div class="rl-ligne"><textarea rows="2" maxlength="'+RL_LIM.l+'" data-rl="moi.'+i+'" aria-label="Phrase '+(i+1)+' de '+esc(P||'votre enfant')+'">'+esc(v)+'</textarea><button type="button" class="rl-ote" data-act="rl" data-k="ote-moi" data-i="'+i+'" aria-label="Retirer cette phrase">'+I.trash+'</button></div>').join('')+
          (M.length<RL_LIM.moi?'<div class="rl-modeles" role="group" aria-label="Débuts de phrase"><span class="label">Commencer par</span>'+RL_MOI.map((m,i)=>'<button type="button" class="rl-m" data-act="rl" data-k="moi" data-i="'+i+'">'+esc(m.replace(/,$/,''))+'…</button>').join('')+'</div>':''):
          '<button type="button" class="lien-f" data-act="rl" data-k="es-plus" data-v="m">'+I.plus+'Lui laisser une place</button>')+'</section>';
    }
    c+='<p class="rl-prive">'+I.lock+'<span>Votre brouillon est gardé sur cet appareil. Vous le retrouverez dans « Passer le relais ».</span></p>';
  }
  return c;
}
/* Le moment où l'outil prend son sens : le parent vient de voir sa fiche comme son proche. La phrase dit le prochain usage, la liste ne nomme que
   ce que l'outil sait réellement faire, et 2 lignes séparent ce qui reste privé de ce qui est transmis. Tant que la vente est fermée, un seul geste : être prévenu. */
function rlMoment49(reu){
  const a=rlOuvert();
  if(a)return '<p class="rl-acquis">'+I.check+'<span>Vous avez Passer le relais. Il sert à toute la famille, sans limite de fiches.</span></p>';
  return '<section class="offre rl-offre rl-49" aria-labelledby="rl-offre-t"><span class="label">Passer le relais, l’outil complet</span><h2 id="rl-offre-t">Et la prochaine fois ?</h2>'+
    '<p class="rl-49-dit">'+(reu?'Avant la prochaine réunion, vous retrouverez les phrases que vous avez déjà écrites, vous formulerez votre demande et vous arriverez avec une feuille imprimée.':'La prochaine fois que sa sœur prend le relais, vous pourrez repartir de cette fiche et adapter seulement ce qui change.')+'</p>'+
    '<ul class="rl-49-l">'+
      '<li><b>Envoyer ou imprimer.</b><span>La fiche part par un lien, ou tient sur une page imprimée.</span></li>'+
      '<li><b>Votre proche ne paie rien.</b><span>Il ouvre la fiche sur son téléphone, sans compte.</span></li>'+
      '<li><b>Autant de fiches que vous voulez.</b><span>Pour une grand-mère, un oncle, une amie ou un accueil de week-end.</span></li>'+
      '<li><b>Au retour, une seule question.</b><span>Ce qui a bien marché vous est proposé au relais suivant.</span></li>'+
      '<li><b>Préparer une réunion.</b><span>Vos observations, votre demande et vos 3 priorités sur une feuille.</span></li></ul>'+
    '<div class="f-haut rl-49-prix"><p class="f-prix"><b>49 CHF</b> <small>une seule fois</small></p><p class="rl-49-sans">Sans abonnement. L’outil sert à toute la famille.</p></div>'+
    (venteDemo()?'<button type="button" class="btn primary wide" data-act="commande" data-v="relais" data-de="essai">Choisir Passer le relais</button><p class="demo-paie">'+I.info+'<span>'+demoPaie()+'</span></p>':
      prevenirBtn('relais','primary')+'<p class="f-note">La vente n’est pas encore ouverte. Ce bouton ouvre votre messagerie avec un message prêt, que vous envoyez vous-même. Antonio garde votre adresse seulement pour vous écrire ce jour-là, et vous pouvez lui demander de l’effacer.'+(CONTACT_R?' Si rien ne s’ouvre, écrivez à '+esc(contact())+'.':'')+'</p>')+
    '<p class="f-note rl-49-gratuit">'+(reu?'Préparer vos 3 priorités et relire votre feuille est gratuit.':'Préparer votre fiche, la relire et la voir à la place de votre proche est gratuit.')+'</p>'+
    '<div class="rl-49-prive"><div><b>Ce qui reste privé</b><p>Votre brouillon, vos autres fiches, votre carnet et vos dépôts. Ils restent sur cet appareil.</p></div><div><b>Ce que vous transmettez</b><p>'+(reu?'Rien. Votre feuille est pour vous, et vous dites ce que vous choisissez de dire.':'Cette fiche, telle que vous venez de la voir, et seulement le jour où vous l’envoyez.')+'</p></div></div></section>';
}
/* La fiche vue par le proche. Le parent quitte un instant son espace : l'écran est celui que son proche ouvrira par le lien, mot pour mot,
   avec le haut de page qu'il verra. Un bandeau, tout en haut, dit au parent où il se trouve et le ramène à son brouillon (voir render).
   Sous la fiche, une ligne marque la fin de ce qui est transmis. Le moment des 49 CHF vient seulement après. */
function rlVuTete(){
  const f=rlFiche(state.rl.id);const qui=f?clean(f.chez,RL_LIM.chez):'';
  return '<div class="bar rl-vu" role="region" aria-label="Vous regardez votre fiche comme votre proche" tabindex="-1" data-foyer><p><b>Vous êtes à la place de '+esc(qui||'votre proche')+'.</b> <span>Voici ce qui s’ouvrira sur son téléphone.</span></p><button type="button" class="btn small" data-act="rl" data-k="essai-retour">'+I.back+(rlOuvert()?'Revenir à ma fiche':'Revenir à mon brouillon')+'</button></div>';
}
function rlVueRecu(){
  const f=rlFiche(state.rl.id);if(!f)return rlVueAccueil();const qui=clean(f.chez,RL_LIM.chez);
  return '<div class="rl-vu-ecran"><div class="rl-vu-bar" aria-hidden="true"><span class="wordmark">'+LOGO+'<span>Parent écouté,<small>parent éclairé</small></span></span></div>'+
    '<p class="label rl-recu-l">Une fiche de relais, écrite par une famille</p>'+rlFicheHtml(f,{cls:'rl-recu',h1:true,pose:rlSePose()})+
    '<p class="hint">Cette fiche est contenue dans le lien que vous avez reçu. Le site ne l’a ni lue ni enregistrée. Gardez ce lien pour la retrouver.</p></div>'+
    '<div class="rl-vu-apres"><p class="rl-vu-fin"><b>Ici s’arrête ce que '+esc(qui||'votre proche')+' reçoit.</b> Rien d’autre ne part. Votre proche peut aussi imprimer la fiche, qui tient sur une page.</p>'+
    (rlOuvert()?'<div class="ap-suite"><button type="button" class="btn primary wide" data-act="rl" data-k="envoi">'+I.send+'Envoyer la fiche</button><button type="button" class="btn wide" data-act="rl" data-k="essai-retour">Revenir à ma fiche</button></div>':
    rlMoment49(false)+
    '<div class="ap-suite"><button type="button" class="btn wide" data-act="rl" data-k="aller" data-v="1">'+I.pen+'Compléter ma fiche</button><p class="hint">Le quotidien, les repas, la nuit et vos numéros. C’est gratuit, et votre brouillon est gardé.</p>'+
    '<button type="button" class="btn ghost wide" data-act="rl" data-k="essai-retour">Revenir à mon brouillon</button></div>')+'</div>';
}
/* Sur l'accueil, une invitation courte et concrète, juste après les 3 aides. Qui a déjà l'outil y retrouve ses relais. */
function rlInviteHtml(){
  const c=rlEsEnCours(),a=rlOuvert();
  return '<section class="invite-rl" aria-labelledby="invite-rl-t"><h2 id="invite-rl-t">Samedi, quelqu’un prend le relais ?</h2><p>Préparez les 3 choses à savoir, et voyez la fiche comme votre proche la recevra.</p>'+
    '<button type="button" class="btn" data-act="rl" data-k="'+(a?'ouvre':'essai')+'"'+(c?' data-v="'+c.v+'"':'')+'>'+I.hand+(a?'Ouvrir Passer le relais':c?(c.reu?'Reprendre ma feuille':'Reprendre ma fiche'):'Préparer les 3 choses à savoir')+'</button></section>';
}
/* Sur « Aujourd'hui » : un brouillon de fiche attend le parent, là où il s'est arrêté. */
function rlBrouillonHtml(){
  const c=rlEsEnCours();if(!c)return '';const r=3-c.n;
  return '<div class="card rl-rappel rl-brouillon reveal d2"><span class="label">Passer le relais</span><p class="rg-t">'+esc(c.t)+'. '+(r>0?'Il vous reste '+r+' '+(c.reu?'priorité':'repère')+(r>1?'s':'')+' à écrire.':(c.reu?'Vos 3 priorités sont prêtes.':'Vos 3 repères sont prêts.'))+'</p><button type="button" class="btn primary" data-act="rl" data-k="essai" data-v="'+c.v+'">'+I.pen+(c.reu?'Reprendre ma feuille':'Reprendre ma fiche')+'</button></div>';
}
function viewRelais(){
  const e=state.rl.e||'accueil';
  /* L'aperçu ou l'exemple vient de s'ouvrir (et l'écran n'est pas seulement redessiné) : la feuille se posera. */
  {const R=state.rl,cle=e+'/'+(R.id||'');if(!/relais$/.test(state.lastKey||'')||R.vu!==cle)R.poseT=(e==='apercu'||e==='exemple'||e==='recu')?performance.now():0;R.vu=cle;}
  const c=e==='lu'?rlVueLu():e==='essai'?rlVueEssai():e==='recu'?rlVueRecu():e==='exemple'?rlVueExemple():e==='prep'?rlVuePrep():e==='apercu'?rlVueApercu():e==='envoi'?rlVueEnvoi():e==='retour'?rlVueRetour():e==='reunion'?rlVueReunion():e==='feuille'?rlVueFeuille():e==='sauver'?rlVueSauver():rlVueAccueil();
  return '<main id="main" tabindex="-1" class="view v-feuille v-relais rl-e-'+e+(e==='essai'?' rl-es-'+(state.rl.es==='ecrire'?'p'+Math.max(0,Math.min(3,state.rl.p||0)):'debut'):'')+'"><div class="feuille">'+c+'</div></main>';
}
/* La porte de l'outil, posée dans la boîte à outils et sur « Aujourd'hui » quand un retour est attendu. */
function rlPorteHtml(){
  const F=rel().fiches;const attente=rlOuvert()?F.slice().reverse().find(f=>f.env&&!f.retour):null;
  return '<button type="button" class="sit rl-porte" data-act="rl" data-k="ouvre"><span class="e">'+I.hand+'</span><span class="tx"><b>Passer le relais</b><span>'+(attente?'Le relais est passé ? Une seule question vous attend.':F.length?'Vos fiches, et le prochain relais en quelques gestes':'Une page pour la personne qui garde votre enfant')+'</span></span><span class="chev">'+I.chev+'</span></button>';
}
/* Sur la vitrine : les 3 repères d'une fiche d'exemple, pour montrer le résultat avant tout. */
/* Plus bas dans la vitrine, l'exemple est celui de Noé (5 ans) : la fiche de Bastien (35 ans) est déjà posée sur la table, tout en haut. */
function rlVitrineHtml(){
  const f=RL_EX.e;
  return '<div class="rl-mini" aria-label="Le début d’une fiche d’exemple"><span class="label">'+esc(rlTitre(f))+', '+esc(f.quand)+'</span><b>Si tu ne lis que trois choses</b><ol>'+f.trois.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></div>'+
    '<div class="acc-relais-b"><button type="button" class="btn primary" data-act="rl" data-k="essai">'+I.pen+'Préparer les 3 choses à savoir</button><button type="button" class="btn" data-act="rl" data-k="exemple" data-v="e">'+I.eye+'Voir un exemple de fiche terminée</button><span class="prix">Essai gratuit. L’outil complet, 49 CHF une seule fois.</span></div>';
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
  if(state.rl.e==='essai')rlEssaiVif();
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
    /* Le premier essai. Sans occasion, son écran de départ. Avec une occasion, la première question qui n'a pas encore de réponse. */
    case 'essai':{r.sec='';r.mots=false;r.plusQ=false;r.plusM=false;
      /* Qui a déjà l'outil n'a pas d'essai à faire : il retrouve ses relais. */
      if(rlOuvert()){r.e='accueil';versOutil();break;}
      if(!d.v){r.e='essai';r.es='occasion';r.p=0;versOutil();break;}
      if(d.v==='reunion'){let x=rlEsReu();if(!x){entrer('relais');x={id:rlId(),c:todayIso(),avec:'ecole',quand:'',obs:[],plus:'',dem:'',pri:['','',''],ess:1};R.reunions.push(x);}r.r=x.id;r.occ='reunion';}
      else{let n=rlEsBrouillon();if(!n){entrer('relais');n=rlVide();R.fiches.push(n);}n.occ=d.v==='soiree'?'soiree':'weekend';r.id=n.id;r.occ=n.occ;}
      {const c=com();if(!c.re)c.re=todayIso();}
      /* En arrivant, le parent lit d'abord la question et voit la fiche : le curseur ne se pose dans le champ que lorsqu'il le touche. */
      r.e='essai';r.es='ecrire';r.foc='';{const T=rlEsTrois();const i=T.findIndex(v=>!v);r.p=i<0?3:i;}save();versOutil();break;}
    case 'essai-debut':r.e='essai';r.es='occasion';r.p=0;r.sec='';break;
    /* Le retour depuis la fiche vue à la place du proche : là d'où le parent venait. Qui a l'outil retrouve l'envoi ou l'aperçu de sa fiche. */
    case 'essai-retour':{const de=r.de;r.de='';if(f&&de==='envoi'&&rlOuvert()){r.e='envoi';break;}if(f&&(de==='apercu'||rlOuvert())){r.e='apercu';break;}
      r.e='essai';r.es='ecrire';r.occ=f&&f.occ==='soiree'?'soiree':'weekend';r.p=3;r.sec='';break;}
    case 'es-pas':{const pas=Number(d.v)||0;const T=rlEsTrois();const p0=r.p||0;
      if(pas>0&&p0<3&&!T[p0]){fieldErr('rl-es-t','Écrivez quelques mots, ou touchez « Je ne sais pas par où commencer ».');return false;}
      r.p=Math.max(0,Math.min(3,p0+pas));r.sec='';if(r.p<3)r.foc=(r.occ==='reunion'?'reu.pri.':'trois.')+r.p;save();break;}
    case 'es-idees':r.sec=r.sec==='es'?'':'es';break;
    case 'es-idee':{const p0=Math.max(0,Math.min(2,r.p||0));const reu=r.occ==='reunion';const m=(RL_ES_IDEES[reu?'r':'f'][p0]||[])[Number(d.i)];if(!m)break;
      if(reu){const x=rlReu(r.r);if(!x)break;if(!Array.isArray(x.pri))x.pri=['','',''];x.pri[p0]=(rlEsIdee(m,null)+' ').slice(0,RL_LIM.pri);r.foc='reu.pri.'+p0;}
      else{if(!f)break;if(!Array.isArray(f.trois))f.trois=['','',''];f.trois[p0]=clean(rlEsIdee(m,f),RL_LIM.l);f.m=todayIso();r.foc='trois.'+p0;}
      r.sec='';save();break;}
    case 'es-exemple':{if(r.occ==='reunion'){const x=rlReu(r.r);if(!x)break;x.pri=RL_ES_EX_R.slice();x.ex=1;}
      else{if(!f)break;const E=RL_EX[RL_ES_EX[f.occ]||'g'];f.trois=E.trois.slice();f.qui=E.qui;f.chez=E.chez;f.tu=true;f.ex=1;f.m=todayIso();}
      r.p=3;r.sec='';save();break;}
    case 'es-vider':{if(r.occ==='reunion'){const x=rlReu(r.r);if(!x)break;x.pri=['','',''];x.ex=0;}
      else{if(!f)break;f.trois=['','',''];if(f.ex){f.qui='';f.chez='';}f.ex=0;f.m=todayIso();}
      r.p=0;r.sec='';r.foc=(r.occ==='reunion'?'reu.pri.':'trois.')+'0';save();break;}
    case 'es-plus':if(d.v==='q'){r.plusQ=true;r.foc='qui';}else{r.plusM=true;}break;
    /* La fiche vue par le proche. Il faut ses 3 repères : sinon, le parent est ramené à celui qui manque. */
    case 'recu':{if(!f)break;rlRange(f);const T=[0,1,2].map(k=>clean((f.trois||[])[k],9));const i=T.findIndex(v=>!v);
      if(r.e==='essai'&&i>=0){r.es='ecrire';r.p=i;r.foc='trois.'+i;toast('Il manque encore un de vos 3 repères.');break;}
      if(!T.some(Boolean)){toast('Écrivez au moins un repère pour voir la fiche à la place de votre proche.');return false;}
      {const c=com();if(!c.rv)c.rv=todayIso();}r.de=r.e==='apercu'?'apercu':r.e==='envoi'?'envoi':'';r.e='recu';save();versOutil();break;}
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
    case 'reu-modif':{const x=rlReu(r.r);if(x&&x.ess&&!rlOuvert()){r.e='essai';r.es='ecrire';r.occ='reunion';r.p=3;r.sec='';break;}r.e='reunion';r.p=0;r.mots=false;break;}
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
