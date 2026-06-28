const fs = require("fs");
const path = require("path");

const book = "国民党臭史";
const idPrefix = "LAGMDCS";
const generatedDate = "2026-06-28";
const sourceDir = path.join("《大李敖全集6.0》分章节", "013.国民党史政", "003.国民党臭史");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_kuomintang_ugly_history_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_kuomintang_ugly_history_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_kuomintang_ugly_history_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_kuomintang_ugly_history_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_kuomintang_ugly_history_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_kuomintang_ugly_history_proofread_report.txt");
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
      "校对后从严收入：《国民党臭史》以现代党史、党国宣传、司法/军政、反共复国、爆炸暗杀、选举外交和人物攻防为主体；现代政党、政权、政府机关、领袖、军政、革命、反共/反攻/复国、统独、民主自由人权、司法整肃、暴力恐怖与宣传攻防语录不收，只保留可脱离具体政治攻防独立检索的古典诗文、成语俗语、家训、宗教/文学典故、外文格言和非政治生活格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q("002.", 9, "读书万卷不知律", "文学成句", "苏轼相关成句", "李敖引苏东坡成句，写只会死读书而不懂法律。"),

  q("004.", 7, "家里光棍", "北方土话", "中国北方土话", "李敖引用北方土话，形容只在家里神气、出门吃瘪的人。"),
  q("004.", 7, "在家如狮，出门如鼠", "外文谚语译句", "英文谚语", "李敖转引英文谚语，表达在家凶猛、出门胆怯的反差。"),

  q("005.", 39, "太傅冲和未易师", "旧体诗句", "胡汉民咏谭延闿诗句", "李敖引用胡汉民诗句，赞谭延闿雍容冲和。"),
  q("005.", 67, "一蟹不如一蟹", "俗语成语", "中文俗语", "李敖化用俗语，写后者一代不如一代。"),
  q("005.", 71, "唾面自干", "成语典故", "娄师德相关典故", "李敖摘引古人成语，写忍辱自持。"),
  q("005.", 73, "有容乃大", "格言成语", "中文格言", "李敖摘出常见格言，表达能包容所以气象宏大。"),

  q("006.", 11, "一朝权在手，便把令来行", "俗语", "中文俗语", "李敖引俗语，写掌权后立刻发号施令的姿态。"),

  q("009.", 75, "我辈从无阿世想，立言何必瞰时宜。", "旧体诗句", "陶希圣《送晋生家麟赴美讲学》", "李敖引用旧体诗句，呈现自称不逢迎世俗的文字姿态。"),
  q("009.", 117, "正其谊又谋其利", "儒家成句化用", "董仲舒“正其谊不谋其利”相关化用", "李敖摘出成句变体，写义利并举的现代语境。"),

  q("011.", 23, "不孝有三，无后为大", "儒家成句", "《孟子·离娄上》相关成句", "李敖引用传统孝道成句，说明宗族继嗣压力。"),
  q("011.", 29, "神不歆非类，民不祀非族。", "古文成句", "陈淳《立异姓论》", "李敖引宋人古文，说明继嗣以同族为正的观念。"),
  q("011.", 29, "阳若有继，而阴已绝矣！", "古文成句", "陈淳《立异姓论》", "李敖引古文，写异姓继嗣表面有继、实则已绝。"),
  q("011.", 35, "称无子而养人子者，自谓同族之亲，岂施于异姓？今世行之甚众，是谓逆人伦昭穆之序，违经典绍继之义也。", "古文引文", "杜佑《通典》引范甯与谢安书", "李敖引用古文，说明古人反对以异姓为嗣的理由。"),
  q("011.", 65, "自外人而非正者曰义，义父、义儿、义兄、义弟、义服之类是也。", "古文释义", "洪迈《容斋随笔》", "李敖引用洪迈释义，解释“义”作非正出之称。"),
  q("011.", 65, "以外置而合宜者，故今人谓假父曰义父，假子曰义子、义女。", "古文释义", "翟灝《通俗篇》引谢肇淛《文海披沙》", "李敖引用古书释义，解释义父、义子、义女等称谓。"),
  q("011.", 71, "切勿轻纳异姓，更恐将来改移，反成怨衅", "家训", "徐三重《家则》", "李敖引用明人家训，警告不可轻易收养异姓子。"),
  q("011.", 85, "世道衰，人伦坏，而亲疏之理反其常", "史评古文", "欧阳修《义儿传》相关评语", "李敖摘引欧阳修立传重点，说明亲疏伦理反常。"),

  q("013.", 65, "所有的礼物我都收下了，但从你的口里，我不敢收任何东西。", "寓言名句", "伊索寓言", "李敖转引伊索寓言句子，写对有毒来源的警惕。"),
  q("013.", 97, "明足以察秋毫而不见舆薪", "孟子成句", "《孟子·梁惠王上》相关成句", "李敖摘引孟子成句，写能察小而不能见大。"),
  q("013.", 115, "种瓜得瓜，种豆得豆", "俗语", "中文俗语", "李敖引用因果式俗语，说明种下什么就收获什么。"),

  q("015.", 13, "不得中行而与之，必也狂狷乎！狂者进取，狷者有所不为也。", "儒家名句", "《论语·子路》", "李敖引用孔子论狂狷的原句，说明狷者有所不为。"),
  q(
    "015.",
    13,
    "Since I cannot get men pursuing the due medium, to whom I might communicate my instructions，I must find the ardent and the cautiously-decided. The ardent will advance and lay hold of truth；the cautiously-decided will keep themselves from what is wrong.",
    "外文经典译文",
    "James Legge 英译《论语》",
    "李敖转引理雅格英译，解释狂者与狷者的两种人格。",
  ),
  q("015.", 13, "不能从俗", "史传成句", "《后汉书·范冉传》相关成句", "李敖摘引史传短语，说明狷者不随俗流。"),

  q("016.", 11, "望门投止", "文学典故", "张俭典故；谭嗣同诗句相关", "李敖摘引典故，写危急时投靠他门求庇护。", 11, "仅收典故本体，不收同段政治犯、党外人士、暴力案与现代司法攻防叙述。"),
  q("016.", 11, "好将轻侠藏亡命", "诗句化用", "谭嗣同《狱中题壁》相关诗句", "李敖摘引诗句，写轻侠藏匿亡命者的旧诗意象。", 11, "仅收诗句意象本体，不收同段政治犯、党外人士、暴力案与现代司法攻防叙述。"),

  q("017.", 3, "但愿空诸所有，慎勿实诸所无。", "佛教居士格言", "庞居士临终名言", "李敖引用庞居士名言，说明有无之间的立身态度。"),

  q("024.", 7, "挂帆沧海，风波茫茫，或沦无底，或达仙乡。", "译诗名句", "严复《天演论》译英国诗句", "李敖引用严复译诗，写无底与仙乡之间的命运抉择。"),
  q("024.", 9, "放下屠刀，便可立地成佛", "佛教俗语", "中文佛教俗语", "李敖摘引佛教俗语，写弃恶从善即可成佛的说法。"),

  q("028.", 79, "束发而就大学。", "古礼文句", "《大戴礼》", "李敖引古礼文句，说明束发与成童入学。"),
  q("028.", 79, "将冠者，采衣，紒（束发、结发也）。", "古礼注疏", "《仪礼注疏》", "李敖引用古礼注疏，解释束发、结发。"),
  q("028.", 79, "锦束发，皆朱锦也。紒即结发。", "古礼注疏", "《仪礼注疏》注", "李敖引用注疏文字，说明锦束发与紒的含义。"),
  q("028.", 305, "及时的一针可省九针", "外文格言译句", "英语谚语 A stitch in time saves nine", "李敖指出这是英语日用格言的译句。"),
  q("028.", 305, "做错事是人之常情", "外文格言译句", "英语格言 To err is human", "李敖指出这是英语中流传的普通格言。"),
  q("028.", 305, "唯信仰可以移山", "宗教/外文格言译句", "Faith moves mountains；圣经相关成句", "李敖指出这是西方普通格言而非个人原创。"),
  q("028.", 307, "人同此心，心同此理", "成语格言", "中文成语格言", "李敖摘出常见成语格言，说明人心与道理相通。"),
];

const modernPoliticalTerms = [
  "国民党",
  "共产党",
  "中共",
  "台独",
  "三民主义",
  "政治",
  "政党",
  "政府",
  "政权",
  "总统",
  "领袖",
  "总理",
  "国父",
  "革命",
  "反共",
  "反攻",
  "复国",
  "统一",
  "民主",
  "自由",
  "人权",
  "党义",
  "司法",
  "法院",
  "检察",
  "警察",
  "军法",
  "暴力",
  "暗杀",
  "炸",
  "选举",
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

const selectedRows = rawRows.sort(rowCompare).map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

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

fs.writeFileSync(outCsv, `${header}\n${selectedRows.map(rowToCsv).join("\n")}\n`, "utf8");

const txt = selectedRows
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

fs.writeFileSync(outTxt, `${book} 诗文格言歌谣引用\n生成日期：${generatedDate}\n条目数：${selectedRows.length}\n\n${txt}\n`, "utf8");
fs.writeFileSync(selectedJson, `${JSON.stringify(selectedRows, null, 2)}\n`, "utf8");

fs.writeFileSync(
  reviewTsv,
  [
    "id\tsource_file\tline_start\tline_end\tcategory\tquote_text\tsource_or_origin\tsummary\tnotes",
    ...selectedRows.map((row) =>
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

const candidatesData = fs.existsSync(candidatesJson) ? JSON.parse(fs.readFileSync(candidatesJson, "utf8")) : [];
const quoteCandidates = Array.isArray(candidatesData)
  ? candidatesData.filter((row) => row.kind === "quote").length
  : "missing";
const keywordLines = Array.isArray(candidatesData)
  ? candidatesData.filter((row) => row.kind === "keyword_line").length
  : "missing";
const uniqueQuoteTexts = Array.isArray(candidatesData)
  ? new Set(candidatesData.filter((row) => row.kind === "quote").map((row) => normalizeText(row.text))).size
  : "missing";
const reviewCandidateLines = fs.existsSync(reviewCandidatesTsv)
  ? fs.readFileSync(reviewCandidatesTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";
const proofreadRemovedRows = [];
const proofreadAdditions = [];

const reportLines = [
  `${book} proofread extraction report`,
  `generatedDate: ${generatedDate}`,
  `sourceDir: ${sourceDir}`,
  `sourceFilesForExport: ${files.length}`,
  `quoteCandidates: ${quoteCandidates}`,
  `uniqueQuoteTexts: ${uniqueQuoteTexts}`,
  `keywordLines: ${keywordLines}`,
  `reviewCandidates: ${reviewCandidateLines}`,
  `initialRowsBeforeProofread: ${rawRows.length}`,
  `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
  `proofreadAddedRows: ${proofreadAdditions.length}`,
  `selectedRows: ${selectedRows.length}`,
  `missingQuotes: ${missing.length}`,
  `duplicateTexts: ${duplicates.length}`,
  `politicalHitRows: ${politicalHits.length}`,
  "policy: this book is dominated by modern Kuomintang history, party-state propaganda, judicial/military systems, anti-communist and recovery rhetoric, explosions/assassinations, elections, diplomacy, and political attack material; exclude direct modern party, regime, state, leader, military, revolution, anti-communist, counteroffensive, recovery, unification/independence, democracy/freedom/human-rights, judicial-purge, violence/terror, and propaganda-attack quotations. Keep only independently reusable classical poetry/prose, idioms, proverbs, family maxims, religious/literary allusions, foreign maxims, and non-political life sayings.",
  "",
  "selectedHighlights:",
  "- 002/004/005/006: 收苏东坡成句、北方土话、英文谚语、胡汉民诗句、成语俗语与“一朝权在手”；现代法制、党报、政府、党国运动和人权政论原话不收。",
  "- 009/011: 收陶希圣旧体诗句、义利成句化用、孟子孝道语、继嗣古文、古书释义、徐三重家训和欧阳修史评；现代国共、汉奸、宣传与军政叙述不收。",
  "- 013/015/016/017/024: 收伊索寓言、孟子成句、俗语、《论语》及理雅格英译、张俭/谭嗣同典故、庞居士格言、严复译诗和佛教俗语；炸报、政治犯、暴力、反共复国与意识形态段落不收。",
  "- 028: 收束发古礼文句、英语日用格言和“人同此心，心同此理”；蒋氏遗嘱、反共抗俄、民有民治、自由平等博爱、毋忘在莒及司法攻防语录不收。",
  "",
  "proofreadChanges:",
  "- 本轮复核 36 条保留项，未删除、未增补；新增 proofread 审核表与报告。",
  "- 复核政治上下文命中项后，仅保留可脱离现代政党/政权攻防独立检索的古典诗文、俗语、家训、寓言、译诗和外文日用格言。",
  "- 继续排除“无偏无党”“君子不党”“群而不党”“民有、民享、民治”“自由、平等、博爱”“毋忘在莒”等党史论战或政治口号化条目。",
  "",
  "excludedHighlights:",
  "- 001 司法冤案、死刑、证据和罗生门段落以司法/人权攻防为主体，首轮不收。",
  "- 003/012 的“无偏无党”“君子不党”“群而不党”虽有古典出处，但本册直接用于党字、政党结构和一党政治论战，按硬口径排除。",
  "- 005 孙文贺电、北洋军阀、党国文献和“误国之罪，百身莫赎”等属政治史评或党国口号，首轮不收。",
  "- 013 富兰克林伪引、炸报分析、暴力与因果报应论战不收，只保留伊索寓言、孟子成句与俗语本体。",
  "- 016 三国孟获段虽是文学引用，但通篇被用作政治犯假释与军法/暗杀攻防比附，首轮从严不收。",
  "- 022 五四、民主科学救国、三民主义和胡适党派判断均属现代思想政治语录，首轮不收。",
  "- 028 “民有、民享、民治”“自由、平等、博爱”“毋忘在莒”虽有名言/古典性质，但本册直接嵌在政治口号、反攻复国和诉讼攻防中，首轮从严不收。",
  "- 027 王宠惠轶事幽默可读，但更像人物笑谈，不属诗文格言歌谣主体，首轮不收。",
];

fs.writeFileSync(reportTxt, reportLines.join("\n") + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rows: selectedRows.length,
      missing: missing.length,
      duplicates: duplicates.length,
      politicalHitRows: politicalHits.length,
      quoteCandidates,
      uniqueQuoteTexts,
      keywordLines,
      reviewCandidates: reviewCandidateLines,
      outCsv,
      outTxt,
      selectedJson,
      reviewTsv,
      auditTsv,
      reportTxt,
    },
    null,
    2,
  ),
);
