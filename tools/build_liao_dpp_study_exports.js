const fs = require("fs");
const path = require("path");

const book = "民进党研究";
const idPrefix = "LAMJYJ";
const generatedDate = "2026-06-28";

const corpusDir = fs.readdirSync(process.cwd()).find((name) => name.includes("6.0"));
if (!corpusDir) throw new Error("Corpus directory not found");
const sectionDir = fs.readdirSync(corpusDir).find((name) => name.startsWith("014."));
if (!sectionDir) throw new Error("Section directory 014 not found");
const sourceBookDir = fs
  .readdirSync(path.join(corpusDir, sectionDir))
  .find((name) => name.startsWith("004.") && name.includes("民进党研究"));
if (!sourceBookDir) throw new Error("Source book directory 004 not found");
const sourceDir = path.join(corpusDir, sectionDir, sourceBookDir);

const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_dpp_study_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_dpp_study_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_dpp_study_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_dpp_study_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_dpp_study_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_dpp_study_proofread_report.txt");
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
  const found =
    selector === "SELF"
      ? files.find((file) => file.includes("自序"))
      : files.find((file) => file.startsWith(selector));
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
      "校对后从严保留：《民进党研究》政治语境极密，现代政党攻防、民主/革命/选举论断、政治人物政见语录和口号不收；只取句子本体可独立成立的古典诗文、文学典故、宗教典籍、成语俗谚和少量非政治外国格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "SELF",
    7,
    "丈夫亦爱怜其少子",
    "传统文句",
    "中文传统文句",
    "李敖以传统文句写长者对后辈仍有爱怜之情。",
  ),
  q(
    "SELF",
    9,
    "贤者识其大者，不贤者识其小者",
    "古话格言",
    "中文古话",
    "李敖引用古话，说明贤与不贤在识大识小上的差别。",
  ),
  q(
    "002.",
    3,
    "我燃烧才有用。",
    "外国文人格言",
    "英国文豪卡莱尔藏书票题辞",
    "李敖引用卡莱尔题辞，写自我燃烧才产生光和热。",
  ),
  q(
    "002.",
    13,
    "如果你受不了热，就滚出厨房。",
    "外国谚语",
    "美国谚语，文中归于杜鲁门",
    "李敖引用厨房怕热的俗谚，说明从事一行须能承受压力。",
  ),
  q(
    "003.",
    81,
    "乡愿，德之贼也。",
    "古典格言",
    "孔子语，见《论语》相关章句",
    "李敖引用孔子语，说明乡愿会败坏德性与是非。",
  ),
  q(
    "003.",
    81,
    "不能假装对颜色不偏不倚",
    "外国格言",
    "丘吉尔语",
    "李敖引用丘吉尔谈颜色的句子，写面对混淆时不可假装中立。",
  ),
  q(
    "003.",
    93,
    "花对花，柳对柳，破扫把对箕帚",
    "俗谚",
    "中文俗谚",
    "李敖引用民间俗谚，写相似者互相对应、气味相投。",
    93,
    "校对补入：只取俗谚本体，不收同段关于执政者与反对者的政治判断。",
  ),
  q(
    "005.",
    5,
    "唯器与名，不可以假人。",
    "古典文句",
    "《左传》所引孔子语",
    "李敖引用《左传》古语，说明名分与器物不可随便授人。",
  ),
  q(
    "008.",
    3,
    "一只猫头鹰昼伏夜出，晚上活动，白天睡觉。可是来了一只蚱蜢，光天化日之下，在草地里唱个不停，吵得猫头鹰不能睡。猫头鹰要蚱蜢不要叫，蚱蜢不听。猫头鹰计上心来，说，反正听了你的歌声，我也睡不着了，你的歌声美妙如阿波罗（Apollo）的七弦琴，开怀之下，不如痛饮雅典娜（Pallas Athena）送我的酒吧，你就一起来喝吧。蚱蜢正唱得口渴，又被奉承之言弄得忘其所以，于是飞上枝头，跟猫头鹰相会。猫头鹰翻爪一扑，就把蚱蜢吃到嘴里了。",
    "寓言故事",
    "《伊索寓言·蚱蜢与猫头鹰》",
    "李敖转述伊索寓言，保存因受奉承而误入危险的故事。",
    3,
    "校对补入：首轮漏收的寓言材料，句子本体可脱离现代党派攻防独立检索。",
  ),
  q(
    "008.",
    5,
    "渴不饮盗泉水。",
    "古话格言",
    "中文古话",
    "李敖引用古话，说明人即使困渴也要守原则。",
  ),
  q(
    "008.",
    5,
    "羊祜岂鸩人者！",
    "历史典故文句",
    "羊祜、陆抗相关典故",
    "李敖引用晋人典故，写光明磊落者不以毒害人。",
  ),
  q(
    "010.",
    41,
    "一片冰心在玉壶",
    "古典诗句",
    "王昌龄《芙蓉楼送辛渐》诗句",
    "李敖引用王昌龄诗句，作为清白心迹的典故。",
  ),
  q(
    "011.",
    7,
    "Bos locutus est.",
    "拉丁谚语",
    "拉丁谚语，文中解释为 The ox has spoken.",
    "李敖引用拉丁谚语，用来反转对牛弹琴式的嘲讽。",
  ),
  q(
    "013.",
    199,
    "不出户，知天下",
    "老子名句",
    "《老子》第四十七章",
    "李敖引用老子成句，说明不必亲临现场也可凭思想与证据通达事理。",
    199,
    "校对补入：只取老子成句本体，不收同段政治活动层次判断。",
  ),
  q(
    "016.",
    25,
    "嗜好毕同星命异，大郎尤贵二郎清",
    "古典诗句",
    "龚定盦诗句",
    "李敖化用龚定盦诗句，对同嗜而异命作反讽。",
  ),
  q(
    "030.",
    3,
    "夜郎自大",
    "古典成语",
    "《史记》夜郎故事演化出的成语",
    "李敖引用夜郎自大成语，写闭塞而自大的心态。",
    3,
    "校对补入：总表已有同成语先例，本处按独立出处补收。",
  ),
  q(
    "030.",
    5,
    "西南君长以什数，夜郎最大。",
    "古典史文",
    "《史记·西南夷列传》",
    "李敖引用《史记》说明夜郎旧国的地位。",
  ),
  q(
    "030.",
    5,
    "滇王与汉使者言曰：‘汉孰与我大？’及夜郎侯亦然。以道不通故，各自以为一州主，不知汉广大。",
    "古典史文",
    "《史记·西南夷列传》",
    "李敖引用《史记》夜郎自大的出处，说明闭塞会造成井蛙之见。",
  ),
  q(
    "033.",
    9,
    "现在的世界太不成话，儿子打老子。",
    "现代文学文句",
    "鲁迅《阿Q正传》",
    "李敖引用阿Q心理活动，说明精神胜利式自我安慰。",
  ),
  q(
    "033.",
    9,
    "而现在是他的儿子了，便自己也渐渐的得意起来。",
    "现代文学文句",
    "鲁迅《阿Q正传》",
    "李敖引用阿Q自我转念的文字，呈现精神胜利法。",
  ),
  q(
    "033.",
    9,
    "我总算被儿子打了，现在的世界真不像样。",
    "现代文学文句",
    "鲁迅《阿Q正传》",
    "李敖引用阿Q再度自我安慰的句子，保存鲁迅讽刺文字。",
  ),
  q(
    "034.",
    5,
    "不好说！不好说！活活的羞杀人！那玉帝不会用人，他见老孙这般模样，封我做个什么‘弼马温’，原来是与他养马，未入流品之类。我初到时不知，只在御马监中顽耍。及今日问我同僚，始知是这等卑贱。老孙心中大脑，推倒席面，不受官衔，因此走下来了。",
    "古典小说文句",
    "《西游记》孙悟空弼马温典故",
    "李敖引用孙悟空不受低微官衔的段落，反衬官衔迷恋。",
  ),
  q(
    "035.",
    5,
    "负式版者",
    "论语典故",
    "《论语》相关典故",
    "李敖解释古代户口木板制度时，引用孔子尊敬负式版者的典故。",
    5,
    "校对补入：总表已有同典故先例，本处按独立出处补收。",
  ),
  q(
    "035.",
    19,
    "为善若升，为恶若崩。",
    "古话格言",
    "中文古话",
    "李敖引用古话，说明学好难而学坏快。",
  ),
  q(
    "047.",
    7,
    "挟天子以令诸侯",
    "史传成语",
    "曹操挟汉献帝故事发展出的成语",
    "李敖借三国成语，写借共同招牌号令他人的局面。",
    7,
    "校对补入：只取史传成语本体，不收同段现代派系攻防语。",
  ),
  q(
    "056.",
    11,
    "他不愿偷取胜利，他要公开又公平的打，使对方输了也心服",
    "外国历史轶语",
    "阿贝拉会战中亚历山大相关轶语",
    "李敖转述亚历山大不愿夜袭取胜的轶语，说明公开公平的胜利观。",
  ),
  q(
    "058.",
    11,
    "……故跖之徒，问于跖曰：‘盗亦有道乎？’跖曰：‘何适而无有道邪？夫妄意室中之藏，圣也；人先，勇也；出后，义也；知可否，知也；分均，仁也。五者不备而能成大盗者，天下未之有也。’",
    "古典文句",
    "《庄子·胠箧篇》",
    "李敖引用《庄子》盗亦有道故事，说明连盗贼也有其规矩。",
  ),
  q(
    "059.",
    5,
    "名无固宜，约之以命。约定俗成谓之宜，异于约则谓之不宜。",
    "古典文句",
    "《荀子·正名篇》",
    "李敖引用《荀子》解释约定俗成与名称规范。",
  ),
  q(
    "060.",
    3,
    "亚伦为圣所，和会幕，并坛，献完了赎罪祭，就要把那只活着的公山羊奉上。两手按在羊头上，承认以色列人诸般的罪孽，过犯，就是他们一切的罪愆，把这罪都归在羊的头上，借着所派之人的手，送到旷野去。要把这羊放在旷野，这羊要担当他们一切的罪孽，带到无人之地。",
    "宗教典籍文句",
    "《旧约·利未记》第十六章",
    "李敖引用《利未记》解释替罪羊典故的宗教来源。",
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
  "国民党",
  "民进党",
  "党外",
  "政党",
  "政治",
  "政府",
  "政权",
  "总统",
  "民主",
  "自由",
  "人权",
  "革命",
  "选举",
  "立法院",
  "国会",
  "台独",
  "台湾独立",
  "中共",
  "共产党",
  "反共",
  "独裁",
  "反对党",
  "中国大陆",
  "大陆",
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
    source: "005.谁窃盗了党外的“名器”？.txt:99",
    quote_text: "权力使人腐化，绝对的权力使人绝对腐化。",
    reason: "政治权力格言，首轮按政治语录边界排除",
  },
  {
    source: "022.民进党的三不.txt:7",
    quote_text: "君子矜而不争，群而不党。",
    reason: "虽为孔子语，但本书中直接围绕现代政党论述，首轮暂不收入",
  },
  {
    source: "028.打着民主反民主.txt:5",
    quote_text: "治好民主的所有毛病是更多民主一点。",
    reason: "现代民主政治格言，属于政治判断，不收入",
  },
  {
    source: "028.打着民主反民主.txt:13",
    quote_text: "请愿而死，究竟是可耻的！",
    reason: "现代请愿与革命语境中的政治诗句，不收入",
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
