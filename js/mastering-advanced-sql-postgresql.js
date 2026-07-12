(function(){
"use strict";
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function byId(id){return document.getElementById(id);}
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
var C={acc:'#7C9CFF',join:'#56C7FF',agg:'#4ED66B',grp:'#E8B341',set:'#F2973C',done:'#4ED66B',fail:'#ED4E6E',
       ink:'#E8ECF8',soft:'#B7C0D8',mut:'#7E88A4',faint:'#565F79',border:'rgba(140,160,205,0.26)'};
function svgText(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill||C.mut,'font-size':size||12,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function Runner(){this.q=[];this.t=null;}
Runner.prototype.add=function(fn,delay){this.q.push({fn:fn,delay:reduceMotion?0:delay});return this;};
Runner.prototype.run=function(done){var self=this;(function step(){if(!self.q.length){if(done)done();return;}var it=self.q.shift();if(it.fn)it.fn();self.t=setTimeout(step,it.delay);})();};
Runner.prototype.cancel=function(){clearTimeout(this.t);this.q=[];};

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
  var m=mk('marker',{id:'hm',markerWidth:8,markerHeight:8,refX:6,refY:3,orient:'auto'});
  m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:C.faint}));svg.appendChild(m);
  svg.appendChild(mk('rect',{x:28,y:64,width:138,height:122,rx:10,fill:'rgba(0,0,0,0.16)',stroke:C.border,'stroke-width':1}));
  for(var r=0;r<5;r++)for(var c=0;c<7;c++){
    svg.appendChild(mk('circle',{cx:46+c*16,cy:88+r*17,r:2.6,fill:(r*7+c)%9===0?C.acc:'rgba(140,160,205,0.45)'}));
  }
  svg.appendChild(svgText(97,206,'clicks · 1,204,392 rows',C.faint,10));
  var stages=[['JOIN',C.join],['WHERE',C.agg],['GROUP BY',C.grp],['WINDOW',C.acc]];
  stages.forEach(function(s,i){
    var x=180+i*120;
    svg.appendChild(mk('path',{d:'M'+x+' 106 L'+(x+92)+' 106 L'+(x+106)+' 122 L'+(x+92)+' 138 L'+x+' 138 L'+(x+14)+' 122 Z',
      fill:'rgba(0,0,0,0.18)',stroke:s[1],'stroke-width':1.4}));
    svg.appendChild(svgText(x+56,126.5,s[0],s[1],11.5,'middle','700'));
  });
  svg.appendChild(mk('line',{x1:166,y1:122,x2:176,y2:122,stroke:C.faint,'stroke-width':1.3,'marker-end':'url(#hm)'}));
  svg.appendChild(mk('line',{x1:648,y1:122,x2:670,y2:122,stroke:C.faint,'stroke-width':1.3,'marker-end':'url(#hm)'}));
  svg.appendChild(mk('rect',{x:676,y:64,width:158,height:150,rx:10,fill:'rgba(0,0,0,0.16)',stroke:C.acc,'stroke-width':1.4}));
  svg.appendChild(svgText(755,88,'TOP LINKS · TODAY',C.acc,10,'middle','700'));
  var rows=[['1','4C92',74],['2','launch',52],['3','docs',34]];
  rows.forEach(function(rw,i){
    var y=112+i*30;
    svg.appendChild(svgText(692,y+4,rw[0],C.grp,11,'middle','700'));
    svg.appendChild(svgText(704,y+4,rw[1],C.soft,10.5,'start'));
    svg.appendChild(mk('rect',{x:752,y:y-6,width:rw[2],height:12,rx:4,fill:C.acc,opacity:String(0.9-i*0.28)}));
  });
  svg.appendChild(svgText(755,206,'one indexed pass',C.faint,10));
  if(!reduceMotion){
    var dot=mk('circle',{r:5,fill:C.acc});
    dot.appendChild(mk('animateMotion',{dur:'2.8s',repeatCount:'indefinite',path:'M170 122 L670 122'}));
    svg.appendChild(dot);
  } else svg.appendChild(mk('circle',{cx:420,cy:122,r:5,fill:C.acc}));
})();

(function joinLab(){
  var lT=byId('joinLeftT');if(!lT)return;
  var rT=byId('joinRightT'),tabs=byId('joinTabs'),sqlEl=byId('joinSql'),out=byId('joinOut'),cnt=byId('joinCount'),foot=byId('joinFoot');
  var links=[{id:1,code:'4C92'},{id:2,code:'launch'},{id:3,code:'docs'},{id:4,code:'promo'}];
  var clicks=[{id:101,link:1,country:'ZA'},{id:102,link:1,country:'US'},{id:103,link:2,country:'DE'},{id:104,link:3,country:'ZA'},{id:105,link:9,country:'US'}];
  function tbl(head,rows){
    var h='<table class="mtab"><thead><tr>'+head.map(function(x){return '<th>'+x+'</th>';}).join('')+'</tr></thead><tbody>';
    rows.forEach(function(r){h+='<tr>'+r.map(function(v){return v==null?'<td class="nullcell">NULL</td>':'<td>'+v+'</td>';}).join('')+'</tr>';});
    return h+'</tbody></table>';
  }
  lT.innerHTML=tbl(['id','code'],links.map(function(l){return [l.id,l.code];}));
  rT.innerHTML=tbl(['id','link_id','country'],clicks.map(function(c){return [c.id,(c.link===9?'9 ✂':c.link),c.country];}));
  var KW=function(w){return '<span class="kw">'+w+'</span>';};
  var sqls={
    inner:KW('SELECT')+' l.code, c.id, c.country\n'+KW('FROM')+' links l\n'+KW('JOIN')+' clicks c '+KW('ON')+' c.link_id = l.id;',
    left:KW('SELECT')+' l.code, c.id, c.country\n'+KW('FROM')+' links l\n'+KW('LEFT JOIN')+' clicks c '+KW('ON')+' c.link_id = l.id;',
    right:KW('SELECT')+' l.code, c.id, c.country\n'+KW('FROM')+' links l\n'+KW('RIGHT JOIN')+' clicks c '+KW('ON')+' c.link_id = l.id;',
    full:KW('SELECT')+' l.code, c.id, c.country\n'+KW('FROM')+' links l\n'+KW('FULL OUTER JOIN')+' clicks c '+KW('ON')+' c.link_id = l.id;'
  };
  var notes={
    inner:['→ 4 rows · only matches survive','INNER keeps only matches. The unmatched rows the other joins preserve — with NULLs — are where the interesting questions live.'],
    left:['→ 5 rows · promo kept, clicks side NULL','promo survives with NULL on the click side — add WHERE c.id IS NULL and you\u2019ve written the anti-join: links never clicked.'],
    right:['→ 5 rows · the orphan click kept, link side NULL','Every click survives, including #105 whose link was deleted. RIGHT JOIN is just LEFT JOIN with the tables swapped — most teams write the LEFT form.'],
    full:['→ 6 rows · unmatched from BOTH sides kept','Both leftovers kept: the never-clicked link AND the orphaned click. FULL OUTER is the reconciliation join — "what doesn\u2019t line up between these two tables?"']
  };
  function rows(mode){
    var res=[];
    if(mode==='inner'||mode==='left'){
      links.forEach(function(l){
        var ms=clicks.filter(function(c){return c.link===l.id;});
        if(ms.length)ms.forEach(function(c){res.push([l.code,c.id,c.country]);});
        else if(mode==='left')res.push([l.code,null,null]);
      });
    } else if(mode==='right'){
      clicks.forEach(function(c){
        var l=links.filter(function(x){return x.id===c.link;})[0];
        res.push([l?l.code:null,c.id,c.country]);
      });
    } else {
      links.forEach(function(l){
        var ms=clicks.filter(function(c){return c.link===l.id;});
        if(ms.length)ms.forEach(function(c){res.push([l.code,c.id,c.country]);});
        else res.push([l.code,null,null]);
      });
      clicks.forEach(function(c){if(!links.some(function(x){return x.id===c.link;}))res.push([null,c.id,c.country]);});
    }
    return res;
  }
  function render(mode){
    sqlEl.innerHTML=sqls[mode];
    out.innerHTML=tbl(['links.code','clicks.id','country'],rows(mode));
    cnt.textContent=notes[mode][0];
    foot.innerHTML=notes[mode][1];
  }
  [].forEach.call(tabs.children,function(t){
    t.addEventListener('click',function(){[].forEach.call(tabs.children,function(x){x.classList.remove('on');});t.classList.add('on');render(t.dataset.join);});
  });
  render('inner');
})();

(function groupLab(){
  var tabs=byId('grpTabs');if(!tabs)return;
  var hv=byId('grpHaving'),hvVal=byId('grpHavingVal'),sqlEl=byId('grpSql'),bars=byId('grpBars'),cnt=byId('grpCount'),foot=byId('grpFoot');
  var data=[
    {country:'ZA',device:'mobile',link:'4C92'},{country:'ZA',device:'mobile',link:'4C92'},{country:'ZA',device:'desktop',link:'launch'},
    {country:'ZA',device:'mobile',link:'docs'},{country:'ZA',device:'desktop',link:'4C92'},{country:'US',device:'mobile',link:'launch'},
    {country:'US',device:'desktop',link:'4C92'},{country:'US',device:'mobile',link:'launch'},{country:'US',device:'tablet',link:'4C92'},
    {country:'DE',device:'mobile',link:'docs'},{country:'DE',device:'desktop',link:'launch'},{country:'BR',device:'mobile',link:'4C92'}
  ];
  var dim='country';
  var KW=function(w){return '<span class="kw">'+w+'</span>';};
  function render(){
    var h=Number(hv.value);hvVal.textContent=h;
    var col=dim==='link'?'code':dim;
    sqlEl.innerHTML=KW('SELECT')+' '+col+', <span class="fn">COUNT</span>(*) '+KW('AS')+' clicks\n'+KW('FROM')+' clicks\n'+KW('GROUP BY')+' '+col+
      (h>1?'\n'+KW('HAVING')+' <span class="fn">COUNT</span>(*) >= <span class="num">'+h+'</span>':'')+'\n'+KW('ORDER BY')+' clicks '+KW('DESC')+';';
    var buckets={};
    data.forEach(function(r){var k=r[dim];buckets[k]=(buckets[k]||0)+1;});
    var arr=Object.keys(buckets).map(function(k){return {k:k,n:buckets[k]};}).sort(function(a,b){return b.n-a.n;});
    var max=arr[0].n,kept=0;
    bars.innerHTML='';
    arr.forEach(function(b){
      var cut=b.n<h;if(!cut)kept++;
      var row=el('div','grp-row'+(cut?' cut':''),
        '<div class="grp-name">'+b.k+'</div>'+
        '<div class="grp-track"><div class="grp-fill" style="width:'+(b.n/max*100)+'%">'+b.n+'</div></div>'+
        '<div class="grp-count">COUNT(*) = '+b.n+(cut?' · ✂ HAVING':'')+'</div>');
      bars.appendChild(row);
    });
    cnt.textContent='→ '+arr.length+' groups from 12 rows · '+kept+' kept';
    foot.innerHTML='GROUP BY <b>'+col+'</b> folds 12 rows into '+arr.length+' buckets'+(h>1?'; HAVING keeps the '+kept+' that reach '+h+'.':'; every bucket clears a bar of 1.');
  }
  [].forEach.call(tabs.children,function(t){
    t.addEventListener('click',function(){[].forEach.call(tabs.children,function(x){x.classList.remove('on');});t.classList.add('on');dim=t.dataset.dim;render();});
  });
  hv.addEventListener('input',render);
  render();
})();

(function cteLab(){
  var chainEl=byId('cteChain');if(!chainEl)return;
  var status=byId('cteStatus'),foot=byId('cteFoot');
  var chain=[{code:'promo',dest:'snip.ly/launch'},{code:'launch',dest:'snip.ly/docs'},{code:'docs',dest:'snip.ly/4C92'},{code:'4C92',dest:'example.com/guide',ext:true}];
  var msgs=[
    'Base case: <b>WHERE code = \u2018promo\u2019</b> seeds the working set at depth 0.',
    'Iteration 1: the JOIN matches promo\u2019s url to a code → <b>launch</b> joins at depth 1.',
    'Iteration 2: launch\u2019s url matches again → <b>docs</b> at depth 2. Each pass UNION ALLs one more hop.',
    'Iteration 3: <b>4C92</b> points outside Snip — the next JOIN finds nothing. <b>Fixpoint reached</b> · final destination: example.com/guide'
  ];
  var step=0;
  function addNode(i){
    if(i>0)chainEl.appendChild(el('span','cte-arrow','→'));
    var n=chain[i];
    var node=el('div','cte-node'+(n.ext?' ext':''),'<b>'+n.code+'</b><span class="depth">depth '+i+(n.ext?' · ↗ external':'')+'</span>');
    chainEl.appendChild(node);
    setTimeout(function(){node.classList.add('show');},reduceMotion?0:30);
  }
  function paint(){
    status.className='stateline'+(step===3?' good':'');
    status.innerHTML=msgs[step];
    byId('cteStep').textContent=step>=3?'✓ fixpoint':'▸ run next iteration';
  }
  function reset(){chainEl.innerHTML='';step=0;addNode(0);paint();foot.innerHTML='Each iteration joins the newest rows against links again. When a pass adds nothing, the recursion is complete.';}
  byId('cteStep').addEventListener('click',function(){if(step<3){step++;addNode(step);paint();if(step===3)foot.innerHTML='Four rows out — code, url, depth for every hop. The same query resolves a chain of 2 or 200.';}});
  byId('cteReset').addEventListener('click',reset);
  reset();
})();

(function windowLab(){
  var tabs=byId('winTabs');if(!tabs)return;
  var sqlEl=byId('winSql'),legend=byId('winLegend'),table=byId('winTable'),foot=byId('winFoot');
  var rows=[
    {d:'Mon',c:'4C92',n:12},{d:'Tue',c:'4C92',n:18},{d:'Wed',c:'4C92',n:25},{d:'Thu',c:'4C92',n:31},
    {d:'Mon',c:'launch',n:25},{d:'Tue',c:'launch',n:9},{d:'Wed',c:'launch',n:14},{d:'Thu',c:'launch',n:18}
  ];
  var KW=function(w){return '<span class="kw">'+w+'</span>';};
  function compute(fn){
    if(fn==='rownum'){var i4=0,iL=0;return rows.map(function(r){return r.c==='4C92'?String(++i4):String(++iL);});}
    if(fn==='rank'){
      var sorted=rows.map(function(r){return r.n;}).sort(function(a,b){return b-a;});
      return rows.map(function(r){return String(sorted.indexOf(r.n)+1);});
    }
    if(fn==='sum'){var s4=0,sL=0;return rows.map(function(r){if(r.c==='4C92'){s4+=r.n;return String(s4);}sL+=r.n;return String(sL);});}
    var p4=null,pL=null;
    return rows.map(function(r){var v;if(r.c==='4C92'){v=p4;p4=r.n;}else{v=pL;pL=r.n;}return v==null?'∅':String(v);});
  }
  var meta={
    rownum:{col:'row_number',expr:'<span class="fn">ROW_NUMBER</span>() '+KW('OVER')+' ('+KW('PARTITION BY')+' code '+KW('ORDER BY')+' day)',part:true,
      foot:'ROW_NUMBER restarts at 1 inside each partition — a per-link sequence, with every original row still present.'},
    rank:{col:'place',expr:'<span class="fn">RANK</span>() '+KW('OVER')+' ('+KW('ORDER BY')+' clicks '+KW('DESC')+')',part:false,
      foot:'RANK sees all eight rows as one window: the two 25s share place 2, so place 3 never happens — ties, then the skip. The two 18s do it again at 4.'},
    sum:{col:'so_far',expr:'<span class="fn">SUM</span>(clicks) '+KW('OVER')+' ('+KW('PARTITION BY')+' code '+KW('ORDER BY')+' day)',part:true,
      foot:'The running total accumulates independently inside each partition — 4C92 climbs to 86 while launch climbs to 66. Rows intact, context added.'},
    lag:{col:'prev',expr:'<span class="fn">LAG</span>(clicks) '+KW('OVER')+' ('+KW('PARTITION BY')+' code '+KW('ORDER BY')+' day)',part:true,
      foot:'LAG pulls the previous row\u2019s value within the partition — day-over-day deltas in one pass. The first day has no yesterday: NULL, honestly.'}
  };
  function render(fn){
    var m=meta[fn],vals=compute(fn);
    sqlEl.innerHTML=KW('SELECT')+' day, code, clicks,\n       '+m.expr+' '+KW('AS')+' '+m.col+'\n'+KW('FROM')+' daily_clicks;';
    legend.innerHTML=m.part?
      '<span><span class="wl-dot" style="background:'+C.join+'"></span>partition: 4C92</span><span><span class="wl-dot" style="background:'+C.set+'"></span>partition: launch</span><span style="color:var(--ink-faint)">windows computed per partition</span>':
      '<span style="color:var(--ink-faint)">no PARTITION BY — one window over all 8 rows</span>';
    var counts={};if(fn==='rank')vals.forEach(function(v){counts[v]=(counts[v]||0)+1;});
    var h='<thead><tr><th>day</th><th>code</th><th>clicks</th><th class="wincol-h">'+m.col+'</th></tr></thead><tbody>';
    rows.forEach(function(r,i){
      var cls=m.part?(r.c==='4C92'?'p0':'p1'):'';
      var wcls='wincol'+(fn==='rank'&&counts[vals[i]]>1?' tie':'')+(vals[i]==='∅'?' nullcell':'');
      h+='<tr class="'+cls+'"><td>'+r.d+'</td><td>'+r.c+'</td><td>'+r.n+'</td><td class="'+wcls+'">'+vals[i]+'</td></tr>';
    });
    table.innerHTML=h+'</tbody>';
    foot.innerHTML=m.foot;
  }
  [].forEach.call(tabs.children,function(t){
    t.addEventListener('click',function(){[].forEach.call(tabs.children,function(x){x.classList.remove('on');});t.classList.add('on');render(t.dataset.fn);});
  });
  render('rownum');
})();

(function setLab(){
  var tabs=byId('setTabs');if(!tabs)return;
  var sqlEl=byId('setSql'),aEl=byId('setA'),bEl=byId('setB'),out=byId('setOut'),status=byId('setStatus'),foot=byId('setFoot');
  var A=['4C92','launch','docs','promo'],B=['launch','docs','zz9'];
  var KW=function(w){return '<span class="kw">'+w+'</span>';};
  function chips(list,into,resMode){
    into.innerHTML='';
    list.forEach(function(v){
      var both=A.indexOf(v)>-1&&B.indexOf(v)>-1;
      into.appendChild(el('span','schip'+(resMode?' res':(both?' both':'')),v));
    });
  }
  chips(A,aEl);chips(B,bEl);
  var ops={
    union:{res:['4C92','launch','docs','promo','zz9'],kw:'UNION',
      st:'5 distinct codes — total reach across both weeks (duplicates \u2018launch\u2019 and \u2018docs\u2019 merged)',
      foot:'UNION deduplicates: the two amber chips appear once in the result. UNION ALL would have returned 7 rows.'},
    intersect:{res:['launch','docs'],kw:'INTERSECT',
      st:'2 codes clicked in BOTH weeks — that\u2019s retention',
      foot:'INTERSECT keeps only what both queries returned. "Active both periods" is a one-word question in SQL.'},
    except:{res:['4C92','promo'],kw:'EXCEPT',
      st:'2 codes clicked this week but NOT last — new arrivals',
      foot:'EXCEPT is order-sensitive: this-week EXCEPT last-week gives arrivals; flip the operands and you\u2019d get the churned.'}
  };
  function render(op){
    var o=ops[op];
    sqlEl.innerHTML=KW('SELECT')+' code '+KW('FROM')+' week_now\n'+KW(o.kw)+'\n'+KW('SELECT')+' code '+KW('FROM')+' week_prev;';
    chips(o.res,out,true);
    status.className='stateline';status.innerHTML='→ '+o.st;
    foot.innerHTML=o.foot;
  }
  [].forEach.call(tabs.children,function(t){
    t.addEventListener('click',function(){[].forEach.call(tabs.children,function(x){x.classList.remove('on');});t.classList.add('on');render(t.dataset.op);});
  });
  render('union');
})();

(function jsonLab(){
  var tabs=byId('jsonTabs');if(!tabs)return;
  var sqlEl=byId('jsonSql'),doc=byId('jsonDoc'),out=byId('jsonOut'),foot=byId('jsonFoot');
  doc.innerHTML='{\n  <span class="jk">"utm"</span>: <span id="j-utm">{ <span class="jk">"source"</span>: <span id="j-src" class="js">"twitter"</span>, <span class="jk">"campaign"</span>: <span class="js">"launch"</span> }</span>,\n  <span class="jk">"tags"</span>: <span id="j-tags">[<span class="js">"social"</span>, <span class="js">"paid"</span>]</span>,\n  <span class="jk">"pinned"</span>: <span id="j-pin" class="jb">true</span>\n}';
  var qs={
    obj:{sql:'SELECT meta <span class="op">-></span> <span class="str">\'utm\'</span> FROM links WHERE code = <span class="str">\'4C92\'</span>;',
      hl:'j-utm',t:'jsonb',val:'{ "source": "twitter", "campaign": "launch" }',
      note:'still jsonb — chain more operators onto it',
      foot:'-> returns jsonb (still queryable); ->> returns text (comparable, and indexable with an expression index).'},
    text:{sql:'SELECT meta <span class="op">->></span> <span class="str">\'pinned\'</span> FROM links WHERE code = <span class="str">\'4C92\'</span>;',
      hl:'j-pin',t:'text',val:'true',
      note:'text now — the JSON quoting is gone',
      foot:'->> is the workhorse: extract as text, then compare it, cast it, or index it like any column.'},
    path:{sql:'SELECT meta <span class="op">#>></span> <span class="str">\'{utm,source}\'</span> FROM links WHERE code = <span class="str">\'4C92\'</span>;',
      hl:'j-src',t:'text',val:'twitter',
      note:'a path of keys, walked in one operator',
      foot:'#>> digs through nested objects — \u2018{utm,source}\u2019 is two levels in a single hop.'},
    contain:{sql:'SELECT code FROM links\nWHERE meta <span class="op">@></span> <span class="str">\'{"tags": ["paid"]}\'</span>;',
      hl:'j-tags',t:'bool',val:'✓ row matches',
      note:'containment — served by the GIN index',
      foot:'@> asks "does the document contain this fragment?" across millions of rows — exactly the question a GIN index answers fast.'}
  };
  function render(q){
    var o=qs[q];
    sqlEl.innerHTML=o.sql;
    ['j-utm','j-src','j-tags','j-pin'].forEach(function(id){byId(id).classList.toggle('jhl',id===o.hl);});
    out.innerHTML='<div class="jo-h">result <span class="jtype '+o.t+'">'+(o.t==='bool'?'boolean':o.t)+'</span></div><div>'+o.val+'</div><div style="color:var(--ink-muted);font-size:11px;margin-top:9px">'+o.note+'</div>';
    foot.innerHTML=o.foot;
  }
  [].forEach.call(tabs.children,function(t){
    t.addEventListener('click',function(){[].forEach.call(tabs.children,function(x){x.classList.remove('on');});t.classList.add('on');render(t.dataset.q);});
  });
  render('obj');
})();

(function explainLab(){
  var btn=byId('expIdx');if(!btn)return;
  var sqlEl=byId('expSql'),plan=byId('expPlan'),fill=byId('expFill'),lbl=byId('expMeterLbl'),cost=byId('expCost'),foot=byId('expFoot');
  var KW=function(w){return '<span class="kw">'+w+'</span>';};
  sqlEl.innerHTML=KW('EXPLAIN ANALYZE')+'\n'+KW('SELECT')+' * '+KW('FROM')+' clicks '+KW('WHERE')+' link_id = <span class="num">42</span>;';
  var idx=false;
  function render(){
    if(!idx){
      plan.innerHTML='<span class="pn-bad">Seq Scan</span> on clicks  <span class="pn-dim">(cost=0.00..21694.90 rows=52 width=41)</span>\n  Filter: (link_id = 42)\n  Rows Removed by Filter: 1204340\n<span class="pn-dim">Planning Time: 0.11 ms</span>\n<span class="pn-bad">Execution Time: 142.733 ms</span>';
      fill.className='exp-fill bad';fill.style.width='100%';
      lbl.textContent='1,204,392 of 1,204,392';
      cost.className='stateline bad';cost.innerHTML='Full scan: every row read, 52 kept — <b>142.7 ms</b>.';
      btn.textContent='CREATE INDEX idx_clicks_link_id';
      foot.innerHTML='Without an index the only strategy is reading everything. The B-tree turns "scan 1.2M rows" into "walk to the 52 that match."';
    } else {
      plan.innerHTML='<span class="pn-good">Index Scan</span> using idx_clicks_link_id on clicks\n  <span class="pn-dim">(cost=0.42..60.31 rows=52 width=41)</span>\n  Index Cond: (link_id = 42)\n<span class="pn-dim">Planning Time: 0.09 ms</span>\n<span class="pn-good">Execution Time: 0.081 ms</span>';
      fill.className='exp-fill good';fill.style.width='1.2%';
      lbl.textContent='52 of 1,204,392';
      cost.className='stateline good';cost.innerHTML='Index scan: 52 rows touched — <b>0.081 ms</b>, ~1,760× faster.';
      btn.textContent='DROP INDEX idx_clicks_link_id';
      foot.innerHTML='Same query, new plan: the planner walks the B-tree straight to the matching rows. That\u2019s the O(log n) from <b>Big O</b>, live in production.';
    }
  }
  btn.addEventListener('click',function(){idx=!idx;render();});
  render();
})();

(function txnLab(){
  var stepBtn=byId('txnStep');if(!stepBtn)return;
  var modeBtn=byId('txnMode'),colA=byId('txnA'),colB=byId('txnB'),state=byId('txnState'),foot=byId('txnFoot');
  var NUMS=['①','②','③','④','⑤','⑥','⑦','⑧','⑨'];
  var scripts={
    naive:[
      ['a','BEGIN;','a'],
      ['a','SELECT clicks WHERE id = 42;  → <b>10</b>','a'],
      ['b','BEGIN;','b'],
      ['b','SELECT clicks WHERE id = 42;  → <b>10</b>','b'],
      ['a','UPDATE … SET clicks = <b>11</b>;','a'],
      ['a','COMMIT; ✓','a ok'],
      ['b','UPDATE … SET clicks = <b>11</b>;  <span style="color:var(--ink-faint)">(from its stale 10)</span>','b'],
      ['b','COMMIT; ✓','b ok']
    ],
    safe:[
      ['a','BEGIN;','a'],
      ['a','SELECT … <b>FOR UPDATE</b>;  → <b>10</b> 🔒','a'],
      ['b','BEGIN;','b'],
      ['b','SELECT … <b>FOR UPDATE</b>;  ⏳ blocked by A\u2019s lock','b blocked'],
      ['a','UPDATE … SET clicks = <b>11</b>;','a'],
      ['a','COMMIT; ✓  <span style="color:var(--ink-faint)">(lock released)</span>','a ok'],
      ['b','…unblocked → reads <b>11</b>','b'],
      ['b','UPDATE … SET clicks = <b>12</b>;','b'],
      ['b','COMMIT; ✓','b ok']
    ]
  };
  var mode='naive',i=0;
  function reset(){
    colA.innerHTML='';colB.innerHTML='';i=0;
    state.className='stateline';state.innerHTML='row 42 · committed clicks = <b>10</b>';
    stepBtn.textContent='▸ next statement';
    foot.innerHTML=mode==='naive'?
      'Both sessions read 10, both write 11 — one increment vanishes. Concurrency bugs don\u2019t throw exceptions; they lose data quietly.':
      'Same race, but now the row lock forces B to wait its turn.';
  }
  function step(){
    var s=scripts[mode];
    if(i>=s.length)return;
    var st=s[i];
    var row=el('div','txn-row '+st[2],NUMS[i]+'  '+st[1]);
    (st[0]==='a'?colA:colB).appendChild(row);
    setTimeout(function(){row.classList.add('show');},reduceMotion?0:20);
    i++;
    var committed=i>=6?11:10;
    if(i>=s.length){
      if(mode==='naive'){
        state.className='stateline bad';
        state.innerHTML='final clicks = <b>11</b> — B\u2019s write erased A\u2019s: one increment LOST';
        foot.innerHTML='Neither session errored, both committed — and the counter is wrong. This is the lost update, and it\u2019s happening in codebases everywhere right now.';
      } else {
        state.className='stateline good';
        state.innerHTML='final clicks = <b>12</b> — both increments kept · the lock serialized the race';
        foot.innerHTML='B couldn\u2019t read until A finished, so its increment built on 11. FOR UPDATE turns read-then-write into a critical section — and <code class="tok">SET clicks = clicks + 1</code> avoids the read entirely.';
      }
      stepBtn.textContent='✓ done';
    } else {
      state.className='stateline';
      state.innerHTML='row 42 · committed clicks = <b>'+committed+'</b>'+(mode==='safe'&&i===4?' · B is <b>waiting</b>':'');
    }
  }
  stepBtn.addEventListener('click',step);
  modeBtn.addEventListener('click',function(){
    mode=mode==='naive'?'safe':'naive';
    modeBtn.textContent=mode==='naive'?'fix: SELECT FOR UPDATE':'break it again: naive read';
    modeBtn.classList.toggle('primary',mode==='safe');
    reset();
  });
  byId('txnReset').addEventListener('click',reset);
  reset();
})();

onScroll();
})();
