const fs = require("fs");
const path = require("path");

const book = "陈水扁的真面目";
const idPrefix = "LACSBTF";
const generatedDate = "2026-06-26";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "009.陈水扁的真面目");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_chen_shuibian_true_face_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_chen_shuibian_true_face_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_chen_shuibian_true_face_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_chen_shuibian_true_face_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_chen_shuibian_true_face_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_chen_shuibian_true_face_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_chen_shuibian_true_face_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_chen_shuibian_true_face_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_chen_shuibian_true_face_proofread_report.txt");
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
  if (selector === "前言") return "《陈水扁的真面目》前言（李庆元）.txt";
  if (selector === "引言") return "《陈水扁的真面目》引言.txt";
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
      "首轮保守收入：本书为现代人物政论集，候选人、党派、总统、台独、选举、政权、政策、司法和现代政治攻防语录一律不收；只保留可脱离政论语境的古典诗文、文学格言、哲学引文、俗谚和非政治性诗句。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "前言",
    5,
    "该出手时就出手",
    "影视歌词",
    "电视剧《水浒传》歌词",
    "李庆元引用《水浒传》电视剧歌词，表达当机立断的江湖胆识。",
    5,
    "只收歌词短句本体，不收同段总统大选与人物攻防语境。",
  ),
  q(
    "引言",
    11,
    "唯上智与下愚最难移",
    "论语成句",
    "《论语·阳货》",
    "李敖借《论语》成句说明极智与极愚都难以改变。",
    11,
    "只收古典成句本体，不收同段选举与政治人物比较。",
  ),
  q(
    "003.",
    119,
    "有土斯有财",
    "俗语",
    "中国俗语",
    "李庆元用俗语说明土地与财富观念的关系。",
  ),
  q(
    "004.",
    35,
    "内神通外鬼",
    "俗语成语",
    "中国俗语",
    "李庆元借俗语形容内外勾连的情形。",
  ),
  q(
    "010.",
    21,
    "多年媳妇熬成婆",
    "俗语",
    "中国俗语",
    "李庆元用传统俗语比喻受压者转而压人的循环。",
  ),
  q(
    "011.",
    55,
    "长敌人志气，灭自己威风",
    "俗语",
    "中国俗语",
    "李庆元转述陈水扁引用俗语，形容使对方气势上升而削弱自身。",
    55,
    "只收俗语本体，不收同段党派路线争执。",
  ),
  q(
    "012.",
    13,
    "当我用一个字眼时候，它的意思就只是我要它表达的意思——既不多，也不少。",
    "外国文学引文",
    "路易斯·卡罗尔《镜中奇遇记》",
    "李敖转引汉普特·邓普特关于词义由说话者规定的文学对白。",
  ),
  q(
    "012.",
    13,
    "问题是，你不能拿字眼又当这个讲又当那个讲。",
    "外国文学引文",
    "路易斯·卡罗尔《镜中奇遇记》",
    "李敖转引阿丽丝反驳汉普特·邓普特任意改变词义的话。",
  ),
  q(
    "012.",
    13,
    "问题是，谁说了算而已。",
    "外国文学引文",
    "路易斯·卡罗尔《镜中奇遇记》",
    "李敖转引汉普特·邓普特关于解释权的文学对白。",
  ),
  q(
    "012.",
    15,
    "当一名绅士的难处之一是，你不被允许粗暴的主张自己的权利。",
    "外国人物格言",
    "巴特勒语",
    "李敖转引美国哥伦比亚大学校长巴特勒关于绅士风度与权利表达的格言。",
  ),
  q(
    "012.",
    15,
    "其争也君子",
    "论语成句",
    "《论语·八佾》",
    "李敖借《论语》成句说明即使有争也应保持君子风度。",
  ),
  q(
    "012.",
    21,
    "约定俗成",
    "荀子成语",
    "《荀子·正名》",
    "李敖引用荀子成语说明社会规范可由习惯形成。",
  ),
  q(
    "013.",
    19,
    "为了目的，不择手段",
    "伦理命题",
    "通行格言",
    "李敖把目的可以正当化手段的说法列为谬误。",
  ),
  q(
    "013.",
    23,
    "不要给我目的而不告以手段，目的与手段是交织得不可分的。",
    "外国诗句",
    "拉萨尔诗句",
    "李敖转引拉萨尔诗句，说明目的与手段不可分割。",
    25,
  ),
  q(
    "017.",
    5,
    "楚王出游，亡弓，左右请求之。亡曰：‘止！楚王失弓，楚人得之，又何求之？’孔子闻之曰：‘惜乎其不大也！不曰人遗弓，人得之而已，何必楚也？’",
    "古典轶事",
    "《孔子家语》",
    "李敖引用《孔子家语》楚王失弓故事，说明胸襟应超越地域之私。",
  ),
  q(
    "018.",
    7,
    "天下之恶皆归之",
    "史论成语",
    "中国史书成语",
    "李敖借中国历史成语概括把所有恶名集中归咎一人的做法。",
  ),
  q(
    "024.",
    133,
    "噫嚱吁！悲乎哉！汝全台，昨何忠勇今何怯，万事反复随转睫。平时战守无豫备，曰忠曰义何所恃？",
    "近代诗句",
    "黄遵宪《台湾行》",
    "李敖引用黄遵宪《台湾行》末段，感叹反复与怯弱。",
  ),
  q(
    "024.",
    145,
    "人家说你是好汉，我就哭了，我宁愿你，只是孩子的父亲！",
    "现代诗句",
    "方素敏《盼望》",
    "李敖转引方素敏诗句，表现家人对受难者身份与家庭角色的拉扯。",
    145,
    "同句在原文说明首尾重复，单收一次。",
  ),
  q(
    "024.",
    161,
    "华而睆！大夫之箦与！",
    "礼记文句",
    "《礼记·檀弓上》曾子易箦故事",
    "李敖引曾子易箦故事中童子指出席子僭礼的古文。",
  ),
  q(
    "024.",
    161,
    "然！斯季孙之赐也。我未之能易也。元！起易箦！",
    "礼记文句",
    "《礼记·檀弓上》曾子易箦故事",
    "李敖引曾子临终要求换席的古文。",
  ),
  q(
    "024.",
    161,
    "尔之爱我也，不如彼！君子之爱人也，以德；细人之爱人也，以姑息。吾何求哉！吾得正而毙焉，斯已矣！",
    "礼记文句",
    "《礼记·檀弓上》曾子易箦故事",
    "李敖引曾子临终论君子之爱与姑息之爱的古文。",
  ),
];

const proofreadExclusions = new Map([
  ["长敌人志气，灭自己威风", "陈水扁在党派路线争执中的政治发言，虽借俗语外形，但本书目标排除现代政治攻防语录。"],
  ["天下之恶皆归之", "用于美丽岛案、宋楚瑜与律师团归责的现代政治论辩，独立文学格言价值不足。"],
]);

const proofreadAdditions = [
  q(
    "003.",
    29,
    "聪明人绝不搬砖砸脚",
    "俗语",
    "中国俗语",
    "李庆元用俗语说明聪明人不会自留可查把柄。",
    29,
    "校对轮补入：只收俗语本体，不收同段财产申报与人物调查语境。",
  ),
  q(
    "024.",
    219,
    "只闻楼梯响不见人下来",
    "俗语",
    "中国俗语",
    "访谈中借俗语形容期待落空、迟迟不见实际行动。",
    219,
    "校对轮补入：只收俗语本体，不收同段蓬莱岛案与党外上诉争议。",
  ),
  q(
    "024.",
    233,
    "止于至善",
    "大学成句",
    "《大学》",
    "李敖借《大学》成句说明行动与判断应追求最高的善。",
    233,
    "校对轮补入：只收儒家成句本体，不收同段党外人物论辩。",
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
  "三民主义",
  "蒋介石",
  "蒋经国",
  "李登辉",
  "陈水扁",
  "阿扁",
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
  "两岸",
  "大陆政策",
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
    "policy: this book is overwhelmingly modern political commentary; exclude candidate, party, president, Taiwan independence, election, regime, policy, judicial, and modern political attack quotations, while keeping independently reusable classical, literary, philosophical, proverbial, and non-political poetic material.",
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
