const fs = require("fs");
const path = require("path");

const book = "李敖发电集";
const idPrefix = "LAFAD";
const generatedDate = "2026-06-25";
const sourceDir = path.join("《大李敖全集6.0》分章节", "011.李敖电子报", "002.李敖发电集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const extractedCandidatesJson = path.join("analysis", "liao_fadianji_quote_candidates.json");
const extractedReviewTsv = path.join("analysis", "liao_fadianji_review_candidates.tsv");
const extractedAttributedTsv = path.join("analysis", "liao_fadianji_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_fadianji_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_fadianji_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_fadianji_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_fadianji_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_fadianji_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_fadianji_proofread_report.txt");
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
    "首轮保守收入：本书现代政论密度极高，现代政党人物语录、选举口号、两岸/外交判断、新闻标题、政论断语和纯宣传/攻讦语不收；只取句子本体可独立成立的诗文、古典文句、成语俗谚、文学格言、幽默文句和李敖非政治文句。",
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
    "001.",
    17,
    "人死为大",
    "传统俗语",
    "中国俗语",
    "李敖引出并反驳“人死为大”的旧俗语，句子本体为传统丧葬伦理中的通行说法。",
  ),
  q(
    "003.",
    17,
    "烦恼皆因强出头",
    "传统俗语",
    "传统老话",
    "李敖明称此句为老话；校对复核按句子本体收作通用处世格言。",
    17,
    "校对补入：虽出现在现代政论段落中，但 quote_text 本体不含现代政治判断。",
  ),
  q(
    "003.",
    17,
    "既不能令、又不受命",
    "儒家文句",
    "《孟子》文句",
    "李敖引孟子语形容既不能发号施令又不肯接受命令的两难状态。",
    17,
    "校对补入：古典文句本体可独立成立，未收现代政治判断部分。",
  ),
  q(
    "008.",
    9,
    "我五十几看到美女，还动手；可是六十几看到美女，我只动心而已。",
    "李敖幽默语",
    "李敖",
    "李敖回答年龄差异时说出的自嘲式幽默文句。",
  ),
  q(
    "009.",
    9,
    "自然最怕虚空",
    "外国哲学格言",
    "莱布尼兹语",
    "李敖谈教育空谈时引用莱布尼兹语，以“虚空”比喻内容空洞。",
  ),
  q(
    "012.",
    31,
    "水深波浪阔，无使狡龙得",
    "唐诗句",
    "杜甫《梦李白》诗句",
    "李敖引用杜甫诗句，借其波阔龙狡的意象提醒处境险峻。",
  ),
  q(
    "012.",
    37,
    "真的假不了，假的真不了",
    "俗语格言",
    "警总问案口头禅，李敖称为十字真言",
    "李敖称这句口头禅“不以人废言，亦有至理”，作为辨真假之格言保留。",
  ),
  q(
    "014.",
    27,
    "大梦谁先觉",
    "古典诗文成句",
    "古典成句",
    "李敖借古人成句转入自己的文字游戏，用来谈观念开放与醒觉。",
  ),
  q(
    "014.",
    27,
    "大梦即先觉",
    "李敖改句",
    "李敖改“大梦谁先觉”",
    "李敖把古典成句改作“大梦即先觉”，形成睡觉与先觉的谐趣转折。",
  ),
  q(
    "016.",
    49,
    "近水楼台先得月",
    "传统成语",
    "传统成语",
    "原文以“所谓”引出此成语，说明亲近处境带来的情感便利。",
  ),
  q(
    "017.",
    37,
    "宁为玉碎，不为瓦全",
    "传统成语",
    "传统成语",
    "原文借成语形容彻底决裂式的强硬选择。",
  ),
  q(
    "018.",
    43,
    "恰似我的温柔",
    "李敖化用歌句",
    "李敖化用《恰似你的温柔》",
    "来文形容李敖骂人仍自谦客气，化用歌名为“恰似我的温柔”。",
  ),
  q(
    "019.",
    19,
    "长袖善舞、多财善贾",
    "古典成语",
    "《韩非子》成语",
    "李敖借此成语说明人脉与资本带来的经营便利。",
  ),
  q(
    "019.",
    31,
    "上山打虎亲兄弟",
    "传统俗语",
    "传统俗语",
    "原文以“俗云”引出此句，说明手足相护的民间说法。",
  ),
  q(
    "020.",
    29,
    "福地福人居",
    "传统俗语",
    "传统俗语",
    "报道转述地理说法时引用此俗语，表达地与人互相成就的观念。",
  ),
  q(
    "023.",
    67,
    "虽千万人，吾往矣",
    "儒家名句",
    "《孟子》",
    "文章用孟子名句形容独行其是、坚持所信的气魄。",
  ),
  q(
    "026.",
    31,
    "出污泥而不染，濯清涟而不妖",
    "古文名句",
    "周敦颐《爱莲说》",
    "李敖讲莲花意象时引用《爱莲说》名句。",
  ),
  q(
    "026.",
    35,
    "你错了，命是可以制造的，你从此去修桥、造路、施粥、关心穷人，做一些好事，就能改变你的命运，不妨试试看",
    "命运格言",
    "袁了凡故事中的老和尚语",
    "李敖讲造命论时转述老和尚劝袁了凡行善改命的一段话。",
  ),
  q(
    "026.",
    39,
    "死生有命，富贵在天",
    "儒家名句",
    "《论语》",
    "李敖说明孔孟之道中的正命观时引用此句。",
  ),
  q(
    "026.",
    39,
    "舜何人也，予何人也，有为者亦若是",
    "儒家名句",
    "《孟子》",
    "李敖用此句说明人可以通过有为而自我成就。",
  ),
  q(
    "026.",
    39,
    "君子不立于岩墙之下",
    "儒家名句",
    "《孟子》",
    "李敖用此句说明儒家并非完全宿命，而强调预防与自处。",
  ),
  q(
    "027.",
    59,
    "我是个处女，可是对它并不‘执迷’。",
    "外国漫画台词",
    "《骑士》杂志漫画台词",
    "李敖引用美国杂志漫画中的一句幽默台词，用来对照寇乃馨的处女观。",
    59,
    "校对补入：原文明确标为漫画中人物台词，属于非政治幽默文句。",
  ),
  q(
    "027.",
    61,
    "欲望的满足会降低爱情的强度",
    "爱情格言",
    "寇乃馨语，李敖转述",
    "李敖在讨论处女观时转述寇乃馨关于欲望与爱情强度的说法。",
  ),
  q(
    "027.",
    61,
    "爱她，就是为她憋着",
    "爱情格言",
    "寇乃馨语，李敖概括",
    "李敖概括寇乃馨坚持自抑自制的爱情观，句子具有格言化形式。",
  ),
  q(
    "027.",
    61,
    "没有肉，哪有灵？没有欲，哪有情？",
    "李敖爱情格言",
    "李敖",
    "李敖反驳过度唯灵抑肉时写出的爱情格言。",
  ),
  q(
    "028.",
    39,
    "哀莫大于心死",
    "古典成句",
    "《庄子》",
    "李敖引用古人成句，说明最大的悲哀在于精神心志的死亡。",
  ),
  q(
    "031.",
    37,
    "给魔鬼该给他的",
    "西方谚语",
    "西方谚语",
    "李敖明称此句为西方谚语，用来说明即使不喜欢某人也要承认其可取处。",
    37,
    "校对补入：句子本体为通用谚语，未收所在段落的现代政治评论。",
  ),
  q(
    "031.",
    45,
    "杀君马者，道旁儿。",
    "古典成句",
    "中国古话",
    "李敖引用古话说明旁观鼓噪者可能反而害事。",
  ),
  q(
    "033.",
    5,
    "天祥性豪奢，声妓满前",
    "史传文句",
    "《宋史·文天祥传》",
    "李敖谈文天祥情感与死亡时引用《宋史》文句。",
  ),
  q(
    "033.",
    11,
    "悠悠我心悲，苍天曷有极，哲人日已远，典型在夙昔",
    "古典诗句",
    "文天祥《正气歌》",
    "李敖引用《正气歌》句，说明文天祥临终前的内心悲感。",
  ),
  q(
    "033.",
    15,
    "不爱那么多，只爱一点点",
    "李敖爱情格言",
    "李敖",
    "李敖讲真正成功的爱情时提出的保留式爱情格言。",
  ),
  q(
    "033.",
    23,
    "没有欲哪有情，没有肉哪有灵",
    "李敖爱情格言",
    "李敖",
    "李敖在爱情讲演结尾用这句话概括欲、肉、情、灵的关系。",
  ),
  q(
    "033.",
    39,
    "两个口袋空的人，腰挺不直",
    "外国人生格言",
    "富兰克林语",
    "李敖引用富兰克林语，说明金钱与尊严、意志力之间的关系。",
  ),
  q(
    "033.",
    47,
    "不是花园在你家里，是你家在花园里",
    "李敖广告文句",
    "李敖",
    "李敖举自己写给花园新城的广告词，说明具体表达抽象的文字技巧。",
  ),
  q(
    "033.",
    47,
    "春风又绿江南岸",
    "宋诗名句",
    "王安石诗句",
    "李敖用王安石诗句说明形容词活用为动词的文字技巧。",
  ),
  q(
    "033.",
    47,
    "莫等闲白了少年头",
    "宋词名句",
    "岳飞《满江红》",
    "李敖以此句说明“白”字作为动词使用的中文炼字技巧。",
  ),
  q(
    "036.",
    17,
    "我不恨你对我说谎话，可是我恨你对我说粗糙的谎话",
    "外国格言",
    "英国巴克洛语",
    "李敖引用巴克洛语，说明说谎最不能粗糙地把别人当傻瓜。",
  ),
  q(
    "037.",
    11,
    "去此一步，即无死所",
    "传统成句",
    "传统成句",
    "李敖用此句说明自己与台湾长期纠缠、不能离开的心理。",
  ),
  q(
    "038.",
    35,
    "刘胜位为大夫，见礼上宾，而知善不荐，闻恶不言，隐情惜己，自同寒蝉，此罪人也。",
    "史传文句",
    "《后汉书·杜密传》",
    "李敖引用《后汉书》原文，解释成语“噤若寒蝉”的来源。",
  ),
  q(
    "038.",
    35,
    "噤若寒蝉",
    "传统成语",
    "《后汉书·杜密传》典故成语",
    "李敖指出《后汉书》文句后来变成成语“噤若寒蝉”。",
  ),
  q(
    "042.",
    35,
    "而今已不如昔，后定不如今",
    "传统警句",
    "传统警句",
    "李敖用此句感叹情势一代不如一代，句子本体为时间递降式警句。",
  ),
  q(
    "043.",
    15,
    "君子爱人以德，小人爱人以姑息",
    "儒家格言",
    "曾子易席故事",
    "李敖讲曾子易席时引用此格言，说明以德相爱不同于姑息迁就。",
  ),
];

const proofreadBeforeRows = 38;
const proofreadRemovedRows = [];
const proofreadAddedRows = [
  [
    "烦恼皆因强出头",
    "003.1999年12月3日.txt:17",
    "校对复核补入；原文明确称为老话，句子本体是通用处世格言。",
  ],
  [
    "既不能令、又不受命",
    "003.1999年12月3日.txt:17",
    "校对复核补入；原文明确指向《孟子》，按古典文句收录。",
  ],
  [
    "我是个处女，可是对它并不‘执迷’。",
    "027.2000年1月6日.txt:59",
    "校对复核补入；原文明确为漫画台词，属于非政治幽默文句。",
  ],
  [
    "给魔鬼该给他的",
    "031.2000年1月12日.txt:37",
    "校对复核补入；原文明确称为西方谚语，句子本体可独立成立。",
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
  "- 排除现代政党人物语录、选举口号、两岸/外交判断、新闻标题、政论断语和纯宣传/攻讦语。",
  "- 保留李敖明确引用、刊出、评改或自作的非政治诗文格言；古典诗文若出现在现代政论段落中，只按句子本体独立性保守收入。",
  "- 读者来信、网友留言、新闻报道正文和被李敖直接用于现代政治判断的口号式句子暂不进入首轮。",
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
  "- 继续排除现代政党人物语录、选举口号、两岸/外交判断、治理口号和直接政论断语。",
  "- 古典文句、俗语和谚语即使出现在政论段落中，也只在句子本体可独立成立且 quote_text 不含现代政治判断时收录。",
  "- 本轮补入的漫画台词按非政治幽默文句处理；读者留言和新闻报道长段仍不收。",
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
