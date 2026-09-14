/* PET 90 — core helpers, state, speech, audio, XP */
(function(){
const PP = window.PP = {};
PP.$ = (s, r=document) => r.querySelector(s);
PP.$$ = (s, r=document) => Array.from(r.querySelectorAll(s));
PP.esc = s => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
PP.h = function(tag, attrs, ...kids){
  const el = document.createElement(tag);
  if (attrs) for (const [k,v] of Object.entries(attrs)){
    if (v==null || v===false) continue;
    if (k==='class') el.className = v;
    else if (k==='html') el.innerHTML = v;
    else if (k==='text') el.textContent = v;
    else if (k==='style') el.style.cssText = v;
    else if (k==='on') for (const [e,f] of Object.entries(v)) el.addEventListener(e,f);
    else if (k==='dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v===true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)){
    if (kid==null || kid===false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
};
// ---- dates
const pad = n => String(n).padStart(2,'0');
PP.today = () => { const d=new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
PP.parseDate = s => { const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); };
PP.addDays = (s,n) => { const d=PP.parseDate(s); d.setDate(d.getDate()+n); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
PP.daysBetween = (a,b) => Math.round((PP.parseDate(b)-PP.parseDate(a))/86400000);
PP.fmtTime = s => { s=Math.max(0,Math.round(s)); return `${Math.floor(s/60)}:${pad(s%60)}`; };
PP.fmtDate = s => { const d=PP.parseDate(s); return `${d.getMonth()+1}月${d.getDate()}日`; };
PP.shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
PP.rand = n => Math.floor(Math.random()*n);
PP.clamp = (v,a,b) => Math.max(a, Math.min(b, v));
// ---- state
const KEY = 'petprep.v1';
const DEFAULT = () => ({ profile:{name:'', start:'', target:140, examDate:'', voice:''}, days:{}, results:[], speaking:[], shoot:[], srs:{}, extraCards:[], xp:0, mocks:[], activity:{}, lessonsRead:{}, fixed:{}, notes:{} });
function load(){ try { const raw=localStorage.getItem(KEY); if(!raw) return DEFAULT(); const s=JSON.parse(raw); return Object.assign(DEFAULT(), s); } catch(e){ return DEFAULT(); } }
PP.state = load();
PP.save = () => { try { localStorage.setItem(KEY, JSON.stringify(PP.state)); } catch(e){ console.warn('save failed', e); } };
PP.resetState = () => { PP.state = DEFAULT(); PP.save(); };
PP.exportState = () => JSON.stringify(PP.state, null, 1);
PP.importState = json => { const s=JSON.parse(json); if(!s||!s.profile) throw new Error('bad file'); PP.state=Object.assign(DEFAULT(), s); PP.save(); };
// 合并导入：把另一台设备的记录并进来，不覆盖本机已有的
PP.mergeState = json => {
  const inc=JSON.parse(json); if(!inc||!inc.profile) throw new Error('bad file');
  const cur=PP.state, added={阅读:0, 口语:0, 射击:0, 模考:0, 单词卡:0, 天:0};
  const keyOf = r => `${r.ts}|${r.part||''}|${r.setId||r.itemId||r.group||''}`;
  const mergeList = (name, label) => {
    const have=new Set((cur[name]||[]).map(keyOf));
    for (const r of (inc[name]||[])) if(!have.has(keyOf(r))){ cur[name].push(r); have.add(keyOf(r)); added[label]++; }
    cur[name].sort((a,b)=>a.ts-b.ts);
  };
  mergeList('results','阅读'); mergeList('speaking','口语'); mergeList('shoot','射击'); mergeList('mocks','模考');
  for (const [w,v] of Object.entries(inc.srs||{})){ const c=cur.srs[w]; if(!c || (v.seen||0)>(c.seen||0)){ cur.srs[w]=v; added.单词卡++; } }
  for (const c of (inc.extraCards||[])) if(!cur.extraCards.some(x=>x.w===c.w)) cur.extraCards.push(c);
  for (const [d,v] of Object.entries(inc.days||{})){ if(!cur.days[d]){ cur.days[d]=v; added.天++; } else { cur.days[d].done=Object.assign({}, v.done||{}, cur.days[d].done||{}); } }
  Object.assign(cur.activity, inc.activity||{});
  Object.assign(cur.lessonsRead, inc.lessonsRead||{});
  Object.assign(cur.fixed, inc.fixed||{});
  cur.xp = Math.max(cur.xp||0, inc.xp||0);
  if (!cur.profile.name && inc.profile.name) cur.profile.name = inc.profile.name;
  if (!cur.profile.start || (inc.profile.start && inc.profile.start < cur.profile.start)) cur.profile.start = inc.profile.start || cur.profile.start;
  if (!cur.profile.examDate && inc.profile.examDate) cur.profile.examDate = inc.profile.examDate;
  PP.save(); return added;
};
// ---- 录音库（IndexedDB：localStorage 存不下音频）
const AUDIO_DB='petprep-audio', AUDIO_STORE='clips', AUDIO_KEEP=80;
let _db=null;
function db(){ return new Promise((res,rej)=>{ if(_db) return res(_db); let r; try{ r=indexedDB.open(AUDIO_DB,1); }catch(e){ return rej(e); }
  r.onupgradeneeded=()=>{ const d=r.result; if(!d.objectStoreNames.contains(AUDIO_STORE)) d.createObjectStore(AUDIO_STORE,{keyPath:'id'}); };
  r.onsuccess=()=>{ _db=r.result; res(_db); }; r.onerror=()=>rej(r.error); }); }
PP.audio = {
  async save(id, blob, meta){ try{ const d=await db(); await new Promise((res,rej)=>{ const t=d.transaction(AUDIO_STORE,'readwrite'); t.objectStore(AUDIO_STORE).put(Object.assign({id, blob, ts:Date.now()}, meta||{})); t.oncomplete=res; t.onerror=()=>rej(t.error); }); this.prune(); return true; }catch(e){ console.warn('audio save failed', e); return false; } },
  async get(id){ try{ const d=await db(); return await new Promise((res,rej)=>{ const t=d.transaction(AUDIO_STORE,'readonly'); const q=t.objectStore(AUDIO_STORE).get(id); q.onsuccess=()=>res(q.result||null); q.onerror=()=>rej(q.error); }); }catch(e){ return null; } },
  async list(){ try{ const d=await db(); return await new Promise((res,rej)=>{ const t=d.transaction(AUDIO_STORE,'readonly'); const q=t.objectStore(AUDIO_STORE).getAll(); q.onsuccess=()=>res((q.result||[]).sort((a,b)=>b.ts-a.ts)); q.onerror=()=>rej(q.error); }); }catch(e){ return []; } },
  async remove(id){ try{ const d=await db(); await new Promise(res=>{ const t=d.transaction(AUDIO_STORE,'readwrite'); t.objectStore(AUDIO_STORE).delete(id); t.oncomplete=res; t.onerror=res; }); }catch(e){} },
  async prune(){ try{ const all=await this.list(); for(const c of all.slice(AUDIO_KEEP)) await this.remove(c.id); }catch(e){} },
  async size(){ try{ const all=await this.list(); return {n:all.length, bytes:all.reduce((a,c)=>a+((c.blob&&c.blob.size)||0),0)}; }catch(e){ return {n:0,bytes:0}; } }
};
PP.touchActivity = () => { PP.state.activity[PP.today()] = true; };
PP.streak = () => {
  const act = PP.state.activity; let d = PP.today(); let n = 0;
  if (!act[d]) d = PP.addDays(d,-1);
  while (act[d]) { n++; d = PP.addDays(d,-1); }
  return n;
};
// ---- XP & levels
PP.LEVELS = [0,120,300,550,900,1350,1900,2600,3400,4300,5300,6500,8000,10000,12500];
PP.TITLES = ['小小新手 🐣','学徒 🌱','探险家 🧭','神射手 🎯','高手 ⭐','大师 👑','传奇 🦄','宗师 🏆'];
PP.levelInfo = xp => {
  let lv=0; while (lv+1<PP.LEVELS.length && xp>=PP.LEVELS[lv+1]) lv++;
  const base=PP.LEVELS[lv], next=PP.LEVELS[Math.min(lv+1,PP.LEVELS.length-1)];
  return { level:lv+1, title:PP.TITLES[Math.min(Math.floor(lv/2), PP.TITLES.length-1)], into:xp-base, need:Math.max(1,next-base), pct: lv+1>=PP.LEVELS.length ? 100 : Math.round((xp-base)/(next-base)*100) };
};
PP.addXP = (n, why) => {
  if (!n) return;
  const before = PP.levelInfo(PP.state.xp).level;
  PP.state.xp += n; PP.touchActivity(); PP.save();
  const after = PP.levelInfo(PP.state.xp).level;
  PP.toast(`+${n} XP · ${why||''}`, 'xp');
  if (after>before) { setTimeout(()=>{ PP.toast(`🎉 升级！Lv.${after} ${PP.levelInfo(PP.state.xp).title}`, 'level'); PP.confetti(); }, 600); }
  if (PP.updateXPBar) PP.updateXPBar();
};
// ---- toast & confetti
PP.toast = (msg, kind) => {
  const root = PP.$('#toast-root'); if(!root) return;
  const t = PP.h('div', {class:'toast '+(kind||'')}, msg);
  root.append(t); requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(), 400); }, kind==='level'?4000:2600);
};
PP.confetti = () => {
  const colors = ['#ffb703','#e2553d','#1d7a74','#6d4fb3','#2b6cb0','#2f9e44'];
  const root = PP.h('div', {class:'confetti'});
  for (let i=0;i<60;i++){ const s=PP.h('i',{style:`left:${Math.random()*100}%;background:${colors[i%colors.length]};animation-delay:${Math.random()*0.8}s;animation-duration:${1.8+Math.random()*1.4}s;transform:rotate(${Math.random()*360}deg)`}); root.append(s); }
  document.body.append(root); setTimeout(()=>root.remove(), 3600);
};
// ---- speech synthesis
let voices = [];
function loadVoices(){ voices = (window.speechSynthesis && speechSynthesis.getVoices()) || []; }
if (window.speechSynthesis){ loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
PP.voiceList = () => voices.filter(v => /^en/i.test(v.lang));
PP.pickVoice = () => {
  const want = PP.state.profile.voice;
  if (want){ const v = voices.find(v=>v.name===want); if (v) return v; }
  const prefs = ['Google UK English Female','Google UK English Male','Daniel','Kate','Serena','Moira','Samantha','Google US English'];
  for (const p of prefs){ const v = voices.find(v=>v.name===p); if (v) return v; }
  return voices.find(v=>/en-GB/i.test(v.lang)) || voices.find(v=>/en-US/i.test(v.lang)) || voices.find(v=>/^en/i.test(v.lang)) || null;
};
PP.speak = (text, opts={}) => new Promise(res => {
  if (!window.speechSynthesis){ res(false); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = PP.pickVoice(); if (v) u.voice = v;
  u.lang = (v && v.lang) || 'en-GB'; u.rate = opts.rate || 0.92; u.pitch = 1;
  u.onend = () => res(true); u.onerror = () => res(false);
  speechSynthesis.speak(u);
});
PP.stopSpeak = () => { if (window.speechSynthesis) speechSynthesis.cancel(); };
PP.SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
// ---- tiny synth sounds
let actx = null;
function ctx(){ if(!actx){ try { actx = new (window.AudioContext||window.webkitAudioContext)(); } catch(e){} } return actx; }
PP.beep = kind => {
  const c = ctx(); if(!c) return; const t = c.currentTime;
  const play = (type, f0, f1, dur, gain=0.08) => { const o=c.createOscillator(), g=c.createGain(); o.type=type; o.frequency.setValueAtTime(f0,t); o.frequency.exponentialRampToValueAtTime(f1,t+dur); g.gain.setValueAtTime(gain,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); o.connect(g).connect(c.destination); o.start(t); o.stop(t+dur+0.02); };
  if (kind==='shot') play('square', 880, 220, 0.12, 0.05);
  else if (kind==='hit'){ play('triangle', 523, 1046, 0.18, 0.08); play('triangle', 659, 1318, 0.22, 0.05); }
  else if (kind==='wrong') play('sawtooth', 200, 80, 0.25, 0.07);
  else if (kind==='miss') play('sine', 300, 60, 0.4, 0.09);
  else if (kind==='ok') play('sine', 660, 990, 0.12, 0.06);
  else if (kind==='tick') play('sine', 1200, 1200, 0.03, 0.03);
};
// ---- transcript analysis helpers
PP.tokens = s => String(s||'').toLowerCase().replace(/[^a-z' ]+/g,' ').split(/\s+/).filter(Boolean);
PP.countPhrases = (text, phrases) => { const t=' '+String(text||'').toLowerCase().replace(/[^a-z' ]+/g,' ').replace(/\s+/g,' ')+' '; let n=0; const found=[]; for (const p of phrases){ const re=new RegExp('\\b'+p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','g'); const m=t.match(re); if(m){ n+=m.length; found.push(p);} } return {n, found}; };
})();
