(function(){
"use strict";
function byId(id){return document.getElementById(id);}
var SVGNS='http://www.w3.org/2000/svg';
function mk(n,a){var e=document.createElementNS(SVGNS,n);for(var k in a)e.setAttribute(k,a[k]);return e;}
function svgText(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill,'font-size':size||11,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function addLog(el,msg,cls){if(!el)return;var d=document.createElement('div');d.className='lg'+(cls?' '+cls:'');d.innerHTML=msg;el.appendChild(d);requestAnimationFrame(function(){d.classList.add('show');});while(el.children.length>40)el.removeChild(el.firstChild);el.scrollTop=el.scrollHeight;}
function pulse(el){if(!el)return;el.classList.add('pulse');setTimeout(function(){el.classList.remove('pulse');},440);}
function segInit(id,attr,cb){var seg=byId(id);if(!seg)return;seg.querySelectorAll('.seg-opt').forEach(function(o){o.addEventListener('click',function(){seg.querySelectorAll('.seg-opt').forEach(function(x){x.classList.remove('on');});o.classList.add('on');cb(o.getAttribute(attr));});});}

(function hero(){
  var svg=byId('heroSvg');if(!svg)return;
  var IN='#7A5CF5',TE='#2DD4BF',AM='#E8B341',GR='#4ED66B',PE='#7C9CFF',MU='#7E88A4',INK='#B7C0D8';
  var defs=mk('defs',{});var marker=mk('marker',{id:'ah',markerWidth:'9',markerHeight:'9',refX:'6',refY:'3',orient:'auto'});marker.appendChild(mk('path',{d:'M0 0 L6 3 L0 6 Z',fill:IN}));defs.appendChild(marker);svg.appendChild(defs);
  svg.appendChild(svgText(170,34,'YOU WRITE',INK,12,'middle','700'));
  svg.appendChild(svgText(690,34,'COMPILER EMITS',IN,12,'middle','700'));
  svg.appendChild(svgText(430,36,'Roslyn',MU,10.5,'middle','600'));
  var rows=[
    ['yield return x;','IEnumerator state machine',TE],
    ['x => x + n','class Display { n; }',AM],
    ['record Link(\u2026)','Equals \u00B7 GetHashCode \u00B7 with',GR],
    ['[JsonGen] partial','// generated: Link.g.cs',PE]
  ];
  rows.forEach(function(r,i){
    var y=64+i*52;
    svg.appendChild(mk('rect',{x:40,y:y,width:260,height:40,rx:8,fill:'#161E32',stroke:r[2],'stroke-width':1.4}));
    svg.appendChild(svgText(56,y+25,r[0],INK,12.5,'start','500'));
    svg.appendChild(mk('rect',{x:560,y:y,width:262,height:40,rx:8,fill:'rgba(122,92,245,0.08)',stroke:IN,'stroke-width':1.3}));
    svg.appendChild(svgText(576,y+25,r[1],'#CFC4FB',12,'start','500'));
    var my=y+20;
    svg.appendChild(mk('path',{d:'M300 '+my+' L560 '+my,fill:'none',stroke:'rgba(122,92,245,0.5)','stroke-width':1.4,'stroke-dasharray':'4 4','marker-end':'url(#ah)'}));
  });
  var tokPath='M300 84 L560 84';
  if(!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
    var tok=mk('circle',{r:5,fill:'#E8ECF8',stroke:'#0A0E1A','stroke-width':1.5});
    tok.appendChild(mk('animateMotion',{dur:'2.6s',repeatCount:'indefinite',path:tokPath,calcMode:'linear'}));
    svg.appendChild(tok);
  } else { svg.appendChild(mk('circle',{cx:560,cy:84,r:5,fill:'#E8ECF8',stroke:'#0A0E1A','stroke-width':1.5})); }
})();

(function(){
  var base=[10,20,30],hits=base.slice(),copies=0,refW=false;
  var rfArray=byId('rfArray'),rfSlot=byId('rfSlot'),rfCopies=byId('rfCopies'),rfLog=byId('rfLog');
  if(!rfArray)return;
  function render(){rfArray.innerHTML='';hits.forEach(function(v,i){var c=document.createElement('div');c.className='rf-cell'+(i===1&&refW?' ref':'');c.innerHTML='<div class="rf-i">hits['+i+']</div><div class="rf-v">'+v+'</div>';rfArray.appendChild(c);});rfSlot.textContent=hits[1];rfCopies.textContent=copies;}
  byId('rfRefWrite').addEventListener('click',function(){hits[1]=99;refW=true;addLog(rfLog,'<b>ref int slot = ref hits[1]; slot = 99</b> \u2192 the array element itself is mutated in place','ok');render();});
  byId('rfCopyWrite').addEventListener('click',function(){copies++;addLog(rfLog,'<b>int copy = hits[1]; copy = 7</b> \u2192 the copy changes; hits[1] is untouched','');render();});
  byId('rfInPass').addEventListener('click',function(){addLog(rfLog,'<b>Process(in big)</b> \u2192 a 64-byte struct passed by readonly reference \u00B7 <b>0 field copies</b>','emit');});
  byId('rfReset').addEventListener('click',function(){hits=base.slice();copies=0;refW=false;render();addLog(rfLog,'reset','');});
  render();
})();

(function(){
  var V={rsLocal:[true,'\u2713 allowed \u2014 a local lives on the stack'],rsParam:[true,'\u2713 allowed \u2014 passed by value on the stack'],rsReturn:[true,'\u2713 allowed \u2014 a ref-safe return stays stack-scoped'],rsBox:[false,'\u2717 CS0029 / CS8345 \u2014 a ref struct cannot be boxed'],rsField:[false,'\u2717 CS8345 \u2014 cannot be a field of a class (would reach the heap)'],rsAsync:[false,'\u2717 CS4012 \u2014 cannot be a local in an async method (lives across await)']};
  var rsStatus=byId('rsStatus'),rsLog=byId('rsLog');if(!rsStatus)return;
  Object.keys(V).forEach(function(id){var el=byId(id);if(!el)return;el.addEventListener('click',function(){var v=V[id];el.classList.remove('ok','bad');el.classList.add(v[0]?'ok':'bad');el.querySelector('.rs-vd').textContent=v[0]?'allowed':'rejected';rsStatus.textContent=v[1];rsStatus.className='stateline '+(v[0]?'good':'bad');addLog(rsLog,v[1],v[0]?'ok':'bad');});});
  byId('rsReset').addEventListener('click',function(){Object.keys(V).forEach(function(id){var el=byId(id);el.classList.remove('ok','bad');el.querySelector('.rs-vd').textContent='test \u2192';});rsStatus.textContent='click a placement to see whether the compiler permits it';rsStatus.className='stateline';addLog(rsLog,'reset','');});
})();

(function(){
  var phase='none',mn=0,prod=[];
  var chips={s:byId('itStart'),y1:byId('itY1'),y2:byId('itY2'),y3:byId('itY3'),d:byId('itDone')},itState=byId('itState'),itMN=byId('itMoveNext'),itLazy=byId('itLazy'),itYield=byId('itYield'),itLog=byId('itLog');
  if(!itState)return;
  function setChips(cur,done){for(var k in chips){chips[k].classList.remove('cur','done');}done.forEach(function(c){chips[c].classList.add('done');});if(cur)chips[cur].classList.add('cur');}
  function setYield(){itYield.innerHTML='<span>produced:</span> '+(prod.length?prod.join(', '):'\u2014');}
  function reset(){phase='none';mn=0;prod=[];setChips(null,[]);itState.textContent='not called';itMN.textContent='0';itLazy.textContent='\u2014';setYield();}
  byId('itCall').addEventListener('click',function(){phase='created';setChips('s',[]);itState.textContent='created (not started)';itLazy.textContent='nothing \u2014 lazy';addLog(itLog,'<b>Numbers()</b> \u2192 returns an enumerator \u00B7 <b>0 body lines executed</b>','');});
  byId('itNext').addEventListener('click',function(){
    if(phase==='none'){addLog(itLog,'call <b>Numbers()</b> first','warn');return;}
    if(phase==='created'){mn=1;phase='y1';prod=[1];setChips('y1',['s']);itState.textContent='suspended @ yield 1';itMN.textContent='1';setYield();addLog(itLog,'<b>MoveNext() #1</b> \u2192 ran to <b>yield return 1</b> \u00B7 produced 1 \u00B7 suspended','ok');}
    else if(phase==='y1'){mn=2;phase='y2';prod=[1,2];setChips('y2',['s','y1']);itState.textContent='suspended @ yield 2';itMN.textContent='2';setYield();addLog(itLog,'<b>MoveNext() #2</b> \u2192 resumed \u2192 <b>yield return 2</b> \u00B7 produced 2','ok');}
    else if(phase==='y2'){mn=3;phase='y3';prod=[1,2,3];setChips('y3',['s','y1','y2']);itState.textContent='suspended @ yield 3';itMN.textContent='3';setYield();addLog(itLog,'<b>MoveNext() #3</b> \u2192 resumed \u2192 <b>yield return 3</b> \u00B7 produced 3','ok');}
    else if(phase==='y3'){mn=4;phase='done';setChips(null,['s','y1','y2','y3','d']);itState.textContent='completed (MoveNext returned false)';itMN.textContent='4';addLog(itLog,'<b>MoveNext() #4</b> \u2192 ran to the end \u00B7 no more yields \u2192 returns <b>false</b>','ok');}
    else{addLog(itLog,'sequence exhausted \u2014 reset to run again','');}
  });
  byId('itReset').addEventListener('click',function(){reset();addLog(itLog,'reset','');});
  reset();
})();

(function(){
  var mode='shared',built=false;
  var clDisp=byId('clDisp'),clOutputs=byId('clOutputs'),clLog=byId('clLog');
  if(!clDisp)return;
  function renderOut(vals){if(!vals){clOutputs.innerHTML='<span style="font-family:var(--font-mono);font-size:12px;color:var(--ink-faint)">build, then invoke</span>';return;}clOutputs.innerHTML='';vals.forEach(function(v){var s=document.createElement('span');s.className='cl-out';s.textContent=v;clOutputs.appendChild(s);pulse(s);});}
  function resetBuild(){built=false;clDisp.textContent='display class: not built yet';renderOut(null);}
  segInit('clSeg','data-mode',function(v){mode=v;resetBuild();addLog(clLog,'capture strategy \u2192 <b>'+(v==='shared'?'shared loop variable i':'fresh copy per iteration')+'</b>','');});
  byId('clBuild').addEventListener('click',function(){built=true;clDisp.textContent=mode==='shared'?'display class: 1 shared cell (holds i) \u2014 all 3 closures point at it':'display class: 3 cells (one fresh copy per iteration)';renderOut(null);clOutputs.innerHTML='<span style="font-family:var(--font-mono);font-size:12px;color:var(--ink-muted)">built \u2014 now invoke</span>';addLog(clLog,'built 3 closures capturing <b>'+(mode==='shared'?'the loop variable i (one shared cell)':'a fresh copy each iteration')+'</b>',mode==='shared'?'warn':'ok');});
  byId('clInvoke').addEventListener('click',function(){if(!built){addLog(clLog,'build the closures first','warn');return;}var vals=mode==='shared'?[3,3,3]:[0,1,2];renderOut(vals);addLog(clLog,'invoked all three \u2192 <b>['+vals.join(', ')+']</b> '+(mode==='shared'?'\u2014 all see the final i':'\u2014 each kept its own copy'),mode==='shared'?'warn':'ok');});
  byId('clReset').addEventListener('click',function(){resetBuild();addLog(clLog,'reset','');});
  resetBuild();
})();

(function(){
  var typ='record',aHits=10,bHits=10;
  var rdEq=byId('rdEq'),rdEqual=byId('rdEqual'),rdRef=byId('rdRefEqual'),rdA=byId('rdAVal'),rdB=byId('rdBVal'),rdLog=byId('rdLog');
  if(!rdEq)return;
  function reset(full){aHits=10;bHits=10;rdA.textContent='10';rdB.textContent='10';rdEqual.textContent='\u2014';rdRef.textContent='\u2014';rdEq.textContent='press a == b to compare';rdEq.className='rd-eq';if(full)addLog(rdLog,'reset','');}
  segInit('rdSeg','data-type',function(v){typ=v;reset(false);addLog(rdLog,'type of a and b \u2192 <b>'+v+'</b>','');});
  byId('rdEquals').addEventListener('click',function(){if(typ==='record'){var eq=(aHits===bHits);rdEqual.textContent=eq?'True':'False';rdRef.textContent='False';rdEq.textContent='record: value equality \u2014 all fields equal \u2192 a == b is '+(eq?'True':'False')+' (distinct instances)';rdEq.className='rd-eq '+(eq?'ok':'bad');addLog(rdLog,'<b>record</b>: a == b compares fields \u2192 <b>'+(eq?'True':'False')+'</b> \u00B7 ReferenceEquals False',eq?'ok':'');}else{rdEqual.textContent='False';rdRef.textContent='False';rdEq.textContent='class: reference equality \u2014 two instances \u2192 a == b is False';rdEq.className='rd-eq bad';addLog(rdLog,'<b>class</b>: a == b compares references \u2192 <b>False</b> (distinct instances)','bad');}});
  byId('rdWith').addEventListener('click',function(){if(typ==='record'){bHits=99;rdB.textContent='99';addLog(rdLog,'<b>b = a with { Hits = 99 }</b> \u2192 a new copy \u00B7 a.Hits unchanged (10)','ok');}else{addLog(rdLog,'classes have no <b>with</b>-expression \u2014 you\u2019d clone or mutate by hand','warn');}});
  byId('rdReset').addEventListener('click',function(){reset(true);});
  reset(false);
})();

(function(){
  var st='unknown';
  var nlState=byId('nlState'),nlSafe=byId('nlSafe'),nlStatus=byId('nlStatus'),nlLog=byId('nlLog');
  if(!nlState)return;
  function setState(cls,txt){nlState.className='nl-state '+cls;nlState.textContent=txt;}
  function reset(){st='unknown';nlState.className='nl-state';nlState.textContent='unassigned';nlSafe.textContent='\u2014';nlStatus.textContent='get a maybe-null value, then try to dereference it';nlStatus.className='stateline';}
  byId('nlGet').addEventListener('click',function(){st='maybe';setState('maybe','maybe-null');nlSafe.textContent='\u2014';nlStatus.textContent='name is string? \u2014 it could be null until you check';nlStatus.className='stateline';addLog(nlLog,'<b>string? name = GetName()</b> \u2192 flow-state: <b>maybe-null</b>','');});
  byId('nlGuard').addEventListener('click',function(){if(st==='unknown'){addLog(nlLog,'assign <b>name</b> first','warn');return;}st='not';setState('notnull','not-null (narrowed)');nlStatus.textContent='the guard narrowed the flow-state to not-null in this branch';nlStatus.className='stateline good';addLog(nlLog,'<b>if (name is not null)</b> \u2192 flow-state narrowed to <b>not-null</b> inside the branch','ok');});
  byId('nlDeref').addEventListener('click',function(){if(st==='not'){nlSafe.textContent='safe \u2713';nlStatus.textContent='name.Length \u2192 safe \u00B7 the compiler proved not-null';nlStatus.className='stateline good';addLog(nlLog,'<b>name.Length</b> \u2192 OK \u2014 proven not-null','ok');}else{nlSafe.textContent='CS8602 \u26A0';nlStatus.textContent='name.Length \u2192 CS8602: dereference of a possibly-null reference';nlStatus.className='stateline bad';addLog(nlLog,'<b>name.Length</b> \u2192 <b>CS8602</b>: possible null dereference','bad');}});
  byId('nlForgive').addEventListener('click',function(){if(st==='unknown'){addLog(nlLog,'assign <b>name</b> first','warn');return;}st='not';setState('notnull','not-null (via !)');nlStatus.textContent='name! \u2014 you asserted non-null; the compiler trusts you (no check performed)';nlStatus.className='stateline';addLog(nlLog,'<b>name!</b> \u2192 null-forgiving operator suppresses the warning \u00B7 no runtime check','warn');});
  byId('nlReset').addEventListener('click',function(){reset();addLog(nlLog,'reset','');});
  reset();
})();

(function(){
  var V={vrR1:[true,'\u2713 allowed \u2014 covariance: a producer of strings is a producer of objects'],vrR2:[false,'\u2717 rejected \u2014 a producer of objects is not a producer of strings'],vrR3:[true,'\u2713 allowed \u2014 contravariance: a consumer of objects can consume strings'],vrR4:[false,'\u2717 rejected \u2014 a consumer of strings cannot consume arbitrary objects'],vrR5:[false,'\u2717 rejected \u2014 List<T> is invariant (it both reads and writes T)']};
  var vrStatus=byId('vrStatus'),vrLog=byId('vrLog');if(!vrStatus)return;
  Object.keys(V).forEach(function(id){var el=byId(id);if(!el)return;el.addEventListener('click',function(){var v=V[id];el.classList.remove('ok','bad');el.classList.add(v[0]?'ok':'bad');el.querySelector('.vr-vd').textContent=v[0]?'compiles':'error';vrStatus.textContent=v[1];vrStatus.className='stateline '+(v[0]?'good':'bad');addLog(vrLog,v[1],v[0]?'ok':'bad');});});
  byId('vrReset').addEventListener('click',function(){Object.keys(V).forEach(function(id){var el=byId(id);el.classList.remove('ok','bad');el.querySelector('.vr-vd').textContent='test \u2192';});vrStatus.textContent='click an assignment to test it against the variance rules';vrStatus.className='stateline';addLog(vrLog,'reset','');});
})();

(function(){
  var scope=[],leaked=[],disposed=0,nid=1;
  var dzList=byId('dzList'),dzOpenN=byId('dzOpenN'),dzDisposed=byId('dzDisposed'),dzStatus=byId('dzStatus'),dzLog=byId('dzLog');
  if(!dzList)return;
  function render(){var h='';scope.forEach(function(id){h+='<div class="dz-res using"><span>r'+id+' \u00B7 in using scope</span><span style="color:var(--accent)">open</span></div>';});leaked.forEach(function(id){h+='<div class="dz-res leaked"><span>r'+id+' \u00B7 no using (leaked)</span><span>open</span></div>';});dzList.innerHTML=h||'<div class="dz-empty">\u2014 no open resources \u2014</div>';dzOpenN.textContent=scope.length+leaked.length;dzDisposed.textContent=disposed;}
  function st(t,c){dzStatus.textContent=t;dzStatus.className='stateline'+(c?' '+c:'');}
  byId('dzAcquire').addEventListener('click',function(){scope.push(nid);addLog(dzLog,'<b>using var r'+nid+' = Acquire()</b> \u2192 handle open \u00B7 scheduled for disposal','');nid++;render();st('resource opened inside a using scope');});
  byId('dzExit').addEventListener('click',function(){if(!scope.length){addLog(dzLog,'no using scope to exit','warn');return;}var order=scope.slice().reverse();order.forEach(function(){disposed++;});addLog(dzLog,'<b>scope exit</b> \u2192 Dispose() called LIFO: '+order.map(function(i){return'r'+i;}).join(', '),'ok');scope=[];render();st('disposed deterministically at scope exit (LIFO)','good');});
  byId('dzThrow').addEventListener('click',function(){if(!scope.length){addLog(dzLog,'acquire something first','warn');return;}var order=scope.slice().reverse();order.forEach(function(){disposed++;});addLog(dzLog,'<b>exception thrown</b> \u2192 using STILL calls Dispose() on the way out, LIFO: '+order.map(function(i){return'r'+i;}).join(', '),'ok');scope=[];render();st('exception-safe \u2014 Dispose ran anyway','good');});
  byId('dzLeak').addEventListener('click',function(){leaked.push(nid);addLog(dzLog,'<b>var r'+nid+' = Acquire()</b> (no using) \u2192 open, NOT scheduled for disposal','warn');nid++;render();st('leaked handle \u2014 now waiting on the finalizer','bad');});
  byId('dzGC').addEventListener('click',function(){if(!leaked.length){addLog(dzLog,'nothing leaked to finalize','');return;}var c=leaked.length;leaked.forEach(function(){disposed++;});addLog(dzLog,'<b>GC ran</b> \u2192 the finalizer eventually reclaimed '+c+' leaked handle'+(c===1?'':'s')+' \u00B7 non-deterministic, much later','');leaked=[];render();st('finalizer cleaned up the leak (late, non-deterministic)');});
  byId('dzReset').addEventListener('click',function(){scope=[];leaked=[];disposed=0;nid=1;render();st('acquire resources in a using scope, then exit it');addLog(dzLog,'reset','');});
  render();
})();

(function(){
  var mode='valuetask',allocs=0;
  var vtPath=byId('vtPath'),vtAllocs=byId('vtAllocs'),vtLog=byId('vtLog');
  if(!vtPath)return;
  function setAll(){vtAllocs.textContent=allocs;}
  segInit('vtSeg','data-type',function(v){mode=v;allocs=0;setAll();vtPath.textContent='call the method \u2014 a hit completes synchronously';vtPath.className='vt-path';addLog(vtLog,'return type \u2192 <b>'+(v==='valuetask'?'ValueTask<Link>':'Task<Link>')+'</b>','');});
  byId('vtHit').addEventListener('click',function(){if(mode==='task'){allocs++;setAll();vtPath.textContent='synchronous completion \u2014 but Task still allocated';vtPath.className='vt-path sync';addLog(vtLog,'<b>Task</b>: cache hit completes synchronously but STILL allocates a Task object \u00B7 <b>alloc #'+allocs+'</b>','warn');}else{vtPath.textContent='synchronous \u00B7 result wrapped in a struct';vtPath.className='vt-path sync';addLog(vtLog,'<b>ValueTask</b>: cache hit \u2192 result wrapped in a struct \u00B7 <b>0 allocations</b>','ok');}});
  byId('vtMiss').addEventListener('click',function(){allocs++;setAll();vtPath.textContent='genuinely async (cache miss)';vtPath.className='vt-path async';addLog(vtLog,'<b>cache miss</b> \u2192 genuinely async \u00B7 backing state allocated (Task and ValueTask both allocate here) \u00B7 alloc #'+allocs,'');});
  byId('vtReset').addEventListener('click',function(){allocs=0;setAll();vtPath.textContent='call the method \u2014 a hit completes synchronously';vtPath.className='vt-path';addLog(vtLog,'reset','');});
})();

(function(){
  var sgOutput=byId('sgOutput'),sgWhen=byId('sgWhen'),sgCost=byId('sgCost'),sgLog=byId('sgLog');
  if(!sgOutput)return;
  var GEN='<span class="sg-cm">// generated: Link.g.cs</span>\n<span class="sg-kw">partial class</span> Link {\n  <span class="sg-kw">public override string</span> ToString()\n    =&gt; $"Link {{ Code = {Code}, Hits = {Hits} }}";\n}';
  var REF='<span class="sg-cm">// runtime: built via reflection</span>\n<span class="sg-kw">foreach</span> (var p <span class="sg-kw">in</span> typeof(Link).GetProperties())\n  sb.Append(p.Name).Append(\'=\').Append(p.GetValue(o));\n<span class="sg-cm">// reads metadata on EVERY call</span>';
  byId('sgCompile').addEventListener('click',function(){sgOutput.innerHTML=GEN;sgWhen.textContent='compile time';sgCost.textContent='0 runtime cost';addLog(sgLog,'<b>source generator</b> inspected [GenerateToString] Link \u2192 emitted <b>Link.ToString()</b> into the compilation','emit');});
  byId('sgReflect').addEventListener('click',function(){sgOutput.innerHTML=REF;sgWhen.textContent='runtime';sgCost.textContent='reflection / call';addLog(sgLog,'<b>runtime reflection</b> \u2192 GetProperties() on every call \u00B7 slower, allocates','warn');});
  byId('sgReset').addEventListener('click',function(){sgOutput.innerHTML='<span class="sg-none">\u2014 nothing generated yet \u2014 compile to run the generator</span>';sgWhen.textContent='\u2014';sgCost.textContent='\u2014';addLog(sgLog,'reset','');});
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
