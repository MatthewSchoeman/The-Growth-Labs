(function(){
"use strict";
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function byId(id){return document.getElementById(id);}
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
function clearSVG(s){while(s.firstChild)s.removeChild(s.firstChild);}
var C={type:'#A78BFA',oop:'#56C7FF',gen:'#5BD6C2',linq:'#4ED66B',async:'#E8B341',nullc:'#F2973C',func:'#ED6E9E',
       ink:'#E8ECF8',soft:'#B7C0D8',mut:'#7E88A4',faint:'#565F79',ok:'#4ED66B',bad:'#ED4E6E',warn:'#F2973C',compare:'#E8C53D',
       line:'rgba(140,160,205,0.4)',lineFaint:'rgba(140,160,205,0.2)',surface:'#161E32',border:'rgba(140,160,205,0.26)'};
var T={kw:'#C792EA',typ:'#E8B341',fn:'#5BD6C2',str:'#E2B96B',num:'#E78B8B',txt:'#B7C0D8',op:'#7E88A4',dim:'#565F79',blue:'#7CA8FF'};

function Runner(){this.q=[];this.t=null;this.busy=false;}
Runner.prototype.add=function(fn,delay){this.q.push({fn:fn,delay:reduceMotion?0:delay});return this;};
Runner.prototype.run=function(done){var self=this;this.busy=true;(function step(){if(!self.q.length){self.busy=false;if(done)done();return;}var it=self.q.shift();if(it.fn)it.fn();self.t=setTimeout(step,it.delay);})();};
Runner.prototype.cancel=function(){clearTimeout(this.t);this.q=[];this.busy=false;};

function svgText(x,y,s,fill,size,anchor,weight,mono){var t=mk('text',{x:x,y:y,fill:fill||C.mut,'font-size':size||12,'font-family':(mono===false?'IBM Plex Sans, sans-serif':'IBM Plex Mono, monospace'),'text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];});}

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
  function codeLine(x,y,segs,size){
    var t=mk('text',{x:x,y:y,'font-family':'IBM Plex Mono, monospace','font-size':size||13.5});
    segs.forEach(function(s){var ts=document.createElementNS(NS,'tspan');ts.setAttribute('fill',s[1]);if(s[2])ts.setAttribute('font-weight',s[2]);ts.setAttribute('xml:space','preserve');ts.textContent=s[0];t.appendChild(ts);});
    return t;
  }
  var lines=[
    [40,60,[['record ',T.kw],['Person',T.typ],['(',T.op],['string ',T.kw],['Name',T.txt],[', ',T.op],['int ',T.kw],['Age',T.txt],[');',T.op]]],
    [40,106,[['var ',T.kw],['people ',T.txt],['= ',T.op],['new ',T.blue],['List<Person>',T.typ],[' {',T.op]]],
    [40,132,[['    ',T.txt],['new',T.blue],['(',T.op],['"Ada"',T.str],[', ',T.op],['36',T.num],['), ',T.op],['new',T.blue],['(',T.op],['"Alan"',T.str],[', ',T.op],['41',T.num],[') };',T.op]]],
    [40,178,[['var ',T.kw],['adults ',T.txt],['= ',T.op],['people',T.txt]]],
    [40,204,[['    .',T.op],['Where',T.fn],['(p ',T.txt],['=> ',T.op],['p.Age ',T.txt],['>= ',T.op],['18',T.num],[')',T.op]]],
    [40,230,[['    .',T.op],['Select',T.fn],['(p ',T.txt],['=> ',T.op],['p.Name',T.txt],[');',T.op]]]
  ];
  lines.forEach(function(l){svg.appendChild(codeLine(l[0],l[1],l[2]));});

  function arrowMark(id,color){if(!svg.querySelector('#'+id)){var m=mk('marker',{id:id,markerWidth:7,markerHeight:7,refX:5,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L5 3L0 6Z',fill:color}));svg.appendChild(m);}}
  var anns=[
    {y:54,fromx:312,fromy:56,color:C.type,label:'records · data in one line'},
    {y:100,fromx:300,fromy:104,color:C.gen,label:'List<T> · generic collection'},
    {y:198,fromx:240,fromy:204,color:C.linq,label:'Where/Select · typed LINQ'},
    {y:240,fromx:212,fromy:230,color:C.func,label:'p => … · a lambda'}
  ];
  var tagx=596,tagw=232,tagh=26;
  anns.forEach(function(a,i){
    arrowMark('hm'+i,a.color);
    var g=mk('g',{});g.setAttribute('opacity',reduceMotion?1:0);
    g.appendChild(mk('path',{d:'M'+a.fromx+' '+a.fromy+' C'+(a.fromx+60)+' '+a.fromy+','+(tagx-40)+' '+(a.y+tagh/2)+','+(tagx-6)+' '+(a.y+tagh/2),fill:'none',stroke:a.color,'stroke-width':1.3,'stroke-dasharray':'3 3','marker-end':'url(#hm'+i+')','opacity':0.7}));
    g.appendChild(mk('rect',{x:tagx,y:a.y,width:tagw,height:tagh,rx:7,fill:'rgba(16,22,38,0.7)',stroke:a.color,'stroke-width':1.2}));
    g.appendChild(svgText(tagx+14,a.y+17,a.label,a.color,11.5,'start','600'));
    svg.appendChild(g);
    if(!reduceMotion)setTimeout(function(){g.style.transition='opacity .5s';g.setAttribute('opacity',1);},420+i*330);
  });
})();

(function valLab(){
  var boxesEl=byId('valBoxes'),arrowEl=byId('valArrow'),foot=byId('valFoot');
  if(!boxesEl)return;
  var kind='struct',assigned=false,boxes=[];
  function reset(){assigned=false;boxes=[{names:['a'],val:5}];render();arrowEl.textContent='Point a = new(5);  — press “Point b = a;”.';}
  function render(bumpIdx){
    boxesEl.innerHTML='';
    boxes.forEach(function(bx,i){
      var alias=bx.names.length>1;
      var cls='vt-box '+(kind==='struct'?'value':'ref')+(alias?' alias':'')+(bumpIdx===i?' bump':'');
      boxesEl.appendChild(el('div',cls,'<div class="vt-name">'+bx.names.join(' , ')+(alias?'  →  one object':'')+'</div><div class="vt-val">X = '+bx.val+'</div>'));
    });
    if(!assigned)boxesEl.appendChild(el('div','vt-box','<div class="vt-name" style="color:var(--ink-faint)">b</div><div class="vt-val" style="color:var(--ink-faint)">?</div>'));
  }
  byId('valAssign').addEventListener('click',function(){
    if(assigned)return;assigned=true;
    if(kind==='struct'){boxes=[{names:['a'],val:5},{names:['b'],val:5}];arrowEl.innerHTML='struct → the value is <b style="color:var(--st-ok)">copied</b>: two independent Points.';}
    else{boxes=[{names:['a','b'],val:5}];arrowEl.innerHTML='class → the <b style="color:var(--oop)">reference</b> is copied: a and b point at the <b style="color:var(--oop)">same</b> object.';}
    render();foot.innerHTML='<code class="tok">Point b = a;</code> done. Now press <code class="tok">a.X = 99;</code> and watch b.';
  });
  byId('valMutate').addEventListener('click',function(){
    var idx=-1;boxes.forEach(function(bx,i){if(bx.names.indexOf('a')>=0)idx=i;});
    if(idx<0)return;boxes[idx].val=99;render(idx);
    if(!assigned){foot.innerHTML='a.X is now 99. Assign <code class="tok">b = a</code> first to compare.';return;}
    if(kind==='struct')foot.innerHTML='a.X became 99; <b style="color:var(--st-ok)">b.X is still 5</b> — separate value copies.';
    else foot.innerHTML='a.X became 99 and <b style="color:var(--oop)">b.X is 99 too</b> — one shared object, two references.';
  });
  byId('valReset').addEventListener('click',reset);
  [].forEach.call(document.querySelectorAll('#valLab [data-vk]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#valLab [data-vk]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');kind=b.dataset.vk;reset();
    });
  });
  reset();
})();

(function switchLab(){
  var armsEl=byId('swArms'),foot=byId('swFoot');
  if(!armsEl)return;
  var arms=[
    {pat:'0',test:function(n){return n===0;},res:'"zero"'},
    {pat:'< 0',test:function(n){return n<0;},res:'"negative"'},
    {pat:'< 10',test:function(n){return n<10;},res:'"small"'},
    {pat:'>= 100',test:function(n){return n>=100;},res:'"large"'},
    {pat:'_',test:function(n){return true;},res:'"medium"',def:true}
  ];
  function render(){
    armsEl.innerHTML='';
    arms.forEach(function(a){
      armsEl.appendChild(el('div','sw-arm'+(a.def?' sw-default':''),'<span class="sw-pat">'+a.pat+'</span><span class="sw-arrow">=&gt;</span><span class="sw-res">'+a.res+'</span>'));
    });
  }
  var run=new Runner();
  function evaluate(n){
    run.cancel();render();
    var rows=armsEl.querySelectorAll('.sw-arm');
    var hitIdx=-1;
    for(var k=0;k<arms.length;k++){if(arms[k].test(n)){hitIdx=k;break;}}
    for(var i=0;i<=hitIdx;i++){(function(i){
      run.add(function(){
        rows.forEach(function(r){r.classList.remove('testing');});
        if(i===hitIdx){rows[i].classList.add('hit');
          foot.innerHTML='<code class="tok">Describe('+n+')</code> → <b style="color:var(--st-ok)">'+arms[i].res+'</b> — matched <code class="tok">'+arms[i].pat+'</code>'+(i>0?', after '+i+' earlier pattern'+(i===1?'':'s')+' missed.':' on the first arm.');
        } else {rows[i].classList.add('testing');setTimeout(function(){rows[i].classList.remove('testing');rows[i].classList.add('miss');},230);}
      },360);
    })(i);}
    run.run();
  }
  render();
  [].forEach.call(document.querySelectorAll('#switchLab .sw-in'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#switchLab .sw-in'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');evaluate(parseInt(b.dataset.sv,10));
    });
  });
  evaluate(7);
})();

(function propLab(){
  var card=byId('propCard'),balEl=byId('propBal'),balRow=byId('propBalRow'),status=byId('propStatus'),foot=byId('propFoot');
  if(!card)return;
  var balance=0;
  function show(){balEl.textContent='$'+balance;}
  function reject(msg,note){
    status.textContent='✕ '+msg;status.className='prop-status bad';
    card.classList.add('bad');
    foot.innerHTML=note;
    setTimeout(function(){card.classList.remove('bad');status.textContent='\u00a0';status.className='prop-status';},1300);
  }
  function accept(note){
    status.textContent='✓ invariant holds';status.className='prop-status ok';
    card.classList.add('okflash');balRow.classList.add('changed');
    foot.innerHTML=note;
    setTimeout(function(){card.classList.remove('okflash');balRow.classList.remove('changed');},900);
  }
  byId('propDep').addEventListener('click',function(){
    var v=parseFloat(byId('propAmt').value);if(isNaN(v))return;
    if(v<=0){reject('Deposit must be positive',' <code class="tok">Deposit('+v+')</code> was refused — the method checked the rule before touching Balance.');return;}
    balance+=v;show();accept('<code class="tok">Deposit('+v+')</code> accepted. Balance changed only through the method.');
  });
  byId('propWd').addEventListener('click',function(){
    var v=parseFloat(byId('propAmt').value);if(isNaN(v))return;
    if(v<=0){reject('Amount must be positive','<code class="tok">Withdraw('+v+')</code> needs a positive amount.');return;}
    if(v>balance){reject('Insufficient funds','<code class="tok">Withdraw('+v+')</code> would overdraw the account — refused, so Balance can\u2019t go negative.');return;}
    balance-=v;show();accept('<code class="tok">Withdraw('+v+')</code> accepted — and Balance never goes below zero.');
  });
  byId('propReset').addEventListener('click',function(){balance=0;show();status.textContent='\u00a0';status.className='prop-status';foot.innerHTML='Deposit and Withdraw validate before touching Balance — the invariant can\u2019t be broken from outside.';});
  show();
})();

(function polyLab(){
  var grid=byId('polyGrid'),total=byId('polyTotal'),foot=byId('polyFoot');
  if(!grid)return;
  function glyph(kind,color){
    var inner;
    if(kind==='circle')inner='<circle cx="9" cy="9" r="7" fill="none" stroke="'+color+'" stroke-width="1.6"/>';
    else if(kind==='square')inner='<rect x="2.5" y="2.5" width="13" height="13" rx="1.5" fill="none" stroke="'+color+'" stroke-width="1.6"/>';
    else if(kind==='rect')inner='<rect x="1" y="4.5" width="16" height="9" rx="1.5" fill="none" stroke="'+color+'" stroke-width="1.6"/>';
    else inner='<path d="M9 2 L16 15 L2 15 Z" fill="none" stroke="'+color+'" stroke-width="1.6" stroke-linejoin="round"/>';
    return '<svg width="18" height="18" viewBox="0 0 18 18">'+inner+'</svg>';
  }
  var shapes=[
    {name:'Circle',kind:'circle',color:'#56C7FF',impl:'Math.PI * r * r  (r=2)',area:Math.PI*4},
    {name:'Square',kind:'square',color:'#4ED66B',impl:'s * s  (s=5)',area:25},
    {name:'Rectangle',kind:'rect',color:'#A78BFA',impl:'w * h  (6×3)',area:18},
    {name:'Triangle',kind:'tri',color:'#E8B341',impl:'0.5 * b * h  (3,4)',area:6}
  ];
  function render(){
    grid.innerHTML='';
    shapes.forEach(function(s,i){
      grid.appendChild(el('div','disp-card','<div class="dc-h">'+glyph(s.kind,s.color)+s.name+'</div><div class="dc-impl">override Area() =&gt;<br>'+s.impl+'</div><div class="dc-res" data-i="'+i+'">·</div>'));
    });
  }
  var run=new Runner();
  byId('polyRun').addEventListener('click',function(){
    run.cancel();render();
    var cards=grid.querySelectorAll('.disp-card'),results=grid.querySelectorAll('.dc-res');
    var sum=0;
    shapes.forEach(function(s,i){(function(i){
      run.add(function(){
        cards.forEach(function(c){c.classList.remove('fire');});
        cards[i].classList.add('fire');
        results[i].textContent=(Math.round(s.area*100)/100);
        sum+=s.area;
      },420);
    })(i);});
    run.add(function(){cards.forEach(function(c){c.classList.remove('fire');});total.innerHTML='Total area = <b style="color:var(--oop)">'+(Math.round(sum*100)/100)+'</b> — one <code class="tok">Area()</code> call, four different overrides.';},460);
    run.run();
  });
  render();
})();

(function collLab(){
  var viz=byId('collViz'),bigo=byId('collBigo'),foot=byId('collFoot');
  if(!viz)return;
  var kind='list';
  var listVals=[3,1,4,1,5,9,2,6];
  var dictPairs=[['Ada',36],['Alan',41],['Grace',45],['Linus',54]];
  var setVals=[3,8,1,9,4,7];
  function render(){
    viz.innerHTML='';
    if(kind==='list'){listVals.forEach(function(v,i){viz.appendChild(el('div','coll-cell','<span style="font-size:9px;color:var(--ink-faint);position:absolute;margin-top:-26px">'+i+'</span>'+v));});}
    else if(kind==='dict'){dictPairs.forEach(function(p){viz.appendChild(el('div','coll-cell key',p[0]+': '+p[1]));});}
    else {setVals.forEach(function(v){viz.appendChild(el('div','coll-cell',v+''));});}
  }
  function setBigo(findO,findFast,idxLabel,idxO,idxFast){
    bigo.innerHTML='<div class="bigo-stat"><div class="bo-k">find a value</div><div class="bo-v '+(findFast?'fast':'slow')+'">'+findO+'</div></div>'
      +'<div class="bigo-stat"><div class="bo-k">'+idxLabel+'</div><div class="bo-v '+(idxFast?'fast':(idxO==='—'?'':'slow'))+'">'+idxO+'</div></div>';
  }
  function defaults(){
    if(kind==='list')setBigo('O(n)',false,'by index',' O(1)',true);
    else if(kind==='dict')setBigo('O(n)',false,'by key','O(1)',true);
    else setBigo('O(1)',true,'by index','—',false);
  }
  var run=new Runner();
  function clearCells(){viz.querySelectorAll('.coll-cell').forEach(function(c){c.classList.remove('hit','scan','faded');});}
  byId('collFind').addEventListener('click',function(){
    run.cancel();clearCells();
    var cells=viz.querySelectorAll('.coll-cell');
    if(kind==='set'){
      var idx=3;run.add(function(){cells[idx].classList.add('hit');foot.innerHTML='<code class="tok">set.Contains(9)</code> → hashes straight to the bucket. <b style="color:var(--st-ok)">O(1)</b> — no scan.';},0);
    } else {
      var target= kind==='list'?5:2; var found= kind==='list'?4:3;
      for(var i=0;i<=found;i++){(function(i){run.add(function(){cells.forEach(function(c){c.classList.remove('scan');});if(i===found){cells[i].classList.add('hit');foot.innerHTML=(kind==='list'?'<code class="tok">list.Contains(5)</code>':'searching by <i>value</i>')+' scanned '+(i+1)+' items to find it. <b style="color:var(--st-warn)">O(n)</b> — linear.';}else{cells[i].classList.add('scan');}},320);})(i);}
    }
    run.run();
  });
  byId('collIndex').addEventListener('click',function(){
    run.cancel();clearCells();
    var cells=viz.querySelectorAll('.coll-cell');
    if(kind==='set'){foot.innerHTML='A <code class="tok">HashSet</code> is <b>unordered</b> — there\u2019s no index to access. Use it for fast membership tests, not positional lookup.';return;}
    var idx= kind==='list'?2:1;
    run.add(function(){cells[idx].classList.add('hit');foot.innerHTML=(kind==='list'?'<code class="tok">list[2]</code> jumps straight to the slot':'<code class="tok">dict["Alan"]</code> hashes straight to the value')+'. <b style="color:var(--st-ok)">O(1)</b> — constant time.';},0);
    run.run();
  });
  [].forEach.call(document.querySelectorAll('#collLab [data-ct]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#collLab [data-ct]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');kind=b.dataset.ct;render();defaults();
      foot.innerHTML=kind==='list'?'A <code class="tok">List&lt;T&gt;</code> is a dynamic array: O(1) by index, O(n) to find a value.'
        :kind==='dict'?'A <code class="tok">Dictionary&lt;K,V&gt;</code> hashes keys: O(1) by key, but O(n) to search by value.'
        :'A <code class="tok">HashSet&lt;T&gt;</code> hashes values: O(1) membership, but unordered (no index).';
    });
  });
  render();defaults();
})();

(function linqLab(){
  var clausesEl=byId('linqClauses'),codeEl=byId('linqCode'),countEl=byId('linqCount'),headEl=byId('linqHead'),bodyEl=byId('linqBody'),foot=byId('linqFoot');
  if(!clausesEl)return;
  var data=[
    {Name:'Keyboard',Category:'Tech',Price:45,Stock:12},
    {Name:'Mouse',Category:'Tech',Price:25,Stock:30},
    {Name:'Desk',Category:'Home',Price:120,Stock:5},
    {Name:'Lamp',Category:'Home',Price:35,Stock:18},
    {Name:'Monitor',Category:'Tech',Price:90,Stock:8},
    {Name:'Chair',Category:'Home',Price:75,Stock:10},
    {Name:'Cable',Category:'Tech',Price:8,Stock:50}
  ];
  var state={
    where:{on:true,field:'Price',op:'<',val:'50'},
    order:{on:true,field:'Price',dir:'asc'},
    select:{on:false,proj:'Name'}
  };
  function numField(f){return f==='Price'||f==='Stock';}
  function clauseRow(key,title,bodyHtml){
    var on=state[key].on;
    var row=el('div','linq-clause '+(on?'on':'off'));
    row.innerHTML='<div class="lc-toggle" data-tog="'+key+'">.'+title+'()</div><div class="lc-body">'+bodyHtml+'</div>';
    return row;
  }
  function buildControls(){
    clausesEl.innerHTML='';
    var w=state.where;
    var opOpts=numField(w.field)?['<','>','>=']:['==','!='];
    if(!numField(w.field)&&w.op!=='=='&&w.op!=='!=')w.op='==';
    if(numField(w.field)&&!(w.op==='<'||w.op==='>'||w.op==='>='))w.op='<';
    var valCtrl=numField(w.field)
      ? '<input id="lqWval" type="number" value="'+w.val+'" style="width:64px">'
      : '<select id="lqWval"><option'+(w.val==='Tech'?' selected':'')+'>Tech</option><option'+(w.val==='Home'?' selected':'')+'>Home</option></select>';
    var wbody='p =&gt; p.<select id="lqWfield">'+['Price','Stock','Category'].map(function(f){return '<option'+(w.field===f?' selected':'')+'>'+f+'</option>';}).join('')
      +'</select> <select id="lqWop">'+opOpts.map(function(o){return '<option'+(w.op===o?' selected':'')+'>'+o+'</option>';}).join('')+'</select> '+valCtrl;
    clausesEl.appendChild(clauseRow('where','Where',wbody));
    var o=state.order;
    var obody='p =&gt; p.<select id="lqOfield">'+['Price','Name','Stock'].map(function(f){return '<option'+(o.field===f?' selected':'')+'>'+f+'</option>';}).join('')
      +'</select> <select id="lqOdir"><option value="asc"'+(o.dir==='asc'?' selected':'')+'>ascending</option><option value="desc"'+(o.dir==='desc'?' selected':'')+'>descending</option></select>';
    clausesEl.appendChild(clauseRow('order','OrderBy',obody));
    var s=state.select;
    var sbody='p =&gt; <select id="lqSproj"><option value="Name"'+(s.proj==='Name'?' selected':'')+'>p.Name</option><option value="NamePrice"'+(s.proj==='NamePrice'?' selected':'')+'>new { p.Name, p.Price }</option><option value="all"'+(s.proj==='all'?' selected':'')+'>p (all fields)</option></select>';
    clausesEl.appendChild(clauseRow('select','Select',sbody));
    wire();
  }
  function wire(){
    [].forEach.call(clausesEl.querySelectorAll('[data-tog]'),function(t){
      t.addEventListener('click',function(){var k=t.dataset.tog;state[k].on=!state[k].on;buildControls();recompute();});
    });
    var bind=function(id,obj,prop,rebuild){var e=byId(id);if(e)e.addEventListener('change',function(){obj[prop]=e.value;if(rebuild)buildControls();recompute();});};
    bind('lqWfield',state.where,'field',true);
    bind('lqWop',state.where,'op',false);
    bind('lqWval',state.where,'val',false);
    bind('lqOfield',state.order,'field',false);
    bind('lqOdir',state.order,'dir',false);
    bind('lqSproj',state.select,'proj',false);
  }
  function applyQuery(){
    var rows=data.slice();
    if(state.where.on){
      var w=state.where;
      rows=rows.filter(function(r){
        if(w.field==='Category')return w.op==='=='?r.Category===w.val:r.Category!==w.val;
        var v=r[w.field],t=parseFloat(w.val);
        return w.op==='<'?v<t:w.op==='>'?v>t:v>=t;
      });
    }
    if(state.order.on){
      var o=state.order;
      rows.sort(function(a,b){var av=a[o.field],bv=b[o.field];var c=av<bv?-1:av>bv?1:0;return o.dir==='desc'?-c:c;});
    }
    return rows;
  }
  function renderCode(){
    var L=[];
    L.push('<span class="lq-v">products</span>');
    if(state.where.on){
      var w=state.where;
      var val=w.field==='Category'?'<span class="lq-s">"'+w.val+'"</span>':'<span class="lq-n">'+w.val+'</span>';
      L.push('    .<span class="lq-m">Where</span>(p =&gt; p.'+w.field+' '+w.op.replace(/>/g,'&gt;').replace(/</g,'&lt;')+' '+val+')');
    }
    if(state.order.on){
      var o=state.order;
      L.push('    .<span class="lq-m">'+(o.dir==='desc'?'OrderByDescending':'OrderBy')+'</span>(p =&gt; p.'+o.field+')');
    }
    if(state.select.on){
      var s=state.select,proj= s.proj==='Name'?'p.Name':s.proj==='NamePrice'?'new { p.Name, p.Price }':'p';
      L.push('    .<span class="lq-m">Select</span>(p =&gt; '+proj+')');
    }
    codeEl.innerHTML='<span class="lq-v">var</span> result = '+L.join('\n')+';';
  }
  function renderResults(rows){
    var cols;
    if(state.select.on&&state.select.proj==='Name')cols=['Name'];
    else if(state.select.on&&state.select.proj==='NamePrice')cols=['Name','Price'];
    else cols=['Name','Category','Price','Stock'];
    headEl.innerHTML='<tr>'+cols.map(function(c){return '<th>'+c+'</th>';}).join('')+'</tr>';
    bodyEl.innerHTML=rows.map(function(r){return '<tr>'+cols.map(function(c){return '<td'+(c==='Price'?' class="mono"':'')+'>'+(c==='Price'?'$'+r[c]:r[c])+'</td>';}).join('')+'</tr>';}).join('');
    countEl.textContent=rows.length+' row'+(rows.length===1?'':'s');
  }
  function recompute(){
    var rows=applyQuery();
    renderCode();renderResults(rows);
    foot.innerHTML='Pipeline produced <b style="color:var(--linq)">'+rows.length+'</b> row'+(rows.length===1?'':'s')+'. Toggle a clause or change a value and it recomputes.';
  }
  buildControls();recompute();
})();

(function nullLab(){
  var chainEl=byId('nullChain'),outEl=byId('nullOut'),foot=byId('nullFoot');
  if(!chainEl)return;
  var personNull=false,addrNull=false,mode='safe';
  function render(){
    chainEl.innerHTML='';
    var op=mode==='safe'?'?.':'.';
    var pn=el('div','null-node'+(personNull?' isnull':''),'<div class="nn-name">person</div><div class="nn-sub">'+(personNull?'null':'Person')+'</div>');
    pn.addEventListener('click',function(){personNull=!personNull;evaluate();});
    chainEl.appendChild(pn);
    chainEl.appendChild(el('span','null-op',op));
    var shortedA=personNull;
    var an=el('div','null-node'+(addrNull?' isnull':'')+(shortedA?' shorted':''),'<div class="nn-name">Address</div><div class="nn-sub">'+(addrNull?'null':'Address')+'</div>');
    an.addEventListener('click',function(){addrNull=!addrNull;evaluate();});
    chainEl.appendChild(an);
    chainEl.appendChild(el('span','null-op'+((shortedA||addrNull)?' shorted':''),op));
    var shortedC=personNull||addrNull;
    chainEl.appendChild(el('div','null-node'+(shortedC?' shorted':''),'<div class="nn-name">City</div><div class="nn-sub">string</div>'));
    chainEl.appendChild(el('span','null-op','?? '));
    chainEl.appendChild(el('div','null-node','<div class="nn-name">"unknown"</div><div class="nn-sub">fallback</div>'));
  }
  function evaluate(){
    render();
    var nodes=chainEl.querySelectorAll('.null-node');
    if(mode==='safe'){
      if(personNull||addrNull){
        outEl.innerHTML='result = <span class="no-val">"unknown"</span>';
        foot.innerHTML='<code class="tok">?.</code> hit a null and <b>short-circuited</b> the whole chain to null — then <code class="tok">??</code> supplied <b style="color:var(--st-ok)">"unknown"</b>. No exception.';
      } else {
        nodes[2].classList.add('reached');
        outEl.innerHTML='result = <span class="no-val">"Paris"</span>';
        foot.innerHTML='Nothing was null, so the chain reached <code class="tok">City</code> and returned <b style="color:var(--st-ok)">"Paris"</b>.';
      }
    } else {
      if(personNull){outEl.innerHTML='💥 <span class="no-crash">NullReferenceException</span>';foot.innerHTML='Plain <code class="tok">.</code> on a null <code class="tok">person</code> <b style="color:var(--st-bad)">throws</b> at <code class="tok">.Address</code> — the crash <code class="tok">?.</code> would have prevented.';}
      else if(addrNull){outEl.innerHTML='💥 <span class="no-crash">NullReferenceException</span>';foot.innerHTML='<code class="tok">person.Address</code> is null, so <code class="tok">.City</code> <b style="color:var(--st-bad)">throws</b>. Without <code class="tok">?.</code> there\u2019s no safety net.';}
      else {nodes[2].classList.add('reached');outEl.innerHTML='result = <span class="no-val">"Paris"</span>';foot.innerHTML='All non-null here, so plain <code class="tok">.</code> works too — but it\u2019s one null away from a crash.';}
    }
  }
  [].forEach.call(document.querySelectorAll('#nullLab [data-nm]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#nullLab [data-nm]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');mode=b.dataset.nm;evaluate();
    });
  });
  evaluate();
})();

(function asyncLab(){
  var stage=byId('asyncStage'),totalEl=byId('asyncTotal'),foot=byId('asyncFoot');
  if(!stage)return;
  var tasks=[{name:'GetUser',dur:3,color:'#56C7FF'},{name:'GetOrders',dur:2,color:'#4ED66B'},{name:'GetPrefs',dur:2,color:'#A78BFA'}];
  var SCALE=7;
  var mode='sync';
  function render(animate){
    stage.innerHTML='';
    var offset=0;
    tasks.forEach(function(t,i){
      var start= mode==='sync'?offset:0;
      var row=el('div','async-row','<div class="async-lab">'+t.name+'</div><div class="async-track"><div class="async-bar" data-i="'+i+'"></div></div>');
      stage.appendChild(row);
      var bar=row.querySelector('.async-bar');
      bar.style.background=t.color;
      bar.style.left=(start/SCALE*100)+'%';
      bar.textContent=t.dur+'s';
      if(animate&&!reduceMotion){bar.style.width='0%';setTimeout(function(){bar.style.width=(t.dur/SCALE*100)+'%';},60+(mode==='sync'?start*180:i*40));}
      else bar.style.width=(t.dur/SCALE*100)+'%';
      offset+=t.dur;
    });
    var sum=tasks.reduce(function(a,b){return a+b.dur;},0);
    var max=Math.max.apply(null,tasks.map(function(t){return t.dur;}));
    if(mode==='sync')totalEl.innerHTML='Sequential total: <b style="color:var(--st-warn)">'+sum+'s</b> — the sum of every call.';
    else totalEl.innerHTML='Overlapped total: <b style="color:var(--st-ok)">'+max+'s</b> — just the longest call ('+sum+'s of work in '+max+'s).';
  }
  byId('asyncRun').addEventListener('click',function(){render(true);});
  [].forEach.call(document.querySelectorAll('#asyncLab [data-am]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#asyncLab [data-am]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');mode=b.dataset.am;render(true);
      foot.innerHTML=mode==='sync'?'Sequential: each <code class="tok">await</code> finishes before the next starts — times <b>add up</b>.'
        :'<code class="tok">Task.WhenAll</code>: all three run at once and you await the group — you wait only for the <b>slowest</b>.';
    });
  });
  render(true);
})();

onScroll();
})();
