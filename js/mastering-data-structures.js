(function(){
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS='http://www.w3.org/2000/svg';
  function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
  function div(cls){var d=document.createElement('div');if(cls)d.className=cls;return d;}
  function clearSVG(s){while(s.firstChild)s.removeChild(s.firstChild);}

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

  var RAND=['cat','dog','sun','map','key','run','sky','ice','owl','fig','jam','oak','pea','bee','elm','fox','hat','ink','joy','kit'];

  (function hero(){
    var svg=document.getElementById('heroSvg');if(!svg)return;
    function txt(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill||'#7E88A4','font-size':size||12,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
    var defs=mk('defs',{});var m=mk('marker',{id:'ah',markerWidth:7,markerHeight:7,refX:6,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:'#8B7CFF'}));defs.appendChild(m);svg.appendChild(defs);
    var vals=[5,2,8,4];var groups=[];
    svg.appendChild(txt(120,30,'ARRAY','#56C7FF',12,'middle',600));
    svg.appendChild(txt(380,30,'LINKED LIST','#4ED66B',12,'middle',600));
    svg.appendChild(txt(640,30,'BINARY SEARCH TREE','#8B7CFF',11.5,'middle',600));
    (function(){var bx=40,by=70,cw=40,ch=40;for(var i=0;i<4;i++){var g=mk('g',{opacity:0});g.appendChild(mk('rect',{x:bx+i*cw,y:by,width:cw,height:ch,rx:6,fill:'rgba(86,199,255,0.10)',stroke:'#56C7FF','stroke-width':1.4}));g.appendChild(txt(bx+i*cw+cw/2,by+ch/2+5,vals[i],'#E8ECF8',14,'middle',600));g.appendChild(txt(bx+i*cw+cw/2,by+ch+16,i,'#565F79',10));svg.appendChild(g);groups.push({g:g,d:i*90});}svg.appendChild(txt(120,by+ch+44,'index → O(1) jump','#7E88A4',10.5));})();
    (function(){var bx=300,by=72,cw=34,gap=22;for(var i=0;i<4;i++){var x=bx+i*(cw+gap);var g=mk('g',{opacity:0});g.appendChild(mk('rect',{x:x,y:by,width:cw,height:36,rx:7,fill:'rgba(78,214,107,0.10)',stroke:'#4ED66B','stroke-width':1.4}));g.appendChild(txt(x+cw/2,by+23,vals[i],'#E8ECF8',13,'middle',600));if(i<3){g.appendChild(mk('line',{x1:x+cw,y1:by+18,x2:x+cw+gap,y2:by+18,stroke:'#8B7CFF','stroke-width':1.6,'marker-end':'url(#ah)'}));}svg.appendChild(g);groups.push({g:g,d:360+i*90});}svg.appendChild(txt(380,by+62,'follow pointers → O(n)','#7E88A4',10.5));})();
    (function(){var cx=640;var nodes=[{v:5,x:cx,y:78},{v:2,x:cx-46,y:140},{v:8,x:cx+46,y:140},{v:4,x:cx-14,y:200}];var edges=[[0,1],[0,2],[1,3]];edges.forEach(function(e,k){var a=nodes[e[0]],b=nodes[e[1]];var g=mk('g',{opacity:0});g.appendChild(mk('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'rgba(139,124,255,0.5)','stroke-width':1.6}));svg.appendChild(g);groups.push({g:g,d:720+k*70});});nodes.forEach(function(n,k){var g=mk('g',{opacity:0});g.appendChild(mk('circle',{cx:n.x,cy:n.y,r:17,fill:'rgba(139,124,255,0.12)',stroke:'#8B7CFF','stroke-width':1.6}));g.appendChild(txt(n.x,n.y+5,n.v,'#E8ECF8',13,'middle',600));svg.appendChild(g);groups.push({g:g,d:760+k*70});});svg.appendChild(txt(cx,232,'search by halving → O(log n)','#7E88A4',10.5));})();
    groups.forEach(function(o){if(reduceMotion){o.g.setAttribute('opacity',1);return;}o.g.style.transition='opacity .5s ease';setTimeout(function(){o.g.setAttribute('opacity',1);},120+o.d);});
  })();

  (function arrayLab(){
    var row=document.getElementById('arrCells');if(!row)return;
    var foot=document.getElementById('arrFoot'),idxIn=document.getElementById('arrIdx');
    var CW=64,START=[4,8,15,16,23,42],data=START.slice(),run=new Runner();
    function render(){row.innerHTML='';data.forEach(function(v,i){var c=div('cell');c.style.left=(i*CW)+'px';c.textContent=v;var ix=div('ix');ix.textContent=i;c.appendChild(ix);c.dataset.i=i;row.appendChild(c);});row.style.minWidth=Math.max(480,data.length*CW+10)+'px';}
    function cellAt(i){return row.querySelector('.cell[data-i="'+i+'"]');}
    function clearMarks(){[].forEach.call(row.querySelectorAll('.cell'),function(c){c.className='cell';});}
    render();
    document.getElementById('arrAccess').addEventListener('click',function(){
      if(run.busy)return;clearMarks();var i=parseInt(idxIn.value,10);
      if(isNaN(i)||i<0||i>=data.length){foot.innerHTML='<span class="bad">Index '+(isNaN(i)?'?':i)+' is out of bounds</span> — valid range is 0 to '+(data.length-1)+'.';return;}
      cellAt(i).classList.add('focus');foot.innerHTML='Jumped straight to index '+i+' → value '+data[i]+'. <b>1 step, O(1)</b> — address arithmetic, no scanning.';
    });
    document.getElementById('arrPrepend').addEventListener('click',function(){
      if(run.busy)return;clearMarks();var v=Math.floor(Math.random()*90)+10;
      [].forEach.call(row.querySelectorAll('.cell'),function(c){c.classList.add('shift');});
      foot.innerHTML='Inserting '+v+' at the front: every one of the '+data.length+' elements must shift right. <span class="warn">'+data.length+' moves, O(n)</span>.';
      run.cancel();run.add(function(){data.unshift(v);render();cellAt(0).classList.add('fresh');[].forEach.call(row.querySelectorAll('.cell'),function(c,k){if(k>0)c.classList.add('shift');});},460).run();
    });
    document.getElementById('arrAppend').addEventListener('click',function(){
      if(run.busy)return;clearMarks();var v=Math.floor(Math.random()*90)+10;data.push(v);render();cellAt(data.length-1).classList.add('fresh');
      foot.innerHTML='Appended '+v+' at the end — nothing else moved. <span class="ok">O(1) amortized</span>.';
    });
    document.getElementById('arrReset').addEventListener('click',function(){if(run.busy)return;data=START.slice();render();foot.textContent='Reset. Access any index instantly, or insert at the front and watch every element shift right.';});
  })();

  (function listLab(){
    var stage=document.getElementById('listStage');if(!stage)return;
    var edges=document.getElementById('listEdges'),foot=document.getElementById('listFoot');
    var START=[7,3,9,5],data=START.slice(),run=new Runner();var NX=110,X0=46,Y=46;
    function render(hl){
      [].forEach.call(stage.querySelectorAll('.node,.nullbox'),function(n){n.remove();});clearSVG(edges);
      if(!edges.querySelector('marker')){var m=mk('marker',{id:'lah',markerWidth:7,markerHeight:7,refX:6,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:'#8B7CFF'}));edges.appendChild(m);}
      stage.style.minWidth=Math.max(560,X0+data.length*NX+60)+'px';
      data.forEach(function(v,i){
        var x=X0+i*NX;var n=div('node sq');n.style.left=x+'px';n.style.top=Y+'px';n.textContent=v;
        if(hl&&hl.idx===i)n.classList.add(hl.cls||'focus');n.dataset.i=i;stage.appendChild(n);
        var x2=(i<data.length-1)?(X0+(i+1)*NX-24):(x+78);
        var ln=mk('line',{x1:x+24,y1:Y,x2:x2,y2:Y,stroke:'#8B7CFF','stroke-width':1.8,'marker-end':'url(#lah)'});
        if(hl&&hl.ptr===i)ln.setAttribute('stroke','#56C7FF');edges.appendChild(ln);
      });
      var nb=div('node sq');nb.className='node sq nullbox';nb.style.left=(X0+data.length*NX)+'px';nb.style.top=Y+'px';nb.style.borderStyle='dashed';nb.style.color='var(--ink-faint)';nb.style.fontSize='12px';nb.textContent='∅';stage.appendChild(nb);
    }
    render();
    document.getElementById('listPrepend').addEventListener('click',function(){if(run.busy)return;var v=Math.floor(Math.random()*90)+10;data.unshift(v);render({idx:0,cls:'ok',ptr:0});foot.innerHTML='Inserted '+v+' at the head — point the new node at the old head, done. <span class="ok">O(1)</span>, no shifting.';});
    document.getElementById('listInsert').addEventListener('click',function(){if(run.busy)return;var pos=Math.floor(data.length/2);var v=Math.floor(Math.random()*90)+10;data.splice(pos,0,v);render({idx:pos,cls:'ok',ptr:pos-1});foot.innerHTML='Spliced '+v+' into the middle: rewire two pointers. <span class="ok">O(1) given the spot</span> — but reaching it first was O(n).';});
    document.getElementById('listDelete').addEventListener('click',function(){if(run.busy)return;if(data.length<=1){foot.innerHTML='<span class="warn">Nothing to delete.</span>';return;}var pos=Math.floor(data.length/2);render({idx:pos,cls:'bad'});run.cancel();run.add(function(){data.splice(pos,1);render({idx:Math.max(0,pos-1),cls:'alt',ptr:Math.max(0,pos-1)});foot.innerHTML='Deleted a middle node — its predecessor now points around it. <span class="ok">O(1) pointer surgery</span>.';},420).run();});
    document.getElementById('listSearch').addEventListener('click',function(){if(run.busy)return;var target=data[data.length-1];run.cancel();foot.innerHTML='Searching for '+target+' — no random access, so we hop from the head…';data.forEach(function(v,i){run.add(function(){render({idx:i,cls:(v===target?'ok':'focus')});foot.innerHTML='Checking node '+(i+1)+' of '+data.length+' (value '+v+')'+(v===target?' — <span class="ok">found it after '+(i+1)+' hops, O(n)</span>.':' …');},520);});run.run();});
    document.getElementById('listReset').addEventListener('click',function(){if(run.busy)return;data=START.slice();render();foot.textContent='Reset. Insert at the head in one step, or search and watch the list hop node by node.';});
  })();

  (function sqLab(){
    var stage=document.getElementById('sqStage');if(!stage)return;
    var foot=document.getElementById('sqFoot'),toggle=document.getElementById('sqToggle');
    var mode='stack',data=[],run=new Runner(),counter=1;
    function render(hl){
      stage.innerHTML='';
      if(mode==='stack'){var n=data.length;data.forEach(function(v,i){var fromTop=n-1-i;var el=div('node sq');el.style.width='110px';el.style.height='34px';el.style.left='90px';el.style.top=(20+fromTop*38)+'px';el.textContent=v;if(hl==='top'&&i===n-1)el.classList.add('focus');stage.appendChild(el);});var lab=div();lab.style.cssText='position:absolute;left:210px;top:24px;font-family:var(--font-mono);font-size:11px;color:var(--ink-muted)';lab.textContent=(n?'← top (push/pop here)':'');stage.appendChild(lab);}
      else{data.forEach(function(v,i){var el=div('node sq');el.style.width='52px';el.style.height='40px';el.style.left=(40+i*64)+'px';el.style.top='50px';el.textContent=v;if(hl==='front'&&i===0)el.classList.add('bad');if(hl==='rear'&&i===data.length-1)el.classList.add('ok');stage.appendChild(el);});if(data.length){var f=div();f.style.cssText='position:absolute;left:40px;top:104px;font-family:var(--font-mono);font-size:10px;color:var(--st-bad)';f.textContent='front (dequeue)';stage.appendChild(f);var r=div();r.style.cssText='position:absolute;left:'+(40+(data.length-1)*64-6)+'px;top:18px;font-family:var(--font-mono);font-size:10px;color:var(--st-ok)';r.textContent='rear (enqueue)';stage.appendChild(r);}}
    }
    render();
    toggle.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||run.busy)return;mode=b.dataset.mode;toggle.querySelectorAll('button').forEach(function(x){x.classList.toggle('primary',x===b);});data=[];counter=1;render();foot.textContent=mode==='stack'?'Stack mode: push adds on top, pop removes from the top (LIFO).':'Queue mode: enqueue adds at the rear, dequeue removes from the front (FIFO).';});
    document.getElementById('sqPush').addEventListener('click',function(){if(run.busy||data.length>=5)return;var v=counter++*10;data.push(v);render(mode==='stack'?'top':'rear');foot.innerHTML=mode==='stack'?'Pushed '+v+' onto the top. <span class="ok">O(1)</span>.':'Enqueued '+v+' at the rear. <span class="ok">O(1)</span>.';});
    document.getElementById('sqPop').addEventListener('click',function(){if(run.busy||!data.length)return;if(mode==='stack'){render('top');var v=data[data.length-1];run.cancel();run.add(function(){data.pop();render();foot.innerHTML='Popped '+v+' from the top — the <b>last in</b> came out first. <span class="ok">O(1)</span>.';},360).run();}else{render('front');var v2=data[0];run.cancel();run.add(function(){data.shift();render();foot.innerHTML='Dequeued '+v2+' from the front — the <b>first in</b> came out first. <span class="ok">O(1)</span>.';},360).run();}});
    document.getElementById('sqReset').addEventListener('click',function(){if(run.busy)return;data=[];counter=1;render();foot.textContent='Reset. Push a few values, then pop — notice which end they come back from.';});
  })();

  (function hashLab(){
    var bucketsEl=document.getElementById('hashBuckets');if(!bucketsEl)return;
    var foot=document.getElementById('hashFoot'),keyIn=document.getElementById('hashKey');
    var lfFill=document.getElementById('lfFill'),lfVal=document.getElementById('lfVal');
    var size=8,table=[],count=0,run=new Runner();for(var i=0;i<size;i++)table.push([]);
    function hash(key,m){var h=0;for(var i=0;i<key.length;i++){h=(h*31+key.charCodeAt(i))>>>0;}return {raw:h,idx:h%m};}
    function render(opts){
      opts=opts||{};bucketsEl.innerHTML='';
      for(var b=0;b<size;b++){
        var row=div('bucket');var idx=div('bucket-idx');idx.innerHTML='bucket <b>'+b+'</b>';row.appendChild(idx);
        var slot=div('bucket-slot');if(opts.target===b)slot.classList.add('target');if(table[b].length===0)slot.classList.add('empty-hint');
        table[b].forEach(function(item){var ci=div('chain-item');ci.textContent=item;if(opts.hl&&opts.hl.b===b&&opts.hl.key===item)ci.classList.add(opts.hl.cls||'focus');slot.appendChild(ci);});
        row.appendChild(slot);bucketsEl.appendChild(row);
      }
      var lf=count/size;lfFill.style.width=Math.min(100,lf*100)+'%';lfVal.textContent=count+' / '+size+' = '+lf.toFixed(2);
    }
    render();
    function doResize(){var old=table,i;size=size*2;table=[];for(i=0;i<size;i++)table.push([]);old.forEach(function(ch){ch.forEach(function(k){table[hash(k,size).idx].push(k);});});foot.innerHTML='<span class="warn">Load factor crossed 0.75 → resize.</span> Table doubled to '+size+' buckets; every key rehashed into the bigger array.';render();}
    function insertKey(key){
      if(!key||run.busy)return;var hres=hash(key,size),b=hres.idx;
      if(table[b].indexOf(key)>=0){render({target:b,hl:{b:b,key:key,cls:'ok'}});foot.innerHTML='Key "'+key+'" already in bucket '+b+'.';return;}
      run.cancel();
      run.add(function(){render({target:b});foot.innerHTML='hash("'+key+'") = '+hres.raw+' &nbsp;→&nbsp; '+hres.raw+' mod '+size+' = <b>bucket '+b+'</b>'+(table[b].length?' <span class="warn">(occupied — collision)</span>':' (empty)');},440)
         .add(function(){var collided=table[b].length>0;table[b].push(key);count++;render({target:b,hl:{b:b,key:key,cls:collided?'collide':'ok'}});foot.innerHTML=collided?'<span class="warn">Collision</span> — "'+key+'" appended to the chain in bucket '+b+' (separate chaining).':'Placed "'+key+'" in bucket '+b+'. <span class="ok">O(1)</span>.';},480)
         .add(function(){if(count/size>0.75){doResize();}},540).run();
    }
    document.getElementById('hashInsert').addEventListener('click',function(){var k=(keyIn.value||'').trim();if(!k){foot.innerHTML='<span class="warn">Type a key first.</span>';return;}insertKey(k);keyIn.value='';});
    keyIn.addEventListener('keydown',function(e){if(e.key==='Enter'){var k=(keyIn.value||'').trim();if(k){insertKey(k);keyIn.value='';}}});
    document.getElementById('hashRandom').addEventListener('click',function(){if(run.busy)return;insertKey(RAND[Math.floor(Math.random()*RAND.length)]+(Math.floor(Math.random()*90)+10));});
    document.getElementById('hashFind').addEventListener('click',function(){
      var key=(keyIn.value||'').trim();if(!key){foot.innerHTML='<span class="warn">Type a key to find.</span>';return;}if(run.busy)return;
      var b=hash(key,size).idx;run.cancel();
      run.add(function(){render({target:b});foot.innerHTML='hash("'+key+'") → bucket '+b+'. Walking its chain…';},440);
      var chain=table[b];
      if(!chain.length){run.add(function(){render({target:b});foot.innerHTML='Bucket '+b+' is empty — <span class="bad">"'+key+'" not found</span>.';},320);}
      chain.forEach(function(k,j){run.add(function(){render({target:b,hl:{b:b,key:k,cls:k===key?'ok':'compare'}});foot.innerHTML=k===key?'<span class="ok">Found "'+key+'"</span> in bucket '+b+' after '+(j+1)+' comparison(s).':'Comparing "'+k+'"… not it.';},500);});
      if(chain.length&&chain.indexOf(key)<0){run.add(function(){foot.innerHTML='<span class="bad">"'+key+'" not found</span> in bucket '+b+'.';},260);}
      run.run();
    });
    document.getElementById('hashReset').addEventListener('click',function(){if(run.busy)return;size=8;table=[];for(var i=0;i<size;i++)table.push([]);count=0;render();foot.textContent='Reset. Type a key and insert it — the hash decides its bucket.';});
  })();

  function layoutTree(root){var col=0,pos={},maxD=0;(function rec(n,d){if(!n)return;rec(n.left,d+1);pos[n.id]={c:col++,d:d};maxD=Math.max(maxD,d);rec(n.right,d+1);})(root,0);return {pos:pos,cols:col,maxD:maxD};}

  (function travLab(){
    var stage=document.getElementById('travStage');if(!stage)return;
    var edges=document.getElementById('travEdges'),seqBox=document.getElementById('travSeq'),foot=document.getElementById('travFoot');
    var run=new Runner(),id=0;
    function N(v,l,r){return {id:id++,v:v,left:l||null,right:r||null};}
    var root=N(8,N(4,N(2),N(6)),N(12,N(10),N(14)));
    var nodeEls={};
    function positions(){var lay=layoutTree(root);var stageW=Math.max(520,stage.clientWidth||520),padX=36,padY=34,levelH=58,innerW=stageW-padX*2,P={};(function walk(n){if(!n)return;var p=lay.pos[n.id];P[n.id]={x:padX+(lay.cols<=1?innerW/2:(p.c/(lay.cols-1))*innerW),y:padY+p.d*levelH};walk(n.left);walk(n.right);})(root);return P;}
    function render(){[].forEach.call(stage.querySelectorAll('.node'),function(n){n.remove();});clearSVG(edges);nodeEls={};var P=positions();(function de(n){if(!n)return;[n.left,n.right].forEach(function(c){if(c)edges.appendChild(mk('line',{x1:P[n.id].x,y1:P[n.id].y,x2:P[c.id].x,y2:P[c.id].y,stroke:'rgba(140,160,205,0.3)','stroke-width':1.5}));});de(n.left);de(n.right);})(root);(function dn(n){if(!n)return;var el=div('node');el.style.left=P[n.id].x+'px';el.style.top=P[n.id].y+'px';el.textContent=n.v;stage.appendChild(el);nodeEls[n.id]=el;dn(n.left);dn(n.right);})(root);}
    render();window.addEventListener('resize',function(){if(!run.busy)render();});
    function order(type){var out=[];if(type==='bfs'){var q=[root];while(q.length){var n=q.shift();if(!n)continue;out.push(n);if(n.left)q.push(n.left);if(n.right)q.push(n.right);}return out;}(function rec(n){if(!n)return;if(type==='pre')out.push(n);rec(n.left);if(type==='in')out.push(n);rec(n.right);if(type==='post')out.push(n);})(root);return out;}
    var names={pre:'Pre-order (node → left → right)',in:'In-order (left → node → right)',post:'Post-order (left → right → node)',bfs:'Level-order / BFS (row by row)'};
    [].forEach.call(document.querySelectorAll('#travLab [data-trav]'),function(btn){
      btn.addEventListener('click',function(){
        if(run.busy)return;render();var seq=order(btn.dataset.trav);
        seqBox.innerHTML='<span class="lbl">visit order:</span>';foot.innerHTML=names[btn.dataset.trav]+' …';run.cancel();
        seq.forEach(function(n){run.add(function(){[].forEach.call(stage.querySelectorAll('.node'),function(e){e.classList.remove('focus');});nodeEls[n.id].classList.add('focus');var it=div('seq-item');it.textContent=n.v;seqBox.appendChild(it);},560);});
        run.add(function(){[].forEach.call(stage.querySelectorAll('.node'),function(e){e.classList.remove('focus');e.classList.add('ok');});var sorted=btn.dataset.trav==='in';foot.innerHTML=names[btn.dataset.trav]+' → '+seq.map(function(n){return n.v;}).join(', ')+(sorted?' <span class="ok">— sorted, because it\'s a BST</span>':'');},300);
        run.run();
      });
    });
  })();

  (function bstLab(){
    var stage=document.getElementById('bstStage');if(!stage)return;
    var edges=document.getElementById('bstEdges'),foot=document.getElementById('bstFoot'),valIn=document.getElementById('bstVal');
    var run=new Runner(),id=0,root=null;
    function N(v){return {id:id++,v:v,left:null,right:null};}
    function rawInsert(node,v){if(!node)return N(v);if(v<node.v)node.left=rawInsert(node.left,v);else if(v>node.v)node.right=rawInsert(node.right,v);return node;}
    [8,4,12,2,6,10].forEach(function(v){root=rawInsert(root,v);});
    var nodeEls={};
    function positions(){var lay=layoutTree(root);var stageW=Math.max(540,stage.clientWidth||540),padX=34,padY=30,levelH=52,innerW=stageW-padX*2,P={};(function walk(n){if(!n)return;var p=lay.pos[n.id];P[n.id]={x:padX+(lay.cols<=1?innerW/2:(p.c/(lay.cols-1))*innerW),y:padY+p.d*levelH};walk(n.left);walk(n.right);})(root);return P;}
    function render(popId){[].forEach.call(stage.querySelectorAll('.node'),function(n){n.remove();});clearSVG(edges);nodeEls={};if(!root)return;var P=positions();(function de(n){if(!n)return;[n.left,n.right].forEach(function(c){if(c)edges.appendChild(mk('line',{x1:P[n.id].x,y1:P[n.id].y,x2:P[c.id].x,y2:P[c.id].y,stroke:'rgba(140,160,205,0.3)','stroke-width':1.5}));});de(n.left);de(n.right);})(root);(function dn(n){if(!n)return;var el=div('node');el.style.left=P[n.id].x+'px';el.style.top=P[n.id].y+'px';el.textContent=n.v;if(n.id===popId)el.classList.add('pop','ok');stage.appendChild(el);nodeEls[n.id]=el;dn(n.left);dn(n.right);})(root);}
    render();window.addEventListener('resize',function(){if(!run.busy)render();});
    function findNode(v){var n=root;while(n){if(v===n.v)return n;n=v<n.v?n.left:n.right;}return null;}
    function pathTo(v){var p=[],n=root;while(n){p.push(n);if(v===n.v)return {path:p,found:true};n=v<n.v?n.left:n.right;}return {path:p,found:false};}
    function clearHL(){[].forEach.call(stage.querySelectorAll('.node'),function(e){e.classList.remove('compare','focus','ok','bad');});}
    function animateInsert(v,after){
      var pr=pathTo(v);run.cancel();
      pr.path.forEach(function(node,i){run.add(function(){clearHL();nodeEls[node.id].classList.add('compare');var dir=v===node.v?'equal':(v<node.v?'smaller → go left':'larger → go right');foot.innerHTML='Compare '+v+' with '+node.v+' — '+dir+'.';},520);});
      run.add(function(){
        if(pr.found){var ln=pr.path[pr.path.length-1];nodeEls[ln.id].classList.add('ok');foot.innerHTML=v+' is already in the tree — BSTs hold no duplicates.';if(after)after();return;}
        root=rawInsert(root,v);var nn=findNode(v);render(nn.id);foot.innerHTML='Found an empty spot — attached '+v+' as a new leaf. <span class="ok">O(log n) in a balanced tree</span>.';if(after)after();
      },420).run();
    }
    document.getElementById('bstInsert').addEventListener('click',function(){if(run.busy)return;var v=parseInt(valIn.value,10);if(isNaN(v)){v=Math.floor(Math.random()*99)+1;}valIn.value='';animateInsert(v);});
    valIn.addEventListener('keydown',function(e){if(e.key==='Enter'&&!run.busy){var v=parseInt(valIn.value,10);if(!isNaN(v)){valIn.value='';animateInsert(v);}}});
    document.getElementById('bstFind').addEventListener('click',function(){
      if(run.busy)return;var v=parseInt(valIn.value,10);if(isNaN(v)){foot.innerHTML='<span class="warn">Enter a value to search for.</span>';return;}valIn.value='';
      var pr=pathTo(v);run.cancel();
      pr.path.forEach(function(node){run.add(function(){clearHL();nodeEls[node.id].classList.add(node.v===v?'ok':'compare');foot.innerHTML=node.v===v?'<span class="ok">Found '+v+'</span> after '+pr.path.length+' comparison(s) — O(log n).':'At '+node.v+': '+(v<node.v?'go left':'go right')+'…';},520);});
      if(!pr.found){run.add(function(){foot.innerHTML='<span class="bad">'+v+' is not in the tree</span> — fell off after '+pr.path.length+' comparison(s).';},260);}
      run.run();
    });
    document.getElementById('bstDegen').addEventListener('click',function(){
      if(run.busy)return;id=0;root=null;render();var seq=[1,2,3,4,5];run.cancel();
      seq.forEach(function(v){run.add(function(){root=rawInsert(root,v);var nn=findNode(v);render(nn.id);foot.innerHTML='Inserted '+v+' in sorted order — it can only go right…';},520);});
      run.add(function(){clearHL();foot.innerHTML='<span class="bad">Degenerate tree</span> — height '+seq.length+', a linked list in disguise. Search is now <span class="bad">O(n)</span>. This is why balance matters.';},300).run();
    });
    document.getElementById('bstReset').addEventListener('click',function(){if(run.busy)return;id=0;root=null;[8,4,12,2,6,10].forEach(function(v){root=rawInsert(root,v);});render();foot.textContent='Reset. Insert values and watch each one walk down, comparing, until it finds an empty spot.';});
  })();

  (function rotLab(){
    var stage=document.getElementById('rotStage');if(!stage)return;
    var edges=document.getElementById('rotEdges'),foot=document.getElementById('rotFoot');
    var bal=false;var els={};
    [1,2,3].forEach(function(v){var el=div('node');el.textContent=v;el.dataset.v=v;stage.appendChild(el);els[v]=el;});
    function place(){
      var W=Math.max(420,stage.clientWidth||420),cx=W/2,pos;
      if(!bal){pos={1:{x:cx-90,y:42},2:{x:cx-6,y:118},3:{x:cx+78,y:194}};}
      else{pos={2:{x:cx,y:52},1:{x:cx-86,y:150},3:{x:cx+86,y:150}};}
      els[1].style.left=pos[1].x+'px';els[1].style.top=pos[1].y+'px';
      els[2].style.left=pos[2].x+'px';els[2].style.top=pos[2].y+'px';
      els[3].style.left=pos[3].x+'px';els[3].style.top=pos[3].y+'px';
      clearSVG(edges);
      function edge(a,b){edges.appendChild(mk('line',{x1:pos[a].x,y1:pos[a].y,x2:pos[b].x,y2:pos[b].y,stroke:'rgba(140,160,205,0.35)','stroke-width':1.6}));}
      if(!bal){edge(1,2);edge(2,3);els[2].classList.add('focus');}else{edge(2,1);edge(2,3);els[2].classList.remove('focus');els[1].classList.add('ok');els[3].classList.add('ok');els[2].classList.add('ok');}
    }
    place();window.addEventListener('resize',place);
    document.getElementById('rotGo').addEventListener('click',function(){if(bal)return;bal=true;place();foot.innerHTML='<span class="ok">Rotated left around node 1.</span> Node 2 rises to the root with 1 and 3 as children — height 3 → 2, still left &lt; root &lt; right. <b>O(1)</b>.';});
    document.getElementById('rotReset').addEventListener('click',function(){bal=false;els[1].className='node';els[2].className='node';els[3].className='node';els[1].textContent='1';els[2].textContent='2';els[3].textContent='3';place();foot.innerHTML='This chain of 1·2·3 has height 3. One rotation around the middle makes it height 2 — and it\'s still a valid BST.';});
  })();

  (function heapLab(){
    var stage=document.getElementById('heapStage');if(!stage)return;
    var edges=document.getElementById('heapEdges'),arrEl=document.getElementById('heapArr'),foot=document.getElementById('heapFoot'),valIn=document.getElementById('heapVal');
    var heap=[3,5,8,9,11,10],run=new Runner();
    function nodePos(i,n){var level=Math.floor(Math.log2(i+1));var posInLevel=i-(Math.pow(2,level)-1);var countInLevel=Math.pow(2,level);var stageW=Math.max(520,stage.clientWidth||520),padX=30,padY=28,levelH=54,innerW=stageW-padX*2;return {x:padX+(posInLevel+0.5)/countInLevel*innerW,y:padY+level*levelH};}
    function render(arr,hl){
      arr=arr||heap;hl=hl||{};
      [].forEach.call(stage.querySelectorAll('.node'),function(n){n.remove();});clearSVG(edges);
      var n=arr.length;
      for(var i=0;i<n;i++){var l=2*i+1,r=2*i+2,pp=nodePos(i,n);if(l<n){var cl=nodePos(l,n);edges.appendChild(mk('line',{x1:pp.x,y1:pp.y,x2:cl.x,y2:cl.y,stroke:'rgba(140,160,205,0.3)','stroke-width':1.5}));}if(r<n){var cr=nodePos(r,n);edges.appendChild(mk('line',{x1:pp.x,y1:pp.y,x2:cr.x,y2:cr.y,stroke:'rgba(140,160,205,0.3)','stroke-width':1.5}));}}
      for(i=0;i<n;i++){var p=nodePos(i,n);var el=div('node');el.style.left=p.x+'px';el.style.top=p.y+'px';el.textContent=arr[i];if(hl[i])el.classList.add(hl[i]);stage.appendChild(el);}
      arrEl.innerHTML='';arr.forEach(function(v,i){var c=div('harr-cell');c.textContent=v;if(hl[i])c.classList.add(hl[i]);var ix=div('ix');ix.textContent=i;c.appendChild(ix);arrEl.appendChild(c);});
    }
    render();window.addEventListener('resize',function(){if(!run.busy)render();});
    function one(i,c){var o={};o[i]=c;return o;}
    function two(a,ca,b,cb){var o={};o[a]=ca;o[b]=cb;return o;}
    function play(snaps){run.cancel();snaps.forEach(function(s){run.add(function(){render(s.arr,s.hl);foot.innerHTML=s.msg;},560);});run.run();}
    function swap(i,j){var t=heap[i];heap[i]=heap[j];heap[j]=t;}
    document.getElementById('heapInsert').addEventListener('click',function(){
      if(run.busy)return;var v=parseInt(valIn.value,10);if(isNaN(v))v=Math.floor(Math.random()*99)+1;valIn.value='';
      heap.push(v);var snaps=[],i=heap.length-1;
      snaps.push({arr:heap.slice(),hl:one(i,'focus'),msg:'Placed '+v+' at the end (index '+i+', the next open leaf). Now sift up.'});
      while(i>0){var p=Math.floor((i-1)/2);snaps.push({arr:heap.slice(),hl:two(i,'compare',p,'compare'),msg:'Compare '+heap[i]+' with its parent '+heap[p]+'.'});if(heap[i]<heap[p]){var child=heap[i];swap(i,p);snaps.push({arr:heap.slice(),hl:two(p,'ok',i,'focus'),msg:child+' &lt; '+heap[i]+' — swap it up. <span class="ok">O(log n)</span>.'});i=p;}else{snaps.push({arr:heap.slice(),hl:one(i,'ok'),msg:heap[i]+' ≥ parent '+heap[p]+' — heap property holds, stop.'});break;}}
      if(i===0)snaps.push({arr:heap.slice(),hl:one(0,'ok'),msg:heap[0]+' settled at the root — it is the new minimum.'});
      play(snaps);
    });
    valIn.addEventListener('keydown',function(e){if(e.key==='Enter'&&!run.busy)document.getElementById('heapInsert').click();});
    document.getElementById('heapExtract').addEventListener('click',function(){
      if(run.busy)return;if(!heap.length){foot.innerHTML='<span class="warn">Heap is empty.</span>';return;}
      var min=heap[0],snaps=[];snaps.push({arr:heap.slice(),hl:one(0,'bad'),msg:'Remove the root '+min+' — that is the minimum, available in <span class="ok">O(1)</span>.'});
      var last=heap.pop();
      if(heap.length){heap[0]=last;snaps.push({arr:heap.slice(),hl:one(0,'focus'),msg:'Move the last element '+last+' into the root, then sift down.'});
        var i=0;
        while(true){var l=2*i+1,r=2*i+2,small=i;if(l<heap.length&&heap[l]<heap[small])small=l;if(r<heap.length&&heap[r]<heap[small])small=r;
          if(l<heap.length){var hl={};hl[i]='focus';if(l<heap.length)hl[l]='compare';if(r<heap.length)hl[r]='compare';snaps.push({arr:heap.slice(),hl:hl,msg:'Compare '+heap[i]+' with its child'+(r<heap.length?'ren':'')+'.'});}
          if(small!==i){swap(i,small);snaps.push({arr:heap.slice(),hl:two(small,'focus',i,'ok'),msg:'Swap down with the smaller child. <span class="ok">O(log n)</span>.'});i=small;}else break;
        }
        snaps.push({arr:heap.slice(),hl:one(i,'ok'),msg:'Heap property restored. <span class="ok">'+min+' extracted.</span>'});
      } else { snaps.push({arr:[],hl:{},msg:'Extracted '+min+' — the heap is now empty.'}); }
      play(snaps);
    });
    document.getElementById('heapReset').addEventListener('click',function(){if(run.busy)return;heap=[3,5,8,9,11,10];render();foot.textContent='Reset. Insert a value and watch it bubble up; extract the min and watch the gap heal downward.';});
  })();

  (function graph(){
    var svg=document.getElementById('graphSvg');if(!svg)return;
    function txt(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill||'#7E88A4','font-size':size||12,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
    var V={A:{x:90,y:55},B:{x:230,y:48},C:{x:165,y:135},D:{x:70,y:205},E:{x:250,y:195}};
    var E=[['A','B'],['A','C'],['B','C'],['C','D'],['C','E'],['D','E']];
    E.forEach(function(e){var a=V[e[0]],b=V[e[1]];svg.appendChild(mk('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'rgba(139,124,255,0.5)','stroke-width':1.8}));});
    Object.keys(V).forEach(function(k){var p=V[k];svg.appendChild(mk('circle',{cx:p.x,cy:p.y,r:18,fill:'rgba(86,199,255,0.12)',stroke:'#56C7FF','stroke-width':1.8}));svg.appendChild(txt(p.x,p.y+5,k,'#E8ECF8',14,'middle',600));});
    svg.appendChild(txt(360,30,'adjacency list','#4ED66B',12,'start',600));
    var adj={A:'B, C',B:'A, C',C:'A, B, D, E',D:'C, E',E:'C, D'};var y=58;
    Object.keys(adj).forEach(function(k){svg.appendChild(txt(360,y,k+' →','#8B95AD',13,'start'));svg.appendChild(txt(392,y,adj[k],'#E8ECF8',13,'start'));y+=30;});
    svg.appendChild(txt(360,y+6,'O(V + E) space · sparse-friendly','#565F79',10.5,'start'));
  })();

  (function trie(){
    var svg=document.getElementById('trieSvg');if(!svg)return;
    function txt(x,y,s,fill,size,weight){var t=mk('text',{x:x,y:y,fill:fill,'font-size':size||13,'font-family':'IBM Plex Mono, monospace','text-anchor':'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
    var nodes={root:{x:280,y:34,l:'•'},c:{x:170,y:96,l:'c'},d:{x:400,y:96,l:'d'},ca:{x:170,y:158,l:'a'},dO:{x:400,y:158,l:'o'},car:{x:110,y:210,l:'r',end:true},cat:{x:230,y:210,l:'t',end:true},dog:{x:400,y:210,l:'g',end:true}};
    var links=[['root','c'],['c','ca'],['ca','car'],['ca','cat'],['root','d'],['d','dO'],['dO','dog']];
    links.forEach(function(e){var a=nodes[e[0]],b=nodes[e[1]];svg.appendChild(mk('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'rgba(140,160,205,0.32)','stroke-width':1.5}));});
    Object.keys(nodes).forEach(function(k){var n=nodes[k];var col=n.end?'#4ED66B':(k==='root'?'#7E88A4':'#56C7FF');svg.appendChild(mk('circle',{cx:n.x,cy:n.y,r:16,fill:n.end?'rgba(78,214,107,0.14)':'rgba(86,199,255,0.10)',stroke:col,'stroke-width':n.end?2:1.5}));svg.appendChild(txt(n.x,n.y+5,n.l,'#E8ECF8',13,'600'));if(n.end)svg.appendChild(mk('circle',{cx:n.x,cy:n.y,r:20,fill:'none',stroke:'#4ED66B','stroke-width':1,'stroke-dasharray':'2 3'}));});
    svg.appendChild(txt(110,238,'"car"','#4ED66B',11));svg.appendChild(txt(230,238,'"cat"','#4ED66B',11));svg.appendChild(txt(400,238,'"dog"','#4ED66B',11));
    svg.appendChild(txt(170,135,'shared c–a prefix','#565F79',9.5));
  })();

  onScroll();
})();
