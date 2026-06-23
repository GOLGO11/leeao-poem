const fs = require("fs");
const path = require("path");

const book = "早年日记";
const idPrefix = "LAZNRJ";
const generatedDate = "2026-06-20";
const outDir = "exports";
const analysisDir = "analysis";
const sourceRoot = path.join(
  process.cwd(),
  "\u300a\u5927\u674e\u6556\u5168\u96c66.0\u300b\u5206\u7ae0\u8282",
  "006.\u6c89\u601d\u65e5\u8bb0\u7c7b",
  "002.\u65e9\u5e74\u65e5\u8bb0",
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

function tsvEscape(value) {
  return String(value ?? "").replace(/\r?\n/g, "\\n").replace(/\t/g, " ");
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
    "001.十七天的校园生活.txt",
    121,
    121,
    "乐之以验其懈、哀之以验其仁、苦之以验其志、远之以验其忠、近之以验其敬、烦之以验其能、富之以验其养、穷之以验其不受。",
    "古代观人格言",
    "古代观人法，原文未详",
    "用多种处境考验人的松懈、仁心、志气、忠敬、能力和操守。",
  ),
  row(
    "001.十七天的校园生活.txt",
    123,
    123,
    "十室之内，必有忠信；十步之内，必有芳草。",
    "古典成句与俗谚",
    "孔子语意及民间俗谚合用",
    "以忠信和芳草说明近处亦必有人才与可取之物。",
  ),
  row(
    "001.十七天的校园生活.txt",
    125,
    125,
    "暂时我不笑，一会我会笑的。",
    "外国电影台词",
    "电影《新灵肉之门》台词译句",
    "影片中关于暂时不笑、稍后会笑的台词。",
  ),
  row(
    "001.十七天的校园生活.txt",
    125,
    125,
    "女人要捣乱，她们就会找出借口来。",
    "外国电影台词",
    "电影《新灵肉之门》台词译句",
    "影片中关于找借口的台词。",
  ),
  row(
    "001.十七天的校园生活.txt",
    177,
    177,
    "假如死后没有上帝，我把坏消息保守秘密。",
    "外国电影台词",
    "电影《战地春梦》台词译句，海明威相关",
    "借影片台词写死亡、信仰与消息的反讽。",
  ),
  row(
    "001.十七天的校园生活.txt",
    177,
    177,
    "重要的是在一起，能多久就多久。",
    "外国电影台词",
    "电影《战地春梦》台词译句，海明威相关",
    "关于相爱者相守时间的台词。",
  ),
  row(
    "001.十七天的校园生活.txt",
    177,
    177,
    "有时爱人们会彼此故意误会。",
    "外国电影台词",
    "电影《战地春梦》台词译句，海明威相关",
    "关于爱人之间故意误会的台词。",
  ),
  row(
    "002.毕业以后，从军以前.txt",
    191,
    191,
    "对过去事我不感兴趣，我的兴趣在未来。",
    "外国人物格言",
    "电话发明家贝尔语，原文转述",
    "贝尔七十岁时拒写回忆录，强调兴趣在未来。",
  ),
  row(
    "003.四席小屋日记.txt",
    13,
    15,
    ["委蜕大难求净土，", "伤心最是近高楼！"].join("\n"),
    "近代诗句",
    "陈宝琛诗句，原文明注",
    "李敖回忆四席小屋时所念起的陈宝琛两句诗。",
  ),
  row(
    "003.四席小屋日记.txt",
    743,
    743,
    "黄花鱼掉到黄粪缸里",
    "民间俗语",
    "俗语，原文作“或谓”",
    "以黄花鱼落入粪缸比喻极不相配的关系。",
    "校对轮补入；语境为私人调侃。",
  ),
  row(
    "003.四席小屋日记.txt",
    1637,
    1643,
    ["又聪明又懒的，做主管；", "又聪明又勤快的，做幕僚；", "又笨又懒的，做下级军官；", "又笨又勤快的，杀掉。"].join("\n"),
    "外国管理格言",
    "德军官所言，施珂转述",
    "以聪明、勤懒两轴区分组织中不同角色的管理格言。",
    "内容出自军官转述，保留为组织管理格言。",
  ),
  row(
    "004.二十年前的一些断片.txt",
    11,
    11,
    "不如意事常十之八九",
    "传统俗谚",
    "民间俗谚",
    "用常见俗谚说明人生失意不足动摇。",
  ),
  row(
    "004.二十年前的一些断片.txt",
    121,
    125,
    ["My advice：", "①Construction before bombardment；", "②Don't marry."].join("\n"),
    "朋友赠言",
    "绍鹏席间赠言，原文明注",
    "绍鹏在席间给出的两点英文赠言。",
    "校对轮补入；保留为个人赠言。",
  ),
  row(
    "004.二十年前的一些断片.txt",
    335,
    335,
    "李兄送鞋，陈弟送袜。千里鹅毛，俱为足下。",
    "朋友题赠诗",
    "陈彦增题诗，原文明注",
    "陈彦增以鞋袜生日礼物题成短诗。",
  ),
];

data.forEach((record, index) => {
  record.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_zaonian_riji_initial_report.txt");
const proofreadReportPath = path.join(analysisDir, "liao_zaonian_riji_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_zaonian_riji_proofread_audit.tsv");

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
txtLines.push("口径说明：首轮收录外部诗句、电影/文学台词、古典成句、俗谚、人物格言和可独立成篇的朋友题赠；排除李敖自作诗文、私人即兴调笑、一般谈话、诉讼/报社/查禁材料和现代政治语录。");
txtLines.push("");

let currentChapter = "";
for (const record of data) {
  if (record.chapter !== currentChapter) {
    currentChapter = record.chapter;
    txtLines.push(`## ${currentChapter}`);
  }
  txtLines.push(`${record.id}｜${record.category}｜${record.source_or_origin}`);
  txtLines.push(record.quote_text);
  txtLines.push(`出处：${record.source_file}:${record.line_start}-${record.line_end}`);
  txtLines.push(`说明：${record.summary}`);
  if (record.notes) txtLines.push(`备注：${record.notes}`);
  txtLines.push("");
}
fs.writeFileSync(txtPath, `${txtLines.join("\r\n")}\r\n`, "utf8");

const categoryCounts = new Map();
for (const record of data) {
  categoryCounts.set(record.category, (categoryCounts.get(record.category) || 0) + 1);
}

const reportLines = [];
reportLines.push(`《${book}》首轮提取报告（校对后当前版本）`);
reportLines.push(`生成日期：${generatedDate}`);
reportLines.push("");
reportLines.push(`源目录：${sourceRoot}`);
reportLines.push("原始候选：analysis/liao_zaonian_riji_quote_candidates.json");
reportLines.push("复筛候选：analysis/liao_zaonian_riji_review_candidates.tsv");
reportLines.push("归因线索：analysis/liao_zaonian_riji_attributed_lines.tsv");
reportLines.push(`输出 CSV：${csvPath}`);
reportLines.push(`输出 TXT：${txtPath}`);
reportLines.push(`当前收录条数：${data.length}`);
reportLines.push("");
reportLines.push("分类统计：");
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) =>
  a[0].localeCompare(b[0], "zh-Hans-CN"),
)) {
  reportLines.push(`- ${category}: ${count}`);
}
reportLines.push("");
reportLines.push("候选概况：");
reportLines.push("- 全书含十七天校园日记、毕业以后从军以前、四席小屋日记、二十年前断片及目录；自动引号候选 318 个，复筛候选 85 条，归因线索 211 条。");
reportLines.push("- 早年日记中大量内容是李敖自作诗文、私人玩笑、朋友谈话、报社/查禁/诉讼记录，本轮只保留能独立作为诗文格言或外部台词的短项。");
reportLines.push("");
reportLines.push("本轮排除：");
reportLines.push("- 李敖与友人合写或自作的打油诗，如校园合写诗、给曾才诗、与景诗、做工做人四句等。");
reportLines.push("- 私人调笑诗文与日常对话，如四席小屋长篇戏诗、女性往来中的普通对白。");
reportLines.push("- 明显政治、查禁、诉讼、报社交涉语境中的语录和谈话。");
reportLines.push("");
reportLines.push("校对提示：");
reportLines.push("- 校对轮补入“黄花鱼掉到黄粪缸里”和绍鹏席间英文赠言。");
reportLines.push("- 电影台词保留为外部台词译句；“神识超迈……”等无明确出处的引号句仍未收。");
reportLines.push("");
reportLines.push("明细：");
for (const record of data) {
  reportLines.push(
    [
      record.id,
      record.source_file,
      `${record.line_start}-${record.line_end}`,
      record.category,
      record.source_or_origin,
      record.quote_text,
      record.notes,
    ]
      .map(tsvEscape)
      .join("\t"),
  );
}

fs.writeFileSync(reportPath, `${reportLines.join("\r\n")}\r\n`, "utf8");

const auditRows = [
  ["action", "target", "source_file", "line_range", "quote_or_candidate", "reason"],
  ["keep", "LAZNRJ-001", "001.十七天的校园生活.txt", "121", "乐之以验其懈、哀之以验其仁、苦之以验其志、远之以验其忠、近之以验其敬、烦之以验其能、富之以验其养、穷之以验其不受。", "古代观人法，具有格言性"],
  ["keep", "LAZNRJ-002", "001.十七天的校园生活.txt", "123", "十室之内，必有忠信；十步之内，必有芳草。", "古典成句与俗谚合用"],
  ["keep", "LAZNRJ-003-LAZNRJ-007", "001.十七天的校园生活.txt", "125,177", "《新灵肉之门》《战地春梦》台词", "外部电影台词，非政治语境"],
  ["keep", "LAZNRJ-008", "002.毕业以后，从军以前.txt", "191", "对过去事我不感兴趣，我的兴趣在未来。", "贝尔语，人物格言"],
  ["keep", "LAZNRJ-009", "003.四席小屋日记.txt", "13-15", "委蜕大难求净土，/伤心最是近高楼！", "陈宝琛诗句，原文明注"],
  ["add", "LAZNRJ-010", "003.四席小屋日记.txt", "743", "黄花鱼掉到黄粪缸里", "校对轮补入民间俗语；虽为私人调侃，短语本身可独立检索"],
  ["keep", "LAZNRJ-011", "003.四席小屋日记.txt", "1637-1643", "又聪明又懒的……又笨又勤快的，杀掉。", "管理格言；来源为军官转述但非政论"],
  ["keep", "LAZNRJ-012", "004.二十年前的一些断片.txt", "11", "不如意事常十之八九", "传统俗谚"],
  ["add", "LAZNRJ-013", "004.二十年前的一些断片.txt", "121-125", "My advice：/①Construction before bombardment；/②Don't marry.", "校对轮补入席间赠言；标题明示赠言且具格言形式"],
  ["keep", "LAZNRJ-014", "004.二十年前的一些断片.txt", "335", "李兄送鞋，陈弟送袜。千里鹅毛，俱为足下。", "陈彦增题诗，原文明注"],
  ["exclude", "self_coauthored_poems", "001.十七天的校园生活.txt;002.毕业以后，从军以前.txt", "37-45;137-145;169-177;227-235", "校园合写诗、给曾才诗、与景诗、张立纲上当诗", "李敖自作或友人私人即兴诗，非外部引用"],
  ["exclude", "unclear_quoted_sentence", "001.十七天的校园生活.txt", "189", "神识超迈，飘然而来，忽然而去，不屑于雕章琢句，亦不劳劳于镂心刻骨。", "全书仅见作李敖描述胡适气象，无明确外部出处"],
  ["exclude", "self_maxim", "002.毕业以后，从军以前.txt", "337", "没有情绪的人，才是真正幸福的人！", "无归因，日记中更像李敖自我警句"],
  ["exclude", "parody", "003.四席小屋日记.txt", "567-571", "已谙姨食性，/还要尝小姨！", "化用王建诗而成私人黄色玩笑，不取作外部诗句"],
  ["exclude", "abacus_joke", "003.四席小屋日记.txt", "489", "勿以三下五去二，当八上三去五进一", "借珠算口诀作私人消遣，整体非外部格言"],
  ["exclude", "private_joke_poem", "003.四席小屋日记.txt", "1777-1825", "有“便”来找李敖……李敖有些不胜", "友人长篇戏诗高度依附私人场景，暂不收入"],
  ["exclude", "modern_political_context", "003.四席小屋日记.txt;004.二十年前的一些断片.txt", "1663;39;1047", "詹森卷袖语、反共/言论自由等政论段", "现代政治人物或政治语境材料，排除"],
];
fs.writeFileSync(
  proofreadAuditPath,
  `${auditRows.map((row) => row.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

const proofreadLines = [];
proofreadLines.push(`《${book}》校对轮报告`);
proofreadLines.push(`生成日期：${generatedDate}`);
proofreadLines.push("");
proofreadLines.push("校对结果：");
proofreadLines.push(`- 首轮 12 条，校对补入 2 条，删除 0 条，当前 ${data.length} 条。`);
proofreadLines.push("- 补入：003:743 民间俗语“黄花鱼掉到黄粪缸里”；004:121-125 绍鹏席间英文赠言。");
proofreadLines.push("- 保留：电影台词、贝尔语、陈宝琛诗句、德军官管理格言、传统俗谚、陈彦增题诗。");
proofreadLines.push("");
proofreadLines.push("继续排除：");
proofreadLines.push("- 李敖自作/合写诗、朋友私人长篇戏诗、无归因自我警句。");
proofreadLines.push("- 私人黄色化用、珠算口诀改写和日常对白。");
proofreadLines.push("- 现代政治人物、反共/言论自由/查禁/诉讼/报社交涉等政治或事件语录。");
proofreadLines.push("");
proofreadLines.push(`校对审计：${proofreadAuditPath}`);
proofreadLines.push(`输出 CSV：${csvPath}`);
proofreadLines.push(`输出 TXT：${txtPath}`);
fs.writeFileSync(proofreadReportPath, `${proofreadLines.join("\r\n")}\r\n`, "utf8");

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
