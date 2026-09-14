// PET Reading Part 6 — open cloze (grammar). Gaps marked [[1]]..[[6]]; answers = array of accepted words per gap.
window.PET_DATA = window.PET_DATA || {};
PET_DATA.reading_p6 = [
{ id:'p6-s1', title:'An email to a friend',
  text:"Hi Jamie,\n\nThanks [[1]] your message. I'd love to come to your party [[2]] Saturday. What time does it start? I'll bring some music so [[3]] everyone can dance. My brother wants to come too, but he's only nine, so I'm not sure [[4]] he's old enough. Let me know.\n\nBy the way, [[5]] you seen the new film about dinosaurs? We could go next week [[6]] you're free.\n\nSee you soon,\nAlex",
  answers:[['for'],['on'],['that'],['if','whether'],['have'],['if','when']],
  why:["thanks for + 名词。","on + 星期几。","so that = 为了让……。","not sure if/whether = 不确定是否。","现在完成时疑问句：Have you seen…?","if/when you're free = 如果/当你有空。"]
},
{ id:'p6-s2', title:'Elephants',
  text:"Elephants are the largest animals [[1]] live on land. An adult male can weigh [[2]] than six tonnes. Elephants live in family groups, [[3]] are led by the oldest female. They spend [[4]] of the day eating – up to eighteen hours! Sadly, the number of elephants in Africa [[5]] fallen a lot in the last hundred years, mainly because people hunt them for their tusks. Many countries are now working together [[6]] protect them.",
  answers:[['that','which'],['more'],['which'],['most'],['has'],['to']],
  why:["定语从句先行词 animals，用 that/which。","more than = 超过。","逗号后的非限制性定语从句只能用 which，不能用 that。","most of the day = 一天的大部分时间。","the number of… 是单数，现在完成时 has fallen。","work together to do = 一起努力去做。"]
},
{ id:'p6-s3', title:'My first music festival',
  text:"Last weekend I [[1]] to a music festival for the first time. My cousin has been going for years, so she told me [[2]] to bring: a raincoat, a hat and lots of water. We arrived early [[3]] the morning and put up our tent near the main stage. The first band [[4]] playing at noon. I didn't know any of their songs, but by the end I [[5]] singing along with everyone else. It rained [[6]] the afternoon, but nobody cared – we just danced in the mud.",
  answers:[['went'],['what'],['in'],['started','began','was'],['was'],['in','during']],
  why:["Last weekend → 过去式 went。","told me what to bring = 告诉我要带什么。","in the morning。","started/began playing 或 was playing 都成立。","过去进行时 I was singing。","in/during the afternoon。"]
},
{ id:'p6-s4', title:'A letter to Sofia',
  text:"Dear Sofia,\n\nHow are you? I hope you're enjoying your new school. I'm writing [[1]] tell you about our class trip. We went to the mountains and stayed in a small hotel [[2]] three nights. On the second day we walked to a lake, [[3]] was so cold that only two people swam in it. I wasn't [[4]] of them! The food was great, [[5]] the beds were really hard.\n\nAnyway, when are you coming to visit? You [[6]] stay with us – my parents say it's fine.\n\nWrite soon!\nLove, Marta",
  answers:[['to'],['for'],['which'],['one'],['but','although','though'],['can','could','must','should']],
  why:["I'm writing to tell you = 写信是为了告诉你。","for three nights = 持续三晚。","逗号后非限制性定语从句用 which。","one of them = 其中之一。","转折：but / although / though。","You can/could/must stay with us = 你可以（一定要）住我们家。"]
},
{ id:'p6-s5', title:'A young musician',
  text:"Leo Park started playing the violin [[1]] he was four years old. His parents [[2]] not musicians, but his grandfather played in an orchestra and gave Leo his first instrument. By the age [[3]] ten, Leo had won three national competitions. He practises for four hours [[4]] day, but he says it never feels like work. 'If I [[5]] not playing, I'm thinking about playing,' he says. Next year he will go to a music school in London, [[6]] he hopes to study with his favourite teacher.",
  answers:[['when'],['are','were'],['of'],['a','every','each','per'],['am'],['where']],
  why:["when he was four = 四岁的时候。","His parents are/were not musicians。","by the age of ten = 到十岁时。","four hours a day / every day / each day / per day。","If I am not playing（第一人称 am）。","定语从句指地点（a music school）用 where。"]
},
{ id:'p6-s6', title:'A letter from school',
  text:"Dear parents,\n\nNext month our school [[1]] be holding its annual sports day. All students are expected [[2]] take part in at least one event. Parents are welcome to watch, and there will [[3]] a café selling drinks and snacks. Please make sure your child brings a hat and [[4]] bottle of water, as the weather is likely to be hot. If your child is unable to take part [[5]] any reason, please let [[6]] know by Friday.\n\nYours sincerely,\nMrs J. Barnes",
  answers:[['will'],['to'],['be'],['a'],['for'],['us','me']],
  why:["将来进行时 will be holding。","be expected to do = 被要求做。","there will be = 将会有。","a bottle of water（单数可数名词前要有冠词）。","for any reason = 出于任何原因。","let us/me know = 告诉我们/我。"]
},
{ id:'p6-s7', title:'The visitor at midnight',
  text:"It was nearly midnight when Sam heard the noise. At first he thought it was the wind, [[1]] then it came again – a soft knocking at the back door. He got out of bed as quietly as he [[2]] and went downstairs. The kitchen was dark. He picked [[3]] a torch from the table, took a deep breath and opened the door. There, sitting on the step, was a small wet dog with a note tied [[4]] its collar. 'Please look [[5]] me,' the note said. 'My name is Biscuit.' Sam looked up and down the empty street. There was nobody there. 'Well,' he said, 'you [[6]] better come in.'",
  answers:[['but'],['could'],['up'],['to','around','round','on','onto'],['after'],['had','\'d']],
  why:["At first… but then… = 起初……但后来……。","as quietly as he could = 尽可能轻。","pick up = 拿起。","tied to/around its collar = 系在项圈上。","look after = 照顾。","had better do = 最好做。"]
}
];
