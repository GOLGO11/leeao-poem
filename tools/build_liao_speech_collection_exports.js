const fs = require("fs");
const path = require("path");

const book = "李敖演讲集";
const idPrefix = "LAYJJ";
const generatedDate = "2026-06-24";
const sourceDir = path.join("《大李敖全集6.0》分章节", "010.节目演讲类", "011.李敖演讲集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const selectedJson = path.join("analysis", "liao_speech_collection_selected_rows.json");
const auditTsv = path.join("analysis", "liao_speech_collection_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_speech_collection_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_speech_collection_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_speech_collection_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => /^\d{3}\..+\.txt$/.test(name))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceCache = new Map();
for (const file of files) {
  const text = sourceDecoder.decode(fs.readFileSync(path.join(sourceDir, file)));
  sourceCache.set(file, { text, lines: text.split(/\r?\n/) });
}

function sourceFile(prefix) {
  const found = files.find((file) => file.startsWith(prefix));
  if (!found) throw new Error(`Source file not found for prefix: ${prefix}`);
  return found;
}

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[“”‘’"'【】]/g, "")
    .replace(/\s+/g, "");
}

function normalizeForSourceCheck(text) {
  return normalizeText(text).replace(/（[^）]*）/g, "");
}

function q(filePrefix, lineStart, lineEnd, quoteText, category, attributedTo, summary, extraNotes = "") {
  const file = sourceFile(filePrefix);
  const notes = [
    "首轮保守收入：本书演讲、记者会、政见与政论问答交错；只收句子本体可独立成立的诗文、格言、谚语、文论、歌词和外文名句，党派口号与政治判断不收。",
    extraNotes,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    id: "",
    book,
    chapter: file.replace(/^\d+\./, "").replace(/\.txt$/, ""),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: attributedTo,
    summary,
    notes,
  };
}

const proofreadAddNote =
  "校对轮补入：回扫候选池后确认句子本体属于非政治诗文、格言、俗语、歌诀或语言文字例句。";
const proofreadBeforeRows = 78;
const proofreadRemovedRows = [
  [
    "LAYJJ-065",
    "马上得天下，你不能马上治天下",
    "政事格言，核心是治国与权力治理；校对轮按政治语录边界删除。",
  ],
  [
    "LAYJJ-071",
    "向阳花木",
    "源文把完整诗句拆成词库短片段，单独入库过碎；校对轮删除。",
  ],
  [
    "LAYJJ-072",
    "早逢春",
    "源文把完整诗句拆成词库短片段，单独入库过碎；校对轮删除。",
  ],
  [
    "LAYJJ-075",
    "货恶其弃于地也，不必藏于己；力恶其不出于身也，不必为已。",
    "虽为《礼记》古文，但本段用于宪法、马克思主义与分配制度论述；校对轮按政治思想语境删除。",
  ],
];
const proofreadChangedRows = [];

const rawRows = [
  q(
    "001.",
    19,
    19,
    "为政不在多言，顾力行何如耳。",
    "古典格言",
    "汉代故事",
    "李敖讲实践诚实荣誉时引古人答语。"
  ),

  q("003.", 37, 37, "暮投石壕村，有吏夜捉人", "唐诗", "杜甫《石壕吏》", "李敖讲抓丁时引用杜甫诗。"),
  q("003.", 37, 37, "老翁逾墙走，老妇出看门", "唐诗", "杜甫《石壕吏》", "李敖继续引《石壕吏》并说明字句。"),
  q("003.", 37, 37, "出入无完裙", "唐诗", "杜甫《石壕吏》", "李敖引《石壕吏》说明无衣之苦。"),
  q("003.", 39, 39, "云南望乡鬼", "唐诗", "白居易《新丰折臂翁》", "李敖讲避兵故事时引用白居易诗句。"),
  q("003.", 93, 93, "子不语怪力乱神", "古典文句", "《论语》", "李敖批评公开谈迷信时引孔子语。"),
  q("003.", 161, 161, "穷则独善其身，达则兼济天下。", "儒家格言", "《孟子》", "李敖回答听众时引用儒家处世语。"),

  q("004.", 21, 21, "在齐太史简，在晋董狐笔", "古典诗句", "文天祥《正气歌》", "李敖讲董狐笔时引用《正气歌》。"),
  q("004.", 23, 23, "立孤与死孰难？", "古典文句", "《史记》赵氏孤儿故事", "李敖讲赵氏孤儿时引公孙杵臼语。"),
  q("004.", 23, 23, "死易，立孤难耳！", "古典文句", "《史记》赵氏孤儿故事", "李敖讲赵氏孤儿时引程婴答语。"),
  q(
    "004.",
    23,
    23,
    "赵氏先君遇子厚，子强为其难者，吾为其易者，请先死。",
    "古典文句",
    "《史记》赵氏孤儿故事",
    "李敖讲程婴、公孙杵臼分任难易时引用。"
  ),

  q(
    "005.",
    35,
    35,
    "虽有镃基，不如待时；虽有智慧，不如乘势。",
    "儒家格言",
    "《孟子》",
    "李敖借《孟子》说明智慧与时势的关系。",
    "源文作“镃基”。"
  ),

  q("006.", 211, 211, "化祸而为福，转败而为功", "史传格言", "《史记·管晏列传》", "李敖谈机会主义时引管子本领。"),
  q("006.", 215, 215, "樽前作剧莫相笑，我死诸君思我狂", "宋诗", "陆游诗句", "李敖演讲结尾引用陆游诗。"),
  q("006.", 219, 219, "故人有子尚饘粥，抱君等身大著作", "清诗", "龚自珍诗句", "李敖展示《李敖大全集》时引龚自珍诗。"),

  q(
    "010.",
    19,
    19,
    "一轮红日当空高，千家白旗随风飘。搢绅耆老相招邀，夹跪道旁俯折腰。",
    "近代诗句",
    "黄遵宪《台湾行》",
    "李敖讲甲午后台湾情形时引用黄遵宪诗。"
  ),

  q("012.", 43, 43, "死生有命，富贵在天", "儒家格言", "孔孟思想", "李敖谈宿命、造命、正命时引用。"),
  q("012.", 43, 43, "舜何人也，予何人也，有为者亦若是", "儒家格言", "《孟子》", "李敖说明儒家也重视努力时引用。"),
  q("012.", 43, 43, "君子不立于岩墙之下", "儒家格言", "《孟子》", "李敖谈防患避祸时引用。"),

  q("013.", 59, 59, "不是花园在你家里，是你家在花园里。", "李敖广告语", "李敖为花园新城所写广告词", "李敖用作一流中文表达的例子。"),
  q(
    "013.",
    59,
    59,
    "五十年来和五百年内，中国人写白话文的前三名是——李敖，李敖，李敖。",
    "李敖格言",
    "李敖自评",
    "李敖说明自己广告式自评的语言效果。"
  ),
  q("013.", 61, 61, "春风又绿江南岸，明月何时照我还", "宋诗", "王安石《泊船瓜洲》", "李敖讲中文动词化与炼字时引用。"),
  q("013.", 61, 61, "莫等闲、白了少年头，空悲切", "宋词", "岳飞《满江红》", "李敖说明形容词作动词时引用。"),
  q("013.", 61, 61, "红了樱桃，绿了芭蕉", "宋词", "蒋捷词句", "李敖说明中文活用时引用。"),
  q("013.", 61, 61, "临溪而渔，溪深而鱼肥，酿泉为酒，泉香而酒洌", "古文", "欧阳修《醉翁亭记》", "李敖讲欧阳修炼句时引用今本。"),
  q("013.", 61, 61, "酒洌而泉香", "古文异文", "欧阳修《醉翁亭记》旧刻异文", "李敖讲欧阳修改句时引用旧文。"),
  q("013.", 65, 65, "不看你的眼，不看你的眉，看了心里都是你，忘了我是谁。", "李敖歌词", "李敖《忘了我是谁》", "李敖谈自作歌词的简练表达。"),

  q(
    "018.",
    23,
    45,
    "不爱那么多，只爱一点点。别人的爱情像海深，我的爱情浅。不爱那么多，只爱一点点。别人的爱情像天长，我的爱情短。不爱那么多，只爱一点点。别人眉来又眼去，我只偷看你一眼。",
    "李敖歌词",
    "李敖《只爱一点点》",
    "李敖在文化大学演讲中朗读自作歌词。"
  ),

  q("022.", 15, 15, "虽千万人吾往矣！", "儒家格言", "《孟子》", "李敖回忆改革丧礼时引用勇气之语。"),
  q("022.", 17, 17, "横眉冷对千夫指", "现代诗句", "鲁迅诗句", "李敖谈突破观念时引用鲁迅诗。"),

  q(
    "024.",
    63,
    63,
    "知之为知之，不知为不知，是知也",
    "儒家文句",
    "《论语》",
    "李敖回答学生时引用孔子语并重新解释求知态度。",
    proofreadAddNote
  ),
  q(
    "025.",
    13,
    13,
    "潘驴邓小贤",
    "小说俗语",
    "《水浒传》王婆语",
    "李敖讲民间语言和古典小说口语时引用。",
    `${proofreadAddNote} 源文作“贤”，按源文保留。`
  ),

  q(
    "026.",
    5,
    5,
    "他们看不了多远，也看不了多深，可是谁能阻止对沧海凝神。",
    "外国诗句",
    "罗伯特·弗罗斯特《不远也不深》",
    "李敖讲从陆地看海洋时转述弗罗斯特诗意。"
  ),
  q("026.", 7, 7, "不出户，知天下", "道家文句", "《老子》", "李敖讲思想境界时引用。"),
  q("026.", 7, 7, "至小无内", "道家文句", "庄子思想", "李敖讲大小极限时引用古人说法。"),
  q("026.", 7, 7, "至大无外", "道家文句", "庄子思想", "李敖讲大小极限时引用古人说法。"),
  q("026.", 11, 11, "增一分太肥，减一分太瘦", "古典文句", "宋玉《登徒子好色赋》", "李敖讲好中文要恰到好处时引用。"),
  q("026.", 11, 11, "对好的文学家而言，没有同义字。", "外国格言", "福楼拜文论", "李敖讲精确用字时转述福楼拜。"),
  q("026.", 11, 11, "Et tu Brute？", "戏剧文句", "莎士比亚《凯撒》", "李敖讲凯撒临死语的翻译问题。"),
  q("026.", 11, 11, "你也参加？布鲁塔斯。", "翻译文句", "梁实秋译莎士比亚", "李敖举梁实秋译文作为反例。"),
  q("026.", 11, 11, "还有你！布鲁塔斯。", "李敖译句", "李敖改译莎士比亚", "李敖提出更贴近情境的译句。"),
  q("026.", 83, 83, "能胜人之口，不能服人之心。", "古典格言", "公孙龙子", "李敖回答误会问题时引用。"),
  q("026.", 91, 91, "你可以像你所希望那样快乐那样快乐。", "外国格言", "林肯语", "李敖谈控制负面情绪时引用。"),

  q("027.", 5, 5, "著作等身", "成语典故", "古典成语", "李敖说明自己著作数量时引用。"),
  q(
    "027.",
    17,
    17,
    "吾爱孟夫子，风流天下闻。红颜弃轩冕，白首卧松云。",
    "唐诗",
    "李白《赠孟浩然》",
    "李敖讲词义变化时引用李白诗。"
  ),

  q(
    "029.",
    29,
    29,
    "悠悠我心忧，苍天曷有极。哲人日已远，典刑在夙昔。",
    "古典诗句",
    "文天祥《正气歌》",
    "李敖讲成功与失败时引用《正气歌》。",
    `${proofreadAddNote} 源文括注提示“忧”应作“悲”，本表按源文主文保留。`
  ),
  q("029.", 29, 29, "求仁得仁", "儒家格言", "《论语》", "李敖谈文天祥取舍时引用孔子语。", proofreadAddNote),
  q("029.", 29, 29, "仁者不忧", "儒家格言", "《论语》", "李敖谈文天祥取舍时引用孔子语。", proofreadAddNote),

  q("037.", 35, 35, "自胜者强", "道家格言", "《老子》", "李敖对少年观护所听众谈克服自己时引用。"),
  q("037.", 81, 81, "盗亦有道", "成语典故", "《庄子》", "李敖讲小说里强盗哲学时引用成语。"),
  q(
    "037.",
    99,
    99,
    "高惠文景武昭宣，元成哀平孺子新，光武明章和殇安，顺冲质桓灵献",
    "历史歌诀",
    "李敖记汉代帝王歌诀",
    "李敖讲记忆方法时朗读的押韵歌诀。",
    proofreadAddNote
  ),
  q("037.", 103, 103, "我的儿子念书一遍就会了！", "古人语录", "王安石故事", "李敖讲天才与后天努力时引用王安石语。"),
  q(
    "037.",
    103,
    103,
    "你家的儿子念一遍就会，谁家的儿子念两遍呢？我的儿子也是神童，每个人都是神童！",
    "古人语录",
    "刘贡父故事",
    "李敖讲天才与后天努力时引用刘贡父答语。"
  ),

  q("038.", 31, 31, "历史上从来没有给记者或评论者立铜像的！", "外国格言", "西贝流士父亲语", "李敖劝新闻系学生时引用。"),
  q("038.", 33, 33, "公等彔彔，所谓因人成事者也", "史传文句", "《史记·平原君虞卿列传》", "李敖讲毛遂自荐故事时引用。"),
  q("038.", 67, 67, "渐行渐远渐无书", "李敖戏拟文句", "李敖化用古典词句", "李敖笑谈读书方法时戏拟成句。"),
  q(
    "038.",
    73,
    73,
    "道生一，一生二，二生三，三生万物。万物负阴而抱阳，冲气以为和",
    "道家文句",
    "《老子》",
    "李敖讲字义辨析时引用《老子》。"
  ),
  q(
    "038.",
    73,
    73,
    "秦王方环柱走，卒惶急，不知所为，左右乃曰：王负剑。负剑，遂拔以击荆轲，断其左股。",
    "史传文句",
    "《史记·刺客列传》",
    "李敖说明“负”字古义时引用。"
  ),
  q("038.", 73, 73, "伤人乎不问马", "儒家文句", "《论语》", "李敖辨析“不”字时引用。"),
  q("038.", 75, 75, "莫须有", "宋代俗语", "宋史典故", "李敖辨析宋人俗语时引用。"),
  q(
    "038.",
    75,
    75,
    "唧唧復唧唧，木兰当户织，不闻机杼声，惟闻女叹息",
    "古乐府",
    "《木兰词》",
    "李敖说明“唧唧”是叹息声时引用。"
  ),
  q("038.", 75, 75, "我闻琵琶已叹息，又闻此语重唧唧", "唐诗", "白居易《琵琶行》", "李敖说明“唧唧”字义时引用。"),
  q("038.", 81, 81, "人书俱老", "书论文句", "孙过庭《书谱》", "李敖谈自己与江湖一起老时引用。"),

  q(
    "041.",
    113,
    113,
    "俏也不争春，只把春来报，待到山花烂漫时，她在丛中笑",
    "词句",
    "毛泽东《卜算子·咏梅》",
    "李敖讲旁观者与参与者境界时引用词句。"
  ),
  q("041.", 113, 113, "有我之境，有无我之境", "词论文句", "王国维《人间词话》", "李敖讲境界问题时引用。"),
  q("041.", 191, 191, "今夜扁舟来诀汝", "宋诗", "王安石悼女诗", "李敖讲怀乡与别离时引用王安石诗。"),
  q("041.", 191, 191, "死生从此各东西", "宋诗", "王安石悼女诗", "李敖讲怀乡与别离时引用王安石诗。"),
  q(
    "041.",
    191,
    191,
    "床前明月光，疑时地上霜。举头望明月，低头思故乡",
    "唐诗",
    "李白《静夜思》",
    "李敖讲怀乡主题时引用。",
    "源文作“疑时地上霜”。"
  ),

  q(
    "042.",
    35,
    35,
    "室中更无人，唯有乳下孙。有孙母未去，出入无完裙",
    "唐诗",
    "杜甫《石壕吏》",
    "李敖在清华演讲中再次引用《石壕吏》。"
  ),
  q("042.", 127, 127, "北大老，师大穷，只有清华可通融。", "校园谚语", "北京校园谚语", "李敖回答清华学生时引用旧日谚语。"),
  q("042.", 139, 139, "鸣鼓而攻之", "儒家文句", "《论语》", "李敖谈张扬风格时引用孔子典故。"),

  q(
    "043.",
    39,
    39,
    "待月西厢下，迎风户半开。隔墙花影动，疑是玉人来。",
    "元曲文句",
    "《西厢记》",
    "李敖讲中文意境时引用《西厢记》。"
  ),

  q(
    "048.",
    27,
    27,
    "吾尝终日不食，终夜不寝，以思，无益，不如学也。",
    "儒家文句",
    "《论语》",
    "李敖讲学与思时引用孔子语。"
  ),
  q("048.", 61, 61, "束书不观", "古典文句", "明儒语", "李敖谈面对出版洪流的读书选择时引用。", proofreadAddNote),
  q(
    "048.",
    27,
    27,
    "甫昔少年日，早充观国宾。读书破万卷，下笔如有神。",
    "唐诗",
    "杜甫诗句",
    "李敖讲古人读书规模时引用杜甫诗。"
  ),
  q("048.", 161, 161, "近水楼台先得月", "古典诗句", "苏麟诗句", "李敖讲输入法词库时举例。"),
  q("048.", 163, 163, "二句三年得，一吟双泪流", "唐诗", "贾岛诗句", "李敖讲炼句与电脑词库时引用。"),
  q("048.", 163, 163, "鸟宿池边树，僧敲月下门", "唐诗", "贾岛诗句", "李敖讲推敲典故时引用。"),
  q("048.", 163, 163, "僧推月下门", "唐诗异文", "贾岛诗句异文", "李敖讲推敲典故时提出比较。"),
  q("048.", 189, 189, "Honesty is the Best Policy", "外国格言", "英语格言", "李敖讲英文词义变迁时引用。"),

  q(
    "050.",
    15,
    15,
    "五十而知天命；六十而耳顺；七十而从心所欲，不踰矩。",
    "儒家文句",
    "《论语》",
    "李敖在汕头大学演讲开头引用孔子自述。"
  ),
  q("053.", 35, 35, "不是猛龙不过江。", "俗语", "现代俗语", "李敖在香港书展演讲开头纠正主持人说法。", proofreadAddNote),
];

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

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

const rows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));
const proofreadAddedRows = rows.filter((row) => row.notes.includes("校对轮补入"));

const missingSourceRows = [];
for (const row of rows) {
  const cached = sourceCache.get(row.source_file);
  const sourceText = cached.lines.slice(row.line_start - 1, row.line_end).join("\n");
  if (
    !sourceText.includes(row.quote_text) &&
    !normalizeForSourceCheck(sourceText).includes(normalizeForSourceCheck(row.quote_text))
  ) {
    missingSourceRows.push(row);
  }
}

const quoteBuckets = new Map();
for (const row of rows) {
  const key = normalizeText(row.quote_text);
  quoteBuckets.set(key, [...(quoteBuckets.get(key) || []), row.id]);
}
const duplicateQuoteTexts = [...quoteBuckets.values()].filter((ids) => ids.length > 1);

const politicalPattern =
  /(政论|政治语录|政治口号|竞选|政见|总统候选人|台独口号|党派口号|反攻复国|自由中国|民主进步党)/;
const politicalFlaggedRows = rows.filter(
  (row) => politicalPattern.test(row.category) || politicalPattern.test(row.quote_text),
);

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(selectedJson), { recursive: true });

fs.writeFileSync(
  outCsv,
  `${columns.join(",")}\n${rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")).join("\n")}\n`,
  "utf8",
);

fs.writeFileSync(
  outTxt,
  rows
    .map((row) =>
      [
        `【${row.id}】${row.quote_text}`,
        `书名：${row.book}`,
        `章节：${row.chapter}`,
        `出处：${row.source_file}:${row.line_start}-${row.line_end}`,
        `类别：${row.category}`,
        `来源：${row.source_or_origin}`,
        `说明：${row.summary}`,
        `备注：${row.notes}`,
      ].join("\n"),
    )
    .join("\n\n"),
  "utf8",
);

fs.writeFileSync(selectedJson, JSON.stringify(rows, null, 2), "utf8");
fs.writeFileSync(
  auditTsv,
  [
    ["id", "source_file", "line_start", "line_end", "category", "source_or_origin", "quote_text", "summary"].join("\t"),
    ...rows.map((row) =>
      [
        row.id,
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.source_or_origin,
        row.quote_text.replace(/\s+/g, " "),
        row.summary,
      ].join("\t"),
    ),
  ].join("\n"),
  "utf8",
);

fs.writeFileSync(
  proofreadAuditTsv,
  [
    ["status", "id", "source_file", "line_start", "line_end", "category", "source_or_origin", "quote_text", "summary"].join("\t"),
    ...proofreadAddedRows.map((row) =>
      [
        "added",
        row.id,
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.source_or_origin,
        row.quote_text.replace(/\s+/g, " "),
        row.summary,
      ].join("\t"),
    ),
    ...proofreadRemovedRows.map(([id, quoteText, reason]) =>
      ["removed", id, "", "", "", "", "", quoteText.replace(/\s+/g, " "), reason].join("\t"),
    ),
    ...proofreadChangedRows.map(([id, quoteText, reason]) =>
      ["changed", id, "", "", "", "", "", quoteText.replace(/\s+/g, " "), reason].join("\t"),
    ),
  ].join("\n"),
  "utf8",
);

fs.writeFileSync(
  reportTxt,
  [
    `${book} 首轮导出报告`,
    `生成日期：${generatedDate}`,
    `源目录：${sourceDir}`,
    `源文件数：${files.length}`,
    `入库条数：${rows.length}`,
    `缺失原文校验：${missingSourceRows.length}`,
    `重复 quote_text：${duplicateQuoteTexts.length}`,
    `政治语录标记：${politicalFlaggedRows.length}`,
    "",
    "首轮取舍：",
    "- 收：古典诗文、外文文学格言、文论用语、谚语、成语、李敖自引歌词和非政治语言格言。",
    "- 不收：候选人政见、党派攻防、统独口号、宪政判断、时事评论和仅作书名/标题的人名题名。",
    "- 同句多次出现时，优先保留原文更完整或解释更清楚的一处；少数源文误字按源文保留，校对轮再统一判断。",
    "",
    "辅助文件：",
    `- ${selectedJson}`,
    `- ${auditTsv}`,
    "",
    "需要复核的行：",
    missingSourceRows.length
      ? missingSourceRows.map((row) => `- ${row.id} ${row.source_file}:${row.line_start}-${row.line_end}`).join("\n")
      : "- 无",
  ].join("\n"),
  "utf8",
);

fs.writeFileSync(
  proofreadReportTxt,
  [
    `${book} 校对轮报告`,
    `生成日期：${generatedDate}`,
    `校对前条数：${proofreadBeforeRows}`,
    `删除条数：${proofreadRemovedRows.length}`,
    `补入条数：${proofreadAddedRows.length}`,
    `改写条数：${proofreadChangedRows.length}`,
    `校对后条数：${rows.length}`,
    `缺失原文校验：${missingSourceRows.length}`,
    `重复 quote_text：${duplicateQuoteTexts.length}`,
    `政治语录标记：${politicalFlaggedRows.length}`,
    "",
    "删除：",
    ...proofreadRemovedRows.map(([id, quoteText, reason]) => `- ${id}｜${quoteText}｜${reason}`),
    "",
    "补入：",
    ...proofreadAddedRows.map((row) => `- ${row.id}｜${row.source_file}:${row.line_start}-${row.line_end}｜${row.quote_text}`),
    "",
    "校对说明：",
    "- 保留古典诗句、文学文论、俗语、歌诀、李敖自引歌词和外文文学格言。",
    "- 删除政事治理、政治思想语境过强或被源文切碎到失去独立价值的条目。",
    "- 仍保留诗句本体成立、但出现于历史叙述中的文学引用；校对轮未发现新增政治语录。",
  ].join("\n"),
  "utf8",
);

console.log(
  JSON.stringify(
    {
      book,
      sourceDir,
      files: files.length,
      rows: rows.length,
      outCsv,
      outTxt,
      selectedJson,
      auditTsv,
      reportTxt,
      proofreadAuditTsv,
      proofreadReportTxt,
      proofreadBeforeRows,
      proofreadAddedRows: proofreadAddedRows.length,
      proofreadRemovedRows: proofreadRemovedRows.length,
      missingSourceRows: missingSourceRows.length,
      duplicateQuoteTexts: duplicateQuoteTexts.length,
      politicalFlaggedRows: politicalFlaggedRows.length,
    },
    null,
    2,
  ),
);

if (missingSourceRows.length > 0 || duplicateQuoteTexts.length > 0 || politicalFlaggedRows.length > 0) {
  process.exitCode = 1;
}
