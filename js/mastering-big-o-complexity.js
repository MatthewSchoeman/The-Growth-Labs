(function(){
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var nav = document.getElementById('nav');
  var scrim = document.getElementById('scrim');
  var menuBtn = document.getElementById('menuBtn');
  function openNav(){ nav.classList.add('open'); scrim.classList.add('show'); }
  function closeNav(){ nav.classList.remove('open'); scrim.classList.remove('show'); }
  if(menuBtn) menuBtn.addEventListener('click', openNav);
  if(scrim) scrim.addEventListener('click', closeNav);
  nav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeNav); });

  var progress = document.getElementById('progress');
  function onScroll(){
    var h = document.documentElement;
    var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = Math.max(0, Math.min(1, scrolled)) * 100 + '%';
    highlightNav();
  }
  window.addEventListener('scroll', onScroll, {passive:true});

  var sections = Array.prototype.slice.call(document.querySelectorAll('.module-sec'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a.module'));
  function highlightNav(){
    var pos = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function(s){ if(s.offsetTop <= pos) current = s; });
    var id = current ? current.id : null;
    navLinks.forEach(function(l){
      l.classList.toggle('active', l.getAttribute('href') === '#' + id);
    });
  }

  var CLASSES = [
    { key:'const',  label:'O(1)',        color:'var(--c-const)',  hex:'#2DD4A7', f:function(n){ return 1; } },
    { key:'log',    label:'O(log n)',    color:'var(--c-log)',    hex:'#4ED66B', f:function(n){ return Math.log2(Math.max(n,1)) || 0; } },
    { key:'lin',    label:'O(n)',        color:'var(--c-lin)',    hex:'#E8C53D', f:function(n){ return n; } },
    { key:'linlog', label:'O(n log n)',  color:'var(--c-linlog)', hex:'#F2973C', f:function(n){ return n * (Math.log2(Math.max(n,1)) || 0); } },
    { key:'quad',   label:'O(n²)',       color:'var(--c-quad)',   hex:'#F0603C', f:function(n){ return n*n; } },
    { key:'exp',    label:'O(2ⁿ)',       color:'var(--c-exp)',    hex:'#ED4E6E', f:function(n){ return Math.pow(2,n); } }
  ];
  var SUP = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
  function toSup(s){ return String(s).split('').map(function(c){ return SUP[c]||c; }).join(''); }
  function fmt(v){
    if(!isFinite(v)) return '∞';
    if(v < 1000) {
      var r = Math.round(v);
      return r.toLocaleString('en-US');
    }
    if(v < 1e6) return Math.round(v).toLocaleString('en-US');
    var exp = Math.floor(Math.log10(v));
    var mant = v / Math.pow(10, exp);
    return (mant.toFixed(1)) + ' × 10' + toSup(exp);
  }
  (function heroPlot(){
    var svg = document.getElementById('heroSvg');
    if(!svg) return;
    var W = 760, H = 300, padL = 46, padR = 20, padT = 22, padB = 36;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var NS = 'http://www.w3.org/2000/svg';
    var nMax = 28;
    var globalMax = CLASSES[CLASSES.length-1].f(nMax);
    function el(name, attrs){ var e = document.createElementNS(NS,name); for(var k in attrs) e.setAttribute(k, attrs[k]); return e; }
    var g = el('g',{});
    for(var i=0;i<=5;i++){
      var y = padT + plotH*(i/5);
      g.appendChild(el('line',{x1:padL,y1:y,x2:W-padR,y2:y,stroke:'rgba(140,160,205,0.10)','stroke-width':1}));
    }
    for(var j=0;j<=6;j++){
      var x = padL + plotW*(j/6);
      g.appendChild(el('line',{x1:x,y1:padT,x2:x,y2:padT+plotH,stroke:'rgba(140,160,205,0.06)','stroke-width':1}));
    }
    svg.appendChild(g);
    svg.appendChild(el('line',{x1:padL,y1:padT,x2:padL,y2:padT+plotH,stroke:'rgba(140,160,205,0.4)','stroke-width':1.4}));
    svg.appendChild(el('line',{x1:padL,y1:padT+plotH,x2:W-padR,y2:padT+plotH,stroke:'rgba(140,160,205,0.4)','stroke-width':1.4}));
    var yl = el('text',{x:14,y:padT+plotH/2,fill:'#7E88A4','font-size':11,'font-family':'IBM Plex Mono, monospace','transform':'rotate(-90 14 '+(padT+plotH/2)+')','text-anchor':'middle'});
    yl.textContent='operations'; svg.appendChild(yl);
    function yScale(v){
      var t = Math.log10(v+1) / Math.log10(globalMax+1);
      return padT + plotH*(1-t);
    }
    function xScale(n){ return padL + plotW*(n/nMax); }
    var legendParts = [];
    CLASSES.forEach(function(c, idx){
      var d = '';
      for(var n=0;n<=nMax;n+=0.5){
        var X = xScale(n), Y = yScale(c.f(n));
        d += (n===0?'M':'L') + X.toFixed(1) + ' ' + Y.toFixed(1) + ' ';
      }
      var path = el('path',{d:d,fill:'none',stroke:c.hex,'stroke-width':2.4,'stroke-linecap':'round','stroke-linejoin':'round'});
      path.style.filter = 'drop-shadow(0 0 5px '+c.hex+'55)';
      if(!reduceMotion){
        var len = path.getTotalLength ? 0 : 0;
        svg.appendChild(path);
        try{
          var L = path.getTotalLength();
          path.style.strokeDasharray = L;
          path.style.strokeDashoffset = L;
          path.style.transition = 'stroke-dashoffset 1.1s ease ' + (idx*0.12) + 's';
          requestAnimationFrame(function(){ requestAnimationFrame(function(){ path.style.strokeDashoffset = '0'; }); });
        }catch(e){ path.style.strokeDashoffset='0'; }
      } else {
        svg.appendChild(path);
      }
      var lx = xScale(nMax), ly = yScale(c.f(nMax));
      ly = Math.max(padT+8, Math.min(padT+plotH-2, ly));
      var t = el('text',{x:Math.min(lx+4, W-padR+2),y:ly+3,fill:c.hex,'font-size':10.5,'font-family':'IBM Plex Mono, monospace','text-anchor':'end'});
      legendParts.push('<span style="color:'+c.hex+'">●</span> '+c.label.replace('²','²').replace('ⁿ','ⁿ'));
    });
    var leg = document.getElementById('heroLegend');
    if(leg) leg.innerHTML = legendParts.join('&nbsp;&nbsp;');
  })();

  (function recursionTree(){
    var svg = document.getElementById('treeSvg');
    if(!svg) return;
    var NS='http://www.w3.org/2000/svg';
    function el(name, attrs){ var e=document.createElementNS(NS,name); for(var k in attrs) e.setAttribute(k,attrs[k]); return e; }
    var W=660, H=326;
    var rightGutter = 132;
    var treeW = W - rightGutter;
    var levels = [
      {boxes:1, label:'n',   sub:'1 × n = n'},
      {boxes:2, label:'n/2', sub:'2 × n/2 = n'},
      {boxes:4, label:'n/4', sub:'4 × n/4 = n'},
      {boxes:8, label:'n/8', sub:'8 × n/8 = n'}
    ];
    var topY=30, gapY=68, boxH=26;
    function slot(count){ return treeW/count; }
    levels.forEach(function(lv, li){
      if(li >= levels.length-1) return;
      var y = topY + li*gapY;
      var sw = slot(lv.boxes), nsw = slot(levels[li+1].boxes);
      for(var i=0;i<lv.boxes;i++){
        var cx = sw*(i+0.5);
        for(var c=0;c<2;c++){
          var childIndex = i*2 + c;
          if(childIndex < levels[li+1].boxes){
            var ccx = nsw*(childIndex+0.5);
            svg.appendChild(el('line',{x1:cx,y1:y+boxH,x2:ccx,y2:y+gapY,stroke:'rgba(140,160,205,0.26)','stroke-width':1.2}));
          }
        }
      }
    });
    levels.forEach(function(lv, li){
      var y = topY + li*gapY;
      var sw = slot(lv.boxes);
      for(var k=0;k<lv.boxes;k++){
        var cx = sw*(k+0.5);
        var bw = Math.max(Math.min(sw-14, 116), 26);
        svg.appendChild(el('rect',{x:cx-bw/2,y:y,width:bw,height:boxH,rx:6,fill:'rgba(86,199,255,0.10)',stroke:'rgba(86,199,255,0.5)','stroke-width':1.2}));
        if(bw>=30){
          var t=el('text',{x:cx,y:y+boxH/2+4,fill:'#E8ECF8','font-size':11,'font-family':'IBM Plex Mono, monospace','text-anchor':'middle'});
          t.textContent=lv.label; svg.appendChild(t);
        }
      }
      var rt = el('text',{x:W-6,y:y+boxH/2+4,fill:'#F2973C','font-size':11.5,'font-family':'IBM Plex Mono, monospace','text-anchor':'end'});
      rt.textContent = lv.sub;
      svg.appendChild(rt);
    });
    var sy = topY + (levels.length-1)*gapY + boxH + 22;
    svg.appendChild(el('line',{x1:8,y1:sy-14,x2:W-8,y2:sy-14,stroke:'rgba(140,160,205,0.14)','stroke-width':1}));
    var sum = el('text',{x:W/2,y:sy+4,fill:'#4ED66B','font-size':13,'font-family':'IBM Plex Mono, monospace','text-anchor':'middle','font-weight':'600'});
    sum.textContent='log₂ n levels  ×  n per level  =  Θ(n log n)';
    svg.appendChild(sum);
  })();
  (function plotter(){
    var svg = document.getElementById('plotSvg');
    var slider = document.getElementById('nSlider');
    var nValEl = document.getElementById('nVal');
    var readout = document.getElementById('readout');
    var scaleToggle = document.getElementById('scaleToggle');
    var foot = document.getElementById('plotFoot');
    if(!svg || !slider) return;
    var NS='http://www.w3.org/2000/svg';
    function el(name, attrs){ var e=document.createElementNS(NS,name); for(var k in attrs) e.setAttribute(k,attrs[k]); return e; }
    var W=460, H=360, padL=44, padR=16, padT=18, padB=34;
    var plotW=W-padL-padR, plotH=H-padT-padB;
    var nMax = 64;
    var scale = 'linear';
    var enabled = {}; CLASSES.forEach(function(c){ enabled[c.key]=true; });
    CLASSES.forEach(function(c){
      var row = document.createElement('div');
      row.className='ro-row'; row.setAttribute('data-key',c.key);
      row.innerHTML = '<span class="ro-dot" style="background:'+c.color+'"></span>'+
                      '<span class="ro-name">'+c.label+'</span>'+
                      '<span class="ro-val" data-val="'+c.key+'">—</span>';
      row.addEventListener('click', function(){
        enabled[c.key] = !enabled[c.key];
        row.classList.toggle('off', !enabled[c.key]);
        render();
      });
      readout.appendChild(row);
    });
    function curveMaxAt(n){
      var m = 1;
      CLASSES.forEach(function(c){
        if(enabled[c.key]) m = Math.max(m, c.f(n));
      });
      return m;
    }
    function render(){
      var n = parseInt(slider.value,10);
      nValEl.textContent = n;
      while(svg.firstChild) svg.removeChild(svg.firstChild);
      var domainMax = nMax;
      var yMax = curveMaxAt(domainMax);
      function xScale(v){ return padL + plotW*(v/domainMax); }
      function yScale(v){
        if(scale==='log'){
          var t = Math.log10(v+1)/Math.log10(yMax+1);
          return padT + plotH*(1-t);
        }
        var tt = v/yMax;
        if(tt>1) tt=1;
        return padT + plotH*(1-tt);
      }
      for(var i=0;i<=5;i++){
        var gy = padT + plotH*(i/5);
        svg.appendChild(el('line',{x1:padL,y1:gy,x2:W-padR,y2:gy,stroke:'rgba(140,160,205,0.09)','stroke-width':1}));
      }
      for(var j=0;j<=8;j++){
        var gx = padL + plotW*(j/8);
        svg.appendChild(el('line',{x1:gx,y1:padT,x2:gx,y2:padT+plotH,stroke:'rgba(140,160,205,0.05)','stroke-width':1}));
      }
      svg.appendChild(el('line',{x1:padL,y1:padT,x2:padL,y2:padT+plotH,stroke:'rgba(140,160,205,0.45)','stroke-width':1.3}));
      svg.appendChild(el('line',{x1:padL,y1:padT+plotH,x2:W-padR,y2:padT+plotH,stroke:'rgba(140,160,205,0.45)','stroke-width':1.3}));
      var xlab = el('text',{x:padL+plotW/2,y:H-6,fill:'#7E88A4','font-size':10.5,'font-family':'IBM Plex Mono, monospace','text-anchor':'middle'});
      xlab.textContent='n  (0 → '+nMax+')'; svg.appendChild(xlab);
      var ylab = el('text',{x:12,y:padT+plotH/2,fill:'#7E88A4','font-size':10.5,'font-family':'IBM Plex Mono, monospace','text-anchor':'middle','transform':'rotate(-90 12 '+(padT+plotH/2)+')'});
      ylab.textContent = scale==='log' ? 'operations (log)' : 'operations'; svg.appendChild(ylab);
      var cx = xScale(n);
      svg.appendChild(el('line',{x1:cx,y1:padT,x2:cx,y2:padT+plotH,stroke:'rgba(86,199,255,0.5)','stroke-width':1.2,'stroke-dasharray':'4 4'}));
      var cl = el('text',{x:cx,y:padT-4,fill:'#56C7FF','font-size':10,'font-family':'IBM Plex Mono, monospace','text-anchor':'middle'});
      cl.textContent='n='+n; svg.appendChild(cl);
      CLASSES.forEach(function(c){
        if(!enabled[c.key]) return;
        var d='';
        var step = domainMax/180;
        for(var x=0;x<=domainMax;x+=step){
          var X=xScale(x), Y=yScale(c.f(x));
          if(Y < padT-2) Y = padT-2;
          d += (x===0?'M':'L')+X.toFixed(1)+' '+Y.toFixed(1)+' ';
        }
        var p = el('path',{d:d,fill:'none',stroke:c.hex,'stroke-width':2.2,'stroke-linecap':'round','stroke-linejoin':'round'});
        p.style.filter='drop-shadow(0 0 4px '+c.hex+'44)';
        svg.appendChild(p);
        var my = yScale(c.f(n));
        if(my>=padT-2 && my<=padT+plotH+2){
          svg.appendChild(el('circle',{cx:cx,cy:my,r:3.4,fill:c.hex,stroke:'#0A0E1A','stroke-width':1.4}));
        }
      });
      CLASSES.forEach(function(c){
        var valEl = readout.querySelector('[data-val="'+c.key+'"]');
        if(valEl) valEl.textContent = fmt(c.f(n));
      });
      var quad = CLASSES.find(function(c){return c.key==='quad';}).f(n);
      var log = CLASSES.find(function(c){return c.key==='log';}).f(n);
      var ratio = quad/Math.max(log,1);
      foot.textContent = 'at n = '+n+' · O(n²) needs ~'+fmt(quad)+' ops while O(log n) needs ~'+fmt(log)+' — a '+fmt(ratio)+'× gap';
    }
    slider.addEventListener('input', render);
    scaleToggle.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return;
      scale = b.getAttribute('data-scale');
      scaleToggle.querySelectorAll('button').forEach(function(x){ x.classList.toggle('on', x===b); });
      render();
    });

    render();
  })();
  onScroll();
})();