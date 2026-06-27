const fs = require("fs");
const path = require("path");

const book = "蒋介石的真面目";
const idPrefix = "LAJJSZMM";
const generatedDate = "2026-06-27";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "022.蒋介石的真面目");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_chiang_kai_shek_true_face_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_chiang_kai_shek_true_face_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_chiang_kai_shek_true_face_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_chiang_kai_shek_true_face_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_chiang_kai_shek_true_face_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_chiang_kai_shek_true_face_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_chiang_kai_shek_true_face_initial_report.txt");
const proofreadReviewTsv = path.join("analysis", "liao_chiang_kai_shek_true_face_proofread_review.tsv");
const proofreadAuditTsv = path.join("analysis", "liao_chiang_kai_shek_true_face_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_chiang_kai_shek_true_face_proofread_report.txt");
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
      "保守收入：《蒋介石的真面目》以反蒋史料、军政文告、国共战争、外蒙西藏、宋美龄、新闻辩驳和政治攻防为主体；现代党派、政权、领袖、军政、战争、革命、国家民族、外交、统独、法条、媒体争议、暗杀、鞭尸与意识形态语录不收，只保留可脱离具体政治攻防独立检索的古典诗文、禅语、俗语、成语、挽联、典故和非政治成句。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    69,
    "唯器与名，不可以假人",
    "古典名器成句",
    "《左传》名器语",
    "李敖引古人慎重名器之语，说明名分和器物不可轻易假借。",
    69,
    "只收古典成句本体；不收军阶、将星、总统与党国讽刺语境。",
  ),
  q(
    "003.",
    11,
    "错认颜标是鲁公",
    "旧典成句",
    "旧典成句",
    "李敖用旧典成句讽刺误认人物、错把平常人当成名贤。",
    11,
    "只收旧典成句本体；不收康泽、徐复观、特务与党派论战语境。",
  ),
  q(
    "003.",
    39,
    "但使龙城飞将在，不教胡马度阴山。",
    "唐诗句",
    "王昌龄《出塞》",
    "李敖引王昌龄《出塞》句，借飞将与胡马写边塞想象。",
    39,
    "只收唐诗句本体；不收康泽、特赦、国共战争和政治讽刺语境。",
  ),
  q(
    "011.",
    3,
    "不立文字，教外别传",
    "禅宗成句",
    "《五灯会元》禅宗宗旨",
    "李敖引《五灯会元》所记禅宗不立文字、教外别传之理。",
    3,
    "只收禅宗成句本体；不收蒋介石外交文件讽刺语境。",
  ),
  q(
    "011.",
    3,
    "不立文字，见性成佛",
    "禅宗成句",
    "南泉普愿禅语",
    "李敖引南泉普愿所倡不立文字、见性成佛的禅门说法。",
    3,
    "只收禅宗成句本体；不收后文外交与卖国语境。",
  ),
  q(
    "011.",
    3,
    "法离文字",
    "禅宗成句",
    "临济大师语",
    "李敖引临济大师以法离文字为标榜。",
    3,
    "只收禅门成句本体；不收蒋介石不立文字的政治讽刺。",
  ),
  q(
    "011.",
    3,
    "乃至三乘十二分教，皆是拭不净故纸",
    "禅宗文句",
    "临济大师语",
    "李敖引临济大师贬斥文字经典的激烈禅语。",
    3,
    "只收禅宗文句本体；不收后文政治外交语境。",
  ),
  q(
    "011.",
    5,
    "昔云门说法如云雨，绝不喜人记录其语。见必骂逐曰：‘汝口不用，反记吾语，异时裨贩我去。’",
    "禅林故事文句",
    "《禅林僧宝传》佛印语",
    "李敖转引《禅林僧宝传》佛印记云门不喜人记录其语的故事。",
    5,
    "只收禅林故事本体；不收蒋介石不立文字的政治讽刺。",
  ),
  q(
    "013.",
    9,
    "长城但自坏，千古痛稠结，肉食无远谋，野史有直笔。",
    "古人诗句",
    "安如山诗",
    "李敖引安如山诗，借长城自坏、野史直笔写史家寄意。",
    9,
    "只收古诗本体；不收国大、反蒋史料和政治评价语境。",
  ),
  q(
    "019.",
    3,
    "出其东门，有女如云。虽则如云，匪我思存。缟衣綦巾，聊乐我员。",
    "诗经句",
    "《诗经·郑风·出其东门》",
    "李敖引《诗经》前六句，说明东门意象与朴素女子之思。",
    3,
    "只收《诗经》文本本体；不收台北东门古物毁损和现代政治人物语境。",
  ),
  q(
    "019.",
    5,
    "美轮美奂",
    "成语",
    "中文成语",
    "李敖借成语反写城楼整修后外观华丽而失去原貌。",
    5,
    "只收成语本体；不收东门城楼整修与政治人物语境。",
  ),
  q(
    "024.",
    3,
    "渺渺三魂，活佛竟成死鬼；迢迢万里，东来不见西归。",
    "旧笑话挽联",
    "《破涕录》笑话挽联",
    "李敖转引《破涕录》里讽刺活佛东来不西归的挽联。",
    3,
    "只收旧笑话挽联本体；不收现代西藏、达赖、美国与独立议题语境。",
  ),
  q(
    "032.",
    3,
    "断烂朝报",
    "史料批评成语",
    "中文成语",
    "李敖用成语讽刺学报像残缺腐烂的官样记录。",
    3,
    "只收成语本体；不收近代史研究所、伪政权与学术政治批评语境。",
  ),
  q(
    "032.",
    5,
    "矮子里面挑大个",
    "俗语",
    "中文俗语",
    "李敖用俗语说明同类书都差，只能从低水平中挑相对较好的。",
    5,
    "只收俗语本体；不收中国现代史教材和国共斗争史语境。",
  ),
  q(
    "034.",
    143,
    "回忆三十年来，始而寄迹海上，继而留学国外，长离膝下，十有余年。",
    "自序散文句",
    "蒋经国《我在苏联的生活》自序",
    "李敖转引蒋经国自序，写长期离母、寄迹海上与留学国外。",
    143,
    "只收亲情自序散文句；不收蒋家政治、留苏公开信和反蒋语境。",
  ),
  q(
    "034.",
    143,
    "且因邮电不通，音讯久疏，母不知儿生死，因抑郁以成疾；儿亦未能亲侍汤药，以娱慈母之心。",
    "亲情散文句",
    "蒋经国《我在苏联的生活》自序",
    "李敖转引蒋经国自序中写母子音讯隔绝、未能侍病的亲情句。",
    143,
    "只收亲情散文句；不收蒋家政治和公开信清算语境。",
  ),
  q(
    "034.",
    143,
    "用以纪念吾母，并志无涯之哀悼",
    "哀悼散文句",
    "蒋经国《我在苏联的生活》自序",
    "李敖转引蒋经国说明著书纪念亡母、寄托哀悼的话。",
    143,
    "只收哀悼散文句；不收蒋家政治和反蒋语境。",
  ),
  q(
    "034.",
    277,
    "这不是比狗彘都不如吗？",
    "俗语成句",
    "中文俗语",
    "李敖转引张明镐叙述中责人忘母负约的俗语化成句。",
    277,
    "只收亲属责问中的俗语成句；不收蒋家政治投机和留苏语境。",
  ),
  q(
    "037.",
    21,
    "说大人，则藐之",
    "孟子古文句",
    "《孟子·尽心下》",
    "李敖引孟子句自况面对显贵时不仰视、不趋附。",
    21,
    "只收孟子古文句本体；不收报纸辩驳、法条和媒体争议语境。",
  ),
  q(
    "038.",
    11,
    "明着说好话，暗中下毒手",
    "俗语化成句",
    "李敖成句",
    "李敖用成句概括表面道歉、暗里攻击的做法。",
    11,
    "只收俗语化成句；不收省籍争议、台湾政治、报纸辩驳和法庭语境。",
  ),
];

const proofreadRemovedRows = [];

const proofreadAdditions = [
  q(
    "004.",
    7,
    "更无一个是男儿",
    "古诗化句",
    "花蕊夫人《述国亡诗》化用",
    "李敖借古诗化句感叹众人失去气节。",
    7,
    "校对补入，只收古诗化句本体；不收蔡松坡、反蒋、出丧和政治羞辱语境。",
  ),
  q(
    "011.",
    3,
    "拈花示众",
    "禅宗典故",
    "《五灯会元》拈花典故",
    "李敖引世尊在灵山会上拈花示众的禅门故事。",
    3,
    "校对补入，只收禅宗典故本体；不收蒋介石外交文件讽刺语境。",
  ),
  q(
    "011.",
    3,
    "破颜微笑",
    "禅宗典故",
    "《五灯会元》拈花微笑典故",
    "李敖引大迦叶破颜微笑的禅门典故。",
    3,
    "校对补入，只收禅宗典故本体；不收蒋介石外交文件讽刺语境。",
  ),
  q(
    "011.",
    3,
    "单传心印",
    "禅宗成句",
    "禅宗传法语",
    "李敖用以说明禅门不涉文字、以心印相传的说法。",
    3,
    "校对补入，只收禅宗成句本体；不收后文政治外交语境。",
  ),
  q(
    "011.",
    5,
    "东海西海，有志一同",
    "文言成句",
    "李敖成句",
    "李敖用以说明中西在不喜文字记录这一点上旨趣相合。",
    5,
    "校对补入，只收可独立检索的文言成句；不收蒋介石不立文字的政治讽刺。",
  ),
  q(
    "013.",
    9,
    "张大义而垂青史",
    "文言成句",
    "李敖成句",
    "李敖用此称保存史料、伸张义理而留诸青史。",
    9,
    "校对补入，只收文言成句本体；不收国大、反蒋史料和政治评价语境。",
  ),
  q(
    "039.",
    39,
    "哭秦庭",
    "古典典故",
    "申包胥哭秦庭典故",
    "李敖用哭秦庭典故比喻赴外求援。",
    39,
    "校对补入，只收典故本体；不收宋美龄、美国和外交求援政治语境。",
  ),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "共匪",
  "国民党",
  "民进党",
  "台独",
  "中华民国",
  "党国",
  "政府",
  "政权",
  "总统",
  "总裁",
  "领袖",
  "国父",
  "主席",
  "委员长",
  "行政院",
  "立法院",
  "国防部",
  "外交部",
  "军法",
  "军队",
  "特务",
  "反共",
  "革命",
  "三民主义",
  "主义",
  "战争",
  "抗战",
  "反攻",
  "台湾",
  "大陆",
  "西藏",
  "外蒙",
  "美国",
  "日本",
  "苏联",
  "俄国",
  "暗杀",
  "战犯",
  "言论自由",
  "人权",
  "民主政治",
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
const proofreadRemovedQuoteKeys = new Set(proofreadRemovedRows.map((row) => normalizeText(row.quote_text)));
const initialRows = rawRows.filter((row) => !proofreadRemovedQuoteKeys.has(normalizeText(row.quote_text)));
const selectedRows = [...initialRows, ...proofreadAdditions]
  .sort((a, b) => {
    const fileDiff = fileIndex.get(a.source_file) - fileIndex.get(b.source_file);
    if (fileDiff) return fileDiff;
    if (a.line_start !== b.line_start) return a.line_start - b.line_start;
    return a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN");
  })
  .map((row, index) => ({
    ...row,
    id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
  }));

const auditRows = selectedRows.map((row) => {
  const present = quotePresent(row);
  const politicalHits = hasPoliticalHit(row);
  return { row, present, politicalHits };
});

function selectedVersion(row) {
  const key = [row.source_file, row.line_start, normalizeText(row.quote_text)].join("\u0001");
  return (
    selectedRows.find(
      (selected) => [selected.source_file, selected.line_start, normalizeText(selected.quote_text)].join("\u0001") === key,
    ) || row
  );
}

const proofreadAuditRows = [
  ...proofreadRemovedRows.map((row) => ({
    action: "remove",
    reason: "校对删除",
    row,
    present: quotePresent(row),
    politicalHits: hasPoliticalHit(row),
  })),
  ...proofreadAdditions.map((row) => {
    const selected = selectedVersion(row);
    return {
      action: "add",
      reason: "校对补入",
      row: selected,
      present: quotePresent(selected),
      politicalHits: hasPoliticalHit(selected),
    };
  }),
];

const missing = auditRows.filter((item) => !item.present);
const politicalHits = auditRows.filter((item) => item.politicalHits.length > 0);
const duplicateTexts = new Map();
for (const row of selectedRows) {
  const key = normalizeText(row.quote_text);
  duplicateTexts.set(key, (duplicateTexts.get(key) || 0) + 1);
}
const duplicates = selectedRows.filter((row) => duplicateTexts.get(normalizeText(row.quote_text)) > 1);

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

fs.writeFileSync(outCsv, `${header}\n${selectedRows.map(rowToCsv).join("\n")}\n`, "utf8");

const txt = selectedRows
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

fs.writeFileSync(outTxt, `${book} 诗文格言歌谣引用\n生成日期：${generatedDate}\n条目数：${selectedRows.length}\n\n${txt}\n`, "utf8");
fs.writeFileSync(selectedJson, `${JSON.stringify(selectedRows, null, 2)}\n`, "utf8");

fs.writeFileSync(
  reviewTsv,
  [
    "id\tsource_file\tline_start\tline_end\tcategory\tquote_text\tsource_or_origin\tsummary\tnotes",
    ...selectedRows.map((row) =>
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
fs.writeFileSync(proofreadReviewTsv, fs.readFileSync(reviewTsv, "utf8"), "utf8");

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

fs.writeFileSync(
  proofreadAuditTsv,
  [
    "action\treason\tid\tsource_file\tline_start\tline_end\tpresent\tpolitical_hits\tquote_text",
    ...proofreadAuditRows.map((item) =>
      [
        item.action,
        item.reason,
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
  ? fs.readFileSync(attributedTsv, "utf8").replace(/^\uFEFF/, "").trim().split(/\r?\n/).length - 1
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
  `selectedRows: ${selectedRows.length}`,
  `missingQuotes: ${missing.length}`,
  `duplicateTexts: ${duplicates.length}`,
  `politicalHitRows: ${politicalHits.length}`,
  "policy: this book is dominated by anti-Chiang polemics, military and party-state documents, KMT/CCP war, Tibet/Outer Mongolia, Soong Mei-ling, media disputes, legal rebuttals, assassination and corpse-whipping rhetoric; exclude direct modern political, party, regime, leader, military, war, revolution, national identity, diplomacy, independence, legal, media-fight, assassination and ideological quotations, while keeping independently reusable classical poetry/prose, Chan sayings, idioms, proverbs, couplets, allusions and non-political set phrases.",
  "",
  "selectedHighlights:",
  "- 001/003: 收“唯器与名，不可以假人”、旧典成句“错认颜标是鲁公”和王昌龄《出塞》句；军阶、将星、康泽、特务、国共战争与政治讽刺不收。",
  "- 004: 校对补入花蕊夫人《述国亡诗》化句“更无一个是男儿”；蔡松坡、反蒋、出丧和政治羞辱语境不收。",
  "- 011: 收《五灯会元》《禅林僧宝传》相关禅语和禅林故事；校对补入“拈花示众”“破颜微笑”“单传心印”“东海西海，有志一同”；蒋介石外交文件、不立文字的政治讽刺不收。",
  "- 013/019/024: 收安如山诗、“张大义而垂青史”、《诗经·出其东门》、成语“美轮美奂”和《破涕录》旧笑话挽联；国大、古物毁损、西藏独立与美国语境不收。",
  "- 032/034: 收“断烂朝报”“矮子里面挑大个”及非政治的亲情哀悼散文句；近代史所、外蒙、卖国、蒋家政治与公开信清算语境不收。",
  "- 037/038/039: 收孟子“说大人，则藐之”、“明着说好话，暗中下毒手”和“哭秦庭”；出版法、报纸争辩、省籍、台湾政治、言论争议、宋美龄与美国外交求援语境不收。",
  "",
  "excludedHighlights:",
  "- 001/003/004/005/006/007/009/010: 军阶文告、复兴社、民生主义、平均地权、节制资本、西藏独立、不准上岸、专立文字外交与军政命令均属现代政治材料；“仗打败，反多星”“三分军事、七分政治”“为国民争人格”“在他头上动土”等不收；“存信史”语义过泛不收。",
  "- 015/020/021/022/023: 清算、长春围城、鞭尸、黄金葛等章节多为战争、暴力、政治清算与党国讽刺；“败军之将，何以谈和”“掘楚平王墓，出其尸，鞭之三百，然后已”等首轮不收。",
  "- 013/017/024/031/032/033/036: “去伪存真”“摘奸发伏”“有志一同”“漏网之文”“聊志书庆”等过短、过泛或依附政治书稿语境者不收；西藏外蒙、反蒋运动、国共斗争、中苏条约、联俄容共、共产主义等现代政治/外交/意识形态语录不收。",
  "- 034/035/039: 宋美龄、蒋夫人断袖、威尔基、对美求援等现代人物绯闻和外交政治语境不收，只留亲情哀悼散文句、俗语成句和典故本体。",
  "- 037/038: 报纸辩驳、出版法、新闻评议、省籍论战、台独联盟与政治监狱等现代政治和法律语境不收。",
];

fs.writeFileSync(reportTxt, reportLines.join("\n") + "\n", "utf8");
fs.writeFileSync(proofreadReportTxt, reportLines.join("\n") + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      book,
      initialRows: rawRows.length,
      proofreadRemovedRows: proofreadRemovedRows.length,
      proofreadAddedRows: proofreadAdditions.length,
      rows: selectedRows.length,
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
