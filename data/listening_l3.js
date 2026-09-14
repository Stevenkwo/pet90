/* PET Listening Part 3 — 一段独白 + 笔记填空 6 空（一空一词或一个数字）
   出题要点：答案按录音顺序出现；空格前后的词就是定位锚点 */
window.PET_DATA = window.PET_DATA || {};
window.PET_DATA.listening_l3 = [
{ id:'l3-s1', title:'暑期艺术班', intro:'You will hear a teacher telling students about a summer art club.',
  script:[{sp:'F',t:"Good morning everyone. I want to tell you about the summer art club, which starts in the holidays. We did think about running it on Mondays, but the hall is used for music then, so the club will meet every Wednesday. We begin at half past nine — that's half an hour later than normal school, so nobody has to rush. Now, the cost. Materials are expensive, so we ask for four pounds a week. That covers everything except one thing: please bring your own apron, because paint really does ruin clothes. We'll be working in the art room for the first three weeks, and then, if the weather's kind, we'll move outside to the garden. At the end of the course there's an exhibition, and every student shows two pieces. Parents are very welcome. If you'd like to join, speak to Mrs Patel — she's in the office, not the art room — and she'll put your name down. Places are limited to twenty, so don't leave it too long."}],
  noteTitle:'SUMMER ART CLUB', noteIcon:'🎨',
  lines:[
    {label:'Day of the week:', gap:0},
    {label:'Starting time:', gap:1},
    {label:'Cost each week:', gap:2, prefix:'£'},
    {label:'Students must bring:', gap:3, prefix:'an '},
    {label:'Number of pieces in exhibition:', gap:4},
    {label:'Sign up with:', gap:5, prefix:'Mrs '}
  ],
  gaps:[
    {answer:['Wednesday','Wednesdays'], why:'Monday 是"考虑过但没用"（音乐课占了礼堂）。the club will meet every Wednesday。'},
    {answer:['9.30','9:30','half past nine','nine thirty','930'], why:'We begin at half past nine = 9:30。half past 在英式表达里是"半点"。'},
    {answer:['4','four'], why:'we ask for four pounds a week。数字题可以写阿拉伯数字。'},
    {answer:['apron'], why:'please bring your own apron。前面说 covers everything except one thing 就是提示下面是答案。'},
    {answer:['2','two'], why:'every student shows two pieces。注意不是 twenty（那是名额上限）。'},
    {answer:['Patel'], why:'speak to Mrs Patel。题目已给 Mrs，只需填姓。'}
  ] },
{ id:'l3-s2', title:'校园慈善跑', intro:'You will hear a student telling classmates about a charity run.',
  script:[{sp:'M',t:"Hi everyone. Quick word about the charity run next month. It's on Saturday the fourteenth — I know some of you heard the seventh, but that was changed because of the exams. We meet at the sports centre, not at school, at nine in the morning, and the run itself begins at ten. The route is five kilometres, twice round the park. It's completely flat, so don't panic if you're not a runner — plenty of people walk it. Everyone who takes part gets a T-shirt, and this year they're blue rather than the yellow ones from last time. The money we raise goes to the children's hospital in town. Last year we collected nine hundred pounds and this year we'd love to reach a thousand. One more thing: you must bring a water bottle. There's a tap at the park but no cups. Sign up on the sheet outside the gym by Friday."}],
  noteTitle:'CHARITY RUN', noteIcon:'🏃',
  lines:[
    {label:'Date:', gap:0, prefix:'Saturday the '},
    {label:'Meet at:', gap:1, suffix:' (not at school)'},
    {label:'Run starts at:', gap:2},
    {label:'Distance:', gap:3, suffix:' kilometres'},
    {label:'Colour of T-shirt:', gap:4},
    {label:'Must bring a:', gap:5, prefix:'water '}
  ],
  gaps:[
    {answer:['14th','fourteenth','14'], why:'the seventh 是旧日期，被考试改掉了。Saturday the fourteenth 才是现在的。'},
    {answer:['sports centre','sports center','sportscentre'], why:'We meet at the sports centre, not at school——录音自己就强调了"不是学校"。'},
    {answer:['10','ten','10.00','10:00'], why:'九点是集合时间，the run itself begins at ten 才是开跑。注意区分两个时间。'},
    {answer:['5','five'], why:'The route is five kilometres。twice round the park 是补充说明，不是数字答案。'},
    {answer:['blue'], why:'they\'re blue rather than the yellow ones from last time。rather than 后面是旧的。'},
    {answer:['bottle'], why:'you must bring a water bottle。题目给了 water，填 bottle。'}
  ] },
{ id:'l3-s3', title:'博物馆参观须知', intro:'You will hear a guide giving information to visitors at a museum.',
  script:[{sp:'F',t:"Welcome to the City Museum. A few things before you go in. The museum is open until five thirty today, although the shop closes at five. Your ticket covers the whole building, including the special exhibition on the second floor — that's about the history of flight, and it's the one most people come for. Photographs are allowed everywhere except in that exhibition, where the lighting damages the objects. There's a café on the ground floor serving hot food until two o'clock, and sandwiches after that. If you have a large bag, please leave it in the cloakroom; it's free, but you'll need a one-pound coin which you get back. Guided tours leave from this desk every hour, and they last about forty minutes. Finally, the lift is out of order today, so if you can't manage stairs, do tell a member of staff and we'll help you."}],
  noteTitle:'CITY MUSEUM', noteIcon:'🏛️',
  lines:[
    {label:'Museum closes at:', gap:0},
    {label:'Special exhibition is on the:', gap:1, suffix:' floor'},
    {label:'Exhibition subject:', gap:2, prefix:'the history of '},
    {label:'Hot food served until:', gap:3},
    {label:'Coin needed for cloakroom:', gap:4, prefix:'£'},
    {label:'Guided tour lasts:', gap:5, suffix:' minutes'}
  ],
  gaps:[
    {answer:['5.30','5:30','half past five','five thirty','530'], why:'open until five thirty。五点是商店关门时间，别混。'},
    {answer:['second','2nd'], why:'the special exhibition on the second floor。'},
    {answer:['flight'], why:'the history of flight。题目已给 the history of。'},
    {answer:['2','two',"2 o'clock","two o'clock"], why:'hot food until two o\'clock，之后只有三明治。'},
    {answer:['1','one'], why:'you\'ll need a one-pound coin。免费但要押一镑硬币。'},
    {answer:['40','forty'], why:'they last about forty minutes。every hour 是发车频率，不是时长。'}
  ] },
{ id:'l3-s4', title:'野外露营周末', intro:'You will hear a leader talking to young people about a camping weekend.',
  script:[{sp:'M',t:"Right, the camping weekend. We leave from the school car park on Friday at four, so come straight from your last lesson. The journey takes about two hours. We're staying at Greenhill Farm — you might have heard we were going to Blackwood, but that site was flooded in the spring. Now, what to pack. A sleeping bag is essential and we can't lend you one. Tents we do provide, so leave yours at home. Bring boots, because the ground is rough, and a torch for the evenings. Saturday's main activity is canoeing on the lake; if the wind is too strong we'll go walking instead. Saturday evening there's a campfire and each group has to perform something — a song, a sketch, anything. We get back on Sunday at about six in the evening. Parents should collect you from the car park. The cost is thirty-five pounds, which includes all meals."}],
  noteTitle:'CAMPING WEEKEND', noteIcon:'⛺',
  lines:[
    {label:'Leave school on Friday at:', gap:0},
    {label:'Staying at:', gap:1, suffix:' Farm'},
    {label:'Must bring your own:', gap:2, prefix:'sleeping '},
    {label:'Saturday activity:', gap:3},
    {label:'Return on Sunday at about:', gap:4},
    {label:'Total cost:', gap:5, prefix:'£'}
  ],
  gaps:[
    {answer:['4','four','4.00','4:00'], width:6, why:'We leave from the school car park on Friday at four。两小时是车程。'},
    {answer:['Greenhill','Green Hill'], why:'Blackwood 是"本来要去但被淹了"的地方。We\'re staying at Greenhill Farm。'},
    {answer:['bag'], why:'A sleeping bag is essential and we can\'t lend you one。帐篷是提供的，别选帐篷。'},
    {answer:['canoeing','canoing'], why:'Saturday\'s main activity is canoeing。walking 只在风太大时才换。'},
    {answer:['6','six'], why:'We get back on Sunday at about six in the evening。'},
    {answer:['35','thirty-five','thirty five'], why:'The cost is thirty-five pounds。'}
  ] },
{ id:'l3-s5', title:'图书馆新服务', intro:'You will hear a librarian talking about changes at the local library.',
  script:[{sp:'F',t:"I'd like to tell you about some changes here at the library. From next month we'll be open on Sundays for the first time, from eleven until four. Our late night stays as Thursday, when we're here until eight. The big news is the new computer room upstairs. There are twelve machines and they're free to use, though you do need your library card. You can book a machine for up to two hours a day. We're also starting a reading group for young people aged eleven to fifteen — it meets on the first Tuesday of each month at half past four, and you don't need to sign up, just turn up. And from September, the fine for late books goes down from twenty pence a day to ten. We'd rather have the books back than take your money. Do ask at the desk if you need anything."}],
  noteTitle:'LIBRARY NEWS', noteIcon:'📚',
  lines:[
    {label:'New opening day:', gap:0},
    {label:'Late night is on:', gap:1},
    {label:'Computers in new room:', gap:2},
    {label:'Maximum booking per day:', gap:3, suffix:' hours'},
    {label:'Reading group age:', gap:4, prefix:'11 to '},
    {label:'New daily fine:', gap:5, suffix:'p'}
  ],
  gaps:[
    {answer:['Sunday','Sundays'], why:'we\'ll be open on Sundays for the first time。Thursday 是原有的 late night，不是新增。'},
    {answer:['Thursday','Thursdays'], why:'Our late night stays as Thursday。stays as = 保持不变。'},
    {answer:['12','twelve'], why:'There are twelve machines。'},
    {answer:['2','two'], why:'You can book a machine for up to two hours a day。'},
    {answer:['15','fifteen'], why:'aged eleven to fifteen。题目已给 11 to。'},
    {answer:['10','ten'], why:'goes down from twenty pence a day to ten。from...to... 里 to 后面是新值。'}
  ] }
];
