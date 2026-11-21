
/* ---------- les 2 films (version d'essai seulement) ---------- */
/* « Ce qu'on ne dit pas par SMS » est le film de présentation : 1 minute 47, sans paroles, avec une musique originale. C'est lui que l'accueil propose.
   « Et vous ? » (35 secondes) reste la capsule de respiration. Elle garde ses fichiers et s'ouvre par son adresse, …/#capsule.
   Tant que le parent ne l'a pas demandé, rien n'est chargé : ni la vidéo, ni son affiche.
   Le lecteur s'ouvre par-dessus l'accueil, qui ne bouge pas dessous. « Fermer », la touche Échap ou le bouton Retour du téléphone
   arrêtent le son et rendent la page comme elle était, au même endroit.
   Pour le film de présentation, le parent choisit d'emblée (demande d'Antonio, le 20 novembre 2026 au soir) : « Regarder avec la musique » ou « Regarder en silence ».
   Un seul toucher sur le premier bouton ouvre le lecteur et lance le film avec son son, dans le même geste : on entend la vibration du téléphone dès le début.
   Rien n'est gardé d'une fois sur l'autre : à chaque ouverture, c'est le bouton touché qui décide. Pendant le film, le bouton du son de la barre du bas reste là.
   La capsule, elle, démarre toujours en silence, et le son ne vient que si le parent touche « Activer le son ».
   À la fin, un vrai bouton apparaît sous la vidéo. Après le film de présentation, « Ouvrir mon espace » : il fait ce que fait le bouton du même nom sur l'accueil.
   Après la capsule, « Souffler 2 minutes » : il ouvre l'exercice à son écran de départ, comme la porte de l'accueil. Dans les 2 cas, le bouton Retour ramène à l'accueil.
   Les prix et le détail des offres ne sont pas dans le lecteur : ils restent sur leur page.
   FILM vaut « pret » (le lecteur n'existe que par l'adresse …/#film, le temps de vérifier que la vidéo se lit en ligne)
   ou « actif » (le film est proposé sur l'accueil, juste après les 3 portes, avec ses 2 boutons). Sans ce réglage, rien de tout cela n'existe. */
const FILM_ON=!!(SITE&&FILM);
const FILM_HASH='#film',CAPSULE_HASH='#capsule';
/* Le film qu'une adresse demande : « film », « capsule », ou rien. */
function filmDe(h){return FILM_ON?(h===FILM_HASH?'film':(h===CAPSULE_HASH?'capsule':'')):'';}
const FILM_LIEN=(!PRE&&typeof location!=='undefined')?filmDe(location.hash):'';
const FV={ouvert:false,el:null,vid:null,pousse:false,silence:false,vol:1,att:0,volOK:true,y:0,erreur:false,quel:'film',par:'son'};
const FI={
  jouer:'<svg class="i fi-plein" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  pause:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>',
  revoir:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5"/><path d="M4.5 4.5v4h4"/></svg>',
  son:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3l4.5-4v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  muet:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3l4.5-4v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
  fermer:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};
/* Ce que chaque film montre, pour la personne qui ne le voit pas. */
const FILM_DESC='Ce film dure 1 minute 47 et ne comporte aucune parole. Sa musique est originale, au piano puis au violoncelle, et vous pouvez aussi le regarder en silence. Les photos illustrent une fiction. Le soir, dans une cuisine, un téléphone posé sur une table en chêne vibre 2 fois, et son écran s’allume. Élise demande à un père comment va sa fille. Il répond qu’elle va bien. Sa main reste immobile près d’un verre d’eau. Une phrase dit pour qui ce site est fait, les parents d’un enfant, d’un ado ou d’un adulte en situation de handicap. Le père ouvre Déposer ce qui pèse. À la question sur ce qu’il aimerait qu’on comprenne de sa journée, il écrit que jouer avec sa fille lui manque. Dans son carnet de route, il retrouve un geste qu’il avait choisi, Poser les mains à plat. Ses 2 mains se posent sur la table, de chaque côté du téléphone éteint. Le lendemain, le minuteur visuel arrive au bout du temps. Sa fille adolescente, qui porte un appareil auditif, écarte elle-même la tablette. Entre eux, les dominos sont sortis. Elle pose une pièce sur le bois. Il relève les yeux, elle le regarde et elle sourit. Dans une autre famille, Bastien, un adulte qui se déplace en fauteuil roulant, prépare avec sa mère un week-end chez son oncle Rémi. Dans Passer le relais, c’est lui qui choisit la phrase de sa fiche, J’aime prendre mon café seul, le matin. Il tend la feuille pliée à Rémi, qui la reçoit en souriant. Le dimanche matin, près de la fenêtre, Bastien boit son café, seul, comme il l’avait demandé. Le film revient à la table du père, devant la même conversation. Cette fois, c’est lui qui écrit à Élise. Il lui demande si elle a 5 minutes ce soir, parce qu’il aimerait lui raconter sa journée. Il envoie son message. Le film se termine sur ces mots, Parent écouté, parent éclairé. Ici, on commence par vous. À la fin, un bouton Ouvrir mon espace apparaît sous le film.';
const CAPSULE_DESC='Ce film dure 35 secondes et ne comporte aucune parole. Il démarre sans le son, et le bouton Activer le son le fait entendre. Le soir, dans une cuisine, un parent reçoit un message qui lui demande comment va sa fille. Il écrit qu’elle va bien, laisse passer un instant, puis envoie sa réponse et retourne son téléphone sur la table. Il repose son verre d’eau. Le cercle né à la surface devient une onde sur un étang, et 2 mots apparaissent, Et vous ? Le parent reprend son téléphone et touche Souffler 2 minutes dans Parent écouté, parent éclairé. L’écran l’invite à s’installer. Une goutte monte pendant l’inspiration, puis redescend pendant l’expiration. Le film se termine sur ces mots, Ici, on commence par vous. À la fin, un bouton Souffler 2 minutes apparaît sous le film et ouvre l’exercice.';
/* Ce qui est dit à la personne qui ne voit pas l'écran, quand le film est fini. */
const FILM_FIN='Le film est terminé. Juste après la vidéo, le bouton Ouvrir mon espace ouvre votre espace.';
const CAPSULE_FIN='Le film est terminé. Juste après la vidéo, le bouton Souffler 2 minutes ouvre l’exercice.';
/* t : le titre. s : la durée en mots. f : le début du nom des fichiers. a : le début du nom des affiches. d : la durée en secondes. */
const FILMS={
  film:{t:'Ce qu’on ne dit pas par SMS',s:'1 minute 47, sans paroles',f:'ce-quon-ne-dit-pas-par-sms',a:'affiche-film',d:107,desc:FILM_DESC,fin:FILM_FIN},
  capsule:{t:'Et vous ?',s:'35 secondes, sans paroles',f:'et-vous',a:'affiche',d:35,desc:CAPSULE_DESC,fin:CAPSULE_FIN}
};
/* Sur l'accueil, après les 3 portes : le film, sa durée, et 2 boutons. Le premier le lance avec sa musique, le second en silence.
   L'image pèse quelques kilo-octets, et le film n'est demandé qu'au toucher d'un des 2 boutons. */
function filmCmdHtml(){
  if(!FILM_ON||FILM!=='actif')return '';
  return '<div class="film-cmd" role="group" aria-labelledby="film-cmd-t"><span class="film-vig" aria-hidden="true"><img src="'+RACINE+'film/apercu-film.webp?v='+FILM_V+'" alt="" width="112" height="63" loading="lazy" decoding="async"></span>'+
    '<span class="film-lib"><b id="film-cmd-t">Le film</b><small>'+FILMS.film.s+'</small></span>'+
    '<span class="film-choix"><button type="button" class="btn primary film-c" data-act="film" data-v="son">'+FI.son+'<span>Regarder avec la musique</span></button>'+
    '<button type="button" class="btn film-c" data-act="film" data-v="silence">'+FI.muet+'<span>Regarder en silence</span></button></span></div>';
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
  /* En silence, le bouton du son est clair et porte ses mots, « Activer le son ». Avec le son, il devient un bouton rond, « Couper le son », et le curseur du volume revient. */
  const muet=v.muted||v.volume===0;
  FV.el.classList.toggle('muet',muet);
  if(s&&s.getAttribute('data-muet')!==(muet?'1':'0')){
    s.setAttribute('data-muet',muet?'1':'0');s.classList.toggle('film-act',muet);
    s.innerHTML=muet?FI.muet+'<span>Activer le son</span>':FI.son;
    if(muet)s.removeAttribute('aria-label');else s.setAttribute('aria-label','Couper le son');
  }
  /* Tant que le film de présentation attend avec ses 2 boutons, le bouton du son de la barre s'efface : ce sont eux qui règlent le son. */
  if(s)s.hidden=!!(g&&!g.hidden&&FV.quel==='film');
  if(vol){vol.hidden=!FV.volOK||muet;if(!muet&&document.activeElement!==vol)vol.value=String(Math.round(v.volume*100));}
  /* Le film est fini : la suite vient sous la vidéo. Elle s'en va si le parent revoit le film. */
  const su=FV.el.querySelector('#film-suite'),fin=FV.el.querySelector('#film-fin'),fini=!!v.ended&&!FV.erreur;
  if(su&&su.hidden===fini){su.hidden=!fini;if(fin)fin.textContent=fini?FILMS[FV.quel].fin:'';}
}
function filmAvance(){
  const v=FV.vid;if(!v||!FV.el)return;const d=v.duration>0&&isFinite(v.duration)?v.duration:FILMS[FV.quel].d;
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
    /* Le navigateur attend un geste (lecteur ouvert par son adresse) : les boutons du départ restent là. Une lecture interrompue par une pause n'est pas une erreur. */
    if(err&&(err.name==='NotAllowedError'||err.name==='AbortError')){filmEtat('');filmSync();}else filmErreur();});
  filmSync();
}
function filmSon(){
  const v=FV.vid;if(!v)return;
  if(v.muted||v.volume===0){v.muted=false;if(v.volume===0&&FV.volOK){try{v.volume=FV.vol>0?FV.vol:1;}catch(e){}}}
  else v.muted=true;
  filmSync();
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
  else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){try{v.currentTime=Math.min(Math.max(0,v.currentTime+(e.key==='ArrowRight'?5:-5)),(v.duration||FILMS[FV.quel].d)-.05);}catch(x){}}
}
/* Quand l'écran s'éteint ou que l'on change d'onglet, le film se met en pause. Il reprendra où il en était, au geste du parent. */
function filmCache(){if(FV.ouvert&&FV.vid&&document.visibilityState==='hidden'&&!FV.vid.paused){try{FV.vid.pause();}catch(e){}}}
/* L'accueil ne défile pas sous le lecteur : un doigt qui glisse ou la molette ne déplacent rien (le curseur du volume, lui, répond). */
function filmFige(e){const t=e.target;if(t&&t.id==='film-vol')return;if(e.touches&&e.touches.length>1)return;if(e.cancelable)e.preventDefault();}
function filmClic(e){
  if(!FV.el)return;const b=e.target.closest&&e.target.closest('[data-film]');
  if(b){const q=b.getAttribute('data-film');if(q==='fermer')filmFerme(false);else if(q==='jouer')filmJoue();else if(q==='avec')filmChoix(true);else if(q==='sans')filmChoix(false);else if(q==='son')filmSon();else if(q==='souffle')filmSouffle();else if(q==='espace')filmEspace();return;}
  if(e.target===FV.vid)filmJoue();
}
/* « Regarder avec la musique » ou « Regarder en silence », quand le lecteur attend (il s'est ouvert par son adresse) : le son est réglé, puis la lecture commence, dans le même geste. */
function filmChoix(avecSon){
  const v=FV.vid;if(!v||FV.erreur)return;
  v.muted=!avecSon;if(avecSon&&v.volume===0&&FV.volOK){try{v.volume=FV.vol>0?FV.vol:1;}catch(e){}}
  filmJoue();
  const j=FV.el&&FV.el.querySelector('#film-j');if(j&&j.focus){try{j.focus({preventScroll:true});}catch(e){j.focus();}}
}
/* lance : vrai quand le parent vient de toucher un des 2 boutons de l'accueil (la lecture commence), faux quand le lecteur s'ouvre par son adresse (il attend).
   lequel : « film » (le film de présentation, par défaut) ou « capsule » (la capsule de respiration de 35 secondes).
   son : vrai pour « Regarder avec la musique ». Le film part alors avec son son, dans le geste du parent. */
function filmOuvre(lance,lequel,son){
  if(!FILM_ON||FV.ouvert||PRE)return;
  FV.quel=lequel==='capsule'?'capsule':'film';const F=FILMS[FV.quel];if(lance)FV.par=son===true?'son':'silence';
  const quel=filmFormat(),base=RACINE+'film/',q='?v='+FILM_V,src=base+F.f+'-'+(quel==='vertical'?'vertical':'horizontal')+'.mp4'+q;
  /* Un seul son à la fois : celui de l'étang ou de la dose se tait. */
  try{if(SON.etat!=='off')sonCoupe(true);}catch(e){}
  const el=document.createElement('div');el.className='film-l '+(quel==='vertical'?'fv':'fh');el.id='film-l';
  el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','film-t');el.setAttribute('aria-describedby','film-d');
  el.innerHTML=
    '<div class="film-haut"><h2 id="film-t">'+F.t+'<small>'+F.s+'</small></h2><button type="button" class="film-x" data-film="fermer" aria-label="Fermer le film">'+FI.fermer+'</button></div>'+
    '<div class="film-scene"><video id="film-v" playsinline webkit-playsinline preload="none" tabindex="-1" data-src="'+src+'" poster="'+base+F.a+'-'+(quel==='vertical'?'verticale':'horizontale')+'.webp'+q+'" width="'+(quel==='vertical'?1080:1920)+'" height="'+(quel==='vertical'?1920:1080)+'"></video>'+
      (FV.quel==='capsule'?'<button type="button" class="film-go" data-film="jouer">'+FI.jouer+'<span>Lire le film</span></button>'
        :'<div class="film-go film-go2"><button type="button" class="film-g1" data-film="avec">'+FI.son+'<span>Regarder avec la musique</span></button><button type="button" class="film-g2" data-film="sans">'+FI.muet+'<span>Regarder en silence</span></button></div>')+
      '<p class="film-etat" role="status" hidden></p></div>'+
    '<div class="film-suite" id="film-suite" hidden>'+(FV.quel==='capsule'?'<button type="button" class="film-souffle" data-film="souffle">'+I.wind+'<span>Souffler 2 minutes</span></button>':'<button type="button" class="film-souffle" data-film="espace">'+I.sun2+'<span>Ouvrir mon espace</span></button>')+'</div>'+
    '<div class="film-bas"><button type="button" class="film-b" data-film="jouer" id="film-j" aria-label="Lire le film">'+FI.jouer+'</button>'+
      '<span class="film-av" aria-hidden="true"><i id="film-p"></i></span><span class="film-tps" id="film-tps" aria-hidden="true">0:00</span>'+
      '<button type="button" class="film-b film-act" data-film="son" id="film-s" data-muet="1">'+FI.muet+'<span>Activer le son</span></button>'+
      '<input type="range" class="film-vol" id="film-vol" min="5" max="100" step="5" value="100" aria-label="Volume du film" hidden></div>'+
    '<p class="sr" id="film-d">'+F.desc+'</p><p class="sr" id="film-fin" role="status"></p>';
  const v=el.querySelector('video');FV.el=el;FV.vid=v;FV.ouvert=true;FV.erreur=false;FV.pousse=false;
  /* Sur iPhone, le volume se règle avec les boutons du téléphone : la page ne peut pas le changer, et le curseur ne servirait à rien. */
  try{v.volume=.5;FV.volOK=Math.abs(v.volume-.5)<.01;v.volume=FV.volOK?FV.vol:1;}catch(e){FV.volOK=false;}
  /* La capsule démarre en silence. Le film de présentation suit le bouton que le parent vient de toucher. */
  v.muted=!(FV.quel==='film'&&son===true);
  ['play','playing','pause','ended','volumechange','seeked'].forEach(n=>v.addEventListener(n,()=>{if(n==='playing'||n==='pause'||n==='ended'){clearTimeout(FV.att);if(!FV.erreur)filmEtat('');}if(n==='volumechange'&&FV.vid){if(FV.volOK&&!FV.vid.muted&&FV.vid.volume>0)FV.vol=FV.vid.volume;}filmSync();filmAvance();}));
  v.addEventListener('timeupdate',filmAvance);
  v.addEventListener('waiting',()=>{clearTimeout(FV.att);FV.att=setTimeout(()=>{if(FV.ouvert&&FV.vid&&!FV.vid.paused&&FV.vid.readyState<3&&!FV.erreur)filmEtat('Le film se charge.');},700);});
  v.addEventListener('error',()=>{if(FV.vid&&FV.vid.getAttribute('src'))filmErreur();});
  el.addEventListener('click',filmClic);
  el.addEventListener('touchmove',filmFige,{passive:false});el.addEventListener('wheel',filmFige,{passive:false});
  FV.y=Math.round(window.scrollY||window.pageYOffset||0);
  el.querySelector('#film-vol').addEventListener('input',e=>{const x=Math.min(1,Math.max(.05,(+e.target.value||0)/100));try{v.volume=x;}catch(err){}});
  document.addEventListener('keydown',filmTouches,true);
  document.addEventListener('visibilitychange',filmCache);
  /* L'accueil reste dessous, à sa place. Il ne répond plus au clavier ni aux lecteurs d'écran tant que le lecteur est ouvert. */
  const a=document.getElementById('app');if(a){try{a.inert=true;}catch(e){}a.setAttribute('aria-hidden','true');}
  document.documentElement.classList.add('film-ouvert');
  document.body.appendChild(el);
  filmSync();
  if(lance){
    /* Une page de plus dans l'historique, à la même adresse : le bouton Retour du téléphone ferme le lecteur sans quitter l'accueil. */
    /* Juste avant, la page de l'accueil note où le parent en est : c'est là qu'un retour depuis l'exercice le ramènera (voir filmSouffle). */
    if(HIST.ok){try{const cur=history.state||{},y=Math.round(window.scrollY||window.pageYOffset||0);if(cur.pepe){cur.y=y;cur.t=Date.now();history.replaceState(cur,'');}history.pushState(Object.assign({},cur,{film:1,y:y}),'',location.pathname+location.search+location.hash);FV.pousse=true;}catch(e){}}
    filmJoue();
  }
  const f=el.querySelector(lance?'#film-j':'.film-go button, button.film-go');if(f&&f.focus){try{f.focus({preventScroll:true});}catch(e){f.focus();}}
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
  /* Le clavier revient sur le bouton qui avait ouvert le film. */
  const c=document.querySelector('[data-act="film"][data-v="'+(FV.par==='silence'?'silence':'son')+'"]')||document.querySelector('[data-act="film"]');if(c&&c.focus){try{c.focus({preventScroll:true});}catch(e){c.focus();}}
}
/* « Souffler 2 minutes », sous le film quand il est fini. Le lecteur se ferme, puis l'exercice s'ouvre à son écran de départ par le même chemin que la porte
   de l'accueil (en silence). Tout se passe dans le geste du parent, sans attendre : l'exercice peut ainsi garder l'écran allumé, comme par la porte.
   La page que le lecteur avait ajoutée à l'historique n'est pas défaite : elle devient celle de l'exercice (HIST.unefois, lu par histPush).
   Il n'y a donc qu'une page entre l'accueil et l'exercice, et le bouton Retour ramène à l'accueil, à l'endroit noté à l'ouverture du lecteur. */
function filmSouffle(){
  if(!FV.ouvert)return;
  const pousse=FV.pousse;
  filmFerme(true);
  HIST.unefois=!!(pousse&&HIST.ok);
  handle('porte',{v:'souffle'},null);
  HIST.unefois=false;
}
/* « Ouvrir mon espace », sous le film de présentation quand il est fini. Le lecteur se ferme, puis l'espace s'ouvre par le même chemin que le bouton
   du même nom sur l'accueil. Comme pour « Souffler 2 minutes », la page que le lecteur avait ajoutée devient celle de l'espace : le bouton Retour ramène à l'accueil. */
function filmEspace(){
  if(!FV.ouvert)return;
  const pousse=FV.pousse;
  filmFerme(true);
  HIST.unefois=!!(pousse&&HIST.ok);
  handle('entrer',{v:'today'},null);
  HIST.unefois=false;
}
/* Appelé au tout début du retour arrière. Rend vrai quand il n'y a rien d'autre à faire : la page n'est ni réécrite, ni déplacée. */
function filmRetour(){
  if(FV.silence){FV.silence=false;return true;}
  if(FV.ouvert&&FV.pousse){filmFerme(true);return true;}
  if(FV.ouvert)filmFerme(true);
  return false;
}
