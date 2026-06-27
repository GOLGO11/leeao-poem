const fs = require("fs");
const path = require("path");

const book = "李远哲的真面目";
const idPrefix = "LALYZTF";
const generatedDate = "2026-06-26";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "010.李远哲的真面目");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_li_yuanzhe_true_face_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_li_yuanzhe_true_face_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_li_yuanzhe_true_face_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_li_yuanzhe_true_face_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_li_yuanzhe_true_face_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_li_yuanzhe_true_face_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_li_yuanzhe_true_face_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_li_yuanzhe_true_face_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_li_yuanzhe_true_face_proofread_report.txt");
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
  if (selector === "引言") return "《李远哲的真面目》引言.txt";
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
      "首轮保守收入：本书为现代人物政论与学界争议集，候选人、党派、总统、国族、选举、政府机关、公文法令、学术行政攻防和现代人物攻击语录一律不收；只保留可脱离政论语境的古典诗文、文学典故、俗谚成语和非政治性格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    11,
    "王门立雨",
    "典故化用",
    "“程门立雪”典故化用",
    "李敖以“王门立雨”化用程门立雪，形容学生向王企祥请教之恭敬。",
    11,
    "只收典故化用本体，不收同段师生恩怨论辩。",
  ),
  q(
    "001.",
    11,
    "孺子可教",
    "史记成语",
    "《史记·留侯世家》",
    "李敖借成语形容年轻学生有可教之资。",
  ),
  q(
    "001.",
    97,
    "天外有天",
    "俗语成语",
    "中国俗语",
    "潘毓刚用俗语说明学术见闻之外仍有更高境界。",
  ),
  q(
    "001.",
    123,
    "饮水思源",
    "成语",
    "中国成语",
    "李敖借成语说明受恩者应记得恩源。",
  ),
  q(
    "001.",
    135,
    "诛奸谀于既死，发潜德之幽光",
    "史论成句",
    "中国史论成句",
    "李敖借史家成句说明写史应凭证据彰善贬恶。",
    135,
    "只收史论成句本体，不收同段现代政治人物评论。",
  ),
  q(
    "001.",
    267,
    "此地不留爷，自有留爷处",
    "俗语",
    "中国俗语",
    "李敖借俗语说明离开一处后仍可另觅安身之地。",
  ),
  q(
    "001.",
    305,
    "君子之爱人也，以德；细人之爱人也，以姑息",
    "礼记文句",
    "《礼记·檀弓上》",
    "李敖借《礼记》成句区分以德相爱与姑息相护。",
  ),
  q(
    "006.",
    3,
    "化身博士",
    "外国文学书名",
    "史蒂文生《化身博士》",
    "李敖引用史蒂文生小说书名，作为人格分裂的文学典故。",
  ),
  q(
    "006.",
    3,
    "判若两人",
    "成语",
    "中国成语",
    "李敖用成语概括前后形貌与人格差异极大。",
  ),
  q(
    "007.",
    87,
    "樽前作剧莫相笑，我死诸君思此狂",
    "古典诗句",
    "陆游诗句",
    "李敖引用陆游诗句，表示生前狂态日后会令人追思。",
  ),
  q(
    "019.",
    63,
    "四两拨千斤",
    "俗语",
    "中国俗语",
    "来信者用俗语形容浦薛凤行政手腕圆熟、善以小力化大局。",
  ),
  q(
    "019.",
    63,
    "两岸猿声啼不住，轻舟已过万重山",
    "唐诗名句",
    "李白《早发白帝城》",
    "来信者借李白诗句形容事情已轻快越过险阻。",
  ),
  q(
    "021.",
    23,
    "隔行如隔山",
    "俗语",
    "中国俗语",
    "潘毓刚借俗语说明不同专业分支之间隔阂很深。",
  ),
  q(
    "021.",
    29,
    "事在人为",
    "俗语成语",
    "中国俗语",
    "潘毓刚借俗语说明行政能力可以靠学习与作为养成。",
  ),
];

const proofreadExclusions = new Map([
  [
    "诛奸谀于既死，发潜德之幽光",
    "校对轮删除：同段紧贴蒋介石、墨索里尼等现代政治人物评论，虽有史论成句外形，但政治史论语境过重。",
  ],
]);

const proofreadAdditions = [
  q(
    "001.",
    175,
    "石沉大海",
    "成语",
    "中国成语",
    "李敖借成语形容书信或请求毫无回音。",
    175,
    "校对轮补入：只收成语本体，不收同段现代学界人事争议。",
  ),
  q(
    "001.",
    175,
    "言笑晏晏",
    "诗经成句",
    "《诗经·卫风·氓》",
    "李敖借《诗经》成句形容人际往来仍谈笑如常。",
    175,
    "校对轮补入：只收古典成句本体，不收同段现代学界人事争议。",
  ),
  q(
    "019.",
    61,
    "虽千万人吾往矣",
    "孟子成句",
    "《孟子·公孙丑上》",
    "来信者借孟子成句形容坚持应为之事的担当。",
  ),
  q(
    "019.",
    71,
    "为所当为",
    "处世格言",
    "浦薛凤语",
    "来信者转述浦薛凤关于做该做之事、不计荣辱得失的格言。",
    71,
    "校对轮补入：只收处世格言本体。",
  ),
  q(
    "019.",
    71,
    "君子道消、小人道长",
    "古典成语",
    "中国古语",
    "来信者借古语形容正道衰退而小人气焰增长。",
    71,
    "校对轮补入：只收古语本体，不收同段公共事务评论。",
  ),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "国民党",
  "民进党",
  "新党",
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
  "三民主义",
  "蒋介石",
  "蒋经国",
  "李登辉",
  "陈水扁",
  "阿扁",
  "李远哲",
  "李总统",
  "二二八",
  "政治",
  "政党",
  "政权",
  "革命",
  "反共",
  "情报局",
  "警备总部",
  "戒严",
  "党禁",
  "大陆政策",
  "中央研究院",
  "中研院",
  "院长",
  "政见",
  "阁揆",
  "国策顾问",
  "国政顾问",
  "教育改革",
  "教改",
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
    "policy: this book is overwhelmingly modern political commentary and academic-administrative dispute writing; exclude candidate, party, president, national identity, election, government-agency, official-document, legal, and modern attack quotations, while keeping independently reusable classical, literary, philosophical, proverbial, and non-political poetic material.",
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
