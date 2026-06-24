const fs = require("fs");
const path = require("path");

const book = "挑战李敖";
const idPrefix = "LACL";
const generatedDate = "2026-06-24";
const sourceDir = path.join("《大李敖全集6.0》分章节", "010.节目演讲类", "002.挑战李敖");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_challenge_liao_quote_candidates.json");
const reviewTsv = path.join("analysis", "liao_challenge_liao_review_candidates.tsv");
const auditTsv = path.join("analysis", "liao_challenge_liao_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_challenge_liao_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_challenge_liao_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_challenge_liao_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => /^\d{3}\..+\.txt$/.test(name))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceCache = new Map();
for (const file of files) {
  const fullPath = path.join(sourceDir, file);
  const text = sourceDecoder.decode(fs.readFileSync(fullPath));
  sourceCache.set(file, {
    text,
    lines: text.split(/\r?\n/),
  });
}

function sourceFile(prefix) {
  const found = files.find((file) => file.startsWith(prefix));
  if (!found) throw new Error(`Source file not found for prefix: ${prefix}`);
  return found;
}

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[“”‘’"']/g, "")
    .replace(/\s+/g, "");
}

function q(filePrefix, lineStart, quoteText, category, attributedTo, note, lineEnd = lineStart) {
  const file = sourceFile(filePrefix);
  return {
    id: "",
    book,
    chapter: file.replace(/^\d+\./, "").replace(/\.txt$/, ""),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: attributedTo,
    summary: note,
    notes: "首轮保守收入：节目文字稿噪声较密，仅取可独立成立的诗文、格言、成语俗语和古典文句。",
  };
}

const rawRows = [
  q("003.", 69, "胆大如斗", "成语典故", "《三国演义》姜维故事", "李敖借姜维胆大如斗的故事自我调侃。"),
  q("004.", 37, "我每听到别人捧我的时候，我就浑身不自在。什么原因？因为别人捧的不够。", "西方幽默格言", "萧伯纳语", "萧伯纳关于被人赞美的幽默语。"),
  q("005.", 39, "和而不同", "古典成语", "《论语·子路》", "李敖用“和而不同”说明合作而不必加入。"),
  q("006.", 29, "我不入地狱，谁入地狱", "佛教俗语", "地藏菩萨愿语", "李敖借地藏菩萨精神说明下地狱救人的愿语。"),
  q("007.", 13, "庸人自扰", "成语", "中国成语", "李敖谈“庸人自扰”及其诗句来源。"),
  q("007.", 13, "本来无事只畏扰，扰者才吏非庸人", "诗句", "陆游诗句", "李敖引用陆游诗句解释“庸人自扰”。"),
  q("008.", 13, "骆驼背上最后一根草", "西方谚语", "The last straw", "西方关于临界点的谚语。"),
  q("008.", 133, "发现错误就是聪明，知错能改就是正直", "格言", "《聊斋》引语", "听众引用《聊斋》中的知错改过格言。"),
  q("008.", 133, "知耻近乎勇", "古典名句", "《礼记·中庸》", "知耻与勇气相关的古典名句。"),
  q("010.", 81, "魔鬼引证圣经", "西方谚语", "西方谚语", "李敖借西方谚语讽刺恶人也会引用经典。"),
  q("013.", 17, "世事洞明皆学问，人情练达即文章", "古典名句", "《红楼梦》", "李敖引用《红楼梦》联语说明活的学问与文章。"),
  q("013.", 19, "不运动的人别定运动规则", "西方幽默格言", "Earl Butz语", "李敖转引关于不参与者不宜制定规则的讽刺语。"),
  q("013.", 23, "我们能干的人希望在稳定中衰退", "现代文人格言", "刘绍唐语", "刘绍唐关于年老衰退的幽默自警。"),
  q("013.", 25, "一年老一年，一日衰一日", "诗句", "陆游诗句", "李敖引用陆游诗形容渐衰。"),
  q("013.", 25, "譬如东周亡，岂复须大疾", "诗句", "陆游诗句", "李敖引用陆游诗形容渐衰。"),
  q("016.", 69, "却恐他乡胜故乡", "诗句", "中国古诗", "李敖借古诗说明他乡也可胜故乡。"),
  q("016.", 69, "此心安处是吾乡", "诗句", "苏轼词句", "李敖借苏轼词句说明安心之处即故乡。"),
  q("021.", 21, "松柏后凋于岁寒，鸡鸣不已于风雨", "训诂文句", "古书词义例句", "李敖用古文句说明“后”可作“不”解。"),
  q("033.", 25, "飞鸟尽，良弓藏；狡兔死，走狗烹", "史传名句", "《史记·越王勾践世家》", "范蠡遗文种书中的名句。"),
  q("033.", 25, "狡兔死，走狗烹；高鸟尽，良弓藏", "史传名句", "《史记·淮阴侯列传》", "韩信引述的功臣见弃名句。"),
  q("038.", 89, "人之患在好为人师", "古典名句", "《孟子·离娄上》", "孟子关于好为人师的名句。"),
  q("038.", 89, "但开风气不为师", "诗句", "龚自珍语", "李敖借龚自珍句说明开风气而不做老师。"),
  q("040.", 41, "两个口袋空的人，这个腰挺不直", "西方格言", "富兰克林语", "富兰克林关于贫穷与尊严的格言。"),
  q("040.", 41, "一箪食一瓢饮", "古典名句", "《论语·雍也》", "颜回安贫乐道的名句片段。"),
  q("040.", 61, "春风又绿江南岸，明月何时照我还", "诗句", "王安石《泊船瓜洲》", "李敖借王安石诗说明炼字。"),
  q("040.", 61, "莫等闲、白了少年头，空悲切", "词句", "岳飞《满江红》", "李敖用岳飞词说明形容词作动词。"),
  q("040.", 61, "靖康耻，犹未雪", "词句", "岳飞《满江红》", "岳飞词句。"),
  q("040.", 61, "红了樱桃，绿了芭蕉", "词句", "蒋捷《一剪梅·舟过吴江》", "李敖用宋词说明形容词作动词。"),
  q("040.", 61, "临溪而渔，溪深而鱼肥，酿泉为酒，泉香而酒洌", "古文名句", "欧阳修《醉翁亭记》", "李敖借欧阳修炼句说明文字韵味。"),
  q("066.", 23, "人饥己饥", "成语", "后稷典故", "李敖在挽诗中化用悲天悯人的成语。"),
  q("070.", 5, "他们看不了多远，也看不了多深，可是谁能阻止对沧海凝神", "西方诗句", "罗伯特·弗罗斯特诗句", "李敖转述弗罗斯特关于凝视海洋的诗句。"),
  q("070.", 7, "不出户，知天下", "古典名句", "《老子》", "李敖以老子名句说明不出门也能知天下。"),
  q("070.", 7, "至小无内", "古典名句", "庄子哲学语", "古人描写极小的哲学语。"),
  q("070.", 7, "至大无外", "古典名句", "庄子哲学语", "古人描写极大的哲学语。"),
  q("070.", 11, "增一分太肥，减一分太瘦", "文学格言", "古典美人描写", "李敖用古典美人描写说明恰到好处的语言。"),
  q("070.", 11, "对好的文学家而言，没有同义字", "文学格言", "福楼拜语", "福楼拜关于精准用词的文学格言。"),
  q("070.", 11, "Et tu Brute？", "西方戏剧名句", "莎士比亚《凯撒》", "凯撒见布鲁塔斯参与刺杀时的名句。"),
  q("070.", 11, "还有你！布鲁塔斯", "翻译文句", "莎士比亚《凯撒》译句", "李敖认为更贴近情境的凯撒台词译法。"),
  q("070.", 83, "所有的先知在他的乡土都不被接受", "圣经典故", "耶稣语意", "李敖借耶稣典故说明先知在本乡不被接受。"),
  q("070.", 83, "能胜人之口，不能服人之心", "古典名句", "公孙龙子语", "李敖借公孙龙子说明辩论胜负与心服不同。"),
  q("070.", 83, "尊前作剧莫相笑，我死诸君思此狂", "诗句", "陆游诗句", "李敖引用陆游诗句自况。"),
  q("071.", 5, "著作等身", "成语", "中国成语", "李敖解释书写很多可以称为著作等身。"),
  q("071.", 39, "既然没有办法，让我们接吻来分离", "西方诗句", "拜伦诗句", "李敖转述拜伦关于分离的诗句。"),
  q("074.", 49, "一言可以兴邦，一言可以丧邦", "古典名句", "《论语·子路》", "孔子关于一句话可兴邦、丧邦的说法。"),
  q("075.", 99, "情人眼里的女人是最美的", "俗语", "中国俗语", "李敖用俗语说明审美因人而异。"),
  q("076.", 7, "吾爱孟夫子，风流天下闻。红颜弃轩冕，白首卧松云", "诗句", "李白《赠孟浩然》", "李敖借李白诗说明“风流”古义。"),
  q("076.", 7, "周郎顾曲", "成语典故", "周瑜典故", "周瑜善辨音乐的典故。"),
  q("084.", 53, "不孝有三，无后为大", "古典名句", "《孟子》", "李敖引用《孟子》说明古代重后嗣观念。"),
  q("084.", 53, "弄瓦", "典故", "《诗经·小雅·斯干》", "古代以弄瓦称生女的典故。"),
  q("084.", 53, "产男则相贺，产女则杀之", "古文名句", "《韩非子》", "李敖引用韩非子关于重男轻女的残酷古文句。"),
  q("084.", 53, "盗不过五女之门", "古代俗语", "汉代俗语", "李敖引用五女之家贫困到盗贼不入的俗语。"),
  q("086.", 75, "拔鹅毛拔得最多，而这个鹅叫的声音最少", "财政谚语", "西方财政学谚语", "李敖引用财政学中关于课税的谚语。"),
  q("092.", 41, "挽弓当挽强，用箭当用长。射人先射马，擒贼先擒王", "诗句", "杜甫《前出塞》", "李敖引用杜甫诗句说明直指要害。"),
  q("093.", 13, "不信青春唤不回，不容青史尽成灰。低回海上酬功宴，万里江山酒一杯", "诗", "于右任诗", "李敖引用于右任诗谈青春与青史。"),
  q("093.", 13, "留取丹心照汗青", "诗句", "文天祥《过零丁洋》", "李敖解释青史时引用文天祥诗句。"),
  q("094.", 97, "豺狼当道，安问狐狸", "古典成语", "古代成语", "李敖用古话说明大害当前时小害不急问。"),
  q("100.", 11, "舍己为人", "成语", "中国成语", "李敖从“舍己为人”改出节目题目“舍己拆人”。"),
  q("100.", 11, "子帅以正，孰敢不正", "古典名句", "《论语·颜渊》", "孔子关于上行下效的名句。"),
  q("105.", 55, "生公说法，顽石点头", "成语典故", "生公说法典故", "李敖以生公说法引出石滋宜继续说明。"),
  q("106.", 45, "阴平穷寇非难御，如此江山坐付人", "古诗句", "中国古诗", "李敖引用古诗批评坐失局势。"),
];

const proofreadBeforeRows = 65;
const proofreadRemovedRows = [
  ["LACL-007", "牵骆驼", "地方故事式短词，离开李敖解释后难以独立作为诗文格言；同段保留更稳定的西方谚语“骆驼背上最后一根草”即可。"],
  ["LACL-031", "顾曲周郎", "与后文“周郎顾曲”重复，保留更标准、检索价值更高的一条。"],
  ["LACL-051", "载寝之床", "《诗经》礼俗句残片，脱离“乃生男子，载寝之床”等上下文后过碎。"],
  ["LACL-056", "养子不教谁之过", "节目题目式改写，接近口语提问，不按稳定古话单独保留。"],
  ["LACL-064", "生公说法鬼神听", "源文只是提到刘禹锡诗题，非正文诗句；保留“生公说法，顽石点头”典故即可。"],
];
const proofreadChangedRows = [];

const modernPoliticalTerms = [
  "总统",
  "国民党",
  "共产党",
  "民进党",
  "新党",
  "亲民党",
  "李登辉",
  "陈水扁",
  "宋楚瑜",
  "连战",
  "蒋介石",
  "蒋经国",
  "毛泽东",
  "孙中山",
  "台独",
  "台湾独立",
  "中华人民共和国",
  "政府",
  "立法院",
  "监察院",
  "法院",
  "宪法",
  "选举",
  "竞选",
  "总统府",
  "政治犯",
  "军人干政",
  "中央日报",
];

function findQuoteLocation(row) {
  const source = sourceCache.get(row.source_file);
  const sourceLines = source.lines.slice(row.line_start - 1, row.line_end).join("\n");
  const normalizedSource = normalizeText(sourceLines);
  const normalizedQuote = normalizeText(row.quote_text);
  return {
    found: normalizedSource.includes(normalizedQuote),
    sourceSnippet: sourceLines,
    normalizedQuote,
  };
}

const rows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const auditRows = rows.map((row) => {
  const location = findQuoteLocation(row);
  const politicalHits = modernPoliticalTerms.filter((term) => row.quote_text.includes(term));
  return {
    id: row.id,
    book: row.book,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
    quote_text: row.quote_text,
    category: row.category,
    source_or_origin: row.source_or_origin,
    found_in_source: location.found ? "yes" : "no",
    political_hits: politicalHits.join("|"),
    notes: row.notes,
  };
});

const missing = auditRows.filter((row) => row.found_in_source !== "yes");
const politicalFlagged = auditRows.filter((row) => row.political_hits);

if (missing.length > 0) {
  const detail = missing.map((row) => `${row.id} ${row.source_file}:${row.line_start} ${row.quote_text}`).join("\n");
  throw new Error(`Some quote_text values were not found in source lines:\n${detail}`);
}

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

const csvEscape = (value) => {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function writeCsv(filePath, dataRows, dataColumns = columns) {
  const csv = [
    dataColumns.join(","),
    ...dataRows.map((row) => dataColumns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
  fs.writeFileSync(filePath, `${csv}\n`, "utf8");
}

function writeTsv(filePath, dataRows, dataColumns) {
  const tsv = [
    dataColumns.join("\t"),
    ...dataRows.map((row) => dataColumns.map((column) => String(row[column] ?? "").replace(/\r?\n/g, "\\n")).join("\t")),
  ].join("\n");
  fs.writeFileSync(filePath, `${tsv}\n`, "utf8");
}

function writeTxt(filePath, dataRows) {
  const lines = [
    `《${book}》诗文格言歌谣引用`,
    `生成日期：${generatedDate}`,
    `条目数：${dataRows.length}`,
    "",
  ];

  for (const row of dataRows) {
    lines.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
    lines.push(row.quote_text);
    lines.push(`出处/来源：${row.source_or_origin}`);
    lines.push(`说明：${row.summary}`);
    if (row.notes) lines.push(`备注：${row.notes}`);
    lines.push("");
  }

  fs.writeFileSync(filePath, `${lines.join("\n").trimEnd()}\n`, "utf8");
}

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(candidatesJson), { recursive: true });

writeCsv(outCsv, rows);
writeTxt(outTxt, rows);
fs.writeFileSync(candidatesJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
writeTsv(reviewTsv, rows, columns);
writeTsv(auditTsv, auditRows, [
  "id",
  "book",
  "source_file",
  "line_start",
  "line_end",
  "quote_text",
  "category",
  "source_or_origin",
  "found_in_source",
  "political_hits",
  "notes",
]);

const categoryCounts = new Map();
const byFileCounts = new Map();
for (const row of rows) {
  categoryCounts.set(row.category, (categoryCounts.get(row.category) || 0) + 1);
  byFileCounts.set(row.source_file, (byFileCounts.get(row.source_file) || 0) + 1);
}

const report = [
  `《${book}》诗文格言歌谣引用首轮/校对后报告`,
  `生成日期：${generatedDate}`,
  "",
  `源目录：${sourceDir}`,
  `源文件数：${files.length}`,
  `首轮原始收入：${proofreadBeforeRows}`,
  `校对删除：${proofreadRemovedRows.length}`,
  `校对后写出：${rows.length}`,
  `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
  `源文命中异常：${missing.length}`,
  `quote_text现代政治词命中：${politicalFlagged.length}`,
  "",
  "分类统计：",
  ...[...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([category, count]) => `- ${category}：${count}`),
  "",
  "筛选原则：",
  "- 只收可独立成立的诗、词、赋、经文、古文名句、成语俗语、西方格言、佛教文句。",
  "- 排除现代政治人物语录、党派口号、政论判断、文件宣言、诉讼与新闻转述。",
  "- 古典史传、经书中的文句如确为传统诗文格言范围，按古典来源保留，供校对轮再审边界。",
  "",
  "按文件分布：",
  ...Array.from(byFileCounts.entries()).map(([file, count]) => `- ${file}: ${count}`),
  "",
  `CSV：${outCsv}`,
  `TXT：${outTxt}`,
  `候选JSON：${candidatesJson}`,
  `审计TSV：${auditTsv}`,
].join("\n");

fs.writeFileSync(reportTxt, `${report}\n`, "utf8");

const proofreadAuditRows = [
  { action: "before", id: "", quote_text: "", reason: `校对前条目数：${proofreadBeforeRows}` },
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => ({
    action: "removed",
    id,
    quote_text: quoteText,
    reason,
  })),
  ...proofreadChangedRows.map(([id, quoteText, reason]) => ({
    action: "changed",
    id,
    quote_text: quoteText,
    reason,
  })),
  { action: "after", id: "", quote_text: "", reason: `校对后条目数：${rows.length}` },
];

writeTsv(proofreadAuditTsv, proofreadAuditRows, ["action", "id", "quote_text", "reason"]);

const proofreadReport = [
  `《${book}》校对轮报告`,
  `生成日期：${generatedDate}`,
  `校对前条目数：${proofreadBeforeRows}`,
  `删除条目数：${proofreadRemovedRows.length}`,
  "补入条目数：0",
  `修改条目数：${proofreadChangedRows.length}`,
  `校对后条目数：${rows.length}`,
  `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
  `现代政治词命中：${politicalFlagged.length}`,
  "",
  "校对处理：",
  "- 未发现需要因现代政治语录口径删除的 quote_text；本轮删除对象主要是短碎片、重复典故、题目式改写和诗题。",
  "- 明确作为诗句、古文名句、成语俗语、西方格言、佛教文句出现的条目继续保留。",
  "- 古典经史、古代军政文句和古代兴亡诗句不按现代政治语录处理；萧伯纳、富兰克林、福楼拜、弗罗斯特等非政治格言也继续保留。",
  "",
  "删除明细：",
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => `- ${id}｜${quoteText}：${reason}`),
  "",
  "按文件分布：",
  ...Array.from(byFileCounts.entries()).map(([file, count]) => `- ${file}: ${count}`),
].join("\n");

fs.writeFileSync(proofreadReportTxt, `${proofreadReport}\n`, "utf8");

console.log(JSON.stringify({
  book,
  rows: rows.length,
  outCsv,
  outTxt,
  reportTxt,
  auditTsv,
  proofreadReportTxt,
  proofreadAuditTsv,
  proofreadRemovedRows: proofreadRemovedRows.length,
  politicalFlagged: politicalFlagged.length,
}, null, 2));
