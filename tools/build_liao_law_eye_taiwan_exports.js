const fs = require("fs");
const path = require("path");

const book = "法眼看台湾";
const idPrefix = "LAFYKTW";
const generatedDate = "2026-06-28";

const corpusDir = fs.readdirSync(process.cwd()).find((name) => name.includes("6.0"));
if (!corpusDir) throw new Error("Corpus directory not found");
const sectionDir = fs.readdirSync(corpusDir).find((name) => name.startsWith("014."));
if (!sectionDir) throw new Error("Section directory 014 not found");
const sourceBookDir = fs
  .readdirSync(path.join(corpusDir, sectionDir))
  .find((name) => name.startsWith("003."));
if (!sourceBookDir) throw new Error("Source book directory 003 not found");
const sourceDir = path.join(corpusDir, sectionDir, sourceBookDir);

const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_law_eye_taiwan_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_law_eye_taiwan_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_law_eye_taiwan_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_law_eye_taiwan_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_law_eye_taiwan_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_law_eye_taiwan_proofread_report.txt");
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
      "第一轮保守筛选：《法眼看台湾》为高政治密度书，只保留可独立检索的古典诗文、成语典故、寓言、谚语、文坛轶事和少量民间行话；现代党派、选举、案件攻防、自由民主理论、国际政治演说和政治寓言语录不收。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    7,
    "不虞之誉",
    "古典成语",
    "《孟子》相关成语",
    "李敖借古典成语，写意外而来的赞誉。",
    7,
    "校对补入：虽处现代论战语境，但引文本身为传统成语，保留检索价值。",
  ),
  q(
    "001.",
    7,
    "不虞之毁",
    "古典成语",
    "《孟子》相关成语",
    "李敖借古典成语，写意外而来的毁谤。",
    7,
    "校对补入：虽处现代论战语境，但引文本身为传统成语，保留检索价值。",
  ),
  q(
    "001.",
    19,
    "时穷节乃见",
    "古典诗句",
    "文天祥相关诗句",
    "李敖引文天祥诗意，说明困厄时节操才显现。",
  ),
  q(
    "003.",
    3,
    "一个人的食物是另一个人的毒药。",
    "西方谚语",
    "英文谚语 One man's meat is another man's poison",
    "李敖引西方谚语，说明人与人立场、禀性不同，同一事物会有相反感受。",
  ),
  q(
    "003.",
    23,
    "少年十五二十时",
    "古典诗句",
    "王维《老将行》相关诗句",
    "李敖化用王维诗句，写自己少年时期的生活记忆。",
    23,
    "校对补入：非政治语境中的古诗句化用。",
  ),
  q(
    "004.",
    33,
    "言而有信，信而有征",
    "传统成句",
    "中文传统成句",
    "李敖借传统成句，要求言论须守信用且有事实凭据。",
    33,
    "校对补入：非政治语录，属于可独立检索的传统道德成句。",
  ),
  q(
    "005.",
    35,
    "放之四海而皆准、俟诸百世而不惑",
    "传统成句",
    "中文传统成句",
    "李敖借传统成句，指称自以为普遍有效、百世不疑的固定原则。",
  ),
  q(
    "005.",
    45,
    "成则为王败则为寇",
    "俗语格言",
    "中文俗语",
    "李敖引俗语，写成败转化为名分评价的世俗逻辑。",
  ),
  q(
    "005.",
    45,
    "薄天子而不为",
    "古典成句",
    "中文古典成句",
    "李敖引古典成句，形容轻视最高权位而不取。",
  ),
  q(
    "005.",
    53,
    "不敢言而敢怒",
    "古典文句",
    "杜牧《阿房宫赋》相关文句",
    "李敖借古典文句，写人在压抑中不敢发声而心中怨怒。",
  ),
  q(
    "005.",
    53,
    "独夫之心，日益骄固",
    "古典文句",
    "杜牧《阿房宫赋》相关文句",
    "李敖引《阿房宫赋》文意，写独断者在沉默环境中愈发骄横固执。",
  ),
  q(
    "005.",
    57,
    "狭巷短兵相接处，杀人如草不闻声。",
    "古典诗句",
    "沈明臣《铙歌》",
    "李敖引明人诗句，写无声暴烈比单纯暴烈更可怕。",
  ),
  q(
    "006.",
    139,
    "与虎谋皮",
    "成语典故",
    "中文成语",
    "李敖借成语，写向根本利害相反者谋求合作的虚妄。",
    139,
    "校对补入：只收成语本身，不收同段现代党派攻防语。",
  ),
  q(
    "006.",
    143,
    "本是同根生",
    "古典诗句",
    "曹植《七步诗》相关诗句",
    "李敖借古诗句，写同源者之间本不该相害。",
    143,
    "校对补入：虽用于现代论战，诗句本身为古典文学引文。",
  ),
  q(
    "006.",
    147,
    "“文”前作剧莫相笑，我死诸君思此狂。",
    "化用诗句",
    "李敖改写陆游诗句",
    "李敖化用陆游诗意，为自己写作与身后评价作戏谑式自题。",
    149,
  ),
  q(
    "007.",
    7,
    "郭良蕙啊！这件事有两个错误：第一个错误是他们不该开除你；第二个错误是你不该加入。",
    "文坛轶事语",
    "梁实秋轶事",
    "李敖引梁实秋答郭良蕙语，保存一则文坛机锋。",
  ),
  q(
    "007.",
    25,
    "楚有养狙以为生者，楚人谓之狙公。旦日，必部分众狙于庭，使老狙率以之山中，求草木之实，赋什一以自奉。或不给，则加鞭箠焉。群狙皆畏苦之，弗敢远也。一日，有小狙谓众狙曰：“山之果，公所树与？”曰：“否也，天生也。”曰：“非公不得而取与？”曰：“否也，皆得而取也。”曰：“然则吾何假于彼而为之役乎？”言未既，众狙皆寤。其夕，相与伺狙公之寝，破栅毁柙，取其积，相携而入于林中，不复归。狙公卒馁而死。",
    "古文寓言",
    "刘基《郁离子》",
    "李敖完整引刘基狙公故事，保存寓言原文。",
  ),
  q(
    "010.",
    3,
    "君子协定",
    "外来习语",
    "英文 gentleman's agreement",
    "李敖解释“君子协定”的英文来源和习语含义。",
    3,
    "校对补入：作为外来习语保留，不收同段国际政治评论。",
  ),
  q(
    "010.",
    37,
    "盗亦有道",
    "成语典故",
    "《庄子》相关成语",
    "李敖引成语，说明即使在不正当群体中也有内部规则。",
  ),
  q(
    "013.",
    9,
    "看似寻常最奇崛，成如容易却艰辛。",
    "古典诗句",
    "王安石《题张司业诗》",
    "李敖引王安石诗句，说明看似容易与寻常背后有奇崛艰辛。",
    11,
  ),
  q(
    "014.",
    107,
    "旁观者清",
    "俗语格言",
    "中文俗语",
    "李敖引俗语，说明跳出局中污染后反而看得清楚。",
  ),
  q(
    "016.",
    145,
    "华而睆！大夫之箦与！",
    "古文故事引文",
    "《礼记》曾子易箦故事",
    "李敖引曾子易箦故事中的童子提醒，写临终守礼的触发点。",
  ),
  q(
    "016.",
    145,
    "然！斯季孙之赐也。我未之能易也。元！起易箦！",
    "古文故事引文",
    "《礼记》曾子易箦故事",
    "李敖引曾子临终换席之语，保存守礼不苟的古文原句。",
  ),
  q(
    "016.",
    145,
    "尔之爱我也，不如彼！君子之爱人也，以德；细人之爱人也，以姑息。吾何求哉！吾得正而毙焉，斯已矣！",
    "古文故事引文",
    "《礼记》曾子易箦故事",
    "李敖引曾子论爱人以德之句，强调原则高于姑息。",
  ),
  q(
    "017.",
    37,
    "止于至善",
    "儒家成句",
    "《大学》相关成句",
    "李敖题中引用儒家成句，表示抵达最高善的标准。",
  ),
  q(
    "017.",
    61,
    "生公说法",
    "佛教典故",
    "生公说法典故",
    "李敖借佛教典故，形容反复讲说而期待听者领会。",
    61,
    "校对补入：只收传统典故，不收同段现代政治判断。",
  ),
  q(
    "017.",
    61,
    "顽石点头",
    "佛教典故",
    "生公说法、顽石点头典故",
    "李敖借传统典故，写道理讲到连顽石也会被感动的境界。",
    61,
    "校对补入：只收传统典故，不收同段现代政治判断。",
  ),
  q(
    "017.",
    61,
    "清者自清、浊者自浊",
    "俗语格言",
    "中文俗语",
    "李敖借俗语，说明清浊自有其本来状态。",
    61,
    "校对补入：只取通行俗语格言，避开后续现代论战语。",
  ),
  q(
    "017.",
    63,
    "十年以后，斯铎曼的见解，社会上一般人大概也跟上了。但这十年中，斯铎曼自己也不断在进步。所以十年以后，他的见解仍旧比一般人超出十年。就我个人来说，我感到我不断在进步。以前我每个剧本里的主张，如今都渐渐变成一般人的主张。但等他们跟到那一境界的时候，我早就不在那儿了，我又更进一步了。我希望我总是朝前走了。",
    "外国文学引文",
    "易卜生书信",
    "李敖引易卜生书信，说明先行者不断前进，不停在追随者赶上的位置。",
    63,
    "校对补入：文学书信引文，未收同段现代政治讨论。",
  ),
  q(
    "020.",
    19,
    "欲加之罪，何患无辞",
    "古典成语",
    "《左传》相关成语",
    "李敖引成语，说明若要罗织罪名，总能找到说辞。",
  ),
  q(
    "021.",
    15,
    "觚不觚。觚哉？觚哉？",
    "儒家引文",
    "《论语》",
    "李敖引孔子论觚之名实，说明名实不符的问题。",
    15,
    "校对补入：只收《论语》原句，不收同段现代政治化用。",
  ),
  q(
    "021.",
    15,
    "世有因名以得实，亦有因名以失实。",
    "诸子引文",
    "《尹文子》",
    "李敖引《尹文子》名实之论，说明名称可以成就或丧失实质。",
    15,
    "校对补入：只收诸子原句，不收同段现代政治化用。",
  ),
  q(
    "023.",
    33,
    "海千山千",
    "外来成语",
    "日语成语 umisen yamasen",
    "李敖引日语成语，形容阅历深、世故精明。",
    33,
    "校对补入：作为外来成语保留，不收同段现代事件攻防语。",
  ),
  q(
    "023.",
    29,
    "揭飞碗",
    "民间行话",
    "旧式赌博用语",
    "李敖解释旧式赌博行话，指旁观者突然介入代行庄家职权。",
  ),
  q(
    "023.",
    29,
    "我包了！",
    "民间行话",
    "旧式赌博用语",
    "李敖引旧式赌博中揭飞碗时的喊法，保存行话原貌。",
  ),
  q(
    "024.",
    11,
    "伯仁，以百口累卿！",
    "史传典故",
    "《晋书·周觊传》王导、周觊故事",
    "李敖转述伯仁典故，保存王导向周觊求援之语。",
  ),
  q(
    "024.",
    11,
    "我不杀伯仁，伯仁因我而死",
    "史传典故",
    "《晋书·周觊传》王导、周觊故事",
    "李敖引伯仁典故的通行说法，说明不直接动手却有间接责任。",
  ),
  q(
    "024.",
    11,
    "吾虽不杀伯仁，伯仁由我而死。幽冥之中，负此良友！",
    "史传典故",
    "《晋书·周觊传》王导、周觊故事",
    "李敖转述《晋书》中王导悔恨周觊之语。",
  ),
];

const proofreadExclusions = new Map();
const proofreadAdditions = rawRows.filter((row) => row.notes.includes("校对补入："));
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
  "李登辉",
  "陈水扁",
  "郑南榕",
  "康宁祥",
  "蓬莱岛",
  "美丽岛",
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

const proofreadExcludedRows = rawRows
  .filter((row) => proofreadExclusions.has(normalizeText(row.quote_text)))
  .map((row) => ({
    ...row,
    proofread_reason: proofreadExclusions.get(normalizeText(row.quote_text)),
  }));

const selectedRows = rawRows
  .filter((row) => !proofreadExclusions.has(normalizeText(row.quote_text)))
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
        ? "校对补入：明确非政治且可独立检索的诗文/成语/典故引文。"
        : "",
    })),
    ...proofreadExcludedRows.map((row) => ({
      ...row,
      decision: "remove-proofread",
    })),
  ].map((row) =>
    reviewHeader
      .map((column) => {
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

const report = {
  book,
  generatedDate,
  sourceDir,
  sourceFiles: files.length,
  candidatesJson,
  reviewCandidatesTsv,
  initialRows: rawRows.length - proofreadAdditions.length,
  proofreadRemovedRows: proofreadExcludedRows.length,
  proofreadAddedRows: proofreadAddedRows.length,
  selectedRows: selectedRows.length,
  removedRows: proofreadExcludedRows.map((row) => ({
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
