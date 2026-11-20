/* ====================================================================
   Le premier geste, les adresses, le partage et la deuxième visite (18 novembre 2026).
   La scène qui guide ce fichier : il est 21 h 40, un parent ouvre le site sur son téléphone après une journée difficile.
   Il a 2 minutes et peu d'énergie. Le premier écran lui demande de quoi il a besoin, et chaque réponse tient en un geste.
   ==================================================================== */

/* ---------- le moment de la journée, en mots ---------- */
const MOMENTS=['matin','jour','soir','nuit'];
const SALUT={matin:'Bonjour.',jour:'Bonjour.',soir:'Bonsoir.',nuit:'Il est tard.'};
const BESOIN={matin:'De quoi auriez-vous besoin ce matin ?',jour:'De quoi auriez-vous besoin aujourd’hui ?',soir:'De quoi auriez-vous besoin ce soir ?',nuit:'De quoi auriez-vous besoin, là, maintenant ?'};
/* La question, écrite pour l'écran : « auriez-vous » ne se coupe pas au trait d'union, et seule la fin dépend de l'heure. */
const BESOIN_FIN={matin:' ce matin ?',jour:' aujourd’hui ?',soir:' ce soir ?',nuit:', là, maintenant ?'};
function besoinHtml(m,variantes){return 'De quoi <span class="nb">auriez-vous</span> besoin<span'+(variantes?heureAttr(BESOIN_FIN):'')+'>'+esc(BESOIN_FIN[m])+'</span>';}
/* Une espace insécable garde « ce soir » ou « cette nuit » sur la même ligne. */
const PISTE_T={matin:'Trouver une idée pour ce\u00a0matin',jour:'Trouver une idée pour aujourd’hui',soir:'Trouver une idée pour ce\u00a0soir',nuit:'Trouver une idée pour cette\u00a0nuit'};
/* L'accueil est écrit à l'avance dans la page, à une heure qui n'est pas celle du visiteur : chaque mot qui dépend de l'heure
   porte ses 4 variantes, et un petit script de la page choisit la bonne avant le premier affichage (voir INLINE_HEURE dans build_site.py). */
function heureAttr(o){return MOMENTS.map(m=>' data-'+m+'="'+esc(o[m])+'"').join('');}

/* ---------- les pistes du moment : quelles situations proposer d'abord ---------- */
/* Sans âge choisi, les 4 propositions parlent à tous : une situation avec un enfant (e), une avec un ado (a), une avec un adulte (g),
   et une pour le parent lui-même (v). Si le parent a dit l'âge de son enfant en personnalisant son espace, celle de cet âge passe devant. */
const PISTE_MIXTE={
  matin:{e:'refus',a:'ado',g:'grandir',v:'epuise'},
  jour:{e:'crise',a:'ado',g:'grandir',v:'regard'},
  soir:{e:'sommeil',a:'ado',g:'loin',v:'epuise'},
  nuit:{e:'sommeil',a:'ado',g:'loin',v:'epuise'}
};
/* Avec un âge choisi, 4 situations de cet âge. Pour un ado ou un adulte, la fiche propre à cet âge vient toujours en premier. */
const PISTE_PAR_AGE={
  e:{matin:['refus','transitions','ecole','repas'],jour:['crise','transitions','repas','dehors'],soir:['sommeil','crise','refus','ecrans'],nuit:['sommeil','crise','epuise','culpa']},
  a:{matin:['ado','ecole','refus','transitions'],jour:['ado','ecrans','ecole','crise'],soir:['ado','ecrans','sommeil','crise'],nuit:['ado','sommeil','epuise','culpa']},
  g:{matin:['grandir','pros','refus','transitions'],jour:['grandir','pros','loin','regard'],soir:['loin','grandir','crise','epuise'],nuit:['loin','epuise','culpa','deuil']}
};
function pistesDuMoment(m,age,devant){
  let ids=(PISTE_PAR_AGE[age]||{})[m];
  if(!ids){const M=PISTE_MIXTE[m]||PISTE_MIXTE.jour;ids=(M[devant]?[M[devant]]:[]).concat([M.e,M.a,M.g,M.v]);}
  return ids.filter((id,i)=>SITS.some(x=>x.id===id)&&ids.indexOf(id)===i).slice(0,4);
}

/* ---------- les 3 portes : souffler, déposer, trouver une piste ---------- */
/* « grand » : sur l'accueil, chaque porte dit ce qu'on y trouve. Dans « Aujourd'hui », les 3 portes tiennent sur une ligne. */
function portes(grand){
  const m=moment();
  const P=[
    ['souffle',I.wind,'Souffler 2 minutes','Souffler','L’étang respire avec vous.',null],
    ['deposer',I.drop,'Déposer ce qui pèse','Déposer','Vous écrivez, et vous recevez une question et une lumière.',null],
    /* La troisième porte : le parent y trouve une idée qui part de ce qu'il vit, que son enfant soit petit, ado ou adulte. */
    ['piste',I.bulb,PISTE_T[m],'Une idée','Vous choisissez ce que vous vivez, avec un enfant, un ado ou un adulte.',PISTE_T]
  ];
  /* Sur l'accueil, la question invite à écrire : « Déposer ce qui pèse » vient donc en premier. « Souffler 2 minutes » reste à un geste,
     pour la personne qui préfère le silence. Dans « Aujourd'hui », l'ordre des 3 portes ne change pas. */
  if(grand){P[0][4]='En silence, l’étang respire avec vous.';P[1][4]='Vous l’écrivez avec vos mots, pour vous ou pour le dire à quelqu’un.';P.unshift(P.splice(1,1)[0]);}
  return '<div class="portes'+(grand?'':' mini')+'" role="group" aria-label="Ce dont vous avez besoin">'+P.map((p,i)=>
    '<button type="button" class="porte'+(i===0?' un':'')+'" data-act="porte" data-v="'+p[0]+'"'+(grand?'':' aria-label="'+esc(p[2])+'"')+'><span class="ic" aria-hidden="true">'+p[1]+'</span>'+
    (grand?'<span class="tx"><b'+(p[5]?heureAttr(p[5]):'')+'>'+esc(p[2])+'</b><span>'+esc(p[4])+'</span></span><span class="chev" aria-hidden="true">'+I.chev+'</span>':'<b>'+esc(p[3])+'</b>')+'</button>').join('')+'</div>';
}
/* Entrer dans l'espace : il n'y a ni compte ni formulaire. Le premier geste suffit, et la personnalisation vient après, si le parent le souhaite. */
function entrer(via){
  const d=D();if(d.onboarded)return false;
  d.onboarded=true;if(!d.start)d.start=todayIso();d.via=via||'';save();
  try{document.documentElement.classList.add('returning');}catch(e){}
  return true;
}

/* ---------- les adresses : chaque fiche a la sienne, que l'on peut envoyer telle quelle ---------- */
/* Les adresses sont écrites une fois pour toutes : un titre peut changer plus tard sans casser un lien déjà envoyé. */
const FICHE_SLUG={crise:'la-crise',automut:'il-ou-elle-se-fait-mal',refus:'le-refus',transitions:'les-transitions',sommeil:'le-coucher-et-la-nuit',repas:'les-repas',parole:'communiquer-sans-les-mots',dehors:'les-sorties',regard:'le-regard-des-autres',ecole:'l-ecole',fratrie:'les-freres-et-soeurs',ecrans:'les-ecrans',ado:'l-adolescence-et-le-corps',annonce:'on-vient-d-apprendre',culpa:'la-culpabilite',epuise:'je-n-en-peux-plus',couple:'le-couple',aide:'demander-de-l-aide',grandir:'le-passage-a-l-age-adulte',loin:'quand-il-ou-elle-vit-ailleurs',pros:'parler-aux-professionnels',deuil:'l-enfant-qu-on-avait-imagine',relais:'confier-son-enfant-a-un-proche'};
const SLUG_FICHE={};Object.keys(FICHE_SLUG).forEach(k=>{SLUG_FICHE[FICHE_SLUG[k]]=k;});
function ficheUrl(id,complet){return (complet?PUBLIC:RACINE)+'fiches/'+FICHE_SLUG[id]+'/';}
/* La phrase d'aperçu d'une fiche, celle qui s'affiche quand on envoie le lien : le début de « Ce qui se passe ». */
function ficheDesc(s){
  const ph=String(s.comp).match(/[^.!?]+[.!?]+/g)||[String(s.comp)];let out='';
  for(const p of ph){const t=p.trim();if(out&&(out.length>=110||(out+' '+t).length>190))break;out=out?out+' '+t:t;}
  return out;
}
const LISTE_DESC='Le coucher, les crises, l’école, les écrans, le passage à l’âge adulte ou la vie en institution. '+SITS.length+' situations de la vraie vie, avec des pistes venues du terrain et toujours un mot pour vous.';
if(PRE){try{globalThis.__PEPE_PRERENDER__({fiches:SITS.map(s=>({id:s.id,slug:FICHE_SLUG[s.id],t:s.t,s:s.s,ages:liste(s.ages.map((a,i)=>i?AGES[a].toLowerCase():AGES[a])),desc:ficheDesc(s)})),listeDesc:LISTE_DESC});}catch(e){}}
/* Lire l'adresse : quelle fiche, ou quel écran public, demande-t-elle ? */
const VUES_HASH={'#formules':'plans','#offres':'plans','#apercu':'apercu','#avec-antonio':'plans','#relais':'relais'};
function routeDe(){
  if(!SITE)return null;
  let p='';try{p=decodeURIComponent(location.pathname||'');}catch(e){p=location.pathname||'';}
  if(RACINE&&p.indexOf(RACINE)===0)p=p.slice(RACINE.length);else return location.hash===STORY_HASH?{v:'about'}:(VUES_HASH[location.hash]?{v:VUES_HASH[location.hash]}:null);
  p=p.replace(/index\.html$/,'');
  const m=p.match(/^fiches\/([a-z0-9-]+)\/?$/);
  if(m&&SLUG_FICHE[m[1]])return {v:'sit',sit:SLUG_FICHE[m[1]]};
  if(/^fiches\/?$/.test(p))return {v:'kit',kit:'sits'};
  /* L'outil « Passer le relais » a son adresse. Avec #f=…, elle porte une fiche que quelqu'un a envoyée. */
  if(/^relais\/?$/.test(p))return {v:'relais',re:/^#f=/.test(location.hash)?'lu':'accueil'};
  if(/^transmettre\/?$/.test(p))return {v:'transmettre'};
  {const cad=/^#cadeau-(parcours|relais)$/.exec(location.hash||'');if(cad)return {v:'commande',cf:cad[1],ck:'activer'};}
  if(location.hash==='#offrir')return {v:'commande',cf:'parcours',ck:'cadeau'};
  if(location.hash===STORY_HASH)return {v:'about'};
  if(location.hash==='#accueil')return {v:'intro'};
  /* L'adresse …/#film ouvre l'accueil, puis le lecteur du film (version d'essai). */
  if(FILM_ON&&location.hash===FILM_HASH)return {v:'intro'};
  if(VUES_HASH[location.hash])return {v:VUES_HASH[location.hash]};
  return null;
}
/* L'adresse de l'écran affiché. Seuls les écrans publics ont la leur : une fiche, la liste des situations et « Mon histoire ».
   Tout le reste, qui appartient au parent, garde l'adresse de l'espace. */
function urlDe(){
  if(state.view==='sit'&&FICHE_SLUG[state.sit])return ficheUrl(state.sit);
  if(state.view==='kit'&&state.kit==='sits')return RACINE+'fiches/';
  if(state.view==='about')return RACINE+STORY_HASH;
  if(state.view==='plans')return RACINE+'#formules';
  if(state.view==='apercu')return RACINE+'#apercu';
  if(state.view==='relais')return RACINE+'relais/'+(state.rl.e==='lu'&&state.rl.h?'#f='+state.rl.h:'');
  if(state.view==='transmettre')return RACINE+'transmettre/';
  /* La vitrine d'un parent déjà entré a son adresse. Sans elle, l'adresse du site ouvre son espace, et c'est ce qu'il attend. */
  if(state.view==='intro'&&D().onboarded)return RACINE+'#accueil';
  return RACINE;
}
function titreDe(){
  if(state.view==='about')return 'Mon histoire, par Antonio Company, créateur de Parent écouté, parent éclairé';
  if(state.view==='plans')return 'Les 3 offres de Parent écouté, parent éclairé';
  if(state.view==='apercu')return 'Essayer une étape du parcours, en 3 minutes';
  if(state.view==='relais')return state.rl.e==='lu'?'Une fiche de relais, écrite par une famille':'Passer le relais, une page pour la personne qui garde votre enfant';
  if(state.view==='transmettre')return 'Une page à transmettre à une famille, Parent écouté, parent éclairé';
  if(state.view==='sit'){const s=SITS.find(x=>x.id===state.sit);if(s)return s.t+', une fiche de Parent écouté, parent éclairé';}
  if(state.view==='kit'&&state.kit==='sits'&&!D().onboarded)return SITS.length+' situations de la vraie vie, avec des pistes pour les parents';
  return TITLE0;
}
/* ---------- le bouton Retour du téléphone : chaque écran est une page de l'historique ---------- */
const HIST={ok:false,i:0,unefois:false};
function navSnap(){return {v:state.view,sit:state.sit,exo:state.exo,step:state.step,kit:state.kit,tool:state.tool,letter:state.letter,et:state.evoTime,p:state.piste?1:0,ap:state.ap.k,cf:state.cmd.f,ck:state.cmd.k,cm:state.cmd.m,re:state.rl.e,rp:state.rl.p,ri:state.rl.id,rr:state.rl.r,rx:state.rl.ex,rh:state.rl.e==='lu'?state.rl.h:'',dd:state.view==='deposer'&&state.dire?state.dire.id:''};}
function navApply(s){
  state.view=s.v||'today';state.sit=s.sit||null;state.exo=s.exo||null;state.step=(typeof s.step==='number')?s.step:null;state.kit=s.kit||'sits';state.tool=s.tool||'timer';
  state.letter=(typeof s.letter==='number')?s.letter:null;state.evoTime=s.et||'t1';state.piste=!!s.p&&state.view==='kit';
  state.sheet=null;state.confirmReset=false;state.photoPick=false;state.photoOrder=null;state.pdraft=null;state.prev=null;state.lien='';
  state.ap.k=Math.max(0,Math.min(3,Number(s.ap)||0));state.cmd={f:s.cf||'',m:s.cm==='six'?'six':'une',k:s.ck||'recap',de:''};
  if(state.view==='commande'&&!PRODUITS[state.cmd.f]&&state.cmd.k!=='retrouver')state.view='plans';
  /* « Passer le relais » : l'écran, le pas, la fiche et la réunion en cours. Une fiche reçue se relit dans l'adresse. */
  {const r=state.rl;r.e=s.re||'accueil';r.p=Number(s.rp)||0;r.id=s.ri||null;r.r=s.rr||null;if(s.rx&&RL_EX[s.rx])r.ex=s.rx;r.sec='';r.mots=false;r.attente=null;r.foc='';
    if(r.e==='lu'){if(!rlDuHash()){r.h=s.rh||'';r.lu=r.h?rlDecode(r.h):null;r.e='lu';}}
    if(['prep','apercu','envoi','retour'].includes(r.e)&&!rlFiche(r.id))r.e='accueil';
    if(['reunion','feuille'].includes(r.e)&&!rlReu(r.r))r.e='accueil';}
  if(state.view==='apercu'&&state.ap.k>=2&&!noteDe('reguler'))state.ap.k=1;
  /* Un écran qui n'a plus de sens (une étape pas encore ouverte, une fiche inconnue) ramène à « Aujourd'hui ». */
  if(state.view==='step'&&(state.step===null||!D().onboarded||stepLocked(state.step)))state.view='parcours';
  if(state.view==='sit'&&!SITS.some(x=>x.id===state.sit))state.view='kit';
  if(state.view==='exo'&&!EXOS.some(x=>x.id===state.exo))state.view='kit';
  if(state.view==='souffle')state.souffle.k=state.souffle.k==='fini'?'fini':'pret';
  /* « J'aimerais le dire à quelqu'un » se retrouve avec le dépôt auquel il se rapporte. Sans lui, on revient à l'écran pour écrire. */
  state.dire=(state.view==='deposer'&&s.dd)?direOuvre(s.dd):null;
}
function histEtat(){return {pepe:1,i:HIST.i,s:navSnap(),y:0,t:Date.now()};}
/* L'endroit où l'on était, gardé le temps de la visite dans cet onglet : l'écran, et jusqu'où l'on avait fait défiler. */
const PLACE=KEY+'-place';
function histQuitte(){
  if(!SITE)return;
  try{sessionStorage.setItem(PLACE,JSON.stringify({s:navSnap(),y:Math.round(window.scrollY||window.pageYOffset||0),t:Date.now()}));}catch(e){}
}
function placeOte(){try{sessionStorage.removeItem(PLACE);}catch(e){}}
/* Le texte d'un dépôt en cours d'écriture est gardé le temps de la visite, dans cet onglet seulement : si le téléphone recharge la page, il est toujours là. */
const BROUILLON=KEY+'-brouillon';let brouillonT=null;
function brouillonGarde(){clearTimeout(brouillonT);brouillonT=setTimeout(()=>{try{if(state.draft)sessionStorage.setItem(BROUILLON,state.draft);else sessionStorage.removeItem(BROUILLON);}catch(e){}},300);}
function brouillonLit(){try{const b=sessionStorage.getItem(BROUILLON);if(b&&!state.draft)state.draft=String(b).slice(0,LIM.draft);}catch(e){}}
function brouillonOte(){clearTimeout(brouillonT);try{sessionStorage.removeItem(BROUILLON);}catch(e){}}
function histInit(){
  HIST.ok=!!(SITE&&window.history&&history.pushState&&history.replaceState);if(!HIST.ok)return;
  try{history.scrollRestoration='manual';}catch(e){}
  try{const st=history.state;HIST.i=(st&&st.pepe&&typeof st.i==='number')?st.i:0;history.replaceState(histEtat(),'',urlDe());}catch(e){HIST.ok=false;}
}
/* Un nouvel écran : on retient d'abord où l'on en était sur celui qu'on quitte, puis on ajoute une page à l'historique. */
function histPush(remplace){
  if(!HIST.ok)return;
  try{
    if(remplace){history.replaceState(histEtat(),'',urlDe());return;}
    /* Le lecteur du film avait ajouté sa propre page : l'écran qui le suit prend sa place au lieu d'en ajouter une (voir filmSouffle). */
    if(HIST.unefois){HIST.unefois=false;HIST.i++;history.replaceState(histEtat(),'',urlDe());return;}
    const cur=history.state;
    if(cur&&cur.pepe){cur.y=Math.round(window.scrollY||window.pageYOffset||0);cur.t=Date.now();history.replaceState(cur,'');}
    HIST.i++;history.pushState(histEtat(),'',urlDe());
  }catch(e){}
}
/* Après chaque rendu : le titre de l'onglet suit l'écran, et l'adresse reste toujours celle de l'écran affiché. */
function titreSync(){
  try{const t=titreDe();if(document.title!==t)document.title=t;}catch(e){}
  if(!HIST.ok)return;
  try{const veut=urlDe(),a=location.pathname+location.hash;if(a!==veut&&location.hash!=='#atelier')history.replaceState(histEtat(),'',veut);}catch(e){}
}
function histRetour(e){
  /* Le lecteur du film est ouvert : le bouton Retour le ferme, le son s'arrête, et l'accueil reste où il était. */
  if(filmRetour())return;
  if(!HIST.ok||location.hash==='#atelier')return;
  const st=e&&e.state;souffleStop();stopTimer();
  /* L'adresse …/#film, tapée alors que la page est déjà là : après l'accueil, le lecteur s'ouvre et attend le geste du parent. */
  const film=FILM_ON&&!(st&&st.pepe)&&location.hash===FILM_HASH;
  if(st&&st.pepe&&st.s){HIST.i=st.i||0;navApply(st.s);}
  else{const r=routeDe()||{};HIST.i=0;navApply({v:r.v||'today',sit:r.sit,kit:r.kit,re:r.re,cf:r.cf,ck:r.ck});try{history.replaceState(histEtat(),'',urlDe());}catch(x){}}
  const y=(st&&st.y)||0;
  /* « apres » : un message à dire une fois revenu sur l'écran d'avant (par exemple après avoir enregistré le point de départ). */
  const dire=state.apres||'';state.apres='';
  fxGo(()=>{render();window.scrollTo(0,y);if(dire)toast(dire);if(film)filmOuvre(false);},'back');
}

/* ---------- après un dépôt : la réponse vient sous les yeux ---------- */
/* La question et la lumière s'affichent sous la zone d'écriture. Sur un téléphone, le bas de l'écran les cacherait.
   La page descend donc d'elle-même jusqu'à elles, doucement, ou d'un coup si le téléphone demande moins d'animations. */
function montreReponse(){
  const el=document.querySelector('.emporte')||document.querySelector('.mirror.surface');if(!el||!el.getBoundingClientRect)return;
  const barre=document.querySelector('header.bar');const haut=barre?Math.max(0,barre.getBoundingClientRect().bottom):0;
  const r=el.getBoundingClientRect();
  if(r.top>=haut&&r.bottom<=window.innerHeight-96)return;   /* déjà entièrement à l'écran : la page ne bouge pas */
  const y=Math.max(0,Math.round(r.top+window.scrollY-haut-14));
  try{window.scrollTo({top:y,behavior:fxOn()?'smooth':'auto'});}catch(e){window.scrollTo(0,y);}
}

/* ---------- envoyer une fiche ---------- */
/* Le lien envoyé est l'adresse publique de la fiche, et rien d'autre : ni le prénom, ni les notes, ni l'endroit d'où l'on vient. */
async function partager(id){
  const s=SITS.find(x=>x.id===id);if(!s||!SITE)return;
  const url=ficheUrl(id,true);
  if(navigator.share){
    try{await navigator.share({title:s.t,url:url});return;}
    catch(e){if(e&&e.name==='AbortError')return;}
  }
  try{await navigator.clipboard.writeText(url);state.lien='';toast('Le lien de cette fiche est copié. Vous pouvez le coller dans un message.');return;}catch(e){}
  /* Ni partage ni presse-papiers : le lien s'affiche, prêt à être copié à la main. */
  state.lien=url;render();
  const c=document.getElementById('lien');if(c){try{c.focus();c.select();}catch(e){}}
}

/* ---------- ce que le parent a ouvert dernièrement, pour le rouvrir sans chercher ---------- */
const OUTILS_NOMS={timer:'Le minuteur visuel',ft:'D’abord, ensuite',routine:'La routine du soir',abc:'Le journal',phr:'Mes phrases qui marchent'};
function noteRecent(k,id){
  const d=D();if(!d.onboarded)return;
  if(!Array.isArray(d.recents))d.recents=[];
  d.recents=d.recents.filter(x=>!(x.k===k&&x.id===id));
  d.recents.unshift({k:k,id:id,d:todayIso()});if(d.recents.length>6)d.recents.length=6;
  save();
}
function recentsHtml(){
  const L=(D().recents||[]).map(x=>{
    if(x.k==='sit'){const s=SITS.find(y=>y.id===x.id);return s?'<button type="button" class="chip" data-act="sit" data-id="'+s.id+'"><span aria-hidden="true">'+s.e+'</span> '+esc(s.t)+'</button>':'';}
    if(x.k==='exo'){const e=EXOS.find(y=>y.id===x.id);return e?'<button type="button" class="chip" data-act="exo" data-id="'+e.id+'">'+esc(e.id==='breath'?'Souffler 2 minutes':e.t)+'</button>':'';}
    if(x.k==='tool'&&OUTILS_NOMS[x.id])return '<button type="button" class="chip" data-act="rouvrir-outil" data-v="'+x.id+'">'+esc(OUTILS_NOMS[x.id])+'</button>';
    return '';
  }).filter(Boolean).slice(0,3);
  return L.length?'<div class="rouvrir"><span class="label" id="rouvrir-l">Rouvrir</span><div class="chips" role="group" aria-labelledby="rouvrir-l">'+L.join('')+'</div></div>':'';
}

/* ---------- après un dépôt : une piste, d'après les mots du parent ---------- */
/* L'application repère quelques mots simples. Elle ne lit pas le texte au sens où une personne le lirait, et rien ne quitte l'appareil.
   D'abord ce que vit le parent lui-même, ensuite la situation avec l'enfant. Deux fiches au plus, et aucune si rien n'est repéré. */
const FIN_MOT='(?![a-zà-ÿ])';
const PISTE_MOTS=[
  ['culpa','m[’\']en veux|coupable|culpabil|mauvaise? (mère|maman|père|papa|parent)|j[’\']ai honte'],
  ['epuise','épuis|(^|[^a-zà-ÿ])epuis|à bout'+FIN_MOT+'|n[’\']en peux plus|je craque|j[’\']ai craqué|crev[ée]e?'+FIN_MOT+'|vidée?'+FIN_MOT+'|plus la force'],
  ['aide','toute? seule?'+FIN_MOT+'|personne (ne|pour) m[’\']aide|besoin d[’\']aide|un peu de répit'],
  ['couple','mon mari'+FIN_MOT+'|ma femme|mon conjoint|ma conjointe|mon compagnon|ma compagne|notre couple|on se dispute'],
  ['sommeil','dor[mt]|endor|coucher|se relève|se réveille|réveils|cauchemar|insomni'],
  ['crise','crise|hurl|se roule|se jette|casse tout|a tout cassé|explos'],
  ['automut','se tape|se mord|se griffe|se fait mal|se cogne'],
  ['ecrans','écran|ecran|tablette|console'+FIN_MOT+'|jeux? vidéo|youtube|tiktok|son téléphone'],
  ['ecole','école|ecole|devoirs|maîtresse|maître'+FIN_MOT+'|enseignant|sa classe'],
  ['repas','repas|ne mange|mange rien|son assiette'],
  ['refus','refuse|ne veut pas|ne veut rien|dit non à tout'],
  ['fratrie','son frère|sa sœur|sa soeur|ses frères|ses sœurs|ses soeurs|fratrie|jalou'],
  ['ado','(mon|ma|notre|un|une|cet|cette) ado'+FIN_MOT+'|adolescen|puberté'],
  ['loin','en institution|l[’\']institution|son foyer|en foyer|dans un foyer|internat|son appartement|vit ailleurs'],
  ['grandir','majorité|majeure?'+FIN_MOT+'|curatelle|curateur|curatrice|ses 18 ans|a 18 ans|l[’\']âge adulte|atelier protégé'],
  ['pros','médecin|pédiatre|thérapeute|rendez-vous|réseau'+FIN_MOT+'|éducatrice|éducateur|logopédiste'],
  ['annonce','diagnostic|on vient d[’\']apprendre'],
  ['regard','regard des|les gens'+FIN_MOT+'|leurs remarques|une remarque|me jugent|m[’\']a jugée?'],
  ['dehors','magasin|supermarché|restaurant|dans le bus']
].map(p=>[p[0],new RegExp('('+p[1]+')','i')]);
function pistesDepot(text){
  const out=[];const moi=['culpa','epuise','aide','couple'];let unMoi=false,unEnfant=false;
  PISTE_MOTS.forEach(p=>{
    if(out.length>=2||!p[1].test(text))return;
    const estMoi=moi.indexOf(p[0])>=0;
    if(estMoi&&unMoi)return;if(!estMoi&&unEnfant)return;
    if(estMoi)unMoi=true;else unEnfant=true;
    out.push(p[0]);
  });
  return out;
}
function pistesDepotHtml(x){
  if(x.risk||!Array.isArray(x.pistes)||!x.pistes.length)return '';
  const L=x.pistes.map(id=>SITS.find(s=>s.id===id)).filter(Boolean);if(!L.length)return '';
  return '<div class="pistes-depot"><span class="label">'+(L.length>1?'Deux pistes qui peuvent':'Une piste qui peut')+' vous aider, proposée'+(L.length>1?'s':'')+' par l’application d’après vos mots</span><div class="liste">'+L.map(sitRow).join('')+'</div></div>';
}

/* ---------- déposer : un écran pour écrire, et rien d'autre ---------- */
function viewDeposer(){
  const d=D();const left=depotsLeft();const site=state.sample===false;
  if(site&&state.dire)return viewDire();
  if(site)return '<main id="main" tabindex="-1" class="view deposer"><div class="dep-tete"><h1 class="dep-nom">Déposer ce qui pèse</h1><label class="dep-q" for="draft">'+DEP_Q+'</label><p class="sub">'+DEP_SEUL+'</p></div>'+
    depotBox()+
    (d.depots.length?'<button type="button" class="sit" data-act="go" data-view="depots"><span class="e">'+I.drop+'</span><span class="tx"><b>Mes dépôts</b><span>'+d.depots.length+' dépôt'+(d.depots.length>1?'s':'')+' gardé'+(d.depots.length>1?'s':'')+' sur cet appareil</span></span><span class="chev">'+I.chev+'</span></button>':'')+
    '</main>';
  return '<main id="main" tabindex="-1" class="view deposer"><div><h1 class="t1">Déposer ce qui pèse</h1><p class="sub">'+(left===0?'Vous pouvez toujours écrire ce qui pèse, puis l’effacer. Rien n’est gardé.':'Écrivez comme ça vient, sans donner de prénom. Vous recevez en retour une question et une lumière.')+'</p></div>'+
    depotBox()+
    (left===0?'<button type="button" class="sit" data-act="exo" data-id="deposer"><span class="e">'+I.wind+'</span><span class="tx"><b>Écrire, puis effacer</b><span>Sans réponse, et sans rien garder</span></span><span class="chev">'+I.chev+'</span></button>':'')+
    (d.depots.length?'<button type="button" class="sit" data-act="go" data-view="depots"><span class="e">'+I.drop+'</span><span class="tx"><b>Mes dépôts</b><span>'+d.depots.length+' dépôt'+(d.depots.length>1?'s':'')+' gardé'+(d.depots.length>1?'s':'')+' sur cet appareil</span></span><span class="chev">'+I.chev+'</span></button>':'')+
    '</main>';
}

/* ---------- « J'aimerais le dire à quelqu'un » ----------
   Le parent a écrit. S'il veut être entendu par un proche ou lors d'une réunion, l'espace lui propose une première phrase.
   Il peut la changer, en choisir une autre, la copier avec ses mots à la suite, ou tout laisser et garder ses mots pour lui.
   Ses mots ne sont jamais réécrits : ils sont montrés tels quels, et ajoutés tels quels s'il le veut.
   Les débuts de phrase d'une réunion sont ceux de l'outil « Passer le relais » (« Je perds mes mots »). Rien n'est envoyé : copier est son geste. */
const DIRE_A=[['proche','À un proche'],['reunion','Lors d’une réunion']];
const DIRE_PROCHE=['J’aimerais te dire comment s’est passée ma journée. Je ne te demande pas de solution, j’ai besoin que tu m’écoutes.','J’ai besoin de te parler de quelque chose qui me pèse.','As-tu 5 minutes ? J’aimerais te raconter ma journée.','Je n’attends pas de conseil. J’ai besoin que quelqu’un sache ce que je vis.'];
const DIRE_REUNION='Avant que nous commencions, j’aimerais vous dire quelque chose d’important pour moi.';
const DIRE_LIM=600;
function direAmorces(a){return a==='reunion'?[DIRE_REUNION].concat(RL_MOTS_ECRIRE.map(m=>m.replace('{P}','mon enfant')+' ')):DIRE_PROCHE;}
function direDepot(id){return D().depots.find(x=>x.id===id)||null;}
/* Ouvrir l'étape pour un dépôt : on reprend ce que le parent avait préparé, s'il y était déjà venu. */
function direOuvre(id){
  const x=direDepot(id);if(!x)return null;const g=x.dire||{};const a=g.a==='reunion'?'reunion':'proche';
  return {id:id,a:a,t:typeof g.t==='string'?g.t:direAmorces(a)[(x.risk&&a==='proche')?1:0],j:g.j!==false,mots:false,copie:false};
}
function direGarde(){const s=state.dire;if(!s)return;const x=direDepot(s.id);if(!x)return;x.dire={a:s.a,t:clean(s.t,DIRE_LIM),j:!!s.j};save();}
function direTexte(){const s=state.dire;if(!s)return '';const x=direDepot(s.id);const a=clean(s.t,DIRE_LIM);return (s.j&&x?[a,x.text]:[a]).filter(Boolean).join('\n\n');}
/* Après le choix d'une autre première phrase : le curseur se pose à la fin, pour que le parent la continue avec ses mots. */
function direApres(){if(!state.direFoc)return;state.direFoc=false;try{const el=document.getElementById('amorce');if(el){el.focus();const n=el.value.length;el.setSelectionRange(n,n);}}catch(e){}}
function viewDire(){
  const s=state.dire,x=direDepot(s.id);if(!x){state.dire=null;return viewDeposer();}
  const L=direAmorces(s.a);
  const mots=s.mots?'<div class="dire-modeles" role="group" aria-label="D’autres façons de commencer"><span class="label">Commencer par</span>'+L.map((m,i)=>'<button type="button" class="dire-m" data-act="dire" data-k="mot" data-i="'+i+'">'+esc(m.trim())+(/[.?!]$/.test(m.trim())?'':'…')+'</button>').join('')+'</div>':'<button type="button" class="btn rl-perds" data-act="dire" data-k="mots">'+I.bulb+'Je perds mes mots</button>';
  const pret=s.copie?'<section class="emporte dire-pret" aria-labelledby="dire-pret-t"><h2 id="dire-pret-t">Ce que vous emportez</h2><p class="dire-ok" role="status">'+(s.copie==='main'?'Votre texte est prêt, juste en dessous. Vous pouvez le sélectionner pour le copier, ou le relire avant de le dire à voix haute.':'C’est copié. Vous pouvez le coller dans un message, ou le relire avant de le dire à voix haute.')+'</p><p class="em-texte" id="dire-texte">'+esc(direTexte())+'</p>'+
    '<div class="em-suite"><button type="button" class="btn primary" data-act="dfin">'+I.check+'J’ai fini pour aujourd’hui</button></div></section>':'';
  /* La seule suite proposée mène à un outil que le parent garde et réutilise. Elle ne parle pas de prix : l'outil se présente lui-même. */
  const outil=(s.a==='reunion'&&s.copie)?'<div class="vers-apercu vers-relais"><h2>Arriver à la réunion avec vos mots</h2><p>L’outil « Passer le relais » vous aide aussi à préparer un rendez-vous, avec vos 3 priorités sous les yeux et un bouton « Je perds mes mots ». Vos derniers mots déposés y sont proposés, phrase par phrase.</p><button type="button" class="btn" data-act="rl" data-k="ouvre">'+I.hand+'Découvrir l’outil</button></div>':'';
  return '<main id="main" tabindex="-1" class="view deposer dire"><div><h1 class="t1">J’aimerais le dire à quelqu’un</h1><p class="sub">Voici une première phrase pour commencer. Vous pouvez la changer, la copier ou la laisser de côté.</p></div>'+
    (x.risk?'<div class="mirror dire-aide">'+riskHtml('q')+'</div>':'')+
    '<div class="card dire-c">'+
    '<span class="label" id="dire-a-l">À qui aimeriez-vous le dire ?</span><div class="chips" role="group" aria-labelledby="dire-a-l">'+DIRE_A.map(a=>'<button type="button" class="chip" data-act="dire" data-k="a" data-v="'+a[0]+'" aria-pressed="'+(s.a===a[0])+'">'+a[1]+'</button>').join('')+'</div>'+
    '<div class="field"><label for="amorce">Pour commencer</label><textarea id="amorce" rows="4" maxlength="'+DIRE_LIM+'">'+esc(s.t)+'</textarea></div>'+mots+
    '<div class="em-mots"><span class="label" id="dire-mots-l">Vos mots, tels que vous les avez écrits</span>'+motsCadre(x,'dire-mots-l')+
    '<button type="button" class="chip dire-joint" data-act="dire" data-k="joint" aria-pressed="'+(!!s.j)+'">'+I.check+'Ajouter mes mots à la suite</button></div>'+
    '<div class="dire-b"><button type="button" class="btn primary" data-act="dire" data-k="copie">Copier</button><button type="button" class="btn ghost" data-act="dire" data-k="laisse">Finalement, je garde mes mots pour moi</button></div>'+
    '</div>'+pret+outil+'</main>';
}

/* ---------- souffler 2 minutes : l'étang respire avec le parent ---------- */
/* Trois respirations au choix, et chacune dure environ 2 minutes, comme le dit le bouton.
   « Le souffle régulier » : 5 secondes pour inspirer, 5 secondes pour souffler.
   « L'expiration prolongée » : 4 secondes pour inspirer, 6 secondes pour souffler. C'est celle d'un parent qui n'a rien choisi.
   « À mon rythme » : le parent règle la durée d'une respiration, de 5 à 14 secondes. Deux cinquièmes servent à inspirer, trois cinquièmes à souffler.
   Un cercle posé sur l'eau s'élargit quand on inspire et se referme quand on expire. Avec les effets visuels, une onde part sur l'étang à chaque expiration.
   Sans les effets (réglage du téléphone ou de « Moi »), le cercle ne bouge pas et seuls les mots changent.

   UN SEUL MINUTAGE. « state.souffle.seq » est la suite des mouvements décidés : chacun dit s'il faut inspirer ou souffler, quand il commence et combien il dure.
   Le cercle, les mots et la musique lisent tous cette même suite. Un mouvement est décidé un peu avant de commencer (« avance »),
   avec le réglage du moment : changer de respiration ou de cadence prend donc effet en douceur, au mouvement suivant, sans rien couper. */
const SOUFFLE={n:12,avant:1400,duree:115,avance:450};
const RESP={
  egal:{t:'Le souffle régulier',s:'Vous inspirez pendant 5 secondes, puis vous soufflez pendant 5 secondes.',p:'Vous inspirez par le nez pendant 5 secondes, puis vous soufflez par la bouche pendant 5 secondes.',in:5,out:5},
  long:{t:'L’expiration prolongée',s:'Vous inspirez pendant 4 secondes, puis vous soufflez plus longtemps, pendant 6 secondes.',p:'Vous inspirez par le nez pendant 4 secondes, puis vous soufflez par la bouche plus longtemps, pendant 6 secondes.',in:4,out:6},
  libre:{t:'À mon rythme',s:'Vous choisissez la cadence, et vous pouvez la ralentir ou l’accélérer.',p:'Vous inspirez par le nez, puis vous soufflez par la bouche un peu plus longtemps, à la cadence que vous avez choisie.'}
};
const RESP_ORDRE=['egal','long','libre'],CAD_MIN=5,CAD_MAX=14,CAD_DEF=8;
const SOUFFLE_CLE='Quand les notes montent, inspirez. Quand elles redescendent, soufflez doucement.';
/* Le choix du parent est gardé sur son appareil avec le reste : il retrouve sa respiration la fois suivante. */
function respReglage(){const r=D().souffle||{};const c=Math.round(Number(r.c));return {m:RESP[r.m]?r.m:'long',c:(c>=CAD_MIN&&c<=CAD_MAX)?c:CAD_DEF};}
function respDurees(){const r=respReglage();if(r.m==='libre')return {m:'libre',in:r.c*.4,out:r.c*.6};return {m:r.m,in:RESP[r.m].in,out:RESP[r.m].out};}
function respGarde(m,c){const r=respReglage();D().souffle={m:RESP[m]?m:r.m,c:c||r.c};save();}
function respCadTxt(c){return 'Une respiration dure '+c+' secondes.';}
/* Ce qui guide les yeux : la goutte quand l'eau est dessinée, 2 cercles sinon, et seulement les mots si le téléphone demande moins de mouvement. */
/* On regarde dès l'écran de préparation si le téléphone sait dessiner l'eau : la phrase dit alors vrai, et la photo est prête quand l'exercice commence. */
function souffleGuide(){if(!fxOn())return 'mots';if(EAU.ok===null)eauInit();return EAU.ok?'goutte':'cercles';}
function respPret(){const r=respReglage(),g=souffleGuide();return RESP[r.m].p+(r.m==='libre'?' '+respCadTxt(r.c):'')+(g==='goutte'?' La goutte vous guide. Elle monte quand vous inspirez, et elle redescend quand vous soufflez.':g==='cercles'?' Les cercles posés sur l’eau vous guident.':' Les mots à l’écran vous guident.');}
/* L'écran reste allumé pendant la respiration, et tant qu'un son de la page joue : sans cela, un téléphone réglé sur 30 secondes
   se verrouille au milieu de l'exercice ou avant la fin de l'instant d'écoute. Dès que c'est fini, le téléphone reprend son réglage. */
let veille=null,veilleP=false;
function veilleVoulue(){return (state.souffle.k==='cours'&&!state.souffle.pz)||SON.etat!=='off';}
function veilleOn(){
  try{
    if(!navigator.wakeLock||veille||veilleP||document.visibilityState!=='visible')return;
    veilleP=true;
    navigator.wakeLock.request('screen').then(v=>{
      veilleP=false;veille=v;
      try{v.addEventListener('release',()=>{if(veille===v)veille=null;});}catch(e){}
      if(!veilleVoulue())veilleOff();
    },()=>{veilleP=false;});
  }catch(e){veilleP=false;}
}
function veilleOff(){const v=veille;veille=null;try{if(v){const p=v.release();if(p&&p.catch)p.catch(()=>{});}}catch(e){}}
function veilleSync(){if(veilleVoulue())veilleOn();else veilleOff();}
function souffleStart(){
  const s=state.souffle;souffleStop();
  const d0=respDurees();
  s.k='cours';s.ph='';s.cyc=-1;s.ix=-1;s.tr=-1;s.e=0;s.t0=performance.now()+SOUFFLE.avant;s.hid=0;s.pz=0;s.pzSon=false;s.fin=0;s.cle=-1;s.choix=false;eauPause(false);
  /* La première inspiration est décidée tout de suite : si le parent écoute l'étang, ses premières notes sont prêtes avant qu'elle commence. */
  s.seq=[{ty:'in',a:s.t0,d:d0.in*1000,c:0,m:d0.m}];
  veilleOn();
}
function souffleStop(){
  const s=state.souffle;if(s.raf){(window.cancelAnimationFrame||clearTimeout)(s.raf);s.raf=0;}
  if(s.k==='cours')s.k='pret';
  s.choix=false;s.pz=0;s.pzSon=false;
  /* La goutte ne retombe pas d'un coup : elle redescend doucement à sa place, puis l'eau redevient calme. */
  eauPause(false);if(EAU.resp)EAU.resp.ret={de:EAU.resp.dy,t:eauNow()};
  veilleSync();
}
/* La pause : tout s'arrête là où on en est, la goutte, les mots, le compte des 2 minutes et la musique. « Reprendre » repart du même point. */
function soufflePause(){
  const s=state.souffle;if(s.k!=='cours')return;
  if(!s.pz){
    s.pz=performance.now();s.pzSon=SON.etat!=='off'&&SON.proprio==='souffle';
    if(s.raf){(window.cancelAnimationFrame||clearTimeout)(s.raf);s.raf=0;}
    if(s.pzSon)sonCoupe(true);
    eauPause(true);veilleSync();
  }else{
    souffleDecale(performance.now()-s.pz);s.pz=0;eauPause(false);veilleOn();
    if(s.pzSon&&SON.voulu){s.pzSon=false;sonSouffle();}
  }
}
/* Décider la suite. Après une inspiration vient une expiration, puis une nouvelle inspiration,
   tant qu'elle commencerait avant 1 minute 55. L'exercice se termine donc toujours à la fin d'une expiration, autour de 2 minutes. */
function souffleSuite(now){
  const s=state.souffle;
  for(let garde=0;garde<6&&!s.fin;garde++){
    const L=s.seq[s.seq.length-1];if(!L)return;
    const fin=L.a+L.d;
    if(fin-now>SOUFFLE.avance)return;
    if(L.ty==='in'){const d=respDurees();s.seq.push({ty:'out',a:fin,d:d.out*1000,c:L.c,m:d.m});}
    else if(fin-s.t0>=SOUFFLE.duree*1000-1)s.fin=fin;
    else{const d=respDurees();s.seq.push({ty:'in',a:fin,d:d.in*1000,c:L.c+1,m:d.m});}
  }
}
/* La page a passé un moment à l'arrière-plan : tout le minutage est décalé d'autant, et la respiration reprend là où elle en était. */
function souffleDecale(dt){const s=state.souffle;s.t0+=dt;if(s.fin)s.fin+=dt;(s.seq||[]).forEach(p=>{p.a+=dt;});}
/* La photo de la goutte suspendue au-dessus de l'étang (866 × 470). La goutte est au milieu, et son pied touche l'eau à 55 % de la hauteur.
   Quand l'eau est dessinée, la goutte de la photo s'élève à l'inspiration et redescend à l'expiration, et 2 ondes s'élargissent sur l'étang.
   Sinon (pas de carte graphique, téléphone qui peine), 2 cercles posés au même endroit s'élargissent à l'expiration : ils tiennent lieu de guide. */
const ETANG={w:866,h:470,x:434/866,y:259/470};
const GOUTTE_H=38;   /* de combien la goutte s'élève, en points de la photo : un peu plus que sa propre hauteur */
function soufflePose(){
  const host=document.querySelector('.souffle .etang');const r=document.querySelector('.souffle .ronds');if(!host||!r||!r.style)return;
  const im=host.querySelector('.etang-photo');const b=host.getBoundingClientRect();if(!im||b.width<40||b.height<40)return;
  let px=.5,py=.5;
  try{const m=String(getComputedStyle(im).objectPosition).match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);if(m){px=m[1]/100;py=m[2]/100;}}catch(e){}
  const k=Math.max(b.width/ETANG.w,b.height/ETANG.h),dw=ETANG.w*k,dh=ETANG.h*k;
  /* Quand la photo est basse (le choix d'une respiration est ouvert), les cercles remontent un peu pour rester sur l'eau visible. */
  const x=(b.width-dw)*px+dw*ETANG.x,y=Math.min((b.height-dh)*py+dh*ETANG.y,b.height*.6);
  /* Le plus grand cercle reste dans l'écran, et il ne remonte pas jusqu'au rivage. */
  const w=Math.max(150,Math.min(b.width*.8,470*k*1.1,560));
  r.style.left=Math.round(x)+'px';r.style.top=Math.round(y)+'px';r.style.width=Math.round(w)+'px';r.style.height=Math.round(w*.27)+'px';
}
/* Sans le dessin de l'eau : à chaque expiration, un cercle de plus part du pied de la goutte et s'éloigne, puis s'efface. */
function souffleOnde(){
  const b=document.querySelector('.souffle .ronds b');if(!b||!b.classList)return;
  b.classList.remove('onde');void b.offsetWidth;b.classList.add('onde');
}
const SOUFFLE_MOT={avant:'Installez-vous',in:'Inspirez',out:'Expirez'};
/* La ligne sous le grand mot. En silence, elle dit comment respirer. Avec le son, elle donne la clé d'écoute pendant les premières respirations,
   puis elle se tait : la musique et ses silences guident le moment. */
function souffleAide(){
  const s=state.souffle,son=SON.proprio==='souffle'?SON.etat:'off',ph=s.ph||'avant';
  if(s.pz)return 'Reprenez quand vous voulez. Tout vous attend là où vous étiez.';
  const g=souffleGuide();
  if(ph==='avant')return son!=='off'?SOUFFLE_CLE:(g==='goutte'?'Posez vos épaules et vos pieds. La goutte va vous guider.':g==='cercles'?'Posez vos épaules et vos pieds. Les cercles vont vous guider.':'Posez vos épaules et vos pieds. Les mots vont vous guider.');
  if(son==='charge')return SOUFFLE_CLE;
  if(son==='on')return s.cyc<=s.cle?SOUFFLE_CLE:'';
  if(ph==='in')return g==='goutte'?'Par le nez, pendant que la goutte monte.':g==='cercles'?'Par le nez, pendant que les cercles se resserrent.':'Par le nez, doucement.';
  return g==='goutte'?'Par la bouche, lentement, pendant qu’elle redescend.':g==='cercles'?'Par la bouche, lentement, pendant que les cercles s’élargissent.':'Par la bouche, lentement.';
}
function souffleMots(){
  const s=state.souffle;if(s.k!=='cours')return;
  const mot=document.getElementById('souffle-mot'),aide=document.getElementById('souffle-aide'),tours=document.querySelector('.souffle .tours');
  const M=s.pz?'En pause':SOUFFLE_MOT[s.ph||'avant'];
  if(mot&&M&&mot.textContent!==M)mot.textContent=M;
  if(aide){const a=souffleAide();if(aide.textContent!==a)aide.textContent=a;}
  /* Les 12 points comptent le temps, 10 secondes par point, quelle que soit la cadence choisie. */
  if(tours&&tours.children)for(let i=0;i<tours.children.length;i++){const c=i<s.tr?'f':(i===s.tr?'c':'');if(tours.children[i].className!==c)tours.children[i].className=c;}
}
function souffleFrame(){
  const s=state.souffle;s.raf=0;
  /* Page à l'arrière-plan : le minutage attend. Il sera décalé au retour, et la respiration reprendra là où elle en était. */
  if(s.k!=='cours'||state.view!=='souffle'||s.hid||s.pz)return;
  const now=performance.now();
  souffleSuite(now);
  if(s.fin&&now>=s.fin){rsSuite(now);s.k='fini';s.choix=false;if(EAU.resp)EAU.resp.ret={de:EAU.resp.dy,t:eauNow()};veilleSync();noteRecent('exo','breath');render();return;}
  let i=typeof s.ix==='number'?s.ix:-1;
  while(i+1<s.seq.length&&s.seq[i+1].a<=now)i++;
  let ph='avant',cyc=-1,e=0;
  if(i>=0){const p=s.seq[i],x=Math.max(0,Math.min(1,(now-p.a)/p.d));ph=p.ty;cyc=p.c;e=p.ty==='in'?.5-.5*Math.cos(Math.PI*x):.5+.5*Math.cos(Math.PI*x);}
  const tr=now<s.t0?-1:Math.min(SOUFFLE.n-1,Math.floor((now-s.t0)/10000));
  /* La goutte suit le souffle, avec la même courbe douce que les mots et la musique : elle s'élève quand on inspire, elle redescend quand on expire. */
  const vive=eauRespire(document.querySelector('.souffle .etang'),-GOUTTE_H*e);s.e=e;
  if(i!==s.ix||ph!==s.ph||tr!==s.tr){
    const neuf=i!==s.ix||ph!==s.ph;
    s.ix=i;s.ph=ph;s.cyc=cyc;s.tr=tr;souffleMots();
    /* À chaque expiration, 2 ondes partent du pied de la goutte et s'élargissent sur l'étang, l'une après l'autre. */
    if(neuf&&ph==='out'&&fxOn()){if(vive){eauAdd(434,259,.9,0);eauAdd(434,259,.55,1.25);}else souffleOnde();}
  }
  const r=document.querySelector('.souffle .ronds');
  if(r&&r.style&&fxOn()&&!vive)r.style.setProperty('--s',(1-.5*e).toFixed(3));
  /* La musique reçoit les mouvements décidés par ce même minutage. */
  rsSuite(now);
  s.raf=(window.requestAnimationFrame||(f=>setTimeout(f,50)))(souffleFrame);
}
/* Après chaque rendu de l'écran : le cercle retrouve sa place, et la respiration reprend là où elle en était. */
function souffleApres(){
  if(state.view!=='souffle')return;
  soufflePose();
  const s=state.souffle;
  if(s.k==='cours'){
    souffleMots();
    /* L'écran vient d'être redessiné (pause, choix d'une respiration) : les 2 cercles de secours reprennent la taille qu'ils avaient. */
    try{const r=document.querySelector('.souffle .ronds');if(r&&r.style&&fxOn()&&typeof s.e==='number')r.style.setProperty('--s',(1-.5*s.e).toFixed(3));}catch(e){}
    if(!s.raf&&!s.pz)s.raf=(window.requestAnimationFrame||(f=>setTimeout(f,50)))(souffleFrame);
  }
  /* Quand le choix s'ouvre ou se referme, le curseur du clavier et du lecteur d'écran suit. */
  if(s.foc){const q=s.foc;s.foc='';try{const el=document.querySelector(q);if(el)el.focus({preventScroll:true});}catch(e){}}
}
/* « Changer de respiration » : le choix s'ouvre sous l'étang, sans arrêter l'exercice. Le cercle reste visible et continue. */
function respChoixHtml(){
  const s=state.souffle,r=respReglage();
  const opts=RESP_ORDRE.map(m=>'<button type="button" class="resp-o" data-act="resp" data-v="'+m+'" aria-pressed="'+(r.m===m)+'"><span class="resp-p" aria-hidden="true"></span><span class="tx"><b>'+RESP[m].t+'</b><span>'+RESP[m].s+'</span></span></button>').join('');
  const cad='<div class="resp-cad" id="resp-cad"'+(r.m==='libre'?'':' hidden')+'><button type="button" class="btn small" data-act="cad" data-v="lent"'+(r.c>=CAD_MAX?' aria-disabled="true"':'')+'>Plus lent</button><p id="resp-cad-t" role="status">'+respCadTxt(r.c)+'</p><button type="button" class="btn small" data-act="cad" data-v="vite"'+(r.c<=CAD_MIN?' aria-disabled="true"':'')+'>Plus vite</button></div>';
  return '<div class="resp-choix"><h2 id="resp-h">Changer de respiration</h2><div class="resp-os" role="group" aria-labelledby="resp-h">'+opts+'</div>'+cad+
    (s.k==='cours'?'<p class="resp-note">Le changement se fait en douceur, au prochain souffle.</p>':'')+
    '<div class="actions">'+(s.k==='cours'?'<button type="button" class="btn primary" data-act="resp-ferme">'+I.check+'Continuer</button>':'<button type="button" class="btn primary" data-act="souffle-go">'+I.wind+'Commencer</button>')+'</div></div>';
}
/* Un choix ou un réglage de cadence change l'écran sur place, sans le redessiner : le cercle et la musique ne sont pas dérangés. */
function respChoixMaj(){
  const r=respReglage();
  try{
    const L=document.querySelectorAll('.resp-o');
    for(let i=0;i<L.length;i++)L[i].setAttribute('aria-pressed',String(L[i].getAttribute('data-v')===r.m));
    const c=document.getElementById('resp-cad');if(c)c.hidden=r.m!=='libre';
    const t=document.getElementById('resp-cad-t');if(t&&t.textContent!==respCadTxt(r.c))t.textContent=respCadTxt(r.c);
    const B=document.querySelectorAll('.resp-cad [data-act="cad"]');
    for(let i=0;i<B.length;i++){const bout=B[i].getAttribute('data-v')==='lent'?r.c>=CAD_MAX:r.c<=CAD_MIN;if(bout)B[i].setAttribute('aria-disabled','true');else B[i].removeAttribute('aria-disabled');}
  }catch(e){}
}
function viewSouffle(){
  const s=state.souffle;const k=s.k;const choix=!!s.choix&&k!=='fini';
  const tours='<div class="tours" aria-hidden="true">'+Array.from({length:SOUFFLE.n},()=>'<i></i>').join('')+'</div>';
  const changer='<button type="button" class="resp-l" data-act="resp-ouvre">'+I.swap+'Changer de respiration</button>';
  let bas='';
  if(k==='cours')bas='<h1 class="sr">Souffler 2 minutes</h1><p class="mot" id="souffle-mot" role="status">'+(s.pz?'En pause':SOUFFLE_MOT[s.ph||'avant'])+'</p>'+
    (choix?respChoixHtml():'<p class="aide" id="souffle-aide">'+souffleAide()+'</p>'+tours+
    /* La pause est le premier bouton, large, à portée du pouce. L'exercice commence en silence : « Écouter l'étang » ajoute la musique, et le même bouton la coupe sans arrêter la respiration. */
    '<div class="actions souffle-a">'+(s.pz?'<button type="button" class="btn primary souffle-pz" data-act="souffle-pause">'+I.wind+'Reprendre</button>':'<button type="button" class="btn souffle-pz" data-act="souffle-pause">'+I.pause+'Pause</button>'+sonBoutonHtml('souffle'))+'<button type="button" class="btn ghost" data-act="souffle-stop">'+I.stop+'Arrêter</button></div>'+(s.pz?'':changer));
  else if(k==='fini')bas='<h1 class="sr">Souffler 2 minutes</h1><p class="mot" id="souffle-mot" role="status">Voilà.</p><p class="aide">Vous venez de prendre 2 minutes rien que pour vous. Vous êtes aussi une personne, et pas seulement un parent.</p>'+
    /* Un parent arrivé par la porte de l'accueil n'a pas encore vu « Aujourd'hui » : le bouton lui dit ce qu'il va y trouver d'abord. */
    '<div class="actions col"><button type="button" class="btn primary wide" data-act="go" data-view="today">'+I.sun2+(state.vuAuj?'Revenir à aujourd’hui':'Lire la dose du jour')+'</button><button type="button" class="btn wide" data-act="porte" data-v="deposer">'+I.drop+'Déposer ce qui pèse</button><button type="button" class="btn ghost wide" data-act="souffle-go">'+I.wind+'Encore 2 minutes</button></div>'+
    /* Les dernières notes s'éteignent d'elles-mêmes. Le parent peut aussi les couper. */
    (SON.etat!=='off'&&SON.proprio==='souffle'?'<div class="actions fin-son">'+sonBoutonHtml('souffle')+'</div>':'');
  else bas='<h1 class="mot" id="souffle-mot">Souffler 2 minutes</h1>'+
    (choix?respChoixHtml():'<p class="aide">'+respPret()+'</p><div class="actions"><button type="button" class="btn primary" data-act="souffle-go">'+I.wind+'Commencer</button></div>'+changer);
  return '<main id="main" tabindex="-1" class="view souffle s-'+k+(choix?' s-choix':'')+'" style="padding-top:0"><header class="bar sub"><button type="button" class="back" data-act="back">'+I.back+'Retour</button><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>'+
    /* La goutte suspendue au-dessus de l'étang. Elle s'élève quand on inspire, elle redescend quand on expire, et 2 ondes s'élargissent sur l'eau. */
    '<div class="etang bleed"><img class="etang-photo" src="'+HERO+'" alt="" width="866" height="470" decoding="async"><span class="ronds" aria-hidden="true"><i></i><i></i><b></b></span></div>'+
    '<div class="resp">'+bas+'</div></main>';
}

/* ---------- prendre un instant : l'étang, à regarder ou à toucher ---------- */
/* On y arrive depuis la dose du jour. L'écran s'ouvre en silence : la goutte rebondit une fois, puis l'eau redevient calme.
   Un toucher sur l'eau fait naître une onde fine, qui s'efface d'elle-même. Le son (40 secondes d'étang) ne part que si le parent le demande,
   et il s'arrête dès que l'on quitte l'écran. Le doigt ne retient pas la page : elle défile comme partout ailleurs. */
function viewInstant(){
  return '<main id="main" tabindex="-1" class="view souffle instant s-pret" style="padding-top:0"><header class="bar sub"><button type="button" class="back" data-act="back">'+I.back+'Retour</button><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>'+
    '<div class="etang bleed"><img class="etang-photo" src="'+HERO+'" alt="Une goutte suspendue au-dessus d’un étang, dans la lumière d’une forêt." width="866" height="470" decoding="async"></div>'+
    '<div class="resp"><h1 class="mot">Prendre un instant</h1><p class="aide">'+(fxOn()?'Touchez l’eau si vous en avez envie. Vous pouvez aussi simplement la regarder.':'Regardez l’eau aussi longtemps que vous voulez. Ici, rien ne vous attend.')+'</p>'+
    '<div class="actions">'+sonBoutonHtml('dose')+'</div></div></main>';
}

/* ---------- le son de l'étang ---------- */
/* Tout est composé pour cet espace (du son calculé, sans aucun enregistrement) et chargé seulement quand le parent le demande.
   Pour la respiration, la musique n'est pas un morceau écrit d'avance : la page la joue note après note, en suivant le minutage de l'exercice.
   « notes » contient 9 notes de piano feutré, rangées l'une après l'autre dans des cases de 6,5 secondes, et « eau » une boucle d'étang.
   Quand on inspire, 3 notes montent, une note grave les porte et l'eau s'éclaircit. Quand on souffle, les notes redescendent et l'eau se retire.
   « instant » dure 40 secondes et accompagne la dose.
   Les règles : silence par défaut, une seule musique à la fois, une entrée et une sortie en douceur,
   et plus aucun son dès qu'on quitte l'écran qui l'a lancé (Arrêter, Retour, SOS, autre écran, page à l'arrière-plan). */
I.son='<svg class="i" viewBox="0 0 24 24"><path d="M4 10v4h3l5 4V6l-5 4H4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.6 6.4a8 8 0 0 1 0 11.2"/></svg>';
I.silence='<svg class="i" viewBox="0 0 24 24"><path d="M4 10v4h3l5 4V6l-5 4H4z"/><path d="M16.5 9.5l4.5 5M21 9.5l-4.5 5"/></svg>';
const SON_OK=SITE&&!PRE;
const SON={mode:'',ctx:null,voix:null,fins:[],el:null,octets:{},tampons:{},attente:{},piste:'',proprio:'',pos:null,etat:'off',jeton:0,voulu:false,reprise:null,veille:0,dit:false};
const SON_VOL=0.9,SON_ENTREE=2.4,SON_SORTIE=0.4;
/* La musique de la respiration. Les mêmes nombres servent à « outils/son/compose2.py », qui fabrique les fichiers et simule le résultat pour le mesurer. */
const RS_CASE=6.5,RS_AVANT=0.03,RS_CASES={43:0,45:1,47:2,50:3,57:4,62:5,64:6,66:7,69:8};
const RS_MONTE=[62,66,69],RS_DESC={egal:[66,64,62],long:[66,64,62,57],libre:[66,64,62,57]},RS_BASSES=[50,47,43,45];
const RS_G_MONTE=[.62,.74,.86],RS_G_DESC=[.70,.60,.52,.46],RS_G_BASSE=.50;
const RS_VOL=.85,RS_ENTREE=1.6,RS_EAU=.62,RS_EAU_BAS=.40,RS_CLAIR=3600,RS_SOMBRE=1100,RS_BOUCLE=[.5,28.5];
let SON_IOS=false;try{SON_IOS=/iP(hone|ad|od)/.test(navigator.userAgent||'')||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}catch(e){}
function sonUrl(nom){return RACINE+'son/'+nom+'.mp3?v='+SON_V;}
/* Deux façons de jouer. La première calcule le son dans la page : elle permet les fondus et de poser chaque note au bon moment.
   Sur iPhone, le bouton « silencieux » la coupe, sauf si la page se déclare comme un lecteur, ce qui est possible depuis iOS 17.
   Pour l'instant de la dose, un iPhone plus ancien passe donc par le lecteur audio ordinaire, que ce bouton ne coupe pas.
   La musique de la respiration, elle, a besoin de la première façon : sur un iPhone plus ancien, un message rappelle de vérifier le bouton silencieux. */
function sonWA(){return !!((window.AudioContext||window.webkitAudioContext)&&window.fetch);}
function sonMode(){
  if(SON.mode)return SON.mode;
  SON.mode=(sonWA()&&(!SON_IOS||navigator.audioSession))?'wa':'el';
  return SON.mode;
}
function sonSession(lecteur){try{if(navigator.audioSession)navigator.audioSession.type=lecteur?'playback':'auto';}catch(e){}}
function sonCtx(){
  sonSession(true);
  if(!SON.ctx){const C=window.AudioContext||window.webkitAudioContext;SON.ctx=new C();}
  if(SON.ctx.state!=='running'&&SON.ctx.resume){const r=SON.ctx.resume();if(r&&r.catch)r.catch(()=>{});}
  return SON.ctx;
}
/* Un fichier n'est téléchargé qu'une fois par visite, à la première demande. Il est gardé tel quel,
   et décodé à chaque passage sur son écran : le décodeur reçoit une copie, parce qu'il vide ce qu'on lui confie. */
function sonCharge(nom){
  if(SON.tampons[nom])return Promise.resolve(SON.tampons[nom]);
  if(SON.attente[nom])return SON.attente[nom];
  const ctx=SON.ctx;
  const octets=SON.octets[nom]?Promise.resolve(SON.octets[nom]):fetch(sonUrl(nom)).then(r=>{if(!r.ok)throw new Error('son');return r.arrayBuffer();}).then(ab=>{SON.octets[nom]=ab;return ab;});
  const p=octets.then(ab=>new Promise((ok,ko)=>{try{const q=ctx.decodeAudioData(ab.slice(0),ok,ko);if(q&&q.then)q.then(ok,ko);}catch(e){ko(e);}}))
    .then(buf=>{delete SON.attente[nom];SON.tampons[nom]=buf;sonMenage();return buf;},e=>{delete SON.attente[nom];throw e;});
  SON.attente[nom]=p;return p;
}
/* Un son décodé pèse plusieurs mégaoctets dans la mémoire du téléphone : il est rendu dès qu'on quitte son écran. */
function sonMenage(){
  if(state.view!=='souffle'){delete SON.tampons.notes;delete SON.tampons.eau;}
  if(state.view!=='today')delete SON.tampons.instant;
  if(state.view!=='avec')delete SON.tampons.antonio;
}
/* Une « voix » est ce qui joue : un réglage de volume général et une ou plusieurs sources. Quand sa dernière source s'est tue, elle est rangée. */
function sonSource(v,src,noeuds,fin){
  v.srcs.push(src);
  src.onended=()=>{
    try{src.disconnect();(noeuds||[]).forEach(n=>{try{n.disconnect();}catch(e){}});}catch(e){}
    const k=v.srcs.indexOf(src);if(k>=0)v.srcs.splice(k,1);
    if(!v.srcs.length&&SON.voix!==v){SON.fins=SON.fins.filter(x=>x!==v);try{v.g.disconnect();}catch(e){}}
    if(fin)fin();
  };
}
/* Ce qui finissait de s'éteindre se tait tout de suite avant un nouveau départ : 2 musiques ne se recouvrent jamais. */
function sonTaire(){
  const ctx=SON.ctx;
  SON.fins.forEach(v=>{
    try{const t=ctx.currentTime;v.g.gain.cancelScheduledValues(t);v.g.gain.setValueAtTime(0.0001,t);v.srcs.slice().forEach(x=>{try{x.stop(t+0.02);}catch(e){try{x.stop();}catch(z){}}});}catch(e){}
  });
  SON.fins=[];
}
function sonDepart(buf,j){
  if(j!==SON.jeton)return;
  const ctx=SON.ctx,o=Math.max(0,SON.pos?SON.pos():0);
  if(o>=buf.duration-0.5){sonEtat('off');return;}
  sonTaire();
  let src,g;
  try{
    src=ctx.createBufferSource();g=ctx.createGain();const t=ctx.currentTime;
    src.buffer=buf;src.connect(g);g.connect(ctx.destination);
    /* L'entrée : presque rien pendant la première seconde, puis le son s'installe. */
    const E=SON.proprio==='avec'?0.12:SON_ENTREE;
    g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(SON_VOL*0.2,t+E*0.5);g.gain.linearRampToValueAtTime(SON_VOL,t+E);
    const v={g:g,srcs:[],niv:x=>{const e=(x-t)/E;return SON_VOL*(e>=1?1:(e<.5?Math.max(0,e)*.4:.2+(e-.5)*1.6));}};
    sonSource(v,src,null,()=>{if(SON.voix===v){SON.voix=null;try{g.disconnect();}catch(e){}if(j===SON.jeton){SON.jeton++;sonSession(false);sonEtat('off');}}});
    src.start(0,o);SON.voix=v;
  }catch(e){sonRate(j);return;}
  sonEtat('on');
  /* Si le téléphone n'a pas laissé le son partir (une autre application le retient, par exemple), le bouton le dit : il redevient « Écouter ». */
  clearTimeout(SON.veille);SON.veille=setTimeout(()=>{if(j===SON.jeton&&SON.etat==='on'&&SON.ctx&&SON.ctx.state!=='running')sonCoupe(true);},900);
}
function sonElement(){
  if(SON.el)return SON.el;
  const a=new Audio();a.preload='auto';
  a.addEventListener('ended',()=>{if(SON.mode==='el'&&SON.proprio!=='souffle'&&SON.etat!=='off'){SON.jeton++;sonEtat('off');}});
  /* Le téléphone peut couper le son lui-même (un appel, des écouteurs retirés) : le bouton dit alors la vérité. */
  a.addEventListener('pause',()=>{if(SON.mode==='el'&&SON.proprio!=='souffle'&&SON.etat==='on'&&!a.ended){SON.jeton++;sonEtat('off');}});
  SON.el=a;return a;
}
function sonElJoue(nom,j){
  const a=sonElement(),url=sonUrl(nom);
  if(a.getAttribute('src')!==url)a.setAttribute('src',url);
  const cale=()=>{const o=SON.pos?SON.pos():0;if(Math.abs((a.currentTime||0)-o)>0.4){try{a.currentTime=Math.max(0,o);}catch(e){}}};
  cale();
  let p;try{p=a.play();}catch(e){sonRate(j);return;}
  const ok=()=>{if(j!==SON.jeton)return;cale();sonEtat('on');};
  if(p&&p.then)p.then(ok,()=>sonRate(j));else ok();
}
/* L'état du son change : le bouton, l'écran qui reste allumé et la ligne d'aide de la respiration suivent. */
function sonEtat(e){SON.etat=e;sonBoutons();veilleSync();if(state.view==='souffle')souffleMots();}
function sonRate(j){if(j!==SON.jeton)return;SON.jeton++;sonEtat('off');toast('Le son n’a pas pu se charger. Tout le reste fonctionne en silence.');}
/* Un morceau entier, joué du début à la fin : c'est l'instant qui suit la dose. */
function sonJoue(nom,proprio,pos){
  if(!SON_OK)return;
  if(SON.etat!=='off')sonCoupe(true);
  const j=++SON.jeton;SON.piste=nom;SON.proprio=proprio;SON.pos=pos||null;SON.reprise=null;sonEtat('charge');
  if(sonMode()==='wa'){
    try{sonCtx();}catch(e){SON.mode='el';}
    if(SON.mode==='wa'){sonCharge(nom).then(buf=>sonDepart(buf,j),()=>sonRate(j));return;}
  }
  sonElJoue(nom,j);
}

/* ----- la musique de la respiration ----- */
/* Le minutage de l'exercice compte en millisecondes de la page. Le son, lui, a sa propre horloge.
   « rsTemps » dit à quel instant de l'horloge du son il faut poser une note pour qu'elle s'entende à un instant donné de la page.
   Le temps que le son met à sortir du téléphone est retiré quand le navigateur le donne. */
function rsTemps(tPage){
  const ctx=SON.ctx;let lat=0;
  try{lat=Math.min(.3,Math.max(0,(Number(ctx.outputLatency)||0)+(Number(ctx.baseLatency)||0)));}catch(e){}
  return ctx.currentTime+(tPage-performance.now())/1000-lat;
}
/* Où commence vraiment la première note dans le fichier décodé ? Les navigateurs ne décodent pas tous le début d'un fichier de la même façon,
   à quelques centièmes de seconde près. On le mesure une fois, et toutes les notes sont posées en conséquence. */
function rsCale(buf){
  try{const d=buf.getChannelData(0),n=Math.min(d.length,Math.floor(buf.sampleRate*.25));for(let i=0;i<n;i++){if(d[i]>.004||d[i]<-.004)return Math.max(0,Math.min(.12,i/buf.sampleRate));}}catch(e){}
  return RS_AVANT;
}
function rsEau(e){return {f:RS_SOMBRE+(RS_CLAIR-RS_SOMBRE)*e,g:RS_EAU*(RS_EAU_BAS+(1-RS_EAU_BAS)*e)};}
/* Une note de piano : la bonne case du fichier, à son volume, à l'instant voulu. Une note qui arriverait trop tard n'est pas jouée du tout. */
function rsNote(v,midi,gain,t){
  const ctx=SON.ctx,tn=ctx.currentTime;
  if(t<tn-.12||!(midi in RS_CASES))return;
  const src=ctx.createBufferSource(),g=ctx.createGain();
  src.buffer=v.bn;g.gain.value=gain;src.connect(g);g.connect(v.g);
  sonSource(v,src,[g]);
  src.start(Math.max(tn,t-v.avant),RS_CASES[midi]*RS_CASE,RS_CASE-.05);
}
/* Un mouvement de la respiration devient de la musique : l'eau avance ou se retire pendant toute sa durée, et les notes se partagent ce temps. */
function rsMouvement(v,p){
  const ctx=SON.ctx,tn=ctx.currentTime,t=rsTemps(p.a),d=p.d/1000,haut=p.ty==='in';
  const a=rsEau(haut?0:1),b=rsEau(haut?1:0);
  if(t+d>tn+.02){
    if(t>=tn){v.f.frequency.setValueAtTime(a.f,t);v.ge.gain.setValueAtTime(a.g,t);}
    else{const x=(tn-t)/d,m=rsEau(haut?x:1-x);v.f.frequency.setValueAtTime(m.f,tn);v.ge.gain.setValueAtTime(m.g,tn);}
    v.f.frequency.linearRampToValueAtTime(b.f,t+d);v.ge.gain.linearRampToValueAtTime(b.g,t+d);
  }
  const N=haut?RS_MONTE:(RS_DESC[p.m]||RS_DESC.long),G=haut?RS_G_MONTE:RS_G_DESC;
  for(let i=0;i<N.length;i++)rsNote(v,N[i],G[i],t+d*i/N.length);
  if(haut)rsNote(v,RS_BASSES[p.c%RS_BASSES.length],RS_G_BASSE,t);
}
/* La fin : un dernier accord égrené, puis tout s'éteint lentement. */
function rsFinale(v,fin){
  const ctx=SON.ctx,tn=ctx.currentTime,t=Math.max(tn,rsTemps(fin));
  rsNote(v,50,.5,t);rsNote(v,57,.5,t+.3);rsNote(v,66,.6,t+.6);
  v.tf=t;
  try{v.g.gain.setValueAtTime(RS_VOL,Math.max(t+1.5,v.t0+RS_ENTREE+.01));v.g.gain.linearRampToValueAtTime(0.0001,t+9);}catch(e){}
  const j=SON.jeton;
  v.fin=setTimeout(()=>{
    if(SON.voix!==v)return;
    SON.voix=null;v.srcs.slice().forEach(x=>{try{x.stop();}catch(e){}});SON.fins.push(v);
    if(j===SON.jeton){SON.jeton++;sonSession(false);sonEtat('off');}
  },Math.max(0,(t+9.2-tn)*1000));
}
/* Appelée à chaque image par le minutage de l'exercice : tout mouvement nouvellement décidé reçoit sa musique. */
function rsSuite(now){
  const v=SON.voix;if(!v||!v.resp||SON.etat!=='on')return;
  const s=state.souffle,ctx=SON.ctx;
  /* Si le téléphone a suspendu le son (un appel, par exemple), le bouton le dit : il redevient « Écouter l'étang ». */
  if(ctx.state!=='running'){if(!v.arret)v.arret=now;else if(now-v.arret>1500){sonCoupe(true);return;}}else v.arret=0;
  try{
    while(v.jx<s.seq.length){rsMouvement(v,s.seq[v.jx]);v.jx++;}
    if(s.fin&&!v.finale){v.finale=true;rsFinale(v,s.fin);}
  }catch(e){sonCoupe(true);}
}
function rsDepart(bn,be,j){
  if(j!==SON.jeton)return;
  const s=state.souffle,ctx=SON.ctx;
  if(state.view!=='souffle'||s.k!=='cours'){SON.jeton++;sonEtat('off');return;}
  sonTaire();
  let v;
  try{
    const t=ctx.currentTime,now=performance.now();
    const g=ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(RS_VOL,t+RS_ENTREE);g.connect(ctx.destination);
    const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),ge=ctx.createGain();
    src.buffer=be;src.loop=true;src.loopStart=RS_BOUCLE[0];src.loopEnd=RS_BOUCLE[1];
    f.type='lowpass';f.Q.value=.6;
    src.connect(f);f.connect(ge);ge.connect(g);
    v={resp:true,g:g,srcs:[],bn:bn,f:f,ge:ge,t0:t,tf:0,avant:rsCale(bn),jx:0,finale:false,fin:0,arret:0};
    v.niv=x=>{let n=RS_VOL*Math.max(0,Math.min(1,(x-v.t0)/RS_ENTREE));if(v.tf&&x>v.tf+1.5)n=Math.min(n,RS_VOL*Math.max(0,1-(x-v.tf-1.5)/7.5));return n;};
    /* Où en est la respiration à cet instant ? L'eau prend tout de suite la place qu'elle aurait eue, et finit le mouvement en cours. */
    let i=-1;while(i+1<s.seq.length&&s.seq[i+1].a<=now)i++;
    let e=0;
    if(i>=0){const p=s.seq[i],x=Math.max(0,Math.min(1,(now-p.a)/p.d));e=p.ty==='in'?x:1-x;}
    const m=rsEau(e);f.frequency.setValueAtTime(m.f,t);ge.gain.setValueAtTime(m.g,t);
    if(i>=0){const p=s.seq[i],tf=rsTemps(p.a+p.d),b=rsEau(p.ty==='in'?1:0);if(tf>t+.02){f.frequency.linearRampToValueAtTime(b.f,tf);ge.gain.linearRampToValueAtTime(b.g,tf);}}
    /* Les notes, elles, entrent au début du mouvement suivant : la première chose que l'on entend est une phrase entière, qui monte ou qui redescend. */
    v.jx=i+1;
    sonSource(v,src,[f,ge]);
    src.start(t,RS_BOUCLE[0]);
  }catch(e){sonRate(j);return;}
  SON.voix=v;
  /* La clé d'écoute reste affichée pendant la respiration en cours et la suivante. */
  s.cle=Math.max(0,s.cyc)+1;
  sonEtat('on');
  if(SON_IOS&&!navigator.audioSession&&!SON.dit){SON.dit=true;toast('Si vous n’entendez rien, vérifiez le bouton silencieux du téléphone.');}
  clearTimeout(SON.veille);SON.veille=setTimeout(()=>{if(j===SON.jeton&&SON.etat==='on'&&SON.ctx&&SON.ctx.state!=='running')sonCoupe(true);},900);
}
/* « Écouter l'étang » pendant la respiration. */
function sonSouffle(){
  if(!SON_OK||!sonWA())return;
  if(SON.etat!=='off')sonCoupe(true);
  const j=++SON.jeton;SON.piste='etang';SON.proprio='souffle';SON.pos=null;SON.reprise=null;sonEtat('charge');
  try{sonCtx();}catch(e){sonRate(j);return;}
  Promise.all([sonCharge('notes'),sonCharge('eau')]).then(b=>rsDepart(b[0],b[1],j),()=>sonRate(j));
}
/* Couper : le son s'éteint en moins d'une demi-seconde. « vite » sert quand on quitte la page, où il ne doit rien rester. */
function sonCoupe(vite){
  SON.jeton++;clearTimeout(SON.veille);
  const v=SON.voix;SON.voix=null;
  if(v&&SON.ctx){
    const d=vite?0.05:SON_SORTIE;clearTimeout(v.fin);
    try{
      const t=SON.ctx.currentTime;const n=v.niv?v.niv(t):1;
      v.g.gain.cancelScheduledValues(t);v.g.gain.setValueAtTime(Math.max(0.0001,n),t);v.g.gain.linearRampToValueAtTime(0.0001,t+d);
      v.srcs.slice().forEach(x=>{try{x.stop(t+d+0.03);}catch(e){}});
      if(v.srcs.length)SON.fins.push(v);
    }catch(e){v.srcs.slice().forEach(x=>{try{x.stop();}catch(z){}});}
    const j=SON.jeton;setTimeout(()=>{if(j===SON.jeton)sonSession(false);},700);
  }
  if(SON.el){try{SON.el.pause();}catch(e){}}
  if(SON.etat!=='off')sonEtat('off');
}
/* Le son appartient à l'écran qui l'a lancé : la respiration en cours (ou tout juste finie), ou « Aujourd'hui » pour l'instant de la dose. */
function sonChezLui(){
  if(SON.proprio==='souffle')return state.view==='souffle'&&(state.souffle.k==='cours'||state.souffle.k==='fini');
  if(SON.proprio==='dose')return state.view==='instant'&&!state.sheet;
  if(SON.proprio==='avec')return state.view==='avec'&&!state.sheet;
  return false;
}
/* Après chaque rendu : si l'écran n'est plus celui du son, le son s'arrête. C'est ce qui couvre Arrêter, Retour, SOS et tous les autres chemins. */
function sonGarde(){
  if(state.view!=='souffle')SON.voulu=false;
  if((SON.etat!=='off'||SON.reprise)&&!sonChezLui()){SON.reprise=null;sonCoupe();}
  sonMenage();
}
const SON_TXT={souffle:{off:'Écouter l’étang',charge:'L’étang arrive…',on:'Couper le son'},dose:{off:'Écouter l’étang',charge:'L’étang arrive…',on:'Revenir au silence'},avec:{off:'Écouter Antonio, 30 secondes',charge:'Un instant…',on:'Arrêter'}};
const SON_NOMS={souffle:'etang',dose:'instant',avec:'antonio'};
function sonBoutonHtml(ou){
  if(!SON_OK||(ou==='souffle'&&!sonWA()))return '';
  const nom=SON_NOMS[ou]||'instant';
  const e=(SON.piste===nom&&SON.proprio===ou)?SON.etat:'off';
  return '<button type="button" class="son-b son-'+ou+'" data-act="son" data-v="'+nom+'" data-etat="'+e+'"'+(e==='charge'?' aria-busy="true"':'')+'>'+(e==='off'?I.son:I.silence)+'<span class="tx"><b>'+SON_TXT[ou][e]+'</b>'+(ou==='dose'&&e==='off'?' <small>40 secondes, quand vous voulez</small>':'')+'</span></button>';
}
/* Le bouton change sur place, sans redessiner l'écran : la respiration et la lecture ne sont pas dérangées. */
function sonBoutons(){
  try{
    const L=document.querySelectorAll('.son-b');
    for(let i=0;i<L.length;i++){
      const b=L[i],ou=b.classList.contains('son-souffle')?'souffle':(b.classList.contains('son-avec')?'avec':'dose');
      const t=document.createElement('div');t.innerHTML=sonBoutonHtml(ou);const n=t.firstChild;if(!n)continue;
      const e=n.getAttribute('data-etat');b.setAttribute('data-etat',e);
      if(e==='charge')b.setAttribute('aria-busy','true');else b.removeAttribute('aria-busy');
      b.innerHTML=n.innerHTML;
      /* À la fin de la respiration, le bouton ne sert plus une fois les dernières notes éteintes. */
      const fin=b.parentNode&&b.parentNode.classList&&b.parentNode.classList.contains('fin-son');if(fin&&e==='off')b.parentNode.hidden=true;
    }
  }catch(e){}
}

/* ---------- qui parle, dans cet espace ---------- */
/* Une feuille courte, ouverte depuis la dose, depuis la réponse à un dépôt et depuis « Moi ».
   Elle dit ce que l'application choisit, ce qui vient d'Antonio, et ce que la formule « Avec Antonio » montre en démonstration. */
function sheetVoix(sheetIn){
  const ia=!!state.sample;
  return '<div class="backdrop" data-act="sheet-close"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="voix-t" tabindex="-1"><div class="sheet-in voix"><div class="grab"></div><h2 id="voix-t">Qui vous parle ici ?</h2>'+
    '<div class="qui"><h3>Ce que l’application choisit</h3><p>'+(ia?'La dose du jour et les pistes proposées sont des textes écrits à l’avance, et l’application choisit lequel vous montrer. Quand vous déposez, la réponse est écrite par une intelligence artificielle, et l’espace vous le dit à chaque fois.':'La dose du jour, la question et la lumière que vous recevez après un dépôt et les pistes proposées sont des textes écrits à l’avance. L’application choisit lequel vous montrer, selon le jour et selon quelques mots de votre texte. Personne ne lit ce que vous écrivez, et rien ne quitte votre appareil.')+'</p></div>'+
    (ia?'':'<div class="qui"><h3>Ce que deviennent vos mots</h3><p>Vos mots sont enregistrés dans ce navigateur, sur cet appareil, et vous les retrouvez dans « Mes dépôts ». L’application ne les réécrit pas. Si vous choisissez « J’aimerais le dire à quelqu’un », elle vous propose une première phrase écrite à l’avance, que vous pouvez changer. Rien n’est envoyé. C’est vous qui copiez le texte et qui décidez à qui le montrer.</p></div>')+
    '<div class="qui"><h3>Ce qui vient d’Antonio</h3><p>Les passages « Ce que j’ai vécu » et la page « Mon histoire » racontent ce qu’Antonio Company a vraiment vécu, comme enfant accueilli, comme travailleur social et comme père. Les autres textes de l’espace sont publiés sous sa responsabilité.</p></div>'+
    '<div class="qui"><h3>Ce qui vient de vous dans « Passer le relais »</h3><p>Les phrases modèles sont écrites à l’avance, et la fiche est faite des mots que vous choisissez. Aucune intelligence artificielle n’y intervient, et le site ne lit pas vos fiches.</p></div>'+
    '<button type="button" class="btn primary wide" data-act="sheet-close">J’ai compris</button></div></div>';
}

/* ---------- pour un visiteur arrivé par un lien : le haut et le bas des pages publiques ---------- */
function barPub(){
  return '<header class="bar pubbar"><a class="wordmark" href="'+RACINE+'" data-act="accueil" aria-label="Parent écouté, parent éclairé. Revenir à l’accueil">'+LOGO+'<span>Parent écouté,<small>parent éclairé</small></span></a><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>';
}
function piedPub(){
  return '<section class="invite" aria-labelledby="invite-t"><h2 id="invite-t">Cette fiche vient d’un espace d’écoute pour les parents</h2><p>« Parent écouté, parent éclairé » a été créé par Antonio Company, éducateur social, responsable d’une équipe socio-éducative et père de 3 enfants. Vous pouvez y souffler, y déposer ce qui pèse et y recevoir chaque jour une dose de lumière. C’est gratuit pour commencer, et il n’y a pas de compte à créer.</p>'+
    portes(true)+
    '<a class="btn wide" href="'+RACINE+'" data-act="accueil">Découvrir l’espace</a></section>'+
    '<footer class="foot"><a href="'+RACINE+'fiches/" data-act="fiches">Toutes les situations</a><a href="'+RACINE+'confidentialite.html">Confidentialité</a><a href="'+RACINE+'conditions.html">Conditions générales</a>'+(MENTIONS?'<a href="'+RACINE+'mentions-legales.html">Mentions légales</a>':'')+'</footer>';
}

/* ---------- la version d'essai : une copie à part, pour essayer avant de publier ---------- */
function essaiNotes(){try{const d=JSON.parse(localStorage.getItem(KEY_SITE)||'null');return d&&typeof d==='object'&&d.onboarded?d:null;}catch(e){return null;}}
function essaiCarte(){
  if(!ESSAI)return '';
  const n=essaiNotes();
  return '<div class="card essai"><span class="label">Version d’essai</span><p class="hint">Vous êtes sur une version d’essai de l’espace, à une adresse à part. Ce que vous y écrivez est rangé séparément, et le site habituel ne change pas.</p>'+
    (n?'<button type="button" class="btn" data-act="essai-copie" style="align-self:flex-start">Ouvrir ici une copie de mes notes</button><p class="hint">Vos dépôts, votre carnet et votre progression de parent-ecoute.ch sont recopiés ici. Les originaux ne sont pas modifiés.</p>':'')+
    (state.confirmEssai?'<div class="confirm" role="alert"><span>Effacer ce que contient la version d’essai sur cet appareil ?</span><div class="row"><button type="button" class="btn danger" data-act="essai-zero-oui">Oui, effacer</button><button type="button" class="btn" data-act="essai-zero-non">Annuler</button></div></div>':'<button type="button" class="btn" data-act="essai-zero" style="align-self:flex-start">Revoir la version d’essai depuis le début</button>')+reperesHtml()+'</div>';
}
