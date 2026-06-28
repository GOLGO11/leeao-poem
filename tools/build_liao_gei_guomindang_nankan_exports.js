const fs = require("fs");
const path = require("path");

const book = "给国民党难看";
const idPrefix = "LAGMDNK";
const generatedDate = "2026-06-28";
const sourceDir = path.join("《大李敖全集6.0》分章节", "013.国民党史政", "005.给国民党难看");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_make_kuomintang_look_bad_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_make_kuomintang_look_bad_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_make_kuomintang_look_bad_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_make_kuomintang_look_bad_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_make_kuomintang_look_bad_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_make_kuomintang_look_bad_proofread_report.txt");
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
    .replace(/[“”‘’'「」『』]/g, "")
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
      "校对后从严保留：《给国民党难看》以现代政党、党报、军政、司法、两岸、选举与政治人物攻防为主体；现代政党口号、政治宣言、公文条款、党报社论、人物政论、革命/反共/统独/民主自由人权等政治语录不收，只保留可脱离具体政治攻防独立检索的古典诗文、典籍成句、成语俗语、寓言、文学评语、外文格言和非政治生活格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q("001.", 5, "一眠大一寸", "俗语成句", "中文俗语", "李敖借儿童成长俗语，形容事物迅速膨胀。"),

  q("004.", 9, "天道好还", "成语格言", "中文成语/因果俗语", "李敖摘出成语，写恶事终有回报、真相终会返还。"),

  q(
    "010.",
    5,
    "宋之亡也，死国事者多矣！陆秀夫、张世杰死于海；李芾死于潭；赵昂发死于池……不可胜数。虽然，死矣，未有如公之出万死而后死。……自古亡国之臣，未有如公之烈也！收宋三百年养士之功、立千万载为臣之极，不在于公乎？公非仁者之勇，浩然塞于天地之间者乎？",
    "古文引文",
    "罗伦《宋丞相文信国公祠堂记》",
    "李敖引用明人祠堂记文字，说明文天祥从容殉节的古典评价。",
    5,
    "只收古文评价本体，不收同章现代政治人物效法文天祥的讲话。",
  ),
  q(
    "010.",
    11,
    "孔曰成仁，孟云取义，唯其义尽，所以仁至；读圣贤书，所学何事，而今而后，庶几无愧。",
    "古典名句",
    "文天祥临终衣带赞相关文字",
    "李敖转引文天祥名句，呈现成仁取义与读书立身的古典伦理。",
    11,
    "只收文天祥古典名句，不收同段现代军政安排语境。",
  ),

  q("011.", 17, "败军之将，不足以言勇。", "古语格言", "中文古话", "李敖明引古话，说明失败者不宜自夸勇武。"),

  q("014.", 11, "狭巷短兵相接处，杀人如草不闻声。", "明代诗句", "沈明臣《铙歌》", "李敖引用明代诗句，取其沉郁意象写无声杀戮的恐怖。"),

  q(
    "016.",
    17,
    "天之亡我，我何渡为？且籍与江东子弟八千人渡江而西，今无一人还，纵江东父兄，怜而王我，我何面目见之？纵彼不言，籍独不愧于心乎？",
    "史记名句",
    "《史记·项羽本纪》",
    "李敖引用项羽乌江不渡名句，呈现羞见江东父兄的历史典故。",
  ),

  q("018.", 21, "盗固不义，而跖非诛盗之人。", "古语格言", "中文古话", "李敖明引古话，说明作恶者无资格制裁同类小恶。"),

  q("023.", 3, "死节之行", "史传成句", "《史记·李斯传》相关释义", "李敖引用古籍释义，说明烈士一词古义中的死节行为。"),
  q("023.", 3, "视死若生", "庄子成句", "《庄子·秋水》", "李敖引用庄子成句，说明视死如归的精神状态。"),
  q("023.", 3, "甘危躯以成仁", "文选名句", "《昭明文选·曹植·七启》", "李敖引用古文名句，说明舍身成仁的古典表达。"),
  q("023.", 3, "烈士暮年，壮心不已", "古诗名句", "曹操《龟虽寿》", "李敖引用曹操诗句，说明烈士也可指秉性刚正、壮心未衰者。"),
  q("023.", 3, "烈士壮心虽未减，狂奴故态有谁容？", "宋诗名句", "陆游诗句", "李敖引用陆游诗句，说明烈士一词在诗中的宽泛用法。"),
  q("023.", 3, "烈士肝肠名士胆，杀人手段救人心", "联语", "彭玉麟联语", "李敖引用彭玉麟联语，说明烈士与名士胆识的文学习用。"),
  q("023.", 3, "好名义不进仕者", "古文释义", "《韩非子·诡使》", "李敖引用韩非子释义，说明烈士古义中好名义而不仕的一类人。"),

  q("026.", 13, "面目可憎，言语无味", "古文成句", "韩愈《送穷文》相关成句", "李敖借古文成句，讽刺演说者仪态与言辞都令人厌烦。"),
  q("026.", 13, "黄河之水天上来", "唐诗名句", "李白《将进酒》", "李敖化用李白名句，形容演说拖沓如滔滔不绝。"),

  q(
    "027.",
    7,
    "所有的礼物我都收下了，但从你的口里，我不敢收任何东西。",
    "寓言名句",
    "伊索寓言",
    "李敖转述伊索寓言中宙斯拒收蛇口玫瑰的句子，表达对有毒来源的警惕。",
  ),

  q("028.", 7, "天威难测", "成语", "中文成语", "李敖摘出传统成语，写上位者意志难以预测。"),
  q("028.", 9, "赏赐的是耶和华，收回的也是他。", "圣经成句", "《圣经·约伯记》相关成句", "李敖引用圣经成句，说明赏赐与收回都出于同一来源。"),
  q("028.", 9, "赵孟之所贵，赵孟能贱之。", "孟子名句", "《孟子》", "李敖引用孟子成句，说明由权势给予的尊贵也可被权势贬抑。"),
  q("028.", 9, "来如春梦、去似朝云", "诗化成句", "中文诗文成句", "李敖借诗化成句，形容荣华来去无凭、难以掌握。"),

  q("029.", 3, "寇准好宰相，但年尚少耳！", "历史人物语录", "宋太宗语；李心传《旧闻证误》转述", "李敖引用宋人记载中的人物评语，说明年轻任相的历史趣闻。"),

  q("030.", 17, "我无为而民自化", "道家名句", "《老子》", "李敖引用老子名句，说明文化自化优于官式塑造。"),
  q("030.", 17, "救人一命，胜造七级浮屠", "佛教俗语", "中文佛教俗语", "李敖引用古话，借救命胜造浮屠来反讽减少干预也可救文化。"),

  q("031.", 3, "且作神仙舞，愿为流俗惊。曲终人又见，江上一峰青。", "李敖自题诗", "李敖题赠江青诗", "李敖记录自己题诗，取舞姿、流俗与钱起诗意构成赠诗。"),

  q("036.", 21, "才子加流氓", "现代文学评语", "鲁迅评郭沫若语", "李敖引用鲁迅评语，说明才气与流氓气并存的讽刺说法。"),
  q("036.", 21, "岂后辈龌龊小生所可语耶！", "现代文学评语", "王国维语", "李敖引用王国维评语，说明后辈小生难以置喙的学术与才气高度。"),
  q("036.", 27, "回眸一笑百媚生", "唐诗名句", "白居易《长恨歌》", "李敖化用白居易名句，写舞姿回眸的媚态。"),
  q("036.", 33, "识时务者为俊杰", "成语格言", "中文成语", "李敖引用成语，说明能看清时势者被称为俊杰。"),
  q("036.", 35, "不待智者而后知", "古文成句", "中文古语", "李敖引用古语，说明某事明显到不必等智者才知道。"),

  q("038.", 5, "I do not mind lying, but I hate inaccuracy.", "外文格言", "Samuel Butler", "李敖引用巴特勒英文格言，区别撒谎与粗疏不准确。"),
  q("038.", 15, "狼来了！", "寓言俗语", "伊索寓言/中文俗语", "李敖引用喊狼来了的寓言俗语，说明谎话喊久后失信。"),

  q("041.", 5, "贼咬一口烂三分", "俗语", "中文俗语", "李敖明引俗话，说明被恶名者一咬便更难洗清。"),

  q(
    "042.",
    7,
    "沉者自沉，浮者自浮，殷洪乔不能作致书邮！",
    "世说新语典故",
    "《世说新语》殷洪乔故事",
    "李敖引用殷洪乔弃信典故，写书信任其浮沉的荒唐。",
  ),

  q("044.", 11, "苦心人天不负，有志者事竟成", "格言联语", "中文格言", "李敖转引常见格言，说明苦心与有志终能成事。"),
  q("044.", 27, "向壁虚造", "成语", "中文成语", "李敖引用成语，指凭空虚构、没有根据。"),
  q("044.", 27, "以讹传讹", "成语", "中文成语", "李敖引用成语，指错误信息层层传播。"),
  q("044.", 27, "张冠李戴", "成语", "中文成语", "李敖引用成语，指误把甲事套到乙事。"),
  q("044.", 29, "隔行如隔山", "俗语", "中文俗语", "李敖引用俗语，说明专业隔阂很大。"),
  q("044.", 29, "某也幸，苟有过，人必知之", "论语成句", "孔子语；《论语·述而》相关", "李敖引用孔子语，说明有过失能被他人指出反是幸运。"),
];

const proofreadExclusions = new Map(
  [
    [
      "天威难测",
      "虽是传统成语，但本章明指上位者统御术与传统政治艺术，政治语义过重，校对从严删除。",
    ],
  ].map(([quoteText, reason]) => [normalizeText(quoteText), reason]),
);

const proofreadAdditions = [
  q("041.", 5, "天下之恶皆归之", "格言成句", "中文成句", "李敖摘出成句，说明恶名昭著者容易承受一切恶事归咎。"),
];
const proofreadAdditionTexts = new Set(proofreadAdditions.map((row) => normalizeText(row.quote_text)));

const modernPoliticalTerms = [
  "国民党",
  "共产党",
  "中共",
  "台独",
  "民进党",
  "三民主义",
  "政治",
  "政党",
  "政府",
  "政权",
  "总统",
  "总理",
  "领袖",
  "党国",
  "革命",
  "反共",
  "反攻",
  "复国",
  "统一",
  "独立",
  "民主",
  "自由",
  "人权",
  "党义",
  "宪法",
  "司法",
  "法院",
  "戒严",
  "国安法",
  "军法",
  "选举",
  "立委",
  "行政院",
  "立法院",
  "监察院",
  "宣传",
  "党报",
  "党外",
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
  if (a.line_start !== b.line_start) return a.line_start - b.line_start;
  return a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN");
}

const initialRows = rawRows.slice().sort(rowCompare);
const proofreadExcludedRows = initialRows
  .map((row, index) => ({
    ...row,
    original_id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
    proofread_reason: proofreadExclusions.get(normalizeText(row.quote_text)),
  }))
  .filter((row) => row.proofread_reason);

const selectedRows = [
  ...initialRows.filter((row) => !proofreadExclusions.has(normalizeText(row.quote_text))),
  ...proofreadAdditions,
].sort(rowCompare).map((row, index) => ({
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
const reviewRows = [
  ...selectedRows.map((row) => ({
    ...row,
    decision: "keep-proofread",
    proofread_reason: proofreadAdditionTexts.has(normalizeText(row.quote_text))
      ? "校对补入：同章明引通用格言，非政治语录。"
      : "",
  })),
  ...proofreadExcludedRows.map((row) => ({
    ...row,
    id: row.original_id,
    decision: "remove-proofread",
  })),
].sort((a, b) => {
  const diff = rowCompare(a, b);
  if (diff) return diff;
  return String(a.decision).localeCompare(String(b.decision), "zh-Hans-CN");
});
const reviewLines = [
  reviewHeader.join("\t"),
  ...reviewRows.map((row) =>
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
