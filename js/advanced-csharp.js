(function(){
"use strict";
function byId(id){return document.getElementById(id);}
var SVGNS='http://www.w3.org/2000/svg';
function mk(n,a){var e=document.createElementNS(SVGNS,n);for(var k in a)e.setAttribute(k,a[k]);return e;}
function svgText(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill,'font-size':size||11,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function addLog(el,msg,cls){if(!el)return;var d=document.createElement('div');d.className='lg'+(cls?' '+cls:'');d.innerHTML=msg;el.appendChild(d);requestAnimationFrame(function(){d.classList.add('show');});while(el.children.length>40)el.removeChild(el.firstChild);el.scrollTop=el.scrollHeight;}
function pulse(el){if(!el)return;el.classList.add('pulse');setTimeout(function(){el.classList.remove('pulse');},420);}
function segInit(id,attr,cb){var seg=byId(id);if(!seg)return;seg.querySelectorAll('.seg-opt').forEach(function(o){o.addEventListener('click',function(){seg.querySelectorAll('.seg-opt').forEach(function(x){x.classList.remove('on');});o.classList.add('on');cb(o.getAttribute(attr));});});}

(function hero(){
  var svg=byId('heroSvg');if(!svg)return;
  var IN='#6366F1',TE='#2DD4BF',HE='#FB7185',MU='#7E88A4',INK='#B7C0D8';
  var defs=mk('defs',{});var marker=mk('marker',{id:'ah',markerWidth:'9',markerHeight:'9',refX:'6',refY:'3',orient:'auto'});marker.appendChild(mk('path',{d:'M0 0 L6 3 L0 6 Z',fill:IN}));defs.appendChild(marker);svg.appendChild(defs);
  svg.appendChild(svgText(172,36,'CALL STACK',TE,12,'middle','700'));
  svg.appendChild(svgText(648,36,'MANAGED HEAP',HE,12,'middle','700'));
  svg.appendChild(mk('line',{x1:430,y1:50,x2:430,y2:258,stroke:'rgba(140,160,205,0.16)','stroke-width':1,'stroke-dasharray':'3 6'}));
  var slots=[['int x = 5',TE],['PointV p { X = 1 }',TE],['Link link  \u25CF',IN]];
  slots.forEach(function(s,i){var y=66+i*48;svg.appendChild(mk('rect',{x:44,y:y,width:258,height:40,rx:8,fill:'#161E32',stroke:s[1],'stroke-width':1.4}));svg.appendChild(svgText(60,y+25,s[0],INK,13,'start','500'));});
  var dotX=286,dotY=66+2*48+20;svg.appendChild(mk('circle',{cx:dotX,cy:dotY,r:4,fill:IN}));
  svg.appendChild(svgText(173,232,'value types live inline',MU,10.5,'middle'));
  var chars=['S','N','I','P','4','C','9','2'];
  chars.forEach(function(ch,i){var x=516+i*32,win=(i>=4&&i<=7);svg.appendChild(mk('rect',{x:x,y:82,width:28,height:36,rx:5,fill:win?'rgba(99,102,241,0.16)':'#161E32',stroke:win?IN:'rgba(140,160,205,0.26)','stroke-width':win?1.6:1}));svg.appendChild(svgText(x+14,105,ch,win?IN:INK,14,'middle','600'));});
  var bx1=516+4*32,bx2=516+7*32+28;
  svg.appendChild(mk('path',{d:'M'+bx1+' 74 L'+bx1+' 68 L'+bx2+' 68 L'+bx2+' 74',fill:'none',stroke:IN,'stroke-width':1.4}));
  svg.appendChild(svgText((bx1+bx2)/2,60,'Span<char> \u00B7 window \u00B7 0 alloc',IN,10.5,'middle','600'));
  svg.appendChild(mk('rect',{x:560,y:168,width:232,height:52,rx:9,fill:'rgba(99,102,241,0.10)',stroke:IN,'stroke-width':1.4}));
  svg.appendChild(svgText(576,191,'Link { Url, Hits }',INK,13,'start','500'));
  svg.appendChild(svgText(576,208,'\u2190 referenced from the stack',MU,9.5,'start'));
  svg.appendChild(svgText(676,242,'reference types live here',MU,10.5,'middle'));
  var tokPath='M'+dotX+' '+dotY+' C 380 '+dotY+', 470 194, 560 194';
  svg.appendChild(mk('path',{d:tokPath,fill:'none',stroke:IN,'stroke-width':1.5,'stroke-dasharray':'4 4','marker-end':'url(#ah)'}));
  svg.appendChild(svgText(430,150,'ref',IN,10.5,'middle','700'));
  if(!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
    var tok=mk('circle',{r:5,fill:'#E8ECF8',stroke:'#0A0E1A','stroke-width':1.5});
    tok.appendChild(mk('animateMotion',{dur:'3.4s',repeatCount:'indefinite',path:tokPath,calcMode:'linear'}));
    svg.appendChild(tok);
  } else { svg.appendChild(mk('circle',{cx:560,cy:194,r:5,fill:'#E8ECF8',stroke:'#0A0E1A','stroke-width':1.5})); }
})();

(function(){
  var typ='struct',aX=1,bX=null,assigned=false,allocs=0,boxed=0;
  var scAX=byId('scAX'),scBX=byId('scBX'),scAllocs=byId('scAllocs'),scIdentity=byId('scIdentity'),scStack=byId('scStack'),scHeap=byId('scHeap'),scLog=byId('scLog');
  if(!scAX)return;
  function slot(name,val,isRef,idAttr){return '<div class="sc-slot'+(isRef?' ref':'')+'"'+(idAttr?' id="'+idAttr+'"':'')+'><span>'+name+'</span><b>'+val+'</b></div>';}
  function render(){
    scAX.textContent=aX;scBX.textContent=assigned?bX:'\u2014';scAllocs.textContent=allocs;
    scIdentity.textContent=(typ==='class'&&assigned)?'True':'n/a';
    var st=slot('a',typ==='struct'?'PointV { X='+aX+' }':'\u2192 obj#1',typ==='class');
    st+=assigned?slot('b',typ==='struct'?'PointV { X='+bX+' }':'\u2192 obj#1',typ==='class','scSlotB'):'<div class="sc-slot"><span>b</span><b style="color:var(--ink-faint)">unassigned</b></div>';
    scStack.innerHTML=st;
    var hp='';
    if(typ==='class')hp+='<div class="sc-obj">obj#1 \u00B7 PointR { X='+aX+' }</div>';
    for(var i=0;i<boxed;i++)hp+='<div class="sc-obj">boxed PointV { X=1 }</div>';
    scHeap.innerHTML=hp||'<div class="sc-empty">\u2014 no heap objects \u2014</div>';
  }
  function reset(full){aX=1;bX=null;assigned=false;boxed=0;allocs=(typ==='class')?1:0;render();if(full)addLog(scLog,'reset \u2014 a.X = 1, b unassigned','');}
  segInit('scSeg','data-type',function(v){typ=v;reset(false);addLog(scLog,'type set to <b>'+v+'</b> \u2014 '+(v==='struct'?'value semantics, 0 initial allocations':'reference semantics, obj#1 allocated on the heap'),v==='class'?'heap':'stack');});
  byId('scAssign').addEventListener('click',function(){assigned=true;bX=aX;if(typ==='struct'){addLog(scLog,'<b>b = a</b> \u2192 struct copied bit-for-bit \u2014 b is independent \u00B7 no allocation','stack');}else{addLog(scLog,'<b>b = a</b> \u2192 reference copied \u2014 a and b now alias obj#1','');}render();pulse(byId('scSlotB'));});
  byId('scMutate').addEventListener('click',function(){if(!assigned){addLog(scLog,'assign <b>b = a</b> first','warn');return;}bX=9;if(typ==='class'){aX=9;addLog(scLog,'<b>b.X = 9</b> \u2192 same object \u2014 a.X is now 9 too (aliased)','warn');}else{addLog(scLog,'<b>b.X = 9</b> \u2192 only the copy changes \u2014 a.X stays 1','ok');}render();pulse(byId('scSlotB'));});
  byId('scBox').addEventListener('click',function(){if(typ==='struct'){boxed++;allocs++;addLog(scLog,'<b>object o = a</b> \u2192 BOXING \u2014 struct copied onto the heap \u00B7 allocation #'+allocs,'heap');}else{addLog(scLog,'reference types don\u2019t box \u2014 obj#1 is already on the heap','');}render();});
  byId('scReset').addEventListener('click',function(){reset(true);});
  reset(false);
})();

(function(){
  var BUF='SNIP-4C92-LAUNCH',spanA=0,subA=0;
  var buffer=byId('spBuffer'),spSpanVal=byId('spSpanVal'),spSpanAllocs=byId('spSpanAllocs'),spSubVal=byId('spSubVal'),spSubAllocs=byId('spSubAllocs'),spLog=byId('spLog');
  if(!buffer)return;
  function build(){buffer.innerHTML='';for(var i=0;i<BUF.length;i++){var c=document.createElement('div');c.className='sp-cell';c.setAttribute('data-i',i);c.innerHTML='<span class="idx">'+i+'</span>'+(BUF[i]==='-'?'\u2013':BUF[i]);buffer.appendChild(c);}}
  function clearWin(){buffer.querySelectorAll('.sp-cell').forEach(function(c){c.classList.remove('win');});}
  byId('spSliceSpan').addEventListener('click',function(){clearWin();for(var i=5;i<=8;i++){buffer.children[i].classList.add('win');}spSpanVal.textContent='"4C92"';addLog(spLog,'<b>url.AsSpan(5, 4)</b> \u2192 window over indices 5\u20138 \u00B7 <b>no allocation</b> \u2014 same chars, new (ptr,len)','stack');},false);
  byId('spSliceSub').addEventListener('click',function(){subA++;spSubAllocs.textContent=subA;spSubVal.textContent='"4C92"';addLog(spLog,'<b>url.Substring(5, 4)</b> \u2192 fresh 4-char string on the heap \u00B7 <b>allocation #'+subA+'</b>','heap');},false);
  byId('spStackalloc').addEventListener('click',function(){addLog(spLog,'<b>stackalloc byte[16]</b> \u2192 16 bytes on the stack frame \u00B7 <b>0 heap allocations</b> \u00B7 freed on return','stack');},false);
  byId('spReset').addEventListener('click',function(){spanA=0;subA=0;spSpanAllocs.textContent='0';spSubAllocs.textContent='0';spSpanVal.textContent='\u2014';spSubVal.textContent='\u2014';clearWin();addLog(spLog,'reset','');},false);
  build();
})();

(function(){
  var phase='idle',mn=0;
  var azStart=byId('azStart'),azAwait1=byId('azAwait1'),azAwait2=byId('azAwait2'),azDone=byId('azDone'),azState=byId('azState'),azMoveNext=byId('azMoveNext'),azThread=byId('azThread'),azThreadBox=null,azLog=byId('azLog');
  if(!azStart)return;azThreadBox=azThread.closest('.az-stat');
  function chips(cur,done){[azStart,azAwait1,azAwait2,azDone].forEach(function(c){c.classList.remove('cur','done');});done.forEach(function(c){c.classList.add('done');});if(cur)cur.classList.add('cur');}
  function setThread(t,released){azThread.textContent=t;azThreadBox.className='az-stat '+(released?'thread':(t==='blocked'?'blocked':''));}
  function reset(){phase='idle';mn=0;chips(azStart,[]);azState.textContent='not started';azMoveNext.textContent='0';setThread('idle',false);}
  byId('azCall').addEventListener('click',function(){if(phase!=='idle'){addLog(azLog,'already running \u2014 complete the awaited op','warn');return;}mn=1;phase='await1';chips(azAwait1,[azStart]);azState.textContent='suspended @ await SaveAsync';azMoveNext.textContent='1';setThread('released (not blocked)',true);addLog(azLog,'<b>MoveNext() #1</b> \u2192 ran to <b>await SaveAsync</b> \u00B7 awaiter incomplete \u2192 return, thread released to the pool','ok');});
  byId('azComplete').addEventListener('click',function(){
    if(phase==='idle'){addLog(azLog,'call HandleAsync() first','warn');return;}
    if(phase==='await1'){mn=2;phase='await2';chips(azAwait2,[azStart,azAwait1]);azState.textContent='suspended @ await SetAsync';azMoveNext.textContent='2';setThread('released (not blocked)',true);addLog(azLog,'awaited op completed \u2192 continuation calls <b>MoveNext() #2</b> \u2192 ran to <b>await SetAsync</b>','ok');}
    else if(phase==='await2'){mn=3;phase='done';chips(azDone,[azStart,azAwait1,azAwait2]);azDone.classList.add('done');azState.textContent='completed';azMoveNext.textContent='3';setThread('returned',false);addLog(azLog,'<b>MoveNext() #3</b> \u2192 method body finished \u00B7 Task completed','ok');}
    else{addLog(azLog,'already completed \u2014 reset to run again','');}
  });
  byId('azReset').addEventListener('click',function(){reset();addLog(azLog,'reset','');});
  reset();
})();

(function(){
  var CAP=3,buf=0,pending=0,written=0,read=0;
  var slots=[byId('chSlot0'),byId('chSlot1'),byId('chSlot2')],chPending=byId('chPending'),chBuffered=byId('chBuffered'),chPendingN=byId('chPendingN'),chWritten=byId('chWritten'),chReadN=byId('chReadN'),chStatus=byId('chStatus'),chLog=byId('chLog');
  if(!slots[0])return;
  function render(){for(var i=0;i<CAP;i++){if(i<buf){slots[i].classList.add('full');slots[i].textContent='click';}else{slots[i].classList.remove('full');slots[i].textContent='';}}chBuffered.textContent=buf;chPendingN.textContent=pending;chWritten.textContent=written;chReadN.textContent=read;chPending.style.display=pending>0?'':'none';
    if(pending>0){chStatus.textContent='backpressure \u2014 the writer is awaiting a free slot';chStatus.className='stateline bad';}
    else if(buf>=CAP){chStatus.textContent='buffer full \u2014 the next write will have to wait';chStatus.className='stateline';}
    else{chStatus.textContent='room available \u2014 writes complete immediately';chStatus.className='stateline';}}
  byId('chWrite').addEventListener('click',function(){if(buf<CAP){buf++;written++;addLog(chLog,'<b>WriteAsync</b> \u2192 buffered ('+buf+'/'+CAP+')','');}else{pending++;addLog(chLog,'buffer full \u2192 <b>WriteAsync awaiting</b> (backpressure) \u00B7 pending = '+pending,'warn');}render();});
  byId('chRead').addEventListener('click',function(){if(buf===0){addLog(chLog,'buffer empty \u2192 ReadAsync awaiting an item','warn');return;}read++;if(pending>0){pending--;written++;addLog(chLog,'<b>ReadAsync</b> \u2192 consumed one; a pending write completed into the freed slot','ok');}else{buf--;addLog(chLog,'<b>ReadAsync</b> \u2192 consumed one \u00B7 buffer '+buf+'/'+CAP,'');}render();});
  byId('chReset').addEventListener('click',function(){buf=0;pending=0;written=0;read=0;render();addLog(chLog,'reset','');});
  render();
})();

(function(){
  var seen={},order=[];
  var gnVariants=byId('gnVariants'),gnSpec=byId('gnSpecializations'),gnLog=byId('gnLog');
  if(!gnVariants)return;
  function render(newKey){if(order.length===0){gnVariants.innerHTML='<span style="font-family:var(--font-mono);font-size:11px;color:var(--ink-faint)">none yet \u2014 instantiate the generic</span>';gnSpec.textContent='0';return;}gnVariants.innerHTML='';order.forEach(function(k){var v=seen[k];var s=document.createElement('span');s.className='gn-var '+v.kind+(k===newKey?' pulse':'');s.innerHTML=v.label;gnVariants.appendChild(s);if(k===newKey)pulse(s);});gnSpec.textContent=order.length;}
  function inst(t,isVal){var key=isVal?t:'__Canon';if(!seen[key]){seen[key]={kind:isVal?'val':'canon',label:isVal?'List&lt;'+t+'&gt; \u2192 dedicated body':'List&lt;T&gt; \u2192 __Canon (shared)'};order.push(key);addLog(gnLog,'JIT: <b>List&lt;'+t+'&gt;</b> \u2192 '+(isVal?'new specialization \u00B7 value type laid out inline':'reference \u2192 shares the <b>__Canon</b> body'),isVal?'ok':'');render(key);}else{addLog(gnLog,'JIT: <b>List&lt;'+t+'&gt;</b> reuses the existing '+(key==='__Canon'?'__Canon':key)+' body \u2014 no new code','');render(null);}}
  byId('gnInt').addEventListener('click',function(){inst('int',true);});
  byId('gnDouble').addEventListener('click',function(){inst('double',true);});
  byId('gnString').addEventListener('click',function(){inst('string',false);});
  byId('gnClass').addEventListener('click',function(){inst('Link',false);});
  byId('gnReset').addEventListener('click',function(){seen={};order=[];render(null);addLog(gnLog,'reset','');});
  render(null);
})();

(function(){
  var nullArm=true,last=undefined;
  var arms={neg:byId('pmArmNeg'),zero:byId('pmArmZero'),pos:byId('pmArmPos'),nul:byId('pmArmNull')},pmExhaust=byId('pmExhaust'),pmStatus=byId('pmStatus'),pmNullArm=byId('pmNullArm'),pmLog=byId('pmLog');
  if(!arms.neg)return;
  function clearOn(){for(var k in arms)arms[k].classList.remove('on');}
  function evalInput(val){last=val;clearOn();var matched=null,disp;
    if(val==='null'){disp='null';matched=nullArm?'nul':null;}
    else{disp=String(val);if(val<0)matched='neg';else if(val===0)matched='zero';else matched='pos';}
    if(matched){arms[matched].classList.add('on');pmStatus.textContent='n = '+disp+' \u2192 matched arm  '+arms[matched].querySelector('.pa-pat').textContent;pmStatus.className='stateline good';addLog(pmLog,'n = '+disp+' \u2192 <b>'+arms[matched].querySelector('.pa-res').textContent.replace('\u21D2 ','')+'</b>','ok');}
    else{pmStatus.textContent='n = null \u2192 no arm matches \u00B7 would throw at runtime';pmStatus.className='stateline bad';addLog(pmLog,'n = null \u2192 <b>unhandled</b> \u2014 no arm covers null','bad');}}
  function setExhaust(){if(nullArm){arms.nul.classList.remove('dim');pmExhaust.textContent='\u2713 exhaustive \u2014 every input is handled';pmExhaust.className='pm-exhaust ok';pmNullArm.textContent='null arm: on';}else{arms.nul.classList.add('dim');pmExhaust.textContent='\u26A0 CS8509: not all inputs handled \u2014 null falls through';pmExhaust.className='pm-exhaust warn';pmNullArm.textContent='null arm: off';}}
  byId('pmNeg').addEventListener('click',function(){evalInput(-5);});
  byId('pmZero').addEventListener('click',function(){evalInput(0);});
  byId('pmPos').addEventListener('click',function(){evalInput(42);});
  byId('pmNull').addEventListener('click',function(){evalInput('null');});
  pmNullArm.addEventListener('click',function(){nullArm=!nullArm;setExhaust();addLog(pmLog,nullArm?'added the <b>null =&gt; "none"</b> arm \u2014 switch is exhaustive':'removed the null arm \u2014 compiler warns <b>CS8509</b>',nullArm?'ok':'warn');if(last!==undefined)evalInput(last);});
  setExhaust();
})();

(function(){
  var SRC=[1,2,3,4,5,6],whereRc=0,selectRc=0;
  var lqWhere=byId('lqWhere'),lqSelect=byId('lqSelect'),lqWhereRc=byId('lqWhereRc'),lqSelectRc=byId('lqSelectRc'),lqOutput=byId('lqOutput'),lqLog=byId('lqLog');
  if(!lqWhereRc)return;
  function setC(){lqWhereRc.textContent='\u00D7'+whereRc;lqSelectRc.textContent='\u00D7'+selectRc;}
  function out(v){lqOutput.innerHTML='<span>result:</span> '+v;}
  byId('lqBuild').addEventListener('click',function(){whereRc=0;selectRc=0;setC();out('\u2014');addLog(lqLog,'<b>query built</b> \u2014 Where + Select composed \u00B7 <b>0 elements pulled</b> (deferred)','');});
  byId('lqToList').addEventListener('click',function(){whereRc=0;selectRc=0;var res=[];SRC.forEach(function(n){whereRc++;if(n%2===0){selectRc++;res.push(n*n);}});setC();out('[ '+res.join(', ')+' ]');pulse(lqWhere);pulse(lqSelect);addLog(lqLog,'<b>.ToList()</b> \u2192 pulled all 6 through Where (\u00D7'+whereRc+'); 3 evens \u2192 Select (\u00D7'+selectRc+') \u2192 ['+res.join(', ')+']','ok');});
  byId('lqFirst').addEventListener('click',function(){whereRc=0;selectRc=0;var r=null;for(var i=0;i<SRC.length;i++){whereRc++;if(SRC[i]%2===0){selectRc++;r=SRC[i]*SRC[i];break;}}setC();out(r);pulse(lqWhere);pulse(lqSelect);addLog(lqLog,'<b>.First()</b> \u2192 short-circuited at 2 \u00B7 Where \u00D7'+whereRc+', Select \u00D7'+selectRc+' \u2192 '+r,'ok');});
  byId('lqReset').addEventListener('click',function(){whereRc=0;selectRc=0;setC();out('\u2014');addLog(lqLog,'reset','');});
})();

(function(){
  var compiled=false,mul=2,add=1,N=5;
  var exMulNode=byId('exMulNode'),exMulConst=byId('exMulConst'),exCompiled=byId('exCompiled'),exCompiledStat=byId('exCompiledStat'),exOutput=byId('exOutput'),exLog=byId('exLog');
  if(!exCompiled)return;
  function setCompiled(v){compiled=v;exCompiled.textContent=v?'yes':'no';exCompiledStat.className='ex-stat '+(v?'yes':'no');}
  byId('exCompile').addEventListener('click',function(){setCompiled(true);addLog(exLog,'<b>tree.Compile()</b> \u2192 IL emitted \u2192 callable delegate ready','ok');});
  byId('exInvoke').addEventListener('click',function(){if(!compiled){addLog(exLog,'not compiled \u2014 call <b>Compile()</b> first','warn');return;}var y=N*mul+add;exOutput.textContent=y;addLog(exLog,'<b>f('+N+')</b> = '+N+'\u00D7'+mul+' + '+add+' = <b>'+y+'</b>','ok');});
  byId('exTransform').addEventListener('click',function(){mul=(mul===2?3:2);exMulConst.textContent=mul;setCompiled(false);exOutput.textContent='\u2014';pulse(exMulNode);pulse(exMulConst);addLog(exLog,'rewrote the <b>Multiply</b> operand \u2192 '+mul+' \u00B7 tree changed \u2014 old delegate invalidated','warn');});
  byId('exReset').addEventListener('click',function(){mul=2;add=1;exMulConst.textContent='2';setCompiled(false);exOutput.textContent='\u2014';addLog(exLog,'reset \u2014 x =&gt; x * 2 + 1','');});
})();

(function(){
  var objs=[],nid=1,col0=0;
  var g0=byId('gcObjs0'),g1=byId('gcObjs1'),g2=byId('gcObjs2'),c0=byId('gcCol0'),gcStatus=byId('gcStatus'),gcLog=byId('gcLog');
  if(!g0)return;
  function render(){var b=[g0,g1,g2];for(var k=0;k<3;k++)b[k].innerHTML='';objs.forEach(function(o){var d=document.createElement('div');d.className='gc-obj'+(o.alive?'':' dead');d.title='#'+o.id;b[o.gen].appendChild(d);});c0.textContent=col0;}
  function status(t){gcStatus.textContent=t;}
  byId('gcAlloc').addEventListener('click',function(){objs.push({id:nid,gen:0,alive:true});addLog(gcLog,'allocated object <b>#'+nid+'</b> \u2192 gen 0','stack');nid++;render();status('object allocated into gen 0 \u2014 cheap, collected soon');});
  byId('gcDrop').addEventListener('click',function(){for(var i=objs.length-1;i>=0;i--){if(objs[i].alive){objs[i].alive=false;addLog(gcLog,'dropped reference to <b>#'+objs[i].id+'</b> \u2192 now unreachable (garbage)','warn');render();status('#'+objs[i].id+' is unreachable \u2014 it will be freed on the next collection');return;}}addLog(gcLog,'nothing live to drop','');});
  byId('gcCollect').addEventListener('click',function(){var freed=0,promoted=0,next=[];objs.forEach(function(o){if(!o.alive){freed++;return;}if(o.gen<2){o.gen++;promoted++;}next.push(o);});objs=next;col0++;render();addLog(gcLog,'<b>GC.Collect(0)</b> \u2192 freed '+freed+' dead \u00B7 promoted '+promoted+' survivor'+(promoted===1?'':'s')+' one generation','ok');status('collection #'+col0+' \u2014 freed '+freed+', survivors promoted');});
  byId('gcReset').addEventListener('click',function(){objs=[];nid=1;col0=0;render();addLog(gcLog,'reset','');status('allocate a few objects \u2014 they land in gen 0');});
  render();
})();

(function(){
  var mode='unsafe',EXP=100;
  var rzResult=byId('rzResult'),rzLost=byId('rzLost'),rzExpected=byId('rzExpected'),rzFill=byId('rzFill'),rzStatus=byId('rzStatus'),rzLog=byId('rzLog');
  if(!rzResult)return;var lostBox=rzLost.closest('.rz-stat');
  segInit('rzSeg','data-mode',function(v){mode=v;addLog(rzLog,'strategy \u2192 <b>'+(v==='unsafe'?'hits++ (unsynchronized)':'Interlocked.Increment')+'</b>','');});
  function show(result,lost,good){rzResult.textContent=result;rzLost.textContent=lost;rzExpected.textContent=EXP;rzFill.style.width=(result/EXP*100)+'%';rzFill.className='rz-fill'+(good?' good':'');lostBox.className='rz-stat lost'+(lost===0?' zero':'');}
  byId('rzRun').addEventListener('click',function(){if(mode==='unsafe'){var lost=37,res=EXP-lost;show(res,lost,false);rzStatus.textContent=lost+' updates lost to the race \u2014 the count is silently wrong';rzStatus.className='stateline bad';addLog(rzLog,'<b>unsafe hits++</b> \u00D7100 \u00B7 two threads interleaved read-modify-write \u2192 lost '+lost+' \u2192 <b>'+res+'</b>','bad');}else{show(EXP,0,true);rzStatus.textContent='every increment survived \u2014 exactly 100';rzStatus.className='stateline good';addLog(rzLog,'<b>Interlocked.Increment</b> \u00D7100 \u00B7 each RMW atomic \u2192 0 lost \u2192 <b>100</b>','ok');}});
  byId('rzReset').addEventListener('click',function(){show(0,0,false);rzStatus.textContent='run in unsafe mode, then switch to Interlocked and compare';rzStatus.className='stateline';addLog(rzLog,'reset','');});
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
