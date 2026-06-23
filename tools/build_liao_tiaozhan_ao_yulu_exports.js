const fs = require("fs");
const path = require("path");

const book = "挑战李敖——敖语录";
const idPrefix = "LATZAY";
const generatedDate = "2026-06-20";
const outDir = "exports";
const analysisDir = "analysis";
const sourceRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "005.诗集语录类",
  "006.挑战李敖——敖语录",
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
    "001.1999年10月.txt",
    49,
    49,
    "爱你的邻居",
    "圣经训诫译句",
    "《圣经》Love thy neighbour 训诫的中文转述",
    "李敖在圣经训诫后加世俗玩笑，本轮只收训诫本体。",
    "校对轮补入；后半玩笑不入。",
  ),
  row(
    "001.1999年10月.txt",
    49,
    49,
    "爱你的敌人",
    "圣经训诫译句",
    "《圣经》Love your enemies 训诫的中文转述",
    "李敖在圣经训诫后加世俗玩笑，本轮只收训诫本体。",
    "校对轮补入；后半玩笑不入。",
  ),
  row(
    "004.2000年1月.txt",
    33,
    33,
    "怕死的人会死好多次",
    "外国文学名句译意",
    "Shakespeare《Julius Caesar》名句的中文转述",
    "对应“懦夫在未死以前已死过多次”的通行译意。",
    "只收前半句，后半句为李敖续写。",
  ),
  row(
    "005.2000年2月.txt",
    13,
    13,
    "见人说人话，见鬼说鬼话",
    "民间俗语",
    "民间俗语",
    "用来形容应对不同对象时换一套说辞。",
    "只收俗语本体，周边骂语不入。",
  ),
  row(
    "005.2000年2月.txt",
    25,
    25,
    "没有丑女人，只有懒女人。",
    "现代俗语",
    "流行美容俗语，原书未注出处",
    "常见的外貌与打扮俗语。",
    "同句前半为李敖对偶扩写，不收。",
  ),
  row(
    "006.2000年3月.txt",
    13,
    13,
    "成功的丈夫是钱多到妻子花不完，成功的妻子是找到这种丈夫。",
    "幽默格言",
    "西方流行幽默格言译意，原书未注出处",
    "关于成功丈夫与成功妻子的两面对照。",
    "作为流行机智语保留。",
  ),
  row(
    "006.2000年3月.txt",
    29,
    29,
    "男人有了钱会变坏，女人变坏了会有钱。",
    "现代俗语",
    "流行俗语",
    "关于金钱与男女关系的通行俗语。",
    "只收俗语本体，后续扩写不入。",
  ),
  row(
    "006.2000年3月.txt",
    41,
    41,
    "沐猴而冠",
    "史记成语",
    "《史记·项羽本纪》相关成语",
    "形容徒具衣冠而本质未变。",
    "只收前四项传统成语俗语，末项时事讽刺不入。",
  ),
  row(
    "006.2000年3月.txt",
    41,
    41,
    "小人得志",
    "传统成语",
    "传统成语",
    "形容卑劣者一时得势的成语。",
    "只收成语本体。",
  ),
  row(
    "006.2000年3月.txt",
    41,
    41,
    "穷人乍富",
    "民间俗语",
    "民间俗语",
    "形容骤然富贵而举止失度的俗语。",
    "只收俗语本体。",
  ),
  row(
    "006.2000年3月.txt",
    41,
    41,
    "叫花子吃死蟹",
    "民间俗语",
    "民间俗语",
    "以叫花子吃死蟹比喻不得体或不相称的情状。",
    "只收俗语本体。",
  ),
];

data.forEach((record, index) => {
  record.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_tiaozhan_ao_yulu_initial_report.txt");
const proofreadReportPath = path.join(analysisDir, "liao_tiaozhan_ao_yulu_proofread_report.txt");

const csv = [
  columns.join(","),
  ...data.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
].join("\r\n");
fs.writeFileSync(csvPath, `\uFEFF${csv}\r\n`, "utf8");

const txtLines = [];
txtLines.push(`《${book}》诗文格言歌谣引用`);
txtLines.push(`生成日期：${generatedDate}`);
txtLines.push(`总计：${data.length} 条`);
txtLines.push("");
txtLines.push("口径说明：本册主体是李敖自拟短语录和时事讽刺，首轮只保留能独立成立的外来格言、传统成语和民间俗语；现代政论名句、人物讽刺、李敖自作反转句均不收。");
txtLines.push("");

let currentChapter = "";
for (const record of data) {
  if (record.chapter !== currentChapter) {
    currentChapter = record.chapter;
    txtLines.push(`## ${currentChapter}`);
  }
  txtLines.push(`${record.id}｜${record.category}｜${record.source_file}:${record.line_start}-${record.line_end}`);
  txtLines.push(`引用：${record.quote_text}`);
  txtLines.push(`出处线索：${record.source_or_origin}`);
  txtLines.push(`摘要：${record.summary}`);
  if (record.notes) txtLines.push(`备注：${record.notes}`);
  txtLines.push("");
}
fs.writeFileSync(txtPath, `\uFEFF${txtLines.join("\r\n")}\r\n`, "utf8");

const report = [
  `《${book}》首轮提取报告（校对后当前版本）`,
  `生成日期：${generatedDate}`,
  "",
  `源目录：${sourceRoot}`,
  "原始候选：analysis/liao_tiaozhan_ao_yulu_quote_candidates.json",
  "复筛候选：analysis/liao_tiaozhan_ao_yulu_review_candidates.tsv",
  "归因线索：analysis/liao_tiaozhan_ao_yulu_attributed_lines.tsv",
  `输出 CSV：${csvPath}`,
  `输出 TXT：${txtPath}`,
  `当前收录条数：${data.length}`,
  "",
  "候选概况：",
  "- 全书正文 7 个文件，自动引号候选很少，主要内容为每日短语录。",
  "- 自动归因线索集中在 001.1999年10月.txt:25 的五代李振故事，但“清流/浊流”仅作时事双关，本轮不收。",
  "",
  "本轮保留：",
  "- Shakespeare 名句译意、民间俗语、传统成语、流行幽默格言。",
  "- 同一句中如有李敖自作反转，只截取可独立成立的外部成句本体。",
  "",
  "本轮排除：",
  "- 现代政党、候选人、总统、选举、台独等时事讽刺语录。",
  "- “黑猫白猫”等现代政治名句及其反写。",
  "- 仅为人名、术语、双关词、即时骂语或李敖自造警句的内容。",
  "",
  "校对提示：",
  "- “勇士的伤在胸前，懦夫的伤在背后”已在校对轮删除，因来源弱且更像李敖为后续讽刺搭出的句式。",
  "- “成功的丈夫……”暂留为流行幽默格言，下一轮仍可复核出处强度。",
].join("\r\n");
fs.writeFileSync(reportPath, `\uFEFF${report}\r\n`, "utf8");

const proofreadReport = [
  `《${book}》校对轮报告`,
  `生成日期：${generatedDate}`,
  "",
  "校对前条目：10",
  "删除条目：1",
  "新增条目：2",
  `校对后条目：${data.length}`,
  "",
  "删除项：",
  "- 005.2000年2月.txt:33｜勇士的伤在胸前，懦夫的伤在背后｜原书无归属，且后接“弱者/连战”讽刺结构，更像李敖自作铺排，不按外部格言保留。",
  "",
  "新增项：",
  "- 001.1999年10月.txt:49｜爱你的邻居｜圣经训诫本体，后接李敖玩笑不入。",
  "- 001.1999年10月.txt:49｜爱你的敌人｜圣经训诫本体，后接李敖玩笑不入。",
  "",
  "校对说明：",
  "- “黑猫白猫”继续排除：虽为名句，但属于现代政治语录及其反写。",
  "- 006.2000年3月.txt:41 的传统成语俗语只保留本体，末项时事人物讽刺不入。",
  "- “成功的丈夫……”暂留为流行幽默格言；如后续口径要求必须有原文明注出处，可再删除。",
].join("\r\n");
fs.writeFileSync(proofreadReportPath, `\uFEFF${proofreadReport}\r\n`, "utf8");

console.log(JSON.stringify({ records: data.length, csvPath, txtPath, reportPath, proofreadReportPath }, null, 2));
