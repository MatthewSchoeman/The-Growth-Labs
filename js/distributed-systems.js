(function(){
"use strict";
function byId(id){return document.getElementById(id);}
var SVGNS='http://www.w3.org/2000/svg';
function mk(n,a){var e=document.createElementNS(SVGNS,n);for(var k in a)e.setAttribute(k,a[k]);return e;}
function svgText(x,y,s,fill,size,anchor,weight){var t=mk('text',{x:x,y:y,fill:fill,'font-size':size||11,'font-family':'IBM Plex Mono, monospace','text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function addLog(el,msg,cls){if(!el)return;var d=document.createElement('div');d.className='lg'+(cls?' '+cls:'');d.innerHTML=msg;el.appendChild(d);requestAnimationFrame(function(){d.classList.add('show');});while(el.children.length>40)el.removeChild(el.firstChild);el.scrollTop=el.scrollHeight;}
function segInit(id,attr,cb){var seg=byId(id);if(!seg)return;seg.querySelectorAll('.seg-opt').forEach(function(o){o.addEventListener('click',function(){seg.querySelectorAll('.seg-opt').forEach(function(x){x.classList.remove('on');});o.classList.add('on');cb(o.getAttribute(attr));});});}

(function hero(){
  var svg=byId('heroSvg');if(!svg)return;
  var EM='#10B981',RED='#ED4E6E',MU='#7E88A4',INK='#E8ECF8';
  var A=[[130,112],[250,96],[186,206]], B=[[612,106],[742,130],[676,216]];
  svg.appendChild(svgText(430,30,'one cluster, split into two',MU,11,'middle','600'));
  function edge(p,q,color,dash){var l=mk('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:color,'stroke-width':dash?1.6:2});if(dash)l.setAttribute('stroke-dasharray','5 5');l.setAttribute('opacity',dash?'0.85':'0.6');svg.appendChild(l);}
  edge(A[0],A[1],EM);edge(A[1],A[2],EM);edge(A[0],A[2],EM);
  edge(B[0],B[1],EM);edge(B[1],B[2],EM);edge(B[0],B[2],EM);
  edge(A[1],B[0],RED,true);edge(A[2],B[2],RED,true);
  function xmark(p,q){var mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2;svg.appendChild(mk('circle',{cx:mx,cy:my,r:9,fill:'#0A0E1A',stroke:RED,'stroke-width':1.4}));svg.appendChild(svgText(mx,my+3.5,'\u2715',RED,10,'middle','700'));}
  xmark(A[1],B[0]);xmark(A[2],B[2]);
  var px=430,seg=[];for(var y=36;y<=270;y+=26){seg.push((seg.length%2?px+13:px-13)+' '+y);}
  svg.appendChild(mk('path',{d:'M'+seg.join(' L'),fill:'none',stroke:RED,'stroke-width':1.6,'stroke-dasharray':'2 6',opacity:'0.6'}));
  svg.appendChild(svgText(px,286,'PARTITION',RED,10,'middle','700'));
  function node(p,val,label){svg.appendChild(mk('circle',{cx:p[0],cy:p[1],r:27,fill:'#141B2D',stroke:EM,'stroke-width':1.8}));svg.appendChild(svgText(p[0],p[1]+4.5,val,INK,13,'middle','600'));}
  A.forEach(function(p){node(p,'x=4');});
  B.forEach(function(p){node(p,'x=3');});
  svg.appendChild(svgText(186,262,'Partition A',EM,11,'middle','600'));
  svg.appendChild(svgText(676,266,'Partition B',EM,11,'middle','600'));
})();

(function(){
  var KEYS=12, keyPos=[], nodePos=[30,90,150,210,270,330];
  for(var i=0;i<KEYS;i++)keyPos.push(i*30+15);
  var count=3, strategy='consistent', assign=[];
  var shNodes=byId('shNodes'),shMoved=byId('shMoved'),shNodeCount=byId('shNodeCount'),shStatus=byId('shStatus'),shLog=byId('shLog');
  if(!shNodes)return;
  function compute(strat,c){var out=[];for(var i=0;i<KEYS;i++){if(strat==='modulo'){out.push(i%c);}else{var kp=keyPos[i],node=-1;for(var j=0;j<c;j++){if(nodePos[j]>=kp){node=j;break;}}if(node<0)node=0;out.push(node);}}return out;}
  function render(moved){shNodes.innerHTML='';for(var j=0;j<count;j++){var keys='';for(var i=0;i<KEYS;i++){if(assign[i]===j){var mv=moved&&moved.indexOf(i)>=0;keys+='<span class="sh-key'+(mv?' moved':'')+'">k'+i+'</span>';}}shNodes.innerHTML+='<div class="sh-node"><div class="shn-h">Node '+j+'</div><div class="sh-keys">'+keys+'</div></div>';}shNodeCount.textContent=count;}
  function change(newCount){var old=assign.slice(),oldCount=count;count=newCount;assign=compute(strategy,count);var moved=[];for(var i=0;i<KEYS;i++){if(assign[i]!==old[i])moved.push(i);}shMoved.textContent=moved.length;render(moved);shStatus.className='stateline'+(strategy==='consistent'?' good':' warn');shStatus.textContent=(oldCount<newCount?'added':'removed')+' a node \u2192 '+moved.length+' of 12 keys moved ('+strategy+')';addLog(shLog,'<b>'+(oldCount<newCount?'+node':'\u2212node')+'</b> ('+strategy+') \u2192 '+moved.length+' keys relocated','moved'.length&&strategy==='modulo'?'warn':'net');}
  byId('shAddNode').addEventListener('click',function(){if(count>=6){addLog(shLog,'max 6 nodes','');return;}change(count+1);});
  byId('shRemoveNode').addEventListener('click',function(){if(count<=2){addLog(shLog,'min 2 nodes','');return;}change(count-1);});
  segInit('shSeg','data-mode',function(v){strategy=v;assign=compute(strategy,count);shMoved.textContent='\u2014';render(null);shStatus.className='stateline';shStatus.textContent='strategy: '+v+' \u2014 add or remove a node to see key movement';addLog(shLog,'strategy \u2192 <b>'+v+'</b>','');});
  byId('shReset').addEventListener('click',function(){count=3;strategy='consistent';byId('shSeg').querySelectorAll('.seg-opt').forEach(function(o,i){o.classList.toggle('on',i===0);});assign=compute(strategy,count);shMoved.textContent='\u2014';render(null);shStatus.className='stateline';shStatus.textContent='reset \u2014 3 nodes, consistent hashing';addLog(shLog,'reset','');});
  assign=compute(strategy,count);render(null);
})();

(function(){
  var N=5,W=3,R=3,reps=[],lastWrite=1;
  for(var i=0;i<N;i++)reps.push(1);
  var rpW=byId('rpW'),rpR=byId('rpR'),rpQuorum=byId('rpQuorum'),rpReplicas=byId('rpReplicas'),rpReadResult=byId('rpReadResult'),rpLog=byId('rpLog');
  if(!rpReplicas)return;
  var readSet=[];
  function resetReps(){for(var i=0;i<N;i++)reps[i]=1;lastWrite=1;readSet=[];}
  function render(){rpReplicas.innerHTML='';for(var i=0;i<N;i++){var written=reps[i]===2,inRead=readSet.indexOf(i)>=0;rpReplicas.innerHTML+='<div class="rp-rep'+(written?' written':'')+(inRead?' readset':'')+'"><div class="rpr-id">r'+i+'</div><div class="rpr-v">v'+reps[i]+'</div></div>';}}
  function quorum(){var sum=W+R;if(sum>N){rpQuorum.className='rp-quorum strong';rpQuorum.innerHTML='W + R = '+sum+' &gt; '+N+' \u2192 strong (every read overlaps the write)';}else{rpQuorum.className='rp-quorum weak';rpQuorum.innerHTML='W + R = '+sum+' \u2264 '+N+' \u2192 eventual (reads may be stale)';}}
  function setW(v){W=Math.max(1,Math.min(N,v));rpW.textContent=W;resetReps();quorum();render();rpReadResult.className='stateline';rpReadResult.textContent='W='+W+' \u2014 write, then read';}
  function setR(v){R=Math.max(1,Math.min(N,v));rpR.textContent=R;resetReps();quorum();render();rpReadResult.className='stateline';rpReadResult.textContent='R='+R+' \u2014 write, then read';}
  byId('rpWinc').addEventListener('click',function(){setW(W+1);});
  byId('rpWdec').addEventListener('click',function(){setW(W-1);});
  byId('rpRinc').addEventListener('click',function(){setR(R+1);});
  byId('rpRdec').addEventListener('click',function(){setR(R-1);});
  byId('rpWrite').addEventListener('click',function(){for(var i=0;i<N;i++)reps[i]=(i<W)?2:reps[i];lastWrite=2;readSet=[];render();addLog(rpLog,'<b>write v2</b> \u2192 replicas r0\u2013r'+(W-1)+' ('+W+' nodes)','net');rpReadResult.className='stateline';rpReadResult.textContent='wrote v2 to W='+W+' replicas \u2014 now read';});
  byId('rpRead').addEventListener('click',function(){readSet=[];for(var i=N-R;i<N;i++)readSet.push(i);var sawV2=false;for(var k=0;k<readSet.length;k++)if(reps[readSet[k]]===2)sawV2=true;render();var msg,cls;if(lastWrite<2){msg='read from R='+R+' (r'+(N-R)+'\u2013r'+(N-1)+') \u2192 v1 (no newer write yet)';cls='';}else if(sawV2){msg='\u2713 read from R='+R+' \u2192 sees v2 \u2014 CONSISTENT (quorums overlap)';cls='good';}else{msg='\u2717 read from R='+R+' \u2192 sees v1 \u2014 STALE (read set missed the write)';cls='bad';}rpReadResult.className='stateline '+cls;rpReadResult.textContent=msg;addLog(rpLog,msg,cls||'net');});
  byId('rpReset').addEventListener('click',function(){W=3;R=3;rpW.textContent=3;rpR.textContent=3;resetReps();quorum();render();rpReadResult.className='stateline';rpReadResult.textContent='reset \u2014 N=5, W=3, R=3';addLog(rpLog,'reset','');});
  quorum();render();
})();

(function(){
  var nodes=[],leader=-1,term=0,committed=0;
  for(var i=0;i<5;i++)nodes.push({alive:true,role:'follower'});
  var raLeader=byId('raLeader'),raTerm=byId('raTerm'),raCommitted=byId('raCommitted'),raNodes=byId('raNodes'),raStatus=byId('raStatus'),raLog=byId('raLog');
  if(!raNodes)return;
  function firstAlive(){for(var i=0;i<5;i++)if(nodes[i].alive)return i;return -1;}
  function render(){raNodes.innerHTML='';for(var i=0;i<5;i++){var n=nodes[i],cls=!n.alive?' dead':(n.role==='leader'?' on':'');var sub=!n.alive?'crashed':n.role;raNodes.innerHTML+='<div class="node'+cls+'"><div class="nd-id">node '+i+'</div><div class="nd-sub">'+sub+'</div></div>';}raLeader.textContent=leader<0?'none':'node '+leader;raTerm.textContent=term;raCommitted.textContent=committed;}
  function elect(){term++;for(var i=0;i<5;i++)if(nodes[i].alive)nodes[i].role='follower';var c=firstAlive();nodes[c].role='leader';leader=c;raStatus.className='stateline good';raStatus.textContent='term '+term+': node '+c+' won a majority (3 of 5) \u2192 leader';addLog(raLog,'term '+term+': <b>node '+c+'</b> elected leader (majority vote)','ok');render();}
  byId('raElect').addEventListener('click',elect);
  byId('raReplicate').addEventListener('click',function(){if(leader<0){raStatus.className='stateline bad';raStatus.textContent='no leader \u2014 elect one first';addLog(raLog,'replicate failed \u2014 no leader','bad');return;}committed++;raStatus.className='stateline good';raStatus.textContent='entry replicated to a majority \u2192 committed (#'+committed+')';addLog(raLog,'entry \u2192 stored by majority \u2192 <b>committed #'+committed+'</b>','ok');render();});
  byId('raKill').addEventListener('click',function(){if(leader<0){addLog(raLog,'no leader to kill \u2014 elect first','');return;}var old=leader;nodes[old].alive=false;nodes[old].role='dead';leader=-1;term++;var c=firstAlive();if(c>=0){nodes[c].role='leader';leader=c;}raStatus.className='stateline warn';raStatus.textContent='leader node '+old+' failed \u2192 term '+term+': node '+c+' elected';addLog(raLog,'leader '+old+' <b>crashed</b> \u2192 term '+term+': node '+c+' elected','warn');render();});
  byId('raReset').addEventListener('click',function(){for(var i=0;i<5;i++){nodes[i].alive=true;nodes[i].role='follower';}leader=-1;term=0;committed=0;raStatus.className='stateline';raStatus.textContent='reset \u2014 elect a leader to begin';addLog(raLog,'reset','');render();});
  render();
})();

(function(){
  var A=0,B=0,C=0;
  var ckA=byId('ckA'),ckB=byId('ckB'),ckC=byId('ckC'),ckStatus=byId('ckStatus'),ckLog=byId('ckLog');
  if(!ckA)return;
  function render(){ckA.textContent=A;ckB.textContent=B;ckC.textContent=C;}
  byId('ckLocalA').addEventListener('click',function(){A++;render();ckStatus.className='stateline';ckStatus.textContent='local event on A \u2192 A = '+A;addLog(ckLog,'local event on A \u2192 A = '+A,'');});
  byId('ckLocalB').addEventListener('click',function(){B++;render();ckStatus.className='stateline';ckStatus.textContent='local event on B \u2192 B = '+B;addLog(ckLog,'local event on B \u2192 B = '+B,'');});
  byId('ckSendAB').addEventListener('click',function(){A++;var msg=A,ob=B;B=Math.max(B,msg)+1;render();ckStatus.className='stateline good';ckStatus.textContent='A sends (ts='+msg+') \u2192 B = max('+ob+','+msg+')+1 = '+B;addLog(ckLog,'A\u2192B: send ts='+msg+', B jumps to max('+ob+','+msg+')+1 = <b>'+B+'</b>','net');});
  byId('ckSendBC').addEventListener('click',function(){B++;var msg=B,oc=C;C=Math.max(C,msg)+1;render();ckStatus.className='stateline good';ckStatus.textContent='B sends (ts='+msg+') \u2192 C = max('+oc+','+msg+')+1 = '+C;addLog(ckLog,'B\u2192C: send ts='+msg+', C jumps to max('+oc+','+msg+')+1 = <b>'+C+'</b>','net');});
  byId('ckReset').addEventListener('click',function(){A=0;B=0;C=0;render();ckStatus.className='stateline';ckStatus.textContent='reset \u2014 all clocks at 0';addLog(ckLog,'reset','');});
  render();
})();

(function(){
  var R={linearizable:['2','2','2','every read sees the most recent write \u2014 real-time order'],causal:['1','2','2','reads never go backward; causally-ordered writes seen in order'],eventual:['0','1','2','reads may be stale; all replicas converge eventually']};
  var cyR1=byId('cyR1'),cyR2=byId('cyR2'),cyR3=byId('cyR3'),cyGuarantee=byId('cyGuarantee'),cyLog=byId('cyLog');
  if(!cyR1)return;
  function setModel(m){var r=R[m];cyR1.textContent=r[0];cyR2.textContent=r[1];cyR3.textContent=r[2];cyGuarantee.className='stateline good';cyGuarantee.textContent=r[3];addLog(cyLog,'<b>'+m+'</b> \u2192 reads may be '+r[0]+', '+r[1]+', '+r[2],'net');}
  segInit('cySeg','data-mode',setModel);
  byId('cyReset').addEventListener('click',function(){byId('cySeg').querySelectorAll('.seg-opt').forEach(function(o,i){o.classList.toggle('on',i===0);});setModel('linearizable');addLog(cyLog,'reset','');});
  setModel('linearizable');
})();

(function(){
  var mode='cp',partitioned=false,valA='1',valB='1',availA=true,availB=true,wa=0,wb=0;
  var caValA=byId('caValA'),caValB=byId('caValB'),caAvailA=byId('caAvailA'),caAvailB=byId('caAvailB'),caPartA=byId('caPartA'),caPartB=byId('caPartB'),caStatus=byId('caStatus'),caLog=byId('caLog');
  if(!caValA)return;
  function render(){caValA.textContent='x = '+valA;caValB.textContent='x = '+valB;
    caAvailA.textContent=availA?'available':'unavailable';caPartA.className='ca-part '+(availA?'avail':'unavail');
    var bDiverged=partitioned&&mode==='ap'&&valA!==valB;
    caAvailB.textContent=!availB?'unavailable':(bDiverged?'diverged':'available');
    caPartB.className='ca-part '+(!availB?'unavail':(bDiverged?'diverged':'avail'));}
  byId('caPartition').addEventListener('click',function(){partitioned=true;if(mode==='cp'){availB=false;caStatus.className='stateline warn';caStatus.textContent='network split \u2014 CP: minority B is now UNAVAILABLE to stay consistent';}else{availA=true;availB=true;caStatus.className='stateline warn';caStatus.textContent='network split \u2014 AP: both sides stay available (and may diverge)';}addLog(caLog,'\u26a1 partition ('+mode.toUpperCase()+')','net');render();});
  byId('caWriteA').addEventListener('click',function(){wa++;valA='A'+wa;caStatus.className='stateline good';caStatus.textContent='write to A \u2192 x = '+valA+' (A is the majority side, always available)';addLog(caLog,'write A \u2192 x='+valA,'ok');render();});
  byId('caWriteB').addEventListener('click',function(){if(partitioned&&mode==='cp'){caStatus.className='stateline bad';caStatus.textContent='write to B REJECTED \u2014 B is unavailable (CP chose consistency over availability)';addLog(caLog,'write B \u2192 <b>REJECTED</b> (CP, B unavailable)','bad');render();return;}wb++;valB='B'+wb;caStatus.className='stateline'+(partitioned?' warn':' good');caStatus.textContent='write to B \u2192 x = '+valB+(partitioned?' (AP \u2014 B now diverges from A)':'');addLog(caLog,'write B \u2192 x='+valB+(partitioned?' (diverging)':''),partitioned?'warn':'ok');render();});
  byId('caHeal').addEventListener('click',function(){var wasAP=mode==='ap'&&partitioned&&valA!==valB;partitioned=false;availA=true;availB=true;if(mode==='cp'){valB=valA;caStatus.className='stateline good';caStatus.textContent='healed \u2014 CP kept both sides consistent, no conflict (x = '+valA+')';addLog(caLog,'healed (CP) \u2192 consistent, no conflict','ok');}else if(wasAP){caStatus.className='stateline bad';caStatus.textContent='healed \u2014 AP DIVERGED: conflict to reconcile (A = '+valA+', B = '+valB+')';addLog(caLog,'healed (AP) \u2192 <b>CONFLICT</b>: A='+valA+' vs B='+valB,'bad');}else{caStatus.className='stateline good';caStatus.textContent='healed \u2014 no divergence';addLog(caLog,'healed \u2192 consistent','ok');}render();});
  byId('caReset').addEventListener('click',function(){mode=mode;partitioned=false;valA='1';valB='1';availA=true;availB=true;wa=0;wb=0;caStatus.className='stateline';caStatus.textContent='reset \u2014 split the network to begin';addLog(caLog,'reset','');render();});
  segInit('caSeg','data-mode',function(v){mode=v;partitioned=false;valA='1';valB='1';availA=true;availB=true;wa=0;wb=0;caStatus.className='stateline';caStatus.textContent='mode: '+v.toUpperCase()+' \u2014 split the network to begin';addLog(caLog,'mode \u2192 '+v.toUpperCase(),'');render();});
  render();
})();

(function(){
  var txCoord=byId('txCoord'),txPhase=byId('txPhase'),txParts=byId('txParts'),txLog=byId('txLog');
  if(!txParts)return;
  function render(states){txParts.innerHTML='';for(var i=0;i<3;i++){var s=states[i],cls=s==='committed'?' on':(s==='blocked'||s==='voted no'?' warnode':(s==='aborted'?' dead':''));txParts.innerHTML+='<div class="node'+cls+'"><div class="nd-id">P'+i+'</div><div class="nd-sub">'+s+'</div></div>';}}
  byId('txCommit').addEventListener('click',function(){txPhase.className='tx-phase commit';txPhase.textContent='COMMITTED \u2014 all 3 prepared, then committed';txCoord.textContent='committed';render(['committed','committed','committed']);addLog(txLog,'phase 1: prepare \u2192 all voted <b>YES</b>','ok');addLog(txLog,'phase 2: <b>COMMIT</b> \u2192 all participants committed','ok');});
  byId('txAbort').addEventListener('click',function(){txPhase.className='tx-phase abort';txPhase.textContent='ABORTED \u2014 P2 voted NO, everyone rolled back';txCoord.textContent='aborted';render(['aborted','aborted','voted no']);addLog(txLog,'phase 1: prepare \u2192 <b>P2 voted NO</b>','bad');addLog(txLog,'phase 2: <b>ABORT</b> \u2192 all rolled back','bad');});
  byId('txKill').addEventListener('click',function(){txPhase.className='tx-phase block';txPhase.textContent='BLOCKED \u2014 coordinator failed after prepare; participants hold locks';txCoord.textContent='FAILED';render(['blocked','blocked','blocked']);addLog(txLog,'phase 1: prepare \u2192 all prepared','warn');addLog(txLog,'coordinator <b>CRASHED</b> before deciding \u2192 participants BLOCKED','warn');});
  byId('txReset').addEventListener('click',function(){txPhase.className='tx-phase';txPhase.textContent='idle \u2014 run a transaction';txCoord.textContent='ready';render(['idle','idle','idle']);addLog(txLog,'reset','');});
  render(['idle','idle','idle']);
})();

(function(){
  var mode='atmost';
  var dlDelivered=byId('dlDelivered'),dlDuplicates=byId('dlDuplicates'),dlReceived=byId('dlReceived'),dlStatus=byId('dlStatus'),dlLog=byId('dlLog');
  if(!dlReceived)return;
  function send(){
    var msgs='',delivered=0,dup=0,msg,cls;
    if(mode==='atmost'){msgs='<span class="dl-msg">msg #1</span>';delivered=1;dup=0;msg='at-most-once: sent once, ack lost, NOT retried \u2192 processed once (a dropped send would be lost forever)';cls='warn';addLog(dlLog,'send \u2192 processed once, no retry (risk: loss)','warn');}
    else if(mode==='atleast'){msgs='<span class="dl-msg">msg #1</span><span class="dl-msg dup">msg #1 (dup)</span>';delivered=2;dup=1;msg='at-least-once: ack lost \u2192 retried \u2192 consumer processed the message TWICE (duplicate)';cls='bad';addLog(dlLog,'ack lost \u2192 retry \u2192 <b>duplicate</b> processed (2\u00d7)','bad');}
    else{msgs='<span class="dl-msg">msg #1</span><span class="dl-msg dropped">msg #1 (dup, dropped)</span>';delivered=1;dup=0;msg='exactly-once: ack lost \u2192 retried \u2192 consumer recognized the id and DROPPED the repeat \u2192 processed once';cls='good';addLog(dlLog,'ack lost \u2192 retry \u2192 dedup by id \u2192 duplicate <b>dropped</b> \u2192 once','ok');}
    dlReceived.innerHTML=msgs;dlDelivered.textContent=delivered;dlDuplicates.textContent=dup;dlStatus.className='stateline '+cls;dlStatus.textContent=msg;
  }
  byId('dlSend').addEventListener('click',send);
  segInit('dlSeg','data-mode',function(v){mode=v;dlReceived.innerHTML='';dlDelivered.textContent='0';dlDuplicates.textContent='0';dlStatus.className='stateline';dlStatus.textContent='guarantee: '+v+' \u2014 send a message';addLog(dlLog,'guarantee \u2192 <b>'+v+'</b>','');});
  byId('dlReset').addEventListener('click',function(){dlReceived.innerHTML='';dlDelivered.textContent='0';dlDuplicates.textContent='0';dlStatus.className='stateline';dlStatus.textContent='reset \u2014 send a message';addLog(dlLog,'reset','');});
})();

(function(){
  var state='closed',failures=0,depHealthy=true,THRESH=3;
  var cbState=byId('cbState'),cbFailures=byId('cbFailures'),cbDep=byId('cbDep'),cbStatus=byId('cbStatus'),cbLog=byId('cbLog');
  if(!cbState)return;
  function setState(s){state=s;var label=s==='closed'?'CLOSED':(s==='open'?'OPEN':'HALF-OPEN');cbState.textContent=label;cbState.className='pill '+(s==='closed'?'green':(s==='open'?'red':'amber'));}
  function render(){cbFailures.textContent=failures;cbDep.textContent=depHealthy?'healthy':'failing';}
  byId('cbCall').addEventListener('click',function(){
    if(state==='open'){cbStatus.className='stateline bad';cbStatus.textContent='breaker OPEN \u2192 call rejected immediately (fail fast) \u2014 dependency not touched';addLog(cbLog,'OPEN \u2192 call <b>rejected</b> (fail fast)','bad');return;}
    if(depHealthy){if(state==='half-open'){setState('closed');failures=0;cbStatus.className='stateline good';cbStatus.textContent='probe SUCCEEDED \u2192 breaker CLOSED, normal traffic resumes';addLog(cbLog,'probe ok \u2192 <b>CLOSED</b>','ok');}else{failures=0;cbStatus.className='stateline good';cbStatus.textContent='call succeeded';addLog(cbLog,'call succeeded','ok');}}
    else{failures++;if(state==='half-open'){setState('open');cbStatus.className='stateline bad';cbStatus.textContent='probe FAILED \u2192 back to OPEN';addLog(cbLog,'probe failed \u2192 <b>OPEN</b> again','bad');}else if(failures>=THRESH){setState('open');cbStatus.className='stateline bad';cbStatus.textContent='failure '+failures+' \u2192 threshold reached \u2192 breaker TRIPS OPEN';addLog(cbLog,'failure '+failures+'/'+THRESH+' \u2192 <b>TRIP OPEN</b>','bad');}else{cbStatus.className='stateline bad';cbStatus.textContent='call FAILED ('+failures+'/'+THRESH+' before tripping)';addLog(cbLog,'call failed ('+failures+'/'+THRESH+')','bad');}}
    render();
  });
  byId('cbToggleDep').addEventListener('click',function(){depHealthy=!depHealthy;cbStatus.className='stateline';cbStatus.textContent='dependency is now '+(depHealthy?'HEALTHY':'FAILING');addLog(cbLog,'dependency \u2192 <b>'+(depHealthy?'healthy':'failing')+'</b>','');render();});
  byId('cbTimeout').addEventListener('click',function(){if(state==='open'){setState('half-open');cbStatus.className='stateline warn';cbStatus.textContent='cooldown elapsed \u2192 HALF-OPEN (one probe allowed)';addLog(cbLog,'cooldown \u2192 <b>HALF-OPEN</b>','warn');}else{addLog(cbLog,'cooldown only applies when OPEN','');}});
  byId('cbReset').addEventListener('click',function(){setState('closed');failures=0;depHealthy=true;cbStatus.className='stateline';cbStatus.textContent='reset \u2014 CLOSED, dependency healthy';addLog(cbLog,'reset','');render();});
  render();
})();

(function(){
  var mode='crdt',a=0,b=0;
  var crRepA=byId('crRepA'),crRepB=byId('crRepB'),crMerged=byId('crMerged'),crMergedV=byId('crMergedV'),crStatus=byId('crStatus'),crLog=byId('crLog');
  if(!crRepA)return;
  function render(){crRepA.textContent=a;crRepB.textContent=b;}
  byId('crIncA').addEventListener('click',function(){a++;render();addLog(crLog,'+1 on replica A \u2192 A = '+a,'');});
  byId('crIncB').addEventListener('click',function(){b++;render();addLog(crLog,'+1 on replica B \u2192 B = '+b,'');});
  byId('crMerge').addEventListener('click',function(){if(mode==='crdt'){var t=a+b;crMergedV.textContent=t;crMerged.className='cr-merged nol';crStatus.className='stateline good';crStatus.textContent='G-Counter merge \u2192 both replicas survive \u2192 converges to '+t;addLog(crLog,'G-Counter: [A:'+a+', B:'+b+'] \u2192 total <b>'+t+'</b> (no loss)','ok');}else{var kept=Math.max(a,b),lost=Math.min(a,b);crMergedV.textContent=kept;crMerged.className='cr-merged loss';crStatus.className='stateline bad';crStatus.textContent='last-write-wins \u2192 kept '+kept+', DISCARDED '+lost+' \u2014 data loss';addLog(crLog,'LWW: kept '+kept+', <b>discarded '+lost+'</b> (data loss)','bad');}});
  segInit('crSeg','data-mode',function(v){mode=v;crMergedV.textContent='\u2014';crMerged.className='cr-merged';crStatus.className='stateline';crStatus.textContent='strategy: '+(v==='crdt'?'G-Counter':'last-write-wins')+' \u2014 increment, then merge';addLog(crLog,'strategy \u2192 <b>'+v+'</b>','');});
  byId('crReset').addEventListener('click',function(){a=0;b=0;render();crMergedV.textContent='\u2014';crMerged.className='cr-merged';crStatus.className='stateline';crStatus.textContent='reset';addLog(crLog,'reset','');});
  render();
})();

(function(){
  var menuBtn=byId('menuBtn'),navEl=byId('nav'),scrim=byId('scrim');
  function close(){if(navEl)navEl.classList.remove('open');if(scrim)scrim.classList.remove('show');}
  if(menuBtn)menuBtn.addEventListener('click',function(){navEl.classList.add('open');scrim.classList.add('show');});
  if(scrim)scrim.addEventListener('click',close);
  document.querySelectorAll('.nav a.module').forEach(function(a){a.addEventListener('click',close);});
})();
var _secs=[].slice.call(document.querySelectorAll('.module-sec'));
var _links=[].slice.call(document.querySelectorAll('.nav a.module'));
function onScroll(){var h=document.documentElement,st=h.scrollTop||document.body.scrollTop,max=(h.scrollHeight-h.clientHeight)||1,prog=byId('progress');if(prog)prog.style.width=(st/max*100)+'%';var cur='',y=st+130;for(var i=0;i<_secs.length;i++){if(_secs[i].offsetTop<=y)cur=_secs[i].id;}for(var j=0;j<_links.length;j++){_links[j].classList.toggle('active',_links[j].getAttribute('href')==='#'+cur);}}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',onScroll);

onScroll();
})();
