(function(){
"use strict";
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function byId(id){return document.getElementById(id);}
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function svgText(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill,'font-size':size||10,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function onScroll(){}

(function hero(){
  var svg=byId('heroSvg');if(!svg)return;
  var CY='#56C7FF',VI='#A78BFA',GO='#F0B429',CO='#FB7185',PE='#7C9CFF',TE='#2DD4BF',MA='#ED6E9E',OR='#C74FE6',IN='#6366F1',IR='#7A5CF5',TB='#3B82F6',EM='#10B981';
  var pieces=[
    ['Big O',CY],['Data Structures',CY],['Patterns',CY],['SQL',CY],['OOP',CY],['Bits',CY],
    ['C#',VI],['ASP.NET',VI],['EF Core',VI],['Testing',VI],
    ['Snip ★',GO],['Front End',TE],['SDLC ↻',CO],['SQL+',PE],['Angular',MA],['Internals',OR],['Adv C#',IN],['Vol II',IR],['TS',TB],['Dist',EM]
  ];
  var pts=pieces.map(function(_,i){
    return {x:34+i*41, y:252 - i*10.3 + Math.sin(i*1.05)*5.8};
  });
  var defs=mk('defs',{});
  var lg=mk('linearGradient',{id:'gl',x1:'0',y1:'0',x2:'1',y2:'0'});
  [['0%',CY],['42%',CY],['52%',VI],['74%',VI],['82%',GO],['90%',CO],['100%',PE]].forEach(function(s){
    lg.appendChild(mk('stop',{offset:s[0],'stop-color':s[1]}));
  });
  defs.appendChild(lg);svg.appendChild(defs);
  var d='M'+pts.map(function(p){return p.x+' '+p.y;}).join(' L');
  svg.appendChild(mk('path',{d:d+' L'+pts[19].x+' 272 L'+pts[0].x+' 272 Z',fill:'url(#gl)',opacity:'0.06'}));
  svg.appendChild(mk('path',{d:d,fill:'none',stroke:'url(#gl)','stroke-width':2,'stroke-linejoin':'round',opacity:'0.85'}));
  pieces.forEach(function(pc,i){
    var p=pts[i],big=(i===10);
    svg.appendChild(mk('circle',{cx:p.x,cy:p.y,r:big?11:8.5,fill:pc[1],opacity:'0.14'}));
    svg.appendChild(mk('circle',{cx:p.x,cy:p.y,r:big?6:4.6,fill:pc[1],stroke:'#0A0E1A','stroke-width':1.6}));
    var above=i%2===0;
    svg.appendChild(svgText(p.x,above?p.y-15:p.y+24,pc[0],pc[1],9.5,'middle','600'));
  });
  var legend=[['fundamentals',CY],['C# track',VI],['capstone',GO],['interface',TE],['lifecycle',CO],['sequels',PE]];
  legend.forEach(function(lg2,i){
    var x=42+i*136;
    svg.appendChild(mk('rect',{x:x,y:286,width:9,height:9,rx:3,fill:lg2[1]}));
    svg.appendChild(svgText(x+15,294,lg2[0],'#7E88A4',9.5,'start'));
  });
  if(!reduceMotion){
    var dot=mk('circle',{r:5.5,fill:'#E8ECF8',stroke:'#0A0E1A','stroke-width':1.5});
    dot.appendChild(mk('animateMotion',{dur:'10s',repeatCount:'indefinite',path:d}));
    svg.appendChild(dot);
  } else {
    svg.appendChild(mk('circle',{cx:pts[19].x,cy:pts[19].y,r:5.5,fill:'#E8ECF8',stroke:'#0A0E1A','stroke-width':1.5}));
  }
})();

(function reveal(){
  var els=[].slice.call(document.querySelectorAll('.rv'));
  if(reduceMotion||!('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('in');});
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        var sibs=[].slice.call(en.target.parentNode.children).filter(function(c){return c.classList&&c.classList.contains('rv');});
        var idx=sibs.indexOf(en.target);
        en.target.style.transitionDelay=(Math.max(0,idx)%6*55)+'ms';
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  },{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e){io.observe(e);});
})();

onScroll();
})();
