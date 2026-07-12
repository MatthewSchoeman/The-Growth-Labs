(function(){
"use strict";
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function byId(id){return document.getElementById(id);}
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
function clearSVG(s){while(s.firstChild)s.removeChild(s.firstChild);}
var C={entity:'#A78BFA',context:'#7C9CFF',map:'#56C7FF',query:'#4ED66B',track:'#E8B341',save:'#5BD6C2',rel:'#ED6E9E',migrate:'#F2973C',
       ink:'#E8ECF8',soft:'#B7C0D8',mut:'#7E88A4',faint:'#565F79',ok:'#4ED66B',bad:'#ED4E6E',warn:'#F2973C',compare:'#E8C53D',
       line:'rgba(140,160,205,0.4)',lineFaint:'rgba(140,160,205,0.2)',surface:'#161E32',border:'rgba(140,160,205,0.26)'};
var T={kw:'#C792EA',m:'#4ED66B',str:'#E2B96B',num:'#E78B8B',txt:'#B7C0D8',op:'#7E88A4',k:'#7CA8FF',col:'#5BD6C2',tbl:'#E8B341'};

function Runner(){this.q=[];this.t=null;this.busy=false;}
Runner.prototype.add=function(fn,delay){this.q.push({fn:fn,delay:reduceMotion?0:delay});return this;};
Runner.prototype.run=function(done){var self=this;this.busy=true;(function step(){if(!self.q.length){self.busy=false;if(done)done();return;}var it=self.q.shift();if(it.fn)it.fn();self.t=setTimeout(step,it.delay);})();};
Runner.prototype.cancel=function(){clearTimeout(this.t);this.q=[];this.busy=false;};

function svgText(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill||C.mut,'font-size':size||12,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
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
  function line(x,y,segs){var t=mk('text',{x:x,y:y,'font-family':'IBM Plex Mono, monospace','font-size':13});segs.forEach(function(s){var ts=document.createElementNS(NS,'tspan');ts.setAttribute('fill',s[1]);if(s[2])ts.setAttribute('font-weight',s[2]);ts.setAttribute('xml:space','preserve');ts.textContent=s[0];t.appendChild(ts);});return t;}
  svg.appendChild(svgText(150,42,'you write',C.faint,11,'middle'));
  svg.appendChild(svgText(610,42,'EF runs',C.faint,11,'middle'));
  svg.appendChild(line(34,86,[['db',T.txt],['.',T.op],['Products',T.txt]]));
  svg.appendChild(line(34,110,[['  .',T.op],['Where',T.m,'600'],['(p ',T.txt],['=> ',T.op],['p.Price ',T.txt],['< ',T.op],['50',T.num],[')',T.op]]));
  svg.appendChild(line(34,134,[['  .',T.op],['ToList',T.m,'600'],['();',T.op]]));
  svg.appendChild(mk('rect',{x:336,y:84,width:128,height:48,rx:11,fill:'rgba(167,139,250,0.08)',stroke:C.entity,'stroke-width':1.4}));
  svg.appendChild(svgText(400,106,'EF Core',C.entity,13,'middle','700'));
  svg.appendChild(svgText(400,121,'DbContext',C.faint,9.5,'middle'));
  svg.appendChild(line(500,86,[['SELECT ',T.k,'600'],['Id, Name, Price',T.col]]));
  svg.appendChild(line(500,110,[['FROM ',T.k,'600'],['Products',T.tbl]]));
  svg.appendChild(line(500,134,[['WHERE ',T.k,'600'],['Price ',T.col],['< ',T.op],['50',T.num]]));
  var dbx=792;
  svg.appendChild(mk('path',{d:'M'+(dbx-32)+' 78 L'+(dbx-32)+' 132 A32 9 0 0 0 '+(dbx+32)+' 132 L'+(dbx+32)+' 78',fill:'rgba(124,156,255,0.07)',stroke:C.context,'stroke-width':1.4}));
  svg.appendChild(mk('ellipse',{cx:dbx,cy:78,rx:32,ry:9,fill:'rgba(124,156,255,0.12)',stroke:C.context,'stroke-width':1.4}));
  svg.appendChild(mk('path',{d:'M'+(dbx-32)+' 96 A32 9 0 0 0 '+(dbx+32)+' 96',fill:'none',stroke:C.context,'stroke-width':1,opacity:0.5}));
  svg.appendChild(svgText(dbx,160,'database',C.context,10,'middle'));
  function arrowMark(id,color){var m=mk('marker',{id:id,markerWidth:7,markerHeight:7,refX:5,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L5 3L0 6Z',fill:color}));svg.appendChild(m);}
  arrowMark('ar1',C.entity);arrowMark('ar2',C.query);arrowMark('ar3',C.context);
  svg.appendChild(mk('line',{x1:300,y1:108,x2:330,y2:108,stroke:C.entity,'stroke-width':1.4,'marker-end':'url(#ar1)'}));
  svg.appendChild(mk('line',{x1:470,y1:108,x2:494,y2:108,stroke:C.query,'stroke-width':1.4,'marker-end':'url(#ar2)'}));
  svg.appendChild(mk('line',{x1:690,y1:108,x2:752,y2:108,stroke:C.query,'stroke-width':1.4,'marker-end':'url(#ar3)'}));
  var retPath='M788 150 C788 218 700 224 420 224 L150 224 C96 224 96 196 116 170';
  svg.appendChild(mk('path',{d:retPath,fill:'none',stroke:C.query,'stroke-width':1.2,'stroke-dasharray':'4 4',opacity:0.5}));
  svg.appendChild(svgText(440,244,'rows come back as Product objects',C.faint,11,'middle'));
  if(!reduceMotion){
    var qd=mk('circle',{r:4,fill:C.entity});
    var am=mk('animateMotion',{dur:'2.4s',repeatCount:'indefinite',path:'M280 108 L788 108',rotate:'0',keyPoints:'0;1',keyTimes:'0;1',calcMode:'linear'});
    qd.appendChild(am);svg.appendChild(qd);
    for(var i=0;i<3;i++){(function(i){
      var rd=mk('circle',{r:3.5,fill:C.query});
      var rm=mk('animateMotion',{dur:'2.4s',begin:(i*0.5)+'s',repeatCount:'indefinite',path:retPath});
      rd.appendChild(rm);svg.appendChild(rd);
    })(i);}
  } else {
    svg.appendChild(mk('circle',{cx:540,cy:108,r:4,fill:C.entity}));
    svg.appendChild(mk('circle',{cx:400,cy:224,r:3.5,fill:C.query}));
  }
})();

(function mapLab(){
  var classEl=byId('mapClass'),tableEl=byId('mapTable'),togEl=byId('mapToggles'),foot=byId('mapFoot');
  if(!classEl)return;
  var st={maxlen:false,required:false,rename:false,notmapped:false};
  var props=[
    {name:'Id',cs:'int',pk:true},
    {name:'Title',cs:'string'},
    {name:'Summary',cs:'string?'},
    {name:'Price',cs:'decimal'},
    {name:'Slug',cs:'string'}
  ];
  function renderClass(){
    classEl.innerHTML='';
    props.forEach(function(p){
      classEl.appendChild(el('div','map-row'+(p.pk?' pk':''),'<span class="mr-name">'+p.name+'</span><span class="mr-type">'+p.cs+'</span>'));
    });
  }
  function col(name,type,nn,cls){return '<div class="map-row '+(cls||'')+'"><span class="mr-name">'+name+'</span><span class="mr-type">'+type+(nn?' · NOT NULL':' · NULL')+'</span></div>';}
  function renderTable(changedKey){
    var rows='';
    rows+='<div class="map-row pk"><span class="mr-name">Id</span><span class="mr-type">int · PK</span></div>';
    rows+=col('Title','nvarchar('+(st.maxlen?'200':'max')+')',true,st.maxlen&&changedKey==='maxlen'?'changed':'');
    rows+=col('Summary','nvarchar(max)',st.required,st.required&&changedKey==='required'?'changed':'');
    rows+=col(st.rename?'Cost':'Price','decimal(18,2)',true,st.rename&&changedKey==='rename'?'changed':'');
    if(!st.notmapped) rows+=col('Slug','nvarchar(max)',true,'');
    tableEl.innerHTML=rows;
  }
  var toggles=[
    {k:'maxlen',label:'[MaxLength(200)] Title'},
    {k:'required',label:'[Required] Summary'},
    {k:'rename',label:'[Column("Cost")] Price'},
    {k:'notmapped',label:'[NotMapped] Slug'}
  ];
  var foots={
    maxlen:['Title is now <b>nvarchar(200)</b> — a length cap instead of unbounded text.','Title back to <b>nvarchar(max)</b> by convention.'],
    required:['Summary became <b>NOT NULL</b> — [Required] overrode the nullable <code class="tok">string?</code>.','Summary back to <b>NULL</b> (it\u2019s a <code class="tok">string?</code>).'],
    rename:['The column is now named <b>Cost</b>, though the property stays <code class="tok">Price</code>.','Column name back to <b>Price</b> by convention.'],
    notmapped:['<b>Slug has no column</b> — [NotMapped] keeps it C#-only.','Slug is mapped to a column again.']
  };
  function build(){
    togEl.innerHTML='';
    toggles.forEach(function(t){
      var b=el('div','map-tog'+(st[t.k]?' on':''),t.label);
      b.addEventListener('click',function(){
        st[t.k]=!st[t.k];b.classList.toggle('on',st[t.k]);
        renderTable(t.k);
        foot.innerHTML=foots[t.k][st[t.k]?0:1];
      });
      togEl.appendChild(b);
    });
  }
  renderClass();renderTable();build();
})();

(function queryLab(){
  var clausesEl=byId('linqClauses'),linqEl=byId('qLinq'),sqlEl=byId('qSql'),countEl=byId('linqCount'),headEl=byId('linqHead'),bodyEl=byId('linqBody'),foot=byId('linqFoot');
  if(!clausesEl)return;
  var data=[
    {Name:'Keyboard',Category:'Tech',Price:45,Stock:12},{Name:'Mouse',Category:'Tech',Price:25,Stock:30},
    {Name:'Desk',Category:'Home',Price:120,Stock:5},{Name:'Lamp',Category:'Home',Price:35,Stock:18},
    {Name:'Monitor',Category:'Tech',Price:90,Stock:8},{Name:'Chair',Category:'Home',Price:75,Stock:10},
    {Name:'Cable',Category:'Tech',Price:8,Stock:50}
  ];
  var state={where:{on:true,field:'Price',op:'<',val:'50'},order:{on:true,field:'Price',dir:'asc'},select:{on:false,proj:'Name'},take:{on:false,n:'3'}};
  function numField(f){return f==='Price'||f==='Stock';}
  function clauseRow(key,title,body){var on=state[key].on;var r=el('div','linq-clause '+(on?'on':'off'));r.innerHTML='<div class="lc-toggle" data-tog="'+key+'">.'+title+'()</div><div class="lc-body">'+body+'</div>';return r;}
  function build(){
    clausesEl.innerHTML='';
    var w=state.where,opOpts=numField(w.field)?['<','>','>=']:['==','!='];
    if(!numField(w.field)&&w.op!=='=='&&w.op!=='!=')w.op='==';
    if(numField(w.field)&&!(w.op==='<'||w.op==='>'||w.op==='>='))w.op='<';
    var valCtrl=numField(w.field)?'<input id="lqWval" type="number" value="'+w.val+'" style="width:64px">':'<select id="lqWval"><option'+(w.val==='Tech'?' selected':'')+'>Tech</option><option'+(w.val==='Home'?' selected':'')+'>Home</option></select>';
    clausesEl.appendChild(clauseRow('where','Where','p =&gt; p.<select id="lqWfield">'+['Price','Stock','Category'].map(function(f){return '<option'+(w.field===f?' selected':'')+'>'+f+'</option>';}).join('')+'</select> <select id="lqWop">'+opOpts.map(function(o){return '<option'+(w.op===o?' selected':'')+'>'+o+'</option>';}).join('')+'</select> '+valCtrl));
    var o=state.order;
    clausesEl.appendChild(clauseRow('order','OrderBy','p =&gt; p.<select id="lqOfield">'+['Price','Name','Stock'].map(function(f){return '<option'+(o.field===f?' selected':'')+'>'+f+'</option>';}).join('')+'</select> <select id="lqOdir"><option value="asc"'+(o.dir==='asc'?' selected':'')+'>ascending</option><option value="desc"'+(o.dir==='desc'?' selected':'')+'>descending</option></select>'));
    var s=state.select;
    clausesEl.appendChild(clauseRow('select','Select','p =&gt; <select id="lqSproj"><option value="Name"'+(s.proj==='Name'?' selected':'')+'>p.Name</option><option value="NamePrice"'+(s.proj==='NamePrice'?' selected':'')+'>new { p.Name, p.Price }</option><option value="all"'+(s.proj==='all'?' selected':'')+'>p (all columns)</option></select>'));
    var tk=state.take;
    clausesEl.appendChild(clauseRow('take','Take','<input id="lqTn" type="number" value="'+tk.n+'" style="width:56px"> rows'));
    wire();
  }
  function wire(){
    [].forEach.call(clausesEl.querySelectorAll('[data-tog]'),function(t){t.addEventListener('click',function(){state[t.dataset.tog].on=!state[t.dataset.tog].on;build();recompute();});});
    var bind=function(id,obj,prop,rebuild){var e=byId(id);if(e)e.addEventListener('change',function(){obj[prop]=e.value;if(rebuild)build();recompute();});};
    bind('lqWfield',state.where,'field',true);bind('lqWop',state.where,'op',false);bind('lqWval',state.where,'val',false);
    bind('lqOfield',state.order,'field',false);bind('lqOdir',state.order,'dir',false);bind('lqSproj',state.select,'proj',false);bind('lqTn',state.take,'n',false);
  }
  function applyQuery(){
    var rows=data.slice();
    if(state.where.on){var w=state.where;rows=rows.filter(function(r){if(w.field==='Category')return w.op==='=='?r.Category===w.val:r.Category!==w.val;var v=r[w.field],t=parseFloat(w.val);return w.op==='<'?v<t:w.op==='>'?v>t:v>=t;});}
    if(state.order.on){var o=state.order;rows.sort(function(a,b){var av=a[o.field],bv=b[o.field];var c=av<bv?-1:av>bv?1:0;return o.dir==='desc'?-c:c;});}
    if(state.take.on){rows=rows.slice(0,Math.max(0,parseInt(state.take.n,10)||0));}
    return rows;
  }
  function cols(){if(state.select.on&&state.select.proj==='Name')return['Name'];if(state.select.on&&state.select.proj==='NamePrice')return['Name','Price'];return['Name','Category','Price','Stock'];}
  function renderLinq(){
    var L=['<span class="v">db</span>.<span class="v">Products</span>'];
    if(state.where.on){var w=state.where,val=w.field==='Category'?'<span class="s">"'+w.val+'"</span>':'<span class="n">'+w.val+'</span>';L.push('    .<span class="m">Where</span>(p =&gt; p.'+w.field+' '+esc(w.op)+' '+val+')');}
    if(state.order.on){var o=state.order;L.push('    .<span class="m">'+(o.dir==='desc'?'OrderByDescending':'OrderBy')+'</span>(p =&gt; p.'+o.field+')');}
    if(state.select.on){var s=state.select,pj=s.proj==='Name'?'p.Name':s.proj==='NamePrice'?'new { p.Name, p.Price }':'p';L.push('    .<span class="m">Select</span>(p =&gt; '+pj+')');}
    if(state.take.on){L.push('    .<span class="m">Take</span>(<span class="n">'+(parseInt(state.take.n,10)||0)+'</span>)');}
    L.push('    .<span class="m">ToList</span>();');
    linqEl.innerHTML=L.join('\n');
  }
  function renderSql(){
    var c=cols(),sel=state.select.on?c.map(function(x){return 'p.'+x;}).join(', '):'p.'+['Id'].concat(c).join(', p.');
    var L=['<span class="k">SELECT</span> '+sel,'<span class="k">FROM</span> <span class="t">Products</span> <span class="k">AS</span> p'];
    if(state.where.on){var w=state.where,val=w.field==='Category'?'<span class="s">N\''+w.val+'\'</span>':'<span class="n">'+w.val+'</span>';var op=w.op==='=='?'=':w.op==='!='?'<>':esc(w.op);L.push('<span class="k">WHERE</span> p.'+w.field+' '+op+' '+val);}
    if(state.order.on){var o=state.order;L.push('<span class="k">ORDER BY</span> p.'+o.field+(o.dir==='desc'?' <span class="k">DESC</span>':''));}
    if(state.take.on){L.push('<span class="k">LIMIT</span> <span class="n">'+(parseInt(state.take.n,10)||0)+'</span>');}
    sqlEl.innerHTML=L.join('\n');
  }
  function renderResults(rows){
    var c=cols();
    headEl.innerHTML='<tr>'+c.map(function(x){return '<th>'+x+'</th>';}).join('')+'</tr>';
    bodyEl.innerHTML=rows.map(function(r){return '<tr>'+c.map(function(x){return '<td'+(x==='Price'?' class="mono"':'')+'>'+(x==='Price'?'$'+r[x]:r[x])+'</td>';}).join('')+'</tr>';}).join('');
    countEl.textContent=rows.length+' row'+(rows.length===1?'':'s');
  }
  function recompute(){var rows=applyQuery();renderLinq();renderSql();renderResults(rows);foot.innerHTML='EF ran one statement and returned <b style="color:var(--query)">'+rows.length+'</b> row'+(rows.length===1?'':'s')+' as objects.';}
  build();recompute();
})();

(function relLab(){
  var blogsEl=byId('relBlogs'),postsEl=byId('relPosts'),navEl=byId('relNav'),sqlEl=byId('relSql'),foot=byId('relFoot');
  if(!blogsEl)return;
  var blogs=[{Id:1,Title:'Cooking'},{Id:2,Title:'Travel'}];
  var posts=[{Id:1,Title:'Pasta',BlogId:1},{Id:2,Title:'Sourdough',BlogId:1},{Id:3,Title:'Tokyo',BlogId:2}];
  var mode='blogsonly';
  function render(){
    blogsEl.innerHTML=blogs.map(function(b){return '<div class="rel-rec'+(mode==='include'?' linked':'')+'">#'+b.Id+' "'+b.Title+'"</div>';}).join('');
    postsEl.innerHTML=posts.map(function(p){return '<div class="rel-rec '+(mode==='include'?'loaded':'dim')+'">#'+p.Id+' "'+p.Title+'" <span class="rr-fk">BlogId='+p.BlogId+'</span></div>';}).join('');
    if(mode==='blogsonly'){
      navEl.innerHTML='blog.Posts → <b style="color:var(--ink-faint)">not loaded</b> (navigation is empty)';
      sqlEl.innerHTML='<span class="k">SELECT</span> b.<span class="c">Id</span>, b.<span class="c">Title</span>\n<span class="k">FROM</span> <span class="t">Blogs</span> <span class="k">AS</span> b<span class="cm">   -- posts never fetched</span>';
      foot.innerHTML='Loading blogs alone runs one simple <code class="tok">SELECT</code> — <b>posts aren\u2019t loaded</b> at all.';
    } else {
      navEl.innerHTML='blog #1.Posts → <b>[Pasta, Sourdough]</b> · blog #2.Posts → <b>[Tokyo]</b>';
      sqlEl.innerHTML='<span class="k">SELECT</span> b.<span class="c">Id</span>, b.<span class="c">Title</span>, p.<span class="c">Id</span>, p.<span class="c">Title</span>, p.<span class="c">BlogId</span>\n<span class="k">FROM</span> <span class="t">Blogs</span> <span class="k">AS</span> b\n<span class="k">LEFT JOIN</span> <span class="t">Posts</span> <span class="k">AS</span> p <span class="k">ON</span> p.<span class="c">BlogId</span> = b.<span class="c">Id</span>\n<span class="k">ORDER BY</span> b.<span class="c">Id</span>';
      foot.innerHTML='<code class="tok">Include</code> adds a <b style="color:var(--rel)">LEFT JOIN</b> so every post arrives in the <b>same</b> query.';
    }
  }
  [].forEach.call(document.querySelectorAll('#relLab [data-rl]'),function(b){
    b.addEventListener('click',function(){[].forEach.call(document.querySelectorAll('#relLab [data-rl]'),function(x){x.classList.remove('primary');});b.classList.add('primary');mode=b.dataset.rl;render();});
  });
  render();
})();

(function trackLab(){
  var listEl=byId('trackList'),sumEl=byId('trackSummary'),foot=byId('trackFoot');
  if(!listEl)return;
  var nextId=3,ents=[];
  function reset(){nextId=3;ents=[{id:1,label:'Blog #1',sub:'Title: "Cooking"',state:'unchanged'},{id:2,label:'Blog #2',sub:'Title: "Travel"',state:'unchanged'}];render();foot.innerHTML='Each action changes an entity\u2019s state in the tracker — but the database is untouched until you save.';}
  function badge(s){return '<span class="state-badge '+s+'">'+s.charAt(0).toUpperCase()+s.slice(1)+'</span>';}
  function render(flashId){
    listEl.innerHTML='';
    ents.forEach(function(e){
      var row=el('div','track-row '+(e.state==='deleted'?'deleted':'')+(flashId===e.id?' flash':''),'<span class="tr-ent">'+e.label+'<div class="tr-sub">'+e.sub+'</div></span>'+badge(e.state));
      listEl.appendChild(row);
      if(flashId===e.id)setTimeout(function(){row.classList.remove('flash');},700);
    });
    var c={unchanged:0,modified:0,added:0,deleted:0};ents.forEach(function(e){c[e.state]++;});
    var ops=[];if(c.added)ops.push(c.added+' INSERT');if(c.modified)ops.push(c.modified+' UPDATE');if(c.deleted)ops.push(c.deleted+' DELETE');
    sumEl.innerHTML='Tracker: '+c.unchanged+' Unchanged · '+c.modified+' Modified · '+c.added+' Added · '+c.deleted+' Deleted<br><span style="color:var(--accent)">SaveChanges() would run: '+(ops.length?ops.join(' · '):'nothing')+'</span>';
  }
  byId('trackEdit').addEventListener('click',function(){
    var e=ents.filter(function(x){return x.state==='unchanged';})[0];
    if(!e){foot.innerHTML='No Unchanged blog left to edit — reset to try again.';return;}
    e.state='modified';e.sub='Title: "'+(e.id===1?'Cooking':'Travel')+'" → "'+(e.id===1?'Cooking & Baking':'World Travel')+'" ✦';
    render(e.id);foot.innerHTML='Edited a property → state is now <b style="color:var(--track)">Modified</b>. The change lives only in memory.';
  });
  byId('trackAdd').addEventListener('click',function(){
    var id=nextId++;ents.push({id:id,label:'Blog #'+id,sub:'Title: "Gardening" (new)',state:'added'});
    render(id);foot.innerHTML='A new object you <code class="tok">Add</code>ed is tracked as <b style="color:var(--st-ok)">Added</b> — it has no row yet.';
  });
  byId('trackDelete').addEventListener('click',function(){
    var e=ents.filter(function(x){return x.state==='unchanged';})[0]||ents.filter(function(x){return x.state==='modified';})[0];
    if(!e){foot.innerHTML='Nothing to remove — reset to try again.';return;}
    e.state='deleted';render(e.id);foot.innerHTML='Marked for removal → state is <b style="color:var(--st-bad)">Deleted</b>. The row goes only when you save.';
  });
  byId('trackReset').addEventListener('click',reset);
  reset();
})();

(function saveLab(){
  var pendEl=byId('savePending'),sqlEl=byId('saveSql'),beginEl=byId('saveBegin'),commitEl=byId('saveCommit'),foot=byId('saveFoot');
  if(!pendEl)return;
  var saved=false;
  var pend=[
    {label:'Blog "Gardening"',sub:'a new object',state:'added'},
    {label:'Blog #1',sub:'Title changed',state:'modified'},
    {label:'Blog #2',sub:'removed',state:'deleted'}
  ];
  var stmts=[
    {cls:'insert',verb:'INSERT',rest:' INTO Blogs (Title) VALUES (N\'Gardening\');',note:' -- key 3 flows back to the object'},
    {cls:'update',verb:'UPDATE',rest:' Blogs SET Title = N\'Cooking & Baking\' WHERE Id = 1;',note:' -- only the changed column'},
    {cls:'delete',verb:'DELETE',rest:' FROM Blogs WHERE Id = 2;',note:''}
  ];
  function badge(s){return '<span class="state-badge '+s+'">'+s.charAt(0).toUpperCase()+s.slice(1)+'</span>';}
  function renderPending(){pendEl.innerHTML=pend.map(function(p){return '<div class="track-row">'+'<span class="tr-ent">'+p.label+'<div class="tr-sub">'+p.sub+'</div></span>'+badge(p.state)+'</div>';}).join('');}
  function reset(){saved=false;renderPending();sqlEl.innerHTML='';beginEl.style.opacity='0';commitEl.style.opacity='0';foot.innerHTML='Three tracked changes become three statements in one atomic transaction — then states reset to Unchanged.';}
  var run=new Runner();
  byId('saveBtn').addEventListener('click',function(){
    if(saved)return;saved=true;run.cancel();sqlEl.innerHTML='';
    sqlEl.innerHTML=stmts.map(function(s){return '<div class="sql-stmt '+s.cls+'"><span class="verb">'+s.verb+'</span>'+esc(s.rest)+'<span style="color:var(--ink-faint)">'+esc(s.note)+'</span></div>';}).join('');
    var lines=sqlEl.querySelectorAll('.sql-stmt');
    run.add(function(){beginEl.style.opacity='1';},250);
    stmts.forEach(function(s,i){run.add(function(){lines[i].classList.add('show');},420);});
    run.add(function(){commitEl.style.opacity='1';},350);
    run.add(function(){
      pend.forEach(function(p){if(p.state!=='deleted'){p.state='unchanged';p.sub=(p.sub.indexOf('new')>=0?'Title: "Gardening"':'saved');}});
      pend=pend.filter(function(p){return p.state!=='deleted';});
      renderPending();
      foot.innerHTML='<b>3 statements, 1 transaction.</b> Insert/update/delete committed together; surviving entities are now <b style="color:var(--ink-soft)">Unchanged</b>.';
    },500);
    run.run();
  });
  byId('saveReset').addEventListener('click',function(){pend=[{label:'Blog "Gardening"',sub:'a new object',state:'added'},{label:'Blog #1',sub:'Title changed',state:'modified'},{label:'Blog #2',sub:'removed',state:'deleted'}];reset();});
  reset();
})();

(function migLab(){
  var codeEl=byId('migCode'),schemaEl=byId('migSchema'),foot=byId('migFoot');
  if(!codeEl)return;
  var base=[{n:'Id',k:'pk'},{n:'Title'},{n:'Price'}];
  var mode='addcol',applied=false;
  var migs={
    addcol:{
      code:'<span class="kw">protected override void</span> <span class="m">Up</span>(<span class="t">MigrationBuilder</span> b)\n{\n    b.<span class="m">AddColumn</span>&lt;<span class="t">int</span>&gt;(name: <span class="s">"Stock"</span>, table: <span class="s">"Products"</span>,\n        nullable: <span class="kw">false</span>, defaultValue: <span class="s">0</span>);\n}\n<span class="kw">protected override void</span> <span class="m">Down</span>(<span class="t">MigrationBuilder</span> b)\n    => b.<span class="m">DropColumn</span>(name: <span class="s">"Stock"</span>, table: <span class="s">"Products"</span>);',
      apply:function(){schemaEl.appendChild(el('div','schema-col new','Stock'));},
      foot:'<code class="tok">AddColumn</code> applied — the <b style="color:var(--st-ok)">Stock</b> column now exists on Products.'
    },
    addidx:{
      code:'<span class="kw">protected override void</span> <span class="m">Up</span>(<span class="t">MigrationBuilder</span> b)\n{\n    b.<span class="m">CreateIndex</span>(name: <span class="s">"IX_Products_Title"</span>,\n        table: <span class="s">"Products"</span>, column: <span class="s">"Title"</span>);\n}\n<span class="kw">protected override void</span> <span class="m">Down</span>(<span class="t">MigrationBuilder</span> b)\n    => b.<span class="m">DropIndex</span>(name: <span class="s">"IX_Products_Title"</span>, table: <span class="s">"Products"</span>);',
      apply:function(){schemaEl.appendChild(el('div','schema-col idx','🔎 IX: Title'));},
      foot:'<code class="tok">CreateIndex</code> applied — queries filtering or sorting by <b style="color:var(--migrate)">Title</b> get an index.'
    },
    addtable:{
      code:'<span class="kw">protected override void</span> <span class="m">Up</span>(<span class="t">MigrationBuilder</span> b)\n{\n    b.<span class="m">CreateTable</span>(name: <span class="s">"Categories"</span>, columns: t => <span class="kw">new</span>\n    {\n        Id = t.<span class="m">Column</span>&lt;<span class="t">int</span>&gt;().<span class="m">Annotation</span>(<span class="s">"Identity"</span>, <span class="s">""</span>),\n        Name = t.<span class="m">Column</span>&lt;<span class="t">string</span>&gt;()\n    });\n}\n<span class="kw">protected override void</span> <span class="m">Down</span>(<span class="t">MigrationBuilder</span> b)\n    => b.<span class="m">DropTable</span>(name: <span class="s">"Categories"</span>);',
      apply:function(){schemaEl.appendChild(el('div','schema-col new','+ Categories table'));},
      foot:'<code class="tok">CreateTable</code> applied — a new <b style="color:var(--st-ok)">Categories</b> table joins the schema.'
    }
  };
  function renderSchema(){schemaEl.innerHTML=base.map(function(c){return '<div class="schema-col">'+(c.k==='pk'?'🔑 ':'')+c.n+'</div>';}).join('');}
  function show(){codeEl.innerHTML=migs[mode].code;renderSchema();applied=false;foot.innerHTML='This migration\u2019s <code class="tok">Up</code> applies the change; <code class="tok">Down</code> reverses it. Press <b>database update</b> to apply.';}
  byId('migApply').addEventListener('click',function(){if(applied)return;applied=true;migs[mode].apply();foot.innerHTML=migs[mode].foot;});
  [].forEach.call(document.querySelectorAll('#migLab [data-mig]'),function(b){
    b.addEventListener('click',function(){[].forEach.call(document.querySelectorAll('#migLab [data-mig]'),function(x){x.classList.remove('primary');});b.classList.add('primary');mode=b.dataset.mig;show();});
  });
  show();
})();

(function n1Lab(){
  var countEl=byId('n1Count'),logEl=byId('n1Log'),foot=byId('n1Foot');
  if(!countEl)return;
  var mode='naive';
  var blogs=[{Id:1,Title:'Cooking',posts:2},{Id:2,Title:'Travel',posts:1},{Id:3,Title:'Tech',posts:3}];
  var run=new Runner();
  function setCount(n,cls){countEl.textContent=n;countEl.className='n1-v'+(cls?' '+cls:'');}
  function addLine(html,cls,delay){return function(){var l=el('div','query-line'+(cls?' '+cls:''),html);logEl.appendChild(l);requestAnimationFrame(function(){l.classList.add('show');});};}
  byId('n1Run').addEventListener('click',function(){
    run.cancel();logEl.innerHTML='';setCount(0);
    if(mode==='naive'){
      var n=0;
      run.add(function(){n=1;setCount(n,'bad');addLine('<span class="qn">#1</span><span class="k">SELECT</span> * <span class="k">FROM</span> <span class="t">Blogs</span>  <span style="color:var(--ink-faint)">→ 3 rows</span>')();},420);
      blogs.forEach(function(b,i){run.add(function(){n++;setCount(n,'bad');addLine('<span class="qn">#'+n+'</span><span class="k">SELECT</span> * <span class="k">FROM</span> <span class="t">Posts</span> <span class="k">WHERE</span> BlogId = '+b.Id+'  <span style="color:var(--st-warn)">← extra round-trip</span>','extra')();},420);});
      run.add(function(){foot.innerHTML='<b style="color:var(--st-bad)">1 + 3 = 4 queries.</b> One per blog — round-trips grow <b>O(n)</b> with the data. This is N+1.';},250);
    } else {
      run.add(function(){setCount(1,'good');addLine('<span class="qn">#1</span><span class="k">SELECT</span> b.*, p.* <span class="k">FROM</span> <span class="t">Blogs</span> b <span class="k">LEFT JOIN</span> <span class="t">Posts</span> p <span class="k">ON</span> p.BlogId = b.Id  <span style="color:var(--st-ok)">→ all in one</span>')();},420);
      run.add(function(){foot.innerHTML='<b style="color:var(--st-ok)">1 query.</b> <code class="tok">Include</code> (or a projection) fetches blogs and posts together — constant round-trips.';},250);
    }
    run.run();
  });
  [].forEach.call(document.querySelectorAll('#n1Lab [data-n1]'),function(b){
    b.addEventListener('click',function(){[].forEach.call(document.querySelectorAll('#n1Lab [data-n1]'),function(x){x.classList.remove('primary');});b.classList.add('primary');mode=b.dataset.n1;logEl.innerHTML='';setCount(0);foot.innerHTML=mode==='naive'?'Naive: loop the blogs and read each one\u2019s posts — watch the count climb.':'Include/project: one query for everything — press run.';});
  });
  setCount(0);
})();

onScroll();
})();
