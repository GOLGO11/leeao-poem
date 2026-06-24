const fs = require("fs");
const path = require("path");

const book = "笑敖年代";
const idPrefix = "LAXAND";
const generatedDate = "2026-06-24";
const sourceDir = path.join("《大李敖全集6.0》分章节", "010.节目演讲类", "008.笑敖年代");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_xiaoao_niandai_quote_candidates.json");
const reviewTsv = path.join("analysis", "liao_xiaoao_niandai_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_xiaoao_niandai_attributed_lines.tsv");
const auditTsv = path.join("analysis", "liao_xiaoao_niandai_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_xiaoao_niandai_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_xiaoao_niandai_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_xiaoao_niandai_proofread_report.txt");
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
    .replace(/[“”‘’"'【】]/g, "")
    .replace(/\s+/g, "");
}

function normalizeForSourceCheck(text) {
  return normalizeText(text).replace(/（[^）]*）/g, "");
}

function q(filePrefix, lineStart, quoteText, category, attributedTo, note, lineEnd = lineStart, extraNotes = "") {
  const file = sourceFile(filePrefix);
  const notes = [
    "首轮保守收入：本书选战、政论和新闻口语密集，仅取句子本体可独立成立的诗文、古文名句、成语俗谚、歌词、儿歌和非政治读书法格言。",
    extraNotes,
  ].filter(Boolean).join(" ");
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
    notes,
  };
}

const proofreadAddNote = "校对轮补入：回扫源文后确认句子本体属于非政治古典文句或古礼文句。";
const proofreadBeforeRows = 30;
const proofreadRemovedRows = [];
const proofreadChangedRows = [];

const rawRows = [
  q("001.", 13, "一闪一闪亮晶晶，满天都是小星星", "儿歌句", "传统儿歌《小星星》", "李敖转述儿子唱儿歌时引用原句；后面的粗俗改唱不收入。"),

  q("002.", 205, "虚与委蛇", "成语", "《庄子》成语", "李敖说明“委蛇”读音与宋人笑话时引用。"),
  q("002.", 213, "松伯不凋于岁寒", "题字/训诂例句", "蒋经国题字，源文作“松伯”", "李敖展示蒋经国题字并借此辨析“后/不”通假。"),
  q("002.", 213, "伤人乎，不问马", "论语文句", "《论语·乡党》", "李敖讨论孔子问厩焚故事的通常读法。"),
  q("002.", 213, "防风氏后至", "国语文句", "《国语·鲁语》", "李敖解释古书中“后”可通“不”时引用。"),
  q("002.", 213, "松柏后凋于岁寒", "论语名句", "《论语·子罕》", "李敖据“后/不”通假重释松柏句。"),
  q("002.", 213, "伤人乎，后问马", "论语训诂改读", "《论语·乡党》李敖改读", "李敖认为孔子是先问人、后问马，据通假提出的改读。"),
  q("002.", 213, "仁民爱物", "古典成语", "《孟子》语意", "李敖解释孔子不只关心人，也应关心马时引用。"),

  q("003.", 97, "当家方知柴米贵", "传统俗语", "中国俗语", "李敖借猪八戒口吻说明当家后才知现实困难。"),

  q("004.", 117, "读《论语》以前就这样子，读过《论语》以后还是这样，就等于说你没有受到影响。", "宋儒读书格言", "朱熹语意", "李敖谈崇拜人物须受其影响时转述朱熹论读《论语》的话。"),
  q(
    "004.",
    157,
    "不爱那么多，\n只爱一点点；\n别人的爱情像海深，\n我的爱情浅。\n不爱那么多，\n只爱一点点；\n别人的爱情像天长，\n我的爱情短。\n不爱那么多，\n只爱一点点；\n别人眉来又眼去，\n我只偷看你一眼。",
    "李敖诗/歌词",
    "李敖《只爱一点点》",
    "李敖在节目中朗读自己写的爱情诗/歌词。",
  ),
  q("004.", 165, "乌龟看绿豆，王八看绿豆", "传统俗语", "中国俗语", "李敖谈短期爱情幻觉时使用的俗语式说法。"),
  q("004.", 169, "取之有道", "传统成语/格言", "中国传统格言", "李敖回应爱钱与爱情话题时引用。"),
  q(
    "004.",
    233,
    "种桑长江边，三年望当采。\n枝条始欲茂，忽值山河改。\n柯叶自摧折，根株浮沧海。\n本不植高原，今日复何悔。",
    "晋诗",
    "陶渊明诗",
    "李敖借陶渊明种桑诗说明努力被大势摧毁的处境。",
  ),
  q("004.", 249, "君子爱人以德", "礼记格言", "《礼记·檀弓上》语意", "李敖谈劝人不要作无谓牺牲时引用。"),
  q("004.", 265, "每下愈况", "庄子成语", "《庄子·知北游》", "李敖指出“每况愈下”的原典作“每下愈况”。"),
  q("004.", 269, "每况愈下", "成语", "宋以后通行成语", "李敖说明“每下愈况”后来误作“每况愈下”。"),
  q("004.", 277, "约定俗成谓之宜", "荀子名句", "《荀子·正名》", "李敖讲成语流变和语言习惯时引用。"),

  q(
    "005.",
    173,
    "绕岸车鸣水欲干，鱼儿相逐尚相欢。\n无人挈入沧江去，汝死哪知世界宽。",
    "宋诗",
    "王安石诗",
    "李敖引用王安石水涸鱼戏之诗作局势比喻；诗文本体保留。",
  ),

  q("010.", 192, "要学活的学问是最重要的", "李敖读书法格言", "李敖语", "李敖谈自己求知方法时提出的读书法格言。"),
  q("010.", 192, "格物致知", "大学名句", "《大学》", "李敖谈中国古代求知方法时引用。"),
  q("010.", 192, "我看到的这一面是白颜色，那一面什么颜色我不知道", "科学方法格言", "美国国务卿赫尔故事", "李敖借赫尔看马颜色的故事说明稳健的科学方法。"),
  q("010.", 192, "我求的知识是活的，不是死的知识", "李敖读书法格言", "李敖语", "李敖总结自己把书念活的求知方法。"),

  q("013.", 13, "我拿青春赌明天，你用真情换此生，岁月不知人间多少的忧伤，何不潇洒走一回", "歌词句", "《潇洒走一回》歌词", "李敖引用歌曲原歌词；后面的竞选改词不收入。"),
  q("013.", 89, "庖丁解牛", "庄子成语", "《庄子·养生主》典故", "李敖讲做事要找窍门时引用。"),
  q("013.", 89, "游刃有余", "庄子成语", "《庄子·养生主》典故", "李敖说明庖丁解牛的高明方法时引用。"),
  q("013.", 89, "一滴精十滴血", "传统俗谚", "中国俗语/道家房中术观念", "李敖讲道家房中术观念时引用俗谚。"),
  q("013.", 89, "猪八戒照镜子，里外不是人", "歇后语", "中国歇后语", "李敖形容两面都不讨好时引用。"),
  q(
    "013.",
    147,
    "如有天孙锦，（天堂上织出来的布）\n愿为君铺地。\n镶金复镶银，\n明暗日夜继。\n家贫锦难求，（家里很穷，拿不到好的纺织品）\n唯有以梦替。\n践履慎轻置，\n吾梦不堪碎！",
    "外国诗译文",
    "叶慈诗，居浩然译",
    "李敖以文学家姿态展示居浩然翻译的叶慈诗。",
    161,
  ),
  q(
    "013.",
    167,
    "不看你的眼，不看你的眉。\n看了心里都是你，忘了我是谁。\n不看你的眼，不看你的眉。\n看的时候心里跳，看了以后眼泪垂。",
    "李敖歌词",
    "李敖《忘了我是谁》",
    "李敖说明自己在牢中写的《忘了我是谁》原歌词；后面的竞选改词不收入。",
  ),

  q("014.", 103, "毋恃敌之不来，正恃吾之有以待之", "古典兵法名句", "《孙子兵法》语意", "汪用和背出《孙子兵法》句，李敖随即确认其出处。", 103, proofreadAddNote),
  q("014.", 185, "不死于女人之手", "礼记文句", "《礼记》李敖所引", "李敖讲克里蒙梭临终轶事时明说此句合乎《礼记》古礼。", 185, proofreadAddNote),
];

const rows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const modernPoliticalTerms = [
  "总统",
  "总统府",
  "国民党",
  "共产党",
  "民进党",
  "台独",
  "台湾独立",
  "独派",
  "罢免",
  "选票",
  "竞选",
  "市长",
  "立法院",
  "军购",
  "国防",
  "民主",
  "美国人",
  "老美",
  "北京",
  "一国两制",
  "中共",
  "政党",
  "政府",
  "中央",
  "蓝绿",
  "蓝色",
  "绿色",
  "国会",
];

function sourceSlice(row) {
  const source = sourceCache.get(row.source_file);
  if (!source) return "";
  return source.lines.slice(row.line_start - 1, row.line_end).join("\n");
}

const seen = new Set();
const auditRows = rows.map((row) => {
  const normalizedQuote = normalizeForSourceCheck(row.quote_text);
  const normalizedSource = normalizeForSourceCheck(sourceSlice(row));
  const foundInSource = normalizedSource.includes(normalizedQuote);
  const normalizedKey = normalizeText(row.quote_text);
  const duplicate = seen.has(normalizedKey);
  seen.add(normalizedKey);
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
    found_in_source: foundInSource ? "yes" : "NO",
    duplicate_text: duplicate ? "yes" : "",
    political_hits: politicalHits.join("|"),
    notes: row.notes,
  };
});

const missing = auditRows.filter((row) => row.found_in_source !== "yes");
const politicalFlagged = auditRows.filter((row) => row.political_hits);
const duplicateRows = auditRows.filter((row) => row.duplicate_text);

if (missing.length) {
  console.warn(`WARNING: ${missing.length} rows were not found verbatim in source slices.`);
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
  "duplicate_text",
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
  `归因候选命中：123`,
  `引号候选命中：0`,
  `关键词候选命中：165`,
  `复核候选TSV入选：0`,
  `首轮原始收入：${proofreadBeforeRows}`,
  `校对删除：${proofreadRemovedRows.length}`,
  `校对补入：${rows.length - proofreadBeforeRows + proofreadRemovedRows.length}`,
  `校对后写出：${rows.length}`,
  `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
  `源文命中异常：${missing.length}`,
  `重复文本：${duplicateRows.length}`,
  `quote_text现代政治词命中：${politicalFlagged.length}`,
  "",
  "分类统计：",
  ...[...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([category, count]) => `- ${category}：${count}`),
  "",
  "筛选原则：",
  "- 节目文本以台北市长选战、政论、新闻议题和现代政治人物评论为主，首轮只收可独立成立的诗文、古文、成语俗谚、儿歌、歌词和非政治读书法格言。",
  "- 明确排除现代政党人物语录、选举改词、军购/外交/统独口号、新闻标题、节目串场和直接现代政治判断。",
  "- 古典诗文、成语和歌词即使出现在政治比喻中，若句子本体不是政治语录，按引用本体保留；政治改写、选战口号和当场竞选打油诗不收。",
  "- 《潇洒走一回》和《忘了我是谁》只收原歌词，不收李敖为竞选改写的歌词。",
  "- 校对轮补入《孙子兵法》古典兵法句和《礼记》古礼句；继续排除克里蒙梭战争名言、反军购打油诗、现代法政人物语录与选举口号。",
  "",
  "按文件分布：",
  ...Array.from(byFileCounts.entries()).map(([file, count]) => `- ${file}: ${count}`),
  "",
  `CSV：${outCsv}`,
  `TXT：${outTxt}`,
  `候选JSON：${candidatesJson}`,
  `复核候选TSV：${reviewTsv}`,
  `归因行TSV：${attributedTsv}`,
  `审计TSV：${auditTsv}`,
].join("\n");

fs.writeFileSync(reportTxt, `${report}\n`, "utf8");

const proofreadAddedRows = rows.slice(proofreadBeforeRows);
const proofreadAuditRows = [
  { action: "before", id: "", quote_text: "", source_or_origin: "", reason: `校对前条目数：${proofreadBeforeRows}` },
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => ({
    action: "remove",
    id,
    quote_text: quoteText,
    source_or_origin: "",
    reason,
  })),
  ...proofreadAddedRows.map((row) => ({
    action: "add",
    id: row.id,
    quote_text: row.quote_text,
    source_or_origin: row.source_or_origin,
    reason: row.summary,
  })),
  ...proofreadChangedRows.map(([id, quoteText, reason]) => ({
    action: "change",
    id,
    quote_text: quoteText,
    source_or_origin: "",
    reason,
  })),
  { action: "after", id: "", quote_text: "", source_or_origin: "", reason: `校对后条目数：${rows.length}` },
];
writeTsv(proofreadAuditTsv, proofreadAuditRows, ["action", "id", "quote_text", "source_or_origin", "reason"]);

const proofreadReport = [
  `《${book}》校对轮报告`,
  `生成日期：${generatedDate}`,
  "",
  `校对前条目数：${proofreadBeforeRows}`,
  `删除条目数：${proofreadRemovedRows.length}`,
  `补入条目数：${proofreadAddedRows.length}`,
  `修改条目数：${proofreadChangedRows.length}`,
  `校对后条目数：${rows.length}`,
  "",
  "校对处理：",
  "- 首轮 30 条未发现需要删除的政治语录；歌词原句、古典诗文、训诂例句和非政治读书法格言继续保留。",
  "- 补入 2 条首轮漏收的古典文句：《孙子兵法》语意句与李敖明说出自《礼记》的古礼句。",
  "- 继续排除反军购打油诗、克里蒙梭战争名言、林肯/梁启超/Decatur 等现代法政语录、选举改词与政党人物判断。",
  "",
  "补入条目：",
  ...proofreadAddedRows.map((row) => `- ${row.id}｜${row.quote_text}｜${row.source_or_origin}｜${row.source_file}:${row.line_start}-${row.line_end}`),
  "",
  `校对审计TSV：${proofreadAuditTsv}`,
].join("\n");
fs.writeFileSync(proofreadReportTxt, `${proofreadReport}\n`, "utf8");

console.log(JSON.stringify({
  book,
  rows: rows.length,
  proofreadBeforeRows,
  proofreadAdded: proofreadAddedRows.length,
  proofreadRemoved: proofreadRemovedRows.length,
  outCsv,
  outTxt,
  reportTxt,
  auditTsv,
  proofreadReportTxt,
  proofreadAuditTsv,
  missing: missing.length,
  duplicateRows: duplicateRows.length,
  politicalFlagged: politicalFlagged.length,
}, null, 2));
