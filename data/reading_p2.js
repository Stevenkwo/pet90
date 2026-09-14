// PET Reading Part 2 — match 5 people to 8 short texts (A–H).
window.PET_DATA = window.PET_DATA || {};
PET_DATA.reading_p2 = [
{ id:'p2-s1', title:'Books for young readers',
  intro:'The people below all want to buy a book. On the right there are descriptions of eight books. Decide which book would be the most suitable for each person.',
  people:[
   { name:'Emma', text:"Emma enjoys funny stories about school, but she doesn't like long books. She prefers books with lots of pictures that she can finish in a day." },
   { name:'Jack', text:"Jack is interested in space and science. He doesn't want a made-up story – he wants to read about real people and see photographs." },
   { name:'Lily', text:"Lily loves long adventure stories set in the past. She wants a book that is the first of a series, so she can carry on reading." },
   { name:'Sam', text:"Sam likes mysteries. He wants a book with an animal as the main character that he can read aloud to his younger brother." },
   { name:'Maya', text:"Maya loves sport and enjoys reading about real athletes. She would like a book that gives her ideas for her own training." }
  ],
  texts:[
   { letter:'A', title:'The Great Bake-Off Mystery', body:"When a chocolate cake disappears from the school kitchen, Detective Dog Biscuit is on the case! Short chapters, big letters and a joke on every page make this mystery perfect for sharing with younger brothers and sisters. Biscuit's next adventure is coming soon." },
   { letter:'B', title:'Rocket Girl', body:"Fourteen-year-old Nova dreams of being the first person on Mars. This exciting novel follows her through space camp and beyond. It is a long read with no pictures, but the ending is worth waiting for." },
   { letter:'C', title:'Journey to the Stars', body:"Astronaut Mae Carter tells the true story of her year on the International Space Station. With over a hundred of her own photographs of Earth from space, this is the real thing – no made-up characters, just science and adventure." },
   { letter:'D', title:"Ms Bell's Terrible Tuesday", body:"Everything that can go wrong does go wrong in Class 5B. Told through comic-style pictures and short text, this very funny book about one crazy school day can be read in an afternoon – and you'll want to read it again." },
   { letter:'E', title:'The Sword of the North', body:"The first of six books in the Winterlands series. Four hundred pages of castles, battles and a dangerous journey across the mountains in the year 1250. Once you start, you will want the whole set." },
   { letter:'F', title:'Fast Feet', body:"Olympic runner Dan Okoro describes how he went from a small village club to the world's biggest stadiums. Every chapter ends with the training plan he followed at that age, so young athletes can try it themselves." },
   { letter:'G', title:'Long Ago on the Island', body:"A collection of twelve short stories set in ancient Greece. Each story is complete in itself, so you can pick the book up whenever you have ten minutes. Beautifully illustrated in colour." },
   { letter:'H', title:'Football Crazy', body:"A funny novel about Jamie, who gets into the school football team by mistake and has to learn the rules fast. Great fun, though don't expect any real advice about playing football." }
  ],
  answers:['D','C','E','A','F'],
  why:[
   "Emma 三条件：funny + school / 不要长 / 有图能一天读完 → D（comic-style pictures, read in an afternoon）。H 也是 funny，但是 novel 且没提图。",
   "Jack：space + 真人真事 + 照片 → C（true story, photographs）。B 是 space 但 novel、no pictures。",
   "Lily：长篇 + 过去 + 系列第一本 → E（first of six, 400 pages, 1250）。G 虽在 ancient Greece 但是短篇集。",
   "Sam：mystery + 动物主角 + 能读给弟弟听 → A（Detective Dog, sharing with younger brothers）。",
   "Maya：sport + 真实运动员 + 训练建议 → F（Olympic runner, training plan）。H 明确说 no real advice。"
  ]
},
{ id:'p2-s2', title:'A day out',
  intro:'The people below all want to go somewhere for a day out. On the right there are descriptions of eight places. Decide which place would be the most suitable for each person or group.',
  people:[
   { name:'The Wilson family', text:"The Wilsons want to spend a day outdoors where their young children can get close to animals. They want to bring a picnic, and they are happy to go in any weather." },
   { name:'Ravi', text:"Ravi and three friends want to do something active indoors because it's raining. They don't have much money, and they are free on Tuesday afternoon." },
   { name:'Mrs Lopez', text:"Mrs Lopez wants to take her class of thirty to a place where they can learn about history with a guide. It must be free for schools." },
   { name:'Hana', text:"Hana wants a quiet place where she can draw and photograph plants. She would like to be able to buy lunch there." },
   { name:'Ben', text:"Ben and his dad love old cars and machines. Ben is eleven and would like to try driving something himself." }
  ],
  texts:[
   { letter:'A', title:'Greenhill Farm Park', body:"Meet sheep, goats, rabbits and our new baby donkeys on this open-air farm. Children can help feed the animals at 11 and 3. There are picnic tables by the river; we don't have a café, so bring your own lunch. Open every day, whatever the weather." },
   { letter:'B', title:'Castle Hill', body:"Guided tours of this 800-year-old castle leave every hour, led by guides in historical costume. Schools visit free; other visitors pay £6. Book school groups at least a week ahead. Gift shop and café on site." },
   { letter:'C', title:'Jump Zone', body:"Bad weather? No problem! Indoor trampolines, climbing walls and a giant foam pit. Only £4 per hour before 4 pm on weekdays, £8 at other times. Socks must be worn. Ages 6 and over." },
   { letter:'D', title:'Motor World', body:"Over 200 vintage cars, motorbikes and steam engines from 1900 to 1980. Visitors aged 10 and over can drive a real 1920s car around our track, with an instructor beside them. Entry £9, driving £5 extra." },
   { letter:'E', title:'City Botanic Gardens', body:"Peaceful glasshouses, a rose garden and a lake with hundreds of rare plants. Artists and photographers are welcome – there are benches everywhere. The garden café serves soups, salads and sandwiches until 4 pm." },
   { letter:'F', title:'Ocean Aquarium', body:"See sharks, turtles and thousands of tropical fish in our indoor tanks. Family ticket £45. The Ocean Restaurant has meals for all the family; please note that food from outside cannot be brought into the aquarium." },
   { letter:'G', title:'Old Town Museum', body:"Free entry for everyone. Displays about the history of the town from Roman times to today, with objects found by local people. Visitors explore by themselves – there are no guided tours, but there is a free leaflet." },
   { letter:'H', title:'Speedy Karts', body:"Outdoor go-kart racing for all ages, on a 500-metre track beside the river. £15 per race. Please note the track closes in wet weather, so check our website before you come." }
  ],
  answers:['A','C','B','E','D'],
  why:[
   "Wilsons：outdoors + 动物 + 自带野餐 + 任何天气 → A。F 有动物但 indoors 且禁止外带食物。",
   "Ravi：indoors + active + 便宜 + 周二下午 → C（£4 before 4 pm on weekdays）。",
   "Mrs Lopez：history + 有导游 + 学校免费 → B。G 免费但 no guided tours。",
   "Hana：安静 + 画画拍植物 + 能买午饭 → E（garden café）。",
   "Ben：old cars & machines + 11 岁能自己开 → D（aged 10 and over can drive）。H 是卡丁车，不是 old cars。"
  ]
},
{ id:'p2-s3', title:'After-school clubs',
  intro:'The people below all want to join an after-school club. On the right there are descriptions of eight clubs. Decide which club would be the most suitable for each person.',
  people:[
   { name:'Ola', text:"Ola wants to learn to make things with her hands. She is only free on Fridays, and she can't afford to buy materials." },
   { name:'Kenji', text:"Kenji wants to practise speaking English with people from other countries. He can't stay at school after lessons because he catches a bus home." },
   { name:'Rosa', text:"Rosa loves dancing and wants to be in a group that performs in front of an audience. She can't sing at all and doesn't want to." },
   { name:'Tom', text:"Tom wants a club where he can do science experiments and also get help with his science homework. He has piano lessons on Tuesdays." },
   { name:'Amy', text:"Amy would like to try a team sport she has never played before. She wants to play in matches against other schools." }
  ],
  texts:[
   { letter:'A', title:'Friday Makers', body:"Learn to sew, knit and build models from wood and card. All materials are provided free, so just bring yourself. We meet every Friday from 3.30 to 4.30 in the art room. Beginners very welcome." },
   { letter:'B', title:'Drama Club', body:"We put on two shows a year in the school hall, in front of parents and friends. Everyone acts, and everyone sings and dances too – no exceptions! Wednesdays after school. Auditions in September." },
   { letter:'C', title:'Science Lab Club', body:"Tuesdays only, 3.30–5.00. Do a different experiment every week with Mr Adams, and bring your science homework – there is always time for questions at the end." },
   { letter:'D', title:'Street Dance Crew', body:"No singing – just dancing! Learn hip-hop and street styles and perform on the main stage at the town festival every summer. Thursdays, 4–5 pm in the gym. Trainers needed." },
   { letter:'E', title:'Global Chat', body:"Practise your English speaking from home! Talk online with students in Australia and Canada, in groups of four with a teacher. Sessions are at 6 pm, after school. You need a laptop and a quiet room." },
   { letter:'F', title:'Young Scientists', body:"Thursdays 3.30–4.45. Fun experiments every week – rockets, slime, electricity – and in the last fifteen minutes you can ask Ms Ford for help with your science homework." },
   { letter:'G', title:'Hockey Squad', body:"For complete beginners and experienced players. Training on Mondays, with matches against other schools in the area every month. Sticks can be borrowed; bring shin pads." },
   { letter:'H', title:'Art Club', body:"Painting and drawing every Friday after school with a visiting artist. Students must bring their own paints, brushes and paper. Places are limited to fifteen." }
  ],
  answers:['A','E','D','F','G'],
  why:[
   "Ola：动手做 + 周五 + 不买材料 → A（materials provided free, Friday）。H 也是周五但要自备材料。",
   "Kenji：和外国人练口语 + 放学不能留校 → E（from home, online）。",
   "Rosa：跳舞 + 演出 + 不唱歌 → D（No singing, perform at festival）。B 要求人人唱歌。",
   "Tom：实验 + 作业辅导 + 周二不行 → F（Thursdays）。C 只在周二。",
   "Amy：没玩过的团队运动 + 校际比赛 → G（beginners, matches against other schools）。"
  ]
},
{ id:'p2-s4', title:'Holiday courses and camps',
  intro:'The people below all want to do a holiday course or camp. On the right there are descriptions of eight courses and camps. Decide which one would be the most suitable for each person.',
  people:[
   { name:'Sofia', text:"Sofia is twelve and wants to spend a week away from home learning to sail. She can swim, but she has never done any water sports before." },
   { name:'Marcus', text:"Marcus wants to learn to cook and take the food home to show his family. He is only free for one day." },
   { name:'The Khan twins', text:"The Khan twins are nine. They want a camp near home with lots of different sports. Their parents work until 5.30, so the twins need to be looked after until 6." },
   { name:'Leah', text:"Leah wants to spend a week improving her painting with a professional artist. She wants to sleep at home every night." },
   { name:'Daniel', text:"Daniel loves wildlife and wants to camp in a forest for a few days. He would like to learn to cook outdoors and find his way with a map." }
  ],
  texts:[
   { letter:'A', title:'Wild Week', body:"Sleep in tents deep in Oakwood Forest for six nights. Learn map reading, campfire cooking and how to spot deer, owls and other wildlife. Ages 11–15. All camping equipment provided." },
   { letter:'B', title:'Chef for a Day', body:"A one-day cooking workshop, 10 am to 4 pm. Make three dishes – a soup, a main course and a dessert – and take them home in the boxes we provide. Ages 10 and over." },
   { letter:'C', title:'Art Adventure', body:"A seven-day residential painting holiday in the mountains. Stay in a comfortable hotel and paint outdoors every day with art teacher Paul Green. Ages 12–16." },
   { letter:'D', title:'Multi-Sport Camp', body:"Daily 8 am–6 pm at the town sports centre. Football, tennis, swimming, basketball and more, with qualified coaches. Ages 7–11. Lunch included." },
   { letter:'E', title:'Surf Camp', body:"Two-day surfing course at Sandy Bay. For confident swimmers who already have some experience of water sports. Not suitable for beginners. Ages 12 and over." },
   { letter:'F', title:'Lakeside Sailing School', body:"Seven-day residential course by the lake. Complete beginners welcome – all you need is to be able to swim 50 metres. Boats, life jackets and wetsuits provided. Ages 11–16." },
   { letter:'G', title:'Studio Week', body:"Five days of painting classes, 10 am–4 pm, with professional artist Rena Fox at the town gallery. Go home each evening. Materials included. Ages 10 and over." },
   { letter:'H', title:'Kitchen Kids', body:"Five afternoons of cooking, Monday to Friday, 2–5 pm. Learn to make pasta, bread and cakes – and eat what you make at the end of each class! Ages 8–12." }
  ],
  answers:['F','B','D','G','A'],
  why:[
   "Sofia：一周离家 + 学帆船 + 零基础 → F（residential, complete beginners）。E 明确 not for beginners。",
   "Marcus：学做饭 + 带回家 + 只有一天 → B。H 要五天且当场吃掉。",
   "Khan twins：9 岁 + 家附近 + 多种运动 + 看到 6 点 → D（8 am–6 pm, ages 7–11）。",
   "Leah：一周 + 专业画家 + 晚上回家 → G（Go home each evening）。C 是住酒店的。",
   "Daniel：野生动物 + 森林露营 + 野炊 + 地图 → A。"
  ]
},
{ id:'p2-s5', title:'Apps and websites for students',
  intro:'The people below all want to find an app or website. On the right there are descriptions of eight apps and websites. Decide which one would be the most suitable for each person.',
  people:[
   { name:'Nadia', text:"Nadia wants a free app to help her learn new English words. She enjoys games and wants to compete against her friends." },
   { name:'Oscar', text:"Oscar finds maths difficult. He wants to watch videos that explain each topic, and then do some practice questions." },
   { name:'Chloe', text:"Chloe wants to read short news stories written for people her age. She would also like to be able to listen to them." },
   { name:'Yusuf', text:"Yusuf wants to make his own short films and share them with his class – but not with the whole internet." },
   { name:'Mei', text:"Mei always forgets her homework. She wants an app that sends reminders to her phone, and she doesn't want to pay anything." }
  ],
  texts:[
   { letter:'A', title:'FlashPro', body:"Make your own vocabulary flashcards with pictures and sound. Test yourself as often as you like. £5 one-time payment. No games, no adverts – just serious learning." },
   { letter:'B', title:'TeenTimes', body:"Short daily news stories written especially for 11–16 year olds, covering sport, science, music and world events. Every article has an audio version read by a real person. Free." },
   { letter:'C', title:'HomeworkHero', body:"A simple planner for school. Type in your homework and the app sends a reminder to your phone the day before it's due. Completely free, with no adverts and no paid extras." },
   { letter:'D', title:'MathsTube', body:"Hundreds of short video lessons explaining every maths topic, from fractions to algebra. After each video, there is a quiz of ten practice questions. £3 a month, first month free." },
   { letter:'E', title:'ClassCam', body:"Film, edit and add music to short videos on your phone, then upload them to a private class page. Only your teacher and your classmates can watch. Free for schools." },
   { letter:'F', title:'WordRace', body:"Learn new words by playing fast word games against your friends. Compare your scores on the leaderboard every week. Free to download, with optional extra word packs." },
   { letter:'G', title:'World News Now', body:"The full news website of a national newspaper. Long articles for adult readers, text only. Free with adverts." },
   { letter:'H', title:'StudyPlan+', body:"Plan your homework, projects and exams, and get reminders on your phone. Free for the first week, then £2 a month." }
  ],
  answers:['F','D','B','E','C'],
  why:[
   "Nadia：免费 + 学单词 + 游戏 + 和朋友比 → F。A 要付费且 no games。",
   "Oscar：数学 + 视频讲解 + 练习题 → D（video lessons + quiz）。",
   "Chloe：短新闻 + 同龄人 + 能听 → B（for 11–16, audio version）。G 是给成人的纯文字。",
   "Yusuf：拍短片 + 只分享给班级 → E（private class page）。",
   "Mei：提醒作业 + 完全免费 → C。H 一周后收费。"
  ]
}
];
