const fs = require("fs");
const path = require("path");

const book = "给外省人难看";
const idPrefix = "LAGWSRNK";
const generatedDate = "2026-06-28";
const sourceDir = path.join("《大李敖全集6.0》分章节", "013.国民党史政", "006.给外省人难看");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_make_waishengren_look_bad_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_make_waishengren_look_bad_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_make_waishengren_look_bad_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_make_waishengren_look_bad_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_make_waishengren_look_bad_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_make_waishengren_look_bad_proofread_report.txt");
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

function q(selector, lineStart, quoteText, category, sourceOrOrigin, summary, lineEnd = lineStart, extraNotes = "") {
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
    source_or_origin: sourceOrOrigin,
    summary,
    notes: [
      "校对后从严保留：《给外省人难看》以现代政党、军政、司法、官学人物与媒体攻防为主体；现代党政口号、军政发言、法律条文、公文新闻、人物辩解、民族/国家/民主自由人权等政治语录不收，只保留可脱离具体政治攻防独立检索的古典诗文、古文成句、成语俗语、文学评语和非政治生活格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q("005.", 11, "只知二五不知一十", "俗语成句", "中文俗语", "李敖摘用俗语，讥讽只看见局部而不明全账。", 11, "仅收俗语本体，不收同段现代政治人物与人权语境。"),
  q("005.", 11, "你早做声，我不至此。", "轶事名句", "苏东坡相关轶事语", "李敖引苏东坡句，责备该早出声而未出声。", 11, "仅收古人轶事句，不收同段现代政治攻防。"),

  q("006.", 11, "记取闺中梦尚新，蓓蕾温室更情亲，无端遭遇虎狼汉，赢得残躯寂寞心", "旧体诗句", "葭芬《失足恨》", "李敖引葭芬晚年诗句，呈现背盟情事中的哀怨。"),
  q("006.", 11, "浩劫终身千古恨，忍将往事忆双亲，牺牲九死诚哀怨，割舍三胎饰太平。流水无情施辣手，落花不幸扫余青。万行泪洒伤心处，重见成郞薄倖人", "旧体诗句", "葭芬奉和诗", "李敖引葭芬奉和诗，写薄倖背盟造成的终身怨苦。"),

  q("007.", 19, "好汉做事好汉当", "俗语格言", "中文俗语", "李敖引用俗语，说明做事须敢作敢当。"),
  q("007.", 23, "以武犯禁", "韩非子成句", "《韩非子》相关成句", "李敖摘引韩非子语，指出任侠式人物常以武力触犯法禁。"),
  q("007.", 23, "一朝之忿", "古典成语", "《论语》相关成句", "李敖摘用成语，写一时忿怒造成的失控。"),
  q("007.", 23, "匹夫之勇", "古典成语", "《孟子》相关成句", "李敖摘用成语，说明只凭血气的小勇。"),

  q("008.", 7, "身外之物", "成语俗语", "中文成语", "李敖借成语解释义髻、义乳、义肢等非己身所出之物。"),
  q("008.", 11, "神不歆非类，民不祀非族。", "古文成句", "陈淳《立异姓》相关引文", "李敖引宋人古文，说明祭祀继嗣须同族的传统观念。"),
  q("008.", 11, "阳若有继，而阴已绝矣！", "古文成句", "陈淳《立异姓》", "李敖引古文，写异姓继嗣表面有继、实则已绝。"),
  q("008.", 11, "莒人灭鄫。", "春秋成句", "《春秋》相关经文", "李敖引春秋书法，说明异姓主祭被视为灭国灭祀。"),
  q("008.", 13, "以无嗣为讳", "古文成句", "中文古文成句", "李敖摘出成句，说明传统社会忌讳明言无子。"),
  q("008.", 17, "称无子而养人子者，自谓同族之亲，岂施于异姓？今世行之甚众，是谓逆人伦昭穆之序，违经典绍继之义也。", "古文引文", "杜佑《通典》引范甯与谢安书", "李敖引用古文，说明古人反对以异姓为嗣的理由。"),
  q("008.", 19, "逆人伦昭穆之序，违经典绍继之义", "古文成句", "杜佑《通典》引范甯与谢安书", "李敖复摘古文要句，概括异姓继嗣违反昭穆与绍继的观念。"),
  q("008.", 21, "阳奉阴违", "成语", "中文成语", "李敖摘用成语，写表面遵从、实际违背的处世方式。"),
  q("008.", 21, "安之若素", "成语", "中文成语", "李敖摘用成语，说明在矛盾双轨中仍能泰然处之。"),
  q("008.", 21, "千古一绝", "成语俗语", "中文成语", "李敖摘用成语，形容虚伪与圆通达到罕见程度。"),

  q("016.", 11, "长袖善舞", "成语", "中文成语", "李敖借新闻标题中的成语，写善于周旋钻营的形象。"),

  q("022.", 5, "有钱能使鬼推磨", "俗语格言", "中文俗语", "李敖引用俗语，说明重金足以驱动人事。"),
  q("022.", 63, "投诉无门", "成语俗语", "中文成语", "李敖摘用成语，写求告不得其门的无奈。"),

  q("025.", 55, "强为我著书", "典故成句", "老子《道德经》成书典故", "李敖引老子成书典故，说明贤者出书有时也须他人相强。"),
  q("025.", 69, "义正词严", "成语", "中文成语", "李敖摘用成语，形容回信理直而措辞严正。"),
  q("025.", 91, "粗枝大叶，不耐细节", "现代自述成句", "吴大猷自述", "李敖复摘短句，突出粗疏而不耐细节的自我形容。"),

  q("027.", 37, "公孙子，务正学以言，无曲学以阿世。", "史记名句", "《史记·儒林列传》", "李敖引《史记》辕固语，强调治学应持正言说、不曲学逢迎。"),
  q("027.", 37, "曲学阿世", "成语", "《史记·儒林列传》相关成语", "李敖摘用成语，说明扭曲学问以逢迎世俗或权势。"),

  q("028.", 7, "不三不四", "俗语成语", "中文俗语", "李敖摘用成语，指不中不正、不像样的状态。"),

  q("029.", 9, "如醉如梦，疑幻疑真", "文学评语", "苏雪林语", "李敖摘引苏雪林语，呈现迷离恍惚的崇仰用词。"),

  q("030.", 35, "夫子自道", "成语", "中文成语", "李敖摘用成语，指出说话者无意中说出自身情形。"),
  q("030.", 63, "他右手写诗，左手写散文，忙得像和太阳系的老酋长在赛马。", "现代文学评语", "余光中广告词", "李敖转引余光中书籍广告词，呈现诗文兼写的夸饰形象。"),

  q("034.", 7, "旧女婿为新女婿，大姨夫做小姨夫。", "宋人谐语", "欧阳修相关轶事", "李敖引宋人玩笑语，写连襟姻亲关系中的谐谑。"),
  q("034.", 7, "虚与委蛇", "成语典故", "中文成语", "李敖引委蛇读音笑话，连带摘出成语本体。"),
  q("034.", 15, "斯文扫地", "成语", "中文成语", "李敖摘用成语，形容读书人风度与体面尽失。"),

  q("036.", 47, "其人思虑周祥，文笔圆到。余任内重要公文皆出其手，时人多称道之，每谓余以出洋学生而公事熟悉如此，诚属难能可贵。实皆毕先生之功也。", "回忆录引文", "施肇基《施植之先生早年回忆录》", "李敖引用施肇基回忆文字，说明大人物不掩小人物之功。"),
  q("036.", 47, "余在〔滨江关道〕任二十六个月。……经办事务烦而且重，前任后任无一终局者。余以出洋学生久任此职得无陨越者，得力于毕先生者甚大。", "回忆录引文", "施肇基《施植之先生早年回忆录》", "李敖引用施肇基回忆文字，说明自己久任要职得力于毕光祖。"),

  q("037.", 13, "胜人者有力，自胜者强。", "道家名句", "《老子》", "李敖引用老子名句，说明胜过别人只是有力，能克服自己才是真强。", 13, "仅收老子名句本体，不收同段现代政党攻防。"),
];

const proofreadExclusions = new Map(
  [
    [
      "粗枝大叶，不耐细节",
      "现代人物自述，虽非政治语录，但不属于诗文格言或稳定成句，校对从严删除。",
    ],
  ].map(([quoteText, reason]) => [normalizeText(quoteText), reason]),
);

const proofreadAdditions = [
  q(
    "029.",
    11,
    "诚玷辱士林之衣冠败类，二十四史儒林传所无之奸恶小人",
    "现代文学评语",
    "苏雪林评鲁迅语",
    "李敖转引苏雪林前后反鲁的文言式批评，呈现文学人物评价中的激烈措辞。",
  ),
];
const proofreadAdditionTexts = new Set(proofreadAdditions.map((row) => normalizeText(row.quote_text)));

const modernPoliticalTerms = [
  "国民党",
  "共产党",
  "中共",
  "民进党",
  "党外",
  "三民主义",
  "政治",
  "政党",
  "政府",
  "政权",
  "总统",
  "总理",
  "领袖",
  "党国",
  "革命",
  "反共",
  "反攻",
  "复国",
  "统一",
  "独立",
  "民主",
  "自由",
  "人权",
  "党义",
  "宪法",
  "司法",
  "法院",
  "戒严",
  "国安法",
  "军法",
  "选举",
  "立委",
  "行政院",
  "立法院",
  "监察院",
  "宣传",
  "党报",
  "党外",
];

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
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

const initialRows = rawRows.slice().sort(rowCompare);
const proofreadExcludedRows = initialRows
  .map((row, index) => ({
    ...row,
    original_id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
    proofread_reason: proofreadExclusions.get(normalizeText(row.quote_text)),
  }))
  .filter((row) => row.proofread_reason);

const selectedRows = [
  ...initialRows.filter((row) => !proofreadExclusions.has(normalizeText(row.quote_text))),
  ...proofreadAdditions,
].sort(rowCompare).map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));
const proofreadAddedRows = selectedRows.filter((row) => proofreadAdditionTexts.has(normalizeText(row.quote_text)));

const auditRows = selectedRows.map((row) => {
  const present = quotePresent(row);
  const politicalHits = hasPoliticalHit(row);
  return { row, present, politicalHits };
});

const missing = auditRows.filter((item) => !item.present);
const politicalHits = auditRows.filter((item) => item.politicalHits.length > 0);
const duplicateTexts = new Map();
for (const row of selectedRows) {
  const key = normalizeText(row.quote_text);
  duplicateTexts.set(key, (duplicateTexts.get(key) || 0) + 1);
}
const duplicates = selectedRows.filter((row) => duplicateTexts.get(normalizeText(row.quote_text)) > 1);

if (missing.length) {
  throw new Error(`Missing quote text in source: ${missing.map((item) => `${item.row.id}:${item.row.quote_text}`).join(", ")}`);
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
const header = columns.join(",");

fs.writeFileSync(outCsv, `\uFEFF${header}\r\n${selectedRows.map(rowToCsv).join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push(`《${book}》诗文格言歌谣引用`);
txt.push(`生成日期：${generatedDate}`);
txt.push(`条目数：${selectedRows.length}`);
txt.push("");
for (const row of selectedRows) {
  txt.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  txt.push(`引用：${row.quote_text}`);
  txt.push(`出处线索：${row.source_or_origin}`);
  txt.push(`摘要：${row.summary}`);
  txt.push(`备注：${row.notes}`);
  txt.push("");
}
fs.writeFileSync(outTxt, `\uFEFF${txt.join("\r\n")}\r\n`, "utf8");

fs.writeFileSync(selectedJson, `${JSON.stringify(selectedRows, null, 2)}\n`, "utf8");

const reviewHeader = [
  "id",
  "decision",
  "category",
  "quote_text",
  "source_or_origin",
  "source_file",
  "line_start",
  "line_end",
  "summary",
  "proofread_reason",
  "notes",
];
const reviewRows = [
  ...selectedRows.map((row) => ({
    ...row,
    decision: "keep-proofread",
    proofread_reason: proofreadAdditionTexts.has(normalizeText(row.quote_text))
      ? "校对补入：同章明引现代文学评语，非政治语录。"
      : "",
  })),
  ...proofreadExcludedRows.map((row) => ({
    ...row,
    id: row.original_id,
    decision: "remove-proofread",
  })),
].sort((a, b) => {
  const diff = rowCompare(a, b);
  if (diff) return diff;
  return String(a.decision).localeCompare(String(b.decision), "zh-Hans-CN");
});
const reviewLines = [
  reviewHeader.join("\t"),
  ...reviewRows.map((row) =>
    reviewHeader
      .map((column) => String(row[column] ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " "))
      .join("\t"),
  ),
];
fs.writeFileSync(reviewTsv, `${reviewLines.join("\r\n")}\r\n`, "utf8");

const auditHeader = ["id", "present", "political_hits", "duplicate_count", "quote_text", "source_file", "line_start", "line_end"];
const auditLines = [
  auditHeader.join("\t"),
  ...auditRows.map((item) =>
    [
      item.row.id,
      item.present ? "yes" : "no",
      item.politicalHits.join("|"),
      duplicateTexts.get(normalizeText(item.row.quote_text)),
      item.row.quote_text,
      item.row.source_file,
      item.row.line_start,
      item.row.line_end,
    ]
      .map((value) => String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " "))
      .join("\t"),
  ),
];
fs.writeFileSync(auditTsv, `${auditLines.join("\r\n")}\r\n`, "utf8");

const report = {
  book,
  generatedDate,
  sourceDir,
  sourceFiles: files.length,
  candidatesJson,
  reviewCandidatesTsv,
  initialRowsBeforeProofread: initialRows.length,
  proofreadRemovedRows: proofreadExcludedRows.length,
  proofreadAddedRows: proofreadAddedRows.length,
  selectedRows: selectedRows.length,
  removedRows: proofreadExcludedRows.map((row) => ({
    original_id: row.original_id,
    quote_text: row.quote_text,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
    reason: row.proofread_reason,
  })),
  addedRows: proofreadAddedRows.map((row) => ({
    id: row.id,
    quote_text: row.quote_text,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
  })),
  missingQuotes: missing.map((item) => item.row.id),
  politicalHits: politicalHits.map((item) => ({
    id: item.row.id,
    quote_text: item.row.quote_text,
    hits: item.politicalHits,
  })),
  duplicateQuotes: duplicates.map((row) => row.id),
  csvPath: outCsv,
  txtPath: outTxt,
  selectedJson,
  reviewTsv,
  auditTsv,
};
fs.writeFileSync(reportTxt, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify(report, null, 2));
