const fs = require("fs");
const path = require("path");

const book = "蒋介石研究续集";
const idPrefix = "LAJJSXJ";
const generatedDate = "2026-06-27";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "017.蒋介石研究续集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_chiang_kai_shek_study_xuji_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_chiang_kai_shek_study_xuji_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_chiang_kai_shek_study_xuji_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_chiang_kai_shek_study_xuji_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_chiang_kai_shek_study_xuji_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_chiang_kai_shek_study_xuji_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_chiang_kai_shek_study_xuji_initial_report.txt");
const proofreadReportTxt = path.join("analysis", "liao_chiang_kai_shek_study_xuji_proofread_report.txt");
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
      "首轮保守收入：《蒋介石研究续集》以蒋介石、国民党、革命史、暗杀、起义、军政、总统合法性、遗嘱、神化与反共著作为主体；现代党派、政权、领袖、军政、革命、国家民族、暗杀、战争、遗嘱、官方文件、政治攻防与意识形态语录不收，只保留可脱离具体政治论战独立检索的古典文句、诗词、俗语、文学散文句和古代典故。",
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
    "富贵不能淫，贫贱不能移，威武不能屈",
    "孟子文句",
    "《孟子·滕文公下》",
    "李敖转引《孟子》句，说明“丈夫团”取名所本的品德观。",
    11,
    "只收孟子原句本体，不收同段同盟会、军事留学生、革命核心等政治组织叙述。",
  ),
  q(
    "003.",
    217,
    "夜雨潇潇地下着，提起笔，忽而又想到用麻绳做腰带的困苦的陶焕卿。",
    "鲁迅散文句",
    "鲁迅《华盖集续编》",
    "李敖在注中引用鲁迅追忆陶成章的散文句，呈现夜雨中想起故人的文字氛围。",
    217,
    "只收鲁迅散文句本体，不收同篇暗杀、革命组织与政党史攻防。",
  ),
  q(
    "003.",
    221,
    "杭、绍一苇可航，君盍归里一省？",
    "近代人物语",
    "魏兰语",
    "李敖转引魏兰劝陶成章回乡省亲的话。",
    221,
    "只收劝归省亲的生活语，不收同篇革命史与暗杀论述。",
  ),
  q(
    "003.",
    221,
    "情字难却，一见父母妻子，即不能出矣。",
    "近代人物语",
    "陶成章语",
    "李敖转引陶成章解释不敢回乡的家情牵绊。",
    221,
    "只收亲情自述本体，不收同篇革命史与暗杀论述。",
  ),
  q(
    "004.",
    125,
    "玄都观里桃千树，尽是‘杨’郎去后栽！",
    "唐诗化用",
    "刘禹锡诗句化用",
    "李敖化用刘禹锡《再游玄都观》诗句，借“杨”字写杨虎身后被改写的历史。",
    125,
    "只收诗句化用本体，不收同段肇和起义、党史与政治人物论断。",
  ),
  q(
    "007.",
    5,
    "此度见花枝，白头誓不归！",
    "词句",
    "韦庄《菩萨蛮》",
    "李敖以韦庄词句作篇首题辞，写一去不归的决绝意味。",
  ),
  q(
    "007.",
    107,
    "可以死，可以无死，死，伤勇。",
    "孟子文句",
    "《孟子·离娄下》",
    "李敖引用孟子句，说明可死而也可不死时勉强求死反伤勇德。",
    107,
    "只收孟子原句本体，不收同段将军、投降、战败与统治者强制作死的政治军事论述。",
  ),
  q(
    "009.",
    93,
    "不到黄河心不死",
    "俗语",
    "中国俗语",
    "李敖转引俗话，说明不到最后关头不肯罢休的心理。",
    93,
    "只收俗语本体，不收同段总统下野、和谈与国共政治语境。",
  ),
  q(
    "009.",
    123,
    "祝融悔祸兮，回禄屏气。",
    "古文句",
    "柳宗元《逐毕方文》",
    "李敖引用柳宗元句，说明“悔祸”一词的古文用例。",
    123,
    "只收柳宗元古文句本体，不收同段共党、和平文告与政治心态分析。",
  ),
  q(
    "014.",
    27,
    "割不正不食",
    "论语文句",
    "《论语·乡党》",
    "李敖转引《论语》句，说明把孔子牵强称为“卫生家”的说法所本。",
    27,
    "只收《论语》文句本体，不收同篇政治家、军事家、领袖称号讽刺。",
  ),
  q(
    "016.",
    17,
    "虞舜慕唐尧，见尧于羹，见尧于墙。",
    "古代典故",
    "古代思慕典故",
    "李敖转引“昔人谓”的古代典故，说明思慕先贤至于处处见其形影的说法。",
    17,
    "只收古代典故本体，不收同段遗嘱、领袖崇拜与政治人物颂词。",
  ),
  q(
    "016.",
    17,
    "颜回希孔圣，孔趋亦趋，孔步亦步。",
    "古代典故",
    "颜回学孔典故",
    "李敖转引“昔人谓”的古代典故，说明效法先贤至于亦步亦趋的说法。",
    17,
    "只收古代典故本体，不收同段遗嘱、领袖崇拜与政治人物颂词。",
  ),
];

const proofreadRemovedRows = [];

const proofreadAdditions = [
  q(
    "003.",
    21,
    "幸老父犹健，家计无忧，一至故乡，恐被人情牵累，不能复出矣！",
    "近代人物语",
    "陶成章语",
    "李敖转引陶成章回应魏兰劝归省亲的话，写故乡亲情与人情牵累。",
    21,
    "校对补入：只收家庭与人情牵累句本体；同段“既以身为国奔走……”含国家/革命语义，不收。",
  ),
  q(
    "005.",
    65,
    "一饭酬以千金",
    "韩信典故",
    "韩信漂母典故",
    "李敖以韩信报答漂母的典故，说明受恩以后厚报的古代美谈。",
    65,
    "校对补入：只收古代报恩典故本体，不收同篇江阴炮台、起义与军政叙述。",
  ),
  q(
    "007.",
    41,
    "种瓜得瓜，种豆得豆",
    "俗语",
    "中国俗语",
    "李敖引用俗语，说明行事种因后自得其果。",
    41,
    "校对补入：只收因果俗语本体，不收同段淮海战役、军政责任与政治评价。",
  ),
  q(
    "008.",
    75,
    "留得青山在，不怕无柴烧",
    "俗语",
    "中国俗语",
    "李敖转引杜聿明回忆中尹东生劝其保全自身、留待转机的俗语。",
    75,
    "校对补入：只收通行俗语本体，不收同段突围、俘虏与战犯叙述。",
  ),
  q(
    "010.",
    39,
    "只一人第一，要个个争先，胜固可喜，败亦欣然",
    "胡适书札语",
    "胡适短笺",
    "李敖转引胡适把竞争比作赛跑的话，强调人人争先、胜败坦然。",
    39,
    "校对补入：只收赛跑式竞争格言本体，不收同段副总统竞选与民主政治语境。",
  ),
  q(
    "010.",
    247,
    "名不正，言不顺",
    "论语成句",
    "《论语·子路》",
    "李敖借用《论语》成句，说明名分不正则言事难行。",
    247,
    "校对补入：只收古典成句本体，不收同段总统退职、宪法程序与法统攻防。",
  ),
  q(
    "011.",
    11,
    "仙人偷桃",
    "俗语典故",
    "民间俗语",
    "李敖借民间俗语形容暗中挪移、偷换的手法。",
    11,
    "校对补入：只收俗语典故本体，不收同段引退文告、行政院、保密局和政治操纵叙述。",
  ),
  q(
    "011.",
    11,
    "狸猫换太子",
    "民间故事成语",
    "民间故事典故",
    "李敖借民间故事成语形容真假替换、暗中掉包。",
    11,
    "校对补入：只收民间故事成语本体，不收同段保密局与政治操纵叙述。",
  ),
];

const proofreadRemovedQuoteKeys = new Set(proofreadRemovedRows.map((row) => normalizeText(row.quote_text)));
const initialRows = rawRows.filter((row) => !proofreadRemovedQuoteKeys.has(normalizeText(row.quote_text)));

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
  "北伐",
  "国共",
  "革命",
  "反革命",
  "反共",
  "投降",
  "军校",
  "陆军",
  "士官",
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
  path.join("analysis", "liao_chiang_kai_shek_study_xuji_proofread_audit.tsv"),
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
  `initialSelectedRowsBeforeProofread: ${rawRows.length}`,
  `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
  `proofreadAddedRows: ${proofreadAdditions.length}`,
  `selectedRows: ${rows.length}`,
  `missingQuotes: ${missing.length}`,
  `duplicateTexts: ${duplicates.length}`,
  `politicalHitRows: ${politicalHits.length}`,
  "policy: this book is dominated by modern political history, Chiang Kai-shek studies, party-state censorship, assassination narratives, uprising and military accounts, presidential legality, wills, leader worship, and anti-communist authorship disputes; exclude direct party, regime, leader, military, revolution, state, national identity, official document, assassination, war, will, and ideological quotations, while keeping independently reusable classical texts, poems, proverbs, literary prose sentences, and ancient allusions.",
  "",
  "selectedHighlights:",
  "- 001: 只收《孟子》“富贵不能淫……”本体，不收丈夫团、同盟会和革命组织叙述。",
  "- 003: 收鲁迅散文句、省亲亲情语与校对补入的“幸老父犹健……”；暗杀、革命人格、政党史和领袖责任材料不收。",
  "- 004/005: 收刘禹锡诗句化用与韩信漂母报恩典故；肇和起义、江阴炮台、党史改写、军政人物评价不收。",
  "- 007/008/009/014/016: 收韦庄词句、孟子句、俗语、柳宗元古文句、《论语》句和古代典故；战争、总统下野、和谈、遗嘱和领袖崇拜语境不收。",
  "- 010/011: 校对补入胡适赛跑式竞争格言、《论语》“名不正，言不顺”与“仙人偷桃”“狸猫换太子”民间典故；副总统竞选、法统、保密局和政治操纵叙述不收。",
  "",
  "excludedHighlights:",
  "- 自序: 全篇是蒋家王朝、祸国、打倒/推翻等政治宣言式文字，首轮不收。",
  "- 005/008/010/011/012/013/015/017/018/019: 江阴炮台、兵家大忌、李宗仁、保密局、逃亡、真总统、亲准、神化、棺材与《苏俄在中国》等主体多为现代政治史料或政论攻防，首轮从严不收。",
  "- “不成功，便成仁”“老子们要吃饭，投这些废物干什么？”“国人皆曰可杀”“苍髯老贼、皓首匹夫”等虽醒目，但都直接贴着战争、革命、党争或政治人物攻防，不收。",
  "- 006 “故狂妄半生，觉无意趣”“近来益感人生之乏味”等是蒋介石个人信札校勘语，仍贴着军校、党务与政治人物自述，校对轮不收。",
  "- 008 “将在外，君命有所不受”“军之生死之地、存亡之道”等虽是兵家成句，但直接落在现代战役指挥语境，校对轮不收；只补入“留得青山在，不怕无柴烧”。",
  "- 010 “一人之下，万人之上”“要做就做真皇帝，切不要做假皇帝”“处处不留爷，爷去投八路”等权力、皇帝、八路语义过重，校对轮不收。",
  "- 009 “若寡人得没于地……”含社稷与政治祸乱语义，首轮不收；只收柳宗元“祝融悔祸兮，回禄屏气”。",
  "- 016 “长相左右”“如在其上，如在其左右”是遗嘱/领袖崇拜语境，不收；只收其中文前置的古代典故。",
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
      proofreadReportTxt,
    },
    null,
    2,
  ),
);
