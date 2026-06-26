const fs = require("fs");
const path = require("path");

const book = "李敖通电集";
const idPrefix = "LATD";
const generatedDate = "2026-06-25";
const sourceDir = path.join("《大李敖全集6.0》分章节", "011.李敖电子报", "005.李敖通电集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const extractedCandidatesJson = path.join("analysis", "liao_tongdianji_quote_candidates.json");
const extractedReviewTsv = path.join("analysis", "liao_tongdianji_review_candidates.tsv");
const extractedAttributedTsv = path.join("analysis", "liao_tongdianji_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_tongdianji_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_tongdianji_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_tongdianji_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_tongdianji_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_tongdianji_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_tongdianji_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => /^\d{3}\..+\.txt$/.test(name))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceCache = new Map();
for (const file of files) {
  const fullPath = path.join(sourceDir, file);
  const text = sourceDecoder.decode(fs.readFileSync(fullPath));
  sourceCache.set(file, {
    text,
    lines: text.split(/\r?\n/),
  });
}

function sourceFile(prefix) {
  const found = files.find((file) => file.startsWith(prefix));
  if (!found) throw new Error(`Source file not found for prefix: ${prefix}`);
  return found;
}

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[“”‘’"']/g, "")
    .replace(/\s+/g, "");
}

function q(filePrefix, lineStart, quoteText, category, attributedTo, summary, lineEnd = lineStart, extraNotes = "") {
  const file = sourceFile(filePrefix);
  const notes = [
    "首轮保守收入：本书大量夹杂法律争讼、公文、时事批判、现代政治人物语录、民族政治论述和读者来信；现代政党人物语录、选举/两岸/外交判断、治理口号、法律条文、公文声明、新闻报道长段和直接政论断语不收；只取句子本体可独立成立的古典诗文、成语俗谚、宗教文句和少量非政治李敖警语。",
    extraNotes,
  ]
    .filter(Boolean)
    .join(" ");
  return {
    id: "",
    book,
    chapter: file.replace(/^\d+\./, "").replace(/\.txt$/, ""),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: attributedTo,
    summary,
    notes,
  };
}

const rawRows = [
  q(
    "006.",
    5,
    "胶柱鼓瑟",
    "传统成语",
    "《史记》典故成语",
    "李敖谈阅读文字必须顾全上下文时，用此成语批评死板理解。",
  ),
  q(
    "006.",
    9,
    "好读书，不求甚解",
    "陶渊明文句",
    "陶渊明《五柳先生传》",
    "李敖引用陶渊明文句，转而说明“甚解”是过分解释。",
  ),
  q(
    "035.",
    19,
    "外行看热闹，内行看门道。",
    "传统俗语",
    "中国俗语",
    "李敖评《传记文学》的史料工夫时，用俗语区分外行与内行的观看层次。",
  ),
  q(
    "035.",
    19,
    "中有苦心而不能显、内有调济而人不知",
    "清代史学语",
    "章学诚语",
    "李敖评史料结合之功时提到章学诚此语，用来说明著述中不易显露的苦心和调济。",
    19,
    "校对补入：原文明示为清朝史学家章学诚的话，句子本体为非政治史学文句。",
  ),
  q(
    "035.",
    23,
    "皮之不存，毛将焉附",
    "传统成语",
    "《左传》成语",
    "李敖借传统成语说明根本不存则附着之物无从存在；首轮只取成语本体。",
  ),
  q(
    "035.",
    33,
    "前度刘郎",
    "唐诗典故成语",
    "刘禹锡《再游玄都观》典故",
    "李敖写刘绍唐多年不再邀稿时，用刘禹锡典故形容旧人重来。",
  ),
  q(
    "035.",
    33,
    "生死契阔",
    "诗经成语",
    "《诗经》",
    "李敖写刘绍唐临终仍以藏书相托时，用《诗经》成语概括生死间的深厚情谊。",
    33,
    "校对补入：古典成语本体独立成立，非政治语录。",
  ),
  q(
    "038.",
    63,
    "四两拨千斤",
    "传统成语",
    "中国成语",
    "文章称浦先生行政手腕圆熟，用此成语形容以巧妙方法化解大事。",
    63,
    "校对补入：传统成语本体独立成立，未收入同句中含“两岸”的唐诗句。",
  ),
  q(
    "053.",
    11,
    "你这给奴才做奴才的奴才",
    "古典小说骂语",
    "《水浒传》石秀骂语",
    "李敖明称这是古代《水浒传》石秀骂人语；首轮只收古典小说原句，不收现代变体。",
  ),
  q(
    "059.",
    5,
    "本来无事只畏扰，扰者才吏非庸人",
    "宋诗句",
    "宋人诗句",
    "李敖引用宋诗说明庸人自扰不如才吏自扰更能生事。",
  ),
  q(
    "068.",
    5,
    "应无所住而生其心",
    "佛经名句",
    "《金刚经》",
    "来文谈布施与修行时引用《金刚经》名句。",
  ),
  q(
    "068.",
    7,
    "末法时期，邪师说法如恒河沙",
    "佛教警语",
    "释迦佛祖警语",
    "来文称此为释迦佛祖警告末法时期佛弟子的警语之一。",
  ),
  q(
    "068.",
    7,
    "狮子身中虫，还食狮身肉",
    "佛教警语",
    "释迦佛祖警语",
    "来文称此为释迦佛祖警告佛弟子的另一警语，用以说明内部自蚀。",
  ),
  q(
    "068.",
    7,
    "众生皆具佛性皆可成佛",
    "佛教名句",
    "佛教常语",
    "来文在阐释佛教修行时称佛言众生皆具佛性、皆可成佛。",
    7,
    "校对补入：原文以“佛言”引出，句子本体为佛教文句。",
  ),
  q(
    "068.",
    9,
    "天下没有白吃的午餐",
    "传统俗语",
    "中国俗语",
    "来文劝人反省名利因果时，用俗语说明享受必有代价。",
  ),
  q(
    "068.",
    9,
    "因果历历不爽",
    "佛教俗语",
    "佛教因果说",
    "来文劝人反省名利与修行时，用此语说明因果清楚而不会差错。",
    9,
    "校对补入：宗教语境中的因果俗语，句子本体非政治。",
  ),
  q(
    "069.",
    9,
    "怪力乱神",
    "儒家成语",
    "《论语》相关成语",
    "来文说明此语为孔子名言，并用来讨论鬼神邪术之事。",
  ),
  q(
    "078.",
    21,
    "申冤在我，我必报应",
    "圣经文句",
    "《圣经》",
    "李敖明称这是圣经文句，并以此自嘲求助者众而自己难以逐一回应。",
  ),
  q(
    "078.",
    25,
    "久在樊笼里，复得返自然",
    "陶渊明诗句",
    "陶渊明《归园田居》",
    "李敖写迁入山居后的解脱感时引用陶渊明诗句。",
  ),
  q(
    "086.",
    51,
    "本来无事只畏扰，扰者才吏非庸人",
    "宋诗句",
    "宋人诗句",
    "李敖在另一件公文往返中再次引用同一宋诗句，讽刺无端生扰。",
  ),
  q(
    "087.",
    27,
    "欲加之罪、何患无辞",
    "传统成语",
    "《左传》成语",
    "李敖用传统成语说明先有罪名、再找理由的逻辑；不收同段政治寓言语录。",
  ),
  q(
    "088.",
    29,
    "如大旱之望云霓",
    "古典成语",
    "《孟子》典故成语",
    "李敖用古典成语形容焦急等待的迫切心情；首轮只取成语本体。",
  ),
];

const proofreadBeforeRows = 18;
const proofreadRemovedRows = [
  [
    "LATD-003",
    "前途有限，后患无穷",
    "源段直接连接现代政治牌局、现代政治人物与软禁语境，校对轮按政治语境过重的李敖自作警语删除。",
  ],
];
const proofreadAddedRows = [
  [
    "中有苦心而不能显、内有调济而人不知",
    "035.2000年8月16日.txt:19",
    "原文明示为章学诚的话，属于非政治史学文句。",
  ],
  [
    "生死契阔",
    "035.2000年8月16日.txt:33",
    "古典成语本体独立成立，用于生死情谊。",
  ],
  [
    "四两拨千斤",
    "038.2000年8月21日.txt:63",
    "传统成语本体独立成立，未收同句中含现代政治词的唐诗句。",
  ],
  [
    "众生皆具佛性皆可成佛",
    "068.2000年10月2日.txt:7",
    "原文以“佛言”引出，按佛教文句补入。",
  ],
  [
    "因果历历不爽",
    "068.2000年10月2日.txt:9",
    "宗教语境中的因果俗语，句子本体非政治。",
  ],
];
const proofreadChangedRows = [];

const modernPoliticalTerms = [
  "总统",
  "国民党",
  "共产党",
  "民进党",
  "新党",
  "亲民党",
  "台联",
  "台独",
  "两岸",
  "一国两制",
  "中华民国",
  "中华人民共和国",
  "台湾独立",
  "民主",
  "自由",
  "人权",
  "宪法",
  "政府",
  "立法院",
  "总统府",
  "竞选",
  "选举",
  "政治",
  "外交",
  "陈水扁",
  "李登辉",
  "宋楚瑜",
  "连战",
  "马英九",
  "蒋介石",
  "蒋经国",
  "毛泽东",
  "孙中山",
  "江泽民",
  "朱镕基",
  "许信良",
  "李远哲",
];

function findQuoteLocation(row) {
  const source = sourceCache.get(row.source_file);
  const sourceLines = source.lines.slice(row.line_start - 1, row.line_end).join("\n");
  const normalizedSource = normalizeText(sourceLines);
  const normalizedQuote = normalizeText(row.quote_text);
  return {
    found: normalizedSource.includes(normalizedQuote),
    sourceSnippet: sourceLines,
    normalizedQuote,
  };
}

const rows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const auditRows = rows.map((row) => {
  const location = findQuoteLocation(row);
  const politicalHits = modernPoliticalTerms.filter((term) => row.quote_text.includes(term));
  return {
    id: row.id,
    book: row.book,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
    quote_text: row.quote_text,
    category: row.category,
    source_or_origin: row.source_or_origin,
    found_in_source: location.found ? "yes" : "no",
    political_hits: politicalHits.join("|"),
    notes: row.notes,
  };
});

const missing = auditRows.filter((row) => row.found_in_source !== "yes");
const politicalFlagged = auditRows.filter((row) => row.political_hits);

if (missing.length > 0) {
  const detail = missing
    .map((row) => `${row.id} ${row.source_file}:${row.line_start}-${row.line_end} ${row.quote_text}`)
    .join("\n");
  throw new Error(`Some quote_text values were not found in source lines:\n${detail}`);
}

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

const csvEscape = (value) => {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function writeCsv(filePath, dataRows, dataColumns = columns) {
  const csv = [
    dataColumns.join(","),
    ...dataRows.map((row) => dataColumns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
  fs.writeFileSync(filePath, `${csv}\n`, "utf8");
}

function writeTsv(filePath, dataRows, dataColumns) {
  const tsv = [
    dataColumns.join("\t"),
    ...dataRows.map((row) =>
      dataColumns.map((column) => String(row[column] ?? "").replace(/\r?\n/g, "\\n")).join("\t"),
    ),
  ].join("\n");
  fs.writeFileSync(filePath, `${tsv}\n`, "utf8");
}

function writeTxt(filePath, dataRows) {
  const lines = [
    `《${book}》诗文格言歌谣引用`,
    `生成日期：${generatedDate}`,
    `条目数：${dataRows.length}`,
    "",
  ];

  for (const row of dataRows) {
    lines.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
    lines.push(row.quote_text);
    lines.push(`出处/来源：${row.source_or_origin}`);
    lines.push(`说明：${row.summary}`);
    if (row.notes) lines.push(`备注：${row.notes}`);
    lines.push("");
  }

  fs.writeFileSync(filePath, `${lines.join("\n").trimEnd()}\n`, "utf8");
}

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(selectedJson), { recursive: true });

writeCsv(outCsv, rows);
writeTxt(outTxt, rows);
fs.writeFileSync(selectedJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
writeTsv(reviewTsv, rows, columns);
writeTsv(auditTsv, auditRows, [
  "id",
  "book",
  "source_file",
  "line_start",
  "line_end",
  "quote_text",
  "category",
  "source_or_origin",
  "found_in_source",
  "political_hits",
  "notes",
]);

const categoryCounts = new Map();
const byFileCounts = new Map();
for (const row of rows) {
  categoryCounts.set(row.category, (categoryCounts.get(row.category) || 0) + 1);
  byFileCounts.set(row.source_file, (byFileCounts.get(row.source_file) || 0) + 1);
}

const candidateInfo = [
  fs.existsSync(extractedCandidatesJson) ? `候选JSON：${extractedCandidatesJson}` : null,
  fs.existsSync(extractedReviewTsv) ? `缩表候选TSV：${extractedReviewTsv}` : null,
  fs.existsSync(extractedAttributedTsv) ? `归因候选TSV：${extractedAttributedTsv}` : null,
].filter(Boolean);

const report = [
  `《${book}》诗文格言歌谣引用首轮/校对后报告`,
  `生成日期：${generatedDate}`,
  "",
  `源目录：${sourceDir}`,
  `源文件数：${files.length}`,
  `首轮写出：${proofreadBeforeRows}`,
  `校对删除：${proofreadRemovedRows.length}`,
  `校对补入：${proofreadAddedRows.length}`,
  `校对修改：${proofreadChangedRows.length}`,
  `校对后写出：${rows.length}`,
  `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
  `源文命中异常：${missing.length}`,
  `quote_text现代政治词命中：${politicalFlagged.length}`,
  "",
  "候选辅助文件：",
  ...(candidateInfo.length ? candidateInfo.map((line) => `- ${line}`) : ["- 未检测到自动候选辅助文件"]),
  "",
  "分类统计：",
  ...[...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([category, count]) => `- ${category}：${count}`),
  "",
  "筛选原则：",
  "- 排除现代政党人物语录、选举口号、两岸/外交判断、治理口号、法律条文、公文声明、新闻报道长段、民族政治论述和直接政论断语。",
  "- 奥威尔政治寓言中的整组革命/平等语录，本轮按政治寓言语录排除；只保留同段中独立的传统成语本体。",
  "- 古典诗文、佛经文句和俗语成语即使出现在现代争议段落中，也只在 quote_text 本体可独立成立且不含现代政治判断时保守收入。",
  "",
  "按文件分布：",
  ...Array.from(byFileCounts.entries()).map(([file, count]) => `- ${file}: ${count}`),
  "",
  `CSV：${outCsv}`,
  `TXT：${outTxt}`,
  `审计TSV：${auditTsv}`,
  `选中JSON：${selectedJson}`,
].join("\n");

fs.writeFileSync(reportTxt, `${report}\n`, "utf8");

const proofreadAuditRows = [
  { action: "before", id: "", quote_text: "", reason: `校对前条目数：${proofreadBeforeRows}` },
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => ({
    action: "removed",
    id,
    quote_text: quoteText,
    reason,
  })),
  ...proofreadAddedRows.map(([quoteText, source, reason]) => ({
    action: "added",
    id: "",
    quote_text: quoteText,
    reason: `${source}：${reason}`,
  })),
  ...proofreadChangedRows.map(([id, quoteText, reason]) => ({
    action: "changed",
    id,
    quote_text: quoteText,
    reason,
  })),
  { action: "after", id: "", quote_text: "", reason: `校对后条目数：${rows.length}` },
];

writeTsv(proofreadAuditTsv, proofreadAuditRows, ["action", "id", "quote_text", "reason"]);

const proofreadReport = [
  `《${book}》校对轮报告`,
  `生成日期：${generatedDate}`,
  "",
  `校对前条目数：${proofreadBeforeRows}`,
  `删除：${proofreadRemovedRows.length}`,
  `补入：${proofreadAddedRows.length}`,
  `修改：${proofreadChangedRows.length}`,
  `校对后条目数：${rows.length}`,
  `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
  `源文命中异常：${missing.length}`,
  `quote_text现代政治词命中：${politicalFlagged.length}`,
  "",
  "删除项：",
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => `- ${id}｜${quoteText}｜${reason}`),
  "",
  "补入项：",
  ...proofreadAddedRows.map(([quoteText, source, reason]) => `- ${quoteText}｜${source}｜${reason}`),
  "",
  "边界说明：",
  "- 删除一条李敖自作警语，因为源段直接绑定现代政治牌局与人物关系；校对轮不把这类句子作为非政治格言保留。",
  "- 继续排除现代政党人物语录、选举/两岸/外交判断、法律条文、公文声明、新闻报道长段、民族政治论述和奥威尔政治寓言整组语录。",
  "- 补入项均为古典、史学、佛教或传统成语本体；同句中含现代政治词的唐诗句仍不收。",
  "",
  `校对审计TSV：${proofreadAuditTsv}`,
].join("\n");

fs.writeFileSync(proofreadReportTxt, `${proofreadReport}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rows: rows.length,
      outCsv,
      outTxt,
      reportTxt,
      auditTsv,
      proofreadReportTxt,
      proofreadAuditTsv,
      selectedJson,
      missing: missing.length,
      politicalFlagged: politicalFlagged.length,
    },
    null,
    2,
  ),
);
