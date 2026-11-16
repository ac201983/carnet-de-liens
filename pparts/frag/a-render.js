/* ---------- rendu ---------- */
const BACK_VIEWS=['sit','exo','step','photo','data','about','plans','evo','depots','antonio','letter'];
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
  if(!D().onboarded&&state.view==='plans'){base='app nobar';key='peek';html='<header class="bar"><button type="button" class="back" data-act="back">'+I.back+'Retour</button></header>'+viewPlans();}
  else if(!D().onboarded){base='app nobar';key='intro';html=viewIntro();}
  else if(state.view==='sos'){base='app nobar';key='sos';html=viewSOS();}
  else{
    key=state.view;html+=bar();
    switch(state.view){
      case 'today':html+=viewToday();break;
      case 'parcours':html+=viewParcours();break;
      case 'step':html+=viewStep();break;
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
      default:html+=viewToday();
    }
    html+=tabs();
  }
  /* Les animations d'apparition ne jouent qu'en entrant sur un écran ou en ouvrant une feuille, pas à chaque appui. */
  const entering=key!==state.lastKey;state.lastKey=key;
  const sheetIn=!!state.sheet&&state.sheet!==state.lastSheet;state.lastSheet=state.sheet;
  if(state.sheet==='onboard')html+=sheetOnboard(sheetIn);
  if(state.sheet==='upgrade')html+=sheetUpgrade(sheetIn);
  app.className=base+(entering?' enter':'');
  app.removeAttribute('data-prerender');
  app.innerHTML=html;
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
}
function bar(){
  const back=BACK_VIEWS.includes(state.view)?'<button type="button" class="back" data-act="back">'+I.back+'Retour</button>':'';
  const wm=back?'':'<span class="wordmark">'+LOGO+'<span>Parent écouté<small>parent éclairé</small></span></span>';
  return '<header class="bar">'+back+wm+'<button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button></header>';
}
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
function viewIntro(){
  const cta=wide=>'<button type="button" class="btn primary'+(wide?' wide':'')+'" data-act="onboard">'+I.sun2+'Commencer gratuitement</button>';
  const priv=SITE?'Version de test, gratuite. Tout ce que vous écrivez reste sur votre appareil. La phrase-miroir personnalisée arrivera avec la version complète ; d’ici là, chaque dépôt reçoit une question et une lumière.':'Vos notes restent sur votre appareil. Quand vous déposez, votre texte part sans votre nom pour recevoir une réponse.';
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0">'+
    '<div class="herofull bleed"><img class="herobg" src="'+HERO+'" alt="Une goutte tombe sur un étang et dessine des cercles, dans la lumière d’une forêt." width="892" height="485" decoding="async" fetchpriority="high"><span class="pill test">Version de test</span><span class="by">Par Antonio Company</span><h1>Parent Écouté,<br>Parent Éclairé</h1><p class="tag">Un espace d’écoute pour tout parent en chemin. Déposez ce qui pèse, recevez chaque jour une dose de lumière, avancez six mois à votre rythme.</p>'+cta(false)+'</div>'+
    '<div class="pillars reveal d1">'+
    '<div class="pillar"><span class="ic">'+I.drop+'</span><div><h2>Écouté</h2><span>Vous déposez, par écrit, sans prénom. Vous recevez une phrase-miroir, une question qui ouvre, une lumière.</span></div></div>'+
    '<div class="pillar sun"><span class="ic">'+I.sun2+'</span><div><h2>Éclairé</h2><span>La dose de lumière intérieure chaque matin, et un parcours de six mois, une étape par semaine.</span></div></div>'+
    '<div class="pillar"><span class="ic">'+I.user+'</span><div><h2>Accompagné, si vous le voulez</h2><span>Antonio Company, éducateur social depuis vingt ans, vous écrit chaque mois dans la formule « Avec Antonio ».</span></div></div>'+
    '</div>'+
    '<div class="cta-stack reveal d2">'+cta(true)+'</div>'+
    '<p class="hint" style="text-align:center">'+priv+'</p></main>'+
    '<footer class="foot"><button type="button" class="linkbtn" data-act="peek-plans">Formules</button>'+(SITE?'<a href="confidentialite.html">Confidentialité</a><a href="conditions.html">Conditions générales</a>':'')+'</footer>';
}
