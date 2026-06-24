const fs = require("fs");
const path = require("path");

const book = "李敖颠倒众生";
const idPrefix = "LADZ";
const generatedDate = "2026-06-24";
const sourceDir = path.join("《大李敖全集6.0》分章节", "010.节目演讲类", "004.李敖颠倒众生");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_diandao_zhongsheng_quote_candidates.json");
const reviewTsv = path.join("analysis", "liao_diandao_zhongsheng_review_candidates.tsv");
const auditTsv = path.join("analysis", "liao_diandao_zhongsheng_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_diandao_zhongsheng_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_diandao_zhongsheng_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_diandao_zhongsheng_proofread_report.txt");
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
    notes: "首轮保守收入：节目文字稿政论密度高，仅取可独立成立的诗文、佛经、古文名句、成语俗谚和少量非政治格言。",
  };
}

const rawRows = [
  q("001.", 19, "众生不成佛，我不成佛", "佛教文句", "《地藏菩萨本愿经》语意", "李敖解释“众生”与地藏菩萨愿心时引用。"),
  q("001.", 19, "我不下地狱，谁下地狱", "佛教俗语", "地藏菩萨愿语", "李敖用地藏菩萨愿语说明救度精神。"),
  q("001.", 21, "至矣尽矣，方知小子之名；颠之倒之，反在诸公之上", "联语", "古代落榜者联", "李敖解释“颠倒”时引用的落第自嘲联。"),
  q("001.", 21, "名落孙山", "成语典故", "孙山落第典故", "李敖解释榜尾与落榜典故。"),
  q("005.", 27, "上穷碧落下黄泉", "诗句", "白居易《长恨歌》", "李敖借白居易诗句形容搜求资料。"),
  q("005.", 25, "谎话、他妈的谎话、统计学", "西方统计格言", "狄斯累利语", "李敖引用狄斯累利关于统计学的讽刺格言。"),
  q("006.", 5, "在齐太史简，在晋董狐笔", "诗句", "文天祥《正气歌》", "李敖谈史家解释权时引用《正气歌》。"),
  q("006.", 5, "行不出境，返不讨贼", "史传名句", "董狐书法典故", "李敖转述赵盾弑君故事中的责任判断。"),
  q("009.", 7, "言必信、行必果", "古典成语", "《论语·子路》语", "李敖讲自己下台后告李登辉时用到的古典成语。"),
  q("009.", 9, "天行有常，不为尧存，不为桀亡", "古典名句", "《荀子·天论》", "李敖谈不因成败而停止行动时引用。"),
  q("009.", 9, "天行健，君子以自强不息", "古典名句", "《周易·乾卦》", "李敖续引《易经》说明自强不息。"),
  q("014.", 21, "王侯第宅皆新主，文武衣冠异昔时", "诗句", "杜甫诗句", "李敖借杜甫诗句说明改朝换代。"),
  q("020.", 11, "义结金兰", "成语", "中国成语", "李敖解释拜把子时提到的结义成语。"),
  q("020.", 11, "不能同年同月同日生，但愿同年同月同日死", "小说俗语", "桃园三结义俗传", "李敖解释刘关张桃园结义时引用。"),
  q("021.", 11, "奈何生我家？", "史传名句", "明思宗语", "李敖谈亡国公主故事时引用崇祯语。"),
  q("021.", 11, "奈何生帝王家", "古典慨叹", "亡国帝王家俗语", "李敖概括帝王家亡国遭际时引用。"),
  q("021.", 35, "觚不觚，觚哉！觚哉！", "古典名句", "《论语·雍也》", "李敖谈正名主义时引用孔子语。"),
  q("033.", 7, "岂不爱自由，此意无人晓", "诗句", "胡适诗句", "李敖谈“不自由”典故时引用胡适诗。"),
  q("033.", 33, "做好官就不能做好人，做好人就不能做好官", "古代官箴", "张居正语", "李敖进一步概括张居正做官做人之辨。"),
  q("033.", 41, "独与天地精神往来", "古典名句", "庄子语意", "李敖以庄子语说明独立精神。"),
  q("036.", 7, "不战而屈人之兵", "兵法名句", "《孙子兵法》", "李敖谈军事“势”时引用《孙子》。"),
  q("038.", 9, "重为惠，若重为暴", "古文名句", "《淮南子》", "李敖谈节制权力时引用《淮南子》。"),
  q("045.", 5, "挂羊头卖狗肉", "俗语", "中国俗语", "李敖谈名实不符时反复使用的俗语。"),
  q("046.", 9, "八仙过海，各显神通", "俗语", "中国俗语", "李敖谈各路人马自行其是时引用。"),
  q("048.", 3, "其人存则政举，其人亡则政息", "古典名句", "《中庸》语", "李敖谈权力人物退场后机关随之停摆时引用。"),
  q("048.", 19, "天无三日晴，地无三里平，人无三两银", "俗谚", "贵州俗谚", "李敖讲贵州社会习俗时引用地方俗谚。"),
  q("049.", 13, "汤武革命，顺天应人", "古典名句", "《周易·革卦》语意", "李敖谈“革命”古义时引用。"),
  q("047.", 17, "举证责任分给谁，谁就败诉", "法律谚语", "罗马法谚语", "李敖谈诽谤除罪化时引用罗马法谚语。"),
  q("047.", 27, "一朝天子一朝臣", "俗语", "中国俗语", "李敖谈政权交替后的用人变动时引用。"),
  q("052.", 23, "情欲信而词欲巧", "文论名句", "传统文论语", "李敖谈进入大陆电视台讲话的表达策略时引用。"),
  q("052.", 25, "见人说人话，见鬼说鬼话", "俗语", "中国俗语", "李敖说明自己不是简单逢迎，而是因材施教。"),
  q("052.", 25, "谏有五，吾从其讽", "古典名句", "孔子相关古语", "李敖谈讽谏的效用时引用。"),
  q("053.", 23, "九三君子终日乾乾，夕惕若，厉无咎", "易经文句", "《周易·乾卦》", "李敖批评南怀瑾标点时引用乾卦爻辞。"),
  q("053.", 23, "君子终日乾乾，终夕惕惕", "古文校勘句", "俞樾《古书疑义举例》语意", "李敖说明《易经》文言省略法时引用。"),
  q("057.", 7, "一刀初刺虎犹纵，三刀四刀虎不动。带血抽刀啼向天，可惜大才还小用", "诗句", "袁枚《费宫人刺虎歌》", "李敖分析诗句省略与速度感时引用。"),
  q("058.", 7, "山重水复疑无路，柳暗花明又一村", "诗句", "陆游《游山西村》", "李敖谈尹案出现转机时引用陆游诗。"),
  q("044.", 19, "陛下宽心，贫僧举一神，可擒这侯", "小说文句", "《西游记》", "李敖讲孙悟空大闹天宫时引用《西游记》文句。"),
  q("044.", 21, "不必列公相助，我自有兄弟扶持，若赢了他，不必列公绑负，我有兄弟动手", "小说文句", "《西游记》", "李敖引用二郎神出场时的自任语。"),
  q("044.", 21, "这个亡人！你不去妨家长，却来咬老孙！急翻身爬不起来，被七圣一拥按住，即将绳索捆绑，使勾刀穿了琵琶骨，再不能变化。", "小说文句", "《西游记》", "李敖引用孙悟空被二郎神犬咬住后的原文。"),
];

const proofreadBeforeRows = 42;
const proofreadRemovedRows = [
  ["LADZ-018", "其哭乃哀", "《史记》叙事残片，离开吕后夺权上下文后独立检索价值弱。"],
  ["LADZ-019", "女人的子宫是一个希望怀胎的猛兽", "柏拉图语意转述不稳，且原文用于现代政治人物性别化攻击语境，不按诗文格言保留。"],
  ["LADZ-021", "一个人又要做好官，又要做好人，是不可能的", "与下一条张居正官箴重复，保留更凝练的“做好官就不能做好人，做好人就不能做好官”。"],
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
  `候选命中：428`,
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
  "- 只收可独立成立的佛经文句、诗词、古文名句、史传文句、成语俗谚、小说原文和少量非政治格言。",
  "- 排除现代政党人物语录、选战口号、政论判断、新闻标题、文书材料、现代政治人物性别化攻击语句和节目闲谈。",
  "- 古典兵法、经史、史传与古代兴亡文句如确属传统诗文格言范围，先按古典来源保留，供校对轮再审边界。",
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
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => ({ action: "removed", id, quote_text: quoteText, reason })),
  ...proofreadChangedRows.map(([id, quoteText, reason]) => ({ action: "changed", id, quote_text: quoteText, reason })),
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
  "- 本轮未发现 quote_text 现代政治词命中；删除对象主要是叙事残片、语境污染较强的性别化转述，以及重复官箴。",
  "- 古典经史、诗词、兵法、小说原文和来源明确的俗谚继续保留，不按现代政治语录处理。",
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
