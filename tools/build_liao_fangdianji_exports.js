const fs = require("fs");
const path = require("path");

const book = "李敖放电集";
const idPrefix = "LAFDJ";
const generatedDate = "2026-06-25";
const sourceDir = path.join("《大李敖全集6.0》分章节", "011.李敖电子报", "001.李敖放电集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const extractedCandidatesJson = path.join("analysis", "liao_fangdianji_quote_candidates.json");
const extractedReviewTsv = path.join("analysis", "liao_fangdianji_review_candidates.tsv");
const extractedAttributedTsv = path.join("analysis", "liao_fangdianji_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_fangdianji_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_fangdianji_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_fangdianji_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_fangdianji_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_fangdianji_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_fangdianji_proofread_report.txt");
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
    "首轮保守收入：本书电子报文章现代政论密度极高，现代政党人物语录、选举口号、两岸/外交判断、新闻标题和直接政论断语不收；只取可独立成立的诗文、古典文句、佛典引文、文学格言、幽默文句和李敖非政治诗文。",
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
    5,
    "此事如击石火、似闪电光。",
    "佛教文句",
    "佛书《五灯会元》",
    "李敖在总序解释“电光石火”时引用佛书文句，说明世事方生方灭、倏忽即逝。",
  ),
  q(
    "001.",
    5,
    "昨日婴孩，今朝老大，百年间，电光石火。",
    "词句",
    "姬翼《云山集》",
    "李敖在总序承接佛书语义，引用姬翼词句写人生百年如电光石火。",
  ),
  q(
    "002.",
    23,
    "李敖创办电子报\n男人喊爽女人叫\n别的报纸是手枪\n我的报纸是大炮",
    "李敖诗句",
    "李敖电子报广告诗",
    "李敖把旧日广告诗改为电子报版本，作为《李敖电子报》的自我宣传诗。",
    29,
  ),
  q(
    "002.",
    45,
    "出了天花的麻脸女人，在她每一个麻坑里面都可以看到美。",
    "外国文学格言",
    "泰戈尔语",
    "李敖给胖妹建议时引用泰戈尔语，说明审美可以超出世俗标准。",
  ),
  q(
    "002.",
    51,
    "在小女孩眼中，你可能不是最有名的。",
    "李敖格言",
    "李敖",
    "李敖讲胡佛签名故事后归结出的自嘲格言，提醒名人不必自视过高。",
  ),
  q(
    "002.",
    61,
    "武松到店沽酒，店内无人，蓦地一吼，店中空缸空瓮，皆嗡嗡有声。闲中著色，神微至此。",
    "古典散文",
    "张岱《陶庵梦忆》",
    "李敖谈第一流修辞境界时引用张岱写柳敬亭说书的一段。",
  ),
  q(
    "002.",
    63,
    "一刀初刺虎犹纵，三刀四刀虎不动。",
    "清诗句",
    "袁枚《费宫人刺虎歌》",
    "李敖举袁枚诗说明叙事中故意略去第二刀的修辞效果。",
  ),
  q(
    "002.",
    63,
    "速中脱序，神微至此。",
    "修辞格言",
    "李敖",
    "李敖把袁枚诗中的省略手法概括为“速中脱序”。",
  ),
  q(
    "006.",
    63,
    "无论左转或右弯\n无论东奔或西走\n无论倦步多跚跚\n或是前途多漫漫\n总有一天要回头\n回到熟悉的家门口\n无论海洋有多阔\n无论故乡有多远\n纵然把世界绕一圈\n总有一天要回到\n路的起点与终点\n纵然是破鞋也停靠\n在那扇，童年的门前",
    "现代诗",
    "余光中《无论》",
    "李敖为展示评改对象而全文引出余光中《无论》。",
    87,
  ),
  q(
    "006.",
    91,
    "无论东奔西走\n无论右弯左转\n无论前途多漫漫\n无论脚步多缓\n总有一天要回看\n回看那熟悉的门板\n无论沧海多阔\n无论归程多远\n无论世界给走遍\n也要回归起点\n无论鞋怎么破\n也要拖向那童年的门槛",
    "李敖改诗",
    "李敖改余光中《无论》",
    "李敖把余光中《无论》改写成较有韵脚和节奏的版本。",
    113,
  ),
  q(
    "007.",
    47,
    "With you a part of me hath passed away;\nFor in the peopled forest of my mind\nA tree made leafless by this wintry wind\nShall never don again its green array.\nChapel and fireside, country road and bay,\nHave something of their friendliness resigned;\nAnother, if I would, I could not find,\nAnd I am grown much older in a day,\nBut yet I treasure in my memory\nYour gift of charity, and young heart's ease,\nAnd the dear honour of your amity;\nFor these once mine, my life is rich with these.\nAnd I scarce know which part may greater be,\n-What I keep of you, or you rob from me.",
    "外国诗",
    "George Santayana《给 W. P.》",
    "李敖附出桑塔耶那原诗，用来对照余光中译文和自己的改译。",
    73,
  ),
  q(
    "007.",
    77,
    "我生命的一部已随你而消亡；\n因为在我心里那人物的林中，\n一棵树飘零于冬日的寒风，\n再不能披上它嫩绿的春装。\n教堂、炉边、郊路和湾港，\n都丧失些许往日的温情；\n另一个，就如我愿意，也无法追寻，\n在一日之内我白发加长\n但是我仍然在记忆里珍藏\n你仁慈的天性，你轻松的童心，\n和你那可爱的，可敬的亲祥；\n这一些曾属于我，便充实了我的生命。\n我不能分辨哪一份较巨\n——是我保留住你的，还是你带走我的。",
    "译诗",
    "余光中译桑塔耶那诗",
    "李敖为比较翻译优劣而刊出余光中译桑塔耶那诗。",
    103,
  ),
  q(
    "007.",
    107,
    "冬风扫叶时节，\n一树萧条如洗，\n绿装已卸，卸在我心里。\n我生命的一部份，\n已消亡随着你。\n教堂、炉边、郊路、和港湾，\n情味都今非昔比。\n虽有余情，也难追寻，\n一日之间，我不知老了几许？\n你天性的善良、慈爱和轻快，\n曾属于我，跟我一起。\n我不知道哪一部份多，\n——是你带走的我，还是我留下的你。",
    "李敖译诗",
    "李敖改译桑塔耶那诗",
    "李敖刊出自己在1972年对桑塔耶那诗的改译。",
    131,
  ),
  q(
    "012.",
    29,
    "怅望千秋一洒泪，萧条异代不同时。",
    "唐诗句",
    "杜甫诗句",
    "李敖引杜甫诗句，再由“不同时”改出自己的“却同时”。",
  ),
  q(
    "012.",
    29,
    "怅望千秋一洒泪，萧条异代却同时。",
    "李敖改诗",
    "李敖改杜甫诗句",
    "李敖把杜甫原句改为“却同时”，用来表达与异代人物同处一时的荒诞感。",
  ),
  q(
    "013.",
    5,
    "世界上最强而有力的人，就是那个最孤立的人",
    "外国戏剧名句",
    "易卜生《国民公敌》",
    "许信良来文中把易卜生名句赠给李敖，李敖将其收入电子报。",
  ),
  q(
    "013.",
    13,
    "李敖不是宽容社会下的产物，他是不宽容社会的见证",
    "人物评语",
    "《李敖快意恩仇录》书背介绍",
    "许信良文章引用《李敖快意恩仇录》书背介绍，概括李敖与时代环境的关系。",
  ),
  q(
    "013.",
    17,
    "要找我佩服的人，我就照镜子",
    "李敖自评",
    "李敖语",
    "许信良文章转述李敖自豪之语，用一句话写出李敖的自我评价。",
  ),
  q(
    "013.",
    45,
    "李翰祥满脸骄气，李敖一身傲骨。",
    "人物评语",
    "毕丽娜语",
    "李敖引用毕丽娜对李翰祥与自己的对比评语，并说这种看法很传神。",
  ),
  q(
    "015.",
    25,
    "取巧多智的贼，和她们同在一块儿，真理就很难找得着",
    "佛典引文",
    "《巴利典小品》",
    "李敖列举佛典中贬抑女性的旧说时引用此句。",
  ),
  q(
    "015.",
    25,
    "如雹，能害善苗",
    "佛典引文",
    "《正法念经》",
    "李敖列举佛典旧说时摘出《正法念经》中的比喻。",
  ),
  q(
    "015.",
    25,
    "着欲故，虽行福，不能得男身",
    "佛典引文",
    "《智度论》",
    "李敖列举佛典旧说时引用《智度论》句。",
  ),
  q(
    "015.",
    25,
    "女人是大毒",
    "佛典引文",
    "《宝积经》",
    "李敖列举佛典旧说时摘出《宝积经》句。",
  ),
  q(
    "015.",
    25,
    "大魔王，能食一切人",
    "佛典引文",
    "《大般涅盘经》",
    "李敖列举佛典旧说时摘出《大般涅盘经》句。",
  ),
  q(
    "015.",
    25,
    "佛不出世时，女人入地狱如春雨雹",
    "佛典引文",
    "《增一阿含经》",
    "李敖列举佛典旧说时引用《增一阿含经》句。",
  ),
  q(
    "015.",
    25,
    "若善男子善女人等无有不求男子身者，何以故？一且女人皆是众恶之所住处。……如蚊子尿不能令此大地润洽，其女人者淫欲难满，亦复如是。……若有不能知佛性者，我说是等名为女人；若能自知有佛性者，我说是人为丈夫相；若有女人能知自身定有佛性，尝知是等即为男子。",
    "佛典引文",
    "《大般涅盘经》",
    "李敖较完整地引《大般涅盘经》一段，作为佛典旧说的证据。",
  ),
  q(
    "018.",
    11,
    "心之忧矣，自诒伊戚",
    "诗经名句",
    "《诗经》",
    "李敖在信中引用《诗经》句，说明忧患由己招致。",
  ),
  q(
    "019.",
    25,
    "婚是何物，直教生死相许",
    "李敖化用词句",
    "化用元好问“问世间，情是何物，直教生死相许”",
    "李敖谈冥婚故事时把元好问词意改成“婚是何物”。",
  ),
  q(
    "019.",
    33,
    "原之所以自容于明公，公之所以待原者，以能守训典而不易也！若听明公之命，则是凡庸也！明公焉以为哉？",
    "古典史传文句",
    "邴原拒曹操冥婚故事",
    "李敖谈冥婚时引用邴原拒绝曹操合葬之语。",
  ),
  q(
    "019.",
    33,
    "禁迁葬者与嫁殇者。",
    "经典文句",
    "《周礼》",
    "李敖谈冥婚制度时引用《周礼》明禁。",
  ),
  q(
    "019.",
    33,
    "生时非夫妇，死而迁葬之，使相从",
    "古注引文",
    "《周礼》批注",
    "李敖引《周礼》批注解释“迁葬”。",
  ),
  q(
    "020.",
    5,
    "一定在什么地方弄错了。",
    "漫画文句",
    "《花花公子》漫画台词",
    "李敖引用早年漫画台词，作为发生乌龙时的幽默格言。",
  ),
  q(
    "021.",
    5,
    "闲静少言，不慕荣利。好读书，不求甚解；每有会意，便欣然忘食",
    "古文名句",
    "陶渊明《五柳先生传》",
    "李敖为“不求甚解”辨义时引用陶渊明自述。",
  ),
  q(
    "022.",
    7,
    "止！楚王失弓，楚人得之，又何求之？",
    "古典故事文句",
    "《孔子家语》楚王失弓故事",
    "李敖引用楚王失弓故事中的楚王之语。",
  ),
  q(
    "022.",
    7,
    "惜乎其不大也！不曰人遗弓，人得之而已，何必楚也？",
    "古典故事文句",
    "《孔子家语》孔子评楚王失弓",
    "李敖引用孔子对楚王失弓故事的评论，强调去掉地域限定更见其大。",
  ),
];

const proofreadBeforeRows = 32;
const proofreadRemovedRows = [];
const proofreadAddedRows = [
  [
    "李敖不是宽容社会下的产物，他是不宽容社会的见证",
    "013.1999年11月16日.txt:13",
    "校对复核补入；原文明确引号标出，句子本体为非政治人物评语。",
  ],
  [
    "要找我佩服的人，我就照镜子",
    "013.1999年11月16日.txt:17",
    "校对复核补入；原文明确说是李敖自评，句子本体为非政治格言。",
  ],
  [
    "李翰祥满脸骄气，李敖一身傲骨。",
    "013.1999年11月16日.txt:45",
    "校对复核补入；原文明确引毕丽娜语，属于人物评语。",
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
  "李远哲",
  "许信良",
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
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => `- ${id}｜${quoteText}｜${reason}`),
  "",
  "补入项：",
  ...proofreadAddedRows.map(([quoteText, source, reason]) => `- ${quoteText}｜${source}｜${reason}`),
  "",
  "边界说明：",
  "- 继续排除现代政党人物语录、选举口号、两岸/外交判断、治理格言和读者留言。",
  "- 仅补入原文明确引号标出、句子本体可独立成立的非政治人物评语和李敖自评。",
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
