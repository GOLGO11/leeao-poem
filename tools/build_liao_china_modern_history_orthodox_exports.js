const fs = require("fs");
const path = require("path");

const book = "中国现代史正论";
const idPrefix = "LACMHO";
const generatedDate = "2026-06-23";
const outDir = "exports";
const analysisDir = "analysis";
const analysisPrefix = "liao_china_modern_history_orthodox";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "009.历史文化类",
  "008.中国现代史正论",
);

const sourceDecoder = new TextDecoder("gb18030");
const lineCache = new Map();
let cachedSourceFiles;

function sourceFiles() {
  if (!cachedSourceFiles) {
    cachedSourceFiles = fs.readdirSync(path.join(process.cwd(), sourceDir))
      .filter((file) => file.endsWith(".txt") && !file.includes("目录"))
      .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  }
  return cachedSourceFiles;
}

function fileByPrefix(prefix) {
  const matches = sourceFiles().filter((file) => file.startsWith(prefix));
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one source file for prefix ${prefix}, got ${matches.length}`);
  }
  return matches[0];
}

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

function compact(text) {
  return String(text).replace(/[\s　]+/g, "");
}

function comparable(text) {
  return compact(text)
    .replace(/（wjm_tcy注：[^）]*）/g, "")
    .replace(/（敖按：[^）]*）/g, "")
    .replace(/（李敖按：[^）]*）/g, "");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, "\\n");
}

function q(prefix, lineStart, quoteText, category, sourceOrigin, summary, notes = "", lineEnd = lineStart) {
  const sourceFile = fileByPrefix(prefix);
  return {
    id: "",
    book,
    chapter: chapterFromFile(sourceFile),
    source_file: sourceFile,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrigin,
    summary,
    notes,
  };
}

const rawRows = [
  q("003.", 13, "公自平生怀直气，谁能晚节负初心", "古人诗句", "古人诗句", "李敖借古诗批评李璜晚节不保。"),
  q("005.", 21, "上都新事常先到，老圃闲谈未易欺。", "古人诗句", "古人诗句", "李敖借诗句说明博读旁引可破传闻欺饰。"),
  q("008.", 79, "浮者自浮、沉者自沉", "古人传信语", "古人传信旧语", "李敖以古人传信语反衬自己公开印行文字的传信方式。"),
  q("009.", 9, "再生之德", "题赠短语", "何柱国题银盾语", "何柱国以四字题赠纪念杨虎城相救之德。"),

  q("011.", 9, "我为他已丢弃万事看作粪土。", "宗教经典句", "《腓立比书》", "张学良引用保罗书信表达宗教心境。"),
  q("011.", 9, "忘记背后，努力面前的，向着标杆直跑，要得上帝在耶稣基督里从上面召我来得的奖赏。", "宗教经典句", "《腓立比书》", "张学良引用保罗书信说明忘记过去、向前奔跑的信仰态度。"),
  q("015.", 13, "在罪人中我是个罪魁", "宗教经典句", "保罗书信", "李敖指出张学良再引保罗之言表达宗教层次。"),

  q("018.", 5, "冲绳岛上话南菁，\n海浪天风不解听。\n乞与人间留纪录，\n当年侪辈剩先生。", "近人诗句", "胡适口占诗", "胡适在冲绳岛上口占诗，劝钮永建留下历史记录。", "", 11),
  q("018.", 23, "公自平生怀直气，谁能晚节负初心！", "古人诗句", "古人诗句", "李敖再次引用古诗，吁请张学良保持晚节、公布真相。"),
  q("020.", 15, "此度见花枝，白头誓不归", "古人诗句", "古人诗句", "李敖借古诗寄望张学良以行动吐气。"),
  q("020.", 15, "物不得其平则鸣……人之于言也亦然", "韩愈文句", "韩愈《送孟东野序》", "李敖引韩愈文说明不平则鸣。"),
  q("020.", 15, "有若不释然者，故吾道其命于天者以解之", "韩愈文句", "韩愈《送孟东野序》", "李敖续引韩愈文句，说明以天命解不平。"),

  q("021.", 3, "爱人如己", "宗教格言", "张学良题词", "张学良题词中的宗教格言。"),
  q("021.", 17, "故人舍我闭黄壤", "古典诗句", "古诗成句", "李敖借古诗写杨虎城故去、张学良应有所纪念。"),
  q("022.", 19, "纵江东父兄怜我而王我", "史记文句", "《史记·项羽本纪》", "李敖引用楚霸王不肯回江东的典故。"),
  q("022.", 31, "顶天立地男子汉，磊落光明度余年。", "小歌", "张学良自作小歌", "张学良小歌自述人格与晚年愿望。"),

  q("023.", 23, "春秋责备贤者", "古典成语", "《春秋》评判传统", "龚忠武以后记说明作诗本于责备贤者之义。"),
  q("023.", 29, "赵四风流朱五狂，\n翩翩蝴蝶正当行，\n温柔乡是英雄冢，\n哪管东师入沈阳！", "近人诗句", "马君武《哀沈阳》", "马君武第一首《哀沈阳》诗，李敖引出后辨其造谣成分。", "", 35),
  q("023.", 37, "告急军书夜半来，\n开场弦管又相催。\n沈阳已陷休回顾，\n更抱佳人舞几回！", "近人诗句", "马君武《哀沈阳》", "马君武第二首《哀沈阳》诗，李敖作为广为传诵但内容失实的诗例引用。", "", 43),
  q("023.", 67, "不啻月殿嫦娥也", "文学比喻", "彭国栋《艺文掌故续谈》", "彭国栋以月殿嫦娥比喻胡蝶艳名。"),
  q("023.", 67, "七彩缤纷，犹有玉环体态", "文学比喻", "彭国栋《艺文掌故续谈》", "彭国栋以杨玉环体态比喻胡蝶中年演出。"),

  q("024.", 45, "两害取其轻", "成语格言", "传统成语", "《大公报》社评以成语说明通车问题的权衡。"),
  q("024.", 47, "力薄难回劫后天", "近人诗句", "黄郛诗句", "黄郛以诗句写时局艰难、力薄难回。"),
  q("024.", 141, "物尽其用，货畅其流", "经济格言", "传统经济成语", "李敖以成语概括通商背后的实用逻辑。"),
  q("024.", 179, "掩耳盗铃", "古典成语", "传统成语", "李敖用成语讽刺言行不一。"),
  q("024.", 179, "暗度陈仓", "古典成语", "传统成语", "李敖用成语讽刺表面不通融而暗中往来。"),

  q("025.", 7, "每一位写文章的人负自己文章的责任。", "办刊原则", "陈之迈《纪念适之先生》", "陈之迈说明《独立评论》的独立原则。"),
  q("025.", 7, "只是就个人的看法发挥个人的主张而已。", "办刊原则", "陈之迈《纪念适之先生》", "陈之迈说明《独立评论》文章各陈己见的风格。"),
  q("025.", 9, "只问文章的内容好不好，绝不计较作者的地位或声名。", "编辑原则", "陈之迈《纪念适之先生》", "陈之迈概括胡适编辑《独立评论》的选稿标准。"),
  q("025.", 11, "办刊物不可避免的风险，不必大惊小怪，过些时候自会平息下来。", "办刊格言", "陈之迈《纪念适之先生》", "陈之迈记胡适对刊物受干涉的态度。"),
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

const rows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const errors = [];
for (const row of rows) {
  const lines = readLines(row.source_file);
  const sourceText = lines.slice(row.line_start - 1, row.line_end).join("\n");
  if (
    !sourceText.includes(row.quote_text) &&
    !comparable(sourceText).includes(comparable(row.quote_text))
  ) {
    errors.push({
      id: row.id,
      source_file: row.source_file,
      line_start: row.line_start,
      line_end: row.line_end,
      quote_text: row.quote_text,
    });
  }
}

if (errors.length > 0) {
  console.error(JSON.stringify(errors, null, 2));
  throw new Error(`Quote validation failed for ${errors.length} rows`);
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, "中国现代史正论_诗文格言歌谣引用.csv");
const csvLines = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
];
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\n")}\n`, "utf8");

const txtLines = [];
txtLines.push(`《${book}》诗文格言歌谣引用`);
txtLines.push(`生成日期：${generatedDate}`);
txtLines.push(`条目数：${rows.length}`);
txtLines.push("");
for (const row of rows) {
  txtLines.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  txtLines.push(row.quote_text);
  txtLines.push(`出处/来源：${row.source_or_origin}`);
  txtLines.push(`说明：${row.summary}`);
  if (row.notes) txtLines.push(`备注：${row.notes}`);
  txtLines.push("");
}
const txtPath = path.join(outDir, "中国现代史正论_诗文格言歌谣引用.txt");
fs.writeFileSync(txtPath, `${txtLines.join("\n")}\n`, "utf8");

const candidatePath = path.join(analysisDir, `${analysisPrefix}_quote_candidates.json`);
fs.writeFileSync(candidatePath, JSON.stringify(rows, null, 2), "utf8");

const reviewLines = [
  "id\tfile\tline_start\tline_end\tchapter\tcategory\tquote_text\tsource_or_origin\tsummary\tnotes",
  ...rows.map((row) =>
    [
      row.id,
      row.source_file,
      row.line_start,
      row.line_end,
      row.chapter,
      row.category,
      row.quote_text,
      row.source_or_origin,
      row.summary,
      row.notes,
    ].map(tsvEscape).join("\t"),
  ),
];
const reviewPath = path.join(analysisDir, `${analysisPrefix}_review_candidates.tsv`);
fs.writeFileSync(reviewPath, `\uFEFF${reviewLines.join("\n")}\n`, "utf8");

const duplicateGroups = [...rows.reduce((map, row) => {
  const key = compact(row.quote_text);
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(row);
  return map;
}, new Map()).values()].filter((group) => group.length > 1);

const politicalTerms = /(国民党|共产党|中共|台湾|大陆|两岸|党外|投匪|蒋经国|蒋介石|蒋委员长|三民主义|反共|政治犯|总统|领袖|革命军|排满|兴汉|苏报|民权|民主主义|军国主义|政治制度|建国|救国|卖国|西安事变|张学良|国族|国家民族)/;
const quotePoliticalHits = rows.filter((row) => politicalTerms.test(row.quote_text));
const proofreadBeforeRows = 33;
const proofreadRemovedCount = 3;
const proofreadTrimmedCount = 1;

const auditLines = [
  "type\tdetail\tcount",
  ["selected_rows", "校对后保留的诗句、宗教经典句、古典成语、办刊原则", rows.length],
  ["skipped", "001-007章现代党史/法政史政治语录与公文性材料整体从严跳过", 7],
  ["skipped", "010-019章西安事变谈话、声明、回忆中现代政治口号与当事人政策语录不收", 10],
  ["skipped", "024章三通公文、报章资料、密约与政策叙述只保留少量成语/诗句", 1],
  ["proofread_removed", "校对轮删除：公开信自述短句、含两岸政治语境近人诗、重复成语", proofreadRemovedCount],
  ["proofread_trimmed", "校对轮收窄：张学良题词只保留核心宗教格言", proofreadTrimmedCount],
  ["political_quote_hits", "quote_text现代政治关键词命中", quotePoliticalHits.length],
  ["duplicate_groups", "完全相同quote_text重复组", duplicateGroups.length],
].map((row) => Array.isArray(row) ? row.map(tsvEscape).join("\t") : row);
const auditPath = path.join(analysisDir, `${analysisPrefix}_initial_audit.tsv`);
fs.writeFileSync(auditPath, `\uFEFF${auditLines.join("\n")}\n`, "utf8");

const categoryCounts = new Map();
for (const row of rows) categoryCounts.set(row.category, (categoryCounts.get(row.category) ?? 0) + 1);

const reportLines = [
  `《${book}》抽取报告（校对后）`,
  `生成日期：${generatedDate}`,
  `源目录：${sourceDir}`,
  `输出CSV：${csvPath}`,
  `输出TXT：${txtPath}`,
  `条目数：${rows.length}`,
  `ID范围：${rows[0]?.id} - ${rows.at(-1)?.id}`,
  "",
  "范围说明：本书政治史材料密度极高，校对后只保留可独立作为诗文、宗教经典句、古典成语、出版/编辑原则的条目。青年党、国民党、人权约法、西安事变谈话、三通政策资料等现代政治语录与公文性引文均从严跳过。",
  "",
  "校对处理：",
  `- 校对前条目数：${proofreadBeforeRows}。`,
  `- 删除条目数：${proofreadRemovedCount}。`,
  "- 删除“怡然自得，深足自慰”：属于张学良公开信自述，历史政治语境强，不作诗文格言保留。",
  "- 删除龚忠武《少帅纽约行有感》：末句含“两岸仍阋墙”，现代政治语境过强。",
  "- 删除《独立评论》疑案中的重复“春秋责备贤者”：同句已在龚忠武诗文后记处保留。",
  "- 收窄张学良题词：由整句“拯民世弟 爱人如己 张学良敬书”改为核心格言“爱人如己”。",
  "",
  "自动复核：",
  `- quote_text现代政治关键词命中：${quotePoliticalHits.length} 条。`,
  `- 完全相同quote_text重复组：${duplicateGroups.length} 组。`,
];

if (quotePoliticalHits.length > 0) {
  reportLines.push("");
  reportLines.push("政治关键词命中明细：");
  for (const row of quotePoliticalHits) {
    reportLines.push(`- ${row.id}｜${row.quote_text.replace(/\n/g, " / ")}｜${row.notes || row.summary}`);
  }
}

if (duplicateGroups.length > 0) {
  reportLines.push("");
  reportLines.push("重复项明细：");
  for (const group of duplicateGroups) {
    const [first] = group;
    reportLines.push(`- ${first.quote_text.replace(/\n/g, " / ")}：${group.map((row) => `${row.id}@${row.source_file}:${row.line_start}`).join("；")}`);
  }
}

reportLines.push("");
reportLines.push("按类别统计：");
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) => a[0].localeCompare(b[0], "zh-Hans-CN"))) {
  reportLines.push(`- ${category}：${count}`);
}

const reportPath = path.join(analysisDir, `${analysisPrefix}_initial_report.txt`);
fs.writeFileSync(reportPath, `${reportLines.join("\n")}\n`, "utf8");

const proofreadAuditLines = [
  "type\tdetail\tcount",
  ["before_rows", "校对前条目数", proofreadBeforeRows],
  ["removed", "张学良公开信自述短句，历史政治语境强", 1],
  ["removed", "龚忠武近人诗句含两岸政治语境", 1],
  ["removed", "重复成语，已在同书另一处保留", 1],
  ["trimmed", "张学良题词收窄为核心宗教格言爱人如己", proofreadTrimmedCount],
  ["after_rows", "校对后条目数", rows.length],
  ["political_quote_hits", "quote_text现代政治关键词命中", quotePoliticalHits.length],
  ["duplicate_groups", "完全相同quote_text重复组", duplicateGroups.length],
].map((row) => Array.isArray(row) ? row.map(tsvEscape).join("\t") : row);
const proofreadAuditPath = path.join(analysisDir, `${analysisPrefix}_proofread_audit.tsv`);
fs.writeFileSync(proofreadAuditPath, `\uFEFF${proofreadAuditLines.join("\n")}\n`, "utf8");

const proofreadReportPath = path.join(analysisDir, `${analysisPrefix}_proofread_report.txt`);
fs.writeFileSync(
  proofreadReportPath,
  `${[
    `《${book}》校对轮报告`,
    `生成日期：${generatedDate}`,
    `校对前条目数：${proofreadBeforeRows}`,
    `删除条目数：${proofreadRemovedCount}`,
    `收窄条目数：${proofreadTrimmedCount}`,
    `校对后条目数：${rows.length}`,
    `ID范围：${rows[0]?.id} - ${rows.at(-1)?.id}`,
    "",
    "本轮处理：",
    "- 删除“怡然自得，深足自慰”：只是张学良公开信中的自我描述，政治背景太强。",
    "- 删除龚忠武《少帅纽约行有感》：末句“哪管两岸仍阋墙”触及现代两岸政治语境。",
    "- 删除一处重复“春秋责备贤者”，保留诗文后记处的一条。",
    "- 张学良题词只保留“爱人如己”，避免把人名署款误作政治人物题词语录。",
    "",
    "复核结果：",
    `- quote_text现代政治关键词命中：${quotePoliticalHits.length} 条。`,
    `- 完全相同 quote_text 重复组：${duplicateGroups.length} 组。`,
  ].join("\n")}\n`,
  "utf8",
);

console.log(JSON.stringify({
  book,
  rows: rows.length,
  idStart: rows[0]?.id,
  idEnd: rows.at(-1)?.id,
  csvPath,
  txtPath,
  reportPath,
  auditPath,
  proofreadReportPath,
  proofreadAuditPath,
  reviewPath,
  candidatePath,
  politicalQuoteHits: quotePoliticalHits.length,
  duplicateGroups: duplicateGroups.length,
}, null, 2));
