const fs = require("fs");
const path = require("path");

const book = "蒋介石研究";
const idPrefix = "LAJJSY";
const generatedDate = "2026-06-27";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "016.蒋介石研究");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_chiang_kai_shek_study_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_chiang_kai_shek_study_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_chiang_kai_shek_study_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_chiang_kai_shek_study_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_chiang_kai_shek_study_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_chiang_kai_shek_study_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_chiang_kai_shek_study_initial_report.txt");
const proofreadReportTxt = path.join("analysis", "liao_chiang_kai_shek_study_proofread_report.txt");
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
      "首轮保守收入：《蒋介石研究》以近现代政治人物、政党、军政、革命、国家与意识形态论战为主体；党派文件、政权攻防、领袖语录、军政口号、革命/反革命/反共/民族国家叙述与现代政治评论不收，只保留可脱离具体政治论战独立检索的古典文句、诗句、俗语、联语、笑话和礼俗文献句。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "《蒋介石研究》自序",
    3,
    "文格渐卑庸福近",
    "文人格言",
    "古人格言",
    "李敖引用古人格言，说明文章格调与庸常福分之间的反比关系。",
    3,
    "只收古人格言本体，不收同段蒋介石、袁世凯、国民人格等政治论战。",
  ),
  q(
    "《蒋介石研究》自序",
    3,
    "文格渐尊奇祸近",
    "李敖化用格言",
    "李敖化用古人格言",
    "李敖把古人格言反转成自己的写作自况，形成可独立检索的文人格言。",
    3,
    "只收化用格言本体，不收同段政治人物与政治压迫叙述。",
  ),
  q(
    "《蒋介石研究》自序",
    5,
    "诛奸谀于既死，发潜德之幽光",
    "史学格言",
    "史家笔法成句",
    "李敖引用史家笔法句，说明历史写作应凭证据揭发奸谀、表彰潜德。",
    5,
    "只收史学写作格言本体，不收同段墨索里尼、法西斯与政治人物论述。",
  ),
  q(
    "002.",
    129,
    "英雄不问出身",
    "俗语成语",
    "中国俗语",
    "李敖引用俗语，说明有成就者不必追问出身来历。",
    129,
    "只收俗语本体，不收同段军校、士官同学会与蒋介石学历真伪论述。",
  ),
  q(
    "003.",
    23,
    "当仁不让",
    "论语成语",
    "《论语·卫灵公》成句",
    "李敖转引黄郛等人用成语表达遇到应做之事不可推让。",
    23,
    "只收古典成语本体，不收同段革命组织与排满叙述。",
  ),
  q(
    "003.",
    23,
    "富贵不能淫，贫贱不能移，威武不能屈，此之谓大丈夫",
    "孟子文句",
    "《孟子·滕文公下》",
    "李敖转引《孟子》句，解释“丈夫团”名称所本的大丈夫精神。",
    23,
    "只收孟子原句本体，不收同段同盟会、秘密组织与革命叙述。",
  ),
  q(
    "005.",
    165,
    "养天地正气，法古今完人。",
    "联语",
    "鼓山题联",
    "李敖引鼓山石壁联语，呈现修养正气、取法完人的道德题辞。",
    165,
    "只收联语本体，不收同段军政行踪和蒋介石纪念题字叙述。",
  ),
  q(
    "005.",
    165,
    "其介如石",
    "易经文句",
    "《易经·豫卦》成句",
    "李敖提到题字所用古典成句，保留其坚介如石的文义。",
    165,
    "只收古典成句本体，不收同段蒋介石命名与题字纪念语境。",
  ),
  q(
    "006.",
    3,
    "吾夫既死，与之同棺共穴可也。",
    "古代轶事语",
    "汴梁儒士孟志刚夫人衣氏语",
    "李敖转述古代合葬轶事中妻子的决绝之语。",
  ),
  q(
    "007.",
    29,
    "几生修到会龙华，马面牛头并夜叉。非是桐宫明一德，却来羑里演三车。",
    "居正诗句",
    "居正《梅川谱偈》",
    "李敖引用居正诗，写看守所经历与佛典意象。",
  ),
  q(
    "007.",
    35,
    "阿奴引入别幽居，见有人将鼻倒书。觉后忆来真梦梦，将毋幻想堕玄虚。",
    "居正诗句",
    "居正《梅川谱偈》",
    "李敖引用居正诗，写狱中梦境与事后回忆。",
  ),
  q(
    "007.",
    41,
    "出狱移居周必由，不堪检点客来愁。雪深门杜无人扫，恐露风声又碰头。",
    "居正诗句",
    "居正《梅川谱偈》",
    "李敖引用居正诗，写出狱后受检点看守的生活。",
  ),
  q(
    "007.",
    41,
    "不曾见异敢思迁，许徙蓝庄度夏天。寓舍四围洪水绕，渡船常系浅芦边。",
    "居正诗句",
    "居正《梅川谱偈》",
    "李敖引用居正诗，写迁居蓝家庄后的水乡寓居景况。",
  ),
  q(
    "016.",
    7,
    "无宁不成埠",
    "地方俗语",
    "宁波商帮俗语",
    "李敖引用俗语，说明宁波商人在商埠中的突出存在。",
    7,
    "只收地方俗语本体，不收同段地域性讥评。",
  ),
  q(
    "018.",
    9,
    "学也者，使人求于内也。不求于内而求于外，非圣人之学也。",
    "理学文句",
    "张载语",
    "李敖引用张载语，说明求学应反求诸己。",
  ),
  q(
    "018.",
    11,
    "近世有人为学，专要说空说妙，不肯就实，却说是悟，此是不知学。",
    "理学文句",
    "朱熹语",
    "李敖引用朱熹语，批评空谈玄妙而不落实的学风。",
  ),
  q(
    "018.",
    13,
    "所谓气质无待于变化者，以气质之本然，即人之恒性，无可变化。",
    "理学文句",
    "刘宗周语",
    "李敖引用刘宗周语，说明对“变化气质”理论的反驳。",
  ),
  q(
    "018.",
    15,
    "变化气质之恶，三代圣人，全未道及。",
    "理学文句",
    "颜元语",
    "李敖引用颜元语，说明气质之恶并非三代圣人所主张的说法。",
  ),
  q(
    "018.",
    15,
    "必在行上得之",
    "理学文句",
    "颜元语",
    "李敖引用颜元语，强调变化气质须落实在行动上。",
  ),
  q(
    "018.",
    21,
    "学者先须变化气质。",
    "理学文句",
    "张载语",
    "李敖引用张载语，说明求学者首先要改变气质。",
    21,
    "只收张载理学句本体，不收同段革命责任、革命道德等政治化引申。",
  ),
  q(
    "018.",
    21,
    "为学大益，在自能变化气质。",
    "理学文句",
    "张载语",
    "李敖引用张载语，说明为学的重要益处在于自我变化气质。",
    21,
    "只收张载理学句本体，不收同段革命责任、革命道德等政治化引申。",
  ),
  q(
    "020.",
    19,
    "忠孝传家",
    "家训题字",
    "蒋氏祠堂题字",
    "李敖引用祠堂题字，保留其作为家训格言的形式。",
    19,
    "只收家训题字本体，不收同段宗教、风水与时局决策叙述。",
  ),
  q(
    "021.",
    3,
    "报告队长，大概在十个月后！",
    "外国笑话",
    "洋笑话",
    "李敖转述洋笑话的妙答，用来制造怀胎时间的反讽。",
    3,
    "只收笑话妙答本体，不收后文蒋经国身世论述。",
  ),
  q(
    "021.",
    31,
    "阳翟有妇人，妊身三十月，乃生子",
    "古籍异闻",
    "《嵩高山记》",
    "李敖引用古籍异闻，说明中国史籍中怀胎甚久的神话记录。",
  ),
  q(
    "022.",
    23,
    "原之所以自容于明公，公之所以待原者，以能守训典而不易也！若听明公之命，则是凡庸也！明公焉以为哉？",
    "古代人物语",
    "邴原语",
    "李敖引用邴原拒绝冥婚合葬请求的古语，说明守训典不可轻易改变。",
  ),
  q(
    "022.",
    23,
    "禁迁葬者与嫁殇者。",
    "礼制文句",
    "《周礼·地官·媒氏》",
    "李敖引用《周礼》文句，说明传统经典对迁葬与嫁殇的禁止。",
  ),
  q(
    "022.",
    23,
    "生时非夫妇，死而迁葬之，使相从",
    "礼制注疏",
    "《周礼》注解",
    "李敖转引注解，解释“迁葬”即生前非夫妇而死后迁葬相从。",
  ),
  q(
    "022.",
    27,
    "新妇年少，终必他适，可令吾子鳏处地下耶？",
    "史传文句",
    "《元史》相关记载",
    "李敖引用史传文句，说明冥婚合葬观念中的父亲之问。",
  ),
  q(
    "022.",
    33,
    "能执干戈以卫社稷，虽欲无殇，不亦可乎？",
    "礼制文句",
    "孔子语",
    "李敖引用孔子语，说明殇者是否立后的礼制例外。",
    33,
    "只收古礼文句本体，不收同篇蒋家继承与政治人物身世攻防。",
  ),
];

const proofreadRemovedRows = [
  {
    ...rawRows.find((row) => row.quote_text === "能执干戈以卫社稷，虽欲无殇，不亦可乎？"),
    id: "LAJJSY-029",
    proofread_reason: "校对从严删除：虽为古礼文句，但 quote_text 本体含“干戈”“社稷”，属于武力护国语义，容易落入政治/军事语录口径。",
  },
];

const proofreadRemovedQuoteKeys = new Set(proofreadRemovedRows.map((row) => normalizeText(row.quote_text)));

const proofreadAdditions = [
  q(
    "005.",
    165,
    "吾能于亭后小筑三椽，隐居自适，斯愿足矣！",
    "山水隐居语",
    "游山题记引语",
    "李敖引用游山文字中的隐居自适之语，表现小筑山亭、闲居自足的心愿。",
    165,
    "校对补入：只收隐居自适句本体，不收同段蒋介石行踪和纪念题字叙述。",
  ),
  q(
    "018.",
    9,
    "人有日诵万言，或绝妙技艺，此可学否？曰：不可。",
    "理学文句",
    "张载语",
    "李敖引用张载语，说明外在记诵和技艺并不等同于圣人之学。",
  ),
  q(
    "022.",
    39,
    "长支长子不得出继他支",
    "民俗法制语",
    "《中国民事习惯大全》",
    "李敖引用民事习惯材料，说明宗法观念中长支长子不得出继的规则。",
    39,
    "校对补入：只收宗法民俗规则本体，不收同篇蒋家继承攻防。",
  ),
  q(
    "022.",
    41,
    "大宗不可绝",
    "宗法俗语",
    "中国宗法观念",
    "李敖引用宗法俗语，说明长房大宗必须延续香火的观念。",
  ),
  q(
    "022.",
    43,
    "一门两不绝",
    "宗法俗语",
    "中国宗法观念",
    "李敖引用宗法俗语，说明兼祧制度下兼顾两房后嗣的办法。",
  ),
  q(
    "022.",
    57,
    "凡子弟未婚夭亡，类多择一门户相当，年龄相若之亡女，为之定婚，迎接木主过门，礼节如生人嫁娶，名曰‘冥配’。",
    "民俗文献句",
    "《中国民事习惯大全》",
    "李敖引用民事习惯材料，记录平湖县冥配的具体做法。",
    57,
    "校对补入：只收冥配民俗文献句，不收同篇蒋家身世与继承攻防。",
  ),
];

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
  "干戈",
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
  path.join("analysis", "liao_chiang_kai_shek_study_proofread_audit.tsv"),
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
  "policy: this book is dominated by Chiang Kai-shek, party-state documents, revolution, military schools, regime legitimacy, leader criticism, Taiwan/mainland narratives, and modern political history; exclude direct party, regime, leader, military, revolution, state, national identity, official document, and ideological quotations, while keeping independently reusable classical texts, poems, proverbs, couplets, jokes, philological notes, and ritual/customary texts.",
  "",
  "selectedHighlights:",
  "- 自序: 收文人格言、李敖化用格言与史学格言；排除“为国民争人格”等政治人格论述。",
  "- 003: 只收《孟子》《论语》古典句，不收同盟会、革命组织、排满与军事留学生叙述。",
  "- 005/020: 只收联语、易经成句与家训题字本体，不收蒋介石行踪、信仰与时局决策叙述。",
  "- 007: 收居正狱中生活诗四首；“御侮当前耻阋墙，精诚团结为非常”因直接连着九一八与政局语境，首轮不收。",
  "- 018: 收张载、朱熹、刘宗周、颜元关于变化气质的理学文句；校对补入“人有日诵万言……”；排除“革命责任/革命道德/革命人格”等政治化引申。",
  "- 022: 收冥婚、迁葬、嫁殇、立后相关古礼、宗法俗语和民俗文献句；校对删除“能执干戈以卫社稷……”以避开武力护国语义。",
  "",
  "excludedHighlights:",
  "- 001: “唯公无辫”等属于蒋介石形象神话与政治宣传材料，不收。",
  "- 008/010/013/015/017: 弹劾电、通电、国库黄金、自承罪愆、大法螺等主体均为现代政治史料或政论攻防，不收。",
  "- 019: 钱穆相关材料多为现代教育/政治人物争议语境，首轮从严不收。",
  "- 005: “兄可敝屣尊荣，不能敝屣道义”虽像道德格言，但出自现代政治人物之间的政治信札语境，首轮不收。",
  "- 016: “十年生聚，十年教训”虽为古典成句，但本处夹在反攻、共匪、复国等军政讲话里，校对轮仍不收。",
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
