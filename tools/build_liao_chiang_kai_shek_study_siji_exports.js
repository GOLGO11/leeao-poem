const fs = require("fs");
const path = require("path");

const book = "蒋介石研究四集";
const idPrefix = "LAJJS4";
const generatedDate = "2026-06-27";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "019.蒋介石研究四集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_chiang_kai_shek_study_siji_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_chiang_kai_shek_study_siji_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_chiang_kai_shek_study_siji_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_chiang_kai_shek_study_siji_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_chiang_kai_shek_study_siji_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_chiang_kai_shek_study_siji_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_chiang_kai_shek_study_siji_initial_report.txt");
const proofreadReviewTsv = path.join("analysis", "liao_chiang_kai_shek_study_siji_proofread_review.tsv");
const proofreadAuditTsv = path.join("analysis", "liao_chiang_kai_shek_study_siji_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_chiang_kai_shek_study_siji_proofread_report.txt");
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
    .replace(/[“”‘’"'\u300c\u300d\u300e\u300f]/g, "")
    .replace(/\s+/g, "");
}

function q(selector, lineStart, quoteText, category, attributedTo, summary, lineEnd = lineStart, extraNotes = "") {
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
    source_or_origin: attributedTo,
    summary,
    notes: [
      "首轮保守收入：《蒋介石研究四集》以蒋介石身世、黄埔、共产党、杨虎城、外蒙、康泽、陈布雷、党国文件与政治攻防为主体；现代党派、政权、领袖、军政、战争、革命、国家民族、官方文件、特务、暗杀、法统、外蒙与意识形态语录不收，只保留可脱离具体政治论战独立检索的古典文本、民间俗语、成语、古代典故和诗文句。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "《蒋介石研究四集》自序",
    5,
    "不为尧存，不为桀亡",
    "荀子文句",
    "《荀子·天论》",
    "李敖借《荀子》天行有常之意，说明常道不因尧桀存亡而改变。",
    5,
    "只收荀子文句本体，不收同段骂蒋、政治目的与查禁语境。",
  ),
  q(
    "001.",
    9,
    "姓氏必人，岂从水耶？",
    "古代姓氏传说",
    "《庐江何氏世系考》所引何姓源流传说",
    "李敖转引何姓源流故事中以人旁解释姓氏的机锋。",
    9,
    "只收姓氏传说中的古文句，不收何应钦、蒋介石祖宗比较与人物攻防。",
  ),
  q(
    "002.",
    13,
    "人向高处爬，水往低处流",
    "俗语",
    "中国俗语",
    "李敖转引《金陵春梦》人物对白中的通行俗语，表示人想往更高处去。",
    13,
    "只收俗语本体，不收《金陵春梦》对蒋介石身世的叙事与人物对白。",
  ),
  q(
    "002.",
    75,
    "鹅吃砻糠鸭吃谷，各人自有各人福。",
    "俗语",
    "中国俗语",
    "李敖转引《金陵春梦》中的民间俗语，说明各人命运各不相同。",
    75,
    "只收俗语本体，不收郑三发子身世叙事。",
  ),
  q(
    "002.",
    107,
    "贫穷夫妻百事哀，大难来时各自飞",
    "诗句俗语合用",
    "元稹诗句与民间俗语化用",
    "李敖借诗句与俗语的合用，写贫困夫妻在大难中离散无凭。",
    107,
    "只收成句本体，不收蒋父蒋母合葬疑案与身世攻防。",
  ),
  q(
    "002.",
    113,
    "爷十三、娘十四",
    "民间婚俗俗语",
    "中国俗语",
    "李敖转引旧时早婚风气的民间俗语。",
    113,
    "只收婚俗俗语本体，不收蒋母出嫁年龄与身世考证。",
  ),
  q(
    "002.",
    137,
    "强龙不斗地头蛇",
    "俗语",
    "中国俗语",
    "李敖转引俗语，说明外来强者也难与本地势力相抗。",
    137,
    "只收俗语本体，不收《金陵春梦》人物对白和身世传说。",
  ),
  q(
    "002.",
    169,
    "在家千日好，出外一时难",
    "俗语",
    "中国俗语",
    "李敖引用古老俗语，说明远行在外处处艰难。",
    169,
    "只收俗语本体，不收抗战时期交通、投亲与蒋介石身世传说。",
  ),
  q(
    "002.",
    171,
    "鸡鸣早看天，未晚先投宿",
    "民间行旅俗语",
    "中国俗语",
    "李敖转引行旅俗语式客栈名，写早看天气、未晚投宿的旅途经验。",
    171,
    "只收俗语本体，不收重庆旅馆盘查、委员长身世传说和战时语境。",
  ),
  q(
    "006.",
    13,
    "亲亲而仁民，仁民而爱物。",
    "孟子文句",
    "《孟子·尽心上》",
    "李敖转录蒋介石文字中所引孟子句，说明由亲亲推至仁民爱物的层次。",
    13,
    "只收孟子原句本体，不收同段革命、黄埔、三民主义与党校文字。",
  ),
  q(
    "006.",
    25,
    "物有本末，事有终始。",
    "大学文句",
    "《大学》",
    "李敖转录蒋介石文字中所引《大学》句，说明事物有本末终始。",
    25,
    "只收《大学》原句本体，不收同段革命论、三民主义与党内文字。",
  ),
  q(
    "006.",
    41,
    "诚者物之终始，不诚无物。",
    "中庸文句",
    "《中庸》",
    "李敖转录蒋介石文字中所引《中庸》句，说明诚贯通事物始终。",
    41,
    "只收《中庸》原句本体，不收同段党校、革命与黄埔文字。",
  ),
  q(
    "011.",
    83,
    "死或重于泰山、或轻于鸿毛",
    "司马迁文句",
    "司马迁《报任少卿书》语义",
    "李敖借司马迁名句，说明死亡价值或重或轻的分别。",
    83,
    "只收古训本体，不收康泽、襄阳、殉难与党国人物评价语境。",
  ),
  q(
    "012.",
    61,
    "中朝大官老于事，讵肯感激徒媕娿",
    "韩愈诗句",
    "韩愈《石鼓歌》",
    "李敖转录陈布雷遗书中所引韩愈诗句，写大官老于世故、不肯激发作为。",
    61,
    "只收韩愈诗句本体，不收陈布雷遗书、党国艰危与领袖幕僚语境。",
  ),
  q(
    "012.",
    149,
    "鞠躬尽瘁，死而后已",
    "诸葛亮文句",
    "诸葛亮《后出师表》",
    "李敖转引用来赞许陈布雷尽心任事的诸葛亮名句。",
    149,
    "只收诸葛亮名句本体，不收张道藩对陈布雷与蒋介石关系的政治颂词。",
  ),
  q(
    "013.",
    63,
    "成都有桑八百株，薄田五十顷",
    "诸葛亮文句",
    "诸葛亮《出师表》文句化引",
    "李敖转引张道藩把陈布雷清苦生活比附诸葛亮家产的文句。",
    63,
    "源文作“五十顷”；只收古文句本体，不收陈布雷、金圆券与党国人物评价。",
  ),
  q(
    "014.",
    19,
    "立召蘧伯玉而贵之，召迷子瑕而退之，徙丧于堂，成礼而后去",
    "古文句",
    "《大戴礼》史鱼尸谏故事",
    "李敖转引《大戴礼》史鱼尸谏故事中卫灵公进贤退不肖、迁丧成礼的文字。",
    19,
    "只收古代典故文本，不收陈布雷尸谏说、领袖与党内政治语境。",
  ),
  q(
    "014.",
    19,
    "卫国以治，史鳅之力也！夫生进贤而退不肖；死且未止，又以尸谏，可谓忠不衰矣！",
    "古文句",
    "《大戴礼》史鱼尸谏故事",
    "李敖转引《大戴礼》对史鱼生前进贤、死后尸谏的评价。",
    19,
    "只收古代典故文本，不收陈布雷尸谏说、领袖与党内政治语境。",
  ),
  q(
    "014.",
    19,
    "古之列谏者，死则已矣！未有如史鱼死而尸谏、忠感其君者也！可不谓直乎？",
    "孔子家语文句",
    "《孔子家语》史鱼尸谏故事",
    "李敖转引《孔子家语》中孔子赞史鱼尸谏的文字。",
    19,
    "只收古代典故文本，不收陈布雷尸谏说、领袖与党内政治语境。",
  ),
  q(
    "015.",
    25,
    "名不正，则言不顺，言不顺则事不成。",
    "论语文句",
    "《论语·子路》",
    "李敖转引孔子正名之语，说明名分不正则言事难成。",
    25,
    "只收《论语》原句本体，不收同段公民课程、法统、外蒙古与政治词汇攻防。",
  ),
];

const proofreadRemovedRows = [];

const proofreadAdditions = [
  q(
    "001.",
    9,
    "吾家获免刀锯者，‘何’一字也，岂非天启后耶？",
    "古代姓氏传说",
    "《庐江何氏世系考》所引何姓源流传说",
    "李敖转引何姓源流故事中因“何”字逃过秦令搜捕的感叹。",
    9,
    "校对补入：只收姓氏传说古文句，不收何应钦、蒋介石祖宗比较与人物攻防。",
  ),
  q(
    "002.",
    47,
    "过河就抽板，气走姜二拐。",
    "小说回目/章回套语",
    "唐人《金陵春梦》",
    "李敖转引《金陵春梦》章回收束语，写受恩后翻脸的讽刺。",
    47,
    "校对补入：只收章回式收束语，不收蒋介石身世传说与长篇对白。",
  ),
  q(
    "002.",
    171,
    "远在天边，近在眼前，名为兄弟，视若不见。",
    "小说回目/章回套语",
    "唐人《金陵春梦》",
    "李敖转引《金陵春梦》章回收束语，写近在眼前却相见不认的讽刺。",
    171,
    "校对补入：只收章回式收束语，不收战时重庆盘查、蒋介石身世传说与政治语境。",
  ),
  q(
    "006.",
    33,
    "鸟之将死，其鸣也哀。人之将死，其言也善。",
    "论语文句",
    "《论语·泰伯》",
    "李敖转录蒋介石文字中所引《论语》句，说明将死之言往往哀切而善。",
    33,
    "校对补入：只收《论语》原句本体，不收同段黄埔、革命、党校与三民主义文字。",
  ),
  q(
    "012.",
    145,
    "百身莫赎",
    "诗经成语",
    "《诗经·秦风·黄鸟》语义",
    "李敖借“百身莫赎”成语，写一身无法抵偿过错的沉重意味。",
    145,
    "校对补入：只收古典成语本体，不收陈布雷自杀、党国与领袖幕僚语境。",
  ),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "国民党",
  "同盟会",
  "民进党",
  "台独",
  "中华民国",
  "国府",
  "党国",
  "政府",
  "政权",
  "总统",
  "总统府",
  "行政院",
  "立法院",
  "司法院",
  "监察院",
  "国防部",
  "国史馆",
  "警备总部",
  "二二八",
  "一九四九",
  "1949",
  "战争",
  "抗战",
  "北伐",
  "国共",
  "革命",
  "反革命",
  "反共",
  "投降",
  "军校",
  "黄埔",
  "陆军",
  "军政",
  "特务",
  "流亡",
  "亡国",
  "救国",
  "国家",
  "社稷",
  "祖国",
  "民族",
  "政治",
  "民主",
  "自由主义",
  "独裁",
  "法西斯",
  "暗杀",
  "刺杀",
  "谋杀",
  "起义",
  "炮台",
  "保密局",
  "遗嘱",
  "国歌",
  "党歌",
  "外蒙古",
  "公民投票",
  "蒋介石",
  "蒋中正",
  "蒋经国",
  "孙中山",
  "宋美龄",
  "杨虎城",
  "康泽",
  "陈布雷",
  "王世杰",
  "戴笠",
  "陈水扁",
  "李登辉",
  "日本",
  "美国",
  "苏联",
  "俄国",
  "台湾",
  "大陆",
  "烈士",
  "殉国",
  "匪谍",
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
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

const proofreadRemovedQuoteKeys = new Set(proofreadRemovedRows.map((row) => normalizeText(row.quote_text)));
const initialRows = rawRows.filter((row) => !proofreadRemovedQuoteKeys.has(normalizeText(row.quote_text)));

const rows = [...initialRows, ...proofreadAdditions].sort(rowCompare).map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const auditRows = rows.map((row) => {
  const present = quotePresent(row);
  const politicalHits = hasPoliticalHit(row);
  return { row, present, politicalHits };
});

const missing = auditRows.filter((item) => !item.present);
const politicalHits = auditRows.filter((item) => item.politicalHits.length > 0);
const duplicateTexts = new Map();
for (const row of rows) {
  const key = normalizeText(row.quote_text);
  duplicateTexts.set(key, (duplicateTexts.get(key) || 0) + 1);
}
const duplicates = rows.filter((row) => duplicateTexts.get(normalizeText(row.quote_text)) > 1);

if (missing.length) {
  throw new Error(`Missing quote text in source: ${missing.map((item) => item.row.id).join(", ")}`);
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
].join(",");

fs.writeFileSync(outCsv, `${header}\n${rows.map(rowToCsv).join("\n")}\n`, "utf8");

const txt = rows
  .map((row) =>
    [
      `${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`,
      `引用：${row.quote_text}`,
      `出处线索：${row.source_or_origin}`,
      `说明：${row.summary}`,
      row.notes ? `备注：${row.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  )
  .join("\n\n");
fs.writeFileSync(outTxt, `${book} 诗文格言歌谣引用\n生成日期：${generatedDate}\n条目数：${rows.length}\n\n${txt}\n`, "utf8");

fs.writeFileSync(selectedJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");

fs.writeFileSync(
  reviewTsv,
  [
    "id\tsource_file\tline_start\tline_end\tcategory\tquote_text\tsource_or_origin\tsummary\tnotes",
    ...rows.map((row) =>
      [
        row.id,
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.quote_text,
        row.source_or_origin,
        row.summary,
        row.notes,
      ].join("\t"),
    ),
  ].join("\n") + "\n",
  "utf8",
);

fs.writeFileSync(
  proofreadReviewTsv,
  [
    "id\tsource_file\tline_start\tline_end\tcategory\tquote_text\tsource_or_origin\tsummary\tnotes",
    ...rows.map((row) =>
      [
        row.id,
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.quote_text,
        row.source_or_origin,
        row.summary,
        row.notes,
      ].join("\t"),
    ),
  ].join("\n") + "\n",
  "utf8",
);

fs.writeFileSync(
  auditTsv,
  [
    "id\tsource_file\tline_start\tline_end\tpresent\tpolitical_hits\tquote_text",
    ...auditRows.map((item) =>
      [
        item.row.id,
        item.row.source_file,
        item.row.line_start,
        item.row.line_end,
        item.present ? "yes" : "no",
        item.politicalHits.join("|"),
        item.row.quote_text,
      ].join("\t"),
    ),
  ].join("\n") + "\n",
  "utf8",
);

const finalIdByQuote = new Map(rows.map((row) => [normalizeText(row.quote_text), row.id]));

fs.writeFileSync(
  proofreadAuditTsv,
  [
    "action\tid\tsource_file\tline_start\tline_end\tcategory\tquote_text\treason",
    ...proofreadRemovedRows.map((row) =>
      [
        "remove",
        row.id,
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.quote_text,
        row.proofread_reason,
      ].join("\t"),
    ),
    ...proofreadAdditions.map((row) =>
      [
        "add",
        finalIdByQuote.get(normalizeText(row.quote_text)) || "",
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.quote_text,
        row.notes,
      ].join("\t"),
    ),
  ].join("\n") + "\n",
  "utf8",
);

const candidatesData = fs.existsSync(candidatesJson) ? JSON.parse(fs.readFileSync(candidatesJson, "utf8")) : null;
const quoteCandidates = Array.isArray(candidatesData)
  ? candidatesData.filter((row) => row.kind === "quote").length
  : candidatesData?.quoteCandidates?.length ?? "missing";
const keywordLines = Array.isArray(candidatesData)
  ? candidatesData.filter((row) => row.kind === "keyword_line").length
  : candidatesData?.keywordLines ?? "missing";
const uniqueQuoteTexts = Array.isArray(candidatesData)
  ? new Set(candidatesData.filter((row) => row.kind === "quote").map((row) => normalizeText(row.text ?? row.quote_text))).size
  : candidatesData?.uniqueQuoteTexts ?? "missing";
const reviewCandidateLines = fs.existsSync(reviewCandidatesTsv)
  ? fs.readFileSync(reviewCandidatesTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";
const attributedLines = fs.existsSync(attributedTsv)
  ? fs.readFileSync(attributedTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";

const reportLines = [
  `${book} proofread extraction report`,
  `generatedDate: ${generatedDate}`,
  `sourceDir: ${sourceDir}`,
  `sourceFilesForExport: ${files.length}`,
  `quoteCandidates: ${quoteCandidates}`,
  `uniqueQuoteTexts: ${uniqueQuoteTexts}`,
  `keywordLines: ${keywordLines}`,
  `reviewCandidates: ${reviewCandidateLines}`,
  `attributedLines: ${attributedLines}`,
  `initialSelectedRowsBeforeProofread: ${rawRows.length}`,
  `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
  `proofreadAddedRows: ${proofreadAdditions.length}`,
  `selectedRows: ${rows.length}`,
  `missingQuotes: ${missing.length}`,
  `duplicateTexts: ${duplicates.length}`,
  `politicalHitRows: ${politicalHits.length}`,
  "policy: this book is dominated by modern political biography, Chiang Kai-shek body-origin allegations, Whampoa and party history, Yang Hucheng murder, Outer Mongolia, Kang Ze, Chen Bulei, party-state documents, official files, and polemical attacks; exclude direct party, regime, leader, military, war, revolution, national identity, official document, special service, assassination, legal-status, Outer Mongolia, and ideological quotations, while keeping independently reusable classical texts, proverbs, idioms, ancient allusions, and literary lines.",
  "",
  "selectedHighlights:",
  "- 自序/001: 收《荀子》“不为尧存，不为桀亡”和何姓源流传说“姓氏必人，岂从水耶？”；校对补入“吾家获免刀锯者，‘何’一字也，岂非天启后耶？”。查禁、骂蒋、何蒋祖宗比较与人物攻防不收。",
  "- 002: 收《金陵春梦》叙事中已经成型的俗语，并校对补入“过河就抽板，气走姜二拐。”和“远在天边，近在眼前，名为兄弟，视若不见。”；不收大段小说对白、蒋介石身世传说和政治人物材料。",
  "- 006: 收《孟子》《大学》《中庸》古典句本体，校对补入《论语·泰伯》“鸟之将死，其鸣也哀。人之将死，其言也善。”；不收蒋介石关于黄埔、革命、三民主义、党校的现代政治文字。",
  "- 011/012/013: 收司马迁、韩愈、诸葛亮古典句本体，校对补入《诗经》语义成语“百身莫赎”；不收康泽、陈布雷、金圆券、党国艰危与领袖幕僚评价。",
  "- 014/015: 收《大戴礼》《孔子家语》史鱼尸谏古文句和《论语》正名句；陈布雷尸谏说、领袖/党员语境、外蒙古与法统攻防不收。",
  "",
  "excludedHighlights:",
  "- 自序: 与查禁、骂蒋和政治目的相关的表述不收，只保留荀子文句。",
  "- 003/004/005/006/007/008: 黄埔、共产党、杨虎城、地下代表、军校、党务、暗杀、内战与特务材料为现代政治史料，不收；仅006中明引古典句保留。",
  "- 009/010/015: 王世杰、外蒙、公民投票、外交文件、法统与国家边界材料不收；015只保留《论语》句本体。",
  "- 011: 康泽挽联含党国、殉难、抗节与文天祥/史可法比附，首轮不收；只保留司马迁古训本体。",
  "- 012/013/014: 陈布雷自杀、尸谏、党国中心、领袖幕僚与反共统战语境不收；仅保留明引古典诗文、古代尸谏故事文本与独立成语。源文“瓶之倾分惟垒之耻”疑有讹字，校对暂不收。",
  "- “人民的眼睛是雪亮的”“有我在，绝不任再起内战”“实行三民主义，则共产主义即在其中”等醒目句直接属于现代政治宣传或政治史攻防，不收。",
];

fs.writeFileSync(reportTxt, reportLines.join("\n") + "\n", "utf8");
fs.writeFileSync(proofreadReportTxt, reportLines.join("\n") + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rows: rows.length,
      missing: missing.length,
      duplicates: duplicates.length,
      politicalHitRows: politicalHits.length,
      quoteCandidates,
      uniqueQuoteTexts,
      keywordLines,
      reviewCandidates: reviewCandidateLines,
      attributedLines,
      outCsv,
      outTxt,
      selectedJson,
      reviewTsv,
      auditTsv,
      reportTxt,
      proofreadReviewTsv,
      proofreadAuditTsv,
      proofreadReportTxt,
    },
    null,
    2,
  ),
);
