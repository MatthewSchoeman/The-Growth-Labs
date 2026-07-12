(function(){
"use strict";
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function byId(id){return document.getElementById(id);}
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
function clearSVG(s){while(s.firstChild)s.removeChild(s.firstChild);}
var C={bit:'#56C7FF',int:'#E8B341',flt:'#5BD6C2',ptr:'#A78BFA',ref:'#F2973C',mem:'#4ED66B',addr:'#ED6E9E',oflow:'#ED4E6E',
       ink:'#E8ECF8',soft:'#B7C0D8',mut:'#7E88A4',faint:'#565F79',ok:'#4ED66B',bad:'#ED4E6E',
       line:'rgba(140,160,205,0.4)',lineFaint:'rgba(140,160,205,0.2)',surface:'#161E32',border:'rgba(140,160,205,0.26)'};

function Runner(){this.q=[];this.t=null;this.busy=false;}
Runner.prototype.add=function(fn,delay){this.q.push({fn:fn,delay:reduceMotion?0:delay});return this;};
Runner.prototype.run=function(done){var self=this;this.busy=true;(function step(){if(!self.q.length){self.busy=false;if(done)done();return;}var it=self.q.shift();if(it.fn)it.fn();self.t=setTimeout(step,it.delay);})();};
Runner.prototype.cancel=function(){clearTimeout(this.t);this.q=[];this.busy=false;};

function svgText(x,y,s,fill,size,anchor,weight,mono){var t=mk('text',{x:x,y:y,fill:fill||C.mut,'font-size':size||12,'font-family':(mono===false?'IBM Plex Sans, sans-serif':'IBM Plex Mono, monospace'),'text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function hex2(n){return '0x'+(n&0xFF).toString(16).toUpperCase().padStart(2,'0');}

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
  svg.appendChild(svgText(70,120,'value',C.faint,11,'middle','400'));
  var valText=svgText(70,168,'42',C.ink,46,'middle','700');svg.appendChild(valText);
  function arrowMark(id,color){if(!svg.querySelector('#'+id)){var m=mk('marker',{id:id,markerWidth:8,markerHeight:8,refX:6,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:color}));svg.appendChild(m);}}
  arrowMark('hA',C.faint);arrowMark('hP',C.ptr);
  svg.appendChild(mk('line',{x1:120,y1:150,x2:172,y2:150,stroke:C.faint,'stroke-width':1.5,'marker-end':'url(#hA)'}));
  svg.appendChild(svgText(146,138,'is',C.faint,9,'middle','400',false));
  var bits=[0,0,1,0,1,0,1,0];
  var bx=186,by=128,bw=24,bh=30,gap=4;
  svg.appendChild(svgText(186+(bw*8+gap*7)/2,118,'bits',C.bit,11,'middle','400'));
  var bitG=mk('g',{});svg.appendChild(bitG);
  bits.forEach(function(b,i){
    var x=bx+i*(bw+gap);
    var on=b===1;
    var cell=mk('g',{});cell.setAttribute('opacity',reduceMotion?1:0);cell.setAttribute('data-i',i);
    cell.appendChild(rrect(x,by,bw,bh,4,on?'rgba(86,199,255,0.16)':'var(--bg)',on?C.bit:C.border,1.4));
    cell.appendChild(svgText(x+bw/2,by+20,b+'',on?C.bit:C.faint,15,'middle','700'));
    bitG.appendChild(cell);
  });
  svg.appendChild(mk('line',{x1:bx+8*(bw+gap)+2,y1:150,x2:bx+8*(bw+gap)+34,y2:150,stroke:C.faint,'stroke-width':1.5,'marker-end':'url(#hA)'}));
  var boxX=460,boxY=96,boxW=180,boxH=108;
  svg.appendChild(rrect(boxX,boxY,boxW,boxH,12,'rgba(78,214,107,0.04)',C.mem,2));
  svg.appendChild(svgText(boxX+14,boxY-10,'0x7ffe…04',C.addr,11,'start','600'));
  svg.appendChild(svgText(boxX+boxW-12,boxY-10,'address',C.faint,9,'end','400',false));
  svg.appendChild(svgText(boxX+16,boxY+30,'int x',C.mem,13,'start','600'));
  svg.appendChild(svgText(boxX+boxW/2,boxY+70,'00101010',C.bit,17,'middle','700'));
  svg.appendChild(svgText(boxX+boxW/2,boxY+92,'= 42',C.soft,12,'middle','400'));
  svg.appendChild(svgText(boxX+90,boxY+12,'the box',C.faint,9,'middle','400',false));
  var pX=700,pY=120,pW=132,pH=64;
  svg.appendChild(rrect(pX,pY,pW,pH,10,'rgba(167,139,250,0.05)',C.ptr,2));
  svg.appendChild(svgText(pX+14,pY+26,'int *p',C.ptr,13,'start','600'));
  svg.appendChild(svgText(pX+pW/2,pY+50,'0x7ffe…04',C.addr,13,'middle','700'));
  var pathP=mk('path',{d:'M'+pX+' '+(pY+pH-6)+' C'+(pX-40)+' '+(pY+90)+','+(boxX+boxW+40)+' '+(boxY+74)+','+(boxX+boxW+3)+' '+(boxY+62),fill:'none',stroke:C.ptr,'stroke-width':1.8,'marker-end':'url(#hP)'});
  pathP.setAttribute('opacity',reduceMotion?1:0);
  svg.appendChild(pathP);
  svg.appendChild(svgText((pX+boxX+boxW)/2+6,pY+96,'points to',C.ptr,9,'middle','400',false));
  if(!reduceMotion){
    var cells=bitG.querySelectorAll('g');var i=0;
    var iv=setInterval(function(){ if(i>=cells.length){clearInterval(iv); pathP.style.transition='opacity .5s';pathP.setAttribute('opacity',1); return;} cells[i].style.transition='opacity .3s';cells[i].setAttribute('opacity',1); i++; },120);
  }
})();

(function binLab(){
  var cellsEl=byId('binCells'),decEl=byId('binDec'),hexEl=byId('binHex'),foot=byId('binFoot');
  if(!cellsEl)return;
  var bits=[0,0,0,0,0,0,0,0];
  function place(i){return 128>>i;}
  function render(){
    cellsEl.innerHTML='';
    bits.forEach(function(b,i){
      var cell=el('div','bitcell'+(b?' on':''),'<div class="bv">'+b+'</div><div class="bp">'+place(i)+'</div>');
      cell.addEventListener('click',function(){bits[i]^=1;cell.classList.add('flip');update();render();});
      cellsEl.appendChild(cell);
    });
    update();
  }
  function update(){
    var v=0;bits.forEach(function(b,i){if(b)v+=place(i);});
    decEl.textContent=v;hexEl.textContent=hex2(v);
    var on=[];bits.forEach(function(b,i){if(b)on.push(place(i));});
    foot.innerHTML=on.length?('<b style="color:var(--bit)">'+on.join(' + ')+'</b> = '+v):'All bits off — the value is 0. Flip some on.';
  }
  render();
})();

(function twosLab(){
  var cellsEl=byId('twosCells'),uEl=byId('twosUnsigned'),sEl=byId('twosSigned'),hEl=byId('twosHex'),foot=byId('twosFoot');
  if(!cellsEl)return;
  var neg=byId('twosNegate'),clr=byId('twosClear');
  var bits=[1,0,1,0,1,0,1,0];
  var weights=['-128','64','32','16','8','4','2','1'];
  function render(flipAll){
    cellsEl.innerHTML='';
    bits.forEach(function(b,i){
      var sign=i===0;
      var cell=el('div','bitcell'+(sign?' sign':'')+(b?' on':''),'<div class="bv">'+b+'</div><div class="bp">'+weights[i]+'</div>');
      if(flipAll)cell.classList.add('flip');
      cell.addEventListener('click',function(){bits[i]^=1;cell.classList.add('flip');render();});
      cellsEl.appendChild(cell);
    });
    update();
  }
  function update(){
    var u=0;bits.forEach(function(b,i){if(b)u+=(128>>i);});
    var s=bits[0]?u-256:u;
    uEl.textContent=u;sEl.textContent=s;hEl.textContent=hex2(u);
    foot.innerHTML=bits[0]
      ? 'The sign bit is <b style="color:var(--oflow)">on</b>, so the signed reading is negative ('+s+'), while the same bits read unsigned are '+u+'.'
      : 'The sign bit is off — signed and unsigned agree here ('+u+').';
  }
  neg.addEventListener('click',function(){
    var u=0;bits.forEach(function(b,i){if(b)u+=(128>>i);});
    var n=((~u)+1)&0xFF;
    for(var i=0;i<8;i++)bits[i]=(n>>(7-i))&1;
    render(true);
  });
  clr.addEventListener('click',function(){bits=[0,0,0,0,0,0,0,0];render(true);});
  render();
})();

(function ovfLab(){
  var wheel=byId('ovfWheel'),bitsEl=byId('ovfBits'),valEl=byId('ovfValue'),rangeEl=byId('ovfRange'),foot=byId('ovfFoot');
  if(!wheel)return;
  var raw=42,mode='unsigned';
  function disp(r){return mode==='unsigned'?r:(r>=128?r-256:r);}
  function renderBits(){
    bitsEl.innerHTML='';
    for(var i=0;i<8;i++){var b=(raw>>(7-i))&1;bitsEl.appendChild(el('div','ob'+(b?' on':''),b+''));}
  }
  function drawWheel(wrapped){
    clearSVG(wheel);
    var cx=100,cy=100,r=78;
    wheel.appendChild(mk('circle',{cx:cx,cy:cy,r:r,fill:'none',stroke:C.border,'stroke-width':2}));
    for(var t=0;t<16;t++){var a=(t/16)*Math.PI*2-Math.PI/2;var x1=cx+Math.cos(a)*(r-5),y1=cy+Math.sin(a)*(r-5),x2=cx+Math.cos(a)*r,y2=cy+Math.sin(a)*r;wheel.appendChild(mk('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:C.faint,'stroke-width':1}));}
    wheel.appendChild(mk('line',{x1:cx,y1:cy-r-6,x2:cx,y2:cy-r+12,stroke:wrapped?C.oflow:C.oflow,'stroke-width':2.5}));
    wheel.appendChild(svgText(cx,cy-r-12,'wrap',wrapped?C.oflow:C.faint,9,'middle','600',false));
    var pos=raw/256;var ang=pos*Math.PI*2-Math.PI/2;
    var nx=cx+Math.cos(ang)*(r-12),ny=cy+Math.sin(ang)*(r-12);
    wheel.appendChild(mk('line',{x1:cx,y1:cy,x2:nx,y2:ny,stroke:wrapped?C.oflow:C.int,'stroke-width':3,'stroke-linecap':'round'}));
    wheel.appendChild(mk('circle',{cx:nx,cy:ny,r:6,fill:wrapped?C.oflow:C.int}));
    wheel.appendChild(mk('circle',{cx:cx,cy:cy,r:4,fill:C.soft}));
    wheel.appendChild(svgText(cx,cy+34,(mode==='unsigned'?'0…255':'-128…127'),C.faint,9,'middle','400',false));
  }
  function render(wrapped){
    renderBits();drawWheel(wrapped);
    var v=disp(raw);
    valEl.textContent=v;
    valEl.classList.toggle('wrapped',!!wrapped);
    rangeEl.textContent=mode==='unsigned'?'range 0 … 255':'range −128 … 127';
    if(wrapped)setTimeout(function(){valEl.classList.remove('wrapped');drawWheel(false);},700);
  }
  function step(delta){
    var oldV=disp(raw);
    var expected=oldV+delta;
    raw=((raw+delta)%256+256)%256;
    var newV=disp(raw);
    var wrapped=(newV!==expected);
    render(wrapped);
    if(wrapped){
      if(mode==='unsigned') foot.innerHTML='<b style="color:var(--oflow)">Wrapped!</b> '+(delta>0?'Past 255 the carry fell off — back to '+newV+'. (mod 256)':'Below 0 it rolled up to '+newV+'.');
      else foot.innerHTML='<b style="color:var(--oflow)">Signed overflow!</b> The value jumped across the sign boundary to '+newV+' — the largest magnitude flips sign.';
    } else {
      foot.innerHTML=oldV+' '+(delta>0?'+':'−')+' '+Math.abs(delta)+' = '+newV+'. No overflow — still inside the range.';
    }
  }
  byId('ovfInc').addEventListener('click',function(){step(1);});
  byId('ovfDec').addEventListener('click',function(){step(-1);});
  byId('ovfPlus10').addEventListener('click',function(){step(10);});
  byId('ovfMinus10').addEventListener('click',function(){step(-10);});
  byId('ovfMax').addEventListener('click',function(){raw=(mode==='unsigned')?255:127;render(false);foot.innerHTML='At the maximum ('+disp(raw)+'). One more step and it wraps — try +1.';});
  [].forEach.call(document.querySelectorAll('#ovfLab [data-ow]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#ovfLab [data-ow]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');mode=b.dataset.ow;render(false);
      foot.innerHTML='Now reading the same byte as <b>'+mode+'</b>. Range is '+(mode==='unsigned'?'0…255':'−128…127')+'.';
    });
  });
  render(false);
})();

(function floatLab(){
  var input=byId('floatInput'),go=byId('floatGo'),bitsEl=byId('floatBits'),outEl=byId('floatOut'),foot=byId('floatFoot');
  if(!input)return;
  var buf=new ArrayBuffer(4),f32=new Float32Array(buf),u32=new Uint32Array(buf);
  function dissect(){
    var val=parseFloat(input.value);
    if(isNaN(val)){foot.innerHTML='<span style="color:var(--oflow)">Not a number</span> — type a value like 0.1 or -2.5.';return;}
    f32[0]=val;var bits=u32[0]>>>0;
    var sign=(bits>>>31)&1, exp=(bits>>>23)&0xFF, man=bits&0x7FFFFF;
    bitsEl.innerHTML='';
    function grp(label,arr,cls){
      var g=el('div','fgrp');
      var row=el('div','fgrp-row');
      arr.forEach(function(b){row.appendChild(el('div','fbit '+cls+(b?'':' z'),b+''));});
      g.appendChild(row);g.appendChild(el('div','fgrp-lab',label));
      return g;
    }
    bitsEl.appendChild(grp('sign',[sign],'sgn'));
    var ea=[];for(var i=7;i>=0;i--)ea.push((exp>>i)&1);
    bitsEl.appendChild(grp('exponent (8)',ea,'exp'));
    var ma=[];for(var j=22;j>=0;j--)ma.push((man>>j)&1);
    bitsEl.appendChild(grp('mantissa (23)',ma,'man'));
    var stored=f32[0];
    var diff=(stored!==val);
    var ubExp=exp-127;
    outEl.innerHTML='';
    function stat(k,v,warn){return '<div class="float-stat'+(warn?' warn':'')+'"><span class="fk">'+k+'</span><span class="fv">'+v+'</span></div>';}
    var storedStr=(exp===255)?(man?'NaN':(sign?'-Infinity':'Infinity')):String(stored);
    outEl.innerHTML=stat('you typed',String(val))
      +stat('stored as float32',storedStr,diff)
      +stat('sign · exp · 2^',(sign?'−':'+')+' · '+(exp===255?'∞/NaN':ubExp));
    if(exp===255){foot.innerHTML=man?'All exponent bits set with a non-zero mantissa is <b style="color:var(--oflow)">NaN</b> — "not a number".':'All exponent bits set is <b style="color:var(--oflow)">Infinity</b> — the value overflowed float range.';}
    else if(diff)foot.innerHTML='You typed '+val+', but the closest float32 is <b style="color:var(--oflow)">'+storedStr+'</b>. Few decimals land exactly.';
    else foot.innerHTML='This value is representable <b style="color:var(--st-ok)">exactly</b> in float32 — no rounding needed.';
  }
  go.addEventListener('click',dissect);
  input.addEventListener('keydown',function(e){if(e.key==='Enter')dissect();});
  [].forEach.call(document.querySelectorAll('#floatLab .float-ex'),function(b){
    b.addEventListener('click',function(){input.value=b.dataset.fv;dissect();});
  });
  dissect();
})();

(function ptrLab(){
  var memEl=byId('ptrMem'),arrow=byId('ptrArrow'),stateEl=byId('ptrState'),foot=byId('ptrFoot');
  if(!memEl)return;
  var vars={x:{addr:0x1000,val:42},y:{addr:0x1004,val:7}};
  var target='x';
  function addrStr(a){return '0x'+a.toString(16);}
  function render(){
    [].slice.call(memEl.querySelectorAll('.memcell')).forEach(function(n){n.remove();});
    function cell(name,cls,addr,valHtml,id){
      var c=el('div','memcell');
      c.innerHTML='<div class="mc-addr">'+addrStr(addr)+'</div><div class="mc-box '+cls+'" data-id="'+id+'"><span class="mc-name">'+name+'</span><span class="mc-val">'+valHtml+'</span></div>';
      memEl.appendChild(c);return c;
    }
    cell('int x',(target==='x'?'var pointed':'var'),vars.x.addr,vars.x.val,'x');
    cell('int y',(target==='y'?'var pointed':'var'),vars.y.addr,vars.y.val,'y');
    cell('int *p','ptr',0x1008,addrStr(vars[target].addr)+' <span style="color:var(--ink-faint)">→</span>','p');
    drawArrow();renderState();
  }
  function boxOf(id){return memEl.querySelector('.mc-box[data-id="'+id+'"]');}
  function drawArrow(){
    clearSVG(arrow);
    var pBox=boxOf('p'),tBox=boxOf(target);
    if(!pBox||!tBox)return;
    var cr=memEl.getBoundingClientRect(),pr=pBox.getBoundingClientRect(),tr=tBox.getBoundingClientRect();
    var x1=pr.left-cr.left+10, y1=pr.top-cr.top+pr.height/2;
    var x2=tr.right-cr.left-6, y2=tr.top-cr.top+tr.height/2;
    if(!arrow.querySelector('#pAh')){var m=mk('marker',{id:'pAh',markerWidth:8,markerHeight:8,refX:6,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:C.ptr}));arrow.appendChild(m);}
    var midx=Math.min(x1,x2)-46;
    arrow.appendChild(mk('path',{d:'M'+x1+' '+y1+' C'+midx+' '+y1+','+midx+' '+y2+','+x2+' '+y2,fill:'none',stroke:C.ptr,'stroke-width':2,'marker-end':'url(#pAh)'}));
  }
  function renderState(){
    var t=vars[target];
    stateEl.innerHTML='<div><span class="pdim">p&nbsp;&nbsp;=</span> <span class="pa">'+addrStr(t.addr)+'</span> <span class="pdim">// address of '+target+'</span></div>'
      +'<div><span class="pdim">*p =</span> <span class="pv">'+t.val+'</span> <span class="pdim">// the value at that address</span></div>'
      +'<div><span class="pdim">&amp;x =</span> <span class="pa">'+addrStr(vars.x.addr)+'</span></div>'
      +'<div><span class="pdim">&amp;y =</span> <span class="pa">'+addrStr(vars.y.addr)+'</span></div>';
  }
  [].forEach.call(document.querySelectorAll('#ptrLab [data-pp]'),function(b){
    b.addEventListener('click',function(){
      target=b.dataset.pp;render();
      foot.innerHTML='<code class="tok">p = &amp;'+target+'</code> — p now holds '+target+'\u2019s address. The arrow follows.';
    });
  });
  byId('ptrWrite').addEventListener('click',function(){
    var v=parseInt(byId('ptrWriteVal').value,10);if(isNaN(v))return;
    vars[target].val=v;render();
    var box=boxOf(target);if(box){box.classList.add('write');setTimeout(function(){box.classList.remove('write');},520);}
    foot.innerHTML='<code class="tok">*p = '+v+'</code> wrote through the pointer into <b style="color:var(--ptr)">'+target+'</b> — never into p itself.';
  });
  render();
  window.addEventListener('resize',drawArrow);
})();

(function refLab(){
  var boxesEl=byId('refBoxes'),tagEl=byId('refTag'),foot=byId('refFoot');
  if(!boxesEl)return;
  var mode='value',assigned=false,boxes=[];
  function reset(){assigned=false;boxes=[{names:['a'],val:5}];render();tagEl.textContent='b is not assigned yet. Press “b = a”.';}
  function render(bumpIdx){
    boxesEl.innerHTML='';
    boxes.forEach(function(bx,i){
      var alias=bx.names.length>1;
      var box=el('div','ref-box'+(alias?' alias':'')+(bumpIdx===i?' bump':''),'<div class="rb-names">'+bx.names.join(', ')+'</div><div class="rb-val">'+bx.val+'</div>');
      boxesEl.appendChild(box);
    });
    if(!assigned)boxesEl.appendChild(el('div','ref-box',{}.toString?'<div class="rb-names" style="color:var(--ink-faint)">b</div><div class="rb-val" style="color:var(--ink-faint)">?</div>':''));
  }
  byId('refAssign').addEventListener('click',function(){
    if(assigned)return;
    assigned=true;
    if(mode==='value'){boxes=[{names:['a'],val:5},{names:['b'],val:5}];tagEl.innerHTML='Value copy → <b style="color:var(--st-ok)">two independent boxes</b> that happen to hold equal values.';}
    else{boxes=[{names:['a','b'],val:5}];tagEl.innerHTML='Reference copy → <b style="color:var(--ref)">one box with two names</b>. a and b are aliases.';}
    render();
    foot.innerHTML='<code class="tok">b = a</code> done. Now press <code class="tok">a = 99</code> and watch whether b follows.';
  });
  byId('refMutate').addEventListener('click',function(){
    var idx=-1;boxes.forEach(function(bx,i){if(bx.names.indexOf('a')>=0)idx=i;});
    if(idx<0)return;boxes[idx].val=99;render(idx);
    if(!assigned){foot.innerHTML='a is now 99. Assign <code class="tok">b = a</code> first to compare.';return;}
    if(mode==='value')foot.innerHTML='a became 99; <b style="color:var(--st-ok)">b is still 5</b> — separate boxes, no link.';
    else foot.innerHTML='a became 99 and <b style="color:var(--ref)">b is 99 too</b> — they share one box.';
  });
  byId('refReset').addEventListener('click',reset);
  [].forEach.call(document.querySelectorAll('#refLab [data-rm]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#refLab [data-rm]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');mode=b.dataset.rm;reset();
    });
  });
  reset();
})();

(function endLab(){
  var bytesEl=byId('endBytes'),foot=byId('endFoot');
  if(!bytesEl)return;
  var value=[0x12,0x34,0x56,0x78];
  var mode='little';
  function render(){
    bytesEl.innerHTML='';
    var order=mode==='little'?value.slice().reverse():value.slice();
    order.forEach(function(byte,i){
      var addr='0x0'+i;
      var sig = (mode==='little')? (i===0?'least significant':(i===3?'most significant':'')) : (i===0?'most significant':(i===3?'least significant':''));
      var c=el('div','memcell');
      c.innerHTML='<div class="mc-addr">'+addr+'</div><div class="mc-box" style="border-color:var(--addr)"><span class="mc-name">byte '+i+'</span><span class="mc-val" style="color:var(--bit)">0x'+byte.toString(16).toUpperCase().padStart(2,'0')+'</span></div>';
      bytesEl.appendChild(c);
    });
  }
  [].forEach.call(document.querySelectorAll('#endLab [data-em]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#endLab [data-em]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');mode=b.dataset.em;render();
      foot.innerHTML=mode==='little'
        ? '<b>Little-endian:</b> the lowest address (0x00) holds <b style="color:var(--bit)">0x78</b>, the least significant byte. The value looks reversed in memory.'
        : '<b>Big-endian:</b> the lowest address (0x00) holds <b style="color:var(--bit)">0x12</b>, the most significant byte — the order we write it in.';
    });
  });
  render();
})();

onScroll();
})();
