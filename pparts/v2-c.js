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
const PISTE_T={matin:'Une piste pour ce matin',jour:'Une piste pour aujourd’hui',soir:'Une piste pour ce soir',nuit:'Une piste pour cette nuit'};
/* L'accueil est écrit à l'avance dans la page, à une heure qui n'est pas celle du visiteur : chaque mot qui dépend de l'heure
   porte ses 4 variantes, et un petit script de la page choisit la bonne avant le premier affichage (voir INLINE_HEURE dans build_site.py). */
function heureAttr(o){return MOMENTS.map(m=>' data-'+m+'="'+esc(o[m])+'"').join('');}

/* ---------- les pistes du moment : quelles situations proposer d'abord ---------- */
const PISTE_ORDRE={
  matin:['refus','transitions','ecole','dehors','repas','crise','epuise','pros'],
  jour:['crise','transitions','repas','ecrans','dehors','regard','aide','pros'],
  soir:['sommeil','crise','refus','ecrans','epuise','culpa','couple','regard'],
  nuit:['sommeil','epuise','culpa','crise','couple','deuil','aide','regard']
};
const PISTE_AGE={e:[],a:['ado'],g:['loin','grandir']};
const PISTE_MOT={sommeil:'le coucher',crise:'une crise',refus:'un refus',ecrans:'les écrans',epuise:'l’épuisement',culpa:'la culpabilité',transitions:'un changement d’activité',ecole:'l’école',dehors:'une sortie',repas:'les repas',loin:'la vie en institution',grandir:'le passage à l’âge adulte',ado:'l’adolescence',pros:'un rendez-vous',aide:'une demande d’aide',couple:'le couple',regard:'le regard des autres',deuil:'l’enfant qu’on avait imaginé'};
function pistesDuMoment(m,age){
  const ids=(PISTE_AGE[age]||[]).concat(PISTE_ORDRE[m]||PISTE_ORDRE.jour);const out=[];
  ids.forEach(id=>{const s=SITS.find(x=>x.id===id);if(s&&out.indexOf(id)<0&&(!age||s.ages.includes(age)))out.push(id);});
  return out.slice(0,4);
}
function pistesPhrase(m,age){const L=pistesDuMoment(m,age).slice(0,3).map(id=>PISTE_MOT[id]);return 'Vous y trouvez '+L.slice(0,-1).join(', ')+' ou '+L[L.length-1]+'.';}

/* ---------- les 3 portes : souffler, déposer, trouver une piste ---------- */
/* « grand » : sur l'accueil, chaque porte dit ce qu'on y trouve. Dans « Aujourd'hui », les 3 portes tiennent sur une ligne. */
function portes(grand){
  const m=moment(),age=D().onboarded?(D().age||''):'';
  const sousPiste={};MOMENTS.forEach(k=>{sousPiste[k]=pistesPhrase(k,age);});
  const P=[
    ['souffle',I.wind,'Souffler 2 minutes','Souffler','L’étang respire avec vous.',null,null],
    ['deposer',I.drop,'Déposer ce qui pèse','Déposer','Vous écrivez, et vous recevez une question et une lumière.',null,null],
    ['piste',I.bulb,PISTE_T[m],'Une piste',sousPiste[m],PISTE_T,sousPiste]
  ];
  return '<div class="portes'+(grand?'':' mini')+'" role="group" aria-label="Ce dont vous avez besoin">'+P.map((p,i)=>
    '<button type="button" class="porte'+(i===0?' un':'')+'" data-act="porte" data-v="'+p[0]+'"'+(grand?'':' aria-label="'+esc(p[2])+'"')+'><span class="ic" aria-hidden="true">'+p[1]+'</span>'+
    (grand?'<span class="tx"><b'+(p[5]?heureAttr(p[5]):'')+'>'+esc(p[2])+'</b><span'+(p[6]?heureAttr(p[6]):'')+'>'+esc(p[4])+'</span></span><span class="chev" aria-hidden="true">'+I.chev+'</span>':'<b>'+esc(p[3])+'</b>')+'</button>').join('')+'</div>';
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
const FICHE_SLUG={crise:'la-crise',automut:'il-ou-elle-se-fait-mal',refus:'le-refus',transitions:'les-transitions',sommeil:'le-coucher-et-la-nuit',repas:'les-repas',parole:'communiquer-sans-les-mots',dehors:'les-sorties',regard:'le-regard-des-autres',ecole:'l-ecole',fratrie:'les-freres-et-soeurs',ecrans:'les-ecrans',ado:'l-adolescence-et-le-corps',annonce:'on-vient-d-apprendre',culpa:'la-culpabilite',epuise:'je-n-en-peux-plus',couple:'le-couple',aide:'demander-de-l-aide',grandir:'le-passage-a-l-age-adulte',loin:'quand-il-ou-elle-vit-ailleurs',pros:'parler-aux-professionnels',deuil:'l-enfant-qu-on-avait-imagine'};
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
function routeDe(){
  if(!SITE)return null;
  let p='';try{p=decodeURIComponent(location.pathname||'');}catch(e){p=location.pathname||'';}
  if(RACINE&&p.indexOf(RACINE)===0)p=p.slice(RACINE.length);else return location.hash===STORY_HASH?{v:'about'}:null;
  p=p.replace(/index\.html$/,'');
  const m=p.match(/^fiches\/([a-z0-9-]+)\/?$/);
  if(m&&SLUG_FICHE[m[1]])return {v:'sit',sit:SLUG_FICHE[m[1]]};
  if(/^fiches\/?$/.test(p))return {v:'kit',kit:'sits'};
  if(location.hash===STORY_HASH)return {v:'about'};
  return null;
}
/* L'adresse de l'écran affiché. Seuls les écrans publics ont la leur : une fiche, la liste des situations et « Mon histoire ».
   Tout le reste, qui appartient au parent, garde l'adresse de l'espace. */
function urlDe(){
  if(state.view==='sit'&&FICHE_SLUG[state.sit])return ficheUrl(state.sit);
  if(state.view==='kit'&&state.kit==='sits')return RACINE+'fiches/';
  if(state.view==='about')return RACINE+STORY_HASH;
  return RACINE;
}
function titreDe(){
  if(state.view==='about')return 'Mon histoire, par Antonio Company, créateur de Parent Écouté, Parent Éclairé';
  if(state.view==='sit'){const s=SITS.find(x=>x.id===state.sit);if(s)return s.t+', une fiche de Parent Écouté, Parent Éclairé';}
  if(state.view==='kit'&&state.kit==='sits'&&!D().onboarded)return SITS.length+' situations de la vraie vie, avec des pistes pour les parents';
  return TITLE0;
}
/* ---------- le bouton Retour du téléphone : chaque écran est une page de l'historique ---------- */
const HIST={ok:false,i:0};
function navSnap(){return {v:state.view,sit:state.sit,exo:state.exo,step:state.step,kit:state.kit,tool:state.tool,letter:state.letter,et:state.evoTime};}
function navApply(s){
  state.view=s.v||'today';state.sit=s.sit||null;state.exo=s.exo||null;state.step=(typeof s.step==='number')?s.step:null;state.kit=s.kit||'sits';state.tool=s.tool||'timer';
  state.letter=(typeof s.letter==='number')?s.letter:null;state.evoTime=s.et||'t1';
  state.sheet=null;state.confirmReset=false;state.photoPick=false;state.photoOrder=null;state.pdraft=null;state.prev=null;state.lien='';
  /* Un écran qui n'a plus de sens (une étape pas encore ouverte, une fiche inconnue) ramène à « Aujourd'hui ». */
  if(state.view==='step'&&(state.step===null||!D().onboarded||stepLocked(state.step)))state.view='parcours';
  if(state.view==='sit'&&!SITS.some(x=>x.id===state.sit))state.view='kit';
  if(state.view==='exo'&&!EXOS.some(x=>x.id===state.exo))state.view='kit';
  if(state.view==='souffle')state.souffle.k=state.souffle.k==='fini'?'fini':'pret';
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
  if(!HIST.ok||location.hash==='#atelier')return;
  const st=e&&e.state;souffleStop();stopTimer();
  if(st&&st.pepe&&st.s){HIST.i=st.i||0;navApply(st.s);}
  else{const r=routeDe()||{};HIST.i=0;navApply({v:r.v||'today',sit:r.sit,kit:r.kit});try{history.replaceState(histEtat(),'',urlDe());}catch(x){}}
  const y=(st&&st.y)||0;
  /* « apres » : un message à dire une fois revenu sur l'écran d'avant (par exemple après avoir enregistré le point de départ). */
  const dire=state.apres||'';state.apres='';
  fxGo(()=>{render();window.scrollTo(0,y);if(dire)toast(dire);},'back');
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
const OUTILS_NOMS={timer:'Le minuteur',ft:'D’abord, ensuite',routine:'La routine du soir',abc:'Le journal',phr:'Mes phrases qui marchent'};
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
  ['ado','(mon|notre) ado'+FIN_MOT+'|adolescen|puberté'],
  ['loin','en institution|l[’\']institution|son foyer|en foyer|dans un foyer|internat'],
  ['grandir','majorité|curatelle|ses 18 ans|a 18 ans'],
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
  const d=D();const left=depotsLeft();
  return '<main id="main" tabindex="-1" class="view deposer"><div><h1 class="t1">Déposer ce qui pèse</h1><p class="sub">'+(left===0?'Vous pouvez toujours écrire ce qui pèse, puis l’effacer. Rien n’est gardé.':'Écrivez comme ça vient, sans donner de prénom. Vous recevez en retour une question et une lumière.')+'</p></div>'+
    depotBox()+
    (left===0?'<button type="button" class="sit" data-act="exo" data-id="deposer"><span class="e">'+I.wind+'</span><span class="tx"><b>Écrire, puis effacer</b><span>Sans réponse, et sans rien garder</span></span><span class="chev">'+I.chev+'</span></button>':'')+
    (d.depots.length?'<button type="button" class="sit" data-act="go" data-view="depots"><span class="e">'+I.drop+'</span><span class="tx"><b>Mes dépôts</b><span>'+d.depots.length+' dépôt'+(d.depots.length>1?'s':'')+' gardé'+(d.depots.length>1?'s':'')+' sur cet appareil</span></span><span class="chev">'+I.chev+'</span></button>':'')+
    '</main>';
}

/* ---------- souffler 2 minutes : l'étang respire avec le parent ---------- */
/* 4 secondes pour inspirer, 6 pour expirer, 12 fois : cela fait 2 minutes, comme le dit le bouton.
   Un cercle posé sur l'eau s'élargit quand on inspire et se referme quand on expire. Avec les effets visuels, une onde part sur l'étang à chaque expiration.
   Sans les effets (réglage du téléphone ou de « Moi »), le cercle ne bouge pas et seuls les mots changent. */
const SOUFFLE={in:4,out:6,n:12};
let veille=null;
function veilleOn(){try{if(navigator.wakeLock&&!veille&&document.visibilityState==='visible')navigator.wakeLock.request('screen').then(v=>{veille=v;if(state.souffle.k!=='cours')veilleOff();},()=>{});}catch(e){}}
function veilleOff(){try{if(veille)veille.release();}catch(e){}veille=null;}
function souffleStart(){
  const s=state.souffle;souffleStop();
  s.k='cours';s.ph='';s.cyc=-1;s.t0=performance.now()+1400;s.hid=0;
  veilleOn();
}
function souffleStop(){
  const s=state.souffle;if(s.raf){(window.cancelAnimationFrame||clearTimeout)(s.raf);s.raf=0;}
  if(s.k==='cours')s.k='pret';
  veilleOff();
}
/* Où est la goutte sur la photo affichée ? Le cercle se pose autour du point où elle touche l'eau. */
function soufflePose(){
  const host=document.querySelector('.souffle .band');const r=document.querySelector('.souffle .ronds');if(!host||!r||!r.style)return;
  const g=eauGeo(host);if(!g)return;
  const x=(434-g.ox)*g.k,y=(259-g.oy)*g.k;
  const w=Math.max(150,Math.min(g.w*.92,470*g.k*1.25));
  r.style.left=Math.round(x)+'px';r.style.top=Math.round(y)+'px';r.style.width=Math.round(w)+'px';r.style.height=Math.round(w*.27)+'px';
}
function souffleMots(ph,cyc){
  const mot=document.getElementById('souffle-mot'),aide=document.getElementById('souffle-aide'),tours=document.querySelector('.souffle .tours');
  const M={avant:['Installez-vous','Posez vos épaules et vos pieds. Le cercle va vous guider.'],in:['Inspirez','Par le nez, pendant que le cercle s’ouvre.'],out:['Expirez','Par la bouche, lentement, pendant que le cercle se referme.']}[ph];
  if(mot&&M&&mot.textContent!==M[0])mot.textContent=M[0];
  if(aide&&M&&aide.textContent!==M[1])aide.textContent=M[1];
  if(tours&&tours.children)for(let i=0;i<tours.children.length;i++){const c=i<cyc?'f':(i===cyc?'c':'');if(tours.children[i].className!==c)tours.children[i].className=c;}
}
function souffleFrame(){
  const s=state.souffle;s.raf=0;
  if(s.k!=='cours'||state.view!=='souffle')return;
  const T=SOUFFLE.in+SOUFFLE.out,t=(performance.now()-s.t0)/1000;
  let ph='avant',cyc=-1,e=0;
  if(t>=0){
    cyc=Math.floor(t/T);
    if(cyc>=SOUFFLE.n){s.k='fini';veilleOff();noteRecent('exo','breath');render();return;}
    const u=t-cyc*T;ph=u<SOUFFLE.in?'in':'out';
    const p=ph==='in'?u/SOUFFLE.in:1-(u-SOUFFLE.in)/SOUFFLE.out;e=.5-.5*Math.cos(Math.PI*p);
  }
  if(ph!==s.ph||cyc!==s.cyc){
    s.ph=ph;s.cyc=cyc;souffleMots(ph,cyc);
    /* À chaque expiration, une onde part de la goutte et s'éloigne sur l'étang. */
    if(ph==='out'&&fxOn())eauReady(()=>{if(state.view!=='souffle'||state.souffle.k!=='cours')return;const host=document.querySelector('.souffle .band');if(host&&eauHost(host)){eauAdd(434,259,.75,0);eauAdd(434,259,.4,.6);}});
  }
  const r=document.querySelector('.souffle .ronds');
  if(r&&r.style&&fxOn())r.style.setProperty('--s',(.36+.64*e).toFixed(3));
  s.raf=(window.requestAnimationFrame||(f=>setTimeout(f,50)))(souffleFrame);
}
/* Après chaque rendu de l'écran : le cercle retrouve sa place, et la respiration reprend là où elle en était. */
function souffleApres(){
  if(state.view!=='souffle')return;
  soufflePose();
  const s=state.souffle;
  if(s.k==='cours'){souffleMots(s.ph||'avant',s.cyc);if(!s.raf)s.raf=(window.requestAnimationFrame||(f=>setTimeout(f,50)))(souffleFrame);}
}
function viewSouffle(){
  const s=state.souffle;const k=s.k;
  const tours='<div class="tours" aria-hidden="true">'+Array.from({length:SOUFFLE.n},()=>'<i></i>').join('')+'</div>';
  let bas='';
  if(k==='cours')bas='<h1 class="sr">Souffler 2 minutes</h1><p class="mot" id="souffle-mot" role="status">Installez-vous</p><p class="aide" id="souffle-aide">Posez vos épaules et vos pieds. Le cercle va vous guider.</p>'+tours+
    '<div class="actions"><button type="button" class="btn ghost" data-act="souffle-stop">'+I.stop+'Arrêter</button></div>';
  else if(k==='fini')bas='<h1 class="sr">Souffler 2 minutes</h1><p class="mot" id="souffle-mot" role="status">Voilà.</p><p class="aide">Vous venez de prendre 2 minutes rien que pour vous. Vous êtes aussi une personne, et pas seulement un parent.</p>'+
    '<div class="actions col"><button type="button" class="btn primary wide" data-act="go" data-view="today">'+I.sun2+'Revenir à aujourd’hui</button><button type="button" class="btn wide" data-act="porte" data-v="deposer">'+I.drop+'Déposer ce qui pèse</button><button type="button" class="btn ghost wide" data-act="souffle-go">'+I.wind+'Encore 2 minutes</button></div>';
  else bas='<h1 class="mot" id="souffle-mot">Souffler 2 minutes</h1><p class="aide">Vous inspirez par le nez pendant 4 secondes, puis vous expirez par la bouche pendant 6 secondes. Le cercle posé sur l’eau vous guide.</p>'+
    '<div class="actions"><button type="button" class="btn primary" data-act="souffle-go">'+I.wind+'Commencer</button></div>';
  return '<main id="main" tabindex="-1" class="view souffle s-'+k+'" style="padding-top:0"><header class="bar sub"><button type="button" class="back" data-act="back">'+I.back+'Retour</button><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>'+
    '<div class="band bleed" style="background-image:url('+HERO+')"><span class="ronds" aria-hidden="true"><i></i><i></i></span></div>'+
    '<div class="resp">'+bas+'</div></main>';
}

/* ---------- qui parle, dans cet espace ---------- */
/* Une feuille courte, ouverte depuis la dose, depuis la réponse à un dépôt et depuis « Moi ».
   Elle dit ce que l'application choisit, ce qui vient d'Antonio, et ce que la formule « Avec Antonio » montre en démonstration. */
function sheetVoix(sheetIn){
  const ia=!!state.sample;
  return '<div class="backdrop" data-act="sheet-close"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="voix-t" tabindex="-1"><div class="sheet-in voix"><div class="grab"></div><h2 id="voix-t">Qui vous parle ici ?</h2>'+
    '<div class="qui"><h3>Ce que l’application choisit</h3><p>'+(ia?'La dose du jour et les pistes proposées sont des textes écrits à l’avance, et l’application choisit lequel vous montrer. Quand vous déposez, la réponse est écrite par une intelligence artificielle, et l’espace vous le dit à chaque fois.':'La dose du jour, la question et la lumière que vous recevez après un dépôt et les pistes proposées sont des textes écrits à l’avance. L’application choisit lequel vous montrer, selon le jour et selon quelques mots de votre texte. Personne ne lit ce que vous écrivez, et rien ne quitte votre appareil.')+'</p></div>'+
    '<div class="qui"><h3>Ce qui vient d’Antonio</h3><p>Les passages « Ce que j’ai vécu » et la page « Mon histoire » racontent ce qu’Antonio Company a vraiment vécu, comme enfant accueilli, comme travailleur social et comme père. Les autres textes de l’espace sont publiés sous sa responsabilité.</p></div>'+
    '<div class="qui"><h3>Ce que la formule Avec Antonio montre aujourd’hui</h3><p>Dans cette formule, Antonio vous écrira un mot chaque mois et répondra à 2 questions par mois. Dans cette version de test, vous pouvez l’essayer sans payer, mais le mot affiché est un exemple et rien ne lui est transmis.</p></div>'+
    '<button type="button" class="btn primary wide" data-act="sheet-close">J’ai compris</button></div></div>';
}

/* ---------- pour un visiteur arrivé par un lien : le haut et le bas des pages publiques ---------- */
function barPub(){
  return '<header class="bar pubbar"><a class="wordmark" href="'+RACINE+'" data-act="accueil">'+LOGO+'<span>Parent écouté<small>parent éclairé</small></span></a><button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>';
}
function piedPub(){
  return '<section class="invite" aria-labelledby="invite-t"><h2 id="invite-t">Cette fiche vient d’un espace d’écoute pour les parents</h2><p>« Parent Écouté, Parent Éclairé » a été créé par Antonio Company, travailleur social et père de 3 enfants. Vous pouvez y souffler, y déposer ce qui pèse et y recevoir chaque jour une dose de lumière. C’est gratuit pour commencer, et il n’y a pas de compte à créer.</p>'+
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
    (state.confirmEssai?'<div class="confirm" role="alert"><span>Effacer ce que contient la version d’essai sur cet appareil ?</span><div class="row"><button type="button" class="btn danger" data-act="essai-zero-oui">Oui, effacer</button><button type="button" class="btn" data-act="essai-zero-non">Annuler</button></div></div>':'<button type="button" class="btn" data-act="essai-zero" style="align-self:flex-start">Revoir la version d’essai depuis le début</button>')+'</div>';
}
