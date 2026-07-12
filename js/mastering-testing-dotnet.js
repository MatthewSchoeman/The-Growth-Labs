(function(){
"use strict";
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function byId(id){return document.getElementById(id);}
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
function clearSVG(s){while(s.firstChild)s.removeChild(s.firstChild);}
var C={test:'#A78BFA',assert:'#56C7FF',double:'#ED6E9E',isolate:'#5BD6C2',integration:'#F2973C',tdd:'#4ED66B',quality:'#E8B341',
       pass:'#4ED66B',fail:'#ED4E6E',ink:'#E8ECF8',soft:'#B7C0D8',mut:'#7E88A4',faint:'#565F79',
       line:'rgba(140,160,205,0.4)',surface:'#161E32',border:'rgba(140,160,205,0.26)'};
function svgText(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill||C.mut,'font-size':size||12,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];});}

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
  function node(cx,cy,label,sub,color){
    var g=mk('g',{});
    g.appendChild(mk('rect',{x:cx-66,y:cy-23,width:132,height:46,rx:11,fill:'rgba(0,0,0,0.15)',stroke:color,'stroke-width':1.5}));
    g.appendChild(svgText(cx,cy-2,label,color,14,'middle','700'));
    g.appendChild(svgText(cx,cy+13,sub,C.faint,9.5,'middle'));
    svg.appendChild(g);
  }
  function arrowMark(id,color){var m=mk('marker',{id:id,markerWidth:8,markerHeight:8,refX:5,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L5 3L0 6Z',fill:color}));svg.appendChild(m);}
  arrowMark('ha1',C.pass);arrowMark('ha2',C.assert);arrowMark('ha3',C.fail);
  svg.appendChild(mk('path',{d:'M278 92 Q350 78 422 92',fill:'none',stroke:C.pass,'stroke-width':1.5,'marker-end':'url(#ha1)'}));
  svg.appendChild(mk('path',{d:'M498 128 Q478 188 410 206',fill:'none',stroke:C.assert,'stroke-width':1.5,'marker-end':'url(#ha2)'}));
  svg.appendChild(mk('path',{d:'M288 206 Q218 188 202 130',fill:'none',stroke:C.fail,'stroke-width':1.5,'marker-end':'url(#ha3)'}));
  svg.appendChild(svgText(350,70,'make it pass',C.faint,9.5,'middle'));
  svg.appendChild(svgText(470,205,'clean up',C.faint,9.5,'middle'));
  svg.appendChild(svgText(205,205,'next test',C.faint,9.5,'middle'));
  node(210,108,'RED','write a failing test',C.fail);
  node(490,108,'GREEN','make it pass',C.pass);
  node(350,222,'REFACTOR','tidy, stay green',C.assert);
  var loop='M255 122 L445 122 L362 200 Z';
  if(!reduceMotion){
    var d=mk('circle',{r:5,fill:C.test});
    var am=mk('animateMotion',{dur:'4s',repeatCount:'indefinite',path:loop,rotate:'0'});
    d.appendChild(am);svg.appendChild(d);
  } else { svg.appendChild(mk('circle',{cx:255,cy:122,r:5,fill:C.test})); }
  var px=600,py=66,pw=232;
  svg.appendChild(mk('rect',{x:px,y:py,width:pw,height:168,rx:12,fill:'rgba(0,0,0,0.18)',stroke:C.border,'stroke-width':1}));
  svg.appendChild(svgText(px+16,py+24,'test suite',C.mut,11,'start'));
  var rows=['Discount_reduces','IsAdult_at_18','Checkout_sends','FizzBuzz_15','Api_returns_200'];
  var dots=[];
  rows.forEach(function(name,i){
    var ry=py+46+i*24;
    var dot=mk('circle',{cx:px+24,cy:ry,r:5,fill:'none',stroke:C.faint,'stroke-width':1.5});
    svg.appendChild(dot);dots.push(dot);
    svg.appendChild(svgText(px+40,ry+4,name,C.soft,11,'start'));
  });
  function green(i){dots[i].setAttribute('fill',C.pass);dots[i].setAttribute('stroke',C.pass);}
  if(!reduceMotion){
    var delay=600;
    dots.forEach(function(d,i){
      setTimeout(function(){d.setAttribute('fill',C.fail);d.setAttribute('stroke',C.fail);},delay+i*260);
      setTimeout(function(){green(i);},delay+i*260+170);
    });
  } else { dots.forEach(function(d,i){green(i);}); }
})();

(function aaaLab(){
  var codeEl=byId('aaaCode'),stepsEl=byId('aaaSteps'),foot=byId('aaaFoot');
  if(!codeEl)return;
  var blocks=[
    {k:'arrange',tag:'Arrange',html:'<span class="kw">var</span> cart = <span class="kw">new</span> <span class="t">Cart</span>(price: <span class="n">100</span>m);'},
    {k:'act',tag:'Act',html:'<span class="kw">var</span> total = cart.<span class="m">ApplyDiscount</span>(percent: <span class="n">20</span>);'},
    {k:'assert',tag:'Assert',html:'<span class="t">Assert</span>.<span class="m">Equal</span>(<span class="n">80</span>m, total);'}
  ];
  var foots={
    arrange:'<b style="color:var(--c-join)">Arrange</b> — create the inputs and the object under test. No assertions, no surprises; just set the stage.',
    act:'<b style="color:var(--assert)">Act</b> — perform the <i>one</i> action you\u2019re testing. A single call keeps it obvious what the assertion is about.',
    assert:'<b style="color:var(--pass)">Assert</b> — check the outcome. This is the line that decides pass or fail.',
    all:'Most tests follow this rhythm: arrange the inputs, act once, assert the outcome.'
  };
  function render(active){
    codeEl.innerHTML='';
    blocks.forEach(function(b){
      var on=active===b.k, dim=active&&active!=='all'&&!on;
      codeEl.appendChild(el('div','aaa-block '+b.k+(on?' on':'')+(dim?' dim':''),'<span class="aaa-tag" style="color:var(--'+(b.k==='arrange'?'c-join':b.k==='act'?'assert':'pass')+')">// '+b.tag+'</span>'+b.html));
    });
  }
  ['arrange','act','assert','all'].forEach(function(k){
    var b=el('button','ds-btn'+(k==='all'?' primary':''),k==='all'?'show all':k);
    b.addEventListener('click',function(){render(k);foot.innerHTML=foots[k];});
    stepsEl.appendChild(b);
  });
  render('all');
})();

(function assertLab(){
  var ctrls=byId('assertControls'),callEl=byId('assertCall'),resEl=byId('assertResult'),foot=byId('assertFoot');
  if(!ctrls)return;
  var st={type:'Equal',expected:'80',actual:'80',cond:'true',throws:'throws',needle:'Lamp',hay:'Lamp, Desk, Chair'};
  function controls(){
    var h='<span>Assert.</span><select id="asType">'+['Equal','True','Throws','Contains'].map(function(t){return '<option'+(st.type===t?' selected':'')+'>'+t+'</option>';}).join('')+'</select>';
    if(st.type==='Equal')h+='<span>expected</span><input id="asExp" value="'+st.expected+'" style="width:70px"><span>actual</span><input id="asAct" value="'+st.actual+'" style="width:70px">';
    else if(st.type==='True')h+='<span>condition is</span><select id="asCond"><option'+(st.cond==='true'?' selected':'')+'>true</option><option'+(st.cond==='false'?' selected':'')+'>false</option></select>';
    else if(st.type==='Throws')h+='<span>the code</span><select id="asThrow"><option value="throws"'+(st.throws==='throws'?' selected':'')+'>throws</option><option value="ok"'+(st.throws==='ok'?' selected':'')+'>returns normally</option></select>';
    else h+='<span>find</span><input id="asNeedle" value="'+st.needle+'" style="width:80px"><span>in</span><input id="asHay" value="'+st.hay+'" style="width:150px">';
    ctrls.innerHTML=h;wire();
  }
  function wire(){
    byId('asType').addEventListener('change',function(){st.type=this.value;controls();compute();});
    var b=function(id,p){var e=byId(id);if(e)e.addEventListener('input',function(){st[p]=this.value;compute();});e&&e.addEventListener('change',function(){st[p]=this.value;compute();});};
    b('asExp','expected');b('asAct','actual');b('asCond','cond');b('asThrow','throws');b('asNeedle','needle');b('asHay','hay');
  }
  function compute(){
    var pass,call,msg;
    if(st.type==='Equal'){pass=st.expected===st.actual;call='<span class="m">Assert.Equal</span>(<span class="n">'+esc(st.expected)+'</span>, <span class="n">'+esc(st.actual)+'</span>);';msg=pass?'passed — values are equal.':'Assert.Equal() Failure\n  Expected: '+st.expected+'\n  Actual:   '+st.actual;}
    else if(st.type==='True'){pass=st.cond==='true';call='<span class="m">Assert.True</span>(condition);  <span class="o">// condition = '+st.cond+'</span>';msg=pass?'passed — condition was true.':'Assert.True() Failure\n  Expected: True\n  Actual:   False';}
    else if(st.type==='Throws'){pass=st.throws==='throws';call='<span class="m">Assert.Throws</span>&lt;<span class="o">ArgumentException</span>&gt;(() => action());';msg=pass?'passed — the expected exception was thrown.':'Assert.Throws() Failure\n  Expected: ArgumentException\n  Actual:   (no exception thrown)';}
    else {pass=st.hay.indexOf(st.needle)>=0;call='<span class="m">Assert.Contains</span>(<span class="s">"'+esc(st.needle)+'"</span>, <span class="s">"'+esc(st.hay)+'"</span>);';msg=pass?'passed — the substring was found.':'Assert.Contains() Failure\n  Not found: '+st.needle+'\n  In value:  '+st.hay;}
    callEl.innerHTML=call;
    resEl.className='assert-result '+(pass?'pass':'fail');
    resEl.innerHTML=(pass?'✓ PASS':'✗ FAIL')+'<div class="ar-msg">'+esc(msg)+'</div>';
    foot.innerHTML=pass?'A passing assertion is silent — the test goes green and moves on.':'A failing assertion prints <b>expected vs actual</b>, so the cause is visible at a glance.';
  }
  controls();compute();
})();

(function theoryLab(){
  var headEl=byId('theoryHead'),casesEl=byId('theoryCases'),sumEl=byId('theorySummary'),foot=byId('theoryFoot');
  if(!headEl)return;
  var cases=[{age:10,exp:false},{age:17,exp:false},{age:18,exp:true},{age:25,exp:true},{age:100,exp:true}];
  var fixed=false;
  function impl(age){return fixed?age>=18:age>18;}
  headEl.innerHTML='<span class="attr">[Theory]</span>\n'+cases.map(function(c){return '<span class="attr">[InlineData('+c.age+', '+c.exp+')]</span>';}).join(' ')+'\n<span class="kw">public void</span> <span class="m">IsAdult_is_true_at_18_or_over</span>(<span class="kw">int</span> age, <span class="kw">bool</span> expected)\n    => <span class="t">Assert</span>.<span class="m">Equal</span>(expected, <span class="t">Person</span>.<span class="m">IsAdult</span>(age));';
  function renderCases(results){
    casesEl.innerHTML='';
    cases.forEach(function(c,i){
      var r=results?results[i]:null;
      var cls=r==null?'':(r.pass?'pass':'fail');
      var got=r==null?'':'<span class="tc-got" style="color:var(--'+(r.pass?'pass':'fail')+')">'+(r.pass?'✓ '+r.got:'✗ got '+r.got)+'</span>';
      casesEl.appendChild(el('div','theory-case '+(r?'ran ':'')+cls,'<span class="t-badge '+(r?(r.pass?'pass':'fail'):'pend')+'">'+(r?(r.pass?'PASS':'FAIL'):'·')+'</span><span class="tc-in">IsAdult('+c.age+')</span><span class="tc-exp">expected '+c.exp+'</span>'+got));
    });
  }
  var run=new Runner();
  function doRun(){
    run.cancel();renderCases(null);sumEl.innerHTML='';
    var results=cases.map(function(c){var got=impl(c.age);return {got:String(got),pass:got===c.exp};});
    cases.forEach(function(c,i){run.add(function(){var partial=results.slice(0,i+1);var padded=[];for(var j=0;j<cases.length;j++)padded[j]=j<=i?partial[j]:null;renderCases(padded);},reduceMotion?0:360);});
    run.add(function(){
      var p=results.filter(function(r){return r.pass;}).length,f=results.length-p;
      sumEl.innerHTML=f===0?'<b style="color:var(--pass)">'+p+' passed, 0 failed</b> — every boundary holds.':'<b style="color:var(--pass)">'+p+' passed</b>, <b style="color:var(--fail)">'+f+' failed</b> — the <b>age = 18</b> boundary caught an off-by-one ( <code class="tok">&gt;</code> should be <code class="tok">&gt;=</code> ).';
      foot.innerHTML=f===0?'All cases green. The fix (<code class="tok">&gt;=</code>) handles the boundary correctly.':'The typical ages all passed — only the <b>boundary</b> case exposed the bug. Press <b>fix the bug</b>.';
    },200);
    run.run();
  }
  byId('theoryRun').addEventListener('click',doRun);
  byId('theoryFix').addEventListener('click',function(){fixed=!fixed;this.classList.toggle('primary',fixed);this.textContent=fixed?'bug fixed (>=)':'fix the bug';doRun();});
  renderCases(null);
})();

(function mockLab(){
  var verifyEl=byId('mockVerify'),badge=byId('emailBadge'),foot=byId('mockFoot');
  if(!verifyEl)return;
  var inStock=true;
  [].forEach.call(document.querySelectorAll('#invToggle [data-inv]'),function(o){
    o.addEventListener('click',function(){[].forEach.call(document.querySelectorAll('#invToggle [data-inv]'),function(x){x.classList.remove('on');});o.classList.add('on');inStock=o.dataset.inv==='true';verifyEl.innerHTML='';badge.className='t-badge pend';badge.textContent='awaiting run';});
  });
  var run=new Runner();
  byId('mockRun').addEventListener('click',function(){
    run.cancel();verifyEl.innerHTML='';
    var lines=inStock?[
      ['Arrange — <span style="color:var(--double)">stub</span> inventory.InStock(sku) → <b>true</b>',''],
      ['Act — checkout.Place(order)',''],
      ['Assert — result == <b>Result.Placed</b>','ok'],
      ['Verify — <span style="color:var(--double)">mock</span> email.SendReceipt(order) called <b>1×</b>','ok']
    ]:[
      ['Arrange — <span style="color:var(--double)">stub</span> inventory.InStock(sku) → <b>false</b>',''],
      ['Act — checkout.Place(order)',''],
      ['Assert — result == <b>Result.OutOfStock</b>','ok'],
      ['Verify — <span style="color:var(--double)">mock</span> email.SendReceipt <b>never</b> called','ok']
    ];
    lines.forEach(function(ln,i){
      run.add(function(){
        verifyEl.appendChild(el('div','mock-verify-line'.replace('mock-verify-line','mv-line')+(ln[1]?' '+ln[1]:''),(ln[1]==='ok'?'✓ ':'· ')+ln[0]));
      },reduceMotion?0:300);
    });
    run.add(function(){
      badge.className='t-badge pass';
      badge.textContent=inStock?'called 1×':'called 0×';
      foot.innerHTML=inStock?'In stock: the unit returned <b>Placed</b> (state) and the receipt <b>was</b> sent (interaction) — both verified.':'Out of stock: the unit returned <b>OutOfStock</b> and the receipt was <b>not</b> sent — the mock verifies the call never happened.';
    },reduceMotion?0:320);
    run.run();
  });
})();

(function tddLab(){
  var cycleEl=byId('tddCycle'),testEl=byId('tddTest'),implEl=byId('tddImpl'),statusEl=byId('tddStatus'),countEl=byId('tddTestCount'),foot=byId('tddFoot');
  if(!testEl)return;
  var T1='<span class="t">Assert</span>.<span class="m">Equal</span>(<span class="s">"Fizz"</span>, <span class="m">FizzBuzz</span>(<span class="n">3</span>));';
  var T2='<span class="t">Assert</span>.<span class="m">Equal</span>(<span class="s">"Buzz"</span>, <span class="m">FizzBuzz</span>(<span class="n">5</span>));';
  var T3='<span class="t">Assert</span>.<span class="m">Equal</span>(<span class="s">"FizzBuzz"</span>, <span class="m">FizzBuzz</span>(<span class="n">15</span>));';
  var I0='<span class="cm">// not implemented yet</span>\n<span class="kw">throw new</span> <span class="t">NotImplementedException</span>();';
  var I1='<span class="kw">if</span> (n % <span class="n">3</span> == <span class="n">0</span>) <span class="kw">return</span> <span class="s">"Fizz"</span>;\n<span class="kw">return</span> n.<span class="m">ToString</span>();';
  var I2='<span class="kw">if</span> (n % <span class="n">3</span> == <span class="n">0</span>) <span class="kw">return</span> <span class="s">"Fizz"</span>;\n<span class="kw">if</span> (n % <span class="n">5</span> == <span class="n">0</span>) <span class="kw">return</span> <span class="s">"Buzz"</span>;\n<span class="kw">return</span> n.<span class="m">ToString</span>();';
  var I3='<span class="kw">if</span> (n % <span class="n">15</span> == <span class="n">0</span>) <span class="kw">return</span> <span class="s">"FizzBuzz"</span>;\n<span class="kw">if</span> (n % <span class="n">3</span> == <span class="n">0</span>) <span class="kw">return</span> <span class="s">"Fizz"</span>;\n<span class="kw">if</span> (n % <span class="n">5</span> == <span class="n">0</span>) <span class="kw">return</span> <span class="s">"Buzz"</span>;\n<span class="kw">return</span> n.<span class="m">ToString</span>();';
  var IR='<span class="kw">var</span> s = <span class="s">""</span>;\n<span class="kw">if</span> (n % <span class="n">3</span> == <span class="n">0</span>) s += <span class="s">"Fizz"</span>;\n<span class="kw">if</span> (n % <span class="n">5</span> == <span class="n">0</span>) s += <span class="s">"Buzz"</span>;\n<span class="kw">return</span> s == <span class="s">""</span> ? n.<span class="m">ToString</span>() : s;';
  var steps=[
    {phase:'red',tests:[[T1,false]],impl:I0,status:'<b>RED</b> · FizzBuzz(3) → expected "Fizz", but there\u2019s no code yet.'},
    {phase:'green',tests:[[T1,true]],impl:I1,status:'<b>GREEN</b> · the minimum code makes FizzBuzz(3) pass.'},
    {phase:'red',tests:[[T1,true],[T2,false]],impl:I1,status:'<b>RED</b> · new test: FizzBuzz(5) → expected "Buzz", got "5".'},
    {phase:'green',tests:[[T1,true],[T2,true]],impl:I2,status:'<b>GREEN</b> · add the Buzz rule — both pass.'},
    {phase:'red',tests:[[T1,true],[T2,true],[T3,false]],impl:I2,status:'<b>RED</b> · FizzBuzz(15) → expected "FizzBuzz", got "Fizz".'},
    {phase:'green',tests:[[T1,true],[T2,true],[T3,true]],impl:I3,status:'<b>GREEN</b> · handle 15 first — all three pass.'},
    {phase:'refactor',tests:[[T1,true],[T2,true],[T3,true]],impl:IR,status:'<b>REFACTOR</b> · build the string instead of special-casing 15 — tests stay green.'}
  ];
  var i=0;
  function render(){
    var s=steps[i];
    [].forEach.call(cycleEl.children,function(n){n.classList.remove('active');});
    cycleEl.querySelector('.'+s.phase).classList.add('active');
    testEl.innerHTML=s.tests.map(function(t){return '<span style="color:var(--'+(t[1]?'pass':'fail')+')">'+(t[1]?'✓':'✗')+'</span> '+t[0];}).join('\n');
    implEl.innerHTML=s.impl;
    var pass=s.tests.filter(function(t){return t[1];}).length;
    countEl.textContent=s.phase==='red'?(pass+' pass · 1 fail'):(pass+' passing');
    countEl.style.color=s.phase==='red'?C.fail:C.pass;
    statusEl.className='tdd-status '+(s.phase==='refactor'?'green':s.phase);
    statusEl.innerHTML=s.status;
    var btn=byId('tddStep');btn.textContent=i>=steps.length-1?'▸ cycle complete':'▸ next step';
  }
  byId('tddStep').addEventListener('click',function(){if(i<steps.length-1){i++;render();foot.innerHTML='RED writes a failing test; GREEN writes the minimal code to pass it; REFACTOR cleans up with the tests as a safety net.';}});
  byId('tddReset').addEventListener('click',function(){i=0;render();foot.innerHTML='Each step writes a failing test or the minimal code to pass it — the tests pull the implementation into existence.';});
  render();
})();

(function flakyLab(){
  var togEl=byId('flakyToggles'),runsEl=byId('flakyRuns'),verdictEl=byId('flakyVerdict'),foot=byId('flakyFoot');
  if(!togEl)return;
  var sources=[{k:'clock',label:'uses DateTime.Now'},{k:'random',label:'uses Random()'},{k:'state',label:'shares static state'}];
  var st={clock:true,random:false,state:false};
  function flaky(){return st.clock||st.random||st.state;}
  function build(){
    togEl.innerHTML='';
    sources.forEach(function(s){
      var b=el('div','flaky-tog'+(st[s.k]?' on':''),s.label);
      b.addEventListener('click',function(){st[s.k]=!st[s.k];b.classList.toggle('on',st[s.k]);reset();});
      togEl.appendChild(b);
    });
  }
  function reset(){
    runsEl.innerHTML='';for(var i=0;i<5;i++)runsEl.appendChild(el('div','run-dot','·'));
    verdictEl.innerHTML=flaky()?'Non-determinism present — run it a few times and watch the result wobble.':'Deterministic — no clock, no RNG, no shared state. Press run.';
  }
  var run=new Runner();
  byId('flakyRun').addEventListener('click',function(){
    run.cancel();reset();
    var dots=runsEl.children,results=[];
    for(var i=0;i<5;i++)results.push(flaky()?(Math.random()<0.5):true);
    for(var j=0;j<5;j++){(function(j){run.add(function(){var ok=results[j];dots[j].className='run-dot '+(ok?'pass':'fail');dots[j].textContent=ok?'✓':'✗';},reduceMotion?0:240);})(j);}
    run.add(function(){
      var p=results.filter(Boolean).length;
      if(flaky())verdictEl.innerHTML='<b style="color:var(--fail)">Flaky:</b> '+p+'/5 passed — same code, different result. You can\u2019t trust this red.';
      else verdictEl.innerHTML='<b style="color:var(--pass)">Deterministic:</b> 5/5 passed — and it will pass every single run.';
      foot.innerHTML=flaky()?'Each toggle is a source of non-determinism. Turn them all off (inject a clock, seed the RNG, isolate state) to make it reliable.':'No sources of non-determinism left — the test is now trustworthy.';
    },reduceMotion?0:260);
    run.run();
  });
  build();reset();
})();

(function pyramidLab(){
  var stackEl=byId('pyrStack'),metaEl=byId('pyrMeta'),foot=byId('pyrFoot');
  if(!stackEl)return;
  var tiers=[{k:'e2e',name:'E2E',color:C.integration},{k:'int',name:'Integration',color:C.assert},{k:'unit',name:'Unit',color:C.tdd}];
  var shapes={
    healthy:{e2e:{w:34,c:8},int:{w:64,c:55},unit:{w:100,c:520},tests:583,runtime:'~14s',feed:'seconds — precise',good:true},
    inverted:{e2e:{w:100,c:180},int:{w:64,c:70},unit:{w:34,c:28},tests:278,runtime:'~17 min',feed:'minutes — vague',good:false}
  };
  function render(shapeKey){
    var s=shapes[shapeKey];
    stackEl.innerHTML='';
    tiers.forEach(function(t){
      var seg=s[t.k];
      var bar=el('div','pyr-tier','<span>'+t.name+'</span> <span class="pt-count">'+seg.c+' tests</span>');
      bar.style.width=seg.w+'%';bar.style.background=t.color;
      stackEl.appendChild(bar);
    });
    metaEl.innerHTML='<div class="pm-k">total tests</div><div class="pm-v">'+s.tests+'</div>'+
      '<div class="pm-k">suite runtime</div><div class="pm-v '+(s.good?'good':'bad')+'">'+s.runtime+'</div>'+
      '<div class="pm-k">feedback</div><div style="color:var(--'+(s.good?'pass':'fail')+')">'+s.feed+'</div>';
    foot.innerHTML=s.good?'Wide base of fast unit tests → quick, precise feedback. Slow tests stay rare.':'Top-heavy with slow end-to-end tests → minutes per run, flaky, and failures that don\u2019t pinpoint the cause.';
  }
  byId('pyrHealthy').addEventListener('click',function(){this.classList.add('primary');byId('pyrInverted').classList.remove('primary');render('healthy');});
  byId('pyrInverted').addEventListener('click',function(){this.classList.add('primary');byId('pyrHealthy').classList.remove('primary');render('inverted');});
  render('healthy');
})();

onScroll();
})();
