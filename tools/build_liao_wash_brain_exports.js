const fs = require("fs");
const path = require("path");

const book = "洗你的脑，掐他脖子";
const idPrefix = "LAXNDN";
const generatedDate = "2026-06-29";
const sourceDir = path.join("《大李敖全集6.0》分章节", "014.台湾史政类", "009.洗你的脑，掐他脖子");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_wash_brain_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_wash_brain_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_wash_brain_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_wash_brain_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_wash_brain_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_wash_brain_proofread_report.txt");
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
  "首轮保守收录：《洗你的脑，掐他脖子》为2000年前后选举、两岸、一国两制与台湾政治批评密集文本；现代政治主张、政党/候选人攻防、两岸/统一/独立/国家法统表述、邓小平等政治人物论述不收；仅保留句子本身可独立检索的古典成语、诗句、佛经句、外文格言、故事名句与少量非政治俗语。";

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
  q("《洗你的脑", 3, "志士仁人", "中文成语", "传统成语", "李敖自序中以志士仁人自况，保留成语本体；同段现实政治判断不收。"),
  q("《洗你的脑", 3, "知其不可而为之", "论语成句", "《论语》相关成句", "李敖自序引古之圣人知其不可而为之一语，保留古典成句。"),
  q("《洗你的脑", 3, "知我罪我", "春秋成句", "《春秋》相关成句", "李敖自序化用孔子作春秋知我罪我的典故，保留古典成句。"),
  q("《洗你的脑", 3, "圣人不空出，贤者不虚生", "古典格言", "传统文言格言", "李敖自序引圣贤不虚出之句，保存古典格言本体。"),

  q("001.", 7, "酒色财气不碍菩提路", "佛门格言", "禅门语", "李敖引第一流禅门人物语，说明外在事相不妨碍修行境界。"),
  q("001.", 19, "变本加厉", "中文成语", "传统成语", "李敖用变本加厉形容事态加重，保留成语本体；同段台湾政治叙述不收。"),
  q("001.", 19, "比比皆是", "中文成语", "传统成语", "李敖使用比比皆是，写同类事物到处都有，保留成语本体。"),
  q("001.", 23, "不择手段", "中文成语", "传统成语", "李敖在目的与方法讨论中使用不择手段，保留成语本体。"),
  q(
    "001.",
    25,
    "或现作淫女，引诸好色者。先以欲钩牵，后令入佛智。",
    "佛经引文",
    "《维摩诘所说经》",
    "李敖引《维摩诘所说经》中文字，说明以欲钩牵、导入佛智的佛门方便。",
  ),
  q("001.", 25, "大慈大悲", "佛教成语", "佛教语汇", "李敖使用大慈大悲写观世音菩萨气概，保留佛教成语本体。"),
  q("001.", 129, "费力不讨好", "中文俗语", "中文俗语", "李敖用费力不讨好形容长线教育收效慢、难讨好，保留俗语本体。"),
  q("001.", 129, "断烂朝报", "中文成语", "古代文献成语", "李敖用断烂朝报形容零碎无用的报告文字，保留成语本体。"),
  q("001.", 137, "自然最怕虚空", "西方哲学格言译句", "莱布尼兹", "李敖引莱布尼兹自然最怕虚空一语，并转用于教育不能空谈。"),
  q("001.", 139, "惨不忍睹", "中文成语", "传统成语", "李敖用惨不忍睹形容结果难看，保留成语本体；同段政治口号不收。"),
  q("001.", 139, "种瓜得瓜、种豆得豆", "中文俗语", "中文俗语", "李敖用种瓜得瓜、种豆得豆说明教育因果，保留俗语本体。"),
  q("001.", 141, "失根忘本", "中文成语", "传统成语", "李敖使用失根忘本，保存成语本体；同段教科书政治评议不收。"),
  q("001.", 141, "只字不提", "中文成语", "传统成语", "李敖使用只字不提写完全不提及，保留成语本体。"),
  q("001.", 143, "汗牛充栋", "中文成语", "柳宗元相关成语", "李敖用汗牛充栋形容教改计划数量庞大，保留成语本体。"),
  q("001.", 143, "隔靴搔痒", "中文成语", "传统成语", "李敖用隔靴搔痒形容方法不中要害，保留成语本体。"),
  q("001.", 161, "蒙主宠召", "基督教委婉语", "基督教语汇", "李敖用蒙主宠召指死亡，保存宗教语汇本体；同段两岸政治判断不收。"),
  q("001.", 161, "阴魂不散", "中文成语", "传统成语", "李敖用阴魂不散写旧成见延续，保留成语本体。"),
  q("001.", 161, "振聋发聩", "中文成语", "传统成语", "李敖用振聋发聩形容真话发声有警醒作用，保留成语本体。"),
  q("001.", 309, "烦恼皆因强出头", "中文俗语", "中文俗语", "李敖引烦恼皆因强出头这句老话，保存俗语本体；同段两岸论述不收。"),
  q("001.", 309, "既不能令，又不受命", "孟子成句", "《孟子》相关成句", "李敖引孟子笔下既不能令、又不受命一语，保留古典成句。"),
  q("001.", 343, "大言炎炎", "庄子成语", "《庄子》相关成句", "李敖用大言炎炎形容夸大言论，保留古典成语本体；同段政治主张不收。"),
  qp("001.", 613, "不可同日而语", "中文成语", "传统成语", "陈若曦文中用不可同日而语比较语言表现差异，保留成语本体。"),
  qp("001.", 637, "司空见惯", "中文成语", "刘禹锡诗典故衍化成语", "陈若曦文中用司空见惯说明文学作品夹带方言很常见，保留成语本体。"),
  qp("001.", 641, "削足适履", "中文成语", "传统成语", "陈若曦文中用削足适履批评生搬硬套，保留成语本体。"),

  qp("002.", 37, "哀莫大于心死", "庄子成句", "《庄子·田子方》相关成句", "李敖明言古人说哀莫大于心死，保留古典成句；同段现代政治讽刺不收。"),

  q("003.", 117, "红了樱桃，绿了芭蕉", "宋词名句", "蒋捷《一剪梅·舟过吴江》", "李敖引红了樱桃、绿了芭蕉说明中文形容词活用，保留词句本体。"),
  q("003.", 117, "莫等闲白了少年头", "宋词名句", "岳飞《满江红》", "李敖引莫等闲白了少年头说明中文形容词活用，保留词句本体。"),
  qp("003.", 29, "天要下雨，娘要嫁人", "中文俗语", "中文俗语", "李敖用天要下雨、娘要嫁人说明不可阻挡之事，保留俗语本体；同段现代人物语录不收。"),
  qp("003.", 33, "烈士肝肠名士胆，杀人手段救人心", "近代诗联", "清人彭玉麟自谓语", "李敖引彭玉麟诗联说明刚烈手段与救人之心并存，保留诗联本体。"),
  qp("003.", 33, "金刚怒目", "佛教成语", "佛教语汇", "李敖用金刚怒目写外在刚猛，保留佛教成语本体。"),
  qp("003.", 33, "菩萨低眉", "佛教成语", "佛教语汇", "李敖用菩萨低眉写内在慈悲，保留佛教成语本体。"),
  qp("003.", 59, "横眉冷对千夫指", "现代诗句", "鲁迅《自嘲》", "访谈中引鲁迅横眉冷对千夫指一语作文学类比，保留诗句本体。"),
  qp("003.", 85, "靖康耻，犹未雪，臣子恨，何时灭", "宋词名句", "岳飞《满江红》", "李敖谈《北京法源寺》背景时引岳飞词句，保留词句本体。"),
  q("003.", 137, "听讼，吾犹人也，必也使无讼乎", "论语成句", "《论语·颜渊》", "李敖引孔子听讼一语后加以戏谑改写，保留原典成句。"),
  q("003.", 137, "以牙还牙，以眼还眼", "外来格言译句", "犹太/圣经典故", "李敖用以牙还牙、以眼还眼说明报复观念，保留格言本体。"),
  q("003.", 137, "忘恩负义", "中文成语", "传统成语", "李敖使用忘恩负义，保留成语本体。"),
  q("003.", 137, "有仇报仇，有恩报恩", "中文俗语", "中文俗语", "李敖用有仇报仇、有恩报恩概括恩仇观，保存俗语本体。"),
  q("003.", 149, "我的一部分跟你死掉了", "外文诗句译句", "坦塔雅那诗句", "李敖引西班牙籍美国人坦塔雅那诗句，写亲密者逝去后自身一部分也随之死去。"),
  q("003.", 185, "请你不要挡住我的阳光。", "西方哲学故事名句", "狄亚杰尼斯故事", "李敖转述狄亚杰尼斯对亚历山大大帝说的话，保留故事名句。"),
  q("003.", 185, "如果我不是皇帝，我希望我是狄亚杰尼斯。", "西方哲学故事名句", "亚历山大大帝与狄亚杰尼斯故事", "李敖转述亚历山大辞别后的赞叹，保留故事名句。"),

  q("004.", 21, "亡羊补牢", "中文成语", "《战国策》相关成语", "李敖在谈司法改革时用亡羊补牢，保留成语本体；制度主张不收。"),

  q("005.", 13, "夜郎自大", "中文成语", "《史记》相关成语", "李敖用夜郎自大形容自高自大，保留成语本体；同段国际法政治判断不收。"),
  q("005.", 13, "关门自大", "中文俗语", "中文俗语", "李敖用关门自大补充夜郎自大之意，保留俗语本体。"),
  q("005.", 13, "瘪十", "牌戏俗语", "天九牌俗语", "李敖以天九牌中的瘪十作比喻，保存俗语本体；同段法统判断不收。"),

  q("006.", 21, "瓜田李下", "中文成语", "古乐府相关成语", "李敖引瓜田李下之嫌，保留避嫌成语本体；同段国家利益讨论不收。"),
  q("006.", 23, "百尺竿头", "佛教成语", "景德传灯录相关成语", "李敖用百尺竿头说明还要继续推进，保留成语本体。"),

  q("007.", 21, "现身说法", "佛教成语", "佛教语汇", "李敖在演讲中用现身说法说明以自身经历示范，保留成语本体。"),

  q("009.", 5, "口口声声", "中文成语", "传统成语", "李敖用口口声声形容反复声称，保留成语本体；同段政党攻防不收。"),
  q("009.", 5, "西瓜靠大边", "中文俗语", "中文俗语", "李敖使用西瓜靠大边形容趋附强势一边，保留俗语本体。"),
  q("009.", 13, "卑躬屈膝", "中文成语", "传统成语", "李敖用卑躬屈膝形容姿态低下，保留成语本体。"),
  q(
    "009.",
    15,
    "我不恨你对我说谎话，可是我恨你对我说粗糙的谎话",
    "外文格言译句",
    "英国巴克洛",
    "李敖引英国巴克洛语，指出粗糙谎言比谎言本身更令人反感；同段候选人批评不收。",
  ),
  q("009.", 15, "牛头不对马嘴", "中文俗语", "中文俗语", "李敖用牛头不对马嘴形容内容错乱不合，保留俗语本体。"),
  q("009.", 23, "光芒万丈", "中文成语", "传统成语", "李敖用光芒万丈形容声势光彩，保留成语本体；同段人物政治评价不收。"),
  q(
    "009.",
    25,
    "你们的实验精神是好的，可是判断能力太坏了",
    "故事格言",
    "教授训练判断力故事",
    "李敖转述教授训练学生判断力的故事结语，保留其可独立作为判断力格言的句子。",
  ),

  q("010.", 3, "特立独行", "中文成语", "传统成语", "简介中用特立独行形容李敖，保留成语本体。"),
  q("010.", 7, "泪尽胡尘里", "宋诗名句", "陆游《秋夜将晓出篱门迎凉有感二首》", "简介中引泪尽胡尘里写遗民之感，保留诗句本体。"),
  q("010.", 49, "不二法门", "佛教成语", "佛教语汇", "简介中用不二法门说明唯一途径，保留佛教成语本体；同段现实政治处境不收。"),
  q("010.", 49, "重温旧梦就是破坏旧梦", "李敖格言", "李敖语", "简介引李敖重温旧梦就是破坏旧梦一语，保存非政治人生感慨。"),
  q("010.", 51, "没有先知在自己乡土上被接受", "圣经格言译句", "耶稣语录相关译句", "简介转述耶稣没有先知在自己乡土上被接受一语，保留宗教格言译句。"),
  q("010.", 51, "过眼烟云", "中文成语", "传统成语", "简介中用过眼烟云写得失终将过去，保留成语本体。"),
  q("010.", 51, "无何有之乡", "庄子成语", "《庄子》相关成句", "简介中用无何有之乡写终极定位，保留庄子成句。"),
  q("010.", 51, "广漠之野", "庄子成语", "《庄子》相关成句", "简介中用广漠之野写终极定位，保留庄子成句。"),
  q("010.", 57, "义无反顾", "中文成语", "传统成语", "报道中用义无反顾写行动坚定，保留成语本体；竞选报道内容不收。"),
  q("010.", 57, "勇往直前", "中文成语", "传统成语", "报道中用勇往直前写行动不退，保留成语本体；竞选报道内容不收。"),
  q("010.", 57, "直言不讳", "中文成语", "传统成语", "报道中用直言不讳形容言说直接，保留成语本体。"),
  q("010.", 65, "首当其冲", "中文成语", "传统成语", "简介中用首当其冲写首先受到冲击，保留成语本体；同段政治对象不收。"),
  q("010.", 65, "史所罕见", "中文成语", "传统成语", "简介中用史所罕见形容少见，保留成语本体。"),
  q("010.", 65, "乡愿", "论语成语", "《论语》相关语汇", "简介中用乡愿指无是非的好好先生，保留儒家语汇本体。"),
  q("010.", 65, "虽千万人，吾往矣", "孟子成句", "《孟子·公孙丑上》", "简介中引虽千万人吾往矣，写无惧孤立的气魄，保留孟子成句。"),
  q("010.", 65, "独行其是", "中文成语", "传统成语", "简介中用独行其是写依自我判断行事，保留成语本体。"),
  q("010.", 65, "东征西讨", "中文成语", "传统成语", "简介中用东征西讨形容四处出击，保留成语本体。"),
  q("010.", 67, "扶弱抑强", "中文成语", "传统成语", "简介中用扶弱抑强写扶助弱者、压制强者，保留成语本体。"),
  q("010.", 67, "霹雳手段，菩萨心肠", "中文格言", "中文俗成格言", "简介中用霹雳手段、菩萨心肠概括行事风格，保留格言本体。"),
  q("010.", 67, "侠骨柔情", "中文成语", "传统成语", "简介中用侠骨柔情写刚侠而多情，保留成语本体。"),
  q("010.", 67, "黑白分明", "中文成语", "传统成语", "简介中用黑白分明写是非清楚，保留成语本体。"),
];

const modernPoliticalTerms = [
  "一国两制",
  "一个中国",
  "两国论",
  "台湾",
  "大陆",
  "中国",
  "中华民国",
  "中华人民共和国",
  "国民党",
  "共产党",
  "民进党",
  "新党",
  "总统",
  "候选人",
  "选举",
  "参选",
  "政党",
  "政府",
  "政治",
  "国家",
  "主权",
  "统一",
  "独立",
  "台独",
  "两岸",
  "宪法",
  "联合国",
  "邓小平",
  "李登辉",
  "陈水扁",
  "宋楚瑜",
  "连战",
  "孙中山",
  "蒋介石",
  "蒋经国",
  "政见",
  "司法不公",
];

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
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
    source_file: "002.“出卖台湾，买回大陆！”.txt",
    reason: "正文围绕现代政治口号和两岸主张；校对轮仅保留明言为古人说的庄子成句，其余政治主张不收。",
  },
  {
    source_file: "008.邓小平论“一国两制”.txt",
    reason: "正文集中引用邓小平等现代政治论述，即便含实事求是等成语，也按政治语录排除。",
  },
  {
    source_file: "010.诺贝尔文学奖候选人李敖简介.txt:69-79",
    reason: "戴布兹阶级/监狱格言虽有格言形态，但社会政治色彩较重，首轮从严不收。",
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
