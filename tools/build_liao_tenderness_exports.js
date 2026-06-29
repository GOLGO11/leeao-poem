const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = path.resolve(__dirname, "..");
const BOOK = "恰似我的温柔";
const ID_PREFIX = "TENDER";
const SOURCE_DIR = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "016.李敖祸台五十年庆祝十书",
  "004.恰似我的温柔"
);

const OUTPUT_CSV = path.join(ROOT, "exports", `${BOOK}_诗文格言歌谣引用.csv`);
const OUTPUT_TXT = path.join(ROOT, "exports", `${BOOK}_诗文格言歌谣引用.txt`);
const ANALYSIS_JSON = path.join(ROOT, "analysis", "liao_tenderness_selected_rows.json");
const REPORT_JSON = path.join(ROOT, "analysis", "liao_tenderness_proofread_build_report.json");
const REJECTS_JSON = path.join(ROOT, "analysis", "liao_tenderness_proofread_rejects.json");

const decoder = new TextDecoder("gb18030");

function readText(filePath) {
  return decoder.decode(fs.readFileSync(filePath));
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function normalize(value) {
  return String(value ?? "")
    .replace(/\s+/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/……/g, "...")
    .trim();
}

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_DIR)
    .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

const fileNames = sourceFiles();
const fileBySelector = new Map();
for (const name of fileNames) {
  if (name.includes("题辞")) {
    fileBySelector.set("preface", name);
  }
  const match = name.match(/^(\d{3})\./);
  if (match) {
    fileBySelector.set(match[1], name);
  }
}

function q(selector, lineStart, quoteText, sourceOrOrigin, category, note, lineEnd = lineStart) {
  const fileName = fileBySelector.get(selector);
  if (!fileName) {
    throw new Error(`Cannot find source file for selector ${selector}`);
  }
  return {
    selector,
    fileName,
    chapter: fileName.replace(/\.txt$/i, ""),
    lineStart,
    lineEnd,
    quoteText,
    sourceOrOrigin,
    category,
    note,
  };
}

const rows = [
  q("preface", 3, "轻士善骂", "《汉书》评语", "典故", "题辞中以古人评语自况，词组可独立检索。"),
  q("preface", 3, "千古独步", "成语化评语", "成语", "题辞中的独特评语。"),
  q("preface", 3, "恰似我的温柔", "李敖化用", "格言", "书题化用流行歌词，保留其反讽式自况。"),

  q("001", 25, "对事不对人", "俗语", "俗语", "公共批评中的处事短语，句意独立。"),
  q("001", 25, "春秋笔法", "典故", "成语", "史家书法典故。"),
  q("001", 25, "无所遁形", "成语", "成语", "独立成语。"),
  q("001", 25, "对人不对事", "李敖反用", "俗语", "反转常语形成的批评短句。"),
  q("001", 25, "另眼看待", "成语", "成语", "独立成语。"),
  q("001", 43, "化身博士", "Robert Louis Stevenson《Dr. Jekyll and Mr. Hyde》", "文学典故", "小说名形成的常用典故。"),

  q("002", 5, "有奶就是娘", "俗语", "俗语", "民间俗语。"),
  q("002", 23, "前不见古人，后不见来者", "陈子昂《登幽州台歌》", "诗句", "唐诗名句。"),
  q("002", 23, "浪子回头", "成语", "成语", "独立成语。"),

  q("003", 7, "曲学阿世", "古典成语", "成语", "以学问迎合世俗的成语。"),
  q("003", 7, "马屁精", "俗语", "俗语", "讽刺奉承者的俗语。"),
  q("003", 7, "拍马屁", "俗语", "俗语", "奉承俗语。"),
  q("003", 33, "刀切豆腐，面面俱光", "俗语", "俗语", "处处讨好的俗语。"),
  q("003", 35, "三角马屁学", "李敖", "格言", "李敖概括奉承术的短语。"),

  q("004", 3, "对别的家伙说来，是‘乒乓’；对我说来，只是‘乒’而已。", "漫画台词", "格言", "乒乓漫画中的自嘲式台词。"),
  q("004", 3, "It may be “PING PONG” for some folks …… but it's only “ping” to me.", "漫画台词", "格言", "源文所录英文台词。"),
  q("004", 5, "有眼不识泰山", "俗语", "俗语", "独立俗语。"),
  q("004", 5, "我这一拳多值钱啊！怎么可以用来打这些小子们。", "乔·路易斯轶事", "格言", "拳王轶事中的自重之语。"),
  q("004", 9, "风骨嶙峋", "成语化评语", "成语", "独立评语。"),

  q("005", 7, "比拟不伦", "古典语汇", "成语", "比喻不当的成语化短语。"),
  q("005", 7, "何代无之", "古典语汇", "古文", "古文式反问短句。"),
  q("005", 7, "内举不避", "古典语汇", "格言", "用人不避亲的古典化短句。"),

  q("009", 3, "独与天地精神往来", "庄子语汇", "古文", "庄子式精神境界语。"),
  q("009", 3, "不伦不类", "成语", "成语", "独立成语。"),
  q("009", 5, "不足为训", "成语", "成语", "独立成语。"),
  q("009", 11, "善与人同", "古典语汇", "格言", "与人为善的古典短语。"),
  q("009", 11, "今古奇观", "书名化成语", "成语", "独立成语。"),
  q("009", 11, "不亦宜乎", "古典语汇", "古文", "古文式结语。"),

  q("010", 3, "何前倨而后恭也？", "《战国策》苏秦故事", "古文", "苏秦故事名句。"),
  q("010", 3, "前倨后恭", "成语", "成语", "独立成语。"),
  q("010", 11, "前恭后倨", "李敖反用", "成语", "反转成语形成的短语。"),
  q("010", 3, "势利眼", "俗语", "俗语", "独立俗语。"),

  q("012", 1, "色厉内荏", "成语", "成语", "题名中的独立成语。"),

  q("013", 7, "一蟹不如一蟹", "俗语", "俗语", "民间俗语。"),
  q("013", 7, "没吃过猪肉，还看过猪走路", "俗语", "俗语", "民间俗语。"),
  q("013", 7, "沐猴而冠", "成语", "成语", "独立成语。"),
  q("013", 9, "澄清天下", "范滂典故", "典故", "范滂登车揽辔典故。"),
  q("013", 9, "登车揽辔，慨然有澄清天下之志", "《后汉书》范滂传", "古文", "范滂故事原句。"),
  q("013", 9, "言为世则，行为世范，登车揽辔，有澄清天下之志", "古典赞语", "古文", "源文所引完整赞语。"),
  q("013", 11, "越澄越不清", "李敖化用", "格言", "反讽澄清越多越乱的短语。"),

  q("014", 5, "掠人之美", "成语", "成语", "独立成语。"),
  q("014", 5, "尸人之功", "成语", "成语", "独立成语。"),
  q("014", 9, "生花妙舌", "成语化评语", "成语", "形容口才的短语。"),
  q("014", 11, "创业维艰，建校五年比继承事业五十年还要艰苦。", "李敖", "格言", "关于创业与继承的对比格言。"),
  q("014", 11, "前人种树，后人夺树而纳凉", "李敖化用俗语", "格言", "化用前人种树俗语的反讽句。"),

  q("017", 5, "生平惟服膺儒家所论士大夫出处进退辞受之道。人各有志，余亦惟秉素志而已。", "钱穆", "格言", "钱穆关于出处进退的自述。"),
  q("017", 9, "义利之辨", "儒家命题", "典故", "义利问题的经典命题。"),
  q("017", 9, "重义轻利", "成语", "成语", "独立成语。"),
  q("017", 9, "义利之辩", "李敖反用", "典故", "从义利之辨转成辩论之辩。"),

  q("018", 7, "欲渡黄河冰塞川，将登太行雪满山；停杯投箸不能食，拔剑四顾心茫然。", "李白诗句误引", "诗句", "源文指出这是误引，仍按源文保留被引用文本。"),
  q("018", 11, "断章取义", "成语", "成语", "独立成语。"),
  q("018", 11, "东拼西凑", "成语", "成语", "独立成语。"),
  q("018", 11, "投其所好", "成语", "成语", "独立成语。"),
  q("018", 13, "痛悼吾敌，痛悼吾友！", "文章题名", "格言", "题名式悼语。"),
  q("018", 15, "春蚕到死", "李商隐诗句", "诗句", "诗句节引。"),

  q("020", 3, "为者常成，行者常至。", "《晏子春秋》", "古文", "古籍格言。"),
  q("020", 5, "宁鸣而死，不默而生。", "范仲淹《灵乌赋》", "古文", "源文引范仲淹名句。"),
  q("020", 5, "其言可以立懦。", "《困学纪闻》", "古文", "源文引王应麟评语。"),
  q("020", 9, "张冠李戴", "成语", "成语", "源文用来概括误认出处的成语。"),

  q("021", 9, "掠先生之美，抱歉殊深。", "刘太希书信", "书信语", "致歉书信中的文言短句。"),
  q("021", 9, "负荆之意", "典故", "典故", "负荆请罪典故。"),
  q("021", 9, "一代英豪", "成语化评语", "成语", "人物赞语。"),
  q("021", 9, "闭门思过，了此余生", "书信语", "格言", "书信中的悔过短句。"),
  q("021", 11, "放他一马", "俗语", "俗语", "独立俗语。"),
  q("021", 11, "恰似你的温柔", "歌词题名", "文学典故", "流行歌曲题名化用。"),

  q("022", 15, "上苍天谴", "宗教俗语", "俗语", "天谴观念短语。"),
  q("022", 15, "用消天谴", "宗教俗语", "俗语", "源文所引宗教化短语。"),
  q("022", 15, "天打雷劈", "俗语", "俗语", "民间咒语式俗语。"),
  q("022", 15, "天诛地灭", "俗语", "俗语", "民间咒语式俗语。"),
  q("022", 15, "人模人样", "俗语", "俗语", "独立俗语。"),
  q("022", 15, "猪头猪脑", "俗语", "俗语", "独立俗语。"),

  q("024", 9, "古人匡章是一代大贤，但是风评却是不孝；陈平和直不疑都是一代名臣，但是风评却是盗嫂。", "李敖引古事", "格言", "以古人风评说明传闻不足凭。"),
  q("024", 9, "不凭证据，风评又算什么？", "李敖", "格言", "关于证据与风评的短句。"),

  q("025", 3, "我沿着街道走……为了一个衰老的乞丐，我停了脚步。", "屠格涅夫《乞丐》", "文学译文", "屠格涅夫散文诗译文节选。"),
  q("025", 3, "不要生气，老哥，我没有一点东西，老哥。", "屠格涅夫《乞丐》", "文学译文", "屠格涅夫散文诗译文节选。"),
  q("025", 3, "这算什么，老兄？", "屠格涅夫《乞丐》", "文学译文", "屠格涅夫散文诗译文节选。"),
  q("025", 3, "这也要谢谢你，这也是一件礼物，老兄。", "屠格涅夫《乞丐》", "文学译文", "屠格涅夫散文诗译文节选。"),
  q("025", 3, "我知道我也从这位老哥处得了点礼物。", "屠格涅夫《乞丐》", "文学译文", "屠格涅夫散文诗译文节选。"),
  q("025", 5, "不以财货为礼", "李敖概括", "格言", "从屠格涅夫故事概括出的礼物观。"),

  q("026", 15, "此公非昏之尤，但少可取，不会说英文，喜欢以外国粗俗女人做情妇。", "G. M. Trevelyan《英国史》译意", "史论译文", "源文译述乔治一世。"),
  q("026", 15, "George I , though not be worst, was perhaps the least generally attractive of monarchs. Unable to speak English, with blowsy foreign women for his mistresses……", "G. M. Trevelyan", "史论原文", "源文所录英文，保留原拼写。"),
  q("026", 15, "此公与妻口角，囚妻三十年。", "G. M. Trevelyan《英国史》译意", "史论译文", "源文译述乔治一世。"),
  q("026", 15, "He had quarreled with his wife, and kept her locked up for thirty years……", "G. M. Trevelyan", "史论原文", "源文所录英文。"),
  q("026", 15, "为人冷漠、吝啬、好色，一恶霸耳。", "Goldwin Smith 译意", "史论译文", "源文译述乔治一世。"),
  q("026", 15, "cold, stingy, sensual, and a bully", "Goldwin Smith", "史论原文", "源文所录英文短评。"),

  q("027", 7, "天地不仁，以万物为刍狗；圣人不仁，以百姓为刍狗。", "《老子》", "古文", "源文校正误引时引出的《老子》名句。"),

  q("028", 11, "顾盼自雄", "成语", "成语", "独立成语。"),
  q("028", 11, "何虑名雌哉？", "古典语汇", "古文", "源文引古人姓名议论中的反问。"),

  q("029", 3, "世上最严厉的惩罚，莫过于让一个人的愿望完全实现！", "希腊成语", "格言", "源文所引希腊成语。"),
  q("029", 3, "高处不胜寒", "苏轼词句", "诗句", "苏轼名句。"),
  q("029", 9, "信笔乱盖", "李敖", "俗语", "讽刺随手乱写的俗化短语。"),
  q("029", 11, "亚历山大死了，亚历山大埋了，亚历山大化为尘土，尘土和成泥，他既然变成泥，怎见得不可以用来塞啤酒桶呢？", "莎士比亚《哈姆雷特》译文", "文学译文", "源文所引哈姆雷特台词译文。"),
  q("029", 11, "Alexander died, Alexander was buried, Alexander returneth to dust; the dust is earth; of earth we make loam; and why of that loam whereto be was converted might they not stop a beer-barrel?", "Shakespeare, Hamlet", "文学原文", "源文所录英文，保留原拼写。"),
  q("029", 11, "死不瞑目", "成语", "成语", "独立成语。"),

  q("031", 25, "蔽于一曲，而闇于大理", "《荀子》", "古文", "源文引荀子语，批评见识偏狭。"),
  q("031", 25, "道……一隅不足以举之", "《荀子》", "古文", "源文引荀子语，保留其节引形式。"),
  q("031", 25, "曲知之人，关于道之一隅而未之能识", "《荀子》", "古文", "源文引荀子语。"),

  q("032", 13, "当我用一个字眼时候，它的意思就只是我要它表达的意思——既不多，也不少。", "Lewis Carroll《镜中世界》译文", "文学译文", " Humpty Dumpty 台词译文。"),
  q("032", 13, "When I use a word, it means just what I choose it to mean-neither more nor less.", "Lewis Carroll, Through the Looking-Glass", "文学原文", "源文所录英文台词。"),
  q("032", 13, "问题是，你不能拿字眼又当这个讲又当那个讲。", "Lewis Carroll《镜中世界》译文", "文学译文", "爱丽丝台词译文。"),
  q("032", 13, "问题是，谁说了算而已。", "Lewis Carroll《镜中世界》译文", "文学译文", " Humpty Dumpty 台词译文。"),
  q("032", 15, "当一名绅士的难处之一是，你不被允许粗暴的主张自己的权利。", "Samuel Butler 译文", "格言", "源文所引巴特勒绅士格言。"),
  q("032", 15, "One of the embarrassments of being a gentleman is that you are not permitted to be violent in asserting your rights.", "Samuel Butler", "格言", "源文所录英文。"),
  q("032", 21, "约定俗成", "《荀子》语汇", "成语", "荀子语源成语。"),

  q("033", 11, "目的正当，并非就是手段的正当", "李敖", "格言", "目的与手段辨析。"),
  q("033", 13, "正当的目的并不能使不正当的手段变成正当", "李敖", "格言", "目的与手段辨析。"),
  q("033", 15, "不正当的手段影响正当的目的", "李敖", "格言", "目的与手段辨析。"),
  q("033", 19, "所谓“为了目的，不择手段”是谬误的", "李敖", "格言", "目的与手段辨析。"),
  q("033", 21, "不要给我目的而不告以手段", "拉萨尔诗句译文", "诗句", "源文所引拉萨尔诗句译文。"),
  q("033", 23, "目的与手段是交织得不可分的。", "拉萨尔诗句译文", "诗句", "源文所引拉萨尔诗句译文。"),
  q("033", 25, "因而，这方面变了，那方面也要变", "拉萨尔诗句译文", "诗句", "源文所引拉萨尔诗句译文。"),
  q("033", 27, "不同的途径引你走到可见的不同的终点", "拉萨尔诗句译文", "诗句", "源文所引拉萨尔诗句译文。"),
  q("033", 33, "亚历山大大帝不肯夜袭敌人，理由是他要堂堂正正的赢取对方，不愿意窃取胜利。", "亚历山大轶事", "格言", "堂堂正正取胜的历史轶事。"),

  q("035", 23, "其争也君子", "《论语》", "古文", "孔子论君子之争。"),

  q("036", 25, "读圣贤书，所学何事", "古典俗语", "格言", "读书与行事相问的短句。"),
  q("036", 29, "入者主之，出者奴之。入者附之，出者污之。", "韩愈《原道》", "古文", "源文引韩愈语。"),
  q("036", 29, "后之人其欲闻仁义道德之说，孰从而听之？", "韩愈《原道》", "古文", "源文引韩愈语。"),
  q("036", 31, "君子绝交，进退有道", "李敖化用", "格言", "以君子绝交谈进退分寸。"),
  q("036", 45, "盗固不义，而跖非诛盗之人。", "古典语汇", "古文", "关于盗与诛盗资格的古文短句。"),
  q("036", 47, "行仁行义行己有耻", "儒家语汇", "格言", "仁义与知耻并举的短句。"),

  q("039", 3, "你为什么这么笨？", "木偶笑话", "格言", "木偶问答笑话。"),
  q("039", 3, "因为有人教我。", "木偶笑话", "格言", "木偶问答笑话。"),
  q("039", 11, "食言而肥", "成语", "成语", "独立成语。"),
  q("039", 11, "有理说不清", "俗语", "俗语", "独立俗语。"),

  q("040", 3, "先天下之忧而忧", "范仲淹《岳阳楼记》", "古文", "范仲淹名句节引。"),
  q("040", 3, "先天下之乐而乐", "李敖化用范仲淹", "格言", "反用范仲淹名句。"),
  q("040", 1, "官乐风飘处处闻", "李敖化用诗句", "诗文典故", "题名化用诗句。"),

  q("043", 13, "自知之明", "成语", "成语", "独立成语。"),

  q("044", 39, "当日出一语，不用今日泣也！", "《七修类稿》", "古文", "源文引明人笔记中的醒世短句。"),

  q("045", 9, "打太极拳", "俗语", "俗语", "推托拖延的俗语。"),
  q("045", 13, "拖刀计", "典故", "典故", "兵法与戏曲化典故。"),
  q("045", 13, "责无旁贷", "成语", "成语", "独立成语。"),
  q("045", 39, "新官场现形记", "李敖化用", "格言", "化用《官场现形记》的题名式短语。"),
];

const proofreadRejectQuoteTexts = new Set([
  "恰似我的温柔",
  "对事不对人",
  "无所遁形",
  "对人不对事",
  "另眼看待",
  "马屁精",
  "拍马屁",
  "三角马屁学",
  "何代无之",
  "不伦不类",
  "今古奇观",
  "不亦宜乎",
  "越澄越不清",
  "创业维艰，建校五年比继承事业五十年还要艰苦。",
  "东拼西凑",
  "投其所好",
  "痛悼吾敌，痛悼吾友！",
  "春蚕到死",
  "掠先生之美，抱歉殊深。",
  "一代英豪",
  "放他一马",
  "上苍天谴",
  "用消天谴",
  "人模人样",
  "猪头猪脑",
  "此公非昏之尤，但少可取，不会说英文，喜欢以外国粗俗女人做情妇。",
  "George I , though not be worst, was perhaps the least generally attractive of monarchs. Unable to speak English, with blowsy foreign women for his mistresses……",
  "此公与妻口角，囚妻三十年。",
  "He had quarreled with his wife, and kept her locked up for thirty years……",
  "为人冷漠、吝啬、好色，一恶霸耳。",
  "cold, stingy, sensual, and a bully",
  "信笔乱盖",
  "当一名绅士的难处之一是，你不被允许粗暴的主张自己的权利。",
  "One of the embarrassments of being a gentleman is that you are not permitted to be violent in asserting your rights.",
  "有理说不清",
  "官乐风飘处处闻",
  "自知之明",
  "打太极拳",
  "拖刀计",
  "责无旁贷",
  "新官场现形记",
]);

const missingRejects = [...proofreadRejectQuoteTexts].filter(
  (quoteText) => !rows.some((row) => row.quoteText === quoteText)
);
if (missingRejects.length) {
  throw new Error(`Proofread rejects not found in rows: ${missingRejects.join(" | ")}`);
}

const proofreadRejectedRows = rows.filter((row) => proofreadRejectQuoteTexts.has(row.quoteText));
const rowsAfterProofread = rows.filter((row) => !proofreadRejectQuoteTexts.has(row.quoteText));

const seen = new Set();
const selected = rowsAfterProofread.map((row, index) => {
  const key = normalize(row.quoteText);
  if (seen.has(key)) {
    throw new Error(`Duplicate quote: ${row.quoteText}`);
  }
  seen.add(key);

  const filePath = path.join(SOURCE_DIR, row.fileName);
  const text = readText(filePath);
  if (!normalize(text).includes(key)) {
    throw new Error(`Quote not found in ${row.fileName}: ${row.quoteText}`);
  }

  return {
    id: `${ID_PREFIX}-${String(index + 1).padStart(3, "0")}`,
    book: BOOK,
    chapter: row.chapter,
    source_file: path.relative(ROOT, filePath).replace(/\\/g, "/"),
    line_start: row.lineStart,
    line_end: row.lineEnd,
    quote_text: row.quoteText,
    category: row.category,
    source_or_origin: row.sourceOrOrigin,
    summary: row.note,
    notes: "",
  };
});

const politicalPattern =
  /(国家|中国|台湾|中华|台独|统一|独立|民主|自由|政府|政权|政治|政党|国民党|民进党|共产党|共匪|选举|候选|总统|宪法|革命|主义|意识形态|行政院|立法院|国会|党国|人权)/i;
const politicalHits = selected.filter((row) => politicalPattern.test(row.quote_text));
if (politicalHits.length) {
  throw new Error(
    `Political keyword hits in quote_text:\n${politicalHits
      .map((row) => `${row.id}\t${row.quote_text}`)
      .join("\n")}`
  );
}

fs.mkdirSync(path.dirname(OUTPUT_CSV), { recursive: true });
fs.mkdirSync(path.dirname(ANALYSIS_JSON), { recursive: true });

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

const csv = [columns.join(",")]
  .concat(selected.map((row) => columns.map((column) => csvEscape(row[column])).join(",")))
  .join("\n");
fs.writeFileSync(OUTPUT_CSV, `${csv}\n`, "utf8");

const txt = selected
  .map((row) => {
    return [
      `${row.id}｜${row.quote_text}`,
      `出处：${row.source_or_origin}；类别：${row.category}`,
      `位置：${row.book} / ${row.chapter} / ${row.line_start}-${row.line_end}`,
      `说明：${row.summary}`,
    ].join("\n");
  })
  .join("\n\n");
fs.writeFileSync(OUTPUT_TXT, `${txt}\n`, "utf8");

fs.writeFileSync(ANALYSIS_JSON, JSON.stringify(selected, null, 2), "utf8");
fs.writeFileSync(REJECTS_JSON, JSON.stringify(proofreadRejectedRows, null, 2), "utf8");

const report = {
  book: BOOK,
  sourceDir: SOURCE_DIR,
  sourceFileCount: fileNames.length,
  rawRows: rows.length,
  removedInProofread: proofreadRejectedRows.length,
  rows: selected.length,
  firstId: selected[0]?.id,
  lastId: selected[selected.length - 1]?.id,
  politicalQuoteTextHits: politicalHits.length,
  outputs: {
    csv: path.relative(ROOT, OUTPUT_CSV).replace(/\\/g, "/"),
    txt: path.relative(ROOT, OUTPUT_TXT).replace(/\\/g, "/"),
    json: path.relative(ROOT, ANALYSIS_JSON).replace(/\\/g, "/"),
    rejects: path.relative(ROOT, REJECTS_JSON).replace(/\\/g, "/"),
  },
};

fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), "utf8");

console.log(`book: ${BOOK}`);
console.log(`sourceFiles: ${fileNames.length}`);
console.log(`rawRows: ${rows.length}`);
console.log(`removedInProofread: ${proofreadRejectedRows.length}`);
console.log(`rows: ${selected.length}`);
console.log(`firstId: ${report.firstId}`);
console.log(`lastId: ${report.lastId}`);
console.log(`politicalQuoteTextHits: ${politicalHits.length}`);
console.log(`csv: ${report.outputs.csv}`);
console.log(`txt: ${report.outputs.txt}`);
