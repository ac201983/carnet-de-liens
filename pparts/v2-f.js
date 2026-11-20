
/* ---------- le film « Et vous ? » (version d'essai seulement) ---------- */
/* Le film dure 35 secondes et n'a pas de paroles. Tant que le parent ne l'a pas demandé, rien n'est chargé : ni la vidéo, ni son affiche.
   Le lecteur s'ouvre par-dessus l'accueil, qui ne bouge pas dessous. « Fermer », la touche Échap ou le bouton Retour du téléphone
   arrêtent le son et rendent la page comme elle était, au même endroit.
   FILM vaut « pret » (le lecteur n'existe que par l'adresse …/#film, le temps de vérifier que la vidéo se lit en ligne)
   ou « actif » (la commande « Voir le film » est sur l'accueil, juste après les 3 portes). Sans ce réglage, rien de tout cela n'existe. */
const FILM_ON=!!(SITE&&FILM);
const FILM_HASH='#film';
const FILM_LIEN=FILM_ON&&!PRE&&typeof location!=='undefined'&&location.hash===FILM_HASH;
const FV={ouvert:false,el:null,vid:null,pousse:false,silence:false,vol:1,muet:false,att:0,volOK:true,y:0,erreur:false};
const FI={
  jouer:'<svg class="i fi-plein" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  pause:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>',
  revoir:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5"/><path d="M4.5 4.5v4h4"/></svg>',
  son:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3l4.5-4v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  muet:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3l4.5-4v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
  fermer:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};
/* Ce que le film montre, pour la personne qui ne le voit pas. */
const FILM_DESC='Ce film dure 35 secondes et ne comporte aucune parole. Le soir, dans une cuisine, un parent reçoit un message qui lui demande comment va sa fille. Il répond qu’elle va bien, puis il retourne son téléphone sur la table. Il repose son verre d’eau. Le cercle né à la surface devient une onde sur un étang, et 2 mots apparaissent, Et vous ? Le parent reprend son téléphone, ouvre Parent écouté, parent éclairé et choisit Souffler 2 minutes. Une goutte monte pendant l’inspiration, puis redescend pendant l’expiration. Le film se termine sur ces mots, Ici, on commence par vous.';
/* La commande de l'accueil : secondaire, après les 3 portes. Son image pèse quelques kilo-octets, et le film n'est demandé qu'au toucher. */
function filmCmdHtml(){
  if(!FILM_ON||FILM!=='actif')return '';
  return '<button type="button" class="film-cmd" data-act="film" aria-label="Voir le film, 35 secondes"><span class="film-vig" aria-hidden="true"><img src="'+RACINE+'film/apercu.webp?v='+FILM_V+'" alt="" width="112" height="63" loading="lazy" decoding="async">'+FI.jouer+'</span><span class="film-lib">Voir le film · 35 secondes</span></button>';
}
/* Sur un téléphone tenu droit, le film vertical. Ailleurs, le film horizontal. */
function filmFormat(){
  let droit=false;try{droit=!!(window.matchMedia&&window.matchMedia('(orientation: portrait) and (max-width: 820px)').matches);}catch(e){}
  return droit?'vertical':'horizontal';
}
function filmTemps(s){s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function filmEtat(m,lien){
  if(!FV.el)return;const p=FV.el.querySelector('.film-etat');if(!p)return;
  p.textContent=m||'';p.hidden=!m;
  if(m&&lien){p.appendChild(document.createTextNode(' '));const a=document.createElement('a');a.href=lien;a.target='_blank';a.rel='noopener';a.textContent='Ouvrir le fichier du film';p.appendChild(a);}
}
/* Les boutons disent toujours ce que fera le prochain toucher. */
function filmSync(){
  const v=FV.vid;if(!v||!FV.el)return;
  const j=FV.el.querySelector('#film-j'),g=FV.el.querySelector('.film-go'),s=FV.el.querySelector('#film-s'),vol=FV.el.querySelector('#film-vol');
  const enCours=!v.paused&&!v.ended,debut=!(v.currentTime>0)&&!enCours;
  if(j){j.innerHTML=enCours?FI.pause:(v.ended?FI.revoir:FI.jouer);j.setAttribute('aria-label',enCours?'Mettre en pause':(v.ended?'Revoir le film':(debut?'Lire le film':'Reprendre le film')));}
  if(g)g.hidden=!debut||FV.erreur;
  FV.el.classList.toggle('en-cours',enCours);
  const muet=v.muted||v.volume===0;
  if(s){s.innerHTML=muet?FI.muet:FI.son;s.setAttribute('aria-label',muet?'Remettre le son':'Couper le son');s.setAttribute('aria-pressed',muet?'true':'false');}
  if(vol&&document.activeElement!==vol)vol.value=String(Math.round((v.muted?0:v.volume)*100));
}
function filmAvance(){
  const v=FV.vid;if(!v||!FV.el)return;const d=v.duration>0&&isFinite(v.duration)?v.duration:35;
  const p=FV.el.querySelector('#film-p'),t=FV.el.querySelector('#film-tps');
  if(p)p.style.width=(Math.min(1,Math.max(0,v.currentTime/d))*100).toFixed(2)+'%';
  if(t)t.textContent=filmTemps(v.currentTime);
}
function filmErreur(){
  if(!FV.ouvert||!FV.vid)return;FV.erreur=true;clearTimeout(FV.att);
  filmEtat('Le film ne peut pas être lu sur cet appareil.',FV.vid.getAttribute('data-src'));filmSync();
}
/* Lire, mettre en pause, reprendre ou revoir. C'est toujours un geste du parent qui lance la lecture. */
function filmJoue(){
  const v=FV.vid;if(!v||FV.erreur)return;
  if(!v.paused&&!v.ended){v.pause();filmSync();return;}
  if(v.ended){try{v.currentTime=0;}catch(e){}}
  if(!v.getAttribute('src'))v.setAttribute('src',v.getAttribute('data-src'));
  clearTimeout(FV.att);FV.att=setTimeout(()=>{if(FV.ouvert&&FV.vid&&FV.vid.readyState<3&&!FV.erreur)filmEtat('Le film se charge.');},700);
  let p;try{p=v.play();}catch(e){p=null;}
  if(p&&p.catch)p.catch(err=>{if(!FV.ouvert)return;clearTimeout(FV.att);
    /* Le navigateur attend un geste (lecteur ouvert par son adresse) : le bouton « Lire le film » reste là. Une lecture interrompue par une pause n'est pas une erreur. */
    if(err&&(err.name==='NotAllowedError'||err.name==='AbortError')){filmEtat('');filmSync();}else filmErreur();});
  filmSync();
}
function filmSon(){
  const v=FV.vid;if(!v)return;
  if(v.muted||v.volume===0){v.muted=false;if(v.volume===0&&FV.volOK){try{v.volume=FV.vol>0?FV.vol:1;}catch(e){}}}
  else v.muted=true;
  FV.muet=v.muted;filmSync();
}
function filmTouches(e){
  if(!FV.ouvert||!FV.el)return;
  if(e.key==='Escape'){e.preventDefault();filmFerme(false);return;}
  if(e.key==='Tab'){
    /* Le clavier reste dans le lecteur tant qu'il est ouvert. */
    const f=Array.prototype.slice.call(FV.el.querySelectorAll('button,input,a[href]')).filter(x=>!x.hidden&&x.offsetParent!==null);if(!f.length)return;
    /* Le lecteur conduit lui-même le tour : certains navigateurs sautent les boutons, et le parent doit pouvoir atteindre chaque commande. */
    const i=f.indexOf(document.activeElement);e.preventDefault();
    f[e.shiftKey?(i<=0?f.length-1:i-1):(i<0||i===f.length-1?0:i+1)].focus();
    return;}
  const t=e.target,n=t&&t.tagName;
  /* Les touches qui feraient défiler l'accueil, dessous, ne font rien tant que le lecteur est ouvert. */
  if(n!=='INPUT'&&['PageDown','PageUp','Home','End','ArrowDown','ArrowUp'].indexOf(e.key)>=0){e.preventDefault();return;}
  if(n==='BUTTON'||n==='INPUT'||n==='A'||e.metaKey||e.ctrlKey||e.altKey)return;
  const v=FV.vid;if(!v)return;
  if(e.key===' '||e.key==='k'||e.key==='K'){e.preventDefault();filmJoue();}
  else if(e.key==='m'||e.key==='M'){filmSon();}
  else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){try{v.currentTime=Math.min(Math.max(0,v.currentTime+(e.key==='ArrowRight'?5:-5)),(v.duration||35)-.05);}catch(x){}}
}
/* Quand l'écran s'éteint ou que l'on change d'onglet, le film se met en pause. Il reprendra où il en était, au geste du parent. */
function filmCache(){if(FV.ouvert&&FV.vid&&document.visibilityState==='hidden'&&!FV.vid.paused){try{FV.vid.pause();}catch(e){}}}
/* L'accueil ne défile pas sous le lecteur : un doigt qui glisse ou la molette ne déplacent rien (le curseur du volume, lui, répond). */
function filmFige(e){const t=e.target;if(t&&t.id==='film-vol')return;if(e.touches&&e.touches.length>1)return;if(e.cancelable)e.preventDefault();}
function filmClic(e){
  if(!FV.el)return;const b=e.target.closest&&e.target.closest('[data-film]');
  if(b){const q=b.getAttribute('data-film');if(q==='fermer')filmFerme(false);else if(q==='jouer')filmJoue();else if(q==='son')filmSon();return;}
  if(e.target===FV.vid)filmJoue();
}
/* lance : vrai quand le parent vient de toucher « Voir le film » (la lecture commence), faux quand le lecteur s'ouvre par son adresse (il attend). */
function filmOuvre(lance){
  if(!FILM_ON||FV.ouvert||PRE)return;
  const quel=filmFormat(),base=RACINE+'film/',q='?v='+FILM_V,src=base+'et-vous-'+(quel==='vertical'?'vertical':'horizontal')+'.mp4'+q;
  /* Un seul son à la fois : celui de l'étang ou de la dose se tait. */
  try{if(SON.etat!=='off')sonCoupe(true);}catch(e){}
  const el=document.createElement('div');el.className='film-l '+(quel==='vertical'?'fv':'fh');el.id='film-l';
  el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','film-t');el.setAttribute('aria-describedby','film-d');
  el.innerHTML=
    '<div class="film-haut"><h2 id="film-t">Et vous ?<small>35 secondes, sans paroles</small></h2><button type="button" class="film-x" data-film="fermer" aria-label="Fermer le film">'+FI.fermer+'</button></div>'+
    '<div class="film-scene"><video id="film-v" playsinline webkit-playsinline preload="none" tabindex="-1" data-src="'+src+'" poster="'+base+'affiche-'+(quel==='vertical'?'verticale':'horizontale')+'.webp'+q+'" width="'+(quel==='vertical'?1080:1920)+'" height="'+(quel==='vertical'?1920:1080)+'"></video>'+
      '<button type="button" class="film-go" data-film="jouer">'+FI.jouer+'<span>Lire le film</span></button>'+
      '<p class="film-etat" role="status" hidden></p></div>'+
    '<div class="film-bas"><button type="button" class="film-b" data-film="jouer" id="film-j" aria-label="Lire le film">'+FI.jouer+'</button>'+
      '<span class="film-av" aria-hidden="true"><i id="film-p"></i></span><span class="film-tps" id="film-tps" aria-hidden="true">0:00</span>'+
      '<button type="button" class="film-b" data-film="son" id="film-s" aria-pressed="false" aria-label="Couper le son">'+FI.son+'</button>'+
      '<input type="range" class="film-vol" id="film-vol" min="0" max="100" step="5" value="100" aria-label="Volume du film"></div>'+
    '<p class="sr" id="film-d">'+FILM_DESC+'</p>';
  const v=el.querySelector('video');FV.el=el;FV.vid=v;FV.ouvert=true;FV.erreur=false;FV.pousse=false;
  /* Sur iPhone, le volume se règle avec les boutons du téléphone : la page ne peut pas le changer, et le curseur ne servirait à rien. */
  try{v.volume=.5;FV.volOK=Math.abs(v.volume-.5)<.01;v.volume=FV.volOK?FV.vol:1;}catch(e){FV.volOK=false;}
  if(!FV.volOK)el.querySelector('#film-vol').hidden=true;
  v.muted=!!FV.muet;
  ['play','playing','pause','ended','volumechange','seeked'].forEach(n=>v.addEventListener(n,()=>{if(n==='playing'||n==='pause'||n==='ended'){clearTimeout(FV.att);if(!FV.erreur)filmEtat('');}if(n==='volumechange'&&FV.vid){if(FV.volOK&&!FV.vid.muted&&FV.vid.volume>0)FV.vol=FV.vid.volume;FV.muet=FV.vid.muted;}filmSync();filmAvance();}));
  v.addEventListener('timeupdate',filmAvance);
  v.addEventListener('waiting',()=>{clearTimeout(FV.att);FV.att=setTimeout(()=>{if(FV.ouvert&&FV.vid&&!FV.vid.paused&&FV.vid.readyState<3&&!FV.erreur)filmEtat('Le film se charge.');},700);});
  v.addEventListener('error',()=>{if(FV.vid&&FV.vid.getAttribute('src'))filmErreur();});
  el.addEventListener('click',filmClic);
  el.addEventListener('touchmove',filmFige,{passive:false});el.addEventListener('wheel',filmFige,{passive:false});
  FV.y=Math.round(window.scrollY||window.pageYOffset||0);
  el.querySelector('#film-vol').addEventListener('input',e=>{const x=Math.min(1,Math.max(0,(+e.target.value||0)/100));try{v.volume=x;v.muted=x===0;}catch(err){}});
  document.addEventListener('keydown',filmTouches,true);
  document.addEventListener('visibilitychange',filmCache);
  /* L'accueil reste dessous, à sa place. Il ne répond plus au clavier ni aux lecteurs d'écran tant que le lecteur est ouvert. */
  const a=document.getElementById('app');if(a){try{a.inert=true;}catch(e){}a.setAttribute('aria-hidden','true');}
  document.documentElement.classList.add('film-ouvert');
  document.body.appendChild(el);
  filmSync();
  if(lance){
    /* Une page de plus dans l'historique, à la même adresse : le bouton Retour du téléphone ferme le lecteur sans quitter l'accueil. */
    if(HIST.ok){try{const cur=history.state||{};history.pushState(Object.assign({},cur,{film:1,y:Math.round(window.scrollY||window.pageYOffset||0)}),'',location.pathname+location.search+location.hash);FV.pousse=true;}catch(e){}}
    filmJoue();
  }
  const f=el.querySelector(lance?'#film-j':'.film-go');if(f&&f.focus){try{f.focus({preventScroll:true});}catch(e){f.focus();}}
}
/* parRetour : vrai quand c'est le bouton Retour du téléphone qui ferme (la page ajoutée à l'ouverture est déjà défaite). */
function filmFerme(parRetour){
  if(!FV.ouvert)return;
  FV.ouvert=false;clearTimeout(FV.att);
  const v=FV.vid,el=FV.el;
  /* Le son s'arrête tout de suite, et plus rien n'est téléchargé. */
  if(v){try{v.pause();}catch(e){}try{v.removeAttribute('src');v.load();}catch(e){}}
  document.removeEventListener('keydown',filmTouches,true);
  document.removeEventListener('visibilitychange',filmCache);
  if(el&&el.parentNode)el.parentNode.removeChild(el);
  FV.el=null;FV.vid=null;
  document.documentElement.classList.remove('film-ouvert');
  const a=document.getElementById('app');if(a){try{a.inert=false;}catch(e){}a.removeAttribute('aria-hidden');}
  /* Le parent retrouve l'accueil à l'endroit exact où il l'avait laissé. */
  if(Math.round(window.scrollY||window.pageYOffset||0)!==FV.y)window.scrollTo(0,FV.y);
  if(FV.pousse&&!parRetour){FV.silence=true;try{history.back();}catch(e){FV.silence=false;}}
  FV.pousse=false;
  const c=document.querySelector('[data-act="film"]');if(c&&c.focus){try{c.focus({preventScroll:true});}catch(e){c.focus();}}
}
/* Appelé au tout début du retour arrière. Rend vrai quand il n'y a rien d'autre à faire : la page n'est ni réécrite, ni déplacée. */
function filmRetour(){
  if(FV.silence){FV.silence=false;return true;}
  if(FV.ouvert&&FV.pousse){filmFerme(true);return true;}
  if(FV.ouvert)filmFerme(true);
  return false;
}
