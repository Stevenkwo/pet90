/* PET 90 — pages: today, learning map (plan), lessons, settings; onboarding; boot */
(function(){
const PP=window.PP, D=window.PET_DATA, h=PP.h;
const ICON={listening:'🎧',reviewListening:'🔁',lesson:'📚',reading:'📖',speaking:'🎙️',mockReading:'🏆',mockSpeaking:'🏆',reviewReading:'🔁',reviewSpeaking:'🔁',vocab:'🃏',shoot:'🚀'};
const CLS={listening:'listening',reviewListening:'review',lesson:'lesson',reading:'reading',speaking:'speaking',mockReading:'mock',mockSpeaking:'mock',reviewReading:'review',reviewSpeaking:'review',vocab:'vocab',shoot:'shoot'};
const BTN={listening:'btn-listen',reviewListening:'btn-listen',lesson:'btn-accent',reading:'btn-read',speaking:'btn-speak',mockReading:'btn-primary',mockSpeaking:'btn-primary',reviewReading:'btn-read',reviewSpeaking:'btn-speak',vocab:'btn-vocab',shoot:'btn-shoot'};
const REWARD={listening:'+10~30 XP',reviewListening:'+10~30 XP',lesson:'+10 XP',reading:'+20~40 XP',speaking:'+25 XP',mockReading:'+60 XP 起',mockSpeaking:'+60 XP',reviewReading:'+20~40 XP',reviewSpeaking:'',vocab:'+10 XP 起',shoot:'按得分给 XP'};
const CHEER=['今天也要加油哦！','一起冲鸭！🦆','每天一点点，PET 稳稳的。','先做最难的那个？还是先打游戏热身？','我等你完成任务再吃零食 🍪'];
PP.completeTask = (day, key, then) => {
  PP.PLAN.markDone(day, key);
  const p=PP.PLAN.dayProgress(day);
  if (p.done>=p.total && !(PP.state.days[day]||{}).celebrated){ PP.state.days[day].celebrated=true; PP.save(); PP.addXP(30,'今日全部完成 🎉'); PP.confetti(); }
  if (then) then(); else PP.navigate('today',{day});
};
function startTask(day, t){
  const done=()=>PP.completeTask(day, t.key);
  switch(t.kind){
    case 'lesson': return PP.navigate('lessons',{id:t.lesson, day, taskKey:t.key});
    case 'listening': return PP.LISTEN.run({part:t.part, setId:t.setId, mode:'daily', day, onDone:done});
    case 'reading': return PP.READ.run({part:t.part, setId:t.setId, mode:'daily', day, onDone:done});
    case 'speaking': return PP.SPEAK.run({part:t.part, ids:t.ids, mode:'daily', day, onDone:done});
    case 'mockReading': return PP.MOCK.readingMock({day, onDone:done});
    case 'mockSpeaking': return PP.MOCK.speakingMock({day, onDone:done});
    case 'vocab': return PP.VOCAB.run({count:10, day, mode:'daily', onDone:done});
    case 'shoot': return PP.SHOOT.run({groupId:t.group, mode:'listen', difficulty:'normal', day, runMode:'daily', onDone:done});
    case 'reviewSpeaking': return PP.SPEAK.reviewPage(day, done);
    case 'reviewListening': {
      const from=day-6; const week=PP.state.results.filter(r=>r.day!==null && r.day>=from && r.day<=day && /^l[1-4]$/.test(r.part) && r.mode!=='review');
      let part, setId;
      if (week.length){ const worst=week.slice().sort((a,b)=>(a.score/a.total)-(b.score/b.total))[0]; part=worst.part; setId=worst.setId; }
      else { let found=null; for(let d=Math.max(1,from); d<=day && !found; d++){ const pl=PP.PLAN.dayPlan(d); if(pl.listening) found=pl.listening; } if(!found){ part='l1'; setId=D.listening_l1[0].id; } else { part=found.part; setId=found.setId; } }
      return PP.LISTEN.run({part, setId, mode:'review', day, onDone:done});
    }
    case 'reviewReading': {
      const from=day-6; const week=PP.state.results.filter(r=>r.day!==null && r.day>=from && r.day<=day && /^p[1-6]$/.test(r.part) && r.mode!=='review');
      let part, setId;
      if (week.length){ const worst=week.slice().sort((a,b)=>(a.score/a.total)-(b.score/b.total))[0]; part=worst.part; setId=worst.setId; }
      else { let found=null; for(let d=Math.max(1,from); d<=day && !found; d++){ const pl=PP.PLAN.dayPlan(d); if(pl.reading.length) found=pl.reading[0]; } if(!found){ part='p1'; setId=D.reading_p1[0].id; } else { part=found.part; setId=found.setId; } }
      return PP.READ.run({part, setId, mode:'review', day, onDone:done});
    }
  }
}
PP.pages.today = (c, params={}) => {
  const ti=PP.PLAN.todayIndex(); const day = params.day || ti;
  const p=PP.state.profile;
  if (ti<1){ c.append(PP.pageHead('还没开始', `计划从 ${PP.fmtDate(p.start)} 开始，还有 ${1-ti} 天。想现在就开始？`), h('button',{class:'btn btn-primary btn-lg', on:{click:()=>{ p.start=PP.today(); PP.save(); PP.navigate('today'); }}},'从今天开始')); return; }
  const {plan, tasks, done, total} = PP.PLAN.dayProgress(day);
  const pct=Math.round(done/total*100);
  const dateStr = p.start ? PP.fmtDate(PP.addDays(p.start, day-1)) : '';
  const rel = day===ti?'今天':day<ti?`${ti-day} 天前 · 补练`:`${day-ti} 天后 · 提前练`;
  const examLeft = p.examDate ? PP.daysBetween(PP.today(), p.examDate) : null;
  const allDone = done>=total;
  const sayText = allDone ? `太棒了${p.name?'，'+p.name:''}！今天的任务全部完成 🎉 明天见！` : done===0 ? `${p.name?p.name+'，':''}${CHEER[day%CHEER.length]}` : `已经完成 ${done}/${total} 了，再来 ${total-done} 个就全部搞定！`;
  const hero=h('div',{class:'hero'},
    h('div',{class:'hero-day'}, h('div',{class:'k'}, `${dateStr} · ${rel}`), h('div',{class:'d'}, plan.free?'自由练习':`Day ${day}`, h('small',{}, plan.free?'':' / 90')), h('div',{}, `第 ${plan.week} 周 · `, h('span',{class:'ph'}, plan.phase+(plan.review?' · 复盘日':plan.readingMock||plan.speakingMock?' · 模考日':''))), h('div',{class:'ring', style:`--p:${pct}`}, h('b',{}, `${done}/${total}`))),
    h('div',{class:'hero-side'}, PP.say(sayText, allDone?'cheer':'happy', 84), h('div',{class:'hero-stats'}, h('div',{class:'stat'}, h('div',{class:'v'}, PP.streak()+' 🔥'), h('div',{class:'k'},'连续练习天数')), h('div',{class:'stat'}, h('div',{class:'v'}, examLeft===null?'—':examLeft+' 天'), h('div',{class:'k'}, examLeft===null?'考试日期未设置':`距离考试 ${PP.fmtDate(p.examDate)}`)))));
  const nav=h('div',{class:'daynav'}, h('button',{class:'btn btn-sm', on:{click:()=>PP.navigate('today',{day:day-1})}, disabled:day<=1},'‹ 前一天'), h('button',{class:'btn btn-sm'+(day===ti?' btn-read':''), on:{click:()=>PP.navigate('today')}},'今天'), h('button',{class:'btn btn-sm', on:{click:()=>PP.navigate('today',{day:day+1})}},'后一天 ›'), h('button',{class:'btn btn-sm btn-ghost', on:{click:()=>PP.navigate('plan')}},'🗺️ 学习地图'));
  c.append(PP.pageHead('今天练什么', `每天约 ${tasks.reduce((a,t)=>a+t.minutes,0)} 分钟。做完一项亮一个勾，全部完成 +30 XP 🎁`, nav), hero);
  const list=h('div',{class:'tasks'});
  tasks.forEach(t=>{ const isDone=PP.PLAN.isDone(day,t.key); list.append(h('div',{class:'task'+(isDone?' done':'')}, h('div',{class:'ic '+CLS[t.kind]}, ICON[t.kind]), h('div',{class:'t'}, h('b',{}, t.label), h('div',{class:'m'}, `约 ${t.minutes} 分钟${REWARD[t.kind]?' · '+REWARD[t.kind]:''}`)), h('div',{class:'chk'}, isDone?'✓':''), h('button',{class:'btn btn-sm '+(isDone?'':BTN[t.kind]), on:{click:()=>startTask(day,t)}}, isDone?'再练一次':'开始 →'))); });
  c.append(list);
  if (allDone) c.append(h('div',{class:'alldone mt'}, PP.mascot('cheer',64), h('div',{}, h('div',{class:'lead bold'},'🎉 今天的任务全部完成！'), h('div',{class:'muted small'},'想加练？下面随便选，都算 XP。'))));
  c.append(h('div',{class:'card tight mt'}, h('div',{class:'row between wrap gap'}, h('div',{}, h('h3',{},'自由练习'), h('div',{class:'small muted'},'不计入今日任务，但计 XP 和成绩')), h('div',{class:'row gap wrap'}, h('button',{class:'btn btn-sm btn-listen', on:{click:()=>PP.navigate('listening')}},'🎧 听力'), h('button',{class:'btn btn-sm btn-read', on:{click:()=>PP.navigate('reading')}},'📖 阅读'), h('button',{class:'btn btn-sm btn-speak', on:{click:()=>PP.navigate('speaking')}},'🎙️ 口语'), h('button',{class:'btn btn-sm btn-vocab', on:{click:()=>PP.navigate('vocab')}},'🃏 单词卡'), h('button',{class:'btn btn-sm btn-shoot', on:{click:()=>PP.navigate('shoot')}},'🚀 射击'), h('button',{class:'btn btn-sm', on:{click:()=>PP.navigate('history',{tab:'wrong'})}},'📕 错题本')))));
};
// ---- learning map (path)
PP.pages.plan = (c) => {
  const ti=PP.PLAN.todayIndex(); const start=PP.state.profile.start; const PM=PP.PLAN.PART_META, SM=PP.PLAN.SPART_META;
  c.append(PP.pageHead('学习地图', '13 个关卡 = 13 周。金色 = 全部完成，橙色 = 做了一部分，灰色 = 还没到。点任意一天可以补练或提前练。', h('div',{class:'row gap'}, h('span',{class:'pill'},'🟢 基础 1–4 周'), h('span',{class:'pill'},'🔵 提升 5–8 周'), h('span',{class:'pill'},'🟣 冲刺 9–13 周'))));
  const OFF=[0,70,115,70,0,-70,-115];
  const units=h('div',{class:'units'});
  let todayNode=null;
  for (let w=1; w<=13; w++){
    const W=PP.PLAN.WEEKS[w-1]; const nd=w===13?6:7;
    const pcolor = W.phase==='基础'?'var(--green)':W.phase==='提升'?'var(--blue)':'var(--purple)';
    units.append(h('div',{class:'unit-banner phase-'+W.phase}, h('div',{}, h('h3',{}, `第 ${w} 关 · ${W.phase}${w===13?' · 考前 6 天':''}`), h('div',{class:'sub'}, `阅读 ${W.r.map(p=>PM[p].zh).filter((v,i,a)=>a.indexOf(v)===i).join(' / ')} · 口语 ${W.s.map(p=>SM[p].zh).filter((v,i,a)=>a.indexOf(v)===i).join(' / ')}${W.phase==='冲刺'?' · 周六阅读模考 · 周日口语模拟':''}`)), h('span',{style:'font-size:34px'}, W.phase==='基础'?'🌱':W.phase==='提升'?'🚀':'🏆')));
    const path=h('div',{class:'path'});
    for (let d=1; d<=nd; d++){
      const day=(w-1)*7+d; const {plan,tasks,done,total}=PP.PLAN.dayProgress(day);
      const state = done>=total?'done':done>0?'part':day<=ti?'open':'future';
      const off = (w%2? OFF[d-1] : -OFF[d-1]);
      const label = state==='done' ? '👑' : plan.readingMock ? '📖' : plan.speakingMock ? '🎙️' : plan.review ? '🔁' : `Day ${day}`;
      const node=h('div',{class:`node ${state}${day===ti?' today':''}`, style:`--x:${off}px;--p-color:${pcolor}`, title:`Day ${day}：${tasks.map(t=>t.label).join('｜')}`, on:{click:()=>PP.navigate('today',{day})}},
        day===ti&&state!=='done'?h('div',{class:'node-tip'}, done>0?'继续！':'开始！'):null,
        h('div',{class:'node-btn', style:state==='open'?`background:${pcolor}`:''}, label),
        done>0&&state!=='done'?h('span',{class:'mini'}, `${done}/${total}`):null,
        h('div',{class:'node-date'}, (start?PP.fmtDate(PP.addDays(start,day-1)):`Day ${day}`) + (plan.readingMock?' 模考':plan.speakingMock?' 口语模拟':plan.review?' 复盘':'')));
      if (day===ti) todayNode=node;
      path.append(node);
    }
    units.append(path);
  }
  c.append(units);
  if (todayNode) setTimeout(()=>todayNode.scrollIntoView({behavior:'smooth', block:'center'}), 50);
};
PP.pages.lessons = (c, params={}) => {
  if (params.id){
    const L=D.lessons.find(l=>l.id===params.id); if(!L) return PP.navigate('lessons');
    const back=params.day?{page:'today',params:{day:params.day}}:{page:'lessons',params:{}};
    c.append(PP.pageHead(L.title, `约 ${L.minutes} 分钟阅读`, h('button',{class:'btn btn-ghost', on:{click:()=>PP.navigate(back.page, back.params)}},'← 返回')));
    const body=h('div',{class:'card lesson-body'}); L.sections.forEach(s=>{ body.append(h('h2',{},s.h), h('div',{html:s.html})); }); c.append(body);
    const btn=h('button',{class:'btn btn-primary btn-lg', on:{click:()=>{ if(!PP.state.lessonsRead[L.id]){ PP.state.lessonsRead[L.id]=PP.today(); PP.save(); PP.addXP(10,'读完教程'); } if(params.taskKey) PP.completeTask(params.day, params.taskKey); else PP.navigate('lessons'); }}}, params.taskKey?'✓ 我读完了，返回今日':'✓ 我读完了');
    const practice = L.part && L.part.startsWith('p') ? h('button',{class:'btn btn-read btn-lg', on:{click:()=>PP.navigate('reading',{part:L.part})}},'去练这部分 →') : L.part && L.part.startsWith('s') ? h('button',{class:'btn btn-speak btn-lg', on:{click:()=>PP.navigate('speaking',{part:L.part})}},'去练这部分 →') : null;
    c.append(h('div',{class:'row gap'}, btn, practice));
    return;
  }
  c.append(PP.pageHead('教程', '13 节方法课。学习地图会在每个题型第一次出现的当天安排对应的课；也可以随时回来看。'));
  const list=h('div',{class:'set-list lesson-list'});
  D.lessons.forEach((L,i)=>{ const read=PP.state.lessonsRead[L.id]; list.append(h('div',{class:'set-row', on:{click:()=>PP.navigate('lessons',{id:L.id})}}, h('span',{class:'qn'}, i), h('span',{class:'t'}, L.title, h('small',{}, `约 ${L.minutes} 分钟${read?' · 已读 '+read:''}`)), h('span',{class:'pill '+(read?'ok':'')}, read?'已读':'未读'), h('span',{class:'btn btn-sm'},'打开'))); });
  c.append(list);
};
PP.pages.settings = (c) => {
  const p=PP.state.profile;
  const name=h('input',{type:'text', value:p.name, placeholder:'例如：小明'}), start=h('input',{type:'date', value:p.start||PP.today()}), exam=h('input',{type:'date', value:p.examDate||''});
  const target=h('select',{}, ...[[140,'140 · 通过（Pass, B1）'],[153,'153 · 良好（Merit）'],[160,'160 · 优秀（Distinction, 发 B2 证书）']].map(([v,l])=>h('option',{value:v, selected:+p.target===v},l)));
  const voice=h('select',{}, h('option',{value:''},'自动选择（优先英式女声）'), ...PP.voiceList().map(v=>h('option',{value:v.name, selected:p.voice===v.name}, `${v.name} (${v.lang})`)));
  const micOut=h('span',{class:'small muted'});
  c.append(PP.pageHead('设置', ''));
  c.append(h('div',{class:'grid2'},
    h('div',{class:'card'}, h('h3',{class:'mb'},'学习者'), h('div',{class:'field'}, h('label',{},'名字'), name), h('div',{class:'field'}, h('label',{},'计划开始日期（Day 1）'), start), h('div',{class:'field'}, h('label',{},'目标分数'), target), h('div',{class:'field'}, h('label',{},'考试日期（可选，用于倒计时）'), exam), h('button',{class:'btn btn-primary', on:{click:()=>{ p.name=name.value.trim(); p.start=start.value; p.target=+target.value; p.examDate=exam.value; p.voice=voice.value; PP.save(); PP.renderSidebar(); PP.toast('已保存'); }}},'保存')),
    h('div',{class:'card'}, h('h3',{class:'mb'},'声音与麦克风'), h('div',{class:'field'}, h('label',{},'考官/范例朗读声音'), voice), h('div',{class:'row gap wrap mb'}, h('button',{class:'btn', on:{click:()=>{ p.voice=voice.value; PP.speak("Hello! My name is your examiner. Tell me something about your family."); }}},'🔊 试听'), h('button',{class:'btn', on:{click:async()=>{ micOut.textContent='请求麦克风…'; try{ const s=await navigator.mediaDevices.getUserMedia({audio:true}); s.getTracks().forEach(t=>t.stop()); micOut.textContent='✅ 麦克风可用'; }catch(e){ micOut.textContent='❌ 麦克风不可用：'+e.message; } }}},'🎤 测试麦克风'), micOut),
      h('div',{class:'why'}, h('b',{},'语音识别说明：'), '口语转文字使用浏览器内置识别。Chrome 需要能访问 Google 语音服务（国内需代理）；Edge / Safari 使用各自的服务。识别不可用时，仍可录音回放，并用“手动输入”获得反馈。', h('br'), '当前浏览器：', PP.SR?'✅ 支持语音识别':'❌ 不支持语音识别'))));
  const ver=(()=>{ try{ return (document.querySelector('script[src*="app.js"]').getAttribute('src').match(/v=([0-9a-z]+)/)||[])[1]||'dev'; }catch(e){ return 'dev'; } })();
  const credits=h('div',{class:'card'}, h('h3',{class:'mb'},'关于 & 照片版权'), h('p',{class:'small muted'}, `构建版本：${ver} · 数据保存在本浏览器 localStorage，换设备请用「成绩 → 导出备份」`), h('p',{class:'small muted'},'PET 90 是一个本地运行的备考练习工具，题目为原创仿真题，不是剑桥官方真题。口语 Part 2 照片来自 Wikimedia Commons，作者与许可如下：'), h('ul',{class:'small'}, ...D.speaking_p2.map(ph=>h('li',{}, h('a',{href:ph.page, target:'_blank', rel:'noopener'}, ph.scene), ` — ${ph.by||''} · ${ph.license}`))));
  c.append(credits);
};
function onboarding(){
  const name=h('input',{type:'text', placeholder:'孩子的名字（可不填）'}), start=h('input',{type:'date', value:PP.today()}), exam=h('input',{type:'date'});
  const target=h('select',{}, h('option',{value:140},'140 · 通过（Pass）'), h('option',{value:153},'153 · Merit'), h('option',{value:160},'160 · Distinction（B2 证书）'));
  const micOut=h('div',{class:'small muted', style:'margin-top:6px'});
  const box=h('div',{},
    PP.say('嗨！我是 Peti。90 天，每天 25 分钟：1 组阅读 + 1 个口语任务 + 10 张单词卡 + 1 局单词射击。准备好了吗？','cheer',88),
    h('div',{class:'field mt'}, h('label',{},'名字'), name), h('div',{class:'grid2'}, h('div',{class:'field'}, h('label',{},'Day 1 从哪天开始'), start), h('div',{class:'field'}, h('label',{},'目标'), target)), h('div',{class:'field'}, h('label',{},'考试日期（可选）'), exam),
    h('div',{class:'row gap wrap'}, h('button',{class:'btn btn-primary btn-lg', on:{click:()=>{ const p=PP.state.profile; p.name=name.value.trim(); p.start=start.value||PP.today(); p.target=+target.value; p.examDate=exam.value; PP.save(); PP.closeModal(); PP.renderSidebar(); PP.navigate('today'); }}},'开始 90 天 →'), h('button',{class:'btn', on:{click:async()=>{ micOut.textContent='请求麦克风…'; try{ const s=await navigator.mediaDevices.getUserMedia({audio:true}); s.getTracks().forEach(t=>t.stop()); micOut.textContent='✅ 麦克风可用（口语练习需要）'; }catch(e){ micOut.textContent='❌ 麦克风不可用：'+e.message+'（口语仍可手动输入）'; } }}},'🎤 先测一下麦克风')), micOut);
  PP.modal(box, {title:'欢迎来到 PET 90', noClose:true});
}
function boot(){
  PP.renderSidebar();
  const hash=(location.hash||'').replace('#','');
  PP.navigate(PP.pages[hash]?hash:'today');
  if (!PP.state.profile.start) onboarding();
}
if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
