const fs = require("fs");
const path = require("path");

const book = "历史与人像";
const idPrefix = "LAHRX";
const generatedDate = "2026-06-23";
const outDir = "exports";
const analysisDir = "analysis";
const analysisPrefix = "liao_history_portraits";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "009.历史文化类",
  "001.历史与人像",
);

const sourceDecoder = new TextDecoder("gb18030");
const lineCache = new Map();

function readLines(file) {
  if (!lineCache.has(file)) {
    const sourcePath = path.join(process.cwd(), sourceDir, file);
    lineCache.set(file, sourceDecoder.decode(fs.readFileSync(sourcePath)).split(/\r?\n/));
  }
  return lineCache.get(file);
}

function sourceFiles() {
  return fs.readdirSync(path.join(process.cwd(), sourceDir))
    .filter((file) => file.endsWith(".txt") && !file.includes("目录"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function chapterFromFile(file) {
  return file.replace(/^\d+\./, "").replace(/\.txt$/, "");
}

function quoteFromLines(file, lineStart, lineEnd) {
  return readLines(file)
    .slice(lineStart - 1, lineEnd)
    .map((line) => line.replace(/^[\s　]+/, "").replace(/\s+$/, ""))
    .filter(Boolean)
    .join("\n")
    .trim();
}

function compact(text) {
  return String(text).replace(/[\s　]+/g, "");
}

function stripSourceNotes(text) {
  return String(text).replace(/（wjm_tcy注：[^）]*）/g, "");
}

function comparable(text) {
  return compact(stripSourceNotes(text));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, "\\n");
}

function row(file, lineStart, lineEnd, quoteText, category, sourceOrigin, summary, notes = "") {
  return {
    id: "",
    book,
    chapter: chapterFromFile(file),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrigin,
    summary,
    notes,
  };
}

function lineRow(file, lineStart, lineEnd, category, sourceOrigin, summary, notes = "") {
  return row(
    file,
    lineStart,
    lineEnd,
    quoteFromLines(file, lineStart, lineEnd),
    category,
    sourceOrigin,
    summary,
    notes,
  );
}

const data = [
  row(
    "002.余玠人格品质的分析.txt",
    9,
    9,
    "孱然一儒者，慷慨成英雄。",
    "清人咏史诗句",
    "顾景星《过余义夫先生墓》",
    "以墓诗两句概括余玠由儒者而成英雄的形象。",
  ),
  lineRow(
    "002.余玠人格品质的分析.txt",
    15,
    23,
    "宋词",
    "余玠《瑞鹤仙》",
    "李敖引余玠长短句，以说明其文才与气魄。",
  ),
  row(
    "003.杜威的教育思想及其他.txt",
    29,
    29,
    "知识即力量",
    "西方哲学格言",
    "Francis Bacon",
    "李敖论杜威思想源流时转引培根名言。",
  ),
  row(
    "003.杜威的教育思想及其他.txt",
    29,
    29,
    "提高人生，以增进人类的能力",
    "西方哲学格言",
    "Francis Bacon",
    "李敖转述培根关于科学目的的说法。",
  ),
  row(
    "003.杜威的教育思想及其他.txt",
    29,
    29,
    "经验就是生活，生活不是在抽象之中，而是在环境之中，并且还得之于环境",
    "实用主义格言",
    "杜威《创造的智慧》",
    "李敖引杜威语说明经验哲学的本质。",
  ),
  row(
    "003.杜威的教育思想及其他.txt",
    37,
    37,
    "教育就是生活",
    "实用主义格言",
    "杜威",
    "李敖概述杜威教育与生活合一的观念。",
  ),
  row(
    "003.杜威的教育思想及其他.txt",
    37,
    37,
    "经验哲学也就是生活",
    "实用主义格言",
    "杜威",
    "李敖概述杜威经验哲学与生活合一的观念。",
  ),
  row(
    "003.杜威的教育思想及其他.txt",
    37,
    37,
    "哲学就是广义的教育学说。",
    "实用主义格言",
    "杜威",
    "李敖引杜威语说明哲学与教育的贯通。",
  ),
  row(
    "003.杜威的教育思想及其他.txt",
    41,
    41,
    "学而不思则罔，思而不学则殆。",
    "论语名句",
    "《论语》",
    "蔡元培借孔子语说明经验与思想并重。",
  ),
  row(
    "003.杜威的教育思想及其他.txt",
    41,
    41,
    "多闻阙疑，慎言其余；多见阙殆，慎行其余。",
    "论语名句",
    "《论语》",
    "蔡元培借孔子语说明试验精神。",
  ),
  row(
    "003.杜威的教育思想及其他.txt",
    43,
    43,
    "诲人不倦",
    "论语成语",
    "《论语》",
    "李敖以孔子语概括杜威终身教育事业。",
  ),
  row(
    "004.桑格夫人和节育运动.txt",
    9,
    9,
    "天下事十碰九不开，好在还有第十碰",
    "现代幽默格言",
    "吴稚晖语",
    "吴稚晖以十碰九不开的妙语劝人面对挫折。",
  ),
  row(
    "004.桑格夫人和节育运动.txt",
    9,
    9,
    "天行健，君子以自强不息。",
    "易经名句",
    "《易经》",
    "吴稚晖借《易经》语说明遇挫仍须自强。",
  ),
  row(
    "004.桑格夫人和节育运动.txt",
    313,
    313,
    "在整个世界上，任何力量都没有一项时机已经成熟的理想更为强大。",
    "西方文学格言",
    "雨果语",
    "桑格夫人常引用雨果式格言解释理想成熟后的力量。",
  ),
  row(
    "006.行李考.txt",
    3,
    3,
    "古李理同音通用，故行李与行理竝见，大李与大理不分。",
    "训诂名句",
    "段玉裁《说文解字注》",
    "李敖引段注说明行李与行理古时通用。",
  ),
  row(
    "006.行李考.txt",
    5,
    5,
    "若舍郑以为东道主，行李之往来，共其乏困。",
    "左传名句",
    "《左传》僖公三十年",
    "李敖考证行李一词来源时引《左传》。",
  ),
  row(
    "006.行李考.txt",
    5,
    5,
    "行李，使人。",
    "古注名句",
    "杜预注《左传》",
    "杜预以使人解释行李一词。",
  ),
  row(
    "006.行李考.txt",
    5,
    5,
    "行理，使人通聘问者。",
    "古注名句",
    "杜预注《左传》",
    "李敖引杜注说明行理为通聘问之使者。",
  ),
  row(
    "006.行李考.txt",
    5,
    5,
    "行李，行人之官也。然则两字通用，本多作理，训之为吏，故为行人使人也。",
    "训诂名句",
    "孔晁注《国语》",
    "李敖引孔晁注说明行李、行理与行人使者的关系。",
  ),
  row(
    "006.行李考.txt",
    9,
    9,
    "唐时谓官府导从之人，亦曰行李。",
    "训诂名句",
    "顾炎武《日知录》",
    "李敖引顾炎武说明唐代行李另指官府导从。",
  ),
  row(
    "006.行李考.txt",
    11,
    11,
    "行装曰行李，谓人将有行，必先治装。",
    "训诂名句",
    "方勺《泊宅篇》",
    "李敖引方勺说明行李演变为旅途装橐之义。",
  ),
  row(
    "007.“两昆仑”考.txt",
    19,
    19,
    "诗无达诂",
    "诗学格言",
    "传统诗学语",
    "李敖在考辨两昆仑异说时借此说明诗句解释并无定解。",
  ),
  row(
    "009.宋禁科场书.txt",
    43,
    43,
    "此何有！消青铜三百，易一部时文，足矣！",
    "科举轶语",
    "王恽《玉堂嘉话》引《辛殿撰小传》",
    "李敖引辛弃疾科举笑谈，说明时文对投考的作用。",
  ),
  row(
    "009.宋禁科场书.txt",
    43,
    43,
    "是以三百青蚨博吾爵者！",
    "科举轶语",
    "王恽《玉堂嘉话》引《辛殿撰小传》",
    "李敖转引孝宗以三百青蚨买爵的玩笑。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    7,
    7,
    "由父之父递推之，百世皆吾祖也；由母之母而递推之，三世之外有不知谁何者矣",
    "宗族论句",
    "宋代宗族观念语",
    "李敖引此说明父系单系亲属计算的传统。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    13,
    13,
    "男帅女，女从男，夫妇之义，由此始也。妇人，从人者也……嫁从夫。",
    "古代婚姻格言",
    "《礼记·郊特牲》",
    "李敖引《礼记》说明夫妻同体主义的礼教背景。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    13,
    13,
    "妇人有三从之义，无专用之道；故……既嫁从夫。",
    "古代婚姻格言",
    "《仪礼·丧服子夏传》",
    "李敖引三从之义说明旧礼教中的妇女地位。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    13,
    13,
    "夫者，妻之天也。",
    "古代婚姻格言",
    "《仪礼·丧服子夏传》",
    "李敖引此说明丈夫在旧婚姻结构中的绝对地位。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    17,
    17,
    "夫妻，一体也……夫妻，牉合也。",
    "古代婚姻格言",
    "《仪礼·丧服子夏传》",
    "李敖以此说明夫妻同体主义的经典依据。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    21,
    21,
    "妻者，齐也，与夫齐体。",
    "古代婚姻格言",
    "班固《白虎通》",
    "李敖引班固语说明妻与夫齐体的旧说。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    75,
    75,
    "取于异姓，所以附远厚别也。",
    "古代婚姻格言",
    "《礼记·郊特牲》",
    "李敖引《礼记》说明同姓不婚的礼教理由。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    75,
    75,
    "取妻不取同姓，以厚别也。",
    "古代婚姻格言",
    "《礼记·坊记》",
    "李敖引《坊记》说明取妻不取同姓的古礼。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    75,
    75,
    "男女同姓，其生不蕃。",
    "古代婚姻格言",
    "《左传·僖公二十三年》",
    "李敖引《左传》说明同姓婚姻的优生理由。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    75,
    75,
    "同姓不婚，惧不殖也。",
    "古代婚姻格言",
    "《国语·晋语》",
    "李敖引《国语》说明同姓不婚的生殖理由。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    75,
    75,
    "夫和实生物，同则不继",
    "古代婚姻格言",
    "《国语·郑语》",
    "李敖引《国语》说明异类相生、同则不继的古义。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    165,
    165,
    "凡嫁娶因非偶而不和者，父母不审之罪也。",
    "古代婚姻格言",
    "袁采《袁氏世范》",
    "李敖引袁采语说明父母择配不审会导致婚姻不和。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    165,
    165,
    "媒者之言，不可尽信如此，宜谨察于始。",
    "古代婚姻格言",
    "袁采《袁氏世范》",
    "李敖引袁采语说明媒妁之言不可尽信。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    27,
    27,
    "采采南涧苹，心事涧水知；在室尽子职，为妇尽妇仪",
    "宋诗句",
    "蒲寿宬《拙妇吟》",
    "李敖引宋人诗句说明旧式妇仪观念。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    31,
    31,
    "家人离，必起于妇人，故暌次家人，以二女同居而志不同也",
    "宋儒语录",
    "周敦颐《周子通书》",
    "李敖引周敦颐语说明宋儒对家人离合的解释。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    35,
    35,
    "妇道之常，顺为厥正",
    "宋儒语录",
    "张载《横渠女诫》",
    "李敖节取张载女诫说明旧妇道以顺为正。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    39,
    39,
    "男牵欲而失其刚，妇狃说而忘其顺，则凶而无所利矣！",
    "宋儒语录",
    "程颐《近思录》",
    "李敖引程颐语说明宋儒对男女欲念与顺从的看法。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    179,
    181,
    "红酥手，黄滕酒。满城春色宫墙柳；东风恶，欢情薄，一怀愁绪，几年离索——错！错！错！\n春如旧，人空瘦。泪痕红浥鲛绡透；桃花落，闲池阁，山盟虽在，锦书难托——莫！莫！莫",
    "宋词",
    "陆游《钗头凤》",
    "李敖引陆游题壁词说明唐氏被出后的沈园故事。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    185,
    191,
    "梦断香销四十年，\n沈园柳老不飞绵；\n此身行作稽山土，\n犹吊遗踪一泫然。",
    "宋诗",
    "陆游沈园诗",
    "李敖引陆游晚岁入城登寺眺望时所作绝句。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    195,
    201,
    "城上斜阳画角哀，\n沈园无复旧池台；\n伤心桥下春波绿，\n曾是惊鸿照影来。",
    "宋诗",
    "陆游沈园诗",
    "李敖引陆游沈园绝句写旧地旧情。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    205,
    219,
    "枫叶初丹槲叶黄，\n河阳愁鬓怯新霜；\n林亭感旧空回首，\n泉路凭谁说断肠？\n坏壁醉题尘漠漠，\n断云幽梦事茫茫。\n年来妄念消除尽，\n回向蒲龛一炷香。",
    "宋诗",
    "陆游沈园诗",
    "李敖引陆游重到沈园所作诗，写旧题与幽梦。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    223,
    229,
    "路近城南已怕行，\n沈家园里更伤情。\n香穿客袖梅花在，\n绿蘸寺桥春水生。",
    "宋诗",
    "陆游沈园诗",
    "李敖引陆游梦游沈园绝句之一。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    231,
    237,
    "城南小陌又逢春，\n只见梅花不见人。\n玉骨已成泉下土，\n墨痕犹锁壁间尘。",
    "宋诗",
    "陆游沈园诗",
    "李敖引陆游梦游沈园绝句之二。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    257,
    263,
    "沈家园里花如锦，\n半是当年识放翁。\n也信美人终作土，\n不堪幽梦太匆匆。",
    "宋诗",
    "陆游《春游》",
    "李敖补引陆游《春游》中追忆沈园的诗句。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    273,
    273,
    "必私积聚，为人妇而出，常也；其成居，幸也。",
    "古代婚姻格言",
    "《韩非子·说林》",
    "李敖引卫人嫁女故事说明旧时妇人私财与被出的关系。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    279,
    285,
    "龙邱居士亦可怜，\n谈空说有夜不眠；\n忽闻河东狮子吼，\n拄杖落手心茫然。",
    "宋诗",
    "苏轼诗",
    "李敖引苏轼诗说明陈季常与河东狮子典故。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    331,
    331,
    "夫妻以义合，义绝则离。",
    "古代婚姻格言",
    "司马光《训子孙文》",
    "李敖引司马光语说明义绝导致强制离婚。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    609,
    609,
    "Husband and wife are one person, and that one is the husband.",
    "英文婚姻格言",
    "英美法婚姻格言",
    "李敖在注释中引英美法格言说明夫妻同体主义。",
  ),
  row(
    "010.夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续.txt",
    859,
    859,
    "妾闻忠臣不事二君；列女不更二夫。",
    "古典小说名句",
    "《京本通俗小说·冯玉梅团圆》",
    "李敖注中引古小说语说明列女不更二夫观念。",
  ),
  row(
    "011.李易安再嫁了吗？.txt",
    21,
    21,
    "轻信记载，疏舛固宜。",
    "考据评语",
    "俞正燮《癸巳类稿》",
    "李敖引俞正燮语批评李心传轻信记载。",
  ),
  row(
    "011.李易安再嫁了吗？.txt",
    27,
    27,
    "岂有就木之龄已过，隳城之泪方深，顾为此不得已之为，如汉文姬故事？",
    "清人词话评语",
    "吴衡照《莲子居词话》",
    "李敖引吴衡照语反驳李清照晚年改嫁传说。",
  ),
  row(
    "011.李易安再嫁了吗？.txt",
    49,
    49,
    "做历史考据真是不容易！",
    "李敖治学格言",
    "李敖《李易安再嫁了吗？》",
    "李敖总结李清照再嫁争议中的年代考据困难。",
  ),
  row(
    "011.李易安再嫁了吗？.txt",
    51,
    51,
    "再嫁并没有什么不得了，可是没再嫁却硬说她再嫁，这就太不对了。",
    "李敖史论格言",
    "李敖《李易安再嫁了吗？》",
    "李敖把再嫁争议归结为事实与谣言的区别。",
  ),
  row(
    "012.对《徐树铮先生文集年谱合刊》的批评.txt",
    185,
    185,
    "历史的法则，无论哪一门，都应该据事直书，不必多下批评",
    "史学方法格言",
    "梁启超《中国历史研究法续编》转述",
    "李敖概述年谱体例时引出据事直书的史学原则。",
  ),
  row(
    "012.对《徐树铮先生文集年谱合刊》的批评.txt",
    185,
    185,
    "作传，但描写这个人的真相，不下一句断语，而令读者自然了解这个人的地位和价值，那才称得上史才。",
    "史学方法格言",
    "梁启超《中国历史研究法续编》转述",
    "李敖概述传记与年谱应少下断语、据事呈现。",
  ),
  row(
    "012.对《徐树铮先生文集年谱合刊》的批评.txt",
    195,
    195,
    "年谱之作，原是传记写作的基料",
    "年谱体例格言",
    "李敖《对〈徐树铮先生文集年谱合刊〉的批评》",
    "李敖区分年谱与传记，说明年谱是传记写作的基料。",
  ),
];

const riskPattern = /大总统|总统|革命|政变|民主|自由|政府|国民党|共产党|国民|国家|人权|宪法|政治|政党|外蒙古|军阀|北洋|统治|学生运动|罢免|亲日|卖国|反共|阶级|斗争/;
const candidatePattern = /[“”‘’]|曰：|云：|说：|诗云|词云|有句|名言|格言|谚|典故|《[^》]+》|Knowledge is Power|Husband and wife|天行健|诗无达诂|河东狮子|沈园|钗头凤|据事直书|考据/;

function assignIds(rows) {
  rows.forEach((record, index) => {
    record.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
  });
}

function validateRows(rows) {
  assignIds(rows);
  const errors = [];
  const seen = new Set();

  for (const record of rows) {
    if (seen.has(record.id)) errors.push(`${record.id}: duplicate id`);
    seen.add(record.id);

    const lines = readLines(record.source_file);
    const sourceText = lines.slice(record.line_start - 1, record.line_end).join("\n");
    if (!sourceText.includes(record.quote_text) && !comparable(sourceText).includes(comparable(record.quote_text))) {
      errors.push(`${record.id}: quote not found at ${record.source_file}:${record.line_start}-${record.line_end}`);
    }
  }

  if (errors.length) {
    throw new Error(`Validation failed:\n${errors.join("\n")}`);
  }
}

function writeCsv(rows, csvPath) {
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
  const lines = [
    columns.join(","),
    ...rows.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
  ];
  fs.writeFileSync(csvPath, `\uFEFF${lines.join("\r\n")}\r\n`, "utf8");
}

function writeTxt(rows, txtPath) {
  const lines = [
    `《${book}》诗文格言歌谣引用`,
    `生成日期：${generatedDate}`,
    `条目数：${rows.length}`,
    "",
  ];

  for (const record of rows) {
    lines.push(`${record.id}｜${record.chapter}｜${record.source_file}:${record.line_start}-${record.line_end}`);
    lines.push(`类别：${record.category}`);
    lines.push(`来源：${record.source_or_origin}`);
    lines.push("原文：");
    lines.push(record.quote_text);
    lines.push(`说明：${record.summary}`);
    if (record.notes) lines.push(`备注：${record.notes}`);
    lines.push("");
  }

  fs.writeFileSync(txtPath, `\uFEFF${lines.join("\r\n")}`, "utf8");
}

function collectCandidates(rows) {
  const selectedKeys = new Set(rows.map((record) => `${record.source_file}:${record.line_start}:${record.line_end}`));
  const candidates = [];
  let totalLines = 0;
  let riskLines = 0;

  for (const file of sourceFiles()) {
    const lines = readLines(file);
    totalLines += lines.length;
    lines.forEach((line, index) => {
      const text = line.trim();
      if (!text) return;
      if (/李敖影音|李敖数字博物馆|资源下载站|leeaoweb|leeao\.net|wjm_tcy|QQ群|油管|抖音/.test(text)) return;
      const risk = riskPattern.test(text);
      if (risk) riskLines += 1;
      if (!candidatePattern.test(text) && !risk) return;
      const lineNumber = index + 1;
      candidates.push({
        source_file: file,
        line: lineNumber,
        text,
        risk,
        selected: [...selectedKeys].some((key) => {
          const [selectedFile, start, end] = key.split(":");
          return selectedFile === file && lineNumber >= Number(start) && lineNumber <= Number(end);
        }),
        context: lines
          .slice(Math.max(0, index - 1), Math.min(lines.length, index + 2))
          .map((item) => item.trim())
          .filter(Boolean)
          .join(" / "),
      });
    });
  }

  return { totalLines, riskLines, candidates };
}

function writeAnalysis(rows, candidatesInfo) {
  const candidateJsonPath = path.join(analysisDir, `${analysisPrefix}_quote_candidates.json`);
  fs.writeFileSync(candidateJsonPath, JSON.stringify(candidatesInfo.candidates, null, 2), "utf8");

  const reviewTsvPath = path.join(analysisDir, `${analysisPrefix}_review_candidates.tsv`);
  const reviewRows = candidatesInfo.candidates.filter((candidate) => !candidate.selected);
  const reviewLines = [
    "source_file\tline\trisk\ttext\tcontext",
    ...reviewRows.map((candidate) =>
      [
        candidate.source_file,
        candidate.line,
        candidate.risk ? "true" : "false",
        tsvEscape(candidate.text),
        tsvEscape(candidate.context),
      ].join("\t"),
    ),
  ];
  fs.writeFileSync(reviewTsvPath, `\uFEFF${reviewLines.join("\r\n")}\r\n`, "utf8");

  const attributedTsvPath = path.join(analysisDir, `${analysisPrefix}_attributed_lines.tsv`);
  const attributedLines = [
    "source_file\tline\tselected\ttext",
    ...candidatesInfo.candidates.map((candidate) =>
      [
        candidate.source_file,
        candidate.line,
        candidate.selected ? "selected" : "pending",
        tsvEscape(candidate.text),
      ].join("\t"),
    ),
  ];
  fs.writeFileSync(attributedTsvPath, `\uFEFF${attributedLines.join("\r\n")}\r\n`, "utf8");

  const auditPath = path.join(analysisDir, `${analysisPrefix}_initial_audit.tsv`);
  const auditLines = [
    "decision\tid\tsource_file\tline_range\tcategory\trisk_in_quote\tquote_text\treason",
    ...rows.map((record) =>
      [
        "keep",
        record.id,
        record.source_file,
        `${record.line_start}-${record.line_end}`,
        record.category,
        riskPattern.test(record.quote_text) ? "yes" : "no",
        tsvEscape(record.quote_text),
        tsvEscape(record.summary),
      ].join("\t"),
    ),
  ];
  fs.writeFileSync(auditPath, `\uFEFF${auditLines.join("\r\n")}\r\n`, "utf8");

  const categoryCounts = new Map();
  for (const record of rows) {
    categoryCounts.set(record.category, (categoryCounts.get(record.category) ?? 0) + 1);
  }
  const riskyRows = rows.filter((record) => riskPattern.test(record.quote_text));
  const explicitlyExcluded = [
    "001.袁世凯的祀孔：袁世凯尊孔、大总统通令、祀孔法案等现代政治宗教语境，整篇不收。",
    "002.余玠人格品质的分析：仅收咏史诗与余玠词；皇帝任命、军事谋略、帝王兔死狗烹等政治军事语录未收。",
    "004.桑格夫人和节育运动：法院抗法、基本人权、总统与政府节育计划等公共政治/法律语录未收。",
    "005.纪翠绫该生在什么时候？：通奸刑罚、检察长、法律争议与时论互骂密集，仅把同类婚姻经典留到010章集中处理。",
    "007.“两昆仑”考：谭嗣同狱中诗与梁启超解释属近代革命政治语境，未收；只留独立诗学格言“诗无达诂”。",
    "008.宋帝始生异象考：以史料排比为主，未见独立诗文格言，未收。",
    "009.宋禁科场书：出版自由、政府检查、禁书运动等政治/制度语境未收；只留科举时文笑谈。",
    "012.对《徐树铮先生文集年谱合刊》的批评：徐树铮、五四、北洋、外蒙古等政治史材料不收；只留年谱与史学方法句。",
  ];

  const report = [];
  report.push(`《${book}》首轮抽取报告`);
  report.push(`生成日期：${generatedDate}`);
  report.push(`源目录：${path.join(process.cwd(), sourceDir)}`);
  report.push(`源文件数：${sourceFiles().length}`);
  report.push(`源总行数：${candidatesInfo.totalLines}`);
  report.push(`候选行数：${candidatesInfo.candidates.length}`);
  report.push(`风险词行数：${candidatesInfo.riskLines}`);
  report.push("");
  report.push(`首轮收录条目：${rows.length}`);
  report.push(`CSV：${path.join(process.cwd(), outDir, `${book}_诗文格言歌谣引用.csv`)}`);
  report.push(`TXT：${path.join(process.cwd(), outDir, `${book}_诗文格言歌谣引用.txt`)}`);
  report.push(`审计：${path.join(process.cwd(), auditPath)}`);
  report.push("");
  report.push("类别分布：");
  for (const [category, count] of [...categoryCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    report.push(`- ${category}: ${count}`);
  }
  report.push("");
  report.push(`核心政治风险命中：${riskyRows.length}`);
  for (const record of riskyRows) {
    report.push(`- ${record.id}\t${record.source_file}:${record.line_start}\t${record.quote_text}`);
  }
  report.push("");
  report.push("本轮特别排除：");
  for (const item of explicitlyExcluded) report.push(`- ${item}`);
  report.push("");
  report.push("首轮取舍说明：");
  report.push("- 收录古典诗词、宋词、训诂名句、实用主义格言、婚姻制度经典语、李清照考据评语与年谱史学方法句。");
  report.push("- 对现代政治人物、革命诗、出版自由/政府检查、北洋军阀、外蒙古、五四翻案等政治史语境从严排除。");
  report.push("- 同一条婚姻经典在本书多处重复出现时，只保留出处更完整的一处。");

  const reportPath = path.join(analysisDir, `${analysisPrefix}_initial_report.txt`);
  fs.writeFileSync(reportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");

  const proofreadReport = [
    `《${book}》校对轮报告`,
    `生成日期：${generatedDate}`,
    "",
    `校对后条目：${rows.length}`,
    `CSV：${path.join(process.cwd(), outDir, `${book}_诗文格言歌谣引用.csv`)}`,
    `TXT：${path.join(process.cwd(), outDir, `${book}_诗文格言歌谣引用.txt`)}`,
    "",
    "校对动作：",
    "- 修改 3 条陆游沈园诗，删除源文行内的 wjm_tcy 制作者校注，保留李敖源文主句。",
    "- 补收 5 条同姓不婚相关古典格言：取于异姓、取妻不取同姓、男女同姓其生不蕃、同姓不婚惧不殖、夫和实生物同则不继。",
    "- 补收 2 条袁采《袁氏世范》择配/媒妁格言。",
    "- 删除 0 条；首轮排除的袁世凯、两昆仑、桑格夫人法庭/人权、徐树铮政治史材料继续不收。",
    "",
    `政治风险命中：${riskyRows.length}`,
    ...riskyRows.map((record) => `- ${record.id}\t${record.source_file}:${record.line_start}\t${record.quote_text}`),
  ];
  const proofreadPath = path.join(analysisDir, `${analysisPrefix}_proofread_report.txt`);
  fs.writeFileSync(proofreadPath, `\uFEFF${proofreadReport.join("\r\n")}\r\n`, "utf8");
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(analysisDir, { recursive: true });
  for (const file of sourceFiles()) readLines(file);

  validateRows(data);

  const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
  const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
  writeCsv(data, csvPath);
  writeTxt(data, txtPath);
  writeAnalysis(data, collectCandidates(data));

  console.log(JSON.stringify({
    book,
    records: data.length,
    csvPath,
    txtPath,
    reportPath: path.join(analysisDir, `${analysisPrefix}_initial_report.txt`),
    auditPath: path.join(analysisDir, `${analysisPrefix}_initial_audit.tsv`),
    proofreadReportPath: path.join(analysisDir, `${analysisPrefix}_proofread_report.txt`),
    candidatePath: path.join(analysisDir, `${analysisPrefix}_quote_candidates.json`),
    reviewPath: path.join(analysisDir, `${analysisPrefix}_review_candidates.tsv`),
    attributedPath: path.join(analysisDir, `${analysisPrefix}_attributed_lines.tsv`),
  }, null, 2));
}

main();
