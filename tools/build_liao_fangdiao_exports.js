const fs = require("fs");
const path = require("path");

const book = "李敖放刁集";
const idPrefix = "LAFD";
const generatedDate = "2026-06-29";
const sourceDir = path.join("《大李敖全集6.0》分章节", "015.雷霆法律类", "004.李敖放刁集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_fangdiao_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_fangdiao_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_fangdiao_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_fangdiao_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_fangdiao_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_fangdiao_proofread_report.txt");
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
  "校对轮保守收录：《李敖放刁集》为诉状、答辩状、查禁书刊、诽谤与财务争议密集文本；现代党政口号、司法诉求、机关法条、判例定义、人物攻防和意识形态语录不收；仅保留句子本身可独立检索的成语、俗语、古典成句、法律格言、文学引文和少量李敖式仿成语。";

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
  q("《李敖放刁集》小引", 3, "独是这里的人很刁", "文学引文", "《红楼梦》"),
  q("《李敖放刁集》小引", 3, "在劫难逃", "中文成语", "传统成语"),

  q("001.", 19, "瞒天过海", "中文成语", "传统成语"),
  q("001.", 27, "不值一驳", "中文熟语", "中文熟语"),
  q("001.", 27, "藏诸名山", "古典成句", "传统藏书典故"),
  q("001.", 27, "孤陋寡闻", "中文成语", "传统成语"),
  q("001.", 27, "奇货可居", "中文成语", "传统成语"),

  q("002.", 5, "希旨承风", "中文成语", "传统成语"),
  qp("002.", 5, "忍无可忍", "中文成语", "传统成语"),
  qp("002.", 9, "功德圆满", "中文成语", "佛教语汇转为通用成语"),
  qp("002.", 15, "滑天下之大稽", "中文熟语", "传统熟语"),
  q("003.", 135, "案重初供、证重初证", "中文法律熟语", "传统证据法熟语"),
  q("003.", 43, "一望而知", "中文成语", "传统成语"),
  q("003.", 51, "官官相护", "中文成语", "传统成语"),
  q("003.", 63, "口口声声", "中文成语", "传统成语"),
  q("003.", 119, "彼有淫具！", "历史典故短句", "三国刘备、诸葛亮相关故事"),
  q("003.", 135, "当事人不得兼证人。", "法律格言", "文明国家法谚；德文原文并列"),
  q("003.", 135, "节外生枝", "中文成语", "传统成语"),
  q("003.", 143, "绝无仅有", "中文成语", "传统成语"),
  q("003.", 155, "锲而不舍", "中文成语", "传统成语"),
  qp("003.", 179, "无法无天", "中文成语", "传统成语"),
  qp("003.", 181, "美中不足", "中文成语", "传统成语"),
  qp("003.", 181, "青史留名", "中文成语", "传统成语"),
  qp("003.", 181, "千古传佳话", "中文熟语", "传统熟语"),

  q("004.", 15, "不折不扣", "中文成语", "传统成语"),
  q("004.", 15, "白纸黑字", "中文成语", "传统成语"),
  q("004.", 59, "投诉无门", "中文熟语", "中文熟语"),
  q("004.", 59, "逃逸无踪", "中文熟语", "中文熟语"),
  q("004.", 59, "奇门遁甲", "中文成语", "传统成语"),
  q("004.", 63, "真金不怕火炼", "中文俗语", "中文俗语"),
  q("004.", 155, "哑口无言", "中文成语", "传统成语"),
  q("004.", 155, "无所遁形", "中文成语", "传统成语"),
  q("004.", 171, "侠骨柔情", "中文成语", "传统成语"),
  q("004.", 171, "无地自容", "中文成语", "传统成语"),
  q("004.", 171, "真相大白", "中文成语", "传统成语"),
  q("004.", 171, "真理重光", "中文熟语", "中文熟语"),

  q("005.", 11, "今古奇观", "中文成语", "传统成语"),
  q("007.", 17, "行尸走肉", "中文成语", "传统成语"),
  q("007.", 17, "己所不欲，却施于人", "古典仿成句", "《论语》成句化用"),
  q("007.", 39, "一视同仁", "中文成语", "传统成语"),
  q("008.", 11, "当代奇闻", "中文熟语", "中文熟语"),
  q("008.", 11, "记忆犹新", "中文成语", "传统成语"),

  q("009.", 11, "约定俗成", "中文成语", "传统成语"),
  q("009.", 57, "张冠李戴", "中文成语", "传统成语"),
  q("009.", 57, "士林齿冷", "中文熟语", "中文熟语"),
  q("009.", 87, "在齐太史简，在晋董狐笔", "古典诗句", "文天祥《正气歌》"),
  q("010.", 31, "避重就轻", "中文成语", "传统成语"),
  q("010.", 29, "钻牛角尖", "中文熟语", "中文熟语"),
  q("010.", 33, "露马脚", "中文熟语", "中文熟语"),
  q("010.", 33, "忙里偷闲", "中文成语", "传统成语"),

  q("011.", 5, "颠倒是非", "中文成语", "传统成语"),
  q("011.", 39, "倒打一耙", "中文熟语", "中文熟语"),
  qp("011.", 39, "上下其手", "中文成语", "传统成语"),
  q("011.", 47, "气吾老以及人之老", "李敖式仿成句", "《孟子》成句化用"),
  q("011.", 49, "大事化无", "中文熟语", "中文熟语"),
  q("011.", 49, "有始无终", "中文成语", "传统成语"),
  q("011.", 67, "呼之欲出", "中文成语", "传统成语"),
  q("011.", 95, "得不偿失", "中文成语", "传统成语"),
  q("011.", 95, "人必自侮，而后人侮之。", "古典成句", "刘基语；亦见传统格言系统"),
  q("011.", 95, "一笔抹杀", "中文成语", "传统成语"),
  q("011.", 95, "遮遮掩掩", "中文熟语", "中文熟语"),
  qp("011.", 97, "一笑置之", "中文成语", "传统成语"),
  q("011.", 97, "欺人太甚", "中文成语", "传统成语"),

  q("012.", 13, "变本加厉", "中文成语", "传统成语"),
  q("012.", 13, "对你们是运动、对我们是玩命", "寓言式格言", "《伊索寓言》相关转述"),
  q("012.", 13, "对你是赎罪工具、对我们是虐待死亡", "寓言式格言", "《聊斋》相关转述"),
  q("012.", 13, "厚颜无耻", "中文成语", "传统成语"),
  q("012.", 13, "麻木不仁", "中文成语", "传统成语"),
  q("012.", 17, "法典被人一解释，法典就完蛋了", "西方法律格言", "拿破仑语"),
  q("012.", 17, "有头有脸", "中文熟语", "中文熟语"),
  q("012.", 17, "正人君子", "中文成语", "传统成语"),
  q("012.", 17, "处心积虑", "中文成语", "传统成语"),
  q("012.", 23, "层出不穷", "中文成语", "传统成语"),
  q("012.", 23, "大权独揽", "中文成语", "传统成语"),
  q("012.", 23, "事必躬亲", "中文成语", "传统成语"),

  q("013.", 47, "无可奈何", "中文成语", "传统成语"),
  q("013.", 47, "异口同声", "中文成语", "传统成语"),
  q("013.", 61, "含沙射影", "中文成语", "传统成语"),
  q("013.", 65, "巨细不遗", "中文成语", "传统成语"),
  q("013.", 65, "无微不至", "中文成语", "传统成语"),
  q("013.", 65, "一片狼藉", "中文成语", "传统成语"),
  q("013.", 83, "皆大欢喜", "中文成语", "传统成语"),
  q("014.", 5, "首当其冲", "中文成语", "传统成语"),
  q("014.", 53, "不得要领", "中文成语", "传统成语"),
  q("015.", 31, "只字不提", "中文成语", "传统成语"),
  q("015.", 37, "事与愿违", "中文成语", "传统成语"),
  q("015.", 37, "心劳计拙", "中文成语", "传统成语"),
  q("017.", 7, "视而不见", "中文成语", "传统成语"),

  q("018.", 7, "飞象过河", "中文熟语", "棋类隐喻熟语"),
  q("018.", 15, "答非所问", "中文成语", "传统成语"),
  q("018.", 65, "偷天换日", "中文成语", "传统成语"),
  q("018.", 73, "未卜先知", "中文成语", "传统成语"),
  q("018.", 143, "舍本逐末", "中文成语", "传统成语"),
  q("018.", 143, "因小失大", "中文成语", "传统成语"),
  q("019.", 85, "公报私仇", "中文成语", "传统成语"),
  q("019.", 85, "莫须有", "中文典故", "岳飞案相关典故"),
  q("019.", 85, "天马行空", "中文成语", "传统成语"),
  q("019.", 85, "天下宁有是理？", "中文格言式反问", "传统文言反问句式"),
  q("019.", 85, "岂有此理？", "中文熟语", "中文熟语"),

  q("021.", 1, "移花接木", "中文成语", "传统成语"),
  q("021.", 7, "天方夜谭", "中文成语", "外来故事成语"),
  q("021.", 25, "毫不相干", "中文成语", "传统成语"),
  q("021.", 25, "若合符节", "中文成语", "传统成语"),
  q("022.", 3, "胡搅蛮缠", "中文成语", "传统成语"),
  q("022.", 133, "罗生门", "外来文学典故", "芥川龙之介小说/黑泽明电影相关典故"),
  q("022.", 149, "反扯七扯八", "中文熟语", "中文熟语"),
  q("022.", 149, "一面之词", "中文熟语", "中文熟语"),
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
  "参选",
  "政党",
  "政府",
  "行政院",
  "外交部",
  "国防部",
  "新闻局",
  "财政部",
  "台湾",
  "中国",
  "民主",
  "人权",
  "主权",
  "统一",
  "独立",
  "政治",
  "革命",
  "林洋港",
  "张温鹰",
  "王作荣",
  "马英九",
  "李光耀",
  "蒋经国",
  "蒋介石",
  "孙中山",
  "秦孝仪",
  "吴大猷",
  "王世杰",
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

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function rowToCsv(row) {
  return columns.map((column) => csvEscape(row[column])).join(",");
}

function quotePresent(row) {
  const source = sourceCache.get(row.source_file);
  const selected = source.lines.slice(row.line_start - 1, row.line_end).join("\n");
  return selected.includes(row.quote_text) || normalizeText(selected).includes(normalizeText(row.quote_text));
}

function politicalHits(row) {
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

const auditRows = selectedRows.map((row) => ({
  row,
  present: quotePresent(row),
  politicalHits: politicalHits(row),
}));

const missing = auditRows.filter((item) => !item.present);
const political = auditRows.filter((item) => item.politicalHits.length > 0);
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
if (political.length) {
  throw new Error(
    `Political terms in selected quote text: ${political
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

const omittedBoundaryExamples = [
  {
    source_file: "009.为《孙中山研究》致检察官.txt",
    reason: "涉及现代政治人物与查禁争议，首轮只取稳定成语和《正气歌》化句；诉愿攻防、政治判断不收。",
  },
  {
    source_file: "010.大家逗乐一番，以悼“中华民国”也！.txt",
    reason: "全章政治符号与机构攻防密集，仅保留少量脱离语境仍可检索的成语熟语。",
  },
  {
    source_file: "011.为王世杰诬谤李敖事控告吴大猷、张玉法、王纪五、王秋华.txt",
    reason: "现代人物攻防、人名史事与党政评断密集；保留少量传统成语和古典格言，不收人物判断句。",
  },
  {
    source_file: "018.法官任鸣钜、郑景文、郭美杏怎样枉法开脱国民党大员秦孝仪？.txt",
    reason: "政治人物与司法个案高度纠缠，首轮只收能独立使用的语文/棋类/成语表达。",
  },
];

const proofreadRemovedRows = [
  {
    quote_text: "千古独刁",
    reason: "小引中的临场题句与书名文字游戏，非李敖引录的诗文格言，校对轮从严删除。",
  },
  {
    quote_text: "以私人资格假行政处分为侵权手段者，受害人得请求回复原状，赔偿损害",
    reason: "大理院判例摘录，偏法律文书定义，不作为诗文格言收录。",
  },
  {
    quote_text: "凡以私人资格假行政官厅之处分为侵权行为之手段者，被害人得对于加害人向司法衙门提起民事诉讼",
    reason: "大理院解释摘录，偏法律文书定义，不作为诗文格言收录。",
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
  politicalHits: political.map((item) => ({
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
