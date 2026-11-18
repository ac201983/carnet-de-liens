
Object.assign(I,{
  drop:'<svg class="i" viewBox="0 0 24 24"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/></svg>',
  path:'<svg class="i" viewBox="0 0 24 24"><path d="M4 19c4-1 5-5 8-6s5 1 8-2"/><circle cx="4" cy="19" r="1.6" fill="currentColor"/><circle cx="20" cy="11" r="1.6" fill="currentColor"/><path d="M12 13v-3"/></svg>',
  sun2:'<svg class="i" viewBox="0 0 24 24"><path d="M4 16h16M6 16a6 6 0 0 1 12 0"/><path d="M12 4v2M5.6 7.6l1.4 1.4M18.4 7.6L17 9M2 13h2M20 13h2"/></svg>',
  chart:'<svg class="i" viewBox="0 0 24 24"><path d="M4 20V4M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/></svg>',
  image:'<svg class="i" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>',
  tag:'<svg class="i" viewBox="0 0 24 24"><path d="M3 12V4h8l9 9-8 8z"/><circle cx="7.5" cy="8.5" r="1.2" fill="currentColor"/></svg>',
  lock:'<svg class="i" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  user:'<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  mail:'<svg class="i" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  question:'<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7"/><circle cx="12" cy="17" r=".9" fill="currentColor"/></svg>',
  kit:'<svg class="i" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6a3 3 0 0 1 6 0v2M3 13h18"/></svg>',
  shield:'<svg class="i" viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9.5 12l2 2 3.5-4"/></svg>',
  ext:'<svg class="i" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5"/></svg>',
  eye:'<svg class="i" viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  pen:'<svg class="i" viewBox="0 0 24 24"><path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/></svg>',
  hand:'<svg class="i" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/><circle cx="12" cy="12" r="9.5"/></svg>',
  share:'<svg class="i" viewBox="0 0 24 24"><path d="M12 15V3"/><path d="M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>'
});
Object.keys(I).forEach(k=>{I[k]=I[k].replace('<svg class="i"','<svg class="i" aria-hidden="true" focusable="false"');});

/* ---------- formules ---------- */
const TIERS={free:{t:'Découverte',p:'0',per:'gratuit',cls:''},parcours:{t:'Le parcours',p:'14',per:'par mois',cls:'parcours'},antonio:{t:'Avec Antonio',p:'49',per:'par mois',cls:'antonio'}};
const FREE_DEPOTS=3, Q_PER_MONTH=2;
const FEATURES=[
  ['La dose du jour',true,true,true],
  ['Boîte à outils et SOS',true,true,true],
  ['Déposer avec la phrase-miroir','3 dépôts','Illimité','Illimité'],
  ['« Et concrètement ? »','3 fois','Illimité','Illimité'],
  ['Dose personnalisée',false,true,true],
  ['Les 24 étapes','Étape 1',true,true],
  ['Mon évolution','Départ',true,true],
  ['Photolangage',false,true,true],
  ['Mot mensuel d’Antonio',false,false,true],
  ['2 questions par mois',false,false,true]
];
const UP={
  depots:{t:'Déposer sans limite',s:'Vous avez utilisé vos trois dépôts Découverte. Avec Le parcours, vous déposez autant que nécessaire, avec la phrase-miroir à chaque fois.'},
  dose:{t:'Votre dose, à vous',s:'Avec Le parcours, la dose du jour est écrite d’après ce que vous avez déposé ces derniers jours.'},
  parcours:{t:'Les 24 étapes',s:'La première étape est offerte. Les vingt-trois suivantes, une par semaine pendant six mois, font partie du Parcours.'},
  evo:{t:'Voir le chemin',s:'Le point de départ est offert. Le point à trois mois et le bilan à six mois font partie du Parcours.'},
  photo:{t:'Le photolangage',s:'Choisir une image pour dire votre vécu, au départ puis au bilan, fait partie du Parcours.'},
  antonio:{t:'Avec Antonio',s:'Chaque mois, Antonio lit les dépôts que vous choisissez de lui partager et vous écrit un mot personnel. Deux fois par mois, vous pouvez aussi lui poser une question, et il vous répond par écrit dans les 48 heures.'}
};
const LETTER_EXAMPLE='J’ai lu ce que vous avez déposé ce mois-ci. Ce que j’entends d’abord, c’est la fatigue des soirs, et aussi le fait que vous êtes là, malgré tout. Vous savez, les enfants retiennent moins nos cris que le fait qu’on soit revenu vers eux.\nJ’ai aussi vu quelque chose bouger. Vous avez commencé à mettre des mots sur ce qui se passe juste avant les crises, et c’est souvent par là qu’une porte s’ouvre.\nPour le mois qui vient, je vous propose une seule piste. Au moment du coucher, dites-lui à chaque fois ce qui vient en premier et ce qui vient juste après, par exemple « d’abord le pyjama, ensuite l’histoire ». Essayez dix soirs de suite, sans chercher à ce que ce soit parfait. On en reparle dans mon prochain mot.';
const QA_EXAMPLE={q:'Mon fils de 9 ans refuse d’aller à l’école le matin, ça finit en cris. Je fais quoi ?',a:'Je commencerais par la veille plutôt que par le matin. Préparez sa tenue, fermez son sac et dites-lui au coucher, en une phrase courte, ce qui se passera demain. Le matin, parlez peu, proposez-lui un seul choix, par exemple « chaussures ou veste d’abord ? », et gardez le même ordre chaque jour. Si le refus dure plus de deux semaines, demandez un rendez-vous à son enseignant ou à son enseignante, parce qu’il se passe peut-être quelque chose à l’école que vous ne pouvez pas voir depuis la maison. Et gardez en tête que ce refus n’est pas dirigé contre vous.'};
const WEIGHTS=[['solitude','La solitude'],['fatigue','La fatigue'],['culpa','La culpabilité'],['doutes','Les doutes'],['regard','Le regard des autres'],['pros','Les professionnels'],['charge','La charge mentale'],['couple','Le couple']];
/* Tant que le serveur n'existe pas, les échanges avec Antonio sont une démonstration : rien n'est transmis. */
const DEMO=true;
const LIM={me:30,draft:4000,q:1500,line:240,phrase:140,three:120,photo:2000,evo:1500,note:2000,search:60};
const tel=(n,label)=>'<a class="tel" href="tel:'+String(n).replace(/[^0-9+]/g,'')+'">'+(label||n)+'</a>';
const HELP=[
  {t:'La Main Tendue',tel:'143',d:'Pour parler quand ça ne va pas, de jour comme de nuit.'},
  {t:'Pro Juventute, conseils aux parents',tel:'058 261 61 61',d:'Gratuit et confidentiel, 24 heures sur 24, pour toutes les questions de parents.'},
  {t:'Urgences',tel:'144',d:'En cas de danger immédiat pour la vie.'},
  {t:'Pro Infirmis',url:'https://www.proinfirmis.ch/fr/a-propos/prestations.html',label:'proinfirmis.ch',d:'Consultation sociale gratuite et confidentielle, dans votre canton.'}
];

/* ---------- état ---------- */
/* « age » et « situation » sont vides tant que le parent n'a rien choisi : rien n'est coché à sa place.
   « perso » : il a rempli (ou enregistré) « Personnaliser mon espace ». « recents » : les dernières fiches et les derniers outils ouverts. */
const PRE=typeof globalThis!=='undefined'&&typeof globalThis.__PEPE_PRERENDER__==='function';
const DEF={fxOff:false,tier:'free',me:'',age:'',situation:'',perso:false,persoTard:false,recents:[],via:'',weights:[],start:'',moods:{},depots:[],shared:{},steps:{},notes:{},seen:{},pv:0,atelier:false,tout:false,evo:{},photo:null,photos:[],abc:[],phrases:[],routineDone:{},ft:{first:null,then:null},three:[],letters:[],questions:[],onboarded:false,doseDate:'',doseText:''};
const state={photoPick:false,photoOrder:null,pdraft:null,evoDraft:null,data:null,view:'today',prev:null,lastKey:null,lastSheet:null,sit:null,q:'',theme:'all',age:'all',sheet:null,upFeat:null,toast:'',exo:null,kit:'sits',tool:'timer',timer:{total:300,left:300,running:false,h:null},ft:{pick:'first',g:null},confirmReset:false,sample:null,inClaude:false,busy:false,ctl:null,draft:'',qdraft:'',step:null,evoTime:'t1',depotMode:'listen',doseBusy:false,letter:null,souffle:{k:'pret',t0:0,raf:0,ph:'',cyc:-1,hid:0},lien:'',piste:false,confirmEssai:false};
let toastTimer=null;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&typeof d==='object')return migre(Object.assign(JSON.parse(JSON.stringify(DEF)),d));}catch(e){}return migre(JSON.parse(JSON.stringify(DEF)));}
/* Avant le 16 novembre 2026, les étapes faites étaient rangées par leur numéro. Elles le sont maintenant par leur nom.
   Un parent venu avant garde ouvertes autant d'étapes que de semaines écoulées depuis son arrivée, et celles qu'il avait faites. */
function migre(d){
  /* L'historique des photos commence avec celle qui était déjà gardée. */
  if(!Array.isArray(d.photos))d.photos=[];
  if(!d.photos.length&&d.photo&&d.photo.date){const pid=d.photo.id||(typeof d.photo.i==='number'?PHOTOS_AVANT[d.photo.i]:null);if(pid)d.photos.push({id:pid,text:d.photo.text||'',date:d.photo.date});}
  if(!(d.pv>=2)){
  const faits={},vus=(d.seen&&typeof d.seen==='object')?d.seen:{};
  const jour=(iso,n)=>{const p=String(iso).split('-').map(Number);const x=new Date(p[0],p[1]-1,p[2]+n);return x.getFullYear()+'-'+pad(x.getMonth()+1)+'-'+pad(x.getDate());};
  Object.keys(d.steps||{}).forEach(k=>{if(!d.steps[k])return;const id=/^\d+$/.test(k)?PARCOURS_AVANT[Number(k)]:k;if(id)faits[id]=true;});
  if(d.onboarded&&d.start){
    const ids=[];PARCOURS.forEach(m=>m.steps.forEach(s=>ids.push(s.id)));
    const p=String(d.start).split('-').map(Number);const sem=Math.max(0,Math.floor((Date.now()-new Date(p[0],p[1]-1,p[2]).getTime())/(7*86400000)));
    const n=d.tier&&d.tier!=='free'?Math.min(ids.length-1,sem):0;
    for(let i=0;i<=n;i++)if(!vus[ids[i]])vus[ids[i]]=jour(d.start,7*i);
    Object.keys(faits).forEach(id=>{if(!vus[id])vus[id]=d.start;});
  }
  d.steps=faits;d.seen=vus;if(!d.notes||typeof d.notes!=='object')d.notes={};d.pv=2;
  }
  /* Depuis le 18 novembre 2026, on entre dans l'espace d'un seul geste et la personnalisation est facultative.
     Un parent venu avant a déjà répondu à « Faisons connaissance » : ses réponses, ses dépôts, son carnet et sa progression restent tels quels. */
  if(d.pv<3){if(d.onboarded)d.perso=true;else{d.age='';d.situation='';}d.pv=3;}
  if(!Array.isArray(d.recents))d.recents=[];
  if(!Array.isArray(d.weights))d.weights=[];
  if(['e','a','g'].indexOf(d.age)<0)d.age='';
  if(['hand','diff','parent'].indexOf(d.situation)<0)d.situation='';
  return d;
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state.data));}catch(e){}}
function toast(m){state.toast=m;state.toastView=state.view;state.toastAt=Date.now();renderToast();clearTimeout(toastTimer);toastTimer=setTimeout(()=>{
  /* avec les effets, il s'efface en douceur avant d'être retiré */
  const el=document.querySelector('.toast');
  if(el&&fxOn()){el.style.animationDelay='0s';el.classList.add('out');toastTimer=setTimeout(()=>{state.toast='';renderToast();},420);}
  else{state.toast='';renderToast();}
},3000);}
function renderToast(){const old=document.querySelector('.toast');if(old)old.remove();if(state.toast){const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=state.toast;
  /* Si l'écran est redessiné pendant que le message est là, son apparition reprend où elle en était au lieu de rejouer. */
  if(el.style)el.style.animationDelay='-'+Math.min(2000,Math.max(0,Date.now()-(state.toastAt||0)))+'ms';
  document.getElementById('app').appendChild(el);}}
const D=()=>state.data;
const pad=n=>String(n).padStart(2,'0');
const todayIso=()=>{const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());};
const fmtDate=iso=>{const p=iso.split('-');return p[2]+'.'+p[1]+'.'+p[0];};
const MONTHS_FR=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const hm=t=>String(t||'').replace(':','h');
function deMois(iso){const m=MONTHS_FR[Number(iso.slice(5,7))-1];return (/^[aeiouyàâéèêîôû]/i.test(m)?'d’':'de ')+m;}
function liste(a){return a.length>1?a.slice(0,-1).join(', ')+' et '+a[a.length-1]:(a[0]||'');}
/* La voix d'Antonio n'emploie ni deux-points, ni point-virgule, ni tiret long : filet de sécurité pour les textes écrits par le modèle. */
function voix(t){return String(t||'').split('\n').map(l=>{l=l.replace(/^(\s*)[—–]\s+/,'$1- ').replace(/\s*[—–]\s*/g,', ').replace(/\s*;\s*(\S)/g,(m,c)=>'. '+c.toUpperCase()).replace(/\s*;\s*$/,'.').replace(/\s*:\s*(«)/g,' $1').replace(/([^\d\s])\s*:\s+(\S)/g,'$1, $2');return (/^\s*#/.test(l)?l.replace(/\s*:\s*$/,''):l.replace(/\s*:\s*$/,'.')).replace(/·[a-zàâéèêîôûç]+/gi,'').replace(/·/g,'').replace(/«[ ]/g,'«\u00a0').replace(/[ ]»/g,'\u00a0»');}).join('\n');}
/* Quand un texte laisse penser à une détresse : une aide qui reste affichée, avec des numéros cliquables (le message bref, lui, disparaît). */
function riskHtml(cls){return '<p class="'+cls+'">Si ce que vous vivez devient trop lourd, ne restez pas sans aide. Vous pouvez appeler La Main Tendue au '+tel('143')+', de jour comme de nuit, ou le '+tel('144')+' en cas d’urgence.</p>';}
function monthKey(iso){return iso.slice(0,7);}
function nextLetterDate(){const d=new Date();const n=new Date(d.getFullYear(),d.getMonth()+1,1);return '1er '+MONTHS_FR[n.getMonth()];}
function dayIdx(n){const d=new Date();return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/86400000)%n;}
function greeting(){const h=new Date().getHours();return h<5?'Il est tard':h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir';}
/* Le moment de la journée : la photo de l'étang prend la lumière de l'heure qu'il est (matin, jour, soir, nuit). */
function moment(){if(PRE)return 'jour';const h=new Date().getHours();return (h<5||h>=22)?'nuit':h<11?'matin':h<18?'jour':'soir';}
/* La page du carnet grandit avec le texte : on voit toujours tout ce qu'on a écrit, et les lignes restent sous les mots. */
function carnetHaut(t){
  t=t||document.getElementById('note');if(!t||!t.style||!t.closest||!t.closest('.etape'))return;
  t.style.height='auto';const h=t.scrollHeight;if(h>0)t.style.height=Math.max(194,Math.ceil((h-2)/32)*32+2)+'px';
}
function weekNo(){const s=D().start||todayIso();const p=s.split('-').map(Number);const d0=new Date(p[0],p[1]-1,p[2]);return Math.max(0,Math.floor((Date.now()-d0.getTime())/(7*86400000)));}
function allSteps(){const out=[];PARCOURS.forEach((m,mi)=>m.steps.forEach((s,si)=>out.push(Object.assign({mi,si,idx:out.length},s))));return out;}
/* L'étape du moment : la dernière qui est ouverte. Dans l'aperçu d'Antonio, où tout est ouvert, la première qui n'est pas faite. */
function currentStepIdx(){const S=allSteps();if(D().tout){const f=S.findIndex(s=>!D().steps[s.id]);return f<0?S.length-1:f;}let c=0;for(let i=1;i<S.length;i++){if(stepEtat(i).k==='open')c=i;else break;}return c;}
function doneCount(){return allSteps().filter(s=>D().steps[s.id]).length;}
/* Le parcours est commencé dès qu'une étape a été ouverte ou cochée sur cet appareil. */
function parcoursCommence(){const d=D();return allSteps().some(s=>d.seen[s.id]||d.steps[s.id]);}
/* Nombre de jours du calendrier entre une date et aujourd'hui. */
function joursDepuis(iso){const p=String(iso).split('-').map(Number);const n=new Date();return Math.round((new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime()-new Date(p[0],p[1]-1,p[2]).getTime())/86400000);}
/* Où en est une étape : ouverte, bientôt (dans n jours), plus tard, ou réservée à la formule Le parcours.
   Une étape s'ouvre sept jours après l'ouverture de la précédente. Une étape déjà ouverte le reste. Rien ne s'accumule en cas d'absence. */
function stepEtat(i){
  const S=allSteps(),s=S[i];if(!s)return {k:'tard'};
  if(D().tout)return {k:'open'};
  if(i>0&&!can('parcours'))return {k:'formule'};
  if(i===0||D().seen[s.id])return {k:'open'};
  const d0=D().seen[S[i-1].id];if(!d0)return {k:'tard'};
  const n=PAS_JOURS-joursDepuis(d0);
  return n<=0?{k:'open'}:{k:'bientot',n:n};
}
function stepLocked(i){return stepEtat(i).k!=='open';}
const dansJours=n=>n<=1?'demain':'dans '+n+' jours';
function noteDe(id){const n=D().notes[id];return n&&n.t&&String(n.t).trim()?n:null;}
function nbNotes(){return allSteps().filter(s=>noteDe(s.id)).length;}
function curatedDose(){const n=DOSES.length-1;return new Date().getDay()===0?DOSES[n]:DOSES[dayIdx(n)];}
function doseText(){const d=D();return d.doseDate===todayIso()&&d.doseText?d.doseText:curatedDose();}
function lastDepot(){const l=D().depots;return l.length?l[l.length-1]:null;}
function recentDepot(){const ld=lastDepot();return ld&&(Date.now()-new Date(ld.date).getTime())<4*86400000?ld:null;}
/* ---------- formules : droits ---------- */
const tier=()=>D().tier||'free';
function can(f){const t=tier();if(f==='parcours')return t!=='free';if(f==='antonio')return t==='antonio';return true;}
function depotsLeft(){return can('parcours')?Infinity:Math.max(0,FREE_DEPOTS-D().depots.length);}
function questionsLeft(){const mk=monthKey(todayIso());return Math.max(0,Q_PER_MONTH-D().questions.filter(q=>monthKey(q.date)===mk).length);}
function sharedThisMonth(){const mk=monthKey(todayIso());return D().depots.filter(x=>D().shared[x.id]&&monthKey(x.date)===mk).length;}
function openUpgrade(f){state.upFeat=f;state.sheet='upgrade';}
function badge(){const t=TIERS[tier()];return '<span class="tierbadge '+t.cls+'">'+(tier()==='free'?I.star:tier()==='parcours'?I.path:I.user)+esc(t.t)+'</span>';}
function lockline(txt,f){return '<button type="button" class="lockline" data-act="upgrade" data-f="'+f+'">'+I.lock+'<span>'+esc(txt)+'</span></button>';}

/* ---------- effets visuels : l'eau calme ---------- */
/* Tout est lent et doux, et rien n'est dessiné par-dessus la photo.
   Les écrans se fondent l'un dans l'autre, les blocs viennent se poser sans à-coup, la lumière se lève une fois sur la photo,
   et l'eau de la photo bouge pour de bon, à l'arrivée et sous le doigt. Le texte n'est jamais estompé.
   Rien ne joue si le téléphone demande moins d'animations ou si le parent coupe les effets dans « Moi ». */
const FX_OK=!!(typeof window!=='undefined'&&window.requestAnimationFrame&&document.documentElement&&document.body);
const FX_RM=FX_OK&&window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
/* Grand écran (ordinateur, tablette couchée) : le menu passe dans une colonne à gauche. La page est alors écrite dans l'ordre où on la voit,
   la colonne d'abord (nom de l'espace, onglets, SOS), puis le contenu. Sur téléphone, l'ordre reste barre du haut, contenu, onglets. */
const MQ_LARGE=FX_OK&&window.matchMedia?window.matchMedia('(min-width:1024px)'):null;
const large=()=>!!(MQ_LARGE&&MQ_LARGE.matches);
/* Les blocs qui se posent suivent le défilement quand le navigateur sait le faire sans risque ; sinon ils se posent une fois, à leur arrivée. */
const FX_SD=!!(FX_OK&&window.CSS&&CSS.supports&&CSS.supports('animation-timeline','view(block 0px 86px)')&&CSS.supports('animation-range','entry 0% entry min(100%, 260px)'));
const FX_SEL='main.fiche>.couv,main.fiche>.grp,.sits.groupes>.grp,main.etape>.couv,main.etape>.chap,main.etape>.mission,.final>.fin-couv,.final>.fin-bloc>*,.intro .acc-h,.intro .acc-c>*:not(.acc-perms),.intro .acc-perms>li,.intro>.voice,.intro>.acc-fin,.duo-a>*,.duo-b>*,main.view:not(.sosview)>.card,main.view:not(.sosview)>.dose,main.view>.comfort,main.view>.exo,main.view>.mirror,main.view>.qa,main.view>.letter,main.view>.demo-note,main.view>.step,main.view:not(.sosview)>.hint,.months .month>h2,.months .step,.ex>.sit,.depots>.mirror,.plans>.plan,.log>.logi,.perm>div,main.view>.menu-list,.story>p,.story>h2,.story .places>li,.story>.sign,.pillars>.pillar,.voice,.cta-stack';
let fxIO=null,fxSeq=0,fxSkip=0,fxVT=null;
function fxOn(){return FX_OK&&!(FX_RM&&FX_RM.matches)&&!(state.data&&state.data.fxOff);}
function fxSync(){if(!FX_OK)return;const c=document.documentElement.classList;const on=fxOn();c.toggle('fx',on);c.toggle('fxsd',on&&FX_SD);if(!on)eauStop();}
/* Changer d'écran : une onde de lumière part de l'endroit touché et traverse l'écran. Le nouvel écran apparaît dans son sillage,
   et l'ancien s'enfonce doucement dans l'ombre devant elle. Quand l'onde atteint la photo, la goutte saute (voir eauArrive).
   « fade » : un simple fondu, pour une feuille qui se referme. Le SOS s'affiche tout de suite, sans effet.
   Sans l'API du navigateur (View Transitions), le nouvel écran apparaît simplement en douceur. */
const fxPt={x:0,y:0,t:0,id:null,vt:false,synth:0,el:null};
const FX_TOUCHE='button,a[href],input,textarea,select,label,summary,[data-act]';
function fxTap(e){
  fxPt.x=e.clientX;fxPt.y=e.clientY;fxPt.t=Date.now();fxPt.id=e.pointerId;
  /* Pendant qu'un écran en remplace un autre, le navigateur ne dit plus ce qu'il y a sous le doigt : il répond « la page entière ».
     On s'en souvient, pour retrouver le bon bouton au moment où le doigt se lève (voir fxLeve). */
  const t=e.target;fxPt.vt=!!fxVT&&!(e.button>0)&&(!t||t===document||t===document.documentElement||t===document.body);
}
/* Le doigt se lève alors qu'une onde traverse encore l'écran : l'application doit répondre quand même.
   S'il y a un bouton à cet endroit, l'onde s'arrête là, l'écran est entier tout de suite, et le toucher est transmis au bouton.
   S'il n'y a rien à toucher, l'onde continue. Sur la photo, l'eau répond comme d'habitude. */
function fxLeve(e){
  if(!fxPt.vt||e.pointerId!==fxPt.id)return;fxPt.vt=false;
  const x=e.clientX,y=e.clientY;
  if(Date.now()-fxPt.t>700||Math.hypot(x-fxPt.x,y-fxPt.y)>12)return;   /* un appui long ou un glissement : ce n'est pas un toucher */
  const dedans=n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;};
  if(![].some.call(document.querySelectorAll(FX_TOUCHE),dedans)){
    const ph=[].find.call(document.querySelectorAll(EAU_ICI),dedans);if(ph)eauTouch({clientX:x,clientY:y,button:0,target:ph});
    return;
  }
  try{if(fxVT&&fxVT.skipTransition)fxVT.skipTransition();}catch(err){}
  let el=document.elementFromPoint(x,y);el=el&&el.closest?el.closest(FX_TOUCHE):null;
  if(!el||el.disabled)return;
  fxPt.synth=Date.now();fxPt.el=el;
  if(el.matches('input,textarea,select')&&el.focus)el.focus();
  el.click();
}
/* Un toucher déjà transmis à la main pendant une onde ne doit pas compter deux fois, si le navigateur finit par l'envoyer lui aussi au même bouton. */
function fxDouble(e){if(e.isTrusted&&fxPt.el&&Date.now()-fxPt.synth<350&&e.target&&(e.target===fxPt.el||fxPt.el.contains(e.target))){e.stopPropagation();e.preventDefault();}}
function fxAnneau(){let o=document.getElementById('onde');if(!o){o=document.createElement('div');o.id='onde';o.setAttribute('aria-hidden','true');o.appendChild(document.createElement('i'));document.body.appendChild(o);}return o;}
function fxGo(update,kind,vtOnly){
  /* Pas d'effet non plus quand le téléphone anime déjà lui-même le retour en arrière (geste de balayage). */
  if(!fxOn()||state.view==='sos'||Date.now()-fxSkip<500){update();return;}
  const de=document.documentElement;const id=++fxSeq;
  if(typeof document.startViewTransition!=='function'){if(vtOnly){update();return;}de.classList.add('fx-nav');update();setTimeout(()=>{if(id===fxSeq)de.classList.remove('fx-nav');},620);return;}
  let done=false;
  if(kind==='fade'){
    de.classList.remove('fx-onde','fx-ring');de.style.setProperty('--fx-dur','.5s');
    const run=()=>{if(done)return;done=true;update();};
    try{const vt=document.startViewTransition(run);fxVT=vt||null;const fin=()=>{if(fxVT===vt)fxVT=null;};if(vt){if(vt.ready)vt.ready.catch(()=>{});if(vt.finished)vt.finished.then(fin,fin);else fin();}}catch(e){fxVT=null;run();}
    return;
  }
  const w=window.innerWidth,h=window.innerHeight;const fresh=Date.now()-fxPt.t<1500;
  const x=fresh?fxPt.x:w/2,y=fresh?fxPt.y:h-40;
  /* le rayon qu'il faut pour que l'ovale de l'onde (un peu plus large que haut) recouvre tout l'écran */
  const R=Math.ceil(Math.max(Math.hypot(x/1.25,y),Math.hypot((w-x)/1.25,y),Math.hypot(x/1.25,h-y),Math.hypot((w-x)/1.25,h-y))*1.34)+30;
  const dur=kind==='tab'?1.3:1.2;
  de.style.setProperty('--fx-x',Math.round(x)+'px');de.style.setProperty('--fx-y',Math.round(y)+'px');de.style.setProperty('--fx-r',R+'px');de.style.setProperty('--fx-s',(R/120).toFixed(3));de.style.setProperty('--fx-dur',dur+'s');
  state.onde={t:Date.now(),dur:dur,x:x,y:y,r:R};
  /* Si une onde précédente court encore (deux onglets touchés coup sur coup), son anneau est retiré d'abord : celui de la nouvelle onde repart de zéro. */
  de.classList.remove('fx-ring');fxAnneau();de.classList.add('fx-onde');
  /* Le dessin de l'anneau n'arrive qu'avec le nouvel écran : on ne le voit donc jamais posé tel quel, seulement grandir avec l'onde. */
  const run=()=>{if(done)return;done=true;update();de.classList.add('fx-ring');};
  let vt=null;
  const end=()=>{if(fxVT===vt)fxVT=null;if(id===fxSeq)de.classList.remove('fx-onde','fx-ring');};
  try{vt=document.startViewTransition(run);fxVT=vt||null;if(vt&&vt.finished)vt.finished.then(end,end);else end();if(vt&&vt.ready)vt.ready.catch(()=>{});}catch(e){run();end();}
}
/* Après chaque rendu : les blocs déjà à l'écran remontent à la surface l'un après l'autre (classe fxe), et ceux qui sont plus bas
   viendront se poser en arrivant à l'écran (classe fxr). Si l'écran est redessiné pendant l'arrivée, elle reprend où elle en était. */
function fxMark(){
  if(!fxOn()||!document.querySelectorAll)return;const vh=window.innerHeight;
  if(!FX_SD&&!fxIO&&'IntersectionObserver' in window)fxIO=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('fxs');fxIO.unobserve(e.target);}});},{rootMargin:'0px 0px -20px 0px'});
  const age=state.enterAt?Date.now()-state.enterAt:1e9;let k=0;
  const onde=!!(state.onde&&Date.now()-state.onde.t<1800);   /* l'onde dévoile l'écran entier : les blocs n'ont pas à arriver un par un */
  document.querySelectorAll(FX_SEL).forEach(el=>{
    const below=el.getBoundingClientRect().top>vh-100;
    /* À la toute première ouverture du site, l'accueil est déjà écrit dans la page et joue sa propre arrivée : on n'y touche pas. */
    if(el.classList.contains('reveal')){if(!below&&!state.enterAt)return;el.classList.remove('reveal','d1','d2','d3','d4');}
    if(!below){
      if(!onde&&age<1800&&!(el.parentElement&&el.parentElement.closest&&el.parentElement.closest('.reveal,.fxe'))){el.classList.add('fxe');if(el.style)el.style.animationDelay=(Math.min(k,6)*85-age)+'ms';k++;}
      return;
    }
    el.classList.add('fxr');
    if(!FX_SD&&fxIO){el.classList.add('fxw');fxIO.observe(el);}
  });
}
/* Déposer : le texte se dissout doucement dans l'eau avant que la réponse remonte. */
function fxSink(){
  const el=document.getElementById('draft');if(!fxOn()||!el)return Promise.resolve();
  return new Promise(res=>{el.classList.add('sink');setTimeout(res,720);});
}
/* ---------- l'eau de la photo : de vraies ondes, calculées dans l'image ---------- */
/* La photo est redessinée par la carte graphique du téléphone, et chaque onde déplace vraiment les reflets de l'étang,
   en suivant sa perspective (les cercles s'aplatissent au loin). Rien n'est dessiné par-dessus la photo.
   Là où l'eau est calme, ce calque est transparent, et il s'enlève tout seul quand la dernière onde s'est éteinte.
   Sans carte graphique utilisable, la photo reste simplement immobile. */
const EAU={ok:null,cv:null,gl:null,u:null,tex:false,host:null,geo:null,rips:[],wait:[],raf:0,t0:0,fix:null,n:0,last:0,slow:0,weak:0,seq:0,lost:0,drop:null};
const EAU_LIFE=3.2;
const EAU_TC=1.2;   /* le moment où la goutte touche la pointe de la colonne, en secondes depuis le début de son rebond */
const EAU_ICI='.herofull,.band';   /* toutes les photos : l'accueil, les quatre onglets et « Mon histoire » */
const EAU_VS='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
/* Les réglages de l'onde, à un seul endroit. Les longueurs sont en points de la photo, à la profondeur de la goutte. */
const EAU_P={c:120,lam:130,front:26,tail:170,tau:4.5,ax:13,ay:16,sh:.8,gl:.35,li:.6,pw:2};
const EAU_FS=[
'precision highp float;',
'uniform sampler2D uTex;uniform vec2 uRes;uniform vec4 uMap;uniform float uT;uniform float uA;uniform vec4 uD;uniform vec4 uS;uniform vec4 uR[8];',
'void main(){',
' vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);',
' vec2 q=uMap.xy+p*uMap.zw;',                                  /* le point de la photo (866 x 470) */
' float s=(q.y+26.)/285.;',                                    /* la perspective : 1 à la profondeur de la goutte, plus petit au loin */
' vec2 w=vec2((q.x-434.)/s,1500./s);',                         /* le même point, posé à plat sur l'étang */
' vec2 g=vec2(0.);float h=0.;float li=0.;',
' for(int i=0;i<8;i++){',
'  vec4 r=uR[i];float age=uT-r.z;',
'  vec2 dv=w-r.xy;float d=length(dv)+.0001;',
'  float x=@c@*max(age,0.)-d;',                                /* distance derrière le front de l onde, qui avance lentement */
'  float e=x<0.?exp(-x*x/(@front@*@front@)):exp(-x/@tail@);',  /* un front doux, puis des rides de plus en plus faibles derrière lui */
'  e*=r.w*step(0.,age)*smoothstep(0.,.7,age)*exp(-age/@tau@)*(1.-smoothstep(2.,3.2,age))*smoothstep(8.,60.,d)/sqrt(1.+d/400.);',
'  float c=e*cos(x*6.2832/@lam@);',
'  float cr=cos(x*6.2832/@lam@);',
'  g+=dv/d*c;h+=c;li+=e*pow(max(cr,0.),@pw@)*(.55+.45*abs(dv.y)/d);',
' }',
' float m=smoothstep(104.,150.,q.y)*mix(smoothstep(150.,250.,q.x),1.,smoothstep(140.,178.,q.y));',   /* seulement sur l eau : ni la rive, ni la fougère */
' vec2 pa=q-vec2(434.,160.);float hh=clamp(pa.y/90.,0.,1.);',
' m*=smoothstep(14.,30.,length(pa-vec2(0.,90.)*hh));',                                              /* ni la goutte et sa colonne, qui sont devant l eau */
' vec2 o=vec2(g.x*@ax@*s,-g.y*@ay@*s*s)*m*uA;',
' float tilt=(h*.45-g.y*.55)*m*uA;',                                                                   /* la pente de la vague, vue d ici */
' vec3 col=texture2D(uTex,(q+o)/vec2(866.,470.)).rgb;',
' col*=1.+tilt*@sh@;',
' float sx=(q.x-480.)/130.;float sun=exp(-sx*sx);',                                                       /* la lumière vient d en haut, un peu à droite de la goutte */
' float lum=dot(col,vec3(.3,.6,.1));',
' col+=vec3(.9,1.,.84)*li*m*uA*(@li@*(.35+lum)+@gl@*sun);',                                          /* une crête fine qui accroche la lumière, plus vive sous le soleil */
' float a=clamp(length(o)*.8+abs(tilt)*2.5+li*m*uA*3.,0.,1.);',
/* la goutte suspendue : uD = (descente en points de la photo, étirement en largeur, étirement en hauteur, présence de l effet) */
' vec2 I=vec2(866.,470.);vec2 c0=vec2(434.8,167.5);vec2 ax=vec2(15.8,16.8);vec2 dq=q-c0;',
' float hole=0.;float dr=0.;float ec=0.;float sp=0.;',
' if(uD.w>.001&&abs(dq.x)<50.&&dq.y>-66.&&dq.y<50.){',                                              /* tout ceci ne se calcule qu autour de la goutte, et seulement pendant son rebond */
'  hole=(1.-smoothstep(.72,1.,length(dq/(ax+vec2(9.,dq.y>0.?4.6:9.)))))*uD.w;',                     /* là où elle était : on rebouche le fond */
'  vec2 lo=c0-ax-12.;vec2 hi=c0+ax+vec2(12.,5.);vec2 uv=clamp((q-lo)/(hi-lo),0.,1.);',              /* il se prolonge depuis les quatre côtés du cadre qui entoure la goutte */
'  vec3 fx=mix(texture2D(uTex,vec2(lo.x,q.y)/I).rgb,texture2D(uTex,vec2(hi.x,q.y)/I).rgb,uv.x);',
'  vec3 fy=mix(texture2D(uTex,vec2(q.x,lo.y)/I).rgb,texture2D(uTex,vec2(q.x,hi.y)/I).rgb,uv.y);',
'  vec3 fc=mix(mix(texture2D(uTex,lo/I).rgb,texture2D(uTex,vec2(hi.x,lo.y)/I).rgb,uv.x),mix(texture2D(uTex,vec2(lo.x,hi.y)/I).rgb,texture2D(uTex,hi/I).rgb,uv.x),uv.y);',
'  col=mix(col,fx+fy-fc,hole);',
'  vec2 u=(dq-vec2(0.,uD.x))/uD.yz;',
'  dr=(1.-smoothstep(.93,1.06,length(u/ax)))*uD.w;',                                                /* là où elle est maintenant : la goutte de la photo, telle quelle */
'  col=mix(col,texture2D(uTex,(c0+u)/I).rgb,dr);',
' }',
/* au contact : uS = (secondes depuis le contact, force de l éclat, rayon de l éclat, présence des gouttelettes) */
' vec2 tip=vec2(434.8,201.);vec2 dt=q-tip;',
' if((uS.y>.001||uS.w>.001)&&dot(dt,dt)<8100.){',
'  ec=uS.y*exp(-dot(dt,dt)/(uS.z*uS.z));',
'  float tc=max(uS.x,0.);',
'  for(int i=0;i<5;i++){float fi=float(i);float an=(fi-2.)*.42;float v=64.+fi*7.;vec2 pp=tip+vec2(sin(an)*v*tc*.9,-cos(an)*v*tc+85.*tc*tc);float rr=(1.5+.3*fi)*uA;vec2 e2=q-pp;sp+=exp(-dot(e2,e2)/(rr*rr));}',
'  sp*=uS.w;',
'  col+=vec3(1.,.98,.86)*(ec+sp*.85);',
' }',
' a=max(a,clamp(max(hole,dr)+ec*2.5+sp*2.,0.,1.));',
' gl_FragColor=vec4(col*a,a);',
'}'].join('\n').replace(/@(\w+)@/g,(m,k)=>(+EAU_P[k]).toFixed(4));
function eauNow(){return EAU.fix!=null?EAU.fix:(performance.now()-EAU.t0)/1000;}
function eauInit(){
  if(EAU.ok!==null)return EAU.ok;
  EAU.ok=false;
  try{
    const cv=document.createElement('canvas');cv.className='eau';cv.setAttribute('aria-hidden','true');
    /* failIfMajorPerformanceCaveat : pas de calque si la carte graphique est émulée par le processeur, car l'eau serait saccadée. (__eauSansGarde : seulement pour les tests.) */
    const gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:'low-power',failIfMajorPerformanceCaveat:!window.__eauSansGarde});
    if(!gl)return false;
    const hp=gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT);if(!hp||!hp.precision)return false;
    /* Certains navigateurs émulent la carte graphique sans le dire : on le lit dans son nom, et là non plus on ne dessine pas l'eau. */
    try{const di=gl.getExtension('WEBGL_debug_renderer_info');const nom=di?String(gl.getParameter(di.UNMASKED_RENDERER_WEBGL)):'';if(!window.__eauSansGarde&&/swiftshader|llvmpipe|software|basic render/i.test(nom))return false;}catch(e){}
    const sh=(t,src)=>{const o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error('eau');return o;};
    const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,EAU_VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,EAU_FS));gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return false;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const a=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    EAU.u={res:gl.getUniformLocation(pr,'uRes'),map:gl.getUniformLocation(pr,'uMap'),t:gl.getUniformLocation(pr,'uT'),a:gl.getUniformLocation(pr,'uA'),d:gl.getUniformLocation(pr,'uD'),s:gl.getUniformLocation(pr,'uS'),r:gl.getUniformLocation(pr,'uR')};
    gl.uniform1i(gl.getUniformLocation(pr,'uTex'),0);gl.clearColor(0,0,0,0);
    cv.addEventListener('webglcontextlost',e=>{e.preventDefault();if(EAU.cv!==cv)return;eauStop();EAU.cv=null;EAU.gl=null;EAU.tex=false;EAU.ok=(++EAU.lost<4)?null:false;});
    const im=new Image();im.decoding='async';
    im.onload=()=>{
      if(EAU.gl!==gl)return;
      try{
        gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
        EAU.tex=true;const q=EAU.wait;EAU.wait=[];q.forEach(f=>{try{f();}catch(e){}});
      }catch(e){EAU.ok=false;}
    };
    im.src=HERO;
    EAU.cv=cv;EAU.gl=gl;EAU.ok=true;
  }catch(e){EAU.ok=false;}
  return EAU.ok;
}
/* Où la photo est-elle affichée, et quel morceau en voit-on ? (elle remplit sa boîte en étant rognée, comme « cover ») */
function eauGeo(host){
  const hero=host.classList.contains('herofull');const box=hero?host.querySelector('.herobg'):host;if(!box)return null;
  const r=box.getBoundingClientRect();if(r.width<40||r.height<40)return null;
  let px=.5,py=.5;
  try{const cs=getComputedStyle(box);const m=String(hero?cs.objectPosition:cs.backgroundPosition).match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);if(m){px=m[1]/100;py=m[2]/100;}}catch(e){}
  const k=Math.max(r.width/866,r.height/470);
  return {el:box,w:r.width,h:r.height,k:k,ox:-(r.width-866*k)*px/k,oy:-(r.height-470*k)*py/k};
}
function eauHost(host){
  if(!EAU.ok||!host)return false;
  if(EAU.host!==host||EAU.cv.parentNode!==host){
    if(host.classList.contains('herofull')){const im=host.querySelector('.herobg');if(!im)return false;host.insertBefore(EAU.cv,im.nextSibling);}
    else host.insertBefore(EAU.cv,host.firstChild);
    EAU.host=host;EAU.geo=null;
  }
  if(!EAU.geo)EAU.geo=eauGeo(host);
  return !!EAU.geo;
}
function eauStop(){
  if(EAU.raf){cancelAnimationFrame(EAU.raf);EAU.raf=0;}
  EAU.rips=[];EAU.wait=[];EAU.n=0;EAU.slow=0;EAU.host=null;EAU.geo=null;EAU.drop=null;
  if(EAU.cv){try{EAU.gl.clear(EAU.gl.COLOR_BUFFER_BIT);}catch(e){}if(EAU.cv.parentNode)EAU.cv.parentNode.removeChild(EAU.cv);}
}
/* Une onde naît à cet endroit de la photo. */
function eauAdd(ix,iy,force,delay){
  if(!EAU.rips.length&&!EAU.raf)EAU.t0=performance.now();
  const s=(iy+26)/285;
  EAU.rips.push({x:(ix-434)/s,z:1500/s,t:eauNow()+(delay||0),s:force});
  if(EAU.rips.length>8)EAU.rips.shift();
  if(!EAU.raf&&EAU.fix==null)EAU.raf=requestAnimationFrame(eauFrame);
}
/* Le rebond de la goutte, en ralenti : elle monte encore un peu, retombe sur la pointe de la colonne, s'y écrase à peine, puis rebondit et revient à sa place.
   Rend ce qu'il faut au dessin : sa descente, ses étirements, et l'éclat et les gouttelettes du contact. */
function eauGoutte(t){
  const seg=(a,b)=>Math.min(1,Math.max(0,(t-a)/(b-a))),eo=p=>1-(1-p)*(1-p),eio=p=>p<.5?2*p*p:1-2*(1-p)*(1-p);
  const T=EAU_TC;let dy=0,sx=1,sy=1;
  if(t<.12){}
  else if(t<.62)dy=-22*eo(seg(.12,.62));
  else if(t<T){const p=seg(.62,T);dy=-22+40*p*p;sy=1+.07*p;sx=1-.045*p;}
  else if(t<T+.3){const p=seg(T,T+.3),k=Math.sin(Math.PI*p);sy=1+.07*(1-p)*(1-k)-.16*k;sx=1-.045*(1-p)*(1-k)+.1*k;dy=18+(1-sy)*16.8;}
  else if(t<T+.95)dy=18-23*eo(seg(T+.3,T+.95));
  else dy=-5*(1-eio(seg(T+.95,T+1.75)));
  const tc=t-T;const pres=Math.min(1,t/.08)*(1-seg(T+1.67,T+1.75));
  const eclat=tc<0?0:(tc<.09?tc/.09:Math.exp(-(tc-.09)/.3))*.5;
  const gouttes=tc<0?0:Math.min(1,tc/.05)*(1-Math.min(1,Math.max(0,(tc-.55)/.4)));
  return {d:[dy,sx,sy,pres],s:[tc,eclat,12,gouttes]};
}
const EAU_GFIN=EAU_TC+1.75;
/* La goutte rebondit, et l'onde part au moment où elle touche l'eau. */
function eauBond(){
  if(EAU.drop!=null)return;
  eauAdd(434,259,1,EAU_TC);eauAdd(434,259,.55,EAU_TC+.3);
  EAU.drop=eauNow();
}
function eauFrame(){
  EAU.raf=0;const gl=EAU.gl,cv=EAU.cv;
  if(!EAU.ok||!EAU.tex||!EAU.host||!cv.isConnected||!fxOn()){eauStop();return;}
  const now=eauNow();
  EAU.rips=EAU.rips.filter(r=>now-r.t<EAU_LIFE);
  if(EAU.drop!=null&&now-EAU.drop>=EAU_GFIN)EAU.drop=null;
  if(!EAU.rips.length&&EAU.drop==null){eauStop();return;}
  if(!EAU.geo||EAU.n%30===29)EAU.geo=eauGeo(EAU.host);
  const g=EAU.geo;if(!g){eauStop();return;}
  /* Un téléphone qui peine vraiment (quatre images de suite trop lentes) : on arrête cette onde. La deuxième fois, la photo reste immobile pour toute la visite. */
  const ms=performance.now();
  if(EAU.fix==null&&!window.__eauSansGarde&&EAU.n>1){EAU.slow=ms-EAU.last>60?EAU.slow+1:0;if(EAU.slow>3){if(++EAU.weak>1)EAU.ok=false;eauStop();return;}}
  EAU.last=ms;EAU.n++;
  /* Sur un grand écran la photo est grande : on plafonne le nombre de points dessinés, pour que l'eau reste fluide même sur un ordinateur modeste. */
  const dpr=Math.min(window.devicePixelRatio||1,2,Math.max(1,Math.sqrt(1.8e6/(g.w*g.h))));
  const W=Math.max(2,Math.round(g.w*dpr)),H=Math.max(2,Math.round(g.h*dpr));
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  gl.viewport(0,0,W,H);
  gl.uniform2f(EAU.u.res,W,H);gl.uniform4f(EAU.u.map,g.ox,g.oy,g.w/(W*g.k),g.h/(H*g.k));gl.uniform1f(EAU.u.t,now);
  gl.uniform1f(EAU.u.a,Math.max(1,Math.min(1.7,.8/g.k)));
  const G=EAU.drop!=null?eauGoutte(now-EAU.drop):{d:[0,1,1,0],s:[-1,0,12,0]};
  gl.uniform4f(EAU.u.d,G.d[0],G.d[1],G.d[2],G.d[3]);gl.uniform4f(EAU.u.s,G.s[0],G.s[1],G.s[2],G.s[3]);   /* photo affichée en petit (le bandeau) : l'onde est un peu plus marquée, pour rester visible */
  const a=EAU.buf||(EAU.buf=new Float32Array(32));a.fill(0);EAU.rips.forEach((r,i)=>{a[i*4]=r.x;a[i*4+1]=r.z;a[i*4+2]=r.t;a[i*4+3]=r.s;});
  gl.uniform4fv(EAU.u.r,a);
  gl.drawArrays(gl.TRIANGLES,0,3);
  if(EAU.fix==null)EAU.raf=requestAnimationFrame(eauFrame);
}
/* Dès que la photo est prête pour la carte graphique. */
function eauReady(f){if(!eauInit())return;if(EAU.tex)f();else EAU.wait.push(f);}
/* À l'arrivée sur un écran qui montre la photo : la goutte rebondit, et l'onde part quand elle touche l'eau.
   Avec la lumière qui se lève en même temps, tout ce qui bouge tout seul est redevenu calme en cinq secondes.
   « first » : la toute première ouverture du site, où l'écran est déjà écrit dans la page. La lumière y attend l'eau, pour qu'elles partent ensemble. */
function eauArrive(first){
  const id=++EAU.seq;if(!fxOn())return;
  /* Si une onde de lumière traverse l'écran, la goutte attend qu'elle arrive jusqu'à la photo : c'est l'onde qui la fait sauter. */
  let attente=100;const o=state.onde;
  if(o&&Date.now()-o.t<300){const ph=document.querySelector(EAU_ICI);if(ph){const r=ph.getBoundingClientRect();attente=Math.round(o.dur*1000*Math.min(1,.06+Math.hypot((r.left+r.width/2-o.x)/1.25,r.top+r.height*.5-o.y)/o.r)*.85);}}
  const go=()=>setTimeout(()=>{
    if(id!==EAU.seq||!fxOn())return;
    if(first){const ap=document.getElementById('app');if(ap&&ap.classList){state.enterAt=Date.now();ap.classList.add('lum');}}
    if(!document.querySelector(EAU_ICI))return;
    eauReady(()=>{if(id!==EAU.seq)return;const host=document.querySelector(EAU_ICI);if(!host||!eauHost(host))return;eauBond();});
  },attente);
  /* On attend que la page ait fini de se charger : la première onde ne doit pas être saccadée. */
  if(document.readyState==='complete')go();else window.addEventListener('load',go,{once:true});
}
/* Sous le doigt : on ne fait bouger l'eau que là où il y a de l'eau. */
function eauTouch(e){
  if(!fxOn()||e.button>0)return;const t=e.target&&e.target.closest?e.target:null;
  if(!t||t.closest('button,a,input,textarea,select,label'))return;
  const host=t.closest('.herofull,.band');if(!host)return;
  const x=e.clientX,y=e.clientY;
  eauReady(()=>{
    if(!host.isConnected)return;const g=eauGeo(host);if(!g)return;const r=g.el.getBoundingClientRect();
    const ix=g.ox+(x-r.left)/g.k,iy=g.oy+(y-r.top)/g.k;
    if(Math.abs(ix-435)<30&&iy>140&&iy<262){if(eauHost(host))eauBond();return;}      /* la goutte ou sa colonne : elle rebondit */
    if(iy<118||iy>470||ix<0||ix>866)return;      /* la rive, la forêt, ou plus bas que la photo : rien ne bouge */
    if(eauHost(host))eauAdd(ix,iy,.8,0);
  });
}
/* Après chaque rendu : en changeant d'écran l'eau redevient calme, et sur le même écran le calque retrouve sa photo. */
function eauSync(entering){
  if(!EAU.cv)return;
  if(entering||!EAU.rips.length){eauStop();return;}
  if(!EAU.cv.isConnected){const host=document.querySelector('.herofull,.band');if(!host||!eauHost(host))eauStop();else if(!EAU.raf&&EAU.fix==null)EAU.raf=requestAnimationFrame(eauFrame);}
}
/* ---------- rendu ---------- */
const TAB_VIEWS=['today','parcours','kit','me'];
const BACK_VIEWS=['sit','exo','step','carnet','final','photo','data','about','plans','evo','depots','antonio','letter','deposer'];
/* Retrouver, après un nouveau rendu, le bouton qui avait le focus (clavier, lecteurs d'écran). Jamais un champ de texte : sur téléphone cela rouvrirait le clavier. */
function focusKey(el){
  if(!el||!el.matches||!el.closest||!el.closest('#app'))return null;
  if(el.matches('input[type=text],input[type=search],textarea'))return null;
  if(el.id)return '#'+el.id;
  const d=el.dataset||{};if(!d.act)return null;
  let s='[data-act="'+d.act+'"]';
  ['view','v','k','i','id','f','m'].forEach(a=>{if(d[a]!==undefined)s+='[data-'+a+'="'+String(d[a]).replace(/["\\]/g,'')+'"]';});
  return s;
}
function render(){
  const app=document.getElementById('app');let html='';let base='app';let key;
  const fkey=focusKey(document.activeElement);
  const oldSheet=app.querySelector('.sheet');const sheetTop=oldSheet?oldSheet.scrollTop:0;
  const visiteur=!D().onboarded;
  /* Le SOS s'ouvre pour tout le monde, même pour un visiteur qui n'est pas encore entré dans l'espace. */
  if(state.view==='sos'){base='app nobar';key='sos';html=viewSOS();}
  else if(state.view==='souffle'&&!visiteur){base='app nobar';key='souffle';html=viewSouffle();}
  else if(visiteur&&(state.view==='plans'||state.view==='about')){base='app nobar';key='peek-'+state.view;html='<header class="bar"><button type="button" class="back" data-act="back">'+I.back+'Retour</button><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>'+(state.view==='about'?viewAbout():viewPlans());}
  /* Un visiteur arrivé par le lien d'une fiche la lit tout de suite, sans rien avoir à créer. */
  else if(visiteur&&SITE&&state.view==='sit'&&SITS.some(x=>x.id===state.sit)){base='app nobar pub';key='pub-sit';html=barPub()+viewSit()+piedPub();}
  else if(visiteur&&SITE&&state.view==='kit'){state.kit='sits';base='app nobar pub';key='pub-kit';html=barPub()+viewKit()+piedPub();}
  /* La vitrine. Un visiteur y arrive, et un parent déjà entré la retrouve par « Accueil » : c'est un écran comme les autres, on y revient avec « Retour ». */
  else if(visiteur||state.view==='intro'){base='app nobar';key='intro';html=viewIntro();}
  else{
    key=state.view;html+=(large()?tabs():'')+bar();
    switch(state.view){
      case 'today':html+=viewToday();break;
      case 'parcours':html+=viewParcours();break;
      case 'step':html+=viewStep();break;
      case 'carnet':html+=viewCarnet();break;
      case 'final':html+=viewFinal();break;
      case 'evo':html+=viewEvo();break;
      case 'photo':html+=viewPhoto();break;
      case 'kit':html+=viewKit();break;
      case 'sit':html+=viewSit();break;
      case 'exo':html+=viewExo();break;
      case 'me':html+=viewMe();break;
      case 'plans':html+=viewPlans();break;
      case 'depots':html+=viewDepots();break;
      case 'antonio':html+=viewAntonio();break;
      case 'letter':html+=viewLetter();break;
      case 'data':html+=viewData();break;
      case 'about':html+=viewAbout();break;
      case 'deposer':html+=viewDeposer();break;
      default:html+=viewToday();
    }
    if(!large())html+=tabs();
  }
  /* Les animations d'apparition ne jouent qu'en entrant sur un écran ou en ouvrant une feuille, pas à chaque appui. */
  const entering=key!==state.lastKey;state.lastKey=key;
  if(entering)state.enterAt=Date.now();
  const age=(Date.now()-(state.enterAt||0))/1000;
  const sheetIn=!!state.sheet&&state.sheet!==state.lastSheet;state.lastSheet=state.sheet;
  if(state.sheet==='onboard')html+=sheetOnboard(sheetIn);
  if(state.sheet==='upgrade')html+=sheetUpgrade(sheetIn);
  if(state.sheet==='voix')html+=sheetVoix(sheetIn);
  /* « lum » : la lumière qui se lève une fois sur la photo. Si l'écran est redessiné entre-temps, elle reprend là où elle en était (--fx-age). */
  /* « v-… » dit quel écran est affiché, et « wide » marque les quatre onglets : la mise en page pour grand écran s'appuie dessus. */
  base+=' v-'+key+(TAB_VIEWS.includes(key)?' wide':'')+' h-'+moment();
  heureClasse();
  app.className=base+(entering?' enter':'')+(FX_OK&&age<4.8?' lum':'');
  if(FX_OK&&age<4.8&&app.style&&app.style.setProperty)app.style.setProperty('--fx-age',age.toFixed(2)+'s');
  app.removeAttribute('data-prerender');
  app.innerHTML=html;
  /* Un message bref survit au rendu suivant du même écran (sinon l'aide en cas de détresse disparaissait aussitôt), mais ne suit pas le parent sur un autre écran. */
  if(state.toast){if(state.toastView===state.view)renderToast();else state.toast='';}
  const sh=state.sheet?app.querySelector('.sheet'):null;
  if(sh&&sheetIn){try{sh.focus({preventScroll:true});}catch(e){}}
  else{
    if(sh)sh.scrollTop=sheetTop;
    if(fkey){
      let el=null;try{el=app.querySelector(fkey);}catch(e){}
      if(el){try{el.focus({preventScroll:true});}catch(e){}}
      else if(entering){const m=document.getElementById('main');if(m){try{m.focus({preventScroll:true});}catch(e){}}}
    }
  }
  if((state.view==='kit'&&state.kit==='tools'&&state.tool==='timer')||(state.view==='exo'&&state.exo==='minute'))drawTimer();
  syncStory(entering);
  titreSync();
  if(key==='intro')introLive();
  if(key==='step'){carnetHaut();lectureSync();}
  if(key==='souffle')souffleApres();
  fxMark();
  eauSync(entering);if(entering)eauArrive();
  sonGarde();
}
/* ---------- « Mon histoire » : adresse partageable (#histoire, sur le site) et un seul moment d'animation ---------- */
const STORY_HASH='#histoire';const TITLE0=SITE?TITRE_SITE:document.title;
/* Le moment de la journée est aussi posé sur la page entière : c'est là que le script du haut de page l'écrit avant le premier affichage. */
function heureClasse(){try{const c=document.documentElement.classList,m=moment();MOMENTS.forEach(k=>{c.toggle('h-'+k,k===m);});}catch(e){}}
function syncStory(entering){
  const on=state.view==='about';
  if(!on||!entering)return;
  const el=document.querySelector('.avec');
  if(!el||!('IntersectionObserver' in window)||!fxOn())return;
  el.classList.add('arm');
  const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){el.classList.add('seen');io.disconnect();}},{threshold:.35});
  io.observe(el);
}
function bar(){
  const back=BACK_VIEWS.includes(state.view)?'<button type="button" class="back" data-act="back">'+I.back+'Retour</button>':'';
  /* Sur grand écran, le nom de l'espace et le SOS sont dans la colonne de gauche : il ne reste ici que le bouton Retour, quand il y en a un. */
  /* Dans une étape, 3 traits sous la barre se remplissent pendant la lecture : comprendre, essayer, écrire. */
  const lect=state.view==='step'?'<span class="lecture" aria-hidden="true"><i><b></b></i><i><b></b></i><i><b></b></i></span>':'';
  if(large())return back?'<header class="bar sub">'+back+lect+'</header>':'';
  /* Le nom de l'espace mène à l'accueil, et un lien « Accueil » reste à côté du SOS sur tous les écrans de l'espace : la vitrine se retrouve en un geste. */
  const wm=back?'':'<a class="wordmark" href="'+RACINE+'#accueil" data-act="accueil" aria-label="Parent écouté, parent éclairé. Revenir à l’accueil">'+LOGO+'<span>Parent écouté<small>parent éclairé</small></span></a>';
  return '<header class="bar'+(back?' sub':'')+'">'+back+wm+'<span class="bar-d"><a class="va-accueil" href="'+RACINE+'#accueil" data-act="accueil">'+I.home+'<span>Accueil</span></a><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></span>'+lect+'</header>';
}
/* Les 3 temps d'une étape, dans l'ordre où on les vit. */
const TEMPS=[['comprendre','Comprendre'],['essayer','Essayer'],['ecrire','Écrire']];
/* Le temps de lecture d'une étape, compté sur ses mots, à un rythme tranquille. */
function minutesLecture(s){const n=[].concat(s.idee||[],s.vecu||[],s.ex||'',s.exo||'',s.obs||'').join(' ').split(/\s+/).filter(Boolean).length;return Math.max(2,Math.round(n/170));}
/* Où en est la lecture : la ligne de lecture descend du haut de l'écran (page en haut) au bas de l'écran (page en bas), et chaque trait dit quelle part de son temps elle a traversée. */
function lectureSync(){
  const r=document.querySelector('.bar .lecture');if(!r)return;
  const hs=TEMPS.map(t=>document.getElementById('t-'+t[0]));if(hs.some(h=>!h))return;
  const fin=document.querySelector('.etape>.quick');
  const sy=window.scrollY||window.pageYOffset||0,vh=window.innerHeight,max=Math.max(1,document.documentElement.scrollHeight-vh);
  const y=sy+vh*Math.min(1,sy/max);
  const top=e=>e.getBoundingClientRect().top+sy;
  const b=[top(hs[0]),top(hs[1]),top(hs[2]),fin?top(fin)+fin.offsetHeight:document.documentElement.scrollHeight];
  for(let i=0;i<3;i++){const q=Math.max(0,Math.min(1,(y-b[i])/Math.max(1,b[i+1]-b[i])));const f=r.children[i]&&r.children[i].firstChild;if(f&&f.style)f.style.transform='scaleX('+q.toFixed(3)+')';}
}
let lectTick=0;
function lectureScroll(e){if(lectTick)return;lectTick=1;const large=!!(e&&e.type==='resize');(window.requestAnimationFrame||setTimeout)(()=>{lectTick=0;if(large)carnetHaut();lectureSync();});}
/* ---------- erreurs de saisie : affichées sous le champ, sans rien effacer ---------- */
function fieldErr(id,msg){
  const el=document.getElementById(id);if(!el)return;
  let e=document.getElementById('err-'+id);
  if(!e){e=document.createElement('p');e.id='err-'+id;e.className='err';e.setAttribute('role','alert');el.insertAdjacentElement('afterend',e);}
  e.textContent=msg;el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby','err-'+id);
  try{el.focus();}catch(x){}
}
function clearErr(el){
  if(!el||!el.id||!el.hasAttribute('aria-invalid'))return;
  const e=document.getElementById('err-'+el.id);if(e)e.remove();
  el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby');
}
function clean(v,max){return String(v==null?'':v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,'').trim().slice(0,max);}
function updCount(t){
  const c=document.getElementById('draft-count');if(!c)return;const n=t.value.length;
  if(n>=LIM.draft*0.875){c.textContent=n+' / '+LIM.draft;c.className='count'+(n>=LIM.draft?' warn':'');}else c.textContent='';
}
/* ---------- accueil plein écran ---------- */
/* ---------- l'accueil : la page que voit un parent qui arrive pour la première fois ----------
   Une page longue, en chapitres. Chaque chapitre montre un vrai morceau de l'espace, pris dans ses contenus :
   des permissions, la dose du jour, une réponse à un dépôt, un schéma du parcours, un extrait de « Ce que j'ai vécu »,
   des cartes-images, les formules. Rien n'y est inventé au nom d'Antonio. */
function introDoseLabel(){if(new Date().getDay()===0)return 'Dose spéciale du dimanche';let j='';try{j=new Date().toLocaleDateString('fr-CH',{weekday:'long',day:'numeric',month:'long'});}catch(e){}return 'La dose du '+(j||fmtDate(todayIso()));}
function viewIntro(){
  const m=moment();
  /* Un parent déjà entré retrouve la même vitrine. Les boutons disent alors ce qui l'attend : son espace, et son parcours s'il l'a commencé. */
  const membre=!!D().onboarded,repr=membre&&parcoursCommence(),cur=currentStepIdx();
  const cta=wide=>'<button type="button" class="btn primary'+(wide?' wide':'')+'" data-act="entrer" data-v="today">'+I.sun2+(membre?'Ouvrir mon espace':'Commencer gratuitement')+'</button>';
  const priv=SITE?'Cette version de test est gratuite et tout ce que vous écrivez reste sur votre appareil. La phrase-miroir personnalisée arrivera avec la version complète. En attendant, chaque dépôt reçoit une question et une lumière.':'Vos notes restent sur votre appareil. Quand vous déposez, votre texte part sans votre nom et une intelligence artificielle écrit la réponse, avec la méthode d’Antonio.';
  const sec=(k,t,l,c)=>'<section class="acc acc-'+k+'" aria-labelledby="acc-'+k+'-t"><div class="acc-h"><h2 id="acc-'+k+'-t" class="acc-t">'+t+'</h2>'+(l?'<p class="acc-l">'+l+'</p>':'')+'</div><div class="acc-c">'+c+'</div></section>';
  const steps=allSteps();const etape=id=>steps.find(x=>x.id===id)||{};
  /* La dose du jour, la vraie. Sur le site, la page est écrite à l'avance : introLive() remet la dose d'aujourd'hui. */
  const dose='<div class="dose"><span class="label">'+esc(introDoseLabel())+'</span><p>'+esc(curatedDose())+'</p><span class="sig">Antonio</span></div>';
  /* Les situations : des scènes précises, rangées par âge, pour que le parent d'un jeune enfant, d'un ado ou d'un adulte se reconnaisse.
     Sur le site, chaque nom est un lien vers la fiche, qui se lit tout de suite et s'envoie telle quelle. */
  const SC=[['Avec un enfant',['sommeil','crise','repas']],['Avec un ado',['ado','ecrans','ecole']],['Avec un adulte',['grandir','loin','pros']],['Et pour vous',['epuise','culpa','regard']]];
  const lien=id=>{const s=SITS.find(x=>x.id===id);if(!s)return '';const tx='<span aria-hidden="true">'+s.e+'</span> '+esc(s.t);return '<li>'+(SITE?'<a href="'+ficheUrl(id)+'" data-act="sit" data-id="'+id+'">'+tx+'</a>':'<span>'+tx+'</span>')+'</li>';};
  const scenes='<div class="acc-scenes">'+SC.map(g=>'<div class="sc"><h3>'+g[0]+'</h3><ul class="acc-chips">'+g[1].map(lien).join('')+'</ul></div>').join('')+'</div>'+
    (SITE?'<a class="btn" href="'+RACINE+'fiches/" data-act="fiches">Voir les '+SITS.length+' situations</a>':'');
  const pictos='<p class="acc-st">La routine du soir, en '+ROUTINE_DEF.length+' images</p><ul class="acc-pictos">'+ROUTINE_DEF.map(id=>{const p=PICTOS.find(x=>x[0]===id);return p?'<li class="pc">'+pictoImg(id,72,true)+'<b>'+esc(p[1])+'</b></li>':'';}).join('')+'</ul>'+
    '<p class="acc-l acc-outils-l">Vous y trouvez aussi '+PICTOS.length+' images pour montrer à votre enfant ce qui vient d’abord et ce qui vient ensuite, un minuteur, des exercices pour souffler et un bouton SOS.</p>';
  /* Déposer : un exemple, avec une question et une lumière prises dans celles de l'espace. */
  const depot='<div class="mirror"><span class="lbl">Un exemple</span><p class="depot you">« Ce soir, j’ai crié pour une histoire de chaussettes. Il a pleuré, et moi aussi après. Je m’en veux. »</p><p class="q">'+esc(LOCAL_Q[1])+'</p><p class="l">'+esc(WORDS[10])+'</p>'+
    (()=>{const c=SITS.find(x=>x.id==='culpa');return c?'<p class="piste-ex">L’application propose aussi une piste, d’après vos mots. Ici, ce serait '+(SITE?'<a href="'+ficheUrl('culpa')+'" data-act="sit" data-id="culpa">'+esc(c.t)+'</a>':'« '+esc(c.t)+' »')+'.</p>':'';})()+'</div>'+
    '<p class="hint">'+(SITE?'Ce que vous écrivez reste sur votre appareil. Personne d’autre ne le lit.':'Votre texte part sans votre nom, et une intelligence artificielle écrit la réponse.')+'</p>'+
    '<button type="button" class="btn" data-act="porte" data-v="deposer">'+I.drop+'Déposer ce qui pèse</button>';
  /* Les permissions : 4 des 10 que l'espace propose. Le titre commence la phrase, chaque ligne la finit. */
  const perms='<ul class="acc-perms">'+[0,2,3,9].map(i=>PERMISSIONS[i]).filter(Boolean).map(p=>'<li>'+esc(p[1])+'</li>').join('')+'</ul><p class="acc-l">Ici, vous n’avez rien à prouver à personne.</p>';
  /* Le parcours : un schéma à dérouler, les 6 mois et leurs 24 étapes, puis un extrait de ce qu'Antonio raconte à l'étape 2. */
  const sch=schHtml('vague').replace('<span class="label">Le schéma</span>','<span class="label">Un schéma de l’étape 7, à dérouler</span>');
  const mois='<p class="acc-st">Les 6 mois, étape par étape</p><div class="acc-mois">'+PARCOURS.map((mm,mi)=>'<details class="mois"'+(mi===0?' open':'')+'><summary><span class="n">'+(mi+1)+'</span><span class="tx"><b>'+esc(mm.m)+'</b><span>Mois '+(mi+1)+'</span></span>'+I.chev+'</summary><ol start="'+(mi*4+1)+'">'+mm.steps.map(s=>'<li>'+esc(s.t)+'</li>').join('')+'</ol></details>').join('')+'</div>';
  const cr=etape('croire');const vec=Array.isArray(cr.vecu)?cr.vecu.slice(0,2):[];
  const vecu=!vec.length?'':'<div class="card vecu"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Ce que j’ai vécu</b><small>Antonio, à l’étape 2</small></div></div>'+vec.map(p=>'<p class="lesson">'+esc(p)+'</p>').join('')+'<div class="vecu-lien"><button type="button" class="linkbtn" data-act="peek-about">Lire mon histoire</button></div></div>';
  const allerParcours=repr?'<button type="button" class="btn" data-act="step" data-i="'+cur+'">'+I.path+'Reprendre mon parcours</button>':'<button type="button" class="btn" data-act="entrer" data-v="parcours">'+I.path+'Commencer le parcours de 6 mois</button>';
  /* Les formules, avec les prix affichés dans l'espace. */
  const F=[['free','La dose chaque jour, toute la boîte à outils, 3 dépôts écoutés et la première étape du parcours.'],['parcours','Les 24 étapes, votre carnet de route, « Mon évolution », le photolangage et des dépôts sans limite.'],['antonio','Tout Le parcours, avec un mot personnel d’Antonio chaque mois et 2 questions par mois.']];
  const plans='<ul class="acc-plans">'+F.map(f=>{const T=TIERS[f[0]];return '<li'+(f[0]==='parcours'?' class="best"':'')+'><div class="h"><b>'+esc(T.t)+'</b><span class="prix">'+T.p+' CHF'+(T.p==='0'?'':' <small>par mois</small>')+'</span></div><p>'+f[1]+'</p></li>';}).join('')+'</ul><button type="button" class="btn" data-act="peek-plans">Voir le détail des formules</button>';
  /* Les questions qu'un parent se pose avant de commencer. */
  const Q=[
    ['Faut-il créer un compte ?','Non. Il n’y a ni compte ni mot de passe. Votre espace se crée sur votre appareil dès votre premier geste, et vous pouvez ensuite le personnaliser si vous le souhaitez.'],
    ['Est-ce pour moi si mon enfant n’a pas de diagnostic ?','Oui. Cet espace s’adresse à tous les parents, que votre enfant vive une situation de handicap, que votre famille traverse une période difficile, ou que vous soyez parent, simplement.'],
    ['Qui lit ce que j’écris ?',SITE?'Personne. Dans cette version, tout ce que vous écrivez reste sur votre appareil, et rien n’est envoyé.':'Vos notes restent sur votre appareil. Quand vous déposez, votre texte part sans votre nom, et une intelligence artificielle écrit la réponse.'],
    ['Qui me répond ?',SITE?'Les textes de l’espace sont écrits à l’avance, sous la responsabilité d’Antonio Company. Dans cette version de test, chaque dépôt reçoit une question et une lumière. Dans la version complète, une intelligence artificielle écrira une réponse personnelle, et l’espace vous le dira clairement.':'Quand vous déposez, une intelligence artificielle écrit la réponse, avec la méthode d’Antonio, et l’espace vous le dit. Les autres textes sont écrits à l’avance, sous la responsabilité d’Antonio Company.'],
    ['Combien de temps cela demande-t-il ?','Vous pouvez venir 30 secondes pour lire la dose du jour, ou 2 minutes pour souffler. Si vous suivez le parcours, comptez 5 à 10 minutes par semaine pour lire une étape, puis un essai chez vous et quelques mots dans votre carnet. Si vous vous absentez, rien ne s’accumule, et votre étape vous attend.'],
    ['Est-ce que cela remplace un professionnel ?','Non. Cet espace vous soutient entre deux rendez-vous, et il ne remplace ni un médecin ni un thérapeute. En cas d’urgence, le bouton SOS vous donne les numéros à appeler.']
  ];
  const faq='<div class="acc-faq-l">'+Q.map(q=>'<details class="faq"><summary><span>'+q[0]+'</span>'+I.chev+'</summary><p>'+q[1]+'</p></details>').join('')+'</div>';
  /* La fin : la phrase qu'Antonio adresse aux parents à l'étape 4, puis le bouton. */
  const ob=etape('objectifs');const cit=((typeof ob.vecu==='string'?ob.vecu:'').match(/Vous qui me lisez.*$/)||[''])[0];
  /* Le premier écran : une question, et 3 réponses qui tiennent chacune en un geste. Le nom de l'espace et le SOS sont en haut. */
  return '<main id="main" tabindex="-1" class="view intro" style="padding-top:0">'+
    '<div class="herofull bleed" id="accueil"><img class="herobg" src="'+HERO+'" alt="Une goutte tombe sur un étang et dessine des cercles, dans la lumière d’une forêt." width="866" height="470" decoding="async" fetchpriority="high">'+
    '<div class="hbar"><span class="wordmark">'+LOGO+'<span>Parent écouté<small>parent éclairé</small></span></span><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></div>'+
    '<h1><span class="salut"'+heureAttr(SALUT)+'>'+SALUT[m]+'</span> <span class="besoin">'+besoinHtml(m,true)+'</span></h1>'+
    portes(true)+
    (repr?'<button type="button" class="voie" data-act="step" data-i="'+cur+'">'+I.path+'<span>Reprendre mon parcours</span></button>':'<button type="button" class="voie" data-act="entrer" data-v="parcours">'+I.path+'<span>Commencer le parcours de 6 mois</span></button>')+
    (membre?'<button type="button" class="voie" data-act="entrer" data-v="today">'+I.sun2+'<span>Ouvrir mon espace</span></button>':'')+
    '<p class="rassure">'+(SITE?'Version de test, gratuite et sans compte. Ce que vous écrivez reste sur votre appareil.':'Gratuit et sans compte. Vos notes restent sur votre appareil.')+'</p></div>'+
    sec('dose','Chaque matin, une dose de lumière','Voici celle d’aujourd’hui. Demain, une autre vous attendra.',dose)+
    sec('outils','Des pistes pour les jours difficiles','Vous y trouvez '+SITS.length+' situations de la vraie vie, avec des pistes à essayer dès ce soir. Chaque fiche se lit en 2 minutes'+(SITE?' et s’envoie à quelqu’un qui compte pour vous.':'.'),scenes+pictos)+
    sec('depot','Un endroit pour déposer ce qui pèse','Vous écrivez ce que vous avez sur le cœur, sans donner de prénom. En retour, vous recevez une question qui ouvre et une lumière.',depot)+
    sec('perm','Ici, vous avez le droit','',perms)+
    sec('parcours','6 mois pour comprendre, essayer et avancer','Le parcours compte 24 étapes, une par semaine. À chaque étape, un schéma vous fait comprendre une idée, Antonio vous raconte ce qu’il a vécu, vous essayez chez vous et vous écrivez quelques mots dans votre carnet de route.',sch+mois+vecu+allerParcours)+
    '<section class="voice" aria-labelledby="voice-t"><h2 id="voice-t" class="sr">Qui est derrière cet espace</h2><p class="say">Avant d’accompagner des familles, j’ai moi-même été accueilli dans une famille.</p><p>J’ai été placé en famille d’accueil à 10 ans, je suis travailleur social depuis mes 19 ans et je suis père de 3 enfants. Moi aussi, j’ai connu ces périodes où la santé d’un enfant prend beaucoup de place.</p><p>Avec le temps, j’ai appris à composer, à apprendre et à évoluer avec la différence, et c’est ce que j’ai voulu mettre dans cet espace.</p><div class="who"><span class="av" aria-hidden="true">A</span><b>Antonio Company</b><button type="button" class="btn small" data-act="peek-about">Lire mon histoire</button></div></section>'+
    sec('formules','Vous commencez gratuitement','Pendant la version de test, vous pouvez essayer chaque formule sans rien payer, et la formule « Avec Antonio » est une démonstration. Voici les prix prévus pour la Suisse.',plans)+
    sec('faq','Vos questions','',faq)+
    '<section class="acc-fin" aria-label="Pour commencer"><img class="finbg" src="'+HERO+'" alt="" width="866" height="470" loading="lazy" decoding="async">'+(cit?'<blockquote><p>'+esc(cit)+'</p><footer>Antonio</footer></blockquote>':'')+cta(true)+'</section>'+
    '<p class="hint" style="text-align:center">'+priv+'</p>'+
    (ESSAI?'<p class="hint essai-l" style="text-align:center">Vous êtes sur une version d’essai, à une adresse à part. Le site habituel ne change pas.</p>':'')+
    '<div class="cta-flot">'+cta(false)+'</div></main>'+
    '<footer class="foot"><button type="button" class="linkbtn" data-act="peek-plans">Formules</button>'+(SITE?'<a href="'+RACINE+'fiches/" data-act="fiches">Les situations</a><a href="'+RACINE+'confidentialite.html">Confidentialité</a><a href="'+RACINE+'conditions.html">Conditions générales</a>'+(MENTIONS?'<a href="'+RACINE+'mentions-legales.html">Mentions légales</a>':''):'')+'</footer>';
}
/* Les mots et la lumière de l'heure, sur un écran écrit à l'avance dans la page : le moment de la journée, « Bonsoir », « ce soir ». */
function heureLive(){
  const app=document.getElementById('app');if(!app||!app.querySelectorAll)return;const m=moment();
  heureClasse();
  try{if(app.classList)MOMENTS.forEach(k=>{app.classList.toggle('h-'+k,k===m);});}catch(e){}
  try{app.querySelectorAll('[data-'+m+']').forEach(el=>{const t=el.getAttribute('data-'+m);if(el.textContent!==t)el.textContent=t;});}catch(e){}
}
/* Ce qui vit sur l'accueil une fois la page à l'écran : la dose du jour (la page a pu être écrite un autre jour),
   et le bouton flottant, qui apparaît quand le bouton du haut est sorti de l'écran et s'efface quand celui du bas arrive. */
let introIO=null;
function introLive(){
  if(introIO){try{introIO.disconnect();}catch(e){}introIO=null;}
  const app=document.getElementById('app');if(!app||!app.querySelector)return;const m=app.querySelector('main.intro');if(!m)return;
  heureLive();
  const dp=m.querySelector('.acc-dose .dose p'),dl=m.querySelector('.acc-dose .dose .label');
  if(dp){const tx=curatedDose();if(dp.textContent!==tx)dp.textContent=tx;}
  if(dl){const lb=introDoseLabel();if(dl.textContent!==lb)dl.textContent=lb;}
  const fl=m.querySelector('.cta-flot'),haut=m.querySelector('.herofull'),bas=m.querySelector('.acc-fin');
  if(!fl||!haut||!bas||!('IntersectionObserver' in window))return;
  const vu=new Map();
  introIO=new IntersectionObserver(es=>{es.forEach(e=>vu.set(e.target,e.isIntersecting));if(vu.has(haut)&&vu.has(bas))fl.classList.toggle('on',!vu.get(haut)&&!vu.get(bas));},{threshold:0});
  introIO.observe(haut);introIO.observe(bas);
}
/* ---------- aujourd’hui ---------- */
/* La date du jour en toutes lettres, pour le haut de « Aujourd'hui ». */
function jourLong(){try{const s=new Date().toLocaleDateString('fr-CH',{weekday:'long',day:'numeric',month:'long'});return s.charAt(0).toUpperCase()+s.slice(1);}catch(e){return fmtDate(todayIso());}}
/* Le fil du parcours : 24 points groupés par mois. Un point plein est une étape faite, le point cerclé est l'étape du moment. Il mène au parcours. */
function filHtml(){
  const d=D(),S=allSteps(),cur=currentStepIdx(),done=doneCount();
  const pts=S.map((s,i)=>'<i class="'+(d.steps[s.id]?'f':(i===cur?'c':''))+(i&&i%4===0?' m':'')+'"></i>').join('');
  const txt=done>=24?'Parcours terminé':'Étape '+(cur+1)+' sur 24';
  return '<button type="button" class="fil" data-act="go" data-view="parcours" aria-label="'+txt+'. '+done+' étape'+(done>1?'s':'')+' faite'+(done>1?'s':'')+'. Voir le parcours."><span class="pts" aria-hidden="true">'+pts+'</span><span class="ou">'+txt+'</span></button>';
}
/* Un morceau du sentier, dessiné derrière chaque étape du parcours : il arrive du haut jusqu'au rond, puis repart vers le bas.
   Le rond est à gauche ou à droite une fois sur deux, d'où les lacets. Le dessin s'étire avec la hauteur de la ligne. */
function sentierSvg(droite,hautFait,basFait,sansBas){
  const x=droite?68:28;
  return '<svg class="trace" viewBox="0 0 96 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path'+(hautFait?' class="fait"':'')+' d="M48 0 C48 28,'+x+' 22,'+x+' 50"/>'+(sansBas?'':'<path'+(basFait?' class="fait"':'')+' d="M'+x+' 50 C'+x+' 78,48 72,48 100"/>')+'</svg>';
}
/* « Personnaliser mon espace » : proposé une fois, après la première expérience, et jamais exigé. */
function persoCarte(){
  const d=D();if(d.perso||d.persoTard)return '';
  return '<div class="card perso reveal d4"><span class="label">Facultatif</span><p class="lesson" style="font-size:20px">Personnaliser mon espace</p><p class="hint">Vous pouvez donner votre prénom, l’âge de votre enfant et ce qui pèse en ce moment. L’espace vous proposera d’abord les situations qui vous concernent.</p><div class="row"><button type="button" class="btn small" data-act="onboard">'+I.user+'Personnaliser</button><button type="button" class="btn small ghost" data-act="perso-tard">Plus tard</button></div></div>';
}
function viewToday(){
  state.vuAuj=true;   /* le parent a vu « Aujourd'hui » pendant cette visite */
  const d=D();const t=todayIso();const m=d.moods[t];const st=allSteps()[currentStepIdx()];const rd=recentDepot();const mo=moment();
  const td=d.depots.filter(x=>x.date===t).slice(-1)[0];
  let html='<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band bleed" style="background-image:url('+HERO+')"><span class="label">'+esc(jourLong())+'</span><h1 class="t1">'+esc(greeting())+(d.me?', '+esc(d.me):'')+'.</h1><p class="besoin">'+besoinHtml(mo,false)+'</p></div>';
  /* Pour celui qui a 30 secondes : les 3 portes, puis la dose du jour. */
  html+=portes(false);
  html+='<div class="duo"><div class="duo-a">';
  if(can('antonio'))html+=letterCard();
  html+='<div class="dose reveal d1"><span class="label">'+(new Date().getDay()===0?'Dose spéciale du dimanche':'La dose de lumière intérieure')+'</span><p>'+esc(doseText())+'</p>'+(d.doseDate===t&&d.doseText?'<span class="sig">Écrite pour vous par une intelligence artificielle, dans l’esprit d’Antonio</span>':'<div class="sigrow"><span class="sig">Antonio<button type="button" class="qui-b" data-act="voix" aria-label="Qui écrit cette dose ?">'+I.info+'</button></span><button type="button" class="linkbtn" data-act="go" data-view="about">Lire mon histoire</button></div>')+
    (rd&&state.sample?(can('parcours')?'<div class="row"><button type="button" class="btn small" data-act="dose-perso"'+(state.doseBusy?' disabled':'')+'>'+I.sun2+(state.doseBusy?'Un instant…':(d.doseDate===t?'Une autre dose pour moi':'Ma dose, d’après ce que j’ai déposé'))+'</button></div>':'<div class="row"><button type="button" class="btn small" data-act="upgrade" data-f="dose">'+I.lock+'Ma dose personnalisée</button></div>'):'')+
    /* Après la lecture, et seulement si le parent le choisit : 40 secondes d'étang pour rester avec ces mots. */
    sonBoutonHtml('dose')+'</div>';
  /* Une raison simple de revenir : la dose change chaque jour, et l'espace le dit sans rien exiger. */
  html+='<p class="hint demain">Une nouvelle dose vous attend ici chaque matin.</p>';
  /* Pour celui qui suit le parcours : le fil des 24 étapes, puis l'étape de la semaine, en grand, avec un seul geste. */
  const stFait=!!d.steps[st.id];const stAp=st.idx<23?stepEtat(st.idx+1):null;const stSuiv=st.idx<23?allSteps()[st.idx+1]:null;
  const neuf=st.idx===0&&!stFait&&!d.seen[st.id];
  const stLab=neuf?'Le parcours de 6 mois commence ici':(!stFait?'L’étape de la semaine':(stAp&&stAp.k==='bientot'?'Étape faite. La suivante s’ouvre '+dansJours(stAp.n)+'.':'Étape faite'));
  html+='<div class="reprendre reveal d2">'+filHtml()+'<button type="button" class="step now semaine'+(stFait?' done':'')+'" data-act="step" data-i="'+st.idx+'"><span class="haut"><span class="n" style="--p:'+Math.round(doneCount()/24*100)+'">'+(stFait?I.check:(st.idx+1))+'</span><span class="tx"><span class="label">'+stLab+'</span><b>'+esc(st.t)+'</b><span class="ou">Étape '+(st.idx+1)+' sur 24, '+esc(PARCOURS[st.mi].m)+'</span></span></span>'+
    (!stFait&&st.acc?'<span class="promesse">'+esc(st.acc)+'</span>':'')+
    (stFait&&stSuiv&&stSuiv.acc?'<span class="promesse"><b>Ensuite, '+esc(stSuiv.t)+'.</b> '+esc(stSuiv.acc)+'</span>':'')+
    '<span class="btn primary small aller">'+I.path+(stFait?'Relire l’étape':(d.seen[st.id]?'Reprendre l’étape':'Ouvrir l’étape'))+'</span></button></div>';
  /* Ce que le parent a ouvert dernièrement, pour le rouvrir sans chercher. */
  html+=recentsHtml();
  html+='</div><div class="duo-b">';
  if(td)html+='<div class="card depot-jour reveal d3"><span class="label">Votre dépôt d’aujourd’hui</span>'+depotHtml(td,true)+pistesDepotHtml(td)+'</div>';
  html+='<div class="card reveal d4"><span class="label">Comment ça va, là, maintenant ?</span><div class="moodrow">'+MOODS.map((x,i)=>'<button type="button" data-act="mood" data-i="'+i+'" aria-pressed="'+(m===i)+'" aria-label="'+esc(x[1])+'">'+x[0]+'</button>').join('')+'</div>'+(m!==undefined?'<p style="font-family:var(--font-display);font-size:17px;line-height:1.4">'+esc(MOOD_WORDS[m])+'</p>':'')+'</div>';
  html+=persoCarte();
  return html+'</div></div></main>';
}
function letterCard(){
  const L=D().letters;const l=L.length?L[L.length-1]:null;
  const txt=l?l.text:LETTER_EXAMPLE;
  return '<button type="button" class="letter reveal d1" data-act="letter" data-i="'+(l?L.length-1:-1)+'"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>'+(l?'Le mot d’Antonio '+esc(deMois(l.date)):'Le mot d’Antonio, un exemple')+'</b><span>'+(l?esc(fmtDate(l.date)):'Démonstration de ce qu’il sera')+'</span></div></div><p>'+esc(txt.split('\n')[0])+'</p><span class="hint">'+(l?'Lire ':'Lire l’exemple ')+I.chev+'</span></button>';
}
function depotBox(){
  const left=depotsLeft();const today=todayIso();const td=D().depots.filter(x=>x.date===today).slice(-1)[0];
  const head=lab=>'<div class="row" style="justify-content:space-between;align-items:center">'+lab+(left!==Infinity&&left>0?'<span class="pill">'+left+' dépôt'+(left>1?'s':'')+' offert'+(left>1?'s':'')+'</span>':'')+'</div>';
  let html='<div class="card depot-c reveal d2">';
  if(left===0){
    html+=head('<span class="label">Déposer avec une réponse</span>')+'<p class="lesson" style="font-size:18px">Vos 3 dépôts Découverte sont utilisés.</p>'+lockline('Déposer sans limite, avec la phrase-miroir','depots')+'<button type="button" class="btn primary" data-act="upgrade" data-f="depots" style="align-self:flex-start">Passer au Parcours pour 14 CHF par mois</button>';
  }else{
    /* Les 2 intentions (« Écoutez-moi », « Et concrètement ? ») n'existent que là où une intelligence artificielle répond vraiment de 2 façons.
       Sur le site, l'écoute est ici, et les pistes concrètes sont dans les fiches : chaque bouton fait ce que dit son libellé. */
    html+='<label class="label" for="draft">Qu’est-ce qui pèse, là, maintenant ?</label>'+
      (state.sample?'<div class="chips attente" role="group" aria-label="Ce que vous attendez"><button type="button" class="chip" data-act="dmode" data-v="listen" aria-pressed="'+(state.depotMode==='listen')+'">Écoutez-moi</button><button type="button" class="chip" data-act="dmode" data-v="advice" aria-pressed="'+(state.depotMode==='advice')+'">Et concrètement, je fais quoi ?</button></div>':'')+
      '<textarea id="draft" maxlength="'+LIM.draft+'" placeholder="Écrivez comme ça vient, sans prénom." style="min-height:150px">'+esc(state.draft)+'</textarea>'+
      '<div class="row" style="align-items:center">'+(state.busy?'<button type="button" class="btn" data-act="dstop">'+I.stop+'Arrêter</button>':'<button type="button" class="btn primary" data-act="dsend">'+I.drop+'Déposer</button>')+'<span class="count" id="draft-count" aria-hidden="true"></span>'+(left!==Infinity&&left>0?'<span class="pill reste">'+left+' dépôt'+(left>1?'s':'')+' offert'+(left>1?'s':'')+'</span>':'')+'</div>'+
      (state.sample?'<p class="hint">La réponse est écrite par une intelligence artificielle, avec la méthode d’Antonio. Ce n’est pas Antonio qui vous répond ici.</p>':'')+
      (state.sample===false?'<p class="hint">Dans cette version de test, votre texte ne quitte pas votre appareil. Vous recevez une question et une lumière choisies par l’application, et la phrase-miroir arrivera avec la version complète. <button type="button" class="linkbtn" data-act="voix">Qui me répond ?</button></p>':'');
  }
  if(state.busy)html+='<div class="mirror"><div class="think" role="status"><span class="dotp"></span>Je vous lis…</div></div>';
  if(td&&!state.busy)html+=depotHtml(td,true)+pistesDepotHtml(td);
  html+='</div>';return html;
}
function depotHtml(x,compact){
  let out='<div class="mirror'+(x.id===state.fresh?' surface':'')+'"><span class="lbl">Le '+esc(dateLongue(x.date)||fmtDate(x.date))+(x.time?' à '+esc(hm(x.time).replace(/^0/,'')):'')+'</span>'+(compact?'':'<p class="depot you">« '+esc(x.text.length>220?x.text.slice(0,220)+'…':x.text)+' »</p>');
  if(x.risk)out+=riskHtml('q');
  if(x.miroir)out+='<p class="m">'+esc(x.miroir)+'</p>';
  if(x.question)out+='<p class="q">'+esc(x.question)+'</p>';
  if(x.lumiere)out+='<p class="l">'+esc(x.lumiere)+'</p>';
  if(x.conseil)out+='<div class="q">'+mdLite(x.conseil)+'</div>';
  /* Une réponse écrite par le modèle le dit, partout où elle s'affiche. En mode local, il n'y a ni phrase-miroir ni conseil. */
  if(x.miroir||x.conseil)out+='<p class="hint ia">Cette réponse a été écrite par une intelligence artificielle.</p>';
  const row=[];
  if(!x.conseil&&state.sample)row.push('<button type="button" class="btn small" data-act="dconcret" data-id="'+x.id+'">'+I.bulb+'Et concrètement ?</button>');
  if(can('antonio'))row.push('<label class="share"><input type="checkbox" data-act="share" data-id="'+x.id+'"'+(D().shared[x.id]?' checked':'')+'> Partager ce dépôt avec Antonio'+(DEMO?' (démonstration)':'')+'</label>');
  if(row.length)out+='<div class="row" style="align-items:center">'+row.join('')+'</div>';
  return out+'</div>';
}
/* ---------- écoute ---------- */
const LOCAL_Q=['Qu’est-ce qui, dans tout ça, dépend vraiment de vous ?','Si une amie vivait exactement cela, que lui diriez-vous ?','Qu’est-ce qui vous a tenu debout aujourd’hui, même un peu ?','De quoi auriez-vous besoin ce soir, en une phrase ?','Qu’est-ce que votre enfant a fait aujourd’hui que vous n’avez pas eu le temps de voir ?'];
function ctx(){return 'enfant '+(D().age?AGES[D().age].toLowerCase():'d’âge non précisé')+' ; ce qui pèse le plus pour ce parent : '+(D().weights.length?D().weights.map(w=>(WEIGHTS.find(x=>x[0]===w)||['',w])[1].toLowerCase()).join(', '):'non précisé');}
function listenPrompt(text){
  return 'Tu es la voix de « Parent Écouté, Parent Éclairé », un espace d’écoute créé par Antonio Company, travailleur social depuis ses 19 ans (responsable d’une équipe socio-éducative, auprès de personnes en situation de handicap ou en difficulté et de leurs familles ; père de trois enfants ; il a lui-même connu la famille d’accueil dans son enfance). Un parent vient de déposer ce qui pèse. Ta tâche : l’écouter, pas le conseiller. Réponds UNIQUEMENT avec un objet JSON : {"miroir":"...","question":"...","lumiere":"..."}.\n'+
  '« miroir » : une ou deux phrases qui reformulent ce que le parent vit, avec ses mots, en nommant l’émotion probable sans l’imposer (« on dirait que… »), sans aucun conseil, sans jugement, sans minimiser. « question » : une seule question ouverte, courte, qui aide le parent à voir plus clair ou à se reconnecter à ses ressources ; jamais « pourquoi ». « lumiere » : une phrase chaleureuse et vraie, jamais mièvre, qui reconnaît ce que le parent fait déjà, ou lui donne une permission (droit à la fatigue, à la colère, au repos). Français de Suisse romande, vouvoiement, aucun prénom, aucun diagnostic. Écris comme Antonio parle, avec des phrases simples et complètes, reliées par « et », « mais » ou « parce que ». N’utilise ni deux-points, ni point-virgule, ni tiret long, ni point médian, ni phrase sans verbe, ni formule du type « pas ceci, pas cela ». Si le message évoque un danger immédiat (idées suicidaires, violence grave), « lumiere » commence par inviter doucement à appeler le 143 (La Main Tendue) ou le 144.\n\nContexte : '+ctx()+'.\n\nDÉPÔT :\n"""\n'+text.slice(0,6000)+'\n"""';
}
function advicePrompt(){
  return 'Tu es la voix de « Parent Écouté, Parent Éclairé », celle d’un travailleur social expérimenté (dans le métier depuis ses 19 ans, auprès d’enfants, d’adolescents et d’adultes en situation de handicap ou en difficulté, responsable d’une équipe socio-éducative, père). Tu parles à un parent, en français de Suisse romande, vouvoiement, chaleur, zéro jargon, zéro jugement. Aucun diagnostic, aucun trouble nommé, aucun médicament, aucun prénom. Contexte : '+ctx()+'.\n'+
  'Structure en quatre parties courtes avec ces titres exacts précédés de « ## » : « Ce que j’entends » (deux phrases, sans juger, qui reconnaissent l’effort), « Ce que vous pouvez essayer » (trois pistes concrètes en liste à puces, réalistes ce soir ou cette semaine : prévisibilité, moins de mots, choix entre deux options, d’abord/ensuite, routines visuelles, sécurité d’abord, observer ce qui précède), « Pour vous » (une ou deux phrases pour le parent lui-même), « Si ça continue » (une phrase : quand et à qui demander de l’aide, sans dramatiser ; pédiatre ou médecin, l’équipe de l’institution ou de l’école, Pro Infirmis, associations de parents ; La Main Tendue 143 si le parent va très mal). Écris comme Antonio parle, avec des phrases simples et complètes, reliées par « et », « mais » ou « parce que ». N’utilise ni deux-points, ni point-virgule, ni tiret long, ni point médian, ni phrase sans verbe, ni formule du type « pas ceci, pas cela ». Maximum 200 mots. Pas de gras. Termine par une phrase simple et vraie.';
}
const RISK=/(suicid|me tuer|en finir|plus envie de vivre|le tuer|la tuer|je vais le frapper|je vais la frapper)/i;
async function sendDepot(){
  if(state.busy||state.sinking)return;
  const text=clean(state.draft,LIM.draft);if(text.length<5){fieldErr('draft','Écrivez quelques mots, comme ça vient (cinq caractères au moins).');return;}
  if(depotsLeft()===0){openUpgrade('depots');render();return;}
  const d=D();const n=new Date();const dep={id:'d'+Date.now(),date:todayIso(),time:pad(n.getHours())+':'+pad(n.getMinutes()),text,mode:state.depotMode};
  if(RISK.test(text)){dep.risk=true;toast('Si c’est urgent, appelez le 143 (La Main Tendue) ou le 144, de jour comme de nuit.');}
  else{const ps=pistesDepot(text);if(ps.length)dep.pistes=ps;}
  state.sinking=true;await fxSink();state.sinking=false;
  state.draft='';brouillonOte();state.busy=true;render();
  if(!state.sample){
    dep.question=LOCAL_Q[dayIdx(LOCAL_Q.length)];dep.lumiere=WORDS[(dayIdx(WORDS.length)+3)%WORDS.length];
    d.depots.push(dep);state.busy=false;state.fresh=dep.id;save();render();montreReponse();setTimeout(()=>{state.fresh=null;},1900);if(!dep.risk)toast('C’est déposé et gardé pour vous.');return;
  }
  state.ctl=new AbortController();
  try{
    if(state.depotMode==='advice'){
      const res=await state.sample([{role:'user',content:advicePrompt()},{role:'user',content:text}],{signal:state.ctl.signal,cache:false});
      dep.conseil=voix(res.text);
    }else{
      const r=await state.sample.json(listenPrompt(text),{signal:state.ctl.signal,cache:false});
      dep.miroir=voix(String((r&&r.miroir)||'').trim());dep.question=voix(String((r&&r.question)||'').trim());dep.lumiere=voix(String((r&&r.lumiere)||'').trim());
      if(!dep.miroir&&!dep.question)dep.question=LOCAL_Q[0];
    }
  }catch(e){
    if(e&&e.code==='not_granted')state.sample=false;
    dep.question=dep.question||LOCAL_Q[dayIdx(LOCAL_Q.length)];dep.lumiere=dep.lumiere||'C’est déposé. Même sans réponse, ce que vous avez écrit est maintenant en dehors de vous.';
    if(e&&e.code!=='cancelled'&&e.code!=='not_granted')toast('La réponse n’est pas venue cette fois. Votre dépôt est gardé.');
  }
  d.depots.push(dep);state.busy=false;state.ctl=null;state.fresh=dep.id;save();render();montreReponse();setTimeout(()=>{state.fresh=null;},1900);
}
async function concret(id){
  const d=D();const dep=d.depots.find(x=>x.id===id);if(!dep||!state.sample)return;
  if(!can('parcours')&&d.depots.filter(x=>x.conseil).length>=FREE_DEPOTS){openUpgrade('depots');render();return;}
  state.busy=true;render();state.ctl=new AbortController();
  try{const res=await state.sample([{role:'user',content:advicePrompt()},{role:'user',content:dep.text}],{signal:state.ctl.signal,cache:false});dep.conseil=voix(res.text);}
  catch(e){if(e&&e.code!=='cancelled')toast('Pas de réponse cette fois. Réessayez dans un instant.');}
  state.busy=false;state.ctl=null;save();render();
}
async function dosePerso(){
  const ld=recentDepot();if(!ld||!state.sample)return;
  if(!can('parcours')){openUpgrade('dose');render();return;}
  state.doseBusy=true;render();
  try{
    const r=await state.sample('Tu écris « la dose de lumière intérieure » de « Parent Écouté, Parent Éclairé », créé par Antonio Company, travailleur social. Un parent a déposé ceci il y a peu : """'+ld.text.slice(0,1500)+'""" (le '+fmtDate(ld.date)+'). Écris pour lui, pour aujourd’hui '+fmtDate(todayIso())+', une dose de 45 à 70 mots : une phrase qui montre que tu as entendu ce qu’il a déposé (sans le répéter mot à mot), une phrase qui éclaire ou donne une permission, et une petite chose à faire ou à regarder aujourd’hui. Français de Suisse romande, vouvoiement, aucun prénom, aucun conseil médical, aucune mièvrerie, pas de titre, pas de guillemets, pas de signature. Écris comme Antonio parle, avec des phrases simples et complètes, reliées par « et », « mais » ou « parce que ». N’utilise ni deux-points, ni point-virgule, ni tiret long, ni point médian, ni phrase sans verbe, ni formule du type « pas ceci, pas cela ». Réponds avec le texte seul.',{cache:false,modelTier:'quick'});
    D().doseDate=todayIso();D().doseText=voix(r.text.trim());save();
  }catch(e){if(e&&e.code==='not_granted')state.sample=false;toast('La dose personnalisée n’est pas venue. Celle du jour reste là.');}
  state.doseBusy=false;render();
}
/* ---------- parcours ---------- */
const NOTE_OUI='Gardé dans votre carnet, sur cet appareil.',NOTE_NON='Ce que vous écrivez ici reste sur votre appareil.';
const nl2=t=>esc(t).replace(/\n/g,'<br>');
function viewParcours(){
  const d=D();const cur=currentStepIdx();const steps=allSteps();const done=doneCount();const pct=Math.round(done/24*100);const nn=nbNotes();
  const ici=steps[cur]||steps[0];
  /* Au bout du sentier, l'arrivée : la page qui garde tout le chemin. Elle s'ouvre quand les 24 étapes sont faites. */
  const arrivee=done>=24?'<button type="button" class="arrivee ouverte" data-act="go" data-view="final"><span class="n">'+I.sun2+'</span><span class="tx"><b>Mon chemin</b><span>Tout votre parcours tient sur une page, avec vos mots.</span></span><span class="chev">'+I.chev+'</span></button>':'<div class="arrivee"><span class="n">'+I.sun2+'</span><span class="tx"><b>L’arrivée</b><span>Au bout du chemin, tout votre parcours tiendra sur une page, avec vos mots.</span></span></div>';
  const sous=(st,e,dn)=>dn?'Faite':(st.idx===cur&&e.k==='open')?'Cette semaine':e.k==='open'?'Ouverte':e.k==='bientot'?'S’ouvre '+dansJours(e.n):e.k==='tard'?'Plus tard':'Étape '+(st.idx+1);
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:center 6%"><h1 class="t1">Le parcours</h1></div><p class="sub">Le parcours compte 24 étapes, sur 6 mois. Chaque semaine, vous comprenez une idée, vous l’essayez chez vous et vous écrivez quelques mots dans votre carnet de route.</p>'+
    (d.tout?'<span class="pill sun apercu">Aperçu d’Antonio, tout est ouvert</span>':'')+
    '<div class="card prog"><div class="ou"><span class="anneau" style="--p:'+pct+'"><b>'+done+'</b><small>sur 24</small></span><div class="txt"><span class="label">Votre parcours</span><p class="lesson">'+(done>=24?'Parcours terminé':'Mois '+(ici.mi+1)+', '+esc(PARCOURS[ici.mi].m))+'</p><span class="hint">'+done+' étape'+(done>1?'s':'')+' faite'+(done>1?'s':'')+(nn?' et '+nn+' page'+(nn>1?'s':'')+' écrite'+(nn>1?'s':''):'')+'</span></div></div>'+
    '<div class="quick"><button type="button" class="btn" data-act="go" data-view="carnet">'+I.note+'Mon carnet'+(nn?' ('+nn+')':'')+'</button><button type="button" class="btn" data-act="go" data-view="evo">'+I.chart+'Mon évolution</button><button type="button" class="btn" data-act="go" data-view="photo">'+(can('parcours')?I.image:I.lock)+'Photolangage</button></div></div>'+
    (done>=24?'<button type="button" class="card fin-appel" data-act="go" data-view="final"><span class="label">Vous êtes au bout des 24 étapes</span><p class="lesson">Votre chemin tient maintenant sur une page, avec vos mots.</p><span class="btn primary small" style="align-self:flex-start">'+I.path+'Voir mon chemin</span></button>':'')+
    '<div class="months">'+PARCOURS.map((m,mi)=>{const nf=m.steps.filter(s=>d.steps[s.id]).length;return '<div class="month"><h2><span class="n">'+(mi+1)+'</span><span class="nom">'+esc(m.m)+'</span><span class="mfait">'+(nf===m.steps.length?'Fait':nf+' sur '+m.steps.length)+'</span></h2><div class="sentier">'+m.steps.map((s,si)=>{const st=steps.find(x=>x.mi===mi&&x.si===si);const dn=!!d.steps[st.id];const e=stepEtat(st.idx);const lk=e.k!=='open';const av=st.idx>0?!!d.steps[steps[st.idx-1].id]:true;return '<button type="button" class="step'+(si%2?' d':' g')+(st.idx===cur&&!lk?' now':'')+(dn?' done':'')+(lk?' locked':'')+(e.k==='bientot'?' soon':'')+'" data-act="step" data-i="'+st.idx+'">'+sentierSvg(si%2===1,av,dn,false)+'<span class="n">'+(lk?I.lock:dn?I.check:(st.idx+1))+'</span><span class="tx"><b>'+esc(s.t)+'</b><span>'+sous(st,e,dn)+'</span></span><span class="chev">'+I.chev+'</span></button>';}).join('')+(mi===5?arrivee:'')+'</div></div>';}).join('')+'</div>'+
    (can('parcours')||d.tout?'<p class="hint">Une étape s’ouvre 7 jours après la précédente, pour vous laisser le temps d’essayer. Si vous vous absentez, rien ne s’accumule, et votre étape vous attend.</p>':lockline('Les 23 étapes suivantes font partie du Parcours, à 14 CHF par mois','parcours'))+'</main>';
}
/* Les boutons d'une étape vers un autre écran : « Mon évolution », le photolangage, la respiration, les situations, ou une situation précise (« sit_nom »). */
function stepLiens(s){
  const L={evo:['go','evo',I.chart,'Faire le point dans Mon évolution'],photo:['go','photo',I.image,'Ouvrir le photolangage'],breath:['exo','breath',I.wind,'Respirer 4-6 maintenant'],advice:['kit','sits',I.bulb,'Ouvrir les situations']};
  const ks=!s.link?[]:(Array.isArray(s.link)?s.link:[s.link]);
  return ks.map(k=>{
    if(k.indexOf('sit_')===0){const id=k.slice(4);const x=SITS.find(y=>y.id===id);return x?'<button type="button" class="btn wide" data-act="sit" data-id="'+id+'">'+I.bulb+'<span>« '+esc(x.t)+' », dans la boîte à outils</span></button>':'';}
    const l=L[k];return l?'<button type="button" class="btn wide" data-act="'+l[0]+'" data-view="'+l[1]+'" data-id="'+l[1]+'" data-v="'+l[1]+'">'+l[2]+l[3]+'</button>':'';
  }).join('');
}
/* Une étape : comprendre (l'idée et son schéma), ce qu'Antonio a vécu, un exemple, essayer, observer, puis écrire dans le carnet de route. */
function viewStep(){
  const steps=allSteps();const s=steps[state.step];if(!s){state.view='parcours';return viewParcours();}
  const d=D();const dn=!!d.steps[s.id];const nt=d.notes[s.id];const txt=nt&&nt.t?nt.t:'';
  const paras=(Array.isArray(s.idee)?s.idee:[s.idee]).map(p=>'<p class="lesson">'+esc(p)+'</p>').join('');
  let rap='';
  if(s.rap){const r=steps.find(x=>x.id===s.rap);const rn=r?noteDe(r.id):null;
    if(r)rap='<div class="card rap"><span class="label">Ce que vous aviez écrit à l’étape '+(r.idx+1)+'</span>'+(rn?'<p class="lesson">'+nl2(rn.t)+'</p><span class="hint">Écrit le '+esc(fmtDate(rn.d))+'</span>':'<p class="hint">Vous n’aviez rien écrit à cette étape, qui s’appelle « '+esc(r.t)+' ». Vous pouvez encore le faire.</p><button type="button" class="btn small" data-act="step" data-i="'+r.idx+'" style="align-self:flex-start">Ouvrir cette étape</button>')+'</div>';}
  const sv=s.idx<steps.length-1?steps[s.idx+1]:null;const ap=sv?stepEtat(sv.idx):null;
  /* La prochaine étape : son titre, une phrase qui dit ce qu'on y trouvera, puis le jour où elle s'ouvre ou le bouton pour y aller. */
  const fin=!sv?'<button type="button" class="btn'+(dn?' primary':'')+'" data-act="go" data-view="final">'+I.path+'Voir mon chemin en entier</button>':'';
  /* Le mot de la fin : les derniers mots d'Antonio, après le carnet. Seule la dernière étape en a un. */
  const mot=!s.mot?'':'<div class="card vecu mot"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Le mot de la fin</b><small>Antonio</small></div></div>'+(Array.isArray(s.mot)?s.mot:[s.mot]).map(p=>'<p class="lesson">'+esc(p)+'</p>').join('')+'</div>';
  const suite=!sv?'':'<div class="card suite"><span class="label">La prochaine étape</span><h2>'+esc(sv.t)+'</h2>'+(sv.acc?'<p>'+esc(sv.acc)+'</p>':'')+
    ((ap.k==='open'||ap.k==='formule')?'<button type="button" class="btn" data-act="step" data-i="'+sv.idx+'">Ouvrir cette étape '+I.chev+'</button>':
     ap.k==='bientot'?'<p class="hint">Elle s’ouvrira '+dansJours(ap.n)+'. D’ici là, vous avez le temps d’essayer.</p>':'')+'</div>';
  const mn=minutesLecture(s);
  /* Une fois l'étape faite, le fil des 24 étapes montre le chemin parcouru. */
  const nf=doneCount();
  const neuf=!!(state.bravoAt&&Date.now()-state.bravoAt<1500);
  const bravo=!dn?'':'<div class="bravo'+(neuf?' neuf':'')+'"><span class="pts" aria-hidden="true">'+steps.map((x,i)=>'<i class="'+(d.steps[x.id]?'f':'')+(i&&i%4===0?' m':'')+'" style="--k:'+i+'"></i>').join('')+'</span><p>'+(nf>=24?'Vous avez fait les 24 étapes du parcours.':'Vous avez fait '+nf+' étape'+(nf>1?'s':'')+' sur 24.')+'</p></div>';
  const chap=i=>'<h2 class="chap" id="t-'+TEMPS[i][0]+'" tabindex="-1"><span class="n" aria-hidden="true">'+(i+1)+'</span><span class="nom">'+TEMPS[i][1]+'</span></h2>';
  /* La couverture : le numéro en grand derrière le titre, ce que l'étape promet, puis ses 3 temps et le temps de lecture. */
  return '<main id="main" tabindex="-1" class="view etape"><div class="couv" data-n="'+(s.idx+1)+'"><span class="label">Étape '+(s.idx+1)+' sur 24, mois '+(s.mi+1)+'</span><h1 class="t1">'+esc(s.t)+'</h1><p class="sub">'+esc(PARCOURS[s.mi].m)+'</p>'+
      (s.acc?'<p class="promesse">'+esc(s.acc)+'</p>':'')+
      '<nav class="temps" aria-label="Les 3 temps de l’étape">'+TEMPS.map((t,i)=>'<button type="button" data-act="temps" data-k="'+t[0]+'"><i aria-hidden="true">'+(i+1)+'</i><span>'+t[1]+'</span></button>').join('')+'</nav>'+
      '<p class="hint duree">Environ '+mn+' minutes de lecture, puis votre essai de la semaine.</p></div>'+
    chap(0)+
    '<div class="card idee">'+paras+(s.vecu?'':'<p class="hint" style="text-align:right">Antonio</p>')+'</div>'+
    (s.sch?schHtml(s.sch):'')+
    (s.vecu?'<div class="card vecu"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Ce que j’ai vécu</b><small>Antonio</small></div></div>'+(Array.isArray(s.vecu)?s.vecu:[s.vecu]).map(p=>'<p class="lesson">'+esc(p)+'</p>').join('')+'<div class="vecu-lien"><button type="button" class="linkbtn" data-act="go" data-view="about">Lire mon histoire</button></div></div>':'')+
    (s.ex?'<div class="card exemple"><span class="label">Un exemple</span><p>'+esc(s.ex)+'</p></div>':'')+
    chap(1)+
    rap+
    '<div class="mission"><div class="exo"><span class="label">'+I.check+'Cette semaine, j’essaie</span><p>'+esc(s.exo)+'</p></div>'+
    '<div class="card green"><span class="label">'+I.eye+'À observer</span><p>'+esc(s.obs)+'</p></div></div>'+
    stepLiens(s)+
    chap(2)+
    '<div class="card carnet"><span class="label">Mon carnet de route</span><label class="lesson" for="note">'+esc(s.ecr)+'</label><textarea id="note" data-note="'+s.id+'" maxlength="'+LIM.note+'" placeholder="'+esc(s.ph||'Écrivez ici, avec vos mots.')+'">'+esc(txt)+'</textarea><p class="hint" id="note-etat" aria-live="polite">'+(txt?NOTE_OUI:NOTE_NON)+'</p></div>'+mot+
    '<div class="quick"><button type="button" class="btn'+(dn?'':' primary')+'" data-act="stepdone" data-id="'+s.id+'">'+I.check+(dn?'Étape faite':'Marquer comme faite')+'</button>'+fin+'</div>'+bravo+suite+'</main>';
}
/* Le carnet de route : ce que le parent a écrit à chaque étape, mois par mois. Tout reste sur son appareil. */
function viewCarnet(){
  const S=allSteps();const n=nbNotes();
  let h='<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Mon carnet de route</h1><p class="sub">Vous retrouvez ici ce que vous avez écrit à chaque étape du parcours. Tout reste sur votre appareil.</p></div>';
  if(!n)return h+'<div class="card vide"><p>Votre carnet est encore vide. Il se remplira avec ce que vous écrirez à la fin de chaque étape.</p><button type="button" class="btn primary" data-act="step" data-i="'+currentStepIdx()+'" style="align-self:flex-start">'+I.path+'Ouvrir mon étape</button></div></main>';
  h+='<button type="button" class="btn" data-act="go" data-view="final" style="align-self:flex-start">'+I.path+'Mon chemin, la page à garder</button>';
  PARCOURS.forEach((m,mi)=>{
    const L=S.filter(s=>s.mi===mi&&noteDe(s.id));if(!L.length)return;
    h+='<section class="carnet-mois"><h2><span class="n">'+(mi+1)+'</span>'+esc(m.m)+'</h2>'+L.map(s=>{const nt=noteDe(s.id);
      return '<article class="card page"><span class="label">Étape '+(s.idx+1)+', '+esc(s.t)+'</span><p class="q">'+esc(s.ecr)+'</p><p class="lesson">'+nl2(nt.t)+'</p><div class="row" style="align-items:center;justify-content:space-between"><span class="hint">Écrit le '+esc(fmtDate(nt.d))+'</span><button type="button" class="btn small" data-act="step" data-i="'+s.idx+'">Rouvrir l’étape</button></div></article>';}).join('')+'</section>';
  });
  return h+'</main>';
}
/* ---------- Le final : « Mon chemin », tout le parcours du parent sur une page, à garder ou à imprimer ----------
   La page rassemble ce que le parent a fait et écrit : ses points de « Mon évolution », les photos qu'il a choisies,
   ses pages de carnet, sa lettre. Les seuls mots qui ne sont pas les siens sont le mot de la fin d'Antonio. Tout reste sur l'appareil. */
function dateLongue(iso){
  const p=String(iso||'').split('-').map(Number);if(p.length<3||!p[0]||!p[1]||!p[2])return '';
  try{return new Date(p[0],p[1]-1,p[2]).toLocaleDateString('fr-CH',{day:'numeric',month:'long',year:'numeric'});}catch(e){return fmtDate(iso);}
}
/* Le graphique de « Mon évolution » : une ligne par échelle, une barre par point fait. Il sert dans « Mon évolution » et dans le final. */
function evoBars(){
  const e=D().evo||{};const have=EVO_TIMES.filter(x=>e[x[0]]);if(!have.length)return '';
  return '<div class="bars">'+EVO_SCALES.map(s=>'<div class="barrow"><span>'+esc(s.t.replace('Mon ','').replace('Ma ',''))+'</span><div class="bartrack">'+EVO_TIMES.map((x,i)=>e[x[0]]?'<i class="t'+(i+1)+'"><b style="width:'+(Number(e[x[0]][s.id]||0)*10)+'%"></b><em>'+Number(e[x[0]][s.id]||0)+'</em></i>':'').join('')+'</div></div>').join('')+'</div><div class="legend">'+have.map(x=>'<span class="t'+(EVO_TIMES.indexOf(x)+1)+'">'+esc(x[1])+(e[x[0]].date?', '+esc(fmtDate(e[x[0]].date)):'')+'</span>').join('')+'</div>';
}
/* Les photos choisies, dans l'ordre. Une photo retirée depuis du jeu n'est pas montrée. */
function photosChoisies(){
  const L=Array.isArray(D().photos)?D().photos:[];
  return L.map(p=>{const x=p&&p.id?PHOTOS.find(y=>y[0]===p.id):null;return x?{x:x,text:p.text||'',date:p.date||''}:null;}).filter(Boolean);
}
function viewFinal(){
  const d=D();const S=allSteps();const e=d.evo||{};
  const dep=noteDe('depart'),lettre=noteDe('chemin');const der=S[S.length-1]||{};
  const faites=doneCount(),pages=nbNotes(),photos=photosChoisies(),pts=EVO_TIMES.filter(x=>e[x[0]]);
  const peutImprimer=typeof window.print==='function';
  const du=dateLongue(d.start),au=dateLongue(todayIso());
  let h='<main id="main" tabindex="-1" class="view final"><div class="fin-couv"><span class="label">Parent Écouté, Parent Éclairé</span><h1 class="t1">'+(d.me?'Le chemin de '+esc(d.me):'Mon chemin')+'</h1>'+
    '<p class="sub">'+(du&&du!==au?'Du '+esc(du)+' au '+esc(au)+'. ':'')+faites+' étape'+(faites>1?'s':'')+' faite'+(faites>1?'s':'')+' sur 24, et '+pages+' page'+(pages>1?'s':'')+' écrite'+(pages>1?'s':'')+'.</p></div>'+
    '<div class="card fin-mode sansimp"><p>Voici votre parcours rassemblé sur une seule page, avec vos mots. Vous pouvez la garder, ou l’imprimer.</p>'+(peutImprimer?'<button type="button" class="btn primary" data-act="imprimer" style="align-self:flex-start">'+I.note+'Imprimer ou enregistrer en PDF</button>':'')+'</div>';
  if(!pages&&!pts.length&&!photos.length)return h+'<div class="card"><p>Votre chemin est encore vide. Il se remplira avec ce que vous écrirez à chaque étape, vos points dans « Mon évolution » et les photos que vous choisirez.</p><button type="button" class="btn" data-act="step" data-i="'+currentStepIdx()+'" style="align-self:flex-start">'+I.path+'Ouvrir mon étape</button></div></main>';
  if(dep)h+='<section class="fin-bloc" aria-labelledby="fin-dep"><h2 id="fin-dep" class="t2">Mon point de départ</h2><div class="card page"><p class="q">'+esc(S[0].ecr)+'</p><p class="lesson">'+nl2(dep.t)+'</p><span class="hint">Écrit le '+esc(fmtDate(dep.d))+'</span></div></section>';
  if(pts.length){
    const ouv=pts.map(x=>{const r=e[x[0]];const L=EVO_OPEN.filter(o=>r[o[0]]&&String(r[o[0]]).trim());return L.length?'<div class="card page"><span class="label">'+esc(x[1])+(r.date?', le '+esc(fmtDate(r.date)):'')+'</span>'+L.map(o=>'<p class="q">'+esc(evoQ(o))+'</p><p class="lesson">'+nl2(r[o[0]])+'</p>').join('')+'</div>':'';}).join('');
    h+='<section class="fin-bloc" aria-labelledby="fin-evo"><h2 id="fin-evo" class="t2">'+(pts.length>1?'Mes '+pts.length+' points':'Mon premier point')+'</h2><div class="card">'+evoBars()+'<p class="hint">Chaque barre va de 0 à 10.</p></div>'+ouv+'</section>';
  }
  if(photos.length)h+='<section class="fin-bloc" aria-labelledby="fin-pho"><h2 id="fin-pho" class="t2">'+(photos.length>1?'Les photos que j’ai choisies':'La photo que j’ai choisie')+'</h2><div class="fin-photos">'+photos.map(p=>'<figure class="card fin-photo"><img src="'+PHOTO_DIR+p.x[0]+'.webp" alt="'+esc(p.x[2])+'" width="400" height="300" loading="lazy" decoding="async"><figcaption><b>'+esc(p.x[1])+'</b>'+(p.date?'<span class="hint">Choisie le '+esc(fmtDate(p.date))+'</span>':'')+(p.text?'<p class="lesson">'+nl2(p.text)+'</p>':'')+'</figcaption></figure>').join('')+'</div></section>';
  const ecrits=PARCOURS.map((m,mi)=>{const L=S.filter(s=>s.mi===mi&&noteDe(s.id)&&s.id!=='depart'&&s.id!=='chemin');if(!L.length)return '';
    return '<div class="carnet-mois"><h3><span class="n">'+(mi+1)+'</span>'+esc(m.m)+'</h3>'+L.map(s=>{const nt=noteDe(s.id);return '<article class="card page"><span class="label">Étape '+(s.idx+1)+', '+esc(s.t)+'</span><p class="q">'+esc(s.ecr)+'</p><p class="lesson">'+nl2(nt.t)+'</p><span class="hint">Écrit le '+esc(fmtDate(nt.d))+'</span></article>';}).join('')+'</div>';}).join('');
  if(ecrits)h+='<section class="fin-bloc" aria-labelledby="fin-ecr"><h2 id="fin-ecr" class="t2">Ce que j’ai écrit</h2>'+ecrits+'</section>';
  h+='<section class="fin-bloc" aria-labelledby="fin-let"><h2 id="fin-let" class="t2">Ma lettre</h2>'+(lettre?'<div class="card page fin-lettre"><p class="q">'+esc(der.ecr||'')+'</p><p class="lesson">'+nl2(lettre.t)+'</p><span class="hint">Écrite le '+esc(fmtDate(lettre.d))+'</span></div>':'<div class="card sansimp"><p>Votre lettre vous attend à la dernière étape du parcours.</p></div>')+'</section>';
  if(der.mot)h+='<div class="card vecu mot"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Le mot de la fin</b><small>Antonio</small></div></div>'+(Array.isArray(der.mot)?der.mot:[der.mot]).map(p=>'<p class="lesson">'+esc(p)+'</p>').join('')+'</div>';
  return h+'<p class="hint fin-pied">Tout ce qui est écrit ici reste sur votre appareil. Cette page se complète à mesure que vous avancez.</p></main>';
}
/* ---------- Les schémas du parcours ----------
   Le dessin avance d'un moment à chaque « Voir la suite ». Rien ne démarre tout seul, et le dessin n'est pas redessiné
   quand l'écran l'est : seul le morceau qui vient d'apparaître est animé (classe « neuf »). */
function schK(S){return Math.max(1,Math.min(S.caps.length,state.sch||1));}
function schHtml(key){
  const S=SCHEMAS[key];if(!S)return '';
  const n=S.caps.length,k=schK(S);
  return '<div class="card sch" data-sch="'+key+'"><span class="label">Le schéma</span>'+
    '<svg class="sch-svg" viewBox="'+S.vb+'" role="img" aria-label="'+esc(S.alt)+'">'+S.base+S.l.map(x=>'<g class="sp'+(x[0]<=k?' on':'')+'" data-p="'+x[0]+'">'+x[1]+'</g>').join('')+'</svg>'+
    '<ol class="sch-caps" aria-live="polite">'+S.caps.map((c,i)=>'<li class="'+(i<k?'on':'')+(i===k-1?' cur':'')+'">'+esc(c)+'</li>').join('')+'</ol>'+
    '<div class="sch-nav"><span class="sch-pos">'+k+' sur '+n+'</span><button type="button" class="btn small'+(k<n?' primary':'')+'" data-act="'+(k<n?'schnext':'schagain')+'">'+(k<n?'Voir la suite'+I.chev:'Revoir depuis le début')+'</button></div></div>';
}
function schSync(neuf){
  const box=document.querySelector('.sch');if(!box)return;const S=SCHEMAS[box.dataset.sch];if(!S)return;
  const n=S.caps.length,k=schK(S);
  [].forEach.call(box.querySelectorAll('.sp'),g=>{const p=Number(g.dataset.p);g.classList.toggle('on',p<=k);g.classList.toggle('neuf',!!neuf&&p===k);});
  [].forEach.call(box.querySelectorAll('.sch-caps li'),(li,i)=>{li.classList.toggle('on',i<k);li.classList.toggle('cur',i===k-1);li.classList.toggle('neuf',!!neuf&&i===k-1);});
  const pos=box.querySelector('.sch-pos');if(pos)pos.textContent=k+' sur '+n;
  const b=box.querySelector('.sch-nav button');
  if(b){b.dataset.act=k<n?'schnext':'schagain';b.className='btn small'+(k<n?' primary':'');b.innerHTML=k<n?'Voir la suite'+I.chev:'Revoir depuis le début';}
}
/* ---------- évolution ---------- */
/* Une échelle numérotée de 0 à 10 : le rond se glisse, les chiffres se touchent, et le rond porte le chiffre choisi.
   Ce qui est réglé mais pas encore enregistré est gardé de côté (state.evoDraft), pour ne pas le perdre si l'écran est redessiné. */
/* Une question ouverte peut avoir une formulation par situation (handicap, période difficile, parent simplement). */
function evoQ(o){const q=o[1];return typeof q==='string'?q:(q[D().situation]||q.parent);}
function evoSync(r){
  const v=Number(r.value),b=r.closest('.scale');if(!b)return;
  b.style.setProperty('--p',String(v/10));
  const th=b.querySelector('.scale-thumb');if(th)th.textContent=String(v);
  const o=b.querySelector('.scale-val b');if(o)o.textContent=String(v);
  r.setAttribute('aria-valuetext',v+' sur 10');
  [].forEach.call(b.querySelectorAll('.scale-nums button'),x=>{const n=Number(x.dataset.v);x.classList.toggle('on',n<=v);x.classList.toggle('cur',n===v);});
  const t=state.evoTime;state.evoDraft=state.evoDraft||{};state.evoDraft[t]=state.evoDraft[t]||{};state.evoDraft[t][r.dataset.evo]=v;
  if(th&&fxOn()){th.classList.remove('pop');void th.offsetWidth;th.classList.add('pop');}
}
function viewEvo(){
  const e=D().evo;const t=state.evoTime;const cur=e[t]||{};const dr=(state.evoDraft||{})[t]||{};
  const chips='<div class="chips points3" role="group" aria-label="Les 3 points du parcours">'+EVO_TIMES.map((x,i)=>{const lk=i>0&&!can('parcours');return '<button type="button" class="chip'+(e[x[0]]?' fait':'')+'" data-act="evotime" data-v="'+x[0]+'" aria-pressed="'+(t===x[0])+'">'+(lk?I.lock+' ':'')+x[1]+(e[x[0]]?' ✓':'')+'</button>';}).join('')+'</div>';
  const NUMS=[0,1,2,3,4,5,6,7,8,9,10];
  const scales=EVO_SCALES.map(s=>{
    const v=dr[s.id]!==undefined?dr[s.id]:(cur[s.id]!==undefined?cur[s.id]:5);
    return '<div class="scale" style="--p:'+(v/10)+'">'+
      '<div class="scale-top"><b id="sc-'+s.id+'">'+esc(s.t)+'</b><span class="scale-val" aria-hidden="true"><b>'+v+'</b> sur 10</span></div>'+
      '<div class="scale-track"><input type="range" id="evo-r-'+s.id+'" min="0" max="10" step="1" value="'+v+'" data-evo="'+s.id+'" aria-labelledby="sc-'+s.id+'" aria-describedby="sd-'+s.id+'" aria-valuetext="'+v+' sur 10"><span class="scale-thumb" aria-hidden="true">'+v+'</span></div>'+
      '<div class="scale-nums" aria-hidden="true">'+NUMS.map(n=>'<button type="button" tabindex="-1" data-act="evoset" data-k="'+s.id+'" data-v="'+n+'" class="'+(n<=v?'on':'')+(n===v?' cur':'')+'"><span>'+n+'</span></button>').join('')+'</div>'+
      '<div class="row" id="sd-'+s.id+'"><span><b>0</b> '+esc(s.lo)+'</span><span><b>10</b> '+esc(s.hi)+'</span></div></div>';
  }).join('');
  const opens=EVO_OPEN.map(o=>'<div class="field"><label for="evo-'+o[0]+'">'+esc(evoQ(o))+'</label><textarea id="evo-'+o[0]+'" data-evoopen="'+o[0]+'" maxlength="'+LIM.evo+'" style="min-height:80px">'+esc(dr[o[0]]!==undefined?dr[o[0]]:(cur[o[0]]||''))+'</textarea></div>').join('');
  const have=EVO_TIMES.filter(x=>e[x[0]]);
  let bars='';
  if(have.length){bars='<div class="card"><span class="label">Le chemin</span>'+evoBars()+'<p class="hint">Chaque barre va de 0 à 10. Avec le temps, le stress et la solitude devraient baisser, alors que la compétence, le regard et la confiance devraient monter. Tout ce qui bouge, c’est grâce à vous.</p></div>';}
  return '<main id="main" tabindex="-1" class="view"><div><span class="label">'+(t==='t1'?'Le questionnaire de départ':t==='t2'?'Le point à trois mois':'Le bilan à six mois')+'</span><h1 class="t1">Mon évolution</h1><p class="sub">Vous faites le point trois fois en six mois, au départ, à mi-parcours et au bilan. Il y a cinq échelles de 0 à 10 et deux questions à chaque fois. Il n’y a pas de bonne réponse, seulement la vôtre aujourd’hui.</p></div>'+chips+bars+
    '<div class="card"><p class="hint">Pour chaque ligne, faites glisser le rond ou touchez un chiffre.</p>'+scales+opens+'<button type="button" class="btn primary" data-act="evosave" style="align-self:flex-start">'+I.check+'Enregistrer ce point</button></div></main>';
}
/* ---------- photolangage ---------- */
/* De vraies photos. On choisit d'abord (toutes les photos, à la même taille), puis la photo choisie s'affiche en grand, avec le champ pour écrire.
   Le choix est enregistré par le nom de la photo. Un ancien choix (le numéro d'un pictogramme) retrouve la photo la plus proche. */
const PHOTO_DIR=SITE?RACINE+'img/photos/':'https://parent-ecoute.ch/img/photos/';
function photoRec(){
  const p=D().photo||{};let id=p.id;
  if(!id&&typeof p.i==='number')id=PHOTOS_AVANT[p.i];
  const x=id?PHOTOS.find(y=>y[0]===id):null;
  return {id:x?x[0]:null,x:x,text:p.text||'',date:p.date||''};
}
/* L'ordre des photos change à chaque visite, pour que les premières ne soient pas toujours les plus choisies.
   Il reste le même tant qu'on ne quitte pas l'écran (choisir une photo, puis revenir en choisir une autre). */
function photoOrdre(){
  if(!state.photoOrder||state.photoOrder.length!==PHOTOS.length){const a=PHOTOS.map((x,i)=>i);for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}state.photoOrder=a;}
  return state.photoOrder.map(i=>PHOTOS[i]);
}
function viewPhoto(){
  const p=photoRec();const grand=!!p.id&&!state.photoPick;
  if(grand){
    const txt=state.pdraft!==null&&state.pdraft!==undefined?state.pdraft:p.text;
    return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Photolangage</h1><p class="sub">Prenez le temps de la regarder. Puis écrivez ce qu’elle évoque, et pourquoi vous l’avez choisie. Une image dit souvent ce que les mots n’osent pas.</p></div>'+
      '<figure class="pstage"><img src="'+PHOTO_DIR+p.id+'-g.webp" alt="'+esc(p.x[2])+'" width="1120" height="840" decoding="async" style="background-image:url('+PHOTO_DIR+p.id+'.webp)"><figcaption>'+esc(p.x[1])+'</figcaption></figure>'+
      '<div class="card"><div class="field"><label for="ptext">Ce qu’elle évoque pour moi</label><textarea id="ptext" maxlength="'+LIM.photo+'" style="min-height:120px">'+esc(txt)+'</textarea></div><div class="quick"><button type="button" class="btn primary" data-act="photosave">'+I.check+'Garder</button><button type="button" class="btn" data-act="photoback">'+I.image+'Choisir une autre photo</button></div>'+(p.date?'<p class="hint">Choisie le '+esc(fmtDate(p.date))+'. Vous pourrez refaire l’exercice au bilan et comparer.</p>':'')+'</div></main>';
  }
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Photolangage</h1><p class="sub">Voici quarante-huit photos. Choisissez celle qui dit le mieux votre vécu aujourd’hui, sans trop réfléchir. Vous écrirez ensuite ce qu’elle évoque pour vous. Leur ordre change à chaque visite.</p></div>'+
    '<div class="photos" role="group" aria-label="Photos du photolangage">'+photoOrdre().map(x=>'<button type="button" data-act="photopick" data-id="'+x[0]+'" aria-pressed="'+(p.id===x[0])+'"><span>'+esc(x[1])+'</span><img src="'+PHOTO_DIR+x[0]+'.webp" alt="'+esc(x[2])+'" width="400" height="300" loading="lazy" decoding="async"></button>').join('')+'</div></main>';
}
