const fs = require("fs");
const path = require("path");

const book = "笑傲六十年·有话说李敖";
const idPrefix = "LAXA60";
const generatedDate = "2026-06-24";
const sourceDir = path.join("《大李敖全集6.0》分章节", "010.节目演讲类", "010.笑傲六十年·有话说李敖");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_xiaoao_60_youhua_quote_candidates.json");
const reviewTsv = path.join("analysis", "liao_xiaoao_60_youhua_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_xiaoao_60_youhua_attributed_lines.tsv");
const auditTsv = path.join("analysis", "liao_xiaoao_60_youhua_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_xiaoao_60_youhua_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_xiaoao_60_youhua_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_xiaoao_60_youhua_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => /^\d{3}\..+\.txt$/.test(name))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceCache = new Map();
for (const file of files) {
  const fullPath = path.join(sourceDir, file);
  const text = sourceDecoder.decode(fs.readFileSync(fullPath));
  sourceCache.set(file, {
    text,
    lines: text.split(/\r?\n/),
  });
}

function sourceFile(prefix) {
  const found = files.find((file) => file.startsWith(prefix));
  if (!found) throw new Error(`Source file not found for prefix: ${prefix}`);
  return found;
}

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[“”‘’"'【】]/g, "")
    .replace(/\s+/g, "");
}

function normalizeForSourceCheck(text) {
  return normalizeText(text).replace(/（[^）]*）/g, "");
}

function q(filePrefix, lineStart, quoteText, category, attributedTo, note, lineEnd = lineStart, extraNotes = "") {
  const file = sourceFile(filePrefix);
  const notes = [
    "首轮保守收入：本书政治经历、选举、党派、军购与两岸时政叙述密集；仅收句子本体可独立成立的诗、对联、古典/现代文句、俗语和非政治格言。",
    extraNotes,
  ].filter(Boolean).join(" ");
  return {
    id: "",
    book,
    chapter: file.replace(/^\d+\./, "").replace(/\.txt$/, ""),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: attributedTo,
    summary: note,
    notes,
  };
}

const proofreadAddNote = "校对轮补入：回扫源文后确认句子本体属于非政治文论、俗语、文学句、传统观念或李敖个人生活格言。";
const proofreadBeforeRows = 21;
const proofreadRemovedRows = [
  [
    "LAXA60-013",
    "我不是旁观者，而是见证人；不是同死者，而是送葬人；不是参与者，而是介错人。",
    "政治历史语境中的自我角色定位，虽有排比文句形式，但更接近政治语录，校对轮删除。",
  ],
];
const proofreadChangedRows = [];

const rawRows = [
  q(
    "001.",
    19,
    "六十年前谁识我，六十年后我识谁，信知老屋终作土，捧得凄凉片瓦回",
    "李敖诗",
    "李敖题片瓦诗",
    "李敖重回台中老宅时写在片瓦上的诗。"
  ),
  q(
    "001.",
    55,
    "好花应折，因为花会老。莫等盛开，折花要趁早。春天应寻，因为春会老。莫等冬去，才把春天找。爱情应断，因为情会老。劳燕先飞，是为两人好。",
    "李敖诗",
    "李敖《情老》",
    "李敖讲述旧日恋情时朗读自作诗。"
  ),

  q(
    "002.",
    5,
    "用他听得懂的话，你只得到他的脑；用他说得出的话，你才得到他的心。",
    "李敖格言",
    "李敖定律",
    "李敖说明带兵和沟通方法时提出的定律。"
  ),
  q(
    "002.",
    25,
    "老兵永远不死，他是一个苦神。他一生水来火去，轮不到一抔土坟。他无人代办后事，也无心回首前尘，他输光全部历史，也丢掉所有亲人。他没有今天夜里，也没有明天早晨，更没有勋章可挂，只有着满身弹痕。",
    "李敖诗",
    "李敖《老兵》",
    "李敖谈老兵处境时引用自作诗。"
  ),
  q(
    "002.",
    55,
    "蛟龙得云雨，终非池中物",
    "古典文句",
    "三国典故",
    "李敖讲《文星》成为踏板时引用的古典句子；同章后文重复处不另收。"
  ),
  q(
    "002.",
    61,
    "春去人犹在，车站证此身，不见徐复观，只见徐武军",
    "李敖诗",
    "李敖自作诗",
    "李敖讲徐复观父子与台中车站时引用自作诗。"
  ),

  q(
    "003.",
    25,
    "交友以自大其身，求士以求此身之不朽",
    "清人格言",
    "李恕谷语",
    "李敖讲胡适爱引李恕谷语时引用。"
  ),

  q(
    "004.",
    19,
    "五十年来和五百年内，中国人写白话文的前三名是李敖，李敖，李敖，嘴巴上骂我吹牛的人，心里都为我供了牌位",
    "李敖格言",
    "李敖自评",
    "李敖解释自己白话文自评中的文法和效果。"
  ),

  q(
    "005.",
    71,
    "妻太聪明夫太怪，人何寥落鬼何多",
    "清代对联",
    "清人对联",
    "李敖谈太太和家庭时引用清人对联。"
  ),
  q(
    "005.",
    83,
    "慷慨歌燕市，从容做楚囚；引刀成一快，不负少年头",
    "近代诗句",
    "汪精卫诗",
    "李敖说明自己改写手术对联时先引汪精卫原诗。"
  ),
  q(
    "005.",
    83,
    "引刀成一快，人心大快，仇者先快，亲者后快；不负少年头，浪子回头，为了大头，苦了小头。",
    "李敖改联",
    "李敖改汪精卫诗",
    "李敖谈摄护腺手术时改写汪精卫诗成对联。"
  ),
  q(
    "005.",
    103,
    "长寿的秘诀是慎重选择父母；结婚的秘诀是慎重选择前妻",
    "李敖格言",
    "李敖名言",
    "李敖谈家庭照片时引用自己的幽默名言。"
  ),

  q(
    "006.",
    3,
    "我不是旁观者，而是见证人；不是同死者，而是送葬人；不是参与者，而是介错人。",
    "李敖文句",
    "李敖自我定位",
    "李敖说明自己六十年来在台湾的角色时提出的排比句。"
  ),
  q(
    "006.",
    13,
    "相逢一笑泯恩仇",
    "现代诗句",
    "鲁迅诗句",
    "李敖讨论鲁迅与和解话题时引用。"
  ),
  q(
    "006.",
    20,
    "不信青春唤不回，不容青史尽成灰",
    "近代诗句",
    "于右任诗",
    "李敖谈历史记录时引用于右任诗句；同段政治口号不收入。"
  ),
  q(
    "006.",
    22,
    "不必有惊天号角，不必有动地鼓鼙。无声中，我们作战，在泥里，一片春泥。哪怕是好花堕水，哪怕是落红成离。只相信此心一念，一念里多少凄迷。明知你——你将远走，明知我——我志不移，明知他——灰飞烟灭，也要下这盘残棋。",
    "李敖诗",
    "李敖《残棋》",
    "李敖讲刘会云离去后所写的自作诗。"
  ),
  q(
    "006.",
    32,
    "当目标远在天边的时候，过程对我们就更重要了；目的远在天边的时候，手段对我们就更重要了。",
    "李敖格言",
    "李敖过程论",
    "李敖谈目标、过程与手段时提出的格言。"
  ),
  q(
    "006.",
    34,
    "没有人能自全，没有人是孤岛，每人都是大陆的一片，要为本土应卯。哪便是一块土地，哪便是一方海角，哪便是一座庄园，不论是你的，还是朋友的。一旦海水冲走，欧洲就要变小，任何人的死亡，都是我的减少，做为人类的一员，我与生灵共老，丧钟在为谁敲，我本茫然不晓，不为幽明永隔，它正为你哀悼。",
    "外国诗译文",
    "约翰·多恩诗，李敖译",
    "李敖在牢中翻译约翰·多恩诗时的押韵译文。"
  ),
  q(
    "006.",
    34,
    "没有人是一个岛，自给自足；每个人都是大陆的一部分，整体的一片段。如果一块土地被冲走，正如冲走了你朋友的田庄或是你自己的田庄，不论谁死了，我都受损，因为我和人类息息相关。",
    "外国诗译文",
    "约翰·多恩诗，余光中译",
    "李敖为比较翻译高下而引用余光中译文。"
  ),
  q(
    "006.",
    46,
    "远路不须愁日暮，老年终自望河清",
    "明末清初诗句",
    "顾炎武诗",
    "李敖讲刘长乐使其生还故国时引用顾炎武诗句。"
  ),
  q(
    "006.",
    58,
    "开万古得未曾有之奇，洪荒留此山川，作遗民世界\n极一生无可如何之遇，缺憾还诸天地，是创格完人",
    "清代对联",
    "沈葆桢题郑成功联",
    "李敖节目结尾展示沈葆桢题郑成功对联，并借以说明自己的处境。",
    60
  ),

  q(
    "001.",
    41,
    "婚丧喜庆都是一些无聊的动作",
    "李敖格言",
    "李敖生活观",
    "李敖谈纪念父亲和日常礼俗时提出的个人生活格言。",
    41,
    proofreadAddNote
  ),
  q(
    "004.",
    63,
    "肥水不落外人田",
    "传统俗语",
    "中国俗语",
    "李敖谈书被抢走时引用通行俗语作对照。",
    63,
    proofreadAddNote
  ),
  q(
    "004.",
    63,
    "水肥不落外人田",
    "李敖改俗语",
    "李敖改写俗语",
    "李敖把俗语倒置改写，用来调侃技术性错误。",
    63,
    proofreadAddNote
  ),
  q(
    "006.",
    13,
    "让他们怨恨去，我一个都不宽恕",
    "现代文句",
    "鲁迅遗嘱语",
    "李敖讨论鲁迅处世态度时引用鲁迅遗嘱中的句子。",
    13,
    proofreadAddNote
  ),
  q(
    "006.",
    38,
    "入乎其内，故有低迴；出于其外，故有高致",
    "现代文论句",
    "王国维《人间词话》语意",
    "李敖朗读《虚拟的十七岁》广告文时引用的文论句。",
    38,
    proofreadAddNote
  ),
  q(
    "006.",
    48,
    "梦里不知身是客",
    "五代词句",
    "李煜词句",
    "李敖讲李翰祥日记时引用的词句。",
    48,
    proofreadAddNote
  ),
  q(
    "006.",
    64,
    "立德立言立功",
    "传统观念",
    "中国三不朽观念",
    "李敖解释传统三不朽时引用。",
    64,
    proofreadAddNote
  ),
];

const numberedRows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));
const proofreadRemovedIds = new Set(proofreadRemovedRows.map(([id]) => id));
const rows = numberedRows.filter((row) => !proofreadRemovedIds.has(row.id));
const proofreadAddedRows = rows.filter(
  (row) => Number(row.id.replace(`${idPrefix}-`, "")) > proofreadBeforeRows,
);

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

function auditRows() {
  return rows.map((row) => {
    const source = sourceCache.get(row.source_file);
    const sourceText = source.lines.slice(row.line_start - 1, row.line_end).join("\n");
    const rangeHit =
      sourceText.includes(row.quote_text) ||
      normalizeForSourceCheck(sourceText).includes(normalizeForSourceCheck(row.quote_text));
    const fileHit =
      source.text.includes(row.quote_text) ||
      normalizeForSourceCheck(source.text).includes(normalizeForSourceCheck(row.quote_text));
    return {
      id: row.id,
      source_file: row.source_file,
      line_start: row.line_start,
      line_end: row.line_end,
      category: row.category,
      quote_len: Array.from(row.quote_text).length,
      range_hit: rangeHit ? "yes" : "no",
      file_hit: fileHit ? "yes" : "no",
      quote_text: row.quote_text.replace(/\r?\n/g, "\\n"),
    };
  });
}

const duplicateGroups = new Map();
for (const row of rows) {
  const key = normalizeText(row.quote_text);
  if (!duplicateGroups.has(key)) duplicateGroups.set(key, []);
  duplicateGroups.get(key).push(row.id);
}
const duplicateRows = [...duplicateGroups.values()].filter((ids) => ids.length > 1);

const politicalPattern = /总统|副总统|选举|军购|国民党|共产党|民进党|马英九|陈水扁|李登辉|蒋介石|军购|二炮|立法院|行政院|人权|党派|两岸|台独|反革命|革命不是|不自由毋宁死|Give me liberty/;
const politicalFlagged = rows.filter((row) => politicalPattern.test(row.quote_text));

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(candidatesJson), { recursive: true });

const csvLines = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
];
fs.writeFileSync(outCsv, csvLines.join("\n"), "utf8");

const txtLines = [];
txtLines.push(`《${book}》诗文格言歌谣引用`);
txtLines.push(`生成日期：${generatedDate}`);
txtLines.push(`条目数：${rows.length}`);
txtLines.push("");
for (const row of rows) {
  txtLines.push(`【${row.id}】${row.quote_text}`);
  txtLines.push(`出处：${row.book}｜${row.chapter}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  txtLines.push(`类别：${row.category}`);
  txtLines.push(`来源/归属：${row.source_or_origin}`);
  txtLines.push(`说明：${row.summary}`);
  txtLines.push(`备注：${row.notes}`);
  txtLines.push("");
}
fs.writeFileSync(outTxt, txtLines.join("\n"), "utf8");

fs.writeFileSync(candidatesJson, JSON.stringify(rows, null, 2), "utf8");

const audit = auditRows();
const auditColumns = [
  "id",
  "source_file",
  "line_start",
  "line_end",
  "category",
  "quote_len",
  "range_hit",
  "file_hit",
  "quote_text",
];
const auditLines = [
  auditColumns.join("\t"),
  ...audit.map((row) =>
    auditColumns.map((column) => String(row[column] ?? "").replace(/\t/g, " ")).join("\t"),
  ),
];
fs.writeFileSync(auditTsv, auditLines.join("\n"), "utf8");

const missing = audit.filter((row) => row.range_hit !== "yes" || row.file_hit !== "yes");
const categoryCounts = rows.reduce((acc, row) => {
  acc[row.category] = (acc[row.category] ?? 0) + 1;
  return acc;
}, {});
const chapterCounts = rows.reduce((acc, row) => {
  acc[row.chapter] = (acc[row.chapter] ?? 0) + 1;
  return acc;
}, {});

const report = [];
report.push(`《${book}》首轮/校对后抽取报告`);
report.push(`生成日期：${generatedDate}`);
report.push(`源目录：${sourceDir}`);
report.push(`正文文件数：${files.length}`);
report.push(`候选文件：${candidatesJson}`);
report.push(`复核候选：${reviewTsv}`);
report.push(`归属线索：${attributedTsv}`);
report.push("");
report.push(`首轮原始收入：${proofreadBeforeRows}`);
report.push(`校对删除：${proofreadRemovedRows.length}`);
report.push(`校对补入：${proofreadAddedRows.length}`);
report.push(`校对后写出：${rows.length}`);
report.push(`源文命中异常：${missing.length}`);
report.push(`重复文本组：${duplicateRows.length}`);
report.push(`政治语录命中：${politicalFlagged.length}`);
report.push("");
report.push("类别分布：");
for (const [category, count] of Object.entries(categoryCounts)) {
  report.push(`- ${category}: ${count}`);
}
report.push("");
report.push("章节分布：");
for (const [chapter, count] of Object.entries(chapterCounts)) {
  report.push(`- ${chapter}: ${count}`);
}
report.push("");
report.push("排除范围：");
report.push("- 选举、党派、军购、两岸时政判断、革命口号及人物政治评价不收入。");
report.push("- 同一古典句在同章重复出现时仅收解释较完整的一处。");
report.push("- 李敖自作诗、题句、翻译、对联和非政治格言保守收入。");
report.push("- 首轮政治历史自我定位类文句，校对轮按政治语录删除。");
if (missing.length > 0) {
  report.push("");
  report.push("源文命中异常：");
  for (const row of missing) report.push(`- ${row.id} ${row.source_file}:${row.line_start}-${row.line_end}`);
}
if (politicalFlagged.length > 0) {
  report.push("");
  report.push("政治语录疑似项：");
  for (const row of politicalFlagged) report.push(`- ${row.id} ${row.quote_text}`);
}
fs.writeFileSync(reportTxt, report.join("\n"), "utf8");

const proofreadAuditRows = [
  { action: "before", id: "", quote_text: "", reason: `校对前条目数：${proofreadBeforeRows}` },
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => ({
    action: "remove",
    id,
    quote_text: quoteText,
    reason,
  })),
  ...proofreadAddedRows.map((row) => ({
    action: "add",
    id: row.id,
    quote_text: row.quote_text.replace(/\r?\n/g, "\\n"),
    reason: row.summary,
  })),
  ...proofreadChangedRows.map(([id, quoteText, reason]) => ({
    action: "change",
    id,
    quote_text: quoteText,
    reason,
  })),
  { action: "after", id: "", quote_text: "", reason: `校对后条目数：${rows.length}` },
];
const proofreadAuditColumns = ["action", "id", "quote_text", "reason"];
fs.writeFileSync(
  proofreadAuditTsv,
  [
    proofreadAuditColumns.join("\t"),
    ...proofreadAuditRows.map((row) =>
      proofreadAuditColumns.map((column) => String(row[column] ?? "").replace(/\t/g, " ")).join("\t"),
    ),
  ].join("\n"),
  "utf8",
);

const proofreadReport = [
  `《${book}》校对轮报告`,
  `生成日期：${generatedDate}`,
  "",
  `校对前条目数：${proofreadBeforeRows}`,
  `删除条目数：${proofreadRemovedRows.length}`,
  `补入条目数：${proofreadAddedRows.length}`,
  `修改条目数：${proofreadChangedRows.length}`,
  `校对后条目数：${rows.length}`,
  "",
  "校对处理：",
  "- 删除一条政治历史语境中的自我角色定位，避免政治语录混入。",
  "- 回扫 6 章源文后，补入文论、俗语、鲁迅文句、李煜词句、三不朽观念和李敖生活格言。",
  "- 继续排除选举、党派、军购、两岸时政判断、革命口号和现代政治人物评价。",
  "",
  "删除明细：",
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => `- ${id}｜${quoteText}：${reason}`),
  "",
  "补入明细：",
  ...proofreadAddedRows.map((row) => `- ${row.id}｜${row.quote_text.replace(/\r?\n/g, " / ")}｜${row.source_file}:${row.line_start}-${row.line_end}`),
  "",
  `源文命中异常：${missing.length}`,
  `重复文本组：${duplicateRows.length}`,
  `政治语录命中：${politicalFlagged.length}`,
];
fs.writeFileSync(proofreadReportTxt, proofreadReport.join("\n"), "utf8");

console.log(
  JSON.stringify(
    {
      rows: rows.length,
      proofreadBeforeRows,
      proofreadAdded: proofreadAddedRows.length,
      proofreadRemoved: proofreadRemovedRows.length,
      missing: missing.length,
      duplicateRows: duplicateRows.length,
      politicalFlagged: politicalFlagged.length,
      outCsv,
      outTxt,
      auditTsv,
      reportTxt,
      proofreadAuditTsv,
      proofreadReportTxt,
    },
    null,
    2,
  ),
);
