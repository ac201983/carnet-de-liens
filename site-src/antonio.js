/* Espace Antonio : démonstration du tableau de bord d'Antonio. Données fictives : aucun parent réel. */
(function(){
'use strict';
const HERO='img/hero.webp';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg=p=>'<svg class="i" aria-hidden="true" focusable="false" viewBox="0 0 24 24">'+p+'</svg>';
const I={back:svg('<path d="M15 5l-7 7 7 7"/>'),chev:svg('<path d="M9 5l7 7-7 7"/>'),check:svg('<path d="M5 12l4 4 10-10"/>'),send:svg('<path d="M4 12l16-8-6 16-2-7z"/>')};
const LOGO='<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5C24 5 15.5 15.5 15.5 21.5a8.5 8.5 0 0 0 17 0C32.5 15.5 24 5 24 5z" style="fill:var(--cream)"/><path d="M21 19.5c0-2 .9-4.3 2.2-6.2" style="fill:none;stroke:var(--surface-2);stroke-width:1.6;stroke-linecap:round"/><ellipse cx="24" cy="37" rx="7.5" ry="2.6" style="fill:none;stroke:var(--green);stroke-width:2.2"/><ellipse cx="24" cy="37.5" rx="16" ry="5.5" style="fill:none;stroke:var(--green);stroke-width:1.8;opacity:.55"/></svg>';
const PARENTS=[
  {id:'A',lbl:'Parent A',ctx:'enfant de 7 ans, handicap, semaine 9',moods:[1,1,2,1,0,2,2,3,2,1,2,3,3,2],steps:8,evo:{stress:8,comp:3,seul:7,regard:4,confiance:3},sent:'02.11.2026',
   depots:[['28.10 à 21h14','Ce soir encore la crise au bain. J’ai tenu, mais j’ai crié après. Je me déteste quand je crie.'],['01.11 à 22h40','J’ai remarqué que ça part toujours quand je dis « on y va » sans prévenir. Je ne sais pas quoi faire de ça.'],['05.11 à 20h05','Première soirée calme depuis des semaines. J’ai utilisé le minuteur. Je n’ose pas y croire.']]},
  {id:'B',lbl:'Parent B',ctx:'ado de 15 ans, période difficile, semaine 3',moods:[2,1,1,0,1,1,2,1,0,1,2,2,1,1],steps:2,evo:{stress:9,comp:2,seul:8,regard:3,confiance:2},sent:null,
   depots:[['03.11 à 23h30','Il ne me parle plus. Il mange dans sa chambre. Je frappe à la porte et il monte le son. Je ne sais plus qui il est.'],['06.11 à 07h50','Ce matin il m’a dit « laisse-moi » et je l’ai laissé. Je ne sais pas si c’est bien.']],
   question:{when:'hier à 19h40',deadline:'demain à 19h40',text:'Il refuse d’aller à l’école depuis deux semaines. L’école me convoque. Est-ce que je dois le forcer ?'}},
  {id:'C',lbl:'Parent C',ctx:'adulte de 24 ans, handicap, semaine 17',moods:[3,3,2,3,4,3,2,3,3,4,3,3,4,3],steps:16,evo:{stress:5,comp:6,seul:4,regard:7,confiance:6},sent:null,
   depots:[['30.10 à 19h00','Réunion de réseau. Pour la première fois j’ai dit ce que je pensais sans m’excuser. Ils ont écouté.'],['04.11 à 21h20','Il a dormi dans son appartement protégé trois nuits de suite. Je suis fier et j’ai le ventre noué.']]}
];
const MOOD_NAMES=['à plat','lourd','ça va','plutôt bien','bien'];
const state={view:'home',p:null,answered:false,written:{},lastKey:null};
let tt=null;
function toast(m){const old=document.querySelector('.toast');if(old)old.remove();const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=m;document.getElementById('app').appendChild(el);clearTimeout(tt);tt=setTimeout(()=>{el.remove();},3200);}
function fieldErr(id,msg){const el=document.getElementById(id);if(!el)return;let e=document.getElementById('err-'+id);if(!e){e=document.createElement('p');e.id='err-'+id;e.className='err';e.setAttribute('role','alert');el.insertAdjacentElement('afterend',e);}e.textContent=msg;el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby','err-'+id);try{el.focus();}catch(x){}}
function clearErr(el){if(!el||!el.id||!el.hasAttribute('aria-invalid'))return;const e=document.getElementById('err-'+el.id);if(e)e.remove();el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby');}
const dots=a=>{const avg=a.reduce((x,y)=>x+y,0)/a.length;return '<div class="mooddots" role="img" aria-label="Sur les quatorze derniers jours, l’humeur moyenne est « '+MOOD_NAMES[Math.round(avg)]+' »">'+a.map(m=>'<i class="m'+m+'"></i>').join('')+'</div>';};
function home(){
  const pend=PARENTS.filter(p=>p.question&&!state.answered);
  const todo=PARENTS.filter(p=>!p.sent&&!state.written[p.id]).length;
  return '<header class="bar"><span class="wordmark">'+LOGO+'<span>Espace Antonio<small>Parent écouté, parent éclairé</small></span></span><span class="demo">Démo</span></header>'+
    '<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band bleed" style="background-image:url('+HERO+');background-position:center 40%"><span class="label">Novembre, avec des parents et des dépôts fictifs</span><h1 class="t1">Bonsoir Antonio.</h1></div>'+
    '<div class="card" style="position:relative;z-index:2"><p class="sub" style="color:var(--fg)">Voici ce que les abonnés « Avec Antonio » attendent de vous ce mois-ci. Tout tient en une heure par semaine.</p>'+
    '<div class="stats"><div class="stat"><b>'+PARENTS.length+'</b><span>abonnés Avec Antonio</span></div><div class="stat'+(todo?' warn':'')+'"><b>'+todo+'</b><span>mots à écrire avant le 1er déc.</span></div><div class="stat'+(pend.length?' warn':'')+'"><b>'+pend.length+'</b><span>question'+(pend.length>1?'s':'')+' en attente</span></div></div></div>'+
    (pend.length?'<h2 class="label">Question en attente</h2>'+pend.map(p=>'<div class="qa"><span class="st">'+esc(p.lbl)+', '+esc(p.ctx.split(', ')[0])+'. Question reçue '+esc(p.question.when)+', <b style="color:var(--sun-fg)">à répondre avant '+esc(p.question.deadline)+'</b></span><p class="q">'+esc(p.question.text)+'</p><label class="sr" for="ans">Votre réponse</label><textarea id="ans" maxlength="1500" placeholder="Votre réponse en quelques phrases, sans prénom et sans diagnostic." style="min-height:100px"></textarea><button type="button" class="btn primary" data-act="answer" style="align-self:flex-start">'+I.send+'Envoyer la réponse</button></div>').join(''):'<div class="card green"><b>Aucune question en attente.</b></div>')+
    '<h2 class="label">Les mots de novembre</h2>'+
    PARENTS.map(p=>{const done=p.sent||state.written[p.id];return '<button type="button" class="parent" data-act="open" data-id="'+p.id+'"><span class="av" aria-hidden="true">'+p.id+'</span><span class="tx"><b>'+esc(p.lbl)+', '+esc(p.ctx)+'</b>'+dots(p.moods)+'<span>'+p.depots.length+' dépôts partagés et '+p.steps+' étapes faites</span></span><span class="st'+(done?' ok':'')+'">'+(done?'Envoyé':'À écrire')+'</span></button>';}).join('')+
    '<p class="hint">Vous ne voyez que ce que chaque parent a choisi de partager, c’est-à-dire ses dépôts cochés, son humeur, ses étapes et ses points d’évolution. Le prénom de l’enfant n’apparaît jamais.</p></main>';
}
function detail(){
  const p=PARENTS.find(x=>x.id===state.p);const done=p.sent||state.written[p.id];
  const E=[['stress','Stress'],['comp','Compétence'],['seul','Solitude'],['regard','Regard sur l’enfant'],['confiance','Confiance']];
  return '<header class="bar"><button type="button" class="back" data-act="home">'+I.back+'Retour</button></header>'+
    '<main id="main" tabindex="-1" class="view" style="padding-top:0"><div class="band thin bleed" style="background-image:url('+HERO+');background-position:right 60%"><span class="label">'+esc(p.ctx)+'</span><h1 class="t1">'+esc(p.lbl)+'</h1></div>'+
    '<div class="card"><span class="label">Humeur, quatorze jours</span>'+dots(p.moods)+'<span class="label" style="margin-top:6px">Point de départ, de 0 à 10</span><div class="bars">'+E.map(e=>'<div class="barrow"><span>'+e[1]+' <span class="sr">, '+p.evo[e[0]]+' sur 10</span></span><div class="bartrack" aria-hidden="true"><i><b style="width:'+(p.evo[e[0]]*10)+'%"></b></i></div></div>').join('')+'</div></div>'+
    '<h2 class="label">Dépôts partagés avec vous</h2><div class="depots">'+p.depots.map(d=>'<div class="mirror"><span class="lbl">'+esc(d[0])+'</span><p class="depot you">« '+esc(d[1])+' »</p></div>').join('')+'</div>'+
    (done?'<div class="card green"><b>'+I.check+' Mot de novembre envoyé'+(p.sent?' le '+esc(p.sent):'')+'.</b><p class="hint">Le parent le voit en haut de son écran d’accueil.</p></div>':
    '<div class="card"><span class="label">Le mot de novembre</span><div class="trame"><div><label for="m1">Ce que j’entends</label><textarea id="m1" maxlength="800" placeholder="Deux ou trois phrases sur ce que ce parent vit, avec ses mots." style="min-height:108px"></textarea></div><div><label for="m2">Ce que je vois bouger</label><textarea id="m2" maxlength="800" placeholder="Un progrès, même petit, repéré dans ses dépôts, ses étapes ou son humeur." style="min-height:108px"></textarea></div><div><label for="m3">Une piste pour le mois</label><textarea id="m3" maxlength="800" placeholder="Une seule chose à essayer, concrète et réaliste." style="min-height:108px"></textarea></div></div><button type="button" class="btn primary" data-act="send" data-id="'+p.id+'" style="align-self:flex-start">'+I.send+'Envoyer le mot</button><p class="hint">Comptez un quart d’heure par parent. Le mot arrive dans son application, signé de votre nom.</p></div>')+'</main>';
}
function render(){
  const app=document.getElementById('app');const key=state.view+(state.p||'');
  app.className='app nobar'+(key!==state.lastKey?' enter':'');state.lastKey=key;
  app.innerHTML=state.view==='home'?home():detail();
}
const app=document.getElementById('app');
app.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el)return;const a=el.dataset.act;
  if(a==='open'){state.p=el.dataset.id;state.view='detail';render();window.scrollTo(0,0);}
  else if(a==='home'){state.view='home';render();window.scrollTo(0,0);}
  else if(a==='answer'){const t=document.getElementById('ans');if(!t||t.value.trim().length<10){fieldErr('ans','Écrivez votre réponse (dix caractères au moins) avant de l’envoyer.');return;}state.answered=true;render();toast('Réponse enregistrée pour la démonstration. Dans la version complète, le parent la lira dans « Mes échanges avec Antonio ».');}
  else if(a==='send'){const ok=['m1','m2','m3'].some(id=>document.getElementById(id).value.trim());if(!ok){fieldErr('m1','Écrivez au moins une des trois parties du mot.');return;}state.written[el.dataset.id]=true;state.view='home';render();window.scrollTo(0,0);toast('Mot enregistré pour la démonstration. Dans la version complète, il s’affichera en haut de l’accueil du parent.');}
});
app.addEventListener('input',e=>clearErr(e.target));
render();
})();
