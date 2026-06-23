const fs = require("fs");
const path = require("path");

const book = "李敖秘藏日记";
const idPrefix = "LAMCRJ";
const generatedDate = "2026-06-20";
const outDir = "exports";
const analysisDir = "analysis";
const sourceRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "006.沉思日记类",
  "006.李敖秘藏日记",
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
    "001.软禁残记.txt",
    5,
    5,
    "长安居，大不易",
    "古典轶语",
    "唐代顾况语，原文转引",
    "以长安居住不易映照幽居处境。",
    "未收同句仿拟语。",
  ),
  row(
    "001.软禁残记.txt",
    155,
    155,
    "岂有文章惊海内，漫劳车马驻江干。",
    "杜甫诗句",
    "杜甫《宾至》句，原文转引",
    "以文章名声反衬门外车马来驻。",
  ),
  row(
    "001.软禁残记.txt",
    181,
    181,
    "本为卖文活，翻令室倒悬。",
    "杜甫诗句",
    "杜甫《闻斛斯六宫未归》句，原文转引",
    "以卖文谋生却累及居室困顿写写作困境。",
  ),
  row(
    "001.软禁残记.txt",
    515,
    515,
    "所有伟大生活都有无趣的阶段。",
    "外国哲理格言",
    "Bertrand Russell语，原文转引",
    "罗素以伟大生活中常有平淡阶段勉人耐住寂寞。",
  ),
  row(
    "001.软禁残记.txt",
    515,
    515,
    "伟人的生活除了少数伟大时期外，并无令人兴奋的地方。",
    "外国哲理格言",
    "Bertrand Russell语，原文转引",
    "罗素说明多数伟人只有少数时刻显得激动，其余生活平静。",
  ),
  row(
    "001.软禁残记.txt",
    515,
    515,
    "从全体看来，安静的生活是伟人的特征，他们的喜乐并不是世俗心目中所认定的那一种。一切伟大的成绩必由于历久不懈的工作，其全神贯注与繁重程度，使人没有余力去从事狂热的娱乐。……",
    "外国哲理格言",
    "Bertrand Russell语，原文转引",
    "罗素认为安静生活常是伟人成就的底色，成果来自持续而专注的工作。",
    "同段中人物举例句未收。",
  ),
  row(
    "004.5月26的日记.txt",
    25,
    25,
    "公差强人意，隐若一敌国矣！",
    "古典史传格言",
    "《后汉书·吴汉传》，原文转录",
    "以吴汉临阵镇定比喻面对困难仍能稳定人心。",
  ),
  row(
    "008.代曹禺驳夏志清.txt",
    7,
    7,
    "从日记上可看出一个人的优柔，太琐碎的日记更是如此。",
    "日记格言",
    "丘吉尔语，原文转述",
    "以日记琐碎映出性格优柔。",
  ),
  row(
    "008.代曹禺驳夏志清.txt",
    15,
    15,
    "浊世之佳公子",
    "传统品评语",
    "曹禺《求凰集》序转引旧评语",
    "以旧式品评语描写吴祖光早年气质。",
  ),
  row(
    "009.1月的日记.txt",
    15,
    15,
    "漫劳海内传名字",
    "唐寅画题诗句",
    "唐伯虎画题句，原文转引",
    "唐伯虎画题中的名声感叹。",
  ),
  row(
    "009.1月的日记.txt",
    15,
    15,
    "书本自惭称学者，众人疑道是神仙",
    "唐寅画题诗句",
    "唐伯虎画题句，原文转引",
    "唐伯虎以学者自惭、旁人疑为神仙写画中人物。",
  ),
  row(
    "009.1月的日记.txt",
    19,
    19,
    "君子爱人以德",
    "传统格言",
    "传统儒家成语，原文转引",
    "以德义成全所爱之人。",
  ),
  row(
    "010.2月的日记.txt",
    331,
    331,
    "且拾级直参紫府；乍回首已隔红尘",
    "寺庙楹联",
    "指南宫对联，原文转引",
    "以拾级入山与回首红尘写入庙境界。",
  ),
  row(
    "010.2月的日记.txt",
    331,
    331,
    "指地玄门开觉路；南天紫府渡迷津",
    "寺庙楹联",
    "指南宫对联，原文转引",
    "以玄门、觉路、迷津写道观劝化语。",
  ),
  row(
    "011.3月的日记.txt",
    297,
    297,
    "莲生淤泥中，不与泥同调。食莲谁不甘？知味良独少。",
    "古典诗句",
    "黄庭坚《赣上食莲有感》诗句",
    "李敖借咏莲诗句自况，不与污泥同调而知味者少。",
    "校对补入：全库同句归为黄庭坚诗句。",
  ),
  row(
    "012.4月的日记.txt",
    69,
    69,
    "岸绝船通马；沙交路入河。",
    "传统对联",
    "易培基对联，原文转引",
    "以岸绝、船通、沙交、路入构成山水行旅联语。",
  ),
  row(
    "012.4月的日记.txt",
    235,
    235,
    "进不得相合，退不能相忘。",
    "友人贺卡语",
    "李筱峰贺卡语，原文转录",
    "以进退两难写相知者难合亦难忘。",
  ),
  row(
    "012.4月的日记.txt",
    261,
    261,
    "江湖愈老，胆子愈小",
    "江湖格言",
    "江湖旧语，原文转引",
    "以江湖经验越深越知谨慎作处世提醒。",
  ),
  row(
    "013.欲看湖光不自由.txt",
    17,
    17,
    "取法乎上，仅得其中",
    "古典格言",
    "传统古训，原文转引",
    "以高标准要求却只能得到中等效果说明理想与实行之间常有折扣。",
    "校对补入：首轮漏收传统古训。",
  ),
  row(
    "013.欲看湖光不自由.txt",
    27,
    27,
    "行百里者半九十",
    "传统成语",
    "古话，原文转引",
    "以行程将近终点仍最艰难提示慎终。",
  ),
  row(
    "013.欲看湖光不自由.txt",
    37,
    37,
    "圣号观音应念寻声为救苦；寺名玄奘果然无刹不现身。",
    "寺庙楹联",
    "傅朝枢玄奘寺联，原文转引",
    "以观音寻声救苦、玄奘无刹不现身写寺中联语。",
  ),
];

const proofreadAdds = data.filter((item) => item.notes.startsWith("校对补入："));

const proofreadExcludes = [
  {
    file: "011.3月的日记.txt",
    lineRange: "171",
    quote: "这很可能，因为我的智慧每天都在增加。",
    reason: "现代公共人物演说轶语，暂不作为本书诗文格言保留。",
  },
  {
    file: "011.3月的日记.txt",
    lineRange: "179",
    quote: "苛政猛于虎",
    reason: "此处紧贴查禁与出版压迫语境，本书暂不重复补入。",
  },
  {
    file: "012.4月的日记.txt",
    lineRange: "249-259",
    quote: "五十开始，音容宛在；百年以后，尸骨无存。 / 六亲不认，专心写作；四面树敌，一意孤行。",
    reason: "电话戏联，作者与归属不宜作外部引用。",
  },
  {
    file: "012.4月的日记.txt",
    lineRange: "263",
    quote: "但见旧人笑，哪闻新人哭",
    reason: "李敖化用古句，非外部原句。",
  },
  {
    file: "012.4月的日记.txt",
    lineRange: "327",
    quote: "爱国不在得众人之欢心。真爱国者认清是非……",
    reason: "总统与爱国语境，作为公共政治语录排除。",
  },
  {
    file: "014.夺魄的代价.txt",
    lineRange: "35-41",
    quote: "昨日成今日，今日气何如？……",
    reason: "李敖自作且依附当日公共事件。",
  },
  {
    file: "015.垦丁随记.txt",
    lineRange: "17",
    quote: "青天白日你在做梦 / 我愿死在他乡做鬼魔",
    reason: "戏曲台词被当场转作时事讽喻，暂不收。",
  },
  {
    file: "017.李登辉对谁而发.txt",
    lineRange: "7",
    quote: "民无信不立",
    reason: "整篇围绕现代公共人物与公开承诺，暂不收。",
  },
];

const sourceFileOrder = new Map(
  fs
    .readdirSync(sourceRoot)
    .filter((file) => file.endsWith(".txt"))
    .map((file, index) => [file, index]),
);

for (const item of data) {
  const lines = sourceLines(item.source_file);
  if (item.line_start < 1 || item.line_end > lines.length || item.line_start > item.line_end) {
    throw new Error(
      `Invalid line range ${item.source_file}:${item.line_start}-${item.line_end}, file has ${lines.length} lines`,
    );
  }
}

data.sort((a, b) => {
  const fileDelta = (sourceFileOrder.get(a.source_file) ?? 9999) - (sourceFileOrder.get(b.source_file) ?? 9999);
  if (fileDelta) return fileDelta;
  const startDelta = Number(a.line_start) - Number(b.line_start);
  if (startDelta) return startDelta;
  return Number(a.line_end) - Number(b.line_end);
});

data.forEach((item, index) => {
  item.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_micang_riji_initial_report.txt");
const auditPath = path.join(analysisDir, "liao_micang_riji_initial_audit.tsv");
const proofreadReportPath = path.join(analysisDir, "liao_micang_riji_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_micang_riji_proofread_audit.tsv");

const csv = [
  columns.join(","),
  ...data.map((item) => columns.map((column) => csvEscape(item[column])).join(",")),
].join("\n");
fs.writeFileSync(csvPath, `\uFEFF${csv}\n`, "utf8");

const txtLines = [
  `《${book}》诗文格言歌谣引用`,
  `生成日期：${generatedDate}`,
  `记录数：${data.length}`,
  "",
];
for (const item of data) {
  txtLines.push(`【${item.id}】${item.category}｜${item.source_or_origin}`);
  txtLines.push(`出处：${item.chapter}｜${item.source_file}:${item.line_start}-${item.line_end}`);
  txtLines.push(`引文：${item.quote_text}`);
  txtLines.push(`说明：${item.summary}`);
  if (item.notes) txtLines.push(`备注：${item.notes}`);
  txtLines.push("");
}
fs.writeFileSync(txtPath, `${txtLines.join("\r\n")}\r\n`, "utf8");

const categoryCounts = new Map();
for (const item of data) {
  categoryCounts.set(item.category, (categoryCounts.get(item.category) || 0) + 1);
}

const excludedHighlights = [
  "软禁期间的警察、调查、报刊与案件对话，只作背景，不收为格言。",
  "《金兰琐碎》中的新闻摘录、年表说明、书目信息、日常对话均未收。",
  "鲁迅、曹禺、夏志清相关长篇评述中，涉及阵营论述与事件评断者未收；仅保留可独立品评人物的旧语。",
  "太原五百完人、统战、李登辉、陈履安等篇章以现代公共事件为主，本轮未收。",
  "李敖自作诗、即兴联语、电话戏联、私人玩笑与善书中荒诞禁忌材料均未收。",
  "同段中含现代人物举例的罗素材料，只保留可独立成立的生活格言句。",
];

const reportLines = [];
reportLines.push(`《${book}》首轮提取报告`);
reportLines.push(`生成日期：${generatedDate}`);
reportLines.push("");
reportLines.push(`源目录：${sourceRoot}`);
reportLines.push("原始候选：analysis/liao_micang_riji_quote_candidates.json");
reportLines.push("复筛候选：analysis/liao_micang_riji_review_candidates.tsv");
reportLines.push("归因线索：analysis/liao_micang_riji_attributed_lines.tsv");
reportLines.push(`输出 CSV：${csvPath}`);
reportLines.push(`输出 TXT：${txtPath}`);
reportLines.push(`当前收录条数：${data.length}`);
reportLines.push(`校对补入条数：${proofreadAdds.length}`);
reportLines.push("");
reportLines.push("候选概况：");
reportLines.push("- sourceFiles=19");
reportLines.push("- quoteCandidates=556");
reportLines.push("- uniqueQuoteTexts=472");
reportLines.push("- keywordLines=132");
reportLines.push("- attributedLines=205");
reportLines.push("- reviewCandidates=229");
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
fs.writeFileSync(reportPath, `${reportLines.join("\r\n")}\r\n`, "utf8");

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
  [
    "exclude",
    "self_written_poems",
    "014.夺魄的代价.txt",
    "35-41",
    "昨日成今日，今日气何如？……",
    "李敖自作且依附当日事件。",
  ],
  [
    "exclude",
    "private_phone_couplets",
    "012.4月的日记.txt",
    "249-259",
    "五十开始，音容宛在；百年以后，尸骨无存。 / 六亲不认，专心写作；四面树敌，一意孤行。",
    "电话戏联，作者与归属不宜作外部引用。",
  ],
  [
    "exclude",
    "dramatic_lines_in_event_context",
    "015.垦丁随记.txt",
    "17",
    "青天白日你在做梦 / 我愿死在他乡做鬼魔",
    "戏曲台词被当场转作时事讽喻，暂不收。",
  ],
  [
    "exclude",
    "classic_saying_in_public_event_article",
    "017.李登辉对谁而发.txt",
    "7",
    "民无信不立",
    "整篇围绕现代公共人物与公开承诺，暂不收。",
  ],
  [
    "exclude",
    "religious_taboo_material",
    "015.垦丁随记.txt",
    "33-45",
    "《戒淫证集》房事禁忌条文",
    "善书禁忌材料，非诗文格言歌谣引用。",
  ],
];
fs.writeFileSync(
  auditPath,
  `${auditRows.map((row) => row.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

const proofreadReportLines = [];
proofreadReportLines.push(`《${book}》校对轮报告`);
proofreadReportLines.push(`生成日期：${generatedDate}`);
proofreadReportLines.push("");
proofreadReportLines.push("校对结果：");
proofreadReportLines.push(`- 首轮 19 条，校对补入 ${proofreadAdds.length} 条，删除 0 条，当前 ${data.length} 条。`);
proofreadReportLines.push("- 补入：黄庭坚咏莲诗句、传统古训“取法乎上，仅得其中”。");
proofreadReportLines.push("- 继续排除：现代公共人物语、总统爱国语、公共事件语境中的古句、李敖自作/自改诗句、私人电话戏联。");
proofreadReportLines.push("");
proofreadReportLines.push("新增项：");
for (const item of proofreadAdds) {
  proofreadReportLines.push(
    `- ${item.source_file}:${item.line_start}-${item.line_end}｜${item.quote_text}｜${item.notes.replace(/^校对补入：/, "")}`,
  );
}
proofreadReportLines.push("");
proofreadReportLines.push("继续排除：");
for (const item of proofreadExcludes) {
  proofreadReportLines.push(`- ${item.file}:${item.lineRange}｜${item.quote}｜${item.reason}`);
}
proofreadReportLines.push("");
proofreadReportLines.push("校对说明：");
proofreadReportLines.push("- 古典诗文若可独立成立且在全库已有同源归因，本轮补入；若文本核心转为现代公共事件评论，则不补。");
proofreadReportLines.push("- 日记中的李敖自作、即兴戏联、私人玩笑继续按项目口径排除。");
proofreadReportLines.push(`- 校对审计：${proofreadAuditPath}`);
proofreadReportLines.push(`- 输出 CSV：${csvPath}`);
proofreadReportLines.push(`- 输出 TXT：${txtPath}`);
fs.writeFileSync(proofreadReportPath, `\uFEFF${proofreadReportLines.join("\r\n")}\r\n`, "utf8");

const proofreadAuditRows = [
  ["action", "file", "line_range", "quote_or_candidate", "reason"],
  ...proofreadAdds.map((item) => [
    "add",
    item.source_file,
    `${item.line_start}-${item.line_end}`,
    item.quote_text,
    item.notes.replace(/^校对补入：/, ""),
  ]),
  ...proofreadExcludes.map((item) => ["exclude", item.file, item.lineRange, item.quote, item.reason]),
];
fs.writeFileSync(
  proofreadAuditPath,
  `\uFEFF${proofreadAuditRows.map((row) => row.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      book,
      records: data.length,
      proofreadAdds: proofreadAdds.length,
      proofreadRemovals: 0,
      csvPath,
      txtPath,
      reportPath,
      auditPath,
      proofreadReportPath,
      proofreadAuditPath,
    },
    null,
    2,
  ),
);
