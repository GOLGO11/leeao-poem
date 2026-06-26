const fs = require("fs");
const path = require("path");

const book = "李敖来电集";
const idPrefix = "LALD";
const generatedDate = "2026-06-25";
const sourceDir = path.join("《大李敖全集6.0》分章节", "011.李敖电子报", "004.李敖来电集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const extractedCandidatesJson = path.join("analysis", "liao_laidianji_quote_candidates.json");
const extractedReviewTsv = path.join("analysis", "liao_laidianji_review_candidates.tsv");
const extractedAttributedTsv = path.join("analysis", "liao_laidianji_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_laidianji_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_laidianji_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_laidianji_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_laidianji_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_laidianji_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_laidianji_proofread_report.txt");
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
    "首轮保守收入：本书夹杂访谈、读者来信、政论、法律文件和时事材料，现代政党人物语录、选举口号、治理/外交判断、法律条文、公文声明和直接政论断语不收；只取句子本体可独立成立的古典诗文、成语俗谚、文学论断、书信文句和李敖非政治文句。",
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
    "002.",
    41,
    "相信小说的前途只有加强仅能由小说来表达的思想",
    "李敖文学论断",
    "李敖《北京法源寺》后记",
    "访谈者引李敖后记文字，说明小说应加强只有小说才能表达的思想。",
  ),
  q(
    "002.",
    41,
    "靠小说笔触来说故事的也好，纠缠形式的也罢，其实都难挽回小说的颓局。",
    "李敖文学论断",
    "李敖《北京法源寺》后记",
    "访谈者引李敖后记文字，说明单靠故事笔触或形式实验难以挽回小说颓势。",
  ),
  q(
    "002.",
    47,
    "己所不欲勿施于人",
    "儒家名句",
    "《论语》",
    "李敖谈文字表达思想的力量时举出《论语》名句作例。",
  ),
  q(
    "003.",
    7,
    "表现出来的是金刚怒目，骨子里是菩萨低眉",
    "李敖自述文句",
    "李敖，化用佛教成语",
    "访谈者引李敖自述文字，概括其文字表面锋利而内里慈悲的双重风格。",
  ),
  q(
    "003.",
    21,
    "一出道就是流氓，靠打天下起家",
    "李敖自述文句",
    "李敖",
    "访谈者转引李敖自述，用粗粝语气概括自己早年出道的战斗性。",
    21,
    "校对补入：原文明确称“您曾说过”，句子本体为非政治自述文句。",
  ),
  q(
    "003.",
    21,
    "狂气、流气、义气、勇气形成李敖的综合体",
    "李敖自述文句",
    "李敖",
    "访谈者转引李敖自述，用四种气质概括其人格风格。",
    21,
    "校对补入：原文明确称“又说”，句子本体为非政治自述文句。",
  ),
  q(
    "003.",
    25,
    "争不到一时，也争不到千秋",
    "李敖警语",
    "李敖",
    "李敖说明写作与公众注意力的关系时提出此句，强调现实影响与长远流传相连。",
  ),
  q(
    "003.",
    27,
    "情欲信，词欲巧",
    "古典文论句",
    "古典文论成句",
    "李敖谈骂人文字的技巧时引用文论成句，说明情意要真而文词要巧。",
  ),
  q(
    "003.",
    39,
    "我第一是文学家，第二是诗人，第三是历史学家",
    "李敖自述文句",
    "李敖",
    "李敖以排序方式概括自己的身份认定，先文学、诗，再到历史。",
    39,
    "校对补入：独立成行引号文句，属于非政治自我定位。",
  ),
  q(
    "007.",
    19,
    "此情不渝、据理力争、依法解决。",
    "李敖幽默语",
    "李敖",
    "李敖谈旧情与纠纷时用三段式短语形成幽默而克制的自我概括。",
  ),
  q(
    "007.",
    87,
    "故事是假的，场景是真的",
    "李敖文学论断",
    "李敖",
    "李敖谈《北京法源寺》小说手法时概括虚构故事与真实场景的关系。",
    87,
    "校对补入：原文为小说技法说明，非政治文句。",
  ),
  q(
    "012.",
    17,
    "众里寻她千百度，暮然回首，那人却在灯火阑珊处",
    "宋词名句",
    "辛弃疾《青玉案·元夕》",
    "来文用辛弃疾词句形容忽然发现李敖可当诺贝尔文学奖人选的感觉；原文作“暮然”。",
  ),
  q(
    "015.",
    15,
    "人之将死，其言也善",
    "儒家名句",
    "《论语》",
    "李敖评论陈诚临终前谈话时联想到《论语》名句。",
  ),
  q(
    "016.",
    11,
    "我觉得那篇文字有不少的毛病，应该有人替你指点出来。很可能的，在台湾就没有人肯给你指点出来。所以我不能不自己担任这种不受欢迎的工作了。",
    "胡适书信语",
    "胡适致李敖信",
    "杨照转述胡适给李敖的信，句中体现严肃批评与愿担不受欢迎工作的文人态度。",
  ),
  q(
    "017.",
    9,
    "借一千还十万",
    "李敖感恩语",
    "李敖",
    "文章用此句概括李敖感念胡适资助而长期推广胡适著作的报答方式。",
  ),
  q(
    "017.",
    21,
    "我们的考据学，原来是那些早年做小官的人，从审判诉讼案件的经验中学来的一种证据法。",
    "胡适学术论断",
    "胡适论考据学",
    "文章引胡适解释清代考证学精神，说明考据方法与证据法、诉讼经验之间的关系。",
  ),
  q(
    "017.",
    23,
    "世上最强有力的人就是那个最孤立的人！",
    "外国文学名言",
    "易卜生语",
    "文章明称此句为名言，用来说明李敖所体验的孤立者力量。",
  ),
  q(
    "017.",
    23,
    "杀吾马者道旁儿！",
    "中国古话",
    "中国古话",
    "文章用此古话说明旁观者暗中鼓励可能把人推向危险前线。",
  ),
  q(
    "020.",
    19,
    "先天下之忧而忧，后天下之乐而乐",
    "宋文名句",
    "范仲淹《岳阳楼记》",
    "杨国枢讲知识分子精神时用范仲淹名句概括不以自我为中心的关怀。",
  ),
  q(
    "020.",
    19,
    "宁鸣而死，不默而生",
    "宋赋名句",
    "范仲淹《灵乌赋》",
    "杨国枢讲知识分子精神时引用范仲淹《灵乌赋》名句，强调宁可发声而死。",
  ),
  q(
    "020.",
    21,
    "民胞物与",
    "宋儒成语",
    "张载《西铭》语意",
    "杨国枢谈人文知识分子的侠义精神时用此成语概括普遍关怀。",
  ),
  q(
    "022.",
    13,
    "是邪？非邪？立而望之，偏何姗姗其来迟！",
    "古典文句",
    "汉武帝思李夫人故事",
    "文章引汉武帝思念李夫人时的古典文句，说明早期虚拟影像与想象效果。",
    13,
    "校对补入：古典故事中的文句，句子本体非现代政治语录。",
  ),
  q(
    "022.",
    39,
    "但愿空诸所有",
    "佛家文句",
    "庞居士语",
    "文章讨论陈文茜的虚拟人生时引庞居士语，说明由具象转为抽象的愿望。",
    39,
    "校对补入：原文明确称“庞居士之愿”，句子本体为佛家文句。",
  ),
  q(
    "022.",
    39,
    "慎勿实诸所无",
    "佛家文句",
    "庞居士语",
    "文章承接庞居士语，讨论虚拟能否无中生有、以虚为实。",
    39,
    "校对补入：原文明确称第二句，句子本体为佛家文句。",
  ),
  q(
    "023.",
    27,
    "同做冯妇",
    "传统成语",
    "《孟子》典故成语",
    "汪荣祖谈与李敖合写传记时用此成语形容重新从事人物传记写作。",
  ),
  q(
    "032.",
    57,
    "长袖善舞、多财善贾",
    "传统成语",
    "《韩非子》成语",
    "李敖借此成语说明人脉与资本带来的经营便利；只收传统成语本体。",
    57,
    "校对补入：虽处于现代时事段落，但 quote_text 本体为传统成语。",
  ),
  q(
    "044.",
    31,
    "不看僧面看佛面",
    "传统俗语",
    "中国俗语",
    "来文以俗话说明顾及对方关系与地位时的情面逻辑。",
  ),
  q(
    "047.",
    37,
    "只准州官放火，不准百姓点灯",
    "传统俗语",
    "中国俗语",
    "李敖用传统俗语概括双重标准；只收俗语本体，不收所在段落的现代政论判断。",
  ),
  q(
    "051.",
    5,
    "沐猴而冠",
    "传统成语",
    "《史记》典故成语",
    "李敖用此成语形容徒具其表；首轮仅收传统成语本体。",
  ),
  q(
    "052.",
    11,
    "维鹊有巢，维鸠居之。",
    "诗经句",
    "《诗经》",
    "李敖引用《诗经》句，说明后来的鹊巢鸠占意象来源之一。",
  ),
  q(
    "052.",
    11,
    "鹊巢柳树，鸠夺其处。",
    "易林句",
    "《易林》",
    "李敖引用《易林》句，说明鸠占鹊巢意象的另一古典来源。",
  ),
  q(
    "052.",
    11,
    "鹊巢鸠占",
    "传统成语",
    "传统成语",
    "李敖说明《诗经》《易林》相关说法演变成“鹊巢鸠占”的成语。",
  ),
  q(
    "053.",
    23,
    "钟鼎山林，各有天性，不可强也",
    "古典文句",
    "古典文人语",
    "李敖用此古典文句说明个人志趣各有天性，不可勉强。",
  ),
  q(
    "056.",
    25,
    "枪生震寰宇",
    "外国诗句译语",
    "爱默生《康科德颂歌》译语",
    "李敖引用爱默生《康科德颂歌》名句译语，对照历史上同一意象的不同评价。",
  ),
];

const proofreadBeforeRows = 26;
const proofreadRemovedRows = [];
const proofreadAddedRows = [
  [
    "一出道就是流氓，靠打天下起家",
    "003.2000年4月13日.txt:21",
    "校对复核补入；原文明确标为李敖曾说过的非政治自述。",
  ],
  [
    "狂气、流气、义气、勇气形成李敖的综合体",
    "003.2000年4月13日.txt:21",
    "校对复核补入；李敖自述人格风格，非政治文句。",
  ],
  [
    "我第一是文学家，第二是诗人，第三是历史学家",
    "003.2000年4月13日.txt:39",
    "校对复核补入；独立引号句，属于李敖自我定位。",
  ],
  [
    "故事是假的，场景是真的",
    "007.2000年4月19日.txt:87",
    "校对复核补入；李敖谈小说技法，句子本体可独立成立。",
  ],
  [
    "是邪？非邪？立而望之，偏何姗姗其来迟！",
    "022.2000年5月10日.txt:13",
    "校对复核补入；汉武帝思李夫人故事中的古典文句。",
  ],
  [
    "但愿空诸所有",
    "022.2000年5月10日.txt:39",
    "校对复核补入；原文指向庞居士之愿，按佛家文句收录。",
  ],
  [
    "慎勿实诸所无",
    "022.2000年5月10日.txt:39",
    "校对复核补入；与上一句成对出现，按佛家文句收录。",
  ],
  [
    "长袖善舞、多财善贾",
    "032.2000年5月24日.txt:57",
    "校对复核补入；传统成语本体可独立成立，未收现代时事判断。",
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
  "- 排除现代政党人物语录、选举口号、两岸/外交判断、治理口号、法律条文、公文声明、新闻报道长段和直接政论断语。",
  "- 保留李敖明确引用、刊出、评改或自作的非政治诗文格言；古典诗文若出现在现代政论段落中，只按句子本体独立性保守收入。",
  "- 本轮对访谈和来信中的文学论断、书信文句、俗语成语做收录；涉及现代政治人物政见、组织动员、法律公文的引文不收入。",
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
  ...(proofreadRemovedRows.length
    ? proofreadRemovedRows.map(([id, quoteText, reason]) => `- ${id}｜${quoteText}｜${reason}`)
    : ["- 无"]),
  "",
  "补入项：",
  ...proofreadAddedRows.map(([quoteText, source, reason]) => `- ${quoteText}｜${source}｜${reason}`),
  "",
  "边界说明：",
  "- 继续排除现代政党人物语录、选举口号、两岸/外交判断、治理口号、法律条文、公文声明和直接政论断语。",
  "- 古典文句、俗语成语即使出现在时事段落中，也只在 quote_text 本体可独立成立且不含现代政治判断时收录。",
  "- 本轮补入李敖自述和文学论断，均按非政治文句处理；现代意识形态、法律公文、新闻报道长段仍不收。",
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
      politicalFlagged: politicalFlagged.length,
    },
    null,
    2,
  ),
);
