const fs = require("fs");
const path = require("path");

const book = "大江大海骗了你";
const idPrefix = "LADJDH";
const generatedDate = "2026-06-27";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "015.大江大海骗了你");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_dajiang_dahai_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_dajiang_dahai_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_dajiang_dahai_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_dajiang_dahai_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_dajiang_dahai_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_dajiang_dahai_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_dajiang_dahai_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_dajiang_dahai_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_dajiang_dahai_proofread_report.txt");
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
      "首轮保守收入：本书围绕《大江大海一九四九》、龙应台、蒋介石、国民党、二二八、战争、流亡、台湾/大陆政治叙事展开；党派、政权、国家、战争、军政、革命、投降、国族、政治人物攻防、历史翻案与意识形态语录不收，只保留能脱离具体政治论战独立检索的谚语、古典文句、成语掌故、文学句和治学方法语。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    13,
    "Even Homer sometimes nods. 荷马也有打盹时、荷马也会有一失。",
    "西方谚语",
    "西谚",
    "李敖引用西谚说明再勤奋的人也会有疏忽。",
  ),
  q(
    "028.",
    7,
    "美貌只是一层皮”（Beauty's but skin deep.）",
    "英谚",
    "英语谚语",
    "李敖引用英谚说明外表与真正内涵之间的距离。",
    7,
    "只收英谚本体，不收同段关中、国民党和龙应台攻防。",
  ),
  q(
    "066.",
    7,
    "子入太庙，每事问。或曰：“孰谓鄹人之子知礼乎？入太庙，每事问。”子闻之，曰：“是礼也？”",
    "论语文句",
    "《论语·八佾》",
    "李敖录《论语》原文，用来辨析孔子“每事问”与反问语气。",
  ),
  q(
    "140.",
    3,
    "维鹊有巢，维鸠居之。",
    "诗经句",
    "《诗经·召南·鹊巢》",
    "李敖引用《诗经》句，说明“鹊巢鸠占”成语的源头。",
  ),
  q(
    "140.",
    3,
    "鹊巢柳树，鸠夺其处。",
    "易林句",
    "《易林》",
    "李敖引用《易林》句，与《诗经》并列说明“鹊巢鸠占”的演变。",
  ),
  q(
    "140.",
    3,
    "鹊巢鸠占",
    "成语",
    "中国成语",
    "李敖指出《诗经》《易林》相关说法演变成“鹊巢鸠占”的成语。",
  ),
  q(
    "141.",
    19,
    "吾愧居卢前，耻居王后！",
    "初唐文人掌故",
    "杨炯语",
    "李敖引用杨炯不满四杰排序的掌故，表达不愿与不相类者并列的心理。",
    19,
    "只收文学掌故本体，不收同段柏杨、国民党文人与政治犯争辩。",
  ),
  q(
    "158.",
    9,
    "无官一身轻",
    "俗语成语",
    "中国俗语",
    "李敖引用俗语，形容无官职羁绊后的轻松。",
    9,
    "只收俗语本体，不收同段一九四九、郑成功、官员逃亡等政治历史论述。",
  ),
  q(
    "160.",
    15,
    "何不食肉糜？（为什么不吃肉？）",
    "古典典故",
    "晋惠帝典故",
    "李敖借晋惠帝典故讽刺不知民间疾苦的说法。",
    15,
    "只收古典典故本体，不收同段钱复、国民党与外省人流亡论述。",
  ),
  q(
    "164.",
    7,
    "相逢一笑泯恩仇",
    "现代诗句",
    "鲁迅《题三义塔》",
    "李敖化用鲁迅诗句，写多年后与旧日对立者相见的场景。",
    7,
    "只收诗句本体，不收同段警备总部、军人信念与国家论述。",
  ),
  q(
    "180.",
    15,
    "嫣然一笑",
    "古典成语",
    "古典文辞",
    "李敖举“嫣然一笑”为例，批评现代文字误用古典词语。",
  ),
  q(
    "186.",
    13,
    "托诸空言",
    "治学成语",
    "传统学术语",
    "李敖用“托诸空言”说明空泛议论与实证考据的差别。",
  ),
  q(
    "186.",
    13,
    "见诸行事",
    "治学成语",
    "传统学术语",
    "李敖用“见诸行事”说明考据之学应落到具体事实与证据上。",
  ),
  q(
    "186.",
    13,
    "上穷碧落下黄泉、动手动脚找东西。",
    "治学格言",
    "傅斯年语",
    "李敖引用傅斯年语，强调考据要穷尽材料并亲自搜证。",
  ),
  q(
    "189.",
    3,
    "上帝一定疼面目平常之人，不然为什么造那么多。",
    "外国格言",
    "林肯语",
    "李敖引用林肯语，讽刺平凡面目与大众认同。",
  ),
  q(
    "189.",
    3,
    "泯然众人矣。",
    "古文成句",
    "王安石《伤仲永》",
    "李敖化用王安石成句，写人最终归于平庸无奇。",
  ),
];

const initialRows = rawRows;
const proofreadRemovedRows = [];
const proofreadAdditions = [
  q(
    "002.",
    21,
    "凡是你没读过的书，就是新书。",
    "现代格言",
    "李敖自引",
    "李敖自述其对“秘密”的宽泛定义，用这句格言说明未读之书仍可视作新书。",
    21,
    "校对补入：只收读书格言本体，不收同段书名策划与访谈机锋。",
  ),
  q(
    "003.",
    7,
    "悟以往之不谏，知来者之可追",
    "古典诗文",
    "陶渊明《归去来兮辞》",
    "对话者借陶渊明成句，说明人到晚年仍可回望过去、追补后来。",
    7,
    "校对补入：只收陶渊明成句本体，不收同段针对龙应台的攻防。",
  ),
  q(
    "010.",
    5,
    "虽欲从之，末由也已！",
    "论语成句",
    "《论语·子罕》",
    "李敖化用孔子语，说明面对前后矛盾的论述时无从依循。",
    5,
    "校对补入：只收经典感叹句本体，不收同段钱穆文化论争与国家民族叙述。",
  ),
  q(
    "010.",
    25,
    "我现在用西餐叉子来吃了。”（I us'um fork now.）",
    "外国笑话",
    "英国探险故事",
    "李敖转述外国笑话中蛮人的妙答，用以讽刺表面西化而本质未变。",
    25,
    "校对补入：只收非政治笑话妙答本体。",
  ),
  q(
    "017.",
    23,
    "金玉其外，败絮其中",
    "成语",
    "明代刘基《卖柑者言》成句",
    "对话者用成语概括外表光鲜、内里败坏的反差。",
    23,
    "校对补入：只收传统成语本体，不收同段文坛与人物攻防。",
  ),
  q(
    "034.",
    27,
    "不出户，知天下",
    "老子文句",
    "《老子》",
    "李敖引用老子语，说明第一流知识分子应有不必亲临而能通达天下的判断力。",
    27,
    "校对补入：只收老子成句本体，不收同段台湾、大陆、台独与军事威胁论述。",
  ),
  q(
    "185.",
    49,
    "不入于杨、则入于墨",
    "孟子文句",
    "《孟子·滕文公下》",
    "李敖借孟子排杨墨语，说明现代知识分子不必落入二元选择。",
    49,
    "校对补入：只收古典思想史成句本体，不收同段一九四九与蒋介石叙述。",
  ),
  q(
    "190.",
    7,
    "无数只的脚，无穷尽的奋斗，一生的努力，只能走一点点的路。（打死它）我有点心软了。",
    "现代散文句",
    "龙应台《目送·卡夫卡》",
    "李敖引龙应台小品文句，作为对其非政治散文优点的例证。",
    7,
    "校对补入：只收小品文中的非政治文学句，不收随后李敖改写讽刺句。",
  ),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "国民党",
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
  "国防部",
  "警备总部",
  "二二八",
  "一九四九",
  "1949",
  "战争",
  "抗战",
  "国共",
  "革命",
  "反攻",
  "流亡",
  "亡国",
  "救国",
  "国家",
  "祖国",
  "民族",
  "政治",
  "民主",
  "自由主义",
  "独裁",
  "蒋介石",
  "蒋经国",
  "马英九",
  "陈水扁",
  "龙应台",
  "龙局长",
  "李登辉",
  "美国大兵",
  "俄国大兵",
  "苏联",
  "日本",
  "台湾",
  "大陆",
  "投降",
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
  "policy: this book is dominated by modern political history, war memories, party-state disputes, Taiwan/mainland narratives, and direct attacks on Long Yingtai and political figures; exclude direct party, regime, leader, war, revolution, state, national identity, martyrdom, official document, and ideological quotations, while keeping independently reusable proverbs, classical texts, literary phrases, philological notes, and historical-method sayings.",
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
  "- 007/027/035/039/050/058/059/086/108/111/121/122/123/146/147/150/153/157/172/173: 汉贼、救国、亡国、殉国、投降、革命、二二八、战争、党国、军政与国家叙事材料继续排除。",
  "- 002.从“拾穗”到“拿锄头的人”.txt:9 “非其种者，锄而去之”虽为古语式文句，但本处紧贴“危险的社会主义倾向”，校对轮继续不收。",
  "- 010.龙应台怎样吃人肉？.txt:5 “未有民族文化已衰息断绝，而其国家之生命犹得长存者”等文化/国家论述虽为钱穆原文，但国家民族论辩语感过重，继续不收。",
  "- 103.“让老子先逃啊！”.txt:5 “檀公三十六策，走是上计。汝父子唯应急走耳！”虽出《南齐书》，但本处直接服务蒋氏父子逃亡讽刺，校对轮不收。",
  "- 148.“当然被我活捉”.txt:11 “因粮于敌/因武器于敌”直接嵌在国共、美援与战事叙述中，继续排除。",
  "- 065.龙应台比国民党还国民党.txt:31 “始作俑者，其无后乎？”虽为孔子句，但本处直接用来评价蒋介石与政治派别，首轮从严不收。",
  "- 108/115/116: “此度见花枝，白头誓不归”紧贴宋希濂/杜家政治流亡与归返叙事，首轮不收。",
  "- 157.前方吃紧，后方紧吃.txt:3 “首都已陷休回顾，更抱佳人舞几回”直接服务一九四九政局讽刺，首轮不收。",
  "- 137.被骗了的张乐平.txt:5 张乐平“向不合理的社会制度提出严厉的控诉”虽具文艺史意义，但含明确社会制度批判，首轮从严不收。",
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
