(function(){
"use strict";
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function byId(id){return document.getElementById(id);}
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
function clearSVG(s){while(s.firstChild)s.removeChild(s.firstChild);}
var C={http:'#A78BFA',route:'#7C9CFF',mw:'#56C7FF',di:'#5BD6C2',endpoint:'#4ED66B',bind:'#E8B341',resp:'#ED6E9E',cross:'#F2973C',
       ink:'#E8ECF8',soft:'#B7C0D8',mut:'#7E88A4',faint:'#565F79',ok:'#4ED66B',bad:'#ED4E6E',warn:'#F2973C',
       line:'rgba(140,160,205,0.4)',lineFaint:'rgba(140,160,205,0.2)',surface:'#161E32',border:'rgba(140,160,205,0.26)'};

function Runner(){this.q=[];this.t=null;this.busy=false;}
Runner.prototype.add=function(fn,delay){this.q.push({fn:fn,delay:reduceMotion?0:delay});return this;};
Runner.prototype.run=function(done){var self=this;this.busy=true;(function step(){if(!self.q.length){self.busy=false;if(done)done();return;}var it=self.q.shift();if(it.fn)it.fn();self.t=setTimeout(step,it.delay);})();};
Runner.prototype.cancel=function(){clearTimeout(this.t);this.q=[];this.busy=false;};

function svgText(x,y,s,fill,size,anchor,weight,mono){var t=mk('text',{x:x,y:y,fill:fill||C.mut,'font-size':size||12,'font-family':(mono===false?'IBM Plex Sans, sans-serif':'IBM Plex Mono, monospace'),'text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];});}
function mbadge(m){return '<span class="mb '+m.toLowerCase()+'">'+m+'</span>';}
function jsonHtml(v,indent){
  indent=indent||0;var pad='  '.repeat(indent+1),pad0='  '.repeat(indent);
  if(v===null)return '<span class="j-bool">null</span>';
  if(typeof v==='number')return '<span class="j-num">'+v+'</span>';
  if(typeof v==='boolean')return '<span class="j-bool">'+v+'</span>';
  if(typeof v==='string')return '<span class="j-str">"'+esc(v)+'"</span>';
  if(Array.isArray(v)){if(!v.length)return '<span class="j-punct">[]</span>';return '<span class="j-punct">[</span>\n'+v.map(function(x){return pad+jsonHtml(x,indent+1);}).join('<span class="j-punct">,</span>\n')+'\n'+pad0+'<span class="j-punct">]</span>';}
  var keys=Object.keys(v);if(!keys.length)return '<span class="j-punct">{}</span>';
  return '<span class="j-punct">{</span>\n'+keys.map(function(k){return pad+'<span class="j-key">"'+k+'"</span><span class="j-punct">: </span>'+jsonHtml(v[k],indent+1);}).join('<span class="j-punct">,</span>\n')+'\n'+pad0+'<span class="j-punct">}</span>';
}
function httpResp(status,phrase,headers,body){
  var fam=Math.floor(status/100);
  var h='<div class="http-resp"><div class="resp-status s'+fam+'">'+status+' '+phrase+'</div>';
  var hk=Object.keys(headers||{});
  if(hk.length)h+='<div class="resp-head">'+hk.map(function(k){return k+': '+headers[k];}).join('<br>')+'</div>';
  h+='<div class="resp-body">'+(body==null?'<span class="j-punct">(no body)</span>':jsonHtml(body,0))+'</div></div>';
  return h;
}

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
  function rrect(x,y,w,h,rx,fill,stroke,sw,dash){var a={x:x,y:y,width:w,height:h,rx:rx,fill:fill||'none',stroke:stroke||'none','stroke-width':sw||1};if(dash)a['stroke-dasharray']=dash;return mk('rect',a);}
  function arrowMark(id,color){if(!svg.querySelector('#'+id)){var m=mk('marker',{id:id,markerWidth:8,markerHeight:8,refX:6,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:color}));svg.appendChild(m);}}
  arrowMark('hReq',C.http);arrowMark('hRes',C.resp);
  var y=96,h=64;
  var boxes=[
    {x:20,w:120,name:'GET /products',color:C.http,sub:'request',badge:true},
    {x:154,w:92,name:'Logging',color:C.mw,sub:'middleware'},
    {x:258,w:96,name:'Authorize',color:C.mw,sub:'middleware'},
    {x:366,w:88,name:'Routing',color:C.route,sub:'match'},
    {x:466,w:130,name:'Endpoint',color:C.endpoint,sub:'/products'}
  ];
  boxes.forEach(function(b){
    svg.appendChild(rrect(b.x,y,b.w,h,10,'rgba(16,22,38,0.6)',b.color,1.6));
    if(b.badge){
      svg.appendChild(rrect(b.x+12,y+15,34,18,5,'rgba(78,214,107,0.16)','none'));
      svg.appendChild(svgText(b.x+29,y+28,'GET','#4ED66B',10,'middle','700'));
      svg.appendChild(svgText(b.x+b.w-10,y+28,'/products',C.soft,10.5,'end','600'));
    } else {
      svg.appendChild(svgText(b.x+b.w/2,y+27,b.name,b.color,12,'middle','600'));
    }
    svg.appendChild(svgText(b.x+b.w/2,y+50,b.sub,C.faint,9.5,'middle','400',false));
  });
  for(var i=0;i<boxes.length-1;i++){
    var a=boxes[i],n=boxes[i+1];
    svg.appendChild(mk('line',{x1:a.x+a.w+2,y1:y+24,x2:n.x-3,y2:y+24,stroke:C.http,'stroke-width':1.6,'marker-end':'url(#hReq)'}));
  }
  var ry=210,rh=56,ep=boxes[4];
  svg.appendChild(rrect(ep.x,ry,ep.w,rh,10,'rgba(237,110,158,0.05)',C.resp,1.6));
  svg.appendChild(svgText(ep.x+ep.w/2,ry+24,'200 OK',C.resp,13,'middle','700'));
  svg.appendChild(svgText(ep.x+ep.w/2,ry+42,'{ json }',C.faint,10,'middle','400'));
  svg.appendChild(mk('line',{x1:ep.x-3,y1:ry+rh/2,x2:boxes[0].x+boxes[0].w/2,y2:ry+rh/2,stroke:C.resp,'stroke-width':1.6,'stroke-dasharray':'5 4','marker-end':'url(#hRes)'}));
  svg.appendChild(svgText((boxes[0].x+ep.x)/2,ry+rh/2-9,'response flows back out',C.resp,10,'middle','500',false));
  svg.appendChild(mk('path',{d:'M'+(ep.x+ep.w-16)+' '+(y+h)+' L'+(ep.x+ep.w-16)+' '+ry,fill:'none',stroke:C.endpoint,'stroke-width':1.4,'stroke-dasharray':'3 3'}));
  if(!reduceMotion){
    var reqDot=mk('circle',{r:5,fill:C.http,cx:boxes[0].x+boxes[0].w/2,cy:y+24});svg.appendChild(reqDot);reqDot.setAttribute('opacity',0);
    var stops=boxes.map(function(b){return b.x+b.w/2;});
    function travel(dot,xs,yy,cb){var i=0;dot.setAttribute('cy',yy);dot.setAttribute('opacity',1);
      (function go(){if(i>=xs.length){if(cb)cb();return;}var tx=xs[i];var cx=parseFloat(dot.getAttribute('cx'));var t0=null;
        function fr(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/300);dot.setAttribute('cx',cx+(tx-cx)*k);if(k<1)requestAnimationFrame(fr);else{i++;setTimeout(go,90);}}requestAnimationFrame(fr);})();
    }
    function loop(){
      reqDot.setAttribute('cx',stops[0]);reqDot.setAttribute('cy',y+24);reqDot.setAttribute('fill',C.http);reqDot.setAttribute('opacity',1);
      travel(reqDot,stops.slice(1),y+24,function(){
        reqDot.setAttribute('fill',C.resp);reqDot.setAttribute('cy',ry+rh/2);
        travel(reqDot,[boxes[0].x+boxes[0].w/2],ry+rh/2,function(){
          reqDot.setAttribute('opacity',0);setTimeout(loop,900);
        });
      });
    }
    setTimeout(loop,500);
  }
})();

(function statusLab(){
  var chipsEl=byId('statusChips'),disp=byId('statusDisplay'),foot=byId('statusFoot');
  if(!chipsEl)return;
  var scen=[
    {label:'Resource returned',code:200,phrase:'OK',use:'The request succeeded and the body holds the result.'},
    {label:'Resource created',code:201,phrase:'Created',use:'A POST created a new resource — include its URL in a Location header.'},
    {label:'Success, no body',code:204,phrase:'No Content',use:'Succeeded, but there\u2019s nothing to send back — common after a DELETE.'},
    {label:'Invalid input',code:400,phrase:'Bad Request',use:'The client sent something invalid — failed validation or malformed JSON.'},
    {label:'Not authenticated',code:401,phrase:'Unauthorized',use:'No valid credentials supplied. The client must authenticate first.'},
    {label:'Not allowed',code:403,phrase:'Forbidden',use:'Authenticated, but this user isn\u2019t permitted to do it.'},
    {label:'Doesn\u2019t exist',code:404,phrase:'Not Found',use:'The requested resource isn\u2019t there.'},
    {label:'Server blew up',code:500,phrase:'Internal Server Error',use:'Something threw on the server. The client did nothing wrong.'}
  ];
  function show(s){
    var fam=Math.floor(s.code/100);
    disp.innerHTML='<div class="status-code sc'+fam+'">'+s.code+'</div><div class="status-phrase">'+s.phrase+'</div><div class="status-use">'+s.use+'</div>';
    var names={2:'success',3:'redirection',4:'client error',5:'server error'};
    foot.innerHTML='<b class="sc'+fam+'">'+s.code+'</b> is in the <b>'+fam+'xx</b> family — '+names[fam]+'.';
  }
  scen.forEach(function(s,i){
    var b=el('button','ds-btn'+(i===0?' primary':''),s.label);
    b.addEventListener('click',function(){[].forEach.call(chipsEl.children,function(x){x.classList.remove('primary');});b.classList.add('primary');show(s);});
    chipsEl.appendChild(b);
  });
  show(scen[0]);
})();

(function pipeLab(){
  var stackEl=byId('pipeStack'),resultEl=byId('pipeResult'),foot=byId('pipeFoot');
  if(!stackEl)return;
  var layers=[
    {name:'ExceptionHandler',tag:'catches errors'},
    {name:'Authentication',tag:'who are you?'},
    {name:'Authorization',tag:'allowed?',auth:true},
    {name:'Routing',tag:'match endpoint'},
    {name:'Endpoint',tag:'GET /products',endpoint:true}
  ];
  function render(){
    stackEl.innerHTML='';
    layers.forEach(function(l){
      stackEl.appendChild(el('div','mw-layer'+(l.endpoint?' endpoint':''),'<span class="mwl-name">'+l.name+(l.endpoint?'':'()')+'</span><span class="mwl-tag">'+l.tag+'</span>'));
    });
  }
  var run=new Runner();
  function send(hasToken){
    run.cancel();render();
    resultEl.innerHTML='';
    var rows=stackEl.querySelectorAll('.mw-layer');
    var stop=layers.length-1,blocked=false;
    for(var i=0;i<layers.length;i++){if(layers[i].auth&&!hasToken){stop=i;blocked=true;break;}}
    for(var a=0;a<=stop;a++){(function(a){run.add(function(){
      rows.forEach(function(r){r.classList.remove('incoming');});
      rows[a].classList.add('incoming');
    },360);})(a);}
    if(blocked){
      run.add(function(){
        rows[stop].classList.remove('incoming');rows[stop].classList.add('blocked');
        for(var k=stop+1;k<rows.length;k++)rows[k].classList.add('shorted');
        resultEl.innerHTML='<span style="color:var(--st-bad)">← 401 Unauthorized</span> — short-circuited at Authorization';
      },420);
    }
    for(var b=stop;b>=0;b--){(function(b){run.add(function(){
      rows.forEach(function(r){r.classList.remove('incoming');});
      if(!rows[b].classList.contains('blocked'))rows[b].classList.add('outgoing');
    },330);})(b);}
    run.add(function(){
      if(!blocked)resultEl.innerHTML='<span style="color:var(--st-ok)">← 200 OK</span> — reached the endpoint and returned';
      foot.innerHTML=blocked
        ? 'No token → <b style="color:var(--st-bad)">Authorization</b> produced a 401 and the request never reached Routing or the Endpoint.'
        : 'With a token, the request passed every layer to the <b style="color:var(--endpoint)">Endpoint</b>, then the response unwound back out.';
    },200);
    run.run();
  }
  render();
  [].forEach.call(document.querySelectorAll('#pipeLab [data-pt]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#pipeLab [data-pt]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');send(b.dataset.pt==='yes');
    });
  });
  send(true);
})();

(function routeLab(){
  var listEl=byId('routeList'),valsEl=byId('routeVals'),foot=byId('routeFoot');
  if(!listEl)return;
  var routes=[
    {tmpl:'/products',re:/^\/products$/,params:[]},
    {tmpl:'/products/{id:int}',re:/^\/products\/(\d+)$/,params:['id']},
    {tmpl:'/products/{id:int}/reviews',re:/^\/products\/(\d+)\/reviews$/,params:['id']},
    {tmpl:'/categories/{name}',re:/^\/categories\/([^\/]+)$/,params:['name']}
  ];
  function tmplHtml(t){return t.replace(/\{[^}]+\}/g,function(m){return '<span class="ri-param">'+m+'</span>';});}
  function render(matchIdx){
    listEl.innerHTML='';
    routes.forEach(function(r,i){
      listEl.appendChild(el('div','route-item'+(i===matchIdx?' matched':''),'<span class="mb get">GET</span><span class="ri-tmpl">'+tmplHtml(r.tmpl)+'</span>'+(i===matchIdx?'<span style="margin-left:auto;color:var(--st-ok);font-size:11px">✓ matched</span>':'')));
    });
  }
  function match(url){
    var path=url.split('?')[0];
    for(var i=0;i<routes.length;i++){
      var m=path.match(routes[i].re);
      if(m){
        render(i);
        var vals=routes[i].params.map(function(p,j){return '<span class="rv-k">'+p+'</span> = <span class="rv-v">"'+m[j+1]+'"</span>';});
        valsEl.className='route-vals';
        valsEl.innerHTML='<b style="color:var(--st-ok)">Matched</b> <span class="ri-tmpl">'+tmplHtml(routes[i].tmpl)+'</span>'+(vals.length?'  →  '+vals.join(' , '):'  (no route values)');
        foot.innerHTML='<code class="tok">'+url+'</code> matched <code class="tok">'+routes[i].tmpl+'</code>'+(vals.length?', capturing its route values.':'.');
        return;
      }
    }
    render(-1);
    valsEl.className='route-vals nomatch';
    valsEl.innerHTML='✕ No route matched <code class="tok" style="color:var(--st-bad)">'+esc(path)+'</code> → <b>404 Not Found</b>';
    foot.innerHTML='<code class="tok">'+esc(path)+'</code> matched nothing — note <code class="tok">/products/abc</code> fails the <code class="tok">:int</code> constraint.';
  }
  render(-1);
  [].forEach.call(document.querySelectorAll('#routeLab .route-url'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#routeLab .route-url'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');match(b.dataset.url);
    });
  });
  match('/products/42');
  document.querySelector('#routeLab .route-url[data-url="/products/42"]').classList.add('primary');
  document.querySelector('#routeLab .route-url[data-url="/products"]').classList.remove('primary');
})();

(function apiLab(){
  var dataEl=byId('apiData'),respEl=byId('apiResponse'),foot=byId('apiFoot');
  if(!dataEl)return;
  var todos=[{id:1,title:'Learn ASP.NET',done:true},{id:2,title:'Build an API',done:false}];
  var nextId=3;
  function renderData(flashId){
    dataEl.innerHTML='';
    if(!todos.length){dataEl.innerHTML='<div style="font-family:var(--font-mono);font-size:12px;color:var(--ink-faint)">(empty)</div>';return;}
    todos.forEach(function(t){
      var row=el('div','api-todo'+(t.done?' done':'')+(t.id===flashId?' flash':''),'<span class="at-done">'+(t.done?'✓':'')+'</span><span class="at-id">#'+t.id+'</span><span>'+esc(t.title)+'</span>');
      dataEl.appendChild(row);
    });
  }
  function resp(method,path,status,phrase,body){
    respEl.innerHTML='<div style="font-family:var(--font-mono);font-size:11.5px;color:var(--ink-muted);margin-bottom:8px">'+mbadge(method)+' '+path+'</div>'+httpResp(status,phrase,body==null?{}:{'Content-Type':'application/json'},body);
  }
  function getId(){return parseInt(byId('apiId').value,10);}
  byId('apiGetAll').addEventListener('click',function(){renderData();resp('GET','/todos',200,'OK',todos);foot.innerHTML='<code class="tok">GET /todos</code> → 200 with the full list.';});
  byId('apiGetOne').addEventListener('click',function(){
    var id=getId(),t=todos.filter(function(x){return x.id===id;})[0];
    if(t){renderData(id);resp('GET','/todos/'+id,200,'OK',t);foot.innerHTML='Found todo #'+id+' → 200.';}
    else{renderData();resp('GET','/todos/'+id,404,'Not Found',null);foot.innerHTML='No todo #'+id+' → <b style="color:var(--st-bad)">404</b>.';}
  });
  byId('apiPost').addEventListener('click',function(){
    var title=(byId('apiTitle').value||'').trim();if(!title){resp('POST','/todos',400,'Bad Request',{error:'title is required'});foot.innerHTML='Empty title → <b style="color:var(--st-bad)">400</b>.';return;}
    var t={id:nextId++,title:title,done:false};todos.push(t);renderData(t.id);
    respEl.innerHTML='<div style="font-family:var(--font-mono);font-size:11.5px;color:var(--ink-muted);margin-bottom:8px">'+mbadge('POST')+' /todos</div>'+httpResp(201,'Created',{'Content-Type':'application/json','Location':'/todos/'+t.id},t);
    foot.innerHTML='<code class="tok">POST /todos</code> created #'+t.id+' → <b style="color:var(--endpoint)">201 Created</b> with a Location header.';
  });
  byId('apiToggle').addEventListener('click',function(){
    var id=getId(),t=todos.filter(function(x){return x.id===id;})[0];
    if(t){t.done=!t.done;renderData(id);resp('PUT','/todos/'+id+'/done',200,'OK',t);foot.innerHTML='Toggled #'+id+'.done → '+t.done+' → 200.';}
    else{renderData();resp('PUT','/todos/'+id+'/done',404,'Not Found',null);foot.innerHTML='No todo #'+id+' → <b style="color:var(--st-bad)">404</b>.';}
  });
  byId('apiDelete').addEventListener('click',function(){
    var id=getId(),idx=-1;todos.forEach(function(x,i){if(x.id===id)idx=i;});
    if(idx>=0){todos.splice(idx,1);renderData();resp('DELETE','/todos/'+id,204,'No Content',null);foot.innerHTML='Deleted #'+id+' → <b style="color:var(--endpoint)">204 No Content</b>.';}
    else{renderData();resp('DELETE','/todos/'+id,404,'Not Found',null);foot.innerHTML='No todo #'+id+' → <b style="color:var(--st-bad)">404</b>.';}
  });
  renderData();
  respEl.innerHTML='<div style="font-family:var(--font-mono);font-size:12px;color:var(--ink-faint)">Call an endpoint to see the response.</div>';
})();

(function bindLab(){
  var objEl=byId('bindObject'),validEl=byId('bindValid'),foot=byId('bindFoot');
  if(!objEl)return;
  var fields=['bindName','bindPrice','bindStock'];
  function compute(){
    var name=byId('bindName').value;
    var priceRaw=byId('bindPrice').value, price=parseFloat(priceRaw);
    var stockRaw=byId('bindStock').value, stock=Number(stockRaw);
    var errs=[];
    var nameOk=name.trim().length>0; if(!nameOk)errs.push('Name is required');
    var priceOk=!isNaN(price)&&price>=0.01&&price<=10000; if(!priceOk)errs.push('Price must be between 0.01 and 10000');
    var stockOk=stockRaw!==''&&Number.isInteger(stock)&&stock>=0&&stock<=99999; if(!stockOk)errs.push('Stock must be a whole number 0–99999');
    objEl.innerHTML=
      prop('Name','"'+esc(name)+'"',nameOk)+
      prop('Price',isNaN(price)?'<i style="color:var(--ink-faint)">unbound</i>':String(price)+'m',priceOk)+
      prop('Stock',stockRaw===''||isNaN(stock)?'<i style="color:var(--ink-faint)">unbound</i>':String(stock),stockOk);
    if(errs.length===0){
      validEl.className='bind-valid ok';
      validEl.innerHTML='ModelState.IsValid = <b>true</b> → <b>200 OK</b> — the handler runs.';
    } else {
      validEl.className='bind-valid err';
      validEl.innerHTML='ModelState.IsValid = <b>false</b> → <b>400 Bad Request</b>'+errs.map(function(e){return '<div class="bv-line">• '+e+'</div>';}).join('');
    }
  }
  function prop(k,v,ok){return '<div class="bind-prop '+(ok?'valid':'invalid')+'"><span style="color:var(--ink-muted)">'+k+'</span><span class="bp-v">'+v+'</span></div>';}
  fields.forEach(function(f){byId(f).addEventListener('input',compute);});
  compute();
})();

(function diLab(){
  var stageEl=byId('diStage'),legendEl=byId('diLegend'),foot=byId('diFoot');
  if(!stageEl)return;
  var lifetime='singleton';
  var palette=['#A78BFA','#56C7FF','#4ED66B','#E8B341'];
  function plan(){
    if(lifetime==='singleton')return [[1,1],[1,1]];
    if(lifetime==='scoped')return [[1,1],[2,2]];
    return [[1,2],[3,4]];
  }
  var run=new Runner();
  function render(animate){
    run.cancel();
    var p=plan();
    stageEl.innerHTML='';
    var reqs=[['Request A',p[0]],['Request B',p[1]]];
    var allRows=[];
    reqs.forEach(function(rq){
      var col=el('div','di-req','<div class="dr-h">▸ '+rq[0]+'</div>');
      rq[1].forEach(function(inst,j){
        var row=el('div','di-resolve','<span>resolve <span style="color:var(--di)">IRepository</span> #'+(j+1)+'</span><span class="di-inst" style="background:'+palette[inst-1]+'22;color:'+palette[inst-1]+'">instance '+inst+'</span>');
        col.appendChild(row);allRows.push(row);
      });
      stageEl.appendChild(col);
    });
    var distinct={};p.forEach(function(r){r.forEach(function(i){distinct[i]=1;});});
    var n=Object.keys(distinct).length;
    var msg=lifetime==='singleton'?'<b style="color:var(--di)">1</b> instance shared across everything — the whole app.'
      :lifetime==='scoped'?'<b style="color:var(--di)">2</b> instances — one per request, reused within each.'
      :'<b style="color:var(--di)">4</b> instances — a fresh one every single resolution.';
    if(animate&&!reduceMotion){allRows.forEach(function(r,i){run.add(function(){r.classList.add('show');},220);});run.add(function(){legendEl.innerHTML=msg;},100);run.run();}
    else {allRows.forEach(function(r){r.classList.add('show');});legendEl.innerHTML=msg;}
  }
  byId('diRun').addEventListener('click',function(){render(true);});
  [].forEach.call(document.querySelectorAll('#diLab [data-dl]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#diLab [data-dl]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');lifetime=b.dataset.dl;render(true);
      foot.innerHTML=lifetime==='singleton'?'<b>Singleton</b>: registered once, lives for the app\u2019s lifetime — every request shares it.'
        :lifetime==='scoped'?'<b>Scoped</b>: one instance per HTTP request — shared within a request, fresh for the next. (A DbContext is scoped.)'
        :'<b>Transient</b>: a new instance every time it\u2019s injected — even twice within one request.';
    });
  });
  render(true);
})();

(function respLab(){
  var pickEl=byId('respPick'),outEl=byId('respOutput'),foot=byId('respFoot');
  if(!pickEl)return;
  var product={id:3,name:'Desk',price:120};
  var opts=[
    {label:'Ok(product)',status:200,phrase:'OK',headers:{'Content-Type':'application/json'},body:product,note:'The standard success — 200 with the resource as JSON.'},
    {label:'Created(uri, product)',status:201,phrase:'Created',headers:{'Content-Type':'application/json','Location':'/products/3'},body:product,note:'A POST that created a resource — 201 plus a Location header pointing to it.'},
    {label:'NoContent()',status:204,phrase:'No Content',headers:{},body:null,note:'Success with nothing to return — typical after a DELETE or PUT.'},
    {label:'BadRequest(errors)',status:400,phrase:'Bad Request',headers:{'Content-Type':'application/json'},body:{error:'Name is required'},note:'The client sent invalid data — 400 with details.'},
    {label:'NotFound()',status:404,phrase:'Not Found',headers:{},body:null,note:'The requested resource doesn\u2019t exist — 404, no body.'}
  ];
  function show(o){outEl.innerHTML=httpResp(o.status,o.phrase,o.headers,o.body);foot.innerHTML='<code class="tok">Results.'+o.label.split('(')[0]+'(…)</code> → '+o.note;}
  opts.forEach(function(o,i){
    var b=el('button','ds-btn'+(i===0?' primary':''),'Results.'+o.label);
    b.addEventListener('click',function(){[].forEach.call(pickEl.children,function(x){x.classList.remove('primary');});b.classList.add('primary');show(o);});
    pickEl.appendChild(b);
  });
  show(opts[0]);
})();

onScroll();
})();
