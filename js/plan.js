/* PET 90 — the 90-day plan engine */
(function(){
const PP = window.PP;
const PART_META = {
  p1:{name:'Part 1', zh:'告示与短信', desc:'5 段真实短文本，三选一', minutes:5, count:5, lesson:'L1'},
  p2:{name:'Part 2', zh:'人物配对', desc:'5 个人 ↔ 8 段短文', minutes:8, count:5, lesson:'L2'},
  p3:{name:'Part 3', zh:'长文选择', desc:'一篇长文 + 5 道四选一', minutes:8, count:5, lesson:'L3'},
  p4:{name:'Part 4', zh:'句子填空', desc:'8 句选 5 句填回文章', minutes:8, count:5, lesson:'L4'},
  p5:{name:'Part 5', zh:'词汇完形', desc:'6 空，四选一，考搭配', minutes:6, count:6, lesson:'L5'},
  p6:{name:'Part 6', zh:'语法填空', desc:'6 空，一空一词，考语法', minutes:6, count:6, lesson:'L6'}
};
const LPART_META = {
  l1:{name:'Part 1', zh:'短对话选图', desc:'7 段短对话，每段听两遍，三选一', minutes:13, count:7, lesson:'L14'},
  l2:{name:'Part 2', zh:'情境理解', desc:'6 段独立录音，每段听两遍，三选一', minutes:14, count:6, lesson:'L15'},
  l3:{name:'Part 3', zh:'笔记填空', desc:'一段独白听两遍，填 6 个空', minutes:11, count:6, lesson:'L16'},
  l4:{name:'Part 4', zh:'长访谈', desc:'一段访谈听两遍，6 道三选一', minutes:15, count:6, lesson:'L17'}
};
const SPART_META = {
  s1:{name:'Part 1', zh:'问答', desc:'个人问题，每题 15–25 秒', lesson:'L7', perSession:2, target:{minWords:15, minSec:8, maxSec:35}},
  s2:{name:'Part 2', zh:'图片描述', desc:'一张照片，独自说满 1 分钟', lesson:'L8', perSession:1, target:{minWords:70, minSec:45, maxSec:80}},
  s3:{name:'Part 3', zh:'合作讨论', desc:'和搭档讨论 5 个选项并做决定', lesson:'L9', perSession:1, target:{minWords:12, minSec:6, maxSec:30}},
  s4:{name:'Part 4', zh:'深入讨论', desc:'观点 + 理由 + 例子', lesson:'L10', perSession:1, target:{minWords:30, minSec:15, maxSec:50}}
};
const WEEKS = [
  {phase:'基础', r:['p1'],            l:['l1'], s:['s1'],                lessons:{1:'L0',2:'L1',3:'L7',4:'L14'}},
  {phase:'基础', r:['p5','p1'],       l:['l1','l2'], s:['s1','s2'],           lessons:{1:'L5',2:'L15',3:'L8'}},
  {phase:'基础', r:['p6','p5'],       l:['l2','l1'], s:['s2','s1'],           lessons:{1:'L6'}},
  {phase:'基础', r:['p2','p6'],       l:['l2','l3'], s:['s2','s1'],           lessons:{1:'L2',2:'L16',5:'L11'}},
  {phase:'提升', r:['p3','p2'],       l:['l3','l2'], s:['s3'],                lessons:{1:'L3',2:'L9'}},
  {phase:'提升', r:['p4','p3'],       l:['l4','l3'], s:['s3','s2'],           lessons:{1:'L17',2:'L4'}},
  {phase:'提升', r:['p3','p4','p5'],  l:['l3','l4','l2'], s:['s4','s3'],           lessons:{1:'L10'}},
  {phase:'提升', r:['p1','p2','p3','p4','p5','p6'], l:['l1','l2','l3','l4'], s:['s3','s4','s2','s1'], lessons:{}},
  {phase:'冲刺', r:['p3','p4','p2','p1','p5','p6'], l:['l3','l4','l1','l2'], s:['s2','s3','s4','s1'], lessons:{}},
  {phase:'冲刺', r:['p1','p2','p3','p4','p5','p6'], l:['l2','l4','l3','l1'], s:['s3','s1','s2','s4'], lessons:{}},
  {phase:'冲刺', r:['p4','p3','p6','p5','p2','p1'], l:['l4','l3','l2','l1'], s:['s4','s2','s3','s1'], lessons:{}},
  {phase:'冲刺', r:['p3','p2','p4','p1','p6','p5'], l:['l3','l1','l4','l2'], s:['s2','s4','s1','s3'], lessons:{}},
  {phase:'冲刺', r:['p1','p3','p5','p2','p4','p6'], l:['l1','l3','l2','l4'], s:['s2','s3','s4','s1'], lessons:{1:'L12'}}
];
let cache = null;
function build(){
  const D = window.PET_DATA, groups = D.wordGroups;
  const c = {p1:0,p2:0,p3:0,p4:0,p5:0,p6:0,s1:0,s2:0,s3:0,s4:0,l1:0,l2:0,l3:0,l4:0};
  const pickR = part => { const sets=D['reading_'+part]; const idx=c[part]%sets.length; const review=c[part]>=sets.length; c[part]++; return {part, setId:sets[idx].id, review}; };
  const pickL = part => { const sets=D['listening_'+part]||[]; if(!sets.length) return null; const idx=c[part]%sets.length; const review=c[part]>=sets.length; c[part]++; return {part, setId:sets[idx].id, review}; };
  const pickS = part => { const n=SPART_META[part].perSession, list=D['speaking_p'+part.slice(1)], ids=[]; for(let k=0;k<n;k++){ ids.push(list[c[part]%list.length].id); c[part]++; } return {part, ids}; };
  const days=[null];
  for (let i=1;i<=90;i++){
    const w=Math.ceil(i/7), d=((i-1)%7)+1, W=WEEKS[w-1], sprint=W.phase==='冲刺';
    const plan={day:i, week:w, dow:d, phase:W.phase, lesson:(W.lessons&&W.lessons[d])||null, listening:null, reading:[], speaking:null, shoot:{group:groups[(i-1)%groups.length].id}, vocab:10, review:false, readingMock:false, speakingMock:false};
    if (d<=5){
      plan.listening = pickL(W.l[(d-1)%W.l.length]);
      // 冲刺周双份阅读只排在单数日，给听力留出时间
      if (sprint && d%2===1){ plan.reading.push(pickR(W.r[((d-1)*2)%W.r.length])); plan.reading.push(pickR(W.r[((d-1)*2+1)%W.r.length])); }
      else plan.reading.push(pickR(W.r[(d-1)%W.r.length]));
      plan.speaking = pickS(W.s[(d-1)%W.s.length]);
    } else if (d===6){
      plan.listening = pickL(W.l[5%W.l.length]);
      if (sprint) plan.readingMock=true; else plan.reading.push(pickR(W.r[W.r.length-1]));
      plan.speaking = pickS(W.s[5%W.s.length]);
    } else { plan.review=true; if (sprint) plan.speakingMock=true; }
    days.push(plan);
  }
  return days;
}
PP.PLAN = {
  PART_META, SPART_META, LPART_META, WEEKS,
  all(){ if(!cache) cache=build(); return cache; },
  dayPlan(i){ const all=this.all(); if (i>=1 && i<=90) return all[i]; return this.freePlan(i); },
  freePlan(i){ // after day 90 (or before start): rotate everything
    const D=window.PET_DATA, groups=D.wordGroups, k=Math.abs(i);
    const parts=['p1','p2','p3','p4','p5','p6'], sp=['s1','s2','s3','s4'];
    const part=parts[k%6], sets=D['reading_'+part]; const s=sp[k%4], list=D['speaking_p'+s.slice(1)];
    const lps=['l1','l2','l3','l4']; const lp=lps[k%4]; const lsets=D['listening_'+lp]||[];
    return {day:i, week:Math.ceil(i/7), dow:((i-1)%7+7)%7+1, phase:'自由', lesson:null, listening:lsets.length?{part:lp, setId:lsets[k%lsets.length].id, review:true}:null, reading:[{part, setId:sets[k%sets.length].id, review:true}], speaking:{part:s, ids:[list[k%list.length].id]}, shoot:{group:groups[k%groups.length].id}, vocab:10, review:false, readingMock:false, speakingMock:false, free:true};
  },
  todayIndex(){ const st=PP.state.profile.start; if(!st) return 1; return PP.daysBetween(st, PP.today())+1; },
  tasksOf(plan){
    const t=[];
    if (plan.listening){ const m=LPART_META[plan.listening.part]; t.push({key:'listening:'+plan.listening.setId, kind:'listening', part:plan.listening.part, setId:plan.listening.setId, label:`听力 ${m.name} · ${m.zh}${plan.listening.review?'（复习）':''}`, minutes:m.minutes}); }
    if (plan.lesson) t.push({key:'lesson', kind:'lesson', label:'教程：'+(PET_DATA.lessons.find(l=>l.id===plan.lesson)||{}).title, minutes:(PET_DATA.lessons.find(l=>l.id===plan.lesson)||{}).minutes||6, lesson:plan.lesson});
    for (const r of plan.reading){ const m=PART_META[r.part]; t.push({key:'reading:'+r.setId, kind:'reading', part:r.part, setId:r.setId, label:`阅读 ${m.name} · ${m.zh}${r.review?'（复习）':''}`, minutes:m.minutes+2}); }
    if (plan.readingMock) t.push({key:'mock:reading', kind:'mockReading', label:'阅读全卷模考（45 分钟 · 32 题）', minutes:45});
    if (plan.speaking){ const m=SPART_META[plan.speaking.part]; t.push({key:'speaking', kind:'speaking', part:plan.speaking.part, ids:plan.speaking.ids, label:`口语 ${m.name} · ${m.zh}`, minutes:8}); }
    if (plan.speakingMock) t.push({key:'mock:speaking', kind:'mockSpeaking', label:'口语完整模拟（四部分连做）', minutes:15});
    if (plan.review){ t.push({key:'review:listening', kind:'reviewListening', label:'复盘：重听本周最弱的一段听力', minutes:7}); t.push({key:'review:reading', kind:'reviewReading', label:'复盘：重做本周最弱的一组阅读', minutes:8}); if(!plan.speakingMock) t.push({key:'review:speaking', kind:'reviewSpeaking', label:'复盘：回听本周口语录音并自评', minutes:6}); }
    t.push({key:'vocab', kind:'vocab', label:'单词卡 10 张（间隔复习）', minutes:4});
    t.push({key:'shoot', kind:'shoot', group:plan.shoot.group, label:`单词射击 · 字母 ${plan.shoot.group}`, minutes:5});
    return t;
  },
  isDone(day, key){ const d=PP.state.days[day]; return !!(d && d.done && d.done[key]); },
  markDone(day, key, extra){ const s=PP.state; s.days[day]=s.days[day]||{done:{}}; s.days[day].done=s.days[day].done||{}; if(!s.days[day].done[key]){ s.days[day].done[key]=PP.today(); } if(extra) Object.assign(s.days[day], extra); PP.touchActivity(); PP.save(); },
  dayProgress(day){ const plan=this.dayPlan(day), tasks=this.tasksOf(plan); const done=tasks.filter(t=>this.isDone(day,t.key)).length; return {done, total:tasks.length, tasks, plan}; }
};
})();
