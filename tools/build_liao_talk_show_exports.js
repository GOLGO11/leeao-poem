const fs = require("fs");
const path = require("path");

const book = "李敖Talk秀";
const idPrefix = "LATS";
const generatedDate = "2026-06-24";
const sourceDir = path.join("《大李敖全集6.0》分章节", "010.节目演讲类", "005.李敖Talk秀");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_talk_show_quote_candidates.json");
const reviewTsv = path.join("analysis", "liao_talk_show_review_candidates.tsv");
const auditTsv = path.join("analysis", "liao_talk_show_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_talk_show_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_talk_show_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_talk_show_proofread_report.txt");
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
    notes: "首轮保守收入：节目文字稿政论和访谈口语密度高，仅取可独立成立的诗文、古文名句、成语俗谚、戏曲/小说文句和少量非政治格言。",
  };
}

const rawRows = [
  q("001.", 39, "人生如戏", "西方文学格言", "莎士比亚语意", "李敖开场借莎士比亚语意说明人生如舞台。"),
  q("001.", 43, "采葑采菲，无以下体", "诗经名句", "《诗经·邶风·谷风》", "李敖谈“裤腰带以下”话题时引用《诗经》句。"),
  q("001.", 97, "满街皆圣人", "心学名句", "王阳明语", "李敖谈处女定义时借王阳明语作类比。"),
  q("001.", 459, "潘驴邓小闲", "小说俗语", "《水浒传》王婆说法", "李敖解释《水浒传》中王婆论勾引女人的五条件。"),
  q("001.", 479, "奇货可居", "成语典故", "《史记·吕不韦列传》", "李敖讲吕不韦故事时引用的成语。"),
  q("001.", 479, "以其阴关桐轮而行", "史传文句", "《史记·吕不韦列传》", "李敖展示《史记》中嫪毐故事的文句。"),
  q("002.", 43, "食色性也", "古典名句", "《孟子·告子上》", "李敖说明此语出自告子而非孔子。"),
  q("002.", 45, "寡能守就守，不能守寡就改嫁吧", "民间故事格言", "清代贞节牌坊故事", "李敖转述守寡故事中老太太临终告诫女眷的话。"),
  q("003.", 39, "言教不如身教", "古语", "中国传统教育格言", "李敖谈校园暴力与教育样板时引用。"),
  q("003.", 343, "古往今来，凡是能够被人家立铜像的，都不是批评家", "西方文艺格言", "西贝流士老师语", "李敖鼓励创作者时引用西贝流士老师的话。"),
  q("004.", 185, "爱情的代价是痛苦，爱情的方法是忍受痛苦", "现代文人格言", "胡适题句", "李敖谈金岳霖与林徽因故事时引用胡适扇面题句。"),
  q(
    "004.",
    247,
    "不爱那么多，\n只爱一点点。\n别人的爱情像海深，\n我的爱情浅。\n不爱那么多，\n只爱一点点。\n别人的爱情像天长，\n我的爱情短。\n不爱那么多，\n只爱一点点。\n别人眉来又眼去，\n我只偷看你一眼。",
    "诗/歌词",
    "李敖《只爱一点点》",
    "李敖在节目中完整朗读自己写的爱情诗/歌词。",
    269,
  ),
  q("005.", 23, "天机不可泄露", "成语/戏曲台词", "京剧《空城计》轶事", "李敖讲谭鑫培临场应对海派演员加词时引用的台词。"),
  q("005.", 471, "更好是好的敌人", "西方哲学格言", "伏尔泰语", "李敖劝许志安不要因追求更好而错过推出作品时引用伏尔泰格言。"),
  q("006.", 23, "挂羊头卖狗肉", "俗语", "中国俗语", "李敖谈口号与实践不符时引用。"),
  q("006.", 175, "经世济民", "古典词语", "中国古语", "李敖解释“经济”一词古义时引用。"),
  q("007.", 9, "赵四风流朱五狂，翩翩胡蝶最当行。温柔乡是英雄冢，哪管东师入沈阳。", "近代诗句", "马君武《哀沈阳二首》", "李敖谈张学良九一八传闻时引用马君武讽刺诗。"),
  q("007.", 297, "散愁自少以来，不登娈童之床，不入妓女之室", "史传文句", "《北史·齐纪》", "李敖讨论古代男色女色习俗时引用北齐史料。"),
  q("008.", 375, "既生瑜，何生亮；卿不死，孤不安", "联语", "宋教仁案讽袁联", "李敖讲宋教仁被刺后讽刺袁世凯的对联。"),
  q("010.", 25, "兔子不吃窝边草", "俗语", "中国俗语", "李敖谈师生恋时引用的俗语。"),
  q("013.", 135, "待月西厢下，迎风户半开。隔墙花影动，疑似玉人来", "戏曲诗句", "《西厢记》", "李敖说明中文词汇之美时引用《西厢记》句。"),
  q("013.", 135, "夺门而出", "成语", "中国成语", "李敖举例说明中文动词“夺”的力量。"),
  q("013.", 135, "夺眶而出", "成语", "中国成语", "李敖举例说明中文动词“夺”的表现力。"),
  q("014.", 19, "不封不树", "古礼成语", "古代葬礼制度", "李敖谈古礼葬制时引用的古礼说法。"),
  q("015.", 97, "二三其德，昊天罔极", "诗经名句", "《诗经》语", "李敖借《诗经》语同来宾名字开玩笑。"),
  q("015.", 323, "男女媾进，万物化生", "易经文句", "《易经》语意", "李敖谈春宫画与性教育时引用《易经》语句，源文作“媾进”。"),
  q("018.", 5, "一年老一年，一日衰一日；譬如东周亡，岂复须大疾", "诗句", "陆游诗句", "李敖谈台湾前途时引用陆游诗句。"),
  q("018.", 5, "思子之故怕闻鼙鼓之声来", "联语", "康有为赠蔡锷联", "李敖谈局势时引用康有为联语。"),
  q("018.", 5, "闻鼓鼙而思良将", "古典成句", "传统成句", "李敖承接康有为联语，引用闻鼓鼙思良将的成句。"),
  q("018.", 11, "两个不对，第一个他不该开除你，第二你不该加入", "现代文人警句", "梁实秋语", "李敖转述梁实秋评价郭良惠被中国文艺协会开除的机智语。"),
];

const proofreadBeforeRows = 28;
const proofreadRemovedRows = [];
const proofreadAddedRows = [
  ["更好是好的敌人", "伏尔泰语", "首轮漏收的明确西方格言。"],
  [
    "赵四风流朱五狂，翩翩胡蝶最当行。温柔乡是英雄冢，哪管东师入沈阳。",
    "马君武《哀沈阳二首》",
    "首轮漏收的近代诗句；项目既有总表同类诗句已保留，本轮按重复引用补入。",
  ],
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
  "中华民国",
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
  `候选命中：224`,
  `首轮原始收入：${proofreadBeforeRows}`,
  `校对删除：${proofreadRemovedRows.length}`,
  `校对补入：${proofreadAddedRows.length}`,
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
  "- 只收可独立成立的诗文、古文名句、成语俗谚、小说/戏曲文句和少量非政治格言。",
  "- 排除现代政党人物语录、选战口号、政论判断、新闻标题、节目串场、单纯书名歌名、来宾闲谈和现代政治人物性别化攻击语句。",
  "- 校对轮补入首轮漏掉的明确格言/诗句；继续排除现代政治语录、来宾闲谈和性别化政治攻击语句。",
  "- 李敖本人在节目中完整朗读的诗/歌词，按“节目中引用的李敖自作诗文”收入，供校对轮再审。",
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
  ...proofreadAddedRows.map(([quoteText, source, reason]) => ({
    action: "added",
    id: "",
    quote_text: quoteText,
    reason: `${source}：${reason}`,
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
  `补入条目数：${proofreadAddedRows.length}`,
  `修改条目数：${proofreadChangedRows.length}`,
  `校对后条目数：${rows.length}`,
  `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
  `现代政治词命中：${politicalFlagged.length}`,
  "",
  "校对处理：",
  "- 本轮未删除首轮条目；现有条目均为传统诗文、成语俗谚、古文/戏曲文句或非政治格言。",
  "- 补入伏尔泰格言和马君武诗句；继续排除现代政党人物语录、选战口号、政治判断、来宾闲谈和性别化政治攻击语句。",
  "",
  "补入明细：",
  ...proofreadAddedRows.map(([quoteText, source, reason]) => `- ${quoteText}｜${source}：${reason}`),
  "",
  "删除明细：无",
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
  politicalFlagged: politicalFlagged.length,
}, null, 2));
