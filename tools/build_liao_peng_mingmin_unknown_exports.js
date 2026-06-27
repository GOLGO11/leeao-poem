const fs = require("fs");
const path = require("path");

const book = "你不知道的彭明敏";
const idPrefix = "LAPMMUNK";
const generatedDate = "2026-06-26";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "011.你不知道的彭明敏");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_peng_mingmin_unknown_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_peng_mingmin_unknown_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_peng_mingmin_unknown_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_peng_mingmin_unknown_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_peng_mingmin_unknown_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_peng_mingmin_unknown_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_peng_mingmin_unknown_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_peng_mingmin_unknown_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_peng_mingmin_unknown_proofread_report.txt");
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
  if (selector === "引言") return "《你不知道的彭明敏》引言.txt";
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
      "首轮保守收入：本书为彭明敏相关现代政论、党派争议和司法/国族论述密集文本，候选人、党派、总统、台独、国族、选举、政府机关、公文法令、司法案件、政治理论和人物攻防语录一律不收；只保留可脱离政论语境的古典诗文、经史成句、俗谚和非政治性格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    33,
    "可与同患，难与处安",
    "古语",
    "中国古语",
    "李敖引用古语，说明某类人可共患难而难以共安乐。",
    33,
    "只收古语本体，不收同段现代人物与政治路线评论。",
  ),
  q(
    "002.",
    45,
    "何世无奇才，遗之在草泽！",
    "古典诗句",
    "晋朝诗人诗句",
    "李敖引用诗句感叹奇才常被遗落在草野之间。",
    47,
    "只收诗句本体，不收同段现实政治处境论述。",
  ),
  q(
    "011.",
    53,
    "死别已吞声，生别常恻恻。江南瘴疠地，逐客无消息。故人入我梦，明我长相忆。恐非平生魂，路远不可测。魂来枫林青，魂返关塞黑。君今在罗网，何以有羽翼？落月满屋梁，犹疑照颜色。水深波浪阔，无使蛟龙得。",
    "唐诗",
    "杜甫《梦李白》二首之一",
    "李敖附录杜甫《梦李白》第一首，借古诗中的生别、梦魂与险阻意象寄意。",
    67,
  ),
  q(
    "011.",
    69,
    "浮云终日行，游子久不至。三夜频梦君，情亲见君意。告归常局促，苦道来不易。江湖多风波，舟楫恐失坠。出门搔白首，若负平生志。冠盖满京华，斯人独憔悴。孰云网恢恢，将老身反累。千秋万岁名，寂寞身后事。",
    "唐诗",
    "杜甫《梦李白》二首之二",
    "李敖附录杜甫《梦李白》第二首，借古诗中的游子、风波、憔悴和身后名意象寄意。",
    83,
  ),
  q(
    "013.",
    9,
    "吾道一以贯之",
    "论语成句",
    "《论语·里仁》",
    "李敖引用孔子成句，说明自己的根本路线一以贯之。",
  ),
  q(
    "013.",
    17,
    "述而不作，信而好古，窃比于我老彭",
    "论语化用",
    "《论语·述而》化用",
    "李敖引用并改动《论语》成句，把“老彭”牵引到彭明敏姓名上。",
  ),
  q(
    "013.",
    17,
    "述而又作，信而好古，窃比于我老彭",
    "论语戏拟",
    "李敖化用《论语·述而》",
    "李敖把《论语》成句改成“述而又作”，形成戏拟性的书写格言。",
  ),
  q(
    "014.",
    43,
    "成功者多爹，失败者孤儿",
    "西谚",
    "西方谚语",
    "李敖引用西谚，说明成功常被多人认领，失败却无人承担。",
  ),
  q(
    "016.",
    9,
    "天行有常，不为尧存，不为桀亡",
    "荀子成句",
    "《荀子·天论》",
    "李敖引用荀子成句，说明天道自有常规，不因贤君暴君而改变。",
  ),
  q(
    "016.",
    13,
    "如果你想害一个人，你就劝他办杂志",
    "出版格言",
    "李敖语",
    "李敖自称旧日名言，借办杂志之艰苦形成出版业格言。",
    13,
    "只收出版格言本体，不收同段办报处境与现实攻防。",
  ),
  q(
    "016.",
    17,
    "老去无端玩古董",
    "现代诗句",
    "周作人打油诗句",
    "李敖引用周作人打油诗句，借老境中无端转向旧物的幽默感自况。",
  ),
  q(
    "020.",
    19,
    "感谢光明但别忘了在黑暗中执灯的朋友",
    "格言",
    "印度诗人语",
    "李敖引用印度诗人格言，提醒人在迎向光明时也要记得黑暗中相助者。",
    19,
    "只收友谊与感恩格言本体，不收同段政治运动语境。",
  ),
];

const proofreadExclusions = new Map([
  [
    "吾道一以贯之",
    "校对轮删除：此处主要服务于“一大张报”的文字游戏，且同句紧贴共产党、国民党党报比较，政论语境过重。",
  ],
]);

const proofreadAdditions = [
  q(
    "009.",
    5,
    "公自平生怀直气，谁能晚节负初心？",
    "古典诗句",
    "古人诗句",
    "李敖引用古诗，称许人应保有平生直气，不在晚节背弃初心。",
    5,
    "校对轮补入：只收诗句本体，不收同段国民党、政治挂帅和现实人物论述。",
  ),
  q(
    "016.",
    15,
    "More than half of modem culture depends on what one shouldn’t read",
    "外国文学格言",
    "Oscar Wilde（源文作 Oscar Wide）",
    "李敖引用王尔德格言，说明现代文化有相当部分取决于人不该读什么。",
    15,
    "校对轮补入：源文作 Oscar Wide 与 modem，疑为 OCR 形态；quote_text 按源文保留以便回查。",
  ),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "国民党",
  "民进党",
  "党外",
  "台独",
  "独台",
  "总统",
  "副总统",
  "总统府",
  "立法院",
  "行政院",
  "司法院",
  "国民大会",
  "选举",
  "竞选",
  "司法",
  "中华民国",
  "台湾自救",
  "自救宣言",
  "彭明敏",
  "彭先生",
  "黄华",
  "谢聪敏",
  "魏廷朝",
  "国族",
  "国家",
  "民族",
  "三民主义",
  "蒋介石",
  "蒋经国",
  "李登辉",
  "陈水扁",
  "阿扁",
  "政治",
  "政党",
  "政权",
  "革命",
  "反共",
  "调查局",
  "情报局",
  "警备总部",
  "戒严",
  "党禁",
  "法庭",
  "叛乱",
  "军机",
  "保安司令部",
  "宪法",
  "民主",
  "自由主义",
  "独裁",
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
if (politicalHits.length) {
  throw new Error(
    `Political terms in selected quote text: ${politicalHits
      .map((item) => `${item.row.id}(${item.politicalHits.join("|")})`)
      .join(", ")}`,
  );
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
const quoteCandidates = Array.isArray(candidatesData)
  ? candidatesData.filter((row) => row.kind === "quote").length
  : candidatesData?.quoteCandidates?.length ?? "missing";
const keywordLines = Array.isArray(candidatesData)
  ? candidatesData.filter((row) => row.kind === "keyword_line").length
  : candidatesData?.keywordLines ?? "missing";
const reviewCandidateLines = fs.existsSync(reviewCandidatesTsv)
  ? fs.readFileSync(reviewCandidatesTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";
const attributedLines = fs.existsSync(attributedTsv)
  ? fs.readFileSync(attributedTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";

fs.writeFileSync(
  reportTxt,
  [
    `${book} proofread extraction report`,
    `generatedDate: ${generatedDate}`,
    `sourceDir: ${sourceDir}`,
    `sourceFiles: ${files.length}`,
    `quoteCandidates: ${quoteCandidates}`,
    `keywordLines: ${keywordLines}`,
    `reviewCandidates: ${reviewCandidateLines}`,
    `attributedLines: ${attributedLines}`,
    `rawRows: ${rawRows.length}`,
    `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
    `proofreadAddedRows: ${proofreadAdditions.length}`,
    `selectedRows: ${rows.length}`,
    `missingQuotes: ${missing.length}`,
    `duplicateTexts: ${duplicates.length}`,
    `politicalHitRows: ${politicalHits.length}`,
    "policy: this book is overwhelmingly modern political commentary about Peng Ming-min and Taiwan public affairs; exclude party, Taiwan-independence, candidate, president, national identity, election, government-agency, legal-case, judicial, political-theory, and modern attack quotations, while keeping independently reusable classical poems, canonical sayings, proverbs, and non-political literary or publishing aphorisms.",
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
      quoteCandidates,
      keywordLines,
      reviewCandidates: reviewCandidateLines,
      attributedLines,
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
