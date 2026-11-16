const fs=require('fs');
const code=fs.readFileSync(process.argv[2],'utf8');
const store={};
globalThis.localStorage={getItem:k=>store[k]===undefined?null:store[k],setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
globalThis.navigator={vibrate:()=>true};
const inputs={};
function inp(id){if(!inputs[id])inputs[id]={id,value:'',focus(){},setSelectionRange(){},selectionStart:0,style:{},textContent:''};return inputs[id];}
const app={innerHTML:'',className:'',listeners:{},children:[],addEventListener(t,f){this.listeners[t]=f;},appendChild(el){this.children.push(el);},querySelector(){return null;}};
globalThis.document={
  getElementById(id){if(id==='app')return app;return inp(id);},
  querySelector(sel){const m=sel.match(/^\[data-evo="(\w+)"\]$/);if(m)return inp('evo-'+m[1]);const m2=sel.match(/^\[data-evoopen="(\w+)"\]$/);if(m2)return inp('evo-'+m2[1]);return null;},
  createElement(){return {className:'',setAttribute(){},textContent:'',remove(){}};},
  addEventListener(){},
};
let sampleCalls=[];
const fakeSample=async function(input,opts){sampleCalls.push({input,opts});return {text:'## Ce que j’entends\nVous tenez bon.\n## Ce que vous pouvez essayer\n- Une chose\n- Deux\n- Trois\n## Pour vous\nRespirez.\n## Si ça continue\nParlez-en.'};};
fakeSample.json=async function(input,opts){sampleCalls.push({input,opts,json:true});return {miroir:'On dirait que la fatigue a pris toute la place ce soir.',question:'Qu’est-ce qui vous a tenu debout aujourd’hui ?',lumiere:'Vous êtes resté·e. C’est déjà énorme.'};};
globalThis.window=globalThis;globalThis.scrollTo=()=>{};
globalThis.window.claude={use:async(name)=>name==='sample'?fakeSample:null};
let failures=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)failures++;};
const has=(re)=>re.test(app.innerHTML);
const click=(act,ds={},extra={})=>{const el=Object.assign({tagName:'BUTTON',dataset:Object.assign({act},ds),closest(){return el;}},extra);return app.listeners.click({target:el});};
const change=(act,ds,checked)=>{const el={tagName:'INPUT',dataset:Object.assign({act},ds),checked};return app.listeners.change({target:el});};
const input=(id,val)=>{inp(id).value=val;app.listeners.input({target:inp(id)});};
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
const S=()=>JSON.parse(store['pepe-v1']);
(async()=>{
  eval(code);await wait(10);
  ok(has(/herofull/)&&has(/Parent Écouté,<br>Parent Éclairé/)&&has(/data-act="onboard"/)&&has(/intro-plans/)&&(app.innerHTML.match(/class="pillar( sun)?"/g)||[]).length===3,'welcome: hero, 3 pillars, CTA');
  click('onboard');ok(has(/Faisons connaissance/),'onboarding sheet');
  click('ob',{k:'age',v:'a'});click('obw',{v:'fatigue'});inp('ob-me').value='Antonio';click('ob-done');
  ok(has(/, Antonio\./)&&has(/class="band/)&&has(/La dose de lumière intérieure|Dose spéciale du dimanche/)&&has(/Écouté · Déposer/)&&has(/l’étape de la semaine/)&&has(/moodrow/),'today: greeting, dose, depot box, step, mood');
  ok(!has(/Le mot d’Antonio/),'no letter card in free tier');
  ok((app.innerHTML.match(/class="tab"/g)||[]).length===4,'4 tabs');
  ok(has(/3 dépôts offerts/),'free counter shows 3 left');
  // 3 free depots
  for(let i=0;i<3;i++){input('draft','Dépôt numéro '+i+' : ce soir, c’est lourd et je suis fatigué.');click('dsend');await wait(15);}
  ok(S().depots.length===3&&has(/On dirait que la fatigue/),'3 depots stored and mirror shown');
  ok(has(/Vos trois dépôts Découverte sont utilisés/)&&has(/data-act="upgrade" data-f="depots"/),'depot box locked after 3');
  // parcours locks
  click('go',{view:'parcours'});
  ok((app.innerHTML.match(/class="step[^"]*locked/g)||[]).length===23,'23 locked steps in free');
  click('step',{i:'5'});ok(has(/Les 24 étapes/)&&has(/data-act="tier" data-v="parcours"/),'locked step opens upgrade sheet');
  click('sheet-close');
  click('step',{i:'0'});ok(has(/étape 1 \/ 24/),'step 1 open in free');
  click('back');
  click('go',{view:'photo'});ok(has(/Le photolangage<\/h2>/),'photo locked → upgrade sheet');
  click('sheet-close');
  click('go',{view:'evo'});click('evotime',{v:'t2'});ok(has(/Voir le chemin/),'t2 locked in free');
  click('sheet-close');
  // dose perso lock on today
  click('go',{view:'today'});ok(has(/data-act="upgrade" data-f="dose"/),'dose perso locked in free with recent depot');
  // upgrade to parcours
  click('upgrade',{f:'dose'});click('tier',{v:'parcours'});
  ok(S().tier==='parcours'&&has(/data-act="dose-perso"/)&&has(/id="draft"/),'parcours tier: dose perso + depot box unlocked');
  click('dose-perso');await wait(15);ok(S().doseText.length>0,'dose perso stored');
  click('go',{view:'parcours'});ok(!has(/locked/),'no locks in parcours tier');
  click('go',{view:'photo'});ok((app.innerHTML.match(/photopick/g)||[]).length===12,'photo open in parcours tier');
  // me view
  click('go',{view:'me'});ok(has(/Ma formule/)&&has(/tierbadge parcours/)&&has(/data-f="antonio"/)&&has(/Mes dépôts/)&&has(/mooddots/),'me view content');
  click('go',{view:'depots'});ok((app.innerHTML.match(/class="mirror"/g)||[]).length===3,'depots history shows 3');
  click('back');ok(has(/<h1 class="t1">Moi<\/h1>/),'back to me');
  // plans
  click('go',{view:'plans'});ok(has(/class="cmp"/)&&(app.innerHTML.match(/<tr>/g)||[]).length===11&&has(/Votre formule/),'plans table 10 rows + current marker');
  click('tier',{v:'antonio'});ok(S().tier==='antonio','antonio tier set');
  click('go',{view:'today'});ok(has(/Le mot d’Antonio · exemple/)&&has(/data-act="letter"/),'letter card example on today');
  ok(has(/Partager ce dépôt avec Antonio/),'share checkbox visible');
  click('letter',{i:'-1'});ok(has(/à quoi ressemble le mot d’Antonio/)&&has(/Antonio Company/),'letter view');
  click('back');ok(has(/Le mot d’Antonio · exemple/),'back from letter to today (prev)');
  const did=S().depots[0].id;change('share',{id:did},true);ok(S().shared[did]===true,'share toggled');
  click('go',{view:'antonio'});ok(has(/Dépôts partagés ce mois/)&&has(/id="qdraft"/)&&has(/Exemple de question/),'antonio view');
  input('qdraft','Mon ado refuse de se lever le matin, je fais quoi ?');click('qsend');
  ok(S().questions.length===1&&has(/en attente, réponse sous 48 h/)&&has(/1 \/ 2/),'question sent and counted');
  input('qdraft','Deuxième question.');click('qsend');input('qdraft','Troisième ?');
  ok(S().questions.length===2&&has(/Vos deux questions du mois sont posées/),'quota of 2 enforced');
  // kit
  click('go',{view:'kit'});ok(has(/La boîte à outils/)&&(app.innerHTML.match(/class="sit"/g)||[]).length===22,'kit situations');
  click('kit',{v:'tools'});ok(has(/Minuteur visuel/),'kit tools');
  click('kit',{v:'me'});ok(has(/data-act="exo"/),'kit pour moi');
  click('exo',{id:'droit'});ok(has(/class="perm"/),'exo');click('back');ok(has(/La boîte à outils/),'back to kit');
  click('kit',{v:'sits'});input('q','coucher');await wait(300);const n=(app.innerHTML.match(/class="sit"/g)||[]).length;ok(n>0&&n<22,'search filters');
  // sos
  click('go',{view:'sos'});ok(has(/Là, maintenant/),'sos');click('go',{view:'today'});
  // reset
  click('go',{view:'data'});click('reset');click('reset-yes');ok(store['pepe-v1']===undefined&&has(/herofull/),'reset → welcome');
  // offline
  console.log('--- offline ---');delete globalThis.window.claude;sampleCalls=[];app.innerHTML='';eval(code);await wait(10);
  click('onboard');click('ob-done');
  ok(has(/l’écoute est locale/),'offline hint');
  input('draft','Je n’en peux plus ce soir.');click('dsend');await wait(10);
  const od=S().depots;ok(od.length===1&&od[0].question&&od[0].lumiere&&sampleCalls.length===0,'offline depot local');
  console.log(failures?('FAILURES: '+failures):'ALL PASSED');
})().catch(e=>{console.error('CRASH',e);process.exit(1);});
