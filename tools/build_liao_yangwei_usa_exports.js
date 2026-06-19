const fs = require("fs");
const path = require("path");

const book = "阳痿美国";
const idPrefix = "LAYWUS";
const generatedDate = "2026-06-19";
const outDir = "exports";
const analysisDir = "analysis";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "004.小说剧本类",
  "005.阳痿美国",
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

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " / ").trim();
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
  row("001.扉幕——JOHN-JOHN开场白.txt", 7, 7, "挺纵不收", "中医古籍术语", "《薛己医按》", "说明 priapism 时引用中医古籍中的病名术语。"),
  row("001.扉幕——JOHN-JOHN开场白.txt", 9, 9, "强阳不倒", "中医古籍术语", "陈士铎《石室秘录》", "接《薛己医按》术语，列出《石室秘录》中的白话化说法。"),
  row("001.扉幕——JOHN-JOHN开场白.txt", 11, 11, "阴茎坚长而精自出也", "中医古籍解释", "中医关于“强中”的解释", "辨析强中与阴茎异常勃起时引古医书语。"),
  row("001.扉幕——JOHN-JOHN开场白.txt", 11, 11, "常发虚阳，不交精出", "中医古籍解释", "中医关于“强中”的解释", "继续解释强中的古医书用语。"),
  lineRow("001.扉幕——JOHN-JOHN开场白.txt", 31, 33, "译诗", "李敖译 William Blake《Auguries of Innocence》诗句", "开场以布莱克诗句引出最后审判意象。"),
  lineRow("001.扉幕——JOHN-JOHN开场白.txt", 35, 37, "英文诗句", "William Blake《Auguries of Innocence》", "同一布莱克诗句的英文原文。"),

  row("002.序幕——最后审判.txt", 47, 47, "I shall never believe that God plays dice with the world.我绝不相信上帝会对世人掷骰子。", "科学格言", "Albert Einstein 语意", "借“上帝不掷骰子”语意回应最后审判的宗教场景。"),
  lineRow("002.序幕——最后审判.txt", 83, 87, "基督教信条", "We Believe in Divine Judgment", "摘出关于上帝创造与审判的英文信条。"),
  row("002.序幕——最后审判.txt", 167, 167, "死后有报，纤毫受之", "佛教语", "佛教因果报应语", "说明佛教也有死后审判观念时引用。"),
  row("002.序幕——最后审判.txt", 167, 167, "莫轻小恶，以为无罪", "佛教劝诫语", "佛教因果劝诫语", "说明小恶亦会受审判时引用。"),
  lineRow("002.序幕——最后审判.txt", 201, 201, "圣经引文", "《新约·启示录》第20章11-13节", "上帝李背诵启示录白色大宝座审判段落。"),
  row("002.序幕——最后审判.txt", 215, 215, "父不审判人，却已经把审判的权柄完全交给子。", "圣经引文", "《约翰福音》第5章第22节", "解释审判权柄交给子的经文。"),
  row("002.序幕——最后审判.txt", 215, 215, "The Father judges no one，but has given all judgment to the Son.", "圣经英译", "John 5:22", "同一《约翰福音》经文英译。"),
  row("002.序幕——最后审判.txt", 219, 219, "约翰不敢看坐在上面的，所以无从描述。", "宗教注释", "周联华牧师解释《启示录》", "引用周联华牧师对启示录宝座上那位不可描述的解释。", "校对补入：宗教注释，不属政治语录。"),

  row("003.第1幕——审判华盛顿.txt", 125, 125, "皇帝轮流做，今年到我家", "古典小说俗语", "《西游记》孙悟空语", "借孙悟空名句说明轮值上帝的戏剧设定。"),
  row("003.第1幕——审判华盛顿.txt", 155, 155, "Je me presse de rire de tout，de peur d'être obligé d'en pleurer.", "法文名言", "Beaumarchais 语", "用博马舍名言说明“快笑以防哭”。"),
  row("003.第1幕——审判华盛顿.txt", 155, 155, "I quickly laugh at everything，for fear of having to cry.", "英文译句", "Beaumarchais 语英译", "同一博马舍名言的英文译句。"),
  row("003.第1幕——审判华盛顿.txt", 155, 155, "快笑以防哭", "译语格言", "Beaumarchais 语中译", "李敖概括博马舍名言的中文译法。"),
  row("003.第1幕——审判华盛顿.txt", 205, 205, "Father，I cannot tell a lie，I did it with my little hatchet", "文学轶事引文", "Mark Twain “Mark Twain as George Washington”", "考证华盛顿砍樱桃树传说时列出马克吐温版本。"),
  row("003.第1幕——审判华盛顿.txt", 205, 205, "I can't tell a lie，Pa；you know I can't tell a lie. I did cut it with my hatchet", "传记轶事引文", "M. L. Weems《Life of George Washington》", "列出威姆斯传记中砍樱桃树故事的版本。"),
  row("003.第1幕——审判华盛顿.txt", 213, 213, "当事实在你一边，辩论事实；当法律在你一边，辩论法律；两者都不在你一边，就大呼小叫。", "律师谚语", "田纳西州律师名言", "以律师谚语形容辩论策略。"),
  row("003.第1幕——审判华盛顿.txt", 213, 213, "When you have the facts on your side，argue the facts. When you have the law on your side，argue the law. When you have neither，holler.", "英文法律谚语", "Tennessee lawyer saying", "同一律师谚语英文原文。"),
  row("003.第1幕——审判华盛顿.txt", 265, 265, "你可以欺骗所有人于暂时，你可以欺骗少数人于永久，但你不能欺骗所有人于永久", "英文格言译文", "You can fool all the people some of the time...", "补收一条一般性欺骗格言；虽托名林肯，但非总统政策、演说或政治口号。", "校对补入；保留为一般格言。"),
  row("003.第1幕——审判华盛顿.txt", 265, 265, "You can fool all the people some of the time，and some of the people all the time，but you cannot fool all the people all of the time.", "英文格言", "常见托名 Lincoln 的格言", "同一欺骗格言的英文原文。", "校对补入；保留为一般格言。"),
  row("003.第1幕——审判华盛顿.txt", 295, 295, "Et maiores vestros et posteros cogitate.", "拉丁文古典引文", "Tacitus《Agricola》", "指出小亚当斯演说句可溯源至塔西佗。"),
  row("003.第1幕——审判华盛顿.txt", 295, 295, "Think of your forefathers and posterity.", "古典引文英译", "Tacitus《Agricola》英译", "同一塔西佗句子的英译。"),
  row("003.第1幕——审判华盛顿.txt", 295, 295, "想想你们的前辈和后代。", "古典引文中译", "Tacitus《Agricola》中译", "同一塔西佗句子的中文译法。"),

  row("004.第2幕——审判亚当斯.txt", 15, 15, "猫也可以一视国王", "英文谚语译文", "A cat may look at a king", "亚当斯以英谚说明卑微者也可直视权威。"),
  row("004.第2幕——审判亚当斯.txt", 15, 15, "A cat may look at a king.", "英文谚语", "English proverb", "同一英谚原文。"),
  row("004.第2幕——审判亚当斯.txt", 17, 17, "A cat may look at a Chinese God.", "改写英谚", "李敖化用 A cat may look at a king", "把英谚改写进中国上帝的戏剧场景。"),

  row("010.第8幕——审判范布伦.txt", 63, 63, "我觉得很难为情，你教育我们的青年人，而我们却盗印你的书。有朝一日，我们会有比较完善的法律，也许你们会采用我们的法律。", "书信引文", "R. W. Emerson 致 Thomas Carlyle 信", "引用爱默生谈美国盗印英书时的歉意。"),
  row("010.第8幕——审判范布伦.txt", 63, 63, "总该先给人家一点输入英国原版的时间。", "书信引文", "R. W. Emerson 致 Thomas Carlyle 信", "补收爱默生同信中谈暂缓盗印的句子。", "校对补入：版权书信语境，不属政治语录。"),
  row("010.第8幕——审判范布伦.txt", 63, 63, "大哥莫话小弟", "中国俗语", "传统俗语", "用来说明英国与美国在盗印问题上前科相似的俗语。", "校对补入。"),
  row("010.第8幕——审判范布伦.txt", 75, 75, "You have undertaken to cheat me. I won't sue you, for the law is too slow. I'll ruin you.", "企业家轶事名言", "Cornelius Vanderbilt 语", "引用范得比尔特关于法律太慢的强硬名言。"),
  row("010.第8幕——审判范布伦.txt", 75, 75, "你耍老子，老子不告你，打官司太慢了，老子做掉你。", "译语", "李敖译 Cornelius Vanderbilt 语", "同一范得比尔特名言的中文译意。"),

  row("012.第10幕——审判泰勒.txt", 65, 65, "They have sown the wind, and they shall reap the whirlwind.", "圣经引文", "《何西阿书》8:7", "用圣经语形容恶行招致更大后果。"),
  row("012.第10幕——审判泰勒.txt", 65, 65, "作恶之报，果大于因。", "圣经译意", "李敖译《何西阿书》8:7语意", "同一句圣经语的中文概括。"),

  row("018.第16幕——审判林肯.txt", 17, 17, "There are cases of praise which could not be expected, and of reproach when the parties have been seeking to be perfect.", "孟子英译", "《孟子》“有不虞之誉，有求全之毁”英译", "用孟子语说明林肯身后的赞毁。"),
  row("018.第16幕——审判林肯.txt", 17, 17, "有不虞之誉，有求全之毁", "孟子名句", "《孟子》", "同一句孟子原文。"),

  lineRow("020.第18幕——审判格兰特.txt", 89, 89, "文学引文", "Mark Twain《The Adventures of Tom Sawyer》", "引用汤姆索亚粉刷墙壁故事中关于工作与游戏的结论。"),

  row("026.第24幕——审判麦金莱.txt", 45, 45, "吃人不吐骨头", "中国俗语", "传统俗语", "形容侵夺彻底时引用。"),

  row("027.第25幕——审判老罗斯福.txt", 85, 85, "每个婚礼中的新娘，每个丧礼中的死者", "英文俗语译文", "the bride at every wedding, the corpse at every funeral", "用俗语形容总想成为焦点的人。"),
  row("027.第25幕——审判老罗斯福.txt", 85, 85, "the bride at every wedding，the corpse at every funeral", "英文俗语", "English saying", "同一俗语英文原文。"),

  row("035.第33幕——审判艾森豪威尔.txt", 131, 131, "道高一尺，魔高一丈", "中国古话", "传统成语/俗语", "讨论攻防升级时引用古话。"),
  row("035.第33幕——审判艾森豪威尔.txt", 131, 131, "The law is strong，but the outlaws are ten times stronger", "谚语英译", "“道高一尺，魔高一丈”英译", "同一句古话的英文译意。"),
  row("035.第33幕——审判艾森豪威尔.txt", 131, 131, "死猪不怕开水烫", "中国俗语", "传统俗语", "说明极端弱势者已无可再惧时引用。"),
  row("035.第33幕——审判艾森豪威尔.txt", 131, 131, "以小击大", "成语", "传统成语", "列举不对称对抗相关成语。"),
  row("035.第33幕——审判艾森豪威尔.txt", 131, 131, "以弱击强", "成语", "传统成语", "列举不对称对抗相关成语。"),
  row("035.第33幕——审判艾森豪威尔.txt", 131, 131, "以逸待劳", "成语", "传统成语", "列举不对称对抗相关成语。"),
  row("035.第33幕——审判艾森豪威尔.txt", 131, 131, "以不变应万变", "成语", "传统成语", "列举不对称对抗相关成语。"),

  row("038.第36幕——审判尼克松.txt", 151, 151, "债多不愁", "中国俗语", "传统俗语", "谈长期逆差时引用俗语。"),

  row("042.第40幕——审判老布什.txt", 155, 155, "If you pick us, do we not bleed ？If you tickle us ,do we not laugh？If you poison us, do we not die？ And if you wrong us , shall we not revenge？", "莎士比亚引文", "Shakespeare《The Merchant of Venice》Shylock 台词", "引用夏洛克台词说明被伤害者也有同样人性。"),
  row("042.第40幕——审判老布什.txt", 155, 155, "你若刺我们一下，我们能不流血吗？你若搔我们的痒，我们能不笑吗？你若朝我们下毒，我们能不死吗？你若欺负我们，我们能不报仇吗？", "译文", "李敖译 Shakespeare 夏洛克台词", "同一莎士比亚台词的中文译意。"),

  row("043.第41幕——审判克林顿.txt", 127, 127, "Life is like a box of chocolates. You never know what you're gonna get.", "电影台词", "《Forrest Gump》", "引《阿甘正传》台词说明不确定性。"),
  row("043.第41幕——审判克林顿.txt", 161, 161, "America is a country of young men.", "文学人物语", "R. W. Emerson 语", "引用爱默生关于美国年轻性的说法。"),

  row("044.第42幕——审判小布什.txt", 49, 49, "Caesar is above grammar.", "历史轶语", "Frederick the Great 与 Voltaire 相关轶语", "以“恺撒凌驾文法”嘲讽文法错误。"),
  row("044.第42幕——审判小布什.txt", 49, 49, "恺撒凌驾文法之上。", "译文", "李敖译 Caesar is above grammar", "同一历史轶语的中文译法。"),
  row("044.第42幕——审判小布什.txt", 283, 283, "你来攻击我，是靠着刀枪和铜戟。我来攻击你，是靠着万军之耶和华的名……耶和华使人得胜，不是用刀用枪。", "圣经引文", "《旧约·撒母耳记》戴维与歌利亚故事", "引用戴维对歌利亚的话说明强弱悬殊下的取胜叙事。"),
  row("044.第42幕——审判小布什.txt", 443, 443, "视死如归", "成语", "传统成语", "形容不惧死亡时引用。"),
  row("044.第42幕——审判小布什.txt", 443, 443, "face death as a home coming", "成语英译", "“视死如归”英译", "同一成语的英文译意。"),
  row("044.第42幕——审判小布什.txt", 443, 443, "汤誓曰：‘时日害丧？予及女（汝）偕亡。’", "古典引文", "《尚书·汤誓》", "引用汤誓中与日同亡的古典句。"),
  row("044.第42幕——审判小布什.txt", 443, 443, "O sun，when wilt thou expire？We will die together with thee.", "古典引文英译", "《尚书·汤誓》英译", "同一汤誓句的英文译法。"),
  row("044.第42幕——审判小布什.txt", 543, 543, "一朝被蛇咬，十年怕井绳。", "中国谚语", "传统谚语", "说明受惊后长期恐惧时引用。"),
  row("044.第42幕——审判小布什.txt", 543, 543, "杯弓蛇影", "成语典故", "传统成语", "同段中用来形容疑惧过度。"),
  row("044.第42幕——审判小布什.txt", 589, 589, "In contemporary Christian theology there is a growing tendency to describe hell as a state rather than a place.", "神学引文", "当代基督教神学说法", "说明地狱作为状态而非处所的神学解释。"),
  row("044.第42幕——审判小布什.txt", 589, 589, "当代基督教神学逐渐认为地狱是一种状态而非处所。", "译文", "李敖译当代基督教神学说法", "同一神学引文的中文译意。"),
  row("044.第42幕——审判小布什.txt", 595, 595, "地狱即自身", "哲学译语", "T. S. Eliot 语意", "尾声前以艾略特地狱观作对照。"),
  row("044.第42幕——审判小布什.txt", 595, 595, "Hell is oneself.", "哲学引文", "T. S. Eliot 语意", "同一艾略特地狱观英文。"),
  row("044.第42幕——审判小布什.txt", 595, 595, "地狱即他人", "哲学译语", "Jean-Paul Sartre《Huis clos》语意", "引用萨特名句作对照。"),
  row("044.第42幕——审判小布什.txt", 595, 595, "L'Enfer，c'est les Autres. Hell is other people.", "哲学引文", "Jean-Paul Sartre《Huis clos》", "同一萨特名句的法文与英文。"),

  lineRow("045.第43幕——审判奥巴马.txt", 47, 47, "圣经引文", "《新约·启示录》第20章", "终幕前再次引用白色大宝座审判段落。"),

  lineRow("046.尾幕——JOHN-JOHN收尾.txt", 11, 25, "英文诗句", "William Blake《The Last Judgement》", "尾幕引用布莱克长诗《最后审判》的最后八行。"),
  lineRow("046.尾幕——JOHN-JOHN收尾.txt", 27, 35, "译诗", "李敖译 William Blake《The Last Judgement》", "同一布莱克诗段的中文译文。"),
];

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

const rows = data.map((record, index) => ({
  ...record,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

fs.mkdirSync(path.join(process.cwd(), outDir), { recursive: true });
fs.mkdirSync(path.join(process.cwd(), analysisDir), { recursive: true });

const csvLines = [
  columns.join(","),
  ...rows.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
];

const csvPath = path.join(process.cwd(), outDir, "阳痿美国_诗文格言歌谣引用.csv");
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push("《阳痿美国》诗文格言歌谣引用");
txt.push(`生成日期：${generatedDate}`);
txt.push(`总计：${rows.length} 条`);
txt.push("筛选说明：本轮剔除美国总统演说、竞选口号、外交/军事政策语句、现代政论语录；保留诗歌、宗教经典、文学引文、古典名句、成语谚语及非政治性格言。");
txt.push("");

let currentChapter = "";
for (const record of rows) {
  if (record.chapter !== currentChapter) {
    currentChapter = record.chapter;
    txt.push(`## ${currentChapter}`);
  }
  txt.push(`${record.id}｜${record.category}｜${record.source_file}:${record.line_start}-${record.line_end}`);
  txt.push(`引用：${record.quote_text}`);
  txt.push(`出处线索：${record.source_or_origin}`);
  txt.push(`摘要：${record.summary}`);
  if (record.notes) txt.push(`备注：${record.notes}`);
  txt.push("");
}

const txtPath = path.join(process.cwd(), outDir, "阳痿美国_诗文格言歌谣引用.txt");
fs.writeFileSync(txtPath, `\uFEFF${txt.join("\r\n")}\r\n`, "utf8");

const report = [];
report.push("《阳痿美国》第一轮筛选报告");
report.push(`生成日期：${generatedDate}`);
report.push(`候选辅助表：analysis/liao_yangwei_usa_quote_candidates.json 等`);
report.push(`保留条目：${rows.length}`);
report.push("");
report.push("保留范围：布莱克诗句、圣经/神学/佛教语、孟子/尚书/塔西佗等古典句、莎士比亚/马克吐温/爱默生等文学引文、传统成语谚语。");
report.push("剔除范围：总统演说、独立宣言/门罗主义/国情咨文等政治文本、竞选口号、外交军事政策语句、现代军政人物政治语录、战争宣传或反战政论句。");
report.push("");
report.push("高频剔除例：My Country, right or wrong；拉法耶特，我们来了；With malice toward none；门罗主义句；罗斯福巨棒政策句；斯大林/拉姆斯菲尔德/布什等现代政治与军事语录。");

const reportPath = path.join(process.cwd(), analysisDir, "liao_yangwei_usa_initial_report.txt");
fs.writeFileSync(reportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");

const proofreadAuditRows = [
  [
    "add",
    "002.序幕——最后审判.txt",
    "219",
    "约翰不敢看坐在上面的，所以无从描述。",
    "补收周联华牧师解释《启示录》的宗教注释，非政治语录。",
  ],
  [
    "add",
    "003.第1幕——审判华盛顿.txt",
    "265",
    "你可以欺骗所有人于暂时，你可以欺骗少数人于永久，但你不能欺骗所有人于永久",
    "补收一般性欺骗格言；不作为总统政策或政治演说收录。",
  ],
  [
    "add",
    "003.第1幕——审判华盛顿.txt",
    "265",
    "You can fool all the people some of the time，and some of the people all the time，but you cannot fool all the people all of the time.",
    "补收同一句格言英文原文。",
  ],
  [
    "add",
    "010.第8幕——审判范布伦.txt",
    "63",
    "总该先给人家一点输入英国原版的时间。",
    "补收爱默生致卡莱尔信中的非政治书信引文。",
  ],
  [
    "add",
    "010.第8幕——审判范布伦.txt",
    "63",
    "大哥莫话小弟",
    "补收同段俗语。",
  ],
  [
    "keep",
    "010.第8幕——审判范布伦.txt",
    "75",
    "You have undertaken to cheat me. I won't sue you, for the law is too slow. I'll ruin you.",
    "范得比尔特企业家轶事语，非总统/政策/党派政治语录，校对后保留。",
  ],
  [
    "keep",
    "043.第41幕——审判克林顿.txt",
    "161",
    "America is a country of young men.",
    "爱默生文学人物语；虽谈美国但不是政策、演说或政治口号，校对后保留。",
  ],
  [
    "exclude",
    "003.第1幕——审判华盛顿.txt",
    "305",
    "拉法耶特，我们来了！",
    "军政献词/战争政治名言，继续排除。",
  ],
  [
    "exclude",
    "020.第18幕——审判格兰特.txt",
    "33",
    "连乌鸦飞过天空，都得自备干粮",
    "内战军政语境过重，校对轮不补。",
  ],
  [
    "exclude",
    "027.第25幕——审判老罗斯福.txt",
    "89",
    "Speak softly and carry a big stick, you will go far.",
    "大棒政策相关政治语录，继续排除。",
  ],
  [
    "exclude",
    "031.第29幕——审判柯立芝.txt",
    "41",
    "The chief business of the American people is business.",
    "总统经济/政治名言，继续排除。",
  ],
  [
    "exclude",
    "036.第34幕——审判肯尼迪.txt",
    "115",
    "Let us never negotiate out of fear. But let us never fear to negotiate.",
    "总统演说名言，继续排除。",
  ],
  [
    "exclude",
    "044.第42幕——审判小布什.txt",
    "519",
    "每当国会议员闹个笑话，就出来一条法律；每当一条法律出来，国会议员就闹个笑话。",
    "国会/法律政治讽刺语，继续排除。",
  ],
];

const proofreadAuditPath = path.join(
  process.cwd(),
  analysisDir,
  "liao_yangwei_usa_proofread_audit.tsv",
);
const proofreadAuditText = [
  ["decision", "source_file", "line", "text", "reason"].join("\t"),
  ...proofreadAuditRows.map((cells) => cells.map(tsvEscape).join("\t")),
].join("\r\n");
fs.writeFileSync(proofreadAuditPath, `\uFEFF${proofreadAuditText}\r\n`, "utf8");

const proofreadReport = [];
proofreadReport.push("《阳痿美国》校对轮报告");
proofreadReport.push(`生成日期：${generatedDate}`);
proofreadReport.push("校对前：68 条");
proofreadReport.push("本轮补入：5 条");
proofreadReport.push("本轮删除：0 条");
proofreadReport.push(`校对后：${rows.length} 条`);
proofreadReport.push("");
proofreadReport.push("补入内容：周联华牧师解释《启示录》1条；一般性欺骗格言中英2条；爱默生书信漏句1条；传统俗语1条。");
proofreadReport.push("保留确认：范得比尔特企业家轶事语、爱默生“America is a country of young men.”等虽有现代人物来源，但不属于总统演说、政策语言或政治口号。");
proofreadReport.push("继续排除：总统/将军/国会/战争与政策相关语录，例如“拉法耶特，我们来了”、大棒政策句、柯立芝商业名言、肯尼迪谈判演说、威尔·罗吉斯国会笑话等。");

const proofreadReportPath = path.join(
  process.cwd(),
  analysisDir,
  "liao_yangwei_usa_proofread_report.txt",
);
fs.writeFileSync(proofreadReportPath, `\uFEFF${proofreadReport.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      rows: rows.length,
      csvPath,
      txtPath,
      reportPath,
      proofreadAuditPath,
      proofreadReportPath,
    },
    null,
    2,
  ),
);
