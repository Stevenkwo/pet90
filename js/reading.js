/* PET 90 — Reading: renderers for 6 parts, single-part runner, chooser page */
(function(){
const PP=window.PP, D=window.PET_DATA, h=PP.h, M=()=>PP.PLAN.PART_META;
const READ = PP.READ = {};
READ.getSets = part => D['reading_'+part];
READ.getSet = (part,id) => READ.getSets(part).find(s=>s.id===id);
READ.INSTR = {
  p1:{en:'For each question, choose the correct answer (A, B or C).', zh:'读每段短文本，选出与原文意思一致的一项。先判断它是什么（标牌/短信/邮件），再找核心动作词。'},
  p2:{en:'Decide which text (A–H) would be the most suitable for each person (1–5).', zh:'左边 5 个人各有 3 个条件，右边 8 段短文只有 5 段合适。三条件全满足才能选。'},
  p3:{en:'Read the text and answer the questions. For each question, choose the correct answer (A, B, C or D).', zh:'先读 5 个题干，再读文章。题目顺序 = 文章顺序；注意同义替换。'},
  p4:{en:'Five sentences have been removed from the text. For each gap, choose the correct sentence (A–H). There are three extra sentences.', zh:'看空格前后句的指代词（she / this / them）和连接词（but / though / also）。3 句是多余的。'},
  p5:{en:'For each gap, choose the correct word (A, B, C or D).', zh:'看空格左右各三个词：介词、搭配、词性。四个选项意思相近，考的是搭配。'},
  p6:{en:'For each gap, write ONE word. Write your answers in the gaps.', zh:'一空一个词，考语法小词：冠词、介词、助动词、关系词、连词。填完读整句检查。'}
};
const LET = 'ABCDEFGH';
function optRow(letter, text, onSel){ const el=h('div',{class:'opt'}, h('span',{class:'l'},letter), h('span',{},text)); if(onSel) el.addEventListener('click',()=>onSel(el)); return el; }
function selectIn(group, el){ group.forEach(o=>o.classList.remove('sel')); el.classList.add('sel'); }
function markMC(opts, chosen, correct){ opts.forEach((o,i)=>{ o.classList.remove('sel'); if(i===correct) o.classList.add('correct'); else if(i===chosen) o.classList.add('wrong'); o.style.pointerEvents='none'; }); }
// ---------- Part 1
function renderP1(set, root){
  const items = set.items.map((it,qi)=>{
    const opts = it.options.map((o,i)=>optRow(LET[i], o));
    opts.forEach((o,i)=>o.addEventListener('click',()=>{ selectIn(opts,o); state[qi]=i; }));
    const rw = h('div',{class:'rw '+it.kind}, h('div',{class:'rw-head'}, it.heading), h('div',{}, it.text));
    const box = h('div',{class:'q'}, h('div',{class:'qt'}, h('span',{class:'qn'},qi+1), it.heading), rw, ...opts);
    root.append(box); return {opts, box};
  });
  const state = new Array(set.items.length).fill(null);
  return {
    collect:()=>state.slice(), count:set.items.length,
    grade:(ans)=>{ let s=0; const detail=set.items.map((it,i)=>{ const ok=ans[i]===it.answer; if(ok) s++; return {ok, chosen:ans[i], correct:it.answer}; }); return {score:s,total:set.items.length,detail}; },
    showResults:(ans)=>{ set.items.forEach((it,i)=>{ markMC(items[i].opts, ans[i], it.answer); items[i].box.append(h('div',{class:'why'}, h('b',{}, ans[i]===it.answer?'✅ 正确  ':'❌ 错误  '), it.why)); }); }
  };
}
// ---------- Part 2
function renderP2(set, root){
  const state = new Array(5).fill('');
  const sels=[];
  const people = h('div',{class:'people'}, set.people.map((p,i)=>{ const sel=h('select',{class:'gap-sel'}, h('option',{value:''},'— 选择 —'), ...LET.split('').map(L=>h('option',{value:L},L))); sel.addEventListener('change',()=>{ state[i]=sel.value; }); sels.push(sel); return h('div',{class:'person'}, h('div',{class:'nm'}, h('span',{}, h('span',{class:'qn'},i+1), p.name), sel), h('p',{}, p.text)); }));
  const texts = h('div',{class:'texts'}, set.texts.map(t=>h('div',{class:'txt'}, h('b',{}, h('span',{class:'letter'},t.letter), t.title), t.body)));
  root.append(h('div',{class:'two-col'}, h('div',{}, h('h3',{class:'mb'}, set.title), people), h('div',{}, h('h3',{class:'mb'},'Texts A–H'), texts)));
  return {
    collect:()=>state.slice(), count:5,
    grade:(ans)=>{ let s=0; const detail=set.answers.map((a,i)=>{ const ok=ans[i]===a; if(ok) s++; return {ok, chosen:ans[i], correct:a}; }); return {score:s,total:5,detail}; },
    showResults:(ans)=>{ set.answers.forEach((a,i)=>{ const ok=ans[i]===a; sels[i].classList.add(ok?'correct':'wrong'); sels[i].disabled=true; sels[i].parentElement.parentElement.append(h('div',{class:'why'}, h('b',{}, ok?'✅ ':'❌ 正确答案 '+a+'  '), set.why[i])); }); }
  };
}
// ---------- Part 3
function renderP3(set, root){
  const state = new Array(set.questions.length).fill(null);
  const qs = set.questions.map((q,qi)=>{ const opts=q.options.map((o,i)=>optRow(LET[i],o)); opts.forEach((o,i)=>o.addEventListener('click',()=>{ selectIn(opts,o); state[qi]=i; })); const box=h('div',{class:'q'}, h('div',{class:'qt'}, h('span',{class:'qn'},qi+1), q.q), ...opts); return {opts, box}; });
  const passage = h('article',{class:'passage'}, h('h2',{},set.title), ...set.paragraphs.map(p=>h('p',{},p)));
  root.append(h('div',{class:'two-col'}, h('div',{class:'card'}, passage), h('div',{}, ...qs.map(q=>q.box))));
  return {
    collect:()=>state.slice(), count:set.questions.length,
    grade:(ans)=>{ let s=0; const detail=set.questions.map((q,i)=>{ const ok=ans[i]===q.answer; if(ok) s++; return {ok, chosen:ans[i], correct:q.answer}; }); return {score:s,total:set.questions.length,detail}; },
    showResults:(ans)=>{ set.questions.forEach((q,i)=>{ markMC(qs[i].opts, ans[i], q.answer); qs[i].box.append(h('div',{class:'why'}, h('b',{}, ans[i]===q.answer?'✅ ':'❌ 正确答案 '+LET[q.answer]+'  '), q.why)); }); }
  };
}
// ---------- Part 4
function renderP4(set, root){
  const state = new Array(5).fill(''); const sels=[]; const lis=[];
  const parts = set.text.split(/(\[\[\d\]\])/);
  const textEl = h('article',{class:'passage'}, h('h2',{},set.title));
  let para = h('p');
  const refreshUsed = ()=>{ const used=new Set(state.filter(Boolean)); lis.forEach((li,i)=>li.classList.toggle('used', used.has(LET[i]))); };
  parts.forEach(seg=>{ const m=seg.match(/^\[\[(\d)\]\]$/); if(m){ const n=+m[1]; const sel=h('select',{class:'gap-sel'}, h('option',{value:''},n), ...LET.split('').map(L=>h('option',{value:L},L))); sel.addEventListener('change',()=>{ state[n-1]=sel.value; refreshUsed(); }); sels[n-1]=sel; para.append(h('span',{class:'gapnum'},n), sel); } else { const chunks=seg.split('\n\n'); chunks.forEach((c,i)=>{ if(i>0){ textEl.append(para); para=h('p'); } para.append(c); }); } });
  textEl.append(para);
  const list = h('ol',{class:'sent-list'}, set.sentences.map((s,i)=>{ const li=h('li',{}, h('b',{},LET[i]), s); lis.push(li); return li; }));
  root.append(h('div',{class:'two-col'}, h('div',{class:'card'}, textEl), h('div',{class:'sticky'}, h('h3',{class:'mb'},'Sentences A–H（3 句多余）'), list)));
  return {
    collect:()=>state.slice(), count:5,
    grade:(ans)=>{ let s=0; const detail=set.answers.map((a,i)=>{ const ok=ans[i]===a; if(ok) s++; return {ok, chosen:ans[i], correct:a}; }); return {score:s,total:5,detail}; },
    showResults:(ans)=>{ const box=h('div',{class:'card mt'}, h('h3',{class:'mb'},'解析')); set.answers.forEach((a,i)=>{ const ok=ans[i]===a; sels[i].classList.add(ok?'correct':'wrong'); sels[i].disabled=true; box.append(h('div',{class:'why'}, h('b',{}, (ok?'✅ ':'❌ ')+`[${i+1}] 正确答案 ${a}  `), set.why[i])); }); root.append(box); }
  };
}
// ---------- Part 5
function renderP5(set, root){
  const state = new Array(set.gaps.length).fill(null); const badges=[]; const qboxes=[];
  const textEl = h('article',{class:'passage'}, h('h2',{},set.title));
  let para=h('p');
  set.text.split(/(\[\[\d\]\])/).forEach(seg=>{ const m=seg.match(/^\[\[(\d)\]\]$/); if(m){ const n=+m[1]; const b=h('span',{class:'gap-sel'}, '…'); badges[n-1]=b; para.append(h('span',{class:'gapnum'},n), b); } else { seg.split('\n\n').forEach((c,i)=>{ if(i>0){ textEl.append(para); para=h('p'); } para.append(c); }); } });
  textEl.append(para);
  const qs = set.gaps.map((g,gi)=>{ const opts=g.options.map((o,i)=>optRow(LET[i],o)); opts.forEach((o,i)=>o.addEventListener('click',()=>{ selectIn(opts,o); state[gi]=i; badges[gi].textContent=g.options[i]; })); const box=h('div',{class:'q'}, h('div',{class:'qt'}, h('span',{class:'qn'},gi+1)), h('div',{class:'cloze-opts'}, ...opts)); qboxes.push(box); return {opts, box}; });
  root.append(h('div',{class:'two-col'}, h('div',{class:'card'}, textEl), h('div',{}, ...qs.map(q=>q.box))));
  return {
    collect:()=>state.slice(), count:set.gaps.length,
    grade:(ans)=>{ let s=0; const detail=set.gaps.map((g,i)=>{ const ok=ans[i]===g.answer; if(ok) s++; return {ok, chosen:ans[i], correct:g.answer}; }); return {score:s,total:set.gaps.length,detail}; },
    showResults:(ans)=>{ set.gaps.forEach((g,i)=>{ markMC(qs[i].opts, ans[i], g.answer); const ok=ans[i]===g.answer; badges[i].textContent=g.options[g.answer]; badges[i].classList.add(ok?'correct':'wrong'); qs[i].box.append(h('div',{class:'why'}, h('b',{}, ok?'✅ ':'❌ '), g.why)); }); }
  };
}
// ---------- Part 6
const norm = s => String(s||'').toLowerCase().trim().replace(/[.,!?;:"“”]+$/,'').replace(/^["“”']+/,'').replace(/’/g,"'");
function renderP6(set, root){
  const inputs=[];
  const textEl = h('article',{class:'passage'}, h('h2',{},set.title));
  let para=h('p');
  set.text.split(/(\[\[\d\]\])/).forEach(seg=>{ const m=seg.match(/^\[\[(\d)\]\]$/); if(m){ const n=+m[1]; const inp=h('input',{class:'gap-in', type:'text', autocomplete:'off', spellcheck:'false', placeholder:String(n)}); inputs[n-1]=inp; para.append(h('span',{class:'gapnum'},n), inp); } else { seg.split('\n\n').forEach((c,i)=>{ if(i>0){ textEl.append(para); para=h('p'); } c.split('\n').forEach((line,j)=>{ if(j>0) para.append(h('br')); para.append(line); }); }); } });
  textEl.append(para);
  root.append(h('div',{class:'card'}, textEl));
  return {
    collect:()=>inputs.map(i=>i.value), count:set.answers.length,
    grade:(ans)=>{ let s=0; const detail=set.answers.map((acc,i)=>{ const ok=acc.map(norm).includes(norm(ans[i])); if(ok) s++; return {ok, chosen:ans[i], correct:acc[0]}; }); return {score:s,total:set.answers.length,detail}; },
    showResults:(ans)=>{ const box=h('div',{class:'card mt'}, h('h3',{class:'mb'},'解析')); set.answers.forEach((acc,i)=>{ const ok=acc.map(norm).includes(norm(ans[i])); inputs[i].classList.add(ok?'correct':'wrong'); inputs[i].disabled=true; if(!ok) inputs[i].value = (ans[i]?ans[i]+' → ':'')+acc[0]; box.append(h('div',{class:'why'}, h('b',{}, (ok?'✅ ':'❌ ')+`[${i+1}] ${acc.join(' / ')}  `), set.why[i])); }); root.append(box); }
  };
}
READ.renderPart = (part, set, root, opts) => ({p1:renderP1,p2:renderP2,p3:renderP3,p4:renderP4,p5:renderP5,p6:renderP6}[part])(set, root, opts||{});
READ.resultsFor = (part, setId) => PP.state.results.filter(r=>r.part===part && (!setId || r.setId===setId));
READ.best = (part, setId) => { const rs=READ.resultsFor(part,setId); if(!rs.length) return null; return Math.max(...rs.map(r=>Math.round(r.score/r.total*100))); };
READ.recentAvg = (part, n=3) => { const rs=READ.resultsFor(part).slice(-n); if(!rs.length) return null; return Math.round(rs.reduce((a,r)=>a+r.score/r.total,0)/rs.length*100); };
READ.scoreClass = pct => pct>=85?'good':pct>=70?'mid':'bad';
// ---------- runner
READ.run = ({part, setId, mode='free', day=null, onDone=null, back=null}) => {
  const set = READ.getSet(part, setId), meta = M()[part], c = PP.main; c.innerHTML='';
  const timer = PP.timerEl();
  const head = h('div',{class:'runner-head'}, h('div',{}, h('div',{class:'row gap'}, h('span',{class:'pill read'},'Reading '+meta.name), h('span',{class:'pill'}, meta.zh), mode==='daily'?h('span',{class:'pill accent'},'今日任务'):null), h('h2',{class:'mt', style:'margin-top:6px'}, set.title||meta.zh)), h('div',{class:'row gap'}, h('span',{class:'small muted'}, `建议 ${meta.minutes} 分钟`), timer.el, h('button',{class:'btn btn-ghost btn-sm', on:{click:()=>leave()}},'退出')));
  const instr = h('div',{class:'instr'}, h('b',{}, READ.INSTR[part].en), h('div',{class:'small muted mt', style:'margin-top:4px'}, READ.INSTR[part].zh));
  const body = h('div');
  const submit = h('button',{class:'btn btn-read btn-lg'},'提交答案 ✓');
  const foot = h('div',{class:'row gap mt2'}, submit);
  c.append(head, instr, body, foot);
  const ctrl = READ.renderPart(part, set, body);
  timer.start(meta.minutes*60);
  function leave(){ timer.stop(); if(back) PP.navigate(back.page, back.params); else PP.navigate(mode==='daily'?'today':'reading', mode==='daily'?{day}:{}); }
  submit.addEventListener('click', ()=>{
    const ans = ctrl.collect(); const blank = ans.filter(a=>a===null||a==='').length;
    const go = ()=>{
      const secs = timer.stop(); const g = ctrl.grade(ans); const pct = Math.round(g.score/g.total*100);
      const rec = {ts:Date.now(), day, mode, part, setId, score:g.score, total:g.total, secs:Math.round(secs), wrong:g.detail.map((d,i)=>d.ok?null:i).filter(x=>x!==null), answers:ans.map(a=>a===null||a===undefined?'':a)};
      // 订正标记：这一题以前错过（本机记录或合并进来的都算），这次做对 → 标为已订正
      const everWrong = new Set();
      for (const r of PP.state.results) if (r.part===part && r.setId===setId && r.wrong) for (const wi of r.wrong) everWrong.add(wi);
      g.detail.forEach((d,i)=>{ const k=`${part}|${setId}|${i}`;
        if (!d.ok) { PP.state.fixed[k]=0; }
        else if (everWrong.has(i) || PP.state.fixed[k]!==undefined) { PP.state.fixed[k]=Date.now(); }
      });
      PP.state.results.push(rec); PP.save();
      const xp = 20 + Math.round(pct/100*20); PP.addXP(xp, `阅读 ${meta.name}`);
      ctrl.showResults(ans); submit.remove();
      const est = pct>=90?'🏆 Distinction 水平':pct>=85?'🥈 Merit 水平':pct>=70?'✅ 通过线以上':pct>=55?'⚠️ 接近及格线':'📚 继续打基础';
      const box = h('div',{class:'result-box'}, h('div',{class:'big'}, `${g.score}`, h('small',{},` / ${g.total}`)), h('div',{}, h('div',{class:'bold', style:'font-size:18px'}, `${pct}% · ${est}`), h('div',{class:'small', style:'opacity:.8'}, `用时 ${PP.fmtTime(secs)}（建议 ${meta.minutes} 分钟）· +${xp} XP`)));
      foot.append(box);
      const btns = h('div',{class:'row gap wrap'});
      if (onDone) btns.append(h('button',{class:'btn btn-primary btn-lg', on:{click:()=>{ onDone(rec); }}},'完成，返回今日 →'));
      else btns.append(h('button',{class:'btn btn-primary btn-lg', on:{click:()=>leave()}},'返回'));
      btns.append(h('button',{class:'btn', on:{click:()=>READ.run({part,setId,mode,day,onDone,back})}},'再做一次'));
      const sets=READ.getSets(part); const idx=sets.findIndex(s=>s.id===setId); if(mode!=='daily' && idx<sets.length-1) btns.append(h('button',{class:'btn', on:{click:()=>READ.run({part,setId:sets[idx+1].id,mode,back})}},'下一组 →'));
      if (meta.lesson) btns.append(h('button',{class:'btn btn-ghost', on:{click:()=>PP.navigate('lessons',{id:meta.lesson})}},'📚 看这部分的方法'));
      foot.append(btns); box.scrollIntoView({behavior:'smooth', block:'center'});
    };
    if (blank>0) PP.confirm(`还有 ${blank} 题没作答，确定提交吗？`, go); else go();
  });
};
// ---------- chooser page
PP.pages.reading = (c, params={}) => {
  if (params.part){ return setList(c, params.part); }
  c.append(PP.pageHead('阅读训练', '六个部分，每部分限时练习。做完立刻看解析，记下自己的“陷阱类型”。'));
  const grid = h('div',{class:'grid3'});
  for (const part of ['p1','p2','p3','p4','p5','p6']){
    const m=M()[part], sets=READ.getSets(part), rs=READ.resultsFor(part), avg=READ.recentAvg(part);
    grid.append(h('div',{class:'card part-card', on:{click:()=>PP.navigate('reading',{part})}}, h('div',{class:'row between'}, h('h3',{}, `${m.name} · ${m.zh}`), h('span',{class:'pill read'}, `${sets.length} 组`)), h('div',{class:'desc'}, m.desc), h('div',{class:'row between'}, h('span',{class:'small muted'}, rs.length?`已练 ${rs.length} 次`:'还没练过'), avg!==null?h('span',{class:'score '+READ.scoreClass(avg)}, `最近 ${avg}%`):h('span',{class:'small muted'},'—'))));
  }
  c.append(grid);
  c.append(h('div',{class:'row gap mt'}, h('button',{class:'btn btn-read', on:{click:()=>{ const part=['p1','p2','p3','p4','p5','p6'][PP.rand(6)]; const sets=READ.getSets(part); READ.run({part, setId:sets[PP.rand(sets.length)].id, mode:'free'}); }}},'🎲 随机来一组'), h('button',{class:'btn', on:{click:()=>PP.navigate('lessons')}},'📚 先看阅读方法')));
};
function setList(c, part){
  const m=M()[part], sets=READ.getSets(part);
  c.append(PP.pageHead(`${m.name} · ${m.zh}`, m.desc, h('div',{class:'row gap'}, h('button',{class:'btn', on:{click:()=>PP.navigate('lessons',{id:m.lesson})}},'📚 方法课'), h('button',{class:'btn btn-ghost', on:{click:()=>PP.navigate('reading')}},'← 全部'))));
  const list = h('div',{class:'set-list'});
  sets.forEach((s,i)=>{ const best=READ.best(part,s.id); const n=READ.resultsFor(part,s.id).length; list.append(h('div',{class:'set-row', on:{click:()=>READ.run({part,setId:s.id,mode:'free',back:{page:'reading',params:{part}}})}}, h('span',{class:'qn'},i+1), h('span',{class:'t'}, s.title||`第 ${i+1} 组`, h('div',{class:'small muted', style:'font-weight:600'}, `${m.count} 题 · 建议 ${m.minutes} 分钟${n?` · 已做 ${n} 次`:''}`)), best!==null?h('span',{class:'score '+READ.scoreClass(best)}, `最好 ${best}%`):h('span',{class:'pill'},'未做'), h('span',{class:'btn btn-sm btn-read'},'开始'))); });
  c.append(list);
}
})();
