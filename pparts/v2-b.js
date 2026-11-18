
/* ---------- boîte à outils ---------- */
function viewKit(){
  const seg='<div class="seg" role="group" aria-label="Rubriques de la boîte à outils"><button type="button" data-act="kit" data-v="sits" aria-pressed="'+(state.kit==='sits')+'">Situations</button><button type="button" data-act="kit" data-v="tools" aria-pressed="'+(state.kit==='tools')+'">Outils</button><button type="button" data-act="kit" data-v="me" aria-pressed="'+(state.kit==='me')+'">Pour moi</button></div>';
  let body='';
  if(state.kit==='sits')body=kitSits();else if(state.kit==='tools')body=kitTools();else body=kitMe();
  return '<main id="main" tabindex="-1" class="view k-'+state.kit+'" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:left 55%"><h1 class="t1">La boîte à outils</h1></div><p class="sub">'+(state.kit==='sits'?'Vous trouverez ici vingt-deux situations de la vraie vie, avec des pistes venues du terrain et toujours un mot pour vous.':state.kit==='tools'?'Ce sont les outils que les éducateurs utilisent tous les jours, et vous pouvez les poser sur la table de la cuisine.':'Deux minutes rien que pour vous, parce que vous êtes aussi une personne et pas seulement un parent.')+'</p>'+seg+body+'</main>';
}
/* Les situations sont rangées par thèmes : chaque thème a son titre, son compte et sa liste. Une recherche donne une seule liste. */
const GROUPES=[['comp','Le comportement'],['comm','La communication'],['quot','Le quotidien'],['ecole','L’école, les professionnels, l’avenir'],['fam','La famille'],['moi','Vous, parent']];
function sitRow(s){return '<button type="button" class="sit" data-act="sit" data-id="'+s.id+'"><span class="e">'+s.e+'</span><span class="tx"><b>'+esc(s.t)+'</b><span>'+esc(s.s)+'</span></span><span class="chev">'+I.chev+'</span></button>';}
function kitSits(){
  let list=SITS.filter(s=>state.age==='all'||s.ages.includes(state.age));
  const q=state.q.trim().toLowerCase();if(q)list=list.filter(s=>(s.t+' '+s.s+' '+s.comp).toLowerCase().includes(q));
  const corps=!list.length?'<p class="hint">Je n’ai rien trouvé pour ce mot. Vous pouvez le déposer sur l’accueil, et vous recevrez une réponse.</p>':
    q?'<div class="grp"><div class="liste">'+list.map(sitRow).join('')+'</div></div>':
    GROUPES.map(g=>{const L=list.filter(s=>s.th===g[0]);return L.length?'<section class="grp"><h2><span class="nom">'+g[1]+'</span><span class="nb" aria-hidden="true">'+L.length+'</span></h2><div class="liste">'+L.map(sitRow).join('')+'</div></section>':'';}).join('');
  return '<div class="search">'+I.search+'<input type="search" id="q" aria-label="Chercher une situation" maxlength="'+LIM.search+'" placeholder="Coucher, crise, école…" value="'+esc(state.q)+'" autocomplete="off" enterkeyhint="search"></div>'+
    '<div class="chips scroll" role="group" aria-label="Âge">'+Object.keys(AGES).map(k=>'<button type="button" class="chip" data-act="age" data-v="'+k+'" aria-pressed="'+(state.age===k)+'">'+AGES[k]+'</button>').join('')+'</div>'+
    '<div class="sits groupes'+(q?' trouve':'')+'">'+corps+'</div>';
}
function viewSit(){
  const s=SITS.find(x=>x.id===state.sit);if(!s){state.view='kit';return viewKit();}
  const li=a=>'<ul class="list">'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  /* Les autres situations du même thème, pour continuer sans repasser par la liste. */
  const pr=SITS.filter(x=>x.th===s.th&&x.id!==s.id).slice(0,3);
  return '<main id="main" tabindex="-1" class="view fiche"><div class="couv"><span class="med" aria-hidden="true">'+s.e+'</span><span class="label">'+esc(liste(s.ages.map((a,i)=>i?AGES[a].toLowerCase():AGES[a])))+'</span><h1 class="t1">'+esc(s.t)+'</h1><p class="sub">'+esc(s.s)+'</p></div>'+
    '<div class="card sec comp"><h2><span class="dot"></span>Ce qui se passe</h2><p>'+esc(s.comp)+'</p></div>'+
    '<div class="card sec ess"><h2><span class="dot"></span>Ce que vous pouvez essayer</h2>'+li(s.ess)+'</div>'+
    '<div class="card sec ev"><h2><span class="dot"></span>Ce qu’il vaut mieux éviter</h2>'+li(s.ev)+'</div>'+
    '<div class="comfort"><span class="label">Un mot pour vous</span><p>'+esc(s.moi)+'</p></div>'+
    '<div class="card sec aide"><h2><span class="dot"></span>Quand demander de l’aide</h2><p>'+esc(s.aide)+'</p></div>'+
    '<div class="quick"><button type="button" class="btn" data-act="go" data-view="today">'+I.drop+'Déposer</button><button type="button" class="btn" data-act="kit" data-v="tools">'+I.tools+'Les outils</button></div>'+
    (pr.length?'<section class="grp proches"><h2><span class="nom">Dans le même thème</span></h2><div class="liste">'+pr.map(sitRow).join('')+'</div></section>':'')+'</main>';
}
function kitTools(){
  const tabs=[['timer','Minuteur'],['ft','D’abord, ensuite'],['routine','Routine'],['abc','Journal'],['phr','Mes phrases']];
  const seg='<div class="chips scroll" role="group" aria-label="Outils">'+tabs.map(t=>'<button type="button" class="chip" data-act="tool" data-v="'+t[0]+'" aria-pressed="'+(state.tool===t[0])+'">'+t[1]+'</button>').join('')+'</div>';
  let body='';
  if(state.tool==='timer')body=toolTimer();else if(state.tool==='ft')body=toolFT();else if(state.tool==='routine')body=toolRoutine();else if(state.tool==='abc')body=toolABC();else body=toolPhr();
  return seg+body;
}
function toolTimer(){const t=state.timer;const mins=[1,2,3,5,10,15];return '<div class="card green" style="align-items:center"><span class="label">Minuteur visuel</span><p class="hint" style="text-align:center">Votre enfant voit le temps qui reste. Vous pouvez lui dire « Quand le vert a disparu, on range ».</p><div class="timerwrap"><div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" style="fill:none;stroke:var(--surface);stroke-width:12"/><circle id="arc" cx="60" cy="60" r="52" style="fill:none;stroke:var(--green);stroke-width:12;stroke-linecap:round;stroke-dasharray:326.7;stroke-dashoffset:0"/></svg><div class="num" id="tnum">'+Math.floor(t.left/60)+':'+pad(t.left%60)+'</div></div><div class="bigrow">'+mins.map(m=>'<button type="button" class="btn small'+(t.total===m*60?' primary':'')+'" data-act="tset" data-m="'+m+'">'+m+' min</button>').join('')+'</div><div class="bigrow"><button type="button" class="btn primary" data-act="ttoggle">'+(t.running?I.stop+'Pause':I.timer+'Lancer')+'</button><button type="button" class="btn" data-act="treset">Remettre</button></div></div></div>';}
function drawTimer(){const t=state.timer;const arc=document.getElementById('arc');const num=document.getElementById('tnum');if(!arc||!num)return;const frac=t.total?t.left/t.total:0;arc.style.strokeDashoffset=String(326.7*(1-frac));num.textContent=Math.floor(t.left/60)+':'+pad(t.left%60);arc.style.stroke=frac<.2?'var(--coral)':'var(--green)';}
function tick(){const t=state.timer;if(!t.running)return;t.left=Math.max(0,t.left-1);drawTimer();if(t.left===0){t.running=false;clearInterval(t.h);t.h=null;try{if(navigator.vibrate)navigator.vibrate([200,100,200]);}catch(e){}toast('C’est fini. Bravo.');render();}}
function stopTimer(){const t=state.timer;t.running=false;if(t.h){clearInterval(t.h);t.h=null;}}
/* ---------- « D'abord, ensuite » et la routine : des cartes-images ---------- */
/* Les images sont des cartes blanches, une seule chose par carte, avec le mot dessous. Le tableau choisi est gardé sur l'appareil (data.ft).
   Toucher une image ou une case ne redessine pas l'écran : seules les parties qui changent sont mises à jour, pour que les images ne clignotent pas. */
const PICTO_DIR=SITE?'img/pictos/':'https://parent-ecoute.ch/img/pictos/';
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
  else if(x.id==='deposer')body='<div class="card"><textarea id="dep" aria-label="Ce qui pèse (rien n’est gardé)" maxlength="10000" style="min-height:200px" placeholder="Tout ce qui tourne…"></textarea><button type="button" class="btn primary" data-act="depose" style="align-self:flex-start">'+I.wind+'Déposer et effacer</button><p class="hint">Rien n’est enregistré, et le texte disparaît dès que vous appuyez. Si vous souhaitez une réponse, utilisez plutôt « Déposer » sur l’accueil.</p></div>';
  else if(x.id==='droit')body='<div class="perm">'+PERMISSIONS.map(p=>'<div><b>'+esc(p[0])+'</b> '+esc(p[1])+'</div>').join('')+'</div>';
  else if(x.id==='minute')body='<div class="card green" style="align-items:center"><div class="ring" style="width:200px;height:200px"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" style="fill:none;stroke:var(--surface);stroke-width:12"/><circle id="arc" cx="60" cy="60" r="52" style="fill:none;stroke:var(--green);stroke-width:12;stroke-linecap:round;stroke-dasharray:326.7;stroke-dashoffset:0"/></svg><div class="num" id="tnum" style="font-size:44px">'+Math.floor(state.timer.left/60)+':'+pad(state.timer.left%60)+'</div></div><button type="button" class="btn primary" data-act="minute">'+(state.timer.running?I.stop+'Arrêter':I.timer+'Une minute')+'</button></div>';
  else if(x.id==='appeler')body='<div class="log">'+HELP.map(h=>'<div class="logi"><b>'+esc(h.t)+'</b>'+(h.tel?'<span style="font-size:22px">'+tel(h.tel)+'</span>':'<a href="'+h.url+'" target="_blank" rel="noopener noreferrer" style="font-size:18px;font-weight:800">'+esc(h.label)+' '+I.ext+'<span class="sr"> (nouvel onglet)</span></a>')+'<span class="hint">'+esc(h.d)+'</span></div>').join('')+'</div>';
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">'+esc(x.t)+'</h1>'+(x.how?'<p class="sub">'+esc(x.how)+'</p>':'')+'</div>'+body+'</main>';
}
function viewSOS(){
  return '<main id="main" tabindex="-1" class="view sosview" style="padding-top:14px"><header class="bar"><button type="button" class="back" data-act="go" data-view="today">'+I.back+'Sortir</button></header>'+
    '<div><h1 class="t1" style="color:var(--coral)">Là, maintenant.</h1><p class="sub">Vous n’avez rien à réussir, juste à laisser passer la vague. Suivez ces quatre étapes dans l’ordre.</p></div>'+
    '<div class="sosstep"><span class="n">1</span><div class="tx"><b>Sécurité</b><span>Écartez ce qui peut blesser et laissez de la place. Ne retenez pas votre enfant si ce n’est pas nécessaire.</span></div></div>'+
    '<div class="sosstep"><span class="n">2</span><div class="tx"><b>Moins</b><span>Mettez moins de mots, moins de lumière et moins de bruit. Répétez calmement une seule phrase, par exemple « Je suis là, on attend ».</span></div></div>'+
    '<div class="sosstep"><span class="n">3</span><div class="tx"><b>Vous</b><span>Posez vos pieds bien au sol et respirez avec le cercle. Si tout est sûr, vous avez le droit de sortir trente secondes.</span></div></div>'+
    '<div class="breath"><div class="orbwrap" aria-hidden="true"><div class="orb"></div></div><div class="txt">Inspirez… expirez…</div></div>'+
    '<div class="sosstep"><span class="n">4</span><div class="tx"><b>Après</b><span>Proposez un verre d’eau et un geste doux s’il est accepté. Ne revenez pas sur la scène et ne punissez pas, parce qu’on ne punit pas une vague. Plus tard, notez ce qui s’est passé juste avant.</span></div></div>'+
    '<div class="emg"><b>Si quelqu’un est en danger</b><span>Appelez le '+tel('144')+' pour les urgences ou le '+tel('117')+' pour la police.</span><span>Si c’est vous qui n’en pouvez plus, appelez La Main Tendue au '+tel('143')+', de jour comme de nuit.</span></div>'+
    '<button type="button" class="btn primary wide" data-act="go" data-view="today">C’est passé, je reviens</button><p class="hint">Ce que vous venez de faire, c’est exactement ce qu’un professionnel aurait fait.</p></main>';
}
/* ---------- moi ---------- */
function moodDots(){const d=D();const out=[];for(let i=13;i>=0;i--){const dt=new Date(Date.now()-i*86400000);const k=dt.getFullYear()+'-'+pad(dt.getMonth()+1)+'-'+pad(dt.getDate());const m=d.moods[k];out.push('<i class="'+(m!==undefined?'m'+m:'')+'"></i>');}const n=out.filter(x=>x.indexOf('class="m')>0).length;return '<div class="mooddots" role="img" aria-label="Humeur notée '+n+' jour'+(n>1?'s':'')+' sur les quatorze derniers">'+out.join('')+'</div>';}
function viewMe(){
  const d=D();const T=TIERS[tier()];const ld=lastDepot();const ql=questionsLeft();
  const nf=doneCount(),np=nbNotes(),nd=d.depots.length;const dep=d.start?dateLongue(d.start):'';
  /* Trois chiffres en haut : les étapes faites, les pages écrites, les dépôts. Chacun mène à son écran. */
  const trio='<div class="trio"><button type="button" data-act="go" data-view="parcours"><b>'+nf+'</b><span>étape'+(nf>1?'s':'')+' faite'+(nf>1?'s':'')+'</span></button><button type="button" data-act="go" data-view="carnet"><b>'+np+'</b><span>page'+(np>1?'s':'')+' écrite'+(np>1?'s':'')+'</span></button><button type="button" data-act="go" data-view="depots"><b>'+nd+'</b><span>dépôt'+(nd>1?'s':'')+'</span></button></div>';
  return '<main id="main" tabindex="-1" class="view moi" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:right 70%"><h1 class="t1" data-act="atelier">Moi</h1></div><p class="sub">'+(dep?'Vous avez commencé le '+esc(dep)+'. ':'')+'Vous retrouvez ici votre formule, vos dépôts, votre carnet, votre humeur et vos réglages.</p>'+
    '<div class="duo"><div class="duo-a">'+trio+'<div class="card"><span class="label">Ma formule</span><div class="row" style="align-items:center;justify-content:space-between">'+badge()+'<span class="price" style="font-family:var(--font-display);font-size:22px">'+esc(T.p)+' CHF <small style="font-size:13px;color:var(--muted);font-family:var(--font-ui);font-weight:700">'+esc(T.per)+'</small></span></div>'+
    (tier()==='free'?'<p class="hint">Vous avez la dose, la boîte à outils, le SOS, trois dépôts écoutés et la première étape. Il vous reste '+depotsLeft()+' dépôt'+(depotsLeft()>1?'s':'')+'.</p>':tier()==='parcours'?'<p class="hint">Vous avez les dépôts sans limite, la dose personnalisée, les 24 étapes, Mon évolution et le photolangage.</p>':'<p class="hint">Vous avez tout Le parcours, le mot d’Antonio chaque mois et deux questions par mois.</p>')+
    '<button type="button" class="btn'+(tier()==='free'?' primary':'')+'" data-act="go" data-view="plans" style="align-self:flex-start">'+I.tag+(tier()==='free'?'Voir les formules':'Changer de formule')+'</button></div>'+
    (can('antonio')?'<button type="button" class="sit" data-act="go" data-view="antonio"><span class="e">'+I.mail+'</span><span class="tx"><b>Mes échanges avec Antonio</b><span>'+(DEMO?'Démonstration avec un exemple de mot et de réponse':'Prochain mot le '+esc(nextLetterDate())+', il vous reste '+ql+' question'+(ql>1?'s':''))+'</span></span><span class="chev">'+I.chev+'</span></button>':'<button type="button" class="sit" data-act="upgrade" data-f="antonio"><span class="e">'+I.lock+'</span><span class="tx"><b>Avec Antonio</b><span>Un mot par mois et deux questions</span></span><span class="chev">'+I.chev+'</span></button>')+
    '<button type="button" class="sit" data-act="go" data-view="final"><span class="e">'+I.path+'</span><span class="tx"><b>Mon chemin</b><span>Tout votre parcours sur une page, à garder ou à imprimer</span></span><span class="chev">'+I.chev+'</span></button>'+
    '</div><div class="duo-b"><div class="card"><span class="label">Mon humeur, quatorze jours</span>'+moodDots()+'<p class="hint">Chaque carré représente un jour, du plus ancien au plus récent. C’est ce qu’Antonio regardera en premier dans la formule Avec Antonio.</p></div>'+
    '<div class="menu-list"><button type="button" data-act="fx" aria-pressed="'+(!d.fxOff)+'">'+I.sun2+'<span>Effets visuels</span><span class="state">'+(FX_RM&&FX_RM.matches?'Coupés par votre appareil':d.fxOff?'Désactivés':(fxOn()&&eauInit()===false?'Activés, sans l’eau':'Activés'))+'</span></button>'+(d.atelier?'<button type="button" data-act="tout" aria-pressed="'+(!!d.tout)+'">'+I.path+'<span>Tout voir, l’aperçu d’Antonio</span><span class="state">'+(d.tout?'Activé':'Désactivé')+'</span></button>':'')+'<button type="button" data-act="onboard">'+I.swap+'<span>Modifier le début (prénom, âge, situation)</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="go" data-view="data">'+I.download+'<span>Vos données et tout recommencer</span><span class="chev">'+I.chev+'</span></button><button type="button" data-act="go" data-view="about">'+I.info+'<span>L’histoire d’Antonio</span><span class="chev">'+I.chev+'</span></button>'+
    (SITE?'<a href="confidentialite.html">'+I.shield+'<span>Politique de confidentialité</span><span class="chev">'+I.chev+'</span></a><a href="conditions.html">'+I.note+'<span>Conditions générales</span><span class="chev">'+I.chev+'</span></a>'+(MENTIONS?'<a href="mentions-legales.html">'+I.info+'<span>Mentions légales</span><span class="chev">'+I.chev+'</span></a>':''):'')+'</div></div></div></main>';
}
function viewDepots(){
  const list=D().depots.slice().reverse();
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Mes dépôts</h1><p class="sub">Vous retrouvez ici tout ce que vous avez déposé et ce que vous avez reçu en retour. Tout reste sur votre appareil.'+(can('antonio')?(DEMO?' Dans la version complète, Antonio ne lira que les dépôts cochés « Partager ». Dans cette version de test, rien ne lui est transmis.':' Seuls les dépôts cochés « Partager » sont lus par Antonio.'):'')+'</p></div>'+
    (list.length?'<div class="depots">'+list.map(x=>depotHtml(x,false)).join('')+'</div>':'<div class="card"><p>Vous n’avez encore rien déposé. Le premier dépôt se fait sur l’accueil, dans « Déposer ce qui pèse ».</p><button type="button" class="btn primary" data-act="go" data-view="today" style="align-self:flex-start">'+I.drop+'Déposer</button></div>')+'</main>';
}
/* ---------- formules ---------- */
function cell(v){if(v===true)return '<td>'+I.check+'<span class="sr">inclus</span></td>';if(v===false)return '<td class="no"><span class="sr">non inclus</span></td>';return '<td class="tx">'+esc(v)+'</td>';}
function viewPlans(){
  const t=tier();const peek=!D().onboarded;
  const btn=k=>{
    const name=TIERS[k].t;
    if(peek)return k==='free'?'<button type="button" class="btn wide" data-act="onboard">Commencer gratuitement</button>':'<button type="button" class="btn'+(k==='parcours'?' primary':'')+' wide" data-act="tier" data-v="'+k+'" aria-label="Choisir la formule '+esc(name)+'">Choisir</button>';
    return t===k?'<button type="button" class="btn wide" disabled>'+I.check+'Votre formule</button>':'<button type="button" class="btn'+(k==='parcours'?' primary':'')+' wide" data-act="tier" data-v="'+k+'" aria-label="'+(k==='free'?'Revenir à Découverte, la formule gratuite':'Choisir la formule '+esc(name))+'">'+(k==='free'?'Revenir à Découverte':'Choisir')+'</button>';
  };
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Les formules</h1><p class="sub">Les formules sont sans engagement et vous pouvez arrêter à tout moment. Voici ce que chacune vous donne concrètement.</p></div>'+
    '<div class="plans">'+
    '<div class="plan"><h2 class="t2">Découverte</h2><div class="price">0 CHF <small>pour toujours</small></div><p>Cette formule vous permet de voir si l’espace vous parle. Vous avez la dose chaque jour, toute la boîte à outils, trois dépôts écoutés et la première étape.</p>'+btn('free')+'</div>'+
    '<div class="plan best"><span class="pill sun">Recommandé</span><h2 class="t2">Le parcours</h2><div class="price">14 CHF <small>par mois</small></div><p>Tous les cadenas disparaissent. Vous déposez autant que nécessaire avec la phrase-miroir, vous recevez une dose écrite pour vous, vous suivez les 24 étapes et vous voyez votre chemin sur six mois.</p>'+btn('parcours')+'</div>'+
    '<div class="plan"><h2 class="t2">Avec Antonio</h2><div class="price">49 CHF <small>par mois</small></div><p>Vous avez tout Le parcours, avec en plus un travailleur social qui vous connaît. <b>Chaque mois, Antonio lit les dépôts que vous choisissez de lui partager et vous écrit un mot personnel</b>, qui s’affiche en haut de votre accueil. <b>Deux fois par mois, vous pouvez lui poser une question</b> et il vous répond par écrit dans les 48 heures. Il ne demande jamais le prénom de votre enfant et ne pose jamais de diagnostic.</p>'+btn('antonio')+'</div></div>'+
    '<h2 class="t2 detail">Le détail de chaque formule</h2><div class="card"><table class="cmp"><caption class="sr">Ce que comprend chaque formule</caption><thead><tr><th scope="col"><span class="sr">Ce qui est compris</span></th><th scope="col">Découverte<br>0</th><th scope="col" class="best">Parcours<br>14/mois</th><th scope="col">Antonio<br>49/mois</th></tr></thead><tbody>'+FEATURES.map(f=>'<tr><th scope="row">'+esc(f[0])+'</th>'+cell(f[1])+cell(f[2])+cell(f[3])+'</tr>').join('')+'</tbody></table></div>'+
    '<p class="hint">Dans cette version de test, choisir une formule change simplement l’interface pour vous la montrer. Aucun paiement n’est demandé et rien n’est transmis à Antonio. Les prix sont ceux prévus pour la Suisse.'+(SITE?' <a href="conditions.html">Conditions générales</a>':'')+'</p></main>';
}
function sheetUpgrade(sheetIn){
  const u=UP[state.upFeat]||UP.parcours;const anto=state.upFeat==='antonio';
  return '<div class="backdrop" data-act="sheet-close"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="up-title" tabindex="-1"><div class="sheet-in"><div class="grab"></div><span class="label">'+I.lock+' Fait partie '+(anto?'de la formule Avec Antonio':'du Parcours')+'</span><h2 id="up-title" class="t2" style="font-family:var(--font-display);font-weight:500">'+esc(u.t)+'</h2><p>'+esc(u.s)+'</p>'+
    (anto?'':'<button type="button" class="btn primary wide" data-act="tier" data-v="parcours">Le parcours, 14 CHF par mois</button>')+
    '<button type="button" class="btn'+(anto?' primary':'')+' wide" data-act="tier" data-v="antonio">Avec Antonio, 49 CHF par mois</button>'+
    '<button type="button" class="btn ghost wide" data-act="sheet-close">Plus tard</button><p class="hint" style="text-align:center">Dans cette version de test, la formule s’active sans paiement, pour vous montrer l’interface.</p></div></div>';
}
/* ---------- avec Antonio ---------- */
function viewAntonio(){
  const d=D();const L=d.letters.slice().reverse();const Q=d.questions.slice().reverse();const ql=questionsLeft();
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Mes échanges avec Antonio</h1><p class="sub">Un travailleur social qui vous connaît sans que vous ayez à tout raconter, parce qu’il lit ce que vous choisissez de partager.</p></div>'+
    (DEMO?'<div class="demo-note"><b>Démonstration.</b> Dans cette version de test, rien n’est transmis à Antonio. Vos questions et vos dépôts cochés restent sur votre appareil, et le mot comme la réponse affichés ici sont des exemples. Les vrais échanges commenceront à l’ouverture des abonnements.</div>':'')+
    '<div class="card sun"><div class="kv"><span>Le mot d’Antonio</span><span>'+(DEMO?'le 1er de chaque mois':esc(nextLetterDate()))+'</span></div><div class="kv"><span>Dépôts cochés ce mois</span><span>'+sharedThisMonth()+'</span></div><div class="kv"><span>Questions restantes ce mois</span><span>'+ql+' sur '+Q_PER_MONTH+'</span></div><p class="hint">Pour partager un dépôt, cochez « Partager avec Antonio » sous le dépôt. Sans dépôt partagé, le mot d’Antonio se base sur votre humeur et vos étapes.</p></div>'+
    (ql>0?'<div class="card"><label class="label" for="qdraft">Poser une question à Antonio</label><textarea id="qdraft" maxlength="'+LIM.q+'" placeholder="Décrivez une situation, une décision ou un doute, sans donner de prénom." style="min-height:90px">'+esc(state.qdraft)+'</textarea><button type="button" class="btn primary" data-act="qsend" style="align-self:flex-start">'+I.send+(DEMO?'Enregistrer ma question':'Envoyer ma question')+'</button></div>':'<div class="card"><span class="label">Poser une question à Antonio</span><p>Vos deux questions du mois sont posées. Vous pourrez en poser à nouveau le '+esc(nextLetterDate())+'. En attendant, « Déposer » reste ouvert.</p></div>')+
    (Q.length?Q.map(q=>'<div class="qa"><span class="st">'+esc(fmtDate(q.date))+(q.answer?', réponse d’Antonio le '+esc(fmtDate(q.answeredAt)):(DEMO?', gardée sur votre appareil et non transmise (version de test)':', en attente d’une réponse sous 48 h'))+'</span><p class="q">'+esc(q.text)+'</p>'+(q.answer?'<p class="a">'+esc(q.answer)+'</p>':'')+(q.risk?riskHtml('hint'):'')+'</div>').join(''):'')+
    ((DEMO||!Q.length)?'<div class="qa"><span class="st">Exemple de question et de réponse</span><p class="q">'+esc(QA_EXAMPLE.q)+'</p><p class="a">'+esc(QA_EXAMPLE.a)+'</p></div>':'')+
    '<div><span class="label">Les mots d’Antonio</span></div>'+
    (L.length?L.map((l,i)=>'<button type="button" class="letter" data-act="letter" data-i="'+(d.letters.length-1-i)+'"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>'+esc(MONTHS_FR[Number(l.date.slice(5,7))-1])+'</b><span>'+esc(fmtDate(l.date))+'</span></div></div><p>'+esc(l.text.split('\n')[0])+'</p></button>').join(''):'<button type="button" class="letter" data-act="letter" data-i="-1"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>Exemple de mot</b><span>'+(DEMO?'Démonstration':'Votre premier arrive le '+esc(nextLetterDate()))+'</span></div></div><p>'+esc(LETTER_EXAMPLE.split('\n')[0])+'</p><span class="hint">Lire l’exemple '+I.chev+'</span></button>')+'</main>';
}
function viewLetter(){
  const i=state.letter;const l=i>=0?D().letters[i]:null;const txt=l?l.text:LETTER_EXAMPLE;
  return '<main id="main" tabindex="-1" class="view"><div><span class="label">'+(l?'Le mot d’Antonio du '+esc(fmtDate(l.date)):'Un exemple de ce que sera le mot d’Antonio')+'</span><h1 class="t1">'+(D().me?'Bonjour '+esc(D().me)+',':'Bonjour,')+'</h1></div>'+
    '<div class="letter">'+txt.split('\n').map(p=>'<p>'+esc(p)+'</p>').join('')+'<div class="from" style="margin-top:6px"><span class="av" aria-hidden="true">A</span><div><b>Antonio Company</b><span>travailleur social</span></div></div></div>'+
    (l?'':'<p class="hint">Ceci est un exemple. Dans la version complète, Antonio écrira ce mot chaque mois à partir des dépôts que vous aurez partagés, de votre humeur et de vos étapes. Il ne citera jamais de prénom et ne posera jamais de diagnostic.</p>')+
    '<div class="quick"><button type="button" class="btn" data-act="go" data-view="today">'+I.drop+'Déposer</button><button type="button" class="btn" data-act="go" data-view="antonio">'+I.question+'Poser une question</button></div></main>';
}
/* ---------- données / à propos ---------- */
function consentCard(){
  if(!SITE||!window.PEPEConsent)return '';
  const c=window.PEPEConsent.get();
  const st=c?(c.audience?'Vous avez accepté la mesure d’audience anonyme le '+esc(fmtDate(c.date))+'.':'Vous avez refusé la mesure d’audience le '+esc(fmtDate(c.date))+'.'):'Vous n’avez pas encore fait de choix.';
  return '<div class="card"><span class="label">Cookies et mesure d’audience</span><p class="hint">Cet espace n’utilise aucun cookie. '+st+' <a href="confidentialite.html#cookies">En savoir plus</a></p><div class="row"><button type="button" class="btn small" data-act="consent" data-v="no" aria-pressed="'+(!!c&&!c.audience)+'">Refuser</button><button type="button" class="btn small" data-act="consent" data-v="yes" aria-pressed="'+(!!c&&c.audience)+'">Accepter</button></div></div>';
}
function viewData(){
  const where=state.sample?'Quand vous déposez, votre texte est envoyé sans votre nom à une intelligence artificielle, qui écrit la réponse. L’application, elle, ne le garde que sur cet appareil.':'Dans cette version, rien de ce que vous écrivez n’est envoyé, ni à un serveur ni à Antonio.';
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Vos données</h1><p class="sub">Vos dépôts, vos points et vos notes restent sur cet appareil. '+where+'</p></div>'+
    '<div class="card green"><span class="label">Bon à savoir</span><p class="hint">Vos dépôts ne sont pas protégés par un mot de passe. Si vous prêtez cet appareil, verrouillez-le ou effacez d’abord vos notes. Sachez aussi que si vous effacez les données de votre navigateur, vos notes sont perdues, parce qu’il n’en existe aucune copie ailleurs.</p></div>'+
    '<div class="card"><span class="label">Recommencer depuis le début</span><p class="hint">Ce bouton efface tout ce qui est sur cet appareil, c’est-à-dire votre prénom, vos dépôts, vos étapes, votre carnet et vos points, puis il rouvre l’écran d’accueil et le questionnaire de départ. C’est utile pour faire tester l’application à une autre personne sur votre appareil.</p>'+(state.confirmReset?'<div class="confirm" role="alert"><span>Effacer tout le contenu sur cet appareil ?</span><div class="row"><button type="button" class="btn danger" data-act="reset-yes">Oui, effacer</button><button type="button" class="btn" data-act="reset-no">Annuler</button></div></div>':'<button type="button" class="btn danger" data-act="reset" style="align-self:flex-start">'+I.trash+'Tout effacer et recommencer</button>')+'</div>'+
    consentCard()+
    '<div class="card"><span class="label">Pour les tests</span><p class="hint">Vous pouvez aussi ajouter <b>?nouveau</b> à la fin de l’adresse. L’application repart alors de zéro sur cet appareil.</p></div></main>';
}
function viewAbout(){
  const peek=!D().onboarded;
  return '<main id="main" tabindex="-1" class="view" style="padding-top:0">'+
    '<div class="band story bleed" style="background-image:url('+HERO+')"><h1 class="t1">Avant d’accompagner des familles, j’ai moi-même été accueilli dans une famille.</h1></div>'+
    '<div class="story">'+
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
    '<p>En février 2025, j’ai imaginé «\u00a0Parent Écouté, Parent Éclairé\u00a0». Au départ, c’était un accompagnement de six mois pour les parents de personnes en situation de handicap. En avril, j’ai voulu l’ouvrir à tous les parents. Cette application, c’est la version que vous pouvez garder dans votre poche.</p>'+
    '<p>Écouté, cela veut dire que vous pouvez déposer librement ce qui vous pèse et être accueilli avec attention et douceur. Éclairé, cela veut dire que vous repartez avec quelque chose qui vous aide à retrouver un peu de paix, de clarté, de recul ou de confiance.</p>'+
    '<p>À l’époque, j’avais écrit ceci.</p>'+
    '<p class="quote">«\u00a0Parce qu’un parent écouté devient un parent éclairé. Et un parent éclairé devient un parent confiant, aligné et pleinement acteur du bien-être de son enfant.\u00a0»</p>'+
    '<p>Si je vous raconte tout cela, c’est pour que vous sachiez d’où vient cet espace. Il vient d’un enfant qui a eu la chance d’être écouté.</p>'+
    '<p>Ici, vous n’avez rien à prouver à personne. Vous pouvez simplement déposer ce qui vous pèse.</p>'+
    '<p>Merci d’avoir pris le temps de me lire.</p>'+
    '<div class="sign"><img class="medal seal" src="'+MEDAL+'" alt="Logo de Parent Écouté, Parent Éclairé, une goutte qui tombe sur un étang dans la lumière d’une forêt." width="64" height="64" loading="lazy" decoding="async"><div><b>Antonio Company</b><span>Travailleur social depuis mes 19 ans, responsable d’une équipe socio-éducative, père de trois enfants.</span></div></div>'+
    '</div>'+
    (peek?'<button type="button" class="btn primary wide" data-act="onboard">'+I.sun2+'Commencer gratuitement</button>':'')+
    '<div class="card green"><h2 class="label">Ce que cet espace n’est pas</h2><ul class="list"><li>Ce n’est pas un diagnostic ni une thérapie. Pour cela, il y a votre pédiatre, votre médecin et les thérapeutes.</li><li>Ce n’est pas un service d’urgence. En cas de danger, appelez le '+tel('144')+'. Si vous êtes à bout, appelez le '+tel('143')+'.</li><li>Cela ne remplace pas les personnes qui vous entourent. C’est plutôt un pont vers elles.</li></ul></div><p class="hint">Version de test.</p></main>';
}
/* ---------- onglets, feuilles ---------- */
function tabs(){
  const grp={today:['today'],parcours:['parcours','step','carnet','evo','photo'],kit:['kit','sit','exo'],me:['me','plans','depots','antonio','letter','data','about']};
  const cur=v=>grp[v].includes(state.view)?' aria-current="page"':'';
  return '<nav class="tabs" aria-label="Navigation"><span class="rail-brand">'+LOGO+'<span>Parent écouté<small>parent éclairé</small></span></span><div class="tabs-in"><button type="button" class="tab" data-act="go" data-view="today"'+cur('today')+'>'+I.sun2+'Aujourd’hui</button><button type="button" class="tab" data-act="go" data-view="parcours"'+cur('parcours')+'>'+I.path+'Parcours</button><button type="button" class="tab" data-act="go" data-view="kit"'+cur('kit')+'>'+I.kit+'Outils</button><button type="button" class="tab" data-act="go" data-view="me"'+cur('me')+'>'+I.user+'Moi</button></div>'+(large()?'<button type="button" class="sos" data-act="go" data-view="sos">'+I.alert+'SOS</button>':'')+'</nav>';
}
function sheetOnboard(sheetIn){
  const d=D();const opt=(k,v,l)=>'<button type="button" class="chip" data-act="ob" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+(d[k]===v)+'">'+esc(l)+'</button>';
  const w=(k,l)=>'<button type="button" class="chip" data-act="obw" data-v="'+k+'" aria-pressed="'+(d.weights.includes(k))+'">'+esc(l)+'</button>';
  return '<div class="backdrop"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="ob-title" tabindex="-1"><div class="sheet-in"><div class="grab"></div><h2 id="ob-title">Faisons connaissance</h2>'+
    '<div class="field"><label for="ob-me">Votre prénom (facultatif)</label><input type="text" id="ob-me" value="'+esc(d.me)+'" maxlength="'+LIM.me+'" autocomplete="given-name" autocapitalize="words" enterkeyhint="done"></div>'+
    '<div class="field"><span class="flabel" id="ob-l-age">Votre enfant est…</span><div class="chips" role="group" aria-labelledby="ob-l-age">'+opt('age','e','un enfant')+opt('age','a','un ado')+opt('age','g','un adulte')+'</div></div>'+
    '<div class="field"><span class="flabel" id="ob-l-sit">Votre situation</span><div class="chips" role="group" aria-labelledby="ob-l-sit">'+opt('situation','hand','handicap ou besoins particuliers')+opt('situation','diff','une période difficile')+opt('situation','parent','je suis parent, simplement')+'</div></div>'+
    '<div class="field"><span class="flabel" id="ob-l-w">Ce qui pèse le plus en ce moment (plusieurs réponses possibles)</span><div class="chips" role="group" aria-labelledby="ob-l-w">'+WEIGHTS.map(x=>w(x[0],x[1])).join('')+'</div></div>'+
    '<p class="hint">Je ne vous demande pas le prénom de votre enfant, parce que rien de ce qui le concerne ne doit sortir de votre poche.</p>'+
    '<button type="button" class="btn primary wide" data-act="ob-done">'+I.sun2+(d.onboarded?'Enregistrer':'Recevoir ma première dose')+'</button></div></div>';
}
function mdLite(t){const lines=String(t).split('\n');let out='';let inl=false;for(const raw of lines){const l=raw.replace(/\*\*(.+?)\*\*/g,'$1');if(/^\s*[-•]\s+/.test(l)){if(!inl){out+='<ul class="list">';inl=true;}out+='<li>'+esc(l.replace(/^\s*[-•]\s+/,''))+'</li>';continue;}if(inl){out+='</ul>';inl=false;}if(/^#{1,3}\s/.test(l))out+='<p style="font-weight:800;margin-top:6px;color:var(--green)">'+esc(l.replace(/^#{1,3}\s*/,''))+'</p>';else if(l.trim())out+='<p>'+esc(l)+'</p>';}if(inl)out+='</ul>';return out;}

/* ---------- actions ---------- */
function nav(v){state.prev=state.view;state.view=v;state.sheet=null;state.confirmReset=false;state.photoPick=false;state.photoOrder=null;state.pdraft=null;}
function fxSig(){return [state.view,state.sit,state.exo,state.step,state.kit,state.letter,!!D().onboarded,state.view==='photo'?(state.photoPick?'choix':'photo-'+(photoRec().id||'')):''].join('|');}
function handle(act,d,el){
  const data=D();const sig0=fxSig();const sheet0=state.sheet;
  switch(act){
    case 'peek-plans':state.prev=null;state.sheet=null;state.view='plans';break;
    case 'peek-about':openStory();return;
    case 'imprimer':try{window.print();}catch(e){}return;
    case 'intro-suite':{const s=document.querySelector('.intro .acc');if(s&&s.scrollIntoView)s.scrollIntoView({behavior:fxOn()?'smooth':'auto',block:'start'});return;}
    case 'onboard':state.sheet='onboard';break;
    case 'ob':data[d.k]=d.v;save();break;
    case 'obw':{const i=data.weights.indexOf(d.v);if(i>=0)data.weights.splice(i,1);else data.weights.push(d.v);save();break;}
    case 'ob-done':{const m=document.getElementById('ob-me');data.me=clean(m?m.value:data.me,LIM.me);if(!data.start)data.start=todayIso();const first=!data.onboarded;data.onboarded=true;state.sheet=null;save();if(first)state.view='today';break;}
    case 'go':if(d.view==='about'){openStory();return;}if(d.view==='photo'&&!can('parcours')){openUpgrade('photo');break;}nav(d.view);if(d.view!=='kit'&&d.view!=='exo')stopTimer();break;
    case 'back':{if(!data.onboarded){state.view='today';break;}const v=state.view;let t;if(v==='sit'||v==='exo'){t='kit';stopTimer();}else if(v==='step'||v==='carnet'||v==='final'||v==='photo'||v==='evo')t='parcours';else if(v==='letter')t='antonio';else if(['plans','depots','antonio','data','about'].includes(v))t='me';else t='today';if(state.prev&&state.prev!==v&&state.prev!=='sos')t=state.prev;state.prev=null;state.view=t;break;}
    case 'mood':data.moods[todayIso()]=Number(d.i);save();break;
    case 'kit':nav('kit');state.kit=d.v;if(d.v!=='tools')stopTimer();break;
    case 'sit':state.sit=d.id;nav('sit');break;
    case 'age':state.age=d.v;break;
    case 'theme':state.theme=d.v;break;
    case 'dmode':state.depotMode=d.v;break;
    case 'dsend':sendDepot();return;
    case 'dstop':if(state.ctl)state.ctl.abort();return;
    case 'dconcret':concret(d.id);return;
    case 'dose-perso':dosePerso();return;
    case 'share':data.shared[d.id]=!!(el&&el.checked);save();return;
    case 'upgrade':openUpgrade(d.f);break;
    case 'tier':if(!TIERS[d.v])return;data.tier=d.v;state.sheet=null;save();if(!data.onboarded){state.view='today';state.sheet='onboard';break;}toast('La formule « '+TIERS[d.v].t+' » est activée, sans paiement dans cette version de test.');break;
    case 'step':{const i=Number(d.i);const e=stepEtat(i);
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
    case 'evosave':{if(state.evoTime!=='t1'&&!can('parcours')){openUpgrade('evo');break;}const rec={date:todayIso()};EVO_SCALES.forEach(s=>{const x=document.querySelector('[data-evo="'+s.id+'"]');rec[s.id]=x?Number(x.value):5;});EVO_OPEN.forEach(o=>{const x=document.querySelector('[data-evoopen="'+o[0]+'"]');rec[o[0]]=x?clean(x.value,LIM.evo):'';});const first=state.evoTime==='t1'&&!data.evo.t1;data.evo[state.evoTime]=rec;if(state.evoDraft)delete state.evoDraft[state.evoTime];save();if(first){nav('today');render();window.scrollTo(0,0);toast('Votre point de départ est enregistré, et votre dose vous attend.');return;}render();toast('Point enregistré. Ce qui bouge est à vous.');return;}
    case 'evoset':{const r=document.querySelector('[data-evo="'+d.k+'"]');if(r){r.value=d.v;evoSync(r);if(r.focus)r.focus({preventScroll:true});}return;}
    case 'photopick':{const av=photoRec();data.photo={id:d.id,text:av.text,date:av.id===d.id?av.date:''};state.photoPick=false;state.lastKey=null;save();break;}
    case 'photoback':state.photoPick=true;state.lastKey=null;break;
    case 'photosave':{const t=document.getElementById('ptext');const av=photoRec();if(!av.id){toast('Choisissez d’abord une photo, puis écrivez ce qu’elle évoque.');return;}data.photo={id:av.id,text:t?clean(t.value,LIM.photo):'',date:todayIso()};
      /* Le final montre toutes les photos choisies : un choix refait le même jour remplace celui du jour, un autre jour il s'ajoute. */
      {if(!Array.isArray(data.photos))data.photos=[];const L=data.photos,der=L[L.length-1],r={id:data.photo.id,text:data.photo.text,date:data.photo.date};if(der&&der.date===r.date)L[L.length-1]=r;else L.push(r);if(L.length>12)L.splice(0,L.length-12);}
      state.pdraft=null;save();render();toast('Gardé.');return;}
    case 'tool':state.tool=d.v;if(d.v!=='timer')stopTimer();break;
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
    case 'exo':state.exo=d.id;nav('exo');break;
    case 'threeadd':{const items=['t1','t2','t3'].map(id=>clean(document.getElementById(id).value,LIM.three)).filter(Boolean);if(!items.length){fieldErr('t1','Une seule chose suffit, écrivez-la ici.');return;}data.three.push({date:todayIso(),items});save();render();toast('Gardé.');return;}
    case 'depose':{const t=document.getElementById('dep');if(t&&t.value&&fxOn()){t.classList.add('ink');setTimeout(()=>{t.value='';t.classList.remove('ink');},1150);}else if(t)t.value='';toast('C’est déposé, vous n’avez plus à le garder en vous.');return;}
    case 'letter':state.letter=Number(d.i);nav('letter');break;
    case 'qsend':{const t=clean(state.qdraft,LIM.q);if(t.length<10){fieldErr('qdraft','Écrivez votre question en une phrase ou deux (dix caractères au moins).');return;}if(questionsLeft()===0){toast('Vos deux questions du mois sont posées.');return;}const risk=RISK.test(t);data.questions.push(risk?{id:'q'+Date.now(),date:todayIso(),text:t,risk:true}:{id:'q'+Date.now(),date:todayIso(),text:t});state.qdraft='';save();render();toast(risk?'Si c’est urgent, n’attendez pas et appelez le 143 ou le 144 maintenant.':(DEMO?'Votre question est gardée sur votre appareil. Dans cette version de test, elle n’est pas transmise à Antonio.':'Votre question est envoyée. Antonio répond par écrit sous 48 heures.'));return;}
    case 'sheet-close':state.sheet=null;break;
    case 'fx':data.fxOff=!data.fxOff;save();fxSync();toast(data.fxOff?'Les effets visuels sont désactivés.':'Les effets visuels sont activés.');break;
    case 'consent':if(window.PEPEConsent)window.PEPEConsent.set(d.v==='yes');break;
    case 'reset':state.confirmReset=true;break;
    case 'reset-no':state.confirmReset=false;break;
    case 'reset-yes':state.data=JSON.parse(JSON.stringify(DEF));try{localStorage.removeItem(KEY);}catch(e){}state.confirmReset=false;state.view='today';state.prev=null;fxSync();render();window.scrollTo(0,0);toast('Effacé.');return;
    default:return;
  }
  const navAct=['go','sit','back','exo','step','kit','letter','peek-plans','tier','ob-done','photopick','photoback'].includes(act);
  if(navAct&&fxSig()!==sig0){fxGo(()=>{render();window.scrollTo(0,0);},act==='back'||act==='photoback'?'back':(act==='kit'||(el&&el.classList&&el.classList.contains('tab'))?'tab':'open'));return;}
  /* Une feuille qui se referme s'efface en douceur elle aussi, quand le navigateur sait faire le fondu d'écran. */
  if(sheet0&&!state.sheet){fxGo(()=>{render();if(navAct)window.scrollTo(0,0);},'fade',true);return;}
  render();
  if(navAct)window.scrollTo(0,0);
}
const app=document.getElementById('app');
app.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.tagName==='A'||el.tagName==='INPUT'||el.tagName==='LABEL')return;handle(el.dataset.act,el.dataset,el);});
app.addEventListener('change',e=>{const el=e.target;if(el.tagName==='INPUT'&&el.dataset.act==='share')handle('share',el.dataset,el);if(el.dataset&&el.dataset.note&&noteAttend){clearTimeout(noteT);noteAttend=false;save();}});
/* Si l'on quitte la page pendant qu'on écrit dans le carnet, les derniers mots sont gardés tout de suite. Rien n'est écrit s'il n'y a rien en attente,
   pour ne pas écraser ce qu'un autre onglet aurait enregistré entre-temps. */
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&noteAttend){clearTimeout(noteT);noteAttend=false;save();}});
let typing=null,noteT=null,noteAttend=false;
app.addEventListener('input',e=>{
  const t=e.target;clearErr(t);
  /* Le carnet de route se garde tout seul, pendant qu'on écrit. */
  if(t.dataset&&t.dataset.note){const id=t.dataset.note;const v=String(t.value).slice(0,LIM.note);if(v.trim())D().notes[id]={t:v,d:todayIso()};else delete D().notes[id];clearTimeout(noteT);noteAttend=true;noteT=setTimeout(()=>{noteAttend=false;save();},400);const st=document.getElementById('note-etat');if(st){const m=v.trim()?NOTE_OUI:NOTE_NON;if(st.textContent!==m)st.textContent=m;}}
  if(t.id==='draft'){state.draft=t.value;updCount(t);}
  if(t.id==='qdraft')state.qdraft=t.value;
  if(t.id==='ptext')state.pdraft=t.value;
  if(t.dataset&&t.dataset.evo)evoSync(t);
  if(t.dataset&&t.dataset.evoopen){const k=state.evoTime;state.evoDraft=state.evoDraft||{};state.evoDraft[k]=state.evoDraft[k]||{};state.evoDraft[k][t.dataset.evoopen]=t.value;}
  if(t.id==='ob-me')D().me=String(t.value).slice(0,LIM.me);
  if(t.id==='q'){state.q=t.value;clearTimeout(typing);typing=setTimeout(()=>{const pos=t.selectionStart;render();const nq=document.getElementById('q');if(nq){nq.focus();try{nq.setSelectionRange(pos,pos);}catch(e){}}},250);}
});
/* Entrée valide les champs d'une seule ligne, comme sur un vrai formulaire. */
app.addEventListener('keydown',e=>{
  if(e.key!=='Enter'||e.isComposing)return;const t=e.target;
  if(t.id==='ph'){e.preventDefault();handle('phadd',{},t);}
  else if(t.id==='ob-me'){e.preventDefault();handle('ob-done',{},t);}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.sheet&&state.sheet!=='onboard'){state.sheet=null;fxGo(render,'fade',true);}});
try{if(/[?&](nouveau|reset|new)\b/.test(location.search)){localStorage.removeItem(KEY);if(history.replaceState)history.replaceState(null,'',location.pathname+location.hash);}}catch(e){}
state.data=load();
/* L'aperçu d'Antonio s'active aussi par l'adresse …/#atelier. Ce n'est pas un verrou : il sert à tout relire sans attendre les sept jours. */
let atelierMsg=false;
try{if(location.hash==='#atelier'){state.data.atelier=true;state.data.tout=true;save();atelierMsg=true;if(history.replaceState)history.replaceState(null,'',location.pathname+location.search);}}catch(e){}
fxSync();
/* La fenêtre passe d'un format à l'autre (fenêtre agrandie ou réduite, tablette qu'on tourne) : l'écran est réécrit dans le bon ordre, sans perdre ce qui est en cours de saisie. */
if(MQ_LARGE){const relayout=()=>{const keep={};document.querySelectorAll('#app input[id],#app textarea[id]').forEach(el=>{if(el.type!=='range'&&el.type!=='checkbox'&&el.type!=='radio')keep[el.id]=el.value;});render();Object.keys(keep).forEach(id=>{const el=document.getElementById(id);if(el&&el.value!==keep[id])el.value=keep[id];});};if(MQ_LARGE.addEventListener)MQ_LARGE.addEventListener('change',relayout);else if(MQ_LARGE.addListener)MQ_LARGE.addListener(relayout);}
window.addEventListener('scroll',lectureScroll,{passive:true});window.addEventListener('resize',lectureScroll,{passive:true});
if(FX_OK){document.addEventListener('pointerdown',fxTap,{passive:true,capture:true});document.addEventListener('pointerup',fxLeve,{passive:true,capture:true});document.addEventListener('pointercancel',()=>{fxPt.vt=false;},{passive:true,capture:true});document.addEventListener('click',fxDouble,true);document.addEventListener('pointerdown',eauTouch,{passive:true});window.addEventListener('resize',()=>{EAU.geo=null;},{passive:true});window.addEventListener('popstate',e=>{if(e&&e.hasUAVisualTransition)fxSkip=Date.now();});if(FX_RM&&FX_RM.addEventListener)FX_RM.addEventListener('change',()=>{fxSync();});}
/* Sur le site, « Mon histoire » a sa propre adresse (…/#histoire) : on peut l'envoyer telle quelle, et le bouton Retour du téléphone fonctionne. */
const storyFirst=SITE&&location.hash===STORY_HASH;
if(storyFirst)state.view='about';
if(SITE)window.addEventListener('hashchange',()=>{
  /* L'adresse …/#atelier, tapée alors que l'espace est déjà ouvert, allume l'aperçu d'Antonio sans recharger la page. */
  if(location.hash==='#atelier'){const d=D();d.atelier=true;d.tout=true;save();try{if(history.replaceState)history.replaceState(null,'',location.pathname+location.search);}catch(e){}if(d.onboarded)render();toast('Aperçu d’Antonio activé sur cet appareil. Tout le parcours est ouvert.');return;}
  if(location.hash===STORY_HASH){if(state.view!=='about')showStory();}
  else if(state.view==='about')handle('back',{},null);
});
state.inClaude=!SITE&&!!(window.claude&&typeof window.claude.use==='function');
if(SITE)state.sample=false;
/* Sur le site, l'accueil est déjà écrit dans la page (affichage immédiat, lisible sans JavaScript par les moteurs) : on le garde tel quel. */
if(app.getAttribute('data-prerender')==='intro'&&!D().onboarded&&!storyFirst){state.lastKey='intro';app.removeAttribute('data-prerender');introLive();fxMark();eauArrive(true);}
else render();
if(atelierMsg)toast('Aperçu d’Antonio activé sur cet appareil. Tout le parcours est ouvert.');
if(!SITE)(async()=>{try{if(state.inClaude){const s=await window.claude.use('sample');state.sample=s||false;}else state.sample=false;}catch(e){state.sample=false;}if(D().onboarded||state.view==='plans')render();})();
})();
</script>
