/* ---------- formules ---------- */
function cell(v){if(v===true)return '<td>'+I.check+'<span class="sr">inclus</span></td>';if(v===false)return '<td class="no"><span aria-hidden="true">—</span><span class="sr">non inclus</span></td>';return '<td class="tx">'+esc(v)+'</td>';}
function viewPlans(){
  const t=tier();const peek=!D().onboarded;
  const btn=k=>{
    const name=TIERS[k].t;
    if(peek)return k==='free'?'<button type="button" class="btn wide" data-act="onboard">Commencer gratuitement</button>':'<button type="button" class="btn'+(k==='parcours'?' primary':'')+' wide" data-act="tier" data-v="'+k+'" aria-label="Choisir la formule '+esc(name)+'">Choisir</button>';
    return t===k?'<button type="button" class="btn wide" disabled>'+I.check+'Votre formule</button>':'<button type="button" class="btn'+(k==='parcours'?' primary':'')+' wide" data-act="tier" data-v="'+k+'" aria-label="'+(k==='free'?'Revenir à la formule Découverte':'Choisir la formule '+esc(name))+'">'+(k==='free'?'Revenir à Découverte':'Choisir')+'</button>';
  };
  return '<main id="main" tabindex="-1" class="view"><div><h1 class="t1">Les formules</h1><p class="sub">Sans engagement, résiliable à tout moment. Ce que chaque formule donne, concrètement :</p></div>'+
    '<div class="card"><table class="cmp"><caption class="sr">Ce que comprend chaque formule</caption><thead><tr><th scope="col"><span class="sr">Ce qui est compris</span></th><th scope="col">Découverte<br>0</th><th scope="col" class="best">Parcours<br>14/mois</th><th scope="col">Antonio<br>49/mois</th></tr></thead><tbody>'+FEATURES.map(f=>'<tr><th scope="row">'+esc(f[0])+'</th>'+cell(f[1])+cell(f[2])+cell(f[3])+'</tr>').join('')+'</tbody></table></div>'+
    '<div class="plans">'+
    '<div class="plan"><h2 class="t2">Découverte</h2><div class="price">0 CHF <small>pour toujours</small></div><p>Pour voir si l’espace vous parle : la dose chaque jour, toute la boîte à outils, trois dépôts écoutés, la première étape.</p>'+btn('free')+'</div>'+
    '<div class="plan best"><span class="pill sun">Le plus choisi</span><h2 class="t2">Le parcours</h2><div class="price">14 CHF <small>par mois</small></div><p>Les cadenas disparaissent : déposez autant que nécessaire avec la phrase-miroir, recevez votre dose à vous, suivez les 24 étapes et voyez votre chemin sur six mois.</p>'+btn('parcours')+'</div>'+
    '<div class="plan"><h2 class="t2">Avec Antonio</h2><div class="price">49 CHF <small>par mois</small></div><p>Tout Le parcours, et un éducateur qui vous connaît : <b>chaque mois, Antonio lit les dépôts que vous choisissez de lui partager et vous écrit un mot personnel</b>, qui s’affiche en haut de votre accueil. <b>Deux fois par mois, vous lui posez une question</b> ; il répond par écrit sous 48 heures. Jamais de prénom d’enfant, jamais de diagnostic.</p>'+btn('antonio')+'</div></div>'+
    '<p class="hint">Version de test : choisir une formule change l’interface pour la montrer. Aucun paiement n’est demandé et rien n’est transmis à Antonio. Les prix sont ceux prévus pour la Suisse.'+(SITE?' <a href="conditions.html">Conditions générales</a>':'')+'</p></main>';
}
function sheetUpgrade(sheetIn){
  const u=UP[state.upFeat]||UP.parcours;const anto=state.upFeat==='antonio';
  return '<div class="backdrop" data-act="sheet-close"></div><div class="sheet'+(sheetIn?' in':'')+'" role="dialog" aria-modal="true" aria-labelledby="up-title" tabindex="-1"><div class="sheet-in"><div class="grab"></div><span class="label">'+I.lock+' Fait partie '+(anto?'de la formule Avec Antonio':'du Parcours')+'</span><h2 id="up-title" class="t2" style="font-family:var(--font-display);font-weight:500">'+esc(u.t)+'</h2><p>'+esc(u.s)+'</p>'+
    (anto?'':'<button type="button" class="btn primary wide" data-act="tier" data-v="parcours">Le parcours · 14 CHF/mois</button>')+
    '<button type="button" class="btn'+(anto?' primary':'')+' wide" data-act="tier" data-v="antonio">Avec Antonio · 49 CHF/mois</button>'+
    '<button type="button" class="btn ghost wide" data-act="sheet-close">Plus tard</button><p class="hint" style="text-align:center">Version de test : la formule s’active sans paiement, pour voir l’interface.</p></div></div>';
}
