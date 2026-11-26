
/* ---------- boîte à outils ---------- */
function viewKit(){
  /* Un visiteur arrivé par un lien voit la liste publique des situations. Les outils et « Pour moi » sont dans l'espace. */
  const pub=!D().onboarded;
  if(pub)state.kit='sits';
  const seg=pub?'':'<div class="seg" role="group" aria-label="Rubriques de la boîte à outils"><button type="button" data-act="kit" data-v="sits" aria-pressed="'+(state.kit==='sits')+'">Situations</button><button type="button" data-act="kit" data-v="tools" aria-pressed="'+(state.kit==='tools')+'">Outils</button><button type="button" data-act="kit" data-v="me" aria-pressed="'+(state.kit==='me')+'">Pour moi</button></div>';
  let body='';
  if(state.kit==='sits')body=kitSits();else if(state.kit==='tools')body=kitTools();else body=kitMe();
  /* Arrivé par la porte « Trouver une idée pour ce soir », le parent voit d'abord ce que la porte annonce : 4 situations à ouvrir en un geste,
     choisies selon le moment de la journée et selon l'âge. Sans âge choisi, il y en a une pour un enfant, une pour un ado, une pour un adulte
     et une pour le parent lui-même. La boîte à outils entière suit, juste en dessous. */
  const mo=moment();const piste=!pub&&state.piste&&state.kit==='sits';
  const pisteBloc=piste?'<section class="grp ce-soir" aria-label="'+esc(PISTE_T[mo])+'"><div class="liste">'+pistesDuMoment(mo,state.age==='all'?'':state.age,D().age).map(id=>sitRow(SITS.find(y=>y.id===id))).join('')+'</div></section>'+
    '<div class="autres-ages"><span class="label" id="ages-l">D’autres idées, selon l’âge</span>'+agesChips()+'</div><h2 class="t2 suite">Toute la boîte à outils</h2>':'';
  return '<main id="main" tabindex="-1" class="view k-'+state.kit+(piste?' k-piste':'')+'" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:left 55%"><h1 class="t1">'+(pub?SITS.length+' situations de la vraie vie':piste?PISTE_T[mo]:'La boîte à outils')+'</h1></div><p class="sub">'+(piste?'Touchez ce qui ressemble à ce que vous vivez.':pub?'Chaque fiche dit ce qui se passe, ce que vous pouvez essayer et ce qu’il vaut mieux éviter, avec toujours un mot pour vous. Elle se lit en 2 minutes et s’envoie telle quelle.':state.kit==='sits'?'Vous trouverez ici '+SITS.length+' situations de la vraie vie, avec des pistes venues du terrain et toujours un mot pour vous.':state.kit==='tools'?'Ce sont les outils que les éducateurs utilisent tous les jours, et vous pouvez les poser sur la table de la cuisine.':'Deux minutes rien que pour vous, parce que vous êtes aussi une personne et pas seulement un parent.')+'</p>'+pisteBloc+seg+body+'</main>';
}
/* Les situations sont rangées par thèmes : chaque thème a son titre, son compte et sa liste. Une recherche donne une seule liste. */
const GROUPES=[['comp','Le comportement'],['comm','La communication'],['quot','Le quotidien'],['ecole','L’école, les professionnels, l’avenir'],['fam','La famille'],['moi','Vous, parent']];
/* Sur le site, chaque ligne est un vrai lien vers la fiche : on peut l'ouvrir dans un autre onglet, et les moteurs de recherche la suivent. */
/* Une situation illustrée par 2 personnages (les frères et sœurs) : ils se serrent pour tenir dans la même case. */
const deuxImages=e=>(String(e).match(/\p{Extended_Pictographic}/gu)||[]).length>1;
function sitRow(s){const dedans='<span class="e'+(deuxImages(s.e)?' duo':'')+'">'+s.e+'</span><span class="tx"><b>'+esc(s.t)+'</b><span>'+esc(s.s)+'</span></span><span class="chev">'+I.chev+'</span>';
  return SITE?'<a class="sit" href="'+ficheUrl(s.id)+'" data-act="sit" data-id="'+s.id+'">'+dedans+'</a>':'<button type="button" class="sit" data-act="sit" data-id="'+s.id+'">'+dedans+'</button>';}
/* Le choix de l'âge : il range les situations, et dans « Trouver une idée » il choisit celles qu'on propose d'abord. */
function agesChips(){return '<div class="chips scroll ages" role="group" aria-label="Âge">'+Object.keys(AGES).map(k=>'<button type="button" class="chip" data-act="age" data-v="'+k+'" aria-pressed="'+(state.age===k)+'">'+AGES[k]+'</button>').join('')+'</div>';}
/* Sur grand écran, les thèmes sont rangés en colonnes de hauteurs voisines, pour ne laisser aucun trou entre 2 thèmes.
   Une grille alignerait les thèmes par rangées : un thème de 2 lignes à côté d'un thème de 6 laisserait un vide sous lui.
   On essaie toutes les répartitions (6 thèmes, 3 colonnes : 729 au plus) et on garde celle dont la plus haute colonne est la plus basse,
   puis la plus régulière. Dans une colonne, les thèmes gardent leur ordre, et les colonnes se suivent dans l'ordre de leur premier thème. */
function colonnesSits(){return large()?((MQ_TROIS&&MQ_TROIS.matches)?3:2):1;}
function rangeEnColonnes(blocs,nc){
  const n=blocs.length;if(n<=nc)return blocs.map(b=>[b]);
  const poids=blocs.map(b=>b.n+0.6);let mieux=null,note=null;
  const total=Math.pow(nc,n);
  for(let k=0;k<total;k++){
    const h=new Array(nc).fill(0);let x=k,vide=nc;const ou=[];
    for(let i=0;i<n;i++){const c=x%nc;x=(x-c)/nc;if(!h[c])vide--;h[c]+=poids[i];ou.push(c);}
    if(vide)continue;
    const haut=Math.max.apply(null,h),bas=Math.min.apply(null,h);
    /* à hauteur égale, on préfère la répartition la plus régulière, puis celle qui laisse les premiers thèmes en tête de colonne */
    const tetes=ou.map((c,i)=>ou.indexOf(c)===i?i:-1).filter(i=>i>=0).reduce((s,i)=>s+i,0);
    const s=[haut,haut-bas,tetes];
    if(!note||s[0]<note[0]-1e-9||(Math.abs(s[0]-note[0])<1e-9&&(s[1]<note[1]-1e-9||(Math.abs(s[1]-note[1])<1e-9&&s[2]<note[2])))){note=s;mieux=ou;}
  }
  const cols=[];for(let c=0;c<nc;c++)cols.push(blocs.filter((b,i)=>mieux[i]===c));
  return cols.filter(c=>c.length).sort((p,q)=>blocs.indexOf(p[0])-blocs.indexOf(q[0]));
}
function kitSits(){
  let list=SITS.filter(s=>state.age==='all'||s.ages.includes(state.age));
  const q=state.q.trim().toLowerCase();if(q)list=list.filter(s=>(s.t+' '+s.s+' '+s.comp).toLowerCase().includes(q));
  const nc=colonnesSits();
  /* Les situations qui reviennent le plus à cette heure-ci, pour ne pas avoir à chercher. Si le parent a dit l'âge de son enfant,
     celles de cet âge passent devant. La liste complète reste entière : rien n'est caché d'après une réponse. */
  const mo=moment();const PT={matin:'Souvent, le matin',jour:'Souvent, dans la journée',soir:'Souvent, le soir',nuit:'Souvent, la nuit'};
  const souvent=(D().onboarded&&!q&&!state.piste)?'<div class="souvent"><span class="label" id="souvent-l">'+PT[mo]+'</span><div class="chips" role="group" aria-labelledby="souvent-l">'+pistesDuMoment(mo,state.age==='all'?'':state.age,D().age).map(id=>{const x=SITS.find(y=>y.id===id);return '<button type="button" class="chip" data-act="sit" data-id="'+id+'"><span aria-hidden="true">'+x.e+'</span> '+esc(x.t)+'</button>';}).join('')+'</div></div>':'';
  const corps=!list.length?'<div class="card vide"><p>Je n’ai rien trouvé pour ce mot. Vous pouvez essayer un autre mot, ou écrire ce qui se passe avec vos mots à vous.</p><button type="button" class="btn" data-act="porte" data-v="deposer" style="align-self:flex-start">'+I.drop+'Déposer ce qui pèse</button></div>':
    q?'<div class="grp"><div class="liste">'+list.map(sitRow).join('')+'</div></div>':
    (()=>{const blocs=GROUPES.map(g=>{const L=list.filter(s=>s.th===g[0]);return L.length?{n:L.length,h:'<section class="grp"><h2><span class="nom">'+g[1]+'</span><span class="nb" aria-hidden="true">'+L.length+'</span></h2><div class="liste">'+L.map(sitRow).join('')+'</div></section>'}:null;}).filter(Boolean);
      if(nc<2||blocs.length<2)return blocs.map(x=>x.h).join('');
      return rangeEnColonnes(blocs,nc).map(c=>'<div class="th-col">'+c.map(x=>x.h).join('')+'</div>').join('');})();
  const enCols=nc>1&&!q&&list.length>0;
  return '<div class="search">'+I.search+'<input type="search" id="q" aria-label="Chercher une situation" maxlength="'+LIM.search+'" placeholder="Coucher, ado, âge adulte…" value="'+esc(state.q)+'" autocomplete="off" enterkeyhint="search"></div>'+
    (state.piste?'':agesChips())+
    souvent+'<div class="sits groupes'+(q?' trouve':'')+(enCols?' en-cols':'')+'">'+corps+'</div>';
}
function viewSit(){
  const s=SITS.find(x=>x.id===state.sit);if(!s){state.view='kit';return viewKit();}
  const li=a=>'<ul class="list">'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  /* Les autres situations du même thème, pour continuer sans repasser par la liste. */
  const pr=SITS.filter(x=>x.th===s.th&&x.id!==s.id).slice(0,3);
  const pub=!D().onboarded;
  /* Le lien envoyé est l'adresse publique de la fiche, et rien d'autre. */
  const versAp=suiteFiche(s);
  const part=SITE?'<div class="partage"><button type="button" class="btn" data-act="partager" data-id="'+s.id+'">'+I.share+'Envoyer cette fiche</button><a class="btn wa" href="'+esc(waUrl(s))+'" target="_blank" rel="noopener">Envoyer par WhatsApp</a><p class="hint">Le lien mène tout droit à cette fiche, et il ne contient rien de vous.</p>'+(state.lien?'<div class="field"><label for="lien">Le lien de cette fiche, à copier</label><input type="text" id="lien" readonly value="'+esc(state.lien)+'"></div>':'')+'</div>':'';
  /* La fiche elle-même se lit sur la feuille claire. Ce que l'on fait ensuite (essayer une étape, envoyer la fiche, déposer) reste au bord de l'eau. */
  return '<main id="main" tabindex="-1" class="view fiche"><div class="feuille f-fiche"><div class="couv"><span class="med'+(deuxImages(s.e)?' duo':'')+'" aria-hidden="true">'+s.e+'</span><span class="label">'+esc(liste(s.ages.map((a,i)=>i?AGES[a].toLowerCase():AGES[a])))+'</span><h1 class="t1">'+esc(s.t)+'</h1><p class="sub">'+esc(s.s)+'</p></div>'+
    '<div class="card sec comp"><h2><span class="dot"></span>Ce qui se passe</h2><p>'+esc(s.comp)+'</p></div>'+
    '<div class="card sec ess"><h2><span class="dot"></span>Ce que vous pouvez essayer</h2>'+li(s.ess)+'</div>'+
    '<div class="card sec ev"><h2><span class="dot"></span>Ce qu’il vaut mieux éviter</h2>'+li(s.ev)+'</div>'+
    '<div class="comfort"><span class="label">Un mot pour vous</span><p>'+esc(s.moi)+'</p></div>'+
    '<div class="card sec aide"><h2><span class="dot"></span>Quand demander de l’aide</h2><p>'+esc(s.aide)+'</p></div></div>'+
    versAp+part+
    (pub?'':'<div class="quick"><button type="button" class="btn" data-act="porte" data-v="deposer">'+I.drop+'Déposer</button>'+(/minuteur visuel/.test(s.ess.join(' '))?'<button type="button" class="btn" data-act="kit" data-v="tools" data-tool="timer">'+I.timer+'Le minuteur visuel</button>':'<button type="button" class="btn" data-act="kit" data-v="tools">'+I.tools+'Les outils</button>')+'</div>')+
    (pr.length?'<section class="grp proches"><h2><span class="nom">Dans le même thème</span></h2><div class="liste">'+pr.map(sitRow).join('')+'</div></section>':'')+'</main>';
}
function kitTools(){
  const tabs=[['timer','Minuteur'],['ft','D’abord, ensuite'],['routine','Routine'],['abc','Journal'],['phr','Mes phrases']];
  const seg='<div class="chips scroll" role="group" aria-label="Outils">'+tabs.map(t=>'<button type="button" class="chip" data-act="tool" data-v="'+t[0]+'" aria-pressed="'+(state.tool===t[0])+'">'+t[1]+'</button>').join('')+'</div>';
  let body='';
  if(state.tool==='timer')body=toolTimer();else if(state.tool==='ft')body=toolFT();else if(state.tool==='routine')body=toolRoutine();else if(state.tool==='abc')body=toolABC();else body=toolPhr();
  return rlPorteHtml()+seg+body;
}
/* ---------- Le minuteur visuel ----------
   Un disque de couleur montre le temps qui reste, et il diminue peu à peu, dans le sens des aiguilles d'une montre.
   Quand la couleur a disparu, c'est fini. L'enfant le voit sans savoir lire l'heure, et le parent a les chiffres en dessous.
   Le dessin est celui de cet espace (la couleur du soleil sur le vert, sans cadran et sans chiffres autour).
   « Time Timer » est le nom d'une marque déposée, et son disque rouge aussi : l'outil s'appelle donc « Minuteur visuel », et il a ses propres couleurs. */
const MV_C=2*Math.PI*27;
/* La couleur du disque se choisit, parce qu'un enfant a souvent la sienne. Aucune n'est rouge. Le choix est gardé sur l'appareil. */
const MV_COUL=[['soleil','Soleil'],['vert','Vert'],['bleu','Bleu'],['lilas','Lilas']];
function mvCoul(){const c=D().mvc;return MV_COUL.some(x=>x[0]===c)?c:'soleil';}
function mvDash(frac){const r=Math.max(0,Math.min(1,frac))*MV_C;return '0 '+(MV_C-r).toFixed(2)+' '+r.toFixed(2)+' '+MV_C.toFixed(2);}
function toolTimer(){const t=state.timer;const mins=[1,2,3,5,10,15];const frac=t.total?t.left/t.total:0;
  const coul=mvCoul();
  return '<div class="card green minuteur mv-c-'+coul+'" style="align-items:center"><span class="label">Minuteur visuel</span><p class="hint" style="text-align:center">Votre enfant voit le temps qui reste, sans avoir besoin de lire l’heure. Vous pouvez lui dire « Quand la couleur a disparu, on range ».</p>'+
    '<div class="timerwrap"><div class="ring disque"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="mv-fond" cx="60" cy="60" r="54"/><circle id="mv-part" class="mv-part" cx="60" cy="60" r="27" style="stroke-dasharray:'+mvDash(frac)+'"/><circle class="mv-bord" cx="60" cy="60" r="54"/></svg></div>'+
    '<div class="mv-num" id="tnum" role="timer" aria-live="off" aria-label="Temps restant">'+Math.floor(t.left/60)+':'+pad(t.left%60)+'</div>'+
    '<div class="bigrow">'+mins.map(m=>'<button type="button" class="btn small'+(t.total===m*60?' primary':'')+'" data-act="tset" data-m="'+m+'">'+m+' min</button>').join('')+'</div><div class="bigrow"><button type="button" class="btn primary" data-act="ttoggle">'+(t.running?I.stop+'Pause':I.timer+'Lancer')+'</button><button type="button" class="btn" data-act="treset">Remettre</button></div>'+
    '<div class="mv-coul" role="group" aria-labelledby="mv-coul-l"><span class="hint" id="mv-coul-l">La couleur du disque</span><div class="mv-pastilles">'+MV_COUL.map(c=>'<button type="button" class="mv-p mv-p-'+c[0]+'" data-act="mvc" data-v="'+c[0]+'" aria-pressed="'+(coul===c[0])+'"><i aria-hidden="true"></i><span class="sr">'+c[1]+'</span></button>').join('')+'</div></div></div></div>';}
function minuteurEnVue(){try{const c=document.querySelector('.minuteur');if(!c)return;const barre=document.querySelector('header.bar');const haut=(barre?Math.max(0,barre.getBoundingClientRect().bottom):0)+12;const y=Math.round(c.getBoundingClientRect().top+window.scrollY-haut);if(y>0)window.scrollTo(0,y);}catch(e){}}
/* Le même minutage sert à l'outil (un disque) et à l'exercice « Une minute pour moi » (un anneau). */
function drawTimer(){const t=state.timer;const num=document.getElementById('tnum');if(!num)return;const frac=t.total?t.left/t.total:0;
  const arc=document.getElementById('arc'),part=document.getElementById('mv-part');
  if(arc){arc.style.strokeDashoffset=String(326.7*(1-frac));arc.style.stroke=frac<.2?'var(--coral)':'var(--green)';}
  if(part)part.style.strokeDasharray=mvDash(frac);
  num.textContent=Math.floor(t.left/60)+':'+pad(t.left%60);}
function tick(){const t=state.timer;if(!t.running)return;t.left=Math.max(0,t.left-1);drawTimer();if(t.left===0){t.running=false;clearInterval(t.h);t.h=null;try{if(navigator.vibrate)navigator.vibrate([200,100,200]);}catch(e){}toast('C’est fini. Bravo.');render();}}
function stopTimer(){const t=state.timer;t.running=false;if(t.h){clearInterval(t.h);t.h=null;}}
/* ---------- « D'abord, ensuite » et la routine : des cartes-images ---------- */
/* Les images sont des cartes blanches, une seule chose par carte, avec le mot dessous. Le tableau choisi est gardé sur l'appareil (data.ft).
   Toucher une image ou une case ne redessine pas l'écran : seules les parties qui changent sont mises à jour, pour que les images ne clignotent pas. */
const PICTO_DIR=SITE?RACINE+'img/pictos/':'https://parent-ecoute.ch/img/pictos/';
const PICTO_PAR=Object.create(null);PICTOS.forEach(p=>{PICTO_PAR[p[0]]=p;});
const FT_FLECHE='<svg class="puis" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" style="fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round"/></svg>';
function pictoImg(id,t,tard){return '<img src="'+PICTO_DIR+id+'.svg" alt="" width="'+t+'" height="'+t+'"'+(tard?' loading="lazy"':'')+'>';}
/* Le tableau gardé : deux identifiants d'image. Un identifiant inconnu (image retirée depuis) vaut une case vide. */
function ftRec(){const f=D().ft||{};const ok=k=>(f[k]&&PICTO_PAR[f[k]])?f[k]:null;return {first:ok('first'),then:ok('then')};}
/* Le groupe d'images affiché : celui que le parent a choisi, sinon celui du moment de la journée. */
function ftGroupe(){if(!state.ft.g){const h=new Date().getHours();state.ft.g=h<5?'soir':h<10?'matin':h<14?'repas':h<18?'jouer':'soir';}return state.ft.g;}
/* « --l » est la longueur du plus long mot : le mot sous l'image est écrit aussi grand que la carte le permet, sans être coupé. */
function ftCarte(k){const f=ftRec(),p=PICTO_PAR[f[k]];return '<button type="button" class="ftcard'+(k==='then'?' then':'')+'" data-act="ftpick" data-k="'+k+'" data-img="'+(f[k]||'')+'" aria-pressed="'+(state.ft.pick===k)+'"><span class="lbl">'+(k==='first'?'D’abord':'Ensuite')+'</span>'+(p?'<span class="pcarte" style="--l:'+Math.max.apply(null,p[1].split(/[\s-]+/).map(x=>x.length))+'">'+pictoImg(p[0],160)+'<span>'+esc(p[1])+'</span></span>':'<span class="vide">'+(k==='first'?'Ce qu’il doit faire':'Ce qui lui fait plaisir')+'</span>')+'</button>';}
function ftDit(){const f=ftRec();return f.first&&f.then?'<div class="comfort">Montrez-lui le tableau et dites « D’abord '+esc(PICTO_PAR[f.first][2])+', ensuite '+esc(PICTO_PAR[f.then][2])+' ».</div>':'';}
function ftOu(){const f=ftRec(),k=state.ft.pick;return 'Touchez une image pour '+(f[k]?'changer':'remplir')+' la case <b>'+(k==='first'?'D’abord':'Ensuite')+'</b>. Il y en a '+PICTOS.length+', rangées par moment de la journée.';}
function ftVideOff(){const f=ftRec();return !(f.first||f.then);}
/* Dans la grille, une image posée dans le tableau porte une étiquette qui dit dans quelle case elle se trouve. */
function ftOuEst(id,f){return f.first===id?'first':f.then===id?'then':'';}
function ftMarque(k){return k?'<b class="ou"><span class="sr">, dans la case </span>'+(k==='first'?'D’abord':'Ensuite')+'</b>':'';}
function ftGrille(){const g=ftGroupe(),f=ftRec();const G=PICTO_GROUPES.find(x=>x[0]===g);const ids=G?G[2].split(' '):PICTOS.map(p=>p[0]);return ids.map(id=>{const p=PICTO_PAR[id],k=ftOuEst(id,f);return '<button type="button" class="pcarte" data-act="ftset" data-id="'+id+'" data-ou="'+k+'" aria-pressed="'+(!!k)+'">'+pictoImg(id,96,true)+'<span>'+esc(p[1])+'</span>'+ftMarque(k)+'</button>';}).join('');}
function toolFT(){const g=ftGroupe();
  return '<div class="card ftool"><span class="label">Tableau « d’abord, ensuite »</span><p class="hint">Ce tableau montre deux images à votre enfant. La première est ce qu’il doit faire, et la seconde est ce qui lui fait plaisir juste après. Il accepte plus facilement la première quand il voit la seconde. Par exemple, d’abord les dents, ensuite l’histoire.</p>'+
    '<div id="ft-dit" aria-live="polite">'+ftDit()+'</div><div class="ft" id="ft">'+ftCarte('first')+FT_FLECHE+ftCarte('then')+'</div>'+
    '<p class="hint" id="ft-ou">'+ftOu()+'</p>'+
    '<div class="chips" role="group" aria-label="Moments de la journée">'+PICTO_GROUPES.map(x=>'<button type="button" class="chip" data-act="ftg" data-v="'+x[0]+'" aria-pressed="'+(g===x[0])+'">'+x[1]+'</button>').join('')+'<button type="button" class="chip" data-act="ftg" data-v="tout" aria-pressed="'+(g==='tout')+'">Tout</button></div>'+
    '<div class="picto" id="ft-grille">'+ftGrille()+'</div>'+
    '<button type="button" class="btn small" id="ft-vide" data-act="ftvide" style="align-self:flex-start"'+(ftVideOff()?' hidden':'')+'>Vider le tableau</button>'+
    '<p class="pcredit">Les images sont des <a href="'+(SITE?'':'https://parent-ecoute.ch/')+'conditions.html#propriete">Mulberry Symbols de Steve Lee</a>, partagés sous licence CC BY-SA 4.0.</p></div>';}
/* Met à jour le tableau sans redessiner l'écran. quoi : 'cases' (une image a changé), 'groupe' (un autre groupe d'images), sinon seulement la case visée. */
function ftSync(quoi){
  const box=document.getElementById('ft');if(!box){render();return;}
  const f=ftRec();
  /* La grille ne doit pas bouger sous le doigt quand la phrase à dire apparaît ou disparaît au-dessus d'elle : on note où elle est, et on rattrape l'écart à la fin. */
  const gr0=document.getElementById('ft-grille');const y0=gr0&&quoi!=='groupe'?gr0.getBoundingClientRect().top:null;
  /* Une case n'est refaite que si son image a changé. */
  ['first','then'].forEach(k=>{const b=box.querySelector('[data-k="'+k+'"]');if(!b)return;if(b.dataset.img!==(f[k]||''))b.outerHTML=ftCarte(k);else b.setAttribute('aria-pressed',String(state.ft.pick===k));});
  /* Un texte n'est réécrit que s'il a changé (comparé une fois mis en forme par le navigateur), pour qu'un lecteur d'écran ne le relise pas pour rien. */
  const set=(id,h)=>{const el=document.getElementById(id);if(!el)return;const t=document.createElement('div');t.innerHTML=h;if(el.innerHTML!==t.innerHTML)el.innerHTML=h;};
  set('ft-dit',ftDit());
  const v=document.getElementById('ft-vide');if(v)v.hidden=ftVideOff();
  set('ft-ou',ftOu());
  const gr=document.getElementById('ft-grille');
  if(gr){
    if(quoi==='groupe'){gr.innerHTML=ftGrille();const g=ftGroupe();[].forEach.call(document.querySelectorAll('[data-act="ftg"]'),c=>c.setAttribute('aria-pressed',String(c.dataset.v===g)));}
    else [].forEach.call(gr.querySelectorAll('button'),b=>{const k=ftOuEst(b.dataset.id,f);if(b.dataset.ou===k)return;b.dataset.ou=k;b.setAttribute('aria-pressed',String(!!k));const m=b.querySelector('.ou');if(m)m.remove();if(k)b.insertAdjacentHTML('beforeend',ftMarque(k));});
    if(y0!==null){const dy=gr.getBoundingClientRect().top-y0;if(Math.abs(dy)>=1){try{window.scrollBy(0,dy);}catch(e){}}}
  }
}
function rFait(){const d=D();return d.routineDone[todayIso()]||{};}
function rFin(){const done=rFait();return ROUTINE_DEF.every((x,i)=>done[i])?'<div class="comfort">Tout est fait. Bonne nuit à tous les deux.</div>':'';}
function toolRoutine(){const done=rFait();return '<div class="card"><span class="label">La routine du soir</span><p class="hint">Suivez le même ordre chaque soir. Laissez votre enfant cocher lui-même, pour qu’il sente que c’est lui qui avance.</p><div class="routine" id="routine">'+ROUTINE_DEF.map((id,i)=>'<button type="button" class="rstep'+(done[i]?' done':'')+'" data-act="rdone" data-i="'+i+'" aria-pressed="'+(!!done[i])+'"><span class="e">'+pictoImg(id,56)+'</span><span class="t">'+esc(PICTO_PAR[id][1])+'</span><span class="ck">'+(done[i]?I.check:'')+'</span></button>').join('')+'</div><div id="r-fin">'+rFin()+'</div><button type="button" class="btn small" data-act="rreset" style="align-self:flex-start">Remettre à zéro</button></div>';}
/* Coche ou décoche une étape de la routine sans redessiner l'écran. */
function rSync(){
  const box=document.getElementById('routine');if(!box){render();return;}
  const done=rFait();
  [].forEach.call(box.querySelectorAll('.rstep'),b=>{const on=!!done[b.dataset.i];b.classList.toggle('done',on);b.setAttribute('aria-pressed',String(on));const ck=b.querySelector('.ck');if(ck)ck.innerHTML=on?I.check:'';});
  const fin=document.getElementById('r-fin');if(fin){const h=rFin();if(!!h!==!!fin.firstChild)fin.innerHTML=h;}
}
function toolABC(){const d=D();const list=d.abc.slice().reverse().slice(0,10);return '<div class="card"><span class="label">Journal avant, pendant, après</span><p class="hint">Notez trois lignes à chaque fois que cela déborde. Au bout de trois semaines, vous verrez ce qui se passe juste avant. C’est aussi ce que tout professionnel vous demandera.</p><div class="abc"><div class="field"><label for="a1">Avant</label><input type="text" id="a1" maxlength="'+LIM.line+'" placeholder="Où, quand, qui, quoi juste avant" autocomplete="off"></div><div class="field"><label for="a2">Pendant</label><input type="text" id="a2" maxlength="'+LIM.line+'" placeholder="Ce qui s’est passé, combien de temps" autocomplete="off"></div><div class="field"><label for="a3">Après</label><input type="text" id="a3" maxlength="'+LIM.line+'" placeholder="Ce qui a aidé, ce qui a suivi" autocomplete="off"></div></div><button type="button" class="btn primary" data-act="abcadd" style="align-self:flex-start">'+I.plus+'Noter</button></div>'+(list.length?'<div class="log">'+list.map(x=>'<div class="logi"><span class="d">'+esc(fmtDate(x.date))+' à '+esc(hm(x.time))+'</span><span><b>Avant</b> '+esc(x.a)+'</span><span><b>Pendant</b> '+esc(x.b)+'</span><span><b>Après</b> '+esc(x.c)+'</span></div>').join('')+'</div>':'');}
function toolPhr(){const d=D();return '<div class="card"><span class="label">Mes phrases qui marchent</span><p class="hint">Gardez ici les phrases qui calment, qui font rire ou qui débloquent une situation. Elles serviront à vous, à l’autre parent ou à la grand-mère qui garde samedi.</p><div class="field"><label class="sr" for="ph">Une phrase qui marche</label><input type="text" id="ph" maxlength="'+LIM.phrase+'" placeholder="Par exemple « On respire comme le dragon »" autocomplete="off" enterkeyhint="done"></div><button type="button" class="btn primary" data-act="phadd" style="align-self:flex-start">'+I.plus+'Garder</button>'+(d.phrases.length?'<div class="phr">'+d.phrases.map((p,i)=>'<div><span>'+esc(p)+'</span><button type="button" class="btn small ghost" data-act="phdel" data-i="'+i+'" aria-label="Retirer cette phrase">'+I.trash+'</button></div>').join('')+'</div>':'')+'</div>';}
function kitMe(){
  return '<div class="ex">'+EXOS.map(x=>'<button type="button" class="sit" data-act="exo" data-id="'+x.id+'"><span class="e">'+I[x.ico]+'</span><span class="tx"><b>'+esc(x.t)+'</b><span>'+esc(x.s)+'</span></span><span class="chev">'+I.chev+'</span></button>').join('')+'</div>'+
    '<div class="comfort">'+esc(WORDS[(dayIdx(WORDS.length)+5)%WORDS.length])+'</div>';
}
function viewExo(){
  const x=EXOS.find(e=>e.id===state.exo);if(!x){state.view='kit';return viewKit();}
  let body='';
  if(x.id==='breath')body='<div class="breath"><div class="orbwrap" aria-hidden="true"><div class="orb"></div></div><div class="txt">Inspirez quand le cercle grandit, expirez quand il rétrécit.</div></div>';
  else if(x.id==='trois'){const t=D().three.slice().reverse().slice(0,5);body='<div class="card"><div class="field"><input type="text" id="t1" aria-label="Première chose" maxlength="'+LIM.three+'" placeholder="Une" autocomplete="off"></div><div class="field"><input type="text" id="t2" aria-label="Deuxième chose" maxlength="'+LIM.three+'" placeholder="Deux" autocomplete="off"></div><div class="field"><input type="text" id="t3" aria-label="Troisième chose" maxlength="'+LIM.three+'" placeholder="Trois" autocomplete="off"></div><button type="button" class="btn primary" data-act="threeadd" style="align-self:flex-start">'+I.star+'Garder</button></div>'+(t.length?'<div class="log">'+t.map(e=>'<div class="logi"><span class="d">'+esc(fmtDate(e.date))+'</span><span>'+esc(e.items.join(', '))+'</span></div>').join('')+'</div>':'');}
  else if(x.id==='deposer')body='<div class="card"><textarea id="dep" aria-label="Ce qui pèse (rien n’est gardé)" maxlength="10000" style="min-height:200px" placeholder="Tout ce qui tourne…"></textarea><button type="button" class="btn primary" data-act="depose" style="align-self:flex-start">'+I.wind+'Déposer et effacer</button><p class="hint">Rien n’est enregistré, et le texte disparaît dès que vous appuyez. Si vous souhaitez une réponse, utilisez plutôt « Déposer ce qui pèse », dans « Aujourd’hui ».</p></div>';
  else if(x.id==='droit')body='<div class="perm">'+PERMISSIONS.map(p=>'<div><b>'+esc(p[0])+'</b> '+esc(p[1])+'</div>').join('')+'</div>';
  else if(x.id==='minute')body='<div class="card green" style="align-items:center"><div class="ring" style="width:200px;height:200px"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" style="fill:none;stroke:var(--surface);stroke-width:12"/><circle id="arc" cx="60" cy="60" r="52" style="fill:none;stroke:var(--green);stroke-width:12;stroke-linecap:round;stroke-dasharray:326.7;stroke-dashoffset:0"/></svg><div class="num" id="tnum" style="font-size:44px">'+Math.floor(state.timer.left/60)+':'+pad(state.timer.left%60)+'</div></div><button type="button" class="btn primary" data-act="minute">'+(state.timer.running?I.stop+'Arrêter':I.timer+'Une minute')+'</button></div>';
  else if(x.id==='appeler')body='<div class="log">'+HELP.map(h=>'<div class="logi"><b>'+esc(h.t)+'</b>'+(h.tel?'<span style="font-size:22px">'+tel(h.tel)+'</span>':'<a href="'+h.url+'" target="_blank" rel="noopener noreferrer" style="font-size:18px;font-weight:800">'+esc(h.label)+' '+I.ext+'<span class="sr"> (nouvel onglet)</span></a>')+'<span class="hint">'+esc(h.d)+'</span></div>').join('')+'</div>';
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">'+esc(x.t)+'</h1>'+(x.how?'<p class="sub">'+esc(x.how)+'</p>':'')+'</div>'+body+'</main>';
}
function viewSOS(){
  return '<main id="main" tabindex="-1" class="view sosview" style="padding-top:14px"><header class="bar"><button type="button" class="back" data-act="back">'+I.back+'Sortir</button></header>'+
    '<div><h1 class="t1" style="color:var(--coral)">Là, maintenant.</h1><p class="sub">Vous n’avez rien à réussir, juste à laisser passer la vague. Suivez ces quatre étapes dans l’ordre.</p></div>'+
    '<div class="sosstep"><span class="n">1</span><div class="tx"><b>Sécurité</b><span>Écartez ce qui peut blesser et laissez de la place. Ne retenez pas votre enfant si ce n’est pas nécessaire.</span></div></div>'+
    '<div class="sosstep"><span class="n">2</span><div class="tx"><b>Moins</b><span>Mettez moins de mots, moins de lumière et moins de bruit. Répétez calmement une seule phrase, par exemple « Je suis là, on attend ».</span></div></div>'+
    '<div class="sosstep"><span class="n">3</span><div class="tx"><b>Vous</b><span>Posez vos pieds bien au sol et respirez avec le cercle. Si tout est sûr, vous avez le droit de sortir trente secondes.</span></div></div>'+
    '<div class="breath"><div class="orbwrap" aria-hidden="true"><div class="orb"></div></div><div class="txt">Inspirez… expirez…</div></div>'+
    '<div class="sosstep"><span class="n">4</span><div class="tx"><b>Après</b><span>Proposez un verre d’eau et un geste doux s’il est accepté. Ne revenez pas sur la scène et ne punissez pas, parce qu’on ne punit pas une vague. Plus tard, notez ce qui s’est passé juste avant.</span></div></div>'+
    '<div class="emg"><b>Si quelqu’un est en danger</b><span>Appelez le '+tel('144')+' pour les urgences ou le '+tel('117')+' pour la police.</span><span>Si c’est vous qui n’en pouvez plus, appelez La Main Tendue au '+tel('143')+', de jour comme de nuit.</span></div>'+
    '<button type="button" class="btn primary wide" data-act="back">C’est passé, je reviens</button><p class="hint">Ce que vous venez de faire, c’est exactement ce qu’un professionnel aurait fait.</p></main>';
}
/* ---------- moi ---------- */
function moodDots(){const d=D();const out=[];for(let i=13;i>=0;i--){const dt=new Date(Date.now()-i*86400000);const k=dt.getFullYear()+'-'+pad(dt.getMonth()+1)+'-'+pad(dt.getDate());const m=d.moods[k];out.push('<i class="'+(m!==undefined?'m'+m:'')+'"></i>');}const n=out.filter(x=>x.indexOf('class="m')>0).length;return '<div class="mooddots" role="img" aria-label="Humeur notée '+n+' jour'+(n>1?'s':'')+' sur les quatorze derniers">'+out.join('')+'</div>';}
function viewMe(){
  const d=D();const T=TIERS[tier()];const ld=lastDepot();const ql=questionsLeft();
  const nf=doneCount(),np=nbNotes(),nd=d.depots.length;const dep=d.start?dateLongue(d.start):'';
  /* Trois chiffres en haut : les étapes faites, les pages écrites, les dépôts. Chacun mène à son écran. */
  const trio='<div class="trio"><button type="button" data-act="go" data-view="parcours"><b>'+nf+'</b><span>étape'+(nf>1?'s':'')+' faite'+(nf>1?'s':'')+'</span></button><button type="button" data-act="go" data-view="carnet"><b>'+np+'</b><span>page'+(np>1?'s':'')+' écrite'+(np>1?'s':'')+'</span></button><button type="button" data-act="go" data-view="depots"><b>'+nd+'</b><span>dépôt'+(nd>1?'s':'')+'</span></button></div>';
  return '<main id="main" tabindex="-1" class="view moi" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:right 70%"><h1 class="t1" data-act="atelier">Moi</h1></div><p class="sub">'+(dep?'Vous avez commencé le '+esc(dep)+'. ':'')+'Vous retrouvez ici vos achats, vos dépôts, votre carnet, votre humeur et vos réglages.</p>'+
    '<div class="duo"><div class="duo-a">'+trio+achatsHtml()+rlPorteHtml()+
    '<button type="button" class="sit" data-act="go" data-view="final"><span class="e">'+I.path+'</span><span class="tx"><b>Mon chemin</b><span>Tout votre parcours sur une page, à garder ou à imprimer</span></span><span class="chev">'+I.chev+'</span></button>'+
    '</div><div class="duo-b">'+essaiCarte()+'<div class="card"><span class="label">Mon humeur, quatorze jours</span>'+moodDots()+'<p class="hint">Chaque carré représente un jour, du plus ancien au plus récent. Vos humeurs restent sur votre appareil.</p></div>'+
    '<div class="menu-list"><button type="button" data-act="fx" aria-pressed="'+(!d.fxOff)+'">'+I.sun2+'<span>Effets visuels</span><span class="state">'+(FX_RM&&FX_RM.matches?'Coupés par votre appareil':d.fxOff?'Désactivés':(fxOn()&&eauInit()===false?'Activés, sans l’eau':'Activés'))+'</span></button>'+(d.atelier?'<button type="button" data-act="tout" aria-pressed="'+(!!d.tout)+'">'+I.path+'<span>Tout voir, l’aperçu d’Antonio</span><span class="state">'+(d.tout?'Activé':'Désactivé')+'</span></button>':'')+'<button type="button" data-act="onboard">'+I.user+'<span>Personnaliser mon espace (prénom, âge, situation)</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="voix">'+I.question+'<span>Qui vous parle ici ?</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="go" data-view="data">'+I.download+'<span>Vos données et tout recommencer</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="go" data-view="about">'+I.info+'<span>L’histoire d’Antonio</span><span class="chev">'+I.chev+'</span></button>'+
    (SITE?'<a href="'+RACINE+'confidentialite.html">'+I.shield+'<span>Politique de confidentialité</span><span class="chev">'+I.chev+'</span></a><a href="'+RACINE+'conditions.html">'+I.note+'<span>Conditions générales</span><span class="chev">'+I.chev+'</span></a>'+(MENTIONS?'<a href="'+RACINE+'mentions-legales.html">'+I.info+'<span>Mentions légales</span><span class="chev">'+I.chev+'</span></a>':''):'')+'</div></div></div></main>';
}
function viewDepots(){
  const list=D().depots.slice().reverse();
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Mes dépôts</h1><p class="sub">Vous retrouvez ici tout ce que vous avez déposé et ce que vous avez reçu en retour. Tout reste sur votre appareil.'+(can('antonio')?(DEMO?' Dans la version complète, Antonio ne lira que les dépôts cochés « Partager ». Dans cette version de test, rien ne lui est transmis.':' Seuls les dépôts cochés « Partager » sont lus par Antonio.'):'')+'</p></div>'+
    (list.length?'<div class="depots">'+list.map(x=>depotHtml(x,false)).join('')+'</div>':'<div class="card vide"><p>Vous n’avez encore rien déposé. Quand quelque chose pèse, vous pouvez l’écrire, et vous recevez en retour une question et une lumière.</p><button type="button" class="btn primary" data-act="porte" data-v="deposer" style="align-self:flex-start">'+I.drop+'Déposer ce qui pèse</button></div>')+'</main>';
}
/* ---------- les 3 offres, l'essai du parcours et la commande ---------- */
/* Tout ce qui touche à la vente tient ici, à l'écart du SOS, de la respiration et de l'écran « Déposer ».
   Découverte est gratuite. Le parcours s'achète une fois, 84 CHF en tout, payés en une fois ou en six fois. « Passer le relais » s'achète une fois, 49 CHF,
   avec ou sans le parcours. Il n'y a pas d'abonnement, donc rien à arrêter.
   Rien n'est payé et rien n'est envoyé : il n'existe encore ni prestataire de paiement, ni compte, ni serveur. La commande est une démonstration. */
function com(){const d=D();if(!d.com||typeof d.com!=='object')d.com={};return d.com;}
/* Les 3 mesures prévues pour le lancement : un aperçu terminé, un achat par offre, et un retour sur l'outil acheté un autre jour.
   Elles ne contiennent ni texte, ni humeur, ni situation. Dans cette version, elles restent sur l'appareil. Le jour où un compteur sera branché,
   il ne recevra que le nom de la mesure et celui de l'offre, et seulement si le visiteur a dit oui à la mesure. */
function repere(quoi,f,m){const c=com();const j=todayIso();
  if(quoi==='apercu'){if(!c.ap)c.ap=j;}
  else if(quoi==='choix')c.ch={f:f,d:j};
  else if(quoi==='achat'){if(!c.ach||typeof c.ach!=='object')c.ach={};c.ach[f]={d:j,m:m||''};}
  save();}
function usage(k){const c=com();if(!c.us||typeof c.us!=='object')c.us={};if(!Array.isArray(c.us[k]))c.us[k]=[];const a=c.us[k],j=todayIso();if(a.indexOf(j)<0&&a.length<2){a.push(j);save();}}
function contact(){return String(CONTACT_R||'').split('').reverse().join('');}
const F_TXT={
  free:{b:'Recevoir une aide tout de suite.',s:'Ce que vous pouvez faire gratuitement',
    c:['Vous soufflez 2 minutes, en silence ou avec la musique de l’étang.','Vous lisez la dose de lumière, chaque jour.','Vous ouvrez les '+SITS.length+' fiches pratiques et tous les outils.','Vous essayez une vraie étape du parcours, en 3 minutes.',SITE?'Vous déposez ce qui pèse autant que vous en avez besoin, pour vous ou pour préparer ce que vous aimeriez dire à quelqu’un.':'Vous déposez ce qui pèse, et 3 dépôts reçoivent une réponse.'],
    d:'Découverte est gratuite, sans limite de durée et sans compte.'},
  parcours:{b:'24 étapes guidées pour avancer d’une semaine à l’autre, pendant 6 mois.',s:'Ce que contient Le parcours',
    c:['24 étapes guidées s’ouvrent une par une, chaque semaine.','À chaque étape, vous comprenez une idée, vous l’essayez chez vous et vous écrivez quelques mots dans votre carnet de route.','Vous voyez votre chemin dans « Mon évolution », au départ, à 3 mois et à 6 mois.',SITE?'':'Vous déposez ce qui pèse autant que vous en avez besoin.','Vous choisissez une image pour dire où vous en êtes, avec le photolangage.'].filter(Boolean),
    d:'Une fois acheté, le parcours reste ouvert sans limite de durée. Si vous vous absentez, rien ne s’accumule.'},
  relais:{b:'Confier votre enfant à un proche, l’esprit plus léger.',s:'Ce que fait l’outil',
    c:['Vous préparez une page pour la personne qui prend le relais, avec vos mots.','En tête, « Si tu ne lis que trois choses », que vous choisissez vous-même.','Votre proche ouvre la fiche sur son téléphone, sans compte et sans rien acheter.','Au retour, une seule question, et le prochain relais est prêt plus vite.','Vous préparez aussi une réunion avec l’école ou le foyer, avec « Je perds mes mots ».'],
    d:'L’outil sert à toute la famille, sans abonnement et sans limite de fiches.'}
};
const PRIX=k=>k==='relais'?'49 CHF, une seule fois':k==='parcours'?'84 CHF en tout':'0 CHF';
/* Le site officiel s'appelle lui-même « version de test » dans ses pages de texte, tant que la vente n'est pas ouverte. L'ancienne version d'essai disait « version d'essai ». */
/* NOM_ESSAI : le nom que se donne une version à part (« version d'essai » jusqu'au 25 novembre 2026, « préversion » depuis). */
const NOM_ESSAI=ESSAI?(ESSAI_NOM||'version d’essai'):'';
const V_NOM=ESSAI?NOM_ESSAI:'version de test';
const POUR_DEMO=ESSAI?'Pour l’essai':'Pour la démonstration';
/* La vente n'est pas ouverte. Pour un parent, une offre se présente avec son prix, « Essayer » et « Me prévenir à l'ouverture » : aucune commande.
   La commande en démonstration ne sert qu'aux essais internes. Elle existe quand la fabrication le demande (VENTE vaut « demo »), ou bien,
   là où la fabrication l'autorise (INTERNE), quand l'adresse a été ouverte une fois avec #interne dans cet onglet. Fermer l'onglet l'oublie. */
function interne(){if(!INTERNE)return false;try{return sessionStorage.getItem('pepe-interne')==='1';}catch(e){return false;}}
function venteDemo(){return VENTE==='demo'||interne();}
function demoPaie(){return venteDemo()?'Dans cette '+V_NOM+', aucun montant réel n’est débité.':'La vente n’est pas encore ouverte. Les prix sont ceux prévus pour l’ouverture.';}
/* « Me prévenir à l'ouverture » : le même geste partout où une offre payante se présente. */
function prevenirBtn(k,cls){return CONTACT_R?'<a class="btn wide prevenir'+(cls?' '+cls:'')+'" href="'+esc(prevenirUrl(k))+'" aria-label="Me prévenir à l’ouverture de '+esc(PRODUITS[k].t)+', '+PRIX(k)+'">'+I.mail+'<span>Me prévenir à l’ouverture</span></a>':'';}
const TOTAL_84='Total 84 CHF dans les deux cas. Sans supplément ni renouvellement automatique.';
/* Les 6 dates d'un paiement en six fois : le jour de l'achat, puis le même jour des 5 mois suivants (ou le dernier jour du mois s'il est plus court). */
function echeances(depuis){const p=String(depuis||todayIso()).split('-').map(Number);const out=[];for(let i=0;i<NB_ECH;i++){const y=p[0]+Math.floor((p[1]-1+i)/12),m=(p[1]-1+i)%12;const fin=new Date(y,m+1,0).getDate();out.push(y+'-'+pad(m+1)+'-'+pad(Math.min(p[2],fin)));}return out;}
function echeancesHtml(depuis,payees){
  const E=echeances(depuis);const n=payees||0;
  return '<ol class="ech">'+E.map((d,i)=>'<li'+(i<n?' class="ech-ok"':'')+'><span>'+(i===0&&!n?'Aujourd’hui, le ':'Le ')+esc(dateLongue(d))+(i<n?', payée':'')+'</span><b>'+MENSU+' CHF</b></li>').join('')+'<li class="ech-total"><span>Total</span><b>84 CHF</b></li></ol>'+
    '<p class="f-note">La dernière mensualité est celle du '+esc(dateLongue(E[NB_ECH-1]))+'. Après elle, plus rien n’est prélevé.</p>';
}
/* Les 2 façons de payer Le parcours, avec la même importance à l'écran. */
function payerParcours(de){
  if(can('parcours'))return '<button type="button" class="btn wide" data-act="rien" aria-disabled="true">'+I.check+'Vous avez Le parcours</button>';
  if(!venteDemo())return '<div class="f-ferme"><button type="button" class="btn primary wide" data-act="apercu">'+I.path+'Essayer une étape en 3 minutes</button>'+prevenirBtn('parcours')+'</div><p class="f-total">84 CHF en tout, en une fois ou en 6 fois 14 CHF. Sans supplément ni renouvellement automatique.</p>';
  return '<div class="f-payer" role="group" aria-label="2 façons de payer Le parcours"><button type="button" class="btn primary f-mode" data-act="commande" data-v="parcours" data-m="une" data-de="'+de+'"><b>En une fois</b><span>84 CHF aujourd’hui</span></button><button type="button" class="btn primary f-mode" data-act="commande" data-v="parcours" data-m="six" data-de="'+de+'"><b>En six fois</b><span>14 CHF aujourd’hui, puis 5 mensualités de 14 CHF</span></button></div><p class="f-total">'+TOTAL_84+'</p>';
}
function viewPlans(){
  const peek=!D().onboarded;
  let large=false;try{large=!!(window.matchMedia&&window.matchMedia('(min-width:900px)').matches);}catch(e){}
  const carte=(k,nom,prix,petit,bouton,plus,best)=>{const X=F_TXT[k];
    /* Sur un téléphone, on voit d'abord le bénéfice, le prix et le geste. Le détail se déplie. Sur un grand écran, il est ouvert. */
    return '<section class="formule f-'+k+(best?' best':'')+'" aria-labelledby="f-'+k+'"><div class="f-haut"><div class="f-nom"><h2 id="f-'+k+'">'+nom+'</h2></div><p class="f-prix"><b>'+prix+'</b> <small>'+petit+'</small></p></div><p class="f-benef">'+X.b+'</p>'+bouton+plus+
      '<details class="f-concret"'+(large?' open':'')+'><summary>'+X.s+'</summary><ul>'+X.c.map(x=>'<li>'+x+'</li>').join('')+'</ul><p class="f-note">'+X.d+'</p></details></section>';};
  const bFree=peek?'<button type="button" class="btn wide" data-act="entrer" data-v="today">Commencer gratuitement</button>':'<button type="button" class="btn wide" data-act="rien" aria-disabled="true">'+I.check+'C’est déjà à vous</button>';
  const demo=venteDemo();
  const bRel=can('relais')?'<button type="button" class="btn wide" data-act="rl" data-k="ouvre">'+I.hand+'Ouvrir Passer le relais</button>':demo?'<button type="button" class="btn primary wide" data-act="commande" data-v="relais" data-de="plans">Choisir Passer le relais</button>':'<div class="f-ferme"><button type="button" class="btn primary wide" data-act="rl" data-k="essai">'+I.pen+'Essayer avec ma situation</button>'+prevenirBtn('relais')+'</div>';
  return '<main id="main" tabindex="-1" class="view v-feuille"><div class="feuille">'+
    '<div class="f-tete"><h1 class="t1">Les 3 offres</h1><p class="sub">Vous commencez gratuitement. Ensuite, vous payez une fois ce qui vous sert, sans abonnement.</p><p class="demo-paie">'+I.info+'<span>'+demoPaie()+'</span></p></div>'+
    '<div class="formules">'+
      carte('free','Découverte','0 CHF','sans limite de durée',bFree,'<button type="button" class="lien-f" data-act="apercu">'+I.path+'Essayer une étape, en 3 minutes</button>',false)+
      carte('parcours','Le parcours','84 CHF','en tout',payerParcours('plans'),demo?'<button type="button" class="lien-f" data-act="apercu">'+I.path+'Essayer une étape avant de choisir</button>':'',false)+
      carte('relais','Passer le relais','49 CHF','une seule fois',bRel,'<button type="button" class="lien-f" data-act="rl" data-k="exemple">'+I.eye+'Voir un exemple de fiche terminée</button>',false)+
    '</div>'+
    '<section class="f-regles"><h2>Paiement, durée et ce que vous gardez</h2><ul class="list">'+
      '<li>Découverte est gratuite, sans limite de durée.</li>'+
      '<li>Le parcours coûte 84 CHF en tout. Vous le payez en une fois, ou en 6 fois 14 CHF, une fois par mois. Dans les deux cas, vous achetez le parcours complet.</li>'+
      '<li>Passer le relais coûte 49 CHF, une seule fois. Il s’achète avec ou sans le parcours.</li>'+
      '<li>Il n’y a ni abonnement ni renouvellement automatique. Après le dernier paiement prévu, plus rien n’est prélevé.</li>'+
      '<li>Ce que vous achetez reste ouvert sans limite de durée.</li>'+
      '<li>Votre carnet, vos fiches et vos dépôts restent sur votre appareil. Vous pouvez les sauvegarder dans un fichier, les restaurer, et imprimer « Mon chemin » comme vos fiches de relais.</li>'+
    '</ul><p class="f-avant">Le moyen de paiement, le remboursement et ce qui se passe si une mensualité ne peut pas être prélevée seront écrits ici et dans les conditions générales avant l’ouverture de la vente.</p></section>'+
    '<section class="f-prevenir"><h2>Être prévenu de l’ouverture</h2><p>La vente n’est pas encore ouverte. Si vous le souhaitez, vous pouvez demander à être prévenu par e-mail du jour où une offre ouvrira, à son prix annoncé.</p>'+(demo?prevenirHtml('parcours')+prevenirHtml('relais'):'')+'<p class="hint">Le message part de votre propre messagerie. Antonio garde votre adresse seulement pour vous écrire ce jour-là, et vous pouvez lui demander de l’effacer.'+(CONTACT_R?' Si rien ne s’ouvre, écrivez à '+esc(contact())+'.':'')+'</p></section>'+
    (demo?'<div class="f-discret"><button type="button" class="lien-f" data-act="cadeau">'+I.star+'Offrir à un parent</button><button type="button" class="lien-f" data-act="retrouver">'+I.search+'Retrouver un achat</button></div>'+
    '<p class="hint">Dans cette '+V_NOM+', choisir une offre ouvre une démonstration de commande. Aucun paiement n’est demandé et rien n’est transmis.'+(SITE?' <a href="'+RACINE+'conditions.html">Conditions générales</a>':'')+'</p>':
    (SITE?'<a class="lien-f" href="'+RACINE+'conditions.html">Lire les conditions générales</a>':''))+
    '</div></main>';
}
/* « Me prévenir » est un vrai lien vers la messagerie du parent, avec un message écrit d'avance. C'est lui qui l'envoie : rien ne part sans lui. */
function prevenirUrl(k){
  const T=PRODUITS[k];
  return 'mailto:'+contact()+'?subject='+encodeURIComponent('Me prévenir à l’ouverture de '+T.t)+'&body='+encodeURIComponent('Bonjour,\n\nMerci de me prévenir par e-mail quand « '+T.t+' » ouvrira, à '+PRIX(k)+'.\n\n');
}
function prevenirHtml(k){return CONTACT_R?'<a class="btn wide prevenir" href="'+esc(prevenirUrl(k))+'">'+I.mail+'<span>Me prévenir pour '+esc(PRODUITS[k].t)+', '+PRIX(k)+'</span></a>':'';}

/* ---------- l'essai du parcours : l'étape 7, en 3 minutes ---------- */
/* Un chemin complet, fait de ce qui existe déjà : la vague de l'émotion (l'idée et le schéma de l'étape 7), un geste à choisir (son exercice),
   le carnet de route (la page de l'étape), puis ce que la semaine suivante apporte. Le parent repart avec quelque chose d'utile même s'il s'arrête là.
   L'offre du Parcours n'arrive qu'au dernier écran. À sa visite suivante, « Aujourd'hui » lui montre son geste et « Reprendre ici ». */
const AP_GESTES=[['souffle','Expirer lentement'],['sortir','Sortir un instant'],['marcher','Marcher 5 minutes'],['mains','Poser les mains à plat'],['phrase','Dire une phrase apprise par cœur']];
const AP_TITRES=['La vague','Mon geste','Mon carnet','La semaine prochaine'];
function apEtape(){return allSteps().find(x=>x.id==='reguler');}
function apGarde(){
  const a=state.ap,d=D(),s=apEtape();if(!s)return false;
  const g=(AP_GESTES.find(x=>x[0]===a.g)||[])[1]||'';const champ=document.getElementById('ap-mot');const mot=clean(champ?champ.value:(a.mot||''),LIM.note);
  if(!g&&!mot)return false;
  a.mot=mot;
  const texte=(g?g+'.':'')+(g&&mot?' ':'')+mot;
  /* Une page déjà écrite à l'étape 7 n'est jamais remplacée : le geste choisi s'ajoute à la suite. */
  const nt=noteDe(s.id);
  if(nt){if(nt.t.indexOf(texte)<0){nt.t=(nt.t+'\n'+texte).slice(0,LIM.note);nt.d=todayIso();}}
  else d.notes[s.id]={t:texte,d:todayIso()};
  entrer('apercu');save();return true;
}
/* Le geste gardé pendant l'essai, pour « Aujourd'hui » : il attend le parent, avec un seul bouton pour reprendre. */
function repriseHtml(){
  const s=apEtape();if(!s||can('parcours'))return '';const nt=noteDe(s.id);if(!nt||!com().ap&&!nt.t)return '';
  return '<div class="card reprise-geste reveal d2"><span class="label">Votre geste, quand la vague monte</span><p class="rg-t">'+nl2(String(nt.t).split('\n').slice(-2).join('\n'))+'</p><button type="button" class="btn primary" data-act="apercu-reprise">'+I.path+'Reprendre ici</button><p class="hint">Vous l’avez gardé le '+esc(fmtDate(nt.d))+', dans votre carnet.</p></div>';
}
/* Après une absence de 10 jours ou plus, un mot simple. Rien n'est en retard. */
function revoila(){
  if(state.abs===undefined){const d=D();const av=d.vu||'';const j=todayIso();state.abs=!!av&&av!==j&&(Date.parse(j)-Date.parse(av))/86400000>=10;if(d.onboarded&&av!==j){d.vu=j;save();}}
  return state.abs?'<p class="revoila">Vous revoilà. Ici, rien n’est en retard, et ce que vous avez écrit vous attend.</p>':'';
}
function viewApercu(){
  const s=apEtape(),a=state.ap,k=Math.max(0,Math.min(3,a.k||0));const steps=allSteps();const sv=steps[s.idx+1];
  const fil='<ol class="ap-fil" aria-label="Les 4 moments de cet essai">'+AP_TITRES.map((t,i)=>'<li'+(i===k?' aria-current="step"':'')+' class="'+(i<k?'ap-fait':i===k?'ap-ici':'')+'"><span>'+(i+1)+'</span><b>'+t+'</b></li>').join('')+'</ol>';
  const idee=Array.isArray(s.idee)?s.idee:[s.idee];
  let corps='';
  if(k===0)corps='<div class="f-tete"><span class="label">Une vraie étape du parcours, en 3 minutes</span><h1 class="t1">'+esc(s.t)+'</h1><p class="sub">Voici l’étape '+(s.idx+1)+' du parcours, en plus court. Vous repartez avec un geste à vous, même si vous vous arrêtez là.</p></div>'+fil+
    '<p class="lecture-l">'+esc(idee[0])+'</p>'+
    schHtml('vague')+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="ap" data-k="1">Choisir mon geste '+I.chev+'</button></div>';
  else if(k===1)corps='<div class="f-tete"><span class="label">Essai du parcours, étape '+(s.idx+1)+'</span><h1 class="t1">Votre geste, quand la vague monte</h1></div>'+fil+
    '<div class="mots-a"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Ce que j’ai vécu</b><small>Antonio</small></div></div><p>'+esc(Array.isArray(s.vecu)?s.vecu[0]:s.vecu)+'</p></div>'+
    '<p class="ap-consigne">'+esc(s.exo)+'</p>'+
    '<div class="ap-gestes" role="group" aria-label="Choisir un geste">'+AP_GESTES.map(g=>'<button type="button" class="ap-g" data-act="ap-g" data-v="'+g[0]+'" aria-pressed="'+(a.g===g[0])+'"><span class="resp-p" aria-hidden="true"></span><b>'+g[1]+'</b></button>').join('')+'</div>'+
    '<div class="field"><label for="ap-mot">'+esc(s.ecr)+'</label><textarea id="ap-mot" maxlength="'+LIM.note+'" placeholder="Vous pouvez aussi l’écrire avec vos mots.">'+esc(a.mot||'')+'</textarea></div>'+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="ap-garde">'+I.note+'Garder ce geste dans mon carnet</button><p class="hint">Votre geste reste sur votre appareil. Personne d’autre ne le lit.</p></div>';
  else if(k===2){const nt=noteDe(s.id);const avant=nt&&nt.d!==todayIso();
    corps='<div class="f-tete"><span class="label">Essai du parcours, étape '+(s.idx+1)+'</span><h1 class="t1">'+(avant?'Votre geste vous attendait':'C’est gardé dans votre carnet')+'</h1></div>'+fil+
    '<article class="carnet-p"><span class="label">Mon carnet de route, étape '+(s.idx+1)+'</span><p class="q">'+esc(s.ecr)+'</p><p class="ecrit">'+(nt?nl2(nt.t):'')+'</p><span class="hint">'+(nt?'Écrit le '+esc(fmtDate(nt.d)):'')+'</span></article>'+
    '<p class="lecture-l">'+(avant?'Vous pouvez le relire, le compléter dans votre carnet, ou voir ce que la suite du parcours vous apporterait.':'Vous retrouvez cette page quand vous voulez, dans « Parcours », puis « Mon carnet ». Un jour de tempête, c’est là que votre geste vous attend.')+'</p>'+
    (a.g==='souffle'?'<button type="button" class="btn wide" data-act="exo" data-id="breath">'+I.wind+'L’essayer maintenant avec « Souffler 2 minutes »</button>':'')+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="ap" data-k="3">Voir la semaine prochaine '+I.chev+'</button><button type="button" class="btn wide" data-act="go" data-view="carnet">'+I.note+'Ouvrir mon carnet</button></div>';}
  else{
    const deja=can('parcours');
    corps='<div class="f-tete"><span class="label">Essai du parcours</span><h1 class="t1">Ce que vous retrouvez la semaine prochaine</h1></div>'+fil+
    '<ol class="ap-semaine"><li><b>Votre geste, dans votre carnet.</b><span>Vous le relisez, et vous pouvez le compléter après l’avoir essayé.</span></li>'+
      (sv?'<li><b>Une nouvelle étape, « '+esc(sv.t)+' ».</b><span>'+esc(sv.acc||'')+'</span></li>':'')+
      '<li><b>La même forme, chaque semaine.</b><span>Vous comprenez une idée, vous l’essayez chez vous et vous écrivez quelques mots. Si vous vous absentez, rien ne s’accumule.</span></li></ol>'+
    (deja?'<div class="offre"><p class="f-benef">Vous avez déjà Le parcours.</p><button type="button" class="btn primary wide" data-act="go" data-view="parcours">'+I.path+'Ouvrir mon parcours</button></div>':
      '<section class="offre" aria-labelledby="offre-t"><div class="f-haut"><h2 id="offre-t">Le parcours</h2><p class="f-prix"><b>84 CHF</b> <small>en tout</small></p></div><p class="f-benef">'+F_TXT.parcours.b+'</p>'+
      payerParcours('apercu')+
      '<p class="f-note">24 étapes guidées, une par semaine, pendant 6 mois. Une fois acheté, le parcours reste ouvert sans limite de durée.</p>'+
      '<p class="demo-paie">'+I.info+'<span>'+demoPaie()+'</span></p></section>'+
      '<div class="ap-suite"><button type="button" class="btn wide" data-act="entrer" data-v="parcours">Continuer gratuitement avec l’étape 1</button><button type="button" class="lien-f" data-act="go" data-view="plans">Voir les 3 offres</button></div>');
  }
  return '<main id="main" tabindex="-1" class="view v-feuille v-apercu ap-'+k+'"><div class="feuille">'+corps+'</div></main>';
}

/* ---------- la commande, en démonstration ---------- */
/* Les écrans d'une vraie commande, sans paiement : le récapitulatif avec les dates et les montants, puis l'issue que l'on choisit de voir.
   Seul « paiement accepté » ouvre ce qui a été acheté. S'y ajoutent 2 écrans à part : retrouver un achat, et offrir à un parent (une maquette). */
function achete(f,m){
  const d=D(),A=achats();
  if(f==='parcours'){d.tier='parcours';A.parcours={m:m==='six'?'six':'une',le:todayIso(),n:1};}
  else if(f==='relais')A.relais={le:todayIso()};
  entrer('achat');save();
}
function viewCommande(){
  /* Pour un parent, la vente est fermée : aucune adresse ni aucun bouton ne mène à une commande. */
  if(!venteDemo())return viewPlans();
  const c=state.cmd||{},e=c.k||'recap';const f=PRODUITS[c.f]?c.f:'parcours',P=PRODUITS[f],X=F_TXT[f],six=f==='parcours'&&c.m==='six';
  const demo='<p class="demo-paie demo-fort">'+I.info+'<span>Ceci est une démonstration. Aucun montant réel n’est débité, et aucune carte n’est demandée.</span></p>';
  const tete=(l,t,s)=>'<div class="f-tete"><span class="label">'+l+'</span><h1 class="t1">'+t+'</h1>'+(s?'<p class="sub">'+s+'</p>':'')+'</div>';
  let corps='';
  if(e==='retrouver')corps=tete('Démonstration','Retrouver un achat','Vous avez changé d’appareil, ou effacé les données de votre navigateur ? Votre achat, lui, n’est pas perdu.')+demo+
      '<div class="cmd-recap"><p class="f-benef">Dans la vraie version, vous écrirez ici l’adresse e-mail utilisée pour l’achat.</p><ul><li>Vous recevrez un lien par e-mail, et ce lien rouvrira votre achat sur cet appareil.</li><li>Vos écrits, eux, ne voyagent pas avec l’achat. Pour les emporter, utilisez « Sauvegarder mes écrits ».</li></ul></div>'+
      '<section class="cmd-paie"><h2>'+POUR_DEMO+'</h2><p>Choisissez l’achat que ce lien rouvrirait.</p><div class="ap-suite"><button type="button" class="btn primary wide" data-act="cmd" data-v="retrouve" data-f="parcours">Simuler le lien pour Le parcours</button><button type="button" class="btn primary wide" data-act="cmd" data-v="retrouve" data-f="relais">Simuler le lien pour Passer le relais</button><button type="button" class="btn ghost wide" data-act="go" data-view="plans">Revenir aux offres</button></div></section>';
  else if(e==='retrouve')corps=tete('Démonstration','Votre achat est rouvert.',esc(P.t)+' est de nouveau ouvert sur cet appareil.')+demo+
      '<div class="ap-suite">'+(f==='relais'?'<button type="button" class="btn primary wide" data-act="rl" data-k="ouvre">'+I.hand+'Ouvrir Passer le relais</button>':'<button type="button" class="btn primary wide" data-act="go" data-view="parcours">'+I.path+'Ouvrir mon parcours</button>')+'<button type="button" class="btn wide" data-act="rl" data-k="sauver">'+I.download+'Restaurer mes écrits depuis un fichier</button></div>';
  else if(e==='cadeau')corps=tete('Maquette','Offrir à un parent','Vous payez une fois. Le parent reçoit un lien et active son cadeau quand il le souhaite.')+demo+
      '<div class="f-payer" role="group" aria-label="Choisir ce que vous offrez"><button type="button" class="btn f-mode" data-act="cadeau" data-v="parcours" aria-pressed="'+(f==='parcours')+'"><b>Le parcours</b><span>84 CHF, en une fois</span></button><button type="button" class="btn f-mode" data-act="cadeau" data-v="relais" aria-pressed="'+(f==='relais')+'"><b>Passer le relais</b><span>49 CHF, une seule fois</span></button></div>'+
      '<div class="cmd-recap"><p class="f-benef">'+X.b+'</p><ul><li>Le cadeau donne accès à '+esc(P.t)+', en entier.</li><li>Vous ne saurez ni quand le parent l’ouvre, ni ce qu’il y écrit. Ses écrits restent sur son appareil.</li><li>Le parent n’a rien à payer et aucun compte à créer.</li></ul></div>'+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="cmd" data-v="cadeau-ok">Simuler l’achat du cadeau</button><button type="button" class="btn ghost wide" data-act="go" data-view="plans">Revenir aux offres</button></div>';
  else if(e==='cadeau-ok'){const lien=PUBLIC+'#cadeau-'+f;
    corps=tete('Maquette','Votre cadeau est prêt.','Transmettez ce lien au parent, avec un mot de vous.')+demo+
      '<div class="field"><label for="cad-lien">Le lien du cadeau, à copier</label><input type="text" id="cad-lien" readonly value="'+esc(lien)+'"><p class="hint">Dans la vraie version, ce lien portera un code qui ne sert qu’une fois.</p></div>'+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="cadeau-envoi">'+I.share+'Envoyer le lien</button><button type="button" class="btn wide" data-act="cadeau-voir" data-v="'+f+'">Voir ce que le parent verra</button><button type="button" class="btn ghost wide" data-act="go" data-view="plans">Revenir aux offres</button></div>';}
  else if(e==='activer')corps=tete('Un cadeau pour vous','Quelqu’un vous offre '+esc(P.t)+'.',X.b)+demo+
      '<div class="cmd-recap"><ul><li>Vous l’activez quand vous voulez. Rien ne presse.</li><li>La personne qui vous l’offre ne voit rien de ce que vous faites ici.</li><li>Vous n’avez rien à payer et aucun compte à créer.</li></ul></div>'+
      '<div class="ap-suite">'+(can(f)?'<button type="button" class="btn wide" data-act="rien" aria-disabled="true">'+I.check+'Vous l’avez déjà</button>':'<button type="button" class="btn primary wide" data-act="cmd" data-v="active">'+I.star+'Activer mon cadeau</button>')+'<button type="button" class="btn ghost wide" data-act="entrer" data-v="today">Plus tard</button></div>';
  else if(e==='ok'||e==='active'){const A=achats();
    corps=tete(e==='active'?'Votre cadeau':'Démonstration',e==='active'?'Votre cadeau est activé.':'C’est confirmé.',esc(P.t)+' est à vous.')+demo+
      '<div class="cmd-recap"><p class="f-benef">'+(f==='relais'?'L’outil est ouvert, pour toute la famille.':'Votre parcours est ouvert.')+'</p><ul>'+(f==='relais'?'<li>Vous pouvez envoyer votre fiche, l’imprimer et la retrouver la prochaine fois.</li><li>Vous n’aurez rien d’autre à payer.</li>':'<li>Une étape s’ouvre chaque semaine, 7 jours après la précédente.</li><li>Votre carnet garde ce que vous écrivez, sur votre appareil.</li>'+(six&&e==='ok'?'':'<li>Vous n’aurez rien d’autre à payer.</li>'))+'<li>Ce que vous avez acheté reste ouvert sans limite de durée.</li></ul></div>'+
      (six&&e==='ok'&&A.parcours?'<section class="cmd-ech"><h2>Vos 6 mensualités</h2>'+echeancesHtml(A.parcours.le,A.parcours.n)+'</section>':'')+
      '<p class="hint">Pour retrouver cet achat sur un autre appareil, vous recevrez un lien par e-mail dans la vraie version. Ici, « Retrouver un achat » en montre le principe.</p>'+
      '<div class="ap-suite">'+(f==='relais'?'<button type="button" class="btn primary wide" data-act="rl" data-k="reprise">'+I.hand+(rlFiche(state.rl.id)?'Revenir à ma fiche':'Ouvrir Passer le relais')+'</button>':'<button type="button" class="btn primary wide" data-act="go" data-view="parcours">'+I.path+'Ouvrir mon parcours</button>')+'</div>';}
  else if(e==='refus')corps=tete('Démonstration','Le paiement n’a pas abouti.','Rien n’a été débité, et rien n’a changé dans votre espace.')+demo+
      '<div class="cmd-recap"><p class="f-benef">Dans la vraie version, vous pourrez réessayer ou choisir un autre moyen de paiement.</p><p class="f-note">Tout ce qui est gratuit reste ouvert, et ce que vous avez écrit est toujours là.</p></div>'+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="cmd" data-v="recap">Réessayer</button><button type="button" class="btn wide" data-act="go" data-view="plans">Revenir aux offres</button></div>';
  else if(e==='abandon')corps=tete('Démonstration','Vous avez arrêté avant de payer.','Rien n’a été débité, et rien n’a changé dans votre espace.')+demo+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="go" data-view="plans">Revenir aux offres</button><button type="button" class="btn wide" data-act="cmd" data-v="recap">Reprendre la commande</button></div>';
  else{
    const auj=dateLongue(todayIso());
    corps=tete('Démonstration de commande','Votre commande','')+demo+
      '<div class="cmd-recap"><div class="f-haut"><h2>'+esc(P.t)+'</h2><p class="f-prix"><b>'+P.p+' CHF</b> <small>'+(f==='relais'?'une seule fois':'en tout')+'</small></p></div><p class="f-benef">'+X.b+'</p><ul>'+X.c.slice(0,3).map(x=>'<li>'+x+'</li>').join('')+'</ul></div>'+
      (f==='parcours'?'<section class="cmd-mode" aria-labelledby="cmd-mode-t"><h2 id="cmd-mode-t">Votre façon de payer</h2><div class="f-payer" role="group" aria-labelledby="cmd-mode-t"><button type="button" class="btn f-mode" data-act="cmd-mode" data-v="une" aria-pressed="'+(!six)+'"><b>En une fois</b><span>84 CHF aujourd’hui</span></button><button type="button" class="btn f-mode" data-act="cmd-mode" data-v="six" aria-pressed="'+six+'"><b>En six fois</b><span>14 CHF aujourd’hui, puis 5 mensualités de 14 CHF</span></button></div>'+
        (six?echeancesHtml(todayIso(),0)+'<p class="f-note">En choisissant ce paiement, vous achetez le parcours complet. Les 6 mensualités sont dues.</p>':'<ol class="ech"><li><span>Aujourd’hui, le '+esc(auj)+'</span><b>84 CHF</b></li><li class="ech-total"><span>Total</span><b>84 CHF</b></li></ol><p class="f-note">Ensuite, plus rien n’est prélevé.</p>')+
        '<p class="f-total">'+TOTAL_84+'</p></section>':
        '<section class="cmd-mode"><h2>Ce que vous payez</h2><ol class="ech"><li><span>Aujourd’hui, le '+esc(auj)+'</span><b>49 CHF</b></li><li class="ech-total"><span>Total</span><b>49 CHF</b></li></ol><p class="f-note">Ensuite, plus rien n’est prélevé. Il n’y a ni abonnement ni renouvellement.</p></section>')+
      '<section class="cmd-garde"><h2>Ce que vous gardez</h2><ul class="list"><li>'+esc(P.t)+' reste ouvert sans limite de durée.</li><li>'+(f==='relais'?'Vos fiches restent sur votre appareil. Vous pouvez les envoyer, les imprimer et les sauvegarder dans un fichier.':'Votre carnet reste sur votre appareil. Vous pouvez le sauvegarder dans un fichier et imprimer « Mon chemin ».')+'</li></ul></section>'+
      '<section class="cmd-paie"><h2>Le paiement</h2><p>Dans la vraie version, vous paierez ici, auprès d’un prestataire de paiement. Il n’est pas encore choisi. '+POUR_DEMO+', choisissez l’issue que vous voulez voir.</p>'+
      '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="cmd" data-v="ok">Simuler un paiement accepté</button><button type="button" class="btn wide" data-act="cmd" data-v="refus">Simuler un paiement refusé</button><button type="button" class="btn ghost wide" data-act="cmd" data-v="abandon">Abandonner la commande</button></div></section>';
  }
  return '<main id="main" tabindex="-1" class="view v-feuille commande cde-'+e+'"><div class="feuille">'+corps+'</div></main>';
}
/* Ce que le parent a acheté, pour l'écran « Moi ». Dans la version d'essai, on peut y faire avancer les mensualités pour voir qu'elles s'arrêtent à la sixième. */
function achatsHtml(){
  const A=achats(),p=A.parcours,r=A.relais;const E=p&&p.m==='six'?echeances(p.le):null;const n=p?Math.min(NB_ECH,p.n||1):0;
  return '<div class="card mes-achats"><span class="label">Mes achats</span>'+
    '<div class="kv"><span>Découverte</span><span>ouverte, gratuite</span></div>'+
    '<div class="kv"><span>Le parcours</span><span>'+(p?(p.m==='six'?(n>=NB_ECH?'payé, 6 mensualités sur 6':n+' mensualité'+(n>1?'s':'')+' sur 6'):'payé en une fois'):'pas acheté')+'</span></div>'+
    (p&&E&&n<NB_ECH?'<p class="hint">La prochaine mensualité de 14 CHF est celle du '+esc(dateLongue(E[n]))+'. La dernière est celle du '+esc(dateLongue(E[NB_ECH-1]))+'.</p>':'')+
    (p&&E&&n>=NB_ECH?'<p class="hint">Les 6 mensualités sont payées. Plus rien ne sera prélevé.</p>':'')+
    '<div class="kv"><span>Passer le relais</span><span>'+(r?'acheté, 49 CHF':'pas acheté')+'</span></div>'+
    (venteDemo()&&p&&E&&n<NB_ECH?'<button type="button" class="btn small" data-act="ech-suite" style="align-self:flex-start">Simuler la mensualité suivante</button>':'')+
    '<div class="row"><button type="button" class="btn'+(p&&r?'':' primary')+'" data-act="go" data-view="plans">'+I.tag+'Voir les 3 offres</button></div>'+
    (venteDemo()&&(p||r)?'<button type="button" class="lien-f" data-act="achats-zero">Annuler mes achats de démonstration</button>':'')+'</div>';
}
/* Ce que cet appareil a compté, pour la carte « Version d'essai » de l'écran « Moi ». */
function reperesHtml(){
  const c=com(),a=c.ach||{},u=c.us||{};const dit=k=>a[k]?(k==='parcours'?(a[k].m==='six'?'en six fois':'en une fois')+', ':'')+'le '+fmtDate(a[k].d):'aucun';
  const rev=k=>Array.isArray(u[k])&&u[k].length>1?'oui, le '+fmtDate(u[k][1]):Array.isArray(u[k])&&u[k].length?'pas encore':'';
  /* Ce que l'on veut savoir d'un essai : a-t-il commencé, le parent a-t-il vu sa fiche comme son proche, a-t-il terminé l'étape du parcours.
     Les achats ne se comptent que là où la commande de démonstration existe. Aucune de ces mesures ne contient un mot écrit par le parent. */
  const demo=venteDemo();
  const l=[['Essai du relais commencé',c.re?'le '+fmtDate(c.re):'pas encore'],['Fiche vue à la place du proche',c.rv?'le '+fmtDate(c.rv):'pas encore'],['Essai du parcours terminé',c.ap?'le '+fmtDate(c.ap):'pas encore']];
  if(demo)l.push(['Achat du parcours',dit('parcours')],['Achat de Passer le relais',dit('relais')]);
  if(demo&&a.parcours)l.push(['Retour sur le parcours, un autre jour',rev('parcours')||'pas encore']);
  if(demo&&a.relais)l.push(['Retour sur Passer le relais, un autre jour',rev('relais')||'pas encore']);
  return '<div class="reperes"><span class="label">Les mesures du lancement, sur cet appareil</span>'+l.map(x=>'<div class="kv"><span>'+x[0]+'</span><span>'+esc(x[1])+'</span></div>').join('')+'<p class="hint">Ces mesures ne contiennent ni vos écrits, ni vos humeurs, ni votre situation. Dans cette '+NOM_ESSAI+', elles restent sur votre appareil et rien n’est envoyé.'+(demo?' Les achats sont des démonstrations.':'')+'</p></div>';
}

function sheetUpgrade(sheetIn){
  const u=UP[state.upFeat]||UP.parcours;
  /* La feuille ne vend pas : elle propose d'essayer d'abord, puis de voir les offres. */
  return '<div class="backdrop" data-act="sheet-close"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="up-title" tabindex="-1"><div class="sheet-in"><div class="grab"></div><span class="label">'+I.lock+' Fait partie du Parcours</span><h2 id="up-title" class="t2" style="font-family:var(--font-display);font-weight:500">'+esc(u.t)+'</h2><p>'+esc(u.s)+'</p>'+
    '<button type="button" class="btn primary wide" data-act="apercu">'+I.path+'Essayer une étape, en 3 minutes</button>'+
    '<button type="button" class="btn wide" data-act="go" data-view="plans">Voir les 3 offres et les prix</button>'+
    '<button type="button" class="btn ghost wide" data-act="sheet-close">Plus tard</button><p class="hint" style="text-align:center">'+demoPaie()+'</p></div></div>';
}

/* ---------- une page à transmettre ---------- */
/* Une association ou un professionnel peut envoyer cette page à une famille. Elle parle au parent, lui propose une seule chose à faire tout de suite,
   et donne à la personne qui transmet une phrase toute prête. */
const TRANSMETTRE_MOT='Je vous transmets cette page parce qu’on vous demande souvent comment va votre enfant, et plus rarement comment vous allez, vous. Ici, on commence par vous. C’est gratuit pour commencer, sans compte, et vous pouvez y souffler 2 minutes dès maintenant.';
function viewTransmettre(){
  const url=PUBLIC+'transmettre/';
  return '<main id="main" tabindex="-1" class="view v-feuille v-transmettre"><div class="feuille">'+
    '<div class="f-tete"><span class="label">Quelqu’un qui vous accompagne vous a transmis cette page</span><h1 class="t1">On vous demande souvent comment va votre enfant. Ici, on commence par vous.</h1></div>'+
    '<p class="lecture-l">Parent écouté, parent éclairé est un espace pour la mère ou le père d’une personne en situation de handicap, quel que soit son âge, tout-petit ou adulte depuis longtemps. Il a été créé par Antonio Company, éducateur social, responsable d’une équipe socio-éducative et père de 3 enfants.</p>'+
    '<p class="lecture-l">Vous pouvez commencer par 2 minutes pour vous, tout de suite. C’est gratuit, sans compte, et rien de ce que vous écrivez ne quitte votre appareil.</p>'+
    '<div class="ap-suite"><button type="button" class="btn primary wide" data-act="porte" data-v="souffle">'+I.wind+'Souffler 2 minutes, maintenant</button></div>'+
    '<section class="tr-suite" aria-labelledby="tr-suite-t"><h2 id="tr-suite-t">Ensuite, si vous le souhaitez</h2><ul class="tr-liens"><li><a class="lien-f" href="'+RACINE+'fiches/" data-act="fiches">'+I.kit+'Ouvrir une fiche pratique</a><span>Sur le coucher, les crises, l’école ou la vie en foyer.</span></li><li><button type="button" class="lien-f" data-act="apercu">'+I.path+'Essayer une vraie étape du parcours</button><span>En 3 minutes, sans rien créer.</span></li><li><button type="button" class="lien-f" data-act="rl" data-k="exemple">'+I.eye+'Voir un exemple de fiche de relais</button><span>Pour confier votre enfant à un proche.</span></li></ul></section>'+
    '<section class="tr-pro" aria-labelledby="tr-pro-t"><h2 id="tr-pro-t">Vous accompagnez des familles ?</h2><p>Vous pouvez transmettre cette page telle quelle, par message ou sur papier. Voici une phrase pour l’accompagner, à adapter avec vos mots.</p>'+
      '<blockquote class="tr-mot"><p>'+esc(TRANSMETTRE_MOT)+'</p></blockquote>'+
      '<div class="ap-suite"><button type="button" class="btn wide" data-act="tr-copie">'+I.share+'Copier la phrase et le lien</button></div>'+
      '<div class="field"><label for="tr-lien">Le lien de cette page</label><input type="text" id="tr-lien" readonly value="'+esc(url)+'"></div>'+
      '<ul class="list"><li>Cet espace ne remplace ni un suivi, ni un médecin, ni un thérapeute.</li><li>Il ne demande aucun diagnostic et ne crée aucun compte.</li><li>Ce que le parent écrit reste sur son appareil. Rien n’est enregistré sur un serveur.</li><li>Commencer est gratuit. Il existe 2 outils payants, sans abonnement, et le parent les découvre seulement s’il le souhaite.</li></ul>'+
      (CONTACT_R?'<p class="hint">Une question avant de transmettre ? Écrivez à '+esc(contact())+'.</p>':'')+'</section>'+
    '</div></main>';
}

/* ---------- une seule suite logique au bas d'une fiche ---------- */
/* Après la fiche sur les crises, l'essai d'une étape du parcours. Après une fiche qui parle de relais, l'outil « Passer le relais ».
   Après une fiche sur les réunions, la préparation d'une réunion. Ces cartes ne parlent pas de prix. Les autres fiches n'en ont pas. */
function suiteFiche(s){
  if(s.id==='crise')return '<div class="vers-apercu"><h2>Et vous, quand la vague monte ?</h2><p>Une étape du parcours vous aide à traverser ce moment sans rien casser. Vous pouvez l’essayer maintenant, en 3 minutes.</p><button type="button" class="btn" data-act="apercu">'+I.path+'Essayer cette étape</button></div>';
  if(['relais','aide','loin'].includes(s.id))return '<div class="vers-apercu vers-relais"><h2>Une page pour la personne qui prend le relais</h2><p>Vous choisissez 3 repères, avec vos mots, et votre proche les lit en 1 minute. Vous pouvez voir une fiche terminée avant de rien écrire.</p><button type="button" class="btn" data-act="rl" data-k="exemple">'+I.eye+'Voir un exemple de fiche terminée</button></div>';
  if(['pros','ecole'].includes(s.id))return '<div class="vers-apercu vers-relais"><h2>Arriver à la réunion avec vos mots</h2><p>L’outil « Passer le relais » vous aide aussi à préparer un rendez-vous, avec vos 3 priorités sous les yeux et un bouton « Je perds mes mots ».</p><button type="button" class="btn" data-act="rl" data-k="ouvre">'+I.hand+'Découvrir l’outil</button></div>';
  return '';
}
/* Le lien WhatsApp d'une fiche publique : le titre de la fiche et son adresse, rien d'autre. */
function waUrl(s){return 'https://wa.me/?text='+encodeURIComponent('« '+s.t+' », une fiche courte à lire. '+ficheUrl(s.id,true));}

/* ---------- avec Antonio ---------- */
function viewAntonio(){
  const d=D();const L=d.letters.slice().reverse();const Q=d.questions.slice().reverse();const ql=questionsLeft();
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Mes échanges avec Antonio</h1><p class="sub">Un travailleur social qui vous connaît sans que vous ayez à tout raconter, parce qu’il lit ce que vous choisissez de partager.</p></div>'+
    (DEMO?'<div class="demo-note"><b>Démonstration.</b> Dans cette version de test, rien n’est transmis à Antonio. Vos questions et vos dépôts cochés restent sur votre appareil, et le mot comme la réponse affichés ici sont des exemples. Les vrais échanges commenceront à l’ouverture des abonnements.</div>':'')+
    '<div class="card sun"><div class="kv"><span>Le mot d’Antonio</span><span>'+(DEMO?'le 1er de chaque mois':esc(nextLetterDate()))+'</span></div><div class="kv"><span>Dépôts cochés ce mois</span><span>'+sharedThisMonth()+'</span></div><div class="kv"><span>Questions restantes ce mois</span><span>'+ql+' sur '+Q_PER_MONTH+'</span></div><p class="hint">Pour partager un dépôt, cochez « Partager avec Antonio » sous le dépôt. Antonio lit seulement ce que vous cochez et les questions que vous lui envoyez.</p></div>'+
    (ql>0?'<div class="card"><label class="label" for="qdraft">Poser une question à Antonio</label><textarea id="qdraft" maxlength="'+LIM.q+'" placeholder="Décrivez une situation, une décision ou un doute, sans donner de prénom." style="min-height:90px">'+esc(state.qdraft)+'</textarea><button type="button" class="btn primary" data-act="qsend" style="align-self:flex-start">'+I.send+(DEMO?'Enregistrer ma question':'Envoyer ma question')+'</button></div>':'<div class="card"><span class="label">Poser une question à Antonio</span><p>Vos deux questions du mois sont posées. Vous pourrez en poser à nouveau le '+esc(nextLetterDate())+'. En attendant, « Déposer » reste ouvert.</p></div>')+
    (Q.length?Q.map(q=>'<div class="qa"><span class="st">'+esc(fmtDate(q.date))+(q.answer?', réponse d’Antonio le '+esc(fmtDate(q.answeredAt)):(DEMO?', gardée sur votre appareil et non transmise (version de test)':', en attente d’une réponse sous 48 h'))+'</span><p class="q">'+esc(q.text)+'</p>'+(q.answer?'<p class="a">'+esc(q.answer)+'</p>':'')+(q.risk?riskHtml('hint'):'')+'</div>').join(''):'')+
    ((DEMO||!Q.length)?'<div class="qa"><span class="st">Exemple de question et de réponse</span><p class="q">'+esc(QA_EXAMPLE.q)+'</p><p class="a">'+esc(QA_EXAMPLE.a)+'</p></div>':'')+
    '<div><span class="label">Les mots d’Antonio</span></div>'+
    (L.length?L.map((l,i)=>'<button type="button" class="letter" data-act="letter" data-i="'+(d.letters.length-1-i)+'"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>'+esc(MONTHS_FR[Number(l.date.slice(5,7))-1])+'</b><span>'+esc(fmtDate(l.date))+'</span></div></div><p>'+esc(l.text.split('\n')[0])+'</p></button>').join(''):'<button type="button" class="letter" data-act="letter" data-i="-1"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Exemple de mot</b><span>'+(DEMO?'Démonstration':'Votre premier arrive le '+esc(nextLetterDate()))+'</span></div></div><p>'+esc(LETTER_EXAMPLE.split('\n')[0])+'</p><span class="hint">Lire l’exemple '+I.chev+'</span></button>')+'</main>';
}
function viewLetter(){
  const i=state.letter;const l=i>=0?D().letters[i]:null;const txt=l?l.text:LETTER_EXAMPLE;
  return '<main id="main" tabindex="-1" class="view v-feuille"><div class="feuille f-lettre"><div class="f-tete"><span class="label">'+(l?'Le mot d’Antonio du '+esc(fmtDate(l.date)):'Un exemple de ce que sera le mot d’Antonio')+'</span><h1 class="t1">'+(D().me?'Bonjour '+esc(D().me)+',':'Bonjour,')+'</h1></div>'+
    '<div class="mots-a mots-grand">'+txt.split('\n').map(p=>'<p>'+esc(p)+'</p>').join('')+'<div class="from" style="margin-top:6px"><span class="av" aria-hidden="true">A</span><div><b>Antonio Company</b><small>'+ROLE_A+'</small></div></div></div>'+
    (l?'':'<p class="hint">Ceci est un exemple. Dans la version complète, Antonio écrira ce mot chaque mois à partir des dépôts que vous aurez partagés, de votre humeur et de vos étapes. Il ne citera jamais de prénom et ne posera jamais de diagnostic.</p>')+
    '<div class="quick"><button type="button" class="btn" data-act="porte" data-v="deposer">'+I.drop+'Déposer</button><button type="button" class="btn" data-act="go" data-view="antonio">'+I.question+'Poser une question</button></div></div></main>';
}
/* ---------- données / à propos ---------- */
function consentCard(){
  /* Tant qu'aucun outil de mesure n'est branché sur le site, il n'y a rien à accepter ni à refuser : la carte n'apparaît pas. */
  if(!SITE||!window.PEPEConsent||!window.PEPEConsent.active())return '';
  const c=window.PEPEConsent.get();
  const st=c?(c.audience?'Vous avez accepté la mesure d’audience anonyme le '+esc(fmtDate(c.date))+'.':'Vous avez refusé la mesure d’audience le '+esc(fmtDate(c.date))+'.'):'Vous n’avez pas encore fait de choix.';
  return '<div class="card"><span class="label">Cookies et mesure d’audience</span><p class="hint">Cet espace n’utilise aucun cookie. '+st+' <a href="'+RACINE+'confidentialite.html#cookies">En savoir plus</a></p><div class="row"><button type="button" class="btn small" data-act="consent" data-v="no" aria-pressed="'+(!!c&&!c.audience)+'">Refuser</button><button type="button" class="btn small" data-act="consent" data-v="yes" aria-pressed="'+(!!c&&c.audience)+'">Accepter</button></div></div>';
}
function viewData(){
  const where=state.sample?'Quand vous déposez, votre texte est envoyé sans votre nom à une intelligence artificielle, qui écrit la réponse. L’application, elle, ne le garde que sur cet appareil.':'Dans cette version, rien de ce que vous écrivez n’est envoyé, ni à un serveur ni à Antonio.';
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Vos données</h1><p class="sub">Vos dépôts, vos points et vos notes restent sur cet appareil. '+where+'</p></div>'+
    '<div class="card green"><span class="label">Bon à savoir</span><p class="hint">Vos dépôts ne sont pas protégés par un mot de passe. Si vous prêtez cet appareil, verrouillez-le ou effacez d’abord vos notes. Sachez aussi que si vous effacez les données de votre navigateur, vos notes sont perdues, sauf si vous en avez gardé une copie.</p></div>'+
    '<div class="card"><span class="label">Garder une copie</span><p class="hint">Vous pouvez sauvegarder tous vos écrits dans un fichier, sur votre appareil, puis les restaurer plus tard ou sur un autre appareil. Rien n’est envoyé.</p><button type="button" class="btn" data-act="rl" data-k="sauver" style="align-self:flex-start">'+I.download+'Sauvegarder ou restaurer mes écrits</button></div>'+
    '<div class="card"><span class="label">Recommencer depuis le début</span><p class="hint">Ce bouton efface tout ce qui est sur cet appareil, c’est-à-dire votre prénom, vos dépôts, vos étapes, votre carnet et vos points, puis il rouvre l’écran d’accueil et le questionnaire de départ. C’est utile pour faire tester l’application à une autre personne sur votre appareil.</p>'+(state.confirmReset?'<div class="confirm" role="alert"><span>Effacer tout le contenu sur cet appareil ?</span><div class="row"><button type="button" class="btn danger" data-act="reset-yes">Oui, effacer</button><button type="button" class="btn" data-act="reset-no">Annuler</button></div></div>':'<button type="button" class="btn danger" data-act="reset" style="align-self:flex-start">'+I.trash+'Tout effacer et recommencer</button>')+'</div>'+
    consentCard()+
    '<div class="card"><span class="label">Pour les tests</span><p class="hint">Vous pouvez aussi ajouter <b>?nouveau</b> à la fin de l’adresse. L’application repart alors de zéro sur cet appareil.</p></div></main>';
}
function viewAbout(){
  const peek=!D().onboarded;
  return '<main id="main" tabindex="-1" class="view v-feuille histoire" style="padding-top:0">'+
    '<div class="band story bleed" style="background-image:url('+HERO+')"><h1 class="t1">Avant d’accompagner des familles, j’ai moi-même été accueilli dans une famille.</h1></div>'+
    '<div class="feuille f-histoire"><div class="story">'+
    '<p>Je m’appelle Antonio. Avant de vous proposer cet espace, j’aimerais vous raconter un peu mon histoire, pour que vous sachiez qui est derrière.</p>'+
    '<ul class="places">'+
    '<li><h2>À dix ans</h2><p>J’ai été placé dans une famille d’accueil. Mes parents d’accueil sont devenus mon pilier et aujourd’hui encore, je les appelle Mami et Papi.</p><p>C’est chez eux que j’ai compris qu’une famille peut se construire autrement que ce qu’on avait prévu.</p></li>'+
    '<li><h2>À 19 ans</h2><p>J’ai commencé à travailler dans le social et je n’ai jamais arrêté. Cela fait maintenant plus de vingt ans. J’ai toujours accompagné des personnes en situation de handicap, avec ou sans troubles du comportement, et j’ai côtoyé leurs familles. Je me suis formé au fil des années et aujourd’hui, je forme à mon tour des apprentis. Je suis aussi responsable d’une équipe socio-éducative.</p><p>Pendant toutes ces années, j’ai rencontré beaucoup de parents. Beaucoup se sentent seuls, pas toujours compris, fatigués, et ils portent souvent de la culpabilité. Le regard des autres pèse aussi.</p><p class="big">Je me suis souvent dit qu’on s’occupe beaucoup de l’enfant, mais très peu du parent.</p></li>'+
    '<li><h2>À la maison</h2><p>Je suis père de trois enfants. Un de mes fils est né avec une cataracte congénitale et un autre a eu un retard de langage. Je sais ce que c’est quand la santé ou le développement d’un enfant prend beaucoup de place dans la vie d’une famille.</p><p>Dans ces moments-là, j’étais avant tout un papa, avec les mêmes questions que vous.</p></li>'+
    '</ul>'+
    '<p>Tout ce parcours m’a fait comprendre à quel point la présence de quelqu’un qui écoute et qui soutient peut tout changer.</p>'+
    '<div class="avec">'+
    '<p>On parle souvent d’ouverture à la différence. Moi, je préfère dire qu’on avance avec elle.</p>'+
    '<svg class="rings" viewBox="0 0 320 112" aria-hidden="true" focusable="false"><path class="drop" d="M160 8c5 9 8 14 8 19a8 8 0 0 1-16 0c0-5 3-10 8-19z"/><ellipse cx="160" cy="76" rx="30" ry="8" stroke-opacity=".95" stroke-width="1.7"/><ellipse cx="160" cy="76" rx="76" ry="19" stroke-opacity=".6" stroke-width="1.4"/><ellipse cx="160" cy="76" rx="132" ry="32" stroke-opacity=".34" stroke-width="1.1"/></svg>'+
    '<ul class="verbs"><li><b>Composer</b> <span>avec la différence</span></li><li><b>Apprendre</b> <span>avec la différence</span></li><li><b>Évoluer</b> <span>avec la différence</span></li></ul>'+
    '<p class="punch">C’est ce que j’essaie de faire chaque jour, au travail comme à la maison.</p>'+
    '</div>'+
    '<h2 class="chap">Ce que je crois</h2>'+
    '<p>Je crois que chaque parent a en lui des trésors insoupçonnés, et j’aimerais vous aider à retrouver les vôtres et votre pouvoir d’agir.</p>'+
    '<p>Je cours régulièrement et j’aime comparer la vie de parent à un marathon. On ne peut pas le courir au sprint et on a besoin de ravitaillements pour tenir. La dose de lumière que vous recevez chaque jour, je la vois comme un verre d’eau sur le parcours.</p>'+
    '<h2 class="chap">Pourquoi cet espace</h2>'+
    '<p>En février 2025, j’ai imaginé «\u00a0Parent écouté, parent éclairé\u00a0». Au départ, c’était un accompagnement de six mois pour les parents de personnes en situation de handicap. En avril, j’ai voulu l’ouvrir à tous les parents. Cette application, c’est la version que vous pouvez garder dans votre poche.</p>'+
    '<p>Écouté, cela veut dire que vous pouvez déposer librement ce qui vous pèse et être accueilli avec attention et douceur. Éclairé, cela veut dire que vous repartez avec quelque chose qui vous aide à retrouver un peu de paix, de clarté, de recul ou de confiance.</p>'+
    '<p>À l’époque, j’avais écrit ceci.</p>'+
    '<p class="quote">«\u00a0Parce qu’un parent écouté devient un parent éclairé. Et un parent éclairé devient un parent confiant, aligné et pleinement acteur du bien-être de son enfant.\u00a0»</p>'+
    '<p>Si je vous raconte tout cela, c’est pour que vous sachiez d’où vient cet espace. Il vient d’un enfant qui a eu la chance d’être écouté.</p>'+
    '<p>Ici, vous n’avez rien à prouver à personne. Vous pouvez simplement déposer ce qui vous pèse.</p>'+
    '<p>Merci d’avoir pris le temps de me lire.</p>'+
    '<div class="sign"><span class="logo-sceau" role="img" aria-label="Logo de Parent écouté, parent éclairé, une goutte au-dessus de ses 2 ondes.">'+LOGO+'</span><div><b>Antonio Company</b><span>Travailleur social depuis mes 19 ans, responsable d’une équipe socio-éducative, père de trois enfants.</span></div></div>'+
    '</div>'+
    (peek?'<button type="button" class="btn primary wide" data-act="entrer" data-v="today">'+I.sun2+'Commencer gratuitement</button>':'')+
    '<div class="card green"><h2 class="label">Ce que cet espace n’est pas</h2><ul class="list"><li>Ce n’est pas un diagnostic ni une thérapie. Pour cela, il y a votre pédiatre, votre médecin et les thérapeutes.</li><li>Ce n’est pas un service d’urgence. En cas de danger, appelez le '+tel('144')+'. Si vous êtes à bout, appelez le '+tel('143')+'.</li><li>Cela ne remplace pas les personnes qui vous entourent. C’est plutôt un pont vers elles.</li></ul></div><p class="hint">Version de test.</p></div></main>';
}
/* ---------- onglets, feuilles ---------- */
function tabs(){
  const grp={today:['today','deposer'],parcours:['parcours','step','carnet','evo','photo'],kit:['kit','sit','exo','relais'],me:['me','plans','depots','antonio','letter','data','about']};
  const cur=v=>grp[v].includes(state.view)?' aria-current="page"':'';
  return '<nav class="tabs" aria-label="Navigation"><a class="rail-brand" href="'+RACINE+'#accueil" data-act="accueil" aria-label="Parent écouté, parent éclairé. Revenir à l’accueil">'+LOGO+'<span>Parent écouté,<small>parent éclairé</small></span></a><div class="tabs-in">'+(large()?'<a class="tab tab-accueil" href="'+RACINE+'#accueil" data-act="accueil">'+I.home+'Accueil</a>':'')+'<button type="button" class="tab" data-act="go" data-view="today"'+cur('today')+'>'+I.sun2+'Aujourd’hui</button><button type="button" class="tab" data-act="go" data-view="parcours"'+cur('parcours')+'>'+I.path+'Parcours</button><button type="button" class="tab" data-act="go" data-view="kit"'+cur('kit')+'>'+I.kit+'Outils</button><button type="button" class="tab" data-act="go" data-view="me"'+cur('me')+'>'+I.user+'Moi</button></div>'+(large()?'<button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button>':'')+'</nav>';
}
/* « Faisons connaissance » : la personnalisation de l'espace. Elle est facultative, rien n'y est coché à l'avance,
   et les réponses ne sont gardées qu'au moment où le parent touche « Enregistrer » (state.ob est le brouillon). */
function sheetOnboard(sheetIn){
  const d=state.ob||D();const opt=(k,v,l)=>'<button type="button" class="chip" data-act="ob" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+(d[k]===v)+'">'+esc(l)+'</button>';
  const w=(k,l)=>'<button type="button" class="chip" data-act="obw" data-v="'+k+'" aria-pressed="'+(d.weights.includes(k))+'">'+esc(l)+'</button>';
  return '<div class="backdrop" data-act="sheet-close"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="ob-title" tabindex="-1"><div class="sheet-in"><div class="grab"></div><h2 id="ob-title">Faisons connaissance</h2>'+
    '<p class="hint">Tout est facultatif. Vos réponses servent à vous proposer d’abord ce qui vous concerne, et vous pouvez les changer à tout moment dans « Moi ».</p>'+
    '<div class="field"><label for="ob-me">Votre prénom</label><input type="text" id="ob-me" value="'+esc(d.me)+'" maxlength="'+LIM.me+'" autocomplete="given-name" autocapitalize="words" enterkeyhint="done"></div>'+
    '<div class="field"><span class="flabel" id="ob-l-age">Votre enfant est…</span><div class="chips" role="group" aria-labelledby="ob-l-age">'+opt('age','e','un enfant')+opt('age','a','un ado')+opt('age','g','un adulte')+'</div></div>'+
    '<div class="field"><span class="flabel" id="ob-l-sit">Votre situation</span><div class="chips" role="group" aria-labelledby="ob-l-sit">'+opt('situation','hand','handicap ou besoins particuliers')+opt('situation','diff','une période difficile')+opt('situation','parent','je suis parent, simplement')+'</div></div>'+
    '<div class="field"><span class="flabel" id="ob-l-w">Ce qui pèse le plus en ce moment (plusieurs réponses possibles)</span><div class="chips" role="group" aria-labelledby="ob-l-w">'+WEIGHTS.map(x=>w(x[0],x[1])).join('')+'</div></div>'+
    '<p class="hint">Je ne vous demande pas le prénom de votre enfant, parce que rien de ce qui le concerne ne doit sortir de votre poche.</p>'+
    '<button type="button" class="btn primary wide" data-act="ob-done">'+I.check+'Enregistrer</button><button type="button" class="btn ghost wide" data-act="sheet-close">Fermer sans rien changer</button></div></div>';
}
function mdLite(t){const lines=String(t).split('\n');let out='';let inl=false;for(const raw of lines){const l=raw.replace(/\*\*(.+?)\*\*/g,'$1');if(/^\s*[-•]\s+/.test(l)){if(!inl){out+='<ul class="list">';inl=true;}out+='<li>'+esc(l.replace(/^\s*[-•]\s+/,''))+'</li>';continue;}if(inl){out+='</ul>';inl=false;}if(/^#{1,3}\s/.test(l))out+='<p style="font-weight:800;margin-top:6px;color:var(--green)">'+esc(l.replace(/^#{1,3}\s*/,''))+'</p>';else if(l.trim())out+='<p>'+esc(l)+'</p>';}if(inl)out+='</ul>';return out;}

/* ---------- actions ---------- */
function nav(v){if(state.view==='souffle'&&v!=='souffle')souffleStop();if(state.dire){direGarde();state.dire=null;}state.prev=state.view;state.view=v;state.sheet=null;state.ob=null;state.confirmReset=false;state.confirmEssai=false;state.photoPick=false;state.photoOrder=null;state.pdraft=null;state.lien='';state.piste=false;}
function fxSig(){return [state.view,state.sit,state.exo,state.step,state.kit,state.piste?'piste':'',state.letter,!!D().onboarded,state.view==='photo'?(state.photoPick?'choix':'photo-'+(photoRec().id||'')):'',state.view==='apercu'?'ap'+state.ap.k:'',state.view==='commande'?state.cmd.f+'-'+state.cmd.k:'',state.view==='relais'?'rl-'+state.rl.e+(state.rl.e==='essai'?'.'+(state.rl.es||''):'')+'-'+state.rl.p+'-'+(state.rl.id||'')+'-'+(state.rl.r||''):'',state.view==='deposer'&&state.dire?'dire-'+state.dire.id:''].join('|');}
function handle(act,d,el){
  const data=D();const sig0=fxSig();const sheet0=state.sheet;const view0=state.view;
  switch(act){
    case 'peek-plans':state.prev=null;state.sheet=null;state.view='plans';break;
    case 'peek-about':nav('about');break;
    /* « Regarder avec la musique » ou « Regarder en silence » : le lecteur s'ouvre par-dessus l'accueil et la lecture commence, avec ou sans le son. Rien n'est réécrit dessous. */
    case 'film':filmOuvre(true,'film',d.v==='son');return;
    /* Le premier geste : une porte ouvre l'espace et mène tout de suite à ce qu'elle annonce. Rien n'est demandé avant. */
    case 'porte':{entrer(d.v);
      if(d.v==='souffle'){nav('souffle');SON.voulu=false;souffleStart();}
      else if(d.v==='deposer')nav('deposer');
      else{state.kit='sits';state.q='';nav('kit');state.piste=true;}
      break;}
    /* « Commencer le parcours de 6 mois » ouvre la première étape, comme le dit le bouton. Le parcours entier est la page d'avant : Retour y mène. */
    case 'entrer':{entrer(d.v||'');
      if(d.v==='parcours'&&stepEtat(0).k==='open'){nav('parcours');histPush();const s0=allSteps()[0];if(!data.tout&&!data.seen[s0.id]){data.seen[s0.id]=todayIso();save();}state.step=0;state.sch=1;nav('step');}
      else nav(d.v==='parcours'?'parcours':'today');
      break;}
    /* « Accueil » : la vitrine entière, pour un visiteur comme pour un parent déjà entré. */
    case 'accueil':nav('intro');break;
    case 'fiches':state.kit='sits';state.q='';nav('kit');break;
    /* « Encore 2 minutes » : si le parent écoutait l'étang, le son repart avec la respiration. Sinon, tout recommence en silence. */
    case 'souffle-go':{const avecSon=SON.voulu;souffleStart();if(avecSon)sonSouffle();break;}
    case 'souffle-stop':SON.voulu=false;souffleStop();break;
    case 'souffle-pause':soufflePause();break;
    /* « Changer de respiration » : le choix s'ouvre et se referme sans arrêter l'exercice. Un choix ou un réglage prend effet au mouvement suivant. */
    case 'resp-ouvre':state.souffle.choix=true;state.souffle.foc='.resp-o[aria-pressed="true"]';break;
    case 'resp-ferme':state.souffle.choix=false;state.souffle.foc='.resp-l';break;
    case 'resp':{if(!RESP[d.v])return;respGarde(d.v,0);respChoixMaj();return;}
    case 'cad':{const r=respReglage();const c=Math.max(CAD_MIN,Math.min(CAD_MAX,r.c+(d.v==='lent'?1:-1)));if(c!==r.c)respGarde('libre',c);respChoixMaj();return;}
    /* Le son : un geste pour l'entendre, le même geste pour le couper. La respiration, elle, continue. */
    case 'son':{if(d.v==='antonio'){if(SON.etat!=='off'&&SON.piste==='antonio')sonCoupe();else if(state.view==='avec')sonJoue('antonio','avec',null);return;}
      const nom=d.v==='instant'?'instant':'etang';
      if(SON.etat!=='off'&&SON.piste===nom){if(nom==='etang')SON.voulu=false;sonCoupe();}
      else if(nom==='etang'){if(state.view!=='souffle'||state.souffle.k!=='cours')return;SON.voulu=true;sonSouffle();}
      else{if(state.view!=='instant')return;sonJoue('instant','dose',null);}
      return;}
    case 'voix':state.sheet='voix';break;
    case 'partager':partager(d.id);return;
    case 'perso-tard':data.persoTard=true;save();toast('D’accord. Vous retrouverez ce réglage dans « Moi ».');break;
    case 'rouvrir-outil':if(!OUTILS_NOMS[d.v])return;state.tool=d.v;nav('kit');state.kit='tools';break;
    /* La version d'essai : ouvrir une copie des notes de l'espace habituel, ou revoir l'essai depuis le début. L'espace habituel n'est jamais modifié. */
    case 'essai-copie':{const n=essaiNotes();if(!ESSAI||!n)return;state.data=migre(Object.assign(JSON.parse(JSON.stringify(DEF)),JSON.parse(JSON.stringify(n))));save();state.view='today';state.prev=null;state.sheet=null;fxSync();render();histPush(true);window.scrollTo(0,0);toast('Une copie de vos notes est ouverte ici. Les originaux ne changent pas.');return;}
    case 'essai-zero':state.confirmEssai=true;break;
    case 'essai-zero-non':state.confirmEssai=false;break;
    case 'essai-zero-oui':if(!ESSAI)return;souffleStop();state.draft='';brouillonOte();placeOte();state.data=migre(JSON.parse(JSON.stringify(DEF)));try{localStorage.removeItem(KEY);}catch(e){}state.confirmEssai=false;state.view='intro';state.prev=null;state.sheet=null;fxSync();render();histPush(true);window.scrollTo(0,0);toast('La version d’essai repart du début.');return;
    case 'imprimer':try{window.print();}catch(e){}return;
    case 'intro-suite':{const s=document.querySelector('.intro .acc');if(s&&s.scrollIntoView)s.scrollIntoView({behavior:fxOn()?'smooth':'auto',block:'start'});return;}
    /* La personnalisation : un brouillon (state.ob), gardé seulement quand le parent touche « Enregistrer ». Toucher une réponse déjà choisie la retire. */
    case 'onboard':state.ob={me:data.me,age:data.age,situation:data.situation,weights:data.weights.slice()};state.sheet='onboard';break;
    case 'ob':if(state.ob)state.ob[d.k]=state.ob[d.k]===d.v?'':d.v;break;
    case 'obw':{if(!state.ob)break;const i=state.ob.weights.indexOf(d.v);if(i>=0)state.ob.weights.splice(i,1);else state.ob.weights.push(d.v);break;}
    case 'ob-done':{const o=state.ob;const m=document.getElementById('ob-me');data.me=clean(m?m.value:(o?o.me:data.me),LIM.me);if(o){data.age=o.age||'';data.situation=o.situation||'';data.weights=o.weights.slice();}data.perso=true;const first=entrer('perso');state.ob=null;state.sheet=null;save();if(first)state.view='today';toast('C’est enregistré.');break;}
    case 'go':if(d.view==='photo'&&!can('parcours')){openUpgrade('photo');break;}nav(d.view);if(d.view!=='kit'&&d.view!=='exo')stopTimer();break;
    /* Le bouton Retour de l'écran fait la même chose que celui du téléphone : il revient à la page d'avant.
       Quand il n'y a pas de page d'avant (on est arrivé ici par un lien), il remonte d'un niveau. */
    case 'back':{if(HIST.ok&&HIST.i>0){try{history.back();return;}catch(e){}}
      if(!data.onboarded){state.view=['apercu','commande'].includes(state.view)?'plans':'intro';state.sheet=null;break;}const v=state.view;if(v==='souffle')souffleStop();let t;if(v==='sit'||v==='exo'){t='kit';stopTimer();}else if(v==='step'||v==='carnet'||v==='final'||v==='photo'||v==='evo')t='parcours';else if(v==='letter')t='antonio';else if(['apercu','commande'].includes(v))t='plans';else if(v==='relais')t='kit';else if(v==='transmettre')t='intro';else if(['plans','depots','antonio','data','about'].includes(v))t='me';else t='today';if(state.prev&&state.prev!==v&&state.prev!=='sos')t=state.prev;state.prev=null;state.view=t;break;}
    case 'mood':data.moods[todayIso()]=Number(d.i);save();break;
    case 'kit':nav('kit');state.kit=d.v;if(d.v!=='tools')stopTimer();else if(d.tool==='timer')state.tool='timer';break;
    case 'sit':state.sit=d.id;nav('sit');noteRecent('sit',d.id);break;
    case 'age':state.age=d.v;break;
    case 'theme':state.theme=d.v;break;
    case 'dmode':state.depotMode=d.v;break;
    case 'dsend':sendDepot();return;
    /* « J'aimerais le dire à quelqu'un », depuis la zone d'écriture : les mots sont gardés d'abord, puis l'étape s'ouvre. */
    /* Champ vide, mais des mots déjà déposés aujourd'hui : le bouton prépare alors comment dire ceux-là, au lieu d'afficher une erreur. */
    case 'ddire':{if(clean(state.draft,LIM.draft).length<5){const td=D().depots.filter(x=>x.date===todayIso()).slice(-1)[0];if(td){handle('dire',{k:'ouvre',id:td.id},el);return;}}sendDepot('dire');return;}
    /* « J'ai fini pour aujourd'hui » : l'espace d'expression se referme simplement, et le parent retrouve l'accueil. */
    case 'dfin':nav('intro');setTimeout(()=>{if(state.view==='intro')toast('Vos mots sont gardés sur cet appareil. À bientôt.');},500);break;
    case 'dire':{
      const k=d.k;
      if(k==='ouvre'){const g=direOuvre(d.id);if(!g)break;if(state.view!=='deposer')nav('deposer');state.dire=g;break;}
      const g=state.dire;if(!g)break;
      /* Changer de destinataire remplace la première phrase seulement si le parent n'a pas commencé à écrire la sienne. */
      if(k==='a'){const v=d.v==='reunion'?'reunion':'proche';if(v!==g.a){const avant=direAmorces(g.a);const intacte=!clean(g.t,DIRE_LIM)||avant.some(m=>m.trim()===clean(g.t,DIRE_LIM));g.a=v;if(intacte)g.t=direAmorces(v)[0];g.mots=false;g.copie=false;direGarde();}break;}
      if(k==='mots'){g.mots=!g.mots;break;}
      if(k==='mot'){const m=direAmorces(g.a)[Number(d.i)];if(m){g.t=m;g.mots=false;g.copie=false;direGarde();state.direFoc=true;}break;}
      if(k==='joint'){g.j=!g.j;g.copie=false;direGarde();break;}
      if(k==='laisse'){direGarde();if(HIST.ok&&HIST.i>0){try{history.back();return;}catch(e){}}state.dire=null;break;}
      if(k==='copie'){
        direGarde();const t=direTexte();if(!t){fieldErr('amorce','Écrivez une première phrase, ou ajoutez vos mots à la suite.');return;}
        (async()=>{let ok=false;try{await navigator.clipboard.writeText(t);ok=true;}catch(e){}
          /* « ok » : le texte est dans le presse-papiers. « main » : le téléphone a refusé, le texte est alors sélectionné pour être copié à la main. L'écran ne dit « copié » que si c'est vrai. */
          g.copie=ok?'ok':'main';render();const el=document.getElementById('dire-texte');
          if(el){try{el.scrollIntoView({block:'center',behavior:fxOn()?'smooth':'auto'});}catch(e){}
            if(!ok){try{const r=document.createRange();r.selectNodeContents(el);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(r);}catch(e){}}}
          toast(ok?(g.j?'C’est copié, avec vos mots tels que vous les avez écrits.':'C’est copié.'):'Le texte est sélectionné juste en dessous. Vous pouvez le copier.');})();
        return;}
      break;}
    case 'dstop':if(state.ctl)state.ctl.abort();return;
    case 'dconcret':concret(d.id);return;
    case 'dose-perso':dosePerso();return;
    case 'share':data.shared[d.id]=!!(el&&el.checked);save();return;
    case 'upgrade':openUpgrade(d.f);break;
    /* Les aperçus, puis la commande en démonstration. Choisir une formule payante ouvre la commande, et c'est seulement « paiement accepté » qui change la formule. */
    case 'apercu':state.ap={k:0,g:'',mot:''};state.sch=1;state.sheet=null;nav('apercu');break;
    case 'ap':{const k=Math.max(0,Math.min(3,Number(d.k)||0));state.ap.k=k;if(k===3)repere('apercu');break;}
    case 'ap-g':{const m=document.getElementById('ap-mot');if(m)state.ap.mot=m.value;state.ap.g=state.ap.g===d.v?'':d.v;break;}
    case 'ap-garde':if(!apGarde()){toast('Choisissez un geste, ou écrivez le vôtre.');return;}state.ap.k=2;break;
    case 'apercu-reprise':state.ap={k:2,g:'',mot:''};state.sheet=null;if(!com().rp){com().rp=todayIso();save();}nav('apercu');break;
    case 'commande':{if(!PRODUITS[d.v])return;if(!venteDemo()){state.sheet=null;nav('plans');break;}if(can(d.v)){toast('Vous avez déjà '+PRODUITS[d.v].t+'.');return;}state.cmd={f:d.v,m:d.m==='six'?'six':'une',k:'recap',de:d.de||''};state.sheet=null;repere('choix',d.v);nav('commande');break;}
    case 'cmd-mode':state.cmd.m=d.v==='six'?'six':'une';break;
    case 'cmd':{const c=state.cmd;if(!c)return;const v=d.v;
      if(v==='retrouve'){if(!PRODUITS[d.f])return;c.f=d.f;if(!can(d.f))achete(d.f,'une');c.k='retrouve';break;}
      if(v==='cadeau-ok'){if(!PRODUITS[c.f])return;c.k='cadeau-ok';break;}
      if(v==='active'){if(!PRODUITS[c.f])return;if(!can(c.f))achete(c.f,'une');c.k='active';break;}
      if(['recap','ok','refus','abandon'].indexOf(v)<0||!PRODUITS[c.f])return;
      if(v==='ok'){achete(c.f,c.m);repere('achat',c.f,c.f==='parcours'?c.m:'');}
      c.k=v;break;}
    /* « Offrir à un parent » est une maquette. « Retrouver un achat » montre le principe du lien reçu par e-mail. */
    case 'cadeau':if(!venteDemo()){state.sheet=null;nav('plans');break;}state.cmd={f:PRODUITS[d.v]?d.v:(state.view==='commande'&&state.cmd.k==='cadeau'&&PRODUITS[state.cmd.f]?state.cmd.f:'parcours'),m:'une',k:'cadeau',de:''};state.sheet=null;if(state.view!=='commande')nav('commande');break;
    case 'cadeau-voir':if(!PRODUITS[d.v])return;state.cmd={f:d.v,m:'une',k:'activer',de:''};break;
    case 'cadeau-envoi':{const u=PUBLIC+'#cadeau-'+state.cmd.f;(async()=>{if(navigator.share){try{await navigator.share({title:'Un cadeau pour vous',text:'Je vous offre '+PRODUITS[state.cmd.f].t+', sur Parent écouté, parent éclairé. Vous l’activez quand vous voulez.',url:u});return;}catch(e){if(e&&e.name==='AbortError')return;}}try{await navigator.clipboard.writeText(u);toast('Le lien du cadeau est copié.');}catch(e){const c=document.getElementById('cad-lien');if(c){try{c.focus();c.select();}catch(x){}}}})();return;}
    case 'retrouver':if(!venteDemo()){state.sheet=null;nav('plans');break;}state.cmd={f:'parcours',m:'une',k:'retrouver',de:''};state.sheet=null;nav('commande');break;
    case 'ech-suite':{const p=achats().parcours;if(!p||p.m!=='six'||(p.n||1)>=NB_ECH)return;p.n=(p.n||1)+1;save();toast(p.n>=NB_ECH?'La 6e mensualité est payée. Plus rien ne sera prélevé.':'Mensualité '+p.n+' sur 6, en démonstration.');break;}
    case 'achats-zero':data.tier='free';data.achats={};save();toast('Vos achats de démonstration sont annulés. Rien de ce que vous avez écrit n’a été effacé.');break;
    /* « Passer le relais » a ses propres gestes, dans v2-r.js. */
    case 'rl':if(rlAct(d)===false)return;break;
    case 'transmettre':nav('transmettre');break;
    case 'tr-copie':{const t=TRANSMETTRE_MOT+'\n'+PUBLIC+'transmettre/';(async()=>{try{await navigator.clipboard.writeText(t);toast('La phrase et le lien sont copiés.');}catch(e){const c=document.getElementById('tr-lien');if(c){try{c.focus();c.select();}catch(x){}}toast('Le lien est prêt à être copié, juste en dessous.');}})();return;}
    case 'rien':return;
    case 'step':{const i=Number(d.i);const e=stepEtat(i);if(can('parcours'))usage('parcours');
      if(e.k==='formule'){openUpgrade('parcours');break;}
      if(e.k==='bientot'){toast('Cette étape s’ouvrira '+dansJours(e.n)+'. Chaque étape demande une semaine de pratique.');return;}
      if(e.k!=='open'){toast('Cette étape s’ouvrira plus tard, quand vous aurez ouvert celles qui la précèdent.');return;}
      const s=allSteps()[i];if(!data.tout&&!data.seen[s.id]){data.seen[s.id]=todayIso();save();}
      state.step=i;state.sch=1;nav('step');break;}
    case 'stepdone':{const id=d.id;if(!id)return;data.steps[id]=!data.steps[id];save();if(data.steps[id]){state.bravoAt=Date.now();toast('Étape faite. Une par semaine, c’est le bon rythme.');}break;}
    /* Le schéma avance d'un moment, sans redessiner l'écran. */
    case 'schnext':{const bx=document.querySelector('.sch');const S=bx?SCHEMAS[bx.dataset.sch]:null;if(!S)return;state.sch=Math.min(S.caps.length,(state.sch||1)+1);schSync(true);return;}
    case 'schagain':state.sch=1;schSync(false);return;
    /* Les 3 temps de l'étape : toucher un temps y descend, sans redessiner l'écran. */
    case 'temps':{const h=document.getElementById('t-'+d.k);if(!h)return;const br=document.querySelector('.app>.bar');const y=h.getBoundingClientRect().top+(window.scrollY||0)-(br?br.offsetHeight:0)-14;
      try{window.scrollTo({top:Math.max(0,y),behavior:fxOn()?'smooth':'auto'});}catch(e){window.scrollTo(0,Math.max(0,y));}
      try{h.focus({preventScroll:true});}catch(e){}return;}
    /* L'aperçu d'Antonio : cinq touches sur le titre « Moi » le font apparaître sur l'appareil, puis une ligne de « Moi » l'allume et l'éteint. */
    case 'atelier':{const now=Date.now();state.atTaps=(state.atTaps||[]).filter(x=>now-x<4000);state.atTaps.push(now);if(state.atTaps.length<5)return;state.atTaps=[];if(data.atelier)return;data.atelier=true;data.tout=true;save();toast('Aperçu d’Antonio activé sur cet appareil. Tout le parcours est ouvert.');break;}
    case 'tout':if(!data.atelier)return;data.tout=!data.tout;save();toast(data.tout?'Aperçu activé. Tout le parcours est ouvert sur cet appareil.':'Aperçu désactivé. Vous voyez le parcours comme un parent.');break;
    case 'evotime':if(d.v!=='t1'&&!can('parcours')){openUpgrade('evo');break;}state.evoTime=d.v;break;
    case 'evosave':{if(state.evoTime!=='t1'&&!can('parcours')){openUpgrade('evo');break;}const rec={date:todayIso()};EVO_SCALES.forEach(s=>{const x=document.querySelector('[data-evo="'+s.id+'"]');rec[s.id]=x?Number(x.value):5;});EVO_OPEN.forEach(o=>{const x=document.querySelector('[data-evoopen="'+o[0]+'"]');rec[o[0]]=x?clean(x.value,LIM.evo):'';});const first=state.evoTime==='t1'&&!data.evo.t1;data.evo[state.evoTime]=rec;if(state.evoDraft)delete state.evoDraft[state.evoTime];save();/* Le premier point de départ se fait depuis l'étape 1 (ou depuis le parcours) : une fois enregistré, on revient là d'où l'on venait. */
      if(first){if(HIST.ok&&HIST.i>0){state.apres='Votre point de départ est enregistré.';try{history.back();return;}catch(e){state.apres='';}}
        nav(state.prev&&state.prev!=='evo'?state.prev:'parcours');histPush();render();window.scrollTo(0,0);toast('Votre point de départ est enregistré.');return;}render();toast('Point enregistré. Ce qui bouge est à vous.');return;}
    case 'evoset':{const r=document.querySelector('[data-evo="'+d.k+'"]');if(r){r.value=d.v;evoSync(r);if(r.focus)r.focus({preventScroll:true});}return;}
    case 'photopick':{const av=photoRec();data.photo={id:d.id,text:av.text,date:av.id===d.id?av.date:''};state.photoPick=false;state.lastKey=null;save();break;}
    case 'photoback':state.photoPick=true;state.lastKey=null;break;
    case 'photosave':{const t=document.getElementById('ptext');const av=photoRec();if(!av.id){toast('Choisissez d’abord une photo, puis écrivez ce qu’elle évoque.');return;}data.photo={id:av.id,text:t?clean(t.value,LIM.photo):'',date:todayIso()};
      /* Le final montre toutes les photos choisies : un choix refait le même jour remplace celui du jour, un autre jour il s'ajoute. */
      {if(!Array.isArray(data.photos))data.photos=[];const L=data.photos,der=L[L.length-1],r={id:data.photo.id,text:data.photo.text,date:data.photo.date};if(der&&der.date===r.date)L[L.length-1]=r;else L.push(r);if(L.length>12)L.splice(0,L.length-12);}
      state.pdraft=null;save();render();toast('Gardé.');return;}
    case 'tool':state.tool=d.v;if(d.v!=='timer')stopTimer();noteRecent('tool',d.v);break;
    case 'mvc':if(MV_COUL.some(x=>x[0]===d.v)){data.mvc=d.v;save();}break;
    case 'tset':stopTimer();state.timer.total=Number(d.m)*60;state.timer.left=state.timer.total;break;
    case 'ttoggle':if(state.timer.running)stopTimer();else{if(state.timer.left===0)state.timer.left=state.timer.total;state.timer.running=true;state.timer.h=setInterval(tick,1000);}break;
    case 'treset':stopTimer();state.timer.left=state.timer.total;break;
    case 'minute':if(state.timer.running)stopTimer();else{state.timer.total=60;state.timer.left=60;state.timer.running=true;state.timer.h=setInterval(tick,1000);}break;
    /* Le tableau « d'abord, ensuite » : on vise une case, puis on y pose une image. Une image ne peut être qu'à un seul endroit du tableau. */
    case 'ftpick':state.ft.pick=d.k==='then'?'then':'first';ftSync();return;
    case 'ftset':{if(!PICTO_PAR[d.id])return;const k=state.ft.pick,autre=k==='first'?'then':'first';const f=ftRec();f[k]=d.id;if(f[autre]===d.id)f[autre]=null;data.ft=f;save();/* la case visée passe à l'autre tant que celle-ci est vide */if(!f[autre])state.ft.pick=autre;ftSync('cases');return;}
    case 'ftg':state.ft.g=d.v;ftSync('groupe');return;
    case 'ftvide':{data.ft={first:null,then:null};state.ft.pick='first';save();ftSync('cases');const b1=document.querySelector('#ft [data-k="first"]');if(b1){try{b1.focus({preventScroll:true});}catch(e){}}return;}
    case 'rdone':{const t=todayIso();data.routineDone[t]=data.routineDone[t]||{};data.routineDone[t][d.i]=!data.routineDone[t][d.i];save();rSync();return;}
    case 'rreset':data.routineDone[todayIso()]={};save();rSync();return;
    case 'abcadd':{const a=clean(document.getElementById('a1').value,LIM.line),b=clean(document.getElementById('a2').value,LIM.line),c=clean(document.getElementById('a3').value,LIM.line);if(!a&&!b&&!c){fieldErr('a1','Écrivez au moins une des trois lignes.');return;}const n=new Date();data.abc.push({date:todayIso(),time:pad(n.getHours())+':'+pad(n.getMinutes()),a,b,c});save();render();toast('Noté.');return;}
    case 'phadd':{const v=clean(document.getElementById('ph').value,LIM.phrase);if(!v){fieldErr('ph','Écrivez la phrase à garder.');return;}if(data.phrases.includes(v)){fieldErr('ph','Cette phrase est déjà dans votre liste.');return;}data.phrases.push(v);save();render();toast('Gardée.');return;}
    case 'phdel':data.phrases.splice(Number(d.i),1);save();break;
    case 'exo':if(d.id==='breath'){nav('souffle');SON.voulu=false;souffleStart();break;}state.exo=d.id;nav('exo');noteRecent('exo',d.id);break;
    case 'threeadd':{const items=['t1','t2','t3'].map(id=>clean(document.getElementById(id).value,LIM.three)).filter(Boolean);if(!items.length){fieldErr('t1','Une seule chose suffit, écrivez-la ici.');return;}data.three.push({date:todayIso(),items});save();render();toast('Gardé.');return;}
    case 'depose':{const t=document.getElementById('dep');if(t&&t.value&&fxOn()){t.classList.add('ink');setTimeout(()=>{t.value='';t.classList.remove('ink');},1150);}else if(t)t.value='';toast('C’est déposé, vous n’avez plus à le garder en vous.');return;}
    case 'letter':state.letter=Number(d.i);nav('letter');break;
    case 'qsend':{const t=clean(state.qdraft,LIM.q);if(t.length<10){fieldErr('qdraft','Écrivez votre question en une phrase ou deux (dix caractères au moins).');return;}if(questionsLeft()===0){toast('Vos deux questions du mois sont posées.');return;}const risk=RISK.test(t);data.questions.push(risk?{id:'q'+Date.now(),date:todayIso(),text:t,risk:true}:{id:'q'+Date.now(),date:todayIso(),text:t});state.qdraft='';save();render();toast(risk?'Si c’est urgent, n’attendez pas et appelez le 143 ou le 144 maintenant.':(DEMO?'Votre question est gardée sur votre appareil. Dans cette version de test, elle n’est pas transmise à Antonio.':'Votre question est envoyée. Antonio répond par écrit sous 48 heures.'));return;}
    case 'sheet-close':state.sheet=null;state.ob=null;break;
    case 'fx':data.fxOff=!data.fxOff;save();fxSync();toast(data.fxOff?'Les effets visuels sont désactivés.':'Les effets visuels sont activés.');break;
    case 'consent':if(window.PEPEConsent)window.PEPEConsent.set(d.v==='yes');break;
    case 'reset':state.confirmReset=true;break;
    case 'reset-no':state.confirmReset=false;break;
    case 'reset-yes':souffleStop();state.draft='';brouillonOte();placeOte();state.data=migre(JSON.parse(JSON.stringify(DEF)));try{localStorage.removeItem(KEY);localStorage.removeItem(KEY_AVANT);}catch(e){}state.confirmReset=false;state.view='intro';state.prev=null;fxSync();render();histPush(true);window.scrollTo(0,0);toast('Effacé.');return;
    default:return;
  }
  const navAct=['go','sit','back','exo','step','kit','letter','peek-plans','peek-about','ob-done','photopick','photoback','porte','entrer','accueil','fiches','rouvrir-outil','apercu','apercu-reprise','ap','ap-garde','commande','cmd','cadeau','cadeau-voir','retrouver','transmettre','dfin'].includes(act)||((act==='rl'||act==='dire')&&fxSig()!==sig0);
  /* Chaque nouvel écran est une page de l'historique. Ce qui se passe à l'intérieur d'un même écran (une rubrique de la boîte à outils, le choix d'une photo) remplace la page au lieu d'en ajouter une. */
  /* L'aperçu d'une fiche du relais (ou la fiche d'exemple) : l'écran arrive en simple fondu, parce que c'est la feuille qui fait le mouvement.
     Elle vient se poser, et la page s'ouvre de façon que ses 3 repères se lisent ensemble. */
  const pose=act==='rl'&&state.view==='relais'&&(state.rl.e==='apercu'||state.rl.e==='exemple');const recu=act==='rl'&&state.view==='relais'&&state.rl.e==='recu';
  /* Le bouton « Le minuteur visuel » d'une fiche mène tout droit au minuteur, et pas en haut de la boîte à outils. */
  const versMinuteur=act==='kit'&&d.tool==='timer';
  /* Dans l'essai du relais, passer d'un repère au suivant ne joue aucun effet : l'écran est redessiné dans le geste même, et le curseur se pose
     aussitôt dans le nouveau champ. Sur un téléphone, le clavier reste ainsi ouvert d'un repère à l'autre. */
  const pasEssai=act==='rl'&&state.view==='relais'&&state.rl.e==='essai'&&state.rl.es==='ecrire'&&sig0.indexOf('rl-essai.ecrire-')>=0;
  if(pasEssai&&fxSig()!==sig0){histPush(false);render();window.scrollTo(0,0);rlApres();return;}
  if(navAct&&fxSig()!==sig0){histPush((act==='kit'&&view0==='kit')||act==='photopick'||act==='photoback'||act==='ob-done'||act==='cmd'||(act==='cadeau'&&view0==='commande'));fxGo(()=>{render();window.scrollTo(0,0);if(pose)rlVoirTrois();if(versMinuteur)minuteurEnVue();},(pose||recu)?'fade':act==='back'||act==='photoback'?'back':(act==='kit'||(el&&el.classList&&el.classList.contains('tab'))?'tab':'open'));return;}
  /* Une feuille qui se referme s'efface en douceur elle aussi, quand le navigateur sait faire le fondu d'écran. */
  if(sheet0&&!state.sheet){fxGo(()=>{render();if(navAct)window.scrollTo(0,0);},'fade',true);return;}
  render();
  if(act==='rl')rlApres();
  if(act==='dire')direApres();
  if(navAct)window.scrollTo(0,0);
}
const app=document.getElementById('app');
app.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.tagName==='INPUT'||el.tagName==='LABEL')return;
  if(el.tagName==='A'){if(e.defaultPrevented||e.button>0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();}
  handle(el.dataset.act,el.dataset,el);});
app.addEventListener('change',e=>{const el=e.target;if(el.dataset&&el.dataset.rlf){rlFichier(el);return;}if(el.tagName==='INPUT'&&el.dataset.act==='share')handle('share',el.dataset,el);if(el.dataset&&el.dataset.note&&noteAttend){clearTimeout(noteT);noteAttend=false;save();}});
/* Si l'on quitte la page pendant qu'on écrit dans le carnet, les derniers mots sont gardés tout de suite. Rien n'est écrit s'il n'y a rien en attente,
   pour ne pas écraser ce qu'un autre onglet aurait enregistré entre-temps. */
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&noteAttend){clearTimeout(noteT);noteAttend=false;save();}});
let typing=null,noteT=null,noteAttend=false,direT=null;
app.addEventListener('input',e=>{
  const t=e.target;clearErr(t);
  /* Les champs de « Passer le relais » se gardent tout seuls. */
  if(t.dataset&&t.dataset.rl)rlSaisie(t);
  /* Le carnet de route se garde tout seul, pendant qu'on écrit. */
  if(t.dataset&&t.dataset.note){const id=t.dataset.note;const v=String(t.value).slice(0,LIM.note);if(v.trim())D().notes[id]={t:v,d:todayIso()};else delete D().notes[id];clearTimeout(noteT);noteAttend=true;noteT=setTimeout(()=>{noteAttend=false;save();},400);const st=document.getElementById('note-etat');if(st){const m=v.trim()?NOTE_OUI:NOTE_NON;if(st.textContent!==m)st.textContent=m;}carnetHaut(t);lectureSync();}
  if(t.id==='draft'){state.draft=t.value;updCount(t);brouillonGarde();}
  if(t.id==='amorce'&&state.dire){state.dire.t=String(t.value).slice(0,DIRE_LIM);/* Le parent reprend sa phrase après avoir copié : le texte prêt n'est plus le bon, il s'efface jusqu'à la prochaine copie. */
    if(state.dire.copie){state.dire.copie=false;try{document.querySelectorAll('main.dire .dire-pret,main.dire .vers-relais').forEach(e=>e.remove());}catch(e){}}clearTimeout(direT);direT=setTimeout(direGarde,400);}
  if(t.id==='qdraft')state.qdraft=t.value;
  if(t.id==='ptext')state.pdraft=t.value;
  if(t.dataset&&t.dataset.evo)evoSync(t);
  if(t.dataset&&t.dataset.evoopen){const k=state.evoTime;state.evoDraft=state.evoDraft||{};state.evoDraft[k]=state.evoDraft[k]||{};state.evoDraft[k][t.dataset.evoopen]=t.value;}
  if(t.id==='ob-me'&&state.ob)state.ob.me=String(t.value).slice(0,LIM.me);
  if(t.id==='q'){state.q=t.value;clearTimeout(typing);typing=setTimeout(()=>{const pos=t.selectionStart;render();const nq=document.getElementById('q');if(nq){nq.focus();try{nq.setSelectionRange(pos,pos);}catch(e){}}},250);}
});
/* Entrée valide les champs d'une seule ligne, comme sur un vrai formulaire. */
app.addEventListener('keydown',e=>{
  if(e.key!=='Enter'||e.isComposing)return;const t=e.target;
  if(t.id==='ph'){e.preventDefault();handle('phadd',{},t);}
  else if(t.id==='ob-me'){e.preventDefault();handle('ob-done',{},t);}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.sheet){state.sheet=null;state.ob=null;fxGo(render,'fade',true);}});
/* Dans l'essai du relais, la touche Entrée valide le repère et passe au suivant. Maj et Entrée vont à la ligne. */
document.addEventListener('keydown',e=>{if(e.key!=='Enter'||e.shiftKey||e.isComposing)return;const t=e.target;if(!t||t.id!=='rl-es-t')return;e.preventDefault();const b=document.getElementById('rl-es-suite');if(b)b.click();});
try{if(/[?&](nouveau|reset|new)\b/.test(location.search)){localStorage.removeItem(KEY);localStorage.removeItem(KEY_AVANT);try{sessionStorage.removeItem(KEY+'-place');sessionStorage.removeItem(KEY+'-brouillon');}catch(e){}if(history.replaceState)history.replaceState(null,'',location.pathname+location.hash);}}catch(e){}
state.data=load();
/* L'aperçu d'Antonio s'active aussi par l'adresse …/#atelier. Ce n'est pas un verrou : il sert à tout relire sans attendre les sept jours. */
let atelierMsg=false;
try{if(INTERNE&&(location.hash==='#interne'||location.hash==='#public')){if(location.hash==='#interne')sessionStorage.setItem('pepe-interne','1');else sessionStorage.removeItem('pepe-interne');if(history.replaceState)history.replaceState(null,'',location.pathname+location.search);}}catch(e){}
try{if(location.hash==='#atelier'){state.data.atelier=true;state.data.tout=true;save();atelierMsg=true;if(history.replaceState)history.replaceState(null,'',location.pathname+location.search);}}catch(e){}
fxSync();
/* La fenêtre passe d'un format à l'autre (fenêtre agrandie ou réduite, tablette qu'on tourne) : l'écran est réécrit dans le bon ordre, sans perdre ce qui est en cours de saisie. */
if(MQ_LARGE){const relayout=()=>{const keep={};document.querySelectorAll('#app input[id],#app textarea[id]').forEach(el=>{if(el.type!=='range'&&el.type!=='checkbox'&&el.type!=='radio')keep[el.id]=el.value;});render();Object.keys(keep).forEach(id=>{const el=document.getElementById(id);if(el&&el.value!==keep[id])el.value=keep[id];});};if(MQ_LARGE.addEventListener)MQ_LARGE.addEventListener('change',relayout);else if(MQ_LARGE.addListener)MQ_LARGE.addListener(relayout);
  /* le passage de 2 à 3 colonnes ne concerne que la boîte à outils */
  if(MQ_TROIS){const trois=()=>{if(state.view==='kit')relayout();};if(MQ_TROIS.addEventListener)MQ_TROIS.addEventListener('change',trois);else if(MQ_TROIS.addListener)MQ_TROIS.addListener(trois);}}
window.addEventListener('scroll',lectureScroll,{passive:true});window.addEventListener('resize',lectureScroll,{passive:true});
if(FX_OK){document.addEventListener('pointerdown',fxTap,{passive:true,capture:true});document.addEventListener('pointerup',fxLeve,{passive:true,capture:true});document.addEventListener('pointercancel',()=>{fxPt.vt=false;},{passive:true,capture:true});document.addEventListener('click',fxDouble,true);document.addEventListener('pointerdown',eauTouch,{passive:true});window.addEventListener('resize',()=>{EAU.geo=null;},{passive:true});window.addEventListener('popstate',e=>{if(e&&e.hasUAVisualTransition)fxSkip=Date.now();});if(FX_RM&&FX_RM.addEventListener)FX_RM.addEventListener('change',()=>{fxSync();});}
/* Sur le site, l'adresse dit quel écran ouvrir : une fiche (…/fiches/le-coucher-et-la-nuit/), la liste des situations (…/fiches/) ou « Mon histoire » (…/#histoire).
   On peut envoyer ces adresses telles quelles, et le bouton Retour du téléphone fonctionne partout. */
const r0=routeDe();
if(r0){state.view=r0.v;if(r0.sit)state.sit=r0.sit;if(r0.kit)state.kit=r0.kit;
  /* Une fiche de relais reçue par lien se lit dès l'arrivée. Un cadeau ou « Offrir » ouvrent leur écran de la même façon. */
  if(r0.re==='lu')rlDuHash();
  if(r0.cf)state.cmd={f:r0.cf,m:'une',k:r0.ck||'recap',de:''};}
/* Un visiteur arrive sur la vitrine. Elle compte comme une page de l'historique : après « Souffler 2 minutes », « Retour » y ramène. */
else if(!D().onboarded)state.view='intro';
/* Le téléphone recharge parfois la page tout seul (on a changé d'application un instant, ou l'on revient d'une page de texte) :
   dans la demi-heure, le parent retrouve l'écran où il était, et le texte qu'il était en train d'écrire. Plus tard, il arrive sur « Aujourd'hui ». */
let y0=0;
if(SITE&&!PRE){try{
  const venue=((performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{}).type;
  const pl=JSON.parse(sessionStorage.getItem(PLACE)||'null');
  if((venue==='reload'||venue==='back_forward')&&pl&&pl.s&&Date.now()-pl.t<30*60000&&D().onboarded&&(!r0||(r0.v===pl.s.v&&(r0.v!=='sit'||r0.sit===pl.s.sit)))){navApply(pl.s);y0=pl.y||0;}
}catch(e){}}
brouillonLit();
if(SITE)window.addEventListener('hashchange',()=>{
  /* L'adresse …/#atelier, tapée alors que l'espace est déjà ouvert, allume l'aperçu d'Antonio sans recharger la page. */
  if(location.hash==='#atelier'){const d=D();d.atelier=true;d.tout=true;save();histPush(true);if(d.onboarded)render();toast('Aperçu d’Antonio activé sur cet appareil. Tout le parcours est ouvert.');}
  /* Une fiche de relais reçue par lien, ou un cadeau, ouverts alors que la page est déjà là. */
  else if(/^#f=/.test(location.hash)){rlDuHash();if(state.view!=='relais')nav('relais');histPush(true);render();window.scrollTo(0,0);}
  else if(/^#cadeau-(parcours|relais)$/.test(location.hash)){state.cmd={f:location.hash.slice(8),m:'une',k:'activer',de:''};nav('commande');histPush(true);render();window.scrollTo(0,0);}
  /* Les adresses des offres, de l'essai du parcours et du relais, tapées alors que l'espace est ouvert. */
  else if(VUES_HASH[location.hash]&&state.view!==VUES_HASH[location.hash]){const v=VUES_HASH[location.hash];if(v==='apercu'){state.ap={k:0,g:'',mot:''};state.sch=1;}nav(v);histPush(true);render();window.scrollTo(0,0);}
  /* L'adresse …/#accueil, tapée alors que l'espace est ouvert, montre la vitrine. */
  else if(location.hash==='#accueil'&&state.view!=='intro'){nav('intro');histPush(true);render();window.scrollTo(0,0);}
  /* L'adresse …/#film (ou …/#capsule) montre la vitrine, puis le lecteur du film. La lecture attend le geste du parent. */
  else if(filmDe(location.hash)){const lequel=filmDe(location.hash);if(state.view!=='intro'){nav('intro');histPush(true);render();window.scrollTo(0,0);}else histPush(true);filmOuvre(false,lequel);}
});
if(SITE)window.addEventListener('popstate',histRetour);
/* La respiration s'arrête quand l'écran s'éteint ou que l'on change d'onglet, et reprend là où elle en était. */
document.addEventListener('visibilitychange',()=>{const z=state.souffle;if(z.k!=='cours'||z.pz)return;
  if(document.visibilityState==='hidden'){if(!z.hid)z.hid=performance.now();veilleOff();}
  else{if(z.hid){souffleDecale(performance.now()-z.hid);z.hid=0;}veilleOn();souffleApres();}});
/* Le son s'arrête dès que la page passe à l'arrière-plan. Au retour, celui de la respiration reprend là où en est l'exercice. Celui de la dose reste coupé. */
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'){if(SON.etat!=='off'){SON.reprise=(SON.proprio==='souffle'&&state.souffle.k==='cours')?1:null;const r=SON.reprise;sonCoupe(true);SON.reprise=r;}}
  else{
    /* Si le téléphone a figé le son avant la fin de son extinction, ce qui restait se tait pour de bon au retour. */
    sonTaire();
    if(SON.reprise){SON.reprise=null;if(state.view==='souffle'&&state.souffle.k==='cours'&&SON.voulu)sonSouffle();}
  }
});
window.addEventListener('pagehide',()=>{SON.reprise=null;sonCoupe(true);});
window.addEventListener('resize',()=>{if(state.view==='souffle')soufflePose();},{passive:true});
state.inClaude=!SITE&&!!(window.claude&&typeof window.claude.use==='function');
if(SITE)state.sample=false;
/* Sur le site, l'accueil, la liste des situations et chaque fiche sont déjà écrits dans leur page (affichage immédiat, lisible sans JavaScript
   par les moteurs et par les aperçus de lien) : pour un visiteur, on garde l'écran tel quel. Un parent déjà entré retrouve son espace. */
{const pre=app.getAttribute('data-prerender');
  if(!D().onboarded&&!PRE&&((pre==='intro'&&(!r0||r0.v==='intro'))||(pre==='pub-sit'&&r0&&r0.v==='sit')||(pre==='pub-kit'&&r0&&r0.v==='kit'))){
    state.lastKey=pre;app.removeAttribute('data-prerender');heureLive();titreSync();
    if(pre==='intro'){introLive();fxMark();eauArrive(true);}else fxMark();
  }else{render();if(y0)window.scrollTo(0,y0);}}
histInit();
/* Arrivé par l'adresse …/#film : le lecteur est là, prêt, et attend le geste du parent. */
if(FILM_LIEN)filmOuvre(false,FILM_LIEN);
/* En quittant la page (autre application, autre page, onglet fermé) : on note l'heure et l'endroit, pour les retrouver au retour. */
window.addEventListener('pagehide',histQuitte);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')histQuitte();});
if(atelierMsg)toast('Aperçu d’Antonio activé sur cet appareil. Tout le parcours est ouvert.');
if(!SITE)(async()=>{try{if(state.inClaude){const s=await window.claude.use('sample');state.sample=s||false;}else state.sample=false;}catch(e){state.sample=false;}if(D().onboarded||state.view==='plans')render();})();
})();
</script>
