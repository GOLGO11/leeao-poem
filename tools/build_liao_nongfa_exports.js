const fs = require("fs");
const path = require("path");

const book = "李敖弄法集";
const idPrefix = "LANF";
const generatedDate = "2026-06-29";
const sourceDir = path.join("《大李敖全集6.0》分章节", "015.雷霆法律类", "003.李敖弄法集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_nongfa_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_nongfa_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_nongfa_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_nongfa_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_nongfa_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_nongfa_proofread_report.txt");
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
  "校对轮保守收录：《李敖弄法集》为法律个案、司法攻防、机关函件与现代党政人物议题密集文本；现代党政口号、政策判断、司法诉求、机关法条、人物攻防和意识形态语录不收；仅保留句子本身可独立检索的成语、俗语、古典成句、法理格言、文学引文和少量李敖式题句。";

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
  q("《李敖弄法集》小引", 3, "儒以文乱法", "古典成句", "《韩非子》"),
  q("《李敖弄法集》小引", 3, "吏士舞文弄法", "古典成句", "《史记》"),
  q("《李敖弄法集》小引", 3, "春秋笔法", "中文成语", "传统成语"),
  q("《李敖弄法集》小引", 3, "知法犯法", "中文成语", "传统成语"),
  q("《李敖弄法集》小引", 3, "现身说法", "佛教成语", "佛教语汇"),
  q("《李敖弄法集》小引", 3, "不二法门", "佛教成语", "佛教语汇"),

  q("001.", 7, "与人为善", "中文成语", "传统成语"),
  q("001.", 7, "息事宁人", "中文成语", "传统成语"),
  q("001.", 7, "节外生枝", "中文成语", "传统成语"),
  q("001.", 7, "落井下石", "中文成语", "传统成语"),
  q("001.", 9, "一面之词", "中文熟语", "中文熟语"),
  q("001.", 73, "恍然大悟", "中文成语", "传统成语"),
  q("001.", 129, "仗义执言", "中文成语", "传统成语"),
  q("001.", 129, "差强人意", "中文成语", "传统成语"),

  q("003.", 21, "大处着眼", "中文成语", "传统成语"),
  q("003.", 21, "宁纵毋枉", "中文法理格言", "传统法理熟语"),
  q("003.", 21, "枉费心思", "中文成语", "传统成语"),
  q("003.", 23, "先天下之忧而忧", "古典名句", "范仲淹《岳阳楼记》"),
  q("003.", 67, "小大由之", "古典成句", "《论语》相关成句"),
  q("003.", 67, "无中生有", "中文成语", "传统成语"),
  q("003.", 67, "化大为小，化小为无", "中文熟语", "中文熟语"),
  q("003.", 71, "一念之间", "中文成语", "传统成语"),
  q("003.", 71, "公报私仇", "中文成语", "传统成语"),
  q("003.", 83, "法令滋彰，盗贼多有。", "古典名句", "《老子》"),
  q("003.", 83, "上任三把火", "中文俗语", "中文俗语"),
  q("003.", 83, "小鼻子小眼", "中文熟语", "中文熟语"),

  q("004.", 25, "大惊小怪", "中文成语", "传统成语"),
  q("004.", 25, "莫名其妙", "中文成语", "传统成语"),
  q("004.", 25, "闻所未闻", "中文成语", "传统成语"),
  q("004.", 29, "倒果为因", "中文成语", "传统成语"),
  q("004.", 79, "习以为常", "中文成语", "传统成语"),

  q("006.", 3, "刀笔吏不可做公卿", "古典法政成句", "汉人语"),
  q("006.", 3, "本来无事只畏扰，扰者才吏非庸人。", "古典诗句", "宋人语"),
  q("006.", 3, "不识大礼", "中文熟语", "中文熟语"),
  q("006.", 3, "不务大体", "中文熟语", "中文熟语"),
  q("006.", 3, "庸人自扰", "中文成语", "传统成语"),
  q("006.", 9, "极知禹无害，然文深，不可以居大府。", "史传名句", "《史记》"),
  q("006.", 9, "不识大体", "中文成语", "传统成语"),

  q("007.", 47, "上失之，下杀之，其可乎？", "古典法理成句", "《荀子·宥坐》"),
  q("007.", 47, "不教其民而听其狱，杀不辜也！", "古典法理成句", "《荀子·宥坐》"),
  q("007.", 47, "狱犴不治，不可刑也！", "古典法理成句", "《荀子·宥坐》"),
  q("007.", 47, "罪不在民故也！", "古典法理成句", "《荀子·宥坐》"),

  q("008.", 15, "爱莫能助", "中文成语", "传统成语"),
  q("008.", 15, "说话算话", "中文熟语", "中文熟语"),
  q("008.", 21, "出尔反尔", "中文成语", "传统成语"),
  q("008.", 23, "据理力争", "中文成语", "传统成语"),
  q("008.", 23, "好事成空", "中文熟语", "中文熟语"),
  q("008.", 99, "始作俑者", "中文成语", "传统成语"),
  q("008.", 99, "杠上开花", "中文熟语", "中文熟语"),
  q("008.", 215, "哭笑不得", "中文成语", "传统成语"),

  q("009.", 5, "藏匿不报，罪及三族", "古典法制成句", "秦汉相关法制语"),
  q("009.", 5, "望门投止", "中文成语", "张俭故事相关成语"),
  q("009.", 5, "好将轻侠藏亡命", "古典诗句", "传统诗文用语"),
  q("009.", 5, "不胜枚举", "中文成语", "传统成语"),
  q("009.", 21, "执之而已矣！", "孟子名句", "《孟子》"),
  q("009.", 21, "夫舜恶得而禁之？夫有所受之也！", "孟子名句", "《孟子》"),
  q("009.", 21, "舜视弃天下，犹弃敝屣也！", "孟子名句", "《孟子》"),
  q("009.", 21, "窃负而逃，遵海滨而处，终身欣然，乐而忘天下。", "孟子名句", "《孟子》"),
  q("009.", 49, "天不怕地不怕", "中文熟语", "中文熟语"),

  q("010.", 9, "满城风雨", "中文成语", "传统成语"),
  q("010.", 37, "不明不白", "中文成语", "传统成语"),
  q("010.", 37, "不了了之", "中文成语", "传统成语"),
  q("010.", 39, "司空见惯", "中文成语", "传统成语"),

  q("011.", 3, "障眼法", "中文熟语", "中文熟语"),
  q("011.", 5, "各显神通", "中文成语", "传统成语"),
  q("011.", 5, "化险为夷", "中文成语", "传统成语"),
  q("011.", 5, "败部复活", "中文熟语", "中文熟语"),
  q("011.", 47, "单刀直入", "中文成语", "传统成语"),
  q("011.", 47, "面红耳赤", "中文成语", "传统成语"),
  q("011.", 47, "鼻青眼肿", "中文成语", "传统成语"),
  q("011.", 47, "字斟句酌", "中文成语", "传统成语"),

  q("014.", 17, "口口声声", "中文成语", "传统成语"),
  q("014.", 19, "含沙射影", "中文成语", "传统成语"),
  q("014.", 19, "故出人罪", "中文法律成语", "传统法律成语"),
  q("014.", 29, "数典忘祖", "中文成语", "传统成语"),
  q("014.", 29, "事证至明", "中文熟语", "中文熟语"),
  q("014.", 95, "天方夜谭", "中文成语", "外来故事成语"),
  q("014.", 99, "一望而知", "中文成语", "传统成语"),
  q("014.", 99, "网开一面", "中文成语", "传统成语"),
  q("014.", 99, "白纸黑字", "中文成语", "传统成语"),
  q("014.", 99, "视而不见", "中文成语", "传统成语"),
  q("014.", 101, "是非自有公论", "中文格言", "中文格言"),

  q("015.", 7, "皆大欢喜", "中文成语", "传统成语"),

  q("016.", 5, "只字不提", "中文成语", "传统成语"),
  q("016.", 5, "强词夺理", "中文成语", "传统成语"),
  q("016.", 5, "史无前例", "中文成语", "传统成语"),
  q("016.", 7, "颠倒是非", "中文成语", "传统成语"),
  q("016.", 7, "锲而不舍", "中文成语", "传统成语"),

  q("018.", 5, "耐人寻味", "中文成语", "传统成语"),
  q("018.", 9, "胡搅蛮缠", "中文成语", "传统成语"),
  q("018.", 9, "予取予求", "中文成语", "传统成语"),
  q("018.", 9, "多此一举", "中文成语", "传统成语"),
  q("018.", 9, "希旨承风", "中文成语", "传统成语"),

  q("019.", 5, "博学多闻", "中文成语", "传统成语"),
  q("019.", 5, "爱真理胜于爱老师柏拉图", "西方哲学格言", "亚里士多德相关格言"),

  q("020.", 3, "独善其身", "中文成语", "儒家相关成语"),
  q("020.", 3, "兼善天下", "中文成语", "儒家相关成语"),

  q("021.", 3, "不成体统", "中文成语", "传统成语"),
  q("021.", 3, "我不入地狱，谁入地狱。", "佛教熟语", "佛教相关熟语"),
  q("021.", 3, "鹏程万里", "中文成语", "《庄子》相关成语"),
  q("021.", 3, "碌碌终日", "中文成语", "传统成语"),
  q("021.", 3, "兀兀穷年", "中文成语", "传统成语"),
  q("021.", 3, "时运不济", "中文成语", "传统成语"),
  q("021.", 5, "扶同为恶", "中文成语", "传统成语"),
  q("021.", 5, "同流合污", "中文成语", "传统成语"),

  q("023.", 7, "少年十五二十时", "古典诗句", "王维诗句"),
  q("023.", 9, "摇身一变", "中文成语", "传统成语"),
  q("023.", 13, "咬牙切齿", "中文成语", "传统成语"),
  q("023.", 13, "苟延残喘", "中文成语", "传统成语"),
  q("023.", 13, "忍气吞声", "中文成语", "传统成语"),
  q("023.", 13, "自欺欺人", "中文成语", "传统成语"),

  q("024.", 23, "今也在朝，小臣藐大臣；在边，军士轻主帅；在家，子妇蔑父母；在学校，弟子慢师，后进凌先进；在乡里，卑幼轧尊长。", "古典社会评论", "吕坤语"),
  q("024.", 23, "惟贪肆是恣，不知礼法为何物。", "古典社会评论", "吕坤语"),
  q("024.", 23, "借题发挥", "中文成语", "传统成语"),

  q("025.", 5, "有所不为", "中文熟语", "中文熟语"),
  q("025.", 5, "望尘莫及", "中文成语", "传统成语"),
  q("025.", 5, "丑态毕露", "中文成语", "传统成语"),
  q("025.", 9, "一视同仁", "中文成语", "传统成语"),
  q("025.", 9, "昭然若揭", "中文成语", "传统成语"),
  q("025.", 17, "出淤泥而不染", "古典名句", "周敦颐《爱莲说》"),

  q("026.", 9, "水落石出", "中文成语", "传统成语"),
  q("026.", 19, "故态复萌", "中文成语", "传统成语"),
  q("026.", 23, "灰头土脸", "中文熟语", "中文熟语"),

  q("027.", 5, "大司寇之职，掌建邦之三典，以佐王刑邦国、诘四方。", "古典法理成句", "《周礼·秋官司寇》"),
  q("027.", 5, "一曰：刑新国，用轻典；二曰：刑平国，用中典；三曰：刑乱国，用重典。", "古典法理成句", "《周礼·秋官司寇》"),
  q("027.", 5, "治乱世，用重典", "中文法理熟语", "传统法理熟语"),
  q("027.", 7, "例愈纷而弊愈无穷", "古典史论成句", "《明史·刑法志》"),
  q("027.", 9, "刑乱国之典，非百世通行之道也！", "古典法理成句", "《明史·刑法志》"),
  q("027.", 9, "夫律设大法，礼顺人情，齐民以刑，不若以礼。", "古典法理成句", "《明史·刑法志》"),
  q("027.", 11, "昙花一现", "中文成语", "传统成语"),

  q("029.", 7, "黄狗偷食，黑狗当灾", "中文俗语", "中文俗语"),
  q("029.", 7, "人在江湖", "中文熟语", "中文熟语"),
  q("029.", 7, "背黑锅", "中文熟语", "中文熟语"),
  q("029.", 21, "身不由己", "中文成语", "传统成语"),
  q("029.", 21, "天下之罪皆归之", "李敖式格言", "本章概括语"),
  q("029.", 17, "见怪不怪", "中文成语", "传统成语"),
  q("029.", 17, "敷衍塞责", "中文成语", "传统成语"),
  q("029.", 17, "假戏真做", "中文成语", "传统成语"),
  q("029.", 21, "一针见血", "中文成语", "传统成语"),

  q("030.", 21, "雅俗共赏", "中文成语", "传统成语"),

  q("031.", 5, "宁肯让犯人逃掉。不然的话，犯人抓到了，可是法律却逃掉了！", "现代法理格言", "梁启超语"),
  q("031.", 7, "上穷碧落下黄泉", "古典诗句", "白居易《长恨歌》"),
  q("031.", 7, "曲学阿世", "中文成语", "传统成语"),
  q("031.", 7, "锯箭法", "中文典故", "《厚黑学》相关典故"),

  q("032.", 13, "案重初供", "中文法律熟语", "传统证据法熟语"),
  q("032.", 21, "黑吃黑", "中文熟语", "中文熟语"),
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
  "方励之",
  "马赫俊",
  "许信良",
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
    source_file: "002.他们看司法黑暗.txt",
    reason: "主要为现代监察委员司法政治批评，虽然有普通描述语，首轮不作为诗文格言收录。",
  },
  {
    source_file: "013.从事先检查到不检即查.txt",
    reason: "鲁迅引文在本章服务于出版管制与党政执行批评，未抽成政治语境外的格言条目。",
  },
  {
    source_file: "028.所谓《台湾地区戒严时期出版物管制办法》.txt",
    reason: "全章以戒严出版物管制办法、宪法与法规争点为主，法条/政策判断不收。",
  },
  {
    source_file: "031.国民党如何跑了犯人也跑了法律.txt",
    reason: "仅保留梁启超法理格言和少量典故成语；党派攻防、入境通缉与个案判断不收。",
  },
];

const proofreadRemovedRows = [
  {
    quote_text: "一时一地",
    reason: "普通时地短语，离开本段梁启超法理讨论后检索价值弱。",
  },
  {
    quote_text: "其言也善",
    reason: "只取了古典成句片段，源文用于警察个案评论，校对轮从严删除。",
  },
  {
    quote_text: "前事不忘",
    reason: "未成完整熟语，源文只是叙述性提醒，独立格言性不足。",
  },
  {
    quote_text: "遁，逃也。",
    reason: "字典训释，不属于本项目要保留的诗文格言或成语俗语。",
  },
  {
    quote_text: "见不得人",
    reason: "普通描述短语，案情语境过强，独立检索价值弱。",
  },
  {
    quote_text: "千古妙文",
    reason: "李敖对判决文字的现场评语，非稳定成语或引用。",
  },
  {
    quote_text: "理屈",
    reason: "两字状态词，独立成条价值不足。",
  },
  {
    quote_text: "泪眼汪汪",
    reason: "现场描写感强，不作为诗文格言保留。",
  },
  {
    quote_text: "一应俱全",
    reason: "普通列举短语，源文为家庭成员与信仰分布叙述，格言性不足。",
  },
  {
    quote_text: "脱身事外",
    reason: "政治史论段落中的临场用语，稳定性和独立检索价值不足。",
  },
  {
    quote_text: "极尽侮蔑之能事",
    reason: "通讯社案情用语，非李敖引录的诗文格言。",
  },
  {
    quote_text: "情非得已",
    reason: "现代党派个案评论段落里的普通成语，政治语境过重。",
  },
  {
    quote_text: "等而下之",
    reason: "现代党派个案评论段落里的普通成语，政治语境过重。",
  },
  {
    quote_text: "按兵不动",
    reason: "司法新闻叙述中的普通成语，案情依附较强。",
  },
  {
    quote_text: "不出所料",
    reason: "司法新闻叙述中的普通成语，案情依附较强。",
  },
  {
    quote_text: "大吃一惊",
    reason: "司法新闻叙述中的普通成语，案情依附较强。",
  },
  {
    quote_text: "谎话连篇",
    reason: "个案攻击性叙述中的普通成语，独立保留价值弱。",
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
  proofreadAddedRows: [],
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
