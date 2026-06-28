const fs = require("fs");
const path = require("path");

const book = "白眼看台湾";
const idPrefix = "LABYKTW";
const generatedDate = "2026-06-28";

const corpusDir = fs.readdirSync(process.cwd()).find((name) => name.includes("6.0"));
if (!corpusDir) throw new Error("Corpus directory not found");
const sectionDir = fs.readdirSync(corpusDir).find((name) => name.startsWith("014."));
if (!sectionDir) throw new Error("Section directory 014 not found");
const sourceBookDir = fs
  .readdirSync(path.join(corpusDir, sectionDir))
  .find((name) => name.startsWith("002."));
if (!sourceBookDir) throw new Error("Source book directory 002 not found");
const sourceDir = path.join(corpusDir, sectionDir, sourceBookDir);

const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_white_eye_taiwan_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_white_eye_taiwan_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_white_eye_taiwan_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_white_eye_taiwan_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_white_eye_taiwan_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_white_eye_taiwan_proofread_report.txt");
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
    .replace(/[“”‘’「」『』]/g, "")
    .replace(/\s+/g, "");
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
    summary,
    notes: [
      "第一轮保守筛选：《白眼看台湾》为高政治密度书，只保留可独立检索的古典成句、寓言、文学引文、宗教引文、歇后语和非现代政治格言；现代政党、选举、宪政、党派攻防、人物攻防和意识形态语录不收。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "003.",
    47,
    "孔子作《春秋》而乱臣贼子惧",
    "古典成句",
    "《孟子》相关成句",
    "李敖引春秋笔法相关成句，说明史家褒贬具有道德震慑力。",
  ),
  q(
    "003.",
    47,
    "情信辞巧",
    "古典史学成句",
    "孔子修史态度相关成句",
    "李敖引传统史学成句，概括修史要求事实可信、文辞精巧。",
  ),
  q(
    "003.",
    47,
    "哀矜弗喜",
    "古典史学成句",
    "孔子修史态度相关成句",
    "李敖引传统史学成句，强调评判人物时有悲悯而不幸灾乐祸。",
  ),
  q(
    "003.",
    49,
    "不为危言核论",
    "史评成句",
    "郭泰相关史评",
    "李敖引郭泰史评，说明批评不必走向危言峻论。",
  ),
  q(
    "003.",
    63,
    "不容毛群，斥逐羽族",
    "寓言成句",
    "《伊索寓言》鸟兽和蝙蝠故事",
    "李敖转述伊索寓言，摘出蝙蝠两边不容的惩戒性成句。",
  ),
  q(
    "003.",
    63,
    "不容兽群，斥逐哺乳类之族",
    "寓言成句",
    "《伊索寓言》鸟兽和蝙蝠故事",
    "李敖转述伊索寓言，摘出蝙蝠依违两端后被排斥的成句。",
  ),
  q(
    "003.",
    75,
    "内疚神明，外惭清议",
    "传统格言",
    "中文传统道德成句",
    "文中独立引出此句，写内心与舆论两方面的惭愧。",
  ),
  q(
    "004.",
    5,
    "帮闲的贼子",
    "戏曲成语",
    "元明杂剧",
    "李敖说明帮闲观念时，引元明杂剧称受人豢养的食客为帮闲的贼子。",
  ),
  q(
    "011.",
    97,
    "哑巴吃黄连——有苦说不出",
    "歇后语",
    "中文歇后语",
    "李敖连用歇后语，写有苦难言的处境。",
  ),
  q(
    "011.",
    97,
    "哑巴吃元宵——心里有数",
    "歇后语",
    "中文歇后语",
    "李敖连用歇后语，写不能明说但心中清楚的状态。",
  ),
  q(
    "011.",
    99,
    "言犹在耳，忠岂忘心？",
    "传统格言",
    "中文传统成句",
    "文中以独立引句作标题式收束，写旧话未远、忠心未忘。",
  ),
  q(
    "012.",
    15,
    "为何最老最先来",
    "古典诗句",
    "唐诗句",
    "李敖借唐诗句写年长者反而先挺身而出的可敬。",
  ),
  q(
    "013.",
    61,
    "朝三暮四或暮三朝四，实质未变",
    "寓言格言",
    "《庄子》狙公赋芧故事",
    "李敖转述庄子寓言，概括形式改变而实质不变的骗术。",
  ),
  q(
    "013.",
    79,
    "楚有养狙以为生者，楚人谓之狙公。旦日，必部分众狙于庭，使老狙率以之山中，求草木之实，赋什一以自奉。或不给，则加鞭箠焉。群狙皆畏苦之，弗敢违也。一日，有小狙谓众狙曰：“山之果，公所树与？”曰：“否也，天生也。”曰：“非公不得而取与？”曰：“否也，皆得而取也。”曰：“然则吾何假于彼而为之役乎？”言未既，众狙皆寤。其夕，相与伺狙公之寝，破栅毁柙，取其积，相携而入于林中，不复归。狙公卒馁而死。",
    "古文寓言",
    "刘基《郁离子》",
    "李敖完整引刘基狙公故事，保存寓言原文。",
  ),
  q(
    "013.",
    81,
    "世有以术使民而无道揆者，其如狙公乎！唯其昏而未觉也。一旦有开之，其术穷矣！",
    "古文寓言评语",
    "刘基《郁离子》",
    "李敖引《郁离子》评语，指出靠术数役使众人的办法会因觉悟而穷尽。",
  ),
  q(
    "013.",
    85,
    "留与苍生作证盟",
    "古典诗句",
    "刘基相关诗句",
    "李敖引诗句写刘基精神与后世传说中的见证意味。",
  ),
  q(
    "017.",
    5,
    "忠告而善道之",
    "儒家成句",
    "《论语》相关成句",
    "李敖引用朋友相处之道，说明忠告须善于引导。",
  ),
  q(
    "017.",
    5,
    "若非吾故人乎？",
    "史记引文",
    "项羽乌江故事",
    "李敖转引项羽临终认出吕马童的话，写英雄末路仍顾故人。",
  ),
  q(
    "017.",
    5,
    "吾闻汉购我头：千金，邑万户。吾为若德。",
    "史记引文",
    "项羽乌江故事",
    "李敖转引项羽把首级送给故人的名句。",
  ),
  q(
    "017.",
    73,
    "用师则王，用友则霸，用徒则亡。",
    "古典格言",
    "中文传统格言",
    "文中引用此句，说明身边批评者、朋友和随从对人前途的不同影响。",
  ),
  q(
    "017.",
    87,
    "唯上智与下愚最难移",
    "儒家成句",
    "《论语》相关成句",
    "李敖引孔子相关成句，写成见极深者最难改变。",
  ),
  q(
    "017.",
    47,
    "尔为尔，我为我，虽袒裼裸裎于我侧，尔焉能浼我哉！",
    "古典格言",
    "中国古代圣人语",
    "李敖引古语，说明他人的污浊不能玷污自我。",
  ),
  q(
    "017.",
    47,
    "耳食之言",
    "成语",
    "中文成语",
    "李敖用成语指未经核实的传闻。",
  ),
  q(
    "017.",
    47,
    "谣言止于智者",
    "俗语格言",
    "中文俗语",
    "李敖引俗语，说明有智慧者应止住谣传。",
  ),
  q(
    "017.",
    93,
    "心所谓危，不敢不告",
    "古文成句",
    "中文传统成句",
    "李敖借古文式成句，写明知危险仍必须告知。",
  ),
  q(
    "017.",
    99,
    "没有仆人能侍奉两个主人：不是恨这个，就得爱那个；不是重这个，就得轻那个，你不能同时侍奉上帝，又侍奉财神",
    "宗教引文",
    "《新约》",
    "李敖引《新约》句子，说明价值选择不可两头侍奉。",
  ),
  q(
    "017.",
    99,
    "同时侍奉上帝和财神的，很快就会发现上帝没了。",
    "外国格言",
    "洛根·皮尔索尔·史密斯",
    "李敖转引洛根史密斯语，进一步说明两头侍奉会失去精神核心。",
  ),
  q(
    "017.",
    101,
    "泯然众人矣",
    "古典成句",
    "王安石《伤仲永》相关成句",
    "李敖借古文成句，写灵光褪去后复归平庸。",
  ),
  q(
    "018.",
    5,
    "我的爸爸是一个中美洲白人黑人的混血（creole），他的爸爸是一个黑人，他的爸爸的爸爸是一只猴子；我的家族的起点，好像正是你们家族的终点。",
    "外国文学轶事",
    "小仲马轶事",
    "李敖引小仲马机智反击血统嘲讽的轶事语。",
  ),
  q(
    "018.",
    15,
    "十年以后，斯多克芒的见解，社会上一般人大概也跟上了。但这十年中，斯多克芒自己也不断在进步。所以十年以后，他的见解仍旧比一般人超出十年。就我个人来说，我感到我不断在进步。以前我每个剧本里的主张，如今都渐渐变成一般人的主张。但等他们跟到那一境界的时候，我早就不在那儿了，我又更进一步了。我希望我总是朝前走了。",
    "外国文学引文",
    "易卜生书信，《人民公敌》相关",
    "李敖引易卜生自述，写先行者不断向前、不会停在追随者赶到的位置。",
  ),
];

const proofreadExclusions = new Map([
  [
    normalizeText("世有以术使民而无道揆者，其如狙公乎！唯其昏而未觉也。一旦有开之，其术穷矣！"),
    "校对删除：古文评语本身是治民权术判断，按本项目“不收政治语录”口径保守移除。",
  ],
  [
    normalizeText("言犹在耳，忠岂忘心？"),
    "校对删除：复核上下文后为现代政治论战中的标题式化用，不作为独立传统格言保留。",
  ],
]);

const proofreadAdditions = [
  q(
    "008.",
    13,
    "过我门而不入我室，我不憾焉者，其唯乡愿乎？乡愿，德之贼也。",
    "儒家引文",
    "孔子相关引文",
    "校对补入孔夫子论乡愿之句，保存传统伦理判断。",
  ),
  q(
    "008.",
    13,
    "非之，无举也；刺之，无刺也。同乎流俗，合乎污世。居之似忠信，行之似廉洁，众皆悦之，自以为是，而不可与入尧舜之道。故曰：德之贼也。",
    "儒家引文",
    "《孟子》相关引文",
    "校对补入孟夫子论乡愿之句，说明随俗取悦而不能入道的伪善。",
  ),
  q(
    "016.",
    45,
    "华而睆！大夫之箦与！",
    "古文故事引文",
    "《礼记》曾子易箦故事",
    "校对补入曾子易箦故事中的童子提醒，写临终守礼的触发点。",
  ),
  q(
    "016.",
    45,
    "然！斯季孙之赐也。我未之能易也，元！起易箦！",
    "古文故事引文",
    "《礼记》曾子易箦故事",
    "校对补入曾子临终换席之语，保存守礼不苟的古文原句。",
  ),
  q(
    "016.",
    45,
    "尔之爱我也，不如彼！君子之爱人也，以德；细人之爱人也，以姑息。吾何求哉？吾得正而毙焉，斯已矣！",
    "古文故事引文",
    "《礼记》曾子易箦故事",
    "校对补入曾子论爱人以德之句，强调原则高于姑息。",
  ),
];
const proofreadAdditionTexts = new Set(proofreadAdditions.map((row) => normalizeText(row.quote_text)));

const modernPoliticalTerms = [
  "国民党",
  "共产党",
  "中共",
  "民进党",
  "党外",
  "三民主义",
  "政治",
  "政党",
  "政府",
  "政权",
  "总统",
  "领袖",
  "国父",
  "革命",
  "反共",
  "反攻",
  "复国",
  "统一",
  "独立",
  "民主",
  "自由",
  "人权",
  "宪法",
  "司法",
  "法院",
  "法官",
  "自诉",
  "诽谤",
  "戒严",
  "军法",
  "选举",
  "立委",
  "司法院",
  "行政院",
  "立法院",
  "监察院",
  "考试院",
  "宣传",
  "中华民国",
  "台湾",
  "大陆",
  "蒋",
  "孙中山",
];

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function rowToCsv(row) {
  return [
    row.id,
    row.book,
    row.chapter,
    row.source_file,
    row.line_start,
    row.line_end,
    row.quote_text,
    row.category,
    row.source_or_origin,
    row.summary,
    row.notes,
  ]
    .map(csvEscape)
    .join(",");
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

const initialRows = rawRows.sort(rowCompare).map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));
const proofreadExcludedRows = initialRows
  .filter((row) => proofreadExclusions.has(normalizeText(row.quote_text)))
  .map((row) => ({
    ...row,
    original_id: row.id,
    proofread_reason: proofreadExclusions.get(normalizeText(row.quote_text)),
  }));

const selectedRows = [
  ...initialRows.filter((row) => !proofreadExclusions.has(normalizeText(row.quote_text))),
  ...proofreadAdditions,
]
  .sort(rowCompare)
  .map((row, index) => ({
    ...row,
    id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
  }));
const proofreadAddedRows = selectedRows.filter((row) => proofreadAdditionTexts.has(normalizeText(row.quote_text)));

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
  "proofread_reason",
  "notes",
];
const reviewLines = [
  reviewHeader.join("\t"),
  ...[
    ...selectedRows.map((row) => ({
      ...row,
      decision: proofreadAdditionTexts.has(normalizeText(row.quote_text)) ? "add-proofread" : "keep-proofread",
      proofread_reason: proofreadAdditionTexts.has(normalizeText(row.quote_text))
        ? "校对补入：明确非政治且可独立检索的古典/文学引文。"
        : "",
    })),
    ...proofreadExcludedRows.map((row) => ({
      ...row,
      id: row.original_id,
      decision: "remove-proofread",
    })),
  ]
    .sort((a, b) => {
      const diff = rowCompare(a, b);
      if (diff) return diff;
      return String(a.decision).localeCompare(String(b.decision), "zh-Hans-CN");
    })
    .map((row) =>
      reviewHeader
        .map((column) => String(row[column] ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " "))
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

const report = {
  book,
  generatedDate,
  sourceDir,
  sourceFiles: files.length,
  candidatesJson,
  reviewCandidatesTsv,
  initialRowsBeforeProofread: initialRows.length,
  proofreadRemovedRows: proofreadExcludedRows.length,
  proofreadAddedRows: proofreadAddedRows.length,
  selectedRows: selectedRows.length,
  removedRows: proofreadExcludedRows.map((row) => ({
    original_id: row.original_id,
    quote_text: row.quote_text,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
    reason: row.proofread_reason,
  })),
  addedRows: proofreadAddedRows.map((row) => ({
    id: row.id,
    quote_text: row.quote_text,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
  })),
  missingQuotes: missing.map((item) => item.row.id),
  politicalHits: politicalHits.map((item) => ({
    id: item.row.id,
    quote_text: item.row.quote_text,
    hits: item.politicalHits,
  })),
  duplicateQuotes: duplicates.map((row) => row.id),
  csvPath: outCsv,
  txtPath: outTxt,
  selectedJson,
  reviewTsv,
  auditTsv,
};
fs.writeFileSync(reportTxt, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify(report, null, 2));
