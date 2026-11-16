
Object.assign(I,{
  drop:'<svg class="i" viewBox="0 0 24 24"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/></svg>',
  path:'<svg class="i" viewBox="0 0 24 24"><path d="M4 19c4-1 5-5 8-6s5 1 8-2"/><circle cx="4" cy="19" r="1.6" fill="currentColor"/><circle cx="20" cy="11" r="1.6" fill="currentColor"/><path d="M12 13v-3"/></svg>',
  sun2:'<svg class="i" viewBox="0 0 24 24"><path d="M4 16h16M6 16a6 6 0 0 1 12 0"/><path d="M12 4v2M5.6 7.6l1.4 1.4M18.4 7.6L17 9M2 13h2M20 13h2"/></svg>',
  chart:'<svg class="i" viewBox="0 0 24 24"><path d="M4 20V4M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/></svg>',
  image:'<svg class="i" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>',
  tag:'<svg class="i" viewBox="0 0 24 24"><path d="M3 12V4h8l9 9-8 8z"/><circle cx="7.5" cy="8.5" r="1.2" fill="currentColor"/></svg>'
});

/* ---------- state ---------- */
const DEF={me:'',age:'e',situation:'hand',weights:[],start:'',moods:{},depots:[],steps:{},evo:{},photo:null,abc:[],phrases:[],routineDone:{},three:[],onboarded:false,doseDate:'',doseText:''};
const state={data:null,view:'today',prev:null,sit:null,q:'',theme:'all',age:'all',sheet:null,toast:'',exo:null,tool:'timer',timer:{total:300,left:300,running:false,h:null},ft:{first:null,then:null,pick:'first'},confirmReset:false,sample:null,inClaude:false,busy:false,ctl:null,draft:'',month:0,step:null,evoTime:'t1',depotMode:'listen',doseBusy:false,photoText:''};
let toastTimer=null;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&typeof d==='object')return Object.assign(JSON.parse(JSON.stringify(DEF)),d);}catch(e){}return JSON.parse(JSON.stringify(DEF));}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state.data));}catch(e){}}
function toast(m){state.toast=m;renderToast();clearTimeout(toastTimer);toastTimer=setTimeout(()=>{state.toast='';renderToast();},2800);}
function renderToast(){const old=document.querySelector('.toast');if(old)old.remove();if(state.toast){const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=state.toast;document.getElementById('app').appendChild(el);}}
const D=()=>state.data;
const pad=n=>String(n).padStart(2,'0');
const todayIso=()=>{const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());};
const fmtDate=iso=>{const p=iso.split('-');return p[2]+'.'+p[1]+'.'+p[0];};
function dayIdx(n){return Math.floor(Date.now()/86400000)%n;}
function greeting(){const h=new Date().getHours();return h<5?'Il est tard':h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir';}
function weekNo(){const s=D().start||todayIso();const p=s.split('-').map(Number);const d0=new Date(p[0],p[1]-1,p[2]);return Math.max(0,Math.floor((Date.now()-d0.getTime())/(7*86400000)));}
function allSteps(){const out=[];PARCOURS.forEach((m,mi)=>m.steps.forEach((s,si)=>out.push(Object.assign({mi,si,idx:out.length},s))));return out;}
function currentStepIdx(){return Math.min(23,weekNo());}
function doneCount(){return Object.keys(D().steps).filter(k=>D().steps[k]).length;}
function curatedDose(){const i=dayIdx(DOSES.length);const sunday=new Date().getDay()===0;return sunday?DOSES[DOSES.length-1]:DOSES[i];}
function doseText(){const d=D();return d.doseDate===todayIso()&&d.doseText?d.doseText:curatedDose();}
function lastDepot(){const l=D().depots;return l.length?l[l.length-1]:null;}
function sitOfDay(){const a=D().age;const pool=SITS.filter(s=>s.ages.includes(a));return pool[dayIdx(pool.length)];}
const WEIGHTS=[['solitude','La solitude'],['fatigue','La fatigue'],['culpa','La culpabilité'],['doutes','Les doutes'],['regard','Le regard des autres'],['pros','Les professionnels'],['charge','La charge mentale'],['couple','Le couple']];

/* ---------- render ---------- */
function render(){
  const app=document.getElementById('app');let html='';
  if(!D().onboarded){app.className='app nobar';html=viewWelcome();}
  else if(state.view==='sos'){app.className='app nobar';html=viewSOS();}
  else{
    app.className='app';html+=bar();
    switch(state.view){
      case 'today':html+=viewToday();break;
      case 'depot':html+=viewDepot();break;
      case 'parcours':html+=viewParcours();break;
      case 'step':html+=viewStep();break;
      case 'evo':html+=viewEvo();break;
      case 'photo':html+=viewPhoto();break;
      case 'advice':html+=viewAdvice();break;
      case 'sit':html+=viewSit();break;
      case 'tools':html+=viewTools();break;
      case 'me':html+=viewMe();break;
      case 'exo':html+=viewExo();break;
      case 'plans':html+=viewPlans();break;
      case 'data':html+=viewData();break;
      case 'about':html+=viewAbout();break;
      default:html+=viewToday();
    }
    html+=tabs();
  }
  if(state.sheet==='menu')html+=sheetMenu();
  if(state.sheet==='onboard')html+=sheetOnboard();
  app.innerHTML=html;
  const f=document.querySelector('[data-autofocus]');if(f)f.focus();
  if(state.view==='tools'&&state.tool==='timer')drawTimer();
}
function viewWelcome(){
  return '<section class="view" style="padding-top:22px"><div class="hero reveal">'+LOGO_LIGHT+'<h1>Parent écouté,<br>parent éclairé</h1><p>Un espace d’écoute pour tout parent en chemin. Chaque jour une dose de lumière intérieure, un endroit où déposer ce qui pèse, un parcours de six mois pour changer de regard, et les outils d’un éducateur pour le quotidien.</p><div class="row"><button type="button" class="btn solid" data-act="onboard">Commencer '+I.chev+'</button><button type="button" class="btn" data-act="go-free" data-view="plans">Les formules</button></div></div>'+
    '<div class="card reveal d1"><p class="quote">« Quand un parent est écouté, il devient éclairé. Et quand il est éclairé, c’est tout son entourage qui en bénéficie. »</p><p class="hint" style="text-align:right">Antonio Company</p></div>'+
    '<div class="card reveal d2"><span class="label">Ce que vous trouverez</span><ul class="list"><li><b>Écouté</b> : vous déposez ce qui pèse, par écrit, quand vous voulez. Vous recevez une phrase-miroir, une question qui ouvre, et une lumière. Puis, si vous le souhaitez, du concret.</li><li><b>Éclairé</b> : la dose de lumière intérieure chaque jour, le parcours en 24 étapes (regard, croyances, émotions, forces de l’enfant, inclusion, autonomie), et « Mon évolution » pour voir le chemin.</li><li><b>Équipé</b> : vingt-deux situations du quotidien avec les pistes d’un éducateur, les outils de la table de cuisine, et le bouton SOS.</li></ul></div>'+
    '<div class="card green reveal d3"><span class="label">Qui vous parle</span><p>Antonio Company, éducateur social et formateur à la pratique professionnelle, vingt ans auprès de personnes en situation de handicap et de leurs familles, père de trois enfants, placé lui-même en famille d’accueil à dix ans. Il a imaginé cet accompagnement en 2025 ; le voici dans votre poche.</p></div>'+
    '<p class="hint reveal d4">Tout reste sur votre appareil. Ce que vous déposez part sans nom et n’est pas conservé ailleurs.</p></section>';
}
function bar(){
  const back=['sit','exo','step','photo','data','about','plans','evo'].includes(state.view)?'<button type="button" class="back" data-act="back">'+I.back+'Retour</button>':'';
  const wm=back?'':'<span class="wordmark">'+LOGO+'<span>Parent écouté<small>parent éclairé</small></span></span>';
  return '<header class="bar">'+back+wm+'<button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>';
}
function viewToday(){
  const d=D();const t=todayIso();const m=d.moods[t];const s=sitOfDay();const st=allSteps()[currentStepIdx()];const ld=lastDepot();
  const canPerso=!!state.sample&&ld&&(Date.now()-new Date(ld.date).getTime())<4*86400000;
  return '<section class="view"><div class="reveal"><span class="label">'+esc(fmtDate(t))+' · semaine '+(weekNo()+1)+' du parcours</span><h1 class="t1">'+esc(greeting())+(d.me?', '+esc(d.me):'')+'.</h1></div>'+
    '<div class="dose reveal d1"><span class="label">'+(new Date().getDay()===0?'Dose spéciale du dimanche':'La dose de lumière intérieure')+'</span><p>'+esc(doseText())+'</p><span class="sig">Antonio</span>'+(canPerso?'<div class="row"><button type="button" class="btn small" data-act="dose-perso"'+(state.doseBusy?' disabled':'')+'>'+I.sun2+(state.doseBusy?'Un instant…':(d.doseDate===t?'Une autre dose pour moi':'Ma dose à moi, d’après ce que j’ai déposé'))+'</button></div>':'')+'</div>'+
    '<button type="button" class="card reveal d2" data-act="go" data-view="depot" style="text-align:left;cursor:pointer"><span class="label">Écouté</span><p class="lesson" style="font-size:20px">Qu’est-ce qui pèse, là, maintenant ? Déposez-le.</p><span class="hint">'+(ld?'Dernier dépôt le '+esc(fmtDate(ld.date))+'.':'Par écrit, comme ça vient. Vous recevez une phrase-miroir, une question, une lumière.')+'</span></button>'+
    '<div class="card reveal d3"><span class="label">Et vous, comment ça va ?</span><div class="mood">'+MOODS.map((x,i)=>'<button type="button" data-act="mood" data-i="'+i+'" aria-pressed="'+(m===i)+'"><span class="e">'+x[0]+'</span>'+x[1]+'</button>').join('')+'</div>'+(m!==undefined?'<p style="font-family:var(--font-display);font-size:18px;line-height:1.4">'+esc(MOOD_WORDS[m])+'</p>':'')+'</div>'+
    '<button type="button" class="step now reveal d4" data-act="step" data-i="'+st.idx+'"><span class="n">'+(st.idx+1)+'</span><span class="tx"><span class="label">Éclairé · l’étape de la semaine</span><b>'+esc(st.t)+'</b><span>'+esc(PARCOURS[st.mi].m)+'</span></span><span class="chev">'+I.chev+'</span></button>'+
    '<button type="button" class="sit" data-act="sit" data-id="'+s.id+'"><span class="e">'+s.e+'</span><span class="tx"><span class="label">Équipé · le conseil du jour</span><b>'+esc(s.t)+'</b><span>'+esc(s.s)+'</span></span><span class="chev">'+I.chev+'</span></button>'+
    '<div class="quick"><button type="button" class="tile" data-act="go" data-view="tools"><span class="ic">'+I.tools+'</span><b>Les outils</b><span>Minuteur, d’abord-ensuite, routine</span></button><button type="button" class="tile" data-act="go" data-view="me"><span class="ic">'+I.heart+'</span><b>Pour moi</b><span>Respirer, déposer, mes droits</span></button></div></section>';
}
/* ---------- déposer ---------- */
function viewDepot(){
  const d=D();const list=d.depots.slice().reverse().slice(0,8);
  const ready=state.sample;
  const offline=ready===false?'<div class="card sun"><b>Ici, l’écoute est locale.</b><p>Dans la version complète, chaque dépôt reçoit une phrase-miroir écrite pour vous. Ici, vous recevez une question et une lumière, et votre dépôt est gardé pour vous.</p></div>':'';
  return '<section class="view"><div><h1 class="t1">Déposer</h1><p class="sub">Écrivez comme ça vient : la journée, la colère, la fatigue, le doute, la petite joie. Sans prénom. Personne ne juge, personne ne corrige.</p></div>'+offline+
    '<div class="card"><textarea id="draft" placeholder="Ce soir…" style="min-height:140px">'+esc(state.draft)+'</textarea><div class="chips"><button type="button" class="chip" data-act="dmode" data-v="listen" aria-pressed="'+(state.depotMode==='listen')+'">Je veux être écouté·e</button><button type="button" class="chip" data-act="dmode" data-v="advice" aria-pressed="'+(state.depotMode==='advice')+'">Et concrètement, je fais quoi ?</button></div><div class="quick">'+(state.busy?'<button type="button" class="btn" data-act="dstop">'+I.stop+'Arrêter</button>':'<button type="button" class="btn primary" data-act="dsend">'+I.drop+'Déposer</button>')+'<button type="button" class="btn ghost" data-act="go" data-view="me">'+I.wind+'Respirer d’abord</button></div></div>'+
    (state.busy?'<div class="mirror"><div class="think"><span class="dotp"></span>Je vous lis…</div></div>':'')+
    (list.length?'<div class="depots">'+list.map(x=>depotHtml(x)).join('')+'</div>':'')+'</section>';
}
function depotHtml(x){
  let out='<div class="mirror"><span class="lbl">'+esc(fmtDate(x.date))+(x.time?' · '+esc(x.time):'')+'</span><p class="depot you">« '+esc(x.text.length>180?x.text.slice(0,180)+'…':x.text)+' »</p>';
  if(x.miroir)out+='<p class="m">'+esc(x.miroir)+'</p>';
  if(x.question)out+='<p class="q">'+esc(x.question)+'</p>';
  if(x.lumiere)out+='<p class="l">'+esc(x.lumiere)+'</p>';
  if(x.conseil)out+='<div class="q">'+mdLite(x.conseil)+'</div>';
  if(x.miroir&&!x.conseil&&state.sample)out+='<button type="button" class="btn small" data-act="dconcret" data-id="'+x.id+'">'+I.bulb+'Et concrètement ?</button>';
  return out+'</div>';
}
const LOCAL_Q=['Qu’est-ce qui, dans tout ça, dépend vraiment de vous ?','Si une amie vivait exactement cela, que lui diriez-vous ?','Qu’est-ce qui vous a tenu debout aujourd’hui, même un peu ?','De quoi auriez-vous besoin ce soir, en une phrase ?','Qu’est-ce que votre enfant a fait aujourd’hui que vous n’avez pas eu le temps de voir ?'];
function listenPrompt(text){
  return 'Tu es la voix de « Parent Écouté, Parent Éclairé », un espace d’écoute créé par Antonio Company, éducateur social (vingt ans auprès de familles d’enfants en situation de handicap ou en difficulté, père, placé lui-même à dix ans). Un parent vient de déposer ce qui pèse. Ta tâche : l’écouter, pas le conseiller. Réponds UNIQUEMENT avec un objet JSON : {"miroir":"...","question":"...","lumiere":"..."}.\n'+
  '« miroir » : une ou deux phrases qui reformulent ce que le parent vit, avec ses mots, en nommant l’émotion probable sans l’imposer (« on dirait que… »), sans aucun conseil, sans jugement, sans minimiser. « question » : une seule question ouverte, courte, qui aide le parent à voir plus clair ou à se reconnecter à ses ressources ; jamais « pourquoi ». « lumiere » : une phrase chaleureuse et vraie, jamais mièvre, qui reconnaît ce que le parent fait déjà, ou lui donne une permission (droit à la fatigue, à la colère, au repos). Français de Suisse romande, vouvoiement, aucun prénom, aucun diagnostic. Si le message évoque un danger immédiat (idées suicidaires, violence grave), « lumiere » commence par inviter doucement à appeler le 143 (La Main Tendue) ou le 144.\n\nContexte : enfant '+AGES[D().age].toLowerCase()+' ; ce qui pèse le plus pour ce parent : '+(D().weights.length?D().weights.map(w=>(WEIGHTS.find(x=>x[0]===w)||['',w])[1].toLowerCase()).join(', '):'non précisé')+'.\n\nDÉPÔT :\n"""\n'+text.slice(0,6000)+'\n"""';
}
function advicePrompt(){
  return 'Tu es la voix de « Parent Écouté, Parent Éclairé », celle d’un éducateur social expérimenté (vingt ans auprès d’enfants, d’adolescents et d’adultes en situation de handicap ou en difficulté, formateur, père). Tu parles à un parent, en français de Suisse romande, vouvoiement, chaleur, zéro jargon, zéro jugement. Aucun diagnostic, aucun trouble nommé, aucun médicament, aucun prénom. L’enfant est : '+AGES[D().age].toLowerCase()+'.\n'+
  'Structure en quatre parties courtes avec ces titres exacts précédés de « ## » : « Ce que j’entends » (deux phrases, sans juger, qui reconnaissent l’effort), « Ce que vous pouvez essayer » (trois pistes concrètes en liste à puces, réalistes ce soir ou cette semaine : prévisibilité, moins de mots, choix entre deux options, d’abord/ensuite, routines visuelles, sécurité d’abord, observer ce qui précède), « Pour vous » (une ou deux phrases pour le parent lui-même), « Si ça continue » (une phrase : quand et à qui demander de l’aide, sans dramatiser ; pédiatre ou médecin, l’équipe de l’institution ou de l’école, Pro Infirmis, associations de parents ; La Main Tendue 143 si le parent va très mal). Maximum 200 mots. Pas de gras. Termine par une phrase courte et vraie.';
}
const RISK=/(suicid|me tuer|en finir|plus envie de vivre|le tuer|la tuer|je vais le frapper|je vais la frapper)/i;
async function sendDepot(){
  const text=state.draft.trim();if(text.length<5){toast('Écrivez quelques mots, comme ça vient.');return;}
  const d=D();const n=new Date();const dep={id:'d'+Date.now(),date:todayIso(),time:pad(n.getHours())+':'+pad(n.getMinutes()),text};
  if(RISK.test(text))toast('Si c’est urgent : 143 (La Main Tendue) ou 144. Vous n’êtes pas seul·e.');
  state.draft='';state.busy=true;render();
  if(!state.sample){
    dep.question=LOCAL_Q[dayIdx(LOCAL_Q.length)];dep.lumiere=WORDS[(dayIdx(WORDS.length)+3)%WORDS.length];
    d.depots.push(dep);state.busy=false;save();render();toast('Déposé. Gardé pour vous.');return;
  }
  state.ctl=new AbortController();
  try{
    if(state.depotMode==='advice'){
      const res=await state.sample([{role:'user',content:advicePrompt()},{role:'user',content:text}],{signal:state.ctl.signal,cache:false});
      dep.conseil=res.text;
    }else{
      const r=await state.sample.json(listenPrompt(text),{signal:state.ctl.signal,cache:false});
      dep.miroir=String((r&&r.miroir)||'').trim();dep.question=String((r&&r.question)||'').trim();dep.lumiere=String((r&&r.lumiere)||'').trim();
      if(!dep.miroir&&!dep.question){dep.question=LOCAL_Q[0];}
    }
  }catch(e){
    if(e&&e.code==='not_granted'){state.sample=false;}
    dep.question=dep.question||LOCAL_Q[dayIdx(LOCAL_Q.length)];dep.lumiere=dep.lumiere||'Déposé. Même sans réponse, c’est posé quelque part hors de vous.';
    if(e&&e.code!=='cancelled'&&e.code!=='not_granted')toast('La réponse n’est pas venue cette fois. Votre dépôt est gardé.');
  }
  d.depots.push(dep);state.busy=false;state.ctl=null;save();render();
}
async function concret(id){
  const d=D();const dep=d.depots.find(x=>x.id===id);if(!dep||!state.sample)return;
  state.busy=true;render();state.ctl=new AbortController();
  try{const res=await state.sample([{role:'user',content:advicePrompt()},{role:'user',content:dep.text}],{signal:state.ctl.signal,cache:false});dep.conseil=res.text;}
  catch(e){if(e&&e.code!=='cancelled')toast('Pas de réponse cette fois. Réessayez dans un instant.');}
  state.busy=false;state.ctl=null;save();render();
}
async function dosePerso(){
  const ld=lastDepot();if(!ld||!state.sample)return;
  state.doseBusy=true;render();
  try{
    const r=await state.sample('Tu écris « la dose de lumière intérieure » de « Parent Écouté, Parent Éclairé », créé par Antonio Company, éducateur social. Un parent a déposé ceci il y a peu : """'+ld.text.slice(0,1500)+'""" (le '+fmtDate(ld.date)+'). Écris pour lui, pour aujourd’hui '+fmtDate(todayIso())+', une dose de 45 à 70 mots : une phrase qui montre que tu as entendu ce qu’il a déposé (sans le répéter mot à mot), une phrase qui éclaire ou donne une permission, et une petite chose à faire ou à regarder aujourd’hui. Français de Suisse romande, vouvoiement, aucun prénom, aucun conseil médical, aucune mièvrerie, pas de titre, pas de guillemets, pas de signature. Réponds avec le texte seul.',{cache:false,modelTier:'quick'});
    D().doseDate=todayIso();D().doseText=r.text.trim();save();
  }catch(e){if(e&&e.code==='not_granted')state.sample=false;toast('La dose personnalisée n’est pas venue. Celle du jour reste là.');}
  state.doseBusy=false;render();
}
/* ---------- parcours ---------- */
function viewParcours(){
  const cur=currentStepIdx();const steps=allSteps();const done=doneCount();
  return '<section class="view"><div><h1 class="t1">Le parcours</h1><p class="sub">Six mois, vingt-quatre étapes, une par semaine : deux minutes à lire, une chose à essayer, une chose à observer. Vous en êtes à la semaine '+(weekNo()+1)+' · '+done+' étape'+(done>1?'s':'')+' faite'+(done>1?'s':'')+'.</p></div>'+
    '<div class="months">'+PARCOURS.map((m,mi)=>'<div class="month"><h2><span class="n">'+(mi+1)+'</span>'+esc(m.m)+'</h2>'+m.steps.map((s,si)=>{const st=steps.find(x=>x.mi===mi&&x.si===si);const dn=!!D().steps[st.idx];return '<button type="button" class="step'+(st.idx===cur?' now':'')+(dn?' done':'')+'" data-act="step" data-i="'+st.idx+'"><span class="n">'+(dn?I.check:(st.idx+1))+'</span><span class="tx"><b>'+esc(s.t)+'</b><span>'+(st.idx===cur?'Cette semaine':(st.idx<cur?'Semaine '+(st.idx+1):'Semaine '+(st.idx+1)+' · à venir'))+'</span></span><span class="chev">'+I.chev+'</span></button>';}).join('')+'</div>').join('')+'</div>'+
    '<button type="button" class="sit" data-act="go" data-view="photo"><span class="e">'+I.image+'</span><span class="tx"><b>Photolangage</b><span>Une image pour dire votre vécu, au départ et au bilan</span></span><span class="chev">'+I.chev+'</span></button>'+
    '<p class="hint">Vous pouvez avancer librement : le parcours propose un rythme, il ne l’impose pas.</p></section>';
}
function viewStep(){
  const steps=allSteps();const s=steps[state.step];if(!s){state.view='parcours';return viewParcours();}
  const dn=!!D().steps[s.idx];
  const links={evo:['go','evo',I.chart,'Faire le point dans Mon évolution'],photo:['go','photo',I.image,'Ouvrir le photolangage'],breath:['exo','breath',I.wind,'Respirer 4-6 maintenant'],advice:['go','advice',I.bulb,'Ouvrir les conseils'],pros:['sit','pros',I.bulb,'Parler aux professionnels']};
  const lk=s.link?links[s.link]:null;
  return '<section class="view"><div><span class="label">Mois '+(s.mi+1)+' · '+esc(PARCOURS[s.mi].m)+' · étape '+(s.idx+1)+' / 24</span><h1 class="t1">'+esc(s.t)+'</h1></div>'+
    '<div class="card"><span class="label">En deux minutes</span><p class="lesson">'+esc(s.lesson)+'</p><p class="hint" style="text-align:right">Antonio</p></div>'+
    '<div class="exo"><span class="label">Cette semaine, j’essaie</span><p>'+esc(s.exo)+'</p></div>'+
    '<div class="card green"><span class="label">À observer</span><p>'+esc(s.obs)+'</p></div>'+
    (lk?'<button type="button" class="btn wide" data-act="'+lk[0]+'" data-view="'+lk[1]+'" data-id="'+lk[1]+'">'+lk[2]+lk[3]+'</button>':'')+
    '<div class="quick"><button type="button" class="btn'+(dn?'':' primary')+'" data-act="stepdone" data-i="'+s.idx+'">'+I.check+(dn?'Étape faite':'Marquer comme faite')+'</button>'+(s.idx<23?'<button type="button" class="btn" data-act="step" data-i="'+(s.idx+1)+'">Étape suivante '+I.chev+'</button>':'<button type="button" class="btn" data-act="go" data-view="evo">'+I.chart+'Mon évolution</button>')+'</div></section>';
}
/* ---------- évolution ---------- */
function viewEvo(){
  const e=D().evo;const t=state.evoTime;const cur=e[t]||{};
  const chips='<div class="chips">'+EVO_TIMES.map(x=>'<button type="button" class="chip" data-act="evotime" data-v="'+x[0]+'" aria-pressed="'+(t===x[0])+'">'+x[1]+(e[x[0]]?' ✓':'')+'</button>').join('')+'</div>';
  const scales=EVO_SCALES.map(s=>'<div class="scale"><b>'+esc(s.t)+'</b><input type="range" min="0" max="10" step="1" value="'+(cur[s.id]!==undefined?cur[s.id]:5)+'" data-evo="'+s.id+'" aria-label="'+esc(s.t)+'"><div class="row"><span>0 · '+esc(s.lo)+'</span><span>10 · '+esc(s.hi)+'</span></div></div>').join('');
  const opens=EVO_OPEN.map(o=>'<div class="field"><label for="evo-'+o[0]+'">'+esc(o[1])+'</label><textarea id="evo-'+o[0]+'" data-evoopen="'+o[0]+'" style="min-height:80px">'+esc(cur[o[0]]||'')+'</textarea></div>').join('');
  const have=EVO_TIMES.filter(x=>e[x[0]]);
  let bars='';
  if(have.length){bars='<div class="card"><span class="label">Le chemin</span><div class="bars">'+EVO_SCALES.map(s=>'<div class="barrow"><span>'+esc(s.t.replace('Mon ','').replace('Ma ',''))+'</span><div class="bartrack">'+EVO_TIMES.map((x,i)=>e[x[0]]?'<i class="t'+(i+1)+'"><b style="width:'+(Number(e[x[0]][s.id]||0)*10)+'%"></b></i>':'').join('')+'</div></div>').join('')+'</div><div class="legend">'+have.map((x,i)=>'<span class="t'+(EVO_TIMES.indexOf(x)+1)+'">'+esc(x[1])+(e[x[0]].date?' · '+esc(fmtDate(e[x[0]].date)):'')+'</span>').join('')+'</div><p class="hint">Le stress et la solitude ont vocation à baisser ; la compétence, le regard et la confiance à monter. Ce qui bouge est à vous.</p></div>';}
  return '<section class="view"><div><h1 class="t1">Mon évolution</h1><p class="sub">Trois points sur six mois : départ, mi-parcours, bilan. Cinq curseurs et deux questions. Pas de bonne réponse : la vôtre, à cette date.</p></div>'+chips+bars+
    '<div class="card">'+scales+opens+'<button type="button" class="btn primary" data-act="evosave" style="align-self:flex-start">'+I.check+'Enregistrer ce point</button></div></section>';
}
/* ---------- photolangage ---------- */
function viewPhoto(){
  const p=D().photo||{};
  return '<section class="view"><div><h1 class="t1">Photolangage</h1><p class="sub">Choisissez l’image qui dit le mieux votre vécu du handicap aujourd’hui. Puis écrivez ce qu’elle évoque, et pourquoi vous l’avez choisie. Une image dit souvent ce que les mots n’osent pas.</p></div>'+
    '<div class="photos">'+PHOTOS.map((x,i)=>'<button type="button" data-act="photopick" data-i="'+i+'" aria-pressed="'+(p.i===i)+'"><span>'+x[0]+'</span>'+x[1]+'</button>').join('')+'</div>'+
    '<div class="card"><div class="field"><label for="ptext">Ce qu’elle évoque pour moi</label><textarea id="ptext" style="min-height:120px">'+esc(p.text||'')+'</textarea></div><button type="button" class="btn primary" data-act="photosave" style="align-self:flex-start">'+I.check+'Garder</button>'+(p.date?'<p class="hint">Choisi le '+esc(fmtDate(p.date))+'. Vous pourrez refaire l’exercice au bilan et comparer.</p>':'')+'</div></section>';
}
/* ---------- advice (library) ---------- */
function viewAdvice(){
  let list=SITS.filter(s=>(state.theme==='all'||s.th===state.theme)&&(state.age==='all'||s.ages.includes(state.age)));
  const q=state.q.trim().toLowerCase();if(q)list=list.filter(s=>(s.t+' '+s.s+' '+s.comp).toLowerCase().includes(q));
  return '<section class="view"><div><h1 class="t1">Les conseils</h1><p class="sub">Vingt-deux situations de la vraie vie, avec les pistes d’un éducateur, et toujours un mot pour vous.</p></div>'+
    '<div class="search">'+I.search+'<input type="search" id="q" placeholder="Chercher : coucher, crise, école…" value="'+esc(state.q)+'" autocomplete="off"></div>'+
    '<div class="chips scroll" role="group" aria-label="Âge">'+Object.keys(AGES).map(k=>'<button type="button" class="chip" data-act="age" data-v="'+k+'" aria-pressed="'+(state.age===k)+'">'+AGES[k]+'</button>').join('')+'</div>'+
    '<div class="chips scroll" role="group" aria-label="Thème">'+Object.keys(THEMES).map(k=>'<button type="button" class="chip" data-act="theme" data-v="'+k+'" aria-pressed="'+(state.theme===k)+'">'+THEMES[k]+'</button>').join('')+'</div>'+
    '<div class="sits">'+(list.length?list.map(s=>'<button type="button" class="sit" data-act="sit" data-id="'+s.id+'"><span class="e">'+s.e+'</span><span class="tx"><b>'+esc(s.t)+'</b><span>'+esc(s.s)+'</span></span><span class="chev">'+I.chev+'</span></button>').join(''):'<p class="hint">Rien pour ce mot. Déposez-le : on vous répond.</p>')+'</div></section>';
}
function viewSit(){
  const s=SITS.find(x=>x.id===state.sit);if(!s){state.view='advice';return viewAdvice();}
  const li=a=>'<ul class="list">'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  return '<section class="view"><div><span class="label">'+s.ages.map(a=>AGES[a]).join(' · ')+'</span><h1 class="t1">'+s.e+' '+esc(s.t)+'</h1><p class="sub">'+esc(s.s)+'</p></div>'+
    '<div class="card sec"><h2><span class="dot"></span>Ce qui se passe</h2><p>'+esc(s.comp)+'</p></div>'+
    '<div class="card sec ess"><h2><span class="dot"></span>Ce que vous pouvez essayer</h2>'+li(s.ess)+'</div>'+
    '<div class="card sec ev"><h2><span class="dot"></span>Ce qu’il vaut mieux éviter</h2>'+li(s.ev)+'</div>'+
    '<div class="comfort">'+esc(s.moi)+'</div>'+
    '<div class="card sec aide"><h2><span class="dot"></span>Quand demander de l’aide</h2><p>'+esc(s.aide)+'</p></div>'+
    '<div class="quick"><button type="button" class="btn" data-act="go" data-view="depot">'+I.drop+'Déposer</button><button type="button" class="btn" data-act="go" data-view="tools">'+I.tools+'Les outils</button></div></section>';
}
function viewSOS(){
  return '<section class="view sosview" style="padding-top:14px"><header class="bar"><button type="button" class="back" data-act="go" data-view="today">'+I.back+'Sortir</button></header>'+
    '<div><h1 class="t1" style="color:var(--coral)">Là, maintenant.</h1><p class="sub">Rien à réussir. Juste passer la vague. Dans l’ordre :</p></div>'+
    '<div class="sosstep"><span class="n">1</span><div class="tx"><b>Sécurité</b><span>Écartez ce qui peut blesser. Laissez de la place. Ne retenez pas si ce n’est pas nécessaire.</span></div></div>'+
    '<div class="sosstep"><span class="n">2</span><div class="tx"><b>Moins</b><span>Moins de mots, moins de lumière, moins de bruit. Une phrase, calme, répétée : « Je suis là. On attend. »</span></div></div>'+
    '<div class="sosstep"><span class="n">3</span><div class="tx"><b>Vous</b><span>Pieds au sol. Respirez avec le cercle. Vous avez le droit de sortir trente secondes si tout est sûr.</span></div></div>'+
    '<div class="breath"><div class="orbwrap"><div class="orb"></div></div><div class="txt">Inspirez… expirez…</div></div>'+
    '<div class="sosstep"><span class="n">4</span><div class="tx"><b>Après</b><span>Un verre d’eau. Un geste doux si accepté. On ne rejoue pas la scène. On ne punit pas une vague. Plus tard, notez ce qui a précédé.</span></div></div>'+
    '<div class="emg"><b>Si quelqu’un est en danger</b><span>Urgences : <span class="tel">144</span> · Police : <span class="tel">117</span></span><span>Si c’est vous qui n’en pouvez plus : La Main Tendue <span class="tel">143</span>, jour et nuit.</span></div>'+
    '<button type="button" class="btn primary wide" data-act="go" data-view="today">C’est passé. Revenir.</button><p class="hint">Ce que vous venez de faire, c’est exactement ce qu’un professionnel aurait fait.</p></section>';
}
/* ---------- tools ---------- */
function viewTools(){
  const tabs=[['timer','Minuteur'],['ft','D’abord, ensuite'],['routine','Routine'],['abc','Journal'],['phr','Mes phrases']];
  const seg='<div class="chips scroll" role="tablist">'+tabs.map(t=>'<button type="button" class="chip" data-act="tool" data-v="'+t[0]+'" aria-pressed="'+(state.tool===t[0])+'">'+t[1]+'</button>').join('')+'</div>';
  let body='';
  if(state.tool==='timer')body=toolTimer();else if(state.tool==='ft')body=toolFT();else if(state.tool==='routine')body=toolRoutine();else if(state.tool==='abc')body=toolABC();else body=toolPhr();
  return '<section class="view"><div><h1 class="t1">Les outils</h1><p class="sub">Ceux que les éducateurs utilisent tous les jours. Pour la table de la cuisine.</p></div>'+seg+body+'</section>';
}
function toolTimer(){const t=state.timer;const mins=[1,2,3,5,10,15];return '<div class="card green" style="align-items:center"><span class="label">Minuteur visuel</span><p class="hint" style="text-align:center">Le temps qui reste se voit. « Quand le vert a disparu, on range. »</p><div class="timerwrap"><div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" style="fill:none;stroke:var(--surface);stroke-width:12"/><circle id="arc" cx="60" cy="60" r="52" style="fill:none;stroke:var(--green);stroke-width:12;stroke-linecap:round;stroke-dasharray:326.7;stroke-dashoffset:0"/></svg><div class="num" id="tnum">'+Math.floor(t.left/60)+':'+pad(t.left%60)+'</div></div><div class="bigrow">'+mins.map(m=>'<button type="button" class="btn small'+(t.total===m*60?' primary':'')+'" data-act="tset" data-m="'+m+'">'+m+' min</button>').join('')+'</div><div class="bigrow"><button type="button" class="btn primary" data-act="ttoggle">'+(t.running?I.stop+'Pause':I.timer+'Lancer')+'</button><button type="button" class="btn" data-act="treset">Remettre</button></div></div></div>';}
function drawTimer(){const t=state.timer;const arc=document.getElementById('arc');const num=document.getElementById('tnum');if(!arc||!num)return;const frac=t.total?t.left/t.total:0;arc.style.strokeDashoffset=String(326.7*(1-frac));num.textContent=Math.floor(t.left/60)+':'+pad(t.left%60);arc.style.stroke=frac<.2?'var(--coral)':'var(--green)';}
function tick(){const t=state.timer;if(!t.running)return;t.left=Math.max(0,t.left-1);drawTimer();if(t.left===0){t.running=false;clearInterval(t.h);t.h=null;try{if(navigator.vibrate)navigator.vibrate([200,100,200]);}catch(e){}toast('C’est fini. Bravo.');render();}}
function stopTimer(){const t=state.timer;t.running=false;if(t.h){clearInterval(t.h);t.h=null;}}
function toolFT(){const f=state.ft;const card=(k,lbl,v,cls)=>'<button type="button" class="ftcard '+cls+'" data-act="ftpick" data-k="'+k+'" style="'+(f.pick===k?'box-shadow:var(--shadow)':'')+'"><span class="lbl">'+lbl+'</span>'+(v?'<span class="big">'+v[0]+'</span><span class="txt">'+esc(v[1])+'</span>':'<span class="hint">Choisissez en dessous</span>')+'</button>';return '<div class="card"><span class="label">Tableau « d’abord, ensuite »</span><p class="hint">D’abord ce qu’il faut faire, ensuite ce qui fait plaisir. Montrez-le, pointez-le, c’est tout.</p><div class="ft">'+card('first','D’abord',f.first,'')+card('then','Ensuite',f.then,'then')+'</div><p class="hint">Vous remplissez : <b>'+(f.pick==='first'?'D’abord':'Ensuite')+'</b></p><div class="picto">'+PICTOS.map((p,i)=>'<button type="button" data-act="ftset" data-i="'+i+'" aria-pressed="'+((f[f.pick]&&f[f.pick][1]===p[1])?'true':'false')+'"><span>'+p[0]+'</span>'+p[1]+'</button>').join('')+'</div></div>';}
function toolRoutine(){const d=D();const r=ROUTINE_DEF;const done=d.routineDone[todayIso()]||{};const all=r.every((x,i)=>done[i]);return '<div class="card"><span class="label">La routine du soir</span><p class="hint">Dans l’ordre, chaque soir pareil. L’enfant coche lui-même : c’est lui qui avance.</p><div class="routine">'+r.map((x,i)=>'<button type="button" class="rstep'+(done[i]?' done':'')+'" data-act="rdone" data-i="'+i+'"><span class="e">'+x[0]+'</span><span class="t">'+esc(x[1])+'</span><span class="ck">'+(done[i]?I.check:'')+'</span></button>').join('')+'</div>'+(all?'<div class="comfort">Tout est fait. Bonne nuit à tous les deux.</div>':'')+'<button type="button" class="btn small" data-act="rreset" style="align-self:flex-start">Remettre à zéro</button></div>';}
function toolABC(){const d=D();const list=d.abc.slice().reverse().slice(0,10);return '<div class="card"><span class="label">Journal avant, pendant, après</span><p class="hint">Trois lignes à chaque fois que ça déborde. Après trois semaines, on voit ce qui précède. C’est ce que demandera tout professionnel.</p><div class="abc"><div class="field"><label for="a1">Avant</label><input type="text" id="a1" placeholder="Où, quand, qui, quoi juste avant" autocomplete="off"></div><div class="field"><label for="a2">Pendant</label><input type="text" id="a2" placeholder="Ce qui s’est passé, combien de temps" autocomplete="off"></div><div class="field"><label for="a3">Après</label><input type="text" id="a3" placeholder="Ce qui a aidé, ce qui a suivi" autocomplete="off"></div></div><button type="button" class="btn primary" data-act="abcadd" style="align-self:flex-start">'+I.plus+'Noter</button></div>'+(list.length?'<div class="log">'+list.map(x=>'<div class="logi"><span class="d">'+esc(fmtDate(x.date))+' · '+esc(x.time)+'</span><span><b>Avant :</b> '+esc(x.a)+'</span><span><b>Pendant :</b> '+esc(x.b)+'</span><span><b>Après :</b> '+esc(x.c)+'</span></div>').join('')+'</div>':'');}
function toolPhr(){const d=D();return '<div class="card"><span class="label">Mes phrases qui marchent</span><p class="hint">Celles qui calment, qui font rire, qui débloquent. Pour vous, pour l’autre parent, pour la grand-mère qui garde samedi.</p><div class="field"><input type="text" id="ph" placeholder="Ex. : « On respire comme le dragon »" autocomplete="off"></div><button type="button" class="btn primary" data-act="phadd" style="align-self:flex-start">'+I.plus+'Garder</button>'+(d.phrases.length?'<div class="phr">'+d.phrases.map((p,i)=>'<div><span>'+esc(p)+'</span><button type="button" class="btn small ghost" data-act="phdel" data-i="'+i+'" aria-label="Retirer">'+I.trash+'</button></div>').join('')+'</div>':'')+'</div>';}
/* ---------- me ---------- */
function viewMe(){
  return '<section class="view"><div><h1 class="t1">Pour vous</h1><p class="sub">Deux minutes. Pas pour devenir un meilleur parent : pour rester une personne.</p></div>'+
    '<button type="button" class="sit" data-act="go" data-view="evo"><span class="e">'+I.chart+'</span><span class="tx"><b>Mon évolution</b><span>Départ, mi-parcours, bilan</span></span><span class="chev">'+I.chev+'</span></button>'+
    '<div class="ex">'+EXOS.map(x=>'<button type="button" class="sit" data-act="exo" data-id="'+x.id+'"><span class="e">'+I[x.ico]+'</span><span class="tx"><b>'+esc(x.t)+'</b><span>'+esc(x.s)+'</span></span><span class="chev">'+I.chev+'</span></button>').join('')+'</div>'+
    '<div class="comfort">'+esc(WORDS[(dayIdx(WORDS.length)+5)%WORDS.length])+'</div>'+
    '<button type="button" class="btn wide" data-act="go" data-view="plans">'+I.tag+'Les formules</button></section>';
}
function viewExo(){
  const x=EXOS.find(e=>e.id===state.exo);if(!x){state.view='me';return viewMe();}
  let body='';
  if(x.id==='breath')body='<div class="breath"><div class="orbwrap"><div class="orb"></div></div><div class="txt">Le cercle grandit : inspirez. Il rétrécit : expirez.</div></div>';
  else if(x.id==='trois'){const t=D().three.slice().reverse().slice(0,5);body='<div class="card"><div class="field"><input type="text" id="t1" placeholder="Une" autocomplete="off"></div><div class="field"><input type="text" id="t2" placeholder="Deux" autocomplete="off"></div><div class="field"><input type="text" id="t3" placeholder="Trois" autocomplete="off"></div><button type="button" class="btn primary" data-act="threeadd" style="align-self:flex-start">'+I.star+'Garder</button></div>'+(t.length?'<div class="log">'+t.map(e=>'<div class="logi"><span class="d">'+esc(fmtDate(e.date))+'</span><span>'+esc(e.items.join(' · '))+'</span></div>').join('')+'</div>':'');}
  else if(x.id==='deposer')body='<div class="card"><textarea id="dep" style="min-height:200px" placeholder="Tout ce qui tourne…"></textarea><button type="button" class="btn primary" data-act="depose" style="align-self:flex-start">'+I.wind+'Déposer et effacer</button><p class="hint">Rien n’est enregistré. Quand vous appuyez, le texte disparaît. Pour être écouté·e, utilisez « Déposer » sur l’accueil.</p></div>';
  else if(x.id==='droit')body='<div class="perm">'+PERMISSIONS.map(p=>'<div><b>'+esc(p[0])+'</b> '+esc(p[1])+'</div>').join('')+'</div>';
  else if(x.id==='minute')body='<div class="card green" style="align-items:center"><div class="ring" style="width:200px;height:200px"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" style="fill:none;stroke:var(--surface);stroke-width:12"/><circle id="arc" cx="60" cy="60" r="52" style="fill:none;stroke:var(--green);stroke-width:12;stroke-linecap:round;stroke-dasharray:326.7;stroke-dashoffset:0"/></svg><div class="num" id="tnum" style="font-size:44px">'+Math.floor(state.timer.left/60)+':'+pad(state.timer.left%60)+'</div></div><button type="button" class="btn primary" data-act="minute">'+(state.timer.running?I.stop+'Arrêter':I.timer+'Une minute')+'</button></div>';
  else if(x.id==='appeler')body='<div class="log">'+HELPLINES.map(h=>'<div class="logi"><b>'+esc(h[0])+'</b><span class="tel" style="font-size:22px">'+esc(h[1])+'</span><span class="hint">'+esc(h[2])+'</span></div>').join('')+'</div>';
  return '<section class="view"><div><h1 class="t1">'+esc(x.t)+'</h1>'+(x.how?'<p class="sub">'+esc(x.how)+'</p>':'')+'</div>'+body+'</section>';
}
function viewPlans(){
  return '<section class="view"><div><h1 class="t1">Les formules</h1><p class="sub">Un espace d’écoute pour tout parent en chemin. Sans engagement, résiliable à tout moment.</p></div><div class="plans">'+PLANS.map(p=>'<div class="plan'+(p.best?' best':'')+'">'+(p.best?'<span class="pill sun">Le plus choisi</span>':'')+'<h2 class="t2">'+esc(p.t)+'</h2><div class="price">'+esc(p.p)+' CHF <small>'+esc(p.per)+'</small></div><ul class="list">'+p.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul><button type="button" class="btn'+(p.best?' primary':'')+' wide" data-act="soon">'+(p.p==='0'?'Commencer gratuitement':'Choisir')+'</button></div>').join('')+'</div><p class="hint">Version de démonstration : les paiements s’ouvriront au lancement. Les prix sont ceux prévus pour la Suisse ; une version pour la France suivra.</p></section>';
}
function viewData(){
  return '<section class="view"><div><h1 class="t1">Vos données</h1><p class="sub">Tout reste sur cet appareil : vos dépôts, vos points, vos notes. Vos dépôts partent sans nom pour recevoir une réponse, et ne sont pas conservés ailleurs.</p></div><div class="card"><span class="label">Tout effacer</span>'+(state.confirmReset?'<div class="confirm"><span>Effacer tout le contenu sur cet appareil ?</span><div class="row"><button type="button" class="btn danger" data-act="reset-yes">Oui, effacer</button><button type="button" class="btn" data-act="reset-no">Annuler</button></div></div>':'<button type="button" class="btn danger" data-act="reset" style="align-self:flex-start">'+I.trash+'Effacer</button>')+'</div></section>';
}
function viewAbout(){
  return '<section class="view"><div><h1 class="t1">Pourquoi cet espace</h1></div><div class="card"><p class="quote">« Parce qu’un parent écouté devient un parent éclairé. Et un parent éclairé devient un parent confiant, aligné et pleinement acteur du bien-être de son enfant. »</p></div>'+
    '<div class="card"><span class="label">Qui parle</span><p>Antonio Company, éducateur social et formateur à la pratique professionnelle. Placé en famille d’accueil à dix ans, il a connu ce que change la présence d’une personne qui écoute. Père de trois enfants, vingt ans auprès de personnes en situation de handicap et de leurs familles. En 2025, il a imaginé « Parent Écouté, Parent Éclairé » : un accompagnement de six mois pour les parents, puis un espace d’écoute ouvert à tout parent en chemin. Cette application en est la forme qui tient dans la poche, avec lui derrière, pour celles et ceux qui le souhaitent.</p></div>'+
    '<div class="card green"><span class="label">Ce que ce n’est pas</span><ul class="list"><li>Pas un diagnostic ni une thérapie : pour ça, le pédiatre, le médecin, les thérapeutes.</li><li>Pas une urgence : en danger, le 144 ; à bout, le 143.</li><li>Pas un remplaçant des gens : un pont vers eux.</li></ul></div><p class="hint">Version de démonstration.</p></section>';
}
function tabs(){
  const cur=v=>(state.view===v||(v==='advice'&&state.view==='sit')||(v==='me'&&['exo','evo','plans'].includes(state.view))||(v==='parcours'&&['step','photo'].includes(state.view)))?' aria-current="page"':'';
  return '<nav class="tabs" aria-label="Navigation"><div class="tabs-in"><button type="button" class="tab" data-act="go" data-view="today"'+cur('today')+'>'+I.sun2+'Aujourd’hui</button><button type="button" class="tab" data-act="go" data-view="depot"'+cur('depot')+'>'+I.drop+'Déposer</button><button type="button" class="tab" data-act="go" data-view="parcours"'+cur('parcours')+'>'+I.path+'Parcours</button><button type="button" class="tab" data-act="go" data-view="advice"'+cur('advice')+'>'+I.bulb+'Conseils</button><button type="button" class="tab" data-act="menu">'+I.dots+'Plus</button></div></nav>';
}
function sheetMenu(){
  const items=[['go','tools',I.tools,'Les outils','Minuteur, d’abord-ensuite, routine, journal'],['go','me',I.heart,'Pour vous','Respirer, trois choses, vos droits'],['go','evo',I.chart,'Mon évolution',''],['go','photo',I.image,'Photolangage',''],['go','plans',I.tag,'Les formules',''],['sep'],['onboard','',I.swap,'Modifier le début',''],['go','data',I.download,'Vos données',''],['go','about',I.info,'Pourquoi cet espace','']];
  return '<div class="backdrop" data-act="sheet-close"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Menu"><div class="sheet-in"><div class="grab"></div><div class="menu">'+items.map(it=>it[0]==='sep'?'<div class="sep"></div>':'<button type="button" data-act="'+it[0]+'" data-view="'+it[1]+'">'+it[2]+'<span>'+esc(it[3])+(it[4]?'<small>'+esc(it[4])+'</small>':'')+'</span></button>').join('')+'</div></div></div>';
}
function sheetOnboard(){
  const d=D();const opt=(k,v,l)=>'<button type="button" class="chip" data-act="ob" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+(d[k]===v)+'">'+esc(l)+'</button>';
  const w=(k,l)=>'<button type="button" class="chip" data-act="obw" data-v="'+k+'" aria-pressed="'+(d.weights.includes(k))+'">'+esc(l)+'</button>';
  return '<div class="backdrop"></div><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="ob-title"><div class="sheet-in"><div class="grab"></div><h2 id="ob-title">Faisons connaissance</h2>'+
    '<div class="field"><label for="ob-me">Votre prénom (facultatif)</label><input type="text" id="ob-me" value="'+esc(d.me)+'" autocomplete="off" data-autofocus></div>'+
    '<div class="field"><label>Votre enfant est…</label><div class="chips">'+opt('age','e','un enfant')+opt('age','a','un ado')+opt('age','g','un adulte')+'</div></div>'+
    '<div class="field"><label>Votre situation</label><div class="chips">'+opt('situation','hand','handicap ou besoins particuliers')+opt('situation','diff','une période difficile')+opt('situation','parent','je suis parent, simplement')+'</div></div>'+
    '<div class="field"><label>Ce qui pèse le plus en ce moment (plusieurs possibles)</label><div class="chips">'+WEIGHTS.map(x=>w(x[0],x[1])).join('')+'</div></div>'+
    '<p class="hint">Pas de prénom pour votre enfant : rien de lui ne doit quitter votre poche.</p>'+
    '<button type="button" class="btn primary wide" data-act="ob-done">'+I.sun2+'Recevoir ma première dose</button></div></div>';
}
function mdLite(t){const lines=String(t).split('\n');let out='';let inl=false;for(const raw of lines){const l=raw.replace(/\*\*(.+?)\*\*/g,'$1');if(/^\s*[-•]\s+/.test(l)){if(!inl){out+='<ul class="list">';inl=true;}out+='<li>'+esc(l.replace(/^\s*[-•]\s+/,''))+'</li>';continue;}if(inl){out+='</ul>';inl=false;}if(/^#{1,3}\s/.test(l))out+='<p style="font-weight:800;margin-top:6px;color:var(--green)">'+esc(l.replace(/^#{1,3}\s*/,''))+'</p>';else if(l.trim())out+='<p>'+esc(l)+'</p>';}if(inl)out+='</ul>';return out;}

/* ---------- actions ---------- */
function handle(act,d){
  const data=D();
  switch(act){
    case 'onboard':state.sheet='onboard';break;
    case 'ob':data[d.k]=d.v;save();break;
    case 'obw':{const i=data.weights.indexOf(d.v);if(i>=0)data.weights.splice(i,1);else data.weights.push(d.v);save();break;}
    case 'ob-done':{const m=document.getElementById('ob-me');if(m)data.me=m.value.trim();if(!data.start)data.start=todayIso();data.onboarded=true;state.sheet=null;save();break;}
    case 'go-free':data.onboarded=true;if(!data.start)data.start=todayIso();save();state.view=d.view;break;
    case 'go':state.prev=state.view;state.view=d.view;state.sheet=null;state.confirmReset=false;if(d.view!=='tools'&&d.view!=='exo')stopTimer();break;
    case 'back':{const v=state.view;let t;if(v==='sit')t='advice';else if(v==='exo'){t='me';stopTimer();}else if(v==='step'||v==='photo')t='parcours';else if(v==='evo'||v==='plans')t='me';else t='today';if(state.prev&&state.prev!==v&&state.prev!=='sos')t=state.prev;state.prev=null;state.view=t;break;}
    case 'mood':data.moods[todayIso()]=Number(d.i);save();break;
    case 'sit':state.sit=d.id;state.prev=state.view;state.view='sit';break;
    case 'age':state.age=d.v;break;
    case 'theme':state.theme=d.v;break;
    case 'dmode':state.depotMode=d.v;break;
    case 'dsend':sendDepot();return;
    case 'dstop':if(state.ctl)state.ctl.abort();return;
    case 'dconcret':concret(d.id);return;
    case 'dose-perso':dosePerso();return;
    case 'step':state.step=Number(d.i);state.prev=state.view;state.view='step';break;
    case 'stepdone':data.steps[d.i]=!data.steps[d.i];save();if(data.steps[d.i])toast('Étape faite. Une par semaine, c’est le bon rythme.');break;
    case 'evotime':state.evoTime=d.v;break;
    case 'evosave':{const rec={date:todayIso()};EVO_SCALES.forEach(s=>{const el=document.querySelector('[data-evo="'+s.id+'"]');rec[s.id]=el?Number(el.value):5;});EVO_OPEN.forEach(o=>{const el=document.querySelector('[data-evoopen="'+o[0]+'"]');rec[o[0]]=el?el.value.trim():'';});data.evo[state.evoTime]=rec;save();render();toast('Point enregistré. Ce qui bouge est à vous.');return;}
    case 'photopick':data.photo=Object.assign({},data.photo||{},{i:Number(d.i)});save();break;
    case 'photosave':{const t=document.getElementById('ptext');data.photo=Object.assign({},data.photo||{},{text:t?t.value.trim():'',date:todayIso()});save();render();toast('Gardé.');return;}
    case 'tool':state.tool=d.v;if(d.v!=='timer')stopTimer();break;
    case 'tset':stopTimer();state.timer.total=Number(d.m)*60;state.timer.left=state.timer.total;break;
    case 'ttoggle':if(state.timer.running)stopTimer();else{if(state.timer.left===0)state.timer.left=state.timer.total;state.timer.running=true;state.timer.h=setInterval(tick,1000);}break;
    case 'treset':stopTimer();state.timer.left=state.timer.total;break;
    case 'minute':if(state.timer.running)stopTimer();else{state.timer.total=60;state.timer.left=60;state.timer.running=true;state.timer.h=setInterval(tick,1000);}break;
    case 'ftpick':state.ft.pick=d.k;break;
    case 'ftset':state.ft[state.ft.pick]=PICTOS[Number(d.i)];if(state.ft.pick==='first')state.ft.pick='then';break;
    case 'rdone':{const t=todayIso();data.routineDone[t]=data.routineDone[t]||{};data.routineDone[t][d.i]=!data.routineDone[t][d.i];save();break;}
    case 'rreset':data.routineDone[todayIso()]={};save();break;
    case 'abcadd':{const a=document.getElementById('a1').value.trim(),b=document.getElementById('a2').value.trim(),c=document.getElementById('a3').value.trim();if(!a&&!b&&!c){toast('Une ligne, au moins.');return;}const n=new Date();data.abc.push({date:todayIso(),time:pad(n.getHours())+':'+pad(n.getMinutes()),a,b,c});save();render();toast('Noté.');return;}
    case 'phadd':{const v=document.getElementById('ph').value.trim();if(!v){toast('Écrivez la phrase.');return;}data.phrases.push(v);save();render();toast('Gardée.');return;}
    case 'phdel':data.phrases.splice(Number(d.i),1);save();break;
    case 'exo':state.exo=d.id;state.prev=state.view;state.view='exo';break;
    case 'threeadd':{const items=['t1','t2','t3'].map(id=>document.getElementById(id).value.trim()).filter(Boolean);if(!items.length){toast('Une chose suffit.');return;}data.three.push({date:todayIso(),items});save();render();toast('Gardé.');return;}
    case 'depose':{const t=document.getElementById('dep');if(t)t.value='';toast('Déposé. Ce n’est plus que sur vous.');return;}
    case 'soon':toast('Les formules s’ouvrent au lancement. Merci d’être là en premier.');return;
    case 'menu':state.sheet=state.sheet==='menu'?null:'menu';break;
    case 'sheet-close':state.sheet=null;break;
    case 'reset':state.confirmReset=true;break;
    case 'reset-no':state.confirmReset=false;break;
    case 'reset-yes':state.data=JSON.parse(JSON.stringify(DEF));try{localStorage.removeItem(KEY);}catch(e){}state.confirmReset=false;state.view='today';render();toast('Effacé.');return;
    default:return;
  }
  render();
  if(['go','sit','back','exo','step','go-free'].includes(act))window.scrollTo(0,0);
}
const app=document.getElementById('app');
app.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.tagName==='A')return;handle(el.dataset.act,el.dataset);});
let typing=null;
app.addEventListener('input',e=>{const t=e.target;if(t.id==='draft')state.draft=t.value;if(t.id==='q'){state.q=t.value;clearTimeout(typing);typing=setTimeout(()=>{const pos=t.selectionStart;render();const nq=document.getElementById('q');if(nq){nq.focus();try{nq.setSelectionRange(pos,pos);}catch(e){}}},250);}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.sheet&&state.sheet!=='onboard'){state.sheet=null;render();}});
state.data=load();
state.inClaude=!!(window.claude&&typeof window.claude.use==='function');
render();
(async()=>{try{if(state.inClaude){const s=await window.claude.use('sample');state.sample=s||false;}else state.sample=false;}catch(e){state.sample=false;}render();})();
})();
</script>
