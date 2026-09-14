/* PET 90 — Vocabulary flashcards with Leitner spaced repetition */
(function(){
const PP=window.PP, D=window.PET_DATA, h=PP.h;
const VOCAB = PP.VOCAB = {};
const INTERVAL = [1,2,4,8,16,32];
VOCAB.allCards = () => D.vocab.concat(PP.state.extraCards||[]);
VOCAB.info = w => PP.state.srs[w] || null;
VOCAB.dueCards = (n=10) => {
  const today=PP.today(), all=VOCAB.allCards(), srs=PP.state.srs;
  const due = all.filter(c=>srs[c.w] && srs[c.w].due<=today).sort((a,b)=>srs[a.w].due<srs[b.w].due?-1:1);
  const fresh = all.filter(c=>!srs[c.w]);
  const pick = due.slice(0,n); if (pick.length<n) pick.push(...PP.shuffle(fresh).slice(0, n-pick.length));
  return pick;
};
VOCAB.stats = () => { const all=VOCAB.allCards(), srs=PP.state.srs, today=PP.today(); let learned=0, due=0, seen=0; for(const c of all){ const s=srs[c.w]; if(!s) continue; seen++; if(s.box>=3) learned++; if(s.due<=today) due++; } return {total:all.length, seen, learned, due, fresh:all.length-seen}; };
VOCAB.answer = (card, known) => { const s=PP.state.srs[card.w]||{box:0,due:PP.today(),seen:0}; s.seen++; if(known){ s.box=Math.min(5,s.box+1); s.due=PP.addDays(PP.today(), INTERVAL[s.box-1]||1); } else { s.box=0; s.due=PP.addDays(PP.today(),1); } PP.state.srs[card.w]=s; PP.save(); };
VOCAB.addMissed = (words) => { const have=new Set(VOCAB.allCards().map(c=>c.w)); let added=0; for(const w of words){ if(have.has(w.w)) { const s=PP.state.srs[w.w]; if(s){ s.box=0; s.due=PP.today(); } continue; } PP.state.extraCards.push({w:w.w,p:w.p,zh:w.zh,ex:'',t:'射击漏掉'}); have.add(w.w); added++; } PP.save(); return added; };
VOCAB.run = ({count=10, day=null, mode='free', onDone=null, cards=null}) => {
  const c=PP.main; c.innerHTML='';
  let queue = cards || VOCAB.dueCards(count); const total=queue.length; let i=0, known=0, unknown=0; const results=[]; const again=[];
  if (!total){ c.append(PP.pageHead('单词卡','今天没有到期的卡片 🎉'), h('button',{class:'btn btn-primary', on:{click:()=>PP.navigate('vocab')}},'返回')); return; }
  const dots = h('div',{class:'dots-progress'}, ...Array.from({length:total},()=>h('i')));
  const wrap=h('div',{style:'max-width:640px;margin:0 auto'});
  c.append(h('div',{class:'runner-head'}, h('div',{}, h('div',{class:'row gap'}, h('span',{class:'pill vocab'},'单词卡'), mode==='daily'?h('span',{class:'pill accent'},'今日任务'):null), h('h2',{style:'margin-top:6px'},'认识 or 不认识？')), h('button',{class:'btn btn-ghost btn-sm', on:{click:()=>PP.navigate(mode==='daily'?'today':'vocab', mode==='daily'?{day}:{})}},'退出')), wrap);
  function show(){
    wrap.innerHTML=''; wrap.append(dots);
    dots.querySelectorAll('i').forEach((d,k)=>{ d.className = k<i ? (results[k]?'ok':'no') : k===i?'cur':''; });
    if (i>=total){ return finish(); }
    const card=queue[i]; const s=VOCAB.info(card.w);
    const flash=h('div',{class:'flash'}, h('div',{class:'flash-in'}, h('div',{class:'face front'}, h('div',{class:'w'},card.w), h('div',{class:'pos'},card.p), h('div',{class:'small muted'},'点击翻面 · 或先猜意思')), h('div',{class:'face back'}, h('div',{class:'zh'},card.zh), card.ex?h('div',{class:'ex'},card.ex):null, h('div',{class:'small muted'}, s?`第 ${s.seen+1} 次见 · 盒子 ${s.box}`:'新词'))));
    flash.addEventListener('click',()=>flash.classList.toggle('flipped'));
    const say=()=>PP.speak(card.w+'. '+(card.ex||''), {rate:0.9});
    say();
    const btns=h('div',{class:'row gap center mt2'}, h('button',{class:'btn btn-lg', style:'border-color:var(--bad);color:var(--bad)', on:{click:()=>ans(false)}},'✗ 不认识'), h('button',{class:'btn btn-lg btn-ghost', on:{click:say}},'🔊'), h('button',{class:'btn btn-lg', style:'border-color:var(--ok);color:var(--ok)', on:{click:()=>ans(true)}},'✓ 认识'));
    wrap.append(flash, btns, h('p',{class:'small muted', style:'text-align:center;margin-top:12px'}, '快捷键：', h('kbd',{},'空格'),' 翻面 · ', h('kbd',{},'←'),' 不认识 · ', h('kbd',{},'→'),' 认识'));
    function ans(k){ if(!flash.classList.contains('flipped')){ flash.classList.add('flipped'); setTimeout(()=>ans2(k), 650); } else ans2(k); }
    function ans2(k){ VOCAB.answer(card,k); results[i]=k; if(k) known++; else { unknown++; again.push(card); } PP.beep(k?'ok':'wrong'); i++; show(); }
    keyHandler = e=>{ if(e.code==='Space'){ e.preventDefault(); flash.classList.toggle('flipped'); } else if(e.key==='ArrowLeft') ans(false); else if(e.key==='ArrowRight') ans(true); };
  }
  let keyHandler=null; const onKey=e=>keyHandler&&keyHandler(e); document.addEventListener('keydown', onKey); PP.onLeave=()=>document.removeEventListener('keydown', onKey);
  function finish(){
    document.removeEventListener('keydown', onKey);
    const xp = mode==='daily' ? 10+known : Math.max(3, Math.round(known/2)); PP.addXP(xp, '单词卡');
    wrap.append(h('div',{class:'result-box'}, h('div',{class:'big'}, known, h('small',{},` / ${total}`)), h('div',{}, h('div',{class:'bold', style:'font-size:18px'},'本轮完成'), h('div',{class:'small', style:'opacity:.8'}, `认识 ${known} · 不认识 ${unknown} · 不认识的明天再来 · +${xp} XP`))));
    if (again.length) wrap.append(h('div',{class:'card tight'}, h('h3',{class:'mb'},'再看一眼'), h('div',{class:'missed'}, ...again.map(cd=>h('span',{}, `${cd.w} — ${cd.zh}`)))));
    const btns=h('div',{class:'row gap center'});
    if (onDone) btns.append(h('button',{class:'btn btn-primary btn-lg', on:{click:()=>onDone({known,unknown})}},'完成，返回今日 →')); else btns.append(h('button',{class:'btn btn-primary btn-lg', on:{click:()=>PP.navigate('vocab')}},'返回'));
    if (again.length) btns.append(h('button',{class:'btn', on:{click:()=>VOCAB.run({cards:again, mode:'again'})}},'把不认识的再过一遍'));
    wrap.append(btns);
  }
  show();
};
PP.pages.vocab = (c) => {
  const st=VOCAB.stats();
  c.append(PP.pageHead('单词卡', '按“间隔重复”安排：认识的卡片间隔越来越长，不认识的明天再来。射击游戏漏掉的词会自动加进来。'));
  c.append(h('div',{class:'grid4 mb'}, h('div',{class:'stat'}, h('div',{class:'v'},st.total), h('div',{class:'k'},'卡片总数')), h('div',{class:'stat'}, h('div',{class:'v', style:'color:var(--ok)'},st.learned), h('div',{class:'k'},'已掌握（盒子 ≥3）')), h('div',{class:'stat'}, h('div',{class:'v', style:'color:var(--speak)'},st.due), h('div',{class:'k'},'今天到期')), h('div',{class:'stat'}, h('div',{class:'v'},st.fresh), h('div',{class:'k'},'还没见过'))));
  c.append(h('div',{class:'row gap mb'}, h('button',{class:'btn btn-vocab btn-lg', on:{click:()=>VOCAB.run({count:10})}},'▶ 复习 10 张'), h('button',{class:'btn btn-lg', on:{click:()=>VOCAB.run({count:20})}},'复习 20 张'), h('button',{class:'btn btn-lg btn-ghost', on:{click:()=>PP.navigate('shoot')}},'🚀 去玩单词射击')));
  const topics=[...new Set(D.vocab.map(v=>v.t))]; const TN={school:'学校',hobbies:'爱好',sport:'运动',food:'食物',travel:'旅行',home:'家庭生活',weather:'天气与自然',feelings:'感受与性格',shopping:'购物',health:'健康',tech:'科技',verbs:'常用动词与短语',linking:'连接与观点'};
  const extra=PP.state.extraCards||[];
  if (extra.length) c.append(h('div',{class:'card tight'}, h('div',{class:'row between mb'}, h('h3',{},'🚀 射击漏掉的词'), h('button',{class:'btn btn-sm', on:{click:()=>VOCAB.run({cards:PP.shuffle(extra).slice(0,15), mode:'again'})}},'专练这些')), h('div',{class:'missed'}, ...extra.slice(-40).map(cd=>h('span',{}, `${cd.w} — ${cd.zh}`)))));
  for (const t of topics){ const list=D.vocab.filter(v=>v.t===t); const body=h('div',{class:'set-list', style:'display:none'}, ...list.map(v=>{ const s=VOCAB.info(v.w); return h('div',{class:'set-row', style:'cursor:default'}, h('span',{class:'t'}, h('b',{},v.w), ' ', h('span',{class:'small muted'},v.p), ' — ', v.zh, h('div',{class:'small muted', style:'font-weight:600;font-family:var(--serif)'}, v.ex)), s?h('span',{class:'pill '+(s.box>=3?'ok':'')}, `盒子 ${s.box}`):h('span',{class:'pill'},'新'), h('button',{class:'btn btn-sm btn-ghost', on:{click:()=>PP.speak(v.w+'. '+v.ex)}},'🔊')); })); const headEl=h('div',{class:'row between', style:'cursor:pointer'}, h('h3',{}, `${TN[t]||t} `, h('span',{class:'pill vocab'}, list.length)), h('div',{class:'row gap'}, h('button',{class:'btn btn-sm', on:{click:e=>{ e.stopPropagation(); VOCAB.run({cards:PP.shuffle(list).slice(0,12), mode:'topic'}); }}},'练这组'), h('span',{class:'muted'},'▾'))); headEl.addEventListener('click',()=>{ body.style.display=body.style.display==='none'?'flex':'none'; }); c.append(h('div',{class:'card tight'}, headEl, h('div',{class:'mt'}, body))); }
};
})();
