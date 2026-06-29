const fs = require("fs");
const path = require("path");

const book = "李敖刀笔集";
const idPrefix = "LADB";
const generatedDate = "2026-06-29";
const sourceDir = path.join("《大李敖全集6.0》分章节", "015.雷霆法律类", "002.李敖刀笔集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_daobi_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_daobi_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_daobi_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_daobi_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_daobi_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_daobi_proofread_report.txt");
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
    .replace(/[“”‘’《》〈〉「」『』（）()，。！？；：、\s]/g, "");
}

const scopeNote =
  "校对轮保守收录：《李敖刀笔集》为法律诉状、媒体争议、机关往返与政治人物/机构批评密集文本；现代党政口号、政策判断、诉状请求、判例定义、机关复函、人名攻防和意识形态语录不收；仅保留句子本身可独立检索的成语、俗语、古典成句、法律/新闻伦理格言及少量李敖式题句。";

function autoSummary(quoteText, category) {
  return `本书在相关章节使用或引录“${quoteText}”，保留其可独立检索的${category}性质。`;
}

function q(selector, lineStart, quoteText, category, sourceOrOrigin, summary, lineEnd = lineStart, extraNotes = "") {
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
    source_or_origin: sourceOrOrigin,
    summary: summary || autoSummary(quoteText, category),
    notes: [scopeNote, extraNotes].filter(Boolean).join(" "),
  };
}

function qp(selector, lineStart, quoteText, category, sourceOrOrigin, summary, lineEnd = lineStart, extraNotes = "") {
  return q(selector, lineStart, quoteText, category, sourceOrOrigin, summary, lineEnd, ["校对轮补入。", extraNotes].filter(Boolean).join(" "));
}

const rawRows = [
  q("《李敖刀笔集》小引", 3, "有识之士", "中文成语", "传统成语"),

  q("001.", 33, "滥竽充数", "中文成语", "传统成语"),
  q("001.", 33, "障眼法", "中文熟语", "中文熟语"),
  q("001.", 33, "连篇累牍", "中文成语", "传统成语"),
  q("001.", 57, "别创一格", "中文成语", "传统成语"),
  q("001.", 57, "登龙有术", "中文成语", "传统成语"),
  q("001.", 57, "恬不知耻", "中文成语", "传统成语"),
  q("001.", 65, "下笔如有神", "古典成句", "杜甫诗句化用"),
  q("001.", 65, "天花乱坠", "中文成语", "传统成语"),
  q("001.", 65, "头头是道", "中文成语", "传统成语"),
  q("001.", 65, "拍案称奇", "中文成语", "传统成语"),
  q("001.", 65, "恨入骨髓", "中文成语", "传统成语"),
  q("001.", 65, "牵着别人的鼻子走", "中文熟语", "中文熟语"),
  q("001.", 65, "今古奇观", "中文成语", "传统成语"),
  q("001.", 67, "千奇百怪", "中文成语", "传统成语"),
  q("001.", 67, "对簿公堂", "中文成语", "传统成语"),
  q("001.", 67, "众矢之的", "中文成语", "传统成语"),
  q("001.", 69, "旁征博引", "中文成语", "传统成语"),
  q("001.", 73, "何足道哉", "古文成句", "文言成句"),
  q("001.", 75, "皇天后土，是所共鉴。", "古文誓辞", "传统誓辞"),
  q("001.", 87, "是非曲直", "中文成语", "传统成语"),
  q("001.", 87, "节外生枝", "中文成语", "传统成语"),
  q("001.", 87, "野狐禅", "佛教熟语", "禅宗相关熟语"),
  q("001.", 87, "不足为训", "中文成语", "传统成语"),
  q("001.", 111, "好事不出门，恶言传千里。", "中文俗语", "传统俗语"),
  q("001.", 111, "无日无之", "中文熟语", "中文熟语"),
  q("001.", 111, "盈篇满版", "中文熟语", "中文熟语"),
  q("001.", 111, "不厌求详", "中文熟语", "中文熟语"),
  q("001.", 117, "我不欲人之加诸我也，吾亦欲无加诸人。", "古文名句", "《论语》相关子贡语"),
  q("001.", 129, "咬文嚼字", "中文成语", "传统成语"),
  q("001.", 129, "摧枯拉朽", "中文成语", "传统成语"),
  q("001.", 131, "铁面无私", "中文成语", "传统成语"),
  q("001.", 131, "挺起脊梁", "中文熟语", "中文熟语"),
  q("001.", 145, "生逢乱世", "中文熟语", "中文熟语"),
  q("001.", 145, "是非自有公论", "中文格言", "中文格言"),
  q("001.", 145, "逍遥法外", "中文成语", "传统成语"),
  q("001.", 145, "官官相护", "中文成语", "传统成语"),
  q("001.", 145, "三思而后行", "古典成句", "《论语》成句"),

  q("002.", 15, "狗嘴里掉不出象牙", "中文俗语", "传统俗语"),
  q("002.", 15, "小题大做", "中文成语", "传统成语"),
  q("002.", 45, "惺惺相惜", "中文成语", "传统成语"),
  q("002.", 45, "不为已甚", "中文成语", "传统成语"),
  q("002.", 45, "好汉做事好汉当", "中文俗语", "传统俗语"),

  q("003.", 31, "一字不提", "中文熟语", "中文熟语"),
  q("003.", 31, "故出人罪", "中文法律成语", "传统法律成语"),
  q("003.", 31, "任意取舍", "中文熟语", "中文熟语"),
  q("003.", 31, "割裂文字", "中文熟语", "中文熟语"),
  q("003.", 69, "一塌糊涂", "中文成语", "传统成语"),
  q("003.", 69, "含糊其辞", "中文成语", "传统成语"),
  q("003.", 93, "莫名其妙", "中文成语", "传统成语"),
  q("003.", 93, "不知所云", "中文成语", "传统成语"),
  q("003.", 97, "大白于天下", "中文成语", "传统成语"),

  q("004.", 23, "引经据典", "中文成语", "传统成语"),
  q("004.", 25, "人贵自知", "中文格言", "传统格言"),
  q("004.", 25, "偷天换日", "中文成语", "传统成语"),
  q("004.", 25, "欲盖弥彰", "中文成语", "传统成语"),
  q("004.", 25, "黄口小儿", "中文成语", "传统成语", undefined, 25, "校对轮将原收“三岁黄口小儿”规范为更通行、可检索的成语本体。"),
  q("004.", 25, "乳臭未干", "中文成语", "传统成语"),
  q("004.", 25, "先天不足", "中文成语", "传统成语"),
  q("004.", 25, "及锋而试", "中文成语", "传统成语"),
  q("004.", 25, "抽丝剥茧", "中文成语", "传统成语"),
  q("004.", 57, "断章取义", "中文成语", "传统成语"),
  q("004.", 103, "轻描淡写", "中文成语", "传统成语"),
  qp("004.", 129, "挡箭牌", "中文熟语", "中文熟语"),
  q("004.", 129, "出尔反尔", "中文成语", "传统成语"),
  q("004.", 189, "变本加厉", "中文成语", "传统成语"),
  qp("004.", 189, "心血来潮", "中文成语", "传统成语"),

  q("006.", 51, "牵强附会", "中文成语", "传统成语"),
  q("006.", 51, "无法无天", "中文成语", "传统成语"),

  q("008.", 21, "追根究底", "中文成语", "传统成语"),
  q("008.", 21, "息事宁人", "中文成语", "传统成语"),
  q("008.", 21, "忍气吞声", "中文成语", "传统成语"),
  q("008.", 21, "以身‘试’法", "李敖式仿成语", "成语“以身试法”的谐写"),
  q("008.", 29, "得饶人处且饶人", "中文俗语", "传统俗语"),
  q("008.", 29, "乡愿", "儒家熟语", "《论语》相关语汇"),
  q("008.", 29, "是非颠倒", "中文成语", "传统成语"),
  q("008.", 45, "大庭广众", "中文成语", "传统成语"),
  q("008.", 53, "怙恶不悛", "中文成语", "传统成语"),

  q("009.", 31, "口口声声", "中文成语", "传统成语"),
  q("009.", 35, "大义灭亲", "中文成语", "传统成语"),
  q("009.", 35, "法律是六十分的道德", "西方法律格言", "西谚"),

  q("010.", 1, "租给张三，却告李四", "李敖式题句", "章节标题"),
  q("010.", 5, "含冤莫白", "中文成语", "传统成语"),
  q("010.", 5, "锲而不舍", "中文成语", "传统成语"),
  q("010.", 5, "水落石出", "中文成语", "传统成语"),
  q("010.", 5, "洋洋大观", "中文成语", "传统成语"),
  q("010.", 5, "强词夺理", "中文成语", "传统成语"),
  q("010.", 81, "只字不提", "中文成语", "传统成语"),

  q("012.", 63, "瞒天过海", "中文成语", "传统成语"),
  q("012.", 79, "大费周章", "中文成语", "传统成语"),
  q("012.", 99, "用之则行、舍之则藏", "古典成句", "《论语》化用"),
  q("012.", 123, "张冠李戴", "中文成语", "传统成语"),
  q("012.", 141, "白纸黑字", "中文成语", "传统成语"),

  q("013.", 11, "不得要领", "中文成语", "传统成语"),
  q("013.", 11, "网开一面", "中文成语", "传统成语"),
  q("013.", 11, "莫测高深", "中文成语", "传统成语"),
  q("013.", 15, "种豆得豆", "中文俗语", "传统俗语"),
  q("013.", 19, "恩怨分明", "中文成语", "传统成语"),
  q("013.", 39, "知过能改", "中文熟语", "中文熟语"),

  q("014.", 23, "兵临城下", "中文成语", "传统成语"),
  q("014.", 23, "浑然忘我", "中文熟语", "中文熟语"),
  q("014.", 23, "忘了我是谁", "中文熟语", "中文熟语"),
  q("014.", 33, "苟假以时日", "文言熟语", "文言熟语"),
  q("014.", 55, "哭笑不得", "中文成语", "传统成语"),

  q("015.", 3, "迟来的正义不是正义", "西方法律格言", "西方谚语；原文明注 Justice delay is Justice denial"),
  q("015.", 5, "众口铄金", "中文成语", "传统成语"),

  q("016.", 1, "无所遁形，也责无旁贷", "中文格言式题句", "章节标题"),
  q("017.", 17, "恍然大悟", "中文成语", "传统成语"),

  q("018.", 5, "以讹传讹", "中文成语", "传统成语"),
  q("018.", 5, "新闻记述，正确第一", "新闻伦理格言", "《中国新闻记者信条》"),
  q("018.", 5, "凡一字不真，一语失实，不问为有意之造谣夸大，或无意之失检致误，均无可恕", "新闻伦理格言", "《中国新闻记者信条》"),
  q("018.", 13, "不是猛龙不过江", "中文俗语", "传统俗语"),
  q("018.", 13, "有头有脸", "中文熟语", "中文熟语"),
  q("018.", 13, "公事公办", "中文成语", "传统成语"),
  q("018.", 55, "孤傲高蹈", "中文熟语", "中文熟语"),
  q("018.", 55, "戏公卿、弄王侯", "中文文学熟语", "传统文人语汇"),
  q("018.", 55, "说大人，则藐之", "孟子名句", "《孟子》语"),
  q("018.", 55, "趋炎附势", "中文成语", "传统成语"),
  q("018.", 57, "故态复萌", "中文成语", "传统成语"),

  qp("019.", 13, "字面本身无诽谤性的，依各种不同环境而决定其是否具有诽谤性。", "西方法律格言", "William F. Swindler", "李敖引史文勒教授关于诽谤判断应视语境而定的法理句。", 13, "只收法理格言本体，不收同段政治人物例证。"),

  q("025.", 7, "当事人不得兼证人。", "法律格言", "文明国家法谚；原文并列德文 Niemand darf partei，und zeuge zugleich sein."),
  q("025.", 7, "案重初供，证重初证", "法律熟语", "证据法则熟语"),
];

const modernPoliticalTerms = [
  "一国两制",
  "两岸",
  "台独",
  "台湾独立",
  "国民党",
  "民进党",
  "共产党",
  "中华民国",
  "中华人民共和国",
  "总统",
  "选举",
  "候选人",
  "政党",
  "政府",
  "行政院",
  "外交部",
  "国防部",
  "新闻局",
  "财政部",
  "台湾",
  "中国",
  "国家",
  "民主",
  "人权",
  "主权",
  "统一",
  "独立",
  "革命",
  "政治",
  "党",
  "军",
  "蒋",
  "林洋港",
  "吴伯雄",
  "李焕",
  "康宁祥",
  "自由时报",
];

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

function rowToCsv(row) {
  return columns.map((column) => csvEscape(row[column])).join(",");
}

function quotePresent(row) {
  const source = sourceCache.get(row.source_file);
  if (!source) return false;
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
  const lineDiff = a.line_start - b.line_start;
  if (lineDiff) return lineDiff;
  return a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN");
}

const selectedRows = rawRows
  .slice()
  .sort(rowCompare)
  .map((row, index) => ({
    ...row,
    id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
  }));

const auditRows = selectedRows.map((row) => {
  const present = quotePresent(row);
  const politicalHits = hasPoliticalHit(row);
  return { row, present, politicalHits };
});

const missing = auditRows.filter((item) => !item.present);
const politicalHits = auditRows.filter((item) => item.politicalHits.length > 0);
const duplicateTexts = new Map();
for (const row of selectedRows) {
  const key = normalizeText(row.quote_text);
  duplicateTexts.set(key, (duplicateTexts.get(key) || 0) + 1);
}
const duplicates = selectedRows.filter((row) => duplicateTexts.get(normalizeText(row.quote_text)) > 1);

if (missing.length) {
  throw new Error(`Missing quote text in source: ${missing.map((item) => `${item.row.id}:${item.row.quote_text}`).join(", ")}`);
}
if (duplicates.length) {
  throw new Error(`Duplicate quote text in ${book}: ${duplicates.map((row) => `${row.id}:${row.quote_text}`).join(", ")}`);
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

const header = columns.join(",");
fs.writeFileSync(outCsv, `\uFEFF${header}\r\n${selectedRows.map(rowToCsv).join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push(`《${book}》诗文格言歌谣引用`);
txt.push(`生成日期：${generatedDate}`);
txt.push(`条目数：${selectedRows.length}`);
txt.push("");
for (const row of selectedRows) {
  txt.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  txt.push(`引用：${row.quote_text}`);
  txt.push(`出处线索：${row.source_or_origin}`);
  txt.push(`摘要：${row.summary}`);
  txt.push(`备注：${row.notes}`);
  txt.push("");
}
fs.writeFileSync(outTxt, `\uFEFF${txt.join("\r\n")}\r\n`, "utf8");

fs.writeFileSync(selectedJson, `${JSON.stringify(selectedRows, null, 2)}\n`, "utf8");

const reviewHeader = [
  "id",
  "decision",
  "category",
  "quote_text",
  "source_or_origin",
  "source_file",
  "line_start",
  "line_end",
  "summary",
  "notes",
];
const reviewLines = [
  reviewHeader.join("\t"),
  ...selectedRows.map((row) =>
    reviewHeader
      .map((column) => {
        if (column === "decision") return row.notes.includes("校对轮补入") ? "add-proofread" : "keep-proofread";
        return String(row[column] ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
      })
      .join("\t"),
  ),
];
fs.writeFileSync(reviewTsv, `${reviewLines.join("\r\n")}\r\n`, "utf8");

const auditHeader = ["id", "present", "political_hits", "duplicate_count", "quote_text", "source_file", "line_start", "line_end"];
const auditLines = [
  auditHeader.join("\t"),
  ...auditRows.map((item) =>
    [
      item.row.id,
      item.present ? "yes" : "no",
      item.politicalHits.join("|"),
      duplicateTexts.get(normalizeText(item.row.quote_text)),
      item.row.quote_text,
      item.row.source_file,
      item.row.line_start,
      item.row.line_end,
    ]
      .map((value) => String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " "))
      .join("\t"),
  ),
];
fs.writeFileSync(auditTsv, `${auditLines.join("\r\n")}\r\n`, "utf8");

const proofreadRemovedRows = [
  {
    quote_text: "斯文在兹，斯法在焉",
    reason: "小引中的临场对句和法律文字游戏，非李敖引录的诗文格言，校对轮从严删除。",
  },
  {
    quote_text: "能见人之所未见，言人之所不敢言",
    reason: "第三方报刊评语，离开人物评价语境后格言性不足。",
  },
  {
    quote_text: "不论亲疏",
    reason: "句中普通连接性短语，独立检索价值弱。",
  },
  {
    quote_text: "貌似谨严",
    reason: "现场描述语，不是稳定成语或格言。",
  },
  {
    quote_text: "三岁黄口小儿",
    reason: "校对轮规范为更通行、可检索的“黄口小儿”。",
  },
  {
    quote_text: "后天失调",
    reason: "与“先天不足”并列的临场骂语，单独成条价值不足。",
  },
  {
    quote_text: "自来荣辱标准，因人而异",
    reason: "现代法律论辩中的现场判断句，格言性不足。",
  },
  {
    quote_text: "目为奇耻",
    reason: "同段含近现代政治人物例证，且短语本体独立价值弱。",
  },
];

const omittedBoundaryExamples = [
  {
    source_file: "005.控徐复观的一些补充理由.txt",
    reason: "主要为诽谤案材料、人名攻防与证据说明；只取已在前文稳定出现的俗语，不重复收案情话语。",
  },
  {
    source_file: "018.《自由时报》被裁定诚意不足.txt",
    reason: "媒体争议与新闻评议材料中只保留新闻伦理短句和独立成语；报社、人物、处分、法条内容不收。",
  },
  {
    source_file: "023.“一国两制”说从头.txt",
    reason: "全章为政治制度与言论管制论辩，虽含普通成语，首轮按政治高密度章节从严排除。",
  },
  {
    source_file: "025.林洋港说话算数吗？.txt",
    reason: "只保留与具体党政攻防可分离的法谚和证据法则熟语；政治干涉司法叙述不收。",
  },
];

const report = {
  book,
  generatedDate,
  sourceDir,
  sourceFiles: files.length,
  candidatesJson,
  reviewCandidatesTsv,
  selectedRows: selectedRows.length,
  proofreadAddedRows: selectedRows
    .filter((row) => row.notes.includes("校对轮补入"))
    .map((row) => ({
      id: row.id,
      quote_text: row.quote_text,
      source_file: row.source_file,
      line_start: row.line_start,
      category: row.category,
    })),
  proofreadRemovedRows,
  missingQuotes: missing.map((item) => item.row.id),
  politicalHits: politicalHits.map((item) => ({
    id: item.row.id,
    quote_text: item.row.quote_text,
    hits: item.politicalHits,
  })),
  duplicateQuotes: duplicates.map((row) => row.id),
  omittedBoundaryExamples,
  csvPath: outCsv,
  txtPath: outTxt,
  selectedJson,
  reviewTsv,
  auditTsv,
};

fs.writeFileSync(reportTxt, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      sourceFiles: files.length,
      selectedRows: selectedRows.length,
      outCsv,
      outTxt,
      selectedJson,
      reviewTsv,
      auditTsv,
      reportTxt,
    },
    null,
    2,
  ),
);
