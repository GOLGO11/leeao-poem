const fs = require("fs");
const path = require("path");

const book = "快意还乡——李敖神州文化之旅";
const idPrefix = "LAKYHX";
const generatedDate = "2026-06-25";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "010.节目演讲类",
  "013.快意还乡——李敖神州文化之旅",
);
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_kuaiyi_huanxiang_quote_candidates.json");
const reviewTsv = path.join("analysis", "liao_kuaiyi_huanxiang_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_kuaiyi_huanxiang_attributed_lines.tsv");
const auditTsv = path.join("analysis", "liao_kuaiyi_huanxiang_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_kuaiyi_huanxiang_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const notes =
  "首轮保守收入：本书为神州文化之旅行程与演讲实录，现代政见、两岸论断、党派口号、国族/宪政判断、政治人物语录和媒体串场不收；只取李敖本人引用或题写，且句子本体可独立成立的古典诗文、题词、成语俗谚、歌谣、文学格言和非政治人生格言。";

const rawRows = [
  q(
    "001.9月19日神州文化之旅第一天.txt",
    25,
    "孔雀东南飞",
    "汉乐府《孔雀东南飞》",
    "古诗题名",
    "李敖在返乡行程开头借古诗题名转化方向意象，说自己从东南海岛飞回西北故土。",
  ),
  q(
    "001.9月19日神州文化之旅第一天.txt",
    25,
    "西北有高楼",
    "汉乐府《西北有高楼》",
    "古诗题名",
    "李敖承接“向西北飞”的说法，借汉乐府题名说明此行回到西北方向的文化原乡。",
  ),
  q(
    "001.9月19日神州文化之旅第一天.txt",
    55,
    "如今我回来了，你们看便不一样了",
    "纽曼",
    "外国人物语",
    "李敖在抵达北京前引用纽曼归来之语，说明自己此行“回来”后会带来不同的观看和意味。",
    55,
    "校对轮补入：全书引文线索复核时补入，句子本体为归来主题的非政治格言。",
  ),
  q(
    "002.9月20日神州文化之旅第二天.txt",
    109,
    "考古虽然多有舛，临池何碍是其长。一千文抚精神蕴，八百年腾纸墨光。",
    "乾隆帝题跋诗",
    "清代诗句",
    "李敖介绍自己将捐给故宫的乾隆题跋，书中连排出这首跋诗的四句。",
    115,
    "校对轮补入：首轮未扫到分行诗，按原文四句合并收入。",
  ),
  q(
    "002.9月20日神州文化之旅第二天.txt",
    229,
    "为者长成，行者长至",
    "《晏子春秋》",
    "古典格言",
    "李敖在太平路小学黑板题写此句，勉励做事和行路都要靠持续推进而成就。",
  ),
  q(
    "002.9月20日神州文化之旅第二天.txt",
    233,
    "虽有智慧，不如乘势；虽有镃基，不如待时",
    "《孟子》",
    "儒家名句",
    "李敖在母校题写并说明此句，强调才智和工具还要配合时势与时机。",
  ),
  q(
    "002.9月20日神州文化之旅第二天.txt",
    263,
    "往事如烟，永远新鲜；前程似锦，气象万千",
    "李敖",
    "李敖题词",
    "李敖为自己就读过的小学题词，把旧日记忆和未来祝愿并置成联语。",
  ),
  q(
    "003.9月21日神州文化之旅第三天.txt",
    17,
    "演讲的时候不能用稿子",
    "庇护十二世",
    "演讲格言",
    "李敖引用庇护十二世的话，说明演讲若依赖稿子就难以让听众记住。",
    17,
    "校对轮补入：全书引文线索复核时补入，句子本体谈演讲方法，非政治语录。",
  ),
  q(
    "003.9月21日神州文化之旅第三天.txt",
    63,
    "富贵不能淫，贫贱不能移，威武不能屈",
    "《孟子》",
    "儒家名句",
    "李敖引用孟子大丈夫名句，借以说明人格操守不因境遇与压力而转移。",
  ),
  q(
    "003.9月21日神州文化之旅第三天.txt",
    77,
    "今夜扁舟来诀汝",
    "王安石",
    "宋诗句",
    "李敖谈王安石悼亡诗时引用此句，说明离别诀绝的感情力度。",
  ),
  q(
    "003.9月21日神州文化之旅第三天.txt",
    77,
    "此生从此各西东",
    "王安石",
    "宋诗句",
    "李敖接引王安石悼亡诗末句，以“各西东”点出人生离散。",
  ),
  q(
    "003.9月21日神州文化之旅第三天.txt",
    79,
    "天上明月光，疑是地上霜。举头望明月，低头思故乡",
    "李白《静夜思》",
    "唐诗句",
    "李敖引用《静夜思》谈游子思乡；原文作“床前明月光”，此处保留书中口述/转写异文。",
  ),
  q(
    "003.9月21日神州文化之旅第三天.txt",
    201,
    "法海真源，尽在于斯",
    "李敖",
    "李敖题词",
    "李敖在北京法源寺题词，用“法海”“真源”切合法源寺之名和佛法渊源。",
  ),
  q(
    "003.9月21日神州文化之旅第三天.txt",
    201,
    "勿我两忘，人书俱老",
    "李敖",
    "李敖题词",
    "李敖在法源寺题词，把人与书相互不忘、共同老成的意味写成联语。",
  ),
  q(
    "003.9月21日神州文化之旅第三天.txt",
    213,
    "最好是好的敌人",
    "伏尔泰",
    "外国格言",
    "李敖引用伏尔泰语说明自己写作时过度求全，反而使“好”也难以下笔。",
    213,
    "校对轮补入：全书引文线索复核时补入，句子本体为写作/做事格言。",
  ),
  q(
    "003.9月21日神州文化之旅第三天.txt",
    215,
    "一部长篇小说需要六个星期才能完稿",
    "Evelyn Waugh",
    "外国文学格言",
    "李敖引用 Evelyn Waugh 关于长篇小说写作周期的话，解释《北京法源寺》的快速完成。",
    215,
    "校对轮补入：全书引文线索复核时补入，句子本体为文学写作格言。",
  ),
  q(
    "003.9月21日神州文化之旅第三天.txt",
    221,
    "中有苦心而不能显",
    "清朝史学家",
    "史学评语",
    "李敖借清代史学家的评语说明历史小说中的考证用心，有些苦心不易显露。",
    221,
    "校对轮补入：候选复核时补入，句子本体是史学写作评语。",
  ),
  q(
    "003.9月21日神州文化之旅第三天.txt",
    221,
    "中有调剂而人不知",
    "清朝史学家",
    "史学评语",
    "李敖借清代史学家的评语说明历史小说里有出于叙事需要的调剂安排。",
    221,
    "校对轮补入：候选复核时补入，句子本体是史学写作评语。",
  ),
  q(
    "004.9月22日神州文化之旅第四天.txt",
    133,
    "人生七十刚开始",
    "台湾俗语",
    "俗谚",
    "李敖引用台湾流行说法自嘲年纪，说明七十岁仍可视作新的开始。",
    133,
    "校对轮补入：候选复核时补入，句子本体为人生俗谚。",
  ),
  q(
    "004.9月22日神州文化之旅第四天.txt",
    513,
    "你我同在一群中，感情一直都相通。你有快乐我分享，我有忧愁你与共。彼此情谊砌金石，日月明照此寸中。",
    "童子军歌曲",
    "歌谣",
    "李敖在同学会中与旧同学合唱童子军歌曲，歌词表达同伴情谊相通。",
  ),
  q(
    "005.9月23日神州文化之旅第五天.txt",
    31,
    "室中更无人，唯有乳下孙。有孙母未去，出入无完裙",
    "杜甫《石壕吏》",
    "唐诗句",
    "李敖引用杜甫《石壕吏》描写困苦家庭，以古诗呈现民生艰难。",
  ),
  q(
    "005.9月23日神州文化之旅第五天.txt",
    41,
    "怎么爱你，让我一件一件数出来",
    "勃朗宁夫人",
    "外国诗句",
    "李敖引用勃朗宁夫人的爱情诗句，借“一件一件数出来”的方式说明抽象概念也要逐项列举。",
    41,
    "校对轮补入：全书引文线索复核时补入，取其诗句本体；同段现代政治论述不收。",
  ),
  q(
    "005.9月23日神州文化之旅第五天.txt",
    67,
    "北大老，师大穷，只有清华可通融",
    "北京校园俗谚",
    "俗谚",
    "李敖引用北京学校间流传的俗谚，带出清华、北大、师大的民间印象。",
  ),
  q(
    "005.9月23日神州文化之旅第五天.txt",
    71,
    "鸣鼓而攻之",
    "《论语》",
    "古典成语",
    "李敖借《论语》成语说要公开批评可议之处，语气带调侃而不收其具体时政议论。",
  ),
  q(
    "005.9月23日神州文化之旅第五天.txt",
    75,
    "丘有幸，苟有过，人必知之",
    "《论语》",
    "儒家名句",
    "李敖引用孔子自省之语，说明有过失时旁人自然会知道。",
  ),
  q(
    "005.9月23日神州文化之旅第五天.txt",
    83,
    "想象力比知识重要",
    "爱因斯坦",
    "外国格言",
    "李敖引用爱因斯坦名言，强调想象力对知识与创造的意义。",
  ),
  q(
    "005.9月23日神州文化之旅第五天.txt",
    153,
    "朋友就是另一个自己",
    "利玛窦",
    "外国格言",
    "李敖参观利玛窦手稿时引用利玛窦名言，说明朋友与自我之间的亲近关系。",
    153,
    "校对轮补入：全书引文线索复核时补入，句子本体为友谊格言。",
  ),
  q(
    "005.9月23日神州文化之旅第五天.txt",
    157,
    "不做刀笔吏，愿做守藏吏",
    "李敖",
    "李敖题词",
    "李敖在清华题词，借“刀笔吏”“守藏吏”表达自己愿守书藏、重文化的自况。",
  ),
  q(
    "006.9月24日李敖做客凤凰网（聊天节选）.txt",
    83,
    "人书俱老",
    "李敖",
    "李敖题词",
    "李敖解释自己常写“人书俱老”，意思是人随书一起老成。",
  ),
  q(
    "006.9月24日李敖做客凤凰网（聊天节选）.txt",
    153,
    "所有幸福的家庭都是一样的，不幸的家庭各有各的不幸",
    "托尔斯泰《安娜·卡列尼娜》",
    "外国文学名句",
    "李敖引用托尔斯泰小说开头名句，谈家庭经验与人生差异。",
  ),
  q(
    "006.9月24日李敖做客凤凰网（聊天节选）.txt",
    153,
    "他不重，他是我兄弟",
    "外国歌曲/故事",
    "外国歌谣",
    "李敖引用“他不重，他是我兄弟”说明亲人之间承担责任时不以重量计。",
  ),
  q(
    "006.9月24日李敖做客凤凰网（聊天节选）.txt",
    185,
    "行万里路，读万卷书",
    "董其昌",
    "古典格言",
    "李敖引用董其昌语，说明传统把游历和读书并举。",
  ),
  q(
    "006.9月24日李敖做客凤凰网（聊天节选）.txt",
    185,
    "读万卷书，行零里路",
    "李敖",
    "李敖格言",
    "李敖把“行万里路，读万卷书”反转为自况，强调读书对他的意义。",
  ),
  q(
    "006.9月24日李敖做客凤凰网（聊天节选）.txt",
    223,
    "少小离家老大回，乡音无改鬓毛衰；儿童相见不相识，笑问客从何处来？",
    "贺知章《回乡偶书》",
    "唐诗",
    "学生以贺知章诗赠李敖，李敖说这首诗很合乎自己当日回乡处境。",
  ),
  q(
    "006.9月24日李敖做客凤凰网（聊天节选）.txt",
    259,
    "千山将尽，万法唱空。百年即至，唯我四中",
    "李敖",
    "李敖题词",
    "李敖为北京四中题词，把个人百年感和学校记忆凝成短句。",
  ),
  q(
    "006.9月24日李敖做客凤凰网（聊天节选）.txt",
    271,
    "青山依旧在，几度夕阳红",
    "杨慎《临江仙》",
    "明代词句",
    "李敖在昆明湖上引用杨慎词句，以山水依旧反衬自己已经老去。",
    271,
    "校对轮补入：全书引文线索复核时补入，句子本体为古典词句。",
  ),
  q(
    "008.9月26日神州文化之旅第八天.txt",
    41,
    "春风又绿江南岸",
    "王安石《泊船瓜洲》",
    "宋诗句",
    "李敖引用王安石诗句讲文字锤炼，指出“绿”字由形容词转为动词的妙处。",
  ),
  q(
    "008.9月26日神州文化之旅第八天.txt",
    45,
    "待月西厢下，迎风户半开，隔墙花影动，疑是玉人来",
    "《西厢记》",
    "古典戏曲句",
    "李敖引用《西厢记》句子说明含蓄写法，把等待与想象写得有韵致。",
  ),
  q(
    "008.9月26日神州文化之旅第八天.txt",
    69,
    "尊前作剧莫相笑，我死诸君思此狂",
    "陆游",
    "宋诗句",
    "李敖引用陆游诗句自况其狂放；书中注明原诗末字作“生”，此处保留李敖引用异文。",
  ),
  q(
    "008.9月26日神州文化之旅第八天.txt",
    79,
    "英雄割据今已矣，文采风流今尚存",
    "杜甫",
    "唐诗句",
    "李敖借杜甫诗意说明人物功业会过去，文章风采仍能留存；此处保留书中异文。",
  ),
  q(
    "008.9月26日神州文化之旅第八天.txt",
    101,
    "数天涯，依然骨肉，几家能够",
    "顾贞观《金缕曲》",
    "清代词句",
    "李敖引用顾贞观词句，借骨肉分离之叹说明亲族离散的沉痛。",
    101,
    "校对轮补入：候选复核时补入，取其古典词句本体；同段现代政治判断不收。",
  ),
  q(
    "008.9月26日神州文化之旅第八天.txt",
    109,
    "见有一匹灰色马，骑在马上的，名字叫“死”",
    "《新旧约全书·启示录》",
    "宗教文句",
    "李敖引用《启示录》中的死亡意象，回应自己对人生和死亡的看法。",
    109,
    "校对轮补入：全书引文线索复核时补入，句子本体为宗教文学引文。",
  ),
  q(
    "008.9月26日神州文化之旅第八天.txt",
    119,
    "因为它荒谬所以我才相信",
    "拉丁文谚语",
    "外国谚语",
    "李敖引用拉丁文谚语解释自己的夸张说法：正因荒谬，才成其幽默。",
    119,
    "校对轮补入：候选复核时补入，句子本体为哲理谚语。",
  ),
  q(
    "008.9月26日神州文化之旅第八天.txt",
    167,
    "天不生仲尼，万古如长夜。天又生我们，长夜才复旦。",
    "李敖",
    "李敖题词",
    "李敖为复旦大学题词，化用“天不生仲尼，万古如长夜”，再以“复旦”扣合校名。",
    167,
    "校对轮补入：全书题词线索复核时补入。",
  ),
  q(
    "009.9月27日神州文化之旅第九天.txt",
    31,
    "见校欣喜，闻过则悲，悲欣交集，惟我缉规",
    "李敖",
    "李敖题词",
    "李敖为四中校内刊物题词，用“见校”“闻过”写出重返母校的复杂情感。",
  ),
  q(
    "009.9月27日神州文化之旅第九天.txt",
    143,
    "上帝使我们有记忆力，所以到了十二月还有玫瑰",
    "J. M. Barrie",
    "外国文学格言",
    "李敖引用巴瑞关于记忆与玫瑰的话，说明记忆能让已逝时节仍有鲜活感。",
    143,
    "校对轮补入：全书引文线索复核时补入，句子本体为文学格言。",
  ),
  q(
    "009.9月27日神州文化之旅第九天.txt",
    143,
    "北京和上海使我有记忆力，所以北京和上海在九月还有春天",
    "李敖",
    "李敖仿句",
    "李敖仿照巴瑞的记忆玫瑰句式，把北京、上海与九月春天相连，表达此行的记忆感。",
    143,
    "校对轮补入：全书引文线索复核时补入，属于李敖现场仿句。",
  ),
  q(
    "009.9月27日神州文化之旅第九天.txt",
    221,
    "他演奏的时候，演奏错误的部分可以编成一本书",
    "鲁宾斯坦",
    "外国人物语",
    "李敖借鲁宾斯坦自承演奏错误很多的说法，说明大量表达中难免会有错。",
    221,
    "校对轮补入：全书引文线索复核时补入，句子本体为艺术家自嘲式格言。",
  ),
  q(
    "010.9月28日李敖登陆香港.txt",
    53,
    "先天下之忧而忧，后天下之乐而乐",
    "范仲淹《岳阳楼记》",
    "古典名句",
    "李敖引用范仲淹名句，谈知识分子先忧后乐的传统人格理想。",
  ),
  q(
    "011.9月29日李敖神州文化之旅第十一天.txt",
    101,
    "客人和鱼一样，三天就发臭了",
    "外国谚语",
    "外国俗谚",
    "李敖引用西方谚语自嘲作客时间不宜过长，带出行程将近尾声的幽默。",
  ),
  q(
    "011.9月29日李敖神州文化之旅第十一天.txt",
    191,
    "圣人我做不到，可是圣人做我不过如此",
    "王阳明",
    "心学名句",
    "李敖转述王阳明式自信名句，强调人可以用自己的位置反观圣贤。",
  ),
  q(
    "011.9月29日李敖神州文化之旅第十一天.txt",
    191,
    "孔子我做不到，可是孔子做我也不过如此",
    "李敖",
    "李敖格言",
    "李敖仿照王阳明语式改写为孔子，用以表现自负而诙谐的自我定位。",
  ),
  q(
    "011.9月29日李敖神州文化之旅第十一天.txt",
    209,
    "我不怕死，可是我讨厌死",
    "海明威《永别了，武器！》",
    "外国文学名句",
    "李敖引用海明威小说中人物临终的话，区分“不怕死”和“不喜欢死”。",
    209,
    "校对轮补入：全书引文线索复核时补入，句子本体为文学名句。",
  ),
  q(
    "011.9月29日李敖神州文化之旅第十一天.txt",
    243,
    "吾少也贱，故多能鄙事",
    "《论语》",
    "儒家名句",
    "李敖引用孔子自述少时贫贱而多能，说明经验与能力常来自早年处境。",
  ),
  q(
    "011.9月29日李敖神州文化之旅第十一天.txt",
    329,
    "我见青山多妩媚，料青山见我应如是",
    "辛弃疾《贺新郎》",
    "宋词句",
    "李敖引用辛弃疾词句，把观景与自我观照合在一起。",
  ),
];

function q(file, lineStart, quote_text, source_or_origin, category, summary, lineEnd = lineStart, extraNotes = "") {
  return {
    id: "",
    book,
    chapter: file.replace(/^\d+\./, "").replace(/\.txt$/, ""),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text,
    category,
    source_or_origin,
    summary,
    notes: [notes, extraNotes].filter(Boolean).join(" "),
  };
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function normalizeForSourceCheck(value) {
  return String(value)
    .replace(/\s+/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/　/g, "");
}

function getSource(file) {
  const filePath = path.join(sourceDir, file);
  const text = sourceDecoder.decode(fs.readFileSync(filePath));
  return { text, lines: text.split(/\r?\n/) };
}

function countEvidence() {
  const reviewCount = fs.existsSync(reviewTsv)
    ? Math.max(0, fs.readFileSync(reviewTsv, "utf8").trim().split(/\r?\n/).length - 1)
    : 0;
  const attributedCount = fs.existsSync(attributedTsv)
    ? Math.max(0, fs.readFileSync(attributedTsv, "utf8").trim().split(/\r?\n/).length - 1)
    : 0;
  const candidateJson = fs.existsSync(candidatesJson)
    ? JSON.parse(fs.readFileSync(candidatesJson, "utf8"))
    : null;
  const candidateRows = Array.isArray(candidateJson)
    ? candidateJson.filter((row) => row.kind === "quote")
    : candidateJson?.quoteCandidates ?? [];
  const uniqueQuoteTexts = Array.isArray(candidateJson)
    ? new Set(candidateRows.map((row) => row.text).filter(Boolean)).size
    : candidateJson?.uniqueQuoteTexts?.length ?? 0;
  const keywordLines = Array.isArray(candidateJson)
    ? candidateJson.filter((row) => row.kind === "keyword_line").length
    : candidateJson?.keywordLines?.length ?? 0;
  return {
    reviewCount,
    attributedCount,
    quoteCandidates: candidateRows.length,
    uniqueQuoteTexts,
    keywordLines,
  };
}

const sourceTexts = new Map();
const auditRows = [];
const duplicateText = new Map();
const modernPoliticalTerms = [
  "共产党",
  "国民党",
  "民进党",
  "总统",
  "立法院",
  "行政院",
  "民意代表",
  "军购",
  "宪法",
  "宪政",
  "竞选",
  "选举",
  "革命",
  "民主",
  "自由",
  "独裁",
  "统治",
  "政府",
  "政权",
  "政治",
  "政党",
  "国家",
  "台湾",
  "大陆",
  "两岸",
];

for (const row of rawRows) {
  const key = row.quote_text;
  duplicateText.set(key, (duplicateText.get(key) ?? 0) + 1);
  if (!sourceTexts.has(row.source_file)) {
    sourceTexts.set(row.source_file, getSource(row.source_file));
  }
  const source = sourceTexts.get(row.source_file);
  const sourceText = normalizeForSourceCheck(source.lines.slice(row.line_start - 1, row.line_end).join("\n"));
  const quoteText = normalizeForSourceCheck(row.quote_text);
  const found = sourceText.includes(quoteText);
  const politicalHits = modernPoliticalTerms.filter((term) => row.quote_text.includes(term));
  auditRows.push({
    ...row,
    source_found: found ? "yes" : "no",
    political_hits: politicalHits.join("|"),
  });
}

const duplicateRows = [...duplicateText.entries()].filter(([, count]) => count > 1);
const missingRows = auditRows.filter((row) => row.source_found !== "yes");
const politicalRows = auditRows.filter((row) => row.political_hits);

if (duplicateRows.length || missingRows.length || politicalRows.length) {
  console.error("Audit failed.");
  if (duplicateRows.length) console.error("Duplicate quote_text:", duplicateRows);
  if (missingRows.length) console.error("Missing in source:", missingRows);
  if (politicalRows.length) console.error("Political term hits:", politicalRows);
  process.exit(1);
}

const rows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}${String(index + 1).padStart(3, "0")}`,
}));
const proofreadAddedCount = rows.filter((row) => row.notes.includes("校对轮补入")).length;

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(auditTsv), { recursive: true });

const headers = [
  "id",
  "book",
  "chapter",
  "source_file",
  "line_start",
  "line_end",
  "quote_text",
  "category",
  "source_or_origin",
  "summary",
  "notes",
];
const csv = [headers.join(","), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(","))].join("\n");
fs.writeFileSync(outCsv, `${csv}\n`, "utf8");

const txt = rows
  .map(
    (row) =>
      `${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}\n` +
      `${row.quote_text}\n` +
      `出处/来源：${row.source_or_origin}\n` +
      `类别：${row.category}\n` +
      `说明：${row.summary}\n` +
      `备注：${row.notes}`,
  )
  .join("\n\n");
fs.writeFileSync(outTxt, `${txt}\n`, "utf8");

const auditHeaders = [
  "id",
  "source_file",
  "line_start",
  "line_end",
  "quote_text",
  "source_found",
  "political_hits",
  "summary",
  "notes",
];
const audit = [
  auditHeaders.join("\t"),
  ...auditRows.map((row, index) =>
    auditHeaders
      .map((key) =>
        String(key === "id" ? `${idPrefix}${String(index + 1).padStart(3, "0")}` : row[key] ?? "").replace(/\t/g, " "),
      )
      .join("\t"),
  ),
].join("\n");
fs.writeFileSync(auditTsv, `${audit}\n`, "utf8");

const sourceFiles = fs
  .readdirSync(sourceDir)
  .filter((name) => /^\d{3}\..+\.txt$/.test(name))
  .sort();
const evidence = countEvidence();
const categoryCounts = rows.reduce((acc, row) => {
  acc[row.category] = (acc[row.category] ?? 0) + 1;
  return acc;
}, {});
const sourceCounts = rows.reduce((acc, row) => {
  acc[row.source_file] = (acc[row.source_file] ?? 0) + 1;
  return acc;
}, {});

const report = [
  `《${book}》校对轮导出报告`,
  "",
  `生成日期：${generatedDate}`,
  `源目录：${sourceDir}`,
  `源正文文件数：${sourceFiles.length}`,
  `候选引号片段：${evidence.quoteCandidates}`,
  `候选唯一文本：${evidence.uniqueQuoteTexts}`,
  `关键词行：${evidence.keywordLines}`,
  `人工复核候选：${evidence.reviewCount}`,
  `归因行候选：${evidence.attributedCount}`,
  "校对统计：",
  `- 首轮收入：${rows.length - proofreadAddedCount}`,
  `- 校对补入：${proofreadAddedCount}`,
  "- 校对删除：0",
  `- 校对后收入：${rows.length}`,
  "",
  "收入原则：",
  notes,
  "",
  "类别统计：",
  ...Object.entries(categoryCounts).map(([key, count]) => `- ${key}: ${count}`),
  "",
  "文件统计：",
  ...Object.entries(sourceCounts).map(([key, count]) => `- ${key}: ${count}`),
  "",
  "输出文件：",
  `- ${outCsv}`,
  `- ${outTxt}`,
  `- ${auditTsv}`,
  "",
  "自动检查：",
  "- quote_text 均可在对应源文件中定位。",
  "- quote_text 无重复。",
  "- quote_text 未命中现代政治词表。",
];
fs.writeFileSync(reportTxt, `${report.join("\n")}\n`, "utf8");

console.log(`wrote ${rows.length} rows`);
console.log(outCsv);
console.log(outTxt);
console.log(auditTsv);
console.log(reportTxt);
