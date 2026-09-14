/* PET 90 — Progress page: KPIs, accuracy by part, shooter bests, 90-day strip, history, export/import */
(function(){
const PP=window.PP, h=PP.h;
function bars(items, opts={}){
  const wrap=h('div',{class:'bars '+(opts.cls||'')});
  const max=opts.max||Math.max(1,...items.map(i=>i.v||0));
  for (const it of items){ const v=it.v; const empty=v===null||v===undefined; const pct=empty?0:Math.round(v/max*100); wrap.append(h('div',{class:'bar'+(empty?' empty':''), title:empty?`${it.label}：还没有记录`:`${it.label}：${it.text||v}`}, h('b',{}, empty?'—':(it.text||v)), h('i',{style:`height:${Math.max(2,pct)}%`}), h('span',{}, it.label))); }
  return wrap;
}
PP.pages.progress = (c) => {
  const s=PP.state, M=PP.PLAN.PART_META, R=PP.READ;
  const daysDone = Object.keys(s.days).filter(d=>{ const p=PP.PLAN.dayProgress(+d); return p.done>0; }).length;
  const daysFull = Object.keys(s.days).filter(d=>{ const p=PP.PLAN.dayProgress(+d); return p.done>=p.total; }).length;
  const isRead = r => /^p[1-6]$/.test(r.part);
  const recent = s.results.filter(isRead).slice(-12); const avg = recent.length? Math.round(recent.reduce((a,r)=>a+r.score/r.total,0)/recent.length*100) : null;
  const est = avg===null?null:PP.MOCK.estimate(avg);
  const spk = s.speaking; const spkSecs=spk.reduce((a,x)=>a+x.secs,0);
  const vs=PP.VOCAB.stats(); const shootBest = s.shoot.length?Math.max(...s.shoot.map(x=>x.score)):0;
  const lv=PP.levelInfo(s.xp);
  c.append(PP.pageHead('成绩', '所有数据保存在这台电脑的浏览器里。定期用下方“导出”备份。'));
  c.append(h('div',{class:'grid4 mb'},
    h('div',{class:'stat'}, h('div',{class:'v'}, `${daysFull}`, h('span',{class:'small muted'},` / 90`)), h('div',{class:'k'}, `全部完成的天数（有练习 ${daysDone} 天）`)),
    h('div',{class:'stat'}, h('div',{class:'v'}, PP.streak()+' 🔥'), h('div',{class:'k'},'连续练习天数')),
    h('div',{class:'stat'}, h('div',{class:'v', style:'color:var(--read)'}, avg===null?'—':avg+'%'), h('div',{class:'k'},'最近 12 次阅读正确率')),
    h('div',{class:'stat'}, h('div',{class:'v', style:'color:var(--vocab)'}, `Lv.${lv.level}`), h('div',{class:'k'}, `${lv.title} · ${s.xp} XP`))));
  const target=s.profile.target||140;
  c.append(h('div',{class:'card'}, h('div',{class:'row between wrap gap'}, h('div',{}, h('h3',{},'阅读估分'), h('p',{class:'small muted'}, '按旧版原始分经验换算：70% ≈ 140，85% ≈ 153，90% ≈ 160。只反映阅读单卷，仅供参考。')), est?h('div',{class:'pill '+(est.cls==='good'?'ok':est.cls==='mid'?'warn':'bad'), style:'font-size:15px;padding:8px 16px'}, est.band):h('span',{class:'pill'},'还没有阅读记录')),
    h('div',{class:'row gap mt'}, h('span',{class:'small'}, `目标：${target} 分（${target>=160?'B2 Distinction':target>=153?'Merit':'Pass'}），需要阅读稳定 ≥ ${target>=160?90:target>=153?85:70}%`))));
  const ws = PP.HIST.stats();
  c.append(h('div',{class:'card'}, h('div',{class:'row between wrap gap'},
    h('div',{}, h('h3',{},'📕 错题本'), h('p',{class:'small muted'}, ws.total?`累计错过 ${ws.total} 道，其中 ${ws.open} 道还没订正。点进去可以逐题看解析、写笔记、重做。`:'还没有错题记录。')),
    h('div',{class:'row gap'}, ws.open?h('span',{class:'pill bad', style:'font-size:15px;padding:8px 16px'}, `${ws.open} 道待订正`):h('span',{class:'pill ok'},'全部订正 🎉'), h('button',{class:'btn btn-read', on:{click:()=>PP.navigate('history',{tab:'wrong'})}},'打开错题本')))));
  const partItems=['p1','p2','p3','p4','p5','p6'].map(p=>{ const v=R.recentAvg(p,3); return {label:`${M[p].name}`, v, text:v===null?null:v+'%'}; });
  const LM=PP.PLAN.LPART_META;
  const lAvg=(p,n=3)=>{ const rs=s.results.filter(r=>r.part===p).slice(-n); if(!rs.length) return null; return Math.round(rs.reduce((a,r)=>a+r.score/r.total,0)/rs.length*100); };
  const lItems=['l1','l2','l3','l4'].map(p=>{ const v=lAvg(p); return {label:LM[p].name, v, text:v===null?null:v+'%'}; });
  const lRecs=s.results.filter(r=>/^l[1-4]$/.test(r.part));
  const lPct=lRecs.length?Math.round(lRecs.reduce((a,r)=>a+r.score/r.total,0)/lRecs.length*100):null;
  c.append(h('div',{class:'card'}, h('div',{class:'row between wrap gap'},
    h('div',{}, h('h3',{},'🎧 听力'), h('p',{class:'small muted'}, lRecs.length?`练过 ${lRecs.length} 组，平均正确率 ${lPct}%。听力是电脑朗读，考前务必用官方真录音适应一次。`:'还没有听力记录。')),
    h('div',{class:'row gap'}, lPct!==null?h('span',{class:'pill '+(lPct>=85?'ok':lPct>=70?'warn':'bad'), style:'font-size:15px;padding:8px 16px'}, lPct+'%'):null,
      h('button',{class:'btn btn-listen', on:{click:()=>PP.navigate('listening')}},'去练听力'))),
    lRecs.length?bars(lItems,{max:100, cls:'listen'}):null, lRecs.length?h('div',{style:'height:22px'}):null));
  c.append(h('div',{class:'grid2'},
    h('div',{class:'card'}, h('h3',{},'阅读各部分正确率（最近 3 次平均）'), h('p',{class:'small muted'},'低于 70% 的部分先补方法课。'), bars(partItems,{max:100}), h('div',{style:'height:22px'})),
    h('div',{class:'card'}, h('h3',{},'单词射击 · 各字母最高分'), h('p',{class:'small muted'}, `共 ${s.shoot.length} 局 · 最高 ${shootBest} 分`), bars(PP.SHOOT.groups.map(g=>{ const b=PP.SHOOT.best(g.id); return {label:g.id, v:b||null}; }),{cls:'shoot'}), h('div',{style:'height:22px'}))));
  const strip=h('div',{class:'strip'}); const ti=PP.PLAN.todayIndex();
  for (let d=1; d<=90; d++){ const p=PP.PLAN.dayProgress(d); const lvl=p.done===0?0:p.done>=p.total?3:p.done>=p.total/2?2:1; strip.append(h('i',{class:`l${lvl}`+(d===ti?' today':''), title:`Day ${d}：${p.done}/${p.total}`, on:{click:()=>PP.navigate('today',{day:d})}})); }
  c.append(h('div',{class:'card'}, h('div',{class:'row between mb'}, h('h3',{},'90 天热力条'), h('span',{class:'small muted'},'点格子跳到那一天')), strip));
  c.append(h('div',{class:'grid2'},
    h('div',{class:'card'}, h('h3',{class:'mb'},'口语'), h('div',{class:'grid2'}, h('div',{class:'stat'}, h('div',{class:'v'}, spk.length), h('div',{class:'k'},'录音段数')), h('div',{class:'stat'}, h('div',{class:'v'}, PP.fmtTime(spkSecs)), h('div',{class:'k'},'开口总时长')), h('div',{class:'stat'}, h('div',{class:'v'}, spk.length?(spk.slice(-10).reduce((a,x)=>a+x.score,0)/Math.min(10,spk.length)).toFixed(1):'—'), h('div',{class:'k'},'最近 10 段平均估分')), h('div',{class:'stat'}, h('div',{class:'v'}, spk.length?Math.round(spk.slice(-10).reduce((a,x)=>a+x.words,0)/Math.min(10,spk.length)):'—'), h('div',{class:'k'},'最近 10 段平均词数')))),
    h('div',{class:'card'}, h('h3',{class:'mb'},'单词'), h('div',{class:'grid2'}, h('div',{class:'stat'}, h('div',{class:'v'}, vs.learned), h('div',{class:'k'},'已掌握卡片')), h('div',{class:'stat'}, h('div',{class:'v'}, vs.seen), h('div',{class:'k'},'见过的卡片')), h('div',{class:'stat'}, h('div',{class:'v'}, vs.due), h('div',{class:'k'},'今天到期')), h('div',{class:'stat'}, h('div',{class:'v'}, (s.extraCards||[]).length), h('div',{class:'k'},'射击漏掉→加入卡片'))))));
  const rs=s.results.slice(-15).reverse();
  if (rs.length){
    const isL=p=>/^l[1-4]$/.test(p);
    const metaOf=p=>isL(p)?LM[p]:M[p];
    const setOf=(p,id)=>isL(p)?PP.LISTEN.getSet(p,id):R.getSet(p,id);
    const t=h('table',{class:'tbl'}, h('tr',{}, h('th',{},'日期'), h('th',{},'卷'), h('th',{},'部分'), h('th',{},'组'), h('th',{},'得分'), h('th',{},'用时'), h('th',{},'模式')));
    rs.forEach(r=>{ const mt=metaOf(r.part); if(!mt) return; const set=setOf(r.part,r.setId); const pct=Math.round(r.score/r.total*100);
      t.append(h('tr',{}, h('td',{}, new Date(r.ts).toLocaleDateString('zh-CN',{month:'numeric',day:'numeric'})),
        h('td',{}, h('span',{class:isL(r.part)?'pill listen':'pill read'}, isL(r.part)?'🎧 听力':'📖 阅读')),
        h('td',{}, mt.name+' '+mt.zh), h('td',{class:'small'}, set?set.title:r.setId),
        h('td',{class:'score '+R.scoreClass(pct)}, `${r.score}/${r.total} (${pct}%)`),
        h('td',{}, r.secs?PP.fmtTime(r.secs):'—'),
        h('td',{class:'small muted'}, {daily:'每日',free:'自由',mock:'模考',review:'复盘'}[r.mode]||r.mode))); });
    c.append(h('div',{class:'card'}, h('h3',{class:'mb'},'最近的练习记录'), t)); }
  const exp=h('button',{class:'btn', on:{click:()=>{ const blob=new Blob([PP.exportState()],{type:'application/json'}); const a=h('a',{href:URL.createObjectURL(blob), download:`pet90-backup-${PP.today()}.json`}); document.body.append(a); a.click(); a.remove(); }}},'⬇ 导出备份');
  const file=h('input',{type:'file', accept:'.json', style:'display:none'}); file.addEventListener('change',()=>{ const f=file.files[0]; if(!f) return; f.text().then(txt=>{ try{ PP.importState(txt); PP.toast('已导入'); PP.renderSidebar(); PP.navigate('progress'); }catch(e){ PP.toast('文件无效','bad'); } }); });
  const mfile=h('input',{type:'file', accept:'.json', style:'display:none'});
  mfile.addEventListener('change',()=>{ const f=mfile.files[0]; if(!f) return; f.text().then(txt=>{ try{ const added=PP.mergeState(txt); const msg=Object.entries(added).filter(([k,v])=>v>0).map(([k,v])=>`${k} +${v}`).join('，')||'没有新增记录（可能已经合并过）'; PP.toast('合并完成：'+msg); PP.renderSidebar(); PP.navigate('progress'); }catch(e){ PP.toast('文件无效','bad'); } }); });
  c.append(h('div',{class:'card'}, h('h3',{class:'mb'},'数据搬家'),
    h('p',{class:'small muted'},'进度存在当前这个版本的浏览器/App 里。网页版、桌面版、本地版是各自独立的三份数据——换版本用下面的导出/合并把记录搬过去。录音不含在备份里。'),
    h('div',{class:'row gap wrap'}, exp,
      h('button',{class:'btn btn-primary', on:{click:()=>mfile.click()}},'🔀 合并导入（推荐）'), mfile,
      h('button',{class:'btn', on:{click:()=>PP.confirm('覆盖导入会丢掉本机现有记录，确定吗？（一般用「合并导入」更安全）', ()=>file.click())}},'⬆ 覆盖导入'), file,
      h('button',{class:'btn', style:'color:var(--bad)', on:{click:()=>PP.confirm('清空全部记录和设置？此操作不可撤销。', ()=>{ PP.resetState(); PP.renderSidebar(); location.reload(); })}},'清空全部数据')),
    h('div',{class:'why mt'}, h('b',{},'合并导入 '), '= 把另一台设备的练习记录并进来，两边的都保留，重复的自动跳过。')));
};
})();
