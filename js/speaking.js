/* PET 90 — Speaking: recorder (SpeechRecognition + MediaRecorder), analysis, runners for 4 parts, chooser */
(function(){
const PP=window.PP, D=window.PET_DATA, h=PP.h, SM=()=>PP.PLAN.SPART_META;
const SPEAK = PP.SPEAK = {};
const FILLERS=['um','uh','er','erm','hmm','ah'];
const LINKERS=['because','so','but','and then','for example','also','however','although','which','when','if','especially','instead'];
const OPINION=["i think","in my opinion","i prefer","i believe","i agree","i'm not sure","i don't think","what about","shall we","let's","what do you think","don't you think","that's true","good idea","i'd like","i would like"];
const POSITION=['on the left','on the right','in the middle','in the background','in the front','next to','behind','in front of','at the top','at the bottom','above','below'];
const GUESS=['i think','maybe','probably','perhaps','looks like','it looks','seems','might be','must be'];
// ---------- analysis
SPEAK.analyze = (text, secs, part, item) => {
  const toks = PP.tokens(text), words=toks.length, wpm = secs>0?Math.round(words/secs*60):0;
  const t = SM()[part].target; const notes=[]; let score=3;
  let rep=0; for(let i=1;i<toks.length;i++) if(toks[i]===toks[i-1]) rep++;
  const fillers = toks.filter(x=>FILLERS.includes(x)).length + rep;
  const linkers = PP.countPhrases(text, LINKERS), opinion = PP.countPhrases(text, OPINION), pos = PP.countPhrases(text, POSITION), guess = PP.countPhrases(text, GUESS);
  if (words===0){ return {words:0,wpm:0,secs,fillers:0,score:1,notes:[{k:'warn',t:'没有识别到内容。检查麦克风，或用“手动输入”把你说的话打出来。'}],checklist:[]}; }
  if (words >= t.minWords){ score++; notes.push({k:'ok',t:`长度达标：${words} 个词（目标 ≥ ${t.minWords}）`}); }
  else if (words < t.minWords*0.5){ score--; notes.push({k:'warn',t:`太短了：只有 ${words} 个词，目标 ≥ ${t.minWords}。用 A+R+E：回答 + 原因 + 例子。`}); }
  else notes.push({k:'warn',t:`再多说一点：${words} 个词，目标 ≥ ${t.minWords}`});
  if (secs < t.minSec) notes.push({k:'warn',t:`时长 ${Math.round(secs)} 秒，太快结束了（目标 ${t.minSec}–${t.maxSec} 秒）`});
  else if (secs > t.maxSec*1.3) notes.push({k:'tip',t:`时长 ${Math.round(secs)} 秒，有点长；考试里考官会打断。`});
  else notes.push({k:'ok',t:`时长 ${Math.round(secs)} 秒，节奏合适`});
  if (wpm && wpm<70) notes.push({k:'tip',t:`语速 ${wpm} 词/分钟偏慢，先说熟范例再录一次。`}); else if (wpm>170) notes.push({k:'tip',t:`语速 ${wpm} 词/分钟偏快，考官可能听不清。`});
  if (fillers>4){ score--; notes.push({k:'warn',t:`口头禅/重复 ${fillers} 次（um / er / 重复词）。停顿比 um 好。`}); }
  let checklist=[];
  if (part==='s1' || part==='s4'){
    if (linkers.n>=2){ score++; notes.push({k:'ok',t:`用了连接词：${linkers.found.join(', ')}`}); }
    else if (linkers.n===1) notes.push({k:'tip',t:`只用了 1 个连接词（${linkers.found[0]}），再加一个 because / for example / but。`});
    else { score--; notes.push({k:'warn',t:'没有 because / so / but / for example —— 考官听不到你的“理由”和“例子”。'}); }
    if (part==='s4'){ if (opinion.n>=1) notes.push({k:'ok',t:`有观点句：${opinion.found.slice(0,2).join(', ')}`}); else notes.push({k:'tip',t:'试试以 I think… / In my opinion… 开头。'}); }
  }
  if (part==='s2' && item && item.checklist){
    checklist = item.checklist.map(ch=>{ const r=PP.countPhrases(text, ch.keys); return {label:ch.label, hit:r.n>0, found:r.found.slice(0,3)}; });
    const hits = checklist.filter(c=>c.hit).length;
    if (hits>=5){ score++; notes.push({k:'ok',t:`六步框架覆盖 ${hits}/6 ✔`}); } else if (hits>=3) notes.push({k:'tip',t:`六步框架覆盖 ${hits}/6，缺：${checklist.filter(c=>!c.hit).map(c=>c.label).join('、')}`}); else { score--; notes.push({k:'warn',t:`只覆盖了 ${hits}/6 步。用框架：总体 → 人物位置 → 动作 -ing → 衣着/物品/天气 → 猜测 → 感受。`}); }
    if (pos.n===0) notes.push({k:'tip',t:'没有位置词：on the left / in the middle / in the background…'});
    if (guess.n===0) notes.push({k:'tip',t:'没有猜测语：I think… / maybe… / it looks like…'});
    const ing = toks.filter(x=>/ing$/.test(x)&&x.length>5).length; if (ing<3) notes.push({k:'tip',t:`-ing 动作词只有 ${ing} 个，描述照片要说“正在做什么”。`});
  }
  if (part==='s3'){
    if (opinion.n>=2){ score++; notes.push({k:'ok',t:`互动句型：${opinion.found.slice(0,3).join(' / ')}`}); } else if (opinion.n===1) notes.push({k:'tip',t:`互动句型只用了 1 个（${opinion.found[0]}）。加上 What about…? / I agree, but…`}); else { score--; notes.push({k:'warn',t:'没有互动句型。Part 3 评分看“会不会接话、问对方、做决定”。'}); }
    if (/\?/.test(text) || /what do you think|what about|shall we|don't you think/i.test(text)) notes.push({k:'ok',t:'向搭档提了问题 ✔'}); else notes.push({k:'tip',t:'记得把话交给搭档：What do you think?'});
    if (/choose|let's go with|the best|most useful|most important|decide/i.test(text)) notes.push({k:'ok',t:'做出了决定 ✔'}); else notes.push({k:'warn',t:'没有做决定：结尾要说 So, shall we choose…? / I think … is the best.'});
    if (linkers.n>=2) notes.push({k:'ok',t:`理由充分：${linkers.found.join(', ')}`});
  }
  score = PP.clamp(score,1,5);
  return {words,wpm,secs:Math.round(secs),fillers,score,notes,checklist,linkers:linkers.found,opinion:opinion.found};
};
SPEAK.similarity = (model, text) => { const m=new Set(PP.tokens(model)), t=new Set(PP.tokens(text)); if(!m.size) return 0; let n=0; for(const w of m) if(t.has(w)) n++; return Math.round(n/m.size*100); };
// ---------- recorder component
SPEAK.recorder = (opts={}) => {
  let rec=null, committed='', finalText='', interim='', wantRec=false, mr=null, stream=null, chunks=[], recording=false, srErr='';
  let lastBlob=null;
  const timer = PP.timerEl();
  const mic = h('button',{class:'mic', title:'开始/停止录音'},'🎙️');
  const status = h('div',{class:'small muted', style:'text-align:center;margin-top:8px'}, PP.SR ? '点击麦克风开始回答；再点一次结束' : '此浏览器不支持语音识别，可录音回放 + 手动输入');
  const trans = h('div',{class:'transcript'}, h('span',{class:'muted'},'你的回答会实时转成文字显示在这里…'));
  const manual = h('textarea',{class:'transcript', rows:'3', placeholder:'如果识别不出来，把你说的话打在这里，也能得到反馈', hidden:true});
  const manualBtn = h('button',{class:'btn btn-sm btn-ghost', on:{click:()=>{ manual.hidden=!manual.hidden; if(!manual.hidden) manual.focus(); }}},'✏️ 手动输入');
  const audio = h('audio',{controls:true, hidden:true, style:'width:100%;margin-top:10px'});
  const el = h('div',{class:'rec-panel'}, h('div',{class:'row between mb'}, h('span',{class:'pill speak'}, opts.label||'你的回答'), h('div',{class:'row gap'}, timer.el, manualBtn)), mic, status, h('div',{class:'mt'}, trans), manual, audio);
  const render = ()=>{ const full=(committed+finalText).trim(); trans.innerHTML=''; if(!full && !interim){ trans.append(h('span',{class:'muted'}, recording?'正在听…':'你的回答会实时转成文字显示在这里…')); } else { trans.append(full, ' ', h('span',{class:'interim'}, interim)); } };
  function startSR(){ if(!PP.SR) return; try{ rec=new PP.SR(); rec.lang='en-GB'; rec.continuous=true; rec.interimResults=true; rec.maxAlternatives=1;
    rec.onresult = e=>{ let f='',it=''; for(let i=0;i<e.results.length;i++){ const r=e.results[i]; if(r.isFinal) f+=r[0].transcript+' '; else it+=r[0].transcript; } finalText=f; interim=it; render(); };
    rec.onerror = e=>{ srErr=e.error; if(e.error==='not-allowed'||e.error==='service-not-allowed') status.textContent='❌ 麦克风权限被拒绝：请在浏览器地址栏允许麦克风后重试'; else if(e.error==='network') status.textContent='⚠️ 语音识别服务连不上（Chrome 需能访问 Google 语音服务；可试 Edge/Safari，或用“手动输入”）'; else if(e.error!=='no-speech' && e.error!=='aborted') status.textContent='识别出错：'+e.error; };
    rec.onend = ()=>{ committed += finalText; finalText=''; interim=''; if(wantRec && srErr!=='not-allowed' && srErr!=='network'){ try{ rec.start(); }catch(e){} } };
    rec.start(); }catch(e){ status.textContent='语音识别启动失败：'+e.message; } }
  async function startMR(){ try{ stream=await navigator.mediaDevices.getUserMedia({audio:true}); mr=new MediaRecorder(stream); chunks=[]; mr.ondataavailable=e=>{ if(e.data.size) chunks.push(e.data); }; mr.onstop=()=>{ try{ const blob=new Blob(chunks,{type:mr.mimeType||'audio/webm'}); lastBlob=blob; audio.src=URL.createObjectURL(blob); audio.hidden=false; }catch(e){} stream.getTracks().forEach(t=>t.stop()); }; mr.start(); }catch(e){ /* mic denied or unsupported */ } }
  const api = {
    el, get transcript(){ const t=(committed+finalText).trim(); return t || manual.value.trim(); }, get recording(){ return recording; }, get blob(){ return lastBlob; },
    start(){ if(recording) return; recording=true; wantRec=true; committed=''; finalText=''; interim=''; srErr=''; audio.hidden=true; mic.classList.add('rec'); mic.textContent='⏹'; status.textContent='正在录音… 说完再点一次结束'; render(); timer.start(opts.maxSec||0); startSR(); startMR(); opts.onStart&&opts.onStart(); },
    stop(){ if(!recording) return; recording=false; wantRec=false; mic.classList.remove('rec'); mic.textContent='🎙️'; const secs=timer.stop(); try{ rec&&rec.stop(); }catch(e){} try{ mr&&mr.state!=='inactive'&&mr.stop(); }catch(e){} committed += finalText; finalText=''; interim=''; render(); status.textContent='已结束。可以回放录音，或再录一次。'; setTimeout(()=>opts.onStop&&opts.onStop(api.transcript, secs), 350); },
    reset(){ committed=''; finalText=''; interim=''; manual.value=''; render(); audio.hidden=true; timer.el.textContent='0:00'; },
    disable(){ mic.disabled=true; }, enable(){ mic.disabled=false; },
    destroy(){ wantRec=false; try{ rec&&rec.abort(); }catch(e){} try{ mr&&mr.state!=='inactive'&&mr.stop(); }catch(e){} try{ stream&&stream.getTracks().forEach(t=>t.stop()); }catch(e){} }
  };
  mic.addEventListener('click', ()=>{ if(recording) api.stop(); else api.start(); });
  return api;
};
// ---------- feedback panel
function feedbackPanel(fb, opts={}){
  const el = h('div',{class:'card tight'});
  const stars = '★'.repeat(fb.score)+'☆'.repeat(5-fb.score);
  el.append(h('div',{class:'row between'}, h('h3',{},'机器反馈（仅供参考）'), h('span',{class:'pill '+(fb.score>=4?'ok':fb.score>=3?'warn':'bad')}, `估分 ${stars}`)));
  el.append(h('div',{class:'fb'}, h('div',{class:'stat'}, h('div',{class:'v'},fb.words), h('div',{class:'k'},'词数')), h('div',{class:'stat'}, h('div',{class:'v'},fb.secs+'s'), h('div',{class:'k'},'时长')), h('div',{class:'stat'}, h('div',{class:'v'},fb.wpm), h('div',{class:'k'},'词/分钟')), h('div',{class:'stat'}, h('div',{class:'v'},fb.fillers), h('div',{class:'k'},'口头禅/重复'))));
  if (fb.checklist && fb.checklist.length) el.append(h('div',{class:'chips mb'}, ...fb.checklist.map(c=>h('span',{class:'chip '+(c.hit?'hit':'miss')}, (c.hit?'✓ ':'○ ')+c.label+(c.found.length?'：'+c.found.join(', '):'')))));
  el.append(h('ul',{class:'notes'}, ...fb.notes.map(n=>h('li',{class:n.k}, n.t))));
  if (opts.selfRate){
    let val=0; const btns=[1,2,3,4,5].map(n=>h('button',{on:{click:()=>{ val=n; btns.forEach((b,i)=>b.classList.toggle('on',i<n)); opts.selfRate(n); }}},'⭐'));
    el.append(h('div',{class:'row gap mt'}, h('span',{class:'small bold'},'发音自评（听回放）'), h('div',{class:'stars'}, ...btns)));
  }
  return el;
}
function modelPanel(text, opts={}){
  const body = h('div',{class:'bubble', style:'display:none'}, text);
  const el = h('div',{class:'card tight'}, h('div',{class:'row between wrap gap'}, h('h3',{}, opts.title||'范例答案'), h('div',{class:'row gap'}, h('button',{class:'btn btn-sm', on:{click:()=>PP.speak(text)}},'🔊 播放范例'), h('button',{class:'btn btn-sm', on:{click:()=>{ body.style.display=body.style.display==='none'?'block':'none'; }}},'👀 显示/隐藏文字'), h('button',{class:'btn btn-sm btn-ghost', on:{click:()=>PP.stopSpeak()}},'⏹'))), h('div',{class:'mt'}, body));
  if (opts.tips) el.append(h('div',{class:'why mt'}, '💡 ', opts.tips));
  return el;
}
function shadowPanel(modelText){
  const el = h('div',{class:'card tight'}, h('h3',{},'跟读一遍（Shadowing）'), h('p',{class:'small muted'},'先听范例，再模仿它的节奏把同一段话说出来。识别出的文字会和范例比对相似度。'));
  const out = h('div');
  const rec = SPEAK.recorder({label:'跟读', maxSec:90, onStop:(text,secs)=>{ const sim=SPEAK.similarity(modelText,text); out.innerHTML=''; out.append(h('div',{class:'result-box', style:'margin-top:12px'}, h('div',{class:'big'}, sim+'%'), h('div',{}, h('div',{class:'bold'},'与范例词汇重合度'), h('div',{class:'small', style:'opacity:.8'}, sim>=70?'很好！已经能复述大意':sim>=40?'不错，再听一遍范例试试':'先把范例读熟再录')))); }});
  el.append(rec.el, out);
  return el;
}
// ---------- runners
SPEAK.run = ({part, ids, mode='free', day=null, onDone=null, back=null, collector=null}) => {
  const c = PP.main; c.innerHTML='';
  const meta = SM()[part];
  let items = [];
  if (part==='s1') items = ids.map(id=>{ const q=D.speaking_p1.find(x=>x.id===id); return {kind:'q', id, q:q.q, model:q.model, tips:q.tips, topic:q.topic}; });
  if (part==='s4') ids.forEach(id=>{ const set=D.speaking_p4.find(x=>x.id===id); const s3=D.speaking_p3.find(x=>x.id===set.linkedTo); set.questions.forEach((qq,i)=>items.push({kind:'q', id:id+'-'+i, q:qq.q, model:qq.model, topic:'话题：'+(s3?s3.theme:''), tips:'观点 → 理由 → 例子。可以用 It depends… / For me… 开头。'})); });
  if (part==='s2') items = ids.map(id=>({kind:'photo', id, item:D.speaking_p2.find(x=>x.id===id)}));
  if (part==='s3') items = ids.map(id=>({kind:'dialogue', id, item:D.speaking_p3.find(x=>x.id===id)}));
  let idx=0; const sessions=[]; let currentRec=null;
  PP.onLeave = ()=>{ currentRec&&currentRec.destroy(); PP.stopSpeak(); };
  function leave(){ PP.onLeave&&PP.onLeave(); PP.onLeave=null; if(back) PP.navigate(back.page, back.params); else PP.navigate(mode==='daily'?'today':'speaking', mode==='daily'?{day}:{}); }
  function head(title){ return h('div',{class:'runner-head'}, h('div',{}, h('div',{class:'row gap'}, h('span',{class:'pill speak'},'Speaking '+meta.name), h('span',{class:'pill'},meta.zh), mode==='daily'?h('span',{class:'pill accent'},'今日任务'):null, mode==='mock'?h('span',{class:'pill mock'},'模考'):null), h('h2',{style:'margin-top:6px'}, title)), h('div',{class:'row gap'}, h('span',{class:'small muted'}, `${idx+1} / ${items.length}`), h('button',{class:'btn btn-ghost btn-sm', on:{click:()=>leave()}},'退出'))); }
  function saveSession(item, fb, transcript, selfRate, blob){
    const s={ts:Date.now(), day, mode, part, itemId:item.id, secs:fb.secs, words:fb.words, wpm:fb.wpm, score:fb.score, transcript:transcript.slice(0,1200), self:selfRate||0};
    if (blob && blob.size){ s.audioId='a'+s.ts; PP.audio.save(s.audioId, blob, {part, itemId:item.id, day, secs:fb.secs}); }
    PP.state.speaking.push(s); sessions.push(s); if(collector) collector.push(s); PP.save(); return s;
  }
  function nextBtn(){ idx++; if (idx<items.length) show(); else finish(); }
  function finish(){
    c.innerHTML=''; const avg = sessions.length? (sessions.reduce((a,s)=>a+s.score,0)/sessions.length).toFixed(1):'-';
    const xp = mode==='mock'?0:25; if (xp) PP.addXP(xp, `口语 ${meta.name}`);
    c.append(head('完成！'), h('div',{class:'result-box'}, h('div',{class:'big'}, avg, h('small',{},' / 5')), h('div',{}, h('div',{class:'bold', style:'font-size:18px'}, `${meta.name} · ${meta.zh} 练习完成`), h('div',{class:'small', style:'opacity:.8'}, `${sessions.length} 段录音 · 共 ${sessions.reduce((a,s)=>a+s.words,0)} 词 · ${PP.fmtTime(sessions.reduce((a,s)=>a+s.secs,0))}${xp?` · +${xp} XP`:''}`))));
    const btns=h('div',{class:'row gap wrap'});
    if (onDone) btns.append(h('button',{class:'btn btn-primary btn-lg', on:{click:()=>onDone(sessions)}}, mode==='mock'?'继续 →':'完成，返回今日 →')); else btns.append(h('button',{class:'btn btn-primary btn-lg', on:{click:()=>leave()}},'返回'));
    btns.append(h('button',{class:'btn', on:{click:()=>SPEAK.run({part,ids,mode,day,onDone,back,collector})}},'再练一次'));
    c.append(btns);
  }
  function qStep(it){
    const wrap=h('div'); const q=it;
    wrap.append(h('div',{class:'examiner'}, h('div',{class:'avatar'},'🧑‍🏫'), h('div',{}, h('div',{class:'bubble'}, q.q), h('div',{class:'row gap mt', style:'margin-top:8px'}, h('button',{class:'btn btn-sm', on:{click:()=>PP.speak(q.q)}},'🔊 再听一遍'), q.topic?h('span',{class:'pill'},q.topic):null))));
    if (q.tips && mode!=='mock') wrap.append(h('div',{class:'bubble hint mb'}, '💡 '+q.tips));
    const after=h('div');
    const rec = SPEAK.recorder({label:'你的回答', maxSec:meta.target.maxSec, onStop:(text,secs)=>{ const fb=SPEAK.analyze(text,secs,part,q); let self=0; const s=saveSession(q,fb,text,0,rec.blob); after.innerHTML=''; after.append(feedbackPanel(fb,{selfRate:n=>{ s.self=n; PP.save(); }})); if(mode!=='mock'){ after.append(modelPanel(q.model,{tips:q.tips})); after.append(shadowPanel(q.model)); } after.append(h('div',{class:'row gap mt'}, h('button',{class:'btn btn-primary btn-lg', on:{click:()=>{ rec.destroy(); nextBtn(); }}}, idx<items.length-1?'下一题 →':'完成 ✓'), h('button',{class:'btn', on:{click:()=>{ rec.reset(); after.innerHTML=''; }}},'重录'))); after.scrollIntoView({behavior:'smooth',block:'start'}); }});
    currentRec=rec; wrap.append(rec.el, after);
    PP.speak(q.q);
    return wrap;
  }
  function photoStep(it){
    const p=it.item; const wrap=h('div');
    const instr = "Now, I'd like you to describe this photograph. Please tell us what you can see in it. Talk for about one minute.";
    wrap.append(h('div',{class:'examiner'}, h('div',{class:'avatar'},'🧑‍🏫'), h('div',{}, h('div',{class:'bubble'}, instr), h('div',{class:'row gap', style:'margin-top:8px'}, h('button',{class:'btn btn-sm', on:{click:()=>PP.speak(instr)}},'🔊 再听一遍'), h('span',{class:'pill'}, p.scene)))));
    const img = h('img',{class:'photo', src:p.img, alt:p.en, referrerpolicy:'no-referrer'});
    img.addEventListener('error',()=>{ img.replaceWith(h('div',{class:'photo', style:'display:grid;place-items:center;height:320px;padding:30px;text-align:center'}, h('div',{}, h('div',{class:'lead bold'},'图片加载失败（需要联网访问 Wikimedia）'), h('p',{class:'muted'}, '场景：'+p.en), h('p',{class:'small muted'}, p.guide.join(' · '))))); });
    wrap.append(h('div',{class:'photo-wrap mb'}, img, h('div',{class:'photo-credit'}, h('a',{href:p.page, target:'_blank', rel:'noopener'}, `${p.by||'Wikimedia Commons'} · ${p.license}`))));
    const guide = h('div',{class:'guide', style:'display:none'}, ...p.guide.map((g,i)=>h('div',{}, h('b',{},['①','②','③','④','⑤','⑥'][i]), g)));
    if (mode!=='mock') wrap.append(h('div',{class:'row gap mb'}, h('button',{class:'btn btn-sm', on:{click:()=>{ guide.style.display=guide.style.display==='none'?'grid':'none'; }}},'💡 六步框架提示'), h('span',{class:'small muted'},'目标：45–75 秒，60+ 词，用位置词和 -ing')), guide);
    const after=h('div');
    const rec = SPEAK.recorder({label:'描述照片（约 1 分钟）', maxSec:75, onStop:(text,secs)=>{ const fb=SPEAK.analyze(text,secs,'s2',p); const s=saveSession(it,fb,text,0,rec.blob); after.innerHTML=''; after.append(feedbackPanel(fb,{selfRate:n=>{ s.self=n; PP.save(); }})); if(mode!=='mock'){ after.append(modelPanel(p.model,{title:'范例描述（约 1 分钟）'})); after.append(shadowPanel(p.model)); } after.append(h('div',{class:'row gap mt'}, h('button',{class:'btn btn-primary btn-lg', on:{click:()=>{ rec.destroy(); nextBtn(); }}}, idx<items.length-1?'下一张 →':'完成 ✓'), h('button',{class:'btn', on:{click:()=>{ rec.reset(); after.innerHTML=''; }}},'重录'))); after.scrollIntoView({behavior:'smooth',block:'start'}); }});
    currentRec=rec; wrap.append(rec.el, after);
    PP.speak(instr);
    return wrap;
  }
  function dialogueStep(it){
    const sc=it.item; const wrap=h('div');
    const intro = `${sc.situation} ${sc.task} Talk together. You have about two minutes.`;
    wrap.append(h('div',{class:'examiner'}, h('div',{class:'avatar'},'🧑‍🏫'), h('div',{}, h('div',{class:'bubble'}, intro), h('div',{class:'row gap', style:'margin-top:8px'}, h('button',{class:'btn btn-sm', on:{click:()=>PP.speak(intro)}},'🔊 再听一遍'), h('span',{class:'pill'}, sc.theme)))));
    wrap.append(h('div',{class:'options-strip mb'}, ...sc.options.map(o=>h('div',{class:'opt-card'}, h('div',{class:'e'},o.emoji), h('div',{class:'l'},o.label)))));
    if (mode!=='mock') wrap.append(h('div',{class:'chips mb'}, ...sc.useful.map(u=>h('span',{class:'chip'},u))));
    const dlg = h('div',{class:'dialogue'}); wrap.append(dlg);
    const after=h('div'); wrap.append(after);
    let turn=0; const yourTexts=[]; const yourBlobs=[]; let totalSecs=0; let rec=null;
    function partnerLine(text){ dlg.append(h('div',{class:'examiner'}, h('div',{class:'avatar partner'},'🧑‍🎓'), h('div',{class:'bubble'}, text))); PP.speak(text); }
    function yourTurn(hint){
      if (mode!=='mock') dlg.append(h('div',{class:'examiner'}, h('div',{class:'avatar you'},'🙂'), h('div',{class:'bubble hint'}, '轮到你：'+hint)));
      rec = SPEAK.recorder({label:'你的回合', maxSec:30, onStop:(text,secs)=>{ yourTexts.push(text); if(rec.blob&&rec.blob.size) yourBlobs.push(rec.blob); totalSecs+=secs; rec.el.remove(); dlg.append(h('div',{class:'examiner'}, h('div',{class:'avatar you'},'🙂'), h('div',{class:'bubble you'}, text||'（没有识别到内容）'))); turn++; advance(); }});
      currentRec=rec; dlg.append(rec.el); rec.el.scrollIntoView({behavior:'smooth',block:'center'});
    }
    function advance(){
      while (turn < sc.dialogue.length){
        const d = sc.dialogue[turn];
        if (d.who==='partner'){ partnerLine(d.text); turn++; }
        else { yourTurn(d.hint); return; }
      }
      // end of dialogue
      const text = yourTexts.join(' . '); const fb=SPEAK.analyze(text,totalSecs,'s3',sc); const s=saveSession(it,fb,text,0,null);
      if(yourBlobs.length){ s.audioIds=yourBlobs.map((b,i)=>{ const id='a'+s.ts+'-'+i; PP.audio.save(id,b,{part:'s3',itemId:it.id,day,turn:i+1}); return id; }); PP.save(); }
      after.append(feedbackPanel(fb,{selfRate:n=>{ s.self=n; PP.save(); }}));
      if (mode!=='mock') after.append(modelPanel(sc.model,{title:'你的三个回合可以这样说', tips:'每说 2–3 句就把话交给对方；最后一定要做决定。'}));
      after.append(h('div',{class:'row gap mt'}, h('button',{class:'btn btn-primary btn-lg', on:{click:()=>nextBtn()}}, idx<items.length-1?'下一个 →':'完成 ✓'), h('button',{class:'btn', on:{click:()=>show()}},'重来')));
      after.scrollIntoView({behavior:'smooth',block:'start'});
    }
    PP.speak(intro).then(()=>advance());
    return wrap;
  }
  function show(){
    c.innerHTML=''; const it=items[idx];
    const title = it.kind==='q' ? '回答问题' : it.kind==='photo' ? '描述照片' : it.item.theme;
    c.append(head(title));
    c.append(it.kind==='q'?qStep(it):it.kind==='photo'?photoStep(it):dialogueStep(it));
  }
  if (!items.length){ c.append(h('div',{class:'empty'},'没有可用的题目')); return; }
  show();
};
// ---------- review page (Sunday)
SPEAK.reviewPage = (day, onDone) => {
  const c=PP.main; c.innerHTML='';
  const from = day-6; const list = PP.state.speaking.filter(s=>s.day!==null && s.day>=from && s.day<=day);
  c.append(PP.pageHead('口语复盘', `回看本周（Day ${Math.max(1,from)}–${day}）的 ${list.length} 段录音文字，给自己打分：哪里没说 because？哪句可以更长？`));
  if (!list.length) c.append(h('div',{class:'empty'},'本周还没有口语记录。先去练一次口语吧。'));
  list.slice().reverse().forEach(s=>{ const meta=SM()[s.part]; c.append(h('div',{class:'card tight'}, h('div',{class:'row between'}, h('div',{class:'row gap'}, h('span',{class:'pill speak'},meta.name+' '+meta.zh), h('span',{class:'small muted'}, `Day ${s.day} · ${s.words} 词 · ${s.secs}s · 估分 ${s.score}/5`)), h('span',{class:'stars small'}, '⭐'.repeat(s.self||0))), h('div',{class:'transcript mt'}, s.transcript||'（无文字）'))); });
  c.append(h('div',{class:'row gap mt'}, h('button',{class:'btn btn-primary btn-lg', on:{click:()=>onDone&&onDone()}},'✓ 我复盘完了'), h('button',{class:'btn', on:{click:()=>PP.navigate('today',{day})}},'返回')));
};
// ---------- chooser page
PP.pages.speaking = (c, params={}) => {
  if (params.part) return itemList(c, params.part);
  c.append(PP.pageHead('口语训练', '考官提问由电脑朗读，你对着麦克风回答；识别成文字后给出反馈，再听范例、跟读。'));
  if (!PP.SR) c.append(h('div',{class:'instr'}, '⚠️ 当前浏览器不支持语音识别（推荐 Chrome / Edge / Safari）。仍可录音回放 + 手动输入获得反馈。'));
  const grid=h('div',{class:'grid4'});
  for (const part of ['s1','s2','s3','s4']){ const m=SM()[part]; const n=PP.state.speaking.filter(s=>s.part===part).length; const avg = n? (PP.state.speaking.filter(s=>s.part===part).slice(-5).reduce((a,s)=>a+s.score,0)/Math.min(5,n)).toFixed(1):null; grid.append(h('div',{class:'card part-card speak', on:{click:()=>PP.navigate('speaking',{part})}}, h('h3',{}, `${m.name} · ${m.zh}`), h('div',{class:'desc'}, m.desc), h('div',{class:'row between'}, h('span',{class:'small muted'}, n?`已练 ${n} 次`:'还没练过'), avg?h('span',{class:'score '+(avg>=4?'good':avg>=3?'mid':'bad')}, `最近 ${avg}/5`):null))); }
  c.append(grid);
  const recent = PP.state.speaking.slice(-6).reverse();
  if (recent.length){ const box=h('div',{class:'card'}, h('h3',{class:'mb'},'最近的录音文字')); recent.forEach(s=>{ const m=SM()[s.part]; box.append(h('div',{class:'row gap mb', style:'align-items:flex-start'}, h('span',{class:'pill speak'}, m.name), h('div',{class:'small'}, h('b',{}, `${s.words} 词 · ${s.secs}s · ${s.score}/5`), ' — ', (s.transcript||'').slice(0,160)))); }); c.append(box); }
};
function itemList(c, part){
  const m=SM()[part];
  c.append(PP.pageHead(`${m.name} · ${m.zh}`, m.desc, h('div',{class:'row gap'}, h('button',{class:'btn', on:{click:()=>PP.navigate('lessons',{id:m.lesson})}},'📚 方法课'), h('button',{class:'btn btn-ghost', on:{click:()=>PP.navigate('speaking')}},'← 全部'))));
  const back={page:'speaking',params:{part}};
  if (part==='s1'){
    const topics=[...new Set(D.speaking_p1.map(q=>q.topic))];
    c.append(h('div',{class:'row gap mb'}, h('button',{class:'btn btn-speak', on:{click:()=>SPEAK.run({part, ids:PP.shuffle(D.speaking_p1).slice(0,3).map(q=>q.id), back})}},'🎲 随机 3 题'), h('span',{class:'small muted'},'或按话题选择：')));
    for (const t of topics){ const qs=D.speaking_p1.filter(q=>q.topic===t); c.append(h('div',{class:'card tight'}, h('div',{class:'row between mb'}, h('h3',{},t), h('button',{class:'btn btn-sm btn-speak', on:{click:()=>SPEAK.run({part, ids:qs.map(q=>q.id), back})}},'练这个话题')), h('div',{class:'set-list'}, ...qs.map(q=>h('div',{class:'set-row', on:{click:()=>SPEAK.run({part, ids:[q.id], back})}}, h('span',{class:'t'}, q.q), h('span',{class:'btn btn-sm'},'练')))))); }
  } else if (part==='s2'){
    const grid=h('div',{class:'grid3'});
    D.speaking_p2.forEach(p=>{ const n=PP.state.speaking.filter(s=>s.itemId===p.id).length; grid.append(h('div',{class:'card tight part-card speak', on:{click:()=>SPEAK.run({part, ids:[p.id], back})}}, h('img',{class:'photo', src:p.img, alt:p.en, style:'height:150px', referrerpolicy:'no-referrer'}), h('div',{class:'bold mt'}, p.scene), h('div',{class:'small muted'}, p.en + (n?` · 练过 ${n} 次`:'')))); });
    c.append(h('div',{class:'row gap mb'}, h('button',{class:'btn btn-speak', on:{click:()=>SPEAK.run({part, ids:[D.speaking_p2[PP.rand(D.speaking_p2.length)].id], back})}},'🎲 随机一张')), grid);
  } else if (part==='s3'){
    c.append(h('div',{class:'set-list'}, ...D.speaking_p3.map((s,i)=>h('div',{class:'set-row', on:{click:()=>SPEAK.run({part, ids:[s.id], back})}}, h('span',{class:'qn'},i+1), h('span',{class:'t'}, s.theme, h('div',{class:'small muted', style:'font-weight:600'}, s.options.map(o=>o.emoji+' '+o.label).join('  '))), h('span',{class:'btn btn-sm btn-speak'},'开始')))));
  } else {
    c.append(h('div',{class:'set-list'}, ...D.speaking_p4.map((s,i)=>{ const s3=D.speaking_p3.find(x=>x.id===s.linkedTo); return h('div',{class:'set-row', on:{click:()=>SPEAK.run({part, ids:[s.id], back})}}, h('span',{class:'qn'},i+1), h('span',{class:'t'}, '话题：'+(s3?s3.theme:''), h('div',{class:'small muted', style:'font-weight:600'}, s.questions.map(q=>q.q).join(' · '))), h('span',{class:'btn btn-sm btn-speak'},'开始')); })));
  }
}
})();
