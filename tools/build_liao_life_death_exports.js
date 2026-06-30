const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = path.resolve(__dirname, "..");
const BOOK = "李敖生死书";
const ID_PREFIX = "LIFEDEATH";
const GENERATED_DATE = "2026-06-30";

const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
if (!corpusDir) throw new Error("Corpus directory not found");

const sectionDir = fs
  .readdirSync(path.join(ROOT, corpusDir))
  .find((name) => name.startsWith("016."));
if (!sectionDir) throw new Error("Section directory 016 not found");

const sourceBookDir = fs
  .readdirSync(path.join(ROOT, corpusDir, sectionDir))
  .find((name) => name.startsWith("010."));
if (!sourceBookDir) throw new Error("Source book directory 010 not found");

const SOURCE_DIR = path.join(ROOT, corpusDir, sectionDir, sourceBookDir);
const OUT_CSV = path.join(ROOT, "exports", `${BOOK}_诗文格言歌谣引用.csv`);
const OUT_TXT = path.join(ROOT, "exports", `${BOOK}_诗文格言歌谣引用.txt`);
const OUT_JSON = path.join(ROOT, "analysis", "liao_life_death_selected_rows.json");
const REPORT_JSON = path.join(ROOT, "analysis", "liao_life_death_proofread_build_report.json");
const REJECTS_JSON = path.join(ROOT, "analysis", "liao_life_death_proofread_rejects.json");
const REVIEW_TSV = path.join(ROOT, "analysis", "liao_life_death_review_candidates.tsv");
const decoder = new TextDecoder("gb18030");

const POLITICAL_QUOTE_PATTERN =
  /国民党|共产党|中共|民进党|中华民国|三民主义|总统|政府|政权|政党|党国|宪法|司法|立法院|行政院|选举|台湾|大陆|台独|统一|孙中山|蒋介石|蒋经国|李登辉|反共|反攻|革命|意识形态|政治独立|政府当局|红军|西路军|毛泽东|党争|中央军委|党外|政坛/;

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
  const found = files.find((file) => file.startsWith(selector) || file.includes(selector));
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
      "校对轮保留：本书以死亡、殉难、自杀和历史人物为题，现代党史、政权、革命动员、人物攻防类语录不收；若本条出自政治语境，仅因引用文本本身是外部经典、诗歌、古文、佛典或非政治性格言而保留。",
      notes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "题辞",
    3,
    "未知生，焉知死",
    "儒家经典",
    "《论语·先进》",
    "孔子回答季路问鬼神、生死时的经典句。",
  ),

  q(
    "001.",
    3,
    "不知周之梦为蝴蝶与？蝴蝶之梦为周与？",
    "道家经典",
    "《庄子·齐物论》",
    "庄周梦蝶故事中提出梦与觉、自我与物化边界的名句。",
  ),
  q(
    "001.",
    9,
    "翅轻于粉薄于缯，\n长被花牵不自胜。\n若信庄周尚非我，\n岂能投死为韩凭？",
    "古典诗歌",
    "王安石《蝶》",
    "王安石以庄周梦蝶与韩凭夫妇故事写蝴蝶、情死和物我之辨。",
    15,
  ),
  q(
    "001.",
    15,
    "岂能投死为韩凭？",
    "古典诗句",
    "王安石《蝶》",
    "王安石《蝶》结句，以韩凭故事反问为情而死的可能。",
  ),

  q(
    "003.",
    21,
    "When I am dead and over me bright April\nShakes out her rain-drenched hair,\nThough you should lean above me broken-hearted,\nI shall not care.\nI shall have peace, as leafy trees are peaceful\nAnd I shall be more silent and cold-hearted\nThan you are now.",
    "外国诗歌",
    "Sara Teasdale, I Shall Not Care",
    "莎拉·替滋代尔关于死亡后漠然与平静的英文诗。",
    33,
  ),

  q(
    "006.",
    3,
    "个人是好的，群体是坏的。",
    "外国格言",
    "泰戈尔语，李敖转述",
    "泰戈尔关于个体与群体道德差异的格言。",
  ),

  q(
    "007.",
    9,
    "五十之年，只欠一死，经此世变，义无再辱",
    "绝命词",
    "王国维遗书",
    "王国维遗书中表达经世变后不愿再受辱的绝命语。",
  ),
  q(
    "007.",
    21,
    "不屈旧以就新，亦不绌新以从旧。",
    "学术格言",
    "王国维治学精神，李敖概括",
    "形容王国维治学既不强使旧说迁就新说，也不贬抑新知服从旧说。",
  ),
  q(
    "007.",
    33,
    "不可贪多，亦不可昧全，看全部要清楚，做一部要猛勇。",
    "学术格言",
    "梁启超《王静安先生墓前悼辞》",
    "梁启超论做学问须兼顾全局与专门用力的格言。",
  ),
  q(
    "007.",
    121,
    "归易耳，丈夫不能再辱。",
    "史传典故",
    "《资治通鉴》引李陵语",
    "李陵回答招归时以不能再辱为由不归汉的名句。",
  ),
  q(
    "007.",
    137,
    "不降其志，不辱其身，伯夷叔齐欤？",
    "儒家经典",
    "《论语·微子》",
    "孔子称伯夷、叔齐不降志、不辱身的句子。",
  ),
  q(
    "007.",
    137,
    "违心苟活，比自杀还更苦：一死明志，较偷生还更乐。",
    "现代学人语",
    "梁启超《王静安先生墓前悼辞》",
    "梁启超从中国古代道德观解释王国维自杀意义的判断。",
  ),
  q(
    "007.",
    141,
    "不愿与虚伪恶浊之流同立于此世，一死焉而清刚之气乃永在天壤。",
    "现代学人语",
    "梁启超《王静安先生纪念号序》",
    "梁启超称王国维不愿与虚伪恶浊同世而以死留清刚之气。",
  ),
  q(
    "007.",
    147,
    "劫尽变穷，则此文化精神所凝聚之人，安得不与之共命而同尽",
    "现代学术名句",
    "陈寅恪《王观堂先生挽词》",
    "陈寅恪论文化衰变时，文化精神凝聚者与之共命同尽的句子。",
  ),
  q(
    "007.",
    151,
    "思想而不自由，毋宁死耳。",
    "现代学术名句",
    "陈寅恪《清华大学王观堂先生纪念碑铭》",
    "陈寅恪碑铭中关于思想自由与生命取舍的名句。",
  ),
  q(
    "007.",
    151,
    "唯此独立之精神、自由之思想，历千万祀，与天壤而同久，共三光而永光。",
    "现代学术名句",
    "陈寅恪《清华大学王观堂先生纪念碑铭》",
    "陈寅恪碑铭中称独立精神、自由思想可历久长存的名句。",
  ),

  q(
    "008.",
    11,
    "其余尚五百人在海中，……亦皆自杀。",
    "史传典故",
    "《史记·田儋列传》",
    "田横死后海中五百人亦自杀的史传句。",
  ),
  q(
    "008.",
    67,
    "千古艰难惟一死",
    "古典诗句",
    "传统诗句，梁实秋《清秋琐记》引",
    "梁实秋引以说明不可轻易责人以死的诗句。",
  ),

  q(
    "012.",
    7,
    "藏其魂于墓",
    "外国古典诗文",
    "维吉尔诗中语，李敖转述",
    "维吉尔诗中关于灵魂依附墓葬的说法。",
  ),

  q(
    "015.",
    5,
    "既伤逝者，行自念也。",
    "古典文句",
    "古人语，李敖引",
    "哀伤逝者时也反身自念的文句。",
  ),
  q(
    "015.",
    15,
    "千载朱弦无此悲，\n欲弹孤绝鬼神疑。\n故人舍我闭黄壤，\n流水高山心自知。",
    "古典诗歌",
    "王安石《伯牙》",
    "王安石借伯牙、钟子期典故写知音亡故后的孤绝悲意。",
    21,
  ),
  q(
    "015.",
    19,
    "故人舍我闭黄壤，\n流水高山心自知。",
    "古典诗句",
    "王安石《伯牙》",
    "王安石《伯牙》后半联，写故人入土后高山流水自知的知音之悲。",
    21,
  ),

  q(
    "017.",
    165,
    "知理则不屈，知势则不沮，知节则不穷。",
    "古典格言",
    "苏洵《心术》",
    "苏洵论为将者明理、知势、懂节制方能不屈不沮不穷的句子。",
  ),
  q(
    "017.",
    329,
    "粉身碎骨全不怕，要留清白在人间",
    "古典诗句",
    "于谦《石灰吟》",
    "于谦借石灰写不惧粉身碎骨、只愿清白留世的名句。",
  ),

  q(
    "018.",
    5,
    "远因结远果，近因结近果；善因结善果，恶因结恶果；无量因结无量果。",
    "佛教典籍",
    "《佛本行论》",
    "佛典中以远近、善恶、无量因说明因果相应的句子。",
  ),
];

const proofreadRejects = [
  {
    source: "002.题许以祺摄西藏天葬台.txt:3-25",
    quote_text: "生前不知死，死后觅阴宅。……生前真知死，死后秃鹫来。",
    reason: "李敖为摄影题写的自作诗，本轮不作为外部引用补收。",
  },
  {
    source: "003.四月之死.txt:3-17",
    quote_text: "当我死时，在四月明光，……比你对我，还冷心肠。",
    reason: "李敖据 Sara Teasdale 原诗改作，已保留原英文诗，不重复收改作。",
  },
  {
    source: "004.头颅无价，师出有名.txt:15",
    quote_text: "不杀于谦，此举为无名。",
    reason: "历史政治权术语境中的说法，不作为诗文格言保留。",
  },
  {
    source: "006.戴传贤自杀写真.txt:13",
    quote_text: "I never dared be radical when young / For fear it would make me conservative when old.",
    reason: "弗罗斯特诗句虽为外部诗文，但此处完全用于急进派/保守派的现代政治人格评论，校对轮不补收。",
  },
  {
    source: "006.戴传贤自杀写真.txt:15",
    quote_text: "周朝的天下是八百年，国民党至少要掌握政权一千年。",
    reason: "现代党国政治语录，排除。",
  },
  {
    source: "008.没完的完人.txt:13",
    quote_text: "不成功，便成仁。",
    reason: "在太原五百完人叙事中作为政治动员口号出现，不补收。",
  },
  {
    source: "017.万命归西，直笔属谁？.txt:249-255",
    quote_text: "浩，所有牺牲的战友们，这是唱给你们的葬歌…… / 全军沉血海，敢顾家与身？痛悼诸战友，长风万里吟。",
    reason: "中共西路军和文革叙事中的现代政治军事诗语，排除。",
  },
  {
    source: "017.万命归西，直笔属谁？.txt:269-271",
    quote_text: "血海肉酱、血海肉酱、血海肉酱……",
    reason: "政治军事回忆中的叙述性材料，不是可独立检索的诗文格言。",
  },
  {
    source: "018.你不知道的结果.txt:3-11",
    quote_text: "我再取十两银子与你结果 / 做结果我的使用",
    reason: "古典小说口语释义例证，不作为诗文格言；本篇只保留《佛本行论》因果文句。",
  },
  {
    source: "021.熊熊烈火、死同身受.txt:9-13",
    quote_text: "色替 / 把女人当成独立的人，这是几千年熊熊烈火、死同身受的血泪换来的",
    reason: "文化说明和李敖议论，不是外部诗文格言引用。",
  },
];

const rows = rawRows.map((row, index) => {
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
fs.writeFileSync(REJECTS_JSON, `${JSON.stringify(proofreadRejects, null, 2)}\n`, "utf8");

const politicalQuoteTextHits = rows
  .filter((row) => POLITICAL_QUOTE_PATTERN.test(row.quote_text))
  .map((row) => ({ id: row.id, quote_text: row.quote_text }));

const duplicateQuoteTexts = Array.from(
  rows.reduce((map, row) => map.set(row.quote_text, (map.get(row.quote_text) || 0) + 1), new Map()),
)
  .filter(([, count]) => count > 1)
  .map(([quote_text, count]) => ({ quote_text, count }));

const report = {
  stage: "proofread",
  generatedDate: GENERATED_DATE,
  book: BOOK,
  sourceDir: SOURCE_DIR,
  rows: rows.length,
  proofreadChanges: {
    keptFromFirstPass: rows.length,
    addedRows: 0,
    removedRows: 0,
  },
  firstId: rows[0]?.id,
  lastId: rows.at(-1)?.id,
  politicalQuoteTextHits,
  duplicateQuoteTexts,
  rejectRows: proofreadRejects.length,
  csvPath: OUT_CSV,
  txtPath: OUT_TXT,
  selectedJson: OUT_JSON,
  rejectsJson: REJECTS_JSON,
  reviewCandidatesTsv: REVIEW_TSV,
};
fs.writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify(report, null, 2));
