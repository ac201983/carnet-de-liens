const app=document.getElementById('app');
app.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.tagName==='A'||el.tagName==='INPUT'||el.tagName==='LABEL')return;handle(el.dataset.act,el.dataset,el);});
app.addEventListener('change',e=>{const el=e.target;if(el.tagName==='INPUT'&&el.dataset.act==='share')handle('share',el.dataset,el);});
let typing=null;
app.addEventListener('input',e=>{
  const t=e.target;clearErr(t);
  if(t.id==='draft'){state.draft=t.value;updCount(t);}
  if(t.id==='qdraft')state.qdraft=t.value;
  if(t.id==='ob-me')D().me=String(t.value).slice(0,LIM.me);
  if(t.id==='q'){state.q=t.value;clearTimeout(typing);typing=setTimeout(()=>{const pos=t.selectionStart;render();const nq=document.getElementById('q');if(nq){nq.focus();try{nq.setSelectionRange(pos,pos);}catch(e){}}},250);}
});
/* Entrée valide les champs d'une seule ligne, comme sur un vrai formulaire. */
app.addEventListener('keydown',e=>{
  if(e.key!=='Enter'||e.isComposing)return;const t=e.target;
  if(t.id==='ph'){e.preventDefault();handle('phadd',{},t);}
  else if(t.id==='ob-me'){e.preventDefault();handle('ob-done',{},t);}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.sheet&&state.sheet!=='onboard'){state.sheet=null;render();}});
try{if(/[?&](nouveau|reset|new)\b/.test(location.search)){localStorage.removeItem(KEY);if(history.replaceState)history.replaceState(null,'',location.pathname);}}catch(e){}
state.data=load();
state.inClaude=!SITE&&!!(window.claude&&typeof window.claude.use==='function');
if(SITE)state.sample=false;
/* Sur le site, l'accueil est déjà écrit dans la page (affichage immédiat, lisible sans JavaScript par les moteurs) : on le garde tel quel. */
if(app.getAttribute('data-prerender')==='intro'&&!D().onboarded){state.lastKey='intro';app.removeAttribute('data-prerender');}
else render();
if(!SITE)(async()=>{try{if(state.inClaude){const s=await window.claude.use('sample');state.sample=s||false;}else state.sample=false;}catch(e){state.sample=false;}if(D().onboarded||state.view==='plans')render();})();
})();
</script>
