const fs = require("fs");
const path = require("path");

const book = "冷眼看台湾";
const idPrefix = "LALYKTW";
const generatedDate = "2026-06-28";

const corpusDir = fs.readdirSync(process.cwd()).find((name) => name.includes("6.0"));
if (!corpusDir) throw new Error("Corpus directory not found");
const sectionDir = fs.readdirSync(corpusDir).find((name) => name.startsWith("014."));
if (!sectionDir) throw new Error("Section directory 014 not found");
const sourceBookDir = fs.readdirSync(path.join(corpusDir, sectionDir)).find((name) => name.startsWith("001."));
if (!sourceBookDir) throw new Error("Source book directory 001 not found");
const sourceDir = path.join(corpusDir, sectionDir, sourceBookDir);

const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_cold_eye_taiwan_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_cold_eye_taiwan_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_cold_eye_taiwan_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_cold_eye_taiwan_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_cold_eye_taiwan_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_cold_eye_taiwan_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceCache = new Map();
for (const file of files) {
  const text = sourceDecoder.decode(fs.readFileSync(path.join(sourceDir, file)));
  sourceCache.set(file, { text, lines: text.split(/\r?\n/) });
}

function sourceFile(selector) {
  if (selector === "preface") {
    const found = files.find((file) => !/^\d+\./.test(file));
    if (!found) throw new Error("Preface source file not found");
    return found;
  }
  const found = files.find((file) => file.startsWith(selector));
  if (!found) throw new Error(`Source file not found for selector: ${selector}`);
  return found;
}

function chapterName(file) {
  return file.replace(/^\d+\./, "").replace(/\.txt$/, "");
}

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[“”‘’「」『』]/g, "")
    .replace(/\s+/g, "");
}

function q(selector, lineStart, quoteText, category, sourceOrOrigin, summary, lineEnd = lineStart, extraNotes = "") {
  const file = sourceFile(selector);
  return {
    id: "",
    book,
    chapter: chapterName(file),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrOrigin,
    summary,
    notes: [
      "首轮从严筛选：《冷眼看台湾》为高政治密度书，只保留可脱离具体政党、选举、诉讼攻防而独立检索的诗文、古文、宗教寓言、文学例句和普通格言；现代政治口号、党派攻防、人名攻防、法律文书和意识形态语录不收。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q("preface", 3, "归骨于田横之岛", "历史题字", "傅斯年题字", "李敖引傅斯年题字，借田横典故写归宿与孤高。"),
  q("preface", 5, "小和尚念经——有口无心", "歇后语", "中文歇后语", "李敖摘用歇后语，写表面周旋而内心不系。"),
  q("preface", 7, "却恐他乡胜故乡", "古典诗句", "古人诗句", "李敖引古人诗境，说明乡愁观念也可被提升。"),
  q("preface", 7, "此心安处即为乡", "古典诗句", "苏轼相关诗句", "李敖引古人诗境，说明安顿身心高于拘泥故乡。"),
  q("preface", 7, "埋骨何须桑梓地，人间何处不青山", "古典诗句", "中文诗句", "李敖引古诗句，写不必拘泥桑梓的旷达。"),
  q("preface", 7, "江湖寥落尔安归", "古典诗句", "中文诗句", "李敖引诗句，写大陆与台湾之外的寥落心境。"),

  q("001.", 9, "贤者避世，其次避地", "古典格言", "古人语", "李敖引古人语，说明乱世中避世与避地的层次。"),

  q("005.", 95, "天行有常，不为尧存，不为桀亡。", "古典格言", "荀子相关成句", "李敖引古话，强调常道不因贤暴而改。"),
  q("005.", 95, "山平水远苍茫外，地辟天开指顾中", "古典诗句", "中文诗句", "李敖引诗性成句，写眼界辽阔与气象开张。"),

  q("006.", 3, "不畏浮云遮望眼，自缘身在最高层。", "古典诗句", "王安石诗句", "李敖引诗句，说明从高层面看待道德实践。"),
  q("006.", 9, "藏匿不报，罪及三族", "古文成句", "楚汉季布相关典故", "李敖引古代法禁成句，铺陈侠义收容的传统背景。"),
  q("006.", 9, "望门投止", "成语典故", "张俭典故", "李敖摘用张俭典故，写走投无路而求庇护。"),
  q("006.", 9, "竟为收容", "古文成句", "岑晊相关典故", "李敖摘用古文成句，写冒险收容亡命者的义气。"),
  q("006.", 9, "好将轻侠藏亡命", "古典诗句", "中文诗句", "李敖引诗句，写侠义收容亡命之人。"),
  q(
    "006.",
    21,
    "You shall see the difference now that we are back again!（如今我们回来了，你们看便不同了！）",
    "外国诗句",
    "荷马诗句，经纽曼摘抄",
    "李敖转引纽曼摘抄的荷马诗句，写精神归来后的不同。",
  ),

  q("008.", 77, "内行看门道，外行看热闹", "俗语格言", "中文俗话", "李敖引俗话，区分看表象与看关键。"),

  q("010.", 9, "老僧为百万生灵，何惜如来一戒！", "佛教轶事语录", "破山和尚相关故事", "李敖引破山和尚语，写为救生民而破戒的大悲精神。"),
  q("010.", 11, "我欲和尚，斯和尚至矣", "仿古格言", "李敖化用《论语》句式", "李敖仿古成句，强调精神资格高于形式承认。"),
  q("010.", 15, "一个和尚挑水吃，两个和尚抬水吃，三个和尚没水吃", "谚语", "中国谚语", "李敖引谚语，写人数增加反致推诿。"),
  q("010.", 51, "委蜕大难求净土，伤心最是近高楼。", "古典诗句", "陈宝琛诗", "李敖引陈宝琛诗，反写牢狱与净土、高楼的意味。"),

  q("011.", 25, "沙门摄摩腾、竺法兰东还", "古籍引文", "《隋书》经籍志", "李敖引史书文字，说明佛教初传中国。"),
  q("011.", 25, "西域沙门，赍佛经而至者甚众", "古籍引文", "《隋书》经籍志", "李敖引史书文字，说明西域僧人携经入华。"),
  q("011.", 25, "魏黄初中，中国人始依佛戒，剃发为僧。", "古籍引文", "佛教史料", "李敖引佛教史料，说明中国人剃发为僧的早期记载。"),
  q("011.", 25, "汉、魏皆禁汉人不得出家", "古籍引文", "《高僧传》佛图澄传中王度奏语", "李敖引古籍奏语，反证民间已有汉人出家事实。"),
  q("011.", 27, "耽好酒浆，或畜妻子", "古籍引文", "《牟子理惑论》相关记载", "李敖引早期佛教材料，说明来华僧人行为并无固定成规。"),
  q("011.", 27, "造菩萨行", "佛教成句", "佛教语汇", "李敖摘用佛教成句，强调做和尚在于明心见性与菩萨行。"),
  q("011.", 27, "放下屠刀，佛都能做", "佛教俗语化用", "佛教俗语", "李敖化用放下屠刀成佛的俗语，说明成佛与成和尚不在形式。"),
  q(
    "011.",
    33,
    "陛下起此寺，皆是百姓卖儿贴妇钱，佛若有知，当悲哭哀愍。罪高佛图，有何功德！",
    "古籍引文",
    "《南史》虞愿故事",
    "李敖引虞愿直谏，批评奢建寺院违背佛教大悲精神。",
  ),
  q("011.", 39, "屠戮生民，所过郡县，靡有孑遗", "古籍引文", "张献忠相关史料", "李敖引史料成句，交代破山和尚请命故事的惨烈背景。"),
  q("011.", 43, "儒帽裹僧头", "古典成句", "李贽相关评语", "李敖引李贽形象成句，写儒佛身份交错。"),
  q("011.", 43, "虽弃发，盖有为也！", "古文评语", "李贽相关评语", "李敖引评语，说明出家并非消极避世。"),
  q("011.", 43, "自是精灵爱出家，钵头何必向京华", "古典诗句", "汤显祖诗", "李敖引汤显祖诗，赞李贽出家有独立精神。"),

  q("012.", 51, "伟人成功的背后，在家有贤内助", "西方谚语", "西方谚语", "李敖引西方谚语，赞伴侣对成功的支撑。"),
  q("012.", 51, "性忠在牢外时，姬美是贤内助；性忠在牢内时，姬美是贤外助。", "李敖格言", "李敖化用贤内助", "李敖化用谚语成妙语，写伴侣在内外两端的支援。"),

  q("014.", 3, "汉孰与我大？", "古代问语", "夜郎典故", "李敖引夜郎国王问语，说明闭塞者不知外界之大。"),
  q("014.", 3, "夜郎自大", "成语典故", "夜郎典故", "李敖摘用成语，写褊狭自大的心态。"),

  q("016.", 3, "江山代有才人出", "古典诗句", "赵翼诗句", "李敖引诗句，写世代人物流转。"),

  q(
    "018.",
    3,
    "请离我远一点，别挨过来，因为你会把我碰碎，并且我也不想靠近你。",
    "寓言语录",
    "《伊索寓言》两个罐",
    "李敖引伊索寓言中泥罐的话，说明不等势者相近会受损。",
  ),
  q("018.", 3, "同等的人，才能搅在一起。", "寓言格言", "《伊索寓言》两个罐", "李敖引伊索寓言结论，说明相处需要相近的条件。"),
  q("018.", 5, "与虎谋皮", "成语典故", "中文成语", "李敖摘用成语，写向强暴者求合作的荒唐。"),
  q(
    "018.",
    59,
    "你们和不信的原不相配，不要同负一轭。义和不义有什么相交呢？光明和黑暗有什么相通呢？基督和彼列（撒旦）有什么相合呢？信主的和不信主的有什么相干呢？",
    "宗教引文",
    "《新约》哥林多后书",
    "李敖引《新约》文字，说明价值根本不合者不宜同负一轭。",
  ),

  q("021.", 3, "正义的迟来就是非正义（Delay of justice is injustice）", "法律格言", "W. S. Landor", "李敖引兰道格言，说明迟到的正义会否定自身。"),
  q("021.", 3, "迟来的正义，不算正义。", "法律格言", "W. E. Gladstone", "李敖引格拉德斯通改写句，概括迟到正义的缺陷。"),
  q("021.", 51, "内举不避亲，外举不避仇", "传统格言", "中文传统成句", "李敖引传统成句，说明荐才不应以亲仇为限。"),

  q("022.", 45, "尔为尔，我为我，虽袒裼裸裎于我侧，尔焉能浼我哉！", "古典格言", "中国古代圣人语", "李敖引古语，说明他人污浊不能玷污自我。"),
  q("022.", 45, "耳食之言", "成语", "中文成语", "李敖摘用成语，指未经核实的传闻之言。"),
  q("022.", 45, "瑶言止于智者", "俗语格言", "中文俗语", "李敖引用俗语，说明智者应止住谣传。", 45, "源文作“瑶言”，疑为“谣言”。"),

  q("027.", 13, "剖之以为瓢，则瓠落无所容，非不呺然大也。", "古文例句", "《庄子·逍遥游》", "李敖转引高名凯所举古文例，说明“不”的用法。"),
  q("027.", 15, "知而使之，是不仁也；不知而使之，是不知也。", "古文例句", "《孟子·公孙丑下》", "李敖转引高名凯所举古文例，说明“不”的用法。"),
  q("027.", 17, "不识王之不可以为汤武，则是不明也。", "古文例句", "《孟子·公孙丑下》", "李敖转引高名凯所举古文例，说明“不”的用法。"),
  q("027.", 19, "白旃非不馥，焉能逆风？", "古文例句", "《世说新语·文学篇》", "李敖转引高名凯所举古文例，说明“不”的用法。"),
  q(
    "027.",
    21,
    "城非不高也、池非不深也、兵革非不坚利也、米粟非不多也，委而去之，是地利不如人和也。",
    "古文例句",
    "《孟子·公孙丑下》",
    "李敖转引高名凯所举古文例，说明“不”的用法。",
  ),
  q("027.", 23, "不仁、不义、不忠、不信", "古书词例", "古书常用反面词", "李敖摘举古书词例，说明“不”字构成反面性格名词。"),
  q("027.", 47, "你两个做得好事！", "文学引文", "《水浒传》第二十三回", "李敖引《水浒传》反语例，说明字面褒辞可作反面意思。"),
  q(
    "027.",
    47,
    "好呀！好呀！我请你来做衣裳，不曾叫你来偷汉子。武大得知，须连累我；不若我先去出首。",
    "文学引文",
    "《水浒传》第二十三回",
    "李敖引《水浒传》反语例，说明语气和上下文决定真实意思。",
  ),
  q(
    "027.",
    51,
    "When that the poor have cried, Caesar hath wept.（穷人笑时，凯撒堕泪。）",
    "莎剧引文",
    "莎士比亚《凯撒大帝》",
    "李敖引莎剧安东尼演说，作为反语铺陈的文学例子。",
  ),
  q(
    "027.",
    53,
    "Ambition should be made of sterner stuff.（野心应该是更硬一点的东西做成的。）",
    "莎剧引文",
    "莎士比亚《凯撒大帝》",
    "李敖引莎剧安东尼演说，作为反语铺陈的文学例子。",
  ),
  q(
    "027.",
    55,
    "Yet Brutus says he was ambitious.（但布鲁塔斯说他有野心。）",
    "莎剧引文",
    "莎士比亚《凯撒大帝》",
    "李敖引莎剧安东尼演说，作为反语铺陈的文学例子。",
  ),
  q(
    "027.",
    57,
    "And Brutus is an honourabte man.（而布鲁塔斯是正人君子。）",
    "莎剧引文",
    "莎士比亚《凯撒大帝》",
    "李敖引莎剧安东尼演说，说明重复称颂也可形成反语。",
    57,
    "源文英文作 honourabte，按原文保留。",
  ),

  q("029.", 59, "影不徙", "诸子成句", "墨子语", "李敖引墨子语，写影子与空间记忆的哲学感受。"),
  q("029.", 59, "飞鸟之影，未尝动也", "诸子成句", "庄子语", "李敖引庄子语，写影子看似流动而本未尝动。"),

  q(
    "030.",
    19,
    "耶路撒冷啊！耶路撒冷啊！你常杀害先知，又用石头打死那奉差遣到你这里来的人。",
    "宗教引文",
    "《新约》福音书",
    "李敖引福音书句子，借先知意象说明先恭后倨。",
  ),

  q("031.", 59, "挂帆沧海，风波茫茫，或沦无底，或达仙乡。", "外国诗句", "丁尼生诗，经严复《天演论》译", "李敖引严复译丁尼生诗，写一念选择可上达或下坠。"),
  q("031.", 59, "一着错，满盘输矣", "俗语格言", "中文俗语", "李敖摘用俗语，说明关键一步失误会使全局皆输。"),

  q("033.", 33, "名从主人", "传统成句", "中文名物规则", "李敖摘用成句，说明称名应尊重自定之名。"),
  q("033.", 37, "觚不觚。觚哉？觚哉？", "《论语》名句", "《论语》", "李敖引孔子名句，说明名实必须相符。"),
  q("033.", 37, "世有因名以得实，亦有因名以失实。", "古籍引文", "《尹文子》", "李敖引《尹文子》句，说明名与实相互影响。"),
  q("033.", 41, "猪八戒照镜子——里外不是人", "歇后语", "中文歇后语", "李敖摘用歇后语，写左右两边都不讨好的处境。"),

  q("034.", 47, "干父之蛊", "《易经》成句", "《易经》", "李敖引徐复观所称《易经》语，说明为父辈旧事作补正。"),
  q("034.", 151, "上帝要毁灭一个人，必先使他疯狂！", "西方谚语", "西谚", "李敖转引西谚，写疯狂作为败亡先兆。"),
  q("034.", 185, "臣无祖母无以至今日；祖母无臣无以终余年。", "古文名句", "李密《陈情表》", "李敖转引《陈情表》名句，说明互相成全的关系。"),
  q("034.", 185, "打开天窗说亮话", "俗语格言", "中文俗语", "李敖摘用俗语，写直截了当地把话说开。"),
  q("034.", 185, "不按牌理出牌", "俗语格言", "中文俗语", "李敖摘用俗语，写不照常规行事。"),

  q("035.", 39, "拿人的手短、吃人的嘴软", "俗语格言", "中文俗语", "李敖引俗语，说明受人财物容易受制于人。"),

  q(
    "036.",
    27,
    "My folks didn't come over on the Mayflower, but they were there to meet the boat.（我们家的人没坐“五月花号”来，但他们却是〔在岸上〕接这条船的。）",
    "西方幽默格言",
    "Will Rogers",
    "李敖引威尔·罗杰斯的话，反讽五月花号资格论。",
  ),

  q("037.", 171, "你无须全部吃完一个臭鸡蛋，才知道那是一个臭鸡蛋", "文学批评格言", "缪凤林评书相关说法", "李敖引评书比喻，说明从开头即可判断整体败坏。"),

  q("047.", 7, "浮云一别后，流水十年间。", "古典诗句", "韦应物诗句", "李敖引诗句，写久别重逢后的岁月流逝。"),
];

const proofreadExclusions = new Map(
  [
    ["竟为收容", "校对删除：只是古文片段，检索价值弱，已由同段“望门投止”“好将轻侠藏亡命”覆盖其义。"],
    ["造菩萨行", "校对删除：佛教短语过碎，不构成独立诗文格言。"],
    ["屠戮生民，所过郡县，靡有孑遗", "校对删除：史料背景描述偏暴力叙事，不作为格言或可独立引用诗文保留。"],
    ["瑶言止于智者", "校对删除：源文疑为“谣言止于智者”的 OCR 误字，保留会把错字固定进条目。"],
    ["不仁、不义、不忠、不信", "校对删除：只是古书反面词例列表，不是独立引用句。"],
    ["打开天窗说亮话", "校对删除：在法律攻防引文中顺带出现的普通口头语，首轮从严去掉。"],
    ["不按牌理出牌", "校对删除：在法律攻防引文中顺带出现的普通口头语，首轮从严去掉。"],
  ].map(([quoteText, reason]) => [normalizeText(quoteText), reason]),
);

const proofreadAdditions = [
  q(
    "015.",
    15,
    "只要颜色不同，就打掉再说！",
    "轶事格言",
    "唐德刚《胡适杂忆》所记麻将轶事",
    "李敖引唐德刚所记胡适家麻将轶事，概括只按颜色取舍的偏狭。",
  ),
  q(
    "023.",
    15,
    "证据是历史工作者的第一信条，没有证据是不能随便下笔的。",
    "史学格言",
    "李敖史学判断",
    "李敖在谈史料方法时提出的格言，强调历史写作以证据为第一信条。",
  ),
];
const proofreadAdditionTexts = new Set(proofreadAdditions.map((row) => normalizeText(row.quote_text)));

const modernPoliticalTerms = [
  "国民党",
  "共产党",
  "中共",
  "民进党",
  "党外",
  "三民主义",
  "政治",
  "政党",
  "政府",
  "政权",
  "总统",
  "领袖",
  "国父",
  "革命",
  "反共",
  "反攻",
  "复国",
  "统一",
  "独立",
  "民主",
  "自由",
  "人权",
  "宪法",
  "司法",
  "法院",
  "法官",
  "自诉",
  "诽谤",
  "戒严",
  "军法",
  "选举",
  "立委",
  "司法院",
  "行政院",
  "立法院",
  "监察院",
  "考试院",
  "宣传",
  "中华民国",
  "台湾",
  "大陆",
  "蒋",
  "孙中山",
];

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function rowToCsv(row) {
  return [
    row.id,
    row.book,
    row.chapter,
    row.source_file,
    row.line_start,
    row.line_end,
    row.quote_text,
    row.category,
    row.source_or_origin,
    row.summary,
    row.notes,
  ]
    .map(csvEscape)
    .join(",");
}

function quotePresent(row) {
  const source = sourceCache.get(row.source_file);
  const slice = source.lines.slice(row.line_start - 1, row.line_end).join("\n");
  return normalizeText(slice).includes(normalizeText(row.quote_text));
}

function hasPoliticalHit(row) {
  return modernPoliticalTerms.filter((term) => row.quote_text.includes(term));
}

const fileIndex = new Map(files.map((file, index) => [file, index]));
function rowCompare(a, b) {
  const fileDiff = fileIndex.get(a.source_file) - fileIndex.get(b.source_file);
  if (fileDiff) return fileDiff;
  const lineDiff = a.line_start - b.line_start;
  if (lineDiff) return lineDiff;
  return a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN");
}

const initialRows = rawRows.sort(rowCompare).map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));
const proofreadExcludedRows = initialRows
  .filter((row) => proofreadExclusions.has(normalizeText(row.quote_text)))
  .map((row) => ({
    ...row,
    original_id: row.id,
    proofread_reason: proofreadExclusions.get(normalizeText(row.quote_text)),
  }));

const selectedRows = [
  ...initialRows.filter((row) => !proofreadExclusions.has(normalizeText(row.quote_text))),
  ...proofreadAdditions,
]
  .sort(rowCompare)
  .map((row, index) => ({
    ...row,
    id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
  }));
const proofreadAddedRows = selectedRows.filter((row) => proofreadAdditionTexts.has(normalizeText(row.quote_text)));

const auditRows = selectedRows.map((row) => {
  const present = quotePresent(row);
  const politicalHits = hasPoliticalHit(row);
  return { row, present, politicalHits };
});

const missing = auditRows.filter((item) => !item.present);
const politicalHits = auditRows.filter((item) => item.politicalHits.length > 0);
const duplicateTexts = new Map();
for (const row of selectedRows) {
  const key = normalizeText(row.quote_text);
  duplicateTexts.set(key, (duplicateTexts.get(key) || 0) + 1);
}
const duplicates = selectedRows.filter((row) => duplicateTexts.get(normalizeText(row.quote_text)) > 1);

if (missing.length) {
  throw new Error(`Missing quote text in source: ${missing.map((item) => `${item.row.id}:${item.row.quote_text}`).join(", ")}`);
}
if (duplicates.length) {
  throw new Error(`Duplicate quote text in ${book}: ${duplicates.map((row) => row.id).join(", ")}`);
}
if (politicalHits.length) {
  throw new Error(
    `Political terms in selected quote text: ${politicalHits
      .map((item) => `${item.row.id}(${item.politicalHits.join("|")})`)
      .join(", ")}`,
  );
}

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(selectedJson), { recursive: true });

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
const header = columns.join(",");

fs.writeFileSync(outCsv, `\uFEFF${header}\r\n${selectedRows.map(rowToCsv).join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push(`《${book}》诗文格言歌谣引用`);
txt.push(`生成日期：${generatedDate}`);
txt.push(`条目数：${selectedRows.length}`);
txt.push("");
for (const row of selectedRows) {
  txt.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  txt.push(`引用：${row.quote_text}`);
  txt.push(`出处线索：${row.source_or_origin}`);
  txt.push(`摘要：${row.summary}`);
  txt.push(`备注：${row.notes}`);
  txt.push("");
}
fs.writeFileSync(outTxt, `\uFEFF${txt.join("\r\n")}\r\n`, "utf8");

fs.writeFileSync(selectedJson, `${JSON.stringify(selectedRows, null, 2)}\n`, "utf8");

const reviewHeader = [
  "id",
  "decision",
  "category",
  "quote_text",
  "source_or_origin",
  "source_file",
  "line_start",
  "line_end",
  "summary",
  "proofread_reason",
  "notes",
];
const reviewRows = [
  ...selectedRows.map((row) => ({
    ...row,
    decision: proofreadAdditionTexts.has(normalizeText(row.quote_text)) ? "add-proofread" : "keep-proofread",
    proofread_reason: proofreadAdditionTexts.has(normalizeText(row.quote_text)) ? "校对补入：明确非政治且可独立检索的引用/格言。" : "",
  })),
  ...proofreadExcludedRows.map((row) => ({
    ...row,
    id: row.original_id,
    decision: "remove-proofread",
  })),
].sort((a, b) => {
  const diff = rowCompare(a, b);
  if (diff) return diff;
  return String(a.decision).localeCompare(String(b.decision), "zh-Hans-CN");
});
const reviewLines = [
  reviewHeader.join("\t"),
  ...reviewRows.map((row) =>
    reviewHeader
      .map((column) => {
        return String(row[column] ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
      })
      .join("\t"),
  ),
];
fs.writeFileSync(reviewTsv, `${reviewLines.join("\r\n")}\r\n`, "utf8");

const auditHeader = ["id", "present", "political_hits", "duplicate_count", "quote_text", "source_file", "line_start", "line_end"];
const auditLines = [
  auditHeader.join("\t"),
  ...auditRows.map((item) =>
    [
      item.row.id,
      item.present ? "yes" : "no",
      item.politicalHits.join("|"),
      duplicateTexts.get(normalizeText(item.row.quote_text)),
      item.row.quote_text,
      item.row.source_file,
      item.row.line_start,
      item.row.line_end,
    ]
      .map((value) => String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " "))
      .join("\t"),
  ),
];
fs.writeFileSync(auditTsv, `${auditLines.join("\r\n")}\r\n`, "utf8");

const report = {
  book,
  generatedDate,
  sourceDir,
  sourceFiles: files.length,
  candidatesJson,
  reviewCandidatesTsv,
  initialRowsBeforeProofread: initialRows.length,
  proofreadRemovedRows: proofreadExcludedRows.length,
  proofreadAddedRows: proofreadAddedRows.length,
  selectedRows: selectedRows.length,
  removedRows: proofreadExcludedRows.map((row) => ({
    original_id: row.original_id,
    quote_text: row.quote_text,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
    reason: row.proofread_reason,
  })),
  addedRows: proofreadAddedRows.map((row) => ({
    id: row.id,
    quote_text: row.quote_text,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
  })),
  missingQuotes: missing.map((item) => item.row.id),
  politicalHits: politicalHits.map((item) => ({
    id: item.row.id,
    quote_text: item.row.quote_text,
    hits: item.politicalHits,
  })),
  duplicateQuotes: duplicates.map((row) => row.id),
  csvPath: outCsv,
  txtPath: outTxt,
  selectedJson,
  reviewTsv,
  auditTsv,
};
fs.writeFileSync(reportTxt, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify(report, null, 2));
