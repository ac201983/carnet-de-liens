function letterCard(){
  const L=D().letters;const l=L.length?L[L.length-1]:null;
  const txt=l?l.text:LETTER_EXAMPLE;
  return '<button type="button" class="letter reveal d1" data-act="letter" data-i="'+(l?L.length-1:-1)+'"><div class="from"><span class="av" aria-hidden="true">A</span><div><b>'+(l?'Le mot d’Antonio · '+esc(MONTHS_FR[Number(l.date.slice(5,7))-1]):'Le mot d’Antonio · exemple')+'</b><span>'+(l?esc(fmtDate(l.date)):'Démonstration : voici à quoi il ressemblera')+'</span></div></div><p>'+esc(txt.split('\n')[0])+'</p><span class="hint">'+(l?'Lire ':'Lire l’exemple ')+I.chev+'</span></button>';
}
function depotBox(){
  const left=depotsLeft();const today=todayIso();const td=D().depots.filter(x=>x.date===today).slice(-1)[0];
  const head=lab=>'<div class="row" style="justify-content:space-between;align-items:center">'+lab+(left!==Infinity&&left>0?'<span class="pill">'+left+' dépôt'+(left>1?'s':'')+' offert'+(left>1?'s':'')+'</span>':'')+'</div>';
  let html='<div class="card reveal d2">';
  if(left===0){
    html+=head('<span class="label">Écouté · Déposer</span>')+'<p class="lesson" style="font-size:18px">Vos trois dépôts Découverte sont utilisés.</p>'+lockline('Déposer sans limite, avec la phrase-miroir','depots')+'<button type="button" class="btn primary" data-act="upgrade" data-f="depots" style="align-self:flex-start">Passer au Parcours · 14 CHF/mois</button>';
  }else{
    html+=head('<label class="label" for="draft">Écouté · Déposer</label>')+
      '<textarea id="draft" maxlength="'+LIM.draft+'" placeholder="Qu’est-ce qui pèse, là, maintenant ? Écrivez comme ça vient, sans prénom." style="min-height:110px">'+esc(state.draft)+'</textarea>'+
      '<div class="chips" role="group" aria-label="Ce que vous attendez"><button type="button" class="chip" data-act="dmode" data-v="listen" aria-pressed="'+(state.depotMode==='listen')+'">Être écouté·e</button><button type="button" class="chip" data-act="dmode" data-v="advice" aria-pressed="'+(state.depotMode==='advice')+'">Et concrètement, je fais quoi ?</button></div>'+
      '<div class="row" style="align-items:center">'+(state.busy?'<button type="button" class="btn" data-act="dstop">'+I.stop+'Arrêter</button>':'<button type="button" class="btn primary" data-act="dsend">'+I.drop+'Déposer</button>')+'<span class="count" id="draft-count" aria-hidden="true"></span></div>'+
      (state.sample===false?'<p class="hint">Version de test : l’écoute est locale (une question, une lumière) et votre texte ne quitte pas votre appareil. La phrase-miroir arrive avec la version complète.</p>':'');
  }
  if(state.busy)html+='<div class="mirror"><div class="think" role="status"><span class="dotp"></span>Je vous lis…</div></div>';
  if(td&&!state.busy)html+=depotHtml(td,true);
  html+='</div>';return html;
}
