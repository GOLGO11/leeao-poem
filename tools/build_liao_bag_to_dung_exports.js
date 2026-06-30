const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = path.resolve(__dirname, "..");
const BOOK = "从万宝囊到臭屎堆";
const ID_PREFIX = "BAGDUNG";
const GENERATED_DATE = "2026-06-30";

const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
if (!corpusDir) throw new Error("Corpus directory not found");

const sectionDir = fs
  .readdirSync(path.join(ROOT, corpusDir))
  .find((name) => name.startsWith("016."));
if (!sectionDir) throw new Error("Section directory 016 not found");

const sourceBookDir = fs
  .readdirSync(path.join(ROOT, corpusDir, sectionDir))
  .find((name) => name.startsWith("008."));
if (!sourceBookDir) throw new Error("Source book directory 008 not found");

const SOURCE_DIR = path.join(ROOT, corpusDir, sectionDir, sourceBookDir);
const OUT_CSV = path.join(ROOT, "exports", `${BOOK}_诗文格言歌谣引用.csv`);
const OUT_TXT = path.join(ROOT, "exports", `${BOOK}_诗文格言歌谣引用.txt`);
const OUT_JSON = path.join(ROOT, "analysis", "liao_bag_to_dung_selected_rows.json");
const REPORT_JSON = path.join(ROOT, "analysis", "liao_bag_to_dung_proofread_build_report.json");
const REJECTS_JSON = path.join(ROOT, "analysis", "liao_bag_to_dung_proofread_rejects.json");
const decoder = new TextDecoder("gb18030");

const POLITICAL_QUOTE_PATTERN =
  /国民党|共产党|中共|民进党|中华民国|三民主义|五权宪法|总统|政府|政权|政党|党国|宪法|司法|立法院|行政院|选举|台湾|大陆|中国|台独|统一|孙中山|蒋介石|蒋经国|李登辉|反共|反攻|革命|意识形态/;

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
      "首轮保守保留：本书政论密度极高，现代政党、国家、宪政、选举、司法、人物攻防类语录不收；本条只因句子本身可作为诗文、成语、经典或格言独立检索而暂留。",
      notes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "006.",
    3,
    "凡是宗教中的门户之争，十分之九都是名词之争。",
    "外国格言",
    "Jacob Abbott 语，经 Lyman Abbott《回忆集》转述",
    "阿勃特父亲关于宗教门派争执多由名词而起的格言。",
  ),
  q(
    "006.",
    3,
    "那剩下的十分之一，也是名词之争。",
    "外国格言",
    "Lyman Abbott 补充语",
    "阿勃特把上一句继续推进，认为连剩余争执也仍是名词之争。",
  ),
  q(
    "006.",
    13,
    "银样镴枪头",
    "成语俗语",
    "传统俗语",
    "比喻外表好看而不中用。",
  ),

  q(
    "010.",
    33,
    "以德抱怨，何如？",
    "儒家经典",
    "《论语·宪问》",
    "《论语》中关于如何回应怨恨的问句；原文作“抱”。",
  ),
  q(
    "010.",
    35,
    "何以报德？以直报怨，以德报德。",
    "儒家经典",
    "《论语·宪问》",
    "孔子以“以直报怨，以德报德”回应以德报怨之问。",
  ),
  q(
    "010.",
    39,
    "报怨以德",
    "道家经典",
    "《老子》第六十三章",
    "《老子》中关于以德回应怨的短句。",
  ),
  q(
    "010.",
    39,
    "和大怨，必有余怨，安可以为善？",
    "道家经典",
    "《老子》第七十九章",
    "《老子》中说明大怨难以轻易和解的反问句。",
  ),

  q(
    "026.",
    7,
    "爰客逃难，求食而已",
    "古人语",
    "古人语",
    "李敖引古人语形容逃难者求食处境。",
  ),
  q(
    "027.",
    7,
    "养兵千日，用在一朝",
    "成语俗语",
    "传统俗语",
    "关于长期供养军队以备关键时刻使用的俗语。",
  ),
  q(
    "027.",
    9,
    "罄竹难书",
    "成语",
    "传统成语",
    "形容事情多到难以写尽。",
  ),
  q(
    "027.",
    11,
    "同是天涯沦落人",
    "古典诗句",
    "白居易《琵琶行》",
    "白居易诗中写同病相怜的名句半联。",
  ),
  q(
    "027.",
    13,
    "慎终追远",
    "儒家经典",
    "《论语·学而》",
    "儒家关于慎重丧祭、追念先人的经典成语。",
  ),

  q(
    "028.",
    5,
    "已经百日窜荆棘，身上无有完肌肤",
    "古典诗句",
    "杜甫《哀王孙》",
    "杜甫写乱离逃难、衣体伤残的诗句。",
  ),
  q(
    "028.",
    5,
    "问之不肯道姓名，但道困苦乞为奴",
    "古典诗句",
    "杜甫《哀王孙》",
    "杜甫写流离者困苦求生的诗句。",
  ),

  q(
    "029.",
    3,
    "檀公三十六策，走是上计。汝父子唯应急走耳！",
    "古籍典故",
    "《南齐书》卷二六",
    "王敬则讽刺东昏侯父子的典故，也是“三十六策，走为上计”的来源之一。",
  ),

  q(
    "030.",
    113,
    "可以死，可以无死，死，伤勇。",
    "儒家经典",
    "《孟子》",
    "孟子关于该死与不该死、无谓赴死反伤勇德的判断。",
  ),
  q(
    "030.",
    117,
    "无求生以害仁",
    "儒家经典",
    "《论语·卫灵公》",
    "孔子关于不以求生损害仁德的经典短句。",
  ),
  q(
    "030.",
    117,
    "有杀身以成仁",
    "儒家经典",
    "《论语·卫灵公》",
    "孔子关于必要时牺牲自身成全仁德的经典短句。",
  ),
  q(
    "030.",
    117,
    "未见蹈仁而死者",
    "儒家经典",
    "孔子语",
    "李敖所引孔子关于少见践仁而死者的感叹。",
  ),

  q(
    "031.",
    3,
    "前年伐月支，城下没全师。\n蕃汉断消息，死生长别离。\n无人收废帐，归马识残旗。\n欲祭疑君在，天涯哭此时。",
    "古典诗歌",
    "张籍《没番故人》",
    "张籍写战乱音讯断绝、生死离别的全诗。",
    9,
  ),
  q(
    "031.",
    9,
    "欲祭疑君在，天涯哭此时。",
    "古典诗句",
    "张籍《没番故人》",
    "张籍诗末联，写生死未明时的祭奠与哀恸。",
  ),

  q(
    "033.",
    145,
    "空手入白刃",
    "成语",
    "传统成语",
    "形容徒手夺取兵刃、制服持械者的技艺或勇力。",
  ),
];

const REJECTS = new Map([
  ["银样镴枪头", "普通俗语，出现在亚运名称政治攻防和粗俗讽刺语境中，校对轮不单列。"],
  ["养兵千日，用在一朝", "普通军事俗语，嵌在老兵政治待遇申诉长引文中，独立诗文格言价值弱。"],
  ["罄竹难书", "普通成语，嵌在私人政治待遇申诉中，单列检索价值弱。"],
  ["空手入白刃", "普通成语，嵌在警察/司法个案批评中，校对轮不单列。"],
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
  csvPath: OUT_CSV,
  txtPath: OUT_TXT,
  selectedJson: OUT_JSON,
  rejectsJson: REJECTS_JSON,
};
fs.writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify(report, null, 2));
