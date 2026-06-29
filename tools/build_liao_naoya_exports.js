const fs = require("fs");
const path = require("path");

const book = "李敖闹衙集";
const idPrefix = "LANY";
const generatedDate = "2026-06-29";
const sourceDir = path.join("《大李敖全集6.0》分章节", "015.雷霆法律类", "001.李敖闹衙集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_naoya_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_naoya_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_naoya_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_naoya_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_naoya_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_naoya_proofread_report.txt");
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
  "首轮保守收录：《李敖闹衙集》为法律控诉、政府机关往返文书与政治人物/机关批评密集文本；现代政治口号、政党/政府主张、法律条文、诉状请求、机关复函、政策判断与人身攻防不收；仅保留句子本身可独立检索的成语、俗语、古语、格言式短语及少量文学性表达。";

function autoSummary(quoteText, category) {
  return `李敖在本章使用或引录“${quoteText}”，保存可独立检索的${category}。`;
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
  q("《李敖闹衙集》小引", 3, "作威作福", "中文成语", "传统成语"),
  q("《李敖闹衙集》小引", 3, "逆来顺受", "中文成语", "传统成语"),
  q("《李敖闹衙集》小引", 3, "据理力争", "中文成语", "传统成语"),
  q("《李敖闹衙集》小引", 3, "斤斤计较", "中文成语", "传统成语"),
  q("《李敖闹衙集》小引", 3, "纠缠不休", "中文成语", "传统成语"),
  q("《李敖闹衙集》小引", 3, "不亦快哉", "中文成语", "传统成语"),

  q("001.", 21, "不分青红皂白", "中文成语", "传统成语"),
  q("001.", 21, "无法无天", "中文成语", "传统成语"),

  q("002.", 9, "眼花缭乱", "中文成语", "传统成语"),
  q("002.", 15, "自知理亏", "中文熟语", "中文熟语"),
  q("002.", 15, "来者不善", "中文成语", "传统成语"),
  q("002.", 15, "大获全胜", "中文成语", "传统成语"),

  q("003.", 9, "面上无光", "中文熟语", "中文熟语"),
  q("003.", 9, "生龙活虎", "中文成语", "传统成语"),
  q("003.", 9, "对簿公堂", "中文成语", "传统成语"),
  q("003.", 9, "语无伦次", "中文成语", "传统成语"),
  q("003.", 9, "通情达理", "中文成语", "传统成语"),
  q("003.", 11, "投鼠忌器", "中文成语", "传统成语"),
  q("003.", 11, "大伤脑筋", "中文熟语", "中文熟语"),
  q("003.", 11, "硬着头皮", "中文熟语", "中文熟语"),

  q("005.", 11, "做戏无法，出个菩萨", "中文俗语", "中文俗语"),
  q("005.", 11, "走投无路", "中文成语", "传统成语"),
  q("005.", 13, "鸡毛当令箭", "中文俗语", "中文俗语"),
  q("005.", 13, "来势汹汹", "中文成语", "传统成语"),
  q("005.", 47, "无中生有", "中文成语", "传统成语"),
  q("005.", 47, "越俎代庖", "中文成语", "传统成语"),
  q("005.", 49, "穷斯滥矣", "中文熟语", "中文熟语"),
  q("005.", 49, "荒腔走板", "中文成语", "传统成语"),
  q("005.", 51, "举证历历", "中文熟语", "中文熟语"),
  q("005.", 51, "不学无知", "中文成语", "传统成语"),
  q("005.", 55, "呼之欲出", "中文成语", "传统成语"),

  q("007.", 3, "灰头土脸", "中文成语", "传统成语"),
  q("007.", 5, "鼻青眼肿", "中文成语", "传统成语"),
  q("007.", 5, "招朋引类", "中文成语", "传统成语"),
  q("007.", 5, "集思广益", "中文成语", "传统成语"),
  q("007.", 5, "非比寻常", "中文成语", "传统成语"),
  q("007.", 9, "无谓之争", "中文熟语", "中文熟语"),
  q("007.", 11, "望其项背", "中文成语", "传统成语"),
  q("007.", 11, "服善之勇", "中文熟语", "中文熟语"),
  q("007.", 11, "老鼠过街", "中文俗语", "中文俗语"),
  q("007.", 11, "鼠目寸光", "中文成语", "传统成语"),
  q("007.", 11, "知过能改", "中文熟语", "中文熟语"),
  q("007.", 11, "皆大欢喜", "中文成语", "传统成语"),

  q("009.", 153, "进退维谷", "中文成语", "传统成语"),
  q("009.", 153, "忍气吞声", "中文成语", "传统成语"),
  q("009.", 161, "不分皂白", "中文成语", "传统成语"),
  q("009.", 161, "不得要领", "中文成语", "传统成语"),
  q("009.", 165, "鱼烂河决", "中文成语", "传统成语"),
  q("009.", 165, "不堪设想", "中文成语", "传统成语"),
  q("009.", 165, "退而求其次", "中文熟语", "中文熟语"),
  q("009.", 185, "毫无裨益", "中文熟语", "中文熟语"),
  q("009.", 185, "哭笑不得", "中文成语", "传统成语"),
  qp("009.", 97, "房倒价烂", "中文俗语", "中文俗语", "李敖转引民法物权说明中的俗语“房倒价烂”，保存其俗语本体。"),
  q("009.", 217, "趁人于危", "中文熟语", "中文熟语"),
  q("009.", 219, "变本加厉", "中文成语", "传统成语"),
  q("009.", 219, "情何以堪", "中文熟语", "中文熟语"),
  q("009.", 279, "拥挤不堪", "中文熟语", "中文熟语"),
  q("009.", 279, "层出不穷", "中文成语", "传统成语"),
  q("009.", 295, "卷土重来", "中文成语", "传统成语"),
  q("009.", 295, "满目疮痍", "中文成语", "传统成语"),
  q("009.", 295, "痛心疾首", "中文成语", "传统成语"),

  q("010.", 13, "父债子还", "中文熟语", "中文熟语"),
  q("010.", 13, "偷天换日", "中文成语", "传统成语"),
  q("010.", 13, "欺人太甚", "中文成语", "传统成语"),
  q("010.", 21, "难乎为继", "中文成语", "传统成语"),
  q("010.", 23, "杀鸡取卵", "中文成语", "传统成语"),
  q("010.", 25, "损人而不利己", "中文俗语", "中文俗语"),
  q("010.", 31, "避重就轻", "中文成语", "传统成语"),
  q("010.", 33, "忍无可忍", "中文成语", "传统成语"),
  q("010.", 33, "自知理屈", "中文熟语", "中文熟语"),
  q("010.", 33, "知过不改", "中文熟语", "中文熟语"),
  q("010.", 33, "错中之错", "中文熟语", "中文熟语"),
  q("010.", 33, "怙恶不悛", "中文成语", "传统成语"),

  q("011.", 25, "食言而肥", "中文成语", "传统成语"),
  q("011.", 27, "择善固执", "中文成语", "传统成语"),
  q("011.", 27, "守正不阿", "中文成语", "传统成语"),
  q("011.", 27, "见钱眼开", "中文成语", "传统成语"),
  q("011.", 51, "昨非今是", "中文成语", "传统成语"),
  q("011.", 51, "一念之转", "中文熟语", "中文熟语"),
  q("011.", 51, "弃非从是", "中文成语", "传统成语"),
  q("011.", 51, "别开生面", "中文成语", "传统成语"),
  q("011.", 57, "强人所难", "中文成语", "传统成语"),
  q("011.", 63, "黄鱼两吃", "中文俗语", "台湾俗语"),
  q("011.", 75, "死者已矣", "中文熟语", "中文熟语"),
  q("011.", 87, "画龙点眼", "中文成语", "传统成语"),
  q("011.", 87, "口口声声", "中文成语", "传统成语"),

  q("012.", 35, "恍然大悟", "中文成语", "传统成语"),
  q("012.", 35, "官官相护", "中文成语", "传统成语"),
  q("012.", 35, "敷衍塞责", "中文成语", "传统成语"),
  q("012.", 53, "瞒天过海", "中文成语", "传统成语"),
  q("012.", 131, "一面之词", "中文成语", "传统成语"),
  q("012.", 131, "真伪难辨", "中文熟语", "中文熟语"),
  q("012.", 161, "错认颜标是鲁公", "中文典故", "颜标、颜真卿典故"),
  q("012.", 161, "知错不改", "中文熟语", "中文熟语"),
  q("012.", 165, "无法置辩", "中文熟语", "中文熟语"),
  q("012.", 165, "大白于天下", "中文成语", "传统成语"),

  q("014.", 41, "委曲求全", "中文成语", "传统成语"),
  q("014.", 41, "民不与官斗", "中文古训", "中文俗语古训"),
  q("014.", 41, "斑斑可据", "中文熟语", "中文熟语"),
  q("014.", 51, "人非圣贤，孰能无过？", "中文格言", "传统格言"),
  q("014.", 57, "是非曲直", "中文成语", "传统成语"),
  q("014.", 57, "落井下石", "中文成语", "传统成语"),
  q("014.", 57, "习以为常", "中文成语", "传统成语"),

  q("015.", 41, "未卜先知", "中文成语", "传统成语"),

  q("016.", 81, "理直气壮", "中文成语", "传统成语"),
  q("016.", 81, "破绽百出", "中文成语", "传统成语"),
  q("016.", 143, "四两拨千斤", "中文俗语", "中文俗语"),
  q("016.", 153, "说话算话", "中文熟语", "中文熟语"),
  qp("016.", 157, "官样文章", "中文成语", "传统成语"),
  q("016.", 159, "一动不如一静", "中文俗语", "中文俗语"),
  q("016.", 159, "佛法无边", "佛教成语", "佛教语汇"),
  q("016.", 159, "老神在在", "中文熟语", "台湾熟语"),
  q("016.", 171, "任劳任怨", "中文成语", "传统成语"),
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
  "新闻局",
  "国防部",
  "财政部",
  "警备总部",
  "警政署",
  "法院",
  "法官",
  "宪法",
  "民法",
  "刑法",
  "国家赔偿法",
  "法令",
  "法律程序",
  "公务员",
  "公仆",
  "为民服务",
  "人权",
  "司法",
  "自由",
  "统一",
  "独立",
  "主权",
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
  const string = String(value ?? "");
  if (/[",\r\n]/.test(string)) return `"${string.replace(/"/g, '""')}"`;
  return string;
}

function rowToCsv(row) {
  return columns.map((column) => csvEscape(row[column])).join(",");
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
    quote_text: "有所本",
    reason: "只是上下文中的普通说明语，检索价值和格言性不足。",
  },
  {
    quote_text: "诚信公道",
    reason: "出自法律契约原则语境，更像法理用语，不作为诗文格言保留。",
  },
  {
    quote_text: "腾笑中外",
    reason: "过于依赖诉状语境且疑似用字变体，首轮校对从严删除。",
  },
  {
    quote_text: "吴代叶僵",
    reason: "以现代人物姓氏构成的现场文字游戏，政治人物语境过重。",
  },
  {
    quote_text: "官样文书",
    reason: "非通行成语，校对轮改收同段更标准的“官样文章”。",
  },
  {
    quote_text: "相应不理",
    reason: "现场讽刺性仿语，离开行政院答复语境后独立检索价值不足。",
  },
];

const omittedBoundaryExamples = [
  {
    source_file: "《李敖闹衙集》小引.txt:3",
    reason: "小引中大量现代政府、机关、官衙攻防背景不收；只保留其中可独立检索的成语熟语。",
  },
  {
    source_file: "004.控告台北市政府四文件.txt",
    reason: "主要为法律文件、请求事项、法条与事实叙述，首轮不作诗文格言收录。",
  },
  {
    source_file: "009.跟国防部打笔仗.txt",
    reason: "大段国防部、银行、法院与法条叙述从严排除；仅取少量成语俗语，军政批评本身不收。",
  },
  {
    source_file: "016.吴祺芳怎样作弄江鹏坚？.txt",
    reason: "涉及行政院、政党、人物攻防的现代政治内容不收；只保留文中可独立检索的熟语和仿成语。",
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
