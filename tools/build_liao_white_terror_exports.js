const fs = require("fs");
const path = require("path");

const book = "白色恐怖述奇";
const idPrefix = "LABSKBSQ";
const generatedDate = "2026-06-28";

const corpusDir = fs.readdirSync(process.cwd()).find((name) => name.includes("6.0"));
if (!corpusDir) throw new Error("Corpus directory not found");
const sectionDir = fs.readdirSync(corpusDir).find((name) => name.startsWith("014."));
if (!sectionDir) throw new Error("Section directory 014 not found");
const sourceBookDir = fs
  .readdirSync(path.join(corpusDir, sectionDir))
  .find((name) => name.startsWith("005.") && name.includes("白色恐怖述奇"));
if (!sourceBookDir) throw new Error("Source book directory 005 not found");
const sourceDir = path.join(corpusDir, sectionDir, sourceBookDir);

const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_white_terror_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_white_terror_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_white_terror_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_white_terror_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_white_terror_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_white_terror_proofread_report.txt");
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

function q(
  selector,
  lineStart,
  quoteText,
  category,
  sourceOrOrigin,
  summary,
  lineEnd = lineStart,
  extraNotes = "",
) {
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
      "校对后从严保留：《白色恐怖述奇》政治、白色恐怖、审判、牢狱和党国案件语境极密，现代政论、供词、牢狱术语、政治人物语录、党派/民主/自由口号不收；只取句子本体可独立成立的古典诗文、宗教经典、成语俗谚和少量文学性引文。",
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
    "杀人如草不闻声",
    "古典诗句",
    "明朝诗句，文中称不看《明史》者不熟知",
    "李敖引用明人诗句，写大规模杀戮无声无闻的惨烈景象。",
  ),
  q(
    "002.",
    7,
    "烈士肝肠名士胆，杀人手段救人心",
    "近代诗联",
    "清人彭玉麟自谓语",
    "李敖引用彭玉麟诗联，呈现烈士心肠、名士胆识与杀人救人的矛盾姿态。",
  ),
  q(
    "002.",
    7,
    "奇正之变",
    "兵法典故",
    "《孙子兵法》相关术语",
    "李敖引用兵法中奇正变化的观念，说明手段转换与策略变化。",
  ),
  q(
    "002.",
    9,
    "怙恶不悛",
    "古典成语",
    "《左传》语源成语",
    "李敖引用怙恶不悛成语，写作恶而不肯悔改。",
  ),
  q(
    "005.",
    17,
    "神的选民，昼夜呼吁他，他纵然为他们忍了多时，岂不终久给他们申冤么？我告诉你们，要快快的给他们申冤了。",
    "宗教经典",
    "《新约·路加福音》第十八章第七节",
    "李敖引用《路加福音》文字，强调伸冤终会临到受屈者。",
  ),
  q(
    "005.",
    17,
    "说亲爱的弟兄，不要自己申冤，宁可让步，听凭主怒。因为经上记着，‘主说，申冤在我，我必报应。’",
    "宗教经典",
    "《新约·罗马书》第十二章第十九节",
    "李敖引用《罗马书》文字，说明报应与伸冤归于上主。",
  ),
  q(
    "005.",
    17,
    "爱人如己",
    "宗教格言",
    "《圣经》成句",
    "李敖在谈耶稣身教时引用爱人如己，作为基督教伦理成句。",
    17,
    "校对补入：同段《圣经》语境明确，总表已有同类先例；句子本体为非政治宗教伦理格言。",
  ),
  q(
    "009.",
    9,
    "入则心非，出则巷议",
    "史传文句",
    "《史记·秦始皇本纪》",
    "李敖引用《史记》成句，写心中非议与出外议论的状态。",
  ),
  q(
    "009.",
    9,
    "日夜招聚天下豪杰壮士与论议，腹非而心谤",
    "史传文句",
    "《史记·魏其武安侯列传》",
    "李敖引用《史记》成句，写聚众议论与腹中心谤的罪名化。",
  ),
  q(
    "009.",
    13,
    "今王侯朝贺以苍璧，直数千，而其皮荐反四十万，本末不相称。",
    "史传文句",
    "《史记·平准书》颜异语",
    "李敖引用颜异评白鹿皮币的话，说明本末价值倒置。",
  ),
  q(
    "009.",
    13,
    "自是之后，有“腹诽”之法比，而公卿大夫多谄谀取容矣！",
    "史传文句",
    "《史记·平准书》",
    "李敖引用《史记》关于腹诽法比的结语，写士大夫趋于谄谀取容。",
  ),
  q(
    "011.",
    15,
    "生子不生男，有缓急非有益也！",
    "史传文句",
    "《史记·孝文本纪》太仓公语",
    "李敖引用《史记》中太仓公责女之语，呈现危急时对儿女功用的古代偏见。",
  ),
  q(
    "011.",
    15,
    "妾父为吏，齐中皆称其廉平，今坐法当刑。妾伤夫死者不可复生，刑者不可复属，虽复欲改过自新，其道无由也。妾愿没入为官婢，赎父刑罪，使得自新。",
    "史传文句",
    "《史记·孝文本纪》缇萦上书",
    "李敖引用缇萦上书文字，保存以身赎父、求其自新的古文段落。",
  ),
  q(
    "011.",
    15,
    "恺悌君子，民之父母。",
    "诗经成句",
    "《诗经》",
    "李敖引用《诗经》成句，写温和仁厚者应如民之父母。",
  ),
  q(
    "011.",
    21,
    "虽有轻刑之名，其实杀也！",
    "古典法史文句",
    "崔寔《政论》相关语",
    "李敖引用崔寔批评轻刑之名与杀人之实不相称的话。",
  ),
  q(
    "011.",
    21,
    "文帝乃重刑，非轻之也；以严致平，非以宽致平也！",
    "古典法史文句",
    "崔寔《政论》相关语",
    "李敖引用崔寔论汉文帝刑罚的话，保存其以严致平的判断。",
  ),
  q(
    "011.",
    27,
    "则刻戾忍杀之人耳",
    "古典笔记文句",
    "洪迈《容斋随笔》",
    "李敖引用《容斋随笔》对汉景帝的评语，写其刻戾忍杀。",
  ),
  q(
    "021.",
    17,
    "以正治国，以奇用兵，以无事取天下。吾何以知其然哉？以此。天下多忌讳而民弥贫；民多利器，国家滋昏；人多伎巧，奇物滋起；法令滋彰，盗贼多有。故圣人云：“我无为而民自化，我好静而民自正，我无事而民自富，我无欲而民自朴。”",
    "老子名句",
    "《老子》第五十七章",
    "李敖引用《老子》第五十七章，保存以无事取天下、忌讳与法令过多反生弊病的整段文句。",
  ),
  q(
    "021.",
    17,
    "我无为而民自化，我好静而民自正，我无事而民自富，我无欲而民自朴。",
    "老子名句",
    "《老子》第五十七章",
    "李敖引用《老子》圣人无为、好静、无事、无欲而民自化的成句。",
  ),
  q(
    "021.",
    19,
    "法令滋彰，盗贼多有",
    "老子名句",
    "《老子》第五十七章",
    "李敖特别拈出《老子》成句，说明法令愈彰显，盗贼反愈多。",
  ),
  q(
    "028.",
    87,
    "不怕不识货，只怕货比货。",
    "俗谚",
    "中文俗谚",
    "李敖引用俗谚，说明经过比较才能看出高下优劣。",
  ),
  q(
    "028.",
    519,
    "昔仲尼厄而作《春秋》，屈原放逐乃赋《离骚》，左丘失明厥有《国语》，孙子膑足《兵法》修列，《诗三百篇》大底圣贤发愤之所作也。",
    "古典文论",
    "司马迁《报任安书》相关文句",
    "李敖引用司马迁发愤著书名段，说明困厄与经典创作之间的关系。",
  ),
];

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

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function rowToCsv(row) {
  return columns.map((column) => csvEscape(row[column])).join(",");
}

function sourceSlice(row) {
  const cached = sourceCache.get(row.source_file);
  if (!cached) throw new Error(`Missing source cache for ${row.source_file}`);
  return cached.lines.slice(row.line_start - 1, row.line_end).join("\n");
}

function quotePresent(row) {
  const sourceText = sourceSlice(row);
  return (
    sourceText.includes(row.quote_text) ||
    normalizeText(sourceText).includes(normalizeText(row.quote_text))
  );
}

const modernPoliticalTerms = [
  "白色恐怖",
  "国民党",
  "共产党",
  "中共",
  "党外",
  "民进党",
  "政府",
  "政权",
  "总统",
  "民主",
  "自由",
  "人权",
  "革命",
  "反共",
  "台独",
  "戒严",
  "军法",
  "监狱",
  "特务",
  "匪谍",
  "选举",
  "立法院",
  "国会",
  "台湾",
  "大陆",
  "蒋介石",
  "蒋经国",
  "孙中山",
  "李登辉",
  "陈水扁",
];

function hasPoliticalHit(row) {
  return modernPoliticalTerms.filter((term) => row.quote_text.includes(term));
}

const selectedRows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));
const proofreadAddedRows = selectedRows.filter((row) => row.notes.includes("校对补入："));

const auditRows = selectedRows.map((row) => ({
  row,
  present: quotePresent(row),
  politicalHits: hasPoliticalHit(row),
}));
const missing = auditRows.filter((item) => !item.present);
const politicalHits = auditRows.filter((item) => item.politicalHits.length > 0);

const duplicateTexts = new Map();
for (const row of selectedRows) {
  const key = normalizeText(row.quote_text);
  duplicateTexts.set(key, (duplicateTexts.get(key) || 0) + 1);
}
const duplicates = selectedRows.filter((row) => duplicateTexts.get(normalizeText(row.quote_text)) > 1);

if (missing.length) {
  throw new Error(
    `Missing quote text: ${missing
      .map((item) => `${item.row.source_file}:${item.row.line_start}:${item.row.quote_text}`)
      .join("; ")}`,
  );
}
if (politicalHits.length) {
  throw new Error(
    `Political terms in selected quote text: ${politicalHits
      .map((item) => `${item.row.id}(${item.politicalHits.join("|")})`)
      .join(", ")}`,
  );
}
if (duplicates.length) {
  throw new Error(`Duplicate selected quote text: ${duplicates.map((row) => row.id).join(", ")}`);
}

fs.mkdirSync(path.join(process.cwd(), "exports"), { recursive: true });
fs.mkdirSync(path.join(process.cwd(), "analysis"), { recursive: true });

const header = columns.join(",");
fs.writeFileSync(outCsv, `\uFEFF${header}\r\n${selectedRows.map(rowToCsv).join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push(`《${book}》诗文格言歌谣引用`);
txt.push(`生成日期：${generatedDate}`);
txt.push(`条目数：${selectedRows.length}`);
txt.push("");
for (const row of selectedRows) {
  txt.push(`${row.id}｜${row.chapter}｜${row.line_start}${row.line_end === row.line_start ? "" : `-${row.line_end}`}`);
  txt.push(`引用：${row.quote_text}`);
  txt.push(`类别：${row.category}`);
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
  "quote_text",
  "category",
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
      .map((column) =>
        column === "decision"
          ? row.notes.includes("校对补入：")
            ? "add"
            : "keep"
          : String(row[column] ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " "),
      )
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

const omittedBoundaryExamples = [
  {
    source: "006.“太轻了，不算！”.txt:3",
    quote_text: "太轻了，不算！",
    reason: "现代刑求语境中的牢狱口语，不作为诗文格言保留",
  },
  {
    source: "008.国民党的强制悔过症.txt:9",
    quote_text: "我宁愿炸死狱中，实无过可悔。",
    reason: "现代政治犯语录，按政治语录排除",
  },
  {
    source: "020.彻查你自己吧！.txt:77",
    quote_text: "本案绝不可推诿给管理人手不足或设施不够等空洞的遁词，本案完全是管理不善发生的事情。",
    reason: "现代狱政/官员责任判断，不属于诗文格言",
  },
  {
    source: "028.写在龚德柏《蒋介石黑狱亲历记》的前面.txt:11",
    quote_text: "你们怕死，当然没有言论自由，我是不要命的，我有言论自由。",
    reason: "现代言论自由政治名言，按政治语录排除",
  },
  {
    source: "028.写在龚德柏《蒋介石黑狱亲历记》的前面.txt:123",
    quote_text: "孙科那样的人，我绝对反对，虽杀了我，我也是反对。",
    reason: "现代政治人物与副总统选举语境中的个人政治表态，不收",
  },
  {
    source: "028.写在龚德柏《蒋介石黑狱亲历记》的前面.txt:595",
    quote_text: "天网恢恢，诬蔑人者，自食其果了！",
    reason: "虽含老子成语与俗语，但本处直接嵌在现代政治人物训词反击中，校对轮暂不补入",
  },
];

const report = {
  book,
  generatedDate,
  sourceDir,
  sourceFiles: files.length,
  candidatesJson,
  reviewCandidatesTsv,
  selectedRows: selectedRows.length,
  proofreadAddedRows: proofreadAddedRows.map((row) => ({
    id: row.id,
    quote_text: row.quote_text,
    source_file: row.source_file,
    line_start: row.line_start,
  })),
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
