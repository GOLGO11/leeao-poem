const fs = require("fs");
const path = require("path");

const book = "李敖好讼集";
const idPrefix = "LAHS";
const generatedDate = "2026-06-29";
const sourceDir = path.join("《大李敖全集6.0》分章节", "015.雷霆法律类", "005.李敖好讼集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_haosong_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_haosong_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_haosong_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_haosong_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_haosong_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_haosong_proofread_report.txt");
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
  "校对轮保守收录：《李敖好讼集》为胡秋原、《中央日报》、法院与媒体纠纷密集文本；现代党政口号、政治史判断、司法诉求、机关法条、判例定义、人物攻防和意识形态语录不收；仅保留句子本身可独立检索的成语、俗语、古典成句、文学引文、称谓典故和少量文法格言。";

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
  q("《李敖好讼集》小引", 3, "家常便饭", "中文熟语", "中文熟语"),
  q("《李敖好讼集》小引", 5, "不亦宜乎", "古典成句", "《论语》句式化用"),

  q("001.", 51, "恍然大悟", "中文成语", "传统成语"),
  q("001.", 51, "自高自大", "中文成语", "传统成语"),
  q("001.", 51, "冲锋陷阵", "中文成语", "传统成语"),
  q("001.", 51, "落花飞絮", "文学化成句", "传统文学意象"),
  q("001.", 53, "语无伦次", "中文成语", "传统成语"),
  q("001.", 59, "横看成岭侧成峰，远近高低各不同", "古典诗句", "苏轼《题西林壁》"),
  q("001.", 61, "不识庐山真面目，只缘身在此山中。", "古典诗句", "苏轼《题西林壁》"),
  q("001.", 65, "真面目，握真镜一照便见。若入沉吟，呵气满镜矣！何由得露纤毫？", "古典文句", "李日华《六研斋三笔》"),
  q("001.", 109, "大惊小怪", "中文成语", "传统成语"),
  q("001.", 113, "莫名其妙", "中文成语", "传统成语"),
  q("001.", 133, "将无作有", "中文熟语", "中文熟语"),
  q("001.", 133, "毫不相干", "中文成语", "传统成语"),
  q("001.", 133, "别有用心", "中文成语", "传统成语"),
  qp("001.", 137, "有宦官恃贵宠，放鹞不避人禾稼。", "古典文法例句", "柳宗元《龙城录》"),
  qp("001.", 139, "朱小四你这厮，有人请唤，今日须当你这厮出头。", "白话文学例句", "《京本通俗小说·西山一窟鬼》"),
  qp("001.", 143, "故言富者‘皆’称陶朱公。", "古典文法例句", "《史记·货殖列传》"),
  qp("001.", 145, "周礼‘尽’在鲁矣！", "古典文法例句", "《左传·昭公元年》"),
  qp("001.", 147, "萧何亦发关中老弱未传‘悉’诣荥阳。", "古典文法例句", "《史记·项羽本纪》"),
  qp("001.", 149, "主之所极然，帅群臣而首乡之者，则‘举’义志也。", "古典文法例句", "《荀子·王霸》"),
  qp("001.", 151, "群黎百姓，‘徧’为尔德。", "古典文法例句", "《诗经·小雅·天保》"),
  qp("001.", 153, "不可以‘并’立乎天下。", "古典文法例句", "《公羊传·庄公四年》"),
  qp("001.", 155, "尝劝上于征战地修寺及‘普’度僧尼。", "古典文法例句", "《宋史·孔承恭传》"),
  qp("001.", 157, "‘俱’著名字，为后世冠。", "古典文法例句", "《汉书·陈遵传》"),
  qp("001.", 159, "西极大杨川望黄沙，犹若人委干构于地，‘都’不生草木。", "古典文法例句", "郦道元《水经注》"),
  qp("001.", 161, "俾万姓‘咸’曰：‘大哉王言！’", "古典文法例句", "《书经·咸有一德》"),
  qp("001.", 163, "数年间，民养子者千数，‘佥’曰：‘贾父所长。’", "古典文法例句", "《后汉书·贾彪传》"),
  qp("001.", 165, "自四境之内执法以下至于长挽者故‘毕’曰：‘与嫪氏乎？与吕氏乎？’", "古典文法例句", "《战国策·秦策》"),
  qp("001.", 167, "大郡二千石，死官赋钦送葬者皆千万以上，妻子通‘共’受之。", "古典文法例句", "《汉书·原涉传》"),
  qp("001.", 169, "臣今‘通’计所在，百姓贫多富少。", "古典文法例句", "韩愈《论辩盐法事宜状》"),
  qp("001.", 171, "你要为我的情，就‘一总’送我二、三千两银子。", "白话文学例句", "吴敬梓《儒林外史》第二十八回"),
  qp("001.", 173, "一家人一齐跑出来说道：‘不好了！快些搬！’", "白话文学例句", "吴敬梓《儒林外史》第十六回"),
  qp("001.", 175, "他都要回太太，全放出去。", "白话文学例句", "曹雪芹《红楼梦》第六十回"),
  qp("001.", 177, "这位又说怕冬至前后，总没个真着活儿。", "白话文学例句", "曹雪芹《红楼梦》第十回"),
  q("001.", 207, "瞒天过海", "中文成语", "传统成语"),
  q("001.", 229, "一笔抹杀", "中文成语", "传统成语"),
  q("001.", 237, "心劳日绌", "中文成语", "传统成语"),
  q("001.", 237, "鲁莽孤行", "中文成语", "传统成语"),
  q("001.", 271, "信笔舞文弄墨", "中文熟语", "中文熟语"),
  q("001.", 271, "张冠李戴", "中文成语", "传统成语"),
  q("001.", 271, "白纸黑字", "中文成语", "传统成语"),
  q("001.", 317, "石破天惊", "中文成语", "传统成语"),
  q("001.", 337, "断章取义", "中文成语", "传统成语"),
  q("001.", 353, "如法泡制", "中文熟语", "中文熟语"),
  q("001.", 375, "自欺欺人", "中文成语", "传统成语"),
  q("001.", 375, "昭然若揭", "中文成语", "传统成语"),
  q("001.", 387, "信口开河", "中文成语", "传统成语"),
  q("001.", 397, "大言欺人", "中文成语", "传统成语"),
  q("001.", 397, "大相径庭", "中文成语", "传统成语"),
  q("001.", 397, "偷天换日", "中文成语", "传统成语"),
  q("001.", 437, "大惑特惑", "中文熟语", "中文熟语"),
  q("001.", 465, "顾左右而言他", "古典成句", "《孟子》成句"),
  q("001.", 475, "奇文共欣赏，疑义相与析", "古典诗句", "陶潜《移居》"),
  q("001.", 485, "口口声声", "中文成语", "传统成语"),
  q("001.", 491, "含沙射影", "中文成语", "传统成语"),
  q("001.", 497, "移花接木", "中文成语", "传统成语"),
  q("001.", 501, "翻云覆雨", "中文成语", "传统成语"),
  q("001.", 521, "仁义道德", "中文成语", "传统成语"),
  q("001.", 521, "同舟共济", "中文成语", "传统成语"),
  q("001.", 523, "同归于尽", "中文成语", "传统成语"),

  q("002.", 5, "许冠李戴", "李敖式仿成语", "仿“张冠李戴”"),
  q("002.", 5, "只字不提", "中文成语", "传统成语"),
  q("002.", 21, "今古奇观", "中文成语", "传统成语"),
  q("002.", 21, "啼笑皆非", "中文成语", "传统成语"),

  q("003.", 3, "此起彼落", "中文成语", "传统成语"),
  q("003.", 3, "无法胜数", "中文熟语", "中文熟语"),
  q("003.", 3, "空前绝后", "中文成语", "传统成语"),
  q("003.", 3, "不值一驳", "中文熟语", "中文熟语"),
  q("003.", 3, "一翻两瞪眼", "中文熟语", "中文熟语"),
  q("003.", 3, "提要钩玄", "中文成语", "传统成语"),

  q("004.", 29, "不知所云", "中文成语", "传统成语"),
  q("004.", 29, "胡搅蛮缠", "中文成语", "传统成语"),
  q("004.", 29, "不值一辩", "中文熟语", "中文熟语"),

  q("005.", 65, "纲举目张", "中文成语", "传统成语"),
  q("005.", 65, "侜张为幻", "古典成句", "传统成语"),

  q("007.", 97, "有识之士", "中文成语", "传统成语"),
  q("007.", 101, "轻描淡写", "中文成语", "传统成语"),
  q("007.", 101, "一手遮天", "中文成语", "传统成语"),
  q("007.", 105, "直言无隐", "中文成语", "传统成语"),
  q("007.", 129, "著作等身", "中文成语", "传统成语"),
  q("007.", 129, "中外驰名", "中文熟语", "中文熟语"),

  q("008.", 15, "视而不见", "中文成语", "传统成语"),
  q("008.", 31, "水涨船高", "中文成语", "传统成语"),
  q("008.", 39, "无远弗届", "中文成语", "传统成语"),
  q("008.", 39, "判若两刊", "李敖式仿成语", "仿“判若两人”"),
  q("008.", 39, "判若二人", "中文成语", "传统成语"),
  q("008.", 55, "捉襟见肘", "中文成语", "传统成语"),
  q("008.", 55, "无所不用其极", "中文成语", "传统成语"),
  q("008.", 55, "趾高气扬", "中文成语", "传统成语"),

  q("009.", 53, "变本加厉", "中文成语", "传统成语"),
  q("011.", 25, "在劫难逃", "中文成语", "传统成语"),
  q("011.", 33, "生吞活剥", "中文成语", "传统成语"),

  q("013.", 13, "巨细不遗", "中文成语", "传统成语"),
  q("013.", 15, "节外生枝", "中文成语", "传统成语"),
  q("013.", 33, "公道自在人心", "中文格言", "中文俗谚"),
  q("013.", 35, "不胜枚举", "中文成语", "传统成语"),
  q("013.", 39, "裾裙脂粉之语", "诗话术语", "《沧浪诗话》"),
  q("013.", 41, "前言戏之耳！", "古典文句", "《论语·阳货》"),
  q("013.", 41, "夫子自道", "中文成语", "传统成语"),
  q("013.", 41, "道貌岸然", "中文成语", "传统成语"),
  q("013.", 41, "正经八百", "中文熟语", "中文熟语"),

  q("014.", 29, "是非曲直", "中文成语", "传统成语"),
  q("014.", 47, "青史留名", "中文成语", "传统成语"),

  q("015.", 27, "事必躬亲", "中文成语", "传统成语"),
  q("015.", 27, "责无旁贷", "中文成语", "传统成语"),

  q("016.", 3, "连篇累牍", "中文成语", "传统成语"),
  q("016.", 3, "刺刺不休", "中文成语", "传统成语"),
  q("016.", 3, "了无新意", "中文熟语", "中文熟语"),
  q("016.", 11, "流芳百世", "中文成语", "传统成语"),
  q("016.", 11, "遗臭万年", "中文成语", "传统成语"),

  q("018.", 11, "平王之孙、齐侯之子。", "古典例句", "《诗经·何彼襛矣》"),
  q("018.", 13, "父母之邦。", "古典成句", "《论语·微子》"),
  q("018.", 15, "离娄之明、公输子之巧。", "古典例句", "《孟子·离娄》"),
  q("018.", 17, "管子之圣", "古典例句", "《韩非子·说林上》"),
  q("018.", 17, "隰朋之智。", "古典例句", "《韩非子·说林上》"),
  q("018.", 19, "拳拳之忠。", "古典成句", "《汉书·司马迁传》"),
  q("018.", 21, "世禄之家", "古典成句", "《红楼梦》第二回"),
  q("018.", 21, "书香之族。", "古典成句", "《红楼梦》第二回"),
  q("018.", 25, "膏粱之性。", "古典成句", "《国语·晋语七》"),
  q("018.", 27, "禽兽之行。", "古典成句", "《管子》"),
  q("018.", 29, "败军之将。", "古典成句", "《吴越春秋·勾践入臣外传》"),
  q("018.", 31, "斗筲之人。", "古典成句", "《论语·子路》"),
  q("018.", 33, "聚敛之臣。", "古典成句", "《礼记·大学》"),
  q("018.", 35, "妇人之仁。", "古典成句", "《史记·淮阴侯传》"),
  q("018.", 37, "虎狼之国。", "古典成句", "《史记·苏秦传》"),
  q("018.", 39, "犬羊之质。", "古典成句", "曹丕《与曹植书》"),
  q("018.", 41, "逐臭之夫。", "古典成句", "曹植《与杨德祖书》"),
  q("018.", 43, "鼎食之家。", "古典成句", "王勃《滕王阁序》"),
  q("018.", 49, "君子之交淡若水；小人之交甘若醴。", "古典格言", "《庄子·山木》"),
  q("018.", 55, "黔驴之技", "古典成语", "柳宗元《三戒》"),

  q("019.", 21, "男子对人称己之妻曰“拙荆”，又曰“内子”。亦曰“内人”或“贱内”。", "称谓典故", "传统称谓"),
  q("019.", 27, "犬马之齿", "古典成句", "《汉书》相关臣子自称"),
  q("019.", 33, "犬马之年", "古典成句", "《三国志》相关语汇"),
  q("019.", 39, "犬马之劳", "古典成句", "传统臣子自谦语"),

  q("021.", 11, "落井下石", "中文成语", "传统成语"),
  q("021.", 11, "不学无术，误人子弟", "中文熟语", "中文熟语"),
  q("021.", 21, "锯箭法", "典故短语", "传统讽刺典故"),
  q("021.", 23, "耐人寻味", "中文成语", "传统成语"),
  q("021.", 23, "杀人如草不闻声", "古典诗句", "杜甫诗句化用"),
  q("021.", 23, "曲法阿世", "中文成语", "传统成语"),

  q("022.", 35, "蝉曳残声到别枝", "古典诗句", "传统诗句化用"),

  q("023.", 15, "言犹在耳", "中文成语", "传统成语"),
  q("023.", 15, "呆若木鸡", "中文成语", "传统成语"),
  q("023.", 21, "草菅人命", "中文成语", "传统成语"),
  q("023.", 21, "若无其事", "中文成语", "传统成语"),
  q("023.", 21, "杏林春寒", "李敖式仿成语", "医学语境中仿成句"),
  q("023.", 21, "判若两人", "中文成语", "传统成语"),

  q("025.", 9, "李代桃僵", "中文成语", "传统成语"),
  q("025.", 9, "摆迷魂阵", "中文熟语", "中文熟语"),

  q("027.", 13, "胶柱鼓瑟", "中文成语", "传统成语"),
  q("027.", 13, "只知其一而不知其二", "中文熟语", "中文熟语"),
  q("027.", 13, "错认颜标是鲁公", "古典文句", "传统讽刺成句"),
  q("027.", 13, "舍大道而不由", "古典成句", "《孟子》句式"),

  q("028.", 15, "不得要领", "中文成语", "传统成语"),
  q("028.", 15, "百思不解", "中文成语", "传统成语"),
  q("028.", 15, "沟通无门", "中文熟语", "中文熟语"),
  q("028.", 15, "有理说不清", "中文熟语", "中文熟语"),
  q("028.", 37, "打太极拳", "中文熟语", "中文熟语"),
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
  "台湾",
  "中国",
  "民主",
  "人权",
  "主权",
  "统一",
  "独立",
  "政治",
  "革命",
  "胡秋原",
  "石永贵",
  "梁肃戎",
  "中央日报",
  "三军总医院",
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
    source_file: "001.打倒胡秋原谎话的二十个例子.txt",
    reason: "全章政治史争辩、人名攻防和意识形态词汇密集；只保留苏轼、陶潜等明确引文及脱离语境仍能成立的成语熟语。",
  },
  {
    source_file: "005.控告胡秋原、梁肃戎诽谤.txt",
    reason: "诽谤清单和诉讼请求占主体，涉党政机构与人物攻防者不收，只保留少量中性成语。",
  },
  {
    source_file: "014.对所谓诬告的答辩.txt",
    reason: "判例原文和诬告构成要件偏法律文书，不作为诗文格言收录；仅留其中可独立检索的传统成语。",
  },
  {
    source_file: "023.质问三军总医院.txt",
    reason: "医院质问与责任追究文字不收，保留少量传统成语和医学语境中的李敖式仿成语。",
  },
];

const proofreadRemovedRows = [
  {
    quote_text: "乱扯一通",
    reason: "临场口语化攻击，独立检索价值弱，校对轮从严删除。",
  },
  {
    quote_text: "神智不清",
    reason: "诉讼攻防中的人物评断，近于普通责骂，不作为诗文格言保留。",
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
