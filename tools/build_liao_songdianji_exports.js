const fs = require("fs");
const path = require("path");

const book = "李敖送电集";
const idPrefix = "LASD";
const generatedDate = "2026-06-25";
const sourceDir = path.join("《大李敖全集6.0》分章节", "011.李敖电子报", "003.李敖送电集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const extractedCandidatesJson = path.join("analysis", "liao_songdianji_quote_candidates.json");
const extractedReviewTsv = path.join("analysis", "liao_songdianji_review_candidates.tsv");
const extractedAttributedTsv = path.join("analysis", "liao_songdianji_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_songdianji_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_songdianji_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_songdianji_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_songdianji_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_songdianji_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_songdianji_proofread_report.txt");
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
    "首轮保守收入：本书处在总统选举与电子报政论语境中，现代政党人物语录、选举口号、两岸/外交判断、治理口号、法律条文和直接政论断语不收；只取句子本体可独立成立的古典诗文、成语俗谚、文学格言、幽默文句和李敖非政治文句。",
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
    "003.",
    7,
    "当仁不让于师",
    "儒家名句",
    "《论语》",
    "李敖回忆台大经历时引用孔子语，说明面对真理时不因师长而退让。",
  ),
  q(
    "003.",
    17,
    "好读书，不求甚解",
    "古文名句",
    "陶渊明《五柳先生传》",
    "李敖解释悟性与读书方法时引用陶渊明文句，说明不钻牛角尖而求恰如其分。",
    17,
    "校对补入：原文明确引为《五柳先生传》文句，句子本体为读书格言。",
  ),
  q(
    "007.",
    15,
    "会做生意的两个人是打不起来的",
    "外国格言",
    "富兰克林语",
    "李敖引用富兰克林语，说明商业互利能降低冲突。",
    15,
    "校对补入：所在段落有现代政论语境，但 quote_text 本体为可独立成立的经济格言。",
  ),
  q(
    "008.",
    35,
    "心正则锋正，锋正乃可法矣",
    "书法格言",
    "柳公权语",
    "李敖谈毛笔字与人品时引用柳公权对唐穆宗所说的书法格言。",
  ),
  q(
    "008.",
    35,
    "青草池塘处处蛙",
    "宋诗句",
    "赵师秀《约客》诗句",
    "李敖借宋诗句形成文字反讽；句子本体为古典诗句。",
  ),
  q(
    "008.",
    39,
    "圣人不空出，贤者不虚生",
    "古典格言",
    "古人语",
    "李敖明称古人语，用来说明圣贤出现必有其意义。",
  ),
  q(
    "014.",
    5,
    "横看成岭侧成峰，远近高低皆不同，不识庐山真面目，只缘身在此山中",
    "宋诗名句",
    "苏轼《题西林壁》",
    "李敖在世新演讲开头引用苏轼诗，说明距离与真相的关系。",
  ),
  q(
    "014.",
    19,
    "世事洞明皆学问，人情练达即文章",
    "传统格言",
    "《红楼梦》联语",
    "李敖谈大学生应洞察人情世事时引用此格言。",
  ),
  q(
    "014.",
    29,
    "卧薪尝胆",
    "传统成语",
    "苏轼文字流变所成成语",
    "李敖考辨越王勾践故事与苏轼文字，说明“卧薪尝胆”成语的形成。",
    29,
    "校对补入：原文专门讨论成语来源，句子本体不含现代政治判断。",
  ),
  q(
    "015.",
    23,
    "幸福的家庭都是一样的，不幸的家庭各有各的不幸",
    "外国文学名句",
    "托尔斯泰《安娜·卡列尼娜》",
    "李敖引用《安娜·卡列尼娜》开篇名句，对照个人成长故事的不同。",
    23,
    "校对补入：原文明确标出托尔斯泰小说来源，属于文学名句。",
  ),
  q(
    "015.",
    25,
    "吾爱吾师，吾尤爱真理",
    "西方哲学格言",
    "亚里士多德语意",
    "李敖讲追求是非真理时引用此句，说明真理高于师承。",
  ),
  q(
    "016.",
    17,
    "丘吉尔先生，如果我是你太太，我就用一杯毒酒把你毒死",
    "外国幽默语",
    "英国女议员讽刺丘吉尔语",
    "李敖举丘吉尔应答故事时保留对方的机锋上句。",
  ),
  q(
    "016.",
    17,
    "如果我是你的丈夫，我就把这杯毒酒喝下去",
    "外国幽默语",
    "丘吉尔语",
    "李敖举丘吉尔机智应答，说明幽默感可化解尖锐场面。",
  ),
  q(
    "016.",
    19,
    "这种错误，每个人都会发生，你不要过分难过",
    "外国人物体贴语",
    "撒切尔夫人语",
    "李敖举撒切尔夫人安慰侍者的例子，说明体贴与人情练达。",
  ),
  q(
    "016.",
    21,
    "事事洞明皆学问，人情练达即文章",
    "传统格言变体",
    "《红楼梦》联语变体",
    "李敖讲政治智慧与人情练达时引用此格言变体。",
  ),
  q(
    "016.",
    21,
    "我虽然一个字也不认识，可是我还能堂堂正正的做人",
    "儒者格言",
    "宋朝儒者语",
    "李敖引用宋朝儒者语，说明做人之道不只在识字而在通达人情与判断。",
  ),
  q(
    "019.",
    9,
    "少小离家老大回，乡音无改鬓毛衰，儿童相见不相识，笑问客从何处来？",
    "唐诗句",
    "贺知章《回乡偶书》",
    "李敖转引对方用来讽刺自己的唐诗，句子本体仍为古典诗句。",
  ),
  q(
    "021.",
    9,
    "虽千万人，吾往矣",
    "儒家名句",
    "《孟子》",
    "李敖在自画像中用孟子名句形容自己独行其是的气魄。",
  ),
  q(
    "026.",
    11,
    "虽有镃基，不如待时",
    "儒家名句",
    "《孟子》",
    "李敖讲时机重要性时引用孟子语，说明工具不如时机。",
  ),
  q(
    "026.",
    29,
    "莫等闲白了少年头",
    "宋词名句",
    "岳飞《满江红》",
    "李敖讲中文词类活用时举此句，说明“白”字可作动词。",
  ),
  q(
    "026.",
    29,
    "红了樱桃绿了芭蕉",
    "宋词名句",
    "蒋捷《一剪梅》词句",
    "李敖举宋词句说明形容词可直接活用为动词。",
  ),
  q(
    "026.",
    29,
    "春风又绿江南岸，明月何时照我还。",
    "宋诗名句",
    "王安石诗句",
    "李敖用王安石诗句说明“绿”字炼字与活用之妙。",
  ),
  q(
    "026.",
    37,
    "临溪而鱼肥，酿泉为酒，泉香而酒冽",
    "古文名句",
    "欧阳修《醉翁亭记》",
    "李敖引用《醉翁亭记》句，说明好文章要在声韵上推敲。",
  ),
  q(
    "026.",
    37,
    "酒冽而泉香",
    "古文改前句",
    "欧阳修《醉翁亭记》改前措辞",
    "李敖说明欧阳修将“酒冽而泉香”改为“泉香而酒冽”，以见声韵取舍。",
  ),
  q(
    "026.",
    39,
    "五十年来和五百年内，中国人写白话文的前三名是李敖，李敖，李敖。",
    "李敖广告文句",
    "李敖",
    "李敖举自己为《独白下的传统》所写广告词，说明广告文字要让人忘不掉。",
    39,
    "校对补入：原文明确称为广告词，按非政治写作文句收录。",
  ),
  q(
    "029.",
    19,
    "樽前做剧莫相笑，我死诸君思此狂",
    "宋诗句",
    "陆游诗句",
    "李敖引陆游诗句，借以说明自己生前戏谑狂放、死后会被怀想。",
  ),
  q(
    "029.",
    43,
    "我可以容忍你对我说谎话，可是我不容忍你对我说一个粗糙的谎话",
    "外国格言",
    "英国文学家巴特勒语",
    "李敖引用巴特勒语，说明粗糙谎话比谎话本身更不可忍。",
  ),
  q(
    "032.",
    5,
    "千金之子，坐不垂堂",
    "古代名言",
    "中国古代名言",
    "李敖明称此句为中国古代名言，用来解释自己避开高风险交通工具的理由。",
  ),
  q(
    "033.",
    7,
    "挂帆沧海，风波茫茫，或沦无底，或达仙乡。",
    "译诗句",
    "严复译《天演论》所引丁尼生诗",
    "李敖引用严复译丁尼生诗句，用沧海风波比喻人生选择。",
  ),
  q(
    "033.",
    9,
    "鹦鹉救火",
    "传统典故成语",
    "传统典故",
    "李敖用此典故形容明知艰难仍要尽力相救的精神。",
    9,
    "校对补入：句子本体为传统典故成语，未收所在段落的现代政治口号。",
  ),
  q(
    "033.",
    9,
    "飞蛾扑火",
    "传统成语",
    "传统成语",
    "李敖用此成语形容自趋毁灭的愚昧状态。",
    9,
    "校对补入：句子本体为传统成语，未收所在段落的现代政治口号。",
  ),
  q(
    "033.",
    19,
    "沐猴而冠",
    "传统成语",
    "《史记》典故成语",
    "李敖用此成语形容徒具其表；句子本体为传统成语。",
  ),
  q(
    "038.",
    35,
    "自胜者强",
    "道家名句",
    "《老子》",
    "李敖谈克服自己时引用老子语，说明真正强大在于战胜自身。",
  ),
  q(
    "039.",
    13,
    "因为你忘记了你也是一害",
    "李敖警语",
    "李敖",
    "李敖由周处除三害故事与狱中见闻生发，提醒人除害时也要看见自身问题。",
    13,
    "校对补入：句子本体为自省警语，未收所在段落的现代政治身份叙述。",
  ),
  q(
    "040.",
    27,
    "盗亦有道",
    "庄子成语",
    "《庄子》",
    "李敖讲犯罪小说时引用“盗亦有道”，说明强盗也有其哲学。",
  ),
  q(
    "041.",
    25,
    "高惠文景武昭宣，元成哀平孺子新，光武明章和殇安，顺冲质桓灵献",
    "历史歌诀",
    "李敖记汉代帝王世系歌诀",
    "李敖说明自己把帝王世系编成歌诀记忆，并现场念出这段押韵口诀。",
  ),
  q(
    "041.",
    29,
    "你家的儿子念一遍就会，谁家的儿子念两遍呢？我的儿子也是神童，每个人都是神童！",
    "古人轶事语",
    "刘公甫答王安石语",
    "李敖引王安石与刘公甫故事，用幽默应答说明天才并不稀奇。",
  ),
];

const proofreadBeforeRows = 29;
const proofreadRemovedRows = [];
const proofreadAddedRows = [
  [
    "好读书，不求甚解",
    "003.2000年2月3日.txt:17",
    "校对复核补入；原文明确引为《五柳先生传》文句，属于读书格言。",
  ],
  [
    "会做生意的两个人是打不起来的",
    "007.2000年2月15日.txt:15",
    "校对复核补入；富兰克林语，句子本体是可独立成立的经济格言。",
  ],
  [
    "卧薪尝胆",
    "014.2000年2月24日.txt:29",
    "校对复核补入；原文专门讨论成语流变，按传统成语收录。",
  ],
  [
    "幸福的家庭都是一样的，不幸的家庭各有各的不幸",
    "015.2000年2月25日.txt:23",
    "校对复核补入；原文明确标出托尔斯泰小说来源，属于文学名句。",
  ],
  [
    "五十年来和五百年内，中国人写白话文的前三名是李敖，李敖，李敖。",
    "026.2000年3月13日.txt:39",
    "校对复核补入；原文明确称为广告词，按非政治写作文句处理。",
  ],
  [
    "鹦鹉救火",
    "033.2000年3月22日.txt:9",
    "校对复核补入；传统典故成语，未收所在段落的现代政治口号。",
  ],
  [
    "飞蛾扑火",
    "033.2000年3月22日.txt:9",
    "校对复核补入；传统成语，未收所在段落的现代政治口号。",
  ],
  [
    "因为你忘记了你也是一害",
    "039.2000年3月30日.txt:13",
    "校对复核补入；李敖由典故和狱中见闻生发的自省警语，非政治语录。",
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
  "- 排除现代政党人物语录、选举口号、两岸/外交判断、治理口号、法律条文、新闻标题和直接政论断语。",
  "- 保留李敖明确引用、刊出、评改或自作的非政治诗文格言；古典诗文若出现在现代政论段落中，只按句子本体独立性保守收入。",
  "- 读者留言、新闻报道长段、现代政治人物政见与被李敖直接用于现代政治判断的口号式句子暂不收入。",
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
  "- 本轮补入广告文句和李敖警语均按非政治文句处理；新闻报道长段和法律条文仍不收。",
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
