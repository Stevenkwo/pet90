/* PET 90 — 听力：四个部分 + TTS 双人播放器 */
(function(){
const PP=window.PP, D=window.PET_DATA, h=PP.h;
const LIS = PP.LISTEN = {};
const LET='ABC';

LIS.getSets = part => D['listening_'+part] || [];
LIS.getSet = (part,id) => LIS.getSets(part).find(s=>s.id===id);

LIS.INSTR = {
  l1:'听 7 段短对话，每段回答一个问题，三选一。每段可以听两遍——真考也是两遍。',
  l2:'听 6 段互不相关的录音，每段先有情境说明，再选答案。三个选项通常都会被提到，听清"问的是什么"。',
  l3:'听一段较长的独白，把笔记上的空填完整。一空只填一个词或一个数字。',
  l4:'听一段访谈，回答 6 道题。题目顺序和录音顺序一致，多半问观点和原因，不只是细节。'
};

// ---------- 语音挑选：男/女两个不同的声音，优先英式
let VOICE_CACHE=null;
function pickVoices(){
  if (VOICE_CACHE) return VOICE_CACHE;
  const all=(window.speechSynthesis&&speechSynthesis.getVoices())||[];
  if(!all.length) return {M:null,F:null,N:null};
  const en=all.filter(v=>/^en[-_]/i.test(v.lang));
  const gb=en.filter(v=>/en[-_]GB/i.test(v.lang));
  const pool=gb.length>=2?gb:(en.length?en:all);
  const find=names=>pool.find(v=>names.some(n=>v.name.toLowerCase().includes(n)));
  let M=find(['daniel','reed','rocko','arthur','george','oliver','male']);
  let F=find(['sandy','shelley','flo','kate','serena','martha','female','samantha']);
  if(!M) M=pool[0];
  if(!F) F=pool.find(v=>v!==M)||pool[1]||M;
  if(F===M && pool.length>1) F=pool[1];
  VOICE_CACHE={M, F, N:M};
  return VOICE_CACHE;
}
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = ()=>{ VOICE_CACHE=null; };
LIS._voices = pickVoices;
LIS.rate = () => PP.state.profile.listenRate || 0.9;
LIS.setRate = r => { PP.state.profile.listenRate=r; PP.save(); };

// 长句拆成短句：Chrome 对超长 utterance 会中途掐断
function chunk(text){
  if (text.length<=180) return [text];
  const out=[]; let cur='';
  for (const s of text.split(/(?<=[.!?])\s+/)){
    if ((cur+' '+s).trim().length>180 && cur){ out.push(cur.trim()); cur=s; }
    else cur=(cur?cur+' ':'')+s;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
// 顺序朗读；不在中途 cancel，否则队列会断
function speakSequence(lines, {rate, onLine, onEnd}){
  const V=pickVoices(); let stopped=false, idx=0;
  const queue=[];
  lines.forEach((l,li)=>chunk(l.t).forEach((t,ci)=>queue.push({t, sp:l.sp, li, first:ci===0})));
  let keepAlive=null;
  function cleanup(){ if(keepAlive){ clearInterval(keepAlive); keepAlive=null; } }
  function next(){
    if (stopped) return;
    if (idx>=queue.length){ cleanup(); onEnd&&onEnd(); return; }
    const q=queue[idx];
    const u=new SpeechSynthesisUtterance(q.t);
    u.voice = V[q.sp] || V.N || null;
    u.lang = (u.voice&&u.voice.lang) || 'en-GB';
    u.rate = rate; u.pitch = q.sp==='F'?1.06:0.96;
    u.onend = ()=>{ idx++; setTimeout(next, q.first?60:40); };
    u.onerror = ()=>{ idx++; setTimeout(next, 40); };
    if (q.first && onLine) onLine(q.li);
    try { speechSynthesis.speak(u); } catch(e){ idx++; setTimeout(next,40); }
  }
  try{ speechSynthesis.cancel(); }catch(e){}
  // Chrome ~15s 掐断的老毛病：定时 resume 兜住
  keepAlive=setInterval(()=>{ if(!stopped && speechSynthesis.speaking && !speechSynthesis.paused){ try{ speechSynthesis.pause(); speechSynthesis.resume(); }catch(e){} } }, 9000);
  setTimeout(next, 120);
  return { stop(){ stopped=true; cleanup(); try{ speechSynthesis.cancel(); }catch(e){} } };
}

// ---------- 播放器组件
LIS.player = ({script, intro, compact=false, onPlayed=null}) => {
  let handle=null, plays=0, playing=false;
  const lines = intro ? [{sp:'N', t:intro}].concat(script) : script.slice();
  const count = h('span',{class:'play-count'},'未播放');
  const btn = h('button',{class:'btn btn-lg btn-listen play-btn'}, h('span',{class:'pi'},'▶'), h('span',{class:'pl'}, compact?'播放':'播放录音'));
  const wave = h('div',{class:'wave'}, ...Array.from({length:14},()=>h('i')));
  const el = h('div',{class:'player'+(compact?' compact':'')}, h('div',{class:'row gap center'}, btn, wave, count));
  function setPlaying(on){
    playing=on; el.classList.toggle('on', on);
    btn.querySelector('.pi').textContent = on?'■':'▶';
    btn.querySelector('.pl').textContent = on?'停止':(plays?'再听一遍':(compact?'播放':'播放录音'));
  }
  function stop(){ if(handle) handle.stop(); handle=null; setPlaying(false); }
  btn.addEventListener('click', ()=>{
    if (playing){ stop(); return; }
    document.querySelectorAll('.player.on .play-btn').forEach(b=>{ if(b!==btn) b.click(); });
    setPlaying(true);
    handle = speakSequence(lines, { rate:LIS.rate(),
      onEnd:()=>{ plays++; count.textContent=`已听 ${plays} 遍`; count.classList.toggle('twice', plays>=2); setPlaying(false); onPlayed&&onPlayed(plays); } });
  });
  return { el, stop, get plays(){ return plays; } };
};
// 速度条
LIS.speedBar = () => {
  const opts=[['0.75','慢'],['0.9','正常'],['1','原速']];
  const seg=h('div',{class:'seg small-seg'}, ...opts.map(([v,l])=>h('button',{class:String(LIS.rate())===v?'on':'', on:{click:e=>{ LIS.setRate(+v); seg.querySelectorAll('button').forEach(b=>b.classList.remove('on')); e.target.classList.add('on'); }}}, l)));
  return h('div',{class:'row gap center wrap'}, h('span',{class:'small muted'},'语速'), seg, h('span',{class:'small muted'},'· 听不清就调慢，考前练回原速'));
};

// ---------- 答案比对（Part 3 填空）
const norm = s => String(s||'').toLowerCase().trim().replace(/[.,!?;:'"]/g,'').replace(/\s+/g,' ');
LIS.checkGap = (input, answers) => { const v=norm(input); return answers.some(a=>norm(a)===v); };

function optRow(letter, text){ return h('div',{class:'opt'}, h('span',{class:'letter'},letter), h('span',{},text)); }
function selectIn(list, el){ list.forEach(o=>o.classList.remove('sel')); el.classList.add('sel'); }

// ---------- Part 1：短对话 + 图标三选一
function renderL1(set, root){
  const state=new Array(set.items.length).fill(null); const players=[]; const boxes=[];
  set.items.forEach((it,qi)=>{
    const p=LIS.player({script:it.script, compact:true}); players.push(p);
    const cards=it.options.map((o,i)=>h('div',{class:'pic-opt'}, h('div',{class:'pe'},o.emoji), h('div',{class:'pl'}, LET[i]+'. '+o.label)));
    cards.forEach((c,i)=>c.addEventListener('click',()=>{ cards.forEach(x=>x.classList.remove('sel')); c.classList.add('sel'); state[qi]=i; }));
    const box=h('div',{class:'q lq'}, h('div',{class:'qt'}, h('span',{class:'qn'},qi+1), it.q), p.el, h('div',{class:'pic-opts'}, ...cards));
    boxes.push({box, cards}); root.append(box);
  });
  return { answers:()=>state, stop:()=>players.forEach(p=>p.stop()),
    grade(ans){ const detail=set.items.map((it,i)=>({ok:ans[i]===it.answer, correct:it.answer, chosen:ans[i]}));
      detail.forEach((d,i)=>{ const {cards}=boxes[i]; cards.forEach((c,k)=>{ c.classList.remove('sel'); if(k===set.items[i].answer) c.classList.add('correct'); else if(k===ans[i]) c.classList.add('wrong'); });
        boxes[i].box.append(h('div',{class:'why'}, h('b',{},'为什么　'), set.items[i].why), scriptBox(set.items[i].script)); });
      return {score:detail.filter(d=>d.ok).length, total:detail.length, detail}; } };
}
// ---------- Part 2：情境 + 文字三选一
function renderL2(set, root){
  const state=new Array(set.items.length).fill(null); const players=[]; const boxes=[];
  set.items.forEach((it,qi)=>{
    const p=LIS.player({script:it.script, intro:it.intro, compact:true}); players.push(p);
    const opts=it.options.map((o,i)=>optRow(LET[i],o));
    opts.forEach((o,i)=>o.addEventListener('click',()=>{ selectIn(opts,o); state[qi]=i; }));
    const box=h('div',{class:'q lq'}, h('div',{class:'lead'}, '🔈 '+it.intro), h('div',{class:'qt'}, h('span',{class:'qn'},qi+1), it.q), p.el, ...opts);
    boxes.push({box,opts}); root.append(box);
  });
  return { answers:()=>state, stop:()=>players.forEach(p=>p.stop()),
    grade(ans){ const detail=set.items.map((it,i)=>({ok:ans[i]===it.answer, correct:it.answer, chosen:ans[i]}));
      detail.forEach((d,i)=>{ const {opts}=boxes[i]; opts.forEach((o,k)=>{ o.classList.remove('sel'); if(k===set.items[i].answer) o.classList.add('correct'); else if(k===ans[i]) o.classList.add('wrong'); });
        boxes[i].box.append(h('div',{class:'why'}, h('b',{},'为什么　'), set.items[i].why), scriptBox(set.items[i].script, set.items[i].intro)); });
      return {score:detail.filter(d=>d.ok).length, total:detail.length, detail}; } };
}
// ---------- Part 3：独白 + 笔记填空
function renderL3(set, root){
  const inputs=[];
  const p=LIS.player({script:set.script, intro:set.intro});
  const note=h('div',{class:'note-card'}, h('div',{class:'note-head'}, h('span',{class:'ni'}, set.noteIcon||'📝'), set.noteTitle));
  set.lines.forEach(l=>{
    const row=h('div',{class:'note-line'}, h('span',{class:'nl'}, l.label));
    if (l.gap!==undefined){
      const wrap=h('span',{class:'nv'});
      if (l.prefix) wrap.append(h('span',{class:'fix'}, l.prefix));
      const inp=h('input',{class:'gap-input', type:'text', autocomplete:'off', spellcheck:'false', placeholder:'…'});
      inputs[l.gap]=inp; wrap.append(h('span',{class:'gnum'}, l.gap+1), inp);
      if (l.suffix) wrap.append(h('span',{class:'fix'}, l.suffix));
      row.append(wrap);
    } else row.append(h('span',{class:'nv fixed'}, l.fixed||''));
    note.append(row);
  });
  root.append(h('div',{class:'card tight'}, p.el, LIS.speedBar()), note);
  return { answers:()=>inputs.map(i=>i.value), stop:()=>p.stop(),
    grade(ans){ const detail=set.gaps.map((g,i)=>({ok:LIS.checkGap(ans[i],g.answer), correct:g.answer[0], chosen:ans[i]}));
      detail.forEach((d,i)=>{ const inp=inputs[i]; inp.disabled=true; inp.classList.add(d.ok?'ok':'bad');
        if(!d.ok) inp.parentNode.append(h('span',{class:'fix corr'},'→ '+set.gaps[i].answer[0])); });
      root.append(h('div',{class:'card tight'}, h('h3',{class:'mb'},'逐空解析'), ...set.gaps.map((g,i)=>h('div',{class:'why'}, h('b',{},`空 ${i+1} · ${g.answer[0]}　`), g.why))), scriptBox(set.script, set.intro));
      return {score:detail.filter(d=>d.ok).length, total:detail.length, detail}; } };
}
// ---------- Part 4：访谈 + 6 道三选一
function renderL4(set, root){
  const state=new Array(set.questions.length).fill(null); const boxes=[];
  const p=LIS.player({script:set.script, intro:set.intro});
  root.append(h('div',{class:'card tight'}, h('div',{class:'lead'}, '🔈 '+set.intro), p.el, LIS.speedBar()));
  set.questions.forEach((q,qi)=>{
    const opts=q.options.map((o,i)=>optRow(LET[i],o));
    opts.forEach((o,i)=>o.addEventListener('click',()=>{ selectIn(opts,o); state[qi]=i; }));
    const box=h('div',{class:'q lq'}, h('div',{class:'qt'}, h('span',{class:'qn'},qi+1), q.q), ...opts);
    boxes.push({box,opts}); root.append(box);
  });
  return { answers:()=>state, stop:()=>p.stop(),
    grade(ans){ const detail=set.questions.map((q,i)=>({ok:ans[i]===q.answer, correct:q.answer, chosen:ans[i]}));
      detail.forEach((d,i)=>{ const {opts}=boxes[i]; opts.forEach((o,k)=>{ o.classList.remove('sel'); if(k===set.questions[i].answer) o.classList.add('correct'); else if(k===ans[i]) o.classList.add('wrong'); });
        boxes[i].box.append(h('div',{class:'why'}, h('b',{},'为什么　'), set.questions[i].why)); });
      root.append(scriptBox(set.script, set.intro));
      return {score:detail.filter(d=>d.ok).length, total:detail.length, detail}; } };
}
// 听力原文（只在判分后出现）
function scriptBox(script, intro){
  const body=h('div',{class:'script-body'});
  if (intro) body.append(h('p',{class:'nar'}, intro));
  script.forEach(l=>body.append(h('p',{}, h('b',{class:'sp sp-'+l.sp}, l.sp==='F'?'女':l.sp==='M'?'男':'旁白'), l.t)));
  const box=h('details',{class:'script-box'}, h('summary',{},'📄 听力原文'), body);
  return box;
}

LIS.renderPart = (part, set, root) => ({l1:renderL1,l2:renderL2,l3:renderL3,l4:renderL4}[part])(set, root);
LIS.resultsFor = (part, setId) => PP.state.results.filter(r=>r.part===part && (!setId || r.setId===setId));
LIS.best = (part, setId) => { const rs=LIS.resultsFor(part,setId); if(!rs.length) return null; return Math.max(...rs.map(r=>Math.round(r.score/r.total*100))); };

// ---------- 一次练习
LIS.run = ({part, setId, mode='free', day=null, onDone=null, back=null}) => {
  const set = LIS.getSet(part, setId), meta = PP.PLAN.LPART_META[part], c = PP.main; c.innerHTML='';
  let ctrl=null, done=false;
  const body = h('div',{class:'qs'});
  const head = h('div',{class:'row between wrap gap mb'},
    h('div',{class:'row gap wrap'}, h('span',{class:'pill listen'},'听力'), h('span',{class:'pill'}, meta.name+' · '+meta.zh), h('span',{class:'pill'}, set.title), mode==='review'?h('span',{class:'pill warn'},'复盘'):null),
    h('div',{class:'row gap'}, LIS.best(part,setId)!==null?h('span',{class:'small muted'},'最好 '+LIS.best(part,setId)+'%'):h('span',{class:'small muted'},'首次'),
      h('button',{class:'btn btn-sm btn-ghost', on:{click:()=>{ if(ctrl) ctrl.stop(); PP.stopSpeak(); back?PP.navigate(back.page,back.params):PP.navigate('listening'); }}},'退出')));
  const instr = h('div',{class:'instr'}, '🎧 ', LIS.INSTR[part], h('span',{class:'muted'},' 判分前不显示原文——先用耳朵。'));
  const submit = h('button',{class:'btn btn-primary btn-lg'},'提交答案 ✓');
  const foot = h('div',{class:'row gap wrap mt'}, submit, h('button',{class:'btn', on:{click:()=>PP.navigate('lessons',{id:meta.lesson})}},'📚 这部分怎么听'));
  c.append(head, instr, body, foot);
  ctrl = LIS.renderPart(part, set, body);
  if (part==='l1'||part==='l2') c.insertBefore(h('div',{class:'card tight'}, LIS.speedBar()), body);
  submit.addEventListener('click', ()=>{
    if (done){ back?PP.navigate(back.page,back.params):PP.navigate('listening'); return; }
    const ans=ctrl.answers();
    const blank = part==='l3' ? ans.filter(a=>!String(a).trim()).length : ans.filter(a=>a===null).length;
    if (blank && !confirm(`还有 ${blank} 题没作答，确定提交吗？`)) return;
    ctrl.stop(); PP.stopSpeak(); done=true;
    const g=ctrl.grade(ans), pct=Math.round(g.score/g.total*100);
    const rec={ts:Date.now(), day, mode, part, setId, score:g.score, total:g.total, secs:0,
      wrong:g.detail.map((d,i)=>d.ok?null:i).filter(x=>x!==null),
      answers:ans.map(a=>a===null||a===undefined?'':a)};
    const everWrong=new Set();
    for (const r of PP.state.results) if (r.part===part && r.setId===setId && r.wrong) for (const wi of r.wrong) everWrong.add(wi);
    g.detail.forEach((d,i)=>{ const k=`${part}|${setId}|${i}`; if(!d.ok) PP.state.fixed[k]=0; else if(everWrong.has(i)||PP.state.fixed[k]!==undefined) PP.state.fixed[k]=Date.now(); });
    PP.state.results.push(rec);
    const xp = 10 + Math.round(pct/100*20);
    PP.addXP(xp); PP.save();
    if (day!=null) PP.PLAN.markDone(day, 'listening:'+setId);
    submit.textContent='完成，返回 →';
    const card=h('div',{class:'result-card '+(pct>=85?'good':pct>=70?'mid':'bad')},
      PP.say(pct>=85?'耳朵很准！':pct>=70?'不错，再多听一遍原文。':'别急，听力是练出来的——把原文跟读一遍。', pct>=70?'happy':'think', 76),
      h('div',{class:'big'}, g.score+' / '+g.total), h('div',{class:'pct'}, pct+'%'), h('div',{class:'small'},'+'+xp+' XP'));
    c.insertBefore(card, body); card.scrollIntoView({behavior:'smooth',block:'center'});
    if (onDone) onDone(rec);
  });
};

// ---------- 列表页
PP.pages.listening = (c, params={}) => {
  const M=PP.PLAN.LPART_META;
  c.append(PP.pageHead('听力训练','PET 听力四个部分。录音由电脑朗读，可调语速、可反复听——真考每段放两遍。'));
  c.append(h('div',{class:'instr'},'🎧 建议：第一遍不看任何文字，只听；答完题再看原文。原文只在判分后出现。'));
  c.append(h('div',{class:'card tight'}, LIS.speedBar()));
  for (const part of ['l1','l2','l3','l4']){
    const m=M[part], sets=LIS.getSets(part);
    const rows=sets.map(s=>{
      const best=LIS.best(part,s.id), n=LIS.resultsFor(part,s.id).length;
      return h('div',{class:'set-row', on:{click:()=>LIS.run({part, setId:s.id})}},
        h('span',{class:'ic listen'},'🎧'), h('span',{class:'t'}, s.title, h('div',{class:'small muted', style:'font-weight:600'}, n?`练过 ${n} 次`:'未练过')),
        best!==null?h('span',{class:'score '+(best>=85?'good':best>=70?'mid':'bad')}, best+'%'):h('span',{class:'small muted'},'—'),
        h('span',{class:'go'},'→'));
    });
    c.append(h('div',{class:'card'},
      h('div',{class:'row between wrap gap mb'}, h('div',{}, h('h3',{}, m.name+' · '+m.zh), h('p',{class:'small muted'}, m.desc)),
        h('button',{class:'btn btn-sm', on:{click:()=>PP.navigate('lessons',{id:m.lesson})}},'📚 方法')),
      h('div',{class:'set-list'}, ...rows)));
  }
};
})();
