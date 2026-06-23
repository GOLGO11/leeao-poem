const fs = require("fs");
const path = require("path");

const book = "李语录";
const idPrefix = "LALYL";
const generatedDate = "2026-06-20";
const outDir = "exports";
const analysisDir = "analysis";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "005.诗集语录类",
  "003.李语录",
);

function chapterFromFile(file) {
  return file.replace(/^\d+\./, "").replace(/\.txt$/, "");
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

const data = [
  row(
    "001.《李语录》一.txt",
    17,
    17,
    "舌下无英雄，笔底无奇士。",
    "文学格言",
    "韩孔厂语",
    "韩孔厂关于口舌与笔下人物的文学格言。",
  ),
  row(
    "001.《李语录》一.txt",
    21,
    21,
    "得固欣然，失亦可喜。",
    "传统成句",
    "传统得失成句，原书未注出处",
    "李敖用来说明得失心态的成句。",
  ),
  row(
    "003.《李语录》三.txt",
    5,
    5,
    "有所不为，而后可以有为。",
    "古典成句",
    "《孟子》“人有不为也，而后可以有为”语意",
    "对话中引用的儒家取舍成句。",
    "所在段落涉及时论判断，仅收古典成句本身。",
  ),
  row(
    "003.《李语录》三.txt",
    21,
    21,
    "成大事者不谋与众",
    "传统格言",
    "传统谋事格言，原书未注出处",
    "用来说明成事与众议关系的格言。",
  ),
  row(
    "004.《李语录》四.txt",
    13,
    13,
    "先天下之忧而忧。",
    "古典文句",
    "范仲淹《岳阳楼记》名句",
    "李敖引用范仲淹名句谈忧患意识。",
  ),
  row(
    "004.《李语录》四.txt",
    13,
    13,
    "环顾一身无可忧，忧必在于天下。",
    "古典诗文句",
    "王安石语，原书明注",
    "与范仲淹名句并引的王安石忧天下语。",
  ),
  row(
    "004.《李语录》四.txt",
    37,
    37,
    "（刘献廷）尝从容谓余曰：‘吾志若不就，他无所愿，但愿先子死耳。’予惊问故，曰：‘吾生平知己，舍子其谁？得子为吾传以传，复何恨哉？’",
    "古典文句",
    "王源《刘处士墓表》",
    "清人王源文中刘献廷托付传记的一段话。",
    "后接李敖自作谐拟不收。",
  ),
  row(
    "005.《李语录》五.txt",
    9,
    9,
    "莲生淤泥中，不与泥同调。",
    "古典诗句",
    "黄庭坚《赣上食莲有感》诗句",
    "李敖引用黄庭坚咏莲诗句自况。",
  ),
  row(
    "006.《李语录》六.txt",
    9,
    9,
    "好人多自苦中来",
    "传统格言",
    "曾国藩语，原书明注",
    "李敖引用曾国藩关于好人与苦境的格言。",
    "李敖改写为“臭中来”的部分不收。",
  ),
  row(
    "009.《李语录》九.txt",
    41,
    41,
    "好读书，不求甚解",
    "古典文句",
    "陶渊明《五柳先生传》名句",
    "李敖引用陶渊明读书语后加以戏拟。",
  ),
  row(
    "011.《李语录》十一.txt",
    21,
    21,
    "衣食足而知荣辱。",
    "古典文句",
    "《管子》名句",
    "李敖引用《管子》关于衣食与荣辱的名句。",
    "后面的政治化改写不收。",
  ),
  row(
    "013.《李语录》十三.txt",
    33,
    33,
    "不知为不知，是知也",
    "古典文句",
    "《论语》语意，原文明注孔子",
    "李敖引用孔子关于知与不知的名句。",
    "李敖所谓“正确翻译”不收。",
  ),
  row(
    "014.《李语录》十四.txt",
    5,
    5,
    "情人眼里出西施",
    "俗谚",
    "民间爱情俗谚",
    "李敖以民间俗谚开头，再接自作反转句。",
    "只补入俗谚本体，后半句“西施眼里出自己”不收。",
  ),
  row(
    "014.《李语录》十四.txt",
    17,
    17,
    "三个臭皮匠，胜过诸葛亮。",
    "俗谚",
    "民间俗谚",
    "以皮革业笑谈方式引用的民间俗谚。",
  ),
  row(
    "014.《李语录》十四.txt",
    37,
    37,
    "狼来了",
    "寓言成句",
    "伊索寓言“狼来了”故事成句",
    "用寓言成句说明重复示警后的失信。",
  ),
  row(
    "015.《李语录》十五.txt",
    37,
    37,
    "穷当益坚",
    "古典文句",
    "王勃《滕王阁序》名句",
    "李敖引用王勃名句并与自拟“富当益坚”对照。",
  ),
  row(
    "016.《李语录》十六.txt",
    17,
    17,
    "多行不义必自毙",
    "古典成句",
    "《左传》成句",
    "李敖引用春秋史传成句后提出反论。",
  ),
  row(
    "017.《李语录》十七.txt",
    33,
    33,
    "远亲不如近邻",
    "俗谚",
    "民间俗谚",
    "李敖引用民间俗谚后接自作发挥。",
  ),
  row(
    "017.《李语录》十七.txt",
    37,
    37,
    "天涯若比邻",
    "古典诗句",
    "王勃《送杜少府之任蜀州》诗句",
    "李敖借王勃名句与自作反转句相对。",
  ),
  row(
    "018.《李语录》十八.txt",
    25,
    25,
    "钻之弥坚",
    "古典文句",
    "《论语·子罕》语句",
    "李敖引用《论语》中形容圣人之道的成句。",
  ),
  row(
    "019.《李语录》十九.txt",
    25,
    25,
    "Snobs talk as if they had begotten their own ancestors.",
    "外国格言",
    "Herbert Agar 语",
    "李敖引用 Herbert Agar 关于势利者与祖先的英文格言。",
    "所在段落有时事评论，收录限于英文社会讽刺格言本身。",
  ),
  row(
    "024.《李语录》二四.txt",
    29,
    29,
    "He ain't heavy，he's my brother.",
    "歌词",
    "英文歌曲《He Ain't Heavy, He's My Brother》歌词",
    "李敖引用英文歌名/歌词并附中文义。",
  ),
  row(
    "025.《李语录》二五.txt",
    29,
    29,
    "君子报仇，十年不晚",
    "俗谚",
    "民间复仇俗谚",
    "李敖引用关于报仇时机的俗谚。",
  ),
  row(
    "030.《李语录》三十.txt",
    17,
    17,
    "穷当益坚",
    "古典文句",
    "王勃《滕王阁序》名句",
    "李敖再次引用王勃名句，并用谐音加以戏拟。",
  ),
  row(
    "030.《李语录》三十.txt",
    21,
    21,
    "君子不器",
    "古典文句",
    "《论语·为政》名句",
    "李敖引用《论语》成句并加以谐拟。",
  ),
  row(
    "030.《李语录》三十.txt",
    29,
    29,
    "坐而言不如起而行",
    "传统成句",
    "传统行动格言，原书未注出处",
    "李敖引用传统成句并接自作爱情戏拟。",
    "只收成句本体，后半句“坐而言不如卧而行”不收。",
  ),
  row(
    "037.《李语录》三七.txt",
    13,
    13,
    "赔钱生意没人做，杀头生意有人做。",
    "俗谚",
    "民间俗话，原书明注“俗话说”",
    "李敖引用关于风险与获利的俗谚。",
  ),
  row(
    "041.片羽片语.txt",
    5,
    5,
    "他死后五十年，人们还要爱听他的作品",
    "艺术家格言",
    "贝多芬语，原书明注",
    "李敖转述贝多芬关于作品流传的自信。",
  ),
  row(
    "041.片羽片语.txt",
    53,
    53,
    "谣言止于智者",
    "传统成句",
    "传统谚语",
    "李敖借古谚反衬现代谣言的形成。",
  ),
  row(
    "042.金兰随记.txt",
    25,
    25,
    "衣食足而知荣辱",
    "古典文句",
    "《管子》名句",
    "李敖再次化用《管子》关于衣食与荣辱的名句。",
  ),
  row(
    "042.金兰随记.txt",
    29,
    29,
    "为伊消得人憔悴",
    "古典词句",
    "柳永《蝶恋花》词句",
    "李敖引用柳永词句比较古今情人。",
  ),
  row(
    "046.地下哲学家的札记.txt",
    49,
    49,
    "出淤泥而不染",
    "古典文句",
    "周敦颐《爱莲说》名句",
    "李敖引用《爱莲说》中描写莲花的名句。",
  ),
  row(
    "046.地下哲学家的札记.txt",
    49,
    49,
    "莲，花之君子也。",
    "古典文句",
    "周敦颐《爱莲说》名句",
    "李敖引用《爱莲说》对莲花的评价。",
  ),
  row(
    "046.地下哲学家的札记.txt",
    67,
    67,
    "匹夫而为百世师，一言而为天下法",
    "古典文句",
    "苏轼《潮州韩文公庙碑》名句",
    "李敖引用苏轼赞韩愈的名句说明师范力量。",
  ),
  row(
    "046.地下哲学家的札记.txt",
    87,
    87,
    "近之则不逊",
    "古典文句",
    "《论语·阳货》语句",
    "李敖引用《论语》中关于小人难养的成句。",
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

const csvLines = [
  columns.join(","),
  ...data.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
];

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push(`《${book}》诗文格言歌谣引用`);
txt.push(`生成日期：${generatedDate}`);
txt.push(`总计：${data.length} 条`);
txt.push("");
txt.push("口径说明：本册多为李敖自拟格言及政治讽刺，本轮只保留明确外部来源或稳定流传的诗文、格言、俗谚、歌词、寓言成句；党国口号、现代政治人物语录、政治宣传语、李敖自作改写均不收。");
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

const report = [];
report.push(`《${book}》抽取报告（校对后当前版本）`);
report.push(`生成日期：${generatedDate}`);
report.push(`候选筛查：analysis/liao_li_yulu_quote_candidates.json 与 analysis/liao_li_yulu_review_candidates.tsv`);
report.push(`当前保留条目：${data.length} 条`);
report.push("");
report.push("本轮保留类型：古典诗文句、传统成句、民间俗谚、外国格言、歌词、寓言成句、艺术家格言。");
report.push("本轮剔除重点：国民党/党外/民进党/领袖/总统/政客等政治语录，现代政治人物语录，党国口号，军事英雄语，李敖自作谐拟和即时对话。");
report.push("");
report.push("边界处理：");
report.push("- 保留“有所不为，而后可以有为”“衣食足而知荣辱”等非政治性的古典成句；政治上下文不随条目进入。");
report.push("- 剔除“开大门，走大路”“建立一个富而好礼的社会”“以国家兴亡为己任”等政治口号或政治人物联语。");
report.push("- 剔除“我宁山头望廷尉，不能廷尉望山头”“我不能不变成英雄，因为他们打沉了我的船”等历史/现代政治军事语录。");
report.push("- 剔除李敖改写、双关和自拟格言，只在能明确对应外部诗文格言时收原句。");

const reportPath = path.join(analysisDir, "liao_li_yulu_initial_report.txt");
fs.writeFileSync(reportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");

const auditRows = [
  {
    decision: "delete",
    old_id: "LALYL-001",
    source_file: "001.《李语录》一.txt",
    line_range: "9-9",
    quote_text: "得天下之英才而教之",
    reason: "原文为李敖反用《孟子》句式的自作戏拟，不是直接引用原句，校对轮删除。",
  },
  {
    decision: "add",
    old_id: "",
    source_file: "014.《李语录》十四.txt",
    line_range: "5-5",
    quote_text: "情人眼里出西施",
    reason: "完整民间俗谚，后半句为李敖自作反转，校对轮只补俗谚本体。",
  },
  {
    decision: "add",
    old_id: "",
    source_file: "017.《李语录》十七.txt",
    line_range: "33-33",
    quote_text: "远亲不如近邻",
    reason: "完整民间俗谚，非政治语录，校对轮补入。",
  },
  {
    decision: "add",
    old_id: "",
    source_file: "017.《李语录》十七.txt",
    line_range: "37-37",
    quote_text: "天涯若比邻",
    reason: "王勃诗句完整出现，后半句为李敖自作反转，校对轮补入诗句本体。",
  },
  {
    decision: "add",
    old_id: "",
    source_file: "030.《李语录》三十.txt",
    line_range: "29-29",
    quote_text: "坐而言不如起而行",
    reason: "完整传统行动成句，后半句为李敖爱情戏拟，校对轮补入成句本体。",
  },
  {
    decision: "keep",
    old_id: "LALYL-015",
    source_file: "014.《李语录》十四.txt",
    line_range: "37-37",
    quote_text: "狼来了",
    reason: "虽短，但为明确寓言成句，非政治语录，校对轮保留。",
  },
  {
    decision: "keep",
    old_id: "LALYL-025",
    source_file: "041.片羽片语.txt",
    line_range: "5-5",
    quote_text: "他死后五十年，人们还要爱听他的作品",
    reason: "原文明确作“贝多芬说”，属艺术家格言转述，非政治语录，校对轮保留。",
  },
  {
    decision: "exclude",
    old_id: "",
    source_file: "041.片羽片语.txt",
    line_range: "13-13",
    quote_text: "与人刃我，宁我自刃。",
    reason: "与国歌和政党讽刺相连，属于政治语境联语，继续剔除。",
  },
  {
    decision: "exclude",
    old_id: "",
    source_file: "046.地下哲学家的札记.txt",
    line_range: "33-41",
    quote_text: "我宁山头望廷尉，不能廷尉望山头 / 我不能不变成英雄，因为他们打沉了我的船。",
    reason: "历史权力与现代军事政治人物语录，继续剔除。",
  },
];

const auditColumns = ["decision", "old_id", "source_file", "line_range", "quote_text", "reason"];
const auditPath = path.join(analysisDir, "liao_li_yulu_proofread_audit.tsv");
fs.writeFileSync(
  auditPath,
  `\uFEFF${auditColumns.join("\t")}\r\n${auditRows
    .map((record) => auditColumns.map((column) => String(record[column] ?? "").replace(/\t/g, " ")).join("\t"))
    .join("\r\n")}\r\n`,
  "utf8",
);

const categoryStats = new Map();
for (const record of data) {
  categoryStats.set(record.category, (categoryStats.get(record.category) ?? 0) + 1);
}

const proofreadReport = [];
proofreadReport.push(`《${book}》校对轮报告`);
proofreadReport.push(`生成日期：${generatedDate}`);
proofreadReport.push("校对前：32 条");
proofreadReport.push("本轮删除：1 条");
proofreadReport.push("本轮补入：4 条");
proofreadReport.push(`校对后：${data.length} 条`);
proofreadReport.push("");
proofreadReport.push("分类统计：");
for (const [category, count] of [...categoryStats.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))) {
  proofreadReport.push(`- ${category}: ${count}`);
}
proofreadReport.push("");
proofreadReport.push("校对轮处理：");
for (const record of auditRows) {
  const idText = record.old_id ? `｜${record.old_id}` : "";
  proofreadReport.push(`- ${record.decision}${idText}｜${record.source_file}:${record.line_range}｜${record.quote_text}｜${record.reason}`);
}
proofreadReport.push("");
proofreadReport.push("校对说明：");
proofreadReport.push("- 继续排除党国口号、现代政治人物/军事人物语录、国歌联语、政治宣传语和李敖自作谐拟。");
proofreadReport.push("- 完整的民间俗谚、古典诗句和传统成句，即使后接李敖反转句，本轮只收外部成句本体。");
proofreadReport.push("- 普通成语、标题词、短语双关和无法确认外部来源的李敖自拟格言，不因形式像格言而收入。");

const proofreadReportPath = path.join(analysisDir, "liao_li_yulu_proofread_report.txt");
fs.writeFileSync(proofreadReportPath, `\uFEFF${proofreadReport.join("\r\n")}\r\n`, "utf8");

console.log(JSON.stringify({ book, rows: data.length, csvPath, txtPath, reportPath, auditPath, proofreadReportPath }, null, 2));
