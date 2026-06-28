const fs = require("fs");
const path = require("path");

const book = "给台湾人难看";
const idPrefix = "LAGTWRNK";
const generatedDate = "2026-06-28";

const corpusDir = fs.readdirSync(process.cwd()).find((name) => name.includes("6.0"));
if (!corpusDir) throw new Error("Corpus directory not found");
const sectionDir = fs.readdirSync(corpusDir).find((name) => name.startsWith("014."));
if (!sectionDir) throw new Error("Section directory 014 not found");
const sourceBookDir = fs
  .readdirSync(path.join(corpusDir, sectionDir))
  .find((name) => name.startsWith("006.") && name.includes("给台湾人难看"));
if (!sourceBookDir) throw new Error("Source book directory 006 not found");
const sourceDir = path.join(corpusDir, sectionDir, sourceBookDir);

const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_make_taiwanren_look_bad_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_make_taiwanren_look_bad_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_make_taiwanren_look_bad_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_make_taiwanren_look_bad_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_make_taiwanren_look_bad_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_make_taiwanren_look_bad_proofread_report.txt");
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
    .replace(/[“”‘’《》「」『』]/g, "")
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
      "校对后从严保留：《给台湾人难看》以台湾政党、人物、媒体、司法与选举攻防为主；现代政治宣言、新闻评论、法规条文、党派攻防、人物政论、统独/民主/人权/司法口号不收，只保留句子本体可独立检索的古典成句、诗文、俗谚、宗教与外国格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    5,
    "立德、立功、立言",
    "左传名句",
    "《左传·襄公二十四年》三不朽语",
    "李敖引用古人三不朽说法中的立德、立功、立言。",
  ),
  q(
    "001.",
    19,
    "温故知新",
    "论语成句",
    "《论语·为政》",
    "李敖列举《台湾通史》原版题字时保存温故知新成句。",
    19,
    "仅收成句本体，不收同段现代台湾史与民族大义论述。",
  ),
  q(
    "001.",
    19,
    "名山绝业",
    "题辞成句",
    "《台湾通史》日文原版题辞",
    "李敖列举《台湾通史》题字，保存名山绝业一语。",
    19,
    "仅收题辞本体，不收同段历史政治评价。",
  ),
  q(
    "001.",
    19,
    "文献可征",
    "成语题辞",
    "《台湾通史》原版题辞",
    "李敖列举《台湾通史》题字，保存文献可征成语。",
    19,
    "仅收成句本体，不收同段历史政治评价。",
  ),

  q(
    "003.",
    13,
    "鱼烂河决",
    "古典成语",
    "中文成语",
    "李敖借鱼烂河决成语，写债务局面腐败崩坏、不可收拾。",
  ),
  q(
    "003.",
    23,
    "地阔钱穷",
    "现代经济成句",
    "Land Rich, Cash Poor",
    "李敖转述以地阔钱穷形容资产多而现金困窘的状态。",
  ),

  q(
    "005.",
    29,
    "观其姓名，已为鬼录，追思昔游，犹在心目",
    "魏晋文句",
    "曹丕《与吴质书》",
    "李敖引用曹丕致吴质书语，写旧友凋零后追念往游。",
  ),
  q(
    "005.",
    31,
    "己欲立而立人，己欲达而达人",
    "儒家名句",
    "《论语·雍也》",
    "李敖引用儒家成句，说明成己成人、达己达人之胸襟。",
  ),
  q(
    "005.",
    31,
    "达则兼济天下",
    "儒家成句",
    "《孟子·尽心上》相关成句",
    "李敖引用孟子成句，说明得志时兼善天下的理想。",
  ),
  q(
    "005.",
    51,
    "一曲高歌一樽酒，一人独钓一江秋",
    "清诗名句",
    "王渔洋诗句",
    "李敖引用王渔洋诗句，写寂寞而高洁的审美境界。",
  ),

  q(
    "009.",
    15,
    "凯撒之妻当超乎怀疑之上。",
    "外国格言",
    "布鲁塔克《希腊罗马名人传》相关典故",
    "李敖纠正误托莎士比亚的说法，转述凯撒休妻典故中的格言。",
  ),
  q(
    "009.",
    15,
    "长者为行，不使人疑之。",
    "史记名句",
    "《史记·刺客列传》田光语",
    "李敖以《史记》田光语对照凯撒典故，保存不使人疑的古文成句。",
  ),

  q(
    "011.",
    17,
    "老子当年勇",
    "俗语成句",
    "中文俗语",
    "李敖引用老子当年勇俗语，写人年老后夸说往日英勇。",
  ),

  q(
    "025.",
    35,
    "前人种树，后人夺树而纳凉",
    "谚语改写",
    "中文俗谚“前人种树，后人乘凉”的改写",
    "李敖转述文证中的谚语改写，用以讽刺夺取前人事业成果。",
  ),

  q(
    "029.",
    11,
    "老圃闲谈未易欺",
    "古人诗句",
    "古人诗句",
    "李敖引用中国人常说的诗句，说明民间见闻不容易被谎言欺骗。",
  ),
  q(
    "029.",
    11,
    "路上行人口似碑",
    "俗谚诗句",
    "中文俗谚/诗化成句",
    "李敖引用路上行人口似碑，说明路人口碑足以传扬真相。",
  ),

  q(
    "030.",
    5,
    "执之而已矣！",
    "孟子引文",
    "《孟子·尽心上》",
    "李敖引用孟子答桃应语，保存遇亲犯法时仍应拘执的古文断句。",
  ),
  q(
    "030.",
    5,
    "夫舜恶得而禁之？夫有所受之也！",
    "孟子引文",
    "《孟子·尽心上》",
    "李敖引用孟子语，说明舜不能阻止皋陶执法之理由。",
  ),
  q(
    "030.",
    5,
    "舜视弃天下，犹弃敝屣也！窃负而逃，遵海滨而处，终身欣然，乐而忘天下。",
    "孟子名句",
    "《孟子·尽心上》",
    "李敖引用孟子关于舜弃天下、负父而逃的故事名句。",
  ),
  q(
    "030.",
    7,
    "追而不及，不当伏罪，子其治事矣。",
    "史记引文",
    "《史记·循吏列传》",
    "李敖引用楚昭王宽宥石奢之语，保存古代法情冲突故事中的原文。",
  ),
  q(
    "030.",
    7,
    "不私其父，非孝子也；不奉主法，非忠臣也。王赦其罪，上惠也；伏诛而死，臣职也。",
    "史记名句",
    "《史记·循吏列传》石奢语",
    "李敖引用石奢自陈语，呈现孝与忠、私亲与奉法冲突的古文判断。",
  ),

  q(
    "034.",
    19,
    "当一名绅士的难处之一是，你不被允许粗暴的主张自己的权利。",
    "外国人物格言",
    "巴特勒语",
    "李敖转引巴特勒关于绅士风度与权利表达的格言。",
  ),
  q(
    "034.",
    19,
    "其争也君子",
    "论语成句",
    "《论语·八佾》",
    "李敖引用论语成句，说明争论中仍应保持君子风度。",
  ),

  q(
    "035.",
    11,
    "彼有酒器！",
    "历史轶事语",
    "刘备、简雍禁酒轶事",
    "李敖转述刘备禁酒轶事中的话，作为以器具推断罪行的荒谬例子。",
  ),
  q(
    "035.",
    11,
    "彼有淫具！",
    "历史轶事语",
    "刘备、简雍禁酒轶事",
    "李敖转述简雍反讽刘备的话，借荒诞类比讽刺以物定罪。",
  ),
  q(
    "035.",
    11,
    "淫者见之以为淫",
    "俗话格言",
    "中文俗话",
    "李敖引用俗话，说明心中有淫念者看什么都以为淫。",
  ),

  q(
    "037.",
    5,
    "拿人的手短、吃人的嘴软",
    "俗语格言",
    "中文俗语",
    "李敖引用俗语，说明受人财物后容易产生人情负担。",
  ),
  q(
    "037.",
    17,
    "他们所种的是风，所收的是暴风（They have sown the wind, and they shall reap the whirlwind.）。",
    "宗教经典",
    "《旧约·何西阿书》",
    "李敖引用《何西阿书》成句，说明作恶者终会收获更大的报应。",
  ),
];

const proofreadAdditions = [
  q(
    "001.",
    21,
    "遇人不淑",
    "诗经成语",
    "《诗经·王风·中谷有蓷》相关成语",
    "李敖以遇人不淑概括章太炎为连横题辞后被摆布的处境，句子本体为传统成语。",
    21,
    "校对补入：只收成语本体，不收同段章太炎题辞和台湾归属论述。",
  ),
  q(
    "001.",
    25,
    "威武不屈",
    "孟子成语",
    "《孟子·滕文公下》“威武不能屈”化用",
    "李敖反驳报纸称连横威武不屈时保留此成语本体。",
    25,
    "校对补入：只收成语本体，不收报纸人物评价和殖民史政治语境。",
  ),
  q(
    "003.",
    7,
    "以退为进",
    "策略成语",
    "中文成语",
    "李敖列举辜振甫处理债务纠纷时使用以退为进的策略成语。",
  ),
  q(
    "003.",
    7,
    "金蝉脱壳",
    "三十六计成语",
    "《三十六计》相关成语",
    "李敖以金蝉脱壳形容脱身计策，保存传统计谋成语。",
  ),
  q(
    "003.",
    7,
    "拖刀计",
    "传统计谋成语",
    "中文计谋成语",
    "李敖列举拖刀计作为策略说法，保存民间计谋成语。",
  ),
  q(
    "004.",
    15,
    "水涨船高",
    "中文成语",
    "中文成语",
    "李敖使用水涨船高说明情势连带上升，句子本体为常用成语。",
  ),
  q(
    "005.",
    11,
    "浑水摸鱼",
    "中文成语",
    "中文成语/三十六计相关说法",
    "李敖以浑水摸鱼形容趁乱取利，保存独立成语本体。",
  ),
  q(
    "005.",
    31,
    "故乡无此好风光",
    "文学成句",
    "苏东坡杭州相关掌故",
    "李敖转述苏东坡在杭州时的感叹，保存文学掌故成句。",
  ),
  q(
    "006.",
    27,
    "利令智昏",
    "中文成语",
    "中文成语",
    "李敖用利令智昏写人因利益而失去判断，保存传统成语本体。",
  ),
  q(
    "009.",
    15,
    "Caesar’s wife should be above suspicion.",
    "外文格言",
    "恺撒之妻典故英译",
    "李敖考辨恺撒之妻典故时保留英文格言形式。",
    15,
    "校对补入：本书已收中文转述，此处补一条原文式英文格言，避免再收 must 变体造成重复。",
  ),
  q(
    "025.",
    13,
    "创业维艰",
    "中文成语",
    "中文成语",
    "文证中使用创业维艰概括事业草创不易，句子本体可独立检索。",
  ),
  q(
    "025.",
    33,
    "生花妙舌",
    "中文成语",
    "中文成语",
    "李敖以生花妙舌写巧妙言说，保存成语本体。",
  ),
  q(
    "033.",
    43,
    "无血无目屎",
    "台语俗语",
    "台湾话俗语",
    "李敖明示台湾话无血无目屎，保存地方俗谚本体。",
  ),
  q(
    "038.",
    7,
    "劣币驱逐良币",
    "经济学格言",
    "格雷欣法则通俗表述",
    "李敖引用劣币驱逐良币说明价值被坏币排挤的经济学格言。",
    7,
    "校对补入：只收经济学格言本体，不收同段现代政治制度例证。",
  ),
];

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
  "戒严",
  "军法",
  "选举",
  "立委",
  "行政院",
  "立法院",
  "监察院",
  "司法院",
  "宣传",
  "台湾",
  "大陆",
  "中国",
  "台独",
];

const omittedBoundaryExamples = [
  {
    source: "001.孙子媚国民党，爷爷媚日本人.txt:21",
    quote_text:
      "台湾在明时，无过海中一浮岛。日本荷兰更相夺攘，亦但羁縻不绝而已，未足云建置也。",
    reason: "章太炎题辞虽为文言，但核心是现代台湾史与国家归属论述，按政治语录排除。",
  },
  {
    source: "009.林洋港与莎士比亚.txt:5",
    quote_text: "皇后的贞节连受怀疑都不准许",
    reason: "本章明确说明此句误托莎士比亚，且直接服务现代司法政治攻防，不收。",
  },
  {
    source: "029.从郭婉容的谎话说起.txt:11",
    quote_text: "人民的眼睛是雪亮的",
    reason: "现代政治宣传/政治人物语录色彩过重，总表已有同类排除口径。",
  },
  {
    source: "031.从关说到求情.txt:11",
    quote_text: "只能求情而不能控诉，这是人治，不是法治。",
    reason: "胡适现代法治政论引文，虽可警句化，仍按现代政治/法治语录排除。",
  },
  {
    source: "034.朱高正组党以后.txt:17",
    quote_text: "民主政治的最大特色，在于它是一种生活方式、一种教养、一种格调",
    reason: "现代民主政治论断，按政治语录排除；仅保留同段可独立成立的《论语》成句。",
  },
  {
    source: "033.《民众日报》公布李氏父子黑资料.txt:13",
    quote_text: "吃人口软拿人手短",
    reason: "虽是俗谚变体，但本书已收近似句“拿人的手短、吃人的嘴软”，且此处嵌在现代政治书信攻防中，校对轮不重复收入。",
  },
  {
    source: "033.《民众日报》公布李氏父子黑资料.txt:47",
    quote_text: "做伙打拼",
    reason: "台语口号直接服务现代选举与政党动员语境，按政治语录排除。",
  },
  {
    source: "038.近闻零感.txt:15",
    quote_text: "一走了之",
    reason: "普通口语成语嵌在中央民意代表去留争议中，独立引用价值不足且政治语境过重，校对轮不收。",
  },
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

function rowKey(row) {
  return `${row.source_file}:${row.line_start}:${row.line_end}:${normalizeText(row.quote_text)}`;
}

const proofreadAdditionKeys = new Set(proofreadAdditions.map(rowKey));
const selectedRows = rawRows
  .concat(proofreadAdditions)
  .slice()
  .sort(rowCompare)
  .map((row, index) => ({
    ...row,
    id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
  }));
const addedRows = selectedRows.filter((row) => proofreadAdditionKeys.has(rowKey(row)));

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
  "notes",
];
const reviewLines = [
  reviewHeader.join("\t"),
  ...selectedRows.map((row) =>
    reviewHeader
      .map((column) => {
        if (column === "decision") return proofreadAdditionKeys.has(rowKey(row)) ? "add-proofread" : "keep-proofread";
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
  initialRowsBeforeProofread: rawRows.length,
  selectedRows: selectedRows.length,
  proofreadAddedRows: addedRows.map((row) => ({
    id: row.id,
    quote_text: row.quote_text,
    source_file: row.source_file,
    line_start: row.line_start,
    category: row.category,
  })),
  proofreadRemovedRows: [],
  missingQuotes: missing.map((item) => item.row.id),
  politicalHits: politicalHits.map((item) => ({
    id: item.row.id,
    quote_text: item.row.quote_text,
    hits: item.politicalHits,
  })),
  duplicateQuotes: duplicates.map((row) => row.id),
  omittedBoundaryExamples,
  csvPath: outCsv,
  txtPath: outTxt,
  selectedJson,
  reviewTsv,
  auditTsv,
};
fs.writeFileSync(reportTxt, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify(report, null, 2));
