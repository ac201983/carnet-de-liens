/* ---------- l'eau de la photo : de vraies ondes, calculées dans l'image ---------- */
/* La photo est redessinée par la carte graphique du téléphone, et chaque onde déplace vraiment les reflets de l'étang,
   en suivant sa perspective (les cercles s'aplatissent au loin). Rien n'est dessiné par-dessus la photo.
   Là où l'eau est calme, ce calque est transparent, et il s'enlève tout seul quand la dernière onde s'est éteinte.
   Sans carte graphique utilisable, la photo reste simplement immobile. */
const EAU={ok:null,cv:null,gl:null,u:null,tex:false,host:null,geo:null,rips:[],wait:[],raf:0,t0:0,fix:null,n:0,last:0,slow:0,weak:0,seq:0,lost:0,drop:null};
const EAU_LIFE=3.2;
const EAU_TC=1.2;   /* le moment où la goutte touche la pointe de la colonne, en secondes depuis le début de son rebond */
const EAU_ICI='.herofull,.band';   /* toutes les photos : l'accueil, les quatre onglets et « Mon histoire » */
const EAU_VS='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
/* Les réglages de l'onde, à un seul endroit. Les longueurs sont en points de la photo, à la profondeur de la goutte. */
const EAU_P=Object.assign({c:120,lam:130,front:26,tail:170,tau:4.5,ax:13,ay:16,sh:.8,gl:.35,li:.6,pw:2},(typeof window!=='undefined'&&window.EAU_O)||{});
const EAU_FS=[
'precision highp float;',
'uniform sampler2D uTex;uniform vec2 uRes;uniform vec4 uMap;uniform float uT;uniform float uA;uniform vec4 uD;uniform vec4 uS;uniform vec4 uR[8];',
'void main(){',
' vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);',
' vec2 q=uMap.xy+p*uMap.zw;',                                  /* le point de la photo (866 x 470) */
' float s=(q.y+26.)/285.;',                                    /* la perspective : 1 à la profondeur de la goutte, plus petit au loin */
' vec2 w=vec2((q.x-434.)/s,1500./s);',                         /* le même point, posé à plat sur l'étang */
' vec2 g=vec2(0.);float h=0.;float li=0.;',
' for(int i=0;i<8;i++){',
'  vec4 r=uR[i];float age=uT-r.z;',
'  vec2 dv=w-r.xy;float d=length(dv)+.0001;',
'  float x=@c@*max(age,0.)-d;',                                /* distance derrière le front de l onde, qui avance lentement */
'  float e=x<0.?exp(-x*x/(@front@*@front@)):exp(-x/@tail@);',  /* un front doux, puis des rides de plus en plus faibles derrière lui */
'  e*=r.w*step(0.,age)*smoothstep(0.,.7,age)*exp(-age/@tau@)*(1.-smoothstep(2.,3.2,age))*smoothstep(8.,60.,d)/sqrt(1.+d/400.);',
'  float c=e*cos(x*6.2832/@lam@);',
'  float cr=cos(x*6.2832/@lam@);',
'  g+=dv/d*c;h+=c;li+=e*pow(max(cr,0.),@pw@)*(.55+.45*abs(dv.y)/d);',
' }',
' float m=smoothstep(104.,150.,q.y)*mix(smoothstep(150.,250.,q.x),1.,smoothstep(140.,178.,q.y));',   /* seulement sur l eau : ni la rive, ni la fougère */
' vec2 pa=q-vec2(434.,160.);float hh=clamp(pa.y/90.,0.,1.);',
' m*=smoothstep(14.,30.,length(pa-vec2(0.,90.)*hh));',                                              /* ni la goutte et sa colonne, qui sont devant l eau */
' vec2 o=vec2(g.x*@ax@*s,-g.y*@ay@*s*s)*m*uA;',
' float tilt=(h*.45-g.y*.55)*m*uA;',                                                                   /* la pente de la vague, vue d ici */
' vec3 col=texture2D(uTex,(q+o)/vec2(866.,470.)).rgb;',
' col*=1.+tilt*@sh@;',
' float sx=(q.x-480.)/130.;float sun=exp(-sx*sx);',                                                       /* la lumière vient d en haut, un peu à droite de la goutte */
' float lum=dot(col,vec3(.3,.6,.1));',
' col+=vec3(.9,1.,.84)*li*m*uA*(@li@*(.35+lum)+@gl@*sun);',                                          /* une crête fine qui accroche la lumière, plus vive sous le soleil */
' float a=clamp(length(o)*.8+abs(tilt)*2.5+li*m*uA*3.,0.,1.);',
/* la goutte suspendue : uD = (descente en points de la photo, étirement en largeur, étirement en hauteur, présence de l effet) */
' vec2 I=vec2(866.,470.);vec2 c0=vec2(434.8,167.5);vec2 ax=vec2(15.8,16.8);vec2 dq=q-c0;',
' float hole=0.;float dr=0.;float ec=0.;float sp=0.;',
' if(uD.w>.001&&abs(dq.x)<50.&&dq.y>-66.&&dq.y<50.){',                                              /* tout ceci ne se calcule qu autour de la goutte, et seulement pendant son rebond */
'  hole=(1.-smoothstep(.72,1.,length(dq/(ax+vec2(9.,dq.y>0.?4.6:9.)))))*uD.w;',                     /* là où elle était : on rebouche le fond */
'  vec2 lo=c0-ax-12.;vec2 hi=c0+ax+vec2(12.,5.);vec2 uv=clamp((q-lo)/(hi-lo),0.,1.);',              /* il se prolonge depuis les quatre côtés du cadre qui entoure la goutte */
'  vec3 fx=mix(texture2D(uTex,vec2(lo.x,q.y)/I).rgb,texture2D(uTex,vec2(hi.x,q.y)/I).rgb,uv.x);',
'  vec3 fy=mix(texture2D(uTex,vec2(q.x,lo.y)/I).rgb,texture2D(uTex,vec2(q.x,hi.y)/I).rgb,uv.y);',
'  vec3 fc=mix(mix(texture2D(uTex,lo/I).rgb,texture2D(uTex,vec2(hi.x,lo.y)/I).rgb,uv.x),mix(texture2D(uTex,vec2(lo.x,hi.y)/I).rgb,texture2D(uTex,hi/I).rgb,uv.x),uv.y);',
'  col=mix(col,fx+fy-fc,hole);',
'  vec2 u=(dq-vec2(0.,uD.x))/uD.yz;',
'  dr=(1.-smoothstep(.93,1.06,length(u/ax)))*uD.w;',                                                /* là où elle est maintenant : la goutte de la photo, telle quelle */
'  col=mix(col,texture2D(uTex,(c0+u)/I).rgb,dr);',
' }',
/* au contact : uS = (secondes depuis le contact, force de l éclat, rayon de l éclat, présence des gouttelettes) */
' vec2 tip=vec2(434.8,201.);vec2 dt=q-tip;',
' if((uS.y>.001||uS.w>.001)&&dot(dt,dt)<8100.){',
'  ec=uS.y*exp(-dot(dt,dt)/(uS.z*uS.z));',
'  float tc=max(uS.x,0.);',
'  for(int i=0;i<5;i++){float fi=float(i);float an=(fi-2.)*.42;float v=64.+fi*7.;vec2 pp=tip+vec2(sin(an)*v*tc*.9,-cos(an)*v*tc+85.*tc*tc);float rr=(1.5+.3*fi)*uA;vec2 e2=q-pp;sp+=exp(-dot(e2,e2)/(rr*rr));}',
'  sp*=uS.w;',
'  col+=vec3(1.,.98,.86)*(ec+sp*.85);',
' }',
' a=max(a,clamp(max(hole,dr)+ec*2.5+sp*2.,0.,1.));',
' gl_FragColor=vec4(col*a,a);',
'}'].join('\n').replace(/@(\w+)@/g,(m,k)=>(+EAU_P[k]).toFixed(4));
function eauNow(){return EAU.fix!=null?EAU.fix:(performance.now()-EAU.t0)/1000;}
function eauInit(){
  if(EAU.ok!==null)return EAU.ok;
  EAU.ok=false;
  try{
    const cv=document.createElement('canvas');cv.className='eau';cv.setAttribute('aria-hidden','true');
    /* failIfMajorPerformanceCaveat : pas de calque si la carte graphique est émulée par le processeur, car l'eau serait saccadée. (__eauSansGarde : seulement pour les tests.) */
    const gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:'low-power',failIfMajorPerformanceCaveat:!window.__eauSansGarde});
    if(!gl)return false;
    const hp=gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT);if(!hp||!hp.precision)return false;
    /* Certains navigateurs émulent la carte graphique sans le dire : on le lit dans son nom, et là non plus on ne dessine pas l'eau. */
    try{const di=gl.getExtension('WEBGL_debug_renderer_info');const nom=di?String(gl.getParameter(di.UNMASKED_RENDERER_WEBGL)):'';if(!window.__eauSansGarde&&/swiftshader|llvmpipe|software|basic render/i.test(nom))return false;}catch(e){}
    const sh=(t,src)=>{const o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error('eau');return o;};
    const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,EAU_VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,EAU_FS));gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return false;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const a=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    EAU.u={res:gl.getUniformLocation(pr,'uRes'),map:gl.getUniformLocation(pr,'uMap'),t:gl.getUniformLocation(pr,'uT'),a:gl.getUniformLocation(pr,'uA'),d:gl.getUniformLocation(pr,'uD'),s:gl.getUniformLocation(pr,'uS'),r:gl.getUniformLocation(pr,'uR')};
    gl.uniform1i(gl.getUniformLocation(pr,'uTex'),0);gl.clearColor(0,0,0,0);
    cv.addEventListener('webglcontextlost',e=>{e.preventDefault();if(EAU.cv!==cv)return;eauStop();EAU.cv=null;EAU.gl=null;EAU.tex=false;EAU.ok=(++EAU.lost<4)?null:false;});
    const im=new Image();im.decoding='async';
    im.onload=()=>{
      if(EAU.gl!==gl)return;
      try{
        gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
        EAU.tex=true;const q=EAU.wait;EAU.wait=[];q.forEach(f=>{try{f();}catch(e){}});
      }catch(e){EAU.ok=false;}
    };
    im.src=HERO;
    EAU.cv=cv;EAU.gl=gl;EAU.ok=true;
  }catch(e){EAU.ok=false;}
  return EAU.ok;
}
/* Où la photo est-elle affichée, et quel morceau en voit-on ? (elle remplit sa boîte en étant rognée, comme « cover ») */
function eauGeo(host){
  const hero=host.classList.contains('herofull');const box=hero?host.querySelector('.herobg'):host;if(!box)return null;
  const r=box.getBoundingClientRect();if(r.width<40||r.height<40)return null;
  let px=.5,py=.5;
  try{const cs=getComputedStyle(box);const m=String(hero?cs.objectPosition:cs.backgroundPosition).match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);if(m){px=m[1]/100;py=m[2]/100;}}catch(e){}
  const k=Math.max(r.width/866,r.height/470);
  return {el:box,w:r.width,h:r.height,k:k,ox:-(r.width-866*k)*px/k,oy:-(r.height-470*k)*py/k};
}
function eauHost(host){
  if(!EAU.ok||!host)return false;
  if(EAU.host!==host||EAU.cv.parentNode!==host){
    if(host.classList.contains('herofull')){const im=host.querySelector('.herobg');if(!im)return false;host.insertBefore(EAU.cv,im.nextSibling);}
    else host.insertBefore(EAU.cv,host.firstChild);
    EAU.host=host;EAU.geo=null;
  }
  if(!EAU.geo)EAU.geo=eauGeo(host);
  return !!EAU.geo;
}
function eauStop(){
  if(EAU.raf){cancelAnimationFrame(EAU.raf);EAU.raf=0;}
  EAU.rips=[];EAU.wait=[];EAU.n=0;EAU.slow=0;EAU.host=null;EAU.geo=null;EAU.drop=null;
  if(EAU.cv){try{EAU.gl.clear(EAU.gl.COLOR_BUFFER_BIT);}catch(e){}if(EAU.cv.parentNode)EAU.cv.parentNode.removeChild(EAU.cv);}
}
/* Une onde naît à cet endroit de la photo. */
function eauAdd(ix,iy,force,delay){
  if(!EAU.rips.length&&!EAU.raf)EAU.t0=performance.now();
  const s=(iy+26)/285;
  EAU.rips.push({x:(ix-434)/s,z:1500/s,t:eauNow()+(delay||0),s:force});
  if(EAU.rips.length>8)EAU.rips.shift();
  if(!EAU.raf&&EAU.fix==null)EAU.raf=requestAnimationFrame(eauFrame);
}
/* Le rebond de la goutte, en ralenti : elle monte encore un peu, retombe sur la pointe de la colonne, s'y écrase à peine, puis rebondit et revient à sa place.
   Rend ce qu'il faut au dessin : sa descente, ses étirements, et l'éclat et les gouttelettes du contact. */
function eauGoutte(t){
  const seg=(a,b)=>Math.min(1,Math.max(0,(t-a)/(b-a))),eo=p=>1-(1-p)*(1-p),eio=p=>p<.5?2*p*p:1-2*(1-p)*(1-p);
  const T=EAU_TC;let dy=0,sx=1,sy=1;
  if(t<.12){}
  else if(t<.62)dy=-22*eo(seg(.12,.62));
  else if(t<T){const p=seg(.62,T);dy=-22+40*p*p;sy=1+.07*p;sx=1-.045*p;}
  else if(t<T+.3){const p=seg(T,T+.3),k=Math.sin(Math.PI*p);sy=1+.07*(1-p)*(1-k)-.16*k;sx=1-.045*(1-p)*(1-k)+.1*k;dy=18+(1-sy)*16.8;}
  else if(t<T+.95)dy=18-23*eo(seg(T+.3,T+.95));
  else dy=-5*(1-eio(seg(T+.95,T+1.75)));
  const tc=t-T;const pres=Math.min(1,t/.08)*(1-seg(T+1.67,T+1.75));
  const eclat=tc<0?0:(tc<.09?tc/.09:Math.exp(-(tc-.09)/.3))*.5;
  const gouttes=tc<0?0:Math.min(1,tc/.05)*(1-Math.min(1,Math.max(0,(tc-.55)/.4)));
  return {d:[dy,sx,sy,pres],s:[tc,eclat,12,gouttes]};
}
const EAU_GFIN=EAU_TC+1.75;
/* La goutte rebondit, et l'onde part au moment où elle touche l'eau. */
function eauBond(){
  if(EAU.drop!=null)return;
  eauAdd(434,259,1,EAU_TC);eauAdd(434,259,.55,EAU_TC+.3);
  EAU.drop=eauNow();
}
function eauFrame(){
  EAU.raf=0;const gl=EAU.gl,cv=EAU.cv;
  if(!EAU.ok||!EAU.tex||!EAU.host||!cv.isConnected||!fxOn()){eauStop();return;}
  const now=eauNow();
  EAU.rips=EAU.rips.filter(r=>now-r.t<EAU_LIFE);
  if(EAU.drop!=null&&now-EAU.drop>=EAU_GFIN)EAU.drop=null;
  if(!EAU.rips.length&&EAU.drop==null){eauStop();return;}
  if(!EAU.geo||EAU.n%30===29)EAU.geo=eauGeo(EAU.host);
  const g=EAU.geo;if(!g){eauStop();return;}
  /* Un téléphone qui peine vraiment (quatre images de suite trop lentes) : on arrête cette onde. La deuxième fois, la photo reste immobile pour toute la visite. */
  const ms=performance.now();
  if(EAU.fix==null&&!window.__eauSansGarde&&EAU.n>1){EAU.slow=ms-EAU.last>60?EAU.slow+1:0;if(EAU.slow>3){if(++EAU.weak>1)EAU.ok=false;eauStop();return;}}
  EAU.last=ms;EAU.n++;
  /* Sur un grand écran la photo est grande : on plafonne le nombre de points dessinés, pour que l'eau reste fluide même sur un ordinateur modeste. */
  const dpr=Math.min(window.devicePixelRatio||1,2,Math.max(1,Math.sqrt(1.8e6/(g.w*g.h))));
  const W=Math.max(2,Math.round(g.w*dpr)),H=Math.max(2,Math.round(g.h*dpr));
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  gl.viewport(0,0,W,H);
  gl.uniform2f(EAU.u.res,W,H);gl.uniform4f(EAU.u.map,g.ox,g.oy,g.w/(W*g.k),g.h/(H*g.k));gl.uniform1f(EAU.u.t,now);
  gl.uniform1f(EAU.u.a,Math.max(1,Math.min(1.7,.8/g.k)));
  const G=EAU.drop!=null?eauGoutte(now-EAU.drop):{d:[0,1,1,0],s:[-1,0,12,0]};
  gl.uniform4f(EAU.u.d,G.d[0],G.d[1],G.d[2],G.d[3]);gl.uniform4f(EAU.u.s,G.s[0],G.s[1],G.s[2],G.s[3]);   /* photo affichée en petit (le bandeau) : l'onde est un peu plus marquée, pour rester visible */
  const a=EAU.buf||(EAU.buf=new Float32Array(32));a.fill(0);EAU.rips.forEach((r,i)=>{a[i*4]=r.x;a[i*4+1]=r.z;a[i*4+2]=r.t;a[i*4+3]=r.s;});
  gl.uniform4fv(EAU.u.r,a);
  gl.drawArrays(gl.TRIANGLES,0,3);
  if(EAU.fix==null)EAU.raf=requestAnimationFrame(eauFrame);
}
/* Dès que la photo est prête pour la carte graphique. */
function eauReady(f){if(!eauInit())return;if(EAU.tex)f();else EAU.wait.push(f);}
/* À l'arrivée sur un écran qui montre la photo : la goutte rebondit, et l'onde part quand elle touche l'eau.
   Avec la lumière qui se lève en même temps, tout ce qui bouge tout seul est redevenu calme en cinq secondes.
   « first » : la toute première ouverture du site, où l'écran est déjà écrit dans la page. La lumière y attend l'eau, pour qu'elles partent ensemble. */
function eauArrive(first){
  const id=++EAU.seq;if(!fxOn())return;
  /* Si une onde de lumière traverse l'écran, la goutte attend qu'elle arrive jusqu'à la photo : c'est l'onde qui la fait sauter. */
  let attente=100;const o=state.onde;
  if(o&&Date.now()-o.t<300){const ph=document.querySelector(EAU_ICI);if(ph){const r=ph.getBoundingClientRect();attente=Math.round(o.dur*1000*Math.min(1,.06+Math.hypot((r.left+r.width/2-o.x)/1.25,r.top+r.height*.5-o.y)/o.r)*.85);}}
  const go=()=>setTimeout(()=>{
    if(id!==EAU.seq||!fxOn())return;
    if(first){const ap=document.getElementById('app');if(ap&&ap.classList){state.enterAt=Date.now();ap.classList.add('lum');}}
    if(!document.querySelector(EAU_ICI))return;
    eauReady(()=>{if(id!==EAU.seq)return;const host=document.querySelector(EAU_ICI);if(!host||!eauHost(host))return;eauBond();});
  },attente);
  /* On attend que la page ait fini de se charger : la première onde ne doit pas être saccadée. */
  if(document.readyState==='complete')go();else window.addEventListener('load',go,{once:true});
}
/* Sous le doigt : on ne fait bouger l'eau que là où il y a de l'eau. */
function eauTouch(e){
  if(!fxOn()||e.button>0)return;const t=e.target&&e.target.closest?e.target:null;
  if(!t||t.closest('button,a,input,textarea,select,label'))return;
  const host=t.closest('.herofull,.band');if(!host)return;
  const x=e.clientX,y=e.clientY;
  eauReady(()=>{
    if(!host.isConnected)return;const g=eauGeo(host);if(!g)return;const r=g.el.getBoundingClientRect();
    const ix=g.ox+(x-r.left)/g.k,iy=g.oy+(y-r.top)/g.k;
    if(Math.abs(ix-435)<30&&iy>140&&iy<262){if(eauHost(host))eauBond();return;}      /* la goutte ou sa colonne : elle rebondit */
    if(iy<118||iy>470||ix<0||ix>866)return;      /* la rive, la forêt, ou plus bas que la photo : rien ne bouge */
    if(eauHost(host))eauAdd(ix,iy,.8,0);
  });
}
/* Après chaque rendu : en changeant d'écran l'eau redevient calme, et sur le même écran le calque retrouve sa photo. */
function eauSync(entering){
  if(!EAU.cv)return;
  if(entering||!EAU.rips.length){eauStop();return;}
  if(!EAU.cv.isConnected){const host=document.querySelector('.herofull,.band');if(!host||!eauHost(host))eauStop();else if(!EAU.raf&&EAU.fix==null)EAU.raf=requestAnimationFrame(eauFrame);}
}
