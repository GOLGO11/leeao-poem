const fs = require("fs");
const path = require("path");

const book = "李登辉的假面具";
const idPrefix = "LALDHM";
const generatedDate = "2026-06-26";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "007.李登辉的假面具");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_li_denghui_mask_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_li_denghui_mask_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_li_denghui_mask_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_li_denghui_mask_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_li_denghui_mask_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_li_denghui_mask_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_li_denghui_mask_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_li_denghui_mask_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_li_denghui_mask_proofread_report.txt");
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
  if (selector === "引言") return "《李登辉的假面具》引言.txt";
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
    .replace(/[“”‘’"'\u300c\u300d\u300e\u300f]/g, "")
    .replace(/\s+/g, "");
}

function q(selector, lineStart, quoteText, category, attributedTo, summary, lineEnd = lineStart, extraNotes = "") {
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
    source_or_origin: attributedTo,
    summary,
    notes: [
      "首轮保守收入：本书为现代人物政论集，党派、总统、台独、选举、二二八、政府报告和现代政治攻击语录一律不收；只保留可脱离政论语境的宗教典籍译文、古典诗词、哲学引文、俗谚和儒家格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    7,
    "没有人把新酒装在旧皮袋里，若是这样，皮袋就裂开，酒漏出来，连皮袋也坏了；惟独把新酒装在新皮袋里，两样就都保全了。",
    "宗教典籍译文",
    "《新约·马太福音》",
    "李敖转引《新约》旧译，说明新酒旧皮袋的原义。",
  ),
  q(
    "002.",
    15,
    "造也，吉凶所起造也。",
    "古书训诂",
    "中国古书释酒",
    "李敖转引古书对“酒”的训释，借以说明吉凶之所起。",
  ),
  q(
    "009.",
    11,
    "小和尚念经——有口无心",
    "俗语",
    "中国俗语",
    "李敖用俗语形容只会背诵而不知其义。",
  ),
  q(
    "010.",
    17,
    "半亩方塘一鉴开，天光云影共徘徊。问渠那得清如许，为有源头活水来。",
    "宋诗",
    "朱熹《观书有感》",
    "李敖转引朱熹《观书有感》全诗。",
  ),
  q(
    "010.",
    19,
    "世事短如春梦，人情薄似秋云，不须计较苦劳心，万事原来有命。幸遇三杯酒好，况逢一朵花新，片时欢笑且相亲，明日阴晴未定。",
    "宋词",
    "朱敦儒《西江月》",
    "李敖转引朱敦儒《西江月》词句。",
  ),
  q(
    "010.",
    21,
    "慈母手中线，游子身上衣；临行密密缝，意恐迟迟归。谁言寸草心，报得三春晖。",
    "唐诗",
    "孟郊《游子吟》",
    "李敖转引孟郊《游子吟》全诗。",
  ),
  q(
    "010.",
    67,
    "所谓‘致知在格物’者，言欲致吾之知，在即物而穷其理也。",
    "理学引文",
    "朱熹释《大学》",
    "李敖转引朱熹对“致知在格物”的解释。",
  ),
  q(
    "010.",
    69,
    "朱子所谓格物云者，在即物而穷其理也。是就事事物物上求其所谓定理者也。是以吾心而求理于事事物物之中，析心与理而为二矣。……若鄙人所谓致知格物者，致吾心之良知于事事物物也。吾心之良知，即所谓天理也。致吾心良知之天理于事事物物，则事事物物皆得其理矣。致吾心之良知者，致知也。事事物物皆得其理者，格物也。是合心与理为一者也。",
    "心学引文",
    "王阳明论格物致知",
    "李敖转引王阳明对朱熹格物说的辨析。",
  ),
  q(
    "011.",
    27,
    "此地无银三百两，隔壁王二不曾偷",
    "俗谚",
    "中国俗谚",
    "李敖借俗谚形容辩解反而露出破绽。",
  ),
  q(
    "020.",
    263,
    "埋骨何须桑梓地，人间无处不青山。",
    "古诗名句",
    "中国古诗",
    "李敖转引古诗，借“青山”与刘青山姓名形成双关。",
  ),
  q(
    "020.",
    503,
    "西瓜靠大边",
    "俗语",
    "中国俗语",
    "李敖用俗语形容趋附强势的一面倒心态。",
  ),
  q(
    "020.",
    515,
    "君子成人之美，不成人之恶。",
    "论语格言",
    "《论语·颜渊》",
    "李敖引用孔子语，说明批评是为匡正其失、成全其美。",
  ),
  q(
    "020.",
    507,
    "缺席的常是错的。",
    "外国格言",
    "德图什语",
    "李敖转引法国戏剧家德图什的格言。",
  ),
  q(
    "021.",
    21,
    "长袖善舞、多财善贾",
    "成语",
    "古典成语",
    "李敖用成语形容有凭借者更易施展手腕。",
  ),
];

const proofreadExclusions = new Map([
  [
    "西瓜靠大边",
    "短俗语本身可泛用，但本处贴着“台湾人出头天”和省籍一面倒的现代政治族群语境，校对轮删去。",
  ],
]);

const proofreadAdditions = [
  q(
    "010.",
    43,
    "你自家的准则，他是便知是，非便知非",
    "心学引文",
    "王阳明语",
    "李敖转引王阳明以自家准则说明良知。",
    43,
    "校对轮补入：句子本体是心学引文，不收同段关于知难行易的政治辩论语境。",
  ),
  q(
    "010.",
    75,
    "咬住青山不放松",
    "清诗名句",
    "郑燮《竹石》",
    "李敖转引郑燮《竹石》诗句。",
    75,
    "校对轮补入：只收诗句本体，不收改山名的政治讽刺语境；同书后文再现不重复收入。",
  ),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "国民党",
  "民进党",
  "台独",
  "总统",
  "副总统",
  "党主席",
  "总统府",
  "立法院",
  "行政院",
  "司法院",
  "国民大会",
  "选举",
  "司法",
  "中华民国",
  "民主",
  "主权",
  "国家元首",
  "蒋介石",
  "蒋经国",
  "李登辉",
  "李总统",
  "长荣",
  "张荣发",
  "二二八",
  "三民主义",
  "政治",
  "政党",
  "革命",
  "反共",
  "迫害",
  "暗杀",
  "平反",
  "改革",
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
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
  if (a.line_start !== b.line_start) return a.line_start - b.line_start;
  return a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN");
}

const initialRows = [...rawRows].sort(rowCompare);
const proofreadRemovedRows = initialRows
  .map((row, index) => ({
    original_id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
    ...row,
    reason: proofreadExclusions.get(row.quote_text),
  }))
  .filter((row) => row.reason);
const proofreadRows = [
  ...initialRows.filter((row) => !proofreadExclusions.has(row.quote_text)),
  ...proofreadAdditions,
].sort(rowCompare);

const rows = proofreadRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const auditRows = rows.map((row) => {
  const present = quotePresent(row);
  const politicalHits = hasPoliticalHit(row);
  return { row, present, politicalHits };
});

const missing = auditRows.filter((item) => !item.present);
const politicalHits = auditRows.filter((item) => item.politicalHits.length > 0);
const duplicateTexts = new Map();
for (const row of rows) {
  const key = normalizeText(row.quote_text);
  duplicateTexts.set(key, (duplicateTexts.get(key) || 0) + 1);
}
const duplicates = rows.filter((row) => duplicateTexts.get(normalizeText(row.quote_text)) > 1);

if (missing.length) {
  throw new Error(`Missing quote text in source: ${missing.map((item) => item.row.id).join(", ")}`);
}
if (duplicates.length) {
  throw new Error(`Duplicate quote text in ${book}: ${duplicates.map((row) => row.id).join(", ")}`);
}

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(selectedJson), { recursive: true });

const header = [
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
].join(",");

fs.writeFileSync(outCsv, `${header}\n${rows.map(rowToCsv).join("\n")}\n`, "utf8");

const txt = rows
  .map((row) =>
    [
      `${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`,
      `引用：${row.quote_text}`,
      `出处线索：${row.source_or_origin}`,
      `说明：${row.summary}`,
      row.notes ? `备注：${row.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  )
  .join("\n\n");
fs.writeFileSync(outTxt, `${book} 诗文格言歌谣引用\n生成日期：${generatedDate}\n条目数：${rows.length}\n\n${txt}\n`, "utf8");

fs.writeFileSync(selectedJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");

fs.writeFileSync(
  reviewTsv,
  [
    "id\tsource_file\tline_start\tline_end\tcategory\tquote_text\tsource_or_origin\tsummary\tnotes",
    ...rows.map((row) =>
      [
        row.id,
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.quote_text,
        row.source_or_origin,
        row.summary,
        row.notes,
      ].join("\t"),
    ),
  ].join("\n") + "\n",
  "utf8",
);

fs.writeFileSync(
  auditTsv,
  [
    "id\tsource_file\tline_start\tline_end\tpresent\tpolitical_hits\tquote_text",
    ...auditRows.map((item) =>
      [
        item.row.id,
        item.row.source_file,
        item.row.line_start,
        item.row.line_end,
        item.present ? "yes" : "no",
        item.politicalHits.join("|"),
        item.row.quote_text,
      ].join("\t"),
    ),
  ].join("\n") + "\n",
  "utf8",
);

function tsvCell(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

fs.writeFileSync(
  proofreadAuditTsv,
  [
    "action\tid_or_source\tquote_text\treason",
    `before\t\t\t${rawRows.length}`,
    ...proofreadRemovedRows.map((row) =>
      ["removed", row.original_id, row.quote_text, row.reason].map(tsvCell).join("\t"),
    ),
    ...proofreadAdditions.map((row) =>
      ["added", `${row.source_file}:${row.line_start}-${row.line_end}`, row.quote_text, row.notes].map(tsvCell).join("\t"),
    ),
    `after\t\t\t${rows.length}`,
  ].join("\n") + "\n",
  "utf8",
);

const candidatesData = fs.existsSync(candidatesJson) ? JSON.parse(fs.readFileSync(candidatesJson, "utf8")) : null;
const candidatesCount = Array.isArray(candidatesData)
  ? candidatesData.length
  : candidatesData?.quoteCandidates?.length ?? "missing";
const reviewCandidateLines = fs.existsSync(reviewCandidatesTsv)
  ? fs.readFileSync(reviewCandidatesTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";
const attributedLines = fs.existsSync(attributedTsv)
  ? fs.readFileSync(attributedTsv, "utf8").trim().split(/\r?\n/).length
  : "missing";

fs.writeFileSync(
  reportTxt,
  [
    `${book} proofread extraction report`,
    `generatedDate: ${generatedDate}`,
    `sourceDir: ${sourceDir}`,
    `sourceFiles: ${files.length}`,
    `quoteCandidates: ${candidatesCount}`,
    `reviewCandidates: ${reviewCandidateLines}`,
    `attributedLines: ${attributedLines}`,
    `rawRows: ${rawRows.length}`,
    `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
    `proofreadAddedRows: ${proofreadAdditions.length}`,
    `selectedRows: ${rows.length}`,
    `missingQuotes: ${missing.length}`,
    `duplicateTexts: ${duplicates.length}`,
    `politicalHitRows: ${politicalHits.length}`,
    "policy: this book is overwhelmingly modern political commentary; exclude party/government/election/judicial/national-identity/airline-interest/February-28 report quotations and keep only independently reusable scripture, classical poetry, philosophical quotations, proverbs, and ethical maxims.",
    "",
    "proofreadRemovedRows:",
    ...proofreadRemovedRows.map(
      (row) => `${row.original_id}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}\t${row.reason}`,
    ),
    "",
    "proofreadAddedRows:",
    ...proofreadAdditions.map((row) => `${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}`),
  ].join("\n") + "\n",
  "utf8",
);
fs.writeFileSync(proofreadReportTxt, fs.readFileSync(reportTxt, "utf8"), "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rawRows: rawRows.length,
      proofreadRemovedRows: proofreadRemovedRows.length,
      proofreadAddedRows: proofreadAdditions.length,
      rows: rows.length,
      missing: missing.length,
      duplicates: duplicates.length,
      politicalHitRows: politicalHits.length,
      outCsv,
      outTxt,
      selectedJson,
      reviewTsv,
      auditTsv,
      reportTxt,
      proofreadAuditTsv,
      proofreadReportTxt,
    },
    null,
    2,
  ),
);
