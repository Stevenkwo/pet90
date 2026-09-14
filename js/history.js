/* PET 90 — 记录：错题本 / 口语录音 / 学习日志 */
(function(){
const PP=window.PP, D=window.PET_DATA, h=PP.h;
const H = PP.HIST = {};
const LET='ABCDEFGH';
const PM=()=>PP.PLAN.PART_META, SM=()=>PP.PLAN.SPART_META, LM=()=>PP.PLAN.LPART_META;
const isL = p => /^l[1-4]$/.test(p);
// 阅读/听力统一路由
const META = p => isL(p) ? LM()[p] : PM()[p];
const SETOF = (p,id) => isL(p) ? PP.LISTEN.getSet(p,id) : PP.READ.getSet(p,id);
const RUNOF = (p,id,back) => isL(p) ? PP.LISTEN.run({part:p, setId:id, mode:'review', back}) : PP.READ.run({part:p, setId:id, mode:'review', back});

// ---------- 把一道错题还原成可展示的内容
H.questionOf = (part, setId, i) => {
  const set = SETOF(part, setId); if(!set) return null;
  const T = t => ({title:set.title||META(part).zh, part, setId, index:i, ...t});
  const LT='ABC';
  if (part==='l1'){ const it=set.items[i]; if(!it) return null; return T({q:it.q, body:'', options:it.options.map((o,k)=>LT[k]+'. '+o.emoji+' '+o.label), correct:LT[it.answer], why:it.why, script:it.script, audio:true}); }
  if (part==='l2'){ const it=set.items[i]; if(!it) return null; return T({q:it.q, body:'🔈 '+it.intro, options:it.options.map((o,k)=>LT[k]+'. '+o), correct:LT[it.answer], why:it.why, script:it.script, intro:it.intro, audio:true}); }
  if (part==='l3'){ const g=set.gaps[i]; if(!g) return null; const ln=set.lines.find(l=>l.gap===i);
    return T({q:`笔记空 [${i+1}]　${ln?ln.label:''}`, body:'🔈 '+set.intro, options:null, correct:g.answer[0], why:g.why, script:set.script, intro:set.intro, audio:true}); }
  if (part==='l4'){ const q=set.questions[i]; if(!q) return null; return T({q:q.q, body:'🔈 '+set.intro, options:q.options.map((o,k)=>LT[k]+'. '+o), correct:LT[q.answer], why:q.why, script:set.script, intro:set.intro, audio:true}); }
  if (part==='p1'){ const it=set.items[i]; if(!it) return null; return T({q:it.heading, body:it.text, options:it.options.map((o,k)=>LET[k]+'. '+o), correct:LET[it.answer], why:it.why}); }
  if (part==='p2'){ const p=set.people[i]; if(!p) return null; const a=set.answers[i]; const txt=set.texts.find(t=>t.letter===a);
    return T({q:`把「${p.name}」配到哪一段？`, body:p.text, options:set.texts.map(t=>t.letter+'. '+t.title), correct:a, why:set.why[i], extra:txt?`${a}. ${txt.title}：${txt.body}`:''}); }
  if (part==='p3'){ const q=set.questions[i]; if(!q) return null; return T({q:q.q, body:'', options:q.options.map((o,k)=>LET[k]+'. '+o), correct:LET[q.answer], why:q.why}); }
  if (part==='p4'){ const a=set.answers[i]; return T({q:`空 [${i+1}] 应该填哪一句？`, body:'', options:set.sentences.map((x,k)=>LET[k]+'. '+x), correct:a, why:set.why[i]}); }
  if (part==='p5'){ const g=set.gaps[i]; if(!g) return null; return T({q:`空 [${i+1}]`, body:'', options:g.options.map((o,k)=>LET[k]+'. '+o), correct:LET[g.answer], why:g.why}); }
  if (part==='p6'){ const acc=set.answers[i]; if(!acc) return null; return T({q:`空 [${i+1}]（填一个词）`, body:'', options:null, correct:acc.join(' / '), why:set.why[i]}); }
  return null;
};
H.chosenLabel = (part, rec, i) => {
  if (!rec.answers) return null;
  const a = rec.answers[i]; if (a==='' || a===null || a===undefined) return '（没作答）';
  if (part==='p2' || part==='p4') return String(a);
  if (part==='p6' || part==='l3') return String(a);
  return LET[a] !== undefined ? LET[a] : String(a);
};
// ---------- 错题本：跨所有练习收集，去重取最近一次
H.wrongList = () => {
  const map = new Map();
  for (const r of PP.state.results){
    if (!r.wrong || !r.wrong.length) continue;
    for (const i of r.wrong){
      const key = `${r.part}|${r.setId}|${i}`;
      const prev = map.get(key);
      if (!prev || r.ts > prev.ts) map.set(key, {key, part:r.part, setId:r.setId, index:i, ts:r.ts, day:r.day, rec:r, times:(prev?prev.times:0)+1});
      else prev.times++;
    }
  }
  const out = [];
  for (const v of map.values()){
    const q = H.questionOf(v.part, v.setId, v.index); if(!q) continue;
    const fixedAt = PP.state.fixed[v.key];
    out.push(Object.assign(v, {q, fixed: !!fixedAt, fixedAt}));
  }
  return out.sort((a,b)=>b.ts-a.ts);
};
H.stats = () => {
  const w = H.wrongList();
  const byPart = {};
  for (const x of w){ byPart[x.part] = byPart[x.part] || {total:0, open:0}; byPart[x.part].total++; if(!x.fixed) byPart[x.part].open++; }
  return {total:w.length, open:w.filter(x=>!x.fixed).length, byPart};
};

// ---------- 页面
PP.pages.history = (c, params={}) => {
  const tab = params.tab || 'wrong';
  const tabs = [['wrong','📕 错题本'],['audio','🎧 口语录音'],['log','🗓️ 学习日志']];
  c.append(PP.pageHead('记录', '做过的每一题、说过的每一段，都存在这里。数据只在这台设备上。',
    h('div',{class:'seg'}, ...tabs.map(([k,l])=>h('button',{class:k===tab?'on':'', on:{click:()=>PP.navigate('history',{tab:k})}}, l)))));
  if (tab==='wrong') return wrongBook(c);
  if (tab==='audio') return audioBook(c);
  return logBook(c);
};

function wrongBook(c){
  const list = H.wrongList(), st = H.stats();
  if (!list.length){ c.append(h('div',{class:'card'}, PP.say('还没有错题——要么是还没开始练，要么是全对了！先去做一组阅读吧。','happy',80), h('div',{class:'row gap mt'}, h('button',{class:'btn btn-read', on:{click:()=>PP.navigate('reading')}},'去练阅读')))); return; }
  c.append(h('div',{class:'grid4 mb'},
    h('div',{class:'stat'}, h('div',{class:'v'}, st.total), h('div',{class:'k'},'错过的题（去重后）')),
    h('div',{class:'stat'}, h('div',{class:'v', style:'color:var(--red)'}, st.open), h('div',{class:'k'},'还没订正')),
    h('div',{class:'stat'}, h('div',{class:'v', style:'color:var(--green)'}, st.total-st.open), h('div',{class:'k'},'已订正')),
    h('div',{class:'stat'}, h('div',{class:'v'}, Object.keys(st.byPart).length?Object.entries(st.byPart).sort((a,b)=>b[1].open-a[1].open)[0][0].toUpperCase():'—'), h('div',{class:'k'},'最弱的部分'))));
  const parts = Object.keys(st.byPart);
  let filter='open', partFilter='';
  const bar = h('div',{class:'row between wrap gap mb'});
  const body = h('div');
  const segF = h('div',{class:'seg'}, ...[['open','只看没订正'],['all','全部'],['fixed','已订正']].map(([k,l])=>h('button',{class:k==='open'?'on':'', on:{click:e=>{ filter=k; segF.querySelectorAll('button').forEach(b=>b.classList.remove('on')); e.target.classList.add('on'); render(); }}}, l)));
  const segP = h('div',{class:'seg'}, h('button',{class:'on', on:{click:e=>{ partFilter=''; segP.querySelectorAll('button').forEach(b=>b.classList.remove('on')); e.target.classList.add('on'); render(); }}},'全部题型'),
    ...parts.map(p=>h('button',{on:{click:e=>{ partFilter=p; segP.querySelectorAll('button').forEach(b=>b.classList.remove('on')); e.target.classList.add('on'); render(); }}}, (isL(p)?'听力':'阅读')+META(p).name.replace('Part ','P'))));
  bar.append(h('div',{class:'row gap wrap'}, segF, segP), h('button',{class:'btn btn-read', on:{click:()=>retryWorst()}},'🔁 重做最弱的一组'));
  c.append(bar, body);
  function retryWorst(){
    const open = list.filter(x=>!x.fixed); if(!open.length){ PP.toast('没有待订正的错题 🎉'); return; }
    const count={}; for(const x of open) count[`${x.part}|${x.setId}`]=(count[`${x.part}|${x.setId}`]||0)+1;
    const [k] = Object.entries(count).sort((a,b)=>b[1]-a[1])[0];
    const [part,setId]=k.split('|');
    RUNOF(part, setId, {page:'history',params:{tab:'wrong'}});
  }
  function render(){
    body.innerHTML='';
    let rows = list.filter(x=> filter==='all' ? true : filter==='fixed' ? x.fixed : !x.fixed);
    if (partFilter) rows = rows.filter(x=>x.part===partFilter);
    if (!rows.length){ body.append(h('div',{class:'empty'},'这个筛选下没有题目')); return; }
    for (const x of rows){
      const q=x.q, chosen=H.chosenLabel(x.part, x.rec, x.index);
      const card=h('div',{class:'card tight', style:x.fixed?'border-color:var(--green-l);background:var(--green-xl)':''});
      card.append(h('div',{class:'row between wrap gap mb'},
        h('div',{class:'row gap wrap'}, h('span',{class:isL(x.part)?'pill listen':'pill read'}, (isL(x.part)?'听力 ':'阅读 ')+META(x.part).name+' '+META(x.part).zh), h('span',{class:'pill'}, q.title), x.times>1?h('span',{class:'pill bad'}, `错了 ${x.times} 次`):null, x.fixed?h('span',{class:'pill ok'},'✓ 已订正'):h('span',{class:'pill warn'},'待订正')),
        h('span',{class:'small muted'}, new Date(x.ts).toLocaleDateString('zh-CN',{month:'numeric',day:'numeric'}) + (x.day?` · Day ${x.day}`:''))));
      card.append(h('div',{class:'bold mb'}, q.q));
      if (q.body) card.append(h('div',{class:'rw notice', style:'margin-bottom:10px'}, q.body));
      if (q.options){ const box=h('div',{style:'margin-bottom:8px'}); q.options.forEach(o=>{ const L=o.slice(0,1); const isC=L===q.correct||q.correct.indexOf(L)===0; const isX=chosen && L===chosen.slice(0,1) && !isC; box.append(h('div',{class:'opt'+(isC?' correct':isX?' wrong':''), style:'cursor:default;margin-bottom:4px'}, h('span',{}, o), isC?h('span',{class:'pill ok', style:'margin-left:auto'},'正确'):isX?h('span',{class:'pill bad', style:'margin-left:auto'},'你选的'):null)); }); card.append(box); }
      else card.append(h('div',{class:'row gap mb'}, h('span',{class:'pill ok'}, '正确答案：'+q.correct), chosen?h('span',{class:'pill bad'}, '你填的：'+chosen):null));
      card.append(h('div',{class:'why'}, h('b',{},'为什么　'), q.why||''));
      if (q.script){ const pl=PP.LISTEN.player({script:q.script, intro:q.intro, compact:true}); card.append(h('div',{class:'row gap mt'}, h('span',{class:'small muted'},'再听一遍：'), pl.el)); card.append(h('details',{class:'script-box'}, h('summary',{},'📄 听力原文'), h('div',{class:'script-body'}, ...(q.intro?[h('p',{class:'nar'},q.intro)]:[]), ...q.script.map(l=>h('p',{}, h('b',{class:'sp sp-'+l.sp}, l.sp==='F'?'女':l.sp==='M'?'男':'旁白'), l.t))))); }
      const notes = PP.state.notes[x.key]||'';
      const ta = h('textarea',{class:'transcript', rows:'2', placeholder:'写点笔记（比如：又掉进"条件当事实"的坑）', style:'margin-top:10px'}); ta.value=notes;
      ta.addEventListener('change',()=>{ if(ta.value.trim()) PP.state.notes[x.key]=ta.value.trim(); else delete PP.state.notes[x.key]; PP.save(); PP.toast('笔记已保存'); });
      card.append(ta);
      card.append(h('div',{class:'row gap mt'},
        h('button',{class:'btn btn-sm '+(isL(x.part)?'btn-listen':'btn-read'), on:{click:()=>RUNOF(x.part, x.setId, {page:'history',params:{tab:'wrong'}})}}, isL(x.part)?'重听这一组':'重做这一组'),
        h('button',{class:'btn btn-sm', on:{click:()=>{ PP.state.fixed[x.key]=x.fixed?0:Date.now(); PP.save(); PP.navigate('history',{tab:'wrong'}); }}}, x.fixed?'标为待订正':'✓ 标为已订正'),
        h('button',{class:'btn btn-sm btn-ghost', on:{click:()=>PP.navigate('lessons',{id:META(x.part).lesson})}},'📚 看方法')));
      body.append(card);
    }
  }
  render();
}

function audioBook(c){
  const box=h('div'); c.append(box);
  box.append(h('div',{class:'empty'},'读取录音中…'));
  PP.audio.list().then(clips=>{
    box.innerHTML='';
    const sessions = PP.state.speaking.slice().reverse();
    const byId = {}; for(const cl of clips) byId[cl.id]=cl;
    const withAudio = sessions.filter(s=>s.audioId&&byId[s.audioId] || (s.audioIds||[]).some(i=>byId[i]));
    box.append(h('div',{class:'grid4 mb'},
      h('div',{class:'stat'}, h('div',{class:'v'}, sessions.length), h('div',{class:'k'},'口语练习段数')),
      h('div',{class:'stat'}, h('div',{class:'v'}, clips.length), h('div',{class:'k'},'存下的录音')),
      h('div',{class:'stat'}, h('div',{class:'v'}, PP.fmtTime(sessions.reduce((a,s)=>a+s.secs,0))), h('div',{class:'k'},'累计开口时长')),
      h('div',{class:'stat'}, h('div',{class:'v'}, (clips.reduce((a,x)=>a+((x.blob&&x.blob.size)||0),0)/1048576).toFixed(1)+'M'), h('div',{class:'k'},'录音占用空间'))));
    if (!sessions.length){ box.append(h('div',{class:'card'}, PP.say('还没有口语记录。去练一次，录音会自动存下来，之后可以回听。','happy',80), h('button',{class:'btn btn-speak mt', on:{click:()=>PP.navigate('speaking')}},'去练口语'))); return; }
    box.append(h('div',{class:'instr'}, '💡 录音只保存最近 80 段，超出会自动删掉最旧的。录音存在浏览器/App 的本地数据库里，导出备份**不含**录音。'));
    for (const s of sessions.slice(0,60)){
      const m=SM()[s.part]; const ids=(s.audioIds&&s.audioIds.length)?s.audioIds:(s.audioId?[s.audioId]:[]);
      const avail=ids.filter(i=>byId[i]);
      const card=h('div',{class:'card tight'});
      card.append(h('div',{class:'row between wrap gap mb'},
        h('div',{class:'row gap wrap'}, h('span',{class:'pill speak'}, m.name+' '+m.zh), h('span',{class:'pill'}, `${s.words} 词 · ${s.secs}s`), h('span',{class:'pill '+(s.score>=4?'ok':s.score>=3?'warn':'bad')}, `估分 ${s.score}/5`), s.self?h('span',{class:'small'},'⭐'.repeat(s.self)):null),
        h('span',{class:'small muted'}, new Date(s.ts).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}) + (s.day?` · Day ${s.day}`:''))));
      const label = titleFor(s);
      if (label) card.append(h('div',{class:'bold mb'}, label));
      card.append(h('div',{class:'transcript'}, s.transcript||'（没有识别到文字）'));
      if (avail.length){
        const row=h('div',{class:'row gap wrap mt'});
        avail.forEach((id,k)=>{ const a=h('audio',{controls:true, style:'height:34px;max-width:100%'}); a.src=URL.createObjectURL(byId[id].blob); row.append(avail.length>1?h('div',{class:'row gap'}, h('span',{class:'pill'},`第${k+1}回合`), a):a); });
        card.append(row);
      } else card.append(h('div',{class:'small muted mt'}, ids.length?'（录音已被清理）':'（这次没有存下录音）'));
      const md = modelFor(s);
      if (md) card.append(h('div',{class:'row gap mt'}, h('button',{class:'btn btn-sm', on:{click:()=>PP.speak(md)}},'🔊 听范例'), h('button',{class:'btn btn-sm btn-ghost', on:{click:()=>{ const p=h('div',{class:'bubble mt'}, md); card.append(p); }}},'看范例文字')));
      box.append(card);
    }
  });
  function titleFor(s){
    if (s.part==='s1'){ const q=D.speaking_p1.find(x=>x.id===s.itemId); return q?q.q:''; }
    if (s.part==='s2'){ const p=D.speaking_p2.find(x=>x.id===s.itemId); return p?`描述照片：${p.scene}`:''; }
    if (s.part==='s3'){ const x=D.speaking_p3.find(x=>x.id===s.itemId); return x?`讨论：${x.theme}`:''; }
    if (s.part==='s4'){ const base=String(s.itemId).replace(/-\d+$/,''); const set=D.speaking_p4.find(x=>x.id===base); const k=+String(s.itemId).split('-').pop(); return set&&set.questions[k]?set.questions[k].q:''; }
    return '';
  }
  function modelFor(s){
    if (s.part==='s1'){ const q=D.speaking_p1.find(x=>x.id===s.itemId); return q&&q.model; }
    if (s.part==='s2'){ const p=D.speaking_p2.find(x=>x.id===s.itemId); return p&&p.model; }
    if (s.part==='s3'){ const x=D.speaking_p3.find(x=>x.id===s.itemId); return x&&x.model; }
    if (s.part==='s4'){ const base=String(s.itemId).replace(/-\d+$/,''); const set=D.speaking_p4.find(x=>x.id===base); const k=+String(s.itemId).split('-').pop(); return set&&set.questions[k]&&set.questions[k].model; }
    return null;
  }
}

function logBook(c){
  const days = {};
  const push=(d,item)=>{ (days[d]=days[d]||[]).push(item); };
  const dkey = ts => { const d=new Date(ts); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  for (const r of PP.state.results){ const set=SETOF(r.part,r.setId);
    if (isL(r.part)){ push(dkey(r.ts), {ts:r.ts, kind:'listening', icon:'🎧', cls:'listen', title:`听力 ${META(r.part).name} · ${set?set.title:r.setId}`, right:`${r.score}/${r.total}`, ok:r.score/r.total>=0.7, sub:`${Math.round(r.score/r.total*100)}%${r.mode==='review'?' · 复盘':''}`}); continue; }
    push(dkey(r.ts), {ts:r.ts, kind:'reading', icon:'📖', cls:'read', title:`阅读 ${PM()[r.part].name} · ${set?set.title||PM()[r.part].zh:r.setId}`, right:`${r.score}/${r.total}`, ok:r.score/r.total>=0.7, sub:`${Math.round(r.score/r.total*100)}%${r.secs?' · '+PP.fmtTime(r.secs):''}${r.mode==='mock'?' · 模考':r.mode==='review'?' · 复盘':''}`}); }
  for (const s of PP.state.speaking){ const m=SM()[s.part]; push(dkey(s.ts), {ts:s.ts, kind:'speaking', icon:'🎙️', cls:'speak', title:`口语 ${m.name} · ${m.zh}`, right:`${s.score}/5`, ok:s.score>=3, sub:`${s.words} 词 · ${s.secs}s${s.audioId||((s.audioIds||[]).length)?' · 🎧 有录音':''}`}); }
  for (const g of PP.state.shoot){ push(dkey(g.ts), {ts:g.ts, kind:'shoot', icon:'🚀', cls:'shoot', title:`单词射击 · 字母 ${g.group}`, right:`${g.score} 分`, ok:g.acc>=70, sub:`命中 ${g.hits} · 准确率 ${g.acc}%${(g.missed||[]).length?' · 漏 '+g.missed.length+' 词':''}`}); }
  for (const m of PP.state.mocks){ push(dkey(m.ts), {ts:m.ts, kind:'mock', icon:'🏆', cls:'mock', title: m.type==='reading'?'阅读全卷模考':'口语完整模拟', right: m.type==='reading'?`${m.score}/${m.total}`:`${m.avg}/5`, ok:true, sub: m.type==='reading'?`${m.pct}% · ${PP.MOCK.estimate(m.pct).band}`:`${m.n} 段 · ${m.words} 词`}); }
  const keys = Object.keys(days).sort().reverse();
  const totalItems = keys.reduce((a,k)=>a+days[k].length,0);
  c.append(h('div',{class:'grid4 mb'},
    h('div',{class:'stat'}, h('div',{class:'v'}, keys.length), h('div',{class:'k'},'练习过的天数')),
    h('div',{class:'stat'}, h('div',{class:'v'}, totalItems), h('div',{class:'k'},'累计完成的项目')),
    h('div',{class:'stat'}, h('div',{class:'v'}, PP.streak()+' 🔥'), h('div',{class:'k'},'当前连续天数')),
    h('div',{class:'stat'}, h('div',{class:'v'}, PP.state.xp), h('div',{class:'k'},'累计 XP'))));
  if (!keys.length){ c.append(h('div',{class:'card'}, PP.say('日志还是空的。做完今天的任务，这里就会有记录了。','happy',80), h('button',{class:'btn btn-primary mt', on:{click:()=>PP.navigate('today')}},'去做今日任务'))); return; }
  const start=PP.state.profile.start;
  for (const k of keys){
    const items=days[k].sort((a,b)=>b.ts-a.ts);
    const dayNo = start ? PP.daysBetween(start,k)+1 : null;
    const box=h('div',{class:'card tight'});
    box.append(h('div',{class:'row between wrap gap mb'}, h('h3',{}, PP.fmtDate(k), dayNo&&dayNo>=1?h('span',{class:'pill', style:'margin-left:8px'}, `Day ${dayNo}`):null), h('span',{class:'small muted'}, `${items.length} 项`)));
    const list=h('div',{class:'set-list'});
    for (const it of items){
      list.append(h('div',{class:'set-row', style:'cursor:default'},
        h('span',{class:'task-ic ic '+it.cls, style:'width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-size:18px;flex:none;background:var(--'+({read:'blue',listen:'purple',speak:'orange',shoot:'green',mock:'red'}[it.cls]||'blue')+'-l)'}, it.icon),
        h('span',{class:'t'}, it.title, h('div',{class:'small muted', style:'font-weight:600'}, it.sub)),
        h('span',{class:'score '+(it.ok?'good':'bad')}, it.right),
        h('span',{class:'small muted'}, new Date(it.ts).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}))));
    }
    box.append(list); c.append(box);
  }
}
})();
