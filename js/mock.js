/* PET 90 — Mock exams: full Reading paper (45 min) and full Speaking simulation */
(function(){
const PP=window.PP, D=window.PET_DATA, h=PP.h;
const MOCK = PP.MOCK = {};
const PARTS=['p1','p2','p3','p4','p5','p6'];
MOCK.estimate = pct => pct>=90?{band:'≈ 160+ · Distinction（B2）',cls:'good'}:pct>=85?{band:'≈ 153–159 · Merit',cls:'good'}:pct>=70?{band:'≈ 140–152 · Pass',cls:'mid'}:pct>=60?{band:'≈ 130–139 · 接近及格线',cls:'bad'}:{band:'低于 130 · 继续打基础',cls:'bad'};
MOCK.readingMock = ({day=null, onDone=null}) => {
  const c=PP.main; c.innerHTML='';
  const n = PP.state.mocks.filter(m=>m.type==='reading').length;
  const sets = PARTS.map(p=>{ const s=D['reading_'+p]; return {part:p, set:s[(n*2+3)%s.length]}; });
  const M=PP.PLAN.PART_META; let cur=0; const ctrls=[]; const panes=[]; let submitted=false;
  const cd = PP.countdown(45*60, ()=>{ if(!submitted){ PP.toast('时间到，自动交卷','bad'); submit(); } });
  const tabs=h('div',{class:'row gap wrap mb'});
  const paneWrap=h('div');
  sets.forEach((s,i)=>{ const pane=h('div',{style:i?'display:none':''}); pane.append(h('div',{class:'instr'}, h('b',{}, `Part ${i+1}. `), PP.READ.INSTR[s.part].en)); const body=h('div'); pane.append(body); ctrls.push(PP.READ.renderPart(s.part, s.set, body, {paper:true})); panes.push(pane); paneWrap.append(pane); tabs.append(h('button',{class:'btn btn-sm'+(i===0?' btn-primary':''), on:{click:()=>go(i)}}, `Part ${i+1}`)); });
  function go(i){ cur=i; panes.forEach((p,k)=>p.style.display=k===i?'':'none'); tabs.querySelectorAll('button').forEach((b,k)=>b.classList.toggle('btn-primary',k===i)); window.scrollTo(0,0); }
  const submitBtn=h('button',{class:'btn btn-read', on:{click:()=>{ const blank=ctrls.reduce((a,ct)=>a+ct.collect().filter(x=>x===null||x==='').length,0); if(blank) PP.confirm(`还有 ${blank} 题没作答，确定交卷吗？`, submit); else submit(); }}},'交卷 ✓');
  c.append(h('div',{class:'runner-head'}, h('div',{}, h('div',{class:'row gap'}, h('span',{class:'pill mock'},'阅读全卷模考'), h('span',{class:'pill'},'32 题 · 45 分钟')), h('h2',{style:'margin-top:6px'}, `Reading Paper · 第 ${n+1} 次`)), h('div',{class:'row gap'}, cd.el, submitBtn, h('button',{class:'btn btn-ghost btn-sm', on:{click:()=>PP.confirm('退出后本次模考不保存，确定？', ()=>{ cd.stop(); PP.navigate(day?'today':'mock', day?{day}:{}); })}},'退出'))));
  c.append(tabs, paneWrap, h('div',{class:'row gap mt2'}, h('button',{class:'btn', on:{click:()=>go(Math.max(0,cur-1))}},'← 上一部分'), h('button',{class:'btn', on:{click:()=>go(Math.min(5,cur+1))}},'下一部分 →')));
  function submit(){
    if(submitted) return; submitted=true; const secs=cd.stop(); submitBtn.remove();
    let total=0, score=0; const byPart={};
    const answers = ctrls.map(ct=>ct.collect());
    sets.forEach((s,i)=>{ const g=ctrls[i].grade(answers[i]); byPart[s.part]={score:g.score,total:g.total}; score+=g.score; total+=g.total; PP.state.results.push({ts:Date.now(), day, mode:'mock', part:s.part, setId:s.set.id, score:g.score, total:g.total, secs:0, wrong:g.detail.map((d,k)=>d.ok?null:k).filter(x=>x!==null)}); ctrls[i].showResults(answers[i]); });
    const pct=Math.round(score/total*100); const est=MOCK.estimate(pct);
    const rec={ts:Date.now(), day, type:'reading', score, total, pct, secs:Math.round(secs), byPart}; PP.state.mocks.push(rec); PP.save();
    const xp=60+score; PP.addXP(xp,'阅读模考');
    panes.forEach(p=>p.style.display='');
    const tbl=h('table',{class:'tbl'}, h('tr',{}, h('th',{},'部分'), h('th',{},'得分'), h('th',{},'正确率')), ...PARTS.map(p=>h('tr',{}, h('td',{}, `${M[p].name} ${M[p].zh}`), h('td',{class:'bold'}, `${byPart[p].score} / ${byPart[p].total}`), h('td',{class:'score '+PP.READ.scoreClass(Math.round(byPart[p].score/byPart[p].total*100))}, Math.round(byPart[p].score/byPart[p].total*100)+'%'))));
    const box=h('div',{class:'card'}, h('div',{class:'result-box'}, h('div',{class:'big'}, score, h('small',{},` / ${total}`)), h('div',{}, h('div',{class:'bold', style:'font-size:20px'}, `${pct}% · ${est.band}`), h('div',{class:'small', style:'opacity:.8'}, `用时 ${PP.fmtTime(secs)} · +${xp} XP · 估分仅按阅读单卷粗略换算`))), tbl, h('div',{class:'row gap mt'}, onDone?h('button',{class:'btn btn-primary btn-lg', on:{click:()=>onDone(rec)}},'完成，返回今日 →'):h('button',{class:'btn btn-primary btn-lg', on:{click:()=>PP.navigate('mock')}},'返回'), h('p',{class:'small muted'},'下面是全部题目的解析，往下滚动查看。')));
    tabs.remove(); c.insertBefore(box, paneWrap); window.scrollTo(0,0);
  }
};
MOCK.speakingMock = ({day=null, onDone=null}) => {
  const collector=[]; const startTs=Date.now();
  const s1=PP.shuffle(D.speaking_p1).slice(0,3).map(q=>q.id);
  const s2=[D.speaking_p2[PP.rand(D.speaking_p2.length)].id];
  const s3i=PP.rand(D.speaking_p3.length); const s3=[D.speaking_p3[s3i].id]; const s4=[(D.speaking_p4.find(x=>x.linkedTo===s3[0])||D.speaking_p4[0]).id];
  const steps=[['s1',s1],['s2',s2],['s3',s3],['s4',s4]]; let k=0;
  function next(){ if(k>=steps.length) return finish(); const [part,ids]=steps[k++]; PP.SPEAK.run({part, ids, mode:'mock', day, collector, onDone:()=>next(), back:{page:day?'today':'mock', params:day?{day}:{}}}); }
  function finish(){
    const c=PP.main; c.innerHTML='';
    const avg=collector.length?+(collector.reduce((a,s)=>a+s.score,0)/collector.length).toFixed(1):0; const words=collector.reduce((a,s)=>a+s.words,0); const secs=Math.round((Date.now()-startTs)/1000);
    const rec={ts:Date.now(), day, type:'speaking', avg, words, secs, n:collector.length}; PP.state.mocks.push(rec); PP.save(); PP.addXP(60,'口语模考');
    const M=PP.PLAN.SPART_META;
    c.append(PP.pageHead('口语完整模拟 · 完成', '四个部分连做。下面是每段的机器估分和文字；回听自己的录音，对照范例改一处最明显的问题。'));
    c.append(h('div',{class:'result-box'}, h('div',{class:'big'}, avg, h('small',{},' / 5')), h('div',{}, h('div',{class:'bold', style:'font-size:18px'}, `${collector.length} 段回答 · ${words} 词 · 总用时 ${PP.fmtTime(secs)}`), h('div',{class:'small', style:'opacity:.8'}, '+60 XP · 估分仅供参考，发音与互动请家长按评分标准打分'))));
    const tbl=h('table',{class:'tbl'}, h('tr',{}, h('th',{},'部分'), h('th',{},'词数'), h('th',{},'时长'), h('th',{},'估分'), h('th',{},'文字'))); collector.forEach(s=>tbl.append(h('tr',{}, h('td',{}, M[s.part].name+' '+M[s.part].zh), h('td',{}, s.words), h('td',{}, s.secs+'s'), h('td',{class:'bold'}, s.score+'/5'), h('td',{class:'small'}, (s.transcript||'').slice(0,200)))));
    c.append(h('div',{class:'card'}, tbl), h('div',{class:'row gap'}, onDone?h('button',{class:'btn btn-primary btn-lg', on:{click:()=>onDone(rec)}},'完成，返回今日 →'):h('button',{class:'btn btn-primary btn-lg', on:{click:()=>PP.navigate('mock')}},'返回')));
  }
  next();
};
PP.pages.mock = (c) => {
  c.append(PP.pageHead('模考', '第 9 周起每周一次。阅读全卷严格计时 45 分钟；口语四部分连做约 12 分钟。'));
  const rm=PP.state.mocks.filter(m=>m.type==='reading'), sm=PP.state.mocks.filter(m=>m.type==='speaking');
  c.append(h('div',{class:'grid2'},
    h('div',{class:'card part-card'}, h('h3',{},'📖 阅读全卷模考'), h('div',{class:'desc'},'6 部分 32 题，45 分钟倒计时，到时自动交卷。交卷后给出分部成绩和估分区间。'), h('div',{class:'row between'}, h('span',{class:'small muted'}, rm.length?`已考 ${rm.length} 次 · 最近 ${rm[rm.length-1].pct}%`:'还没考过'), h('button',{class:'btn btn-read', on:{click:()=>MOCK.readingMock({})}},'开始模考'))),
    h('div',{class:'card part-card speak'}, h('h3',{},'🎙️ 口语完整模拟'), h('div',{class:'desc'},'Part 1 三题 → Part 2 一张照片 → Part 3 一个讨论 → Part 4 三题。中途不显示提示和范例。'), h('div',{class:'row between'}, h('span',{class:'small muted'}, sm.length?`已考 ${sm.length} 次 · 最近 ${sm[sm.length-1].avg}/5`:'还没考过'), h('button',{class:'btn btn-speak', on:{click:()=>MOCK.speakingMock({})}},'开始模拟')))));
  if (rm.length){ const t=h('table',{class:'tbl'}, h('tr',{}, h('th',{},'日期'), h('th',{},'得分'), h('th',{},'正确率'), h('th',{},'估分'), h('th',{},'用时'))); rm.slice().reverse().forEach(m=>t.append(h('tr',{}, h('td',{}, new Date(m.ts).toLocaleDateString('zh-CN')), h('td',{class:'bold'}, `${m.score}/${m.total}`), h('td',{}, m.pct+'%'), h('td',{}, MOCK.estimate(m.pct).band), h('td',{}, PP.fmtTime(m.secs))))); c.append(h('div',{class:'card'}, h('h3',{class:'mb'},'阅读模考记录'), t)); }
  if (sm.length){ const t=h('table',{class:'tbl'}, h('tr',{}, h('th',{},'日期'), h('th',{},'段数'), h('th',{},'总词数'), h('th',{},'平均估分'), h('th',{},'用时'))); sm.slice().reverse().forEach(m=>t.append(h('tr',{}, h('td',{}, new Date(m.ts).toLocaleDateString('zh-CN')), h('td',{}, m.n), h('td',{}, m.words), h('td',{class:'bold'}, m.avg+'/5'), h('td',{}, PP.fmtTime(m.secs))))); c.append(h('div',{class:'card'}, h('h3',{class:'mb'},'口语模拟记录'), t)); }
};
})();
