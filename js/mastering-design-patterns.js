(function(){
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS='http://www.w3.org/2000/svg';
  function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
  function div(cls){var d=document.createElement('div');if(cls)d.className=cls;return d;}
  function clearSVG(s){while(s.firstChild)s.removeChild(s.firstChild);}
  var C={cre:'#E8B341',str:'#56C7FF',beh:'#A78BFA',ok:'#4ED66B',cmp:'#E8C53D',bad:'#ED4E6E',mut:'#7E88A4',ink:'#E8ECF8',faint:'#565F79'};

  function Runner(){this.q=[];this.t=null;this.busy=false;}
  Runner.prototype.add=function(fn,delay){this.q.push({fn:fn,delay:reduceMotion?0:delay});return this;};
  Runner.prototype.run=function(done){var self=this;this.busy=true;(function step(){if(!self.q.length){self.busy=false;if(done)done();return;}var it=self.q.shift();if(it.fn)it.fn();self.t=setTimeout(step,it.delay);})();};
  Runner.prototype.cancel=function(){clearTimeout(this.t);this.q=[];this.busy=false;};

  var nav=document.getElementById('nav'),scrim=document.getElementById('scrim'),menuBtn=document.getElementById('menuBtn');
  function closeNav(){nav.classList.remove('open');scrim.classList.remove('show');}
  if(menuBtn)menuBtn.addEventListener('click',function(){nav.classList.add('open');scrim.classList.add('show');});
  if(scrim)scrim.addEventListener('click',closeNav);
  nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeNav);});
  var progress=document.getElementById('progress');
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

  function svgText(x,y,s,fill,size,anchor,weight,mono){var t=mk('text',{x:x,y:y,fill:fill||C.mut,'font-size':size||12,'font-family':(mono===false?'IBM Plex Sans, sans-serif':'IBM Plex Mono, monospace'),'text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}

  (function hero(){
    var svg=document.getElementById('heroSvg');if(!svg)return;
    var groups=[];
    function gp(delay){var g=mk('g',{opacity:0});svg.appendChild(g);groups.push({g:g,d:delay});return g;}
    var h1=gp(0),h2=gp(60),h3=gp(120);
    h1.appendChild(svgText(135,28,'CREATIONAL',C.cre,12.5,'middle',700));h1.appendChild(svgText(135,44,'how objects are made',C.mut,10.5,'middle'));
    h2.appendChild(svgText(385,28,'STRUCTURAL',C.str,12.5,'middle',700));h2.appendChild(svgText(385,44,'how they compose',C.mut,10.5,'middle'));
    h3.appendChild(svgText(625,28,'BEHAVIORAL',C.beh,12.5,'middle',700));h3.appendChild(svgText(625,44,'how they collaborate',C.mut,10.5,'middle'));
    var defs=mk('defs',{});['m_cre',C.cre,'m_str',C.str,'m_beh',C.beh].forEach(function(){});
    [['hm_cre',C.cre],['hm_str',C.str],['hm_beh',C.beh]].forEach(function(p){var m=mk('marker',{id:p[0],markerWidth:8,markerHeight:8,refX:6,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:p[1]}));defs.appendChild(m);});
    svg.appendChild(defs);
    (function(){
      var g=gp(180);
      g.appendChild(mk('rect',{x:95,y:70,width:80,height:34,rx:8,fill:'rgba(232,179,65,0.14)',stroke:C.cre,'stroke-width':1.6}));
      g.appendChild(svgText(135,91,'Factory',C.ink,12,'middle',600));
      var px=[70,135,200];
      px.forEach(function(x,i){var g2=gp(240+i*90);g2.appendChild(mk('line',{x1:135,y1:104,x2:x,y2:150,stroke:'rgba(232,179,65,0.45)','stroke-width':1.5,'marker-end':'url(#hm_cre)'}));
        if(i===0)g2.appendChild(mk('circle',{cx:x,cy:172,r:15,fill:'rgba(232,179,65,0.12)',stroke:C.cre,'stroke-width':1.6}));
        else if(i===1)g2.appendChild(mk('rect',{x:x-14,y:158,width:28,height:28,rx:4,fill:'rgba(232,179,65,0.12)',stroke:C.cre,'stroke-width':1.6}));
        else g2.appendChild(mk('path',{d:'M'+x+' 157 L'+(x+15)+' 186 L'+(x-15)+' 186 Z',fill:'rgba(232,179,65,0.12)',stroke:C.cre,'stroke-width':1.6,'stroke-linejoin':'round'}));
      });
      g.appendChild(svgText(135,210,'one call → the right object',C.faint,10));
    })();
    (function(){
      var labels=[['Whip',300,64,170,118],['Milk',322,80,126,86],['Coffee',344,96,82,54]];
      labels.forEach(function(l,i){var g=gp(300+i*90);g.appendChild(mk('rect',{x:l[1],y:l[2],width:l[3],height:l[4],rx:9,fill:i===2?'rgba(86,199,255,0.16)':'none',stroke:C.str,'stroke-width':1.6,opacity:1-i*0.12}));g.appendChild(svgText(l[1]+l[3]/2,i===2?l[2]+l[4]/2+4:l[2]+15,l[0],i===2?C.ink:C.str,i===2?12:11,'middle',i===2?600:500));});
      gp(560).appendChild(svgText(385,210,'wrappers compose behavior',C.faint,10));
    })();
    (function(){
      var g=gp(560);
      g.appendChild(mk('circle',{cx:625,cy:80,r:18,fill:'rgba(167,139,250,0.16)',stroke:C.beh,'stroke-width':1.8}));
      g.appendChild(svgText(625,85,'subj',C.ink,10.5,'middle',600));
      var ox=[560,625,690];
      ox.forEach(function(x,i){var g2=gp(620+i*90);g2.appendChild(mk('line',{x1:625,y1:98,x2:x,y2:150,stroke:'rgba(167,139,250,0.5)','stroke-width':1.5,'marker-end':'url(#hm_beh)'}));g2.appendChild(mk('circle',{cx:x,cy:165,r:13,fill:'rgba(167,139,250,0.12)',stroke:C.beh,'stroke-width':1.6}));});
      g.appendChild(svgText(625,200,'one change, many notified',C.faint,10));
    })();
    groups.forEach(function(o){if(reduceMotion){o.g.setAttribute('opacity',1);return;}o.g.style.transition='opacity .5s ease';setTimeout(function(){o.g.setAttribute('opacity',1);},120+o.d);});
  })();

  function umlBox(svg,o){
    var color=o.color||C.str, lines=o.lines||[], h=o.h||(36+(lines.length?lines.length*17+6:4));
    var g=mk('g',{});
    g.appendChild(mk('rect',{x:o.x,y:o.y,width:o.w,height:h,rx:7,fill:'rgba(20,28,46,0.9)',stroke:color,'stroke-width':1.5}));
    g.appendChild(mk('rect',{x:o.x,y:o.y,width:o.w,height:o.stereo?32:26,rx:7,fill:color,'fill-opacity':0.13,stroke:'none'}));
    var ty=o.y+(o.stereo?14:17);
    if(o.stereo){g.appendChild(svgText(o.x+o.w/2,ty,o.stereo,color,9.5,'middle',500));ty+=13;}
    g.appendChild(svgText(o.x+o.w/2,ty,o.title,C.ink,12,'middle',600));
    var divY=o.y+(o.stereo?32:26);
    if(lines.length){g.appendChild(mk('line',{x1:o.x,y1:divY,x2:o.x+o.w,y2:divY,stroke:color,'stroke-width':1,'stroke-opacity':0.4}));
      lines.forEach(function(ln,i){g.appendChild(svgText(o.x+12,divY+16+i*17,ln,C.mut,10.5,'start'));});}
    svg.appendChild(g);
    return {x:o.x,y:o.y,w:o.w,h:h,cx:o.x+o.w/2,cy:o.y+h/2,top:o.y,bottom:o.y+h,left:o.x,right:o.x+o.w};
  }
  function rel(svg,x1,y1,x2,y2,kind,label){
    var ang=Math.atan2(y2-y1,x2-x1)*180/Math.PI;
    var ln=mk('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:'rgba(150,168,205,0.55)','stroke-width':1.4});
    if(kind==='impl')ln.setAttribute('stroke-dasharray','5 4');
    svg.appendChild(ln);
    var head=mk('path',{});
    if(kind==='impl'||kind==='inherit'){head.setAttribute('d','M0 0 L-13 -7 L-13 7 Z');head.setAttribute('fill','#0A0E1A');head.setAttribute('stroke','rgba(150,168,205,0.8)');head.setAttribute('stroke-width','1.3');}
    else if(kind==='diamond'){head.setAttribute('d','M0 0 L-10 -6 L-20 0 L-10 6 Z');head.setAttribute('fill','rgba(150,168,205,0.55)');head.setAttribute('stroke','rgba(150,168,205,0.8)');head.setAttribute('stroke-width','1');}
    else{head.setAttribute('d','M0 0 L-11 -5 M0 0 L-11 5');head.setAttribute('stroke','rgba(150,168,205,0.8)');head.setAttribute('stroke-width','1.5');head.setAttribute('fill','none');}
    head.setAttribute('transform','translate('+x2+' '+y2+') rotate('+ang+')');
    svg.appendChild(head);
    if(label){var mx=(x1+x2)/2,my=(y1+y2)/2;svg.appendChild(svgText(mx,my-6,label,C.faint,9.5,'middle'));}
  }

  (function factoryLab(){
    var out=document.getElementById('factoryOut');if(!out)return;
    var code=document.getElementById('factoryCode'),foot=document.getElementById('factoryFoot');
    var lab=document.getElementById('factoryLab');
    var shapes={
      circle:{cls:'Circle',make:function(){return mk('circle',{cx:80,cy:60,r:32,fill:'rgba(232,179,65,0.18)',stroke:C.cre,'stroke-width':2.2});}},
      square:{cls:'Square',make:function(){return mk('rect',{x:46,y:26,width:68,height:68,rx:7,fill:'rgba(232,179,65,0.18)',stroke:C.cre,'stroke-width':2.2});}},
      triangle:{cls:'Triangle',make:function(){return mk('path',{d:'M80 24 L116 94 L44 94 Z',fill:'rgba(232,179,65,0.18)',stroke:C.cre,'stroke-width':2.2,'stroke-linejoin':'round'});}}
    };
    function show(kind){
      clearSVG(out);var el=shapes[kind].make();if(!reduceMotion){el.style.opacity=0;el.style.transition='opacity .3s';}out.appendChild(el);if(!reduceMotion)requestAnimationFrame(function(){el.style.opacity=1;});
      code.innerHTML='<span style="color:#7CA8FF">const</span> shape =<br>&nbsp;&nbsp;factory.<span style="color:#5BD6C2">create</span>(<span style="color:#E2B96B">"'+kind+'"</span>);<br><span style="color:#565F79">// → returns a</span> <span style="color:#E8B341">'+shapes[kind].cls+'</span><br>shape.<span style="color:#5BD6C2">draw</span>();';
      foot.innerHTML='The factory returned a <b>'+shapes[kind].cls+'</b> behind the <code class="tok">Shape</code> interface. Your code asked for <code class="tok">"'+kind+'"</code> — it never wrote <code class="tok">new '+shapes[kind].cls+'()</code>.';
    }
    [].forEach.call(lab.querySelectorAll('[data-shape]'),function(b){b.addEventListener('click',function(){[].forEach.call(lab.querySelectorAll('[data-shape]'),function(x){x.classList.remove('primary');});b.classList.add('primary');show(b.dataset.shape);});});
  })();

  (function builderLab(){
    var chips=document.getElementById('builderChips');if(!chips)return;
    var code=document.getElementById('builderCode'),product=document.getElementById('builderProduct'),foot=document.getElementById('builderFoot');
    var added=[];
    function render(built){
      var lines=['<span style="color:#7CA8FF">new</span> <span style="color:#E8B341">PCBuilder</span>()'];
      added.forEach(function(p){lines.push('&nbsp;&nbsp;<span style="color:#565F79">.</span><span style="color:#5BD6C2">'+p.method+'</span>()');});
      if(built)lines.push('&nbsp;&nbsp;<span style="color:#565F79">.</span><span style="color:#5BD6C2">build</span>()<span style="color:#565F79">;</span>');
      code.innerHTML=lines.join('<br>');
      if(added.length===0){product.innerHTML='<span style="color:#565F79">(no parts yet — toggle some)</span>';}
      else{product.innerHTML='<span style="color:#565F79">Computer {</span><br>'+added.map(function(p){return '&nbsp;&nbsp;'+p.label;}).join('<br>')+'<br><span style="color:#565F79">}</span>';}
    }
    render(false);
    [].forEach.call(chips.querySelectorAll('.chip-btn'),function(b){
      b.addEventListener('click',function(){
        var part=b.dataset.part,label=b.dataset.label,method=b.textContent.replace(/[.\(\)]/g,'');
        var idx=added.findIndex(function(p){return p.part===part;});
        if(idx>=0){added.splice(idx,1);b.classList.remove('on');}
        else{added.push({part:part,label:label,method:method});b.classList.add('on');}
        render(false);
        foot.innerHTML=added.length?'Construction in progress — '+added.length+' part'+(added.length>1?'s':'')+' chained. Call <code class="tok">build()</code> to finalize.':'Empty builder. Toggle parts; each call returns the builder so they chain fluently.';
      });
    });
    document.getElementById('builderBuild').addEventListener('click',function(){
      if(!added.length){foot.innerHTML='<span style="color:var(--st-warn)">Add at least one part before building.</span>';return;}
      render(true);foot.innerHTML='<span class="ok">build() returned the finished Computer</span> — one immutable object assembled from '+added.length+' step'+(added.length>1?'s':'')+', no ten-argument constructor in sight.';
    });
    document.getElementById('builderReset').addEventListener('click',function(){added=[];[].forEach.call(chips.querySelectorAll('.chip-btn'),function(x){x.classList.remove('on');});render(false);foot.textContent='Reset. Toggle parts to add them, then build() yields the finished object.';});
  })();

  (function decoLab(){
    var viz=document.getElementById('decoViz');if(!viz)return;
    var chips=document.getElementById('decoChips'),desc=document.getElementById('decoDesc'),costEl=document.getElementById('decoCost'),foot=document.getElementById('decoFoot');
    var BASE=2.00,active=[];
    function render(){
      clearSVG(viz);var cx=280,cy=100,n=active.length,cw=124,ch=46,px=33,py=13;
      for(var i=n;i>=1;i--){var w=cw+px*2*i,h=ch+py*2*i,x=cx-w/2,y=cy-h/2;
        viz.appendChild(mk('rect',{x:x,y:y,width:w,height:h,rx:11,fill:'rgba(86,199,255,'+(0.045+0.02*i)+')',stroke:C.str,'stroke-width':1.5}));
        viz.appendChild(svgText(x+13,y+17,active[i-1].name,C.str,11,'start',600));
        viz.appendChild(svgText(x+w-13,y+17,'+$'+active[i-1].cost.toFixed(2),C.str,10,'end',400));
      }
      var x0=cx-cw/2,y0=cy-ch/2;
      viz.appendChild(mk('rect',{x:x0,y:y0,width:cw,height:ch,rx:9,fill:'rgba(232,179,65,0.16)',stroke:C.cre,'stroke-width':1.9}));
      viz.appendChild(svgText(cx,cy-2,'Coffee',C.ink,12.5,'middle',600));
      viz.appendChild(svgText(cx,cy+15,'$2.00',C.cre,10,'middle'));
      var total=BASE+active.reduce(function(s,a){return s+a.cost;},0);
      desc.textContent='Simple Coffee'+(active.length?', '+active.map(function(a){return a.name;}).join(', '):'');
      costEl.textContent='$'+total.toFixed(2);
    }
    render();
    [].forEach.call(chips.querySelectorAll('.chip-btn'),function(b){
      b.addEventListener('click',function(){
        var name=b.dataset.name,cost=parseFloat(b.dataset.cost);
        var idx=active.findIndex(function(a){return a.name===name;});
        if(idx>=0){active.splice(idx,1);b.classList.remove('on');}else{active.push({name:name,cost:cost});b.classList.add('on');}
        render();
        if(active.length){var chain=active.map(function(a){return a.name;}).reverse().join('(')+'(Coffee'+')'.repeat(active.length);
          foot.innerHTML='<code class="tok">'+chain+'</code> — the outer <code class="tok">cost()</code> adds each layer as it delegates inward. Total <b>$'+(BASE+active.reduce(function(s,a){return s+a.cost;},0)).toFixed(2)+'</b>.';}
        else foot.innerHTML='Just <code class="tok">Coffee</code> at $2.00. Each condiment you add wraps the drink in a decorator that adds its own cost.';
      });
    });
  })();

  (function compositeLab(){
    var stage=document.getElementById('compStage');if(!stage)return;
    var edges=document.getElementById('compEdges'),foot=document.getElementById('compFoot'),run=new Runner();
    var tree={id:'root',name:'project/',folder:true,x:280,y:28,children:[
      {id:'src',name:'src/',folder:true,x:120,y:118,children:[
        {id:'idx',name:'index.js',size:24,x:58,y:208},
        {id:'utl',name:'utils.js',size:12,x:188,y:208}]},
      {id:'ast',name:'assets/',folder:true,x:312,y:118,children:[
        {id:'logo',name:'logo.png',size:48,x:350,y:208}]},
      {id:'rdm',name:'README.md',size:4,x:478,y:118}
    ]};
    function walk(n,fn){fn(n);(n.children||[]).forEach(function(c){walk(c,fn);});}
    function render(){
      [].forEach.call(stage.querySelectorAll('.node'),function(e){e.remove();});clearSVG(edges);
      walk(tree,function(n){(n.children||[]).forEach(function(c){edges.appendChild(mk('line',{x1:n.x,y1:n.y+16,x2:c.x,y2:c.y-16,stroke:'rgba(140,160,205,0.3)','stroke-width':1.5}));});});
      walk(tree,function(n){
        var el=div('node box');el.style.left=n.x+'px';el.style.top=n.y+'px';el.style.flexDirection='column';el.style.height='auto';el.style.minWidth='92px';el.style.padding='6px 12px';el.style.lineHeight='1.25';
        var size=n.folder?(n._size!==undefined?n._size+' KB':'— KB'):n.size+' KB';
        el.innerHTML='<span style="font-size:11.5px">'+(n.folder?'▸ ':'')+n.name+'</span><span style="font-size:9.5px;color:var(--ink-muted)">'+size+'</span>';
        if(n._lit)el.classList.add(n._lit);
        stage.appendChild(el);
      });
    }
    render();
    document.getElementById('compSize').addEventListener('click',function(){
      if(run.busy)return;walk(tree,function(n){n._size=undefined;n._lit=null;});render();
      var order=[];(function po(n){(n.children||[]).forEach(po);order.push(n);})(tree);
      run.cancel();
      order.forEach(function(n){run.add(function(){
        if(n.folder)n._size=(n.children||[]).reduce(function(s,c){return s+(c.folder?c._size:c.size);},0);
        n._lit='ok';render();
        foot.innerHTML=n.folder?'<code class="tok">'+n.name+'</code>.getSize() → sum of its children = <b>'+n._size+' KB</b>':'<code class="tok">'+n.name+'</code>.getSize() → <b>'+n.size+' KB</b> (a leaf returns its own size)';
      },640);});
      run.add(function(){foot.innerHTML='<span class="ok">Total: '+tree._size+' KB.</span> One <code class="tok">getSize()</code> call ran on every node — leaves returned their size, folders summed their children. That uniform treatment is Composite.';},220).run();
    });
    document.getElementById('compReset').addEventListener('click',function(){if(run.busy)return;walk(tree,function(n){n._size=undefined;n._lit=null;});render();foot.innerHTML='A folder\u2019s size is the sum of its children\u2019s \u2014 the same <code class="tok">getSize()</code> call works on every node, recursing to the leaves.';});
  })();

  (function strategyLab(){
    var chips=document.getElementById('stratChips');if(!chips)return;
    var result=document.getElementById('stratResult'),foot=document.getElementById('stratFoot');
    var SUB=120,sel='none';
    var strat={none:{n:'NoDiscount',f:function(t){return t;}},member:{n:'MemberPricing',f:function(t){return t*0.9;}},vip:{n:'VipPricing',f:function(t){return t*0.75;}},bogo:{n:'BulkPricing',f:function(t){return t-30;}}};
    [].forEach.call(chips.querySelectorAll('.chip-btn'),function(b){b.addEventListener('click',function(){[].forEach.call(chips.querySelectorAll('.chip-btn'),function(x){x.classList.remove('sel');});b.classList.add('sel');sel=b.dataset.strat;result.innerHTML='<span style="color:var(--ink-faint)">injected '+strat[sel].n+' — now run checkout</span>';});});
    document.getElementById('stratRun').addEventListener('click',function(){
      var s=strat[sel],final=s.f(SUB),saved=SUB-final;
      result.innerHTML='<span style="color:#E8B341">'+s.n+'</span>.apply(120) → <b style="color:var(--st-ok)">$'+final.toFixed(2)+'</b>'+(saved>0?' <span style="color:var(--ink-muted)">(saved $'+saved.toFixed(2)+')</span>':'');
      foot.innerHTML='Checkout delegated to <b>'+s.n+'</b> without knowing its logic. Swap the strategy and the identical <code class="tok">process()</code> call produces a different price.';
    });
  })();

  (function observerLab(){
    var stage=document.getElementById('obsStage');if(!stage)return;
    var edges=document.getElementById('obsEdges'),foot=document.getElementById('obsFoot'),controls=document.getElementById('observerLab');
    var run=new Runner();
    var SUBJ={x:98,y:115},SX=452,SY=[36,92,150,206];
    var subs=[{name:'Phone App'},{name:'Dashboard'},{name:'Alert System'},{name:'Logger'}];
    var temp=22,readings=[null,null,null,null],nodeEls={},livePulse=null;
    function chip(i){return controls.querySelector('.chip-btn[data-obs="'+i+'"]');}
    function subscribed(i){var c=chip(i);return !!(c&&c.classList.contains('on'));}
    function ensureMarker(){if(!edges.querySelector('#obsAh')){var m=mk('marker',{id:'obsAh',markerWidth:7,markerHeight:7,refX:6,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:C.beh}));edges.appendChild(m);}}
    function box(x,y,html,cls){var el=div('node box'+(cls?(' '+cls):''));el.style.cssText='left:'+x+'px;top:'+y+'px;flex-direction:column;height:auto;min-width:106px;padding:7px 12px;line-height:1.3';el.innerHTML=html;return el;}
    function render(){
      [].forEach.call(stage.querySelectorAll('.node'),function(e){e.remove();});clearSVG(edges);ensureMarker();
      subs.forEach(function(s,i){var on=subscribed(i);edges.appendChild(mk('line',{x1:SUBJ.x,y1:SUBJ.y,x2:SX,y2:SY[i],stroke:(on?'rgba(167,139,250,0.55)':'rgba(120,136,165,0.16)'),'stroke-width':1.6,'stroke-dasharray':(on?'':'4 5'),'marker-end':(on?'url(#obsAh)':'')}));});
      stage.appendChild(box(SUBJ.x,SUBJ.y,'<span style="font-size:11px;color:'+C.beh+'">WeatherStation</span><span style="font-size:14px;color:'+C.ink+';font-weight:600">'+temp+'\u00B0</span>','alt'));
      subs.forEach(function(s,i){var on=subscribed(i);var read=on?(readings[i]==null?'waiting\u2026':readings[i]+'\u00B0'):'off';var col=on?(readings[i]==null?C.faint:C.ok):C.faint;var el=box(SX,SY[i],'<span style="font-size:11px;color:'+(on?C.str:C.faint)+'">'+s.name+'</span><span class="rd" style="font-size:11.5px;color:'+col+'">'+read+'</span>');el.style.opacity=on?'1':'0.5';nodeEls[i]=el;stage.appendChild(el);});
    }
    function notify(){
      if(run.busy)return;var nt=temp;while(nt===temp){nt=15+Math.floor(Math.random()*15);}temp=nt;render();
      var targets=[];subs.forEach(function(s,i){if(subscribed(i))targets.push(i);});
      foot.innerHTML='<code class="tok">setTemp('+temp+'\u00B0)</code> \u2192 looping over the subscriber list\u2026';run.cancel();
      if(!targets.length){run.add(function(){foot.innerHTML='Temperature changed to '+temp+'\u00B0, but <span class="bad">nobody is subscribed</span> \u2014 the notification reaches no one.';},10).run();return;}
      targets.forEach(function(i){
        run.add(function(){var p=div('pulse');p.style.left=(SUBJ.x-6)+'px';p.style.top=(SUBJ.y-6)+'px';stage.appendChild(p);void p.offsetWidth;p.style.transition='left .5s cubic-bezier(.4,0,.2,1),top .5s cubic-bezier(.4,0,.2,1)';p.style.left=(SX-6)+'px';p.style.top=(SY[i]-6)+'px';livePulse=p;foot.innerHTML='Notifying <b>'+subs[i].name+'</b>\u2026';},150)
           .add(function(){if(livePulse&&livePulse.parentNode)livePulse.parentNode.removeChild(livePulse);readings[i]=temp;var el=nodeEls[i];if(el){el.classList.add('ok');var rd=el.querySelector('.rd');if(rd){rd.textContent=temp+'\u00B0';rd.style.color=C.ok;}}},520);
      });
      run.add(function(){foot.innerHTML='<span class="ok">Notified '+targets.length+' subscriber'+(targets.length>1?'s':'')+'.</span> The subject just iterated its list \u2014 it never knew their concrete types, and unsubscribed objects got nothing.';},240).run();
    }
    [].forEach.call(controls.querySelectorAll('.chip-btn'),function(b){b.addEventListener('click',function(){if(run.busy)return;var i=+b.dataset.obs;b.classList.toggle('on');if(!subscribed(i))readings[i]=null;render();foot.innerHTML=subscribed(i)?'<b>'+subs[i].name+'</b> subscribed \u2014 it will receive the next update.':'<b>'+subs[i].name+'</b> unsubscribed \u2014 removed from the list. <span style="color:var(--ink-muted)">No code in the subject changed.</span>';});});
    document.getElementById('obsChange').addEventListener('click',notify);
    render();
  })();

  (function stateLab(){
    var stage=document.getElementById('stateStage');if(!stage)return;
    var edges=document.getElementById('stateEdges'),foot=document.getElementById('stateFoot');
    var screen=document.getElementById('mpScreen'),label=document.getElementById('mpState'),run=new Runner();
    var P={stopped:{x:84,y:100,t:'Stopped'},playing:{x:240,y:46,t:'Playing'},paused:{x:398,y:100,t:'Paused'}};
    var E=[['stopped','playing'],['playing','paused'],['stopped','paused']];
    var machine={stopped:{play:'playing'},playing:{pause:'paused',stop:'stopped'},paused:{play:'playing',stop:'stopped'}};
    var evLabel={play:'Play',pause:'Pause',stop:'Stop'},cur='stopped',nodeEls={};
    function hotEdge(a,b,hot){return hot&&((hot[0]===a&&hot[1]===b)||(hot[0]===b&&hot[1]===a));}
    function render(opts){
      opts=opts||{};[].forEach.call(stage.querySelectorAll('.node'),function(e){e.remove();});clearSVG(edges);
      E.forEach(function(e){var a=P[e[0]],b=P[e[1]],hot=hotEdge(e[0],e[1],opts.hot);edges.appendChild(mk('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:(hot?C.str:'rgba(140,160,205,0.26)'),'stroke-width':(hot?2.6:1.5)}));});
      Object.keys(P).forEach(function(k){var p=P[k],cls='node box';if(opts.flash===k)cls+=' bad';else if(k===cur)cls+=' focus';var el=div(cls);el.style.cssText='left:'+p.x+'px;top:'+p.y+'px;min-width:94px';el.textContent=p.t;nodeEls[k]=el;stage.appendChild(el);});
    }
    function setScreen(){screen.className='mp-screen '+cur;label.textContent=cur.toUpperCase();}
    render();setScreen();
    function fire(ev){
      if(run.busy)return;var next=machine[cur]&&machine[cur][ev];
      if(!next){run.cancel();run.add(function(){render({flash:cur});foot.innerHTML='In <b>'+P[cur].t+'</b>, <b>'+evLabel[ev]+'</b> does nothing \u2014 this state object simply ignores it. <span style="color:var(--st-bad)">No transition defined.</span>';},20).add(function(){render();},560).run();return;}
      var from=cur;run.cancel();
      run.add(function(){render({hot:[from,next]});foot.innerHTML='In <b>'+P[from].t+'</b>, <b>'+evLabel[ev]+'</b> \u2192 transition to <b>'+P[next].t+'</b>.';},20)
         .add(function(){cur=next;setScreen();render();foot.innerHTML='Now <b style="color:var(--accent)">'+P[cur].t+'</b>. The player just delegated to its current state object \u2014 not a single <code class="tok">if</code> anywhere.';},520).run();
    }
    [].forEach.call(document.querySelectorAll('#stateLab [data-ev]'),function(b){b.addEventListener('click',function(){fire(b.dataset.ev);});});
  })();

  (function commandLab(){
    var valEl=document.getElementById('cmdValue');if(!valEl)return;
    var histEl=document.getElementById('cmdHist'),redoEl=document.getElementById('cmdRedoList');
    var hc=document.getElementById('cmdHistCount'),rc=document.getElementById('cmdRedoCount'),foot=document.getElementById('cmdFoot');
    var value=0,hist=[],redo=[];
    var defs={add5:{label:'Add 5',apply:function(v){return v+5;}},sub3:{label:'Subtract 3',apply:function(v){return v-3;}},dbl:{label:'Double',apply:function(v){return v*2;}}};
    function items(el,arr,topHl){el.innerHTML='';arr.slice().reverse().forEach(function(rec,idx){var it=div('cmd-item'+(topHl&&idx===0?' top':''));it.textContent=rec.label+'   ('+rec.prev+' \u2192 '+rec.next+')';el.appendChild(it);});}
    function render(){valEl.textContent=value;items(histEl,hist,true);items(redoEl,redo,false);hc.textContent=hist.length;rc.textContent=redo.length;}
    render();
    function exec(key){var c=defs[key],prev=value,next=c.apply(prev);value=next;hist.push({label:c.label,prev:prev,next:next});redo=[];render();foot.innerHTML='<b>'+c.label+'</b> executed: '+prev+' \u2192 '+next+'. Pushed onto the history; the redo stack is cleared.';}
    [].forEach.call(document.querySelectorAll('#commandLab [data-cmd]'),function(b){b.addEventListener('click',function(){exec(b.dataset.cmd);});});
    document.getElementById('cmdUndo').addEventListener('click',function(){if(!hist.length){foot.innerHTML='Nothing to undo \u2014 the history is empty.';return;}var rec=hist.pop();value=rec.prev;redo.push(rec);render();foot.innerHTML='<b>Undo</b>: reversed <b>'+rec.label+'</b> \u2014 value restored to '+value+'. The command moved to the redo stack.';});
    document.getElementById('cmdRedo').addEventListener('click',function(){if(!redo.length){foot.innerHTML='Nothing to redo.';return;}var rec=redo.pop();value=rec.next;hist.push(rec);render();foot.innerHTML='<b>Redo</b>: re-applied <b>'+rec.label+'</b> \u2014 value is '+value+' again.';});
  })();

  (function chainLab(){
    var stage=document.getElementById('chainStage');if(!stage)return;
    var edges=document.getElementById('chainEdges'),foot=document.getElementById('chainFoot'),amtIn=document.getElementById('chainAmt'),run=new Runner();
    var H=[{name:'Team Lead',cap:1000,lab:'\u2264 $1k'},{name:'Manager',cap:10000,lab:'\u2264 $10k'},{name:'Director',cap:100000,lab:'\u2264 $100k'},{name:'CEO',cap:Infinity,lab:'any amount'}];
    var X=[80,220,360,500],Y=64,hl={};
    function ensureMarker(){if(!edges.querySelector('#chAh')){var m=mk('marker',{id:'chAh',markerWidth:7,markerHeight:7,refX:6,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:C.mut}));edges.appendChild(m);}}
    function render(){
      [].forEach.call(stage.querySelectorAll('.node'),function(e){e.remove();});clearSVG(edges);ensureMarker();
      for(var i=0;i<H.length-1;i++){edges.appendChild(mk('line',{x1:X[i]+52,y1:Y,x2:X[i+1]-52,y2:Y,stroke:'rgba(140,160,205,0.4)','stroke-width':1.6,'marker-end':'url(#chAh)'}));}
      H.forEach(function(h,i){var el=div('node box'+(hl[i]?(' '+hl[i]):''));el.style.cssText='left:'+X[i]+'px;top:'+Y+'px;flex-direction:column;height:auto;min-width:96px;padding:7px 12px;line-height:1.3';el.innerHTML='<span style="font-size:11.5px;color:'+C.ink+';font-weight:600">'+h.name+'</span><span style="font-size:10px;color:'+C.mut+'">'+h.lab+'</span>';stage.appendChild(el);});
    }
    render();
    function submit(){
      if(run.busy)return;var amt=parseInt(amtIn.value,10);
      if(isNaN(amt)||amt<=0){foot.innerHTML='<span style="color:var(--st-warn)">Enter a positive amount.</span>';return;}
      hl={};render();var approver=0;for(var k=0;k<H.length;k++){if(amt<=H[k].cap){approver=k;break;}}
      foot.innerHTML='Request for <b>$'+amt.toLocaleString()+'</b> enters the chain\u2026';run.cancel();
      for(var i=0;i<=approver;i++){(function(i){
        run.add(function(){hl[i]='compare';render();foot.innerHTML='At <b>'+H[i].name+'</b> ('+H[i].lab+'): can this handler approve $'+amt.toLocaleString()+'?';},480)
           .add(function(){
             if(i<approver){hl[i]='alt';render();foot.innerHTML='$'+amt.toLocaleString()+' exceeds <b>'+H[i].name+'</b>\u2019s limit \u2192 forward up the chain.';}
             else{hl[i]='ok';render();foot.innerHTML='<span class="ok">Approved by '+H[i].name+'</span> \u2014 $'+amt.toLocaleString()+' is within '+H[i].lab+'. The request stops here; earlier handlers never needed to know who would take it.';}
           },420);
      })(i);}
      run.run();
    }
    document.getElementById('chainSubmit').addEventListener('click',submit);
    amtIn.addEventListener('keydown',function(e){if(e.key==='Enter')submit();});
  })();

  (function umlDiagrams(){
    var mid=0;
    function box(svg,x,y,w,h,lines,color){
      svg.appendChild(mk('rect',{x:x,y:y,width:w,height:h,rx:9,fill:'rgba(86,199,255,0.05)',stroke:color||C.str,'stroke-width':1.6}));
      var single=lines.length===1;
      lines.forEach(function(ln,i){var ty=single?(y+h/2+4.5):(y+19+i*16);var t=svgText(x+w/2,ty,ln.t,ln.fill||C.ink,ln.sz||12.5,'middle',ln.weight||'500',ln.mono);if(ln.italic)t.setAttribute('font-style','italic');svg.appendChild(t);});
    }
    function arrow(svg,x1,y1,x2,y2,color,dashed,label){
      var id='um'+(mid++);var m=mk('marker',{id:id,markerWidth:8,markerHeight:8,refX:6.6,refY:3.2,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L7 3.2L0 6.4Z',fill:color}));svg.appendChild(m);
      var ln=mk('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:color,'stroke-width':1.7,'marker-end':'url(#'+id+')'});if(dashed)ln.setAttribute('stroke-dasharray','5 5');svg.appendChild(ln);
      if(label)svg.appendChild(svgText((x1+x2)/2,(y1+y2)/2-6,label,C.mut,10.5,'middle','400'));
    }
    (function(){var s=document.getElementById('adapterSvg');if(!s)return;
      box(s,40,68,120,52,[{t:'Client',weight:'600'}]);
      box(s,250,16,164,60,[{t:'\u00ABinterface\u00BB Target',sz:11,fill:C.str},{t:'request()',sz:12,mono:true}]);
      box(s,250,114,164,60,[{t:'Adapter',weight:'600'},{t:'request() \u2192 adaptee',sz:10.5,mono:true,fill:C.mut}]);
      box(s,470,114,140,60,[{t:'Adaptee',weight:'600'},{t:'specificRequest()',sz:10,mono:true,fill:C.mut}]);
      arrow(s,160,90,248,48,C.mut,false,'calls');
      arrow(s,332,114,332,78,C.mut,true,'implements');
      arrow(s,414,144,470,144,C.mut,false,'wraps');
    })();
    (function(){var s=document.getElementById('facadeSvg');if(!s)return;
      box(s,40,88,120,52,[{t:'Client',weight:'600'}]);
      box(s,224,84,152,60,[{t:'Facade',weight:'600'},{t:'doIt()',sz:12,mono:true,fill:C.str}]);
      box(s,452,20,158,46,[{t:'SubsystemA',sz:12}]);
      box(s,452,90,158,46,[{t:'SubsystemB',sz:12}]);
      box(s,452,160,158,46,[{t:'SubsystemC',sz:12}]);
      arrow(s,160,114,222,114,C.mut,false,'one call');
      arrow(s,376,108,452,46,C.mut,false,'');
      arrow(s,376,114,452,113,C.mut,false,'coordinates');
      arrow(s,376,120,452,180,C.mut,false,'');
    })();
    (function(){var s=document.getElementById('bridgeSvg');if(!s)return;
      box(s,30,28,190,54,[{t:'Abstraction',weight:'600'},{t:'holds an Implementor',sz:10,fill:C.mut}]);
      box(s,30,132,190,46,[{t:'RefinedAbstraction',sz:12}]);
      box(s,420,28,190,54,[{t:'\u00ABinterface\u00BB Implementor',sz:11,fill:C.str},{t:'opImpl()',sz:11.5,mono:true}]);
      box(s,360,142,120,44,[{t:'ConcreteImplA',sz:10.5}]);
      box(s,500,142,120,44,[{t:'ConcreteImplB',sz:10.5}]);
      arrow(s,125,132,125,84,C.mut,false,'extends');
      arrow(s,470,142,500,84,C.mut,true,'');
      arrow(s,560,142,540,84,C.mut,true,'implements');
      arrow(s,232,52,418,52,C.str,false,'bridge: has-a');
      s.appendChild(mk('path',{d:'M222 52 L228 48 L234 52 L228 56 Z',fill:C.str}));
      s.appendChild(svgText(320,214,'two hierarchies that vary independently',C.faint,10.5,'middle','400',false));
    })();
  })();

  onScroll();
})();
