const fs = require("fs");
const path = require("path");

const book = "蒋介石研究三集";
const idPrefix = "LAJJS3";
const generatedDate = "2026-06-27";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "018.蒋介石研究三集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_chiang_kai_shek_study_sanji_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_chiang_kai_shek_study_sanji_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_chiang_kai_shek_study_sanji_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_chiang_kai_shek_study_sanji_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_chiang_kai_shek_study_sanji_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_chiang_kai_shek_study_sanji_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_chiang_kai_shek_study_sanji_initial_report.txt");
const proofreadReviewTsv = path.join("analysis", "liao_chiang_kai_shek_study_sanji_proofread_review.tsv");
const proofreadAuditTsv = path.join("analysis", "liao_chiang_kai_shek_study_sanji_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_chiang_kai_shek_study_sanji_proofread_report.txt");
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
      "首轮保守收入：《蒋介石研究三集》以蒋介石、国民党、抗日战争、军政文件、领袖逸闻、个人崇拜、党歌国歌与政治人物攻防为主体；现代党派、政权、领袖、军政、战争、革命、国家民族、官方文件与意识形态语录不收，只保留可脱离具体政治论战独立检索的古典文本、典故、俗谚、笑话和联语。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "004.",
    373,
    "乘大家热铛子头，更作一个。",
    "古代笑话",
    "侯白《启颜录》",
    "李敖引用《启颜录》北齐高祖谜语笑话中趁锅热再做一个饼的机锋。",
    373,
    "只收古代笑话原句本体，不收同篇八一三、上海战役与军事评论语境。",
  ),
  q(
    "007.",
    93,
    "染指于鼎",
    "古代典故",
    "《左传·宣公四年》食指大动典故",
    "李敖借古书典故写“不尝异味不罢休”的意味。",
    93,
    "只收古代典故本体，不收同段外交、婚恋丑闻与政治人物逸闻。",
  ),
  q(
    "007.",
    93,
    "要劫劫皇杠、要玩玩娘娘",
    "俗谚",
    "中国谚语",
    "李敖引用俗谚，表示要抢就抢最重的财货、要玩就玩最高处的人物的戏谑语气。",
    93,
    "只收俗谚本体，不收同段威尔基、宋美龄、蒋介石与中美政治关系叙述。",
  ),
  q(
    "009.",
    23,
    "可以死，可以无死，死，伤勇。",
    "孟子文句",
    "《孟子·离娄下》",
    "李敖引用孟子句，说明可死可不死时勉强求死反伤勇德。",
    23,
    "只收孟子原句本体，不收同段被俘观、将军、投降与统治者强制作死的政治军事论述。",
  ),
  q(
    "016.",
    7,
    "祸及贤慈当日顽梗悔已晚",
    "墓联",
    "蒋介石自撰、张静江书石联",
    "李敖转录蒋母墓前石联上联，写祸及母亲后的悔恨。",
    7,
    "只收墓前石联本体，不收同段蒋母墓、国民党碑文与政治宣传批评。",
  ),
  q(
    "016.",
    7,
    "愧为逆子终身沉痛恨靡涯",
    "墓联",
    "蒋介石自撰、张静江书石联",
    "李敖转录蒋母墓前石联下联，写自愧逆子与终身沉痛。",
    7,
    "只收墓前石联本体，不收同段蒋母墓、国民党碑文与政治宣传批评。",
  ),
];

const proofreadRemovedRows = [];

const proofreadAdditions = [
  q(
    "003.",
    137,
    "干打雷，不下雨",
    "俗语",
    "中国俗语",
    "李敖转引冯玉祥回忆中的俗语，形容只空喊而没有实际行动。",
    137,
    "校对补入：只收俗语本体，不收同段一二八、迁都、派兵与外交政治语境。",
  ),
  q(
    "003.",
    169,
    "此地无银三百两",
    "俗语",
    "中国俗语",
    "李敖借俗语形容刻意辩白反而露出可疑之处。",
    169,
    "校对补入：只收俗语本体，不收同段第五军、十九路军、抗战与政令文字。",
  ),
  q(
    "003.",
    169,
    "不立文字",
    "佛教成语",
    "禅宗语",
    "李敖借禅宗成语形容另有一套不写在文字上的做法。",
    169,
    "校对补入：只收成语本体，不收同段军政指示与历史攻防。",
  ),
  q(
    "005.",
    17,
    "仁民爱物",
    "孟子成语",
    "《孟子·尽心上》语义",
    "李敖借“仁民爱物”成语反讽对伤兵缺乏照护的现实。",
    17,
    "校对补入：只收孟子成语本体，不收同段伤兵、抗战日记与蒋介石讽刺语境。",
  ),
  q(
    "006.",
    19,
    "桃花潭水深千尺，不及汪伦送我情。",
    "唐诗句",
    "李白《赠汪伦》",
    "李敖转引报纸讥讽诗句中的李白原诗句，借汪伦之名形成谐趣。",
    19,
    "校对补入：只收李白诗句本体，不收同段汪精卫、主和主战与外交部政治语境。",
  ),
  q(
    "007.",
    93,
    "食指大动",
    "古代典故",
    "《左传·宣公四年》食指大动典故",
    "李敖引用古书“食指大动”典故，说明预感将尝异味的故事。",
    93,
    "校对补入：与“染指于鼎”同出一典；只收典故本体，不收同段外交、婚恋丑闻与政治人物逸闻。",
  ),
  q(
    "009.",
    31,
    "寡廉鲜耻",
    "成语",
    "中国成语",
    "李敖借成语批评自己做不到却用最高标准要求别人。",
    31,
    "校对补入：只收成语本体，不收同段被俘观、将军、投降、自杀与政治军事论述。",
  ),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "国民党",
  "同盟会",
  "民进党",
  "台独",
  "中华民国",
  "国府",
  "党国",
  "政府",
  "政权",
  "总统",
  "总统府",
  "行政院",
  "立法院",
  "司法院",
  "监察院",
  "国防部",
  "国史馆",
  "警备总部",
  "二二八",
  "一九四九",
  "1949",
  "战争",
  "抗战",
  "八一三",
  "一二八",
  "北伐",
  "国共",
  "革命",
  "反革命",
  "反共",
  "投降",
  "军校",
  "陆军",
  "军政",
  "特务",
  "流亡",
  "亡国",
  "救国",
  "国家",
  "社稷",
  "祖国",
  "民族",
  "政治",
  "民主",
  "自由主义",
  "独裁",
  "法西斯",
  "暗杀",
  "刺杀",
  "起义",
  "炮台",
  "保密局",
  "遗嘱",
  "国歌",
  "党歌",
  "蒋介石",
  "蒋中正",
  "蒋经国",
  "孙中山",
  "宋美龄",
  "戴笠",
  "陈水扁",
  "李登辉",
  "日本",
  "美国",
  "苏联",
  "俄国",
  "台湾",
  "大陆",
  "烈士",
  "殉国",
  "匪谍",
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

const proofreadRemovedQuoteKeys = new Set(proofreadRemovedRows.map((row) => normalizeText(row.quote_text)));
const initialRows = rawRows.filter((row) => !proofreadRemovedQuoteKeys.has(normalizeText(row.quote_text)));

const rows = [...initialRows, ...proofreadAdditions].sort(rowCompare).map((row, index) => ({
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
  proofreadReviewTsv,
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

const finalIdByQuote = new Map(rows.map((row) => [normalizeText(row.quote_text), row.id]));

fs.writeFileSync(
  proofreadAuditTsv,
  [
    "action\tid\tsource_file\tline_start\tline_end\tcategory\tquote_text\treason",
    ...proofreadRemovedRows.map((row) =>
      [
        "remove",
        row.id,
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.quote_text,
        row.proofread_reason,
      ].join("\t"),
    ),
    ...proofreadAdditions.map((row) =>
      [
        "add",
        finalIdByQuote.get(normalizeText(row.quote_text)) || "",
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.quote_text,
        row.notes,
      ].join("\t"),
    ),
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
const uniqueQuoteTexts = Array.isArray(candidatesData)
  ? new Set(candidatesData.filter((row) => row.kind === "quote").map((row) => normalizeText(row.text ?? row.quote_text))).size
  : candidatesData?.uniqueQuoteTexts ?? "missing";
const reviewCandidateLines = fs.existsSync(reviewCandidatesTsv)
  ? fs.readFileSync(reviewCandidatesTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";
const attributedLines = fs.existsSync(attributedTsv)
  ? fs.readFileSync(attributedTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";

const reportLines = [
  `${book} proofread extraction report`,
  `generatedDate: ${generatedDate}`,
  `sourceDir: ${sourceDir}`,
  `sourceFilesForExport: ${files.length}`,
  `quoteCandidates: ${quoteCandidates}`,
  `uniqueQuoteTexts: ${uniqueQuoteTexts}`,
  `keywordLines: ${keywordLines}`,
  `reviewCandidates: ${reviewCandidateLines}`,
  `attributedLines: ${attributedLines}`,
  `initialSelectedRowsBeforeProofread: ${rawRows.length}`,
  `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
  `proofreadAddedRows: ${proofreadAdditions.length}`,
  `selectedRows: ${rows.length}`,
  `missingQuotes: ${missing.length}`,
  `duplicateTexts: ${duplicates.length}`,
  `politicalHitRows: ${politicalHits.length}`,
  "policy: this book is dominated by modern political history, Chiang Kai-shek studies, anti-Japanese war material, leader anecdotes, party-state records, official documents, leader worship, national anthem material, and polemical attacks; exclude direct party, regime, leader, military, war, revolution, state, national identity, official document, and ideological quotations, while keeping independently reusable classical texts, ancient jokes, proverbs, allusions, and couplets.",
  "",
  "selectedHighlights:",
  "- 003: 校对补入“干打雷，不下雨”“此地无银三百两”“不立文字”；只收俗语/成语本体，一二八、派兵、迁都、抗战与政令语境不收。",
  "- 004: 收侯白《启颜录》笑话“乘大家热铛子头，更作一个。”；八一三、上海战役与军事评论不收。",
  "- 005/006: 校对补入孟子成语“仁民爱物”和李白诗句“桃花潭水深千尺，不及汪伦送我情。”；伤兵、主和主战与外交政治语境不收。",
  "- 007: 收《左传》典故“食指大动”“染指于鼎”和中国谚语“要劫劫皇杠、要玩玩娘娘”；威尔基、宋美龄、蒋介石捉奸及中美政治关系叙述不收。",
  "- 009: 收《孟子》“可以死，可以无死，死，伤勇。”并校对补入“寡廉鲜耻”；被俘观、将军、投降与强制作死的政治军事论述不收。",
  "- 016: 收蒋母墓前石联上下联；蒋母墓政治宣传、国民党碑文与反革命批评段落不收。",
  "",
  "excludedHighlights:",
  "- 自序、001、002: 以蒋介石政治人格、暗杀、告状、政论攻防为主，首轮不收。",
  "- 003/004/005/006: 一二八、八一三、伤兵、主和主战等主体为现代战争与军政文献，兵家、战役、作战、国家民族类语录不收；004 只保留古笑话本体。",
  "- 007/008: 威尔基、宋美龄、偷皮包、公文包、官方档案与政治外交逸闻不收；007 只保留古典典故与俗谚。",
  "- 009/010: 被俘观、孟良崮、将领、投降、战败、五字诀与国民党内部讽刺不收；009 只保留孟子句本体。",
  "- 011/012/013/014/015: 流氓拜寿、午餐会、小气性格、鞠躬症、孺慕症等多为现代领袖逸闻或政治讽刺，首轮不收。",
  "- 016/017: 祖坟政治宣传、国歌/党歌与领袖身份材料不收；016 只保留墓联本体。",
];

fs.writeFileSync(reportTxt, reportLines.join("\n") + "\n", "utf8");
fs.writeFileSync(proofreadReportTxt, reportLines.join("\n") + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rows: rows.length,
      missing: missing.length,
      duplicates: duplicates.length,
      politicalHitRows: politicalHits.length,
      quoteCandidates,
      uniqueQuoteTexts,
      keywordLines,
      reviewCandidates: reviewCandidateLines,
      attributedLines,
      outCsv,
      outTxt,
      selectedJson,
      reviewTsv,
      auditTsv,
      reportTxt,
      proofreadReviewTsv,
      proofreadAuditTsv,
      proofreadReportTxt,
    },
    null,
    2,
  ),
);
