const fs = require("fs");
const path = require("path");

const book = "闽变研究与文星讼案";
const idPrefix = "LAMBWX";
const generatedDate = "2026-06-27";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "014.闽变研究与文星讼案");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_minbian_wenxing_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_minbian_wenxing_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_minbian_wenxing_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_minbian_wenxing_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_minbian_wenxing_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_minbian_wenxing_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_minbian_wenxing_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_minbian_wenxing_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_minbian_wenxing_proofread_report.txt");
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
      "首轮保守收入：本书主要由闽变史料争辩、文星讼案、刑事答辩状、反诉状与现代政治人物攻防构成；党派、政权、革命、政府机关、法院条文、公文电文、现代政治史判断、案件攻防语录和意识形态口号不收，只保留可脱离具体政治/诉讼语境独立检索的古典文句、论辩伦理格言、诗句、俗谚、出版格言和史学方法句。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    107,
    "楚国亡猿，祸延林木",
    "古典成语",
    "中国古典成语",
    "李敖借古典成语说明一事牵连而波及旁人的情形。",
    107,
    "只收成语本体，不收同段立法院、出版法、政府与现代政治攻防内容。",
  ),
  q(
    "001.",
    127,
    "人斯耻格，庭少争讼。",
    "古话格言",
    "中国古话",
    "李敖引用古话，说明人若知耻便少有争讼。",
    127,
    "只收古话本体，不收同段国耻、学术界九一八等政治化发挥。",
  ),
  q(
    "002.",
    9,
    "不以人废言",
    "论语成句",
    "《论语·卫灵公》",
    "李敖列为处理论辩时不因人废言的传统准绳。",
  ),
  q(
    "002.",
    9,
    "对事不对人",
    "论辩俗语",
    "中国俗语",
    "李敖列为论辩中应专注事情而非攻击个人的公平原则。",
  ),
  q(
    "002.",
    9,
    "攻其恶，勿攻其人之恶",
    "传统格言",
    "传统论辩准绳",
    "李敖列为避免人身攻击的传统准绳。",
  ),
  q(
    "003.",
    15,
    "你们中间谁是没有罪的，谁就可以先拿石头打她。",
    "圣经典故",
    "《约翰福音》",
    "许登源引用耶稣语，作为论辩中诉诸个人罪性的例子。",
  ),
  q(
    "003.",
    23,
    "杨朱墨翟之言盈天下，天下之言，不归杨则归墨，杨氏为我，是无君也。墨氏兼爱是无父也。无父无君，是禽兽也。",
    "孟子文句",
    "《孟子·滕文公下》",
    "许登源引用孟子排杨墨语，说明古代论辩中也常有人身指向。",
  ),
  q(
    "004.",
    5,
    "越不可为越为",
    "文人志节语",
    "郑思肖相关语意",
    "萧孟能借郑思肖态度说明办《文星》时明知艰难仍愿为之的心情。",
  ),
  q(
    "004.",
    9,
    "如果想害一个人，就劝他办杂志罢！",
    "现代办刊格言",
    "萧孟能语",
    "萧孟能以自嘲语写办杂志的艰苦。",
    9,
    "只收办刊自嘲语，不收同段为文化、理想、国家等政治化理由。",
  ),
  q(
    "004.",
    19,
    "当年睥睨挥群敌，常胜旌旗是自由",
    "现代诗句",
    "胡秋原诗句",
    "萧孟能引用胡秋原诗句，反衬其应当容忍文字论争。",
    19,
    "首轮仅以诗句本体收录；同段民主风度、言论自由与人物攻防不收。",
  ),
  q(
    "004.",
    21,
    "我虽不杀伯仁，伯仁实由我而死",
    "古典典故",
    "王导、周伯仁典故",
    "萧孟能以伯仁典故自责《文星》牵动胡秋原讼案。",
  ),
  q(
    "014.",
    477,
    "奇文共欣赏，疑义相与析",
    "古典诗句",
    "陶渊明《移居二首》",
    "李敖引用陶渊明诗句，表示材料应公开给大家共同辨析。",
    477,
    "只收读书辨析诗句本体，不收同段共党、政府、当局等现代政治争辩材料。",
  ),
  q(
    "019.",
    33,
    "予之详录而不讳也，殆以为百世之戒，虽或触孝子慈孙之恨而不恤也",
    "史学格言",
    "全祖望跋明崇祯十七年进士录",
    "辩护人引用全祖望语，说明史家详录事实不应避讳。",
    33,
    "只收史学不讳之语，不收同段政治清算、闽变、法律攻防等论述。",
  ),
];

const proofreadExclusions = new Map([
  [
    "当年睥睨挥群敌，常胜旌旗是自由",
    "校对轮删除：虽为现代诗句，但本处紧贴民主风度、言论自由、敌人与《文星》讼案人物攻防，容易成为政治/意识形态语录，按从严口径删除。",
  ],
]);

const proofreadAdditions = [
  q(
    "001.",
    121,
    "行己有耻",
    "论语成句",
    "《论语·子路》",
    "李敖引用儒家成句，说明读书人处世应知羞耻、有所不为。",
    121,
    "校对补入：只收经典修身成句本体，不收同段政府质询、出版法与人物攻防。",
  ),
  q(
    "005.",
    53,
    "饰人之心，易人之意",
    "庄子文句",
    "《庄子·天下》相关文句",
    "答辩状引用庄子式语句，说明强辩可以修饰并改变听者心意。",
    53,
    "校对补入：只收古典论辩语句本体，不收同段讼案宣传战叙述。",
  ),
  q(
    "005.",
    57,
    "能胜人之口，不能服人之心",
    "庄子文句",
    "《庄子·天下》相关文句",
    "答辩状引用庄子评辩者语，说明口头取胜未必能使人心悦服。",
    57,
    "校对补入：只收古典论辩语句本体，不收同段案件攻防。",
  ),
  q(
    "005.",
    59,
    "来如雷霆收震怒，罢如江海凝清光",
    "唐诗名句",
    "杜甫《观公孙大娘弟子舞剑器行》",
    "答辩状引用杜甫诗句，比喻文字攻势的来去声势。",
    59,
    "校对补入：只收唐诗名句本体，不收同段立法院、法院诉讼与人物攻防。",
  ),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "国民党",
  "党国",
  "民进党",
  "闽变",
  "福建人民政府",
  "联合战线",
  "反共",
  "联共",
  "国策",
  "政府",
  "总统",
  "元首",
  "总统府",
  "立法院",
  "行政院",
  "司法院",
  "法院",
  "法庭",
  "刑事",
  "诉讼",
  "诽谤",
  "出版法",
  "政治",
  "政党",
  "政权",
  "革命",
  "马克思",
  "列宁",
  "斯大林",
  "毛泽东",
  "蒋介石",
  "蒋经国",
  "周恩来",
  "胡秋原",
  "萧孟能",
  "李晋芳",
  "文星",
  "中华民国",
  "选举",
  "民主",
  "宪法",
  "自由中国",
  "意识形态",
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

const initialRows = [...rawRows].sort(rowCompare).map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const proofreadRemovedRows = initialRows
  .filter((row) => proofreadExclusions.has(row.quote_text))
  .map((row) => ({
    ...row,
    proofread_reason: proofreadExclusions.get(row.quote_text),
  }));

const proofreadRows = [
  ...initialRows.filter((row) => !proofreadExclusions.has(row.quote_text)),
  ...proofreadAdditions,
];

const rows = [...proofreadRows].sort(rowCompare).map((row, index) => ({
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
  `sourceFiles: ${files.length}`,
  `quoteCandidates: ${quoteCandidates}`,
  `keywordLines: ${keywordLines}`,
  `reviewCandidates: ${reviewCandidateLines}`,
  `attributedLines: ${attributedLines}`,
  `initialSelectedRows: ${initialRows.length}`,
  `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
  `proofreadAddedRows: ${proofreadAdditions.length}`,
  `selectedRows: ${rows.length}`,
  `missingQuotes: ${missing.length}`,
  `duplicateTexts: ${duplicates.length}`,
  `politicalHitRows: ${politicalHits.length}`,
  "policy: this book is dominated by modern political history, the Minbian dispute, Wenxing litigation, criminal pleadings, party/regime arguments, court-law quotations, and person-to-person attacks; exclude direct modern political, party, regime, revolution, government, court, lawsuit, legal-statute, document, and ideology quotations, while keeping independently reusable classical, literary, debate-ethics, publication, and historical-method material.",
  "",
  "proofreadRemovedRows:",
  ...proofreadRemovedRows.map(
    (row) =>
      `- ${row.id}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}\t${row.proofread_reason}`,
  ),
  "",
  "proofreadAddedRows:",
  ...proofreadAdditions.map(
    (row) =>
      `- ${finalIdByQuote.get(normalizeText(row.quote_text)) || ""}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}`,
  ),
  "",
  "continueExcludedHighlights:",
  "- 004.《文星》与胡秋原先生（萧孟能）.txt:19 “当年睥睨挥群敌，常胜旌旗是自由”校对轮删除，因其紧贴民主风度、言论自由与讼案攻防，政治/意识形态语感过重。",
  "- 010/011/014/019/021: 闽变、共党/国民党、政府机关、政治清算、刑事诉讼与法律条文材料继续排除，不作为诗文格言收录。",
  "- 011.刑事答辩状之二（李敖）.txt: 论语“一言而可以兴邦/丧邦”虽为经典成句，但本处服务国家兴亡与政治言责，首轮从严排除。",
  "- 005/006/009/012/015/020: 答辩状、反诉状、证据状、补充理由状中的公文法条与案件攻防语句继续排除。",
  "- 001/004: 胡秋原、《文星》与政治人物攻防段落中，只收少量可脱离案情的古典成语、古话、诗句和出版自嘲语。",
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
      proofreadRemovedRows: proofreadRemovedRows.length,
      proofreadAddedRows: proofreadAdditions.length,
    },
    null,
    2,
  ),
);
