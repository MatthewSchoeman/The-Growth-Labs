(function(){
"use strict";
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function byId(id){return document.getElementById(id);}
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
function clearSVG(s){while(s.firstChild)s.removeChild(s.firstChild);}
var C={abstract:'#56C7FF',encap:'#E8B341',compose:'#5BD6C2',inherit:'#A78BFA',principle:'#F2973C',poly:'#4ED66B',couple:'#ED6E9E',
       bad:'#ED4E6E',warn:'#F2973C',ok:'#4ED66B',ink:'#E8ECF8',soft:'#B7C0D8',mut:'#7E88A4',faint:'#565F79',
       line:'rgba(140,160,205,0.4)',lineFaint:'rgba(140,160,205,0.2)',surface:'#161E32'};

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
  var run=new Runner();
  var ox=300,oy=58,ow=260,oh=184;
  function rrect(x,y,w,h,rx,fill,stroke,sw){return mk('rect',{x:x,y:y,width:w,height:h,rx:rx,fill:fill||'none',stroke:stroke||'none','stroke-width':sw||1});}
  svg.appendChild(rrect(ox,oy,ow,oh,16,'rgba(86,199,255,0.03)',C.abstract,2));
  svg.appendChild(svgText(ox+16,oy+24,'BankAccount',C.abstract,13,'start','600'));
  svg.appendChild(svgText(ox+ow-14,oy+24,'object',C.faint,9.5,'end','400'));
  svg.appendChild(mk('line',{x1:ox,y1:oy+36,x2:ox+ow,y2:oy+36,stroke:'rgba(86,199,255,0.25)','stroke-width':1,'stroke-dasharray':'4 3'}));
  svg.appendChild(svgText(ox+16,oy+54,'PUBLIC INTERFACE',C.abstract,9,'start','600'));
  var methods=['deposit()','withdraw()','balance'];
  var chips=[];
  var cw=74, gap=8, startx=ox+16;
  methods.forEach(function(m,i){
    var x=startx+i*(cw+gap), y=oy+62;
    var g=mk('g',{}); g.setAttribute('data-mi',i);
    g.appendChild(rrect(x,y,cw,24,7,'var(--surface-3)',C.abstract,1));
    g.appendChild(svgText(x+cw/2,y+16,m,C.abstract,10.5,'middle','600'));
    svg.appendChild(g); chips.push({g:g,x:x+cw/2,y:y});
  });
  var sy=oy+108;
  svg.appendChild(svgText(ox+16,sy,'PRIVATE STATE',C.encap,9,'start','600'));
  var lock=rrect(ox+16,sy+8,ow-32,52,9,'rgba(232,179,65,0.06)',C.encap,1.4);
  lock.setAttribute('stroke-dasharray','5 3');
  svg.appendChild(lock);
  var stateVal=svgText(ox+ow/2,sy+34,'\uD83D\uDD12  #balance = \u2588\u2588\u2588',C.encap,13,'middle','600');
  svg.appendChild(stateVal);
  svg.appendChild(svgText(ox+ow/2,sy+50,'hidden — reachable only through methods',C.faint,9,'middle','400',false));
  function caller(x,y,label){
    var g=mk('g',{});
    g.appendChild(rrect(x,y,108,46,10,'var(--surface-2)','var(--border-strong)',1.5));
    g.appendChild(svgText(x+54,y+20,label,C.soft,11,'middle','600'));
    g.appendChild(svgText(x+54,y+34,'caller',C.faint,8.5,'middle','400'));
    svg.appendChild(g);
    return {x:x,y:y,cx:x+108,cy:y+23};
  }
  var atm=caller(40,108,'ATM');
  var web=caller(712,108,'Web app');
  if(!svg.querySelector('#hAh')){var m=mk('marker',{id:'hAh',markerWidth:8,markerHeight:8,refX:6,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:C.abstract}));svg.appendChild(m);}
  function arrow(x1,y1,x2,y2){var mx=(x1+x2)/2;return mk('path',{d:'M'+x1+' '+y1+' C'+mx+' '+y1+','+mx+' '+y2+','+x2+' '+y2,fill:'none',stroke:'rgba(86,199,255,0.45)','stroke-width':1.6,'marker-end':'url(#hAh)'});}
  var aL=arrow(atm.cx,atm.cy,ox-4,oy+74); svg.appendChild(aL);
  var aR=arrow(web.x-4,web.cy,ox+ow+4,oy+74); svg.appendChild(aR);
  function pulse(fromx,fromy,tox,toy,chipIdx){
    var dot=mk('circle',{cx:fromx,cy:fromy,r:4,fill:C.abstract});
    svg.appendChild(dot);
    var t0=null,dur=620;
    function frame(ts){ if(!t0)t0=ts; var k=Math.min(1,(ts-t0)/dur);
      dot.setAttribute('cx',fromx+(tox-fromx)*k); dot.setAttribute('cy',fromy+(toy-fromy)*k);
      if(k<1)requestAnimationFrame(frame);
      else { dot.remove(); var ch=chips[chipIdx]; if(ch){ch.g.querySelector('rect').setAttribute('fill','rgba(86,199,255,0.28)'); setTimeout(function(){ch.g.querySelector('rect').setAttribute('fill','var(--surface-3)');},420);} bumpState(); }
    }
    requestAnimationFrame(frame);
  }
  function bumpState(){ stateVal.setAttribute('fill','#FFE08A'); setTimeout(function(){stateVal.setAttribute('fill',C.encap);},360); }
  function loop(){
    if(reduceMotion)return;
    run.cancel();
    run.add(function(){pulse(atm.cx,atm.cy,chips[0].x,chips[0].y+12,0);},0);
    run.add(function(){pulse(web.x,web.cy,chips[1].x,chips[1].y+12,1);},900);
    run.add(function(){pulse(atm.cx,atm.cy,chips[2].x,chips[2].y+12,2);},900);
    run.add(function(){},900);
    run.run(function(){loop();});
  }
  loop();
})();

(function objLab(){
  var methodsEl=byId('objMethods'),fieldsEl=byId('objFields'),logEl=byId('objLog');
  if(!methodsEl)return;
  var state={name:'Aria',hp:100,level:1};
  var methods=[
    {label:'takeDamage(30)',key:'hp',run:function(){var o=state.hp;state.hp=Math.max(0,state.hp-30);return 'hp '+o+' \u2192 '+state.hp;}},
    {label:'heal(20)',key:'hp',run:function(){var o=state.hp;state.hp=Math.min(100,state.hp+20);return 'hp '+o+' \u2192 '+state.hp;}},
    {label:'levelUp()',key:'level',run:function(){state.level++;state.hp=100;return 'level \u2192 '+state.level+', hp restored to 100';}}
  ];
  function field(k,v,bump){return '<div class="cap-field"><span class="fk">'+k+'</span><span class="fv'+(bump?' bump':'')+'">'+v+'</span></div>';}
  function renderFields(bumpKey){
    fieldsEl.innerHTML=field('name','"'+state.name+'"',false)+field('hp',state.hp,bumpKey==='hp')+field('level',state.level,bumpKey==='level');
    if(bumpKey){var f=fieldsEl.querySelector('.fv.bump');if(f)setTimeout(function(){f.classList.remove('bump');},600);}
  }
  var logs=[];
  function log(html){logs.unshift(html);if(logs.length>7)logs.pop();logEl.innerHTML=logs.map(function(l){return '<div>'+l+'</div>';}).join('');}
  methods.forEach(function(m){
    var b=el('button','cap-method','\u25B8 '+m.label);
    b.addEventListener('click',function(){
      b.classList.add('fire');setTimeout(function(){b.classList.remove('fire');},450);
      var r=m.run();renderFields(m.key);
      log('<span class="lg-msg">aria.'+m.label+'</span> <span class="lg-dim">&rarr;</span> <span class="lg-state">'+r+'</span>');
    });
    methodsEl.appendChild(b);
  });
  renderFields(null);
  logEl.innerHTML='<div class="lg-dim">// the only way to change state is to call a method</div>';
})();

(function encLab(){
  var badBal=byId('encBadBal'),badStatus=byId('encBadStatus'),badAcct=byId('encBadAcct'),badInput=byId('encBadInput'),badSet=byId('encBadSet'),badNote=byId('encBadNote');
  var goodBal=byId('encGoodBal'),goodStatus=byId('encGoodStatus'),goodAcct=byId('encGoodAcct'),goodInput=byId('encGoodInput'),depBtn=byId('encDeposit'),wdBtn=byId('encWithdraw'),goodNote=byId('encGoodNote'),foot=byId('encFoot');
  if(!badSet)return;
  var bad=100,good=100;
  function showBad(){
    badBal.textContent='$'+bad;
    if(bad<0){badAcct.classList.add('bad');badStatus.textContent='\u2715 invariant violated: balance < 0';badStatus.className='enc-status bad';}
    else{badAcct.classList.remove('bad');badStatus.textContent='\u2014 direct field access \u2014';badStatus.className='enc-status';}
  }
  badSet.addEventListener('click',function(){
    var v=parseInt(badInput.value,10);if(isNaN(v))return;
    bad=v;showBad();
    badNote.innerHTML=bad<0?'The field accepted <code class="tok">'+v+'</code> with no complaint. The object is in an impossible state \u2014 and nothing caught it.':'Anyone can assign straight to <code class="tok">acct.balance</code>. No rule can stop them.';
  });
  function showGood(){goodBal.textContent='$'+good;}
  function reject(msg,note){
    goodStatus.textContent=msg;goodStatus.className='enc-status bad';
    goodAcct.classList.remove('ok');goodAcct.classList.add('bad');
    goodNote.innerHTML=note;
    setTimeout(function(){goodAcct.classList.remove('bad');goodAcct.classList.add('ok');goodStatus.textContent='invariant holds';goodStatus.className='enc-status ok';},1200);
  }
  function accept(note){goodStatus.textContent='invariant holds';goodStatus.className='enc-status ok';goodNote.textContent=note;}
  depBtn.addEventListener('click',function(){
    var v=parseInt(goodInput.value,10);if(isNaN(v))return;
    if(v<=0){reject('rejected: must be positive','<code class="tok">deposit('+v+')</code> was refused \u2014 the method checked the rule before touching state.');return;}
    good+=v;showGood();accept('deposit('+v+') accepted. State changed only through the method.');
  });
  wdBtn.addEventListener('click',function(){
    var v=parseInt(goodInput.value,10);if(isNaN(v))return;
    if(v<=0){reject('rejected: must be positive','<code class="tok">withdraw('+v+')</code> needs a positive amount.');return;}
    if(v>good){reject('rejected: insufficient funds','<code class="tok">withdraw('+v+')</code> would overdraw the account, so it was refused.');return;}
    good-=v;showGood();accept('withdraw('+v+') accepted \u2014 and the balance never goes negative.');
  });
  showBad();showGood();
})();

(function ifaceLab(){
  var implsEl=byId('ifaceImpls'),runBtn=byId('ifaceRun'),logEl=byId('ifaceLog');
  if(!implsEl)return;
  function rid(){return Math.floor(1000+Math.random()*9000);}
  var impls=[
    {name:'CreditCard',d:'charges a card',steps:function(a){return 'authorize \u2192 charge \u2022\u20224291 \u2192 $'+a;}},
    {name:'PayPal',d:'redirect + confirm',steps:function(a){return 'redirect \u2192 confirm \u2192 capture $'+a;}},
    {name:'BankTransfer',d:'ACH debit',steps:function(a){return 'debit account \u2192 settle in 2 days ($'+a+')';}},
    {name:'GiftCard',d:'deduct balance',steps:function(a){return 'check balance \u2192 deduct $'+a;}}
  ];
  var sel=0;
  function render(){
    implsEl.innerHTML='';
    impls.forEach(function(im,i){
      var c=el('div','impl-card'+(i===sel?' on':''),'<div class="im-name">'+im.name+'</div><div class="im-d">'+im.d+'</div>');
      c.addEventListener('click',function(){sel=i;render();});
      implsEl.appendChild(c);
    });
  }
  var logs=[];
  function log(html){logs.unshift(html);if(logs.length>8)logs.pop();logEl.innerHTML=logs.map(function(l){return '<div>'+l+'</div>';}).join('');}
  runBtn.addEventListener('click',function(){
    var im=impls[sel];
    log('<span class="lg-msg">'+im.name+'.pay($60)</span> <span class="lg-dim">&rarr;</span> <span class="lg-state">'+im.steps(60)+'</span> <span class="lg-dim">\u2192 Receipt #'+rid()+'</span>');
  });
  render();
  logEl.innerHTML='<div class="lg-dim">// checkout() only knows PaymentMethod. Pick an implementation, then call pay().</div>';
})();

(function inhLab(){
  var chainEl=byId('inhChain'),foot=byId('inhFoot');
  if(!chainEl)return;
  var classes=[
    {disp:'class Puppy',base:'Puppy',methods:['speak']},
    {disp:'class Dog extends Animal',base:'Dog',methods:['speak','describe','fetch']},
    {disp:'class Animal',base:'Animal',methods:['breathe','describe']}
  ];
  function render(){
    chainEl.innerHTML='';
    classes.forEach(function(cl,i){
      var ms=cl.methods.map(function(m){return '<span class="chain-m has" data-m="'+m+'">'+m+'()</span>';}).join('');
      var box=el('div','chain-class','<div class="chain-ch">'+cl.disp+'</div><div class="chain-methods">'+ms+'</div>');
      chainEl.appendChild(box);
      if(i<classes.length-1){chainEl.appendChild(el('div','chain-arrow','<span class="ax">\u25B2</span><span>extends</span>'));}
    });
  }
  var run=new Runner();
  function resolve(method){
    run.cancel();
    var boxes=chainEl.querySelectorAll('.chain-class');
    boxes.forEach(function(b){b.classList.remove('lit','found');b.querySelectorAll('.chain-m').forEach(function(m){m.classList.remove('hit');});});
    var foundAt=-1;
    for(var k=0;k<classes.length;k++){if(classes[k].methods.indexOf(method)>=0){foundAt=k;break;}}
    var limit=foundAt===-1?classes.length-1:foundAt;
    for(var i=0;i<=limit;i++){(function(i){
      run.add(function(){
        boxes.forEach(function(b){b.classList.remove('lit');});
        if(i===foundAt){
          boxes[i].classList.add('found');
          var hit=boxes[i].querySelector('.chain-m[data-m="'+method+'"]');if(hit)hit.classList.add('hit');
          foot.innerHTML='<code class="tok">puppy.'+method+'()</code> resolved at <b style="color:var(--st-ok)">'+classes[i].base+'</b> after climbing '+i+' level'+(i===1?'':'s')+'. The first match wins.';
        } else {boxes[i].classList.add('lit');}
      },470);
    })(i);}
    if(foundAt===-1)run.add(function(){foot.innerHTML='<code class="tok">puppy.'+method+'()</code> \u2014 walked the whole chain and found <b style="color:var(--st-bad)">no such method</b> (a real runtime throws here).';},470);
    run.run();
  }
  render();
  [].forEach.call(document.querySelectorAll('#inhLab [data-im]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#inhLab [data-im]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');resolve(b.dataset.im);
    });
  });
  resolve('speak');
})();

(function polyLab(){
  var grid=byId('polyGrid'),msgEl=byId('polyMsg'),totalEl=byId('polyTotal'),foot=byId('polyFoot');
  if(!grid)return;
  function glyph(kind,color){
    var inner;
    if(kind==='circle')inner='<circle cx="8" cy="8" r="6" fill="none" stroke="'+color+'" stroke-width="1.6"/>';
    else if(kind==='square')inner='<rect x="2.5" y="2.5" width="11" height="11" rx="1.5" fill="none" stroke="'+color+'" stroke-width="1.6"/>';
    else if(kind==='rect')inner='<rect x="1" y="4" width="14" height="8" rx="1.5" fill="none" stroke="'+color+'" stroke-width="1.6"/>';
    else inner='<path d="M8 2 L14 13 L2 13 Z" fill="none" stroke="'+color+'" stroke-width="1.6" stroke-linejoin="round"/>';
    return '<svg class="poly-glyph" viewBox="0 0 16 16">'+inner+'</svg>';
  }
  var shapes=[
    {name:'Circle',kind:'circle',color:'#56C7FF',vals:{area:Math.PI*16,perimeter:2*Math.PI*4,name:'"Circle"'},impl:{area:'\u03C0 \u00B7 r\u00B2  (r=4)',perimeter:'2\u03C0 \u00B7 r',name:'return "Circle"'}},
    {name:'Square',kind:'square',color:'#4ED66B',vals:{area:25,perimeter:20,name:'"Square"'},impl:{area:'s\u00B2  (s=5)',perimeter:'4 \u00B7 s',name:'return "Square"'}},
    {name:'Rectangle',kind:'rect',color:'#A78BFA',vals:{area:18,perimeter:18,name:'"Rectangle"'},impl:{area:'w \u00B7 h  (6\u00D73)',perimeter:'2(w + h)',name:'return "Rectangle"'}},
    {name:'Triangle',kind:'tri',color:'#E8B341',vals:{area:6,perimeter:12,name:'"Triangle"'},impl:{area:'\u00BD \u00B7 b \u00B7 h  (3,4,5)',perimeter:'a + b + c',name:'return "Triangle"'}}
  ];
  var msg='area';
  function fmt(v){return typeof v==='number'?(Math.round(v*100)/100):v;}
  function render(){
    grid.innerHTML='';
    shapes.forEach(function(s,i){
      var card=el('div','poly-obj','<div class="poly-oh">'+glyph(s.kind,s.color)+s.name+'</div>'
        +'<div class="poly-impl"><span class="pi-k">'+msg+'()</span> { return '+s.impl[msg]+'; }</div>'
        +'<div class="poly-result" data-i="'+i+'">\u00B7</div>');
      grid.appendChild(card);
    });
  }
  var run=new Runner();
  function dispatch(){
    run.cancel();render();
    msgEl.textContent=msg+'()';
    var cards=grid.querySelectorAll('.poly-obj');
    var results=grid.querySelectorAll('.poly-result');
    var nums=[],names=[];
    shapes.forEach(function(s,i){(function(i){
      run.add(function(){
        cards.forEach(function(c){c.classList.remove('fire');});
        cards[i].classList.add('fire');
        var v=fmt(s.vals[msg]);results[i].textContent=v;
        if(typeof s.vals[msg]==='number')nums.push(s.vals[msg]);else names.push(s.vals[msg]);
      },360);
    })(i);});
    run.add(function(){
      cards.forEach(function(c){c.classList.remove('fire');});
      if(msg==='name'){totalEl.innerHTML='one loop \u2192 <b style="color:var(--poly)">'+shapes.length+' different names</b>, each shape answering for itself.';}
      else{var sum=nums.reduce(function(a,b){return a+b;},0);totalEl.innerHTML='total '+msg+' = <b style="color:var(--poly)">'+(Math.round(sum*100)/100)+'</b> \u2014 summed from four different implementations of one call.';}
    },420);
    run.run();
  }
  [].forEach.call(document.querySelectorAll('#polyLab [data-pm]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#polyLab [data-pm]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');msg=b.dataset.pm;dispatch();
    });
  });
  dispatch();
})();

(function compLab(){
  var chipsEl=byId('compChips'),resultEl=byId('compResult'),treeEl=byId('compTree');
  if(!chipsEl)return;
  var abilities=[
    {key:'walk',label:'Walk',method:'move()',verb:'walking',stem:'Walking'},
    {key:'fly',label:'Fly',method:'soar()',verb:'flying',stem:'Flying'},
    {key:'swim',label:'Swim',method:'dive()',verb:'swimming',stem:'Swimming'}
  ];
  var on={walk:true,fly:false,swim:false};
  function chosen(){return abilities.filter(function(a){return on[a.key];});}
  function renderChips(){
    chipsEl.innerHTML='';
    abilities.forEach(function(a){
      var b=el('button','chip-btn'+(on[a.key]?' on':''),a.label+' <span class="pr">'+a.method+'</span>');
      b.addEventListener('click',function(){on[a.key]=!on[a.key];renderChips();renderResult();renderTree();});
      chipsEl.appendChild(b);
    });
  }
  function renderResult(){
    var c=chosen();
    if(!c.length){resultEl.innerHTML='<div class="combo-empty">No parts mixed in yet \u2014 toggle an ability. The object is just its base self.</div>';return;}
    var caps=c.map(function(a){return '<span class="combo-cap">'+a.method+' <span style="opacity:.6">\u2192 "'+a.verb+'"</span></span>';}).join('');
    resultEl.innerHTML='<div class="crname">Kestrel <span style="font-size:12px;color:var(--ink-muted);font-weight:400">has-a:</span></div>'+caps
      +'<div style="font-family:var(--font-mono);font-size:11px;color:var(--compose);margin-top:11px">'+c.length+' independent part'+(c.length===1?'':'s')+' \u2014 any combination just works, no new class needed.</div>';
  }
  function subsets(arr){
    var res=[],n=arr.length;
    for(var mask=1;mask<(1<<n);mask++){var s=[];for(var i=0;i<n;i++)if(mask&(1<<i))s.push(arr[i]);res.push(s);}
    res.sort(function(a,b){return a.length-b.length||0;});
    return res;
  }
  function renderTree(){
    var c=chosen();
    if(!c.length){treeEl.innerHTML='<span class="combo-empty">No abilities \u2014 no classes needed yet.</span>';return;}
    var subs=subsets(c);
    var lines=subs.map(function(s){
      var nm=s.map(function(a){return a.stem;}).join('')+'Character';
      return '<div><span class="tb-cls">class '+nm+'</span>'+(s.length>1?' <span class="tb-warn">// a whole new class</span>':'')+'</div>';
    }).join('');
    treeEl.innerHTML=lines+'<div style="margin-top:11px;color:var(--st-warn)">'+subs.length+' class'+(subs.length===1?'':'es')+' for '+c.length+' abilit'+(c.length===1?'y':'ies')+' \u2014 doubles with each new one (2\u207F\u22121).</div>';
  }
  renderChips();renderResult();renderTree();
})();

(function coupLab(){
  var stage=byId('coupStage'),edgesSvg=byId('coupEdges'),foot=byId('coupFoot');
  if(!stage)return;
  var ids=['UI','Service','Repo','DB','Logger','Config'];
  var pos={
    UI:[0.16,0.28],Service:[0.5,0.28],Repo:[0.84,0.28],
    Logger:[0.16,0.76],DB:[0.5,0.76],Config:[0.84,0.76]
  };
  var edgeSets={
    loose:[['UI','Service'],['Service','Repo'],['Repo','DB'],['Service','Logger'],['Repo','Config']],
    tight:[['UI','Service'],['UI','Repo'],['UI','DB'],['Service','Repo'],['Service','DB'],['Service','Logger'],
           ['Service','Config'],['Repo','DB'],['Repo','Config'],['DB','Service'],['Logger','Service'],['Config','Repo'],['Config','Service']]
  };
  var mode='loose',nodeEls={},clicked=null;
  function build(){
    Object.keys(nodeEls).forEach(function(k){if(nodeEls[k].parentNode)nodeEls[k].remove();});
    nodeEls={};
    ids.forEach(function(id){
      var n=el('div','node box',id);
      n.style.zIndex=3;
      n.addEventListener('click',function(){clicked=id;paintRipple();});
      stage.appendChild(n);nodeEls[id]=n;
    });
    layout();
  }
  function layout(){
    var W=stage.clientWidth||620,H=stage.clientHeight||300;
    ids.forEach(function(id){var p=pos[id];nodeEls[id].style.left=(p[0]*W)+'px';nodeEls[id].style.top=(p[1]*H)+'px';});
    drawEdges();
  }
  function center(id){var p=pos[id],W=stage.clientWidth||620,H=stage.clientHeight||300;return [p[0]*W,p[1]*H];}
  function drawEdges(affected){
    clearSVG(edgesSvg);
    if(!edgesSvg.querySelector('#cAh')){}
    var defs=mk('defs',{});
    var m1=mk('marker',{id:'cArr',markerWidth:7,markerHeight:7,refX:9,refY:3,orient:'auto'});m1.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:C.faint}));defs.appendChild(m1);
    var m2=mk('marker',{id:'cArrB',markerWidth:7,markerHeight:7,refX:9,refY:3,orient:'auto'});m2.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:C.bad}));defs.appendChild(m2);
    edgesSvg.appendChild(defs);
    edgeSets[mode].forEach(function(e){
      var a=center(e[0]),b=center(e[1]);
      var hot=affected&&affected[e[0]]&&affected[e[1]];
      var dx=b[0]-a[0],dy=b[1]-a[1],L=Math.sqrt(dx*dx+dy*dy)||1,r=30;
      var ax=a[0]+dx/L*r,ay=a[1]+dy/L*r,bx=b[0]-dx/L*r,by=b[1]-dy/L*r;
      edgesSvg.appendChild(mk('line',{x1:ax,y1:ay,x2:bx,y2:by,stroke:hot?C.bad:C.lineFaint,'stroke-width':hot?2:1.4,'marker-end':hot?'url(#cArrB)':'url(#cArr)'}));
    });
  }
  function dependentsClosure(start){
    var affected={};affected[start]=true;
    var changed=true;
    while(changed){changed=false;
      edgeSets[mode].forEach(function(e){
        if(affected[e[1]]&&!affected[e[0]]){affected[e[0]]=true;changed=true;}
      });
    }
    return affected;
  }
  function paintRipple(){
    if(!clicked){return;}
    var aff=dependentsClosure(clicked);
    ids.forEach(function(id){
      var n=nodeEls[id];n.classList.remove('bad');n.style.borderColor='';n.style.background='';n.style.boxShadow='';
      if(id===clicked){n.style.borderColor=C.warn;n.style.background='rgba(242,151,60,.2)';n.style.boxShadow='0 0 16px rgba(242,151,60,.4)';}
      else if(aff[id]){n.classList.add('bad');}
    });
    drawEdges(aff);
    var count=0;ids.forEach(function(id){if(aff[id]&&id!==clicked)count++;});
    var total=ids.length-1;
    foot.innerHTML='Changing <b style="color:var(--st-warn)">'+clicked+'</b> forces <b style="color:var(--st-bad)">'+count+' of '+total+'</b> other module'+(count===1?'':'s')+' to change too. '
      +(mode==='tight'?'Tight coupling \u2014 the blast radius is the whole system.':'Loose coupling keeps the ripple small and local.');
  }
  function clearPaint(){
    clicked=null;
    ids.forEach(function(id){var n=nodeEls[id];if(n){n.classList.remove('bad');n.style.borderColor='';n.style.background='';n.style.boxShadow='';}});
    drawEdges();
    foot.innerHTML=mode==='tight'?'Tightly coupled: almost everything depends on everything. Click any module to see the ripple.':'Loosely coupled: dependencies are few and one-directional. Click a module to see how little it drags.';
  }
  [].forEach.call(document.querySelectorAll('#coupLab [data-cm]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('#coupLab [data-cm]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary');mode=b.dataset.cm;clearPaint();
    });
  });
  build();clearPaint();
  window.addEventListener('resize',function(){layout();if(clicked)paintRipple();});
})();

(function solidLab(){
  var rowEl=byId('solidRow'),detailEl=byId('solidDetail');
  if(!rowEl)return;
  var data=[
    {L:'S',mini:'SRP',name:'Single Responsibility',tag:'A class should have one reason to change.',
     body:'A class should do <b>one job</b>. Pile unrelated concerns into it and any one change risks the others \u2014 and the class becomes a magnet for merge conflicts.',
     violation:'An <code class="tok">Invoice</code> that calculates totals, renders HTML, <i>and</i> emails itself \u2014 three reasons to change living in one place.',
     fix:'Split into <code class="tok">Invoice</code> (totals), <code class="tok">InvoiceView</code> (rendering) and <code class="tok">Mailer</code> (sending). Each changes for exactly one reason.'},
    {L:'O',mini:'OCP',name:'Open / Closed',tag:'Open for extension, closed for modification.',
     body:'You should be able to add new behavior <b>without editing</b> existing, tested code \u2014 new cases are additive, not invasive.',
     violation:'A <code class="tok">pay()</code> with a <code class="tok">switch</code> on payment type. Every new method means editing and re-testing that one function.',
     fix:'Define a <code class="tok">PaymentMethod</code> interface; each type is its own class. Adding one touches no existing code (this is polymorphism at work).'},
    {L:'L',mini:'LSP',name:'Liskov Substitution',tag:'Subtypes must be usable through their base type without surprises.',
     body:'Anything written against a base type must keep working when handed any subtype. A subclass must not <b>weaken the contract</b> it inherits.',
     violation:'<code class="tok">Square extends Rectangle</code>, but <code class="tok">setWidth</code> also changes the height \u2014 code that sets them independently silently breaks.',
     fix:'Don\u2019t force a false is-a. Make <code class="tok">Shape</code> the abstraction and let <code class="tok">Square</code> and <code class="tok">Rectangle</code> be separate implementations.'},
    {L:'I',mini:'ISP',name:'Interface Segregation',tag:'No client should depend on methods it doesn\u2019t use.',
     body:'Prefer many small, <b>role-specific</b> interfaces over one fat one, so implementers aren\u2019t dragged into methods that don\u2019t apply to them.',
     violation:'A fat <code class="tok">Worker</code> interface with <code class="tok">work()</code> and <code class="tok">eat()</code> forces a <code class="tok">RobotWorker</code> to implement an <code class="tok">eat()</code> it has no use for.',
     fix:'Split into <code class="tok">Workable</code> and <code class="tok">Feedable</code>. Each class implements only the roles that genuinely apply to it.'},
    {L:'D',mini:'DIP',name:'Dependency Inversion',tag:'Depend on abstractions, not concretions.',
     body:'High-level policy shouldn\u2019t depend on low-level detail. Both should depend on an <b>interface</b> \u2014 and the detail gets injected in.',
     violation:'An <code class="tok">OrderService</code> that directly <code class="tok">new</code>s up a <code class="tok">MySQLDatabase</code> is welded to MySQL forever \u2014 and untestable.',
     fix:'Depend on a <code class="tok">Database</code> interface and inject the implementation. Swap MySQL for Postgres, or a mock in tests, with zero changes to the service.'}
  ];
  var sel=0;
  function renderRow(){
    rowEl.innerHTML='';
    data.forEach(function(d,i){
      var c=el('div','solid-card'+(i===sel?' on':''),'<div class="solid-letter">'+d.L+'</div><div class="sl-mini">'+d.mini+'</div>');
      c.addEventListener('click',function(){sel=i;renderRow();renderDetail();});
      rowEl.appendChild(c);
    });
  }
  function renderDetail(){
    var d=data[sel];
    detailEl.innerHTML='<div class="solid-detail"><div class="sd-name">'+d.name+'</div><div class="sd-tag">\u201C'+d.tag+'\u201D</div><div class="sd-body">'+d.body+'</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:12px">'
      +'<div style="flex:1 1 230px;border-left:3px solid var(--st-bad);padding:9px 13px;background:rgba(237,78,110,.06);border-radius:0 8px 8px 0"><div style="font-family:var(--font-mono);font-size:10px;letter-spacing:1px;color:var(--st-bad);margin-bottom:5px">\u2715 VIOLATION</div><div style="font-size:13.5px;color:var(--ink-soft);line-height:1.55">'+d.violation+'</div></div>'
      +'<div style="flex:1 1 230px;border-left:3px solid var(--st-ok);padding:9px 13px;background:rgba(78,214,107,.06);border-radius:0 8px 8px 0"><div style="font-family:var(--font-mono);font-size:10px;letter-spacing:1px;color:var(--st-ok);margin-bottom:5px">\u2713 FIX</div><div style="font-size:13.5px;color:var(--ink-soft);line-height:1.55">'+d.fix+'</div></div>'
      +'</div></div>';
  }
  renderRow();renderDetail();
})();

onScroll();
})();
