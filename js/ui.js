/* PET 90 — shell: sidebar, routing, modal, mascot */
(function(){
const PP = window.PP;
PP.pages = {};
PP.route = {name:'today', params:{}};
const NAV = [
  ['today','🏠','今日任务'], ['plan','🗺️','学习地图'], ['reading','📖','阅读训练'], ['listening','🎧','听力训练'], ['speaking','🎙️','口语训练'],
  ['vocab','🃏','单词卡'], ['shoot','🚀','单词射击'], ['mock','🏆','模考'], ['history','📕','记录'], ['lessons','📚','教程'], ['progress','📈','成绩'], ['settings','⚙️','设置']
];
// ---- mascot: "Peti" the star-cat
PP.mascot = (mood='happy', size=96) => {
  const eyes = mood==='cheer'
    ? `<path d="M35 61 q9 -11 18 0" stroke="#3c3c3c" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M67 61 q9 -11 18 0" stroke="#3c3c3c" stroke-width="4" fill="none" stroke-linecap="round"/>`
    : `<circle cx="44" cy="62" r="9" fill="#fff"/><circle cx="76" cy="62" r="9" fill="#fff"/><circle cx="46" cy="63" r="5" fill="#3c3c3c"/><circle cx="78" cy="63" r="5" fill="#3c3c3c"/><circle cx="48" cy="61" r="1.8" fill="#fff"/><circle cx="80" cy="61" r="1.8" fill="#fff"/>`
      + (mood==='think' ? `<path d="M36 50 l16 -4" stroke="#3c3c3c" stroke-width="3.5" stroke-linecap="round"/>` : '');
  const mouth = mood==='cheer' ? `<path d="M47 77 q13 16 26 0 z" fill="#3c3c3c"/><path d="M53 84 q7 6 14 0 z" fill="#ff86d0"/>`
    : mood==='think' ? `<path d="M52 82 h16" stroke="#3c3c3c" stroke-width="4" stroke-linecap="round"/>`
    : `<path d="M49 79 q11 10 22 0" stroke="#3c3c3c" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const svg = `<svg viewBox="0 0 120 120" width="${size}" height="${size}" class="mascot ${mood}" style="width:${size}px;height:${size}px" aria-hidden="true">
  <path d="M27 46 L20 12 L54 31 Z" fill="#ffcf5c" stroke="#e5a500" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M93 46 L100 12 L66 31 Z" fill="#ffcf5c" stroke="#e5a500" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M31 40 L27 21 L46 32 Z" fill="#ff9fb5"/><path d="M89 40 L93 21 L74 32 Z" fill="#ff9fb5"/>
  <circle cx="60" cy="67" r="43" fill="#ffcf5c" stroke="#e5a500" stroke-width="3.5"/>
  <circle cx="34" cy="78" r="7.5" fill="#ff9fb5" opacity=".85"/><circle cx="86" cy="78" r="7.5" fill="#ff9fb5" opacity=".85"/>
  ${eyes}
  <path d="M56 71 h8 l-4 4z" fill="#e5a500"/>
  ${mouth}
  <path d="M60 8 l3 6 6 1 -4.5 4.5 1 6.5 -5.5 -3 -5.5 3 1 -6.5 -4.5 -4.5 6 -1z" fill="#ffc800" stroke="#e5a500" stroke-width="2" stroke-linejoin="round" transform="translate(0,-2)"/>
  </svg>`;
  const wrap = document.createElement('span'); wrap.innerHTML = svg; return wrap.firstElementChild;
};
PP.say = (text, mood='happy', size=88) => PP.h('div',{class:'mascot-row'}, PP.mascot(mood,size), PP.h('div',{class:'mascot-say'}, text));
PP.renderSidebar = () => {
  const sb = PP.$('#sidebar'); sb.innerHTML='';
  const p = PP.state.profile;
  sb.append(PP.h('div',{class:'brand'}, PP.h('div',{class:'brand-mark'}, PP.mascot('happy',52)), PP.h('div',{}, PP.h('div',{class:'brand-name'},'PET 90'), PP.h('div',{class:'brand-sub'}, p.name ? `${p.name} 的英语冒险` : '阅读 · 口语 · 单词'))));
  const nav = PP.h('nav',{class:'nav'});
  for (const [name, icon, label] of NAV){
    nav.append(PP.h('a',{class:'nav-item'+(PP.route.name===name?' active':''), href:'#'+name, dataset:{page:name}, on:{click:e=>{e.preventDefault(); PP.navigate(name);}}}, PP.h('span',{class:'nav-icon'},icon), PP.h('span',{},label)));
  }
  sb.append(nav);
  sb.append(PP.h('div',{class:'xpbox', id:'xpbox'}));
  PP.updateXPBar();
};
PP.updateXPBar = () => {
  const b = PP.$('#xpbox'); if(!b) return; const lv = PP.levelInfo(PP.state.xp); const st = PP.streak();
  b.innerHTML='';
  b.append(PP.h('div',{class:'streak-card'}, PP.h('span',{class:'fire'}, st>0?'🔥':'🧊'), PP.h('div',{}, PP.h('b',{}, st), PP.h('span',{}, st>0?'天连续练习':'今天开始连胜！'))));
  b.append(PP.h('div',{class:'xp-card'}, PP.h('div',{class:'xp-top'}, PP.h('span',{}, `${PP.state.xp} XP`), PP.h('span',{class:'xp-lv'}, `Lv.${lv.level}`)), PP.h('div',{class:'xp-title'}, lv.title), PP.h('div',{class:'xp-bar'}, PP.h('i',{style:`width:${lv.pct}%`})), PP.h('div',{class:'xp-meta'}, lv.pct>=100?'满级！':`再 ${lv.need-lv.into} XP 升级`)));
};
PP.main = null;
PP.navigate = (name, params={}) => {
  PP.stopSpeak(); if (PP.onLeave){ try{PP.onLeave();}catch(e){} PP.onLeave=null; }
  PP.route = {name, params};
  PP.$$('.nav-item').forEach(a=>a.classList.toggle('active', a.dataset.page===name));
  const m = PP.$('#main'); m.innerHTML=''; m.scrollTop=0; window.scrollTo(0,0);
  PP.main = m;
  const page = PP.pages[name] || PP.pages.today;
  page(m, params);
  try { history.replaceState(null,'','#'+name); } catch(e){}
};
PP.modal = (content, opts={}) => {
  const root = PP.$('#modal-root'); root.innerHTML='';
  const box = PP.h('div',{class:'modal-box '+(opts.wide?'wide':'')});
  if (opts.title) box.append(PP.h('div',{class:'modal-head'}, PP.h('h3',{},opts.title), opts.noClose?null:PP.h('button',{class:'icon-btn', on:{click:()=>PP.closeModal()}},'✕')));
  box.append(PP.h('div',{class:'modal-body'}, content));
  const back = PP.h('div',{class:'modal-back', on:{click:e=>{ if(e.target===back && !opts.noClose) PP.closeModal(); }}}, box);
  root.append(back); requestAnimationFrame(()=>back.classList.add('show'));
  return box;
};
PP.closeModal = () => { const root=PP.$('#modal-root'); root.innerHTML=''; };
PP.confirm = (msg, onYes) => {
  const c = PP.h('div',{}, PP.say(msg,'think',72), PP.h('div',{class:'row gap mt'}, PP.h('button',{class:'btn btn-primary', on:{click:()=>{PP.closeModal(); onYes();}}},'确定'), PP.h('button',{class:'btn', on:{click:()=>PP.closeModal()}},'取消')));
  PP.modal(c, {title:'请确认'});
};
PP.card = (cls, ...kids) => PP.h('section',{class:'card '+(cls||'')}, ...kids);
PP.pageHead = (title, sub, right) => PP.h('header',{class:'page-head'}, PP.h('div',{}, PP.h('h1',{},title), sub?PP.h('p',{class:'sub'},sub):null), right||null);
PP.timerEl = () => { const el = PP.h('div',{class:'timer'}, '0:00'); let start=Date.now(), iv=null, limit=0; const api={ el, start(lim){ limit=lim||0; start=Date.now(); iv=setInterval(()=>{ const s=(Date.now()-start)/1000; el.textContent=PP.fmtTime(s); el.classList.toggle('over', limit&&s>limit); },250); }, stop(){ clearInterval(iv); return (Date.now()-start)/1000; }, secs(){ return (Date.now()-start)/1000; } }; return api; };
PP.countdown = (secs, onEnd) => { const el=PP.h('div',{class:'timer big'}, PP.fmtTime(secs)); let left=secs, iv=setInterval(()=>{ left--; el.textContent=PP.fmtTime(left); if(left<=60) el.classList.add('over'); if(left<=0){ clearInterval(iv); onEnd&&onEnd(); } },1000); return { el, stop(){ clearInterval(iv); return secs-left; }, left(){ return left; } }; };
})();
