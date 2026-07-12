(function(){
"use strict";
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function byId(id){return document.getElementById(id);}
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
function clearSVG(s){while(s.firstChild)s.removeChild(s.firstChild);}
function fmt(n){return Math.round(n).toLocaleString('en-US');}
var C={gold:'#F0B429',bigo:'#56C7FF',ds:'#5BD6C2',dp:'#A78BFA',sql:'#7C9CFF',oop:'#ED6E9E',bits:'#F2973C',csharp:'#C792EA',aspnet:'#4ED66B',ef:'#38BDF8',testing:'#E8B341',
       pass:'#4ED66B',fail:'#ED4E6E',olog:'#56C7FF',ink:'#E8ECF8',soft:'#B7C0D8',mut:'#7E88A4',faint:'#565F79',
       border:'rgba(140,160,205,0.26)'};
function svgText(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill||C.mut,'font-size':size||12,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];});}

function Runner(){this.q=[];this.t=null;}
Runner.prototype.add=function(fn,delay){this.q.push({fn:fn,delay:reduceMotion?0:delay});return this;};
Runner.prototype.run=function(done){var self=this;(function step(){if(!self.q.length){if(done)done();return;}var it=self.q.shift();if(it.fn)it.fn();self.t=setTimeout(step,it.delay);})();};
Runner.prototype.cancel=function(){clearTimeout(this.t);this.q=[];};

var ALPHA='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

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
  function box(x,y,w,title,sub,color){
    var g=mk('g',{});
    g.appendChild(mk('rect',{x:x,y:y,width:w,height:52,rx:10,fill:'rgba(0,0,0,0.16)',stroke:color,'stroke-width':1.4}));
    g.appendChild(svgText(x+w/2,y+22,title,color,12.5,'middle','700'));
    g.appendChild(svgText(x+w/2,y+38,sub,C.faint,10,'middle'));
    svg.appendChild(g);
  }
  function amark(id,color){var m=mk('marker',{id:id,markerWidth:8,markerHeight:8,refX:6,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:color}));svg.appendChild(m);}
  amark('hf',C.faint);
  function arrow(x1,x2,y){svg.appendChild(mk('line',{x1:x1,y1:y,x2:x2-9,y2:y,stroke:C.faint,'stroke-width':1.3,'marker-end':'url(#hf)'}));}
  svg.appendChild(svgText(30,74,'① SHORTEN',C.mut,10.5,'start','700'));
  svg.appendChild(svgText(30,196,'② REDIRECT',C.mut,10.5,'start','700'));
  box(30,88,150,'long URL','https://…/article',C.soft);
  box(212,88,126,'Snip API','POST /shorten',C.aspnet);
  box(370,88,142,'Base62.Encode','id 125 → 4C92',C.bits);
  box(544,88,116,'Postgres','INSERT',C.sql);
  arrow(180,212,114);arrow(338,370,114);arrow(512,544,114);
  svg.appendChild(mk('rect',{x:686,y:96,width:150,height:36,rx:18,fill:'rgba(240,180,41,0.12)',stroke:C.gold,'stroke-width':1.4}));
  svg.appendChild(svgText(761,118,'snip.ly/4C92',C.gold,12.5,'middle','700'));
  arrow(660,686,114);
  box(30,210,150,'tap short link','GET /4C92',C.soft);
  box(212,210,126,'cache','O(1) hit',C.ds);
  box(370,210,166,'301 redirect','→ original URL',C.olog);
  box(568,210,150,'original site','🌐 loads',C.soft);
  arrow(180,212,236);arrow(338,370,236);arrow(536,568,236);
  if(!reduceMotion){
    var p1=mk('circle',{r:5,fill:C.gold});p1.appendChild(mk('animateMotion',{dur:'3.2s',repeatCount:'indefinite',path:'M105 114 L636 114'}));svg.appendChild(p1);
    var p2=mk('circle',{r:5,fill:C.olog});p2.appendChild(mk('animateMotion',{dur:'3.2s',repeatCount:'indefinite',begin:'0.4s',path:'M105 236 L636 236'}));svg.appendChild(p2);
  }
})();

(function arch(){
  var svg=byId('archSvg');if(!svg)return;
  function amark(id,color){var m=mk('marker',{id:id,markerWidth:8,markerHeight:8,refX:6,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:color}));svg.appendChild(m);}
  amark('af',C.faint);
  function down(x,y1,y2){svg.appendChild(mk('line',{x1:x,y1:y1,x2:x,y2:y2-9,stroke:C.faint,'stroke-width':1.3,'marker-end':'url(#af)'}));}
  function harrow(x1,x2,y,color){var xs=x1<x2?x2-9:x2+9;svg.appendChild(mk('line',{x1:x1,y1:y,x2:xs,y2:y,stroke:color,'stroke-width':1.3,'marker-end':'url(#af)'}));}
  function tag(x,y,txt,color){var w=txt.length*6.2+14;svg.appendChild(mk('rect',{x:x-w/2,y:y-9,width:w,height:18,rx:9,fill:'none',stroke:color,'stroke-width':1}));svg.appendChild(svgText(x,y+3.5,txt,color,9.5,'middle','600'));}
  function box(x,y,w,h,title,sub,color){
    svg.appendChild(mk('rect',{x:x,y:y,width:w,height:h,rx:11,fill:'rgba(0,0,0,0.16)',stroke:color,'stroke-width':1.5}));
    svg.appendChild(svgText(x+w/2,y+(sub?20:h/2+4.5),title,color,12.5,'middle','700'));
    if(sub)svg.appendChild(svgText(x+w/2,y+36,sub,C.faint,10,'middle'));
  }
  var cx=430;
  box(305,16,250,40,'Client · browser',null,C.soft);
  down(cx,56,80);
  box(305,80,250,48,'ASP.NET Core','POST /shorten · GET /{code}',C.aspnet);
  down(cx,128,150);
  box(305,150,250,48,'ShortenerService','Repository · Strategy · DI',C.dp);
  down(cx,198,220);
  box(305,220,250,48,'EF Core · SnipContext','LINQ → SQL',C.ef);
  down(cx,268,290);
  box(305,290,250,44,'PostgreSQL · links','unique index on code',C.sql);
  box(45,80,160,48,'LinkCache','Dictionary · O(1)',C.ds);
  tag(125,142,'Data Structures',C.ds);
  harrow(205,305,104,C.ds);
  svg.appendChild(svgText(255,97,'redirect',C.faint,9,'middle'));
  box(45,150,160,48,'ShortLink','encapsulated domain',C.oop);
  tag(125,212,'OOP',C.oop);
  harrow(205,305,174,C.oop);
  box(655,150,160,48,'Base62','encode · decode',C.bits);
  tag(735,212,'Bits',C.bits);
  harrow(655,555,174,C.bits);
  tag(735,104,'Big O · O(1)',C.bigo);
  svg.appendChild(mk('rect',{x:30,y:12,width:800,height:334,rx:16,fill:'none',stroke:C.testing,'stroke-width':1,'stroke-dasharray':'2 6',opacity:0.45}));
  svg.appendChild(svgText(44,30,'▢ Test suite — property · mock · integration',C.testing,10,'start','600'));
})();

(function conceptMap(){
  var grid=byId('cmapGrid'),detail=byId('cmapDetail'),foot=byId('cmapFoot');
  if(!grid)return;
  var courses=[
    {n:'00',name:'Big O',c:C.bigo,where:'The O(1) hot path',d:'Choosing the cache-plus-index design so the redirect — Snip\u2019s busiest operation — stays constant time as links scale into the millions.',f:'Modules 05 · 10'},
    {n:'01',name:'Data Structures',c:C.ds,where:'The cache',d:'A Dictionary hash map fronts every read for average O(1) lookups; an LRU bound keeps the hot set and caps memory.',f:'Caching/LinkCache.cs'},
    {n:'02',name:'Design Patterns',c:C.dp,where:'Repository · Strategy · DI',d:'The repository hides EF behind an interface, a strategy makes code generation swappable, and DI wires the service to abstractions.',f:'Services/*.cs'},
    {n:'03',name:'SQL',c:C.sql,where:'The schema & index',d:'A Postgres links table with a unique B-tree index on code — the fast, scan-free seek behind every redirect.',f:'db/schema.sql'},
    {n:'04',name:'OOP',c:C.oop,where:'The domain model',d:'ShortLink encapsulates its state and exposes behavior, not setters; taking a Uri makes an invalid URL unrepresentable.',f:'Domain/ShortLink.cs'},
    {n:'05',name:'Bits',c:C.bits,where:'Base-62 & flags',d:'Encoding the row id in base 62, guarding the counter with checked overflow, and packing link options into a [Flags] bitmask.',f:'Encoding/Base62.cs'},
    {n:'06',name:'C#',c:C.csharp,where:'The whole codebase',d:'Records, LINQ, pattern matching, async/await, primary constructors — the language every single layer is written in.',f:'*.cs'},
    {n:'07',name:'ASP.NET',c:C.aspnet,where:'The Web API',d:'Minimal-API endpoints, DI lifetimes (scoped context, singleton cache), model binding, and correct HTTP status codes.',f:'Program.cs'},
    {n:'08',name:'EF Core',c:C.ef,where:'Object ↔ table',d:'SnipContext maps ShortLink to the links table via the Fluent API; LINQ translates to the indexed SQL seek.',f:'Data/SnipContext.cs'},
    {n:'09',name:'Testing',c:C.testing,where:'The safety net',d:'Property, mock, and integration tests verify the encoder, the service, and the endpoints — so any layer can change without fear.',f:'Tests/*.cs'}
  ];
  function select(i){
    [].forEach.call(grid.children,function(ch,j){ch.classList.toggle('sel',j===i);});
    var co=courses[i];
    detail.innerHTML='<div class="cd-head"><span class="cd-dot" style="background:'+co.c+'"></span><span style="color:'+co.c+'">'+co.name+'</span></div>'+
      '<div class="cd-where">In Snip → '+co.where+'  ·  '+co.f+'</div><p>'+co.d+'</p>';
  }
  courses.forEach(function(co,i){
    var card=el('div','cmap-card','<div class="cc-num">'+co.n+'</div><div class="cc-name">'+co.name+'</div>');
    card.style.setProperty('--cc',co.c);
    card.addEventListener('click',function(){select(i);foot.innerHTML='<b style="color:'+co.c+'">'+co.name+'</b> → '+co.where+'. Every course maps to a concrete piece of the app.';});
    grid.appendChild(card);
  });
  select(5);
})();

(function encoderLab(){
  var io=byId('encIo'),stepsEl=byId('encSteps'),verify=byId('encVerify'),foot=byId('encFoot');
  if(!io)return;
  io.innerHTML='<span>id</span><input id="encInput" value="1000000" inputmode="numeric"><span class="enc-arrow">→ Base62.Encode →</span><span class="enc-code" id="encCode"></span>';
  var input=byId('encInput'),codeEl=byId('encCode');
  function encode(n){
    if(n===0)return{steps:[{n:0,q:0,rem:0,ch:'0'}],code:'0'};
    var steps=[],x=n;
    while(x>0){var rem=x%62,q=Math.floor(x/62);steps.push({n:x,q:q,rem:rem,ch:ALPHA[rem]});x=q;}
    return{steps:steps,code:steps.map(function(s){return s.ch;}).reverse().join('')};
  }
  function decode(code){var n=0;for(var i=0;i<code.length;i++)n=n*62+ALPHA.indexOf(code[i]);return n;}
  var run=new Runner();
  function render(){
    run.cancel();
    var raw=(input.value||'').replace(/[^0-9]/g,'');
    if(raw==='')raw='0';
    var n=Math.min(Number(raw),Number.MAX_SAFE_INTEGER);
    var r=encode(n);
    codeEl.innerHTML='<span class="pre">snip.ly/</span>'+r.code;
    stepsEl.innerHTML='';
    r.steps.forEach(function(s){
      var row=el('div','enc-step','<span class="es-n">'+fmt(s.n)+'</span><span class="es-op">÷ 62 = '+fmt(s.q)+' r '+s.rem+'</span><span class="es-digit">digit '+s.rem+'</span><span class="es-char">\''+s.ch+'\'</span>');
      stepsEl.appendChild(row);
    });
    var rows=[].slice.call(stepsEl.children);
    rows.forEach(function(row,i){run.add(function(){row.classList.add('show');},reduceMotion?0:110);});
    run.add(function(){
      var back=decode(r.code);
      var ok=back===n;
      verify.style.borderColor=ok?'rgba(78,214,107,.4)':'rgba(237,78,110,.4)';
      verify.style.background=ok?'var(--pass-soft)':'var(--fail-soft)';
      verify.style.color=ok?'var(--pass)':'var(--fail)';
      verify.innerHTML=(ok?'✓ ':'✗ ')+'Base62.Decode("'+r.code+'") = '+fmt(back)+(ok?'  ·  round-trips exactly':'  ·  mismatch!');
      foot.innerHTML='id '+fmt(n)+' → <b style="color:var(--accent)">'+r.code+'</b> in '+r.steps.length+' digit'+(r.steps.length>1?'s':'')+'. Reading the characters bottom-to-top gives the code.';
    },reduceMotion?0:120);
    run.run();
  }
  input.addEventListener('input',render);
  render();
})();

(function lookupLab(){
  var range=byId('lkRange'),nEl=byId('lkN'),rowsEl=byId('lkRows'),foot=byId('lkFoot');
  if(!range)return;
  var methods=[
    {k:'scan',name:'Full table scan',sub:'no index — O(n)',color:C.bits,bigo:'on',steps:function(N){return N;},label:function(N){return '≈ '+fmt(N)+' rows';}},
    {k:'index',name:'B-tree index',sub:'unique index — O(log n)',color:C.olog,bigo:'olog',steps:function(N){return Math.max(1,Math.ceil(Math.log2(N)));},label:function(N){return '≈ '+Math.max(1,Math.ceil(Math.log2(N)))+' steps';}},
    {k:'cache',name:'In-memory cache',sub:'hash map — O(1)',color:C.pass,bigo:'o1',steps:function(){return 1;},label:function(){return '1 step';}}
  ];
  function N(){return Math.pow(10,Number(range.value)+1);}
  function render(){
    var n=N();nEl.textContent=fmt(n);
    rowsEl.innerHTML='';
    var denom=Math.log(n+1);
    methods.forEach(function(m){
      var steps=m.steps(n);
      var pct=Math.min(100,(Math.log(steps+1)/denom)*100);
      var row=el('div','lk-row',
        '<div class="lk-name">'+m.name+'<br><span class="lk-sub">'+m.sub+'</span></div>'+
        '<div class="lk-track"><div class="lk-fill" style="width:'+pct+'%;background:'+m.color+'"></div></div>'+
        '<div class="lk-count" style="color:'+m.color+'"><span class="bigo '+m.bigo+'">'+({on:'O(n)',olog:'O(log n)',o1:'O(1)'})[m.bigo]+'</span> '+m.label(n)+'</div>');
      rowsEl.appendChild(row);
    });
    foot.innerHTML='At <b>'+fmt(n)+'</b> links: the scan needs ~'+fmt(n)+' comparisons, the index ~'+Math.max(1,Math.ceil(Math.log2(n)))+', the cache just 1. That gap is why Snip layers all three.';
  }
  range.addEventListener('input',render);
  render();
})();

(function apiLab(){
  var tabsEl=byId('apiTabs'),stepsEl=byId('apiSteps'),respEl=byId('apiResp'),foot=byId('apiFoot');
  if(!tabsEl)return;
  var req='post';
  var flows={
    post:{steps:[
      ['middleware','request logging middleware'],
      ['routing','matched → POST /shorten'],
      ['binding','body → ShortenRequest { url }'],
      ['service','ShortenerService.ShortenAsync(uri)'],
      ['encode','Base62.Encode(125) → "4C92"'],
      ['ef','INSERT INTO links … (scoped DbContext)']
    ],resp:['ok','201 Created','Location: /4C92  ·  { "shortUrl": "snip.ly/4C92" }']},
    get:{steps:[
      ['middleware','request logging middleware'],
      ['routing','matched → GET /{code}'],
      ['cache','LinkCache.Resolve("4C92") → hit',true],
      ['redirect','Results.Redirect(url, permanent: true)']
    ],resp:['redir','301 Moved Permanently','Location: https://…/article  ·  browser follows']},
    miss:{steps:[
      ['middleware','request logging middleware'],
      ['routing','matched → GET /{code}'],
      ['cache','LinkCache.Resolve("zzzz") → miss'],
      ['ef','SELECT … WHERE code = \'zzzz\' → none'],
      ['notfound','Results.NotFound()']
    ],resp:['err','404 Not Found','unknown code — nothing to redirect to']}
  };
  [].forEach.call(tabsEl.children,function(t){
    t.addEventListener('click',function(){[].forEach.call(tabsEl.children,function(x){x.classList.remove('on');});t.classList.add('on');req=t.dataset.req;stepsEl.innerHTML='';respEl.className='api-resp';respEl.innerHTML='';});
  });
  var run=new Runner();
  byId('apiSend').addEventListener('click',function(){
    run.cancel();stepsEl.innerHTML='';respEl.className='api-resp';respEl.innerHTML='';
    var f=flows[req];
    f.steps.forEach(function(s){
      var row=el('div','api-step'+(s[2]?' hit':''),'<span class="as-layer">'+s[0]+'</span><span class="as-txt">'+s[1]+'</span>');
      stepsEl.appendChild(row);
      run.add(function(){row.classList.add('show');},reduceMotion?0:230);
    });
    run.add(function(){
      respEl.className='api-resp show '+f.resp[0];
      respEl.innerHTML='<b>'+f.resp[1]+'</b><div class="ar-sub">'+f.resp[2]+'</div>';
      foot.innerHTML=({post:'A new link is created and persisted — 201 with the short URL.',get:'A cache hit resolves in O(1) and returns a 301 the browser follows automatically.',miss:'An unknown code falls through cache and DB to a clean 404.'})[req];
    },reduceMotion?0:240);
    run.run();
  });
})();

(function testLab(){
  var rowsEl=byId('testRows'),sumEl=byId('testSummary'),foot=byId('testFoot');
  if(!rowsEl)return;
  var buggy=false;
  var tests=[
    {name:'Decode_is_inverse_of_Encode',kind:'property · [Theory]',fails:function(){return buggy;}},
    {name:'Shorten_persists_link_and_assigns_code',kind:'unit · mock repo',fails:function(){return false;}},
    {name:'Shorten_uses_IClock_for_CreatedAt',kind:'unit · mock clock',fails:function(){return false;}},
    {name:'Get_known_code_returns_301',kind:'integration · WebAppFactory',fails:function(){return false;}},
    {name:'Get_unknown_code_returns_404',kind:'integration · WebAppFactory',fails:function(){return false;}}
  ];
  function shell(){
    rowsEl.innerHTML='';
    tests.forEach(function(t){
      rowsEl.appendChild(el('div','test-row','<span class="t-badge pend">·</span><span class="tr-name">'+t.name+'</span><span class="tr-kind">'+t.kind+'</span>'));
    });
    sumEl.innerHTML='';
  }
  var run=new Runner();
  function doRun(){
    run.cancel();shell();
    var rows=[].slice.call(rowsEl.children);
    tests.forEach(function(t,i){
      run.add(function(){
        var fail=t.fails();
        rows[i].className='test-row ran '+(fail?'fail':'pass');
        rows[i].querySelector('.t-badge').className='t-badge '+(fail?'fail':'pass');
        rows[i].querySelector('.t-badge').textContent=fail?'FAIL':'PASS';
        if(fail){var nm=rows[i].querySelector('.tr-name');nm.innerHTML=t.name+'  <span style="color:var(--fail)">// long.MaxValue: Decode ≠ Encode</span>';}
      },reduceMotion?0:300);
    });
    run.add(function(){
      var f=tests.filter(function(t){return t.fails();}).length,p=tests.length-f;
      sumEl.innerHTML=f===0?'<b style="color:var(--pass)">'+p+' passed, 0 failed</b> — every layer holds.':'<b style="color:var(--pass)">'+p+' passed</b>, <b style="color:var(--fail)">'+f+' failed</b> — the property test caught the <b>int overflow</b> at long.MaxValue.';
      foot.innerHTML=f===0?'All green. Encoder, service, and endpoints verified in one run.':'The overflow bug from Module 02 is caught the instant it appears — press <b>use long</b> to fix.';
    },reduceMotion?0:220);
    run.run();
  }
  byId('testRun').addEventListener('click',doRun);
  byId('testBug').addEventListener('click',function(){buggy=!buggy;this.classList.toggle('primary',buggy);this.textContent=buggy?'use long (fixed)':'use int (overflow)';doRun();});
  shell();
})();

(function complexityLab(){
  var range=byId('cxRange'),nEl=byId('cxN'),rowsEl=byId('cxRows'),foot=byId('cxFoot');
  if(!range)return;
  var ops=[
    {op:'Encode(id)',sub:'id → base-62 code',bigo:'olog',count:function(N){return Math.max(1,Math.ceil(Math.log(N+1)/Math.log(62)));},unit:'digits'},
    {op:'Decode(code)',sub:'code → id',bigo:'olog',count:function(N){return Math.max(1,Math.ceil(Math.log(N+1)/Math.log(62)));},unit:'chars'},
    {op:'Insert link',sub:'write + index update',bigo:'olog',count:function(N){return Math.max(1,Math.ceil(Math.log2(N)));},unit:'steps'},
    {op:'Lookup — cache hit',sub:'Dictionary',bigo:'o1',count:function(){return 1;},unit:'step'},
    {op:'Lookup — indexed',sub:'B-tree seek',bigo:'olog',count:function(N){return Math.max(1,Math.ceil(Math.log2(N)));},unit:'steps'},
    {op:'Redirect (end-to-end)',sub:'the hot path',bigo:'o1',count:function(){return 1;},unit:'step'}
  ];
  var labels={o1:'O(1)',olog:'O(log n)',on:'O(n)'};
  function render(){
    var N=Math.pow(10,Number(range.value)+1);nEl.textContent=fmt(N);
    rowsEl.innerHTML='';
    ops.forEach(function(o){
      var c=o.count(N);
      var col=o.bigo==='o1'?C.pass:o.bigo==='olog'?C.olog:C.bits;
      rowsEl.appendChild(el('div','cx-row',
        '<div class="cx-op">'+o.op+'<br><span class="cx-sub">'+o.sub+'</span></div>'+
        '<span class="bigo '+o.bigo+'">'+labels[o.bigo]+'</span>'+
        '<div class="cx-count" style="color:'+col+'">'+c+' '+o.unit+'</div>'));
    });
    foot.innerHTML='At <b>'+fmt(N)+'</b> links, the redirect is still <b style="color:var(--pass)">1 step</b>. Encode/lookup grow logarithmically; nothing on the hot path is linear.';
  }
  range.addEventListener('input',render);
  render();
})();

onScroll();
})();
