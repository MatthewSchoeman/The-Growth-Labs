(function(){
"use strict";
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function byId(id){return document.getElementById(id);}
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function el(tag,cls,html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
function clearSVG(s){while(s.firstChild)s.removeChild(s.firstChild);}
var C={coral:'#FB7185',plan:'#7C9CFF',design:'#A78BFA',build:'#56C7FF',test:'#4ED66B',review:'#FB7185',deploy:'#F2973C',operate:'#2DD4BF',iterate:'#E8B341',
       done:'#4ED66B',fail:'#ED4E6E',running:'#56C7FF',ink:'#E8ECF8',soft:'#B7C0D8',mut:'#7E88A4',faint:'#565F79',border:'rgba(140,160,205,0.26)'};
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
  var cx=430,cy=150,rx=290,ry=105;
  var phases=[['Plan',C.plan],['Design',C.design],['Build',C.build],['Test',C.test],['Review',C.review],['Deploy',C.deploy],['Operate',C.operate]];
  svg.appendChild(mk('ellipse',{cx:cx,cy:cy,rx:rx,ry:ry,fill:'none',stroke:'rgba(140,160,205,0.16)','stroke-width':1.4}));
  function pos(i){var th=(-90+i*(360/phases.length))*Math.PI/180;return {x:cx+rx*Math.cos(th),y:cy+ry*Math.sin(th),th:th};}
  for(var i=0;i<phases.length;i++){
    var thm=(-90+(i+0.5)*(360/phases.length))*Math.PI/180;
    var mx=cx+rx*Math.cos(thm),my=cy+ry*Math.sin(thm);
    var rot=(thm*180/Math.PI)+90;
    var ch=mk('path',{d:'M-4 -4 L4 0 L-4 4 Z',fill:'rgba(140,160,205,0.4)',transform:'translate('+mx+','+my+') rotate('+rot+')'});
    svg.appendChild(ch);
  }
  phases.forEach(function(p,i){
    var pt=pos(i),w=p[0].length*8+26;
    var g=mk('g',{});
    g.appendChild(mk('rect',{x:pt.x-w/2,y:pt.y-16,width:w,height:32,rx:16,fill:'rgba(10,14,26,0.92)',stroke:p[1],'stroke-width':1.5}));
    g.appendChild(svgText(pt.x,pt.y+5,p[0],p[1],13,'middle','700'));
    svg.appendChild(g);
  });
  svg.appendChild(svgText(cx,cy-4,'\u21bb',C.coral,30,'middle','700'));
  svg.appendChild(svgText(cx,cy+22,'iterate',C.mut,12,'middle','600'));
  var path='M'+(cx-rx)+' '+cy+' A'+rx+' '+ry+' 0 1 1 '+(cx+rx)+' '+cy+' A'+rx+' '+ry+' 0 1 1 '+(cx-rx)+' '+cy;
  if(!reduceMotion){
    var tok=mk('circle',{r:6,fill:C.coral});
    tok.appendChild(mk('animateMotion',{dur:'7s',repeatCount:'indefinite',path:path}));
    svg.appendChild(tok);
  } else { var pt0=pos(0); svg.appendChild(mk('circle',{cx:pt0.x,cy:pt0.y,r:6,fill:C.coral})); }
})();

(function waterfallLab(){
  var wEl=byId('wfWaterfall'),iEl=byId('wfIter'),vW=byId('wfVerdictW'),vI=byId('wfVerdictI'),foot=byId('wfFoot');
  if(!wEl)return;
  var phases=[['Requirements',C.plan],['Design',C.design],['Build',C.build],['Test',C.test],['Release',C.deploy]];
  var iters=['Iteration 1','Iteration 2','Iteration 3'];
  function render(changed){
    wEl.innerHTML='';
    phases.forEach(function(p,idx){
      var rework=changed&&idx>=1;
      var row=el('div','wf-phase'+(rework?' rework':''),(rework?'↻ ':'✓ ')+p[0]+(rework?'  — redo':''));
      row.style.borderLeftColor=p[1];
      wEl.appendChild(row);
    });
    iEl.innerHTML='';
    var list=changed?iters.concat(['Iteration 4 · the change']):iters;
    list.forEach(function(t,idx){
      var active=idx===list.length-1;
      iEl.appendChild(el('div','wf-iter'+(active?' active':''),(active?'▸ ':'')+t));
    });
    if(changed){
      vW.className='wf-verdict bad';vW.innerHTML='A late change ripples back through 4 finished phases — <b>weeks of rework</b>.';
      vI.className='wf-verdict good';vI.innerHTML='The change is just the next iteration\u2019s work — <b>a few days, no rework</b>.';
      foot.innerHTML='Same requirement change, two outcomes. Iterating, change is <b>expected input</b>; in Waterfall it\u2019s <b>expensive rework</b>.';
    } else {
      vW.className='wf-verdict';vW.style.borderColor='var(--border)';vW.style.background='transparent';vW.style.color='var(--ink-muted)';vW.innerHTML='All phases finished, once, in order.';
      vI.className='wf-verdict';vI.style.borderColor='var(--border)';vI.style.background='transparent';vI.style.color='var(--ink-muted)';vI.innerHTML='Working software after every short cycle.';
      foot.innerHTML='In Waterfall a late change ripples backward through finished phases. Iterating, the same change is just the next cycle\u2019s work.';
    }
  }
  byId('wfChange').addEventListener('click',function(){render(true);});
  byId('wfReset').addEventListener('click',function(){render(false);});
  render(false);
})();

(function storyLab(){
  var pick=byId('storyPick'),card=byId('storyCard'),acEl=byId('storyAC'),invEl=byId('storyInvest'),foot=byId('storyFoot');
  if(!pick)return;
  var roles=['Snip user','marketer','developer','team admin'];
  var goals=[
    {g:'create a custom alias',ac:['A user can enter a desired alias when shortening','The alias is rejected if it is already taken','The short link resolves to the original URL']},
    {g:'see click analytics',ac:['Each redirect increments a click count','The user can view total clicks per link','Counts update within one minute']},
    {g:'set a link to expire',ac:['A user can set an expiry date on a link','Requests after expiry return 404','Expired links are excluded from analytics']},
    {g:'bulk-shorten a list of URLs',ac:['A user can upload a list of URLs','Each URL receives its own short code','A summary reports successes and failures']}
  ];
  var reasons=['my links are memorable','I can measure a campaign','stale links stop resolving','I can migrate many at once'];
  var st={role:0,goal:0,reason:0};
  var invest=['Independent','Negotiable','Valuable','Estimable','Small','Testable'];
  function opts(arr,sel){return arr.map(function(v,i){return '<option value="'+i+'"'+(i===sel?' selected':'')+'>'+(v.g||v)+'</option>';}).join('');}
  function render(){
    pick.innerHTML='<span>As a</span><select id="stRole">'+opts(roles,st.role)+'</select>'+
      '<span>, I want to</span><select id="stGoal">'+opts(goals,st.goal)+'</select>'+
      '<span>, so that</span><select id="stReason">'+opts(reasons,st.reason)+'</select>';
    byId('stRole').addEventListener('change',function(){st.role=+this.value;render();});
    byId('stGoal').addEventListener('change',function(){st.goal=+this.value;render();});
    byId('stReason').addEventListener('change',function(){st.reason=+this.value;render();});
    card.innerHTML='<span class="sc-k">As a</span> '+roles[st.role]+', <span class="sc-k">I want to</span> '+goals[st.goal].g+', <span class="sc-k">so that</span> '+reasons[st.reason]+'.';
    acEl.innerHTML='';
    goals[st.goal].ac.forEach(function(a){acEl.appendChild(el('div','ac-item','<span class="ac-check">✓</span><span>'+a+'</span>'));});
    invEl.innerHTML='<span style="color:var(--ink-faint)">INVEST&nbsp;</span>'+invest.map(function(v){return '<span class="iv on">'+v+'</span>';}).join('');
    foot.innerHTML='<b>'+goals[st.goal].g+'</b> is small, valuable, and testable — its acceptance criteria make "done" objective.';
  }
  render();
})();

(function gitLab(){
  var svg=byId('gitSvg'),status=byId('gitStatus'),foot=byId('gitFoot');
  if(!svg)return;
  var mY=48,fY=112,step=0,maxStep=5;
  var steps=['<code style="color:var(--build)">main</code> has two commits.',
    'Branched <code style="color:var(--accent)">feature/custom-alias</code> off main — work happens in isolation.',
    'Commit: add <code class="tok">alias</code> to the request and endpoint.',
    'Commit: validation + a test for duplicate aliases.',
    'Opened a <b>pull request</b> → review (Module 06).',
    'Merged into <code style="color:var(--design)">main</code> — main moves ahead, branch deleted.'];
  function dot(x,y,color){svg.appendChild(mk('circle',{cx:x,cy:y,r:7,fill:color,stroke:'#0A0E1A','stroke-width':2}));}
  function line(x1,y1,x2,y2,color){svg.appendChild(mk('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:color,'stroke-width':2.5,'stroke-linecap':'round'}));}
  function curve(x1,y1,x2,y2,color){svg.appendChild(mk('path',{d:'M'+x1+' '+y1+' C '+((x1+x2)/2)+' '+y1+', '+((x1+x2)/2)+' '+y2+', '+x2+' '+y2,fill:'none',stroke:color,'stroke-width':2.5}));}
  function label(x,y,txt,color){svg.appendChild(svgText(x,y,txt,color,10.5,'middle','600'));}
  function render(){
    clearSVG(svg);
    var mainEnd=step>=5?400:150;
    line(40,mY,mainEnd,mY,C.build);
    dot(60,mY,C.build);dot(130,mY,C.build);
    label(430,mY-14,'main',C.build);
    if(step>=1){
      curve(130,mY,195,fY,C.coral);
      var fEnd=step>=3?285:(step>=2?215:200);
      line(195,fY,fEnd,fY,C.coral);
      label(240,fY+22,'feature/custom-alias',C.coral);
    }
    if(step>=2)dot(215,fY,C.coral);
    if(step>=3)dot(285,fY,C.coral);
    if(step>=4&&step<5){
      svg.appendChild(mk('rect',{x:315,y:fY-13,width:78,height:26,rx:13,fill:'rgba(86,199,255,.12)',stroke:C.build,'stroke-width':1.3}));
      svg.appendChild(svgText(354,fY+4,'PR OPEN',C.build,10,'middle','700'));
    }
    if(step>=5){
      curve(285,fY,360,mY,C.design);
      dot(360,mY,C.design);
      svg.appendChild(svgText(360,mY-14,'merge',C.design,10,'middle','600'));
    }
    status.innerHTML=steps[step];
    byId('gitStep').textContent=step>=maxStep?'✓ merged':'▸ next step';
  }
  byId('gitStep').addEventListener('click',function(){if(step<maxStep){step++;render();foot.innerHTML='Each commit is small and focused; the branch stays short-lived so the merge is clean.';}});
  byId('gitReset').addEventListener('click',function(){step=0;render();foot.innerHTML='Short-lived branches and small commits keep merges painless and main always shippable.';});
  render();
})();

(function reviewLab(){
  var diffEl=byId('prDiff'),comEl=byId('prComments'),badge=byId('prBadge'),status=byId('reviewStatus'),foot=byId('reviewFoot');
  if(!diffEl)return;
  diffEl.innerHTML=
    '<div class="diff-line ctx">  app.MapPost("/shorten", async (ShortenRequest req, ShortenerService svc) =></div>'+
    '<div class="diff-line del">- var link = await svc.ShortenAsync(new Uri(req.Url));</div>'+
    '<div class="diff-line add">+ var link = await svc.ShortenAsync(new Uri(req.Url), req.Alias);</div>'+
    '<div class="diff-line ctx">  return Results.Created($"/{link.Code}", new { shortUrl = ... });</div>';
  var comments=[
    {who:'reviewer',txt:'<code class="tok">req.Alias</code> can be empty or contain "/". Validate it before use.'},
    {who:'reviewer',txt:'Please add a test for the duplicate-alias case.'},
    {who:'author',txt:'Good catch — added validation and a test for duplicates. ✔'},
    {who:'reviewer',txt:'LGTM ✓ Nice work.'}
  ];
  var states=[
    {b:'open',t:'OPEN',s:'Pull request opened — awaiting review.',show:0},
    {b:'changes',t:'CHANGES REQUESTED',s:'Reviewer left two comments and requested changes.',show:2},
    {b:'changes',t:'CHANGES REQUESTED',s:'Author pushed fixes and replied — ready for another look.',show:3},
    {b:'approved',t:'APPROVED',s:'Reviewer approved the change.',show:4},
    {b:'merged',t:'MERGED',s:'Merged into main — CI will build it (Module 08).',show:4}
  ];
  var step=0,maxStep=4;
  var run=new Runner();
  function render(){
    run.cancel();
    var stt=states[step];
    badge.className='pr-state-badge '+stt.b;badge.textContent=stt.t;
    comEl.innerHTML='';
    for(var i=0;i<stt.show;i++){
      var c=comments[i];
      var d=el('div','review-comment','<span class="rc-who">'+c.who+'</span> — '+c.txt);
      comEl.appendChild(d);
    }
    var last=comEl.lastChild;
    [].forEach.call(comEl.children,function(ch,i){run.add(function(){ch.classList.add('show');},reduceMotion?0:90);});
    status.innerHTML=stt.s;
    byId('reviewStep').textContent=step>=maxStep?'✓ merged':'▸ next step';
    run.run();
  }
  byId('reviewStep').addEventListener('click',function(){if(step<maxStep){step++;render();foot.innerHTML='Feedback is specific and actionable; the author responds, and the change gets better before it merges.';}});
  byId('reviewReset').addEventListener('click',function(){step=0;render();foot.innerHTML='Review is a conversation, not a gate — specific, kind, and timely feedback improves both the code and the people.';});
  render();
})();

(function cicdLab(){
  var pipeEl=byId('cicdPipe'),verdict=byId('cicdVerdict'),foot=byId('cicdFoot');
  if(!pipeEl)return;
  var stages=['Build','Test','Lint','Deploy Staging','Deploy Prod'];
  var broken=false;
  function shell(){
    pipeEl.innerHTML='';
    stages.forEach(function(s,i){
      if(i>0)pipeEl.appendChild(el('div','pipe-conn'));
      pipeEl.appendChild(el('div','pipe-stage','<div class="ps-icon">'+(i+1)+'</div><div class="ps-name">'+s+'</div>'));
    });
    verdict.className='pipe-verdict';verdict.style.borderColor='var(--border)';verdict.style.background='transparent';verdict.style.color='var(--ink-muted)';
    verdict.textContent='Push to a branch to trigger the pipeline.';
  }
  function stageEls(){return [].slice.call(pipeEl.querySelectorAll('.pipe-stage'));}
  var run=new Runner();
  function doRun(){
    run.cancel();shell();
    var els=stageEls();
    var failAt=broken?1:-1;
    els.forEach(function(st,i){
      run.add(function(){
        if(failAt>=0&&i>failAt){st.className='pipe-stage blocked';return;}
        st.className='pipe-stage run';st.querySelector('.ps-icon').textContent='•';
      },reduceMotion?0:120);
      run.add(function(){
        if(failAt>=0&&i>failAt){return;}
        if(i===failAt){st.className='pipe-stage fail';st.querySelector('.ps-icon').textContent='✗';}
        else{st.className='pipe-stage pass';st.querySelector('.ps-icon').textContent='✓';}
      },reduceMotion?0:360);
    });
    run.add(function(){
      if(failAt>=0){verdict.className='pipe-verdict bad';verdict.innerHTML='✗ Failed at <b>Test</b> — deploy blocked, main protected. Fix and push again.';foot.innerHTML='The red stage <b>halts the pipeline</b>. Staging and production never see the broken change.';}
      else{verdict.className='pipe-verdict good';verdict.innerHTML='✓ All stages green — <b>Snip deployed to production</b>.';foot.innerHTML='Every stage passed, so the change flowed automatically all the way to production.';}
    },reduceMotion?0:200);
    run.run();
  }
  byId('cicdRun').addEventListener('click',doRun);
  byId('cicdBreak').addEventListener('click',function(){broken=!broken;this.classList.toggle('primary',broken);this.textContent=broken?'tests fixed':'make a test fail';doRun();});
  shell();
})();

(function deployLab(){
  var strats=byId('depStrats'),bar=byId('depBar'),split=byId('depSplit'),status=byId('depStatus'),foot=byId('depFoot');
  if(!strats)return;
  var strat='rolling',bad=false;
  var seq={
    rolling:{good:[[100,0],[70,30],[40,60],[10,90],[0,100]],bad:[[100,0],[70,30],[40,60]],blast:60},
    bluegreen:{good:[[100,0],[0,100]],bad:[[100,0],[0,100]],blast:100},
    canary:{good:[[100,0],[95,5],[0,100]],bad:[[100,0],[95,5]],blast:5}
  };
  [].forEach.call(strats.children,function(t){
    t.addEventListener('click',function(){[].forEach.call(strats.children,function(x){x.classList.remove('on');});t.classList.add('on');strat=t.dataset.strat;reset();});
  });
  function paint(o,n,badnew){
    bar.innerHTML='';
    if(o>0){var so=el('div','dep-seg old',o+'% v1');so.style.width=o+'%';bar.appendChild(so);}
    if(n>0){var sn=el('div','dep-seg '+(badnew?'newbad':'new'),n+'% v2');sn.style.width=n+'%';bar.appendChild(sn);}
    split.textContent='v1 '+o+'% · v2 '+n+'%';
  }
  function reset(){paint(100,0,false);status.style.borderColor='var(--border)';status.style.color='var(--ink-soft)';status.innerHTML='Ready to release v2 with the <b>'+strat+'</b> strategy.';}
  var run=new Runner();
  byId('depRun').addEventListener('click',function(){
    run.cancel();
    var s=seq[strat],frames=(bad?s.bad:s.good).slice();
    frames.forEach(function(f){run.add(function(){paint(f[0],f[1],bad);},reduceMotion?0:600);});
    if(bad)run.add(function(){paint(100,0,false);},reduceMotion?0:600);
    run.add(function(){
      if(bad){
        status.style.borderColor='rgba(237,78,110,.4)';status.style.color='var(--fail)';
        status.innerHTML='✗ v2 was broken — <b>'+strat+'</b> exposed ~<b>'+s.blast+'%</b> of users before rollback to v1.';
        foot.innerHTML=strat==='canary'?'Canary caught the failure at just 5% — the <b>smallest blast radius</b>, then auto-rolled back.':'A bigger slice saw the bug before rollback. Canary would have caught it at 5%.';
      } else {
        status.style.borderColor='rgba(78,214,107,.4)';status.style.color='var(--done)';
        status.innerHTML='✓ v2 fully rolled out via <b>'+strat+'</b> — no downtime.';
        foot.innerHTML='All traffic moved to v2 safely. Progressive strategies make this routine instead of risky.';
      }
    },reduceMotion?0:200);
    run.run();
  });
  byId('depBad').addEventListener('click',function(){bad=!bad;this.classList.toggle('primary',bad);this.textContent=bad?'v2 is healthy':'v2 is broken';reset();});
  reset();
})();

(function flowLab(){
  var colsEl=byId('flowCols'),status=byId('flowStatus'),foot=byId('flowFoot');
  if(!colsEl)return;
  var cols=['Backlog','In Dev','Review','CI/CD','Staging','Production'];
  var step=0;
  var notes=['Prioritized in the backlog as a user story (Module 03).',
    'Built on a feature branch with small commits (Module 05).',
    'Peer-reviewed in a pull request (Module 06).',
    'Pipeline builds and tests it green (Module 08).',
    'Verified in staging with end-to-end tests (Module 07).',
    'Released to production with a canary rollout (Module 09).',
    '↻ Monitored in prod — feedback becomes the next backlog item (Module 10 → 00).'];
  function render(){
    colsEl.innerHTML='';
    var here=step>=6?0:step;
    cols.forEach(function(c,i){
      var col=el('div','flow-col'+(i===here?' active':''),'<div class="fc-name">'+c+'</div>');
      var t=el('div','flow-ticket'+(i===here?' here':''),'custom<br>alias');
      col.appendChild(t);
      colsEl.appendChild(col);
    });
    status.className='flow-status';
    status.innerHTML=step>=6?'<span class="fs-loop">'+notes[6]+'</span>':notes[step];
    byId('flowStep').textContent=step>=6?'↻ start next iteration':'▸ advance feature';
  }
  byId('flowStep').addEventListener('click',function(){step=step>=6?0:step+1;render();foot.innerHTML=step>=6?'The loop closes: production feedback seeds the next story, and the wheel turns again.':'The feature moves one phase along the lifecycle — the same loop, every time.';});
  byId('flowReset').addEventListener('click',function(){step=0;render();foot.innerHTML='This is the lifecycle in motion. The frameworks below — Scrum, Kanban — are just different ways to organize this same flow.';});
  render();
})();

onScroll();
})();
