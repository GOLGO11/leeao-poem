const fs = require("fs");
const path = require("path");

const book = "郑南榕研究";
const idPrefix = "LAZNYJ";
const generatedDate = "2026-06-26";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "008.郑南榕研究");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_zheng_nanrong_study_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_zheng_nanrong_study_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_zheng_nanrong_study_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_zheng_nanrong_study_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_zheng_nanrong_study_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_zheng_nanrong_study_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_zheng_nanrong_study_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_zheng_nanrong_study_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_zheng_nanrong_study_proofread_report.txt");
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
  if (selector === "自序") return "《郑南榕研究》自序.txt";
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
      "首轮保守收入：本书为现代人物政论集，党派、台独、选举、情报局、革命、国家认同和现代政治攻击语录一律不收；只保留可脱离政论语境的古典诗文、文学格言、哲学引文、俗谚和非政治性诗句。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "自序",
    5,
    "障百川而东之，回狂澜于既倒",
    "古文名句",
    "中国古文成句",
    "李敖以古文成句说明知识分子在乱流中扶正主流的抱负。",
  ),
  q(
    "自序",
    11,
    "为理念去死，无疑是高贵的。但为真实的理念去死，那就更高贵了！",
    "外国思想格言",
    "孟肯语",
    "李敖转引孟肯关于为真实理念而死的格言。",
  ),
  q(
    "001.",
    81,
    "道是刘三，说什么汉高祖！",
    "元曲成句",
    "中国元曲",
    "李敖引元曲写刘邦还乡，以说明身份转换后的反讽。",
  ),
  q(
    "001.",
    113,
    "所有的将军都会发生错误，都会打败仗，可是好的将军错误发生得少。",
    "外国人物格言",
    "艾森豪威尔语",
    "李敖转述艾森豪威尔关于好将军也会犯错但犯错较少的话。",
  ),
  q(
    "001.",
    113,
    "学问成家数",
    "学术评语",
    "梁启超评胡适语",
    "李敖转引梁启超评价胡适学问可成多家之数。",
  ),
  q(
    "001.",
    143,
    "知耻近乎勇",
    "儒家格言",
    "《礼记·中庸》成句",
    "李敖引用儒家成句说明认错需要勇气。",
  ),
  q(
    "001.",
    171,
    "食色性也",
    "古典格言",
    "《孟子》告子语",
    "李敖借古语说明饮食男女是人性常情。",
  ),
  q(
    "001.",
    195,
    "名字写在水上",
    "诗人墓志铭",
    "济慈墓志铭",
    "李敖转述英国诗人济慈的墓志铭意象。",
  ),
  q(
    "002.",
    33,
    "取法乎上，得乎其中。取法乎中，得乎其下。",
    "古典格言",
    "中国古语",
    "郑南榕文章引用古语，说明取法标准高低影响所得。",
  ),
  q(
    "004.",
    69,
    "觉今是而昨非",
    "陶渊明文句",
    "陶渊明《归去来兮辞》",
    "李敖借陶渊明文句说明改过自新的可能。",
  ),
  q(
    "004.",
    69,
    "实迷途其未远",
    "陶渊明文句",
    "陶渊明《归去来兮辞》",
    "李敖借陶渊明文句说明迷途未远仍可回头。",
  ),
  q(
    "006.",
    5,
    "有眼不识泰山",
    "俗语",
    "中国俗语",
    "李敖用俗语形容寻衅者不识拳王乔·路易斯。",
  ),
  q(
    "006.",
    5,
    "不屑在他不屑的地方作战",
    "处世格言",
    "胡志伟语",
    "李敖转述胡志伟关于不在不屑之处作战的格言。",
  ),
  q(
    "006.",
    7,
    "You can't beat something with nothing.",
    "英文格言",
    "胡适所喜英文句",
    "李敖转引胡适喜欢的英文格言，说明有内容才不怕空无攻击。",
  ),
  q(
    "006.",
    7,
    "只要我们有东西，不怕人家拿‘没有东西’来打我们。",
    "处世格言",
    "胡适语",
    "李敖转引胡适把英文格言化为中文说明。",
  ),
  q(
    "006.",
    15,
    "我受了十余年的骂，从来不怨恨骂我的人。有时他们骂得不中肯，我反替他们着急。有时他们骂得太过火了，反损骂者自己的人格，我更替他们不安。如果骂我而使骂者有益，便是我间接于他有恩了，我自然很情愿挨骂。如果有人说，吃胡适一块肉可以延寿一年半年，我也一定情愿自己割下来送给他，并且祝福他。",
    "宽容文句",
    "胡适致杨杏佛信",
    "李敖转引胡适谈受骂、挨骂与祝福骂者的气度。",
  ),
  q(
    "006.",
    17,
    "我见汝犹怜，何况老奴！",
    "古典轶语",
    "桓温妻妾轶事",
    "李敖引桓温元配见李势妹而生怜爱的古典轶语。",
  ),
  q(
    "007.",
    7,
    "狂者进取，狷者有所不为也。",
    "论语格言",
    "《论语·子路》",
    "李敖引用《论语》定义狂狷性格。",
  ),
  q(
    "014.",
    3,
    "你不可牺牲原则去换取一种可疑的利益。",
    "外国格言",
    "甘地语",
    "李敖转引甘地格言，强调不可牺牲原则换可疑利益。",
  ),
  q(
    "016.",
    13,
    "爸爸像太阳一样，如果太阳不见了，我会哭，我会叫，但还是叫不回太阳。",
    "儿童诗句",
    "郑竹梅诗",
    "李敖转引郑南榕女儿郑竹梅写父亲如太阳的诗句。",
  ),
  q(
    "018.",
    5,
    "甚矣，吾不知人也！曩者吾叱之，彼乃以我为非人也！",
    "史记名句",
    "《史记·刺客列传》",
    "李敖转引鲁句践感叹不知荆轲其人的话。",
  ),
  q(
    "018.",
    9,
    "杀君马者道旁儿",
    "中国古话",
    "中国古话",
    "李敖引用古话说明旁人鼓噪足以促成奔马之死。",
  ),
  q(
    "019.",
    3,
    "吾中国文化之定义，具于白虎通三纲六纪之说，其意义为抽象理想最高之境，犹希腊柏拉图所谓Idea者。若以君臣之纲言之，君为李煜亦期之以刘秀；以朋友之纪言之，友为郦寄亦待之以鲍叔。其所殉之道，与所成之仁，均为抽象理想之通性，而非具体之一人一事。夫纲纪本理想抽象之物，然不能不有所依托，以为具体表现之用……至于流俗恩怨荣辱委琐龌蹉之说，皆不足置辩，故亦不之及云。",
    "学术文句",
    "陈寅恪《王观堂先生挽词》",
    "李敖转引陈寅恪论王国维之死与抽象理想。",
  ),
  q(
    "019.",
    3,
    "先生以一死见其独立自由之意志，非所论于一人之恩怨，一姓之兴亡。",
    "学术名句",
    "陈寅恪《清华大学王观堂先生纪念碑铭》",
    "李敖转引陈寅恪论王国维以死显示独立自由意志。",
  ),
  q(
    "019.",
    3,
    "古今中外志士仁人，往往樵悴忧伤，继之以死。其所伤之事、所死之故，不止局于一时间一地域而已。盖别有超越时间地域之理性存焉。",
    "学术文句",
    "陈寅恪《王静安先生遗书序》",
    "李敖转引陈寅恪说明志士仁人之死有超越时地的理性。",
  ),
  q(
    "019.",
    11,
    "所恶有甚于死者，故患有所不辟也",
    "孟子格言",
    "《孟子·告子上》",
    "李敖引用《孟子》说明有比死亡更令人厌恶者。",
  ),
  q(
    "019.",
    11,
    "明知山有虎，偏向虎山行",
    "俗语",
    "中国俗语",
    "李敖用俗语形容明知危险仍向前的选择。",
  ),
  q(
    "019.",
    11,
    "学习哲学即是学习如何去死。",
    "外国哲学格言",
    "蒙田语",
    "李敖转引蒙田关于哲学与死亡学习的格言。",
  ),
  q(
    "020.",
    7,
    "Seven cities warr'd for Homer, being dead,/Who, living，had no roof to shroud his head.",
    "英文诗句",
    "海沃德咏荷马句",
    "李敖转引海沃德以七城争荷马写名人死后归属之争。",
  ),
  q(
    "021.",
    19,
    "知其不可而为之",
    "论语成句",
    "《论语》成句",
    "李敖借孔门成句形容明知不可仍为之的志士。",
  ),
  q(
    "021.",
    19,
    "天外有天、海外有海",
    "俗语",
    "中国俗语",
    "李敖用俗语说明世俗之外仍有更广阔的境界。",
  ),
  q(
    "024.",
    11,
    "人一世，花一春",
    "古语",
    "中国古语",
    "李敖转引罗福星临刑语中的古语。",
  ),
  q(
    "026.",
    7,
    "真金不怕火炼",
    "俗语",
    "中国俗语",
    "李敖用俗语说明真实者经得起查证。",
  ),
  q(
    "029.",
    7,
    "每人都是大陆的一片，没有人是孤岛。任何土地的流失，大陆都要变小。",
    "外国诗文名句",
    "约翰·多恩名句",
    "李敖转引约翰·多恩关于无人是孤岛的名句。",
  ),
];

const proofreadExclusions = new Map([]);

const proofreadAdditions = [
  q(
    "004.",
    17,
    "天下没有不散的筵席",
    "俗语",
    "中国俗语",
    "李敖以俗语作信题，说明聚散无常。",
    17,
    "校对轮补入：作为信题出现的清洁俗语，不收同段政治人物书信攻防。",
  ),
  q(
    "006.",
    35,
    "干父之蛊",
    "易经成句",
    "《易经·蛊卦》",
    "李敖转述徐复观以《易经》成句称许他代父澄清旧事。",
    35,
    "校对轮补入：只收《易经》成句本体，不收同段政治身份与史料争议。",
  ),
  q(
    "018.",
    9,
    "求仁得仁",
    "论语成语",
    "《论语·述而》",
    "李敖借《论语》成语说明求仁而得仁。",
    9,
    "校对轮补入：古典成语本体可独立引用，不收南榕台独语境。",
  ),
  q(
    "019.",
    11,
    "舍生取义",
    "孟子成语",
    "《孟子·告子上》",
    "李敖借孟子成语概括在生命与更高追求之间的取舍。",
    11,
    "校对轮补入：只收古典成语本体，不收同段政治追悼与烈士阐释。",
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
  "总统",
  "副总统",
  "总统府",
  "立法院",
  "行政院",
  "司法院",
  "国民大会",
  "选举",
  "司法",
  "中华民国",
  "三民主义",
  "蒋介石",
  "蒋经国",
  "郑南榕",
  "李总统",
  "二二八",
  "政治",
  "政党",
  "革命",
  "反共",
  "情报局",
  "警备总部",
  "戒严",
  "党禁",
  "竞选",
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
    "policy: this book is overwhelmingly modern political commentary; exclude party, election, Taiwan independence, intelligence-agency, revolution, state-identity, and modern political attack quotations, while keeping independently reusable classical, literary, philosophical, proverbial, and non-political poetic material.",
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
