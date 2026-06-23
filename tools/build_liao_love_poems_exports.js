const fs = require("fs");
const path = require("path");

const book = "李敖的情诗";
const idPrefix = "LALQS";
const generatedDate = "2026-06-20";
const outDir = "exports";
const analysisDir = "analysis";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "005.诗集语录类",
  "002.李敖的情诗",
);

const sourceDecoder = new TextDecoder("gb18030");
const lineCache = new Map();

function readLines(file) {
  if (!lineCache.has(file)) {
    const sourcePath = path.join(process.cwd(), sourceDir, file);
    lineCache.set(file, sourceDecoder.decode(fs.readFileSync(sourcePath)).split(/\r?\n/));
  }
  return lineCache.get(file);
}

function chapterFromFile(file) {
  return file.replace(/^\d+\./, "").replace(/\.txt$/, "");
}

function quoteFromLines(file, lineStart, lineEnd) {
  return readLines(file)
    .slice(lineStart - 1, lineEnd)
    .map((line) => line.replace(/^[\s　]+/, "").replace(/\s+$/, ""))
    .filter(Boolean)
    .join("\n")
    .trim();
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function row(file, lineStart, lineEnd, quoteText, category, sourceOrigin, summary, notes = "") {
  return {
    id: "",
    book,
    chapter: chapterFromFile(file),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrigin,
    summary,
    notes,
  };
}

function lineRow(file, lineStart, lineEnd, category, sourceOrigin, summary, notes = "") {
  return row(
    file,
    lineStart,
    lineEnd,
    quoteFromLines(file, lineStart, lineEnd),
    category,
    sourceOrigin,
    summary,
    notes,
  );
}

const data = [
  row(
    "001.《三情之书》序.txt",
    23,
    23,
    "爱情是盲目的",
    "爱情格言",
    "西方爱情俗语，原书以丘比特传说说明",
    "序文引用 Love is blind 的中文说法，作为要反驳的传统爱情格言。",
  ),
  lineRow(
    "001.《三情之书》序.txt",
    31,
    33,
    "现代格言",
    "胡适题扇语",
    "胡适给朋友写扇面的两句爱情格言。",
  ),
  lineRow(
    "001.《三情之书》序.txt",
    37,
    43,
    "西方诗歌译文",
    "未详外国诗人爱情诗译句",
    "序文用外国诗人的诗句说明爱情之甜不应被说成痛苦。",
  ),
  lineRow(
    "001.《三情之书》序.txt",
    45,
    51,
    "西方诗歌",
    "未详外国诗人爱情诗原文",
    "与前条中文译句对应的英文原诗。",
  ),
  lineRow(
    "001.《三情之书》序.txt",
    61,
    63,
    "西方诗歌句",
    "勃朗宁《Rabbi Ben Ezra》诗句",
    "序文引用中英对照诗句，说明灵与肉同等相助。",
  ),
  lineRow(
    "001.《三情之书》序.txt",
    71,
    73,
    "西方诗歌译文",
    "迈克尔·德雷顿《Idea》第61首译句",
    "序文引用外国诗句说明爱情变化时应洒脱分手。",
  ),
  lineRow(
    "001.《三情之书》序.txt",
    75,
    77,
    "西方诗歌",
    "迈克尔·德雷顿《Idea》第61首原句",
    "与前条中文译句对应的英文原句。",
  ),
  row(
    "010.寿诗.txt",
    29,
    29,
    "凡能做打油诗的，才可以做好诗。",
    "文学格言",
    "胡适回信",
    "胡适回信中谈打油诗与白话诗的诗论格言。",
  ),
  row(
    "010.寿诗.txt",
    57,
    57,
    "人生七十古来稀",
    "古典诗句",
    "杜甫《曲江》诗句",
    "李敖寿诗中直接引用杜甫名句。",
  ),
  row(
    "010.寿诗.txt",
    65,
    65,
    "一生梦想大光明",
    "现代人物诗句",
    "胡适相关语句，原书未注出处",
    "寿诗中以引号标出的胡适相关句。",
    "出处待校对轮核实；非政治语录。",
  ),
  row(
    "010.寿诗.txt",
    119,
    119,
    "福不唐捐",
    "佛教成句",
    "佛教成语，亦为胡适常用语",
    "寿诗引用的非政治性佛教成句。",
  ),
  row(
    "010.寿诗.txt",
    125,
    125,
    "公自平生怀直气",
    "古典诗句",
    "王阳明诗句",
    "原书明注为王阳明诗。",
  ),
  row(
    "010.寿诗.txt",
    125,
    125,
    "七十老翁何所求",
    "古典诗句",
    "原书与王阳明诗句并引，具体出处未详",
    "寿诗中与王阳明诗句并列的古典寿诗句。",
    "出处待校对轮核实。",
  ),
  row(
    "010.寿诗.txt",
    165,
    165,
    "现在好像翻了船",
    "外国文学名言",
    "挪威文豪名言，原书未注作者",
    "寿诗中明称为挪威文豪名言。",
  ),
  row(
    "013.老子歌·老子二歌.txt",
    75,
    75,
    "江河万古流",
    "古典诗句",
    "杜甫《戏为六绝句》诗句",
    "李敖自作诗中以引号引用杜甫诗句。",
  ),
  lineRow(
    "018.死别.txt",
    3,
    17,
    "西方诗歌意译",
    "李敖意译豪斯曼（A. E. Housman）小诗",
    "正文首列中英对照诗句；后记说明为李敖意译豪斯曼小诗。",
  ),
  row(
    "018.死别.txt",
    13,
    13,
    "慰情聊胜无",
    "古典诗句化用",
    "陶渊明诗句改写",
    "原书按语明说此句改写陶渊明诗句。",
  ),
  lineRow(
    "018.死别.txt",
    57,
    63,
    "西方诗歌译文",
    "李敖改译汤普森（Francis Thompson）四行诗",
    "《红玫瑰》中翻出旧札记里早年改译的汤普森诗句。",
  ),
  row(
    "018.死别.txt",
    69,
    69,
    "有情来下种，因地果还生",
    "佛经偈句",
    "佛经引语",
    "文中主人引用佛经偈句说明因地果还生。",
  ),
  lineRow(
    "018.死别.txt",
    89,
    91,
    "现代诗句",
    "未详女诗人絮语",
    "文中称偶然记起女诗人的絮语，内容为关于时光的两句诗。",
  ),
  row(
    "018.死别.txt",
    97,
    97,
    "真正的恋爱时节",
    "外国文学语句",
    "歌德语",
    "文中引用歌德关于五月是恋爱时节的说法。",
  ),
  lineRow(
    "022.译桑塔耶那的情诗.txt",
    3,
    27,
    "西方诗歌译文",
    "李敖译桑塔耶那（George Santayana）情诗",
    "本篇开头列出的李敖中文译诗。",
  ),
  lineRow(
    "022.译桑塔耶那的情诗.txt",
    29,
    55,
    "西方诗歌",
    "桑塔耶那（George Santayana）情诗原文",
    "与李敖译文对应的英文原诗。",
  ),
  lineRow(
    "022.译桑塔耶那的情诗.txt",
    61,
    87,
    "西方诗歌译文",
    "余光中译桑塔耶那情诗",
    "附录中列出的余光中译文。",
  ),
  row(
    "022.译桑塔耶那的情诗.txt",
    105,
    105,
    "东飞伯劳西飞燕",
    "古典诗句",
    "古乐府《东飞伯劳歌》诗句",
    "信中引用“东飞伯劳西飞燕”写旧友离散。",
  ),
  row(
    "022.译桑塔耶那的情诗.txt",
    127,
    127,
    "吾意久怀忿，汝岂得自由！",
    "古典诗句",
    "汉乐府《孔雀东南飞》",
    "文中明引《孔雀东南飞》中凶婆婆对媳妇所说的话。",
  ),
  row(
    "022.译桑塔耶那的情诗.txt",
    127,
    127,
    "久在樊笼里，不能返自然",
    "古典诗句化用",
    "改写陶渊明《归园田居》诗句",
    "原书明说是改写陶渊明的一句诗。",
  ),
  row(
    "022.译桑塔耶那的情诗.txt",
    151,
    151,
    "朝闻‘道’，夕死可矣！",
    "儒家成句",
    "《论语·里仁》",
    "文中借《论语》名句说明晚悟。",
  ),
  row(
    "022.译桑塔耶那的情诗.txt",
    151,
    151,
    "觉今是而昨非",
    "古典文句",
    "陶渊明《归去来兮辞》",
    "文中引用陶渊明文句说明晚年觉悟。",
  ),
  row(
    "022.译桑塔耶那的情诗.txt",
    153,
    153,
    "无可无不可",
    "儒家成句",
    "《论语·微子》",
    "信中用《论语》成句形容虚无情绪。",
  ),
  lineRow(
    "048.四月之死.txt",
    3,
    17,
    "西方诗歌改作",
    "李敖改作莎拉·替滋代尔（Sara Teasdale）《I Shall Not Care》",
    "正文诗为李敖据 Teasdale 原诗改作。",
  ),
  lineRow(
    "048.四月之死.txt",
    21,
    33,
    "西方诗歌",
    "莎拉·替滋代尔（Sara Teasdale）《I Shall Not Care》原诗",
    "《四月之死》后附英文原诗。",
  ),
  row(
    "055.如影随形.txt",
    9,
    9,
    "对影成三人！",
    "古典诗句",
    "李白《月下独酌》诗句",
    "李敖短诗中直接引用李白诗句。",
  ),
  lineRow(
    "074.集句.txt",
    3,
    9,
    "古典集句",
    "古典诗句集成，原书未逐句标出处",
    "原书题作《集句》，四句均按外部古典诗句处理。",
    "逐句出处可在校对轮细化。",
  ),
  lineRow(
    "090.情诗集句.txt",
    3,
    9,
    "古典集句",
    "古典情诗句集成，原书未逐句标出处",
    "原书题作《情诗集句》，含“天涯何处无芳草”等旧句。",
    "逐句出处可在校对轮细化。",
  ),
  lineRow(
    "119.集句三绝.txt",
    3,
    25,
    "古典集句",
    "司空曙、张籍、王勃、卢纶、曹丕、杜牧、李商隐、刘长卿、孟浩然、崔涂、韦应物、王维诗句集成",
    "原书逐句标出作者的三首集句绝句。",
  ),
];

data.forEach((record, index) => {
  record.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

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

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const csvLines = [
  columns.join(","),
  ...data.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
];
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push(`《${book}》诗文格言歌谣引用`);
txt.push(`生成日期：${generatedDate}`);
txt.push(`记录数：${data.length}`);
txt.push("");
txt.push("口径说明：");
txt.push("- 本书为诗集语录类，李敖自作情诗不整首收入。");
txt.push("- 保留外部诗文、译诗、原诗、集句、明确古典成句与非政治文学格言。");
txt.push("- 排除政治/法律/党派/政权语录、新闻叙述、私人来信对白、普通短词碎片和无明确外部出处的李敖自作诗。");
txt.push("");

let currentChapter = "";
for (const record of data) {
  if (record.chapter !== currentChapter) {
    currentChapter = record.chapter;
    txt.push(`## ${currentChapter}`);
  }
  txt.push(`${record.id}｜${record.category}｜${record.source_file}:${record.line_start}-${record.line_end}`);
  txt.push(`引用：${record.quote_text}`);
  txt.push(`出处线索：${record.source_or_origin}`);
  txt.push(`摘要：${record.summary}`);
  if (record.notes) txt.push(`备注：${record.notes}`);
  txt.push("");
}

const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
fs.writeFileSync(txtPath, `\uFEFF${txt.join("\r\n")}\r\n`, "utf8");

const excludedExamples = [
  "001.《三情之书》序.txt:15 的情杀新闻摘录属于新闻叙述，未收。",
  "007-008 爱情军师相关私人信件与李敖戏作诗，除非有明确外部诗文来源，否则未收。",
  "009.民国乐府贺新汉居士悬弧大庆.txt 中的生日戏谑、性玩笑、双关和“反共义士”等语境未收。",
  "010.寿诗.txt 中涉及政治、组党、国家救亡等寿诗句未收；短语“努力向上跑”因证据过弱在校对轮删除。",
  "013、016 中李敖自作诗里的弱化用不收，只保留明确引号或原说明的外部诗文句。",
  "022.译桑塔耶那的情诗.txt:97 的查禁罪状、国父遗教、民心士气等政治/法律语录未收。",
  "022.译桑塔耶那的情诗.txt 中大量私人信件、婆媳分析、婚姻判断和现代心理分析语未收。",
  "050.无所逃.txt 的死亡消息、060.“好吧！”的对白等私人叙事未收。",
  "072-118 多数中学旧作和短诗为李敖自作，未因标题或诗体本身收入。",
];

const proofreadAuditRows = [
  {
    decision: "delete",
    old_id: "LALQS-011",
    source_file: "010.寿诗.txt",
    line_range: "95-95",
    quote_text: "努力向上跑",
    reason: "短语过短且出处未明，夹在李敖自作寿诗中，校对轮删除。",
  },
  {
    decision: "delete",
    old_id: "LALQS-016",
    source_file: "013.老子歌·老子二歌.txt",
    line_range: "25-25",
    quote_text: "匹夫当为百世师",
    reason: "自作诗内化用苏轼语意但非原句，未明示引用，校对轮删除。",
  },
  {
    decision: "delete",
    old_id: "LALQS-018",
    source_file: "016.日历与往事.txt",
    line_range: "13-13",
    quote_text: "泪眼莫问花！",
    reason: "李敖自作句化用欧阳修词意，不是外部原句，校对轮删除。",
  },
  {
    decision: "fix",
    old_id: "LALQS-005",
    source_file: "001.《三情之书》序.txt",
    line_range: "61-63",
    quote_text: "……Nor soul helps flesh more，now than flesh helps soul．",
    reason: "来源说明由未详外国诗人校正为勃朗宁《Rabbi Ben Ezra》。",
  },
  {
    decision: "fix",
    old_id: "LALQS-006/LALQS-007",
    source_file: "001.《三情之书》序.txt",
    line_range: "71-77",
    quote_text: "Since theers's no help / Come let us kiss and part．",
    reason: "来源说明由外国诗人校正为迈克尔·德雷顿《Idea》第61首。",
  },
  {
    decision: "fix",
    old_id: "LALQS-033",
    source_file: "022.译桑塔耶那的情诗.txt",
    line_range: "153-153",
    quote_text: "无可无不可",
    reason: "来源说明由传统成句校正为《论语·微子》。",
  },
  {
    decision: "keep",
    old_id: "LALQS-010",
    source_file: "010.寿诗.txt",
    line_range: "65-65",
    quote_text: "一生梦想大光明",
    reason: "虽原书未注出处，但以引号标为胡适相关诗文句，非政治语录，暂保留待后续查证。",
  },
  {
    decision: "keep",
    old_id: "LALQS-014",
    source_file: "010.寿诗.txt",
    line_range: "125-125",
    quote_text: "七十老翁何所求",
    reason: "与原文明注王阳明诗句并引，按古典寿诗句暂保留待后续查证。",
  },
  {
    decision: "keep",
    old_id: "LALQS-037/LALQS-038",
    source_file: "074.集句.txt; 090.情诗集句.txt",
    line_range: "3-9",
    quote_text: "两首未逐句标出处的集句",
    reason: "题名明确为集句，校对轮保持整首记录，不拆分逐句。",
  },
];

const report = [];
report.push(`《${book}》抽取与校对报告`);
report.push(`生成日期：${generatedDate}`);
report.push(`输出：${csvPath}`);
report.push(`输出：${txtPath}`);
report.push(`记录数：${data.length}`);
report.push("");
report.push("分类统计：");
const categoryCounts = new Map();
for (const record of data) {
  categoryCounts.set(record.category, (categoryCounts.get(record.category) ?? 0) + 1);
}
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])) {
  report.push(`- ${category}: ${count}`);
}
report.push("");
report.push("本轮特别排除：");
for (const item of excludedExamples) report.push(`- ${item}`);
report.push("");
report.push("校对轮处理：");
for (const item of proofreadAuditRows) {
  report.push(
    `- ${item.decision}｜${item.old_id}｜${item.source_file}:${item.line_range}｜${item.quote_text}｜${item.reason}`,
  );
}
report.push("");
report.push("后续校对重点：");
report.push("- “一生梦想大光明”“七十老翁何所求”仍可在后续轮次继续查证，必要时删除或补准来源。");
report.push("- 074、090 两首未逐句标出处的集句，本轮保持整首；若后续需要精细来源，可再拆分逐句。");
report.push("- 桑塔耶那诗在《爱情的秘密》中也出现过，本轮按本书来源保留；总表若需去重可另做跨书处理。");

const reportPath = path.join(analysisDir, "liao_love_poems_initial_report.txt");
fs.writeFileSync(reportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");

const proofreadReportPath = path.join(analysisDir, "liao_love_poems_proofread_report.txt");
fs.writeFileSync(proofreadReportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");

const proofreadAuditPath = path.join(analysisDir, "liao_love_poems_proofread_audit.tsv");
const auditColumns = ["decision", "old_id", "source_file", "line_range", "quote_text", "reason"];
const auditLines = [
  auditColumns.join("\t"),
  ...proofreadAuditRows.map((record) =>
    auditColumns
      .map((column) => String(record[column] ?? "").replace(/\t/g, " ").replace(/\r?\n/g, "\\n"))
      .join("\t"),
  ),
];
fs.writeFileSync(proofreadAuditPath, `\uFEFF${auditLines.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      records: data.length,
      csvPath,
      txtPath,
      reportPath,
      proofreadReportPath,
      proofreadAuditPath,
    },
    null,
    2,
  ),
);
