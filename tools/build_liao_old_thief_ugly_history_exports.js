const fs = require("fs");
const path = require("path");

const book = "老贼臭史";
const idPrefix = "LALZCS";
const generatedDate = "2026-06-28";
const sourceDir = path.join("《大李敖全集6.0》分章节", "013.国民党史政", "004.老贼臭史");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_old_thief_ugly_history_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_old_thief_ugly_history_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_old_thief_ugly_history_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_old_thief_ugly_history_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_old_thief_ugly_history_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_old_thief_ugly_history_proofread_report.txt");
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
    .replace(/[“”‘’"'「」『』]/g, "")
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
      "校对后从严保留：《老贼臭史》以老立委、党国人物、军政受降、司法与人权攻防、反共/革命叙述、选举报刊冲突等现代政治材料为主体；现代政党、政权、政府机关、领袖、军政、革命、反共/反攻、民主自由人权、司法戒严、暴力暗杀与宣传攻防语录不收，只保留可脱离具体政治攻防独立检索的古典诗文、成语俗语、方言土话、文学典故、外文轶事与非政治生活格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q("002.", 11, "安事诗书", "历史典故成句", "刘邦相关典故", "李敖引刘邦式成句，写轻视读书学术的姿态。"),
  q("002.", 29, "群贤毕至，少长咸集", "古文成句", "王羲之《兰亭集序》", "李敖化用《兰亭集序》名句，写众人聚集的场面。"),
  q("002.", 113, "事出于沉思，义归于翰藻", "古文论文章句", "萧统《文选序》", "李敖引用《文选序》标准，说明传统词章之学重视沉思与文采。"),

  q("003.", 81, "一座没有爆发的火山，火烧得我痛，却始终没有能力（就是技巧）炸开那禁锢我的地壳，放射出光和热来……", "现代文学自述", "闻一多对臧克家语", "李敖转引闻一多自述，以火山比喻内在情感与表达技巧的冲突。"),
  q("003.", 109, "信史随心翻铁案，狂夫呓语作金科", "旧体诗句", "萧公权名句", "李敖引用萧公权诗句，形容史实被任意翻案、狂言被奉为准则。"),

  q("004.", 3, "为严将军头", "古典诗文成句", "文天祥《正气歌》", "李敖引用《正气歌》成句，借严将军典故作对照。"),
  q("004.", 3, "柳丝长、春雨细", "词句成句", "温庭筠《更漏子》相关词句", "李敖引用词句意象，形容柔弱弯曲的姿态。"),
  q("004.", 99, "行行重行行", "古诗成句", "《古诗十九首》", "李敖化用《古诗十九首》开篇成句，写一路继续前行。"),
  q("004.", 169, "以德报怨", "儒家成语", "《论语》相关成句", "李敖摘出常见成语，写以恩德回应怨恨的姿态。"),
  q("004.", 185, "先秤秤你的分量", "俗话", "中文俗话", "李敖转述俗话，写先试探对方虚实与分量。"),
  q("004.", 187, "由你这厮奸似鬼，喝了老娘洗脚水", "文学俗语", "《水浒传》孙二娘语", "李敖引用《水浒传》俗语，写再奸滑也会落入圈套。"),
  q("004.", 245, "刀下留人", "成语", "中文成语", "李敖借常见成语，写临刑或用刀时暂留性命的说法。"),
  q("004.", 245, "人下留刀", "成语戏仿", "李敖由“刀下留人”反转化用", "李敖戏仿成语，写人被迁就到连刀也被保留的反讽。"),
  q("004.", 277, "授受不亲", "礼教成语", "《孟子》相关成句", "李敖借礼教成语，写双方交付时不直接接触的姿态。"),

  q("005.", 13, "天怒人怨", "成语", "中文成语", "李敖摘出成语，写惹得天人共怒的处境。"),
  q("005.", 19, "嗟来食", "成语典故", "《礼记·檀弓下》相关典故", "李敖借嗟来之食典故，写不体面的施与受。"),

  q("008.", 7, "含饴弄孙", "成语", "中文成语", "李敖摘出成语，写老人退居家中享受天伦。"),
  q("008.", 7, "调和鼎鼐", "成语", "中文成语", "李敖摘出成语，写调理大局、居中协调的自我说法。"),
  q("008.", 13, "爱人以德", "儒家成语", "中文成语", "李敖借成语，写以道德原则成全别人。"),

  q("009.", 5, "生我之门死我户", "俗语成句", "中文俗语", "李敖摘出俗语，写托身某处也可能受制于某处。"),

  q("010.", 91, "先天下之忧而忧，后天下之乐而乐", "古文名句", "范仲淹《岳阳楼记》", "李敖转引范仲淹名句，表达先忧后乐的士人责任感。"),
  q("010.", 101, "水干石头显，真金不怕火炼", "俗语格言", "中文俗语", "李敖转述俗语，写真相终会显露、真材经得起考验。"),

  q("013.", 3, "英国人呀！你们因为我是法国人而要杀我，难道因我不是英国人所受的惩罚还不够吗？", "外文轶事名句", "伏尔泰英国轶事", "李敖转述伏尔泰机智答语，以幽默化解敌意。"),
  q("013.", 7, "天上九头鸟，地下湖北佬", "民间俗谚", "中文地域俗谚", "李敖引用地域俗谚，说明一般观感中的湖北人形象。"),
  q("013.", 7, "奸黄陂，狡孝感，又奸又狡是汉川", "民间俗谚", "湖北地域俗谚", "李敖引用湖北地方俗谚，说明地区刻板观感的细分。"),
  q("013.", 9, "无宁不成埠", "商业俗谚", "宁波相关俗谚", "李敖引用宁波商业俗谚，写宁波人在商埠中的影响。"),
  q("013.", 11, "回汤豆腐干", "方言俗语", "宁波土话", "李敖解释宁波土话，表示空忙一场又被退回。"),
  q("013.", 13, "赢头输尾", "方言俗语", "宁波相关俗语", "李敖摘出俗语，写开头得利、最后赔输的结局。"),
  q("013.", 19, "朝里阿大", "方言俗语", "宁波土话", "李敖解释宁波土话，写面朝里的学徒或后来可能接班的人。"),

  q("015.", 7, "好汉不提当年勇", "俗语", "中文俗语", "李敖引用俗语，写不再拿过去功劳自夸。"),

  q("017.", 11, "胳膊肘朝外弯", "俗语", "中文俗语", "李敖引用俗语，写不顾自己一方而偏向外人。"),

  q("018.", 3, "你这给奴才做奴才的奴才", "文学俗语", "《水浒传》石秀骂语", "李敖引用《水浒传》骂语，描绘奴性层层相役。"),
  q("018.", 9, "既做好官，又要做好人，两者岂可得兼耶？", "历史人物名言", "宋朝蔡京名言", "李敖引用蔡京名言，写为官与做人难以两全的说法。"),

  q("019.", 3, "恺撒已死", "外文轶事语句", "罗素转述哲学读书轶事", "李敖转述罗素轶事中的误读句，作为笑话铺垫。"),
  q("019.", 3, "我就是恺撒！", "外文轶事语句", "罗素转述哲学读书轶事", "李敖转述罗素轶事中的荒诞答语。"),

  q("020.", 7, "见利忘义", "成语", "中文成语", "李敖摘出成语，写为利益而背弃道义。"),
  q("020.", 11, "见义得利", "成语戏仿", "李敖由“见利忘义”反转化用", "李敖戏仿成语，反讽以义名取得实际利益。"),
];

const proofreadExclusions = new Map(
  [
    ["恺撒已死", "罗素轶事中的承接片段，更像笑话上下文，不属于诗文格言歌谣引用主体。"],
    ["我就是恺撒！", "罗素轶事的笑话包袱，独立检索价值不足，且本章用于现代政治人物讽刺；校对删除。"],
  ].map(([quoteText, reason]) => [normalizeText(quoteText), reason]),
);
const proofreadAdditions = [];

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
  "领袖",
  "总理",
  "国父",
  "革命",
  "反共",
  "反攻",
  "复国",
  "统一",
  "民主",
  "自由",
  "人权",
  "党义",
  "司法",
  "法院",
  "检察",
  "警察",
  "戒严",
  "国安法",
  "军法",
  "暴力",
  "暗杀",
  "选举",
  "立委",
  "行政院",
  "国民大会",
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

const initialRows = [...rawRows].sort(rowCompare);
const proofreadRemovedRows = initialRows
  .map((row, index) => ({
    original_id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
    ...row,
    reason: proofreadExclusions.get(normalizeText(row.quote_text)),
  }))
  .filter((row) => row.reason);

const proofreadRows = [
  ...initialRows.filter((row) => !proofreadExclusions.has(normalizeText(row.quote_text))),
  ...proofreadAdditions,
].sort(rowCompare);

const selectedRows = proofreadRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

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

const header = [
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
const csv = `\uFEFF${[header.join(","), ...selectedRows.map(rowToCsv)].join("\r\n")}\r\n`;
fs.writeFileSync(outCsv, csv, "utf8");

const txt = [];
txt.push(`${book} 诗文格言歌谣引用`);
txt.push(`生成日期：${generatedDate}`);
txt.push(`条目数：${selectedRows.length}`);
txt.push("");
for (const row of selectedRows) {
  txt.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  txt.push(`引用：${row.quote_text}`);
  txt.push(`出处线索：${row.source_or_origin}`);
  txt.push(`说明：${row.summary}`);
  txt.push(`备注：${row.notes}`);
  txt.push("");
}
fs.writeFileSync(outTxt, `\uFEFF${txt.join("\r\n")}`, "utf8");

fs.writeFileSync(selectedJson, `${JSON.stringify(selectedRows, null, 2)}\n`, "utf8");

const reviewRows = [
  ["id", "decision", "category", "source_file", "line", "quote_text", "reason"].join("\t"),
  ...selectedRows.map((row) =>
    [
      row.id,
      "keep",
      row.category,
      row.source_file,
      `${row.line_start}-${row.line_end}`,
      row.quote_text,
      row.summary,
    ].join("\t"),
  ),
  ...proofreadRemovedRows.map((row) =>
    [
      `${row.original_id}-initial`,
      "remove",
      row.category,
      row.source_file,
      `${row.line_start}-${row.line_end}`,
      row.quote_text,
      row.reason,
    ].join("\t"),
  ),
];
fs.writeFileSync(reviewTsv, `\uFEFF${reviewRows.join("\r\n")}\r\n`, "utf8");

const auditTsvRows = [
  ["id", "present_in_source", "political_hits", "duplicate_text", "source_file", "line", "quote_text"].join("\t"),
  ...auditRows.map((item) =>
    [
      item.row.id,
      item.present ? "yes" : "no",
      item.politicalHits.join("|"),
      duplicateTexts.get(normalizeText(item.row.quote_text)) > 1 ? "yes" : "no",
      item.row.source_file,
      `${item.row.line_start}-${item.row.line_end}`,
      item.row.quote_text,
    ].join("\t"),
  ),
];
fs.writeFileSync(auditTsv, `\uFEFF${auditTsvRows.join("\r\n")}\r\n`, "utf8");

const report = {
  book,
  generatedDate,
  sourceDir,
  sourceFiles: files.length,
  candidatesJson,
  reviewCandidatesTsv,
  initialRowsBeforeProofread: initialRows.length,
  proofreadRemovedRows: proofreadRemovedRows.length,
  proofreadAddedRows: proofreadAdditions.length,
  selectedRows: selectedRows.length,
  outputCsv: outCsv,
  outputTxt: outTxt,
  missingQuotes: missing.map((item) => item.row.id),
  politicalHits: politicalHits.map((item) => ({ id: item.row.id, hits: item.politicalHits })),
  duplicateQuotes: duplicates.map((row) => row.id),
  removedRows: proofreadRemovedRows.map((row) => ({
    original_id: row.original_id,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
    quote_text: row.quote_text,
    reason: row.reason,
  })),
};
fs.writeFileSync(reportTxt, `${JSON.stringify(report, null, 2)}\n`, "utf8");

if (missing.length || politicalHits.length || duplicates.length) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
