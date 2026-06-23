const fs = require("fs");
const path = require("path");

const generatedDate = "2026-06-21";
const book = "李敖书序集续集";
const idPrefix = "LASHXJX";
const sourceRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "007.采访序跋类",
  "003.李敖书序集续集",
);
const outDir = path.join(process.cwd(), "exports");
const analysisDir = path.join(process.cwd(), "analysis");
const sourceDecoder = new TextDecoder("gb18030");

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

function chapterFromFile(file) {
  return file.replace(/\.txt$/, "").replace(/^\d+\./, "");
}

function row(sourceFile, lineStart, lineEnd, quoteText, category, sourceOrOrigin, summary, notes = "") {
  return {
    id: "",
    book,
    chapter: chapterFromFile(sourceFile),
    source_file: sourceFile,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrOrigin,
    summary,
    notes,
  };
}

const data = [
  row(
    "001.《李敖语录香港版》感言.txt",
    13,
    13,
    "所过者化，所存者神",
    "孟子成句",
    "《孟子》相关成句",
    "以感化与存留精神概括文字影响。",
  ),
  row(
    "004.《国民党查禁李敖著作》序.txt",
    3,
    3,
    "更无一个是男儿",
    "古典诗句",
    "花蕊夫人《述国亡诗》相关名句",
    "以反诘语势写担当者之少。",
  ),
  row(
    "004.《国民党查禁李敖著作》序.txt",
    5,
    5,
    "心之所善，九死无悔",
    "楚辞成句",
    "屈原《离骚》相关语意",
    "以九死不悔表现坚持本心。",
  ),
  row(
    "004.《国民党查禁李敖著作》序.txt",
    9,
    9,
    "不见尧存，甘同桀亡",
    "古典成句",
    "传统典故化表达",
    "用尧桀对举表达宁可同亡的极端态度。",
  ),
  row(
    "006.《李敖作品精选集》总序.txt",
    3,
    3,
    "文古无选，自昭明《昭明文选》始，而后世因有选体。",
    "文学史评语",
    "章学诚《文史通义》相关论述",
    "说明选本文体自《文选》以后形成谱系。",
  ),
  row(
    "006.《李敖作品精选集》总序.txt",
    3,
    3,
    "选之难倍于作",
    "文学评语",
    "选本批评成句",
    "指出选文之难甚至超过创作。",
  ),
  row(
    "007.《洗你的脑，掐他脖子》自序.txt",
    3,
    3,
    "知其不可而为之",
    "论语成句",
    "《论语·宪问》相关成句",
    "表现明知艰难仍然去做的行动意志。",
  ),
  row(
    "007.《洗你的脑，掐他脖子》自序.txt",
    3,
    3,
    "知我罪我",
    "孟子成句",
    "《孟子·滕文公下》相关成句",
    "以知与罪并举，表示任由后人评断。",
  ),
  row(
    "007.《洗你的脑，掐他脖子》自序.txt",
    3,
    3,
    "圣人不空出，贤者不虚生",
    "古典成句",
    "传统典籍成句",
    "强调有才德者出现必有其用。",
  ),
  row(
    "008.简介两种.txt",
    33,
    33,
    "学问成家数",
    "学术格言",
    "梁启超语",
    "称真正有本领者可在多方面成家。",
  ),
  row(
    "008.简介两种.txt",
    37,
    37,
    "我手写我口",
    "文学口号",
    "近代文学改革口号",
    "强调用自己的语言直接写作。",
  ),
  row(
    "008.简介两种.txt",
    45,
    45,
    "天行有常",
    "荀子成句",
    "《荀子·天论》成句",
    "用天道有常比喻创作节律自有秩序。",
  ),
  row(
    "011.诗序李玠《大陆当代顺口溜赏析》.txt",
    3,
    17,
    "办公事，腿要抽。\n\n办私事，心要钩。\n\n办好事，情要偷。\n\n办房事，精要丢。\n\n不报喜来不报忧，\n\n靠天靠地靠胡诌。\n\n何必敢言又敢怒，\n\n痛快全靠顺口溜。",
    "李敖自作顺口溜",
    "李敖诗序李玠《大陆当代顺口溜赏析》",
    "以排比和俗语节奏写顺口溜的痛快感。",
    "本书进入诗集语录类后，李敖自作诗文可收；此处为明确诗序。",
  ),
  row(
    "012.《文茜半生缘》序.txt",
    75,
    75,
    "我挥一挥衣袖，不带走一片云彩",
    "现代诗句",
    "徐志摩《再别康桥》名句",
    "借离别诗句写洒脱离场。",
  ),
  row(
    "014.复瓿书成空自苦，击辕歌罢遣谁听.txt",
    7,
    7,
    "覆瓿书成空自苦，击辕歌罢遣谁听",
    "古典诗句",
    "陆游诗句",
    "以覆瓿与击辕写著书无人赏识之慨。",
  ),
  row(
    "014.复瓿书成空自苦，击辕歌罢遣谁听.txt",
    7,
    7,
    "韦编三绝",
    "史记成语",
    "《史记·孔子世家》相关典故",
    "形容勤读反复，书编多次断裂。",
  ),
  row(
    "014.复瓿书成空自苦，击辕歌罢遣谁听.txt",
    7,
    7,
    "黄绢初裁",
    "典故成句",
    "传统文人典故",
    "以黄绢新裁比喻文章初成。",
  ),
  row(
    "015.序凉如水.txt",
    3,
    3,
    "受想行识",
    "佛教语",
    "佛教五蕴术语",
    "指五蕴中的心理与认知层面。",
  ),
  row(
    "015.序凉如水.txt",
    3,
    3,
    "念兹在兹",
    "尚书成句",
    "《尚书》相关成句",
    "表示一直把某事放在心上。",
  ),
  row(
    "015.序凉如水.txt",
    7,
    7,
    "碧落黄泉",
    "古典成语",
    "白居易《长恨歌》相关名句",
    "用天上地下表示寻觅范围极广。",
  ),
  row(
    "015.序凉如水.txt",
    7,
    7,
    "佳作之秘，在旧事新说、新事旧说",
    "写作格言",
    "爱德华·帕尔默语，李敖译述",
    "说明好文章在于旧题新说或新题旧说。",
  ),
  row(
    "015.序凉如水.txt",
    7,
    7,
    "The secret of good writing is to say an old thing a new way or to say a new thing an old way.",
    "外国写作格言",
    "爱德华·帕尔默语",
    "以英文原句说明好写法的转换之道。",
  ),
  row(
    "017.《好命操作手册》序.txt",
    3,
    3,
    "罕言命",
    "论语成句",
    "《论语·子罕》相关成句",
    "指出孔子很少谈命。",
  ),
  row(
    "017.《好命操作手册》序.txt",
    3,
    3,
    "死生有命、富贵在天",
    "论语成句",
    "《论语·颜渊》相关成句",
    "把生死富贵归于命与天。",
  ),
  row(
    "017.《好命操作手册》序.txt",
    5,
    5,
    "尽人事，听天命",
    "传统格言",
    "传统处世格言",
    "强调努力之后顺其自然。",
  ),
  row(
    "017.《好命操作手册》序.txt",
    7,
    7,
    "怪力乱神",
    "论语成句",
    "《论语·述而》成句",
    "概括孔子不谈的异端神怪范围。",
  ),
  row(
    "018.陆晋德译《飞鸟集》序.txt",
    3,
    3,
    "好书，要能经得起时间的考验。",
    "李敖序文格言",
    "李敖序陆晋德译《飞鸟集》",
    "以时间作为好书的检验尺度。",
  ),
  row(
    "018.陆晋德译《飞鸟集》序.txt",
    5,
    5,
    "人生要加些东西，才能有价值",
    "泰戈尔诗句转述",
    "泰戈尔《飞鸟集》第278首，李敖转述",
    "以加值观念说明生命要有所增益。",
  ),
  row(
    "018.陆晋德译《飞鸟集》序.txt",
    5,
    5,
    "音乐是由音符组成，人生是由片刻组成",
    "泰戈尔诗句转述",
    "泰戈尔《飞鸟集》第278首，李敖转述",
    "把音乐与人生并举，强调片刻构成整体。",
  ),
  row(
    "018.陆晋德译《飞鸟集》序.txt",
    7,
    7,
    "人生没有爱，仿佛酒杯没有酒",
    "泰戈尔诗句转述",
    "泰戈尔《飞鸟集》第88首，李敖转述",
    "以空酒杯比喻没有爱的生命。",
  ),
  row(
    "018.陆晋德译《飞鸟集》序.txt",
    13,
    13,
    "乌云可以是彩云",
    "泰戈尔诗句转述",
    "泰戈尔《飞鸟集》第292首，李敖转述",
    "把阴暗事物转化为美感意象。",
  ),
  row(
    "018.陆晋德译《飞鸟集》序.txt",
    15,
    15,
    "“伟大”其实没这么伟大",
    "李敖序文格言",
    "李敖序陆晋德译《飞鸟集》",
    "借泰戈尔谈法反向削弱宏大词语。",
  ),
  row(
    "018.陆晋德译《飞鸟集》序.txt",
    19,
    19,
    "诗无训诂",
    "诗学格言",
    "诗学成句",
    "指出诗歌不宜只从训诂解释。",
  ),
  row(
    "020.我看《宰相刘罗锅》.txt",
    3,
    3,
    "姑妄言之，姑妄听之",
    "庄子成句",
    "《庄子·齐物论》相关成句",
    "表示姑且说来，也姑且听之。",
  ),
  row(
    "020.我看《宰相刘罗锅》.txt",
    7,
    7,
    "指着和尚骂贼秃",
    "俗语",
    "传统俗语",
    "比喻当面指桑骂槐。",
  ),
  row(
    "020.我看《宰相刘罗锅》.txt",
    11,
    11,
    "以贵公子、为名翰林、书名满天下，而自问则小就不可、大成不能、年八十五不知所终。",
    "人物自述",
    "刘墉自挽相关文字",
    "以自述概括才名、局限与晚年归宿。",
  ),
  row(
    "020.我看《宰相刘罗锅》.txt",
    11,
    11,
    "身后是非谁管得，",
    "古典诗句",
    "清人诗句，文中用于刘墉",
    "表达身后评价已非本人所能过问。",
  ),
  row(
    "022.《胡适选集》五十年.txt",
    5,
    5,
    "著作等身",
    "传统成语",
    "传统成语",
    "形容著述数量极多。",
  ),
  row(
    "022.《胡适选集》五十年.txt",
    9,
    9,
    "你比我胡适之还了解胡适之！",
    "人物评语",
    "胡适对李敖编选工作的赞语",
    "以本人赞语肯定编选者对材料的熟悉。",
  ),
  row(
    "022.《胡适选集》五十年.txt",
    11,
    11,
    "墓草久宿",
    "古典成语",
    "传统成语",
    "形容逝者已久。",
  ),
  row(
    "022.《胡适选集》五十年.txt",
    13,
    13,
    "斯文在兹，公道在兹",
    "传统成句",
    "传统文人语",
    "以文脉与公论并举，表示纪念版的意义。",
  ),
];

const initialRecordCount = data.length;

const proofreadAddedRows = [
  row(
    "006.《李敖作品精选集》总序.txt",
    3,
    3,
    "出神入化",
    "传统成语",
    "传统成语",
    "形容文字技艺达到高妙境界。",
  ),
  row(
    "006.《李敖作品精选集》总序.txt",
    3,
    3,
    "一应俱全",
    "传统成语",
    "传统成语",
    "表示内容门类齐备。",
  ),
  row(
    "006.《李敖作品精选集》总序.txt",
    3,
    3,
    "自成一家",
    "传统成语",
    "传统成语",
    "表示形成自己的风格和体系。",
  ),
  row(
    "006.《李敖作品精选集》总序.txt",
    3,
    3,
    "以一当八",
    "李敖序文评语",
    "李敖《李敖作品精选集》总序",
    "以夸张语势称一人足抵多人。",
  ),
  row(
    "008.简介两种.txt",
    9,
    9,
    "名满天下，谤亦随之",
    "传统成句",
    "传统文人语",
    "以盛名与毁谤并至概括人物声名。",
  ),
  row(
    "008.简介两种.txt",
    13,
    13,
    "借尸还魂",
    "传统成语",
    "传统成语",
    "比喻旧物换形后重新出现。",
  ),
  row(
    "008.简介两种.txt",
    27,
    27,
    "五十年来和五百年内，中国人写白话文的前三名是李敖，李敖，李敖",
    "李敖自评名言",
    "《李敖大全集》特色简介转述李敖语",
    "以戏谑夸张方式自评白话文写作地位。",
  ),
  row(
    "008.简介两种.txt",
    29,
    29,
    "学贯中西",
    "传统成语",
    "传统成语",
    "形容学问贯通中外。",
  ),
  row(
    "008.简介两种.txt",
    29,
    29,
    "深入浅出",
    "传统成语",
    "传统成语",
    "形容表达深入而易懂。",
  ),
  row(
    "008.简介两种.txt",
    29,
    29,
    "茅塞顿开",
    "传统成语",
    "传统成语",
    "比喻忽然明白。",
  ),
  row(
    "008.简介两种.txt",
    31,
    31,
    "没死就要留皮",
    "俗语变体",
    "传统俗语“豹死留皮”化用",
    "把留皮俗语改写为自传式比喻。",
  ),
  row(
    "008.简介两种.txt",
    31,
    31,
    "豹隐",
    "典故成句",
    "《烈女传》相关典故",
    "以豹隐典故指隐伏不出。",
  ),
  row(
    "008.简介两种.txt",
    31,
    31,
    "豹变",
    "易传成句",
    "《易经》相关成句",
    "以豹变典故指文采或形貌焕然一新。",
  ),
  row(
    "008.简介两种.txt",
    37,
    37,
    "一针见血",
    "传统成语",
    "传统成语",
    "形容评论直接切中要害。",
  ),
  row(
    "008.简介两种.txt",
    37,
    37,
    "万箭穿心",
    "传统成语",
    "传统成语",
    "形容文字攻击力极强。",
  ),
  row(
    "008.简介两种.txt",
    37,
    37,
    "神出鬼没",
    "传统成语",
    "传统成语",
    "形容行文变化莫测。",
  ),
  row(
    "008.简介两种.txt",
    37,
    37,
    "善恶分明",
    "传统成语",
    "传统成语",
    "形容判断标准清楚。",
  ),
  row(
    "008.简介两种.txt",
    37,
    37,
    "快人快语",
    "传统成语",
    "传统成语",
    "形容说话爽直明快。",
  ),
  row(
    "008.简介两种.txt",
    37,
    37,
    "体大思精",
    "文论成句",
    "传统文论成句",
    "形容文章体制宏大而思理精密。",
  ),
  row(
    "008.简介两种.txt",
    39,
    39,
    "匠心独运",
    "传统成语",
    "传统成语",
    "形容构思独到。",
  ),
  row(
    "008.简介两种.txt",
    39,
    39,
    "妙手回春",
    "传统成语",
    "传统成语",
    "比喻高明手法使事物恢复生机。",
  ),
  row(
    "008.简介两种.txt",
    39,
    39,
    "拍案惊奇",
    "传统成语",
    "传统成语",
    "形容情节或见识令人惊叹。",
  ),
  row(
    "008.简介两种.txt",
    41,
    41,
    "别开生面",
    "传统成语",
    "传统成语",
    "形容开创新的局面。",
  ),
  row(
    "008.简介两种.txt",
    41,
    41,
    "气象万千",
    "传统成语",
    "传统成语",
    "形容文章气势丰富多变。",
  ),
  row(
    "008.简介两种.txt",
    43,
    43,
    "妙手偶得",
    "传统成语",
    "传统成语",
    "形容佳作由灵巧笔法偶然得来。",
  ),
  row(
    "014.复瓿书成空自苦，击辕歌罢遣谁听.txt",
    3,
    3,
    "瞻之倩女，忽焉幽魂",
    "文言诗性句",
    "李敖序文句",
    "用倩女与幽魂对照写红颜早逝之感。",
  ),
  row(
    "018.陆晋德译《飞鸟集》序.txt",
    3,
    3,
    "醍醐灌顶",
    "佛教成语",
    "佛教典故成语",
    "比喻受到启发而顿然清明。",
  ),
  row(
    "018.陆晋德译《飞鸟集》序.txt",
    3,
    3,
    "茅塞顿开",
    "传统成语",
    "传统成语",
    "比喻读诗后忽然明白。",
  ),
  row(
    "018.陆晋德译《飞鸟集》序.txt",
    13,
    13,
    "“忧愁”其实很陌生",
    "泰戈尔诗句转述",
    "泰戈尔《飞鸟集》第216首，李敖转述",
    "以陌生化说法处理忧愁意象。",
  ),
  row(
    "018.陆晋德译《飞鸟集》序.txt",
    17,
    17,
    "当头棒喝",
    "禅宗成语",
    "禅宗典故成语",
    "比喻诗句给人直接警醒。",
  ),
  row(
    "018.陆晋德译《飞鸟集》序.txt",
    17,
    17,
    "目眩神迷",
    "传统成语",
    "传统成语",
    "形容泰戈尔诗智令人惊叹沉迷。",
  ),
  row(
    "020.我看《宰相刘罗锅》.txt",
    3,
    3,
    "倡优蓄之",
    "古典成句",
    "古人论倡优之语",
    "指把演艺者当作供娱乐的人蓄养。",
  ),
  row(
    "020.我看《宰相刘罗锅》.txt",
    7,
    7,
    "凤毛麟角",
    "传统成语",
    "传统成语",
    "形容极其稀少。",
  ),
  row(
    "020.我看《宰相刘罗锅》.txt",
    7,
    7,
    "借古讽今",
    "传统成语",
    "传统成语",
    "指借古事影射当下。",
  ),
  row(
    "020.我看《宰相刘罗锅》.txt",
    7,
    7,
    "心照不宣",
    "传统成语",
    "传统成语",
    "指彼此心里明白而不说破。",
  ),
  row(
    "020.我看《宰相刘罗锅》.txt",
    9,
    9,
    "有清名",
    "史传评语",
    "《清史稿》评刘墉语",
    "以清名概括刘墉的声望。",
  ),
  row(
    "020.我看《宰相刘罗锅》.txt",
    9,
    9,
    "浓墨宰相",
    "人物称号",
    "刘墉书法相关称号",
    "以用墨特色形成刘墉称号。",
  ),
  row(
    "020.我看《宰相刘罗锅》.txt",
    11,
    11,
    "端坐而逝",
    "传统成语",
    "传统成语",
    "形容临终端坐而安然离世。",
  ),
  row(
    "022.《胡适选集》五十年.txt",
    7,
    7,
    "蔚为巨观",
    "传统成语",
    "传统成语",
    "形容选集规模可观。",
  ),
  row(
    "022.《胡适选集》五十年.txt",
    9,
    9,
    "淋漓尽致",
    "传统成语",
    "传统成语",
    "形容资料搜集本领发挥充分。",
  ),
  row(
    "022.《胡适选集》五十年.txt",
    13,
    13,
    "蒿目时艰",
    "传统成语",
    "传统成语",
    "形容为时局艰难而忧虑。",
  ),
];

const proofreadUpdatedRows = [];
const proofreadDeletedRows = [];

data.push(...proofreadAddedRows);

data.forEach((item, index) => {
  item.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\r?\n/g, "\\n").replace(/\t/g, " ");
}

function readSource(file) {
  return sourceDecoder.decode(fs.readFileSync(path.join(sourceRoot, file)));
}

function listSourceFiles() {
  return fs
    .readdirSync(sourceRoot)
    .filter((file) => file.endsWith(".txt") && !file.includes("目录"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function compact(text) {
  return String(text).replace(/\s+/g, "");
}

function validateAgainstSource(rows) {
  const errors = [];
  for (const item of rows) {
    const sourcePath = path.join(sourceRoot, item.source_file);
    if (!fs.existsSync(sourcePath)) {
      errors.push(`${item.id}: missing source file ${item.source_file}`);
      continue;
    }
    const lines = readSource(item.source_file).split(/\r?\n/);
    const sourceText = lines.slice(item.line_start - 1, item.line_end).join("\n");
    if (!sourceText.includes(item.quote_text) && !compact(sourceText).includes(compact(item.quote_text))) {
      errors.push(`${item.id}: quote not found at ${item.source_file}:${item.line_start}-${item.line_end}`);
    }
  }
  return errors;
}

function collectReviewAids() {
  const quoteTrigger =
    /[“”‘’]|曰|云|说|所谓|俗话|谚|格言|名言|题词|题记|成语|典故|诗|词|联|古人|孔子|孟子|论语|礼记|史记|左传|诗经|庄子|老子|荀子|韩非|司马迁|陆游|白居易|徐志摩|梁启超|胡适|泰戈尔|Tagore|The secret/;
  const attributedTrigger =
    /说|曰|云|写道|指出|认为|尝言|自谓|题诗|序中|其中是|有这样|引|转述|称道|赞扬|感叹|论定/;
  const sourceFiles = listSourceFiles();
  const quoteCandidates = [];
  const reviewCandidates = [];
  const attributedLines = [];

  for (const file of sourceFiles) {
    const lines = readSource(file).split(/\r?\n/);
    lines.forEach((line, index) => {
      const text = line.trim();
      if (!text) return;
      if (quoteTrigger.test(text)) {
        const item = { source_file: file, line: index + 1, text };
        quoteCandidates.push(item);
        if (/[“”‘’]|曰|云|所谓|题诗|自谓|尝言|其中是|写道|指出|论定|泰戈尔|Tagore|The secret/.test(text)) {
          reviewCandidates.push(item);
        }
      }
      if (attributedTrigger.test(text)) {
        attributedLines.push({ source_file: file, line: index + 1, text });
      }
    });
  }

  return { sourceFiles, quoteCandidates, reviewCandidates, attributedLines };
}

const validationErrors = validateAgainstSource(data);
if (validationErrors.length > 0) {
  console.error(validationErrors.join("\n"));
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_shuxuji_xuji_initial_report.txt");
const auditPath = path.join(analysisDir, "liao_shuxuji_xuji_initial_audit.tsv");
const proofreadReportPath = path.join(analysisDir, "liao_shuxuji_xuji_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_shuxuji_xuji_proofread_audit.tsv");
const candidatesPath = path.join(analysisDir, "liao_shuxuji_xuji_quote_candidates.json");
const reviewCandidatesPath = path.join(analysisDir, "liao_shuxuji_xuji_review_candidates.tsv");
const attributedLinesPath = path.join(analysisDir, "liao_shuxuji_xuji_attributed_lines.tsv");

const csvLines = [columns.join(",")];
for (const item of data) {
  csvLines.push(columns.map((column) => csvEscape(item[column])).join(","));
}
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");

const txtLines = [];
for (const item of data) {
  txtLines.push(`${item.id}｜${item.category}｜${item.source_file}:${item.line_start}-${item.line_end}`);
  txtLines.push(`引用：${item.quote_text}`);
  txtLines.push(`出处线索：${item.source_or_origin}`);
  txtLines.push(`摘要：${item.summary}`);
  if (item.notes) txtLines.push(`备注：${item.notes}`);
  txtLines.push("");
}
fs.writeFileSync(txtPath, `\uFEFF${txtLines.join("\r\n")}\r\n`, "utf8");

const { sourceFiles, quoteCandidates, reviewCandidates, attributedLines } = collectReviewAids();
fs.writeFileSync(candidatesPath, `${JSON.stringify(quoteCandidates, null, 2)}\n`, "utf8");

const reviewHeader = ["source_file", "line", "text"];
fs.writeFileSync(
  reviewCandidatesPath,
  `\uFEFF${[
    reviewHeader.join("\t"),
    ...reviewCandidates.map((item) => [item.source_file, item.line, item.text].map(tsvEscape).join("\t")),
  ].join("\r\n")}\r\n`,
  "utf8",
);
fs.writeFileSync(
  attributedLinesPath,
  `\uFEFF${[
    reviewHeader.join("\t"),
    ...attributedLines.map((item) => [item.source_file, item.line, item.text].map(tsvEscape).join("\t")),
  ].join("\r\n")}\r\n`,
  "utf8",
);

const categoryCounts = new Map();
for (const item of data) categoryCounts.set(item.category, (categoryCounts.get(item.category) || 0) + 1);

const excludedHighlights = [
  "001 富兰克林自由语录：现代公共表达，未收。",
  "005 二二八研究广告词：公共事件广告语境，整篇未收。",
  "010《黄旗梦碎》序、019《国家将兴，必有祯祥》、021《是真的也要否认》：现实公共议题语境过重，未收。",
  "012《文茜半生缘》序中访谈与人物攻防语录：只保留徐志摩诗句。",
  "016《调查局黑牢345天》序中《汉书》刑狱引文：法律控诉语境过重，未收。",
];

const auditExcludes = [
  ["exclude", "modern-public-quote", "001.《李敖语录香港版》感言.txt", "7-7", "哪里有自由，哪里便是我的祖国。", "现代公共表达，未收"],
  ["exclude", "public-event-ad", "005.《二二八研究》广告词.txt", "3-5", "广告词与事件表述", "公共事件广告语境，整篇排除"],
  ["exclude", "current-affairs-preface", "010.《黄旗梦碎》序.txt", "3-11", "人物与团体攻防表述", "现实公共议题语境过重，未收"],
  ["exclude", "interview-public-lines", "012.《文茜半生缘》序.txt", "7-73", "访谈与人物攻防语录", "只保留徐志摩诗句，其余未收"],
  ["exclude", "legal-complaint-quote", "016.《调查局黑牢345天》序.txt", "5-9", "画地为狱等《汉书》刑狱引文", "法律控诉语境过重，未收"],
  ["exclude", "governance-classic", "019.国家将兴，必有祯祥.txt", "1-3", "国家将兴，必有祯祥；国家将亡，必有妖孽。", "治理判断指向过强，未收"],
  ["exclude", "current-affairs-preface", "021.是真的也要否认.txt", "3-25", "密使、献金、事实正确等整篇论述", "现实公共议题语境过重，整篇未收"],
];

const proofreadExcludeRows = [
  ["exclude", "current-affairs-preface", "010.《黄旗梦碎》序.txt", "3-23", "新党初选、候选人、选务攻防等叙述", "现实公共议题语境过重，校对轮继续排除"],
  ["exclude", "interview-public-lines", "012.《文茜半生缘》序.txt", "7-119", "访谈、运动、团体与人物攻防语录", "除徐志摩诗句外，其余现实公共议题语境过重"],
  ["exclude", "legal-complaint-quote", "016.《调查局黑牢345天》序.txt", "9-11", "《汉书》刑狱长引文与汉唐以来所未有也", "法律控诉语境过重，校对轮继续排除"],
  ["exclude", "religion-governance-phrase", "017.《好命操作手册》序.txt", "7-7", "神道设教", "在统治术批评语境中出现，未收"],
  ["exclude", "public-preface", "019.国家将兴，必有祯祥.txt", "25-29", "政治令人腐化，文学令人净化；国家将兴，必有祯祥等", "现实公共议题与治理判断指向过强，校对轮继续排除"],
  ["exclude", "current-affairs-preface", "021.是真的也要否认.txt", "5-21", "密使、献金、事实正确等整篇引语", "现实公共议题语境过重，校对轮继续排除"],
  ["exclude", "ruler-minister-appraisal", "020.我看《宰相刘罗锅》.txt", "9-9", "刘统勋乃不愧真宰相。", "君臣官职评价语境较强，未收"],
];

const reportLines = [];
reportLines.push(`《${book}》第一轮提取报告`);
reportLines.push(`生成日期：${generatedDate}`);
reportLines.push(`源目录：${sourceRoot}`);
reportLines.push(`输出 CSV：${csvPath}`);
reportLines.push(`输出 TXT：${txtPath}`);
reportLines.push(`收录条数：${data.length}`);
reportLines.push("");
reportLines.push("候选概况：");
reportLines.push(`- sourceFiles=${sourceFiles.length}`);
reportLines.push(`- quoteCandidates=${quoteCandidates.length}`);
reportLines.push(`- attributedLines=${attributedLines.length}`);
reportLines.push(`- reviewCandidates=${reviewCandidates.length}`);
reportLines.push("");
reportLines.push("分类统计：");
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) =>
  a[0].localeCompare(b[0], "zh-Hans-CN"),
)) {
  reportLines.push(`- ${category}: ${count}`);
}
reportLines.push("");
reportLines.push("本轮排除：");
for (const item of excludedHighlights) reportLines.push(`- ${item}`);
reportLines.push("");
reportLines.push("明细：");
reportLines.push(
  [
    "id",
    "source_file",
    "line_start",
    "line_end",
    "category",
    "source_or_origin",
    "quote_text",
    "summary",
    "notes",
  ].join("\t"),
);
for (const item of data) {
  reportLines.push(
    [
      item.id,
      item.source_file,
      item.line_start,
      item.line_end,
      item.category,
      item.source_or_origin,
      item.quote_text,
      item.summary,
      item.notes,
    ]
      .map(tsvEscape)
      .join("\t"),
  );
}
fs.writeFileSync(reportPath, `\uFEFF${reportLines.join("\r\n")}\r\n`, "utf8");

const auditRows = [
  ["action", "target", "source_file", "line_range", "quote_or_candidate", "reason"],
  ...data.map((item) => [
    "keep",
    item.id,
    item.source_file,
    `${item.line_start}-${item.line_end}`,
    item.quote_text,
    item.summary,
  ]),
  ...auditExcludes,
];
fs.writeFileSync(
  auditPath,
  `\uFEFF${auditRows.map((auditRow) => auditRow.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

const proofreadReportLines = [];
proofreadReportLines.push(`《${book}》校对轮报告`);
proofreadReportLines.push(`生成日期：${generatedDate}`);
proofreadReportLines.push(`源目录：${sourceRoot}`);
proofreadReportLines.push(`输出 CSV：${csvPath}`);
proofreadReportLines.push(`输出 TXT：${txtPath}`);
proofreadReportLines.push(`首轮收录条数：${initialRecordCount}`);
proofreadReportLines.push(`校对补入条数：${proofreadAddedRows.length}`);
proofreadReportLines.push(`校对修订条数：${proofreadUpdatedRows.length}`);
proofreadReportLines.push(`校对删除条数：${proofreadDeletedRows.length}`);
proofreadReportLines.push(`当前收录条数：${data.length}`);
proofreadReportLines.push("");
proofreadReportLines.push("校对结论：");
proofreadReportLines.push("- 首轮 41 条未发现必须删除项。");
proofreadReportLines.push("- 补入 006、008、014、018、020、022 中明确成语、典故、人物评语、泰戈尔诗句转述和李敖自评名言。");
proofreadReportLines.push("- 继续排除 010、012、016、019、021 及 020 个别君臣官职评价语境过强的候选。");
proofreadReportLines.push("");
proofreadReportLines.push("校对补入：");
for (const item of proofreadAddedRows) {
  proofreadReportLines.push(
    `- ${item.id}\t${item.source_file}:${item.line_start}-${item.line_end}\t${item.category}\t${item.quote_text}`,
  );
}
proofreadReportLines.push("");
proofreadReportLines.push("校对复核排除：");
for (const rowItem of proofreadExcludeRows) {
  proofreadReportLines.push(`- ${rowItem[2]}:${rowItem[3]}\t${rowItem[4]}\t${rowItem[5]}`);
}
fs.writeFileSync(proofreadReportPath, `\uFEFF${proofreadReportLines.join("\r\n")}\r\n`, "utf8");

const proofreadAuditRows = [
  ["action", "target", "source_file", "line_range", "quote_or_candidate", "reason"],
  ...proofreadAddedRows.map((item) => [
    "add",
    item.id,
    item.source_file,
    `${item.line_start}-${item.line_end}`,
    item.quote_text,
    item.notes || item.summary,
  ]),
  ...proofreadExcludeRows,
];
fs.writeFileSync(
  proofreadAuditPath,
  `\uFEFF${proofreadAuditRows.map((auditRow) => auditRow.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      book,
      initialRecords: initialRecordCount,
      records: data.length,
      proofreadAdded: proofreadAddedRows.length,
      proofreadUpdated: proofreadUpdatedRows.length,
      proofreadDeleted: proofreadDeletedRows.length,
      csvPath,
      txtPath,
      reportPath,
      auditPath,
      proofreadReportPath,
      proofreadAuditPath,
      candidatesPath,
      reviewCandidatesPath,
      attributedLinesPath,
      sourceFiles: sourceFiles.length,
      quoteCandidates: quoteCandidates.length,
      attributedLines: attributedLines.length,
      reviewCandidates: reviewCandidates.length,
    },
    null,
    2,
  ),
);
