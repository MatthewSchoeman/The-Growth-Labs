(function(){
"use strict";
function createDB(){
  var SCHEMA={
    employees:['id','name','dept_id','salary','hire_date','manager_id'],
    departments:['id','name','location','budget']
  };
  var N=null;
  var DATA={
    employees:[
      {id:1,name:'Alice',dept_id:1,salary:145000,hire_date:'2019-03-12',manager_id:N},
      {id:2,name:'Bob',dept_id:1,salary:120000,hire_date:'2020-07-01',manager_id:1},
      {id:3,name:'Carla',dept_id:2,salary:98000,hire_date:'2018-11-23',manager_id:N},
      {id:4,name:'Diego',dept_id:2,salary:87000,hire_date:'2021-01-15',manager_id:3},
      {id:5,name:'Erin',dept_id:3,salary:76000,hire_date:'2022-05-30',manager_id:N},
      {id:6,name:'Frank',dept_id:1,salary:105000,hire_date:'2021-09-09',manager_id:1},
      {id:7,name:'Grace',dept_id:4,salary:68000,hire_date:'2023-02-18',manager_id:N},
      {id:8,name:'Heidi',dept_id:2,salary:91000,hire_date:'2020-03-03',manager_id:3},
      {id:9,name:'Ivan',dept_id:N,salary:82000,hire_date:'2023-08-01',manager_id:N}
    ],
    departments:[
      {id:1,name:'Engineering',location:'San Francisco',budget:1200000},
      {id:2,name:'Sales',location:'New York',budget:800000},
      {id:3,name:'Marketing',location:'New York',budget:500000},
      {id:4,name:'Support',location:'Austin',budget:300000},
      {id:5,name:'Legal',location:'Boston',budget:250000}
    ]
  };
  var KW={};
  ('SELECT DISTINCT FROM AS JOIN INNER LEFT RIGHT FULL OUTER CROSS ON WHERE AND OR NOT IN '+
   'BETWEEN LIKE ILIKE IS NULL GROUP BY HAVING ORDER ASC DESC LIMIT OFFSET TRUE FALSE '+
   'WITH OVER PARTITION UNION INTERSECT EXCEPT INSERT UPDATE DELETE CREATE')
    .split(' ').forEach(function(k){KW[k]=true;});
  var AGG={COUNT:1,SUM:1,AVG:1,MIN:1,MAX:1};
  var SCALAR={UPPER:1,LOWER:1,LENGTH:1,ROUND:1,COALESCE:1,ABS:1};
  function tokenize(s){
    var t=[],i=0,n=s.length;
    function isIdStart(c){return /[A-Za-z_]/.test(c);}
    function isId(c){return /[A-Za-z0-9_]/.test(c);}
    while(i<n){
      var c=s[i];
      if(c===' '||c==='\t'||c==='\n'||c==='\r'){i++;continue;}
      if(c==='-'&&s[i+1]==='-'){while(i<n&&s[i]!=='\n')i++;continue;}
      if(c==="'"){
        var j=i+1,str='';
        while(j<n){ if(s[j]==="'"){ if(s[j+1]==="'"){str+="'";j+=2;continue;} break; } str+=s[j];j++; }
        if(j>=n) throw err("unterminated string literal");
        t.push({k:'str',v:str}); i=j+1; continue;
      }
      if(/[0-9]/.test(c)||(c==='.'&&/[0-9]/.test(s[i+1]))){
        var j2=i,num='';
        while(j2<n&&/[0-9.]/.test(s[j2])){num+=s[j2];j2++;}
        t.push({k:'num',v:parseFloat(num)}); i=j2; continue;
      }
      if(isIdStart(c)){
        var j3=i,id='';
        while(j3<n&&isId(s[j3])){id+=s[j3];j3++;}
        var up=id.toUpperCase();
        if(KW[up]) t.push({k:'kw',v:up}); else t.push({k:'id',v:id});
        i=j3; continue;
      }
      var two=s.substr(i,2);
      if(two==='<='||two==='>='||two==='<>'||two==='!='){t.push({k:'op',v:two});i+=2;continue;}
      if('=<>+-*/'.indexOf(c)>=0){t.push({k:'op',v:c});i++;continue;}
      if(c==='('||c===')'||c===','||c==='.'||c===';'){t.push({k:'punc',v:c});i++;continue;}
      throw err("unexpected character: "+c);
    }
    t.push({k:'eof',v:'<eof>'});
    return t;
  }
  function err(m){var e=new Error(m);e.sql=true;return e;}
  function parse(sql){
    var T=tokenize(sql),p=0;
    function peek(){return T[p];}
    function next(){return T[p++];}
    function isKw(v){var t=T[p];return t.k==='kw'&&(v?t.v===v:true);}
    function isOp(v){var t=T[p];return t.k==='op'&&(v?t.v===v:true);}
    function isPunc(v){var t=T[p];return t.k==='punc'&&t.v===v;}
    function eatKw(v){ if(!isKw(v)) throw err("expected "+v+" but found '"+peek().v+"'"); return next(); }
    function eatPunc(v){ if(!isPunc(v)) throw err("expected '"+v+"' but found '"+peek().v+"'"); return next(); }
    function unsupported(feat){ throw err(feat); }
    if(isKw('WITH')) unsupported("the in-page engine doesn't support WITH / CTEs yet. It covers SELECT, WHERE, JOIN, GROUP BY, HAVING, ORDER BY and LIMIT \u2014 try this one in real PostgreSQL.");
    if(isKw('INSERT')||isKw('UPDATE')||isKw('DELETE')||isKw('CREATE'))
      unsupported("this playground is read-only \u2014 it runs SELECT queries against the two sample tables.");
    eatKw('SELECT');
    var q={distinct:false,select:[],from:null,joins:[],where:null,groupBy:[],having:null,orderBy:[],limit:null,offset:null};
    if(isKw('DISTINCT')){next();q.distinct=true;}

    q.select.push(parseSelectItem());
    while(isPunc(',')){next();q.select.push(parseSelectItem());}
    eatKw('FROM');
    q.from=parseTableRef();
    while(isKw('JOIN')||isKw('INNER')||isKw('LEFT')||isKw('RIGHT')||isKw('FULL')||isKw('CROSS')){
      q.joins.push(parseJoin());
    }
    if(isKw('WHERE')){next();q.where=parseExpr();}
    if(isKw('GROUP')){next();eatKw('BY');q.groupBy.push(parseExpr());while(isPunc(',')){next();q.groupBy.push(parseExpr());}}
    if(isKw('HAVING')){next();q.having=parseExpr();}
    if(isKw('ORDER')){next();eatKw('BY');q.orderBy.push(parseOrderItem());while(isPunc(',')){next();q.orderBy.push(parseOrderItem());}}
    while(isKw('LIMIT')||isKw('OFFSET')){
      if(isKw('LIMIT')){next(); if(peek().k!=='num')throw err("LIMIT expects a number"); q.limit=next().v;}
      else {next(); if(peek().k!=='num')throw err("OFFSET expects a number"); q.offset=next().v;}
    }
    if(isPunc(';'))next();
    if(peek().k!=='eof') throw err("unexpected '"+peek().v+"' \u2014 the query seems to continue past where it should end.");
    return q;
    function parseSelectItem(){
      if(isOp('*')){next();return {star:true};}
      if(peek().k==='id'&&T[p+1]&&T[p+1].k==='punc'&&T[p+1].v==='.'&&T[p+2]&&T[p+2].k==='op'&&T[p+2].v==='*'){
        var tb=next().v;next();next();return {qstar:tb};
      }
      var e=parseExpr();
      if(isKw('OVER')) unsupported("the in-page engine doesn't support window functions (OVER / PARTITION BY) yet \u2014 the course shows them running in real PostgreSQL.");
      var alias=null;
      if(isKw('AS')){next(); if(peek().k!=='id')throw err("expected an alias name after AS"); alias=next().v;}
      else if(peek().k==='id'){ alias=next().v; }
      return {expr:e,alias:alias};
    }
    function parseTableRef(){
      if(peek().k!=='id') throw err("expected a table name after FROM but found '"+peek().v+"'");
      if(T[p+1]&&T[p+1].k==='punc'&&T[p+1].v==='(') unsupported("the in-page engine doesn't support subqueries in FROM yet \u2014 try it in real PostgreSQL.");
      var tb=next().v,alias=null;
      if(isKw('AS')){next();alias=next().v;}
      else if(peek().k==='id'){alias=next().v;}
      return {table:tb,alias:alias||tb};
    }
    function parseJoin(){
      var type='inner';
      if(isKw('CROSS')){next();eatKw('JOIN');var trc=parseTableRef();return {type:'cross',table:trc.table,alias:trc.alias,on:null};}
      if(isKw('INNER')){next();type='inner';}
      else if(isKw('LEFT')){next();if(isKw('OUTER'))next();type='left';}
      else if(isKw('RIGHT')){next();if(isKw('OUTER'))next();type='right';}
      else if(isKw('FULL')){next();if(isKw('OUTER'))next();type='full';}
      eatKw('JOIN');
      var tr=parseTableRef();
      eatKw('ON');
      var on=parseExpr();
      return {type:type,table:tr.table,alias:tr.alias,on:on};
    }
    function parseOrderItem(){
      var e=parseExpr(),dir='asc';
      if(isKw('ASC')){next();dir='asc';} else if(isKw('DESC')){next();dir='desc';}
      return {expr:e,dir:dir};
    }
    function parseExpr(){return parseOr();}
    function parseOr(){var l=parseAnd();while(isKw('OR')){next();var r=parseAnd();l={t:'logic',op:'or',l:l,r:r};}return l;}
    function parseAnd(){var l=parseNot();while(isKw('AND')){next();var r=parseNot();l={t:'logic',op:'and',l:l,r:r};}return l;}
    function parseNot(){ if(isKw('NOT')){next();return {t:'not',e:parseNot()};} return parseCmp(); }
    function parseCmp(){
      var l=parseAdd();

      if(isKw('IS')){next();var neg=false;if(isKw('NOT')){next();neg=true;}eatKw('NULL');return {t:'isnull',e:l,neg:neg};}
      var neg2=false;
      if(isKw('NOT')&&T[p+1]&&T[p+1].k==='kw'&&(T[p+1].v==='IN'||T[p+1].v==='BETWEEN'||T[p+1].v==='LIKE'||T[p+1].v==='ILIKE')){next();neg2=true;}
      if(isKw('IN')){next();eatPunc('(');var list=[];if(!isPunc(')')){list.push(parseExpr());while(isPunc(',')){next();list.push(parseExpr());}}eatPunc(')');return {t:'in',e:l,list:list,neg:neg2};}
      if(isKw('BETWEEN')){next();var lo=parseAdd();eatKw('AND');var hi=parseAdd();return {t:'between',e:l,lo:lo,hi:hi,neg:neg2};}
      if(isKw('LIKE')||isKw('ILIKE')){var ci=peek().v==='ILIKE';next();var pat=parseAdd();return {t:'like',e:l,pat:pat,ci:ci,neg:neg2};}
      if(isOp('=')||isOp('<>')||isOp('!=')||isOp('<')||isOp('<=')||isOp('>')||isOp('>=')){
        var op=next().v;var r=parseAdd();return {t:'cmp',op:op,l:l,r:r};
      }
      return l;
    }
    function parseAdd(){var l=parseMul();while(isOp('+')||isOp('-')){var op=next().v;var r=parseMul();l={t:'arith',op:op,l:l,r:r};}return l;}
    function parseMul(){var l=parseUnary();while(isOp('*')||isOp('/')){var op=next().v;var r=parseUnary();l={t:'arith',op:op,l:l,r:r};}return l;}
    function parseUnary(){ if(isOp('-')){next();return {t:'neg',e:parseUnary()};} return parsePrimary(); }
    function parsePrimary(){
      var t=peek();
      if(t.k==='num'){next();return {t:'num',v:t.v};}
      if(t.k==='str'){next();return {t:'str',v:t.v};}
      if(isKw('NULL')){next();return {t:'null'};}
      if(isKw('TRUE')){next();return {t:'bool',v:true};}
      if(isKw('FALSE')){next();return {t:'bool',v:false};}
      if(isKw('OVER')||isKw('PARTITION')) unsupported("the in-page engine doesn't support window functions (OVER / PARTITION BY) yet \u2014 the course shows them running in real PostgreSQL.");
      if(isPunc('(')){next();var e=parseExpr();eatPunc(')');return e;}
      if(t.k==='id'){
        if(T[p+1]&&T[p+1].k==='punc'&&T[p+1].v==='('){
          var name=next().v;next();
          var star=false,args=[];
          if(isOp('*')){next();star=true;}
          else if(!isPunc(')')){args.push(parseExpr());while(isPunc(',')){next();args.push(parseExpr());}}
          eatPunc(')');
          return {t:'func',name:name.toUpperCase(),args:args,star:star};
        }
        if(T[p+1]&&T[p+1].k==='punc'&&T[p+1].v==='.'){
          var tbl=next().v;next();
          if(peek().k!=='id') throw err("expected a column name after '"+tbl+".'");
          var col=next().v;return {t:'col',table:tbl,name:col};
        }
        next();return {t:'col',name:t.v};
      }
      throw err("unexpected '"+t.v+"' in expression");
    }
  }
  function run(sql){
    var q=parse(sql);
    function seg(spec,row){return {alias:spec.alias,table:spec.table,vals:row};}
    function nullSeg(spec){var v={};SCHEMA[spec.table].forEach(function(c){v[c]=null;});return {alias:spec.alias,table:spec.table,vals:v};}
    function checkTable(spec){ if(!DATA[spec.table]) throw err("unknown table: "+spec.table+" (available: employees, departments)"); }

    checkTable(q.from);
    var rows=DATA[q.from.table].map(function(r){return [seg(q.from,r)];});
    var leftSpecs=[{alias:q.from.alias,table:q.from.table}];
    q.joins.forEach(function(j){
      checkTable(j);
      var rightRows=DATA[j.table];
      var out=[];
      var rSpec={alias:j.alias,table:j.table};
      if(j.type==='cross'){
        rows.forEach(function(L){rightRows.forEach(function(R){out.push(L.concat([seg(rSpec,R)]));});});
      } else if(j.type==='inner'||j.type==='left'||j.type==='full'){
        rows.forEach(function(L){
          var matched=false;
          rightRows.forEach(function(R){
            var cand=L.concat([seg(rSpec,R)]);
            if(evalCond(j.on,{row:cand})===true){out.push(cand);matched=true;}
          });
          if(!matched&&(j.type==='left'||j.type==='full')) out.push(L.concat([nullSeg(rSpec)]));
        });
        if(j.type==='full'){
          rightRows.forEach(function(R){
            var anyL=rows.some(function(L){return evalCond(j.on,{row:L.concat([seg(rSpec,R)])})===true;});
            if(!anyL) out.push(leftSpecs.map(nullSeg).concat([seg(rSpec,R)]));
          });
        }
      } else if(j.type==='right'){
        rightRows.forEach(function(R){
          var matched=false;
          rows.forEach(function(L){
            var cand=L.concat([seg(rSpec,R)]);
            if(evalCond(j.on,{row:cand})===true){out.push(cand);matched=true;}
          });
          if(!matched) out.push(leftSpecs.map(nullSeg).concat([seg(rSpec,R)]));
        });
      }
      rows=out;
      leftSpecs=leftSpecs.concat([rSpec]);
    });
    if(q.where) rows=rows.filter(function(r){return evalCond(q.where,{row:r})===true;});
    var grouped = q.groupBy.length>0 || selectHasAgg(q.select) || (q.having&&hasAgg(q.having));
    var columns=staticColumns(q,leftSpecs);
    var outRows;
    if(grouped){
      var groups=[];
      if(q.groupBy.length>0){
        var map={};
        rows.forEach(function(r){
          var key=q.groupBy.map(function(g){return JSON.stringify(evalVal(g,{row:r}));}).join('\u0001');
          if(!map[key]){map[key]={rows:[],rep:r};groups.push(map[key]);}
          map[key].rows.push(r);
        });
      } else {
        groups=[{rows:rows,rep:rows[0]||null}];
      }
      if(q.having) groups=groups.filter(function(g){return evalCond(q.having,{group:g})===true;});
      outRows=groups.map(function(g){return projectRow(q,{group:g},leftSpecs);});
    } else {
      outRows=rows.map(function(r){return projectRow(q,{row:r},leftSpecs);});
    }
    if(q.distinct){
      var seen={},dd=[];
      outRows.forEach(function(o){var k=JSON.stringify(o.vals);if(!seen[k]){seen[k]=1;dd.push(o);}});
      outRows=dd;
    }

    if(q.orderBy.length){
      outRows=outRows.slice();
      outRows.sort(function(a,b){
        for(var i=0;i<q.orderBy.length;i++){
          var it=q.orderBy[i];
          var ka=orderKey(it,a),kb=orderKey(it,b);
          var c=cmpNull(ka,kb,it.dir);
          if(c!==0)return c;
        }
        return 0;
      });
    }
    var start=q.offset||0;
    var end=(q.limit==null)?outRows.length:start+q.limit;
    outRows=outRows.slice(start,end);
    return {columns:columns,rows:outRows.map(function(o){return o.vals;}),rowCount:outRows.length};

    function projectRow(q,ctx,specs){
      var vals=[],byName={};
      q.select.forEach(function(it){
        if(it.star){
          specs.forEach(function(sp){
            SCHEMA[sp.table].forEach(function(c){
              var rowseg=findSeg(ctx,sp.alias);
              var v=rowseg?rowseg.vals[c]:null;vals.push(v);byName[c]=v;
            });
          });
        } else if(it.qstar){
          var sp=specs.filter(function(s){return s.alias===it.qstar;})[0];
          if(!sp) throw err("unknown table alias: "+it.qstar);
          SCHEMA[sp.table].forEach(function(c){var rs=findSeg(ctx,sp.alias);var v=rs?rs.vals[c]:null;vals.push(v);byName[c]=v;});
        } else {
          var v=evalVal(it.expr,ctx);
          var nm=it.alias||deriveName(it.expr);
          vals.push(v);byName[nm]=v;
        }
      });
      return {vals:vals,byName:byName,ctx:ctx};
    }
    function findSeg(ctx,alias){var r=ctx.group?ctx.group.rep:ctx.row;if(!r)return null;for(var i=0;i<r.length;i++)if(r[i].alias===alias)return r[i];return null;}
    function orderKey(it,o){
      var e=it.expr;
      if(e.t==='num'&&Number.isInteger(e.v)&&e.v>=1&&e.v<=o.vals.length) return o.vals[e.v-1];
      if(e.t==='col'&&!e.table&&(e.name in o.byName)) return o.byName[e.name];
      return evalVal(e,o.ctx);
    }
  }
  function cmpNull(a,b,dir){
    if(a===null&&b===null)return 0;
    if(a===null)return dir==='asc'?1:-1;
    if(b===null)return dir==='asc'?-1:1;
    var c=a<b?-1:(a>b?1:0);
    return dir==='desc'?-c:c;
  }

  function staticColumns(q,specs){
    var cols=[];
    q.select.forEach(function(it){
      if(it.star){ specs.forEach(function(sp){SCHEMA[sp.table].forEach(function(c){cols.push(c);});}); }
      else if(it.qstar){ var sp=specs.filter(function(s){return s.alias===it.qstar;})[0]; if(sp)SCHEMA[sp.table].forEach(function(c){cols.push(c);}); }
      else cols.push(it.alias||deriveName(it.expr));
    });
    return cols;
  }
  function deriveName(e){
    if(e.t==='col')return e.name;
    if(e.t==='func')return e.name.toLowerCase();
    return '?column?';
  }
  function hasAgg(e){
    if(!e||typeof e!=='object')return false;
    if(e.t==='func'&&AGG[e.name])return true;
    return ['l','r','e','lo','hi','pat'].some(function(k){return e[k]&&hasAgg(e[k]);})||
           (e.list&&e.list.some(hasAgg))||(e.args&&e.args.some(hasAgg));
  }
  function selectHasAgg(sel){return sel.some(function(it){return it.expr&&hasAgg(it.expr);});}
  function resolveCol(ctx,table,name){
    var r=ctx.group?ctx.group.rep:ctx.row;
    if(!r) return null;
    if(table){
      for(var i=0;i<r.length;i++) if(r[i].alias===table){ if(name in r[i].vals) return r[i].vals[name]; throw err("column "+table+"."+name+" does not exist"); }
      throw err("missing FROM-clause entry for table \""+table+"\"");
    }
    var hits=[];
    for(var j=0;j<r.length;j++) if(name in r[j].vals) hits.push(r[j].vals[name]);
    if(hits.length===1) return hits[0];
    if(hits.length===0) throw err("column \""+name+"\" does not exist");
    throw err("column reference \""+name+"\" is ambiguous \u2014 qualify it like alias."+name);
  }
  function num(x){return typeof x==='number';}
  function evalVal(e,ctx){
    switch(e.t){
      case 'num':return e.v;
      case 'str':return e.v;
      case 'null':return null;
      case 'bool':return e.v;
      case 'col':return resolveCol(ctx,e.table,e.name);
      case 'neg':{var a=evalVal(e.e,ctx);return a===null?null:-a;}
      case 'arith':{
        var l=evalVal(e.l,ctx),r=evalVal(e.r,ctx);
        if(l===null||r===null)return null;
        if(!num(l)||!num(r)) throw err("arithmetic on non-numeric value");
        if(e.op==='+')return l+r;
        if(e.op==='-')return l-r;
        if(e.op==='*')return l*r;
        if(e.op==='/'){ if(r===0)throw err("division by zero"); return (Number.isInteger(l)&&Number.isInteger(r))?Math.trunc(l/r):l/r; }
        break;
      }
      case 'func':{
        if(AGG[e.name]){
          if(!ctx.group) throw err(e.name+"() is an aggregate \u2014 it needs a GROUP BY, or use it without other bare columns.");
          return aggregate(e,ctx.group);
        }
        if(!SCALAR[e.name]) throw err("function "+e.name.toLowerCase()+"(...) is not supported by the in-page engine.");
        var a=e.args.map(function(x){return evalVal(x,ctx);});
        switch(e.name){
          case 'UPPER':return a[0]===null?null:String(a[0]).toUpperCase();
          case 'LOWER':return a[0]===null?null:String(a[0]).toLowerCase();
          case 'LENGTH':return a[0]===null?null:String(a[0]).length;
          case 'ABS':return a[0]===null?null:Math.abs(a[0]);
          case 'ROUND':{ if(a[0]===null)return null; var d=a.length>1?a[1]:0; var f=Math.pow(10,d); return Math.round(a[0]*f)/f; }
          case 'COALESCE':{ for(var i=0;i<a.length;i++) if(a[i]!==null) return a[i]; return null; }
        }
        break;
      }
    }
    throw err("cannot evaluate expression");
  }
  function aggregate(e,g){
    var rows=g.rows;
    if(e.name==='COUNT'){
      if(e.star) return rows.length;
      var c=0;rows.forEach(function(r){if(evalVal(e.args[0],{row:r})!==null)c++;});return c;
    }
    var nums=[];rows.forEach(function(r){var v=evalVal(e.args[0],{row:r});if(v!==null)nums.push(v);});
    if(e.name==='SUM')return nums.length?nums.reduce(function(a,b){return a+b;},0):null;
    if(e.name==='AVG'){ if(!nums.length)return null; var s=nums.reduce(function(a,b){return a+b;},0); return Math.round((s/nums.length)*100)/100; }
    if(e.name==='MIN')return nums.length?nums.reduce(function(a,b){return a<b?a:b;}):null;
    if(e.name==='MAX')return nums.length?nums.reduce(function(a,b){return a>b?a:b;}):null;
    throw err("unknown aggregate "+e.name);
  }
  function likeRegex(pat,ci){
    var re='';for(var i=0;i<pat.length;i++){var ch=pat[i];
      if(ch==='%')re+='[\\s\\S]*';
      else if(ch==='_')re+='[\\s\\S]';
      else re+=ch.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    }
    return new RegExp('^'+re+'$',ci?'i':'');
  }
  function evalCond(e,ctx){
    switch(e.t){
      case 'logic':{
        var a=evalCond(e.l,ctx),b=evalCond(e.r,ctx);
        if(e.op==='and'){ if(a===false||b===false)return false; if(a===null||b===null)return null; return true; }
        else { if(a===true||b===true)return true; if(a===null||b===null)return null; return false; }
      }
      case 'not':{var t=evalCond(e.e,ctx);return t===null?null:!t;}
      case 'isnull':{var v=evalVal(e.e,ctx);var r=(v===null);return e.neg?!r:r;}
      case 'cmp':{
        var l=evalVal(e.l,ctx),r2=evalVal(e.r,ctx);
        if(l===null||r2===null)return null;
        switch(e.op){case '=':return l===r2;case '<>':case '!=':return l!==r2;
          case '<':return l<r2;case '<=':return l<=r2;case '>':return l>r2;case '>=':return l>=r2;}
        return null;
      }
      case 'in':{
        var v2=evalVal(e.e,ctx);if(v2===null)return null;
        var found=false,sawNull=false;
        e.list.forEach(function(x){var xv=evalVal(x,ctx);if(xv===null)sawNull=true;else if(xv===v2)found=true;});
        var res=found?true:(sawNull?null:false);
        return e.neg?(res===null?null:!res):res;
      }
      case 'between':{
        var a2=evalVal(e.e,ctx),lo=evalVal(e.lo,ctx),hi=evalVal(e.hi,ctx);
        if(a2===null||lo===null||hi===null)return null;
        var res2=(a2>=lo&&a2<=hi);return e.neg?!res2:res2;
      }
      case 'like':{
        var s=evalVal(e.e,ctx),pp=evalVal(e.pat,ctx);
        if(s===null||pp===null)return null;
        var res3=likeRegex(String(pp),e.ci).test(String(s));return e.neg?!res3:res3;
      }
      default:{
        var val=evalVal(e,ctx);
        if(val===null)return null;return !!val;
      }
    }
  }
  return {run:run, schema:SCHEMA, data:DATA};
}
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var NS='http://www.w3.org/2000/svg';
function mk(name,attrs){var e=document.createElementNS(NS,name);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function div(cls){var d=document.createElement('div');if(cls)d.className=cls;return d;}
function clearSVG(s){while(s.firstChild)s.removeChild(s.firstChild);}
var C={from:'#56C7FF',where:'#E8B341',join:'#5BD6C2',group:'#A78BFA',having:'#F2973C',select:'#4ED66B',order:'#ED6E9E',limit:'#ED4E6E',
       ink:'#E8ECF8',soft:'#B7C0D8',mut:'#7E88A4',faint:'#565F79',bad:'#ED4E6E',ok:'#4ED66B',line:'rgba(140,160,205,0.4)',lineFaint:'rgba(140,160,205,0.22)'};
function Runner(){this.q=[];this.t=null;this.busy=false;}
Runner.prototype.add=function(fn,delay){this.q.push({fn:fn,delay:reduceMotion?0:delay});return this;};
Runner.prototype.run=function(done){var self=this;this.busy=true;(function step(){if(!self.q.length){self.busy=false;if(done)done();return;}var it=self.q.shift();if(it.fn)it.fn();self.t=setTimeout(step,it.delay);})();};
Runner.prototype.cancel=function(){clearTimeout(this.t);this.q=[];this.busy=false;};
function svgText(x,y,s,fill,size,anchor,weight,mono){var t=mk('text',{x:x,y:y,fill:fill||C.mut,'font-size':size||12,'font-family':(mono===false?'IBM Plex Sans, sans-serif':'IBM Plex Mono, monospace'),'text-anchor':anchor||'middle'});if(weight)t.setAttribute('font-weight',weight);t.textContent=s;return t;}
function escapeHtml(s){return String(s).replace(/[&<>"]/g,function(ch){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[ch];});}
function fmtCell(v){ if(v===null||v===undefined) return '<span class="nullv">NULL</span>'; if(typeof v==='number') return '<span class="numv">'+v+'</span>'; return escapeHtml(String(v)); }
function renderRtbl(container,result,ms){
  var meta='<div class="pg-meta"><span class="ok">\u2713</span> '+result.rowCount+' row'+(result.rowCount===1?'':'s')+' returned \u00b7 '+ms+' ms</div>';
  var thead='<thead><tr>'+result.columns.map(function(c){return '<th>'+escapeHtml(c)+'</th>';}).join('')+'</tr></thead>';
  var tbody;
  if(result.rows.length===0){ tbody='<tbody><tr><td colspan="'+result.columns.length+'" style="color:var(--ink-faint);font-style:italic">no rows match</td></tr></tbody>'; }
  else { tbody='<tbody>'+result.rows.map(function(r){return '<tr>'+r.map(function(v){return '<td>'+fmtCell(v)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody>'; }
  container.innerHTML=meta+'<div class="rtbl-wrap"><table class="rtbl">'+thead+tbody+'</table></div>';
}
function renderErr(container,msg){ container.innerHTML='<div class="pg-err"><b>Error:</b> '+escapeHtml(msg)+'</div>'; }
function renderDtbl(tableEl,columns,rows,opts){
  opts=opts||{};var keyCol=opts.keyCol;
  var head='<thead><tr>'+columns.map(function(c){return '<th>'+escapeHtml(c)+'</th>';}).join('')+'</tr></thead>';
  var body='<tbody>'+rows.map(function(r,i){
    var cls=opts.rowClass?opts.rowClass(i,r):'';
    return '<tr'+(cls?' class="'+cls+'"':'')+'>'+r.map(function(v,ci){
      var isKey=keyCol&&columns[ci]===keyCol;
      return '<td'+(isKey?' class="keyc"':'')+'>'+fmtCell(v)+'</td>';
    }).join('')+'</tr>';
  }).join('')+'</tbody>';
  tableEl.innerHTML=head+body;
}
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
var db=createDB();
var EMP=db.data.employees, DEPT=db.data.departments;
(function hero(){
  var svg=document.getElementById('heroSvg');if(!svg)return;
  var run=new Runner();
  function card(x,y,w,h,title,tColor){
    var g=mk('g',{});
    g.appendChild(mk('rect',{x:x,y:y,width:w,height:h,rx:11,fill:'var(--surface-2)',stroke:'var(--border-strong)','stroke-width':1.5}));
    g.appendChild(mk('rect',{x:x,y:y,width:w,height:26,rx:11,fill:'rgba(86,199,255,0.08)'}));
    g.appendChild(mk('rect',{x:x,y:y+15,width:w,height:11,fill:'rgba(86,199,255,0.08)'}));
    g.appendChild(svgText(x+12,y+17,title,tColor,11.5,'start','600'));
    svg.appendChild(g);return g;
  }
  function row(x,y,cells,colW,fill){ cells.forEach(function(c,i){ svg.appendChild(svgText(x+8+colW*i,y,c,fill||C.soft,11,'start','400')); }); }
  card(34,44,196,118,'employees',C.from);
  row(34,80,['name','salary'],100,C.mut);
  svg.appendChild(mk('line',{x1:42,y1:88,x2:222,y2:88,stroke:'var(--border)','stroke-width':1}));
  [['Alice','145000'],['Bob','120000'],['Carla','98000'],['Diego','87000']].forEach(function(r,i){ row(34,108+i*16,[r[0],r[1]],100,C.soft); });
  card(34,182,196,80,'departments',C.from);
  row(34,218,['id','name'],46,C.mut);
  svg.appendChild(mk('line',{x1:42,y1:226,x2:222,y2:226,stroke:'var(--border)','stroke-width':1}));
  [['1','Engineering'],['2','Sales']].forEach(function(r,i){ row(34,246+i*16,[r[0],r[1]],46,C.soft); });
  card(322,82,196,150,'query',C.ink);
  var ql=[['SELECT',C.select,' name, salary'],['FROM',C.from,' employees'],['WHERE',C.where,' salary>90k'],['ORDER BY',C.order,' salary']];
  ql.forEach(function(q,i){
    var yy=120+i*26;
    svg.appendChild(svgText(334,yy,q[0],q[1],12,'start','600'));
    svg.appendChild(svgText(334+q[0].length*8.0,yy,q[2],C.soft,12,'start','400'));
  });
  card(606,64,220,172,'result',C.select);
  row(606,100,['name','salary'],112,C.mut);
  svg.appendChild(mk('line',{x1:614,y1:108,x2:818,y2:108,stroke:'var(--border)','stroke-width':1}));
  var resRows=[['Alice','145000'],['Bob','120000'],['Frank','105000'],['Heidi','91000']];
  var resG=mk('g',{});svg.appendChild(resG);

  function arrow(x1,y1,x2,y2,color){
    if(!svg.querySelector('#hAh')){var m=mk('marker',{id:'hAh',markerWidth:8,markerHeight:8,refX:6,refY:3,orient:'auto'});m.appendChild(mk('path',{d:'M0 0L6 3L0 6Z',fill:C.mut}));svg.appendChild(m);}
    svg.appendChild(mk('path',{d:'M'+x1+' '+y1+' C'+((x1+x2)/2)+' '+y1+','+((x1+x2)/2)+' '+y2+','+x2+' '+y2,fill:'none',stroke:color||C.lineFaint,'stroke-width':1.6,'marker-end':'url(#hAh)'}));
  }
  arrow(230,110,320,140,C.lineFaint);
  arrow(230,222,320,180,C.lineFaint);
  arrow(518,150,604,150,C.line);
  function draw(){
    clearSVG(resG);
    resRows.forEach(function(r,i){
      if(!shown[i])return;
      var yy=128+i*16;
      var t1=svgText(614,yy,r[0],C.ink,11,'start','500');var t2=svgText(726,yy,r[1],C.select,11,'start','500');
      resG.appendChild(t1);resG.appendChild(t2);
    });
  }
  var shown=[false,false,false,false];
  if(reduceMotion){ shown=[true,true,true,true]; draw(); }
  else{
    run.cancel();
    resRows.forEach(function(r,i){ run.add(function(){ shown[i]=true; draw(); },420); });
    run.run();
  }
})();
(function playground(){
  var editor=document.getElementById('pgEditor');if(!editor)return;
  var out=document.getElementById('pgResult'),runBtn=document.getElementById('pgRun');
  function go(){
    var sql=editor.value;
    var t0=(window.performance&&performance.now)?performance.now():Date.now();
    try{ var r=db.run(sql); var t1=(window.performance&&performance.now)?performance.now():Date.now(); renderRtbl(out,r,Math.max(1,Math.round((t1-t0)*10)/10)); }
    catch(e){ renderErr(out,e.message); }
  }
  runBtn.addEventListener('click',go);
  editor.addEventListener('keydown',function(e){ if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){ e.preventDefault(); go(); } });
  [].forEach.call(document.querySelectorAll('#pgLab .pg-ex'),function(b){ b.addEventListener('click',function(){ editor.value=b.dataset.q; go(); }); });
  go();
})();
(function whereLab(){
  var table=document.getElementById('whereTable');if(!table)return;
  var input=document.getElementById('whereInput'),runBtn=document.getElementById('whereRun'),foot=document.getElementById('whereFoot');
  var cols=['id','name','dept_id','salary','hire_date','manager_id'];
  var rows=EMP.map(function(e){return cols.map(function(c){return e[c];});});
  function apply(){
    var cond=input.value.trim();
    if(!cond){ renderDtbl(table,cols,rows,{keyCol:'id'}); foot.innerHTML='Type a condition to filter the rows.'; return; }
    var keep={};
    try{
      var r=db.run('SELECT id FROM employees WHERE '+cond);
      r.rows.forEach(function(row){keep[row[0]]=true;});
    }catch(e){
      renderDtbl(table,cols,rows,{keyCol:'id'});
      foot.innerHTML='<span style="color:var(--st-bad)">Invalid condition:</span> '+escapeHtml(e.message);
      return;
    }
    var n=0;
    renderDtbl(table,cols,rows,{keyCol:'id',rowClass:function(i,row){ var k=keep[row[0]]; if(k)n++; return k?'row-keep':'row-drop'; }});
    var kept=Object.keys(keep).length;
    if(kept===0) foot.innerHTML='<code class="tok">WHERE '+escapeHtml(cond)+'</code> kept <b class="bad">0 rows</b>. If you used <code class="tok">= NULL</code>, that\u2019s the trap \u2014 a comparison with NULL is never <i>true</i>. Use <code class="tok">IS NULL</code>.';
    else foot.innerHTML='<code class="tok">WHERE '+escapeHtml(cond)+'</code> \u2192 <b class="ok">'+kept+' row'+(kept===1?'':'s')+'</b> kept (glowing), the rest dropped. Each row was tested independently.';
  }
  runBtn.addEventListener('click',apply);
  input.addEventListener('keydown',function(e){ if(e.key==='Enter')apply(); });
  [].forEach.call(document.querySelectorAll('#whereLab .pg-ex'),function(b){ b.addEventListener('click',function(){ input.value=b.dataset.w; apply(); }); });
  apply();
})();
(function groupLab(){
  var src=document.getElementById('groupSource');if(!src)return;
  var res=document.getElementById('groupResult'),runBtn=document.getElementById('groupRun'),foot=document.getElementById('groupFoot'),chips=document.getElementById('groupLab');
  var agg='count',ran=false,run=new Runner();
  var scols=['name','dept_id','salary'];
  var srows=EMP.map(function(e){return [e.name,e.dept_id,e.salary];});

  var deptOrder=[1,2,3,4,'NULL'];
  function deptKey(v){return v===null?'NULL':v;}
  function renderSource(lit){
    renderDtbl(src,scols,srows,{rowClass:function(i,row){ if(!lit)return ''; return 'row-focus'; }});
  }
  var aggSql={count:'COUNT(*) AS headcount',avg:'AVG(salary) AS avg_salary',sum:'SUM(salary) AS total_salary',max:'MAX(salary) AS top_salary'};
  function compute(){
    var r=db.run('SELECT dept_id, '+aggSql[agg]+' FROM employees GROUP BY dept_id ORDER BY dept_id');
    return r;
  }
  function collapse(){
    if(run.busy)return; ran=true;
    var r=compute();
    run.cancel();
    run.add(function(){ renderSource(true); foot.innerHTML='Rows are partitioned by <code class="tok">dept_id</code> \u2014 watch them collapse into one row per group.'; },10);
    run.add(function(){
      renderDtbl(res,r.columns,r.rows,{keyCol:'dept_id',rowClass:function(i,row){return 'row-new';}});
      foot.innerHTML='Nine rows \u2192 <b>'+r.rowCount+' groups</b>. The <code class="tok">'+aggSql[agg].split(' AS ')[0]+'</code> ran once per group. Note the <b class="nullv-i">NULL</b> group \u2014 Ivan, who has no department.';
    },560);
    run.run();
  }
  renderSource(false);
  res.innerHTML='';
  [].forEach.call(chips.querySelectorAll('.chip-btn'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(chips.querySelectorAll('.chip-btn'),function(x){x.classList.remove('sel');});
      b.classList.add('sel'); agg=b.dataset.agg;
      if(ran) collapse();
    });
  });
  runBtn.addEventListener('click',collapse);
})();
(function joinLab(){
  var lEl=document.getElementById('joinLeft');if(!lEl)return;
  var rEl=document.getElementById('joinRight'),resEl=document.getElementById('joinResult'),foot=document.getElementById('joinFoot'),lab=document.getElementById('joinLab');
  var left=[{id:1,name:'Alice',dept_id:1},{id:3,name:'Carla',dept_id:2},{id:7,name:'Grace',dept_id:4},{id:9,name:'Ivan',dept_id:null}];
  var right=[{id:1,name:'Engineering'},{id:2,name:'Sales'},{id:5,name:'Legal'}];
  renderDtbl(lEl,['id','name','dept_id'],left.map(function(e){return [e.id,e.name,e.dept_id];}),{keyCol:'id'});
  renderDtbl(rEl,['id','name'],right.map(function(d){return [d.id,d.name];}),{keyCol:'id'});
  function compute(type){
    var out=[];
    function push(e,d,kind){ out.push({vals:[e?e.id:null,e?e.name:null,e?e.dept_id:null,d?d.id:null,d?d.name:null],kind:kind}); }
    if(type==='inner'||type==='left'||type==='full'){
      left.forEach(function(e){ var m=false; right.forEach(function(d){ if(e.dept_id!==null&&e.dept_id===d.id){push(e,d,'match');m=true;} }); if(!m&&(type==='left'||type==='full'))push(e,null,'fill'); });
    }
    if(type==='right'){
      right.forEach(function(d){ var m=false; left.forEach(function(e){ if(e.dept_id===d.id){push(e,d,'match');m=true;} }); if(!m)push(null,d,'fill'); });
    }
    if(type==='full'){
      right.forEach(function(d){ var any=left.some(function(e){return e.dept_id===d.id;}); if(!any)push(null,d,'fill'); });
    }
    return out;
  }
  var notes={
    inner:'<b>INNER</b> keeps only rows that match on both sides \u2014 <b>2 rows</b>. Grace (dept 4), Ivan (no dept), and Legal (no employees) all vanish.',
    left:'<b>LEFT</b> keeps every employee \u2014 <b>4 rows</b>. Grace and Ivan reappear with <span class="nullv">NULL</span> department columns.',
    right:'<b>RIGHT</b> keeps every department \u2014 <b>3 rows</b>. Legal reappears with <span class="nullv">NULL</span> employee columns.',
    full:'<b>FULL</b> keeps everything from both sides \u2014 <b>5 rows</b>. Unmatched rows from <i>either</i> table appear, padded with <span class="nullv">NULL</span>.'
  };
  function show(type){
    var rows=compute(type);
    renderDtbl(resEl,['e.id','e.name','e.dept_id','d.id','d.name'],rows.map(function(r){return r.vals;}),{rowClass:function(i){return rows[i].kind==='fill'?'row-new':'row-match';}});
    foot.innerHTML=notes[type];
  }
  [].forEach.call(lab.querySelectorAll('[data-jt]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(lab.querySelectorAll('[data-jt]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary'); show(b.dataset.jt);
    });
  });
  show('inner');
})();
(function pipeLab(){
  var host=document.getElementById('pipeStages');if(!host)return;
  var foot=document.getElementById('pipeFoot'),run=new Runner();
  var stages=[
    {cls:'s-from',cl:'FROM',count:'9',lab:'rows',foot:'<b style="color:var(--c-from)">FROM employees</b> assembles all <b>9</b> rows.'},
    {cls:'s-where',cl:'WHERE',count:'8',lab:'rows',foot:'<b style="color:var(--c-where)">WHERE salary &gt; 70000</b> tests each row and drops Grace (68k) \u2192 <b>8</b> rows.'},
    {cls:'s-group',cl:'GROUP BY',count:'4',lab:'groups',foot:'<b style="color:var(--c-group)">GROUP BY dept_id</b> collapses the 8 rows into <b>4</b> groups (depts 1, 2, 3, and the NULL group).'},
    {cls:'s-having',cl:'HAVING',count:'2',lab:'groups',foot:'<b style="color:var(--c-having)">HAVING COUNT(*) &gt;= 2</b> filters the <i>groups</i>, keeping only those with 2+ members \u2192 <b>2</b> groups.'},
    {cls:'s-select',cl:'SELECT',count:'2',lab:'rows',foot:'<b style="color:var(--c-select)">SELECT</b> finally runs (5th!), computing dept_id, n, and avg_pay for the 2 groups.'},
    {cls:'s-order',cl:'ORDER BY',count:'2',lab:'rows',foot:'<b style="color:var(--c-order)">ORDER BY avg_pay DESC</b> sorts: dept 1 (123k) ahead of dept 2 (92k).'},
    {cls:'s-limit',cl:'LIMIT',count:'2',lab:'rows',foot:'<b style="color:var(--c-limit)">LIMIT 2</b> caps the output. Final result: <b>2</b> rows \u2014 and SELECT, written first, ran almost last.'}
  ];
  function build(){
    host.innerHTML='';
    stages.forEach(function(s,i){
      var st=div('pipe-stage '+s.cls);
      st.innerHTML='<div class="pcl">'+s.cl+'</div><div class="pcount">'+s.count+'</div><div class="plabel">'+s.lab+'</div>';
      host.appendChild(st);
      if(i<stages.length-1){var a=div('pipe-arrow');a.textContent='\u2192';host.appendChild(a);}
    });
  }
  function reset(){ run.cancel(); build(); foot.innerHTML='Nine rows enter at <code class="tok">FROM</code>. Press run to watch each logical stage transform them.'; }
  function play(){
    if(run.busy)return; build();
    var chips=host.querySelectorAll('.pipe-stage');
    run.cancel();
    stages.forEach(function(s,i){ run.add(function(){ chips[i].classList.add('lit'); foot.innerHTML=s.foot; },720); });
    run.run();
  }
  document.getElementById('pipeRun').addEventListener('click',play);
  document.getElementById('pipeReset').addEventListener('click',reset);
  build();
})();
(function windowLab(){
  var table=document.getElementById('windowTable');if(!table)return;
  var foot=document.getElementById('windowFoot'),lab=document.getElementById('windowLab');
  function groupMode(){
    var r=db.run('SELECT dept_id, COUNT(*) AS headcount, AVG(salary) AS avg_salary FROM employees GROUP BY dept_id ORDER BY dept_id');
    renderDtbl(table,r.columns,r.rows,{keyCol:'dept_id',rowClass:function(){return 'row-new';}});
    foot.innerHTML='<code class="tok">GROUP BY</code> <b>collapses</b> the 9 employees into <b>'+r.rowCount+' rows</b> \u2014 one per department. The individual people are gone.';
  }
  function rankMode(){
    var byDept={};
    EMP.forEach(function(e){ var k=e.dept_id===null?'NULL':e.dept_id; (byDept[k]=byDept[k]||[]).push(e); });
    var ranked={};
    Object.keys(byDept).forEach(function(k){
      var arr=byDept[k].slice().sort(function(a,b){return b.salary-a.salary;});
      var rank=0,prev=null,seen=0;
      arr.forEach(function(e){ seen++; if(e.salary!==prev){rank=seen;prev=e.salary;} ranked[e.id]=rank; });
    });
    var rows=EMP.slice().sort(function(a,b){ var ka=a.dept_id===null?99:a.dept_id, kb=b.dept_id===null?99:b.dept_id; if(ka!==kb)return ka-kb; return b.salary-a.salary; })
      .map(function(e){return [e.name,e.dept_id,e.salary,ranked[e.id]];});
    renderDtbl(table,['name','dept_id','salary','dept_rank'],rows,{rowClass:function(i,row){return row[3]===1?'row-match':'';}});
    foot.innerHTML='<code class="tok">RANK() OVER (PARTITION BY dept_id ...)</code> <b>keeps all 9 rows</b> and adds a rank that restarts per department. The <span style="color:var(--c-join)">teal</span> rows are each department\u2019s top earner.';
  }
  function runMode(){
    var rows=EMP.slice().sort(function(a,b){return a.hire_date<b.hire_date?-1:(a.hire_date>b.hire_date?1:0);});
    var tot=0;var out=rows.map(function(e){ tot+=e.salary; return [e.name,e.hire_date,e.salary,tot]; });
    renderDtbl(table,['name','hire_date','salary','running_total'],out);
    foot.innerHTML='<code class="tok">SUM(salary) OVER (ORDER BY hire_date)</code> keeps every row and accumulates \u2014 a <b>running total</b> of payroll as each person was hired.';
  }
  var modes={group:groupMode,rank:rankMode,runtotal:runMode};
  [].forEach.call(lab.querySelectorAll('[data-wm]'),function(b){
    b.addEventListener('click',function(){
      [].forEach.call(lab.querySelectorAll('[data-wm]'),function(x){x.classList.remove('primary');});
      b.classList.add('primary'); modes[b.dataset.wm]();
    });
  });
  groupMode();
})();
(function btree(){
  var svg=document.getElementById('btreeSvg');if(!svg)return;
  function node(x,y,w,h,keys,color,hot){
    svg.appendChild(mk('rect',{x:x,y:y,width:w,height:h,rx:8,fill:hot?'rgba(78,214,107,0.12)':'var(--surface-2)',stroke:hot?C.select:'var(--border-strong)','stroke-width':hot?2:1.5}));
    var n=keys.length,seg=w/n;
    keys.forEach(function(k,i){ if(i>0)svg.appendChild(mk('line',{x1:x+seg*i,y1:y+6,x2:x+seg*i,y2:y+h-6,stroke:'var(--border)','stroke-width':1})); svg.appendChild(svgText(x+seg*i+seg/2,y+h/2+5,k,hot?C.select:C.soft,13,'middle','600')); });
  }
  function link(x1,y1,x2,y2,hot){ svg.appendChild(mk('path',{d:'M'+x1+' '+y1+' C'+x1+' '+((y1+y2)/2)+','+x2+' '+((y1+y2)/2)+','+x2+' '+y2,fill:'none',stroke:hot?C.select:C.lineFaint,'stroke-width':hot?2.4:1.6})); }
  link(330,66,135,128,false);
  link(330,66,330,128,true);
  link(330,66,525,128,false);
  node(270,26,120,40,['30','60'],C.from,false);
  node(80,128,110,40,['10','20'],C.from,false);
  node(275,128,110,40,['40','50'],C.from,true);
  node(470,128,110,40,['70','80'],C.from,false);
  svg.appendChild(svgText(330,18,'index root',C.mut,10.5,'middle','400'));
  svg.appendChild(svgText(135,186,'leaf',C.faint,10,'middle','400'));
  svg.appendChild(svgText(330,186,'leaf (sorted pages)',C.faint,10,'middle','400'));
  svg.appendChild(svgText(525,186,'leaf',C.faint,10,'middle','400'));
  svg.appendChild(svgText(612,52,'find 50',C.select,11,'middle','600'));
  svg.appendChild(mk('path',{d:'M612 60 C612 90,430 100,388 138',fill:'none',stroke:C.select,'stroke-width':1.4,'stroke-dasharray':'4 4'}));
  svg.appendChild(svgText(330,214,'a lookup follows ~log(n) pointers \u2014 here just 2 hops \u2014 instead of scanning every row',C.faint,11,'middle','400',false));
})();
onScroll();
})();