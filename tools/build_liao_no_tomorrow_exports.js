const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = path.resolve(__dirname, "..");
const BOOK = "我们没有明天";
const ID_PREFIX = "NOMORROW";
const GENERATED_DATE = "2026-06-30";

const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
if (!corpusDir) throw new Error("Corpus directory not found");

const sectionDir = fs
  .readdirSync(path.join(ROOT, corpusDir))
  .find((name) => name.startsWith("016."));
if (!sectionDir) throw new Error("Section directory 016 not found");

const sourceBookDir = fs
  .readdirSync(path.join(ROOT, corpusDir, sectionDir))
  .find((name) => name.startsWith("009."));
if (!sourceBookDir) throw new Error("Source book directory 009 not found");

const SOURCE_DIR = path.join(ROOT, corpusDir, sectionDir, sourceBookDir);
const OUT_CSV = path.join(ROOT, "exports", `${BOOK}_诗文格言歌谣引用.csv`);
const OUT_TXT = path.join(ROOT, "exports", `${BOOK}_诗文格言歌谣引用.txt`);
const OUT_JSON = path.join(ROOT, "analysis", "liao_no_tomorrow_selected_rows.json");
const REPORT_JSON = path.join(ROOT, "analysis", "liao_no_tomorrow_proofread_build_report.json");
const REJECTS_JSON = path.join(ROOT, "analysis", "liao_no_tomorrow_proofread_rejects.json");
const decoder = new TextDecoder("gb18030");

const POLITICAL_QUOTE_PATTERN =
  /国民党|共产党|中共|民进党|中华民国|三民主义|五权宪法|总统|政府|政权|政党|党国|宪法|司法|立法院|行政院|选举|台湾|大陆|台独|统一|孙中山|蒋介石|蒋经国|李登辉|反共|反攻|革命|意识形态|民主政治|政治独立|政府当局/;

const files = fs
  .readdirSync(SOURCE_DIR)
  .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceCache = new Map();
for (const file of files) {
  const text = decoder.decode(fs.readFileSync(path.join(SOURCE_DIR, file))).replace(/^\uFEFF/, "");
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

function relativeSource(file) {
  return path.relative(ROOT, path.join(SOURCE_DIR, file)).split(path.sep).join("/");
}

function normalizeText(value) {
  return String(value || "")
    .replace(/[\uFEFF\r]/g, "")
    .replace(/[“”‘’《》「」『』]/g, "")
    .replace(/\s+/g, "");
}

function assertLocated(row) {
  const source = sourceCache.get(row.file);
  const sourceText = source.lines.slice(row.line_start - 1, row.line_end).join("\n");
  if (!sourceText.includes(row.quote_text) && !normalizeText(sourceText).includes(normalizeText(row.quote_text))) {
    throw new Error(`Quote not found at ${row.file}:${row.line_start}-${row.line_end}: ${row.quote_text}`);
  }
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function q(selector, lineStart, quoteText, category, sourceOrOrigin, summary, lineEnd = lineStart, notes = "") {
  const file = sourceFile(selector);
  return {
    id: "",
    book: BOOK,
    chapter: chapterName(file),
    source_file: relativeSource(file),
    file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrOrigin,
    summary,
    notes: [
      "校对轮保守保留：本书政论密度极高，现代政党、国家、宪政、选举、人物攻防类语录不收；本条只因句子本身可作为诗文、成语、经典或格言独立检索而保留。",
      notes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "009.",
    11,
    "挂印封金",
    "古典小说典故",
    "《三国演义》关羽故事",
    "关羽离曹时留下官印与金银的典故，后用来称辞官去职或不受厚赐。",
  ),
  q(
    "009.",
    11,
    "新恩虽厚，旧义难忘",
    "古典小说语句",
    "《答曹操书》",
    "关羽故事中表达新恩虽重、旧日情义不可忘的句子。",
  ),

  q(
    "014.",
    11,
    "没有人是孤岛",
    "外国诗文格言",
    "英国诗人约翰·多恩语，文中作“英国诗人说”",
    "多恩关于人与人彼此相连、无人能孤立存在的名句。",
  ),

  q(
    "015.",
    11,
    "西南君长以什数，夜郎最大。",
    "史传典故",
    "《史记·西南夷列传》",
    "《史记》写西南诸部中夜郎最大的一句，是夜郎故事的开端。",
  ),
  q(
    "015.",
    11,
    "汉孰与我大？",
    "史传典故",
    "《史记·西南夷列传》",
    "夜郎侯、滇王因道路隔绝而问汉朝与己孰大的典故。",
  ),
  q(
    "015.",
    11,
    "以道不通故，各自以为一州主，不知汉广大。",
    "史传典故",
    "《史记·西南夷列传》",
    "《史记》解释夜郎、滇王不知外界广大而自大的原因。",
  ),
  q(
    "015.",
    17,
    "居蛮夷中久，殊失礼义",
    "史传典故",
    "《史记·郦生陆贾列传》",
    "赵佗听陆贾劝说后自承久居蛮夷而失礼义的句子。",
  ),
  q(
    "015.",
    17,
    "我孰与皇帝贤？",
    "史传典故",
    "《史记·郦生陆贾列传》",
    "赵佗向陆贾自比汉高帝的问句。",
  ),

  q(
    "016.",
    3,
    "草螟弄鸡公",
    "俗语",
    "台湾俗语",
    "比喻弱小者在强者面前挑衅逞强、不知危险。",
  ),

  q(
    "020.",
    7,
    "同是天涯沦落人",
    "古典诗句",
    "白居易《琵琶行》",
    "白居易写同病相怜的名句半联。",
  ),

  q(
    "029.",
    5,
    "蓬生麻中，不扶自直；白沙在泥，与之皆黑。",
    "古典格言",
    "《大戴礼》",
    "以蓬草、白沙说明环境对人的影响。",
  ),
  q(
    "029.",
    5,
    "土地教化使之然也",
    "史传格言",
    "《史记》",
    "《史记》用来解释环境与教化塑造人的一句话。",
  ),

  q(
    "030.",
    23,
    "虽有智慧，不如乘势；虽有镃基（锄头），不如待时。",
    "儒家经典",
    "《孟子》引齐人谚语",
    "孟子所引齐人谚语，强调顺势待时比单凭智慧或工具更重要。",
  ),
  q(
    "030.",
    29,
    "时间——恰恰现在——在时间度过的时候的每一刻——乃是未来。",
    "外国哲理短文",
    "Sophie Kerr《今天是我的未来》",
    "克尔文中宴会故事里关于现在与未来关系的句子。",
  ),
  q(
    "030.",
    31,
    "现在就是未来",
    "外国格言",
    "Sophie Kerr《今天是我的未来》",
    "克尔从时间故事中得到的核心思想。",
  ),
  q(
    "030.",
    33,
    "认为未来就是现在，这想法逼我尽力之所及去向前看、向前想、向前工作。",
    "外国格言",
    "Sophie Kerr《今天是我的未来》",
    "克尔说明“未来就是现在”如何推动人向前思考与工作。",
  ),
  q(
    "030.",
    37,
    "一旦我接受未来就是现在的观念之后，我发现我可以订下一些实际的规则，借以形成未来，那些规则可以演化成为原则、成为指南。",
    "外国格言",
    "Sophie Kerr《今天是我的未来》",
    "克尔说明把未来视为现在后，规则可演化为原则和指南。",
  ),
  q(
    "030.",
    39,
    "周公恐惧流言日，王莽谦恭下士时，设使当时身便死，一生真伪有谁知？",
    "古典诗句",
    "白居易《放言五首·其三》",
    "白居易借周公与王莽说明人一生真伪须看完整行迹。",
  ),

  q(
    "040.",
    21,
    "总该先给人家一点输入英国原版的时间",
    "外国书信语",
    "爱默生致卡莱尔书信",
    "爱默生谈盗印卡莱尔作品时，主张至少先给原版输入一点时间。",
  ),
  q(
    "040.",
    21,
    "我觉得很难为情，你教育我们的青年人，而我们却盗印你的书。有朝一日，我们会有比较完善的法律，也许你们会采用我们的法律。",
    "外国书信语",
    "爱默生致卡莱尔书信",
    "爱默生向卡莱尔解释美国盗印英国书籍时表达的歉意与反讽。",
  ),

  q(
    "042.",
    9,
    "总该先给人家一点输入英国原版的时间",
    "外国书信语",
    "爱默生致卡莱尔书信",
    "同一爱默生书信语在本书另一章中再次被李敖引用。",
  ),
  q(
    "042.",
    9,
    "我觉得很难为情，你教育我们的青年人，而我们却盗印你的书。有朝一日，我们会有比较完善的法律，也许你们会采用我们的法律。",
    "外国书信语",
    "爱默生致卡莱尔书信",
    "同一爱默生书信段落在本书另一章中再次被李敖引用。",
  ),

  q(
    "043.",
    49,
    "我宁可做法国的农夫，穿着木制的鞋子，我宁可居住在草屋之中，门上长满了葡萄藤，紫葡萄在秋阳中沉醉。我宁可做那穷苦的农夫，有爱妻在我旁边，纺织着直到天晚，有孩子在我膝上，臂膀把我环抱。我宁可做这样的人，死于无声无臭的清净世界之中，远胜于做予取予夺的拿破仑大帝。",
    "外国演说引文",
    "英格索评拿破仑",
    "英格索以宁作平凡农夫反衬拿破仑荣光背后的野心与灾难。",
  ),
  q(
    "043.",
    51,
    "凭君莫话封侯事，一将功成万骨枯",
    "古典诗句",
    "曹松《己亥岁二首》",
    "曹松诗中反思战争功名背后无数牺牲的名句。",
  ),
  q(
    "043.",
    103,
    "先为不可胜，以待敌之可胜",
    "古典兵法",
    "《孙子兵法·形篇》",
    "《孙子》关于先立于不败、等待敌方可胜之机的兵法格言。",
  ),
  q(
    "043.",
    103,
    "不战而屈人之兵",
    "古典兵法",
    "《孙子兵法·谋攻篇》",
    "《孙子》关于不用交战而使敌军屈服的名句。",
  ),
  q(
    "043.",
    105,
    "兵，民之残也！……将或弭之，虽曰不可？必将许之！",
    "古典史传",
    "《左传》弭兵相关记载",
    "春秋弭兵会议语境中说明战争伤民、弭兵应许的句子。",
  ),
];

const REJECTS = new Map([
  [
    "草螟弄鸡公",
    "台湾政治讽刺章节的核心比喻，后文直接展开台湾/大陆、党派与候选人攻防；虽为俗语，但在本书语境中过度绑定现代政治论战，校对轮删除。",
  ],
]);

const rejectedRows = rawRows
  .map((row, index) => ({
    draft_id: `${ID_PREFIX}-${String(index + 1).padStart(3, "0")}`,
    quote_text: row.quote_text,
    category: row.category,
    source_or_origin: row.source_or_origin,
    chapter: chapterName(row.file),
    source_file: relativeSource(row.file),
    line_start: row.line_start,
    line_end: row.line_end,
    reason: REJECTS.get(row.quote_text),
  }))
  .filter((row) => row.reason);

const selectedRows = rawRows.filter((row) => !REJECTS.has(row.quote_text));

const rows = selectedRows.map((row, index) => {
  const output = { ...row, id: `${ID_PREFIX}-${String(index + 1).padStart(3, "0")}` };
  delete output.file;
  return output;
});

for (const row of rawRows) assertLocated(row);

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

fs.mkdirSync(path.dirname(OUT_CSV), { recursive: true });
fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });

const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
].join("\r\n");
fs.writeFileSync(OUT_CSV, `${csv}\r\n`, "utf8");

const txt = [];
for (const row of rows) {
  txt.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  txt.push(`引用：${row.quote_text}`);
  txt.push(`出处线索：${row.source_or_origin}`);
  txt.push(`摘要：${row.summary}`);
  if (row.notes) txt.push(`备注：${row.notes}`);
  txt.push("");
}
fs.writeFileSync(OUT_TXT, `${txt.join("\r\n")}\r\n`, "utf8");
fs.writeFileSync(OUT_JSON, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
fs.writeFileSync(REJECTS_JSON, `${JSON.stringify(rejectedRows, null, 2)}\n`, "utf8");

const politicalQuoteTextHits = rows
  .filter((row) => POLITICAL_QUOTE_PATTERN.test(row.quote_text))
  .map((row) => ({ id: row.id, quote_text: row.quote_text }));

const duplicateQuoteTexts = Array.from(
  rows.reduce((map, row) => map.set(row.quote_text, (map.get(row.quote_text) || 0) + 1), new Map()),
)
  .filter(([, count]) => count > 1)
  .map(([quote_text, count]) => ({ quote_text, count }));

const report = {
  generatedDate: GENERATED_DATE,
  book: BOOK,
  sourceDir: SOURCE_DIR,
  rawRows: rawRows.length,
  removedRows: rejectedRows.length,
  rows: rows.length,
  firstId: rows[0]?.id,
  lastId: rows.at(-1)?.id,
  politicalQuoteTextHits,
  duplicateQuoteTexts,
  csvPath: OUT_CSV,
  txtPath: OUT_TXT,
  selectedJson: OUT_JSON,
  rejectsJson: REJECTS_JSON,
};
fs.writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify(report, null, 2));
