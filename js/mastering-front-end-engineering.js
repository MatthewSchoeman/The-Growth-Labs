(function(){
"use strict";
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function byId(id){return document.getElementById(id);}
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];});}
var C={acc:'#2DD4BF',cyan:'#56C7FF',coral:'#FB7185',violet:'#A78BFA',ink:'#E8ECF8',soft:'#B7C0D8',mut:'#7E88A4',faint:'#565F79'};
function svgText(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill||C.mut,'font-size':size||12,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function Runner(){this.q=[];this.t=null;}
Runner.prototype.add=function(fn,delay){this.q.push({fn:fn,delay:reduceMotion?0:delay});return this;};
Runner.prototype.run=function(done){var self=this;(function step(){if(!self.q.length){if(done)done();return;}var it=self.q.shift();if(it.fn)it.fn();self.t=setTimeout(step,it.delay);})();};
Runner.prototype.cancel=function(){clearTimeout(this.t);this.q=[];};
function addLog(box,html,cls){var d=el('div','lg'+(cls?' '+cls:''),html);box.appendChild(d);setTimeout(function(){d.classList.add('show');},reduceMotion?0:20);box.scrollTop=box.scrollHeight;return d;}

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
  var m=mk('marker',{id:'ha',markerWidth:8,markerHeight:8,refX:6,refY:3,orient:'auto'});
  m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:C.faint}));svg.appendChild(m);
  function pill(cx,cy,txt,color){
    var w=txt.length*8.4+30;
    svg.appendChild(mk('rect',{x:cx-w/2,y:cy-17,width:w,height:34,rx:17,fill:'rgba(10,14,26,0.92)',stroke:color,'stroke-width':1.6}));
    svg.appendChild(svgText(cx,cy+4.5,txt,color,13,'middle','700'));
  }
  function arrow(d,label,lx,ly){
    svg.appendChild(mk('path',{d:d,fill:'none',stroke:'rgba(140,160,205,0.45)','stroke-width':1.5,'marker-end':'url(#ha)'}));
    svg.appendChild(svgText(lx,ly,label,C.mut,10.5,'middle','600'));
  }
  arrow('M486 74 Q616 96 638 188','render(state)',604,108);
  arrow('M596 224 Q430 268 264 224','the user interacts',430,262);
  arrow('M222 188 Q244 96 374 74','event → setState',258,108);
  pill(430,58,'STATE',C.acc);
  pill(646,212,'VIEW · DOM',C.cyan);
  pill(214,212,'EVENT',C.coral);
  svg.appendChild(svgText(430,150,'UI = f(state)',C.acc,21,'middle','700'));
  svg.appendChild(svgText(430,176,'the reactive loop',C.faint,11,'middle'));
  var loop='M430 58 Q664 84 646 212 Q430 276 214 212 Q196 84 430 58';
  if(!reduceMotion){
    var tok=mk('circle',{r:5.5,fill:C.acc});
    tok.appendChild(mk('animateMotion',{dur:'6s',repeatCount:'indefinite',path:loop}));
    svg.appendChild(tok);
  } else svg.appendChild(mk('circle',{cx:430,cy:58,r:5.5,fill:C.acc}));
})();

(function pipelineLab(){
  var stagesEl=byId('pipeStages');if(!stagesEl)return;
  var viewEl=byId('pipeView'),status=byId('pipeStatus'),foot=byId('pipeFoot');
  var stages=['HTML → DOM','CSS → CSSOM','Render tree','Layout','Paint','Composite'];
  stages.forEach(function(s,i){
    if(i>0)stagesEl.appendChild(el('div','p2-conn'));
    stagesEl.appendChild(el('div','p2-stage','<div class="n">'+(i+1)+'</div><div class="nm">'+s+'</div>'));
  });
  var stageEls=[].slice.call(stagesEl.querySelectorAll('.p2-stage'));
  var tree='<div class="pv-doc pv-tree"><span class="tnode">header</span><br>&nbsp;&nbsp;├ <span class="tnode">h1</span> "Snip · dashboard"<br>&nbsp;&nbsp;└ <span class="tnode">p</span> "3 links · 1.2M clicks"</div>';
  var boxes='<div class="pv-doc"><div class="pv-box"><span class="dim">860×120</span>header</div><div class="pv-box" style="margin-left:18px"><span class="dim">824×44</span>h1</div><div class="pv-box" style="margin-left:18px"><span class="dim">824×24</span>p</div></div>';
  var painted='<div class="pv-doc"><div class="pv-box painted"><div class="pv-box painted hd" style="margin:0 0 8px">Snip · dashboard</div><div class="pv-box painted bd" style="margin:0">3 links · 1.2M clicks</div></div></div>';
  var views=[
    '<div class="pv-doc" style="white-space:pre;font-size:11.5px;color:var(--ink-soft)">&lt;header&gt;\n  &lt;h1&gt;Snip · dashboard&lt;/h1&gt;\n  &lt;p&gt;3 links · 1.2M clicks&lt;/p&gt;\n&lt;/header&gt;\n\nh1 { color: teal }   p { color: skyblue }</div>',
    tree,
    tree+'<div style="position:absolute;bottom:10px;right:14px;font-size:10px;color:var(--ink-faint)">+ CSSOM: rules resolved per node</div>',
    tree+'<div style="position:absolute;bottom:10px;right:14px;font-size:10px;color:var(--ink-faint)">render tree = DOM × CSSOM · visible nodes only</div>',
    boxes,
    painted,
    painted
  ];
  var statuses=[
    'Bytes arrive: markup and a stylesheet. Nothing on screen yet.',
    'Parsed: the HTML is now a <b>tree of nodes</b> — the DOM.',
    'Styles resolved: every node knows its computed CSS — the CSSOM.',
    'Combined into the <b>render tree</b>: only what will actually display.',
    '<b>Layout</b>: every box gets a geometry — this is where flexbox and grid run.',
    '<b>Paint</b>: pixels, colors, and text rasterized into layers.',
    '<b>Composite</b>: layers assembled on the GPU → pixels on glass. Done.'
  ];
  var idx=0;
  function paint(){
    stageEls.forEach(function(s,i){s.classList.toggle('done',i<idx);});
    viewEl.innerHTML='<div style="position:relative;width:100%">'+views[idx]+'</div>';
    status.className='stateline'+(idx===6?' good':'');
    status.innerHTML=statuses[idx];
    byId('pipeStep').textContent=idx>=6?'✓ pixels':'▸ next stage';
  }
  byId('pipeStep').addEventListener('click',function(){if(idx<6){idx++;paint();if(idx===6)foot.innerHTML='Six stages from bytes to glass. Every visual change your code makes re-enters this pipeline — the cheaper the stage, the smoother the app.';}});
  byId('pipeReset').addEventListener('click',function(){idx=0;paint();foot.innerHTML='Every visual change re-enters this pipeline somewhere. Changing geometry re-runs layout; changing only color skips straight to paint; transform and opacity can ride the compositor alone.';});
  paint();
})();

(function domLab(){
  var treeEl=byId('domTree');if(!treeEl)return;
  var stageEl=byId('domStage'),status=byId('domStatus'),foot=byId('domFoot');
  var st,addN;
  function init(){st={items:['snip.ly/4C92','snip.ly/launch','snip.ly/docs'],title:'Your links',dark:false,freshIdx:-1,freshTitle:false};addN=0;}
  function render(){
    var t='<div><span class="tn">main#dashboard</span></div>'+
      '<div class="lvl1"><span class="tn">section.card'+(st.dark?'<span class="fresh">.dark</span>':'')+'</span></div>'+
      '<div class="lvl2"><span class="tn">h2</span> "'+st.title+'"'+(st.freshTitle?' <span class="fresh">← changed</span>':'')+'</div>'+
      '<div class="lvl2"><span class="tn">ul#links</span></div>';
    st.items.forEach(function(it,i){
      t+='<div style="padding-left:48px"><span class="tn'+(i===st.freshIdx?' fresh':'')+'">li</span> "'+it+'"</div>';
    });
    treeEl.innerHTML=t;
    var lis='';
    st.items.forEach(function(it,i){lis+='<li'+(i===st.freshIdx?' class="fresh"':'')+'>'+it+'</li>';});
    stageEl.innerHTML='<div class="dom-stage-card'+(st.dark?' dark':'')+'"><h4>'+st.title+'</h4><ul>'+lis+'</ul></div>';
  }
  function clearFresh(){st.freshIdx=-1;st.freshTitle=false;}
  byId('domAdd').addEventListener('click',function(){
    clearFresh();addN++;
    st.items.push(addN===1?'snip.ly/promo':'snip.ly/new-'+addN);
    st.freshIdx=st.items.length-1;render();
    status.className='stateline';status.innerHTML='<b>createElement("li")</b> → <b>list.append(li)</b> — one mutation; the pipeline ran layout + paint for the new box.';
  });
  byId('domText').addEventListener('click',function(){
    clearFresh();st.title=st.title==='Your links'?'Top links today':'Your links';st.freshTitle=true;render();
    status.className='stateline';status.innerHTML='<b>h2.textContent = "'+st.title+'"</b> — a text node swapped; the heading reflows.';
  });
  byId('domClass').addEventListener('click',function(){
    clearFresh();st.dark=!st.dark;render();
    status.className='stateline';status.innerHTML='<b>card.classList.toggle("dark")</b> — same geometry, new styles: only style + paint re-ran.';
  });
  byId('domReset').addEventListener('click',function(){init();render();status.className='stateline';status.textContent='Fresh tree. Mutate it.';foot.innerHTML='Every button is one real DOM API call. The page never changes on its own — something always mutated the tree first.';});
  init();render();status.textContent='Fresh tree. Mutate it.';
})();

(function eventLab(){
  var outer=byId('evOuter');if(!outer)return;
  var middle=byId('evMiddle'),inner=byId('evInner'),log=byId('evLog'),status=byId('evStatus'),foot=byId('evFoot');
  var stopOn=false,n=0;
  function flash(box){box.classList.add('hit');setTimeout(function(){box.classList.remove('hit');},reduceMotion?0:260);}
  function line(txt,cls,box){n++;addLog(log,'<b>'+n+'</b>  '+txt,cls);flash(box);}
  outer.addEventListener('click',function(e){if(e.target!==inner)return;line('capture ↓ &nbsp;document','cap',outer);},true);
  middle.addEventListener('click',function(e){if(e.target!==inner)return;line('capture ↓ &nbsp;section#links','cap',middle);},true);
  inner.addEventListener('click',function(e){
    line('target &nbsp;&nbsp;● &nbsp;the button itself','tgt',inner);
    if(stopOn){
      e.stopPropagation();
      status.className='stateline bad';
      status.innerHTML='<b>stopPropagation()</b> at the target — the bubble leg is cancelled; the ancestors above never hear it.';
    } else {
      status.className='stateline';
      status.innerHTML='Five stops, one click: down the tree, the target, back up. Ancestors heard everything.';
    }
  });
  middle.addEventListener('click',function(e){if(e.target!==inner)return;line('bubble &nbsp;↑ &nbsp;section#links','bub',middle);});
  outer.addEventListener('click',function(e){if(e.target!==inner)return;line('bubble &nbsp;↑ &nbsp;document','bub',outer);});
  byId('evStopBtn').addEventListener('click',function(){
    stopOn=!stopOn;this.textContent='stopPropagation: '+(stopOn?'on':'off');this.classList.toggle('primary',stopOn);
  });
  byId('evReset').addEventListener('click',function(){log.innerHTML='';n=0;status.className='stateline';status.textContent='Log cleared — click the button.';foot.innerHTML='Five stops per click: down through the ancestors, the target itself, then back up. Delegation is just listening on the way up.';});
  status.textContent='Click the button and read the journey.';
})();

(function stateLab(){
  var jsonEl=byId('stJson');if(!jsonEl)return;
  var listEl=byId('stList'),countEl=byId('stCount'),input=byId('stInput'),desync=byId('stDesync'),log=byId('stLog'),foot=byId('stFoot');
  var modeBtn=byId('stModeBtn');
  var state,mode;
  function init(){state={links:[{code:'4C92',clicks:812},{code:'launch',clicks:407},{code:'docs',clicks:203}],draft:''};mode='decl';}
  function renderJson(){
    var rows=state.links.map(function(l){
      return '    { <span class="jk">"code"</span>: <span class="js">"'+l.code+'"</span>, <span class="jk">"clicks"</span>: <span class="jn">'+l.clicks+'</span> }';
    }).join(',\n');
    jsonEl.innerHTML='{\n  <span class="jk">"links"</span>: [\n'+rows+'\n  ],\n  <span class="jk">"draft"</span>: <span class="js">"'+esc(state.draft)+'"</span>\n}';
    jsonEl.classList.add('chg');setTimeout(function(){jsonEl.classList.remove('chg');},reduceMotion?0:320);
  }
  function rowHtml(l){
    return '<div class="st-row"><span>snip.ly/'+l.code+'</span><span class="clicks">'+l.clicks+' clicks</span><button data-code="'+l.code+'">+1 click</button></div>';
  }
  function renderView(){
    listEl.innerHTML=state.links.map(rowHtml).join('');
    countEl.textContent=state.links.length+' links';
    input.value=state.draft;
  }
  function checkSync(){
    var shownRows=listEl.querySelectorAll('.st-row').length;
    var shownCount=parseInt(countEl.textContent,10);
    var truth=state.links.length;
    if(shownRows!==truth||shownCount!==truth){
      desync.classList.add('show');
      desync.innerHTML='⚠ view ≠ state — state has <b>'+truth+'</b> links · the counter shows <b>'+shownCount+'</b>. The screen is lying.';
    } else desync.classList.remove('show');
  }
  function reduce(s,a){
    if(a.type==='ADD_LINK')return {links:s.links.concat([{code:a.code,clicks:0}]),draft:''};
    if(a.type==='CLICK')return {links:s.links.map(function(l){return l.code===a.code?{code:l.code,clicks:l.clicks+1}:l;}),draft:s.draft};
    if(a.type==='SET_DRAFT')return {links:s.links,draft:a.v};
    return s;
  }
  function dispatch(a){
    state=reduce(state,a);
    if(a.type!=='SET_DRAFT')addLog(log,'⚡ '+a.type+(a.code?'("'+a.code+'")':'')+' &nbsp;→ new state → <b>render(state)</b>');
    renderJson();renderView();checkSync();
  }
  byId('stAddBtn').addEventListener('click',function(){
    var code=esc((input.value||'').trim())||'promo';
    if(mode==='decl'){dispatch({type:'ADD_LINK',code:code});}
    else{
      state.links.push({code:code,clicks:0});
      listEl.insertAdjacentHTML('beforeend',rowHtml({code:code,clicks:0}));
      input.value='';
      renderJson();
      addLog(log,'✋ manual DOM patch: appended the row… <span style="color:var(--fail)">forgot the counter</span>');
      checkSync();
    }
  });
  listEl.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    var code=b.dataset.code;
    if(mode==='decl')dispatch({type:'CLICK',code:code});
    else{
      state.links.forEach(function(l){if(l.code===code)l.clicks++;});
      var span=b.parentNode.querySelector('.clicks');
      var l=state.links.filter(function(x){return x.code===code;})[0];
      if(span&&l)span.textContent=l.clicks+' clicks';
      renderJson();
      addLog(log,'✋ manual DOM patch: updated one span by hand');
      checkSync();
    }
  });
  input.addEventListener('input',function(){if(mode==='decl')dispatch({type:'SET_DRAFT',v:input.value});});
  modeBtn.addEventListener('click',function(){
    mode=mode==='decl'?'manual':'decl';
    modeBtn.textContent='mode: '+(mode==='decl'?'declarative':'manual');
    modeBtn.classList.toggle('primary',mode==='manual');
    if(mode==='decl'){
      renderJson();renderView();checkSync();
      addLog(log,'↻ re-render from state — <b>view resynced</b>. One function, zero lies.');
      foot.innerHTML='One re-render from state and every discrepancy vanished — that\u2019s the entire argument in a single click.';
    } else {
      addLog(log,'✋ manual mode: handlers now patch the DOM directly. Watch closely.');
      foot.innerHTML='Manual mode: every handler must remember every DOM spot that shows the data. Add a link and see what gets forgotten.';
    }
  });
  byId('stReset').addEventListener('click',function(){
    init();modeBtn.textContent='mode: declarative';modeBtn.classList.remove('primary');
    log.innerHTML='';renderJson();renderView();checkSync();
    foot.innerHTML='In declarative mode the view is recomputed from state after every event — it cannot disagree with the data. That guarantee is what every modern framework is selling.';
  });
  init();renderJson();renderView();checkSync();
})();

(function componentLab(){
  var tree=byId('cmpTree');if(!tree)return;
  var log=byId('cmpLog'),foot=byId('cmpFoot');
  var links=[{code:'4C92',clicks:812},{code:'launch',clicks:407},{code:'docs',clicks:203}];
  tree.innerHTML=
    '<div class="cmp-node" id="cnApp"><span class="cn-name">App</span><span class="cn-prop">owns state: selected = <b id="cnSel">—</b></span>'+
      '<div class="cmp-kids">'+
        '<div class="cmp-node" id="cnHeader"><span class="cn-name">Header</span><span class="cn-prop">prop ↓ selected</span></div>'+
        '<div class="cmp-node" id="cnList"><span class="cn-name">LinkList</span><span class="cn-prop">props ↓ links, selected · event ↑ onSelect</span>'+
          '<div class="cmp-kids" id="cnRows"></div>'+
        '</div>'+
      '</div>'+
    '</div>';
  var rowsEl=byId('cnRows'),selEl=byId('cnSel');
  function renderRows(sel){
    rowsEl.innerHTML=links.map(function(l){
      return '<div class="cmp-row'+(l.code===sel?' sel':'')+'" data-code="'+l.code+'"><span>LinkRow · '+l.code+'</span><span style="color:var(--ink-faint);font-size:10px">'+l.clicks+' clicks</span></div>';
    }).join('');
  }
  function flash(id){var n=byId(id);n.classList.add('flash');setTimeout(function(){n.classList.remove('flash');},reduceMotion?0:300);}
  var run=new Runner();
  rowsEl.addEventListener('click',function(e){
    var row=e.target.closest('.cmp-row');if(!row)return;
    var code=row.dataset.code;
    run.cancel();
    addLog(log,'event ↑ &nbsp;onSelect("'+code+'") — LinkRow → LinkList → App','up');
    row.classList.add('sel');
    run.add(function(){flash('cnList');},120)
       .add(function(){flash('cnApp');selEl.textContent=code;},160)
       .add(function(){
          addLog(log,'prop ↓ &nbsp;selected="'+code+'" — App → Header · App → LinkList → rows','down');
          flash('cnHeader');renderRows(code);
          foot.innerHTML='<b>'+code+'</b> travelled up as an event and came back down as a prop. The row never styled itself — it asked, and the owner answered.';
       },160);
    run.run();
  });
  byId('cmpReset').addEventListener('click',function(){run.cancel();selEl.textContent='—';renderRows(null);log.innerHTML='';foot.innerHTML='The row doesn\u2019t change its own color — it reports upward, the owner updates state, and the highlight arrives back as a prop. Even selection obeys UI = f(state).';});
  renderRows(null);
})();

(function diffLab(){
  var oldEl=byId('diffOld');if(!oldEl)return;
  var newEl=byId('diffNew'),opsEl=byId('diffOps'),status=byId('diffStatus'),foot=byId('diffFoot');
  var base=['4C92','launch','docs'];
  var cur,keys,addN;
  function init(){cur=base.slice();keys=false;addN=0;}
  function lisKeep(seq){
    var n=seq.length,len=[],prev=[],best=0,bi=-1,i,j;
    for(i=0;i<n;i++){len[i]=1;prev[i]=-1;
      for(j=0;j<i;j++)if(seq[j]>=0&&seq[i]>=0&&seq[j]<seq[i]&&len[j]+1>len[i]){len[i]=len[j]+1;prev[i]=j;}
      if(seq[i]>=0&&len[i]>best){best=len[i];bi=i;}
    }
    var keep={};while(bi>=0){keep[bi]=true;bi=prev[bi];}
    return keep;
  }
  function render(){
    oldEl.innerHTML=base.map(function(c,i){return '<div class="drow"><span>'+c+'</span><span class="dk">'+(keys?'key='+c:'index '+i)+'</span></div>';}).join('');
    var oldIdx=cur.map(function(c){return base.indexOf(c);});
    var keep=keys?lisKeep(oldIdx):{};
    newEl.innerHTML=cur.map(function(c,i){
      var isNew=oldIdx[i]<0,moved=keys&&!isNew&&!keep[i];
      return '<div class="drow'+(isNew?' new':(moved?' moved':''))+'"><span>'+c+'</span><span class="dk">'+(keys?'key='+c:'index '+i)+'</span></div>';
    }).join('');
    var ops=[];
    if(!keys){
      var n=Math.max(base.length,cur.length),i;
      for(i=0;i<n;i++){
        if(i<base.length&&i<cur.length){if(base[i]!==cur[i])ops.push(['upd','UPDATE #'+i+' text → "'+cur[i]+'"']);}
        else if(i>=base.length)ops.push(['ins','INSERT #'+i+' "'+cur[i]+'"']);
        else ops.push(['upd','REMOVE #'+i]);
      }
    } else {
      cur.forEach(function(c,i){
        if(oldIdx[i]<0)ops.push(['ins','INSERT key='+c]);
        else if(!keep[i])ops.push(['mov','MOVE key='+c]);
      });
    }
    opsEl.innerHTML=ops.length?ops.map(function(o){return '<span class="opc '+o[0]+'">'+o[1]+'</span>';}).join(''):'<span style="font-family:var(--font-mono);font-size:11px;color:var(--ink-faint)">no changes — nothing to patch</span>';
    var u=ops.filter(function(o){return o[0]==='upd';}).length,mv=ops.filter(function(o){return o[0]==='mov';}).length,ins=ops.filter(function(o){return o[0]==='ins';}).length;
    status.className='stateline'+(keys&&ops.length&&u===0?' good':'');
    status.innerHTML=keys?'keyed diff → '+(mv?mv+' MOVE':'')+(mv&&ins?' + ':'')+(ins?ins+' INSERT':'')+(ops.length?'':'nothing')+' — identity recognized, nodes reused':
      'index diff → '+(u?u+' rows look changed':'')+(u&&ins?' + ':'')+(ins?ins+' INSERT':'')+(ops.length?'':'no changes');
  }
  byId('diffShuffle').addEventListener('click',function(){cur.push(cur.shift());render();foot.innerHTML=keys?'One item moved, one MOVE emitted — the other rows kept their real DOM nodes untouched.':'One item moved, but compared by position <b>every row</b> looks different. Focus, animations, and input state all get trampled.';});
  byId('diffAdd').addEventListener('click',function(){addN++;cur=cur.concat([addN===1?'promo':'new-'+addN]);render();foot.innerHTML='A genuinely new item is one INSERT in either mode — appends are the easy case; <b>reorders</b> are where keys earn their keep.';});
  var kbtn=byId('diffKeys');
  kbtn.addEventListener('click',function(){keys=!keys;kbtn.textContent='keys: '+(keys?'on':'off');kbtn.classList.toggle('primary',keys);render();});
  byId('diffReset').addEventListener('click',function(){var k=keys;init();keys=k;render();foot.innerHTML='Without keys, one move reads as "every row changed." With keys, it\u2019s one MOVE — and the rows keep their real DOM nodes, focus, and animation state.';});
  init();render();
})();

(function flowLab(){
  var storeEl=byId('flStore');if(!storeEl)return;
  var countA=byId('flCountA'),filterB=byId('flFilterB'),compA=byId('flCompA'),compB=byId('flCompB'),log=byId('flLog'),foot=byId('flFoot');
  var st;
  function init(){st={links:3,filter:'all'};}
  function flash(n){n.classList.add('flash');setTimeout(function(){n.classList.remove('flash');},reduceMotion?0:320);}
  function render(){
    storeEl.innerHTML='{\n  <span class="jk">links</span>:  <span class="jn">'+st.links+'</span>,\n  <span class="jk">filter</span>: <span class="js">"'+st.filter+'"</span>\n}';
    countA.textContent=st.links;filterB.textContent=st.filter;
  }
  function dispatch(type){
    if(type==='ADD_LINK')st={links:st.links+1,filter:st.filter};
    else st={links:st.links,filter:st.filter==='all'?'paid':'all'};
    render();flash(compA);flash(compB);
    addLog(log,'⚡ dispatch <b>'+type+'</b> → reducer → new state → notify(2 subscribers)');
  }
  byId('flAdd').addEventListener('click',function(){dispatch('ADD_LINK');foot.innerHTML='StatsBar re-rendered because the store changed — it never spoke to the button that caused it. Readers subscribe; only the reducer writes.';});
  byId('flFilter').addEventListener('click',function(){dispatch('SET_FILTER');foot.innerHTML='Same dispatch pipeline, different slice of state — FilterBar picked up its piece, StatsBar its own. One flow, any number of readers.';});
  byId('flReset').addEventListener('click',function(){init();render();log.innerHTML='';foot.innerHTML='Both components update from the same dispatch — neither talked to the other, and neither touched the store directly. The reducer is the only writer in the whole app.';});
  init();render();
})();

(function fetchLab(){
  var pill=byId('ftPill');if(!pill)return;
  var listEl=byId('ftList'),log=byId('ftLog'),hint=byId('ftHint'),foot=byId('ftFoot');
  var data=[{code:'4C92',clicks:812},{code:'launch',clicks:407},{code:'docs',clicks:203}];
  var loaded=null,failing=false,optimistic=true,addN=0;
  var run=new Runner();
  function setPill(s){pill.className='ft-pill '+s;pill.textContent=s.toUpperCase();}
  function rowHtml(l,ghost){return '<div class="ft-row'+(ghost?' ghost':'')+'"'+(ghost?' data-ghost="1"':'')+'><span>snip.ly/'+l.code+'</span><span class="clicks">'+l.clicks+' clicks</span></div>';}
  function renderList(){
    if(!loaded){listEl.innerHTML='<div class="ft-empty">nothing loaded yet — the view says so, honestly</div>';return;}
    listEl.innerHTML=loaded.map(function(l){return rowHtml(l,false);}).join('');
  }
  byId('ftLoad').addEventListener('click',function(){
    run.cancel();setPill('loading');hint.textContent='render(loading) — a spinner, not a blank page';
    addLog(log,'→ GET /api/stats …');
    run.add(function(){
      if(failing){setPill('error');hint.textContent='render(error) — say it, offer retry';addLog(log,'✗ 502 Bad Gateway → state: error');foot.innerHTML='The request died; the interface didn\u2019t. An honest error state with a retry beats a spinner that never resolves.';}
      else{loaded=data.slice();renderList();setPill('success');hint.textContent='render(success) — the data, at last';addLog(log,'✓ 200 OK · 3 links → state: success');foot.innerHTML='Three renders for one request — loading, then the answer. The user was never left staring at nothing.';}
    },700);
    run.run();
  });
  byId('ftAdd').addEventListener('click',function(){
    if(!loaded){addLog(log,'· load the list first (GET /stats)');return;}
    run.cancel();addN++;
    var nl={code:addN===1?'promo':'new-'+addN,clicks:0};
    if(optimistic){
      listEl.insertAdjacentHTML('beforeend',rowHtml(nl,true));
      addLog(log,'⚡ optimistic: render the row now, ask the server after');
      run.add(function(){
        var ghost=listEl.querySelector('[data-ghost]');
        if(failing){
          if(ghost)ghost.parentNode.removeChild(ghost);
          setPill('error');addLog(log,'✗ POST failed → <b>rolled back</b> — the view matches the server again');
          foot.innerHTML='The bet lost, the receipt paid out: the ghost row vanished and the UI is truthful again. Optimism plus rollback, never optimism alone.';
        } else {
          loaded.push(nl);renderList();setPill('success');
          addLog(log,'✓ 201 Created — the bet paid off, the row is real');
          foot.innerHTML='The user saw their link instantly; the server confirmed 700 ms later. High-success actions earn optimistic rendering.';
        }
      },700);
      run.run();
    } else {
      setPill('loading');addLog(log,'→ POST /shorten … (pessimistic: wait, then render)');
      run.add(function(){
        if(failing){setPill('error');addLog(log,'✗ POST failed → state: error');}
        else{loaded.push(nl);renderList();setPill('success');addLog(log,'✓ 201 Created → render');}
      },700);
      run.run();
    }
  });
  var failBtn=byId('ftFail');
  failBtn.addEventListener('click',function(){failing=!failing;failBtn.textContent='server: '+(failing?'failing':'healthy');failBtn.classList.toggle('primary',failing);});
  var optBtn=byId('ftOpt');
  optBtn.classList.add('primary');
  optBtn.addEventListener('click',function(){optimistic=!optimistic;optBtn.textContent='optimistic: '+(optimistic?'on':'off');optBtn.classList.toggle('primary',optimistic);});
  renderList();
})();

(function routeLab(){
  var urlEl=byId('rtUrl');if(!urlEl)return;
  var navEl=byId('rtNav'),viewEl=byId('rtView'),log=byId('rtLog'),foot=byId('rtFoot');
  var routes={
    '/links':{t:'Links',b:'3 links · manage &amp; create — the list you built in Module 04.'},
    '/stats':{t:'Stats',b:'clicks by day — rendered from GET /stats (Module 08).'},
    '/settings':{t:'Settings',b:'API keys &amp; preferences — a lazily-loaded chunk (code splitting).'}
  };
  var stack;
  navEl.innerHTML=Object.keys(routes).map(function(p){return '<a data-route="'+p+'">'+p+'</a>';}).join('');
  function render(){
    var path=stack[stack.length-1],r=routes[path];
    urlEl.innerHTML='snip.app<b>'+path+'</b>';
    [].forEach.call(navEl.children,function(a){a.classList.toggle('on',a.dataset.route===path);});
    viewEl.innerHTML='<h4>'+r.t+'</h4>'+r.b;
  }
  navEl.addEventListener('click',function(e){
    var a=e.target.closest('a');if(!a)return;
    var p=a.dataset.route;
    if(p===stack[stack.length-1])return;
    stack.push(p);render();
    addLog(log,'pushState("'+p+'") — view swapped, <b>document not reloaded</b>');
  });
  byId('rtBack').addEventListener('click',function(){
    if(stack.length<2){addLog(log,'· history empty — nowhere to go back to');return;}
    stack.pop();render();
    addLog(log,'popstate → "'+stack[stack.length-1]+'" — the back button is just another state change');
    foot.innerHTML='Back worked because the URL never stopped being state — pop the stack, render the route. No framework required, just the contract.';
  });
  byId('rtReset').addEventListener('click',function(){stack=['/links'];render();log.innerHTML='';foot.innerHTML='Each click is pushState plus a render — the document never reloads, yet the URL, the view, and the back button all agree, because they all read the same state.';});
  stack=['/links'];render();
})();

(function perfLab(){
  var input=byId('pfInput');if(!input)return;
  var rawEl=byId('pfRaw'),debEl=byId('pfDeb'),thrEl=byId('pfThr'),status=byId('pfStatus');
  var raw=0,deb=0,thr=0,t=null,last=0;
  function paint(){rawEl.textContent=raw;debEl.textContent=deb;thrEl.textContent=thr;}
  input.addEventListener('input',function(){
    raw++;
    var now=Date.now();
    if(now-last>=300){last=now;thr++;status.className='stateline';status.textContent='throttle: leading call taken — next one allowed in 300 ms';}
    clearTimeout(t);
    t=setTimeout(function(){deb++;paint();status.className='stateline good';status.innerHTML='debounce fired <b>once</b> for the whole burst — that\u2019s your one search request.';},250);
    paint();
  });
  byId('pfReset').addEventListener('click',function(){raw=0;deb=0;thr=0;clearTimeout(t);last=0;paint();status.className='stateline';status.textContent='type something — then stop, and watch the debounce fire once';});
  paint();
})();

onScroll();
})();
