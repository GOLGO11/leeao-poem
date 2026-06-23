const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(
  root,
  "《大李敖全集6.0》分章节",
  "008.书信函件类",
  "005.李敖书札集",
);
const exportsDir = path.join(root, "exports");
const analysisDir = path.join(root, "analysis");
const bookName = "李敖书札集";
const generatedDate = "2026-06-22";
const sourceBase = "《大李敖全集6.0》分章节/008.书信函件类/005.李敖书札集";

const outputCsv = path.join(exportsDir, `${bookName}_诗文格言歌谣引用.csv`);
const outputTxt = path.join(exportsDir, `${bookName}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_shuzhaji_initial_report.txt");
const auditPath = path.join(analysisDir, "liao_shuzhaji_initial_audit.tsv");
const proofreadReportPath = path.join(analysisDir, "liao_shuzhaji_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_shuzhaji_proofread_audit.tsv");
const candidatesPath = path.join(analysisDir, "liao_shuzhaji_quote_candidates.json");
const reviewPath = path.join(analysisDir, "liao_shuzhaji_review_candidates.tsv");
const attributedPath = path.join(analysisDir, "liao_shuzhaji_attributed_lines.tsv");

const decoder = new TextDecoder("gb18030");
const quotePattern = /[“”‘’《》]|(?:[A-Z][A-Za-z]+(?:[,，;；:：.!?'"() -]+[A-Za-z]+){2,})/;
const attributionPattern =
  /(古话|俗话|谚语|格言|成语|名言|诗|曰|说|云|笛卡儿|萧伯纳|陶渊明|托尔斯泰|曾子|陆游|战国策|蒋廷黻|圣经|范仲淹|索菲亚罗兰)/;
const politicalPattern =
  /(政治|国会|总统|总裁|政府|政党|国民党|共产党|民主|选举|外交|主权|人权|二二八|西藏|雷震案|司法|法院|军政|民族国家|革命|党国|中共|马克思主义|集权政权|出版法|报禁|查禁|党外|警总|陈文成|美丽岛|极权)/;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readText(filePath) {
  return decoder.decode(fs.readFileSync(filePath));
}

function compact(text) {
  return String(text)
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeForMatch(text) {
  return compact(text).replace(/\s+/g, "");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function getSourceFiles() {
  return fs
    .readdirSync(sourceDir)
    .filter((name) => name.endsWith(".txt"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))
    .map((name) => ({
      name,
      absolutePath: path.join(sourceDir, name),
      text: readText(path.join(sourceDir, name)),
    }));
}

const rawEntries = [
  ["001.致管区警察头子书.txt", 19, 19, "知过能改", "成语", "成语"],

  ["002.讨老婆的一个新害处.txt", 119, 119, "成事不足，败事有余", "成语", "成语"],
  ["002.讨老婆的一个新害处.txt", 123, 123, "旁观者清", "成语", "成语"],
  [
    "002.讨老婆的一个新害处.txt",
    143,
    143,
    "伟大的人只有一个主调……如何重建自己，开拓思想的园地，其他的都只是陪衬而已",
    "思想格言",
    "殷海光",
  ],
  ["002.讨老婆的一个新害处.txt", 249, 249, "思想家千万不能讨老婆。", "幽默格言", "李敖"],

  ["004.假戏真做与假戏假做.txt", 9, 9, "这种生活比想象中糟得多，糟得很多。", "现代引语", "索菲亚罗兰"],
  [
    "004.假戏真做与假戏假做.txt",
    9,
    9,
    "我绝不会再回牢里，不、不，即使我杀了人，我也绝不回去。",
    "现代引语",
    "索菲亚罗兰",
  ],
  ["004.假戏真做与假戏假做.txt", 15, 15, "那儿就像是个地狱！", "现代引语", "索菲亚罗兰"],
  ["004.假戏真做与假戏假做.txt", 19, 19, "人生如戏", "成语化短语", "俗语"],
  ["004.假戏真做与假戏假做.txt", 19, 19, "假戏真做", "成语化短语", "俗语"],
  [
    "004.假戏真做与假戏假做.txt",
    19,
    19,
    "一旦她们面对了真实的人生，她们本人，却变得一片脆弱与虚假",
    "人生格言",
    "李敖",
  ],
  [
    "004.假戏真做与假戏假做.txt",
    23,
    23,
    "一个人，完全靠群众的掌声来过活的，很少不是虚假的。",
    "人生格言",
    "李敖",
  ],
  ["004.假戏真做与假戏假做.txt", 23, 23, "十目所视、十手所指", "古语引用", "古语"],
  ["004.假戏真做与假戏假做.txt", 23, 23, "假戏假做", "成语化短语", "李敖"],

  [
    "005.我们要有批评党外的自由.txt",
    7,
    7,
    "这样书面交往，反倒容易把思考落实，容易显出具体的成果与结论。",
    "书信格言",
    "李敖",
  ],
  ["005.我们要有批评党外的自由.txt", 9, 9, "大眼瞪小眼", "俗语", "俗语"],
  ["005.我们要有批评党外的自由.txt", 9, 9, "杯酒言欢", "成语", "成语"],
  ["005.我们要有批评党外的自由.txt", 9, 9, "悲歌慷慨", "成语", "成语"],

  ["006.论“影子政权”.txt", 5, 5, "堂下朱栏小魏红", "古诗引用", "古诗"],
  ["006.论“影子政权”.txt", 7, 7, "我思，故我在", "哲学格言", "笛卡儿"],
  ["006.论“影子政权”.txt", 7, 7, "I think,therefore I am", "哲学格言", "笛卡儿"],
  ["006.论“影子政权”.txt", 7, 7, "我在，故我思", "哲学格言", "萧伯纳《人与超人》"],
  ["006.论“影子政权”.txt", 7, 7, "I am; therefore I think.", "哲学格言", "萧伯纳《人与超人》"],

  ["007.学者名流与公帑.txt", 11, 11, "杜门潜修，炳烛余光", "古语化短语", "李敖引文"],
  ["007.学者名流与公帑.txt", 23, 23, "归去来兮", "古文引用", "陶渊明《归去来辞》"],
  ["007.学者名流与公帑.txt", 23, 23, "眄庭柯以怡颜，倚南窗以寄傲。", "古文引用", "陶渊明《归去来辞》"],

  ["008.给黄少谷先生的又一公开信.txt", 13, 13, "徒法不足以自行", "古语引用", "古语"],
  ["008.给黄少谷先生的又一公开信.txt", 15, 15, "听者藐藐", "古语短语", "古语"],
  ["008.给黄少谷先生的又一公开信.txt", 15, 15, "行不得也", "古语短语", "古语"],
  ["008.给黄少谷先生的又一公开信.txt", 59, 59, "水落石出", "成语", "成语"],
  ["008.给黄少谷先生的又一公开信.txt", 85, 85, "结怨何时休？", "人生短语", "李敖"],
  ["008.给黄少谷先生的又一公开信.txt", 87, 87, "迟来的正义就不算是正义", "西方谚语", "西方谚语"],
  ["008.给黄少谷先生的又一公开信.txt", 101, 101, "积善之家，必有余庆", "古语引用", "《易传》"],
  ["008.给黄少谷先生的又一公开信.txt", 101, 101, "积不善之家，必有余殃", "古语引用", "《易传》"],

  ["009.志在搅局.txt", 17, 17, "Isn't that the musician you fired yesterday?", "英文笑话", "英文笑话"],
  ["009.志在搅局.txt", 45, 45, "人间“报应”，得在四十年后不爽", "人生短语", "李敖"],
  ["009.志在搅局.txt", 45, 45, "长寿似乌龟", "幽默短语", "李敖"],

  ["010.不要凭借已成的势力.txt", 5, 5, "息交绝游", "成语", "成语"],
  ["010.不要凭借已成的势力.txt", 5, 5, "三顾茅庐", "成语", "成语"],
  ["010.不要凭借已成的势力.txt", 5, 5, "草堂春睡", "典故短语", "三国典故"],
  ["010.不要凭借已成的势力.txt", 5, 5, "隆中三策", "典故短语", "三国典故"],
  ["010.不要凭借已成的势力.txt", 5, 5, "依违其间", "成语化短语", "古语"],
  ["010.不要凭借已成的势力.txt", 7, 7, "赵孟之所贵者，赵孟亦能贱之", "古语引用", "古语"],
  ["010.不要凭借已成的势力.txt", 9, 9, "妄想凭借已成的势力", "人物警语", "章太炎"],
  ["010.不要凭借已成的势力.txt", 15, 15, "为人作嫁", "成语", "成语"],
  [
    "010.不要凭借已成的势力.txt",
    19,
    19,
    "有才具的人该珍惜他的才具，做完成自己的大事。",
    "人生格言",
    "李敖",
  ],
  ["010.不要凭借已成的势力.txt", 19, 19, "塞翁失马", "成语", "成语"],
  [
    "010.不要凭借已成的势力.txt",
    19,
    19,
    "雨笠烟蓑之中、人情冷暖之下，踏上新的前程。",
    "抒情文句",
    "李敖",
  ],

  ["011.国民党与豹.txt", 9, 9, "道不同不相为谋", "古语引用", "《论语》"],
  ["011.国民党与豹.txt", 9, 9, "契阔死生", "古语短语", "古语"],
  ["011.国民党与豹.txt", 15, 15, "外行看热闹，内行看门道。", "俗语", "俗语"],
  [
    "011.国民党与豹.txt",
    15,
    15,
    "中有苦心而不能显，内有调济而人不知",
    "古文引用",
    "章学诚",
  ],
  ["011.国民党与豹.txt", 19, 19, "皮之不存，毛将焉附", "成语", "成语"],
  ["011.国民党与豹.txt", 19, 19, "皮里阳秋", "成语", "成语"],
  ["011.国民党与豹.txt", 19, 19, "豹死留皮", "成语", "成语"],

  ["012.要舍得骂自己人.txt", 7, 7, "上驷对下驷", "典故短语", "田忌赛马典故"],
  ["012.要舍得骂自己人.txt", 35, 35, "重蹈《深耕》那次不准我批评的覆辙", "成语化短语", "李敖"],
  ["012.要舍得骂自己人.txt", 63, 63, "敢做敢当", "成语", "成语"],
  ["012.要舍得骂自己人.txt", 63, 63, "临难想苟免", "古语化短语", "李敖"],
  ["012.要舍得骂自己人.txt", 63, 63, "作之不止，乃成好汉", "俗语化短语", "李敖"],

  ["014.写出中华儿女真的血泪.txt", 5, 5, "唯恐每周不乱", "幽默短语", "李敖"],
  [
    "014.写出中华儿女真的血泪.txt",
    7,
    7,
    "幸福的家庭都是一样的，不幸的家庭各有各的不幸",
    "文学名句",
    "托尔斯泰《安娜·卡列尼娜》",
  ],
  [
    "014.写出中华儿女真的血泪.txt",
    7,
    7,
    "真的故事，假的不要；并且要动人的故事，太普通的也不要",
    "写作格言",
    "李敖",
  ],
  ["014.写出中华儿女真的血泪.txt", 7, 7, "这是真的文学与历史", "文史短语", "李敖"],

  ["015.林洋港与应召女郎.txt", 123, 123, "釜底抽薪", "成语", "成语"],
  ["015.林洋港与应召女郎.txt", 133, 133, "大业鸿开", "成语化短语", "古语"],
  ["015.林洋港与应召女郎.txt", 151, 151, "非不能也，是不为也", "古语化短语", "古语"],
  ["015.林洋港与应召女郎.txt", 153, 153, "车水马龙", "成语", "成语"],

  [
    "016.我很刁.txt",
    11,
    11,
    "报导当事人任何消息，都以亲见为要件，耳食之言，一概不登。",
    "新闻格言",
    "包德甫",
  ],
  ["016.我很刁.txt", 15, 15, "我颇有幽默感，要不然，我准会发疯。", "现代引语", "甘地"],
  ["016.我很刁.txt", 17, 17, "鸡毛蒜皮，一说就俗", "俗语化短语", "李敖"],
  ["016.我很刁.txt", 17, 17, "情随事迁", "成语", "成语"],
  ["016.我很刁.txt", 19, 19, "我很刁，但这正是我的长处。", "自述格言", "李敖"],
  ["016.我很刁.txt", 19, 19, "心直口快、侠骨柔情", "人物短语", "李敖"],
  ["016.我很刁.txt", 19, 19, "逆耳之忠言", "成语化短语", "李敖"],

  ["017.君子之爱与细人之爱.txt", 17, 17, "华而睆！大夫之箦与！", "古文引用", "《礼记·檀弓》"],
  [
    "017.君子之爱与细人之爱.txt",
    17,
    17,
    "君子之爱人也，以德；细人之爱人也，以姑息。",
    "古文引用",
    "《礼记·檀弓》",
  ],
  ["017.君子之爱与细人之爱.txt", 17, 17, "吾得正而毙焉，斯已矣！", "古文引用", "《礼记·檀弓》"],
  ["017.君子之爱与细人之爱.txt", 19, 19, "君子之爱", "古语短语", "《礼记·檀弓》"],
  ["017.君子之爱与细人之爱.txt", 19, 19, "细人之爱", "古语短语", "《礼记·檀弓》"],
  ["017.君子之爱与细人之爱.txt", 19, 19, "爱之适足以害之", "处世格言", "李敖"],
  [
    "017.君子之爱与细人之爱.txt",
    21,
    21,
    "他的能力就是那样子的，他不能更高了！",
    "现代引语",
    "电影台词转述",
  ],
  [
    "017.君子之爱与细人之爱.txt",
    27,
    27,
    "提名道姓，把专有名词当做普通名词用，（李敖甚至把名词当做动词用！）会使得一篇文章更亲切、更生动！",
    "写作格言",
    "邓维桢按语",
  ],
  [
    "017.君子之爱与细人之爱.txt",
    27,
    27,
    "独立思考最重要的，就是训练自己思考问题的时候，不要被情绪左右。",
    "思想格言",
    "邓维桢按语",
  ],

  ["018.射鬼箭.txt", 7, 7, "射鬼箭", "典故短语", "李敖"],
  ["018.射鬼箭.txt", 7, 7, "瞻之在前，忽焉在后", "古语引用", "《论语》"],

  ["019.几个主题的讨论.txt", 9, 9, "不人云亦云", "成语化短语", "李敖"],
  [
    "019.几个主题的讨论.txt",
    19,
    19,
    "当你真的认识了李敖，李敖所说的就是你想说的，李敖所写的就是你想写的，李敖只是代编者立言而已，编者岂能退自己的稿哉？",
    "书信格言",
    "李敖",
  ],
  ["019.几个主题的讨论.txt", 35, 35, "尊重异议，珍惜异议", "处世格言", "邓维桢"],
  [
    "019.几个主题的讨论.txt",
    43,
    43,
    "被正确地“丑化”了，“被害者”便比较不容易自欺欺人，对别人、对自己，都比较安全；被曲解地“丑化”了，实际上受不到任何伤害。",
    "思想格言",
    "邓维桢",
  ],
  [
    "019.几个主题的讨论.txt",
    47,
    47,
    "任何的改变——包括一个人想法的改变——都不容易是迅速而断然的。",
    "处世格言",
    "邓维桢",
  ],
  ["019.几个主题的讨论.txt", 47, 47, "顺乎自然的改变，才是比较稳定、可靠的改变。", "处世格言", "邓维桢"],
  [
    "019.几个主题的讨论.txt",
    71,
    71,
    "不登娈童之床，不入季女之室，服膺简策，不知老之将至。平生素怀，若斯而已。",
    "古文引用",
    "许散愁语",
  ],
  ["019.几个主题的讨论.txt", 73, 73, "水准是多么重要", "人生短语", "李敖"],
  ["019.几个主题的讨论.txt", 75, 75, "有话直说、说真话、不做乡愿", "处世格言", "李敖"],
  ["019.几个主题的讨论.txt", 95, 95, "不要在水准以下而不自知！", "人生格言", "李敖"],
  ["019.几个主题的讨论.txt", 97, 97, "当头棒喝", "成语", "成语"],

  ["020.惭愧是不够的！.txt", 13, 13, "天方夜谭", "成语", "成语"],
  ["020.惭愧是不够的！.txt", 23, 23, "“相信”总不是证据吧？", "论辩短语", "李敖"],
  ["020.惭愧是不够的！.txt", 29, 29, "为善不欲人知", "古语化短语", "古语"],
  [
    "020.惭愧是不够的！.txt",
    89,
    89,
    "知识分子立言不可不重事实，有如此者！",
    "文论格言",
    "李敖",
  ],
  ["020.惭愧是不够的！.txt", 99, 99, "施人慎勿念，受施慎勿忘", "古语引用", "古语"],
  ["020.惭愧是不够的！.txt", 103, 103, "宁鸣而死，不默而生", "古语引用", "范仲淹语意"],
  ["020.惭愧是不够的！.txt", 107, 107, "女（汝）安则为之", "古语引用", "古语"],
  ["020.惭愧是不够的！.txt", 1, 1, "惭愧是不够的！", "题旨短语", "李敖"],

  ["023.“体外射精”的一些成绩.txt", 11, 11, "brand-new", "英文短语", "英文"],
  ["023.“体外射精”的一些成绩.txt", 13, 13, "天作孽，犹可违；自作孽，不可活。", "古语引用", "古话"],
  ["023.“体外射精”的一些成绩.txt", 13, 13, "催生之功，功不可没", "成语化短语", "李敖"],
  ["023.“体外射精”的一些成绩.txt", 23, 23, "号外的号外", "幽默短语", "来信引语"],
  ["023.“体外射精”的一些成绩.txt", 25, 25, "一般写序，都是讲好话，编假话，虚张声势。", "书序格言", "李敖"],
  ["023.“体外射精”的一些成绩.txt", 25, 25, "要夸奖李敖的话，没有人比李敖自己更内行，勿庸他人代劳。", "幽默格言", "李敖"],
  ["023.“体外射精”的一些成绩.txt", 63, 63, "取法乎上", "古语短语", "古语"],
  ["023.“体外射精”的一些成绩.txt", 63, 63, "得法乎中", "古语短语", "古语"],
  ["023.“体外射精”的一些成绩.txt", 63, 63, "取法乎中", "古语短语", "古语"],
  ["023.“体外射精”的一些成绩.txt", 63, 63, "得法乎下", "古语短语", "古语"],
  ["023.“体外射精”的一些成绩.txt", 75, 75, "知其不可为而为之", "古语引用", "《论语》语意"],
  [
    "023.“体外射精”的一些成绩.txt",
    83,
    83,
    "有话直说、说真话、不做乡愿的人，常注定是悲剧的下场。",
    "处世格言",
    "来信引语",
  ],
  ["023.“体外射精”的一些成绩.txt", 83, 83, "燃烧自己、照亮别人", "人生格言", "来信引语"],
  ["023.“体外射精”的一些成绩.txt", 95, 95, "任重道远", "成语", "成语"],

  ["024.“一字师”还敢否？.txt", 5, 5, "一字师", "典故短语", "典故"],
  ["024.“一字师”还敢否？.txt", 5, 5, "买一送一", "俗语", "俗语"],
  ["024.“一字师”还敢否？.txt", 5, 5, "侵权行为，死罪死罪", "幽默短语", "李敖"],
  ["024.“一字师”还敢否？.txt", 21, 21, "锦上添花", "成语", "成语"],

  ["025.他妈的等死了一个.txt", 7, 7, "打铁趁热", "成语", "成语"],
  [
    "025.他妈的等死了一个.txt",
    13,
    19,
    `人生如春蚕，
作茧自缠裹。
一朝眉羽成，
钻破亦在我。`,
    "古诗引用",
    "陆游诗",
  ],
  ["025.他妈的等死了一个.txt", 23, 23, "一蟹不如一蟹", "俗语", "俗语"],

  ["027.给方素敏的一封信.txt", 9, 9, "行百里者半九十", "古语引用", "《战国策》引诗"],
  ["027.给方素敏的一封信.txt", 13, 13, "挽断罗衣", "诗词典故", "诗词典故"],

  ["028.会计学上的新成本.txt", 19, 19, "读书破万卷", "古诗引用", "杜甫诗句"],
  ["028.会计学上的新成本.txt", 25, 25, "挂羊头卖狗肉", "俗语", "俗语"],
  ["028.会计学上的新成本.txt", 25, 25, "生米煮成熟饭", "俗语", "俗语"],

  ["030.病中做工.txt", 9, 9, "人生如是，方有意义。", "人生格言", "李敖"],

  ["031.“不要动”与“快半拍”.txt", 11, 11, "旧梦重温", "成语", "成语"],
  ["031.“不要动”与“快半拍”.txt", 23, 23, "一网兜收", "俗语化短语", "李敖"],
  ["031.“不要动”与“快半拍”.txt", 29, 29, "不打不相识", "俗语", "俗语"],
  ["031.“不要动”与“快半拍”.txt", 63, 63, "铁证如山", "成语", "成语"],
  ["031.“不要动”与“快半拍”.txt", 63, 63, "一棒打死", "俗语", "俗语"],
  ["031.“不要动”与“快半拍”.txt", 67, 67, "留青山", "俗语化短语", "俗语"],
  ["031.“不要动”与“快半拍”.txt", 107, 107, "快半拍", "俗语化短语", "李敖"],

  ["032.上县太爷书.txt", 19, 19, "团体不失立场，个人不失身份", "处世格言", "左舜生"],
  ["032.上县太爷书.txt", 21, 21, "狗眼看人低", "俗语", "俗语"],
  ["032.上县太爷书.txt", 21, 21, "走老运", "俗语", "俗语"],
  ["032.上县太爷书.txt", 21, 21, "张牙舞爪", "成语", "成语"],
  ["032.上县太爷书.txt", 23, 23, "志在春秋与千秋", "人生格言", "李敖"],

  ["033.宾馆、牢房与猪鬃.txt", 7, 7, "池鱼之殃", "成语", "成语"],
  ["033.宾馆、牢房与猪鬃.txt", 7, 7, "只许州官放火，不许百姓点灯", "俗语", "俗语"],
  ["033.宾馆、牢房与猪鬃.txt", 11, 11, "法律之前人人平等", "法理格言", "法理常语"],

  [
    "034.“有谁跌倒，我不焦急呢？”.txt",
    7,
    7,
    "小孩子被板凳绊了一跤，要怪小孩子，不要怪板凳。",
    "比喻格言",
    "李敖",
  ],
  ["034.“有谁跌倒，我不焦急呢？”.txt", 15, 15, "自大呷破碗", "俗语", "台语俗语"],
  ["034.“有谁跌倒，我不焦急呢？”.txt", 25, 25, "悲从中来", "成语", "成语"],
  ["034.“有谁跌倒，我不焦急呢？”.txt", 25, 25, "喜极而泣", "成语", "成语"],
  ["034.“有谁跌倒，我不焦急呢？”.txt", 29, 29, "有谁软弱，我不软弱呢？", "圣经典故", "《圣经》语句"],
  ["034.“有谁跌倒，我不焦急呢？”.txt", 31, 31, "有谁跌倒，我不焦急呢？", "圣经典故", "《圣经》语句"],
  ["034.“有谁跌倒，我不焦急呢？”.txt", 33, 33, "君子之爱", "古语短语", "《礼记·檀弓》"],
  ["034.“有谁跌倒，我不焦急呢？”.txt", 33, 33, "细人之爱", "古语短语", "《礼记·檀弓》"],

  [
    "035.给“雷震之女”的一封信.txt",
    7,
    7,
    "人间只有两种人，一种是做事的，一种是说风凉话的",
    "人生格言",
    "李敖",
  ],
  [
    "035.给“雷震之女”的一封信.txt",
    9,
    9,
    "圆滑、通融、敷衍以及什么消极、清高，都应该打倒。我们要做事。",
    "人生格言",
    "蒋廷黻",
  ],
  ["035.给“雷震之女”的一封信.txt", 9, 9, "官可不做事要做。别的可牺牲，事业不可牺牲。", "人生格言", "蒋廷黻"],
  [
    "035.给“雷震之女”的一封信.txt",
    9,
    9,
    "做事的人，我们要拥护、要崇拜。说便宜话的人，纵使其话说得十分漂亮，我们要鄙视。",
    "人生格言",
    "蒋廷黻",
  ],
  [
    "035.给“雷震之女”的一封信.txt",
    11,
    11,
    "做事做出来的具体成绩",
    "处世短语",
    "李敖",
  ],
  ["035.给“雷震之女”的一封信.txt", 15, 15, "不能再等了，不能再等了。", "催促短语", "李敖"],
  ["035.给“雷震之女”的一封信.txt", 17, 17, "幽光潜德", "成语化短语", "古语"],
];

const entries = rawEntries.map((entry, index) => {
  const [file, lineStart, lineEnd, quote, category, origin, summary, notes = ""] = entry;
  return {
    id: `LASHZJ-${String(index + 1).padStart(4, "0")}`,
    book: bookName,
    chapter: file.replace(/^\d+\./, "").replace(/\.txt$/, ""),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: compact(quote),
    category,
    source_or_origin: origin,
    summary: summary || `收为${category}，保留其可独立引用的语义。`,
    notes,
  };
});

const proofreadRemoved = [
  { id: "LASHZJ-0014", reason: "短语直接落在明星谈政治、政客拉拢明星的结论中，校对轮按公共讽刺语境删除。" },
  { id: "LASHZJ-0024", reason: "原文为总统、公帑与人物礼遇语境中的称述，政治人物场景过重。" },
  { id: "LASHZJ-0030", reason: "司法案情追究中的成语，原文与法院、冤狱叙事直接相连。" },
  { id: "LASHZJ-0032", reason: "西方谚语被用于冤狱判决与法院场景，按司法攻防语境删除。" },
  { id: "LASHZJ-0033", reason: "《易传》句被用于公开信中的党派人物规劝，政治语境强于格言价值。" },
  { id: "LASHZJ-0034", reason: "《易传》句被用于公开信中的党派人物规劝，政治语境强于格言价值。" },
  { id: "LASHZJ-0044", reason: "章太炎语被置入媒体垄断与党派权力讨论中，按现代公共议题语境删除。" },
  { id: "LASHZJ-0053", reason: "成语直接服务国民党与言论尺度讽刺，删除。" },
  { id: "LASHZJ-0054", reason: "成语直接服务国民党与言论尺度讽刺，删除。" },
  { id: "LASHZJ-0055", reason: "成语直接服务国民党与言论尺度讽刺，删除。" },
  { id: "LASHZJ-0057", reason: "quote_text 已含具体刊物和批评禁令，直接属于党外论争语境。" },
  { id: "LASHZJ-0065", reason: "成语嵌在公权取缔与警政责任讨论中，校对轮删除。" },
  { id: "LASHZJ-0066", reason: "短语用于公权取缔与色情营业调查语境，独立格言价值不足。" },
  { id: "LASHZJ-0067", reason: "古语化短句直接用于警政责任判断，公共治理语境过重。" },
  { id: "LASHZJ-0068", reason: "成语只是警政调查场景的街面描写，独立检索价值不足。" },
  { id: "LASHZJ-0082", reason: "电影台词被直接用于现代公共人物能力评判，校对轮删除。" },
  { id: "LASHZJ-0103", reason: "古语被用于政治迫害、言论自由与斗士叙事，按政治语录相关删除。" },
  { id: "LASHZJ-0104", reason: "古语引用处在枪林弹雨、敌我与公共斗争语境中，删除。" },
  { id: "LASHZJ-0116", reason: "《论语》语意被用于总统、党派与烈士叙事，现代政治语境过重。" },
  { id: "LASHZJ-0117", reason: "处世句被用于党派杂志与烈士角色自述，校对轮删除。" },
  { id: "LASHZJ-0118", reason: "燃烧自己、照亮别人被用于公共斗争角色叙事，删除。" },
  { id: "LASHZJ-0119", reason: "成语所在原文明确谈政治问题共识，删除。" },
  { id: "LASHZJ-0121", reason: "短语嵌在后援会与党派文章调度语境中，独立格言价值不足。" },
  { id: "LASHZJ-0122", reason: "幽默短句嵌在后援会与党派文章调度语境中，删除。" },
  { id: "LASHZJ-0123", reason: "成语用于竞选原则和党外发展论述，删除。" },
  { id: "LASHZJ-0128", reason: "诗词典故被用于受难者、抗暴和复仇场景，政治受难语境过重。" },
  { id: "LASHZJ-0129", reason: "古诗句被直接置入查禁、抢书和出版管制语境，删除。" },
  { id: "LASHZJ-0130", reason: "俗语直接服务报刊出版管制讽刺，删除。" },
  { id: "LASHZJ-0131", reason: "俗语直接服务报刊出版管制讽刺，删除。" },
  { id: "LASHZJ-0133", reason: "成语来自查禁与警察局场景，删除。" },
  { id: "LASHZJ-0134", reason: "短语用于查扣书刊场景，删除。" },
  { id: "LASHZJ-0135", reason: "俗语来自查禁公文进入公司的现场叙事，删除。" },
  { id: "LASHZJ-0136", reason: "成语直接连着查禁与国民党统治语境，删除。" },
  { id: "LASHZJ-0137", reason: "俗语直接连着查禁与国民党统治语境，删除。" },
  { id: "LASHZJ-0138", reason: "俗语化短语来自因义受难与保留实力语境，公共斗争色彩过重。" },
  { id: "LASHZJ-0139", reason: "短语为查禁命令时点判断，非独立诗文格言。" },
  { id: "LASHZJ-0140", reason: "左舜生语被用于党派合作与地方政治分寸，删除。" },
  { id: "LASHZJ-0141", reason: "俗语来自阿登纳、一党独大和集中营政治寓言，校对轮删除。" },
  { id: "LASHZJ-0142", reason: "俗语来自阿登纳、一党独大和集中营政治寓言，校对轮删除。" },
  { id: "LASHZJ-0143", reason: "成语来自阿登纳、一党独大和集中营政治寓言，校对轮删除。" },
  { id: "LASHZJ-0144", reason: "短句直接规劝党外人士，现代党派语境过重。" },
  { id: "LASHZJ-0145", reason: "成语用于三通、政治对立与国民党批评语境，删除。" },
  { id: "LASHZJ-0146", reason: "俗语用于三通、政治对立与国民党批评语境，删除。" },
  { id: "LASHZJ-0147", reason: "法理常语处在跨海、外交和通匪等公共法律论述中，删除。" },
  { id: "LASHZJ-0148", reason: "比喻句直接用于党外主流派与公共人物失败评价，删除。" },
  { id: "LASHZJ-0149", reason: "俗语直接用于政治人物失败评价，删除。" },
  { id: "LASHZJ-0150", reason: "成语直接用于党外选后叙事，删除。" },
  { id: "LASHZJ-0151", reason: "成语直接用于党外选后叙事，删除。" },
  { id: "LASHZJ-0154", reason: "古语短语在此处重复出现，且原文直接进入竞选人物评价，删除。" },
  { id: "LASHZJ-0155", reason: "古语短语在此处重复出现，且原文直接进入竞选人物评价，删除。" },
  { id: "LASHZJ-0161", reason: "催促短句直接依附雷震家属书写与政治人物记忆场景，删除。" },
];

function getProofreadRemovedRows(rows) {
  const byId = new Map(rows.map((row) => [row.id, row]));
  return proofreadRemoved.map((item) => {
    const row = byId.get(item.id);
    if (!row) throw new Error(`Missing proofread removal id: ${item.id}`);
    return {
      ...item,
      source_file: row.source_file,
      line_range: `${row.line_start}-${row.line_end}`,
      quote_text: row.quote_text,
      category: row.category,
      source_or_origin: row.source_or_origin,
    };
  });
}

function validateEntries(rows, sourceFiles) {
  const byName = new Map(sourceFiles.map((file) => [file.name, file]));
  const ids = new Set();
  const errors = [];

  for (const row of rows) {
    if (ids.has(row.id)) errors.push(`${row.id}: duplicate id`);
    ids.add(row.id);

    const source = byName.get(row.source_file);
    if (!source) {
      errors.push(`${row.id}: missing source file ${row.source_file}`);
      continue;
    }

    const lines = source.text.replace(/\r/g, "").split("\n");
    if (row.line_start < 1 || row.line_end > lines.length || row.line_start > row.line_end) {
      errors.push(`${row.id}: invalid line range`);
      continue;
    }

    const sourceSlice = lines.slice(row.line_start - 1, row.line_end).join("\n");
    if (!normalizeForMatch(sourceSlice).includes(normalizeForMatch(row.quote_text))) {
      errors.push(`${row.id}: quote not found in source range`);
    }
  }

  if (errors.length) {
    throw new Error(`Validation failed:\n${errors.join("\n")}`);
  }
}

function collectCandidates(sourceFiles) {
  return sourceFiles.flatMap((file) =>
    file.text
      .replace(/\r/g, "")
      .split("\n")
      .map((line, index) => ({
        file: file.name,
        line: index + 1,
        text: line.trim(),
        hasQuote: quotePattern.test(line),
        hasAttribution: attributionPattern.test(line),
        hasPoliticalRisk: politicalPattern.test(line),
      }))
      .filter((item) => item.text && (item.hasQuote || item.hasAttribution)),
  );
}

function writeCsv(rows) {
  const columns = [
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
  const text = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
  fs.writeFileSync(outputCsv, `${text}\n`, "utf8");
}

function writeTxt(rows) {
  const text = [
    `《${bookName}》诗文格言歌谣引用`,
    `生成日期：${generatedDate}`,
    `来源：${sourceBase}`,
    `条目数：${rows.length}`,
    "",
    ...rows.map((row) =>
      [
        `${row.id}｜${row.category}｜${row.source_or_origin}`,
        `篇章：${row.chapter}`,
        `位置：${row.source_file}:${row.line_start}-${row.line_end}`,
        `原文：${row.quote_text}`,
        `摘要：${row.summary}`,
        row.notes ? `备注：${row.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    ),
  ].join("\n\n");
  fs.writeFileSync(outputTxt, `${text}\n`, "utf8");
}

function writeAudit(rows, sourceFiles) {
  const byName = new Map(sourceFiles.map((file) => [file.name, file]));
  const header = ["id", "source_file", "line_start", "line_end", "quote_text", "source_line"];
  const lines = [header.join("\t")];

  for (const row of rows) {
    const source = byName.get(row.source_file);
    const sourceLines = source.text.replace(/\r/g, "").split("\n");
    const sourceSlice = sourceLines.slice(row.line_start - 1, row.line_end).join(" / ").trim();
    lines.push(
      [
        row.id,
        row.source_file,
        row.line_start,
        row.line_end,
        row.quote_text,
        sourceSlice,
      ]
        .map(tsvEscape)
        .join("\t"),
    );
  }

  fs.writeFileSync(auditPath, `${lines.join("\n")}\n`, "utf8");
}

function writeCandidateArtifacts(candidates, rows) {
  const selectedLines = new Set(
    rows.flatMap((row) => {
      const keys = [];
      for (let line = row.line_start; line <= row.line_end; line += 1) {
        keys.push(`${row.source_file}:${line}`);
      }
      return keys;
    }),
  );

  fs.writeFileSync(candidatesPath, `${JSON.stringify(candidates, null, 2)}\n`, "utf8");

  const reviewHeader = ["source_file", "line", "risk", "selected", "text"];
  const reviewLines = [
    reviewHeader.join("\t"),
    ...candidates.map((item) =>
      [
        item.file,
        item.line,
        item.hasPoliticalRisk ? "risk" : "",
        selectedLines.has(`${item.file}:${item.line}`) ? "selected" : "",
        item.text,
      ]
        .map(tsvEscape)
        .join("\t"),
    ),
  ];
  fs.writeFileSync(reviewPath, `${reviewLines.join("\n")}\n`, "utf8");

  const attributed = candidates.filter((item) => item.hasAttribution);
  const attributedLines = [
    ["source_file", "line", "risk", "text"].join("\t"),
    ...attributed.map((item) =>
      [item.file, item.line, item.hasPoliticalRisk ? "risk" : "", item.text]
        .map(tsvEscape)
        .join("\t"),
    ),
  ];
  fs.writeFileSync(attributedPath, `${attributedLines.join("\n")}\n`, "utf8");
}

function writeProofreadFiles(removedRows, outputRows) {
  const report = [
    `书名：${bookName}`,
    `生成日期：${generatedDate}`,
    `首轮条目数：${entries.length}`,
    `校对删除：${removedRows.length}`,
    `校对后条目数：${outputRows.length}`,
    "",
    "删除条目：",
    ...removedRows.map(
      (row) => `- ${row.id}｜${row.source_file}:${row.line_range}｜${row.quote_text}｜${row.reason}`,
    ),
  ].join("\n");
  fs.writeFileSync(proofreadReportPath, `${report}\n`, "utf8");

  const headers = [
    "id",
    "source_file",
    "line_range",
    "quote_text",
    "category",
    "source_or_origin",
    "reason",
  ];
  const audit = [
    headers.join("\t"),
    ...removedRows.map((row) => headers.map((header) => tsvEscape(row[header])).join("\t")),
  ].join("\n");
  fs.writeFileSync(proofreadAuditPath, `${audit}\n`, "utf8");
}

function writeReport(firstRoundRows, outputRows, candidates, removedRows) {
  const selectedRiskRows = outputRows.filter((row) =>
    [
      row.quote_text,
      row.category,
      row.source_or_origin,
      row.summary,
      row.notes,
    ].some((value) => politicalPattern.test(String(value ?? ""))),
  );
  const byCategory = new Map();
  for (const row of outputRows) byCategory.set(row.category, (byCategory.get(row.category) ?? 0) + 1);

  const report = [
    `书名：${bookName}`,
    `生成日期：${generatedDate}`,
    `来源目录：${sourceBase}`,
    `首轮条目数：${firstRoundRows.length}`,
    `校对删除：${removedRows.length}`,
    `校对后条目数：${outputRows.length}`,
    `候选行数：${candidates.length}`,
    `候选风险行数：${candidates.filter((item) => item.hasPoliticalRisk).length}`,
    `核心字段风险命中：${selectedRiskRows.length}`,
    "",
    "分类统计：",
    ...[...byCategory.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
      .map(([category, count]) => `- ${category}: ${count}`),
    "",
    "说明：本轮偏保守处理公共书信语境，只保留可独立检索的古语、成语、诗文句、写作判断和人生短语。",
    "",
    `CSV：${path.relative(root, outputCsv)}`,
    `TXT：${path.relative(root, outputTxt)}`,
    `审计：${path.relative(root, auditPath)}`,
    `校对报告：${path.relative(root, proofreadReportPath)}`,
    `校对审计：${path.relative(root, proofreadAuditPath)}`,
    `候选：${path.relative(root, candidatesPath)}`,
  ].join("\n");

  fs.writeFileSync(reportPath, `${report}\n`, "utf8");
}

function main() {
  ensureDir(exportsDir);
  ensureDir(analysisDir);
  const sourceFiles = getSourceFiles();
  const candidates = collectCandidates(sourceFiles);
  const removedRows = getProofreadRemovedRows(entries);
  const removedIds = new Set(removedRows.map((row) => row.id));
  const outputRows = entries.filter((row) => !removedIds.has(row.id));

  validateEntries(entries, sourceFiles);
  writeCsv(outputRows);
  writeTxt(outputRows);
  writeAudit(outputRows, sourceFiles);
  writeCandidateArtifacts(candidates, outputRows);
  writeProofreadFiles(removedRows, outputRows);
  writeReport(entries, outputRows, candidates, removedRows);

  console.log(`Wrote ${outputRows.length} rows to ${path.relative(root, outputCsv)}`);
  console.log(`Proofread removed ${removedRows.length} rows`);
  console.log(`Wrote report to ${path.relative(root, reportPath)}`);
}

main();
