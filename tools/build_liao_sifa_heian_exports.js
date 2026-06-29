const fs = require("fs");
const path = require("path");

const book = "你不知道的司法黑暗";
const idPrefix = "LASFH";
const generatedDate = "2026-06-29";
const sourceDir = path.join("《大李敖全集6.0》分章节", "015.雷霆法律类", "006.你不知道的司法黑暗");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_sifa_heian_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_sifa_heian_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_sifa_heian_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_sifa_heian_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_sifa_heian_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_sifa_heian_proofread_report.txt");
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
  "校对轮保守收录：《你不知道的司法黑暗》为司法个案、法院攻防和党政人物语境密集文本；现代政治口号、司法诉求、法条判例解释、人物攻防、机关结论和意识形态判断不收；仅保留句子本身可独立检索的成语、俗语、古典成句、诗文句、文学典故和少量短法律格言。";

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

const rawRows = [
  q("001.", 7, "天不生‘李敖’，万古如长夜。", "李敖式仿古成句", "化用“天不生仲尼，万古如长夜”一类尊圣成句"),
  q("001.", 9, "快意恩仇", "中文成语", "传统成语"),
  q("001.", 11, "上得山多终遇虎", "中文俗语", "中文俗谚"),
  q("001.", 11, "锲而不舍", "中文成语", "传统成语"),
  q("001.", 13, "官官相护", "中文成语", "传统成语"),
  q("001.", 31, "无所遁形", "中文成语", "传统成语"),
  q("001.", 35, "明镜高悬", "中文成语", "传统成语"),
  q("001.", 39, "草菅人命", "中文成语", "传统成语"),
  q("001.", 41, "水落石出", "中文成语", "传统成语"),
  q("001.", 47, "不得要领", "中文成语", "传统成语"),
  q("001.", 47, "行尸走肉", "中文成语", "传统成语"),
  q("001.", 49, "逍遥法外", "中文成语", "传统成语"),
  q("001.", 57, "说大人，则藐之", "古典成句", "《孟子》成句"),
  q("001.", 57, "戏公卿、弄王侯", "文学化成句", "传统文人自许语"),
  q("001.", 57, "孤傲高蹈", "中文成语", "传统成语"),
  q("001.", 57, "趋炎附势", "中文成语", "传统成语"),
  q("001.", 59, "杠上开花", "中文熟语", "中文熟语"),
  q("001.", 59, "耐人寻味", "中文成语", "传统成语"),
  q("001.", 65, "服善之勇", "古典成句", "传统文言成句"),
  q("001.", 73, "杀人如草不闻声", "古典诗句", "杜甫诗句化用"),
  q("001.", 73, "曲法阿世", "中文成语", "传统成语"),
  q("001.", 75, "遗臭万年", "中文成语", "传统成语"),
  q("001.", 83, "欲加之罪，何患无辞", "中文俗语", "传统俗谚"),
  q("001.", 83, "光明正大", "中文成语", "传统成语"),
  q("001.", 83, "瞒天过海", "中文成语", "传统成语"),
  q("001.", 83, "上下其手", "中文成语", "传统成语"),
  q("001.", 83, "莫须有", "历史典故", "岳飞冤狱相关典故"),
  q("001.", 89, "孤陋寡闻", "中文成语", "传统成语"),
  q("001.", 93, "黄鱼两吃", "中文熟语", "中文熟语"),
  q("001.", 93, "李代桃僵", "中文成语", "传统成语"),
  q("001.", 95, "指鹿为马", "历史典故", "秦赵高典故"),

  q("002.", 3, "摇身一变", "中文成语", "传统成语"),
  q("002.", 15, "案重初供", "法律格言", "传统证据格言"),

  q("003.", 15, "换汤不换药", "中文俗语", "中文熟语"),
  q("003.", 37, "和盘托出", "中文成语", "传统成语"),
  q("003.", 99, "避重就轻", "中文成语", "传统成语"),
  q("003.", 99, "不了了之", "中文成语", "传统成语"),
  q("003.", 175, "众说纷纷", "中文成语", "传统成语"),
  q("003.", 205, "牵强附会", "中文成语", "传统成语"),
  q("003.", 207, "倒果为因", "中文成语", "传统成语"),

  q("004.", 7, "同流合污", "中文成语", "传统成语"),
  q("004.", 11, "天外有天", "中文俗语", "中文熟语"),
  q("004.", 31, "灰头土脸", "中文成语", "传统成语"),
  q("004.", 31, "面目全非", "中文成语", "传统成语"),
  q("004.", 81, "生不如死", "中文熟语", "中文熟语"),
  q("004.", 91, "老天爹（爷）不负苦心人", "中文俗语", "中文俗谚"),
  q("004.", 99, "铁面无私", "中文成语", "传统成语"),

  q("005.", 21, "故态复萌", "中文成语", "传统成语"),
  q("005.", 25, "画蛇添足", "中文成语", "传统成语"),
  q("005.", 31, "满城风雨", "中文成语", "传统成语"),
  q("005.", 33, "天方夜谭", "中文成语", "传统成语"),
  q("005.", 49, "若合符节", "中文成语", "传统成语"),
  q("005.", 63, "信口开河", "中文成语", "传统成语"),
  q("005.", 69, "用之则行，舍之则藏", "古典成句", "《论语》成句"),
  q("005.", 71, "苛政猛于虎", "古典成句", "《礼记》相关成句"),
  q("005.", 75, "忍气吞声", "中文成语", "传统成语"),
  q("005.", 143, "真的假不了，假的真不了", "中文俗语", "中文俗谚"),
  q("005.", 143, "无风不起浪", "中文俗语", "中文俗谚"),
  q("005.", 143, "周而复始", "中文成语", "传统成语"),
  q("005.", 143, "蛛丝马迹", "中文成语", "传统成语"),
  q("005.", 213, "春潮带雨晚来急", "古典诗句", "韦应物《滁州西涧》"),
  q("005.", 213, "隔叶黄鹂空好音", "古典诗句", "杜甫《蜀相》"),
  q("005.", 245, "差强人意", "中文成语", "传统成语"),
  q("005.", 357, "无所不用其极", "中文成语", "传统成语"),
  q("005.", 421, "见仁见智", "中文成语", "传统成语"),
  q("005.", 437, "走投无路", "中文成语", "传统成语"),
  q("005.", 463, "身败名裂", "中文成语", "传统成语"),
  q("005.", 509, "一念之间", "中文成语", "传统成语"),
  q("005.", 601, "除暴安良", "中文成语", "传统成语"),
  q("005.", 603, "天有不测风云，人有旦夕祸福", "中文俗语", "传统俗谚"),
  q("005.", 611, "打太极拳", "中文熟语", "中文熟语"),
  q("005.", 623, "一干二净", "中文成语", "传统成语"),
  q("005.", 697, "变本加厉", "中文成语", "传统成语"),
  q("005.", 709, "息事宁人", "中文成语", "传统成语"),
  q("005.", 711, "异口同声", "中文成语", "传统成语"),
  q("005.", 721, "九霄云外", "中文成语", "传统成语"),
  q("005.", 739, "敷衍了事", "中文成语", "传统成语"),
  q("005.", 745, "忍无可忍", "中文成语", "传统成语"),
  q("005.", 747, "若无其事", "中文成语", "传统成语"),
  q("005.", 747, "视死如归", "中文成语", "传统成语"),
  q("005.", 759, "守正不阿", "中文成语", "传统成语"),
  q("005.", 789, "毛骨悚然", "中文成语", "传统成语"),
  q("005.", 817, "一丘之貉", "中文成语", "传统成语"),

  q("006.", 21, "后来居上", "中文成语", "传统成语"),
  q("006.", 21, "昭然若揭", "中文成语", "传统成语"),

  q("007.", 15, "恍然大悟", "中文成语", "传统成语"),

  q("008.", 47, "只知其一而不知其二", "中文熟语", "中文熟语"),
  q("008.", 47, "错认颜标是鲁公", "古典文句", "传统讽刺成句"),
  q("008.", 47, "胶柱鼓瑟", "中文成语", "传统成语"),
  q("008.", 49, "舍大道而不由", "古典成句", "《孟子》句式"),
  q("008.", 49, "白纸黑字", "中文成语", "传统成语"),
  q("008.", 49, "节外生枝", "中文成语", "传统成语"),

  q("009.", 17, "石破天惊", "中文成语", "传统成语"),

  q("010.", 5, "莫名其妙", "中文成语", "传统成语"),
  q("010.", 15, "滑天下之大稽", "古典成句", "《史记》相关成句"),

  q("011.", 7, "当事人不得兼证人。", "法律格言", "传统诉讼格言"),
  q("011.", 19, "藏诸名山", "中文成语", "传统成语"),
  q("011.", 19, "奇货可居", "中文成语", "传统成语"),
  q("011.", 21, "彼有淫具！", "历史典故", "三国刘备酒禁、诸葛亮讽谏故事"),
  q("011.", 23, "别开生面", "中文成语", "传统成语"),
  q("011.", 23, "视而不见", "中文成语", "传统成语"),

  q("012.", 29, "移花接木", "中文成语", "传统成语"),
  q("012.", 37, "高高在上", "中文成语", "传统成语"),
  q("012.", 41, "一翻两瞪眼", "中文熟语", "中文熟语"),
  q("012.", 41, "扶同为恶", "中文成语", "传统成语"),
  q("012.", 41, "希旨承风", "中文成语", "传统成语"),

  q("013.", 5, "荒腔走板", "中文成语", "传统成语"),
  q("013.", 35, "无法无天", "中文成语", "传统成语"),
  q("013.", 39, "举重若轻", "中文成语", "传统成语"),
  q(
    "013.",
    41,
    "飞来山上千寻塔，闻说鸡鸣见日升。不畏浮云遮望眼，自缘身在最高层。",
    "古典诗句",
    "王安石《登飞来峰》",
    "本章完整引王安石《登飞来峰》四句，用以比喻视野高下。",
    47,
  ),

  q("014.", 11, "无中生有", "中文成语", "传统成语"),
  q("014.", 75, "蝉曳残声到别枝", "古典诗句", "传统诗句化用"),
  q("014.", 75, "断章取义", "中文成语", "传统成语"),
  q("014.", 75, "望尘莫及", "中文成语", "传统成语"),

  q("015.", 13, "偷天换日", "中文成语", "传统成语"),
  q("016.", 7, "责无旁贷", "中文成语", "传统成语"),

  q("017.", 3, "落井下石", "中文成语", "传统成语"),
  q("017.", 63, "司空见惯", "中文成语", "传统成语"),
  q("017.", 85, "春秋笔法", "文学典故", "传统史笔典故"),
  q("017.", 113, "不学无术，误人子弟", "中文熟语", "中文熟语"),
  q("017.", 131, "招朋引类", "中文成语", "传统成语"),
  q("017.", 149, "一不做二不休", "中文熟语", "中文熟语"),
  q("017.", 173, "本是同根生", "古典诗句", "曹植《七步诗》成句"),
  q("017.", 181, "天衣无缝", "中文成语", "传统成语"),
  q("017.", 183, "顺水人情", "中文成语", "传统成语"),
  q("017.", 205, "习以为常", "中文成语", "传统成语"),
  q("017.", 269, "咬文嚼字", "中文成语", "传统成语"),
  q("017.", 279, "见义勇为", "中文成语", "传统成语"),

  q("018.", 167, "一望而知", "中文成语", "传统成语"),
  q("018.", 189, "牛头不对马嘴", "中文俗语", "中文熟语"),
  q("018.", 217, "锯箭法", "典故短语", "传统讽刺典故"),
  q("018.", 221, "息息相关", "中文成语", "传统成语"),

  q("020.", 27, "毫不相干", "中文成语", "传统成语"),
  q("020.", 101, "青史留名", "中文成语", "传统成语"),

  q("024.", 51, "只字不提", "中文成语", "传统成语"),
  q("024.", 55, "胡扯八扯", "中文熟语", "中文熟语"),
  q("024.", 61, "不知所云", "中文成语", "传统成语"),

  q("025.", 31, "记忆犹新", "中文成语", "传统成语"),
  q("025.", 41, "听而不闻", "中文成语", "传统成语"),

  q("026.", 5, "头头是道", "中文成语", "传统成语"),

  q("027.", 51, "不折不扣", "中文成语", "传统成语"),
  q("027.", 85, "倒打一耙", "中文熟语", "中文熟语"),
  q("027.", 85, "恩将仇报", "中文成语", "传统成语"),
  q("027.", 89, "占了便宜还卖乖", "中文俗语", "中文俗谚"),
  q("027.", 91, "弃暗投明", "中文成语", "传统成语"),
];

const modernPoliticalTerms = [
  "一国两制",
  "两岸",
  "台独",
  "台湾独立",
  "国民党",
  "民进党",
  "共产党",
  "中共",
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
  "法务部",
  "司法院",
  "监察院",
  "最高法院",
  "高等法院",
  "台北地院",
  "警总",
  "台湾",
  "中国",
  "民主",
  "人权",
  "主权",
  "统一",
  "独立",
  "政治",
  "革命",
  "施启扬",
  "钟曜唐",
  "翁岳生",
  "吕德",
  "陈重瑜",
  "施俊尧",
  "陈国梁",
  "刘景星",
  "张连财",
  "蒋经国",
  "蒋介石",
  "孙中山",
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

const selectedRows = rawRows.sort(rowCompare).map((row, index) => ({
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
        if (column === "decision") return "keep-proofread";
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
    source_file: "001.为司法黑暗发榜.txt",
    reason: "点名放榜、法院批判和政治背景叙述占主体；只取其中可脱离司法攻防语境独立成立的成语、俗语和古典成句。",
  },
  {
    source_file: "005.人间何处有青天.txt",
    reason: "武汉大旅社命案材料、刑求叙述和案件结论不收；仅收古诗化用、传统熟语及可检索成语。",
  },
  {
    source_file: "013.最高法院法官岂可有最低视野？.txt",
    reason: "出版自由、宪法和司法批判文字不收；保留王安石《登飞来峰》完整诗句及少量成语。",
  },
  {
    source_file: "027.质问施启扬和法官李炫德、黄清江、王锦村、庄秋桃.txt",
    reason: "对施启扬、法官和高雄市政府的质问文字不收；只保留句子本身中性的传统熟语。",
  },
];

const proofreadKeptBoundaryRows = [
  {
    quote_text: "案重初供",
    reason: "短法律格言，已在相邻法律类校对轮中采用同类口径；保留格言本体，不收具体案件论断。",
  },
  {
    quote_text: "当事人不得兼证人。",
    reason: "短诉讼格言，句子可独立检索；保留格言本体，不扩展为法条或判例解释。",
  },
  {
    quote_text: "天不生‘李敖’，万古如长夜。",
    reason: "李敖式仿古成句，化用传统尊圣句式；虽带自指，但不是政治语录。",
  },
];

const proofreadOmittedRows = [
  {
    quote_text: "法者，宪令著于官府，刑罚必于民心，赏存乎慎法，而罚加乎奸令者也。",
    reason: "韩非子长法理论述，虽为古文，但偏制度法理；本轮不补入。",
  },
  {
    quote_text: "口口声声",
    reason: "多处出现但词义普通，且多嵌在现代党政/司法攻防句中，校对轮不补入。",
  },
  {
    quote_text: "万岁",
    reason: "口号/感叹语境，不作为诗文格言收录。",
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
  missingQuotes: missing.map((item) => item.row.id),
  politicalHits: political.map((item) => ({
    id: item.row.id,
    quote_text: item.row.quote_text,
    hits: item.politicalHits,
  })),
  duplicateQuotes: duplicates.map((row) => row.id),
  proofreadAddedRows: [],
  proofreadRemovedRows: [],
  proofreadKeptBoundaryRows,
  proofreadOmittedRows,
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
