(function(){
"use strict";
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function byId(id){return document.getElementById(id);}
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];});}
var C={acc:'#ED6E9E',route:'#56C7FF',form:'#4ED66B',rx:'#7C9CFF',di:'#A78BFA',sig:'#2DD4BF',cli:'#E8B341',ink:'#E8ECF8',soft:'#B7C0D8',mut:'#7E88A4',faint:'#565F79'};
function svgText(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill||C.mut,'font-size':size||12,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function addLog(box,html,cls){var d=el('div','lg'+(cls?' '+cls:''),html);box.appendChild(d);setTimeout(function(){d.classList.add('show');},reduceMotion?0:20);box.scrollTop=box.scrollHeight;return d;}
function flashCls(node,cls,ms){node.classList.add(cls);setTimeout(function(){node.classList.remove(cls);},reduceMotion?0:(ms||300));}

var nav=byId('nav'),scrim=byId('scrim'),menuBtn=byId('menuBtn');
function closeNav(){nav.classList.remove('open');scrim.classList.remove('show');}
if(menuBtn)menuBtn.addEventListener('click',function(){nav.classList.add('open');scrim.classList.add('show');});
if(scrim)scrim.addEventListener('click',closeNav);
nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeNav);});
var progress=byId('progress');
var sections=[].slice.call(document.querySelectorAll('.module-sec'));
var navLinks=[].slice.call(document.querySelectorAll('.nav a.module'));
function onScroll(){
  var h=document.documentElement;
  progress.style.width=Math.max(0,Math.min(1,h.scrollTop/(h.scrollHeight-h.clientHeight)))*100+'%';
  var pos=window.scrollY+140,cur=sections[0];
  sections.forEach(function(s){if(s.offsetTop<=pos)cur=s;});
  navLinks.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+(cur&&cur.id));});
}
window.addEventListener('scroll',onScroll,{passive:true});

(function hero(){
  var svg=byId('heroSvg');if(!svg)return;
  var cx=430,cy=152,rx=300,ry=100;
  var sats=[['Router',C.route,-90],['Forms',C.form,-30],['HttpClient',C.rx,30],['DI',C.di,90],['Signals',C.sig,150],['CLI',C.cli,210]];
  function pos(deg){var th=deg*Math.PI/180;return {x:cx+rx*Math.cos(th),y:cy+ry*Math.sin(th)};}
  sats.forEach(function(s){
    var p=pos(s[2]);
    var ix=cx+(p.x-cx)*0.24, iy=cy+(p.y-cy)*0.34;
    var ox=cx+(p.x-cx)*0.82, oy=cy+(p.y-cy)*0.82;
    svg.appendChild(mk('line',{x1:ix,y1:iy,x2:ox,y2:oy,stroke:'rgba(140,160,205,0.28)','stroke-width':1.2,'stroke-dasharray':'3 4'}));
  });
  svg.appendChild(mk('path',{d:'M430 104 L468 119 L462 178 L430 198 L398 178 L392 119 Z',fill:'rgba(237,110,158,0.07)',stroke:C.acc,'stroke-width':2,'stroke-linejoin':'round'}));
  svg.appendChild(mk('path',{d:'M430 122 L413 172 M430 122 L447 172 M419 157 H441',fill:'none',stroke:C.acc,'stroke-width':2,'stroke-linecap':'round'}));
  sats.forEach(function(s){
    var p=pos(s[2]),w=s[0].length*7.6+26;
    svg.appendChild(mk('rect',{x:p.x-w/2,y:p.y-15,width:w,height:30,rx:15,fill:'rgba(10,14,26,0.92)',stroke:s[1],'stroke-width':1.5}));
    svg.appendChild(svgText(p.x,p.y+4.5,s[0],s[1],12,'middle','700'));
  });
  var path='M'+(cx-rx)+' '+cy+' A'+rx+' '+ry+' 0 1 1 '+(cx+rx)+' '+cy+' A'+rx+' '+ry+' 0 1 1 '+(cx-rx)+' '+cy;
  if(!reduceMotion){
    var tok=mk('circle',{r:5.5,fill:C.acc});
    tok.appendChild(mk('animateMotion',{dur:'8s',repeatCount:'indefinite',path:path}));
    svg.appendChild(tok);
  } else {var p0=pos(-90);svg.appendChild(mk('circle',{cx:p0.x,cy:p0.y,r:5.5,fill:C.acc}));}
})();

(function bindLab(){
  var i1=byId('bInput');if(!i1)return;
  var i2=byId('bTwoWay'),interp=byId('bInterp'),modelChip=byId('bModel'),btn=byId('bBtn'),clicks=byId('bClicks'),status=byId('bStatus');
  var m={code:'',saves:0};
  function fire(rowId,lineId){flashCls(byId(rowId),'fire');if(lineId){var l=byId(lineId);l.classList.add('on');setTimeout(function(){l.classList.remove('on');},reduceMotion?0:420);}}
  function render(src){
    if(src!==i1)i1.value=m.code;
    if(src!==i2)i2.value=m.code;
    interp.textContent='snip.ly/'+(m.code||'—');
    modelChip.textContent='"'+m.code+'"';
    btn.disabled=!m.code;
    clicks.textContent=m.saves;
    fire('brInterp');fire('brProp');
  }
  function setCode(v,src,rowId){
    m.code=v;fire(rowId,'bc1');render(src);
    status.className='stateline';
    status.innerHTML='model.code = <b>"'+esc(v)+'"</b> — one write, every binding re-read it';
  }
  i1.addEventListener('input',function(){setCode(i1.value,i1,'brTwo');});
  i2.addEventListener('input',function(){setCode(i2.value,i2,'brTwo2');});
  btn.addEventListener('click',function(){m.saves++;fire('brEvent','bc3');render(null);status.className='stateline good';status.innerHTML='(click) → save() ran in the class — saves = <b>'+m.saves+'</b>';});
  byId('bReset').addEventListener('click',function(){m={code:'',saves:0};render(null);status.className='stateline';status.textContent='type in either input — one model, two views of it, four wires';});
  render(null);
})();

(function tplLab(){
  var view=byId('tpView');if(!view)return;
  var fSel=byId('tpFilter'),sSel=byId('tpStatus'),line=byId('tpStatusLine'),foot=byId('tpFoot');
  var links=[{code:'4C92',clicks:12481,paid:true},{code:'launch',clicks:407,paid:false},{code:'docs',clicks:203,paid:true}];
  var branches=['brIf','brFor','brSw','brLive','brPaused','brExpired','brElse'];
  function render(){
    var f=fSel.value,st=sSel.value;
    var vis=f==='all'?links:(f==='paid'?links.filter(function(l){return l.paid;}):[]);
    branches.forEach(function(b){byId(b).classList.remove('on');});
    if(vis.length){
      byId('brIf').classList.add('on');byId('brFor').classList.add('on');byId('brSw').classList.add('on');
      byId(st==='live'?'brLive':(st==='paused'?'brPaused':'brExpired')).classList.add('on');
      view.innerHTML=vis.map(function(l){
        var badge=l.code==='4C92'?st:'live';
        return '<div class="tp-row"><span>snip.ly/'+l.code+'</span><span class="meta">'+l.clicks.toLocaleString('en-US')+' clicks</span><span class="tp-badge '+badge+'">'+badge+'</span></div>';
      }).join('');
      line.className='stateline';
      line.innerHTML='@for rendered <b>'+vis.length+'</b> rows, tracked by <code class="tok">l.code</code> · 4C92\u2019s @switch took the <b>'+st+'</b> case';
    } else {
      byId('brElse').classList.add('on');
      view.innerHTML='<div class="tp-empty" id="tpEmpty">no links match — create one</div>';
      line.className='stateline';
      line.innerHTML='visible() is empty → the <b>@else</b> branch rendered instead';
    }
  }
  fSel.addEventListener('change',render);
  sSel.addEventListener('change',render);
  byId('tpReset').addEventListener('click',function(){fSel.value='all';sSel.value='live';render();foot.innerHTML='The template is a function of state too: change the inputs and different branches render. <code class="tok">track l.code</code> is the keys lesson from the front-end course, now enforced by the compiler.';});
  render();
})();

(function signalLab(){
  var log=byId('sgLog');if(!log)return;
  var foot=byId('sgFoot');
  var st,rc;
  var NODE={links:'ndLinks',filter:'ndFilter',theme:'ndTheme',visible:'ndVisible',count:'ndCount',effect:'ndEffect',themeEff:'ndThemeEff'};
  function init(){st={links:[{c:'4C92',p:true},{c:'launch',p:false},{c:'docs',p:true}],filter:'all',theme:'dark'};rc={links:1,filter:1,theme:1,visible:1,count:1,effect:1,themeEff:1};}
  function vis(){return st.links.filter(function(l){return st.filter==='all'||l.p;});}
  function paintVals(){
    byId('vLinks').textContent=st.links.length+' links ['+st.links.map(function(l){return l.c;}).join(', ')+']';
    byId('vFilter').textContent='\''+st.filter+'\'';
    byId('vTheme').textContent='\''+st.theme+'\'';
    byId('vVisible').textContent=vis().length+' links shown';
    byId('vCount').textContent=String(vis().length);
  }
  function paintRc(k){var n=byId(NODE[k]);n.querySelector('.rc').textContent='×'+rc[k];}
  function bump(k){rc[k]++;paintRc(k);flashCls(byId(NODE[k]),'pulse',380);}
  byId('sgAdd').addEventListener('click',function(){
    var name=st.links.length===3?'promo':'new-'+(st.links.length-2);
    st.links=st.links.concat([{c:name,p:false}]);
    bump('links');bump('visible');bump('count');bump('effect');
    paintVals();
    addLog(log,'links.update → visible → count → effect: <b>showing '+vis().length+'</b>');
    foot.innerHTML='One write to <b>links</b> woke exactly its chain — and the theme column never moved. Dependencies, not broadcasts.';
  });
  byId('sgTgl').addEventListener('click',function(){
    st.filter=st.filter==='all'?'paid':'all';
    bump('filter');bump('visible');bump('count');bump('effect');
    paintVals();
    addLog(log,'filter.set(\''+st.filter+'\') → visible recomputed: <b>'+vis().length+' shown</b>');
  });
  byId('sgTheme').addEventListener('click',function(){
    st.theme=st.theme==='dark'?'light':'dark';
    bump('theme');bump('themeEff');
    paintVals();
    addLog(log,'theme.set(\''+st.theme+'\') → only theme\u2019s effect ran — <b>the list graph never stirred</b>');
  });
  byId('sgReset').addEventListener('click',function(){init();paintVals();Object.keys(NODE).forEach(paintRc);log.innerHTML='';foot.innerHTML='Press <b>theme.set</b> and notice: the list graph doesn\u2019t stir — only theme\u2019s own effect runs. That precision is what \u201cfine-grained reactivity\u201d means, and it\u2019s counted, not claimed.';});
  init();paintVals();Object.keys(NODE).forEach(paintRc);
})();

(function ioLab(){
  var kids=byId('ioKids');if(!kids)return;
  var selChip=byId('ioSel'),pe=byId('ioParentEdit'),ce=byId('ioChildEdit'),ev=byId('ioEditVal'),log=byId('ioLog'),foot=byId('ioFoot');
  var st;
  function init(){st={links:['4C92','launch','docs'],selected:null,editing:false};}
  function render(){
    kids.innerHTML=st.links.map(function(c){
      return '<div class="io-card'+(c===st.selected?' sel':'')+'"><span>&lt;link-card&gt; · '+c+'</span><span class="io-btns"><button data-act="select" data-code="'+c+'">select</button><button data-act="remove" data-code="'+c+'">remove</button></span></div>';
    }).join('');
    selChip.textContent=st.selected||'—';
    pe.checked=st.editing;ce.checked=st.editing;
    ev.textContent=String(st.editing);
  }
  kids.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    var code=b.dataset.code;
    if(b.dataset.act==='remove'){
      st.links=st.links.filter(function(c){return c!==code;});
      if(st.selected===code)st.selected=null;
      addLog(log,'output ↑ &nbsp;remove("'+code+'") — the parent drops it from its list','up');
      render();
    } else {
      st.selected=code;
      addLog(log,'output ↑ &nbsp;select("'+code+'")','up');
      addLog(log,'input &nbsp;↓ &nbsp;selected="'+code+'" — every card re-reads its prop','down');
      render();
      foot.innerHTML='<b>'+code+'</b> went up as an output and came back down as an input — the card never selected itself.';
    }
  });
  function setEditing(v,side){
    st.editing=v;render();
    addLog(log,'model ⇅ &nbsp;editing = <b>'+v+'</b> — the <b>'+side+'</b> wrote, both sides saw it');
  }
  pe.addEventListener('change',function(){setEditing(pe.checked,'parent');});
  ce.addEventListener('change',function(){setEditing(ce.checked,'child');});
  byId('ioReset').addEventListener('click',function(){init();render();log.innerHTML='';foot.innerHTML='Select flows up as an output and returns as an input; remove shrinks the parent\u2019s list; and the editing checkboxes are one <code class="tok">model()</code> worn by two owners — flip either.';});
  init();render();
})();

(function diLab(){
  var cntA=byId('diCntA');if(!cntA)return;
  var cntB=byId('diCntB'),bA=byId('diBadgeA'),bB=byId('diBadgeB'),chip=byId('diLocalChip'),status=byId('diStatus'),foot=byId('diFoot');
  var root,localInst,local;
  function init(){root={n:0};localInst=null;local=false;}
  function render(){
    cntA.textContent=root.n;
    cntB.textContent=(local?localInst:root).n;
    bB.textContent=local?'instance #2':'instance #1';
    bB.className='inst '+(local?'i2':'i1');
    chip.style.display=local?'inline-block':'none';
    byId('diLocal').textContent=local?'back to the root provider':'provide locally in LinkEditor';
    byId('diLocal').classList.toggle('primary',local);
  }
  byId('diIncA').addEventListener('click',function(){root.n++;render();status.className='stateline';status.innerHTML='StatsBar wrote — '+(local?'LinkEditor\u2019s <b>private</b> instance didn\u2019t move':'and LinkEditor sees it: <b>same instance</b>');});
  byId('diIncB').addEventListener('click',function(){(local?localInst:root).n++;render();status.className='stateline';status.innerHTML=local?'LinkEditor wrote to <b>instance #2</b> — the root singleton is untouched':'LinkEditor wrote — StatsBar sees it: <b>same instance</b>';});
  byId('diLocal').addEventListener('click',function(){
    local=!local;
    if(local){localInst={n:0};status.className='stateline';status.innerHTML='LinkEditor declared <code class="tok">providers:[SnipStore]</code> — its injector answered first with a <b>fresh instance</b>';foot.innerHTML='Same token, different injector: resolution walks up from the component and stops at the first provider it meets.';}
    else{status.className='stateline';status.innerHTML='local provider removed — resolution walks up to the root singleton again';}
    render();
  });
  byId('diReset').addEventListener('click',function(){init();render();status.className='stateline';status.textContent='both components asked the tree — the root answered with the same singleton';foot.innerHTML='Same badge, same instance: a write from either side is visible to both. Scoping the provider is a deliberate act — and the badges will say so.';});
  init();render();
})();

(function rxLab(){
  var input=byId('rxInput');if(!input)return;
  var src=byId('rxSrc'),deb=byId('rxDeb'),sw=byId('rxSwitch'),out=byId('rxOut'),status=byId('rxStatus'),foot=byId('rxFoot');
  var data=['4c92','launch','docs','promo'];
  var t=null,lastDeb=null,reqSeq=0,timers=[];
  function chip(lane,txt,cls){var c=el('span','rx-chip'+(cls?' '+cls:''),txt);lane.appendChild(c);return c;}
  input.addEventListener('input',function(){
    var v=input.value.trim().toLowerCase();
    chip(src,v===''?'∅':v.slice(-1));
    clearTimeout(t);
    t=setTimeout(function(){
      if(v===lastDeb){status.className='stateline';status.textContent='distinctUntilChanged: same query — dropped';return;}
      lastDeb=v;
      chip(deb,v===''?'∅':v,'deb');
      if(v===''){out.textContent='—';return;}
      var prev=sw.querySelector('.rx-chip.pend');
      if(prev){prev.className='rx-chip cancel';prev.textContent='✗ '+prev.textContent;status.className='stateline bad';status.innerHTML='<b>switchMap</b> cancelled the stale request — its answer can no longer arrive';}
      var id=++reqSeq;
      var c=chip(sw,'GET ?q='+v,'pend');
      timers.push(setTimeout(function(){
        if(id!==reqSeq)return;
        c.className='rx-chip done';c.textContent='✓ '+v;
        var hits=data.filter(function(d){return d.indexOf(v)>-1;});
        out.textContent=hits.length?hits.length+' match: '+hits.join(', '):'0 matches';
        status.className='stateline good';status.innerHTML='response for <b>"'+esc(v)+'"</b> rendered — the only one still standing';
        foot.innerHTML='Fire a second query while the first request is in flight and switchMap strikes the old one through — the answer that no longer matters can no longer arrive.';
      },600));
    },250);
  });
  byId('rxReset').addEventListener('click',function(){
    clearTimeout(t);timers.forEach(clearTimeout);timers=[];lastDeb=null;reqSeq++;
    src.innerHTML='';deb.innerHTML='';sw.innerHTML='';out.textContent='—';input.value='';
    status.className='stateline';status.textContent='every keystroke enters the stream — few of them survive to the network';
  });
})();

(function ngRouteLab(){
  var urlEl=byId('arUrl');if(!urlEl)return;
  var navEl=byId('arNav'),view=byId('arView'),log=byId('arLog'),guardBtn=byId('arGuard'),foot=byId('arFoot');
  var stack,admin;
  navEl.innerHTML='<a data-route="/links">/links</a><a data-route="/settings">/settings</a>';
  function render(){
    var p=stack[stack.length-1];
    urlEl.innerHTML='snip.app<b>'+p+'</b>';
    [].forEach.call(navEl.children,function(a){a.classList.toggle('on',p.indexOf(a.dataset.route)===0&&(a.dataset.route!=='/links'||p.indexOf('/settings')!==0));});
    if(p==='/links'){
      view.innerHTML='<h4>LinkList</h4><div class="ar-row" data-code="4C92">snip.ly/4C92 → routerLink="/links/4C92"</div><div class="ar-row" data-code="launch">snip.ly/launch → routerLink="/links/launch"</div><div class="ar-row" data-code="docs">snip.ly/docs → routerLink="/links/docs"</div>';
    } else if(p.indexOf('/links/')===0){
      var code=p.split('/')[2];
      view.innerHTML='<h4>LinkDetail</h4>route param <code class="tok">:code</code> = <b style="color:var(--accent)">'+code+'</b> — delivered straight into <code class="tok">input()</code> via component input binding.';
    } else {
      view.innerHTML='<h4>Settings</h4>admin-only · this component arrived as a <b>lazy chunk</b> the first time the route allowed it.';
    }
  }
  function go(p){
    if(p==='/settings'&&!admin){
      addLog(log,'canActivate → <b style="color:var(--fail)">false</b> · parseUrl("/links") — <b>redirected</b>, component never loaded');
      return;
    }
    if(p===stack[stack.length-1])return;
    stack.push(p);render();
    addLog(log,'navigate("'+p+'") → router-outlet swapped'+(p==='/settings'?' · <b>settings.chunk.js</b> lazy-loaded':'')+ ' — no reload');
  }
  navEl.addEventListener('click',function(e){var a=e.target.closest('a');if(a)go(a.dataset.route);});
  view.addEventListener('click',function(e){
    var r=e.target.closest('.ar-row');if(!r)return;
    go('/links/'+r.dataset.code);
    addLog(log,':code = "'+r.dataset.code+'" → LinkDetail.input()');
  });
  byId('arBack').addEventListener('click',function(){
    if(stack.length<2){addLog(log,'· history empty');return;}
    stack.pop();render();
    addLog(log,'popstate → "'+stack[stack.length-1]+'"');
  });
  guardBtn.addEventListener('click',function(){admin=!admin;guardBtn.textContent='isAdmin: '+admin;guardBtn.classList.toggle('primary',admin);if(admin)foot.innerHTML='The guard now returns true — /settings is reachable, and its bundle downloads on first entry. UX gate opened; the API stays the law.';});
  byId('arReset').addEventListener('click',function(){stack=['/links'];admin=false;guardBtn.textContent='isAdmin: false';guardBtn.classList.remove('primary');log.innerHTML='';render();foot.innerHTML='Click a link row and the :code parameter arrives in the detail component as an input. Try /settings — the guard has opinions.';});
  stack=['/links'];admin=false;render();
})();

(function formLab(){
  var code=byId('fmCode');if(!code)return;
  var url=byId('fmUrl'),cErr=byId('fmCodeErr'),uErr=byId('fmUrlErr'),pill=byId('fmValid'),submit=byId('fmSubmit'),done=byId('fmDone'),log=byId('fmLog'),foot=byId('fmFoot');
  var touched={code:false,url:false};
  function codeError(v){
    if(!v)return 'required';
    if(v.length<3)return 'min 3 characters';
    if(!/^[a-z0-9-]+$/.test(v))return 'lowercase letters, digits, dashes only';
    return '';
  }
  function urlError(v){
    if(!v)return 'required';
    if(!/^https?:\/\//.test(v))return 'must start with http:// or https://';
    return '';
  }
  function paintField(inp,err,msg,isTouched){
    err.textContent=isTouched?msg:'';
    inp.className='mini-input'+(isTouched?(msg?' err':' ok'):'');
  }
  function render(){
    var cm=codeError(code.value),um=urlError(url.value);
    paintField(code,cErr,cm,touched.code);
    paintField(url,uErr,um,touched.url);
    var valid=!cm&&!um;
    pill.className='fm-pill '+(valid?'valid':'invalid');
    pill.textContent=valid?'VALID':'INVALID';
    submit.disabled=!valid;
    return valid;
  }
  function onChange(which){
    touched[which]=true;render();
    addLog(log,'valueChanges → { code: "'+esc(code.value)+'", url: "'+esc(url.value)+'" }');
  }
  code.addEventListener('input',function(){onChange('code');});
  url.addEventListener('input',function(){onChange('url');});
  submit.addEventListener('click',function(){
    if(!render())return;
    done.classList.add('show');
    done.innerHTML='✓ created <b>snip.ly/'+esc(code.value)+'</b> → POST /shorten (the Module 06 pipeline)';
    addLog(log,'→ <b>submit(form.value)</b> — the model was valid, so the template let you');
    foot.innerHTML='The submit button never decided anything — it only reflected <code class="tok">form.valid</code>. The model ruled; the template obeyed.';
  });
  byId('fmReset').addEventListener('click',function(){
    code.value='';url.value='';touched={code:false,url:false};done.classList.remove('show');log.innerHTML='';render();
    foot.innerHTML='Errors appear per rule, the pill tracks group validity, submit follows the pill — one form object, and the template merely reflects it. UI = f(form).';
  });
  render();
})();

(function cdLab(){
  var passEl=byId('cdPass');if(!passEl)return;
  var totalEl=byId('cdTotal'),status=byId('cdStatus'),modeBtn=byId('cdMode'),foot=byId('cdFoot');
  var IDS=['cdApp','cdHeader','cdDash','cdStats','cdList','cdRow'];
  var counts,total,mode;
  function init(){counts={};IDS.forEach(function(i){counts[i]=0;});total=0;mode='default';}
  function paint(){
    IDS.forEach(function(i){byId(i).querySelector('.cc').textContent='checked ×'+counts[i];});
    passEl.textContent='0';totalEl.textContent=total;
    modeBtn.textContent='strategy: '+(mode==='default'?'Default (Zone.js)':'OnPush + signals');
    modeBtn.classList.toggle('primary',mode!=='default');
  }
  function runPass(list,srcId,msg,cls){
    list.forEach(function(i){counts[i]++;flashCls(byId(i),'checked',560);byId(i).querySelector('.cc').textContent='checked ×'+counts[i];});
    if(srcId)flashCls(byId(srcId),'sigsrc',560);
    total+=list.length;
    passEl.textContent=list.length;totalEl.textContent=total;
    status.className='stateline'+(cls||'');
    status.innerHTML=msg;
  }
  byId('cdClick').addEventListener('click',function(){
    if(mode==='default')runPass(IDS,null,'a click in LinkRow → Zone.js: "something happened" → <b>all 6</b> components checked','');
    else runPass(['cdApp','cdDash','cdList','cdRow'],null,'OnPush: the event marks its <b>path</b> dirty → 4 checked · Header &amp; StatsBar skipped','');
  });
  byId('cdSignal').addEventListener('click',function(){
    if(mode==='default')runPass(IDS,'cdRow','Zone.js can\u2019t see <i>what</i> changed — <b>all 6</b> checked again','');
    else runPass(['cdRow'],'cdRow','the signal knows its reader → <b>exactly 1</b> view updated. That\u2019s zoneless.',' good');
  });
  modeBtn.addEventListener('click',function(){mode=mode==='default'?'onpush':'default';paint();foot.innerHTML=mode==='default'?'Default checks all six components for any event anywhere. OnPush checks the event\u2019s path. A signal under fine-grained reactivity touches exactly one. That\u2019s the whole performance story, counted.':'Now fire the same two events under OnPush + signals — and count the difference.';});
  byId('cdReset').addEventListener('click',function(){var m=mode;init();mode=m;paint();status.className='stateline';status.textContent='pick a strategy and fire an event';});
  init();paint();
})();

onScroll();
})();
