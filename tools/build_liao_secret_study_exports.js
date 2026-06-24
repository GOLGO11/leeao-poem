const fs = require("fs");
const path = require("path");

const book = "李敖秘密书房";
const idPrefix = "LASS";
const generatedDate = "2026-06-24";
const sourceDir = path.join("《大李敖全集6.0》分章节", "010.节目演讲类", "003.李敖秘密书房");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_secret_study_quote_candidates.json");
const reviewTsv = path.join("analysis", "liao_secret_study_review_candidates.tsv");
const auditTsv = path.join("analysis", "liao_secret_study_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_secret_study_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_secret_study_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_secret_study_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => /^\d{3}\..+\.txt$/.test(name))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceCache = new Map();
for (const file of files) {
  const fullPath = path.join(sourceDir, file);
  const text = sourceDecoder.decode(fs.readFileSync(fullPath));
  sourceCache.set(file, {
    text,
    lines: text.split(/\r?\n/),
  });
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
    .replace(/[“”‘’"']/g, "")
    .replace(/\s+/g, "");
}

function q(filePrefix, lineStart, quoteText, category, attributedTo, note, lineEnd = lineStart) {
  const file = sourceFile(filePrefix);
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
    summary: note,
    notes: "首轮保守收入：节目文字稿与选战访谈噪声较密，仅取可独立成立的诗文、格言、成语俗语和经典文句。",
  };
}

const rawRows = [
  q("003.", 3, "独与天地精神往来", "古典名句", "庄子语意", "李敖以庄子语形容秘密书房里的精神境界。"),
  q("006.", 5, "书中自有颜如玉，书中自有黄金屋", "劝学俗语", "宋真宗《励学篇》俗传", "李敖谈书中世界时引用传统劝学俗语。"),
  q("006.", 5, "以其有辨也", "古典名句", "《荀子》语", "李敖引用荀子说明人有辨别能力。"),
  q("007.", 19, "开万古得未曾有之奇，洪荒留此山川，作遗民世界", "联语", "沈葆桢题郑成功祠联", "沈葆桢郑成功祠联上联。"),
  q("007.", 19, "极一生无可如何之遇，缺憾还诸天地，是创格完人", "联语", "沈葆桢题郑成功祠联", "沈葆桢郑成功祠联下联。"),
  q("009.", 5, "是家豪逸生有种", "集句联", "苏轼诗句", "郑孝胥书联中的苏轼诗句。"),
  q("009.", 5, "老来忠义气横秋", "集句联", "黄庭坚诗句", "郑孝胥书联中的黄庭坚诗句。"),
  q("014.", 11, "丘祷之久矣", "古典名句", "《论语·述而》", "李敖谈孔子对祷告与鬼神的态度。"),
  q("014.", 11, "敬神如神在", "古典名句", "《论语》语意", "源文作“敬神如神在”，用于说明信仰心理。"),
  q("014.", 11, "敬鬼神而远之", "古典名句", "《论语·雍也》", "孔子谈鬼神态度的名句。"),
  q("014.", 11, "未知生，焉知死", "古典名句", "《论语·先进》", "孔子关于生死问题的名句。"),
  q("014.", 15, "产男则相贺，产女则杀之", "古文名句", "《韩非子》", "李敖引用韩非子说明古代重男轻女。"),
  q("014.", 15, "如果有上帝的话，上帝是个顽童", "西方科学家格言", "爱因斯坦语意", "李敖转述爱因斯坦关于上帝的说法。"),
  q("014.", 21, "我们是靠信心走路，不是靠眼睛走路", "圣经文句", "《新旧约全书》", "李敖引用圣经文句说明信仰与事实的关系。"),
  q("014.", 21, "我是基督教徒，我是天主教徒，我是回教徒，我是佛教徒，我是印度教徒", "宗教格言", "甘地语", "李敖转引甘地概括各种宗教身份的说法。"),
  q("016.", 9, "举国若狂欲语谁", "诗句", "梁启超诗句", "李敖引用梁启超诗句描写全社会疯狂。"),
  q("016.", 9, "凿井而饮，耕田而食，帝力于我何有哉？", "古歌谣", "《击壤歌》", "李敖引用古歌谣说明百姓生活与权力疏离。"),
  q("017.", 17, "不畏浮云遮望眼，自缘身在最高层", "诗句", "王安石《登飞来峰》", "李敖借王安石诗句自况。"),
  q("018.", 11, "鸣鼓而攻之", "古典成语", "《论语·先进》", "李敖借孔子语说明圣人也有强烈情绪。"),
  q("018.", 13, "如果我是你丈夫，我就喝这杯毒药", "西方幽默格言", "丘吉尔语", "李敖引用丘吉尔机智答语说明刻薄语言的力量。"),
  q("019.", 11, "你也参加，布鲁塔斯", "西方戏剧译句", "莎士比亚《凯撒》梁实秋译意", "李敖讨论梁实秋翻译凯撒临终语。"),
  q("019.", 11, "还有你！布鲁塔斯！", "西方戏剧译句", "莎士比亚《凯撒》李敖译意", "李敖提出他认为更贴近情境的译法。"),
  q("023.", 15, "爱情的代价是痛苦，爱情的方法是忍受痛苦", "现代文人格言", "胡适语", "胡适谈爱情代价的语句。"),
  q("025.", 15, "不是怕风吹雨打，不是羡烛照香熏", "诗句", "胡适改写范成大《瓶花诗》", "胡适写给陆小曼的瓶花诗句。"),
  q("025.", 15, "只喜欢那折花的人，高兴和伊亲近", "诗句", "胡适改写范成大《瓶花诗》", "胡适瓶花诗中表达亲近所爱之人的句子。"),
  q("025.", 15, "花瓣儿纷纷落了，劳伊亲手收存", "诗句", "胡适改写范成大《瓶花诗》", "胡适瓶花诗中的落花句。"),
  q("025.", 15, "当一封没有字的书信", "诗句", "胡适改写范成大《瓶花诗》", "胡适瓶花诗中以花瓣为无字书信的句子。"),
  q("026.", 5, "有意栽花花不发，无心插柳柳成荫", "俗语", "中国俗语", "胡适向李敖谈到的传统俗语。"),
  q("026.", 5, "无心插柳，尚且成荫；有意栽花，当然要发", "现代文人格言", "胡适改写俗语", "胡适把传统俗语改写为有为人生观。"),
  q("026.", 13, "死生有命，富贵在天", "古典名句", "《论语·颜渊》", "李敖谈孔孟命运观时引用。"),
  q("026.", 13, "舜何人也，予何人也，有为者亦若是", "古典名句", "《孟子·滕文公上》", "李敖借孟子语说明圣人可由努力而成。"),
  q("026.", 13, "为者常成，行者常至", "古典名句", "《晏子春秋》", "胡适常写的《晏子春秋》句。"),
  q("028.", 17, "乍可刺你眼，不可隐我毛", "文人题句", "胡适题语", "李敖引用胡适写字中的风趣题句。"),
  q("028.", 17, "买米要买一斩白，连双要连好角色。十字街头背锁链，旁人取笑也抵得", "民歌/山歌", "桂林山歌", "胡适书写给张隆延的桂林山歌。"),
  q("032.", 5, "种桑长江边，三年望当采。枝条始欲茂，忽值山河改。柯叶自摧折，根株浮沧海。本不植高原，今日复何悔！", "诗", "陶渊明《拟古九首》其九", "胡适书陶渊明诗以自况。"),
  q("033.", 9, "青山常在，绿水长流。他年相见，后会有期", "赠别套语", "查良鉴语", "查良鉴谢师宴上的赠别语。"),
  q("034.", 11, "叫我如何不想她", "歌词/歌名", "刘半农词", "李敖谈刘半农名曲。"),
  q("045.", 9, "各抱地势，勾心斗角", "赋句", "杜牧《阿房宫赋》", "李敖解释“勾心斗角”原为建筑描写，源文作“勾”。"),
  q("054.", 15, "鲁仲连强作之者，非体自然也", "古文名句", "魏安釐王评鲁仲连语", "李敖讨论真伪与强作时引用。"),
  q("054.", 15, "人皆作之，作之不止，乃成君子。作之不变，习与体成，体成则自然也", "古文名句", "孔子六世孙语", "李敖借古文说明习惯与自然的转化。"),
  q("054.", 17, "周公恐惧流言日，王莽谦躬下士时", "诗句", "白居易《放言》", "李敖引用白居易诗说明真伪难辨。"),
  q("054.", 17, "设使当时身便死，一生真伪有谁知？", "诗句", "白居易《放言》", "李敖引用白居易诗说明真伪难辨。"),
  q("067.", 151, "曲有误，周郎顾", "古典典故", "周瑜顾曲典故", "李敖以周郎顾曲说明真正会听戏。"),
  q("068.", 23, "天下亦知美之为美", "古典名句", "《老子》", "李敖谈美人标准时引用老子语。"),
  q("081.", 3, "上帝给女人一张脸，女人自己另外造了一张", "西方谚语", "外国谚语", "李敖谈整形与化妆时引用的西方谚语。"),
  q("085.", 265, "我最喜欢一个人在研究的时候那种孤独的愉悦", "西方科学家格言", "爱因斯坦语意", "李敖谈观星与独处研究时转述爱因斯坦。"),
  q("090.", 65, "小和尚念经有口无心", "俗语", "中国俗语", "李敖批评速读时引用俗语。"),
  q("104.", 43, "马上得天下，不能够马上治天下", "史传名句", "陆贾劝刘邦语意", "李敖借汉初故事说明治天下需要制度与团队。"),
  q("105.", 11, "挂帆沧海，风波茫茫，或沦无底，或达仙乡", "西方诗句", "丁尼生诗句/严复《天演论》译文", "李敖引用严复译丁尼生诗句。"),
  q("105.", 153, "为善若登，为恶若崩", "古典成语", "中国古话", "李敖引用古话说明为善难、为恶易。"),
  q("105.", 153, "人上天堂是慢的，下地狱是快的", "西方文学格言", "弥尔顿《失乐园》语意", "李敖转述弥尔顿关于天堂地狱的句子。"),
  q("109.", 13, "以贼捉贼", "西方谚语", "外国古话", "李敖引用外国古话说明同类识同类。"),
  q("114.", 5, "靖康耻，犹未雪。臣子恨，何时灭", "词句", "岳飞《满江红》", "李敖讲北京法源寺相关历史时引用岳飞词。"),
  q("117.", 11, "梦里不知身是客", "词句", "李煜《浪淘沙令》", "李敖谈李翰祥回大陆时引用李后主词。"),
  q("117.", 11, "少小离家老大回，乡音无改鬓毛衰。儿童相见不相识，笑问客从何处来", "诗句", "贺知章《回乡偶书》", "李敖谈灯谜误用时引用贺知章诗。"),
  q("125.", 19, "杀君马者道旁儿", "古典名句", "孔子相关古话", "李敖借古话说明捧场者可能害人。"),
  q("132.", 265, "己所不欲，勿施于人", "古典名句", "《论语》", "李敖谈文字不可替代时引用孔子名句。"),
];

const proofreadBeforeRows = 60;
const proofreadRemovedRows = [
  ["LASS-001", "画山水，他画不过张三；画花鸟，他画不过李四；可是讲到收藏的鉴定，艺术品的鉴定，没有人能够跟他比。", "张大千自我评价，属于节目叙事中的现代人物评语，离“诗文格言”边界较远。"],
  ["LASS-009", "宗教是人民的鸦片", "马克思政治思想语境过强，原文紧接《资本论》、共产主义和马克思主义讨论；按“不要政治语录”删除。"],
  ["LASS-038", "一个人过了40岁以后都该杀", "钱玄同过激戏语，现代人物口头语属性强，不按诗文格言保留。"],
];
const proofreadChangedRows = [];

const modernPoliticalTerms = [
  "总统",
  "国民党",
  "共产党",
  "民进党",
  "新党",
  "亲民党",
  "李登辉",
  "陈水扁",
  "宋楚瑜",
  "连战",
  "蒋介石",
  "蒋经国",
  "毛泽东",
  "孙中山",
  "台独",
  "台湾独立",
  "中华人民共和国",
  "政府",
  "立法院",
  "监察院",
  "法院",
  "宪法",
  "选举",
  "竞选",
  "总统府",
  "政治犯",
  "军人干政",
  "中央日报",
];

function findQuoteLocation(row) {
  const source = sourceCache.get(row.source_file);
  const sourceLines = source.lines.slice(row.line_start - 1, row.line_end).join("\n");
  const normalizedSource = normalizeText(sourceLines);
  const normalizedQuote = normalizeText(row.quote_text);
  return {
    found: normalizedSource.includes(normalizedQuote),
    sourceSnippet: sourceLines,
    normalizedQuote,
  };
}

const rows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const auditRows = rows.map((row) => {
  const location = findQuoteLocation(row);
  const politicalHits = modernPoliticalTerms.filter((term) => row.quote_text.includes(term));
  return {
    id: row.id,
    book: row.book,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
    quote_text: row.quote_text,
    category: row.category,
    source_or_origin: row.source_or_origin,
    found_in_source: location.found ? "yes" : "no",
    political_hits: politicalHits.join("|"),
    notes: row.notes,
  };
});

const missing = auditRows.filter((row) => row.found_in_source !== "yes");
const politicalFlagged = auditRows.filter((row) => row.political_hits);

if (missing.length > 0) {
  const detail = missing.map((row) => `${row.id} ${row.source_file}:${row.line_start} ${row.quote_text}`).join("\n");
  throw new Error(`Some quote_text values were not found in source lines:\n${detail}`);
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

const csvEscape = (value) => {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function writeCsv(filePath, dataRows, dataColumns = columns) {
  const csv = [
    dataColumns.join(","),
    ...dataRows.map((row) => dataColumns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
  fs.writeFileSync(filePath, `${csv}\n`, "utf8");
}

function writeTsv(filePath, dataRows, dataColumns) {
  const tsv = [
    dataColumns.join("\t"),
    ...dataRows.map((row) => dataColumns.map((column) => String(row[column] ?? "").replace(/\r?\n/g, "\\n")).join("\t")),
  ].join("\n");
  fs.writeFileSync(filePath, `${tsv}\n`, "utf8");
}

function writeTxt(filePath, dataRows) {
  const lines = [
    `《${book}》诗文格言歌谣引用`,
    `生成日期：${generatedDate}`,
    `条目数：${dataRows.length}`,
    "",
  ];

  for (const row of dataRows) {
    lines.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
    lines.push(row.quote_text);
    lines.push(`出处/来源：${row.source_or_origin}`);
    lines.push(`说明：${row.summary}`);
    if (row.notes) lines.push(`备注：${row.notes}`);
    lines.push("");
  }

  fs.writeFileSync(filePath, `${lines.join("\n").trimEnd()}\n`, "utf8");
}

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(candidatesJson), { recursive: true });

writeCsv(outCsv, rows);
writeTxt(outTxt, rows);
fs.writeFileSync(candidatesJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
writeTsv(reviewTsv, rows, columns);
writeTsv(auditTsv, auditRows, [
  "id",
  "book",
  "source_file",
  "line_start",
  "line_end",
  "quote_text",
  "category",
  "source_or_origin",
  "found_in_source",
  "political_hits",
  "notes",
]);

const categoryCounts = new Map();
const byFileCounts = new Map();
for (const row of rows) {
  categoryCounts.set(row.category, (categoryCounts.get(row.category) || 0) + 1);
  byFileCounts.set(row.source_file, (byFileCounts.get(row.source_file) || 0) + 1);
}

const report = [
  `《${book}》诗文格言歌谣引用首轮/校对后报告`,
  `生成日期：${generatedDate}`,
  "",
  `源目录：${sourceDir}`,
  `源文件数：${files.length}`,
  `候选命中：1041`,
  `首轮原始收入：${proofreadBeforeRows}`,
  `校对删除：${proofreadRemovedRows.length}`,
  `校对后写出：${rows.length}`,
  `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
  `源文命中异常：${missing.length}`,
  `quote_text现代政治词命中：${politicalFlagged.length}`,
  "",
  "分类统计：",
  ...[...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([category, count]) => `- ${category}：${count}`),
  "",
  "筛选原则：",
  "- 只收可独立成立的诗、词、经文、古文名句、联语、成语俗语、西方非政治格言、宗教/哲学经典句。",
  "- 排除现代政党人物语录、选战口号、政论判断、文件宣言、新闻访谈中的现代政治主张。",
  "- 古典经史、古代军政文句和古代兴亡诗句如确属传统诗文格言范围，按古典来源保留；现代政治思想语录从严删除。",
  "",
  "按文件分布：",
  ...Array.from(byFileCounts.entries()).map(([file, count]) => `- ${file}: ${count}`),
  "",
  `CSV：${outCsv}`,
  `TXT：${outTxt}`,
  `候选JSON：${candidatesJson}`,
  `审计TSV：${auditTsv}`,
].join("\n");

fs.writeFileSync(reportTxt, `${report}\n`, "utf8");

const proofreadAuditRows = [
  { action: "before", id: "", quote_text: "", reason: `校对前条目数：${proofreadBeforeRows}` },
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => ({
    action: "removed",
    id,
    quote_text: quoteText,
    reason,
  })),
  ...proofreadChangedRows.map(([id, quoteText, reason]) => ({
    action: "changed",
    id,
    quote_text: quoteText,
    reason,
  })),
  { action: "after", id: "", quote_text: "", reason: `校对后条目数：${rows.length}` },
];

writeTsv(proofreadAuditTsv, proofreadAuditRows, ["action", "id", "quote_text", "reason"]);

const proofreadReport = [
  `《${book}》校对轮报告`,
  `生成日期：${generatedDate}`,
  `校对前条目数：${proofreadBeforeRows}`,
  `删除条目数：${proofreadRemovedRows.length}`,
  "补入条目数：0",
  `修改条目数：${proofreadChangedRows.length}`,
  `校对后条目数：${rows.length}`,
  `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
  `现代政治词命中：${politicalFlagged.length}`,
  "",
  "校对处理：",
  "- 本轮删除马克思政治思想语境条目 1 条，删除现代人物叙事/过激戏语 2 条。",
  "- 古典经史、古代治理格言、诗词、联语、俗语和宗教/文学经典句继续保留，不按现代政治语录处理。",
  "- 丘吉尔、甘地、爱因斯坦等非政治用途的格言/宗教思想语句暂予保留，供后续总校再按全库口径统一。",
  "",
  "删除明细：",
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => `- ${id}｜${quoteText}：${reason}`),
  "",
  "按文件分布：",
  ...Array.from(byFileCounts.entries()).map(([file, count]) => `- ${file}: ${count}`),
].join("\n");

fs.writeFileSync(proofreadReportTxt, `${proofreadReport}\n`, "utf8");

console.log(JSON.stringify({
  book,
  rows: rows.length,
  outCsv,
  outTxt,
  reportTxt,
  auditTsv,
  proofreadReportTxt,
  proofreadAuditTsv,
  proofreadRemovedRows: proofreadRemovedRows.length,
  politicalFlagged: politicalFlagged.length,
}, null, 2));
