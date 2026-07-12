(function(){
"use strict";
function byId(id){return document.getElementById(id);}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function mk(tag,attrs){var e=document.createElementNS('http://www.w3.org/2000/svg',tag);if(attrs)for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function addLog(box,msg,cls){if(!box)return;var d=document.createElement('div');d.className='lg '+(cls||'');d.textContent=msg;box.appendChild(d);requestAnimationFrame(function(){d.classList.add('show');});while(box.children.length>40)box.removeChild(box.firstChild);box.scrollTop=box.scrollHeight;}
function setState(elm,txt,cls){if(!elm)return;elm.textContent=txt;elm.className=cls;}
var REDUCED=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function(){
  var svg=byId('heroSvg');if(!svg)return;
  function node(cx,cy,w,h,color,label,sub,chip){
    var x=cx-w/2,y=cy-h/2;
    svg.appendChild(mk('rect',{x:x,y:y,width:w,height:h,rx:11,fill:'#101626',stroke:color,'stroke-width':1.6}));
    var t1=mk('text',{x:cx,y:cy-3,'text-anchor':'middle','font-family':'IBM Plex Mono, monospace','font-size':13,'font-weight':700,fill:color});t1.textContent=label;svg.appendChild(t1);
    var t2=mk('text',{x:cx,y:cy+14,'text-anchor':'middle','font-family':'IBM Plex Mono, monospace','font-size':10,fill:'#7E88A4'});t2.textContent=sub;svg.appendChild(t2);
    svg.appendChild(mk('rect',{x:cx+w/2-34,y:y-12,width:34,height:16,rx:8,fill:'#161E32',stroke:'rgba(140,160,205,0.26)','stroke-width':1}));
    var tv=mk('text',{x:cx+w/2-17,y:y+0,'text-anchor':'middle','font-family':'IBM Plex Mono, monospace','font-size':8.5,'font-weight':700,fill:'#7E88A4'});tv.textContent=chip;svg.appendChild(tv);
  }
  function edge(x1,x2,cy){
    svg.appendChild(mk('path',{d:'M'+x1+' '+cy+' L'+x2+' '+cy,stroke:'rgba(140,160,205,0.42)','stroke-width':1.5,'stroke-dasharray':'4 4',fill:'none'}));
    svg.appendChild(mk('path',{d:'M'+(x2-7)+' '+(cy-4)+' L'+x2+' '+cy+' L'+(x2-7)+' '+(cy+4),stroke:'rgba(140,160,205,0.6)','stroke-width':1.5,fill:'none'}));
    var tl=mk('text',{x:(x1+x2)/2,y:cy-9,'text-anchor':'middle','font-family':'IBM Plex Mono, monospace','font-size':8.5,fill:'#565F79'});tl.textContent='tracks';svg.appendChild(tl);
  }
  var cy=142,w=124,h=54;
  var xs=[92,278,462,636,788];
  edge(xs[0]+w/2,xs[1]-w/2,cy);
  edge(xs[1]+w/2,xs[2]-w/2,cy);
  edge(xs[2]+w/2,xs[3]-w/2,cy);
  edge(xs[3]+w/2,xs[4]-w/2,cy);
  node(xs[0],cy,w,h,'#C74FE6','signal','count()','v3');
  node(xs[1],cy,w,h,'#A78BFA','computed','doubled()','↺ c2');
  node(xs[2],cy,w,h,'#7C9CFF','computed','label()','↺ c2');
  node(xs[3],cy,w,h,'#E8B341','effect','log(label)','e1');
  node(xs[4],cy,w,h,'#56C7FF','DOM','render','paint');
  var top=mk('text',{x:xs[0],y:66,'text-anchor':'middle','font-family':'IBM Plex Mono, monospace','font-size':10,'letter-spacing':'1','fill':'#565F79'});top.textContent='WRITE';svg.appendChild(top);
  var mid=mk('text',{x:(xs[1]+xs[2])/2,y:66,'text-anchor':'middle','font-family':'IBM Plex Mono, monospace','font-size':10,'letter-spacing':'1','fill':'#565F79'});mid.textContent='PULL · LAZY';svg.appendChild(mid);
  var rgt=mk('text',{x:(xs[3]+xs[4])/2,y:66,'text-anchor':'middle','font-family':'IBM Plex Mono, monospace','font-size':10,'letter-spacing':'1','fill':'#565F79'});rgt.textContent='FLUSH';svg.appendChild(rgt);
  var dot=mk('circle',{r:4.5,fill:'#C74FE6',opacity:'0.95'});
  if(!REDUCED){var am=mk('animateMotion',{dur:'3.2s',repeatCount:'indefinite',path:'M'+(xs[0]+w/2)+' '+cy+' L'+(xs[4]-w/2)+' '+cy});dot.appendChild(am);}else{dot.setAttribute('cx',xs[0]+w/2+10);dot.setAttribute('cy',cy);}
  svg.appendChild(dot);
})();
(function(){
  var lab=byId('signalDeepLab');if(!lab)return;
  var count={version:1,value:1};
  var doubled={dirty:false,computes:1,value:2};
  var label={dirty:false,computes:1,value:'badge ×2'};
  var effect={pending:false,runs:1};
  var log=byId('sdLog');
  function paint(){
    byId('sdVer').textContent='v'+count.version;
    byId('sdCountVal').textContent=count.value;
    byId('sdDoubledVal').textContent=doubled.value;
    setState(byId('sdDoubledState'),doubled.dirty?'DIRTY':'CLEAN','state '+(doubled.dirty?'dirty':'clean'));
    byId('sdDoubledRc').textContent='computed ×'+doubled.computes;
    byId('sdLabelVal').textContent=label.value;
    setState(byId('sdLabelState'),label.dirty?'DIRTY':'CLEAN','state '+(label.dirty?'dirty':'clean'));
    byId('sdLabelRc').textContent='computed ×'+label.computes;
    setState(byId('sdEffectState'),effect.pending?'PENDING':'IDLE','state '+(effect.pending?'pending':'clean'));
    byId('sdEffectRc').textContent='ran ×'+effect.runs;
  }
  function pulse(id){var n=byId(id);n.classList.add('pulse');setTimeout(function(){n.classList.remove('pulse');},450);}
  function readDoubled(){ if(doubled.dirty){doubled.value=count.value*2;doubled.computes++;doubled.dirty=false;addLog(log,'pull doubled() → recompute = '+doubled.value+' (×'+doubled.computes+')','pull');pulse('sdDoubled');} else {addLog(log,'read doubled() → cached '+doubled.value+' (no recompute)','pull');} }
  function readLabel(){ if(label.dirty){ if(doubled.dirty){readDoubled();} label.value='badge ×'+doubled.value;label.computes++;label.dirty=false;addLog(log,'pull label() → recompute "'+label.value+'" (×'+label.computes+')','pull');pulse('sdLabel'); } else {addLog(log,'read label() → cached "'+label.value+'" (no recompute)','pull');} }
  byId('sdInc').addEventListener('click',function(){
    count.value++;count.version++;doubled.dirty=true;label.dirty=true;effect.pending=true;
    addLog(log,'write count.set('+count.value+') → v'+count.version+' · marked doubled, label DIRTY (recomputed nothing)','write');
    pulse('sdCount');paint();
  });
  byId('sdReadD').addEventListener('click',function(){readDoubled();paint();});
  byId('sdReadL').addEventListener('click',function(){readLabel();paint();});
  byId('sdFlush').addEventListener('click',function(){
    if(effect.pending){ if(label.dirty)readLabel(); effect.runs++;effect.pending=false; addLog(log,'flush → effect ran: log("'+label.value+'") (×'+effect.runs+')','up'); pulse('sdEffect'); }
    else { addLog(log,'flush → no effects pending (nothing scheduled)','up'); }
    paint();
  });
  byId('sdReset').addEventListener('click',function(){
    count={version:1,value:1};doubled={dirty:false,computes:1,value:2};label={dirty:false,computes:1,value:'badge ×2'};effect={pending:false,runs:1};
    log.innerHTML='';addLog(log,'reset · graph pulled once — computeds ×1, effect ran ×1','pull');paint();
  });
  addLog(log,'init · graph pulled once — computeds ×1, effect ran ×1','pull');
  paint();
})();
(function(){
  var lab=byId('resourceLab');if(!lab)return;
  var DATA={'4C92':{clicks:812,dest:'acme.com/launch'},'launch':{clicks:407,dest:'acme.com/promo'}};
  var server='healthy',status='idle',timer=null,reqId=0,curCode=null;
  var pill=byId('rqPill'),reqEl=byId('rqReq'),valEl=byId('rqValue'),log=byId('rqLog');
  function paintPill(){pill.textContent=status.toUpperCase();pill.className='rq-pill '+status;}
  function paintVal(){
    if(status==='idle'){valEl.innerHTML='<span class="rv-empty">link.value() is undefined — nothing requested yet</span>';}
    else if(status==='loading'){valEl.innerHTML='<span class="rv-empty">loading… value() is undefined</span>';}
    else if(status==='error'){valEl.textContent='error() = HttpErrorResponse 500 — loader threw';}
    else {var d=DATA[curCode];valEl.textContent='value() = { code: "'+curCode+'", clicks: '+d.clicks+', dest: "'+d.dest+'" }';}
  }
  function load(code){
    if(timer){clearTimeout(timer);timer=null;addLog(log,'request("'+curCode+'") aborted — a newer request superseded it','down');}
    curCode=code;reqId++;var my=reqId;status='loading';reqEl.textContent=code;paintPill();paintVal();
    addLog(log,'request changed → { code: "'+code+'" } · status = loading','up');
    timer=setTimeout(function(){
      if(my!==reqId)return;timer=null;
      if(server==='failing'){status='error';addLog(log,'loader rejected → status = error','write');}
      else {status='resolved';addLog(log,'loader resolved → value() ready · status = resolved','pull');}
      paintPill();paintVal();
    },700);
  }
  byId('rqLoad').addEventListener('click',function(){load('4C92');});
  byId('rqChange').addEventListener('click',function(){load('launch');});
  byId('rqFail').addEventListener('click',function(){
    server=(server==='healthy')?'failing':'healthy';
    this.textContent='server: '+server;
    addLog(log,'server toggled → '+server,'write');
  });
  byId('rqReset').addEventListener('click',function(){
    if(timer){clearTimeout(timer);timer=null;}
    server='healthy';status='idle';reqId++;curCode=null;reqEl.textContent='—';
    byId('rqFail').textContent='server: healthy';
    log.innerHTML='';paintPill();paintVal();addLog(log,'reset · status = idle','down');
  });
  paintPill();paintVal();
})();
(function(){
  var lab=byId('flatteningLab');if(!lab)return;
  var lanes={merge:byId('hoMerge'),concat:byId('hoConcat'),exhaust:byId('hoExhaust'),sw:byId('hoSwitch')};
  var status=byId('hoStatus'),timers=[];
  function later(fn,ms){timers.push(setTimeout(fn,ms));}
  function chip(lane,label,cls){var s=document.createElement('span');s.className='ho-chip '+cls;s.textContent=label;lanes[lane].appendChild(s);return s;}
  function set(c,cls){c.className='ho-chip '+cls;}
  function clearLanes(){timers.forEach(clearTimeout);timers=[];for(var k in lanes)lanes[k].innerHTML='';}
  byId('hoFire').addEventListener('click',function(){
    clearLanes();status.textContent='three rapid clicks fired into all four operators…';status.className='stateline';
    var m=[chip('merge','#1','run'),chip('merge','#2','run'),chip('merge','#3','run')];
    later(function(){m.forEach(function(c){set(c,'done');});},520);
    var c1=chip('concat','#1','run'),c2=chip('concat','#2','queue'),c3=chip('concat','#3','queue');
    later(function(){set(c1,'done');set(c2,'run');},420);
    later(function(){set(c2,'done');set(c3,'run');},720);
    later(function(){set(c3,'done');},1000);
    var e1=chip('exhaust','#1','run'),e2=chip('exhaust','#2','ignore'),e3=chip('exhaust','#3','ignore');
    later(function(){set(e1,'done');},520);
    var s1=chip('sw','#1','run'),s2=chip('sw','#2','run'),s3=chip('sw','#3','run');
    later(function(){set(s1,'cancel');},140);
    later(function(){set(s2,'cancel');},240);
    later(function(){set(s3,'done');},520);
    later(function(){status.textContent='merge: 3 done · concat: 3 done (in order) · exhaust: 1 done, 2 ignored · switch: 1 done, 2 cancelled';status.className='stateline good';},1060);
  });
  byId('hoReset').addEventListener('click',function(){clearLanes();status.textContent='fire the clicks and compare — same input, four outcomes';status.className='stateline';});
})();
(function(){
  var lab=byId('multicastLab');if(!lab)return;
  var coldExec=0,sharedExec=0,coldN=0,sharedN=0;
  var ce=byId('mxColdExec'),se=byId('mxSharedExec'),cs=byId('mxColdSubs'),ss=byId('mxSharedSubs'),status=byId('mxStatus');
  function sub(box,label,async){var s=document.createElement('span');s.className='mx-sub'+(async?' async':'');s.textContent=label;box.appendChild(s);}
  byId('mxAddCold').addEventListener('click',function(){
    coldN++;coldExec++;ce.textContent=coldExec;sub(cs,'sub'+coldN,coldN===3);
    status.textContent='cold subscriber #'+coldN+' → producer ran again (execution '+coldExec+')';status.className='stateline';
  });
  byId('mxAddShared').addEventListener('click',function(){
    sharedN++;if(sharedN===1){sharedExec=1;}se.textContent=sharedExec;sub(ss,'sub'+sharedN,sharedN===3);
    status.textContent=sharedN===1?'first shared subscriber → producer ran once':'shared subscriber #'+sharedN+' → joined the single execution (still '+sharedExec+')';
    status.className='stateline'+(sharedN>1?' good':'');
  });
  byId('mxReset').addEventListener('click',function(){
    coldExec=sharedExec=coldN=sharedN=0;ce.textContent='0';se.textContent='0';cs.innerHTML='';ss.innerHTML='';
    status.textContent='each cold subscription is another HTTP request — each shared one just joins the first';status.className='stateline';
  });
})();
(function(){
  var lab=byId('injectorLab');if(!lab)return;
  var cbRoot=byId('ijRoot'),cbParent=byId('ijParent'),cbChild=byId('ijChild'),modSel=byId('ijMod');
  var result=byId('ijResult'),log=byId('ijLog');
  var N={root:{el:byId('ijNodeRoot'),prov:byId('ijProvRoot'),val:'root',name:'root'},
         parent:{el:byId('ijNodeParent'),prov:byId('ijProvParent'),val:'dashboard',name:'Dashboard'},
         child:{el:byId('ijNodeChild'),prov:byId('ijProvChild'),val:'editor',name:'LinkEditor'}};
  function provides(k){return (k==='root'?cbRoot:k==='parent'?cbParent:cbChild).checked;}
  function syncProv(){
    ['root','parent','child'].forEach(function(k){
      var on=provides(k);N[k].prov.className='ij-prov'+(on?'':' off');
      N[k].el.classList.toggle('provides',on);
    });
  }
  function clearWalk(){['root','parent','child'].forEach(function(k){N[k].el.classList.remove('walk','answer','skip');});}
  function resolve(){
    clearWalk();var mod=modSel.value,order,skip=[];
    if(mod==='self'){order=['child'];skip=['parent','root'];}
    else if(mod==='skipSelf'){order=['parent','root'];skip=['child'];}
    else if(mod==='host'){order=['child','parent'];skip=['root'];}
    else {order=['child','parent','root'];}
    addLog(log,'inject(Cfg'+(mod==='none'?'':', { '+mod+': true }')+') from LinkEditor','down');
    skip.forEach(function(k){N[k].el.classList.add('skip');});
    var ans=null;
    for(var i=0;i<order.length;i++){var k=order[i];N[k].el.classList.add('walk');addLog(log,'· visit '+N[k].name+(provides(k)?' — provides Cfg ✓':' — no provider, climb'),'up');if(provides(k)){ans=k;break;}}
    if(ans){N[ans].el.classList.remove('walk');N[ans].el.classList.add('answer');
      result.textContent="Cfg = '"+N[ans].val+"'  ·  answered by "+N[ans].name;result.className='ij-result ok';
      addLog(log,'resolved → '+N[ans].val,'pull');
    } else if(mod==='optional'){
      result.textContent='Cfg = null  ·  @Optional swallowed the miss';result.className='ij-result';
      addLog(log,'no provider in walk → returned null (optional)','down');
    } else {
      result.textContent='NullInjectorError: No provider for Cfg';result.className='ij-result err';
      addLog(log,'no provider in walk → threw NullInjectorError','write');
    }
  }
  [cbRoot,cbParent,cbChild].forEach(function(c){c.addEventListener('change',syncProv);});
  byId('ijResolve').addEventListener('click',resolve);
  byId('ijReset').addEventListener('click',function(){
    cbRoot.checked=true;cbParent.checked=true;cbChild.checked=false;modSel.value='none';
    clearWalk();syncProv();result.textContent='pick providers and a modifier, then resolve';result.className='ij-result';log.innerHTML='';
  });
  syncProv();
})();
(function(){
  var lab=byId('ctickLab');if(!lab)return;
  var K=['app','dashA','leafA','dashB','leafB'];
  var EL={app:byId('ctApp'),dashA:byId('ctDashA'),leafA:byId('ctLeafA'),dashB:byId('ctDashB'),leafB:byId('ctLeafB')};
  var refreshed={app:0,dashA:0,leafA:0,dashB:0,leafB:0},dirty={},ticks=0;
  var pathA=['app','dashA','leafA'],pathB=['app','dashB','leafB'];
  var status=byId('ctStatus'),ticksEl=byId('ctTicks'),refEl=byId('ctRefreshed');
  function cc(k){EL[k].querySelector('.cc').textContent='refreshed ×'+refreshed[k];}
  function mark(path,name){
    path.forEach(function(k){dirty[k]=true;EL[k].classList.add('dirty');EL[k].classList.remove('refresh');});
    status.textContent=name+' changed — dirty flag climbed to App. Nothing refreshed yet.';status.className='stateline';
  }
  byId('ctSignalA').addEventListener('click',function(){mark(pathA,'LeafA');});
  byId('ctSignalB').addEventListener('click',function(){mark(pathB,'LeafB');});
  byId('ctTick').addEventListener('click',function(){
    ticks++;ticksEl.textContent=ticks;var n=0;
    K.forEach(function(k){if(dirty[k]){refreshed[k]++;cc(k);EL[k].classList.remove('dirty');EL[k].classList.add('refresh');n++;}});
    dirty={};refEl.textContent=n;
    status.textContent=n===0?('tick #'+ticks+' — nothing dirty, walked and refreshed 0'):('tick #'+ticks+' — one downward pass refreshed '+n+' view'+(n>1?'s':'')+' (the dirty path)');
    status.className='stateline'+(n>0?' good':'');
  });
  byId('ctReset').addEventListener('click',function(){
    refreshed={app:0,dashA:0,leafA:0,dashB:0,leafB:0};dirty={};ticks=0;ticksEl.textContent='0';refEl.textContent='0';
    K.forEach(function(k){EL[k].classList.remove('dirty','refresh');cc(k);});
    status.textContent='mark a leaf, then schedule a tick';status.className='stateline';
  });
})();
(function(){
  var lab=byId('viewApiLab');if(!lab)return;
  var vcr=[],nextId=1;
  var views=byId('vaViews'),lenEl=byId('vaLen');
  function render(freshIdx){
    if(vcr.length===0){views.innerHTML='<div class="va-empty">the ViewContainerRef is empty — createEmbeddedView() to fill it</div>';}
    else{var html='';for(var i=0;i<vcr.length;i++){html+='<div class="va-view'+(i===freshIdx?' fresh':'')+'"><span>&lt;row/&gt; · embedded view #'+vcr[i].n+'</span><span class="vv-idx">index '+i+'</span></div>';}views.innerHTML=html;}
    lenEl.textContent='vcr.length = '+vcr.length;
  }
  byId('vaCreate').addEventListener('click',function(){vcr.push({n:nextId++});render(vcr.length-1);});
  byId('vaInsertTop').addEventListener('click',function(){vcr.unshift({n:nextId++});render(0);});
  byId('vaMove').addEventListener('click',function(){if(vcr.length>=2){var f=vcr.shift();vcr.push(f);render(vcr.length-1);}else render(-1);});
  byId('vaRemove').addEventListener('click',function(){if(vcr.length){vcr.shift();}render(-1);});
  byId('vaClear').addEventListener('click',function(){vcr=[];render(-1);});
  byId('vaReset').addEventListener('click',function(){vcr=[];nextId=1;render(-1);});
  render(-1);
})();
(function(){
  var lab=byId('cvaLab');if(!lab)return;
  var value=null,dirty=false,touched=false,disabled=false;
  var seg=byId('cvaSeg'),opts=seg.querySelectorAll('.cva-opt'),log=byId('cvaLog');
  function flag(el,on,tt,ff){el.textContent=on?tt:ff;el.className='cva-flag '+(on?'t':'f');}
  function paint(){
    byId('cvaValue').textContent=(value===null)?'null':value;
    flag(byId('cvaValid'),value!==null,'VALID','INVALID');
    flag(byId('cvaDirty'),dirty,'true','false');
    flag(byId('cvaTouched'),touched,'true','false');
    for(var i=0;i<opts.length;i++){opts[i].classList.toggle('on',opts[i].getAttribute('data-val')===value);opts[i].disabled=disabled;}
  }
  seg.addEventListener('click',function(e){
    var b=e.target.closest('.cva-opt');if(!b||disabled)return;
    var v=b.getAttribute('data-val');value=v;dirty=true;touched=true;
    addLog(log,"user picked → onChange('"+v+"') · value set · dirty=true · touched=true",'up');paint();
  });
  byId('cvaPatch').addEventListener('click',function(){
    value='paused';addLog(log,"patchValue('paused') → writeValue('paused') · value set · dirty UNCHANGED",'down');paint();
  });
  byId('cvaDisable').addEventListener('click',function(){
    disabled=!disabled;this.textContent=disabled?'enable':'disable';
    addLog(log,'setDisabledState('+disabled+') → control '+(disabled?'disabled':'enabled'),'write');paint();
  });
  byId('cvaReset').addEventListener('click',function(){
    value=null;dirty=false;touched=false;disabled=false;byId('cvaDisable').textContent='disable';log.innerHTML='';
    addLog(log,'reset · pristine, untouched, invalid (required)','down');paint();
  });
  addLog(log,'init · value=null → INVALID (required) · pristine · untouched','down');paint();
})();
(function(){
  var lab=byId('compileLab');if(!lab)return;
  var state='placeholder',prefetched=false,timer=null;
  var block=byId('cpBlock'),stateEl=byId('cpState'),body=byId('cpBody'),trigSel=byId('cpTrigger'),log=byId('cpLog');
  function paint(){
    block.className='cp-block '+state;
    stateEl.textContent='@'+state;
    if(state==='placeholder')body.textContent='<chart-skeleton/> — the real chart hasn\u2019t been downloaded yet';
    else if(state==='loading')body.textContent='streaming chart.chunk.js …';
    else body.textContent='<analytics-chart [data]="stats()"/> rendered';
  }
  byId('cpPrefetch').addEventListener('click',function(){
    prefetched=!prefetched;this.textContent='prefetch: '+(prefetched?'on':'off');
    if(prefetched)addLog(log,'prefetch on idle → downloaded chart.chunk.js (48 kB) in the background','up');
    else addLog(log,'prefetch off','down');
  });
  byId('cpFire').addEventListener('click',function(){
    if(state!=='placeholder')return;
    if(timer)clearTimeout(timer);
    addLog(log,'trigger fired: on '+trigSel.value,'write');
    state='loading';paint();
    var ms=prefetched?180:640;
    if(prefetched)addLog(log,'chunk already in cache — swapping in immediately','pull');
    timer=setTimeout(function(){state='loaded';paint();addLog(log,'loaded chart.chunk.js → <analytics-chart/> hydrated','pull');},ms);
  });
  byId('cpReset').addEventListener('click',function(){
    if(timer)clearTimeout(timer);state='placeholder';prefetched=false;byId('cpPrefetch').textContent='prefetch: off';
    log.innerHTML='';paint();addLog(log,'reset · @placeholder','down');
  });
  paint();
})();
(function(){
  var lab=byId('storeLab');if(!lab)return;
  var INIT=[{code:'4C92',clicks:812,paid:true},{code:'launch',clicks:407,paid:false},{code:'docs',clicks:203,paid:true}];
  var POOL=[{code:'promo',clicks:100,paid:false},{code:'sale',clicks:250,paid:true},{code:'blog',clicks:64,paid:false},{code:'ref',clicks:180,paid:true}];
  var state,ver,memo,pi,log=byId('sxLog');
  function fresh(){state={links:INIT.map(function(l){return{code:l.code,clicks:l.clicks,paid:l.paid};}),filter:'all'};ver={links:0,filter:0};memo={vis:{lv:-1,fv:-1,rc:0,val:[]},tot:{lv:-1,rc:0,val:0},cnt:{lv:-1,fv:-1,rc:0,val:0}};pi=0;}
  function byFilter(l){return state.filter==='all'?true:l.paid;}
  function visible(){if(memo.vis.lv!==ver.links||memo.vis.fv!==ver.filter){memo.vis.val=state.links.filter(byFilter);memo.vis.rc++;memo.vis.lv=ver.links;memo.vis.fv=ver.filter;memo.vis.did=true;}else memo.vis.did=false;return memo.vis.val;}
  function total(){if(memo.tot.lv!==ver.links){memo.tot.val=state.links.reduce(function(a,l){return a+l.clicks;},0);memo.tot.rc++;memo.tot.lv=ver.links;memo.tot.did=true;}else memo.tot.did=false;return memo.tot.val;}
  function count(){if(memo.cnt.lv!==ver.links||memo.cnt.fv!==ver.filter){memo.cnt.val=state.links.filter(byFilter).length;memo.cnt.rc++;memo.cnt.lv=ver.links;memo.cnt.fv=ver.filter;memo.cnt.did=true;}else memo.cnt.did=false;return memo.cnt.val;}
  function jnum(n){return '<span class="jn">'+n+'</span>';}
  function jstr(s){return '<span class="js">"'+s+'"</span>';}
  function jkey(k){return '<span class="jk">'+k+'</span>';}
  function renderJson(){
    var rows=state.links.map(function(l){return '    { '+jkey('code')+': '+jstr(l.code)+', '+jkey('clicks')+': '+jnum(l.clicks)+', '+jkey('paid')+': '+jnum(l.paid)+' }';}).join(',\n');
    byId('sxStateJson').innerHTML='{\n  '+jkey('links')+': [\n'+(rows||'')+(rows?'\n':'')+'  ],\n  '+jkey('filter')+': '+jstr(state.filter)+'\n}';
  }
  function flash(el){el.classList.add('flash');setTimeout(function(){el.classList.remove('flash');},520);}
  function pulseSel(el){el.classList.add('pulse');setTimeout(function(){el.classList.remove('pulse');},520);}
  function refresh(){
    var v=visible(),t=total(),c=count();
    byId('sxVisibleVal').textContent=v.length;byId('sxVisibleRc').textContent='computed ×'+memo.vis.rc;
    byId('sxTotalVal').textContent=t.toLocaleString();byId('sxTotalRc').textContent='computed ×'+memo.tot.rc;
    byId('sxCountVal').textContent=c;byId('sxCountRc').textContent='computed ×'+memo.cnt.rc;
    byId('sxStatsText').textContent=t.toLocaleString()+' total clicks';
    byId('sxListText').textContent=v.length+' links shown';
    byId('sxFilterText').textContent='filter: '+state.filter;
    if(memo.vis.did){pulseSel(byId('sxVisible'));flash(byId('sxListView'));}
    if(memo.tot.did){pulseSel(byId('sxTotal'));flash(byId('sxStatsView'));}
    if(memo.cnt.did)pulseSel(byId('sxCount'));
    renderJson();
  }
  function initPaint(){var v=visible(),t=total(),c=count();
    byId('sxVisibleVal').textContent=v.length;byId('sxVisibleRc').textContent='computed ×'+memo.vis.rc;
    byId('sxTotalVal').textContent=t.toLocaleString();byId('sxTotalRc').textContent='computed ×'+memo.tot.rc;
    byId('sxCountVal').textContent=c;byId('sxCountRc').textContent='computed ×'+memo.cnt.rc;
    byId('sxStatsText').textContent=t.toLocaleString()+' total clicks';byId('sxListText').textContent=v.length+' links shown';byId('sxFilterText').textContent='filter: '+state.filter;renderJson();}
  byId('sxAdd').addEventListener('click',function(){
    var l=POOL[pi%POOL.length];pi++;state.links.push({code:l.code,clicks:l.clicks,paid:l.paid});ver.links++;
    addLog(log,"addLink('"+l.code+"') → patchState({ links: [...] })",'up');refresh();
    var f=byId('sxFilterView');f.classList.remove('flash');
  });
  byId('sxFilterBtn').addEventListener('click',function(){
    state.filter=(state.filter==='paid')?'all':'paid';ver.filter++;this.textContent="setFilter('"+(state.filter==='paid'?'all':'paid')+"')";
    addLog(log,"setFilter('"+state.filter+"') → patchState({ filter }) · total() ignores filter",'up');refresh();flash(byId('sxFilterView'));
  });
  byId('sxClear').addEventListener('click',function(){state.links=[];ver.links++;addLog(log,'clear → patchState({ links: [] })','write');refresh();});
  byId('sxReset').addEventListener('click',function(){fresh();byId('sxFilterBtn').textContent="setFilter('paid')";log.innerHTML='';addLog(log,'reset · selectors pulled once (×1)','down');initPaint();});
  fresh();addLog(log,'init · selectors pulled once (×1)','down');initPaint();
})();
var navEl=byId('nav'),scrimEl=byId('scrim'),menuBtn=byId('menuBtn'),progressEl=byId('progress');
var navLinks=Array.prototype.slice.call(document.querySelectorAll('.nav a.module'));
var secsEl=Array.prototype.slice.call(document.querySelectorAll('.module-sec'));
function closeNav(){navEl&&navEl.classList.remove('open');scrimEl&&scrimEl.classList.remove('show');}
function openNav(){navEl&&navEl.classList.add('open');scrimEl&&scrimEl.classList.add('show');}
menuBtn&&menuBtn.addEventListener('click',openNav);
scrimEl&&scrimEl.addEventListener('click',closeNav);
navLinks.forEach(function(a){a.addEventListener('click',closeNav);});
function onScroll(){
  var y=window.scrollY||window.pageYOffset,h=document.documentElement.scrollHeight-window.innerHeight;
  if(progressEl)progressEl.style.width=(h>0?(y/h*100):0)+'%';
  var cur=secsEl.length?secsEl[0]:null;
  secsEl.forEach(function(s){if(s.getBoundingClientRect().top<=140)cur=s;});
  if(cur)navLinks.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+cur.id);});
}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',onScroll);
onScroll();
})();
