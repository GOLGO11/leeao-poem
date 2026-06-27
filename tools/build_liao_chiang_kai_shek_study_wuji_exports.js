const fs = require("fs");
const path = require("path");

const book = "蒋介石研究五集";
const idPrefix = "LAJJS5";
const generatedDate = "2026-06-27";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "020.蒋介石研究五集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_chiang_kai_shek_study_wuji_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_chiang_kai_shek_study_wuji_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_chiang_kai_shek_study_wuji_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_chiang_kai_shek_study_wuji_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_chiang_kai_shek_study_wuji_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_chiang_kai_shek_study_wuji_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_chiang_kai_shek_study_wuji_initial_report.txt");
const proofreadReviewTsv = path.join("analysis", "liao_chiang_kai_shek_study_wuji_proofread_review.tsv");
const proofreadAuditTsv = path.join("analysis", "liao_chiang_kai_shek_study_wuji_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_chiang_kai_shek_study_wuji_proofread_report.txt");
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
      "首轮保守收入：《蒋介石研究五集》以查禁回应、孙中山蒙难、一二八、张学良与西安事变、黄河决堤、不平等条约、外蒙古、日本降将、康泽与雷案为主体；现代党派、政权、领袖、军政、战争、革命、国家民族、外交、外蒙、特务、战犯、审判、组党与意识形态语录不收，只保留可脱离具体政治论战独立检索的古典诗文、俗语、成语和历史典故。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "《蒋介石研究五集》自序",
    11,
    "微斯人，吾与谁归",
    "古文名句化引",
    "范仲淹《岳阳楼记》化引",
    "李敖化用《岳阳楼记》句，表示若无此人便无所归依的反讽意味。",
    11,
    "只收古文句本体；不收同段查禁、新闻局、告官与言论自由政治攻防。",
  ),
  q(
    "003.",
    413,
    "冠盖满京华，斯人独憔悴",
    "唐诗句",
    "杜甫《梦李白二首》",
    "李敖借杜甫诗句，对照众人得意而一人憔悴的处境。",
    413,
    "只收杜甫诗句本体；不收国共合作、西安事变、政治犯释放与张学良政治处境论述。",
  ),
  q(
    "005.",
    19,
    "打掉牙，和血吞",
    "俗语",
    "中国俗语",
    "李敖借俗语说明受屈后只能自行忍下的处境。",
    19,
    "只收俗语本体；不收张学良失去自由、东北军与西安事变责任归属。",
  ),
  q(
    "005.",
    67,
    "温柔乡是英雄冢",
    "俗语",
    "中国俗语",
    "李敖借俗语讽刺沉溺声色足以毁掉英雄气概。",
    67,
    "只收俗语本体；不收胡蝶、张学良、马君武与政治谣言语境。",
  ),
  q(
    "013.",
    49,
    "前事不忘，后事之师",
    "史鉴成语",
    "《战国策·赵策一》语义",
    "李敖借古语说明记住前事可作为后事借鉴。",
    49,
    "只收史鉴成语本体；不收反攻大陆、被俘将领、成仁训词与党国清单语境。",
  ),
  q(
    "014.",
    115,
    "但使龙城飞将在，不教胡马度阴山。",
    "唐诗句",
    "王昌龄《出塞》",
    "李敖借王昌龄诗句反讽所谓飞将不能守边的落差。",
    115,
    "只收唐诗句本体；不收康泽被俘、特赦战犯、国共宣传与现代军事政治语境。",
  ),
  q(
    "015.",
    7,
    "解所御貂皮衣之，曰：‘先生得无寒乎？ ’",
    "历史典故文句",
    "《清史稿·洪承畴传》",
    "李敖转引洪承畴降清故事中以貂皮衣劝降的关键文句。",
    7,
    "只收清史典故文本；不收康泽、投降、战俘与现代政治讽刺语境。",
  ),
];

const proofreadRemovedRows = [];

const proofreadAdditions = [
  q(
    "002.",
    225,
    "论兵迈古闻中外，揽辔澄清志羽纶",
    "近代悼诗句",
    "高子白悼蒋百里诗",
    "李敖转引高子白悼诗句，用以说明蒋百里论兵识见高远。",
    225,
    "校对补入：只收悼诗句本体，不收一二八、日军师团预测与军事史论证语境。",
  ),
  q(
    "016.",
    99,
    "高鸣何须求‘灵乌’，忍看老友渐凋零",
    "李敖诗句",
    "李敖祝胡适七十岁生日诗",
    "李敖自引旧诗句，责备胡适晚年仍目睹老友凋零。",
    99,
    "校对补入：只收诗句本体，不收雷案、组党、国民党与党外政治评价语境；同段“只做调人不组党”含组党语境不收。",
  ),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "俄共",
  "国民党",
  "同盟会",
  "民进党",
  "台独",
  "中华民国",
  "中华人民共和国",
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
  "外交部",
  "国史馆",
  "警备总部",
  "新闻局",
  "联合国",
  "二二八",
  "一九四九",
  "1949",
  "战争",
  "抗战",
  "抗日",
  "九一八",
  "一二八",
  "北伐",
  "国共",
  "革命",
  "反革命",
  "反共",
  "剿共",
  "投降",
  "军校",
  "黄埔",
  "陆军",
  "军政",
  "特务",
  "战犯",
  "审判",
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
  "谋杀",
  "起义",
  "炮台",
  "保密局",
  "遗嘱",
  "国歌",
  "党歌",
  "外蒙古",
  "外蒙",
  "蒙古",
  "公民投票",
  "组党",
  "蒋介石",
  "蒋中正",
  "蒋经国",
  "孙中山",
  "宋美龄",
  "张学良",
  "杨虎城",
  "康泽",
  "陈布雷",
  "王世杰",
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
  "policy: this book is dominated by modern political history, Chiang Kai-shek polemics, Sun Yat-sen rescue narratives, January 28 military documents, Zhang Xueliang and Xi'an Incident materials, Yellow River flooding, unequal treaties, Outer Mongolia, Japanese war-criminal handling, Kang Ze, and the Lei Chen case; exclude direct party, regime, leader, military, war, revolution, state, national identity, diplomacy, Outer Mongolia, special-service, war-criminal, trial, party-formation, and ideological quotations, while keeping independently reusable classical poetry, proverbs, idioms, and historical allusions.",
  "",
  "selectedHighlights:",
  "- 自序: 收《岳阳楼记》化引“微斯人，吾与谁归”；查禁、新闻局、告官和言论自由政治攻防不收。",
  "- 002: 校对补入高子白悼诗“论兵迈古闻中外，揽辔澄清志羽纶”；一二八、师团预测与军事史论证语境不收。",
  "- 003: 收杜甫“冠盖满京华，斯人独憔悴”；西安事变、国共合作、政治犯释放和张学良政治处境材料不收。",
  "- 005: 收“打掉牙，和血吞”“温柔乡是英雄冢”两条俗语；张学良、胡蝶、马君武与政治谣言语境不收。",
  "- 013/014: 收“前事不忘，后事之师”和王昌龄《出塞》诗句；反攻大陆、被俘将领、康泽宣传、战犯特赦与党国军事语境不收。",
  "- 015: 收《清史稿·洪承畴传》典故文句；康泽、投降、战俘与现代政治讽刺不收。",
  "- 016: 校对补入李敖自引祝胡适诗“高鸣何须求‘灵乌’，忍看老友渐凋零”；雷案、组党与国民党/党外评价语境不收。",
  "",
  "excludedHighlights:",
  "- 自序/001/002: 出版查禁、孙中山蒙难、一二八、军政电文与《蒋总统秘录》攻防多为现代政治史料；“尧犬吠桀”和赫鲁晓夫/毛泽东笑话虽像成句，首轮因政治讽刺语境不收。",
  "- 003/004/005/006: 西安事变、国共秘密接触、张学良审判、剿匪、抗日、反蒋、拥蒋等现代政治材料不收；现代人物对话与政治文件原话不收。",
  "- 007/009/010/011: 黄河决堤、不平等条约、外蒙古、联合国、反共与民族国家论述不收；“将飞者翼伏，将奋者足局”此前同类校对已判为外蒙古政治讲词，首轮不收。",
  "- 012: “以德报怨”“非敌即友”“宁赠外人，不与家奴”等在本书直接服务于对日战后政策、战犯追放与外交政治语境，首轮不收。",
  "- 014/016: 康泽挽联、史可法/文天祥比附、雷案、组党与胡适政治角色材料不收；“实事求是，莫做调人”“苦口婆心君莫笑，只做‘调人’不组党”等因政治语境不收。",
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
