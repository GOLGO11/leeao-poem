const fs = require("fs");
const path = require("path");

const book = "李登辉的真面目";
const idPrefix = "LALDHTF";
const generatedDate = "2026-06-26";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "006.李登辉的真面目");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_li_denghui_true_face_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_li_denghui_true_face_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_li_denghui_true_face_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_li_denghui_true_face_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_li_denghui_true_face_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_li_denghui_true_face_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_li_denghui_true_face_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_li_denghui_true_face_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_li_denghui_true_face_proofread_report.txt");
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
  if (selector === "引言") return "《李登辉的真面目》引言.txt";
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
      "首轮保守收入：本书为现代人物政论集，党派、总统、国族、选举、司法、航空公司利益和现代政治攻击语录一律不收；只保留可脱离政论语境的古典引文、礼俗考证、人物品格评语、文学诗句、语言格言、少量生活/研究方法句。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "002.",
    21,
    "女为君子儒，勿为小人儒",
    "论语成句",
    "《论语·雍也》",
    "李敖转引谷正文以孔子语区分君子儒与小人儒。",
  ),
  q(
    "004.",
    3,
    "Fine. I think I'm making an ass of myself.",
    "英文谐语",
    "漫画双关语",
    "李敖借英文 ass 双关解释倒立漫画中的自嘲。",
  ),
  q(
    "004.",
    7,
    "非有材能，但以婉媚贵幸，与上卧起",
    "古文引句",
    "《汉书·佞幸传》",
    "李敖引《汉书》说明佞幸并非以才能进身。",
  ),
  q(
    "004.",
    9,
    "柔曼之倾意，非独女德，盖亦有男色焉。",
    "古文引句",
    "《汉书·佞幸传》",
    "李敖转引《汉书》佞幸传关于男色受宠的总论。",
  ),
  q(
    "004.",
    9,
    "然进不繇道，位过其任，莫能有终，所谓爱之适足以害之者也！",
    "古文格言",
    "《汉书·佞幸传》",
    "李敖转引《汉书》以进身不由其道说明受宠反害其身。",
  ),
  q(
    "005.",
    27,
    "上穷碧落下黄泉，动手动脚找资料",
    "治学谐语",
    "李敖化用白居易诗句",
    "李敖以白居易名句改写成找资料的研究方法谐语。",
  ),
  q(
    "009.",
    5,
    "古人之坐者，两膝着地因反其跖而坐于其上，正如今之胡跪者。……疑跪有危义，故两膝着地，伸腰及股而势危者为跪；两膝着地，以尻着跖而稍安者为坐也。",
    "礼俗考证",
    "朱熹《跪坐拜说》",
    "李敖转引朱熹考证古人坐、跪之别。",
  ),
  q(
    "009.",
    7,
    "坐地皆席地，两膝据地，伸腰危坐而以足承尻后",
    "礼俗考证",
    "黄遵宪《日本国志》",
    "李敖转引黄遵宪描述日本坐相的来源与形态。",
  ),
  q(
    "009.",
    15,
    "立毋跛、坐毋箕、寝毋伏",
    "礼记成句",
    "《礼记·曲礼上》",
    "李敖转引《礼记》说明站、坐、卧的礼仪禁忌。",
  ),
  q(
    "011.",
    19,
    "为善若升，为恶若崩",
    "古典格言",
    "古语",
    "李敖借古语说明学好艰难、学坏容易。",
  ),
  q(
    "012.",
    9,
    "私事不与人计较，公事则必力争；就事论事，既不迁怒，亦不怀怨。",
    "人物品格评语",
    "李登辉校长纪念文引文",
    "李敖转引旧文概括复旦李登辉处私事、公事的风度。",
  ),
  q(
    "012.",
    9,
    "知无不言、言无不尽",
    "处世成语",
    "李登辉校长纪念文引文",
    "李敖转引旧文形容复旦李登辉坦白直率。",
  ),
  q(
    "012.",
    13,
    "其诠释之精确、例证之详尽、文笔之练达，足为后学者之规范。",
    "学术评语",
    "李登辉校长纪念文引文",
    "李敖转引旧文评价复旦李登辉英语文法与修辞著作。",
  ),
  q(
    "012.",
    13,
    "荜路蓝缕，以启山林",
    "古典成语",
    "《左传》成句",
    "李敖转引旧文以成语形容复旦大学早期经营之艰辛。",
  ),
  q(
    "012.",
    15,
    "自奉俭约，不事生产积蓄",
    "人物品格评语",
    "李登辉校长纪念文引文",
    "李敖转引旧文概括复旦李登辉自奉俭约、不积私产。",
  ),
  q(
    "012.",
    15,
    "晚年生活，其寂寞如古庙孤僧。",
    "人物晚景文句",
    "李登辉校长纪念文引文",
    "李敖转引旧文以古庙孤僧比喻复旦李登辉晚年寂寞。",
  ),
  q(
    "019.",
    5,
    "慎终追远，缅怀祖德",
    "祭祀成语",
    "祭祖报导用语",
    "李敖转引祭黄陵报导中慎终追远、缅怀祖德的成语。",
  ),
  q(
    "020.",
    9,
    "名无固宜，约之以命。约定俗成谓之宜，异于约则谓之不宜。",
    "语言哲学",
    "《荀子·正名》",
    "李敖转引荀子说明名物称谓与约定俗成的关系。",
  ),
  q(
    "023.",
    29,
    "将飞者翼伏，将奋者足局",
    "古典格言",
    "蒋介石讲词转引古语",
    "李敖转引讲词中以伏翼跼足比喻奋飞前的蓄势。",
  ),
  q(
    "023.",
    33,
    "猪八戒照镜子——里外不是人",
    "俗语",
    "中国俗语",
    "李敖用俗语形容两面都不讨好的困境。",
  ),
  q(
    "028.",
    71,
    "还没升空世已惊，老子机票全不送",
    "打油诗句",
    "李敖讽刺长荣航空句",
    "李敖以打油诗句讽刺航空优惠争议。",
  ),
  q(
    "030.",
    17,
    "假使这种刊物突然有一篇文章恭维我，我便会因此而怀疑自己的人格，感到不安的。他们骂我，我倒觉得这是很自然的，没有什么。",
    "人格格言",
    "徐复观语",
    "李敖转引徐复观以被某类刊物恭维反而自疑人格的说法。",
  ),
  q(
    "030.",
    21,
    "观人于其所友",
    "古典成语",
    "古话",
    "李敖转引古话说明可由交友观察一个人。",
  ),
  q(
    "030.",
    23,
    "三千宠爱在一身",
    "唐诗成句",
    "白居易《长恨歌》",
    "李敖借白居易诗句形容集中得宠。",
  ),
  q(
    "032.",
    9,
    "自己只要站的稳，不怕别人说闲话",
    "处世格言",
    "长荣方面对外解释语",
    "李敖转引长荣方面以站稳自身回应闲话的句子。",
  ),
  q(
    "033.",
    33,
    "在五十四号牢房里，我领悟到一件事情，就是去重视那种内在的成就，那种内在的成就能维持一个人内心的均衡，并帮助一个人对他自己忠实。除非他先对自己忠实，才会有人对他忠实。",
    "自我修养格言",
    "萨达特自传",
    "李敖转引萨达特自传中关于内在成就与忠实于自己的话。",
  ),
  q(
    "034.",
    33,
    "如果青蛙耐不住寂寞，\n又算死水叫出了歌声。\n这是一沟绝望的死水，\n这里断不是美的所在，\n不如让给丑恶来开垦，\n看他造出个什么世界。",
    "新诗",
    "闻一多《死水》",
    "李敖转引闻一多《死水》末段诗句。",
    43,
  ),
  q(
    "034.",
    121,
    "问渠哪得清如许，为有源头活水来",
    "宋诗名句",
    "朱熹《观书有感》",
    "李敖转引朱熹诗句说明活水之源。",
  ),
];

const proofreadExclusions = new Map([
  [
    "Fine. I think I'm making an ass of myself.",
    "英文漫画双关只是段子包袱，且所在章节转入现代政治讽刺，校对轮不作为诗文格言保留。",
  ],
  [
    "慎终追远，缅怀祖德",
    "出自祭黄陵政治报导语境，是现代官方祭祀套语，校对轮按政治语境从严删去。",
  ],
  [
    "将飞者翼伏，将奋者足局",
    "虽似古语，但本处由蒋介石政治讲词转出，服务于外蒙古与联合国语境，校对轮删去。",
  ],
  [
    "还没升空世已惊，老子机票全不送",
    "李敖就长荣航空利益争议写的时事打油句，属于现代商业政治攻防，不收。",
  ],
  [
    "自己只要站的稳，不怕别人说闲话",
    "长荣方面对外解释语，近于企业公关表态，虽可泛用但不是清洁的诗文格言引用。",
  ],
  [
    "在五十四号牢房里，我领悟到一件事情，就是去重视那种内在的成就，那种内在的成就能维持一个人内心的均衡，并帮助一个人对他自己忠实。除非他先对自己忠实，才会有人对他忠实。",
    "出自萨达特自传并用于现代政治人物对比，校对轮按政治人物语录删去。",
  ],
]);

const proofreadAdditions = [
  q(
    "引言",
    7,
    "俟后世圣人君子。",
    "古文成句",
    "司马迁语",
    "李敖引司马迁语，表示成书留待后世君子判断。",
    7,
    "校对轮补入：句子本身是古文成句，可脱离本书政论语境独立引用。",
  ),
  q(
    "007.",
    15,
    "风恬浪静可行船，恰是中秋月一轮，凡事不须多忧虑，福禄自有庆家门。",
    "签诗",
    "天后宫甲午签签诗",
    "李敖转引报导中的天后宫签诗四句。",
    15,
    "校对轮补入：只收签诗文本，不收同段关于选举的解释。",
  ),
  q(
    "008.",
    3,
    "魏王雅望非常。然床头捉刀人，此乃英雄也！",
    "世说新语名句",
    "《世说新语》曹操捉刀故事",
    "李敖转引《世说新语》故事中匈奴使者识破曹操的一句评语。",
    3,
    "校对轮补入：古代人物评语，非现代政治语录。",
  ),
];

const modernPoliticalTerms = [
  "国民党",
  "共产党",
  "共党",
  "中共",
  "台独",
  "总统",
  "副总统",
  "立法院",
  "行政院",
  "司法院",
  "国民大会",
  "选举",
  "司法",
  "中华民国",
  "中华文化复兴",
  "民主",
  "主权",
  "国家元首",
  "蒋介石",
  "蒋经国",
  "李登辉",
  "李总统",
  "民进党",
  "长荣集团",
  "长荣航空",
  "张荣发",
  "萨达特",
  "纳赛尔",
  "黄陵",
  "蒋陵",
  "文化总会",
  "政治",
  "政党",
  "党主席",
  "革命",
  "反共",
  "亡国",
  "迫害",
  "暗杀",
  "平反",
  "改革",
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

const initialRows = [...rawRows].sort(rowCompare);
const proofreadRemovedRows = initialRows
  .map((row, index) => ({
    original_id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
    ...row,
    reason: proofreadExclusions.get(row.quote_text),
  }))
  .filter((row) => row.reason);
const proofreadRows = [
  ...initialRows.filter((row) => !proofreadExclusions.has(row.quote_text)),
  ...proofreadAdditions,
].sort(rowCompare);

const rows = proofreadRows.map((row, index) => ({
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

function tsvCell(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

fs.writeFileSync(
  proofreadAuditTsv,
  [
    "action\tid_or_source\tquote_text\treason",
    `before\t\t\t${rawRows.length}`,
    ...proofreadRemovedRows.map((row) =>
      ["removed", row.original_id, row.quote_text, row.reason].map(tsvCell).join("\t"),
    ),
    ...proofreadAdditions.map((row) =>
      ["added", `${row.source_file}:${row.line_start}-${row.line_end}`, row.quote_text, row.notes].map(tsvCell).join("\t"),
    ),
    `after\t\t\t${rows.length}`,
  ].join("\n") + "\n",
  "utf8",
);

const candidatesData = fs.existsSync(candidatesJson) ? JSON.parse(fs.readFileSync(candidatesJson, "utf8")) : null;
const candidatesCount = Array.isArray(candidatesData)
  ? candidatesData.length
  : candidatesData?.quoteCandidates?.length ?? "missing";
const reviewCandidateLines = fs.existsSync(reviewCandidatesTsv)
  ? fs.readFileSync(reviewCandidatesTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";
const attributedLines = fs.existsSync(attributedTsv)
  ? fs.readFileSync(attributedTsv, "utf8").trim().split(/\r?\n/).length
  : "missing";

fs.writeFileSync(
  reportTxt,
  [
    `${book} proofread extraction report`,
    `generatedDate: ${generatedDate}`,
    `sourceDir: ${sourceDir}`,
    `sourceFiles: ${files.length}`,
    `quoteCandidates: ${candidatesCount}`,
    `reviewCandidates: ${reviewCandidateLines}`,
    `attributedLines: ${attributedLines}`,
    `rawRows: ${rawRows.length}`,
    `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
    `proofreadAddedRows: ${proofreadAdditions.length}`,
    `selectedRows: ${rows.length}`,
    `missingQuotes: ${missing.length}`,
    `duplicateTexts: ${duplicates.length}`,
    `politicalHitRows: ${politicalHits.length}`,
    "policy: this book is overwhelmingly modern political commentary; exclude party/government/election/judicial/national-identity/airline-interest quotations and keep only independently reusable classical, literary, etiquette, linguistic, character, and research-method material.",
    "",
    "proofreadRemovedRows:",
    ...proofreadRemovedRows.map(
      (row) => `${row.original_id}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}\t${row.reason}`,
    ),
    "",
    "proofreadAddedRows:",
    ...proofreadAdditions.map((row) => `${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}`),
  ].join("\n") + "\n",
  "utf8",
);
fs.writeFileSync(proofreadReportTxt, fs.readFileSync(reportTxt, "utf8"), "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rawRows: rawRows.length,
      proofreadRemovedRows: proofreadRemovedRows.length,
      proofreadAddedRows: proofreadAdditions.length,
      rows: rows.length,
      missing: missing.length,
      duplicates: duplicates.length,
      politicalHitRows: politicalHits.length,
      outCsv,
      outTxt,
      selectedJson,
      reviewTsv,
      auditTsv,
      reportTxt,
      proofreadAuditTsv,
      proofreadReportTxt,
    },
    null,
    2,
  ),
);
