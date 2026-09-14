// 教程课（中文讲解 + 英文示例）。sections: [{h, html}]
window.PET_DATA = window.PET_DATA || {};
PET_DATA.lessons = [
{ id:'L0', part:'overview', title:'PET 考试全貌：考什么、怎么算分、这个 App 练什么', minutes:8, sections:[
 { h:'PET 是什么', html:`<p><b>PET = B1 Preliminary</b>（剑桥通用五级第二级）。青少年版叫 <b>B1 Preliminary for Schools</b>，题型、评分、证书与成人版完全相同，只是话题更贴近校园生活。本 App 按 for Schools 的话题编排。</p>` },
 { h:'四张试卷', html:`<table class="tbl"><tr><th>试卷</th><th>时长</th><th>结构</th><th>占比</th></tr>
<tr><td>Reading 阅读</td><td>45 分钟</td><td>6 部分，32 题</td><td>25%</td></tr>
<tr><td>Writing 写作</td><td>45 分钟</td><td>2 部分（邮件 + 文章/故事，各约 100 词）</td><td>25%</td></tr>
<tr><td>Listening 听力</td><td>约 30 分钟</td><td>4 部分，25 题</td><td>25%</td></tr>
<tr><td>Speaking 口语</td><td>12–17 分钟</td><td>4 部分，两名考生一组，两名考官</td><td>25%</td></tr></table>
<p>本 App 练 <b>Reading + Listening + Speaking</b>（合计 75%）。Writing 请用官方免费样题（cambridgeenglish.org → B1 Preliminary for Schools → Exam preparation → Sample papers）。</p>
<p class="note">听力录音由电脑朗读（可调语速），不是真人录音。真考是英式真人录音、带口音和背景噪音，考前一定要用官方样题的真录音再适应一次。</p>` },
 { h:'分数怎么算', html:`<p>成绩用 <b>剑桥英语量表（Cambridge English Scale）</b>报告，PET 的报告区间是 120–170：</p>
<table class="tbl"><tr><th>分数</th><th>等级</th><th>证书</th></tr>
<tr><td>160–170</td><td>Grade A（Pass with Distinction）</td><td>B2 级证书</td></tr>
<tr><td>153–159</td><td>Grade B（Pass with Merit）</td><td>B1 级证书</td></tr>
<tr><td>140–152</td><td>Grade C（Pass）</td><td>B1 级证书</td></tr>
<tr><td>120–139</td><td>未通过</td><td>A2 级证书</td></tr></table>
<p>四张卷各算一个分数，总分是四卷平均。<b>140 = 通过线，160 = B2 线。</b>经验换算（旧版原始分标准）：阅读正确率约 70% ≈ 140，85% ≈ 153，90% ≈ 160。本 App 的“预估分数”就按这个经验换算，只作参考。</p>` },
 { h:'阅读 6 部分速览', html:`<table class="tbl"><tr><th>部分</th><th>题数</th><th>考什么</th><th>建议用时</th></tr>
<tr><td>Part 1 告示/短信</td><td>5</td><td>读懂标牌、短信、邮件的真正意思</td><td>5 分钟</td></tr>
<tr><td>Part 2 人物配对</td><td>5</td><td>5 个人 ↔ 8 段短文，找完全满足条件的那个</td><td>8 分钟</td></tr>
<tr><td>Part 3 长文选择</td><td>5</td><td>细节、观点、态度、主旨</td><td>8 分钟</td></tr>
<tr><td>Part 4 句子填空</td><td>5</td><td>从 8 句里选 5 句填回文章，考上下文衔接</td><td>8 分钟</td></tr>
<tr><td>Part 5 词汇完形</td><td>6</td><td>四选一，考词汇搭配</td><td>6 分钟</td></tr>
<tr><td>Part 6 语法填空</td><td>6</td><td>不给选项，一空一词，考语法</td><td>6 分钟</td></tr></table>
<p>合计 41 分钟，留 4 分钟涂答题卡和检查。<b>答案必须写在答题卡上</b>，写在试卷上不算分。</p>` },
 { h:'口语 4 部分速览', html:`<table class="tbl"><tr><th>部分</th><th>时长</th><th>形式</th></tr>
<tr><td>Part 1 问答</td><td>约 2 分钟</td><td>考官逐个问个人问题（名字、住哪、爱好、学校）</td></tr>
<tr><td>Part 2 图片描述</td><td>约 3 分钟</td><td>每人一张彩色照片，独自描述约 1 分钟</td></tr>
<tr><td>Part 3 合作讨论</td><td>约 4 分钟</td><td>两名考生看一张情境图（5 个选项），一起讨论并做决定</td></tr>
<tr><td>Part 4 深入讨论</td><td>约 3 分钟</td><td>考官围绕 Part 3 的话题问更开放的问题</td></tr></table>
<p>评分四维（各 0–5 分）：<b>Grammar and Vocabulary</b>（语法词汇）、<b>Discourse Management</b>（能不能连贯地说一段）、<b>Pronunciation</b>（发音）、<b>Interactive Communication</b>（互动：会接话、会提问、会让对方说）。另有一名考官给整体分。</p>` },
 { h:'这个 App 怎么用', html:`<ol><li><b>每天一练</b>：打开“今日任务”，25 分钟左右：1 个阅读部分（限时）+ 1 个口语任务（录音）+ 10 张单词卡。</li><li><b>先学后练</b>：每个部分第一次出现前，会安排一节教程（就是你现在看的这种）。</li><li><b>周日复盘</b>：回看本周错题和录音。</li><li><b>第 9 周起模考</b>：每周一次完整阅读模考（45 分钟）+ 一次完整口语模拟。</li></ol>
<p>考位提醒：国内 PET for Schools 考位紧张，请尽早在剑桥官方渠道关注报名时间，并把考试日期填进 App 设置。</p>` }
]},

{ id:'L1', part:'p1', title:'阅读 Part 1：告示与短信——读懂“真正的意思”', minutes:6, sections:[
 { h:'题型', html:`<p>5 段真实生活中的短文本：标牌、告示、便条、短信、邮件。每段配 3 个句子（A/B/C），选出<b>与原文意思一致</b>的那句。</p>` },
 { h:'三步法', html:`<ol><li><b>先看它是什么</b>：标牌？短信？谁写给谁？在哪里出现？（题目上方通常有提示）</li><li><b>找出“核心动作”</b>：这段文字想让读者做什么 / 知道什么？通常是一句祈使句或一个条件（must / can / if / only / until）。</li><li><b>逐个排除</b>：三个选项里有两个是“陷阱”——用了原文里的词，但意思被改了。</li></ol>` },
 { h:'四种常见陷阱', html:`<table class="tbl"><tr><th>陷阱</th><th>例子</th></tr>
<tr><td>把“条件”当“事实”</td><td>原文 <i>If found, please take it to the office</i>（如果找到）→ 选项 “Someone found a bag”（有人已经找到）✗</td></tr>
<tr><td>范围放大</td><td>原文 <i>Half price on all winter coats</i> → 选项 “Everything is half price” ✗</td></tr>
<tr><td>时间/人物换掉</td><td>原文 <i>Trains to the airport now leave from Platform 5</i> → 选项 “Platform 5 is closed” ✗</td></tr>
<tr><td>反义</td><td>原文 <i>Drivers do not give change</i> → 选项 “Drivers will give you change” ✗</td></tr></table>` },
 { h:'高频词', html:`<p><b>must / have to</b>（必须）· <b>can / are allowed to</b>（可以）· <b>only</b>（仅限）· <b>unless</b>（除非）· <b>until</b>（直到）· <b>up to</b>（最多）· <b>at least</b>（至少）· <b>in advance</b>（提前）· <b>available</b>（可获得）· <b>free</b>（免费）· <b>exchange / refund</b>（换货/退款）· <b>pick up</b>（接/取）· <b>let sb know</b>（告知）</p>` },
 { h:'练习方式', html:`<p>每题 1 分钟。做完看解析时，把选错的那道题的“陷阱类型”记下来。同一种陷阱错两次以上，就是你的弱点。</p>` }
]},

{ id:'L2', part:'p2', title:'阅读 Part 2：人物配对——三条件全满足才算对', minutes:6, sections:[
 { h:'题型', html:`<p>左边 5 个人，每人一段描述（通常包含 <b>3 个要求</b>）；右边 8 段短文（A–H，比如 8 本书 / 8 个景点 / 8 个夏令营）。给每个人选最合适的一段。8 段里有 3 段是干扰项。</p>` },
 { h:'方法：画线 → 打勾', html:`<ol><li><b>先读人物</b>，把每个人的要求用笔画出来，一般是 3 条：<i>Ola wants to <u>make things with her hands</u>. She is only free <u>on Fridays</u>, and she <u>can't afford materials</u>.</i></li><li><b>再扫 8 段短文</b>，找到满足第 1 条的候选（通常 2 段）。</li><li><b>用第 2、3 条淘汰</b>：干扰项的设计就是“满足两条、违反一条”。比如 Art Club 也是周五、也是动手，但要求“自带材料”——不行。</li><li>做完 5 个人，检查每个字母只用一次。</li></ol>` },
 { h:'干扰项长什么样', html:`<ul><li><b>同一话题不同条件</b>：两个都是航海课，一个“欢迎零基础”，一个“不适合初学者”。</li><li><b>否定词</b>：<i>no café</i> / <i>not suitable for beginners</i> / <i>cannot be brought in</i>。</li><li><b>数字和时间</b>：年龄段、星期几、几点结束、价格。</li></ul>` },
 { h:'时间分配', html:`<p>8 分钟。人物读 1 分钟，短文扫 3 分钟，配对 3 分钟，检查 1 分钟。不要按 A→H 顺序精读，要<b>带着人物的条件去找</b>。</p>` }
]},

{ id:'L3', part:'p3', title:'阅读 Part 3：长文选择——题干顺序 = 文章顺序', minutes:7, sections:[
 { h:'题型', html:`<p>一篇 350–400 词的文章（通常写一个人的经历、采访、博客），5 道四选一。考：细节、原因、态度感受、主旨、以及“这个人会怎么说”。</p>` },
 { h:'核心规律', html:`<ul><li><b>题目顺序和文章顺序一致</b>：第 1 题在第 1 段附近，第 5 题在末段。第 5 题常是全文总结题。</li><li><b>先读题干，不读选项</b>：把 5 个题干读一遍，知道要找什么，再读文章。读到答案位置时再看选项。</li><li><b>同义替换</b>：题目不会照抄原文。<i>hardest</i> = <i>most difficult</i>；<i>frightening</i> = <i>nervous</i>；<i>raise money for the shelter where she helps</i> = <i>help an organisation she works with</i>。</li></ul>` },
 { h:'四类题怎么答', html:`<table class="tbl"><tr><th>题型</th><th>题干特征</th><th>怎么找</th></tr>
<tr><td>细节题</td><td>What / When / Why did…</td><td>定位关键词，看前后两句</td></tr>
<tr><td>态度题</td><td>How did X feel… / What does X think about…</td><td>找 <i>says / thinks / admits / remembers</i> 后面的引语和情感词</td></tr>
<tr><td>主旨题</td><td>What is the writer's main purpose…</td><td>看整篇讲的是什么，排除只讲一段的选项</td></tr>
<tr><td>“会怎么说”题</td><td>What would X say… / Which sentence best describes…</td><td>每个选项都要和原文对一遍，找唯一不冲突的</td></tr></table>` },
 { h:'排除法', html:`<p>错误选项通常：① 说了文章没说的事；② 用了原文的词但意思反了；③ 只对了一半（前半句对，后半句错，如 “badly organised <u>from beginning to end</u>”）。</p>` }
]},

{ id:'L4', part:'p4', title:'阅读 Part 4：句子填空——看指代词和连接词', minutes:7, sections:[
 { h:'题型', html:`<p>一篇文章被抽走 5 句，给你 8 句（A–H），选 5 句填回去。3 句是干扰项。考的是<b>上下文衔接</b>，不是词汇。</p>` },
 { h:'四个线索', html:`<table class="tbl"><tr><th>线索</th><th>例子</th></tr>
<tr><td><b>指代词</b> she / he / it / this / they / them</td><td>后一句 “<u>She</u> gave me three bean bags” → 空里必须先出现一个女性（my aunt）</td></tr>
<tr><td><b>连接词</b> but / though / so / also / then</td><td>后一句 “After a few minutes, <u>though</u>…” → 空里是相反的情况（孩子们起初害羞）</td></tr>
<tr><td><b>时间顺序</b> at first / then / by the end / now</td><td>先有 “We put posters”，才能有 “The posters had a photo”</td></tr>
<tr><td><b>话题一致</b></td><td>前一句说“食物垃圾最让人吃惊”，空里必须继续说食物垃圾</td></tr></table>` },
 { h:'步骤', html:`<ol><li>先通读全文（跳过空），知道故事讲什么。</li><li>逐空看<b>前一句和后一句</b>，圈出指代词/连接词。</li><li>先填最有把握的空，把用过的字母划掉。</li><li>最后把整段连起来读一遍：读着别扭就换。</li></ol>` },
 { h:'识别干扰项', html:`<p>干扰句常常是“看起来相关的常识”（<i>Plastic takes hundreds of years to break down</i>）或“和文章矛盾的细节”（文章说朋友，干扰句说弟弟）。它们放进任何一个空，前后都接不上。</p>` }
]},

{ id:'L5', part:'p5', title:'阅读 Part 5：词汇完形——看空格的左右邻居', minutes:6, sections:[
 { h:'题型', html:`<p>一篇 150 词短文，6 个空，每空 4 个选项。4 个选项<b>词性相同、意思相近</b>（比如 afford / pay / spend / cost），考的是哪个词能和前后的词搭配。</p>` },
 { h:'方法', html:`<ol><li>先读完整篇，知道大意。</li><li>回到每个空，<b>看空格左右各 3 个词</b>：后面跟什么介词？前面是什么名词？</li><li>把 4 个选项逐个代入读一遍，哪个“听起来像英语”就是哪个。</li><li>不确定就先排除：介词不对的（cause <s>to</s>）、语法不对的（most <s>hard</s>）。</li></ol>` },
 { h:'高频考点', html:`<ul><li><b>动词 + 介词</b>：lead <b>to</b> / spread <b>to</b> / worried <b>about</b> / afraid <b>of</b> / pay <b>for</b>。</li><li><b>固定搭配</b>：pay attention · make it possible · set up · sort out · take part · have fun · for example · at least。</li><li><b>近义词区分</b>：fee（会费）/ fare（车费）/ price（价格）；trip / journey / travel；borrow / lend；take（花时间，主语是 it）/ spend（主语是人）。</li><li><b>-ed 和 -ing</b>：I'm bored（我感到无聊）vs. It's boring（它很无聊）。</li></ul>` }
]},

{ id:'L6', part:'p6', title:'阅读 Part 6：语法填空——一空一词，读完整句再填', minutes:6, sections:[
 { h:'题型', html:`<p>一篇短文 6 个空，<b>没有选项</b>，每空填一个词。考的是语法“小词”，不是难词。</p>` },
 { h:'空里通常是什么词', html:`<table class="tbl"><tr><th>类型</th><th>例子</th></tr>
<tr><td>冠词</td><td>a / an / the：<i>a bottle of water</i></td></tr>
<tr><td>介词</td><td>for / on / in / at / of / to：<i>Thanks <b>for</b> your message · <b>on</b> Saturday · by the age <b>of</b> ten</i></td></tr>
<tr><td>助动词 / be</td><td>have / has / was / were / will / be：<i><b>Have</b> you seen…? · there will <b>be</b> a café</i></td></tr>
<tr><td>关系词</td><td>who / which / that / where：<i>a school <b>where</b> he hopes to study</i>；逗号后只能 which</td></tr>
<tr><td>连词</td><td>but / although / if / when / because / so：<i>not sure <b>if</b> he's old enough</i></td></tr>
<tr><td>代词 / 限定词</td><td>one / most / them / us / it：<i>let <b>us</b> know · <b>most</b> of the day</i></td></tr>
<tr><td>比较级 / 数量</td><td>more / than / as / much：<i>more <b>than</b> six tonnes</i></td></tr>
<tr><td>固定短语</td><td>look <b>after</b> · pick <b>up</b> · <b>had</b> better · as quietly as he <b>could</b></td></tr></table>` },
 { h:'检查清单', html:`<ol><li>填完读整句：主谓一致？时态一致？（<i>Last weekend I <b>went</b></i>）</li><li>只能填<b>一个词</b>，不能填两个，也不能缩写成 “didn't”（除非本来就是一个词）。</li><li>拼写要对，大小写不影响。</li></ol>` }
]},

{ id:'L7', part:'s1', title:'口语 Part 1：问答——A+R+E 公式', minutes:6, sections:[
 { h:'流程', html:`<p>考官先问基本信息（<i>What's your name? Where do you live? Do you study English at school?</i>），然后问 2–3 个个人话题问题（爱好、学校、家庭、周末、食物、旅行）。约 2 分钟，两个考生轮流。</p>` },
 { h:'A + R + E', html:`<table class="tbl"><tr><th>步骤</th><th>说什么</th><th>例子</th></tr>
<tr><td><b>A</b>nswer 直接回答</td><td>一句话回答问题</td><td><i>My favourite subject is science,</i></td></tr>
<tr><td><b>R</b>eason 理由</td><td>because…</td><td><i>because we do experiments and I like finding out how things work.</i></td></tr>
<tr><td><b>E</b>xample 例子</td><td>一个具体细节</td><td><i>Last week we made a small volcano, which was really exciting.</i></td></tr></table>
<p>三句话，10–20 秒。<b>只答一个词（“Science.”）是 Part 1 最大的失分点</b>。</p>` },
 { h:'时态是评分点', html:`<ul><li><i>What did you do last weekend?</i> → 过去式：went / played / had</li><li><i>What are you going to do next summer?</i> → be going to</li><li><i>Tell me about a book you have read recently.</i> → 现在完成时 + 过去式</li><li><i>How often…?</i> → usually / twice a week / every day</li></ul>` },
 { h:'没听清怎么办', html:`<p>说 <i>Sorry, could you repeat that, please?</i> 或 <i>Sorry, I didn't catch that.</i> —— 这不扣分，反而是“互动能力”的加分项。沉默才扣分。</p>` },
 { h:'练法', html:`<p>App 里每题：① 听考官提问 → ② 点录音回答 → ③ 看转写文本和字数/时长 → ④ 听范例 → ⑤ 跟读一遍。目标：每题 15–25 秒、至少一个 because。</p>` }
]},

{ id:'L8', part:'s2', title:'口语 Part 2：描述照片——六步框架撑满 1 分钟', minutes:7, sections:[
 { h:'流程', html:`<p>考官给你一张彩色照片，说：<i>Please tell us what you can see in the photograph.</i> 你<b>一个人说约 1 分钟</b>，考官不会插话，也不会提示。说完轮到另一位考生描述另一张照片。</p>` },
 { h:'六步框架（背下来）', html:`<table class="tbl"><tr><th>步骤</th><th>句型</th></tr>
<tr><td>① 总体一句</td><td><i>In this picture I can see a family having dinner at home.</i></td></tr>
<tr><td>② 人物 + 位置</td><td><i>On the left there's a woman… In the middle… In the background…</i></td></tr>
<tr><td>③ 正在做什么（现在进行时）</td><td><i>The boy is holding a plate. They are all smiling.</i></td></tr>
<tr><td>④ 穿着 / 物品 / 天气</td><td><i>She's wearing a blue T-shirt. There are lots of dishes on the table. It looks sunny.</i></td></tr>
<tr><td>⑤ 猜测</td><td><i>I think it's a birthday, because… Maybe they're… It looks like…</i></td></tr>
<tr><td>⑥ 感受 / 结尾</td><td><i>They look very happy. I'd like to be there, because…</i></td></tr></table>` },
 { h:'位置词', html:`<p>on the left / on the right / in the middle / at the top / at the bottom / in the front / in the background / next to / behind / in front of / between</p>` },
 { h:'不知道单词怎么办', html:`<p><b>绕过去（paraphrase）</b>：不知道 “trolley”，就说 <i>a thing you push in a supermarket to carry food</i>。这是 B1 口语的核心技能，考官会加分。不要停下来沉默。</p>` },
 { h:'常见问题', html:`<ul><li>说了 20 秒就没话了 → 用六步框架，每步至少一句。</li><li>只列名词（<i>A table, a chair, a woman…</i>）→ 要用完整句子和 -ing。</li><li>讲故事而不是描述 → 先描述看得见的，猜测放最后。</li></ul>` }
]},

{ id:'L9', part:'s3', title:'口语 Part 3：合作讨论——轮流、提议、回应、决定', minutes:7, sections:[
 { h:'流程', html:`<p>考官读一个情境（<i>A boy is going to spend a weekend in the countryside…</i>），给一张图，上面有 <b>5 个选项</b>。两个考生<b>互相讨论</b>（不是对考官说），约 2–3 分钟，最后要<b>做出一个决定</b>。评分重点是 <b>Interactive Communication</b>：会接话、会问对方、会让对方说。</p>` },
 { h:'一轮对话的结构', html:`<table class="tbl"><tr><th>功能</th><th>句型</th></tr>
<tr><td>开始</td><td><i>Shall we start with…? / Let's talk about… first.</i></td></tr>
<tr><td>提议 + 理由</td><td><i>I think… would be useful, because… / What about…?</i></td></tr>
<tr><td>同意</td><td><i>I agree. / That's a good idea. / Good point.</i></td></tr>
<tr><td>部分同意 / 不同意</td><td><i>That's true, but… / I'm not sure about that, because… / I see what you mean, but…</i></td></tr>
<tr><td>问对方</td><td><i>What do you think? / Don't you think? / Do you agree?</i></td></tr>
<tr><td>决定</td><td><i>So, shall we choose…? / I think… is the best, because… / OK, let's go with that.</i></td></tr></table>` },
 { h:'三条纪律', html:`<ol><li><b>不要一个人说完</b>：每说 2–3 句就把话交给对方（<i>What do you think?</i>）。</li><li><b>至少讨论 3–4 个选项</b>，每个说一个优点或一个缺点，不要 5 个全说“good idea”。</li><li><b>一定要做决定</b>：考官说 “thank you” 之前，你们要说出 “Let's choose…”。</li></ol>` },
 { h:'App 里怎么练', html:`<p>App 扮演你的搭档：它先说一段，你录音回应，它再接着说。每轮都有中文提示告诉你这一轮该做什么（回应 + 提出下一个选项 / 做决定）。练熟以后，让家长扮演搭档，脱离提示再练。</p>` }
]},

{ id:'L10', part:'s4', title:'口语 Part 4：深入讨论——观点 + 理由 + 例子', minutes:6, sections:[
 { h:'流程', html:`<p>考官围绕 Part 3 的话题问更开放的问题（<i>Do you prefer the countryside or the city? Why?</i>）。可能问一个人，也可能说 <i>What do you think, Ben?</i> 让另一个人接。约 3 分钟。</p>` },
 { h:'回答结构', html:`<p><b>观点 → 理由 → 例子 → （对比/让步）</b></p>
<p><i>I prefer the city, <b>because</b> there's always something to do. <b>For example</b>, my friends live near me and we can go to the cinema. <b>But</b> I like visiting the countryside for a few days, because it's quiet.</i></p>
<p>每题 20–40 秒，比 Part 1 长，比 Part 2 短。</p>` },
 { h:'有用的句型', html:`<ul><li>表观点：<i>In my opinion… / I think… / Personally, I…</i></li><li>让步：<i>It depends. / Some people…, but I… / On the other hand…</i></li><li>接搭档的话：<i>I agree with Ben, and I'd add that… / I don't really agree, because…</i></li><li>没想法时：<i>That's a difficult question. I've never thought about it, but I suppose…</i>（争取思考时间，不要沉默）</li></ul>` },
 { h:'评分提醒', html:`<p>Part 4 看的是 <b>Discourse Management</b>：能不能把 3–4 句话连成一段，用 because / so / but / for example 串起来。词汇不用高级，连贯最重要。</p>` }
]},

{ id:'L14', part:'l1', title:'听力 Part 1：短对话——三个选项都会被念到', minutes:6, sections:[
 { h:'题型长什么样', html:`<p>7 段短对话，每段配一个问题和三个选项（真考是三张图，本 App 用图标卡）。每段<b>放两遍</b>，两遍之间有停顿。</p><p>话题永远是日常生活：天气、时间、价格、交通、东西放哪了、买了什么。</p>` },
 { h:'最重要的一件事', html:`<p><b>三个选项通常都会在录音里被念到。</b>听到 "bus" 就选 bus，必错。考的不是"有没有听到这个词"，而是"哪个回答了那个问题"。</p><p>例：问 How will he travel? 录音里出现了 car（妈妈没空）、bus（太慢）、bike（最后决定）——三个都念了，只有最后那个是答案。</p>` },
 { h:'排除信号词：听到就划掉', html:`<table class="tbl"><tr><th>听到这个</th><th>意思</th></tr>
<tr><td>I was going to… / I nearly… / I almost…</td><td>差点做了 = <b>没做</b></td></tr>
<tr><td>I thought about… / We did think about…</td><td>想过 = <b>没做</b></td></tr>
<tr><td>It used to be… / It was, but…</td><td>过去如此 = <b>现在不是</b></td></tr>
<tr><td>They've moved it to… / They changed it to…</td><td>改了 = <b>后面那个才对</b></td></tr>
<tr><td>It's fully booked / It's closed / sold out</td><td>此路不通 = <b>排除</b></td></tr>
<tr><td>Let's just… / …it is, then / We've agreed on…</td><td><b>最终决定 = 答案</b></td></tr></table>` },
 { h:'两遍怎么分工', html:`<ol><li><b>第一遍</b>：不动笔，只抓"谁在说、在说什么事、问题问的是哪一点"。听完凭印象先选一个。</li><li><b>第二遍</b>：只验证你选的那个，同时确认另外两个为什么错。</li></ol><p>很多人第一遍就忙着涂答案，结果两遍都没听完整。</p>` },
 { h:'时间和数字的坑', html:`<p>一段对话里常出现三个数字，只有一个是答案。听清它跟着哪个词：</p><ul><li>"It starts at eight"（开始时间）vs "meet at half seven"（见面时间）</li><li>"was fifteen pounds"（原价）vs "I paid twelve"（实付）</li><li>"forty minutes on the motorway"（车程）vs "an hour altogether"（总共）</li></ul><p>英式口语：<b>half six = 6:30</b>（不是 5:30），<b>quarter past four = 4:15</b>，<b>quarter to four = 3:45</b>。</p>` }
]},
{ id:'L15', part:'l2', title:'听力 Part 2：六段独立录音——先读题，再听', minutes:6, sections:[
 { h:'题型长什么样', html:`<p>6 段互不相关的录音，每段之前有一句情境说明（You will hear two friends talking about a film…），然后一个问题、三个文字选项。同样放两遍。</p>` },
 { h:'听之前的 15 秒最值钱', html:`<p>每段开始前有时间读题。<b>先看问题问什么</b>，这决定了你要竖起耳朵抓哪一类信息：</p><table class="tbl"><tr><th>问题</th><th>你要抓的</th></tr>
<tr><td>What did she enjoy most?</td><td>最强的<b>正面</b>评价</td></tr>
<tr><td>What is the problem?</td><td>but 之后的<b>负面</b>信息</td></tr>
<tr><td>Why did he…?</td><td><b>原因</b>状语：because / that\'s why / it\'s my…</td></tr>
<tr><td>What will they do?</td><td><b>最后被接受</b>的提议</td></tr></table>` },
 { h:'万能结构：先铺垫，再转折', html:`<p>这部分的录音几乎都长这样：<b>先说两件不是答案的事，然后 but / though / what I… 引出答案。</b></p><p><i>"The food was lovely… It wasn\'t cheap, but I don\'t mind paying. <b>What I couldn\'t accept was</b> the waiter."</i></p><p>听到这些词就提高警觉，答案马上来：<b>but / however / though / actually / the thing is / what I… is / that\'s why</b>。</p>` },
 { h:'"别人以为"= 反向提示', html:`<p>录音里出现 <b>People assume… / Everyone expects me to say… / People think…</b>，几乎百分之百是在铺垫一个相反的答案。</p><p><i>"People think the early start is the hard part. Honestly, getting up is fine — what I find difficult is going to bed at nine."</i> → 答案是"早睡"，不是"早起"。</p>` },
 { h:'选项里的同义替换', html:`<p>正确选项很少用录音里的原词，通常是<b>换一种说法</b>：</p><ul><li>录音 "he got our order wrong twice and never apologised" → 选项 "The service was rude."</li><li>录音 "I can walk to work in eight minutes" → 选项 "the location"</li><li>录音 "I never once served a customer" → 排除 "served customers"</li></ul><p>反过来，<b>和录音用词一模一样的选项，往往是陷阱</b>。</p>` }
]},
{ id:'L16', part:'l3', title:'听力 Part 3：笔记填空——空格前后就是路标', minutes:7, sections:[
 { h:'题型长什么样', html:`<p>一段较长的独白（通知、介绍、广播），配一张笔记/表格，有 6 个空。<b>一空只填一个词或一个数字</b>。放两遍。</p>` },
 { h:'开口之前先做三件事', html:`<ol><li><b>读标题</b>：知道整段在讲什么（艺术班？慈善跑？博物馆？）。</li><li><b>看每个空前后的词</b>：它们就是录音里的路标。空前写着 "Cost each week: £___"，你就等着听 pounds a week。</li><li><b>预判词性</b>：这个空该填星期几？时间？数字？地点？还是一个物品？预判对了，听到就能立刻抓住。</li></ol>` },
 { h:'答案按顺序出现', html:`<p>这是 Part 3 最大的礼物：<b>6 个空的答案在录音里严格按顺序出现</b>。听到第 3 空的答案，就知道第 1、2 空已经过去了——别再纠结，先往下走，第二遍再补。</p><p>卡住一个空就全盘崩掉，是这部分最常见的失分方式。</p>` },
 { h:'最爱考的三种陷阱', html:`<table class="tbl"><tr><th>陷阱</th><th>例子</th><th>怎么办</th></tr>
<tr><td><b>先给旧的再给新的</b></td><td>"We did think about Mondays, but… the club will meet every Wednesday"</td><td>填后面那个</td></tr>
<tr><td><b>两个相近的数字</b></td><td>"open until five thirty, although the shop closes at five"</td><td>看空格问的是哪一个</td></tr>
<tr><td><b>题干已给一半</b></td><td>空前印着 "Mrs ___"，录音说 "speak to Mrs Patel"</td><td>只填 Patel，别重复 Mrs</td></tr></table>` },
 { h:'写法规则', html:`<ul><li>数字可以写阿拉伯数字：<b>4</b> 和 <b>four</b> 都算对。</li><li>时间写 <b>9.30</b> 或 <b>half past nine</b> 都行。</li><li>单词拼错算错——所以优先填你<b>会拼</b>的那种写法。</li><li>不要填超过一个词。题目写 "one word or a number" 就是硬规定。</li><li>实在没听出来，<b>也要猜一个</b>，空着必然 0 分。</li></ul>` }
]},
{ id:'L17', part:'l4', title:'听力 Part 4：长访谈——考的是态度，不是细节', minutes:7, sections:[
 { h:'题型长什么样', html:`<p>一段 3–4 分钟的访谈（主持人 + 一位嘉宾），6 道三选一。放两遍。这是听力里最长、最难的一部分。</p>` },
 { h:'题目顺序 = 录音顺序', html:`<p>第 1 题的答案一定在最前面，第 6 题在最后。所以：<b>眼睛跟着题目往下走</b>，听到第 3 题的内容就把笔从第 2 题挪开。</p><p>主持人的每个提问，基本就是下一道题的分界线——听到主持人开口，就该看下一题了。</p>` },
 { h:'问的是观点，不是事实', html:`<p>Part 4 很少问 "几点""多少钱"，多半问：</p><ul><li>How did she <b>feel</b> when…?（感受）</li><li><b>Why</b> did he decide to…?（原因）</li><li>What does she <b>say about</b>…?（看法）</li><li>What <b>advice</b> does he give?（建议）</li></ul><p>所以要听的是嘉宾对事情的<b>评价词</b>，而不是名词细节。</p>` },
 { h:'嘉宾最常用的四种表达', html:`<table class="tbl"><tr><th>说法</th><th>含义</th></tr>
<tr><td>Everyone expects me to say X, but actually…</td><td>答案是 X 的<b>反面</b></td></tr>
<tr><td>It wasn\'t that I couldn\'t do it — it was…</td><td>前半是<b>排除</b>，后半是答案</td></tr>
<tr><td>The thing I remember / The best bit was…</td><td><b>答案标记</b></td></tr>
<tr><td>I\'d rather… / I\'d like to, but I\'m also…</td><td>真实<b>意愿</b>在 rather / but 之后</td></tr></table>` },
 { h:'一题没听懂怎么办', html:`<p><b>立刻放弃，保住后面。</b>Part 4 最惨的死法是为第 2 题纠结，结果 3、4、5 题的内容全部流过去了。</p><p>做法：随便选一个，在题号上画个圈，第二遍专门回来听它。第二遍时你已经知道整段在讲什么，反而更容易抓住。</p>` },
 { h:'练习方法：跟读原文', html:`<p>判分后打开"听力原文"，做两件事：</p><ol><li><b>找出你听错的那一句</b>，看是生词、连读，还是转折没听出来。</li><li><b>跟着念一遍</b>。你能自己念出来的句子，下次听到的概率高得多。</li></ol><p>这一步只要 3 分钟，是听力提分最快的动作。</p>` }
]},
{ id:'L11', part:'method', title:'每天 25 分钟怎么练 + 90 天计划说明 + 家长陪练指南', minutes:6, sections:[
 { h:'每日 25 分钟', html:`<table class="tbl"><tr><th>环节</th><th>时间</th><th>做法</th></tr>
<tr><td>阅读 1 个部分</td><td>8–10 分钟</td><td>按建议时间限时做，做完立刻看解析，错题记“陷阱类型”</td></tr>
<tr><td>口语 1 个任务</td><td>8–10 分钟</td><td>听题 → 录音 → 看转写和反馈 → 听范例 → 跟读一次</td></tr>
<tr><td>单词卡 10 张</td><td>3–5 分钟</td><td>认识/不认识；不认识的明天再来</td></tr></table>
<p>教程课安排在每个新题型第一次出现的当天，多 5–8 分钟。</p>` },
 { h:'90 天三阶段', html:`<table class="tbl"><tr><th>阶段</th><th>周</th><th>阅读</th><th>口语</th></tr>
<tr><td>基础</td><td>1–4</td><td>Part 1 → Part 5 → Part 6 → Part 2（先易后难）</td><td>Part 1 问答 → Part 2 图片</td></tr>
<tr><td>提升</td><td>5–8</td><td>Part 3 → Part 4，然后六部分混合</td><td>Part 3 合作 → Part 4 讨论</td></tr>
<tr><td>冲刺</td><td>9–12</td><td>每天两个部分限时 + 每周六 45 分钟全卷模考</td><td>每周日完整口语模拟（四部分连做）</td></tr></table>
<p>每周日 = 复盘日：重做本周错题、回听本周录音、给自己的发音打分。</p>` },
 { h:'家长陪练指南（口语）', html:`<ol><li><b>Part 1</b>：家长照着 App 上的问题问，孩子不看屏幕回答。</li><li><b>Part 2</b>：家长掐表 1 分钟，孩子说不满 1 分钟就用六步框架追问：“穿什么？天气？你觉得他们在干嘛？”</li><li><b>Part 3</b>：家长扮演搭档，照 App 的搭档台词念；<b>故意不同意一次</b>，看孩子会不会说 “That's true, but…”。</li><li><b>Part 4</b>：追问 “Why?” 直到孩子给出 because + 例子。</li></ol>
<p>不纠正每一个语法错误——流利和互动比语法更重要。一次只纠一个最重要的问题。</p>` },
 { h:'什么时候可以报名', html:`<p>模考阅读稳定 ≥ 75%、口语 Part 2 能说满 1 分钟、Part 3 能主动提问和做决定 → 可以报名。目标 B2（160）的话，阅读要稳定 ≥ 88%。</p>` }
]},

{ id:'L12', part:'exam', title:'考前一周 & 考试当天', minutes:4, sections:[
 { h:'考前 7 天', html:`<ul><li>不再学新题型，只做模考 + 错题重做。</li><li>口语每天至少 1 次完整四部分模拟（App 模考模式）。</li><li>把 Part 2 六步框架、Part 3 六类句型各背 3 句，能脱口而出。</li><li>看一遍官方样题的答题卡（answer sheet），知道怎么涂。</li></ul>` },
 { h:'考试当天', html:`<ul><li>带准考证、身份证件、2B 铅笔和橡皮（阅读答题卡用铅笔）。</li><li>口语通常和笔试不同天或不同时段，提前确认。</li><li>阅读：先做 Part 1、5、6（快），再做 2、3、4。每部分不超过建议时间，不会的先选一个，标记，最后再回来。</li><li>口语：进门微笑，看着考官和搭档说话，没听清就问 <i>Could you repeat that, please?</i></li></ul>` },
 { h:'心态', html:`<p>PET 通过线是 70% 左右的正确率——<b>允许错 9–10 道阅读题</b>。不需要完美，需要稳定。</p>` }
]}
];
