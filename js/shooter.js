/* PET 90 — Word Shooter: canvas arcade game, one letter group per day.
   Modes: listen (hear the word first, then shoot it — default), zh2en (see Chinese, shoot English), en2zh (see/hear English, shoot Chinese) */
(function(){
const PP=window.PP, D=window.PET_DATA, h=PP.h;
const SHOOT = PP.SHOOT = {};
SHOOT.groups = D.wordGroups;
SHOOT.MODES = { listen:{label:'🔊 先听后打', desc:'先播放单词读音，再击落它；听完后显示中文提示'}, zh2en:{label:'看中文 → 打英文', desc:'顶部显示中文，击落对应英文'}, en2zh:{label:'看英文 → 打中文', desc:'顶部显示并朗读英文，击落中文意思'} };
SHOOT.wordsFor = gid => { const g=D.wordGroups.find(x=>x.id===gid); const out=[]; for(const L of g.letters) for(const e of D.wordlist[L]){ const [w,p,zh]=e.split('|'); out.push({w,p,zh}); } return out; };
SHOOT.best = gid => { const rs=PP.state.shoot.filter(s=>s.group===gid); return rs.length?Math.max(...rs.map(s=>s.score)):0; };
const W=960, H=600, HUD=78;
const DIFF = { easy:{speed:0.7, meteors:4, targets:12, label:'轻松'}, normal:{speed:1, meteors:5, targets:15, label:'标准'}, hard:{speed:1.45, meteors:6, targets:20, label:'困难'} };
function Game(canvas, {words, mode, difficulty, onFinish, speed}){
  let speedMult = speed||1;
  const ctx=canvas.getContext('2d'); const dpr=Math.min(2, window.devicePixelRatio||1);
  canvas.width=W*dpr; canvas.height=H*dpr; ctx.scale(dpr,dpr);
  const cfg=DIFF[difficulty]||DIFF.normal;
  const label = w => mode==='en2zh' ? w.zh : w.w;           // text on meteors
  const queue = PP.shuffle(words).slice(0, Math.min(cfg.targets, words.length));
  let meteors=[], lasers=[], particles=[], stars=[], floats=[];
  let target=null, qi=0, score=0, combo=0, best=0, hits=0, wrong=0, lives=3, missed=[], level=1, running=false, last=0, shake=0, flash=0, raf=0, elapsed=0;
  let speaking=false, hintShown=false, hintTimer=0, canShoot=true, speakT=0;
  for(let i=0;i<150;i++) stars.push({x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.6+0.3, s:0.2+Math.random()*0.8});
  const shipX=W/2, shipY=H-38;
  const FONT_M = "700 20px Nunito, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  const FONT_ZH = "900 30px Nunito, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  function textW(t, font){ ctx.font=font; return ctx.measureText(t).width; }
  function freeNum(){ const used=new Set(meteors.map(m=>m.num)); for(let n=1;n<=9;n++) if(!used.has(n)) return n; return 0; }
  function onScreen(w){ return meteors.some(m=>m.word===w && !m.dead); }
  function spawn(word){
    const tw=textW(label(word), FONT_M); const r=Math.max(34, tw/2+18);
    let x=r+20+Math.random()*(W-2*r-40), tries=0;
    while(tries++<14 && meteors.some(m=>Math.abs(m.x-x)<r+m.r+10 && m.y<HUD+120)) x=r+20+Math.random()*(W-2*r-40);
    const base = (26 + level*7) * cfg.speed;
    meteors.push({word, x, y:HUD-30-Math.random()*70, vy:base*(0.8+Math.random()*0.45), r, num:freeNum(), wob:Math.random()*Math.PI*2, dead:false, shakeT:0});
  }
  function spawnDistractor(){ const pool=words.filter(w=>w!==target && !onScreen(w)); if(!pool.length) return; spawn(pool[PP.rand(pool.length)]); }
  function fill(){ if(target && !onScreen(target)) spawn(target); while(meteors.filter(m=>!m.dead).length<cfg.meteors) spawnDistractor(); }
  function speakTarget(){
    if(!target) return; speaking=true; speakT=0; hintShown=false; clearTimeout(hintTimer);
    const done=()=>{ speaking=false; hintShown=true; };
    hintTimer=setTimeout(done, 2600);                       // safety: reveal hint even if onend never fires
    PP.speak(target.w,{rate:0.9}).then(ok=>{ clearTimeout(hintTimer); if(!ok) done(); else setTimeout(done, 250); });
  }
  function newTarget(){
    if(qi>=queue.length){ finish(); return; }
    target=queue[qi]; fill();
    if(mode==='listen' || mode==='en2zh') speakTarget(); else { speaking=false; hintShown=true; }
  }
  function explode(x,y,color){ for(let i=0;i<26;i++){ const a=Math.random()*Math.PI*2, v=60+Math.random()*220; particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:0.5+Math.random()*0.5,t:0,c:color,r:2+Math.random()*3}); } }
  function fire(m){
    if(!running||m.dead) return;
    lasers.push({x2:m.x,y2:m.y,t:0}); PP.beep('shot');
    if(m.word===target){
      const bonus=Math.round((1-m.y/H)*50); const gain=100+combo*15+bonus; score+=gain; combo++; best=Math.max(best,combo); hits++; qi++;
      m.dead=true; explode(m.x,m.y,'#ffd166'); floats.push({x:m.x,y:m.y,t:0,text:'+'+gain+(combo>2?' ×'+combo:'')}); floats.push({x:m.x,y:m.y+26,t:-0.15,text:m.word.w+'  '+m.word.zh, small:true}); PP.beep('hit');
      if(mode==='zh2en') PP.speak(m.word.w,{rate:1});
      level=1+Math.floor(hits/5);
      setTimeout(()=>{ if(running) newTarget(); }, mode==='zh2en'?150:650);
    } else {
      wrong++; combo=0; score=Math.max(0,score-20); m.shakeT=0.45; shake=0.25; flash=0.25; PP.beep('wrong'); floats.push({x:m.x,y:m.y,t:0,text:'-20',bad:true});
    }
  }
  function miss(m){ lives--; missed.push(m.word); PP.beep('miss'); flash=0.5; shake=0.35; floats.push({x:W/2,y:H-110,t:0,text:'漏掉：'+m.word.w+'  '+m.word.zh,bad:true}); combo=0; qi++; if(lives<=0){ finish(); return; } newTarget(); }
  function update(dt){
    elapsed+=dt; if(speaking) speakT+=dt;
    for(const s of stars){ s.y+=s.s*12*dt; if(s.y>H) s.y=0; }
    for(const m of meteors){ if(m.dead) continue; m.y+=m.vy*speedMult*dt; m.wob+=dt*2; if(m.shakeT>0) m.shakeT-=dt; if(m.y-m.r>H){ m.dead=true; if(m.word===target) miss(m); } }
    meteors=meteors.filter(m=>!m.dead);
    if(running) fill();
    for(const l of lasers) l.t+=dt; lasers=lasers.filter(l=>l.t<0.18);
    for(const p of particles){ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=200*dt; } particles=particles.filter(p=>p.t<p.life);
    for(const f of floats) f.t+=dt; floats=floats.filter(f=>f.t<1.3);
    if(shake>0) shake-=dt; if(flash>0) flash-=dt;
  }
  function roundRect(x,y,w,hh,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+hh,r); ctx.arcTo(x+w,y+hh,x,y+hh,r); ctx.arcTo(x,y+hh,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
  function drawHud(){
    ctx.fillStyle='#0b1020'; ctx.fillRect(0,0,W,HUD); ctx.fillStyle='rgba(255,209,102,.25)'; ctx.fillRect(0,HUD-1,W,1);
    ctx.textBaseline='middle'; ctx.textAlign='left';
    ctx.fillStyle='rgba(255,255,255,.6)'; ctx.font="800 12px Nunito, 'PingFang SC', sans-serif";
    const modeText = mode==='listen' ? '听读音，击落这个单词' : mode==='zh2en' ? '击落这个意思的英文单词' : '击落这个单词的中文意思';
    ctx.fillText(modeText, 18, 18);
    // prompt
    let prompt='', dim=false;
    if(mode==='zh2en') prompt=target?target.zh:'';
    else if(mode==='en2zh') prompt=target?target.w:'';
    else { if(hintShown) prompt=target?target.zh:''; else { prompt='正在朗读…'; dim=true; } }
    // speaker icon (clickable)
    const sx=18, sy=50;
    if(mode!=='zh2en'){ ctx.fillStyle=speaking?'#ffd166':'rgba(255,255,255,.75)'; ctx.font="26px system-ui, 'Apple Color Emoji', sans-serif"; ctx.fillText('🔊', sx, sy); if(speaking){ const k=Math.floor(speakT*6)%3; ctx.strokeStyle='rgba(255,209,102,.7)'; ctx.lineWidth=2; for(let i=0;i<=k;i++){ ctx.beginPath(); ctx.arc(sx+18, sy, 20+i*8, -0.6, 0.6); ctx.stroke(); } } }
    const px = mode!=='zh2en' ? sx+64 : 18; const pw = prompt ? textW(prompt, FONT_ZH) : 0;
    ctx.fillStyle=dim?'rgba(255,255,255,.45)':'#ffd166'; ctx.font=FONT_ZH; ctx.fillText(prompt, px, sy);
    if(mode!=='zh2en'){ ctx.fillStyle='rgba(255,255,255,.45)'; ctx.font="700 12px Nunito, 'PingFang SC', sans-serif"; ctx.fillText('空格键 / 点喇叭 = 再听一遍', px + pw + 18, sy+1); }
    // right side stats
    ctx.textAlign='right'; ctx.fillStyle='#fff'; ctx.font="900 22px Nunito, sans-serif"; ctx.fillText(String(score), W-18, 24);
    ctx.font="800 12px Nunito, 'PingFang SC', sans-serif"; ctx.fillStyle='rgba(255,255,255,.6)'; ctx.fillText('得分', W-18-textW(String(score),"900 22px Nunito, sans-serif")-8, 24);
    let hearts=''; for(let i=0;i<3;i++) hearts += i<lives?'❤️':'🖤'; ctx.font="18px system-ui, 'Apple Color Emoji', sans-serif"; ctx.fillText(hearts, W-18, 54);
    ctx.font="800 14px Nunito, 'PingFang SC', sans-serif"; ctx.fillStyle='rgba(255,255,255,.85)'; ctx.fillText(`${hits}/${queue.length}  ·  Lv ${level}  ·  ${speedMult.toFixed(1)}x${combo>1?'  ·  连击 ×'+combo:''}`, W-90, 54);
    ctx.textAlign='left';
  }
  function draw(){
    ctx.save(); if(shake>0) ctx.translate((Math.random()-0.5)*8,(Math.random()-0.5)*8);
    const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0b1020'); g.addColorStop(1,'#141c3a'); ctx.fillStyle=g; ctx.fillRect(-10,-10,W+20,H+20);
    ctx.fillStyle='#fff'; for(const s of stars){ ctx.globalAlpha=0.35+s.s*0.5; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=1;
    ctx.strokeStyle='rgba(255,99,71,.35)'; ctx.setLineDash([8,10]); ctx.beginPath(); ctx.moveTo(0,H-70); ctx.lineTo(W,H-70); ctx.stroke(); ctx.setLineDash([]);
    for(const m of meteors){ const wob=Math.sin(m.wob)*3; const sx=m.shakeT>0?(Math.random()-0.5)*8:0;
      ctx.save(); ctx.translate(m.x+sx, m.y+wob);
      ctx.fillStyle=m.shakeT>0?'#7a2b2b':'#2c3560'; ctx.strokeStyle=m.shakeT>0?'#ff6b6b':'#6f7fc4'; ctx.lineWidth=2;
      roundRect(-m.r, -24, m.r*2, 48, 22); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#ffd166'; ctx.beginPath(); ctx.arc(-m.r+2, -24, 11, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#0b1020'; ctx.font='900 12px Nunito, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(String(m.num), -m.r+2, -23);
      ctx.fillStyle='#fff'; ctx.font=FONT_M; ctx.fillText(label(m.word), 0, 1);
      ctx.restore(); }
    for(const l of lasers){ ctx.strokeStyle=`rgba(255,209,102,${1-l.t/0.18})`; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(shipX,shipY-18); ctx.lineTo(l.x2,l.y2); ctx.stroke(); }
    for(const p of particles){ ctx.globalAlpha=1-p.t/p.life; ctx.fillStyle=p.c; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=1;
    for(const f of floats){ if(f.t<0) continue; ctx.globalAlpha=1-f.t/1.3; ctx.fillStyle=f.bad?'#ff6b6b':f.small?'#fff':'#ffd166'; ctx.font=f.small?"700 16px Nunito, 'PingFang SC', sans-serif":"900 20px Nunito, 'PingFang SC', sans-serif"; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(f.text, f.x, f.y-f.t*36); } ctx.globalAlpha=1;
    ctx.save(); ctx.translate(shipX,shipY); ctx.fillStyle='#ffd166'; ctx.beginPath(); ctx.moveTo(0,-22); ctx.lineTo(18,14); ctx.lineTo(0,6); ctx.lineTo(-18,14); ctx.closePath(); ctx.fill(); ctx.fillStyle='#ff6b35'; ctx.beginPath(); ctx.moveTo(-7,12); ctx.lineTo(0,26+Math.random()*8); ctx.lineTo(7,12); ctx.closePath(); ctx.fill(); ctx.restore();
    drawHud();
    if(flash>0){ ctx.fillStyle=`rgba(255,60,60,${flash*0.5})`; ctx.fillRect(0,0,W,H); }
    ctx.restore();
  }
  function loop(ts){ if(!running) return; const dt=Math.min(0.05,(ts-last)/1000||0); last=ts; update(dt); draw(); raf=requestAnimationFrame(loop); }
  function finish(){ if(!running) return; running=false; cancelAnimationFrame(raf); clearTimeout(hintTimer); PP.stopSpeak(); draw(); const acc = hits+wrong>0 ? Math.round(hits/(hits+wrong)*100) : 0; onFinish({score, hits, wrong, missed, acc, best, secs:Math.round(elapsed), lives}); }
  canvas.addEventListener('click', e=>{ if(!running) return; const rect=canvas.getBoundingClientRect(); const x=(e.clientX-rect.left)*W/rect.width, y=(e.clientY-rect.top)*H/rect.height;
    if(y<HUD){ if(mode!=='zh2en' && x<120) speakTarget(); return; }
    let hit=null, bd=1e9; for(const m of meteors){ if(m.dead) continue; const dx=x-m.x, dy=y-m.y; if(Math.abs(dx)<m.r+8 && Math.abs(dy)<32){ const d=dx*dx+dy*dy; if(d<bd){ bd=d; hit=m; } } } if(hit) fire(hit); });
  const keyH = e=>{ if(!running) return; if(e.key==='-' || e.key==='_'){ e.preventDefault(); api.setSpeed(Math.max(0.4, +(speedMult-0.1).toFixed(1))); onSpeed&&onSpeed(speedMult); return; } if(e.key==='=' || e.key==='+'){ e.preventDefault(); api.setSpeed(Math.min(2.5, +(speedMult+0.1).toFixed(1))); onSpeed&&onSpeed(speedMult); return; } if(e.code==='Space' || e.key==='r' || e.key==='R'){ e.preventDefault(); if(mode!=='zh2en') speakTarget(); return; } const n=parseInt(e.key,10); if(n>=1&&n<=9){ const m=meteors.find(m=>m.num===n&&!m.dead); if(m){ e.preventDefault(); fire(m); } } };
  document.addEventListener('keydown', keyH);
  let onSpeed=null;
  const api = {
    start(){ running=true; last=performance.now(); qi=0; newTarget(); raf=requestAnimationFrame(loop); },
    stop(){ running=false; cancelAnimationFrame(raf); clearTimeout(hintTimer); document.removeEventListener('keydown', keyH); },
    setSpeed(v){ speedMult=v; }, getSpeed(){ return speedMult; }, onSpeed(fn){ onSpeed=fn; }
  };
  return api;
}
SHOOT.run = ({groupId, mode='listen', difficulty='normal', day=null, runMode='free', onDone=null}) => {
  const c=PP.main; c.innerHTML='';
  const words=SHOOT.wordsFor(groupId), best=SHOOT.best(groupId);
  const canvas=h('canvas',{width:W,height:H});
  const arena=h('div',{class:'arena'}, canvas);
  const head=h('div',{class:'runner-head', style:'position:static;padding-top:0'}, h('div',{}, h('div',{class:'row gap'}, h('span',{class:'pill shoot'},'单词射击'), h('span',{class:'pill'}, `字母 ${groupId} · ${words.length} 词 · ${DIFF[difficulty].label} · ${SHOOT.MODES[mode].label}`), runMode==='daily'?h('span',{class:'pill accent'},'今日任务'):null)), h('div',{class:'row gap'}, h('span',{class:'small muted'}, best?`最高 ${best} 分`:'首次挑战'), h('button',{class:'btn btn-ghost btn-sm', on:{click:()=>{ game&&game.stop(); PP.stopSpeak(); PP.navigate(runMode==='daily'?'today':'shoot', runMode==='daily'?{day}:{}); }}},'退出')));
  const howto = mode==='listen' ? '玩法：先听单词读音，再点击写着这个单词的陨石（或按陨石上的数字键）。听完会显示中文提示；空格键或点喇叭可再听一遍。击中 +100 起步、连击加成；点错 −20；目标陨石落地掉一条命。' : mode==='zh2en' ? '玩法：顶部显示中文，点击对应英文的陨石或按数字键。击中会朗读单词。点错 −20；目标陨石落地掉一条命。' : '玩法：顶部显示并朗读英文，点击对应中文意思的陨石或按数字键。点错 −20；目标陨石落地掉一条命。';
  let game=null;
  let speed = +(PP.state.profile.shootSpeed||1);
  const range=h('input',{type:'range', min:'0.4', max:'2.5', step:'0.1', value:String(speed)});
  const val=h('span',{class:'val'}, speed.toFixed(1)+'x');
  const setSpeed=v=>{ speed=+(+v).toFixed(1); range.value=String(speed); val.textContent=speed.toFixed(1)+'x'; PP.state.profile.shootSpeed=speed; PP.save(); game&&game.setSpeed(speed); };
  range.addEventListener('input',()=>setSpeed(range.value));
  const speedbar=h('div',{class:'speedbar'}, h('span',{class:'bold small'},'陨石速度'), h('button',{class:'btn btn-sm', on:{click:()=>setSpeed(Math.max(0.4,speed-0.1))}},'🐢 慢'), range, h('button',{class:'btn btn-sm', on:{click:()=>setSpeed(Math.min(2.5,speed+0.1))}},'快 🐇'), val, h('span',{class:'small muted'},'游戏中也能拖；键盘 − / ＝'));
  c.append(head, arena, speedbar, h('p',{class:'small muted', style:'margin-top:6px'}, howto));
  const overlay=h('div',{class:'overlay'}, h('h2',{},'准备好了吗？'), h('p',{}, `字母 ${groupId}：${words.length} 个 PET 单词 · ${SHOOT.MODES[mode].desc}。`), h('p',{style:'opacity:.75'}, `击落 ${DIFF[difficulty].targets} 个目标即通关，3 条命。`), h('div',{class:'row gap'}, h('button',{class:'btn btn-accent btn-lg', on:{click:()=>{ PP.beep('tick'); PP.speak('Ready?'); overlay.remove(); countdown(); }}},'▶ 开始')));
  arena.append(overlay);
  function countdown(){ let n=3; const o=h('div',{class:'overlay', style:'background:rgba(11,16,32,.4)'}, h('h2',{style:'font-size:80px'},'3')); arena.append(o); const iv=setInterval(()=>{ n--; if(n<=0){ clearInterval(iv); o.remove(); begin(); } else { o.querySelector('h2').textContent=n; PP.beep('tick'); } },700); }
  function begin(){
    game=Game(canvas,{words,mode,difficulty,speed,onFinish:(r)=>{
      const prev=SHOOT.best(groupId); const isBest=r.score>prev;
      PP.state.shoot.push({ts:Date.now(), day, group:groupId, mode, difficulty, speed, score:r.score, hits:r.hits, wrong:r.wrong, acc:r.acc, missed:r.missed.map(w=>w.w), secs:r.secs}); PP.save();
      if (PP.VOCAB) PP.VOCAB.addMissed(r.missed);
      const xp=Math.max(5, Math.round(r.score/25)); PP.addXP(xp, '单词射击');
      if(isBest && prev>0) setTimeout(()=>PP.confetti(), 200);
      const ov=h('div',{class:'overlay'}, h('h2',{}, r.lives>0?'通关！🎉':'游戏结束'), h('div',{style:'font-size:52px;font-weight:900'}, r.score, h('span',{style:'font-size:18px;opacity:.7'},' 分')), isBest?h('div',{class:'pill accent'},'🏆 新纪录！'):h('div',{style:'opacity:.7'}, `最高 ${Math.max(prev,r.score)} 分`), h('p',{}, `命中 ${r.hits} · 点错 ${r.wrong} · 准确率 ${r.acc}% · 最高连击 ×${r.best} · +${xp} XP`),
        r.missed.length?h('div',{}, h('div',{style:'opacity:.8;margin-bottom:6px'}, `漏掉 ${r.missed.length} 个词（已加入单词卡）：`), h('div',{class:'missed', style:'justify-content:center'}, ...r.missed.map(w=>h('span',{style:'background:#3a2030;color:#ffb4b4;cursor:pointer', on:{click:()=>PP.speak(w.w)}}, `🔊 ${w.w} ${w.zh}`)))):h('div',{style:'color:#9fd6a8'},'一个都没漏，太强了！'),
        h('div',{class:'row gap', style:'margin-top:10px'}, onDone?h('button',{class:'btn btn-accent btn-lg', on:{click:()=>onDone(r)}},'完成，返回今日 →'):null, h('button',{class:'btn btn-lg', style:'background:#fff', on:{click:()=>SHOOT.run({groupId,mode,difficulty,day,runMode,onDone})}},'再来一局'), onDone?null:h('button',{class:'btn btn-lg btn-ghost', style:'color:#fff', on:{click:()=>PP.navigate('shoot')}},'换字母')));
      arena.append(ov);
    }});
    game.onSpeed(v=>setSpeed(v)); game.start();
  }
  PP.onLeave=()=>{ game&&game.stop(); PP.stopSpeak(); };
};
PP.pages.shoot = (c, params={}) => {
  const todayPlan = PP.PLAN.dayPlan(PP.PLAN.todayIndex());
  let gid = params.groupId || todayPlan.shoot.group, mode='listen', diff='normal';
  c.append(PP.pageHead('单词射击', '每天一个字母。默认「先听后打」：先播放单词读音，再击落它——练听力和拼写。击中朗读，漏掉的词自动进单词卡。'));
  const groups=h('div',{class:'groups mb'});
  const btns={};
  const refresh=()=>{ for(const g of SHOOT.groups){ btns[g.id].classList.toggle('sel', g.id===gid); } };
  for (const g of SHOOT.groups){ const b=SHOOT.best(g.id); btns[g.id]=h('button',{class:'gbtn', on:{click:()=>{ gid=g.id; refresh(); }}}, g.id, h('small',{}, b?`${b}分`:`${SHOOT.wordsFor(g.id).length}词`)); groups.append(btns[g.id]); }
  refresh();
  function seg(items, cur, onSel){ const el=h('div',{class:'seg'}); items.forEach(([v,l])=>{ const b=h('button',{class:v===cur?'on':'', on:{click:()=>{ el.querySelectorAll('button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); onSel(v); }}}, l); el.append(b); }); return el; }
  const segMode=seg([['listen','🔊 先听后打'],['zh2en','看中文→打英文'],['en2zh','看英文→打中文']], mode, v=>mode=v);
  const segDiff=seg([['easy','轻松'],['normal','标准'],['hard','困难']], diff, v=>diff=v);
  c.append(h('div',{class:'card'}, h('div',{class:'row between wrap gap mb'}, h('div',{}, h('h3',{},'选择字母关卡'), h('div',{class:'small muted'}, `今日推荐：字母 ${todayPlan.shoot.group}`)), h('div',{class:'row gap wrap'}, segMode, segDiff)), groups, h('div',{class:'row gap'}, h('button',{class:'btn btn-shoot btn-lg', on:{click:()=>SHOOT.run({groupId:gid, mode, difficulty:diff})}},'🚀 开始射击'), h('span',{class:'small muted'},'鼠标点击陨石或按数字键 1–9；空格键再听一遍；速度可在游戏里随时调'))));
  const hist=PP.state.shoot.slice(-12).reverse();
  if (hist.length){ const t=h('table',{class:'tbl'}, h('tr',{}, h('th',{},'日期'), h('th',{},'字母'), h('th',{},'模式'), h('th',{},'得分'), h('th',{},'命中/点错'), h('th',{},'准确率'), h('th',{},'漏掉'))); hist.forEach(s=>t.append(h('tr',{}, h('td',{}, new Date(s.ts).toLocaleDateString('zh-CN',{month:'numeric',day:'numeric'})), h('td',{class:'bold'}, s.group), h('td',{}, (SHOOT.MODES[s.mode]||{}).label||s.mode), h('td',{class:'bold'}, s.score), h('td',{}, `${s.hits} / ${s.wrong}`), h('td',{}, s.acc+'%'), h('td',{class:'small'}, (s.missed||[]).join(', ')||'—')))); c.append(h('div',{class:'card'}, h('h3',{class:'mb'},'最近战绩'), t)); }
};
})();
