const fs = require("fs");
const path = require("path");

const book = "李敖随写录前集";
const idPrefix = "LASXLQJ";
const generatedDate = "2026-06-21";
const outDir = "exports";
const analysisDir = "analysis";
const sourceRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "006.沉思日记类",
  "009.李敖随写录前集",
);
const sourceDecoder = new TextDecoder("gb18030");

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

function sourceLines(file) {
  const fullPath = path.join(sourceRoot, file);
  return sourceDecoder.decode(fs.readFileSync(fullPath)).replace(/\r\n/g, "\n").split("\n");
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
    "056.梁肃戎不但无耻，而且肉麻.txt",
    11,
    11,
    "万人丛中一握手，使我衣袖三年香。",
    "龚自珍诗句",
    "龚自珍（龚定盦）诗句",
    "以握手后衣袖留香写对贤者风采的仰慕。",
  ),
  row(
    "057.陈正澄来坐.txt",
    5,
    5,
    "不出户，知天下",
    "老子成句",
    "《老子》第四十七章成句",
    "以不必亲履也能通晓天下说明见识可由学问与判断而来。",
  ),
  row(
    "064.《一江春水向东流》还在查禁中.txt",
    1,
    1,
    "一江春水向东流",
    "宋词名句化用",
    "李煜《虞美人》词句，亦为电影片名",
    "片名化用李煜词句，以江水东流写愁绪绵延。",
    "只收词句本体，不收电影查禁语境。",
  ),
  row(
    "131.“一旦为贼常成靶”.txt",
    5,
    5,
    "树欲静而风不息",
    "古代成句",
    "古代成句，常见作“树欲静而风不止”",
    "以树想静而风不停比喻外缘牵动，事情难以按主观愿望止息。",
    "只收传统成句本体，不收原文政论语境。",
  ),
  row(
    "131.“一旦为贼常成靶”.txt",
    5,
    5,
    "立地成佛",
    "佛教成语",
    "佛教成语",
    "以顿悟成佛的说法概括即时转变的可能。",
    "只收佛教成语本体，不收原文政论语境。",
  ),
  row(
    "145.国民党的电影问题.txt",
    9,
    9,
    "只许官家放火，不许百姓点灯",
    "传统俗谚",
    "传统俗谚，通行作“只许州官放火，不许百姓点灯”",
    "以官民标准不一讽刺双重尺度。",
    "只收俗谚本体，不收投书中的党政争议。",
  ),
  row(
    "147.享受西湖.txt",
    3,
    3,
    "我不去看西湖，我乃去享受西湖。",
    "山水审美格言",
    "江述凡语，李敖转录",
    "把游览转为享受，点出山水体验重在领受而非观看。",
  ),
  row(
    "150.黄奠华法官的持平之言.txt",
    21,
    21,
    "瓜无滚圆、人无十全",
    "传统俗谚",
    "传统俗谚",
    "以瓜不会全圆比喻人无完人。",
    "只收俗谚本体，不收司法评论语境。",
  ),
  row(
    "163.刘辰旦来谈.txt",
    9,
    9,
    "齐白石的儿子表示，不要老是说什么假画假画，说久了，你的真画也没人敢买了。",
    "艺术市场格言",
    "齐白石之子语，刘辰旦转述",
    "以真伪之争会损害真品信任，概括艺术市场中的名声效应。",
  ),
  row(
    "164.“真人不露相”？.txt",
    5,
    5,
    "真人不露相",
    "传统俗谚",
    "传统俗谚",
    "以真正有本事的人不由外貌显露来说明才具不可貌相。",
  ),
  row(
    "167.任显群有“衣冠冢”.txt",
    7,
    7,
    "结发伉俪死能同穴",
    "传统婚姻成句",
    "传统成句，语意本于“死则同穴”",
    "以结发夫妻死后同穴寄托夫妻相守之愿。",
  ),
  row(
    "167.任显群有“衣冠冢”.txt",
    9,
    9,
    "一个成功的男人背后必有一个出色的女人，一个温馨的家庭中必有个伟大的母亲",
    "现代俗语",
    "追思文中称“俗语所说”",
    "以家庭中的女性支撑概括成功与温馨背后的照护力量。",
  ),
  row(
    "167.任显群有“衣冠冢”.txt",
    11,
    11,
    "家丑不外扬",
    "传统俗谚",
    "传统俗谚",
    "以家庭内部不体面的事不向外张扬概括维护家名的旧式信念。",
    "校对补入：同段追思文中的传统俗谚，非政治语录。",
  ),
  row(
    "167.任显群有“衣冠冢”.txt",
    11,
    11,
    "做人要厚道、心胸要宽大、得助人处且助人、得饶人处且饶人",
    "处世格言",
    "追思文所录母亲教诲",
    "以厚道、宽大、助人、饶人概括待人宽厚的处世原则。",
    "校对修订：补足同一句母亲教诲前半。",
  ),
  row(
    "167.任显群有“衣冠冢”.txt",
    11,
    11,
    "天下事岂能尽如人意，做人但求无愧于心",
    "处世格言",
    "追思文所录处世格言",
    "以世事难尽如愿，转而要求做人无愧于心。",
  ),
  row(
    "176.看扁阿扁.txt",
    15,
    15,
    "宽以待己而严以律人",
    "传统成语",
    "传统处世成语，常见作“严以律己，宽以待人”的反向讽用",
    "以待己宽、待人严概括自我与他人的双重标准。",
    "只收成语本体，不收报导中的政党议事语境。",
  ),
];

const excludedHighlights = [
  "《李敖随写录前集》自序“东打一拳、西踢一脚”：李敖自述写作方式，未作诗文格言收录。",
  "006 “八指头陀”：现代人物绰号玩笑，未收。",
  "014、015、017、025、030、034、038、053、078-080、088、094、103、114、122-124、136、153、156、171-172、176、177、183、186-188 等：政党、选举、司法、人权、外交、统独、党政广告或公文语境的现代政治语录，未收。",
  "067 戈迪默谈南非写作与审查：虽为作家语录，但重心落在现代审查和群众动员语境，首轮不收。",
  "071 “宁入地狱，不坐冤狱”：司法案件遗书语，属于现代司法新闻语录，未收。",
  "104 “替天行道”“天人合一”等：宗教凶案与年鉴说明中的概念词，未作为诗文格言收录。",
  "115 “普度众生”：新闻标题式双关，未收。",
  "130 李光耀“这条路行不通……”：现代政治判断，未收。",
  "131 “一旦为贼常成靶”：李敖自拟警句且承接政论语境，未收。",
  "134 “遇缺不补”：李敖自拟生活玩笑，未收。",
  "141 “解牛经”“目有全牛”：典故反用但未形成稳定引句，未收。",
  "142 《美丽传奇》访问段落、161 白崇禧轶语、174 私人穿衣玩笑：普通轶事对白，未收。",
  "182 黄色广告语：商业情色广告文案，未收。",
];

const auditExcludes = [
  ["exclude", "", "071.“宁入地狱，不坐冤狱”.txt", "1-37", "宁入地狱，不坐冤狱", "现代司法新闻遗书语，未作为诗文格言收录"],
  ["exclude", "", "107.“台湾人畏威而不怀德”.txt", "1-7", "台湾人畏威而不怀德", "现代政治人物对群体的政治判断，未收"],
  ["exclude", "", "130.李光耀的独见.txt", "19-19", "这条路行不通，让我们试试新方法。", "现代政治判断，未收"],
  ["exclude", "", "131.“一旦为贼常成靶”.txt", "7-7", "一旦为贼常成靶", "李敖自拟警句且承接政论语境，未收"],
  ["exclude", "", "141.解牛经.txt", "3-3", "解牛经／目有全牛", "典故反用但不是稳定引句，未收"],
  ["exclude", "", "153.天帝教与妄人.txt", "7-13", "无形应化有形，有形配合无形", "宗教政治声明语，未收"],
  ["exclude", "", "182.吴丰山主持的黄色广告.txt", "5-23", "黄色广告语", "商业情色广告文案，未收"],
];

for (const [index, item] of data.entries()) {
  item.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
}

const initialRecordCount = 15;
const proofreadAddedRows = data.filter((item) => item.notes.includes("校对补入"));
const proofreadUpdatedRows = [
  [
    "update",
    "LASXLQJ-014",
    "167.任显群有“衣冠冢”.txt",
    "11-11",
    "得助人处且助人、得饶人处且饶人",
    "补足为“做人要厚道、心胸要宽大、得助人处且助人、得饶人处且饶人”。",
  ],
];

for (const item of data) {
  const lines = sourceLines(item.source_file)
    .slice(item.line_start - 1, item.line_end)
    .join("\n");
  if (!lines.includes(item.quote_text)) {
    throw new Error(`Quote not found in source for ${item.id}: ${item.quote_text}`);
  }
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_suixielu_qianji_initial_report.txt");
const auditPath = path.join(analysisDir, "liao_suixielu_qianji_initial_audit.tsv");
const proofreadReportPath = path.join(analysisDir, "liao_suixielu_qianji_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_suixielu_qianji_proofread_audit.tsv");

const csvLines = [
  columns.join(","),
  ...data.map((item) => columns.map((column) => csvEscape(item[column])).join(",")),
];
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push(`《${book}》诗文格言歌谣引用`);
txt.push(`生成日期：${generatedDate}`);
txt.push(`总计：${data.length} 条`);
txt.push("范围：只收诗文、古典成句、传统俗谚、非政治的艺术/山水/处世格言；不收现代政治语录、司法新闻语录、公文口号、普通私人对白与李敖自拟政论句。");
txt.push("");

let currentChapter = "";
for (const item of data) {
  if (item.chapter !== currentChapter) {
    currentChapter = item.chapter;
    txt.push(`## ${currentChapter}`);
  }
  txt.push(`- ${item.id}｜${item.quote_text}`);
  txt.push(`  - 位置：${item.source_file}:${item.line_start}-${item.line_end}`);
  txt.push(`  - 类别：${item.category}`);
  txt.push(`  - 来源：${item.source_or_origin}`);
  txt.push(`  - 摘要：${item.summary}`);
  if (item.notes) {
    txt.push(`  - 备注：${item.notes}`);
  }
}
fs.writeFileSync(txtPath, `\uFEFF${txt.join("\r\n")}\r\n`, "utf8");

const categoryCounts = new Map();
for (const item of data) {
  categoryCounts.set(item.category, (categoryCounts.get(item.category) ?? 0) + 1);
}

const reportLines = [];
reportLines.push(`《${book}》首轮抽取报告`);
reportLines.push(`生成日期：${generatedDate}`);
reportLines.push(`源目录：${sourceRoot}`);
reportLines.push("原始候选：analysis/liao_suixielu_qianji_quote_candidates.json");
reportLines.push("复筛候选：analysis/liao_suixielu_qianji_review_candidates.tsv");
reportLines.push("归因线索：analysis/liao_suixielu_qianji_attributed_lines.tsv");
reportLines.push(`输出 CSV：${csvPath}`);
reportLines.push(`输出 TXT：${txtPath}`);
reportLines.push(`首轮收录条数：${initialRecordCount}`);
reportLines.push(`校对补入条数：${proofreadAddedRows.length}`);
reportLines.push(`校对修订条数：${proofreadUpdatedRows.length}`);
reportLines.push(`当前收录条数：${data.length}`);
reportLines.push("");
reportLines.push("候选概况：");
reportLines.push("- sourceFiles=191");
reportLines.push("- quoteCandidates=604");
reportLines.push("- uniqueQuoteTexts=480");
reportLines.push("- keywordLines=115");
reportLines.push("- attributedLines=217");
reportLines.push("- reviewCandidates=214");
reportLines.push("");
reportLines.push("分类统计：");
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) =>
  a[0].localeCompare(b[0], "zh-Hans-CN"),
)) {
  reportLines.push(`- ${category}: ${count}`);
}
reportLines.push("");
reportLines.push("本轮排除：");
for (const item of excludedHighlights) {
  reportLines.push(`- ${item}`);
}
reportLines.push("");
reportLines.push("明细：");
reportLines.push(
  [
    "id",
    "source_file",
    "line_start",
    "line_end",
    "category",
    "source_or_origin",
    "quote_text",
    "summary",
    "notes",
  ].join("\t"),
);
for (const item of data) {
  reportLines.push(
    [
      item.id,
      item.source_file,
      item.line_start,
      item.line_end,
      item.category,
      item.source_or_origin,
      item.quote_text,
      item.summary,
      item.notes,
    ]
      .map(tsvEscape)
      .join("\t"),
  );
}
fs.writeFileSync(reportPath, `\uFEFF${reportLines.join("\r\n")}\r\n`, "utf8");

const auditRows = [
  ["action", "target", "source_file", "line_range", "quote_or_candidate", "reason"],
  ...data.map((item) => [
    "keep",
    item.id,
    item.source_file,
    `${item.line_start}-${item.line_end}`,
    item.quote_text,
    item.summary,
  ]),
  ...auditExcludes,
];
fs.writeFileSync(
  auditPath,
  `\uFEFF${auditRows.map((auditRow) => auditRow.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

const proofreadReportLines = [];
proofreadReportLines.push(`《${book}》校对轮报告`);
proofreadReportLines.push(`生成日期：${generatedDate}`);
proofreadReportLines.push(`首轮收录：${initialRecordCount} 条`);
proofreadReportLines.push(`校对补入：${proofreadAddedRows.length} 条`);
proofreadReportLines.push(`校对修订：${proofreadUpdatedRows.length} 条`);
proofreadReportLines.push("校对删除：0 条");
proofreadReportLines.push(`当前收录：${data.length} 条`);
proofreadReportLines.push("");
proofreadReportLines.push("校对结论：");
proofreadReportLines.push("- 首轮 15 条未发现需要删除的政治语录。");
proofreadReportLines.push("- 补入 167 篇同段追思文中的传统俗谚“家丑不外扬”。");
proofreadReportLines.push("- 将 167 篇母亲教诲由截断句补足为“做人要厚道、心胸要宽大、得助人处且助人、得饶人处且饶人”。");
proofreadReportLines.push("");
proofreadReportLines.push("校对补入：");
for (const item of proofreadAddedRows) {
  proofreadReportLines.push(
    `- ${item.id}｜${item.source_file}:${item.line_start}-${item.line_end}｜${item.quote_text}｜${item.category}`,
  );
}
proofreadReportLines.push("");
proofreadReportLines.push("校对修订：");
for (const row of proofreadUpdatedRows) {
  proofreadReportLines.push(`- ${row[1]}｜${row[2]}:${row[3]}｜${row[4]}｜${row[5]}`);
}
proofreadReportLines.push("");
proofreadReportLines.push("继续排除：");
for (const item of excludedHighlights) {
  proofreadReportLines.push(`- ${item}`);
}
fs.writeFileSync(proofreadReportPath, `\uFEFF${proofreadReportLines.join("\r\n")}\r\n`, "utf8");

const proofreadAuditRows = [
  ["action", "target", "source_file", "line_range", "quote_or_candidate", "reason"],
  ...proofreadAddedRows.map((item) => [
    "add",
    item.id,
    item.source_file,
    `${item.line_start}-${item.line_end}`,
    item.quote_text,
    item.summary,
  ]),
  ...proofreadUpdatedRows,
  ...auditExcludes,
];
fs.writeFileSync(
  proofreadAuditPath,
  `\uFEFF${proofreadAuditRows.map((auditRow) => auditRow.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      book,
      records: data.length,
      csvPath,
      txtPath,
      reportPath,
      auditPath,
      proofreadReportPath,
      proofreadAuditPath,
      initialRecords: initialRecordCount,
      proofreadAdded: proofreadAddedRows.length,
      proofreadUpdated: proofreadUpdatedRows.length,
    },
    null,
    2,
  ),
);
