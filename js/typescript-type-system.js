(function(){
"use strict";
function byId(id){return document.getElementById(id);}
var SVGNS='http://www.w3.org/2000/svg';
function mk(n,a){var e=document.createElementNS(SVGNS,n);for(var k in a)e.setAttribute(k,a[k]);return e;}
function svgText(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill,'font-size':size||11,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function addLog(el,msg,cls){if(!el)return;var d=document.createElement('div');d.className='lg'+(cls?' '+cls:'');d.innerHTML=msg;el.appendChild(d);requestAnimationFrame(function(){d.classList.add('show');});while(el.children.length>40)el.removeChild(el.firstChild);el.scrollTop=el.scrollHeight;}
function pulse(el){if(!el)return;el.classList.add('pulse');setTimeout(function(){el.classList.remove('pulse');},460);}
function setType(el,code,comment){if(!el)return;el.innerHTML=code+(comment?'  <span class="tl">// '+comment+'</span>':'');}
function segInit(id,attr,cb){var seg=byId(id);if(!seg)return;seg.querySelectorAll('.seg-opt').forEach(function(o){o.addEventListener('click',function(){seg.querySelectorAll('.seg-opt').forEach(function(x){x.classList.remove('on');});o.classList.add('on');cb(o.getAttribute(attr));});});}

(function hero(){
  var svg=byId('heroSvg');if(!svg)return;
  var BL='#3B82F6',TE='#2DD4BF',CO='#FB7185',TY='#5BD6C2',MU='#7E88A4',INK='#CBD5F0';
  var defs=mk('defs',{});var marker=mk('marker',{id:'ah',markerWidth:'9',markerHeight:'9',refX:'6',refY:'3',orient:'auto'});marker.appendChild(mk('path',{d:'M0 0 L6 3 L0 6 Z',fill:BL}));defs.appendChild(marker);svg.appendChild(defs);
  svg.appendChild(svgText(430,34,'a program that runs on types \u00B7 at compile time',MU,11,'middle','600'));
  var xs=[26,234,442,650],w=185,cy=80,ch=108;
  var cards=[
    {c:BL,title:'type User',lines:['id: number','name: string']},
    {c:TE,title:'keyof User',lines:['"id" | "name"']},
    {c:CO,title:'`on${Cap<K>}`',lines:['"onId"','"onName"']},
    {c:BL,title:'Handlers<User>',lines:['onId: (n)=>void','onName: (s)=>void']}
  ];
  cards.forEach(function(cd,i){
    var x=xs[i];
    svg.appendChild(mk('rect',{x:x,y:cy,width:w,height:ch,rx:9,fill:'#141B2D',stroke:cd.c,'stroke-width':1.5}));
    svg.appendChild(mk('line',{x1:x,y1:cy+30,x2:x+w,y2:cy+30,stroke:'rgba(140,160,205,0.16)','stroke-width':1}));
    svg.appendChild(svgText(x+13,cy+20,cd.title,cd.c,12.5,'start','600'));
    cd.lines.forEach(function(ln,j){svg.appendChild(svgText(x+13,cy+50+j*20,ln,j===0?INK:TY,11.5,'start','500'));});
  });
  var ops=['keys','template','map'];
  for(var i=0;i<3;i++){
    var x1=xs[i]+w,x2=xs[i+1],my=cy+ch/2;
    svg.appendChild(mk('path',{d:'M'+x1+' '+my+' L'+x2+' '+my,fill:'none',stroke:'rgba(59,130,246,0.55)','stroke-width':1.5,'stroke-dasharray':'4 4','marker-end':'url(#ah)'}));
    svg.appendChild(svgText((x1+x2)/2,my-9,ops[i],BL,9.5,'middle','600'));
  }
  var tokPath='M'+(xs[0]+w)+' '+(cy+ch/2)+' L'+xs[1]+' '+(cy+ch/2);
  if(!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
    var tok=mk('circle',{r:4.5,fill:'#E8ECF8',stroke:'#0A0E1A','stroke-width':1.4});
    tok.appendChild(mk('animateMotion',{dur:'2.4s',repeatCount:'indefinite',path:tokPath,calcMode:'linear'}));
    svg.appendChild(tok);
  } else { svg.appendChild(mk('circle',{cx:xs[1],cy:cy+ch/2,r:4.5,fill:'#E8ECF8',stroke:'#0A0E1A','stroke-width':1.4})); }
})();

(function(){
  var hasX=true,hasY=true,hasZ=false,mode='literal';
  var saShape=byId('saShape'),saVerd=byId('saVerd'),saLog=byId('saLog');
  if(!saShape)return;
  function members(){var m=[];if(hasX)m.push('x: 1');if(hasY)m.push('y: 2');if(hasZ)m.push('z: 3');return '{ '+m.join(', ')+' }';}
  function evaluate(quiet){
    var shape=members();
    saShape.textContent=(mode==='literal')?('const p: Point = '+shape):('const raw = '+shape+';  const p: Point = raw');
    var msg,cls;
    if(!hasX||!hasY){var miss=!hasX?'x':'y';msg='\u2717 Property \''+miss+'\' is missing in type '+shape;cls='bad';}
    else if(hasZ&&mode==='literal'){msg='\u2717 Object literal may only specify known properties \u2014 \'z\' does not exist in type \'Point\'';cls='bad';}
    else{msg='\u2713 assignable to Point';cls='ok';}
    saVerd.textContent=msg;saVerd.className='sa-verd '+cls;
    if(!quiet)addLog(saLog,msg,cls);
  }
  ['saX','saY','saZ'].forEach(function(id){byId(id).addEventListener('click',function(){var el=byId(id);el.classList.toggle('on');if(id==='saX')hasX=el.classList.contains('on');if(id==='saY')hasY=el.classList.contains('on');if(id==='saZ')hasZ=el.classList.contains('on');evaluate();});});
  segInit('saMode','data-mode',function(v){mode=v;addLog(saLog,'assigned as '+(v==='literal'?'a fresh object literal':'a value via a variable'),'');evaluate(true);});
  byId('saReset').addEventListener('click',function(){hasX=true;hasY=true;hasZ=false;byId('saX').classList.add('on');byId('saY').classList.add('on');byId('saZ').classList.remove('on');evaluate();addLog(saLog,'reset','');});
  evaluate(true);
})();

(function(){
  var kind=null,errArm=true;
  var arms={click:byId('nrArmClick'),scroll:byId('nrArmScroll'),error:byId('nrArmError')};
  var nrType=byId('nrType'),nrCheck=byId('nrCheck'),nrStatus=byId('nrStatus'),nrExhaust=byId('nrExhaust'),nrLog=byId('nrLog');
  if(!nrType)return;
  var MEM={click:['{ kind: "click"; url: string }','ev.url'],scroll:['{ kind: "scroll"; depth: number }','ev.depth'],error:['{ kind: "error"; message: string }','ev.message']};
  function setKind(k){
    kind=k;for(var a in arms)arms[a].classList.remove('on');
    if(k==='error'&&!errArm){setType(nrType,'ev: Ev','no case handles "error" \u2014 falls to default');nrStatus.textContent='ev.kind === "error" \u2192 no matching case (the arm was removed)';nrStatus.className='stateline bad';addLog(nrLog,'ev = error \u2192 <b>unhandled</b> \u2014 no case for "error"','bad');return;}
    arms[k].classList.add('on');setType(nrType,'ev: '+MEM[k][0],MEM[k][1]+' available');nrStatus.textContent='ev.kind === "'+k+'" \u2192 narrowed to the '+k+' member';nrStatus.className='stateline good';addLog(nrLog,'ev.kind === "'+k+'" \u2192 narrowed \u2192 <b>'+MEM[k][0]+'</b>','ok');
  }
  function setExhaust(){
    if(errArm){arms.error.classList.remove('dim');nrCheck.textContent='\u2713 exhaustive \u2014 in default, ev narrows to never';nrCheck.className='nr-check ok';nrExhaust.textContent='error case: on';}
    else{arms.error.classList.add('dim');nrCheck.textContent='\u2717 Type \'{ kind: "error"; \u2026 }\' is not assignable to \'never\' \u2014 case missing';nrCheck.className='nr-check bad';nrExhaust.textContent='error case: off';}
  }
  byId('nrClick').addEventListener('click',function(){setKind('click');});
  byId('nrScroll').addEventListener('click',function(){setKind('scroll');});
  byId('nrError').addEventListener('click',function(){setKind('error');});
  nrExhaust.addEventListener('click',function(){errArm=!errArm;setExhaust();addLog(nrLog,errArm?'restored the <b>error</b> case \u2014 switch is exhaustive':'removed the <b>error</b> case \u2014 default no longer narrows to never',errArm?'ok':'warn');if(kind)setKind(kind);});
  setExhaust();
})();

(function(){
  var geInferred=byId('geInferred'),geVerd=byId('geVerd'),geLog=byId('geLog');
  if(!geInferred)return;
  function show(t,msg,cls){setType(geInferred,'T = '+t);geVerd.textContent=msg;geVerd.className='sa-verd '+cls;addLog(geLog,msg,cls);}
  byId('geObj').addEventListener('click',function(){show('{ id: number; name: string }','\u2713 save returns { id: number; name: string } \u2014 T inferred, constraint satisfied','ok');});
  byId('geNoId').addEventListener('click',function(){show('{ name: string }','\u2717 Property \'id\' is missing in \'{ name: string }\' but required in constraint \'{ id: number }\'','bad');});
  byId('geNum').addEventListener('click',function(){show('number','\u2717 Argument of type \'number\' is not assignable to \'{ id: number }\'','bad');});
})();

(function(){
  var irType=byId('irType'),irStatus=byId('irStatus'),irLog=byId('irLog');
  if(!irType)return;
  var T={'let':['{ kind: string; depth: number }','let is mutable \u2014 members widen to general types'],'const':['{ kind: string; depth: number }','const on an object still widens its members'],'asconst':['{ readonly kind: "click"; readonly depth: 3 }','as const freezes every member to a readonly literal']};
  function setMode(m){setType(irType,'o: '+T[m][0]);irStatus.textContent=T[m][1];irStatus.className='stateline'+(m==='asconst'?' good':'');if(m==='asconst')pulse(irType);addLog(irLog,'<b>'+(m==='asconst'?'const o = { \u2026 } as const':m+' o = { \u2026 }')+'</b> \u2192 '+T[m][0],m==='asconst'?'ok':'ty');}
  segInit('irMode','data-mode',setMode);
  byId('irReset').addEventListener('click',function(){setMode('let');byId('irMode').querySelectorAll('.seg-opt').forEach(function(o,i){o.classList.toggle('on',i===0);});addLog(irLog,'reset','');});
  setMode('let');
})();

(function(){
  var cdResult=byId('cdResult'),cdStatus=byId('cdStatus'),cdLog=byId('cdLog');
  if(!cdResult)return;
  function show(inp,res,note,cls){setType(cdResult,'Unpack&lt;'+inp+'&gt; = '+res);cdStatus.textContent=note;cdStatus.className='stateline good';addLog(cdLog,note,cls||'ty');}
  byId('cdArr').addEventListener('click',function(){show('string[]','string','string[] extends Array&lt;infer E&gt; \u2192 E = string','ok');});
  byId('cdProm').addEventListener('click',function(){show('Promise&lt;number&gt;','number','Promise&lt;number&gt; extends Promise&lt;infer E&gt; \u2192 E = number','ok');});
  byId('cdPrim').addEventListener('click',function(){show('boolean','boolean','boolean matches neither branch \u2192 falls through to T','warn');});
})();

(function(){
  var mtResult=byId('mtResult'),mtLog=byId('mtLog');
  if(!mtResult)return;
  byId('mtKeyof').addEventListener('click',function(){mtResult.innerHTML='keyof User = <span class="vv">"id" | "name"</span>';addLog(mtLog,'<b>keyof User</b> \u2192 the union of keys: "id" | "name"','ty');});
  byId('mtTemplate').addEventListener('click',function(){mtResult.innerHTML='`on${Capitalize&lt;K&gt;}` = <span class="vv">"onId" | "onName"</span>';addLog(mtLog,'template literal rewrites each key \u2192 "onId" | "onName"','ty');});
  byId('mtMapped').addEventListener('click',function(){mtResult.innerHTML='Handlers&lt;User&gt; = {\n  <span class="kk">onId</span>: (v: number) =&gt; void;\n  <span class="kk">onName</span>: (v: string) =&gt; void;\n}';pulse(mtResult);addLog(mtLog,'<b>mapped type</b> builds the object \u2014 callbacks typed by each T[K]','ok');});
  byId('mtReset').addEventListener('click',function(){mtResult.innerHTML='Handlers&lt;User&gt; = <span class="tl">// step through the transformation</span>';addLog(mtLog,'reset','');});
})();

(function(){
  var koResult=byId('koResult'),koStatus=byId('koStatus'),koLog=byId('koLog');
  if(!koResult)return;
  function show(res,note,cls){koResult.innerHTML=res;koStatus.textContent=note;koStatus.className='stateline good';addLog(koLog,note,cls||'ty');}
  byId('koTypeof').addEventListener('click',function(){show('typeof config = { host: string; port: number; tls: boolean }','typeof lifts the value into a type','ty');});
  byId('koKeyof').addEventListener('click',function(){show('keyof typeof config = <span class="vv">"host" | "port" | "tls"</span>','keyof lists the keys as a union','ok');});
  byId('koIndex').addEventListener('click',function(){show('(typeof config)["port"] = <span class="vv">number</span>','indexed access looks up the member type','ok');});
  byId('koReset').addEventListener('click',function(){koResult.innerHTML='\u2014 <span class="tl">// derive a type from the value</span>';koStatus.textContent='derive a type from the config value';koStatus.className='stateline';addLog(koLog,'reset','');});
})();

(function(){
  var V={vfR1:[true,'\u2713 allowed \u2014 return covariance: Dog \u2286 Animal'],vfR2:[false,'\u2717 rejected \u2014 () => Animal is not assignable where () => Dog is required'],vfR3:[true,'\u2713 allowed \u2014 parameter contravariance: a handler of any Animal accepts a Dog'],vfR4:[false,'\u2717 rejected \u2014 a Dog-only handler cannot take arbitrary Animals']};
  var vfStatus=byId('vfStatus'),vfLog=byId('vfLog');if(!vfStatus)return;
  Object.keys(V).forEach(function(id){var el=byId(id);if(!el)return;el.addEventListener('click',function(){var v=V[id];el.classList.remove('ok','bad');el.classList.add(v[0]?'ok':'bad');el.querySelector('.vf-vd').textContent=v[0]?'assignable':'error';vfStatus.textContent=v[1];vfStatus.className='stateline '+(v[0]?'good':'bad');addLog(vfLog,v[1],v[0]?'ok':'bad');});});
  byId('vfReset').addEventListener('click',function(){Object.keys(V).forEach(function(id){var el=byId(id);el.classList.remove('ok','bad');el.querySelector('.vf-vd').textContent='test \u2192';});vfStatus.textContent='click an assignment to test it against strictFunctionTypes';vfStatus.className='stateline';addLog(vfLog,'reset','');});
})();

(function(){
  var gdType=byId('gdType'),gdAccess=byId('gdAccess'),gdStatus=byId('gdStatus'),gdLog=byId('gdLog');
  if(!gdType)return;
  byId('gdGuard').addEventListener('click',function(){setType(gdType,'x: Link','narrowed by isLink(x)');gdAccess.textContent='x.code available';gdStatus.textContent='inside if (isLink(x)) \u2014 x is Link';gdStatus.className='stateline good';addLog(gdLog,'<b>if (isLink(x))</b> \u2192 type predicate narrows x to <b>Link</b>','ok');});
  byId('gdElse').addEventListener('click',function(){setType(gdType,'x: ApiError','the else branch');gdAccess.textContent='x.message available';gdStatus.textContent='in the else branch \u2014 x is ApiError';gdStatus.className='stateline good';addLog(gdLog,'<b>else</b> \u2192 x narrowed to <b>ApiError</b>','ok');});
  byId('gdAssert').addEventListener('click',function(){setType(gdType,'x: Link','asserted for the rest of scope');gdAccess.textContent='x.code available';gdStatus.textContent='after assertLink(x) \u2014 x is Link for the remaining scope';gdStatus.className='stateline good';addLog(gdLog,'<b>assertLink(x)</b>: asserts x is Link \u2192 narrowed for the whole rest of the scope','ok');});
  byId('gdReset').addEventListener('click',function(){setType(gdType,'x: Link | ApiError','apply a guard to narrow');gdAccess.textContent='only shared members';gdStatus.textContent='apply the guard to narrow the union';gdStatus.className='stateline';addLog(gdLog,'reset','');});
})();

(function(){
  var erOutput=byId('erOutput'),erWhen=byId('erWhen'),erInfo=byId('erInfo'),erLog=byId('erLog');
  if(!erOutput)return;
  var JS='<span class="ek">function</span> greet(u) {\n  <span class="ek">return</span> `hi ${u.name}`;\n}\n<span class="es">// interface User { \u2026 }  \u2192 erased</span>\n<span class="es">// every : Type annotation  \u2192 erased</span>';
  byId('erCompile').addEventListener('click',function(){erOutput.innerHTML=JS;erWhen.textContent='at compile time';erInfo.textContent='none (erased)';addLog(erLog,'<b>tsc</b> type-checked, then emitted plain JS \u2014 the interface and every annotation removed','ty');});
  byId('erCheck').addEventListener('click',function(){erInfo.textContent='none \u2014 no reflection';addLog(erLog,'<b>typeof value === "User"</b> \u2192 always false \u00B7 at runtime there is no "User", only "object". No reflection.','bad');});
  byId('erReset').addEventListener('click',function(){erOutput.innerHTML='<span class="es">\u2014 press compile to run tsc \u2014</span>';erWhen.textContent='\u2014';erInfo.textContent='\u2014';addLog(erLog,'reset','');});
})();

(function(){
  var menuBtn=byId('menuBtn'),navEl=byId('nav'),scrim=byId('scrim');
  function close(){if(navEl)navEl.classList.remove('open');if(scrim)scrim.classList.remove('show');}
  if(menuBtn)menuBtn.addEventListener('click',function(){navEl.classList.add('open');scrim.classList.add('show');});
  if(scrim)scrim.addEventListener('click',close);
  document.querySelectorAll('.nav a.module').forEach(function(a){a.addEventListener('click',close);});
})();
var _secs=[].slice.call(document.querySelectorAll('.module-sec'));
var _links=[].slice.call(document.querySelectorAll('.nav a.module'));
function onScroll(){var h=document.documentElement,st=h.scrollTop||document.body.scrollTop,max=(h.scrollHeight-h.clientHeight)||1,prog=byId('progress');if(prog)prog.style.width=(st/max*100)+'%';var cur='',y=st+130;for(var i=0;i<_secs.length;i++){if(_secs[i].offsetTop<=y)cur=_secs[i].id;}for(var j=0;j<_links.length;j++){_links[j].classList.toggle('active',_links[j].getAttribute('href')==='#'+cur);}}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',onScroll);

onScroll();
})();
